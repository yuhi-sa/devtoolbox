"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("text-input");
    var btnClear = document.getElementById("btn-clear");
    var countChars = document.getElementById("count-chars");
    var countCharsNoSpace = document.getElementById("count-chars-no-space");
    var countLines = document.getElementById("count-lines");
    var countWords = document.getElementById("count-words");
    var countBytes = document.getElementById("count-bytes");

    function updateCounts() {
      var text = inputEl.value;

      // 文字数（スペース含む）
      countChars.textContent = text.length;

      // 文字数（スペース除く）- 半角スペース、全角スペース、タブを除外
      var noSpaceText = text.replace(/[\s\u3000]/g, "");
      countCharsNoSpace.textContent = noSpaceText.length;

      // 行数
      if (text === "") {
        countLines.textContent = 0;
      } else {
        countLines.textContent = text.split("\n").length;
      }

      // 単語数
      var trimmed = text.trim();
      if (trimmed === "") {
        countWords.textContent = 0;
      } else {
        var words = trimmed.split(/\s+/);
        countWords.textContent = words.length;
      }

      // バイト数（UTF-8）
      var encoder = new TextEncoder();
      countBytes.textContent = encoder.encode(text).length;
    }

    inputEl.addEventListener("input", updateCounts);

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      updateCounts();
    });

    // 初期表示
    updateCounts();
  });
})();
