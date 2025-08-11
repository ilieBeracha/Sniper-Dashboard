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
  
  // Default values to pre-fill
  position?: string;
  dayPeriod?: string;
  effort?: boolean;
}

const DEFAULT_CATEGORIES = [
  {
    id: "basic-100m",
    name: "Basic Training (100m)",
    defaults: {
      distance: 100,
      position: "Lying",
      dayPeriod: "day",
      effort: false,
      numberOfTargets: 1,
    }
  },
  {
    id: "medium-300m",
    name: "Medium Range (300m)",
    defaults: {
      distance: 300,
      position: "Lying",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 1,
    }
  },
  {
    id: "long-500m",
    name: "Long Range (500m)",
    defaults: {
      distance: 500,
      position: "Lying",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 1,
    }
  },
  {
    id: "multi-target",
    name: "Multi-Target Practice",
    defaults: {
      distance: 200,
      position: "Kneeling",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 3,
    }
  },
  {
    id: "night-training",
    name: "Night Training",
    defaults: {
      distance: 150,
      position: "Lying",
      dayPeriod: "night",
      effort: true,
      numberOfTargets: 1,
    }
  }
];

export const QuickStartModal: React.FC<QuickStartModalProps> = ({
  isOpen,
  onClose,
  onQuickStart,
  trainingCategories = DEFAULT_CATEGORIES
}) => {
  const { theme } = useTheme();
  const [quickData, setQuickData] = useState<QuickStartData>({
    shotsFired: 0,
    targetHits: 0,
    distance: 100,
    numberOfTargets: 1,
    position: "Lying",
    dayPeriod: "day",
    effort: false,
    includeWind: false,
    squadMode: false,
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
    if (quickData.shotsFired > 0) {
      onQuickStart(quickData);
    }
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
              theme === "dark" ? "bg-amber-500/20" : "bg-amber-100"
            }`}>
              <Zap className={`w-5 h-5 ${
                theme === "dark" ? "text-amber-400" : "text-amber-600"
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
          {/* Training Category Selection */}
          <div>
            <Label className="mb-2">Training Category (Optional)</Label>
            <Select value={quickData.categoryId} onValueChange={handleCategorySelect}>
              <SelectTrigger className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}>
                <SelectValue placeholder="Select a preset or customize below" />
              </SelectTrigger>
              <SelectContent>
                {trainingCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Primary Score Entry */}
          <div className={`p-4 rounded-lg border-2 ${
            theme === "dark" 
              ? "bg-zinc-800/50 border-amber-500/50" 
              : "bg-amber-50 border-amber-300"
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
                    ? "text-amber-500" 
                    : "text-red-500"
                }`}>
                  {accuracy}%
                </span>
              </div>
            )}
          </div>

          {/* Basic Target Setup */}
          <div>
            <Label className="mb-2">Target Distance (meters)</Label>
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
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={quickData.shotsFired === 0}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
          >
            Start Quick Session
          </Button>
        </div>
      </div>
    </div>
  );
};