import { TrainingSession } from "@/types/training";
import {
  startOfMonth,
  getDaysInMonth,
  format,
  parseISO,
  addDays,
  isSameDay,
} from "date-fns";
import { Plus } from "lucide-react";

export default function TrainingCalendar({
  trainings,
  handleAddTrainingModal,
}: {
  trainings: TrainingSession[];
  handleAddTrainingModal: any;
}) {
  const today = new Date();
  const start = startOfMonth(today);
  const daysInMonth = getDaysInMonth(today);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) =>
    addDays(start, i)
  );

  const isTrainingDay = (day: Date) =>
    trainings?.some((session) => isSameDay(parseISO(session.date), day));

  function onAddTraining() {
    handleAddTrainingModal();
  }

  return (
    <>
      {/* Calendar View */}
      <div className="rounded-2xl col-span-2">
        <div className="rounded-2xl bg-[#1E1E1E] p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{format(today, "MMMM yyyy")}</h2>
            <button
              onClick={() => onAddTraining()}
              className="flex items-center gap-2 bg-[#7F5AF0] hover:bg-[#6d4ee0] transition px-4 py-2 rounded-lg"
            >
              <Plus size={18} />
              Add Training
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-sm font-medium text-gray-400 text-center"
              >
                {day}
              </div>
            ))}

            {monthDays.map((day, index) => (
              <div
                key={index}
                className={`h-16 flex items-center justify-center rounded-lg border border-white/10 ${
                  isTrainingDay(day)
                    ? "bg-[#7F5AF0] text-white font-bold"
                    : "bg-[#2A2A2A]"
                }`}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
