module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bg: "#f9f8ff",
      },
      borderRadius: {
        DEFAULT: ".5rem",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled", "hover"],
      borderWidth: ["hover"],
    },
  },
  plugins: [],
};
