"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("escape-input");
    var outputEl = document.getElementById("escape-output");
    var inputLabel = document.getElementById("escape-input-label");
    var langSelect = document.getElementById("lang-select");
    var btnCopy = document.getElementById("btn-copy");
    var tabBtns = document.querySelectorAll(".tab-btn");
    var currentMode = "escape";

    // Escape functions per language
    var escapers = {
      javascript: function (s) {
        return s
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/\0/g, "\\0")
          .replace(/\f/g, "\\f")
          .replace(/\b/g, "\\b");
      },
      python: function (s) {
        return s
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/\0/g, "\\0")
          .replace(/\f/g, "\\f")
          .replace(/\b/g, "\\b");
      },
      java: function (s) {
        return s
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/\0/g, "\\0")
          .replace(/\f/g, "\\f")
          .replace(/\b/g, "\\b");
      },
      c: function (s) {
        return s
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/\0/g, "\\0")
          .replace(/\f/g, "\\f")
          .replace(/\b/g, "\\b")
          .replace(/\?/g, "\\?");
      },
      html: function (s) {
        return s
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      },
      sql: function (s) {
        return s
          .replace(/'/g, "''")
          .replace(/\\/g, "\\\\");
      },
      shell: function (s) {
        return s
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/\$/g, "\\$")
          .replace(/`/g, "\\`")
          .replace(/!/g, "\\!")
          .replace(/\n/g, "\\n")
          .replace(/\t/g, "\\t");
      }
    };

    // Unescape functions per language
    var unescapers = {
      javascript: function (s) {
        return s
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\0/g, "\0")
          .replace(/\\f/g, "\f")
          .replace(/\\b/g, "\b")
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      },
      python: function (s) {
        return s
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\0/g, "\0")
          .replace(/\\f/g, "\f")
          .replace(/\\b/g, "\b")
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      },
      java: function (s) {
        return s
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\0/g, "\0")
          .replace(/\\f/g, "\f")
          .replace(/\\b/g, "\b")
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      },
      c: function (s) {
        return s
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\0/g, "\0")
          .replace(/\\f/g, "\f")
          .replace(/\\b/g, "\b")
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"')
          .replace(/\\\?/g, "?")
          .replace(/\\\\/g, "\\");
      },
      html: function (s) {
        return s
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&#x27;/g, "'")
          .replace(/&#(\d+);/g, function (m, code) { return String.fromCharCode(parseInt(code, 10)); })
          .replace(/&#x([0-9a-fA-F]+);/g, function (m, code) { return String.fromCharCode(parseInt(code, 16)); });
      },
      sql: function (s) {
        return s
          .replace(/''/g, "'")
          .replace(/\\\\/g, "\\");
      },
      shell: function (s) {
        return s
          .replace(/\\n/g, "\n")
          .replace(/\\t/g, "\t")
          .replace(/\\"/g, '"')
          .replace(/\\\$/g, "$")
          .replace(/\\`/g, "`")
          .replace(/\\!/g, "!")
          .replace(/\\\\/g, "\\");
      }
    };

    function convert() {
      var input = inputEl.value;
      if (!input) {
        outputEl.value = "";
        return;
      }
      var lang = langSelect.value;
      if (currentMode === "escape") {
        outputEl.value = escapers[lang](input);
      } else {
        outputEl.value = unescapers[lang](input);
      }
    }

    function updateLabels() {
      if (currentMode === "escape") {
        inputLabel.textContent = "変換する文字列";
        inputEl.placeholder = "エスケープしたい文字列を入力してください...";
      } else {
        inputLabel.textContent = "エスケープされた文字列";
        inputEl.placeholder = "アンエスケープしたい文字列を入力してください...";
      }
    }

    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabBtns.forEach(function (b) { b.classList.remove("tab-btn--active"); });
        btn.classList.add("tab-btn--active");
        currentMode = btn.getAttribute("data-tab");
        updateLabels();
        convert();
      });
    });

    inputEl.addEventListener("input", convert);
    langSelect.addEventListener("change", convert);

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      window.DevToolBox.copyToClipboard(text).then(function () {
        window.DevToolBox.showFeedback("コピーしました", "success");
      });
    });
  });
})();
