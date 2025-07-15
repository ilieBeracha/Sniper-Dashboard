import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "@/contexts/ThemeContext";

export default function BaseButton({
  children,
  onClick,
  disabled,
  className,
  padding = "px-4 py-1.5",
  style = "default",
  type = "button",
  isMenu = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  padding?: string;
  type?: "button" | "submit" | "reset";
  style?: "default" | "purple" | "white" | "gradient";
  isMenu?: boolean;
}) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const getStyleClasses = () => {
    const baseClasses = "transition-colors duration-200 rounded-md text-sm font-medium";

    switch (style) {
      case "default":
        return `${baseClasses} ${theme === "dark" ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900"}`;
      case "purple":
        return `${baseClasses} bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white shadow-sm disabled:cursor-not-allowed`;
      case "white":
        return `${baseClasses} ${
          theme === "dark" ? "bg-white/5 hover:bg-white/10 text-white" : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
        }`;
      case "gradient":
        return `${baseClasses} bg-gradient-to-r to-purple-600 from-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-sm disabled:cursor-not-allowed`;
      default:
        return `${baseClasses} ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900"}`;
    }
  };
  if (isMobile || isMenu) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${isMenu ? "w-full" : ""} text-xs rounded-2xl px-4 py-1 cursor-pointer transition-colors duration-200 ${
          isMobile && isMenu ? getStyleClasses() : ""
        }`}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`${getStyleClasses()} ${padding} ${className} ${
        theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  );
}
