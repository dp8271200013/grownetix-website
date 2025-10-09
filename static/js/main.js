// Theme toggle, active link, mobile menu, year, toast
(function () {
  const applyStoredTheme = () => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const setActiveLink = () => {
    const path = location.pathname.split('/').pop() || 'index.html';
    const anchors = document.querySelectorAll('nav.primary-nav a, #mobile-menu a');
    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      const normalized = href === './' ? 'index.html' : href;
      if (normalized === path || (path === 'index.html' && (normalized === '/' || normalized === 'index.html'))) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  };

  const bindHeader = () => {
    const themeBtn = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
      });
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => { mobileMenu.style.display = 'none'; });
      });
    }
  };

  const setYear = () => {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  };

  const initToast = () => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    return (message) => {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    };
  };

  // initial theme before content flashes
  applyStoredTheme();

  // after partials load, wire up
  document.addEventListener('partials:loaded', () => {
    bindHeader();
    setActiveLink();
    setYear();
    window.showToast = initToast();
  });
})();

