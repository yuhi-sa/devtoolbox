"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("md-input");
    var previewEl = document.getElementById("md-preview");
    var btnCopyHtml = document.getElementById("btn-copy-html");
    var btnClear = document.getElementById("btn-clear");
    var successEl = document.getElementById("md-success");

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () {
        successEl.hidden = true;
      }, 2000);
    }

    function escapeHtml(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function parseInline(text) {
      // Images: ![alt](url)
      text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
      // Links: [text](url)
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
      // Bold: **text** or __text__
      text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
      // Italic: *text* or _text_
      text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
      text = text.replace(/_(.+?)_/g, "<em>$1</em>");
      // Inline code: `code`
      text = text.replace(/`([^`]+)`/g, function (m, code) {
        return "<code>" + escapeHtml(code) + "</code>";
      });
      return text;
    }

    function parseMarkdown(src) {
      var lines = src.split("\n");
      var html = [];
      var i = 0;
      var inList = false;
      var listType = "";
      var inBlockquote = false;

      function closeList() {
        if (inList) {
          html.push(listType === "ul" ? "</ul>" : "</ol>");
          inList = false;
          listType = "";
        }
      }

      function closeBlockquote() {
        if (inBlockquote) {
          html.push("</blockquote>");
          inBlockquote = false;
        }
      }

      while (i < lines.length) {
        var line = lines[i];

        // Code blocks: ```
        if (/^```/.test(line)) {
          closeList();
          closeBlockquote();
          var codeLines = [];
          i++;
          while (i < lines.length && !/^```/.test(lines[i])) {
            codeLines.push(escapeHtml(lines[i]));
            i++;
          }
          html.push("<pre><code>" + codeLines.join("\n") + "</code></pre>");
          i++;
          continue;
        }

        // Table
        if (/^\|(.+)\|$/.test(line) && i + 1 < lines.length && /^\|[\s\-:|]+\|$/.test(lines[i + 1])) {
          closeList();
          closeBlockquote();
          html.push("<table>");
          // Header row
          var headerCells = line.split("|").filter(function (c, idx, arr) {
            return idx > 0 && idx < arr.length - 1;
          });
          html.push("<thead><tr>");
          headerCells.forEach(function (cell) {
            html.push("<th>" + parseInline(cell.trim()) + "</th>");
          });
          html.push("</tr></thead>");
          i += 2; // skip header and separator
          html.push("<tbody>");
          while (i < lines.length && /^\|(.+)\|$/.test(lines[i])) {
            var rowCells = lines[i].split("|").filter(function (c, idx, arr) {
              return idx > 0 && idx < arr.length - 1;
            });
            html.push("<tr>");
            rowCells.forEach(function (cell) {
              html.push("<td>" + parseInline(cell.trim()) + "</td>");
            });
            html.push("</tr>");
            i++;
          }
          html.push("</tbody></table>");
          continue;
        }

        // Horizontal rules: --- or ***
        if (/^(\-{3,}|\*{3,})$/.test(line.trim())) {
          closeList();
          closeBlockquote();
          html.push("<hr>");
          i++;
          continue;
        }

        // Headings: # to ######
        var headingMatch = line.match(/^(#{1,6})\s+(.+)/);
        if (headingMatch) {
          closeList();
          closeBlockquote();
          var level = headingMatch[1].length;
          html.push("<h" + level + ">" + parseInline(escapeHtml(headingMatch[2])) + "</h" + level + ">");
          i++;
          continue;
        }

        // Blockquotes: > text
        if (/^>\s?(.*)/.test(line)) {
          closeList();
          if (!inBlockquote) {
            html.push("<blockquote>");
            inBlockquote = true;
          }
          var quoteContent = line.replace(/^>\s?/, "");
          html.push("<p>" + parseInline(escapeHtml(quoteContent)) + "</p>");
          i++;
          continue;
        } else {
          closeBlockquote();
        }

        // Unordered list: - or *
        var ulMatch = line.match(/^[\-\*]\s+(.+)/);
        if (ulMatch) {
          closeBlockquote();
          if (!inList || listType !== "ul") {
            closeList();
            html.push("<ul>");
            inList = true;
            listType = "ul";
          }
          html.push("<li>" + parseInline(escapeHtml(ulMatch[1])) + "</li>");
          i++;
          continue;
        }

        // Ordered list: 1.
        var olMatch = line.match(/^\d+\.\s+(.+)/);
        if (olMatch) {
          closeBlockquote();
          if (!inList || listType !== "ol") {
            closeList();
            html.push("<ol>");
            inList = true;
            listType = "ol";
          }
          html.push("<li>" + parseInline(escapeHtml(olMatch[1])) + "</li>");
          i++;
          continue;
        }

        // Close list if line is not a list item
        closeList();

        // Empty line
        if (line.trim() === "") {
          i++;
          continue;
        }

        // Paragraph
        html.push("<p>" + parseInline(escapeHtml(line)) + "</p>");
        i++;
      }

      closeList();
      closeBlockquote();

      return html.join("\n");
    }

    function updatePreview() {
      var md = inputEl.value;
      previewEl.innerHTML = parseMarkdown(md);
    }

    inputEl.addEventListener("input", updatePreview);

    btnCopyHtml.addEventListener("click", function () {
      var md = inputEl.value;
      if (!md) return;
      var html = parseMarkdown(md);
      navigator.clipboard.writeText(html).then(function () {
        showSuccess("HTMLをコピーしました。");
      });
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      previewEl.innerHTML = "";
    });

    // Initial render
    updatePreview();
  });
})();
