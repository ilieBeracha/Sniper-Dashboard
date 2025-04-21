export default function BaseStat({
  stat,
}: {
  stat: { name: string; value: string; unit: string };
}) {
  return (
    <div key={stat.name} className=" px-4 sm:px-6 lg:px-8">
      <p className=" font-medium text-gray-400">{stat.name}</p>
      <p className="mt-2 flex items-baseline gap-x-2">
        <span className="text-4xl font-semibold tracking-tight text-white">
          {stat.value}
        </span>
        {stat.unit ? (
          <span className="text-sm text-gray-400">{stat.unit}</span>
        ) : null}
      </p>
    </div>
  );
}
