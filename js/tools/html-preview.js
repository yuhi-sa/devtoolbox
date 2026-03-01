"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("html-input");
    var previewEl = document.getElementById("html-preview");
    var autoRefreshEl = document.getElementById("auto-refresh");
    var btnRefresh = document.getElementById("btn-refresh");
    var btnSample = document.getElementById("btn-sample");
    var btnClear = document.getElementById("btn-clear");
    var debounceTimer = null;

    var sampleHTML = '<!DOCTYPE html>\n<html lang="ja">\n<head>\n  <meta charset="UTF-8">\n  <title>サンプルページ</title>\n  <style>\n    body {\n      font-family: sans-serif;\n      max-width: 600px;\n      margin: 2rem auto;\n      padding: 0 1rem;\n      color: #333;\n    }\n    h1 { color: #1a73e8; }\n    .card {\n      border: 1px solid #ddd;\n      border-radius: 8px;\n      padding: 1.5rem;\n      margin: 1rem 0;\n      box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n    }\n    button {\n      background: #1a73e8;\n      color: #fff;\n      border: none;\n      padding: 0.5rem 1rem;\n      border-radius: 4px;\n      cursor: pointer;\n    }\n    button:hover { background: #1557b0; }\n  </style>\n</head>\n<body>\n  <h1>Hello, DevToolBox!</h1>\n  <div class="card">\n    <h2>サンプルカード</h2>\n    <p>これはHTMLプレビューのサンプルです。HTML・CSS・JavaScriptを自由に編集してプレビューできます。</p>\n    <button onclick="alert(\'ボタンがクリックされました！\')">クリック</button>\n  </div>\n  <ul>\n    <li>リスト項目 1</li>\n    <li>リスト項目 2</li>\n    <li>リスト項目 3</li>\n  </ul>\n</body>\n</html>';

    function updatePreview() {
      var html = inputEl.value;
      var blob = new Blob([html], { type: "text/html;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      previewEl.src = url;
      // Revoke after load to free memory
      previewEl.onload = function () {
        URL.revokeObjectURL(url);
      };
    }

    function debouncedUpdate() {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updatePreview, 300);
    }

    inputEl.addEventListener("input", function () {
      if (autoRefreshEl.checked) {
        debouncedUpdate();
      }
    });

    btnRefresh.addEventListener("click", function () {
      updatePreview();
    });

    btnSample.addEventListener("click", function () {
      inputEl.value = sampleHTML;
      updatePreview();
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      previewEl.src = "about:blank";
    });
  });
})();
