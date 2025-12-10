// ===============================
// THEME TOGGLE
// ===============================
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    if (!themeToggle || !themeIcon) return;

    const mobileToggle = null; // single shared toggle now

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

    // Avoid resetting theme if inline script already set it early
    const current = document.documentElement.getAttribute("data-theme");
    
    if (current) {
        // Theme already applied by inline head script — skip re-apply
        themeIcon.textContent = current === 'dark' ? '☀️' : '🌙';
    } else {
        // Fallback if no theme set (very rare)
        const initialTheme = readInitialTheme();
        applyTheme(initialTheme);
    }



// ===============================
// MOBILE MENU
// ===============================
function initializeMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    const root = document.documentElement;

    if (!mobileMenuToggle || !headerNav) return;

    function closeMenu() {
        mobileMenuToggle.classList.remove('active');
        headerNav.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        root.classList.remove('bb-menu-open');

        // also force-close language dropdown if it was open
        const dropdown = document.querySelector('.bb-lang-dropdown');
        const activeBtn = document.getElementById('bb-active-lang');
        if (dropdown) dropdown.classList.remove('open');
        if (activeBtn) activeBtn.setAttribute('aria-expanded', 'false');
    }

    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = mobileMenuToggle.classList.toggle('active');
        headerNav.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isActive);

        if (isActive) {
            root.classList.add('bb-menu-open');

            // close language dropdown if it happens to be open
            const dropdown = document.querySelector('.bb-lang-dropdown');
            const activeBtn = document.getElementById('bb-active-lang');
            if (dropdown) dropdown.classList.remove('open');
            if (activeBtn) activeBtn.setAttribute('aria-expanded', 'false');
        } else {
            root.classList.remove('bb-menu-open');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.header-nav a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-nav') && !e.target.closest('.mobile-menu-toggle') && headerNav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close mobile menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && headerNav.classList.contains('active')) {
            closeMenu();
        }
    });
}


// ===============================
// SCROLL PROGRESS
// ===============================
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


// ===============================
// SIMPLE HEADER SHRINK
// ===============================
function initializeHeaderScroll() {
    const siteHeader = document.querySelector('.site-header');
    if (!siteHeader) return;
    
    // Disable header shrinking on mobile — permanently shrunk
    if (window.matchMedia("(max-width: 768px)").matches) {
        siteHeader.classList.add("shrink");
        return; // stop header scroll logic entirely on mobile
    }


    window.addEventListener("scroll", () => {
        if (!bbHeader) return;
    
        // Mobile: header always shrunk, never auto-hide
        if (window.matchMedia("(max-width: 768px)").matches) {
            bbHeader.classList.add("shrink");
            bbHeader.classList.remove("hide");
            return;
        }
    
        const current = window.scrollY;
    
        if (current > 40) bbHeader.classList.add("shrink");
        else bbHeader.classList.remove("shrink");
    
        if (current > 120) bbHeader.classList.add("glow");
        else bbHeader.classList.remove("glow");
    
        if (current > lastScroll && current > 150) bbHeader.classList.add("hide");
        else bbHeader.classList.remove("hide");
    
        lastScroll = current;
    });

}


// ===============================
// HEADER LOGO SCROLL TO TOP
// ===============================
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


// ===============================
// SMOOTH ANCHOR SCROLL
// ===============================
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


// ===============================
// DOM READY
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeMobileMenu();
    initializeScrollProgress();
    initializeHeaderScroll();
    initializeHeaderLogo();
    initializeSmoothScrolling();

    console.log('BonnieByte PC - General scripts loaded');
});

// ===============================
// CommonJS export (Node testing/etc.)
// ===============================
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


// ===============================
// EXTRA HEADER INTERACTIONS
// ===============================
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
    const headerEl   = document.getElementById("bb-header");

    if (!dropdown || !activeBtn || !activeFlag || !activeCode || !menu) return;

    function normaliseLang(code) {
        if (!code) return "en";
        return String(code).toLowerCase().split("-")[0]; // "en-GB" -> "en"
    }

    function setActiveLangUI(lang) {
        const code = normaliseLang(lang);
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

    function positionLangMenu() {
        if (!menu) return;

        let topPx = 72; // fallback
        if (headerEl) {
            const rect = headerEl.getBoundingClientRect();
            topPx = rect.bottom;
        }

        menu.style.top = `${topPx}px`;
    }

    // Toggle dropdown
    activeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = !dropdown.classList.contains("open");
        dropdown.classList.toggle("open", isOpen);
        activeBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");

        if (isOpen) {
            positionLangMenu();
        }
    });

    // Re-position on resize while open
    window.addEventListener("resize", () => {
        if (dropdown.classList.contains("open")) {
            positionLangMenu();
        }
    });

    // Option click
    menu.querySelectorAll(".bb-lang-option").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const lang = btn.dataset.lang;

            setActiveLangUI(lang);
            dropdown.classList.remove("open");
            activeBtn.setAttribute("aria-expanded", "false");

            // Persist preference as an essential functional cookie
            try {
                if (typeof BBCookies !== "undefined") {
                    BBCookies.set("bb_lang", lang, 365);
                }
            } catch (err) {
                console.warn("BB lang cookie error:", err);
            }

            // Trigger translation
            if (typeof doGTranslate === "function") {
                doGTranslate(lang);
            } else if (window.gtranslateSettings &&
                       typeof window.gtranslateSettings.switchLanguage === "function") {
                window.gtranslateSettings.switchLanguage(lang);
            }
        });
    });

    // Close dropdown on outside click
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".bb-lang-dropdown")) {
            dropdown.classList.remove("open");
            activeBtn.setAttribute("aria-expanded", "false");
        }
    });

    // --- Initialise from cookies / settings ---

    // 1) Try to read the actual GTranslate cookie (works for /auto/en, /en/en-GB, etc.)
    const gtMatch = document.cookie.match(/googtrans=\/[a-zA-Z-]+\/([a-zA-Z-]+)/);
    let initialLang = "en";

    if (gtMatch && gtMatch[1]) {
        initialLang = normaliseLang(gtMatch[1]);
    } else {
        // 2) Fallback to our bb_lang cookie
        try {
            if (typeof BBCookies !== "undefined") {
                const cookieLang = BBCookies.get("bb_lang");
                if (cookieLang) {
                    initialLang = normaliseLang(cookieLang);
                }
            }
        } catch (err) {
            console.warn("BB lang cookie read error:", err);
        }

        // 3) Fallback to GTranslate config default
        if (!initialLang && window.gtranslateSettings && window.gtranslateSettings.default_language) {
            initialLang = normaliseLang(window.gtranslateSettings.default_language);
        }
    }

    setActiveLangUI(initialLang);

    // Mark language labels as "notranslate" so Google doesn't mangle them
    document.querySelectorAll('.lang-btn span').forEach(el => {
        el.classList.add('notranslate');
    });

    // Remember where user was before going to Support/Docs (for future UX)
    const originLinks = document.querySelectorAll(
        'a.nav-link[href="/support/"], a.nav-link[href="/docs/"]'
    );

    originLinks.forEach(link => {
        link.addEventListener("click", () => {
            try {
                if (typeof bbSetSupportOrigin === "function") {
                    bbSetSupportOrigin(
                        window.location.pathname + window.location.search + window.location.hash
                    );
                }
            } catch (e) {
                console.warn("BB support origin capture failed:", e);
            }
        });
    });
});







