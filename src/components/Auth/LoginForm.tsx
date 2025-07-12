import React, { useState } from "react";
import BaseInput from "@/components/base/BaseInput";
import { useTheme } from "@/contexts/ThemeContext";
import { validateAuthForm } from "@/lib/formValidation";

export function ModernLogin({ AuthSubmit, onRegisterClick }: { AuthSubmit: any; onRegisterClick?: (type: string) => any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateAuthForm({ email, password });
    if (validationError) {
      setError(validationError);
      return;
    }

    AuthSubmit({ email, password });
  };

  const emailIcon = (
    <svg
      className={`h-5 w-5 transition-colors duration-200 ${theme === "dark" ? "text-gray-600" : "text-gray-500"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
      />
    </svg>
  );

  const passwordIcon = (
    <svg
      className={`h-5 w-5 transition-colors duration-200 ${theme === "dark" ? "text-gray-600" : "text-gray-500"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  const togglePasswordIcon = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className={`h-5 w-5 transition-colors duration-200 ${
        theme === "dark" ? "text-gray-600 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {showPassword ? (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ) : (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      )}
    </button>
  );

  return (
    <form className="space-y-6 " onSubmit={handleSubmit}>
      {error && (
        <div
          className={`p-3 rounded-lg text-sm ${
            theme === "dark" ? "bg-red-900/50 text-red-300 border border-red-800" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {error}
        </div>
      )}

      <BaseInput
        label="Email address"
        type="email"
        id="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="text-sm"
        leftIcon={emailIcon}
      />

      <BaseInput
        label="Password"
        type={showPassword ? "text" : "password"}
        id="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="text-md"
        leftIcon={passwordIcon}
        rightIcon={togglePasswordIcon}
      />

      <div className="space-y-4">
        <button
          type="submit"
          className={`w-full flex justify-center items-center px-4 py-4 rounded-2xl font-semibold focus:outline-none focus:ring-2 transition-all duration-200 ${
            theme === "dark"
              ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
              : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white"
          }`}
        >
          Sign In
        </button>

        {onRegisterClick && (
          <div className={`mt-6 pt-4 border-t transition-colors duration-200 ${theme === "dark" ? "border-[#2A2A2A]" : "border-gray-300"}`}>
            <p className={`text-sm text-center mb-3 transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Don't have an account?
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onRegisterClick("team_manager_register")}
                className={`w-full px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  theme === "dark" ? "text-gray-300 hover:text-white hover:bg-[#1E1E20]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Register as Team Commander
              </button>
              <button
                type="button"
                onClick={() => onRegisterClick("squad_manager_register")}
                className={`w-full px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  theme === "dark" ? "text-gray-300 hover:text-white hover:bg-[#1E1E20]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Register as Squad Commander
              </button>
              <button
                type="button"
                onClick={() => onRegisterClick("soldier_register")}
                className={`w-full px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  theme === "dark" ? "text-gray-300 hover:text-white hover:bg-[#1E1E20]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Register as Soldier
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
