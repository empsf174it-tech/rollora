// cart.js
document.addEventListener('DOMContentLoaded', () => {
  const cartToggle = document.getElementById('cart-toggle');
  const cartClose = document.getElementById('cart-close');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartFooter = document.getElementById('cart-footer');
  const cartCount = document.getElementById('cart-count');
  
  let cart = JSON.parse(localStorage.getItem('rollora_cart') || '[]');

  // Public Add To Cart
  window.addToCart = function(productId) {
    const products = window.store.get('products');
    const p = products.find(x => x.id === productId);
    if (!p || p.stock <= 0) return;

    const existing = cart.find(x => x.productId === productId);
    if (existing) {
      if (existing.quantity < p.stock) {
        existing.quantity += 1;
      } else {
        alert('Cannot add more. Stock limit reached.');
      }
    } else {
      cart.push({ productId, quantity: 1 });
    }
    
    saveCart();
    cartOverlay.classList.add('active'); // Open drawer
  };

  function saveCart() {
    localStorage.setItem('rollora_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    const products = window.store.get('products');
    let totalItems = 0;
    let subtotal = 0;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<div style="text-align:center; padding: 40px 20px; color: var(--color-text-muted);">Your cart is empty.</div>';
      cartFooter.innerHTML = '';
      cartCount.textContent = '0';
      return;
    }

    cart.forEach((item, index) => {
      const p = products.find(x => x.id === item.productId);
      if (!p) return;
      
      totalItems += item.quantity;
      subtotal += p.price * item.quantity;
      
      const itemEl = document.createElement('div');
      itemEl.style.display = 'flex';
      itemEl.style.gap = 'var(--space-4)';
      itemEl.style.marginBottom = 'var(--space-4)';
      itemEl.style.paddingBottom = 'var(--space-4)';
      itemEl.style.borderBottom = '1px solid var(--color-border)';
      
      itemEl.innerHTML = `
        <img src="${p.image}" alt="${p.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
        <div style="flex: 1;">
          <h4 style="margin-bottom: 4px;">${p.name}</h4>
          <div class="tabular" style="color: var(--color-primary); font-weight: 500; margin-bottom: 8px;">$${p.price.toFixed(2)}</div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-outline qty-btn" data-index="${index}" data-action="minus" style="padding: 2px 8px;">-</button>
              <span class="tabular">${item.quantity}</span>
              <button class="btn btn-outline qty-btn" data-index="${index}" data-action="plus" style="padding: 2px 8px;">+</button>
            </div>
            <button class="btn btn-outline rm-btn" data-index="${index}" style="padding: 2px 8px; color: var(--color-error); border-color: transparent;"><i class="ph ph-trash"></i></button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    cartCount.textContent = totalItems;
    
    // Checkout Placeholder Footer
    const shipping = 5.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    cartFooter.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom: 8px;"><span>Subtotal</span> <span class="tabular">$${subtotal.toFixed(2)}</span></div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 8px; font-size: 0.875rem; color: var(--color-text-muted);"><span>Shipping (Demo)</span> <span class="tabular">$${shipping.toFixed(2)}</span></div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 16px; font-size: 0.875rem; color: var(--color-text-muted);"><span>Tax (Demo 8%)</span> <span class="tabular">$${tax.toFixed(2)}</span></div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 24px; font-weight: 500; font-size: 1.125rem;"><span>Total</span> <span class="tabular">$${total.toFixed(2)}</span></div>
      <button id="checkout-btn" class="btn btn-primary" style="width:100%;"><i class="ph ph-lock-key"></i> Checkout</button>
    `;

    // Attach events
    document.querySelectorAll('.qty-btn').forEach(btn => btn.addEventListener('click', handleQtyChange));
    document.querySelectorAll('.rm-btn').forEach(btn => btn.addEventListener('click', handleRemove));
    document.getElementById('checkout-btn').addEventListener('click', handleCheckoutStep1);
  }

  function handleQtyChange(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const action = e.currentTarget.dataset.action;
    const products = window.store.get('products');
    const p = products.find(x => x.id === cart[index].productId);
    
    if (action === 'plus') {
      if (cart[index].quantity < p.stock) cart[index].quantity++;
      else alert('Stock limit reached.');
    } else {
      if (cart[index].quantity > 1) cart[index].quantity--;
    }
    saveCart();
  }

  function handleRemove(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    cart.splice(index, 1);
    saveCart();
  }

  function handleCheckoutStep1() {
    const session = JSON.parse(localStorage.getItem('rollora_session'));
    if (!session) {
      localStorage.setItem('rollora_pending_checkout', 'true');
      window.location.href = 'auth.html';
      return;
    }
    localStorage.removeItem('rollora_pending_checkout');
    
    // Render Checkout Form in Drawer
    cartItemsContainer.innerHTML = `
      <h3 style="margin-bottom: var(--space-4);">Checkout Details</h3>
      <form id="checkout-form">
        <div class="form-group"><label class="form-label">Address</label><input type="text" class="form-control" required></div>
        <div class="form-group"><label class="form-label">City</label><input type="text" class="form-control" required></div>
        <div style="display:flex; gap:16px;">
          <div class="form-group" style="flex:1;"><label class="form-label">State</label><input type="text" class="form-control" required></div>
          <div class="form-group" style="flex:1;"><label class="form-label">ZIP</label><input type="text" class="form-control" required></div>
        </div>
        <h4 style="margin: 24px 0 16px;">Payment (Demo)</h4>
        <div style="display:flex; gap:8px; margin-bottom:16px;">
          <div style="flex:1; border: 1px solid var(--color-primary); padding:8px; text-align:center; border-radius:4px; color:var(--color-primary);"><i class="ph ph-credit-card"></i> Stripe Placeholder</div>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%;">Place Demo Order</button>
      </form>
    `;
    cartFooter.innerHTML = '';
    
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
      e.preventDefault();
      placeDemoOrder(session);
    });
  }

  function placeDemoOrder(session) {
    const products = window.store.get('products');
    let subtotal = 0;
    cart.forEach(item => {
      const p = products.find(x => x.id === item.productId);
      if(p) subtotal += p.price * item.quantity;
    });
    const total = subtotal + 5.00 + (subtotal * 0.08);
    
    const orders = window.store.get('orders');
    const newOrder = {
      id: 'ORD-' + Math.floor(Math.random() * 9000 + 1000),
      date: new Date().toISOString(),
      items: cart,
      total: total,
      status: 'pending',
      customer: { name: session.name, email: session.email }
    };
    orders.push(newOrder);
    window.store.set('orders', orders);

    // Decrement stock
    cart.forEach(item => {
      const pIndex = products.findIndex(x => x.id === item.productId);
      if (pIndex > -1) {
        products[pIndex].stock = Math.max(0, products[pIndex].stock - item.quantity);
      }
    });
    window.store.set('products', products);

    // Clear cart
    cart = [];
    localStorage.removeItem('rollora_cart');
    updateCartUI();

    cartItemsContainer.innerHTML = `
      <div style="text-align:center; padding: 40px 20px;">
        <i class="ph-fill ph-check-circle" style="font-size: 4rem; color: var(--color-success); margin-bottom: 16px;"></i>
        <h3>Order Placed!</h3>
        <p style="color: var(--color-text-muted); margin-top: 8px;">Order number: <strong>${newOrder.id}</strong></p>
        <p style="font-size: 0.875rem; margin-top: 16px;">This is a demo order. No actual charge was made.</p>
        <button class="btn btn-primary" style="margin-top: 24px;" onclick="document.getElementById('cart-overlay').classList.remove('active')">Continue Shopping</button>
      </div>
    `;

    // Refresh shop grid if visible
    const sortSelect = document.getElementById('sort-select');
    if(sortSelect) {
      sortSelect.dispatchEvent(new Event('change')); // Trigger re-render to update stock badges
    }
  }

  // Toggles
  if (cartToggle) cartToggle.addEventListener('click', () => {
    updateCartUI();
    cartOverlay.classList.add('active');
  });
  if (cartClose) cartClose.addEventListener('click', () => cartOverlay.classList.remove('active'));
  if (cartOverlay) cartOverlay.addEventListener('click', (e) => {
    if(e.target === cartOverlay) cartOverlay.classList.remove('active');
  });

  // Check pending checkout
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('openCart') === 'true') {
    updateCartUI();
    cartOverlay.classList.add('active');
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    updateCartUI();
  }
});
