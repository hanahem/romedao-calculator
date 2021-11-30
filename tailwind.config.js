module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bg: "#f9f8ff",
        brand: "#c33c40",
        fg: "#f5f4f4",
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
