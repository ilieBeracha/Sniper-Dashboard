import { TrainingStore } from "@/store/trainingStore";
import BaseDashboardCard from "./BaseDashboardCard";
import { useStore } from "zustand";
import { Score } from "@/types/training";
import { Target, Plus } from "lucide-react";
import ScoreFormModal from "./TrainingPageScoreFormModal";
import { useState } from "react";

import { userStore } from "@/store/userStore";
import TrainingPageSquadScoreTable from "./TrainingPageSquadScoreTable";

export default function TrainingPageScores() {
  const { scores } = useStore(TrainingStore);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<Score | null>(null);
  const { user } = useStore(userStore);

  const handleSubmit = () => {
    setIsModalOpen(false);
    setEditingScore(null);
  };

  const handleEdit = (score: Score) => {
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

  const scoresBySquad = scores.reduce((acc, score) => {
    const squadId = score.squad_id || "Unassigned";
    if (!acc[squadId]) acc[squadId] = [];
    acc[squadId].push(score);
    return acc;
  }, {} as Record<string, Score[]>);

  // Calculate summary stats
  const totalShots = scores.reduce((sum, s) => sum + (s.shots_fired || 0), 0);
  const totalHits = scores.reduce((sum, s) => sum + (s.target_hit || 0), 0);
  const avgAccuracy = totalShots ? Math.round((totalHits / totalShots) * 100) : 0;

  return (
    <BaseDashboardCard title="Training Score Registry" tooltipContent="Comprehensive training performance data registry">
      <div className="space-y-4">
        {/* Summary Row */}
        <div className="flex flex-wrap gap-4 justify-between items-center bg-gray-800/60 rounded-lg px-6 py-4 mb-2 border border-white/10">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">Total Shots</span>
            <span className="text-lg font-bold">{totalShots}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">Total Hits</span>
            <span className="text-lg font-bold">{totalHits}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">Avg. Accuracy</span>
            <span className="text-lg font-bold">{avgAccuracy}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-normal text-gray-300">{scores.length > 0 ? `Total Records: ${scores.length}` : "No Records Available"}</h3>
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

        {Object.keys(scoresBySquad).length === 0 ? (
          <div className="text-center py-12 rounded bg-[#1A1A1A] border border-white/10">
            <Target className="mx-auto h-10 w-10 text-gray-600 mb-3" />
            <p className="text-gray-400">No performance data available</p>
            <p className="text-gray-500 text-sm mt-2">Register your first score to begin performance tracking</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(scoresBySquad).map(([squadId, squadScores]) => (
              <TrainingPageSquadScoreTable
                key={squadId}
                squadId={squadId}
                squadScores={squadScores}
                user={user}
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
