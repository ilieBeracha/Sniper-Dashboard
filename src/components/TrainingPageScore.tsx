import BaseDashboardCard from "./BaseDashboardCard";
import ScoreFormModal from "./TrainingPageScoreFormModal";
import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { scoreStore } from "@/store/scoreSrore";
import { Edit2Icon, Plus, Users, Moon, Sun, Clock, Target, ChevronDown, ChevronUp } from "lucide-react";
import { userStore } from "@/store/userStore";
import { isCommander } from "@/utils/permissions";

import { Score } from "@/types/score";
import ScoreParticipantsDisplay from "./TrainingPageScoreParticipantsDisplay";
import { TrainingStore } from "@/store/trainingStore";

export default function TrainingPageScore() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedSquads, setExpandedSquads] = useState<any>({});
    const [expandedScores, setExpandedScores] = useState<Record<string, boolean>>({});
    const [filterCondition, setFilterCondition] = useState('all');
    const { scores, createScore } = useStore(scoreStore);
    const { user } = useStore(userStore);
    const { training } = useStore(TrainingStore);

    useEffect(() => {
        if (scores.length > 0) {
            const initialExpandState: { [key: string]: boolean } = {};
            scores.forEach(score => {
                const squadName = score?.squad?.squad_name || "Unknown Squad";
                initialExpandState[squadName] = true;
            });
            setExpandedSquads(initialExpandState);
        }
    }, [scores]);

    const toggleScoreExpansion = (scoreId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setExpandedScores(prev => ({
            ...prev,
            [scoreId]: !prev[scoreId]
        }));
    };

    const submitScore = async (formValues: any) => {
        if (!user?.squad_id) {
            formValues.squad_id = user?.squad_id;
        }
        await createScore(formValues);
        setIsModalOpen(false);
    };

    const scoresBySquad = scores.reduce((acc: any, score: Score) => {
        const squadName = score?.squad?.squad_name || "Unknown Squad";
        if (!acc[squadName]) acc[squadName] = [];
        acc[squadName].push(score);
        return acc;
    }, {});

    const toggleSquadExpansion = (squadName: any) => {
        setExpandedSquads((prev: any) => ({
            ...prev,
            [squadName]: !prev[squadName]
        }));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredScoresBySquad = Object.entries(scoresBySquad).reduce((acc: any, [squadName, squadScores]: [string, Score[] | unknown]) => {
        if (filterCondition === 'all') {
            acc[squadName] = squadScores;
        } else {
            if (!squadScores || !Array.isArray(squadScores)) return acc;
            acc[squadName] = squadScores.filter((score: Score) => score.day_night === filterCondition);
        }
        return acc;
    }, {});

    const totalScores = scores.length;
    const dayScores = scores.filter(score => score.day_night === 'day').length;
    const nightScores = scores.filter(score => score.day_night === 'night').length;
    const squadCount = Object.keys(scoresBySquad).length;

    return (
        <BaseDashboardCard
            title="Training Score Dashboard"
            tooltipContent="Performance overview across all squads"
        >
            <div className="relative">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-zinc-400" />
                        <h2 className="text-lg font-medium text-white">Performance Overview</h2>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 
                            active:bg-zinc-900 rounded flex items-center gap-2 border border-zinc-700 transition-colors"
                    >
                        <Plus size={16} />
                        Record Score
                    </button>
                </div>

                {/* Dashboard stats summary */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                        <div className="flex items-center mb-2">
                            <Target className="h-4 w-4 text-zinc-400 mr-2" />
                            <h3 className="text-sm font-medium text-zinc-200">Total Records</h3>
                        </div>
                        <p className="text-2xl font-semibold text-white">{totalScores}</p>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                        <div className="flex items-center mb-2">
                            <Sun className="h-4 w-4 text-amber-400 mr-2" />
                            <h3 className="text-sm font-medium text-zinc-200">Day Sessions</h3>
                        </div>
                        <p className="text-2xl font-semibold text-white">{dayScores}</p>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                        <div className="flex items-center mb-2">
                            <Moon className="h-4 w-4 text-zinc-400 mr-2" />
                            <h3 className="text-sm font-medium text-zinc-200">Night Sessions</h3>
                        </div>
                        <p className="text-2xl font-semibold text-white">{nightScores}</p>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                        <div className="flex items-center mb-2">
                            <Users className="h-4 w-4 text-zinc-400 mr-2" />
                            <h3 className="text-sm font-medium text-zinc-200">Active Squads</h3>
                        </div>
                        <p className="text-2xl font-semibold text-white">{squadCount}</p>
                    </div>
                </div>

                {/* Filter controls */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-sm text-zinc-400">
                        Showing scores for all participating squads
                    </div>

                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-zinc-400">Filter:</span>
                        <div className="flex bg-zinc-800 rounded-md overflow-hidden border border-zinc-700">
                            <button
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${filterCondition === 'all'
                                    ? 'bg-zinc-700 text-white'
                                    : 'text-zinc-400 hover:bg-zinc-700/50'
                                    }`}
                                onClick={() => setFilterCondition('all')}
                            >
                                All
                            </button>
                            <button
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${filterCondition === 'day'
                                    ? 'bg-zinc-700 text-white'
                                    : 'text-zinc-400 hover:bg-zinc-700/50'
                                    }`}
                                onClick={() => setFilterCondition('day')}
                            >
                                <Sun size={12} className="inline mr-1 text-amber-400" />
                                Day
                            </button>
                            <button
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${filterCondition === 'night'
                                    ? 'bg-zinc-700 text-white'
                                    : 'text-zinc-400 hover:bg-zinc-700/50'
                                    }`}
                                onClick={() => setFilterCondition('night')}
                            >
                                <Moon size={12} className="inline mr-1 text-zinc-300" />
                                Night
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scores by squad */}
                <div className="space-y-4">
                    {Object.entries(filteredScoresBySquad).length > 0 ? (
                        Object.entries(filteredScoresBySquad).map(([squadName, squadScores]: any[]) => (
                            <div key={squadName} className="bg-zinc-800/50 rounded-lg border border-zinc-700 overflow-hidden">
                                <div
                                    className="flex justify-between items-center px-4 py-6 bg-zinc-800 cursor-pointer"
                                    onClick={() => toggleSquadExpansion(squadName)}
                                >
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 text-zinc-400 mr-2" />
                                        <h3 className="text-md font-medium text-white">{squadName}</h3>
                                        <span className="ml-2 text-sm bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
                                            {squadScores.length as any} {squadScores.length === 1 ? 'record' : 'records'}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        {expandedSquads[squadName] ? (
                                            <ChevronUp size={16} className="text-zinc-400" />
                                        ) : (
                                            <ChevronDown size={16} className="text-zinc-400" />
                                        )}
                                    </div>
                                </div>

                                {expandedSquads[squadName] && (
                                    <div className="divide-y divide-zinc-700/50">
                                        <div className="grid grid-cols-4 px-4 py-2 bg-zinc-900/50 text-xs uppercase tracking-wider text-zinc-500 font-medium">
                                            <div>Assignment</div>
                                            <div>Conditions</div>
                                            <div>Date & Time</div>
                                            <div className="text-right">Actions</div>
                                        </div>

                                        {squadScores.map((score: Score) => (
                                            <div key={score.id} className="divide-y divide-zinc-700/20">
                                                <div
                                                    className="grid grid-cols-4 px-4 py-3 hover:bg-zinc-700/20 transition-colors relative"
                                                >
                                                    <div className="text-sm text-zinc-300 font-medium">
                                                        {score.assignment_session.assignment.assignment_name}
                                                    </div>
                                                    <div className="text-sm flex items-center text-zinc-400">
                                                        {score.day_night === 'day' ? (
                                                            <>
                                                                <Sun size={14} className="mr-1.5 text-amber-400" />
                                                                <span>Day</span>
                                                            </>
                                                        ) : score.day_night === 'night' ? (
                                                            <>
                                                                <Moon size={14} className="mr-1.5 text-zinc-300" />
                                                                <span>Night</span>
                                                            </>
                                                        ) : (
                                                            "Not specified"
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-zinc-400 flex items-center">
                                                        <Clock size={14} className="mr-1.5 text-zinc-500" />
                                                        {formatDate(score.created_at || "")}
                                                    </div>
                                                    <div className="flex items-center justify-end space-x-2">
                                                        {score.score_participants && score.score_participants.length > 0 && (
                                                            <button
                                                                onClick={(e) => toggleScoreExpansion(score.id || "", e)}
                                                                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                                                            >
                                                                <Users size={14} />
                                                                <span className="text-xs font-medium">
                                                                    {score.score_participants.length}
                                                                    {expandedScores[score.id || ""] ?
                                                                        <ChevronUp size={14} className="ml-1 inline" /> :
                                                                        <ChevronDown size={14} className="ml-1 inline" />
                                                                    }
                                                                </span>
                                                            </button>
                                                        )}
                                                        {(user?.squad_id === score.squad_id || isCommander(user?.user_role || null)) && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setIsModalOpen(true);
                                                                }}
                                                                className="p-1.5 rounded-full hover:bg-zinc-700 text-zinc-400 
                                                                hover:text-white transition"
                                                                title="Edit score"
                                                            >
                                                                <Edit2Icon size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Participant details section */}
                                                {expandedScores[score.id || ""] && score.score_participants && (
                                                    <div className="py-3 px-4 bg-zinc-800/30">
                                                        <ScoreParticipantsDisplay
                                                            participants={score.score_participants}
                                                            equipment={[]}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 bg-zinc-800/30 rounded-lg border border-zinc-700">
                            <Target className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                            <p className="text-zinc-400 mb-1">No scores match the current filter</p>
                            <p className="text-zinc-500 text-sm">
                                {filterCondition !== 'all' ? 'Try changing your filter selection' : 'Record your first score to get started'}
                            </p>
                        </div>
                    )}
                </div>

                <ScoreFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(formValues) => submitScore(formValues)}
                    editingScore={null}
                    assignmentSessions={training?.assignment_session || []}
                />
            </div>
        </BaseDashboardCard>
    );
}