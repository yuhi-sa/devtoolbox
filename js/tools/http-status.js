"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var searchEl = document.getElementById("http-search");
    var listEl = document.getElementById("http-list");
    var countEl = document.getElementById("http-count");
    var filterBtns = document.querySelectorAll(".http-filter-btn");
    var currentCategory = "all";

    var STATUS_CODES = [
      // 1xx 情報
      { code: 100, name: "Continue", desc: "リクエストの最初の部分が受理され、残りを送信してよい" },
      { code: 101, name: "Switching Protocols", desc: "サーバーがプロトコルの切り替えに同意した" },
      { code: 102, name: "Processing", desc: "サーバーがリクエストを処理中だが、まだ完了していない" },
      { code: 103, name: "Early Hints", desc: "最終的なレスポンスに先立ってヘッダーを送信する" },
      // 2xx 成功
      { code: 200, name: "OK", desc: "リクエストが正常に処理された" },
      { code: 201, name: "Created", desc: "リクエストが正常に処理され、新しいリソースが作成された" },
      { code: 202, name: "Accepted", desc: "リクエストは受理されたが、処理はまだ完了していない" },
      { code: 203, name: "Non-Authoritative Information", desc: "リクエストは成功したが、変換プロキシからの情報である" },
      { code: 204, name: "No Content", desc: "リクエストは成功したが、返すべきコンテンツがない" },
      { code: 205, name: "Reset Content", desc: "リクエストは成功した。クライアントはドキュメントビューをリセットすべき" },
      { code: 206, name: "Partial Content", desc: "範囲リクエストが成功し、部分的なコンテンツを返す" },
      { code: 207, name: "Multi-Status", desc: "複数のリソースに対する操作結果を返す（WebDAV）" },
      { code: 208, name: "Already Reported", desc: "DAVバインディングのメンバーは既に列挙済み" },
      { code: 226, name: "IM Used", desc: "サーバーはリソースへのGETリクエストを処理し、インスタンス操作を適用した" },
      // 3xx リダイレクト
      { code: 300, name: "Multiple Choices", desc: "リクエストに対して複数のレスポンスが存在する" },
      { code: 301, name: "Moved Permanently", desc: "リソースが恒久的に新しいURLに移動した" },
      { code: 302, name: "Found", desc: "リソースが一時的に別のURLに移動している" },
      { code: 303, name: "See Other", desc: "リクエストに対するレスポンスが別のURLで取得できる" },
      { code: 304, name: "Not Modified", desc: "リソースが変更されていないため、キャッシュを使用できる" },
      { code: 305, name: "Use Proxy", desc: "リクエストされたリソースはプロキシ経由でアクセスすべき" },
      { code: 307, name: "Temporary Redirect", desc: "リソースが一時的に別のURLに移動している（メソッド維持）" },
      { code: 308, name: "Permanent Redirect", desc: "リソースが恒久的に別のURLに移動した（メソッド維持）" },
      // 4xx クライアントエラー
      { code: 400, name: "Bad Request", desc: "リクエストの構文が不正、またはパラメータが無効" },
      { code: 401, name: "Unauthorized", desc: "認証が必要。認証情報が未提供または無効" },
      { code: 402, name: "Payment Required", desc: "将来の使用のために予約されている" },
      { code: 403, name: "Forbidden", desc: "アクセス権限がない。認証済みでも拒否される" },
      { code: 404, name: "Not Found", desc: "リクエストされたリソースが見つからない" },
      { code: 405, name: "Method Not Allowed", desc: "リクエストのHTTPメソッドが許可されていない" },
      { code: 406, name: "Not Acceptable", desc: "Acceptヘッダーに適合するコンテンツがない" },
      { code: 407, name: "Proxy Authentication Required", desc: "プロキシでの認証が必要" },
      { code: 408, name: "Request Timeout", desc: "サーバーがリクエストの待機中にタイムアウトした" },
      { code: 409, name: "Conflict", desc: "リソースの現在の状態と競合している" },
      { code: 410, name: "Gone", desc: "リソースが恒久的に削除され、利用できない" },
      { code: 411, name: "Length Required", desc: "Content-Lengthヘッダーが必要" },
      { code: 412, name: "Precondition Failed", desc: "前提条件ヘッダーの条件を満たしていない" },
      { code: 413, name: "Payload Too Large", desc: "リクエストボディがサーバーの許容範囲を超えている" },
      { code: 414, name: "URI Too Long", desc: "リクエストURIがサーバーの許容長を超えている" },
      { code: 415, name: "Unsupported Media Type", desc: "リクエストのメディアタイプがサポートされていない" },
      { code: 416, name: "Range Not Satisfiable", desc: "リクエストされた範囲がリソースのサイズを超えている" },
      { code: 417, name: "Expectation Failed", desc: "Expectヘッダーの期待値を満たせない" },
      { code: 418, name: "I'm a Teapot", desc: "ティーポットでコーヒーを淹れることはできない（ジョークRFC）" },
      { code: 421, name: "Misdirected Request", desc: "リクエストが応答できないサーバーに送られた" },
      { code: 422, name: "Unprocessable Entity", desc: "リクエストの構文は正しいが、意味的に処理できない" },
      { code: 423, name: "Locked", desc: "リソースがロックされている（WebDAV）" },
      { code: 424, name: "Failed Dependency", desc: "依存するリクエストが失敗したため処理できない（WebDAV）" },
      { code: 425, name: "Too Early", desc: "サーバーがリプレイされる可能性のあるリクエストの処理を拒否" },
      { code: 426, name: "Upgrade Required", desc: "クライアントは別のプロトコルにアップグレードすべき" },
      { code: 428, name: "Precondition Required", desc: "リクエストに前提条件ヘッダーが必要" },
      { code: 429, name: "Too Many Requests", desc: "一定時間内のリクエスト数が制限を超えた" },
      { code: 431, name: "Request Header Fields Too Large", desc: "ヘッダーフィールドが大きすぎてサーバーが処理を拒否" },
      { code: 451, name: "Unavailable For Legal Reasons", desc: "法的理由によりリソースが利用できない" },
      // 5xx サーバーエラー
      { code: 500, name: "Internal Server Error", desc: "サーバー内部でエラーが発生した" },
      { code: 501, name: "Not Implemented", desc: "リクエストのメソッドがサーバーに実装されていない" },
      { code: 502, name: "Bad Gateway", desc: "ゲートウェイ/プロキシが上流サーバーから無効な応答を受けた" },
      { code: 503, name: "Service Unavailable", desc: "サーバーが一時的に利用できない（メンテナンス/過負荷）" },
      { code: 504, name: "Gateway Timeout", desc: "ゲートウェイ/プロキシが上流サーバーからの応答を待機中にタイムアウト" },
      { code: 505, name: "HTTP Version Not Supported", desc: "リクエストで使用されたHTTPバージョンがサポートされていない" },
      { code: 506, name: "Variant Also Negotiates", desc: "サーバーの内部設定エラー（コンテントネゴシエーションの循環参照）" },
      { code: 507, name: "Insufficient Storage", desc: "サーバーのストレージが不足している（WebDAV）" },
      { code: 508, name: "Loop Detected", desc: "サーバーがリクエスト処理中に無限ループを検出した（WebDAV）" },
      { code: 510, name: "Not Extended", desc: "サーバーがリクエストを処理するために追加の拡張が必要" },
      { code: 511, name: "Network Authentication Required", desc: "ネットワークアクセスに認証が必要（キャプティブポータル等）" }
    ];

    var CATEGORY_COLORS = {
      "1": "#2196f3",
      "2": "#4caf50",
      "3": "#ff9800",
      "4": "#f44336",
      "5": "#9c27b0"
    };

    function getCategory(code) {
      return Math.floor(code / 100).toString();
    }

    function renderList(codes) {
      if (codes.length === 0) {
        listEl.innerHTML = '<p style="color:var(--color-text-secondary);text-align:center;padding:2rem;">該当するステータスコードが見つかりません。</p>';
        countEl.textContent = "0件";
        return;
      }

      countEl.textContent = codes.length + "件";
      var html = "";
      for (var i = 0; i < codes.length; i++) {
        var item = codes[i];
        var cat = getCategory(item.code);
        var color = CATEGORY_COLORS[cat] || "#666";
        html += '<div style="display:flex;gap:1rem;align-items:flex-start;padding:0.75rem 1rem;border:1px solid var(--color-border);border-radius:var(--radius-sm);margin-bottom:0.5rem;background:var(--color-surface);">';
        html += '<span style="font-family:var(--font-mono);font-size:1.125rem;font-weight:700;color:' + color + ';min-width:3rem;">' + item.code + '</span>';
        html += '<div style="flex:1;">';
        html += '<span style="font-weight:600;">' + item.name + '</span>';
        html += '<p style="font-size:0.8125rem;color:var(--color-text-secondary);margin:0.25rem 0 0 0;">' + item.desc + '</p>';
        html += '</div></div>';
      }
      listEl.innerHTML = html;
    }

    function filterAndSearch() {
      var query = searchEl.value.toLowerCase().trim();
      var filtered = STATUS_CODES.filter(function (item) {
        var matchCategory = currentCategory === "all" || (getCategory(item.code) + "xx") === currentCategory;
        if (!matchCategory) return false;
        if (!query) return true;
        return (
          item.code.toString().indexOf(query) !== -1 ||
          item.name.toLowerCase().indexOf(query) !== -1 ||
          item.desc.indexOf(query) !== -1
        );
      });
      renderList(filtered);
    }

    searchEl.addEventListener("input", filterAndSearch);

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.classList.remove("btn--primary");
          b.classList.add("btn--secondary");
        });
        btn.classList.remove("btn--secondary");
        btn.classList.add("btn--primary");
        currentCategory = btn.getAttribute("data-category");
        filterAndSearch();
      });
    });

    // 初期表示
    filterAndSearch();
  });
})();
