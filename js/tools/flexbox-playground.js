"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var previewArea = document.getElementById("flex-preview");
    var directionSelect = document.getElementById("flex-direction");
    var justifySelect = document.getElementById("justify-content");
    var alignSelect = document.getElementById("align-items");
    var wrapSelect = document.getElementById("flex-wrap");
    var gapSlider = document.getElementById("gap-value");
    var gapDisplay = document.getElementById("gap-display");
    var addBtn = document.getElementById("add-item");
    var removeBtn = document.getElementById("remove-item");
    var cssOutput = document.getElementById("css-output");
    var copyBtn = document.getElementById("copy-css");
    var successEl = document.getElementById("copy-success");

    var itemColors = [
      "#1a73e8", "#e91e63", "#4caf50", "#ff9800",
      "#9c27b0", "#00bcd4", "#f44336", "#3f51b5",
      "#8bc34a", "#ff5722", "#607d8b", "#795548"
    ];

    var itemCount = 4;

    function renderItems() {
      previewArea.innerHTML = "";
      for (var i = 0; i < itemCount; i++) {
        var item = document.createElement("div");
        item.className = "flex-child";
        item.style.backgroundColor = itemColors[i % itemColors.length];
        item.textContent = (i + 1);
        previewArea.appendChild(item);
      }
    }

    function update() {
      previewArea.style.flexDirection = directionSelect.value;
      previewArea.style.justifyContent = justifySelect.value;
      previewArea.style.alignItems = alignSelect.value;
      previewArea.style.flexWrap = wrapSelect.value;
      previewArea.style.gap = gapSlider.value + "px";

      var lines = [
        "display: flex;",
        "flex-direction: " + directionSelect.value + ";",
        "justify-content: " + justifySelect.value + ";",
        "align-items: " + alignSelect.value + ";",
        "flex-wrap: " + wrapSelect.value + ";",
        "gap: " + gapSlider.value + "px;"
      ];
      cssOutput.value = lines.join("\n");
    }

    directionSelect.addEventListener("change", update);
    justifySelect.addEventListener("change", update);
    alignSelect.addEventListener("change", update);
    wrapSelect.addEventListener("change", update);
    gapSlider.addEventListener("input", function () {
      gapDisplay.textContent = gapSlider.value + "px";
      update();
    });

    addBtn.addEventListener("click", function () {
      if (itemCount >= 12) return;
      itemCount++;
      renderItems();
      update();
    });

    removeBtn.addEventListener("click", function () {
      if (itemCount <= 1) return;
      itemCount--;
      renderItems();
      update();
    });

    copyBtn.addEventListener("click", function () {
      var text = cssOutput.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        successEl.textContent = "コピーしました。";
        successEl.hidden = false;
        setTimeout(function () { successEl.hidden = true; }, 2000);
      });
    });

    renderItems();
    update();
  });
})();
