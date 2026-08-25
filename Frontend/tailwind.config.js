/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E91E63",
        secondary: "#FF80AB",
        background: "#FFF5F8",
        text: "#333333",
      },
    },
  },
  plugins: [],
}
