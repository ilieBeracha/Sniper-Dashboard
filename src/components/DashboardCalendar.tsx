import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import { format } from "date-fns";
import { TrainingSession } from "@/types/training";

export default function DashboardCalendar() {
  const useTrainingCalendar = useStore(TrainingStore);
  const { last, next } = useTrainingCalendar.trainings;

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-2xl text-white w-full col-span-2">
      <h2 className="text-xl font-semibold mb-2">📅 Training Calendar</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm text-gray-400 mb-3">Last Training</h3>
          {last ? (
            <TrainingCard session={last} color="gray" />
          ) : (
            <PlaceholderCard title="Last Session" />
          )}
        </div>

        <div>
          <h3 className="text-sm text-gray-400 mb-3">Next Training</h3>
          {next ? (
            <TrainingCard session={next} color="green" />
          ) : (
            <PlaceholderCard title="Next Session" />
          )}
        </div>
      </div>
    </div>
  );
}

function TrainingCard({
  session,
  color,
}: {
  session: TrainingSession;
  color: "gray" | "green";
}) {
  const borderColor = color === "gray" ? "border-gray-500" : "border-green-500";
  const statusColor = color === "gray" ? "bg-gray-700" : "bg-green-700/30";
  const statusText = color === "gray" ? "Completed" : "Upcoming";

  return (
    <div
      className={`border-l-4 ${borderColor} bg-[#252525] rounded-xl p-5 h-full`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold">{session.session_name}</h4>
          <p className="text-sm text-gray-400">
            {format(new Date(session.date), "dd MMM yyyy, HH:mm")}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-lg ${statusColor}`}>
          {statusText}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-2">Assignments:</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {session.assignments_trainings.flatMap((a) =>
            Array.isArray(a.assignments)
              ? a.assignments.map((assignment) => (
                  <span
                    key={assignment.id}
                    className="bg-[#1E1E1E] border border-white/10 px-2 py-1 rounded-full"
                  >
                    {assignment.assignment_name}
                  </span>
                ))
              : []
          )}
        </div>
      </div>
    </div>
  );
}

function PlaceholderCard({ title }: { title: string }) {
  return (
    <div className="bg-[#252525] p-6 rounded-xl text-sm text-gray-500 flex items-center justify-center h-full">
      {title} not available yet.
    </div>
  );
}
