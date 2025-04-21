import BasicTableTwo from "@/components/TeamTable";
import UserProfile from "@/components/UserProfile";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import { useStore } from "zustand";

export default function dashboard() {
  const useUserStore = useStore(userStore);

  return (
    <div className="grid grid-cols-7 grid-rows-[repeat(10,minmax(130px,1fr))] gap-6 overflow-scroll px-24 transition-all duration-300">
      <div className="col-span-2 row-span-2 bg-white rounded-md shadow-sm cursor-pointer transition-all duration-500">
        <UserProfile user={useUserStore.user as User} />
      </div>

      <div className="col-span-2 row-span-2 col-start-3 bg-white rounded-md shadow-sm"></div>

      <div className="col-span-3 row-span-4 col-start-5 bg-white rounded-md shadow-sm"></div>

      <div className="col-span-4 row-span-2 row-start-3 bg-white rounded-md shadow-sm">
        {/* Content */}
      </div>

      <div className="col-span-7 row-span-3 row-start-5 bg-white rounded-md shadow-sm">
        <BasicTableTwo />
      </div>

      <div className="col-span-5 row-span-3 row-start-8 bg-white rounded-md shadow-sm">
        6
      </div>

      <div className="col-span-2 row-span-3 col-start-6 row-start-8 bg-white rounded-md shadow-sm">
        9
      </div>
    </div>
  );
}
