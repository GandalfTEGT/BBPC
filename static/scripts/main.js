// ============================================================
// BONNIEBYTE PC — MAIN (STABLE FULL REBUILD)
// Restores all original functionality + fixes language/extended bugs
// ============================================================


// ===============================
// THEME TOGGLE
// ===============================
function initializeTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle?.querySelector(".theme-icon");
  if (!themeToggle || !themeIcon) return;

  function persistTheme(theme) {
    // Save to localStorage (used by inline <head> script)
    try {
      localStorage.setItem("bb-theme", theme);
    } catch (e) {
      console.warn("BB theme localStorage error:", e);
    }

    // Also mirror into bb_theme cookie (for your existing helpers)
    try {
      if (typeof BBCookies !== "undefined") {
        BBCookies.set("bb_theme", theme, 365);
      }
    } catch (e) {
      console.warn("BB theme cookie error:", e);
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    document.documentElement.classList.toggle("theme-light", theme === "light");

    persistTheme(theme);
  }

  // 1) Read what the inline <head> script already set (no flash)
  let current = document.documentElement.getAttribute("data-theme");

  // 2) If missing, derive a sensible default
  if (!current) {
    // Try localStorage first
    try {
      const stored = localStorage.getItem("bb-theme");
      if (stored === "dark" || stored === "light") current = stored;
    } catch (e) {}

    // Try cookie as secondary source
    if (!current) {
      try {
        if (typeof BBCookies !== "undefined") {
          const cookieTheme = BBCookies.get("bb_theme");
          if (cookieTheme === "dark" || cookieTheme === "light") {
            current = cookieTheme;
          }
        }
      } catch (e) {}

      // Fall back to OS preference
      if (!current) {
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        current = prefersDark ? "dark" : "light";
      }
    }

    applyTheme(current);
  } else {
    document.documentElement.classList.toggle("theme-dark", current === "dark");
    document.documentElement.classList.toggle("theme-light", current === "light");
    persistTheme(current);
  }

  // Click toggle
  themeToggle.addEventListener("click", () => {
    const active = document.documentElement.getAttribute("data-theme") || "dark";
    const next = active === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}


// ===============================
// MOBILE MENU
// ===============================
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const headerNav = document.querySelector(".header-nav");
  const root = document.documentElement;

  if (!mobileMenuToggle || !headerNav) return;

  function closeMenu() {
    mobileMenuToggle.classList.remove("active");
    headerNav.classList.remove("active");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    root.classList.remove("bb-menu-open");

    // Force close language dropdowns if open
    const dropdown = document.querySelector(".bb-lang-dropdown");
    const activeBtn = document.getElementById("bb-active-lang");
    const extended = document.querySelector(".bb-lang-extended");

    if (dropdown) dropdown.classList.remove("open");
    if (activeBtn) activeBtn.setAttribute("aria-expanded", "false");

    if (extended) {
      extended.classList.remove("open");
      extended.setAttribute("aria-hidden", "true");
    }
  }

  mobileMenuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = mobileMenuToggle.classList.toggle("active");
    headerNav.classList.toggle("active");

    mobileMenuToggle.style.display = "flex";
    mobileMenuToggle.setAttribute("aria-expanded", isActive);

    if (isActive) {
      root.classList.add("bb-menu-open");

      // Close language dropdown(s) if open
      const dropdown = document.querySelector(".bb-lang-dropdown");
      const activeBtn = document.getElementById("bb-active-lang");
      const extended = document.querySelector(".bb-lang-extended");

      if (dropdown) dropdown.classList.remove("open");
      if (activeBtn) activeBtn.setAttribute("aria-expanded", "false");

      if (extended) {
        extended.classList.remove("open");
        extended.setAttribute("aria-hidden", "true");
      }
    } else {
      root.classList.remove("bb-menu-open");
    }
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".header-nav a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".header-nav") &&
      !e.target.closest(".mobile-menu-toggle") &&
      headerNav.classList.contains("active")
    ) {
      closeMenu();
    }
  });

  // Close mobile menu when pressing Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && headerNav.classList.contains("active")) {
      closeMenu();
    }
  });
}


