---
layout: default
title: Warranty Information | BonnieByte PC
---
<div class="container">
    <div class="policy-container">
        <h1>Warranty Information</h1>
        <p>Find warranty coverage information for all eligible BonnieByte PC products.</p>
        <h2>Available Warranty Pages</h2>
        <h3>DEBUG</h3>
        <p>Keys:</p>
        {{ site.data.products | keys }}
        <p>Raw dump:</p>
        {{ site.data.products | jsonify }}
        <p>Loop test (no IF):</p>
        <ul>
        {% for product_id in site.data.products %}
            <li>{{ product_id }} — warranty_enabled: {{ site.data.products[product_id].warranty_enabled | inspect }}</li>
        {% endfor %}
        </ul>
    </div>
</div>
