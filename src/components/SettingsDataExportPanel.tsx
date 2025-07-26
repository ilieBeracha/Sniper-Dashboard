import { useState } from "react";
import { Calendar, Download } from "lucide-react";
import { format, subDays } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import BaseButton from "@/components/base/BaseButton";
import BaseDashboardCard from "./base/BaseDashboardCard";
import { useStore } from "zustand";
import { reportStore } from "@/store/reportStore";

export default function SettingsDataExportPanel() {
  const { setReport, isGenerating, setIsGenerating, generateReport, report } = useStore(reportStore);
  const { theme } = useTheme();
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReport(null);

    generateReport({ startDate, endDate });

    setIsGenerating(false);
  };

  console.log(report);

  return (
    <main className="sm:px-6 lg:flex-auto lg:px-0 max-w-4xl mx-auto">
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
              </div>

              {/* Generate Button */}
              <div className="pt-8">
                <BaseButton onClick={handleGenerateReport} disabled={isGenerating} style="purple" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {isGenerating ? "Generating Report..." : "Generate PDF Report"}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </BaseDashboardCard>
    </main>
  );
}
