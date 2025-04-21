import { User } from "@/types/user";
import { BiCalendar, BiCreditCard, BiMailSend, BiUser } from "react-icons/bi";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div className="h-full">
      <div className="h-full rounded-xl bg-[#0e0e0e] shadow-lg p-6 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-gray-400 mb-4">Personal Info</h2>
          <span className="text-sm font-semibold tracking-wide text-yellow-800 bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 px-3 py-1 rounded-full shadow border border-yellow-400 whitespace-nowrap">
            {user.user_role}
          </span>
        </div>

        {/* Info rows */}
        <div className="space-y-4 text-sm text-gray-400">
          <InfoRow
            icon={<BiUser className="h-5 w-5 text-indigo-500" />}
            label={`${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}`}
          />
          <InfoRow
            icon={<BiMailSend className="h-5 w-5 text-blue-500" />}
            label={user.email}
          />
          <InfoRow
            icon={<BiCalendar className="h-5 w-5 text-emerald-500" />}
            label={
              <>
                <span className="font-bold text-gray-400">Team ID:</span>{" "}
                {user.team_id}
              </>
            }
          />
          {user.squad_id && (
            <InfoRow
              icon={<BiCalendar className="h-5 w-5 text-teal-500" />}
              label={
                <>
                  <span className="font-bold text-gray-400">Squad ID:</span>{" "}
                  {user.squad_id}
                </>
              }
            />
          )}
          {user.invite_code && (
            <InfoRow
              icon={<BiCreditCard className="h-5 w-5 text-pink-500" />}
              label={
                <>
                  <span className="font-bold text-gray-400">Invite Code:</span>{" "}
                  {user.invite_code}
                </>
              }
            />
          )}
        </div>
      </div>
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
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <div className="truncate font-medium">{label}</div>
    </div>
  );
}
