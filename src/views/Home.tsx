import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import { authStore } from "../store/authStore";
import { useStore } from "zustand";
import SidebarT from "@/components/Sidebar";
import ErrorPage from "./404";
import Training from "./Trainings";
import { useEffect } from "react";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import TrainingPage from "./Training";
import { squadStore } from "@/store/squadStore";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { getSquadsWithUsersByTeamId } from "@/services/squadService";
import Assets from "./Assets";
import { isMobile } from "react-device-detect";

export default function Home() {
  const { token } = useStore(authStore);
  const useUserStore = useStore(userStore);
  const { fetchMembers } = useStore(teamStore);
  const { getSquadUsersBySquadId } = useStore(squadStore);
  const { getWeapons } = useStore(weaponsStore);
  const { getEqipmentsByTeamId } = useStore(equipmentStore);
  const user = useUserStore.user;

  useEffect(() => {
    const load = async () => {
      if (user?.team_id) {
        await fetchMembers(user.team_id);
        await getEqipmentsByTeamId(user.team_id);
        await getWeapons(user.team_id);
        await getSquadsWithUsersByTeamId(user.team_id);

        if (user?.squad_id) {
          await getSquadUsersBySquadId(user.squad_id);
        }
      }
    };

    load();
  }, []);

  return (
    <div className={`flex w-screen ${isMobile ? "flex-col" : "flex-row"}`}>
      {token && <SidebarT />}

      <main className="flex-1 overflow-y-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/training" element={<Training />}></Route>
          <Route path="/assets" element={<Assets />}></Route>
          <Route path="/training/:id" element={<TrainingPage />}></Route>
          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
      </main>
    </div>
  );
}
