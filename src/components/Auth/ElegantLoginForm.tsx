import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { validateAuthForm } from "@/lib/formValidation";
import { GoogleLogin } from "@react-oauth/google";
import { toastService } from "@/services/toastService";
import { motion, AnimatePresence } from "framer-motion";

export function ElegantLoginForm({
  AuthSubmit,
  onRegisterClick,
  onSignInWithEmail,
  handleSignInWithGoogle,
}: {
  AuthSubmit: any;
  onRegisterClick?: (type: string) => any;
  onSignInWithEmail?: (email: string) => void;
  handleSignInWithGoogle?: (response: any) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "magiclink">("password");
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (loginMethod === "password") {
        const validationError = validateAuthForm({ email, password });
        if (validationError) {
          setError(validationError);
          setIsLoading(false);
          return;
        }
        await AuthSubmit({ email, password });
      } else {
        if (!email) {
          setError("Please enter your email address");
          setIsLoading(false);
          return;
        }
        if (onSignInWithEmail) {
          await onSignInWithEmail(email);
          setMagicLinkSent(true);
        } else {
          setError("Magic link login is not configured");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = (response: any) => {
    handleSignInWithGoogle?.(response);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {magicLinkSent ? (
            <motion.div
              key="magic-link-sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-lg text-center space-y-4 ${
                theme === "dark" 
                  ? "bg-gray-800/50 border border-gray-700/30" 
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-gray-700/50" : "bg-gray-100"
              }`}>
                <svg
                  className={`w-8 h-8 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Check your email
              </h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                We've sent a magic link to <span className="font-medium">{email}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setMagicLinkSent(false);
                  setLoginMethod("password");
                }}
                className={`text-sm font-medium transition-colors ${
                  theme === "dark" 
                    ? "text-gray-400 hover:text-white" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Back to login
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg text-sm flex items-center gap-3 ${
                    theme === "dark" 
                      ? "bg-red-900/20 text-red-400 border border-red-900/30" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </motion.div>
              )}

              {/* Login Method Toggle */}
              <div className={`flex gap-1 p-1 rounded-lg ${
                theme === "dark" 
                  ? "bg-gray-800/30 border border-gray-700/30" 
                  : "bg-gray-100 border border-gray-200"
              }`}>
                {["password", "magiclink"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setLoginMethod(method as "password" | "magiclink")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginMethod === method
                        ? theme === "dark"
                          ? "bg-gray-700 text-white shadow-sm"
                          : "bg-white text-gray-900 shadow-sm"
                        : theme === "dark"
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {method === "password" ? "Password" : "Magic Link"}
                  </button>
                ))}
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`w-5 h-5 ${
                      focusedField === "email" 
                        ? theme === "dark" ? "text-gray-300" : "text-gray-600"
                        : theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-200 ${
                      theme === "dark"
                        ? "bg-gray-800/50 text-white placeholder-gray-500 border border-gray-700/50 focus:border-gray-600 focus:bg-gray-800/70"
                        : "bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-gray-400 focus:bg-white"
                    } focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                      theme === "dark" ? "focus:ring-gray-700/50" : "focus:ring-gray-200"
                    }`}
                  />
                </div>
              </div>

              {/* Password Input */}
              {loginMethod === "password" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className={`block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Password
                    </label>
                    <a href="#" className={`text-sm transition-colors ${
                      theme === "dark" 
                        ? "text-gray-400 hover:text-gray-300" 
                        : "text-gray-600 hover:text-gray-800"
                    }`}>
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className={`w-5 h-5 ${
                        focusedField === "password" 
                          ? theme === "dark" ? "text-gray-300" : "text-gray-600"
                          : theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-12 py-3 rounded-lg transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-gray-800/50 text-white placeholder-gray-500 border border-gray-700/50 focus:border-gray-600 focus:bg-gray-800/70"
                          : "bg-white text-gray-900 placeholder-gray-400 border border-gray-300 focus:border-gray-400 focus:bg-white"
                      } focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                        theme === "dark" ? "focus:ring-gray-700/50" : "focus:ring-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                        theme === "dark" 
                          ? "text-gray-500 hover:text-gray-300" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-white text-gray-900 hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-400"
                    : "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
                } disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  theme === "dark" ? "focus:ring-white focus:ring-offset-gray-900" : "focus:ring-gray-900 focus:ring-offset-white"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : loginMethod === "password" ? (
                  "Sign In"
                ) : (
                  "Send Magic Link"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${
                    theme === "dark" ? "border-gray-700/30" : "border-gray-200"
                  }`} />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className={`px-4 ${
                    theme === "dark" ? "bg-gray-900 text-gray-500" : "bg-gray-50 text-gray-500"
                  }`}>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <div className="w-full [&>div]:w-full [&>div>div]:w-full [&>div>div>div]:w-full [&>div>div>div>iframe]:w-full [&>div>div>div>iframe]:rounded-lg">
                <GoogleLogin
                  size="large"
                  width="100%"
                  type="standard"
                  onSuccess={handleGoogleLogin}
                  shape="rectangular"
                  logo_alignment="center"
                  text="signin_with"
                  auto_select={false}
                  useOneTap={false}
                  ux_mode="popup"
                  onError={() => toastService.error("Failed to sign in with Google")}
                />
              </div>

              {/* Register Links */}
              {onRegisterClick && (
                <div className={`pt-6 border-t ${
                  theme === "dark" ? "border-gray-700/30" : "border-gray-200"
                }`}>
                  <p className={`text-sm text-center mb-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    New to the platform?
                  </p>
                  <div className="space-y-2">
                    {[
                      { type: "team_manager_register", label: "Register as Team Commander" },
                      { type: "squad_manager_register", label: "Register as Squad Commander" },
                      { type: "soldier_register", label: "Register as Soldier" }
                    ].map(({ type, label }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => onRegisterClick(type)}
                        className={`w-full py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                          theme === "dark" 
                            ? "text-gray-300 hover:text-white hover:bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/30" 
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}