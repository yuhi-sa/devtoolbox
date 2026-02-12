"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var metaTitle = document.getElementById("meta-title");
    var metaDescription = document.getElementById("meta-description");
    var metaKeywords = document.getElementById("meta-keywords");
    var metaAuthor = document.getElementById("meta-author");
    var robotsIndex = document.getElementById("robots-index");
    var robotsFollow = document.getElementById("robots-follow");
    var robotsNoarchive = document.getElementById("robots-noarchive");
    var robotsNosnippet = document.getElementById("robots-nosnippet");

    var ogTitle = document.getElementById("og-title");
    var ogDescription = document.getElementById("og-description");
    var ogType = document.getElementById("og-type");
    var ogImage = document.getElementById("og-image");
    var ogUrl = document.getElementById("og-url");
    var ogSitename = document.getElementById("og-sitename");
    var ogLocale = document.getElementById("og-locale");

    var twCard = document.getElementById("tw-card");
    var twTitle = document.getElementById("tw-title");
    var twDescription = document.getElementById("tw-description");
    var twImage = document.getElementById("tw-image");
    var twSite = document.getElementById("tw-site");

    var metaOutput = document.getElementById("meta-output");
    var successEl = document.getElementById("meta-success");
    var btnGenerate = document.getElementById("btn-generate");
    var btnCopy = document.getElementById("btn-copy");
    var btnClear = document.getElementById("btn-clear");

    var titleCount = document.getElementById("title-count");
    var descCount = document.getElementById("desc-count");

    function escapeAttr(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function updateCharCount(input, countEl, limit) {
      var len = input.value.length;
      countEl.textContent = len + " / " + limit + "文字（推奨）";
      countEl.className = "char-count";
      if (len > limit) {
        countEl.classList.add("char-count--over");
      } else if (len > limit * 0.8) {
        countEl.classList.add("char-count--warn");
      }
    }

    metaTitle.addEventListener("input", function () {
      updateCharCount(metaTitle, titleCount, 60);
    });
    metaDescription.addEventListener("input", function () {
      updateCharCount(metaDescription, descCount, 160);
    });

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 3000);
    }

    function generateTags() {
      var lines = [];
      var title = metaTitle.value.trim();
      var desc = metaDescription.value.trim();
      var keywords = metaKeywords.value.trim();
      var author = metaAuthor.value.trim();

      // charset
      lines.push('<meta charset="UTF-8">');
      lines.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');

      // title
      if (title) {
        lines.push("<title>" + escapeAttr(title) + "</title>");
      }

      // description
      if (desc) {
        lines.push('<meta name="description" content="' + escapeAttr(desc) + '">');
      }

      // keywords
      if (keywords) {
        lines.push('<meta name="keywords" content="' + escapeAttr(keywords) + '">');
      }

      // author
      if (author) {
        lines.push('<meta name="author" content="' + escapeAttr(author) + '">');
      }

      // robots
      var robotsParts = [];
      robotsParts.push(robotsIndex.checked ? "index" : "noindex");
      robotsParts.push(robotsFollow.checked ? "follow" : "nofollow");
      if (robotsNoarchive.checked) robotsParts.push("noarchive");
      if (robotsNosnippet.checked) robotsParts.push("nosnippet");
      lines.push('<meta name="robots" content="' + robotsParts.join(", ") + '">');

      // Open Graph
      var ogTitleVal = ogTitle.value.trim() || title;
      var ogDescVal = ogDescription.value.trim() || desc;
      var ogTypeVal = ogType.value;
      var ogImageVal = ogImage.value.trim();
      var ogUrlVal = ogUrl.value.trim();
      var ogSitenameVal = ogSitename.value.trim();
      var ogLocaleVal = ogLocale.value.trim();

      lines.push("");
      lines.push("<!-- Open Graph / Facebook -->");
      if (ogTitleVal) lines.push('<meta property="og:title" content="' + escapeAttr(ogTitleVal) + '">');
      if (ogDescVal) lines.push('<meta property="og:description" content="' + escapeAttr(ogDescVal) + '">');
      lines.push('<meta property="og:type" content="' + escapeAttr(ogTypeVal) + '">');
      if (ogImageVal) lines.push('<meta property="og:image" content="' + escapeAttr(ogImageVal) + '">');
      if (ogUrlVal) lines.push('<meta property="og:url" content="' + escapeAttr(ogUrlVal) + '">');
      if (ogSitenameVal) lines.push('<meta property="og:site_name" content="' + escapeAttr(ogSitenameVal) + '">');
      if (ogLocaleVal) lines.push('<meta property="og:locale" content="' + escapeAttr(ogLocaleVal) + '">');

      // Twitter Card
      var twCardVal = twCard.value;
      var twTitleVal = twTitle.value.trim() || ogTitleVal;
      var twDescVal = twDescription.value.trim() || ogDescVal;
      var twImageVal = twImage.value.trim() || ogImageVal;
      var twSiteVal = twSite.value.trim();

      lines.push("");
      lines.push("<!-- Twitter Card -->");
      lines.push('<meta name="twitter:card" content="' + escapeAttr(twCardVal) + '">');
      if (twTitleVal) lines.push('<meta name="twitter:title" content="' + escapeAttr(twTitleVal) + '">');
      if (twDescVal) lines.push('<meta name="twitter:description" content="' + escapeAttr(twDescVal) + '">');
      if (twImageVal) lines.push('<meta name="twitter:image" content="' + escapeAttr(twImageVal) + '">');
      if (twSiteVal) lines.push('<meta name="twitter:site" content="' + escapeAttr(twSiteVal) + '">');

      return lines.join("\n");
    }

    btnGenerate.addEventListener("click", function () {
      metaOutput.value = generateTags();
      showSuccess("メタタグを生成しました。");
    });

    btnCopy.addEventListener("click", function () {
      var text = metaOutput.value;
      if (!text) {
        metaOutput.value = generateTags();
        text = metaOutput.value;
      }
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });

    btnClear.addEventListener("click", function () {
      var inputs = document.querySelectorAll(".form-section input[type='text'], .form-section textarea");
      inputs.forEach(function (el) { el.value = ""; });
      ogLocale.value = "ja_JP";
      robotsIndex.checked = true;
      robotsFollow.checked = true;
      robotsNoarchive.checked = false;
      robotsNosnippet.checked = false;
      ogType.selectedIndex = 0;
      twCard.selectedIndex = 1;
      metaOutput.value = "";
      successEl.hidden = true;
      updateCharCount(metaTitle, titleCount, 60);
      updateCharCount(metaDescription, descCount, 160);
    });

    // リアルタイム生成
    var allInputs = document.querySelectorAll(".form-section input, .form-section textarea, .form-section select");
    allInputs.forEach(function (el) {
      el.addEventListener("input", function () {
        metaOutput.value = generateTags();
      });
      el.addEventListener("change", function () {
        metaOutput.value = generateTags();
      });
    });
  });
})();
