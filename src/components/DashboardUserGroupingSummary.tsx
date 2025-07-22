import { useEffect } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { performanceStore } from "@/store/performance";
import { useStore } from "zustand";
import { useTheme } from "@/contexts/ThemeContext";
import { TrendingUp, TrendingDown, Target, Timer } from "lucide-react";

const UserGroupingSummary = () => {
  const { groupingSummary, getGroupingSummary, groupingSummaryLoading } = useStore(performanceStore);
  const { theme } = useTheme();

  useEffect(() => {
    getGroupingSummary();
  }, []);


  if (groupingSummaryLoading) {
    return (
      <div className="h-64 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!groupingSummary) {
    return (
      <div className={`h-64 flex justify-center items-center transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        <div className="text-center">
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>No grouping data available</p>
        </div>
      </div>
    );
  }

  // Calculate performance score based on average dispersion
  const avgDispersion = groupingSummary.avg_dispersion || 0;
  const performanceScore = Math.max(0, Math.min(100, 100 - (avgDispersion / 50) * 100));
  
  // Determine trend
  const lastGroups = groupingSummary.last_five_groups || [];
  const trend = lastGroups.length >= 2 
    ? lastGroups[0].cm_dispersion < lastGroups[1].cm_dispersion ? 'improving' : 'declining'
    : 'stable';

  // Data for radial chart
  const radialData = [{
    name: 'Performance',
    value: performanceScore,
    fill: performanceScore >= 80 ? '#10b981' : performanceScore >= 60 ? '#3b82f6' : '#f59e0b'
  }];

  return (
    <div className="flex flex-col h-full w-full p-4">
      {/* Main Performance Display */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                fill={radialData[0].fill}
                animationDuration={1000}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {performanceScore.toFixed(0)}%
            </div>
            <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Score
            </div>
            <div className="flex items-center mt-1">
              {trend === 'improving' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : trend === 'declining' ? (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              ) : null}
              <span className={`text-xs ${
                trend === 'improving' ? 'text-green-500' : 
                trend === 'declining' ? 'text-red-500' : 
                'text-gray-500'
              }`}>
                {trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Declining' : 'Stable'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between">
            <Target className={`w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
            <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Average</span>
          </div>
          <div className={`text-lg font-semibold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {groupingSummary.avg_dispersion ?? "-"} cm
          </div>
        </div>

        <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between">
            <TrendingUp className={`w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
            <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Best</span>
          </div>
          <div className={`text-lg font-semibold mt-1 text-green-500`}>
            {groupingSummary.best_dispersion ?? "-"} cm
          </div>
        </div>

        <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between">
            <Timer className={`w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
            <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Avg Time</span>
          </div>
          <div className={`text-lg font-semibold mt-1 text-amber-500`}>
            {groupingSummary.avg_time_to_group ?? "-"}s
          </div>
        </div>

        <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
          <div className="flex items-center justify-between">
            <div className={`w-4 h-4 rounded-full ${theme === "dark" ? "bg-blue-500" : "bg-blue-500"}`} />
            <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Total</span>
          </div>
          <div className={`text-lg font-semibold mt-1 text-blue-500`}>
            {groupingSummary.total_groupings ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGroupingSummary;
