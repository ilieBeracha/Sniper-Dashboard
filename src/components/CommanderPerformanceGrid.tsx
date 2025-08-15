import { useTheme } from "@/contexts/ThemeContext";
import { CommanderUserRoleBreakdown, CommanderTeamDispersionEntry } from "@/types/performance";
import { Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useMemo } from "react";

interface SquadPerformanceData {
  squadName: string;
  members: number;
  avgAccuracy: number;
  avgDispersion: number;
  trend: "up" | "down" | "stable";
  performance: "excellent" | "good" | "needs-improvement";
}

interface CommanderPerformanceGridProps {
  userRoleData: CommanderUserRoleBreakdown[] | null;
  dispersionData: CommanderTeamDispersionEntry[] | null;
}

export default function CommanderPerformanceGrid({ userRoleData, dispersionData }: CommanderPerformanceGridProps) {
  const { theme } = useTheme();

  const squadData = useMemo(() => {
    const squadMap = new Map<string, SquadPerformanceData>();

    // Process user role data for accuracy
    if (userRoleData) {
      userRoleData.forEach(entry => {
        if (!squadMap.has(entry.squad_name)) {
          squadMap.set(entry.squad_name, {
            squadName: entry.squad_name,
            members: 0,
            avgAccuracy: 0,
            avgDispersion: 0,
            trend: "stable",
            performance: "good"
          });
        }
        
        const squad = squadMap.get(entry.squad_name)!;
        squad.members += 1;
      });

      // Calculate average accuracy per squad
      const squadStats = new Map<string, { totalShots: number; totalHits: number }>();
      userRoleData.forEach(entry => {
        if (!squadStats.has(entry.squad_name)) {
          squadStats.set(entry.squad_name, { totalShots: 0, totalHits: 0 });
        }
        const stats = squadStats.get(entry.squad_name)!;
        stats.totalShots += entry.shots;
        stats.totalHits += entry.hits;
      });

      squadStats.forEach((stats, squadName) => {
        const squad = squadMap.get(squadName)!;
        squad.avgAccuracy = stats.totalShots > 0 ? (stats.totalHits / stats.totalShots) * 100 : 0;
      });
    }

    // Process dispersion data
    if (dispersionData) {
      const squadDispersions = new Map<string, number[]>();
      
      dispersionData.forEach(entry => {
        if (!squadDispersions.has(entry.squad_name)) {
          squadDispersions.set(entry.squad_name, []);
        }
        if (entry.total_median !== null) {
          squadDispersions.get(entry.squad_name)!.push(entry.total_median);
        }
      });

      squadDispersions.forEach((dispersions, squadName) => {
        if (squadMap.has(squadName) && dispersions.length > 0) {
          const squad = squadMap.get(squadName)!;
          squad.avgDispersion = dispersions.reduce((a, b) => a + b, 0) / dispersions.length;
          
          // Determine performance level
          if (squad.avgDispersion <= 3 && squad.avgAccuracy >= 75) {
            squad.performance = "excellent";
            squad.trend = "up";
          } else if (squad.avgDispersion > 5 || squad.avgAccuracy < 50) {
            squad.performance = "needs-improvement";
            squad.trend = "down";
          } else {
            squad.performance = "good";
            squad.trend = "stable";
          }
        }
      });
    }

    return Array.from(squadMap.values());
  }, [userRoleData, dispersionData]);

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return theme === "dark" ? "from-green-900/50 to-green-800/50 border-green-700" : "from-green-50 to-green-100 border-green-300";
      case "good":
        return theme === "dark" ? "from-blue-900/50 to-blue-800/50 border-blue-700" : "from-blue-50 to-blue-100 border-blue-300";
      case "needs-improvement":
        return theme === "dark" ? "from-red-900/50 to-red-800/50 border-red-700" : "from-red-50 to-red-100 border-red-300";
      default:
        return theme === "dark" ? "from-zinc-900/50 to-zinc-800/50 border-zinc-700" : "from-gray-50 to-gray-100 border-gray-300";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  if (squadData.length === 0) {
    return (
      <div className={`rounded-xl p-8 text-center ${
        theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-200"
      }`}>
        <p className={theme === "dark" ? "text-zinc-400" : "text-gray-500"}>
          No squad performance data available
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Squad Performance Overview
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>Needs Attention</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {squadData.map((squad) => (
          <div
            key={squad.squadName}
            className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${getPerformanceColor(squad.performance)} 
              border transition-all duration-300 hover:shadow-lg cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className={`w-5 h-5 ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`} />
                <h4 className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {squad.squadName}
                </h4>
              </div>
              {getTrendIcon(squad.trend)}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                  Accuracy
                </span>
                <span className={`text-sm font-semibold ${
                  squad.avgAccuracy >= 75 ? "text-green-600" : 
                  squad.avgAccuracy >= 50 ? "text-orange-600" : "text-red-600"
                }`}>
                  {squad.avgAccuracy.toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                  Dispersion
                </span>
                <span className={`text-sm font-semibold ${
                  squad.avgDispersion <= 3 ? "text-green-600" : 
                  squad.avgDispersion <= 5 ? "text-orange-600" : "text-red-600"
                }`}>
                  {squad.avgDispersion.toFixed(2)}cm
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                  Members
                </span>
                <span className={`text-sm font-semibold ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                  {squad.members}
                </span>
              </div>
            </div>

            {/* Hover effect */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 
              group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
          </div>
        ))}
      </div>
    </div>
  );
}