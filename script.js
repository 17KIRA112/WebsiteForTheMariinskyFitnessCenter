/**
 * Modern Fitness Website - Interactive JavaScript
 * Мариинский Fitness Club
 */

// ============================================
// DOM Elements
// ============================================
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const contactForm = document.getElementById('contactForm');
const tabBtns = document.querySelectorAll('.tab-btn');
const scheduleDays = document.querySelectorAll('.schedule-day');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const animateElements = document.querySelectorAll('.animate-on-scroll');

// ============================================
// Header Scroll Effect
// ============================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// Mobile Menu
// ============================================
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ============================================
// Smooth Scrolling
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Active Navigation on Scroll
// ============================================
function updateActiveNav() {
    const scrollPos = window.scrollY + header.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav(); // Initial call

// ============================================
// Schedule Tabs
// ============================================
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const day = btn.getAttribute('data-day');
        
        // Remove active classes
        tabBtns.forEach(b => b.classList.remove('active'));
        scheduleDays.forEach(d => d.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding day
        btn.classList.add('active');
        const targetDay = document.getElementById(day);
        if (targetDay) {
            targetDay.classList.add('active');
        }
    });
});

// Set today's schedule as active on page load
function setTodaySchedule() {
    const today = new Date().getDay();
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayId = dayMap[today];
    
    // Remove active from all
    tabBtns.forEach(btn => btn.classList.remove('active'));
    scheduleDays.forEach(day => day.classList.remove('active'));
    
    // Activate today's schedule
    const todayBtn = document.querySelector(`[data-day="${todayId}"]`);
    if (todayBtn) {
        todayBtn.classList.add('active');
        const todaySchedule = document.getElementById(todayId);
        if (todaySchedule) {
            todaySchedule.classList.add('active');
        }
    }
}

// ============================================
// Contact Form
// ============================================
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const phone = formData.get('phone').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    
    // Validation
    if (!name || !phone) {
        showModal('error', 'Ошибка', 'Пожалуйста, заполните имя и телефон');
        return;
    }
    
    if (!validatePhone(phone)) {
        showModal('error', 'Ошибка', 'Пожалуйста, введите корректный номер телефона');
        return;
    }
    
    if (email && !validateEmail(email)) {
        showModal('error', 'Ошибка', 'Пожалуйста, введите корректный email');
        return;
    }
    
    // Simulate form submission (in real app, send to server)
    console.log('Form submitted:', { name, phone, email, message });
    
    // Show success modal
    showModal('success', 'Спасибо!', 'Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 15 минут.');
    
    // Reset form
    contactForm.reset();
});

// Phone validation (Russian format)
function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// Modal System
// ============================================
function showModal(type, title, message) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    
    const icon = type === 'success' ? '✅' : '❌';
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Закрыть">&times;</button>
            <div class="modal-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="btn btn-primary modal-ok">Хорошо</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus trap
    const focusableElements = modal.querySelectorAll('button');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    firstFocusable.focus();
    
    // Close handlers
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
        document.body.style.overflow = '';
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-ok').addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered delay for children
            const parent = entry.target.parentElement;
            if (parent) {
                const siblings = Array.from(parent.children).filter(el => el.classList.contains('animate-on-scroll'));
                siblings.forEach((sibling, index) => {
                    sibling.style.transitionDelay = `${index * 0.1}s`;
                });
            }
            
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animateElements.forEach(el => {
    observer.observe(el);
});

// ============================================
// Gallery Lightbox
// ============================================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const imgSrc = img.src.replace('w=600', 'w=1200').replace('h=400', 'h=800');
        const imgAlt = img.alt;
        
        // Create lightbox
        let lightbox = document.querySelector('.lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.setAttribute('role', 'dialog');
            lightbox.setAttribute('aria-label', 'Просмотр изображения');
            document.body.appendChild(lightbox);
        }
        
        lightbox.innerHTML = `
            <img src="${imgSrc}" alt="${imgAlt}" loading="lazy">
        `;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Close handlers
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        lightbox.addEventListener('click', closeLightbox);
        
        document.addEventListener('keydown', function lbHandler(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', lbHandler);
            }
        });
    });
});

// ============================================
// Phone Number Formatting
// ============================================
const phoneInput = document.querySelector('input[name="phone"]');

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.startsWith('8')) {
                value = '7' + value.slice(1);
            }
            
            if (!value.startsWith('7')) {
                value = '7' + value;
            }
            
            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
            }
            if (value.length > 4) {
                formatted += ') ' + value.slice(4, 7);
            }
            if (value.length > 7) {
                formatted += '-' + value.slice(7, 9);
            }
            if (value.length > 9) {
                formatted += '-' + value.slice(9, 11);
            }
            
            e.target.value = formatted;
        }
    });
}

// ============================================
// Counter Animation
// ============================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Observe stat numbers for animation
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const text = element.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/[0-9]/g, '');
            
            if (!isNaN(number)) {
                element.dataset.suffix = suffix;
                animateCounter(element, number);
            }
            
            statObserver.unobserve(element);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statObserver.observe(stat);
});

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    setTodaySchedule();
    
    // Add smooth entrance animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

// ============================================
// Performance: Debounce scroll events
// ============================================
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

// Use debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    updateActiveNav();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);