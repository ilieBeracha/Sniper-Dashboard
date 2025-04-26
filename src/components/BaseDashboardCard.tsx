import { BiAddToQueue, BiInfoCircle } from "react-icons/bi";
import { Tooltip } from "react-tooltip";

export default function BaseDashboardCard({
  title,
  children,
  tooltipContent = "",
  withBg = true,
  withBtn = false,
}: {
  title: string;
  children: React.ReactNode;
  tooltipContent?: string;
  withBg?: boolean;
  withBtn?: boolean;
}) {
  return (
    <div
      className={`h-full rounded-2xl border border-white/5 shadow-lg flex flex-col transition-all duration-300 hover:border-white/10 ${
        withBg ? "bg-[#1E1E1E]" : "bg-transparent"
      }`}
    >
      <div className="px-4 pt-4 pb-2 border-b border-white/5 mb-2">
        <div className="flex justify-between relative">
          {tooltipContent && (
            <BiInfoCircle
              className="absolute -top-1 -right-1 text-indigo-400/80 hover:text-indigo-400 cursor-help transition-colors duration-200"
              size={16}
              data-tooltip-id={`${title}-tooltip`}
              data-tooltip-content={tooltipContent}
            />
          )}
          <h2 className="font-semibold text-white flex items-center gap-2">
            <div className="h-1.5 w-1.5 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"></div>
            {title}
          </h2>
          {withBtn ?? (
            <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors duration-200">
              <BiAddToQueue className="text-indigo-400" />{" "}
            </button>
          )}
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 flex-1 h-full">{children}</div>

      <Tooltip
        id={`${title}-tooltip`}
        place="top"
        className="!bg-[#1A1A1A] !text-gray-300 !opacity-100 !border !border-indigo-500/20 !rounded-lg !p-3 !text-sm !shadow-lg !shadow-indigo-900/10 !max-w-xs"
        style={{
          zIndex: 1000,
        }}
      />
    </div>
  );
}
