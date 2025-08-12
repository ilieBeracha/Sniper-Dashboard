import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sparkles, Zap, Star, ArrowRight, Clock, Rocket } from "lucide-react";

export const ComingSoon: React.FC = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-8 transition-all duration-1000 h-[300px] flex flex-col justify-center items-center${
        theme === "dark"
          ? "bg-gradient-to-br from-zinc-900/80 via-zinc-800/60 to-zinc-900/80 border-zinc-700/50 shadow-[0_0_50px_rgba(59,130,246,0.1)]"
          : "bg-gradient-to-br from-white via-gray-50/80 to-white border-gray-200/50 shadow-[0_0_50px_rgba(59,130,246,0.05)]"
      } ${isMounted ? "opacity-100 translate-y-0 scale-100 animate-glow-pulse" : "opacity-0 translate-y-8 scale-95"}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#3B82F6_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-2000 ${isMounted ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-purple-500/3 rounded-2xl" />
      </div>

      {/* Floating Elements */}
      <div
        className={`absolute top-4 right-4 animate-float-slow transition-all duration-1000 delay-300 ${
          isMounted ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <Sparkles size={20} className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
      </div>
      <div
        className={`absolute top-8 right-12 animate-float-medium transition-all duration-1000 delay-400 ${
          isMounted ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <Star size={16} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
      </div>
      <div
        className={`absolute top-16 right-6 animate-float-fast transition-all duration-1000 delay-500 ${
          isMounted ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <Zap size={18} className="text-purple-400 drop-shadow-[0_0_8px_rgba(147,51,234,0.6)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Icon */}
        <div
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-2xl transition-all duration-1000 delay-200 ${
            isMounted ? "opacity-100 scale-100 shadow-[0_0_30px_rgba(147,51,234,0.3)]" : "opacity-0 scale-75"
          }`}
        >
          <div className={`flex h-full w-full items-center justify-center rounded-full ${theme === "dark" ? "bg-zinc-900" : "bg-white"}`}>
            <Rocket size={32} className="text-blue-500" />
          </div>
        </div>

        {/* Bottom Text */}
        <p
          className={`mt-6 text-xs transition-all duration-1000 delay-500 ${theme === "dark" ? "text-zinc-500" : "text-gray-400"} ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Estimated launch: 25 Minutes
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
