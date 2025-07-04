import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-all duration-200 
        ${
          theme === "dark"
            ? "bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white"
            : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900"
        }
      `}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
