import { UserCircle, Crosshair, Binoculars } from "lucide-react";

export default function TrainingPageScoreFormModalUserParticipant({
  member,
  userDuty,
  onChangeUserDuty,
  id,
  formValues,
  setFormValues,
  weapons,
  equipment,
}: {
  member: any;
  userDuty: any;
  onChangeUserDuty: any;
  id: any;
  formValues: any;
  setFormValues: any;
  weapons: any;
  equipment: any;
}) {
  console.log(equipment);
  return (
    <div className="grid grid-cols-1 items-end md:grid-cols-2 gap-4 py-2">
      {/* Member Info and Duty Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <UserCircle size={16} className="text-indigo-400 drop-shadow-glow" />
          <p className="text-sm font-medium text-indigo-100">{member?.label}</p>
        </div>

        <div className="flex items-center h-full">
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
              Sniper
            </option>
            <option value="Spotter" className="bg-zinc-800">
              Spotter
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
              value={formValues?.equipment?.[id] || ""}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  equipment: { ...formValues.equipment, [id]: e.target.value },
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
              {equipment?.map((equipment: any) => (
                <option key={equipment.id} value={equipment.id} className="bg-zinc-800">
                  {equipment.equipment_type} — {equipment.serial_number}
                </option>
              ))}
            </select>
          </div>
        )}

        {!userDuty && <div className="flex items-center justify-center  text-sm text-indigo-400">Select a combat role to configure equipment</div>}
      </div>
    </div>
  );
}
