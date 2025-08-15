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
    <div className="space-y-4">
      {/* Performance Overview Section */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Performance Overview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Hit Percentage Card - Smaller and Sharper */}
          <BaseDashboardCard
            header="Hit Rate Analysis"
            tooltipContent="Accuracy metrics by distance, position, and weapon"
            height="h-[300px]"
            withFilter={[
              {
                label: "Distance",
                value: "distance",
                onChange: (val) => setHitPercentageDistance(val || null),
                options: [
                  { label: "All", value: "" },
                  { label: "Short", value: "short" },
                  { label: "Mid", value: "medium" },
                  { label: "Long", value: "long" },
                ],
                type: "select",
              },
              {
                label: "Position",
                value: "position",
                onChange: (val) => setHitPercentagePosition(val || null),
                options: [{ label: "All", value: "" }, ...positions.map((pos) => ({ label: formatEnumLabel(pos), value: pos }))],
                type: "select",
              },
              {
                label: "Weapon",
                value: "weapon_type",
                onChange: (val) => setHitPercentageWeaponType(val || null),
                options: [{ label: "All", value: "" }, ...weaponTypes.map((type) => ({ label: formatEnumLabel(type), value: type }))],
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

          {/* Grouping Chart - Matching Height */}
          <div className="h-[300px]">
            <DashboardGroupingChart />
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
          {isSquadCommander(user?.user_role as UserRole) ? "Team Members" : "Squad Members"}
        </h3>
        <DashboardMembersTable />
      </div>
    </div>
  );
}
