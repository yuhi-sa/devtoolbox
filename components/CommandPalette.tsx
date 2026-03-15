"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { tools } from "@/lib/tools-registry";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const navigate = useCallback(
    (id: string) => {
      const tool = tools.find((t) => t.id === id);
      if (tool?.implemented) {
        if (id === "pipeline") {
          router.push("/pipeline");
        } else {
          router.push(`/tools/${id}`);
        }
      }
      onClose();
    },
    [router, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        navigate(filtered[selectedIndex].id);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl border dark:border-gray-700 overflow-hidden">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 text-lg bg-transparent border-b dark:border-gray-700 focus:outline-none text-gray-900 dark:text-white"
          placeholder="Search tools..."
        />
        <div className="max-h-80 overflow-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No tools found
            </div>
          ) : (
            filtered.map((tool, i) => (
              <button
                key={tool.id}
                onClick={() => navigate(tool.id)}
                className={`w-full px-4 py-2 flex items-center gap-3 text-left ${
                  i === selectedIndex
                    ? "bg-blue-50 dark:bg-blue-900/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <span className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm font-bold text-gray-600 dark:text-gray-300">
                  {tool.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {tool.name}
                    {!tool.implemented && (
                      <span className="text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {tool.description}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{tool.category}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
