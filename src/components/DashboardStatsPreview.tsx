import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { BarChart2, TrendingUp, Target, Activity, ArrowUpRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function DashboardStatsPreview() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { userHitsStats, userWeeklyKpisForUser } = useStore(performanceStore);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);

  // Rotate through metrics every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveMetric((prev) => (prev + 1) % 4);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Calculate dynamic metrics
  const hitPercentage = userHitsStats?.hit_percentage || 0;
  const totalShots = userHitsStats?.shots_fired || 0;
  const sessionsCount = userHitsStats?.session_count || 0;
  
  // Get weekly data
  const weeklyData = userWeeklyKpisForUser?.[0] || {};
  const avgAccuracy = weeklyData.avg_hit_ratio_last_week ? Math.round(weeklyData.avg_hit_ratio_last_week * 100) : 0;
  const targetsEngaged = weeklyData.targets_last_week || 0;
  const trainingSessions = weeklyData.trainings_last_week || 0;

  const metrics = [
    {
      label: "Accuracy",
      value: `${Math.round(hitPercentage)}%`,
      trend: avgAccuracy > hitPercentage ? "down" : "up",
      color: "purple",
      icon: Target,
      description: "Current hit rate"
    },
    {
      label: "Total Shots",
      value: totalShots.toLocaleString(),
      trend: "up",
      color: "blue",
      icon: Activity,
      description: "Shots fired"
    },
    {
      label: "Sessions",
      value: sessionsCount,
      trend: "up",
      color: "green",
      icon: BarChart2,
      description: "Training completed"
    },
    {
      label: "Targets",
      value: targetsEngaged,
      trend: "up",
      color: "orange",
      icon: Zap,
      description: "This week"
    }
  ];

  const currentMetric = metrics[activeMetric];

  // Mini chart data
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [65, 72, 68, 75, 82, 79, 85], // Mock data for now
        fill: true,
        backgroundColor: theme === "dark" ? "rgba(147, 51, 234, 0.1)" : "rgba(147, 51, 234, 0.1)",
        borderColor: "rgba(147, 51, 234, 0.8)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <motion.div
      className={`relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-purple-900/20 border-zinc-800 hover:border-purple-500/50"
          : "bg-gradient-to-br from-white via-gray-50 to-purple-50 border-gray-200 hover:border-purple-300"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate("/stats")}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, purple 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, purple 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, purple 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={`p-2.5 rounded-xl ${
                theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"
              }`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <BarChart2 className="w-5 h-5 text-purple-500" />
            </motion.div>
            <div>
              <h3 className={`text-base font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                Performance Stats
              </h3>
              <p className={`text-xs ${
                theme === "dark" ? "text-zinc-400" : "text-gray-600"
              }`}>
                Real-time analytics
              </p>
            </div>
          </div>
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            className={`${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`}
          >
            <ArrowUpRight className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Animated Metrics Display */}
        <div className="relative h-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMetric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <div className="flex items-center justify-between h-full">
                <div className="flex-1">
                  <div className={`text-xs font-medium mb-1 ${
                    theme === "dark" ? "text-zinc-400" : "text-gray-600"
                  }`}>
                    {currentMetric.label}
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    {currentMetric.value}
                  </div>
                  <div className={`text-xs ${
                    theme === "dark" ? "text-zinc-500" : "text-gray-500"
                  }`}>
                    {currentMetric.description}
                  </div>
                </div>
                <motion.div
                  className={`p-3 rounded-full ${
                    currentMetric.color === "purple" 
                      ? theme === "dark" ? "bg-purple-500/10" : "bg-purple-100"
                      : currentMetric.color === "blue"
                      ? theme === "dark" ? "bg-blue-500/10" : "bg-blue-100"
                      : currentMetric.color === "green"
                      ? theme === "dark" ? "bg-green-500/10" : "bg-green-100"
                      : theme === "dark" ? "bg-orange-500/10" : "bg-orange-100"
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <currentMetric.icon className={`w-6 h-6 ${
                    currentMetric.color === "purple" ? "text-purple-500"
                      : currentMetric.color === "blue" ? "text-blue-500"
                      : currentMetric.color === "green" ? "text-green-500"
                      : "text-orange-500"
                  }`} />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mini Sparkline Chart */}
        <motion.div
          className="h-12 mt-3 mb-3"
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          <Line data={chartData} options={chartOptions} />
        </motion.div>

        {/* Progress Indicators */}
        <div className="flex gap-1">
          {metrics.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1 flex-1 rounded-full overflow-hidden ${
                theme === "dark" ? "bg-zinc-800" : "bg-gray-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveMetric(index);
              }}
            >
              <motion.div
                className="h-full bg-purple-500"
                initial={{ width: index === activeMetric ? "100%" : "0%" }}
                animate={{ width: index === activeMetric ? "100%" : "0%" }}
                transition={{ duration: index === activeMetric ? 3 : 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom Action Bar */}
        <motion.div
          className={`mt-3 pt-3 border-t flex items-center justify-between ${
            theme === "dark" ? "border-zinc-800" : "border-gray-200"
          }`}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className={`text-xs ${
              theme === "dark" ? "text-zinc-400" : "text-gray-600"
            }`}>
              Live tracking
            </span>
          </div>
          <motion.div
            className="flex items-center gap-1"
            animate={{ x: isHovered ? 0 : -10, opacity: isHovered ? 1 : 0 }}
          >
            <span className={`text-xs font-medium ${
              theme === "dark" ? "text-purple-400" : "text-purple-600"
            }`}>
              View all stats
            </span>
            <TrendingUp className="w-3 h-3 text-purple-500" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}