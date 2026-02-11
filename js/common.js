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
     初期化
     ================================ */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initHamburgerMenu();
    initCopyButtons();
  });
})();
