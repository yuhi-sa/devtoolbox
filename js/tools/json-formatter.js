"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("json-input");
    var outputEl = document.getElementById("json-output");
    var indentSelect = document.getElementById("indent-select");
    var errorEl = document.getElementById("json-error");
    var successEl = document.getElementById("json-success");
    var btnFormat = document.getElementById("btn-format");
    var btnMinify = document.getElementById("btn-minify");
    var btnValidate = document.getElementById("btn-validate");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");

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

    function getIndent() {
      var val = indentSelect.value;
      if (val === "tab") return "\t";
      return parseInt(val, 10);
    }

    function parseJSON(str) {
      try {
        return { data: JSON.parse(str), error: null };
      } catch (e) {
        return { data: null, error: e };
      }
    }

    btnFormat.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("JSONを入力してください。");
        return;
      }
      var result = parseJSON(input);
      if (result.error) {
        showError("JSON構文エラー: " + result.error.message);
        return;
      }
      outputEl.value = JSON.stringify(result.data, null, getIndent());
      showSuccess("整形が完了しました。");
    });

    btnMinify.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("JSONを入力してください。");
        return;
      }
      var result = parseJSON(input);
      if (result.error) {
        showError("JSON構文エラー: " + result.error.message);
        return;
      }
      outputEl.value = JSON.stringify(result.data);
      showSuccess("圧縮が完了しました。");
    });

    btnValidate.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("JSONを入力してください。");
        return;
      }
      var result = parseJSON(input);
      if (result.error) {
        var msg = result.error.message;
        var posMatch = msg.match(/position\s+(\d+)/i);
        if (posMatch) {
          var pos = parseInt(posMatch[1], 10);
          var lines = input.substring(0, pos).split("\n");
          var line = lines.length;
          var col = lines[lines.length - 1].length + 1;
          showError("JSON構文エラー（" + line + "行目、" + col + "列目付近）: " + msg);
        } else {
          showError("JSON構文エラー: " + msg);
        }
        outputEl.value = "";
        return;
      }
      showSuccess("有効なJSONです。構文エラーはありません。");
      outputEl.value = "";
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
