"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // --- タブ切り替え ---
    var tabBtns = document.querySelectorAll(".tab-nav__btn");
    var tabPanels = [
      document.getElementById("tab-diff"),
      document.getElementById("tab-addsub"),
      document.getElementById("tab-weekday")
    ];

    tabBtns.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        tabBtns.forEach(function (b) {
          b.classList.remove("tab-nav__btn--active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("tab-nav__btn--active");
        btn.setAttribute("aria-selected", "true");
        tabPanels.forEach(function (panel, j) {
          if (i === j) {
            panel.hidden = false;
          } else {
            panel.hidden = true;
          }
        });
      });
    });

    // --- ユーティリティ ---
    var dayNames = ["日", "月", "火", "水", "木", "金", "土"];

    function pad(n, len) {
      var s = String(n);
      while (s.length < len) s = "0" + s;
      return s;
    }

    function toLocalISOString(date) {
      return date.getFullYear() + "-" +
        pad(date.getMonth() + 1, 2) + "-" +
        pad(date.getDate(), 2) + "T" +
        pad(date.getHours(), 2) + ":" +
        pad(date.getMinutes(), 2) + ":" +
        pad(date.getSeconds(), 2);
    }

    function toLocalDateString(date) {
      return date.getFullYear() + "-" +
        pad(date.getMonth() + 1, 2) + "-" +
        pad(date.getDate(), 2);
    }

    function formatDateJP(date) {
      return date.getFullYear() + "年" +
        pad(date.getMonth() + 1, 2) + "月" +
        pad(date.getDate(), 2) + "日 " +
        pad(date.getHours(), 2) + ":" +
        pad(date.getMinutes(), 2) + ":" +
        pad(date.getSeconds(), 2) +
        "（" + dayNames[date.getDay()] + "曜日）";
    }

    function formatDateOnlyJP(date) {
      return date.getFullYear() + "年" +
        pad(date.getMonth() + 1, 2) + "月" +
        pad(date.getDate(), 2) + "日" +
        "（" + dayNames[date.getDay()] + "曜日）";
    }

    function renderResults(container, results) {
      container.innerHTML = "";
      results.forEach(function (item) {
        var div = document.createElement("div");
        div.className = "timestamp-results__item";
        var labelSpan = document.createElement("span");
        labelSpan.className = "timestamp-results__label";
        labelSpan.textContent = item.label;
        var valueSpan = document.createElement("span");
        valueSpan.className = "timestamp-results__value";
        valueSpan.textContent = item.value;
        div.appendChild(labelSpan);
        div.appendChild(valueSpan);
        container.appendChild(div);
      });
    }

    function getResultsText(container) {
      var items = container.querySelectorAll(".timestamp-results__item");
      var lines = [];
      items.forEach(function (item) {
        var label = item.querySelector(".timestamp-results__label").textContent;
        var value = item.querySelector(".timestamp-results__value").textContent;
        lines.push(label + ": " + value);
      });
      return lines.join("\n");
    }

    function showError(el, msg) {
      el.textContent = msg;
      el.hidden = false;
    }

    function hideError(el) {
      el.hidden = true;
    }

    // --- タブ1: 日付の差 ---
    var diffStart = document.getElementById("diff-start");
    var diffEnd = document.getElementById("diff-end");
    var btnDiffStartNow = document.getElementById("btn-diff-start-now");
    var btnDiffEndNow = document.getElementById("btn-diff-end-now");
    var btnDiffCalc = document.getElementById("btn-diff-calc");
    var btnDiffClear = document.getElementById("btn-diff-clear");
    var btnDiffCopy = document.getElementById("btn-diff-copy");
    var diffError = document.getElementById("diff-error");
    var diffOutput = document.getElementById("diff-output");
    var diffResults = document.getElementById("diff-results");

    btnDiffStartNow.addEventListener("click", function () {
      diffStart.value = toLocalISOString(new Date());
    });

    btnDiffEndNow.addEventListener("click", function () {
      diffEnd.value = toLocalISOString(new Date());
    });

    function calcDateDiff(d1, d2) {
      // Ensure d1 <= d2
      var start = d1 <= d2 ? new Date(d1) : new Date(d2);
      var end = d1 <= d2 ? new Date(d2) : new Date(d1);

      // Year/Month/Day/Hour/Minute/Second breakdown
      var years = end.getFullYear() - start.getFullYear();
      var months = end.getMonth() - start.getMonth();
      var days = end.getDate() - start.getDate();
      var hours = end.getHours() - start.getHours();
      var minutes = end.getMinutes() - start.getMinutes();
      var seconds = end.getSeconds() - start.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        // Get last day of previous month of end date
        var prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      // Total calculations from millisecond difference
      var diffMs = Math.abs(end.getTime() - start.getTime());
      var totalSeconds = Math.floor(diffMs / 1000);
      var totalMinutes = Math.floor(diffMs / (1000 * 60));
      var totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      var totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      return {
        years: years,
        months: months,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        totalDays: totalDays,
        totalHours: totalHours,
        totalMinutes: totalMinutes,
        totalSeconds: totalSeconds
      };
    }

    btnDiffCalc.addEventListener("click", function () {
      hideError(diffError);
      diffOutput.hidden = true;

      if (!diffStart.value) {
        showError(diffError, "開始日時を入力してください。");
        return;
      }
      if (!diffEnd.value) {
        showError(diffError, "終了日時を入力してください。");
        return;
      }

      var d1 = new Date(diffStart.value);
      var d2 = new Date(diffEnd.value);

      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        showError(diffError, "有効な日時を入力してください。");
        return;
      }

      var diff = calcDateDiff(d1, d2);
      var results = [
        { label: "年月日時分秒の差", value: diff.years + "年 " + diff.months + "ヶ月 " + diff.days + "日 " + diff.hours + "時間 " + diff.minutes + "分 " + diff.seconds + "秒" },
        { label: "総日数", value: diff.totalDays.toLocaleString() + " 日" },
        { label: "総時間", value: diff.totalHours.toLocaleString() + " 時間" },
        { label: "総分数", value: diff.totalMinutes.toLocaleString() + " 分" },
        { label: "総秒数", value: diff.totalSeconds.toLocaleString() + " 秒" }
      ];

      renderResults(diffResults, results);
      diffOutput.hidden = false;
    });

    btnDiffClear.addEventListener("click", function () {
      diffStart.value = "";
      diffEnd.value = "";
      diffResults.innerHTML = "";
      diffOutput.hidden = true;
      hideError(diffError);
    });

    btnDiffCopy.addEventListener("click", function () {
      var text = getResultsText(diffResults);
      if (text) navigator.clipboard.writeText(text);
    });

    // --- タブ2: 日時の加減算 ---
    var addsubBase = document.getElementById("addsub-base");
    var addsubAmount = document.getElementById("addsub-amount");
    var addsubUnit = document.getElementById("addsub-unit");
    var btnAddsubNow = document.getElementById("btn-addsub-now");
    var btnAddsubCalc = document.getElementById("btn-addsub-calc");
    var btnAddsubClear = document.getElementById("btn-addsub-clear");
    var btnAddsubCopy = document.getElementById("btn-addsub-copy");
    var addsubError = document.getElementById("addsub-error");
    var addsubOutput = document.getElementById("addsub-output");
    var addsubResults = document.getElementById("addsub-results");

    btnAddsubNow.addEventListener("click", function () {
      addsubBase.value = toLocalISOString(new Date());
    });

    btnAddsubCalc.addEventListener("click", function () {
      hideError(addsubError);
      addsubOutput.hidden = true;

      if (!addsubBase.value) {
        showError(addsubError, "基準日時を入力してください。");
        return;
      }

      var base = new Date(addsubBase.value);
      if (isNaN(base.getTime())) {
        showError(addsubError, "有効な日時を入力してください。");
        return;
      }

      var amount = parseInt(addsubAmount.value, 10);
      if (isNaN(amount) || amount < 0) {
        showError(addsubError, "有効な数値を入力してください。");
        return;
      }

      var op = document.querySelector('input[name="addsub-op"]:checked').value;
      var sign = op === "add" ? 1 : -1;
      var unit = addsubUnit.value;

      var result = new Date(base);

      switch (unit) {
        case "year":
          result.setFullYear(result.getFullYear() + sign * amount);
          break;
        case "month":
          result.setMonth(result.getMonth() + sign * amount);
          break;
        case "day":
          result.setDate(result.getDate() + sign * amount);
          break;
        case "hour":
          result.setHours(result.getHours() + sign * amount);
          break;
        case "minute":
          result.setMinutes(result.getMinutes() + sign * amount);
          break;
        case "second":
          result.setSeconds(result.getSeconds() + sign * amount);
          break;
      }

      if (isNaN(result.getTime())) {
        showError(addsubError, "計算結果が無効な日時になりました。");
        return;
      }

      var unitLabels = { year: "年", month: "ヶ月", day: "日", hour: "時間", minute: "分", second: "秒" };
      var opLabel = op === "add" ? "加算" : "減算";

      var results = [
        { label: "基準日時", value: formatDateJP(base) },
        { label: "操作", value: amount + unitLabels[unit] + " " + opLabel },
        { label: "結果日時", value: formatDateJP(result) },
        { label: "ISO 8601形式", value: result.getFullYear() + "-" + pad(result.getMonth() + 1, 2) + "-" + pad(result.getDate(), 2) + "T" + pad(result.getHours(), 2) + ":" + pad(result.getMinutes(), 2) + ":" + pad(result.getSeconds(), 2) }
      ];

      renderResults(addsubResults, results);
      addsubOutput.hidden = false;
    });

    btnAddsubClear.addEventListener("click", function () {
      addsubBase.value = "";
      addsubAmount.value = "1";
      addsubResults.innerHTML = "";
      addsubOutput.hidden = true;
      hideError(addsubError);
    });

    btnAddsubCopy.addEventListener("click", function () {
      var text = getResultsText(addsubResults);
      if (text) navigator.clipboard.writeText(text);
    });

    // --- タブ3: 曜日計算 ---
    var weekdayDate = document.getElementById("weekday-date");
    var btnWeekdayToday = document.getElementById("btn-weekday-today");
    var btnWeekdayCalc = document.getElementById("btn-weekday-calc");
    var btnWeekdayClear = document.getElementById("btn-weekday-clear");
    var btnWeekdayCopy = document.getElementById("btn-weekday-copy");
    var weekdayError = document.getElementById("weekday-error");
    var weekdayOutput = document.getElementById("weekday-output");
    var weekdayResults = document.getElementById("weekday-results");

    btnWeekdayToday.addEventListener("click", function () {
      weekdayDate.value = toLocalDateString(new Date());
    });

    btnWeekdayCalc.addEventListener("click", function () {
      hideError(weekdayError);
      weekdayOutput.hidden = true;

      if (!weekdayDate.value) {
        showError(weekdayError, "日付を入力してください。");
        return;
      }

      // Parse as local date (not UTC)
      var parts = weekdayDate.value.split("-");
      var date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

      if (isNaN(date.getTime())) {
        showError(weekdayError, "有効な日付を入力してください。");
        return;
      }

      var weekday = dayNames[date.getDay()] + "曜日";

      // Day of year
      var startOfYear = new Date(date.getFullYear(), 0, 1);
      var diffMs = date.getTime() - startOfYear.getTime();
      var dayOfYear = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

      // Days remaining in year
      var endOfYear = new Date(date.getFullYear(), 11, 31);
      var remainMs = endOfYear.getTime() - date.getTime();
      var daysRemaining = Math.floor(remainMs / (1000 * 60 * 60 * 24));

      // Is leap year
      var year = date.getFullYear();
      var isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      var totalDaysInYear = isLeap ? 366 : 365;

      var results = [
        { label: "日付", value: formatDateOnlyJP(date) },
        { label: "曜日", value: weekday },
        { label: "年初からの日数", value: dayOfYear + " 日目 / " + totalDaysInYear + " 日" },
        { label: "年末までの残り日数", value: daysRemaining + " 日" },
        { label: "うるう年", value: isLeap ? "はい" : "いいえ" }
      ];

      renderResults(weekdayResults, results);
      weekdayOutput.hidden = false;
    });

    btnWeekdayClear.addEventListener("click", function () {
      weekdayDate.value = "";
      weekdayResults.innerHTML = "";
      weekdayOutput.hidden = true;
      hideError(weekdayError);
    });

    btnWeekdayCopy.addEventListener("click", function () {
      var text = getResultsText(weekdayResults);
      if (text) navigator.clipboard.writeText(text);
    });
  });
})();
