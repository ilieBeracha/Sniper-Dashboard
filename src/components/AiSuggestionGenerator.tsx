import { useEffect, useState } from "react";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Database,
  Brain,
  User,
  ArrowUpRight,
  Target,
  Clock,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Award,
  Bell,
} from "lucide-react";
import BaseDashboardCard from "./base/BaseDashboardCard";

export default function AiSuggestionGenerator({
  suggestions,
  isLoading,
  generateSuggestions,
  setSuggestions,
  getSuggestions,
}: {
  suggestions: any;
  isLoading: boolean;
  generateSuggestions: () => Promise<any[]>;
  setSuggestions: (suggestions: any[]) => void;
  getSuggestions: (user_id: string) => Promise<any[]>;
}) {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const [isNewSuggestions, setIsNewSuggestions] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);

  const handleGenerateSuggestions = async () => {
    const tasks = await generateSuggestions();
    setSuggestions(tasks as any[]);
    if (tasks && tasks.length > previousCount) {
      setIsNewSuggestions(true);
      setTimeout(() => setIsNewSuggestions(false), 5000);
    }
    setPreviousCount(tasks?.length || 0);
  };

  useEffect(() => {
    if (user?.id) {
      (async () => {
        await getSuggestions(user?.id || "");
      })();
    }
  }, [user?.id]);

  const getThemeClasses = () => {
    if (theme === "dark") {
      return {
        background: "bg-gradient-to-br from-zinc-950/98 via-zinc-900/95 to-zinc-950/98",
        headerBg: "bg-gradient-to-r from-zinc-900/80 to-zinc-800/60",
        cardBg: "bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border-zinc-700/50",
        text: "text-zinc-100",
        textSecondary: "text-zinc-400",
        textMuted: "text-zinc-500",
        border: "border-zinc-800/50",
        infoBanner: "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-800/30",
      };
    } else {
      return {
        background: "bg-gradient-to-br from-gray-50/98 via-white/95 to-gray-50/98",
        headerBg: "bg-gradient-to-r from-white/80 to-gray-50/60",
        cardBg: "bg-gradient-to-r from-white/90 to-gray-50/90 border-gray-300/50",
        text: "text-gray-900",
        textSecondary: "text-gray-600",
        textMuted: "text-gray-500",
        border: "border-gray-200/50",
        infoBanner: "bg-gradient-to-r from-blue-100/20 to-purple-100/20 border-blue-200/30",
      };
    }
  };

  const themeClasses = getThemeClasses();

  const getPriorityIcon = (index: number) => {
    switch (index) {
      case 0:
        return <AlertCircle className="w-4 h-4" />;
      case 1:
        return <Clock className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case 1:
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    }
  };

  return (
    <div className={`w-full absolute top-0 left-0 ${themeClasses.background} backdrop-blur-sm overflow-x-hidden`}>
      {/* New Suggestions Notification */}
      {isNewSuggestions && (
        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg ${theme === "dark" ? "bg-green-900/90 border border-green-700/50" : "bg-green-100/90 border border-green-300/50"} shadow-lg`}
          >
            <Bell className="w-4 h-4 text-green-400" />
            <span className={`text-xs md:text-sm font-medium ${theme === "dark" ? "text-green-400" : "text-green-700"}`}>New recommendations!</span>
          </div>
        </div>
      )}

      {/* Information Banner */}
      <div className={`${themeClasses.infoBanner} border-b border-blue-800/30 p-3 md:p-4`}>
        <div className="flex items-start md:items-center gap-3">
          <Calendar className="w-4 md:w-5 h-4 md:h-5 text-blue-400 flex-shrink-0 mt-0.5 md:mt-0" />
          <div>
            <p className={`text-xs md:text-sm ${themeClasses.text} font-medium`}>Bi-Weekly Assessment Protocol</p>
            <p className={`text-xs ${themeClasses.textSecondary} leading-relaxed`}>
              System automatically generates tactical assessments every 2 weeks to track advancement and optimize training performance
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-4 md:p-6">
          <div className="rounded-lg p-4 md:p-6 bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 shadow-xl">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-8 md:w-10 h-8 md:h-10 border-2 md:border-3 border-zinc-600 rounded-full"></div>
                <div className="absolute top-0 left-0 w-8 md:w-10 h-8 md:h-10 border-2 md:border-3 border-transparent border-t-blue-400 rounded-full animate-spin"></div>
              </div>
              <div className="flex-1">
                <p className="text-zinc-100 font-semibold text-base md:text-lg">PROCESSING TACTICAL DATA</p>
                <p className="text-xs md:text-sm text-zinc-400 mb-2">Analyzing performance metrics and combat effectiveness...</p>
                <div className="w-full bg-zinc-700 rounded-full h-1.5 md:h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 md:h-2 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions Content */}
      {suggestions && !isLoading && suggestions.length > 0 && (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Operator Info */}
          <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 rounded-lg p-4 md:p-5 border border-zinc-700/50 shadow-lg">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded border border-green-500/30">
                  <User className="w-3 md:w-4 h-3 md:h-4 text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">OPERATOR</p>
                  <p className="text-zinc-100 font-medium text-sm truncate">{suggestions[0].role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded border border-blue-500/30">
                  <Clock className="w-3 md:w-4 h-3 md:h-4 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">LAST DRILL</p>
                  <p className="text-zinc-100 font-medium text-sm truncate">
                    {suggestions[0].last_training_date !== "Unknown" ? new Date(suggestions[0].last_training_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-br from-purple-600/20 to-violet-600/20 rounded border border-purple-500/30">
                  <Database className="w-3 md:w-4 h-3 md:h-4 text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">RECOMMENDATIONS</p>
                  <p className="text-zinc-100 font-medium text-sm">{suggestions.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded border border-orange-500/30">
                  <TrendingUp className="w-3 md:w-4 h-3 md:h-4 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">NEXT CYCLE</p>
                  <p className="text-zinc-100 font-medium text-sm">14 Days</p>
                </div>
              </div>
            </div>
          </div>
          {/* Tactical Recommendations */}
          <div className="space-y-3">
            <BaseDashboardCard header="">
              {suggestions?.map((suggestion: any, index: number) => (
                <div key={index} className="rounded overflow-hidden">
                  <div className="border-l-4 border-zinc-700">
                    {/* Header */}
                    <div className="p-3 md:p-4 border-b border-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className={`p-1 md:p-1.5 rounded border ${getPriorityColor(index)}`}>{getPriorityIcon(index)}</div>
                          <div className="min-w-0">
                            <h3 className="text-zinc-100 font-medium text-xs md:text-sm uppercase tracking-wider truncate">{suggestion.topic}</h3>
                            <p className="text-xs text-zinc-500">TACTICAL ASSESSMENT #{index + 1}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3 md:w-4 h-3 md:h-4 text-zinc-500 flex-shrink-0" />
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="p-3 md:p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {/* Problem Analysis */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">DEFICIENCY IDENTIFIED</p>
                          </div>
                          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">{suggestion.issue}</p>
                        </div>

                        {/* Tactical Solution */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">CORRECTIVE ACTION</p>
                          </div>
                          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">{suggestion.recommendation}</p>
                        </div>
                      </div>

                      {/* Objective */}
                      {suggestion.objective && (
                        <div className="mt-3 md:mt-4 pt-3 border-t border-zinc-800/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">MISSION OBJECTIVE</p>
                          </div>
                          <p className="text-xs md:text-sm text-zinc-400 font-mono">{suggestion.objective}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </BaseDashboardCard>
          </div>
          {/* System Status */}
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-lg p-4 md:p-5 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-1.5 md:p-2 bg-green-600/20 rounded border border-green-500/30">
                  <CheckCircle2 className="w-4 md:w-5 h-4 md:h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-zinc-100 font-semibold text-base md:text-lg">ANALYSIS COMPLETE</p>
                  <p className="text-xs text-zinc-400">Tactical assessment generated from performance data</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">Performance tracking active • Next analysis in 14 days</span>
                  </div>
                </div>
              </div>
              <div className="text-left md:text-right w-full md:w-auto">
                <div className="text-xs text-zinc-500 font-mono">{new Date().toLocaleString()}</div>
                <div className="text-xs text-zinc-400 mt-1">System Status: OPERATIONAL</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!suggestions && !isLoading && (
        <div className="p-4 md:p-6">
          <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-lg p-6 md:p-10 text-center shadow-xl">
            <div className="space-y-4 md:space-y-6">
              <div className="w-16 md:w-20 h-16 md:h-20 mx-auto bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center shadow-lg">
                <Brain className="w-8 md:w-10 h-8 md:h-10 text-blue-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-zinc-100">AWAITING TRAINING DATA</h3>
                <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed px-4 md:px-0">
                  Insufficient performance data for tactical analysis. The AI system requires completed training sessions to generate personalized
                  recommendations and track your advancement.
                </p>
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2 justify-center">
                    <Calendar className="w-3 md:w-4 h-3 md:h-4 text-blue-400" />
                    <span className="text-xs text-blue-400 font-medium">Automated Analysis Every 14 Days</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleGenerateSuggestions()}
                className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-blue-500/30 text-white rounded-lg transition-all font-semibold shadow-lg transform hover:scale-105 text-sm md:text-base"
              >
                INITIATE ANALYSIS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
