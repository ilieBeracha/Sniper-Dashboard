import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Auth from "./views/Auth";
import { useStore } from "zustand";
import { authStore } from "./store/authStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function App() {
  const { checkAuth, token, isLoadingAuth } = useStore(authStore);

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoadingAuth) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm z-10">
        <div className="bg-zinc-800 rounded-lg p-4 flex items-center space-x-3 border border-zinc-700">
          <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-[#161616]">
      <Routes>{token ? <Route path={"*"} element={<Home />} /> : <Route path={"*"} element={<Auth />} />}</Routes>
    </div>
  );
}
