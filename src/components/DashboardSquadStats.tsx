import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useStore } from "zustand";
import { useState, useEffect } from "react";
import BaseModal from "@/components/BaseModal";
import { Info } from "lucide-react";
import { squadStore } from "@/store/squadStore";
import { SquadStats } from "@/types/performance";
import { ScorePosition } from "@/types/training";
import { getSquadStatByTeamId } from "@/services/performance";
import { userStore } from "@/store/userStore";
import BaseDashboardCard from "./BaseDashboardCard";
interface SquadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  squadData: any;
}

const SquadDetailModal = ({ isOpen, onClose, squadData }: SquadDetailModalProps) => {
  const { squadUsers } = useStore(squadStore);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedDuty, setSelectedDuty] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<ScorePosition | null>(null);
  const { user } = useStore(userStore);

  useEffect(() => {
    if (selectedUserId && selectedDuty) {
      getSquadStatByTeamId(user?.team_id as string, selectedPosition);
    }
  }, [selectedPosition]);

  const handleFilterChange = (position: ScorePosition) => {
    setSelectedPosition(position);
    getSquadStatByTeamId(user?.team_id as string, position);
  };

  const dutyConfigurations = {
    "2S2P": {
      name: "2 Snipers + 2 Spotters",
      performance: 95,
      accuracy: 92,
      coordination: 98,
      firstShot: 87,
      reactionTime: 1.2,
      coverage: 85,
      teamwork: 96,
      pros: ["Excellent coordination", "Balanced firepower", "Better target acquisition"],
      cons: ["Limited firepower", "Requires good communication"],
    },
    "3S1P": {
      name: "3 Snipers + 1 Spotter",
      performance: 88,
      accuracy: 89,
      coordination: 82,
      firstShot: 85,
      reactionTime: 1.5,
      coverage: 75,
      teamwork: 78,
      pros: ["High firepower", "Multiple engagement capability", "Good for static targets"],
      cons: ["Limited spotting", "Reduced coordination", "Slower target acquisition"],
    },
    "1S3P": {
      name: "1 Sniper + 3 Spotters",
      performance: 82,
      accuracy: 96,
      coordination: 90,
      firstShot: 92,
      reactionTime: 0.9,
      coverage: 95,
      teamwork: 88,
      pros: ["Excellent reconnaissance", "Fast target acquisition", "High accuracy support"],
      cons: ["Limited firepower", "Single point of failure", "Vulnerable to counter-fire"],
    },
    "4S0P": {
      name: "4 Snipers Only",
      performance: 75,
      accuracy: 82,
      coordination: 68,
      firstShot: 78,
      reactionTime: 2.1,
      coverage: 60,
      teamwork: 65,
      pros: ["Maximum firepower", "Independent operation", "Multiple simultaneous engagements"],
      cons: ["Poor coordination", "Slow target acquisition", "No dedicated support"],
    },
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} width="max-w-6xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-700 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{squadData?.squad_name} - Duty Configuration Analysis</h2>
            <p className="text-zinc-400 mt-1">Compare different role assignments and their impact on squad performance</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-end mb-6">
          {/* User Select */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Filter by User</label>
            <select
              onChange={(e) => {
                setSelectedUserId(e.target.value || null);
                getSquadStatByTeamId(user?.team_id as string, selectedPosition);
              }}
              className="bg-zinc-900 text-white text-sm px-3 py-2 rounded-md border border-zinc-700 focus:outline-none"
            >
              <option value="">All Users</option>
              {squadUsers?.[0]?.users?.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Duty Select */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Filter by Duty</label>
            <select
              value={selectedDuty ?? ""}
              onChange={(e) => {
                setSelectedDuty(e.target.value || null);
                setSelectedPosition(null);
              }}
              className="bg-zinc-900 text-white text-sm px-3 py-2 rounded-md border border-zinc-700 focus:outline-none"
            >
              <option value="">All Duties</option>
              <option value="Sniper">Sniper</option>
              <option value="Spotter">Spotter</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Filter by Score Position</label>
            <select
              value={selectedPosition ?? ""}
              onChange={(e) => handleFilterChange(e.target.value as ScorePosition)}
              className="bg-zinc-900 text-white text-sm px-3 py-2 rounded-md border border-zinc-700 focus:outline-none"
            >
              <option value="">All Positions</option>
              <option value="lying">Lying</option>
              <option value="sitting">Sitting</option>
              <option value="standing">Standing</option>
              <option value="operational">Operational</option>
            </select>
          </div>

          {(selectedUserId || selectedDuty) && (
            <button
              onClick={() => {
                setSelectedUserId(null);
                setSelectedDuty(null);
                setSelectedPosition(null);
                console.log("Filters cleared");
              }}
              className="ml-auto text-xs text-red-400 hover:text-red-300"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="col-span-12 lg:col-span-12 space-y-6">
          <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Configuration Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(dutyConfigurations).map(([key, config]) => ({
                    name: key,
                    performance: config.performance,
                    accuracy: config.accuracy,
                    coordination: config.coordination,
                    teamwork: config.teamwork,
                  }))}
                >
                  <XAxis dataKey="name" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="performance" name="Performance" fill="#4ade80" />
                  <Bar dataKey="accuracy" name="Accuracy" fill="#60a5fa" />
                  <Bar dataKey="coordination" name="Coordination" fill="#a78bfa" />
                  <Bar dataKey="teamwork" name="Teamwork" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 w-full h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Squad Performance Comparison</h3>
          </div>
        </div>

        {/* Right Panel - Analysis */}
      </div>
    </BaseModal>
  );
};

export default function DashboardSquadStats({ squadStats }: { squadStats: SquadStats[] }) {
  const [selectedSquad, setSelectedSquad] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey !== "reaction" ? "%" : "s"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getSquadChartData = () => {
    return squadStats.map((stat) => ({
      name: stat.out_name,
      performance: stat.out_performance,
      accuracy: stat.out_accuracy,
      elimination: stat.out_elimination,
      coordination: stat.out_coordination,
    }));
  };

  const handleBarClick = (data: any) => {
    if (data) {
      setSelectedSquad(data);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <BaseDashboardCard title="Squad Performance Comparison" tooltipContent="Compare squad performance">
        <button onClick={() => setIsModalOpen(true)} className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
          <Info className="w-3 h-3" />
          Click bars for details
        </button>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getSquadChartData()} margin={{ top: 20, right: 50, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={{ stroke: "#3f3f46" }} />
              {/* <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={{ stroke: "#3f3f46", strokeWidth: 1 }} /> */}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="performance" name="Overall Performance" fill="#4ade80" radius={[4, 4, 0, 0]} cursor="pointer" onClick={handleBarClick} />
              <Bar dataKey="accuracy" name="Accuracy" fill="#60a5fa" radius={[4, 4, 0, 0]} cursor="pointer" onClick={handleBarClick} />
              <Bar dataKey="elimination" name="Elimination" fill="#f87171" radius={[4, 4, 0, 0]} cursor="pointer" onClick={handleBarClick} />
              <Bar dataKey="coordination" name="Coordination" fill="#a78bfa" radius={[4, 4, 0, 0]} cursor="pointer" onClick={handleBarClick} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </BaseDashboardCard>

      <SquadDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSquad(null);
        }}
        squadData={selectedSquad}
      />
    </>
  );
}
