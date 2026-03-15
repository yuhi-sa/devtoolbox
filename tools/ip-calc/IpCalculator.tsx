"use client";

import { useState } from "react";
import { calculateSubnet, SubnetInfo } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function IpCalculator() {
  const [input, setInput] = useState("192.168.1.0/24");
  const [result, setResult] = useState<SubnetInfo | null>(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    try {
      setError("");
      setResult(calculateSubnet(input));
    } catch (e) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  const resultText = result
    ? `Network: ${result.networkAddress}\nSubnet Mask: ${result.subnetMask}\nBroadcast: ${result.broadcastAddress}\nFirst Host: ${result.firstHost}\nLast Host: ${result.lastHost}\nHosts: ${result.numberOfHosts}`
    : "";

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            CIDR Notation
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. 192.168.1.0/24"
          />
        </div>
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Calculate
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <CopyButton text={resultText} />
          </div>
          <table className="w-full text-sm font-mono border rounded-lg overflow-hidden">
            <tbody>
              {[
                ["IP Address", result.ip],
                ["CIDR", `/${result.cidr}`],
                ["Subnet Mask", result.subnetMask],
                ["Network Address", result.networkAddress],
                ["Broadcast Address", result.broadcastAddress],
                ["First Host", result.firstHost],
                ["Last Host", result.lastHost],
                ["Number of Hosts", result.numberOfHosts.toString()],
              ].map(([label, value]) => (
                <tr key={label} className="border-b dark:border-gray-600">
                  <td className="p-2 bg-gray-50 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300 w-1/3">
                    {label}
                  </td>
                  <td className="p-2 bg-white dark:bg-gray-900">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
