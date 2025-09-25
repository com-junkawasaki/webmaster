import { useEffect, useState } from "react";

type Theme = "system" | "dark" | "light";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // 初期テーマをlocalStorageから取得、なければdarkをデフォルトに
    const savedTheme = localStorage.getItem("theme") as Theme;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    updateTheme(initialTheme);
  }, []);

  const updateTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", newTheme === "dark");
    }

    root.setAttribute("data-mode", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ["system", "dark", "light"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setTheme(nextTheme);
    updateTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed right-5 top-20 z-50 w-6 h-6 rounded-full border border-dashed border-current cursor-pointer transition-all duration-300 hover:scale-110"
      aria-label="テーマの切り替え"
      title={`現在のテーマ: ${theme}`}
    >
      {theme === "system" && <span className="text-xs font-semibold">A</span>}
      {theme === "light" && <span className="block w-full h-full bg-yellow-400 rounded-full border border-orange-500 shadow-lg"></span>}
      {theme === "dark" && <span className="block w-2 h-2 bg-white rounded-full mx-auto mt-1 animate-pulse"></span>}
    </button>
  );
};

export default ThemeSwitcher;
