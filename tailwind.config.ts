import { heroui } from "@heroui/react";
import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}", "./node_modules/preline/dist/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#161616",
      },
      backgroundColor: {
        primary: "#161616",
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [heroui(), require("preline/plugin")],
};

module.exports = withMT(config);
