import { useStore } from "zustand";
import { equipmentStore } from "@/store/equipmentStore";
import { userStore } from "@/store/userStore";
import AssetsEquipmentTable from "@/components/AssetsEquipmentTable";
import BaseDesktopDrawer from "@/components/BaseDrawer/BaseDesktopDrawer";
import BaseInput from "@/components/base/BaseInput";
import BaseMobileDrawer from "@/components/BaseDrawer/BaseMobileDrawer";
import { FileQuestion } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { toast } from "react-toastify";
import { BASE_EQUIPMENTS } from "@/utils/BaseData/BaseEquipments";
import { primitives } from "@/styles/core";
import { Equipment } from "@/types/equipment";

export default function EquipmentTab({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const { equipments, createEquipment } = useStore(equipmentStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const equipmentsTypes = new Set(BASE_EQUIPMENTS.map((equipment) => equipment.equipment_type));
  const teamId = user?.team_id;

  const [equipmentForm, setEquipmentForm] = useState({
    equipment_type: "",
    serial_number: "",
    day_night: "",
    team_id: teamId,
  });

  async function handleCreateEquipment() {
    if (equipmentForm.equipment_type === "" || equipmentForm.serial_number === "" || equipmentForm.day_night === "") {
      toast.info("Please fill all the fields");
      return;
    }
    await createEquipment(equipmentForm as any);
    setIsOpen(false);
  }

  const handleDeleteEquipment = (equipment: Equipment) => {
    console.log(equipment);
  };

  const EquipmentContent = (
    <div
      className={` ${isMobile ? "w-full" : "w-[600px]"} p-4 space-y-6 transition-colors duration-200`}
      style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}
    >
      <div>
        <h2 className="text-xl font-semibold">New Equipment</h2>
        <p
          className="mt-1 text-sm transition-colors duration-200"
          style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}
        >
          Add new equipment to the inventory.
        </p>
      </div>

      <select
        className="w-full min-h-9 rounded-lg px-3 py-2 text-sm border transition-colors duration-200"
        style={{
          backgroundColor: theme === "dark" ? `${primitives.grey.grey800}80` : primitives.white.white,
          color: theme === "dark" ? primitives.white.white : primitives.grey.grey900,
          borderColor: theme === "dark" ? primitives.grey.grey700 : primitives.grey.grey300,
        }}
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
        leftIcon={<FileQuestion size={16} style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey500 }} />}
        containerClassName="bg-transparent"
      />

      <div className="space-y-2">
        <label
          className="block text-sm font-medium transition-colors duration-200"
          style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}
        >
          Day/Night
        </label>
        <select
          className="w-full min-h-9 rounded-lg px-3 py-2 text-sm border transition-colors duration-200"
          style={{
            backgroundColor: theme === "dark" ? `${primitives.grey.grey800}80` : primitives.white.white,
            color: theme === "dark" ? primitives.white.white : primitives.grey.grey900,
            borderColor: theme === "dark" ? primitives.grey.grey700 : primitives.grey.grey300,
          }}
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
          onClick={() => setIsOpen(false)}
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
          onClick={handleCreateEquipment}
          type="button"
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
          Create
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: primitives.green.green400 }}></div>
          <h2
            className="text-lg font-semibold transition-colors duration-200"
            style={{ color: theme === "dark" ? primitives.white.white : primitives.grey.grey900 }}
          >
            Equipment Inventory
          </h2>

          <div
            className="px-3 py-1 text-sm rounded border"
            style={{
              backgroundColor: theme === "dark" ? `${primitives.green.green500}33` : primitives.green.green100,
              color: theme === "dark" ? primitives.green.green200 : primitives.green.green600,
              borderColor: theme === "dark" ? `${primitives.green.green500}4D` : primitives.green.green300,
            }}
          >
            {equipments.length} items
          </div>
        </div>
      </div>
      <AssetsEquipmentTable equipments={equipments} onDeleteEquipment={handleDeleteEquipment} />

      {!isMobile && (
        <BaseDesktopDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="new equipments">
          {EquipmentContent}
        </BaseDesktopDrawer>
      )}
      {isMobile && (
        <BaseMobileDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="new equipments">
          {EquipmentContent}
        </BaseMobileDrawer>
      )}
    </div>
  );
}
