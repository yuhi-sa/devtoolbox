"use strict";

(function () {
  var AD_CLIENT = "ca-pub-9558545098866170";

  // TODO: Replace these placeholder slot IDs with real ad unit IDs from the
  // AdSense dashboard (numeric strings like "1234567890"). Using placeholder
  // values will cause ads to render as auto-sized units via AdSense auto ads,
  // but explicit slot IDs are required for per-unit reporting and optimization.
  var AD_SLOTS = {
    header: "",
    footer: "",
    inContent: "",
    sidebar: "",
    anchor: "",
    inArticle: ""
  };

  /* ================================
     ユーティリティ
     ================================ */

  /**
   * ins要素を生成してコンテナに追加し、adsbygoogle.push()する
   * @param {HTMLElement} container - 広告を挿入するコンテナ要素
   * @param {object} opts - data属性のオプション
   */
  function createAdUnit(container, opts) {
    if (!container) return;
    // 既に広告が初期化されている場合はスキップ
    var existing = container.querySelector("ins.adsbygoogle");
    if (existing && existing.getAttribute("data-adsbygoogle-status")) return;

    // 既存のins要素があれば削除して再生成
    if (existing) existing.remove();

    var ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", AD_CLIENT);

    if (opts.slot) ins.setAttribute("data-ad-slot", opts.slot);
    if (opts.format) ins.setAttribute("data-ad-format", opts.format);
    if (opts.fullWidth) ins.setAttribute("data-full-width-responsive", "true");
    if (opts.layoutKey) ins.setAttribute("data-ad-layout-key", opts.layoutKey);
    if (opts.layout) ins.setAttribute("data-ad-layout", opts.layout);

    container.appendChild(ins);

    pushAd();
  }

  /**
   * adsbygoogle.push()を安全に実行する。
   * adsbygoogle.jsがまだ読み込まれていない場合はリトライする。
   */
  function pushAd() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense script not yet ready - ignore
    }
  }

  /* ================================
     1. ヘッダー広告 (728x90) - 即時
     ================================ */
  function initHeaderAd() {
    var container = document.getElementById("ad-header");
    if (!container) return;
    createAdUnit(container, {
      slot: AD_SLOTS.header,
      format: "horizontal",
      fullWidth: true
    });
  }

  /* ================================
     2. フッター広告 (728x90) - 遅延
     ================================ */
  function initFooterAd() {
    var container = document.getElementById("ad-footer");
    if (!container) return;
    observeLazy(container, function () {
      createAdUnit(container, {
        slot: AD_SLOTS.footer,
        format: "horizontal",
        fullWidth: true
      });
    });
  }

  /* ================================
     3. インコンテンツ広告 - 遅延
     NOTE: Task #3でHTML側のインライン<script>push()を削除すること。
     ads.jsがpush()を一元管理するため、二重push()を防ぐ必要がある。
     ================================ */
  function initInContentAds() {
    var containers = document.querySelectorAll(".ad-container");
    containers.forEach(function (container) {
      var existing = container.querySelector("ins.adsbygoogle");
      // 既にAdSenseが初期化済みならスキップ
      if (existing && existing.getAttribute("data-adsbygoogle-status")) return;

      observeLazy(container, function () {
        if (existing) {
          // HTML側にins要素が既にある場合はpush()のみ実行
          if (!existing.getAttribute("data-adsbygoogle-status")) {
            pushAd();
          }
        } else {
          createAdUnit(container, {
            slot: AD_SLOTS.inContent,
            format: "auto",
            fullWidth: true
          });
        }
      });
    });
  }

  /* ================================
     4. サイドバー広告 - 遅延、デスクトップのみ
     NOTE: innerWidthチェックはDOMContentLoaded時の1回のみ。
     リサイズ/回転後の再評価は行わない（広告の再初期化は不可のため）。
     ================================ */
  function initSidebarAd() {
    if (window.innerWidth <= 1024) return;
    var container = document.getElementById("ad-sidebar");
    if (!container) return;
    observeLazy(container, function () {
      createAdUnit(container, {
        slot: AD_SLOTS.sidebar,
        format: "vertical",
        fullWidth: false
      });
    });
  }

  /* ================================
     5. アンカー広告 - モバイルのみ、即時
     NOTE: innerWidthチェックはDOMContentLoaded時の1回のみ。
     ================================ */
  function initAnchorAd() {
    if (window.innerWidth >= 769) return;
    var container = document.getElementById("ad-anchor");
    if (!container) return;
    createAdUnit(container, {
      slot: AD_SLOTS.anchor,
      format: "auto",
      fullWidth: true
    });
    document.body.classList.add("has-anchor-ad");
  }

  /* ================================
     6. 記事内広告 - 遅延
     ================================ */
  function initInArticleAd() {
    var container = document.getElementById("ad-in-article");
    if (!container) return;
    observeLazy(container, function () {
      createAdUnit(container, {
        slot: AD_SLOTS.inArticle,
        format: "fluid",
        layout: "in-article",
        fullWidth: true
      });
    });
  }

  /* ================================
     IntersectionObserver による遅延読み込み
     ================================ */
  var lazyObserver = null;
  var lazyCallbacks = new WeakMap();

  function getLazyObserver() {
    if (lazyObserver) return lazyObserver;
    if (!("IntersectionObserver" in window)) return null;

    lazyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var cb = lazyCallbacks.get(entry.target);
            if (cb) {
              cb();
              lazyCallbacks.delete(entry.target);
            }
            lazyObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px" }
    );

    return lazyObserver;
  }

  function observeLazy(element, callback) {
    var observer = getLazyObserver();
    if (!observer) {
      // IntersectionObserver非対応の場合は即時実行
      callback();
      return;
    }
    lazyCallbacks.set(element, callback);
    observer.observe(element);
  }

  /* ================================
     初期化
     ================================ */
  document.addEventListener("DOMContentLoaded", function () {
    // ヘッダー広告は即時
    initHeaderAd();
    // アンカー広告もモバイルで即時
    initAnchorAd();
    // 以下は遅延
    initFooterAd();
    initInContentAds();
    initSidebarAd();
    initInArticleAd();
  });
})();
