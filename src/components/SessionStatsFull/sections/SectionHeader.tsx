import { Section } from "../types";
import { useTheme } from "@/contexts/ThemeContext";

interface SectionHeaderProps {
  section: Section;
}

export const SectionHeader = ({ section }: SectionHeaderProps) => {
  const { theme } = useTheme();
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100"} rounded-lg`}>
          <section.icon className={`w-5 h-5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`} />
        </div>
        <div>
          <h2 className={`text-xl font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{section.title}</h2>
          <p className={`${theme === "dark" ? "text-zinc-500" : "text-gray-500"} text-xs`}>{section.description}</p>
        </div>
      </div>
    </div>
  );
};
