import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Target as TargetIcon, Crosshair } from "lucide-react";
import { Target, Participant } from "../types";
import { SectionHeader } from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";

interface EngagementsSectionProps {
  section: any;
  targets: Target[];
  participants: Participant[];
  updateEngagement: (targetId: string, userId: string, field: "shotsFired" | "targetHits", value: number) => void;
}

export const EngagementsSection = ({ section, targets, participants, updateEngagement }: EngagementsSectionProps) => {
  const { theme } = useTheme();

  return (
    <div id="engagements" className="snap-start scroll-mt-4 h-[calc(100vh-5rem)] flex flex-col space-y-6 py-8">
      <SectionHeader section={section} />
      <Card className={`border ${theme === "dark" ? "border-white/10 bg-zinc-900/30" : "border-gray-200 bg-gray-50/50"} rounded-lg p-6 lg:p-8 flex-1 overflow-auto`}>
        <CardContent className="p-0">
          <div className="space-y-8 lg:space-y-12">
            {targets.map((target, targetIndex) => (
              <div key={target.id}>
                <div className={`border-b ${theme === "dark" ? "border-white/10" : "border-gray-200"} p-6 lg:p-8`}>
                  <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span>
                        Target #{targetIndex + 1} - {target.distance}m
                      </span>
                      {(target.windStrength || target.windDirection) && (
                        <span className={`text-sm font-normal ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          (Wind: {target.windStrength || 0}m/s at {target.windDirection || 0}°)
                        </span>
                      )}
                    </div>
                  </h3>
                </div>
                <div className="p-6 lg:p-8">
                  {/* Header row */}
                  <div className={`grid grid-cols-3 gap-4 mb-6 pb-4 border-b ${theme === "dark" ? "border-white/5" : "border-gray-100"}`}>
                    <span className={`text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}></span>
                    <span
                      className={`text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider text-center`}
                    >
                      Shots
                    </span>
                    <span
                      className={`text-xs font-semibold ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider text-center`}
                    >
                      Hits
                    </span>
                  </div>

                  {/* Data rows */}
                  <div className="space-y-4">
                    {participants
                      .filter((p) => p.userDuty === "Sniper")
                      .map((participant) => {
                        const engagement = target.engagements.find((e) => e.userId === participant.userId);

                        return (
                          <div
                            key={participant.userId}
                            className={`grid grid-cols-3 gap-4 items-center py-3 ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50"} rounded-lg transition-colors`}
                          >
                            {/* Name column */}
                            <div className="flex items-center space-x-3">
                              <div className="min-w-0 flex-1">
                                <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} truncate`}>{participant.name}</p>
                                <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{participant.position} position</p>
                              </div>
                            </div>

                            {/* Shots fired column */}
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={engagement?.shotsFired || ""}
                                onChange={(e) => updateEngagement(target.id, participant.userId, "shotsFired", parseInt(e.target.value) || 0)}
                                className={`w-20 h-9 text-center ${theme === "dark" ? "border-white/10 focus:border-indigo-400 focus:ring-indigo-400 bg-zinc-800 text-white" : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"} focus:ring-1 transition-all`}
                              />
                            </div>

                            {/* Target hits column */}
                            <div className="flex justify-center">
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={engagement?.targetHits || ""}
                                onChange={(e) => updateEngagement(target.id, participant.userId, "targetHits", parseInt(e.target.value) || 0)}
                                className={`w-20 h-9 text-center ${theme === "dark" ? "border-white/10 focus:border-indigo-400 focus:ring-indigo-400 bg-zinc-800 text-white" : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"} focus:ring-1 transition-all`}
                              />
                            </div>
                          </div>
                        );
                      })}

                    {participants.filter((p) => p.userDuty === "Sniper").length === 0 && (
                      <div className={`text-center ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
                        <Crosshair className={`w-10 h-10 mx-auto mb-2 ${theme === "dark" ? "text-zinc-600" : "text-gray-300"}`} />
                        <p>No snipers assigned. Add participants with sniper role to record engagements.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {targets.length === 0 && (
              <div
                className={`text-center py-12 border-2 border-dashed ${theme === "dark" ? "border-white/10 bg-zinc-800" : "border-gray-300 bg-gray-50/50"} rounded-lg`}
              >
                <TargetIcon className={`w-14 h-14 mx-auto ${theme === "dark" ? "text-zinc-600" : "text-gray-400"} mb-4`} />
                <h3 className={`text-xl font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>No targets to engage</h3>
                <p className={`${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Configure targets above to record engagements</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
