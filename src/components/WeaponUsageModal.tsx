import { useTheme } from "@/contexts/ThemeContext";
import { performanceStore } from "@/store/performance";
import { Weapon } from "@/types/weapon";
import { useStore } from "zustand";
import { X, Target, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { Skeleton } from "@heroui/react";

interface WeaponUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  weapon: Weapon | null;
}

export default function WeaponUsageModal({ isOpen, onClose, weapon }: WeaponUsageModalProps) {
  const { theme } = useTheme();
  const { weaponUsageStats, isLoading } = useStore(performanceStore);

  if (!isOpen || !weapon) return null;

  const modalBg = theme === "dark" ? "bg-black/50 backdrop-blur-sm" : "bg-black/30 backdrop-blur-sm";

  const cardBg = theme === "dark" ? "bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 border-zinc-700/50" : "bg-white border-gray-200";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${modalBg}`}>
      <div className={`relative w-full max-w-2xl rounded-xl border shadow-2xl ${cardBg}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-opacity-20">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-green-500/20" : "bg-green-50"}`}>
              <BarChart3 className={`w-5 h-5 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Weapon Usage Statistics</h2>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {weapon.weapon_type} - {weapon.serial_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "dark" ? "hover:bg-zinc-800 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="space-y-3">
                    <Skeleton className={`h-4 w-3/4 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`} />
                    <Skeleton className={`h-8 w-full ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`} />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <Skeleton className={`h-4 w-2/3 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`} />
                <Skeleton className={`h-6 w-full ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`} />
              </div>
            </div>
          ) : weaponUsageStats ? (
            <div className="space-y-6">
              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 gap-4">
                <StatCard
                  icon={<Target className="w-4 h-4" />}
                  label="Total Shots Fired"
                  value={weaponUsageStats.total_shots_fired?.toLocaleString() || "0"}
                  theme={theme}
                  colorScheme="blue"
                />
                <div className="flex flex-col gap-2">
                  <StatCard
                    icon={<TrendingUp className="w-4 h-4" />}
                    label="Hit Percentage"
                    value={weaponUsageStats.hit_percentage ? `${weaponUsageStats.hit_percentage.toFixed(1)}%` : "0%"}
                    theme={theme}
                    colorScheme="green"
                    highlight={true}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <StatCard
                    icon={<Activity className="w-4 h-4" />}
                    label="Avg CM Dispersion"
                    value={weaponUsageStats.avg_cm_dispersion ? `${weaponUsageStats.avg_cm_dispersion.toFixed(1)}cm` : "N/A"}
                    theme={theme}
                    colorScheme="purple"
                  />
                </div>
              </div>

              {/* Best Performance */}
              <StatCard
                icon={<Activity className="w-4 h-4" />}
                label="Best CM Dispersion"
                value={weaponUsageStats.best_cm_dispersion ? `${weaponUsageStats.best_cm_dispersion.toFixed(1)}cm` : "N/A"}
                theme={theme}
                colorScheme="gold"
                highlight={true}
                fullWidth={true}
              />

              {/* Summary */}
              <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-zinc-800/40" : "bg-gray-50"}`}>
                <h3 className={`text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Summary</h3>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  This weapon has been used in training sessions with a total of{" "}
                  <span className="font-medium">{weaponUsageStats.total_shots_fired || 0}</span> shots fired, achieving a{" "}
                  <span className="font-medium">{weaponUsageStats.hit_percentage ? weaponUsageStats.hit_percentage.toFixed(1) : 0}%</span> hit rate.
                  {weaponUsageStats.avg_cm_dispersion && (
                    <>
                      {" "}
                      Average grouping dispersion is <span className="font-medium">{weaponUsageStats.avg_cm_dispersion.toFixed(1)}cm</span>.
                    </>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className={`text-center py-12 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Usage Data Available</h3>
              <p className="text-sm">This weapon hasn't been used in any training sessions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  theme: string;
  colorScheme: "blue" | "green" | "purple" | "gold";
  highlight?: boolean;
  fullWidth?: boolean;
}

function StatCard({ icon, label, value, theme, colorScheme, highlight = false, fullWidth = false }: StatCardProps) {
  const getColorClasses = () => {
    const colors = {
      blue: {
        bg:
          theme === "dark"
            ? highlight
              ? "bg-blue-500/10 border border-blue-500/20"
              : "bg-blue-500/5"
            : highlight
              ? "bg-blue-50 border border-blue-100"
              : "bg-blue-25",
        icon: theme === "dark" ? "text-blue-400" : "text-blue-600",
        label: theme === "dark" ? "text-blue-300" : "text-blue-600",
        value: theme === "dark" ? "text-white" : "text-gray-900",
      },
      green: {
        bg:
          theme === "dark"
            ? highlight
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-green-500/5"
            : highlight
              ? "bg-green-50 border border-green-100"
              : "bg-green-25",
        icon: theme === "dark" ? "text-green-400" : "text-green-600",
        label: theme === "dark" ? "text-green-300" : "text-green-600",
        value: theme === "dark" ? "text-white" : "text-gray-900",
      },
      purple: {
        bg:
          theme === "dark"
            ? highlight
              ? "bg-purple-500/10 border border-purple-500/20"
              : "bg-purple-500/5"
            : highlight
              ? "bg-purple-50 border border-purple-100"
              : "bg-purple-25",
        icon: theme === "dark" ? "text-purple-400" : "text-purple-600",
        label: theme === "dark" ? "text-purple-300" : "text-purple-600",
        value: theme === "dark" ? "text-white" : "text-gray-900",
      },
      gold: {
        bg:
          theme === "dark"
            ? highlight
              ? "bg-amber-500/10 border border-amber-500/20"
              : "bg-amber-500/5"
            : highlight
              ? "bg-amber-50 border border-amber-100"
              : "bg-amber-25",
        icon: theme === "dark" ? "text-amber-400" : "text-amber-600",
        label: theme === "dark" ? "text-amber-300" : "text-amber-600",
        value: theme === "dark" ? "text-white" : "text-gray-900",
      },
    };
    return colors[colorScheme];
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`p-4 rounded-lg transition-all duration-200 ${colorClasses.bg} ${fullWidth ? "col-span-full" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={colorClasses.icon}>{icon}</div>
        <p className={`text-xs font-medium tracking-wide ${colorClasses.label}`}>{label}</p>
      </div>
      <div>
        <p className={`text-lg font-bold ${colorClasses.value}`}>{value}</p>
      </div>
    </div>
  );
}
