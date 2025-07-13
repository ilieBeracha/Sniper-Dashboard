import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { isMobile } from "react-device-detect";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg transition-all duration-200 ${isMobile ? "w-full justify-center rounded-xl px-4 py-3 text-base" : "px-6 py-2.5 rounded-lg text-sm hover:shadow-lg"}
        ${
          theme === "dark"
            ? "bg-transparent hover:bg-white/10 text-gray-100 hover:text-white"
            : "bg-transparent hover:bg-gray-200 text-gray-900 hover:text-gray-900"
        }
      `}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
