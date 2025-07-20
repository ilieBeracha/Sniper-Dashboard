import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import { format } from "date-fns";
import { TrainingSessionChart } from "@/types/training";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

export default function DashboardCalendar() {
  const useTrainingCalendar = useStore(TrainingStore);
  const { last, next } = useTrainingCalendar.trainingsChartDisplay;
  const navigate = useNavigate();

  return (
    <div className="h-full max-h-[300px] sm:max-h-[400px] lg:max-h-full px-4 py-4 overflow-auto">
      <div className="w-full h-full flex flex-col justify-center">
        <div className={`relative space-y-4 transition-colors duration-200`}>
          {last ? (
            <TrainingTimelineItem
              onClick={() => navigate(`/training/${last.id}`)}
              session={last}
              label="Last Training"
              alignment="left"
              color="gray"
            />
          ) : (
            <PlaceholderTimelineItem title="Last Training" />
          )}

          {next ? (
            <TrainingTimelineItem
              onClick={() => navigate(`/training/${next.id}`)}
              session={next}
              label="Next Training"
              alignment="right"
              color="green"
            />
          ) : (
            <PlaceholderTimelineItem title="Next Training" />
          )}
        </div>
      </div>
    </div>
  );
}

function TrainingTimelineItem({
  onClick,
  session,
  label,
  color,
}: {
  session: TrainingSessionChart;
  label: string;
  alignment: "left" | "right";
  color: "gray" | "green";
  onClick: () => void;
}) {
  const { theme } = useTheme();
  const dotColor = color === "green" ? "bg-green-500" : "bg-gray-400";
  const tagColor = color === "green" ? "bg-green-500/10 text-green-600 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200";
  const darkTagColor = color === "green" ? "bg-green-500/10 text-green-400 border-green-800" : "bg-gray-800 text-gray-400 border-gray-700";

  return (
    <div className="relative">
      <div className={`absolute -left-[25px] top-3 w-2 h-2 ${dotColor} rounded-full`} />

      <div
        className={`relative backdrop-blur-sm transition-all duration-300 px-4 sm:px-5 py-2 sm:py-2 rounded-xl shadow-lg hover:shadow-xl w-full  cursor-pointer group         } ${
          theme === "dark"
            ? "bg-[#1A1A1A]/80 border border-white/10 hover:border-white/20"
            : "bg-white/90 border border-gray-200 hover:border-gray-300"
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={`text-xs font-medium transition-colors duration-200 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
              {label}
            </span>
            <h4 className={`text-sm font-medium mt-1 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {session.session_name}
            </h4>
          </div>
          <span className={`text-xs px-2 py-1 rounded-md border ${theme === "dark" ? darkTagColor : tagColor} font-medium`}>
            {color === "gray" ? "Completed" : "Upcoming"}
          </span>
        </div>

        <div
          className={`flex items-center justify-between text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}
        >
          <div className="flex items-center gap-1.5">
            <CalendarDays className={`w-3.5 h-3.5`} />
            <span>{format(new Date(session.date), "dd MMM yyyy, HH:mm")}</span>
          </div>

          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all font-medium">
            <span className="text-xs">View</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTimelineItem({ title }: { title: string }) {
  const { theme } = useTheme();
  return (
    <div className="relative">
      <div
        className={`absolute -left-[25px] top-3 w-2 h-2 rounded-full transition-colors duration-200 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
      />
      <div
        className={`border border-dashed px-4 py-3 rounded-lg transition-colors duration-200 ${theme === "dark" ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200"}`}
      >
        <div className={`text-xs font-medium mb-1 transition-colors duration-200 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
          {title}
        </div>
        <div className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>No sessions scheduled</div>
      </div>
    </div>
  );
}
