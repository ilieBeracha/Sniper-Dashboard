import { Calendar } from "lucide-react";

export default function TrainingListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-[#222]/50 rounded-lg text-center border border-white/5 backdrop-blur-sm">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-indigo-400" />
      </div>
      <p className="text-gray-300 font-medium text-lg">No training sessions found</p>
      <p className="text-sm text-gray-500 mt-2 max-w-xs">Schedule a new training session to start tracking your team's progress</p>
    </div>
  );
}
