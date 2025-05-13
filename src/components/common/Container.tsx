import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  centered?: boolean;
  withPadding?: boolean;
}

export const Container = ({ children, className = "", maxWidth = "7xl", centered = true, withPadding = true }: ContainerProps) => {
  const maxWidths = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    "3xl": "max-w-[1600px]",
    "4xl": "max-w-[1800px]",
    "5xl": "max-w-[2000px]",
    "6xl": "max-w-[2200px]",
    "7xl": "max-w-[2400px]",
  };

  return (
    <div
      className={`
        w-full
        ${maxWidths[maxWidth]}
        ${centered ? "mx-auto" : ""}
        ${withPadding ? "px-4 sm:px-6 lg:px-8" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
