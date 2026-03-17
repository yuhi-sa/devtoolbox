"use client";

import { useState } from "react";
import { validateEmail, validateEmails } from "./logic";
import type { EmailValidationResult } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function EmailValidator() {
  const [single, setSingle] = useState("");
  const [batch, setBatch] = useState("");
  const [singleResult, setSingleResult] = useState<EmailValidationResult | null>(null);
  const [batchResults, setBatchResults] = useState<EmailValidationResult[]>([]);

  const handleValidateSingle = () => {
    setSingleResult(validateEmail(single));
  };

  const handleValidateBatch = () => {
    const emails = batch.split("\n");
    setBatchResults(validateEmails(emails));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Single Email
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={single}
            onChange={(e) => setSingle(e.target.value)}
            placeholder="user@example.com"
            className="flex-1 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleValidateSingle}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Validate
          </button>
        </div>
      </div>

      {singleResult && (
        <div
          className={`border rounded-lg p-4 ${
            singleResult.isValid
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-medium ${singleResult.isValid ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
              {singleResult.isValid ? "Valid" : "Invalid"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Local: </span>
              <span className="font-mono text-gray-700 dark:text-gray-300">
                {singleResult.localPart || "(empty)"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Domain: </span>
              <span className="font-mono text-gray-700 dark:text-gray-300">
                {singleResult.domain || "(empty)"}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">TLD: </span>
              <span className="font-mono text-gray-700 dark:text-gray-300">
                {singleResult.tld || "(empty)"}
              </span>
            </div>
          </div>
          {singleResult.errors.length > 0 && (
            <ul className="mt-2 text-sm text-red-500">
              {singleResult.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          Batch Validate (one email per line)
        </label>
        <textarea
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          placeholder={"user@example.com\nadmin@test.org\nbad-email@"}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleValidateBatch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Validate All
          </button>
          <CopyButton
            text={batchResults
              .filter((r) => r.isValid)
              .map((r) => r.email)
              .join("\n")}
            label="Copy Valid"
          />
        </div>
      </div>

      {batchResults.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="text-left p-2 text-gray-700 dark:text-gray-300">Email</th>
                <th className="text-left p-2 text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left p-2 text-gray-700 dark:text-gray-300">Errors</th>
              </tr>
            </thead>
            <tbody>
              {batchResults.map((r, i) => (
                <tr
                  key={i}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-2 font-mono text-gray-700 dark:text-gray-300">
                    {r.email}
                  </td>
                  <td className="p-2">
                    <span
                      className={
                        r.isValid
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {r.isValid ? "Valid" : "Invalid"}
                    </span>
                  </td>
                  <td className="p-2 text-red-500 text-sm">
                    {r.errors.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
