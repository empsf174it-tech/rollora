// density.js
document.addEventListener('DOMContentLoaded', () => {
  const points = document.querySelectorAll('.density-point');
  const infoContainer = document.getElementById('density-info');
  
  if (!points.length || !infoContainer) return;

  const densityData = {
    'soft': {
      title: 'Soft Density',
      feels: 'Gentle, yielding pressure that compresses easily under weight.',
      best: 'Beginners, highly sensitive muscles, older adults, or areas like the neck and calves.',
      tip: 'Start softer and progress gradually as your tissues adapt.'
    },
    'medium': {
      title: 'Medium Density',
      feels: 'Moderate pressure with some give. The standard "all-rounder".',
      best: 'Regular exercisers, general maintenance, IT bands, and lats.',
      tip: 'Ideal for everyday recovery routines without causing excessive pain.'
    },
    'firm': {
      title: 'Firm Density',
      feels: 'Strong, deep pressure with very little compression.',
      best: 'Experienced users, dense muscle groups like quads and hamstrings.',
      tip: 'Effective for breaking up stubborn adhesions, but avoid rolling over bones.'
    },
    'extra firm': {
      title: 'Extra Firm Density',
      feels: 'Intense, hard pressure (often made of PVC pipe core or silicone).',
      best: 'Advanced users requiring very deep tissue massage, soles of feet, glutes.',
      tip: 'Use cautiously. Pain should be "good pain", never sharp or shooting.'
    }
  };

  points.forEach(point => {
    point.addEventListener('click', () => updateDensity(point));
    point.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateDensity(point);
      }
    });
  });

  function updateDensity(point) {
    points.forEach(p => p.classList.remove('active'));
    point.classList.add('active');
    
    const density = point.dataset.density;
    const data = densityData[density];
    
    if (data) {
      infoContainer.innerHTML = `
        <h3 style="margin-bottom: var(--space-2); color: var(--color-primary);">${data.title}</h3>
        <p style="font-size: 0.875rem;"><strong>Feels like:</strong> ${data.feels}<br>
        <strong>Best for:</strong> ${data.best}</p>
        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-top: var(--space-4);">Tip: ${data.tip}</p>
      `;
    }
  }
});
