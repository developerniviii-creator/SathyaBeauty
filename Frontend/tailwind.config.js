/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D69700",
        secondary: "#F0E69C",
        background: "#FDFBF7",
        text: "#1A1A1A",
      },
    },
  },
  plugins: [],
}
