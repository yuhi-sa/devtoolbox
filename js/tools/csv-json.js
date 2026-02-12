"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("csv-json-input");
    var outputEl = document.getElementById("csv-json-output");
    var inputLabel = document.getElementById("csv-json-input-label");
    var errorEl = document.getElementById("csv-json-error");
    var successEl = document.getElementById("csv-json-success");
    var delimiterSelect = document.getElementById("delimiter-select");
    var headerToggle = document.getElementById("header-toggle");
    var btnConvert = document.getElementById("btn-convert");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var tabBtns = document.querySelectorAll(".tab-btn");
    var currentMode = "csv-to-json";

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

    function updateLabels() {
      if (currentMode === "csv-to-json") {
        inputLabel.textContent = "CSV入力";
        inputEl.placeholder = "name,age,city\n田中,30,東京\n鈴木,25,大阪";
      } else {
        inputLabel.textContent = "JSON入力";
        inputEl.placeholder = '[{"name": "田中", "age": 30, "city": "東京"}]';
      }
    }

    // RFC 4180 compliant CSV parser
    function parseCsv(text, delimiter) {
      var rows = [];
      var row = [];
      var field = "";
      var inQuotes = false;
      var i = 0;

      while (i < text.length) {
        var ch = text[i];

        if (inQuotes) {
          if (ch === '"') {
            if (i + 1 < text.length && text[i + 1] === '"') {
              field += '"';
              i += 2;
            } else {
              inQuotes = false;
              i++;
            }
          } else {
            field += ch;
            i++;
          }
        } else {
          if (ch === '"') {
            inQuotes = true;
            i++;
          } else if (ch === delimiter) {
            row.push(field);
            field = "";
            i++;
          } else if (ch === "\r") {
            row.push(field);
            field = "";
            rows.push(row);
            row = [];
            i++;
            if (i < text.length && text[i] === "\n") i++;
          } else if (ch === "\n") {
            row.push(field);
            field = "";
            rows.push(row);
            row = [];
            i++;
          } else {
            field += ch;
            i++;
          }
        }
      }

      // Last field and row
      if (field !== "" || row.length > 0) {
        row.push(field);
        rows.push(row);
      }

      // Remove trailing empty rows
      while (rows.length > 0) {
        var lastRow = rows[rows.length - 1];
        if (lastRow.length === 1 && lastRow[0] === "") {
          rows.pop();
        } else {
          break;
        }
      }

      return rows;
    }

    // CSV to JSON conversion
    function csvToJson(text, delimiter, hasHeader) {
      var rows = parseCsv(text, delimiter);
      if (rows.length === 0) return "[]";

      if (hasHeader) {
        var headers = rows[0];
        var result = [];
        for (var i = 1; i < rows.length; i++) {
          var obj = {};
          for (var j = 0; j < headers.length; j++) {
            var val = j < rows[i].length ? rows[i][j] : "";
            obj[headers[j]] = autoType(val);
          }
          result.push(obj);
        }
        return JSON.stringify(result, null, 2);
      } else {
        var result2 = rows.map(function (row) {
          return row.map(function (val) { return autoType(val); });
        });
        return JSON.stringify(result2, null, 2);
      }
    }

    function autoType(val) {
      if (val === "") return "";
      if (val === "true") return true;
      if (val === "false") return false;
      if (val === "null") return null;
      if (/^-?(?:0|[1-9]\d*)$/.test(val)) {
        var n = parseInt(val, 10);
        if (n >= Number.MIN_SAFE_INTEGER && n <= Number.MAX_SAFE_INTEGER) return n;
      }
      if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(val) && val !== "") {
        return parseFloat(val);
      }
      return val;
    }

    // JSON to CSV conversion
    function jsonToCsv(text, delimiter) {
      var data = JSON.parse(text);
      if (!Array.isArray(data)) {
        throw new Error("JSONはオブジェクトの配列である必要があります。");
      }
      if (data.length === 0) return "";

      // Collect all keys
      var keysMap = {};
      data.forEach(function (item) {
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          Object.keys(item).forEach(function (key) { keysMap[key] = true; });
        }
      });
      var keys = Object.keys(keysMap);
      if (keys.length === 0) {
        throw new Error("JSONはオブジェクトの配列である必要があります。");
      }

      var lines = [];
      // Header row
      lines.push(keys.map(function (k) { return escapeCsvField(k, delimiter); }).join(delimiter));

      // Data rows
      data.forEach(function (item) {
        var row = keys.map(function (key) {
          var val = item[key];
          if (val === null || val === undefined) return "";
          if (typeof val === "object") return escapeCsvField(JSON.stringify(val), delimiter);
          return escapeCsvField(String(val), delimiter);
        });
        lines.push(row.join(delimiter));
      });

      return lines.join("\n");
    }

    function escapeCsvField(val, delimiter) {
      if (val.indexOf('"') !== -1 || val.indexOf(delimiter) !== -1 || val.indexOf("\n") !== -1 || val.indexOf("\r") !== -1) {
        return '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    }

    // Tab switching
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabBtns.forEach(function (b) { b.classList.remove("tab-btn--active"); });
        btn.classList.add("tab-btn--active");
        currentMode = btn.getAttribute("data-tab");
        updateLabels();
        clearMessages();
      });
    });

    btnConvert.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("データを入力してください。");
        return;
      }

      var delimiter = delimiterSelect.value;
      var hasHeader = headerToggle.checked;

      try {
        if (currentMode === "csv-to-json") {
          outputEl.value = csvToJson(input, delimiter, hasHeader);
          showSuccess("CSV → JSON変換が完了しました。");
        } else {
          outputEl.value = jsonToCsv(input, delimiter);
          showSuccess("JSON → CSV変換が完了しました。");
        }
      } catch (e) {
        showError("変換エラー: " + e.message);
        outputEl.value = "";
      }
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      outputEl.value = "";
      clearMessages();
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
