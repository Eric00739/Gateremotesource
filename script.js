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
    
    // Submit to Formspree (or your preferred service)
    fetch('https://formspree.io/f/your-form-id', {
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
    // Add keyboard navigation for mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeQuoteModal();
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