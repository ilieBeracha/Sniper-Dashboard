import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { userStore } from "@/store/userStore";
import AssetsWeaponsTable from "@/components/AssetsWeaponsTable";
import BaseDesktopDrawer from "@/components/BaseDrawer/BaseDesktopDrawer";
import BaseInput from "@/components/base/BaseInput";
import BaseMobileDrawer from "@/components/BaseDrawer/BaseMobileDrawer";
import { FileQuestion } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import { BASE_WEAPONS } from "@/utils/BaseData/BaseWeapons";
import { primitives } from "@/styles/core";

export default function WeaponsTab({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const { weapons, createWeapon } = useStore(weaponsStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();

  const weaponsTypes = new Set(weapons.map((weapon) => weapon.weapon_type));
  const baseWeapons = BASE_WEAPONS.map((weapon) => ({ ...weapon, team_id: user?.team_id }));
  const teamId = user?.team_id;

  const [weaponForm, setWeaponForm] = useState({
    weapon_type: "",
    serial_number: "",
    mv: "",
    team_id: teamId,
  });

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
      className={` ${isMobile ? "w-full" : "w-[600px]"} p-4 space-y-6 transition-colors duration-200`}
      style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}
    >
      <div>
        <h2 className="text-xl font-semibold">New Weapon</h2>
        <p className="mt-1 text-sm transition-colors duration-200" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
          Add a new weapon to the inventory.
        </p>
      </div>

      <select
        className="w-full min-h-9 rounded-lg px-3 py-2 text-sm border transition-colors duration-200"
        style={{
          backgroundColor: theme === "dark" ? `${primitives.grey.grey800}80` : primitives.white.white,
          color: theme === "dark" ? primitives.white.white : primitives.grey.grey900,
          borderColor: theme === "dark" ? primitives.grey.grey700 : primitives.grey.grey300
        }}
        value={weaponForm.weapon_type}
        onChange={(e) => setWeaponForm({ ...weaponForm, weapon_type: e.target.value })}
      >
        <option value="">Select weapon</option>
        {baseWeapons.map((weapon) => (
          <option key={weapon.id} value={weapon.weapon_type}>
            {weapon.weapon_type}
          </option>
        ))}
        {Array.from(weaponsTypes)?.map((weaponType, index) => (
          <option key={index} value={weaponType}>
            {weaponType}
          </option>
        ))}
      </select>

      <BaseInput
        label="Serial Number"
        type="text"
        value={weaponForm.serial_number}
        onChange={(e) => setWeaponForm({ ...weaponForm, serial_number: e.target.value })}
        placeholder="Enter serial number"
        leftIcon={<FileQuestion size={16} style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey500 }} />}
        containerClassName="bg-transparent"
      />

      <BaseInput
        label="MV"
        type="number"
        value={weaponForm.mv}
        onChange={(e) => setWeaponForm({ ...weaponForm, mv: e.target.value })}
        placeholder="Enter MV"
        leftIcon={<FileQuestion size={16} style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey500 }} />}
        containerClassName="bg-transparent"
      />

      <div className="flex items-center justify-end gap-x-4">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-1.5 transition-colors rounded-md text-sm font-medium"
          style={{
            backgroundColor: theme === "dark" ? `${primitives.white.white}0D` : primitives.grey.grey100,
            color: theme === "dark" ? primitives.white.white : primitives.grey.grey700
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === "dark" ? `${primitives.white.white}1A` : primitives.grey.grey200;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme === "dark" ? `${primitives.white.white}0D` : primitives.grey.grey100;
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreateWeapon}
          className="px-4 py-1.5 transition-colors rounded-md text-sm font-medium shadow-sm disabled:cursor-not-allowed"
          style={{
            backgroundColor: primitives.blue.blue500,
            color: primitives.white.white
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primitives.blue.blue400;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = primitives.blue.blue500;
          }}
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
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: primitives.blue.blue400 }}></div>
          <h2 className="text-lg font-semibold transition-colors duration-200" style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}>
            Weapons Inventory
          </h2>
          <div
            className="px-3 py-1 text-sm rounded border"
            style={{
              backgroundColor: theme === "dark" ? `${primitives.blue.blue500}33` : primitives.blue.blue100,
              color: theme === "dark" ? primitives.blue.blue200 : primitives.blue.blue600,
              borderColor: theme === "dark" ? `${primitives.blue.blue500}4D` : primitives.blue.blue300
            }}
          >
            {weapons.length} items
          </div>
        </div>
      </div>

      <AssetsWeaponsTable weapons={weapons} />

      {!isMobile && (
        <BaseDesktopDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="new weapons">
          {WeaponsContent}
        </BaseDesktopDrawer>
      )}
      {isMobile && (
        <BaseMobileDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="new weapons">
          {WeaponsContent}
        </BaseMobileDrawer>
      )}
    </div>
  );
}
