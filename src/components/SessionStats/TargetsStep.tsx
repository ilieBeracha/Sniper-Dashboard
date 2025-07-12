import { Target } from "lucide-react";
import BaseButton from "@/components/base/BaseButton";

interface TargetsStepProps {
  targets: any[];
  addTarget: () => void;
  removeTarget: (index: number) => void;
  updateTarget: (index: number, field: any, value: any) => void;
}

export default function TargetsStep({ targets, addTarget, removeTarget, updateTarget }: TargetsStepProps) {
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Target Information</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">Add targets engaged during this session. Distance is required.</p>
      </div>


      <div className="flex justify-end">
        <BaseButton onClick={addTarget} className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          Add Target
        </BaseButton>
      </div>

      <div className="space-y-6">
        {targets.map((target: any, targetIndex: number) => (
          <div key={target.id} className="border border-gray-200 dark:border-neutral-600 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h5 className="font-medium text-gray-800 dark:text-neutral-200">Target {targetIndex + 1}</h5>
              <button onClick={() => removeTarget(targetIndex)} className="text-red-500 hover:text-red-700 text-sm" aria-label="Remove target">
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Distance (m) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={target.distance}
                  onChange={(e) => updateTarget(targetIndex, "distance", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  placeholder="Distance in meters"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Wind Strength <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={target.windStrength || ""}
                  onChange={(e) => updateTarget(targetIndex, "windStrength", e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Wind Direction (°) <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={target.windDirection || ""}
                  onChange={(e) => updateTarget(targetIndex, "windDirection", e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  placeholder="0-360"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Mistake Code <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={target.mistakeCode || ""}
                  onChange={(e) => updateTarget(targetIndex, "mistakeCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  placeholder="Optional mistake code"
                />
              </div>
            </div>

          </div>
        ))}

        {targets.length === 0 && (
          <div className="text-center py-8 bg-gray-50 dark:bg-neutral-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600">
            <Target className="w-12 h-12 mx-auto text-gray-400 dark:text-neutral-500 mb-3" />
            <p className="text-gray-500 dark:text-neutral-400 font-medium">No targets added yet</p>
            <p className="text-sm text-gray-400 dark:text-neutral-500 mt-1">Click "Add Target" to start tracking target engagements</p>
          </div>
        )}
      </div>
    </div>
  );
}