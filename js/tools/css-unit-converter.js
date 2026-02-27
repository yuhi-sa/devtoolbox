"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var valueEl = document.getElementById("css-value");
    var fromUnitEl = document.getElementById("css-from-unit");
    var toUnitEl = document.getElementById("css-to-unit");
    var baseFontEl = document.getElementById("css-base-font");
    var viewportWEl = document.getElementById("css-viewport-width");
    var viewportHEl = document.getElementById("css-viewport-height");
    var resultEl = document.getElementById("css-result");
    var tableEl = document.getElementById("css-table");
    var btnCopy = document.getElementById("btn-copy");

    var UNITS = [
      { value: "px", label: "px" },
      { value: "rem", label: "rem" },
      { value: "em", label: "em" },
      { value: "percent", label: "%" },
      { value: "vw", label: "vw" },
      { value: "vh", label: "vh" },
      { value: "pt", label: "pt" }
    ];

    function getBaseFont() {
      var v = parseFloat(baseFontEl.value);
      return (isNaN(v) || v <= 0) ? 16 : v;
    }

    function getViewportW() {
      var v = parseFloat(viewportWEl.value);
      return (isNaN(v) || v <= 0) ? 1920 : v;
    }

    function getViewportH() {
      var v = parseFloat(viewportHEl.value);
      return (isNaN(v) || v <= 0) ? 1080 : v;
    }

    // Convert any unit to px
    function toPx(value, unit) {
      var baseFont = getBaseFont();
      var vw = getViewportW();
      var vh = getViewportH();

      switch (unit) {
        case "px":      return value;
        case "rem":     return value * baseFont;
        case "em":      return value * baseFont;
        case "percent": return value * baseFont / 100;
        case "vw":      return value * vw / 100;
        case "vh":      return value * vh / 100;
        case "pt":      return value * 96 / 72;
        default:        return value;
      }
    }

    // Convert px to any unit
    function fromPx(px, unit) {
      var baseFont = getBaseFont();
      var vw = getViewportW();
      var vh = getViewportH();

      switch (unit) {
        case "px":      return px;
        case "rem":     return px / baseFont;
        case "em":      return px / baseFont;
        case "percent": return px / baseFont * 100;
        case "vw":      return px / vw * 100;
        case "vh":      return px / vh * 100;
        case "pt":      return px * 72 / 96;
        default:        return px;
      }
    }

    function formatNumber(num) {
      if (num === 0) return "0";
      if (!isFinite(num)) return "---";

      if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && Math.abs(num) > 0)) {
        return num.toExponential(4);
      }

      if (Number.isInteger(num)) {
        return num.toLocaleString("ja-JP");
      }

      // Show up to 4 decimal places, trimming trailing zeros
      var str = num.toFixed(6);
      var parsed = parseFloat(str);
      return parsed.toLocaleString("ja-JP", { maximumFractionDigits: 6 });
    }

    function getUnitLabel(unitValue) {
      for (var i = 0; i < UNITS.length; i++) {
        if (UNITS[i].value === unitValue) return UNITS[i].label;
      }
      return unitValue;
    }

    function convert() {
      var value = parseFloat(valueEl.value);
      var fromUnit = fromUnitEl.value;
      var toUnit = toUnitEl.value;

      if (isNaN(value)) {
        resultEl.textContent = "---";
        tableEl.innerHTML = '<p style="color:var(--color-text-secondary);text-align:center;padding:1rem;">数値を入力してください。</p>';
        return;
      }

      // Single conversion
      var px = toPx(value, fromUnit);
      var result = fromPx(px, toUnit);
      resultEl.textContent = formatNumber(result) + " " + getUnitLabel(toUnit);

      // All units table
      var html = "";
      for (var i = 0; i < UNITS.length; i++) {
        var converted = fromPx(px, UNITS[i].value);
        var isActive = UNITS[i].value === toUnit;
        html += '<div class="result__item" style="' +
          'padding:.75rem 1rem;background:var(--color-bg-secondary);border-radius:8px;' +
          'display:flex;justify-content:space-between;align-items:center;' +
          (isActive ? 'outline:2px solid var(--color-primary);' : '') +
          '">';
        html += '<span class="result__label" style="font-weight:600;color:var(--color-text-secondary);">' + UNITS[i].label + '</span>';
        html += '<span class="result__value" style="font-weight:700;font-family:monospace;font-size:1.05rem;">' + formatNumber(converted) + '</span>';
        html += '</div>';
      }
      tableEl.innerHTML = html;
    }

    // Attach event listeners for real-time conversion
    valueEl.addEventListener("input", convert);
    fromUnitEl.addEventListener("change", convert);
    toUnitEl.addEventListener("change", convert);
    baseFontEl.addEventListener("input", convert);
    viewportWEl.addEventListener("input", convert);
    viewportHEl.addEventListener("input", convert);

    // Copy button
    btnCopy.addEventListener("click", function () {
      var text = resultEl.textContent;
      if (!text || text === "---") return;
      navigator.clipboard.writeText(text).then(function () {
        var original = btnCopy.textContent;
        btnCopy.textContent = "コピーしました！";
        setTimeout(function () {
          btnCopy.textContent = original;
        }, 1500);
      });
    });

    // Initial conversion
    convert();
  });
})();
