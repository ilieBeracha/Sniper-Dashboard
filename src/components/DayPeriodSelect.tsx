import { Sun, Moon, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BaseLabelRequired } from "./base/BaseLabelRequired";

export default function DayPeriodSelect({
  dayPeriod = "day",
  onDayPeriodChange,
}: {
  dayPeriod: string;
  onDayPeriodChange: (dayPeriod: string) => void;
}) {
  const { theme } = useTheme();

  return (
    <div className="space-y-2">
      <BaseLabelRequired>Time Period</BaseLabelRequired>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onDayPeriodChange("day")}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            dayPeriod === "day"
              ? theme === "dark"
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-indigo-500 bg-indigo-50"
              : theme === "dark"
                ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <Sun className={`w-8 h-8 mx-auto mb-2 ${dayPeriod === "day" ? "text-indigo-500" : theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
          <span className="text-sm font-medium">Day</span>
          {dayPeriod === "day" && <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />}
        </button>

        <button
          type="button"
          onClick={() => onDayPeriodChange("night")}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            dayPeriod === "night"
              ? theme === "dark"
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-indigo-500 bg-indigo-50"
              : theme === "dark"
                ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <Moon
            className={`w-8 h-8 mx-auto mb-2 ${dayPeriod === "night" ? "text-indigo-500" : theme === "dark" ? "text-zinc-500" : "text-gray-400"}`}
          />
          <span className="text-sm font-medium">Night</span>
          {dayPeriod === "night" && <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />}
        </button>
      </div>
    </div>
  );
}
