// main.js
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  
  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    mobileBtn.innerHTML = navLinks.classList.contains('open') ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
  });

  // Dropdown on mobile
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdown = document.querySelector('.dropdown');
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  }

  // Smooth scroll & close mobile nav
  document.querySelectorAll('.nav-link, .dropdown-item, .footer-link, .btn').forEach(link => {
    if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if(targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          navLinks.classList.remove('open');
          mobileBtn.innerHTML = '<i class="ph ph-list"></i>';
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });

  // Scroll Spy & Reveal
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links .nav-link');
  const reveals = document.querySelectorAll('.reveal');
  const backToTop = document.getElementById('back-to-top');

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(navItem => {
          navItem.classList.remove('active');
          if (navItem.getAttribute('href') === `#${id}`) {
            navItem.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -100px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // Navbar border once scrolled
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Back to top
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Auth Status Navbar
  updateAuthNav();

  // Newsletter
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('newsletter-msg');
      msg.textContent = 'Thanks for subscribing! Check your email for the code.';
      msg.style.color = 'var(--color-success)';
      nlForm.reset();
    });
  }

  // Contact form (demo: validates and confirms, nothing is sent)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('contact-msg');
      const fields = contactForm.querySelectorAll('[required]');
      let firstInvalid = null;
      fields.forEach(f => {
        const valid = f.checkValidity() && f.value.trim() !== '';
        f.classList.toggle('error', !valid);
        if (!valid && !firstInvalid) firstInvalid = f;
      });
      if (firstInvalid) {
        msg.textContent = 'Please fill in your name, a valid email, and a message of at least 10 characters.';
        msg.style.color = 'var(--color-error)';
        firstInvalid.focus();
        return;
      }
      const name = document.getElementById('contact-name').value.trim().split(' ')[0];
      msg.textContent = `Thanks, ${name}! Your message has been received. We'll reply within one business day.`;
      msg.style.color = 'var(--color-success)';
      contactForm.reset();
    });
    contactForm.addEventListener('input', (e) => e.target.classList.remove('error'));
  }
});

function updateAuthNav() {
  ['auth-nav-slot', 'auth-nav-slot-mobile'].forEach(id => {
    const slot = document.getElementById(id);
    if (slot) renderAuthSlot(slot);
  });
}

function renderAuthSlot(authSlot) {

  const session = JSON.parse(localStorage.getItem('rollora_session'));
  if (session) {
    authSlot.innerHTML = `
      <span style="font-size: 0.875rem; margin-right: var(--space-2);">${session.name}</span>
      <button onclick="logout()" class="btn btn-outline" style="padding: var(--space-1) var(--space-3); font-size: 0.875rem; border:none;">Logout</button>
    `;
  } else {
    authSlot.innerHTML = `<a href="auth.html" class="btn btn-outline" style="padding: var(--space-2) var(--space-4);">Login</a>`;
  }
}

window.logout = function() {
  localStorage.removeItem('rollora_session');
  window.location.reload();
}
