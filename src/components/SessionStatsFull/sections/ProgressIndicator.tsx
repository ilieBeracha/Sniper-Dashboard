import { cn } from "@/lib/utils";
import { motion, MotionProps } from "framer-motion";
import React from "react";

interface ScrollProgressProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  activeSection: number; // 0‑based, current section in view
  totalSections: number; // total count of sections/components
}

export const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(({ className, activeSection, totalSections, ...props }, ref) => {
  // Evenly divide 0‑1 across (totalSections‑1) steps.
  const progress = totalSections > 1 ? Math.min(1, activeSection / (totalSections - 1)) : 1;

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-50 h-1 origin-left", "bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]", className)}
      initial={false} // keep current scale between mounts
      animate={{ scaleX: progress }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      {...props}
    />
  );
});

ScrollProgress.displayName = "ScrollProgress";
