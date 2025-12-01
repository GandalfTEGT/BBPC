// Homepage specific functionality
function initializeHomepage() {
    initializeMailerLiteEnhanced();   // REPLACED
    initializeLazyLoading();
    initializeHomepageAnimations();
}

/* ============================================================
   MAILERLITE – Enhanced Form Handling (Success UI + Loader)
   ============================================================ */
function initializeMailerLiteEnhanced() {
    const form = document.querySelector(".bb-form");
    if (!form) return;

    const submitBtn = form.querySelector(".bb-submit-btn");
    const btnText = form.querySelector(".bb-btn-text");
    const btnLoader = form.querySelector(".bb-btn-loader");
    const successMsg = form.querySelector(".bb-success-message");
    const errorMsg = form.querySelector(".bb-error-message");
    const emailField = form.querySelector("input[name='fields[email]']");

    // Hide messages when typing
    emailField.addEventListener("input", () => {
        successMsg.style.display = "none";
        errorMsg.style.display = "none";
    });

    // STOP normal submission
    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // ⛔ block MailerLite redirect

        // Show loader
        btnText.style.display = "none";
        btnLoader.style.display = "inline-block";

        const email = emailField.value.trim();
        if (!email) return;

        // Build MailerLite JSON API URL
        const url =
            "https://assets.mailerlite.com/jsonp/1908727/forms/170605338066682928/subscribe";

        const formData = new FormData();
        formData.append("fields[email]", email);
        formData.append("ml-submit", "1");
        formData.append("anticsrf", "true");

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
                mode: "no-cors"
            });

            // MailerLite JSONP can't return JSON in no-cors mode.
            // So we assume success unless an exception occurred.

            successMsg.style.display = "block";
            errorMsg.style.display = "none";
            form.reset();

        } catch (err) {
            console.error("MailerLite error:", err);
            errorMsg.style.display = "block";
            successMsg.style.display = "none";
        }

        // Reset loader
        btnLoader.style.display = "none";
        btnText.style.display = "inline";
    });
}


// Lazy loading for product images
function initializeLazyLoading() {
    const productImage = document.querySelector('.product-image');
    if (productImage && !productImage.style.backgroundImage) {
        productImage.style.background =
            '#ddd url("https://via.placeholder.com/500x300/6633FF/ffffff?text=BonnieByte+Fans") center/cover';
    }
}

// Homepage animations
function initializeHomepageAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Initialize homepage when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
    console.log('BonnieByte PC - Homepage scripts loaded');
});

// CommonJS export (for bundlers)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeHomepage,
        initializeMailerLiteEnhanced,
        initializeLazyLoading,
        initializeHomepageAnimations
    };
}

