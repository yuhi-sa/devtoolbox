"use client";

import { useState } from "react";
import {
  generateSql,
  createEmptyColumn,
  getTypesForDialect,
  ColumnDef,
  Dialect,
  StatementType,
} from "./logic";
import CopyButton from "@/components/CopyButton";

export default function SqlGenerator() {
  const [tableName, setTableName] = useState("users");
  const [dialect, setDialect] = useState<Dialect>("mysql");
  const [statementType, setStatementType] = useState<StatementType>("create");
  const [columns, setColumns] = useState<ColumnDef[]>([
    { name: "id", type: "INT", nullable: false, defaultValue: "", primaryKey: true },
    { name: "name", type: "VARCHAR(255)", nullable: false, defaultValue: "", primaryKey: false },
  ]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const types = getTypesForDialect(dialect);

  const updateColumn = (index: number, updates: Partial<ColumnDef>) => {
    setColumns((prev) =>
      prev.map((col, i) => (i === index ? { ...col, ...updates } : col))
    );
  };

  const addColumn = () => {
    setColumns((prev) => [...prev, createEmptyColumn()]);
  };

  const removeColumn = (index: number) => {
    setColumns((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    try {
      setError("");
      setOutput(generateSql(tableName, columns, dialect, statementType));
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Table:
          <input
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="ml-2 w-40 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Dialect:
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value as Dialect)}
            className="ml-2 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
          </select>
        </label>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Statement:
          <select
            value={statementType}
            onChange={(e) => setStatementType(e.target.value as StatementType)}
            className="ml-2 p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="create">CREATE TABLE</option>
            <option value="insert">INSERT INTO</option>
            <option value="alter-add">ALTER TABLE ADD</option>
          </select>
        </label>
      </div>

      {/* Column definitions table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-gray-700 dark:text-gray-300">
              <th className="p-2 border-b dark:border-gray-600">Name</th>
              <th className="p-2 border-b dark:border-gray-600">Type</th>
              <th className="p-2 border-b dark:border-gray-600">Nullable</th>
              <th className="p-2 border-b dark:border-gray-600">Default</th>
              <th className="p-2 border-b dark:border-gray-600">PK</th>
              <th className="p-2 border-b dark:border-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, i) => (
              <tr key={i}>
                <td className="p-1">
                  <input
                    value={col.name}
                    onChange={(e) => updateColumn(i, { name: e.target.value })}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="column_name"
                  />
                </td>
                <td className="p-1">
                  <select
                    value={col.type}
                    onChange={(e) => updateColumn(i, { type: e.target.value })}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-1 text-center">
                  <input
                    type="checkbox"
                    checked={col.nullable}
                    onChange={(e) => updateColumn(i, { nullable: e.target.checked })}
                    className="rounded"
                  />
                </td>
                <td className="p-1">
                  <input
                    value={col.defaultValue}
                    onChange={(e) => updateColumn(i, { defaultValue: e.target.value })}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="default"
                  />
                </td>
                <td className="p-1 text-center">
                  <input
                    type="checkbox"
                    checked={col.primaryKey}
                    onChange={(e) => updateColumn(i, { primaryKey: e.target.checked })}
                    className="rounded"
                  />
                </td>
                <td className="p-1">
                  <button
                    onClick={() => removeColumn(i)}
                    className="px-2 py-1 text-red-500 hover:text-red-700 transition"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button
          onClick={addColumn}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Add Column
        </button>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate SQL
        </button>
        {output && <CopyButton text={output} />}
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {output && (
        <textarea
          readOnly
          value={output}
          className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
        />
      )}
    </div>
  );
}
