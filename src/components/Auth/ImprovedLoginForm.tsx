import React, { useState } from "react";
import BaseInput from "@/components/base/BaseInput";
import { useTheme } from "@/contexts/ThemeContext";
import { validateAuthForm } from "@/lib/formValidation";
import { GoogleLogin } from "@react-oauth/google";
import { toastService } from "@/services/toastService";
import { motion, AnimatePresence } from "framer-motion";

export function ImprovedLoginForm({
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

  const registerOptions = [
    {
      type: "team_manager_register",
      title: "Team Commander",
      description: "Lead and manage your entire team",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: theme === "dark" ? "hover:bg-[#1E1E20] hover:border-gray-600" : "hover:bg-gray-50 hover:border-gray-300"
    },
    {
      type: "squad_manager_register",
      title: "Squad Commander",
      description: "Join with invite code and lead a squad",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: theme === "dark" ? "hover:bg-[#1E1E20] hover:border-gray-600" : "hover:bg-gray-50 hover:border-gray-300"
    },
    {
      type: "soldier_register",
      title: "Soldier",
      description: "Join an existing squad as a team member",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: theme === "dark" ? "hover:bg-[#1E1E20] hover:border-gray-600" : "hover:bg-gray-50 hover:border-gray-300"
    }
  ];

  return (
    <motion.form 
      className="space-y-6" 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {magicLinkSent ? (
          <motion.div
            key="magic-link-sent"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`p-6 rounded-lg text-center space-y-4 ${
              theme === "dark" 
                ? "bg-green-900/20 border border-green-800" 
                : "bg-green-50 border border-green-200"
            }`}
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
            <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Check your email!
            </h3>
            <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              We've sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
            </p>
            <button
              type="button"
              onClick={() => {
                setMagicLinkSent(false);
                setLoginMethod("password");
              }}
              className={`text-sm underline ${
                theme === "dark" 
                  ? "text-gray-400 hover:text-white" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Back to login
            </button>
          </motion.div>
        ) : (
          <>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg text-sm ${
                  theme === "dark" 
                    ? "bg-red-900/50 text-red-300 border border-red-800" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {error}
              </motion.div>
            )}

            {/* Login Method Toggle */}
            <div className={`flex gap-2 p-1 rounded-lg ${
              theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
            }`}>
              <button
                type="button"
                onClick={() => setLoginMethod("password")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  loginMethod === "password"
                    ? theme === "dark"
                      ? "bg-white text-black shadow-sm"
                      : "bg-white text-gray-900 shadow-sm"
                    : theme === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("magiclink")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  loginMethod === "magiclink"
                    ? theme === "dark"
                      ? "bg-white text-black shadow-sm"
                      : "bg-white text-gray-900 shadow-sm"
                    : theme === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Magic Link
              </button>
            </div>

            <BaseInput
              label="Email address"
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="text-sm"
              leftIcon={emailIcon}
            />

            {loginMethod === "password" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BaseInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="text-md"
                  leftIcon={passwordIcon}
                  rightIcon={togglePasswordIcon}
                />
                <div className="mt-2 text-right">
                  <a
                    href="#"
                    className={`text-sm ${
                      theme === "dark" 
                        ? "text-gray-400 hover:text-white" 
                        : "text-gray-600 hover:text-gray-900"
                    } transition-colors`}
                  >
                    Forgot password?
                  </a>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center px-4 py-4 rounded-2xl font-semibold focus:outline-none focus:ring-2 transition-all duration-200 ${
                theme === "dark"
                  ? "bg-white text-[#0A0A0A] hover:bg-gray-100 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : loginMethod === "password" ? (
                "Sign In"
              ) : (
                "Send Magic Link"
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${
                  theme === "dark" ? "border-[#2A2A2A]" : "border-gray-300"
                }`} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 ${
                  theme === "dark" ? "bg-black/20 text-gray-500" : "bg-white/80 text-gray-500"
                }`}>
                  or
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <div className="w-full [&>div]:w-full [&>div>div]:w-full [&>div>div>div]:w-full [&>div>div>div>iframe]:w-full bg-transparent">
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
          </>
        )}
      </AnimatePresence>

      {/* Register Links - Improved UI/UX */}
      {!magicLinkSent && onRegisterClick && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`mt-6 pt-6 border-t transition-colors duration-200 ${
            theme === "dark" ? "border-[#2A2A2A]" : "border-gray-300"
          }`}
        >
          <p className={`text-sm text-center mb-4 transition-colors duration-200 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Don't have an account? Choose your role:
          </p>
          <div className="space-y-3">
            {registerOptions.map((option, index) => (
              <motion.button
                key={option.type}
                type="button"
                onClick={() => onRegisterClick(option.type)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`w-full group relative overflow-hidden px-4 py-3 text-left rounded-xl transition-all duration-200 border ${
                  theme === "dark" 
                    ? "text-gray-300 bg-[#0A0A0A] border-[#2A2A2A] " + option.color
                    : "text-gray-700 bg-white border-gray-200 " + option.color
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 transition-transform duration-200 group-hover:scale-110 ${
                    theme === "dark" ? "text-gray-500 group-hover:text-gray-300" : "text-gray-400 group-hover:text-gray-600"
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium transition-colors duration-200 ${
                      theme === "dark" ? "group-hover:text-white" : "group-hover:text-gray-900"
                    }`}>
                      {option.title}
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-500"
                    }`}>
                      {option.description}
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1 ${
                      theme === "dark" ? "text-gray-600 group-hover:text-gray-400" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.form>
  );
}