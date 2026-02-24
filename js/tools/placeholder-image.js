"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var widthInput = document.getElementById("img-width");
    var heightInput = document.getElementById("img-height");
    var bgColorInput = document.getElementById("bg-color");
    var textColorInput = document.getElementById("text-color");
    var textInput = document.getElementById("img-text");
    var canvas = document.getElementById("placeholder-canvas");
    var ctx = canvas.getContext("2d");
    var btnGenerate = document.getElementById("btn-generate");
    var btnDownload = document.getElementById("btn-download");
    var successEl = document.getElementById("img-success");
    var presetBtns = document.querySelectorAll(".preset-btn");

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function getWidth() { return clamp(parseInt(widthInput.value, 10) || 640, 1, 2048); }
    function getHeight() { return clamp(parseInt(heightInput.value, 10) || 480, 1, 2048); }

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function generateImage() {
      var w = getWidth();
      var h = getHeight();
      var bgColor = bgColorInput.value;
      var textColor = textColorInput.value;
      var text = textInput.value.trim() || (w + "x" + h);

      canvas.width = w;
      canvas.height = h;

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      // Cross lines
      ctx.strokeStyle = textColor;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, h);
      ctx.moveTo(w, 0);
      ctx.lineTo(0, h);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Text
      var fontSize = Math.max(12, Math.min(w, h) / 8);
      ctx.fillStyle = textColor;
      ctx.font = "bold " + fontSize + "px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h / 2, w * 0.9);
    }

    btnGenerate.addEventListener("click", function () {
      generateImage();
      showSuccess("画像を生成しました。");
    });

    btnDownload.addEventListener("click", function () {
      generateImage();
      var w = getWidth();
      var h = getHeight();
      var link = document.createElement("a");
      link.download = "placeholder-" + w + "x" + h + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      showSuccess("ダウンロードを開始しました。");
    });

    presetBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        widthInput.value = btn.dataset.w;
        heightInput.value = btn.dataset.h;
        textInput.value = "";
        generateImage();
      });
    });

    // Initial generation
    generateImage();
  });
})();
