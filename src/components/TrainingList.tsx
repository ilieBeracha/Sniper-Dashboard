import { TrainingSession } from "@/types/training";
import { format, parseISO } from "date-fns";
import { Calendar, Bookmark, Clock, MapPin } from "lucide-react";

export default function TrainingList({ trainings }: { trainings: TrainingSession[] }) {
  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl shadow-lg col-span-3 border border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          <span className=" text-white">Training Sessions</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="flex items-center text-xs font-medium bg-indigo-500/20 text-indigo-300 py-1 px-3 rounded-full">
            <Calendar className="w-3 h-3 mr-1.5" />
            {trainings.length} {trainings.length === 1 ? "session" : "sessions"}
          </span>
        </div>
      </div>

      {trainings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-[#222]/50 rounded-lg text-center border border-white/5">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-gray-300 font-medium">No training sessions found</p>
          <p className="text-sm text-gray-500 mt-1 max-w-xs">Schedule a new training session to start tracking your team's progress</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1 custom-scrollbar">
          {trainings.map((session) => (
            <div
              key={session.id}
              className="border border-white/5 rounded-lg p-4 bg-[#222] hover:bg-[#282828] transition-all duration-200 hover:shadow-md group"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-base text-white group-hover:text-indigo-300 transition-colors">{session.session_name}</h3>
                  <div className="flex items-center text-gray-400 text-xs mt-1">
                    <Clock className="w-3 h-3 mr-1.5" />
                    {format(parseISO(session.date), "MMM d, yyyy • h:mm a")}
                    {session.location && (
                      <>
                        <span className="mx-2 text-gray-600">|</span>
                        <MapPin className="w-3 h-3 mr-1.5" />
                        <span className="truncate max-w-[150px]">{session.location}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="sm:ml-auto">
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-300">
                    {new Date(session.date) > new Date() ? "Upcoming" : "Completed"}
                  </span>
                </div>
              </div>

              {session.assignments_trainings && session?.assignments_trainings?.length > 0 ? (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center text-gray-300 mb-2">
                    <Bookmark className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                    <span className="text-xs font-medium uppercase tracking-wide">Assignments</span>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
                    {session?.assignments_trainings?.map((assignment) => (
                      <li key={assignment.id} className="text-gray-300 text-xs flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 flex-shrink-0"></span>
                        <span className="truncate">{assignment.assignment_name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-gray-500 text-xs italic flex items-center">
                    <Bookmark className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                    No assignments attached to this session
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
