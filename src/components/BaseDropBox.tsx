import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function BaseDropBox({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: { id: string; label: string }[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  const { theme } = useTheme();
  const metricOptions = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    description: `Compare performance by ${tab.label.toLowerCase()}`,
  }));

  const selectedOption = metricOptions.find((option) => option.id === activeTab);

  return (
    <Listbox value={selectedOption} onChange={(opt) => setActiveTab(opt.id)}>
      <div className="relative w-full max-w-sm mx-auto">
        <div className={`flex w-full overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 ${
          theme === 'dark' 
            ? 'bg-zinc-800 border border-zinc-700' 
            : 'bg-white border border-gray-300'
        }`}>
          <div className={`flex items-center gap-2 px-4 py-1 flex-grow text-sm ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <CheckIcon className={`w-4 h-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`} />
            <p className="text-sm font-medium truncate">{selectedOption?.label || "Select a metric"}</p>
          </div>
          <ListboxButton className={`px-3 flex items-center justify-center transition-colors text-sm ${
            theme === 'dark' 
              ? 'bg-zinc-800 hover:bg-zinc-700 text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-900'
          }`}>
            <ChevronDownIcon className={`w-4 h-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-500'}`} />
          </ListboxButton>
        </div>

        <ListboxOptions
          transition
          className={`absolute z-20 mt-2 w-full rounded-lg shadow-lg ring-1 ring-black/10 overflow-hidden focus:outline-none ${
            theme === 'dark' 
              ? 'bg-zinc-900 divide-y divide-zinc-800' 
              : 'bg-white divide-y divide-gray-200'
          }`}
        >
          {metricOptions.map((option) => (
            <ListboxOption
              key={option.id}
              value={option}
              className={`cursor-pointer select-none p-2 text-sm transition-colors ${
                theme === 'dark' 
                  ? 'text-white hover:bg-zinc-700 data-[focus]:bg-zinc-700' 
                  : 'text-gray-900 hover:bg-gray-50 data-[focus]:bg-gray-50'
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium group-data-[selected]:font-semibold">{option.label}</p>
                  <CheckIcon className="w-4 h-4 text-indigo-400 group-[&:not([data-selected])]:hidden" aria-hidden="true" />
                </div>
                <p className={`text-xs ${
                  theme === 'dark' 
                    ? 'text-zinc-400 group-data-[focus]:text-indigo-300' 
                    : 'text-gray-500 group-data-[focus]:text-indigo-600'
                }`}>{option.description}</p>
              </div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
