import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

export default function BaseDropBox({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: { id: string; label: string }[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  const metricOptions = tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    description: `Compare performance by ${tab.label.toLowerCase()}`,
  }));

  const selectedOption = metricOptions.find((option) => option.id === activeTab);

  return (
    <Listbox value={selectedOption} onChange={(opt) => setActiveTab(opt.id)}>
      <div className="relative w-full max-w-sm mx-auto">
        <div className="flex w-full overflow-hidden rounded-lg bg-zinc-800 border border-zinc-700 focus-within:ring-2 focus-within:ring-indigo-500">
          <div className="flex items-center gap-2 px-4 py-1 text-white flex-grow">
            <CheckIcon className="w-4 h-4 text-zinc-400" />
            <p className="text-sm font-medium truncate">{selectedOption?.label || "Select a metric"}</p>
          </div>
          <ListboxButton className="px-3 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 transition-colors">
            <ChevronDownIcon className="w-5 h-5 text-zinc-400" />
          </ListboxButton>
        </div>

        <ListboxOptions
          transition
          className="absolute z-20 mt-2 w-full rounded-lg bg-zinc-900 shadow-lg ring-1 ring-black/10 divide-y divide-zinc-800 overflow-hidden focus:outline-none"
        >
          {metricOptions.map((option) => (
            <ListboxOption
              key={option.id}
              value={option}
              className="group cursor-pointer select-none p-4 text-sm text-white hover:bg-zinc-700 data-[focus]:bg-zinc-700"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium group-data-[selected]:font-semibold">{option.label}</p>
                  <CheckIcon className="w-4 h-4 text-indigo-400 group-[&:not([data-selected])]:hidden" aria-hidden="true" />
                </div>
                <p className="text-xs text-zinc-400 group-data-[focus]:text-indigo-300">{option.description}</p>
              </div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
