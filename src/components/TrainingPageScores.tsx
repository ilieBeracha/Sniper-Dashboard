import { TrainingStore } from "@/store/trainingStore";
import BaseDashboardCard from "./BaseDashboardCard";
import { useStore } from "zustand";
import { Score } from "@/types/training";
import { Target, Users, Clock, Pencil, Plus } from "lucide-react";
import ScoreFormModal from "./ScoreFormModal";
import { useState } from "react";

export default function TrainingPageScores() {
  const { scores } = useStore(TrainingStore);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<Score | null>(null);

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
    if (hits === 0) return 0;
    return Math.round((hits / shots) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
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

  return (
    <BaseDashboardCard title="Squad Scores" tooltipContent="List of training scores grouped by squad">
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setEditingScore(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-md text-sm font-medium text-white"
          >
            <Plus className="w-4 h-4" />
            Add Score
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
          <div className="text-center py-12 rounded-xl bg-white/5">
            <Target className="mx-auto h-10 w-10 text-gray-500 mb-3" />
            <p className="text-gray-400">No scores yet</p>
          </div>
        ) : (
          Object.entries(scoresBySquad).map(([squadId, squadScores]) => (
            <div key={squadId} className="bg-white/5 rounded-lg p-4 border border-white/10 relative">
              <div className="mb-3 flex items-center gap-2 text-white font-semibold text-sm">
                <Users className="w-4 h-4 text-red-400" />
                Squad: {squadId}
              </div>

              <div className="divide-y divide-white/10">
                {squadScores.map((score) => (
                  <div key={score.id} className="py-3 text-sm text-gray-300 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        {score.shots_fired} shots / {score.target_hit} hits
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex gap-4">
                      <span>Assignment #{score.assignment_session_id?.substring(0, 8)}</span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(score.created_at)}
                      </span>
                    </div>
                    <button onClick={() => handleEdit(score)} className="absolute top-3 right-0 text-indigo-400 hover:text-indigo-300">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </BaseDashboardCard>
  );
}
