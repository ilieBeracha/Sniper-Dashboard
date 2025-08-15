import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import TeamManagerRegisterForm from "@/components/Auth/TeamManagerRegisterForm";
import SquadCommanderRegisterForm from "@/components/Auth/SquadCommanderRegisterForm";
import SoldierRegisterForm from "@/components/Auth/SoldierRegisterForm";
import { authStore } from "@/store/authStore";
import { ElegantLoginForm } from "@/components/Auth/ElegantLoginForm";
import ElegantAuthHero from "@/components/Auth/ElegantAuthHero";
import { LoginUserData, RegisterUserData } from "@/types/auth";
import { useTheme } from "@/contexts/ThemeContext";

type AuthType = "login" | "team_manager_register" | "squad_manager_register" | "soldier_register";

export default function Auth() {
  const navigate = useNavigate();
  const { login, registerCommander, registerSquadCommander, signInWithEmail, registerSoldier, error, resetError, handleSignInWithGoogle } =
    useStore(authStore);
  const { theme } = useTheme();

  const [authType, setAuthType] = useState<AuthType>("login");
  const [isLoading, setIsLoading] = useState(false);

  const AuthSubmit = async (user: any) => {
    try {
      setIsLoading(true);
      if (authType === "login") {
        await login(user as LoginUserData);
      } else if (authType === "team_manager_register") {
        await registerCommander(user as RegisterUserData);
      } else if (authType === "squad_manager_register") {
        await registerSquadCommander(user as RegisterUserData);
      } else if (authType === "soldier_register") {
        await registerSoldier(user);
      }
      navigate("/");
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resetError();
  }, [authType, resetError]);

  const getAuthTitle = () => {
    switch (authType) {
      case "team_manager_register":
        return "Create Your Team";
      case "squad_manager_register":
        return "Join Your Team";
      case "soldier_register":
        return "Join as Soldier";
      default:
        return "Authentication";
    }
  };

  const getAuthDescription = () => {
    switch (authType) {
      case "login":
        return "Sign in to access your mission dashboard";
      case "team_manager_register":
        return "Lead your squad to success";
      case "squad_manager_register":
        return "Connect with your team using your invite code";
      case "soldier_register":
        return "Join a mission-ready squad";
      default:
        return "Please authenticate to continue";
    }
  };

  return (
    <div className={`flex h-[100dvh] overflow-hidden transition-colors duration-200 ${
      theme === "dark" ? "bg-gray-900" : "bg-gray-50"
    }`}>
      <ElegantAuthHero />

      <div className={`w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative z-10 transition-all duration-200`}>
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className={`text-xl font-semibold mb-2 transition-colors duration-200 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              {getAuthTitle()}
            </h2>
            <p className={`text-sm transition-colors duration-200 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {getAuthDescription()}
            </p>
          </div>

          {/* Form Card */}
          <div className="relative">
            <div className={`relative py-6 px-6 rounded-xl transition-all duration-200 ${
              theme === "dark" 
                ? "bg-gray-800/50 border border-gray-700/30" 
                : "bg-white border border-gray-200 shadow-sm"
            }`}>
              {isLoading && (
                <div className={`absolute inset-0 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm transition-colors duration-200 ${
                  theme === "dark" ? "bg-gray-900/80" : "bg-white/80"
                }`}>
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className={`w-10 h-10 border-2 rounded-full transition-colors duration-200 ${
                        theme === "dark" ? "border-gray-700" : "border-gray-300"
                      }`} />
                      <div className={`absolute inset-0 w-10 h-10 border-t-2 rounded-full animate-spin transition-colors duration-200 ${
                        theme === "dark" ? "border-white" : "border-gray-900"
                      }`} />
                    </div>
                    <p className={`mt-3 text-sm transition-colors duration-200 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}>
                      Authenticating...
                    </p>
                  </div>
                </div>
              )}

              <div className="relative z-10">
                {authType === "login" && (
                  <ElegantLoginForm
                    AuthSubmit={AuthSubmit}
                    onRegisterClick={(type) => setAuthType(type as AuthType)}
                    onSignInWithEmail={(email) => signInWithEmail(email)}
                    handleSignInWithGoogle={handleSignInWithGoogle}
                  />
                )}
                {authType !== "login" && (
                  <div>
                    <button
                      onClick={() => setAuthType("login")}
                      className={`mb-4 text-sm font-medium transition-colors flex items-center gap-2 ${
                        theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Sign In
                    </button>
                    {authType === "squad_manager_register" && <SquadCommanderRegisterForm AuthSubmit={AuthSubmit} />}
                    {authType === "soldier_register" && <SoldierRegisterForm AuthSubmit={AuthSubmit} />}
                    {authType === "team_manager_register" && <TeamManagerRegisterForm AuthSubmit={AuthSubmit} />}
                  </div>
                )}
              </div>

              {error && authType === "login" && (
                <div className="mt-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg flex items-center gap-3">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
