import { useEffect, useMemo } from "react";
import { formatDistanceToNow, format, isSameDay, startOfDay } from "date-fns";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { userStore } from "@/store/userStore";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity, Target, Calendar, BarChart3, UserPlus, Crosshair, TrendingUp, Trophy, Users, Star } from "lucide-react";

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

interface GroupedFeedItem extends FeedItem {
  dateGroup: string;
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

  // Filter feed to show only items related to current user and group by date
  const groupedUserFeed = useMemo(() => {
    if (!user?.id) return [];

    const userFeedItems = feed
      .filter((item) => item.actor_id === user.id)
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
        acc[dateKey].push(item);
        return acc;
      },
      {} as Record<string, GroupedFeedItem[]>,
    );

    return Object.entries(grouped).map(([date, items]) => ({
      date,
      items,
    }));
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Activity Feed</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Recent activity log</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {groupedUserFeed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Activity className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No recent activity
              <br />
              <span className="text-xs opacity-60">Activities will appear here</span>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedUserFeed.map(({ date, items }) => (
              <div key={date}>
                {/* Date Heading */}
                <div className="ps-2 my-2 first:mt-0">
                  <h3 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">{date}</h3>
                </div>

                {/* Timeline Items */}
                {items.map((item, index) => {
                  const avatar = getAvatar(item.actor_id);
                  const ActionIcon = getActionIcon(item.action_type);
                  const isLast = index === items.length - 1;

                  return (
                    <div key={item.id} className="flex gap-x-3">
                      {/* Icon */}
                      <div
                        className={`relative ${!isLast ? "after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700" : ""}`}
                      >
                        <div className="relative z-10 size-7 flex justify-center items-center">
                          <div className="size-6 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                            <ActionIcon className="size-3 text-gray-600 dark:text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Right Content */}
                      <div className="grow pt-0.5 pb-8">
                        <h3 className="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                          <ActionIcon className="shrink-0 size-4 mt-1 text-gray-500 dark:text-gray-400" />
                          {renderActionMessage(item)}
                        </h3>

                        {/* Context Information */}
                        {item.context && Object.keys(item.context).length > 0 && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {item.context.score && `Score: ${item.context.score}`}
                            {item.context.hits && ` • Hits: ${item.context.hits}`}
                            {item.context.accuracy && ` • Accuracy: ${item.context.accuracy}%`}
                          </p>
                        )}

                        {/* User Info */}
                        <button
                          type="button"
                          className="mt-2 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                        >
                          <div className={`shrink-0 size-4 rounded-full ${avatar.color} flex items-center justify-center`}>
                            <span className="text-[10px] font-semibold text-white">{avatar.initials}</span>
                          </div>
                          <span className="truncate">You</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                        </button>
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
