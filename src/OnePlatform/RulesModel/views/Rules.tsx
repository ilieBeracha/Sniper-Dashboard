import RulesMainPanel from "../components/RulesMainPanel";
import TemplatesModal from "../components/TemplatesModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";
import { useEffect, useState } from "react";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import FlowBuilder from "../components/FlowBuilder";
import { motion } from "framer-motion";

export default function Rules() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useStore(userStore);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const { loadEventTypes, loadActionTypes, loadDefinitions, loadEvents, loadActions, loadExecutions } = useRuleStore();
  console.log(user);
  useEffect(() => {
    loadEventTypes();
    loadActionTypes();
    if (user?.team_id) {
      loadDefinitions(user?.team_id);
      loadEvents(user?.team_id, user?.team_id);
      loadActions(user?.team_id);
      loadExecutions(user?.team_id);
    }
  }, [user?.team_id, loadEventTypes, loadActionTypes, loadDefinitions, loadEvents, loadActions, loadExecutions]);

  return (
    <>
      <div className="h-screen w-full flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`w-[600px] h-full border-r ${isDark ? "bg-black/30 border-gray-800" : "bg-white border-gray-200"}`}
        >
          <RulesMainPanel onRuleSelect={setSelectedRuleId} selectedRuleId={selectedRuleId} onTemplateClick={() => setShowTemplatesModal(true)} />
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`flex-1 h-full bg-alpha-black`}
        >
          <FlowBuilder selectedRuleId={selectedRuleId || ""} />
        </motion.div>
      </div>

      {/* Templates Modal */}
      <TemplatesModal isOpen={showTemplatesModal} onClose={() => setShowTemplatesModal(false)} />
    </>
  );
}
