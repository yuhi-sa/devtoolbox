export type Locale = 'ja' | 'en';

export const defaultLocale: Locale = 'ja';
export const locales: Locale[] = ['ja', 'en'];

// UI translations
const translations = {
  ja: {
    siteTitle: 'DevToolBox - Developer Tools',
    siteDescription: 'JSON整形、Base64、URL エンコード、正規表現テスター、差分比較など、開発者向けツール集。',
    allTools: 'Developer Tools',
    searchPlaceholder: 'ツールを検索...',
    backToTools: '← All Tools',
    comingSoon: 'Coming Soon',
    filterPlaceholder: 'Filter tools...',
    searchHint: 'Cmd+K で検索',
  },
  en: {
    siteTitle: 'DevToolBox - Developer Tools',
    siteDescription: 'A collection of developer tools: JSON formatter, Base64, URL encode, regex tester, diff checker, and more.',
    allTools: 'Developer Tools',
    searchPlaceholder: 'Search tools...',
    backToTools: '← All Tools',
    comingSoon: 'Coming Soon',
    filterPlaceholder: 'Filter tools...',
    searchHint: 'Press Cmd+K to search',
  },
};

export type Translations = typeof translations.ja;

export function getTranslations(locale: Locale): Translations {
  return translations[locale] as Translations;
}

// Tool name/description translations for English
export const toolTranslations: Record<string, { name: string; description: string }> = {
  'json-formatter': { name: 'JSON Formatter', description: 'Format, minify, and validate JSON.' },
  base64: { name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings.' },
  'url-encode': { name: 'URL Encoder/Decoder', description: 'Encode and decode URL strings.' },
  'regex-tester': { name: 'Regex Tester', description: 'Test regular expressions with real-time matching.' },
  'diff-checker': { name: 'Diff Checker', description: 'Compare two texts and highlight differences.' },
  'markdown-preview': { name: 'Markdown Preview', description: 'Preview Markdown with live rendering.' },
  'json-path': { name: 'JSONPath Query', description: 'Query JSON data using JSONPath expressions.' },
  'hash-generator': { name: 'Hash Generator', description: 'Generate SHA-256, MD5, and other hashes.' },
  'password-generator': { name: 'Password Generator', description: 'Generate secure random passwords.' },
  'color-converter': { name: 'Color Converter', description: 'Convert between HEX, RGB, and HSL color formats.' },
  'timestamp-converter': { name: 'Timestamp Converter', description: 'Convert Unix timestamps to human-readable dates.' },
  'uuid-generator': { name: 'UUID Generator', description: 'Generate random UUIDs (v4).' },
  'jwt-decoder': { name: 'JWT Decoder', description: 'Decode JWT token header and payload.' },
  'html-entity': { name: 'HTML Entity Converter', description: 'Encode and decode HTML entities.' },
  'cron-parser': { name: 'Cron Parser', description: 'Parse cron expressions with next execution times.' },
  'ip-calc': { name: 'IP Calculator', description: 'Calculate network address, broadcast, and host range from CIDR.' },
  gradient: { name: 'CSS Gradient Generator', description: 'Generate linear/radial CSS gradients visually.' },
  chmod: { name: 'Chmod Calculator', description: 'Calculate file permissions with intuitive checkbox UI.' },
  'csv-json': { name: 'CSV/JSON Converter', description: 'Bidirectional CSV and JSON conversion.' },
  'sql-formatter': { name: 'SQL Formatter', description: 'Auto-format SQL queries for readability.' },
  'byte-converter': { name: 'Byte Converter', description: 'Convert between B/KB/MB/GB/TB/PB.' },
  'http-status': { name: 'HTTP Status Reference', description: 'Reference for HTTP status codes and their meanings.' },
  lorem: { name: 'Lorem Ipsum Generator', description: 'Generate dummy text by paragraphs, sentences, or words.' },
  'qr-generator': { name: 'QR Code Generator', description: 'Generate QR codes from text or URLs.' },
  'base-converter': { name: 'Number Base Converter', description: 'Convert between binary, octal, decimal, and hexadecimal.' },
  'yaml-formatter': { name: 'YAML Formatter', description: 'Format, validate YAML and convert to/from JSON.' },
  'text-case': { name: 'Text Case Converter', description: 'Convert between camelCase, snake_case, kebab-case, and more.' },
  'url-parser': { name: 'URL Parser', description: 'Parse URLs into components and reconstruct them.' },
  'json-to-ts': { name: 'JSON to TypeScript', description: 'Generate TypeScript type definitions from JSON.' },
  'string-escape': { name: 'String Escape/Unescape', description: 'Escape and unescape strings (JSON, HTML, URL, Unicode).' },
  'css-minifier': { name: 'CSS Minifier/Formatter', description: 'Minify or beautify CSS with size stats.' },
  'html-formatter': { name: 'HTML Formatter', description: 'Format and beautify HTML with proper indentation.' },
  'ascii-table': { name: 'ASCII Table', description: 'Searchable ASCII character reference table.' },
  'crontab-generator': { name: 'Crontab Generator', description: 'Build cron expressions visually with next execution times.' },
  'jwt-generator': { name: 'JWT Generator', description: 'Generate JWT tokens with HS256 signing.' },
  'meta-tag': { name: 'Meta Tag / OGP Generator', description: 'Generate meta tags and preview OGP cards for social sharing.' },
  'gitignore-generator': { name: '.gitignore Generator', description: 'Generate .gitignore files for various languages and frameworks.' },
  'markdown-table': { name: 'Markdown Table Generator', description: 'Build Markdown tables with a visual grid editor.' },
  'placeholder-image': { name: 'Placeholder Image Generator', description: 'Generate SVG placeholder images with custom size and colors.' },
  'regex-builder': { name: 'Regex Builder', description: 'Build regular expressions visually from common patterns.' },
  'svg-viewer': { name: 'SVG Viewer / Optimizer', description: 'Preview, optimize, and analyze SVG files.' },
  'color-palette': { name: 'Color Palette Generator', description: 'Generate color palettes from a base color.' },
  'robots-txt': { name: 'robots.txt Generator', description: 'Generate robots.txt files with custom rules.' },
  'nginx-config': { name: 'Nginx Config Generator', description: 'Generate Nginx server block configurations.' },
  'docker-compose': { name: 'Docker Run to Compose', description: 'Convert docker run commands to docker-compose.yml.' },
  'favicon-generator': { name: 'Favicon Generator', description: 'Generate SVG favicons from emoji or text.' },
  'unicode-lookup': { name: 'Unicode Lookup', description: 'Search Unicode characters by name or code point.' },
};
