import { User } from "@/types/user";
import { BiCalendar, BiMailSend, BiUser, BiGroup } from "react-icons/bi";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div className="w-full text-white flex">
      <div className="w-full text-white flex flex-col gap-4">
        <div className="flex items-center justify-between  gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold">
              Welcome Back {user?.first_name} {user.last_name}
            </h2>
            <p className="text-sm text-gray-400 mt-1">View and manage your profile information</p>
          </div>
          <div className="relative">
            <span className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-[#2CB67D]/20 text-[#2CB67D] font-semibold tracking-wide">
              {user.user_role}
            </span>
          </div>
        </div>

        {(!user?.squad_id || !user?.team_id) && (
          <div className="grid grid-cols-1 gap-1 text-sm">
            <InfoRow
              icon={<BiMailSend className="text-cyan-400" />}
              label={
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Email</span>
                  <span className="text-white text-sm font-medium truncate">{user?.email}</span>
                </div>
              }
            />
            <InfoRow
              icon={<BiGroup className="text-emerald-400" />}
              label={
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Team ID</span>
                  <span className="text-white text-sm font-medium truncate">{user?.team_id}</span>
                </div>
              }
            />
            {user?.squad_id && (
              <InfoRow
                icon={<BiCalendar className="text-pink-400" />}
                label={
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Squad ID</span>
                    <span className="text-white text-sm font-medium truncate">{user?.squad_id}</span>
                  </div>
                }
              />
            )}
            <InfoRow
              icon={<BiUser className="text-yellow-400" />}
              label={
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">User ID</span>
                  <span className="text-white text-sm font-medium truncate">{user.id}</span>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label }: { icon: React.ReactNode; label: React.ReactNode }) {
  return (
    <div className="w-full flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="p-1.5 rounded-full bg-white/10">{icon}</div>
      <div className="flex-1 min-w-0">{label}</div>
    </div>
  );
}
