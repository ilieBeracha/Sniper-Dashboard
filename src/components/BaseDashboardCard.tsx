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
    <div className={`h-full rounded-2xl border border-white/5 shadow-lg flex flex-col  ${withBg ? "bg-[#1E1E1E]" : "bg-transparent"}`}>
      <div className="px-4 pt-4 pb-2 border-b border-white/5 mb-2">
        <div className="flex justify-between relative">
          {tooltipContent && (
            <BiInfoCircle
              className="absolute -top-1 -right-1  text-white cursor-help"
              size={16}
              data-tooltip-id={`${title}-tooltip`}
              data-tooltip-content={tooltipContent}
            />
          )}
          <h2 className="font-semibold text-white">{title}</h2>
          {withBtn ?? (
            <button>
              <BiAddToQueue />{" "}
            </button>
          )}
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 flex-1 h-full">{children}</div>

      <Tooltip
        id={`${title}-tooltip`}
        place="top"
        className="!bg-gray-800 absolute top-2 right-2 !text-white !opacity-100 !border !border-white/10 !rounded-lg !p-2 !text-sm"
      />
    </div>
  );
}
