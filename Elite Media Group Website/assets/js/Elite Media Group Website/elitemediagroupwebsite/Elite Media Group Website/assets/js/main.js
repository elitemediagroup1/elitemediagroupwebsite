// js/main.js
// Elite Media Group
// Accessible nav toggle, logo rotator, and lead form submit (Netlify -> HubSpot).
// Place at /js/main.js and include with: <script src="/js/main.js" defer></script>

(() => {
  'use strict';

  // ---------- Configuration ----------
  const ROTATOR_INTERVAL = 4000; // ms
  const MOBILE_BREAKPOINT = 900; // px - close mobile nav above this

  // ---------- Small helpers ----------
  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const qa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);

  // Safe text setter
  const setText = (el, txt) => { if (el) el.textContent = txt; };

  // Read a cookie value by name
  function readCookie(name) {
    if (!document.cookie) return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.*+?^${}()|[\]\\])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  // ---------- DOMContentLoaded ----------
  document.addEventListener('DOMContentLoaded', () => {

    // --- 1) Small page utilities ---
    // Set current year if #year exists
    const yearEl = q('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Populate pageUri hidden field if exists
    const pageUriEl = q('#pageUri');
    if (pageUriEl) pageUriEl.value = window.location.href;

    // ---------- Accessible Mobile Nav Toggle ----------
    const navToggle = q('.nav-toggle');
    const navLinks = document.getElementById('primary-navigation') || q('.nav-links');

    if (navToggle && navLinks) {
      const focusableSelector = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

      // Manage state
      function isOpen() { return navToggle.getAttribute('aria-expanded') === 'true'; }

      function openNav() {
        navToggle.setAttribute('aria-expanded', 'true');
        navLinks.classList.add('open');
        document.body.classList.add('nav-open');
        // focus first focusable inside nav
        const focusables = Array.from(navLinks.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
        if (focusables.length) focusables[0].focus();
        // attach a11y listeners
        document.addEventListener('click', outsideClickHandler);
        document.addEventListener('keydown', trapHandler);
      }

      function closeNav() {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.classList.remove('nav-open');
        navToggle.focus();
        document.removeEventListener('click', outsideClickHandler);
        document.removeEventListener('keydown', trapHandler);
      }

      // Toggle on button
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isOpen()) closeNav(); else openNav();
      });

      // Close when a link is clicked (mobile)
      qa('.nav-links a').forEach(a => a.addEventListener('click', () => {
        if (isOpen()) closeNav();
      }));

      // Close on outside click (keeps inside/outside detection minimal)
      function outsideClickHandler(e) {
        if (!navLinks.classList.contains('open')) return;
        if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
        closeNav();
      }

      // Focus trap + Escape key handler
      function trapHandler(e) {
        if (!navLinks.classList.contains('open')) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          closeNav();
          return;
        }
        if (e.key === 'Tab') {
          const focusables = Array.from(navLinks.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
          if (!focusables.length) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      // Ensure nav closes on resize beyond mobile breakpoint
      window.addEventListener('resize', () => {
        if (window.innerWidth > MOBILE_BREAKPOINT && navLinks.classList.contains('open')) {
          closeNav();
        }
      });
    } // end nav

    // ---------- Logo Rotator ----------
    const rotator = q('.logo-rotator');
    if (rotator) {
      const slides = qa('.logo-slide', rotator).filter(Boolean);
      if (slides.length > 0) {
        let current = slides.findIndex(s => s.classList.contains('active'));
        if (current < 0) current = 0;
        // ensure one slide has 'active'
        slides.forEach((s, i) => s.classList.toggle('active', i === current));

        let timer = null;
        const start = () => {
          stop();
          timer = setInterval(() => { showSlide((current + 1) % slides.length); }, ROTATOR_INTERVAL);
        };
        const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

        function showSlide(index) {
          slides.forEach((s, i) => s.classList.toggle('active', i === index));
          current = index;
        }

        // Start auto-rotation
        start();

        // Pause/Resume on hover and focus
        rotator.addEventListener('mouseenter', stop);
        rotator.addEventListener('mouseleave', start);
        rotator.addEventListener('focusin', stop);
        rotator.addEventListener('focusout', start);

        // Keyboard left/right support; make container keyboard-focusable in HTML with tabindex="0"
        rotator.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            showSlide((current - 1 + slides.length) % slides.length);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            showSlide((current + 1) % slides.length);
          }
        });
      }
    }

    // ---------- Lead Form Submit (Netlify -> HubSpot) ----------
    // Assumes a single #lead-form on page. If you have multiple forms, adapt accordingly.
    const form = q('#lead-form');
    if (form) {
      const status = q('#formStatus') || null;
      const submitBtn = form.querySelector('button[type="submit"]');
      const optionalDemoBtn = q('#optionalDemo');

      // Utility to set form status text safely
      function updateStatus(message, isError = false) {
        if (!status) return;
        status.textContent = message;
        status.style.color = isError ? '#ffb4b4' : ''; // light visual feedback for error
      }

      // Read hubspot cookie if available (for contact matching)
      const hutk = readCookie('hubspotutk') || null;

      async function postToNetlify(bodyObj) {
        try {
          const res = await fetch('/.netlify/functions/submitHubspot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyObj),
            credentials: 'same-origin'
          });

          if (!res.ok) {
            // try to parse details
            const txt = await res.text().catch(() => null);
            throw new Error(txt || `HTTP ${res.status}`);
          }

          return { ok: true, data: await res.json().catch(() => ({})) };
        } catch (err) {
          return { ok: false, error: err.message || String(err) };
        }
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.setAttribute('aria-busy', 'true');
        }
        updateStatus('Sending…');

        // Build payload
        const fd = new FormData(form);
        const payload = {};
        for (const [k, v] of fd.entries()) {
          // include only non-empty values
          if (typeof v !== 'undefined' && String(v).trim() !== '') {
            payload[k] = String(v).trim();
          }
        }
        payload.pageUri = payload.pageUri || window.location.href;
        payload.pageName = document.title || '';
        if (hutk) payload.hutk = hutk;

        // Post to Netlify function
        const result = await postToNetlify(payload);

        if (result.ok) {
          updateStatus('Thanks — we received your request. Someone will be in touch within 48 hours.');
          form.reset();
        } else {
          console.error('Form submission error:', result.error);
          updateStatus('There was an error submitting the form. Please email hello@elitemediagroup.io.', true);
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
        }
      });

      // Optional demo button: focus the form and set interest value to 'demo'
      if (optionalDemoBtn) {
        optionalDemoBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const interestEl = form.querySelector('select[name="interest"]') || form.querySelector('input[name="interest"]');
          if (interestEl) {
            try {
              interestEl.value = 'demo';
            } catch (_) { /* ignore */ }
          }
          // smooth scroll to form and focus first field
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const firstInput = form.querySelector('input[name="name"], input[type="text"], input[type="email"], textarea');
          if (firstInput) firstInput.focus();
        });
      }
    } // end form

    // ---------- End DOMContentLoaded ----------
  });

})();
