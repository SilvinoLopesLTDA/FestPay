/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'persian-blue': '#2937bd',
        'grape': '#5c39ba',
        'rose-quartz': '#a6a3ae',
        'eerie-black': '#1a1b1d',
      },
    },
  },
  plugins: [],
};
