import { useEffect, useState } from "react";
import { Package, FileQuestion } from "lucide-react";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import WeaponsTab from "@/components/AssetsWeaponsTab";
import EquipmentTab from "@/components/AssetsEquipmentTab";
import { useTabs } from "@/hooks/useTabs";
import { useStore } from "zustand";
import { weaponsStore } from "@/store/weaponsStore";
import { userStore } from "@/store/userStore";
import { equipmentStore } from "@/store/equipmentStore";

export default function AssetsPage() {
  const { getWeapons, weapons } = useStore(weaponsStore);
  const { getEquipments, equipments } = useStore(equipmentStore);
  const { user } = useStore(userStore);
  const [isWeaponsOpen, setIsWeaponsOpen] = useState(false);
  const [isEquipmentsOpen, setIsEquipmentsOpen] = useState(false);

  useEffect(() => {
    if (user?.team_id && weapons.length === 0) {
      getWeapons(user?.team_id as string);
    }
    if (user?.team_id && equipments.length === 0) {
      getEquipments(user?.team_id as string);
    }
  }, [user?.team_id, weapons.length, equipments.length]);

  const { tabs, activeTab, handleTabChange } = useTabs({
    tabs: [
      { id: "weapons", label: "weapons", icon: FileQuestion },
      { id: "equipments", label: "equipments", icon: Package },
    ],
  });

  return (
    <SpPage>
      <Header
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Assets", link: "/assets" },
        ]}
      />
      <SpPageHeader
        title="Assets"
        subtitle={`Manage ${activeTab.id === "weapons" ? "weapons" : "equipment"} inventory`}
        icon={Package}
        action={[
          activeTab.id === "weapons"
            ? { label: "Add Weapon", onClick: () => setIsWeaponsOpen(true) }
            : { label: "Add Equipment", onClick: () => setIsEquipmentsOpen(true) },
        ]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab.id} onChange={handleTabChange} />
      <SpPageBody>
        {activeTab.id === "weapons" ? (
          <WeaponsTab isOpen={isWeaponsOpen} setIsOpen={setIsWeaponsOpen} />
        ) : (
          <EquipmentTab isOpen={isEquipmentsOpen} setIsOpen={setIsEquipmentsOpen} />
        )}
      </SpPageBody>
    </SpPage>
  );
}
