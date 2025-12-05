function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    if (!themeToggle || !themeIcon) return;

    // single shared toggle for desktop + mobile now
    const mobileToggle = null;

    function persistTheme(theme) {
        try {
            if (typeof BBCookies !== "undefined") {
                BBCookies.set("bb_theme", theme, 365);
            }
        } catch (e) {
            console.warn("BB theme cookie error:", e);
        }
    }

    function readInitialTheme() {
        let theme = null;

        try {
            if (typeof BBCookies !== "undefined") {
                const cookieTheme = BBCookies.get("bb_theme");
                if (cookieTheme === "dark" || cookieTheme === "light") {
                    theme = cookieTheme;
                }
            }
        } catch (e) {}

        if (!theme) {
            const prefersDark = window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? "dark" : "light";
        }

        return theme;
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        persistTheme(theme);
    }

    const initialTheme = readInitialTheme();
    applyTheme(initialTheme);

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    }

    themeToggle.addEventListener('click', toggleTheme);
    if (mobileToggle) mobileToggle.addEventListener('click', toggleTheme);
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
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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
   HEADER INTERACTIONS (extra shrink/hide behavior)
   ============================================================ */

const bbHeader = document.getElementById("bb-header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
    if (!bbHeader) return;

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


/* ============================================================
   LANGUAGE DROPDOWN LOGIC (shared desktop + mobile)
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    const dropdown   = document.querySelector(".bb-lang-dropdown");
    const activeBtn  = document.getElementById("bb-active-lang");
    const activeFlag = document.getElementById("bb-active-flag");
    const activeCode = document.getElementById("bb-active-code");
    const menu       = document.getElementById("bb-lang-menu");

    if (!dropdown || !activeBtn || !activeFlag || !activeCode || !menu) return;

    function setActiveLangUI(lang) {
        const code = (lang || "en").toLowerCase();
        const btn = menu.querySelector(`.bb-lang-option[data-lang="${code}"]`);
        if (!btn) return;

        menu.querySelectorAll(".bb-lang-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const img = btn.querySelector("img");
        if (img) {
            activeFlag.src = img.src;
            activeFlag.alt = img.alt || code.toUpperCase();
        }
        activeCode.textContent = code.toUpperCase();
    }

    // Toggle dropdown
    activeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle("open");
        activeBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Option click
    menu.querySelectorAll(".bb-lang-option").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const lang = btn.dataset.lang;
            setActiveLangUI(lang);
            dropdown.classList.remove("open");
            activeBtn.setAttribute("aria-expanded", "false");

            // Trigger translation using GTranslate's own function
            if (typeof doGTranslate === "function") {
                // GTranslate expects values like "en|fr"
                doGTranslate("en|" + lang);
            } else if (window.gtranslateSettings && typeof window.gtranslateSettings.switchLanguage === "function") {
                window.gtranslateSettings.switchLanguage(lang);
            }

        });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".bb-lang-dropdown")) {
            dropdown.classList.remove("open");
            activeBtn.setAttribute("aria-expanded", "false");
        }
    });

    // Initialise from GTranslate cookie if present
    const match = document.cookie.match(/googtrans=\/[a-z]+\/([a-z]+)/);
    const initialLang = match ? match[1] : (window.gtranslateSettings && window.gtranslateSettings.default_language) || "en";
    setActiveLangUI(initialLang);
});



