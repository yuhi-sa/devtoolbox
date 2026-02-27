"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var previewBox = document.getElementById("anim-preview-box");
    var nameInput = document.getElementById("anim-name");
    var durationInput = document.getElementById("anim-duration");
    var timingSelect = document.getElementById("anim-timing");
    var iterationSelect = document.getElementById("anim-iteration");
    var directionSelect = document.getElementById("anim-direction");
    var fillSelect = document.getElementById("anim-fill");
    var cssOutput = document.getElementById("css-output");
    var copyBtn = document.getElementById("copy-css");
    var successEl = document.getElementById("copy-success");
    var presetButtons = document.getElementById("preset-buttons");

    var dynamicStyle = document.createElement("style");
    document.head.appendChild(dynamicStyle);

    var presets = {
      fadeIn: {
        name: "fadeIn",
        keyframes: "@keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}",
        keyframesRaw: "0% { opacity: 0; } 100% { opacity: 1; }",
        duration: "1",
        timing: "ease",
        iteration: "infinite",
        direction: "alternate",
        fill: "both"
      },
      slideIn: {
        name: "slideIn",
        keyframes: "@keyframes slideIn {\n  0% {\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}",
        keyframesRaw: "0% { transform: translateX(-100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; }",
        duration: "0.8",
        timing: "ease-out",
        iteration: "infinite",
        direction: "alternate",
        fill: "both"
      },
      bounce: {
        name: "bounce",
        keyframes: "@keyframes bounce {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  25% {\n    transform: translateY(-30px);\n  }\n  50% {\n    transform: translateY(0);\n  }\n  75% {\n    transform: translateY(-15px);\n  }\n}",
        keyframesRaw: "0%, 100% { transform: translateY(0); } 25% { transform: translateY(-30px); } 50% { transform: translateY(0); } 75% { transform: translateY(-15px); }",
        duration: "1",
        timing: "ease",
        iteration: "infinite",
        direction: "normal",
        fill: "none"
      },
      pulse: {
        name: "pulse",
        keyframes: "@keyframes pulse {\n  0% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.15);\n  }\n  100% {\n    transform: scale(1);\n  }\n}",
        keyframesRaw: "0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); }",
        duration: "1",
        timing: "ease-in-out",
        iteration: "infinite",
        direction: "normal",
        fill: "none"
      },
      spin: {
        name: "spin",
        keyframes: "@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}",
        keyframesRaw: "0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }",
        duration: "1",
        timing: "linear",
        iteration: "infinite",
        direction: "normal",
        fill: "none"
      },
      shake: {
        name: "shake",
        keyframes: "@keyframes shake {\n  0%, 100% {\n    transform: translateX(0);\n  }\n  10%, 30%, 50%, 70%, 90% {\n    transform: translateX(-5px);\n  }\n  20%, 40%, 60%, 80% {\n    transform: translateX(5px);\n  }\n}",
        keyframesRaw: "0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); }",
        duration: "0.6",
        timing: "ease",
        iteration: "infinite",
        direction: "normal",
        fill: "none"
      }
    };

    var currentKeyframes = presets.fadeIn.keyframes;
    var currentKeyframesRaw = presets.fadeIn.keyframesRaw;

    function getAnimName() {
      var val = nameInput.value.trim();
      return val ? val.replace(/[^a-zA-Z0-9_-]/g, "") || "myAnimation" : "myAnimation";
    }

    function buildAnimationCSS() {
      var name = getAnimName();
      var duration = parseFloat(durationInput.value) || 1;
      var timing = timingSelect.value;
      var iteration = iterationSelect.value;
      var direction = directionSelect.value;
      var fill = fillSelect.value;

      var kf = currentKeyframes.replace(/@keyframes\s+\S+/, "@keyframes " + name);

      var animProp = "animation: " + name + " " + duration + "s " + timing + " " + iteration + " " + direction + " " + fill + ";";

      return kf + "\n\n" + animProp;
    }

    function applyPreviewAnimation() {
      var name = getAnimName();
      var duration = parseFloat(durationInput.value) || 1;
      var timing = timingSelect.value;
      var iteration = iterationSelect.value;
      var direction = directionSelect.value;
      var fill = fillSelect.value;

      var kfRule = "@keyframes " + name + " { " + currentKeyframesRaw + " }";
      dynamicStyle.textContent = kfRule;

      previewBox.style.animation = "none";
      // Force reflow to restart animation
      void previewBox.offsetWidth;
      previewBox.style.animation = name + " " + duration + "s " + timing + " " + iteration + " " + direction + " " + fill;
    }

    function update() {
      cssOutput.value = buildAnimationCSS();
      applyPreviewAnimation();
    }

    function applyPreset(presetKey) {
      var preset = presets[presetKey];
      if (!preset) return;

      nameInput.value = preset.name;
      durationInput.value = preset.duration;
      timingSelect.value = preset.timing;
      iterationSelect.value = preset.iteration;
      directionSelect.value = preset.direction;
      fillSelect.value = preset.fill;
      currentKeyframes = preset.keyframes;
      currentKeyframesRaw = preset.keyframesRaw;

      update();
    }

    presetButtons.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-preset]");
      if (!btn) return;
      applyPreset(btn.getAttribute("data-preset"));
    });

    nameInput.addEventListener("input", function () {
      update();
    });

    durationInput.addEventListener("input", function () {
      update();
    });

    timingSelect.addEventListener("change", function () {
      update();
    });

    iterationSelect.addEventListener("change", function () {
      update();
    });

    directionSelect.addEventListener("change", function () {
      update();
    });

    fillSelect.addEventListener("change", function () {
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

    // Initialize with fadeIn preset
    applyPreset("fadeIn");
  });
})();
