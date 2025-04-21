import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import Login from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { authStore } from "../store/authStore";
import { LoginUserData, RegisterUserData } from "../types/auth";
import BaseLoader from "@/components/BaseLoader";

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
    <div className="w-screen h-screen flex flex-col justify-center items-center px-4 pt-5">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        {isLoading ?? <BaseLoader />}
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {isLogin ? (
            <Login AuthSubmit={AuthSubmit} />
          ) : (
            <RegisterForm AuthSubmit={AuthSubmit} />
          )}
          <p className="text-sm pt-2 text-red-500">{error}</p>

          <p
            className="text-black pt-5 text-sm cursor-pointer hover:underline transition-all duration-200"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "New team leader? Register"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
}
