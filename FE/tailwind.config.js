/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {      
      fontFamily: {
      dancing: ["Dancing Script", "system-ui"],
      Jsans: ["Josefin Sans", "sans-serif"],
      kaisei: ['"Kaisei Decol"', 'serif'],
      karla: ['"Karla"', 'sans-serif'],
      jokey: ["Jockey One", "sans-serif"],
      abeezee: ['ABeeZee', 'sans-serif'],
    },
    animation: {
      wave: "wave 0.5s ease-in-out infinite alternate", // Defines the animation
      'move-down': 'moveDown 1s linear infinite',
      'move-down-delay': 'moveDown 1s linear infinite 0.5s',

    },
    keyframes: {
      wave: {
        "0%": { transform: "rotate(0deg)" }, // Starting position
        "100%": { transform: "rotate(5deg)" }, // Waving position
      },
      moveDown: {
        '0%': { transform: 'translateY(0)' },
        '100%': { transform: 'translateY(10px)' }, 
      },
    },
  },
  },
  plugins: [],
}