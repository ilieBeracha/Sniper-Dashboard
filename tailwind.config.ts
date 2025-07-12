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
    },
  },
  plugins: [heroui(), require("preline/plugin")],
};

module.exports = withMT(config);
