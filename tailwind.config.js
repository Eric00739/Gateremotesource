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
        // Optimized color scheme for cleaner, premium look
        brand: {
          dark: "#1D1D1F",        // Dark surface
          accent: "#2563EB",      // Royal Blue (for hover/key info only)
          hover: "#1D4ED8",       // Accent hover
          light: "#F8FAFC",       // Very light gray-white (main background)
          surface: "#FFFFFF",    // White (card background)
          muted: "#6E6E73",       // Secondary text
          success: "#34C759",     // Success
          border: "#E2E8F0",      // Light smoke gray (separator)
          cta: "#000000",         // Pure black (Apple style)
          ctaHover: "#1F2937",    // CTA Hover (dark gray)
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
