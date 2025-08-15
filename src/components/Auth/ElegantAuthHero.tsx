import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

export default function ElegantAuthHero() {
  const { theme } = useTheme();
  
  return (
    <div
      className={`hidden md:flex w-1/2 relative overflow-hidden transition-colors duration-200 ${
        theme === "dark" 
          ? "bg-gradient-to-br from-gray-900 to-gray-800" 
          : "bg-gradient-to-br from-gray-50 to-white"
      }`}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${
            theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"
          } 2px, transparent 2px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Subtle gradient overlay */}
      <div className={`absolute inset-0 ${
        theme === "dark" 
          ? "bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/30" 
          : "bg-gradient-to-t from-gray-100/50 via-transparent to-white/30"
      }`} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8 max-w-lg"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
              theme === "dark" 
                ? "bg-gray-800 border border-gray-700" 
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <svg
              className={`w-10 h-10 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </motion.div>

          {/* Welcome text */}
          <div className="space-y-3">
            <h1 className={`text-4xl font-semibold tracking-tight ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Welcome back
            </h1>
            <p className={`text-base leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              Sign in to access your dashboard and manage your team's performance
            </p>
          </div>

          {/* Stats or features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 gap-8 mt-12"
          >
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Support" },
              { value: "256-bit", label: "Encryption" },
              { value: "SOC 2", label: "Compliant" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className={`text-2xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm mt-1 ${
                  theme === "dark" ? "text-gray-500" : "text-gray-500"
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial or trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className={`mt-16 pt-8 border-t ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <p className={`text-sm italic ${
              theme === "dark" ? "text-gray-500" : "text-gray-500"
            }`}>
              "The best platform for managing our team's operations. Intuitive, powerful, and reliable."
            </p>
            <p className={`text-sm mt-3 ${
              theme === "dark" ? "text-gray-600" : "text-gray-400"
            }`}>
              — Operations Director, Fortune 500
            </p>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10">
          <motion.div
            animate={{ 
              rotate: 360,
              transition: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
            className={`w-24 h-24 rounded-full border ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}
          />
        </div>
        <div className="absolute bottom-10 left-10">
          <motion.div
            animate={{ 
              rotate: -360,
              transition: { duration: 30, repeat: Infinity, ease: "linear" }
            }}
            className={`w-32 h-32 rounded-full border ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}
          />
        </div>
      </div>
    </div>
  );
}