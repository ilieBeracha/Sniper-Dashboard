import { useState } from "react";
import { User } from "@/types/user";
import SearchableCheckboxList from "../SearchableCheckboxList";


type TeamMembersSectionProps = {
  teamMembers: User[];
  members: string[];
  setMembers: (ids: string[]) => void;
};

export default function TeamMembersSection({ teamMembers, members, setMembers }: TeamMembersSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const formattedMembers = teamMembers.map((member) => ({
    id: member.id,
    label: `${member.first_name} ${member.last_name}`,
    description: member.email,
    badge: member.user_role,
  }));

  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-white/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Assign Members</h3>
        {members.length > 0 && <div className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-xs">{members.length} selected</div>}
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
