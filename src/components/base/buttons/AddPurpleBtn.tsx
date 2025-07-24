import { useTheme } from "@/contexts/ThemeContext";

export default function AddPurpleBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 sm:text-xs text-xs rounded-lg border px-3 py-1.5 transition-colors duration-200 ${
        theme === "dark"
          ? "text-indigo-400 hover:text-indigo-300 bg-indigo-900/30 border-indigo-700/50 hover:bg-indigo-900/40"
          : "text-indigo-600 hover:text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
      }`}
    >
      {children}
    </button>
  );
}
