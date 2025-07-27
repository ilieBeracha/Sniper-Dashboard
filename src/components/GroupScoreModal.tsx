// GroupScoreModal.tsx (Updated + Mobile Compact)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { sessionStore } from "@/store/sessionStore";
import { useStore } from "zustand";
import { Target, Trophy, Users, TrendingUp, MapPin, Crosshair } from "lucide-react";

interface GroupScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupScoreModal({ isOpen, onClose }: GroupScoreModalProps) {
  const { theme } = useTheme();
  const { groupStatsComparison } = useStore(sessionStore);
  if (!groupStatsComparison) return null;

  const getScoreColor = (dispersion: number) => {
    if (dispersion <= 5) return "text-green-500";
    if (dispersion <= 10) return "text-yellow-500";
    if (dispersion <= 15) return "text-orange-500";
    return "text-red-500";
  };

  const format = (val: number | string | null | undefined) =>
    val !== null && val !== undefined ? parseFloat(val as string).toFixed(1) + " cm" : "-";

  const ComparisonCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    highlight = false,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    highlight?: boolean;
  }) => (
    <div
      className={`p-3 rounded-lg flex flex-col gap-1 ${highlight ? "ring-2 ring-purple-500/50" : ""} ${theme === "dark" ? "bg-zinc-800/50" : "bg-gray-50"}`}
    >
      <div className="flex justify-between items-center">
        <Icon className="w-4 h-4 text-zinc-400" />
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full ${highlight ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-400"}`}
        >
          {title}
        </span>
      </div>
      <div className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{value}</div>
      {subtitle && <div className="text-xs text-gray-500 dark:text-zinc-400">{subtitle}</div>}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-md md:max-w-2xl max-h-[75vh] overflow-y-auto ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Group Score Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className={`text-center p-6 rounded-xl ${theme === "dark" ? "bg-zinc-800/30" : "bg-gray-50"}`}>
            <Crosshair className="w-10 h-10 mx-auto mb-2 text-purple-500" />
            <p className="text-sm text-gray-500 dark:text-zinc-400">Current Score</p>
            <p className={`text-4xl font-bold ${getScoreColor(groupStatsComparison.this_score?.cm_dispersion)}`}>
              {groupStatsComparison.this_score?.cm_dispersion} <span className="text-xl">cm</span>
            </p>
            <div className="flex justify-center gap-2 text-xs mt-2 text-gray-500 dark:text-zinc-400">
              <span>{groupStatsComparison.this_score?.weapon_type}</span>
              <span>{groupStatsComparison.this_score?.position}</span>
              <span>{groupStatsComparison.this_score?.type}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Your Performance</h3>
            <div className="grid grid-cols-2 gap-2">
              <ComparisonCard title="Your Avg" value={format(groupStatsComparison.user_comparison?.user_avg)} icon={TrendingUp} />
              <ComparisonCard
                title="Your Best"
                value={format(groupStatsComparison.user_comparison?.user_best)}
                subtitle={groupStatsComparison.user_comparison?.is_best_score ? "New personal best!" : undefined}
                icon={Trophy}
                highlight={groupStatsComparison.user_comparison?.is_best_score}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Team Averages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <ComparisonCard
                title="For Weapon"
                value={format(groupStatsComparison.team_comparison?.avg_for_weapon)}
                subtitle={groupStatsComparison.this_score?.weapon_type}
                icon={Target}
              />
              <ComparisonCard
                title="For Position"
                value={format(groupStatsComparison.team_comparison?.avg_for_position)}
                subtitle={groupStatsComparison.this_score?.position}
                icon={MapPin}
              />
              <ComparisonCard
                title="For Type"
                value={format(groupStatsComparison.team_comparison?.avg_for_type)}
                subtitle={groupStatsComparison.this_score?.type}
                icon={Users}
              />
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${theme === "dark" ? "bg-zinc-800/30 border-zinc-700" : "bg-blue-50 border-blue-200"}`}>
            <h3 className="text-sm font-medium mb-2">Performance Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              {groupStatsComparison.this_score?.cm_dispersion < groupStatsComparison.user_comparison?.user_avg
                ? `You're ${Math.abs(groupStatsComparison.user_comparison?.user_avg - groupStatsComparison.this_score?.cm_dispersion).toFixed(1)} cm better than your average.`
                : `You're ${Math.abs(groupStatsComparison.this_score?.cm_dispersion - groupStatsComparison.user_comparison?.user_avg).toFixed(1)} cm above your average.`}
              {groupStatsComparison.user_comparison?.is_best_score && " 🎯 New personal best!"}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-zinc-800"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
