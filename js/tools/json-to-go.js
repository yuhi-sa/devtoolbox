"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var jsonInput = document.getElementById("json-input");
    var goOutput = document.getElementById("go-output");
    var rootNameInput = document.getElementById("root-name");
    var errorEl = document.getElementById("json-error");
    var successEl = document.getElementById("go-success");
    var btnConvert = document.getElementById("btn-convert");
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

    function capitalize(str) {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function toPascalCase(str) {
      // Handle snake_case, camelCase, kebab-case
      return str
        .replace(/[^a-zA-Z0-9]/g, " ")
        .split(/\s+/)
        .filter(function (s) { return s.length > 0; })
        .map(function (s) { return capitalize(s); })
        .join("");
    }

    function getGoType(value) {
      if (value === null) return "interface{}";
      if (typeof value === "boolean") return "bool";
      if (typeof value === "number") {
        if (Number.isInteger(value)) return "int64";
        return "float64";
      }
      if (typeof value === "string") return "string";
      return null; // object or array handled separately
    }

    function convertToGo(data, rootName) {
      var structs = [];
      var structNames = {};

      function getUniqueName(name) {
        var baseName = toPascalCase(name) || "Struct";
        if (!structNames[baseName]) {
          structNames[baseName] = 1;
          return baseName;
        }
        structNames[baseName]++;
        return baseName + structNames[baseName];
      }

      function inferArrayType(arr, parentName, indent) {
        if (arr.length === 0) return "[]interface{}";

        var hasObjects = false;
        var hasArrays = false;
        var primitiveType = null;
        var objectItems = [];

        for (var i = 0; i < arr.length; i++) {
          var item = arr[i];
          if (item === null) {
            primitiveType = "interface{}";
          } else if (Array.isArray(item)) {
            hasArrays = true;
          } else if (typeof item === "object") {
            hasObjects = true;
            objectItems.push(item);
          } else {
            var t = getGoType(item);
            if (primitiveType === null) {
              primitiveType = t;
            } else if (primitiveType !== t) {
              primitiveType = "interface{}";
            }
          }
        }

        if (hasObjects) {
          // Merge all object keys
          var mergedKeys = {};
          objectItems.forEach(function (obj) {
            Object.keys(obj).forEach(function (key) {
              if (!mergedKeys[key]) {
                mergedKeys[key] = obj[key];
              }
            });
          });
          var structName = processObject(mergedKeys, parentName, indent);
          return "[]" + structName;
        }

        if (hasArrays) {
          // Use first array element for type inference
          var firstArr = null;
          for (var j = 0; j < arr.length; j++) {
            if (Array.isArray(arr[j])) {
              firstArr = arr[j];
              break;
            }
          }
          return "[]" + inferArrayType(firstArr, parentName + "Item", indent);
        }

        if (primitiveType) return "[]" + primitiveType;
        return "[]interface{}";
      }

      function processObject(obj, name, indent) {
        var structName = getUniqueName(name);
        var lines = [];
        var indentStr = indent || "";
        lines.push(indentStr + "type " + structName + " struct {");

        var keys = Object.keys(obj);
        keys.forEach(function (key) {
          var value = obj[key];
          var fieldName = toPascalCase(key) || "Field";
          var goType;

          if (value === null) {
            goType = "interface{}";
          } else if (Array.isArray(value)) {
            goType = inferArrayType(value, key, indentStr);
          } else if (typeof value === "object") {
            goType = processObject(value, key, indentStr);
          } else {
            goType = getGoType(value);
          }

          lines.push(indentStr + "\t" + fieldName + " " + goType + ' `json:"' + key + '"`');
        });

        lines.push(indentStr + "}");
        structs.push(lines.join("\n"));
        return structName;
      }

      if (Array.isArray(data)) {
        var sliceType = inferArrayType(data, rootName, "");
        structs.push("type " + toPascalCase(rootName) + " = " + sliceType);
      } else if (typeof data === "object" && data !== null) {
        processObject(data, rootName, "");
      } else {
        var goType = getGoType(data) || "interface{}";
        structs.push("type " + toPascalCase(rootName) + " = " + goType);
      }

      return structs.reverse().join("\n\n");
    }

    btnConvert.addEventListener("click", function () {
      clearMessages();
      var input = jsonInput.value.trim();
      if (!input) {
        showError("JSONを入力してください。");
        return;
      }

      var data;
      try {
        data = JSON.parse(input);
      } catch (e) {
        showError("JSON構文エラー: " + e.message);
        goOutput.value = "";
        return;
      }

      var rootName = rootNameInput.value.trim() || "AutoGenerated";

      try {
        var result = convertToGo(data, rootName);
        goOutput.value = result;
        showSuccess("Go構造体を生成しました。");
      } catch (e) {
        showError("変換エラー: " + e.message);
        goOutput.value = "";
      }
    });

    btnClear.addEventListener("click", function () {
      jsonInput.value = "";
      goOutput.value = "";
      clearMessages();
    });

    btnCopy.addEventListener("click", function () {
      var text = goOutput.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });
  });
})();
