import { Calendar } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function TrainingListEmpty() {
  const { theme } = useTheme();

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 rounded-lg text-center border backdrop-blur-sm transition-colors duration-200 ${
        theme === "dark" ? "bg-[#222]/50 border-white/5" : "bg-gray-100/50 border-gray-200"
      }`}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-indigo-400" />
      </div>
      <p className={`font-medium text-lg transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        No training sessions found
      </p>
      <p className={`text-sm mt-2 max-w-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
        Schedule a new training session to start tracking your team's progress
      </p>
    </div>
  );
}
