"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("openapi-input");
    var errorEl = document.getElementById("openapi-error");
    var successEl = document.getElementById("openapi-success");
    var endpointListEl = document.getElementById("endpoint-list");
    var endpointSelect = document.getElementById("endpoint-select");
    var sampleOutput = document.getElementById("sample-output");
    var btnValidate = document.getElementById("btn-validate");
    var btnTemplate = document.getElementById("btn-template");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var btnGenerateSample = document.getElementById("btn-generate-sample");
    var btnTabEditor = document.getElementById("btn-tab-editor");
    var btnTabVisual = document.getElementById("btn-tab-visual");
    var btnTabSample = document.getElementById("btn-tab-sample");
    var panelEditor = document.getElementById("panel-editor");
    var panelVisual = document.getElementById("panel-visual");
    var panelSample = document.getElementById("panel-sample");

    var parsedSpec = null;

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

    // Tab switching
    function switchTab(tab) {
      panelEditor.hidden = tab !== "editor";
      panelVisual.hidden = tab !== "visual";
      panelSample.hidden = tab !== "sample";
      btnTabEditor.className = tab === "editor" ? "btn btn--primary" : "btn btn--secondary";
      btnTabVisual.className = tab === "visual" ? "btn btn--primary" : "btn btn--secondary";
      btnTabSample.className = tab === "sample" ? "btn btn--primary" : "btn btn--secondary";
    }

    btnTabEditor.addEventListener("click", function () { switchTab("editor"); });
    btnTabVisual.addEventListener("click", function () { switchTab("visual"); });
    btnTabSample.addEventListener("click", function () { switchTab("sample"); });

    // Simplified YAML parser for basic OpenAPI spec extraction (paths, methods, info).
    // This is NOT a general-purpose YAML parser. It does not handle:
    // - Multi-document YAML, flow syntax ({}, [])
    // - Complex nested arrays with multiple key:value pairs per item
    // - Anchors, aliases, tags
    // For JSON-format specs, JSON.parse() is used instead (see parseInput).
    function parseYAML(text) {
      var result = {};
      var stack = [{ obj: result, indent: -1 }];
      var lines = text.split("\n");
      var currentArray = null;

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var trimmed = line.replace(/\r$/, "");
        if (trimmed.trim() === "" || trimmed.trim().charAt(0) === "#") continue;

        var indentMatch = trimmed.match(/^(\s*)/);
        var indent = indentMatch ? indentMatch[1].length : 0;
        var content = trimmed.trim();

        // Array item
        if (content.charAt(0) === "-") {
          var arrayContent = content.substring(1).trim();
          if (currentArray) {
            if (arrayContent.indexOf(":") !== -1) {
              var ak = arrayContent.substring(0, arrayContent.indexOf(":")).trim();
              var av = arrayContent.substring(arrayContent.indexOf(":") + 1).trim();
              var arrObj = {};
              arrObj[ak] = cleanValue(av);
              currentArray.push(arrObj);
            } else {
              currentArray.push(cleanValue(arrayContent));
            }
          }
          continue;
        }

        currentArray = null;

        var colonIdx = content.indexOf(":");
        if (colonIdx === -1) continue;

        var key = content.substring(0, colonIdx).trim();
        var value = content.substring(colonIdx + 1).trim();

        // Pop stack to find parent
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
          stack.pop();
        }

        var parent = stack[stack.length - 1].obj;

        if (value === "" || value === "|" || value === ">") {
          // Nested object or block scalar
          if (value === "|" || value === ">") {
            // Collect block scalar
            var blockLines = [];
            var baseIndent = -1;
            for (var j = i + 1; j < lines.length; j++) {
              var bl = lines[j].replace(/\r$/, "");
              if (bl.trim() === "") { blockLines.push(""); continue; }
              var bi = bl.match(/^(\s*)/)[1].length;
              if (baseIndent === -1) baseIndent = bi;
              if (bi < baseIndent) break;
              blockLines.push(bl.substring(baseIndent));
              i = j;
            }
            parent[key] = blockLines.join("\n").trim();
          } else {
            var child = {};
            parent[key] = child;
            stack.push({ obj: child, indent: indent });
          }
        } else {
          // Check if next line starts an array
          if (i + 1 < lines.length) {
            var nextLine = lines[i + 1].replace(/\r$/, "").trim();
            if (nextLine.charAt(0) === "-") {
              var arr = [];
              parent[key] = arr;
              currentArray = arr;
              continue;
            }
          }
          parent[key] = cleanValue(value);
        }
      }

      return result;
    }

    function cleanValue(val) {
      if (val === "true") return true;
      if (val === "false") return false;
      if (val === "null") return null;
      // Remove quotes
      if ((val.charAt(0) === "'" && val.charAt(val.length - 1) === "'") ||
          (val.charAt(0) === '"' && val.charAt(val.length - 1) === '"')) {
        return val.substring(1, val.length - 1);
      }
      if (/^-?\d+(\.\d+)?$/.test(val)) return parseFloat(val);
      return val;
    }

    function parseInput(text) {
      text = text.trim();
      if (!text) return null;

      // Try JSON first
      if (text.charAt(0) === "{") {
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error("JSON解析エラー: " + e.message);
        }
      }

      // Try YAML
      try {
        return parseYAML(text);
      } catch (e) {
        throw new Error("YAML解析エラー: " + e.message);
      }
    }

    function validateSpec(spec) {
      var errors = [];
      if (!spec.openapi) {
        errors.push("必須フィールド 'openapi' がありません。");
      } else if (typeof spec.openapi === "string" && spec.openapi.indexOf("3.") !== 0) {
        errors.push("'openapi' フィールドは '3.x.x' 形式である必要があります（現在: " + spec.openapi + "）。");
      }

      if (!spec.info) {
        errors.push("必須フィールド 'info' がありません。");
      } else {
        if (!spec.info.title) errors.push("'info.title' が必要です。");
        if (!spec.info.version) errors.push("'info.version' が必要です。");
      }

      if (!spec.paths) {
        errors.push("必須フィールド 'paths' がありません。");
      }

      return errors;
    }

    var methodColors = {
      get: "#28a745",
      post: "#007bff",
      put: "#fd7e14",
      delete: "#dc3545",
      patch: "#6f42c1",
      head: "#6c757d",
      options: "#17a2b8"
    };

    function extractEndpoints(spec) {
      var endpoints = [];
      if (!spec.paths) return endpoints;

      var paths = spec.paths;
      for (var path in paths) {
        if (!paths.hasOwnProperty(path)) continue;
        var methods = paths[path];
        for (var method in methods) {
          if (!methods.hasOwnProperty(method)) continue;
          var m = method.toLowerCase();
          if (["get", "post", "put", "delete", "patch", "head", "options"].indexOf(m) === -1) continue;
          var info = methods[method] || {};
          endpoints.push({
            path: path,
            method: m,
            summary: info.summary || info.description || "",
            operation: info
          });
        }
      }
      return endpoints;
    }

    function renderEndpoints(endpoints) {
      if (endpoints.length === 0) {
        endpointListEl.innerHTML = '<p style="color: var(--color-text-secondary, #666);">エンドポイントが見つかりません。</p>';
        return;
      }

      var html = "";
      for (var i = 0; i < endpoints.length; i++) {
        var ep = endpoints[i];
        var color = methodColors[ep.method] || "#6c757d";
        html += '<div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--color-border, #eee);">';
        html += '<span style="display: inline-block; min-width: 70px; text-align: center; padding: 0.25rem 0.5rem; border-radius: 4px; color: #fff; font-weight: bold; font-size: 0.8rem; background-color: ' + color + ';">' + ep.method.toUpperCase() + '</span>';
        html += '<code style="font-weight: 600;">' + escapeHtml(ep.path) + '</code>';
        if (ep.summary) {
          html += '<span style="color: var(--color-text-secondary, #666); font-size: 0.9rem;">' + escapeHtml(ep.summary) + '</span>';
        }
        html += '</div>';
      }
      endpointListEl.innerHTML = html;
    }

    function populateSelect(endpoints) {
      endpointSelect.innerHTML = '<option value="">-- エンドポイントを選択 --</option>';
      for (var i = 0; i < endpoints.length; i++) {
        var ep = endpoints[i];
        var opt = document.createElement("option");
        opt.value = i;
        opt.textContent = ep.method.toUpperCase() + " " + ep.path;
        endpointSelect.appendChild(opt);
      }
    }

    function generateSample(endpoint) {
      var lines = [];
      lines.push(endpoint.method.toUpperCase() + " " + endpoint.path + " HTTP/1.1");
      lines.push("Host: api.example.com");
      lines.push("Accept: application/json");

      if (["post", "put", "patch"].indexOf(endpoint.method) !== -1) {
        lines.push("Content-Type: application/json");
        lines.push("");
        var body = {};
        var op = endpoint.operation;
        if (op && op.requestBody && op.requestBody.content) {
          var content = op.requestBody.content;
          var schema = null;
          if (content["application/json"] && content["application/json"].schema) {
            schema = content["application/json"].schema;
          }
          if (schema && schema.properties) {
            for (var prop in schema.properties) {
              if (!schema.properties.hasOwnProperty(prop)) continue;
              var pType = schema.properties[prop].type || "string";
              if (pType === "string") body[prop] = "example";
              else if (pType === "number" || pType === "integer") body[prop] = 0;
              else if (pType === "boolean") body[prop] = true;
              else if (pType === "array") body[prop] = [];
              else if (pType === "object") body[prop] = {};
              else body[prop] = "example";
            }
          } else {
            body.key = "value";
          }
        } else {
          body.key = "value";
        }
        lines.push(JSON.stringify(body, null, 2));
      } else {
        lines.push("");
      }

      return lines.join("\n");
    }

    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    var template = 'openapi: "3.0.0"\n' +
      'info:\n' +
      '  title: Sample API\n' +
      '  description: A sample API specification\n' +
      '  version: "1.0.0"\n' +
      'servers:\n' +
      '  - url: https://api.example.com/v1\n' +
      'paths:\n' +
      '  /users:\n' +
      '    get:\n' +
      '      summary: Get all users\n' +
      '      description: Returns a list of users\n' +
      '    post:\n' +
      '      summary: Create a user\n' +
      '      description: Creates a new user\n' +
      '  /users/{id}:\n' +
      '    get:\n' +
      '      summary: Get user by ID\n' +
      '      description: Returns a single user\n' +
      '    put:\n' +
      '      summary: Update user\n' +
      '      description: Updates an existing user\n' +
      '    delete:\n' +
      '      summary: Delete user\n' +
      '      description: Deletes a user';

    var cachedEndpoints = [];

    btnValidate.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("OpenAPI仕様を入力してください。");
        return;
      }
      try {
        parsedSpec = parseInput(input);
      } catch (e) {
        showError(e.message);
        return;
      }
      if (!parsedSpec) {
        showError("入力を解析できませんでした。");
        return;
      }

      var errors = validateSpec(parsedSpec);
      if (errors.length > 0) {
        showError("検証エラー:\n" + errors.join("\n"));
        return;
      }

      cachedEndpoints = extractEndpoints(parsedSpec);
      renderEndpoints(cachedEndpoints);
      populateSelect(cachedEndpoints);
      showSuccess("有効なOpenAPI 3.0仕様です。エンドポイント数: " + cachedEndpoints.length);
    });

    btnTemplate.addEventListener("click", function () {
      inputEl.value = template;
      clearMessages();
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      sampleOutput.value = "";
      endpointListEl.innerHTML = '<p style="color: var(--color-text-secondary, #666);">エディタータブでOpenAPI仕様を入力し「検証」を実行してください。</p>';
      endpointSelect.innerHTML = '<option value="">-- エンドポイントを選択 --</option>';
      parsedSpec = null;
      cachedEndpoints = [];
      clearMessages();
    });

    btnGenerateSample.addEventListener("click", function () {
      var idx = endpointSelect.value;
      if (idx === "" || !cachedEndpoints[idx]) {
        sampleOutput.value = "";
        return;
      }
      sampleOutput.value = generateSample(cachedEndpoints[parseInt(idx, 10)]);
    });

    btnCopy.addEventListener("click", function () {
      var text = sampleOutput.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });
  });
})();
