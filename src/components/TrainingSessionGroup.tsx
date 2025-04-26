import { format } from "date-fns";

type TrainingSessionGroupProps = {
  title: string;
  color: "indigo" | "green" | "blue" | "gray" | "red";
  date?: Date;
  children: React.ReactNode;
};

export default function TrainingSessionGroup({ title, color, date, children }: TrainingSessionGroupProps) {
  const colorMap = {
    indigo: "bg-indigo-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    gray: "bg-gray-500",
    red: "bg-red-500",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${colorMap[color]} shadow-[0_0_8px_0px_${colorMap[color]}]`}></div>
        <h3 className="text-sm font-medium text-white uppercase tracking-wider">{title}</h3>
        <div className="h-px flex-grow bg-white/5"></div>
        {date && <span className="text-xs text-gray-400 font-medium">{format(date, "EEEE, MMMM d")}</span>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
