import { useTheme } from "@/contexts/ThemeContext";
import { performanceStore } from "@/store/performance";
import { Skeleton } from "@heroui/react";
import { useEffect } from "react";
import { 
  Users, 
  Target, 
  TrendingUp, 
  Crosshair, 
  Timer, 
  Users2, 
  Trophy,
  BarChart3,
  Activity
} from "lucide-react";

export default function TrainingSessionStatsCard({ trainingSessionId }: { trainingSessionId: string }) {
  const { theme } = useTheme();
  const { trainingTeamAnalytics, getTrainingTeamAnalytics, isLoading } = performanceStore();

  useEffect(() => {
    if (trainingSessionId) getTrainingTeamAnalytics(trainingSessionId);
  }, [trainingSessionId]);

  const boxStyle = `rounded-xl p-6 flex flex-col border transition-all duration-300 ${
    theme === "dark" 
      ? "bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border-zinc-800/60 text-white backdrop-blur-sm" 
      : "bg-white border-gray-200/60 text-gray-900 shadow-sm"
  }`;

  if (isLoading || !trainingTeamAnalytics) {
    return (
      <div className={boxStyle}>
        {/* Training Totals Loading */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-7 w-48" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Precision & Grouping Loading */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-7 w-56" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = trainingTeamAnalytics;

  return (
    <div className={boxStyle}>
      {/* Training Totals Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-50"}`}>
            <BarChart3 className={`w-5 h-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
          </div>
          <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Training Session Totals
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Stat 
            icon={<Users className="w-4 h-4" />} 
            label="Total Participants" 
            value={stats.total_participants}
            theme={theme}
            colorScheme="blue"
          />
          <Stat 
            icon={<Target className="w-4 h-4" />} 
            label="Total Shots Fired" 
            value={stats.total_shots_fired}
            theme={theme}
            colorScheme="blue"
          />
          <Stat 
            icon={<TrendingUp className="w-4 h-4" />} 
            label="Overall Hit Rate" 
            value={`${stats.overall_hit_percentage}%`}
            theme={theme}
            colorScheme="green"
            highlight={true}
          />
          <Stat 
            icon={<Crosshair className="w-4 h-4" />} 
            label="Targets Eliminated" 
            value={stats.total_targets_eliminated}
            theme={theme}
            colorScheme="red"
            highlight={true}
          />
          <Stat 
            icon={<Timer className="w-4 h-4" />} 
            label="Avg First Shot Time" 
            value={`${stats.avg_time_to_first_shot}s`}
            theme={theme}
            colorScheme="blue"
          />
        </div>
      </div>

      {/* Precision & Grouping Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-50"}`}>
            <Activity className={`w-5 h-5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
          </div>
          <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            Precision & Grouping Analytics
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Stat 
              icon={<Users2 className="w-4 h-4" />} 
              label="Grouped Sessions" 
              value={stats.times_grouped}
              theme={theme}
              colorScheme="purple"
            />
            <Stat 
              icon={<Activity className="w-4 h-4" />} 
              label="Avg CM Dispersion" 
              value={stats.avg_cm_dispersion}
              theme={theme}
              colorScheme="purple"
            />
          </div>
          <Stat 
            icon={<Trophy className="w-4 h-4" />} 
            label="Best Performance" 
            value={`${stats.best_cm_dispersion}cm dispersion`}
            subValue={`${stats.best_user_first_name} ${stats.best_user_last_name}`}
            theme={theme}
            colorScheme="gold"
            highlight={true}
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ 
  icon, 
  label, 
  value, 
  subValue,
  theme, 
  highlight = false,
  colorScheme = "default",
  fullWidth = false
}: { 
  icon: React.ReactNode;
  label: string; 
  value: string | number | null;
  subValue?: string;
  theme: string;
  highlight?: boolean;
  colorScheme?: "default" | "blue" | "green" | "red" | "purple" | "gold";
  fullWidth?: boolean;
}) {
  const getColorClasses = () => {
    const colors = {
      blue: {
        bg: theme === "dark" 
          ? highlight ? "bg-blue-500/10 border border-blue-500/20" : "bg-blue-500/5 hover:bg-blue-500/10"
          : highlight ? "bg-blue-50 border border-blue-100" : "bg-blue-25 hover:bg-blue-50",
        icon: theme === "dark" 
          ? highlight ? "text-blue-400" : "text-blue-400/80" 
          : highlight ? "text-blue-600" : "text-blue-500",
        label: theme === "dark" 
          ? highlight ? "text-blue-300" : "text-blue-400/80" 
          : highlight ? "text-blue-600" : "text-blue-500",
        value: theme === "dark" 
          ? highlight ? "text-white" : "text-blue-100" 
          : highlight ? "text-gray-900" : "text-gray-900"
      },
      green: {
        bg: theme === "dark" 
          ? highlight ? "bg-green-500/10 border border-green-500/20" : "bg-green-500/5 hover:bg-green-500/10"
          : highlight ? "bg-green-50 border border-green-100" : "bg-green-25 hover:bg-green-50",
        icon: theme === "dark" 
          ? highlight ? "text-green-400" : "text-green-400/80" 
          : highlight ? "text-green-600" : "text-green-500",
        label: theme === "dark" 
          ? highlight ? "text-green-300" : "text-green-400/80" 
          : highlight ? "text-green-600" : "text-green-500",
        value: theme === "dark" 
          ? highlight ? "text-white" : "text-green-100" 
          : highlight ? "text-gray-900" : "text-gray-900"
      },
      red: {
        bg: theme === "dark" 
          ? highlight ? "bg-red-500/15 border border-red-500/25" : "bg-red-500/8 hover:bg-red-500/15"
          : highlight ? "bg-red-50 border border-red-200" : "bg-red-25 hover:bg-red-50",
        icon: theme === "dark" 
          ? highlight ? "text-red-400" : "text-red-400/90" 
          : highlight ? "text-red-600" : "text-red-500",
        label: theme === "dark" 
          ? highlight ? "text-red-300" : "text-red-400/90" 
          : highlight ? "text-red-600" : "text-red-500",
        value: theme === "dark" 
          ? highlight ? "text-red-100" : "text-red-200" 
          : highlight ? "text-red-900" : "text-red-800"
      },
      purple: {
        bg: theme === "dark" 
          ? highlight ? "bg-purple-500/10 border border-purple-500/20" : "bg-purple-500/5 hover:bg-purple-500/10"
          : highlight ? "bg-purple-50 border border-purple-100" : "bg-purple-25 hover:bg-purple-50",
        icon: theme === "dark" 
          ? highlight ? "text-purple-400" : "text-purple-400/80" 
          : highlight ? "text-purple-600" : "text-purple-500",
        label: theme === "dark" 
          ? highlight ? "text-purple-300" : "text-purple-400/80" 
          : highlight ? "text-purple-600" : "text-purple-500",
        value: theme === "dark" 
          ? highlight ? "text-white" : "text-purple-100" 
          : highlight ? "text-gray-900" : "text-gray-900"
      },
      gold: {
        bg: theme === "dark" 
          ? highlight ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-500/5 hover:bg-amber-500/10"
          : highlight ? "bg-amber-50 border border-amber-100" : "bg-amber-25 hover:bg-amber-50",
        icon: theme === "dark" 
          ? highlight ? "text-amber-400" : "text-amber-400/80" 
          : highlight ? "text-amber-600" : "text-amber-500",
        label: theme === "dark" 
          ? highlight ? "text-amber-300" : "text-amber-400/80" 
          : highlight ? "text-amber-600" : "text-amber-500",
        value: theme === "dark" 
          ? highlight ? "text-white" : "text-amber-100" 
          : highlight ? "text-gray-900" : "text-gray-900"
      },
      default: {
        bg: theme === "dark" 
          ? highlight ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-zinc-800/40 hover:bg-zinc-800/60"
          : highlight ? "bg-indigo-50 border border-indigo-100" : "bg-gray-50 hover:bg-gray-100",
        icon: theme === "dark" 
          ? highlight ? "text-indigo-400" : "text-zinc-400" 
          : highlight ? "text-indigo-600" : "text-gray-500",
        label: theme === "dark" 
          ? highlight ? "text-indigo-300" : "text-zinc-400" 
          : highlight ? "text-indigo-600" : "text-gray-500",
        value: theme === "dark" 
          ? highlight ? "text-white" : "text-zinc-100" 
          : highlight ? "text-gray-900" : "text-gray-900"
      }
    };
    return colors[colorScheme];
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`p-4 rounded-lg transition-all duration-200 ${colorClasses.bg} ${fullWidth ? 'col-span-full' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={colorClasses.icon}>
          {icon}
        </div>
        <p className={`text-xs font-medium tracking-wide ${colorClasses.label}`}>
          {label}
        </p>
      </div>
      <div>
        <p className={`text-lg font-bold ${colorClasses.value}`}>
          {value ?? "—"}
        </p>
        {subValue && (
          <p className={`text-xs mt-1 ${
            theme === "dark" ? "text-zinc-400" : "text-gray-500"
          }`}>
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
