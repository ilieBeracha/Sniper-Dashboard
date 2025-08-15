import React, { useState } from "react";
import BaseInput from "@/components/base/BaseInput";
import { useTheme } from "@/contexts/ThemeContext";
import { validateAuthForm } from "@/lib/formValidation";
import { GoogleLogin } from "@react-oauth/google";
import { toastService } from "@/services/toastService";

export function ModernLogin({
  AuthSubmit,
  onRegisterClick,
  onSignInWithEmail,
  handleSignInWithGoogle,
  showRegistrationOptions = false,
}: {
  AuthSubmit: any;
  onRegisterClick?: (type: string) => any;
  onSignInWithEmail?: (email: string) => void;
  handleSignInWithGoogle?: (response: any) => void;
  showRegistrationOptions?: boolean;
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
    e.stopPropagation();
    
    // Explicitly tell the browser this is a login action
    if ('PasswordCredential' in window) {
      const cred = new (window as any).PasswordCredential({
        id: email,
        password: password,
        name: email,
      });
      
      if (navigator.credentials && navigator.credentials.store) {
        navigator.credentials.store(cred).catch(() => {
          // Silently fail if credentials can't be stored
        });
      }
    }
    
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
        // Magic link login
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

  return (
    <form 
      className="space-y-6" 
      onSubmit={handleSubmit} 
      name="loginForm" 
      autoComplete="on"
      data-form-type="login"
      action="/login"
      method="post"
      role="form"
      aria-label="Login form"
    >
      {/* Hidden field to help browsers understand this is a login form */}
      <input type="hidden" name="form-type" value="login" />
      <input type="hidden" name="action" value="login" />
      
      {magicLinkSent ? (
        <div
          className={`p-6 rounded-lg text-center space-y-4 ${
            theme === "dark" ? "bg-green-900/20  border border-green-800" : "bg-green-50 border border-green-200"
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
          <h3 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Check your email!</h3>
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            We've sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
          </p>
          <button
            type="button"
            onClick={() => {
              setMagicLinkSent(false);
              setLoginMethod("password");
            }}
            className={`text-sm underline ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            Back to login
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div
              className={`p-3 rounded-lg text-sm ${
                theme === "dark" ? "bg-red-900/50 text-red-300 border border-red-800" : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {error}
            </div>
          )}

          <div className="flex gap-2 p-1 rounded-lg bg-gray-100 dark:bg-zinc-800">
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
            name="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="text-sm"
            leftIcon={emailIcon}
            autoComplete="username webauthn"
          />

          {loginMethod === "password" && (
            <BaseInput
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="text-md"
              leftIcon={passwordIcon}
              rightIcon={togglePasswordIcon}
              autoComplete="current-password"
            />
          )}

          {/* Google Sign In Button */}
          <div className="w-full [&>div]:w-full [&>div>div]:w-full [&>div>div>div]:w-full [&>div>div>div>iframe]:w-full bg-transparent">
            <GoogleLogin
              size="large"
              width="100%"
              type="standard"
              onSuccess={handleGoogleLogin}
              shape="circle"
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
      {!magicLinkSent && (
        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            name="submit"
            value="login"
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

          {onRegisterClick && showRegistrationOptions && (
            <div className={`mt-8 pt-6 border-t-2 transition-colors duration-200 ${theme === "dark" ? "border-[#2A2A2A]" : "border-gray-200"}`}>
              <p className={`text-sm text-center mb-4 font-medium transition-colors duration-200 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                New to the platform? Create an account:
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
      )}
    </form>
  );
}
