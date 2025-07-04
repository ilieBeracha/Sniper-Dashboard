import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Auth from "./views/Auth";
import { useStore } from "zustand";
import { authStore } from "./store/authStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

function AppContent() {
  const { checkAuth, token, isLoadingAuth } = useStore(authStore);
  const { theme } = useTheme();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoadingAuth) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10 ${
        theme === 'dark' ? 'bg-zinc-900/50' : 'bg-gray-200/50'
      }`}>
        <div className={`rounded-lg p-4 flex items-center space-x-3 border ${
          theme === 'dark' 
            ? 'bg-zinc-800 border-zinc-700' 
            : 'bg-white border-gray-300'
        }`}>
          <Loader2 className={`h-6 w-6 animate-spin ${
            theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
          }`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-screen min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900/5 to-white/[0.02]' 
        : 'bg-gradient-to-br from-gray-100 to-white'
    }`}>
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
