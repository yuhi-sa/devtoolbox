"use client";

import { useState } from "react";
import {
  Permissions,
  permissionsToNumeric,
  numericToPermissions,
  permissionsToSymbolic,
} from "./logic";
import CopyButton from "@/components/CopyButton";

const defaultPerms: Permissions = {
  owner: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: true },
  others: { read: true, write: false, execute: true },
};

export default function ChmodCalculator() {
  const [perms, setPerms] = useState<Permissions>(defaultPerms);
  const [numericInput, setNumericInput] = useState("755");
  const [error, setError] = useState("");

  const numeric = permissionsToNumeric(perms);
  const symbolic = permissionsToSymbolic(perms);

  const handleCheckboxChange = (
    role: "owner" | "group" | "others",
    perm: "read" | "write" | "execute",
    checked: boolean
  ) => {
    const updated = {
      ...perms,
      [role]: { ...perms[role], [perm]: checked },
    };
    setPerms(updated);
    setNumericInput(permissionsToNumeric(updated));
    setError("");
  };

  const handleNumericChange = (value: string) => {
    setNumericInput(value);
    if (/^[0-7]{3}$/.test(value)) {
      try {
        setPerms(numericToPermissions(value));
        setError("");
      } catch (e) {
        setError((e as Error).message);
      }
    }
  };

  const roles = ["owner", "group", "others"] as const;
  const permTypes = ["read", "write", "execute"] as const;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Numeric
          </label>
          <input
            type="text"
            value={numericInput}
            onChange={(e) => handleNumericChange(e.target.value)}
            maxLength={3}
            className="w-24 p-3 font-mono text-lg text-center border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="font-mono text-lg p-3">{symbolic}</div>
        <CopyButton text={`chmod ${numeric}`} label="Copy chmod" />
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="p-2 text-left text-gray-700 dark:text-gray-300" />
            {permTypes.map((p) => (
              <th key={p} className="p-2 text-center text-gray-700 dark:text-gray-300 capitalize">
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role} className="border-t dark:border-gray-600">
              <td className="p-2 font-medium text-gray-700 dark:text-gray-300 capitalize">
                {role}
              </td>
              {permTypes.map((perm) => (
                <td key={perm} className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={perms[role][perm]}
                    onChange={(e) => handleCheckboxChange(role, perm, e.target.checked)}
                    className="w-5 h-5"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm">
        <p>chmod {numeric} filename</p>
        <p className="text-gray-500 dark:text-gray-400 mt-1">-{symbolic}</p>
      </div>
    </div>
  );
}
