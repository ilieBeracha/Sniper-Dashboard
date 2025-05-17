import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import AssetsWeaponsTable from "@/components/AssetsWeaponsTable";
import Header from "@/Headers/Header";

export default function AssetsPage() {
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);

  return (
    <div className="min-h-screen">
      <Header title="Assets">
        <button className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-white/10 rounded-lg text-sm font-medium text-white transition-all">
          Add Assets
        </button>{" "}
      </Header>
      <div className="grid grid-cols-1 gap-2 p-4 md:p-6 2xl:p-10 ">
        <div className="flex flex-col gap-4">
          <AssetsWeaponsTable weapons={weapons} />
          {equipments.map((equipment) => (
            <div key={equipment.id}>{equipment.equipment_type}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
