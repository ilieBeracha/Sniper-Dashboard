import { BarChartIcon } from "lucide-react";

export default function NoDataDisplay({
  title = "No data available",
  message = "There's no data to display at the moment",
  icon: CustomIcon = BarChartIcon,
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full rounded-xl  h-full">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400">
          <CustomIcon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-300">{title}</h3>
          <p className="text-sm text-gray-500 max-w-md">{message}</p>
        </div>
      </div>
    </div>
  );
}
