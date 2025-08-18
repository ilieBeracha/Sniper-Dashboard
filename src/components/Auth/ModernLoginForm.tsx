import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { validateAuthForm } from "@/lib/formValidation";
import { GoogleLogin } from "@react-oauth/google";
import { toastService } from "@/services/toastService";
import { motion, AnimatePresence } from "framer-motion";

export function ModernLoginForm({
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

  const inputVariants = {
    focused: { scale: 1.02, transition: { duration: 0.2 } },
    unfocused: { scale: 1, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      {/* Background gradient blob */}
      <div className={`absolute -inset-4 rounded-3xl opacity-20 blur-3xl transition-all duration-1000 ${
        theme === "dark" 
          ? "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" 
          : "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
      }`} />

      <form className="relative space-y-6" onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {magicLinkSent ? (
            <motion.div
              key="magic-link-sent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`p-8 rounded-2xl text-center space-y-4 backdrop-blur-md ${
                theme === "dark" 
                  ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800/50" 
                  : "bg-gradient-to-br from-green-50/80 to-emerald-50/80 border border-green-200/50"
              }`}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <svg
                  className={`w-16 h-16 mx-auto ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>
              <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Check your email!
              </h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                We've sent a magic link to <strong className="font-semibold">{email}</strong>. 
                Click the link in the email to sign in.
              </p>
              <motion.button
                type="button"
                onClick={() => {
                  setMagicLinkSent(false);
                  setLoginMethod("password");
                }}
                className={`text-sm font-medium underline underline-offset-4 transition-colors ${
                  theme === "dark" 
                    ? "text-gray-400 hover:text-white" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to login
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl text-sm backdrop-blur-sm ${
                    theme === "dark" 
                      ? "bg-red-900/20 text-red-300 border border-red-800/50" 
                      : "bg-red-50/80 text-red-700 border border-red-200/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </motion.div>
              )}

              {/* Login Method Toggle */}
              <div className={`flex gap-1 p-1 rounded-xl backdrop-blur-sm ${
                theme === "dark" 
                  ? "bg-gray-800/50 border border-gray-700/50" 
                  : "bg-gray-100/80 border border-gray-200/50"
              }`}>
                {["password", "magiclink"].map((method) => (
                  <motion.button
                    key={method}
                    type="button"
                    onClick={() => setLoginMethod(method as "password" | "magiclink")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                      loginMethod === method
                        ? theme === "dark"
                          ? "bg-white text-black shadow-lg"
                          : "bg-white text-gray-900 shadow-lg"
                        : theme === "dark"
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                    }`}
                    whileHover={{ scale: loginMethod !== method ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {method === "password" ? "Password" : "Magic Link"}
                  </motion.button>
                ))}
              </div>

              {/* Email Input */}
              <motion.div
                animate={focusedField === "email" ? "focused" : "unfocused"}
                variants={inputVariants}
                className="space-y-2"
              >
                <label className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  Email address
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 rounded-xl blur-sm transition-all duration-300 ${
                    focusedField === "email" 
                      ? theme === "dark" 
                        ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20" 
                        : "bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                      : ""
                  }`} />
                  <div className="relative flex items-center">
                    <div className="absolute left-4 pointer-events-none">
                      <svg className={`w-5 h-5 transition-colors ${
                        focusedField === "email" 
                          ? theme === "dark" ? "text-purple-400" : "text-purple-600"
                          : theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gray-800/50 text-white placeholder-gray-500 border border-gray-700/50 focus:border-purple-500/50 focus:bg-gray-800/70"
                          : "bg-white/80 text-gray-900 placeholder-gray-400 border border-gray-200/50 focus:border-purple-400/50 focus:bg-white/90"
                      } focus:outline-none focus:ring-4 ${
                        theme === "dark" ? "focus:ring-purple-500/10" : "focus:ring-purple-400/10"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Password Input */}
              {loginMethod === "password" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <motion.div
                    animate={focusedField === "password" ? "focused" : "unfocused"}
                    variants={inputVariants}
                  >
                    <label className={`block text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}>
                      Password
                    </label>
                    <div className="relative group">
                      <div className={`absolute inset-0 rounded-xl blur-sm transition-all duration-300 ${
                        focusedField === "password" 
                          ? theme === "dark" 
                            ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20" 
                            : "bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                          : ""
                      }`} />
                      <div className="relative flex items-center">
                        <div className="absolute left-4 pointer-events-none">
                          <svg className={`w-5 h-5 transition-colors ${
                            focusedField === "password" 
                              ? theme === "dark" ? "text-purple-400" : "text-purple-600"
                              : theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="••••••••"
                          className={`w-full pl-12 pr-12 py-3.5 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                            theme === "dark"
                              ? "bg-gray-800/50 text-white placeholder-gray-500 border border-gray-700/50 focus:border-purple-500/50 focus:bg-gray-800/70"
                              : "bg-white/80 text-gray-900 placeholder-gray-400 border border-gray-200/50 focus:border-purple-400/50 focus:bg-white/90"
                          } focus:outline-none focus:ring-4 ${
                            theme === "dark" ? "focus:ring-purple-500/10" : "focus:ring-purple-400/10"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-4 transition-colors ${
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
                    </div>
                  </motion.div>
                  
                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <a href="#" className={`text-sm font-medium transition-colors ${
                      theme === "dark" 
                        ? "text-purple-400 hover:text-purple-300" 
                        : "text-purple-600 hover:text-purple-700"
                    }`}>
                      Forgot password?
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${
                    theme === "dark" ? "border-gray-700/50" : "border-gray-200/50"
                  }`} />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`px-4 text-xs font-medium ${
                    theme === "dark" ? "bg-[#121212] text-gray-500" : "bg-gray-100 text-gray-400"
                  }`}>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <div className="relative group">
                <div className={`absolute inset-0 rounded-xl blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                  theme === "dark" 
                    ? "bg-gradient-to-r from-blue-600/20 via-red-600/20 to-yellow-600/20" 
                    : "bg-gradient-to-r from-blue-400/20 via-red-400/20 to-yellow-400/20"
                }`} />
                <div className="relative w-full [&>div]:w-full [&>div>div]:w-full [&>div>div>div]:w-full [&>div>div>div>iframe]:w-full [&>div>div>div>iframe]:rounded-xl">
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
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`relative w-full py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 ${
                  isLoading ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                <div className={`absolute inset-0 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"
                    : "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
                } bg-size-200 animate-gradient`} />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : loginMethod === "password" ? (
                    "Sign In"
                  ) : (
                    "Send Magic Link"
                  )}
                </span>
              </motion.button>

              {/* Register Links */}
              {onRegisterClick && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`pt-6 border-t transition-colors duration-200 ${
                    theme === "dark" ? "border-gray-800/50" : "border-gray-200/50"
                  }`}
                >
                  <p className={`text-sm text-center mb-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Don't have an account?
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { type: "team_manager_register", label: "Register as Team Commander", icon: "👥" },
                      { type: "squad_manager_register", label: "Register as Squad Commander", icon: "🎖️" },
                      { type: "soldier_register", label: "Register as Soldier", icon: "🪖" }
                    ].map(({ type, label, icon }) => (
                      <motion.button
                        key={type}
                        type="button"
                        onClick={() => onRegisterClick(type)}
                        className={`group flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                          theme === "dark" 
                            ? "text-gray-300 hover:text-white hover:bg-gray-800/50 border border-gray-800/50 hover:border-gray-700/50" 
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 border border-gray-200/50 hover:border-gray-300/50"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-300">{icon}</span>
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}