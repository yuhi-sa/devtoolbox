"use client";

import Link from "next/link";
import { getToolById } from "@/application/registry";
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
import MetaTagGenerator from "@/tools/meta-tag/MetaTagGenerator";
import GitignoreGenerator from "@/tools/gitignore-generator/GitignoreGenerator";
import MarkdownTable from "@/tools/markdown-table/MarkdownTable";
import PlaceholderImage from "@/tools/placeholder-image/PlaceholderImage";
import RegexBuilder from "@/tools/regex-builder/RegexBuilder";
import SvgViewer from "@/tools/svg-viewer/SvgViewer";
import ColorPalette from "@/tools/color-palette/ColorPalette";
import RobotsTxtGenerator from "@/tools/robots-txt/RobotsTxtGenerator";
import NginxConfig from "@/tools/nginx-config/NginxConfig";
import DockerCompose from "@/tools/docker-compose/DockerCompose";
import FaviconGenerator from "@/tools/favicon-generator/FaviconGenerator";
import UnicodeLookup from "@/tools/unicode-lookup/UnicodeLookup";
import HexEncoder from "@/tools/hex-encoder/HexEncoder";
import Rot13Tool from "@/tools/rot13/Rot13Tool";
import MorseCode from "@/tools/morse-code/MorseCode";
import TomlConverter from "@/tools/toml-converter/TomlConverter";
import NumberFormatter from "@/tools/number-formatter/NumberFormatter";
import CssUnitConverter from "@/tools/css-unit-converter/CssUnitConverter";
import XmlJsonConverter from "@/tools/xml-json/XmlJsonConverter";
import MarkdownHtml from "@/tools/markdown-html/MarkdownHtml";
import JsFormatter from "@/tools/js-formatter/JsFormatter";
import XmlFormatter from "@/tools/xml-formatter/XmlFormatter";
import SlugGenerator from "@/tools/slug-generator/SlugGenerator";
import DataUrlGenerator from "@/tools/data-url/DataUrlGenerator";
import BoxShadow from "@/tools/box-shadow/BoxShadow";
import BorderRadius from "@/tools/border-radius/BorderRadius";
import FlexboxGenerator from "@/tools/flexbox-generator/FlexboxGenerator";
import GridGenerator from "@/tools/grid-generator/GridGenerator";
import TextCounter from "@/tools/text-counter/TextCounter";
import JsonSize from "@/tools/json-size/JsonSize";
import DateCalculator from "@/tools/date-calculator/DateCalculator";
import AspectRatio from "@/tools/aspect-ratio/AspectRatio";
import ColorContrast from "@/tools/color-contrast/ColorContrast";
import EmojiPicker from "@/tools/emoji-picker/EmojiPicker";
import JsonValidator from "@/tools/json-validator/JsonValidator";
import SemverTester from "@/tools/semver-tester/SemverTester";
import HtmlColors from "@/tools/html-colors/HtmlColors";
import MimeTypes from "@/tools/mime-types/MimeTypes";
import KeyboardCodes from "@/tools/keyboard-codes/KeyboardCodes";
import CssSpecificity from "@/tools/css-specificity/CssSpecificity";
import EmailValidator from "@/tools/email-validator/EmailValidator";
import HtaccessGenerator from "@/tools/htaccess-generator/HtaccessGenerator";
import EditorConfig from "@/tools/editorconfig/EditorConfig";
import TsconfigGenerator from "@/tools/tsconfig/TsconfigGenerator";
import NanoidGenerator from "@/tools/nanoid/NanoidGenerator";
import PunycodeTool from "@/tools/punycode/PunycodeTool";
import SqlGenerator from "@/tools/sql-generator/SqlGenerator";
import EslintConfig from "@/tools/eslint-config/EslintConfig";
import TextDiffInline from "@/tools/text-diff-inline/TextDiffInline";
import JsonToGo from "@/tools/json-to-go/JsonToGo";
import JsonToPython from "@/tools/json-to-python/JsonToPython";
import Base58Tool from "@/tools/base58/Base58Tool";

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
  "meta-tag": MetaTagGenerator,
  "gitignore-generator": GitignoreGenerator,
  "markdown-table": MarkdownTable,
  "placeholder-image": PlaceholderImage,
  "regex-builder": RegexBuilder,
  "svg-viewer": SvgViewer,
  "color-palette": ColorPalette,
  "robots-txt": RobotsTxtGenerator,
  "nginx-config": NginxConfig,
  "docker-compose": DockerCompose,
  "favicon-generator": FaviconGenerator,
  "unicode-lookup": UnicodeLookup,
  "hex-encoder": HexEncoder,
  rot13: Rot13Tool,
  "morse-code": MorseCode,
  "toml-converter": TomlConverter,
  "number-formatter": NumberFormatter,
  "css-unit-converter": CssUnitConverter,
  "xml-json": XmlJsonConverter,
  "markdown-html": MarkdownHtml,
  "js-formatter": JsFormatter,
  "xml-formatter": XmlFormatter,
  "slug-generator": SlugGenerator,
  "data-url": DataUrlGenerator,
  "box-shadow": BoxShadow,
  "border-radius": BorderRadius,
  "flexbox-generator": FlexboxGenerator,
  "grid-generator": GridGenerator,
  "text-counter": TextCounter,
  "json-size": JsonSize,
  "date-calculator": DateCalculator,
  "aspect-ratio": AspectRatio,
  "color-contrast": ColorContrast,
  "emoji-picker": EmojiPicker,
  "json-validator": JsonValidator,
  "semver-tester": SemverTester,
  "html-colors": HtmlColors,
  "mime-types": MimeTypes,
  "keyboard-codes": KeyboardCodes,
  "css-specificity": CssSpecificity,
  "email-validator": EmailValidator,
  "htaccess-generator": HtaccessGenerator,
  editorconfig: EditorConfig,
  tsconfig: TsconfigGenerator,
  nanoid: NanoidGenerator,
  punycode: PunycodeTool,
  "sql-generator": SqlGenerator,
  "eslint-config": EslintConfig,
  "text-diff-inline": TextDiffInline,
  "json-to-go": JsonToGo,
  "json-to-python": JsonToPython,
  base58: Base58Tool,
};

export default function ToolPageClient({ toolId }: { toolId: string }) {
  const tool = getToolById(toolId);
  const Component = toolComponents[toolId];

  if (!tool || !Component) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">Tool not found</h1>
        <Link href="/" className="text-blue-600 dark:text-blue-400 underline">
          Back to tools
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          &larr; All Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">{tool.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
      </div>
      <Component />
    </div>
  );
}
