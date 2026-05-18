/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#983732",
          "red-dark": "#7d2d28",
          "red-light": "#b84845",
          slate: "#414e68",
          "slate-dark": "#2e3a50",
          "slate-deep": "#242f43",
          "slate-light": "#4d5b76",
          muted: "#8e99b0",
          border: "#525e79",
          "border-light": "#60708f",
        },
      },
    },
  },
  plugins: [],
};
