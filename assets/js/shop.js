// shop.js
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('shop-grid')) return;

  const products = window.store.get('products');
  const reviews = window.store.get('reviews');
  const grid = document.getElementById('shop-grid');
  const noResultsMsg = document.getElementById('no-results-msg');
  
  // Filter elements
  const sortSelect = document.getElementById('sort-select');
  const typeCheckboxes = document.querySelectorAll('input[name="type"]');
  const densityCheckboxes = document.querySelectorAll('input[name="density"]');
  const instockCheckbox = document.querySelector('input[name="instock"]');
  const resetBtn = document.getElementById('reset-filters');

  // Collapsible filters (tablet/mobile)
  const filtersToggle = document.getElementById('filters-toggle');
  if (filtersToggle) {
    filtersToggle.addEventListener('click', () => {
      const panel = filtersToggle.closest('.filters-panel');
      const isOpen = panel.classList.toggle('open');
      filtersToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  function renderGrid(filteredProducts) {
    grid.innerHTML = '';
    if (filteredProducts.length === 0) {
      grid.style.display = 'none';
      noResultsMsg.style.display = 'block';
      return;
    }
    grid.style.display = 'grid';
    noResultsMsg.style.display = 'none';

    filteredProducts.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      
      const inStock = p.stock > 0;
      const stockBadge = inStock ? '' : '<div class="card-badge" style="background:var(--color-error);color:white;">Out of Stock</div>';
      
      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${p.image}" alt="${p.name}" class="card-image" loading="lazy">
          ${stockBadge}
        </div>
        <div style="font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">${p.type} • ${p.density}</div>
        <h3 class="card-title">${p.name}</h3>
        <div style="display:flex; gap:4px; margin-bottom: 8px; color: var(--color-primary); font-size:0.875rem;">
          <i class="ph-fill ph-star"></i> <span style="color:var(--color-text-muted)">(${p.rating})</span>
        </div>
        <div class="card-price tabular">$${p.price.toFixed(2)}</div>
        <label class="checkbox-label" style="align-self: flex-start; margin-bottom: 16px;">
          <input type="checkbox" class="compare-cb" data-id="${p.id}"> Compare
        </label>
        <div class="card-actions">
          <button class="btn btn-outline qv-btn" data-id="${p.id}" aria-label="Quick view ${p.name}">Quick View</button>
          <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}" ${!inStock ? 'disabled' : ''} aria-label="Add ${p.name} to cart">
            <i class="ph ph-shopping-cart"></i> Add
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Attach events
    document.querySelectorAll('.qv-btn').forEach(btn => btn.addEventListener('click', (e) => openQuickView(e.currentTarget.dataset.id)));
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => btn.addEventListener('click', (e) => window.addToCart(e.currentTarget.dataset.id)));
    document.querySelectorAll('.compare-cb').forEach(cb => {
      // Sync initial state
      const compareList = JSON.parse(localStorage.getItem('rollora_compare') || '[]');
      if (compareList.includes(cb.dataset.id)) cb.checked = true;
      cb.addEventListener('change', (e) => window.toggleCompare(e.currentTarget.dataset.id, e.currentTarget.checked));
    });
  }

  function applyFilters() {
    const types = Array.from(typeCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const densities = Array.from(densityCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const instockOnly = instockCheckbox.checked;
    const sort = sortSelect.value;

    let result = products.filter(p => p.status !== 'draft');

    if (types.length > 0) result = result.filter(p => types.includes(p.type));
    if (densities.length > 0) result = result.filter(p => densities.includes(p.density));
    if (instockOnly) result = result.filter(p => p.stock > 0);

    // Sort
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sort === 'featured') result.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));

    renderGrid(result);
  }

  // Event Listeners for Filters
  sortSelect.addEventListener('change', applyFilters);
  typeCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  densityCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  instockCheckbox.addEventListener('change', applyFilters);
  resetBtn.addEventListener('click', () => {
    typeCheckboxes.forEach(cb => cb.checked = false);
    densityCheckboxes.forEach(cb => cb.checked = false);
    instockCheckbox.checked = false;
    sortSelect.value = 'featured';
    applyFilters();
  });

  // Initial Render
  applyFilters();

  // --- Quick View Modal ---
  const qvOverlay = document.getElementById('quick-view-overlay');
  const qvClose = document.getElementById('qv-close');
  const qvContent = document.getElementById('qv-content');

  function openQuickView(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    const inStock = p.stock > 0;
    
    qvContent.innerHTML = `
      <div style="display:flex; gap: var(--space-6); flex-wrap: wrap;">
        <div style="flex: 1; min-width: 250px;">
          <img src="${p.image}" alt="${p.name}" style="width:100%; border-radius: var(--radius);">
        </div>
        <div style="flex: 1; min-width: 250px;">
          <h2 id="qv-title" style="margin-bottom: var(--space-2);">${p.name}</h2>
          <div class="card-price tabular" style="font-size: 1.5rem;">$${p.price.toFixed(2)}</div>
          
          <!-- Tabs -->
          <div style="display: flex; gap: var(--space-4); border-bottom: 1px solid var(--color-border); margin: var(--space-4) 0;">
            <button class="btn qv-tab active" data-tab="overview" style="border-radius:0; padding: var(--space-2) 0; border-bottom: 2px solid var(--color-primary); background:none;">Overview</button>
            <button class="btn qv-tab" data-tab="specs" style="border-radius:0; padding: var(--space-2) 0; border-bottom: 2px solid transparent; background:none;">Specs</button>
            <button class="btn qv-tab" data-tab="reviews" style="border-radius:0; padding: var(--space-2) 0; border-bottom: 2px solid transparent; background:none;">Reviews</button>
          </div>
          
          <div id="qv-overview" class="qv-panel">
            <p style="color: var(--color-text-muted);">A high-quality ${p.density} ${p.type.toLowerCase()} designed for effective muscle release and recovery.</p>
            <div style="margin-bottom: var(--space-4);">
              <span style="display:inline-block; padding: 4px 8px; border-radius:4px; font-size:0.875rem; font-weight:500; background: ${inStock ? 'var(--color-bg)' : '#FEE2E2'}; color: ${inStock ? 'var(--color-success)' : 'var(--color-error)'};">
                ${inStock ? `In Stock (${p.stock})` : 'Out of Stock'}
              </span>
            </div>
            <button class="btn btn-primary" onclick="addToCart('${p.id}')" style="width:100%;" ${!inStock ? 'disabled' : ''}>Add to Cart</button>
          </div>
          
          <div id="qv-specs" class="qv-panel" style="display:none; font-size: 0.875rem;">
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding: 4px 0; font-weight: 500;">Length</td><td style="padding: 4px 0;">${p.length} cm</td></tr>
              <tr><td style="padding: 4px 0; font-weight: 500;">Diameter</td><td style="padding: 4px 0;">${p.diameter} cm</td></tr>
              <tr><td style="padding: 4px 0; font-weight: 500;">Weight</td><td style="padding: 4px 0;">${p.weight} kg</td></tr>
              <tr><td style="padding: 4px 0; font-weight: 500;">Density</td><td style="padding: 4px 0; text-transform: capitalize;">${p.density}</td></tr>
              <tr><td style="padding: 4px 0; font-weight: 500;">Material</td><td style="padding: 4px 0;">${p.material}</td></tr>
              <tr><td style="padding: 4px 0; font-weight: 500;">Surface</td><td style="padding: 4px 0;">${p.surface}</td></tr>
              <tr><td style="padding: 4px 0; font-weight: 500;">Core</td><td style="padding: 4px 0;">${p.core}</td></tr>
            </table>
          </div>
          
          <div id="qv-reviews" class="qv-panel" style="display:none; font-size: 0.875rem; max-height: 200px; overflow-y:auto;">
            ${renderProductReviews(p.id)}
          </div>
        </div>
      </div>
    `;

    qvOverlay.classList.add('active');

    // Tab switching logic
    const tabs = qvContent.querySelectorAll('.qv-tab');
    const panels = qvContent.querySelectorAll('.qv-panel');
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(btn => { btn.style.borderBottomColor = 'transparent'; btn.classList.remove('active'); });
      t.style.borderBottomColor = 'var(--color-primary)';
      t.classList.add('active');
      panels.forEach(pnl => pnl.style.display = 'none');
      document.getElementById(`qv-${t.dataset.tab}`).style.display = 'block';
    }));
    
    // Focus trap setup
    const focusable = qvOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function renderProductReviews(productId) {
    const prodRevs = reviews.filter(r => r.productId === productId);
    if (prodRevs.length === 0) return '<p>No reviews yet.</p>';
    
    return prodRevs.map(r => `
      <div style="border-bottom: 1px solid var(--color-border); padding-bottom: 8px; margin-bottom: 8px;">
        <div style="display:flex; justify-content:space-between;">
          <strong>${r.author}</strong>
          <span style="color:#F59E0B"><i class="ph-fill ph-star"></i> ${r.rating}</span>
        </div>
        <div style="color:var(--color-success); font-size:0.75rem; margin-bottom:4px;"><i class="ph-fill ph-check-circle"></i> Verified Buyer</div>
        <p style="margin:0;">${r.text}</p>
      </div>
    `).join('');
  }

  qvClose.addEventListener('click', () => qvOverlay.classList.remove('active'));
  qvOverlay.addEventListener('click', (e) => {
    if(e.target === qvOverlay) qvOverlay.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && qvOverlay.classList.contains('active')) qvOverlay.classList.remove('active');
  });

  // --- Render Global Reviews Section ---
  const reviewsGrid = document.getElementById('reviews-grid');
  if (reviewsGrid) {
    reviewsGrid.innerHTML = reviews.slice(0, 3).map(r => {
      const prod = products.find(p => p.id === r.productId);
      return `
        <div class="card" style="align-items:flex-start; text-align:left;">
          <div style="display:flex; gap:var(--space-2); color:#F59E0B; margin-bottom:var(--space-2);">
            ${Array(r.rating).fill('<i class="ph-fill ph-star"></i>').join('')}
          </div>
          <p style="flex:1;">"${r.text}"</p>
          <div style="width:100%; display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--color-border); padding-top:var(--space-2); margin-top:var(--space-4);">
            <div>
              <strong>${r.author}</strong><br>
              <span style="font-size:0.75rem; color:var(--color-success);"><i class="ph-fill ph-check-circle"></i> Verified</span>
            </div>
            <div style="font-size:0.75rem; color:var(--color-text-muted); text-align:right;">
              For ${prod ? prod.name : 'Roller'}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
});
