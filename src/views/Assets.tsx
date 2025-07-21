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
  const { tabs, activeTab, handleTabChange } = useTabs({
    tabs: [
      { id: "weapons", label: "weapons", icon: FileQuestion },
      { id: "equipments", label: "equipments", icon: Package },
    ],
  });

  const { getWeapons } = useStore(weaponsStore);
  const { getEquipments } = useStore(equipmentStore);
  const { user } = useStore(userStore);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.team_id) {
      getWeapons(user?.team_id as string);
      getEquipments(user?.team_id as string);
    }
  }, [user?.team_id]);

  const renderComponent = () => {
    if (activeTab.id === "weapons") {
      return <WeaponsTab isOpen={isOpen} setIsOpen={setIsOpen} />;
    }
    return <EquipmentTab isOpen={isOpen} setIsOpen={setIsOpen} />;
  };

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
        dropdownItems={[
          activeTab.id === "weapons"
            ? { label: "Add Weapon", onClick: () => setIsOpen(true) }
            : { label: "Add Equipment", onClick: () => setIsOpen(true) },
        ]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab.id} onChange={handleTabChange} />
      <SpPageBody>{renderComponent()}</SpPageBody>
    </SpPage>
  );
}
