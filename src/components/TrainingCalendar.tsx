import { userStore } from "@/store/userStore";
import { TrainingSession } from "@/types/training";
import { isCommander } from "@/utils/permissions";
import { startOfMonth, getDaysInMonth, format, parseISO, addDays, isSameDay, isSameMonth, isToday } from "date-fns";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useStore } from "zustand";

export default function TrainingCalendar({ trainings, handleAddTrainingModal }: { trainings: TrainingSession[]; handleAddTrainingModal: any }) {
  const today = new Date();
  const start = startOfMonth(today);
  const daysInMonth = getDaysInMonth(today);
  const { userRole } = useStore(userStore);

  // Get all days in the current month
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => addDays(start, i));

  const isTrainingDay = (day: Date) => trainings?.some((session) => isSameDay(parseISO(session.date), day));

  // Get count of trainings on a specific day
  const getTrainingCount = (day: Date) => trainings?.filter((session) => isSameDay(parseISO(session.date), day)).length || 0;

  function onAddTraining() {
    handleAddTrainingModal();
  }

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl shadow-lg col-span-2 border border-white/5">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 text-[#7F5AF0] mr-2" />
          <h2 className="text-lg font-bold text-white">{format(today, "MMMM yyyy")}</h2>
        </div>

        {isCommander(userRole) && (
          <button
            onClick={onAddTraining}
            className="flex items-center gap-1.5 bg-[#7F5AF0] hover:bg-[#6d4ee0] transition-colors px-3 py-1.5 rounded-md text-white text-sm font-medium"
          >
            <Plus size={16} />
            Add Training
          </button>
        )}
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
                ${isTraining ? "border-[#7F5AF0]/30 bg-[#7F5AF0]/10 hover:bg-[#7F5AF0]/20" : "border-white/5 bg-[#222] hover:bg-[#2A2A2A]"}
                ${isCurrentDay ? "ring-1 ring-[#2CB67D] ring-offset-1 ring-offset-[#161616]" : ""}
              `}
            >
              <span className={`text-sm ${isCurrentDay ? "font-bold text-[#2CB67D]" : isTraining ? "font-medium text-white" : "text-gray-400"}`}>
                {format(day, "d")}
              </span>

              {/* Training indicators */}
              {trainingCount > 0 && (
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: Math.min(trainingCount, 3) }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7F5AF0]" />
                  ))}
                  {trainingCount > 3 && <span className="text-[10px] text-[#7F5AF0] ml-0.5">+{trainingCount - 3}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-6 text-xs text-gray-400 gap-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full border border-[#2CB67D] mr-1.5"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#7F5AF0]/10 border border-[#7F5AF0]/30 mr-1.5"></div>
          <span>Training Day</span>
        </div>
      </div>
    </div>
  );
}
