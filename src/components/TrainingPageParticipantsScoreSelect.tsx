import { TrainingPageParticipantsScoreSelectProps } from "@/types/training";

export function TrainingPageParticipantsScoreSelect({ value, onChange, options, className = "" }: TrainingPageParticipantsScoreSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-2 py-1 bg-white/10 border border-white/20 rounded text-center text-white ${className}`}
    >
      {options.map((option) => (
        <option key={option} value={option} className="bg-gray-800 text-white">
          {option}
        </option>
      ))}
    </select>
  );
}