// ===============================
// SCROLL PROGRESS
// ===============================
function initializeScrollProgress() {
  const scrollProgress = document.querySelector(".scroll-progress");
  if (!scrollProgress) return;

  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    const denom = (documentHeight - windowHeight) || 1;
    const scrollPercent = (scrollTop / denom) * 100;

    scrollProgress.style.width = Math.max(0, Math.min(100, scrollPercent)) + "%";
  });
}


// ===============================
// SIMPLE HEADER SHRINK (MOBILE DEFAULT)
// ===============================
function initializeHeaderScroll() {
  const siteHeader = document.querySelector(".site-header");
  if (!siteHeader) return;

  // Disable header shrinking on mobile — permanently shrunk
  if (window.matchMedia("(max-width: 768px)").matches) {
    siteHeader.classList.add("shrink");
  }
}


// ===============================
// HEADER LOGO SCROLL TO TOP
// ===============================
function initializeHeaderLogo() {
  const headerLogo = document.querySelector(".header-logo");
  if (!headerLogo) return;

  headerLogo.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


// ===============================
// SMOOTH ANCHOR SCROLL
// ===============================
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}


// ===============================
// EXTRA HEADER INTERACTIONS (shrink/glow/hide)
// ===============================
function initializeHeaderEffects() {
  const bbHeader = document.getElementById("bb-header");
  if (!bbHeader) return;

  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.scrollY;

    // Shrink
    if (current > 40) bbHeader.classList.add("shrink");
    else bbHeader.classList.remove("shrink");

    // Glow
    if (current > 120) bbHeader.classList.add("glow");
    else bbHeader.classList.remove("glow");

    // Auto-hide (only if mobile menu not open)
    if (!document.documentElement.classList.contains("bb-menu-open")) {
      if (current > lastScroll && current > 60) bbHeader.classList.add("hide");
      else bbHeader.classList.remove("hide");
    }

    lastScroll = current;
  });
}


