import { useState } from "react";
import Checkbox from "./Checkbox";
import {
  BiTrash,
  BiDotsHorizontalRounded,
  BiPencil,
  BiTargetLock,
} from "react-icons/bi";
import { useStore } from "zustand";
import { teamStore } from "@/store/teamStore";
import { User } from "@/types/user";

export default function TeamTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  // Calculation for operational metrics
  const getAccuracyRating = (id: string) => {
    // Simulating accuracy ratings based on user ID
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.min(98, Math.max(78, (hash % 20) + 78)).toFixed(1); // Range 78-98%
  };

  const getMissionsCompleted = (id: string) => {
    // Simulating missions based on user ID
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.floor((hash % 150) + 20); // Range 20-170
  };

  // Custom role badge component
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

    return (
      <div
        className={`px-3 py-1 rounded-md text-xs inline-block border ${getBadgeColor()}`}
      >
        {role}
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center "></div>
      <div className="overflow-hidden rounded-xl  bg-dashboard-card">
        {selectedRows.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-white/5 border-b border-dashboard-border">
            <span className="text-sm text-dashboard-text-muted">
              {selectedRows.length}{" "}
              {selectedRows.length === 1 ? "unit" : "units"} selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 bg-[#F25F4C]/10 hover:bg-[#F25F4C]/20 text-[#F25F4C] rounded-md text-xs flex items-center">
                <BiTrash className="mr-1.5" /> Remove
              </button>
            </div>
          </div>
        )}

        <div className="max-w-full overflow-x-auto ">
          <table className="min-w-full divide-y divide-dashboard-border">
            <thead className="bg-dashboard-card ">
              <tr>
                {[
                  "ID",
                  "Operative",
                  "Squad",
                  "Role",
                  "Accuracy",
                  "Missions",
                  "Actions",
                ].map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-semibold text-white/70 uppercase tracking-wider bg-white/5"
                  >
                    {header === "ID" ? (
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                        <span>{header}</span>
                      </div>
                    ) : (
                      header
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-dashboard-card divide-y divide-white/10">
              {members?.map((member: User) => {
                const rowId = member.id;
                const initials =
                  member.first_name?.charAt(0).toUpperCase() +
                  member.last_name?.charAt(0).toUpperCase();

                const accuracy = getAccuracyRating(rowId);
                const missions = getMissionsCompleted(rowId);

                const getAccuracyColor = (acc: number) => {
                  if (acc >= 95)
                    return "text-dashboard-accent-green bg-[#2CB67D]/10";
                  if (acc >= 85)
                    return "text-dashboard-accent-purple bg-[#7F5AF0]/10";
                  return "text-[#FF8906] bg-[#FF8906]/10";
                };

                return (
                  <tr
                    key={rowId}
                    className={`transition-colors ${
                      selectedRows.includes(rowId) ? "bg-white/10" : ""
                    } ${
                      hoveredRow === rowId ? "bg-white/10" : "hover:bg-white/10"
                    }`}
                    onMouseEnter={() => setHoveredRow(rowId)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-dashboard-text">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedRows.includes(rowId)}
                          onChange={() => handleRowSelect(rowId)}
                        />
                        <span className="text-xs text-gray-200">
                          {rowId.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-dashboard-text">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white font-medium border border-white/10">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-white text-sm">
                            {member.first_name} {member.last_name}
                          </span>
                          <span className="text-dashboard-text-muted text-xs">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="px-3 py-1 rounded-md bg-[#1E3A8A]/20 border border-[#1E3A8A]/30 text-blue-400 text-xs inline-block">
                        {member?.squads?.squad_name || "Unassigned"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={member.user_role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`px-3 py-1 rounded-md text-xs inline-block ${getAccuracyColor(
                          parseFloat(accuracy)
                        )}`}
                      >
                        {accuracy}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-dashboard-text">
                      {missions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 rounded-md transition-colors hover:bg-white/10">
                          <BiPencil className="text-dashboard-text-muted size-4 hover:text-blue-400" />
                        </button>
                        <button className="p-1.5 rounded-md transition-colors hover:bg-white/10">
                          <BiTrash className="text-gray-400 size-5 hover:text-[#F25F4C]" />
                        </button>
                        <button className="p-1.5 rounded-md transition-colors hover:bg-white/10">
                          <BiDotsHorizontalRounded className="text-dashboard-text-muted size-4 hover:text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {(!members || members.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 text-dashboard-text-muted">
            <div className="bg-white/10 p-3 rounded-full mb-4">
              <BiTargetLock size={24} />
            </div>
            <p className="mb-2">No sniper units available</p>
            <p className="text-sm text-dashboard-text-soft">
              Deploy new units to begin tracking
            </p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-dashboard-border flex justify-between items-center bg-dashboard-card">
          <div className="text-sm text-dashboard-text-muted">
            Showing{" "}
            <span className="font-medium text-dashboard-text">
              {members?.length || 0}
            </span>{" "}
            units
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-dashboard-text-muted rounded-md text-xs">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-gradient-to-r from-dashboard-accent-purple to-dashboard-accent-green hover:opacity-90 text-white rounded-md text-xs">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
