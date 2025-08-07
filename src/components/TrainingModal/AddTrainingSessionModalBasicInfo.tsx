import BaseInput from "@/components/base/BaseInput";
import { useTheme } from "@/contexts/ThemeContext";
import { Calendar, MapPin, FileText } from "lucide-react";

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
    <div className={`rounded-lg border p-4 ${theme === "dark" ? "bg-zinc-900/30 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
      <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-zinc-200" : "text-gray-900"}`}>
        <FileText size={16} className="opacity-60" />
        Session Details
      </h4>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium opacity-80 mb-1.5 block">Session Name</label>
            <BaseInput
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g., Weekly Range Training"
              containerClassName="bg-transparent"
            />
          </div>

          <div>
            <label className="text-xs font-medium opacity-80 mb-1.5 flex items-center gap-1">
              <MapPin size={12} />
              Location
            </label>
            <BaseInput
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Range A - Zone 3"
              containerClassName="bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium opacity-80 mb-1.5 flex items-center gap-1">
            <Calendar size={12} />
            Date & Time
          </label>
          <BaseInput type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} containerClassName="bg-transparent md:w-1/2" />
        </div>
      </div>
    </div>
  );
}
