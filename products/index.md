---
layout: default
title: "Products | BonnieByte PC"
---
<section class="section section-products" id="products">
  <div class="container">
    <header class="page-header">
      <h1>Products</h1>
      <p>High-quality PC cooling and components, built for real-world rigs.</p>
    </header>
    <div class="product-grid">
      {% assign products = site.data.products %}
      {% assign product_ids = products | keys | sort_natural %}
      {% for id in product_ids %}
        {% assign p = products[id] %}
        {% if p.product_visible != false %}
          <article class="product-card">
            <div class="product-media">
              {% if p.thumbnail %}
                <img src="{{ p.thumbnail }}" alt="{{ p.full_name }}" class="product-image">
              {% else %}
                <div class="product-image-placeholder">
                  <span>Product render coming soon</span>
                </div>
              {% endif %}
            </div>
            <div class="product-body">
              <h2><span class="orbitron notranslate">{{ p.short_name | upcase }}</span> {{ p.full_name | replace: p.short_name,'' }}</h2>
              {% if p.description %}
                <p>{{ p.description }}</p>
              {% endif %}
              <ul class="product-features">
                {% if p.features %}
                  {% for f in p.features %}
                    <li>{{ f }}</li>
                  {% endfor %}
                {% endif %}
              </ul>
              <div class="product-badges">
                {% if p.warranty_enabled %}
                  <span>{{ p.warranty_length | default: "2-Year Warranty" }}</span>
                {% endif %}
                {% if p.ukca %}
                  <span>UKCA Ready</span>
                {% endif %}
                {% if p.status %}
                  <span>{{ p.status }}</span>
                {% endif %}
              </div>
              <div class="button-group">
                {% if p.amazon_url %}
                  <a href="{{ p.amazon_url }}" class="button button-secondary" target="_blank" rel="noopener noreferrer">Buy on Amazon UK</a>
                {% endif %}
                <a href="/docs/{{ id }}" class="button button-secondary">View Manual</a>
              </div>
            </div>
          </article>
        {% endif %}
      {% endfor %}
      <article class="product-card product-card--placeholder">
        <div class="product-media">
          <div class="product-image-placeholder"><span>Future product</span></div>
        </div>
        <div class="product-body">
          <h2>Coming Soon</h2>
          <p>We’re already planning the next additions to the BonnieByte PC lineup. More cooling options and accessories are on the way.</p>
          <ul class="product-features">
            <li>Thoughtful aesthetics</li>
            <li>Honest performance specs</li>
            <li>UK-based support</li>
          </ul>
          <p class="product-coming-soon-note">Want to hear about new launches first? <a href="/#notify">Join the launch list</a>.</p>
        </div>
      </article>
      <article class="product-card product-card--placeholder">
        <div class="product-media">
          <div class="product-image-placeholder"><span>Future product</span></div>
        </div>
        <div class="product-body">
          <h2>More Hardware on the Horizon</h2>
          <p>As BonnieByte PC grows, we’ll expand into more PC components and accessories that follow the same values: performance, presentation, and price.</p>
          <ul class="product-features">
            <li>Clean presentation</li>
            <li>Real-world testing</li>
            <li>Clear documentation</li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</section>
