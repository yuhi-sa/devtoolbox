"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("sql-input");
    var outputEl = document.getElementById("sql-output");
    var errorEl = document.getElementById("sql-error");
    var successEl = document.getElementById("sql-success");
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

    // SQL keywords that should be uppercased
    var allKeywords = [
      "SELECT", "FROM", "WHERE", "JOIN", "LEFT JOIN", "RIGHT JOIN",
      "INNER JOIN", "OUTER JOIN", "FULL OUTER JOIN", "CROSS JOIN",
      "ON", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING",
      "LIMIT", "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET",
      "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
      "UNION ALL", "UNION", "CASE", "WHEN", "THEN", "ELSE", "END",
      "AS", "IN", "NOT", "NULL", "IS", "BETWEEN", "LIKE", "EXISTS",
      "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN", "ASC", "DESC",
      "PRIMARY KEY", "FOREIGN KEY", "REFERENCES", "INDEX", "UNIQUE",
      "DEFAULT", "NOT NULL", "AUTO_INCREMENT", "CASCADE", "IF EXISTS",
      "IF NOT EXISTS", "INTO", "TABLE", "DATABASE", "SCHEMA", "VIEW",
      "TRIGGER", "PROCEDURE", "FUNCTION", "RETURNS", "BEGIN", "COMMIT",
      "ROLLBACK", "GRANT", "REVOKE", "WITH", "RECURSIVE", "FETCH",
      "NEXT", "ROWS", "ONLY", "ALL", "ANY", "SOME"
    ];

    // Keywords that trigger a new line (major clauses)
    var newlineKeywords = [
      "SELECT", "FROM", "WHERE", "LEFT JOIN", "RIGHT JOIN",
      "INNER JOIN", "OUTER JOIN", "FULL OUTER JOIN", "CROSS JOIN",
      "JOIN", "ORDER BY", "GROUP BY", "HAVING", "LIMIT",
      "UNION ALL", "UNION", "INSERT INTO", "VALUES", "UPDATE",
      "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE", "DROP TABLE",
      "ON", "CASE", "END"
    ];

    // Keywords that get indented
    var indentKeywords = ["AND", "OR", "WHEN", "THEN", "ELSE"];

    function tokenize(sql) {
      var tokens = [];
      var i = 0;
      var len = sql.length;

      while (i < len) {
        // Skip whitespace
        if (/\s/.test(sql[i])) {
          i++;
          continue;
        }

        // String literals (single-quoted)
        if (sql[i] === "'") {
          var str = "'";
          i++;
          while (i < len && sql[i] !== "'") {
            if (sql[i] === "'" && i + 1 < len && sql[i + 1] === "'") {
              str += "''";
              i += 2;
            } else {
              str += sql[i];
              i++;
            }
          }
          if (i < len) {
            str += "'";
            i++;
          }
          tokens.push({ type: "string", value: str });
          continue;
        }

        // Double-quoted identifiers
        if (sql[i] === '"') {
          var dstr = '"';
          i++;
          while (i < len && sql[i] !== '"') {
            dstr += sql[i];
            i++;
          }
          if (i < len) {
            dstr += '"';
            i++;
          }
          tokens.push({ type: "identifier", value: dstr });
          continue;
        }

        // Backtick identifiers
        if (sql[i] === '`') {
          var bstr = '`';
          i++;
          while (i < len && sql[i] !== '`') {
            bstr += sql[i];
            i++;
          }
          if (i < len) {
            bstr += '`';
            i++;
          }
          tokens.push({ type: "identifier", value: bstr });
          continue;
        }

        // Parentheses
        if (sql[i] === "(") {
          tokens.push({ type: "open_paren", value: "(" });
          i++;
          continue;
        }
        if (sql[i] === ")") {
          tokens.push({ type: "close_paren", value: ")" });
          i++;
          continue;
        }

        // Comma
        if (sql[i] === ",") {
          tokens.push({ type: "comma", value: "," });
          i++;
          continue;
        }

        // Semicolon
        if (sql[i] === ";") {
          tokens.push({ type: "semicolon", value: ";" });
          i++;
          continue;
        }

        // Operators: >=, <=, <>, !=, =, <, >, ||
        if (/[=<>!|]/.test(sql[i])) {
          var op = sql[i];
          i++;
          if (i < len && /[=<>|]/.test(sql[i])) {
            op += sql[i];
            i++;
          }
          tokens.push({ type: "operator", value: op });
          continue;
        }

        // Dot
        if (sql[i] === ".") {
          tokens.push({ type: "dot", value: "." });
          i++;
          continue;
        }

        // Numbers
        if (/[0-9]/.test(sql[i])) {
          var num = "";
          while (i < len && /[0-9.]/.test(sql[i])) {
            num += sql[i];
            i++;
          }
          tokens.push({ type: "number", value: num });
          continue;
        }

        // Wildcard
        if (sql[i] === "*" && (tokens.length === 0 || tokens[tokens.length - 1].type !== "identifier")) {
          tokens.push({ type: "wildcard", value: "*" });
          i++;
          continue;
        }

        // Words / keywords
        if (/[a-zA-Z_]/.test(sql[i])) {
          var word = "";
          while (i < len && /[a-zA-Z0-9_]/.test(sql[i])) {
            word += sql[i];
            i++;
          }
          tokens.push({ type: "word", value: word });
          continue;
        }

        // Anything else
        tokens.push({ type: "other", value: sql[i] });
        i++;
      }

      return tokens;
    }

    function uppercaseKeywords(tokens) {
      // Sort compound keywords by length (longest first) for greedy matching
      var compoundKeywords = allKeywords.filter(function (k) { return k.indexOf(" ") !== -1; });
      compoundKeywords.sort(function (a, b) { return b.split(" ").length - a.split(" ").length; });

      var result = [];
      var i = 0;

      while (i < tokens.length) {
        if (tokens[i].type === "word") {
          var matched = false;
          // Try compound keywords
          for (var c = 0; c < compoundKeywords.length; c++) {
            var parts = compoundKeywords[c].split(" ");
            var allMatch = true;
            var wordIdx = 0;
            var lookAhead = i;

            for (var p = 0; p < parts.length; p++) {
              // Skip to next word token
              while (lookAhead < tokens.length && lookAhead !== i && tokens[lookAhead].type !== "word") {
                lookAhead++;
              }
              if (lookAhead >= tokens.length || tokens[lookAhead].type !== "word" ||
                  tokens[lookAhead].value.toUpperCase() !== parts[p]) {
                allMatch = false;
                break;
              }
              lookAhead++;
            }

            if (allMatch) {
              result.push({ type: "keyword", value: compoundKeywords[c] });
              i = lookAhead;
              matched = true;
              break;
            }
          }

          if (!matched) {
            // Check single keywords
            var upper = tokens[i].value.toUpperCase();
            var isSingle = allKeywords.indexOf(upper) !== -1;
            if (isSingle) {
              result.push({ type: "keyword", value: upper });
            } else {
              result.push(tokens[i]);
            }
            i++;
          }
        } else {
          result.push(tokens[i]);
          i++;
        }
      }

      return result;
    }

    function formatSQL(sql) {
      var tokens = tokenize(sql);
      tokens = uppercaseKeywords(tokens);

      var output = [];
      var indent = 0;
      var indentStr = "  ";
      var newLine = true;

      function addNewLine() {
        output.push("\n");
        for (var j = 0; j < indent; j++) {
          output.push(indentStr);
        }
        newLine = true;
      }

      function addSpace() {
        if (!newLine && output.length > 0) {
          var last = output[output.length - 1];
          if (last !== " " && last !== "\n" && !/\n\s*$/.test(last)) {
            output.push(" ");
          }
        }
      }

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (token.type === "keyword") {
          var kw = token.value;

          if (newlineKeywords.indexOf(kw) !== -1) {
            if (kw === "ON" || kw === "CASE") {
              addNewLine();
              output.push(kw);
              newLine = false;
              if (kw === "CASE") {
                indent++;
              }
            } else if (kw === "END") {
              indent = Math.max(0, indent - 1);
              addNewLine();
              output.push(kw);
              newLine = false;
            } else {
              if (output.length > 0) {
                addNewLine();
              }
              output.push(kw);
              newLine = false;
              if (kw === "SELECT" || kw === "SET" || kw === "VALUES") {
                indent++;
              }
              if (kw === "FROM" || kw === "WHERE" || kw === "ORDER BY" ||
                  kw === "GROUP BY" || kw === "HAVING" || kw === "LIMIT") {
                // Reset indent for major clauses
                indent = 1;
              }
            }
          } else if (indentKeywords.indexOf(kw) !== -1) {
            addNewLine();
            output.push(kw);
            newLine = false;
          } else {
            addSpace();
            output.push(kw);
            newLine = false;
          }
        } else if (token.type === "open_paren") {
          addSpace();
          output.push("(");
          indent++;
          newLine = false;
        } else if (token.type === "close_paren") {
          indent = Math.max(0, indent - 1);
          addNewLine();
          output.push(")");
          newLine = false;
        } else if (token.type === "comma") {
          output.push(",");
          addNewLine();
          newLine = true;
        } else if (token.type === "semicolon") {
          output.push(";");
          indent = 0;
          addNewLine();
          output.push("");
          newLine = true;
        } else if (token.type === "dot") {
          output.push(".");
        } else {
          if (token.type !== "dot" && !newLine) {
            addSpace();
          }
          output.push(token.value);
          newLine = false;
        }
      }

      return output.join("").trim();
    }

    function minifySQL(sql) {
      var tokens = tokenize(sql);
      tokens = uppercaseKeywords(tokens);
      var parts = [];

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (token.type === "dot") {
          parts.push(".");
        } else if (token.type === "comma") {
          parts.push(", ");
        } else {
          if (parts.length > 0) {
            var last = parts[parts.length - 1];
            if (last !== "." && last !== " " && !/\.$/.test(last)) {
              parts.push(" ");
            }
          }
          parts.push(token.value);
        }
      }

      return parts.join("").replace(/ +/g, " ").trim();
    }

    btnFormat.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("SQL文を入力してください。");
        return;
      }
      try {
        outputEl.value = formatSQL(input);
        showSuccess("フォーマットが完了しました。");
      } catch (e) {
        showError("フォーマットに失敗しました: " + e.message);
      }
    });

    btnMinify.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();
      if (!input) {
        showError("SQL文を入力してください。");
        return;
      }
      try {
        outputEl.value = minifySQL(input);
        showSuccess("圧縮が完了しました。");
      } catch (e) {
        showError("圧縮に失敗しました: " + e.message);
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
