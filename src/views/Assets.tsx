// ✅ Add Assets Page (Commander-Only Access)
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { supabase } from "@/services/supabaseClient";
import { toastService } from "@/services/toastService";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import { userStore } from "@/store/userStore";
import Header from "@/Headers/Header";
import AssetsWeaponsTable from "@/components/AssetsWeaponsTable";
import BaseDesktopDrawer from "@/components/BaseDrawer/BaseDesktopDrawer";
import BaseMobileDrawer from "@/components/BaseDrawer/BaseMobileDrawer";
import BaseInput from "@/components/BaseInput";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function AssetsPage() {
  const { weapons, getWeapons } = useStore(weaponsStore);
  const { equipments, getEqipmentsByTeamId } = useStore(equipmentStore);
  const { user } = useStore(userStore);

  const isCommander = user?.user_role === "commander";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetType, setAssetType] = useState<'weapon' | 'equipment'>('weapon');
  const [formData, setFormData] = useState({
    serial_number: '',
    weapon_type: '',
    mv: '',
    equipment_type: '',
    day_night: '',
  });
  const [weaponTypes, setWeaponTypes] = useState<string[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);

  const isMobile = useIsMobile();

  useEffect(() => {
    fetchEnumValues('weapons', 'weapon_type', setWeaponTypes);
    fetchEnumValues('equipment', 'equipment_type', setEquipmentTypes);
    if (user?.team_id) {
      getWeapons(user.team_id);
      getEqipmentsByTeamId(user.team_id);
    }
  }, [user?.team_id]);

  const fetchEnumValues = async (table: string, column: string, setter: (values: string[]) => void) => {
    const { data, error } = await supabase.rpc('get_enum_values', {
      table_name: table,
      column_name: column,
    });
    if (error) {
      console.error(`Failed to load enum for ${table}.${column}`, error);
    } else {
      setter(data.map((row: any) => row.value));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAsset = async () => {
    if (!formData.serial_number.trim()) {
      toastService.error("Serial number is required");
      return;
    }

    let error;
    if (assetType === 'weapon') {
      if (!formData.weapon_type || !formData.mv) {
        toastService.error("Please complete all weapon fields");
        return;
      }
      ({ error } = await supabase.from("weapons").insert({
        serial_number: formData.serial_number,
        weapon_type: formData.weapon_type,
        mv: Number(formData.mv),
        team_id: user?.team_id,
      }));
    } else {
      if (!formData.equipment_type || !formData.day_night) {
        toastService.error("Please complete all equipment fields");
        return;
      }
      ({ error } = await supabase.from("equipment").insert({
        serial_number: formData.serial_number,
        equipment_type: formData.equipment_type,
        day_night: formData.day_night,
        team_id: user?.team_id,
      }));
    }

    if (error) {
      toastService.error("Failed to add asset");
    } else {
      toastService.success("Asset added successfully");
      setIsModalOpen(false);
      setFormData({ serial_number: '', weapon_type: '', mv: '', equipment_type: '', day_night: '' });
      if (user?.team_id) {
        getWeapons(user.team_id);
        getEqipmentsByTeamId(user.team_id);
      }
    }
  };

  const AssetForm = (
    <div className="w-full text-white p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add Asset</h2>
        <div className="flex gap-2">
          <button onClick={() => setAssetType('weapon')} className={`px-3 py-1 rounded ${assetType === 'weapon' ? 'bg-indigo-600' : 'bg-zinc-700'}`}>Weapon</button>
          <button onClick={() => setAssetType('equipment')} className={`px-3 py-1 rounded ${assetType === 'equipment' ? 'bg-indigo-600' : 'bg-zinc-700'}`}>Equipment</button>
        </div>
      </div>

      <BaseInput
        label="Serial Number"
        value={formData.serial_number}
        onChange={(e) => handleChange('serial_number', e.target.value)}
        placeholder="Enter serial number"
      />

      {assetType === 'weapon' ? (
        <>
          <label className="block text-sm font-medium">Weapon Type</label>
          <select className="w-full bg-zinc-800 text-white border border-zinc-600 rounded px-2 py-1" value={formData.weapon_type} onChange={(e) => handleChange('weapon_type', e.target.value)}>
            <option value="">Select type</option>
            {weaponTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <BaseInput
            label="MV (muzzle velocity)"
            type="number"
            value={formData.mv}
            onChange={(e) => handleChange('mv', e.target.value)}
            placeholder="Enter MV"
          />
        </>
      ) : (
        <>
          <label className="block text-sm font-medium">Equipment Type</label>
          <select className="w-full bg-zinc-800 text-white border border-zinc-600 rounded px-2 py-1" value={formData.equipment_type} onChange={(e) => handleChange('equipment_type', e.target.value)}>
            <option value="">Select type</option>
            {equipmentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <BaseInput
            label="Day/Night Capability"
            value={formData.day_night}
            onChange={(e) => handleChange('day_night', e.target.value)}
            placeholder="Enter day or night"
          />
        </>
      )}

      <div className="flex justify-end gap-2">
        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded bg-zinc-700">Cancel</button>
        <button onClick={handleAddAsset} className="px-4 py-2 rounded bg-indigo-600">Add</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 py-8 space-y-4">
      <Header>
        {isCommander && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-white/10 rounded-lg text-sm font-medium text-white transition-all"
          >
            Add Assets
          </button>
        )}
      </Header>

      <div className="flex flex-col gap-4">
        <AssetsWeaponsTable weapons={weapons} />
        {equipments.map((equipment) => (
          <div key={equipment.id}>{equipment.equipment_type}</div>
        ))}
      </div>

      {isCommander && isMobile ? (
        <BaseMobileDrawer isOpen={isModalOpen} setIsOpen={setIsModalOpen} title="Add Asset">
          {AssetForm}
        </BaseMobileDrawer>
      ) : isCommander ? (
        <BaseDesktopDrawer isOpen={isModalOpen} setIsOpen={setIsModalOpen} title="Add Asset" width="600px">
          {AssetForm}
        </BaseDesktopDrawer>
      ) : null}
    </div>
  );
}