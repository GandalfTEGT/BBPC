---
layout: default
title: Home | BonnieByte PC
---
<section class="hero hero--primary" id="home">
    <div class="container hero-inner">
        <div class="hero-main">
            <picture>
                <source srcset="/images/LogoDetail.webp" type="image/webp">
                <img src="/images/LogoDetail.png" alt="BonnieByte PC" class="hero-logo">
            </picture>
            <p class="hero-tagline"><span class="orbitron">Certified Performance, Crafted with Scottish Pride.</span></p>
            <p class="hero-subtitle">
                Beautiful, high-performance PC cooling without the premium price tag. 
                UKCA-ready, value-focused, and built for real-world rigs.
            </p>
            <div class="hero-cta-group">
                <a href="#notify" class="button button-secondary">Notify Me at Launch</a>
                <a href="/products" class="button button-secondary">View First Product</a>
            </div>
            <div class="hero-meta">
                <span>UK-Based • 2-Year Warranty • Local Support</span>
            </div>
        </div>
        <div class="hero-highlight">
            <div class="hero-highlight-card">
                <h2>Launching Soon</h2>
                <p>Our debut <span class="orbitron notranslate">NORTHERN WIND</span> ARGB fan bundle is almost ready. Be first in line for launch-day pricing and early stock.</p>
                <ul class="hero-list">
                    <li><span class="orbitron notranslate">NORTHERN WIND</span>5× 120mm ARGB fans</li>
                    <li>Included control hub</li>
                    <li>Addressable lighting support</li>
                    <li>Quiet performance-focused design</li>
                </ul>
                <a href="#products" class="text-link">Learn more ↓</a>
            </div>
        </div>
    </div>
</section>
<!-- Brand Pillars -->
<section class="pillars" aria-label="Brand pillars">
    <div class="container pillars-inner">
        <div class="pillar">
            <h3>Certified Performance</h3>
            <p>Engineered to meet modern quality standards with a focus on airflow, acoustics, and reliability.</p>
        </div>
        <div class="pillar">
            <h3>Crafted with Scottish Pride</h3>
            <p>Designed in Scotland by a PC enthusiast who cares about every detail, inside and out.</p>
        </div>
        <div class="pillar">
            <h3>Beautiful, Not Overpriced</h3>
            <p>Clean aesthetics, addressable RGB, and thoughtful packaging — without the “RGB tax”.</p>
        </div>
        <div class="pillar">
            <h3>2-Year </h3>
            <p>We stand behind our products with a straightforward 2-year  and responsive support.</p>
        </div>
    </div>
</section>
<!-- Products -->
<section class="section section-products" id="products">
    <div class="container">
        <header class="section-header">
            <h2>Our First Product</h2>
            <p>Focused on the essentials: airflow, aesthetics, and reliability.</p>
        </header>
        <div class="product-grid">
            {% for product in site.data.products %}
              {% assign id = product[0] %}
              {% assign p = product[1] %}
              {% if p.featured == true %}
                <article class="product-card">
                  <a href="/products/{{ id }}/" class="product-media">
                    <img src="{{ p.thumbnail }}" alt="{{ p.full_name }}" class="product-image">
                  </a>
                  <div class="product-body">
                    <h3>
                      <a href="/products/{{ id }}/">
                        <span class="orbitron notranslate">{{ p.short_name | upcase }}</span>
                        {{ p.full_name | replace: p.short_name, '' }}
                      </a>
                    </h3>
                    <p>{{ p.description }}</p>
                    <ul class="product-features">
                      {% for f in p.features %}
                        <li>{{ f }}</li>
                      {% endfor %}
                    </ul>
                    <div class="product-badges">
                      {% if p.ukca %}<span>UKCA Ready</span>{% endif %}
                      {% if p.warranty_enabled %}<span>{{ p.warranty_length }}</span>{% endif %}
                      {% if p.status %}<span>{{ p.status }}</span>{% endif %}
                    </div>
                    <div class="button-group">
                      {% if p.amazon_url %}
                        <a href="{{ p.amazon_url }}" class="button button-secondary" target="_blank">Buy on Amazon UK</a>
                      {% endif %}
                      <a href="/products/{{ id }}/" class="button button-secondary">View Details</a>
                    </div>
                  </div>
                </article>
              {% endif %}
            {% endfor %}
        </div>
    </div>
</section>
<!-- Why BonnieByte -->
<section class="section section-why" id="why">
    <div class="container">
        <header class="section-header">
            <h2>Why <span class="orbitron">BonnieByte PC</span>?</h2>
            <p>Because you shouldn’t have to choose between sketchy no-name parts and overpriced big brands.</p>
        </header>
        <div class="why-grid">
            <div class="why-item">
                <h3>Honest Value</h3>
                <p>No fake specs, no inflated ratings, no nonsense. Just clear performance and fair pricing.</p>
            </div>
            <div class="why-item">
                <h3>Thoughtful Design</h3>
                <p>From the fan curve to the foam inserts in the box, every detail is considered for a better experience.</p>
            </div>
            <div class="why-item">
                <h3>Community Driven</h3>
                <p>Built by someone who actually builds PCs. Feedback from real users shapes every revision.</p>
            </div>
            <div class="why-item">
                <h3>Support That Cares</h3>
                <p>UK-based support via <a href="mailto:support@bonniebytepc.com">support@bonniebytepc.com</a> and <a href="mailto:help@bonniebytepc.com">help@bonniebytepc.com</a>.</p>
            </div>
        </div>
    </div>
