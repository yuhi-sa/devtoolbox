"use strict";

(function () {
  var STORAGE_KEY = "devtoolbox-usage";
  var MAX_DISPLAY = 8;

  var DEFAULT_POPULAR = [
    { slug: "json-formatter", name: "JSON整形・検証", href: "tools/json-formatter/" },
    { slug: "base64", name: "Base64エンコード/デコード", href: "tools/base64/" },
    { slug: "regex-tester", name: "正規表現テスター", href: "tools/regex-tester/" },
    { slug: "hash-generator", name: "ハッシュ生成", href: "tools/hash-generator/" },
    { slug: "char-counter", name: "文字数カウンター", href: "tools/char-counter/" },
    { slug: "url-encode", name: "URLエンコード/デコード", href: "tools/url-encode/" },
    { slug: "timestamp", name: "Unixタイムスタンプ変換", href: "tools/timestamp/" },
    { slug: "color-converter", name: "カラーコンバーター", href: "tools/color-converter/" }
  ];

  function getUsageData() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function getToolNameFromCards(slug) {
    var card = document.querySelector('.tool-card[href="tools/' + slug + '/"]');
    if (card) {
      var nameEl = card.querySelector(".tool-card__name");
      if (nameEl) {
        return nameEl.textContent.replace(/おすすめ/, "").trim();
      }
    }
    return null;
  }

  function getPopularTools() {
    var usage = getUsageData();
    var slugs = Object.keys(usage);

    if (slugs.length === 0) {
      return DEFAULT_POPULAR;
    }

    // Sort by usage count descending
    slugs.sort(function (a, b) { return usage[b] - usage[a]; });

    var top = slugs.slice(0, MAX_DISPLAY);
    var tools = [];

    top.forEach(function (slug) {
      var name = getToolNameFromCards(slug);
      if (!name) {
        // Try default list for name
        var def = DEFAULT_POPULAR.filter(function (d) { return d.slug === slug; })[0];
        name = def ? def.name : slug;
      }
      tools.push({ slug: slug, name: name, href: "tools/" + slug + "/" });
    });

    return tools;
  }

  function renderPopularSection() {
    // Only render on homepage
    if (!document.querySelector(".category")) return;

    var tools = getPopularTools();
    if (tools.length === 0) return;

    var section = document.createElement("section");
    section.className = "popular-tools";
    section.id = "popular-tools-section";

    var t = window.DevToolBox && window.DevToolBox.t;
    var html = '<h2 class="popular-tools__title">' + (t ? t("popularTools") : "人気ツール") + '</h2>';
    html += '<div class="popular-tools__grid">';

    tools.forEach(function (tool) {
      html += '<a href="' + tool.href + '" class="popular-tools__card">';
      html += '<svg class="popular-tools__card-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">';
      html += '<path d="M8 1l2.2 4.5L15 6.3l-3.5 3.4.8 4.8L8 12.3 3.7 14.5l.8-4.8L1 6.3l4.8-.8L8 1z"/>';
      html += '</svg>';
      html += '<span class="popular-tools__card-name">' + tool.name + '</span>';
      html += '</a>';
    });

    html += '</div>';
    section.innerHTML = html;

    // Insert after #recent-tools-section
    var recentSection = document.getElementById("recent-tools-section");
    if (recentSection) {
      recentSection.parentNode.insertBefore(section, recentSection.nextSibling);
    } else {
      // Fallback: insert before first category
      var firstCategory = document.querySelector(".category");
      if (firstCategory) {
        firstCategory.parentNode.insertBefore(section, firstCategory);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderPopularSection();
  });
})();
