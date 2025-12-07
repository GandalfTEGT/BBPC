---
layout: default
title: "Warranty Information | BonnieByte PC"
---
<div class="container warranty-directory">
  <div class="policy-container">
    <h1>Warranty Information</h1>
    <p>Find warranty coverage information for all eligible BonnieByte PC products.</p>
    <h2>Products With Warranty</h2>
    {%- comment -%}
    We sort SAFELY by converting the hash into an array of 
    [key, object] pairs, then sorting by object.full_name.
    This avoids breaking your working logic.
    {%- endcomment -%}
    {% assign products_array = site.data.products %}
    {% assign product_list = "" | split: "" %}
    {% for product in products_array %}
      {% assign id = product[0] %}
      {% assign p = product[1] %}
      {% assign entry = id | append: "||" | append: p.full_name %}
      {% assign product_list = product_list | push: entry %}
    {% endfor %}
    {% assign sorted_list = product_list | sort_natural %}
    <div class="warranty-grid">
      {% for entry in sorted_list %}
        {% assign id = entry | split: "||" | first %}
        {% assign p = site.data.products[id] %}
        {% if p.warranty_enabled %}
          {%- comment -%} NEW badge logic {%- endcomment -%}
          {% assign today = 'now' | date: "%s" %}
          {% assign release = p.release_date | date: "%s" %}
          {% assign age_days = today | minus: release | divided_by: 86400 %}
          <a class="warranty-card" href="/warranty/{{ id }}/">
            <div class="thumb">
              <img src="{{ p.thumbnail | default: '/images/products/default.png' }}" alt="{{ p.full_name }}">
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
