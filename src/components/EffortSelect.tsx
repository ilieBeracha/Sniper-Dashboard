import { Activity, Check, Circle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BaseLabelRequired } from "./base/BaseLabelRequired";

export default function EffortSelect({
  effort = false,
  onEffortChange,
  required = false,
}: {
  effort: boolean | null;
  onEffortChange: (effort: boolean) => void;
  required?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <div className="space-y-2">
      <BaseLabelRequired>{required ? "Effort" : "Effort (Optional)"}</BaseLabelRequired>

      {/* TRUE = HIGH effort / FALSE = LOW effort  */}
      <div className="grid grid-cols-2 gap-3">
        {/* High effort – stored as TRUE */}
        <button
          type="button"
          onClick={() => onEffortChange(true)}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            effort === true
              ? theme === "dark"
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-indigo-500 bg-indigo-50"
              : theme === "dark"
                ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <Activity
            className={`w-8 h-8 mx-auto mb-2 ${effort === true ? "text-indigo-500" : theme === "dark" ? "text-zinc-500" : "text-gray-400"}`}
          />
          <span className="text-sm font-medium">High</span>
          {effort === true && <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />}
        </button>

        {/* Low effort – stored as FALSE */}
        <button
          type="button"
          onClick={() => onEffortChange(false)}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            effort === false
              ? theme === "dark"
                ? "border-indigo-500 bg-indigo-500/10"
                : "border-indigo-500 bg-indigo-50"
              : theme === "dark"
                ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <Circle className={`w-8 h-8 mx-auto mb-2 ${effort === false ? "text-indigo-500" : theme === "dark" ? "text-zinc-500" : "text-gray-400"}`} />
          <span className="text-sm font-medium">Low</span>
          {effort === false && <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />}
        </button>
      </div>
    </div>
  );
}
