import { useMemo } from "react";
import { useStore } from "zustand";
import { teamStore } from "@/store/teamStore";
import { User } from "@/types/user";
import { isCommander } from "@/utils/permissions";
import { userStore } from "@/store/userStore";
import { useTheme } from "@/contexts/ThemeContext";
import { UserRole } from "@/types/user";
import { SpTable, SpTableColumn, SpTableFilter } from "@/layouts/SpTable";
import { Edit, Trash2, MoreHorizontal, Target, Search } from "lucide-react";

export default function DashboardTeamTable() {
  const { user } = useStore(userStore);
  const { members } = useStore(teamStore);
  const { theme } = useTheme();

  // Filter out members without IDs for SpTable compatibility
  const membersWithIds = members?.filter((member): member is User & { id: string } => Boolean(member.id)) || [];

  // Get unique roles for filter
  const uniqueRoles = useMemo(() => {
    const roles = membersWithIds.map((member) => member.user_role).filter(Boolean);
    return [...new Set(roles)];
  }, [membersWithIds]);

  // Get unique squads for filter
  const uniqueSquads = useMemo(() => {
    const squads = membersWithIds.map((member) => member.squads?.squad_name).filter(Boolean);
    return [...new Set(squads)];
  }, [membersWithIds]);

  const columns: SpTableColumn<User>[] = [
    {
      key: "id",
      label: "ID",
      render: (value: string) => (
        <span className={`text-xs sm:text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-200" : "text-gray-600"}`}>
          {value.slice(0, 8).toUpperCase()}
        </span>
      ),
      className: "px-4 py-3",
    },
    {
      key: "first_name",
      label: "Operative",
      render: (_value: string, row: User) => {
        const initials = (row?.first_name?.charAt(0) || "?").toUpperCase() + (row?.last_name?.charAt(0) || "?").toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center font-medium border text-xs sm:text-base transition-colors duration-200 ${theme === "dark" ? "bg-white/5 text-white border-white/10" : "bg-gray-100 text-gray-700 border-gray-200"}`}
            >
              {initials}
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {row?.first_name || "Unknown"} {row?.last_name || "User"}
              </span>
              <span
                className={`text-xs sm:text-xs transition-colors duration-200 ${theme === "dark" ? "text-dashboard-text-muted" : "text-gray-600"}`}
              >
                {row?.email}
              </span>
            </div>
          </div>
        );
      },
      className: "px-4 py-3",
    },
    {
      key: "squads",
      label: "Squad",
      render: (value: any) => (
        <div
          className={`px-3 py-1 rounded-md text-xs sm:text-xs inline-block transition-colors duration-200 ${theme === "dark" ? "bg-[#1E3A8A]/20 border border-[#1E3A8A]/30 text-blue-400" : "bg-blue-100 border border-blue-200 text-blue-700"}`}
        >
          {value?.squad_name || "Unassigned"}
        </div>
      ),
      className: "px-4 py-3",
    },
    {
      key: "user_role",
      label: "Role",
      render: (value: string) => {
        const getBadgeColor = () => {
          switch (value) {
            case "commander":
              return theme === "dark" ? "bg-green-900/30 text-green-400 border-green-900/30" : "bg-green-100 text-green-700 border-green-200";
            case "squad_commander":
              return theme === "dark" ? "bg-yellow-900/30 text-yellow-400 border-yellow-900/30" : "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
              return theme === "dark" ? "bg-blue-900/30 text-blue-400 border-blue-900/30" : "bg-blue-100 text-blue-700 border-blue-200";
          }
        };
        return (
          <div className={`px-3 py-1 rounded-4xl text-xs sm:text-xs inline-block border transition-colors duration-200 ${getBadgeColor()}`}>
            {value}
          </div>
        );
      },
      className: "px-4 py-3",
    },
  ];

  const filters = [
    {
      key: "user_role",
      label: "All Roles",
      type: "select" as const,
      options: uniqueRoles.map((role) => ({ value: role, label: role })),
    },
    {
      key: "squads.squad_name",
      label: "All Squads",
      type: "select" as const,
      options: uniqueSquads.map((squad) => ({ value: squad, label: squad })),
    },
  ];

  const actions = (member: User) => {
    if (!isCommander(user?.user_role as UserRole)) {
      return null;
    }

    return (
      <div className="inline-flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`p-2 rounded hover:bg-amber-100 dark:hover:bg-amber-800/40 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}
          title="Edit"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`p-2 rounded hover:bg-red-100 dark:hover:bg-red-800/40 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800/40 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          title="More Options"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    );
  };

  if (membersWithIds.length === 0) {
    return (
      <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium ">No sniper units available</h3>
        <p className="text-sm">Deploy new units to begin tracking</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[600px]">
      <SpTable
        data={membersWithIds}
        className="bg-transparent"
        columns={columns}
        filters={filters as SpTableFilter[]}
        searchPlaceholder="Search by name, email, or role..."
        searchFields={["first_name", "last_name", "email", "user_role"]}
        actions={actions}
        emptyState={
          <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No team members match your filters</h3>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        }
      />
    </div>
  );
}
