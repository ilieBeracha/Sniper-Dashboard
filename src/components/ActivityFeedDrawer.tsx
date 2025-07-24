import UnifiedFeed from "./UnifiedFeed";
import BaseMobileDrawer from "./BaseDrawer/BaseMobileDrawer";
import BaseDesktopDrawer from "./BaseDrawer/BaseDesktopDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ActivityFeedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivityFeedDrawer({ isOpen, onClose }: ActivityFeedDrawerProps) {
  const isMobile = useIsMobile();

  const Content = (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <UnifiedFeed />
      </div>
    </div>
  );

  return isMobile ? (
    <BaseMobileDrawer isOpen={isOpen} setIsOpen={onClose} title="Activity Feed">
      {Content}
    </BaseMobileDrawer>
  ) : (
    <BaseDesktopDrawer isOpen={isOpen} setIsOpen={onClose} title="Activity Feed" width="600px">
      {Content}
    </BaseDesktopDrawer>
  );
}
