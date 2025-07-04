import { Assignment } from "@/types/training";
import { User } from "@/types/user";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();

  return (
    <div className={`rounded-lg p-6 sticky top-4 ${
      theme === 'dark' 
        ? 'bg-[#1A1A1A] border border-white/5' 
        : 'bg-white border border-gray-200'
    }`}>
      <h4 className={`text-sm font-medium mb-6 flex items-center gap-2 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        <span className="w-[400px] h-1.5 rounded-full bg-indigo-500"></span>
        Session Preview
      </h4>

      <div className="space-y-8">
        {/* Basic Info Preview */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <p className={`text-xs mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Session Name</p>
            <p className={`font-medium text-sm truncate ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{sessionName || "Not set"}</p>
          </div>
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <p className={`text-xs mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Location</p>
            <p className={`font-medium text-sm truncate ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{location || "Not set"}</p>
          </div>
          <div className={`rounded-lg p-4 ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <p className={`text-xs mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Date & Time</p>
            <p className={`font-medium text-sm truncate ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{date ? new Date(date).toLocaleString() : "Not set"}</p>
          </div>
        </div>

        {/* Assignments Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Selected Assignments</p>
            {assignmentIds.length > 0 && (
              <div className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-xs">{assignmentIds.length} selected</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {assignmentIds.length > 0 ? (
              assignments
                .filter((a) => assignmentIds.includes(a.id))
                .map((assignment) => (
                  <div key={assignment.id} className={`rounded-lg px-4 py-3 text-sm flex items-center gap-2 ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span className={`truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{assignment.assignment_name}</span>
                  </div>
                ))
            ) : (
              <div className={`rounded-lg px-4 py-3 text-sm col-span-2 ${
                theme === 'dark' 
                  ? 'bg-white/5 text-gray-500' 
                  : 'bg-gray-50 text-gray-600'
              }`}>No assignments selected</div>
            )}
          </div>
        </div>

        {/* Members Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Selected Members</p>
            {members.length > 0 && <div className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-xs">{members.length} selected</div>}
          </div>
          <div className={`grid grid-cols-2 gap-3 overflow-y-auto max-h-[200px] ${
            theme === 'dark' 
              ? 'scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900'
              : 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'
          }`}>
            {members.length > 0 ? (
              teamMembers
                .filter((m) => members.includes(m.id))
                .map((member) => (
                  <div key={member.id} className={`rounded-lg px-4 py-3 text-sm flex flex-col gap-2 ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 flex-col">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          <span className={`truncate w-full ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{member.first_name}</span>
                        </div>
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{member.user_role}</span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className={`rounded-lg px-4 py-3 text-sm col-span-2 ${
                theme === 'dark' 
                  ? 'bg-white/5 text-gray-500' 
                  : 'bg-gray-50 text-gray-600'
              }`}>No members selected</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
