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
    <div className="min-h-screen ">
      <Header title="Assets"> </Header>
      <div className="px-4 md:px-6 py-4 2xl:px-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/"
                  className={`hover:text-purple-500 transition-colors ${
                    theme === "dark" ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>Assets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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