/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("daisyui"),
  ],
  theme: {
    extend: {
      fontFamily: {
        apocalypse: ["Apocalypse Grunge", "cursive"],
      },
      fontSize: {
        "10xl": "5rem",
        "11xl": "5.5rem",
        "12xl": "6rem",
        giant: "10rem",
      },
    },
  },
};
