// auth.js
document.addEventListener('DOMContentLoaded', () => {
  const session = JSON.parse(localStorage.getItem('rollora_session'));
  
  // Guard on auth page: if already logged in, redirect
  if (window.location.pathname.endsWith('auth.html') && session) {
    if (session.role === 'admin') {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
    return;
  }

  // Tabs
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const viewLogin = document.getElementById('login-view');
  const viewRegister = document.getElementById('register-view');
  const linkToRegister = document.getElementById('link-to-register');
  const linkToLogin = document.getElementById('link-to-login');

  function switchTab(tab) {
    viewLogin.hidden = tab !== 'login';
    viewRegister.hidden = tab === 'login';
  }

  // Show/hide password
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = show ? '<i class="ph ph-eye-slash"></i>' : '<i class="ph ph-eye"></i>';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  if (tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));
  if (linkToRegister) linkToRegister.addEventListener('click', (e) => { e.preventDefault(); switchTab('register'); });
  if (linkToLogin) linkToLogin.addEventListener('click', (e) => { e.preventDefault(); switchTab('login'); });

  // Login Handle
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      
      let role = 'user';
      let name = 'Demo User';
      
      if (email.toLowerCase() === 'admin@rollora.demo') {
        role = 'admin';
        name = 'Admin';
      }

      localStorage.setItem('rollora_session', JSON.stringify({ name, email, role }));
      
      // Redirect logic
      const pendingCheckout = localStorage.getItem('rollora_pending_checkout');
      if (role === 'admin') {
        window.location.href = 'dashboard.html';
      } else {
        if (pendingCheckout) {
          window.location.href = 'index.html?openCart=true';
        } else {
          window.location.href = 'index.html';
        }
      }
    });
  }

  // Register Handle
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const pass = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;
      const terms = document.getElementById('reg-terms').checked;
      const err = document.getElementById('reg-error');

      if (pass !== confirm) {
        document.getElementById('reg-confirm').classList.add('error');
        err.textContent = 'Passwords do not match.';
        return;
      }
      if (!terms) return; // handled by required attr, just fallback

      document.getElementById('reg-confirm').classList.remove('error');
      err.textContent = '';

      localStorage.setItem('rollora_session', JSON.stringify({ name, email, role: 'user' }));
      
      const pendingCheckout = localStorage.getItem('rollora_pending_checkout');
      if (pendingCheckout) {
        window.location.href = 'index.html?openCart=true';
      } else {
        window.location.href = 'index.html';
      }
    });
  }
});
