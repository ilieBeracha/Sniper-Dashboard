import { BiAddToQueue, BiInfoCircle } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "@/contexts/ThemeContext";

export default function BaseDashboardCard({
  header,
  children,
  padding = "p-4",
  tooltipContent = "",
  withBtn = false,
}: {
  header: string | React.ReactNode;
  children: React.ReactNode;
  padding?: string;
  tooltipContent?: string;
  withBg?: boolean;
  withBtn?: boolean;
}) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const cardClassName = `relative h-full flex flex-col transition-all text-sm duration-300 rounded-lg border ${
    theme === "dark" ? "bg-[#1A1AA] border-white/10 shadow-lg shadow-black/20" : "bg-white border-gray-200 shadow-sm shadow-gray-200/50"
  } ${isMobile ? "" : "h-full"}`;

  if (!header) {
    return <div className={cardClassName}>{children}</div>;
  }

  return (
    <div
      className={`flex flex-col bg-white border border-gray-200 h-full shadow-xs rounded-xl overflow-hidden ${theme === "dark" ? "dark:bg-neutral-900 dark:border-neutral-700" : ""}`}
    >
      <div className={`${padding} border-b mb-2 transition-colors duration-200 ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
        <div className="flex justify-between relative h-full items-center">
          {tooltipContent && (
            <BiInfoCircle
              className={`absolute top-0 -right-1 cursor-help transition-colors duration-200 ${
                theme === "dark" ? "text-indigo-400/80 hover:text-indigo-400" : "text-indigo-600/80 hover:text-indigo-600"
              }`}
              size={16}
              data-tooltip-id={`${header}-tooltip`}
              data-tooltip-content={tooltipContent}
            />
          )}
          <h2
            className={`font-semibold flex items-center gap-2 text-sm relative transition-colors duration-200 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            <div className={`h-1.5 w-1.5 max-h-1.5 rounded-full ${typeof header === "string" ? "lg:text-lg text-sm" : ""}`}></div>
            {header}
          </h2>
          {withBtn ?? (
            <button className={`p-1.5 rounded-lg transition-colors duration-200 ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-100"}`}>
              <BiAddToQueue className={`transition-colors duration-200 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
            </button>
          )}
        </div>
      </div>
      <div className="pb-4 flex-1 h-full">{children}</div>

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
    </div>
  );
}
