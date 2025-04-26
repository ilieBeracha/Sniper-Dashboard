import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type ListItem = {
  id: string;
  label: string;
  description?: string;
  badge?: string;
};

type SearchableCheckboxListProps = {
  items: ListItem[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
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
  showClearButton = true,
}: SearchableCheckboxListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Toggle item selection
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get selected items
  const selectedItems = items.filter((item) => selectedIds.includes(item.id));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-white/5 text-white text-sm border border-white/10 rounded-md hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#151515] rounded-lg border border-white/10 shadow-lg">
          {/* Search input */}
          <div className="px-3 py-2 border-b border-white/5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-3 py-2 rounded-md bg-white/5 text-white text-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
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

          {/* Footer with count and clear button */}
          {selectedIds.length > 0 && showClearButton && (
            <div className="px-4 py-2 border-t border-white/5 flex justify-between bg-[#191919]">
              <span className="text-xs text-gray-400">
                {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIds([]);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
