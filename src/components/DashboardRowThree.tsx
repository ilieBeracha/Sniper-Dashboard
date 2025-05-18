import DashboardTeamTable from "./DashboardTeamTable";
import BaseDashboardCard from "./BaseDashboardCard";

type DashboardRowThreeProps = {
  loading: boolean;
};

export default function DashboardRowThree({ loading }: DashboardRowThreeProps) {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 text-sm">
        <div className="col-span-12">
          <BaseDashboardCard header="Operational Units" tooltipContent="Overview of all operational units and their current status">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block w-12 h-12 border-4 border-[#7F5AF0] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">Loading operational units data...</p>
              </div>
            ) : (
              <DashboardTeamTable />
            )}
          </BaseDashboardCard>
        </div>
      </div>
    </section>
  );
}
