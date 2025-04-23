import { User } from "@/types/user";
import { BiCalendar, BiMailSend, BiUser } from "react-icons/bi";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div className="space-y-4 text-sm text-gray-300">
      <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-[#2CB67D]/20 text-[#2CB67D] font-semibold tracking-wide inline-block w-fit">
        {user.user_role}
      </span>

      <InfoRow
        icon={<BiUser className="h-5 w-5 text-indigo-400" />}
        label={
          <span className="font-medium text-white">
            {user?.first_name} {user.last_name}
          </span>
        }
      />
      <InfoRow
        icon={<BiMailSend className="h-5 w-5 text-cyan-400" />}
        label={<span className="text-gray-400">{user?.email}</span>}
      />
      <InfoRow
        icon={<BiCalendar className="h-5 w-5 text-emerald-400" />}
        label={
          <>
            <span className="text-gray-400">Team ID:</span>{" "}
            <span className="text-white font-medium">{user.team_id}</span>
          </>
        }
      />
      {user?.squad_id && (
        <InfoRow
          icon={<BiCalendar className="h-5 w-5 text-pink-400" />}
          label={
            <>
              <span className="text-gray-400">Squad ID:</span>{" "}
              <span className="text-white font-medium">{user?.squad_id}</span>
            </>
          }
        />
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/10 rounded-full">{icon}</div>
      <div className="text-sm leading-5">{label}</div>
    </div>
  );
}
