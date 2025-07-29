import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { userStore } from "@/store/userStore";
import AssetsWeaponsTable from "@/components/AssetsWeaponsTable";
import BaseDesktopDrawer from "@/components/BaseDrawer/BaseDesktopDrawer";
import BaseInput from "@/components/base/BaseInput";
import BaseMobileDrawer from "@/components/BaseDrawer/BaseMobileDrawer";
import { FileQuestion } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import { BASE_WEAPONS } from "@/utils/BaseData/BaseWeapons";
import { primitives } from "@/styles/core";
import { Weapon } from "@/types/weapon";
import WeaponUsageModal from "./WeaponUsageModal";
import { performanceStore } from "@/store/performance";
import BaseConfirmDeleteModal from "@/components/BaseConfirmDeleteModal";

export default function WeaponsTab({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const { weapons, createWeapon, updateWeapon, deleteWeapon } = useStore(weaponsStore);
  const { getWeaponUsageStats } = useStore(performanceStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [selectedWeaponForUsage, setSelectedWeaponForUsage] = useState<Weapon | null>(null);
  const weaponsTypes = new Set(BASE_WEAPONS.map((weapon) => weapon.weapon_type));
  const teamId = user?.team_id;
  const [isDeleteWeapon, setIsDeleteWeapon] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [weaponForm, setWeaponForm] = useState<Weapon>({
    weapon_type: "",
    serial_number: "",
    mv: "",
    team_id: teamId as string,
  });

  useEffect(() => {
    if (selectedWeapon) {
      setWeaponForm({ ...selectedWeapon });
    }
  }, [selectedWeapon]);

  const handleCancel = () => {
    setWeaponForm({
      weapon_type: "",
      serial_number: "",
      mv: "",
      team_id: teamId as string,
    });
    setSelectedWeapon(null);
    setIsOpen(false);
  };

  async function handleCreateWeapon() {
    if (weaponForm.weapon_type === "" || weaponForm.serial_number === "" || weaponForm.mv === "") {
      toast.info("Please fill all the fields");
      return;
    }
    try {
      if (selectedWeapon) {
        await updateWeapon(selectedWeapon.id!, weaponForm as any);
        toast.success("Weapon updated successfully");
      } else {
        await createWeapon(weaponForm as any);
        toast.success("Weapon created successfully");
      }
      setWeaponForm(weaponForm);
    } catch (error) {
      toast.error("Failed to create weapon");
    } finally {
      handleCancel();
    }
  }

  const handleViewUsage = (weapon: Weapon) => {
    setIsUsageModalOpen(true);
    setSelectedWeaponForUsage(weapon);
    getWeaponUsageStats(weapon.id!);
  };

  const handleEditWeapon = (weapon: Weapon) => {
    setSelectedWeapon(weapon);
    setIsOpen(true);
  };

  const handleDeleteWeapon = (weapon: Weapon) => {
    setIsDeleteWeapon(true);
    setSelectedWeapon(weapon);
  };

  const handleDeleteWeaponConfirm = async () => {
    if (!selectedWeapon) {
      toast.error("No weapon selected");
      return;
    }
    try {
      await deleteWeapon(selectedWeapon!.id!);
      toast.success("Weapon deleted successfully");
    } catch (error) {
      toast.error("Failed to delete weapon");
    } finally {
      setIsDeleteWeapon(false);
      setSelectedWeapon(null);
    }
  };

  const WeaponsContent = (
    <div
      className={` ${isMobile ? "w-full" : "w-[600px]"} p-4 space-y-6 transition-colors duration-200`}
      style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}
    >
      <select
        className="min-h-9 rounded-lg px-3 text-sm border transition-colors duration-200 h-full"
        style={{
          backgroundColor: theme === "dark" ? `${primitives.grey.grey800}80` : primitives.white.white,
          color: theme === "dark" ? primitives.white.white : primitives.grey.grey900,
          borderColor: theme === "dark" ? primitives.grey.grey700 : primitives.grey.grey300,
        }}
        value={weaponForm.weapon_type}
        onChange={(e) => setWeaponForm({ ...weaponForm, weapon_type: e.target.value })}
      >
        <option value="">Select weapon</option>
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
        className="h-full"
      />

      <BaseInput
        label="MV"
        type="number"
        value={weaponForm.mv || ""}
        onChange={(e) => setWeaponForm({ ...weaponForm, mv: e.target.value })}
        placeholder="Enter MV"
        leftIcon={<FileQuestion size={16} style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey500 }} />}
        containerClassName="bg-transparent"
        className="h-full"
      />

      <div className="flex items-center justify-end gap-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-1.5 transition-colors rounded-md text-sm font-medium"
          style={{
            backgroundColor: theme === "dark" ? `${primitives.white.white}0D` : primitives.grey.grey100,
            color: theme === "dark" ? primitives.white.white : primitives.grey.grey700,
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
            color: primitives.white.white,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primitives.blue.blue400;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = primitives.blue.blue500;
          }}
        >
          {selectedWeapon ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: primitives.blue.blue400 }}></div>
          <h2
            className="text-lg font-semibold transition-colors duration-200"
            style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}
          >
            Weapons Inventory
          </h2>
          <div
            className="px-3 py-1 text-sm rounded border"
            style={{
              backgroundColor: theme === "dark" ? `${primitives.blue.blue500}33` : primitives.blue.blue100,
              color: theme === "dark" ? primitives.blue.blue200 : primitives.blue.blue600,
              borderColor: theme === "dark" ? `${primitives.blue.blue500}4D` : primitives.blue.blue300,
            }}
          >
            {weapons.length} items
          </div>
        </div>
      </div>

      <AssetsWeaponsTable weapons={weapons} onDeleteWeapon={handleDeleteWeapon} onViewUsage={handleViewUsage} onEditWeapon={handleEditWeapon} />
      <BaseConfirmDeleteModal
        isOpen={isDeleteWeapon}
        onClose={() => setIsDeleteWeapon(false)}
        onConfirm={handleDeleteWeaponConfirm}
        title="Delete Weapon"
        message="Are you sure you want to delete this weapon?"
        isLoading={false}
      />

      {!isMobile && (
        <BaseDesktopDrawer isOpen={isOpen} setIsOpen={setIsOpen} title={selectedWeapon?.id ? "Edit Weapon" : "New Weapon"} onClose={handleCancel}>
          {WeaponsContent}
        </BaseDesktopDrawer>
      )}
      {isMobile && (
        <BaseMobileDrawer isOpen={isOpen} setIsOpen={setIsOpen} title={selectedWeapon?.id ? "Edit Weapon" : "New Weapon"} onClose={handleCancel}>
          {WeaponsContent}
        </BaseMobileDrawer>
      )}
      <WeaponUsageModal isOpen={isUsageModalOpen} onClose={() => setIsUsageModalOpen(false)} weapon={selectedWeaponForUsage} />
    </div>
  );
}
