/**
 * Portfolio Website - JavaScript
 * Handles interactivity, smooth scrolling, form submission, and animations
 */

// ===== DOM ELEMENTS =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');

// ===== MOBILE MENU TOGGLE =====
/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
}

/**
 * Close mobile menu when a link is clicked
 */
function closeMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
}

// Event listeners for mobile menu
if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

// Close menu when clicking on a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ===== SCROLL ANIMATIONS =====
/**
 * Observe elements and add fade-in animation on scroll
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all skill cards, project cards, and experience items
document.querySelectorAll('.skill-card, .project-card, .experience-item, .education-card').forEach(element => {
    element.classList.add('fade-in-on-scroll');
    observer.observe(element);
});

// ===== SMOOTH SCROLL NAVIGATION =====
/**
 * Handle smooth scrolling for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for valid section links
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            closeMenu();
        }
    });
});

// ===== FORM SUBMISSION =====
/**
 * Handle contact form submission
 */
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name') || document.querySelector('input[placeholder="Your Name"]').value;
        const email = formData.get('email') || document.querySelector('input[placeholder="Your Email"]').value;
        const subject = formData.get('subject') || document.querySelector('input[placeholder="Subject"]').value;
        const message = formData.get('message') || document.querySelector('textarea[placeholder="Your Message"]').value;
        
        // Validate form
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Validate email
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // In a real application, you would send this to a server
        // For now, we'll show a success message
        console.log('Form Data:', { name, email, subject, message });
        
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        this.reset();
        
        // Optionally send to email service (requires backend)
        // sendFormToServer({ name, email, subject, message });
    });
}

// ===== UTILITY FUNCTIONS =====

/**
 * Validate email address
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 20px;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInFromTop 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInFromTop 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Send form data to server (placeholder for backend integration)
 */
async function sendFormToServer(data) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification('Message sent successfully!', 'success');
        } else {
            showNotification('Failed to send message. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('An error occurred. Please try again.', 'error');
    }
}

// ===== NAVBAR ACTIVE STATE =====
/**
 * Update active nav link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        link.style.fontWeight = '';
        
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.style.color = 'var(--primary-color)';
            link.style.fontWeight = '600';
        }
    });
}

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNavLink);

// ===== PARALLAX EFFECT (Optional) =====
/**
 * Add subtle parallax effect to hero section
 */
const heroSection = document.querySelector('.hero');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        
        if (scrollPosition < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
    });
}

// ===== LAZY LOADING IMAGES =====
/**
 * Lazy load images for better performance
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== SCROLL TO TOP BUTTON =====
/**
 * Show/hide scroll to top button
 */
const scrollToTopBtn = document.querySelector('.scroll-to-top');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== KEYBOARD NAVIGATION =====
/**
 * Handle keyboard navigation
 */
document.addEventListener('keydown', (e) => {
    // Close menu on Escape key
    if (e.key === 'Escape') {
        closeMenu();
    }
    
    // Navigation with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        // Optional: Implement keyboard navigation for links
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
/**
 * Debounce function for resize events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle window resize with debounce
 */
const handleResize = debounce(() => {
    updateActiveNavLink();
}, 250);

window.addEventListener('resize', handleResize);

// ===== ACCESSIBILITY =====
/**
 * Skip to main content link (for accessibility)
 */
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
`;

document.body.prepend(skipLink);

skipLink.addEventListener('focus', () => {
    skipLink.style.cssText = `
        position: fixed;
        left: 20px;
        top: 20px;
        width: auto;
        height: auto;
        background: #2563eb;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        z-index: 10000;
    `;
});

skipLink.addEventListener('blur', () => {
    skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
});

// ===== INITIALIZATION =====
/**
 * Initialize all features on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website initialized');
    
    // Add any additional initialization code here
    updateActiveNavLink();
});

// ===== ANALYTICS (Optional) =====
/**
 * Track page views and interactions (requires external service)
 */
function trackEvent(eventName, eventData) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    } else if (typeof plausible !== 'undefined') {
        plausible(eventName, { props: eventData });
    }
    
    // Fallback: log to console for development
    console.log(`Event: ${eventName}`, eventData);
}

// Track page load
trackEvent('page_load', {
    page_path: window.location.pathname,
    page_title: document.title
});

// Track link clicks
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('external_link_click', {
            link_url: link.href,
            link_text: link.textContent
        });
    });
});

// ===== THEME TOGGLE (Optional) =====
/**
 * Toggle between light and dark mode
 */
function toggleTheme() {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Check for system preference
if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
}

// ===== END OF SCRIPT =====
