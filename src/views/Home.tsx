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
import Assets from "./Assets";
// import SessionStats from "./SessionStats";
// Dynamic imports for better code splitting
const Dashboard = lazy(() => import("./Dashboard"));
const Training = lazy(() => import("./Trainings"));
const TrainingPage = lazy(() => import("./Training"));
const ErrorPage = lazy(() => import("./404"));
const SessionStatsFull = lazy(() => import("./sessionStatsFull"));
const SettingsPage = lazy(() => import("./Settings"));
const DataExport = lazy(() => import("./DataExport"));
const RulesLayout = lazy(() => import("@/layouts/Rulelayout"));
const Rules = lazy(() => import("@/RulesModel/views/Rules"));

export default function AppRoutes() {
  const { token } = useStore(authStore);
  const { fetchMembers } = useStore(teamStore);
  const { getSquadUsersBySquadId } = useStore(squadStore);
  const { getWeapons } = useStore(weaponsStore);
  const { getEquipments } = useStore(equipmentStore);
  const { user } = useStore(userStore);

  useEffect(() => {
    const load = async () => {
      if (user?.team_id && user?.squad_id) {
        await fetchMembers(user.team_id);
        await getSquadsWithUsersByTeamId(user.team_id);
        await getEquipments(user.team_id);
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
    <div className="flex items-center h-screen justify-center bg-transparent">
      <WaveLoader />
    </div>
  );

  return (
    <Routes>
      {token ? (
        <>
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
                  <SettingsPage />
                </Suspense>
              }
            />
            <Route
              path="/data-export"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <DataExport />
                </Suspense>
              }
            />
            <Route
              path="/file-vault"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Rules />
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
              path="/training/:id/session-stats-full/:sessionId?"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <SessionStatsFull />
                </Suspense>
              }
            />
            <Route
              path="/rules"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Rules />
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
          <Route path="/rules" element={<RulesLayout />}>
            <Route path="/rules" element={<Rules />} />
          </Route>
        </>
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
