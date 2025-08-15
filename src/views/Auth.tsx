import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import TeamManagerRegisterForm from "@/components/Auth/TeamManagerRegisterForm";
import SquadCommanderRegisterForm from "@/components/Auth/SquadCommanderRegisterForm";
import SoldierRegisterForm from "@/components/Auth/SoldierRegisterForm";
import { authStore } from "@/store/authStore";
import { ImprovedLoginForm } from "@/components/Auth/ImprovedLoginForm";
import AuthHero from "@/components/Auth/AuthHero";
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
    <div className={`flex h-[100dvh] overflow-hidden transition-colors duration-200 ${theme === "dark" ? "bg-[#121212]" : "bg-gray-100"}`}>
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-200 ${
          theme === "dark" ? "opacity-5" : "opacity-10"
        }`}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${
              theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)"
            } 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <AuthHero />

      <div
        className={`w-full md:w-3/5 flex items-center justify-center p-6 sm:p-8 md:p-8 relative z-10 transition-all duration-200 ${
          theme === "dark" ? "shadow-black shadow-2xl" : "shadow-gray-300 shadow-lg"
        }`}
      >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {getAuthTitle()}
            </h2>
            <p className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>{getAuthDescription()}</p>
          </div>

          {/* Form Card */}
          <div className="relative">
            <div
              className={`relative py-4 px-4 rounded-xl border transition-colors duration-200 ${
                theme === "dark" ? "border-[#2A2A2A] bg-black/20" : "border-gray-300 bg-white/80 backdrop-blur-sm"
              }`}
            >
              {isLoading && (
                <div
                  className={`absolute inset-0 flex items-center justify-center z-10 rounded-3xl backdrop-blur-sm transition-colors duration-200 ${
                    theme === "dark" ? "bg-black/50" : "bg-white/70"
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
                          theme === "dark" ? "border-white" : "border-gray-700"
                        }`}
                      />
                    </div>
                    <p className={`mt-4 text-sm transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
                      Authenticating...
                    </p>
                  </div>
                </div>
              )}

              <div className="relative z-10">
                {authType === "login" && (
                  <ImprovedLoginForm
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
                <div className="mt-6 p-4 bg-red-900/10 border border-red-900/20 rounded-2xl flex items-center">
                  <div className="w-8 h-8 bg-red-900/20 rounded-full flex items-center justify-center mr-3">
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
