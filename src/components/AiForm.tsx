import { Loader2, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAiStore } from "@/store/AiStore";
import { Textarea } from "@headlessui/react";
import { useTheme } from "@/contexts/ThemeContext";
import { validateAiForm } from "@/lib/formValidation";

export default function AiForm() {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const { isLoading, generateAnswer, chatMessages } = useAiStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSubmit = async () => {
    setError("");

    const validationError = validateAiForm({ prompt });
    if (validationError) {
      setError(validationError);
      return;
    }

    const input = prompt.trim();
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
    <div className={`h-full flex flex-col relative ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none ">
        <div
          className={`absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl ${
            theme === "dark" ? "bg-gradient-to-tl from-blue-500/10" : "bg-gradient-to-tl from-blue-400/20"
          }`}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-36">
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
                      : theme === "dark"
                        ? "bg-gradient-to-br from-slate-700/80 to-gray-700/80 text-gray-100 rounded-bl-md border border-slate-600/20 backdrop-blur-sm"
                        : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 rounded-bl-md border border-gray-300/20 backdrop-blur-sm"
                  }`}
                  >
                    <div>{msg?.content}</div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className={`text-3xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>SnipeStates AI</div>
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
                      : theme === "dark"
                        ? "bg-gradient-to-br from-slate-700/80 to-gray-700/80 text-gray-100 rounded-bl-md border border-slate-600/20 backdrop-blur-sm"
                        : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 rounded-bl-md border border-gray-300/20 backdrop-blur-sm"
                  }`}
                >
                  <div>{msg?.content}</div>
                </div>
              </div>
            ))}

          {isLoading && (
            <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
              <div
                className={`p-4 text-sm rounded-2xl rounded-bl-md backdrop-blur-sm flex items-center gap-3 shadow-lg ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-slate-700/80 to-gray-700/80 text-blue-300 border border-slate-600/20"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-blue-600 border border-gray-300/20"
                }`}
              >
                <Loader2 className={`w-5 h-5 animate-spin ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                <span className="font-medium">AI is thinking...</span>
                <div className="flex gap-1">
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${theme === "dark" ? "bg-blue-400" : "bg-blue-600"}`}
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${theme === "dark" ? "bg-blue-400" : "bg-blue-600"}`}
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className={`w-2 h-2 rounded-full animate-bounce ${theme === "dark" ? "bg-blue-400" : "bg-blue-600"}`}
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 ${
          theme === "dark"
            ? "bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent"
            : "bg-gradient-to-t from-white via-white/95 to-transparent"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          {error && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                theme === "dark" ? "bg-red-900/50 text-red-300 border border-red-800" : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {error}
            </div>
          )}
          <div
            className={`backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-500/20 overflow-hidden ${
              theme === "dark" ? "bg-zinc-900" : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-stretch">
              <Textarea
                placeholder="Ask about training data, scores, or anything else..."
                className={`flex-1 text-md pt-4 bg-transparent border-none px-6 min-h-[100px] max-h-[100px] resize-none focus:outline-none focus:ring-0 text-base leading-relaxed ${
                  theme === "dark" ? "text-white placeholder:text-gray-400" : "text-gray-900 placeholder:text-gray-500"
                }`}
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
                  className="flex justify-center items-center bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white rounded-r-2xl shadow-xl shadow-blue-500/30 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] font-semibold"
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
