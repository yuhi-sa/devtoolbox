"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var rulesContainer = document.getElementById("rules-container");
    var btnAddRule = document.getElementById("btn-add-rule");
    var btnGenerate = document.getElementById("btn-generate");
    var btnValidate = document.getElementById("btn-validate");
    var btnCopy = document.getElementById("btn-copy");
    var btnDownload = document.getElementById("btn-download");
    var robotsOutput = document.getElementById("robots-output");
    var sitemapInput = document.getElementById("sitemap-url");
    var successEl = document.getElementById("robots-success");
    var validationResult = document.getElementById("validation-result");

    var ruleIdCounter = 0;
    var rules = [];

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function escapeHTML(str) {
      var div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    function createRule(userAgent, paths, crawlDelay) {
      userAgent = userAgent || "*";
      paths = paths || [{ type: "Disallow", path: "" }];
      crawlDelay = crawlDelay || "";

      var ruleId = ruleIdCounter++;
      var rule = { id: ruleId, userAgent: userAgent, paths: paths, crawlDelay: crawlDelay };
      rules.push(rule);
      renderRule(rule);
      return rule;
    }

    function renderRule(rule) {
      var card = document.createElement("div");
      card.className = "rule-card";
      card.id = "rule-" + rule.id;

      var header = document.createElement("div");
      header.className = "rule-card__header";
      header.innerHTML = '<span class="rule-card__title">ルール #' + (rule.id + 1) + "</span>";
      var removeBtn = document.createElement("button");
      removeBtn.className = "btn btn--sm btn--danger";
      removeBtn.textContent = "削除";
      removeBtn.addEventListener("click", function () {
        rules = rules.filter(function (r) { return r.id !== rule.id; });
        card.remove();
      });
      header.appendChild(removeBtn);
      card.appendChild(header);

      // User-agent
      var uaRow = document.createElement("div");
      uaRow.className = "control-row";
      uaRow.innerHTML = '<label style="min-width: 90px; font-size: 0.85rem; font-weight: 600;">User-agent:</label>';
      var uaInput = document.createElement("input");
      uaInput.type = "text";
      uaInput.value = rule.userAgent;
      uaInput.placeholder = "*";
      uaInput.addEventListener("input", function () { rule.userAgent = this.value; });
      uaRow.appendChild(uaInput);
      card.appendChild(uaRow);

      // Crawl-delay
      var cdRow = document.createElement("div");
      cdRow.className = "control-row";
      cdRow.innerHTML = '<label style="min-width: 90px; font-size: 0.85rem; font-weight: 600;">Crawl-delay:</label>';
      var cdInput = document.createElement("input");
      cdInput.type = "number";
      cdInput.value = rule.crawlDelay;
      cdInput.placeholder = "秒";
      cdInput.min = "0";
      cdInput.addEventListener("input", function () { rule.crawlDelay = this.value; });
      cdRow.appendChild(cdInput);
      card.appendChild(cdRow);

      // Paths
      var pathsDiv = document.createElement("div");
      pathsDiv.className = "paths-list";

      function addPathRow(pathObj) {
        var pathItem = document.createElement("div");
        pathItem.className = "path-item";

        var sel = document.createElement("select");
        sel.innerHTML = '<option value="Disallow">Disallow</option><option value="Allow">Allow</option>';
        sel.value = pathObj.type;
        sel.addEventListener("change", function () { pathObj.type = this.value; });

        var pathInput = document.createElement("input");
        pathInput.type = "text";
        pathInput.value = pathObj.path;
        pathInput.placeholder = "/path/";
        pathInput.addEventListener("input", function () { pathObj.path = this.value; });

        var removePathBtn = document.createElement("button");
        removePathBtn.className = "btn btn--sm btn--danger";
        removePathBtn.textContent = "x";
        removePathBtn.addEventListener("click", function () {
          rule.paths = rule.paths.filter(function (p) { return p !== pathObj; });
          pathItem.remove();
        });

        pathItem.appendChild(sel);
        pathItem.appendChild(pathInput);
        pathItem.appendChild(removePathBtn);
        pathsDiv.appendChild(pathItem);
      }

      rule.paths.forEach(function (p) { addPathRow(p); });

      var addPathBtn = document.createElement("button");
      addPathBtn.className = "btn btn--sm btn--secondary";
      addPathBtn.textContent = "+ パスを追加";
      addPathBtn.style.marginTop = "var(--space-sm)";
      addPathBtn.addEventListener("click", function () {
        var newPath = { type: "Disallow", path: "" };
        rule.paths.push(newPath);
        addPathRow(newPath);
      });

      card.appendChild(pathsDiv);
      card.appendChild(addPathBtn);
      rulesContainer.appendChild(card);
    }

    function generateRobotsTxt() {
      var lines = [];
      rules.forEach(function (rule, i) {
        if (i > 0) lines.push("");
        lines.push("User-agent: " + (rule.userAgent || "*"));
        if (rule.crawlDelay && parseInt(rule.crawlDelay, 10) > 0) {
          lines.push("Crawl-delay: " + parseInt(rule.crawlDelay, 10));
        }
        rule.paths.forEach(function (p) {
          lines.push(p.type + ": " + p.path);
        });
      });

      var sitemap = sitemapInput.value.trim();
      if (sitemap) {
        lines.push("");
        lines.push("Sitemap: " + sitemap);
      }

      return lines.join("\n");
    }

    function validateRobotsTxt(text) {
      var errors = [];
      var lines = text.split("\n");
      var hasUserAgent = false;

      lines.forEach(function (line, i) {
        var trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;

        if (/^User-agent:/i.test(trimmed)) {
          hasUserAgent = true;
          var val = trimmed.substring(11).trim();
          if (!val) errors.push("行 " + (i + 1) + ": User-agentの値が空です。");
        } else if (/^Disallow:/i.test(trimmed)) {
          if (!hasUserAgent) errors.push("行 " + (i + 1) + ": DisallowはUser-agentの後に記述してください。");
        } else if (/^Allow:/i.test(trimmed)) {
          if (!hasUserAgent) errors.push("行 " + (i + 1) + ": AllowはUser-agentの後に記述してください。");
        } else if (/^Crawl-delay:/i.test(trimmed)) {
          var cdVal = trimmed.substring(12).trim();
          if (isNaN(parseInt(cdVal, 10)) || parseInt(cdVal, 10) < 0) {
            errors.push("行 " + (i + 1) + ": Crawl-delayの値が不正です。");
          }
        } else if (/^Sitemap:/i.test(trimmed)) {
          var url = trimmed.substring(8).trim();
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            errors.push("行 " + (i + 1) + ": SitemapのURLはhttp://またはhttps://で始まる必要があります。");
          }
        } else {
          errors.push("行 " + (i + 1) + ': 不明なディレクティブ: "' + escapeHTML(trimmed.split(":")[0]) + '"');
        }
      });

      if (!hasUserAgent && lines.some(function (l) { return l.trim(); })) {
        errors.push("User-agentディレクティブが見つかりません。");
      }

      return errors;
    }

    btnAddRule.addEventListener("click", function () {
      createRule();
    });

    btnGenerate.addEventListener("click", function () {
      validationResult.hidden = true;
      robotsOutput.value = generateRobotsTxt();
      showSuccess("robots.txtを生成しました。");
    });

    btnValidate.addEventListener("click", function () {
      var text = robotsOutput.value;
      if (!text.trim()) {
        validationResult.textContent = "robots.txtを先に生成してください。";
        validationResult.className = "validation-result invalid";
        validationResult.hidden = false;
        return;
      }
      var errors = validateRobotsTxt(text);
      if (errors.length === 0) {
        validationResult.textContent = "robots.txtは有効です。問題は見つかりませんでした。";
        validationResult.className = "validation-result valid";
      } else {
        validationResult.innerHTML = "検証エラー:<br>" + errors.map(function (e) { return "- " + e; }).join("<br>");
        validationResult.className = "validation-result invalid";
      }
      validationResult.hidden = false;
    });

    btnCopy.addEventListener("click", function () {
      var text = robotsOutput.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });

    btnDownload.addEventListener("click", function () {
      var text = robotsOutput.value;
      if (!text) {
        robotsOutput.value = generateRobotsTxt();
        text = robotsOutput.value;
      }
      var blob = new Blob([text], { type: "text/plain" });
      var link = document.createElement("a");
      link.download = "robots.txt";
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      showSuccess("ダウンロードを開始しました。");
    });

    // Presets
    function clearRules() {
      rules = [];
      rulesContainer.innerHTML = "";
      ruleIdCounter = 0;
      sitemapInput.value = "";
      robotsOutput.value = "";
      validationResult.hidden = true;
    }

    document.getElementById("preset-allow-all").addEventListener("click", function () {
      clearRules();
      createRule("*", [{ type: "Allow", path: "/" }], "");
    });

    document.getElementById("preset-block-all").addEventListener("click", function () {
      clearRules();
      createRule("*", [{ type: "Disallow", path: "/" }], "");
    });

    document.getElementById("preset-block-ai").addEventListener("click", function () {
      clearRules();
      createRule("*", [{ type: "Allow", path: "/" }], "");
      createRule("GPTBot", [{ type: "Disallow", path: "/" }], "");
      createRule("ChatGPT-User", [{ type: "Disallow", path: "/" }], "");
      createRule("CCBot", [{ type: "Disallow", path: "/" }], "");
      createRule("anthropic-ai", [{ type: "Disallow", path: "/" }], "");
      createRule("Google-Extended", [{ type: "Disallow", path: "/" }], "");
    });

    document.getElementById("preset-standard").addEventListener("click", function () {
      clearRules();
      createRule("*", [
        { type: "Allow", path: "/" },
        { type: "Disallow", path: "/admin/" },
        { type: "Disallow", path: "/private/" },
        { type: "Disallow", path: "/tmp/" },
        { type: "Disallow", path: "/*.json$" }
      ], "");
    });

    document.getElementById("preset-reset").addEventListener("click", function () {
      clearRules();
      createRule();
    });

    // Initial: create one default rule
    createRule();
  });
})();
