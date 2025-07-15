import { Section } from "../types";

interface SectionHeaderProps {
  section: Section;
}

export const SectionHeader = ({ section }: SectionHeaderProps) => (
  <div>
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-gray-100 dark:bg-zinc-800/50 rounded-lg">
        <section.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </div>
      <div>
        <h2 className="text-xl font-medium text-gray-900 dark:text-white">{section.title}</h2>
        <p className="text-gray-500 dark:text-zinc-500 text-xs">{section.description}</p>
      </div>
    </div>
  </div>
);
