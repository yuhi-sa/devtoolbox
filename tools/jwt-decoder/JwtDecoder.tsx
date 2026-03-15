"use client";

import { useState } from "react";
import { decodeJwt, checkExpiration } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [expStatus, setExpStatus] = useState("");
  const [error, setError] = useState("");

  const handleDecode = () => {
    try {
      setError("");
      const result = decodeJwt(input);
      const headerStr = JSON.stringify(result.header, null, 2);
      const payloadStr = JSON.stringify(result.payload, null, 2);
      setHeader(headerStr);
      setPayload(payloadStr);

      const exp = checkExpiration(result.payload);
      if (exp.hasExp) {
        setExpStatus(
          exp.expired
            ? `期限切れ（${exp.expiresAt}）`
            : `有効（期限: ${exp.expiresAt}）`
        );
      } else {
        setExpStatus("exp クレームなし");
      }
    } catch (e) {
      setError((e as Error).message);
      setHeader("");
      setPayload("");
      setExpStatus("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          JWTトークン
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        />
      </div>

      <button
        onClick={handleDecode}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        デコード
      </button>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {header && (
        <div className="space-y-4">
          {expStatus && (
            <div
              className={`text-sm p-2 rounded ${
                expStatus.startsWith("期限切れ")
                  ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                  : "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
              }`}
            >
              {expStatus}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Header
              </label>
              <CopyButton text={header} />
            </div>
            <textarea
              readOnly
              value={header}
              className="w-full h-32 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Payload
              </label>
              <CopyButton text={payload} />
            </div>
            <textarea
              readOnly
              value={payload}
              className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}
