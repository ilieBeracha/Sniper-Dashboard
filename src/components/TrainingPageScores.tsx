import { TrainingStore } from "@/store/trainingStore";
import BaseDashboardCard from "./BaseDashboardCard";
import { useStore } from "zustand";
import { Score } from "@/types/training";
import { Target, Users, Clock, ChevronRight, Pencil, Plus } from "lucide-react";
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

  return (
    <BaseDashboardCard title="Training Score Registry" tooltipContent="Comprehensive training performance data registry">
      <div className="space-y-4">
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
              <div key={squadId} className="bg-[#1A1A1A] rounded border border-white/10">
                <div className="px-4 py-3 bg-gray-750 border-b border-white/10 flex items-center">
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  <h3 className="text-gray-200 font-medium text-sm">{squadId}</h3>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-gray-400">
                      <th className="text-left font-normal px-4 py-2">Assignment ID</th>
                      <th className="text-left font-normal px-4 py-2">Date</th>
                      <th className="text-right font-normal px-4 py-2">Shots</th>
                      <th className="text-right font-normal px-4 py-2">Hits</th>
                      <th className="text-right font-normal px-4 py-2">Accuracy</th>
                      <th className="px-4 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {squadScores.map((score) => {
                      const accuracy = getAccuracy(score.target_hit, score.shots_fired);

                      return (
                        <tr key={score.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-gray-300 font-mono">{score.assignment_session_id?.substring(0, 8) || "N/A"}</td>
                          <td className="px-4 py-3 text-gray-400">
                            <div>{formatDate(score.created_at)}</div>
                            <div className="text-xs text-gray-500">{formatTime(score.created_at)}</div>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-300">{score.shots_fired}</td>
                          <td className="px-4 py-3 text-right text-gray-300">{score.target_hit}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-200">{accuracy}%</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => handleEdit(score)} className="p-1 hover:bg-white/10 rounded transition-colors" title="Edit record">
                              <Pencil className="w-4 h-4 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseDashboardCard>
  );
}
