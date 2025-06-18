const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    // app content
    `src/**/*.{js,ts,jsx,tsx}`,
    `feature/**/*.{js,ts,jsx,tsx}`,
    // include packages if not transpiling
    // "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: colors.blue[500],
        blueDark: colors.blue[900],
        red: colors.red[500],
        redDark: colors.red[900],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};
