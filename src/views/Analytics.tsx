import { useEffect } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
// import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { 
  Target, 
  Activity, 
  Users, 
  BarChart3,
  Calendar,
  Award
} from "lucide-react";

// Import analytics components
import ChartMatrix from "@/components/ChartMatrix";
import WeeklyKPIs from "@/components/StatsUserKPI";
import SquadImpactStats from "@/components/SquadImpactStats";
import WeeklyActivityBars from "@/components/WeeklyActivityBars";
import ActivityLogHeatmap from "@/components/ActivityLogHeatmap";
import CommanderStatsOverview from "@/components/CommanderStatsOverview";

export default function Analytics() {
  const { user } = useStore(userStore);
  // TODO: Add these methods to performanceStore when implementing analytics data fetching
  // const { getFirstShotMatrix, getUserWeeklyKpisForUser } = useStore(performanceStore);
  const { theme } = useTheme();

  // Function to refresh all data
  const refreshData = () => {
    if (user?.team_id) {
      console.log("Refreshing analytics data...");
      // TODO: Uncomment when methods are implemented
      // getFirstShotMatrix(user.team_id, 7);
      // getUserWeeklyKpisForUser(user.id, 7);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user?.team_id]);

  // Refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user?.team_id) {
        refreshData();
      }
    };

    const handleFocus = () => {
      if (user?.team_id) {
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?.team_id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" ? "bg-[#0a0a0b]" : "bg-gray-50"
    }`}>
      {/* Modern Header */}
      <div className={`border-b transition-colors duration-300 ${
        theme === "dark" ? "border-zinc-800 bg-[#0a0a0b]/80" : "border-gray-200 bg-white/80"
      } backdrop-blur-sm sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                theme === "dark" ? "bg-purple-500/10" : "bg-purple-50"
              }`}>
                <BarChart3 className={`w-6 h-6 ${
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  Stats Dashboard
                </h1>
                <p className={`text-sm ${
                  theme === "dark" ? "text-zinc-400" : "text-gray-600"
                }`}>
                  Performance insights and team metrics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${
                theme === "dark" ? "text-zinc-500" : "text-gray-500"
              }`}>
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Quick Stats Grid */}
          <motion.div variants={itemVariants}>
            <WeeklyKPIs />
          </motion.div>

          {/* Main Analytics Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Weekly Activity Chart */}
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              theme === "dark" 
                ? "bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700" 
                : "bg-white border border-gray-200 hover:border-gray-300"
            } hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  <Activity className="w-5 h-5 mr-2" />
                  Weekly Activity
                </h3>
              </div>
              <WeeklyActivityBars />
            </div>

            {/* Squad Impact Stats */}
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              theme === "dark" 
                ? "bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700" 
                : "bg-white border border-gray-200 hover:border-gray-300"
            } hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  <Users className="w-5 h-5 mr-2" />
                  Squad Impact
                </h3>
              </div>
              <SquadImpactStats />
            </div>
          </motion.div>

          {/* First Shot Matrix - Full Width */}
          <motion.div variants={itemVariants}>
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              theme === "dark" 
                ? "bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700" 
                : "bg-white border border-gray-200 hover:border-gray-300"
            } hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  <Target className="w-5 h-5 mr-2" />
                  First Shot Performance Matrix
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${
                    theme === "dark" ? "text-zinc-500" : "text-gray-500"
                  }`}>
                    Distance vs Accuracy Analysis
                  </span>
                </div>
              </div>
              <ChartMatrix />
            </div>
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div variants={itemVariants}>
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              theme === "dark" 
                ? "bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700" 
                : "bg-white border border-gray-200 hover:border-gray-300"
            } hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  <Calendar className="w-5 h-5 mr-2" />
                  Activity Heatmap
                </h3>
              </div>
              <ActivityLogHeatmap />
            </div>
          </motion.div>

          {/* Commander Stats Overview */}
          <motion.div variants={itemVariants}>
            <div className={`rounded-xl p-6 transition-all duration-300 ${
              theme === "dark" 
                ? "bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700" 
                : "bg-white border border-gray-200 hover:border-gray-300"
            } hover:shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold flex items-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  <Award className="w-5 h-5 mr-2" />
                  Commander Performance Overview
                </h3>
              </div>
              <CommanderStatsOverview />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}