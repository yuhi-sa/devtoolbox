"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var envRows = document.getElementById("env-rows");
    var importEl = document.getElementById("env-import");
    var outputEl = document.getElementById("env-output");
    var successEl = document.getElementById("env-success");
    var btnImport = document.getElementById("btn-import");
    var btnAddRow = document.getElementById("btn-add-row");
    var btnGenerate = document.getElementById("btn-generate");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");

    var rowCounter = 0;

    var envTemplates = {
      nodejs: [
        { key: "NODE_ENV", value: "development", type: "string" },
        { key: "PORT", value: "3000", type: "number" },
        { key: "DATABASE_URL", value: "postgresql://user:password@localhost:5432/mydb", type: "string" },
        { key: "SESSION_SECRET", value: "", type: "secret" },
        { key: "JWT_SECRET", value: "", type: "secret" },
        { key: "LOG_LEVEL", value: "info", type: "string" }
      ],
      django: [
        { key: "DEBUG", value: "True", type: "boolean" },
        { key: "SECRET_KEY", value: "", type: "secret" },
        { key: "DATABASE_URL", value: "postgresql://user:password@localhost:5432/mydb", type: "string" },
        { key: "ALLOWED_HOSTS", value: "localhost,127.0.0.1", type: "string" },
        { key: "STATIC_URL", value: "/static/", type: "string" },
        { key: "MEDIA_URL", value: "/media/", type: "string" }
      ],
      rails: [
        { key: "RAILS_ENV", value: "development", type: "string" },
        { key: "SECRET_KEY_BASE", value: "", type: "secret" },
        { key: "DATABASE_URL", value: "postgresql://user:password@localhost:5432/mydb", type: "string" },
        { key: "RAILS_MASTER_KEY", value: "", type: "secret" },
        { key: "RAILS_LOG_LEVEL", value: "debug", type: "string" },
        { key: "REDIS_URL", value: "redis://localhost:6379/0", type: "string" }
      ],
      laravel: [
        { key: "APP_NAME", value: "Laravel", type: "string" },
        { key: "APP_ENV", value: "local", type: "string" },
        { key: "APP_KEY", value: "", type: "secret" },
        { key: "APP_DEBUG", value: "true", type: "boolean" },
        { key: "APP_URL", value: "http://localhost", type: "string" },
        { key: "DB_CONNECTION", value: "mysql", type: "string" },
        { key: "DB_HOST", value: "127.0.0.1", type: "string" },
        { key: "DB_PORT", value: "3306", type: "number" },
        { key: "DB_DATABASE", value: "laravel", type: "string" },
        { key: "DB_USERNAME", value: "root", type: "string" },
        { key: "DB_PASSWORD", value: "", type: "secret" }
      ],
      nextjs: [
        { key: "NEXT_PUBLIC_API_URL", value: "http://localhost:3000/api", type: "string" },
        { key: "NEXTAUTH_URL", value: "http://localhost:3000", type: "string" },
        { key: "NEXTAUTH_SECRET", value: "", type: "secret" },
        { key: "DATABASE_URL", value: "postgresql://user:password@localhost:5432/mydb", type: "string" },
        { key: "NEXT_PUBLIC_APP_NAME", value: "My App", type: "string" }
      ]
    };

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function generateSecret() {
      var bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      var hex = "";
      for (var i = 0; i < 16; i++) {
        hex += (bytes[i] < 16 ? "0" : "") + bytes[i].toString(16);
      }
      return hex;
    }

    function escapeAttr(s) {
      return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function addRow(key, value, type, comment) {
      rowCounter++;
      var id = rowCounter;
      var row = document.createElement("div");
      row.className = "tool-input";
      row.style.border = "1px solid var(--color-border, #ddd)";
      row.style.borderRadius = "8px";
      row.style.padding = ".75rem";
      row.style.marginBottom = ".5rem";
      row.dataset.rowId = id;

      var isComment = comment || false;
      var typeVal = type || "string";

      if (isComment) {
        row.innerHTML =
          '<div style="display:flex;gap:.5rem;align-items:center;">' +
            '<span style="color:var(--color-text-muted);font-weight:bold;">#</span>' +
            '<input type="text" class="input" data-field="comment" value="' + escapeAttr(key) + '" placeholder="コメント" style="flex:1;">' +
            '<button type="button" class="btn btn--secondary" data-remove="' + id + '" style="padding:.25rem .5rem;font-size:.85rem;">削除</button>' +
          '</div>';
      } else {
        row.innerHTML =
          '<div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;">' +
            '<input type="text" class="input" data-field="key" value="' + escapeAttr(key || "") + '" placeholder="KEY" style="flex:2;min-width:120px;">' +
            '<input type="text" class="input" data-field="value" value="' + escapeAttr(value || "") + '" placeholder="value" style="flex:3;min-width:160px;">' +
            '<select class="input" data-field="type" style="width:auto;min-width:100px;">' +
              '<option value="string"' + (typeVal === "string" ? " selected" : "") + '>文字列</option>' +
              '<option value="number"' + (typeVal === "number" ? " selected" : "") + '>数値</option>' +
              '<option value="boolean"' + (typeVal === "boolean" ? " selected" : "") + '>真偽値</option>' +
              '<option value="secret"' + (typeVal === "secret" ? " selected" : "") + '>シークレット</option>' +
            '</select>' +
            '<button type="button" class="btn btn--secondary" data-secret="' + id + '" style="padding:.25rem .5rem;font-size:.85rem;">生成</button>' +
            '<button type="button" class="btn btn--secondary" data-remove="' + id + '" style="padding:.25rem .5rem;font-size:.85rem;">削除</button>' +
          '</div>';
      }

      envRows.appendChild(row);

      row.querySelector('[data-remove="' + id + '"]').addEventListener("click", function () {
        row.remove();
      });

      var secretBtn = row.querySelector('[data-secret="' + id + '"]');
      if (secretBtn) {
        secretBtn.addEventListener("click", function () {
          var valInput = row.querySelector('[data-field="value"]');
          valInput.value = generateSecret();
        });
      }

      // Auto-generate secret values for secret type
      if (typeVal === "secret" && !value) {
        var valInput = row.querySelector('[data-field="value"]');
        if (valInput) valInput.value = generateSecret();
      }
    }

    function clearRows() {
      envRows.innerHTML = "";
      rowCounter = 0;
    }

    function getRows() {
      var rows = [];
      var cards = envRows.querySelectorAll("[data-row-id]");
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var commentField = card.querySelector('[data-field="comment"]');
        if (commentField) {
          rows.push({ comment: commentField.value });
        } else {
          var key = card.querySelector('[data-field="key"]').value.trim();
          var value = card.querySelector('[data-field="value"]').value;
          if (key) rows.push({ key: key, value: value });
        }
      }
      return rows;
    }

    function generateEnv() {
      var rows = getRows();
      var lines = [];
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].comment !== undefined) {
          lines.push("# " + rows[i].comment);
        } else {
          var val = rows[i].value;
          if (val.indexOf(" ") !== -1 || val.indexOf('"') !== -1 || val.indexOf("'") !== -1 || val === "") {
            val = '"' + val.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
          }
          lines.push(rows[i].key + "=" + val);
        }
      }
      return lines.join("\n");
    }

    function parseEnvText(text) {
      clearRows();
      var lines = text.split("\n");
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;
        if (line.charAt(0) === "#") {
          addRow(line.substring(1).trim(), "", "string", true);
          continue;
        }
        var idx = line.indexOf("=");
        if (idx > 0) {
          var key = line.substring(0, idx).trim();
          var value = line.substring(idx + 1).trim();
          // Remove surrounding quotes
          if ((value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') ||
              (value.charAt(0) === "'" && value.charAt(value.length - 1) === "'")) {
            value = value.substring(1, value.length - 1);
          }
          var type = "string";
          if (value === "true" || value === "false") type = "boolean";
          else if (/^\d+$/.test(value)) type = "number";
          else if (key.toLowerCase().indexOf("secret") !== -1 || key.toLowerCase().indexOf("password") !== -1 || key.toLowerCase().indexOf("key") !== -1) type = "secret";
          addRow(key, value, type, false);
        }
      }
    }

    // Template buttons
    var tplButtons = document.querySelectorAll("[data-env-template]");
    for (var i = 0; i < tplButtons.length; i++) {
      tplButtons[i].addEventListener("click", function () {
        var key = this.getAttribute("data-env-template");
        if (envTemplates[key]) {
          clearRows();
          var tpl = envTemplates[key];
          for (var j = 0; j < tpl.length; j++) {
            addRow(tpl[j].key, tpl[j].value, tpl[j].type, false);
          }
          showSuccess(key + "テンプレートを読み込みました。");
        }
      });
    }

    btnImport.addEventListener("click", function () {
      var text = importEl.value.trim();
      if (!text) return;
      parseEnvText(text);
      showSuccess("インポートしました。");
    });

    btnAddRow.addEventListener("click", function () {
      addRow("", "", "string", false);
    });

    btnGenerate.addEventListener("click", function () {
      var env = generateEnv();
      if (!env) {
        outputEl.value = "";
        return;
      }
      outputEl.value = env;
      showSuccess(".envを生成しました。");
    });

    btnClear.addEventListener("click", function () {
      clearRows();
      outputEl.value = "";
      importEl.value = "";
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
