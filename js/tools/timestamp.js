"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var tsInput = document.getElementById("ts-input");
    var dtInput = document.getElementById("dt-input");
    var tzSelect = document.getElementById("tz-select");
    var tsError = document.getElementById("ts-error");
    var dtError = document.getElementById("dt-error");
    var tsOutputArea = document.getElementById("ts-output-area");
    var dtOutputArea = document.getElementById("dt-output-area");
    var tsResults = document.getElementById("ts-results");
    var dtResults = document.getElementById("dt-results");
    var btnNow = document.getElementById("btn-now");
    var btnTsConvert = document.getElementById("btn-ts-convert");
    var btnTsClear = document.getElementById("btn-ts-clear");
    var btnTsCopy = document.getElementById("btn-ts-copy");
    var btnDtConvert = document.getElementById("btn-dt-convert");
    var btnDtClear = document.getElementById("btn-dt-clear");
    var btnDtCopy = document.getElementById("btn-dt-copy");

    function pad(n, len) {
      var s = String(n);
      while (s.length < len) s = "0" + s;
      return s;
    }

    function formatDate(date, useUTC) {
      var results = [];

      // Unixタイムスタンプ（秒）
      var tsSec = Math.floor(date.getTime() / 1000);
      results.push({ label: "Unixタイムスタンプ（秒）", value: String(tsSec) });

      // Unixタイムスタンプ（ミリ秒）
      results.push({ label: "Unixタイムスタンプ（ミリ秒）", value: String(date.getTime()) });

      // ISO 8601
      results.push({ label: "ISO 8601", value: date.toISOString() });

      if (useUTC) {
        // UTC表示
        var utcStr = date.getUTCFullYear() + "年" +
          pad(date.getUTCMonth() + 1, 2) + "月" +
          pad(date.getUTCDate(), 2) + "日 " +
          pad(date.getUTCHours(), 2) + ":" +
          pad(date.getUTCMinutes(), 2) + ":" +
          pad(date.getUTCSeconds(), 2) + " UTC";
        results.push({ label: "日本語形式（UTC）", value: utcStr });

        var utcFull = date.getUTCFullYear() + "-" +
          pad(date.getUTCMonth() + 1, 2) + "-" +
          pad(date.getUTCDate(), 2) + " " +
          pad(date.getUTCHours(), 2) + ":" +
          pad(date.getUTCMinutes(), 2) + ":" +
          pad(date.getUTCSeconds(), 2) + " UTC";
        results.push({ label: "日時（UTC）", value: utcFull });
      } else {
        // ローカル表示
        var localStr = date.getFullYear() + "年" +
          pad(date.getMonth() + 1, 2) + "月" +
          pad(date.getDate(), 2) + "日 " +
          pad(date.getHours(), 2) + ":" +
          pad(date.getMinutes(), 2) + ":" +
          pad(date.getSeconds(), 2);
        results.push({ label: "日本語形式", value: localStr });

        var localFull = date.getFullYear() + "-" +
          pad(date.getMonth() + 1, 2) + "-" +
          pad(date.getDate(), 2) + " " +
          pad(date.getHours(), 2) + ":" +
          pad(date.getMinutes(), 2) + ":" +
          pad(date.getSeconds(), 2);
        results.push({ label: "日時（ローカル）", value: localFull });
      }

      // 曜日
      var dayNames = ["日", "月", "火", "水", "木", "金", "土"];
      var dayIndex = useUTC ? date.getUTCDay() : date.getDay();
      results.push({ label: "曜日", value: dayNames[dayIndex] + "曜日" });

      return results;
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

    function isUTC() {
      return tzSelect.value === "utc";
    }

    // タイムスタンプ → 日時
    btnTsConvert.addEventListener("click", function () {
      tsError.hidden = true;
      var input = tsInput.value.trim();
      if (!input) {
        tsError.textContent = "タイムスタンプを入力してください。";
        tsError.hidden = false;
        tsOutputArea.hidden = true;
        return;
      }

      var num = Number(input);
      if (isNaN(num)) {
        tsError.textContent = "有効な数値を入力してください。";
        tsError.hidden = false;
        tsOutputArea.hidden = true;
        return;
      }

      // 秒/ミリ秒の自動判別: 絶対値が1e12以上ならミリ秒とみなす
      var ms;
      if (Math.abs(num) >= 1e12) {
        ms = num;
      } else {
        ms = num * 1000;
      }

      var date = new Date(ms);
      if (isNaN(date.getTime())) {
        tsError.textContent = "変換できない値です。入力を確認してください。";
        tsError.hidden = false;
        tsOutputArea.hidden = true;
        return;
      }

      var results = formatDate(date, isUTC());
      // タイムスタンプ自体の情報は先頭2つを除外（入力と同じなので）
      var displayResults = results.slice(2);
      renderResults(tsResults, displayResults);
      tsOutputArea.hidden = false;
    });

    // 日時 → タイムスタンプ
    btnDtConvert.addEventListener("click", function () {
      dtError.hidden = true;
      var input = dtInput.value;
      if (!input) {
        dtError.textContent = "日時を入力してください。";
        dtError.hidden = false;
        dtOutputArea.hidden = true;
        return;
      }

      var date;
      if (isUTC()) {
        date = new Date(input + "Z");
      } else {
        date = new Date(input);
      }

      if (isNaN(date.getTime())) {
        dtError.textContent = "有効な日時を入力してください。";
        dtError.hidden = false;
        dtOutputArea.hidden = true;
        return;
      }

      var tsSec = Math.floor(date.getTime() / 1000);
      var tsMs = date.getTime();
      var results = [
        { label: "Unixタイムスタンプ（秒）", value: String(tsSec) },
        { label: "Unixタイムスタンプ（ミリ秒）", value: String(tsMs) },
        { label: "ISO 8601", value: date.toISOString() }
      ];
      renderResults(dtResults, results);
      dtOutputArea.hidden = false;
    });

    // 現在時刻を取得
    btnNow.addEventListener("click", function () {
      var now = new Date();
      var tsSec = Math.floor(now.getTime() / 1000);
      tsInput.value = tsSec;

      // datetime-local用にフォーマット
      var localISO;
      if (isUTC()) {
        localISO = now.getUTCFullYear() + "-" +
          pad(now.getUTCMonth() + 1, 2) + "-" +
          pad(now.getUTCDate(), 2) + "T" +
          pad(now.getUTCHours(), 2) + ":" +
          pad(now.getUTCMinutes(), 2) + ":" +
          pad(now.getUTCSeconds(), 2);
      } else {
        localISO = now.getFullYear() + "-" +
          pad(now.getMonth() + 1, 2) + "-" +
          pad(now.getDate(), 2) + "T" +
          pad(now.getHours(), 2) + ":" +
          pad(now.getMinutes(), 2) + ":" +
          pad(now.getSeconds(), 2);
      }
      dtInput.value = localISO;

      // 両方のセクションで変換を実行
      btnTsConvert.click();
      btnDtConvert.click();
    });

    // クリアボタン
    btnTsClear.addEventListener("click", function () {
      tsInput.value = "";
      tsResults.innerHTML = "";
      tsOutputArea.hidden = true;
      tsError.hidden = true;
    });

    btnDtClear.addEventListener("click", function () {
      dtInput.value = "";
      dtResults.innerHTML = "";
      dtOutputArea.hidden = true;
      dtError.hidden = true;
    });

    // コピーボタン
    btnTsCopy.addEventListener("click", function () {
      var text = getResultsText(tsResults);
      if (!text) return;
      navigator.clipboard.writeText(text);
    });

    btnDtCopy.addEventListener("click", function () {
      var text = getResultsText(dtResults);
      if (!text) return;
      navigator.clipboard.writeText(text);
    });

    // タイムゾーン変更時、既に結果が表示されていれば再変換
    tzSelect.addEventListener("change", function () {
      if (!tsOutputArea.hidden && tsInput.value.trim()) {
        btnTsConvert.click();
      }
      if (!dtOutputArea.hidden && dtInput.value) {
        btnDtConvert.click();
      }
    });
  });
})();
