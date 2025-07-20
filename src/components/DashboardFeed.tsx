import { useTheme } from "@/contexts/ThemeContext";
import BaseDashboardCard from "./base/BaseDashboardCard";

const activity = [
  {
    id: 1,
    type: "achievement",
    title: "Perfect Score",
    description: "10 consecutive bullseyes in training",
    time: "2h ago",
    color: "yellow",
  },
  {
    id: 2,
    type: "training",
    title: "Night Vision Training",
    description: "Completed advanced low-light exercise",
    time: "5h ago",
    color: "green",
  },
  {
    id: 3,
    type: "team",
    title: "Squad Assignment",
    description: "Assigned to Alpha Team for next mission",
    time: "1d ago",
    color: "indigo",
  },
  {
    id: 4,
    type: "milestone",
    title: "1000 Shots Fired",
    description: "Reached career milestone",
    time: "2d ago",
    color: "purple",
  },
];

export default function DashboardFeed() {
  const { theme } = useTheme();

  const getColorClasses = (color: string) => {
    const colors = {
      yellow: theme === "dark" ? "bg-yellow-500/10 text-yellow-400" : "bg-yellow-50 text-yellow-600",
      green: theme === "dark" ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-600",
      indigo: theme === "dark" ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600",
      purple: theme === "dark" ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600",
    };
    return colors[color as keyof typeof colors] || colors.indigo;
  };

  return (
    <BaseDashboardCard header="Activity Feed" tooltipContent="Recent training activities and achievements">
      <div className="px-4 pb-4">
        <div className="space-y-3">
          {activity.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg transition-all hover:scale-[1.01] cursor-pointer ${
                theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getColorClasses(item.color)}`}>{item.type}</span>
                    <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{item.time}</span>
                  </div>
                  <h4 className={`font-semibold text-sm mb-0.5 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{item.title}</h4>
                  <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseDashboardCard>
  );
}
