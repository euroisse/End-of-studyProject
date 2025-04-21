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
    screens:{
      sm: "340px",
      md:"540px",
      lg:"768px",
      xl:"1180px"
    },
    extend: {},
    fontFamily:{
      Roboto: "Roboto, sans-serif",
      Montserrat: "Montserrat, sans-serif"
    },
    container:{
      center:true,
      padding:{
        DEFAULT:"12px",
        md:"32px"
      }
    },},
  plugins: [],
}

