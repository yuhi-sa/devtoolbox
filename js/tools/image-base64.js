"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var tabBtns = document.querySelectorAll(".tab-group .tab-btn");
    var panelEncode = document.getElementById("panel-encode");
    var panelDecode = document.getElementById("panel-decode");
    var dropZone = document.getElementById("drop-zone");
    var fileInput = document.getElementById("file-input");
    var encodeResult = document.getElementById("encode-result");
    var previewImage = document.getElementById("preview-image");
    var imageInfo = document.getElementById("image-info");
    var encodeOutput = document.getElementById("encode-output");
    var encodeSuccess = document.getElementById("encode-success");
    var btnCopyEncode = document.getElementById("btn-copy-encode");
    var btnClearEncode = document.getElementById("btn-clear-encode");
    var formatBtns = document.querySelectorAll("[data-format]");

    var decodeInput = document.getElementById("decode-input");
    var btnDecode = document.getElementById("btn-decode");
    var btnClearDecode = document.getElementById("btn-clear-decode");
    var decodeError = document.getElementById("decode-error");
    var decodeResult = document.getElementById("decode-result");
    var decodePreview = document.getElementById("decode-preview");
    var decodeSuccess = document.getElementById("decode-success");

    var currentDataUrl = "";
    var currentRawBase64 = "";
    var currentMimeType = "";
    var currentFormat = "dataurl";

    // タブ切替
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabBtns.forEach(function (b) { b.classList.remove("tab-btn--active"); });
        btn.classList.add("tab-btn--active");
        var tab = btn.getAttribute("data-tab");
        if (tab === "encode") {
          panelEncode.hidden = false;
          panelDecode.hidden = true;
        } else {
          panelEncode.hidden = true;
          panelDecode.hidden = false;
        }
      });
    });

    // ドラッグ&ドロップ
    dropZone.addEventListener("click", function () {
      fileInput.click();
    });

    dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
      dropZone.classList.add("drop-zone--active");
    });

    dropZone.addEventListener("dragleave", function () {
      dropZone.classList.remove("drop-zone--active");
    });

    dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      dropZone.classList.remove("drop-zone--active");
      var files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    });

    fileInput.addEventListener("change", function () {
      if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
      }
    });

    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    function handleFile(file) {
      var validTypes = ["image/png", "image/jpeg", "image/gif", "image/svg+xml", "image/webp"];
      if (validTypes.indexOf(file.type) === -1) {
        alert("対応していない形式です。PNG、JPG、GIF、SVG、WebPのいずれかを選択してください。");
        return;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        currentDataUrl = e.target.result;
        currentMimeType = file.type;
        // data:image/png;base64,xxxx -> xxxx
        var commaIndex = currentDataUrl.indexOf(",");
        currentRawBase64 = commaIndex >= 0 ? currentDataUrl.substring(commaIndex + 1) : currentDataUrl;

        previewImage.src = currentDataUrl;
        previewImage.onload = function () {
          var w = previewImage.naturalWidth;
          var h = previewImage.naturalHeight;
          imageInfo.innerHTML = "";
          var items = [
            "ファイル名: " + escapeHtml(file.name),
            "形式: " + file.type,
            "サイズ: " + formatFileSize(file.size),
            "寸法: " + w + " x " + h + " px",
            "Base64サイズ: " + formatFileSize(currentRawBase64.length)
          ];
          items.forEach(function (text) {
            var span = document.createElement("span");
            span.textContent = text;
            imageInfo.appendChild(span);
          });
        };

        encodeResult.hidden = false;
        updateOutput();
      };
      reader.readAsDataURL(file);
    }

    function escapeHtml(str) {
      var div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    function updateOutput() {
      if (!currentDataUrl) return;
      var output = "";
      switch (currentFormat) {
        case "dataurl":
          output = currentDataUrl;
          break;
        case "raw":
          output = currentRawBase64;
          break;
        case "img":
          output = '<img src="' + currentDataUrl + '" alt="">';
          break;
        case "css":
          output = "background-image: url('" + currentDataUrl + "');";
          break;
      }
      encodeOutput.value = output;
    }

    // 出力形式切替
    formatBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        formatBtns.forEach(function (b) { b.classList.remove("tab-btn--active"); });
        btn.classList.add("tab-btn--active");
        currentFormat = btn.getAttribute("data-format");
        updateOutput();
      });
    });

    // コピー
    btnCopyEncode.addEventListener("click", function () {
      var text = encodeOutput.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        encodeSuccess.textContent = "コピーしました。";
        encodeSuccess.hidden = false;
        setTimeout(function () { encodeSuccess.hidden = true; }, 2000);
      });
    });

    // クリア（エンコード）
    btnClearEncode.addEventListener("click", function () {
      currentDataUrl = "";
      currentRawBase64 = "";
      currentMimeType = "";
      encodeOutput.value = "";
      encodeResult.hidden = true;
      encodeSuccess.hidden = true;
      imageInfo.innerHTML = "";
      fileInput.value = "";
    });

    // デコード
    btnDecode.addEventListener("click", function () {
      decodeError.hidden = true;
      decodeSuccess.hidden = true;
      decodeResult.hidden = true;

      var input = decodeInput.value.trim();
      if (!input) {
        decodeError.textContent = "Base64文字列またはデータURLを入力してください。";
        decodeError.hidden = false;
        return;
      }

      var src = input;
      // 生のBase64の場合、データURLに変換
      if (!input.startsWith("data:")) {
        // MIMEタイプを推測
        src = "data:image/png;base64," + input;
      }

      decodePreview.onerror = function () {
        decodeError.textContent = "画像のデコードに失敗しました。正しいBase64文字列か確認してください。";
        decodeError.hidden = false;
        decodeResult.hidden = true;
      };

      decodePreview.onload = function () {
        decodeResult.hidden = false;
        decodeSuccess.textContent = "画像のデコードに成功しました。";
        decodeSuccess.hidden = false;
      };

      decodePreview.src = src;
    });

    // クリア（デコード）
    btnClearDecode.addEventListener("click", function () {
      decodeInput.value = "";
      decodeError.hidden = true;
      decodeSuccess.hidden = true;
      decodeResult.hidden = true;
      decodePreview.src = "";
    });
  });
})();
