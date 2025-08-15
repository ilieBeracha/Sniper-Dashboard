import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";

export default function DashboardStatsLink() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { userHitsStats } = useStore(performanceStore);
  
  const hitPercentage = userHitsStats?.hit_percentage || 0;
  const sessionsCount = userHitsStats?.session_count || 0;

  return (
    <motion.div
      className={`flex items-center justify-between px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${
        theme === "dark"
          ? "bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-800/30 hover:border-zinc-700/50"
          : "bg-gray-50/50 border-gray-200/50 hover:bg-white hover:border-gray-300"
      }`}
      onClick={() => navigate("/stats")}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-md ${
          theme === "dark" ? "bg-purple-500/10" : "bg-purple-50"
        }`}>
          <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            <p className={`text-xs font-medium ${
              theme === "dark" ? "text-zinc-300" : "text-gray-700"
            }`}>
              Your Performance This Week
            </p>
            <div className={`flex items-center gap-3 mt-0.5 text-[10px] ${
              theme === "dark" ? "text-zinc-500" : "text-gray-500"
            }`}>
              <span className={hitPercentage > 60 ? "text-green-500" : hitPercentage > 40 ? "text-yellow-500" : "text-red-500"}>
                {Math.round(hitPercentage)}% accuracy
              </span>
              <span>•</span>
              <span>{sessionsCount} sessions</span>
              <span>•</span>
              <span className="font-medium">
                {hitPercentage > 60 ? "Great job! 🎯" : 
                 hitPercentage > 40 ? "Getting there" : 
                 "Keep practicing"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className={`flex items-center gap-1 text-xs ${
          theme === "dark" ? "text-zinc-500" : "text-gray-400"
        }`}
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="hidden sm:inline">View stats</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.div>
    </motion.div>
  );
}