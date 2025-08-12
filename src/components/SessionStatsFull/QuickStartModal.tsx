import React, { useState } from "react";
import { X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuickStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickStart: (data: QuickStartData) => void;
  trainingCategories?: Array<{ id: string; name: string; defaults: Partial<QuickStartData> }>;
  trainingAssignments?: Array<{ id: string; assignment_name: string }>;
  isSubmitting?: boolean;
}

export interface QuickStartData {
  // Essential scoring fields
  shotsFired: number;
  targetHits: number;
  distance: number;
  
  // Optional quick fields
  categoryId?: string;
  includeWind?: boolean;
  windStrength?: number;
  windDirection?: number;
  numberOfTargets?: number;
  squadMode?: boolean;
  assignmentId?: string;
  
  // Default values to pre-fill
  position?: string;
  dayPeriod?: string;
  effort?: boolean;
}

const DEFAULT_CATEGORIES = [
  {
    id: "precision-100",
    name: "Precision Zero",
    defaults: {
      distance: 100,
      position: "Laying",
      dayPeriod: "day",
      effort: false,
      numberOfTargets: 1,
    }
  },
  {
    id: "standard-300",
    name: "Standard Qualification",
    defaults: {
      distance: 300,
      position: "Laying",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 1,
    }
  },
  {
    id: "operational-200",
    name: "Operational Readiness",
    defaults: {
      distance: 200,
      position: "Operational",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 3,
    }
  },
  {
    id: "distance-500",
    name: "Distance Challenge",
    defaults: {
      distance: 500,
      position: "Laying",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 1,
    }
  },
  {
    id: "lowlight-300",
    name: "Low Light Operations",
    defaults: {
      distance: 300,
      position: "Laying",
      dayPeriod: "twilight",
      effort: true,
      numberOfTargets: 2,
    }
  },
  {
    id: "standing-150",
    name: "Standing Engagement",
    defaults: {
      distance: 150,
      position: "Standing",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 2,
    }
  },
  {
    id: "night-ops-400",
    name: "Night Operations",
    defaults: {
      distance: 400,
      position: "Laying",
      dayPeriod: "night",
      effort: true,
      numberOfTargets: 1,
    }
  },
  {
    id: "custom",
    name: "Custom Configuration",
    defaults: {
      distance: 0,
      numberOfTargets: 1,
    }
  }
];

