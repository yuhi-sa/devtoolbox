"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var patternEl = document.getElementById("regex-pattern");
    var testStringEl = document.getElementById("regex-test-string");
    var highlightEl = document.getElementById("regex-highlight");
    var errorEl = document.getElementById("regex-error");
    var matchCountEl = document.getElementById("match-count");
    var matchListEl = document.getElementById("match-list");
    var btnClear = document.getElementById("btn-clear");

    var flagG = document.getElementById("flag-g");
    var flagI = document.getElementById("flag-i");
    var flagM = document.getElementById("flag-m");
    var flagS = document.getElementById("flag-s");

    function getFlags() {
      var flags = "";
      if (flagG.checked) flags += "g";
      if (flagI.checked) flags += "i";
      if (flagM.checked) flags += "m";
      if (flagS.checked) flags += "s";
      return flags;
    }

    var escapeHtml = window.DevToolBox.escapeHtml;

    var MAX_TEST_STRING_LENGTH = 100000;
    var REGEX_TIMEOUT_MS = 2000;

    var MAX_MATCH_ITERATIONS = 10000;

    function runRegexWithTimeout(regex, testString) {
      var matches = [];
      var startTime = Date.now();
      var iterations = 0;

      if (regex.global) {
        var match;
        while ((match = regex.exec(testString)) !== null) {
          iterations++;
          matches.push({
            value: match[0],
            index: match.index,
            groups: Array.prototype.slice.call(match, 1)
          });
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
          if (iterations >= MAX_MATCH_ITERATIONS || Date.now() - startTime > REGEX_TIMEOUT_MS) {
            return { matches: matches, timedOut: true };
          }
        }
      } else {
        var match = regex.exec(testString);
        if (match) {
          matches.push({
            value: match[0],
            index: match.index,
            groups: Array.prototype.slice.call(match, 1)
          });
        }
      }

      return { matches: matches, timedOut: false };
    }

    function updateHighlight() {
      var pattern = patternEl.value;
      var testString = testStringEl.value;

      // Reset
      errorEl.hidden = true;
      matchCountEl.hidden = true;
      matchListEl.innerHTML = "";

      if (!pattern || !testString) {
        highlightEl.innerHTML = escapeHtml(testString || "");
        return;
      }

      if (testString.length > MAX_TEST_STRING_LENGTH) {
        errorEl.textContent = "テスト文字列が長すぎます（最大 " + MAX_TEST_STRING_LENGTH.toLocaleString() + " 文字）。";
        errorEl.hidden = false;
        highlightEl.innerHTML = "";
        return;
      }

      var regex;
      try {
        regex = new RegExp(pattern, getFlags());
      } catch (e) {
        errorEl.textContent = "正規表現エラー: " + e.message;
        errorEl.hidden = false;
        highlightEl.innerHTML = escapeHtml(testString);
        return;
      }

      // Check for zero-length match infinite loop risk
      if (regex.global && regex.test("") && pattern === "") {
        highlightEl.innerHTML = escapeHtml(testString);
        return;
      }
      regex.lastIndex = 0;

      var result = runRegexWithTimeout(regex, testString);
      var matches = result.matches;

      if (result.timedOut) {
        errorEl.textContent = "正規表現の実行がタイムアウトしました（" + (REGEX_TIMEOUT_MS / 1000) + "秒）。パターンを見直してください。";
        errorEl.hidden = false;
        highlightEl.innerHTML = escapeHtml(testString);
        return;
      }

      // Build highlighted HTML
      if (matches.length === 0) {
        highlightEl.innerHTML = escapeHtml(testString);
        matchCountEl.textContent = "マッチなし";
        matchCountEl.hidden = false;
        return;
      }

      var html = "";
      var lastIndex = 0;

      for (var i = 0; i < matches.length; i++) {
        var m = matches[i];
        // Add text before match
        if (m.index > lastIndex) {
          html += escapeHtml(testString.substring(lastIndex, m.index));
        }
        // Add highlighted match
        html += "<mark>" + escapeHtml(m.value) + "</mark>";
        lastIndex = m.index + m.value.length;
      }
      // Add remaining text
      if (lastIndex < testString.length) {
        html += escapeHtml(testString.substring(lastIndex));
      }

      highlightEl.innerHTML = html;

      // Show match count
      matchCountEl.textContent = matches.length + " 件のマッチ";
      matchCountEl.hidden = false;

      // Show match details
      var listHtml = "";
      for (var j = 0; j < matches.length; j++) {
        var item = matches[j];
        listHtml += '<div class="match-item">';
        listHtml += "<strong>マッチ " + (j + 1) + ":</strong> ";
        listHtml += '"' + escapeHtml(item.value) + '"';
        listHtml += " （位置: " + item.index + " - " + (item.index + item.value.length) + "）";
        if (item.groups.length > 0) {
          for (var k = 0; k < item.groups.length; k++) {
            var groupVal = item.groups[k];
            listHtml += '<br>  グループ ' + (k + 1) + ': ';
            listHtml += groupVal !== undefined ? '"' + escapeHtml(groupVal) + '"' : "（未マッチ）";
          }
        }
        listHtml += "</div>";
      }
      matchListEl.innerHTML = listHtml;
    }

    // Real-time updates
    patternEl.addEventListener("input", updateHighlight);
    testStringEl.addEventListener("input", updateHighlight);
    flagG.addEventListener("change", updateHighlight);
    flagI.addEventListener("change", updateHighlight);
    flagM.addEventListener("change", updateHighlight);
    flagS.addEventListener("change", updateHighlight);

    btnClear.addEventListener("click", function () {
      patternEl.value = "";
      testStringEl.value = "";
      highlightEl.innerHTML = "";
      errorEl.hidden = true;
      matchCountEl.hidden = true;
      matchListEl.innerHTML = "";
    });
  });
})();
