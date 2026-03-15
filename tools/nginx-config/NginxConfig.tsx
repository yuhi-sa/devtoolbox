"use client";

import { useState } from "react";
import { generateNginxConfig, NginxOptions } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function NginxConfig() {
  const [serverName, setServerName] = useState("example.com");
  const [port, setPort] = useState(80);
  const [rootPath, setRootPath] = useState("/var/www/html");
  const [reverseProxy, setReverseProxy] = useState("");
  const [ssl, setSsl] = useState(false);
  const [gzip, setGzip] = useState(false);
  const [cors, setCors] = useState(false);

  const options: NginxOptions = {
    serverName,
    port,
    rootPath: reverseProxy ? undefined : rootPath || undefined,
    reverseProxy: reverseProxy || undefined,
    ssl,
    gzip,
    cors,
  };

  const output = generateNginxConfig(options);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Server Name
          </label>
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Port
          </label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Root Path
          </label>
          <input
            type="text"
            value={rootPath}
            onChange={(e) => setRootPath(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={!!reverseProxy}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Reverse Proxy URL
          </label>
          <input
            type="text"
            value={reverseProxy}
            onChange={(e) => setReverseProxy(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="http://localhost:3000"
          />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={ssl}
            onChange={(e) => {
              setSsl(e.target.checked);
              if (e.target.checked) setPort(443);
            }}
            className="rounded"
          />
          SSL
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={gzip}
            onChange={(e) => setGzip(e.target.checked)}
            className="rounded"
          />
          Gzip
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={cors}
            onChange={(e) => setCors(e.target.checked)}
            className="rounded"
          />
          CORS Headers
        </label>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Generated Config
          </label>
          <CopyButton text={output} />
        </div>
        <textarea
          readOnly
          value={output}
          className="w-full h-80 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
