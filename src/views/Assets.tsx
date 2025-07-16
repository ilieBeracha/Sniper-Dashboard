import { useState } from "react";
import { Package, FileQuestion } from "lucide-react";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import WeaponsTab from "@/components/AssetsWeaponsTab";
import EquipmentTab from "@/components/AssetsEquipmentTab";
import BaseButton from "@/components/base/BaseButton";

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState<"weapons" | "equipments">("weapons");
  const [isOpen, setIsOpen] = useState(false);
  const tabs = [
    { id: "weapons", label: "weapons", icon: FileQuestion },
    { id: "equipments", label: "equipments", icon: Package },
  ];

  const renderComponent = () => {
    if (activeTab === "weapons") {
      return <WeaponsTab isOpen={isOpen} setIsOpen={setIsOpen} />;
    }
    return <EquipmentTab isOpen={isOpen} setIsOpen={setIsOpen} />;
  };

  return (
    <SpPage>
      <Header />
      <SpPageHeader
        title="Assets"
        subtitle={`Manage ${activeTab === "weapons" ? "weapons" : "equipment"} inventory`}
        icon={<Package />}
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Assets", link: "/assets" },
        ]}
        button={[
          activeTab === "weapons" ? (
            <BaseButton className="flex items-center gap-2" style="purple" onClick={() => setIsOpen(true)}>
              Add Weapon
            </BaseButton>
          ) : (
            <BaseButton className="flex items-center gap-2" style="purple" onClick={() => setIsOpen(true)}>
              Add Equipment
            </BaseButton>
          ),
        ]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as "weapons" | "equipments")} />
      <SpPageBody>{renderComponent()}</SpPageBody>
    </SpPage>
  );
}

// isCommanderOrSquadCommander(user?.user_role as UserRole)
//             ? activeTab === "weapons"
//               ? [
//                   <BaseButton className="flex items-center gap-2" style="purple" onClick={() => setIsOpen(true)}>
//                     Add Weapon
//                   </BaseButton>,
//                 ]
//               : [
//                   <BaseButton className="flex items-center gap-2" style="purple" onClick={() => setIsOpen(true)}>
//                     Add Equipment
//                   </BaseButton>,
//                 ]
//             : []
