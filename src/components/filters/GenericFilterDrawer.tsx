import { useEffect, useState } from "react";
import { X, Filter as FilterIcon } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";

/* -------------------------------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------------------------------*/
export type FilterValue = string | boolean | null;

export interface BaseFilterDefinition {
  /** Unique key for this filter.  */
  key: string;
  /** Visible label.  */
  label: string;
  /** Type discriminator. */
  type: "select" | "toggle";
}

export interface SelectFilterDefinition extends BaseFilterDefinition {
  type: "select";
  /** Option list. This can be supplied directly or fetched asynchronously. */
  options: Array<{ label: string; value: string }>;
}

export interface ToggleFilterDefinition extends BaseFilterDefinition {
  type: "toggle";
  /** Label for truthy state. */
  trueLabel?: string;
  /** Label for falsy state. */
  falseLabel?: string;
}

export type FilterDefinition = SelectFilterDefinition | ToggleFilterDefinition;

export interface GenericFilterDrawerProps {
  /** Control visibility */
  isOpen: boolean;
  onClose: () => void;
  /** Definition of the filters */
  definitions: FilterDefinition[];
  /** Current filter values, keyed by definition.key */
  values: Record<string, FilterValue>;
  /** Fired whenever any filter changes */
  onValuesChange: (values: Record<string, FilterValue>) => void;
  /** Optional callbacks */
  onApply?: () => void;
  onClear?: () => void;
}

/* -------------------------------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------------------------------*/
export default function GenericFilterDrawer({ isOpen, onClose, definitions, values, onValuesChange, onApply, onClear }: GenericFilterDrawerProps) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Local state to allow cancelled changes.
  const [localValues, setLocalValues] = useState(values);

  // Sync external changes.
  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleApply = () => {
    onValuesChange(localValues);
    onApply?.();
    onClose();
  };

  const handleClear = () => {
    const cleared: Record<string, FilterValue> = {};
    definitions.forEach((d) => {
      cleared[d.key] = d.type === "toggle" ? false : "all";
    });
    setLocalValues(cleared);
    onValuesChange(cleared);
    onClear?.();
  };

  /** Helper renderers */
  const renderSelect = (def: SelectFilterDefinition) => {
    const current = localValues[def.key] as string;
    return (
      <div key={def.key}>
        <label className="text-xs font-medium opacity-70 mb-1 block">{def.label}</label>
        <Select value={current ?? "all"} onValueChange={(v) => setLocalValues({ ...localValues, [def.key]: v })}>
          <SelectTrigger
            className={`w-full h-9 ${
              theme === "dark" ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50" : "bg-gray-50 border-gray-300 hover:bg-gray-100"
            }`}
          >
            <span className="text-sm">{def.options.find((o) => o.value === current)?.label ?? "All"}</span>
          </SelectTrigger>
          <SelectContent className={theme === "dark" ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"}>
            {def.options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className={theme === "dark" ? "focus:bg-zinc-700 focus:text-zinc-100" : "focus:bg-gray-100 focus:text-gray-900"}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderToggle = (def: ToggleFilterDefinition) => {
    const current = Boolean(localValues[def.key]);
    const trueLabel = def.trueLabel ?? def.label;
    const falseLabel = def.falseLabel ?? `All ${def.label}`;

    return (
      <div key={def.key}>
        <label className="text-xs font-medium opacity-70 mb-1 block">{def.label}</label>
        <button
          onClick={() => setLocalValues({ ...localValues, [def.key]: !current })}
          className={`w-full h-9 px-3 rounded-md border text-sm font-medium transition-all ${
            current
              ? theme === "dark"
                ? "bg-zinc-700/50 border-zinc-600 text-zinc-100"
                : "bg-gray-200 border-gray-400 text-gray-900"
              : theme === "dark"
                ? "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 text-zinc-400"
                : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-600"
          }`}
        >
          {current ? trueLabel : falseLabel}
        </button>
      </div>
    );
  };

  const gridColumns = isMobile ? "grid-cols-2" : "grid-cols-2"; // can make dynamic later

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed z-50 transition-transform duration-300 ${
          isMobile
            ? `bottom-0 left-0 right-0 ${isOpen ? "translate-y-0" : "translate-y-full"}`
            : `top-0 right-0 bottom-0 ${isOpen ? "translate-x-0" : "translate-x-full"}`
        }`}
      >
        <div
          className={`${theme === "dark" ? "bg-gradient-to-b from-zinc-900 to-zinc-950" : "bg-white"} ${
            isMobile
              ? `rounded-t-2xl border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`
              : `h-full border-l ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`
          } shadow-2xl ${!isMobile ? "w-[400px] relative" : ""}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 ${isMobile ? "pb-2" : "pt-6"}`}>
            <div className="flex items-center gap-2">
              <FilterIcon size={18} className="opacity-70" />
              <h3 className="text-base font-semibold">Filters</h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "dark" ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className={`px-4 pb-4 overflow-y-auto custom-scrollbar ${isMobile ? "max-h-[60vh]" : "h-[calc(100vh-200px)]"}`}>
            <div className={`grid ${gridColumns} gap-3 mb-4`}>
              {definitions.map((def) => {
                if (def.type === "select") return renderSelect(def);
                if (def.type === "toggle") return renderToggle(def);
                return null;
              })}
            </div>
          </div>

          {/* Actions */}
          <div
            className={`flex gap-3 p-4 border-t ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} ${
              !isMobile ? `absolute bottom-0 left-0 right-0 ${theme === "dark" ? "bg-zinc-950" : "bg-white"}` : ""
            }`}
          >
            <button
              onClick={handleClear}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
