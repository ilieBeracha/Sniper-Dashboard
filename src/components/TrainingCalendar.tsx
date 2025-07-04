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
    <div className="w-full text-sm">
      <div className="w-full">
        <div className="flex justify-center items-center mb-3">
          <h4 className="font-semibold text-white text-sm">{format(today, "MMMM yyyy")}</h4>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="font-medium text-gray-400 text-center pb-1 text-xs">
              {day}
            </div>
          ))}

          {monthDays.map((day, index) => {
            const isTraining = isTrainingDay(day);
            const trainingCount = getTrainingCount(day);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                className={`
                h-10 flex flex-col items-center justify-center rounded border transition-all text-xs
                ${isTraining ? "border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20" : "border-white/5 bg-[#222] hover:bg-[#2A2A2A]"}
                ${isCurrentDay ? "ring-1 ring-green-500" : ""}
                hover:scale-[1.02]
              `}
              >
                <span className={`text-xs ${isCurrentDay ? "font-bold text-green-400" : isTraining ? "font-medium text-white" : "text-gray-400"}`}>
                  {format(day, "d")}
                </span>

                {trainingCount > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {Array.from({ length: Math.min(trainingCount, 2) }).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-indigo-500" />
                    ))}
                    {trainingCount > 2 && <span className="text-[8px] text-indigo-400">+</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center mt-3 text-xs text-gray-400 gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full border border-green-500"></div>
            <span className="text-xs">Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500/20 border border-indigo-500/30"></div>
            <span className="text-xs">Training</span>
          </div>
        </div>
      </div>
    </div>
  );
}
