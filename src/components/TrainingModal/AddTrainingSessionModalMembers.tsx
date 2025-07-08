import { useState } from "react";
import { User } from "@/types/user";
import SearchableCheckboxList from "../SearchableCheckboxList";
import { useTheme } from "@/contexts/ThemeContext";

type TeamMembersSectionProps = {
  teamMembers: User[];
  members: string[];
  setMembers: (ids: string[]) => void;
};

export default function TeamMembersSection({ teamMembers, members, setMembers }: TeamMembersSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useTheme();

  const formattedMembers = teamMembers.map((member) => ({
    id: member.id,
    label: `${member.first_name} ${member.last_name}`,
    description: member.email,
    badge: member.user_role,
  }));

  return (
    <div
      className={`rounded-lg border p-6 text-sm transition-colors duration-200 ${
        theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <h4 className={`text-sm font-medium transition-colors duration-200 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Assign Members</h4>
        {members.length > 0 && (
          <div className={`px-2 py-0.5 rounded text-xs ${
            theme === "dark" ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-500/10 text-indigo-600"
          }`}>{members.length} selected</div>
        )}
      </div>

      <SearchableCheckboxList
        items={formattedMembers}
        selectedIds={members}
        setSelectedIds={setMembers}
        searchTerm={searchTerm}
        showClearButton={false}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Select members..."
        emptyMessage="No members found"
        maxHeight={180}
        showBadges={true}
      />
    </div>
  );
}
