"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var jsonInput = document.getElementById("json-input");
    var tsOutput = document.getElementById("ts-output");
    var rootNameInput = document.getElementById("root-name");
    var optExport = document.getElementById("opt-export");
    var errorEl = document.getElementById("json-error");
    var successEl = document.getElementById("ts-success");
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
      return str
        .replace(/[^a-zA-Z0-9]/g, " ")
        .split(/\s+/)
        .filter(function (s) { return s.length > 0; })
        .map(function (s) { return capitalize(s); })
        .join("");
    }

    function getType(value) {
      if (value === null) return "null";
      if (Array.isArray(value)) return "array";
      return typeof value;
    }

    function convertToTS(data, rootName, useExport) {
      var interfaces = [];
      var interfaceNames = {};

      function getUniqueName(name) {
        var baseName = toPascalCase(name) || "Interface";
        if (!interfaceNames[baseName]) {
          interfaceNames[baseName] = 1;
          return baseName;
        }
        interfaceNames[baseName]++;
        return baseName + interfaceNames[baseName];
      }

      function inferArrayType(arr, parentName) {
        if (arr.length === 0) return "unknown[]";

        var types = [];
        var hasObjects = false;
        var objectItems = [];

        arr.forEach(function (item) {
          var t = getType(item);
          if (t === "object") {
            hasObjects = true;
            objectItems.push(item);
          } else if (t === "array") {
            types.push(inferArrayType(item, parentName + "Item"));
          } else {
            if (types.indexOf(t) === -1) {
              types.push(t);
            }
          }
        });

        if (hasObjects) {
          // Merge all object keys
          var mergedKeys = {};
          var keyCounts = {};
          objectItems.forEach(function (obj) {
            var keys = Object.keys(obj);
            keys.forEach(function (key) {
              keyCounts[key] = (keyCounts[key] || 0) + 1;
              if (!mergedKeys[key]) {
                mergedKeys[key] = [];
              }
              var vType = getType(obj[key]);
              if (mergedKeys[key].indexOf(vType) === -1) {
                mergedKeys[key].push(vType);
              }
            });
          });

          var ifaceName = getUniqueName(parentName + "Item");
          var fields = [];
          var allKeys = Object.keys(mergedKeys);

          allKeys.forEach(function (key) {
            var optional = keyCounts[key] < objectItems.length;
            var fieldTypes = [];

            // Use the first object's value for type inference of nested structures
            var sampleValue = null;
            for (var i = 0; i < objectItems.length; i++) {
              if (objectItems[i][key] !== undefined) {
                sampleValue = objectItems[i][key];
                break;
              }
            }

            mergedKeys[key].forEach(function (t) {
              if (t === "object") {
                var nestedName = processObject(sampleValue, key);
                fieldTypes.push(nestedName);
              } else if (t === "array") {
                fieldTypes.push(inferArrayType(sampleValue, key));
              } else {
                fieldTypes.push(t);
              }
            });

            var typeStr = fieldTypes.length === 1 ? fieldTypes[0] : "(" + fieldTypes.join(" | ") + ")";
            fields.push("  " + key + (optional ? "?" : "") + ": " + typeStr + ";");
          });

          var prefix = useExport ? "export " : "";
          interfaces.push(prefix + "interface " + ifaceName + " {\n" + fields.join("\n") + "\n}");
          types.push(ifaceName);
        }

        var uniqueTypes = [];
        types.forEach(function (t) {
          if (uniqueTypes.indexOf(t) === -1) uniqueTypes.push(t);
        });

        if (uniqueTypes.length === 0) return "unknown[]";
        if (uniqueTypes.length === 1) return uniqueTypes[0] + "[]";
        return "(" + uniqueTypes.join(" | ") + ")[]";
      }

      function processObject(obj, name) {
        var ifaceName = getUniqueName(name);
        var fields = [];
        var keys = Object.keys(obj);

        keys.forEach(function (key) {
          var value = obj[key];
          var t = getType(value);
          var typeStr;

          if (t === "null") {
            typeStr = "null";
          } else if (t === "object") {
            typeStr = processObject(value, key);
          } else if (t === "array") {
            typeStr = inferArrayType(value, key);
          } else {
            typeStr = t;
          }

          fields.push("  " + key + ": " + typeStr + ";");
        });

        var prefix = useExport ? "export " : "";
        interfaces.push(prefix + "interface " + ifaceName + " {\n" + fields.join("\n") + "\n}");
        return ifaceName;
      }

      if (Array.isArray(data)) {
        var typeStr = inferArrayType(data, rootName);
        var prefix = useExport ? "export " : "";
        interfaces.push(prefix + "type " + toPascalCase(rootName) + " = " + typeStr + ";");
      } else if (typeof data === "object" && data !== null) {
        processObject(data, rootName);
      } else {
        var prefix2 = useExport ? "export " : "";
        interfaces.push(prefix2 + "type " + toPascalCase(rootName) + " = " + getType(data) + ";");
      }

      return interfaces.reverse().join("\n\n");
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
        tsOutput.value = "";
        return;
      }

      var rootName = rootNameInput.value.trim() || "Root";
      var useExport = optExport.checked;

      try {
        var result = convertToTS(data, rootName, useExport);
        tsOutput.value = result;
        showSuccess("TypeScriptインターフェースを生成しました。");
      } catch (e) {
        showError("変換エラー: " + e.message);
        tsOutput.value = "";
      }
    });

    btnClear.addEventListener("click", function () {
      jsonInput.value = "";
      tsOutput.value = "";
      clearMessages();
    });

    btnCopy.addEventListener("click", function () {
      var text = tsOutput.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });
  });
})();
