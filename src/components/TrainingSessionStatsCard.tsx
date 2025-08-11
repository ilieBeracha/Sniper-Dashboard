import { useTheme } from "@/contexts/ThemeContext";
import { performanceStore } from "@/store/performance";
import { Skeleton } from "@heroui/react";
import { useEffect, useState } from "react";
import { Target, TrendingUp, ChevronDown, ChevronUp, Crosshair, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function TrainingSessionStatsCard({ trainingSessionId }: { trainingSessionId: string }) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const { trainingTeamAnalytics, getTrainingTeamAnalytics } = performanceStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (trainingSessionId) getTrainingTeamAnalytics(trainingSessionId);
  }, [trainingSessionId]);

  if (!trainingTeamAnalytics) {
    return (
      <div
        className={`rounded-xl ${isMobile ? "p-3" : "p-6"} ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-200"}`}
      >
        <div className={`grid grid-cols-2 md:grid-cols-4 ${isMobile ? "gap-3" : "gap-6"}`}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className={`${isMobile ? "space-y-1" : "space-y-3"}`}>
              <Skeleton className={`${isMobile ? "h-3 w-16" : "h-4 w-20"} rounded`} />
              <Skeleton className={`${isMobile ? "h-6 w-20" : "h-8 w-24"} rounded`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = trainingTeamAnalytics;

  const primaryStats = [
    {
      label: "Hit Rate",
      value: stats.overall_hit_percentage ? `${stats.overall_hit_percentage}%` : "—",
      icon: TrendingUp,
      highlight: true,
    },
    {
      label: "Total Shots",
      value: stats.total_shots_fired ? stats.total_shots_fired : "—",
      icon: Target,
    },
    {
      label: "Avg Dispersion",
      value: stats.avg_cm_dispersion ? `${stats.avg_cm_dispersion.toFixed(1)}cm` : "—",
      icon: Crosshair,
    },
    {
      label: "Time to First Shot",
      value: stats.avg_time_to_first_shot ? `${stats.avg_time_to_first_shot.toFixed(1)}s` : "—",
      icon: Clock,
    },
  ];

  const rangeStats = [
    {
      label: "Short Range",
      shots: stats.short_shots || 0,
      hitRate: stats.short_hit_percentage || 0,
      color: "green",
    },
    {
      label: "Medium Range",
      shots: stats.medium_shots || 0,
      hitRate: stats.medium_hit_percentage || 0,
      color: "yellow",
    },
    {
      label: "Long Range",
      shots: stats.long_shots || 0,
      hitRate: stats.long_hit_percentage || 0,
      color: "red",
    },
  ];

  const detailedStats = [
    {
      label: "Targets Eliminated",
      value: stats.total_targets_eliminated || 0,
    },
    {
      label: "Times Grouped",
      value: stats.times_grouped || 0,
    },
    {
      label: "Best Dispersion",
      value: stats.best_cm_dispersion ? `${stats.best_cm_dispersion.toFixed(1)}cm` : "—",
      subLabel: stats.best_user_first_name && stats.best_user_last_name 
        ? `${stats.best_user_first_name} ${stats.best_user_last_name}` 
        : undefined,
    },
    {
      label: "Total Participants",
      value: stats.total_participants || 0,
    },
  ];

  return (
    <div
      className={`rounded-xl ${isMobile ? "p-3" : "px-6 py-3"} ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-200"}`}
    >
      {/* Primary Stats Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-4 ${isMobile ? "gap-3" : "gap-6"}`}>
        {primaryStats.map((stat, index) => (
          <div key={index} className="relative">
            <div className={`flex items-center ${isMobile ? "gap-1 mb-0.5" : "gap-2 mb-1"}`}>
              <stat.icon
                className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${
                  stat.highlight ? (theme === "dark" ? "text-green-400" : "text-green-600") : theme === "dark" ? "text-zinc-500" : "text-gray-400"
                }`}
              />
              <p className={`${isMobile ? "text-xs" : "text-sm"} ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>{stat.label}</p>
            </div>
            <p
              className={`${isMobile ? "text-lg" : "text-xl"} font-semibold ${
                stat.highlight ? (theme === "dark" ? "text-green-400" : "text-green-600") : theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {stat.value ?? "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Range Stats - Always visible */}
      <div className={`mt-4 pt-4 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
        <div className={`grid grid-cols-3 ${isMobile ? "gap-2" : "gap-4"}`}>
          {rangeStats.map((range, index) => (
            <div key={index} className="text-center">
              <p className={`${isMobile ? "text-xs" : "text-sm"} ${theme === "dark" ? "text-zinc-500" : "text-gray-500"} mb-1`}>
                {range.label}
              </p>
              <div className={`${isMobile ? "text-sm" : "text-base"} font-medium`}>
                <span className={
                  range.color === "green" ? (theme === "dark" ? "text-green-400" : "text-green-600") :
                  range.color === "yellow" ? (theme === "dark" ? "text-yellow-400" : "text-yellow-600") :
                  (theme === "dark" ? "text-red-400" : "text-red-600")
                }>
                  {range.hitRate}%
                </span>
                <span className={`${theme === "dark" ? "text-zinc-400" : "text-gray-600"} ${isMobile ? "text-xs" : "text-sm"} ml-1`}>
                  ({range.shots})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Section */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full mt-4 pt-3 border-t flex items-center justify-center gap-2 transition-colors ${
          theme === "dark" ? "border-zinc-800 hover:bg-zinc-800/30" : "border-gray-200 hover:bg-gray-50"
        } ${isMobile ? "py-2" : "py-3"} -mx-3 px-3 -mb-3 rounded-b-xl`}
      >
        <span className={`${isMobile ? "text-xs" : "text-sm"} ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
          {isExpanded ? "Show Less" : "Show More Details"}
        </span>
        {isExpanded ? (
          <ChevronUp className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
        ) : (
          <ChevronDown className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
        )}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className={`mt-4 pt-4 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} animate-in slide-in-from-top-2 duration-200`}>
          <div className={`grid grid-cols-2 ${isMobile ? "gap-3" : "gap-4"}`}>
            {detailedStats.map((stat, index) => (
              <div key={index}>
                <p className={`${isMobile ? "text-xs" : "text-sm"} ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                  {stat.label}
                </p>
                <p className={`${isMobile ? "text-base" : "text-lg"} font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {stat.value}
                </p>
                {stat.subLabel && (
                  <p className={`${isMobile ? "text-xs" : "text-sm"} ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                    {stat.subLabel}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
