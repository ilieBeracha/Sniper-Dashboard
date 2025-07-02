import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Training from "./Trainings";
import TrainingPage from "./Training";
import Assets from "./Assets";
import ErrorPage from "./404";
import { useEffect } from "react";
import { useStore } from "zustand";
import { authStore } from "@/store/authStore";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { getSquadsWithUsersByTeamId } from "@/services/squadService";
import DefaultLayout from "@/layouts/DefaultLayout";
import Ai from "./Ai";

export default function AppRoutes() {
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
    <Routes>
      {token ? (
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trainings" element={<Training />} />
          <Route path="/ai" element={<Ai />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/training/:id" element={<TrainingPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      ) : (
        <Route path="*" element={<ErrorPage />} />
      )}
    </Routes>
  );
}
