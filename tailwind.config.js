/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Mission-control palette: dark instrument panel, one warm accent
        // for scores/progress, a cool green for "on track" and a muted
        // clay for gaps — not decoration, these map to actual states.
        ink: "#12161B",
        panel: "#1A1F26",
        panelBorder: "#2A313B",
        paper: "#EDEAE1",
        paperDim: "#8F97A3",
        accent: "#E8A33D",
        good: "#4FA98C",
        gap: "#C7684A",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
