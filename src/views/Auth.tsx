import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import Login from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { authStore } from "../store/authStore";
import { LoginUserData, RegisterUserData } from "../types/auth";

export default function Auth() {
  const navigate = useNavigate();
  const { login, registerCommander } = useStore(authStore);

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

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center px-4">
      {isLoading ? (
        <div className="text-white text-lg font-medium">Loading...</div>
      ) : (
        <>
          {isLogin ? (
            <Login AuthSubmit={AuthSubmit} />
          ) : (
            <RegisterForm AuthSubmit={AuthSubmit} />
          )}

          <p
            className="text-white pt-5 text-sm cursor-pointer hover:underline transition-all duration-200"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "New team leader? Register"
              : "Already have an account? Login"}
          </p>
        </>
      )}
    </div>
  );
}
