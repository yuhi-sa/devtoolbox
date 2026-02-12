"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("escape-input");
    var outputEl = document.getElementById("escape-output");
    var inputLabel = document.getElementById("escape-input-label");
    var errorEl = document.getElementById("escape-error");
    var successEl = document.getElementById("escape-success");
    var btnConvert = document.getElementById("btn-convert");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var tabBtns = document.querySelectorAll(".tab-btn");
    var currentMode = "escape";

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
      if (currentMode === "escape") {
        inputLabel.textContent = "エスケープするテキスト";
        inputEl.placeholder = "改行やタブを含むテキストを入力してください...";
      } else {
        inputLabel.textContent = "アンエスケープするテキスト";
        inputEl.placeholder = "Hello\\nWorld\\t! のようなエスケープ済みテキストを入力...";
      }
    }

    // Escape: convert actual special characters to escape sequences
    function escapeText(str) {
      var result = "";
      for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        switch (ch) {
          case "\\": result += "\\\\"; break;
          case '"': result += '\\"'; break;
          case "'": result += "\\'"; break;
          case "\n": result += "\\n"; break;
          case "\r": result += "\\r"; break;
          case "\t": result += "\\t"; break;
          case "\b": result += "\\b"; break;
          case "\f": result += "\\f"; break;
          case "\0": result += "\\0"; break;
          default: result += ch; break;
        }
      }
      return result;
    }

    // Unescape: convert escape sequences to actual characters
    function unescapeText(str) {
      var result = "";
      var i = 0;
      while (i < str.length) {
        if (str[i] === "\\" && i + 1 < str.length) {
          var next = str[i + 1];
          switch (next) {
            case "n": result += "\n"; i += 2; break;
            case "r": result += "\r"; i += 2; break;
            case "t": result += "\t"; i += 2; break;
            case "\\": result += "\\"; i += 2; break;
            case '"': result += '"'; i += 2; break;
            case "'": result += "'"; i += 2; break;
            case "0": result += "\0"; i += 2; break;
            case "b": result += "\b"; i += 2; break;
            case "f": result += "\f"; i += 2; break;
            case "u":
              // Unicode escape: \uXXXX
              if (i + 5 < str.length) {
                var hex = str.substring(i + 2, i + 6);
                if (/^[0-9a-fA-F]{4}$/.test(hex)) {
                  result += String.fromCharCode(parseInt(hex, 16));
                  i += 6;
                  break;
                }
              }
              result += str[i];
              i++;
              break;
            case "x":
              // Hex escape: \xXX
              if (i + 3 < str.length) {
                var hexByte = str.substring(i + 2, i + 4);
                if (/^[0-9a-fA-F]{2}$/.test(hexByte)) {
                  result += String.fromCharCode(parseInt(hexByte, 16));
                  i += 4;
                  break;
                }
              }
              result += str[i];
              i++;
              break;
            default:
              // Unknown escape, keep as-is
              result += "\\" + next;
              i += 2;
              break;
          }
        } else {
          result += str[i];
          i++;
        }
      }
      return result;
    }

    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabBtns.forEach(function (b) { b.classList.remove("tab-btn--active"); });
        btn.classList.add("tab-btn--active");
        currentMode = btn.getAttribute("data-tab");
        updateLabels();
        clearMessages();
      });
    });

    btnConvert.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value;
      if (!input) {
        showError("テキストを入力してください。");
        return;
      }

      try {
        if (currentMode === "escape") {
          outputEl.value = escapeText(input);
          showSuccess("エスケープが完了しました。");
        } else {
          outputEl.value = unescapeText(input);
          showSuccess("アンエスケープが完了しました。");
        }
      } catch (e) {
        showError("変換エラー: " + e.message);
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
