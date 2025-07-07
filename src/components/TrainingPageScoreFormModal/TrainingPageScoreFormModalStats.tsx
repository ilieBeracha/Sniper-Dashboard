import { Crosshair, Target } from "lucide-react";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";

interface scoreTargets {
  distance?: number;
  shots_fired?: number;
  target_hits?: number;
  day_night?: string;
  position?: string;
}

export default function TrainingPageScoreFormModalStats({
  addDistanceEntry,
  removeDistanceEntry,
  updateDistanceEntry,
}: {
  addDistanceEntry: () => void;
  removeDistanceEntry: (index: number) => void;
  updateDistanceEntry: (index: number, field: keyof scoreTargets, value: number) => void;
}) {
  const { watch, setValue } = useFormContext();
  const { theme } = useTheme();
  const formValues = watch();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Crosshair className={` transition-colors duration-200 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} size={16} />
            <h4 className={`text-sm font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Combat Details
            </h4>
          </div>
        </div>
      </div>

      {formValues.scoreTargets.length === 0 && (
        <div className={`text-center py-8 transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          <Target className="mx-auto mb-2" size={32} opacity={0.5} />
          <p>No distance entries added yet</p>
          <button
            type="button"
            onClick={addDistanceEntry}
            className={`mt-2 transition-colors duration-200 ${
              theme === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
            }`}
          >
            Add your first distance entry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={formValues.day_night}
          onChange={(e) => setValue("day_night", e.target.value as string)}
          className={`w-full min-h-10 rounded-lg px-3 py-2 text-sm border transition-colors duration-200 ${
            theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <option value="">Select day/night</option>
          <option value="day">Day</option>
          <option value="night">Night</option>
        </select>

        <select
          value={formValues.position}
          onChange={(e) => setValue("position", e.target.value as string)}
          className={`w-full min-h-10 rounded-lg px-3 py-2 text-sm border transition-colors duration-200 ${
            theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <option value="">Select position</option>
          <option value="lying">Lying</option>
          <option value="standing">Standing</option>
          <option value="sitting">Sitting</option>
          <option value="operational">Operational</option>
        </select>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className={`transition-colors duration-200 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} size={16} />
          <h2 className={`text-base font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Shooting Performance
          </h2>
        </div>
        <button
          type="button"
          onClick={addDistanceEntry}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors duration-200 ${
            theme === "dark"
              ? "text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 border-indigo-700/50"
              : "text-indigo-600 hover:text-indigo-700 bg-indigo-50 border-indigo-200"
          }`}
        >
          <Plus size={14} />
          Add Distance
        </button>
      </div>
      <div className="space-y-4">
        {formValues.scoreTargets.map((entry: any, index: number) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-colors duration-200 ${
              theme === "dark" ? "bg-zinc-800/20 border-zinc-700/50" : "bg-gray-50 border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-medium transition-colors duration-200 ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                Target Entry #{index + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeDistanceEntry(index)}
                className={`transition-colors duration-200 ${
                  theme === "dark" ? "text-zinc-500 hover:text-red-400" : "text-gray-500 hover:text-red-600"
                }`}
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <label className="block text-sm">
                <span className={`transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Distance (m)</span>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="25"
                  value={entry.distance}
                  onChange={(e) => updateDistanceEntry(index, "distance", +e.target.value)}
                  className={`mt-2 w-full h-2 rounded-lg appearance-none cursor-pointer slider transition-colors duration-200 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                  }`}
                />
                <div
                  className={`flex justify-between text-xs mt-1 transition-colors duration-200 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  <span>100m</span>
                  <span className="text-indigo-400 font-medium">{entry.distance || 100}m</span>
                  <span>900m</span>
                </div>
              </label>

              <label className="block text-sm">
                <span className={`transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Shots fired</span>
                <input
                  type="number"
                  value={entry.shots_fired || ""}
                  onChange={(e) => updateDistanceEntry(index, "shots_fired", +e.target.value)}
                  className={`mt-1 w-full rounded-md px-3 py-2 outline-none transition-colors duration-200 ${
                    theme === "dark" ? "bg-white/10 text-gray-100 border border-zinc-700" : "bg-white text-gray-900 border border-gray-300"
                  }`}
                />
              </label>

              <label className="block text-sm">
                <span className={`transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Hits</span>
                <input
                  type="number"
                  value={entry.target_hits || ""}
                  onChange={(e) => updateDistanceEntry(index, "target_hits", +e.target.value)}
                  className={`mt-1 w-full rounded-md px-3 py-2 outline-none transition-colors duration-200 ${
                    theme === "dark" ? "bg-white/10 text-gray-100 border border-zinc-700" : "bg-white text-gray-900 border border-gray-300"
                  }`}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
