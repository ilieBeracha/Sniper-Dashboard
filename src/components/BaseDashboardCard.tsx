export default function BaseDashboardCard({
  title,
  children,
  withBg = true,
}: {
  title: string;
  children: React.ReactNode;
  withBg?: boolean;
}) {
  return (
    <div
      className={`h-full rounded-2xl border border-white/5 shadow-lg flex flex-col ${
        withBg ? "bg-[#1E1E1E]" : "bg-transparent"
      }`}
    >
      <div className="p-4 border-b border-white/5">
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      <div className="p-4 flex-1">{children}</div>
    </div>
  );
}
