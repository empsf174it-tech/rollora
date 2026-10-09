// bodymap.js
document.addEventListener('DOMContentLoaded', () => {
  const regions = document.querySelectorAll('.body-region');
  const recContainer = document.getElementById('body-recommendation');
  const btnFront = document.getElementById('btn-front');
  const btnBack = document.getElementById('btn-back');
  
  if (!recContainer) return;

  const areaAdvice = {
    'neck and upper back': { density: 'Soft or Medium', type: 'Smooth foam', why: 'Gentle pressure is needed for the sensitive cervical and upper thoracic spine area.', time: '90 seconds', guide: 'g2' },
    'shoulders': { density: 'Medium', type: 'Travel/mini or Smooth', why: 'Smaller rollers or gentle smooth surfaces target the deltoids effectively without joint strain.', time: '60 seconds', guide: null },
    'lats': { density: 'Medium or Firm', type: 'Textured/grid', why: 'The latissimus dorsi responds well to moderate to firm pressure to release tension from pulling movements.', time: '120 seconds', guide: null },
    'lower back': { density: 'Soft', type: 'Smooth foam', why: 'Avoid direct pressure on the lumbar spine; use soft density to gently release surrounding fascia.', time: '60 seconds', guide: null },
    'glutes': { density: 'Firm or Extra Firm', type: 'Massage ball or Grid', why: 'Thick muscle tissue requires targeted, firm pressure to reach deep trigger points.', time: '120 seconds', guide: null },
    'hips and IT band': { density: 'Medium', type: 'Textured/grid', why: 'The IT band can be very sensitive; start with medium pressure and avoid rolling directly over the hip bone.', time: '90 seconds', guide: null },
    'quads': { density: 'Firm', type: 'Textured/grid', why: 'Large leg muscles need firm, deep pressure to effectively break up adhesions.', time: '120 seconds', guide: 'g1' },
    'hamstrings': { density: 'Firm', type: 'Vibrating or Grid', why: 'Vibration helps relax the hamstrings while firm pressure works out the tightness.', time: '120 seconds', guide: null },
    'calves': { density: 'Medium or Firm', type: 'Smooth foam', why: 'Smooth foam allows for a flushing effect from the ankle up toward the knee.', time: '60 seconds', guide: 'g3' },
    'feet': { density: 'Extra Firm', type: 'Massage ball', why: 'The plantar fascia requires focused, extra firm pressure from a small massage ball.', time: '60 seconds', guide: null }
  };

  regions.forEach(region => {
    region.addEventListener('click', () => selectArea(region));
    region.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectArea(region);
      }
    });
  });

  function selectArea(region) {
    regions.forEach(r => r.classList.remove('selected'));
    region.classList.add('selected');
    
    const area = region.dataset.area;
    const advice = areaAdvice[area];
    if (!advice) return;

    // Find matching products
    const products = window.store.get('products');
    const matches = products.filter(p => p.bestFor.includes(area) && p.stock > 0).slice(0, 2);
    
    let matchHTML = '';
    if (matches.length > 0) {
      matchHTML = `
        <h4 style="margin: 16px 0 8px; font-size: 0.875rem;">Recommended In-Stock Rollers:</h4>
        <div style="display:flex; gap: 8px; flex-direction: column;">
          ${matches.map(m => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--color-surface); padding:8px; border-radius:4px;">
              <span style="font-weight:500; font-size:0.875rem;">${m.name}</span>
              <button class="btn btn-outline" style="padding:2px 8px; font-size:0.75rem;" onclick="addToCart('${m.id}')">Add</button>
            </div>
          `).join('')}
        </div>
      `;
    }

    recContainer.innerHTML = `
      <h4 style="color: var(--color-primary); font-size: 1.125rem; margin-bottom: 8px; text-transform: capitalize;">${area}</h4>
      <p style="font-size: 0.875rem; margin-bottom: 8px;"><strong>Density:</strong> ${advice.density} | <strong>Type:</strong> ${advice.type}</p>
      <p style="font-size: 0.875rem; margin-bottom: 16px; color: var(--color-text-muted);">${advice.why}</p>
      
      <div style="background: var(--color-bg); padding: 8px; border-radius: 4px; font-size: 0.875rem; border-left: 3px solid var(--color-accent);">
        <strong>Suggested Routine:</strong> Roll slowly for ${advice.time}. 
        ${advice.guide ? `<br><a href="#techniques" style="font-weight:500; display:inline-block; margin-top:4px;" onclick="window.openGuide('${advice.guide}')">View Technique Guide &rarr;</a>` : ''}
      </div>
      
      ${matchHTML}
    `;
  }

  // Toggle front/back (Visual only for demo)
  if (btnFront && btnBack) {
    btnFront.addEventListener('click', () => {
      btnFront.classList.add('active');
      btnBack.classList.remove('active');
    });
    btnBack.addEventListener('click', () => {
      btnBack.classList.add('active');
      btnFront.classList.remove('active');
    });
  }
});
