export default function BaseStat({
  stat,
}: {
  stat: {
    name: string;
    value: string;
    unit: string;
    trend: string;
  };
}) {
  const cardClass = "bg-[#1E1E1E] border border-white/5 hover:border-white/10";
  return (
    <div
      key={stat.name}
      className={`rounded-xl ${cardClass} transition-all duration-300 p-6 shadow-lg hover:shadow-2xl flex items-start justify-between min-h-[160px]`}
    >
      <div className="flex flex-col justify-between h-full w-full">
        <div className="flex justify-between items-start w-full mb-4">
          <h3 className="text-lg font-medium text-white">{stat.name}</h3>
        </div>
        <div className="mt-auto">
          <div className="text-3xl font-bold text-white">
            {stat.value}
            <span className="ml-1 text-sm text-gray-400 font-normal">
              {stat.unit}
            </span>
          </div>
          {stat.trend && (
            <div
              className={`mt-2 text-sm px-3 py-1 rounded-full inline-block ${
                stat.trend === "up"
                  ? "bg-[#2CB67D]/20 text-[#2CB67D]"
                  : stat.trend === "down"
                  ? "bg-[#F25F4C]/20 text-[#F25F4C]"
                  : "bg-gray-600/30 text-gray-400"
              }`}
            >
              {stat.trend === "up"
                ? "↑ Improving"
                : stat.trend === "down"
                ? "↓ Declining"
                : "→ Stable"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
