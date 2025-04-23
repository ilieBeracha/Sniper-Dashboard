import DashboardTeamTable from "./DashboardTeamTable";
import BaseDashboardCard from "./BaseDashboardCard";

type DashboardRowThreeProps = {
  loading: boolean;
};

export default function DashboardRowThree({ loading }: DashboardRowThreeProps) {
  return (
    <section>
      <BaseDashboardCard title="Operational Units">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-[#7F5AF0] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">
              Loading operational units data...
            </p>
          </div>
        ) : (
          <DashboardTeamTable />
        )}
      </BaseDashboardCard>
    </section>
  );
}
