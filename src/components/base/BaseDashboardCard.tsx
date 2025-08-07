import { BiAddToQueue, BiInfoCircle } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "@/contexts/ThemeContext";
import { Button, Card, Checkbox, Input, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { EraserIcon, FilterIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";

export default function BaseDashboardCard({
  header = "",
  children,
  height = "h-full",
  padding = "p-4",
  tooltipContent = "",
  withBtn = false,
  withFilter = [],
  onClearFilters,
  currentFilterValues = {},
}: {
  header?: string | React.ReactNode | null;
  children: React.ReactNode | React.ReactNode[];
  height?: string;
  padding?: string;
  tooltipContent?: string;
  withBg?: boolean;
  withBtn?: boolean;
  withFilter?: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    options?: { label: string; value: string }[];
    checked?: boolean;
    onChange: (value: string) => void;
    type: "select" | "text" | "checkbox" | "radio" | "date" | "number";
  }[];
  onClearFilters?: () => void;
  currentFilterValues?: Record<string, string>;
}) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const cardClassName = `relative h-full flex flex-col transition-all text-sm duration-300 rounded-lg border ${
    theme === "dark" ? "border-white/10 shadow-lg shadow-black/20" : "bg-gray-50 border-gray-300 border-2 shadow-xl shadow-gray-200/50"
  } ${isMobile ? "" : "h-full"}`;

  if (!header || header === "" || header === null) {
    return (
      <Card shadow="none" className={cardClassName}>
        <div className="flex items-center gap-2 absolute top-0 right-0">
          <div className={`flex items-center gap-4  shadow-lg rounded-lg p-2`}></div>
          {tooltipContent && (
            <BiInfoCircle
              className={` cursor-help transition-colors duration-200 ${
                theme === "dark" ? "text-indigo-400/80 hover:text-indigo-400" : "text-indigo-600/80 hover:text-indigo-600"
              }`}
              size={16}
              data-tooltip-id={`${header}-tooltip`}
              data-tooltip-content={tooltipContent}
            />
          )}
          {withFilter.length > 0 && (
            <BaseDashboardCardFilter filters={withFilter} onClearFilters={onClearFilters || (() => {})} currentValues={currentFilterValues} />
          )}
        </div>
        {children}
      </Card>
    );
  }

  return (
    <Card
      className={`flex flex-col bg-white rounded-4xl shadow-sm border border-gray-200 ${height} shadow-xsoverflow-hidden ${theme === "dark" ? "bg-zinc-900/50 border-neutral-700/70" : ""}`}
    >
      <div className={`${padding} border-none transition-colors duration-200 ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
        <div className="flex justify-between relative h-full items-center gap-2">
          <div className="flex items-center gap-2 absolute top-0 right-0">
            <div className={`flex items-center gap-4  shadow-lg rounded-lg p-2`}></div>
            {tooltipContent && (
              <BiInfoCircle
                className={` cursor-help transition-colors duration-200 ${
                  theme === "dark" ? "text-indigo-400/80 hover:text-indigo-400" : "text-indigo-600/80 hover:text-indigo-600"
                }`}
                size={16}
                data-tooltip-id={`${header}-tooltip`}
                data-tooltip-content={tooltipContent}
              />
            )}
            {withFilter.length > 0 && (
              <BaseDashboardCardFilter filters={withFilter} onClearFilters={onClearFilters || (() => {})} currentValues={currentFilterValues} />
            )}
          </div>
          <h2
            className={`font-semibold flex items-center gap-2 text-sm relative transition-colors duration-200 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <div className={`h-1.5 w-1.5 max-h-1.5 rounded-full ${typeof header === "string" ? "lg:text-lg text-sm" : ""}`}></div>
            {header}
          </h2>
          {withBtn ? (
            <button className={`p-1.5 rounded-lg transition-colors duration-200 ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-100"}`}>
              <BiAddToQueue className={`transition-colors duration-200 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
            </button>
          ) : (
            <div className="w-4" />
          )}
        </div>
      </div>
      <div className=" flex-1 h-full">{children}</div>

      <Tooltip
        id={`${header}-tooltip`}
        place="top"
        className={`!opacity-100 !border !rounded-lg !p-3 !text-sm !max-w-xs transition-colors duration-200 ${
          theme === "dark" ? "!bg-[#1A1A1A] !text-gray-300 !border-white/10" : "!bg-white !text-gray-700 !border-gray-200"
        }`}
        style={{
          zIndex: 1000,
        }}
      />
    </Card>
  );
}

export function BaseDashboardCardFilter({
  filters,
  onClearFilters,
  currentValues = {},
}: {
  filters: {
    label: string;
    value: string;
    options?: { label: string; value: string }[];
    checked?: boolean;
    onChange: (value: string) => void;
    type: "select" | "text" | "checkbox" | "radio" | "date" | "number" | "icon";
  }[];
  onClearFilters?: () => void;
  currentValues?: Record<string, string>;
}) {
  const { theme } = useTheme();
  return (
    <div className="">
      <Popover placement="bottom-end">
        <PopoverTrigger asChild>
          <Button
            variant="light"
            className={`p-1 rounded-lg border ${theme === "dark" ? "border-white/10 hover:bg-zinc-600" : "bg-gray-50 border-gray-200 hover:bg-gray-100"} transition`}
          >
            <FilterIcon className={`h-4 w-4 ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`} strokeWidth={2.5} />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] rounded-xl border border-gray-200 dark:border-white/10 bg-zinc-900/90 backdrop-blur-2xl shadow-xl p-6 space-y-2">
          <div className="space-y-0.5 justify-between w-full grid grid-cols-6 items-center pb-2">
            <div className="flex justify-end gap-3 col-span-1">
              <Button variant="light" className="w-full" onPress={() => onClearFilters?.()} isIconOnly size="lg">
                <EraserIcon className="w-6 h-6" color="red" strokeWidth={2.5} />
              </Button>
            </div>
            <div className="flex flex-col w-full justify-between gap-1 col-span-5">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Filters</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Customize data by dimensions</p>
            </div>
          </div>

          <div className="space-y-3">
            {filters.map((filter) => {
              return (
                <div key={filter.value} className="grid grid-cols-3 items-center gap-3 text-sm">
                  <Label htmlFor={filter.value} className="text-gray-700 dark:text-gray-300 truncate">
                    {filter.label}
                  </Label>

                  {filter.type === "select" || filter.type === "radio" ? (
                    <select
                      id={filter.value}
                      className="col-span-2 h-9 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-800 text-sm text-gray-800 dark:text-gray-200"
                      value={currentValues[filter.value] || ""}
                      onChange={(e) => filter.onChange(e.target.value)}
                    >
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : filter.type === "text" ? (
                    <Input
                      id={filter.value}
                      value={currentValues[filter.value] || ""}
                      onChange={(e) => filter.onChange(e.target.value)}
                      className="col-span-2 h-9"
                    />
                  ) : filter.type === "number" ? (
                    <Input
                      type="number"
                      id={filter.value}
                      value={currentValues[filter.value] || ""}
                      onChange={(e) => filter.onChange(e.target.value)}
                      className="col-span-2 h-9"
                    />
                  ) : filter.type === "checkbox" ? (
                    <Checkbox
                      id={filter.value}
                      checked={!!currentValues[filter.value]}
                      onValueChange={(checked) => filter.onChange(checked.toString())}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
