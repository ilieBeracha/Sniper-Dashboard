export default function Header({ setIsOpen }: { setIsOpen: (open: boolean) => void }) {
  return (
    <div className=" mb-2 w-full">
      <div className="flex space-x-4 w-full justify-between items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-white/10 rounded-lg text-sm font-medium text-white transition-all"
        >
          Invite
        </button>
        <button
          disabled
          className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed  rounded-lg text-sm font-medium text-white transition-all"
        >
          Generate Intel Report
        </button>
      </div>
    </div>
  );
}
