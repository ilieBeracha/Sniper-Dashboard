import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { useTheme } from "@/contexts/ThemeContext";
import { Users, Target, TrendingUp, Shield, Activity, Award, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    positive: boolean;
  };
  color: string;
  bgColor: string;
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color, bgColor }: StatCardProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`relative overflow-hidden rounded-xl p-4 ${
      theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-200"
    } group hover:shadow-lg transition-all duration-300`}>
      {/* Background gradient effect */}
      <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${bgColor}`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${bgColor} bg-opacity-10`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend.positive ? "text-green-500" : "text-red-500"
            }`}>
              {trend.positive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingUp className="w-3 h-3 rotate-180" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        
        <div>
          <p className={`text-xs font-medium mb-1 ${
            theme === "dark" ? "text-zinc-400" : "text-gray-500"
          }`}>{title}</p>
          <p className={`text-2xl font-bold mb-1 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>{value}</p>
          <p className={`text-xs ${
            theme === "dark" ? "text-zinc-500" : "text-gray-400"
          }`}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default function CommanderStatsOverview() {
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
      icon: Users,
      color: "text-blue-500",
      bgColor: "from-blue-500 to-blue-600",
      trend: { value: 8, positive: true }
    },
    {
      title: "Team Accuracy",
      value: `${stats.avgAccuracy.toFixed(1)}%`,
      subtitle: `From ${stats.totalSessions} sessions`,
      icon: Target,
      color: "text-green-500",
      bgColor: "from-green-500 to-green-600",
      trend: { value: stats.improvementRate, positive: true }
    },
    {
      title: "Avg Dispersion",
      value: `${stats.avgDispersion.toFixed(2)}cm`,
      subtitle: "Team median",
      icon: Activity,
      color: stats.avgDispersion <= 3 ? "text-green-500" : stats.avgDispersion <= 5 ? "text-orange-500" : "text-red-500",
      bgColor: stats.avgDispersion <= 3 ? "from-green-500 to-green-600" : stats.avgDispersion <= 5 ? "from-orange-500 to-orange-600" : "from-red-500 to-red-600"
    },
    {
      title: "Top Performers",
      value: stats.topPerformers,
      subtitle: "≤3cm dispersion",
      icon: Award,
      color: "text-purple-500",
      bgColor: "from-purple-500 to-purple-600"
    },
    {
      title: "Active Squads",
      value: stats.activeSquads,
      subtitle: "This week",
      icon: Shield,
      color: "text-indigo-500",
      bgColor: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Need Attention",
      value: stats.criticalPerformers,
      subtitle: ">5cm dispersion",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "from-red-500 to-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}