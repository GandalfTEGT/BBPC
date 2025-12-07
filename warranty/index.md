---
layout: default
title: Warranty Information | BonnieByte PC
---
<div class="container">
    <div class="policy-container">
        <h1>Warranty Information</h1>
        <p>Find warranty coverage information for all eligible BonnieByte PC products.</p>
        <h2>Available Warranty Pages</h2>
        <ul>
        {% for product_id in site.data.products %}
            {% assign p = site.data.products[product_id] %}
            {% if p.warranty_enabled %}
                <li>
                    <a href="{{ '/warranty/' | append: product_id | append: '/' | relative_url }}">
                        <span class="orbitron notranslate">{{ p.short_name | upcase }}</span>
                    </a>
                    – {{ p.full_name }}
                </li>
            {% endif %}
        {% endfor %}
        </ul>
        {% for product_id in site.data.products %}
          {{ product_id }} → warranty_enabled = "{{ site.data.products[product_id].warranty_enabled }}"
        {% endfor %}
    </div>
</div>
