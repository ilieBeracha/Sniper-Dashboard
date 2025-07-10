import { format } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";

type TrainingSessionGroupProps = {
  title: string;
  color: "indigo" | "green" | "blue" | "gray" | "red";
  date?: Date;
  children: React.ReactNode;
};

export default function TrainingSessionGroup({ title, color, date, children }: TrainingSessionGroupProps) {
  const { theme } = useTheme();
  const colorMap = {
    indigo: "bg-indigo-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    gray: "bg-gray-500",
    red: "bg-red-500",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${colorMap[color]} shadow-[0_0_8px_0px_${colorMap[color]}]`}></div>
        <h4
          className={`text-sm font-medium uppercase tracking-wider transition-colors duration-200 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h4>
        <div className={`h-px flex-grow transition-colors duration-200 ${theme === "dark" ? "bg-white/5" : "bg-gray-200"}`}></div>
        {date && (
          <span className={`text-xs font-medium transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {format(date, "EEEE, MMMM d")}
          </span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
