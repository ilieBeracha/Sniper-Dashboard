
import { useStore } from "zustand";
import { performanceStore } from "@/store/performance";
import DashboardMostAccurate from "./DashboardMostAccurate";

export default function DashboardRowKPI() {
    const { topAccurateSnipers } = useStore(performanceStore)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-6">
            <DashboardMostAccurate topAccurateSnipers={topAccurateSnipers} />
        </div>
    );
}