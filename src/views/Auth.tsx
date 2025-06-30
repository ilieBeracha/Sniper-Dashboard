import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import TeamManagerRegisterForm from "@/components/Auth/TeamManagerRegisterForm";
import TeamMemberRegisterForm from "@/components/Auth/SquadCommanderRegisterForm";
import SoldierRegisterForm from "@/components/Auth/SoldierRegisterForm";
import { authStore } from "@/store/authStore";
import { ModernLogin } from "@/components/Auth/LoginForm";
import AuthHero from "@/components/Auth/AuthHero";
import { LoginUserData, RegisterUserData } from "@/types/auth";
import BaseButton from "@/components/BaseButton";

type AuthType = "login" | "team_manager_register" | "squad_manager_register" | "soldier_register";

export default function Auth() {
  const navigate = useNavigate();
  const { login, registerCommander, registerSquadCommander, registerSoldier, error, resetError } = useStore(authStore);

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
        await registerSquadCommander(user);
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
    <div className="flex h-screen bg-[#121212] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <AuthHero />

      <div className="w-full md:w-3/5 flex items-center justify-center p-6 sm:p-8 md:p-8 relative z-10 shadow-black shadow-2xl">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-2">{getAuthTitle()}</h2>
            <p className="text-gray-500 text-sm">{getAuthDescription()}</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-4">
            <div className="bg-[#1A1A1A] rounded-xl flex w-full border border-[#2A2A2A]">
              {[
                { type: "login", label: "Sign In" },
                { type: "team_manager_register", label: "Commander" },
                { type: "squad_manager_register", label: "Squad" },
                { type: "soldier_register", label: "Soldier" },
              ].map(({ type, label }) => (
                <BaseButton
                  type="button"
                  key={type}
                  onClick={() => setAuthType(type as AuthType)}
                  className={`flex-1 px-4 py-1.5  text-xs font-medium rounded-xl transition-all duration-200 ${
                    authType === type ? "bg-white text-[#0A0A0A]" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {label}
                </BaseButton>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="relative">
            <div className="relative py-4 px-4  rounded-xl border border-[#2A2A2A]">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 rounded-3xl backdrop-blur-sm">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-12 h-12 border-2 border-gray-700 rounded-full" />
                      <div className="absolute inset-0 w-12 h-12 border-t-2 border-white rounded-full animate-spin" />
                    </div>
                    <p className="text-white mt-4 text-sm">Authenticating...</p>
                  </div>
                </div>
              )}

              <div className="relative z-10">
                {authType === "login" && <ModernLogin AuthSubmit={AuthSubmit} />}
                {authType === "team_manager_register" && <TeamManagerRegisterForm AuthSubmit={AuthSubmit} />}
                {authType === "squad_manager_register" && <TeamMemberRegisterForm AuthSubmit={AuthSubmit} />}
                {authType === "soldier_register" && <SoldierRegisterForm AuthSubmit={AuthSubmit} />}
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
