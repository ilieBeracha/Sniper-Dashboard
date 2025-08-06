import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SessionData } from "../types";
import { SectionHeader } from "./SectionHeader";
import { Clock, ChevronDown, ChevronUp, FileText, Plus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import AddPurpleBtn from "@/components/base/buttons/AddPurpleBtn";
import DayPeriodSelect from "@/components/DayPeriodSelect";
import { BaseLabelRequired } from "@/components/base/BaseLabelRequired";

interface SessionConfigSectionProps {
  section: any;
  sessionData: SessionData;
  updateSessionData: (field: keyof SessionData, value: any) => void;
  trainingAssignments: any[];
  setIsAssignmentModalOpen: (open: boolean) => void;
}

export const SessionConfigSection = ({
  section,
  sessionData,
  updateSessionData,
  trainingAssignments,
  setIsAssignmentModalOpen,
}: SessionConfigSectionProps) => {
  const { theme } = useTheme();
  const [showTimeField, setShowTimeField] = useState(sessionData.timeToFirstShot !== null);
  const [showNotesField, setShowNotesField] = useState(sessionData.note !== "");

  return (
    <div className="w-full max-w-2xl mx-auto" id="session-config">
      <SectionHeader section={section} />

      <div className="mt-4 space-y-4">
        {/* Training Assignment */}
        <div className="space-y-1.5">
          <BaseLabelRequired>Training Assignment</BaseLabelRequired>

          <div className="flex items-center gap-2">
            <select
              value={sessionData.assignment_id}
              onChange={(e) => updateSessionData("assignment_id", e.target.value)}
              className={`w-full h-9 px-3 rounded-lg border transition-all focus:outline-none focus:ring-1 focus:ring-offset-1 text-sm ${
                theme === "dark"
                  ? "bg-zinc-900 border-zinc-700 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                  : "bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20"
              }`}
            >
              <option value="">Select assignment</option>
              {trainingAssignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.assignment_name}
                </option>
              ))}
            </select>
            <AddPurpleBtn onClick={() => setIsAssignmentModalOpen(true)}>
              <Plus size={12} />
            </AddPurpleBtn>
          </div>
        </div>

        <DayPeriodSelect dayPeriod={sessionData.dayPeriod} onDayPeriodChange={(dayPeriod) => updateSessionData("dayPeriod", dayPeriod)} />

        {/* Optional Fields */}
        <div className="space-y-2">
          <div className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
            Optional Fields
          </div>

          {/* Time to First Shot */}
          <div
            className={`rounded-lg border ${
              theme === "dark" ? "border-zinc-700 bg-zinc-800/30" : "border-gray-200 bg-gray-50/50"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowTimeField(!showTimeField)}
              className={`w-full px-3 py-2 flex items-center justify-between text-sm font-medium ${
                theme === "dark" ? "text-zinc-300" : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Time to First Shot</span>
                {sessionData.timeToFirstShot && <span className="text-indigo-500 font-normal text-xs">(Added)</span>}
              </div>
              {showTimeField ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTimeField && (
              <div className={`px-3 pb-2 border-t ${theme === "dark" ? "border-zinc-700" : "border-gray-200"}`}>
                <Input
                  type="number"
                  placeholder="Enter time in seconds"
                  className={`mt-2 h-8 text-sm rounded-md border ${
                    theme === "dark" ? "bg-zinc-800 border-zinc-600 focus:border-indigo-500" : "bg-white border-gray-200 focus:border-indigo-500"
                  }`}
                  value={sessionData.timeToFirstShot || ""}
                  onChange={(e) => updateSessionData("timeToFirstShot", e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            )}
          </div>

          {/* Session Notes */}
          <div
            className={`rounded-lg border ${
              theme === "dark" ? "border-zinc-700 bg-zinc-800/30" : "border-gray-200 bg-gray-50/50"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowNotesField(!showNotesField)}
              className={`w-full px-3 py-2 flex items-center justify-between text-sm font-medium ${
                theme === "dark" ? "text-zinc-300" : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Session Notes</span>
                {sessionData.note && <span className="text-indigo-500 font-normal text-xs">(Added)</span>}
              </div>
              {showNotesField ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showNotesField && (
              <div className={`px-3 pb-2 border-t ${theme === "dark" ? "border-zinc-700" : "border-gray-200"}`}>
                <Textarea
                  placeholder="Add any relevant notes..."
                  className={`mt-2 min-h-[60px] resize-none rounded-md border text-sm ${
                    theme === "dark" ? "bg-zinc-800 border-zinc-600 focus:border-indigo-500" : "bg-white border-gray-200 focus:border-indigo-500"
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
