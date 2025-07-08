import { TrainingSession } from "@/types/training";
import { startOfMonth, getDaysInMonth, format, parseISO, addDays, isSameDay, isToday } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";

export default function TrainingCalendar({ trainings }: { trainings: TrainingSession[] }) {
  const { theme } = useTheme();
  const today = new Date();
  const start = startOfMonth(today);
  const daysInMonth = getDaysInMonth(today);

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => addDays(start, i));
  const isTrainingDay = (day: Date) => trainings?.some((session) => isSameDay(parseISO(session.date), day));
  const getTrainingCount = (day: Date) => trainings?.filter((session) => isSameDay(parseISO(session.date), day)).length || 0;

  return (
    <>
      {trainings.length === 0 && <div className="text-center text-gray-500 h-80 flex items-center justify-center">No trainings found</div>}
      {trainings.length > 0 && (
        <div className="w-full text-sm">
          <div className="w-full">
            <div className="flex justify-center items-center mb-3">
              <h4 className={`font-semibold text-sm transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {format(today, "MMMM yyyy")}
              </h4>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className={`font-medium text-center pb-1 text-xs transition-colors duration-200 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
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
                h-10 flex flex-col items-center justify-center rounded border transition-all text-xs duration-200
                ${
                  isTraining
                    ? "border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20"
                    : theme === "dark"
                      ? "border-white/5 bg-[#222] hover:bg-[#2A2A2A]"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }
                ${isCurrentDay ? "ring-1 ring-green-500" : ""}
                hover:scale-[1.02]
              `}
                  >
                    <span
                      className={`text-xs transition-colors duration-200 ${
                        isCurrentDay
                          ? "font-bold text-green-400"
                          : isTraining
                            ? theme === "dark"
                              ? "font-medium text-white"
                              : "font-medium text-gray-900"
                            : theme === "dark"
                              ? "text-gray-400"
                              : "text-gray-600"
                      }`}
                    >
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

            <div
              className={`flex items-center justify-center mt-3 text-xs gap-3 transition-colors duration-200 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
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
      )}
    </>
  );
}
