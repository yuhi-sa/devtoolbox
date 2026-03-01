"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("mth-input");
    var outputEl = document.getElementById("mth-output");
    var previewEl = document.getElementById("mth-preview");
    var errorEl = document.getElementById("mth-error");
    var successEl = document.getElementById("mth-success");
    var btnConvert = document.getElementById("btn-convert");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var tabSource = document.getElementById("tab-source");
    var tabPreview = document.getElementById("tab-preview");
    var panelSource = document.getElementById("panel-source");
    var panelPreview = document.getElementById("panel-preview");

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

    // Tab switching
    tabSource.addEventListener("click", function () {
      tabSource.className = "btn btn--primary";
      tabPreview.className = "btn btn--secondary";
      panelSource.hidden = false;
      panelPreview.hidden = true;
    });

    tabPreview.addEventListener("click", function () {
      tabPreview.className = "btn btn--primary";
      tabSource.className = "btn btn--secondary";
      panelPreview.hidden = false;
      panelSource.hidden = true;
    });

    // Escape HTML for safe display
    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    // Escape HTML attribute values
    function escapeAttr(str) {
      return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Sanitize URL: block javascript: and data: protocols
    function sanitizeUrl(url) {
      var trimmed = url.trim().toLowerCase();
      if (trimmed.indexOf("javascript:") === 0 || trimmed.indexOf("vbscript:") === 0 || trimmed.indexOf("data:text/html") === 0) {
        return "";
      }
      return url;
    }

    // Sanitize HTML for preview: strip script tags, event handlers, dangerous elements
    function sanitizeHtml(html) {
      // Remove script tags and their content
      html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
      // Remove event handler attributes (on*)
      html = html.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, "");
      // Remove javascript: in href/src attributes
      html = html.replace(/(href|src)\s*=\s*["']?\s*javascript:/gi, '$1="');
      // Remove iframe, object, embed, form
      html = html.replace(/<(iframe|object|embed|form|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
      html = html.replace(/<(iframe|object|embed|form|style)\b[^>]*\/?>/gi, "");
      return html;
    }

    // Markdown to HTML converter
    function markdownToHtml(md) {
      var lines = md.split("\n");
      var html = "";
      var i = 0;
      var inList = false;
      var listType = "";
      var inBlockquote = false;
      var blockquoteLines = [];

      function flushBlockquote() {
        if (inBlockquote && blockquoteLines.length > 0) {
          html += "<blockquote>\n" + markdownToHtml(blockquoteLines.join("\n")) + "\n</blockquote>\n";
          blockquoteLines = [];
          inBlockquote = false;
        }
      }

      function flushList() {
        if (inList) {
          html += "</" + listType + ">\n";
          inList = false;
          listType = "";
        }
      }

      while (i < lines.length) {
        var line = lines[i];

        // Fenced code blocks
        var codeMatch = line.match(/^```(\w*)/);
        if (codeMatch) {
          flushBlockquote();
          flushList();
          var lang = codeMatch[1];
          var codeLines = [];
          i++;
          while (i < lines.length && !lines[i].match(/^```\s*$/)) {
            codeLines.push(lines[i]);
            i++;
          }
          i++; // skip closing ```
          var codeContent = escapeHtml(codeLines.join("\n"));
          if (lang) {
            html += '<pre><code class="language-' + lang + '">' + codeContent + "</code></pre>\n";
          } else {
            html += "<pre><code>" + codeContent + "</code></pre>\n";
          }
          continue;
        }

        // Blockquote
        var bqMatch = line.match(/^>\s?(.*)/);
        if (bqMatch) {
          flushList();
          inBlockquote = true;
          blockquoteLines.push(bqMatch[1]);
          i++;
          continue;
        } else if (inBlockquote) {
          flushBlockquote();
        }

        // Horizontal rule
        if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
          flushList();
          html += "<hr>\n";
          i++;
          continue;
        }

        // Headings
        var headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
          flushList();
          var level = headingMatch[1].length;
          var text = processInline(headingMatch[2]);
          html += "<h" + level + ">" + text + "</h" + level + ">\n";
          i++;
          continue;
        }

        // Table
        if (line.indexOf("|") !== -1 && i + 1 < lines.length && /^\|?\s*[-:]+[-| :]*$/.test(lines[i + 1])) {
          flushList();
          var tableLines = [];
          while (i < lines.length && lines[i].indexOf("|") !== -1) {
            tableLines.push(lines[i]);
            i++;
          }
          html += parseTable(tableLines);
          continue;
        }

        // Unordered list
        var ulMatch = line.match(/^(\s*)[-*+]\s+(.*)/);
        if (ulMatch) {
          flushBlockquote();
          if (!inList || listType !== "ul") {
            flushList();
            html += "<ul>\n";
            inList = true;
            listType = "ul";
          }
          html += "<li>" + processInline(ulMatch[2]) + "</li>\n";
          i++;
          continue;
        }

        // Ordered list
        var olMatch = line.match(/^(\s*)\d+\.\s+(.*)/);
        if (olMatch) {
          flushBlockquote();
          if (!inList || listType !== "ol") {
            flushList();
            html += "<ol>\n";
            inList = true;
            listType = "ol";
          }
          html += "<li>" + processInline(olMatch[2]) + "</li>\n";
          i++;
          continue;
        }

        // Close list if not a list item
        flushList();

        // Empty line
        if (line.trim() === "") {
          i++;
          continue;
        }

        // Paragraph
        var paraLines = [];
        while (i < lines.length && lines[i].trim() !== "" &&
               !lines[i].match(/^#{1,6}\s/) &&
               !lines[i].match(/^[-*+]\s/) &&
               !lines[i].match(/^\d+\.\s/) &&
               !lines[i].match(/^>\s?/) &&
               !lines[i].match(/^```/) &&
               !lines[i].match(/^(-{3,}|\*{3,}|_{3,})\s*$/) &&
               !(lines[i].indexOf("|") !== -1 && i + 1 < lines.length && /^\|?\s*[-:]+[-| :]*$/.test(lines[i + 1]))) {
          paraLines.push(lines[i]);
          i++;
        }
        if (paraLines.length > 0) {
          html += "<p>" + processInline(paraLines.join("\n")) + "</p>\n";
        }
      }

      flushBlockquote();
      flushList();

      return html;
    }

    // Process inline elements
    function processInline(text) {
      // Escape raw HTML first to prevent XSS, but preserve already-processed markdown elements
      text = escapeHtml(text);

      // Inline code (must be first to avoid processing inside code)
      text = text.replace(/`([^`]+)`/g, function (m, code) {
        return "<code>" + code + "</code>";
      });

      // Images (before links) - sanitize src and alt attributes
      text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (m, alt, src) {
        return '<img src="' + escapeAttr(sanitizeUrl(src)) + '" alt="' + escapeAttr(alt) + '">';
      });

      // Links - sanitize href
      text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, linkText, href) {
        return '<a href="' + escapeAttr(sanitizeUrl(href)) + '">' + linkText + '</a>';
      });

      // Bold + italic
      text = text.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
      text = text.replace(/___([^_]+)___/g, "<strong><em>$1</em></strong>");

      // Bold
      text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");

      // Italic
      text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
      text = text.replace(/_([^_]+)_/g, "<em>$1</em>");

      // Strikethrough
      text = text.replace(/~~([^~]+)~~/g, "<del>$1</del>");

      // Line breaks
      text = text.replace(/  \n/g, "<br>\n");

      return text;
    }

    // Parse table
    function parseTable(lines) {
      if (lines.length < 2) return "";

      function parseCells(line) {
        var trimmed = line.trim();
        if (trimmed.charAt(0) === "|") trimmed = trimmed.substring(1);
        if (trimmed.charAt(trimmed.length - 1) === "|") trimmed = trimmed.substring(0, trimmed.length - 1);
        return trimmed.split("|").map(function (cell) { return cell.trim(); });
      }

      var headerCells = parseCells(lines[0]);
      var html = "<table>\n<thead>\n<tr>\n";
      for (var h = 0; h < headerCells.length; h++) {
        html += "<th>" + processInline(headerCells[h]) + "</th>\n";
      }
      html += "</tr>\n</thead>\n<tbody>\n";

      for (var r = 2; r < lines.length; r++) {
        if (/^\|?\s*[-:]+[-| :]*$/.test(lines[r])) continue;
        var cells = parseCells(lines[r]);
        html += "<tr>\n";
        for (var c = 0; c < cells.length; c++) {
          html += "<td>" + processInline(cells[c]) + "</td>\n";
        }
        html += "</tr>\n";
      }

      html += "</tbody>\n</table>\n";
      return html;
    }

    function convert() {
      clearMessages();
      var input = inputEl.value;
      if (!input.trim()) {
        outputEl.value = "";
        previewEl.innerHTML = "";
        return;
      }

      try {
        var result = markdownToHtml(input);
        outputEl.value = result;
        previewEl.innerHTML = sanitizeHtml(result);
        showSuccess("変換が完了しました。");
      } catch (e) {
        showError("変換エラー: " + e.message);
        outputEl.value = "";
        previewEl.innerHTML = "";
      }
    }

    // Real-time conversion
    inputEl.addEventListener("input", convert);

    btnConvert.addEventListener("click", convert);

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      outputEl.value = "";
      previewEl.innerHTML = "";
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
