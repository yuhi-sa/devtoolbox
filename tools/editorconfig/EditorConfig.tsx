"use client";

import { useState } from "react";
import {
  generateEditorConfig,
  LANGUAGE_PRESETS,
} from "./logic";
import type { EditorConfigOptions, EditorConfigSection } from "./logic";
import CopyButton from "@/components/CopyButton";

const presetNames = Object.keys(LANGUAGE_PRESETS);

export default function EditorConfig() {
  const [options, setOptions] = useState<EditorConfigOptions>({
    root: true,
    sections: [],
  });

  const output = generateEditorConfig(options);

  const addPreset = (name: string) => {
    const preset = LANGUAGE_PRESETS[name];
    if (preset) {
      setOptions((prev) => ({
        ...prev,
        sections: [...prev.sections, { ...preset }],
      }));
    }
  };

  const removeSection = (i: number) => {
    setOptions((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, idx) => idx !== i),
    }));
  };

  const updateSection = (
    i: number,
    field: keyof EditorConfigSection,
    value: string | number | boolean
  ) => {
    setOptions((prev) => ({
      ...prev,
      sections: prev.sections.map((s, idx) =>
        idx === i ? { ...s, [field]: value } : s
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options.root}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, root: e.target.checked }))
              }
            />
            root = true
          </label>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Add Language Preset
            </label>
            <div className="flex flex-wrap gap-1">
              {presetNames.map((name) => (
                <button
                  key={name}
                  onClick={() => addPreset(name)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {options.sections.map((section, i) => (
            <div
              key={i}
              className="border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-600 space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                  [{section.pattern}]
                </span>
                <button
                  onClick={() => removeSection(i)}
                  className="px-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Pattern
                  </label>
                  <input
                    value={section.pattern}
                    onChange={(e) => updateSection(i, "pattern", e.target.value)}
                    className="w-full p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Indent Style
                  </label>
                  <select
                    value={section.indentStyle}
                    onChange={(e) =>
                      updateSection(i, "indentStyle", e.target.value)
                    }
                    className="w-full p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="space">space</option>
                    <option value="tab">tab</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Indent Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={section.indentSize}
                    onChange={(e) =>
                      updateSection(i, "indentSize", parseInt(e.target.value) || 2)
                    }
                    className="w-full p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    Charset
                  </label>
                  <select
                    value={section.charset}
                    onChange={(e) => updateSection(i, "charset", e.target.value)}
                    className="w-full p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="utf-8">utf-8</option>
                    <option value="utf-8-bom">utf-8-bom</option>
                    <option value="latin1">latin1</option>
                    <option value="utf-16be">utf-16be</option>
                    <option value="utf-16le">utf-16le</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">
                    End of Line
                  </label>
                  <select
                    value={section.endOfLine}
                    onChange={(e) =>
                      updateSection(i, "endOfLine", e.target.value)
                    }
                    className="w-full p-1 text-sm border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value="lf">lf</option>
                    <option value="crlf">crlf</option>
                    <option value="cr">cr</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={section.trimTrailingWhitespace}
                    onChange={(e) =>
                      updateSection(i, "trimTrailingWhitespace", e.target.checked)
                    }
                  />
                  Trim trailing whitespace
                </label>
                <label className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={section.insertFinalNewline}
                    onChange={(e) =>
                      updateSection(i, "insertFinalNewline", e.target.checked)
                    }
                  />
                  Insert final newline
                </label>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated .editorconfig
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-60 p-3 font-mono text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
}
