import { useTheme } from "@/contexts/ThemeContext";
import { performanceStore } from "@/store/performance";
import { Skeleton } from "@heroui/react";
import { useEffect } from "react";
import { Target, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function TrainingSessionStatsCard({ trainingSessionId }: { trainingSessionId: string }) {
  const { theme } = useTheme();
  // Consume only the analytics data and fetch method from the store.  
  // We intentionally avoid the global `isLoading` flag because it is reused by
  // many unrelated async actions in `performanceStore`, which caused the card
  // to flicker whenever *any* of those actions toggled the flag.  
  const { trainingTeamAnalytics, getTrainingTeamAnalytics } = performanceStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (trainingSessionId) getTrainingTeamAnalytics(trainingSessionId);
  }, [trainingSessionId]);

  // Show the skeleton only while the analytics data hasn't been loaded yet.
  // Relying on the store's global `isLoading` caused unnecessary re-renders
  // because that flag is shared across multiple unrelated requests.
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
  ];

  return (
    <div
      className={`rounded-xl ${isMobile ? "p-3" : "p-6"} ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-200"}`}
    >
      <div className={`grid grid-cols-2  md:grid-cols-4 ${isMobile ? "gap-3" : "gap-6"}`}>
        {primaryStats.map((stat, index) => (
          <div key={index} className="relative">
            <div className={`flex items-center ${isMobile ? "gap-1 mb-0.5" : "gap-2 mb-1"}`}>
              <stat.icon
                className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${
                  stat.highlight ? (theme === "dark" ? "text-green-400" : "text-green-600") : theme === "dark" ? "text-zinc-500" : "text-gray-400"
                }`}
              />
              <p className={`${isMobile ? "text-xs" : "text-lg"} ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>{stat.label}</p>
            </div>
            <p
              className={`${isMobile ? "text-lg" : "text-2xl"} font-semibold ${
                stat.highlight ? (theme === "dark" ? "text-green-400" : "text-green-600") : theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {stat.value ?? "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
