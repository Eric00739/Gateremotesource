const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

// PurgeCSS Configuration for GateRemoteSource
// 移除未使用的 CSS 类

const config = {
  // 要扫描的内容文件（扫描已生成的 dist 文件夹）
  content: [
    './dist/**/*.html',
    './**/*.njk',
    './**/*.md',
    './_includes/**/*.njk',
    './assets/js/**/*.js',
  ],

  // 要处理的 CSS 文件（已编译的完整 Tailwind）
  css: [
    './assets/css/tailwind.css',
  ],

  // 安全列表 - 这些类不会被移除
  safelist: [
    // Tailwind 变体
    /^bg-/, /^text-/, /^border-/, /^shadow-/, /^rounded-/, /^p-/, /^m-/, /^px-/, /^py-/, /^mx-/, /^my-/, /^w-/, /^h-/, /^min-w-/, /^min-h-/, /^max-w-/, /^max-h-/, /^grid-/, /^flex-/, /^gap-/, /^space-/, /^divide-/, /^order-/, /^col-/, /^row-/, /^place-/, /^content-/, /^items-/, /^justify-/, /^self-/, /^overflow-/, /^truncate$/, /^break-/, /^whitespace-/, /^align-/, /^leading-/, /^tracking-/, /^font-/, /^text-/, /^uppercase$/, /^lowercase$/, /^capitalize$/, /^normal-case$/, /^underline$/, /^line-through$/, /^no-underline$/, /^antialiased$/, /^italic$/, /^not-italic$/, /^list-/, /^appearance-/, /^cursor-/, /^outline-/, /^pointer-events-/, /^resize-/, /^select-/, /^sr-only$/, /^not-sr-only$/,
    // 颜色变体
    /^brand-/, /^hover:/, /^focus:/, /^active:/, /^disabled:/, /^group-hover:/, /^group-focus:/, /^focus-within:/, /^focus-visible:/, /^motion-safe:/, /^motion-reduce:/, /^first:/, /^last:/, /^odd:/, /^even:/, /^visited:/, /^checked:/, /^indeterminate:/, /^placeholder:/, /^empty:/, /^target:/, /^open:/, /^close:/, /^in-range:/, /^out-of-range:/, /^required:/, /^valid:/, /^invalid:/, /^read-only:/, /^read-write:/,
    // 响应式变体
    /^sm:/, /^md:/, /^lg:/, /^xl:/, /^2xl:/,
    // 深色模式
    /^dark:/,
    // 自定义类
    'glass-card', 'hover-lift', 'img-hover-zoom', 'reveal', 'animate-float', 'stat-card', 'input-enhanced', 'nav-enhanced', 'stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6', 'animate-fade-in-up', 'animate-pulse-glow', 'faq-item', 'faq-question', 'faq-answer', 'faq-icon', 'active', 'loaded', 'loading', 'error', 'copied', 'reduce-motion', 'dark', 'skip-link', 'nav-glass', 'whatsapp-float', 'reading-progress', 'animate-fade-in-scale', 'animate-slide-in-left', 'animate-slide-in-right', 'animate-shimmer', 'skeleton', 'mobile-menu', 'back-to-top', 'visible', 'topic-filter-btn', 'ghost-btn', 'text-link-arrow', 'site-logo-frame', 'site-logo-icon', 'site-footer-logo-icon', 'resource-hero', 'resource-hero-title', 'resource-band', 'category-card', 'category-card-inner', 'category-col-left', 'category-col-middle', 'category-col-right', 'category-icon-wrap', 'category-meta', 'category-description', 'category-right-title', 'resource-links', 'resource-link-item', 'resource-link', 'resource-link-title', 'resource-link-arrow', 'nav-link', 'nav-mobile', 'nav-mobile-close', 'menu-toggle', 'hero-section', 'hero-gradient', 'hero-pattern', 'hero-wrapper', 'hero-video', 'hero-overlay', 'hero-inner', 'hero-content-stack', 'hero-content-card', 'hero-title', 'hero-subtitle', 'hero-badges', 'hero-badge', 'animate-fade-in-up', 'product-card', 'product-card-image', 'product-badge', 'grid-auto-fit', 'feature-box', 'testimonial-card', 'form-input', 'section-divider', 'badge', 'badge-outline', 'text-responsive-hero', 'text-responsive-title', 'text-responsive-subtitle', 'bg-brand-surface', 'text-brand-dark', 'text-brand-light', 'text-brand-muted', 'text-brand-accent', 'text-brand-cta', 'bg-brand-accent', 'bg-brand-cta', 'bg-brand-ctaHover', 'bg-brand-light', 'bg-brand-hover', 'bg-brand-success', 'bg-brand-border', 'border-brand-border', 'border-brand-accent', 'hover:bg-brand-accent', 'hover:text-brand-accent', 'hover:text-brand-hover', 'hover:border-brand-accent', 'hover:shadow-md', 'hover:shadow-lg', 'hover:shadow-xl', 'hover:shadow-2xl', 'hover:shadow-glass', 'hover:shadow-glassHover', 'focus:border-brand-accent', 'focus:ring-brand-accent', 'backdrop-blur', 'backdrop-filter', 'line-clamp-2', 'line-clamp-3', 'aspect-square', 'aspect-video', 'object-contain', 'object-cover', 'fixed', 'sticky', 'relative', 'absolute', 'inset-0', 'z-10', 'z-50', 'z-\[120\]', 'overflow-hidden', 'overflow-visible', 'sr-only', 'not-sr-only'
  ],

  // 提取器 - 从内容中提取类名
  extractors: [
    {
      extractor: (content) => {
        // 匹配 class="..." 或 className="..."
        const matches = content.match(/class(?:Name)?=["']([^"']+)["']/g) || [];
        return matches.flatMap(match => {
          const classes = match.replace(/class(?:Name)?=["']/g, '').replace(/["']$/g, '');
          return classes.split(/\s+/);
        });
      },
      extensions: ['html', 'njk', 'md', 'js', 'ts', 'jsx', 'tsx']
    }
  ],

  // 输出选项
  output: [
    {
      file: 'dist/assets/css/tailwind.min.css',
      // 压缩选项
      minify: true
    }
  ]
};

// Run PurgeCSS
async function runPurgeCSS() {
  console.log('🧹 Starting PurgeCSS...');

  const startTime = Date.now();
  const results = await new PurgeCSS().purge(config);

  // 确保输出目录存在
  const outputDir = path.dirname(config.output[0].file);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 写入优化后的 CSS
  for (const result of results) {
    const originalFile = config.css[0]; // 使用配置的原始 CSS 文件
    fs.writeFileSync(result.file, result.css);

    const originalSize = fs.existsSync(originalFile)
      ? fs.statSync(originalFile).size
      : 0;
    const newSize = fs.statSync(result.file).size;
    const savings = originalSize > 0 ? ((originalSize - newSize) / originalSize * 100).toFixed(2) : 0;

    console.log(`✅ Optimized: ${result.file}`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Optimized: ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`   Saved: ${savings}%`);
  }

  const duration = Date.now() - startTime;
  console.log(`\n⏱️  Completed in ${duration}ms`);
}

runPurgeCSS().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
