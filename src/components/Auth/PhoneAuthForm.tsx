import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import BaseInput from "@/components/base/BaseInput";

interface PhoneAuthFormProps {
  onSubmitPhone: (phoneNumber: string) => Promise<void>;
  onVerifyOTP: (otp: string) => Promise<void>;
  onBack?: () => void;
  isLoading?: boolean;
  error?: string;
}

export function PhoneAuthForm({
  onSubmitPhone,
  onVerifyOTP,
  onBack,
  isLoading = false,
  error: externalError
}: PhoneAuthFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const { theme } = useTheme();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const cleanedPhone = phoneNumber.replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      await onSubmitPhone(countryCode + cleanedPhone);
      setStep("otp");
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedValues = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedValues.forEach((val, i) => {
        if (index + i < 6) {
          newOtp[index + i] = val;
        }
      });
      setOtp(newOtp);
      
      // Focus on next empty field or last field
      const nextEmptyIndex = newOtp.findIndex(val => val === "");
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
      otpRefs.current[focusIndex]?.focus();
      
      // Auto-submit if all fields are filled
      if (newOtp.every(val => val !== "")) {
        handleOTPSubmit(newOtp.join(""));
      }
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }

      // Auto-submit if all fields are filled
      if (newOtp.every(val => val !== "")) {
        handleOTPSubmit(newOtp.join(""));
      }
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPSubmit = async (otpValue?: string) => {
    const code = otpValue || otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      await onVerifyOTP(code);
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setError("");
    try {
      const cleanedPhone = phoneNumber.replace(/\D/g, "");
      await onSubmitPhone(countryCode + cleanedPhone);
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    }
  };

  const phoneIcon = (
    <svg
      className={`h-4 w-4 transition-colors duration-200 ${theme === "dark" ? "text-gray-600" : "text-gray-500"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`p-2.5 rounded-lg text-xs ${
              theme === "dark" 
                ? "bg-red-900/50 text-red-300 border border-red-800" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {error}
          </motion.div>
        )}

        {step === "phone" ? (
          <motion.form
            key="phone-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handlePhoneSubmit}
            className="space-y-4"
          >
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}>
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-[#1E1E20] text-white border border-[#2A2A2A] hover:border-[#3A3A3A] focus:ring-gray-700 focus:border-transparent"
                      : "bg-white text-gray-900 border border-gray-200 hover:border-gray-300 focus:ring-gray-400 focus:border-transparent"
                  }`}
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+972">🇮🇱 +972</option>
                </select>
                <BaseInput
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="(555) 123-4567"
                  className="flex-1 text-sm py-2"
                  leftIcon={phoneIcon}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center px-3 py-2.5 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                theme === "dark"
                  ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-1 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                "Send Verification Code"
              )}
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className={`w-full text-center text-xs ${
                  theme === "dark" 
                    ? "text-gray-500 hover:text-gray-300" 
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                Back to other options
              </button>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="otp-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center space-y-2">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                theme === "dark" ? "bg-[#1E1E20]" : "bg-gray-100"
              }`}>
                <svg
                  className={`w-6 h-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Verify your phone
              </h3>
              <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                We sent a 6-digit code to {countryCode} {phoneNumber}
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  className={`w-10 h-12 text-center text-lg font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-[#1E1E20] text-white border border-[#2A2A2A] hover:border-[#3A3A3A] focus:ring-gray-700 focus:border-transparent"
                      : "bg-white text-gray-900 border border-gray-200 hover:border-gray-300 focus:ring-gray-400 focus:border-transparent"
                  } ${digit ? "border-2" : ""} ${
                    digit && theme === "dark" ? "border-white" : digit ? "border-gray-900" : ""
                  }`}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="text-center space-y-3">
              <button
                type="button"
                onClick={() => handleOTPSubmit()}
                disabled={isLoading || otp.some(d => !d)}
                className={`w-full flex justify-center items-center px-3 py-2.5 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-1 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-1 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  "Verify Code"
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs">
                <span className={theme === "dark" ? "text-gray-500" : "text-gray-500"}>
                  Didn't receive the code?
                </span>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0}
                  className={`font-medium transition-colors ${
                    resendTimer > 0
                      ? theme === "dark" ? "text-gray-600" : "text-gray-400"
                      : theme === "dark" 
                        ? "text-gray-400 hover:text-white" 
                        : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp(["", "", "", "", "", ""]);
                  setError("");
                }}
                className={`text-xs ${
                  theme === "dark" 
                    ? "text-gray-500 hover:text-gray-300" 
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                Change phone number
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}