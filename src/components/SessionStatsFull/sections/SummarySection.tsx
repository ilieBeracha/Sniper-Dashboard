import { CheckCircle, AlertCircle } from "lucide-react";
import { Target, Participant } from "../types";
import { SectionHeader } from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";

interface SummarySectionProps {
  section: any;
  participants: Participant[];
  targets: Target[];
  validationErrors: string[];
  handleSubmit: () => void;
}

export const SummarySection = ({ section, participants, targets, validationErrors, handleSubmit }: SummarySectionProps) => {
  const { theme } = useTheme();

  const totalShots = targets.reduce((total, target) => total + target.engagements.reduce((sum, eng) => sum + (eng.shotsFired || 0), 0), 0);
  const totalHits = targets.reduce((total, target) => total + target.engagements.reduce((sum, eng) => sum + (eng.targetHits || 0), 0), 0);
  const accuracy = totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <SectionHeader section={section} />

      <div className="mt-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className={`p-6 rounded-2xl border-2 text-center ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
            <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{participants.length}</div>
            <div className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Participants</div>
          </div>

          <div className={`p-6 rounded-2xl border-2 text-center ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
            <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{targets.length}</div>
            <div className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Targets</div>
          </div>

          <div className={`p-6 rounded-2xl border-2 text-center ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
            <div className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{totalShots}</div>
            <div className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Total Shots</div>
          </div>

          <div className={`p-6 rounded-2xl border-2 text-center ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
            <div className={`text-3xl font-bold ${accuracy >= 80 ? "text-green-500" : accuracy >= 60 ? "text-yellow-500" : "text-red-500"}`}>
              {accuracy}%
            </div>
            <div className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Accuracy</div>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className={`rounded-xl border-2 p-6 ${theme === "dark" ? "bg-red-900/20 border-red-800/50" : "bg-red-50 border-red-200"}`}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h4 className={`font-medium mb-2 ${theme === "dark" ? "text-red-300" : "text-red-800"}`}>Please fix these issues:</h4>
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className={`text-sm ${theme === "dark" ? "text-red-400" : "text-red-700"}`}>
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="space-y-4">
          <button
            onClick={handleSubmit}
            disabled={validationErrors.length > 0}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-medium transition-all ${
              validationErrors.length > 0
                ? theme === "dark"
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {validationErrors.length === 0 ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Submit Training Session</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Fix Errors to Submit</span>
              </>
            )}
          </button>

          <p className={`text-center text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>
            Once submitted, this data will be permanently saved to your training records
          </p>
        </div>
      </div>
    </div>
  );
};
