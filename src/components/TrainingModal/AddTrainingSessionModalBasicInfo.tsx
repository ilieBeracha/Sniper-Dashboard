import BaseInput from "@/components/BaseInput";
import { useTheme } from "@/contexts/ThemeContext";

type BasicInfoSectionProps = {
  sessionName: string;
  setSessionName: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
};

export default function BasicInfoSection({ sessionName, setSessionName, location, setLocation, date, setDate }: BasicInfoSectionProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-lg border p-6 transition-colors duration-200 ${
        theme === "dark" ? "bg-[#1A1A1A] border-white/5" : "bg-white border-gray-200"
      }`}
    >
      <h4 className={`text-sm font-medium mb-4 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
        Basic Information
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          label="Session Name"
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="Sniper Weekly Training"
          containerClassName="bg-transparent"
        />

        <BaseInput
          label="Location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Base A - Range 3"
          containerClassName="bg-transparent"
        />
      </div>

      <div className="mt-6">
        <BaseInput
          label="Date & Time"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          containerClassName="bg-transparent md:w-1/2"
        />
      </div>
    </div>
  );
}
