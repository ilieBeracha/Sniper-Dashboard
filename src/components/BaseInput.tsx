import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ label, error, leftIcon, rightIcon, className, containerClassName, labelClassName, errorClassName, disabled, ...props }, ref) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label htmlFor={props.id} className={cn("block text-sm font-medium text-white text-left mb-1.5", labelClassName)}>
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            className={cn(
              " w-full  appearance-none px-4 py-2 text-sm shadow-theme-xs placeholder:text-gray-500 focus:outline-hidden focus:ring-3  dark:text-white/90 dark:placeholder:text-white/30",
              "placeholder:text-white placeholder:text-sm border rounded-lg bg-transparent text-gray-300 border-gray-700 focus:border-gray-500 focus:ring-gray-500/20",
              "transition-all duration-200 placeholder:pl-2 placeholder:text-gray-300 placeholder:text-sm",
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
