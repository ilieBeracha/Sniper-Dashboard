import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Auth from "./views/Auth";
import { useStore } from "zustand";
import { authStore } from "./store/authStore";
import { useEffect } from "react";
import { supabase } from "./services/supabaseClient";
import { userStore } from "./store/userStore";

export default function App() {
  const useAuthStore = useStore(authStore);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          userStore.getState().clearUser();
          authStore.getState().logout();
          location.href = "/";
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="w-screen min-h-screen  bg-[#161616]">
      <Routes>
        {useAuthStore.token ? (
          <Route path={"*"} element={<Home />} />
        ) : (
          <Route path={"*"} element={<Auth />} />
        )}
      </Routes>
    </div>
  );
}
