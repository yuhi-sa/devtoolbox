"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var textInput = document.getElementById("text-input");
    var btnClear = document.getElementById("btn-clear");
    var statWords = document.getElementById("stat-words");
    var statChars = document.getElementById("stat-chars");
    var statCharsNoSpace = document.getElementById("stat-chars-no-space");
    var statSentences = document.getElementById("stat-sentences");
    var statParagraphs = document.getElementById("stat-paragraphs");
    var statReadingTime = document.getElementById("stat-reading-time");
    var keywordTbody = document.getElementById("keyword-tbody");
    var statWordsLabel = document.getElementById("stat-words-label");
    var fileInput = document.getElementById("file-input");
    var fileUploadArea = document.getElementById("file-upload-area");

    // Japanese character regex
    var jpRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3400-\u4DBF]/g;
    // Common stop words to exclude from keyword analysis
    var stopWords = new Set([
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
      "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
      "being", "have", "has", "had", "do", "does", "did", "will", "would",
      "could", "should", "may", "might", "shall", "can", "need", "must",
      "it", "its", "this", "that", "these", "those", "i", "you", "he", "she",
      "we", "they", "me", "him", "her", "us", "them", "my", "your", "his",
      "our", "their", "what", "which", "who", "when", "where", "why", "how",
      "not", "no", "nor", "as", "if", "then", "than", "too", "very", "just",
      "about", "also", "so", "up", "out", "all", "into", "over", "after",
      "の", "は", "が", "を", "に", "へ", "で", "と", "も", "や", "か",
      "な", "だ", "です", "ます", "た", "て", "し", "する", "ない", "ある",
      "この", "その", "あの", "どの", "こと", "もの", "よう", "ため"
    ]);

    function countWords(text) {
      if (!text.trim()) return 0;
      // Count English words
      var englishWords = text.match(/[a-zA-Z0-9]+(?:[''-][a-zA-Z0-9]+)*/g) || [];
      // Count Japanese character clusters as separate "words"
      var jpChars = text.match(jpRegex) || [];
      return englishWords.length + jpChars.length;
    }

    function countSentences(text) {
      if (!text.trim()) return 0;
      // English sentence endings + Japanese sentence endings
      var sentences = text.split(/[.!?\u3002\uFF01\uFF1F]+/).filter(function (s) {
        return s.trim().length > 0;
      });
      return sentences.length;
    }

    function countParagraphs(text) {
      if (!text.trim()) return 0;
      return text.split(/\n\s*\n/).filter(function (p) {
        return p.trim().length > 0;
      }).length;
    }

    function estimateReadingTime(text) {
      var jpChars = (text.match(jpRegex) || []).length;
      var englishWords = (text.match(/[a-zA-Z0-9]+(?:[''-][a-zA-Z0-9]+)*/g) || []).length;
      // Japanese: ~500 chars/min, English: ~200 words/min
      var minutes = (jpChars / 500) + (englishWords / 200);
      if (minutes < 1) return "1分未満";
      return Math.ceil(minutes) + "分";
    }

    function getKeywordDensity(text) {
      var words = text.toLowerCase().match(/[a-zA-Z0-9]+(?:[''-][a-zA-Z0-9]+)*/g) || [];
      var freq = {};
      var total = words.length;
      words.forEach(function (w) {
        if (w.length < 2 || stopWords.has(w)) return;
        freq[w] = (freq[w] || 0) + 1;
      });

      // Also extract Japanese 2-char and 3-char segments for frequency
      var jpText = text.replace(/[a-zA-Z0-9\s\n\r.,!?;:'"()\[\]{}]/g, "");
      for (var len = 2; len <= 3; len++) {
        for (var i = 0; i <= jpText.length - len; i++) {
          var seg = jpText.substring(i, i + len);
          if (/^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3400-\u4DBF]+$/.test(seg)) {
            var isStop = true;
            for (var ci = 0; ci < seg.length; ci++) {
              if (!stopWords.has(seg[ci])) { isStop = false; break; }
            }
            if (!isStop) {
              freq[seg] = (freq[seg] || 0) + 1;
            }
          }
        }
      }

      var sorted = Object.keys(freq).sort(function (a, b) {
        return freq[b] - freq[a];
      }).slice(0, 10);

      // Total tokens = English words + Japanese characters for density calculation
      var jpCharCount = (text.match(jpRegex) || []).length;
      var totalTokens = total + jpCharCount || 1;
      return sorted.map(function (word) {
        return { word: word, count: freq[word], density: ((freq[word] / totalTokens) * 100).toFixed(1) };
      });
    }

    function isJapanesePrimary(text) {
      var jpChars = (text.match(jpRegex) || []).length;
      var enWords = (text.match(/[a-zA-Z]+/g) || []).join("").length;
      return jpChars > enWords;
    }

    function updateStats() {
      var text = textInput.value;
      var words = countWords(text);
      var chars = text.length;
      var charsNoSpace = text.replace(/\s/g, "").length;
      var sentences = countSentences(text);
      var paragraphs = countParagraphs(text);
      var readingTime = estimateReadingTime(text);

      var jpPrimary = isJapanesePrimary(text);
      statWordsLabel.textContent = jpPrimary ? "単語数（英単語+日本語文字）" : "単語数";

      statWords.textContent = words;
      statChars.textContent = chars;
      statCharsNoSpace.textContent = charsNoSpace;
      statSentences.textContent = sentences;
      statParagraphs.textContent = paragraphs;
      statReadingTime.textContent = readingTime;

      // Keyword density
      var keywords = getKeywordDensity(text);
      if (keywords.length === 0) {
        keywordTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--color-text-secondary);">テキストを入力すると結果が表示されます</td></tr>';
      } else {
        keywordTbody.innerHTML = "";
        keywords.forEach(function (kw, i) {
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + (i + 1) + "</td><td>" + escapeHTML(kw.word) + "</td><td>" + kw.count + "</td><td>" + kw.density + "%</td>";
          keywordTbody.appendChild(tr);
        });
      }
    }

    function escapeHTML(str) {
      var div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    textInput.addEventListener("input", updateStats);

    btnClear.addEventListener("click", function () {
      textInput.value = "";
      updateStats();
    });

    // File upload
    fileUploadArea.addEventListener("click", function () {
      fileInput.click();
    });

    fileUploadArea.addEventListener("dragover", function (e) {
      e.preventDefault();
      fileUploadArea.style.borderColor = "var(--color-primary)";
    });

    fileUploadArea.addEventListener("dragleave", function () {
      fileUploadArea.style.borderColor = "";
    });

    fileUploadArea.addEventListener("drop", function (e) {
      e.preventDefault();
      fileUploadArea.style.borderColor = "";
      var files = e.dataTransfer.files;
      if (files.length > 0) loadFile(files[0]);
    });

    fileInput.addEventListener("change", function () {
      if (fileInput.files.length > 0) loadFile(fileInput.files[0]);
    });

    function loadFile(file) {
      if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
        alert("テキストファイル（.txt）のみ対応しています。");
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        textInput.value = e.target.result;
        updateStats();
      };
      reader.readAsText(file);
    }

    // Initial
    updateStats();
  });
})();
