"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("byte-input");
    var unitEl = document.getElementById("byte-unit");
    var resultsEl = document.getElementById("byte-results");
    var btnClear = document.getElementById("btn-clear");
    var baseRadios = document.querySelectorAll('input[name="byte-base"]');

    var UNITS_1024 = [
      { name: "B", label: "バイト" },
      { name: "KiB", label: "キビバイト" },
      { name: "MiB", label: "メビバイト" },
      { name: "GiB", label: "ギビバイト" },
      { name: "TiB", label: "テビバイト" },
      { name: "PiB", label: "ペビバイト" }
    ];

    var UNITS_1000 = [
      { name: "B", label: "バイト" },
      { name: "KB", label: "キロバイト" },
      { name: "MB", label: "メガバイト" },
      { name: "GB", label: "ギガバイト" },
      { name: "TB", label: "テラバイト" },
      { name: "PB", label: "ペタバイト" }
    ];

    function getBase() {
      var checked = document.querySelector('input[name="byte-base"]:checked');
      return parseInt(checked.value, 10);
    }

    function formatNumber(num) {
      if (num === 0) return "0";
      if (!isFinite(num)) return "---";

      // Very large or very small numbers: use exponential
      if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && Math.abs(num) > 0)) {
        return num.toExponential(6);
      }

      // For values with decimal parts, show appropriate precision
      if (Number.isInteger(num)) {
        return num.toLocaleString("ja-JP");
      }

      // Trim trailing zeros but keep meaningful decimals
      var str = num.toPrecision(10);
      var parsed = parseFloat(str);
      return parsed.toLocaleString("ja-JP", { maximumFractionDigits: 10 });
    }

    function convert() {
      var value = parseFloat(inputEl.value);
      var unitIndex = parseInt(unitEl.value, 10);
      var base = getBase();
      var units = base === 1024 ? UNITS_1024 : UNITS_1000;

      if (isNaN(value) || value < 0) {
        resultsEl.innerHTML = '<p style="color:var(--color-text-secondary);text-align:center;padding:1rem;">正の数値を入力してください。</p>';
        return;
      }

      // Convert input to bytes first
      var bytes = value * Math.pow(base, unitIndex);

      var html = "";
      for (var i = 0; i < units.length; i++) {
        var converted = bytes / Math.pow(base, i);
        html += '<div class="result__item">';
        html += '<div class="result__label">' + units[i].name + ' (' + units[i].label + ')</div>';
        html += '<div class="result__value">' + formatNumber(converted) + '</div>';
        html += '</div>';
      }
      resultsEl.innerHTML = html;
    }

    inputEl.addEventListener("input", convert);
    unitEl.addEventListener("change", convert);
    baseRadios.forEach(function (radio) {
      radio.addEventListener("change", convert);
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      resultsEl.innerHTML = "";
    });

    // 初期表示
    convert();
  });
})();
