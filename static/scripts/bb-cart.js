// bb-cart.js
// BonnieByte PC – Front-end cart system (localStorage now, Shopify-ready later)

(function () {
  const STORAGE_KEY = 'bbCart';
  const CURRENCY = '£';

  // --- Helpers ---

  function loadCart() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { items: [] };
      const parsed = JSON.parse(raw);
      if (!parsed.items) parsed.items = [];
      return parsed;
    } catch (e) {
      console.error('Error loading cart:', e);
      return { items: [] };
    }
  }

  function saveCart(cart) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }

  function formatMoney(amount) {
    return CURRENCY + amount.toFixed(2);
  }

  function getCartCount(cart) {
    return cart.items.reduce((sum, item) => sum + item.qty, 0);
  }

  function getCartSubtotal(cart) {
    return cart.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  }

  function findItemIndex(cart, key) {
    return cart.items.findIndex(
      (item) =>
        item.key === key
    );
  }

  function buildItemKey(sku, variant) {
    return `${sku}::${variant || 'default'}`;
  }

  // --- DOM refs ---

  const cartCountEl = document.querySelector('[data-cart-count]');
  const cartDrawer = document.querySelector('[data-cart-drawer]');
  const cartItemsContainer = document.querySelector('[data-cart-items]');
  const cartEmptyEl = document.querySelector('[data-cart-empty]');
  const cartSubtotalEl = document.querySelector('[data-cart-subtotal]');
  const cartBackdrop = document.querySelector('[data-cart-backdrop]');
  const cartPreview = document.querySelector('[data-cart-preview]');
  const cartPreviewItems = document.querySelector('[data-cart-preview-items]');
  const cartPreviewSubtotal = document.querySelector('[data-cart-preview-subtotal]');
  const cartPageContainer = document.querySelector('[data-cart-page]');
  const cartPageLoading = document.querySelector('[data-cart-page-loading]');

  let currentCart = loadCart();

  // --- Render functions ---

  function updateHeaderCount() {
    if (!cartCountEl) return;
    const count = getCartCount(currentCart);
    cartCountEl.textContent = count;
  }

  function renderDrawer() {
    if (!cartItemsContainer || !cartEmptyEl || !cartSubtotalEl) return;

    const count = getCartCount(currentCart);
    const subtotal = getCartSubtotal(currentCart);

    cartItemsContainer.innerHTML = '';

    if (count === 0) {
      cartEmptyEl.style.display = '';
      cartItemsContainer.style.display = 'none';
    } else {
      cartEmptyEl.style.display = 'none';
      cartItemsContainer.style.display = '';
      currentCart.items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'bb-cart-item';
        row.innerHTML = `
          <div class="bb-cart-item-image">
            ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}
          </div>
          <div class="bb-cart-item-info">
            <div class="bb-cart-item-name">${item.name}</div>
            <div class="bb-cart-item-meta">
              <span class="bb-cart-item-sku">${item.sku}</span>
              ${item.variant && item.variant !== 'default' ? `<span class="bb-cart-item-variant">${item.variant}</span>` : ''}
            </div>
            <div class="bb-cart-item-controls">
              <div class="bb-cart-item-qty">
                <button type="button" class="bb-cart-qty-btn" data-cart-qty-dec data-item-key="${item.key}">−</button>
                <input type="text" class="bb-cart-qty-input" data-cart-qty-input data-item-key="${item.key}" value="${item.qty}">
                <button type="button" class="bb-cart-qty-btn" data-cart-qty-inc data-item-key="${item.key}">+</button>
              </div>
              <div class="bb-cart-item-price">
                ${formatMoney(item.price)}
              </div>
              <button type="button" class="bb-cart-remove" data-cart-remove data-item-key="${item.key}">
                Remove
              </button>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(row);
      });
    }

    cartSubtotalEl.textContent = formatMoney(subtotal);
  }

  function renderPreview() {
    if (!cartPreview || !cartPreviewItems || !cartPreviewSubtotal) return;

    const count = getCartCount(currentCart);
    const subtotal = getCartSubtotal(currentCart);

    cartPreviewItems.innerHTML = '';

    if (count === 0) {
      cartPreviewItems.innerHTML = `<p class="bb-cart-preview-empty">Your cart is empty.</p>`;
    } else {
      const itemsToShow = currentCart.items.slice(0, 3);
      itemsToShow.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'bb-cart-preview-item';
        row.innerHTML = `
          <div class="bb-cart-preview-thumb">
            ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}
          </div>
          <div class="bb-cart-preview-info">
            <div class="bb-cart-preview-name">${item.name}</div>
            <div class="bb-cart-preview-qty-price">
              <span>${item.qty} × ${formatMoney(item.price)}</span>
            </div>
          </div>
        `;
        cartPreviewItems.appendChild(row);
      });

      if (currentCart.items.length > itemsToShow.length) {
        const more = document.createElement('div');
        more.className = 'bb-cart-preview-more';
        more.textContent = `+ ${currentCart.items.length - itemsToShow.length} more item(s)`;
        cartPreviewItems.appendChild(more);
      }
    }

    cartPreviewSubtotal.textContent = formatMoney(subtotal);
  }

  function renderCartPage() {
    if (!cartPageContainer) return;
    if (cartPageLoading) cartPageLoading.style.display = 'none';

    const count = getCartCount(currentCart);
    const subtotal = getCartSubtotal(currentCart);

    if (count === 0) {
      cartPageContainer.innerHTML = `
        <p>Your cart is empty.</p>
        <p><a href="/products/" class="btn-primary">Browse products</a></p>
      `;
      return;
    }

    let html = `
      <div class="bb-cart-page-table-wrapper">
        <table class="bb-cart-page-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
    `;

    currentCart.items.forEach((item) => {
      const lineTotal = item.qty * item.price;
      html += `
        <tr data-item-key="${item.key}">
          <td class="bb-cart-page-product">
            <div class="bb-cart-page-product-inner">
              <div class="bb-cart-page-thumb">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : ''}
              </div>
              <div class="bb-cart-page-info">
                <div class="bb-cart-page-name">${item.name}</div>
                <div class="bb-cart-page-meta">
                  <span class="bb-cart-page-sku">${item.sku}</span>
                  ${item.variant && item.variant !== 'default' ? `<span class="bb-cart-page-variant">${item.variant}</span>` : ''}
                </div>
              </div>
            </div>
          </td>
          <td>${formatMoney(item.price)}</td>
          <td>
            <div class="bb-cart-page-qty">
              <button type="button" class="bb-cart-qty-btn" data-cart-qty-dec data-item-key="${item.key}">−</button>
              <input type="text" class="bb-cart-qty-input" data-cart-qty-input data-item-key="${item.key}" value="${item.qty}">
              <button type="button" class="bb-cart-qty-btn" data-cart-qty-inc data-item-key="${item.key}">+</button>
            </div>
          </td>
          <td>${formatMoney(lineTotal)}</td>
          <td>
            <button type="button" class="bb-cart-remove" data-cart-remove data-item-key="${item.key}">Remove</button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
      <div class="bb-cart-page-summary">
        <div class="bb-cart-page-subtotal">
          <span>Subtotal</span>
          <span>${formatMoney(subtotal)}</span>
        </div>
        <p class="bb-cart-page-note">Taxes and shipping will be calculated at checkout when our store launches.</p>
        <div class="bb-cart-page-actions">
          <a href="/products/" class="btn-secondary">Continue shopping</a>
          <button type="button" class="btn-primary" data-cart-checkout>Checkout</button>
        </div>
      </div>
    `;

    cartPageContainer.innerHTML = html;
  }

  // --- Cart operations ---

  function addToCart({ sku, name, price, image, variant }) {
    const key = buildItemKey(sku, variant);
    const index = findItemIndex(currentCart, key);

    if (index >= 0) {
      currentCart.items[index].qty += 1;
    } else {
      currentCart.items.push({
        key,
        sku,
        name,
        price,
        image: image || '',
        variant: variant || 'default',
        qty: 1
      });
    }

    saveCart(currentCart);
    updateHeaderCount();
    renderDrawer();
    renderPreview();
  }

  function updateQty(key, newQty) {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty < 1) return;
    const index = findItemIndex(currentCart, key);
    if (index === -1) return;

    currentCart.items[index].qty = qty;
    saveCart(currentCart);
    updateHeaderCount();
    renderDrawer();
    renderPreview();
    renderCartPage();
  }

  function removeItem(key) {
    const index = findItemIndex(currentCart, key);
    if (index === -1) return;
    currentCart.items.splice(index, 1);
    saveCart(currentCart);
    updateHeaderCount();
    renderDrawer();
    renderPreview();
    renderCartPage();
  }

  // --- UI: open / close drawer ---

  function openDrawer() {
    if (!cartDrawer || !cartBackdrop) return;
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartBackdrop.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('bb-cart-open');
  }

  function closeDrawer() {
    if (!cartDrawer || !cartBackdrop) return;
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartBackdrop.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('bb-cart-open');
  }

  // --- Event listeners ---

  document.addEventListener('click', function (event) {
    const target = event.target;

    // Add to cart
    if (target.closest('[data-add-to-cart]')) {
      const btn = target.closest('[data-add-to-cart]');
      const sku = btn.getAttribute('data-product-sku');
      const name = btn.getAttribute('data-product-name') || sku;
      const price = parseFloat(btn.getAttribute('data-product-price') || '0');
      const image = btn.getAttribute('data-product-image') || '';
      const variant = btn.getAttribute('data-product-variant') || 'default';

      if (!sku) {
        console.warn('Add to cart clicked without SKU');
        return;
      }

      // Add to cart
      if (target.closest('[data-add-to-cart]')) {
          const btn = target.closest('[data-add-to-cart]');
          const sku = btn.getAttribute('data-product-sku');
          const name = btn.getAttribute('data-product-name') || sku;
          const price = parseFloat(btn.getAttribute('data-product-price') || '0');
          const image = btn.getAttribute('data-product-image') || '';
          const variant = btn.getAttribute('data-product-variant') || 'default';
      
          if (!sku) {
              console.warn('Add to cart clicked without SKU');
              return;
          }
      
          // Add item to cart
          addToCart({ sku, name, price, image, variant });
      
          // -------------------------------
          // FLY TO CART ANIMATION
          // -------------------------------
          if (image) {
              const rect = btn.getBoundingClientRect();
              const cartRect = document.querySelector('.bb-cart-toggle').getBoundingClientRect();
      
              const flyImg = document.createElement('img');
              flyImg.src = image;
              flyImg.className = 'bb-fly-image';
              document.body.appendChild(flyImg);
      
              flyImg.style.left = rect.left + "px";
              flyImg.style.top = rect.top + "px";
      
              flyImg.getBoundingClientRect(); // force reflow
      
              flyImg.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.2)`;
              flyImg.style.opacity = "0";
      
              setTimeout(() => flyImg.remove(), 700);
          }
      
          // -------------------------------
          // BADGE POP ANIMATION
          // -------------------------------
          const badge = document.querySelector(".bb-cart-count-badge");
          if (badge) {
              badge.classList.add("pop");
              setTimeout(() => badge.classList.remove("pop"), 350);
          }
      
          openDrawer();
          return;
      }


    // Toggle cart drawer
    if (target.closest('[data-cart-toggle]')) {
      if (cartDrawer && cartDrawer.getAttribute('aria-hidden') === 'false') {
        closeDrawer();
      } else {
        renderDrawer();
        openDrawer();
      }
      return;
    }

    // Close drawer
    if (target.closest('[data-cart-close]') || target === cartBackdrop) {
      closeDrawer();
      return;
    }

    // Qty increase
    if (target.matches('[data-cart-qty-inc]')) {
      const key = target.getAttribute('data-item-key');
      const index = findItemIndex(currentCart, key);
      if (index === -1) return;
      const newQty = currentCart.items[index].qty + 1;
      updateQty(key, newQty);
      return;
    }

    // Qty decrease
    if (target.matches('[data-cart-qty-dec]')) {
      const key = target.getAttribute('data-item-key');
      const index = findItemIndex(currentCart, key);
      if (index === -1) return;
      const newQty = currentCart.items[index].qty - 1;
      if (newQty >= 1) {
        updateQty(key, newQty);
      }
      return;
    }

    // Remove item
    if (target.matches('[data-cart-remove]')) {
      const key = target.getAttribute('data-item-key');
      removeItem(key);
      return;
    }

    // Checkout placeholder
    if (target.matches('[data-cart-checkout]')) {
      event.preventDefault();
      alert('Checkout will be enabled when our Shopify store is live.');
      return;
    }
  });

  // Hover preview (desktop)
  const cartToggleWrapper = document.querySelector('.bb-cart-toggle-wrapper');
  if (cartToggleWrapper && cartPreview) {
    let hoverTimeout = null;
    const showPreview = () => {
      if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
      renderPreview();
      cartPreview.setAttribute('aria-hidden', 'false');
    };
    const hidePreview = () => {
      cartPreview.setAttribute('aria-hidden', 'true');
    };

    cartToggleWrapper.addEventListener('mouseenter', () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(showPreview, 150);
    });

    cartToggleWrapper.addEventListener('mouseleave', () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(hidePreview, 150);
    });
  }

  // --- Initial render on load ---
  updateHeaderCount();
  renderDrawer();
  renderPreview();
  renderCartPage();
})();
