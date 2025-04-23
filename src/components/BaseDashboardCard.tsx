export default function BaseDashboardCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-[#1E1E1E] rounded-2xl border border-white/5 shadow-lg flex flex-col">
      <div className="p-4 border-b border-white/5">
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      <div className="p-4 flex-1">{children}</div>
    </div>
  );
}
