import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import BaseButton from "@/components/base/BaseButton";
import { Target, Participant } from "../types";
import { SectionHeader } from "./SectionHeader";

interface SummarySectionProps {
  section: any;
  participants: Participant[];
  targets: Target[];
  validationErrors: string[];
  handleSubmit: () => void;
}

export const SummarySection = ({ section, participants, targets, validationErrors, handleSubmit }: SummarySectionProps) => {
  const totalShots = targets.reduce((total, target) => total + target.engagements.reduce((sum, eng) => sum + (eng.shotsFired || 0), 0), 0);

  const totalHits = targets.reduce((total, target) => total + target.engagements.reduce((sum, eng) => sum + (eng.targetHits || 0), 0), 0);

  return (
    <div id="summary" className="snap-start scroll-mt-4 min-h-[85vh] space-y-4">
      <SectionHeader section={section} />
      <Card className="border-0 shadow-sm dark:shadow-black/20 bg-white dark:bg-[#1A1A1A]">
        <CardContent className="px-2 py-4 lg:py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <div className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">{participants.length}</div>
              <div className="text-base text-gray-600 dark:text-zinc-400">Participants</div>
            </div>

            <div className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">{targets.length}</div>
              <div className="text-base text-gray-600 dark:text-zinc-400">Targets</div>
            </div>

            <div className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">{totalShots}</div>
              <div className="text-base text-gray-600 dark:text-zinc-400">Total Shots</div>
            </div>

            <div className="border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/30 rounded-lg p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">{totalHits}</div>
              <div className="text-base text-gray-600 dark:text-zinc-400">Total Hits</div>
            </div>
          </div>

          <div className="text-center">
            <BaseButton onClick={handleSubmit} style="purple" padding="px-8 lg:px-12 py-3" className="shadow-lg hover:shadow-xl transition-all">
              <Send className="w-6 h-6 mr-2" />
              Submit Training Session
            </BaseButton>
            <p className="text-base text-gray-500 dark:text-zinc-400 mt-4">
              Once submitted, this data will be permanently saved to your training records.
            </p>
          </div>
        </CardContent>
        {validationErrors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4 lg:p-6 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-3">Please fix the following errors:</h3>
            <ul className="space-y-2">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                  <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
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
