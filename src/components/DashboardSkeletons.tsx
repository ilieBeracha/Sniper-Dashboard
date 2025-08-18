import { useTheme } from "@/contexts/ThemeContext";

// Basic skeleton line component
export const SkeletonLine = ({ width = "w-full", height = "h-4", className = "" }: { 
  width?: string; 
  height?: string; 
  className?: string;
}) => {
  const { theme } = useTheme();
  return (
    <div className={`${width} ${height} rounded-md ${
      theme === "dark" 
        ? "bg-gradient-to-r from-zinc-800 to-zinc-700" 
        : "bg-gradient-to-r from-gray-200 to-gray-100"
    } animate-pulse ${className}`} />
  );
};

// Basic skeleton circle component
export const SkeletonCircle = ({ size = "w-12 h-12", className = "" }: { 
  size?: string; 
  className?: string;
}) => {
  const { theme } = useTheme();
  return (
    <div className={`${size} rounded-full ${
      theme === "dark" 
        ? "bg-gradient-to-br from-zinc-800 to-zinc-700" 
        : "bg-gradient-to-br from-gray-200 to-gray-100"
    } animate-pulse ${className}`} />
  );
};

// Basic skeleton rectangle component
export const SkeletonBox = ({ width = "w-full", height = "h-32", className = "" }: { 
  width?: string; 
  height?: string; 
  className?: string;
}) => {
  const { theme } = useTheme();
  return (
    <div className={`${width} ${height} rounded-lg ${
      theme === "dark" 
        ? "bg-gradient-to-br from-zinc-800 to-zinc-700" 
        : "bg-gradient-to-br from-gray-200 to-gray-100"
    } animate-pulse ${className}`} />
  );
};

// Generic content skeleton with multiple lines
export const ContentSkeleton = ({ lines = 3 }: { lines?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine 
          key={i} 
          width={i === lines - 1 ? "w-3/4" : "w-full"} 
        />
      ))}
    </div>
  );
};

// Profile Card Skeleton
export const ProfileCardSkeleton = () => {
  return (
    <div className="space-y-3">
      <SkeletonLine height="h-6" width="w-2/3" />
      <ContentSkeleton lines={2} />
    </div>
  );
};

// Stats Link Card Skeleton
export const StatsLinkSkeleton = () => {
  return (
    <div className="space-y-2">
      <SkeletonLine height="h-5" width="w-1/2" />
      <SkeletonLine height="h-3" width="w-3/4" />
    </div>
  );
};

// Calendar Skeleton
export const CalendarSkeleton = () => {
  return (
    <div className="space-y-4">
      <SkeletonLine height="h-6" width="w-1/3" />
      <SkeletonBox height="h-48" />
    </div>
  );
};

// Charts Skeleton
export const ChartsSkeleton = () => {
  return (
    <div className="space-y-4">
      <SkeletonLine height="h-6" width="w-1/4" />
      <SkeletonBox height="h-64" />
    </div>
  );
};

// Generic card skeleton
export const CardSkeleton = ({ height = "h-32" }: { height?: string }) => {
  const { theme } = useTheme();
  return (
    <div className={`p-4 rounded-xl border ${
      theme === "dark" 
        ? "bg-zinc-900/50 border-zinc-800" 
        : "bg-white border-gray-200"
    }`}>
      <div className="space-y-3">
        <SkeletonLine height="h-5" width="w-1/3" />
        <SkeletonBox height={height} />
      </div>
    </div>
  );
};

// Loading wrapper component
export const LoadingWrapper = ({ 
  loading, 
  skeleton, 
  children 
}: { 
  loading: boolean;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
}) => {
  if (loading) {
    return <>{skeleton || <ContentSkeleton />}</>;
  }
  return <>{children}</>;
};

// Training Item Skeleton
export const TrainingItemSkeleton = () => {
  const { theme } = useTheme();
  return (
    <div className={`p-4 rounded-lg border ${
      theme === "dark" 
        ? "bg-zinc-900/50 border-zinc-800" 
        : "bg-white border-gray-200"
    } mb-3`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <SkeletonLine height="h-5" width="w-32" />
            <SkeletonLine height="h-4" width="w-20" className="opacity-60" />
          </div>
          <SkeletonLine height="h-4" width="w-3/4" />
          <div className="flex gap-4 mt-3">
            <SkeletonLine height="h-3" width="w-24" />
            <SkeletonLine height="h-3" width="w-24" />
            <SkeletonLine height="h-3" width="w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <SkeletonBox height="h-8" width="w-8" />
          <SkeletonBox height="h-8" width="w-8" />
        </div>
      </div>
    </div>
  );
};

// Trainings List Skeleton
export const TrainingsListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <TrainingItemSkeleton key={i} />
      ))}
    </div>
  );
};

// Full Dashboard Overview Skeleton - Basic and flexible
export const DashboardOverviewSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Top section with multiple content blocks */}
      <div className="space-y-4">
        <SkeletonBox height="h-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonBox height="h-32" />
          <SkeletonBox height="h-32" />
          <SkeletonBox height="h-32" />
        </div>
      </div>

      {/* Middle section with content */}
      <div className="space-y-3">
        <SkeletonLine height="h-6" width="w-1/4" />
        <ContentSkeleton lines={3} />
      </div>

      {/* Bottom section with larger content blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <SkeletonLine height="h-5" width="w-1/3" />
          <SkeletonBox height="h-48" />
        </div>
        <div className="space-y-3">
          <SkeletonLine height="h-5" width="w-1/3" />
          <SkeletonBox height="h-48" />
        </div>
      </div>
    </div>
  );
};