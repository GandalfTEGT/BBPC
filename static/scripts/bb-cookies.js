// ============================================================
// BONNIEBYTE PC - ESSENTIAL COOKIE MANAGER
// Location: /static/scripts/bb-cookies.js
// Handles ONLY functional, non-tracking cookies.
// ============================================================

const BB_COOKIE_DEFAULT_DAYS = 365;

const BBCookies = {
    set(name, value, days = BB_COOKIE_DEFAULT_DAYS, options = {}) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};`;
        cookie += `expires=${date.toUTCString()};`;
        cookie += `path=/;`;
        cookie += `SameSite=Lax;`;

        // For GitHub Pages you’re on HTTPS via your custom domain, so secure is fine.
        if (options.secure !== false) {
            cookie += `secure;`;
        }

        document.cookie = cookie;
    },

    get(name) {
        const cookies = document.cookie ? document.cookie.split("; ") : [];
        for (const c of cookies) {
            const [k, ...vParts] = c.split("=");
            if (decodeURIComponent(k) === name) {
                return decodeURIComponent(vParts.join("="));
            }
        }
        return null;
    },

    erase(name) {
        document.cookie =
            `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax;secure;`;
    }
};

// Simple cryptographically strong random hex generator
function bbRandomHex(bytes = 16) {
    const arr = new Uint8Array(bytes);
    if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(arr);
    } else {
        for (let i = 0; i < bytes; i++) {
            arr[i] = Math.floor(Math.random() * 256);
        }
    }
    return Array.from(arr)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// ============================================================
// 1. Session cookie – anonymous, for future features
// ============================================================
(function initSessionCookie() {
    try {
        if (!BBCookies.get("bb_session_id")) {
            const sid = bbRandomHex(16); // 128-bit ID
            BBCookies.set("bb_session_id", sid, 1); // 1 day "session-ish"
        }
    } catch (e) {
        console.warn("BB session cookie failed:", e);
    }
})();

// ============================================================
// 2. CSRF token cookie – front-end scaffold for future forms
// (Backend must validate this later when you add POST endpoints.)
// ============================================================
(function initCSRFCookie() {
    try {
        if (!BBCookies.get("bb_csrf")) {
            const token = bbRandomHex(32); // 256-bit
            BBCookies.set("bb_csrf", token, 2);
        }
    } catch (e) {
        console.warn("BB CSRF cookie failed:", e);
    }
})();

// ============================================================
// 3. Language preference – future-proofing
// ============================================================
(function initLanguageCookie() {
    try {
        const existing = BBCookies.get("bb_lang");
        if (existing) return;

        const browserLang = (navigator.language || "en").toLowerCase();
        let lang = "en";

        if (browserLang.startsWith("de")) lang = "de";
        else if (browserLang.startsWith("fr")) lang = "fr";
        else if (browserLang.startsWith("es")) lang = "es";

        BBCookies.set("bb_lang", lang, 365);
    } catch (e) {
        console.warn("BB language cookie failed:", e);
    }
})();

// ============================================================
// 4. Operational banner helpers (non-marketing, essential UX)
// ============================================================
function bbDismissBanner(id, days = 30) {
    try {
        if (!id) return;
        BBCookies.set(`bb_banner_${id}`, "1", days);
    } catch (e) {
        console.warn("BB banner cookie failed:", e);
    }
}

function bbIsBannerDismissed(id) {
    try {
        if (!id) return false;
        return BBCookies.get(`bb_banner_${id}`) === "1";
    } catch (e) {
        return false;
    }
}

// ============================================================
// 5. Support context helpers (remember where user came from)
// ============================================================
function bbSetSupportOrigin(path) {
    try {
        if (!path) return;
        // Keep it short and simple
        const value = String(path).slice(0, 200);
        BBCookies.set("bb_support_origin", value, 1);
    } catch (e) {
        console.warn("BB support origin cookie failed:", e);
    }
}

function bbGetSupportOrigin() {
    try {
        return BBCookies.get("bb_support_origin");
    } catch (e) {
        return null;
    }
}

function bbClearSupportOrigin() {
    try {
        BBCookies.erase("bb_support_origin");
    } catch (e) {
        console.warn("BB clear support origin failed:", e);
    }
}
