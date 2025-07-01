import { Info, Users, Plus, X } from "lucide-react";
import { Equipment } from "@/types/equipment";
import { useFormContext } from "react-hook-form";

export default function TrainingPageScoreFormModalParticipants({
  showOptionalFields,
  setShowOptionalFields,
  teamMembers,
  user,
  weapons,
  equipments,
  showParticipantSelect,
  setShowParticipantSelect,
  addParticipant,
  teamMemberWithUserRole,
  removeParticipant,
}: {
  showOptionalFields: boolean;
  setShowOptionalFields: (value: boolean) => void;
  teamMembers: any;
  user: any;
  weapons: any;
  equipments: any;
  showParticipantSelect: boolean;
  setShowParticipantSelect: (value: boolean) => void;
  addParticipant: (id: string) => void;
  removeParticipant: (id: string) => void;
  teamMemberWithUserRole: any;
}) {
  const { register, setValue, watch } = useFormContext();
  const formValues = watch();

  return (
    <div className="space-y-6">
      {/* Optional Fields */}
      <button type="button" onClick={() => setShowOptionalFields(!showOptionalFields)} className="text-blue-400 hover:text-blue-300">
        {showOptionalFields ? "Hide Additional Information" : "Show Additional Information"}
      </button>

      {showOptionalFields && (
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center gap-2">
            <Info className="text-blue-400" size={16} />
            <h4 className="text-base font-semibold text-white">Additional Information</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-zinc-400">Target Assessment</h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue("first_shot_hit", "true")}
                  className={`flex-1 p-2 rounded-lg border ${
                    formValues.first_shot_hit === "true" ? "bg-green-900/30 border-green-600" : "border-zinc-700"
                  }`}
                >
                  First Shot Hit
                </button>
                <button
                  type="button"
                  onClick={() => setValue("first_shot_hit", "false")}
                  className={`flex-1 p-2 rounded-lg border ${
                    formValues.first_shot_hit === "false" ? "bg-red-900/30 border-red-600" : "border-zinc-700"
                  }`}
                >
                  First Shot Missed
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-zinc-400">Environmental Factors</h4>
              <input
                type="number"
                {...register("wind_strength", { valueAsNumber: true })}
                placeholder="Wind strength (m/s)"
                className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
              />
              <input
                type="number"
                {...register("wind_direction", { valueAsNumber: true })}
                placeholder="Wind direction (degrees)"
                className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
              />
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-zinc-400 mb-2">Mission Notes</h4>
              <textarea
                {...register("note")}
                placeholder="Add any observations or comments..."
                rows={3}
                className="w-full rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* Participants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-indigo-400" size={16} />
            <h4 className="text-base font-semibold text-white">Participants</h4>
          </div>
          <button
            type="button"
            onClick={() => setShowParticipantSelect(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 rounded-lg border border-indigo-700/50"
          >
            <Plus size={14} />
            Add Participant
          </button>
        </div>

        {showParticipantSelect && (
          <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-zinc-300">Select Team Member</h5>
              <button type="button" onClick={() => setShowParticipantSelect(false)} className="text-zinc-400 hover:text-zinc-300">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {teamMembers
                .filter((member: any) => !formValues.participants.includes(member.id))
                .map((member: any) => (
                  <button
                    key={member.id}
                    onClick={() => addParticipant(member.id)}
                    className="w-full p-2 text-left text-sm text-zinc-300 hover:bg-zinc-700/30 rounded-lg flex items-center justify-between"
                  >
                    <span>
                      {member.first_name} {member.last_name}
                    </span>
                    <span className="text-xs text-zinc-500">{member.user_role}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {formValues.participants.map((participantId: any) => {
            const member = teamMemberWithUserRole.find((m: any) => m.id === participantId);
            return (
              <div key={participantId} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-zinc-800/20 rounded-lg">
                <div className="flex items-center justify-between md:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-300">
                      {member?.first_name} {member?.last_name}
                    </span>
                    <span className="text-xs text-zinc-500">{member?.user_role}</span>
                  </div>
                  {participantId !== user?.id && (
                    <button type="button" onClick={() => removeParticipant(participantId)} className="text-zinc-500 hover:text-red-400">
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div>
                  <select
                    {...register(`duties.${participantId}`)}
                    className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
                  >
                    <option value="">Select role</option>
                    <option value="Sniper">Sniper</option>
                    <option value="Spotter">Spotter</option>
                  </select>
                </div>

                {formValues.duties[participantId] === "Sniper" && (
                  <select
                    {...register(`weapons.${participantId}`)}
                    className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
                  >
                    <option value="">Select weapon</option>
                    {weapons.map((weapon: any) => (
                      <option key={weapon.id} value={weapon.id}>
                        {weapon.weapon_type} — {weapon.serial_number}
                      </option>
                    ))}
                  </select>
                )}

                {formValues.duties[participantId] === "Spotter" && (
                  <select
                    {...register(`equipment.${participantId}`)}
                    className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
                  >
                    <option value="">Select equipment</option>
                    {equipments.map((equipment: Equipment) => (
                      <option key={equipment.id} value={equipment.id}>
                        {equipment.equipment_type} — {equipment.serial_number}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
