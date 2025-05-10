import React from "react";
import { Shield, Mail, Users, Target } from "lucide-react";
import { User, UserRole } from "@/types/user";

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
        return <Shield className="w-5 h-5" />;
      case "squad_commander":
        return <Users className="w-5 h-5" />;
      case "soldier":
        return <Target className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side */}
        <div className="space-y-4 flex-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {user.first_name} {user.last_name}
            </h1>
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className={`flex items-center gap-1.5 ${getRoleColor(user.user_role)}`}>
                {getRoleIcon(user.user_role)}
                {user.user_role.replace("_", " ")}
              </span>
              {user.registered && <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">Active</span>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            {user.team_name && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{user.team_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Avatar */}
        <div className="relative self-start md:self-auto">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[#1a1a1a] border-2 border-[#333] flex items-center justify-center">
            {getRoleIcon(user.user_role)}
          </div>
        </div>
      </div>

      {/* Team/Squad Info */}
      <div className="mt-6 pt-6 border-t border-[#333]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
            <h3 className="text-gray-400 text-sm mb-1">Squad</h3>
            <p className="text-white font-medium">{user.squad_name}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
            <h3 className="text-gray-400 text-sm mb-1">Team</h3>
            <p className="text-white font-medium">{user.team_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
