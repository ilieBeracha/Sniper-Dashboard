import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target as TargetIcon, Trash2 } from "lucide-react";
import { Target } from "../types";
import { SectionHeader } from "./SectionHeader";

interface TargetsSectionProps {
  section: any;
  targets: Target[];
  addTarget: () => void;
  updateTarget: (targetId: string, field: keyof Target, value: any) => void;
  removeTarget: (targetId: string) => void;
}

export const TargetsSection = ({ section, targets, addTarget, updateTarget, removeTarget }: TargetsSectionProps) => {
  return (
    <div id="targets" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4">
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <SectionHeader section={section} />
        <button
          onClick={addTarget}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600 w-full sm:w-auto"
        >
          <TargetIcon className="w-4 h-4" />
          <span>Add Target</span>
        </button>
      </div>
      <div className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg ">
        <div className="space-y-4 lg:space-y-6">
          {targets.map((target, index) => (
            <div key={target.id} className="p-4 lg:p-6">
              <div className="flex sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 rounded-lg flex items-center justify-center text-base font-medium text-gray-700 dark:text-gray-300 flex-shrink-0 shadow-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-lg">Target #{index + 1}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTarget(target.id)}
                  className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors self-start sm:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-3 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium text-gray-700 dark:text-gray-300">Distance (meters)</Label>
                    <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{target.distance}m</span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      value={target.distance}
                      onChange={(e) => updateTarget(target.id, "distance", parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                      min="100"
                      max="900"
                      step="25"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>100m</span>
                      <span>300m</span>
                      <span>500m</span>
                      <span>700m</span>
                      <span>900m</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-xs lg:text-base font-medium text-gray-700 dark:text-gray-300">Wind Speed (m/s)</Label>
                    <Input
                      type="number"
                      placeholder="Optional"
                      value={target.windStrength || ""}
                      onChange={(e) => updateTarget(target.id, "windStrength", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm sm:text-xs lg:text-base font-medium text-gray-700 dark:text-gray-300">Wind Direction (°)</Label>
                    <Input
                      type="number"
                      placeholder="0-360°"
                      min="0"
                      max="360"
                      value={target.windDirection || ""}
                      onChange={(e) => updateTarget(target.id, "windDirection", e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <Label className="text-base sm:text-xs lg:text-base font-medium text-gray-700 dark:text-gray-300">Mistake Code</Label>
                  <Input
                    placeholder="Optional"
                    value={target.mistakeCode}
                    onChange={(e) => updateTarget(target.id, "mistakeCode", e.target.value)}
                    className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                  />
                </div>
              </div>
            </div>
          ))}

          {targets.length === 0 && (
            <div className="text-center py-12 border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4">
              <TargetIcon className="w-14 h-14 mx-auto text-gray-400 dark:text-zinc-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No targets configured</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-6">Add targets to define your shooting range setup</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
