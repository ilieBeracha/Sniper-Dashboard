import { format } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { primitives } from "@/styles/core";

type TrainingSessionGroupProps = {
  title: string;
  color: "indigo" | "green" | "blue" | "gray" | "red";
  date?: Date;
  children: React.ReactNode;
};

export default function TrainingSessionGroup({ title, color, date, children }: TrainingSessionGroupProps) {
  const { theme } = useTheme();
  const colorMap = {
    indigo: primitives.lavender.lavender400,
    green: primitives.green.green500,
    blue: primitives.blue.blue500,
    gray: primitives.grey.grey500,
    red: primitives.red.red500,
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: colorMap[color],
            boxShadow: `0 0 8px 0px ${colorMap[color]}`,
          }}
        ></div>
        <h4
          className="text-sm font-medium uppercase tracking-wider transition-colors duration-200"
          style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}
        >
          {title}
        </h4>
        <div
          className="h-px flex-grow transition-colors duration-200"
          style={{ backgroundColor: theme === "dark" ? `${primitives.white.white}0D` : primitives.grey.grey200 }}
        ></div>
        {date && (
          <span
            className="text-xs font-medium transition-colors duration-200"
            style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}
          >
            {format(date, "EEEE, MMMM d")}
          </span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
