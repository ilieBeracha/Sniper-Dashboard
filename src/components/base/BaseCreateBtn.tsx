import { PlusCircleIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function BaseCreateBtn({ onClick }: { onClick: () => void }) {
  const { theme } = useTheme();
  return (
    <div className={`flex items-center gap-2 px-2 py-0.5 rounded text-xs cursor-pointer transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-indigo-200/10 hover:bg-indigo-200/20' 
        : 'bg-indigo-100 hover:bg-indigo-200'
    }`} onClick={onClick}>
      <span className={`text-sm font-medium transition-colors duration-200 ${
        theme === 'dark' ? 'text-gray-200' : 'text-indigo-700'
      }`}>Create</span>
      <PlusCircleIcon className={`w-4 h-4 transition-colors duration-200 ${
        theme === 'dark' ? 'text-gray-200' : 'text-indigo-700'
      }`} />
    </div>
  );
}
