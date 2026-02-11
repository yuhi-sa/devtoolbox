"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("url-input");
    var outputEl = document.getElementById("url-output");
    var inputLabel = document.getElementById("url-input-label");
    var errorEl = document.getElementById("url-error");
    var successEl = document.getElementById("url-success");
    var btnConvert = document.getElementById("btn-convert");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var tabBtns = document.querySelectorAll(".tab-btn");
    var methodRadios = document.querySelectorAll('input[name="encode-method"]');
    var optionsEl = document.querySelector(".tool-input__options");
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

    function getMethod() {
      for (var i = 0; i < methodRadios.length; i++) {
        if (methodRadios[i].checked) return methodRadios[i].value;
      }
      return "component";
    }

    function updateLabels() {
      if (currentMode === "encode") {
        inputLabel.textContent = "変換するテキスト";
        inputEl.placeholder = "変換したいテキストやURLを入力してください...";
        optionsEl.style.display = "";
      } else {
        inputLabel.textContent = "エンコード済みURL文字列";
        inputEl.placeholder = "エンコード済みのURL文字列を入力してください...";
        optionsEl.style.display = "none";
      }
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
          var method = getMethod();
          if (method === "component") {
            outputEl.value = encodeURIComponent(input);
          } else {
            outputEl.value = encodeURI(input);
          }
          showSuccess("エンコードが完了しました。");
        } else {
          try {
            outputEl.value = decodeURIComponent(input);
          } catch (e1) {
            outputEl.value = decodeURI(input);
          }
          showSuccess("デコードが完了しました。");
        }
      } catch (e) {
        showError("変換に失敗しました。入力内容を確認してください: " + e.message);
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
