"use strict";

var assert = require("assert");

// ---------- Copy of pure functions from js/tools/json-schema-validator.js ----------

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

  // string constraints
  if (typeof data === "string") {
    if (schema.minLength !== undefined && data.length < schema.minLength) {
      errors.push(path + ": 文字数が最小 " + schema.minLength + " 文字に満たしていません（" + data.length + " 文字）");
    }
    if (schema.maxLength !== undefined && data.length > schema.maxLength) {
      errors.push(path + ": 文字数が最大 " + schema.maxLength + " 文字を超えています（" + data.length + " 文字）");
    }
    if (schema.pattern) {
      try {
        var re = new RegExp(schema.pattern);
        if (!re.test(data)) {
          errors.push(path + ': パターン "' + schema.pattern + '" に一致しません');
        }
      } catch (regexErr) {
        errors.push(path + ': パターン "' + schema.pattern + '" は無効な正規表現です: ' + regexErr.message);
      }
    }
    if (schema.format) {
      var formatErrors = validateFormat(data, schema.format, path);
      errors = errors.concat(formatErrors);
    }
  }

  // number constraints
  if (typeof data === "number") {
    if (schema.minimum !== undefined && data < schema.minimum) {
      errors.push(path + ": 最小値 " + schema.minimum + " より小さい値です（" + data + "）");
    }
    if (schema.maximum !== undefined && data > schema.maximum) {
      errors.push(path + ": 最大値 " + schema.maximum + " より大きい値です（" + data + "）");
    }
  }

  // array constraints
  if (Array.isArray(data)) {
    if (schema.items) {
      for (var ai = 0; ai < data.length; ai++) {
        errors = errors.concat(validateSchema(data[ai], schema.items, path + "[" + ai + "]"));
      }
    }
  }

  // object constraints
  if (data !== null && typeof data === "object" && !Array.isArray(data)) {
    if (schema.required) {
      for (var r = 0; r < schema.required.length; r++) {
        if (!(schema.required[r] in data)) {
          errors.push(path + ": 必須プロパティ '" + schema.required[r] + "' がありません");
        }
      }
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
  }

  return errors;
}

// ---------- Tests ----------

var passed = 0;
var failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log("  PASS: " + name);
  } catch (e) {
    failed++;
    console.log("  FAIL: " + name);
    console.log("        " + e.message);
  }
}

console.log("json-schema-validator tests");

// --- Type validation ---

test("Type validation: string", function () {
  var errors = validateSchema("hello", { type: "string" });
  assert.strictEqual(errors.length, 0, "Valid string should pass");

  errors = validateSchema(123, { type: "string" });
  assert.ok(errors.length > 0, "Number should fail string type check");
});

test("Type validation: number", function () {
  var errors = validateSchema(42, { type: "number" });
  assert.strictEqual(errors.length, 0, "Valid number should pass");

  errors = validateSchema("42", { type: "number" });
  assert.ok(errors.length > 0, "String should fail number type check");
});

test("Type validation: boolean", function () {
  var errors = validateSchema(true, { type: "boolean" });
  assert.strictEqual(errors.length, 0, "Valid boolean should pass");

  errors = validateSchema(1, { type: "boolean" });
  assert.ok(errors.length > 0, "Number should fail boolean type check");
});

test("Type validation: array", function () {
  var errors = validateSchema([1, 2, 3], { type: "array" });
  assert.strictEqual(errors.length, 0, "Valid array should pass");

  errors = validateSchema("not-array", { type: "array" });
  assert.ok(errors.length > 0, "String should fail array type check");
});

test("Type validation: object", function () {
  var errors = validateSchema({ a: 1 }, { type: "object" });
  assert.strictEqual(errors.length, 0, "Valid object should pass");

  errors = validateSchema([1], { type: "object" });
  assert.ok(errors.length > 0, "Array should fail object type check");
});

// --- Required fields ---

test("Required fields validation", function () {
  var schema = {
    type: "object",
    required: ["name", "age"],
    properties: {
      name: { type: "string" },
      age: { type: "number" }
    }
  };

  var errors = validateSchema({ name: "Alice", age: 30 }, schema);
  assert.strictEqual(errors.length, 0, "All required fields present should pass");

  errors = validateSchema({ name: "Alice" }, schema);
  assert.ok(errors.length > 0, "Missing required field should fail");
  assert.ok(errors[0].indexOf("age") !== -1, "Error should mention missing field");
});

// --- Pattern validation ---

test("Pattern validation with valid regex", function () {
  var schema = { type: "string", pattern: "^\\d{3}-\\d{4}$" };

  var errors = validateSchema("123-4567", schema);
  assert.strictEqual(errors.length, 0, "Matching pattern should pass");

  errors = validateSchema("1234567", schema);
  assert.ok(errors.length > 0, "Non-matching pattern should fail");
});

test("Pattern validation with invalid regex doesn't crash", function () {
  var schema = { type: "string", pattern: "[invalid(" };

  var errors;
  assert.doesNotThrow(function () {
    errors = validateSchema("test", schema);
  }, "Invalid regex should not throw");
  assert.ok(errors.length > 0, "Should report error for invalid regex");
  assert.ok(errors[0].indexOf("無効な正規表現") !== -1, "Error should mention invalid regex");
});

// --- Format validation ---

test("Format validation: email", function () {
  var schema = { type: "string", format: "email" };

  var errors = validateSchema("user@example.com", schema);
  assert.strictEqual(errors.length, 0, "Valid email should pass");

  errors = validateSchema("not-an-email", schema);
  assert.ok(errors.length > 0, "Invalid email should fail");
});

test("Format validation: ipv4", function () {
  var schema = { type: "string", format: "ipv4" };

  var errors = validateSchema("192.168.1.1", schema);
  assert.strictEqual(errors.length, 0, "Valid IPv4 should pass");

  errors = validateSchema("999.999.999", schema);
  assert.ok(errors.length > 0, "Invalid IPv4 should fail");
});

module.exports = { passed: passed, failed: failed };
