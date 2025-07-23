import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { Search } from "lucide-react";

export interface BaseSelectOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  group?: string; // optional group id / label
}

export interface BaseSelectProps {
  /** Selected value */
  value: string | undefined | null;
  /** Called when value changes */
  onChange: (value: string) => void;
  /** Options to render (can be empty if async) */
  options?: BaseSelectOption[];
  /** Async loader for options */
  loadOptions?: () => Promise<BaseSelectOption[]>;
  /** Placeholder shown when no value */
  placeholder?: string;
  /** Allow searching */
  searchable?: boolean;
  /** Optional className */
  className?: string;
}

/**
 * Reusable select component that unifies dropdown/select usage across the app.
 * - Supports async loading via `loadOptions` prop
 * - Searchable list when `searchable` is true
 * - Grouped options by `group` field
 * - Optional icons inside items
 */
export default function BaseSelect({
  value,
  onChange,
  options: propOptions,
  loadOptions,
  placeholder = "Select…",
  searchable = false,
  className,
}: BaseSelectProps) {
  const { theme } = useTheme();
  const [internalOptions, setInternalOptions] = useState<BaseSelectOption[]>(propOptions ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Load options when provided async loader or when propOptions change
  useEffect(() => {
    if (loadOptions) {
      setIsLoading(true);
      loadOptions()
        .then((opts) => setInternalOptions(opts))
        .finally(() => setIsLoading(false));
    } else if (propOptions) {
      setInternalOptions(propOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propOptions, loadOptions]);

  // Group options
  const grouped = useMemo(() => {
    const map = new Map<string | undefined, BaseSelectOption[]>();
    internalOptions.forEach((opt) => {
      const group = opt.group;
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(opt);
    });
    return Array.from(map.entries());
  }, [internalOptions]);

  // Filtered options when searching
  const filteredGrouped = useMemo(() => {
    if (!search) return grouped;
    const lower = search.toLowerCase();
    return grouped
      .map(([grp, opts]) => [grp, opts.filter((o) => o.label.toLowerCase().includes(lower))] as const)
      .filter(([, opts]) => opts.length > 0);
  }, [grouped, search]);

  // Render icon helper
  const renderIcon = (Icon?: React.ComponentType<{ className?: string }>) => Icon && <Icon className="w-4 h-4" />;

  return (
    <div className={className}>
      {searchable && (
        <div className="relative mb-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className={`w-full rounded-md border px-8 py-1.5 text-sm outline-none transition-colors ${
              theme === "dark"
                ? "bg-zinc-800/60 border-zinc-700 text-gray-100 placeholder:text-gray-400 focus:border-purple-500"
                : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500"
            }`}
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />
        </div>
      )}
      <Select value={value ?? undefined} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger size="default" className="w-full justify-between">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-center">Loading…</div>
          ) : (
            filteredGrouped.map(([grp, opts]) => (
              <React.Fragment key={grp ?? "__ungrouped"}>
                {grp && <SelectLabel>{grp}</SelectLabel>}
                <SelectGroup>
                  {opts.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="flex items-center gap-2">
                      {renderIcon(opt.icon)}
                      <span>{opt.label}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </React.Fragment>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}