"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Alternar tema"
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label="Alternar tema"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
}
