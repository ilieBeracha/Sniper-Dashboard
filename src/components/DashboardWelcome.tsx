import { Shield, Mail, Users, Target } from "lucide-react";
import { User, UserRole } from "@/types/user";
import { isMobile } from "react-device-detect";

export default function DashboardWelcome({ user }: { user: User }) {
  if (!user) return null;
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "commander":
        return "text-red-400";
      case "squad_commander":
        return "text-yellow-400";
      case "soldier":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "commander":
        return <Shield className="w-4 h-4" />;
      case "squad_commander":
        return <Users className="w-4 h-4" />;
      case "soldier":
        return <Target className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 sm:p-3 md:px-4">
      <div className="flex md:items-center md:justify-between gap-2">
        {/* Left Side */}
        <div className="space-y-2 flex-1">
          <div>
            <p className="text-lg font-bold text-white mb-0.5">
              {user.first_name} {user.last_name}
            </p>
          </div>

          <div className="flex flex-col gap-1 text-gray-400 text-xs">
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Avatar */}
        {isMobile ? (
          <></>
        ) : (
          <div className="relative self-start md:self-auto">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                {user.first_name.charAt(0)}
                {user.last_name.charAt(0)}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-md bg-[#1a1a1a]  flex items-center justify-center">
              {getRoleIcon(user.user_role)}
            </div>
          </div>
        )}
      </div>

      {/* Team/Squad Info */}
      <div className="mt-3  flex flex-col sm:flex-row pt-3 border-t border-[#333] gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 flex-wrap">
            <span className={`flex items-center gap-1 ${getRoleColor(user.user_role)}`}>
              {getRoleIcon(user.user_role)}
              {user.user_role.replace("_", " ")}
            </span>
            {user.registered && <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full text-xs">Active</span>}
          </div>
          {user.team_name && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <p>{user.team_name}</p>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <p>{user.squad_name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
