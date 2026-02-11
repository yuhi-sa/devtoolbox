"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var countEl = document.getElementById("uuid-count");
    var uppercaseEl = document.getElementById("uuid-uppercase");
    var noHyphensEl = document.getElementById("uuid-no-hyphens");
    var outputEl = document.getElementById("uuid-output");
    var successEl = document.getElementById("uuid-success");
    var btnGenerate = document.getElementById("btn-generate");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function generateUUIDv4() {
      // RFC 4122 version 4 UUID
      var bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);

      // version 4
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      // variant 10xx
      bytes[8] = (bytes[8] & 0x3f) | 0x80;

      var hex = "";
      for (var i = 0; i < 16; i++) {
        hex += (bytes[i] < 16 ? "0" : "") + bytes[i].toString(16);
      }

      // フォーマット: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      var uuid = hex.slice(0, 8) + "-" +
                 hex.slice(8, 12) + "-" +
                 hex.slice(12, 16) + "-" +
                 hex.slice(16, 20) + "-" +
                 hex.slice(20, 32);

      return uuid;
    }

    function formatUUID(uuid) {
      if (noHyphensEl.checked) {
        uuid = uuid.replace(/-/g, "");
      }
      if (uppercaseEl.checked) {
        uuid = uuid.toUpperCase();
      }
      return uuid;
    }

    btnGenerate.addEventListener("click", function () {
      var count = parseInt(countEl.value, 10);
      if (isNaN(count) || count < 1) count = 1;
      if (count > 100) count = 100;
      countEl.value = count;

      var results = [];
      for (var i = 0; i < count; i++) {
        results.push(formatUUID(generateUUIDv4()));
      }

      outputEl.value = results.join("\n");
      showSuccess(count + "件のUUIDを生成しました。");
    });

    btnClear.addEventListener("click", function () {
      outputEl.value = "";
    });

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });
  });
})();
