// Home.tsx
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import { authStore } from "../store/authStore";
import { useStore } from "zustand";
import SidebarT from "@/components/Sidebar";

export default function Home() {
  const { token } = useStore(authStore);

  return (
    <div className="flex overflow-y-auto min-h-screen w-screen">
      {token && <SidebarT />}

      <main className="flex-1 bg-[#EBEBF1] overflow-y-hidden p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
