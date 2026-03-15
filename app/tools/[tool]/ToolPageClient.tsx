"use client";

import Link from "next/link";
import { getToolById } from "@/lib/tools-registry";
import JsonFormatter from "@/tools/json-formatter/JsonFormatter";
import Base64Tool from "@/tools/base64/Base64Tool";
import UrlEncodeTool from "@/tools/url-encode/UrlEncodeTool";
import RegexTester from "@/tools/regex-tester/RegexTester";
import DiffChecker from "@/tools/diff-checker/DiffChecker";
import MarkdownPreview from "@/tools/markdown-preview/MarkdownPreview";
import JsonPathTool from "@/tools/json-path/JsonPathTool";
import HashGenerator from "@/tools/hash-generator/HashGenerator";
import PasswordGenerator from "@/tools/password-generator/PasswordGenerator";

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
