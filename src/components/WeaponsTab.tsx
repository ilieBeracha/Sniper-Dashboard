import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { userStore } from "@/store/userStore";
import AssetsWeaponsTable from "@/components/AssetsWeaponsTable";
import BaseButton from "@/components/BaseButton";
import BaseDesktopDrawer from "@/components/BaseDrawer/BaseDesktopDrawer";
import BaseInput from "@/components/BaseInput";
import BaseMobileDrawer from "@/components/BaseDrawer/BaseMobileDrawer";
import { FileQuestion } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import { BASE_WEAPONS } from "@/utils/BaseData/BaseWeapons";
import { isCommanderOrSquadCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";

export default function WeaponsTab() {
  const { weapons, createWeapon } = useStore(weaponsStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();

  const weaponsTypes = new Set(weapons.map((weapon) => weapon.weapon_type));
  const baseWeapons = BASE_WEAPONS.map((weapon) => ({ ...weapon, team_id: user?.team_id }));
  const teamId = user?.team_id;

  const [isOpen, setIsOpen] = useState(false);
  const [weaponForm, setWeaponForm] = useState({
    weapon_type: "",
    serial_number: "",
    mv: "",
    team_id: teamId,
  });

  function handleIsOpen() {
    setIsOpen(!isOpen);
  }

  async function handleCreateWeapon() {
    if (weaponForm.weapon_type === "" || weaponForm.serial_number === "" || weaponForm.mv === "") {
      toast.info("Please fill all the fields");
      return;
    }
    await createWeapon(weaponForm as any);
    setIsOpen(false);
  }

  const WeaponsContent = (
    <div
      className={` ${isMobile ? "w-full" : "w-[600px]"} p-4 space-y-6 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
    >
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
        {baseWeapons.map((weapon) => (
          <option key={weapon.id} value={weapon.weapon_type}>
            {weapon.weapon_type}
          </option>
        ))}
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
          onClick={() => setIsOpen(false)}
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
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
        {isCommanderOrSquadCommander(user?.user_role as UserRole) && (
          <BaseButton style="purple" onClick={handleIsOpen}>
            Add Weapon
          </BaseButton>
        )}
      </div>
      <AssetsWeaponsTable weapons={weapons} />
      
      {!isMobile && (
        <BaseDesktopDrawer isOpen={isOpen} setIsOpen={() => setIsOpen(false)} title="new weapons">
          {WeaponsContent}
        </BaseDesktopDrawer>
      )}
      {isMobile && (
        <BaseMobileDrawer isOpen={isOpen} setIsOpen={() => setIsOpen(false)} title="new weapons">
          {WeaponsContent}
        </BaseMobileDrawer>
      )}
    </div>
  );
}