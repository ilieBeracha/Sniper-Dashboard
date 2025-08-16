import { useTheme } from "@/contexts/ThemeContext";

// Profile Card Skeleton
export const ProfileCardSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`p-6 rounded-xl border transition-colors duration-200 ${
      theme === "dark" 
        ? "bg-zinc-900/50 border-zinc-800" 
        : "bg-white border-gray-200"
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar skeleton */}
          <div className={`w-16 h-16 rounded-full animate-pulse ${
            theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
          }`} />
          
          {/* Text content skeleton */}
          <div className="space-y-2">
            <div className={`h-6 w-32 rounded animate-pulse ${
              theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
            }`} />
            <div className={`h-4 w-24 rounded animate-pulse ${
              theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
            }`} />
          </div>
        </div>
        
        {/* Badge skeleton */}
        <div className={`h-6 w-20 rounded-full animate-pulse ${
          theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
        }`} />
      </div>
    </div>
  );
};

// Stats Link Card Skeleton
export const StatsLinkSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`mt-4 p-4 rounded-xl border transition-colors duration-200 ${
      theme === "dark" 
        ? "bg-zinc-900/50 border-zinc-800" 
        : "bg-white border-gray-200"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Icon skeleton */}
          <div className={`w-10 h-10 rounded-lg animate-pulse ${
            theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
          }`} />
          
          {/* Text skeleton */}
          <div className="space-y-1">
            <div className={`h-4 w-36 rounded animate-pulse ${
              theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
            }`} />
            <div className={`h-3 w-28 rounded animate-pulse ${
              theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
            }`} />
          </div>
        </div>
        
        {/* Arrow skeleton */}
        <div className={`w-5 h-5 rounded animate-pulse ${
          theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
        }`} />
      </div>
    </div>
  );
};

// Calendar Skeleton
export const CalendarSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`p-4 rounded-xl border transition-colors duration-200 ${
      theme === "dark" 
        ? "bg-zinc-900/50 border-zinc-800" 
        : "bg-white border-gray-200"
    }`}>
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`h-5 w-24 rounded animate-pulse ${
          theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
        }`} />
        <div className="flex gap-2">
          <div className={`w-8 h-8 rounded animate-pulse ${
            theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
          }`} />
          <div className={`w-8 h-8 rounded animate-pulse ${
            theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
          }`} />
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded animate-pulse ${
              theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Charts Skeleton
export const ChartsSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1 */}
      <div className={`p-6 rounded-xl border transition-colors duration-200 ${
        theme === "dark" 
          ? "bg-zinc-900/50 border-zinc-800" 
          : "bg-white border-gray-200"
      }`}>
        {/* Chart header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`h-5 w-32 rounded animate-pulse ${
            theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
          }`} />
          <div className={`h-4 w-16 rounded animate-pulse ${
            theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
          }`} />
        </div>
        
        {/* Chart body */}
        <div className={`h-64 rounded animate-pulse ${
          theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
        }`} />
      </div>
      
      {/* Chart 2 */}
      <div className={`p-6 rounded-xl border transition-colors duration-200 ${
        theme === "dark" 
          ? "bg-zinc-900/50 border-zinc-800" 
          : "bg-white border-gray-200"
      }`}>
        {/* Chart header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`h-5 w-32 rounded animate-pulse ${
            theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
          }`} />
          <div className={`h-4 w-16 rounded animate-pulse ${
            theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
          }`} />
        </div>
        
        {/* Chart body */}
        <div className={`h-64 rounded animate-pulse ${
          theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
        }`} />
      </div>
    </div>
  );
};

// Full Dashboard Overview Skeleton
export const DashboardOverviewSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Profile Section with Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2">
          <ProfileCardSkeleton />
          <StatsLinkSkeleton />
        </div>
        
        {/* Calendar on desktop, moves down on mobile */}
        <div className="lg:col-span-1">
          <CalendarSkeleton />
        </div>
      </div>

      {/* Charts Section */}
      <div className="w-full">
        <ChartsSkeleton />
      </div>
    </div>
  );
};