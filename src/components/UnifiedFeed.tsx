import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity } from "lucide-react";

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
  const { theme } = useTheme();

  useEffect(() => {
    fetchFeedLog();
    const interval = setInterval(fetchFeedLog, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  const getActionEmoji = (actionType: string) => {
    const emojis: Record<string, string> = {
      score_submit: "🎯",
      training_created: "📅",
      session_stats_logged: "📊",
      participant_joined: "👋",
      target_engaged: "🔫",
      target_stats_created: "📈",
      achievement: "🏆",
      team: "👥",
      milestone: "⭐",
    };
    return emojis[actionType] || "📌";
  };

  const renderActionMessage = (item: FeedItem) => {
    const names = ["Alex Chen", "Sarah Johnson", "Mike Torres", "Emma Wilson", "David Kim", "Lisa Anderson"];
    const userName = names[item.actor_id.charCodeAt(0) % names.length];

    const messages: Record<string, string[]> = {
      score_submit: [
        `${userName} achieved a perfect score!`,
        `New personal best by ${userName}`,
        `${userName} hit all targets successfully`,
        `Outstanding performance from ${userName}`,
      ],
      training_created: [
        `${userName} scheduled advanced training`,
        `New tactical session by ${userName}`,
        `${userName} initiated team practice`,
        `Training session created by ${userName}`,
      ],
      session_stats_logged: [
        `${userName} completed performance review`,
        `Statistics updated by ${userName}`,
        `${userName} logged training metrics`,
        `Performance data recorded by ${userName}`,
      ],
      participant_joined: [
        `${userName} joined the mission`,
        `Welcome ${userName} to the session`,
        `${userName} is now active`,
        `${userName} checked in`,
      ],
      target_engaged: [
        `${userName} neutralized the target`,
        `Successful engagement by ${userName}`,
        `${userName} completed the objective`,
        `Target eliminated by ${userName}`,
      ],
      target_stats_created: [
        `Targeting analysis complete`,
        `New tactical data available`,
        `Mission statistics updated`,
        `Performance metrics logged`,
      ],
    };

    const messageArray = messages[item.action_type] || [`${userName} completed an action`];
    const messageIndex = item.created_at.charCodeAt(5) % messageArray.length;
    return messageArray[messageIndex];
  };

  return (
    <div className="h-full flex flex-col backdrop-blur-sm">
      {/* Elegant Header */}
      <div className="px-6 py-4 border-b border-white/10 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Activity Timeline</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Real-time mission updates</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
            <span className="text-xs text-gray-500 font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-4 rounded-full bg-gray-100/10 dark:bg-white/5 mb-4">
              <Activity className="w-12 h-12 text-gray-400/50" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500 text-center font-light">
              Timeline empty
              <br />
              <span className="text-xs opacity-60">Waiting for activity...</span>
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Elegant Timeline line with gradient */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>

            {/* Timeline items */}
            <div className="space-y-4">
              {feed.map((item, index) => {
                const avatar = getAvatar(item.actor_id);
                const isFirst = index === 0;
                const isNew = index < 3;
                const emoji = getActionEmoji(item.action_type);

                // Different timeline dot styles
                const dotStyles = [
                  "bg-gradient-to-br from-blue-400 to-blue-600",
                  "bg-gradient-to-br from-purple-400 to-purple-600",
                  "bg-gradient-to-br from-pink-400 to-pink-600",
                  "bg-gradient-to-br from-emerald-400 to-emerald-600",
                  "bg-gradient-to-br from-amber-400 to-amber-600",
                ];
                const dotStyle = dotStyles[index % dotStyles.length];

                return (
                  <div key={item.id} className="relative flex gap-4 group">
                    {/* Timeline dot with animation */}
                    <div className="relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full ${
                          isFirst ? `${dotStyle} shadow-lg animate-pulse` : "bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20"
                        } flex items-center justify-center transition-transform group-hover:scale-110`}
                      >
                        <span className={`text-sm ${isFirst ? "text-white" : ""}`}>{emoji}</span>
                      </div>
                      {isNew && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>}
                    </div>

                    {/* Content with transparent background */}
                    <div className="flex-1 pb-2">
                      {/* Time with elegant styling */}
                      <p className="text-[10px] uppercase tracking-wider text-gray-500/70 dark:text-gray-500/50 mb-2 font-medium">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true }).toUpperCase()}
                      </p>

                      {/* Transparent message card */}
                      <div
                        className={`
                        p-4 rounded-xl backdrop-blur-md transition-all duration-300
                        ${
                          theme === "dark"
                            ? "bg-white/5 hover:bg-white/10 border border-white/10"
                            : "bg-black/5 hover:bg-black/10 border border-black/10"
                        }
                        ${isNew ? "shadow-lg shadow-blue-500/10" : ""}
                        group-hover:translate-x-1
                      `}
                      >
                        <div className="flex items-start gap-3">
                          {/* Elegant avatar */}
                          <div className={`w-8 h-8 rounded-full ${avatar.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                            <span className="text-xs font-bold text-white">{avatar.initials}</span>
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
                                  <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
                                    Score: {item.context.score}
                                  </span>
                                )}
                                {item.context.hits && (
                                  <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                                    Hits: {item.context.hits}
                                  </span>
                                )}
                                {item.context.accuracy && (
                                  <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-medium">
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
