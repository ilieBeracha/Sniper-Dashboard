import React, { useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface OTPInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
  size?: "sm" | "md";
}

export const OTPInput = ({ value, onChange, max, className = "", size = "md" }: OTPInputProps) => {
  const { theme } = useTheme();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Convert number to 2-digit array
  const valueStr = value.toString().padStart(2, "0");
  const digits = valueStr.split("").map((d) => d);


  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newDigits = [...digits];
    newDigits[index] = digit || "0";

    const newValue = parseInt(newDigits.join("")) || 0;

    // Check max constraint
    if (max !== undefined && newValue > max) {
      return;
    }

    onChange(newValue);

    // Move to next input if digit entered
    if (digit && index < 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      if (digits[index] !== "0") {
        // Clear current digit
        handleChange(index, "0");
      } else if (index > 0) {
        // Move to previous input and clear it
        inputRefs.current[index - 1]?.focus();
        handleChange(index - 1, "0");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDigits = pastedData.replace(/\D/g, "").slice(0, 2).padStart(2, "0").split("");

    const newValue = parseInt(pastedDigits.join("")) || 0;

    if (max !== undefined && newValue > max) {
      return;
    }

    onChange(newValue);
    inputRefs.current[1]?.focus();
  };

  const inputSize = size === "sm" ? "w-8 h-8 text-sm" : "w-10 h-11 text-base";
  const gapSize = size === "sm" ? "gap-1.5" : "gap-2";

  return (
    <div className={`flex items-center ${gapSize} ${className}`}>
      {digits.map((digit, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => {
              if (el) {
                inputRefs.current[index] = el;
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit === "0" ? "" : digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={`${inputSize} text-center font-medium rounded-lg transition-all ${
              theme === "dark"
                ? "bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:bg-zinc-700"
                : "bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white"
            }`}
            placeholder="0"
          />
        </React.Fragment>
      ))}
    </div>
  );
};
