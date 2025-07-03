import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import AssetsWeaponsTable from "@/components/AssetsWeaponsTable";
import AssetsEquipmentTable from "@/components/AssetsEquipmentTable";
import Header from "@/Headers/Header";
import BaseButton from "@/components/BaseButton";
import BaseDesktopDrawer from "@/components/BaseDrawer/BaseDesktopDrawer";
import BaseInput from "@/components/BaseInput";
import { FileQuestion } from "lucide-react";
import { useEffect, useState } from "react";
import { userStore } from "@/store/userStore";
import { isCommanderOrSquadCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";

export default function AssetsPage() {
  const { weapons, createWeapon } = useStore(weaponsStore);
  const { equipments, createEquipment } = useStore(equipmentStore);
  const { user } = useStore(userStore);

  const weaponsTypes = new Set(weapons.map((weapon) => weapon.weapon_type));
  const equipmentsTypes = new Set(equipments.map((equipment) => equipment.equipment_type));

  const [formType, setFormType] = useState<"weapons" | "equipments" | "">("");

  const teamId = user?.team_id;

  const [isOpen, setIsOpen] = useState(false);

  const [weaponForm, setWeaponForm] = useState({
    weapon_type: "",
    serial_number: "",
    mv: "",
    team_id: teamId,
  });

  const [equipmentForm, setEquipmentForm] = useState({
    equipment_type: "",
    serial_number: "",
    day_night: "",
    team_id: teamId,
  });

  function handleIsOpen(type: "weapons" | "equipments" | "") {
    setFormType(type);

    if (type === "") {
      setIsOpen(false);
      return;
    }
    setIsOpen(!isOpen);
  }
  useEffect(() => {
    console.log(user?.user_role);
  }, []);

  async function handleCreateWeapon() {
    console.log("Creating weapon:", weaponForm);
    await createWeapon(weaponForm as any);
    handleIsOpen("");
  }

  async function handleCreateEquipment() {
    console.log("Creating equipment:", equipmentForm);
    await createEquipment(equipmentForm as any);
    handleIsOpen("");
  }

  const WeaponsContent = (
    <div className="min-w-[600px] text-white p-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">New Weapon</h2>
        <p className="mt-1 text-sm text-gray-400">Add a new weapon to the inventory.</p>
      </div>

      <select
        className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
        value={weaponForm.weapon_type}
        onChange={(e) => setWeaponForm({ ...weaponForm, weapon_type: e.target.value })}
      >
        <option value="">Select weapon</option>
        {Array.from(weaponsTypes)?.map((weaponType, index) => {
          return (
            <option key={index} value={weaponType}>
              {weaponType}
            </option>
          );
        })}
      </select>
      <BaseInput
        label="Serial Number"
        type="text"
        value={weaponForm.serial_number}
        onChange={(e) => setWeaponForm({ ...weaponForm, serial_number: e.target.value })}
        placeholder="Enter serial number"
        leftIcon={<FileQuestion size={16} className="text-gray-400" />}
        containerClassName="bg-transparent"
      />

      <BaseInput
        label="MV"
        type="number"
        value={weaponForm.mv}
        onChange={(e) => setWeaponForm({ ...weaponForm, mv: e.target.value })}
        placeholder="Enter MV"
        leftIcon={<FileQuestion size={16} className="text-gray-400" />}
        containerClassName="bg-transparent"
      />

      <div className="flex items-center justify-end gap-x-4">
        <button
          type="button"
          onClick={() => handleIsOpen("")}
          className="px-4 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded-md text-sm font-medium text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleCreateWeapon()}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 transition-colors rounded-md text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed"
        >
          Create
        </button>
      </div>
    </div>
  );

  const EquipmentContent = (
    <div className="min-w-[600px] text-white p-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">New Equipment</h2>
        <p className="mt-1 text-sm text-gray-400">Add new equipment to the inventory.</p>
      </div>

      <select
        className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
        value={equipmentForm.equipment_type}
        onChange={(e) => setEquipmentForm({ ...equipmentForm, equipment_type: e.target.value })}
      >
        <option value="">Select equipment</option>
        {Array.from(equipmentsTypes)?.map((equipmentsType, index) => {
          return (
            <option key={index} value={equipmentsType}>
              {equipmentsType}
            </option>
          );
        })}
      </select>

      <BaseInput
        label="Serial Number (Name)"
        type="text"
        value={equipmentForm.serial_number}
        onChange={(e) => setEquipmentForm({ ...equipmentForm, serial_number: e.target.value })}
        placeholder="Enter serial number"
        leftIcon={<FileQuestion size={16} className="text-gray-400" />}
        containerClassName="bg-transparent"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Day/Night</label>
        <select
          className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
          value={equipmentForm.day_night}
          onChange={(e) => setEquipmentForm({ ...equipmentForm, day_night: e.target.value })}
        >
          <option value="">Select day/night</option>
          <option value="day">Day</option>
          <option value="night">Night</option>
        </select>
      </div>

      <div className="flex items-center justify-end gap-x-4">
        <button
          type="button"
          onClick={() => handleIsOpen("")}
          className="px-4 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded-md text-sm font-medium text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateEquipment}
          type="button"
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 transition-colors rounded-md text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed"
        >
          Create
        </button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen">
      <Header title="Assets"> </Header>
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="flex flex-col gap-8">
          <div className="bg-gradient-to-br rounded-2xl border border-white/10 shadow-lg shadow-black/20 transition-all duration-300 relative">
            {isCommanderOrSquadCommander(user?.user_role as UserRole) && (
              <BaseButton
                type="button"
                onClick={() => handleIsOpen("weapons")}
                className="px-4 py-2 bg-[#222] border border-white/10 rounded-lg text-sm font-medium text-white transition-all top-2 right-2 absolute"
              >
                Add Weapons
              </BaseButton>
            )}

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-semibold text-white">Weapons Inventory</h2>
                <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full border border-indigo-500/30">
                  {weapons.length} items
                </div>
              </div>
              <AssetsWeaponsTable weapons={weapons} />
            </div>
          </div>

          <div className="bg-gradient-to-br rounded-2xl border border-white/10 shadow-lg shadow-black/20 transition-all duration-300 relative">
            {isCommanderOrSquadCommander(user?.user_role as UserRole) && (
              <BaseButton
                type="button"
                onClick={() => handleIsOpen("equipments")}
                className="px-4 py-2 bg-[#222] border border-white/10 rounded-lg text-sm font-medium text-white transition-all top-2 right-2 absolute"
              >
                Add Equipments
              </BaseButton>
            )}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                <h2 className="text-xl font-semibold text-white">Equipment Inventory</h2>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm rounded-full border border-emerald-500/30">
                  {equipments.length} items
                </div>
              </div>
              <AssetsEquipmentTable equipments={equipments} />
            </div>
          </div>
        </div>
      </div>
      <BaseDesktopDrawer isOpen={isOpen} setIsOpen={() => handleIsOpen("")} title={`new ${formType}`}>
        {formType === "weapons" ? WeaponsContent : EquipmentContent}
      </BaseDesktopDrawer>
    </div>
  );
}
