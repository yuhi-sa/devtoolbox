"use strict";

(function () {
  /* ================================
     アニメーションカウンター
     ================================ */
  function animateCounter() {
    var el = document.querySelector(".tool-count strong");
    if (!el) return;

    var target = parseInt(el.textContent, 10);
    if (isNaN(target) || target <= 0) return;

    var duration = 1200; // ms
    var startTime = null;
    el.textContent = "0";

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutQuart
      var eased = 1 - Math.pow(1 - progress, 4);
      var current = Math.round(eased * target);
      el.textContent = String(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    // Use IntersectionObserver to trigger when visible
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            requestAnimationFrame(step);
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(el);
    } else {
      requestAnimationFrame(step);
    }
  }

  /* ================================
     キーボードショートカット
     ================================ */
  function initKeyboardShortcuts() {
    var searchInput = document.getElementById("tool-search");
    if (!searchInput) return;

    // Show shortcut hint
    var searchBox = searchInput.closest(".search-box");
    if (searchBox && !searchBox.querySelector(".search-box__shortcut")) {
      var hint = document.createElement("span");
      hint.className = "search-box__shortcut";
      hint.textContent = "/";
      searchBox.appendChild(hint);

      searchInput.addEventListener("focus", function () {
        hint.style.display = "none";
      });
      searchInput.addEventListener("blur", function () {
        var clearBtn = document.getElementById("search-clear");
        var hasValue = searchInput.value.trim().length > 0;
        hint.style.display = hasValue ? "none" : "";
      });
      // Hide hint if search already has a value
      if (searchInput.value.trim().length > 0) {
        hint.style.display = "none";
      }
    }

    document.addEventListener("keydown", function (e) {
      // Don't trigger shortcuts when typing in inputs
      var tag = (e.target.tagName || "").toLowerCase();
      var isInput = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        searchInput.focus();
      }

      if (e.key === "Escape" && tag === "input" && e.target === searchInput) {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
        searchInput.blur();
      }
    });
  }

  /* ================================
     スクロールトップボタン
     ================================ */
  function initScrollToTop() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scroll-top-btn";
    var t = window.DevToolBox && window.DevToolBox.t;
    btn.setAttribute("aria-label", t ? t("scrollToTop") : "ページ上部に戻る");
    btn.innerHTML = '<svg class="scroll-top-btn__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>';
    document.body.appendChild(btn);

    var scrollThreshold = 400;
    var ticking = false;

    function checkScroll() {
      var show = window.scrollY > scrollThreshold;
      btn.classList.toggle("is-visible", show);
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(checkScroll);
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ================================
     スクロールフェードイン
     ================================ */
  function initScrollReveal() {
    if (!("IntersectionObserver" in window)) return;

    var targets = document.querySelectorAll(".category");
    targets.forEach(function (el) {
      el.classList.add("fade-in");
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in--visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ================================
     人気ツールバッジ
     ================================ */
  function initPopularBadges() {
    // Count visits from recent-tools history
    var visitCounts = {};
    try {
      var history = JSON.parse(localStorage.getItem("devtoolbox-recent-history") || "{}");
      visitCounts = history;
    } catch (e) {
      return;
    }

    if (Object.keys(visitCounts).length === 0) return;

    // Find the top 3 most visited tools
    var sorted = Object.keys(visitCounts).sort(function (a, b) {
      return visitCounts[b] - visitCounts[a];
    });

    // Only badge tools with at least 3 visits
    var popular = sorted.filter(function (slug) {
      return visitCounts[slug] >= 3;
    }).slice(0, 3);

    if (popular.length === 0) return;

    popular.forEach(function (slug) {
      var cards = document.querySelectorAll('.tool-card[data-slug="' + slug + '"]');
      cards.forEach(function (card) {
        if (card.querySelector(".tool-card__badge")) return;
        var badge = document.createElement("span");
        badge.className = "tool-card__badge";
        var t2 = window.DevToolBox && window.DevToolBox.t;
        badge.textContent = t2 ? t2("popular") : "\u4EBA\u6C17";
        card.appendChild(badge);
      });
    });
  }

  /* ================================
     初期化
     ================================ */
  document.addEventListener("DOMContentLoaded", function () {
    // Only run on homepage
    if (!document.querySelector(".hero")) return;

    animateCounter();
    initKeyboardShortcuts();
    initScrollToTop();
    initScrollReveal();
    // Run after favorites.js sets data-slug attributes
    setTimeout(initPopularBadges, 0);
  });
})();
