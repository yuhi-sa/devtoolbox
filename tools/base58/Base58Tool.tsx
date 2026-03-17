"use client";

import { useState } from "react";
import {
  base58Encode,
  base58Decode,
  base58EncodeBytes,
  base58DecodeToBytes,
  base58CheckEncode,
  base58CheckDecode,
  bytesToHex,
  hexToBytes,
} from "./logic";
import CopyButton from "@/components/CopyButton";

type InputMode = "text" | "hex";

export default function Base58Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [checkOutput, setCheckOutput] = useState("");
  const [error, setError] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("text");

  const handleEncode = async () => {
    try {
      setError("");
      let encoded: string;
      let checkEncoded: string;

      if (inputMode === "hex") {
        const bytes = hexToBytes(input);
        encoded = base58EncodeBytes(bytes);
        checkEncoded = await base58CheckEncode(bytes);
      } else {
        encoded = base58Encode(input);
        const bytes = new TextEncoder().encode(input);
        checkEncoded = await base58CheckEncode(bytes);
      }

      setOutput(encoded);
      setCheckOutput(checkEncoded);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
      setCheckOutput("");
    }
  };

  const handleDecode = async () => {
    try {
      setError("");
      const decoded = base58Decode(input);
      const decodedBytes = base58DecodeToBytes(input);
      const hex = bytesToHex(decodedBytes);

      setOutput(inputMode === "hex" ? hex : decoded);
      setCheckOutput("");

      // Try Base58Check decode
      try {
        const checkResult = await base58CheckDecode(input);
        const checkHex = bytesToHex(checkResult.payload);
        const checkText = new TextDecoder().decode(checkResult.payload);
        setCheckOutput(
          `Version: ${checkResult.version}\nPayload (hex): ${checkHex}\nPayload (text): ${checkText}`
        );
      } catch {
        setCheckOutput("Not valid Base58Check format");
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
      setCheckOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Input mode:
          <select
            value={inputMode}
            onChange={(e) => setInputMode(e.target.value as InputMode)}
            className="ml-2 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="text">Text</option>
            <option value="hex">Hex</option>
          </select>
        </label>

        <button
          onClick={handleEncode}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Encode
        </button>
        <button
          onClick={handleDecode}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Decode
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
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder={
              inputMode === "hex"
                ? "Enter hex bytes (e.g. 48656c6c6f)..."
                : "Enter text to encode/decode..."
            }
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Base58 Output
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-28 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />

          <div className="flex justify-between items-center mb-1 mt-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Base58Check
            </label>
            <CopyButton text={checkOutput} />
          </div>
          <textarea
            readOnly
            value={checkOutput}
            className="w-full h-28 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
}
