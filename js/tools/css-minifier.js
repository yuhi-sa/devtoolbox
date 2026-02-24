"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("css-input");
    var outputEl = document.getElementById("css-output");
    var errorEl = document.getElementById("css-error");
    var successEl = document.getElementById("css-success");
    var statsEl = document.getElementById("css-stats");
    var btnMinify = document.getElementById("btn-minify");
    var btnBeautify = document.getElementById("btn-beautify");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      successEl.hidden = true;
      statsEl.hidden = true;
    }

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      errorEl.hidden = true;
    }

    function showStats(original, result) {
      var originalSize = new Blob([original]).size;
      var resultSize = new Blob([result]).size;
      var reduction = originalSize > 0 ? ((1 - resultSize / originalSize) * 100).toFixed(1) : 0;
      statsEl.textContent = "元サイズ: " + originalSize + " bytes → 圧縮後: " + resultSize + " bytes（" + reduction + "% 削減）";
      statsEl.hidden = false;
    }

    function clearMessages() {
      errorEl.hidden = true;
      successEl.hidden = true;
      statsEl.hidden = true;
    }

    // Tokenizer-based CSS minifier that safely handles strings, url(), calc(), comments
    function tokenizeCSS(css) {
      var tokens = [];
      var i = 0;
      var len = css.length;

      while (i < len) {
        var ch = css[i];

        // Comments
        if (ch === "/" && i + 1 < len && css[i + 1] === "*") {
          var end = css.indexOf("*/", i + 2);
          if (end === -1) end = len - 2;
          tokens.push({ type: "comment", value: css.substring(i, end + 2) });
          i = end + 2;
          continue;
        }

        // String literals (single or double quote)
        if (ch === '"' || ch === "'") {
          var quote = ch;
          var str = ch;
          i++;
          while (i < len) {
            if (css[i] === "\\") {
              str += css[i] + (i + 1 < len ? css[i + 1] : "");
              i += 2;
              continue;
            }
            str += css[i];
            if (css[i] === quote) { i++; break; }
            i++;
          }
          tokens.push({ type: "string", value: str });
          continue;
        }

        // url() - preserve contents
        if (ch === "u" && css.substring(i, i + 4) === "url(") {
          var urlStr = "url(";
          i += 4;
          // Skip whitespace after url(
          while (i < len && (css[i] === " " || css[i] === "\t")) i++;
          if (i < len && (css[i] === '"' || css[i] === "'")) {
            var q = css[i];
            urlStr += q;
            i++;
            while (i < len && css[i] !== q) {
              if (css[i] === "\\") {
                urlStr += css[i] + (i + 1 < len ? css[i + 1] : "");
                i += 2;
                continue;
              }
              urlStr += css[i];
              i++;
            }
            if (i < len) { urlStr += css[i]; i++; }
          } else {
            while (i < len && css[i] !== ")") {
              urlStr += css[i];
              i++;
            }
          }
          // Skip whitespace before )
          while (i < len && (css[i] === " " || css[i] === "\t")) i++;
          if (i < len && css[i] === ")") { urlStr += ")"; i++; }
          tokens.push({ type: "url", value: urlStr });
          continue;
        }

        // calc(), var(), min(), max(), clamp() - preserve internal whitespace
        if (/[a-zA-Z]/.test(ch)) {
          var funcMatch = css.substring(i).match(/^([a-zA-Z-]+)\(/);
          if (funcMatch) {
            var funcName = funcMatch[1].toLowerCase();
            var preserveFuncs = ["calc", "var", "min", "max", "clamp", "env"];
            if (preserveFuncs.indexOf(funcName) !== -1) {
              var funcStr = funcMatch[0];
              var depth = 1;
              var fi = i + funcMatch[0].length;
              while (fi < len && depth > 0) {
                if (css[fi] === "(") depth++;
                else if (css[fi] === ")") depth--;
                if (depth > 0) funcStr += css[fi];
                fi++;
              }
              funcStr += ")";
              tokens.push({ type: "func", value: funcStr });
              i = fi;
              continue;
            }
          }
        }

        // Whitespace
        if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
          var ws = "";
          while (i < len && (css[i] === " " || css[i] === "\t" || css[i] === "\n" || css[i] === "\r")) {
            ws += css[i];
            i++;
          }
          tokens.push({ type: "whitespace", value: ws });
          continue;
        }

        // Punctuation and other characters
        tokens.push({ type: "char", value: ch });
        i++;
      }

      return tokens;
    }

    function minifyCSS(css) {
      var tokens = tokenizeCSS(css);
      var result = "";
      var prevType = "";
      var prevChar = "";

      for (var t = 0; t < tokens.length; t++) {
        var token = tokens[t];

        if (token.type === "comment") {
          // Remove comments
          continue;
        }

        if (token.type === "string" || token.type === "url" || token.type === "func") {
          // Preserve strings, url() and calc()/var() as-is
          result += token.value;
          prevType = token.type;
          prevChar = token.value[token.value.length - 1];
          continue;
        }

        if (token.type === "whitespace") {
          // Determine if whitespace is needed
          var nextToken = null;
          for (var nt = t + 1; nt < tokens.length; nt++) {
            if (tokens[nt].type !== "comment") { nextToken = tokens[nt]; break; }
          }
          if (!nextToken) continue;

          var nextFirst = nextToken.value[0];
          // Need space between identifiers/numbers (e.g., "10px solid", "sans serif")
          if (/[a-zA-Z0-9_\-%]/.test(prevChar) && /[a-zA-Z0-9_#.\-%]/.test(nextFirst)) {
            result += " ";
          }
          prevType = "whitespace";
          continue;
        }

        // Regular character
        var ch = token.value;

        // Remove space before/after certain characters
        if (";{}:,>~+".indexOf(ch) !== -1) {
          // Trim trailing space
          if (result.length > 0 && result[result.length - 1] === " ") {
            result = result.slice(0, -1);
          }
        }

        result += ch;
        prevType = token.type;
        prevChar = ch;

        // Remove space after these characters
        if (";{}:,>~+".indexOf(ch) !== -1) {
          // Skip following whitespace tokens
          if (t + 1 < tokens.length && tokens[t + 1].type === "whitespace") {
            t++;
            // But check if we need the space
            var after = null;
            for (var at = t + 1; at < tokens.length; at++) {
              if (tokens[at].type !== "comment") { after = tokens[at]; break; }
            }
            // After colon in property values, spaces in values are handled by func/string tokens
          }
        }
      }

      // Remove trailing semicolons before closing braces
      result = result.replace(/;}/g, "}");

      return result.trim();
    }

    function beautifyCSS(css) {
      var tokens = tokenizeCSS(css);
      var result = "";
      var indent = 0;
      var inString = false;

      // First pass: build a simplified string for formatting
      var simplified = "";
      for (var t = 0; t < tokens.length; t++) {
        var token = tokens[t];
        if (token.type === "comment") continue;
        if (token.type === "whitespace") {
          simplified += " ";
          continue;
        }
        simplified += token.value;
      }
      simplified = simplified.replace(/\s+/g, " ").trim();

      // Format character by character, respecting strings
      var strChar = "";
      for (var i = 0; i < simplified.length; i++) {
        var ch = simplified[i];

        // Track strings
        if ((ch === '"' || ch === "'") && (i === 0 || simplified[i - 1] !== "\\")) {
          if (!inString) {
            inString = true;
            strChar = ch;
          } else if (ch === strChar) {
            inString = false;
          }
          result += ch;
          continue;
        }

        if (inString) {
          result += ch;
          continue;
        }

        if (ch === "{") {
          result = result.trimEnd() + " {\n";
          indent++;
          result += "  ".repeat(indent);
        } else if (ch === "}") {
          indent = Math.max(0, indent - 1);
          result = result.trimEnd() + "\n" + "  ".repeat(indent) + "}\n";
          if (indent > 0) {
            result += "  ".repeat(indent);
          }
        } else if (ch === ";") {
          result += ";\n" + "  ".repeat(indent);
        } else if (ch === "," && indent === 0) {
          result += ",\n";
        } else {
          result += ch;
        }
      }

      result = result.replace(/[ \t]+\n/g, "\n");
      result = result.replace(/\n{3,}/g, "\n\n");
      return result.trim();
    }

    btnMinify.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value;
      if (!input.trim()) {
        showError("CSSを入力してください。");
        return;
      }
      var result = minifyCSS(input);
      outputEl.value = result;
      showSuccess("圧縮が完了しました。");
      showStats(input, result);
    });

    btnBeautify.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value;
      if (!input.trim()) {
        showError("CSSを入力してください。");
        return;
      }
      var result = beautifyCSS(input);
      outputEl.value = result;
      showSuccess("整形が完了しました。");
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      outputEl.value = "";
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
