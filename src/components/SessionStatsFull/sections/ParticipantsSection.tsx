import { Users, Trash2, UserPlus } from "lucide-react";
import { Participant } from "../types";
import { SectionHeader } from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";

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
  autoSyncPosition: boolean;
  setAutoSyncPosition: (value: boolean) => void;
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
  autoSyncPosition,
  setAutoSyncPosition,
}: ParticipantsSectionProps) => {
  const { theme } = useTheme();

  return (
    <div className="w-full max-w-2xl mx-auto" id="participants">
      <SectionHeader section={section} />

      {/* Add Controls - Compact on mobile */}
      <div className="flex flex-col gap-2 mt-4 sm:mt-6">
        <select
          className={`w-full py-2 h-10 sm:h-12 px-3 sm:px-4 rounded-lg text-sm sm:text-base border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            theme === "dark"
              ? "bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500 focus:ring-indigo-500/20"
              : "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
          }`}
          onChange={(e) => {
            if (e.target.value) {
              addParticipant(e.target.value);
              e.target.value = "";
            }
          }}
        >
          <option value="">Add team member</option>
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
          disabled={isCommander(user?.user_role as UserRole)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 h-10 sm:h-auto bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Users className="w-4 h-4" />
          <span>Add Squad</span>
        </button>
        {/* Auto Sync Toggle */}
        <label className="inline-flex items-center gap-2 text-xs sm:text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoSyncPosition}
            onChange={(e) => setAutoSyncPosition(e.target.checked)}
            className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-transparent"
          />
          <span className={theme === "dark" ? "text-zinc-300" : "text-gray-600"}>Auto Sync Position</span>
        </label>
      </div>

      {/* Mobile Participants List - Compact Design */}
      <div className="md:hidden mt-4 space-y-2">
        {participants.length > 0 ? (
          participants.map((participant, index) => (
            <div
              key={participant.userId}
              className={`rounded-lg border overflow-hidden transition-all ${
                theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"
              }`}
            >
              {/* Compact Header */}
              <div className={`px-3 py-2 flex items-center justify-between ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      theme === "dark" ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="truncate">
                    <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{participant.name}</span>
                    {participant.userId === user?.id && (
                      <span className={`text-xs ml-1 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>(You)</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeParticipant(participant.userId)}
                  className={`p-1.5 rounded transition-colors flex-shrink-0 ${
                    theme === "dark" ? "text-zinc-400 hover:text-red-400" : "text-gray-400 hover:text-red-600"
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Compact Form Fields */}
              <div className="p-3 space-y-2">
                {/* Role and Position in one row */}
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={participant.userDuty}
                    onChange={(e) => updateParticipant(participant.userId, "userDuty", e.target.value)}
                    className={`w-full h-8 px-2 rounded text-xs border transition-all ${
                      theme === "dark"
                        ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500"
                        : "bg-gray-50 border-gray-200 focus:border-indigo-500"
                    }`}
                  >
                    <option value="">Role</option>
                    <option value="Sniper">Sniper</option>
                    <option value="Spotter">Spotter</option>
                  </select>

                  <select
                    value={participant.position}
                    onChange={(e) => updateParticipant(participant.userId, "position", e.target.value)}
                    className={`w-full h-8 px-2 rounded text-xs border ${
                      theme === "dark"
                        ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500"
                        : "bg-gray-50 border-gray-200 focus:border-indigo-500"
                    }`}
                  >
                    <option value="Lying">Lying</option>
                    <option value="Standing">Standing</option>
                    <option value="Sitting">Sitting</option>
                    <option value="Operational">Operational</option>
                  </select>
                </div>

                {/* Weapon/Equipment */}
                <select
                  value={participant.userDuty === "Sniper" ? participant.weaponId || "" : participant.equipmentId || ""}
                  onChange={(e) =>
                    updateParticipant(participant.userId, participant.userDuty === "Sniper" ? "weaponId" : "equipmentId", e.target.value)
                  }
                  className={`w-full h-8 px-2 rounded text-xs border transition-all ${
                    theme === "dark"
                      ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500"
                      : "bg-gray-50 border-gray-200 focus:border-indigo-500"
                  }`}
                >
                  <option value="">{participant.userDuty === "Sniper" ? "Select weapon" : "Select equipment"}</option>
                  {participant.userDuty === "Sniper"
                    ? weapons.map((w: any) => (
                        <option key={w.id} value={w.id}>
                          {w.weapon_type} - {w.serial_number}
                        </option>
                      ))
                    : equipments.map((e: any) => (
                        <option key={e.id} value={e.id}>
                          {e.equipment_type} - {e.serial_number}
                        </option>
                      ))}
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className={`rounded-lg border p-6 text-center ${theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"}`}>
            <UserPlus className={`w-10 h-10 mx-auto mb-3 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
            <h3 className={`text-base font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-1`}>No participants yet</h3>
            <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Add team members to start</p>
          </div>
        )}
      </div>

      {/* Desktop Participants List */}
      <div
        className={`hidden md:block mt-6 rounded-xl border overflow-hidden ${theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-gray-200"}`}
      >
        {participants.length > 0 ? (
          <>
            {/* Compact Table Header */}
            <div
              className={`grid grid-cols-5 gap-2 px-4 py-2 text-xs font-medium border-b ${
                theme === "dark" ? "bg-zinc-800/30 border-zinc-700 text-zinc-400" : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            >
              <div className="col-span-1">Name</div>
              <div className="col-span-1">Role</div>
              <div className="col-span-1">Position</div>
              <div className="col-span-1">Weapon/Equipment</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Participants Rows - Compact */}
            <div className="divide-y divide-zinc-700 dark:divide-zinc-800">
              {participants.map((participant, index) => (
                <div
                  key={participant.userId}
                  className={`grid grid-cols-5 gap-2 px-4 py-2 items-center transition-colors ${
                    theme === "dark" ? "hover:bg-zinc-800/20" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Name */}
                  <div className="col-span-1 flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        theme === "dark" ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {participant.name}
                        {participant.userId === user?.id && (
                          <span className={`text-xs ml-1 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>(You)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-1">
                    <select
                      value={participant.userDuty}
                      onChange={(e) => updateParticipant(participant.userId, "userDuty", e.target.value)}
                      className={`w-full h-8 px-2 rounded text-xs border transition-all ${
                        theme === "dark"
                          ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500"
                          : "bg-gray-50 border-gray-200 focus:border-indigo-500"
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
                      className={`w-full h-8 px-2 rounded text-xs border ${
                        theme === "dark"
                          ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500"
                          : "bg-gray-50 border-gray-200 focus:border-indigo-500"
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
                      value={participant.userDuty === "Sniper" ? participant.weaponId || "" : participant.equipmentId || ""}
                      onChange={(e) =>
                        updateParticipant(participant.userId, participant.userDuty === "Sniper" ? "weaponId" : "equipmentId", e.target.value)
                      }
                      className={`w-full h-8 px-2 rounded text-xs border transition-all ${
                        theme === "dark"
                          ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500"
                          : "bg-gray-50 border-gray-200 focus:border-indigo-500"
                      }`}
                    >
                      <option value=""></option>
                      {participant.userDuty === "Sniper"
                        ? weapons.map((weapon: any) => (
                            <option key={weapon.id} value={weapon.id || ""}>
                              {weapon.weapon_type} - {weapon.serial_number}
                            </option>
                          ))
                        : equipments.map((equipment: any) => (
                            <option key={equipment.id} value={equipment.id || ""}>
                              {equipment.equipment_type} - {equipment.serial_number}
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
