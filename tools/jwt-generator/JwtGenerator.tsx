"use client";

import { useState } from "react";
import {
  generateJwt,
  decodeJwtParts,
  getDefaultHeader,
  getDefaultPayload,
} from "./logic";
import CopyButton from "@/components/CopyButton";

export default function JwtGenerator() {
  const [headerText, setHeaderText] = useState(
    JSON.stringify(getDefaultHeader(), null, 2)
  );
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(getDefaultPayload(), null, 2)
  );
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      setError("");
      const header = JSON.parse(headerText);
      const payload = JSON.parse(payloadText);
      const jwt = await generateJwt(header, payload, secret);
      setToken(jwt);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDecode = () => {
    try {
      setError("");
      const result = decodeJwtParts(token);
      if (!result) {
        setError("Invalid JWT format. Expected 3 dot-separated parts.");
        return;
      }
      setHeaderText(result.header);
      setPayloadText(result.payload);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const decoded = token ? decodeJwtParts(token) : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate Token
        </button>
        <button
          onClick={handleDecode}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Decode Token
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Header
            </label>
            <textarea
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              className="w-full h-28 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder='{"alg": "HS256", "typ": "JWT"}'
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Payload
            </label>
            <textarea
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              className="w-full h-36 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder='{"sub": "1234567890", "name": "John Doe"}'
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Secret (HS256)
            </label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-3 py-2 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter signing secret..."
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Encoded Token
            </label>
            <CopyButton text={token} />
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full h-40 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none break-all"
            placeholder="Generated JWT will appear here..."
          />
          {decoded && (
            <div className="mt-3 space-y-2 text-xs">
              <div>
                <span className="font-medium text-red-500">Header:</span>
                <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded mt-1 overflow-x-auto">
                  {decoded.header}
                </pre>
              </div>
              <div>
                <span className="font-medium text-purple-500">Payload:</span>
                <pre className="bg-gray-50 dark:bg-gray-900 p-2 rounded mt-1 overflow-x-auto">
                  {decoded.payload}
                </pre>
              </div>
              <div>
                <span className="font-medium text-blue-500">Signature:</span>
                <code className="ml-1 text-gray-600 dark:text-gray-400 break-all">
                  {decoded.signature}
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
