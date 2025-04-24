import { User } from "@/types/user";
import { BiCalendar, BiMailSend } from "react-icons/bi";

export default function UserProfile({ user }: { user: User }) {
  return (
    <>
      <div className="flex text-white items-center gap-4 w-full mb-4">
        <h2 className="text-md  font-bold ">
          Welcome Back {user?.first_name} {user.last_name}
        </h2>
        <span className="text-xs px-3 py-1 rounded-full border border-white/10 bg-[#2CB67D]/20 text-[#2CB67D] font-semibold tracking-wide inline-block w-fit">
          {user.user_role}
        </span>
      </div>
      <div className=" text-sm text-gray-300 grid grid-cols-1 p-3 gap-6">
        {/* <div className="flex justify-between items-center col-span-2"></div> */}

        <InfoRow
          icon={<BiMailSend className=" text-cyan-400" />}
          label={<span className="text-gray-400 truncate">{user?.email}</span>}
        />
        <InfoRow
          icon={<BiCalendar className=" text-emerald-400" />}
          label={
            <div className="flex flex-col">
              <span className="text-gray-400">Team ID:</span>{" "}
              <span className="text-white font-medium truncate">
                {user.team_id}
              </span>
            </div>
          }
        />
        {user?.squad_id && (
          <InfoRow
            icon={<BiCalendar className=" text-pink-400" />}
            label={
              <div className="flex flex-col">
                <span className="text-gray-400">Squad ID:</span>{" "}
                <span className="text-white font-medium truncate">
                  {user.squad_id}
                </span>
              </div>
            }
          />
        )}
        <InfoRow
          icon={<BiCalendar className=" text-yellow-400" />}
          label={
            <div className="flex flex-col">
              <span className="text-gray-400">User ID:</span>{" "}
              <span className="text-white font-medium truncate">{user.id}</span>
            </div>
          }
        />
      </div>
    </>
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
      <div className="text-sm leading-5 truncate">{label}</div>
    </div>
  );
}
