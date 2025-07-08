import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { Brain, Plus } from "lucide-react";
import BaseButton from "./BaseButton";
import { useTheme } from "@/contexts/ThemeContext";

export default function DashboardAI() {
  const { userScoreProfile } = useStore(userStore);
  const { theme } = useTheme();

  if (!userScoreProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <div className={`border-b backdrop-blur-sm`}>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 shadow-lg">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className={`text-xl font-bold tracking-wide`}>AI Intelligence Terminal</h2>
              <p className={`text-sm`}>Advanced Performance Analysis & Tactical Enhancement System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <BaseButton
              onClick={() => {}}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 px-4 py-2 shadow-lg border border-blue-500/30"
            >
              <Plus className="text-white h-4 w-4" />
              <span className="text-sm text-white font-medium">Generate Analysis</span>
            </BaseButton>
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${theme === "dark" ? "bg-zinc-800/50 border border-zinc-700" : "bg-gray-200/50 border border-gray-300"}`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full min-h-screen overflow-hidden">
        {/* AI Suggestion Generator with Responsive Container */}
        <div className="relative w-full h-full">
          {/* <AiSuggestionGenerator
            suggestions={suggestions}
            isLoading={isLoading}
            generateSuggestions={generateSuggestions}
            setSuggestions={setSuggestions}
            getSuggestions={getSuggestions}
          /> */}
        </div>
      </div>
    </div>
  );
}
