import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SessionData } from "../types";
import { SectionHeader } from "./SectionHeader";

interface SessionConfigSectionProps {
  section: any;
  sessionData: SessionData;
  updateSessionData: (field: keyof SessionData, value: any) => void;
  trainingAssignments: any[];
}

export const SessionConfigSection = ({ section, sessionData, updateSessionData, trainingAssignments }: SessionConfigSectionProps) => {
  return (
    <div id="session-config" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4">
      <SectionHeader section={section} />
      <Card className="border-0 shadow-sm dark:shadow-black/20 bg-white dark:bg-[#1A1A1A]">
        <CardContent className="px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-3">
              <Label htmlFor="assignment" className="text-base font-medium text-gray-700 dark:text-gray-300">
                Training Assignment <span className="text-red-500">*</span>
              </Label>
              <select
                value={sessionData.assignment_id}
                onChange={(e) => updateSessionData("assignment_id", e.target.value)}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white transition-all"
              >
                <option value="">Select assignment type</option>
                {trainingAssignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.assignment_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="dayPeriod" className="text-base font-medium text-gray-700 dark:text-gray-300">
                Time Period <span className="text-red-500">*</span>
              </Label>
              <select
                value={sessionData.dayPeriod}
                onChange={(e) => updateSessionData("dayPeriod", e.target.value)}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white transition-all"
              >
                <option value="">Select time period</option>
                <option value="day">Day Training</option>
                <option value="night">Night Training</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="timeToFirstShot" className="text-base font-medium text-gray-700 dark:text-gray-300">
                Time to First Shot (seconds) <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-3">
                <Input
                  id="timeToFirstShot"
                  type="number"
                  placeholder="Enter response time"
                  value={sessionData.timeToFirstShot || ""}
                  onChange={(e) => updateSessionData("timeToFirstShot", e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full h-10 border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white transition-all"
                />
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">Quick presets:</span>
                  {[3, 5, 10].map((seconds) => (
                    <Button
                      key={seconds}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateSessionData("timeToFirstShot", seconds)}
                      className="h-8 px-4 text-sm border-gray-300 dark:border-white/10 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all"
                    >
                      {seconds}s
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 lg:col-span-2">
              <Label htmlFor="notes" className="text-base font-medium text-gray-700 dark:text-gray-300">
                Session Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes about the training session, weather conditions, special circumstances..."
                className="w-full min-h-[120px] border-gray-300 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:bg-zinc-800 dark:text-white resize-none transition-all"
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
