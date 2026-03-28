/** Tailwind config - Enhanced Design System */
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
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Playfair Display",
          "Georgia",
          "serif",
        ],
      },
      colors: {
        // Industrial Design System
        brand: {
          dark: "#1D1D1F",
          accent: "#0071E3",
          hover: "#005BB5",
          light: "#F5F5F7",
          surface: "#FFFFFF",
          muted: "#86868B",
          success: "#34C759",
          border: "#D1D1D6",
          cta: "#0071E3",
          ctaHover: "#005BB5",
          quote: "#F37021",
          quoteHover: "#D65A1A",
          glass: "rgba(255, 255, 255, 0.45)",
          glassBorder: "rgba(255, 255, 255, 0.3)",
          // New industrial colors
          navy: "#0a1628",
          "navy-light": "#1a2942",
          "navy-dark": "#050d1a",
          orange: "#f37021",
          "orange-hover": "#e06015",
          "orange-light": "#ff8533",
        },
        primary: "#1D1D1F",
        secondary: "#F5F5F7",
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 10px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 20px rgba(0, 0, 0, 0.12)',
        'xl': '0 16px 32px rgba(0, 0, 0, 0.14)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.16)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glassHover': '0 12px 48px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 40px rgba(243, 112, 33, 0.3)',
        'glow-lg': '0 0 60px rgba(243, 112, 33, 0.4)',
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-scale": "fadeInScale 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(243, 112, 33, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(243, 112, 33, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'transform': 'transform',
        'shadow': 'box-shadow',
        'all': 'all',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '350': '350ms',
        '400': '400ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
