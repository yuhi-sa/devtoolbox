"use strict";

(function () {
  // ============================================================
  // QR Code Generator - Byte mode, Error Correction Level L
  // Supports QR versions 1-10
  // ============================================================

  // EC Level L version data (verified from ISO 18004)
  // totalDataCW = sum of all data codewords across all blocks
  // ecPerBlock = EC codewords per block
  // blocks = [{n: numBlocks, d: dataCWPerBlock}, ...]
  //
  // V1-L:  26 total CW, 19 data, 7 EC, 1 block of 19
  // V2-L:  44 total CW, 34 data, 10 EC, 1 block of 34
  // V3-L:  70 total CW, 55 data, 15 EC, 1 block of 55
  // V4-L: 100 total CW, 80 data, 20 EC, 1 block of 80
  // V5-L: 134 total CW, 108 data, 26 EC, 1 block of 108
  // V6-L: 172 total CW, 136 data, 18 EC, 2 blocks of 68
  // V7-L: 196 total CW, 156 data, 20 EC, 2 blocks of 78
  // V8-L: 242 total CW, 194 data, 24 EC, 2 blocks of 97
  // V9-L: 292 total CW, 232 data, 30 EC, 2 blocks of 116
  // V10-L: 346 total CW, 274 data, 18 EC, 2*68 + 2*69

  var VER = [
    null,
    { s: 21, ecPB: 7,  groups: [{ n: 1, d: 19 }] },
    { s: 25, ecPB: 10, groups: [{ n: 1, d: 34 }] },
    { s: 29, ecPB: 15, groups: [{ n: 1, d: 55 }] },
    { s: 33, ecPB: 20, groups: [{ n: 1, d: 80 }] },
    { s: 37, ecPB: 26, groups: [{ n: 1, d: 108 }] },
    { s: 41, ecPB: 18, groups: [{ n: 2, d: 68 }] },
    { s: 45, ecPB: 20, groups: [{ n: 2, d: 78 }] },
    { s: 49, ecPB: 24, groups: [{ n: 2, d: 97 }] },
    { s: 53, ecPB: 30, groups: [{ n: 2, d: 116 }] },
    { s: 57, ecPB: 18, groups: [{ n: 2, d: 68 }, { n: 2, d: 69 }] }
  ];

  // Alignment pattern center positions
  var ALIGN_POS = [
    null, [], [6, 18], [6, 22], [6, 26], [6, 30],
    [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 52]
  ];

  // Format info bits for EC Level L, masks 0-7
  var FORMAT_BITS = [
    0x77C4, 0x72F3, 0x7DAA, 0x789D,
    0x662F, 0x6318, 0x6C41, 0x6976
  ];

  // GF(256) tables
  var GF_EXP = new Array(512);
  var GF_LOG = new Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      GF_EXP[i] = x;
      GF_LOG[x] = i;
      x <<= 1;
      if (x & 256) x ^= 0x11D;
    }
    for (var j = 255; j < 512; j++) GF_EXP[j] = GF_EXP[j - 255];
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return GF_EXP[GF_LOG[a] + GF_LOG[b]];
  }

  function rsEncode(data, ecCount) {
    var gen = [1];
    for (var i = 0; i < ecCount; i++) {
      var ng = new Array(gen.length + 1);
      for (var k = 0; k < ng.length; k++) ng[k] = 0;
      for (var j = 0; j < gen.length; j++) {
        ng[j] ^= gen[j];
        ng[j + 1] ^= gfMul(gen[j], GF_EXP[i]);
      }
      gen = ng;
    }
    var rem = new Array(ecCount);
    for (var r = 0; r < ecCount; r++) rem[r] = 0;
    for (var d = 0; d < data.length; d++) {
      var coef = data[d] ^ rem[0];
      rem.shift();
      rem.push(0);
      if (coef !== 0) {
        for (var e = 0; e < ecCount; e++) {
          rem[e] ^= gfMul(coef, gen[e + 1]);
        }
      }
    }
    return rem;
  }

  function textToUtf8(text) {
    var bytes = [];
    for (var i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);
      if (code < 0x80) {
        bytes.push(code);
      } else if (code < 0x800) {
        bytes.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
      } else if (code >= 0xD800 && code < 0xDC00 && i + 1 < text.length) {
        var low = text.charCodeAt(i + 1);
        if (low >= 0xDC00 && low < 0xE000) {
          var cp = ((code - 0xD800) << 10) + (low - 0xDC00) + 0x10000;
          bytes.push(0xF0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3F),
                     0x80 | ((cp >> 6) & 0x3F), 0x80 | (cp & 0x3F));
          i++;
          continue;
        }
        bytes.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
      } else {
        bytes.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
      }
    }
    return bytes;
  }

  function totalDataCW(version) {
    var info = VER[version];
    var t = 0;
    for (var g = 0; g < info.groups.length; g++) t += info.groups[g].n * info.groups[g].d;
    return t;
  }

  function pickVersion(utf8Len) {
    for (var v = 1; v <= 10; v++) {
      // Byte mode overhead: 4 bits mode + 8 bits count (v<=9) or 16 bits (v>=10)
      var overheadBits = 4 + (v <= 9 ? 8 : 16);
      var availBits = totalDataCW(v) * 8;
      if (overheadBits + utf8Len * 8 + 4 <= availBits) return v; // +4 for terminator at most
      // Even if terminator doesn't fully fit, it's ok if data fits
      if (overheadBits + utf8Len * 8 <= availBits) return v;
    }
    return -1;
  }

  function encodeData(utf8, version) {
    var total = totalDataCW(version);
    var bits = [];
    function push(val, n) {
      for (var i = n - 1; i >= 0; i--) bits.push((val >> i) & 1);
    }
    // Mode: byte = 0100
    push(4, 4);
    // Char count
    push(utf8.length, version <= 9 ? 8 : 16);
    // Data
    for (var i = 0; i < utf8.length; i++) push(utf8[i], 8);
    // Terminator
    var rem = total * 8 - bits.length;
    var term = Math.min(4, rem);
    for (var t = 0; t < term; t++) bits.push(0);
    // Pad to byte
    while (bits.length % 8 !== 0) bits.push(0);
    // Convert to bytes
    var bytes = [];
    for (var b = 0; b < bits.length; b += 8) {
      var v = 0;
      for (var j = 0; j < 8; j++) v = (v << 1) | (bits[b + j] || 0);
      bytes.push(v);
    }
    // Pad codewords
    var pads = [0xEC, 0x11];
    var pi = 0;
    while (bytes.length < total) { bytes.push(pads[pi % 2]); pi++; }
    return bytes;
  }

  function buildFinalMessage(dataBytes, version) {
    var info = VER[version];
    var blocks = [];
    var off = 0;
    for (var g = 0; g < info.groups.length; g++) {
      for (var b = 0; b < info.groups[g].n; b++) {
        blocks.push(dataBytes.slice(off, off + info.groups[g].d));
        off += info.groups[g].d;
      }
    }
    var ecBlocks = [];
    for (var i = 0; i < blocks.length; i++) ecBlocks.push(rsEncode(blocks[i], info.ecPB));

    // Interleave data
    var maxD = 0;
    for (var m = 0; m < blocks.length; m++) if (blocks[m].length > maxD) maxD = blocks[m].length;
    var result = [];
    for (var d = 0; d < maxD; d++)
      for (var bd = 0; bd < blocks.length; bd++)
        if (d < blocks[bd].length) result.push(blocks[bd][d]);
    // Interleave EC
    for (var e = 0; e < info.ecPB; e++)
      for (var be = 0; be < ecBlocks.length; be++)
        result.push(ecBlocks[be][e]);
    return result;
  }

  // Matrix operations (0=empty, 1=dark func, 2=light func, 3=dark data, 4=light data)
  function makeMatrix(size) {
    var m = [];
    for (var r = 0; r < size; r++) { m[r] = []; for (var c = 0; c < size; c++) m[r][c] = 0; }
    return m;
  }

  function addFinder(m, row, col) {
    var size = m.length;
    for (var r = -1; r <= 7; r++) {
      for (var c = -1; c <= 7; c++) {
        var mr = row + r, mc = col + c;
        if (mr < 0 || mr >= size || mc < 0 || mc >= size) continue;
        if (r === -1 || r === 7 || c === -1 || c === 7) m[mr][mc] = 2;
        else if (r === 0 || r === 6 || c === 0 || c === 6) m[mr][mc] = 1;
        else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) m[mr][mc] = 1;
        else m[mr][mc] = 2;
      }
    }
  }

  function addAlign(m, row, col) {
    for (var r = -2; r <= 2; r++) {
      for (var c = -2; c <= 2; c++) {
        var mr = row + r, mc = col + c;
        if (mr < 0 || mr >= m.length || mc < 0 || mc >= m.length) continue;
        if (m[mr][mc] !== 0) continue;
        if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) m[mr][mc] = 1;
        else m[mr][mc] = 2;
      }
    }
  }

  function addTiming(m) {
    var size = m.length;
    for (var i = 8; i < size - 8; i++) {
      if (m[6][i] === 0) m[6][i] = (i % 2 === 0) ? 1 : 2;
      if (m[i][6] === 0) m[i][6] = (i % 2 === 0) ? 1 : 2;
    }
  }

  function reserveFormat(m) {
    var size = m.length;
    for (var i = 0; i <= 8; i++) {
      if (m[8][i] === 0) m[8][i] = 2;
      if (m[i][8] === 0) m[i][8] = 2;
    }
    for (var j = size - 8; j < size; j++) { if (m[8][j] === 0) m[8][j] = 2; }
    for (var k = size - 7; k < size; k++) { if (m[k][8] === 0) m[k][8] = 2; }
    m[size - 8][8] = 1; // dark module
  }

  function placeData(m, cw) {
    var size = m.length;
    var bits = [];
    for (var i = 0; i < cw.length; i++)
      for (var b = 7; b >= 0; b--) bits.push((cw[i] >> b) & 1);

    var idx = 0, col = size - 1, up = true;
    while (col >= 0) {
      if (col === 6) col--;
      var start = up ? size - 1 : 0, end = up ? -1 : size, step = up ? -1 : 1;
      for (var row = start; row !== end; row += step) {
        for (var dc = 0; dc <= 1; dc++) {
          var c = col - dc;
          if (c < 0 || m[row][c] !== 0) continue;
          m[row][c] = (idx < bits.length && bits[idx]) ? 3 : 4;
          idx++;
        }
      }
      col -= 2;
      up = !up;
    }
  }

  var MASK_FNS = [
    function (r, c) { return (r + c) % 2 === 0; },
    function (r) { return r % 2 === 0; },
    function (r, c) { return c % 3 === 0; },
    function (r, c) { return (r + c) % 3 === 0; },
    function (r, c) { return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; },
    function (r, c) { return (r * c) % 2 + (r * c) % 3 === 0; },
    function (r, c) { return ((r * c) % 2 + (r * c) % 3) % 2 === 0; },
    function (r, c) { return ((r + c) % 2 + (r * c) % 3) % 2 === 0; }
  ];

  function applyMask(m, mask) {
    var fn = MASK_FNS[mask];
    for (var r = 0; r < m.length; r++)
      for (var c = 0; c < m.length; c++)
        if ((m[r][c] === 3 || m[r][c] === 4) && fn(r, c))
          m[r][c] = (m[r][c] === 3) ? 4 : 3;
  }

  function writeFormat(m, mask) {
    var size = m.length;
    var info = FORMAT_BITS[mask];
    var bits = [];
    for (var i = 14; i >= 0; i--) bits.push((info >> i) & 1);

    // Horizontal left (bits 0-7)
    var hl = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8]];
    for (var a = 0; a < 8; a++) m[hl[a][0]][hl[a][1]] = bits[a] ? 1 : 2;

    // Horizontal right (bits 8-14)
    for (var b = 0; b < 7; b++) m[8][size - 7 + b] = bits[8 + b] ? 1 : 2;

    // Vertical bottom (bits 0-7)
    for (var c = 0; c < 8; c++) m[size - 1 - c][8] = bits[c] ? 1 : 2;

    // Vertical top (bits 8-14)
    var vt = [[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
    for (var d = 0; d < 7; d++) m[vt[d][0]][vt[d][1]] = bits[8 + d] ? 1 : 2;
  }

  function isDark(m, r, c) { var v = m[r][c]; return v === 1 || v === 3; }

  function penalty(m) {
    var size = m.length, score = 0;
    // Rule 1
    for (var r = 0; r < size; r++) {
      var cnt = 1;
      for (var c = 1; c < size; c++) {
        if (isDark(m, r, c) === isDark(m, r, c - 1)) cnt++;
        else { if (cnt >= 5) score += cnt - 2; cnt = 1; }
      }
      if (cnt >= 5) score += cnt - 2;
    }
    for (var c2 = 0; c2 < size; c2++) {
      var cnt2 = 1;
      for (var r2 = 1; r2 < size; r2++) {
        if (isDark(m, r2, c2) === isDark(m, r2 - 1, c2)) cnt2++;
        else { if (cnt2 >= 5) score += cnt2 - 2; cnt2 = 1; }
      }
      if (cnt2 >= 5) score += cnt2 - 2;
    }
    // Rule 2
    for (var r3 = 0; r3 < size - 1; r3++)
      for (var c3 = 0; c3 < size - 1; c3++) {
        var d = isDark(m, r3, c3);
        if (d === isDark(m, r3, c3 + 1) && d === isDark(m, r3 + 1, c3) && d === isDark(m, r3 + 1, c3 + 1))
          score += 3;
      }
    // Rule 4
    var dk = 0, tot = size * size;
    for (var r5 = 0; r5 < size; r5++)
      for (var c5 = 0; c5 < size; c5++) if (isDark(m, r5, c5)) dk++;
    var pct = (dk / tot) * 100;
    var p5 = Math.floor(pct / 5) * 5;
    score += Math.min(Math.abs(p5 - 50) / 5, Math.abs(p5 + 5 - 50) / 5) * 10;
    return score;
  }

  function cloneMatrix(m) {
    var c = [];
    for (var r = 0; r < m.length; r++) c[r] = m[r].slice();
    return c;
  }

  function generateQR(text) {
    var utf8 = textToUtf8(text);
    var version = pickVersion(utf8.length);
    if (version < 0) throw new Error("テキストが長すぎます。より短いテキストを入力してください。");

    var data = encodeData(utf8, version);
    var cw = buildFinalMessage(data, version);
    var size = VER[version].s;
    var base = makeMatrix(size);

    addFinder(base, 0, 0);
    addFinder(base, 0, size - 7);
    addFinder(base, size - 7, 0);

    var ap = ALIGN_POS[version];
    if (ap.length >= 2) {
      for (var ai = 0; ai < ap.length; ai++)
        for (var aj = 0; aj < ap.length; aj++) {
          var ar = ap[ai], ac = ap[aj];
          if (ar <= 8 && ac <= 8) continue;
          if (ar <= 8 && ac >= size - 8) continue;
          if (ar >= size - 8 && ac <= 8) continue;
          addAlign(base, ar, ac);
        }
    }

    addTiming(base);
    reserveFormat(base);
    placeData(base, cw);

    var best = null, bestScore = Infinity;
    for (var mask = 0; mask < 8; mask++) {
      var m = cloneMatrix(base);
      applyMask(m, mask);
      writeFormat(m, mask);
      var s = penalty(m);
      if (s < bestScore) { bestScore = s; best = m; }
    }
    return best;
  }

  function renderCanvas(matrix, canvas, pixelSize, fgColor, bgColor) {
    var size = matrix.length;
    var quiet = 4;
    var total = (size + quiet * 2) * pixelSize;
    canvas.width = total;
    canvas.height = total;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, total, total);
    ctx.fillStyle = fgColor;
    for (var r = 0; r < size; r++)
      for (var c = 0; c < size; c++)
        if (matrix[r][c] === 1 || matrix[r][c] === 3)
          ctx.fillRect((c + quiet) * pixelSize, (r + quiet) * pixelSize, pixelSize, pixelSize);
  }

  // ============================================================
  // UI
  // ============================================================
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("qr-input");
    var sizeEl = document.getElementById("qr-size");
    var fgEl = document.getElementById("qr-fg");
    var bgEl = document.getElementById("qr-bg");
    var previewEl = document.getElementById("qr-preview");
    var errorEl = document.getElementById("qr-error");
    var successEl = document.getElementById("qr-success");
    var btnGenerate = document.getElementById("btn-generate");
    var btnClear = document.getElementById("btn-clear");
    var btnDownload = document.getElementById("btn-download");
    var currentCanvas = null;

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      successEl.hidden = true;
    }
    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      errorEl.hidden = true;
    }
    function clearMsg() { errorEl.hidden = true; successEl.hidden = true; }

    btnGenerate.addEventListener("click", function () {
      clearMsg();
      var text = inputEl.value;
      if (!text) { showError("テキストを入力してください。"); return; }
      try {
        var matrix = generateQR(text);
        var canvasSize = parseInt(sizeEl.value, 10);
        var modCount = matrix.length + 8;
        var px = Math.max(1, Math.floor(canvasSize / modCount));
        currentCanvas = document.createElement("canvas");
        previewEl.innerHTML = "";
        previewEl.appendChild(currentCanvas);
        renderCanvas(matrix, currentCanvas, px, fgEl.value, bgEl.value);
        btnDownload.disabled = false;
        showSuccess("QRコードを生成しました。");
      } catch (e) {
        previewEl.innerHTML = '<span class="qr-placeholder">生成に失敗しました</span>';
        btnDownload.disabled = true;
        showError(e.message || "QRコードの生成に失敗しました。");
      }
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      previewEl.innerHTML = '<span class="qr-placeholder">テキストを入力して「生成」をクリックしてください</span>';
      currentCanvas = null;
      btnDownload.disabled = true;
      clearMsg();
    });

    btnDownload.addEventListener("click", function () {
      if (!currentCanvas) return;
      var link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = currentCanvas.toDataURL("image/png");
      link.click();
      showSuccess("ダウンロードを開始しました。");
    });
  });
})();
