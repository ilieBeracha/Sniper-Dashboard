import BaseDashboardCard from "./BaseDashboardCard";
import { TrainingSession } from "@/types/training";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { Trophy, Plus, Target } from "lucide-react";

type TrainingPageParticipantsScoreProps = {
  training: TrainingSession | null;
};

export default function TrainingPageParticipantsScore({ training }: TrainingPageParticipantsScoreProps) {
  const { user } = useStore(userStore);

  const isParticipant = training?.participants?.some((participant) => participant.participant_id === user?.id);

  return (
    <BaseDashboardCard title="Training Performance" tooltipContent="Track and manage participant performance scores">
      {training?.participants?.map((participant) => (
        <div
          key={participant.id}
          className="relative bg-gradient-to-br from-[#1A1A1A] to-[#222] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">
                  {participant.user?.first_name} {participant.user?.last_name}
                </h3>
                <p className="text-xs text-gray-400">{participant.user?.user_role}</p>
              </div>
            </div>
            {isParticipant && participant.participant_id === user?.id && (
              <button className="p-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-colors" title="Add score">
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Accuracy</span>
              </div>
              <span className="text-sm font-medium text-gray-300">Not scored</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Overall Score</span>
              </div>
              <span className="text-sm font-medium text-gray-300">Not scored</span>
            </div>
          </div>

          {isParticipant && participant.participant_id === user?.id && (
            <div className="absolute -top-2 -right-2">
              <div className="px-2 py-1 bg-indigo-500/20 rounded-full">
                <span className="text-xs text-indigo-400">Your Score</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </BaseDashboardCard>
  );
}
