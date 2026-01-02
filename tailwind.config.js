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
          dark: "#0F172A",      // 品牌核心色：深海军蓝
          accent: "#3B82F6",     // 交互点睛色：亮蓝色
          hover: "#2563EB",       // Hover 状态
          light: "#F8FAFC",      // 次级背景：极浅灰蓝
          surface: "#FFFFFF",      // 基础背景：纯白
          muted: "#64748B",       // 文字颜色：石墨灰
          success: "#10B981",     // 成功状态
          border: "#E2E8F0",     // 边框颜色
        },
        // 兼容旧版颜色
        primary: "#0F172A",
        secondary: "#F8FAFC",
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
