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
  const { theme } = useTheme();
  return (
    <div className="h-full px-4 sm:px-6 py-2">
      <div className="w-full h-full flex flex-col justify-center">
        <div
          className={`relative border-l-2 pl-6 sm:pl-10 space-y-8 transition-colors duration-200 ${theme === "dark" ? "border-white/10" : "border-gray-300"}`}
        >
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
  alignment,
  color,
}: {
  session: TrainingSessionChart;
  label: string;
  alignment: "left" | "right";
  color: "gray" | "green";
  onClick: () => void;
}) {
  const { theme } = useTheme();
  const glowColor = color === "green" ? "text-green-400" : "text-gray-400";
  const tagColor = color === "green" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-gray-500/20 text-gray-300 border-gray-500/30";
  const cardBg = color === "green" ? "bg-gradient-to-br from-green-500/5 to-emerald-500/5" : "bg-gradient-to-br from-gray-500/5 to-slate-500/5";

  return (
    <div className={`relative flex flex-col ${alignment === "right" ? "items-end" : "items-start"}`}>
      <div
        className={`absolute -left-[34px] sm:-left-[46px] top-2 w-5 h-5 ${cardBg} border-2 ${color === "green" ? "border-green-500/40" : "border-gray-500/40"} rounded-full flex items-center justify-center shadow-lg`}
      >
        <CalendarDays className={`w-3 h-3 ${glowColor}`} />
      </div>

      <div
        className={`relative backdrop-blur-sm transition-all duration-300 px-4 sm:px-5 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl w-full sm:w-[85%] lg:w-[75%] cursor-pointer group ${
          alignment === "right" ? "ml-auto" : ""
        } ${
          theme === "dark"
            ? "bg-[#1A1A1A]/80 border border-white/10 hover:border-white/20"
            : "bg-white/90 border border-gray-200 hover:border-gray-300"
        }`}
        onClick={onClick}
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div
            className={`absolute -top-1/2 -left-1/2 w-full h-full ${cardBg} rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
          />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-xs font-medium uppercase tracking-wide transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {label}
            </span>
            <span className={`text-xs px-3 py-1.5 rounded-full border ${tagColor} font-medium`}>{color === "gray" ? "Completed" : "Upcoming"}</span>
          </div>

          <h4
            className={`text-base font-semibold mb-2 group-hover:opacity-80 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {session.session_name}
          </h4>

          <div
            className={`flex items-center justify-between text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            <div className="flex items-center gap-2">
              <CalendarDays className={`w-4 h-4 transition-colors duration-200 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
              <span>{format(new Date(session.date), "dd MMM yyyy, HH:mm")}</span>
            </div>

            <div className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200 transition-colors font-medium">
              <span>View Details</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTimelineItem({ title }: { title: string }) {
  const { theme } = useTheme();
  return (
    <div className="relative flex items-start">
      <div
        className={`absolute -left-[34px] sm:-left-[46px] top-2 w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors duration-200 ${theme === "dark" ? "bg-gray-700/50 border-gray-600/40" : "bg-gray-300/50 border-gray-400/40"}`}
      >
        <CalendarDays className={`w-3 h-3 transition-colors duration-200 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
      </div>
      <div
        className={`backdrop-blur-sm border border-dashed px-4 sm:px-5 py-3 sm:py-4 rounded-xl text-sm w-full sm:w-[85%] lg:w-[75%] flex items-center justify-center min-h-[70px] transition-colors duration-200 ${theme === "dark" ? "bg-[#1A1A1A]/60 border-gray-600/40 text-gray-500" : "bg-white/60 border-gray-300/40 text-gray-400"}`}
      >
        <div className="text-center">
          <div className={`font-medium mb-1 transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{title}</div>
          <div className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-600" : "text-gray-500"}`}>
            No sessions scheduled
          </div>
        </div>
      </div>
    </div>
  );
}
