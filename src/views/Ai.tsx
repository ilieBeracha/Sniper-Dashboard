import Header from "@/Headers/Header";
import BaseButton from "@/components/BaseButton";
import { SparklesIcon } from "lucide-react";
import { useAiStream } from "@/hooks/useAiStream";

export default function Ai() {
  const text = useAiStream("What is the capital of France?");
  console.log(text);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 p-6">
      <Header title="AI">
        <BaseButton type="button" onClick={() => {}}>
          <SparklesIcon className="w-4 h-4" />
        </BaseButton>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 shadow-lg shadow-black/20 transition-all duration-300 hover:from-white/10 hover:to-white/[0.05]">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white">AI</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
