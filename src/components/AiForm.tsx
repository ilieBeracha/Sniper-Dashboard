import { SparklesIcon, Loader2, Send } from "lucide-react";
import { Input } from "./ui/input";
import { useState, useRef, useEffect } from "react";
import { useAiStore } from "@/store/AiStore";

export default function AiForm() {
  const [prompt, setPrompt] = useState("");
  const { isLoading, generateAnswer, chatMessages } = useAiStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSubmit = async () => {
    const input = prompt.trim();
    if (!input) return;
    setPrompt("");
    await generateAnswer(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex flex-col gap-3 sm:gap-6 w-full h-full bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg shadow-black/20">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-white/10">
          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-white">AI Assistant</h2>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto h-full space-y-2 sm:space-y-3 pr-1 sm:pr-2">
        {chatMessages
          .filter((m) => m.role !== "system")
          .map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-2 sm:p-3 rounded-lg sm:rounded-xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed
                ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-800 text-gray-100 rounded-bl-none"}`}
              >
                {msg.content}
              </div>
            </div>
          ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-2 sm:p-3 bg-gray-800 text-gray-400 text-xs sm:text-sm rounded-lg sm:rounded-xl flex items-center gap-2">
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> AI is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="absolute bottom-3 sm:bottom-6 left-0 right-0 px-3 sm:px-6 z-10 bg-black/50">
        <div className="flex items-center gap-1 sm:gap-2">
          <Input
            type="text"
            placeholder="Ask about training data, scores..."
            className="py-4 sm:py-6 px-3 sm:px-4 bg-black/30 border-white/20 text-white placeholder:text-gray-400 rounded-lg sm:rounded-xl focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm sm:text-base"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            onClick={handleSubmit}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg shadow-black/20 hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <Send className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="text-xs sm:text-sm">{isLoading ? "Asking..." : "Ask"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
