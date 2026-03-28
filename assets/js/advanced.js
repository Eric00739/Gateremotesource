/**
 * GateRemoteSource - Advanced Performance Optimizations
 * 高级性能优化模块
 */

// ============================================
// 1. Performance Monitoring
// ============================================
const initPerformanceMonitoring = () => {
  // Core Web Vitals monitoring
  if ('web-vitals' in window) {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const delay = entry.processingStart - entry.startTime;
        console.log('FID:', delay);
      }
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

// ============================================
// 2. Progressive Image Loading
// ============================================
const initProgressiveImages = () => {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        const sizes = img.dataset.sizes;

        // Create a new image to preload
        const preloadImg = new Image();

        preloadImg.onload = () => {
          img.src = src;
          if (srcset) img.srcset = srcset;
          if (sizes) img.sizes = sizes;
          img.classList.add('loaded');
          img.classList.remove('loading');
        };

        preloadImg.onerror = () => {
          img.classList.add('error');
          img.classList.remove('loading');
        };

        preloadImg.src = src;
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px 0px',
    threshold: 0.01
  });

  images.forEach(img => {
    img.classList.add('loading');
    imageObserver.observe(img);
  });
};

// ============================================
// 3. Resource Preloading
// ============================================
const initResourceHints = () => {
  // Preconnect to critical domains
  const preconnectDomains = [
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Prefetch visible links
  const prefetchLinks = () => {
    const links = document.querySelectorAll('a[href^="/"]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target;
          const href = link.href;

          // Check if not already prefetched
          if (!document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
            const prefetch = document.createElement('link');
            prefetch.rel = 'prefetch';
            prefetch.href = href;
            document.head.appendChild(prefetch);
          }

          observer.unobserve(link);
        }
      });
    }, { threshold: 0.5 });

    links.forEach(link => observer.observe(link));
  };

  // Delay prefetch to not block critical resources
  setTimeout(prefetchLinks, 3000);
};

// ============================================
// 4. Idle Time Loading
// ============================================
const initIdleTimeLoading = () => {
  // Load non-critical resources when idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Load non-critical CSS
      const deferredStyles = document.querySelectorAll('link[data-defer-css]');
      deferredStyles.forEach(link => {
        link.rel = 'stylesheet';
      });

      // Load non-critical JS
      const deferredScripts = document.querySelectorAll('script[data-defer-js]');
      deferredScripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.src = script.dataset.src;
        newScript.async = true;
        document.body.appendChild(newScript);
      });
    }, { timeout: 2000 });
  }
};

// ============================================
// 5. Intersection Observer for Animations
// ============================================
const initAdvancedScrollAnimations = () => {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animation = element.dataset.animate;
        const delay = element.dataset.delay || 0;
        const duration = element.dataset.duration || '0.6s';

        element.style.animationDuration = duration;
        element.style.animationDelay = `${delay}ms`;
        element.classList.add(`animate-${animation}`);

        animationObserver.unobserve(element);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => animationObserver.observe(el));
};

// ============================================
// 6. Touch Gestures for Mobile
// ============================================
const initTouchGestures = () => {
  let touchStartX = 0;
  let touchEndX = 0;

  const swipeContainers = document.querySelectorAll('[data-swipe]');

  swipeContainers.forEach(container => {
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe(container);
    }, { passive: true });
  });

  const handleSwipe = (container) => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left
        container.dispatchEvent(new CustomEvent('swipeleft'));
      } else {
        // Swipe right
        container.dispatchEvent(new CustomEvent('swiperight'));
      }
    }
  };
};

// ============================================
// 7. Reduced Motion Support
// ============================================
const initReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const handleMotionPreference = () => {
    document.documentElement.classList.toggle('reduce-motion', prefersReducedMotion.matches);
  };

  prefersReducedMotion.addEventListener('change', handleMotionPreference);
  handleMotionPreference();
};

// ============================================
// 8. Offline Support - Service Worker Registration
// ============================================
const initServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration.scope);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    });
  }
};

// ============================================
// 9. Dark Mode Support
// ============================================
const initDarkMode = () => {
  const darkModeToggle = document.querySelector('[data-darkmode-toggle]');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const setDarkMode = (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', isDark);
  };

  // Check saved preference
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== null) {
    setDarkMode(savedMode === 'true');
  } else {
    setDarkMode(prefersDark.matches);
  }

  // Listen for system changes
  prefersDark.addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode') === null) {
      setDarkMode(e.matches);
    }
  });

  // Toggle button
  darkModeToggle?.addEventListener('click', () => {
    const isDark = !document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  });
};

// ============================================
// 10. Reading Progress Indicator
// ============================================
const initReadingProgress = () => {
  const progressBar = document.querySelector('.reading-progress');
  if (!progressBar) return;

  let ticking = false;

  const updateProgress = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
};

// ============================================
// 11. Copy to Clipboard
// ============================================
const initCopyToClipboard = () => {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const text = button.dataset.copy;

      try {
        await navigator.clipboard.writeText(text);

        // Show success feedback
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');

        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
};

// ============================================
// 12. Table of Contents Active State
// ============================================
const initTableOfContents = () => {
  const tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  const sections = Array.from(tocLinks).map(link => {
    const id = link.getAttribute('href').slice(1);
    return document.getElementById(id);
  }).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-20% 0% -80% 0%'
  });

  sections.forEach(section => observer.observe(section));
};

// ============================================
// Initialize All
// ============================================
const initAdvanced = () => {
  initPerformanceMonitoring();
  initProgressiveImages();
  initResourceHints();
  initIdleTimeLoading();
  initAdvancedScrollAnimations();
  initTouchGestures();
  initReducedMotion();
  initServiceWorker();
  initDarkMode();
  initReadingProgress();
  initCopyToClipboard();
  initTableOfContents();
};

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdvanced);
} else {
  initAdvanced();
}

// Expose to global scope
window.GateRemoteSourceAdvanced = {
  initAdvanced,
  setDarkMode: (isDark) => {
    document.documentElement.classList.toggle('dark', isDark);
  }
};
