/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ECEBE8",
      },
      borderRadius: {
        "2.5xl": "20px",
        "3.5xl": "32px",
        "4xl": "50px",
      },
      backgroundColor: {
        white: "#ECEBE8",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    base: false, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
  },
};
