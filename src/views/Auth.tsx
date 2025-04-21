import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import Login from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { authStore } from "../store/authStore";
import { LoginUserData, RegisterUserData } from "../types/auth";
import Loader from "@/components/Loader";

export default function Auth() {
  const navigate = useNavigate();
  const { login, registerCommander, error, resetError } = useStore(authStore);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const AuthSubmit = async (user: RegisterUserData | LoginUserData) => {
    try {
      setIsLoading(true);
      if (isLogin) {
        await login(user as LoginUserData);
      } else {
        await registerCommander(user as RegisterUserData);
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
  }, [isLogin]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin
              ? "Enter your credentials to access your dashboard"
              : "Register as a team leader to get started"}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 border border-gray-200">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <Loader />
            </div>
          )}

          <div className="relative">
            {isLogin ? (
              <Login AuthSubmit={AuthSubmit} />
            ) : (
              <RegisterForm AuthSubmit={AuthSubmit} />
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm font-medium text-gray-900 hover:text-gray-900"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "New team leader? Create an account"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center"></div>
      </div>
    </div>
  );
}
