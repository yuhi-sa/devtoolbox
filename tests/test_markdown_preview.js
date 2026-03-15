"use strict";

var assert = require("assert");

// ---------- Copy of pure functions from js/tools/markdown-preview.js ----------

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isSafeUrl(url) {
  var trimmed = url.trim().toLowerCase();
  return (
    /^https?:\/\//.test(trimmed) ||
    /^mailto:/.test(trimmed) ||
    /^#/.test(trimmed) ||
    /^\/[^\/]/.test(trimmed)
  );
}

function parseInline(text) {
  // Images: ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (m, alt, url) {
    if (!isSafeUrl(url)) return escapeHtml(m);
    return '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(alt) + '">';
  });
  // Links: [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, linkText, url) {
    if (!isSafeUrl(url)) return escapeHtml(m);
    return (
      '<a href="' +
      escapeHtml(url) +
      '" target="_blank" rel="noopener noreferrer">' +
      escapeHtml(linkText) +
      "</a>"
    );
  });
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
  // Italic
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");
  // Inline code
  text = text.replace(/`([^`]+)`/g, function (m, code) {
    return "<code>" + escapeHtml(code) + "</code>";
  });
  return text;
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

console.log("markdown-preview tests");

// --- isSafeUrl ---

test("isSafeUrl blocks javascript: URLs", function () {
  assert.strictEqual(isSafeUrl("javascript:alert(1)"), false);
  assert.strictEqual(isSafeUrl("  javascript:alert(1)  "), false);
  assert.strictEqual(isSafeUrl("JAVASCRIPT:alert(1)"), false);
});

test("isSafeUrl allows https:// URLs", function () {
  assert.strictEqual(isSafeUrl("https://example.com"), true);
  assert.strictEqual(isSafeUrl("http://example.com"), true);
});

test("isSafeUrl allows mailto: URLs", function () {
  assert.strictEqual(isSafeUrl("mailto:user@example.com"), true);
});

test("isSafeUrl blocks data: URLs", function () {
  assert.strictEqual(isSafeUrl("data:text/html,<script>alert(1)</script>"), false);
});

// --- escapeHtml ---

test("escapeHtml properly escapes dangerous characters", function () {
  assert.strictEqual(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  assert.strictEqual(escapeHtml("a & b"), "a &amp; b");
  assert.strictEqual(escapeHtml('<img src="x">'), '&lt;img src=&quot;x&quot;&gt;');
});

// --- XSS prevention ---

test("XSS via alt attribute is prevented (escapeHtml applied)", function () {
  var maliciousAlt = '"><script>alert(1)</script>';
  var result = parseInline("![" + maliciousAlt + "](https://example.com/img.png)");
  assert.ok(result.indexOf("<script>") === -1, "Should not contain raw <script> tag");
  assert.ok(result.indexOf("&lt;script&gt;") !== -1, "Should contain escaped script tag");
});

test("XSS via link text is prevented", function () {
  var maliciousText = '<img src=x onerror=alert(1)>';
  var result = parseInline("[" + maliciousText + "](https://example.com)");
  assert.ok(result.indexOf("<img") === -1, "Should not contain raw <img tag");
  assert.ok(result.indexOf("&lt;img") !== -1, "Should contain escaped img tag");
});

module.exports = { passed: passed, failed: failed };
