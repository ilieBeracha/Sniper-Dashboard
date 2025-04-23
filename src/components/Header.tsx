export default function Header() {
  return (
    <div className="flex justify-between items-center mb-12">
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-white/10 rounded-lg text-sm font-medium text-white transition-all">
          Generate Intel Report
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-[#7F5AF0] to-[#2CB67D] hover:opacity-90 rounded-lg text-sm font-medium transition-all text-white">
          New Operation
        </button>
      </div>
    </div>
  );
}
