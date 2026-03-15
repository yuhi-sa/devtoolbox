"use strict";

/**
 * DevToolBox Pipeline - ツール間パイプライン機能
 * 複数ツールの出力を次のツールの入力に連結して実行する
 */
(function () {
  /* ================================
     コア変換関数（各ツールから抽出）
     ================================ */

  /** JSON整形 */
  function jsonFormat(input, options) {
    var indent = (options && options.indent) || 2;
    var parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, indent);
  }

  /** JSON圧縮 */
  function jsonMinify(input) {
    var parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  }

  /** Base64エンコード */
  function base64Encode(input) {
    var encoder = new TextEncoder();
    var bytes = encoder.encode(input);
    var binary = "";
    for (var i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /** Base64デコード */
  function base64Decode(input) {
    var cleaned = input.replace(/\s/g, "");
    var binary = atob(cleaned);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    var decoder = new TextDecoder();
    return decoder.decode(bytes);
  }

  /** URLエンコード */
  function urlEncode(input) {
    return encodeURIComponent(input);
  }

  /** URLデコード */
  function urlDecode(input) {
    try {
      return decodeURIComponent(input);
    } catch (_e) {
      return decodeURI(input);
    }
  }

  /** JSONPathクエリ */
  function jsonPathQuery(input, options) {
    var pathStr = (options && options.path) || "$";
    var data = JSON.parse(input);

    if (!pathStr || pathStr.charAt(0) !== "$") {
      throw new Error("JSONPathは '$' で始まる必要があります。");
    }

    var tokens = tokenizePath(pathStr.substring(1));
    var results = [data];

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      var nextResults = [];

      for (var j = 0; j < results.length; j++) {
        var current = results[j];
        if (current === null || current === undefined) continue;

        if (token.type === "wildcard") {
          if (Array.isArray(current)) {
            for (var k = 0; k < current.length; k++) {
              nextResults.push(current[k]);
            }
          } else if (typeof current === "object") {
            var objKeys = Object.keys(current);
            for (var m = 0; m < objKeys.length; m++) {
              nextResults.push(current[objKeys[m]]);
            }
          }
        } else if (token.type === "index") {
          var idx = parseInt(token.value, 10);
          if (Array.isArray(current) && idx >= 0 && idx < current.length) {
            nextResults.push(current[idx]);
          }
        } else if (token.type === "key") {
          if (typeof current === "object" && current !== null && !Array.isArray(current)) {
            if (token.value in current) {
              nextResults.push(current[token.value]);
            }
          }
        }
      }

      results = nextResults;
    }

    if (results.length === 0) {
      return "（該当する値がありません）";
    } else if (results.length === 1) {
      return JSON.stringify(results[0], null, 2);
    }
    return JSON.stringify(results, null, 2);
  }

  function tokenizePath(pathStr) {
    var tokens = [];
    var i = 0;
    var len = pathStr.length;

    while (i < len) {
      var ch = pathStr.charAt(i);

      if (ch === ".") {
        i++;
        if (i < len && pathStr.charAt(i) === "*") {
          tokens.push({ type: "wildcard" });
          i++;
        } else {
          var dotKey = "";
          while (i < len && pathStr.charAt(i) !== "." && pathStr.charAt(i) !== "[") {
            dotKey += pathStr.charAt(i);
            i++;
          }
          if (dotKey) {
            tokens.push({ type: "key", value: dotKey });
          }
        }
      } else if (ch === "[") {
        i++;
        if (i < len && pathStr.charAt(i) === "*") {
          tokens.push({ type: "wildcard" });
          i++;
          if (i < len && pathStr.charAt(i) === "]") i++;
        } else if (i < len && (pathStr.charAt(i) === "'" || pathStr.charAt(i) === '"')) {
          var quote = pathStr.charAt(i);
          i++;
          var qKey = "";
          while (i < len && pathStr.charAt(i) !== quote) {
            if (pathStr.charAt(i) === "\\" && i + 1 < len) {
              i++;
              qKey += pathStr.charAt(i);
            } else {
              qKey += pathStr.charAt(i);
            }
            i++;
          }
          if (i < len) i++;
          if (i < len && pathStr.charAt(i) === "]") i++;
          tokens.push({ type: "key", value: qKey });
        } else {
          var num = "";
          while (i < len && pathStr.charAt(i) !== "]") {
            num += pathStr.charAt(i);
            i++;
          }
          if (i < len) i++;
          var parsed = parseInt(num, 10);
          if (!isNaN(parsed)) {
            tokens.push({ type: "index", value: parsed });
          } else {
            tokens.push({ type: "key", value: num });
          }
        }
      } else {
        var bareKey = "";
        while (i < len && pathStr.charAt(i) !== "." && pathStr.charAt(i) !== "[") {
          bareKey += pathStr.charAt(i);
          i++;
        }
        if (bareKey === "*") {
          tokens.push({ type: "wildcard" });
        } else if (bareKey) {
          tokens.push({ type: "key", value: bareKey });
        }
      }
    }

    return tokens;
  }

  /** テキスト差分比較 */
  function diffCheck(input, options) {
    var originalText = input;
    var modifiedText = (options && options.modified) || "";

    var originalLines = originalText.split("\n");
    var modifiedLines = modifiedText.split("\n");

    var diff = buildDiff(originalLines, modifiedLines);

    var lines = [];
    for (var i = 0; i < diff.length; i++) {
      var line = diff[i];
      if (line.type === "added") {
        lines.push("+ " + line.text);
      } else if (line.type === "removed") {
        lines.push("- " + line.text);
      } else {
        lines.push("  " + line.text);
      }
    }
    return lines.join("\n");
  }

  function computeLCS(a, b) {
    var m = a.length;
    var n = b.length;
    var dp = [];

    for (var i = 0; i <= m; i++) {
      dp[i] = [];
      for (var j = 0; j <= n; j++) {
        dp[i][j] = 0;
      }
    }

    for (var x = 1; x <= m; x++) {
      for (var y = 1; y <= n; y++) {
        if (a[x - 1] === b[y - 1]) {
          dp[x][y] = dp[x - 1][y - 1] + 1;
        } else {
          dp[x][y] = Math.max(dp[x - 1][y], dp[x][y - 1]);
        }
      }
    }

    return dp;
  }

  function buildDiff(a, b) {
    var dp = computeLCS(a, b);
    var result = [];
    var i = a.length;
    var j = b.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
        result.push({ type: "unchanged", text: a[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.push({ type: "added", text: b[j - 1] });
        j--;
      } else {
        result.push({ type: "removed", text: a[i - 1] });
        i--;
      }
    }

    result.reverse();
    return result;
  }

  /* ================================
     ツール定義レジストリ
     ================================ */

  var TOOLS = {
    "json-format": {
      name: "JSON整形",
      fn: jsonFormat,
      hasOptions: true,
      optionsHtml: '<label>インデント: <select data-option="indent"><option value="2" selected>2</option><option value="4">4</option></select></label>'
    },
    "json-minify": {
      name: "JSON圧縮",
      fn: jsonMinify,
      hasOptions: false
    },
    "base64-encode": {
      name: "Base64エンコード",
      fn: base64Encode,
      hasOptions: false
    },
    "base64-decode": {
      name: "Base64デコード",
      fn: base64Decode,
      hasOptions: false
    },
    "url-encode": {
      name: "URLエンコード",
      fn: urlEncode,
      hasOptions: false
    },
    "url-decode": {
      name: "URLデコード",
      fn: urlDecode,
      hasOptions: false
    },
    "jsonpath-query": {
      name: "JSONPath抽出",
      fn: jsonPathQuery,
      hasOptions: true,
      optionsHtml: '<label>パス: <input type="text" data-option="path" value="$" placeholder="$.store.book[0].title"></label>'
    },
    "diff-check": {
      name: "テキスト差分比較",
      fn: diffCheck,
      hasOptions: true,
      optionsHtml: '<label>比較テキスト: <textarea data-option="modified" rows="3" placeholder="比較対象テキスト"></textarea></label>'
    }
  };

  /* ================================
     プリセットパイプライン
     ================================ */

  var PRESETS = [
    {
      name: "JSON整形 → JSONPath抽出",
      steps: [
        { toolId: "json-format", options: { indent: 2 } },
        { toolId: "jsonpath-query", options: { path: "$" } }
      ]
    },
    {
      name: "Base64デコード → JSON整形",
      steps: [
        { toolId: "base64-decode", options: {} },
        { toolId: "json-format", options: { indent: 2 } }
      ]
    },
    {
      name: "JSON整形 → JSON圧縮 → Base64エンコード",
      steps: [
        { toolId: "json-format", options: { indent: 2 } },
        { toolId: "json-minify", options: {} },
        { toolId: "base64-encode", options: {} }
      ]
    },
    {
      name: "URLデコード → Base64デコード",
      steps: [
        { toolId: "url-decode", options: {} },
        { toolId: "base64-decode", options: {} }
      ]
    }
  ];

  /* ================================
     パイプライン永続化
     ================================ */

  var STORAGE_KEY = "devtoolbox-pipelines";

  function loadPipelines() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_e) {
      // ignore
    }
    return [];
  }

  function savePipelines(pipelines) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pipelines));
    } catch (_e) {
      // ignore
    }
  }

  function addPipeline(name, steps) {
    var pipelines = loadPipelines();
    pipelines.push({ name: name, steps: steps });
    savePipelines(pipelines);
    return pipelines;
  }

  function removePipeline(index) {
    var pipelines = loadPipelines();
    pipelines.splice(index, 1);
    savePipelines(pipelines);
    return pipelines;
  }

  /* ================================
     パイプライン実行エンジン
     ================================ */

  function runPipeline(steps, initialInput) {
    var currentOutput = initialInput;
    var results = [];

    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var tool = TOOLS[step.toolId];
      if (!tool) {
        throw new Error("ステップ " + (i + 1) + ": 不明なツール \"" + step.toolId + "\"");
      }

      try {
        currentOutput = tool.fn(currentOutput, step.options || {});
        results.push({
          stepIndex: i,
          toolId: step.toolId,
          toolName: tool.name,
          output: currentOutput,
          error: null
        });
      } catch (e) {
        results.push({
          stepIndex: i,
          toolId: step.toolId,
          toolName: tool.name,
          output: null,
          error: e.message
        });
        throw new Error("ステップ " + (i + 1) + " (" + tool.name + ") でエラー: " + e.message);
      }
    }

    return {
      finalOutput: currentOutput,
      results: results
    };
  }

  /* ================================
     グローバル公開
     ================================ */

  window.DevToolBox = Object.assign(window.DevToolBox || {}, {
    pipeline: {
      TOOLS: TOOLS,
      PRESETS: PRESETS,
      run: runPipeline,
      load: loadPipelines,
      save: savePipelines,
      add: addPipeline,
      remove: removePipeline
    }
  });
})();
