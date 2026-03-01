"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var templateEl = document.getElementById("nginx-template");
    var serverNameEl = document.getElementById("nginx-server-name");
    var listenPortEl = document.getElementById("nginx-listen-port");
    var rootPathEl = document.getElementById("nginx-root-path");
    var proxyPassEl = document.getElementById("nginx-proxy-pass");
    var upstreamSection = document.getElementById("nginx-upstream-section");
    var upstreamServersEl = document.getElementById("nginx-upstream-servers");
    var sslEl = document.getElementById("nginx-ssl");
    var gzipEl = document.getElementById("nginx-gzip");
    var securityEl = document.getElementById("nginx-security-headers");
    var cacheEl = document.getElementById("nginx-cache");
    var outputEl = document.getElementById("nginx-output");
    var successEl = document.getElementById("nginx-success");
    var btnGenerate = document.getElementById("btn-generate");
    var btnClear = document.getElementById("btn-clear");
    var btnCopy = document.getElementById("btn-copy");

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function ind(n) {
      var s = "";
      for (var i = 0; i < n * 4; i++) s += " ";
      return s;
    }

    templateEl.addEventListener("change", function () {
      var tpl = templateEl.value;
      upstreamSection.style.display = tpl === "load-balancer" ? "" : "none";
    });

    function generateConfig() {
      var tpl = templateEl.value;
      var serverName = serverNameEl.value.trim() || "example.com";
      var port = parseInt(listenPortEl.value, 10) || 80;
      var rootPath = rootPathEl.value.trim() || "/var/www/html";
      var proxyPass = proxyPassEl.value.trim() || "http://localhost:3000";
      var useSSL = sslEl.checked;
      var useGzip = gzipEl.checked;
      var useSecurity = securityEl.checked;
      var useCache = cacheEl.checked;
      var lines = [];

      // Upstream for load balancer
      if (tpl === "load-balancer") {
        var servers = upstreamServersEl.value.split("\n").map(function (s) { return s.trim(); }).filter(function (s) { return s; });
        if (servers.length === 0) servers = ["127.0.0.1:3001", "127.0.0.1:3002"];
        lines.push("upstream backend {");
        for (var u = 0; u < servers.length; u++) {
          lines.push(ind(1) + "server " + servers[u] + ";");
        }
        lines.push("}");
        lines.push("");
      }

      // SSL redirect
      if (useSSL) {
        lines.push("server {");
        lines.push(ind(1) + "listen 80;");
        lines.push(ind(1) + "server_name " + serverName + ";");
        lines.push(ind(1) + "return 301 https://$host$request_uri;");
        lines.push("}");
        lines.push("");
      }

      lines.push("server {");

      // Listen
      if (useSSL) {
        lines.push(ind(1) + "listen 443 ssl http2;");
        lines.push(ind(1) + "listen [::]:443 ssl http2;");
      } else {
        lines.push(ind(1) + "listen " + port + ";");
        lines.push(ind(1) + "listen [::]:" + port + ";");
      }

      lines.push(ind(1) + "server_name " + serverName + ";");
      lines.push("");

      // SSL config
      if (useSSL) {
        lines.push(ind(1) + "ssl_certificate /etc/letsencrypt/live/" + serverName + "/fullchain.pem;");
        lines.push(ind(1) + "ssl_certificate_key /etc/letsencrypt/live/" + serverName + "/privkey.pem;");
        lines.push(ind(1) + "ssl_protocols TLSv1.2 TLSv1.3;");
        lines.push(ind(1) + "ssl_ciphers HIGH:!aNULL:!MD5;");
        lines.push(ind(1) + "ssl_prefer_server_ciphers on;");
        lines.push("");
      }

      // Security headers
      if (useSecurity) {
        lines.push(ind(1) + "add_header X-Frame-Options \"SAMEORIGIN\" always;");
        lines.push(ind(1) + "add_header X-Content-Type-Options \"nosniff\" always;");
        lines.push(ind(1) + "add_header X-XSS-Protection \"1; mode=block\" always;");
        lines.push(ind(1) + "add_header Referrer-Policy \"no-referrer-when-downgrade\" always;");
        lines.push(ind(1) + 'add_header Content-Security-Policy "default-src \'self\'" always;');
        lines.push("");
      }

      // Gzip
      if (useGzip) {
        lines.push(ind(1) + "gzip on;");
        lines.push(ind(1) + "gzip_vary on;");
        lines.push(ind(1) + "gzip_proxied any;");
        lines.push(ind(1) + "gzip_comp_level 6;");
        lines.push(ind(1) + "gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;");
        lines.push("");
      }

      // Root (for static, SPA, PHP)
      if (tpl === "static" || tpl === "spa" || tpl === "php-fpm") {
        lines.push(ind(1) + "root " + rootPath + ";");
        lines.push(ind(1) + "index index.html index.htm;");
        lines.push("");
      }

      // Template-specific location blocks
      if (tpl === "static") {
        lines.push(ind(1) + "location / {");
        lines.push(ind(2) + "try_files $uri $uri/ =404;");
        lines.push(ind(1) + "}");
      } else if (tpl === "reverse-proxy") {
        lines.push(ind(1) + "location / {");
        lines.push(ind(2) + "proxy_pass " + proxyPass + ";");
        lines.push(ind(2) + "proxy_http_version 1.1;");
        lines.push(ind(2) + 'proxy_set_header Upgrade $http_upgrade;');
        lines.push(ind(2) + "proxy_set_header Connection 'upgrade';");
        lines.push(ind(2) + "proxy_set_header Host $host;");
        lines.push(ind(2) + "proxy_set_header X-Real-IP $remote_addr;");
        lines.push(ind(2) + "proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;");
        lines.push(ind(2) + "proxy_set_header X-Forwarded-Proto $scheme;");
        lines.push(ind(2) + "proxy_cache_bypass $http_upgrade;");
        lines.push(ind(1) + "}");
      } else if (tpl === "spa") {
        lines.push(ind(1) + "location / {");
        lines.push(ind(2) + "try_files $uri $uri/ /index.html;");
        lines.push(ind(1) + "}");
      } else if (tpl === "php-fpm") {
        lines.push(ind(1) + "location / {");
        lines.push(ind(2) + "try_files $uri $uri/ /index.php?$query_string;");
        lines.push(ind(1) + "}");
        lines.push("");
        lines.push(ind(1) + "location ~ \\.php$ {");
        lines.push(ind(2) + "fastcgi_pass unix:/var/run/php/php-fpm.sock;");
        lines.push(ind(2) + "fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;");
        lines.push(ind(2) + "include fastcgi_params;");
        lines.push(ind(1) + "}");
      } else if (tpl === "load-balancer") {
        lines.push(ind(1) + "location / {");
        lines.push(ind(2) + "proxy_pass http://backend;");
        lines.push(ind(2) + "proxy_http_version 1.1;");
        lines.push(ind(2) + 'proxy_set_header Upgrade $http_upgrade;');
        lines.push(ind(2) + "proxy_set_header Connection 'upgrade';");
        lines.push(ind(2) + "proxy_set_header Host $host;");
        lines.push(ind(2) + "proxy_set_header X-Real-IP $remote_addr;");
        lines.push(ind(2) + "proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;");
        lines.push(ind(2) + "proxy_set_header X-Forwarded-Proto $scheme;");
        lines.push(ind(1) + "}");
      }

      // Cache
      if (useCache) {
        lines.push("");
        lines.push(ind(1) + "location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {");
        if (tpl === "static" || tpl === "spa" || tpl === "php-fpm") {
          lines.push(ind(2) + "expires 30d;");
          lines.push(ind(2) + 'add_header Cache-Control "public, immutable";');
        } else {
          lines.push(ind(2) + "proxy_pass " + (tpl === "load-balancer" ? "http://backend" : proxyPass) + ";");
          lines.push(ind(2) + "expires 30d;");
          lines.push(ind(2) + 'add_header Cache-Control "public, immutable";');
        }
        lines.push(ind(1) + "}");
      }

      // Deny hidden files
      lines.push("");
      lines.push(ind(1) + "location ~ /\\. {");
      lines.push(ind(2) + "deny all;");
      lines.push(ind(1) + "}");

      // Access log
      lines.push("");
      lines.push(ind(1) + "access_log /var/log/nginx/" + serverName + ".access.log;");
      lines.push(ind(1) + "error_log /var/log/nginx/" + serverName + ".error.log;");

      lines.push("}");

      return lines.join("\n");
    }

    btnGenerate.addEventListener("click", function () {
      outputEl.value = generateConfig();
      showSuccess("Nginx設定を生成しました。");
    });

    btnClear.addEventListener("click", function () {
      outputEl.value = "";
      serverNameEl.value = "example.com";
      listenPortEl.value = "80";
      rootPathEl.value = "/var/www/html";
      proxyPassEl.value = "http://localhost:3000";
      templateEl.value = "static";
      sslEl.checked = false;
      gzipEl.checked = true;
      securityEl.checked = false;
      cacheEl.checked = false;
      upstreamSection.style.display = "none";
      upstreamServersEl.value = "";
    });

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });
  });
})();
