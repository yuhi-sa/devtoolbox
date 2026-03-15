"use client";

import { useState } from "react";
import { availableTransforms, runPipeline } from "./logic";
import CopyButton from "@/components/CopyButton";

export default function PipelineTool() {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [output, setOutput] = useState("");
  const [intermediates, setIntermediates] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [showIntermediates, setShowIntermediates] = useState(false);

  const addStep = (id: string) => {
    setSteps([...steps, id]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const newSteps = [...steps];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newSteps.length) return;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const handleRun = () => {
    const result = runPipeline(input, steps);
    setOutput(result.output);
    setIntermediates(result.intermediates);
    setError(result.error || "");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-3 font-mono text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter input text..."
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Output
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-40 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Pipeline Steps
        </label>
        <div className="space-y-2">
          {steps.map((stepId, i) => {
            const step = availableTransforms.find((t) => t.id === stepId);
            return (
              <div
                key={i}
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 border dark:border-gray-600 rounded"
              >
                <span className="text-sm font-medium text-gray-500 w-6">
                  {i + 1}.
                </span>
                <span className="flex-1 text-sm">{step?.name || stepId}</span>
                <button
                  onClick={() => moveStep(i, -1)}
                  className="text-gray-400 hover:text-gray-600 text-sm px-1"
                  disabled={i === 0}
                >
                  Up
                </button>
                <button
                  onClick={() => moveStep(i, 1)}
                  className="text-gray-400 hover:text-gray-600 text-sm px-1"
                  disabled={i === steps.length - 1}
                >
                  Down
                </button>
                <button
                  onClick={() => removeStep(i)}
                  className="text-red-400 hover:text-red-600 text-sm px-1"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <select
          onChange={(e) => {
            if (e.target.value) {
              addStep(e.target.value);
              e.target.value = "";
            }
          }}
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600"
          defaultValue=""
        >
          <option value="" disabled>
            Add step...
          </option>
          {availableTransforms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleRun}
          disabled={steps.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          Run Pipeline
        </button>
      </div>

      {intermediates.length > 1 && (
        <div>
          <button
            onClick={() => setShowIntermediates(!showIntermediates)}
            className="text-sm text-blue-600 dark:text-blue-400 underline"
          >
            {showIntermediates ? "Hide" : "Show"} intermediate results
          </button>
          {showIntermediates && (
            <div className="mt-2 space-y-2">
              {intermediates.slice(0, -1).map((val, i) => (
                <div key={i} className="p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-600 rounded">
                  <div className="text-xs text-gray-500 mb-1">
                    After step {i + 1}:{" "}
                    {availableTransforms.find((t) => t.id === steps[i])?.name}
                  </div>
                  <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                    {val}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