/* ============================================================
   LANGUAGE DROPDOWN LOGIC (primary + extended) — FIXED
   Requirements:
   - primary menu: #bb-lang-menu inside .bb-lang-dropdown
   - active button: #bb-active-lang, with #bb-active-flag + #bb-active-code
   - extended menu: .bb-lang-extended (can be anywhere; moved to mobile bar ok)
   - "More" button: .bb-lang-more
   - "Back" button: .bb-lang-back
   - language buttons have: data-lang="xx" (and ideally class bb-lang-option/lang-btn)
============================================================ */
function initializeLanguageSelector() {
  const dropdown   = document.querySelector(".bb-lang-dropdown");
  const activeBtn  = document.getElementById("bb-active-lang");
  const activeFlag = document.getElementById("bb-active-flag");
  const activeCode = document.getElementById("bb-active-code");
  const menu       = document.getElementById("bb-lang-menu");
  const headerEl   = document.getElementById("bb-header");

  const extended   = document.querySelector(".bb-lang-extended");
  const moreBtn    = document.querySelector(".bb-lang-more");
  const backBtn    = document.querySelector(".bb-lang-back");

  if (!dropdown || !activeBtn || !menu || !headerEl) return;

  function normaliseLang(code) {
    if (!code) return "en";
    return String(code).toLowerCase().split("-")[0];
  }

  function positionUnderHeader(el) {
    if (!el) return;
    const rect = headerEl.getBoundingClientRect();
    el.style.top = `${rect.bottom}px`;
  }

  function closePrimary() {
    dropdown.classList.remove("open");
    activeBtn.setAttribute("aria-expanded", "false");
  }

  function openPrimary() {
    dropdown.classList.add("open");
    activeBtn.setAttribute("aria-expanded", "true");
    positionUnderHeader(menu);
  }

  function closeExtended() {
    if (!extended) return;
    extended.classList.remove("open");
    extended.setAttribute("aria-hidden", "true");
  }

  function openExtended() {
    if (!extended) return;
    closePrimary();
    extended.classList.add("open");
    extended.setAttribute("aria-hidden", "false");
    positionUnderHeader(extended);
  }

  function setActiveLangUI(lang) {
    const code = normaliseLang(lang);

    // Find the matching button in either menu
    const btn =
      menu.querySelector(`[data-lang="${code}"]`) ||
      (extended ? extended.querySelector(`[data-lang="${code}"]`) : null);

    if (btn) {
      // Active highlight only applies to primary options (keep your current behaviour)
      menu.querySelectorAll(".bb-lang-option").forEach(b => b.classList.remove("active"));
      const primaryBtn = menu.querySelector(`.bb-lang-option[data-lang="${code}"]`);
      if (primaryBtn) primaryBtn.classList.add("active");

      const img = btn.querySelector("img");
      if (img && activeFlag) {
        activeFlag.src = img.src;
        activeFlag.alt = img.alt || code.toUpperCase();
      }
    }

    if (activeCode) activeCode.textContent = code.toUpperCase();
  }

  function applyLanguage(lang) {
    const target = normaliseLang(lang);
  
    // Update UI
    setActiveLangUI(target);
  
    // Persist choice
    try {
      if (typeof BBCookies !== "undefined") {
        BBCookies.set("bb_lang", target, 365);
      }
    } catch (err) {
      console.warn("BB lang cookie error:", err);
    }
  
    // Trigger Google Translate
    if (typeof doGTranslate === "function") {
      doGTranslate(target);
    } else if (
      window.gtranslateSettings &&
      typeof window.gtranslateSettings.switchLanguage === "function"
    ) {
      window.gtranslateSettings.switchLanguage(target);
    } else {
      console.warn("GTranslate not ready");
    }
  }




  // Toggle dropdown
  activeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains("open");
    if (isOpen) openPrimary();
    else closePrimary();
  });

  // More → Extended
  if (moreBtn && extended) {
    moreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openExtended();
    });
  }

  // Back
  if (backBtn && extended) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeExtended();
    });
  }

  // Click a language in primary menu
  menu.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const lang = btn.dataset.lang;
      if (!lang) return;
      applyLanguage(lang);
      closePrimary();
      closeExtended();
    });
  });

  // Click a language in extended menu
  if (extended) {
    extended.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const lang = btn.dataset.lang;
        if (!lang) return;
        applyLanguage(lang);
        closePrimary();
        closeExtended();
      });
    });
  }

  // Re-position menus on resize if open
  window.addEventListener("resize", () => {
    if (dropdown.classList.contains("open")) positionUnderHeader(menu);
    if (extended && extended.classList.contains("open")) positionUnderHeader(extended);
  });

  // Close dropdowns on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".bb-lang-dropdown") && !e.target.closest(".bb-lang-extended")) {
      closePrimary();
      closeExtended();
    }
  });

  // Escape closes menus
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePrimary();
      closeExtended();
    }
  });

  // Initialise from cookies / GTranslate cookie
  const gtMatch = document.cookie.match(/googtrans=\/[a-zA-Z-]+\/([a-zA-Z-]+)/);
  let initialLang = "en";

  if (gtMatch && gtMatch[1]) {
    initialLang = normaliseLang(gtMatch[1]);
  } else {
    try {
      if (typeof BBCookies !== "undefined") {
        const cookieLang = BBCookies.get("bb_lang");
        if (cookieLang) initialLang = normaliseLang(cookieLang);
      }
    } catch (err) {
      console.warn("BB lang cookie read error:", err);
    }

    if (!initialLang && window.gtranslateSettings?.default_language) {
      initialLang = normaliseLang(window.gtranslateSettings.default_language);
    }
  }

  setActiveLangUI(initialLang);

  // Ensure language labels are notranslate
  document.querySelectorAll(".lang-btn span").forEach((el) => {
    el.classList.add("notranslate");
  });

  // Remember origin before going to Support/Docs (if helper exists)
  const originLinks = document.querySelectorAll(
    'a.nav-link[href="/support/"], a.nav-link[href="/docs/"]'
  );

  originLinks.forEach((link) => {
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
}


// ===============================
// MOBILE HEADER ACTIONS (MOVE THEME/LANG INTO ACCOUNT BAR)
// ===============================
function initializeMobileHeaderActions() {
  const actionsSlot = document.getElementById("mobile-account-actions");
  const themeBtn = document.getElementById("theme-toggle");
  const langDropdown = document.querySelector(".bb-lang-dropdown");
  const desktopHost = document.querySelector(".header-actions-primary");

  if (!actionsSlot || !themeBtn || !langDropdown || !desktopHost) return;

  // Remember original positions
  const themeHome = { parent: themeBtn.parentNode, next: themeBtn.nextSibling };
  const langHome = { parent: langDropdown.parentNode, next: langDropdown.nextSibling };

  // Extended menu may exist elsewhere; if it exists, we want it available on mobile too
  const extended = document.querySelector(".bb-lang-extended");
  const extendedHome = extended ? { parent: extended.parentNode, next: extended.nextSibling } : null;

  function moveIntoMobileBar() {
    actionsSlot.appendChild(themeBtn);
    actionsSlot.appendChild(langDropdown);
    if (extended) actionsSlot.appendChild(extended);
  }

  function restoreToDesktop() {
    if (themeHome.parent) themeHome.parent.insertBefore(themeBtn, themeHome.next);
    if (langHome.parent) langHome.parent.insertBefore(langDropdown, langHome.next);

    if (extended && extendedHome?.parent) {
      extendedHome.parent.insertBefore(extended, extendedHome.next);
    }
  }

  const mq = window.matchMedia("(max-width: 1250px)");

  function apply(e) {
    if (e.matches) moveIntoMobileBar();
    else restoreToDesktop();
  }

  // Initial
  apply(mq);

  // Listen for changes
  if (typeof mq.addEventListener === "function") mq.addEventListener("change", apply);
  else mq.addListener(apply);
}


// ===============================
// PRODUCT GALLERY
// ===============================
function initializeProductGallery() {
  const mainImage = document.getElementById("product-main-image");
  const thumbs = document.querySelectorAll(".product-thumb");

  if (!mainImage || thumbs.length === 0) return;

  const galleryMain = document.querySelector(".product-gallery-main");

  thumbs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-image");
      if (!src) return;

      mainImage.src = src;

      thumbs.forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Hover zoom follow cursor (desktop only)
  if (galleryMain && mainImage && window.matchMedia("(hover: hover)").matches) {
    galleryMain.addEventListener("mousemove", (e) => {
      const rect = galleryMain.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mainImage.style.transformOrigin = `${x}% ${y}%`;
    });

    galleryMain.addEventListener("mouseleave", () => {
      mainImage.style.transformOrigin = "center center";
    });
  }

  // CLICK TO OPEN IMAGE MODAL
  const modal = document.querySelector(".bb-image-modal");
  const modalImg = document.getElementById("bb-image-modal-img");
  if (!modal || !modalImg) return;

  mainImage.addEventListener("click", () => {
    modalImg.src = mainImage.src;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
    document.body.style.overflow = "";
  }

  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-modal-close")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });
}


// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();
  initializeMobileMenu();
  initializeMobileHeaderActions();

  initializeScrollProgress();
  initializeHeaderScroll();
  initializeHeaderLogo();
  initializeSmoothScrolling();
  initializeHeaderEffects();

  initializeLanguageSelector();
  initializeProductGallery();

  console.log("BonnieByte PC - General scripts loaded");
});


// ===============================
// CommonJS export (Node testing/etc.)
// ===============================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializeTheme,
    initializeMobileMenu,
    initializeMobileHeaderActions,
    initializeScrollProgress,
    initializeHeaderScroll,
    initializeHeaderLogo,
    initializeSmoothScrolling,
    initializeHeaderEffects,
    initializeLanguageSelector,
    initializeProductGallery
  };
}



