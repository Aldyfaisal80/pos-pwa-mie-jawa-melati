// src/hooks/use-app-theme.ts
"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export type AppThemeId = "earthy" | "forest" | "cherry" | "ocean" | "purple";
export type AppMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "pos:color-theme";

export const APP_THEMES = [
  {
    id: "earthy" as AppThemeId,
    label: "Earthy Warung",
    description: "Hangat & tradisional",
    emoji: "🍜",
    preview: ["#c97a2a", "#f5ede0", "#7a4a1a"],
  },
  {
    id: "forest" as AppThemeId,
    label: "Forest Green",
    description: "Segar & natural",
    emoji: "🌿",
    preview: ["#1a7a4a", "#e8f5ee", "#0d4a2a"],
  },
  {
    id: "cherry" as AppThemeId,
    label: "Cherry Red",
    description: "Energik & berani",
    emoji: "🍒",
    preview: ["#c02020", "#fef0f0", "#7a0a0a"],
  },
  {
    id: "ocean" as AppThemeId,
    label: "Ocean Blue",
    description: "Tenang & profesional",
    emoji: "🌊",
    preview: ["#1a5aaa", "#e8f0ff", "#0a2a7a"],
  },
  {
    id: "purple" as AppThemeId,
    label: "Purple Night",
    description: "Elegan & premium",
    emoji: "🔮",
    preview: ["#7a20c0", "#f5e8ff", "#3a0a7a"],
  },
] as const;

export function useAppTheme() {
  const { theme, setTheme } = useTheme();
  const [colorTheme, setColorThemeState] = useState<AppThemeId>("earthy");

  // Load saved color theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppThemeId | null;
    const valid = APP_THEMES.map((t) => t.id);
    if (saved && valid.includes(saved)) {
      setColorThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const setColorTheme = useCallback((id: AppThemeId) => {
    setColorThemeState(id);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem(THEME_STORAGE_KEY, id);
  }, []);

  const setMode = useCallback(
    (mode: AppMode) => {
      setTheme(mode);
    },
    [setTheme],
  );

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return {
    colorTheme,
    mode: theme as AppMode,
    isDark,
    setColorTheme,
    setMode,
    themes: APP_THEMES,
  };
}
