import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { equipmentStore } from "@/store/equipmentStore";
import AssetsWeaponsTable from "@/components/AssetsWeaponsTable";

export default function AssetsPage() {
  const { weapons } = useStore(weaponsStore);
  const { equipments } = useStore(equipmentStore);

  return (
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 py-8 space-y-4">
      <h3 className="text-2xl font-bold">Assets</h3>
      <div className="flex flex-col gap-4">
        <AssetsWeaponsTable weapons={weapons} />
        {equipments.map((equipment) => (
          <div key={equipment.id}>{equipment.equipment_type}</div>
        ))}
      </div>
    </div>
  );
}
