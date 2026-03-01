"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("token-input");
    var modelSelect = document.getElementById("model-select");
    var statChars = document.getElementById("stat-chars");
    var statWords = document.getElementById("stat-words");
    var statLines = document.getElementById("stat-lines");
    var statTokens = document.getElementById("stat-tokens");
    var btnClear = document.getElementById("btn-clear");

    // Token estimation ratios per character
    // English: ~4 chars/token for GPT, ~3.5 for Claude
    // Japanese: ~1.5 chars/token for GPT, ~1.5 for Claude
    var models = {
      gpt4: { enRatio: 4, jpRatio: 1.5 },
      gpt35: { enRatio: 4, jpRatio: 1.5 },
      claude: { enRatio: 3.5, jpRatio: 1.5 }
    };

    function isJapanese(char) {
      var code = char.charCodeAt(0);
      // Hiragana, Katakana, CJK Unified Ideographs, CJK symbols
      return (code >= 0x3000 && code <= 0x9FFF) ||
             (code >= 0xF900 && code <= 0xFAFF) ||
             (code >= 0xFF00 && code <= 0xFFEF);
    }

    function countTokens(text, model) {
      if (!text) return 0;
      var config = models[model] || models.gpt4;
      var jpChars = 0;
      var enChars = 0;

      for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        if (/\s/.test(ch)) continue;
        if (isJapanese(ch)) {
          jpChars++;
        } else {
          enChars++;
        }
      }

      var jpTokens = jpChars / config.jpRatio;
      var enTokens = enChars / config.enRatio;
      return Math.ceil(jpTokens + enTokens);
    }

    function countWords(text) {
      if (!text.trim()) return 0;
      // Split by whitespace and filter empty strings
      var words = text.trim().split(/\s+/);
      return words.length;
    }

    function countLines(text) {
      if (!text) return 0;
      return text.split("\n").length;
    }

    function update() {
      var text = inputEl.value;
      var model = modelSelect.value;

      statChars.textContent = text.length.toLocaleString();
      statWords.textContent = countWords(text).toLocaleString();
      statLines.textContent = countLines(text).toLocaleString();
      statTokens.textContent = countTokens(text, model).toLocaleString();
    }

    inputEl.addEventListener("input", update);
    modelSelect.addEventListener("change", update);

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      update();
    });

    // Initial update
    update();
  });
})();
