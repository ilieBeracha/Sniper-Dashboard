import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import { format } from "date-fns";
import { TrainingSessionChart } from "@/types/training";
import { CalendarDays } from "lucide-react";

export default function DashboardCalendar() {
  const useTrainingCalendar = useStore(TrainingStore);
  const { last, next } = useTrainingCalendar.trainingsChartDisplay;

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="relative border-l-2 border-white/10 pl-6 space-y-6">
        {last ? (
          <TrainingTimelineItem session={last} label="Last Training" alignment="left" color="gray" />
        ) : (
          <PlaceholderTimelineItem title="Last Training" />
        )}

        {next ? (
          <TrainingTimelineItem session={next} label="Next Training" alignment="right" color="green" />
        ) : (
          <PlaceholderTimelineItem title="Next Training" />
        )}
      </div>
    </div>
  );
}

function TrainingTimelineItem({
  session,
  label,
  alignment,
  color,
}: {
  session: TrainingSessionChart;
  label: string;
  alignment: "left" | "right";
  color: "gray" | "green";
}) {
  const glowColor = color === "green" ? "text-green-400" : "text-gray-400";
  const tagColor = color === "green" ? "bg-green-700/20 text-green-300" : "bg-gray-700/40 text-gray-300";

  return (
    <div className={`relative flex flex-col ${alignment === "right" ? "items-end" : "items-start"}`}>
      <div className="absolute -left-[39px] top-1 w-4 h-4 bg-[#1E1E1E] border border-white/20 rounded-full flex items-center justify-center">
        <CalendarDays className={`w-3 h-3 ${glowColor}`} />
      </div>

      <div
        className={`bg-[#1E1E1E] border-l-red-800 border-4 p-4 rounded-xl shadow-md border-white/5 w-full md:w-[75%] ${
          alignment === "right" ? "ml-auto" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs uppercase tracking-wider text-gray-400">{label}</span>
          <span className={`text-xs px-3 py-1 rounded-full ${tagColor}`}>{color === "gray" ? "Completed" : "Upcoming"}</span>
        </div>

        <h4 className="text-lg font-semibold line-clamp-1">{session.session_name}</h4>
        <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-500" />
          {format(new Date(session.date), "dd MMM yyyy, HH:mm")}
        </p>
      </div>
    </div>
  );
}

function PlaceholderTimelineItem({ title }: { title: string }) {
  return (
    <div className="relative flex items-start">
      <div className="absolute -left-[39px] top-1 w-4 h-4 bg-gray-700 border border-white/10 rounded-full"></div>
      <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/5 text-gray-500 text-sm w-full md:w-[75%]">{title} not available yet.</div>
    </div>
  );
}
