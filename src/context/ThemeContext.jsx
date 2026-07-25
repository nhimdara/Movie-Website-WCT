import { createContext, useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("cinevault-theme", "dark");
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(theme === "light" ? "dark" : "light"),
  }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
