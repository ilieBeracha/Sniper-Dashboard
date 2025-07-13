import { useState } from "react";
import { Package, FileQuestion } from "lucide-react";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import WeaponsTab from "@/components/AssetsWeaponsTab";
import EquipmentTab from "@/components/AssetsEquipmentTab";

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState<"weapons" | "equipments">("weapons");

  const tabs = [
    { id: "weapons", label: "weapons", icon: FileQuestion },
    { id: "equipments", label: "equipments", icon: Package },
  ];
  return (
    <SpPage>
      <Header> </Header>
      <SpPageHeader
        title="Assets"
        subtitle={`Manage ${activeTab === "weapons" ? "weapons" : "equipment"} inventory`}
        icon={<Package />}
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Assets", link: "/assets" },
        ]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as "weapons" | "equipments")} />
      <SpPageBody>
        <div className="flex flex-col gap-6">{activeTab === "weapons" ? <WeaponsTab /> : <EquipmentTab />}</div>
      </SpPageBody>
    </SpPage>
  );
}
