/**
 * Modern Portfolio Website JavaScript
 * Handles navigation, animations, and interactivity
 */

// ===================================
// Utility Functions
// ===================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait = 10, immediate = true) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Check if element is partially in viewport
 */
function isPartiallyInViewport(element, offset = 100) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  return (
    rect.top <= windowHeight - offset &&
    rect.bottom >= offset
  );
}

// ===================================
// Navigation Bar Functionality
// ===================================

/**
 * Handle navbar scroll effect
 */
function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking on a link
  const navLinkItems = navLinks.querySelectorAll('.nav-link');
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Update active nav link based on scroll position
 */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  const scrollPosition = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// ===================================
// Smooth Scrolling
// ===================================

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===================================
// Scroll Animations
// ===================================

/**
 * Initialize fade-in animations on scroll
 */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  function checkFadeElements() {
    fadeElements.forEach(element => {
      if (isPartiallyInViewport(element, 100)) {
        element.classList.add('visible');
      }
    });
  }
  
  // Initial check
  checkFadeElements();
  
  // Check on scroll
  window.addEventListener('scroll', debounce(checkFadeElements, 10));
}

/**
 * Add fade-in class to elements that should animate
 */
function setupAnimationElements() {
  // Add fade-in class to section content
  const sections = document.querySelectorAll('.about, .skills, .projects, .contact');
  sections.forEach(section => {
    const children = section.querySelectorAll('.about-content, .skills-grid, .projects-grid, .contact-content');
    children.forEach(child => {
      child.classList.add('fade-in');
    });
  });
  
  // Add fade-in to individual cards
  const cards = document.querySelectorAll('.skill-category, .project-card, .contact-item');
  cards.forEach((card, index) => {
    card.classList.add('fade-in');
    card.style.transitionDelay = `${index * 0.1}s`;
  });
}

// ===================================
// Project Filtering (for projects.html)
// ===================================

/**
 * Initialize project filtering functionality
 */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (filterButtons.length === 0 || projectCards.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      // Filter projects
      projectCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          const categories = card.getAttribute('data-category');
          if (categories && categories.includes(filter)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        }
      });
    });
  });
}

// ===================================
// Typing Effect for Hero Section
// ===================================

/**
 * Create typing effect for hero subtitle (optional enhancement)
 */
function initTypingEffect() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;
  
  const text = subtitle.textContent;
  const shouldAnimate = subtitle.getAttribute('data-typing') === 'true';
  
  if (!shouldAnimate) return;
  
  subtitle.textContent = '';
  subtitle.style.opacity = '1';
  
  let index = 0;
  const speed = 50; // milliseconds per character
  
  function type() {
    if (index < text.length) {
      subtitle.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }
  
  // Start typing after a short delay
  setTimeout(type, 500);
}

// ===================================
// Form Validation (if contact form is added)
// ===================================

/**
 * Validate contact form
 */
function initFormValidation() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    
    let isValid = true;
    
    // Simple validation
    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      isValid = false;
    }
    
    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email');
      isValid = false;
    }
    
    if (!message.value.trim()) {
      showError(message, 'Please enter a message');
      isValid = false;
    }
    
    if (isValid) {
      // Form is valid, you can submit it or handle it here
      console.log('Form is valid!');
      // form.submit(); // Uncomment to actually submit
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
  const formGroup = input.parentElement;
  const error = formGroup.querySelector('.error-message') || document.createElement('span');
  error.className = 'error-message';
  error.textContent = message;
  error.style.color = 'var(--error-color)';
  error.style.fontSize = '0.875rem';
  error.style.marginTop = '0.25rem';
  error.style.display = 'block';
  
  if (!formGroup.querySelector('.error-message')) {
    formGroup.appendChild(error);
  }
  
  input.style.borderColor = 'var(--error-color)';
  
  // Remove error on input
  input.addEventListener('input', () => {
    error.remove();
    input.style.borderColor = '';
  }, { once: true });
}

// ===================================
// Performance Optimization
// ===================================

/**
 * Lazy load images
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

/**
 * Preload critical images
 */
function preloadImages() {
  const criticalImages = [
    'images/profile.jpg'
    // Add more critical images here
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// ===================================
// Back to Top Button (Optional)
// ===================================

/**
 * Create and handle back to top button
 */
function initBackToTop() {
  // Create button
  const button = document.createElement('button');
  button.innerHTML = '<i class="fas fa-arrow-up"></i>';
  button.className = 'back-to-top';
  button.setAttribute('aria-label', 'Back to top');
  
  // Style button
  button.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    border: none;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-lg);
    z-index: 999;
  `;
  
  document.body.appendChild(button);
  
  // Show/hide button based on scroll
  function toggleBackToTop() {
    if (window.scrollY > 500) {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
    } else {
      button.style.opacity = '0';
      button.style.visibility = 'hidden';
    }
  }
  
  window.addEventListener('scroll', debounce(toggleBackToTop, 10));
  
  // Scroll to top on click
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Hover effect
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-5px)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
  });
}

// ===================================
// Theme Toggle (Optional Dark Mode)
// ===================================

/**
 * Initialize theme toggle functionality
 * Uncomment if you want to add dark mode support
 */
/*
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}
*/

// ===================================
// Initialize Everything
// ===================================

/**
 * Main initialization function
 */
function init() {
  // Navigation
  initMobileMenu();
  handleNavbarScroll();
  updateActiveNavLink();
  
  // Scrolling
  initSmoothScrolling();
  
  // Animations
  setupAnimationElements();
  initScrollAnimations();
  
  // Project filtering (for projects.html)
  initProjectFiltering();
  
  // Optional features
  initBackToTop();
  // initTypingEffect(); // Uncomment if you want typing effect
  // initFormValidation(); // Uncomment if you add a contact form
  // initLazyLoading(); // Uncomment if you use lazy loading
  
  // Performance
  preloadImages();
  
  console.log('Portfolio website initialized successfully! 🚀');
}

// ===================================
// Event Listeners
// ===================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle scroll events
window.addEventListener('scroll', debounce(() => {
  handleNavbarScroll();
  updateActiveNavLink();
}, 10));

// Handle resize events
window.addEventListener('resize', debounce(() => {
  // Add any resize-specific logic here
}, 250));

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden
    console.log('Page hidden');
  } else {
    // Page is visible
    console.log('Page visible');
  }
});

// ===================================
// Export functions for external use (if needed)
// ===================================

// If you want to use these functions elsewhere, you can export them
// window.PortfolioJS = {
//   debounce,
//   isInViewport,
//   isPartiallyInViewport
// };

