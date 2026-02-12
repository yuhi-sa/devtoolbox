"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("xml-input");
    var outputEl = document.getElementById("xml-output");
    var indentSelect = document.getElementById("xml-indent-select");
    var errorEl = document.getElementById("xml-error");
    var successEl = document.getElementById("xml-success");
    var btnFormat = document.getElementById("btn-format");
    var btnMinify = document.getElementById("btn-minify");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");

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

    function getIndent() {
      var val = indentSelect.value;
      if (val === "tab") return "\t";
      return new Array(parseInt(val, 10) + 1).join(" ");
    }

    function parseAndValidateXml(str) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(str, "application/xml");
      var errorNode = doc.querySelector("parsererror");
      if (errorNode) {
        var errorText = errorNode.textContent || errorNode.innerText;
        // Try to extract meaningful error message
        var lineMatch = errorText.match(/line\s+(\d+)/i);
        var colMatch = errorText.match(/column\s+(\d+)/i);
        var msg = "XML構文エラー";
        if (lineMatch && colMatch) {
          msg += "（" + lineMatch[1] + "行目、" + colMatch[1] + "列目付近）";
        }
        // Extract the core error description
        var descMatch = errorText.match(/:\s*(.+?)(?:\n|$)/);
        if (descMatch) {
          msg += ": " + descMatch[1].trim();
        }
        return { doc: null, error: msg };
      }
      return { doc: doc, error: null };
    }

    function formatXml(xmlStr, indent) {
      // Use DOMParser for validation, then format manually for better control
      var result = parseAndValidateXml(xmlStr);
      if (result.error) {
        throw new Error(result.error);
      }

      // Manual formatting for precise output
      var formatted = "";
      var level = 0;
      var inTag = false;
      var inComment = false;
      var inCdata = false;
      var inProlog = false;

      // Remove existing whitespace between tags
      var cleaned = xmlStr.replace(/>\s+</g, "><").trim();

      var i = 0;
      while (i < cleaned.length) {
        // Check for CDATA
        if (cleaned.substring(i, i + 9) === "<![CDATA[") {
          var cdataEnd = cleaned.indexOf("]]>", i);
          if (cdataEnd === -1) cdataEnd = cleaned.length - 3;
          formatted += repeatStr(indent, level) + cleaned.substring(i, cdataEnd + 3) + "\n";
          i = cdataEnd + 3;
          continue;
        }

        // Check for comment
        if (cleaned.substring(i, i + 4) === "<!--") {
          var commentEnd = cleaned.indexOf("-->", i);
          if (commentEnd === -1) commentEnd = cleaned.length - 3;
          formatted += repeatStr(indent, level) + cleaned.substring(i, commentEnd + 3) + "\n";
          i = commentEnd + 3;
          continue;
        }

        // Check for processing instruction
        if (cleaned.substring(i, i + 2) === "<?") {
          var piEnd = cleaned.indexOf("?>", i);
          if (piEnd === -1) piEnd = cleaned.length - 2;
          formatted += repeatStr(indent, level) + cleaned.substring(i, piEnd + 2) + "\n";
          i = piEnd + 2;
          continue;
        }

        // Check for closing tag
        if (cleaned.substring(i, i + 2) === "</") {
          var closeEnd = cleaned.indexOf(">", i);
          if (closeEnd === -1) closeEnd = cleaned.length - 1;
          level--;
          if (level < 0) level = 0;
          formatted += repeatStr(indent, level) + cleaned.substring(i, closeEnd + 1) + "\n";
          i = closeEnd + 1;
          continue;
        }

        // Check for opening tag
        if (cleaned[i] === "<") {
          var tagEnd = cleaned.indexOf(">", i);
          if (tagEnd === -1) tagEnd = cleaned.length - 1;
          var tag = cleaned.substring(i, tagEnd + 1);

          // Check if self-closing
          var isSelfClosing = tag[tag.length - 2] === "/";

          // Check if this tag has text content immediately after (no child tags)
          var afterTag = cleaned.substring(tagEnd + 1);
          if (!isSelfClosing && afterTag.length > 0 && afterTag[0] !== "<") {
            // Tag with inline text content
            var nextTagStart = afterTag.indexOf("<");
            if (nextTagStart !== -1) {
              var textContent = afterTag.substring(0, nextTagStart);
              var closingTag = afterTag.substring(nextTagStart);
              // Check if the next tag is the closing tag for this element
              var tagName = tag.match(/^<(\S+)/);
              if (tagName && closingTag.indexOf("</" + tagName[1] + ">") === 0) {
                var closeTagStr = "</" + tagName[1] + ">";
                formatted += repeatStr(indent, level) + tag + textContent + closeTagStr + "\n";
                i = tagEnd + 1 + nextTagStart + closeTagStr.length;
                continue;
              }
            }
          }

          formatted += repeatStr(indent, level) + tag + "\n";
          if (!isSelfClosing) {
            level++;
          }
          i = tagEnd + 1;
          continue;
        }

        // Text content
        var nextTag = cleaned.indexOf("<", i);
        if (nextTag === -1) nextTag = cleaned.length;
        var text = cleaned.substring(i, nextTag).trim();
        if (text) {
          formatted += repeatStr(indent, level) + text + "\n";
        }
        i = nextTag;
      }

      return formatted.trim();
    }

    function minifyXml(xmlStr) {
      var result = parseAndValidateXml(xmlStr);
      if (result.error) {
        throw new Error(result.error);
      }
      // Remove whitespace between tags, preserve whitespace in content
      return xmlStr.replace(/>\s+</g, "><").trim();
    }

    function repeatStr(str, count) {
      var result = "";
      for (var i = 0; i < count; i++) result += str;
      return result;
    }

    btnFormat.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("XMLを入力してください。");
        return;
      }
      try {
        var indent = getIndent();
        outputEl.value = formatXml(input, indent);
        showSuccess("整形が完了しました。");
      } catch (e) {
        showError(e.message);
        outputEl.value = "";
      }
    });

    btnMinify.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("XMLを入力してください。");
        return;
      }
      try {
        outputEl.value = minifyXml(input);
        showSuccess("圧縮が完了しました。");
      } catch (e) {
        showError(e.message);
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
