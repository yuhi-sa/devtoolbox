"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var rowsInput = document.getElementById("md-rows");
    var colsInput = document.getElementById("md-cols");
    var btnGenerate = document.getElementById("btn-generate");
    var btnAddRow = document.getElementById("btn-add-row");
    var btnRemoveRow = document.getElementById("btn-remove-row");
    var btnAddCol = document.getElementById("btn-add-col");
    var btnRemoveCol = document.getElementById("btn-remove-col");
    var btnCopy = document.getElementById("btn-copy");
    var thead = document.getElementById("md-thead");
    var tbody = document.getElementById("md-tbody");
    var outputEl = document.getElementById("md-output");
    var successEl = document.getElementById("md-success");

    var currentCols = 0;

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () {
        successEl.hidden = true;
      }, 2000);
    }

    function createEditableCell(tag, text) {
      var cell = document.createElement(tag);
      cell.contentEditable = "true";
      cell.textContent = text || "";
      cell.addEventListener("input", updateMarkdown);
      cell.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
          e.preventDefault();
          var next = tag === "th" ? getNextHeaderCell(cell) : getNextBodyCell(cell);
          if (next) next.focus();
        }
      });
      return cell;
    }

    function getNextHeaderCell(cell) {
      var next = cell.nextElementSibling;
      if (next) return next;
      var alignRow = thead.querySelector(".md-align-row");
      if (alignRow) {
        var bodyFirstRow = tbody.querySelector("tr");
        if (bodyFirstRow) return bodyFirstRow.querySelector("td[contenteditable]");
      }
      return null;
    }

    function getNextBodyCell(cell) {
      var next = cell.nextElementSibling;
      if (next && next.contentEditable === "true") return next;
      var row = cell.parentElement;
      var nextRow = row.nextElementSibling;
      if (nextRow) {
        var firstCell = nextRow.querySelector("td[contenteditable]");
        if (firstCell) return firstCell;
      }
      return null;
    }

    function createAlignSelect() {
      var select = document.createElement("select");
      var options = [
        { value: "left", text: "左寄せ" },
        { value: "center", text: "中央揃え" },
        { value: "right", text: "右寄せ" }
      ];
      options.forEach(function (opt) {
        var option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.text;
        select.appendChild(option);
      });
      select.addEventListener("change", updateMarkdown);
      return select;
    }

    function generateTable(rows, cols) {
      thead.innerHTML = "";
      tbody.innerHTML = "";
      currentCols = cols;

      // Header row
      var headerRow = document.createElement("tr");
      for (var c = 0; c < cols; c++) {
        headerRow.appendChild(createEditableCell("th", "Header " + (c + 1)));
      }
      thead.appendChild(headerRow);

      // Alignment row
      var alignRow = document.createElement("tr");
      alignRow.className = "md-align-row";
      for (var c = 0; c < cols; c++) {
        var td = document.createElement("td");
        td.appendChild(createAlignSelect());
        alignRow.appendChild(td);
      }
      thead.appendChild(alignRow);

      // Body rows
      for (var r = 0; r < rows; r++) {
        var row = document.createElement("tr");
        for (var c = 0; c < cols; c++) {
          row.appendChild(createEditableCell("td", ""));
        }
        tbody.appendChild(row);
      }

      updateMarkdown();
    }

    function getAlignments() {
      var alignRow = thead.querySelector(".md-align-row");
      if (!alignRow) return [];
      var selects = alignRow.querySelectorAll("select");
      var alignments = [];
      for (var i = 0; i < selects.length; i++) {
        alignments.push(selects[i].value);
      }
      return alignments;
    }

    function getHeaders() {
      var headerRow = thead.querySelector("tr:first-child");
      if (!headerRow) return [];
      var cells = headerRow.querySelectorAll("th");
      var headers = [];
      for (var i = 0; i < cells.length; i++) {
        headers.push(cells[i].textContent.trim());
      }
      return headers;
    }

    function getBodyData() {
      var rows = tbody.querySelectorAll("tr");
      var data = [];
      for (var r = 0; r < rows.length; r++) {
        var cells = rows[r].querySelectorAll("td");
        var rowData = [];
        for (var c = 0; c < cells.length; c++) {
          rowData.push(cells[c].textContent.trim());
        }
        data.push(rowData);
      }
      return data;
    }

    function escapeMarkdown(text) {
      return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
    }

    function computeColumnWidths(headers, bodyData, alignments) {
      var cols = headers.length;
      var widths = [];
      for (var c = 0; c < cols; c++) {
        var maxLen = Math.max(3, escapeMarkdown(headers[c] || "").length);
        for (var r = 0; r < bodyData.length; r++) {
          var cellText = escapeMarkdown(bodyData[r][c] || "");
          if (cellText.length > maxLen) maxLen = cellText.length;
        }
        // Account for alignment markers
        var align = alignments[c] || "left";
        if (align === "center") {
          maxLen = Math.max(maxLen, 3);
        } else {
          maxLen = Math.max(maxLen, 3);
        }
        widths.push(maxLen);
      }
      return widths;
    }

    function padCell(text, width) {
      var escaped = escapeMarkdown(text || "");
      while (escaped.length < width) {
        escaped += " ";
      }
      return escaped;
    }

    function buildSeparator(align, width) {
      var dashes = "";
      var innerWidth = width;
      if (align === "center") {
        innerWidth = Math.max(1, width - 2);
        for (var i = 0; i < innerWidth; i++) dashes += "-";
        return ":" + dashes + ":";
      } else if (align === "right") {
        innerWidth = Math.max(1, width - 1);
        for (var i = 0; i < innerWidth; i++) dashes += "-";
        return dashes + ":";
      } else {
        // left (default)
        innerWidth = Math.max(1, width - 1);
        for (var i = 0; i < innerWidth; i++) dashes += "-";
        return ":" + dashes;
      }
    }

    function updateMarkdown() {
      var headers = getHeaders();
      var bodyData = getBodyData();
      var alignments = getAlignments();
      var cols = headers.length;

      if (cols === 0) {
        outputEl.value = "";
        return;
      }

      var widths = computeColumnWidths(headers, bodyData, alignments);

      // Header line
      var headerLine = "|";
      for (var c = 0; c < cols; c++) {
        headerLine += " " + padCell(headers[c], widths[c]) + " |";
      }

      // Separator line
      var sepLine = "|";
      for (var c = 0; c < cols; c++) {
        var sep = buildSeparator(alignments[c] || "left", widths[c]);
        while (sep.length < widths[c]) sep = sep.slice(0, sep.length - 1) + "-" + sep.slice(sep.length - 1);
        sepLine += " " + sep + " |";
      }

      // Body lines
      var bodyLines = [];
      for (var r = 0; r < bodyData.length; r++) {
        var line = "|";
        for (var c = 0; c < cols; c++) {
          line += " " + padCell(bodyData[r][c], widths[c]) + " |";
        }
        bodyLines.push(line);
      }

      var markdown = headerLine + "\n" + sepLine;
      if (bodyLines.length > 0) {
        markdown += "\n" + bodyLines.join("\n");
      }

      outputEl.value = markdown;
    }

    function addRow() {
      if (currentCols === 0) return;
      var row = document.createElement("tr");
      for (var c = 0; c < currentCols; c++) {
        row.appendChild(createEditableCell("td", ""));
      }
      tbody.appendChild(row);
      updateMarkdown();
    }

    function removeRow() {
      var rows = tbody.querySelectorAll("tr");
      if (rows.length > 1) {
        tbody.removeChild(rows[rows.length - 1]);
        updateMarkdown();
      }
    }

    function addColumn() {
      if (currentCols === 0) return;
      currentCols++;

      // Add header cell
      var headerRow = thead.querySelector("tr:first-child");
      if (headerRow) {
        headerRow.appendChild(createEditableCell("th", "Header " + currentCols));
      }

      // Add alignment select
      var alignRow = thead.querySelector(".md-align-row");
      if (alignRow) {
        var td = document.createElement("td");
        td.appendChild(createAlignSelect());
        alignRow.appendChild(td);
      }

      // Add cell to each body row
      var bodyRows = tbody.querySelectorAll("tr");
      for (var r = 0; r < bodyRows.length; r++) {
        bodyRows[r].appendChild(createEditableCell("td", ""));
      }

      colsInput.value = currentCols;
      updateMarkdown();
    }

    function removeColumn() {
      if (currentCols <= 1) return;
      currentCols--;

      // Remove last header cell
      var headerRow = thead.querySelector("tr:first-child");
      if (headerRow && headerRow.lastElementChild) {
        headerRow.removeChild(headerRow.lastElementChild);
      }

      // Remove last alignment cell
      var alignRow = thead.querySelector(".md-align-row");
      if (alignRow && alignRow.lastElementChild) {
        alignRow.removeChild(alignRow.lastElementChild);
      }

      // Remove last cell from each body row
      var bodyRows = tbody.querySelectorAll("tr");
      for (var r = 0; r < bodyRows.length; r++) {
        if (bodyRows[r].lastElementChild) {
          bodyRows[r].removeChild(bodyRows[r].lastElementChild);
        }
      }

      colsInput.value = currentCols;
      updateMarkdown();
    }

    // Event listeners
    btnGenerate.addEventListener("click", function () {
      var rows = parseInt(rowsInput.value, 10) || 3;
      var cols = parseInt(colsInput.value, 10) || 3;
      rows = Math.max(1, Math.min(50, rows));
      cols = Math.max(1, Math.min(20, cols));
      rowsInput.value = rows;
      colsInput.value = cols;
      generateTable(rows, cols);
    });

    btnAddRow.addEventListener("click", addRow);
    btnRemoveRow.addEventListener("click", removeRow);
    btnAddCol.addEventListener("click", addColumn);
    btnRemoveCol.addEventListener("click", removeColumn);

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });

    // Generate default table on load
    generateTable(3, 3);
  });
})();
