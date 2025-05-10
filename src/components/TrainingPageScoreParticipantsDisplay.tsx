import { Users, Award, Shield } from "lucide-react";
import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";

interface ScoreParticipant {
  id: string;
  user_id: string;
  role: string;
  weapon_id: string | null; // weapon_id can be null
  equipment_id: string | null; // equipment_id can be null
  created_at: string;
  user: {
    id: string;
    squad_id: string;
    first_name: string;
    last_name: string;
  };
}

const ScoreParticipantsDisplay = ({ participants }: { participants: ScoreParticipant[] }) => {
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);

  const getEquipmentInfo = (equipmentId: string | null): string => {
    if (!equipmentId) return "No Equipment"; // If equipmentId is null, return "No Equipment"
    const item = equipments.find((item) => item.id === equipmentId);
    return item ? `${item.equipment_type} - ${item.serial_number}` : "Unknown Equipment";
  };

  const getWeaponInfo = (weaponId: string | null): string => {
    if (!weaponId) return "No Weapon"; // If weaponId is null, return "No Weapon"
    const item = weapons.find((item) => item.id === weaponId);
    return item ? `${item.weapon_type} - ${item.serial_number}` : "Unknown Weapon";
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
                  {/* Weapon Display */}
                  {participant.weapon_id && (
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-zinc-400 mr-2" />
                      <span className="text-zinc-500 text-sm">Weapon</span>
                    </div>
                  )}
                  <div className="text-white font-medium ml-6">{getWeaponInfo(participant.weapon_id)}</div>

                  {/* Equipment Display */}
                  {participant.equipment_id && (
                    <div className="flex items-center mt-2">
                      <Shield className="h-4 w-4 text-zinc-400 mr-2" />
                      <span className="text-zinc-500 text-sm">Equipment</span>
                    </div>
                  )}
                  <div className="text-white font-medium ml-6">{getEquipmentInfo(participant.equipment_id)}</div>
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
