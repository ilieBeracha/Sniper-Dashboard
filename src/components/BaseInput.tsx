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
              "block w-full rounded-md text-white border border-[#2A2A2A] bg-zinc-900 px-1 py-1 text-sm",
              "focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "placeholder:text-white placeholder:text-sm",
              "transition-all duration-200 placeholder:pl-2 placeholder:text-white placeholder:text-sm",
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
