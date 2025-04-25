type BasicInfoSectionProps = {
  sessionName: string;
  setSessionName: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
};

export default function BasicInfoSection({
  sessionName,
  setSessionName,
  location,
  setLocation,
  date,
  setDate,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-white/5 p-6">
      <h3 className="text-sm font-medium text-white mb-4">Basic Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Session Name
          </label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
            placeholder="Sniper Weekly Training"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
            placeholder="Base A - Range 3"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-400 mb-1.5">
          Date & Time
        </label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="block w-full md:w-1/2 rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}
