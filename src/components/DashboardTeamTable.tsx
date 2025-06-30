import { useState } from "react";
import Checkbox from "./Checkbox";
import { BiTrash, BiDotsHorizontalRounded, BiPencil, BiTargetLock } from "react-icons/bi";
import { useStore } from "zustand";
import { teamStore } from "@/store/teamStore";
import { User } from "@/types/user";
import { isCommander } from "@/utils/permissions";
import { userStore } from "@/store/userStore";
import BaseButton from "./BaseButton";

export default function TeamTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { userRole } = useStore(userStore);
  const { members } = useStore(teamStore);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(members?.map((member: User) => member.id) || []);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((rowId) => rowId !== id) : [...prevSelected, id]));
  };

  const RoleBadge = ({ role }: { role: string }) => {
    const getBadgeColor = () => {
      switch (role) {
        case "commander":
          return "bg-green-900/30 text-green-400 border-green-900/30";
        case "squad_commander":
          return "bg-yellow-900/30 text-yellow-400 border-yellow-900/30";
        default:
          return "bg-blue-900/30 text-blue-400 border-blue-900/30";
      }
    };

    return <div className={`px-3 py-1 rounded-md text-xs sm:text-sx inline-block border ${getBadgeColor()}`}>{role}</div>;
  };

  return (
    <>
      <div className="overflow-hidden rounded-sm bg-dashboard-card text-sx text-white max-h-[400px] overflow-y-auto">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-dashboard-border">
            <thead className="bg-dashboard-card">
              <tr>
                {["ID", "Operative", "Squad", "Role", "Actions"].map((header, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs sm:text-sx font-semibold text-white/70 uppercase tracking-wider">
                    {header === "ID" ? (
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectAll} onChange={handleSelectAll} />
                        <span>{header}</span>
                      </div>
                    ) : (
                      header
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {members?.map((member: User) => {
                const rowId = member.id;
                const initials = member.first_name?.charAt(0).toUpperCase() + member.last_name?.charAt(0).toUpperCase();

                return (
                  <tr
                    key={rowId}
                    className={`transition-colors ${selectedRows.includes(rowId) ? "bg-white/10" : ""} ${
                      hoveredRow === rowId ? "bg-white/10" : "hover:bg-white/10"
                    } text-sx`}
                    onMouseEnter={() => setHoveredRow(rowId)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-dashboard-text text-sx">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedRows.includes(rowId)} onChange={() => handleRowSelect(rowId)} />
                        <span className="text-xs sm:text-sx text-gray-200">{rowId.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-dashboard-text text-sx">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white font-medium border border-white/10 text-sx sm:text-base">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-sx">
                            {member.first_name} {member.last_name}
                          </span>
                          <span className="text-dashboard-text-muted text-xs sm:text-sx">{member.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-2 whitespace-nowrap text-sx">
                      <div className="px-3 py-1 rounded-md bg-[#1E3A8A]/20 border border-[#1E3A8A]/30 text-blue-400 text-xs sm:text-sx inline-block">
                        {member?.squads?.squad_name || "Unassigned"}
                      </div>
                    </td>

                    <td className="px-6 py-2 whitespace-nowrap text-sx">
                      <RoleBadge role={member.user_role} />
                    </td>

                    <td className="px-6 py-2 whitespace-nowrap text-sx text-white">
                      {isCommander(userRole) ? (
                        <div className="flex items-center space-x-2">
                          <BaseButton onClick={() => {}} className="p-1.5 rounded-md transition-colors hover:bg-white/10">
                            <BiPencil className="text-dashboard-text-muted size-4 hover:text-blue-400" />
                          </BaseButton>
                          <BaseButton onClick={() => {}} className="p-1.5 rounded-md transition-colors hover:bg-white/10">
                            <BiTrash className="text-gray-400 size-5 hover:text-[#F25F4C]" />
                          </BaseButton>
                          <BaseButton onClick={() => {}} className="p-1.5 rounded-md transition-colors hover:bg-white/10">
                            <BiDotsHorizontalRounded className="text-dashboard-text-muted size-4 hover:text-white" />
                          </BaseButton>
                        </div>
                      ) : (
                        <span className="text-sx text-gray-500 italic">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {(!members || members.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-dashboard-text-muted text-center">
            <div className="bg-white/10 p-3 rounded-full mb-4">
              <BiTargetLock size={24} />
            </div>
            <p className="mb-2 text-sx sm:text-base">No sniper units available</p>
            <p className="text-xs sm:text-sx text-dashboard-text-soft">Deploy new units to begin tracking</p>
          </div>
        )}
      </div>
    </>
  );
}
