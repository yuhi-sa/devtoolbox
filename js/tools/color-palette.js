"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var colorPicker = document.getElementById("cp-color");
    var hexInput = document.getElementById("cp-hex");
    var modeSelect = document.getElementById("cp-mode");
    var paletteContainer = document.getElementById("cp-palette");
    var successEl = document.getElementById("cp-success");
    var btnCopyCss = document.getElementById("btn-copy-css");
    var btnCopyAll = document.getElementById("btn-copy-all");

    var currentPalette = [];

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    // HEX -> RGB
    function hexToRgb(hex) {
      hex = hex.replace(/^#/, "");
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) return null;
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    }

    // RGB -> HEX
    function rgbToHex(r, g, b) {
      function toHex(n) {
        var h = Math.round(Math.max(0, Math.min(255, n))).toString(16);
        return h.length === 1 ? "0" + h : h;
      }
      return "#" + toHex(r) + toHex(g) + toHex(b);
    }

    // RGB -> HSL
    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if (max === min) {
        h = 0; s = 0;
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
      }

      return { h: h * 360, s: s * 100, l: l * 100 };
    }

    // HSL -> RGB
    function hslToRgb(h, s, l) {
      h /= 360; s /= 100; l /= 100;
      var r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    }

    function normalizeHue(h) {
      return ((h % 360) + 360) % 360;
    }

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    // Generate palette based on mode
    function generatePalette(hex, mode) {
      var rgb = hexToRgb(hex);
      if (!rgb) return [];
      var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      var colors = [];

      switch (mode) {
        case "complementary":
          colors.push({ h: hsl.h, s: hsl.s, l: hsl.l, label: "ベース" });
          colors.push({ h: normalizeHue(hsl.h + 180), s: hsl.s, l: hsl.l, label: "補色" });
          colors.push({ h: hsl.h, s: hsl.s, l: clamp(hsl.l + 15, 0, 100), label: "ライト" });
          colors.push({ h: normalizeHue(hsl.h + 180), s: hsl.s, l: clamp(hsl.l + 15, 0, 100), label: "補色ライト" });
          colors.push({ h: hsl.h, s: hsl.s, l: clamp(hsl.l - 15, 0, 100), label: "ダーク" });
          break;

        case "analogous":
          colors.push({ h: normalizeHue(hsl.h - 30), s: hsl.s, l: hsl.l, label: "-30\u00b0" });
          colors.push({ h: normalizeHue(hsl.h - 15), s: hsl.s, l: hsl.l, label: "-15\u00b0" });
          colors.push({ h: hsl.h, s: hsl.s, l: hsl.l, label: "ベース" });
          colors.push({ h: normalizeHue(hsl.h + 15), s: hsl.s, l: hsl.l, label: "+15\u00b0" });
          colors.push({ h: normalizeHue(hsl.h + 30), s: hsl.s, l: hsl.l, label: "+30\u00b0" });
          break;

        case "triadic":
          colors.push({ h: hsl.h, s: hsl.s, l: hsl.l, label: "ベース" });
          colors.push({ h: normalizeHue(hsl.h + 120), s: hsl.s, l: hsl.l, label: "+120\u00b0" });
          colors.push({ h: normalizeHue(hsl.h + 240), s: hsl.s, l: hsl.l, label: "+240\u00b0" });
          colors.push({ h: hsl.h, s: hsl.s, l: clamp(hsl.l + 20, 0, 100), label: "ベースライト" });
          colors.push({ h: hsl.h, s: hsl.s, l: clamp(hsl.l - 20, 0, 100), label: "ベースダーク" });
          break;

        case "split-complementary":
          colors.push({ h: hsl.h, s: hsl.s, l: hsl.l, label: "ベース" });
          colors.push({ h: normalizeHue(hsl.h + 150), s: hsl.s, l: hsl.l, label: "+150\u00b0" });
          colors.push({ h: normalizeHue(hsl.h + 210), s: hsl.s, l: hsl.l, label: "+210\u00b0" });
          colors.push({ h: hsl.h, s: hsl.s, l: clamp(hsl.l + 20, 0, 100), label: "ベースライト" });
          colors.push({ h: hsl.h, s: hsl.s, l: clamp(hsl.l - 20, 0, 100), label: "ベースダーク" });
          break;

        case "monochromatic":
          colors.push({ h: hsl.h, s: hsl.s, l: clamp(hsl.l + 30, 0, 100), label: "最明" });
          colors.push({ h: hsl.h, s: hsl.s, l: clamp(hsl.l + 15, 0, 100), label: "明" });
          colors.push({ h: hsl.h, s: hsl.s, l: hsl.l, label: "ベース" });
          colors.push({ h: hsl.h, s: hsl.s, l: clamp(hsl.l - 15, 0, 100), label: "暗" });
          colors.push({ h: hsl.h, s: hsl.s, l: clamp(hsl.l - 30, 0, 100), label: "最暗" });
          break;
      }

      return colors.map(function (c) {
        var rgbVal = hslToRgb(c.h, c.s, c.l);
        var hexVal = rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b);
        return {
          hex: hexVal,
          rgb: "rgb(" + rgbVal.r + ", " + rgbVal.g + ", " + rgbVal.b + ")",
          label: c.label
        };
      });
    }

    function renderPalette() {
      var hex = hexInput.value.trim();
      if (!hex.startsWith("#")) hex = "#" + hex;
      var mode = modeSelect.value;

      currentPalette = generatePalette(hex, mode);
      paletteContainer.innerHTML = "";

      currentPalette.forEach(function (color, index) {
        var card = document.createElement("div");
        card.style.cssText = "flex:1;min-width:120px;max-width:200px;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);cursor:pointer;transition:transform 0.15s;";
        card.title = "クリックしてコピー";

        var swatch = document.createElement("div");
        swatch.style.cssText = "height:80px;background:" + color.hex + ";";
        card.appendChild(swatch);

        var info = document.createElement("div");
        info.style.cssText = "padding:0.5rem;font-size:0.8rem;background:var(--color-surface);";
        info.innerHTML =
          '<div style="font-weight:600;margin-bottom:0.25rem;">' + color.label + "</div>" +
          '<div style="font-family:monospace;">' + color.hex.toUpperCase() + "</div>" +
          '<div style="font-family:monospace;font-size:0.75rem;color:var(--color-text-secondary);">' + color.rgb + "</div>";
        card.appendChild(info);

        card.addEventListener("click", function () {
          window.DevToolBox.copyToClipboard(color.hex.toUpperCase()).then(function () {
            showSuccess(color.hex.toUpperCase() + " をコピーしました。");
          });
        });

        card.addEventListener("mouseenter", function () { card.style.transform = "scale(1.03)"; });
        card.addEventListener("mouseleave", function () { card.style.transform = ""; });

        paletteContainer.appendChild(card);
      });
    }

    // Event listeners
    colorPicker.addEventListener("input", function () {
      hexInput.value = colorPicker.value;
      renderPalette();
    });

    hexInput.addEventListener("input", function () {
      var val = hexInput.value.trim();
      if (!val.startsWith("#")) val = "#" + val;
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        colorPicker.value = val;
        renderPalette();
      }
    });

    modeSelect.addEventListener("change", renderPalette);

    btnCopyCss.addEventListener("click", function () {
      if (currentPalette.length === 0) return;
      var css = ":root {\n";
      currentPalette.forEach(function (color, i) {
        css += "  --color-" + (i + 1) + ": " + color.hex + ";\n";
      });
      css += "}";
      window.DevToolBox.copyToClipboard(css).then(function () {
        showSuccess("CSS変数をコピーしました。");
      });
    });

    btnCopyAll.addEventListener("click", function () {
      if (currentPalette.length === 0) return;
      var text = currentPalette.map(function (c) {
        return c.hex.toUpperCase() + " " + c.rgb;
      }).join("\n");
      window.DevToolBox.copyToClipboard(text).then(function () {
        showSuccess("全カラーをコピーしました。");
      });
    });

    // Initial render
    renderPalette();
  });
})();
