import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import { authStore } from "../store/authStore";
import { useStore } from "zustand";
import SidebarT from "@/components/Sidebar";
import ErrorPage from "./404";
import Training from "./Training";

export default function Home() {
  const { token } = useStore(authStore);

  return (
    <div className="flex w-screen">
      {token && <SidebarT />}

      <main className="flex-1  overflow-y-hidden ">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/training" element={<Training />}></Route>
          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
      </main>
    </div>
  );
}
