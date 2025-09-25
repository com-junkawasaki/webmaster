import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // 初期テーマをlocalStorageから取得、なければlightをデフォルトに
    const savedTheme = localStorage.getItem("theme") as Theme;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    updateTheme(initialTheme);
  }, []);

  const updateTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const body = document.body;

    // Tailwind CSSのdarkクラスを切り替え
    if (newTheme === "dark") {
      root.classList.add("dark");
      body.classList.remove("bg-white", "text-black");
      body.classList.add("bg-slate-900", "text-slate-400");
    } else {
      root.classList.remove("dark");
      body.classList.remove("bg-slate-900", "text-slate-400");
      body.classList.add("bg-white", "text-black");
    }

    // data-mode属性を更新
    body.setAttribute("data-mode", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
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
      {theme === "dark" ? (
        // ダークモードの場合：白い点（月）
        <span className="block w-2 h-2 bg-white rounded-full mx-auto mt-1 animate-pulse"></span>
      ) : (
        // ライトモードの場合：黄色い丸（太陽）
        <span className="block w-full h-full bg-yellow-400 rounded-full border border-orange-500 shadow-lg"></span>
      )}
    </button>
  );
};

export default ThemeSwitcher;
