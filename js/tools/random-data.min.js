"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var outputEl = document.getElementById("random-data-output");
    var successEl = document.getElementById("random-data-success");
    var errorEl = document.getElementById("random-data-error");
    var btnGenerate = document.getElementById("btn-generate");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");
    var btnDownload = document.getElementById("btn-download");
    var recordCountEl = document.getElementById("record-count");
    var outputFormatEl = document.getElementById("output-format");

    // Japanese data pools
    var familyNames = [
      "田中", "佐藤", "鈴木", "高橋", "渡辺", "伊藤", "山本", "中村", "小林", "加藤",
      "吉田", "山田", "松本", "井上", "木村", "林", "斎藤", "清水", "山口", "阿部",
      "池田", "橋本", "森", "石川", "前田", "藤田", "後藤", "岡田", "長谷川", "村上"
    ];
    var firstNames = [
      "太郎", "花子", "翔太", "美咲", "大輔", "由美", "健太", "さくら", "直樹", "愛",
      "拓也", "真由美", "隆", "恵", "誠", "裕子", "浩", "明美", "和也", "陽子",
      "達也", "麻衣", "修", "彩", "亮", "瞳", "剛", "舞", "啓介", "遥"
    ];
    var familyNamesRomaji = [
      "tanaka", "sato", "suzuki", "takahashi", "watanabe", "ito", "yamamoto", "nakamura", "kobayashi", "kato",
      "yoshida", "yamada", "matsumoto", "inoue", "kimura", "hayashi", "saito", "shimizu", "yamaguchi", "abe",
      "ikeda", "hashimoto", "mori", "ishikawa", "maeda", "fujita", "goto", "okada", "hasegawa", "murakami"
    ];
    var firstNamesRomaji = [
      "taro", "hanako", "shota", "misaki", "daisuke", "yumi", "kenta", "sakura", "naoki", "ai",
      "takuya", "mayumi", "takashi", "megumi", "makoto", "yuko", "hiroshi", "akemi", "kazuya", "yoko",
      "tatsuya", "mai", "osamu", "aya", "ryo", "hitomi", "tsuyoshi", "mai", "keisuke", "haruka"
    ];
    var prefectures = [
      "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
      "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
      "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
      "岐阜県", "静岡県", "愛知県", "三重県",
      "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
      "鳥取県", "島根県", "岡山県", "広島県", "山口県",
      "徳島県", "香川県", "愛媛県", "高知県",
      "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
    ];
    var cities = [
      "中央区", "港区", "新宿区", "渋谷区", "千代田区", "品川区", "目黒区",
      "横浜市", "川崎市", "さいたま市", "千葉市", "名古屋市", "大阪市",
      "神戸市", "京都市", "福岡市", "札幌市", "仙台市", "広島市", "北九州市"
    ];
    var towns = [
      "本町", "中町", "東町", "西町", "南町", "北町", "旭町", "緑町", "栄町", "幸町",
      "大手町", "丸の内", "八重洲", "日本橋", "銀座", "新橋", "虎ノ門", "赤坂", "六本木", "麻布"
    ];
    var companyPrefixes = [
      "株式会社", "有限会社", "合同会社"
    ];
    var companyWords = [
      "テクノロジー", "ソリューションズ", "システムズ", "デジタル", "クリエイティブ",
      "イノベーション", "グローバル", "ネットワーク", "サービス", "コンサルティング",
      "エンジニアリング", "デザイン", "マーケティング", "プランニング", "コミュニケーションズ",
      "ラボ", "ワークス", "パートナーズ", "エージェント", "プロダクツ"
    ];
    var companyNames2 = [
      "東京", "大阪", "日本", "アジア", "未来", "新日本", "第一", "太平洋", "富士", "桜"
    ];
    var domains = [
      "example.com", "test.jp", "sample.co.jp", "demo.ne.jp", "mail.example.com"
    ];
    var tlds = ["com", "jp", "co.jp", "net", "org", "io"];
    var urlPaths = [
      "/about", "/contact", "/products", "/services", "/blog", "/news",
      "/help", "/faq", "/terms", "/privacy", "/api/v1", "/dashboard"
    ];

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function padZero(n, len) {
      var s = String(n);
      while (s.length < len) s = "0" + s;
      return s;
    }

    function generateUUID() {
      var hex = "0123456789abcdef";
      var parts = [8, 4, 4, 4, 12];
      var result = [];
      for (var i = 0; i < parts.length; i++) {
        var segment = "";
        for (var j = 0; j < parts[i]; j++) {
          segment += hex[Math.floor(Math.random() * 16)];
        }
        result.push(segment);
      }
      // Set version 4
      var seg2 = result[2];
      result[2] = "4" + seg2.substring(1);
      // Set variant
      var seg3 = result[3];
      var variantChars = "89ab";
      result[3] = variantChars[Math.floor(Math.random() * 4)] + seg3.substring(1);
      return result.join("-");
    }

    function generateName() {
      var fi = Math.floor(Math.random() * familyNames.length);
      var gi = Math.floor(Math.random() * firstNames.length);
      return familyNames[fi] + " " + firstNames[gi];
    }

    function generateEmail() {
      var fi = Math.floor(Math.random() * familyNamesRomaji.length);
      var gi = Math.floor(Math.random() * firstNamesRomaji.length);
      var sep = pick([".", "_", ""]);
      var num = randInt(1, 999);
      return firstNamesRomaji[gi] + sep + familyNamesRomaji[fi] + num + "@" + pick(domains);
    }

    function generatePhone() {
      var prefix = pick(["090", "080", "070"]);
      return prefix + "-" + padZero(randInt(1000, 9999), 4) + "-" + padZero(randInt(1000, 9999), 4);
    }

    function generateAddress() {
      return pick(prefectures) + pick(cities) + pick(towns) + randInt(1, 9) + "-" + randInt(1, 30) + "-" + randInt(1, 15);
    }

    function generateCompany() {
      return pick(companyPrefixes) + pick(companyNames2) + pick(companyWords);
    }

    function generateDate() {
      var year = randInt(2000, 2026);
      var month = randInt(1, 12);
      var day = randInt(1, 28);
      return year + "-" + padZero(month, 2) + "-" + padZero(day, 2);
    }

    function generateNumber() {
      return randInt(0, 100000);
    }

    function generateIP() {
      return randInt(1, 255) + "." + randInt(0, 255) + "." + randInt(0, 255) + "." + randInt(1, 254);
    }

    function generateURL() {
      var protocol = pick(["https://", "http://"]);
      var sub = pick(["www.", "", "app.", "api."]);
      var domain = pick(familyNamesRomaji) + pick(["-service", "-app", "-web", "-site", ""]);
      return protocol + sub + domain + "." + pick(tlds) + pick(urlPaths);
    }

    function generateBoolean() {
      return Math.random() < 0.5;
    }

    var generators = {
      name: generateName,
      email: generateEmail,
      phone: generatePhone,
      address: generateAddress,
      company: generateCompany,
      date: generateDate,
      number: generateNumber,
      uuid: generateUUID,
      ip: generateIP,
      url: generateURL,
      boolean: generateBoolean
    };

    var fieldLabels = {
      name: "名前",
      email: "メールアドレス",
      phone: "電話番号",
      address: "住所",
      company: "会社名",
      date: "日付",
      number: "数値",
      uuid: "UUID",
      ip: "IPアドレス",
      url: "URL",
      boolean: "Boolean"
    };

    function getSelectedFields() {
      var checkboxes = document.querySelectorAll('input[name="field"]:checked');
      var fields = [];
      for (var i = 0; i < checkboxes.length; i++) {
        fields.push(checkboxes[i].value);
      }
      return fields;
    }

    function generateRecords(fields, count) {
      var records = [];
      for (var i = 0; i < count; i++) {
        var record = {};
        for (var j = 0; j < fields.length; j++) {
          var field = fields[j];
          record[field] = generators[field]();
        }
        records.push(record);
      }
      return records;
    }

    function escapeCSV(val) {
      var s = String(val);
      if (s.indexOf(",") !== -1 || s.indexOf('"') !== -1 || s.indexOf("\n") !== -1) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    }

    function escapeTSV(val) {
      var s = String(val);
      return s.replace(/\t/g, " ").replace(/\n/g, " ");
    }

    function escapeSQL(val) {
      if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
      if (typeof val === "number") return String(val);
      return "'" + String(val).replace(/'/g, "''") + "'";
    }

    function formatJSON(records) {
      return JSON.stringify(records, null, 2);
    }

    function formatCSV(records, fields) {
      var lines = [];
      var header = [];
      for (var i = 0; i < fields.length; i++) {
        header.push(escapeCSV(fields[i]));
      }
      lines.push(header.join(","));
      for (var r = 0; r < records.length; r++) {
        var row = [];
        for (var f = 0; f < fields.length; f++) {
          row.push(escapeCSV(records[r][fields[f]]));
        }
        lines.push(row.join(","));
      }
      return lines.join("\n");
    }

    function formatTSV(records, fields) {
      var lines = [];
      var header = [];
      for (var i = 0; i < fields.length; i++) {
        header.push(escapeTSV(fields[i]));
      }
      lines.push(header.join("\t"));
      for (var r = 0; r < records.length; r++) {
        var row = [];
        for (var f = 0; f < fields.length; f++) {
          row.push(escapeTSV(records[r][fields[f]]));
        }
        lines.push(row.join("\t"));
      }
      return lines.join("\n");
    }

    function formatSQL(records, fields) {
      var tableName = "test_data";
      var lines = [];
      for (var r = 0; r < records.length; r++) {
        var values = [];
        for (var f = 0; f < fields.length; f++) {
          values.push(escapeSQL(records[r][fields[f]]));
        }
        lines.push("INSERT INTO " + tableName + " (" + fields.join(", ") + ") VALUES (" + values.join(", ") + ");");
      }
      return lines.join("\n");
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

    function getFileExtension(format) {
      if (format === "json") return "json";
      if (format === "csv") return "csv";
      if (format === "tsv") return "tsv";
      if (format === "sql") return "sql";
      return "txt";
    }

    function getMimeType(format) {
      if (format === "json") return "application/json";
      if (format === "csv") return "text/csv";
      if (format === "tsv") return "text/tab-separated-values";
      if (format === "sql") return "application/sql";
      return "text/plain";
    }

    btnGenerate.addEventListener("click", function () {
      clearMessages();
      var fields = getSelectedFields();
      if (fields.length === 0) {
        showError("少なくとも1つのフィールドを選択してください。");
        return;
      }
      var count = parseInt(recordCountEl.value, 10);
      if (isNaN(count) || count < 1) count = 1;
      if (count > 1000) count = 1000;
      recordCountEl.value = count;

      var records = generateRecords(fields, count);
      var format = outputFormatEl.value;
      var output = "";

      if (format === "json") {
        output = formatJSON(records);
      } else if (format === "csv") {
        output = formatCSV(records, fields);
      } else if (format === "tsv") {
        output = formatTSV(records, fields);
      } else if (format === "sql") {
        output = formatSQL(records, fields);
      }

      outputEl.value = output;
      showSuccess(count + "件のテストデータを生成しました。");
    });

    btnClear.addEventListener("click", function () {
      outputEl.value = "";
      clearMessages();
    });

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });

    btnDownload.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      var format = outputFormatEl.value;
      var ext = getFileExtension(format);
      var mime = getMimeType(format);
      var blob = new Blob([text], { type: mime + ";charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "test_data." + ext;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showSuccess("ダウンロードを開始しました。");
    });
  });
})();
