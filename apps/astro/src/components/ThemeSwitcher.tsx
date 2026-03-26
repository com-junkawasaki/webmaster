import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    updateTheme(initialTheme);
  }, []);

  const updateTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const body = document.body;

    if (newTheme === "dark") {
      root.classList.add("dark");
      body.style.color = "#c9d1d9";
      body.style.backgroundColor = "#0d1117";
    } else {
      root.classList.remove("dark");
      body.style.color = "#24292f";
      body.style.backgroundColor = "#ffffff";
    }

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
      style={{
        position: 'fixed',
        right: '1.5rem',
        top: '1.5rem',
        zIndex: 50,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.25rem',
        fontSize: '0.75rem',
        color: theme === 'dark' ? '#8b949e' : '#57606a',
        fontFamily: "'Poppins', 'Noto Sans JP', ui-sans-serif, system-ui, sans-serif",
        opacity: 0.6,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6'; }}
      aria-label="Toggle theme"
      title={`Theme: ${theme}`}
    >
      {theme === "dark" ? "[light]" : "[dark]"}
    </button>
  );
};

export default ThemeSwitcher;
