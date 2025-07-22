import { Input } from "@/components/ui/input";
import { Target as TargetIcon, Crosshair } from "lucide-react";
import { Target, Participant } from "../types";
import { SectionHeader } from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";

interface EngagementsSectionProps {
  section: any;
  targets: Target[];
  participants: Participant[];
  updateEngagement: (targetId: string, userId: string, field: "shotsFired" | "targetHits", value: number) => void;
}

export const EngagementsSection = ({ section, targets, participants, updateEngagement }: EngagementsSectionProps) => {
  const { theme } = useTheme();
  const snipers = participants.filter((p) => p.userDuty === "Sniper");

  if (targets.length === 0 || snipers.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto" id="engagements">
        <SectionHeader section={section} />

        <div
          className={`mt-8 justify-between text-center py-16 rounded-2xl border-2 ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}
        >
          {targets.length === 0 ? (
            <>
              <TargetIcon className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
              <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>No targets to engage</h3>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Configure targets first to record engagements</p>
            </>
          ) : (
            <>
              <Crosshair className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
              <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>No snipers assigned</h3>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                Add participants with sniper role to record engagements
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto" id="engagements">
      <SectionHeader section={section} />

      {/* Mobile View */}
      <div className="md:hidden mt-6 space-y-4">
        {snipers.map((participant, pIndex) => (
          <div
            key={participant.userId}
            className={`rounded-xl border-2 overflow-hidden ${
              theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
            }`}
          >
            {/* Participant Header */}
            <div
              className={`px-4 py-3 border-b ${
                theme === "dark" ? "bg-zinc-800/50 border-zinc-700" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    theme === "dark" ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {pIndex + 1}
                </div>
                <div>
                  <div className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {participant.name}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                    {participant.position}
                  </div>
                </div>
              </div>
            </div>

            {/* Targets */}
            <div className="p-4 space-y-3">
              {targets.map((target, tIndex) => {
                const engagement = target.engagements.find((e) => e.userId === participant.userId);
                const shots = engagement?.shotsFired || 0;
                const hits = engagement?.targetHits || 0;
                const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;

                return (
                  <div key={target.id} className="space-y-2">
                    <div className={`text-xs font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                      Target {tIndex + 1} • {target.distance}m
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                          Shots Fired
                        </label>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={engagement?.shotsFired || ""}
                          onChange={(e) => updateEngagement(target.id, participant.userId, "shotsFired", parseInt(e.target.value) || 0)}
                          className={`h-10 text-center text-sm font-medium rounded-lg ${
                            theme === "dark"
                              ? "bg-zinc-800 border-zinc-700 focus:border-indigo-500"
                              : "bg-gray-50 border-gray-200 focus:border-indigo-500"
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                          Target Hits
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max={engagement?.shotsFired || 999}
                            placeholder="0"
                            value={engagement?.targetHits || ""}
                            onChange={(e) => updateEngagement(target.id, participant.userId, "targetHits", parseInt(e.target.value) || 0)}
                            className={`h-10 text-center text-sm font-medium rounded-lg ${
                              theme === "dark"
                                ? "bg-zinc-800 border-zinc-700 focus:border-indigo-500"
                                : "bg-gray-50 border-gray-200 focus:border-indigo-500"
                            }`}
                          />
                          {shots > 0 && (
                            <div
                              className={`absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                                accuracy >= 80
                                  ? "bg-green-500/20 text-green-500"
                                  : accuracy >= 60
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "bg-red-500/20 text-red-500"
                              }`}
                            >
                              {accuracy}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className={`hidden md:block mt-8 rounded-2xl border-2 overflow-hidden ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${200 + targets.length * 160}px` }}>
            {/* Table Header */}
            <div
              className={`grid gap-2 px-4 py-3 text-xs font-medium border-b ${
                theme === "dark" ? "bg-zinc-800/50 border-zinc-700 text-zinc-400" : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
              style={{ gridTemplateColumns: `200px repeat(${targets.length * 2}, 80px)` }}
            >
              <div>Participant</div>
              {targets.map((target, index) => (
                <React.Fragment key={target.id}>
                  <div className="text-center col-span-2">
                    Target {index + 1} ({target.distance}m)
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Sub-header with Shots/Hits */}
            <div
              className={`grid gap-2 px-4 py-2 text-xs border-b ${
                theme === "dark" ? "bg-zinc-900/50 border-zinc-700 text-zinc-500" : "bg-gray-100 border-gray-200 text-gray-500"
              }`}
              style={{ gridTemplateColumns: `200px repeat(${targets.length * 2}, 80px)` }}
            >
              <div></div>
              {targets.map((target) => (
                <React.Fragment key={`${target.id}-header`}>
                  <div className="text-center">Shots</div>
                  <div className="text-center">Hits</div>
                </React.Fragment>
              ))}
            </div>

            {/* Data Rows */}
            <div className="divide-y divide-zinc-800 dark:divide-zinc-700">
              {snipers.map((participant, pIndex) => {
                return (
                  <div
                    key={participant.userId}
                    className={`grid gap-2 px-4 py-3 items-center ${theme === "dark" ? "hover:bg-zinc-800/30" : "hover:bg-gray-50"}`}
                    style={{ gridTemplateColumns: `200px repeat(${targets.length * 2}, 80px)` }}
                  >
                    {/* Participant Info */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          theme === "dark" ? "bg-amber-500/20 text-amber-400" : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {pIndex + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-medium truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{participant.name}</div>
                        <div className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{participant.position}</div>
                      </div>
                    </div>

                    {/* Engagement Inputs */}
                    {targets.map((target) => {
                      const engagement = target.engagements.find((e) => e.userId === participant.userId);
                      const shots = engagement?.shotsFired || 0;
                      const hits = engagement?.targetHits || 0;
                      const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;

                      return (
                        <React.Fragment key={`${participant.userId}-${target.id}`}>
                          <div className="px-1">
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={engagement?.shotsFired || ""}
                              onChange={(e) => updateEngagement(target.id, participant.userId, "shotsFired", parseInt(e.target.value) || 0)}
                              className={`h-9 text-center text-sm font-medium rounded-lg transition-all ${
                                theme === "dark"
                                  ? "bg-zinc-800 border-zinc-700 focus:border-indigo-500 focus:bg-zinc-700"
                                  : "bg-gray-50 border-gray-200 focus:border-indigo-500 focus:bg-white"
                              }`}
                            />
                          </div>
                          <div className="px-1 relative">
                            <Input
                              type="number"
                              min="0"
                              max={engagement?.shotsFired || 999}
                              placeholder="0"
                              value={engagement?.targetHits || ""}
                              onChange={(e) => updateEngagement(target.id, participant.userId, "targetHits", parseInt(e.target.value) || 0)}
                              className={`h-9 text-center text-sm font-medium rounded-lg transition-all ${
                                theme === "dark"
                                  ? "bg-zinc-800 border-zinc-700 focus:border-indigo-500 focus:bg-zinc-700"
                                  : "bg-gray-50 border-gray-200 focus:border-indigo-500 focus:bg-white"
                              }`}
                            />
                            {shots > 0 && (
                              <div
                                className={`absolute -top-2 -right-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                                  accuracy >= 80
                                    ? "bg-green-500/20 text-green-500 border border-green-500/30"
                                    : accuracy >= 60
                                      ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                                      : "bg-red-500/20 text-red-500 border border-red-500/30"
                                }`}
                              >
                                {accuracy}%
                              </div>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Summary Row */}
            <div
              className={`grid gap-2 px-4 py-3 border-t font-medium ${
                theme === "dark" ? "bg-zinc-800/50 border-zinc-700" : "bg-gray-50 border-gray-200"
              }`}
              style={{ gridTemplateColumns: `200px repeat(${targets.length * 2}, 80px)` }}
            >
              <div className={`text-sm ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>Total</div>
              {targets.map((target) => {
                const totalShots = target.engagements.reduce((sum, e) => sum + (e.shotsFired || 0), 0);
                const totalHits = target.engagements.reduce((sum, e) => sum + (e.targetHits || 0), 0);
                const accuracy = totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0;

                return (
                  <React.Fragment key={`${target.id}-total`}>
                    <div className={`text-center text-sm ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>{totalShots}</div>
                    <div className={`text-center text-sm ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                      {totalHits}
                      {totalShots > 0 && (
                        <span className={`ml-1 text-xs ${accuracy >= 80 ? "text-green-500" : accuracy >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                          ({accuracy}%)
                        </span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
