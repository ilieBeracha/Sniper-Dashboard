import { RouteObject } from "react-router-dom";
import Dashboard from "@/views/Dashboard";
import Training from "@/views/Training";
import Assets from "@/views/Assets";
import TrainingPage from "@/views/Training";
import ErrorPage from "@/views/404";
import Settings from "@/views/Settings";
import Stats from "@/views/Stats";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/training",
    element: <Training />,
  },
  {
    path: "/trainings",
    element: <Training />,
  },
  {
    path: "/stats",
    element: <Stats />,
  },
  {
    path: "/assets",
    element: <Assets />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/training/:id",
    element: <TrainingPage />,
  },
  {
    path: "/*",
    element: <ErrorPage />,
  },
];
