interface ParticipantsStepProps {
  participants: any[];
  members: any[];
  user: any;
  addParticipant: (memberId?: string) => void;
  addMultipleParticipants: (memberIds: string[]) => void;
  removeParticipant: (index: number, userId: string) => void;
  updateParticipant: (index: number, field: any, value?: any) => void;
  uniqueWeapons: { name: string; id: string }[];
  uniqueEquipments: { name: string; id: string }[];
}

export default function ParticipantsStep({
  participants,
  members,
  user,
  addParticipant,
  addMultipleParticipants,
  removeParticipant,
  updateParticipant,
  uniqueWeapons,
  uniqueEquipments,
}: ParticipantsStepProps) {
  const user_squad_id = user?.squad_id;

  const handleAddSquad = () => {
    // Filter members who have a squad_id and are not already added
    console.log(members);
    const squadMembers = members?.filter(
      (member: any) => member.squad_id === user_squad_id && !participants.find((p: any) => p.userId === member.id),
    );

    // Get array of member IDs to add
    const memberIds = squadMembers?.map((member: any) => member.id) || [];

    // Add all squad members at once
    if (memberIds.length > 0) {
      addMultipleParticipants(memberIds);
    }
  };
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-base font-semibold text-blue-800 dark:text-blue-200 mb-2">👥 Participants</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Add squad members who participated in this session. You are automatically added as the first participant.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleAddSquad}
          className="px-3 py-1 text-sm bg-blue-500 text-white border border-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Add All Squad Members
        </button>
        <select
          onChange={(e) => {
            if (e.target.value) {
              addParticipant(e.target.value);
              e.target.value = "";
            }
          }}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
        >
          <option value="">Add Member</option>
          {members
            ?.filter((member: any) => !participants.find((p: any) => p.userId === member.id))
            .map((member: any) => (
              <option key={member.id} value={member.id}>
                {member.first_name || member.last_name ? `${member.first_name || ""} ${member.last_name || ""}`.trim() : member.email}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-4">
        {participants.map((participant: any, index: number) => {
          const isSniper = participant.userDuty === "Sniper";
          const gridCols = "md:grid-cols-4";

          return (
            <div key={participant.userId} className={`grid grid-cols-1 ${gridCols} gap-4 p-4 bg-gray-50 dark:bg-neutral-700/50 rounded-lg relative`}>
              {participant.userId !== user?.id && (
                <button
                  onClick={() => removeParticipant(index, participant.userId)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                  aria-label="Remove participant"
                >
                  Remove
                </button>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="px-3 py-2 bg-gray-100 dark:bg-neutral-700 rounded-md text-gray-700 dark:text-neutral-300">{participant.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  value={participant.position}
                  onChange={(e) => updateParticipant(index, "position", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                >
                  <option value="Lying">Lying</option>
                  <option value="Standing">Standing</option>
                  <option value="Sitting">Sitting</option>
                  <option value="Operational">Operational</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Duty <span className="text-red-500">*</span>
                </label>
                <select
                  value={participant.userDuty}
                  onChange={(e) => {
                    const newDuty = e.target.value;
                    // Update duty and clear relevant fields in one update
                    if (newDuty === "spotter") {
                      updateParticipant(index, {
                        userDuty: newDuty,
                        weaponId: "",
                        shotsFired: 0,
                      });
                    } else {
                      updateParticipant(index, {
                        userDuty: newDuty,
                        equipmentId: "",
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                >
                  <option value="Sniper">Sniper</option>
                  <option value="Spotter">Spotter</option>
                </select>
              </div>

              {/* Conditional fields based on duty */}
              {isSniper ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Weapon <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={participant.weaponId}
                      onChange={(e) => updateParticipant(index, "weaponId", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                    >
                      <option value="">Select Weapon</option>
                      {uniqueWeapons.map((weapon: { name: string; id: string }) => (
                        <option key={weapon.id} value={weapon.id}>
                          {weapon.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Equipment <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={participant.equipmentId}
                    onChange={(e) => updateParticipant(index, "equipmentId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200"
                  >
                    <option value="">Select Equipment</option>
                    {uniqueEquipments.map((equipment: { name: string; id: string }) => (
                      <option key={equipment.id} value={equipment.id}>
                        {equipment.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
