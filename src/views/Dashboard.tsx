import { useDashboardPageLogic } from "@/hooks/useDashboardPageLogic";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import InviteModal from "@/components/InviteModal";
import Header from "@/Headers/Header";
import { SplinePointerIcon } from "lucide-react";

export default function Dashboard() {
  const { user, userRole, isInviteModalOpen, setIsInviteModalOpen, tabs, activeTab, setActiveTab, RenderComponent } = useDashboardPageLogic();

  return (
    <SpPage>
      <Header />
      <SpPageHeader
        title={activeTab}
        subtitle={activeTab === "Overview" ? "Team, Squad, and more" : "By Date, Squad, and more"}
        icon={<SplinePointerIcon />}
        breadcrumbs={[{ label: "Dashboard", link: "/" }]}
        dropdownItems={[
          {
            label: "Invite",
            onClick: () => {
              setIsInviteModalOpen(true);
            },
          },
        ]}
      />

      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <SpPageBody>{RenderComponent()}</SpPageBody>

      {userRole !== "soldier" && user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
    </SpPage>
  );
}
