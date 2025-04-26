export default function AuthHero() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-[#0A0A0A] relative overflow-hidden">
      {/* Main background elements */}
      <div className="absolute inset-0 bg-[url('/images/tactical-pattern.svg')] opacity-[0.02]"></div>

      {/* Animated gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7F5AF0]/5 via-transparent to-transparent animate-gradient-x"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#7F5AF0]/5 via-transparent to-transparent animate-gradient-y"></div>

      {/* Content container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-12">
        {/* Logo and title section */}
        <div className="text-center mb-16 group">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#7F5AF0]/10 border border-[#7F5AF0]/20 mb-6 transition-all duration-300 group-hover:bg-[#7F5AF0]/20 group-hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-[#7F5AF0] transition-transform duration-300 group-hover:rotate-12"
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
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Scopeon</h1>
          <p className="text-xl text-gray-400 max-w-md mx-auto font-light">Tactical Operations Platform</p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-3xl">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h1a1 1 0 010 2H1a1 1 0 010-2h1v-1a3 3 0 014.75-2.906A5.972 5.972 0 006 17v1H4a1 1 0 010-2h2z" />
                </svg>
              ),
              title: "Team Coordination",
              description: "Real-time tactical operations",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ),
              title: "Secure",
              description: "Military-grade encryption",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              ),
              title: "Performance",
              description: "Field-optimized tracking",
            },
          ].map((feature, i) => (
            <div key={i} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#7F5AF0]/10 border border-[#7F5AF0]/20 mb-4 group-hover:bg-[#7F5AF0]/20 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-[#7F5AF0] font-medium mb-1 group-hover:text-white transition-colors duration-300">{feature.title}</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#7F5AF0]/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#7F5AF0]/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
    </div>
  );
}
