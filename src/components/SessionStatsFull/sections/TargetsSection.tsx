import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target as TargetIcon, Trash2 } from "lucide-react";
import { Target } from "../types";
import { SectionHeader } from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";

interface TargetsSectionProps {
  section: any;
  targets: Target[];
  addTarget: () => void;
  updateTarget: (targetId: string, field: keyof Target, value: any) => void;
  removeTarget: (targetId: string) => void;
}

export const TargetsSection = ({ section, targets, addTarget, updateTarget, removeTarget }: TargetsSectionProps) => {
  const { theme } = useTheme();
  return (
    <div id="targets" className="snap-start scroll-mt-4 h-[calc(100vh-5rem)] flex flex-col space-y-6 py-8">
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <SectionHeader section={section} />
        <button
          onClick={addTarget}
          className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white ${theme === "dark" ? "bg-indigo-500 hover:bg-indigo-600" : "bg-indigo-600 hover:bg-indigo-700"} rounded-lg transition-colors w-full sm:w-auto`}
        >
          <TargetIcon className="w-4 h-4" />
          <span>Add Target</span>
        </button>
      </div>
      <div className={`border ${theme === "dark" ? "border-white/10 bg-zinc-900/30" : "border-gray-200 bg-gray-50/50"} rounded-lg flex-1 overflow-auto p-4`}>
        <div className="space-y-8 lg:space-y-10">
          {targets.map((target, index) => (
            <div key={target.id} className="p-6 lg:p-10">
              <div className="flex sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${theme === "dark" ? "from-zinc-700 to-zinc-800" : "from-gray-200 to-gray-300"} rounded-lg flex items-center justify-center text-base font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex-shrink-0 shadow-sm`}>
                    {index + 1}
                  </div>
                  <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} text-lg`}>Target #{index + 1}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTarget(target.id)}
                  className={`${theme === "dark" ? "text-gray-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"} transition-colors self-start sm:self-center`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-4 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label className={`text-base font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Distance (meters)</Label>
                    <span className={`text-xl font-semibold ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>{target.distance}m</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="range"
                      value={target.distance}
                      onChange={(e) => updateTarget(target.id, "distance", parseInt(e.target.value))}
                      className={`w-full h-2 ${theme === "dark" ? "bg-white/10 accent-indigo-400" : "bg-gray-200 accent-indigo-600"} rounded-lg appearance-none cursor-pointer`}
                      min="100"
                      max="900"
                      step="25"
                    />
                    <div className={`flex justify-between text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                      <span>100m</span>
                      <span>300m</span>
                      <span>500m</span>
                      <span>700m</span>
                      <span>900m</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-3">
                    <Label className={`text-sm sm:text-xs lg:text-base font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Wind Speed (m/s)</Label>
                    <Input
                      type="number"
                      placeholder="Optional"
                      value={target.windStrength || ""}
                      onChange={(e) => updateTarget(target.id, "windStrength", e.target.value ? parseInt(e.target.value) : null)}
                      className={`w-full h-10 ${theme === "dark" ? "border-white/10 focus:border-indigo-400 focus:ring-indigo-400 bg-zinc-800 text-white" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"} focus:ring-1 transition-all`}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className={`text-sm sm:text-xs lg:text-base font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Wind Direction (°)</Label>
                    <Input
                      type="number"
                      placeholder="0-360°"
                      min="0"
                      max="360"
                      value={target.windDirection || ""}
                      onChange={(e) => updateTarget(target.id, "windDirection", e.target.value ? parseInt(e.target.value) : null)}
                      className={`w-full h-10 ${theme === "dark" ? "border-white/10 focus:border-indigo-400 focus:ring-indigo-400 bg-zinc-800 text-white" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"} focus:ring-1 transition-all`}
                    />
                  </div>
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <Label className={`text-base sm:text-xs lg:text-base font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Mistake Code</Label>
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
            <div className={`text-center py-12 border ${theme === "dark" ? "border-white/10 bg-zinc-900/30" : "border-gray-200 bg-gray-50/50"} rounded-lg p-4`}>
              <TargetIcon className={`w-14 h-14 mx-auto ${theme === "dark" ? "text-zinc-600" : "text-gray-400"} mb-4`} />
              <h3 className={`text-xl font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>No targets configured</h3>
              <p className={`${theme === "dark" ? "text-zinc-400" : "text-gray-600"} mb-6`}>Add targets to define your shooting range setup</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
