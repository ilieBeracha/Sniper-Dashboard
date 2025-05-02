import { Users, Pencil } from "lucide-react";
import { SquadScore, SquadScoresGrouped } from "@/types/training";
import { useEffect } from "react";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";

type SquadScoreTableProps = {
  squadScores: SquadScoresGrouped;
  handleEdit: (score: SquadScore) => void;
  getAccuracy: (hits: number, shots: number) => number;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
};

export default function TrainingPageSquadScoreTable({
  squadScores,
  handleEdit,
  getAccuracy,
  formatDate,
  formatTime,
}: SquadScoreTableProps) {
  const { user } = useStore(userStore);

  useEffect(() => {
    console.log("squadScores:", squadScores);
    console.log("squadScores.scores:", squadScores?.scores);
  }, [squadScores]);

  return (
    <div className="bg-[#1A1A1A] rounded border border-white/10">
      <div className="px-4 py-3 bg-gray-750 border-b border-white/10 flex items-center">
        <Users className="w-4 h-4 text-gray-400 mr-2" />
        <h3 className="text-gray-200 font-medium text-sm">{squadScores?.squad_name}</h3>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-xs text-gray-400">
            <th className="text-left font-normal px-4 py-2" title="Assignment session identifier">
              Assignment ID
            </th>
            <th className="text-left font-normal px-4 py-2" title="Date and time of record">
              Date
            </th>
            <th className="text-right font-normal px-4 py-2" title="Number of shots fired">
              Shots
            </th>
            <th className="text-right font-normal px-4 py-2" title="Number of targets hit">
              Hits
            </th>
            <th className="text-right font-normal px-4 py-2" title="Hit accuracy percentage">
              Accuracy
            </th>
            <th className="px-4 py-2 w-10"></th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {squadScores?.scores?.map((squadScore: SquadScore | any, index: number) => (
            <tr
              key={index}
            >
              <td className="px-4 py-3 text-gray-300 font-mono">{squadScore.assignment_session_id?.substring(0, 8) || "N/A"}</td>
              <td className="px-4 py-3 text-gray-400">
                <div>{formatDate(squadScore.created_at)}</div>
                <div className="text-xs text-gray-500">{formatTime(squadScore.created_at)}</div>
              </td>
              <td className="px-4 py-3 text-right text-gray-300">{squadScore.shots_fired}</td>
              <td className="px-4 py-3 text-right text-gray-300">{squadScore.target_hit}</td>
              <td className="px-4 py-3 text-right font-medium">{getAccuracy(squadScore.target_hit, squadScore.shots_fired)}%</td>
              <td className="px-4 py-3 text-right">
                {/* {isCommander(user?.user_role as UserRole) ? ( */}
                <>
                  <button
                    onClick={() => handleEdit(squadScore)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Edit record"
                  >
                    <Pencil className="w-4 h-4 text-gray-400" />
                  </button>
                </>
                {/* )} */}
              </td>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
}