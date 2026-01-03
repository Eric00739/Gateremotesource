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
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        // Industrial Tech-Clean 视觉系统
        brand: {
          dark: "#0B1F3B",        // 品牌核心色：信任深海军蓝
          accent: "#2F6FE4",      // 交互点睛色：信号蓝
          hover: "#1F4E79",       // Hover 状态
          light: "#F2F4F7",       // 次级背景：中性浅灰
          surface: "#FFFFFF",    // 基础背景：纯白
          muted: "#475569",       // 文字颜色：石墨灰
          success: "#1F8A70",     // 成功状态
          border: "#D7DDE5",      // 边框颜色
          cta: "#F58220",         // CTA：安全橙
          ctaHover: "#E76E12",    // CTA Hover
        },
        // 兼容旧版颜色
        primary: "#0B1F3B",
        secondary: "#F2F4F7",
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
