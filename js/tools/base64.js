"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("base64-input");
    var outputEl = document.getElementById("base64-output");
    var inputLabel = document.getElementById("base64-input-label");
    var errorEl = document.getElementById("base64-error");
    var successEl = document.getElementById("base64-success");
    var btnConvert = document.getElementById("btn-convert");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var tabBtns = document.querySelectorAll(".tab-btn");
    var currentMode = "encode";

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
      if (currentMode === "encode") {
        inputLabel.textContent = "変換するテキスト";
        inputEl.placeholder = "変換したいテキストを入力してください...";
      } else {
        inputLabel.textContent = "Base64文字列";
        inputEl.placeholder = "Base64文字列を入力してください...";
      }
    }

    // UTF-8対応エンコード
    function base64Encode(str) {
      var encoder = new TextEncoder();
      var bytes = encoder.encode(str);
      var binary = "";
      for (var i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }

    // UTF-8対応デコード
    function base64Decode(str) {
      var cleaned = str.replace(/\s/g, "");
      var binary = atob(cleaned);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      var decoder = new TextDecoder();
      return decoder.decode(bytes);
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
        if (currentMode === "encode") {
          outputEl.value = base64Encode(input);
          showSuccess("エンコードが完了しました。");
        } else {
          outputEl.value = base64Decode(input);
          showSuccess("デコードが完了しました。");
        }
      } catch (e) {
        if (currentMode === "decode") {
          showError("不正なBase64文字列です。入力を確認してください。");
        } else {
          showError("エンコードに失敗しました: " + e.message);
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
