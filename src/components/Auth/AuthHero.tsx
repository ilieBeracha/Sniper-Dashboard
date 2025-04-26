export default function AuthHero() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#161616] to-[#0A0A0A] flex-col justify-center items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/tactical-pattern.svg')] opacity-5"></div>
      <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-indigo-600/10 to-transparent rounded-tr-full"></div>

      <div className="relative z-10 max-w-md px-8">
        <div className="mb-8 flex items-center">
          <div className="h-1.5 w-12 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full mr-3"></div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-indigo-400">Tactical Operations</h2>
        </div>

        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">Scopeon</h1>

        <p className="text-xl text-gray-300 mb-10 leading-relaxed">Advanced tactical coordination platform for elite field operations.</p>

        <div className="space-y-6">
          {["Real-time tactical coordination", "Secure team communications", "Field-optimized performance tracking"].map((text, i) => (
            <div key={i} className="flex items-center">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2 rounded-md shadow-lg shadow-indigo-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-4 text-gray-300 font-medium">{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center gap-4">
          <div className="px-4 py-1.5 bg-[#1A1A1A] border border-white/5 rounded-full text-xs text-gray-400 font-medium">Military Grade</div>
          <div className="px-4 py-1.5 bg-[#1A1A1A] border border-white/5 rounded-full text-xs text-gray-400 font-medium">Encrypted</div>
          <div className="px-4 py-1.5 bg-[#1A1A1A] border border-white/5 rounded-full text-xs text-gray-400 font-medium">Secure</div>
        </div>
      </div>
    </div>
  );
}
