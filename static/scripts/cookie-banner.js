document.addEventListener("DOMContentLoaded", function () {

    const STORAGE_KEY = "bbpc_cookie_choice";

    if (localStorage.getItem(STORAGE_KEY)) {
        return; // Already chosen, no banner
    }

    const banner = document.createElement("div");
    banner.id = "bbpc-cookie-banner";
    banner.style.position = "fixed";
    banner.style.bottom = "0";
    banner.style.left = "0";
    banner.style.right = "0";
    banner.style.padding = "18px 22px";
    banner.style.zIndex = "9999";
    banner.style.background = "var(--bb-panel)";
    banner.style.borderTop = "2px solid var(--bb-blue)";
    banner.style.color = "var(--bb-text)";
    banner.style.display = "flex";
    banner.style.flexWrap = "wrap";
    banner.style.alignItems = "center";
    banner.style.justifyContent = "space-between";
    banner.style.gap = "12px";
    banner.style.boxShadow = "0 -4px 20px rgba(0,0,0,0.4)";

    // Localised button styling for cookie banner only
    const bannerStyle = document.createElement("style");
    bannerStyle.textContent = `
        #bbpc-cookie-banner .bbpc-btn {
            padding: 8px 14px;
            font-size: 0.9rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            border: 1px solid var(--bb-blue);
            transition: 0.2s ease;
            white-space: nowrap;
        }
    
        #bbpc-cookie-banner .bbpc-btn-primary {
            background: var(--bb-blue);
            color: #fff;
        }
    
        #bbpc-cookie-banner .bbpc-btn-primary:hover {
            background: #88bbff;
        }
    
        #bbpc-cookie-banner .bbpc-btn-secondary {
            background: transparent;
            color: var(--bb-blue);
        }
    
        #bbpc-cookie-banner .bbpc-btn-secondary:hover {
            background: rgba(102,170,255,0.15);
        }
    `;
    document.head.appendChild(bannerStyle);

    const message = document.createElement("div");
    message.innerHTML = `
        <strong>We use essential cookies to make our site work.</strong>
        We’ll ask before using analytics or anything optional.
    `;

    const btnWrap = document.createElement("div");
    btnWrap.style.display = "flex";
    btnWrap.style.gap = "10px";

    const acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Accept";
    acceptBtn.className = "bbpc-btn bbpc-btn-primary";

    const rejectBtn = document.createElement("button");
    rejectBtn.textContent = "Reject Non-Essential";
    rejectBtn.className = "bbpc-btn bbpc-btn-secondary";

   
    const viewLink = document.createElement("a");
    viewLink.href = "/legal/cookie-policy";
    viewLink.textContent = "View Cookie Policy";
    viewLink.className = "bbpc-btn bbpc-btn-secondary";

    acceptBtn.onclick = () => {
        localStorage.setItem(STORAGE_KEY, "accepted");
        banner.remove();
    };

    rejectBtn.onclick = () => {
        localStorage.setItem(STORAGE_KEY, "rejected");
        banner.remove();
    };

    btnWrap.append(acceptBtn, rejectBtn, viewLink);
    banner.append(message, btnWrap);
    document.body.append(banner);

});

document.addEventListener("DOMContentLoaded", function () {
    const resetBtn = document.getElementById("bbpc-reset-cookie-consent");
    if (!resetBtn) return;

    resetBtn.addEventListener("click", () => {
        // Remove consent cookie
        try {
            if (typeof BBCookies !== "undefined") {
                BBCookies.erase("bb_cookie_consent");
            }
        } catch (e) {}

        // Remove old localStorage value just in case
        localStorage.removeItem("bbpc_cookie_choice");

        // Give user confirmation
        alert("Your cookie preferences have been reset. The cookie banner will appear again on your next page load.");

        // Optional: refresh immediately
        // location.reload();
    });
});

document.addEventListener("DOMContentLoaded", function () {

    // Scroll-to-reset interaction
    const scrollBtn = document.getElementById("bbpc-scroll-to-reset");
    const resetSection = document.getElementById("bbpc-reset-section");

    if (scrollBtn && resetSection) {
        scrollBtn.addEventListener("click", () => {
            resetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

});

