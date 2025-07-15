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

export default function EquipmentTab({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const { equipments, createEquipment } = useStore(equipmentStore);
  const { user } = useStore(userStore);
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const equipmentsTypes = new Set(equipments.map((equipment) => equipment.equipment_type));
  const baseEquipments = BASE_EQUIPMENTS.map((equipment) => ({ ...equipment, team_id: user?.team_id }));
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
        {baseEquipments.map((equipment) => (
          <option key={equipment.id} value={equipment.equipment_type}>
            {equipment.equipment_type}
          </option>
        ))}
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
          onClick={() => setIsOpen(false)}
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-emerald-400 rounded-full"></div>
          <h2 className={`text-lg font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Equipment Inventory
          </h2>
          <div
            className={`px-3 py-1 text-sm rounded border ${
              theme === "dark" ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border-emerald-300"
            }`}
          >
            {equipments.length} items
          </div>
        </div>
      </div>
      <AssetsEquipmentTable equipments={equipments} />

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
