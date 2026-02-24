"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("js-input");
    var outputEl = document.getElementById("js-output");
    var errorEl = document.getElementById("js-error");
    var successEl = document.getElementById("js-success");
    var statsEl = document.getElementById("js-stats");
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

    function minifyJS(js) {
      var result = "";
      var i = 0;
      var len = js.length;
      var prevNonSpace = "";

      while (i < len) {
        var ch = js[i];
        var next = i + 1 < len ? js[i + 1] : "";

        // Handle single-line comments
        if (ch === "/" && next === "/") {
          while (i < len && js[i] !== "\n") i++;
          // Preserve newline for ASI safety
          if (i < len) {
            // Check if a newline is needed here (ASI)
            var nextNS = peekNextNonSpace(js, i + 1);
            if (prevNonSpace && needsASI(prevNonSpace, nextNS)) {
              result += "\n";
            }
            i++;
          }
          continue;
        }

        // Handle multi-line comments
        if (ch === "/" && next === "*") {
          i += 2;
          while (i < len - 1 && !(js[i] === "*" && js[i + 1] === "/")) i++;
          i += 2;
          continue;
        }

        // Handle template literals (backticks) - preserve entirely including ${} expressions
        if (ch === "`") {
          result += ch;
          i++;
          var templateDepth = 0;
          while (i < len) {
            var tc = js[i];
            if (tc === "\\" && i + 1 < len) {
              result += tc + js[i + 1];
              i += 2;
              continue;
            }
            if (tc === "$" && i + 1 < len && js[i + 1] === "{") {
              result += "${";
              i += 2;
              templateDepth++;
              // Read expression inside ${}, respecting nested braces, strings, template literals
              var braceDepth = 1;
              while (i < len && braceDepth > 0) {
                var ec = js[i];
                if (ec === "{") { braceDepth++; result += ec; i++; }
                else if (ec === "}") {
                  braceDepth--;
                  if (braceDepth > 0) { result += ec; i++; }
                  else { result += ec; i++; }
                }
                else if (ec === '"' || ec === "'" || ec === "`") {
                  // Read nested string/template
                  var nestedQuote = ec;
                  result += ec;
                  i++;
                  if (nestedQuote === "`") {
                    // Nested template literal - just pass through, this is rare
                    while (i < len && js[i] !== "`") {
                      if (js[i] === "\\" && i + 1 < len) {
                        result += js[i] + js[i + 1];
                        i += 2;
                        continue;
                      }
                      result += js[i];
                      i++;
                    }
                    if (i < len) { result += js[i]; i++; }
                  } else {
                    while (i < len && js[i] !== nestedQuote) {
                      if (js[i] === "\\" && i + 1 < len) {
                        result += js[i] + js[i + 1];
                        i += 2;
                        continue;
                      }
                      result += js[i];
                      i++;
                    }
                    if (i < len) { result += js[i]; i++; }
                  }
                }
                else { result += ec; i++; }
              }
              templateDepth--;
              continue;
            }
            result += tc;
            if (tc === "`") { i++; break; }
            i++;
          }
          prevNonSpace = "`";
          continue;
        }

        // Handle strings (single and double quotes)
        if (ch === '"' || ch === "'") {
          var quote = ch;
          result += ch;
          i++;
          while (i < len) {
            if (js[i] === "\\" && i + 1 < len) {
              result += js[i] + js[i + 1];
              i += 2;
              continue;
            }
            result += js[i];
            if (js[i] === quote) { i++; break; }
            i++;
          }
          prevNonSpace = quote;
          continue;
        }

        // Handle regex literals
        if (ch === "/") {
          var canBeRegex = prevNonSpace === "" || "=({[,;!&|?:~^%*/+-><\n".indexOf(prevNonSpace) !== -1;
          if (canBeRegex && next !== "/" && next !== "*") {
            result += ch;
            i++;
            while (i < len && js[i] !== "/" && js[i] !== "\n") {
              if (js[i] === "\\") {
                result += js[i];
                i++;
                if (i < len) { result += js[i]; i++; }
                continue;
              }
              if (js[i] === "[") {
                result += js[i];
                i++;
                while (i < len && js[i] !== "]" && js[i] !== "\n") {
                  if (js[i] === "\\") { result += js[i]; i++; if (i < len) { result += js[i]; i++; } continue; }
                  result += js[i];
                  i++;
                }
              }
              result += js[i];
              i++;
            }
            if (i < len && js[i] === "/") {
              result += js[i];
              i++;
              while (i < len && /[gimsuy]/.test(js[i])) {
                result += js[i];
                i++;
              }
            }
            prevNonSpace = "/";
            continue;
          }
        }

        // Collapse whitespace
        if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
          var hasNewline = false;
          while (i < len && (js[i] === " " || js[i] === "\t" || js[i] === "\n" || js[i] === "\r")) {
            if (js[i] === "\n") hasNewline = true;
            i++;
          }
          var nextNonSpace = i < len ? js[i] : "";
          // Skip further whitespace to find actual next char
          var peekIdx = i;
          while (peekIdx < len && (js[peekIdx] === " " || js[peekIdx] === "\t" || js[peekIdx] === "\r")) peekIdx++;
          if (peekIdx < len) nextNonSpace = js[peekIdx];

          if (hasNewline && needsASI(prevNonSpace, nextNonSpace)) {
            result += "\n";
          } else if (needsSpace(prevNonSpace, nextNonSpace)) {
            result += " ";
          }
          continue;
        }

        result += ch;
        prevNonSpace = ch;
        i++;
      }

      return result.trim();
    }

    function peekNextNonSpace(js, start) {
      var i = start;
      while (i < js.length && (js[i] === " " || js[i] === "\t" || js[i] === "\r" || js[i] === "\n")) i++;
      return i < js.length ? js[i] : "";
    }

    function needsASI(prev, next) {
      if (!prev || !next) return false;
      var endTokens = ")}]`";
      var startTokens = "({[+-.!~`";
      if (/[a-zA-Z0-9_$]/.test(prev) || endTokens.indexOf(prev) !== -1 || prev === '"' || prev === "'") {
        if (/[a-zA-Z0-9_$]/.test(next) || startTokens.indexOf(next) !== -1 || next === '"' || next === "'") {
          return true;
        }
      }
      return false;
    }

    function needsSpace(prev, next) {
      if (!prev || !next) return false;
      if (/[a-zA-Z0-9_$]/.test(prev) && /[a-zA-Z0-9_$]/.test(next)) return true;
      return false;
    }

    function beautifyJS(js) {
      var indent = 0;
      var result = "";
      var i = 0;
      var len = js.length;
      var inString = false;
      var stringChar = "";
      var newlineAdded = false;

      while (i < len) {
        var ch = js[i];

        // Handle template literals
        if (!inString && ch === "`") {
          result += ch;
          i++;
          while (i < len) {
            if (js[i] === "\\" && i + 1 < len) {
              result += js[i] + js[i + 1];
              i += 2;
              continue;
            }
            result += js[i];
            if (js[i] === "`") { i++; break; }
            i++;
          }
          newlineAdded = false;
          continue;
        }

        // Handle strings
        if (!inString && (ch === '"' || ch === "'")) {
          inString = true;
          stringChar = ch;
          result += ch;
          newlineAdded = false;
          i++;
          continue;
        }

        if (inString) {
          result += ch;
          if (ch === "\\" && i + 1 < len) {
            i++;
            result += js[i];
            i++;
            continue;
          }
          if (ch === stringChar) {
            inString = false;
          }
          i++;
          continue;
        }

        // Handle comments
        if (ch === "/" && i + 1 < len && js[i + 1] === "/") {
          while (i < len && js[i] !== "\n") {
            result += js[i];
            i++;
          }
          if (i < len) {
            result += "\n" + "  ".repeat(indent);
            newlineAdded = true;
            i++;
          }
          continue;
        }

        if (ch === "/" && i + 1 < len && js[i + 1] === "*") {
          while (i < len - 1 && !(js[i] === "*" && js[i + 1] === "/")) {
            result += js[i];
            i++;
          }
          result += "*/";
          i += 2;
          newlineAdded = false;
          continue;
        }

        if (ch === "{") {
          result = result.trimEnd() + " {\n";
          indent++;
          result += "  ".repeat(indent);
          newlineAdded = true;
          i++;
          continue;
        }

        if (ch === "}") {
          indent = Math.max(0, indent - 1);
          result = result.trimEnd() + "\n" + "  ".repeat(indent) + "}";
          newlineAdded = false;
          i++;
          var tempJ = i;
          while (tempJ < len && (js[tempJ] === " " || js[tempJ] === "\t" || js[tempJ] === "\n" || js[tempJ] === "\r")) tempJ++;
          var nextWord = js.substring(tempJ, tempJ + 7);
          if (nextWord.startsWith("else") || nextWord.startsWith("catch") || nextWord.startsWith("finally")) {
            result += " ";
          } else {
            result += "\n" + "  ".repeat(indent);
            newlineAdded = true;
          }
          continue;
        }

        if (ch === ";") {
          result += ";\n" + "  ".repeat(indent);
          newlineAdded = true;
          i++;
          continue;
        }

        if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
          if (!newlineAdded && result.length > 0 && result[result.length - 1] !== " ") {
            result += " ";
          }
          i++;
          continue;
        }

        result += ch;
        newlineAdded = false;
        i++;
      }

      result = result.replace(/[ \t]+\n/g, "\n");
      result = result.replace(/\n{3,}/g, "\n\n");
      return result.trim();
    }

    btnMinify.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value;
      if (!input.trim()) {
        showError("JavaScriptを入力してください。");
        return;
      }
      var result = minifyJS(input);
      outputEl.value = result;
      showSuccess("圧縮が完了しました。※本番環境にはTerser等の専用ツールの使用を推奨します。");
      showStats(input, result);
    });

    btnBeautify.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value;
      if (!input.trim()) {
        showError("JavaScriptを入力してください。");
        return;
      }
      var result = beautifyJS(input);
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
