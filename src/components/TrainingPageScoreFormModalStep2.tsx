import { useStore } from "zustand";
import SearchableCheckboxList from "./SearchableCheckboxList";
import { weaponsStore } from "@/store/weaponsStore";
import { eqipmentStore } from "@/store/eqipmentStore";
import { ScoreFormValues } from "@/hooks/useScoreForm";
import { Users, UserCircle, Crosshair, Binoculars, Package } from "lucide-react";

interface Step2Props {
  formValues: ScoreFormValues;
  setFormValues: (values: ScoreFormValues) => void;
  formattedMembers: { id: string; label: string }[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function TrainingPageScoreFormModalStep2({ formValues, setFormValues, formattedMembers, searchTerm, setSearchTerm }: Step2Props) {
  const { weapons } = useStore(weaponsStore);
  const { eqipments } = useStore(eqipmentStore);

  function onChangeUserDuty(duty: string, id: string) {
    const newFormValues = {
      ...formValues,
      duties: { ...formValues.duties, [id]: duty },
    };

    if (duty === "Sniper") {
      newFormValues.weapons = { ...formValues.weapons, [id]: null };
      newFormValues.equipments = { ...formValues.equipments, [id]: null };
    } else if (duty === "Spotter") {
      newFormValues.equipments = { ...formValues.equipments, [id]: null };
      newFormValues.weapons = { ...formValues.weapons, [id]: null };
    }

    setFormValues(newFormValues);
  }

  return (
    <div className="w-full">
      {/* Participants Selection */}
      <div className="mb-6 to-indigo-950/90">
        <div className="flex items-center gap-2 mb-3">
          <Users className="text-indigo-400 drop-shadow-glow" size={18} />
          <h2 className="text-base font-semibold text-indigo-200">Squad Members</h2>
        </div>
        <SearchableCheckboxList
          items={formattedMembers}
          selectedIds={formValues.participants}
          setSelectedIds={(ids) => setFormValues({ ...formValues, participants: ids })}
          searchTerm={searchTerm}
          setSearchTerm={(term) => setSearchTerm(term)}
          searchPlaceholder="Search members..."
          emptyMessage="No users available"
          maxHeight={180}
          showBadges
        />
      </div>

      {/* Participant Loadouts */}
      {formValues?.participants?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="text-green-400 drop-shadow-glow" size={18} />
            <h3 className="text-base font-semibold text-green-200 drop-shadow-md">Participant Loadouts</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-green-700/40 via-indigo-700/30 to-transparent ml-3"></div>
          </div>

          <div className="space-y-3">
            {formValues?.participants?.map((id: string) => {
              const member = formattedMembers?.find((m) => m.id === id);
              const userDuty = formValues?.duties?.[id];

              return (
                <div
                  key={id}
                  className="bg-gradient-to-br from-indigo-900/20 via-zinc-900/30 to-indigo-950/20 p-4 rounded-xl border border-indigo-800/30 shadow"
                >
                  <div className="grid grid-cols-1 items-end md:grid-cols-2 gap-4">
                    {/* Member Info and Duty Selection */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <UserCircle size={16} className="text-indigo-400 drop-shadow-glow" />
                        <p className="text-sm font-medium text-indigo-100">{member?.label}</p>
                      </div>

                      <div>
                        <label className="flex items-center gap-1.5 text-sm text-indigo-200 font-medium mb-1.5">
                          <UserCircle size={14} className="text-indigo-400" />
                          Combat Role
                        </label>
                        <select
                          value={userDuty || ""}
                          onChange={(e) => onChangeUserDuty(e.target.value as any, id)}
                          className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white 
                                                             border border-indigo-700 hover:border-indigo-500 focus:border-indigo-400 
                                                             focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200
                                                             appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: "right 0.5rem center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "1.2em 1.2em",
                            paddingRight: "2rem",
                          }}
                        >
                          <option value="" className="bg-zinc-800">
                            Select combat role
                          </option>
                          <option value="Sniper" className="bg-zinc-800">
                            🎯 Sniper
                          </option>
                          <option value="Spotter" className="bg-zinc-800">
                            🔭 Spotter
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Equipment Selection */}
                    <div className="space-y-3">
                      {userDuty === "Sniper" && (
                        <div>
                          <label className="flex items-center gap-1.5 text-sm text-indigo-200 font-medium mb-1.5">
                            <Crosshair size={14} className="text-indigo-400" />
                            Weapon
                          </label>
                          <select
                            value={formValues?.weapons?.[id] || ""}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                weapons: { ...formValues.weapons, [id]: e.target.value },
                              })
                            }
                            className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white 
                                                                 border border-indigo-700 hover:border-indigo-500 focus:border-indigo-400 
                                                                 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200
                                                                 appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: "right 0.5rem center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "1.2em 1.2em",
                              paddingRight: "2rem",
                            }}
                          >
                            <option value="" className="bg-zinc-800">
                              Select weapon
                            </option>
                            {weapons?.map((weapon: any) => (
                              <option key={weapon.id} value={weapon.id} className="bg-zinc-800">
                                {weapon.weapon_type} — {weapon.serial_number}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {userDuty === "Spotter" && (
                        <div>
                          <label className="flex items-center gap-1.5 text-sm text-indigo-200 font-medium mb-1.5">
                            <Binoculars size={14} className="text-blue-400" />
                            Equipment
                          </label>
                          <select
                            value={formValues.equipments?.[id] || ""}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                equipments: { ...formValues.equipments, [id]: e.target.value },
                              })
                            }
                            className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white 
                                                                 border border-blue-700 hover:border-blue-500 focus:border-blue-400 
                                                                 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200
                                                                 appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: "right 0.5rem center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "1.2em 1.2em",
                              paddingRight: "2rem",
                            }}
                          >
                            <option value="" className="bg-zinc-800">
                              Select equipment
                            </option>
                            {eqipments?.map((equipment: any) => (
                              <option key={equipment.id} value={equipment.id} className="bg-zinc-800">
                                {equipment.equipment_type} — {equipment.serial_number}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {!userDuty && (
                        <div className="flex items-center justify-center h-[100px] text-sm text-indigo-400">
                          Select a combat role to configure equipment
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {formValues?.participants?.length === 0 && (
        <div className="text-center py-8 bg-gradient-to-br from-indigo-900/20 via-zinc-900/30 to-indigo-950/20 rounded-xl border border-indigo-800/30 shadow">
          <Users className="h-10 w-10 text-indigo-600 mx-auto mb-3 drop-shadow-glow" />
          <p className="text-indigo-300 mb-1">No participants selected</p>
          <p className="text-indigo-400 text-sm">Select squad members from the list above to configure their loadouts</p>
        </div>
      )}
    </div>
  );
}
