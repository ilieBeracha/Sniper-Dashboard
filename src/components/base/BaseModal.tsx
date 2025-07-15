import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

type Position = "top" | "right" | "bottom" | "left" | "center";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: Position;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

const sizeClasses = {
  sm: "max-w-2xl h-full",
  md: "max-w-4xl h-full",
  lg: "max-w-6xl h-full",
  xl: "max-w-7xl h-full",
  full: "w-full h-full",
};

const positionClasses = {
  top: "top-0 left-0 right-0",
  right: "top-0 right-0 bottom-0",
  bottom: "bottom-0 left-0 right-0",
  left: "top-0 left-0 bottom-0",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

const positionAnimations = {
  top: {
    enter: "translate-y-0",
    leave: "-translate-y-full",
  },
  right: {
    enter: "translate-x-0",
    leave: "translate-x-full",
  },
  bottom: {
    enter: "translate-y-0",
    leave: "translate-y-full",
  },
  left: {
    enter: "translate-x-0",
    leave: "-translate-x-full",
  },
  center: {
    enter: "scale-100 opacity-100",
    leave: "scale-95 opacity-0",
  },
};

export default function BaseModal({
  isOpen,
  onClose,
  children,
  title,
  position = "center",
  size = "md",
  showCloseButton = true,
  className = "w-full h-full flex items-center justify-center",
  contentClassName,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollLockRef = useRef<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (!closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Store the current scroll position
      scrollLockRef.current = window.scrollY;
      // Add a class to the body instead of directly manipulating style
      document.body.classList.add("modal-open");
      // Set the body position to fixed and adjust top to prevent jump
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollLockRef.current}px`;
      document.body.style.width = "100%";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      // Restore scroll position and remove fixed positioning
      document.body.classList.remove("modal-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollLockRef.current);
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const isDrawer = position !== "center";
  const baseClasses = isDrawer
    ? "fixed inset-0 z-50 flex items-center sm:items-center justify-center"
    : "fixed inset-0 z-50 flex items-center justify-center h-full w-full";

  return (
    <div className={cn(baseClasses, className)} onClick={handleOverlayClick}>
      {/* Modal/Drawer Content */}
      <div
        ref={modalRef}
        className={cn(
          `relative rounded-lg shadow-xl transition-all duration-300 h-screen border overflow-y-auto ${
            theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          }`,
          positionClasses[position],
          positionAnimations[position].enter,
          !isDrawer && sizeClasses[size],
          isDrawer && "h-full sm:h-auto",
          "max-h-[90vh] overflow-y-auto", // Add max height and scrolling
          contentClassName,
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between p-4 border-b sticky top-0 z-10 transition-colors duration-200 ${
              theme === "dark" ? "border-zinc-800 bg-zinc-900" : "border-gray-200 bg-white"
            }`}
          >
            {title && (
              <h2 className={`text-lg font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`p-1 rounded-lg transition-colors duration-200 ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-gray-100"}`}
                aria-label="Close"
              >
                <X className={`w-5 h-5 transition-colors duration-200 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
