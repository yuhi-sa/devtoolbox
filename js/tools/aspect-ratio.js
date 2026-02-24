"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var widthInput = document.getElementById("input-width");
    var heightInput = document.getElementById("input-height");
    var newWidthInput = document.getElementById("new-width");
    var newHeightInput = document.getElementById("new-height");
    var errorEl = document.getElementById("aspect-error");
    var resultSection = document.getElementById("result-section");
    var ratioValue = document.getElementById("ratio-value");
    var ratioDetail = document.getElementById("ratio-detail");
    var previewSection = document.getElementById("preview-section");
    var previewBox = document.getElementById("preview-box");
    var resizeResult = document.getElementById("resize-result");
    var presetsContainer = document.getElementById("presets");
    var btnCalculate = document.getElementById("btn-calculate");
    var btnSwap = document.getElementById("btn-swap");
    var btnClear = document.getElementById("btn-clear");

    var currentRatioW = 0;
    var currentRatioH = 0;

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
    }

    function clearError() {
      errorEl.hidden = true;
    }

    function gcd(a, b) {
      a = Math.abs(Math.round(a));
      b = Math.abs(Math.round(b));
      while (b) {
        var t = b;
        b = a % b;
        a = t;
      }
      return a;
    }

    function calculate() {
      clearError();
      var w = parseFloat(widthInput.value);
      var h = parseFloat(heightInput.value);

      if (!w || !h || w <= 0 || h <= 0) {
        showError("幅と高さに正の数を入力してください。");
        resultSection.hidden = true;
        previewSection.hidden = true;
        return;
      }

      var d = gcd(w, h);
      currentRatioW = w / d;
      currentRatioH = h / d;

      ratioValue.textContent = currentRatioW + ":" + currentRatioH;
      ratioDetail.textContent = w + " x " + h + " px（比率: " + (w / h).toFixed(4) + "）";
      resultSection.hidden = false;

      // Update preview
      var maxPreviewWidth = 400;
      var ratio = w / h;
      var previewW, previewH;
      if (ratio >= 1) {
        previewW = maxPreviewWidth;
        previewH = maxPreviewWidth / ratio;
      } else {
        previewH = 200;
        previewW = 200 * ratio;
      }
      previewBox.style.width = previewW + "px";
      previewBox.style.height = previewH + "px";
      previewSection.hidden = false;

      // Update active preset
      updateActivePreset();
    }

    function updateActivePreset() {
      var buttons = presetsContainer.querySelectorAll(".ratio-presets__btn");
      for (var i = 0; i < buttons.length; i++) {
        var bw = parseInt(buttons[i].getAttribute("data-w"));
        var bh = parseInt(buttons[i].getAttribute("data-h"));
        if (bw === currentRatioW && bh === currentRatioH) {
          buttons[i].classList.add("ratio-presets__btn--active");
        } else {
          buttons[i].classList.remove("ratio-presets__btn--active");
        }
      }
    }

    btnCalculate.addEventListener("click", calculate);

    btnSwap.addEventListener("click", function () {
      var temp = widthInput.value;
      widthInput.value = heightInput.value;
      heightInput.value = temp;
      calculate();
    });

    btnClear.addEventListener("click", function () {
      widthInput.value = "";
      heightInput.value = "";
      newWidthInput.value = "";
      newHeightInput.value = "";
      resultSection.hidden = true;
      previewSection.hidden = true;
      resizeResult.hidden = true;
      clearError();
      currentRatioW = 0;
      currentRatioH = 0;
      var buttons = presetsContainer.querySelectorAll(".ratio-presets__btn");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("ratio-presets__btn--active");
      }
    });

    // Preset buttons
    presetsContainer.addEventListener("click", function (e) {
      var btn = e.target.closest(".ratio-presets__btn");
      if (!btn) return;
      var w = parseInt(btn.getAttribute("data-w"));
      var h = parseInt(btn.getAttribute("data-h"));

      // Set common resolution for the ratio
      var resolutions = {
        "16:9": [1920, 1080],
        "4:3": [1024, 768],
        "1:1": [1080, 1080],
        "21:9": [2560, 1080],
        "3:2": [1440, 960],
        "9:16": [1080, 1920],
        "2:3": [960, 1440],
        "5:4": [1280, 1024]
      };
      var key = w + ":" + h;
      if (resolutions[key]) {
        widthInput.value = resolutions[key][0];
        heightInput.value = resolutions[key][1];
      } else {
        widthInput.value = w * 100;
        heightInput.value = h * 100;
      }
      calculate();
    });

    // Resize with ratio maintained
    var resizeUpdating = false;

    newWidthInput.addEventListener("input", function () {
      if (resizeUpdating) return;
      if (currentRatioW === 0 || currentRatioH === 0) {
        resizeResult.textContent = "先にアスペクト比を計算してください。";
        resizeResult.hidden = false;
        return;
      }
      var nw = parseFloat(newWidthInput.value);
      if (!nw || nw <= 0) {
        newHeightInput.value = "";
        resizeResult.hidden = true;
        return;
      }
      resizeUpdating = true;
      var nh = Math.round(nw * currentRatioH / currentRatioW);
      newHeightInput.value = nh;
      resizeResult.textContent = "新しいサイズ: " + nw + " x " + nh + " px（比率: " + currentRatioW + ":" + currentRatioH + "）";
      resizeResult.hidden = false;
      resizeUpdating = false;
    });

    newHeightInput.addEventListener("input", function () {
      if (resizeUpdating) return;
      if (currentRatioW === 0 || currentRatioH === 0) {
        resizeResult.textContent = "先にアスペクト比を計算してください。";
        resizeResult.hidden = false;
        return;
      }
      var nh = parseFloat(newHeightInput.value);
      if (!nh || nh <= 0) {
        newWidthInput.value = "";
        resizeResult.hidden = true;
        return;
      }
      resizeUpdating = true;
      var nw = Math.round(nh * currentRatioW / currentRatioH);
      newWidthInput.value = nw;
      resizeResult.textContent = "新しいサイズ: " + nw + " x " + nh + " px（比率: " + currentRatioW + ":" + currentRatioH + "）";
      resizeResult.hidden = false;
      resizeUpdating = false;
    });

    // Auto-calculate on Enter key
    widthInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") calculate();
    });
    heightInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") calculate();
    });

    // Calculate on load with default values
    calculate();
  });
})();
