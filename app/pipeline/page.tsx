"use client";

import Link from "next/link";
import PipelineTool from "@/tools/pipeline/PipelineTool";

export default function PipelinePage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          &larr; All Tools
        </Link>
        <h1 className="text-2xl font-bold mt-2">Pipeline</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Chain multiple transformations together. Add steps and run them in
          sequence.
        </p>
      </div>
      <PipelineTool />
    </div>
  );
}
