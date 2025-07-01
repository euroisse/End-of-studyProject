/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      xxl: "1440px",
      xxl: "1600px",
    },
    maxWidth: {
      "screen-xl": "1280px",
      "screen-xxl": "1440px",
      "screen-xxxl": "1600px",
    },
    extend: {
      padding: {
        "5p": "5%",
        "10p": "10%",
        "15p": "15%",
        "5vw": "5vw",
        "10vw": "10vw",
      },
    },
    fontFamily: {
      Roboto: "Roboto, sans-serif",
      Montserrat: "Montserrat, sans-serif",
    },
    container: {
      center: true,
      DEFAULT: "1rem",
      sm: "2rem",
      md: "3rem",
      lg: "4rem",
      xl: "6rem",
      "2xl": "8rem",
    },
  },
  plugins: [],
};
