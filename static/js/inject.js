// Inject header and footer partials, then signal ready
(function () {
  const include = (selector, url) =>
    fetch(url)
      .then(r => r.text())
      .then(html => { const el = document.querySelector(selector); if (el) el.innerHTML = html; });

  Promise.all([
    include('[data-include="header"]', 'partials/header.html'),
    include('[data-include="footer"]', 'partials/footer.html')
  ]).then(() => {
    document.dispatchEvent(new CustomEvent('partials:loaded'));
  }).catch(() => {
    document.dispatchEvent(new CustomEvent('partials:loaded'));
  });
})();

