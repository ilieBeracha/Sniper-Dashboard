export default function AuthHero() {
  return (
    <div className="hidden md:flex md:w-2/2 bg-gradient-to-br from-[#0A0A0A] to-[#121212] relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 bg-[url('/images/tactical-pattern.svg')] opacity-[0.02]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>

      {/* Animated gradient overlays */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-[#7F5AF0]/10 via-transparent to-transparent animate-gradient-x"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#7F5AF0]/10 via-transparent to-transparent animate-gradient-y"></div> */}

      {/* Content container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-12">
        {/* Logo and title section */}
        <div className="text-center mb-20 group">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#333333] mb-8 transition-all duration-500 group-hover:bg-[#1A1A1A] group-hover:scale-105 shadow-lg shadow-black/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white/90 transition-transform duration-500 group-hover:rotate-12"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-6 text-white tracking-tight">ScopeStats</h1>
          <p className="text-xl text-gray-400 max-w-md mx-auto font-light tracking-wide">Advanced Analytics Platform</p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-12 w-full max-w-4xl">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h1a1 1 0 010 2H1a1 1 0 010-2h1v-1a3 3 0 014.75-2.906A5.972 5.972 0 006 17v1H4a1 1 0 010-2h2z" />
                </svg>
              ),
              title: "Data Analytics",
              description: "Real-time performance metrics",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ),
              title: "Enterprise Security",
              description: "Advanced encryption protocols",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              ),
              title: "Performance",
              description: "Optimized data processing",
            },
          ].map((feature, i) => (
            <div key={i} className="text-center group transform transition-all duration-500 hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#333333] mb-6 group-hover:bg-[#1A1A1A] group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-black/20">
                <div className="text-white/90 group-hover:text-white transition-colors duration-500">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-white/90 mb-3 group-hover:text-white transition-colors duration-500">{feature.title}</h3>
              <p className="text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7F5AF0]/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
    </div>
  );
}
