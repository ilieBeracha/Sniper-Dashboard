import React, { useState } from "react";
import { X, Zap, Target, Wind, Users } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
  // BASIC TIER - Most Common Training Scenarios
  {
    id: "zero-100m-prone",
    name: "🎯 Zeroing - 100m Prone",
    defaults: {
      distance: 100,
      position: "Lying",
      dayPeriod: "day",
      effort: false,
      numberOfTargets: 1,
      shotsFired: 5,
      targetHits: 4,
      includeWind: false,
    }
  },
  {
    id: "qual-300m-prone",
    name: "🎖️ Qualification - 300m Prone",
    defaults: {
      distance: 300,
      position: "Lying",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 1,
      shotsFired: 10,
      targetHits: 8,
      includeWind: true,
      windStrength: 5,
      windDirection: 90,
    }
  },
  {
    id: "combat-200m-kneeling",
    name: "⚔️ Combat Drill - 200m Kneeling",
    defaults: {
      distance: 200,
      position: "Sitting",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 3,
      shotsFired: 6,
      targetHits: 5,
      includeWind: false,
    }
  },
  
  // INTERMEDIATE TIER - Mixed Conditions
  {
    id: "wind-400m-prone",
    name: "💨 Wind Training - 400m Prone",
    defaults: {
      distance: 400,
      position: "Lying",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 1,
      shotsFired: 10,
      targetHits: 7,
      includeWind: true,
      windStrength: 10,
      windDirection: 270,
    }
  },
  {
    id: "twilight-300m-mixed",
    name: "🌅 Twilight Ops - 300m Mixed",
    defaults: {
      distance: 300,
      position: "Sitting",
      dayPeriod: "twilight",
      effort: true,
      numberOfTargets: 2,
      shotsFired: 8,
      targetHits: 6,
      includeWind: true,
      windStrength: 3,
      windDirection: 45,
    }
  },
  {
    id: "rapid-150m-standing",
    name: "⚡ Rapid Fire - 150m Standing",
    defaults: {
      distance: 150,
      position: "Standing",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 4,
      shotsFired: 8,
      targetHits: 6,
      includeWind: false,
    }
  },
  
  // ADVANCED TIER - Challenging Scenarios
  {
    id: "long-800m-prone",
    name: "🔭 Long Range - 800m Prone",
    defaults: {
      distance: 800,
      position: "Lying",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 1,
      shotsFired: 5,
      targetHits: 3,
      includeWind: true,
      windStrength: 15,
      windDirection: 135,
    }
  },
  {
    id: "night-500m-prone",
    name: "🌙 Night Ops - 500m Prone",
    defaults: {
      distance: 500,
      position: "Lying",
      dayPeriod: "night",
      effort: true,
      numberOfTargets: 1,
      shotsFired: 5,
      targetHits: 3,
      includeWind: true,
      windStrength: 8,
      windDirection: 180,
    }
  },
  {
    id: "extreme-1000m-prone",
    name: "🎯 Extreme Range - 1000m+",
    defaults: {
      distance: 1000,
      position: "Lying",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 1,
      shotsFired: 3,
      targetHits: 1,
      includeWind: true,
      windStrength: 20,
      windDirection: 225,
    }
  },
  
  // SPECIAL SCENARIOS
  {
    id: "stress-mixed-100-300",
    name: "😤 Stress Drill - Mixed Range",
    defaults: {
      distance: 200,
      position: "Sitting",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 5,
      shotsFired: 10,
      targetHits: 7,
      includeWind: false,
    }
  },
  {
    id: "custom-blank",
    name: "📝 Custom Session",
    defaults: {
      distance: 0,
      numberOfTargets: 1,
      shotsFired: 0,
      targetHits: 0,
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

  const accuracy = quickData.shotsFired > 0 
    ? Math.round((quickData.targetHits / quickData.shotsFired) * 100) 
    : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-xl shadow-xl ${
        theme === "dark" ? "bg-zinc-900 border border-zinc-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === "dark" ? "border-zinc-800" : "border-gray-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              theme === "dark" ? "bg-indigo-500/20" : "bg-indigo-100"
            }`}>
              <Zap className={`w-5 h-5 ${
                theme === "dark" ? "text-indigo-400" : "text-indigo-600"
              }`} />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                Quick Score Entry
              </h2>
              <p className={`text-sm ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>
                Log your shots quickly, fill details later
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              theme === "dark" 
                ? "hover:bg-zinc-800 text-zinc-400" 
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Training Assignment Selection */}
          <div>
            <Label className="mb-2">Training Assignment</Label>
            <Select 
              value={quickData.assignmentId} 
              onValueChange={(value) => setQuickData(prev => ({ ...prev, assignmentId: value }))}
            >
              <SelectTrigger className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}>
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

          {/* Training Preset Selection - Highlighted */}
          <div className={`p-4 rounded-lg border-2 ${
            theme === "dark" 
              ? "bg-zinc-800/50 border-indigo-500/30" 
              : "bg-indigo-50/50 border-indigo-200"
          }`}>
            <Label className="mb-2 flex items-center gap-2">
              <span className="text-sm font-semibold">Quick Preset Scenarios</span>
              <span className={`text-xs ${
                theme === "dark" ? "text-zinc-400" : "text-gray-500"
              }`}>(Recommended)</span>
            </Label>
            <Select value={quickData.categoryId} onValueChange={handleCategorySelect}>
              <SelectTrigger className={`${
                theme === "dark" ? "bg-zinc-900 border-zinc-700" : "bg-white"
              } ${quickData.categoryId ? "border-indigo-500" : ""}`}>
                <SelectValue placeholder="Choose a training scenario..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <div className="px-2 py-1 text-xs font-semibold text-gray-500">BASIC</div>
                {trainingCategories.slice(0, 3).map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 mt-2">INTERMEDIATE</div>
                {trainingCategories.slice(3, 6).map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 mt-2">ADVANCED</div>
                {trainingCategories.slice(6, 9).map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 mt-2">SPECIAL</div>
                {trainingCategories.slice(9).map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {quickData.categoryId && quickData.categoryId !== 'custom-blank' && (
              <div className={`mt-2 text-xs ${
                theme === "dark" ? "text-indigo-400" : "text-indigo-600"
              }`}>
                ✓ Preset loaded - Modify any field below as needed
              </div>
            )}
          </div>

          {/* Primary Score Entry */}
          <div className={`p-4 rounded-lg border-2 ${
            theme === "dark" 
              ? "bg-zinc-800/50 border-indigo-500/50" 
              : "bg-indigo-50 border-indigo-300"
          }`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Shots Fired
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={quickData.shotsFired}
                  onChange={(e) => setQuickData(prev => ({
                    ...prev,
                    shotsFired: parseInt(e.target.value) || 0
                  }))}
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "bg-zinc-900" : "bg-white"
                  }`}
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="mb-2">Target Hits</Label>
                <Input
                  type="number"
                  min="0"
                  max={quickData.shotsFired}
                  value={quickData.targetHits}
                  onChange={(e) => setQuickData(prev => ({
                    ...prev,
                    targetHits: Math.min(parseInt(e.target.value) || 0, prev.shotsFired)
                  }))}
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "bg-zinc-900" : "bg-white"
                  }`}
                  placeholder="0"
                />
              </div>
            </div>
            
            {quickData.shotsFired > 0 && (
              <div className={`mt-3 text-center p-2 rounded-lg ${
                theme === "dark" ? "bg-zinc-900" : "bg-white"
              }`}>
                <span className={`text-sm ${
                  theme === "dark" ? "text-zinc-400" : "text-gray-600"
                }`}>
                  Accuracy: 
                </span>
                <span className={`ml-2 font-semibold text-lg ${
                  accuracy >= 80 
                    ? "text-green-500" 
                    : accuracy >= 60 
                    ? "text-indigo-500" 
                    : "text-red-500"
                }`}>
                  {accuracy}%
                </span>
              </div>
            )}
          </div>

          {/* Target & Position Setup */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-2">Target Distance (m)</Label>
              <Input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={quickData.distance}
                onChange={(e) => setQuickData(prev => ({
                  ...prev,
                  distance: parseInt(e.target.value) || 100
                }))}
                className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}
              />
            </div>
            <div>
              <Label className="mb-2">Position</Label>
              <Select 
                value={quickData.position || ""} 
                onValueChange={(value) => setQuickData(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lying">Lying</SelectItem>
                  <SelectItem value="Sitting">Sitting</SelectItem>
                  <SelectItem value="Standing">Standing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Day Period */}
          <div>
            <Label className="mb-2">Time of Day</Label>
            <Select 
              value={quickData.dayPeriod || ""} 
              onValueChange={(value) => setQuickData(prev => ({ ...prev, dayPeriod: value }))}
            >
              <SelectTrigger className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="twilight">Twilight</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Optional Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="wind-toggle" 
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                <Checkbox
                  id="wind-toggle"
                  checked={quickData.includeWind}
                  onCheckedChange={(checked: boolean) => setQuickData(prev => ({
                    ...prev,
                    includeWind: checked
                  }))}
                />
                <Wind className="w-4 h-4" />
                <span>Include Wind Conditions</span>
              </Label>
            </div>

            {quickData.includeWind && (
              <div className="grid grid-cols-2 gap-3 ml-6">
                <div>
                  <Label className="text-xs">Wind Strength</Label>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={quickData.windStrength || 0}
                    onChange={(e) => setQuickData(prev => ({
                      ...prev,
                      windStrength: parseInt(e.target.value) || 0
                    }))}
                    className={`h-8 text-sm ${
                      theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""
                    }`}
                  />
                </div>
                <div>
                  <Label className="text-xs">Direction (°)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="359"
                    value={quickData.windDirection || 0}
                    onChange={(e) => setQuickData(prev => ({
                      ...prev,
                      windDirection: parseInt(e.target.value) || 0
                    }))}
                    className={`h-8 text-sm ${
                      theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""
                    }`}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label 
                htmlFor="squad-toggle" 
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                <Checkbox
                  id="squad-toggle"
                  checked={quickData.squadMode}
                  onCheckedChange={(checked: boolean) => setQuickData(prev => ({
                    ...prev,
                    squadMode: checked
                  }))}
                />
                <Users className="w-4 h-4" />
                <span>Include Squad Members</span>
              </Label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 p-6 border-t ${
          theme === "dark" ? "border-zinc-800" : "border-gray-200"
        }`}>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Start Quick Session"}
          </Button>
        </div>
      </div>
    </div>
  );
};