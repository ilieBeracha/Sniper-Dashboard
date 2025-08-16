import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { userStore } from "@/store/userStore";
import { useTheme } from "@/contexts/ThemeContext";
import BaseModal from "./base/BaseModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Target,
  Calendar,
  BarChart3,
  UserPlus,
  Crosshair,
  Trophy,
  Search,
  Filter,
  X,
  Clock,
  TrendingUp,
} from "lucide-react";

interface UnifiedFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const actionConfig = {
  score_submit: {
    icon: Target,
    label: "Score Submitted",
    color: "emerald",
  },
  training_created: {
    icon: Calendar,
    label: "Training Created",
    color: "blue",
  },
  session_stats_logged: {
    icon: BarChart3,
    label: "Session Logged",
    color: "purple",
  },
  participant_joined: {
    icon: UserPlus,
    label: "Member Joined",
    color: "cyan",
  },
  target_engaged: {
    icon: Crosshair,
    label: "Target Engaged",
    color: "orange",
  },
  achievement: {
    icon: Trophy,
    label: "Achievement",
    color: "yellow",
  },
};

export default function UnifiedFeedModal({ isOpen, onClose }: UnifiedFeedModalProps) {
  const { feed, fetchFeedLog } = useStore(feedStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Transform feed to ensure actor_id is properly typed
  const typedFeed = feed as any[];

  useEffect(() => {
    if (isOpen && user?.team_id) {
      fetchFeedLog(user.team_id);
    }
  }, [isOpen, user?.team_id]);

  const filteredFeed = useMemo(() => {
    let filtered = [...typedFeed];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) => {
        if (typeof item.actor_id === 'object' && item.actor_id !== null) {
          return (
            item.actor_id.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.actor_id.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.action_type.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return item.action_type.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Apply type filter
    if (selectedFilter) {
      filtered = filtered.filter((item) => item.action_type === selectedFilter);
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [typedFeed, searchTerm, selectedFilter]);

  // Get unique action types for filter
  const actionTypes = useMemo(() => {
    const types = new Set(typedFeed.map((item) => item.action_type));
    return Array.from(types);
  }, [typedFeed]);

  const getActionConfig = (actionType: string) => {
    return actionConfig[actionType as keyof typeof actionConfig] || {
      icon: Activity,
      label: "Activity",
      color: "gray",
    };
  };

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: theme === "dark" ? "bg-emerald-500/10" : "bg-emerald-50",
        text: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
        border: theme === "dark" ? "border-emerald-500/20" : "border-emerald-200",
      },
      blue: {
        bg: theme === "dark" ? "bg-blue-500/10" : "bg-blue-50",
        text: theme === "dark" ? "text-blue-400" : "text-blue-600",
        border: theme === "dark" ? "border-blue-500/20" : "border-blue-200",
      },
      purple: {
        bg: theme === "dark" ? "bg-purple-500/10" : "bg-purple-50",
        text: theme === "dark" ? "text-purple-400" : "text-purple-600",
        border: theme === "dark" ? "border-purple-500/20" : "border-purple-200",
      },
      cyan: {
        bg: theme === "dark" ? "bg-cyan-500/10" : "bg-cyan-50",
        text: theme === "dark" ? "text-cyan-400" : "text-cyan-600",
        border: theme === "dark" ? "border-cyan-500/20" : "border-cyan-200",
      },
      orange: {
        bg: theme === "dark" ? "bg-orange-500/10" : "bg-orange-50",
        text: theme === "dark" ? "text-orange-400" : "text-orange-600",
        border: theme === "dark" ? "border-orange-500/20" : "border-orange-200",
      },
      yellow: {
        bg: theme === "dark" ? "bg-yellow-500/10" : "bg-yellow-50",
        text: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
        border: theme === "dark" ? "border-yellow-500/20" : "border-yellow-200",
      },
      gray: {
        bg: theme === "dark" ? "bg-gray-500/10" : "bg-gray-50",
        text: theme === "dark" ? "text-gray-400" : "text-gray-600",
        border: theme === "dark" ? "border-gray-500/20" : "border-gray-200",
      },
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      contentClassName="max-w-2xl"
    >
      <div className="flex flex-col h-[80vh]">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Activity Feed
              </h2>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                Recent team activities
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-gray-100"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-2">
            <div className={`flex-1 relative`}>
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                theme === "dark" ? "text-zinc-400" : "text-gray-400"
              }`} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-colors ${
                  theme === "dark"
                    ? "bg-zinc-800 text-white placeholder-zinc-500 focus:bg-zinc-700"
                    : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white"
                } border ${
                  theme === "dark" ? "border-zinc-700" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedFilter
                    ? theme === "dark"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-purple-100 text-purple-600"
                    : theme === "dark"
                    ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Filter className="w-4 h-4" />
                {selectedFilter ? getActionConfig(selectedFilter).label : "All Types"}
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => setSelectedFilter(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !selectedFilter
                  ? theme === "dark"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-purple-100 text-purple-600"
                  : theme === "dark"
                  ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {actionTypes.map((type) => {
              const config = getActionConfig(type);
              return (
                <button
                  key={type}
                  onClick={() => setSelectedFilter(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedFilter === type
                      ? theme === "dark"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-purple-100 text-purple-600"
                      : theme === "dark"
                      ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feed Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredFeed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className={`p-4 rounded-full mb-4 ${
                theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
              }`}>
                <Activity className={`w-8 h-8 ${
                  theme === "dark" ? "text-zinc-600" : "text-gray-400"
                }`} />
              </div>
              <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                No activities found
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {filteredFeed.map((item, index) => {
                  const config = getActionConfig(item.action_type);
                  const colors = getColorClasses(config.color);
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                        theme === "dark"
                          ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border`}>
                          <Icon className={`w-4 h-4 ${colors.text}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className={`font-medium text-sm ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}>
                                {config.label}
                              </h4>
                              <p className={`text-xs mt-0.5 ${
                                theme === "dark" ? "text-zinc-400" : "text-gray-600"
                              }`}>
                                by {typeof item.actor_id === 'object' && item.actor_id !== null 
                                  ? `${item.actor_id.first_name} ${item.actor_id.last_name}`
                                  : 'Unknown User'}
                              </p>
                            </div>
                            <span className={`text-xs whitespace-nowrap ${
                              theme === "dark" ? "text-zinc-500" : "text-gray-500"
                            }`}>
                              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </span>
                          </div>

                          {/* Context badges */}
                          {item.context && Object.keys(item.context).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.context.score && (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                  theme === "dark"
                                    ? "bg-yellow-500/10 text-yellow-400"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  <TrendingUp className="w-3 h-3" />
                                  Score: {item.context.score}
                                </span>
                              )}
                              {item.context.hits && (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                  theme === "dark"
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-green-100 text-green-700"
                                }`}>
                                  <Target className="w-3 h-3" />
                                  Hits: {item.context.hits}
                                </span>
                              )}
                              {item.context.accuracy && (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                  theme === "dark"
                                    ? "bg-blue-500/10 text-blue-400"
                                    : "bg-blue-100 text-blue-700"
                                }`}>
                                  <Crosshair className="w-3 h-3" />
                                  {item.context.accuracy}% Accuracy
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer Stats */}
        <div className={`px-6 py-3 border-t ${
          theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>
                {filteredFeed.length} activities
              </span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>
                  Updated just now
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}