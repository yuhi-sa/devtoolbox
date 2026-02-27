"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var textInput = document.getElementById("text-input");
    var codeOutput = document.getElementById("code-output");
    var formatRadios = document.querySelectorAll('input[name="output-format"]');
    var separatorSelect = document.getElementById("separator-select");
    var btnTextToCode = document.getElementById("btn-text-to-code");
    var btnCodeToText = document.getElementById("btn-code-to-text");
    var btnSwap = document.getElementById("btn-swap");
    var btnCopy = document.getElementById("btn-copy");
    var btnClear = document.getElementById("btn-clear");
    var byteCountEl = document.getElementById("byte-count");
    var bitCountEl = document.getElementById("bit-count");
    var errorEl = document.getElementById("tb-error");
    var successEl = document.getElementById("tb-success");

    function getFormat() {
      var checked = document.querySelector('input[name="output-format"]:checked');
      return checked ? checked.value : "bin";
    }

    function getSeparator() {
      return separatorSelect.value;
    }

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      successEl.hidden = true;
    }

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      errorEl.hidden = true;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function clearMessages() {
      errorEl.hidden = true;
      successEl.hidden = true;
    }

    // テキストをUTF-8バイト配列に変換
    function textToBytes(text) {
      var encoder = new TextEncoder();
      return encoder.encode(text);
    }

    // UTF-8バイト配列をテキストに変換
    function bytesToText(bytes) {
      var decoder = new TextDecoder("utf-8", { fatal: true });
      return decoder.decode(new Uint8Array(bytes));
    }

    // バイトを指定形式の文字列に変換
    function byteToFormatted(byte, format) {
      if (format === "bin") {
        return byte.toString(2).padStart(8, "0");
      } else if (format === "hex") {
        return byte.toString(16).padStart(2, "0").toUpperCase();
      } else if (format === "oct") {
        return byte.toString(8).padStart(3, "0");
      } else if (format === "dec") {
        return byte.toString(10);
      }
      return byte.toString(2).padStart(8, "0");
    }

    // 形式文字列をバイト値にパース
    function parseFormattedByte(str, format) {
      var val;
      if (format === "bin") {
        if (!/^[01]+$/.test(str)) return -1;
        val = parseInt(str, 2);
      } else if (format === "hex") {
        if (!/^[0-9a-fA-F]+$/.test(str)) return -1;
        val = parseInt(str, 16);
      } else if (format === "oct") {
        if (!/^[0-7]+$/.test(str)) return -1;
        val = parseInt(str, 8);
      } else if (format === "dec") {
        if (!/^[0-9]+$/.test(str)) return -1;
        val = parseInt(str, 10);
      } else {
        return -1;
      }
      if (val < 0 || val > 255) return -1;
      return val;
    }

    // コード文字列をトークンに分割
    function splitCodeString(codeStr, separator) {
      if (separator === "") {
        // 区切りなしの場合、形式に応じた固定長で分割
        var format = getFormat();
        var chunkSize;
        if (format === "bin") chunkSize = 8;
        else if (format === "hex") chunkSize = 2;
        else if (format === "oct") chunkSize = 3;
        else chunkSize = 0; // decは固定長でないのでスペースで分割試行

        if (chunkSize > 0) {
          var tokens = [];
          for (var i = 0; i < codeStr.length; i += chunkSize) {
            tokens.push(codeStr.substring(i, i + chunkSize));
          }
          return tokens;
        } else {
          // 10進数で区切りなしの場合はスペースで分割を試みる
          return codeStr.split(/\s+/).filter(function (s) { return s.length > 0; });
        }
      } else if (separator === ",") {
        return codeStr.split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
      } else {
        return codeStr.split(/\s+/).filter(function (s) { return s.length > 0; });
      }
    }

    function updateStats(bytes) {
      byteCountEl.textContent = bytes.length;
      bitCountEl.textContent = bytes.length * 8;
    }

    // テキスト → 変換
    function convertTextToCode() {
      clearMessages();
      var text = textInput.value;
      if (text === "") {
        codeOutput.value = "";
        updateStats(new Uint8Array(0));
        return;
      }

      try {
        var bytes = textToBytes(text);
        var format = getFormat();
        var separator = getSeparator();
        var parts = [];
        for (var i = 0; i < bytes.length; i++) {
          parts.push(byteToFormatted(bytes[i], format));
        }
        codeOutput.value = parts.join(separator);
        updateStats(bytes);
      } catch (e) {
        showError("変換に失敗しました: " + e.message);
      }
    }

    // 変換 → テキスト
    function convertCodeToText() {
      clearMessages();
      var codeStr = codeOutput.value.trim();
      if (codeStr === "") {
        textInput.value = "";
        updateStats(new Uint8Array(0));
        return;
      }

      try {
        var format = getFormat();
        var separator = getSeparator();
        var tokens = splitCodeString(codeStr, separator);
        var bytes = [];

        for (var i = 0; i < tokens.length; i++) {
          var val = parseFormattedByte(tokens[i], format);
          if (val === -1) {
            showError("無効な値が含まれています: \"" + tokens[i] + "\"。選択した出力形式と区切り文字を確認してください。");
            return;
          }
          bytes.push(val);
        }

        var text = bytesToText(bytes);
        textInput.value = text;
        updateStats(new Uint8Array(bytes));
      } catch (e) {
        showError("変換に失敗しました。入力値と出力形式が正しいか確認してください。");
      }
    }

    // スワップ
    function swapInputOutput() {
      clearMessages();
      var tmp = textInput.value;
      textInput.value = codeOutput.value;
      codeOutput.value = tmp;
    }

    // クリア
    function clearAll() {
      textInput.value = "";
      codeOutput.value = "";
      byteCountEl.textContent = "0";
      bitCountEl.textContent = "0";
      clearMessages();
    }

    // イベントリスナー
    btnTextToCode.addEventListener("click", convertTextToCode);
    btnCodeToText.addEventListener("click", convertCodeToText);
    btnSwap.addEventListener("click", swapInputOutput);
    btnClear.addEventListener("click", clearAll);

    btnCopy.addEventListener("click", function () {
      var text = codeOutput.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });

    // 出力形式や区切り文字が変更された場合、テキスト入力があれば再変換
    formatRadios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (textInput.value) {
          convertTextToCode();
        }
      });
    });

    separatorSelect.addEventListener("change", function () {
      if (textInput.value) {
        convertTextToCode();
      }
    });
  });
})();
