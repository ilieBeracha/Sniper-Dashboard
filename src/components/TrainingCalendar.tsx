import { TrainingSession } from "@/types/training";
import { startOfMonth, getDaysInMonth, format, parseISO, addDays, isSameDay, isToday } from "date-fns";

export default function TrainingCalendar({ trainings }: { trainings: TrainingSession[] }) {
  const today = new Date();
  const start = startOfMonth(today);
  const daysInMonth = getDaysInMonth(today);

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => addDays(start, i));
  const isTrainingDay = (day: Date) => trainings?.some((session) => isSameDay(parseISO(session.date), day));
  const getTrainingCount = (day: Date) => trainings?.filter((session) => isSameDay(parseISO(session.date), day)).length || 0;

  return (
    <div>
      {/* Month display */}
      <div className="flex justify-center items-center mb-6">
        <h3 className="text-lg font-bold text-white">{format(today, "MMMM yyyy")}</h3>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Day Labels */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-xs font-medium text-gray-400 text-center pb-2">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {monthDays.map((day, index) => {
          const isTraining = isTrainingDay(day);
          const trainingCount = getTrainingCount(day);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              className={`
                h-14 flex flex-col items-center justify-center rounded-md border transition-all
                ${isTraining ? "border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20" : "border-white/5 bg-[#222] hover:bg-[#2A2A2A]"}
                ${isCurrentDay ? "ring-1 ring-green-500 ring-offset-1 ring-offset-[#1A1A1A]" : ""}
              `}
            >
              <span className={`text-sm ${isCurrentDay ? "font-bold text-green-400" : isTraining ? "font-medium text-white" : "text-gray-400"}`}>
                {format(day, "d")}
              </span>

              {trainingCount > 0 && (
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: Math.min(trainingCount, 3) }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  ))}
                  {trainingCount > 3 && <span className="text-[10px] text-indigo-400 ml-0.5">+{trainingCount - 3}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center mt-6 text-xs text-gray-400 gap-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full border border-green-500 mr-1.5"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 mr-1.5"></div>
          <span>Training Day</span>
        </div>
      </div>
    </div>
  );
}