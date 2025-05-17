import { useStore } from "zustand";
import { useSidebarStore } from "@/store/sidebarStore";
import { List } from "lucide-react";
import { isMobile } from "react-device-detect";

export default function Header({ children, title }: { children: React.ReactNode; title?: string }) {
  const { toggleDrawer } = useStore(useSidebarStore);

  return (
    <div className="flex items-center justify-between px-4 py-4 h-16 border-b border-white/5 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10  rounded-full blur-3xl" />
      </div>
      <div className="flex items-center">
        {isMobile && <List className="w-5 h-5 text-indigo-400 mr-3" onClick={toggleDrawer} />}
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
