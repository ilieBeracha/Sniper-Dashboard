import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function RulesLayout() {
  const location = useLocation();
  const isRulesPage = location.pathname.includes("/rules");
  return (
    <div className={`flex w-full h-screen ${isRulesPage ? "flex-row" : "flex-col"}`}>
      <Sidebar collapsed={true} expandable={false} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
