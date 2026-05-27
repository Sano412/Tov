"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem("tovlo-theme") === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("tovlo-theme", nextTheme);
  }

  return (
    <button
      aria-label="Toggle dark and light mode"
      className="field-surface premium-button hidden min-h-11 items-center rounded-full px-4 text-xs font-black text-tovlo-text sm:inline-flex"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
