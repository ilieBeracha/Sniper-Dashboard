import BaseInput from "@/components/BaseInput";

type BasicInfoSectionProps = {
  sessionName: string;
  setSessionName: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
};

export default function BasicInfoSection({ sessionName, setSessionName, location, setLocation, date, setDate }: BasicInfoSectionProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-white/5 p-6">
      <h4 className="text-sm font-medium text-white mb-4">Basic Information</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          label="Session Name"
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="Sniper Weekly Training"
          containerClassName="bg-transparent"
          labelClassName="text-gray-400"
        />

        <BaseInput
          label="Location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Base A - Range 3"
          containerClassName="bg-transparent"
          labelClassName="text-gray-400"
        />
      </div>

      <div className="mt-6">
        <BaseInput
          label="Date & Time"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          containerClassName="bg-transparent md:w-1/2"
          labelClassName="text-gray-400"
        />
      </div>
    </div>
  );
}
