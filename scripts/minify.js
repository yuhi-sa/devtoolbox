"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const TERSER = path.join(ROOT, "node_modules", ".bin", "terser");

// Directories containing JS files to minify
const JS_DIRS = [
  path.join(ROOT, "js"),
  path.join(ROOT, "js", "tools"),
];

// CSS files to minify (simple regex-based minification, no extra dependency)
const CSS_FILES = [
  path.join(ROOT, "css", "style.css"),
  path.join(ROOT, "css", "enhancements.css"),
];

let jsCount = 0;
let cssCount = 0;

// --- Minify JS files ---
for (const dir of JS_DIRS) {
  if (!fs.existsSync(dir)) {
    console.log("Skipping missing directory: " + dir);
    continue;
  }

  const files = fs.readdirSync(dir).filter(function (f) {
    return f.endsWith(".js") && !f.endsWith(".min.js");
  });

  for (const file of files) {
    const src = path.join(dir, file);
    const dest = path.join(dir, file.replace(/\.js$/, ".min.js"));

    try {
      execSync(TERSER + " " + JSON.stringify(src) + " --compress --mangle -o " + JSON.stringify(dest), {
        stdio: "pipe",
      });
      jsCount++;
      console.log("  JS  " + path.relative(ROOT, src) + " -> " + path.relative(ROOT, dest));
    } catch (err) {
      console.error("FAIL " + path.relative(ROOT, src) + ": " + (err.stderr ? err.stderr.toString().trim() : err.message));
      process.exitCode = 1;
    }
  }
}

// --- Minify CSS files ---
for (const src of CSS_FILES) {
  if (!fs.existsSync(src)) {
    console.log("Skipping missing CSS: " + src);
    continue;
  }

  const dest = src.replace(/\.css$/, ".min.css");
  try {
    const css = fs.readFileSync(src, "utf8");
    // Simple CSS minification: remove comments, collapse whitespace
    const minified = css
      .replace(/\/\*[\s\S]*?\*\//g, "")   // remove block comments
      .replace(/\s+/g, " ")                // collapse whitespace
      .replace(/\s*([{}:;,>~+])\s*/g, "$1") // remove space around punctuation
      .replace(/;}/g, "}")                  // remove trailing semicolons
      .trim();
    fs.writeFileSync(dest, minified, "utf8");
    cssCount++;
    console.log("  CSS " + path.relative(ROOT, src) + " -> " + path.relative(ROOT, dest));
  } catch (err) {
    console.error("FAIL " + path.relative(ROOT, src) + ": " + err.message);
    process.exitCode = 1;
  }
}

console.log("\nMinified " + jsCount + " JS file(s) and " + cssCount + " CSS file(s).");
