import { Target, Crosshair, Wind, Compass, AlertCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import BaseButton from "@/components/base/BaseButton";
import { useState } from "react";

interface TargetsStepProps {
  targets: any[];
  addTarget: () => void;
  removeTarget: (index: number) => void;
  updateTarget: (index: number, field: any, value: any) => void;
}

export default function TargetsStep({ targets, addTarget, removeTarget, updateTarget }: TargetsStepProps) {
  const [expandedTargets, setExpandedTargets] = useState<Set<string>>(new Set());

  const toggleExpanded = (targetId: string) => {
    const newSet = new Set(expandedTargets);
    if (newSet.has(targetId)) {
      newSet.delete(targetId);
    } else {
      newSet.add(targetId);
    }
    setExpandedTargets(newSet);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
        <h4 className="text-sm sm:text-base font-semibold text-blue-800 dark:text-blue-200 mb-1 sm:mb-2">🎯 Target Information</h4>
        <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">Add targets engaged during this session. Distance is required.</p>
      </div>

      <div className="flex justify-center sm:justify-end">
        <BaseButton onClick={addTarget} className="flex items-center justify-center gap-2 text-sm px-4 py-2.5 w-full sm:w-auto max-w-xs">
          <Target className="w-4 h-4" />
          Add Target
        </BaseButton>
      </div>

      <div className="space-y-4">
        {targets.map((target: any, targetIndex: number) => {
          const isExpanded = expandedTargets.has(target.id);
          return (
            <div
              key={target.id}
              className="bg-gradient-to-r from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {/* Target Header */}
              <div className="p-2 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-gray-800 dark:text-neutral-200 text-sm">
                      <span className="inline-flex items-center gap-1">
                        <Crosshair className="w-4 h-4 text-red-600 dark:text-red-400" />
                        Target {targetIndex + 1}
                      </span>
                    </h5>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(target.id)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => removeTarget(targetIndex)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      aria-label="Remove target"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Primary Distance Input - Always Visible */}
                <div className="mt-3 space-y-3">
                  <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Distance
                      </label>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{target.distance || 100}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">meters</span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        value={target.distance || 100}
                        onChange={(e) => updateTarget(targetIndex, "distance", parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700 accent-blue-600"
                        min="100"
                        max="900"
                        step="25"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <span>100m</span>
                        <span>300m</span>
                        <span>500m</span>
                        <span>700m</span>
                        <span>900m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Additional Info */}
              {isExpanded && (
                <div className="px-2 sm:px-4 pb-2 sm:pb-4 space-y-3 sm:space-y-4 animate-in slide-in-from-top duration-200">
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    {/* Wind Strength */}
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                        <Wind className="w-4 h-4 text-blue-500" />
                        Wind Strength
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={target.windStrength ?? ""}
                          onChange={(e) => updateTarget(targetIndex, "windStrength", e.target.value === "" ? null : parseFloat(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
                          placeholder="0.0"
                          step="0.1"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-xs text-gray-500">m/s</span>
                        </div>
                      </div>
                    </div>

                    {/* Wind Direction */}
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                        <Compass className="w-4 h-4 text-green-500" />
                        Direction
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={target.windDirection ?? ""}
                          onChange={(e) => updateTarget(targetIndex, "windDirection", e.target.value === "" ? null : parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
                          placeholder="0"
                          min="0"
                          max="360"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-xs text-gray-500">°</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mistake Code */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Mistake Code
                    </label>
                    <input
                      type="text"
                      value={target.mistakeCode || ""}
                      onChange={(e) => updateTarget(targetIndex, "mistakeCode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-200"
                      placeholder="Enter mistake code"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {targets.length === 0 && (
          <div className="text-center py-6 sm:py-8 bg-gray-50 dark:bg-neutral-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600">
            <Target className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 dark:text-neutral-500 mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-gray-500 dark:text-neutral-400 font-medium">No targets added yet</p>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-neutral-500 mt-1">Click "Add Target" to start tracking target engagements</p>
          </div>
        )}
      </div>
    </div>
  );
}
