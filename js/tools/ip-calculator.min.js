"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var ipInput = document.getElementById("ip-input");
    var cidrInput = document.getElementById("cidr-input");
    var maskInput = document.getElementById("mask-input");
    var btnCalculate = document.getElementById("btn-calculate");
    var btnClear = document.getElementById("btn-clear");
    var btnCopyAll = document.getElementById("btn-copy-all");
    var resultsEl = document.getElementById("ip-results");
    var errorEl = document.getElementById("ip-error");
    var successEl = document.getElementById("ip-success");

    var resNetwork = document.getElementById("res-network");
    var resBroadcast = document.getElementById("res-broadcast");
    var resFirstHost = document.getElementById("res-first-host");
    var resLastHost = document.getElementById("res-last-host");
    var resHostCount = document.getElementById("res-host-count");
    var resSubnetMask = document.getElementById("res-subnet-mask");
    var resWildcard = document.getElementById("res-wildcard");
    var resCidr = document.getElementById("res-cidr");
    var resClass = document.getElementById("res-class");
    var resBinary = document.getElementById("res-binary");
    var resType = document.getElementById("res-type");

    // --- Utility functions ---

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      successEl.hidden = true;
    }

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      errorEl.hidden = true;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function clearMessages() {
      errorEl.hidden = true;
      successEl.hidden = true;
    }

    // Parse IPv4 string to 32-bit unsigned integer
    function ipToInt(ip) {
      var parts = ip.split(".");
      if (parts.length !== 4) return null;
      var num = 0;
      for (var i = 0; i < 4; i++) {
        var octet = parseInt(parts[i], 10);
        if (isNaN(octet) || octet < 0 || octet > 255) return null;
        if (parts[i] !== String(octet)) return null; // reject leading zeros like "01"
        num = (num * 256) + octet;
      }
      return num >>> 0; // ensure unsigned
    }

    // Convert 32-bit unsigned integer to IPv4 string
    function intToIp(num) {
      return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
      ].join(".");
    }

    // CIDR prefix length to 32-bit subnet mask
    function cidrToMask(cidr) {
      if (cidr === 0) return 0;
      return (0xFFFFFFFF << (32 - cidr)) >>> 0;
    }

    // Subnet mask (32-bit int) to CIDR prefix length, or -1 if invalid
    function maskToCidr(mask) {
      // Must be a valid contiguous mask
      if (mask === 0) return 0;
      var bits = 0;
      var foundZero = false;
      for (var i = 31; i >= 0; i--) {
        var bit = (mask >>> i) & 1;
        if (bit === 1) {
          if (foundZero) return -1; // not contiguous
          bits++;
        } else {
          foundZero = true;
        }
      }
      return bits;
    }

    // Convert 32-bit integer to binary string with dots between octets
    function intToBinary(num) {
      var parts = [];
      for (var i = 3; i >= 0; i--) {
        var octet = (num >>> (i * 8)) & 255;
        var bin = octet.toString(2);
        while (bin.length < 8) bin = "0" + bin;
        parts.push(bin);
      }
      return parts.join(".");
    }

    // Determine IP class based on first octet
    function getIpClass(ipInt) {
      var firstOctet = (ipInt >>> 24) & 255;
      if (firstOctet >= 0 && firstOctet <= 127) return "A";
      if (firstOctet >= 128 && firstOctet <= 191) return "B";
      if (firstOctet >= 192 && firstOctet <= 223) return "C";
      if (firstOctet >= 224 && firstOctet <= 239) return "D (マルチキャスト)";
      return "E (予約済み)";
    }

    // Check if IP is private
    function isPrivate(ipInt) {
      var firstOctet = (ipInt >>> 24) & 255;
      var secondOctet = (ipInt >>> 16) & 255;

      // 10.0.0.0/8
      if (firstOctet === 10) return true;
      // 172.16.0.0/12
      if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return true;
      // 192.168.0.0/16
      if (firstOctet === 192 && secondOctet === 168) return true;
      // 127.0.0.0/8 (loopback)
      if (firstOctet === 127) return true;

      return false;
    }

    function getAddressType(ipInt) {
      var firstOctet = (ipInt >>> 24) & 255;
      if (firstOctet === 127) return "ループバック (Private)";
      if (isPrivate(ipInt)) return "プライベート (Private)";
      if (firstOctet >= 224 && firstOctet <= 239) return "マルチキャスト";
      if (firstOctet >= 240) return "予約済み";
      return "パブリック (Public)";
    }

    // Validate subnet mask string input
    function parseSubnetMask(maskStr) {
      var maskInt = ipToInt(maskStr);
      if (maskInt === null) return null;
      var cidr = maskToCidr(maskInt);
      if (cidr === -1) return null;
      return { mask: maskInt, cidr: cidr };
    }

    // --- CIDR <-> Mask sync ---

    cidrInput.addEventListener("change", function () {
      var cidr = parseInt(cidrInput.value, 10);
      var mask = cidrToMask(cidr);
      maskInput.value = intToIp(mask);
    });

    maskInput.addEventListener("change", function () {
      clearMessages();
      var val = maskInput.value.trim();
      if (!val) return;
      var parsed = parseSubnetMask(val);
      if (!parsed) {
        showError("無効なサブネットマスクです。連続したビットパターンである必要があります。");
        return;
      }
      cidrInput.value = String(parsed.cidr);
    });

    // --- Calculate ---

    function calculate() {
      clearMessages();

      var ipStr = ipInput.value.trim();
      if (!ipStr) {
        showError("IPアドレスを入力してください。");
        resultsEl.hidden = true;
        return;
      }

      var ipInt = ipToInt(ipStr);
      if (ipInt === null) {
        showError("無効なIPアドレスです。正しいIPv4形式（例: 192.168.1.0）で入力してください。");
        resultsEl.hidden = true;
        return;
      }

      var cidr = parseInt(cidrInput.value, 10);
      var maskInt = cidrToMask(cidr);

      var networkInt = (ipInt & maskInt) >>> 0;
      var wildcardInt = (~maskInt) >>> 0;
      var broadcastInt = (networkInt | wildcardInt) >>> 0;

      var hostCount;
      var firstHost;
      var lastHost;

      if (cidr === 32) {
        hostCount = 1;
        firstHost = intToIp(networkInt);
        lastHost = intToIp(networkInt);
      } else if (cidr === 31) {
        // RFC 3021: point-to-point link
        hostCount = 2;
        firstHost = intToIp(networkInt);
        lastHost = intToIp(broadcastInt);
      } else {
        hostCount = Math.pow(2, 32 - cidr) - 2;
        if (hostCount < 0) hostCount = 0;
        firstHost = intToIp((networkInt + 1) >>> 0);
        lastHost = intToIp((broadcastInt - 1) >>> 0);
      }

      resNetwork.textContent = intToIp(networkInt);
      resBroadcast.textContent = intToIp(broadcastInt);
      resFirstHost.textContent = firstHost;
      resLastHost.textContent = lastHost;
      resHostCount.textContent = hostCount.toLocaleString("ja-JP");
      resSubnetMask.textContent = intToIp(maskInt);
      resWildcard.textContent = intToIp(wildcardInt);
      resCidr.textContent = "/" + cidr;
      resClass.textContent = "クラス " + getIpClass(ipInt);
      resBinary.textContent = intToBinary(ipInt);
      resType.textContent = getAddressType(ipInt);

      resultsEl.hidden = false;
    }

    btnCalculate.addEventListener("click", calculate);

    // Enter key triggers calculation
    ipInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") calculate();
    });
    maskInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") calculate();
    });

    // --- Clear ---

    btnClear.addEventListener("click", function () {
      ipInput.value = "";
      cidrInput.value = "24";
      maskInput.value = "255.255.255.0";
      resultsEl.hidden = true;
      clearMessages();
    });

    // --- Copy all results ---

    btnCopyAll.addEventListener("click", function () {
      if (resultsEl.hidden) {
        showError("まず計算を実行してください。");
        return;
      }

      var lines = [
        "ネットワークアドレス: " + resNetwork.textContent,
        "ブロードキャストアドレス: " + resBroadcast.textContent,
        "最初の使用可能ホスト: " + resFirstHost.textContent,
        "最後の使用可能ホスト: " + resLastHost.textContent,
        "使用可能ホスト数: " + resHostCount.textContent,
        "サブネットマスク: " + resSubnetMask.textContent,
        "ワイルドカードマスク: " + resWildcard.textContent,
        "CIDR表記: " + resCidr.textContent,
        "IPクラス: " + resClass.textContent,
        "IPアドレス（2進数）: " + resBinary.textContent,
        "アドレス種別: " + resType.textContent
      ];

      navigator.clipboard.writeText(lines.join("\n")).then(function () {
        showSuccess("結果をコピーしました。");
      });
    });

    // --- Subnet reference table ---

    function buildSubnetTable() {
      var tbody = document.getElementById("subnet-table-body");
      var entries = [
        { cidr: 8, mask: "255.0.0.0", hosts: "16,777,214" },
        { cidr: 12, mask: "255.240.0.0", hosts: "1,048,574" },
        { cidr: 16, mask: "255.255.0.0", hosts: "65,534" },
        { cidr: 20, mask: "255.255.240.0", hosts: "4,094" },
        { cidr: 21, mask: "255.255.248.0", hosts: "2,046" },
        { cidr: 22, mask: "255.255.252.0", hosts: "1,022" },
        { cidr: 23, mask: "255.255.254.0", hosts: "510" },
        { cidr: 24, mask: "255.255.255.0", hosts: "254" },
        { cidr: 25, mask: "255.255.255.128", hosts: "126" },
        { cidr: 26, mask: "255.255.255.192", hosts: "62" },
        { cidr: 27, mask: "255.255.255.224", hosts: "30" },
        { cidr: 28, mask: "255.255.255.240", hosts: "14" },
        { cidr: 29, mask: "255.255.255.248", hosts: "6" },
        { cidr: 30, mask: "255.255.255.252", hosts: "2" },
        { cidr: 31, mask: "255.255.255.254", hosts: "2 (P2P)" },
        { cidr: 32, mask: "255.255.255.255", hosts: "1" }
      ];

      var html = "";
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        html += "<tr>";
        html += '<td style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--color-border);">/' + e.cidr + "</td>";
        html += '<td style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--color-border);">' + e.mask + "</td>";
        html += '<td style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--color-border);">' + e.hosts + "</td>";
        html += "</tr>";
      }
      tbody.innerHTML = html;
    }

    buildSubnetTable();
  });
})();
