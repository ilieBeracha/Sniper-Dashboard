import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Auth from "./views/Auth";
import { useStore } from "zustand";
import { authStore } from "./store/authStore";
import { useEffect } from "react";
import { LoadingSpinner } from "./components/common";

export default function App() {
  const { checkAuth, token, isLoadingAuth } = useStore(authStore);

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoadingAuth) {
    return <LoadingSpinner text="Authenticating..." />;
  }

  return (
    <div className="w-screen min-h-screen bg-[#161616]">
      <Routes>{token ? <Route path={"*"} element={<Home />} /> : <Route path={"*"} element={<Auth />} />}</Routes>
    </div>
  );
}
