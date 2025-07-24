import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import { format } from "date-fns";
import { TrainingSessionChart } from "@/types/training";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { primitives } from "@/styles/core";

export default function DashboardCalendar() {
  const useTrainingCalendar = useStore(TrainingStore);
  const { last, next } = useTrainingCalendar.trainingsChartDisplay;
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="h-full px-4 py-4 ">
      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-3 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: theme === "dark" ? primitives.grey.grey800 : primitives.grey.grey300 }}
        />

        <div className="space-y-4">
          {last ? (
            <TrainingTimelineItem onClick={() => navigate(`/training/${last.id}`)} session={last} label="Last Training" isPast={true} />
          ) : (
            <PlaceholderTimelineItem title="Last Training" />
          )}

          {next ? (
            <TrainingTimelineItem onClick={() => navigate(`/training/${next.id}`)} session={next} label="Next Training" isPast={false} />
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
  isPast,
}: {
  session: TrainingSessionChart;
  label: string;
  isPast: boolean;
  onClick: () => void;
}) {
  const { theme } = useTheme();

  return (
    <div className="relative pl-8">
      {/* Timeline dot */}
      <div
        className="absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center"
        style={{
          backgroundColor: theme === "dark" ? primitives.grey.grey900 : primitives.white.white,
          borderColor: isPast ? primitives.grey.grey500 : primitives.purple.purple400,
        }}
      >
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isPast ? primitives.grey.grey500 : primitives.purple.purple400 }} />
      </div>

      <div
        className="group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg"
        style={{
          backgroundColor:
            theme === "dark"
              ? isPast
                ? `${primitives.grey.grey900}60`
                : `${primitives.purple.purple400}08`
              : isPast
                ? primitives.grey.grey50
                : primitives.purple.purple50,
          borderColor:
            theme === "dark" ? (isPast ? primitives.grey.grey800 : `blue-500`) : isPast ? primitives.grey.grey200 : primitives.purple.purple100,
        }}
        onClick={onClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div
              className="text-xs font-medium mb-1"
              style={{ color: isPast ? (theme === "dark" ? primitives.grey.grey500 : primitives.grey.grey600) : primitives.purple.purple400 }}
            >
              {label}
            </div>
            <h4 className="text-base font-semibold mb-2" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
              {session.session_name}
            </h4>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }} />
              <span className="text-xs" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
                {format(new Date(session.date), "dd MMM yyyy, HH:mm")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: isPast
                  ? theme === "dark"
                    ? `${primitives.grey.grey700}40`
                    : primitives.grey.grey100
                  : theme === "dark"
                    ? `${primitives.green.green500}20`
                    : primitives.green.green50,
                color: isPast
                  ? theme === "dark"
                    ? primitives.grey.grey400
                    : primitives.grey.grey600
                  : theme === "dark"
                    ? primitives.green.green400
                    : primitives.green.green600,
              }}
            >
              {isPast ? "Done" : "Next"}
            </span>

            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: primitives.purple.purple400 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTimelineItem({ title }: { title: string }) {
  const { theme } = useTheme();
  return (
    <div className="relative pl-8">
      {/* Timeline dot */}
      <div
        className="absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center"
        style={{
          backgroundColor: theme === "dark" ? primitives.grey.grey900 : primitives.white.white,
          borderColor: theme === "dark" ? primitives.grey.grey700 : primitives.grey.grey300,
        }}
      >
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme === "dark" ? primitives.grey.grey700 : primitives.grey.grey300 }} />
      </div>

      <div
        className="p-4 rounded-xl border border-dashed"
        style={{
          backgroundColor: theme === "dark" ? `${primitives.grey.grey900}40` : primitives.grey.grey50,
          borderColor: theme === "dark" ? primitives.grey.grey800 : primitives.grey.grey300,
        }}
      >
        <div className="text-xs font-medium mb-1" style={{ color: theme === "dark" ? primitives.grey.grey600 : primitives.grey.grey500 }}>
          {title}
        </div>
        <div className="text-xs" style={{ color: theme === "dark" ? primitives.grey.grey700 : primitives.grey.grey400 }}>
          No sessions scheduled
        </div>
      </div>
    </div>
  );
}
