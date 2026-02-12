"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var preview = document.getElementById("gradient-preview");
    var typeSelect = document.getElementById("gradient-type");
    var angleSlider = document.getElementById("gradient-angle");
    var angleValue = document.getElementById("angle-value");
    var angleRow = document.getElementById("angle-row");
    var shapeRow = document.getElementById("shape-row");
    var shapeSelect = document.getElementById("radial-shape");
    var stopsContainer = document.getElementById("color-stops");
    var addBtn = document.getElementById("add-stop");
    var removeBtn = document.getElementById("remove-stop");
    var cssOutput = document.getElementById("css-output");
    var copyBtn = document.getElementById("copy-css");
    var successEl = document.getElementById("copy-success");

    var defaultStops = [
      { color: "#1a73e8", position: 0 },
      { color: "#e91e63", position: 100 }
    ];

    var stops = defaultStops.map(function (s) { return { color: s.color, position: s.position }; });

    function renderStops() {
      stopsContainer.innerHTML = "";
      stops.forEach(function (stop, i) {
        var row = document.createElement("div");
        row.className = "color-stop";

        var colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = stop.color;
        colorInput.setAttribute("aria-label", "カラー " + (i + 1));
        colorInput.addEventListener("input", function () {
          stops[i].color = colorInput.value;
          update();
        });

        var rangeInput = document.createElement("input");
        rangeInput.type = "range";
        rangeInput.min = "0";
        rangeInput.max = "100";
        rangeInput.value = String(stop.position);
        rangeInput.setAttribute("aria-label", "位置 " + (i + 1));
        rangeInput.addEventListener("input", function () {
          stops[i].position = parseInt(rangeInput.value, 10);
          valSpan.textContent = rangeInput.value + "%";
          update();
        });

        var valSpan = document.createElement("span");
        valSpan.className = "stop-value";
        valSpan.textContent = stop.position + "%";

        row.appendChild(colorInput);
        row.appendChild(rangeInput);
        row.appendChild(valSpan);
        stopsContainer.appendChild(row);
      });
    }

    function buildGradientCSS() {
      var sortedStops = stops.slice().sort(function (a, b) { return a.position - b.position; });
      var stopsStr = sortedStops.map(function (s) { return s.color + " " + s.position + "%"; }).join(", ");

      if (typeSelect.value === "linear") {
        return "linear-gradient(" + angleSlider.value + "deg, " + stopsStr + ")";
      } else {
        return "radial-gradient(" + shapeSelect.value + ", " + stopsStr + ")";
      }
    }

    function update() {
      var gradient = buildGradientCSS();
      preview.style.background = gradient;
      cssOutput.value = "background: " + gradient + ";";
    }

    typeSelect.addEventListener("change", function () {
      if (typeSelect.value === "linear") {
        angleRow.hidden = false;
        shapeRow.hidden = true;
      } else {
        angleRow.hidden = true;
        shapeRow.hidden = false;
      }
      update();
    });

    angleSlider.addEventListener("input", function () {
      angleValue.textContent = angleSlider.value + "deg";
      update();
    });

    shapeSelect.addEventListener("change", function () {
      update();
    });

    addBtn.addEventListener("click", function () {
      if (stops.length >= 10) return;
      stops.push({ color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"), position: 50 });
      renderStops();
      update();
    });

    removeBtn.addEventListener("click", function () {
      if (stops.length <= 2) return;
      stops.pop();
      renderStops();
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

    renderStops();
    update();
  });
})();
