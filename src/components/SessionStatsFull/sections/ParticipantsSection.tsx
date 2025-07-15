import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trash2 } from "lucide-react";
import { Participant } from "../types";
import { SectionHeader } from "./SectionHeader";

interface ParticipantsSectionProps {
  section: any;
  participants: Participant[];
  user: any;
  teamMembers: any[];
  weapons: any[];
  equipments: any[];
  addSquad: () => void;
  addParticipant: (memberId: string) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, field: keyof Participant, value: any) => void;
}

export const ParticipantsSection = ({
  section,
  participants,
  user,
  teamMembers,
  weapons,
  equipments,
  addSquad,
  addParticipant,
  removeParticipant,
  updateParticipant,
}: ParticipantsSectionProps) => {
  return (
    <div id="participants" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <SectionHeader section={section} />
        <div className="flex  sm:flex-row gap-2 w-full sm:w-auto">
          <select
            className="h-10 px-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white w-full sm:w-auto"
            onChange={(e) => {
              if (e.target.value) {
                addParticipant(e.target.value);
                e.target.value = "";
              }
            }}
          >
            <option value="">+ Add Member</option>
            {teamMembers
              .filter((member) => !participants.find((p) => p.userId === member.id))
              .map((member) => (
                <option key={member.id} value={member.id}>
                  {member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email}
                </option>
              ))}
          </select>
          <button
            onClick={addSquad}
            className="flex w-1/2 items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Users className="w-4 h-4" />
            <span>Add Squad</span>
          </button>
        </div>
      </div>
      <Card className="border-0 shadow-sm dark:shadow-black/20 py-2">
        <CardContent className="px-0">
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={participant.userId} className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 ">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {participant.name}
                        {participant.userId === user?.id && <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(You)</span>}
                      </h4>
                    </div>
                  </div>
                  {participant.userId !== user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeParticipant(participant.userId)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Horizontal Form Layout */}
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                  {/* Role */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Role</label>
                    <select
                      value={participant.userDuty}
                      onChange={(e) => updateParticipant(participant.userId, "userDuty", e.target.value)}
                      className="w-full h-10 px-2 text-xs  border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                    >
                      <option value="Sniper">Sniper</option>
                      <option value="Spotter">Spotter</option>
                    </select>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Position</label>
                    <select
                      value={participant.position}
                      onChange={(e) => updateParticipant(participant.userId, "position", e.target.value)}
                      className="w-full h-10 px-2  text-xs  border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                    >
                      <option value="Lying">Prone</option>
                      <option value="Standing">Standing</option>
                      <option value="Sitting">Sitting</option>
                      <option value="Operational">Operational</option>
                    </select>
                  </div>

                  {/* Weapon/Equipment */}
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                      {participant.userDuty === "Sniper" ? "Weapon" : "Equipment"}
                    </label>
                    <select
                      value={participant.userDuty === "Sniper" ? participant.weaponId : participant.equipmentId}
                      onChange={(e) =>
                        updateParticipant(participant.userId, participant.userDuty === "Sniper" ? "weaponId" : "equipmentId", e.target.value)
                      }
                      className="w-full h-10 px-2 text-xs  border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white"
                    >
                      <option value="">Select</option>
                      {participant.userDuty === "Sniper"
                        ? weapons.map((weapon: any) => (
                            <option key={weapon.id} value={weapon.id || ""}>
                              {weapon.weapon_type}
                            </option>
                          ))
                        : equipments.map((equipment: any) => (
                            <option key={equipment.id} value={equipment.id || ""}>
                              {equipment.equipment_type}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {participants.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-lg ">
              <Users className="w-14 h-14 mx-auto text-gray-400 dark:text-zinc-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No team members added</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-6">Add participants to start building your training team</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
