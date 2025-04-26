import { TrainingPageParticipantsScoreInputProps } from "../types/training";

export function TrainingPageParticipantsScoreInput({ value, onChange, placeholder, className = "" }: TrainingPageParticipantsScoreInputProps) {
  return (
    <input
      type="number"
      min="0"
      value={value === null ? "" : value}
      onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
      className={`w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-center text-white ${className}`}
      placeholder={placeholder}
    />
  );
}
