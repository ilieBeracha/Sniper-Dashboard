import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  isRequired?: boolean;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ label, error, leftIcon, rightIcon, className, containerClassName, labelClassName, errorClassName, disabled, isRequired, ...props }, ref) => {
    const { theme } = useTheme();
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              `block text-sm font-medium text-left mb-1.5 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`,
              labelClassName,
            )}
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            className={cn(
              "w-full appearance-none px-4 py-2 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 transition-all duration-200 border rounded-lg bg-transparent",
              theme === "dark"
                ? "text-gray-300 placeholder:text-gray-400 border-gray-700 focus:border-gray-500 focus:ring-gray-500/20"
                : "text-gray-900 placeholder:text-gray-500 border-gray-300 focus:border-gray-500 focus:ring-gray-500/20 bg-white",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className,
            )}
            disabled={disabled}
            {...props}
          />
          {rightIcon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">{rightIcon}</div>}
        </div>
        {error && <p className={cn("mt-1 text-sm text-red-500", errorClassName)}>{error}</p>}
      </div>
    );
  },
);

BaseInput.displayName = "BaseInput";

export default BaseInput;
