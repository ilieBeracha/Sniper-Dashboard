import { CheckCircle2 } from "lucide-react";
import { Section } from "../types";

interface ProgressIndicatorProps {
  sections: Section[];
  activeSection: number;
  getSectionValidationStatus: (sectionIndex: number) => boolean | string | null;
}

export const ProgressIndicator = ({ sections, activeSection, getSectionValidationStatus }: ProgressIndicatorProps) => {
  return (
    <div className="fixed top-20 right-4 z-10 flex flex-col gap-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
        >
          <div className="relative">
            <div
              className={`w-3 h-3 rounded-full transition-all ${
                index < activeSection
                  ? getSectionValidationStatus(index)
                    ? "bg-green-500"
                    : "bg-yellow-500"
                  : index === activeSection
                    ? getSectionValidationStatus(index)
                      ? "bg-indigo-600 scale-125"
                      : "bg-yellow-500 scale-125"
                    : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              {index < activeSection && getSectionValidationStatus(index) && <CheckCircle2 className="w-3 h-3 text-white absolute inset-0" />}
            </div>
            {index < sections.length - 1 && (
              <div
                className={`absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-6 transition-all ${
                  index < activeSection ? (getSectionValidationStatus(index) ? "bg-green-500" : "bg-yellow-500") : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            )}
          </div>
          <div className="hidden lg:block">
            <div
              className={`text-xs transition-all ${
                index === activeSection ? "text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {section.title}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-500">{section.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
