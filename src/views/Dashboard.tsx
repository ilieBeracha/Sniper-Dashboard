import { useDashboardPageLogic } from "@/hooks/useDashboardPageLogic";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import InviteModal from "@/components/InviteModal";
import BaseButton from "@/components/base/BaseButton";
import Header from "@/Headers/Header";
import { SplinePointerIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, userRole, isInviteModalOpen, setIsInviteModalOpen, tabs, activeTab, setActiveTab, RenderComponent } = useDashboardPageLogic();
  const navigate = useNavigate();

  return (
    <SpPage>
      <Header />
      <SpPageHeader
        title={activeTab}
        subtitle={activeTab === "Overview" ? "Team, Squad, and more" : "By Date, Squad, and more"}
        icon={<SplinePointerIcon />}
        breadcrumbs={[{ label: "Dashboard", link: "/" }]}
        button={[
          <BaseButton onClick={() => navigate("/session-stats-simple")} style="purple">
            Quick Session Stats
          </BaseButton>,
          <BaseButton onClick={() => setIsInviteModalOpen(true)}>Invite</BaseButton>,
        ]}
      />

      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <SpPageBody>{RenderComponent()}</SpPageBody>

      {userRole !== "soldier" && user?.id && <InviteModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} userId={user.id} />}
    </SpPage>
  );
}
