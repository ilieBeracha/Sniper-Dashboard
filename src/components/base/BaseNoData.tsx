import { BarChartIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function NoDataDisplay({
  title = "No data available",
  message = "There's no data to display at the moment",
  icon: CustomIcon = BarChartIcon,
}) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center w-full rounded-xl h-full">
      <div className="flex flex-col items-center text-center space-y-4 my-8">
        <div className={`p-4 rounded-full ${
          theme === 'dark' 
            ? 'bg-indigo-500/10 text-indigo-400' 
            : 'bg-indigo-100 text-indigo-600'
        }`}>
          <CustomIcon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h4 className={`text-lg font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>{title}</h4>
          <p className={`text-sm max-w-md ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>{message}</p>
        </div>
      </div>
    </div>
  );
}
