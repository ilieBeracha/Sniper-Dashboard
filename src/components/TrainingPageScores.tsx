import { TrainingStore } from "@/store/trainingStore";
import BaseDashboardCard from "./BaseDashboardCard";
import { useStore } from "zustand";
import { Score } from "@/types/training";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Target, Clock, MapPin, Sun, Moon, Users, Award, Zap, Shield } from "lucide-react";

export default function TrainingPageScores() {
  const { scores } = useStore(TrainingStore);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [expandedSquads, setExpandedSquads] = useState<Record<string, boolean>>({});
  const [animatedScores, setAnimatedScores] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Create staggered animation effect for scores
    const timer = setTimeout(() => {
      const animationObj = scores.reduce((acc, score, index) => {
        setTimeout(() => {
          setAnimatedScores((prev) => ({
            ...prev,
            [score.id]: true,
          }));
        }, index * 100);
        return { ...acc, [score.id]: false };
      }, {});

      setAnimatedScores(animationObj);
    }, 300);

    return () => clearTimeout(timer);
  }, [scores]);

  // Toggle squad expansion
  const toggleSquadExpanded = (squadId: string) => {
    setExpandedSquads((prev) => ({
      ...prev,
      [squadId]: !prev[squadId],
    }));
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getAccuracy = (hits: number, shots: number) => {
    if (!shots) return 0;
    return Math.round((hits / shots) * 100);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "from-emerald-500/20 to-emerald-600/20 ring-emerald-500/20 text-emerald-400";
    if (accuracy >= 75) return "from-green-500/20 to-green-600/20 ring-green-500/20 text-green-400";
    if (accuracy >= 60) return "from-yellow-500/20 to-yellow-600/20 ring-yellow-500/20 text-yellow-400";
    return "from-red-500/20 to-red-600/20 ring-red-500/20 text-red-400";
  };

  // Group scores by squad
  const scoresBySquad = scores.reduce((acc, score) => {
    const squadId = score.squad_id || "No Squad";
    if (!acc[squadId]) {
      acc[squadId] = [];
    }
    acc[squadId].push(score);
    return acc;
  }, {} as Record<string, Score[]>);

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get squad performance metrics
  const getSquadMetrics = (squadScores: Score[]) => {
    const totalShots = squadScores.reduce((sum, score) => sum + (score.shots_fired || 0), 0);
    const totalHits = squadScores.reduce((sum, score) => sum + (score.hits || 0), 0);
    const avgAccuracy = totalShots ? Math.round((totalHits / totalShots) * 100) : 0;
    const avgTime = squadScores.reduce((sum, score) => sum + (score.time_until_first_shot || 0), 0) / squadScores.length;

    return {
      avgAccuracy,
      avgTime: avgTime.toFixed(1),
      totalScores: squadScores.length,
    };
  };

  return (
    <BaseDashboardCard title="Training Performance" tooltipContent="Comprehensive view of training scores by squad with detailed metrics">
      <div className="space-y-8">
        {Object.keys(scoresBySquad).length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-white/5">
            <Target className="mx-auto h-12 w-12 text-indigo-400 opacity-50 mb-3" />
            <p className="text-gray-400 text-lg">No training scores recorded yet</p>
            <p className="text-gray-500 text-sm mt-2">Complete training sessions to see performance data</p>
          </div>
        ) : (
          Object.entries(scoresBySquad).map(([squadId, squadScores]) => {
            const { avgAccuracy, avgTime, totalScores } = getSquadMetrics(squadScores);
            const isSquadExpanded = expandedSquads[squadId] === false; // Default to expanded unless explicitly collapsed

            return (
              <div key={squadId} className="rounded-xl bg-gradient-to-br from-white/5 to-transparent p-5 border border-white/10">
                <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSquadExpanded(squadId)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 flex items-center justify-center ring-2 ring-indigo-500/30">
                      <Users className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-white">{squadId === "No Squad" ? "Unassigned Personnel" : `Squad ${squadId}`}</h2>
                        {isSquadExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                      <div className="flex gap-2 mt-0.5">
                        <span className="px-2 py-0.5 text-xs font-medium bg-white/10 text-gray-300 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" /> {avgAccuracy}% avg accuracy
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium bg-white/10 text-gray-300 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {avgTime}s avg time
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium bg-white/10 text-gray-300 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {totalScores} {totalScores === 1 ? "session" : "sessions"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {isSquadExpanded && (
                  <div className="space-y-3 mt-4">
                    {squadScores.map((score: Score) => {
                      const isExpanded = expandedIds[score.id];
                      const isAnimated = animatedScores[score.id];
                      const accuracy = getAccuracy(score.hits, score.shots_fired);
                      const accuracyColorClass = getAccuracyColor(accuracy);

                      return (
                        <div
                          key={score.id}
                          className={`border border-white/10 rounded-lg overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/[0.05] transition-all duration-500 ease-in-out transform ${
                            isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          }`}
                        >
                          <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => toggleExpanded(score.id)}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 rounded-full bg-gradient-to-br ${accuracyColorClass} flex items-center justify-center ring-2`}
                              >
                                <Target className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-white">
                                    {score.shots_fired} shots / {score.hits} hits
                                  </h3>
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      accuracy >= 90
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : accuracy >= 75
                                        ? "bg-green-500/20 text-green-400"
                                        : accuracy >= 60
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-red-500/20 text-red-400"
                                    }`}
                                  >
                                    {accuracy}% accuracy
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-sm text-gray-400">Assignment #{score.assignment_session_id.substring(0, 8)}</p>
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                                  <p className="text-sm text-gray-400">{formatDate(score.created_at)}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-6 pb-6 pt-2 animate-fadeIn">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors">
                                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs font-medium">Reaction Time</span>
                                  </div>
                                  <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-white">{score.time_until_first_shot}</p>
                                    <p className="text-sm text-gray-400 mb-1">seconds</p>
                                  </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors">
                                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-xs font-medium">Target Distance</span>
                                  </div>
                                  <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-white">{score.distance}</p>
                                    <p className="text-sm text-gray-400 mb-1">meters</p>
                                  </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors">
                                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    {score.day_night === "day" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                    <span className="text-xs font-medium">Lighting Condition</span>
                                  </div>
                                  <p className="text-2xl font-bold text-white capitalize">{score.day_night}</p>
                                </div>
                              </div>

                              {score.user_participants && score.user_participants.length > 0 && (
                                <div className="mt-6">
                                  <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Participant Equipment
                                  </h4>
                                  <div className="bg-white/5 rounded-lg border border-white/10">
                                    <div className="grid grid-cols-3 text-xs font-medium text-gray-400 border-b border-white/10 bg-white/5">
                                      <div className="p-3">Participant</div>
                                      <div className="p-3">Weapon</div>
                                      <div className="p-3">Equipment</div>
                                    </div>
                                    {score.user_participants.map((participant) => (
                                      <div key={participant.user_id} className="grid grid-cols-3 text-sm border-b border-white/5 last:border-0">
                                        <div className="p-3 text-white">{participant.user_id.substring(0, 8)}</div>
                                        <div className="p-3 text-gray-300">{participant.weapon_id || "Standard"}</div>
                                        <div className="p-3 text-gray-300">{participant.equipment_id || "None"}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </BaseDashboardCard>
  );
}
