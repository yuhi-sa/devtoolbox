"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("htm-input");
    var outputEl = document.getElementById("htm-output");
    var errorEl = document.getElementById("htm-error");
    var successEl = document.getElementById("htm-success");
    var gfmCheckbox = document.getElementById("htm-gfm");
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

    // Convert HTML string to Markdown
    function htmlToMarkdown(html, gfm) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      return convertNode(doc.body, gfm).replace(/\n{3,}/g, "\n\n").trim();
    }

    function getTextContent(node) {
      var result = "";
      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        if (child.nodeType === 3) {
          result += child.textContent;
        } else if (child.nodeType === 1) {
          result += getTextContent(child);
        }
      }
      return result;
    }

    function convertNode(node, gfm) {
      var result = "";

      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];

        if (child.nodeType === 3) {
          // Text node
          result += child.textContent;
          continue;
        }

        if (child.nodeType !== 1) continue;

        var tag = child.tagName.toLowerCase();

        switch (tag) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            var level = parseInt(tag.charAt(1), 10);
            var hashes = "";
            for (var h = 0; h < level; h++) hashes += "#";
            result += "\n\n" + hashes + " " + convertNode(child, gfm).trim() + "\n\n";
            break;

          case "p":
            result += "\n\n" + convertNode(child, gfm).trim() + "\n\n";
            break;

          case "br":
            result += "  \n";
            break;

          case "strong":
          case "b":
            result += "**" + convertNode(child, gfm).trim() + "**";
            break;

          case "em":
          case "i":
            result += "*" + convertNode(child, gfm).trim() + "*";
            break;

          case "del":
          case "s":
            if (gfm) {
              result += "~~" + convertNode(child, gfm).trim() + "~~";
            } else {
              result += convertNode(child, gfm);
            }
            break;

          case "a":
            var href = child.getAttribute("href") || "";
            var linkText = convertNode(child, gfm).trim();
            result += "[" + linkText + "](" + href + ")";
            break;

          case "img":
            var src = child.getAttribute("src") || "";
            var alt = child.getAttribute("alt") || "";
            result += "![" + alt + "](" + src + ")";
            break;

          case "code":
            // Check if inside <pre>
            if (child.parentElement && child.parentElement.tagName.toLowerCase() === "pre") {
              result += getTextContent(child);
            } else {
              result += "`" + getTextContent(child) + "`";
            }
            break;

          case "pre":
            var codeChild = child.querySelector("code");
            var codeText = codeChild ? getTextContent(codeChild) : getTextContent(child);
            var lang = "";
            if (codeChild) {
              var cls = codeChild.className || "";
              var langMatch = cls.match(/language-(\S+)/);
              if (langMatch) lang = langMatch[1];
            }
            result += "\n\n```" + lang + "\n" + codeText.replace(/\n$/, "") + "\n```\n\n";
            break;

          case "blockquote":
            var bqContent = convertNode(child, gfm).trim();
            var bqLines = bqContent.split("\n");
            result += "\n\n" + bqLines.map(function (line) { return "> " + line; }).join("\n") + "\n\n";
            break;

          case "ul":
            result += "\n\n" + convertList(child, gfm, false, 0) + "\n\n";
            break;

          case "ol":
            result += "\n\n" + convertList(child, gfm, true, 0) + "\n\n";
            break;

          case "li":
            // Handled by convertList
            result += convertNode(child, gfm);
            break;

          case "table":
            if (gfm) {
              result += "\n\n" + convertTable(child, gfm) + "\n\n";
            } else {
              result += convertNode(child, gfm);
            }
            break;

          case "thead":
          case "tbody":
          case "tfoot":
          case "tr":
          case "th":
          case "td":
            // Handled by convertTable
            result += convertNode(child, gfm);
            break;

          case "hr":
            result += "\n\n---\n\n";
            break;

          case "div":
          case "section":
          case "article":
          case "main":
          case "header":
          case "footer":
          case "nav":
          case "aside":
            result += "\n\n" + convertNode(child, gfm).trim() + "\n\n";
            break;

          default:
            result += convertNode(child, gfm);
            break;
        }
      }

      return result;
    }

    function convertList(listNode, gfm, ordered, depth) {
      var items = [];
      var indent = "";
      for (var d = 0; d < depth; d++) indent += "  ";
      var counter = 1;

      for (var i = 0; i < listNode.children.length; i++) {
        var li = listNode.children[i];
        if (li.tagName.toLowerCase() !== "li") continue;

        var prefix = ordered ? (counter + ". ") : "- ";
        var content = "";

        for (var j = 0; j < li.childNodes.length; j++) {
          var child = li.childNodes[j];
          if (child.nodeType === 1) {
            var childTag = child.tagName.toLowerCase();
            if (childTag === "ul") {
              content += "\n" + convertList(child, gfm, false, depth + 1);
            } else if (childTag === "ol") {
              content += "\n" + convertList(child, gfm, true, depth + 1);
            } else {
              content += convertNode(child, gfm);
            }
          } else if (child.nodeType === 3) {
            content += child.textContent;
          }
        }

        items.push(indent + prefix + content.trim());
        counter++;
      }

      return items.join("\n");
    }

    function convertTable(tableNode, gfm) {
      var rows = [];
      var trElements = tableNode.querySelectorAll("tr");

      trElements.forEach(function (tr) {
        var cells = [];
        var cellElements = tr.querySelectorAll("th, td");
        cellElements.forEach(function (cell) {
          cells.push(convertNode(cell, gfm).trim().replace(/\|/g, "\\|"));
        });
        rows.push(cells);
      });

      if (rows.length === 0) return "";

      var lines = [];
      // First row (header)
      lines.push("| " + rows[0].join(" | ") + " |");
      // Separator
      var sep = rows[0].map(function () { return "---"; });
      lines.push("| " + sep.join(" | ") + " |");
      // Data rows
      for (var i = 1; i < rows.length; i++) {
        // Pad rows to match header length
        while (rows[i].length < rows[0].length) {
          rows[i].push("");
        }
        lines.push("| " + rows[i].join(" | ") + " |");
      }

      return lines.join("\n");
    }

    // Real-time conversion
    function convert() {
      clearMessages();
      var input = inputEl.value;
      if (!input.trim()) {
        outputEl.value = "";
        return;
      }

      try {
        var gfm = gfmCheckbox.checked;
        outputEl.value = htmlToMarkdown(input, gfm);
      } catch (e) {
        showError("変換エラー: " + e.message);
        outputEl.value = "";
      }
    }

    inputEl.addEventListener("input", convert);
    gfmCheckbox.addEventListener("change", convert);

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      outputEl.value = "";
      clearMessages();
    });

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      window.DevToolBox.copyToClipboard(text).then(function () {
        showSuccess("コピーしました。");
      });
    });
  });
})();
