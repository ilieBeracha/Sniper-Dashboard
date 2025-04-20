import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Auth from "./views/Auth";
import { useStore } from "zustand";
import { authStore } from "./store/authStore";
import { useEffect } from "react";

export default function App() {
  const useAuthStore = useStore(authStore);

  useEffect(() => {
    useAuthStore.checkAuth();
  }, []);

  return (
    <div className="w-screen h-screen">
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
