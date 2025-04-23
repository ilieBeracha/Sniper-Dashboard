import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        dashboard: {
          background: "#121212",
          card: "#1E1E1E",
          border: "rgba(255,255,255,0.05)",
          text: {
            base: "#F3F4F6",
            muted: "#9CA3AF",
            soft: "#4B5563",
          },
          accent: {
            purple: "#7F5AF0",
            green: "#2CB67D",
            red: "#F25F4C",
          },
        },
      },
      backgroundImage: {
        "gradient-sniper": "linear-gradient(to right, #7F5AF0, #2CB67D)",
      },
    },
  },
  plugins: [],
};

export default config;
