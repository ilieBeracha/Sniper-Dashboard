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
import { WaveLoader } from "@/components/ui/loader";
import Settings from "./Settings";
import { supabase } from "@/services/supabaseClient";
// import SessionStats from "./SessionStats";
// Dynamic imports for better code splitting
const Dashboard = lazy(() => import("./Dashboard"));
const Training = lazy(() => import("./Trainings"));
const TrainingPage = lazy(() => import("./Training"));
const Assets = lazy(() => import("./Assets"));
const ErrorPage = lazy(() => import("./404"));
const SessionStatsFull = lazy(() => import("./sessionStatsFull"));
const FileVault = lazy(() => import("./fileVault"));

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
      supabase.auth.admin.updateUserById(user?.id || "", {
        user_metadata: {
          team_id: user?.team_id,
          squad_id: user?.squad_id,
          user_default_duty: user?.user_default_duty,
          user_default_weapon: user?.user_default_weapon,
          user_default_equipment: user?.user_default_equipment,
          user_role: user?.user_role,
        },
      });
      if (user?.team_id && user?.squad_id) {
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

  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <WaveLoader />
    </div>
  );

  return (
    <Routes>
      {token ? (
        <Route element={<DefaultLayout />}>
          <Route
            path="/"
            element={
              <div className="w-full overflow-x-hidden">
                <Suspense fallback={<LoadingFallback />}>
                  <Dashboard />
                </Suspense>
              </div>
            }
          />
          <Route
            path="/trainings"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Training />
              </Suspense>
            }
          />

          <Route
            path="/assets"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Assets />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="/file-vault"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <FileVault />
              </Suspense>
            }
          />
          <Route
            path="/training/:id"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <TrainingPage />
              </Suspense>
            }
          />
          <Route
            path="/training/:id/session-stats-full"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SessionStatsFull />
              </Suspense>
            }
          />

          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ErrorPage />
              </Suspense>
            }
          />
        </Route>
      ) : (
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ErrorPage />
            </Suspense>
          }
        />
      )}
    </Routes>
  );
}
