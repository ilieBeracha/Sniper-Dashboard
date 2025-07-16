import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SessionData } from "../types";
import { SectionHeader } from "./SectionHeader";
import { Check, Sun, Moon, Clock, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

interface SessionConfigSectionProps {
  section: any;
  sessionData: SessionData;
  updateSessionData: (field: keyof SessionData, value: any) => void;
  trainingAssignments: any[];
}

export const SessionConfigSection = ({ section, sessionData, updateSessionData, trainingAssignments }: SessionConfigSectionProps) => {
  const { theme } = useTheme();
  const [showTimeField, setShowTimeField] = useState(sessionData.timeToFirstShot !== null);
  const [showNotesField, setShowNotesField] = useState(sessionData.note !== "");

  return (
    <div className="w-full max-w-2xl mx-auto">
      <SectionHeader section={section} />

      <div className="mt-8 space-y-6">
        {/* Training Assignment */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Training Assignment</Label>
          <select
            value={sessionData.assignment_id}
            onChange={(e) => updateSessionData("assignment_id", e.target.value)}
            className={`w-full h-12 px-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === "dark"
                ? "bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                : "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
            }`}
          >
            <option value="">Select assignment</option>
            {trainingAssignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.assignment_name}
              </option>
            ))}
          </select>
        </div>

        {/* Day Period */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Time Period</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateSessionData("dayPeriod", "day")}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                sessionData.dayPeriod === "day"
                  ? theme === "dark"
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-indigo-500 bg-indigo-50"
                  : theme === "dark"
                    ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                    : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <Sun
                className={`w-8 h-8 mx-auto mb-2 ${
                  sessionData.dayPeriod === "day" ? "text-indigo-500" : theme === "dark" ? "text-zinc-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm font-medium">Day</span>
              {sessionData.dayPeriod === "day" && <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />}
            </button>

            <button
              type="button"
              onClick={() => updateSessionData("dayPeriod", "night")}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                sessionData.dayPeriod === "night"
                  ? theme === "dark"
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-indigo-500 bg-indigo-50"
                  : theme === "dark"
                    ? "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                    : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <Moon
                className={`w-8 h-8 mx-auto mb-2 ${
                  sessionData.dayPeriod === "night" ? "text-indigo-500" : theme === "dark" ? "text-zinc-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm font-medium">Night</span>
              {sessionData.dayPeriod === "night" && <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />}
            </button>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="space-y-3">
          <div className={`text-xs font-medium ${theme === "dark" ? "text-zinc-500" : "text-gray-500"} mb-2`}>Optional Fields</div>

          {/* Time to First Shot - Collapsible */}
          <div
            className={`border-2 rounded-xl transition-all ${theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-gray-50/50"}`}
          >
            <button
              type="button"
              onClick={() => setShowTimeField(!showTimeField)}
              className={`w-full px-4 py-3 flex items-center justify-between text-sm font-medium ${
                theme === "dark" ? "text-zinc-300" : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Time to First Shot</span>
                {sessionData.timeToFirstShot && <span className="text-indigo-500 font-normal">({sessionData.timeToFirstShot}s)</span>}
              </div>
              {showTimeField ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTimeField && (
              <div className={`px-4 pb-4 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                <div className="mt-4 space-y-3">
                  <Input
                    type="number"
                    placeholder="Enter seconds"
                    value={sessionData.timeToFirstShot || ""}
                    onChange={(e) => updateSessionData("timeToFirstShot", e.target.value ? parseInt(e.target.value) : null)}
                    className={`h-10 px-3 rounded-lg border ${
                      theme === "dark" ? "bg-zinc-800 border-zinc-700 focus:border-indigo-500" : "bg-white border-gray-200 focus:border-indigo-500"
                    }`}
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 5, 10, 15].map((seconds) => (
                      <button
                        key={seconds}
                        type="button"
                        onClick={() => updateSessionData("timeToFirstShot", seconds)}
                        className={`py-1.5 rounded text-xs font-medium transition-all ${
                          sessionData.timeToFirstShot === seconds
                            ? "bg-indigo-500 text-white"
                            : theme === "dark"
                              ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {seconds}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes - Collapsible */}
          <div
            className={`border-2 rounded-xl transition-all ${theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-gray-50/50"}`}
          >
            <button
              type="button"
              onClick={() => setShowNotesField(!showNotesField)}
              className={`w-full px-4 py-3 flex items-center justify-between text-sm font-medium ${
                theme === "dark" ? "text-zinc-300" : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Session Notes</span>
                {sessionData.note && <span className="text-indigo-500 font-normal">(Added)</span>}
              </div>
              {showNotesField ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showNotesField && (
              <div className={`px-4 pb-4 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
                <Textarea
                  placeholder="Add any relevant notes..."
                  className={`mt-4 min-h-[80px] resize-none rounded-lg border ${
                    theme === "dark" ? "bg-zinc-800 border-zinc-700 focus:border-indigo-500" : "bg-white border-gray-200 focus:border-indigo-500"
                  }`}
                  value={sessionData.note}
                  onChange={(e) => updateSessionData("note", e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
