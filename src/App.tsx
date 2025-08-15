import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Auth from "./views/Auth";
import { useStore } from "zustand";
import { authStore } from "./store/authStore";
import { useEffect } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { WaveLoader } from "./components/ui/loader";

function AppContent() {
  const { checkAuth, token, isLoadingAuth } = useStore(authStore);
  const { theme } = useTheme();
  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoadingAuth) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center z-10 bg-transparent`}>
        <WaveLoader />
      </div>
    );
  }

  return (
    <div className={`w-full min-h-[100dvh] overflow-x-hidden transition-colors duration-200 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <Routes>{token ? <Route path={"*"} element={<Home />} /> : <Route path={"*"} element={<Auth />} />}</Routes>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
