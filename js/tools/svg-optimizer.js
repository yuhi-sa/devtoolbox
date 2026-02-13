"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("svg-input");
    var outputEl = document.getElementById("svg-output");
    var btnOptimize = document.getElementById("btn-optimize");
    var btnBeautify = document.getElementById("btn-beautify");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var btnDownload = document.getElementById("btn-download");
    var sizeStats = document.getElementById("size-stats");
    var originalSizeEl = document.getElementById("original-size");
    var optimizedSizeEl = document.getElementById("optimized-size");
    var reductionRateEl = document.getElementById("reduction-rate");
    var svgPreview = document.getElementById("svg-preview");

    var optComments = document.getElementById("opt-comments");
    var optMetadata = document.getElementById("opt-metadata");
    var optEmptyGroups = document.getElementById("opt-empty-groups");
    var optDefaults = document.getElementById("opt-defaults");
    var optMinify = document.getElementById("opt-minify");

    function formatBytes(bytes) {
      if (bytes === 0) return "0 B";
      var units = ["B", "KB", "MB"];
      var i = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2) + " " + units[i];
    }

    function removeComments(svg) {
      return svg.replace(/<!--[\s\S]*?-->/g, "");
    }

    function removeMetadata(svg) {
      // Remove <?xml ...?> declarations
      svg = svg.replace(/<\?xml[^?]*\?>/gi, "");
      // Remove <!DOCTYPE ...>
      svg = svg.replace(/<!DOCTYPE[^>]*>/gi, "");
      // Remove <metadata>...</metadata>
      svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
      // Remove editor namespaces and attributes (Inkscape, Illustrator, etc.)
      svg = svg.replace(/\s+xmlns:(inkscape|sodipodi|dc|cc|rdf|sketch|i)="[^"]*"/g, "");
      svg = svg.replace(/\s+(inkscape|sodipodi|sketch):[a-zA-Z-]+="[^"]*"/g, "");
      // Remove <sodipodi:...> elements
      svg = svg.replace(/<sodipodi:[^>]*\/>/g, "");
      svg = svg.replace(/<sodipodi:[^>]*>[\s\S]*?<\/sodipodi:[^>]*>/g, "");
      // Remove <dc:...>, <cc:...>, <rdf:...> elements
      svg = svg.replace(/<(dc|cc|rdf):[^>]*\/>/g, "");
      svg = svg.replace(/<(dc|cc|rdf):[^>]*>[\s\S]*?<\/(dc|cc|rdf):[^>]*>/g, "");
      return svg;
    }

    function removeEmptyGroups(svg) {
      var prev;
      do {
        prev = svg;
        svg = svg.replace(/<g[^>]*>\s*<\/g>/g, "");
      } while (svg !== prev);
      return svg;
    }

    function removeDefaults(svg) {
      // Remove common default attributes
      svg = svg.replace(/\s+fill-opacity="1"/g, "");
      svg = svg.replace(/\s+stroke-opacity="1"/g, "");
      svg = svg.replace(/\s+opacity="1"/g, "");
      svg = svg.replace(/\s+fill-rule="nonzero"/g, "");
      svg = svg.replace(/\s+clip-rule="nonzero"/g, "");
      svg = svg.replace(/\s+stroke="none"/g, "");
      svg = svg.replace(/\s+stroke-width="1"/g, "");
      svg = svg.replace(/\s+stroke-dasharray="none"/g, "");
      svg = svg.replace(/\s+stroke-dashoffset="0"/g, "");
      svg = svg.replace(/\s+stroke-linecap="butt"/g, "");
      svg = svg.replace(/\s+stroke-linejoin="miter"/g, "");
      svg = svg.replace(/\s+stroke-miterlimit="4"/g, "");
      svg = svg.replace(/\s+font-style="normal"/g, "");
      svg = svg.replace(/\s+font-variant="normal"/g, "");
      svg = svg.replace(/\s+font-weight="normal"/g, "");
      svg = svg.replace(/\s+font-stretch="normal"/g, "");
      svg = svg.replace(/\s+text-decoration="none"/g, "");
      svg = svg.replace(/\s+display="inline"/g, "");
      svg = svg.replace(/\s+visibility="visible"/g, "");
      svg = svg.replace(/\s+overflow="visible"/g, "");
      svg = svg.replace(/\s+enable-background="accumulate"/g, "");
      svg = svg.replace(/\s+version="1\.1"/g, "");
      svg = svg.replace(/\s+baseProfile="[^"]*"/g, "");
      return svg;
    }

    function minifySvg(svg) {
      // Collapse multiple whitespace
      svg = svg.replace(/\s+/g, " ");
      // Remove spaces between tags
      svg = svg.replace(/>\s+</g, "><");
      // Remove leading/trailing whitespace
      svg = svg.trim();
      return svg;
    }

    function beautifySvg(svg) {
      // Simple XML beautifier
      var formatted = "";
      var indent = 0;
      var tags = svg.replace(/>\s*</g, ">\n<").split("\n");
      for (var i = 0; i < tags.length; i++) {
        var tag = tags[i].trim();
        if (!tag) continue;
        if (tag.match(/^<\//) ) {
          indent--;
        }
        formatted += "  ".repeat(Math.max(0, indent)) + tag + "\n";
        if (tag.match(/^<[^/!?]/) && !tag.match(/\/>$/) && !tag.match(/<\/[^>]+>$/)) {
          indent++;
        }
      }
      return formatted.trim();
    }

    function showPreview(svg) {
      // Sanitize: remove script tags to prevent XSS
      var safeSvg = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
      safeSvg = safeSvg.replace(/on\w+="[^"]*"/gi, "");
      svgPreview.innerHTML = safeSvg;
      svgPreview.style.display = "";
    }

    function showStats(originalSize, optimizedSize) {
      originalSizeEl.textContent = formatBytes(originalSize);
      optimizedSizeEl.textContent = formatBytes(optimizedSize);
      var reduction = originalSize > 0 ? ((1 - optimizedSize / originalSize) * 100) : 0;
      reductionRateEl.textContent = "-" + reduction.toFixed(1) + "%";
      sizeStats.style.display = "";
    }

    function optimize() {
      var svg = inputEl.value.trim();
      if (!svg) {
        window.DevToolBox.showFeedback("SVGコードを入力してください", "error");
        return;
      }

      var originalSize = new Blob([svg]).size;

      if (optComments.checked) svg = removeComments(svg);
      if (optMetadata.checked) svg = removeMetadata(svg);
      if (optEmptyGroups.checked) svg = removeEmptyGroups(svg);
      if (optDefaults.checked) svg = removeDefaults(svg);
      if (optMinify.checked) svg = minifySvg(svg);

      var optimizedSize = new Blob([svg]).size;

      outputEl.value = svg;
      showStats(originalSize, optimizedSize);
      showPreview(svg);
    }

    btnOptimize.addEventListener("click", optimize);

    btnBeautify.addEventListener("click", function () {
      var svg = inputEl.value.trim();
      if (!svg) {
        window.DevToolBox.showFeedback("SVGコードを入力してください", "error");
        return;
      }
      var originalSize = new Blob([svg]).size;
      var result = beautifySvg(svg);
      var newSize = new Blob([result]).size;
      outputEl.value = result;
      showStats(originalSize, newSize);
      showPreview(result);
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      outputEl.value = "";
      sizeStats.style.display = "none";
      svgPreview.style.display = "none";
      svgPreview.innerHTML = "";
    });

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      window.DevToolBox.copyToClipboard(text).then(function () {
        window.DevToolBox.showFeedback("コピーしました", "success");
      });
    });

    btnDownload.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      var blob = new Blob([text], { type: "image/svg+xml" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "optimized.svg";
      a.click();
      window.DevToolBox.showFeedback("ダウンロードを開始しました", "success");
    });
  });
})();
