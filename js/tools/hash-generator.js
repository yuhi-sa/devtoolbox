"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("hash-input");
    var uppercaseEl = document.getElementById("hash-uppercase");
    var btnClear = document.getElementById("btn-clear");
    var successEl = document.getElementById("hash-success");
    var copyBtns = document.querySelectorAll(".copy-btn[data-target]");
    var debounceTimer = null;

    var hashIds = {
      md5: document.getElementById("hash-md5"),
      sha1: document.getElementById("hash-sha1"),
      sha256: document.getElementById("hash-sha256"),
      sha512: document.getElementById("hash-sha512")
    };

    // 結果を保持（大文字・小文字切替用）
    var currentHashes = { md5: "", sha1: "", sha256: "", sha512: "" };

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function formatHash(hex) {
      return uppercaseEl.checked ? hex.toUpperCase() : hex.toLowerCase();
    }

    function displayHashes() {
      var keys = ["md5", "sha1", "sha256", "sha512"];
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        hashIds[k].textContent = currentHashes[k] ? formatHash(currentHashes[k]) : "-";
      }
    }

    // --- MD5 実装 ---
    function md5(string) {
      var encoder = new TextEncoder();
      var bytes = encoder.encode(string);

      function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
      }

      function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
      }

      function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
      }

      function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
      }

      function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
      }

      function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
      }

      function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
      }

      function md5blk(s) {
        var md5blks = [];
        for (var i = 0; i < 64; i += 4) {
          md5blks[i >> 2] = s[i] + (s[i + 1] << 8) + (s[i + 2] << 16) + (s[i + 3] << 24);
        }
        return md5blks;
      }

      // パディングとハッシュ計算
      var n = bytes.length;
      var state = [1732584193, -271733879, -1732584194, 271733878];
      var i;

      // 64バイトブロックを処理
      for (i = 64; i <= n; i += 64) {
        md5cycle(state, md5blk(bytes.slice(i - 64, i)));
      }

      // 残りをパディング
      var tail = bytes.slice(i - 64);
      var tmp = new Uint8Array(64);
      var j;
      for (j = 0; j < tail.length; j++) {
        tmp[j] = tail[j];
      }
      tmp[tail.length] = 0x80;

      if (tail.length > 55) {
        md5cycle(state, md5blk(tmp));
        tmp = new Uint8Array(64);
      }

      // ビット長を末尾に追加（リトルエンディアン）
      var bitLen = n * 8;
      tmp[56] = bitLen & 0xff;
      tmp[57] = (bitLen >> 8) & 0xff;
      tmp[58] = (bitLen >> 16) & 0xff;
      tmp[59] = (bitLen >> 24) & 0xff;
      tmp[60] = 0;
      tmp[61] = 0;
      tmp[62] = 0;
      tmp[63] = 0;

      md5cycle(state, md5blk(tmp));

      // 16進文字列に変換
      var hex = "";
      for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
          var byte = (state[i] >> (j * 8)) & 0xff;
          hex += (byte < 16 ? "0" : "") + byte.toString(16);
        }
      }
      return hex;
    }

    // --- Web Crypto API でSHAハッシュを計算 ---
    function shaHash(algorithm, text) {
      var encoder = new TextEncoder();
      var data = encoder.encode(text);
      return crypto.subtle.digest(algorithm, data).then(function (buffer) {
        var array = new Uint8Array(buffer);
        var hex = "";
        for (var i = 0; i < array.length; i++) {
          hex += (array[i] < 16 ? "0" : "") + array[i].toString(16);
        }
        return hex;
      });
    }

    function computeHashes() {
      var text = inputEl.value;
      if (!text) {
        currentHashes = { md5: "", sha1: "", sha256: "", sha512: "" };
        displayHashes();
        return;
      }

      // MD5（同期）
      currentHashes.md5 = md5(text);

      // SHA系（非同期）
      Promise.all([
        shaHash("SHA-1", text),
        shaHash("SHA-256", text),
        shaHash("SHA-512", text)
      ]).then(function (results) {
        currentHashes.sha1 = results[0];
        currentHashes.sha256 = results[1];
        currentHashes.sha512 = results[2];
        displayHashes();
      });

      // MD5は先に表示
      displayHashes();
    }

    // デバウンス付きリアルタイム更新
    inputEl.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(computeHashes, 200);
    });

    // 大文字・小文字切替
    uppercaseEl.addEventListener("change", function () {
      displayHashes();
    });

    // クリア
    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      currentHashes = { md5: "", sha1: "", sha256: "", sha512: "" };
      displayHashes();
    });

    // 個別コピー
    copyBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-target");
        var el = document.getElementById(targetId);
        var text = el.textContent;
        if (!text || text === "-") return;
        navigator.clipboard.writeText(text).then(function () {
          showSuccess("コピーしました。");
        });
      });
    });
  });
})();
