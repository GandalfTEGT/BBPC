// Homepage specific functionality
function initializeHomepage() {
    initializeMailerLiteEnhanced();
    initializeLazyLoading();
    initializeHomepageAnimations();
}

/* ============================================================
   MAILERLITE – Enhanced Form Handling (Success UI + Loader)
   ============================================================ */
function initializeMailerLiteEnhanced() {
    const form = document.querySelector(".bb-form");
    if (!form) return;

    const submitBtn    = form.querySelector(".bb-submit-btn");
    const btnText      = form.querySelector(".bb-btn-text");
    const btnLoader    = form.querySelector(".bb-btn-loader");
    const successMsg   = form.querySelector(".bb-success-message");
    const errorMsg     = form.querySelector(".bb-error-message");
    const emailField   = form.querySelector('input[name="fields[email]"]');
    const recaptchaRow = form.querySelector(".ml-form-recaptcha");
    const iframe       = document.querySelector('iframe[name="ml_iframe"]');

    // Hide messages by default
    if (successMsg) successMsg.style.display = "none";
    if (errorMsg)   errorMsg.style.display   = "none";

    // Show reCAPTCHA only after user starts typing
    if (emailField) {
        emailField.addEventListener("input", () => {
            if (recaptchaRow) recaptchaRow.style.display = "block";
            if (successMsg) successMsg.style.display = "none";
            if (errorMsg)   errorMsg.style.display   = "none";
        });
    }

    // On submit → show loader, let normal POST happen into hidden iframe
    form.addEventListener("submit", function () {
        if (successMsg) successMsg.style.display = "none";
        if (errorMsg)   errorMsg.style.display   = "none";

        if (btnText && btnLoader) {
            btnText.style.display   = "none";
            btnLoader.style.display = "inline-block";
        }
        // IMPORTANT: do NOT preventDefault.
        // The form posts to MailerLite and the response lands in the hidden iframe.
    });

    // When the hidden iframe loads, treat it as a successful submission
    if (iframe) {
        iframe.addEventListener("load", function () {
            // Stop loader
            if (btnText && btnLoader) {
                btnLoader.style.display = "none";
                btnText.style.display   = "inline";
            }

            // Show success UI
            if (successMsg) successMsg.style.display = "block";
            if (errorMsg)   errorMsg.style.display   = "none";

            // Reset form inputs
            form.reset();

            // Reset reCAPTCHA if available
            if (typeof grecaptcha !== "undefined") {
                try {
                    grecaptcha.reset();
                } catch (e) {
                    console.warn("reCAPTCHA reset error:", e);
                }
            }

            // Hide captcha again until user starts typing
            if (recaptchaRow) {
                recaptchaRow.style.display = "none";
            }
        });
    }
}

/* ============================================================
   Lazy loading for product images (placeholder)
   ============================================================ */
function initializeLazyLoading() {
    const productImage = document.querySelector(".product-image");
    if (productImage && !productImage.style.backgroundImage) {
        productImage.style.background =
            '#ddd url("https://via.placeholder.com/500x300/6633FF/ffffff?text=BonnieByte+Fans") center/cover';
    }
}

/* ============================================================
   Homepage animations
   ============================================================ */
function initializeHomepageAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll("section").forEach(section => {
        section.style.opacity    = "0";
        section.style.transform  = "translateY(20px)";
        section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(section);
    });
}

// Initialize homepage when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    initializeHomepage();
    console.log("BonnieByte PC - Homepage scripts loaded");
});

// CommonJS export (for bundlers)
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        initializeHomepage,
        initializeMailerLiteEnhanced,
        initializeLazyLoading,
        initializeHomepageAnimations
    };
}
