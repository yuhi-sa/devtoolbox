"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var inputEl = document.getElementById("jwt-input");
    var outputEl = document.getElementById("jwt-output");
    var errorEl = document.getElementById("jwt-error");
    var successEl = document.getElementById("jwt-success");
    var headerJsonEl = document.getElementById("jwt-header-json");
    var payloadJsonEl = document.getElementById("jwt-payload-json");
    var signatureEl = document.getElementById("jwt-signature");
    var claimsEl = document.getElementById("jwt-claims");
    var statusContainer = document.getElementById("jwt-status-container");
    var btnDecode = document.getElementById("btn-decode");
    var btnClear = document.getElementById("btn-clear");
    var btnCopyHeader = document.getElementById("btn-copy-header");
    var btnCopyPayload = document.getElementById("btn-copy-payload");

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      successEl.hidden = true;
      outputEl.hidden = true;
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

    function base64UrlDecode(str) {
      var base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      var pad = base64.length % 4;
      if (pad) {
        base64 += new Array(5 - pad).join("=");
      }
      var binary = atob(base64);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      var decoder = new TextDecoder();
      return decoder.decode(bytes);
    }

    function formatDate(timestamp) {
      var date = new Date(timestamp * 1000);
      return date.getFullYear() + "/"
        + String(date.getMonth() + 1).padStart(2, "0") + "/"
        + String(date.getDate()).padStart(2, "0") + " "
        + String(date.getHours()).padStart(2, "0") + ":"
        + String(date.getMinutes()).padStart(2, "0") + ":"
        + String(date.getSeconds()).padStart(2, "0");
    }

    function formatTimeDiff(diffMs) {
      var absDiff = Math.abs(diffMs);
      var seconds = Math.floor(absDiff / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);

      if (days > 0) {
        return days + "日" + (hours % 24) + "時間";
      }
      if (hours > 0) {
        return hours + "時間" + (minutes % 60) + "分";
      }
      if (minutes > 0) {
        return minutes + "分" + (seconds % 60) + "秒";
      }
      return seconds + "秒";
    }

    function decodeJwt(token) {
      var parts = token.trim().split(".");
      if (parts.length !== 3) {
        throw new Error("JWTは3つのパート（ヘッダー.ペイロード.署名）で構成されている必要があります。");
      }

      var header, payload;
      try {
        header = JSON.parse(base64UrlDecode(parts[0]));
      } catch (e) {
        throw new Error("ヘッダーのデコードに失敗しました。正しいJWTか確認してください。");
      }

      try {
        payload = JSON.parse(base64UrlDecode(parts[1]));
      } catch (e) {
        throw new Error("ペイロードのデコードに失敗しました。正しいJWTか確認してください。");
      }

      return {
        header: header,
        payload: payload,
        signature: parts[2]
      };
    }

    function renderClaims(payload) {
      var html = "";
      var now = Date.now();

      if (payload.iat !== undefined) {
        html += "<dl><dt>発行日時 (iat):</dt><dd>" + formatDate(payload.iat) + "</dd></dl>";
      }

      if (payload.exp !== undefined) {
        html += "<dl><dt>有効期限 (exp):</dt><dd>" + formatDate(payload.exp) + "</dd></dl>";
      }

      if (payload.nbf !== undefined) {
        html += "<dl><dt>有効開始 (nbf):</dt><dd>" + formatDate(payload.nbf) + "</dd></dl>";
      }

      if (payload.sub !== undefined) {
        html += "<dl><dt>サブジェクト (sub):</dt><dd>" + escapeHtml(String(payload.sub)) + "</dd></dl>";
      }

      if (payload.iss !== undefined) {
        html += "<dl><dt>発行者 (iss):</dt><dd>" + escapeHtml(String(payload.iss)) + "</dd></dl>";
      }

      if (payload.aud !== undefined) {
        html += "<dl><dt>対象者 (aud):</dt><dd>" + escapeHtml(String(payload.aud)) + "</dd></dl>";
      }

      claimsEl.innerHTML = html;

      // Show expiration status
      statusContainer.innerHTML = "";
      if (payload.exp !== undefined) {
        var expMs = payload.exp * 1000;
        var diff = expMs - now;
        var statusEl = document.createElement("div");

        if (diff > 0) {
          statusEl.className = "jwt-status jwt-status--valid";
          statusEl.textContent = "有効 - 残り " + formatTimeDiff(diff);
        } else {
          statusEl.className = "jwt-status jwt-status--expired";
          statusEl.textContent = "期限切れ - " + formatTimeDiff(diff) + " 前に失効";
        }
        statusContainer.appendChild(statusEl);
      }
    }

    function escapeHtml(str) {
      var div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    btnDecode.addEventListener("click", function () {
      clearMessages();
      var input = inputEl.value.trim();

      if (!input) {
        showError("JWTトークンを入力してください。");
        return;
      }

      try {
        var decoded = decodeJwt(input);
        var headerStr = JSON.stringify(decoded.header, null, 2);
        var payloadStr = JSON.stringify(decoded.payload, null, 2);

        headerJsonEl.textContent = headerStr;
        payloadJsonEl.textContent = payloadStr;
        signatureEl.textContent = decoded.signature;

        renderClaims(decoded.payload);

        outputEl.hidden = false;
        showSuccess("デコードが完了しました。");
      } catch (e) {
        showError(e.message || "不正なJWTトークンです。入力を確認してください。");
      }
    });

    btnClear.addEventListener("click", function () {
      inputEl.value = "";
      outputEl.hidden = true;
      clearMessages();
    });

    btnCopyHeader.addEventListener("click", function () {
      var text = headerJsonEl.textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("ヘッダーをコピーしました。");
      });
    });

    btnCopyPayload.addEventListener("click", function () {
      var text = payloadJsonEl.textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("ペイロードをコピーしました。");
      });
    });
  });
})();
