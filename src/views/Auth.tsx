import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import TeamManagerRegisterForm from "@/components/Auth/TeamManagerRegisterForm";
import TeamMemberRegisterForm from "@/components/Auth/SquadCommanderRegisterForm";
import SoldierRegisterForm from "@/components/Auth/SoldierRegisterForm";
import { authStore } from "@/store/authStore";
import { LoginUserData, RegisterUserData } from "../types/auth";
import Login from "@/components/Auth/LoginForm";
import AuthHero from "@/components/Auth/AuthHero";

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
      case "login":
        return "Welcome Back";
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
    <div className="flex h-screen bg-[#121212]">
      <AuthHero />
      <div className="w-full md:w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">{getAuthTitle()}</h2>
            <p className="mt-2 text-gray-400">{getAuthDescription()}</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 space-x-2 border-b border-white/10">
            {[
              { type: "login", label: "Sign In" },
              { type: "team_manager_register", label: "Team Commander" },
              { type: "squad_manager_register", label: "Squad Commander" },
              { type: "soldier_register", label: "Soldier" },
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setAuthType(type as AuthType)}
                className={`pb-2 px-4 text-sm font-medium transition-all duration-200 ${
                  authType === type ? "border-b-2 border-[#7F5AF0] text-[#7F5AF0]" : "text-gray-500 hover:text-[#7F5AF0]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div className="relative bg-[#1E1E1E] py-8 px-8 shadow-2xl rounded-xl border border-white/10">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 rounded-xl backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-8 w-8 text-[#7F5AF0] mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-white">Authenticating...</p>
                </div>
              </div>
            )}

            {authType === "login" && <Login AuthSubmit={AuthSubmit} />}
            {authType === "team_manager_register" && <TeamManagerRegisterForm AuthSubmit={AuthSubmit} />}
            {authType === "squad_manager_register" && <TeamMemberRegisterForm AuthSubmit={AuthSubmit} />}
            {authType === "soldier_register" && <SoldierRegisterForm AuthSubmit={AuthSubmit} />}

            {error && (
              <div className="mt-4 p-3 bg-[#F25F4C]/10 border border-[#F25F4C]/30 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F25F4C] mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-[#F25F4C]">{error}</p>
              </div>
            )}
          </div>

          {/* Additional Help Text */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {authType === "login" ? (
              <p>
                Need assistance?{" "}
                <a href="#" className="text-[#7F5AF0] hover:text-[#7F5AF0]/80">
                  Contact support
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button onClick={() => setAuthType("login")} className="text-[#7F5AF0] hover:text-[#7F5AF0]/80">
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
