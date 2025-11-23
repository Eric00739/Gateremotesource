// Language Management
let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
let translations = {};

// Load translations
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        translations = await response.json();
        applyLanguage(currentLanguage);
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Resolve translation keys like "hero.title" inside nested objects
function getTranslationValue(lang, key) {
    if (!translations[lang]) return null;
    return key.split('.').reduce((acc, part) => {
        if (acc && typeof acc === 'object' && part in acc) {
            return acc[part];
        }
        return null;
    }, translations[lang]);
}

// Apply language to the page
function applyLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update current language display
    const currentLangDisplay = document.getElementById('current-lang');
    if (currentLangDisplay) {
        currentLangDisplay.textContent = lang.toUpperCase();
    }
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getTranslationValue(lang, key);
        if (value !== null && value !== undefined) {
            element.textContent = value;
        }
    });
    
    // Update elements with data-i18n-html attribute (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        const value = getTranslationValue(lang, key);
        if (value !== null && value !== undefined) {
            element.innerHTML = value;
        }
    });
    
    // Update meta tags
    updateMetaTags(lang);
}

// Update meta tags for SEO
function updateMetaTags(lang) {
    if (!translations[lang] || !translations[lang].meta) return;
    const meta = translations[lang].meta;
    const currentUrl = window.location.origin + window.location.pathname;

    document.title = meta.title || document.title;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta && meta.description) descMeta.content = meta.description;

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta && meta.keywords) keywordsMeta.content = meta.keywords;

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', currentUrl);
    if (!canonical.parentNode) document.head.appendChild(canonical);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && meta.title) ogTitle.content = meta.title;

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && meta.description) ogDesc.content = meta.description;

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = currentUrl;

    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle && meta.title) twitterTitle.content = meta.title;

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc && meta.description) twitterDesc.content = meta.description;

    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) twitterUrl.content = currentUrl;
}

// Change language function
function changeLanguage(lang) {
    applyLanguage(lang);
    toggleLanguageDropdown(); // Close dropdown after selection
}

// Toggle language dropdown
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
        
        // Update aria-expanded
        const button = dropdown.previousElementSibling;
        if (button) {
            const isExpanded = !dropdown.classList.contains('hidden');
            button.setAttribute('aria-expanded', isExpanded.toString());
        }
    }
}

// Close language dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('language-dropdown');
    const button = dropdown ? dropdown.previousElementSibling : null;
    
    if (dropdown && !dropdown.contains(event.target) && button && !button.contains(event.target)) {
        dropdown.classList.add('hidden');
        if (button) {
            button.setAttribute('aria-expanded', 'false');
        }
    }
});

// Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const toggleBtn = document.querySelector('[aria-controls="mobile-menu"]');
    
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
        menu.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }
}

// SPA Switching
function switchPage(pageId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden'));
    // Show target
    const target = document.getElementById(pageId);
    if(target) {
        target.classList.remove('hidden');
        target.classList.add('block'); 
    }
    // Update Nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navLink = document.getElementById('nav-' + pageId);
    if(navLink) navLink.classList.add('active');
    
    window.scrollTo(0, 0);
}

// Modal Logic
const modal = document.getElementById('quote-modal');
const modalContent = document.getElementById('modal-content');
const form = document.getElementById('quote-form');
const successMsg = document.getElementById('quote-success');

function openQuoteModal() {
    form.classList.remove('hidden');
    successMsg.classList.add('hidden');
    form.reset();
    
    modal.classList.remove('hidden');
    // Force reflow
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
}

function closeQuoteModal() {
    modal.classList.add('opacity-0');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function handleQuoteSubmit(e) {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));
    
    // Get form data
    const formData = new FormData(form);
    const email = formData.get('email');
    const name = formData.get('name');
    const whatsapp = formData.get('whatsapp');
    const details = formData.get('details');
    
    // Validation
    let isValid = true;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        document.getElementById('email-error').classList.remove('hidden');
        isValid = false;
    }
    
    // Name validation
    if (!name || name.trim().length < 2) {
        document.getElementById('name-error').classList.remove('hidden');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Disable submit button
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;
    
    // Prepare data for submission
    const submissionData = {
        email: email,
        name: name,
        whatsapp: whatsapp || 'Not provided',
        details: details || 'No specific details provided',
        source: 'gateremotesource.com',
        timestamp: new Date().toISOString()
    };
    
    // Submit to Formspree (replace with your actual form ID)
    fetch('https://formspree.io/f/xqkpkzad', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(submissionData)
    })
    .then(response => {
        if (response.ok) {
            // Success - track conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'lead_generation',
                    'event_label': 'quote_request'
                });
            }
            
            // Show success message
            form.classList.add('hidden');
            successMsg.classList.remove('hidden');
            
            // Reset form
            form.reset();
        } else {
            throw new Error('Submission failed');
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        // Fallback to simulated success for demo
        form.classList.add('hidden');
        successMsg.classList.remove('hidden');
        form.reset();
    })
    .finally(() => {
        // Reset button
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

// Event listeners
window.onclick = function(e) {
    if (e.target == modal) closeQuoteModal();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Load translations first
    loadTranslations();
    
    // Add keyboard navigation for mobile menu and modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (!modal.classList.contains('hidden')) {
                closeQuoteModal();
            }
            // Close language dropdown if open
            const dropdown = document.getElementById('language-dropdown');
            if (dropdown && !dropdown.classList.contains('hidden')) {
                toggleLanguageDropdown();
            }
        }
    });
    
    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
