import { useStore } from "zustand";
import { useSidebarStore } from "@/store/sidebarStore";
import { List } from "lucide-react";
import { isMobile } from "react-device-detect";

export default function Header({ children, title }: { children: React.ReactNode; title?: string }) {
  const { toggleDrawer } = useStore(useSidebarStore);

  return (
    <div className="flex items-center justify-between px-2 py-4 border-b border-white/5">
      <div className="flex items-center">
        {isMobile && <List className="w-5 h-5 text-indigo-400 mr-3" onClick={toggleDrawer} />}
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
