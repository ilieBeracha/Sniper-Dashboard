import { Target } from "lucide-react";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface scoreTargets {
  distance?: number;
  shots_fired?: number;
  target_hits?: number;
}

export default function TrainingPageScoreFormModalStats({ addDistanceEntry, removeDistanceEntry, updateDistanceEntry }: { addDistanceEntry: () => void; removeDistanceEntry: (index: number) => void; updateDistanceEntry: (index: number, field: keyof scoreTargets, value: number) => void }) {
  const { watch } = useFormContext();
  const formValues = watch();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="text-orange-400" size={16} />
          <h2 className="text-base font-semibold text-white">Shooting Performance</h2>
        </div>
        <button
          type="button"
          onClick={addDistanceEntry}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 rounded-lg border border-indigo-700/50"
        >
          <Plus size={14} />
          Add Distance
        </button>
      </div>

      {formValues.scoreTargets.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Target className="mx-auto mb-2" size={32} opacity={0.5} />
          <p>No distance entries added yet</p>
          <button type="button" onClick={addDistanceEntry} className="mt-2 text-indigo-400 hover:text-indigo-300">
            Add your first distance entry
          </button>
        </div>
      )}

      <div className="space-y-4">
        {formValues.scoreTargets.map((entry: any, index: number) => (
          <div key={index} className="p-4 bg-zinc-800/20 rounded-lg border border-zinc-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-300">Target Entry #{index + 1}</h3>
              <button type="button" onClick={() => removeDistanceEntry(index)} className="text-zinc-500 hover:text-red-400">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <label className="block text-sm">
                <span className="text-gray-400">Distance (m)</span>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="25"
                  value={entry.distance}
                  onChange={(e) => updateDistanceEntry(index, "distance", +e.target.value)}
                  className="mt-2 w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100m</span>
                  <span className="text-indigo-400 font-medium">{entry.distance || 100}m</span>
                  <span>900m</span>
                </div>
              </label>

              <label className="block text-sm">
                <span className="text-gray-400">Shots fired</span>
                <input
                  type="number"
                  value={entry.shots_fired || ""}
                  onChange={(e) => updateDistanceEntry(index, "shots_fired", +e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 text-gray-100 outline-none"
                />
              </label>

              <label className="block text-sm">
                <span className="text-gray-400">Hits</span>
                <input
                  type="number"
                  value={entry.target_hits || ""}
                  onChange={(e) => updateDistanceEntry(index, "target_hits", +e.target.value)}
                  className="mt-1 w-full rounded-md bg-white/10 px-3 py-2 text-gray-100 outline-none"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
