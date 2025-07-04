import { Shield, Mail, Users, Target } from "lucide-react";
import { User, UserRole } from "@/types/user";
import { isMobile } from "react-device-detect";
import { useTheme } from "@/contexts/ThemeContext";

export default function DashboardWelcome({ user }: { user: User }) {
  if (!user) return null;
  const { theme } = useTheme();
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
    <div className="p-6 rounded-xl">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="space-y-3 flex-1">
          <div className="space-y-1">
            <h2 className={`text-xl font-bold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)} {user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1)}
            </h2>
            <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          </div>

          {/* Role and Status */}
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-200 ${
                theme === "dark" ? "bg-[#2A2A2A] border-[#333]" : "bg-gray-100 border-gray-300"
              } ${getRoleColor(user.user_role)}`}
            >
              {getRoleIcon(user.user_role)}
              <span className="text-sm font-medium">
                {user.user_role
                  .replace("_", " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </div>
            {user.registered && (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Active
              </span>
            )}
          </div>
        </div>

        {/* Avatar */}
        {!isMobile && (
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">
                {user.first_name.charAt(0).toUpperCase()}
                {user.last_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors duration-200 ${
                theme === "dark" ? "bg-[#1a1a1a] border-[#333]" : "bg-white border-gray-300"
              } ${getRoleColor(user.user_role)}`}
            >
              {getRoleIcon(user.user_role)}
            </div>
          </div>
        )}
      </div>

      {/* Team/Squad Info */}
      {user.team_name && (
        <div className={`mt-4 pt-4 border-t transition-colors duration-200 ${theme === "dark" ? "border-[#333]" : "border-gray-200"}`}>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              <Users className="w-4 h-4 text-blue-400" />
              <span className="font-medium">Team:</span>
              <span>{user.team_name}</span>
            </div>
            {user.squad_name && (
              <div
                className={`flex items-center gap-2 text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                <Target className="w-4 h-4 text-yellow-400" />
                <span className="font-medium">Squad:</span>
                <span>{user.squad_name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
