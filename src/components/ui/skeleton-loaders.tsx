import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  const { theme } = useTheme();
  
  return (
    <div
      className={cn(
        "rounded-md",
        theme === "dark" ? "bg-zinc-800/50" : "bg-gray-200",
        animate && "animate-pulse",
        className
      )}
    />
  );
}

export function StatsKPISkeleton() {
  const { theme } = useTheme();
  const bgCard = theme === "dark" ? "bg-zinc-900/50" : "bg-white";
  const border = theme === "dark" ? "border-zinc-800" : "border-gray-200";

  return (
    <div className={`${bgCard} border ${border}`}>
      <div className="grid grid-cols-3 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-zinc-800/50">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="p-2.5 lg:p-3 flex flex-col items-center justify-center">
            <Skeleton className="w-3 h-3 mb-2" />
            <Skeleton className="w-12 h-6 mb-1" />
            <Skeleton className="w-16 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-4", className)}>
      <div className="space-y-4">
        {/* Chart title */}
        <Skeleton className="h-4 w-32" />
        
        {/* Chart area */}
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between py-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-3 w-6" />
            ))}
          </div>
          
          {/* Chart bars/lines */}
          <div className="ml-10 h-full flex items-end justify-around gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ height: `${Math.random() * 60 + 20}%` }}
              >
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="ml-10 mt-2 flex justify-around">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  const { theme } = useTheme();
  
  return (
    <div className="w-full">
      {/* Table header */}
      <div className={`grid grid-cols-4 gap-4 p-3 border-b ${
        theme === "dark" ? "border-zinc-800" : "border-gray-200"
      }`}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>
      
      {/* Table rows */}
      {[...Array(rows)].map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={`grid grid-cols-4 gap-4 p-3 border-b ${
            theme === "dark" ? "border-zinc-800/50" : "border-gray-100"
          }`}
        >
          {[...Array(4)].map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function MatrixSkeleton() {
  const { theme } = useTheme();
  
  return (
    <div className="p-4">
      <div className="grid grid-cols-8 gap-1">
        {[...Array(48)].map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "aspect-square rounded",
              Math.random() > 0.5 && (theme === "dark" ? "bg-zinc-700" : "bg-gray-300")
            )}
          />
        ))}
      </div>
    </div>
  );
}