import { ReactFlowProvider } from "@xyflow/react";
import RulesMainPanel from "@/OnePlatform/RulesModel/components/RulesMainPanel";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";
import { useEffect, useState } from "react";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import FlowBuilder from "../components/FlowBuilder";

export default function Rules() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useStore(userStore);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  const { getRuleTemplates, getTeamRules } = useRuleStore();

  useEffect(() => {
    getRuleTemplates();
    if (user?.team_id) {
      getTeamRules(user?.team_id);
    }
  }, [user?.team_id, getRuleTemplates, getTeamRules]);

  return (
    <div className="h-screen w-full grid grid-cols-12 gap-0">
      <div className={`h-full col-span-4 overflow-hidden border-r ${isDark ? "bg-[#1A1A1C] border-gray-800" : "bg-gray-50 border-gray-200"}`}>
        <RulesMainPanel onRuleSelect={setSelectedRuleId} selectedRuleId={selectedRuleId} />
      </div>

      <div className={`h-full col-span-8 overflow-hidden ${isDark ? "bg-[#0F0F11]" : "bg-gray-50"}`}>
        <ReactFlowProvider>
          <FlowBuilder selectedRuleId={selectedRuleId} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
