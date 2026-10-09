// dashboard.js
document.addEventListener('DOMContentLoaded', () => {
  // Mobile sidebar menu
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  function setSidebarOpen(open) {
    sidebar.classList.toggle('open', open);
    sidebarToggle.setAttribute('aria-expanded', open);
    sidebarToggle.innerHTML = open ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
  }
  sidebarToggle.addEventListener('click', () => setSidebarOpen(!sidebar.classList.contains('open')));

  // Guides / Routines tabs
  const tabGuides = document.getElementById('tab-guides');
  const tabRoutines = document.getElementById('tab-preset-routines');
  function showRoutineTab(showGuides) {
    tabGuides.classList.toggle('active', showGuides);
    tabRoutines.classList.toggle('active', !showGuides);
    tabGuides.setAttribute('aria-selected', showGuides);
    tabRoutines.setAttribute('aria-selected', !showGuides);
    document.getElementById('guides-list').style.display = showGuides ? 'block' : 'none';
    document.getElementById('routines-list').style.display = showGuides ? 'none' : 'block';
  }
  tabGuides.addEventListener('click', () => showRoutineTab(true));
  tabRoutines.addEventListener('click', () => showRoutineTab(false));

  // Navigation
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const viewPanels = document.querySelectorAll('.view-panel');
  const pageTitle = document.getElementById('page-title');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebarLinks.forEach(l => {
        l.classList.remove('active');
        l.style.color = '#9CA3AF';
      });
      link.classList.add('active');
      link.style.color = 'var(--color-surface)';

      viewPanels.forEach(p => p.classList.remove('active'));
      const viewId = link.dataset.view;
      document.getElementById(`view-${viewId}`).classList.add('active');
      
      pageTitle.textContent = link.textContent.trim();
      setSidebarOpen(false);
      
      if (viewId === 'overview') renderOverview();
    });
  });

  // Welcome banner
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const session = JSON.parse(localStorage.getItem('rollora_session'));
  document.getElementById('welcome-title').textContent = session ? `${greeting}, ${session.name.split(' ')[0]}` : greeting;
  document.getElementById('welcome-date').textContent = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector(`.sidebar-link[data-view="${btn.dataset.goto}"]`).click();
      if (btn.dataset.goto === 'products') document.getElementById('add-product-btn').click();
    });
  });

  // Data Loading
  let products = window.store.get('products');
  let guides = window.store.get('guides');
  let routines = window.store.get('routines');
  let orders = window.store.get('orders');

  function renderOverview() {
    const rev = orders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('stat-revenue').textContent = `$${rev.toFixed(2)}`;
    document.getElementById('stat-orders').textContent = orders.length;
    document.getElementById('stat-products').textContent = products.length;
    document.getElementById('stat-low-stock').textContent = products.filter(p => p.stock < 5).length;
    
    // Fake Chart for order status
    const statusCount = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status]||0)+1; return acc; }, {});
    const chartContainer = document.getElementById('orders-status-chart');
    chartContainer.innerHTML = Object.entries(statusCount).map(([status, count]) => `
      <div style="margin-bottom:8px;">
        <div style="display:flex; justify-content:space-between; font-size:0.875rem;">
          <span style="text-transform:capitalize;">${status}</span>
          <span>${count}</span>
        </div>
        <div style="width:100%; height:8px; background:var(--color-bg); border-radius:4px; overflow:hidden;">
          <div style="width:${(count/orders.length)*100}%; height:100%; background:var(--color-primary);"></div>
        </div>
      </div>
    `).join('');
  }

  function renderProducts() {
    const tbody = document.querySelector('#products-table tbody');
    const query = document.getElementById('search-products').value.toLowerCase();
    
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    
    tbody.innerHTML = filtered.map(p => `
      <tr>
        <td class="cell-product">
          <div class="product-cell">
            <img src="${p.image}" alt="">
            <span>${p.name}</span>
          </div>
        </td>
        <td data-label="Type">${p.type}</td>
        <td data-label="Price" class="tabular">$${p.price.toFixed(2)}</td>
        <td data-label="Stock">
          <span class="${p.stock < 5 ? 'badge badge-error' : ''}">${p.stock}</span>
        </td>
        <td data-label="Status"><span class="badge ${p.status==='active'?'badge-success':'badge-warning'}">${p.status}</span></td>
        <td class="cell-actions">
          <div class="row-actions">
            <button class="icon-btn edit-product" data-id="${p.id}" aria-label="Edit ${p.name}" title="Edit"><i class="ph ph-pencil-simple"></i></button>
            <button class="icon-btn icon-btn-danger del-product" data-id="${p.id}" aria-label="Delete ${p.name}" title="Delete"><i class="ph ph-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.del-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if(confirm('Delete product?')) {
          products = products.filter(x => x.id !== e.currentTarget.dataset.id);
          window.store.set('products', products);
          renderProducts();
          renderOverview();
        }
      });
    });
  }

  function renderOrders() {
    const tbody = document.querySelector('#orders-table tbody');
    const query = document.getElementById('search-orders').value.toLowerCase();
    const statusFilter = document.getElementById('filter-orders').value;
    
    const filtered = orders.filter(o => {
      return o.id.toLowerCase().includes(query) && (statusFilter === '' || o.status === statusFilter);
    });

    tbody.innerHTML = filtered.map(o => `
      <tr>
        <td class="cell-order-id"><strong>${o.id}</strong></td>
        <td data-label="Date" class="tabular">${new Date(o.date).toLocaleDateString()}</td>
        <td data-label="Customer">${o.customer.name}</td>
        <td data-label="Total" class="tabular">$${o.total.toFixed(2)}</td>
        <td data-label="Status"><span class="badge ${getStatusClass(o.status)}">${o.status}</span></td>
        <td class="cell-actions">
          <div class="row-actions">
            <button class="icon-btn view-order" data-id="${o.id}" aria-label="View order ${o.id}" title="View"><i class="ph ph-eye"></i></button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.view-order').forEach(btn => {
      btn.addEventListener('click', (e) => openOrderModal(e.currentTarget.dataset.id));
    });
  }

  function getStatusClass(status) {
    if (status === 'delivered') return 'badge-success';
    if (status === 'cancelled') return 'badge-error';
    return 'badge-warning';
  }

  // Bind Listeners
  document.getElementById('search-products').addEventListener('input', renderProducts);
  document.getElementById('search-orders').addEventListener('input', renderOrders);
  document.getElementById('filter-orders').addEventListener('change', renderOrders);
  
  document.getElementById('logout-link').addEventListener('click', () => {
    localStorage.removeItem('rollora_session');
  });

  // Order Modal Logic
  const orderOverlay = document.getElementById('order-modal-overlay');
  let currentOrder = null;

  function openOrderModal(id) {
    currentOrder = orders.find(o => o.id === id);
    if (!currentOrder) return;
    
    document.getElementById('order-details-content').innerHTML = `
      <div style="margin-bottom:var(--space-4);">
        <p><strong>Customer:</strong> ${currentOrder.customer.name} (${currentOrder.customer.email})</p>
        <p><strong>Date:</strong> ${new Date(currentOrder.date).toLocaleString()}</p>
        <p><strong>Total:</strong> $${currentOrder.total.toFixed(2)}</p>
      </div>
      <h4 style="margin-bottom:var(--space-2);">Items</h4>
      <ul style="list-style:none; padding:0;">
        ${currentOrder.items.map(item => {
          const p = products.find(x => x.id === item.productId);
          return `<li style="padding:4px 0; border-bottom:1px solid var(--color-border);">${p ? p.name : item.productId} x${item.quantity} - $${(item.price||(p?p.price:0)).toFixed(2)}</li>`;
        }).join('')}
      </ul>
    `;
    document.getElementById('order-status-update').value = currentOrder.status;
    orderOverlay.classList.add('active');
  }

  document.getElementById('order-close').addEventListener('click', () => orderOverlay.classList.remove('active'));
  document.getElementById('order-save-status').addEventListener('click', () => {
    if (!currentOrder) return;
    const newStatus = document.getElementById('order-status-update').value;
    
    // If cancelling, restore stock
    if (newStatus === 'cancelled' && currentOrder.status !== 'cancelled') {
      currentOrder.items.forEach(item => {
        const pIndex = products.findIndex(x => x.id === item.productId);
        if (pIndex > -1) products[pIndex].stock += item.quantity;
      });
      window.store.set('products', products);
      renderProducts();
    }
    
    currentOrder.status = newStatus;
    window.store.set('orders', orders);
    renderOrders();
    renderOverview();
    orderOverlay.classList.remove('active');
  });

  // Init
  renderOverview();
  renderProducts();
  renderOrders();
});
