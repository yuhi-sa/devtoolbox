"use client";

import Link from "next/link";
import { getToolById } from "@/application/registry";
import { toolTranslations } from "@/application/i18n";
import JsonFormatter from "@/tools/json-formatter/JsonFormatter";
import Base64Tool from "@/tools/base64/Base64Tool";
import UrlEncodeTool from "@/tools/url-encode/UrlEncodeTool";
import RegexTester from "@/tools/regex-tester/RegexTester";
import DiffChecker from "@/tools/diff-checker/DiffChecker";
import MarkdownPreview from "@/tools/markdown-preview/MarkdownPreview";
import JsonPathTool from "@/tools/json-path/JsonPathTool";
import HashGenerator from "@/tools/hash-generator/HashGenerator";
import PasswordGenerator from "@/tools/password-generator/PasswordGenerator";
import ColorConverter from "@/tools/color-converter/ColorConverter";
import TimestampConverter from "@/tools/timestamp-converter/TimestampConverter";
import UuidGenerator from "@/tools/uuid-generator/UuidGenerator";
import JwtDecoder from "@/tools/jwt-decoder/JwtDecoder";
import HtmlEntityTool from "@/tools/html-entity/HtmlEntityTool";
import CronParser from "@/tools/cron-parser/CronParser";
import IpCalculator from "@/tools/ip-calc/IpCalculator";
import GradientGenerator from "@/tools/gradient/GradientGenerator";
import ChmodCalculator from "@/tools/chmod/ChmodCalculator";
import CsvJsonConverter from "@/tools/csv-json/CsvJsonConverter";
import SqlFormatter from "@/tools/sql-formatter/SqlFormatter";
import ByteConverter from "@/tools/byte-converter/ByteConverter";
import HttpStatusReference from "@/tools/http-status/HttpStatusReference";
import LoremGenerator from "@/tools/lorem/LoremGenerator";
import QrGenerator from "@/tools/qr-generator/QrGenerator";
import BaseConverter from "@/tools/base-converter/BaseConverter";
import YamlFormatter from "@/tools/yaml-formatter/YamlFormatter";
import TextCaseConverter from "@/tools/text-case/TextCaseConverter";
import UrlParser from "@/tools/url-parser/UrlParser";
import JsonToTs from "@/tools/json-to-ts/JsonToTs";
import StringEscape from "@/tools/string-escape/StringEscape";
import CssMinifier from "@/tools/css-minifier/CssMinifier";
import HtmlFormatter from "@/tools/html-formatter/HtmlFormatter";
import AsciiTable from "@/tools/ascii-table/AsciiTable";
import CrontabGenerator from "@/tools/crontab-generator/CrontabGenerator";
import JwtGenerator from "@/tools/jwt-generator/JwtGenerator";

const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatter,
  base64: Base64Tool,
  "url-encode": UrlEncodeTool,
  "regex-tester": RegexTester,
  "diff-checker": DiffChecker,
  "markdown-preview": MarkdownPreview,
  "json-path": JsonPathTool,
  "hash-generator": HashGenerator,
  "password-generator": PasswordGenerator,
  "color-converter": ColorConverter,
  "timestamp-converter": TimestampConverter,
  "uuid-generator": UuidGenerator,
  "jwt-decoder": JwtDecoder,
  "html-entity": HtmlEntityTool,
  "cron-parser": CronParser,
  "ip-calc": IpCalculator,
  gradient: GradientGenerator,
  chmod: ChmodCalculator,
  "csv-json": CsvJsonConverter,
  "sql-formatter": SqlFormatter,
  "byte-converter": ByteConverter,
  "http-status": HttpStatusReference,
  lorem: LoremGenerator,
  "qr-generator": QrGenerator,
  "base-converter": BaseConverter,
  "yaml-formatter": YamlFormatter,
  "text-case": TextCaseConverter,
  "url-parser": UrlParser,
  "json-to-ts": JsonToTs,
  "string-escape": StringEscape,
  "css-minifier": CssMinifier,
  "html-formatter": HtmlFormatter,
  "ascii-table": AsciiTable,
  "crontab-generator": CrontabGenerator,
  "jwt-generator": JwtGenerator,
};

export default function EnToolPageClient({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId);
  const Component = toolComponents[toolId];
  const en = toolTranslations[toolId];

  if (!tool || !Component) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">Tool not found</h1>
        <Link href="/en" className="text-blue-600 dark:text-blue-400 underline">
          Back to tools
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/en"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          &larr; All Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">{en?.name || tool.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {en?.description || tool.description}
        </p>
      </div>
      <Component />
    </div>
  );
}
