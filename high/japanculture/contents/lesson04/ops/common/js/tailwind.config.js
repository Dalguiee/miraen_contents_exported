/** @type {import('tailwindcss').Config} */

const px0_10 = { ...Array.from(Array(11)).map((_, i) => `${i}px`) };
const px0_100 = { ...Array.from(Array(101)).map((_, i) => `${i}px`) };
const px0_200 = { ...Array.from(Array(201)).map((_, i) => `${i}px`) };
const px0_500 = { ...Array.from(Array(501)).map((_, i) => `${i}px`) };
const px0_1000 = { ...Array.from(Array(1001)).map((_, i) => `${i}px`) };
const px0_2000 = { ...Array.from(Array(2001)).map((_, i) => `${i}px`) };

tailwind.config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "#1E1E1E",
      white: "#FFFFFF",
      blue: "#557EEB",
      red: "#E6002D",
    },
    extend: {
      borderWidth: px0_10,
      borderRadius: px0_1000,
      lineHeight: px0_100,
      minWidth: px0_500,
      minHeight: px0_500,
      spacing: px0_2000,
    },
  },
  plugins: [],
};
