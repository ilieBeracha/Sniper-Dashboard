import { Loader2, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAiStore } from "@/store/AiStore";
import { Textarea } from "@headlessui/react";

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
    <div className="h-full flex flex-col relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none ">
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10  rounded-full blur-3xl" />
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {chatMessages.length === 0 ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {chatMessages
              .filter((m) => m.role !== "system")
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-lg transition-all hover:shadow-xl
                  ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md border border-blue-500/20"
                      : "bg-gradient-to-br from-slate-700/80 to-gray-700/80 text-gray-100 rounded-bl-md border border-slate-600/20 backdrop-blur-sm"
                  }`}
                  >
                    <div>{msg.content}</div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400 text-3xl">SnipeStates AI</div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-4">
          {chatMessages
            .filter((m) => m.role !== "system")
            .map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-lg transition-all hover:shadow-xl
                  ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md border border-blue-500/20"
                      : "bg-gradient-to-br from-slate-700/80 to-gray-700/80 text-gray-100 rounded-bl-md border border-slate-600/20 backdrop-blur-sm"
                  }`}
                >
                  <div>{msg.content}</div>
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
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r bg-zinc-900 backdrop-blur-xl  rounded-2xl shadow-2xl shadow-blue-500/20 overflow-hidden">
            <div className="flex items-stretch">
              <Textarea
                placeholder="Ask about training data, scores, or anything else..."
                className="flex-1 text-md pt-4 bg-transparent border-none text-white px-6  min-h-[100px] max-h-[100px] resize-none placeholder:text-gray-400 focus:outline-none focus:ring-0 text-base leading-relaxed"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                rows={1}
              />
              <div className="flex ">
                <button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  onClick={handleSubmit}
                  className="flex justify-center items-center bg-gradient-to-r  p-4 text-white rounded-r-2xl shadow-xl shadow-blue-500/30 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
