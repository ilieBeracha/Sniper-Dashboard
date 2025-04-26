import { UserCheck } from "lucide-react";

export default function TrainingParticipantBadge() {
  return (
    <div className="w-fit flex items-center gap-1 px-2 bg-green-500/20 rounded-full">
      <UserCheck className="w-1 h-1 text-green-400" />
      <span className="text-xs text-green-400">IN</span>
    </div>
  );
}
