import { User } from "@/types/user";
import { BiCalendar, BiCreditCard, BiUser } from "react-icons/bi";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div className=" h-full">
      <div className="h-full rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold text-gray-800">
            {user.first_name} {user.last_name}
          </p>
          <span className="text-xs font-medium text-yellow-500 bg-gray-500 px-2 py-1 rounded-md ring-1 ring-inset ring-blue-600/20">
            {user.user_role}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-800">
          <BiUser className="h-5 w-5 text-gray-400" />
          <span>{user.email}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <BiCalendar className="h-5 w-5 text-gray-400" />
          <span>
            <span className="text-gray-600 text-xl">Team ID: </span>
            {user.team_id}
          </span>
        </div>

        {user.squad_id && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <BiCalendar className="h-5 w-5 text-gray-400" />
            <span>
              <span className="text-gray-600 text-xl">Squad ID: </span>
              {user.squad_id}
            </span>
          </div>
        )}

        {user.invite_code && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <BiCreditCard className="h-5 w-5 text-gray-400" />
            <span>
              <span className="text-gray-600 text-xl">Invite Code: </span>
              {user.invite_code}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
