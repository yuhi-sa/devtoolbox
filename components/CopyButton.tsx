"use client";

import { useState } from "react";
import { copyToClipboard } from "@/infrastructure/clipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className="px-3 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 transition disabled:opacity-50"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
