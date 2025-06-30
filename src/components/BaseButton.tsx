import { useIsMobile } from "@/hooks/useIsMobile";

export default function BaseButton({
  children,
  onClick,
  disabled,
  className,
  style = "default",
  type = "button",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  style?: "default" | "purple" | "white";
}) {
  const isMobile = useIsMobile();

  const styleClasses = {
    default: "px-4 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded-md text-sm font-medium text-white",
    purple:
      "bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 transition-colors rounded-md text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed",
    white: "px-4 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded-md text-sm font-medium text-white",
  };
  if (isMobile) {
    return (
      <button onClick={onClick} disabled={disabled} className={`${styleClasses[style]} ${className}`}>
        {children}
      </button>
    );
  }
  return (
    <button disabled={disabled} type={type} onClick={onClick} className={`${styleClasses[style]} ${className}`}>
      {children}
    </button>
  );
}
