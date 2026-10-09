// techniques.js
document.addEventListener('DOMContentLoaded', () => {
  const tabsContainer = document.getElementById('guide-tabs');
  const contentContainer = document.getElementById('guide-content');
  
  if (!tabsContainer || !contentContainer) return;

  const guides = window.store.get('guides').filter(g => g.status === 'published');
  
  function renderTabs() {
    tabsContainer.innerHTML = guides.map((g, idx) => `
      <button class="btn btn-outline guide-tab-btn" data-id="${g.id}">
        ${g.title}
      </button>
    `).join('');
    
    document.querySelectorAll('.guide-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => openGuide(btn.dataset.id));
    });
  }

  window.openGuide = function(id) {
    const guide = guides.find(g => g.id === id);
    if (!guide) return;

    // Update active tab UI
    document.querySelectorAll('.guide-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === id);
    });

    // Render content
    contentContainer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-6); flex-wrap:wrap; gap:var(--space-4);">
        <div>
          <h3 style="margin-bottom:var(--space-2); color:var(--color-primary);">${guide.title}</h3>
          <div style="display:flex; flex-wrap:wrap; gap:var(--space-2) var(--space-4); font-size:0.875rem; color:var(--color-text-muted);">
            <span><i class="ph ph-target"></i> ${guide.bodyArea}</span>
            <span><i class="ph ph-barbell"></i> ${guide.difficulty}</span>
            <span><i class="ph ph-clock"></i> ${guide.time}s</span>
            <span><i class="ph ph-arrows-left-right"></i> ${guide.passes} passes</span>
          </div>
        </div>
        <button class="btn btn-primary" onclick="loadGuideIntoTimer('${guide.id}')"><i class="ph ph-timer"></i> Start Timer</button>
      </div>

      <img src="${guide.image}" alt="${guide.title}" style="width:100%; height: 250px; object-fit:cover; border-radius:var(--radius); margin-bottom:var(--space-6);">

      <h4 style="margin-bottom:var(--space-2);">Steps</h4>
      <ol style="padding-left:var(--space-4); margin-bottom:var(--space-6);">
        ${guide.steps.map(s => `<li style="margin-bottom:8px;">${s}</li>`).join('')}
      </ol>

      <div class="guide-notes">
        <div style="background:#FFFBEB; padding:var(--space-4); border-radius:var(--radius); border-left:3px solid #F59E0B;">
          <h4 style="color:#D97706; margin-bottom:8px; font-size:0.875rem;"><i class="ph-fill ph-warning-circle"></i> Common Mistakes</h4>
          <ul style="padding-left:16px; margin:0; font-size:0.875rem;">
            ${guide.mistakes.map(m => `<li>${m}</li>`).join('')}
          </ul>
        </div>
        <div style="background:#FEF2F2; padding:var(--space-4); border-radius:var(--radius); border-left:3px solid #EF4444;">
          <h4 style="color:#B91C1C; margin-bottom:8px; font-size:0.875rem;"><i class="ph-fill ph-stop-circle"></i> Stop If...</h4>
          <p style="margin:0; font-size:0.875rem;">${guide.cautions}</p>
        </div>
      </div>
    `;
    
    // Smooth scroll to guide if called externally
    const techSection = document.getElementById('techniques');
    if(techSection) techSection.scrollIntoView({ behavior: 'smooth' });
  };

  window.loadGuideIntoTimer = function(guideId) {
    const guide = guides.find(g => g.id === guideId);
    if (!guide) return;
    
    // Create a custom routine object to pass to timer
    const customRoutine = {
      name: guide.title,
      steps: [{ area: guide.bodyArea, seconds: guide.time }]
    };
    
    localStorage.setItem('rollora_active_routine', JSON.stringify(customRoutine));
    
    const timerSection = document.getElementById('timer');
    if (timerSection) timerSection.scrollIntoView({ behavior: 'smooth' });
    
    // Trigger event for timer.js
    document.dispatchEvent(new CustomEvent('routine-loaded'));
  };

  if (guides.length > 0) {
    renderTabs();
    openGuide(guides[0].id);
  }
});
