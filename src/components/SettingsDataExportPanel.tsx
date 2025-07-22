import { useState } from "react";
import { Calendar, Download, FileText, Target, Users, BarChart3, Shield } from "lucide-react";
import { format, subDays } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import BaseButton from "@/components/base/BaseButton";
import BaseDashboardCard from "./base/BaseDashboardCard";
import { ReportSection, TrainingReportData } from "@/types/report";

const reportSections = [
  { id: "basicSummary", label: "Basic Summary", icon: FileText, description: "Sessions, squads, and participants overview" },
  { id: "performanceStats", label: "Performance & Accuracy", icon: BarChart3, description: "Session accuracy and performance metrics" },
  { id: "targetEngagements", label: "Target Engagements", icon: Target, description: "Detailed target-by-target breakdown" },
  { id: "equipmentWeapons", label: "Equipment & Weapons", icon: Shield, description: "Weapon usage and effectiveness" },
  { id: "teamSquadComparison", label: "Team/Squad Comparison", icon: Users, description: "Comparative analysis by groups" },
] as const;

export default function SettingsDataExportPanel() {
  const { theme } = useTheme();
  const [selectedSections, setSelectedSections] = useState<ReportSection[]>(["basicSummary", "performanceStats"]);
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSection = (sectionId: ReportSection) => {
    setSelectedSections((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    const mockData: TrainingReportData = {
      dateRange: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      basicSummary: {
        totalSessions: 24,
        uniqueSquads: 6,
        totalParticipants: 48,
        averageSessionDuration: "2h 15m",
      },
      performanceStats: {
        sessions: [
          {
            id: "1",
            name: "Alpha Squad Training",
            date: new Date(),
            accuracy: 78.5,
            hitPercentage: 82.3,
            avgDispersion: 0.45,
            avgReactionTime: 1.23,
          },
          {
            id: "2",
            name: "Bravo Squad Assessment",
            date: subDays(new Date(), 2),
            accuracy: 81.2,
            hitPercentage: 85.7,
            avgDispersion: 0.38,
            avgReactionTime: 1.15,
          },
        ],
      },
      targetEngagements: {
        engagements: [
          {
            sessionName: "Alpha Squad Training",
            targetId: "T-001",
            distance: 500,
            windSpeed: 3.2,
            totalShots: 40,
            totalHits: 32,
            eliminated: true,
            participants: [
              { userName: "John Doe", shots: 10, hits: 8, accuracy: 80 },
              { userName: "Jane Smith", shots: 10, hits: 9, accuracy: 90 },
              { userName: "Mike Johnson", shots: 10, hits: 7, accuracy: 70 },
              { userName: "Sarah Williams", shots: 10, hits: 8, accuracy: 80 },
            ],
          },
        ],
      },
      equipmentWeapons: {
        weapons: [
          { name: "M24 SWS", type: "Sniper Rifle", usageCount: 45, avgAccuracy: 82.3 },
          { name: "Barrett M82", type: "Anti-Material", usageCount: 12, avgAccuracy: 78.5 },
          { name: "Remington 700", type: "Sniper Rifle", usageCount: 38, avgAccuracy: 85.2 },
        ],
      },
      teamSquadComparison: {
        teams: [
          { name: "1st Battalion", sessions: 12, avgAccuracy: 79.5, avgHitPercentage: 81.2, topPerformer: "Alpha Squad" },
          { name: "2nd Battalion", sessions: 10, avgAccuracy: 82.1, avgHitPercentage: 84.7, topPerformer: "Delta Squad" },
        ],
        squads: [
          { name: "Alpha Squad", teamName: "1st Battalion", sessions: 6, avgAccuracy: 81.2, avgHitPercentage: 83.5, topPerformer: "Jane Smith" },
          { name: "Bravo Squad", teamName: "1st Battalion", sessions: 6, avgAccuracy: 77.8, avgHitPercentage: 79.0, topPerformer: "Mike Johnson" },
          { name: "Delta Squad", teamName: "2nd Battalion", sessions: 5, avgAccuracy: 84.3, avgHitPercentage: 86.2, topPerformer: "Sarah Williams" },
        ],
      },
    };

    console.log(mockData);

    setIsGenerating(false);
  };

  return (
    <main className="sm:px-6 lg:flex-auto lg:px-0 max-w-4xl mx-auto opacity-50" style={{ pointerEvents: "none" }}>
      <BaseDashboardCard>
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none px-8 py-4">
          <div>
            <h2 className={`text-base/7 font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Training Report Export</h2>
            <p className={`mt-1 text-sm/6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Generate comprehensive PDF reports of training sessions and performance metrics.
            </p>

            <div className={`mt-6 space-y-8 divide-y ${theme === "dark" ? "divide-zinc-800" : "divide-gray-200"}`}>
              {/* Date Range Selection */}
              <div className="pt-6">
                <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Date Range</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="start-date" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
                      Start Date
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={`block w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "border-zinc-700 bg-zinc-800/50 text-gray-100 focus:border-purple-500 focus:ring-purple-500/20"
                            : "border-gray-300 bg-white text-gray-900 focus:border-purple-600 focus:ring-purple-600/20"
                        }`}
                      />
                      <Calendar className={`absolute right-3 top-2.5 h-5 w-5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="end-date" className={`block text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
                      End Date
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={`block w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 ${
                          theme === "dark"
                            ? "border-zinc-700 bg-zinc-800/50 text-gray-100 focus:border-purple-500 focus:ring-purple-500/20"
                            : "border-gray-300 bg-white text-gray-900 focus:border-purple-600 focus:ring-purple-600/20"
                        }`}
                      />
                      <Calendar className={`absolute right-3 top-2.5 h-5 w-5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Sections Selection */}
              <div className="pt-8">
                <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Report Sections</h3>
                <p className={`mt-1 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  Select which sections to include in your report.
                </p>
                <div className="mt-4 space-y-3">
                  {reportSections.map((section) => {
                    const Icon = section.icon;
                    const isSelected = selectedSections.includes(section.id as ReportSection);

                    return (
                      <label
                        key={section.id}
                        className={`relative flex cursor-pointer items-start rounded-lg border p-4 transition-all ${
                          isSelected
                            ? theme === "dark"
                              ? "border-purple-500 bg-purple-500/10"
                              : "border-purple-600 bg-purple-50"
                            : theme === "dark"
                              ? "border-zinc-700 bg-zinc-800/30 hover:bg-zinc-800/50"
                              : "border-gray-300 bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex h-6 items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSection(section.id as ReportSection)}
                            className={`h-4 w-4 rounded border-gray-300 focus:ring-2 ${
                              theme === "dark" ? "bg-zinc-700 text-purple-500 focus:ring-purple-500/20" : "text-purple-600 focus:ring-purple-600/20"
                            }`}
                          />
                        </div>
                        <div className="ml-3 flex flex-1 items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${isSelected ? "text-purple-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
                              <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>{section.label}</span>
                            </div>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{section.description}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-8">
                <BaseButton
                  onClick={handleGenerateReport}
                  disabled={selectedSections.length === 0 || isGenerating}
                  style="purple"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isGenerating ? "Generating Report..." : "Generate PDF Report"}
                </BaseButton>
                {selectedSections.length === 0 && (
                  <p className={`mt-2 text-sm ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
                    Please select at least one section to include in the report.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </BaseDashboardCard>
    </main>
  );
}
