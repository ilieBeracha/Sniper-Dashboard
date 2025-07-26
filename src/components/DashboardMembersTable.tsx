import { useTheme } from "@/contexts/ThemeContext";
import { SpTable, SpTableColumn } from "@/layouts/SpTable";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { UserRole } from "@/types/user";
import { isCommander } from "@/utils/permissions";
import { User, Shield, Users, Mail } from "lucide-react";

export default function DashboardMembersTable() {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const { members } = useStore(teamStore);

  // Filter members based on user permissions
  const dataByPermission = members.filter((member) => {
    if (isCommander(user?.user_role as UserRole)) {
      return true;
    }
    return member.squad_id === user?.squad_id;
  });

  const columns: SpTableColumn<any>[] = [
    {
      key: "name",
      label: "Member",
      render: (_value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-zinc-700" : "bg-gray-100"}`}>
            <User size={20} className={theme === "dark" ? "text-gray-300" : "text-gray-600"} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{`${row.first_name || ""} ${row.last_name || ""}`}</span>
            <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{row.id_number || "N/A"}</span>
          </div>
        </div>
      ),
      className: "min-w-[200px]",
    },
    {
      key: "email",
      label: "Contact",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Mail size={14} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
          <span className="text-sm">{value || "N/A"}</span>
        </div>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "user_role",
      label: "Role",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Shield size={14} className={theme === "dark" ? "text-blue-400" : "text-blue-600"} />
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === "Commander"
                ? theme === "dark"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-purple-100 text-purple-700 border border-purple-200"
                : value === "Squad Commander"
                  ? theme === "dark"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                  : theme === "dark"
                    ? "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
            }`}
          >
            {value || "Member"}
          </span>
        </div>
      ),
    },
  ];

  return (
    <SpTable
      className="border-0 w-full"
      data={dataByPermission}
      columns={columns}
      searchPlaceholder="Search by name, email, or ID..."
      searchFields={["first_name", "last_name", "email"]}
      //   actions={actions}
      emptyState={
        <div className={`text-center py-16 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No team members found</h3>
          <p className="text-sm">
            {isCommander(user?.user_role as UserRole)
              ? "Start by inviting members to your organization"
              : "Contact your squad commander to add members"}
          </p>
        </div>
      }
    />
  );
}
