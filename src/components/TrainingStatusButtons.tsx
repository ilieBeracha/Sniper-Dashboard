import { TrainingStatus } from "@/types/training";
import { useTheme } from "@/contexts/ThemeContext";
import { isCommander } from "@/utils/permissions";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { Clock, CheckCircle, XCircle, PlayCircle, Shield } from "lucide-react";
import { isMobile } from "react-device-detect";
import { UserRole } from "@/types/user";
import { primitives } from "@/styles/core";

type TrainingStatusButtonsProps = {
  currentStatus: TrainingStatus;
  onStatusChange: (status: TrainingStatus) => void;
};

export default function TrainingStatusButtons({ currentStatus, onStatusChange }: TrainingStatusButtonsProps) {
  const { theme } = useTheme();
  const mainStatuses = [TrainingStatus.Scheduled, TrainingStatus.InProgress, TrainingStatus.Completed];
  const { user } = useStore(userStore);

  const getStatusConfig = (status: TrainingStatus) => {
    const configs = {
      [TrainingStatus.Scheduled]: {
        displayName: "Scheduled",
        icon: Clock,
      },
      [TrainingStatus.InProgress]: {
        displayName: "In Progress",
        icon: PlayCircle,
      },
      [TrainingStatus.Completed]: {
        displayName: "Completed",
        icon: CheckCircle,
      },
      [TrainingStatus.Canceled]: {
        displayName: "Canceled",
        icon: XCircle,
      },
    };
    return configs[status as keyof typeof configs];
  };

  if (!isCommander(user?.user_role as UserRole)) return null;

  return (
    <div
      className="rounded-2xl p-6 shadow-sm transition-all duration-200 mb-4 border"
      style={{
        backgroundColor: theme === "dark" ? `${primitives.grey.grey900}80` : primitives.white.white,
        borderColor: theme === "dark" ? primitives.grey.grey800 : primitives.grey.grey100
      }}
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: theme === "dark" ? `${primitives.white.white}0D` : primitives.grey.grey100 }}
        >
          <Shield className="w-5 h-5" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }} />
        </div>
        <h3 className="text-lg font-semibold" style={{ color: theme === "dark" ? primitives.grey.grey100 : primitives.grey.grey900 }}>Session Control</h3>
      </div>

      {/* Status Buttons Container */}
      <div className="space-y-4">
        {/* Main Status Buttons */}
        <div className={`${isMobile ? "grid grid-cols-1 gap-3" : "flex items-center gap-3"}`}>
          {mainStatuses.map((status) => {
            const config = getStatusConfig(status);
            const isActive = status === currentStatus;
            const Icon = config.icon;

            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(status)}
                disabled={isActive}
                className={`${isMobile ? "w-full" : "flex-1"} px-4 py-3 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 text-sm border`}
                style={{
                  backgroundColor: isActive
                    ? theme === "dark" ? `${primitives.white.white}1A` : primitives.grey.grey900
                    : "transparent",
                  color: isActive
                    ? theme === "dark" ? primitives.white.white : primitives.white.white
                    : theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600,
                  borderColor: isActive
                    ? theme === "dark" ? `${primitives.white.white}33` : primitives.grey.grey900
                    : theme === "dark" ? primitives.grey.grey700 : primitives.grey.grey200,
                  cursor: isActive ? "not-allowed" : "pointer"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = theme === "dark" ? `${primitives.white.white}0D` : primitives.grey.grey50;
                    e.currentTarget.style.color = theme === "dark" ? primitives.grey.grey200 : primitives.grey.grey900;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600;
                  }
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{config.displayName}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: theme === "dark" ? `${primitives.grey.grey700}80` : primitives.grey.grey200 }} />

        {/* Cancel Button */}
        <div className={`${isMobile ? "w-full" : "flex justify-end"}`}>
          <button
            type="button"
            onClick={() => onStatusChange(TrainingStatus.Canceled)}
            disabled={currentStatus === TrainingStatus.Canceled}
            className={`
              ${isMobile ? "w-full" : "px-6"}
              py-3 flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200
              ${
                currentStatus === TrainingStatus.Canceled
                  ? theme === "dark"
                    ? "bg-white/10 text-white border border-white/20 cursor-not-allowed"
                    : "bg-gray-900 text-white border border-gray-900 cursor-not-allowed"
                  : theme === "dark"
                    ? "bg-transparent text-gray-400 border border-zinc-700 hover:bg-white/5 hover:text-red-400"
                    : "bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-red-600"
              }
              text-sm
            `}
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Training</span>
          </button>
        </div>
      </div>
    </div>
  );
}
