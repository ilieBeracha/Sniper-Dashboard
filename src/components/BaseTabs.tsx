import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ChevronDown, X } from "lucide-react";

type TabItem = {
  name: string;
  current: boolean;
  dropdown?: string[];
};

type Props = {
  tabs: TabItem[];
  selectedTab: string;
  handleSelectedTab: (tab: string) => void;
  resetFilters: () => void;
  header: string | React.ReactNode;
};

export default function BaseTabs({ tabs, selectedTab, handleSelectedTab, resetFilters, header }: Props) {
  return (
    <div className="w-full justify-between flex flex-row">
      <div className="w-full flex gap-2 items-center">
        {typeof header === "string" ? <p className="text-sm text-zinc-400">{header}</p> : header}
        <ul className="flex flex-wrap gap-3 px-2 ">
          {tabs.map((tab) =>
            tab.dropdown?.length ? (
              <li key={tab.name}>
                <Dropdown>
                  <DropdownTrigger>
                    <p
                      className={`flex items-center gap-1 px-4 rounded-md border transition-colors ${
                        selectedTab.startsWith(tab.name) ? "border-primary-500 text-primary-500" : "border-zinc-700 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {tab.name}
                      <ChevronDown size={16} />
                    </p>
                  </DropdownTrigger>
                  <DropdownMenu
                    onAction={(key) => handleSelectedTab(key as string)}
                    aria-label={`${tab.name} dropdown`}
                    className="bg-zinc-800 text-white rounded-md shadow-lg"
                  >
                    {tab.dropdown.map((item) => (
                      <DropdownItem key={item} className="px-4 py-2 text-sm hover:bg-zinc-700 cursor-pointer">
                        {item}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </li>
            ) : (
              <li key={tab.name}>
                <button
                  onClick={() => handleSelectedTab(tab.name)}
                  className={`capitalize px-4 py-2 border-b-2 text-sm font-medium transition ${
                    selectedTab === tab.name ? "border-primary-500 text-primary-500" : "border-transparent text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab.name}
                </button>
              </li>
            ),
          )}
        </ul>
      </div>
      <div className="flex justify-end">
        {selectedTab && (
          <p
            onClick={resetFilters}
            className="text-xs text-white hover:text-white flex items-center gap-1 px-1 py-1 rounded bg-red-500 hover:bg-red-600 transition"
          >
            <X size={12} />
            Reset
          </p>
        )}
      </div>
    </div>
  );
}
