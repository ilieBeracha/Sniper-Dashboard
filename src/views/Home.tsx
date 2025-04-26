import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import { authStore } from "../store/authStore";
import { useStore } from "zustand";
import SidebarT from "@/components/Sidebar";
import ErrorPage from "./404";
import Training from "./Training";
import { useEffect } from "react";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import TrainingPage from "./TrainingPage";

export default function Home() {
  const { token } = useStore(authStore);
  const useUserStore = useStore(userStore);
  const { fetchMembers } = useStore(teamStore);

  const user = useUserStore.user;

  useEffect(() => {
    const load = async () => {
      if (user?.team_id) {
        await fetchMembers(user.team_id);
      }
    };

    load();
  }, []);

  return (
    <div className="flex w-screen">
      {token && <SidebarT />}

      <main className="flex-1  overflow-y-hidden ">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/training" element={<Training />}></Route>
          <Route path="/training/:id" element={<TrainingPage />}></Route>
          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
      </main>
    </div>
  );
}
