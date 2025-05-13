import { Assignment } from "@/types/training";
import { User } from "@/types/user";

type PreviewSectionProps = {
  sessionName: string;
  location: string;
  date: string;
  assignments: Assignment[];
  assignmentIds: string[];
  teamMembers: User[];
  members: string[];
};

export default function PreviewSection({ sessionName, location, date, assignments, assignmentIds, teamMembers, members }: PreviewSectionProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-white/5 p-6 sticky top-4">
      <h4 className="text-sm font-medium text-white mb-6 flex items-center gap-2">
        <span className="w-[400px] h-1.5 rounded-full bg-indigo-500"></span>
        Session Preview
      </h4>

      <div className="space-y-8">
        {/* Basic Info Preview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Session Name</p>
            <p className="text-white font-medium text-sm truncate">{sessionName || "Not set"}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Location</p>
            <p className="text-white font-medium text-sm truncate">{location || "Not set"}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Date & Time</p>
            <p className="text-white font-medium text-sm truncate">{date ? new Date(date).toLocaleString() : "Not set"}</p>
          </div>
        </div>

        {/* Assignments Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400">Selected Assignments</p>
            {assignmentIds.length > 0 && (
              <div className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-xs">{assignmentIds.length} selected</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {assignmentIds.length > 0 ? (
              assignments
                .filter((a) => assignmentIds.includes(a.id))
                .map((assignment) => (
                  <div key={assignment.id} className="bg-white/5 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span className="truncate">{assignment.assignment_name}</span>
                  </div>
                ))
            ) : (
              <div className="bg-white/5 rounded-lg px-4 py-3 text-sm text-gray-500 col-span-2">No assignments selected</div>
            )}
          </div>
        </div>

        {/* Members Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400">Selected Members</p>
            {members.length > 0 && <div className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-xs">{members.length} selected</div>}
          </div>
          <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {members.length > 0 ? (
              teamMembers
                .filter((m) => members.includes(m.id))
                .map((member) => (
                  <div key={member.id} className="bg-white/5 rounded-lg px-4 py-3 text-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 flex-col">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          <span className="truncate w-full  ">{member.first_name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{member.user_role}</span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="bg-white/5 rounded-lg px-4 py-3 text-sm text-gray-500 col-span-2">No members selected</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
