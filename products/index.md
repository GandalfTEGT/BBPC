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
      {% for product in site.data.products %}
        {% assign id = product[0] %}
        {% assign p = product[1] %}
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
    </div>
  </div>
</section>
