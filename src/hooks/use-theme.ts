import { useState, useEffect } from "react";
import { getTheme, setTheme as persistTheme, initTheme } from "@/lib/theme";

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">(getTheme);

  useEffect(() => {
    initTheme();
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    persistTheme(next);
  };

  return { theme, toggleTheme };
}
