import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target as TargetIcon, Trash2, Wind, Plus, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Target } from "../types";
import { SectionHeader } from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

interface TargetsSectionProps {
  section: any;
  targets: Target[];
  addTarget: () => void;
  updateTarget: (targetId: string, field: keyof Target, value: any) => void;
  removeTarget: (targetId: string) => void;
}

export const TargetsSection = ({ section, targets, addTarget, updateTarget, removeTarget }: TargetsSectionProps) => {
  const { theme } = useTheme();
  const [expandedTarget, setExpandedTarget] = useState<string | null>(null);

  const toggleExpanded = (targetId: string) => {
    setExpandedTarget(expandedTarget === targetId ? null : targetId);
  };

  const hasOptionalData = (target: Target) => {
    return target.windStrength !== null || target.windDirection !== null || target.mistakeCode !== "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <SectionHeader section={section} />

      {/* Add Target Button */}
      <div className="mt-6">
        <button
          onClick={addTarget}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target</span>
        </button>
      </div>

      {/* Targets List - Single Card */}
      <div className={`mt-8 rounded-2xl border-2 overflow-hidden ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
        {targets.length > 0 ? (
          <>
            {/* Table Header */}
            <div
              className={`grid grid-cols-12 gap-2 px-4 py-3 text-xs font-medium border-b ${
                theme === "dark" ? "bg-zinc-800/50 border-zinc-700 text-zinc-400" : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            >
              <div className="col-span-1">#</div>
              <div className="col-span-8">Distance</div>
              <div className="col-span-2">Options</div>
              <div className="col-span-1"></div>
            </div>

            {/* Targets List */}
            <div className="divide-y divide-zinc-800 dark:divide-zinc-700">
              {targets.map((target, index) => (
                <div key={target.id} className="transition-all">
                  {/* Main Row */}
                  <div className={`grid grid-cols-12 gap-2 px-4 py-3 items-center ${theme === "dark" ? "hover:bg-zinc-800/30" : "hover:bg-gray-50"}`}>
                    {/* Index */}
                    <div className="col-span-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          theme === "dark" ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Distance Slider */}
                    <div className="col-span-8">
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          value={target.distance}
                          onChange={(e) => updateTarget(target.id, "distance", parseInt(e.target.value))}
                          className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}
                          style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((target.distance - 100) / 800) * 100}%, ${
                              theme === "dark" ? "#27272a" : "#e5e7eb"
                            } ${((target.distance - 100) / 800) * 100}%, ${theme === "dark" ? "#27272a" : "#e5e7eb"} 100%)`,
                          }}
                          min="100"
                          max="900"
                          step="25"
                        />
                        <span className={`text-sm font-medium min-w-[4rem] text-right ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
                          {target.distance}m
                        </span>
                      </div>
                    </div>

                    {/* Options Toggle */}
                    <div className="col-span-2">
                      <button
                        onClick={() => toggleExpanded(target.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          hasOptionalData(target)
                            ? theme === "dark"
                              ? "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                              : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                            : theme === "dark"
                              ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {expandedTarget === target.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        <span>Options</span>
                      </button>
                    </div>

                    {/* Delete */}
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => removeTarget(target.id)}
                        className={`p-1.5 rounded transition-colors ${
                          theme === "dark" ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-500"
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Options */}
                  {expandedTarget === target.id && (
                    <div className={`px-4 py-3 border-t ${theme === "dark" ? "border-zinc-800 bg-zinc-800/30" : "border-gray-100 bg-gray-50"}`}>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                        {/* Wind Speed */}
                        <div>
                          <Label className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"} mb-1 flex items-center gap-1`}>
                            <Wind className="w-3 h-3" />
                            Speed (m/s)
                          </Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={target.windStrength || ""}
                            onChange={(e) => updateTarget(target.id, "windStrength", e.target.value ? parseInt(e.target.value) : null)}
                            className={`h-8 text-sm rounded ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}`}
                          />
                        </div>

                        {/* Wind Direction */}
                        <div>
                          <Label className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"} mb-1`}>Direction (°)</Label>
                          <Input
                            type="number"
                            placeholder="0-360"
                            min="0"
                            max="360"
                            value={target.windDirection || ""}
                            onChange={(e) => updateTarget(target.id, "windDirection", e.target.value ? parseInt(e.target.value) : null)}
                            className={`h-8 text-sm rounded ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}`}
                          />
                        </div>

                        {/* Mistake Code */}
                        <div>
                          <Label className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-500"} mb-1 flex items-center gap-1`}>
                            <AlertCircle className="w-3 h-3" />
                            Mistake Code
                          </Label>
                          <Input
                            placeholder="Optional"
                            value={target.mistakeCode}
                            onChange={(e) => updateTarget(target.id, "mistakeCode", e.target.value)}
                            className={`h-8 text-sm rounded ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={`text-center py-12 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
            <TargetIcon className={`w-10 h-10 mx-auto mb-3 ${theme === "dark" ? "text-zinc-600" : "text-gray-300"}`} />
            <h3 className={`text-base font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-1`}>No targets configured</h3>
            <p className="text-sm">Add targets to define your shooting range</p>
          </div>
        )}
      </div>
    </div>
  );
};
