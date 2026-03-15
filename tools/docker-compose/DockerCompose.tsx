"use client";

import { useState } from "react";
import { parseDockerRun, toComposeYaml } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function DockerCompose() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = () => {
    try {
      if (!input.trim()) {
        setError("Please enter a docker run command");
        setOutput("");
        return;
      }
      const parsed = parseDockerRun(input);
      if (!parsed.image) {
        setError("Could not find image name in the command");
        setOutput("");
        return;
      }
      setError("");
      setOutput(toComposeYaml(parsed));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Convert
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Docker Run Command
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="docker run -d -p 8080:80 --name myapp nginx:latest"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              docker-compose.yml
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
    </div>
  );
}
