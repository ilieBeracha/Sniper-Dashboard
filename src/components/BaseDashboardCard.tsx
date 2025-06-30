import { BiAddToQueue, BiInfoCircle } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function BaseDashboardCard({
  header,
  children,
  tooltipContent = "",
  withBtn = false,
}: {
  header: string | React.ReactNode;
  children: React.ReactNode;
  tooltipContent?: string;
  withBg?: boolean;
  withBtn?: boolean;
}) {
  const isMobile = useIsMobile();
  if (!header) {
    return (
      <div
        className={`bg-[#121212] shadow-lg shadow-black/20 relative h-full flex flex-col transition-all text-sm duration-300 rounded-md border border-[#7a78783c]  ${isMobile ? "min-h-[200px]" : "h-full"}`}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      className={`bg-[#121212] shadow-lg shadow-black/20 relative h-full flex flex-col transition-all text-sm duration-300 rounded-md border border-[#7a78783c]  ${isMobile ? "min-h-[200px]" : "h-full"}`}
    >
      <div className="px-4 py-4 border-b border-white/40 mb-2">
        <div className="flex justify-between relative h-full items-center">
          {tooltipContent && (
            <BiInfoCircle
              className="absolute top-0 -right-1 text-indigo-400/80 hover:text-indigo-400 cursor-help transition-colors duration-200"
              size={16}
              data-tooltip-id={`${header}-tooltip`}
              data-tooltip-content={tooltipContent}
            />
          )}
          <h2 className="font-semibold text-white flex items-center gap-2 text-sm relative">
            <div className={`h-1.5 w-1.5 max-h-1.5  rounded-full ${typeof header === "string" ? "lg:text-lg text-sm" : ""}`}></div>
            {header}
          </h2>
          {withBtn ?? (
            <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors duration-200">
              <BiAddToQueue className="text-indigo-400" />{" "}
            </button>
          )}
        </div>
      </div>
      <div className="pb-4 flex-1 h-full">{children}</div>

      <Tooltip
        id={`${header}-tooltip`}
        place="top"
        className="!bg-[#1A1A1A] !text-gray-300 !opacity-100 !border !border-white/10 !rounded-lg !p-3 !text-sm !max-w-xs"
        style={{
          zIndex: 1000,
        }}
      />
    </div>
  );
}
