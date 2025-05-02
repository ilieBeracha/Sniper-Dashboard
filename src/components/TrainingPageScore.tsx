import BaseDashboardCard from "./BaseDashboardCard";
import ScoreFormModal from "./TrainingPageScoreFormModal";
import { useState } from "react";
import { useStore } from "zustand";
import { scoreStore } from "@/store/scoreSrore";
import { Edit2Icon, Plus } from "lucide-react";
import { userStore } from "@/store/userStore";
import { isCommander } from "@/utils/permissions";

export default function TrainingPageScore() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { scores } = useStore(scoreStore);
    const { user } = useStore(userStore);

    const submitScore = () => {
        setIsModalOpen(false);
    };

    const scoresBySquad = scores.reduce((acc, score) => {
        const squadName = score?.squad?.squad_name || "Unknown Squad";
        if (!acc[squadName]) acc[squadName] = [];
        acc[squadName].push(score);
        return acc;
    }, {} as Record<string, typeof scores>);

    return (
        <BaseDashboardCard
            title="Score"
            tooltipContent="Detailed information about the current training session"
        >
            <div className="relative">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute right-0 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md flex items-center gap-1 shadow-md"
                >
                    <Plus size={14} />
                    Add Score
                </button>

                <div className="flex justify-between items-center mb-6 mt-2">
                    <p className="text-sm text-gray-400">
                        {scores.length === 0 ? "No scores yet" : `${scores.length} Team scores total`}
                    </p>
                </div>

                {Object.entries(scoresBySquad).map(([squadName, squadScores]) => (
                    <div key={squadName} className="mb-6 ">
                        <h3 className="text-sm font-semibold text-white my-4">{squadName}</h3>
                        <div className="grid grid-cols-3 px-2 items-center">
                            <p className="text-sm text-gray-200">Assignment</p>
                            <p className="text-sm text-gray-200">Day/Night</p>
                            <p className="text-sm text-gray-200">Created at</p>

                        </div>
                        {squadScores.map((score) => (
                            <div
                                key={score.id}
                                className="relative grid grid-cols-3 py-6 bg-white/5 items-center bg-[#1E1E1E] border border-white/5 rounded-lg px-3 py-4 mt-2 hover:border-purple-600 transition"
                            >
                                <p className="text-sm text-gray-400">{score.assignment_session.assignment.assignment_name}</p>
                                <p className="text-sm text-gray-400">{score.day_night || "-"}</p>
                                <p className="text-sm text-gray-400">{new Date(score.created_at).toLocaleString() ?? "-"}</p>
                                {
                                    (user?.squad_id === score.squad_id || isCommander(user?.user_role || null)) && (
                                        <button
                                            onClick={() => {
                                                setIsModalOpen(true);

                                            }}
                                            className="text-sm text-gray-400 hover:text-white transition absolute right-2"
                                        >
                                            <Edit2Icon size={16} />
                                        </button>
                                    )
                                }
                            </div>
                        ))}
                    </div>
                ))}

                <ScoreFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={submitScore}
                    editingScore={null}
                />
            </div>
        </BaseDashboardCard>
    );
}
