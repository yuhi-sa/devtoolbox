"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("line-input");
    var outputEl = document.getElementById("line-output");
    var statsEl = document.getElementById("line-stats");
    var caseInsensitiveEl = document.getElementById("case-insensitive");
    var btnSortAsc = document.getElementById("btn-sort-asc");
    var btnSortDesc = document.getElementById("btn-sort-desc");
    var btnReverse = document.getElementById("btn-reverse");
    var btnDeduplicate = document.getElementById("btn-deduplicate");
    var btnRemoveEmpty = document.getElementById("btn-remove-empty");
    var btnAddNumbers = document.getElementById("btn-add-numbers");
    var btnTrim = document.getElementById("btn-trim");
    var btnShuffle = document.getElementById("btn-shuffle");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");

    function getLines() {
      var text = inputEl.value;
      if (text === "") return [];
      return text.split("\n");
    }

    function showStats(lines, info) {
      var totalLines = lines.length;
      var uniqueLines = new Set(lines).size;
      var duplicatesRemoved = totalLines - uniqueLines;
      var msg = "合計: " + totalLines + "行 | ユニーク: " + uniqueLines + "行 | 重複: " + duplicatesRemoved + "行";
      if (info) {
        msg = info + " — " + msg;
      }
      statsEl.textContent = msg;
      statsEl.hidden = false;
    }

    function setOutput(lines, info) {
      outputEl.value = lines.join("\n");
      showStats(lines, info);
    }

    function isCaseInsensitive() {
      return caseInsensitiveEl.checked;
    }

    btnSortAsc.addEventListener("click", function () {
      var lines = getLines();
      if (lines.length === 0) return;
      var ci = isCaseInsensitive();
      lines.sort(function (a, b) {
        var valA = ci ? a.toLowerCase() : a;
        var valB = ci ? b.toLowerCase() : b;
        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
      });
      setOutput(lines, "昇順ソート完了");
    });

    btnSortDesc.addEventListener("click", function () {
      var lines = getLines();
      if (lines.length === 0) return;
      var ci = isCaseInsensitive();
      lines.sort(function (a, b) {
        var valA = ci ? a.toLowerCase() : a;
        var valB = ci ? b.toLowerCase() : b;
        if (valA > valB) return -1;
        if (valA < valB) return 1;
        return 0;
      });
      setOutput(lines, "降順ソート完了");
    });

    btnReverse.addEventListener("click", function () {
      var lines = getLines();
      if (lines.length === 0) return;
      lines.reverse();
      setOutput(lines, "逆順完了");
    });

    btnDeduplicate.addEventListener("click", function () {
      var lines = getLines();
      if (lines.length === 0) return;
      var ci = isCaseInsensitive();
      var seen = {};
      var result = [];
      var removedCount = 0;
      for (var i = 0; i < lines.length; i++) {
        var key = ci ? lines[i].toLowerCase() : lines[i];
        if (!seen[key]) {
          seen[key] = true;
          result.push(lines[i]);
        } else {
          removedCount++;
        }
      }
      outputEl.value = result.join("\n");
      statsEl.textContent = "重複削除完了 — 合計: " + lines.length + "行 | ユニーク: " + result.length + "行 | 重複: " + removedCount + "行削除";
      statsEl.hidden = false;
    });

    btnRemoveEmpty.addEventListener("click", function () {
      var lines = getLines();
      if (lines.length === 0) return;
      var result = [];
      var removedCount = 0;
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim() !== "") {
          result.push(lines[i]);
        } else {
          removedCount++;
        }
      }
      outputEl.value = result.join("\n");
      statsEl.textContent = "空行削除完了 — " + removedCount + "行の空行を削除 | 残り: " + result.length + "行";
      statsEl.hidden = false;
    });

    btnAddNumbers.addEventListener("click", function () {
      var lines = getLines();
      if (lines.length === 0) return;
      var result = [];
      for (var i = 0; i < lines.length; i++) {
        result.push((i + 1) + ". " + lines[i]);
      }
      setOutput(result, "行番号付与完了");
    });

    btnTrim.addEventListener("click", function () {
      var lines = getLines();
      if (lines.length === 0) return;
      var result = [];
      for (var i = 0; i < lines.length; i++) {
        result.push(lines[i].trim());
      }
      setOutput(result, "トリム完了");
    });

    btnShuffle.addEventListener("click", function () {
      var lines = getLines();
      if (lines.length === 0) return;
      for (var i = lines.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = lines[i];
        lines[i] = lines[j];
        lines[j] = temp;
      }
      setOutput(lines, "シャッフル完了");
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      outputEl.value = "";
      statsEl.hidden = true;
    });

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        statsEl.textContent = "コピーしました。";
        statsEl.hidden = false;
      });
    });
  });
})();
