"use strict";

(function () {
  var STORAGE_KEY = "devtoolbox-recent";
  var HISTORY_KEY = "devtoolbox-recent-history";
  var MAX_RECENT = 8;

  function getRecent() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveRecent(recent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    } catch (e) {
      // localStorage unavailable
    }
  }

  /**
   * Record a tool visit. Call on tool pages.
   * entry = { slug: "json-formatter", name: "JSON整形・検証", href: "tools/json-formatter/" }
   */
  function recordVisit(entry) {
    var recent = getRecent();
    // Remove existing entry for same slug
    recent = recent.filter(function (r) { return r.slug !== entry.slug; });
    // Add to front
    recent.unshift(entry);
    // Limit
    if (recent.length > MAX_RECENT) {
      recent = recent.slice(0, MAX_RECENT);
    }
    saveRecent(recent);
  }

  /**
   * Detect if we're on a tool page and record the visit.
   * Tool pages have URLs matching /tools/<slug>/
   */
  function detectAndRecordToolPage() {
    var path = window.location.pathname;
    var match = path.match(/\/tools\/([^\/]+)\/?$/);
    if (!match) return;

    var slug = match[1];
    // Get tool name from page title or h1
    var titleEl = document.querySelector(".tool-container h1") || document.querySelector("h1");
    var name = "";
    if (titleEl) {
      name = titleEl.textContent.trim();
    } else {
      // Fallback: extract from <title> "ToolName - DevToolBox"
      var pageTitle = document.title || "";
      name = pageTitle.split(" - ")[0].replace(/（.*?）/, "").trim();
    }

    // Build relative href from root
    var href = "tools/" + slug + "/";

    recordVisit({ slug: slug, name: name, href: href });

    // Also increment visit count for popularity tracking
    try {
      var history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "{}");
      history[slug] = (history[slug] || 0) + 1;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      // ignore
    }
  }

  /**
   * Render recent tools section on homepage.
   */
  function renderRecentSection() {
    var recent = getRecent();
    if (recent.length === 0) return;

    // Only render on homepage
    if (!document.querySelector(".category")) return;

    var section = document.createElement("section");
    section.className = "recent-tools";
    section.id = "recent-tools-section";

    var t = window.DevToolBox && window.DevToolBox.t;
    var html = '<h2 class="recent-tools__title">' + (t ? t("recentTools") : "最近使ったツール") + '</h2>';
    html += '<div class="recent-tools__grid">';

    recent.forEach(function (tool) {
      html += '<a href="' + tool.href + '" class="recent-tools__item">';
      html += '<svg class="recent-tools__item-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">';
      html += '<path d="M4 2l8 6-8 6V2z"/>';
      html += '</svg>';
      html += '<span>' + tool.name + '</span>';
      html += '</a>';
    });

    html += '</div>';
    section.innerHTML = html;

    // Insert before favorites section or first category
    var target = document.getElementById("favorites-section") || document.querySelector(".category");
    if (target) {
      target.parentNode.insertBefore(section, target);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // On tool pages, record the visit
    detectAndRecordToolPage();

    // On homepage, render the recent section
    renderRecentSection();
  });
})();
