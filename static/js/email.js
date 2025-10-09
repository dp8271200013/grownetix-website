// EmailJS integration for Contact page
// Fill in your EmailJS credentials below
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

document.addEventListener('partials:loaded', () => {
  if (!document.getElementById('contact-form')) return;

  // Load emailjs from CDN if not present
  const ensureEmailJS = () => new Promise((resolve, reject) => {
    if (window.emailjs) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  ensureEmailJS().then(() => {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    const form = document.getElementById('contact-form');
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');

    const setError = (el, msg) => {
      const err = el.parentElement.querySelector('.error');
      if (err) err.textContent = msg || '';
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (nameEl.value || '').trim();
      const email = (emailEl.value || '').trim();
      const message = (messageEl.value || '').trim();

      let valid = true;
      setError(emailEl);
      setError(messageEl);

      if (!emailRegex.test(email)) { setError(emailEl, 'Enter a valid email.'); valid = false; }
      if (message.length < 10) { setError(messageEl, 'Message must be at least 10 characters.'); valid = false; }
      if (!valid) return;

      form.querySelector('button[type="submit"]').disabled = true;

      try {
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { name, email, message });
        if (window.showToast) window.showToast('Message sent successfully!');
        form.reset();
      } catch (err) {
        if (window.showToast) window.showToast('Failed to send message.');
      } finally {
        form.querySelector('button[type="submit"]').disabled = false;
      }
    });
  }).catch(() => {
    if (window.showToast) window.showToast('Email service unavailable.');
  });
});

