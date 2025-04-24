import { TrainingSession } from "@/types/training";
import { format, parseISO } from "date-fns";
import { Calendar, Bookmark } from "lucide-react";

export default function TrainingList({
  trainings,
}: {
  trainings: TrainingSession[];
}) {
  return (
    <div className="bg-[#1E1E1E] p-6 rounded-2xl shadow-xl col-span-3 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Training Sessions
        </h2>
        <span className="text-sm text-gray-400 bg-gray-800 py-1 px-3 rounded-full border border-white/10">
          {trainings.length} {trainings.length === 1 ? "session" : "sessions"}
        </span>
      </div>

      {trainings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 bg-gray-800/50 rounded-xl text-center border border-white/10">
          <Calendar className="w-10 h-10 text-gray-500 mb-3" />
          <p className="text-gray-400">
            No training sessions found.
            <br />
            <span className="text-sm text-gray-500">
              Schedule a new session to get started.
            </span>
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
          {trainings.map((session) => (
            <div
              key={session.id}
              className="border border-white/10 rounded-xl p-5 bg-[#2A2A2A] hover:bg-[#333] transition-all duration-200 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                <h3 className="font-semibold text-lg text-white">
                  {session.session_name}
                </h3>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(parseISO(session.date), "MMMM d, yyyy")}
                </div>
              </div>

              {session.assignments_trainings?.length > 0 ? (
                <div className="mt-3">
                  <div className="flex items-center text-gray-300 mb-2">
                    <Bookmark className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Assignments</span>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-1">
                    {session.assignments_trainings.map((assignment) => (
                      <li
                        key={assignment.id}
                        className="text-gray-300 text-sm flex items-center before:content-['▹'] before:mr-2 before:text-blue-400"
                      >
                        {assignment.assignment_name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No assignments</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
