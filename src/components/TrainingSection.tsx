import { TrainingSession } from "@/types/training";
import { TrainingSessionCard } from "./TrainingSessionCard";
import { useTheme } from "@/contexts/ThemeContext";

interface TrainingSectionProps {
  title: string;
  trainings: TrainingSession[];
  color: "green" | "blue" | "gray";
  showCount?: boolean;
  highlight?: boolean;
  showDate?: boolean;
  isPast?: boolean;
}

export default function TrainingSection({
  title,
  trainings,
  color,
  showCount = false,
  highlight = false,
  showDate = true,
  isPast = false,
}: TrainingSectionProps) {
  const { theme } = useTheme();

  if (trainings.length === 0) return null;

  const colorMap = {
    green: "bg-green-400",
    blue: "bg-blue-600", 
    gray: "bg-gray-600",
  };

  return (
    <div className="space-y-3 mt-6 first:mt-0">
      <h3 className={`text-sm flex items-center gap-2 font-medium px-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        <div className={`h-3 w-3 ${colorMap[color]} rounded-full`}></div>
        {title}
        {showCount && <span className="text-xs">{trainings.length}</span>}
      </h3>
      
      {trainings.map((session) => (
        <TrainingSessionCard
          key={session.id}
          session={session}
          highlight={highlight}
          showDate={showDate}
          isPast={isPast}
        />
      ))}
    </div>
  );
}