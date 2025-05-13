import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  withBackground?: boolean;
  withBorder?: boolean;
  withHover?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

export const Card = ({ children, className = "", withBackground = true, withBorder = true, withHover = true, header, footer }: CardProps) => {
  return (
    <div
      className={`
        rounded-xl transition-all duration-300
        ${withBackground ? "bg-[#1E1E1E]" : "bg-transparent"}
        ${withBorder ? "border border-white/5" : ""}
        ${withHover ? "hover:border-white/10" : ""}
        ${className}
      `}
    >
      {header && <div className="px-4 py-4 border-b border-white/5">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="px-4 py-4 border-t border-white/5">{footer}</div>}
    </div>
  );
};
