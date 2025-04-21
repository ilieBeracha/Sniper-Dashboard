import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import Login from "@/components/Auth/LoginForm";
import TeamManagerRegisterForm from "@/components/Auth/TeamManagerRegisterForm";
import TeamMemberRegisterForm from "@/components/Auth/TeamMemberRegisterForm";
import { authStore } from "@/store/authStore";
import { LoginUserData, RegisterUserData } from "../types/auth";
import Loader from "@/components/Loader";

type AuthType = "login" | "register" | "team-member";

export default function Auth() {
  const navigate = useNavigate();
  const { login, registerCommander, registerTeamMember, error, resetError } =
    useStore(authStore);

  const [authType, setAuthType] = useState<AuthType>("login");
  const [isLoading, setIsLoading] = useState(false);

  const AuthSubmit = async (user: any) => {
    try {
      setIsLoading(true);
      if (authType === "login") {
        await login(user as LoginUserData);
      } else if (authType === "register") {
        await registerCommander(user as RegisterUserData);
      } else if (authType === "team-member") {
        await registerTeamMember(user);
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#0e0e0e] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex justify-center space-x-2 border-b border-gray-700">
            {[
              { type: "login", label: "Sign In" },
              { type: "register", label: "Team Leader" },
              { type: "team-member", label: "Join Team" },
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setAuthType(type as AuthType)}
                className={`pb-2 px-4 text-sm font-medium transition-all duration-200 ${
                  authType === type
                    ? "border-b-2 border-indigo-500 text-indigo-400"
                    : "text-gray-500 hover:text-indigo-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="text-center mt-6">
            <h2 className="text-2xl font-bold text-gray-300">
              {authType === "login"
                ? "Sign in to your account"
                : authType === "register"
                ? "Create a team leader account"
                : "Join an existing team"}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {authType === "login"
                ? "Enter your credentials to access your dashboard"
                : authType === "register"
                ? "Register as a team leader to get started"
                : "Join your team using the invite code from your leader"}
            </p>
          </div>
        </div>

        <div className="relative bg-[#1a1a1a] py-8 px-6 shadow-xl rounded-xl border border-gray-800 sm:px-10">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 rounded-xl">
              <Loader />
            </div>
          )}

          {authType === "login" && <Login AuthSubmit={AuthSubmit} />}
          {authType === "register" && (
            <TeamManagerRegisterForm AuthSubmit={AuthSubmit} />
          )}
          {authType === "team-member" && (
            <TeamMemberRegisterForm AuthSubmit={AuthSubmit} />
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800/50 rounded-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
