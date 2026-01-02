/** Tailwind config extracted from prior inline config. */
module.exports = {
  content: [
    "./**/*.{html,njk,md}",
    "_includes/**/*.njk",
    "_site/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#0f172a",
          accent: "#06b6d4",
          hover: "#0891b2",
          light: "#f8fafc",
          surface: "#1e293b",
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
