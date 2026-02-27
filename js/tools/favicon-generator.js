"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var textInput = document.getElementById("favicon-text");
    var fontSizeSlider = document.getElementById("font-size-slider");
    var fontSizeValue = document.getElementById("font-size-value");
    var textColor = document.getElementById("text-color");
    var bgColor = document.getElementById("bg-color");
    var borderRadiusSlider = document.getElementById("border-radius-slider");
    var borderRadiusValue = document.getElementById("border-radius-value");
    var btnGenerate = document.getElementById("btn-generate");
    var btnClear = document.getElementById("btn-clear");
    var btnCopyHtml = document.getElementById("btn-copy-html");
    var errorEl = document.getElementById("favicon-error");
    var successEl = document.getElementById("favicon-success");
    var previewSection = document.getElementById("preview-section");
    var previewContainer = document.getElementById("preview-container");
    var downloadButtons = document.getElementById("download-buttons");
    var htmlSnippet = document.getElementById("html-snippet");

    var sizes = [16, 32, 64, 128, 256];
    var generatedCanvases = {};

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

    function drawRoundedRect(ctx, x, y, w, h, radiusPercent) {
      var r = (Math.min(w, h) * radiusPercent) / 100;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function generateFavicon(size, text, fontSizePercent, txtColor, backgroundColor, radiusPercent) {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Draw rounded rect background
      drawRoundedRect(ctx, 0, 0, size, size, radiusPercent);
      ctx.fillStyle = backgroundColor;
      ctx.fill();

      // Clip to rounded rect for clean edges
      drawRoundedRect(ctx, 0, 0, size, size, radiusPercent);
      ctx.clip();

      // Draw text
      var fontSize = Math.round(size * fontSizePercent / 100);
      ctx.fillStyle = txtColor;
      ctx.font = "bold " + fontSize + "px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, size / 2, size / 2);

      return canvas;
    }

    function generateAll() {
      clearMessages();
      var text = textInput.value.trim();
      if (!text) {
        showError("テキストまたは絵文字を入力してください。");
        return;
      }
      if ([...text].length > 2) {
        showError("1〜2文字で入力してください。");
        return;
      }

      var fontSizePercent = parseInt(fontSizeSlider.value, 10);
      var txtColor = textColor.value;
      var backgroundColor = bgColor.value;
      var radiusPercent = parseInt(borderRadiusSlider.value, 10);

      previewContainer.innerHTML = "";
      downloadButtons.innerHTML = "";
      generatedCanvases = {};

      sizes.forEach(function (size) {
        var canvas = generateFavicon(size, text, fontSizePercent, txtColor, backgroundColor, radiusPercent);
        generatedCanvases[size] = canvas;

        // Preview item
        var wrapper = document.createElement("div");
        wrapper.style.textAlign = "center";

        var label = document.createElement("p");
        label.textContent = size + "x" + size;
        label.style.marginBottom = "0.5rem";
        label.style.fontSize = "0.85rem";
        label.style.fontWeight = "600";

        var img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        img.width = size > 128 ? 128 : size;
        img.height = size > 128 ? 128 : size;
        img.alt = "favicon " + size + "x" + size;
        img.style.border = "1px solid var(--color-border, #ddd)";
        img.style.borderRadius = "4px";
        img.style.imageRendering = size <= 32 ? "pixelated" : "auto";

        wrapper.appendChild(label);
        wrapper.appendChild(img);
        previewContainer.appendChild(wrapper);

        // Download button
        var btn = document.createElement("button");
        btn.className = "btn btn--primary";
        btn.textContent = size + "x" + size + " PNG";
        btn.style.fontSize = "0.85rem";
        btn.addEventListener("click", function () {
          downloadPNG(size);
        });
        downloadButtons.appendChild(btn);
      });

      // Download all button
      var btnAll = document.createElement("button");
      btnAll.className = "btn btn--secondary";
      btnAll.textContent = "全サイズ一括DL";
      btnAll.style.fontSize = "0.85rem";
      btnAll.addEventListener("click", function () {
        sizes.forEach(function (size) {
          downloadPNG(size);
        });
      });
      downloadButtons.appendChild(btnAll);

      // HTML snippet
      var snippetLines = [
        '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
        '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
        '<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png">',
        '<link rel="icon" type="image/png" sizes="128x128" href="/favicon-128x128.png">',
        '<link rel="icon" type="image/png" sizes="256x256" href="/favicon-256x256.png">',
        '<link rel="apple-touch-icon" sizes="256x256" href="/favicon-256x256.png">'
      ];
      htmlSnippet.value = snippetLines.join("\n");

      previewSection.hidden = false;
      showSuccess("ファビコンを生成しました。");
    }

    function downloadPNG(size) {
      var canvas = generatedCanvases[size];
      if (!canvas) return;
      var link = document.createElement("a");
      link.download = "favicon-" + size + "x" + size + ".png";
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    btnGenerate.addEventListener("click", generateAll);

    btnClear.addEventListener("click", function () {
      textInput.value = "";
      fontSizeSlider.value = 70;
      fontSizeValue.textContent = "70";
      textColor.value = "#ffffff";
      bgColor.value = "#1a73e8";
      borderRadiusSlider.value = 15;
      borderRadiusValue.textContent = "15";
      previewContainer.innerHTML = "";
      downloadButtons.innerHTML = "";
      htmlSnippet.value = "";
      previewSection.hidden = true;
      generatedCanvases = {};
      clearMessages();
    });

    btnCopyHtml.addEventListener("click", function () {
      var text = htmlSnippet.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("HTMLスニペットをコピーしました。");
      });
    });

    // Auto-generate on input changes for live preview
    textInput.addEventListener("input", function () {
      if (textInput.value.trim() && previewSection.hidden === false) {
        generateAll();
      }
    });
    fontSizeSlider.addEventListener("input", function () {
      fontSizeValue.textContent = fontSizeSlider.value;
      if (textInput.value.trim() && previewSection.hidden === false) {
        generateAll();
      }
    });
    borderRadiusSlider.addEventListener("input", function () {
      borderRadiusValue.textContent = borderRadiusSlider.value;
      if (textInput.value.trim() && previewSection.hidden === false) {
        generateAll();
      }
    });
    textColor.addEventListener("input", function () {
      if (textInput.value.trim() && previewSection.hidden === false) {
        generateAll();
      }
    });
    bgColor.addEventListener("input", function () {
      if (textInput.value.trim() && previewSection.hidden === false) {
        generateAll();
      }
    });
  });
})();
