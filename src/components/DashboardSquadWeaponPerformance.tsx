import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { performanceStore } from "@/store/performance";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Tooltip } from "recharts";

export default function DashboardSquadWeaponPerformance() {
  const { squadWeaponPerformance, getSquadWeaponPerformance, isLoading } = useStore(performanceStore);
  const { user } = useStore(userStore);
  const [activeSquad, setActiveSquad] = useState("");

  useEffect(() => {
    if (user?.team_id) {
      getSquadWeaponPerformance(user.team_id);
    }
  }, [user]);

  useEffect(() => {
    if (squadWeaponPerformance?.length > 0) {
      const squads = [...new Set(squadWeaponPerformance.map((item) => item.squad))];
      setActiveSquad(squads[0]);
    }
  }, [squadWeaponPerformance]);

  const squads = [...new Set((squadWeaponPerformance || []).map((item) => item.squad))];
  const activeSquadData = (squadWeaponPerformance || []).filter((item) => item.squad === activeSquad);

  const radarData = [
    { attribute: "Accuracy", fullMark: 100 },
    { attribute: "Hit Rate", fullMark: 100 },
    { attribute: "Total Hits", fullMark: 100 },
    { attribute: "Effective Range", fullMark: 100 },
  ];

  activeSquadData.forEach((item) => {
    const weaponKey = item.weapon_type;
    const hitRate = Math.round((item.confirmed / item.potential) * 100);

    const scaledHits = Math.min(100, item.confirmed * 5);

    const effectiveRange = weaponKey === "HTR2000" ? 85 : 65;

    radarData.forEach((dataPoint: any) => {
      if (dataPoint.attribute === "Accuracy") {
        dataPoint[weaponKey] = item.accuracy;
      } else if (dataPoint.attribute === "Hit Rate") {
        dataPoint[weaponKey] = hitRate;
      } else if (dataPoint.attribute === "Total Hits") {
        dataPoint[weaponKey] = scaledHits;
      } else if (dataPoint.attribute === "Effective Range") {
        dataPoint[weaponKey] = effectiveRange;
      }
    });
  });

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!squadWeaponPerformance?.length) {
    return (
      <div className="h-full flex flex-col justify-center items-center text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <p className="text-sm text-gray-400">No weapon performance data</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Squad Tabs */}
      <div className="flex overflow-x-auto mb-2 bg-[#1A1A1A] rounded-lg p-1 w-fit">
        {squads.map((squad) => (
          <button
            key={squad}
            onClick={() => setActiveSquad(squad)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              activeSquad === squad ? "bg-[#2A2A2A] text-white" : "text-gray-400 hover:bg-[#222]"
            }`}
          >
            {squad}
          </button>
        ))}
      </div>

      {/* Radar Chart */}
      {activeSquadData.length > 0 ? (
        <div className="flex-1 bg-[#161616] rounded-lg p-1 border border-[#333]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="attribute" tick={{ fill: "#9CA3AF", fontSize: 10 }} />

              {/* Render each weapon type */}
              {activeSquadData.map((item, index) => (
                <Radar
                  key={item.weapon_type}
                  name={item.weapon_type}
                  dataKey={item.weapon_type}
                  stroke={item.weapon_type === "HTR2000" ? "#7F5AF0" : "#2CB67D"}
                  fill={item.weapon_type === "HTR2000" ? "#7F5AF0" : "#2CB67D"}
                  fillOpacity={0.3}
                />
              ))}

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #333",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Legend
                iconSize={8}
                wrapperStyle={{
                  fontSize: "10px",
                  paddingTop: "5px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#161616] rounded-lg border border-[#333]">
          <p className="text-sm text-gray-400">No data for {activeSquad}</p>
        </div>
      )}
    </div>
  );
}
