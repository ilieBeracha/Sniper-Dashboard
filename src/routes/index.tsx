import { RouteObject } from "react-router-dom";
import Dashboard from "@/views/Dashboard";
import Training from "@/views/Training";
import Assets from "@/views/Assets";
import TrainingPage from "@/views/Training";
import ErrorPage from "@/views/404";

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
    path: "/assets",
    element: <Assets />,
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
