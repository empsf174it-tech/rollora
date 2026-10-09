// compare.js
document.addEventListener('DOMContentLoaded', () => {
  const compareTray = document.getElementById('sticky-compare-tray');
  const compareCount = document.getElementById('compare-count');
  const compareNames = document.getElementById('compare-names');
  const clearBtn = document.getElementById('clear-compare-btn');
  const compareContainer = document.getElementById('compare-container');
  
  let compareList = JSON.parse(localStorage.getItem('rollora_compare') || '[]');
  
  window.toggleCompare = function(id, isChecked) {
    if (isChecked) {
      if (compareList.length >= 4) {
        alert('You can only compare up to 4 items at once.');
        // Uncheck the box that just triggered this
        const cb = document.querySelector(`.compare-cb[data-id="${id}"]`);
        if(cb) cb.checked = false;
        return;
      }
      if (!compareList.includes(id)) compareList.push(id);
    } else {
      compareList = compareList.filter(x => x !== id);
    }
    
    localStorage.setItem('rollora_compare', JSON.stringify(compareList));
    updateCompareUI();
  };

  function updateCompareUI() {
    if (!compareTray) return;
    
    if (compareList.length > 0) {
      compareTray.style.display = 'flex';
      compareCount.textContent = compareList.length;
      
      const products = window.store.get('products');
      const names = compareList.map(id => {
        const p = products.find(x => x.id === id);
        return p ? p.name : '';
      }).join(', ');
      
      compareNames.textContent = names.length > 30 ? names.substring(0, 27) + '...' : names;
    } else {
      compareTray.style.display = 'none';
    }
    
    renderCompareTable();
  }

  function renderCompareTable() {
    if (!compareContainer) return;
    
    if (compareList.length === 0) {
      compareContainer.innerHTML = '<p style="text-align: center; padding: var(--space-8);">Select products from the shop to compare them.</p>';
      return;
    }

    const products = window.store.get('products');
    const items = compareList.map(id => products.find(x => x.id === id)).filter(Boolean);
    
    if (items.length === 0) return;

    let html = '<table class="compare-table">';
    
    // Header
    html += '<thead><tr><th>Feature</th>';
    items.forEach(item => {
      html += `<th>
        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin: 0 auto 8px;">
        <div style="font-weight: 500; margin-bottom: 4px;">${item.name}</div>
        <div class="card-price tabular" style="font-size: 1.125rem; margin-bottom: 8px;">$${item.price.toFixed(2)}</div>
        <button class="btn btn-primary" style="padding: 4px 12px; font-size: 0.75rem;" onclick="addToCart('${item.id}')" ${item.stock <= 0 ? 'disabled' : ''}>Add</button>
      </th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Rows
    const rows = [
      { label: 'Rating', key: 'rating', format: v => `<i class="ph-fill ph-star" style="color:#F59E0B"></i> ${v}` },
      { label: 'Type', key: 'type' },
      { label: 'Density', key: 'density', format: v => `<span style="text-transform:capitalize;">${v}</span>` },
      { label: 'Length', key: 'length', format: v => `${v} cm` },
      { label: 'Diameter', key: 'diameter', format: v => `${v} cm` },
      { label: 'Weight', key: 'weight', format: v => `${v} kg` },
      { label: 'Material', key: 'material' },
      { label: 'Surface', key: 'surface' },
      { label: 'Core', key: 'core' },
      { label: 'Vibration', key: 'vibration', format: v => v ? 'Yes' : 'No' }
    ];

    rows.forEach(row => {
      html += `<tr><td>${row.label}</td>`;
      items.forEach(item => {
        let val = item[row.key];
        if (row.format) val = row.format(val);
        html += `<td>${val}</td>`;
      });
      html += `</tr>`;
    });

    html += '</tbody></table>';
    compareContainer.innerHTML = html;
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      compareList = [];
      localStorage.setItem('rollora_compare', JSON.stringify(compareList));
      // Uncheck all boxes
      document.querySelectorAll('.compare-cb').forEach(cb => cb.checked = false);
      updateCompareUI();
    });
  }

  // Initial render
  updateCompareUI();
});
