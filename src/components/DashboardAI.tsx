import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { Brain, Plus, Target } from "lucide-react";
import BaseButton from "./BaseButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { useAiStore } from "@/store/AiStore";
import TaskCard from "./TaskCard";

export default function DashboardAI() {
  const { user } = useStore(userStore);
  const { userTasks, getUserTasks, isLoading } = useStore(useAiStore);
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      (async () => {
        await getUserTasks();
      })();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userTasks || userTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Target className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-xl text-gray-500">No training tasks available</p>
        <p className="text-sm text-gray-400 mt-2">Generate new tasks to get started</p>
      </div>
    );
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
        {/* Tasks Container */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              AI-Generated Training Tasks
            </h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Personalized training missions based on your performance analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTasks.map((task, index) => (
              <TaskCard
                key={index}
                task={task}
                onStart={() => console.log('Starting task:', task.description)}
                onComplete={() => console.log('Completing task:', task.description)}
                status="pending"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
