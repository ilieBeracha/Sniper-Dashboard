import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useTheme } from "@/contexts/ThemeContext";

import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

const StatCard = ({ title, value, subtitle, trend }: StatCardProps) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col gap-1 p-2">
      <p className={`text-xs uppercase tracking-wider ${
        theme === "dark" ? "text-zinc-500" : "text-gray-500"
      }`}>{title}</p>
      <div className="flex items-baseline gap-2">
        <p className={`text-xl font-semibold ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}>{value}</p>
        {trend && (
          <span className={`text-xs ${
            theme === "dark" 
              ? trend.positive ? "text-zinc-500" : "text-zinc-500"
              : trend.positive ? "text-gray-500" : "text-gray-500"
          }`}>
            ({trend.positive ? "+" : "-"}{Math.abs(trend.value)}%)
          </span>
        )}
      </div>
      <p className={`text-xs ${
        theme === "dark" ? "text-zinc-600" : "text-gray-400"
      }`}>{subtitle}</p>
    </div>
  );
};

export default function CommanderStatsOverview() {
  const { theme } = useTheme();
  const { commanderUserRoleBreakdown, commanderTeamDispersion } = useStore(performanceStore);
  const { members } = useStore(teamStore);
  const { squads } = useStore(squadStore);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeSquads: 0,
    avgAccuracy: 0,
    avgDispersion: 0,
    topPerformers: 0,
    criticalPerformers: 0,
    totalSessions: 0,
    improvementRate: 0
  });

  useEffect(() => {
    calculateStats();
  }, [commanderUserRoleBreakdown, commanderTeamDispersion, members, squads]);

  const calculateStats = () => {
    let totalMembers = members?.length || 0;
    let activeSquads = squads?.length || 0;
    
    // Calculate average accuracy from user role breakdown
    let totalShots = 0;
    let totalHits = 0;
    let totalSessions = 0;
    
    if (commanderUserRoleBreakdown) {
      commanderUserRoleBreakdown.forEach(entry => {
        totalShots += entry.shots;
        totalHits += entry.hits;
        totalSessions += entry.sessions;
      });
    }
    
    const avgAccuracy = totalShots > 0 ? (totalHits / totalShots) * 100 : 0;
    
    // Calculate average dispersion
    let validDispersions: number[] = [];
    if (commanderTeamDispersion) {
      commanderTeamDispersion.forEach(entry => {
        if (entry.total_median !== null) {
          validDispersions.push(entry.total_median);
        }
      });
    }
    
    const avgDispersion = validDispersions.length > 0 
      ? validDispersions.reduce((a, b) => a + b, 0) / validDispersions.length 
      : 0;
    
    // Calculate performance categories
    const topPerformers = validDispersions.filter(d => d <= 3).length;
    const criticalPerformers = validDispersions.filter(d => d > 5).length;
    
    // Mock improvement rate (would need historical data)
    // TODO: MOCK DATA - Replace with actual historical trend calculation
    const improvementRate = 12.5;
    
    setStats({
      totalMembers,
      activeSquads,
      avgAccuracy,
      avgDispersion,
      topPerformers,
      criticalPerformers,
      totalSessions,
      improvementRate
    });
  };

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      subtitle: `Across ${stats.activeSquads} squads`,
      trend: { value: 8, positive: true } // TODO: MOCK DATA - Replace with actual member growth trend
    },
    {
      title: "Team Accuracy",
      value: `${stats.avgAccuracy.toFixed(1)}%`,
      subtitle: `From ${stats.totalSessions} sessions`,
      trend: { value: stats.improvementRate, positive: true }
    },
    {
      title: "Avg Dispersion",
      value: `${stats.avgDispersion.toFixed(2)}cm`,
      subtitle: "Team median"
    },
    {
      title: "Top Performers",
      value: stats.topPerformers,
      subtitle: "≤3cm dispersion"
    },
    {
      title: "Active Squads",
      value: stats.activeSquads,
      subtitle: "This week"
    },
    {
      title: "Need Attention",
      value: stats.criticalPerformers,
      subtitle: ">5cm dispersion"
    }
  ];

  return (
    <div className={`mb-8 pb-6 border-b ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
      <div className="flex flex-wrap items-start gap-x-12 gap-y-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}