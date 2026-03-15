import { ToolDefinition } from "./types";

export const tools: ToolDefinition[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "JSON整形・圧縮・バリデーション",
    category: "Formatter",
    icon: "{ }",
    implemented: true,
  },
  {
    id: "base64",
    name: "Base64",
    description: "Base64エンコード/デコード",
    category: "Encoder",
    icon: "B64",
    implemented: true,
  },
  {
    id: "url-encode",
    name: "URL Encode",
    description: "URLエンコード/デコード",
    category: "Encoder",
    icon: "%20",
    implemented: true,
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "正規表現テスター",
    category: "Tester",
    icon: ".*",
    implemented: true,
  },
  {
    id: "diff-checker",
    name: "Diff Checker",
    description: "テキスト差分比較",
    category: "Comparator",
    icon: "+-",
    implemented: true,
  },
  {
    id: "markdown-preview",
    name: "Markdown Preview",
    description: "Markdownプレビュー",
    category: "Preview",
    icon: "MD",
    implemented: true,
  },
  {
    id: "json-path",
    name: "JSONPath",
    description: "JSONPath検索",
    category: "Query",
    icon: "$..",
    implemented: true,
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description: "ハッシュ生成（SHA-256等）",
    category: "Crypto",
    icon: "#",
    implemented: true,
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "パスワード生成",
    category: "Crypto",
    icon: "***",
    implemented: true,
  },
  {
    id: "color-converter",
    name: "Color Converter",
    description: "HEX/RGB/HSL変換",
    category: "Converter",
    icon: "CLR",
    implemented: false,
  },
  {
    id: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Unix Timestamp変換",
    category: "Converter",
    icon: "TS",
    implemented: false,
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "UUID生成",
    category: "Generator",
    icon: "ID",
    implemented: false,
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "JWTトークンデコード",
    category: "Decoder",
    icon: "JWT",
    implemented: false,
  },
  {
    id: "html-entity",
    name: "HTML Entity",
    description: "HTMLエンティティ変換",
    category: "Encoder",
    icon: "&;",
    implemented: false,
  },
  {
    id: "cron-parser",
    name: "Cron Parser",
    description: "Cron式パーサー",
    category: "Parser",
    icon: "CRN",
    implemented: false,
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((t) => t.id === id);
}

export function getImplementedTools(): ToolDefinition[] {
  return tools.filter((t) => t.implemented);
}
