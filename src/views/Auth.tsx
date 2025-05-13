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
import { Card, Button } from "../components/common";

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

      <div className="w-full md:w-3/5 flex items-center justify-center md:px-6 md:pb-12 sm:px-4 sm:pb-12 relative z-10 shadow-black shadow-2xl">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-8 h-8 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-6 border border-[#2A2A2A]">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-semibold text-white mb-2">{getAuthTitle()}</h2>
            <p className="text-gray-500 text-base">{getAuthDescription()}</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-4">
            <div className=" flex w-full border-b  border-b-[#2A2A2A] rounded-t-xl">
              {[
                { type: "login", label: "Sign In" },
                { type: "team_manager_register", label: "Commander" },
                { type: "squad_manager_register", label: "Squad" },
                { type: "soldier_register", label: "Soldier" },
              ].map(({ type, label }) => (
                <span
                  key={type}
                  onClick={() => setAuthType(type as AuthType)}
                  className={`flex-1 cursor-pointer text-center  py-2 text-xs ${authType === type ? "text-white" : "text-gray-400"}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className="relative">
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
          </Card>

          {/* Additional Help Text */}
          <div className="mt-8 text-center">
            {authType === "login" ? (
              <p className="text-gray-600 text-sm">
                Need assistance?{" "}
                <a href="#" className="text-gray-400 hover:text-white">
                  Contact support
                </a>
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <button onClick={() => setAuthType("login")} className="text-gray-400 hover:text-white ">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