</section>
<!-- Our Story -->
<section class="section section-story" id="story">
    <div class="container">
        <header class="section-header">
            <h2>Our Story</h2>
        </header>
        <div class="story-body">
            <p>
                <span class="orbitron">BonnieByte PC</span> was founded by a PC enthusiast in Scotland who was tired of the same choice:
                pay over the odds for a big logo, or gamble on low-quality generics.
            </p>
            <p>
                <strong>“Bonnie”</strong> is a Scottish word for beautiful. It represents what we’re aiming for:
                hardware that looks good, feels good, and performs properly — without draining your wallet.
            </p>
            <p>
                Every product we design is built around three pillars:
                <em>performance, presentation, and price.</em> If it doesn’t satisfy all three, it doesn’t wear the BonnieByte name.
            </p>
        </div>
    </div>
</section>
<!--  / Support Summary -->
<section class="section section-warranty" id="warranty">
    <div class="container">
        <header class="section-header">
            <h2>Warranty & Support</h2>
            <p>Simple, fair, and in plain English.</p>
        </header>
        <div class="warranty-grid">
            <div class="warranty-card">
                <h3>2-Year Warranty</h3>
                <p>
                    All <span class="orbitron">BonnieByte PC</span> products are backed by a 2-year warranty against manufacturing defects,
                    so you can build with confidence.
                </p>
            </div>
            <div class="warranty-card">
                <h3>Easy Replacements</h3>
                <p>
                    If something isn’t right, we’ll work with you to troubleshoot — and if needed, arrange a replacement
                    as quickly as possible.
                </p>
            </div>
            <div class="warranty-card">
                <h3>Local Support</h3>
                <p>
                    UK-based email support from real humans, not scripted bots. Reach us at 
                    <a href="mailto:help@bonniebytepc.com">help@bonniebytepc.com</a>.
                </p>
            </div>
        </div>
        <p class="warranty-link">
            For full warranty details, please see our dedicated <a href="/warranty">Warranty Information</a> page.
        </p>
    </div>
</section>
<!-- Email Signup / Updates -->
<section class="section section-signup" id="notify">
    <div class="container">
        <header class="section-header">
            <h2>Be the First to Know</h2>
            <p>Get launch updates, behind-the-scenes progress, and an exclusive launch discount.</p>
        </header>
        <div class="signup-wrapper">
            <div id="mlb2-33119374"
                 class="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-33119374">
                <div class="ml-form-align-center">
                    <div class="ml-form-embedWrapper embedForm">
                        <div class="ml-form-embedBody ml-form-embedBodyDefault row-form">
                            <!-- CUSTOM FORM USING MAILERLITE JSONP ENDPOINT -->
                            <form class="ml-block-form bb-form"
                                action="https://assets.mailerlite.com/jsonp/1908727/forms/170605338066682928/subscribe"
                                  method="post"
                                  target="ml_iframe">
                                <div class="bb-form-group">
                                    <input aria-label="email" type="email" class="form-control"
                                           name="fields[email]" placeholder="Your email address"
                                           autocomplete="email" required>
                                </div>
                                <div class="ml-form-recaptcha ml-validate-required">
                                    <div class="g-recaptcha"
                                         data-sitekey="6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD"></div>
                                </div>
                                <button type="submit" class="button button-primary bb-submit-btn">
                                    <span class="bb-btn-text">Notify Me</span>
                                    <span class="bb-btn-loader"></span>
                                </button>
                                <p class="bb-success-message">
                                    🎉 You're on the list!  
                                    <br>We’ll email you before launch.
                                </p>
                                <p class="bb-error-message">
                                    ⚠️ Something went wrong — please check your email and try again.
                                </p>
                                <input type="hidden" name="anticsrf" value="true">
                                <input type="hidden" name="ml-submit" value="1">
                            </form>
                            <iframe name="ml_iframe" class="ml-hidden-iframe" style="display:none;"></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <p class="signup-note">
                No spam, no selling your data — just occasional updates when something genuinely useful is happening.
            </p>
        </div>
    </div>
</section>
<!-- Social / Community Strip -->
<section class="section section-community" aria-label="Community and social links">
    <div class="container community-inner">
        <h2>Join the BonnieByte Community</h2>
        <p>Follow along for updates, build pics, and future product drops.</p>
        <div class="social-links">
            <a href="https://instagram.com/bonniebytepc" target="_blank" rel="noopener noreferrer">
                <svg class="social-icon" viewBox="0 0 24 24">
                    <rect x="5" y="5" width="14" height="14" rx="4"/>
                    <circle cx="12" cy="12" r="3"/>
                    <circle cx="16.2" cy="7.8" r="0.9"/>
                </svg>
            </a>
            <a href="https://tiktok.com/@bonniebytepc" target="_blank" rel="noopener noreferrer">
                <svg class="social-icon" viewBox="0 0 24 24">
                    <path d="M10 4V14.5"/>
                    <circle cx="10" cy="17.5" r="2.5"/>
                    <path d="M10 6.5C12 9 15 9.5 17 9.5V4"/>
                </svg>
            </a>
            <a href="https://twitter.com/bonniebytepc" target="_blank" rel="noopener noreferrer">
                <svg class="social-icon" viewBox="0 0 24 24">
                    <path d="M3 21 L21 3" stroke-width="2" stroke-linecap="round"/>
                    <path d="M3 3 L11 3 L21 21 L13 21 Z" stroke-width="2" stroke-linejoin="round"/>
                </svg>
            </a>
            <a href="https://facebook.com/bonniebytepc" target="_blank" rel="noopener noreferrer">
                <svg class="social-icon" viewBox="0 0 24 24">
                    <rect x="5" y="5" width="14" height="14" rx="3"/>
                    <path d="M13 8H11.5C10.4 8 9.5 8.9 9.5 10V16"/>
                    <path d="M10 12H13"/>
                </svg>
            </a>
        </div>
    </div>
</section>
