import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

export default function ModernAuthHero() {
  const { theme } = useTheme();
  
  return (
    <div
      className={`hidden md:flex w-1/2 relative overflow-hidden transition-colors duration-200 ${
        theme === "dark" 
          ? "bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" 
          : "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
      }`}
    >
      {/* Animated background gradients */}
      <div className="absolute inset-0">
        <motion.div
          className={`absolute top-0 -left-4 w-72 h-72 ${
            theme === "dark" ? "bg-purple-700" : "bg-purple-300"
          } rounded-full mix-blend-multiply filter blur-xl opacity-70`}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute top-1/2 -right-4 w-72 h-72 ${
            theme === "dark" ? "bg-pink-700" : "bg-pink-300"
          } rounded-full mix-blend-multiply filter blur-xl opacity-70`}
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute -bottom-8 left-20 w-72 h-72 ${
            theme === "dark" ? "bg-blue-700" : "bg-blue-300"
          } rounded-full mix-blend-multiply filter blur-xl opacity-70`}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${
            theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.03)"
          } 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8"
        >
          {/* Logo or Icon */}
          <motion.div
            className="relative"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className={`w-32 h-32 mx-auto rounded-3xl ${
              theme === "dark" 
                ? "bg-gradient-to-br from-purple-600 to-pink-600" 
                : "bg-gradient-to-br from-purple-500 to-pink-500"
            } p-1`}>
              <div className={`w-full h-full rounded-3xl ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } flex items-center justify-center`}>
                <svg
                  className={`w-16 h-16 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
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
              </div>
            </div>
          </motion.div>

          {/* Welcome text */}
          <div className="space-y-4">
            <h1 className={`text-5xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              Welcome Back
            </h1>
            <p className={`text-lg max-w-md mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
              Enter your credentials to access your mission control dashboard and manage your squad
            </p>
          </div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-12"
          >
            {[
              { icon: "🎯", label: "Mission Tracking" },
              { icon: "👥", label: "Squad Management" },
              { icon: "📊", label: "Real-time Analytics" },
              { icon: "🏆", label: "Performance Stats" },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                className={`p-4 rounded-xl backdrop-blur-sm ${
                  theme === "dark"
                    ? "bg-white/5 border border-white/10"
                    : "bg-white/50 border border-gray-200/50"
                }`}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <p className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                  {feature.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <svg
            viewBox="0 0 1440 320"
            className={theme === "dark" ? "text-gray-800" : "text-white"}
            fill="currentColor"
          >
            <path
              fillOpacity="0.3"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}