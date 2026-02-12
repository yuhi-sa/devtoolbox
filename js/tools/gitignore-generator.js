"use strict";

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var outputEl = document.getElementById("gitignore-output");
    var successEl = document.getElementById("gitignore-success");
    var btnCopy = document.getElementById("btn-copy");
    var btnDownload = document.getElementById("btn-download");
    var btnClear = document.getElementById("btn-clear");

    var TEMPLATES = {
      // 言語・フレームワーク
      "Node.js": {
        category: "lang",
        patterns: [
          "# Node.js",
          "node_modules/",
          "npm-debug.log*",
          "yarn-debug.log*",
          "yarn-error.log*",
          "pnpm-debug.log*",
          ".pnpm-store/",
          "dist/",
          "build/",
          ".env",
          ".env.local",
          ".env.*.local",
          "coverage/",
          ".nyc_output/",
          ".cache/",
          ".parcel-cache/",
          ".next/",
          ".nuxt/",
          ".vuepress/dist",
          ".svelte-kit/",
          "*.tsbuildinfo"
        ]
      },
      "Python": {
        category: "lang",
        patterns: [
          "# Python",
          "__pycache__/",
          "*.py[cod]",
          "*$py.class",
          "*.so",
          ".Python",
          "build/",
          "develop-eggs/",
          "dist/",
          "downloads/",
          "eggs/",
          ".eggs/",
          "lib/",
          "lib64/",
          "parts/",
          "sdist/",
          "var/",
          "wheels/",
          "*.egg-info/",
          ".installed.cfg",
          "*.egg",
          "*.manifest",
          "*.spec",
          "pip-log.txt",
          "pip-delete-this-directory.txt",
          ".venv/",
          "venv/",
          "ENV/",
          "env/",
          ".env",
          "*.env",
          ".mypy_cache/",
          ".pytest_cache/",
          ".ruff_cache/",
          "htmlcov/",
          ".coverage",
          ".coverage.*",
          "coverage.xml",
          "*.cover",
          ".hypothesis/"
        ]
      },
      "Java": {
        category: "lang",
        patterns: [
          "# Java",
          "*.class",
          "*.log",
          "*.jar",
          "*.war",
          "*.nar",
          "*.ear",
          "*.zip",
          "*.tar.gz",
          "*.rar",
          "hs_err_pid*",
          "replay_pid*",
          "target/",
          "build/",
          ".gradle/",
          "gradle/wrapper/gradle-wrapper.jar",
          "out/",
          ".settings/",
          ".classpath",
          ".project",
          ".factorypath"
        ]
      },
      "Go": {
        category: "lang",
        patterns: [
          "# Go",
          "*.exe",
          "*.exe~",
          "*.dll",
          "*.so",
          "*.dylib",
          "*.test",
          "*.out",
          "vendor/",
          "go.work",
          ".env"
        ]
      },
      "Rust": {
        category: "lang",
        patterns: [
          "# Rust",
          "debug/",
          "target/",
          "Cargo.lock",
          "**/*.rs.bk",
          "*.pdb"
        ]
      },
      "Ruby": {
        category: "lang",
        patterns: [
          "# Ruby",
          "*.gem",
          "*.rbc",
          "/.config",
          "/coverage/",
          "/InstalledFiles",
          "/pkg/",
          "/spec/reports/",
          "/spec/examples.txt",
          "/test/tmp/",
          "/test/version_tmp/",
          "/tmp/",
          ".dat*",
          ".repl_history",
          "build/",
          "doc/",
          "*.bundle",
          "vendor/bundle",
          "lib/bundler/man/",
          ".byebug_history",
          ".ruby-version",
          ".ruby-gemset",
          "Gemfile.lock"
        ]
      },
      "C/C++": {
        category: "lang",
        patterns: [
          "# C/C++",
          "*.d",
          "*.slo",
          "*.lo",
          "*.o",
          "*.obj",
          "*.gch",
          "*.pch",
          "*.so",
          "*.dylib",
          "*.dll",
          "*.mod",
          "*.smod",
          "*.lai",
          "*.la",
          "*.a",
          "*.lib",
          "*.exe",
          "*.out",
          "*.app",
          "build/",
          "cmake-build-*/",
          "CMakeFiles/",
          "CMakeCache.txt",
          "cmake_install.cmake",
          "compile_commands.json"
        ]
      },
      "Swift": {
        category: "lang",
        patterns: [
          "# Swift",
          ".build/",
          "Packages/",
          "Package.pins",
          "Package.resolved",
          "xcuserdata/",
          "*.xcscmblueprint",
          "*.xccheckout",
          "DerivedData/",
          "*.moved-aside",
          "*.pbxuser",
          "*.mode1v3",
          "*.mode2v3",
          "*.perspectivev3",
          "*.hmap",
          "*.ipa",
          "*.dSYM.zip",
          "*.dSYM",
          "Carthage/Build/",
          ".swiftpm/"
        ]
      },
      "Kotlin": {
        category: "lang",
        patterns: [
          "# Kotlin",
          "*.class",
          "*.log",
          "*.jar",
          "*.war",
          "*.nar",
          "*.ear",
          "target/",
          "build/",
          ".gradle/",
          "out/",
          ".kotlin/"
        ]
      },
      "PHP": {
        category: "lang",
        patterns: [
          "# PHP",
          "/vendor/",
          "composer.phar",
          "composer.lock",
          "*.cache",
          ".phpunit.result.cache",
          "phpunit.xml",
          ".php_cs.cache",
          ".php-cs-fixer.cache",
          "/node_modules/",
          "/storage/*.key",
          ".env",
          ".env.backup",
          ".env.production",
          "Homestead.json",
          "Homestead.yaml",
          "npm-debug.log",
          "yarn-error.log"
        ]
      },
      ".NET/C#": {
        category: "lang",
        patterns: [
          "# .NET/C#",
          "*.suo",
          "*.user",
          "*.userosscache",
          "*.sln.docstates",
          "[Dd]ebug/",
          "[Rr]elease/",
          "x64/",
          "x86/",
          "[Aa][Rr][Mm]/",
          "[Aa][Rr][Mm]64/",
          "bld/",
          "[Bb]in/",
          "[Oo]bj/",
          "[Ll]og/",
          "[Ll]ogs/",
          ".vs/",
          "packages/",
          "*.nupkg",
          "*.snupkg",
          "project.lock.json",
          "*.nuget.props",
          "*.nuget.targets"
        ]
      },
      "Unity": {
        category: "lang",
        patterns: [
          "# Unity",
          "/[Ll]ibrary/",
          "/[Tt]emp/",
          "/[Oo]bj/",
          "/[Bb]uild/",
          "/[Bb]uilds/",
          "/[Ll]ogs/",
          "/[Uu]ser[Ss]ettings/",
          "/[Mm]emoryCaptures/",
          "/[Rr]ecordings/",
          "*.cginc",
          "sysinfo.txt",
          "*.apk",
          "*.aab",
          "*.unitypackage",
          "*.app",
          "crashlytics-build.properties",
          "/[Aa]ssets/[Aa]ddressable[Aa]ssets[Dd]ata/*/*.bin*",
          "/[Aa]ssets/[Ss]treamingAssets/aa.meta",
          "/[Aa]ssets/[Ss]treamingAssets/aa/*"
        ]
      },
      // OS
      "macOS": {
        category: "os",
        patterns: [
          "# macOS",
          ".DS_Store",
          ".AppleDouble",
          ".LSOverride",
          "Icon",
          "._*",
          ".DocumentRevisions-V100",
          ".fseventsd",
          ".Spotlight-V100",
          ".TemporaryItems",
          ".Trashes",
          ".VolumeIcon.icns",
          ".com.apple.timemachine.donotpresent",
          ".AppleDB",
          ".AppleDesktop",
          "Network Trash Folder",
          "Temporary Items",
          ".apdisk"
        ]
      },
      "Windows": {
        category: "os",
        patterns: [
          "# Windows",
          "Thumbs.db",
          "Thumbs.db:encryptable",
          "ehthumbs.db",
          "ehthumbs_vista.db",
          "*.stackdump",
          "[Dd]esktop.ini",
          "$RECYCLE.BIN/",
          "*.cab",
          "*.msi",
          "*.msix",
          "*.msm",
          "*.msp",
          "*.lnk"
        ]
      },
      "Linux": {
        category: "os",
        patterns: [
          "# Linux",
          "*~",
          ".fuse_hidden*",
          ".directory",
          ".Trash-*",
          ".nfs*"
        ]
      },
      // エディタ・IDE
      "JetBrains": {
        category: "editor",
        patterns: [
          "# JetBrains IDE",
          ".idea/",
          "*.iws",
          "*.iml",
          "*.ipr",
          "out/",
          "cmake-build-*/",
          ".idea/**/workspace.xml",
          ".idea/**/tasks.xml",
          ".idea/**/usage.statistics.xml",
          ".idea/**/dictionaries",
          ".idea/**/shelf",
          ".idea/**/contentModel.xml",
          ".idea/**/dataSources/",
          ".idea/**/dataSources.ids",
          ".idea/**/dataSources.local.xml",
          ".idea/**/sqlDataSources.xml",
          ".idea/**/dynamic.xml",
          ".idea/**/uiDesigner.xml",
          ".idea/**/dbnavigator.xml"
        ]
      },
      "VS Code": {
        category: "editor",
        patterns: [
          "# VS Code",
          ".vscode/*",
          "!.vscode/settings.json",
          "!.vscode/tasks.json",
          "!.vscode/launch.json",
          "!.vscode/extensions.json",
          "!.vscode/*.code-snippets",
          ".history/",
          "*.vsix"
        ]
      },
      "Vim": {
        category: "editor",
        patterns: [
          "# Vim",
          "[._]*.s[a-v][a-z]",
          "!*.svg",
          "[._]*.sw[a-p]",
          "[._]s[a-rt-v][a-z]",
          "[._]ss[a-gi-z]",
          "[._]sw[a-p]",
          "Session.vim",
          "Sessionx.vim",
          ".netrwhist",
          "*~",
          "tags",
          "[._]*.un~"
        ]
      },
      "Emacs": {
        category: "editor",
        patterns: [
          "# Emacs",
          "*~",
          "\\#*\\#",
          "/.emacs.desktop",
          "/.emacs.desktop.lock",
          "*.elc",
          "auto-save-list",
          "tramp",
          ".\\#*",
          "flycheck_*.el",
          ".projectile",
          ".dir-locals.el",
          ".cask/"
        ]
      }
    };

    function createCheckbox(name, container) {
      var label = document.createElement("label");
      label.className = "label";
      label.style.cssText = "display:inline-flex;align-items:center;gap:0.5rem;padding:0.375rem 0.75rem;border:1px solid var(--color-border);border-radius:var(--radius-sm);cursor:pointer;font-size:0.875rem;transition:border-color 0.2s;";
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = name;
      cb.addEventListener("change", generateOutput);
      label.appendChild(cb);
      label.appendChild(document.createTextNode(name));
      container.appendChild(label);
    }

    function showSuccess(msg) {
      successEl.textContent = msg;
      successEl.hidden = false;
      setTimeout(function () { successEl.hidden = true; }, 2000);
    }

    function generateOutput() {
      var selected = document.querySelectorAll("#gitignore-lang input:checked, #gitignore-os input:checked, #gitignore-editor input:checked");
      var sections = [];
      selected.forEach(function (cb) {
        var tmpl = TEMPLATES[cb.value];
        if (tmpl) {
          sections.push(tmpl.patterns.join("\n"));
        }
      });
      outputEl.value = sections.join("\n\n");
    }

    // テンプレートチェックボックスを生成
    var langContainer = document.getElementById("gitignore-lang");
    var osContainer = document.getElementById("gitignore-os");
    var editorContainer = document.getElementById("gitignore-editor");

    var keys = Object.keys(TEMPLATES);
    for (var i = 0; i < keys.length; i++) {
      var name = keys[i];
      var tmpl = TEMPLATES[name];
      if (tmpl.category === "lang") {
        createCheckbox(name, langContainer);
      } else if (tmpl.category === "os") {
        createCheckbox(name, osContainer);
      } else if (tmpl.category === "editor") {
        createCheckbox(name, editorContainer);
      }
    }

    btnCopy.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        showSuccess("コピーしました。");
      });
    });

    btnDownload.addEventListener("click", function () {
      var text = outputEl.value;
      if (!text) return;
      var blob = new Blob([text], { type: "text/plain" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = ".gitignore";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showSuccess(".gitignoreファイルをダウンロードしました。");
    });

    btnClear.addEventListener("click", function () {
      var checkboxes = document.querySelectorAll("#gitignore-lang input, #gitignore-os input, #gitignore-editor input");
      checkboxes.forEach(function (cb) { cb.checked = false; });
      outputEl.value = "";
    });
  });
})();
