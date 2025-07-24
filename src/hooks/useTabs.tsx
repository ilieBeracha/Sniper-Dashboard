import { useState } from "react";

export function useTabs({ tabs }: { tabs: { id: string; label: string; icon: React.ComponentType<any>; disabled?: boolean }[] }) {
  const [activeTab, setActiveTab] = useState<{ id: string; label: string; icon: React.ComponentType<any>; disabled?: boolean }>(tabs[0]);

  const handleTabChange = (tab: { id: string; label: string; icon: React.ComponentType<any>; disabled?: boolean }) => {
    if (tab && !tab.disabled) {
      setActiveTab(tab);
    }
  };
  return {
    tabs,
    activeTab,
    handleTabChange,
  };
}
