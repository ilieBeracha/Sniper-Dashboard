import { BiChevronRight } from "react-icons/bi";
import { useStore } from "zustand";
import { useSidebarStore } from "@/store/sidebarStore";
import { isMobile } from "react-device-detect";

export default function Header({ children }: { children: React.ReactNode }) {
  const { toggleDrawer } = useStore(useSidebarStore);

  return (
    <div className=" mb-2 w-full flex md:flex-row md:items-center md:justify-end gap-2 justify-center">
      {isMobile && (
        <button className=" z-50 p-2 bg-[#1E1E1E] rounded-lg text-white" onClick={() => toggleDrawer()}>
          <BiChevronRight className="w-6 h-6" />
        </button>
      )}
      <div className="flex space-x-4 w-full justify-end items-center">{children}</div>
    </div>
  );
}
