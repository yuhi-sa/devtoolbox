"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var dataInput = document.getElementById("json-data-input");
    var schemaInput = document.getElementById("json-schema-input");
    var outputEl = document.getElementById("validation-output");
    var errorEl = document.getElementById("validation-error");
    var successEl = document.getElementById("validation-success");
    var btnValidate = document.getElementById("btn-validate");
    var btnSample = document.getElementById("btn-sample");
    var btnClear = document.getElementById("btn-clear");

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
      outputEl.textContent = "";
    }

    // Lightweight JSON Schema validator
    function validateSchema(data, schema, path) {
      var errors = [];
      if (!path) path = "#";

      if (schema === true) return errors;
      if (schema === false) {
        errors.push(path + ": 値が許可されていません");
        return errors;
      }

      // type check
      if (schema.type) {
        var types = Array.isArray(schema.type) ? schema.type : [schema.type];
        var actualType = getType(data);
        var typeMatch = false;
        for (var t = 0; t < types.length; t++) {
          if (types[t] === "integer") {
            if (actualType === "number" && Number.isInteger(data)) typeMatch = true;
          } else if (types[t] === actualType) {
            typeMatch = true;
          }
        }
        if (!typeMatch) {
          errors.push(path + ": 型が不正です。期待: " + types.join(" | ") + "、実際: " + actualType);
          return errors;
        }
      }

      // enum
      if (schema.enum) {
        var enumMatch = false;
        for (var e = 0; e < schema.enum.length; e++) {
          if (JSON.stringify(data) === JSON.stringify(schema.enum[e])) {
            enumMatch = true;
            break;
          }
        }
        if (!enumMatch) {
          errors.push(path + ": 許可されている値のいずれでもありません。許可: " + JSON.stringify(schema.enum));
        }
      }

      // const
      if (schema.const !== undefined) {
        if (JSON.stringify(data) !== JSON.stringify(schema.const)) {
          errors.push(path + ": 値が一致しません。期待: " + JSON.stringify(schema.const));
        }
      }

      // number/integer constraints
      if (typeof data === "number") {
        if (schema.minimum !== undefined && data < schema.minimum) {
          errors.push(path + ": 最小値 " + schema.minimum + " より小さい値です（" + data + "）");
        }
        if (schema.maximum !== undefined && data > schema.maximum) {
          errors.push(path + ": 最大値 " + schema.maximum + " より大きい値です（" + data + "）");
        }
        if (schema.exclusiveMinimum !== undefined && data <= schema.exclusiveMinimum) {
          errors.push(path + ": " + schema.exclusiveMinimum + " より大きい値が必要です（" + data + "）");
        }
        if (schema.exclusiveMaximum !== undefined && data >= schema.exclusiveMaximum) {
          errors.push(path + ": " + schema.exclusiveMaximum + " より小さい値が必要です（" + data + "）");
        }
        if (schema.multipleOf !== undefined && data % schema.multipleOf !== 0) {
          errors.push(path + ": " + schema.multipleOf + " の倍数である必要があります（" + data + "）");
        }
      }

      // string constraints
      if (typeof data === "string") {
        if (schema.minLength !== undefined && data.length < schema.minLength) {
          errors.push(path + ": 文字数が最小 " + schema.minLength + " 文字に満たしていません（" + data.length + " 文字）");
        }
        if (schema.maxLength !== undefined && data.length > schema.maxLength) {
          errors.push(path + ": 文字数が最大 " + schema.maxLength + " 文字を超えています（" + data.length + " 文字）");
        }
        if (schema.pattern) {
          var re = new RegExp(schema.pattern);
          if (!re.test(data)) {
            errors.push(path + ': パターン "' + schema.pattern + '" に一致しません');
          }
        }
        if (schema.format) {
          var formatErrors = validateFormat(data, schema.format, path);
          errors = errors.concat(formatErrors);
        }
      }

      // array constraints
      if (Array.isArray(data)) {
        if (schema.minItems !== undefined && data.length < schema.minItems) {
          errors.push(path + ": 要素数が最小 " + schema.minItems + " 個に満たしていません（" + data.length + " 個）");
        }
        if (schema.maxItems !== undefined && data.length > schema.maxItems) {
          errors.push(path + ": 要素数が最大 " + schema.maxItems + " 個を超えています（" + data.length + " 個）");
        }
        if (schema.uniqueItems) {
          var seen = [];
          for (var u = 0; u < data.length; u++) {
            var str = JSON.stringify(data[u]);
            if (seen.indexOf(str) !== -1) {
              errors.push(path + ": 重複する要素があります（インデックス " + u + "）");
              break;
            }
            seen.push(str);
          }
        }
        if (schema.items) {
          for (var ai = 0; ai < data.length; ai++) {
            errors = errors.concat(validateSchema(data[ai], schema.items, path + "[" + ai + "]"));
          }
        }
      }

      // object constraints
      if (data !== null && typeof data === "object" && !Array.isArray(data)) {
        var dataKeys = Object.keys(data);

        if (schema.required) {
          for (var r = 0; r < schema.required.length; r++) {
            if (!(schema.required[r] in data)) {
              errors.push(path + ": 必須プロパティ '" + schema.required[r] + "' がありません");
            }
          }
        }

        if (schema.minProperties !== undefined && dataKeys.length < schema.minProperties) {
          errors.push(path + ": プロパティ数が最小 " + schema.minProperties + " 個に満たしていません");
        }
        if (schema.maxProperties !== undefined && dataKeys.length > schema.maxProperties) {
          errors.push(path + ": プロパティ数が最大 " + schema.maxProperties + " 個を超えています");
        }

        if (schema.properties) {
          var propKeys = Object.keys(schema.properties);
          for (var p = 0; p < propKeys.length; p++) {
            var key = propKeys[p];
            if (key in data) {
              errors = errors.concat(validateSchema(data[key], schema.properties[key], path + "." + key));
            }
          }
        }

        if (schema.additionalProperties === false && schema.properties) {
          var allowed = Object.keys(schema.properties);
          var patternProps = schema.patternProperties ? Object.keys(schema.patternProperties) : [];
          for (var ak = 0; ak < dataKeys.length; ak++) {
            if (allowed.indexOf(dataKeys[ak]) === -1) {
              var patternMatch = false;
              for (var pp = 0; pp < patternProps.length; pp++) {
                if (new RegExp(patternProps[pp]).test(dataKeys[ak])) {
                  patternMatch = true;
                  break;
                }
              }
              if (!patternMatch) {
                errors.push(path + ": 追加プロパティ '" + dataKeys[ak] + "' は許可されていません");
              }
            }
          }
        }

        if (schema.patternProperties) {
          var patKeys = Object.keys(schema.patternProperties);
          for (var pk = 0; pk < patKeys.length; pk++) {
            var pat = new RegExp(patKeys[pk]);
            for (var dk = 0; dk < dataKeys.length; dk++) {
              if (pat.test(dataKeys[dk])) {
                errors = errors.concat(validateSchema(data[dataKeys[dk]], schema.patternProperties[patKeys[pk]], path + "." + dataKeys[dk]));
              }
            }
          }
        }
      }

      // allOf
      if (schema.allOf) {
        for (var ao = 0; ao < schema.allOf.length; ao++) {
          errors = errors.concat(validateSchema(data, schema.allOf[ao], path));
        }
      }

      // anyOf
      if (schema.anyOf) {
        var anyValid = false;
        for (var an = 0; an < schema.anyOf.length; an++) {
          if (validateSchema(data, schema.anyOf[an], path).length === 0) {
            anyValid = true;
            break;
          }
        }
        if (!anyValid) {
          errors.push(path + ": anyOf のいずれのスキーマにも一致しません");
        }
      }

      // oneOf
      if (schema.oneOf) {
        var oneCount = 0;
        for (var oo = 0; oo < schema.oneOf.length; oo++) {
          if (validateSchema(data, schema.oneOf[oo], path).length === 0) {
            oneCount++;
          }
        }
        if (oneCount !== 1) {
          errors.push(path + ": oneOf の正確に1つのスキーマに一致する必要があります（一致数: " + oneCount + "）");
        }
      }

      // not
      if (schema.not) {
        if (validateSchema(data, schema.not, path).length === 0) {
          errors.push(path + ": not で指定されたスキーマに一致してはいけません");
        }
      }

      return errors;
    }

    function getType(value) {
      if (value === null) return "null";
      if (Array.isArray(value)) return "array";
      return typeof value;
    }

    function validateFormat(value, format, path) {
      var errors = [];
      switch (format) {
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(path + ": 有効なメールアドレス形式ではありません");
          }
          break;
        case "uri":
          if (!/^https?:\/\/.+/.test(value)) {
            errors.push(path + ": 有効なURI形式ではありません");
          }
          break;
        case "date":
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || isNaN(Date.parse(value))) {
            errors.push(path + ": 有効な日付形式（YYYY-MM-DD）ではありません");
          }
          break;
        case "date-time":
          if (isNaN(Date.parse(value))) {
            errors.push(path + ": 有効な日時形式ではありません");
          }
          break;
        case "ipv4":
          if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) {
            errors.push(path + ": 有効なIPv4アドレスではありません");
          }
          break;
      }
      return errors;
    }

    var sampleData = JSON.stringify({
      name: "田中太郎",
      age: 30,
      email: "taro@example.com",
      address: {
        city: "東京",
        zipCode: "100-0001"
      },
      hobbies: ["読書", "プログラミング"]
    }, null, 2);

    var sampleSchema = JSON.stringify({
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
        age: { type: "integer", minimum: 0, maximum: 150 },
        email: { type: "string", format: "email" },
        address: {
          type: "object",
          properties: {
            city: { type: "string" },
            zipCode: { type: "string", pattern: "^\\d{3}-\\d{4}$" }
          },
          required: ["city"]
        },
        hobbies: {
          type: "array",
          items: { type: "string" },
          minItems: 1
        }
      },
      required: ["name", "age", "email"]
    }, null, 2);

    btnValidate.addEventListener("click", function () {
      clearMessages();

      var dataStr = dataInput.value.trim();
      var schemaStr = schemaInput.value.trim();

      if (!dataStr) {
        showError("JSONデータを入力してください。");
        return;
      }
      if (!schemaStr) {
        showError("JSON Schemaを入力してください。");
        return;
      }

      var data, schema;
      try {
        data = JSON.parse(dataStr);
      } catch (e) {
        showError("JSONデータの構文エラー: " + e.message);
        return;
      }
      try {
        schema = JSON.parse(schemaStr);
      } catch (e) {
        showError("JSON Schemaの構文エラー: " + e.message);
        return;
      }

      var errors = validateSchema(data, schema);

      if (errors.length === 0) {
        outputEl.textContent = "検証成功: JSONデータはスキーマに適合しています。";
        outputEl.style.color = "var(--color-success, #28a745)";
        showSuccess("検証が完了しました。エラーはありません。");
      } else {
        var output = "検証エラー: " + errors.length + " 件のエラーが見つかりました。\n\n";
        for (var i = 0; i < errors.length; i++) {
          output += (i + 1) + ". " + errors[i] + "\n";
        }
        outputEl.textContent = output;
        outputEl.style.color = "var(--color-error, #dc3545)";
        showError(errors.length + " 件のバリデーションエラーが見つかりました。");
      }
    });

    btnSample.addEventListener("click", function () {
      clearMessages();
      dataInput.value = sampleData;
      schemaInput.value = sampleSchema;
    });

    btnClear.addEventListener("click", function () {
      dataInput.value = "";
      schemaInput.value = "";
      outputEl.textContent = "";
      outputEl.style.color = "";
      clearMessages();
    });
  });
})();
