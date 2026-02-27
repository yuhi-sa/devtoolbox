"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("curl-input");
    var outputEl = document.getElementById("curl-output");
    var errorEl = document.getElementById("curl-error");
    var successEl = document.getElementById("curl-success");
    var btnConvert = document.getElementById("btn-convert");
    var btnSample = document.getElementById("btn-sample");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var langTabs = document.getElementById("lang-tabs");
    var currentLang = "python";
    var lastParsed = null;

    var sampleCurl = "curl -X POST https://api.example.com/users \\\n  -H 'Content-Type: application/json' \\\n  -H 'Authorization: Bearer token123' \\\n  -d '{\"name\": \"Taro\", \"email\": \"taro@example.com\"}'";

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      successEl.hidden = true;
    }

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      errorEl.hidden = true;
    }

    function clearMessages() {
      errorEl.hidden = true;
      successEl.hidden = true;
    }

    // --- cURL parser ---
    function tokenize(input) {
      var tokens = [];
      var i = 0;
      var len = input.length;
      while (i < len) {
        // skip whitespace
        if (/\s/.test(input[i])) {
          i++;
          continue;
        }
        // skip backslash-newline continuation
        if (input[i] === "\\" && i + 1 < len && (input[i + 1] === "\n" || input[i + 1] === "\r")) {
          i += 2;
          if (i < len && input[i] === "\n") i++;
          continue;
        }
        // quoted string
        if (input[i] === "'" || input[i] === '"') {
          var quote = input[i];
          var token = "";
          i++;
          while (i < len && input[i] !== quote) {
            if (input[i] === "\\" && quote === '"' && i + 1 < len) {
              i++;
              token += input[i];
            } else {
              token += input[i];
            }
            i++;
          }
          if (i < len) i++; // skip closing quote
          tokens.push(token);
          continue;
        }
        // $'...' ANSI-C quoting
        if (input[i] === "$" && i + 1 < len && input[i + 1] === "'") {
          i += 2;
          var token = "";
          while (i < len && input[i] !== "'") {
            if (input[i] === "\\" && i + 1 < len) {
              i++;
              if (input[i] === "n") token += "\n";
              else if (input[i] === "t") token += "\t";
              else if (input[i] === "r") token += "\r";
              else if (input[i] === "\\") token += "\\";
              else if (input[i] === "'") token += "'";
              else token += input[i];
            } else {
              token += input[i];
            }
            i++;
          }
          if (i < len) i++;
          tokens.push(token);
          continue;
        }
        // unquoted token
        var token = "";
        while (i < len && !/\s/.test(input[i])) {
          if (input[i] === "\\" && i + 1 < len) {
            i++;
            token += input[i];
          } else {
            token += input[i];
          }
          i++;
        }
        tokens.push(token);
      }
      return tokens;
    }

    function parseCurl(input) {
      var normalized = input.trim();
      if (!normalized) return null;

      var tokens = tokenize(normalized);
      if (tokens.length === 0) return null;

      // skip 'curl' if first token
      var start = 0;
      if (tokens[0].toLowerCase() === "curl") start = 1;

      var result = {
        method: "",
        url: "",
        headers: {},
        data: "",
        user: "",
        cookies: "",
        followRedirects: false,
        insecure: false,
        formData: []
      };

      var i = start;
      while (i < tokens.length) {
        var t = tokens[i];

        if (t === "-X" || t === "--request") {
          i++;
          if (i < tokens.length) result.method = tokens[i].toUpperCase();
        } else if (t === "-H" || t === "--header") {
          i++;
          if (i < tokens.length) {
            var hdr = tokens[i];
            var colonIdx = hdr.indexOf(":");
            if (colonIdx !== -1) {
              var key = hdr.substring(0, colonIdx).trim();
              var val = hdr.substring(colonIdx + 1).trim();
              result.headers[key] = val;
            }
          }
        } else if (t === "-d" || t === "--data" || t === "--data-raw" || t === "--data-binary" || t === "--data-ascii") {
          i++;
          if (i < tokens.length) result.data = tokens[i];
        } else if (t === "-u" || t === "--user") {
          i++;
          if (i < tokens.length) result.user = tokens[i];
        } else if (t === "-b" || t === "--cookie") {
          i++;
          if (i < tokens.length) result.cookies = tokens[i];
        } else if (t === "-L" || t === "--location") {
          result.followRedirects = true;
        } else if (t === "-k" || t === "--insecure") {
          result.insecure = true;
        } else if (t === "-F" || t === "--form") {
          i++;
          if (i < tokens.length) result.formData.push(tokens[i]);
        } else if (t.indexOf("-") === 0 && t.length === 2 && "XHdubFkL".indexOf(t[1]) === -1) {
          // unknown single-char flag, skip if it has a next value that looks like a param
          // just ignore unknown flags
        } else if (t.indexOf("--") === 0) {
          // unknown long flag with possible value — skip
          if (i + 1 < tokens.length && tokens[i + 1].indexOf("-") !== 0) {
            i++;
          }
        } else if (!result.url && (t.indexOf("http://") === 0 || t.indexOf("https://") === 0 || t.indexOf("HTTP://") === 0 || t.indexOf("HTTPS://") === 0)) {
          result.url = t;
        } else if (!result.url && t.indexOf("-") !== 0) {
          result.url = t;
        }
        i++;
      }

      if (!result.url) return null;

      // infer method
      if (!result.method) {
        if (result.data || result.formData.length > 0) {
          result.method = "POST";
        } else {
          result.method = "GET";
        }
      }

      return result;
    }

    // --- Code generators ---
    function escStr(s, quote) {
      if (quote === "'") return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    }

    function generatePython(p) {
      var lines = [];
      lines.push("import requests");
      if (p.insecure) lines.push("import urllib3");
      lines.push("");
      if (p.insecure) {
        lines.push("urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)");
        lines.push("");
      }

      lines.push('url = "' + escStr(p.url, '"') + '"');

      var headerKeys = Object.keys(p.headers);
      if (headerKeys.length > 0) {
        lines.push("headers = {");
        for (var h = 0; h < headerKeys.length; h++) {
          var comma = h < headerKeys.length - 1 ? "," : "";
          lines.push('    "' + escStr(headerKeys[h], '"') + '": "' + escStr(p.headers[headerKeys[h]], '"') + '"' + comma);
        }
        lines.push("}");
      }

      if (p.cookies) {
        lines.push("cookies = {");
        var pairs = p.cookies.split(";");
        for (var c = 0; c < pairs.length; c++) {
          var eqIdx = pairs[c].indexOf("=");
          if (eqIdx !== -1) {
            var ck = pairs[c].substring(0, eqIdx).trim();
            var cv = pairs[c].substring(eqIdx + 1).trim();
            var comma = c < pairs.length - 1 ? "," : "";
            lines.push('    "' + escStr(ck, '"') + '": "' + escStr(cv, '"') + '"' + comma);
          }
        }
        lines.push("}");
      }

      if (p.user) {
        var parts = p.user.split(":");
        var username = parts[0] || "";
        var password = parts.slice(1).join(":") || "";
        lines.push('auth = ("' + escStr(username, '"') + '", "' + escStr(password, '"') + '")');
      }

      if (p.data) {
        lines.push('data = \'' + escStr(p.data, "'") + "'");
      }

      if (p.formData.length > 0) {
        lines.push("files = {");
        for (var f = 0; f < p.formData.length; f++) {
          var eqIdx = p.formData[f].indexOf("=");
          if (eqIdx !== -1) {
            var fk = p.formData[f].substring(0, eqIdx);
            var fv = p.formData[f].substring(eqIdx + 1);
            var comma = f < p.formData.length - 1 ? "," : "";
            if (fv.indexOf("@") === 0) {
              lines.push('    "' + escStr(fk, '"') + '": open("' + escStr(fv.substring(1), '"') + '", "rb")' + comma);
            } else {
              lines.push('    "' + escStr(fk, '"') + '": (None, "' + escStr(fv, '"') + '")' + comma);
            }
          }
        }
        lines.push("}");
      }

      lines.push("");
      var method = p.method.toLowerCase();
      var args = ["url"];
      if (headerKeys.length > 0) args.push("headers=headers");
      if (p.data) args.push("data=data");
      if (p.formData.length > 0) args.push("files=files");
      if (p.cookies) args.push("cookies=cookies");
      if (p.user) args.push("auth=auth");
      if (p.insecure) args.push("verify=False");
      if (p.followRedirects === false && p.method !== "GET") args.push("allow_redirects=False");

      lines.push("response = requests." + method + "(" + args.join(", ") + ")");
      lines.push("print(response.status_code)");
      lines.push("print(response.text)");

      return lines.join("\n");
    }

    function generateFetch(p) {
      var lines = [];
      var hasHeaders = Object.keys(p.headers).length > 0;
      var hasBody = !!p.data;
      var needsOptions = p.method !== "GET" || hasHeaders || hasBody || p.user;

      if (p.user) {
        var parts = p.user.split(":");
        var username = parts[0] || "";
        var password = parts.slice(1).join(":") || "";
        lines.push('const credentials = btoa("' + escStr(username, '"') + ":" + escStr(password, '"') + '");');
        lines.push("");
      }

      if (needsOptions) {
        lines.push("const options = {");
        lines.push('  method: "' + p.method + '",');
        if (hasHeaders || p.user) {
          lines.push("  headers: {");
          var headerKeys = Object.keys(p.headers);
          for (var h = 0; h < headerKeys.length; h++) {
            lines.push('    "' + escStr(headerKeys[h], '"') + '": "' + escStr(p.headers[headerKeys[h]], '"') + '",');
          }
          if (p.user) {
            lines.push('    "Authorization": `Basic ${credentials}`,');
          }
          lines.push("  },");
        }
        if (hasBody) {
          lines.push("  body: '" + escStr(p.data, "'") + "',");
        }
        if (p.followRedirects === false) {
          lines.push('  redirect: "manual",');
        }
        lines.push("};");
        lines.push("");
      }

      var fetchArgs = '"' + escStr(p.url, '"') + '"';
      if (needsOptions) fetchArgs += ", options";

      lines.push("fetch(" + fetchArgs + ")");
      lines.push("  .then(response => response.json())");
      lines.push("  .then(data => console.log(data))");
      lines.push('  .catch(error => console.error("Error:", error));');

      return lines.join("\n");
    }

    function generateAxios(p) {
      var lines = [];
      lines.push("const axios = require('axios');");
      lines.push("");

      var headerKeys = Object.keys(p.headers);
      var configParts = [];

      configParts.push('  method: "' + p.method.toLowerCase() + '"');
      configParts.push('  url: "' + escStr(p.url, '"') + '"');

      if (headerKeys.length > 0) {
        var hdrs = [];
        for (var h = 0; h < headerKeys.length; h++) {
          hdrs.push('    "' + escStr(headerKeys[h], '"') + '": "' + escStr(p.headers[headerKeys[h]], '"') + '"');
        }
        configParts.push("  headers: {\n" + hdrs.join(",\n") + "\n  }");
      }

      if (p.data) {
        configParts.push("  data: '" + escStr(p.data, "'") + "'");
      }

      if (p.user) {
        var parts = p.user.split(":");
        var username = parts[0] || "";
        var password = parts.slice(1).join(":") || "";
        configParts.push('  auth: {\n    username: "' + escStr(username, '"') + '",\n    password: "' + escStr(password, '"') + '"\n  }');
      }

      if (p.followRedirects === false) {
        configParts.push("  maxRedirects: 0");
      }

      if (p.insecure) {
        lines.splice(1, 0, "const https = require('https');");
        configParts.push("  httpsAgent: new https.Agent({ rejectUnauthorized: false })");
      }

      lines.push("axios({");
      lines.push(configParts.join(",\n"));
      lines.push("})");
      lines.push("  .then(response => {");
      lines.push("    console.log(response.data);");
      lines.push("  })");
      lines.push("  .catch(error => {");
      lines.push("    console.error(error);");
      lines.push("  });");

      return lines.join("\n");
    }

    function generatePhp(p) {
      var lines = [];
      lines.push("<?php");
      lines.push("$ch = curl_init();");
      lines.push("");
      lines.push('curl_setopt($ch, CURLOPT_URL, "' + escStr(p.url, '"') + '");');
      lines.push("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);");

      if (p.method !== "GET") {
        lines.push('curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "' + p.method + '");');
      }

      var headerKeys = Object.keys(p.headers);
      if (headerKeys.length > 0) {
        lines.push("curl_setopt($ch, CURLOPT_HTTPHEADER, [");
        for (var h = 0; h < headerKeys.length; h++) {
          var comma = h < headerKeys.length - 1 ? "," : "";
          lines.push('    "' + escStr(headerKeys[h], '"') + ": " + escStr(p.headers[headerKeys[h]], '"') + '"' + comma);
        }
        lines.push("]);");
      }

      if (p.data) {
        lines.push('curl_setopt($ch, CURLOPT_POSTFIELDS, \'' + escStr(p.data, "'") + "');");
      }

      if (p.user) {
        lines.push('curl_setopt($ch, CURLOPT_USERPWD, "' + escStr(p.user, '"') + '");');
      }

      if (p.cookies) {
        lines.push('curl_setopt($ch, CURLOPT_COOKIE, "' + escStr(p.cookies, '"') + '");');
      }

      if (p.followRedirects) {
        lines.push("curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);");
      }

      if (p.insecure) {
        lines.push("curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);");
        lines.push("curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);");
      }

      if (p.formData.length > 0) {
        lines.push("$postFields = [");
        for (var f = 0; f < p.formData.length; f++) {
          var eqIdx = p.formData[f].indexOf("=");
          if (eqIdx !== -1) {
            var fk = p.formData[f].substring(0, eqIdx);
            var fv = p.formData[f].substring(eqIdx + 1);
            var comma = f < p.formData.length - 1 ? "," : "";
            if (fv.indexOf("@") === 0) {
              lines.push('    "' + escStr(fk, '"') + '" => new CURLFile("' + escStr(fv.substring(1), '"') + '")' + comma);
            } else {
              lines.push('    "' + escStr(fk, '"') + '" => "' + escStr(fv, '"') + '"' + comma);
            }
          }
        }
        lines.push("];");
        lines.push("curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);");
      }

      lines.push("");
      lines.push("$response = curl_exec($ch);");
      lines.push("$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);");
      lines.push("curl_close($ch);");
      lines.push("");
      lines.push('echo "HTTP Status: " . $httpCode . "\\n";');
      lines.push("echo $response;");

      return lines.join("\n");
    }

    function generateGo(p) {
      var lines = [];
      var imports = ['"fmt"', '"io/ioutil"', '"net/http"'];
      var needsStrings = false;
      var needsBytes = !!p.data || p.formData.length > 0;
      var needsCrypto = false;
      var needsTls = p.insecure;

      if (needsBytes) imports.push('"bytes"');
      if (p.data) imports.push('"strings"');
      if (p.user) {
        imports.push('"encoding/base64"');
        needsCrypto = false;
      }
      if (needsTls) imports.push('"crypto/tls"');

      lines.push("package main");
      lines.push("");
      lines.push("import (");
      // deduplicate and sort
      var uniqueImports = [];
      for (var im = 0; im < imports.length; im++) {
        if (uniqueImports.indexOf(imports[im]) === -1) uniqueImports.push(imports[im]);
      }
      uniqueImports.sort();
      for (var im = 0; im < uniqueImports.length; im++) {
        lines.push("\t" + uniqueImports[im]);
      }
      lines.push(")");
      lines.push("");
      lines.push("func main() {");

      if (p.data) {
        lines.push('\tbody := strings.NewReader(`' + p.data + '`)');
      } else {
        lines.push("\tvar body *bytes.Reader = nil");
        lines.push("\t_ = body");
      }

      lines.push("");

      if (p.data) {
        lines.push('\treq, err := http.NewRequest("' + p.method + '", "' + escStr(p.url, '"') + '", body)');
      } else {
        lines.push('\treq, err := http.NewRequest("' + p.method + '", "' + escStr(p.url, '"') + '", nil)');
      }

      lines.push("\tif err != nil {");
      lines.push("\t\tfmt.Println(err)");
      lines.push("\t\treturn");
      lines.push("\t}");

      var headerKeys = Object.keys(p.headers);
      for (var h = 0; h < headerKeys.length; h++) {
        lines.push('\treq.Header.Set("' + escStr(headerKeys[h], '"') + '", "' + escStr(p.headers[headerKeys[h]], '"') + '")');
      }

      if (p.user) {
        var parts = p.user.split(":");
        var username = parts[0] || "";
        var password = parts.slice(1).join(":") || "";
        lines.push('\tcredentials := base64.StdEncoding.EncodeToString([]byte("' + escStr(username, '"') + ":" + escStr(password, '"') + '"))');
        lines.push('\treq.Header.Set("Authorization", "Basic "+credentials)');
      }

      if (p.cookies) {
        lines.push('\treq.Header.Set("Cookie", "' + escStr(p.cookies, '"') + '")');
      }

      lines.push("");

      if (p.insecure) {
        lines.push("\tclient := &http.Client{");
        lines.push("\t\tTransport: &http.Transport{");
        lines.push("\t\t\tTLSClientConfig: &tls.Config{InsecureSkipVerify: true},");
        lines.push("\t\t},");
        lines.push("\t}");
      } else if (!p.followRedirects) {
        lines.push("\tclient := &http.Client{");
        lines.push("\t\tCheckRedirect: func(req *http.Request, via []*http.Request) error {");
        lines.push("\t\t\treturn http.ErrUseLastResponse");
        lines.push("\t\t},");
        lines.push("\t}");
      } else {
        lines.push("\tclient := &http.Client{}");
      }

      lines.push("\tresp, err := client.Do(req)");
      lines.push("\tif err != nil {");
      lines.push("\t\tfmt.Println(err)");
      lines.push("\t\treturn");
      lines.push("\t}");
      lines.push("\tdefer resp.Body.Close()");
      lines.push("");
      lines.push("\trespBody, err := ioutil.ReadAll(resp.Body)");
      lines.push("\tif err != nil {");
      lines.push("\t\tfmt.Println(err)");
      lines.push("\t\treturn");
      lines.push("\t}");
      lines.push("");
      lines.push('\tfmt.Println("Status:", resp.StatusCode)');
      lines.push("\tfmt.Println(string(respBody))");
      lines.push("}");

      return lines.join("\n");
    }

    function generate(lang, parsed) {
      if (!parsed) return "";
      switch (lang) {
        case "python": return generatePython(parsed);
        case "fetch": return generateFetch(parsed);
        case "axios": return generateAxios(parsed);
        case "php": return generatePhp(parsed);
        case "go": return generateGo(parsed);
        default: return "";
      }
    }

    function convert() {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("cURLコマンドを入力してください。");
        outputEl.value = "";
        lastParsed = null;
        return;
      }
      var parsed = parseCurl(input);
      if (!parsed) {
        showError("cURLコマンドを正しく解析できませんでした。URLが含まれているか確認してください。");
        outputEl.value = "";
        lastParsed = null;
        return;
      }
      lastParsed = parsed;
      outputEl.value = generate(currentLang, parsed);
      showSuccess("変換が完了しました。（" + currentLang + "）");
    }

    // Tab switching
    langTabs.addEventListener("click", function (e) {
      var tab = e.target.closest("[data-lang]");
      if (!tab) return;
      var allTabs = langTabs.querySelectorAll("[data-lang]");
      for (var t = 0; t < allTabs.length; t++) {
        allTabs[t].classList.remove("tab-group__tab--active");
      }
      tab.classList.add("tab-group__tab--active");
      currentLang = tab.getAttribute("data-lang");
      if (lastParsed) {
        outputEl.value = generate(currentLang, lastParsed);
        showSuccess("変換が完了しました。（" + currentLang + "）");
      }
    });

    btnConvert.addEventListener("click", convert);

    btnSample.addEventListener("click", function () {
      inputEl.value = sampleCurl;
      convert();
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      outputEl.value = "";
      lastParsed = null;
      clearMessages();
    });

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });
  });
})();
