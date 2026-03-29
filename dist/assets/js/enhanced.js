/**
 * GateRemoteSource - Enhanced Interactions
 * Frontend Optimization Module
 */

(function() {
  'use strict';

  // ============================================
  // Configuration
  // ============================================
  const CONFIG = {
    scrollOffset: 100,
    animationDelay: 100,
    throttleDelay: 16,
    observerThreshold: 0.1
  };

  // ============================================
  // 1. Scroll Reveal Animation
  // ============================================
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal, [data-reveal]');

    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('active');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: CONFIG.observerThreshold,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  };

  // ============================================
  // 2. Navigation Scroll Effect
  // ============================================
  const initNavigation = () => {
    const nav = document.querySelector('.nav-glass, .nav-enhanced');
    if (!nav) return;

    let ticking = false;

    const updateNav = () => {
      const scrollY = window.pageYOffset;

      if (scrollY > CONFIG.scrollOffset) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });
  };

  // ============================================
  // 3. FAQ Accordion
  // ============================================
  const initFAQ = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question, [data-faq-toggle]');

      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          const answer = item.querySelector('.faq-answer');
          if (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        }
      });
    });
  };

  // ============================================
  // 4. Counter Animation
  // ============================================
  const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number[data-count], [data-counter]');

    if (!counters.length) return;

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseInt(target.dataset.count || target.dataset.counter);
          const duration = parseInt(target.dataset.duration) || 2000;
          const suffix = target.dataset.suffix || '';
          const prefix = target.dataset.prefix || '';

          animateCounter(target, countTo, duration, prefix, suffix);
          countObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => countObserver.observe(counter));
  };

  const animateCounter = (element, target, duration, prefix, suffix) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = prefix + target.toLocaleString() + suffix;
      }
    };

    updateCounter();
  };

  // ============================================
  // 5. Mobile Menu Toggle
  // ============================================
  const initMobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle, [data-menu-toggle]');
    const mobileMenu = document.querySelector('.nav-mobile, .mobile-menu');
    const menuClose = document.querySelector('.nav-mobile-close, [data-menu-close]');

    if (!menuToggle || !mobileMenu) return;

    const openMenu = () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', openMenu);
    menuClose?.addEventListener('click', closeMenu);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close on backdrop click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });
  };

  // ============================================
  // 6. Lazy Loading Images
  // ============================================
  const initLazyLoading = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (!lazyImages.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          const srcset = img.dataset.srcset;

          if (src) {
            img.src = src;
          }
          if (srcset) {
            img.srcset = srcset;
          }

          img.classList.add('loaded');
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  };

  // ============================================
  // 7. Smooth Scroll
  // ============================================
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const offsetTop = target.offsetTop - 80; // Account for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      });
    });
  };

  // ============================================
  // 8. Parallax Effect
  // ============================================
  const initParallax = () => {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (!parallaxElements.length) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.pageYOffset;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = scrollY * speed;
        el.style.transform = `translateY(${yPos}px)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  };

  // ============================================
  // 9. Video Lazy Load
  // ============================================
  const initVideoLazyLoad = () => {
    const lazyVideos = document.querySelectorAll('video[data-src]');

    if (!lazyVideos.length) return;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          const src = video.dataset.src;

          if (src) {
            const source = document.createElement('source');
            source.src = src;
            source.type = 'video/mp4';
            video.appendChild(source);
            video.load();
          }

          videoObserver.unobserve(video);
        }
      });
    }, { threshold: 0.25 });

    lazyVideos.forEach(video => videoObserver.observe(video));
  };

  // ============================================
  // 10. Form Validation Enhancement
  // ============================================
  const initFormEnhancement = () => {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => clearError(input));
      });

      form.addEventListener('submit', (e) => {
        let isValid = true;

        inputs.forEach(input => {
          if (!validateInput(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  };

  const validateInput = (input) => {
    const value = input.value.trim();
    const required = input.required;
    const type = input.type;
    const pattern = input.pattern;

    let isValid = true;
    let errorMessage = '';

    if (required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (value && type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    } else if (value && pattern) {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        isValid = false;
        errorMessage = input.dataset.error || 'Invalid format';
      }
    }

    if (!isValid) {
      showError(input, errorMessage);
    } else {
      clearError(input);
    }

    return isValid;
  };

  const showError = (input, message) => {
    input.classList.add('error');
    let errorEl = input.parentElement.querySelector('.error-message');

    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      input.parentElement.appendChild(errorEl);
    }

    errorEl.textContent = message;
  };

  const clearError = (input) => {
    input.classList.remove('error');
    const errorEl = input.parentElement.querySelector('.error-message');
    if (errorEl) {
      errorEl.remove();
    }
  };

  // ============================================
  // 11. Back to Top Button
  // ============================================
  const initBackToTop = () => {
    const backToTop = document.querySelector('.back-to-top, [data-back-to-top]');
    if (!backToTop) return;

    let ticking = false;

    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(toggleVisibility);
        ticking = true;
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  // ============================================
  // Initialize All
  // ============================================
  const init = () => {
    initScrollReveal();
    initNavigation();
    initFAQ();
    initCounters();
    initMobileMenu();
    initLazyLoading();
    initSmoothScroll();
    initParallax();
    initVideoLazyLoad();
    initFormEnhancement();
    initBackToTop();
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose to global scope for debugging
  window.GateRemoteSource = {
    init,
    utils: {
      animateCounter,
      validateInput
    }
  };

})();
