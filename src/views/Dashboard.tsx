import TeamTable from "@/components/TeamTable";
import UserProfile from "@/components/UserProfile";
import { userStore } from "@/store/userStore";
import { User } from "@/types/user";
import { useStore } from "zustand";

export default function dashboard() {
  const useUserStore = useStore(userStore);
  return (
    <div className="grid grid-cols-6 grid-rows-7 gap-6 h-full">
      <div className="col-span-2 row-span-2 col-start-1 row-start-1 bg-white rounded-md shadow-sm ">
        <UserProfile user={useUserStore.user as User} />
      </div>
      <div className="col-start-5 row-start-1 bg-white rounded-md shadow-sm "></div>
      <div className="col-span-2 col-start-3 row-start-2 bg-white rounded-md shadow-sm "></div>
      <div className="col-span-2 col-start-3 row-start-1 bg-white rounded-md shadow-sm"></div>
      <div className="col-start-5 row-start-2 bg-white rounded-md shadow-sm "></div>
      <div className="col-start-6 row-start-1 bg-white rounded-md shadow-sm "></div>
      <div className="col-start-6 row-start-2 bg-white rounded-md shadow-sm "></div>
      <div className="col-span-3 row-span-2 col-start-1 row-start-3 bg-white rounded-md shadow-sm "></div>
      <div className="col-span-3 row-span-2 col-start-4 row-start-3 bg-white rounded-md shadow-sm "></div>
      <div className="col-span-6 row-span-3 col-start-1 row-start-5 bg-white rounded-md shadow-sm ">
        <TeamTable />
      </div>
    </div>
  );
}
