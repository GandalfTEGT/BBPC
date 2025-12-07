# BonnieByte PC — Official Website

This repository contains the full source code for the **BonnieByte PC** website, a static site built using **Jekyll** and deployed through **GitHub Pages**.

BonnieByte PC is a Scottish-based PC cooling and components brand.  
The website includes product pages, documentation, warranties, support guides, tools, and legal information.

## 📁 Project Structure
- /_layouts → Page templates (default, product, warranty, etc.)
- /_includes → Shared components (header, footer, warranty sections)
- /_includes/warranty_sections → Modular warranty content blocks
- /_data → Products registry (products.yml)
- /legal → Policies (privacy, cookies, terms, shipping, returns)
- /warranty → Warranty index + product warranty pages
- /products → Product catalogue + product detail pages
- /docs → Manuals, setup guides, documentation index
- /support → Customer support pages
- /static → CSS & JS assets (base.css, scripts, home.css, etc.)
- index.md → Homepage
- _config.yml → Jekyll configuration


## 🚀 Deployment

This site is deployed automatically using **GitHub Pages**.

Each time you push changes to the `main` branch, GitHub Pages rebuilds and publishes the latest version.

### No additional build steps are required.

## 🛠️ Tech Stack

- **Jekyll** (static site generator)
- **Liquid** (templating)
- **YAML** (`_data` product registry)
- **Markdown** (content pages)
- **HTML/CSS/JS**
- **GitHub Pages** (hosting)
- **GTranslate** (optional translations)
- **Iubenda** (legal compliance embeds)
- **MailerLite** (email subscriptions)

## 📦 Product Registry

All product data is located in: _data/products.yml

Each product entry controls:
- Warranty page generation  
- Manual links  
- Product detail pages  
- Warranty directory listing  
- Future auto-generated content  

To add a new product, duplicate an existing entry or use the template block at the bottom.

## 🧩 Warranty System

The warranty system is modular:

- Each product warranty page contains **only front matter**
- All content is injected from reusable includes: /_includes/warranty_sections/

Changing a section (e.g., “What’s Covered”) updates **every product warranty page automatically**.

## 📝 Editing the Website

### To edit content:
Modify `.md` files in `/legal`, `/warranty`, `/products`, `/docs`, or `/support`.

### To edit design:
Modify files in `/static` (CSS) or `/static/scripts` (JS).

### To modify templates:
Use `/layouts` and `/includes`.

---

# 🧑‍💻 Local Development (Optional)

To run the site locally:
gem install bundler jekyll
bundle install
bundle exec jekyll serve

Then visit:  
`http://localhost:4000`

---

# 📄 License

This website content is © BonnieByte PC.  
Do not use or reproduce without permission.


