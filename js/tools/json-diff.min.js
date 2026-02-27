"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputA = document.getElementById("json-input-a");
    var inputB = document.getElementById("json-input-b");
    var diffOutput = document.getElementById("diff-output");
    var errorEl = document.getElementById("json-error");
    var successEl = document.getElementById("json-success");
    var btnCompare = document.getElementById("btn-compare");
    var btnSample = document.getElementById("btn-sample");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");

    var lastDiffs = [];

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

    function clearMessages() {
      errorEl.hidden = true;
      successEl.hidden = true;
    }

    function parseJSON(str, label) {
      try {
        return { data: JSON.parse(str), error: null };
      } catch (e) {
        return { data: null, error: label + "のJSON構文エラー: " + e.message };
      }
    }

    function typeOf(value) {
      if (value === null) return "null";
      if (Array.isArray(value)) return "array";
      return typeof value;
    }

    function escapeHtml(str) {
      var div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    function formatValue(value) {
      if (value === null) return "null";
      if (typeof value === "string") return '"' + value + '"';
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    }

    function compareJSON(a, b, path, diffs) {
      var typeA = typeOf(a);
      var typeB = typeOf(b);

      if (typeA !== typeB) {
        diffs.push({
          type: "changed",
          path: path,
          oldValue: a,
          newValue: b
        });
        return;
      }

      if (typeA === "object" && typeA === typeB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        var allKeys = {};
        var i;

        for (i = 0; i < keysA.length; i++) {
          allKeys[keysA[i]] = true;
        }
        for (i = 0; i < keysB.length; i++) {
          allKeys[keysB[i]] = true;
        }

        var sortedKeys = Object.keys(allKeys).sort();

        for (i = 0; i < sortedKeys.length; i++) {
          var key = sortedKeys[i];
          var childPath = path + "." + key;

          if (!(key in a)) {
            diffs.push({
              type: "added",
              path: childPath,
              newValue: b[key]
            });
          } else if (!(key in b)) {
            diffs.push({
              type: "removed",
              path: childPath,
              oldValue: a[key]
            });
          } else {
            compareJSON(a[key], b[key], childPath, diffs);
          }
        }
        return;
      }

      if (typeA === "array" && typeA === typeB) {
        var maxLen = Math.max(a.length, b.length);
        for (i = 0; i < maxLen; i++) {
          var arrPath = path + "[" + i + "]";
          if (i >= a.length) {
            diffs.push({
              type: "added",
              path: arrPath,
              newValue: b[i]
            });
          } else if (i >= b.length) {
            diffs.push({
              type: "removed",
              path: arrPath,
              oldValue: a[i]
            });
          } else {
            compareJSON(a[i], b[i], arrPath, diffs);
          }
        }
        return;
      }

      if (a !== b) {
        diffs.push({
          type: "changed",
          path: path,
          oldValue: a,
          newValue: b
        });
      }
    }

    function renderDiffs(diffs) {
      if (diffs.length === 0) {
        diffOutput.innerHTML = '<div class="diff-no-change">差分はありません。2つのJSONは同一です。</div>';
        showSuccess("比較が完了しました。差分はありません。");
        return;
      }

      var addedCount = 0;
      var removedCount = 0;
      var changedCount = 0;
      var i;

      for (i = 0; i < diffs.length; i++) {
        if (diffs[i].type === "added") addedCount++;
        else if (diffs[i].type === "removed") removedCount++;
        else if (diffs[i].type === "changed") changedCount++;
      }

      var html = '<div class="diff-summary">';
      html += '<span>差分件数: ' + diffs.length + '</span>';
      html += '<span class="count-added">追加: ' + addedCount + '</span>';
      html += '<span class="count-removed">削除: ' + removedCount + '</span>';
      html += '<span class="count-changed">変更: ' + changedCount + '</span>';
      html += '</div>';

      for (i = 0; i < diffs.length; i++) {
        var diff = diffs[i];
        var itemClass = "diff-item diff-item--" + diff.type;
        var labelClass = "diff-label diff-label--" + diff.type;
        var labelText = "";
        var detail = "";

        if (diff.type === "added") {
          labelText = "追加";
          detail = escapeHtml(formatValue(diff.newValue));
        } else if (diff.type === "removed") {
          labelText = "削除";
          detail = escapeHtml(formatValue(diff.oldValue));
        } else if (diff.type === "changed") {
          labelText = "変更";
          detail = escapeHtml(formatValue(diff.oldValue)) + " → " + escapeHtml(formatValue(diff.newValue));
        }

        html += '<div class="' + itemClass + '">';
        html += '<span class="' + labelClass + '">' + labelText + '</span>';
        html += '<span class="diff-path">' + escapeHtml(diff.path) + '</span> ';
        html += detail;
        html += '</div>';
      }

      diffOutput.innerHTML = html;
      showSuccess("比較が完了しました。" + diffs.length + "件の差分が見つかりました。");
    }

    function diffsToText(diffs) {
      if (diffs.length === 0) {
        return "差分なし: 2つのJSONは同一です。";
      }

      var lines = [];
      lines.push("JSON差分比較結果 (" + diffs.length + "件)");
      lines.push("=".repeat(40));

      for (var i = 0; i < diffs.length; i++) {
        var diff = diffs[i];
        if (diff.type === "added") {
          lines.push("[追加] " + diff.path + " : " + formatValue(diff.newValue));
        } else if (diff.type === "removed") {
          lines.push("[削除] " + diff.path + " : " + formatValue(diff.oldValue));
        } else if (diff.type === "changed") {
          lines.push("[変更] " + diff.path + " : " + formatValue(diff.oldValue) + " → " + formatValue(diff.newValue));
        }
      }

      return lines.join("\n");
    }

    btnCompare.addEventListener("click", function () {
      clearMessages();
      diffOutput.innerHTML = "";
      lastDiffs = [];

      var textA = inputA.value.trim();
      var textB = inputB.value.trim();

      if (!textA && !textB) {
        showError("JSON AとJSON Bを入力してください。");
        return;
      }
      if (!textA) {
        showError("JSON Aを入力してください。");
        return;
      }
      if (!textB) {
        showError("JSON Bを入力してください。");
        return;
      }

      var resultA = parseJSON(textA, "JSON A");
      if (resultA.error) {
        showError(resultA.error);
        return;
      }

      var resultB = parseJSON(textB, "JSON B");
      if (resultB.error) {
        showError(resultB.error);
        return;
      }

      var diffs = [];
      compareJSON(resultA.data, resultB.data, "$", diffs);
      lastDiffs = diffs;
      renderDiffs(diffs);
    });

    btnSample.addEventListener("click", function () {
      clearMessages();
      diffOutput.innerHTML = "";

      var sampleA = JSON.stringify({
        "name": "山田太郎",
        "age": 30,
        "email": "taro@example.com",
        "address": {
          "city": "東京",
          "zip": "100-0001"
        },
        "hobbies": ["読書", "プログラミング", "旅行"],
        "active": true
      }, null, 2);

      var sampleB = JSON.stringify({
        "name": "山田太郎",
        "age": 31,
        "phone": "090-1234-5678",
        "address": {
          "city": "大阪",
          "zip": "530-0001",
          "country": "日本"
        },
        "hobbies": ["読書", "ゲーム"],
        "active": false
      }, null, 2);

      inputA.value = sampleA;
      inputB.value = sampleB;
    });

    btnClear.addEventListener("click", function () {
      inputA.value = "";
      inputB.value = "";
      diffOutput.innerHTML = "";
      lastDiffs = [];
      clearMessages();
    });

    btnCopy.addEventListener("click", function () {
      if (lastDiffs.length === 0 && diffOutput.innerHTML === "") return;
      var text = diffsToText(lastDiffs);
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("結果をコピーしました。");
      });
    });
  });
})();
