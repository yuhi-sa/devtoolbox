"use strict";

console.log("=== DevToolBox Test Suite ===\n");

var totalPassed = 0;
var totalFailed = 0;

var testFiles = [
  "./test_markdown_preview.js",
  "./test_svg_optimizer.js",
  "./test_json_schema_validator.js"
];

for (var i = 0; i < testFiles.length; i++) {
  var result = require(testFiles[i]);
  totalPassed += result.passed;
  totalFailed += result.failed;
  console.log("");
}

console.log("=== Results ===");
console.log("Passed: " + totalPassed);
console.log("Failed: " + totalFailed);
console.log("Total:  " + (totalPassed + totalFailed));

if (totalFailed > 0) {
  console.log("\nSome tests FAILED!");
  process.exit(1);
} else {
  console.log("\nAll tests PASSED!");
  process.exit(0);
}
