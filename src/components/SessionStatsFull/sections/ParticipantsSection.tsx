import { Users, Trash2, UserPlus } from "lucide-react";
import { Participant } from "../types";
import { SectionHeader } from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

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
  const { theme } = useTheme();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="w-full max-w-2xl mx-auto" id="participants">
      <SectionHeader section={section} />

      {/* Add Controls */}
      <div className=" flex flex-col sm:flex-row gap-3">
        <select
          className={`flex-1  py-2 px-4 rounded-xl border-2 transition-all ${
            theme === "dark" ? "bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500" : "bg-white border-gray-200 focus:border-indigo-500"
          }`}
          onChange={(e) => {
            if (e.target.value) {
              addParticipant(e.target.value);
              e.target.value = "";
            }
          }}
        >
          <option value="">Select member to add</option>
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
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors"
        >
          <Users className="w-4 h-4" />
          <span>Add Squad</span>
        </button>
      </div>

      {/* Participants List - Single Card */}
      <div className={`mt-8 rounded-2xl border-2 overflow-hidden ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
        {participants.length > 0 ? (
          <>
            {/* Table Header */}
            <div
              className={`grid grid-cols-5 gap-2 px-4 py-3 text-xs font-medium border-b ${
                theme === "dark" ? "bg-zinc-800/50 border-zinc-700 text-zinc-400" : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            >
              <div className="col-span-1">Name</div>
              <div className="col-span-1">Role</div>
              <div className="col-span-1">Position</div>
              <div className="col-span-1">{participants[0].userDuty === "Sniper" ? "Weapon" : "Equipment"}</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Participants Rows */}
            <div className="divide-y divide-zinc-800 dark:divide-zinc-700">
              {participants.map((participant, index) => (
                <div
                  key={participant.userId}
                  className={`grid grid-cols-5 gap-2 px-4 py-3 items-center transition-colors ${
                    theme === "dark" ? "hover:bg-zinc-800/30" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Name */}
                  <div className="col-span-1 flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        theme === "dark" ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{participant.name}</div>
                      {participant.userId === user?.id && (
                        <span className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>You</span>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-1">
                    <select
                      value={participant.userDuty}
                      onChange={(e) => updateParticipant(participant.userId, "userDuty", e.target.value)}
                      className={`w-full h-8 px-2 rounded text-sm border ${
                        theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-gray-200"
                      }`}
                    >
                      <option value=""></option>
                      <option value="Sniper">Sniper</option>
                      <option value="Spotter">Spotter</option>
                    </select>
                  </div>

                  {/* Position */}
                  <div className="col-span-1">
                    <select
                      value={participant.position}
                      onChange={(e) => updateParticipant(participant.userId, "position", e.target.value)}
                      className={`w-full h-8 px-2 rounded text-sm border ${
                        theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-gray-200"
                      }`}
                    >
                      <option value="Lying">Lying</option>
                      <option value="Standing">Standing</option>
                      <option value="Sitting">Sitting</option>
                      <option value="Operational">Operational</option>
                    </select>
                  </div>

                  {/* Weapon/Equipment */}
                  <div className="col-span-1">
                    <select
                      value={participant.userDuty === "Sniper" ? (participant.weaponId || "") : (participant.equipmentId || "")}
                      onChange={(e) =>
                        updateParticipant(participant.userId, participant.userDuty === "Sniper" ? "weaponId" : "equipmentId", e.target.value)
                      }
                      className={`w-full h-8 px-2 rounded text-sm border ${
                        theme === "dark" ? "bg-zinc-800 border-zinc-700 text-white" : "bg-white border-gray-200"
                      }`}
                    >
                      <option value=""></option>
                      {participant.userDuty === "Sniper"
                        ? weapons.map((weapon: any) => (
                            <option key={weapon.id} value={weapon.id || ""}>
                              {weapon.weapon_type} - SN: {weapon.serial_number}
                            </option>
                          ))
                        : equipments.map((equipment: any) => (
                            <option key={equipment.id} value={equipment.id || ""}>
                              {equipment.equipment_type} - SN: {equipment.serial_number}
                            </option>
                          ))}
                    </select>
                  </div>

                  {/* Delete */}
                  <div className="col-span-1 flex justify-end">
                    {participant.userId !== user?.id && (
                      <button
                        onClick={() => removeParticipant(participant.userId)}
                        className={`p-1.5 rounded transition-colors ${
                          theme === "dark" ? "hover:bg-red-500/20 text-red-400" : "hover:bg-red-50 text-red-500"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={`text-center py-12 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
            <UserPlus className={`w-10 h-10 mx-auto mb-3 ${theme === "dark" ? "text-zinc-600" : "text-gray-300"}`} />
            <h3 className={`text-base font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-1`}>No participants yet</h3>
            <p className="text-sm">Add team members to start the session</p>
          </div>
        )}
      </div>
    </div>
  );
};
