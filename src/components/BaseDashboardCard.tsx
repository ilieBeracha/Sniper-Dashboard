import { BiAddToQueue } from "react-icons/bi";

export default function BaseDashboardCard({
  title,
  children,
  withBg = true,
  withBtn = false,
}: {
  title: string;
  children: React.ReactNode;
  withBg?: boolean;
  withBtn?: boolean;
}) {
  return (
    <div
      className={`h-full rounded-2xl border border-white/5 shadow-lg flex flex-col  ${
        withBg ? "bg-[#1E1E1E]" : "bg-transparent"
      }`}
    >
      <div className="px-4 pt-4 pb-2 border-b border-white/5 mb-2">
        <div className="flex justify-between ">
          <h2 className="font-semibold text-white">{title}</h2>
          {withBtn ?? (
            <button>
              <BiAddToQueue />{" "}
            </button>
          )}
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 flex-1 h-full">{children}</div>
    </div>
  );
}
