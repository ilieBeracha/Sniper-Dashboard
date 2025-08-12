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
    id: "zero-100m",
    name: "Zeroing - 100m Prone",
    defaults: {
      distance: 100,
      position: "Lying",
      dayPeriod: "day",
      effort: false,
      numberOfTargets: 1,
    }
  },
  {
    id: "qual-300m",
    name: "Qualification - 300m",
    defaults: {
      distance: 300,
      position: "Lying",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 1,
    }
  },
  {
    id: "combat-200m",
    name: "Combat Drill - 200m",
    defaults: {
      distance: 200,
      position: "Sitting",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 3,
    }
  },
  {
    id: "long-range-500m",
    name: "Long Range - 500m",
    defaults: {
      distance: 500,
      position: "Lying",
      dayPeriod: "day",
      effort: true,
      numberOfTargets: 1,
    }
  },
  {
    id: "night-300m",
    name: "Night Training - 300m",
    defaults: {
      distance: 300,
      position: "Lying",
      dayPeriod: "night",
      effort: true,
      numberOfTargets: 1,
    }
  },
  {
    id: "custom",
    name: "Custom Session",
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
        <div className="p-4 space-y-3">
          {/* Assignment & Preset in one row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs mb-1">Assignment</Label>
              <Select 
                value={quickData.assignmentId} 
                onValueChange={(value) => setQuickData(prev => ({ ...prev, assignmentId: value }))}
              >
                <SelectTrigger className={`h-8 text-sm ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
                  <SelectValue placeholder="Select" />
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
            
            <div>
              <Label className="text-xs mb-1">Preset</Label>
              <Select value={quickData.categoryId} onValueChange={handleCategorySelect}>
                <SelectTrigger className={`h-8 text-sm ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  {trainingCategories.map(category => (
                    <SelectItem key={category.id} value={category.id} className="text-sm">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Score Entry */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs mb-1">Shots Fired</Label>
              <Input
                type="number"
                min="0"
                value={quickData.shotsFired}
                onChange={(e) => setQuickData(prev => ({
                  ...prev,
                  shotsFired: parseInt(e.target.value) || 0
                }))}
                className={`h-8 text-sm ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-xs mb-1">Hits</Label>
              <Input
                type="number"
                min="0"
                max={quickData.shotsFired}
                value={quickData.targetHits}
                onChange={(e) => setQuickData(prev => ({
                  ...prev,
                  targetHits: Math.min(parseInt(e.target.value) || 0, prev.shotsFired)
                }))}
                className={`h-8 text-sm ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}
                placeholder="0"
              />
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs mb-1">Distance</Label>
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
              <Label className="text-xs mb-1">Position</Label>
              <Select 
                value={quickData.position || ""} 
                onValueChange={(value) => setQuickData(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger className={`h-8 text-sm ${theme === "dark" ? "bg-zinc-800 border-zinc-700" : ""}`}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lying">Lying</SelectItem>
                  <SelectItem value="Sitting">Sitting</SelectItem>
                  <SelectItem value="Standing">Standing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1">Time</Label>
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