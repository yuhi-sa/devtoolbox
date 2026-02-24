"use strict";

(function () {
  /* ================================
     ダークモード切替
     ================================ */
  const THEME_KEY = "devtoolbox-theme";

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function initTheme() {
    const theme = getPreferredTheme();
    applyTheme(theme);

    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme");
      const next =
        current === "dark" || (!current && getPreferredTheme() === "dark")
          ? "light"
          : "dark";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ================================
     モバイルハンバーガーメニュー
     ================================ */
  function initHamburgerMenu() {
    const btn = document.getElementById("hamburger");
    const nav = document.getElementById("mobile-nav");
    if (!btn || !nav) return;

    btn.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      btn.classList.toggle("is-active", isOpen);
      btn.setAttribute("aria-expanded", String(isOpen));
    });

    // メニュー内リンクをクリックしたら閉じる
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        btn.classList.remove("is-active");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ================================
     コピーボタン
     ================================ */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // フォールバック
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {
      // ignore
    }
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function initCopyButtons() {
    document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-copy-target");
        var target = document.getElementById(targetId);
        if (!target) return;
        var text = target.value !== undefined ? target.value : target.textContent;
        copyToClipboard(text).then(function () {
          showFeedback("コピーしました", "success");
        });
      });
    });
  }

  /* ================================
     フィードバックメッセージ
     ================================ */
  var feedbackTimer = null;

  function showFeedback(message, type) {
    type = type || "success";
    var el = document.getElementById("feedback");
    if (!el) {
      el = document.createElement("div");
      el.id = "feedback";
      el.className = "feedback";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }

    el.textContent = message;
    el.className = "feedback feedback--" + type;

    // 表示
    requestAnimationFrame(function () {
      el.classList.add("is-visible");
    });

    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(function () {
      el.classList.remove("is-visible");
    }, 2000);
  }

  // グローバルに公開（ツール固有JSから利用）
  window.DevToolBox = {
    copyToClipboard: copyToClipboard,
    showFeedback: showFeedback,
  };

  /* ================================
     シェアボタン
     ================================ */
  function initShareButtons() {
    document.querySelectorAll("[data-share]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var type = btn.getAttribute("data-share");
        var url = encodeURIComponent(window.location.href);
        var title = encodeURIComponent(document.title);
        var shareUrl;

        switch (type) {
          case "twitter":
            shareUrl = "https://twitter.com/intent/tweet?url=" + url + "&text=" + title;
            break;
          case "line":
            shareUrl = "https://social-plugins.line.me/lineit/share?url=" + url;
            break;
          case "copy":
            copyToClipboard(window.location.href).then(function () {
              showFeedback("リンクをコピーしました", "success");
            });
            return;
        }

        if (shareUrl) {
          window.open(shareUrl, "_blank", "width=600,height=400,noopener,noreferrer");
        }
      });
    });
  }

  /* ================================
     遅延読み込み（IntersectionObserver）
     ================================ */
  function initLazyLoad() {
    if (!("IntersectionObserver" in window)) return;

    var categories = document.querySelectorAll(".category");
    if (categories.length < 3) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("category--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );

    // Skip the first 2 categories (above the fold), observe the rest
    for (var i = 2; i < categories.length; i++) {
      categories[i].classList.add("category--lazy");
      observer.observe(categories[i]);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initHamburgerMenu();
    initCopyButtons();
    initShareButtons();
    initLazyLoad();
  });
})();
