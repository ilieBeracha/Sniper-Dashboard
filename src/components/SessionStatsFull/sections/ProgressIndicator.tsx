import { CheckCircle2 } from "lucide-react";
import { Section } from "../types";
import { useTheme } from "@/contexts/ThemeContext";

interface ProgressIndicatorProps {
  sections: Section[];
  activeSection: number;
  getSectionValidationStatus: (sectionIndex: number) => boolean | string | null;
}

export const ProgressIndicator = ({ sections, activeSection, getSectionValidationStatus }: ProgressIndicatorProps) => {
  const { theme } = useTheme();

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 hidden lg:block ${
        theme === "dark" ? "bg-zinc-900/90" : "bg-white/90"
      } backdrop-blur-lg rounded-2xl shadow-2xl p-1`}
    >
      <div className="flex items-center gap-1">
        {sections.map((section, index) => {
          const isValid = getSectionValidationStatus(index);
          const isActive = index === activeSection;
          const isPast = index < activeSection;

          return (
            <button
              key={section.id}
              onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                isActive
                  ? "bg-indigo-500 text-white scale-110"
                  : isPast
                    ? isValid
                      ? "bg-green-500/20 text-green-600 hover:bg-green-500/30"
                      : "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30"
                    : theme === "dark"
                      ? "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              {isPast && isValid ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-medium">{index + 1}</span>}

              {/* Tooltip */}
              <div
                className={`absolute bottom-full mb-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ${
                  theme === "dark" ? "bg-zinc-800 text-white" : "bg-gray-800 text-white"
                }`}
              >
                <div>{section.title}</div>
                {(isPast || isActive) && (
                  <div className={`text-[10px] ${isValid ? "text-green-400" : "text-yellow-400"}`}>{isValid ? "Complete" : "Incomplete"}</div>
                )}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                    theme === "dark" ? "border-t-zinc-800" : "border-t-gray-800"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
