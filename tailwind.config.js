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
        // Apple Glassmorphism Design System
        brand: {
          dark: "#1D1D1F",        // Deep gray-black (text)
          accent: "#0071E3",      // Apple Blue (primary action)
          hover: "#005BB5",       // Accent hover
          light: "#F5F5F7",       // Rice white/very light gray (main background)
          surface: "#FFFFFF",    // White (card background)
          muted: "#86868B",       // Secondary text
          success: "#34C759",     // Success
          border: "#D1D1D6",      // Border (subtle)
          cta: "#0071E3",         // Apple Blue (button)
          ctaHover: "#005BB5",    // CTA Hover
          glass: "rgba(255, 255, 255, 0.45)",  // Glass background
          glassBorder: "rgba(255, 255, 255, 0.3)",  // Glass border
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
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',  // Glass card shadow
        'glassHover': '0 12px 48px rgba(0, 0, 0, 0.12)',  // Glass card hover shadow
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
