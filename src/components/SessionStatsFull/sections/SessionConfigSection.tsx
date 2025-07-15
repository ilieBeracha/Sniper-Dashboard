import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SessionData } from "../types";
import { SectionHeader } from "./SectionHeader";
import { Check } from "lucide-react";
import BaseButton from "@/components/base/BaseButton";
import { useTheme } from "@/contexts/ThemeContext";

interface SessionConfigSectionProps {
  section: any;
  sessionData: SessionData;
  updateSessionData: (field: keyof SessionData, value: any) => void;
  trainingAssignments: any[];
}

export const SessionConfigSection = ({ section, sessionData, updateSessionData, trainingAssignments }: SessionConfigSectionProps) => {
  const { theme } = useTheme();

  return (
    <div id="session-config" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4">
      <SectionHeader section={section} />
      <Card className={`border ${theme === "dark" ? "border-white/10 bg-zinc-900/30" : "border-gray-200 bg-gray-50/50"} rounded-lg p-4`}>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-3">
              <Label htmlFor="assignment" className={`text-base font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Training Assignment <span className="text-red-500">*</span>
              </Label>
              <select
                value={sessionData.assignment_id}
                onChange={(e) => updateSessionData("assignment_id", e.target.value)}
                className={`w-full h-9 px-3 text-sm border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${theme === "dark" ? "bg-zinc-800 border-zinc-600 text-white" : "border-gray-300"} transition-all`}
              >
                <option value="">Select assignment type</option>
                {trainingAssignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.assignment_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dayPeriod" className={`block text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} sm:mb-2`}>
                Day Period <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => updateSessionData("dayPeriod", "day")}
                  className={`relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border-2 transition-all ${
                    sessionData.dayPeriod === "day"
                      ? theme === "dark"
                        ? "border-blue-500 bg-blue-900/30"
                        : "border-blue-500 bg-blue-50"
                      : theme === "dark"
                        ? "border-neutral-600 bg-neutral-800 hover:border-neutral-500"
                        : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 ${sessionData.dayPeriod === "day" ? "text-yellow-500" : theme === "dark" ? "text-neutral-500" : "text-gray-400"}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      sessionData.dayPeriod === "day"
                        ? theme === "dark"
                          ? "text-blue-300"
                          : "text-blue-700"
                        : theme === "dark"
                          ? "text-neutral-300"
                          : "text-gray-700"
                    }`}
                  >
                    Day
                  </span>
                  {sessionData.dayPeriod === "day" && (
                    <div className="absolute top-2 right-2">
                      <Check className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => updateSessionData("dayPeriod", "night")}
                  className={`relative flex flex-col items-center justify-center p-2 sm:p-2 rounded-lg border-2 transition-all ${
                    sessionData.dayPeriod === "night"
                      ? theme === "dark"
                        ? "border-blue-500 bg-blue-900/30"
                        : "border-blue-500 bg-blue-50"
                      : theme === "dark"
                        ? "border-neutral-600 bg-neutral-800 hover:border-neutral-500"
                        : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 ${
                      sessionData.dayPeriod === "night"
                        ? theme === "dark"
                          ? "text-blue-300"
                          : "text-blue-400"
                        : theme === "dark"
                          ? "text-neutral-500"
                          : "text-gray-400"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      sessionData.dayPeriod === "night"
                        ? theme === "dark"
                          ? "text-blue-300"
                          : "text-blue-700"
                        : theme === "dark"
                          ? "text-neutral-300"
                          : "text-gray-700"
                    }`}
                  >
                    Night
                  </span>
                  {sessionData.dayPeriod === "night" && (
                    <div className="absolute top-2 right-2">
                      <Check className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeToFirstShot" className={`text-xs sm:text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Time to First Shot (seconds) <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3">
                <Input
                  id="timeToFirstShot"
                  type="number"
                  placeholder="Enter response time"
                  value={sessionData.timeToFirstShot || ""}
                  onChange={(e) => updateSessionData("timeToFirstShot", e.target.value ? parseInt(e.target.value) : null)}
                  className={`w-full h-9 ${theme === "dark" ? "border-white/10 focus:border-indigo-400 focus:ring-indigo-400 bg-zinc-800 text-white" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"} focus:ring-1 transition-all`}
                />
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"} flex-shrink-0`}>Quick presets:</span>
                  {[3, 5, 10, 15].map((seconds) => (
                    <BaseButton
                      key={seconds}
                      type="button"
                      onClick={() => updateSessionData("timeToFirstShot", seconds)}
                      style="purple"
                      padding="px-4 py-2 w-full"
                    >
                      {seconds}s
                    </BaseButton>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 lg:col-span-2">
              <Label htmlFor="notes" className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Session Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes about the training session, weather conditions, special circumstances..."
                className={`w-full min-h-[120px] ${theme === "dark" ? "border-white/10 focus:border-indigo-400 focus:ring-indigo-400 bg-zinc-800 text-white" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"} focus:ring-1 resize-none transition-all`}
                value={sessionData.note}
                onChange={(e) => updateSessionData("note", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
