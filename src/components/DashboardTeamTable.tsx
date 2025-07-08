import { useState } from "react";
import Checkbox from "./Checkbox";
import { BiTrash, BiDotsHorizontalRounded, BiPencil, BiTargetLock } from "react-icons/bi";
import { useStore } from "zustand";
import { teamStore } from "@/store/teamStore";
import { User } from "@/types/user";
import { isCommander } from "@/utils/permissions";
import { userStore } from "@/store/userStore";
import BaseButton from "./BaseButton";
import { useTheme } from "@/contexts/ThemeContext";

export default function DashboardTeamTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { userRole } = useStore(userStore);
  const { members } = useStore(teamStore);
  const { theme } = useTheme();

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
          return theme === "dark" 
            ? "bg-green-900/30 text-green-400 border-green-900/30"
            : "bg-green-100 text-green-700 border-green-200";
        case "squad_commander":
          return theme === "dark"
            ? "bg-yellow-900/30 text-yellow-400 border-yellow-900/30"
            : "bg-yellow-100 text-yellow-700 border-yellow-200";
        default:
          return theme === "dark"
            ? "bg-blue-900/30 text-blue-400 border-blue-900/30"
            : "bg-blue-100 text-blue-700 border-blue-200";
      }
    };

    return <div className={`px-3 py-1 rounded-md text-xs sm:text-sx inline-block border transition-colors duration-200 ${getBadgeColor()}`}>{role}</div>;
  };

  return (
    <>
      <div className={`overflow-hidden rounded-sm text-sx max-h-[400px] overflow-y-auto transition-colors duration-200 ${theme === "dark" ? "bg-dashboard-card text-white" : "bg-white text-gray-900"}`}>
        <div className="max-w-full overflow-x-auto">
          <table className={`min-w-full divide-y transition-colors duration-200 ${theme === "dark" ? "divide-dashboard-border" : "divide-gray-200"}`}>
            <thead className={`transition-colors duration-200 ${theme === "dark" ? "bg-dashboard-card" : "bg-gray-50"}`}>
              <tr>
                {["ID", "Operative", "Squad", "Role", "Actions"].map((header, i) => (
                  <th key={i} className={`px-6 py-3 text-left text-xs sm:text-sx font-semibold uppercase tracking-wider transition-colors duration-200 ${theme === "dark" ? "text-white/70" : "text-gray-700"}`}>
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

            <tbody className={`divide-y transition-colors duration-200 ${theme === "dark" ? "divide-white/10" : "divide-gray-200"}`}>
              {members?.map((member: User) => {
                const rowId = member.id;
                const initials = member.first_name?.charAt(0).toUpperCase() + member.last_name?.charAt(0).toUpperCase();
                return (
                  <tr
                    key={rowId}
                    className={`transition-colors text-sx ${
                      selectedRows.includes(rowId) 
                        ? theme === "dark" ? "bg-white/10" : "bg-blue-50"
                        : ""
                    } ${
                      hoveredRow === rowId 
                        ? theme === "dark" ? "bg-white/10" : "bg-gray-50"
                        : theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => setHoveredRow(rowId)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sx transition-colors duration-200 ${theme === "dark" ? "text-dashboard-text" : "text-gray-700"}`}>
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedRows.includes(rowId)} onChange={() => handleRowSelect(rowId)} />
                        <span className={`text-xs sm:text-sx transition-colors duration-200 ${theme === "dark" ? "text-gray-200" : "text-gray-600"}`}>{rowId.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </td>

                    <td className={`px-6 py-4 whitespace-nowrap text-sx transition-colors duration-200 ${theme === "dark" ? "text-dashboard-text" : "text-gray-700"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-medium border text-sx sm:text-base transition-colors duration-200 ${theme === "dark" ? "bg-white/5 text-white border-white/10" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-sx transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {member.first_name} {member.last_name}
                          </span>
                          <span className={`text-xs sm:text-sx transition-colors duration-200 ${theme === "dark" ? "text-dashboard-text-muted" : "text-gray-600"}`}>{member.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-2 whitespace-nowrap text-sx">
                      <div className={`px-3 py-1 rounded-md text-xs sm:text-sx inline-block transition-colors duration-200 ${theme === "dark" ? "bg-[#1E3A8A]/20 border border-[#1E3A8A]/30 text-blue-400" : "bg-blue-100 border border-blue-200 text-blue-700"}`}>
                        {member?.squads?.squad_name || "Unassigned"}
                      </div>
                    </td>

                    <td className="px-6 py-2 whitespace-nowrap text-sx">
                      <RoleBadge role={member.user_role} />
                    </td>

                    <td className={`px-6 py-2 whitespace-nowrap text-sx transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {isCommander(userRole) ? (
                        <div className="flex items-center space-x-2">
                          <BaseButton onClick={() => {}} className={`p-1.5 rounded-md transition-colors duration-200 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                            <BiPencil className={`size-4 hover:text-blue-400 transition-colors duration-200 ${theme === "dark" ? "text-dashboard-text-muted" : "text-gray-600"}`} />
                          </BaseButton>
                          <BaseButton onClick={() => {}} className={`p-1.5 rounded-md transition-colors duration-200 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                            <BiTrash className={`size-5 hover:text-[#F25F4C] transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
                          </BaseButton>
                          <BaseButton onClick={() => {}} className={`p-1.5 rounded-md transition-colors duration-200 ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                            <BiDotsHorizontalRounded className={`size-4 transition-colors duration-200 ${theme === "dark" ? "text-dashboard-text-muted hover:text-white" : "text-gray-600 hover:text-gray-900"}`} />
                          </BaseButton>
                        </div>
                      ) : (
                        <span className={`text-sx italic transition-colors duration-200 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {(!members || members.length === 0) && (
          <div className={`flex flex-col items-center justify-center py-16 text-center transition-colors duration-200 ${theme === "dark" ? "text-dashboard-text-muted" : "text-gray-600"}`}>
            <div className={`p-3 rounded-full mb-4 transition-colors duration-200 ${theme === "dark" ? "bg-white/10" : "bg-gray-100"}`}>
              <BiTargetLock size={24} />
            </div>
            <p className="mb-2 text-sx sm:text-base">No sniper units available</p>
            <p className={`text-xs sm:text-sx transition-colors duration-200 ${theme === "dark" ? "text-dashboard-text-soft" : "text-gray-500"}`}>Deploy new units to begin tracking</p>
          </div>
        )}
      </div>
    </>
  );
}
