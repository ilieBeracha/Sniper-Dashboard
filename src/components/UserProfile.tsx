import { User } from "@/types/user";
import { BiCalendar, BiCreditCard, BiUser } from "react-icons/bi";

export default function UserProfile({ user }: { user: User }) {
  return (
    <div className="h-full">
      <div className="h-full rounded-lg shadow-md bg-white border border-gray-100 p-6 flex flex-col space-y-4 overflow-hidden justify-around">
        <div className="flex justify-between items-center w-full">
          <h2 className="font-bold text-gray-900 text-lg truncate max-w-[70%] flex-1">
            <p>Personal Info</p>
            {user.first_name.toLocaleUpperCase()}{" "}
            {user.last_name.toLocaleUpperCase()}
          </h2>
          <span className="text-xs font-semibold tracking-wide text-yellow-800 bg-gradient-to-r from-yellow-100 to-yellow-300 px-3 py-1 rounded-full shadow-sm border border-yellow-400 whitespace-nowrap flex-shrink-0">
            {user.user_role}
          </span>
        </div>
        <div className="mt-2 pt-4  border-gray-100 w-full">
          <div className="flex items-center gap-3 text-sm text-gray-800 mb-3">
            <div className="p-2 bg-gray-50 rounded-full flex-shrink-0">
              <BiUser className="h-5 w-5" />
            </div>
            <span className="font-medium truncate">{user.email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
            <div className="p-2 bg-gray-50 rounded-full flex-shrink-0">
              <BiCalendar className="h-5 w-5" />
            </div>
            <div className="truncate">
              <span className="text-gray-500 font-bold">Team ID: </span>
              <span className="font-medium text-gray-500">{user.team_id}</span>
            </div>
          </div>

          {user.squad_id && (
            <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
              <div className="p-2 bg-gray-50 rounded-full flex-shrink-0">
                <BiCalendar className="h-5 w-5" />
              </div>
              <div className="truncate">
                <span className="text-gray-500 font-bold text-md">
                  Squad ID:
                </span>
                <span className="font-medium text-gray-500">
                  {user.squad_id}
                </span>
              </div>
            </div>
          )}

          {user.invite_code && (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="p-2 bg-gray-50 rounded-full flex-shrink-0">
                <BiCreditCard className="h-5 w-5" />
              </div>
              <div className="truncate">
                <span className="text-gray-500 font-bold text-md">
                  Invite Code:{" "}
                </span>
                <span className="font-medium text-gray-500">
                  {user.invite_code}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
