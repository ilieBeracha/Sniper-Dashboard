import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import AssetsWeaponsTable from "@/components/AssetsWeaponsTable";
import AssetsEquipmentTable from "@/components/AssetsEquipmentTable";
import Header from "@/Headers/Header";
import BaseButton from "@/components/BaseButton";

export default function AssetsPage() {
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);

  return (
    <div className="min-h-screen">
      <Header title="Assets">
        <BaseButton
          type="button"
          onClick={() => {}}
          className="px-4 py-2 bg-[#222] border border-white/10 rounded-lg text-sm font-medium text-white transition-all"
        >
          Add Assets
        </BaseButton>
      </Header>
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 shadow-lg shadow-black/20 transition-all duration-300  ">
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

          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 shadow-lg shadow-black/20 transition-all duration-300  ">
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
    </div>
  );
}
