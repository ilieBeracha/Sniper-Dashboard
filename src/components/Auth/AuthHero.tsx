export default function AuthHero() {
  return (
    <>
      {/* Left Side - Hero/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#1E1E20] flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/tactical-pattern.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-xl text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Mission <span className="text-[#7F5AF0]">Control</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Advanced tactical coordination platform for field operations.
          </p>
          <div className="space-x-6  flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-[#7F5AF0]/20 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#7F5AF0]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-3 text-gray-300">
                Real-time tactical coordination
              </span>
            </div>
            <div className="flex items-center">
              <div className="bg-[#7F5AF0]/20 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#7F5AF0]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-3 text-gray-300">
                Secure team communications
              </span>
            </div>
            <div className="flex items-center">
              <div className="bg-[#7F5AF0]/20 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#7F5AF0]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-3 text-gray-300">
                Field-optimized performance
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
