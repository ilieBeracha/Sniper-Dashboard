import { useState } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { FaBolt, FaClock, FaCheckCircle, FaExclamationTriangle, FaRobot, FaTimes, FaArrowRight } from "react-icons/fa";
import { useRuleStore } from "../store/ruleStore";
import FlowBuilder from "./FlowBuilder";
import { motion, AnimatePresence } from "framer-motion";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplatesModal({ isOpen, onClose }: TemplatesModalProps) {
  const { templates } = useRuleStore();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(templates.length > 0 ? templates[0].id : null);

  const triggerIcons = {
    score_update: <FaExclamationTriangle className="w-4 h-4" />,
    schedule: <FaClock className="w-4 h-4" />,
    training_complete: <FaCheckCircle className="w-4 h-4" />,
    automation: <FaRobot className="w-4 h-4" />,
  };

  const triggerColors = {
    score_update: "from-amber-500 to-orange-500",
    schedule: "from-blue-500 to-cyan-500",
    training_complete: "from-emerald-500 to-green-500",
    automation: "from-purple-500 to-indigo-500",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      backdrop="blur"
      classNames={{
        base: "m-0 sm:m-0 max-w-full h-[80vh]",
        wrapper: "overflow-hidden bg-black/50",
        body: "p-0",
        closeButton: "hidden",
      }}
    >
      <ModalContent className="h-[80vh] w-[80vw] bg-alpha-black rounded-xl">
        <div className="flex h-full">
          {/* Left Sidebar - Templates List */}
          <div className="w-96 dark:bg-black/30 border-r border-gray-200 dark:border-gray-800 flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Rule Templates</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose a template to create your rule</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                  <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Templates List */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence>
                <div className="space-y-3">
                  {templates.map((template, index) => {
                    const isSelected = selectedTemplate === template.id;
                    const colorClass = triggerColors[template.trigger_type as keyof typeof triggerColors] || "from-gray-500 to-gray-600";

                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`
                          relative p-4 rounded-xl cursor-pointer transition-all duration-200 border-2
                          ${
                            isSelected
                              ? "bg-white dark:bg-gray-800 border-blue-500 dark:border-blue-400 shadow-lg"
                              : "bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                        )}

                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${colorClass} shadow-lg`}>
                            <div className="text-white">
                              {triggerIcons[template.trigger_type as keyof typeof triggerIcons] || <FaBolt className="w-4 h-4" />}
                            </div>
                          </div>

                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{template.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{template.description}</p>

                            {template.tags && template.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {template.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {template.tags.length > 3 && (
                                  <span className="text-xs text-gray-400 dark:text-gray-500">+{template.tags.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedTemplate}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-blue-500/20 disabled:shadow-none"
              >
                Use This Template
                <FaArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Right Side - Flow Preview */}
          <div className="flex-1 bg-gray-50 dark:bg-black/30">
            <div className="h-full relative">
              {selectedTemplate ? (
                <div className="h-full">
                  <div className="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Template Preview</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">This is how your rule will flow</p>
                  </div>

                  <FlowBuilder selectedRuleId={selectedTemplate} isTemplate={true} hideDetails={true} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="p-6 rounded-full bg-gray-100 dark:bg-gray-800 inline-block mb-4">
                      <FaBolt className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Select a template to preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