export const QuickStartModal: React.FC<QuickStartModalProps> = ({
  isOpen,
  onClose,
  onQuickStart,
  trainingCategories = DEFAULT_CATEGORIES,
  trainingAssignments = [],
  isSubmitting = false
}) => {
  const { theme } = useTheme();
  const [quickData, setQuickData] = useState<QuickStartData>({
    shotsFired: 0,
    targetHits: 0,
    distance: 0,
    numberOfTargets: 1,
    position: "",
    dayPeriod: "",
    effort: false,
    includeWind: false,
    squadMode: false,
    assignmentId: "",
  });

  const handleCategorySelect = (categoryId: string) => {
    const category = trainingCategories.find(c => c.id === categoryId);
    if (category) {
      setQuickData(prev => ({
        ...prev,
        ...category.defaults,
        categoryId,
      }));
    }
  };

  const handleSubmit = () => {
    // Allow submission even with 0 shots - user can fill in later
    onQuickStart(quickData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-sm rounded-lg shadow-xl ${
        theme === "dark" ? "bg-zinc-900 border border-zinc-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === "dark" ? "border-zinc-800" : "border-gray-200"
        }`}>
          <h2 className={`text-base font-medium ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            Quick Session
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${
              theme === "dark" 
                ? "hover:bg-zinc-800 text-zinc-400" 
                : "hover:bg-gray-100 text-gray-400"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Assignment */}
          <div>
            <Label className="text-xs mb-1">Training Assignment</Label>
            <Select 
              value={quickData.assignmentId} 
              onValueChange={(value) => setQuickData(prev => ({ ...prev, assignmentId: value }))}
            >
              <SelectTrigger className={`h-9 text-sm ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
                <SelectValue placeholder="Select assignment" />
              </SelectTrigger>
              <SelectContent>
                {trainingAssignments.map(assignment => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    {assignment.assignment_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Impressive Preset Selection */}
          <div>
            <Label className="text-xs mb-2 uppercase tracking-wider opacity-60">Training Preset</Label>
            <Select value={quickData.categoryId} onValueChange={handleCategorySelect}>
              <SelectTrigger className={`h-12 ${
                quickData.categoryId 
                  ? theme === "dark" 
                    ? "bg-indigo-900/20 border-indigo-500/50 text-indigo-300" 
                    : "bg-indigo-50 border-indigo-300 text-indigo-700"
                  : theme === "dark" 
                    ? "bg-zinc-800 border-zinc-700" 
                    : ""
              }`}>
                <SelectValue placeholder="Choose a training preset..." />
              </SelectTrigger>
              <SelectContent className="max-h-[320px]">
                {trainingCategories.map(category => {
                  const isCustom = category.id === 'custom';
                  const preset = category.defaults;
                  return (
                    <SelectItem 
                      key={category.id} 
                      value={category.id} 
                      className={`py-3 ${isCustom ? 'border-t mt-2 pt-3' : ''}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{category.name}</span>
                          {!isCustom && (
                            <div className="flex items-center gap-3 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
                              }`}>
                                {preset.distance}m
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
                              }`}>
                                {preset.position}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                preset.dayPeriod === 'night' 
                                  ? theme === "dark" ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700"
                                  : preset.dayPeriod === 'twilight'
                                  ? theme === "dark" ? "bg-orange-900/50 text-orange-300" : "bg-orange-100 text-orange-700"
                                  : theme === "dark" ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700"
                              }`}>
                                {preset.dayPeriod === 'twilight' ? 'Twilight' : preset.dayPeriod === 'night' ? 'Night' : 'Day'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Display Selected Preset Configuration */}
          {quickData.categoryId && quickData.categoryId !== 'custom' && (
            <div className={`p-3 rounded-lg border ${
              theme === "dark" 
                ? "bg-zinc-800/50 border-zinc-700" 
                : "bg-gray-50 border-gray-200"
            }`}>
              <p className={`text-xs font-medium mb-2 ${
                theme === "dark" ? "text-zinc-400" : "text-gray-500"
              }`}>
                PRESET CONFIGURATION
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className={theme === "dark" ? "text-zinc-500" : "text-gray-400"}>Distance</span>
                  <p className={`font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-700"}`}>
                    {quickData.distance}m
                  </p>
                </div>
                <div>
                  <span className={theme === "dark" ? "text-zinc-500" : "text-gray-400"}>Position</span>
                  <p className={`font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-700"}`}>
                    {quickData.position}
                  </p>
                </div>
                <div>
                  <span className={theme === "dark" ? "text-zinc-500" : "text-gray-400"}>Time</span>
                  <p className={`font-semibold ${theme === "dark" ? "text-zinc-200" : "text-gray-700"}`}>
                    {quickData.dayPeriod === 'twilight' ? 'Twilight' : quickData.dayPeriod === 'night' ? 'Night' : 'Day'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Score Entry - Always Visible */}
          <div className={`p-3 rounded-lg border-2 ${
            theme === "dark" 
              ? "bg-zinc-900/50 border-indigo-500/30" 
              : "bg-indigo-50/50 border-indigo-200"
          }`}>
            <Label className="text-xs mb-2 uppercase tracking-wider opacity-60">Performance Score</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1 font-normal">Shots Fired</Label>
                <Input
                  type="number"
                  min="0"
                  value={quickData.shotsFired}
                  onChange={(e) => setQuickData(prev => ({
                    ...prev,
                    shotsFired: parseInt(e.target.value) || 0
                  }))}
                  className={`h-10 text-base font-semibold text-center ${
                    theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white"
                  }`}
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 font-normal">Target Hits</Label>
                <Input
                  type="number"
                  min="0"
                  max={quickData.shotsFired}
                  value={quickData.targetHits}
                  onChange={(e) => setQuickData(prev => ({
                    ...prev,
                    targetHits: Math.min(parseInt(e.target.value) || 0, prev.shotsFired)
                  }))}
                  className={`h-10 text-base font-semibold text-center ${
                    theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white"
                  }`}
                  placeholder="0"
                />
              </div>
            </div>
            {quickData.shotsFired > 0 && (
              <div className={`mt-2 text-center text-xs ${
                theme === "dark" ? "text-zinc-400" : "text-gray-500"
              }`}>
                Accuracy: <span className={`font-semibold ${
                  Math.round((quickData.targetHits / quickData.shotsFired) * 100) >= 80 
                    ? "text-green-500" 
                    : Math.round((quickData.targetHits / quickData.shotsFired) * 100) >= 60 
                    ? "text-indigo-500" 
                    : "text-red-500"
                }`}>
                  {Math.round((quickData.targetHits / quickData.shotsFired) * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Manual Configuration - Only for Custom */}
          {(!quickData.categoryId || quickData.categoryId === 'custom') && (
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-wider opacity-60">Manual Configuration</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs mb-1 font-normal">Distance (m)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="2000"
                    step="50"
                    value={quickData.distance}
                    onChange={(e) => setQuickData(prev => ({
                      ...prev,
                      distance: parseInt(e.target.value) || 0
                    }))}
                    className={`h-8 text-sm ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-xs mb-1 font-normal">Position</Label>
                  <Select 
                    value={quickData.position || ""} 
                    onValueChange={(value) => setQuickData(prev => ({ ...prev, position: value }))}
                  >
                    <SelectTrigger className={`h-8 text-sm ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laying">Laying</SelectItem>
                      <SelectItem value="Standing">Standing</SelectItem>
                      <SelectItem value="Operational">Operational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs mb-1 font-normal">Time</Label>
                  <Select 
                    value={quickData.dayPeriod || ""} 
                    onValueChange={(value) => setQuickData(prev => ({ ...prev, dayPeriod: value }))}
                  >
                    <SelectTrigger className={`h-8 text-sm ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="twilight">Twilight</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex gap-2 p-4 border-t ${
          theme === "dark" ? "border-zinc-800" : "border-gray-200"
        }`}>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-8 text-sm"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-8 text-sm bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Session"}
          </Button>
        </div>
      </div>
    </div>
  );
};