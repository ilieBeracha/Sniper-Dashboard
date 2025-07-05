import { Route, Routes } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useStore } from "zustand";
import { authStore } from "@/store/authStore";
import { userStore } from "@/store/userStore";
import { teamStore } from "@/store/teamStore";
import { squadStore } from "@/store/squadStore";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { getSquadsWithUsersByTeamId } from "@/services/squadService";
import DefaultLayout from "@/layouts/DefaultLayout";
import { Loader2 } from "lucide-react";

// Dynamic imports for better code splitting
const Dashboard = lazy(() => import("./Dashboard"));
const Training = lazy(() => import("./Trainings"));
const TrainingPage = lazy(() => import("./Training"));
const Assets = lazy(() => import("./Assets"));
const ErrorPage = lazy(() => import("./404"));
const Ai = lazy(() => import("./Ai"));

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

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading...</span>
      </div>
    </div>
  );

  return (
    <Routes>
      {token ? (
        <Route element={<DefaultLayout />}>
          <Route path="/" element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="/trainings" element={
            <Suspense fallback={<LoadingFallback />}>
              <Training />
            </Suspense>
          } />
          <Route path="/ai" element={
            <Suspense fallback={<LoadingFallback />}>
              <Ai />
            </Suspense>
          } />
          <Route path="/assets" element={
            <Suspense fallback={<LoadingFallback />}>
              <Assets />
            </Suspense>
          } />
          <Route path="/training/:id" element={
            <Suspense fallback={<LoadingFallback />}>
              <TrainingPage />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<LoadingFallback />}>
              <ErrorPage />
            </Suspense>
          } />
        </Route>
      ) : (
        <Route path="*" element={
          <Suspense fallback={<LoadingFallback />}>
            <ErrorPage />
          </Suspense>
        } />
      )}
    </Routes>
  );
}
