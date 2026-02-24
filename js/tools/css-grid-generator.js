"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var colsInput = document.getElementById("grid-cols");
    var rowsInput = document.getElementById("grid-rows");
    var gapInput = document.getElementById("grid-gap");
    var previewEl = document.getElementById("grid-preview");
    var outputEl = document.getElementById("css-output");
    var btnCopy = document.getElementById("btn-copy");
    var successEl = document.getElementById("grid-success");
    var areaNameInput = document.getElementById("area-name");
    var btnAssignArea = document.getElementById("btn-assign-area");
    var btnClearAreas = document.getElementById("btn-clear-areas");
    var colSizesContainer = document.getElementById("col-sizes-container");
    var rowSizesContainer = document.getElementById("row-sizes-container");

    var selectedCells = new Set();
    var gridAreas = []; // 2D array: gridAreas[row][col] = area name or "."
    var colSizes = [];
    var rowSizes = [];

    function getCols() { return Math.max(1, Math.min(12, parseInt(colsInput.value, 10) || 3)); }
    function getRows() { return Math.max(1, Math.min(12, parseInt(rowsInput.value, 10) || 3)); }
    function getGap() { return Math.max(0, Math.min(100, parseInt(gapInput.value, 10) || 0)); }

    function initAreas() {
      var cols = getCols();
      var rows = getRows();
      gridAreas = [];
      for (var r = 0; r < rows; r++) {
        gridAreas[r] = [];
        for (var c = 0; c < cols; c++) {
          gridAreas[r][c] = ".";
        }
      }
      selectedCells.clear();
    }

    function initSizes() {
      var cols = getCols();
      var rows = getRows();
      colSizes = [];
      rowSizes = [];
      for (var c = 0; c < cols; c++) colSizes.push("1fr");
      for (var r = 0; r < rows; r++) rowSizes.push("1fr");
    }

    function renderSizeInputs() {
      var cols = getCols();
      var rows = getRows();

      while (colSizesContainer.children.length > 1) colSizesContainer.removeChild(colSizesContainer.lastChild);
      while (rowSizesContainer.children.length > 1) rowSizesContainer.removeChild(rowSizesContainer.lastChild);

      for (var c = 0; c < cols; c++) {
        var input = document.createElement("input");
        input.type = "text";
        input.value = colSizes[c] || "1fr";
        input.dataset.index = c;
        input.setAttribute("aria-label", "列" + (c + 1) + "のサイズ");
        input.addEventListener("input", function () {
          colSizes[parseInt(this.dataset.index, 10)] = this.value || "1fr";
          updatePreviewAndCode();
        });
        colSizesContainer.appendChild(input);
      }

      for (var r = 0; r < rows; r++) {
        var input = document.createElement("input");
        input.type = "text";
        input.value = rowSizes[r] || "1fr";
        input.dataset.index = r;
        input.setAttribute("aria-label", "行" + (r + 1) + "のサイズ");
        input.addEventListener("input", function () {
          rowSizes[parseInt(this.dataset.index, 10)] = this.value || "1fr";
          updatePreviewAndCode();
        });
        rowSizesContainer.appendChild(input);
      }
    }

    function renderPreview() {
      var cols = getCols();
      var rows = getRows();
      var gap = getGap();

      previewEl.innerHTML = "";
      previewEl.style.gridTemplateColumns = colSizes.join(" ");
      previewEl.style.gridTemplateRows = rowSizes.join(" ");
      previewEl.style.gap = gap + "px";

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var cell = document.createElement("div");
          cell.className = "grid-cell";
          cell.dataset.row = r;
          cell.dataset.col = c;
          var area = gridAreas[r] && gridAreas[r][c] ? gridAreas[r][c] : ".";
          if (area !== ".") {
            cell.textContent = area;
            cell.classList.add("area-assigned");
          } else {
            cell.textContent = (r + 1) + "," + (c + 1);
          }
          var key = r + "," + c;
          if (selectedCells.has(key)) {
            cell.classList.add("selected");
          }
          cell.addEventListener("click", handleCellClick);
          previewEl.appendChild(cell);
        }
      }
    }

    function handleCellClick(e) {
      var row = parseInt(e.currentTarget.dataset.row, 10);
      var col = parseInt(e.currentTarget.dataset.col, 10);
      var key = row + "," + col;
      if (selectedCells.has(key)) {
        selectedCells.delete(key);
        e.currentTarget.classList.remove("selected");
      } else {
        selectedCells.add(key);
        e.currentTarget.classList.add("selected");
      }
    }

    function generateCSS() {
      var cols = getCols();
      var rows = getRows();
      var gap = getGap();
      var hasAreas = false;

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          if (gridAreas[r][c] !== ".") { hasAreas = true; break; }
        }
        if (hasAreas) break;
      }

      var css = ".grid-container {\n";
      css += "  display: grid;\n";
      css += "  grid-template-columns: " + colSizes.join(" ") + ";\n";
      css += "  grid-template-rows: " + rowSizes.join(" ") + ";\n";
      if (gap > 0) css += "  gap: " + gap + "px;\n";

      if (hasAreas) {
        css += "  grid-template-areas:\n";
        for (var r = 0; r < rows; r++) {
          css += '    "' + gridAreas[r].join(" ") + '"';
          css += r < rows - 1 ? "\n" : ";\n";
        }

        var areaNames = new Set();
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            if (gridAreas[r][c] !== ".") areaNames.add(gridAreas[r][c]);
          }
        }
        css += "}\n";
        areaNames.forEach(function (name) {
          css += "\n." + name + " {\n  grid-area: " + name + ";\n}\n";
        });
      } else {
        css += "}\n";
      }

      return css;
    }

    function updatePreviewAndCode() {
      renderPreview();
      outputEl.value = generateCSS();
    }

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function rebuild() {
      initAreas();
      initSizes();
      renderSizeInputs();
      updatePreviewAndCode();
    }

    colsInput.addEventListener("input", rebuild);
    rowsInput.addEventListener("input", rebuild);
    gapInput.addEventListener("input", updatePreviewAndCode);

    btnAssignArea.addEventListener("click", function () {
      var name = areaNameInput.value.trim();
      if (!name) return;
      if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(name)) {
        alert("エリア名は英数字、ハイフン、アンダースコアのみ使用できます。先頭は英字またはアンダースコアにしてください。");
        return;
      }
      if (selectedCells.size === 0) {
        alert("セルを選択してからエリアを割り当ててください。");
        return;
      }
      selectedCells.forEach(function (key) {
        var parts = key.split(",");
        var r = parseInt(parts[0], 10);
        var c = parseInt(parts[1], 10);
        gridAreas[r][c] = name;
      });
      selectedCells.clear();
      areaNameInput.value = "";
      updatePreviewAndCode();
    });

    btnClearAreas.addEventListener("click", function () {
      initAreas();
      updatePreviewAndCode();
    });

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });

    // Presets
    function applyPreset(cols, rows, gap, cSizes, rSizes, areas) {
      colsInput.value = cols;
      rowsInput.value = rows;
      gapInput.value = gap;
      colSizes = cSizes.slice();
      rowSizes = rSizes.slice();
      gridAreas = areas.map(function (row) { return row.slice(); });
      selectedCells.clear();
      renderSizeInputs();
      updatePreviewAndCode();
    }

    document.getElementById("preset-holy-grail").addEventListener("click", function () {
      applyPreset(3, 3, 10,
        ["200px", "1fr", "200px"],
        ["auto", "1fr", "auto"],
        [
          ["header", "header", "header"],
          ["nav", "main", "aside"],
          ["footer", "footer", "footer"]
        ]);
    });

    document.getElementById("preset-dashboard").addEventListener("click", function () {
      applyPreset(4, 3, 10,
        ["1fr", "1fr", "1fr", "1fr"],
        ["auto", "1fr", "1fr"],
        [
          ["header", "header", "header", "header"],
          ["sidebar", "content", "content", "content"],
          ["sidebar", "content", "content", "content"]
        ]);
    });

    document.getElementById("preset-gallery").addEventListener("click", function () {
      applyPreset(3, 3, 10,
        ["1fr", "1fr", "1fr"],
        ["1fr", "1fr", "1fr"],
        [
          [".", ".", "."],
          [".", ".", "."],
          [".", ".", "."]
        ]);
    });

    document.getElementById("preset-sidebar").addEventListener("click", function () {
      applyPreset(2, 3, 10,
        ["250px", "1fr"],
        ["auto", "1fr", "auto"],
        [
          ["header", "header"],
          ["sidebar", "main"],
          ["footer", "footer"]
        ]);
    });

    document.getElementById("preset-reset").addEventListener("click", function () {
      colsInput.value = 3;
      rowsInput.value = 3;
      gapInput.value = 10;
      rebuild();
    });

    // Initial render
    rebuild();
  });
})();
