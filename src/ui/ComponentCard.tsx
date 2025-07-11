interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({ title, children, className = "", desc = "" }) => {
  return (
    <div className={`rounded-2xl min-h-full border border-zinc-700 ${className}`}>
      {/* Card Header */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-white">{title}</h3>
        {desc && <p className="mt-1 text-sm text-gray-400">{desc}</p>}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-zinc-700  sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
