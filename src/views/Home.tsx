// Home.tsx
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Sidebar from "../components/Sidebar";
import { authStore } from "../store/authStore";
import { useStore } from "zustand";

export default function Home() {
  const { token } = useStore(authStore);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {token && <Sidebar />}

      <main className="flex-1 bg-[#EBEBF1] overflow-y-hidden p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
