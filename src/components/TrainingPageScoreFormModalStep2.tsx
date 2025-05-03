import { useStore } from "zustand";
import SearchableCheckboxList from "./SearchableCheckboxList";
import { weaponsStore } from "@/store/weaponsStore";
import { eqipmentStore } from "@/store/eqipmentStore";

import { ScoreFormValues } from "@/hooks/useScoreForm";

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
        <div className="grid grid-cols-1 w-full gap-6 min-h-[200px] ">
            <div className="max-w-full bg-white/5 p-4 rounded-md border border-white/10">
                <label className="block text-sm text-gray-400 mb-1.5">Participants</label>
                <SearchableCheckboxList
                    items={formattedMembers}
                    selectedIds={formValues.participants}
                    setSelectedIds={(ids) => setFormValues({ ...formValues, participants: ids })}
                    searchTerm={searchTerm}
                    setSearchTerm={(term) => setSearchTerm(term)}
                    searchPlaceholder="Search members..."
                    emptyMessage="No users"
                    maxHeight={200}
                    showBadges
                />
            </div>

            <div>
                {formValues?.participants?.length > 0 && (
                    <ul className="space-y-3 w-full">
                        {formValues?.participants?.map((id: string) => {
                            <h2 className="text-lg text-gray-400 my-3">Participant Loadout</h2>
                            const member = formattedMembers?.find((m) => m.id === id);
                            const userDuty = formValues?.duties?.[id];

                            return (
                                <li key={id} className="border-b border-white/10 py-6 grid grid-cols-3 items-end gap-6">

                                    <div className="col-span-1 flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm text-white font-medium">{member?.label}</p>
                                            <select
                                                value={userDuty || ""}
                                                onChange={(e) => onChangeUserDuty(e.target.value as any, id)}
                                                className="w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="">Select Duty</option>
                                                <option value="Sniper">Sniper</option>
                                                <option value="Spotter">Spotter</option>
                                            </select>
                                        </div>
                                        {userDuty === "Sniper" && (
                                            <>
                                                <label className="text-sm text-white">Weapon</label>
                                                <select
                                                    value={formValues?.weapons?.[id] || ""}
                                                    onChange={e =>
                                                        setFormValues({
                                                            ...formValues,
                                                            weapons: { ...formValues.weapons, [id]: e.target.value },
                                                        })
                                                    }
                                                    className="w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:ring-indigo-500 sm:text-sm"
                                                >
                                                    <option value="">Select weapon</option>
                                                    {weapons?.map((weapon: any) => (
                                                        <option key={weapon.id} value={weapon.id}>
                                                            {weapon.weapon_type} — {weapon.serial_number}
                                                        </option>
                                                    ))}
                                                </select>
                                            </>
                                        )}

                                        {userDuty === "Spotter" && (
                                            <>
                                                <label className="text-sm text-white">Equipment</label>
                                                <select
                                                    value={formValues.equipments?.[id] || ""}
                                                    onChange={e =>
                                                        setFormValues({
                                                            ...formValues,
                                                            equipments: { ...formValues.equipments, [id]: e.target.value },
                                                        })
                                                    }
                                                    className="w-full rounded-md bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 focus:ring-indigo-500 sm:text-sm"
                                                >
                                                    <option value="">Select equipment</option>
                                                    {eqipments?.map((equipment: any) => (
                                                        <option key={equipment.id} value={equipment.id}>
                                                            {equipment.equipment_type} — {equipment.serial_number}
                                                        </option>
                                                    ))}
                                                </select>
                                            </>
                                        )}
                                    </div>

                                    <div className="col-span-1"></div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
