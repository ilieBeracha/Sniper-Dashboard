import { Outlet } from "react-router-dom";
import { isMobile } from "react-device-detect";
import Sidebar from "@/components/Sidebar";

export default function DefaultLayout() {
  return (
    <div className={`flex w-screen ${isMobile ? "flex-col" : "flex-row"} dark:bg-boxdark-2 dark:text-bodydark`}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className=" p-4 md:p-6 2xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
