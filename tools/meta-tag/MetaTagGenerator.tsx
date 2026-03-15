"use client";

import { useState } from "react";
import { generateMetaTags, generateOgpPreview } from "./logic";
import type { MetaTagOptions } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [type, setType] = useState<"website" | "article">("website");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const options: MetaTagOptions = {
      title,
      description,
      url,
      imageUrl,
      siteName,
      type,
    };
    setOutput(generateMetaTags(options));
  };

  const preview = generateOgpPreview({
    title,
    description,
    url,
    imageUrl,
    siteName,
    type,
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Page Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={2}
              placeholder="Page description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://example.com/image.png"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="My Website"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "website" | "article")
                }
                className="p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="website">Website</option>
                <option value="article">Article</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Generate Meta Tags
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              OGP Preview (Facebook / Link Share)
            </h3>
            <div className="border rounded-lg overflow-hidden dark:border-gray-600">
              {preview.imageUrl && (
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500">
                  Image: {preview.imageUrl}
                </div>
              )}
              <div className="p-3 bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 uppercase">
                  {preview.siteName || new URL(preview.url).hostname}
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {preview.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {preview.description}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Twitter Card Preview
            </h3>
            <div className="border rounded-lg overflow-hidden dark:border-gray-600">
              {preview.imageUrl && (
                <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500">
                  Image: {preview.imageUrl}
                </div>
              )}
              <div className="p-3 bg-white dark:bg-gray-800">
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  {preview.title}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {preview.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {preview.url}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Meta Tags
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      )}
    </div>
  );
}
