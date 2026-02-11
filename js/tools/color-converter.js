"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var colorPicker = document.getElementById("color-picker");
    var preview = document.getElementById("color-preview");
    var hexInput = document.getElementById("hex-input");
    var rgbR = document.getElementById("rgb-r");
    var rgbG = document.getElementById("rgb-g");
    var rgbB = document.getElementById("rgb-b");
    var hslH = document.getElementById("hsl-h");
    var hslS = document.getElementById("hsl-s");
    var hslL = document.getElementById("hsl-l");
    var hexError = document.getElementById("hex-error");
    var rgbError = document.getElementById("rgb-error");
    var hslError = document.getElementById("hsl-error");
    var successEl = document.getElementById("color-success");
    var copyBtns = document.querySelectorAll("[data-copy]");

    function clearErrors() {
      hexError.hidden = true;
      rgbError.hidden = true;
      hslError.hidden = true;
    }

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    // RGB -> HEX
    function rgbToHex(r, g, b) {
      function toHex(n) {
        var h = n.toString(16);
        return h.length === 1 ? "0" + h : h;
      }
      return "#" + toHex(r) + toHex(g) + toHex(b);
    }

    // HEX -> RGB
    function hexToRgb(hex) {
      hex = hex.replace(/^#/, "");
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(hex)) {
        return null;
      }
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    }

    // RGB -> HSL
    function rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if (max === min) {
        h = 0;
        s = 0;
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) {
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        } else if (max === g) {
          h = ((b - r) / d + 2) / 6;
        } else {
          h = ((r - g) / d + 4) / 6;
        }
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }

    // HSL -> RGB
    function hslToRgb(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;
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

    function updateFromRgb(r, g, b, source) {
      var hex = rgbToHex(r, g, b);
      var hsl = rgbToHsl(r, g, b);

      preview.style.backgroundColor = hex;

      if (source !== "picker") {
        colorPicker.value = hex;
      }
      if (source !== "hex") {
        hexInput.value = hex;
      }
      if (source !== "rgb") {
        rgbR.value = r;
        rgbG.value = g;
        rgbB.value = b;
      }
      if (source !== "hsl") {
        hslH.value = hsl.h;
        hslS.value = hsl.s;
        hslL.value = hsl.l;
      }
    }

    // カラーピッカー変更
    colorPicker.addEventListener("input", function () {
      clearErrors();
      var rgb = hexToRgb(colorPicker.value);
      if (rgb) {
        updateFromRgb(rgb.r, rgb.g, rgb.b, "picker");
      }
    });

    // HEX入力変更
    hexInput.addEventListener("input", function () {
      clearErrors();
      var val = hexInput.value.trim();
      if (!val.startsWith("#")) {
        val = "#" + val;
      }
      var rgb = hexToRgb(val);
      if (rgb) {
        updateFromRgb(rgb.r, rgb.g, rgb.b, "hex");
      } else if (val.length > 1) {
        hexError.textContent = "有効なHEXカラーコードを入力してください（例: #FF0000）";
        hexError.hidden = false;
      }
    });

    // RGB入力変更
    function onRgbChange() {
      clearErrors();
      var r = parseInt(rgbR.value, 10);
      var g = parseInt(rgbG.value, 10);
      var b = parseInt(rgbB.value, 10);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return;
      r = clamp(r, 0, 255);
      g = clamp(g, 0, 255);
      b = clamp(b, 0, 255);
      updateFromRgb(r, g, b, "rgb");
    }
    rgbR.addEventListener("input", onRgbChange);
    rgbG.addEventListener("input", onRgbChange);
    rgbB.addEventListener("input", onRgbChange);

    // HSL入力変更
    function onHslChange() {
      clearErrors();
      var h = parseInt(hslH.value, 10);
      var s = parseInt(hslS.value, 10);
      var l = parseInt(hslL.value, 10);
      if (isNaN(h) || isNaN(s) || isNaN(l)) return;
      h = clamp(h, 0, 360);
      s = clamp(s, 0, 100);
      l = clamp(l, 0, 100);
      var rgb = hslToRgb(h, s, l);
      updateFromRgb(rgb.r, rgb.g, rgb.b, "hsl");
    }
    hslH.addEventListener("input", onHslChange);
    hslS.addEventListener("input", onHslChange);
    hslL.addEventListener("input", onHslChange);

    // コピーボタン
    copyBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var format = btn.getAttribute("data-copy");
        var text = "";
        if (format === "hex") {
          text = hexInput.value;
        } else if (format === "rgb") {
          text = "rgb(" + rgbR.value + ", " + rgbG.value + ", " + rgbB.value + ")";
        } else if (format === "hsl") {
          text = "hsl(" + hslH.value + ", " + hslS.value + "%, " + hslL.value + "%)";
        }
        if (!text) return;
        navigator.clipboard.writeText(text).then(function () {
          showSuccess("コピーしました。");
        });
      });
    });
  });
})();
