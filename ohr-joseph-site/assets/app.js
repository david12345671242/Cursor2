// Mobile menu toggle and active link highlighting
(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const header = document.querySelector('.header');
  if (toggle && header) {
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('mobile-open');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Close mobile nav on link click
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.matches('.mobile-nav .nav-link')) {
      document.documentElement.classList.remove('mobile-open');
      const btn = document.querySelector('[data-menu-toggle]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Highlight active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    const isIndex = path === '' || path === 'index.html';
    const match = (isIndex && (href === '/' || href.endsWith('index.html'))) || href.endsWith(path);
    if (match) a.classList.add('active');
  });
})();
