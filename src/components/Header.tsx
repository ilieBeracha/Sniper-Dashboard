export default function Header({
  setIsOpen,
}: {
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <div className=" mb-12 w-full">
      <div className="flex space-x-4 w-full justify-between items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="w-fit py-2 bg-gradient-to-r  from-[#7F5AF0] to-[#2CB67D] hover:opacity-90 rounded-lg text-sm font-medium transition-all text-white"
        >
          Invite
        </button>
        <button className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-white/10 rounded-lg text-sm font-medium text-white transition-all">
          Generate Intel Report
        </button>
      </div>
    </div>
  );
}
