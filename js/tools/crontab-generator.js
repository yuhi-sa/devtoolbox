"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var fields = {
      minute: document.getElementById("cron-minute"),
      hour: document.getElementById("cron-hour"),
      day: document.getElementById("cron-day"),
      month: document.getElementById("cron-month"),
      dow: document.getElementById("cron-dow")
    };
    var expressionEl = document.getElementById("cron-expression");
    var descriptionEl = document.getElementById("cron-description");
    var nextRunsList = document.getElementById("next-runs-list");
    var btnCopy = document.getElementById("btn-copy");
    var btnClear = document.getElementById("btn-clear");
    var parseInput = document.getElementById("parse-input");
    var btnParse = document.getElementById("btn-parse");
    var parseError = document.getElementById("parse-error");
    var presetBtns = document.querySelectorAll(".preset-btn");

    var DOW_NAMES = ["日", "月", "火", "水", "木", "金", "土"];
    var MONTH_NAMES = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

    function getCron() {
      return [fields.minute.value.trim(), fields.hour.value.trim(), fields.day.value.trim(), fields.month.value.trim(), fields.dow.value.trim()].join(" ");
    }

    function setCron(expr) {
      var parts = expr.trim().split(/\s+/);
      if (parts.length !== 5) return false;
      fields.minute.value = parts[0];
      fields.hour.value = parts[1];
      fields.day.value = parts[2];
      fields.month.value = parts[3];
      fields.dow.value = parts[4];
      return true;
    }

    function describeField(val, unit) {
      if (val === "*") return "";
      if (val.indexOf("/") !== -1) {
        var parts = val.split("/");
        var step = parts[1];
        if (parts[0] === "*" || parts[0] === "0") return step + unit + "ごと";
        return parts[0] + "から" + step + unit + "ごと";
      }
      if (val.indexOf(",") !== -1) return val + unit;
      if (val.indexOf("-") !== -1) {
        var range = val.split("-");
        return range[0] + "〜" + range[1] + unit;
      }
      return val + unit;
    }

    function describeDow(val) {
      if (val === "*") return "";
      var replaced = val;
      for (var i = 0; i < DOW_NAMES.length; i++) {
        replaced = replaced.replace(new RegExp("\\b" + i + "\\b", "g"), DOW_NAMES[i]);
      }
      replaced = replaced.replace(/\b7\b/g, DOW_NAMES[0]);
      if (val.indexOf("-") !== -1) return replaced + "曜日";
      if (val.indexOf(",") !== -1) return replaced + "曜日";
      return replaced + "曜日";
    }

    function describeCron(expr) {
      var parts = expr.trim().split(/\s+/);
      if (parts.length !== 5) return "不正なCron式";
      var m = parts[0], h = parts[1], d = parts[2], mo = parts[3], dow = parts[4];

      if (m === "*" && h === "*" && d === "*" && mo === "*" && dow === "*") return "毎分実行";
      if (m !== "*" && h === "*" && d === "*" && mo === "*" && dow === "*") {
        if (m.indexOf("/") !== -1) return describeField(m, "分") + "に実行";
        return "毎時" + m + "分に実行";
      }

      var desc = [];
      if (mo !== "*") desc.push(describeField(mo, "月"));
      if (dow !== "*") desc.push(describeDow(dow));
      if (d !== "*") desc.push(describeField(d, "日"));
      if (h !== "*") desc.push(describeField(h, "時"));
      if (m !== "*" && m !== "0") desc.push(describeField(m, "分"));
      else if (m === "0") desc.push("0分");

      if (desc.length === 0) return "毎分実行";
      return desc.join(" ") + "に実行";
    }

    function expandField(val, min, max) {
      var result = [];
      var parts = val.split(",");
      for (var p = 0; p < parts.length; p++) {
        var part = parts[p].trim();
        if (part.indexOf("/") !== -1) {
          var sf = part.split("/");
          var start = sf[0] === "*" ? min : parseInt(sf[0], 10);
          var step = parseInt(sf[1], 10);
          if (isNaN(start) || isNaN(step) || step <= 0) return null;
          for (var i = start; i <= max; i += step) result.push(i);
        } else if (part.indexOf("-") !== -1) {
          var range = part.split("-");
          var a = parseInt(range[0], 10), b = parseInt(range[1], 10);
          if (isNaN(a) || isNaN(b)) return null;
          for (var j = a; j <= b; j++) result.push(j);
        } else if (part === "*") {
          for (var k = min; k <= max; k++) result.push(k);
        } else {
          var n = parseInt(part, 10);
          if (isNaN(n)) return null;
          result.push(n);
        }
      }
      return result.sort(function (a, b) { return a - b; });
    }

    function getNextRuns(expr, count) {
      var parts = expr.trim().split(/\s+/);
      if (parts.length !== 5) return [];

      var minutes = expandField(parts[0], 0, 59);
      var hours = expandField(parts[1], 0, 23);
      var days = expandField(parts[2], 1, 31);
      var months = expandField(parts[3], 1, 12);
      var dows = expandField(parts[4], 0, 7);

      if (!minutes || !hours || !days || !months || !dows) return [];

      // Normalize dow: 7 -> 0
      var dowSet = {};
      for (var i = 0; i < dows.length; i++) {
        dowSet[dows[i] === 7 ? 0 : dows[i]] = true;
      }

      var results = [];
      var now = new Date();
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);
      var limit = 365 * 2; // search up to 2 years ahead
      var checked = 0;

      while (results.length < count && checked < limit * 24 * 60) {
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        var dow = d.getDay();
        var hour = d.getHours();
        var min = d.getMinutes();

        if (months.indexOf(mon) !== -1 && days.indexOf(day) !== -1 && dowSet[dow] && hours.indexOf(hour) !== -1 && minutes.indexOf(min) !== -1) {
          results.push(new Date(d));
        }
        d = new Date(d.getTime() + 60000);
        checked++;
      }
      return results;
    }

    function formatDate(d) {
      var y = d.getFullYear();
      var mo = String(d.getMonth() + 1).padStart(2, "0");
      var da = String(d.getDate()).padStart(2, "0");
      var h = String(d.getHours()).padStart(2, "0");
      var mi = String(d.getMinutes()).padStart(2, "0");
      var dow = DOW_NAMES[d.getDay()];
      return y + "/" + mo + "/" + da + " (" + dow + ") " + h + ":" + mi;
    }

    function update() {
      var expr = getCron();
      expressionEl.textContent = expr;
      descriptionEl.textContent = describeCron(expr);

      var runs = getNextRuns(expr, 5);
      nextRunsList.innerHTML = "";
      if (runs.length === 0) {
        var li = document.createElement("li");
        li.textContent = "実行予定が見つかりません";
        nextRunsList.appendChild(li);
      } else {
        for (var i = 0; i < runs.length; i++) {
          var li2 = document.createElement("li");
          li2.textContent = formatDate(runs[i]);
          nextRunsList.appendChild(li2);
        }
      }
    }

    // Field input listeners
    Object.keys(fields).forEach(function (key) {
      fields[key].addEventListener("input", update);
    });

    // Presets
    presetBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setCron(btn.getAttribute("data-cron"));
        update();
      });
    });

    // Copy
    btnCopy.addEventListener("click", function () {
      var expr = getCron();
      window.DevToolBox.copyToClipboard(expr).then(function () {
        window.DevToolBox.showFeedback("コピーしました", "success");
      });
    });

    // Clear
    btnClear.addEventListener("click", function () {
      setCron("* * * * *");
      update();
    });

    // Parse
    btnParse.addEventListener("click", function () {
      parseError.hidden = true;
      var val = parseInput.value.trim();
      if (!val) {
        parseError.textContent = "Cron式を入力してください。";
        parseError.hidden = false;
        return;
      }
      if (!setCron(val)) {
        parseError.textContent = "不正なCron式です。5つのフィールド（分 時 日 月 曜日）を半角スペースで区切って入力してください。";
        parseError.hidden = false;
        return;
      }
      update();
      window.DevToolBox.showFeedback("パースしました", "success");
    });

    // Initial update
    update();
  });
})();
