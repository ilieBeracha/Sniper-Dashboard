import { cn } from "@/lib/utils";
import { motion, MotionProps } from "framer-motion"; // ← use framer‑motion
import React from "react";

interface ScrollProgressProps extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps> {
  activeSection: number; // 0‑based index of the section currently in view
  totalSections: number; // total number of sections/components
}

const getProgress = (activeSection: number, totalSections: number) => {
  return Math.min(1, (activeSection + 1) / totalSections);
};

export const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(({ className, activeSection, totalSections, ...props }, ref) => {
  // Start at 1 / totalSections (e.g. 0.2 when totalSections = 5) and
  // reach 1.0 on the last section.
  const progress = getProgress(activeSection, totalSections);

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-0 z-50 h-1 origin-left", "bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]", className)}
      initial={{ scaleX: 1 }}
      animate={{ scaleX: progress }}
      {...props}
    />
  );
});

ScrollProgress.displayName = "ScrollProgress";
