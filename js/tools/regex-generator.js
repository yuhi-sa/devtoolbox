"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var presetGrid = document.getElementById("preset-grid");
    var customChars = document.getElementById("custom-chars");
    var customQuantifier = document.getElementById("custom-quantifier");
    var customN = document.getElementById("custom-n");
    var customM = document.getElementById("custom-m");
    var btnAddCustom = document.getElementById("btn-add-custom");
    var optStart = document.getElementById("opt-start");
    var optEnd = document.getElementById("opt-end");
    var optCase = document.getElementById("opt-case");
    var optGlobal = document.getElementById("opt-global");
    var optMultiline = document.getElementById("opt-multiline");
    var btnGenerate = document.getElementById("btn-generate");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var regexOutput = document.getElementById("regex-output");
    var regexExplain = document.getElementById("regex-explain");
    var successEl = document.getElementById("regex-success");
    var testInput = document.getElementById("test-input");
    var testHighlight = document.getElementById("test-highlight");
    var matchCountEl = document.getElementById("match-count");

    var customPatterns = [];

    var presets = {
      email: {
        pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
        explain: "メールアドレスにマッチします。ローカル部（英数字・記号）+ @ + ドメイン名"
      },
      url: {
        pattern: "https?:\\/\\/[a-zA-Z0-9\\-._~:/?#\\[\\]@!$&'()*+,;=%]+",
        explain: "http:// または https:// で始まるURLにマッチします"
      },
      ipv4: {
        pattern: "(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)(?:\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)){3}",
        explain: "IPv4アドレス（0.0.0.0 ~ 255.255.255.255）にマッチします"
      },
      ipv6: {
        pattern: "(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}",
        explain: "IPv6アドレスにマッチします（省略なしフルフォーマットのみ対応。::による省略形式は非対応）"
      },
      phone: {
        pattern: "0\\d{1,4}[\\-\\s]?\\d{1,4}[\\-\\s]?\\d{3,4}",
        explain: "日本の電話番号（固定電話・携帯電話）にマッチします。ハイフンあり・なし両対応"
      },
      "date-hyphen": {
        pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])",
        explain: "YYYY-MM-DD形式の日付にマッチします"
      },
      "date-slash": {
        pattern: "\\d{4}/(?:0[1-9]|1[0-2])/(?:0[1-9]|[12]\\d|3[01])",
        explain: "YYYY/MM/DD形式の日付にマッチします"
      },
      integer: {
        pattern: "-?\\d+",
        explain: "整数（正の数・負の数）にマッチします"
      },
      decimal: {
        pattern: "-?\\d+\\.\\d+",
        explain: "小数点を含む数値にマッチします"
      },
      hiragana: {
        pattern: "[\\u3040-\\u309F]+",
        explain: "ひらがな文字列にマッチします"
      },
      katakana: {
        pattern: "[\\u30A0-\\u30FF]+",
        explain: "カタカナ文字列にマッチします"
      },
      kanji: {
        pattern: "[\\u4E00-\\u9FFF]+",
        explain: "漢字文字列にマッチします"
      }
    };

    customQuantifier.addEventListener("change", function () {
      var val = customQuantifier.value;
      if (val === "{n}") {
        customN.hidden = false;
        customM.hidden = true;
      } else if (val === "{n,m}") {
        customN.hidden = false;
        customM.hidden = false;
      } else {
        customN.hidden = true;
        customM.hidden = true;
      }
    });

    btnAddCustom.addEventListener("click", function () {
      var chars = customChars.value.trim();
      if (!chars) return;
      var q = customQuantifier.value;
      if (q === "{n}") {
        var n = customN.value;
        if (!n) return;
        q = "{" + n + "}";
      } else if (q === "{n,m}") {
        var n2 = customN.value;
        var m2 = customM.value;
        if (!n2) return;
        q = m2 ? "{" + n2 + "," + m2 + "}" : "{" + n2 + ",}";
      }
      customPatterns.push({
        pattern: "[" + chars + "]" + q,
        explain: "カスタム文字クラス [" + chars + "] の" + q + "回繰り返し"
      });
      customChars.value = "";
      generate();
    });

    function getSelectedPresets() {
      var checkboxes = presetGrid.querySelectorAll("input[type=checkbox]:checked");
      var selected = [];
      for (var i = 0; i < checkboxes.length; i++) {
        var key = checkboxes[i].getAttribute("data-preset");
        if (presets[key]) {
          selected.push(presets[key]);
        }
      }
      return selected;
    }

    function escapeHtml(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function generate() {
      var selected = getSelectedPresets();
      var allPatterns = selected.concat(customPatterns);

      if (allPatterns.length === 0) {
        regexOutput.textContent = "";
        regexExplain.innerHTML = "";
        testHighlight.innerHTML = "";
        matchCountEl.hidden = true;
        return;
      }

      var parts = [];
      for (var i = 0; i < allPatterns.length; i++) {
        parts.push(allPatterns[i].pattern);
      }

      var combined = parts.length === 1 ? parts[0] : "(?:" + parts.join("|") + ")";
      if (optStart.checked) combined = "^" + combined;
      if (optEnd.checked) combined = combined + "$";

      var flags = "";
      if (optGlobal.checked) flags += "g";
      if (optCase.checked) flags += "i";
      if (optMultiline.checked) flags += "m";

      var display = "/" + combined + "/" + flags;
      regexOutput.textContent = display;

      // Build explanation
      var html = "";
      for (var j = 0; j < allPatterns.length; j++) {
        html += "<dt>" + escapeHtml(allPatterns[j].pattern) + "</dt>";
        html += "<dd>" + escapeHtml(allPatterns[j].explain) + "</dd>";
      }
      if (optStart.checked) {
        html += "<dt>^</dt><dd>文字列の先頭にアンカー</dd>";
      }
      if (optEnd.checked) {
        html += "<dt>$</dt><dd>文字列の末尾にアンカー</dd>";
      }
      if (flags) {
        html += "<dt>フラグ: " + escapeHtml(flags) + "</dt><dd>";
        var flagExplains = [];
        if (flags.indexOf("g") !== -1) flagExplains.push("g = グローバル検索");
        if (flags.indexOf("i") !== -1) flagExplains.push("i = 大文字小文字無視");
        if (flags.indexOf("m") !== -1) flagExplains.push("m = 複数行モード");
        html += escapeHtml(flagExplains.join("、")) + "</dd>";
      }
      regexExplain.innerHTML = html;

      // Run test if there's test input
      runTest(combined, flags);
    }

    function runTest(pattern, flags) {
      var testString = testInput.value;
      matchCountEl.hidden = true;

      if (!pattern || !testString) {
        testHighlight.innerHTML = escapeHtml(testString || "");
        return;
      }

      var regex;
      try {
        regex = new RegExp(pattern, flags);
      } catch (e) {
        testHighlight.innerHTML = escapeHtml(testString);
        return;
      }

      var matches = [];
      var match;

      if (flags.indexOf("g") !== -1) {
        while ((match = regex.exec(testString)) !== null) {
          matches.push({ value: match[0], index: match.index });
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matches.push({ value: match[0], index: match.index });
        }
      }

      if (matches.length === 0) {
        testHighlight.innerHTML = escapeHtml(testString);
        matchCountEl.textContent = "マッチなし";
        matchCountEl.hidden = false;
        return;
      }

      var html = "";
      var lastIndex = 0;
      for (var i = 0; i < matches.length; i++) {
        var m = matches[i];
        if (m.index > lastIndex) {
          html += escapeHtml(testString.substring(lastIndex, m.index));
        }
        html += "<mark>" + escapeHtml(m.value) + "</mark>";
        lastIndex = m.index + m.value.length;
      }
      if (lastIndex < testString.length) {
        html += escapeHtml(testString.substring(lastIndex));
      }
      testHighlight.innerHTML = html;

      matchCountEl.textContent = matches.length + " 件のマッチ";
      matchCountEl.hidden = false;
    }

    btnGenerate.addEventListener("click", generate);

    testInput.addEventListener("input", function () {
      // Re-run test with current regex
      var text = regexOutput.textContent;
      if (!text) return;
      var m = text.match(/^\/(.+)\/([gimsuy]*)$/);
      if (m) {
        runTest(m[1], m[2]);
      }
    });

    btnCopy.addEventListener("click", function () {
      var text = regexOutput.textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        successEl.textContent = "コピーしました。";
        successEl.hidden = false;
        setTimeout(function () { successEl.hidden = true; }, 2000);
      });
    });

    btnClear.addEventListener("click", function () {
      var checkboxes = presetGrid.querySelectorAll("input[type=checkbox]:checked");
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
      customPatterns = [];
      customChars.value = "";
      optStart.checked = false;
      optEnd.checked = false;
      optCase.checked = false;
      optGlobal.checked = true;
      optMultiline.checked = false;
      regexOutput.textContent = "";
      regexExplain.innerHTML = "";
      testInput.value = "";
      testHighlight.innerHTML = "";
      matchCountEl.hidden = true;
      successEl.hidden = true;
    });
  });
})();
