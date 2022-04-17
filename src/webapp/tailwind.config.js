module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: "#2d3142",
      secondary: "#4f5d75",

      warning: "#ef8354",
      danger: "#874000",

      base: "#eaebed",

      white: "white",
      black: "black",
      "gray-lighter": "#4a4a4a",
      "gray-light": "#2e3033",
      gray: "#282a2d",
      "gray-dark": "#212326",
      "gray-darker": "#191b1d",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
