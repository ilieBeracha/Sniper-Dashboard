import { TrainingStore } from "@/store/trainingStore";
import BaseDashboardCard from "./BaseDashboardCard";
import { useStore } from "zustand";
import { SquadScore, SquadScoresGrouped } from "@/types/training";
import { Target, Plus } from "lucide-react";
import ScoreFormModal from "./TrainingPageScoreFormModal";
import { useEffect, useState } from "react";

import { userStore } from "@/store/userStore";
import TrainingPageSquadScoreTable from "./TrainingPageSquadScoreTable";

export default function TrainingPageScores() {
  const { scoresGroupedBySquad } = useStore(TrainingStore);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<SquadScore | null>(null);
  const { user } = useStore(userStore);

  useEffect(() => {
    console.log("scoresGroupedBySquad", scoresGroupedBySquad);
  }, [scoresGroupedBySquad]);

  const handleSubmit = () => {
    setIsModalOpen(false);
    setEditingScore(null);
  };

  const handleEdit = (score: SquadScore) => {
    setEditingScore(score);
    setIsModalOpen(true);
  };

  const getAccuracy = (hits: number, shots: number) => {
    if (!shots) return 0;
    return Math.round((hits / shots) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <BaseDashboardCard title="Training Score Registry" tooltipContent="Comprehensive training performance data registry">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-normal text-gray-300">{scoresGroupedBySquad.length > 0 ? `Total Records: ${scoresGroupedBySquad.length}` : "No Records Available"}</h3>
          <button
            onClick={() => {
              setEditingScore(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded text-sm text-white"
          >
            <Plus className="w-4 h-4" />
            Register New Score
          </button>
        </div>

        <ScoreFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingScore(null);
          }}
          onSubmit={handleSubmit}
          editingScore={editingScore}
        />

        {Object.keys(scoresGroupedBySquad).length === 0 ? (
          <div className="text-center py-12 rounded bg-[#1A1A1A] border border-white/10">
            <Target className="mx-auto h-10 w-10 text-gray-600 mb-3" />
            <p className="text-gray-400">No performance data available</p>
            <p className="text-gray-500 text-sm mt-2">Register your first score to begin performance tracking</p>
          </div>
        ) : (
          <div className="space-y-6">
            {scoresGroupedBySquad.map((squadScores: SquadScoresGrouped | any, index: number) => (
              <TrainingPageSquadScoreTable
                key={index}
                squadScores={squadScores}
                handleEdit={handleEdit}
                getAccuracy={getAccuracy}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </div>
    </BaseDashboardCard>
  );
}
