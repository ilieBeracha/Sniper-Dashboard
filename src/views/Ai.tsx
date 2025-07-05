import AiForm from "@/components/AiForm";
import Header from "@/Headers/Header";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Ai() {
  const isMobile = useIsMobile();

  return (
    <div className="h-screen flex flex-col text-gray-100  `">
      {isMobile && (
        <Header title="AI Assistant">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
        </Header>
      )}

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none ">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10  rounded-full blur-3xl" />
        </div>
        <AiForm />
      </div>
    </div>
  );
}
