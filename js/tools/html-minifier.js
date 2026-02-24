"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("html-input");
    var outputEl = document.getElementById("html-output");
    var errorEl = document.getElementById("html-error");
    var successEl = document.getElementById("html-success");
    var statsEl = document.getElementById("html-stats");
    var btnMinify = document.getElementById("btn-minify");
    var btnBeautify = document.getElementById("btn-beautify");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      successEl.hidden = true;
      statsEl.hidden = true;
    }

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      errorEl.hidden = true;
    }

    function showStats(original, result) {
      var originalSize = new Blob([original]).size;
      var resultSize = new Blob([result]).size;
      var reduction = originalSize > 0 ? ((1 - resultSize / originalSize) * 100).toFixed(1) : 0;
      statsEl.textContent = "元サイズ: " + originalSize + " bytes → 圧縮後: " + resultSize + " bytes（" + reduction + "% 削減）";
      statsEl.hidden = false;
    }

    function clearMessages() {
      errorEl.hidden = true;
      successEl.hidden = true;
      statsEl.hidden = true;
    }

    function minifyHTML(html) {
      // Remove HTML comments (but keep conditional comments)
      var result = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, "");

      // Preserve content inside <pre>, <code>, <script>, <style>, <textarea>
      var preserved = [];
      var preserveIndex = 0;
      result = result.replace(/<(pre|code|script|style|textarea)(\s[^>]*)?>[\s\S]*?<\/\1>/gi, function (match) {
        var placeholder = "___PRESERVE_" + preserveIndex + "___";
        preserved.push(match);
        preserveIndex++;
        return placeholder;
      });

      // Collapse whitespace between tags
      result = result.replace(/>\s+</g, "><");
      // Collapse multiple whitespace to single space
      result = result.replace(/\s{2,}/g, " ");
      // Remove leading/trailing whitespace
      result = result.trim();

      // Restore preserved content
      for (var i = 0; i < preserved.length; i++) {
        result = result.replace("___PRESERVE_" + i + "___", preserved[i]);
      }

      return result;
    }

    function beautifyHTML(html) {
      // Normalize whitespace first
      var normalized = html.replace(/>\s+</g, ">\n<").trim();

      var lines = normalized.split("\n");
      var indent = 0;
      var result = [];
      var voidElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
      var preserveWhitespace = false;

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;

        // Track pre/code blocks where whitespace matters
        if (/<(pre|code)[\s>]/i.test(line)) preserveWhitespace = true;
        if (/<\/(pre|code)>/i.test(line)) {
          result.push(line);
          preserveWhitespace = false;
          continue;
        }
        if (preserveWhitespace) {
          result.push(line);
          continue;
        }

        // Check if line is a closing tag
        var isClosing = /^<\//.test(line);
        // Check if line is a self-closing or void element
        var isSelfClosing = /\/>$/.test(line);
        var tagMatch = line.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/);
        var tagName = tagMatch ? tagMatch[1].toLowerCase() : "";
        var isVoid = voidElements.indexOf(tagName) !== -1;
        // Check if line contains both opening and closing tags
        var hasOpenAndClose = /^<[^/][^>]*>.*<\//.test(line);

        if (isClosing) {
          indent = Math.max(0, indent - 1);
          result.push("  ".repeat(indent) + line);
        } else if (isSelfClosing || isVoid || hasOpenAndClose) {
          result.push("  ".repeat(indent) + line);
        } else if (/^<!/.test(line)) {
          // DOCTYPE, comments
          result.push("  ".repeat(indent) + line);
        } else if (/^<[a-zA-Z]/.test(line)) {
          result.push("  ".repeat(indent) + line);
          indent++;
        } else {
          result.push("  ".repeat(indent) + line);
        }
      }

      return result.join("\n");
    }

    btnMinify.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value;
      if (!input.trim()) {
        showError("HTMLを入力してください。");
        return;
      }
      var result = minifyHTML(input);
      outputEl.value = result;
      showSuccess("圧縮が完了しました。");
      showStats(input, result);
    });

    btnBeautify.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value;
      if (!input.trim()) {
        showError("HTMLを入力してください。");
        return;
      }
      var result = beautifyHTML(input);
      outputEl.value = result;
      showSuccess("整形が完了しました。");
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
