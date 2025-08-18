import { useEffect, useMemo } from "react";
import { formatDistanceToNow, format } from "date-fns";
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
  Star,
  Clock,
  Award,
  Zap,
  Shield,
  CheckCircle2,
  Flame,
} from "lucide-react";

interface FeedItem {
  id: string;
  created_at: string;
  actor_id: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  action_type: string;
  context: Record<string, any>;
  team_id: string;
  squad_id: string;
  description?: string | null;
}

interface GroupedFeedItem extends FeedItem {
  dateGroup: string;
}

// Generate avatar initials and gradient color
const getAvatar = (firstName: string, lastName: string, userId: string) => {
  const gradients = [
    "from-purple-400 to-pink-600",
    "from-blue-400 to-cyan-600",
    "from-green-400 to-emerald-600",
    "from-yellow-400 to-orange-600",
    "from-pink-400 to-rose-600",
    "from-indigo-400 to-purple-600",
    "from-red-400 to-pink-600",
    "from-teal-400 to-cyan-600",
  ];

  // Use userId to consistently assign same gradient to same user
  const colorIndex = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "UN";
  return { gradient: gradients[colorIndex], initials };
};

export default function UnifiedFeed() {
  const { feed, fetchFeedLog } = useStore(feedStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();

  useEffect(() => {
    if (user?.team_id) {
      fetchFeedLog(user.team_id, true);
    }
  }, [user?.team_id]);

  const groupedUserFeed = useMemo(() => {
    const userFeedItems = feed
      .map((item) => ({
        ...item,
        dateGroup: format(new Date(item.created_at), "dd MMM, yyyy"),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Group by date
    const grouped = userFeedItems.reduce(
      (acc, item) => {
        const dateKey = item.dateGroup;
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push({ ...item, actor_id: item.actor_id as any });
        return acc;
      },
      {} as Record<string, GroupedFeedItem[]>,
    );

    return Object.entries(grouped).map(([date, items]) => ({
      date,
      items,
    }));
  }, [feed, user?.id]);

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
      completion: CheckCircle2,
      performance: Zap,
      defense: Shield,
    };
    return icons[actionType] || Activity;
  };

  const getActionColor = (actionType: string) => {
    const colors: Record<string, string> = {
      score_submit: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
      training_created: theme === "dark" ? "text-blue-400" : "text-blue-600",
      session_stats_logged: theme === "dark" ? "text-purple-400" : "text-purple-600",
      participant_joined: theme === "dark" ? "text-cyan-400" : "text-cyan-600",
      target_engaged: theme === "dark" ? "text-orange-400" : "text-orange-600",
      target_stats_created: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
      achievement: theme === "dark" ? "text-pink-400" : "text-pink-600",
      team: theme === "dark" ? "text-indigo-400" : "text-indigo-600",
      milestone: theme === "dark" ? "text-rose-400" : "text-rose-600",
    };
    return colors[actionType] || (theme === "dark" ? "text-gray-400" : "text-gray-600");
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
    <div
      className={`flex flex-col h-full rounded-xl border shadow-sm ${
        theme === "dark" ? "bg-zinc-900/90 border-zinc-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div className={`px-6 py-4 border-b ${theme === "dark" ? "border-zinc-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Activity Feed</h3>
            <p className={`text-xs mt-0.5 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Recent team activities and updates</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"}`}>
            <Clock className="w-3 h-3 opacity-50" />
            <span className="text-xs font-medium opacity-75">Live</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {groupedUserFeed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className={`p-6 rounded-2xl mb-4 ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}>
              <Activity className={`w-12 h-12 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
            </div>
            <p className={`text-sm font-medium ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>No recent activity</p>
            <span className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`}>Activities will appear here</span>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedUserFeed.map(({ date, items }) => (
              <div key={date}>
                {/* Date Heading */}
                <div
                  className={`sticky top-0 z-10 ps-2 py-2 mb-3 first:mt-0 backdrop-blur-sm ${theme === "dark" ? "bg-zinc-900/80" : "bg-white/80"}`}
                >
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>{date}</h3>
                </div>

                {/* Timeline Items */}
                {items.map((item, index) => {
                  const avatar = getAvatar(item.actor_id.first_name, item.actor_id.last_name, item.actor_id.id);
                  const ActionIcon = getActionIcon(item.action_type);
                  const actionColor = getActionColor(item.action_type);
                  const isLast = index === items.length - 1;

                  return (
                    <div key={item.id} className="flex gap-x-4 group">
                      {/* Timeline Line & Icon */}
                      <div
                        className={`relative flex flex-col items-center ${
                          !isLast
                            ? `after:absolute after:top-10 after:bottom-0 after:w-0.5 ${theme === "dark" ? "after:bg-zinc-700" : "after:bg-gray-200"}`
                            : ""
                        }`}
                      >
                        <div
                          className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-xl ${
                            theme === "dark"
                              ? "bg-gradient-to-br from-zinc-800 to-zinc-700 shadow-lg shadow-zinc-900/50"
                              : "bg-gradient-to-br from-white to-gray-50 shadow-md"
                          }`}
                        >
                          <ActionIcon className={`w-5 h-5 ${actionColor}`} />
                        </div>
                      </div>

                      {/* Right Content */}
                      <div className="grow pt-0.5 pb-8">
                        <div
                          className={`p-4 rounded-xl transition-all duration-200 group-hover:shadow-lg ${
                            theme === "dark"
                              ? "bg-zinc-800/50 border border-zinc-700/50 group-hover:bg-zinc-800/70"
                              : "bg-gray-50 border border-gray-200/50 group-hover:bg-white"
                          }`}
                        >
                          {/* Action Header */}
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`font-semibold text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                              {renderActionMessage(item)}
                            </h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                theme === "dark" ? "bg-zinc-700 text-zinc-400" : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </span>
                          </div>

                          {/* Context Information */}
                          {item.context && Object.keys(item.context).length > 0 && (
                            <div className={`flex flex-wrap gap-3 mb-3 p-3 rounded-lg ${theme === "dark" ? "bg-zinc-900/50" : "bg-white/50"}`}>
                              {item.context.score && (
                                <div className="flex items-center gap-1">
                                  <Award className="w-3 h-3 text-yellow-500" />
                                  <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                                    Score: {item.context.score}
                                  </span>
                                </div>
                              )}
                              {item.context.hits && (
                                <div className="flex items-center gap-1">
                                  <Target className="w-3 h-3 text-green-500" />
                                  <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                                    Hits: {item.context.hits}
                                  </span>
                                </div>
                              )}
                              {item.context.accuracy && (
                                <div className="flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-blue-500" />
                                  <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                                    Accuracy: {item.context.accuracy}%
                                  </span>
                                </div>
                              )}
                              {item.context.distance && (
                                <div className="flex items-center gap-1">
                                  <Crosshair className="w-3 h-3 text-purple-500" />
                                  <span className={`text-xs font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
                                    Distance: {item.context.distance}m
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* User Info */}
                          <div className="flex items-center gap-2">
                            <div
                              className={`shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${avatar.gradient} 
                              flex items-center justify-center shadow-sm`}
                            >
                              <span className="text-xs font-bold text-white">{avatar.initials}</span>
                            </div>
                            <div className="flex-1">
                              <span className={`text-sm font-medium ${theme === "dark" ? "text-zinc-200" : "text-gray-800"}`}>
                                {item.actor_id.first_name} {item.actor_id.last_name}
                              </span>
                              <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{item.actor_id.email}</p>
                            </div>
                            {/* Add streak indicator if multiple activities */}
                            {items.filter((i) => i.actor_id.id === item.actor_id.id).length > 2 && (
                              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                                <Flame className="w-3 h-3 text-white" />
                                <span className="text-xs font-bold text-white">{items.filter((i) => i.actor_id.id === item.actor_id.id).length}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
