import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useStore } from "zustand";
import { feedStore } from "@/store/feedStore";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity, Target, Users, Trophy, Calendar, BarChart3 } from "lucide-react";
import BaseDashboardCard from "./base/BaseDashboardCard";

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

const iconMap: Record<string, any> = {
  score_submit: Target,
  training_created: Calendar,
  session_stats_logged: BarChart3,
  participant_joined: Users,
  target_engaged: Target,
  target_stats_created: BarChart3,
  achievement: Trophy,
  team: Users,
  milestone: Trophy,
};

export default function UnifiedFeed() {
  const { feed, fetchFeedLog } = useStore(feedStore);
  const { theme } = useTheme();

  useEffect(() => {
    fetchFeedLog();
  }, []);

  const getActionIcon = (actionType: string) => {
    const Icon = iconMap[actionType] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  const getActionColor = (actionType: string) => {
    const colors: Record<string, string> = {
      score_submit: theme === "dark" ? "text-emerald-400" : "text-emerald-600",
      training_created: theme === "dark" ? "text-sky-400" : "text-sky-600",
      session_stats_logged: theme === "dark" ? "text-violet-400" : "text-violet-600",
      participant_joined: theme === "dark" ? "text-indigo-400" : "text-indigo-600",
      target_engaged: theme === "dark" ? "text-amber-400" : "text-amber-600",
      target_stats_created: theme === "dark" ? "text-rose-400" : "text-rose-600",
    };
    return colors[actionType] || (theme === "dark" ? "text-indigo-400" : "text-indigo-600");
  };

  const renderActionText = (item: FeedItem) => {
    const shortId = item.actor_id.slice(0, 6);

    switch (item.action_type) {
      case "score_submit":
        return `Score submitted by ${shortId}`;
      case "training_created":
        return `Training created by ${shortId}`;
      case "session_stats_logged":
        return `Session stats logged by ${shortId}`;
      case "participant_joined":
        return `Participant joined session`;
      case "target_engaged":
        return `Target engaged by ${shortId}`;
      case "target_stats_created":
        return `Target stats logged`;
      default:
        return `${item.action_type.replace(/_/g, " ")} by ${shortId}`;
    }
  };

  return (
    <div className={`h-full rounded-xl border ${
      theme === "dark" 
        ? "bg-white/5 backdrop-blur-sm border-white/10" 
        : "bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-sm"
    }`}>
      <div className={`px-5 py-4 border-b ${
        theme === "dark" ? "border-white/10" : "border-gray-200/50"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-base font-semibold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Activity Feed
            </h3>
            <p className={`text-xs mt-0.5 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
              Real-time updates
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className={`text-xs ${
              theme === "dark" ? "text-gray-500" : "text-gray-400"
            }`}>
              Live
            </span>
          </div>
        </div>
      </div>
      
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {feed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <Activity className={`w-10 h-10 mb-3 ${
                theme === "dark" ? "text-gray-600" : "text-gray-300"
              }`} />
              <p className={`text-sm font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
                No activity yet
              </p>
              <p className={`text-xs mt-1 ${
                theme === "dark" ? "text-gray-500" : "text-gray-400"
              }`}>
                Updates will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {feed.map((item) => (
                <div
                  key={item.id}
                  className={`group relative p-3.5 rounded-xl transition-all duration-200 ${
                    theme === "dark" 
                      ? "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10" 
                      : "bg-white hover:bg-gray-50/50 border border-gray-100 hover:border-gray-200"
                  } hover:shadow-md cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      theme === "dark" ? "bg-white/10" : "bg-gray-100/70"
                    }`}>
                      <div className={`${getActionColor(item.action_type)}`}>{getActionIcon(item.action_type)}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-tight ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}>
                        {renderActionText(item)}
                      </p>
                      <p className={`text-xs mt-1 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}>
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </p>
                      {item.description && (
                        <p className={`text-xs mt-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.context && Object.keys(item.context).length > 0 && (
                    <div className="mt-3 ml-12">
                      <details className="group/details">
                        <summary className={`text-xs cursor-pointer ${
                          theme === "dark" 
                            ? "text-gray-500 hover:text-gray-400" 
                            : "text-gray-400 hover:text-gray-500"
                        } transition-colors`}>
                          View details
                        </summary>
                        <pre className={`text-xs mt-2 p-3 rounded-lg overflow-x-auto ${
                          theme === "dark" 
                            ? "bg-black/10 text-gray-500" 
                            : "bg-gray-50 text-gray-600"
                        }`}>
                          {JSON.stringify(item.context, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
