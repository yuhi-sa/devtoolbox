"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("jtc-input");
    var outputEl = document.getElementById("jtc-output");
    var inputLabel = document.getElementById("jtc-input-label");
    var errorEl = document.getElementById("jtc-error");
    var successEl = document.getElementById("jtc-success");
    var delimiterSelect = document.getElementById("jtc-delimiter");
    var flattenCheckbox = document.getElementById("jtc-flatten");
    var flattenOption = document.getElementById("jtc-flatten-option");
    var btnConvert = document.getElementById("btn-convert");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var btnDownload = document.getElementById("btn-download");
    var tabBtns = document.querySelectorAll(".tab-btn");
    var currentMode = "json-to-csv";

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
      if (currentMode === "json-to-csv") {
        inputLabel.textContent = "JSON入力";
        inputEl.placeholder = '[{"name": "田中", "age": 30, "address": {"city": "東京"}}]';
        flattenOption.style.display = "";
      } else {
        inputLabel.textContent = "CSV入力";
        inputEl.placeholder = "name,age,city\n田中,30,東京\n鈴木,25,大阪";
        flattenOption.style.display = "none";
      }
    }

    // Flatten nested object with dot notation
    function flattenObject(obj, prefix) {
      var result = {};
      prefix = prefix || "";
      Object.keys(obj).forEach(function (key) {
        var fullKey = prefix ? prefix + "." + key : key;
        var val = obj[key];
        if (val !== null && typeof val === "object" && !Array.isArray(val)) {
          var nested = flattenObject(val, fullKey);
          Object.keys(nested).forEach(function (nk) {
            result[nk] = nested[nk];
          });
        } else {
          result[fullKey] = val;
        }
      });
      return result;
    }

    function escapeCsvField(val, delimiter) {
      var str = String(val);
      if (str.indexOf('"') !== -1 || str.indexOf(delimiter) !== -1 || str.indexOf("\n") !== -1 || str.indexOf("\r") !== -1) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }

    // JSON to CSV conversion
    function jsonToCsv(text, delimiter, flatten) {
      var data = JSON.parse(text);
      if (!Array.isArray(data)) {
        throw new Error("JSONはオブジェクトの配列である必要があります。");
      }
      if (data.length === 0) return "";

      // Optionally flatten nested objects
      var processedData = data.map(function (item) {
        if (typeof item !== "object" || item === null || Array.isArray(item)) {
          throw new Error("配列の各要素はオブジェクトである必要があります。");
        }
        return flatten ? flattenObject(item) : item;
      });

      // Collect all keys preserving order
      var keysMap = {};
      var keys = [];
      processedData.forEach(function (item) {
        Object.keys(item).forEach(function (key) {
          if (!keysMap[key]) {
            keysMap[key] = true;
            keys.push(key);
          }
        });
      });

      var lines = [];
      // Header row
      lines.push(keys.map(function (k) { return escapeCsvField(k, delimiter); }).join(delimiter));

      // Data rows
      processedData.forEach(function (item) {
        var row = keys.map(function (key) {
          var val = item[key];
          if (val === null || val === undefined) return "";
          if (typeof val === "object") return escapeCsvField(JSON.stringify(val), delimiter);
          return escapeCsvField(val, delimiter);
        });
        lines.push(row.join(delimiter));
      });

      return lines.join("\n");
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

    // CSV to JSON conversion
    function csvToJson(text, delimiter) {
      var rows = parseCsv(text, delimiter);
      if (rows.length === 0) return "[]";

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

      try {
        if (currentMode === "json-to-csv") {
          var flatten = flattenCheckbox.checked;
          outputEl.value = jsonToCsv(input, delimiter, flatten);
          showSuccess("JSON → CSV変換が完了しました。");
        } else {
          outputEl.value = csvToJson(input, delimiter);
          showSuccess("CSV → JSON変換が完了しました。");
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
      window.DevToolBox.copyToClipboard(text).then(function () {
        showSuccess("コピーしました。");
      });
    });

    btnDownload.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;

      var ext = currentMode === "json-to-csv" ? "csv" : "json";
      var mimeType = currentMode === "json-to-csv" ? "text/csv" : "application/json";
      // BOM for Excel compatibility
      var bom = currentMode === "json-to-csv" ? "\uFEFF" : "";
      var blob = new Blob([bom + text], { type: mimeType + ";charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "data." + ext;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showSuccess("ファイルをダウンロードしました。");
    });
  });
})();
