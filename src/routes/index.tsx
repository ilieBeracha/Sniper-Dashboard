import { RouteObject } from "react-router-dom";
import Dashboard from "@/views/Dashboard";
import Training from "@/views/Training";
import Assets from "@/views/Assets";
import TrainingPage from "@/views/Training";
import ErrorPage from "@/views/404";
import Settings from "@/views/Settings";
import Analytics from "@/views/Analytics";

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
    element: <Analytics />,
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
