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
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Apple glass-inspired palette
        brand: {
          dark: "#1D1D1F",        // Dark surface
          accent: "#0A84FF",      // Apple blue
          hover: "#0071E3",       // Accent hover
          light: "#F5F5F7",       // Light background
          surface: "#FFFFFF",    // Glass base (opacity set via CSS)
          muted: "#6E6E73",       // Secondary text
          success: "#34C759",     // Success
          border: "#D1D1D6",      // Separator
          cta: "#0A84FF",         // CTA
          ctaHover: "#0071E3",    // CTA Hover
        },
        // 兼容旧版颜色
        primary: "#1D1D1F",
        secondary: "#F5F5F7",
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 10px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 20px rgba(0, 0, 0, 0.12)',
        'xl': '0 16px 32px rgba(0, 0, 0, 0.14)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.16)',
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
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      transitionDuration: {
        '200': '200ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
