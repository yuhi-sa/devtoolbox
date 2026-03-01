"use strict";

(function () {
  var STORAGE_KEY = "devtoolbox-lang";
  var lang = document.documentElement.lang || "ja";
  var basePath = "/devtoolbox/";

  function getAlternateUrl() {
    var path = window.location.pathname;

    if (lang === "ja") {
      // ja → en: insert /en/ after /devtoolbox/
      if (path === basePath || path === basePath + "index.html") {
        return basePath + "en/";
      }
      // about.html, privacy.html, terms.html
      var staticMatch = path.match(/\/devtoolbox\/(about|privacy|terms)\.html$/);
      if (staticMatch) {
        return basePath + "en/" + staticMatch[1] + ".html";
      }
      // tools/slug/
      var toolMatch = path.match(/\/devtoolbox\/tools\/([^/]+)\/?$/);
      if (toolMatch) {
        return basePath + "en/tools/" + toolMatch[1] + "/";
      }
    } else {
      // en → ja: remove /en/
      if (path === basePath + "en/" || path === basePath + "en/index.html") {
        return basePath;
      }
      var staticMatchEn = path.match(/\/devtoolbox\/en\/(about|privacy|terms)\.html$/);
      if (staticMatchEn) {
        return basePath + staticMatchEn[1] + ".html";
      }
      var toolMatchEn = path.match(/\/devtoolbox\/en\/tools\/([^/]+)\/?$/);
      if (toolMatchEn) {
        return basePath + "tools/" + toolMatchEn[1] + "/";
      }
    }

    // Fallback
    return lang === "ja" ? basePath + "en/" : basePath;
  }

  function createSwitcher() {
    var headerRight = document.querySelector(".header__right");
    if (!headerRight) return;

    var themeToggle = document.getElementById("theme-toggle");
    if (!themeToggle) return;

    var btn = document.createElement("a");
    btn.href = getAlternateUrl();
    btn.className = "lang-switch";
    btn.setAttribute("aria-label", lang === "ja" ? "Switch to English" : "日本語に切替");
    btn.textContent = lang === "ja" ? "EN" : "JP";

    btn.addEventListener("click", function () {
      try {
        localStorage.setItem(STORAGE_KEY, lang === "ja" ? "en" : "ja");
      } catch (e) {
        // ignore
      }
    });

    headerRight.insertBefore(btn, themeToggle);
  }

  document.addEventListener("DOMContentLoaded", createSwitcher);
})();
