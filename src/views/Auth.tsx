import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import TeamManagerRegisterForm from "@/components/Auth/TeamManagerRegisterForm";
import SquadCommanderRegisterForm from "@/components/Auth/SquadCommanderRegisterForm";
import SoldierRegisterForm from "@/components/Auth/SoldierRegisterForm";
import { authStore } from "@/store/authStore";
import { ModernLoginForm } from "@/components/Auth/ModernLoginForm";
import ModernAuthHero from "@/components/Auth/ModernAuthHero";
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
    <div className={`flex h-[100dvh] overflow-hidden transition-colors duration-200 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Background pattern */}
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-200 ${
          theme === "dark" ? "opacity-10" : "opacity-5"
        }`}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${
              theme === "dark" ? "rgba(147,51,234,0.1)" : "rgba(147,51,234,0.05)"
            } 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <ModernAuthHero />

      <div
        className={`w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative z-10 transition-all duration-200`}
      >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {getAuthTitle()}
            </h2>
            <p className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{getAuthDescription()}</p>
          </div>

          {/* Form Card with glassmorphism effect */}
          <div className="relative">
            <div
              className={`relative py-8 px-8 rounded-2xl backdrop-blur-md transition-all duration-200 ${
                theme === "dark" 
                  ? "bg-gray-800/30 border border-gray-700/50 shadow-xl" 
                  : "bg-white/70 border border-gray-200/50 shadow-xl"
              }`}
            >
              {isLoading && (
                <div
                  className={`absolute inset-0 flex items-center justify-center z-10 rounded-2xl backdrop-blur-sm transition-colors duration-200 ${
                    theme === "dark" ? "bg-gray-900/70" : "bg-white/80"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 border-2 rounded-full transition-colors duration-200 ${
                          theme === "dark" ? "border-gray-700" : "border-gray-300"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 w-12 h-12 border-t-2 rounded-full animate-spin transition-colors duration-200 ${
                          theme === "dark" ? "border-purple-500" : "border-purple-600"
                        }`}
                      />
                    </div>
                    <p className={`mt-4 text-sm font-medium transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
                      Authenticating...
                    </p>
                  </div>
                </div>
              )}

              <div className="relative z-10">
                {authType === "login" && (
                  <ModernLoginForm
                    AuthSubmit={AuthSubmit}
                    onRegisterClick={(type) => setAuthType(type as AuthType)}
                    onSignInWithEmail={(email) => signInWithEmail(email)}
                    handleSignInWithGoogle={handleSignInWithGoogle}
                  />
                )}
                {authType !== "login" && (
                  <div>
                    <p
                      onClick={() => setAuthType("login")}
                      className={`mb-4 text-sm cursor-pointer transition-colors flex items-center ${
                        theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      ← Back to Sign In
                    </p>
                    {authType === "squad_manager_register" && <SquadCommanderRegisterForm AuthSubmit={AuthSubmit} />}
                    {authType === "soldier_register" && <SoldierRegisterForm AuthSubmit={AuthSubmit} />}
                    {authType === "team_manager_register" && <TeamManagerRegisterForm AuthSubmit={AuthSubmit} />}
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-900/10 border border-red-900/20 rounded-xl flex items-center backdrop-blur-sm">
                  <div className="w-8 h-8 bg-red-900/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
