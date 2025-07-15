import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import BaseInput from "./base/BaseInput";
import BaseButton from "./base/BaseButton";

type ListItem = {
  id: string;
  label: string;
  description?: string;
  badge?: string;
};

type SearchableCheckboxListProps = {
  items: ListItem[];
  selectedIds: string[];
  setSelectedIds: any;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxHeight?: number;
  showBadges?: boolean;
  showClearButton?: boolean;
};

export default function SearchableCheckboxList({
  items,
  selectedIds,
  setSelectedIds,
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
  maxHeight = 200,
  showBadges = false,
}: SearchableCheckboxListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const toggleSelection = (id: string) => setSelectedIds((prev: any) => (prev.includes(id) ? prev.filter((p: any) => p !== id) : [...prev, id]));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedItems = items?.filter((item) => selectedIds?.includes(item.id));

  return (
    <div className="relative" ref={dropdownRef}>
      <BaseButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-3 bg-white/5 text-white text-sm border border-white/10 rounded-md hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedItems.length > 0 ? (
            <span className="truncate">
              {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} selected
            </span>
          ) : (
            <span className="text-gray-400">{searchPlaceholder}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </BaseButton>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#151515] rounded-lg border border-white/10 shadow-lg">
          <div className="px-3 py-2 border-b border-white/5">
            <BaseInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              leftIcon={<Search size={16} className="text-gray-400" />}
              containerClassName="bg-transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Items list */}
          <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: `${maxHeight}px` }}>
            {filteredItems.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">{emptyMessage}</div>
            ) : (
              <ul className="divide-y divide-white/5">
                {filteredItems.map((item) => (
                  <li key={item.id} className="group">
                    <label className="flex items-center px-4 py-2.5 cursor-pointer hover:bg-white/5 transition-all">
                      <input
                        type="checkbox"
                        value={item.id}
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        className="h-4 w-4 text-indigo-600 bg-transparent border-white/20 rounded focus:ring-indigo-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="ml-3 flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white truncate">{item.label}</p>
                          {showBadges && item.badge && (
                            <div className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 ml-2 flex-shrink-0">{item.badge}</div>
                          )}
                        </div>
                        {item.description && <p className="text-xs text-white/60 mt-0.5 truncate">{item.description}</p>}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
