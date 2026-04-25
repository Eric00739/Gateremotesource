/** Tailwind config - Enhanced Design System */
module.exports = {
  content: [
    "./**/*.{html,njk,md}",
    "_includes/**/*.njk",
    "!dist/**/*.html"
  ],
  safelist: [
    // Language dropdown classes
    'hidden',
    'block',
    // Animation classes
    'animate-fade-in-up',
    'animate-fade-in-scale',
    // Mobile menu classes
    'lg:hidden',
    'lg:flex'
  ],
  theme: {
    extend: {
      fontFamily: {
        // German Industrial Aesthetic: Space Grotesk + DM Sans
        // Avoiding: Inter, Roboto, Arial, Fraunces, system-ui
        sans: [
          "DM Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        display: [
          "Space Grotesk",
          "DM Sans",
          "sans-serif",
        ],
        body: [
          "DM Sans",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "monospace",
        ],
      },
      colors: {
        // Industrial Design System with oklch colors
        // Using perceptually uniform color space for better visual harmony
        brand: {
          // Navy: oklch(15% 0.03 260) - deep industrial blue
          dark: "oklch(15% 0.03 260)",
          "dark-hover": "oklch(20% 0.04 260)",
          // Orange accent: oklch(60% 0.18 45) - vibrant but professional
          accent: "oklch(60% 0.18 45)",
          "accent-hover": "oklch(55% 0.16 45)",
          // Light surfaces
          light: "oklch(97% 0.01 260)",
          surface: "#FFFFFF",
          // Muted text: oklch(55% 0.02 260)
          muted: "oklch(55% 0.02 260)",
          // Success green
          success: "oklch(65% 0.15 145)",
          // Border: subtle gray
          border: "oklch(85% 0.02 260)",
          // CTA colors (same as accent for consistency)
          cta: "oklch(60% 0.18 45)",
          ctaHover: "oklch(55% 0.16 45)",
          // Quote/secondary accent
          quote: "oklch(60% 0.18 45)",
          quoteHover: "oklch(55% 0.16 45)",
          // Glass effects
          glass: "rgba(255, 255, 255, 0.45)",
          glassBorder: "rgba(255, 255, 255, 0.3)",
          // Navy variations in oklch
          navy: "oklch(15% 0.03 260)",
          "navy-light": "oklch(25% 0.05 260)",
          "navy-dark": "oklch(10% 0.02 260)",
          // Orange variations in oklch
          orange: "oklch(60% 0.18 45)",
          "orange-hover": "oklch(55% 0.16 45)",
          "orange-light": "oklch(70% 0.14 45)",
        },
        primary: "oklch(15% 0.03 260)",
        secondary: "oklch(97% 0.01 260)",
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
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
