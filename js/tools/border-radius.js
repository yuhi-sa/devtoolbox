"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var previewBox = document.getElementById("radius-preview");
    var linkCheckbox = document.getElementById("link-corners");
    var advancedCheckbox = document.getElementById("advanced-mode");
    var advancedSection = document.getElementById("advanced-section");
    var cssOutput = document.getElementById("css-output");
    var copyBtn = document.getElementById("copy-css");
    var successEl = document.getElementById("copy-success");

    var corners = ["tl", "tr", "br", "bl"];
    var sliders = {};
    var vals = {};

    corners.forEach(function (c) {
      sliders[c] = document.getElementById("radius-" + c);
      vals[c] = document.getElementById("val-" + c);
    });

    var advSliders = {};
    var advVals = {};
    ["h-tl", "h-tr", "h-br", "h-bl", "v-tl", "v-tr", "v-br", "v-bl"].forEach(function (key) {
      advSliders[key] = document.getElementById("radius-" + key);
      advVals[key] = document.getElementById("val-" + key);
    });

    function update() {
      if (advancedCheckbox.checked) {
        var hTl = advSliders["h-tl"].value;
        var hTr = advSliders["h-tr"].value;
        var hBr = advSliders["h-br"].value;
        var hBl = advSliders["h-bl"].value;
        var vTl = advSliders["v-tl"].value;
        var vTr = advSliders["v-tr"].value;
        var vBr = advSliders["v-br"].value;
        var vBl = advSliders["v-bl"].value;

        var radiusValue = hTl + "px " + hTr + "px " + hBr + "px " + hBl + "px / " +
                          vTl + "px " + vTr + "px " + vBr + "px " + vBl + "px";
        previewBox.style.borderRadius = radiusValue;
        cssOutput.value = "border-radius: " + radiusValue + ";";
      } else {
        var tl = sliders.tl.value;
        var tr = sliders.tr.value;
        var br = sliders.br.value;
        var bl = sliders.bl.value;

        var radiusStr = tl + "px " + tr + "px " + br + "px " + bl + "px";
        previewBox.style.borderRadius = radiusStr;
        cssOutput.value = "border-radius: " + radiusStr + ";";
      }
    }

    function onSimpleSliderInput(corner) {
      return function () {
        var value = sliders[corner].value;
        vals[corner].textContent = value + "px";

        if (linkCheckbox.checked) {
          corners.forEach(function (c) {
            sliders[c].value = value;
            vals[c].textContent = value + "px";
          });
        }
        update();
      };
    }

    corners.forEach(function (c) {
      sliders[c].addEventListener("input", onSimpleSliderInput(c));
    });

    ["h-tl", "h-tr", "h-br", "h-bl", "v-tl", "v-tr", "v-br", "v-bl"].forEach(function (key) {
      advSliders[key].addEventListener("input", function () {
        advVals[key].textContent = advSliders[key].value + "px";
        update();
      });
    });

    linkCheckbox.addEventListener("change", function () {
      if (linkCheckbox.checked) {
        var value = sliders.tl.value;
        corners.forEach(function (c) {
          sliders[c].value = value;
          vals[c].textContent = value + "px";
        });
        update();
      }
    });

    advancedCheckbox.addEventListener("change", function () {
      advancedSection.hidden = !advancedCheckbox.checked;
      if (advancedCheckbox.checked) {
        corners.forEach(function (c) {
          var v = sliders[c].value;
          advSliders["h-" + c].value = v;
          advVals["h-" + c].textContent = v + "px";
          advSliders["v-" + c].value = v;
          advVals["v-" + c].textContent = v + "px";
        });
      }
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

    update();
  });
})();
