import { User } from "@/types/user";
import { BiCalendar, BiMailSend } from "react-icons/bi";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div className="w-full text-white">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h2 className="text-lg font-bold">
          Welcome Back {user?.first_name} {user.last_name}
        </h2>
        <div className="relative">
          <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-[#2CB67D]/20 text-[#2CB67D] font-semibold tracking-wide">
            {user.user_role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 text-sm text-gray-300">
        <InfoRow
          icon={<BiMailSend className="text-cyan-400" />}
          label={
            <div className="flex flex-col">
              <span className="text-gray-400">Email:</span>
              <span className="text-white truncate">{user?.email}</span>
            </div>
          }
        />
        <InfoRow
          icon={<BiCalendar className="text-emerald-400" />}
          label={
            <div className="flex flex-col">
              <span className="text-gray-400">Team ID:</span>
              <span className="text-white font-medium truncate">{user.team_id}</span>
            </div>
          }
        />
        {user?.squad_id && (
          <InfoRow
            icon={<BiCalendar className="text-pink-400" />}
            label={
              <div className="flex flex-col">
                <span className="text-gray-400">Squad ID:</span>
                <span className="text-white font-medium truncate">{user.squad_id}</span>
              </div>
            }
          />
        )}
        <InfoRow
          icon={<BiCalendar className="text-yellow-400" />}
          label={
            <div className="flex flex-col">
              <span className="text-gray-400">User ID:</span>
              <span className="text-white font-medium truncate">{user.id}</span>
            </div>
          }
        />
      </div>
    </div>
  );
}

function InfoRow({ icon, label }: { icon: React.ReactNode; label: React.ReactNode }) {
  return (
    <div className="w-full flex items-start gap-4 px-4 py-3 rounded-lg">
      <div className="p-2 rounded-full bg-white/10">{icon}</div>
      <div className="flex-1 min-w-0">{label}</div>
    </div>
  );
}
