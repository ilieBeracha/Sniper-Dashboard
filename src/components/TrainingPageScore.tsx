import BaseDashboardCard from "./BaseDashboardCard";

export default function TrainingPageScore() {
    return (
        <BaseDashboardCard title="Score" tooltipContent="Detailed information about the current training session">
            <div className="">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold">Score</h3>
                        <p className="text-sm text-gray-400">Score</p>
                    </div>
                </div>
            </div>
        </BaseDashboardCard>
    );
}