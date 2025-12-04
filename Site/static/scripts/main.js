// Theme toggle functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    if (!themeToggle || !themeIcon) return;

    // Support for mobile theme toggle inside menu
    const mobileToggle = document.getElementById('theme-toggle-mobile');
    
    // Check for saved theme or prefer-color-scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = theme === 'dark' ? '☀️' : '🌙';
        themeIcon.textContent = icon;
        localStorage.setItem('theme', theme);
    }
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }
    
    // Add event listener to theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Add event listener to mobile theme toggle (if exists)
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleTheme);
    }

}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    
    if (!mobileMenuToggle || !headerNav) return;
    
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = mobileMenuToggle.classList.toggle('active');
        headerNav.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isActive);
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.header-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            headerNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-nav') && !e.target.closest('.mobile-menu-toggle') && headerNav.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            headerNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close mobile menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && headerNav.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            headerNav.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Scroll progress functionality
function initializeScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    });
}

// Header scroll behavior
function initializeHeaderScroll() {
    const siteHeader = document.querySelector('.site-header');
    
    if (!siteHeader) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            siteHeader.classList.add('shrink');
        } else {
            siteHeader.classList.remove('shrink');
        }
    });
}

// Make header logo clickable to scroll to top
function initializeHeaderLogo() {
    const headerLogo = document.querySelector('.header-logo');
    
    if (headerLogo) {
        headerLogo.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
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
}

// Initialize all general functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeMobileMenu();
    initializeScrollProgress();
    initializeHeaderScroll();
    initializeHeaderLogo();
    initializeSmoothScrolling();
    
    console.log('BonnieByte PC - General scripts loaded');
});

// Export functions for potential use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTheme,
        initializeMobileMenu,
        initializeScrollProgress,
        initializeHeaderScroll,
        initializeHeaderLogo,
        initializeSmoothScrolling
    };

}

/* ============================================================
   HEADER INTERACTIONS
   ============================================================ */

const bbHeader = document.getElementById("bb-header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
    const current = window.scrollY;

    // Shrink
    if (current > 40) {
        bbHeader.classList.add("shrink");
    } else {
        bbHeader.classList.remove("shrink");
    }

    // Glow
    if (current > 120) {
        bbHeader.classList.add("glow");
    } else {
        bbHeader.classList.remove("glow");
    }

    // Auto-hide
    if (current > lastScroll && current > 150) {
        bbHeader.classList.add("hide");
    } else {
        bbHeader.classList.remove("hide");
    }

    lastScroll = current;
});
