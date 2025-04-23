import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import TeamManagerRegisterForm from "@/components/Auth/TeamManagerRegisterForm";
import TeamMemberRegisterForm from "@/components/Auth/SquadCommanderRegisterForm";
import SoldierRegisterForm from "@/components/Auth/SoldierRegisterForm";
import { authStore } from "@/store/authStore";
import { LoginUserData, RegisterUserData } from "../types/auth";
import Login from "@/components/Auth/LoginForm";

type AuthType =
  | "login"
  | "team_manager_register"
  | "squad_manager_register"
  | "soldier_register";

export default function Auth() {
  const navigate = useNavigate();
  const {
    login,
    registerCommander,
    registerSquadCommander,
    registerSoldier,
    error,
    resetError,
  } = useStore(authStore);

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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#121212] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8">
          {/* TABS */}
          <div className="flex justify-center space-x-2 border-b border-white/10">
            {[
              { type: "login", label: "Sign In" },
              { type: "team_manager_register", label: "Team Leader" },
              { type: "squad_manager_register", label: "Join Team" },
              { type: "soldier_register", label: "Soldier" },
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setAuthType(type as AuthType)}
                className={`pb-2 px-4 text-sm font-medium transition-all duration-200 ${
                  authType === type
                    ? "border-b-2 border-[#7F5AF0] text-[#7F5AF0]"
                    : "text-gray-500 hover:text-[#7F5AF0]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* HEADER */}
          <div className="text-center mt-6">
            <h2 className="text-2xl font-bold text-white">
              {authType === "login"
                ? "Sign in to your account"
                : authType === "team_manager_register"
                ? "Create a team leader account"
                : authType === "squad_manager_register"
                ? "Join an existing team"
                : "Register as a soldier"}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {authType === "login"
                ? "Enter your credentials to access your dashboard"
                : authType === "team_manager_register"
                ? "Register as a team leader to get started"
                : authType === "squad_manager_register"
                ? "Join your team using the invite code"
                : "Join a mission-ready squad as a soldier"}
            </p>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="relative bg-[#1E1E1E] py-8 px-6 shadow-xl rounded-xl border border-white/10 sm:px-10">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 rounded-xl">
              <p className="text-white text-sm">Loading...</p>
            </div>
          )}

          {authType === "login" && <Login AuthSubmit={AuthSubmit} />}
          {authType === "team_manager_register" && (
            <TeamManagerRegisterForm AuthSubmit={AuthSubmit} />
          )}
          {authType === "squad_manager_register" && (
            <TeamMemberRegisterForm AuthSubmit={AuthSubmit} />
          )}
          {authType === "soldier_register" && (
            <SoldierRegisterForm AuthSubmit={AuthSubmit} />
          )}

          {error && (
            <div className="mt-4 p-3 bg-[#F25F4C]/10 border border-[#F25F4C]/30 rounded-md">
              <p className="text-sm text-[#F25F4C]">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
