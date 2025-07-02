import { Loader2, Send } from "lucide-react";
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
    <div className="relative flex flex-col gap-6 max-w-6xl mx-auto h-[100vh] min-h-[600px] bg-black/80 backdrop-blur-sm border border-blue-500/20 shadow-2xl shadow-blue-500/10">
      {/* Header */}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto h-full space-y-4 py-2 px-4 pb-32 scrollbar-thin scrollbar-thumb-blue-500/30 scrollbar-track-transparent">
        {chatMessages
          .filter((m) => m.role !== "system")
          .map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}>
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-lg transition-all hover:shadow-xl
                ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md border border-blue-500/20"
                    : "bg-gradient-to-br from-slate-700/80 to-gray-700/80 text-gray-100 rounded-bl-md border border-slate-600/20 backdrop-blur-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

        {isLoading && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 bg-gradient-to-br from-slate-700/80 to-gray-700/80 text-blue-300 text-sm rounded-2xl rounded-bl-md border border-slate-600/20 backdrop-blur-sm flex items-center gap-3 shadow-lg">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              <span className="font-medium">AI is thinking...</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="absolute bottom-6 left-0 right-0 px-6 z-10">
        <div className="bg-gradient-to-r from-slate-800/80 via-gray-800/80 to-slate-800/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 shadow-2xl shadow-blue-500/20">
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Ask about training data, scores, or anything else..."
              className="flex-1  bg-slate-900/50 border-slate-600/30 text-white placeholder:text-gray-400 rounded-xl focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30 transition-all text-base backdrop-blur-sm shadow-inner"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-4  to-purple-600 rounded-xl shadow-xl shadow-blue-500/30 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span className="text-sm font-semibold">{isLoading ? "Asking..." : "Ask"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
