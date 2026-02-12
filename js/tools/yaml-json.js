"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("yaml-json-input");
    var outputEl = document.getElementById("yaml-json-output");
    var inputLabel = document.getElementById("yaml-json-input-label");
    var errorEl = document.getElementById("yaml-json-error");
    var successEl = document.getElementById("yaml-json-success");
    var btnConvert = document.getElementById("btn-convert");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var tabBtns = document.querySelectorAll(".tab-btn");
    var currentMode = "yaml-to-json";

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

    function updateLabels() {
      if (currentMode === "yaml-to-json") {
        inputLabel.textContent = "YAML入力";
        inputEl.placeholder = "name: DevToolBox\nversion: 1.0\nfeatures:\n  - yaml変換\n  - json変換";
      } else {
        inputLabel.textContent = "JSON入力";
        inputEl.placeholder = '{"name": "DevToolBox", "version": 1.0}';
      }
    }

    // ===== Simple YAML Parser =====
    function parseYaml(str) {
      var lines = str.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
      var result = parseBlock(lines, 0, 0);
      return result.value;
    }

    function getIndentLevel(line) {
      var match = line.match(/^(\s*)/);
      return match ? match[1].length : 0;
    }

    function parseScalar(val) {
      if (val === "" || val === "~" || val === "null" || val === "Null" || val === "NULL") return null;
      if (val === "true" || val === "True" || val === "TRUE") return true;
      if (val === "false" || val === "False" || val === "FALSE") return false;
      if (/^-?(?:0|[1-9]\d*)$/.test(val)) return parseInt(val, 10);
      if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(val)) return parseFloat(val);
      // Remove surrounding quotes
      if ((val[0] === '"' && val[val.length - 1] === '"') || (val[0] === "'" && val[val.length - 1] === "'")) {
        return val.slice(1, -1);
      }
      return val;
    }

    function parseBlock(lines, startIdx, minIndent) {
      if (startIdx >= lines.length) return { value: null, nextIdx: startIdx };

      // Skip empty lines and comments
      while (startIdx < lines.length) {
        var trimmed = lines[startIdx].trim();
        if (trimmed === "" || trimmed[0] === "#") {
          startIdx++;
        } else {
          break;
        }
      }
      if (startIdx >= lines.length) return { value: null, nextIdx: startIdx };

      var firstLine = lines[startIdx];
      var indent = getIndentLevel(firstLine);
      var content = firstLine.trim();

      // Check if first line is array item
      if (content.indexOf("- ") === 0 || content === "-") {
        return parseArray(lines, startIdx, indent);
      }

      // Check if it's a mapping (key: value)
      if (content.indexOf(": ") !== -1 || content[content.length - 1] === ":") {
        return parseMapping(lines, startIdx, indent);
      }

      // Single scalar
      return { value: parseScalar(content), nextIdx: startIdx + 1 };
    }

    function parseArray(lines, startIdx, baseIndent) {
      var arr = [];
      var idx = startIdx;

      while (idx < lines.length) {
        var trimmed = lines[idx].trim();
        if (trimmed === "" || trimmed[0] === "#") {
          idx++;
          continue;
        }

        var indent = getIndentLevel(lines[idx]);
        if (indent < baseIndent) break;
        if (indent > baseIndent) break;

        if (trimmed.indexOf("- ") === 0) {
          var itemContent = trimmed.substring(2).trim();

          // Check if the item itself is a key: value (inline mapping in array)
          if (itemContent.indexOf(": ") !== -1 || (itemContent[itemContent.length - 1] === ":" && itemContent.length > 1)) {
            // Check for nested block under this item
            var nextIdx = idx + 1;
            var childIndent = baseIndent + 2;
            var hasChildren = false;
            while (nextIdx < lines.length) {
              var nt = lines[nextIdx].trim();
              if (nt === "" || nt[0] === "#") { nextIdx++; continue; }
              if (getIndentLevel(lines[nextIdx]) > baseIndent + 1) { hasChildren = true; }
              break;
            }

            if (hasChildren) {
              // Build a temporary set of lines: the first part + children
              var colonPos = itemContent.indexOf(": ");
              var obj = {};
              if (colonPos !== -1) {
                var key = itemContent.substring(0, colonPos).trim();
                var val = itemContent.substring(colonPos + 2).trim();
                if (val === "" || val === "|" || val === ">") {
                  var childResult = parseBlock(lines, nextIdx, childIndent);
                  obj[key] = childResult.value;
                  nextIdx = childResult.nextIdx;
                } else {
                  obj[key] = parseScalar(val);
                }
              } else {
                var bareKey = itemContent.substring(0, itemContent.length - 1).trim();
                var childResult2 = parseBlock(lines, nextIdx, childIndent);
                obj[bareKey] = childResult2.value;
                nextIdx = childResult2.nextIdx;
              }

              // Parse remaining sibling keys at child indent
              while (nextIdx < lines.length) {
                var nt2 = lines[nextIdx].trim();
                if (nt2 === "" || nt2[0] === "#") { nextIdx++; continue; }
                var ni = getIndentLevel(lines[nextIdx]);
                if (ni < childIndent) break;
                if (ni === childIndent && (nt2.indexOf(": ") !== -1 || nt2[nt2.length - 1] === ":")) {
                  var mappingResult = parseMappingEntries(lines, nextIdx, childIndent, obj);
                  nextIdx = mappingResult.nextIdx;
                  break;
                } else {
                  break;
                }
              }

              arr.push(obj);
              idx = nextIdx;
            } else {
              // Simple inline key: value
              var simpleObj = {};
              var cp = itemContent.indexOf(": ");
              if (cp !== -1) {
                simpleObj[itemContent.substring(0, cp).trim()] = parseScalar(itemContent.substring(cp + 2).trim());
              } else {
                simpleObj[itemContent.substring(0, itemContent.length - 1).trim()] = null;
              }
              arr.push(simpleObj);
              idx++;
            }
          } else if (itemContent === "") {
            // Dash only with nested content on next line
            var childRes = parseBlock(lines, idx + 1, baseIndent + 2);
            arr.push(childRes.value);
            idx = childRes.nextIdx;
          } else {
            arr.push(parseScalar(itemContent));
            idx++;
          }
        } else if (trimmed === "-") {
          var childRes2 = parseBlock(lines, idx + 1, baseIndent + 2);
          arr.push(childRes2.value);
          idx = childRes2.nextIdx;
        } else {
          break;
        }
      }

      return { value: arr, nextIdx: idx };
    }

    function parseMappingEntries(lines, startIdx, baseIndent, obj) {
      var idx = startIdx;

      while (idx < lines.length) {
        var trimmed = lines[idx].trim();
        if (trimmed === "" || trimmed[0] === "#") {
          idx++;
          continue;
        }

        var indent = getIndentLevel(lines[idx]);
        if (indent < baseIndent) break;
        if (indent > baseIndent) break;

        var colonPos = trimmed.indexOf(": ");
        var isBarKey = trimmed[trimmed.length - 1] === ":" && trimmed.length > 1 && colonPos === -1;

        if (colonPos !== -1 || isBarKey) {
          var key, val;
          if (isBarKey) {
            key = trimmed.substring(0, trimmed.length - 1).trim();
            val = "";
          } else {
            key = trimmed.substring(0, colonPos).trim();
            val = trimmed.substring(colonPos + 2).trim();
          }

          // Remove surrounding quotes from key
          if ((key[0] === '"' && key[key.length - 1] === '"') || (key[0] === "'" && key[key.length - 1] === "'")) {
            key = key.slice(1, -1);
          }

          if (val === "" || isBarKey) {
            // Check for block scalar or nested content
            var nextIdx = idx + 1;
            while (nextIdx < lines.length && lines[nextIdx].trim() === "") nextIdx++;
            if (nextIdx < lines.length && getIndentLevel(lines[nextIdx]) > baseIndent) {
              var childResult = parseBlock(lines, nextIdx, getIndentLevel(lines[nextIdx]));
              obj[key] = childResult.value;
              idx = childResult.nextIdx;
            } else {
              obj[key] = null;
              idx++;
            }
          } else if (val === "|" || val === ">" || val === "|+" || val === "|-" || val === ">+" || val === ">-") {
            // Block scalar
            var blockLines = [];
            var blockIdx = idx + 1;
            var blockIndent = -1;
            while (blockIdx < lines.length) {
              var bLine = lines[blockIdx];
              var bTrimmed = bLine.trim();
              if (bTrimmed === "") {
                blockLines.push("");
                blockIdx++;
                continue;
              }
              var bIndent = getIndentLevel(bLine);
              if (blockIndent === -1) blockIndent = bIndent;
              if (bIndent < blockIndent) break;
              blockLines.push(bLine.substring(blockIndent));
              blockIdx++;
            }
            // Remove trailing empty lines
            while (blockLines.length > 0 && blockLines[blockLines.length - 1] === "") {
              blockLines.pop();
            }
            if (val[0] === "|") {
              obj[key] = blockLines.join("\n") + "\n";
            } else {
              obj[key] = blockLines.join(" ").replace(/\s+/g, " ").trim() + "\n";
            }
            idx = blockIdx;
          } else if (val[0] === "[") {
            // Inline array
            obj[key] = parseInlineArray(val);
            idx++;
          } else if (val[0] === "{") {
            // Inline mapping
            obj[key] = parseInlineMapping(val);
            idx++;
          } else {
            obj[key] = parseScalar(val);
            idx++;
          }
        } else {
          break;
        }
      }

      return { nextIdx: idx };
    }

    function parseMapping(lines, startIdx, baseIndent) {
      var obj = {};
      var result = parseMappingEntries(lines, startIdx, baseIndent, obj);
      return { value: obj, nextIdx: result.nextIdx };
    }

    function parseInlineArray(str) {
      str = str.trim();
      if (str[0] !== "[" || str[str.length - 1] !== "]") return str;
      var inner = str.slice(1, -1).trim();
      if (inner === "") return [];
      var items = splitComma(inner);
      return items.map(function (item) {
        item = item.trim();
        if (item[0] === "{") return parseInlineMapping(item);
        if (item[0] === "[") return parseInlineArray(item);
        return parseScalar(item);
      });
    }

    function parseInlineMapping(str) {
      str = str.trim();
      if (str[0] !== "{" || str[str.length - 1] !== "}") return str;
      var inner = str.slice(1, -1).trim();
      if (inner === "") return {};
      var pairs = splitComma(inner);
      var obj = {};
      pairs.forEach(function (pair) {
        var colonIdx = pair.indexOf(":");
        if (colonIdx !== -1) {
          var k = pair.substring(0, colonIdx).trim();
          var v = pair.substring(colonIdx + 1).trim();
          if ((k[0] === '"' && k[k.length - 1] === '"') || (k[0] === "'" && k[k.length - 1] === "'")) {
            k = k.slice(1, -1);
          }
          if (v[0] === "[") {
            obj[k] = parseInlineArray(v);
          } else if (v[0] === "{") {
            obj[k] = parseInlineMapping(v);
          } else {
            obj[k] = parseScalar(v);
          }
        }
      });
      return obj;
    }

    function splitComma(str) {
      var result = [];
      var depth = 0;
      var current = "";
      for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        if (ch === "[" || ch === "{") depth++;
        else if (ch === "]" || ch === "}") depth--;
        if (ch === "," && depth === 0) {
          result.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
      if (current.trim()) result.push(current);
      return result;
    }

    // ===== JSON to YAML Serializer =====
    function jsonToYaml(obj, indent) {
      indent = indent || 0;
      var prefix = repeat("  ", indent);
      if (obj === null) return "null";
      if (typeof obj === "boolean") return obj ? "true" : "false";
      if (typeof obj === "number") return String(obj);
      if (typeof obj === "string") {
        if (obj === "" || obj === "true" || obj === "false" || obj === "null" ||
            /^\d/.test(obj) || /[:#\[\]{}&*!|>'"%@`]/.test(obj) || obj.indexOf(", ") !== -1) {
          return '"' + obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\t/g, "\\t") + '"';
        }
        return obj;
      }
      if (Array.isArray(obj)) {
        if (obj.length === 0) return "[]";
        var lines = [];
        obj.forEach(function (item) {
          if (item !== null && typeof item === "object") {
            var nested = jsonToYaml(item, indent + 1);
            var nestedLines = nested.split("\n");
            lines.push(prefix + "- " + nestedLines[0]);
            for (var i = 1; i < nestedLines.length; i++) {
              lines.push(prefix + "  " + nestedLines[i]);
            }
          } else {
            lines.push(prefix + "- " + jsonToYaml(item, 0));
          }
        });
        return lines.join("\n");
      }
      if (typeof obj === "object") {
        var keys = Object.keys(obj);
        if (keys.length === 0) return "{}";
        var lines = [];
        keys.forEach(function (key) {
          var safeKey = key;
          if (key === "" || /[:#\[\]{}&*!|>'"%@`,]/.test(key) || key === "true" || key === "false" || key === "null" || /^\d/.test(key)) {
            safeKey = '"' + key.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
          }
          var val = obj[key];
          if (val !== null && typeof val === "object") {
            var nested = jsonToYaml(val, indent + 1);
            lines.push(prefix + safeKey + ":\n" + nested);
          } else {
            lines.push(prefix + safeKey + ": " + jsonToYaml(val, 0));
          }
        });
        return lines.join("\n");
      }
      return String(obj);
    }

    function repeat(str, count) {
      var result = "";
      for (var i = 0; i < count; i++) result += str;
      return result;
    }

    // ===== Tab switching =====
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabBtns.forEach(function (b) { b.classList.remove("tab-btn--active"); });
        btn.classList.add("tab-btn--active");
        currentMode = btn.getAttribute("data-tab");
        updateLabels();
        clearMessages();
      });
    });

    // ===== Convert =====
    btnConvert.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("データを入力してください。");
        return;
      }

      try {
        if (currentMode === "yaml-to-json") {
          var parsed = parseYaml(input);
          outputEl.value = JSON.stringify(parsed, null, 2);
          showSuccess("YAML → JSON変換が完了しました。");
        } else {
          var obj = JSON.parse(input);
          outputEl.value = jsonToYaml(obj, 0);
          showSuccess("JSON → YAML変換が完了しました。");
        }
      } catch (e) {
        if (currentMode === "yaml-to-json") {
          showError("YAML解析エラー: " + e.message);
        } else {
          showError("JSON構文エラー: " + e.message);
        }
        outputEl.value = "";
      }
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
