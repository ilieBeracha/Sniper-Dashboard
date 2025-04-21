import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Auth from "./views/Auth";
import { useStore } from "zustand";
import { authStore } from "./store/authStore";

export default function App() {
  const useAuthStore = useStore(authStore);

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
