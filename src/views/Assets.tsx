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
import { useTheme } from "@/contexts/ThemeContext";

export default function AssetsPage() {
  const { weapons, createWeapon } = useStore(weaponsStore);
  const { equipments, createEquipment } = useStore(equipmentStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();

  const weaponsTypes = new Set(weapons.map((weapon) => weapon.weapon_type));
  const equipmentsTypes = new Set(equipments.map((equipment) => equipment.equipment_type));

  const [formType, setFormType] = useState<"weapons" | "equipments" | "">("");
  const [activeTab, setActiveTab] = useState<"weapons" | "equipments">("weapons");

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
    <div className={`min-w-[600px] p-4 space-y-6 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      <div>
        <h2 className="text-xl font-semibold">New Weapon</h2>
        <p className={`mt-1 text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Add a new weapon to the inventory.
        </p>
      </div>

      <select
        className={`w-full min-h-9 rounded-lg px-3 py-2 text-sm border transition-colors duration-200 ${
          theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
        }`}
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
        leftIcon={<FileQuestion size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />}
        containerClassName="bg-transparent"
      />

      <BaseInput
        label="MV"
        type="number"
        value={weaponForm.mv}
        onChange={(e) => setWeaponForm({ ...weaponForm, mv: e.target.value })}
        placeholder="Enter MV"
        leftIcon={<FileQuestion size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />}
        containerClassName="bg-transparent"
      />

      <div className="flex items-center justify-end gap-x-4">
        <button
          type="button"
          onClick={() => handleIsOpen("")}
          className={`px-4 py-1.5 transition-colors rounded-md text-sm font-medium ${
            theme === "dark" ? "bg-white/5 hover:bg-white/10 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
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
    <div className={`min-w-[600px] p-4 space-y-6 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      <div>
        <h2 className="text-xl font-semibold">New Equipment</h2>
        <p className={`mt-1 text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Add new equipment to the inventory.
        </p>
      </div>

      <select
        className={`w-full min-h-9 rounded-lg px-3 py-2 text-sm border transition-colors duration-200 ${
          theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
        }`}
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
        leftIcon={<FileQuestion size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />}
        containerClassName="bg-transparent"
      />

      <div className="space-y-2">
        <label className={`block text-sm font-medium transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          Day/Night
        </label>
        <select
          className={`w-full min-h-9 rounded-lg px-3 py-2 text-sm border transition-colors duration-200 ${
            theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
          }`}
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
          className={`px-4 py-1.5 transition-colors rounded-md text-sm font-medium ${
            theme === "dark" ? "bg-white/5 hover:bg-white/10 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
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
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              {(["weapons", "equipments"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-1.5 transition-colors ${
                    activeTab === tab
                      ? theme === "dark"
                        ? "bg-white/80 text-gray-900"
                        : "bg-gray-900 text-white"
                      : theme === "dark"
                        ? "bg-white/10 hover:bg-white/20 text-gray-200"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                  }`}
                >
                  {tab === "weapons" ? "Weapons" : "Equipment"}
                </button>
              ))}
            </div>
            {isCommanderOrSquadCommander(user?.user_role as UserRole) && (
              <BaseButton
                type="button"
                onClick={() => handleIsOpen(activeTab)}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  theme === "dark"
                    ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                    : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Add {activeTab === "weapons" ? "Weapon" : "Equipment"}
              </BaseButton>
            )}
          </div>

          {activeTab === "weapons" ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-blue-400 rounded-full"></div>
                <h2 className={`text-lg font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  Weapons Inventory
                </h2>
                <div
                  className={`px-3 py-1 text-sm rounded border ${
                    theme === "dark" ? "bg-blue-500/20 text-blue-200 border-blue-500/30" : "bg-blue-100 text-blue-700 border-blue-300"
                  }`}
                >
                  {weapons.length} items
                </div>
              </div>
              <AssetsWeaponsTable weapons={weapons} />
            </div>
          ) : (
            <div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-emerald-400 rounded-full"></div>
                  <h2 className={`text-lg font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Equipment Inventory
                  </h2>
                  <div
                    className={`px-3 py-1 text-sm rounded border ${
                      theme === "dark"
                        ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/30"
                        : "bg-emerald-100 text-emerald-700 border-emerald-300"
                    }`}
                  >
                    {equipments.length} items
                  </div>
                </div>
              </div>
              <AssetsEquipmentTable equipments={equipments} />
            </div>
          )}
        </div>
      </div>
      <BaseDesktopDrawer isOpen={isOpen} setIsOpen={() => handleIsOpen("")} title={`new ${formType}`}>
        {formType === "weapons" ? WeaponsContent : EquipmentContent}
      </BaseDesktopDrawer>
    </div>
  );
}
