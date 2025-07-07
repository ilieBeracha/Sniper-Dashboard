import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { askAssistant, getTasks } from "@/services/embeddingService";
import { userStore } from "@/store/userStore";
import { useStore } from "zustand";
import { AlertTriangle, CheckCircle, Brain, User, Award, ChevronRight, Lightbulb } from "lucide-react";

interface Suggestion {
  topic: string;
  issue: string;
  recommendation: string;
}

interface SuggestionData {
  user_id: string;
  role: string;
  topic: string;
  issue: string;
  recommendation: string;
  objective: string;
  suggestions: Suggestion[];
  last_training_id: string;
  last_training_date: string;
}

export default function AiSuggestionGenerator() {
  const { theme } = useTheme();
  const { user } = useStore(userStore);
  const [suggestions, setSuggestions] = useState<SuggestionData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const generateSuggestions = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await askAssistant("Generate performance suggestions");
      if (result && typeof result === "object") {
        setSuggestions(result as unknown as SuggestionData[]);
      } else {
        setError("Unable to generate suggestions at this time");
      }
    } catch (err) {
      console.error("Error generating suggestions:", err);
      setError("Failed to generate suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      const fetchTasks = async () => {
        const tasks = await getTasks(user.id);
        setSuggestions(tasks as unknown as SuggestionData[]);
        // generateSuggestions();
      };
      fetchTasks();
    }
  }, [user?.id]);

  const getPriorityColor = (index: number, theme: string) => {
    if (theme === "dark") {
      return index === 0
        ? "from-red-600/20 to-red-800/10 border-red-500/20 ring-1 ring-red-900/30"
        : index === 1
          ? "from-amber-600/20 to-amber-700/10 border-amber-500/20 ring-1 ring-amber-900/30"
          : "from-blue-600/20 to-blue-700/10 border-blue-500/20 ring-1 ring-blue-900/20";
    } else {
      return index === 0
        ? "from-red-50 to-red-100 border-red-200 ring-1 ring-red-100"
        : index === 1
          ? "from-amber-50 to-amber-100 border-amber-200 ring-1 ring-amber-100"
          : "from-blue-50 to-blue-100 border-blue-200 ring-1 ring-blue-100";
    }
  };

  const getPriorityLabel = (index: number) => {
    switch (index) {
      case 0:
        return "High Priority";
      case 1:
        return "Medium Priority";
      default:
        return "Low Priority";
    }
  };

  return (
    <div className={`w-full bg-amber-00/20 absolute top-0 left-0 space-y-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      {/* Header */}

      {/* Error State */}
      {error && (
        <div
          className={`p-4 rounded-lg border ${
            theme === "dark" ? "bg-red-900/20 border-red-800/50 text-red-400" : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={`p-8 rounded-lg border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div
                className={`w-12 h-12 rounded-full border-4 border-purple-200 ${theme === "dark" ? "border-purple-800" : "border-purple-200"}`}
              ></div>
              <div className={`absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-purple-600 animate-spin`}></div>
            </div>
            <div className="text-center">
              <p className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Analyzing Performance Data</p>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Our AI is reviewing your training history and generating personalized insights...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions Content */}
      {suggestions && !isLoading && suggestions.length > 0 && (
        <div className="space-y-6">
          {/* User Info Card */}
          <div
            className={`p-4 rounded-lg border ${
              theme === "dark"
                ? "bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border-zinc-700"
                : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
            }`}
          >
            <div className="flex items-center flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200"}`}>
                  <User className={`w-5 h-5 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
                </div>
                <div>
                  <div className="flex items-center  gap-2">
                    <Award className={`w-4 h-4 ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`} />
                    <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{suggestions[0].role}</span>
                  </div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Last Training:{" "}
                    {suggestions[0].last_training_date !== "Unknown" ? new Date(suggestions[0].last_training_date).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-2">
                <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{suggestions.length} Recommendations</p>
              </div>
            </div>
          </div>
          {/* Suggestions List */}
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`group p-6 rounded-xl backdrop-blur-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${getPriorityColor(index, theme)}`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{suggestion.topic}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${
                              index === 0
                                ? theme === "dark"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-red-100 text-red-700"
                                : index === 1
                                  ? theme === "dark"
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-amber-100 text-amber-700"
                                  : theme === "dark"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {getPriorityLabel(index)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                    />
                  </div>

                  {/* Issue Block */}
                  <div
                    className={`p-4 rounded-lg ${theme === "dark" ? "bg-red-900/20 border border-red-800/30" : "bg-red-50 border border-red-200"}`}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                      <div>
                        <p className={`text-xs uppercase font-semibold tracking-wide mb-1 ${theme === "dark" ? "text-red-300" : "text-red-500"}`}>
                          Problem
                        </p>
                        <p className={`text-sm mt-1 ${theme === "dark" ? "text-red-300" : "text-red-600"}`}>{suggestion.issue}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Block */}
                  <div
                    className={`p-4 rounded-lg ${theme === "dark" ? "bg-green-900/20 border border-green-800/30" : "bg-green-50 border border-green-200"}`}
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className={`w-4 h-4 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                      <div>
                        <p className={`text-xs uppercase font-semibold tracking-wide mb-1 ${theme === "dark" ? "text-green-300" : "text-green-600"}`}>
                          Suggestion
                        </p>
                        <p className={`text-sm mt-1 ${theme === "dark" ? "text-green-300" : "text-green-600"}`}>{suggestion.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div
            className={`p-4 rounded-lg border ${
              theme === "dark" ? "bg-zinc-900/30 border-zinc-800 text-zinc-400" : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>
                Recommendations generated based on your training data and performance metrics. Review and implement these suggestions during your next
                training sessions.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!suggestions && !isLoading && !error && (
        <div className={`p-8 rounded-lg border ${theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
          <div className="text-center space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`}>
              <Brain className={`w-8 h-8 ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>No Suggestions Available</h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Complete some training sessions to get personalized AI recommendations.
              </p>
            </div>
            <button
              onClick={generateSuggestions}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === "dark" ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              Generate Suggestions
            </button>
            ;
          </div>
        </div>
      )}
    </div>
  );
}
