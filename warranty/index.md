---
layout: default
title: "Warranty Information | BonnieByte PC"
---
<div class="container warranty-directory">
  <div class="policy-container">
    <h1>Warranty Information</h1>
    <p>Find warranty coverage information for all eligible BonnieByte PC products.</p>
    <h2>Products With Warranty</h2>
    {% assign products = site.data.products | sort_natural %}
    <div class="warranty-grid">
      {% for item in products %}
        {% assign id = item[0] %}
        {% assign p = item[1] %}
        {% if p.warranty_enabled %}
          {%- comment -%}
          CALCULATE IF NEW (<60 DAYS)
          {%- endcomment -%}
          {% assign today = 'now' | date: "%s" %}
          {% assign release = p.release_date | date: "%s" %}
          {% assign age_days = today | minus: release | divided_by: 86400 %}
          {% assign is_new = age_days | minus: 60 | abs | divided_by: age_days %}
          <a class="warranty-card" href="/warranty/{{ id }}/">
            <div class="thumb">
              <img src="/images/products/{{ id }}.png" alt="{{ p.full_name }}">
              {% if age_days < 60 %}
                <span class="badge new">NEW</span>
              {% endif %}
            </div>
            <div class="warranty-info">
              <h3 class="orbitron">{{ p.short_name }}</h3>
              <div class="meta">
                <span class="category">{{ p.product_type | replace: "_", " " | capitalize }}</span>
                <span class="warranty-term">{{ p.warranty_length | default: "2 years" }}</span>
              </div>
              <p class="full-name">{{ p.full_name }}</p>
            </div>
          </a>
        {% endif %}
      {% endfor %}
    </div>
  </div>
</div>
