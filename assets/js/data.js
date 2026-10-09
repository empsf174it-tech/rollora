const DEMO_DATA_VERSION = '1.3';

const defaultProducts = [
  { id: 'p1', name: 'Velocity Grid Roller', brand: 'Rollora', type: 'Textured/grid', length: 33, diameter: 14, weight: 0.7, density: 'firm', material: 'EVA Foam', surface: 'Grid', core: 'Hollow core with storage', vibration: false, price: 45.00, stock: 15, features: ['hollow core with storage', 'travel size'], bestFor: ['lats', 'quads', 'lower back'], image: 'https://images.pexels.com/photos/6207519/pexels-photo-6207519.jpeg?auto=compress&cs=tinysrgb&w=600', featured: true, status: 'active', rating: 4.8, reviewCount: 124 },
  { id: 'p2', name: 'Zenith Smooth Core', brand: 'Rollora', type: 'Smooth foam', length: 45, diameter: 15, weight: 0.5, density: 'soft', material: 'EPE Foam', surface: 'Smooth', core: 'Solid', vibration: false, price: 25.00, stock: 40, features: [], bestFor: ['neck and upper back', 'calves'], image: 'https://images.pexels.com/photos/16513603/pexels-photo-16513603.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false, status: 'active', rating: 4.5, reviewCount: 89 },
  { id: 'p3', name: 'Pulse Vibe Pro', brand: 'Rollora', type: 'Vibrating', length: 30, diameter: 10, weight: 1.2, density: 'extra firm', material: 'High-density EPP', surface: 'Textured', core: 'Solid with battery', vibration: true, price: 129.00, stock: 5, features: ['vibration', 'rechargeable'], bestFor: ['hips and IT band', 'hamstrings'], image: 'https://images.pexels.com/photos/4804294/pexels-photo-4804294.jpeg?auto=compress&cs=tinysrgb&w=600', featured: true, status: 'active', rating: 4.9, reviewCount: 210 },
  { id: 'p4', name: 'Aero Travel Mini', brand: 'Rollora', type: 'Travel/mini', length: 20, diameter: 10, weight: 0.3, density: 'medium', material: 'EVA Foam', surface: 'Smooth', core: 'Hollow', vibration: false, price: 30.00, stock: 0, features: ['travel size'], bestFor: ['feet', 'shoulders'], image: 'https://images.pexels.com/photos/4378850/pexels-photo-4378850.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false, status: 'active', rating: 4.2, reviewCount: 45 },
  { id: 'p5', name: 'Precision Massage Ball', brand: 'Rollora', type: 'Massage ball and stick', length: 8, diameter: 8, weight: 0.2, density: 'extra firm', material: 'Silicone', surface: 'Smooth', core: 'Solid', vibration: false, price: 15.00, stock: 100, features: [], bestFor: ['feet', 'glutes'], image: 'https://images.pexels.com/photos/39059979/pexels-photo-39059979.jpeg?auto=compress&cs=tinysrgb&w=600', featured: true, status: 'active', rating: 4.7, reviewCount: 320 },
  { id: 'p6', name: 'Contour Deep Tissue Roller', brand: 'Rollora', type: 'Textured/grid', length: 33, diameter: 13, weight: 0.6, density: 'firm', material: 'EVA Foam', surface: 'Spiked grid', core: 'Hollow', vibration: false, price: 39.00, stock: 22, features: [], bestFor: ['neck and upper back', 'lats'], image: 'https://images.pexels.com/photos/20890280/pexels-photo-20890280.jpeg?auto=compress&cs=tinysrgb&w=600', featured: false, status: 'active', rating: 4.6, reviewCount: 76 }
];

const defaultTechniqueGuides = [
  { id: 'g1', title: 'Quad Release', bodyArea: 'quads', difficulty: 'Beginner', time: 120, passes: 10, steps: ['Lie face down with the roller under your thighs.', 'Support your weight on your forearms.', 'Slowly roll from just above the knee to the hip.', 'Pause on any tight spots for 15-30 seconds.'], mistakes: ['Rolling directly over the knee joint.', 'Moving too fast without pausing on trigger points.'], cautions: 'Stop if you feel sharp or shooting pain. Do not roll over the knee cap.', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80', status: 'published' },
  { id: 'g2', title: 'Upper Back Loosen', bodyArea: 'neck and upper back', difficulty: 'Beginner', time: 90, passes: 8, steps: ['Lie on your back with the roller placed horizontally across your mid-back.', 'Bend your knees and place your feet flat on the floor.', 'Support your head with your hands and lift your hips.', 'Roll slowly from your mid-back to the top of your shoulder blades.'], mistakes: ['Rolling on the neck or lower back.', 'Holding breath.'], cautions: 'Avoid rolling the lower back or neck area. Only roll the thoracic spine.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80', status: 'published' },
  { id: 'g3', title: 'Calf Relief', bodyArea: 'calves', difficulty: 'Beginner', time: 60, passes: 6, steps: ['Sit on the floor with your legs straight in front of you.', 'Place the roller under your calves.', 'Lift your hips off the floor using your hands.', 'Roll from below the knee down to the ankle.'], mistakes: ['Rolling behind the knee joint.', 'Not maintaining core stability.'], cautions: 'Stop if you feel numbness or tingling in your foot.', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80', status: 'published' }
];

const defaultRoutines = [
  { id: 'r1', name: '5-Minute Warm-up', goal: 'Warm-up', steps: [{ area: 'calves', seconds: 60 }, { area: 'quads', seconds: 60 }, { area: 'upper back', seconds: 60 }], status: 'published' },
  { id: 'r2', name: '10-Minute Post-Run Recovery', goal: 'Recovery', steps: [{ area: 'calves', seconds: 120 }, { area: 'hamstrings', seconds: 120 }, { area: 'quads', seconds: 120 }, { area: 'hips and IT band', seconds: 120 }], status: 'published' },
  { id: 'r3', name: '8-Minute Desk Reset', goal: 'Desk Stiffness', steps: [{ area: 'upper back', seconds: 120 }, { area: 'lats', seconds: 120 }, { area: 'glutes', seconds: 120 }], status: 'published' }
];

const defaultReviews = [
  { id: 'rev1', productId: 'p1', author: 'Alex M.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 5, date: '2023-10-15', text: 'This grid roller completely changed my recovery game. Perfect firmness.', verified: true },
  { id: 'rev2', productId: 'p3', author: 'Jamie T.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 5, date: '2023-11-02', text: 'The vibration feature is worth every penny. Excellent for deep tissue.', verified: true },
  { id: 'rev3', productId: 'p1', author: 'Chris R.', avatar: 'https://randomuser.me/api/portraits/men/75.jpg', rating: 4, date: '2023-09-20', text: 'Good roller, maybe a bit too firm for beginners.', verified: true },
];

const defaultOrders = [
  { id: 'ORD-1001', date: '2023-11-10T14:30:00Z', items: [{ productId: 'p1', quantity: 1, price: 45.00 }], total: 54.50, status: 'delivered', customer: { name: 'Demo User', email: 'demo@rollora.demo' } }
];

function initData() {
  if (!localStorage.getItem('rollora_version') || localStorage.getItem('rollora_version') !== DEMO_DATA_VERSION) {
    localStorage.setItem('rollora_products', JSON.stringify(defaultProducts));
    localStorage.setItem('rollora_guides', JSON.stringify(defaultTechniqueGuides));
    localStorage.setItem('rollora_routines', JSON.stringify(defaultRoutines));
    localStorage.setItem('rollora_reviews', JSON.stringify(defaultReviews));
    localStorage.setItem('rollora_orders', JSON.stringify(defaultOrders));
    localStorage.setItem('rollora_version', DEMO_DATA_VERSION);
  }
}

initData();

window.store = {
  get: (key) => JSON.parse(localStorage.getItem(`rollora_${key}`) || '[]'),
  set: (key, data) => localStorage.setItem(`rollora_${key}`, JSON.stringify(data)),
  reset: () => {
    localStorage.clear();
    initData();
  }
};
