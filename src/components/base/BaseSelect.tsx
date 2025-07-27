import { forwardRef, SelectHTMLAttributes } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface Option {
  value: string;
  label: string;
}

interface BaseSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
  isRequired?: boolean;
}

const BaseSelect = forwardRef<HTMLSelectElement, BaseSelectProps>(
  ({ label, error, options, placeholder = "Select an option", isRequired, className, disabled, ...props }, ref) => {
    const { theme } = useTheme();

    const selectClasses = `w-full rounded-lg px-3 py-2 min-h-10 text-sm border transition-all duration-200 ${
      theme === "dark"
        ? `bg-zinc-800/50 text-white border-zinc-700 ${error ? "border-red-500 focus:border-red-500" : "hover:border-zinc-600 focus:border-blue-500"}`
        : `bg-white text-gray-900 border-gray-300 ${error ? "border-red-500 focus:border-red-500" : "hover:border-gray-400 focus:border-blue-500"}`
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""} focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${className || ""}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm mb-1 ">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select ref={ref} className={`h-10 ${selectClasses}`} disabled={disabled} {...props}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option className="py-2" key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-xs mt-1 animate-fadeIn">{error}</p>}
      </div>
    );
  },
);

BaseSelect.displayName = "BaseSelect";

export default BaseSelect;
