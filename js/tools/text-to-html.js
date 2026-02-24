"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var textInput = document.getElementById("text-input");
    var htmlOutput = document.getElementById("html-output");
    var htmlPreview = document.getElementById("html-preview");
    var lineBreakMode = document.getElementById("line-break-mode");
    var optAutoLink = document.getElementById("opt-auto-link");
    var optEscape = document.getElementById("opt-escape");
    var btnConvert = document.getElementById("btn-convert");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var successEl = document.getElementById("convert-success");
    var errorEl = document.getElementById("convert-error");
    var tabBtns = document.querySelectorAll(".tab-btn");

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      errorEl.hidden = true;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      successEl.hidden = true;
    }

    function clearMessages() {
      errorEl.hidden = true;
      successEl.hidden = true;
    }

    function escapeHTML(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function autoLinkURLs(str) {
      // Match URLs - be careful not to match already-escaped HTML
      return str.replace(/(https?:\/\/[^\s<>"']+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    function convertText() {
      clearMessages();
      var text = textInput.value;
      if (!text) {
        htmlOutput.value = "";
        htmlPreview.setAttribute("srcdoc", "");
        return;
      }

      var html = text;
      var escape = optEscape.checked;
      var autoLink = optAutoLink.checked;
      var mode = lineBreakMode.value;

      // Step 1: Escape HTML special characters (before adding any HTML tags)
      if (escape) {
        html = escapeHTML(html);
      }

      // Step 2: Auto-link URLs
      if (autoLink) {
        html = autoLinkURLs(html);
      }

      // Step 3: Handle line breaks
      if (mode === "br") {
        html = html.replace(/\n/g, "<br>\n");
      } else if (mode === "p") {
        var paragraphs = html.split(/\n\s*\n/);
        html = paragraphs.map(function (p) {
          var trimmed = p.trim();
          if (!trimmed) return "";
          return "<p>" + trimmed.replace(/\n/g, "<br>") + "</p>";
        }).filter(function (p) { return p; }).join("\n");
      }

      htmlOutput.value = html;

      // Render preview in a sandboxed iframe (no allow-scripts) to prevent XSS
      var previewDoc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:sans-serif;font-size:14px;color:#333;padding:8px;margin:0;word-wrap:break-word;}a{color:#1a73e8;}</style></head><body>' + html + '</body></html>';
      htmlPreview.setAttribute("srcdoc", previewDoc);
    }

    btnConvert.addEventListener("click", convertText);

    btnClear.addEventListener("click", function () {
      textInput.value = "";
      htmlOutput.value = "";
      htmlPreview.setAttribute("srcdoc", "");
      clearMessages();
    });

    btnCopy.addEventListener("click", function () {
      var text = htmlOutput.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });

    // Tab switching
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var tabId = btn.dataset.tab;
        document.querySelectorAll(".tab-content").forEach(function (tc) {
          tc.classList.remove("active");
        });
        document.getElementById(tabId).classList.add("active");
      });
    });
  });
})();
