export interface EditorConfigSection {
  pattern: string;
  indentStyle: "space" | "tab";
  indentSize: number;
  charset: string;
  endOfLine: "lf" | "crlf" | "cr";
  trimTrailingWhitespace: boolean;
  insertFinalNewline: boolean;
}

export interface EditorConfigOptions {
  root: boolean;
  sections: EditorConfigSection[];
}

export const LANGUAGE_PRESETS: Record<string, EditorConfigSection> = {
  all: {
    pattern: "*",
    indentStyle: "space",
    indentSize: 4,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  javascript: {
    pattern: "*.{js,jsx}",
    indentStyle: "space",
    indentSize: 2,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  typescript: {
    pattern: "*.{ts,tsx}",
    indentStyle: "space",
    indentSize: 2,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  python: {
    pattern: "*.py",
    indentStyle: "space",
    indentSize: 4,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  go: {
    pattern: "*.go",
    indentStyle: "tab",
    indentSize: 4,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  rust: {
    pattern: "*.rs",
    indentStyle: "space",
    indentSize: 4,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  java: {
    pattern: "*.java",
    indentStyle: "space",
    indentSize: 4,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  ruby: {
    pattern: "*.rb",
    indentStyle: "space",
    indentSize: 2,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  html: {
    pattern: "*.html",
    indentStyle: "space",
    indentSize: 2,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  css: {
    pattern: "*.css",
    indentStyle: "space",
    indentSize: 2,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  json: {
    pattern: "*.json",
    indentStyle: "space",
    indentSize: 2,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  yaml: {
    pattern: "*.{yml,yaml}",
    indentStyle: "space",
    indentSize: 2,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
  markdown: {
    pattern: "*.md",
    indentStyle: "space",
    indentSize: 2,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: false,
    insertFinalNewline: true,
  },
  makefile: {
    pattern: "Makefile",
    indentStyle: "tab",
    indentSize: 4,
    charset: "utf-8",
    endOfLine: "lf",
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },
};

export function getDefaultOptions(): EditorConfigOptions {
  return {
    root: true,
    sections: [],
  };
}

export function generateEditorConfig(options: EditorConfigOptions): string {
  const lines: string[] = [];

  if (options.root) {
    lines.push("root = true");
    lines.push("");
  }

  for (const section of options.sections) {
    lines.push(`[${section.pattern}]`);
    lines.push(`indent_style = ${section.indentStyle}`);
    lines.push(`indent_size = ${section.indentSize}`);
    if (section.indentStyle === "tab") {
      lines.push(`tab_width = ${section.indentSize}`);
    }
    lines.push(`charset = ${section.charset}`);
    lines.push(`end_of_line = ${section.endOfLine}`);
    lines.push(`trim_trailing_whitespace = ${section.trimTrailingWhitespace}`);
    lines.push(`insert_final_newline = ${section.insertFinalNewline}`);
    lines.push("");
  }

  return lines.join("\n");
}
