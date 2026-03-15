"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CommandPalette from "./CommandPalette";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = saved ? saved === "true" : prefersDark;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem("darkMode", String(newVal));
    document.documentElement.classList.toggle("dark", newVal);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="border-b dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold text-gray-900 dark:text-white"
          >
            DevToolBox
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Search...
              <kbd className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                Cmd+K
              </kbd>
            </button>
            <Link
              href="/pipeline"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Pipeline
            </Link>
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
