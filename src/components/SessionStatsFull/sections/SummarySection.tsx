import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
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

  return (
    <div id="summary" className="snap-start scroll-mt-4 h-[calc(100vh-5rem)] flex flex-col justify-center space-y-8 py-12">
      <SectionHeader section={section} />
      <Card className={`border ${theme === "dark" ? "border-white/10 bg-zinc-900/30" : "border-gray-200 bg-gray-50/50"} rounded-lg p-8 lg:p-12`}>
        <CardContent className="px-2 ">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            <div className={`border ${theme === "dark" ? "border-white/10 bg-zinc-900/30" : "border-gray-200 bg-gray-50/50"} rounded-lg p-6 lg:p-8 text-center hover:shadow-md transition-shadow`}>
              <div className={`text-4xl lg:text-5xl font-light ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>{participants.length}</div>
              <div className={`text-base ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Participants</div>
            </div>

            <div className={`border ${theme === "dark" ? "border-white/10 bg-zinc-900/30" : "border-gray-200 bg-gray-50/50"} rounded-lg p-6 lg:p-8 text-center hover:shadow-md transition-shadow`}>
              <div className={`text-4xl lg:text-5xl font-light ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>{targets.length}</div>
              <div className={`text-base ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Targets</div>
            </div>

            <div className={`border ${theme === "dark" ? "border-white/10 bg-zinc-900/30" : "border-gray-200 bg-gray-50/50"} rounded-lg p-6 lg:p-8 text-center hover:shadow-md transition-shadow`}>
              <div className={`text-4xl lg:text-5xl font-light ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>{totalShots}</div>
              <div className={`text-base ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Total Shots</div>
            </div>

            <div className={`border ${theme === "dark" ? "border-white/10 bg-zinc-900/30" : "border-gray-200 bg-gray-50/50"} rounded-lg p-6 lg:p-8 text-center hover:shadow-md transition-shadow`}>
              <div className={`text-4xl lg:text-5xl font-light ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>{totalHits}</div>
              <div className={`text-base ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Total Hits</div>
            </div>
          </div>

          <div className="text-center">
            <div onClick={handleSubmit} className="shadow-lg hover:shadow-xl transition-all w-full flex justify-center">
              <Send className="w-6 h-6 mr-2" />
              Submit Training Session
            </div>
            <p className={`text-lg ${theme === "dark" ? "text-zinc-400" : "text-gray-500"} mt-6`}>
              Once submitted, this data will be permanently saved to your training records.
            </p>
          </div>
        </CardContent>
        {validationErrors.length > 0 && (
          <div className={`${theme === "dark" ? "bg-red-500/10 border-red-500/20" : "bg-red-50 border-red-200"} border rounded-lg p-6 lg:p-8 backdrop-blur-sm`}>
            <h3 className={`text-lg font-medium ${theme === "dark" ? "text-red-300" : "text-red-800"} mb-3`}>Please fix the following errors:</h3>
            <ul className="space-y-2">
              {validationErrors.map((error, index) => (
                <li key={index} className={`text-sm ${theme === "dark" ? "text-red-400" : "text-red-700"} flex items-start gap-2`}>
                  <span className={`${theme === "dark" ? "text-red-400" : "text-red-500"} mt-0.5`}>•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};
