"use strict";

var assert = require("assert");

// ---------- Copy of sanitization logic from js/tools/svg-optimizer.js (showPreview) ----------

function sanitizeSvg(svg) {
  // Remove script tags
  var safeSvg = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
  // Remove all on* event handler attributes
  safeSvg = safeSvg.replace(/\s+on[a-z][a-z0-9]*\s*=\s*"[^"]*"/gi, "");
  safeSvg = safeSvg.replace(/\s+on[a-z][a-z0-9]*\s*=\s*'[^']*'/gi, "");
  safeSvg = safeSvg.replace(/\s+on[a-z][a-z0-9]*\s*=\s*[^\s>]+/gi, "");
  // Remove javascript: and data: URIs from href/xlink:href
  safeSvg = safeSvg.replace(/\s+(xlink:)?href\s*=\s*"javascript:[^"]*"/gi, "");
  safeSvg = safeSvg.replace(/\s+(xlink:)?href\s*=\s*'javascript:[^']*'/gi, "");
  safeSvg = safeSvg.replace(/\s+(xlink:)?href\s*=\s*"data:[^"]*"/gi, "");
  safeSvg = safeSvg.replace(/\s+(xlink:)?href\s*=\s*'data:[^']*'/gi, "");
  return safeSvg;
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

console.log("svg-optimizer sanitization tests");

test("Script tags are removed", function () {
  var input = '<svg><script>alert("xss")</script><rect width="10" height="10"/></svg>';
  var result = sanitizeSvg(input);
  assert.ok(result.indexOf("<script>") === -1, "Should not contain <script> tag");
  assert.ok(result.indexOf("alert") === -1, "Should not contain alert call");
  assert.ok(result.indexOf("<rect") !== -1, "Should keep valid elements");
});

test("on* event handlers (onclick, onload, onerror) are removed", function () {
  var input = '<svg><rect onclick="alert(1)" width="10" height="10"/></svg>';
  var result = sanitizeSvg(input);
  assert.ok(result.indexOf("onclick") === -1, "onclick should be removed");

  input = '<svg onload="alert(1)"><rect width="10" height="10"/></svg>';
  result = sanitizeSvg(input);
  assert.ok(result.indexOf("onload") === -1, "onload should be removed");

  input = '<svg><image onerror="alert(1)" src="x"/></svg>';
  result = sanitizeSvg(input);
  assert.ok(result.indexOf("onerror") === -1, "onerror should be removed");
});

test("javascript: URIs in href are removed", function () {
  var input = '<svg><a href="javascript:alert(1)"><text>Click</text></a></svg>';
  var result = sanitizeSvg(input);
  assert.ok(result.indexOf("javascript:") === -1, "javascript: URI should be removed");
  assert.ok(result.indexOf("<text>Click</text>") !== -1, "Content should be preserved");
});

test("data: URIs in href are removed", function () {
  var input = '<svg><a href="data:text/html,<script>alert(1)</script>"><text>Click</text></a></svg>';
  var result = sanitizeSvg(input);
  assert.ok(result.indexOf('href="data:') === -1, "data: URI in href should be removed");
});

test("Clean SVG passes through unchanged", function () {
  var input = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red"/></svg>';
  var result = sanitizeSvg(input);
  assert.strictEqual(result, input, "Clean SVG should not be modified");
});

module.exports = { passed: passed, failed: failed };
