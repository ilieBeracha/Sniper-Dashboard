import { useEffect, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { userStore } from "@/store/userStore";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Activity, 
  Target, 
  Calendar, 
  BarChart3, 
  UserPlus, 
  Crosshair, 
  TrendingUp, 
  Trophy, 
  Users, 
  Star 
} from "lucide-react";

interface FeedItem {
  id: string;
  created_at: string;
  actor_id: string;
  action_type: string;
  context: Record<string, any>;
  team_id: string;
  squad_id: string;
  description?: string | null;
}

// Generate avatar initials and color
const getAvatar = (userId: string) => {
  const colors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-pink-500", "bg-indigo-500", "bg-red-500", "bg-teal-500"];
  const colorIndex = userId.charCodeAt(0) % colors.length;
  const initials = userId.slice(0, 2).toUpperCase();
  return { color: colors[colorIndex], initials };
};

export default function UnifiedFeed() {
  const { feed, fetchFeedLog } = useStore(feedStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();

  useEffect(() => {
    fetchFeedLog();
    const interval = setInterval(fetchFeedLog, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  // Filter feed to show only items related to current user
  const userFeed = useMemo(() => {
    if (!user?.id) return [];
    return feed.filter((item) => item.actor_id === user.id);
  }, [feed, user]);

  const getActionIcon = (actionType: string) => {
    const icons: Record<string, any> = {
      score_submit: Target,
      training_created: Calendar,
      session_stats_logged: BarChart3,
      participant_joined: UserPlus,
      target_engaged: Crosshair,
      target_stats_created: TrendingUp,
      achievement: Trophy,
      team: Users,
      milestone: Star,
    };
    return icons[actionType] || Activity;
  };

  const renderActionMessage = (item: FeedItem) => {
    const messages: Record<string, string> = {
      score_submit: "Score submission recorded",
      training_created: "Training session scheduled",
      session_stats_logged: "Session statistics logged",
      participant_joined: "Participant joined session",
      target_engaged: "Target engagement recorded",
      target_stats_created: "Target statistics updated",
      achievement: "Achievement unlocked",
      team: "Team activity updated",
      milestone: "Milestone reached",
    };

    return messages[item.action_type] || "Activity recorded";
  };

  return (
    <div className="h-full flex flex-col backdrop-blur-sm bg-dark">
      {/* Elegant Header */}
      <div className="px-6 py-4 border-b border-white/10 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Activity Feed</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Recent activity log</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {userFeed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-4 rounded-full bg-gray-100/10 dark:bg-white/5 mb-4">
              <Activity className="w-12 h-12 text-gray-400/50" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 text-center font-light">
              No recent activity
              <br />
              <span className="text-xs opacity-60">Activities will appear here</span>
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Elegant Timeline line with gradient */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>

            {/* Timeline items */}
            <div className="space-y-4">
              {userFeed.map((item, index) => {
                const avatar = getAvatar(item.actor_id);
                const isFirst = index === 0;
                const isNew = index < 3;
                const ActionIcon = getActionIcon(item.action_type);

                // Different timeline dot styles
                const dotStyle = isFirst ? "bg-gray-800 dark:bg-gray-200" : "bg-gray-300 dark:bg-gray-600";

                return (
                  <div key={item.id} className="relative flex gap-4 group">
                    {/* Timeline dot with animation */}
                    <div className="relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full ${dotStyle} flex items-center justify-center transition-transform group-hover:scale-105 ${isFirst ? "shadow-sm" : ""}`}
                      >
                        <ActionIcon className={`w-4 h-4 ${isFirst ? "text-white dark:text-gray-900" : "text-gray-600 dark:text-gray-400"}`} />
                      </div>
                      {isNew && <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>

                    {/* Content with transparent background */}
                    <div className="flex-1 pb-2">
                      {/* Time with elegant styling */}
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </p>

                      {/* Transparent message card */}
                      <div
                        className={`
                        p-3 rounded-lg transition-all duration-200
                        ${
                          theme === "dark"
                            ? "bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50"
                            : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                        }
                        ${isNew ? "shadow-sm" : ""}
                      `}
                      >
                        <div className="flex items-start gap-3">
                          {/* Elegant avatar */}
                          <div className={`w-8 h-8 rounded-full ${avatar.color} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-xs font-semibold text-white">{avatar.initials}</span>
                          </div>

                          {/* Message content */}
                          <div className="flex-1">
                            <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                              {renderActionMessage(item)}
                            </p>

                            {/* Stats with glass effect */}
                            {item.context && Object.keys(item.context).length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {item.context.score && (
                                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                                    Score: {item.context.score}
                                  </span>
                                )}
                                {item.context.hits && (
                                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                                    Hits: {item.context.hits}
                                  </span>
                                )}
                                {item.context.accuracy && (
                                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                                    {item.context.accuracy}% accuracy
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
