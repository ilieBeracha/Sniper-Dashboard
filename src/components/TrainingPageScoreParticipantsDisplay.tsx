import { Users, Target, Award, Shield } from "lucide-react";
import { useEffect } from "react";

interface ScoreParticipant {
  id: string;
  user_id: string;
  role: string;
  weapon_id: string;
  equipment_id: string;
  created_at: string;
  user: {
    id: string;
    squad_id: string;
    first_name: string;
    last_name: string;
  };
}

const ScoreParticipantsDisplay = ({ participants, equipment }: { participants: ScoreParticipant[]; equipment: any }) => {
  const getEquipmentName = (equipmentId: string) => {
    const item = equipment.find((item: any) => item.id === equipmentId);
    return item ? item.name : "Unknown Equipment";
  };

  return (
    <div className="border border-zinc-700 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between py-3 px-4 bg-zinc-800 
                  cursor-pointer hover:bg-zinc-700/50 transition-colors"
      >
        <div className="flex items-center">
          <Users className="h-5 w-5 text-zinc-400 mr-3" />
          <span className="text-white font-medium">
            {participants.length} Participant{participants.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="divide-y divide-zinc-700/50">
        {participants.map((participant: ScoreParticipant, index: number) => (
          <div key={`${participant.user_id}-${index}`} className="p-4 bg-zinc-800/50">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700/50">
                <div className="flex items-center mb-3">
                  <Users className="h-5 w-5 text-zinc-400 mr-2" />
                  <h4 className="text-lg font-medium text-white">
                    {participant.user.first_name} {participant.user.last_name}
                  </h4>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700/50">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-zinc-400 mr-2" />
                    <span className="text-zinc-500 text-sm">Weapon</span>
                  </div>
                  <div className="text-white font-medium ml-6">{participant.weapon_id}</div>

                  <div className="flex items-center mt-2">
                    <Shield className="h-4 w-4 text-zinc-400 mr-2" />
                    <span className="text-zinc-500 text-sm">Equipment</span>
                  </div>
                  <div className="text-white font-medium ml-6">{getEquipmentName(participant.equipment_id)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreParticipantsDisplay;
