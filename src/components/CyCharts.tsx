import BaseDashboardCard from "./base/BaseDashboardCard";
import UserHitPercentage from "./DashboardUserHitPercentage";
import { WaveLoader } from "./ui/loader";
import { useEffect, useState } from "react";
import { getEnumValues } from "@/services/supabaseEnums";
import DashboardMembersTable from "./DashboardMembersTable";
import DashboardGroupingChart from "./DashboardGroupingChart";
import { isSquadCommander } from "@/utils/permissions";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { UserRole } from "@/types/user";

const formatEnumLabel = (value: string) =>
  value
    .replace(/_/g, " ") // snake_case → space
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase → space
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters

export default function DashboardSquadProgress({ loading }: { loading: boolean }) {
  const { user } = useStore(userStore);
  const [weaponTypes, setWeaponTypes] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  // UserHitPercentage filters
  const [hitPercentageDistance, setHitPercentageDistance] = useState<string | null>(null);
  const [hitPercentagePosition, setHitPercentagePosition] = useState<string | null>(null);
  const [hitPercentageWeaponType, setHitPercentageWeaponType] = useState<string | null>(null);

  // Fetch enum options on mount
  useEffect(() => {
    (async () => {
      const weaponsEnums = await getEnumValues("weapon_names");
      const positionsEnums = await getEnumValues("positions");

      setWeaponTypes(weaponsEnums);
      setPositions(positionsEnums);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <WaveLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg ">
      <div className="flex flex-col gap-2 text-lg pt-2 pb-1">Overall Performance</div>
      <div className="grid grid-cols-1 gap-3">
        {/* Performance Overview - Full Width */}
        <div className="w-full col-span-full">
          <BaseDashboardCard
            header="Performance Overview"
            tooltipContent="Current performance metrics"
            withFilter={[
              {
                label: "Distance",
                value: "distance",
                onChange: (val) => {
                  setHitPercentageDistance(val || null);
                },
                options: [
                  { label: "All Distances", value: "" },
                  { label: "Short (0-300m)", value: "short" },
                  { label: "Mid (300-600m)", value: "medium" },
                  { label: "Long (600-900m)", value: "long" },
                ],
                type: "select",
              },
              {
                label: "Position",
                value: "position",
                onChange: (val) => {
                  setHitPercentagePosition(val || null);
                },
                options: [{ label: "All Positions", value: "" }, ...positions.map((pos) => ({ label: formatEnumLabel(pos), value: pos }))],
                type: "select",
              },
              {
                label: "Weapon Type",
                value: "weapon_type",
                onChange: (val) => {
                  setHitPercentageWeaponType(val || null);
                },
                options: [{ label: "All Weapons", value: "" }, ...weaponTypes.map((type) => ({ label: formatEnumLabel(type), value: type }))],
                type: "select",
              },
            ]}
            onClearFilters={() => {
              setHitPercentageDistance(null);
              setHitPercentagePosition(null);
              setHitPercentageWeaponType(null);
            }}
            currentFilterValues={{
              distance: hitPercentageDistance || "",
              position: hitPercentagePosition || "",
              weapon_type: hitPercentageWeaponType || "",
            }}
          >
            <UserHitPercentage distance={hitPercentageDistance} position={hitPercentagePosition} weaponType={hitPercentageWeaponType} />
          </BaseDashboardCard>
        </div>
        
        {/* Other charts in a grid below */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          <div className="grid grid-cols-1 gap-3 lg:col-span-1 xl:col-span-2">
            <DashboardGroupingChart />
          </div>
          <div className="grid grid-cols-1 gap-3 lg:col-span-1 xl:col-span-1">
            {isSquadCommander(user?.user_role as UserRole) ? (
              <div className="flex flex-col gap-4 text-2xl">Team Members</div>
            ) : (
              <div className="flex flex-col gap-4 text-2xl ">Squad Members</div>
            )}
          </div>
        </div>
        
        {/* Members table - full width */}
        <div className="w-full col-span-full">
          <DashboardMembersTable />
        </div>
      </div>
    </div>
  );
}
