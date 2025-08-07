import { CheckCircle, AlertCircle, Loader2, Save } from "lucide-react";
import { Target, Participant } from "../types";
import { SectionHeader } from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "motion/react";
import { useParams } from "react-router-dom";

interface SummarySectionProps {
  section: any;
  participants: Participant[];
  targets: Target[];
  validationErrors: string[];
  handleSubmit: () => void;
  isSubmitting: boolean;
}

export const SummarySection = ({ section, participants, targets, validationErrors, handleSubmit, isSubmitting }: SummarySectionProps) => {
  const { theme } = useTheme();
  const { sessionId } = useParams();
  const totalShots = targets.reduce((total, target) => total + target.engagements.reduce((sum, eng) => sum + (eng.shotsFired || 0), 0), 0);
  const totalHits = targets.reduce((total, target) => total + target.engagements.reduce((sum, eng) => sum + (eng.targetHits || 0), 0), 0);
  const accuracy = totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0;

  const isDisabled = validationErrors.length > 0 || isSubmitting;

  return (
    <div className="w-full max-w-2xl mx-auto" id="summary">
      <SectionHeader section={section} />

      <div className="">
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div
            className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 ${
              theme === "dark" ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{participants.length}</div>
            <div className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Participants</div>
          </div>

          <div
            className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 ${
              theme === "dark" ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{targets.length}</div>
            <div className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Targets</div>
          </div>

          <div
            className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 ${
              theme === "dark" ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{totalShots}</div>
            <div className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Total Shots</div>
          </div>

          <div
            className={`p-6 rounded-2xl border-2 text-center transition-all duration-300 ${
              theme === "dark" ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`text-3xl font-bold ${accuracy >= 80 ? "text-green-500" : accuracy >= 60 ? "text-yellow-500" : "text-red-500"}`}>
              {accuracy}%
            </div>
            <div className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Accuracy</div>
          </div>
        </motion.div>

        {/* Validation Errors */}
        <AnimatePresence>
          {validationErrors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl border-2 p-6 ${theme === "dark" ? "bg-red-900/20 border-red-800/50" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className={`font-medium mb-2 ${theme === "dark" ? "text-red-300" : "text-red-800"}`}>Please fix these issues:</h4>
                  <ul className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`text-sm ${theme === "dark" ? "text-red-400" : "text-red-700"}`}
                      >
                        • {error}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <motion.button
            onClick={handleSubmit}
            disabled={isDisabled}
            whileHover={!isDisabled ? { scale: 1.02 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
              isDisabled
                ? theme === "dark"
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
            }`}
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Training Session...</span>
                </motion.div>
              ) : validationErrors.length === 0 && !sessionId ? (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Training Session</span>
                </motion.div>
              ) : validationErrors.length > 0 && sessionId ? (
                <motion.div
                  key="errors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>Fix Errors to Submit</span>
                </motion.div>
              ) : (
                <motion.div
                  key="update"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3"
                >
                  <Save className="w-5 h-5" />
                  <span>Update Training Session</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading overlay */}
            {isSubmitting && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            )}
          </motion.button>

          <motion.p
            className={`text-center text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isSubmitting
              ? "Processing your training data. This may take a few moments..."
              : "Once submitted, this data will be permanently saved to your training records"}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
