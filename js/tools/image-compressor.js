"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var dropZone = document.getElementById("drop-zone");
    var fileInput = document.getElementById("file-input");
    var controls = document.getElementById("controls");
    var formatSelect = document.getElementById("output-format");
    var qualitySlider = document.getElementById("quality-slider");
    var qualityValue = document.getElementById("quality-value");
    var sizeComparison = document.getElementById("size-comparison");
    var originalSizeEl = document.getElementById("original-size");
    var compressedSizeEl = document.getElementById("compressed-size");
    var reductionRateEl = document.getElementById("reduction-rate");
    var previewArea = document.getElementById("preview-area");
    var originalPreview = document.getElementById("original-preview");
    var compressedPreview = document.getElementById("compressed-preview");
    var originalInfo = document.getElementById("original-info");
    var compressedInfo = document.getElementById("compressed-info");
    var actions = document.getElementById("actions");
    var btnDownload = document.getElementById("btn-download");
    var btnReset = document.getElementById("btn-reset");

    var originalFile = null;
    var compressedBlob = null;

    function formatBytes(bytes) {
      if (bytes === 0) return "0 B";
      var units = ["B", "KB", "MB", "GB"];
      var i = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2) + " " + units[i];
    }

    function getExtension(mimeType) {
      var map = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
      return map[mimeType] || "jpg";
    }

    function compress() {
      if (!originalFile) return;

      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var format = formatSelect.value;
        var quality = parseInt(qualitySlider.value, 10) / 100;

        canvas.toBlob(function (blob) {
          if (!blob) return;
          compressedBlob = blob;

          var compressedUrl = URL.createObjectURL(blob);
          compressedPreview.src = compressedUrl;

          var origSize = originalFile.size;
          var compSize = blob.size;
          var reduction = origSize > 0 ? ((1 - compSize / origSize) * 100) : 0;

          originalSizeEl.textContent = formatBytes(origSize);
          compressedSizeEl.textContent = formatBytes(compSize);
          reductionRateEl.textContent = (reduction >= 0 ? "-" : "+") + Math.abs(reduction).toFixed(1) + "%";

          originalInfo.textContent = img.naturalWidth + " x " + img.naturalHeight + " px";
          compressedInfo.textContent = img.naturalWidth + " x " + img.naturalHeight + " px";

          sizeComparison.style.display = "";
          previewArea.style.display = "";
          actions.style.display = "";
        }, format, quality);
      };
      img.src = URL.createObjectURL(originalFile);
    }

    function handleFile(file) {
      if (!file || !file.type.startsWith("image/")) {
        window.DevToolBox.showFeedback("画像ファイルを選択してください", "error");
        return;
      }
      originalFile = file;
      originalPreview.src = URL.createObjectURL(file);
      controls.style.display = "";
      compress();
    }

    // ドラッグ＆ドロップ
    dropZone.addEventListener("click", function () { fileInput.click(); });
    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
    });
    dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
      dropZone.classList.add("is-dragover");
    });
    dropZone.addEventListener("dragleave", function () {
      dropZone.classList.remove("is-dragover");
    });
    dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      dropZone.classList.remove("is-dragover");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });

    // 品質スライダー
    qualitySlider.addEventListener("input", function () {
      qualityValue.textContent = qualitySlider.value + "%";
      compress();
    });

    // 出力形式変更
    formatSelect.addEventListener("change", function () { compress(); });

    // ダウンロード
    btnDownload.addEventListener("click", function () {
      if (!compressedBlob) return;
      var ext = getExtension(formatSelect.value);
      var name = (originalFile.name.replace(/\.[^.]+$/, "") || "image") + "_compressed." + ext;
      var a = document.createElement("a");
      a.href = URL.createObjectURL(compressedBlob);
      a.download = name;
      a.click();
      window.DevToolBox.showFeedback("ダウンロードを開始しました", "success");
    });

    // リセット
    btnReset.addEventListener("click", function () {
      originalFile = null;
      compressedBlob = null;
      fileInput.value = "";
      controls.style.display = "none";
      sizeComparison.style.display = "none";
      previewArea.style.display = "none";
      actions.style.display = "none";
    });
  });
})();
