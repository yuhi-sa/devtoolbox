export interface GitignoreTemplate {
  id: string;
  name: string;
  category: "language" | "framework" | "os" | "editor";
  patterns: string[];
}

const templates: GitignoreTemplate[] = [
  {
    id: "node",
    name: "Node.js",
    category: "language",
    patterns: [
      "node_modules/",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      ".npm",
      ".yarn-integrity",
      "dist/",
      "build/",
      ".env",
      ".env.local",
    ],
  },
  {
    id: "python",
    name: "Python",
    category: "language",
    patterns: [
      "__pycache__/",
      "*.py[cod]",
      "*$py.class",
      "*.so",
      ".Python",
      "env/",
      "venv/",
      ".venv/",
      "*.egg-info/",
      "dist/",
      "build/",
      ".eggs/",
      "*.egg",
      ".mypy_cache/",
      ".pytest_cache/",
    ],
  },
  {
    id: "java",
    name: "Java",
    category: "language",
    patterns: [
      "*.class",
      "*.jar",
      "*.war",
      "*.ear",
      "target/",
      ".gradle/",
      "build/",
      "out/",
      ".settings/",
      ".classpath",
      ".project",
    ],
  },
  {
    id: "go",
    name: "Go",
    category: "language",
    patterns: ["*.exe", "*.exe~", "*.dll", "*.so", "*.dylib", "*.test", "*.out", "vendor/"],
  },
  {
    id: "rust",
    name: "Rust",
    category: "language",
    patterns: ["target/", "Cargo.lock", "**/*.rs.bk"],
  },
  {
    id: "ruby",
    name: "Ruby",
    category: "language",
    patterns: [
      "*.gem",
      "*.rbc",
      ".bundle/",
      "vendor/bundle",
      "log/",
      "tmp/",
      ".byebug_history",
      "coverage/",
    ],
  },
  {
    id: "c-cpp",
    name: "C/C++",
    category: "language",
    patterns: [
      "*.o",
      "*.obj",
      "*.so",
      "*.dylib",
      "*.dll",
      "*.a",
      "*.lib",
      "*.exe",
      "*.out",
      "build/",
      "cmake-build-*/",
    ],
  },
  {
    id: "swift",
    name: "Swift",
    category: "language",
    patterns: [
      ".build/",
      "Packages/",
      "xcuserdata/",
      "*.xcscmblueprint",
      "*.xccheckout",
      "DerivedData/",
      ".swiftpm/",
    ],
  },
  {
    id: "kotlin",
    name: "Kotlin",
    category: "language",
    patterns: ["*.class", "*.jar", "*.war", "build/", ".gradle/", "out/", ".kotlin/"],
  },
  {
    id: "react",
    name: "React",
    category: "framework",
    patterns: [
      "node_modules/",
      "build/",
      ".env.local",
      ".env.development.local",
      ".env.test.local",
      ".env.production.local",
      "coverage/",
    ],
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "framework",
    patterns: [
      "node_modules/",
      ".next/",
      "out/",
      ".env*.local",
      "next-env.d.ts",
      ".vercel",
    ],
  },
  {
    id: "vue",
    name: "Vue",
    category: "framework",
    patterns: [
      "node_modules/",
      "dist/",
      ".env.local",
      ".env.*.local",
      "coverage/",
      "*.local",
    ],
  },
  {
    id: "angular",
    name: "Angular",
    category: "framework",
    patterns: [
      "node_modules/",
      "dist/",
      "tmp/",
      "out-tsc/",
      ".angular/",
      ".sass-cache/",
      "coverage/",
    ],
  },
  {
    id: "unity",
    name: "Unity",
    category: "framework",
    patterns: [
      "[Ll]ibrary/",
      "[Tt]emp/",
      "[Oo]bj/",
      "[Bb]uild/",
      "[Bb]uilds/",
      "[Ll]ogs/",
      "UserSettings/",
      "MemoryCaptures/",
      "*.cginc",
      "*.unitypackage",
      "crashlytics-build.properties",
    ],
  },
  {
    id: "macos",
    name: "macOS",
    category: "os",
    patterns: [
      ".DS_Store",
      ".AppleDouble",
      ".LSOverride",
      "._*",
      ".Spotlight-V100",
      ".Trashes",
      "Icon?",
    ],
  },
  {
    id: "windows",
    name: "Windows",
    category: "os",
    patterns: [
      "Thumbs.db",
      "Thumbs.db:encryptable",
      "ehthumbs.db",
      "ehthumbs_vista.db",
      "Desktop.ini",
      "$RECYCLE.BIN/",
      "*.lnk",
    ],
  },
  {
    id: "linux",
    name: "Linux",
    category: "os",
    patterns: ["*~", ".fuse_hidden*", ".directory", ".Trash-*", ".nfs*"],
  },
  {
    id: "jetbrains",
    name: "JetBrains",
    category: "editor",
    patterns: [
      ".idea/",
      "*.iml",
      "*.iws",
      "*.ipr",
      "out/",
      "cmake-build-*/",
      ".idea_modules/",
    ],
  },
  {
    id: "vscode",
    name: "VSCode",
    category: "editor",
    patterns: [
      ".vscode/*",
      "!.vscode/settings.json",
      "!.vscode/tasks.json",
      "!.vscode/launch.json",
      "!.vscode/extensions.json",
      "*.code-workspace",
      ".history/",
    ],
  },
];

export function getTemplates(): GitignoreTemplate[] {
  return templates;
}

export function generateGitignore(selectedIds: string[]): string {
  const sections: string[] = [];

  for (const id of selectedIds) {
    const template = templates.find((t) => t.id === id);
    if (!template) continue;

    const section = `# ${template.name}\n${template.patterns.join("\n")}`;
    sections.push(section);
  }

  return sections.join("\n\n") + "\n";
}
