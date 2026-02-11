"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var modeEl = document.getElementById("lorem-mode");
    var countEl = document.getElementById("lorem-count");
    var startCheckEl = document.getElementById("lorem-start");
    var japaneseCheckEl = document.getElementById("lorem-japanese");
    var outputEl = document.getElementById("lorem-output");
    var errorEl = document.getElementById("lorem-error");
    var successEl = document.getElementById("lorem-success");
    var wordCountEl = document.getElementById("lorem-word-count");
    var btnGenerate = document.getElementById("btn-generate");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");

    var LOREM_WORDS = [
      "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
      "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
      "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
      "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
      "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
      "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
      "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
      "deserunt", "mollit", "anim", "id", "est", "laborum", "semper", "risus",
      "viverra", "maecenas", "accumsan", "lacus", "vel", "facilisis", "volutpat",
      "dictum", "pulvinar", "mattis", "nunc", "faucibus", "interdum", "posuere",
      "porta", "ac", "auctor", "augue", "mauris", "neque", "gravida", "pellentesque",
      "dignissim", "eros", "donec", "pretium", "vulputate", "sapien", "nec",
      "sagittis", "aliquam", "malesuada", "bibendum", "arcu", "vitae", "elementum",
      "curabitur", "tempus", "urna", "condimentum", "feugiat", "nisl", "tincidunt",
      "eget", "nullam", "vehicula", "diam", "sociis", "natoque", "penatibus",
      "magnis", "dis", "parturient", "montes", "nascetur", "ridiculus", "mus",
      "tristique", "senectus", "netus", "fames", "turpis", "egestas", "pharetra",
      "convallis", "massa", "placerat", "dapibus", "ultricies", "orci", "integer",
      "felis", "blandit", "tortor", "scelerisque", "fermentum", "leo"
    ];

    var LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

    var JAPANESE_WORDS = [
      "私たち", "技術", "開発", "システム", "情報", "社会", "サービス", "提供",
      "実現", "可能", "環境", "設計", "構築", "運用", "管理", "活用",
      "最適化", "効率", "品質", "向上", "目標", "達成", "課題", "解決",
      "プロジェクト", "チーム", "メンバー", "協力", "推進", "計画",
      "データ", "分析", "結果", "報告", "確認", "対応", "実施", "検討",
      "プログラム", "アプリケーション", "インターフェース", "ユーザー",
      "コンテンツ", "デザイン", "レイアウト", "機能", "要件", "仕様",
      "テスト", "評価", "改善", "更新", "保守", "安全", "信頼",
      "革新", "戦略", "方針", "基盤", "基本", "重要", "必要",
      "組織", "企業", "業務", "経営", "市場", "顧客", "価値",
      "成長", "変革", "将来", "展望", "ビジョン", "使命",
      "研究", "調査", "知識", "経験", "専門", "能力", "人材",
      "連携", "統合", "展開", "導入", "適用", "手法", "方法"
    ];

    var JAPANESE_PARTICLES = ["は", "が", "を", "に", "で", "と", "の", "から", "まで", "へ"];
    var JAPANESE_VERBS = [
      "します", "です", "あります", "なります", "できます", "行います",
      "考えます", "進めます", "取り組みます", "目指します", "図ります",
      "求められます", "期待されます", "注目されています", "重要です",
      "必要です", "不可欠です", "欠かせません"
    ];

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pickRandom(arr) {
      return arr[randomInt(0, arr.length - 1)];
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Latin Lorem Ipsum generation
    function generateLatinWords(count) {
      var words = [];
      for (var i = 0; i < count; i++) {
        words.push(pickRandom(LOREM_WORDS));
      }
      return words;
    }

    function generateLatinSentence() {
      var wordCount = randomInt(6, 15);
      var words = generateLatinWords(wordCount);
      words[0] = capitalize(words[0]);
      return words.join(" ") + ".";
    }

    function generateLatinParagraph() {
      var sentenceCount = randomInt(4, 8);
      var sentences = [];
      for (var i = 0; i < sentenceCount; i++) {
        sentences.push(generateLatinSentence());
      }
      return sentences.join(" ");
    }

    // Japanese dummy text generation
    function generateJapaneseSentence() {
      var partCount = randomInt(2, 4);
      var parts = [];
      for (var i = 0; i < partCount; i++) {
        parts.push(pickRandom(JAPANESE_WORDS) + pickRandom(JAPANESE_PARTICLES));
      }
      return parts.join("") + pickRandom(JAPANESE_WORDS) + pickRandom(JAPANESE_PARTICLES) + pickRandom(JAPANESE_VERBS) + "。";
    }

    function generateJapaneseParagraph() {
      var sentenceCount = randomInt(3, 6);
      var sentences = [];
      for (var i = 0; i < sentenceCount; i++) {
        sentences.push(generateJapaneseSentence());
      }
      return sentences.join("");
    }

    function generateJapaneseWords(count) {
      var words = [];
      for (var i = 0; i < count; i++) {
        words.push(pickRandom(JAPANESE_WORDS));
      }
      return words;
    }

    var JAPANESE_START = "私たちは技術の革新を通じて、社会の課題解決に取り組みます。";

    function generate() {
      var mode = modeEl.value;
      var count = parseInt(countEl.value, 10);
      var useStart = startCheckEl.checked;
      var useJapanese = japaneseCheckEl.checked;

      if (isNaN(count) || count < 1 || count > 100) {
        return { error: "数量は1〜100の範囲で入力してください。" };
      }

      var result = "";

      if (mode === "words") {
        var words;
        if (useJapanese) {
          words = generateJapaneseWords(count);
          if (useStart && count >= 1) {
            words[0] = "私たち";
          }
          result = words.join("、");
        } else {
          words = generateLatinWords(count);
          if (useStart && count >= 2) {
            words[0] = "lorem";
            words[1] = "ipsum";
          } else if (useStart && count === 1) {
            words[0] = "lorem";
          }
          result = words.join(" ");
        }
      } else if (mode === "sentences") {
        var sentences = [];
        for (var s = 0; s < count; s++) {
          if (useJapanese) {
            sentences.push(generateJapaneseSentence());
          } else {
            sentences.push(generateLatinSentence());
          }
        }
        if (useStart) {
          sentences[0] = useJapanese ? JAPANESE_START : LOREM_START;
        }
        result = useJapanese ? sentences.join("") : sentences.join(" ");
      } else {
        // paragraphs
        var paragraphs = [];
        for (var p = 0; p < count; p++) {
          if (useJapanese) {
            paragraphs.push(generateJapaneseParagraph());
          } else {
            paragraphs.push(generateLatinParagraph());
          }
        }
        if (useStart) {
          var first = paragraphs[0];
          if (useJapanese) {
            paragraphs[0] = JAPANESE_START + first;
          } else {
            paragraphs[0] = LOREM_START + " " + first;
          }
        }
        result = paragraphs.join("\n\n");
      }

      return { text: result };
    }

    function countWords(text, isJapanese) {
      if (!text) return 0;
      if (isJapanese) {
        // Count Japanese characters (excluding punctuation and spaces)
        return text.replace(/[。、\s\n]/g, "").length;
      }
      return text.trim().split(/\s+/).length;
    }

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

    btnGenerate.addEventListener("click", function () {
      clearMessages();
      var result = generate();

      if (result.error) {
        showError(result.error);
        outputEl.value = "";
        wordCountEl.textContent = "";
        return;
      }

      outputEl.value = result.text;
      var isJapanese = japaneseCheckEl.checked;
      var wc = countWords(result.text, isJapanese);
      wordCountEl.textContent = isJapanese
        ? "文字数: " + wc
        : "単語数: " + wc;
      showSuccess("テキストを生成しました。");
    });

    btnClear.addEventListener("click", function () {
      outputEl.value = "";
      wordCountEl.textContent = "";
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
