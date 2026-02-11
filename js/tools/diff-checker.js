"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var originalEl = document.getElementById("diff-original");
    var modifiedEl = document.getElementById("diff-modified");
    var outputEl = document.getElementById("diff-output");
    var statsEl = document.getElementById("diff-stats");
    var btnCompare = document.getElementById("btn-compare");
    var btnSwap = document.getElementById("btn-swap");
    var btnClear = document.getElementById("btn-clear");

    function escapeHtml(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    // LCS-based line diff algorithm
    function computeLCS(a, b) {
      var m = a.length;
      var n = b.length;
      var dp = [];
      var i, j;

      for (i = 0; i <= m; i++) {
        dp[i] = [];
        for (j = 0; j <= n; j++) {
          dp[i][j] = 0;
        }
      }

      for (i = 1; i <= m; i++) {
        for (j = 1; j <= n; j++) {
          if (a[i - 1] === b[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
        }
      }

      return dp;
    }

    function buildDiff(a, b) {
      var dp = computeLCS(a, b);
      var result = [];
      var i = a.length;
      var j = b.length;

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
          result.push({ type: "unchanged", text: a[i - 1] });
          i--;
          j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
          result.push({ type: "added", text: b[j - 1] });
          j--;
        } else {
          result.push({ type: "removed", text: a[i - 1] });
          i--;
        }
      }

      result.reverse();
      return result;
    }

    function compare() {
      var originalText = originalEl.value;
      var modifiedText = modifiedEl.value;

      var originalLines = originalText.split("\n");
      var modifiedLines = modifiedText.split("\n");

      var diff = buildDiff(originalLines, modifiedLines);

      var addedCount = 0;
      var removedCount = 0;
      var unchangedCount = 0;

      var html = "";
      for (var i = 0; i < diff.length; i++) {
        var line = diff[i];
        var prefix;
        var className;

        if (line.type === "added") {
          prefix = "+ ";
          className = "diff-line diff-line--added";
          addedCount++;
        } else if (line.type === "removed") {
          prefix = "- ";
          className = "diff-line diff-line--removed";
          removedCount++;
        } else {
          prefix = "  ";
          className = "diff-line diff-line--unchanged";
          unchangedCount++;
        }

        html += '<div class="' + className + '">' + escapeHtml(prefix + line.text) + "</div>";
      }

      outputEl.innerHTML = html;

      statsEl.innerHTML =
        '<span class="diff-stats__added">+ ' + addedCount + " 行追加</span>" +
        '<span class="diff-stats__removed">- ' + removedCount + " 行削除</span>" +
        '<span class="diff-stats__unchanged">' + unchangedCount + " 行変更なし</span>";
      statsEl.hidden = false;
    }

    btnCompare.addEventListener("click", compare);

    btnSwap.addEventListener("click", function () {
      var temp = originalEl.value;
      originalEl.value = modifiedEl.value;
      modifiedEl.value = temp;
    });

    btnClear.addEventListener("click", function () {
      originalEl.value = "";
      modifiedEl.value = "";
      outputEl.innerHTML = "";
      statsEl.hidden = true;
    });
  });
})();
