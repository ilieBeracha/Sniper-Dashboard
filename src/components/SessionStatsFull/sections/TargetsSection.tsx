import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target as TargetIcon, Trash2, Wind, Plus, Minus, AlertCircle, ChevronDown } from "lucide-react";
import { Target } from "../types";
import { SectionHeader } from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
    <div className="w-full max-w-2xl mx-auto" id="targets">
      <div className="flex items-center justify-between mb-4">
        <SectionHeader section={section} />
        <button
          onClick={addTarget}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-all hover:scale-105"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Target</span>
        </button>
      </div>

      {/* Targets List - Compact Design */}
      <div className={`rounded-xl border overflow-hidden ${theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"}`}>
        {targets?.length > 0 ? (
          <div className={`divide-y ${theme === "dark" ? "divide-zinc-800" : "divide-gray-200"}`}>
            {targets?.map((target, index) => (
              <div key={target.id} className={`transition-all ${theme === "dark" ? "hover:bg-zinc-800/20" : "hover:bg-gray-50"}`}>
                {/* Compact Target Row */}
                <div className="p-3 pb-2">
                  <div className="flex items-center gap-3">
                    {/* Target Number */}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${
                        theme === "dark" ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Distance Controls */}
                    <div className="flex-1 flex items-center gap-2">
                      <TargetIcon className="w-4 h-4 text-zinc-500" />
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0 hover:bg-zinc-800/50"
                          onClick={() => updateTarget(target.id, "distance", Math.max(100, target.distance - 25))}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          min={100}
                          max={900}
                          step={25}
                          value={target.distance}
                          onChange={(e) => updateTarget(target.id, "distance", parseInt(e.target.value))}
                          className={`text-center w-20 h-7 text-sm font-medium ${theme === "dark" ? "bg-zinc-800/50 border-zinc-700" : "bg-gray-50 border-gray-200"}`}
                        />
                        <span className="text-xs text-zinc-500">m</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0 hover:bg-zinc-800/50"
                          onClick={() => updateTarget(target.id, "distance", Math.min(900, target.distance + 25))}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Options Menu */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className={`h-7 w-7 ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className={`w-80 p-3 max-h-[80dvh] overflow-y-auto ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}
                      >
                        <div className="space-y-3">
                          {/* Wind Controls */}
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Label className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                                <Wind className="w-3 h-3" />
                                Wind
                              </Label>
                              <div className="flex gap-1.5">
                                <Input
                                  type="number"
                                  placeholder="Speed"
                                  value={target.windStrength || ""}
                                  onChange={(e) => updateTarget(target.id, "windStrength", e.target.value ? parseInt(e.target.value) : null)}
                                  className="h-7 text-xs"
                                />
                                <Input
                                  type="number"
                                  placeholder="Dir°"
                                  min="0"
                                  max="360"
                                  value={target.windDirection || ""}
                                  onChange={(e) => updateTarget(target.id, "windDirection", e.target.value ? parseInt(e.target.value) : null)}
                                  className="h-7 text-xs"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Mistake Code */}
                          <div>
                            <Label className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Mistake Code
                            </Label>
                            <Input
                              placeholder="Optional"
                              value={target.mistakeCode}
                              onChange={(e) => updateTarget(target.id, "mistakeCode", e.target.value)}
                              className="h-7 text-xs"
                            />
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => removeTarget(target.id)}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-xs font-medium"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove Target
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* First Shot Hit - Compact Row */}
                <div className="px-3 pb-2">
                  <div className="flex items-center gap-2 ml-11">
                    <span className="text-xs text-zinc-500">First shot:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateTarget(target.id, "firstShotHit", true)}
                        className={`px-2 w-full py-0.5 rounded text-xs font-medium transition-all ${
                          target.firstShotHit === true
                            ? "bg-green-500/20 text-green-500 border border-green-500/30"
                            : theme === "dark"
                              ? "bg-zinc-800/50 text-zinc-500 border border-zinc-700 hover:border-zinc-600"
                              : "bg-gray-100 text-gray-500 border border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        Hit
                      </button>
                      <button
                        onClick={() => updateTarget(target.id, "firstShotHit", false)}
                        className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${
                          target.firstShotHit === false
                            ? "bg-red-500/20 text-red-500 border border-red-500/30"
                            : theme === "dark"
                              ? "bg-zinc-800/50 text-zinc-500 border border-zinc-700 hover:border-zinc-600"
                              : "bg-gray-100 text-gray-500 border border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        Miss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
            <TargetIcon className={`w-8 h-8 mx-auto mb-2 opacity-50`} />
            <p className="text-sm font-medium">No targets yet</p>
            <p className="text-xs mt-1 opacity-75">Click "Add Target" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};
