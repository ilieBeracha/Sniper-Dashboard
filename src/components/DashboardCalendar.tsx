import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import { format } from "date-fns";
import { TrainingSessionChart } from "@/types/training";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardCalendar() {
  const useTrainingCalendar = useStore(TrainingStore);
  const { last, next } = useTrainingCalendar.trainingsChartDisplay;
  const navigate = useNavigate();
  return (
    <div className="h-full">
      <div className="w-full h-full flex flex-col justify-between">
        <div className="relative border-l-2 border-white/10 pl-10 space-y-6">
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
  const glowColor = color === "green" ? "text-green-400" : "text-gray-400";
  const tagColor = color === "green" ? "bg-green-700/20 text-green-300" : "bg-gray-700/40 text-gray-300";

  return (
    <div className={`relative flex flex-col min-h-[100px] ${alignment === "right" ? "items-end" : "items-start"}`}>
      <div className="absolute -left-[30px] top-0.5 w-4 h-4 bg-[#1E1E1E] border border-white/20 rounded-full flex items-center justify-center">
        <CalendarDays className={`w-3 h-3 ${glowColor} text-sm`} />
      </div>

      <div
        className={` relative border-l-red-800 border-4 p-2 rounded-xl shadow-md border-white/5 w-full md:w-[75%] text-sm ${
          alignment === "right" ? "ml-auto" : ""
        }`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-500/10 to-yellow-500/10 rounded-full blur-3xl" /> */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">{label}</span>
          <span className={`text-xs px-3 py-1 rounded-full ${tagColor}`}>{color === "gray" ? "Completed" : "Upcoming"}</span>
        </div>

        <h4 className="text-sm font-semibold line-clamp-1">{session.session_name}</h4>
        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-500" />
          <div className="flex items-center justify-between w-full gap-2">
            {format(new Date(session.date), "dd MMM yyyy, HH:mm")}
            <span
              className="bg-indigo-200/10 rounded-md px-3 text-xs cursor-pointer underline-offset-1 text-white mt-1 flex items-center gap-2"
              onClick={onClick}
            >
              View
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTimelineItem({ title }: { title: string }) {
  return (
    <div className="relative flex items-start max-h-[100px]">
      <div className="absolute -left-[39px] top-0.5 w-4 h-4 bg-gray-700 border border-white/10 rounded-full"></div>
      <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/5 text-gray-500 text-sm w-full md:w-[75%]">{title} not available yet.</div>
    </div>
  );
}
