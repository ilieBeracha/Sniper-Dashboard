import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { BarChart2, TrendingUp, Target, Users } from "lucide-react";

export default function DashboardQuickActions() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const quickActions = [
    {
      title: "View Analytics",
      description: "Track performance metrics",
      icon: BarChart2,
      color: "blue",
      onClick: () => navigate("/analytics"),
    },
    {
      title: "Team Performance",
      description: "Squad statistics",
      icon: TrendingUp,
      color: "green",
      onClick: () => navigate("/analytics"),
    },
    {
      title: "Training Sessions",
      description: "Schedule & results",
      icon: Target,
      color: "purple",
      onClick: () => navigate("/trainings"),
    },
    {
      title: "Team Members",
      description: "Manage roster",
      icon: Users,
      color: "orange",
      onClick: () => navigate("/assets"),
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: theme === "dark" ? "bg-blue-950/50" : "bg-blue-50",
        border: theme === "dark" ? "border-blue-800" : "border-blue-200",
        icon: theme === "dark" ? "text-blue-400" : "text-blue-600",
        hover: theme === "dark" ? "hover:bg-blue-900/50" : "hover:bg-blue-100",
      },
      green: {
        bg: theme === "dark" ? "bg-green-950/50" : "bg-green-50",
        border: theme === "dark" ? "border-green-800" : "border-green-200",
        icon: theme === "dark" ? "text-green-400" : "text-green-600",
        hover: theme === "dark" ? "hover:bg-green-900/50" : "hover:bg-green-100",
      },
      purple: {
        bg: theme === "dark" ? "bg-purple-950/50" : "bg-purple-50",
        border: theme === "dark" ? "border-purple-800" : "border-purple-200",
        icon: theme === "dark" ? "text-purple-400" : "text-purple-600",
        hover: theme === "dark" ? "hover:bg-purple-900/50" : "hover:bg-purple-100",
      },
      orange: {
        bg: theme === "dark" ? "bg-orange-950/50" : "bg-orange-50",
        border: theme === "dark" ? "border-orange-800" : "border-orange-200",
        icon: theme === "dark" ? "text-orange-400" : "text-orange-600",
        hover: theme === "dark" ? "hover:bg-orange-900/50" : "hover:bg-orange-100",
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="w-full">
      <h3 className={`text-sm font-medium mb-3 ${
        theme === "dark" ? "text-zinc-400" : "text-gray-600"
      }`}>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action, index) => {
          const colorClasses = getColorClasses(action.color);
          const Icon = action.icon;
          
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                colorClasses.bg
              } ${colorClasses.border} ${colorClasses.hover} hover:shadow-lg hover:-translate-y-0.5`}
            >
              <div className="flex flex-col items-start space-y-2">
                <div className={`p-2 rounded-lg ${
                  theme === "dark" ? "bg-white/5" : "bg-white"
                }`}>
                  <Icon className={`w-5 h-5 ${colorClasses.icon}`} />
                </div>
                <div className="text-left">
                  <h4 className={`text-sm font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    {action.title}
                  </h4>
                  <p className={`text-xs mt-0.5 ${
                    theme === "dark" ? "text-zinc-500" : "text-gray-500"
                  }`}>
                    {action.description}
                  </p>
                </div>
              </div>
              
              {/* Hover arrow indicator */}
              <svg
                className={`absolute bottom-4 right-4 w-4 h-4 transition-transform duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 ${
                  colorClasses.icon
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}