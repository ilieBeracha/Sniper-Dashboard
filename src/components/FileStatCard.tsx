import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@heroui/react";
import { LucideIcon } from "lucide-react";

interface FileStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

export default function FileStatCard({ title, value, icon: Icon, iconColor = "text-purple-500", subtitle }: FileStatCardProps) {
  const { theme } = useTheme();

  return (
    <Card
      className={`${
        theme === "dark" ? "bg-zinc-900/50 border-neutral-700/70" : "bg-white border-gray-200"
      } border shadow-sm rounded-xl overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{title}</p>
            <p className={`text-2xl font-semibold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{value}</p>
            {subtitle && <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-white/5" : "bg-gray-50"}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </div>
    </Card>
  );
}
