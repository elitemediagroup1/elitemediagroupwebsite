// js/main.js
// Elite Media Group
// Accessible nav toggle, logo rotator, and lead form submit (Netlify -> HubSpot).
// Place at /js/main.js and include with: <script src="/js/main.js" defer></script>

(() => {
  'use strict';

  // ---------- Configuration ----------
  const ROTATOR_INTERVAL = 4000; // ms
  const MOBILE_BREAKPOINT = 900; // px - close mobile nav above this
  const FORM_TIMEOUT_MS = 12000; // ms - prevent infinite "Sending..."

  // ---------- Small helpers ----------
  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const qa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const setText = (el, txt) => { if (el) el.textContent = txt; };

  // Read a cookie value by name
  function readCookie(name) {
    if (!document.cookie) return null;
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.*+?^${}()|[\]\\])/g, '\\$1') + '=([^;]*)')
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  document.addEventListener('DOMContentLoaded', () => {

    // --- 1) Small page utilities ---
    const yearEl = q('#year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const pageUriEl = q('#pageUri');
    if (pageUriEl) pageUriEl.value = window.location.href;

    // ---------- Accessible Mobile Nav Toggle ----------
    const navToggle = q('.nav-toggle');
    const navLinks = document.getElementById('primary-navigation') || q('.nav-links');

    if (navToggle && navLinks) {
      const focusableSelector =
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

      function isOpen() {
        return navToggle.getAttribute('aria-expanded') === 'true';
      }

      function getFocusableInNav() {
        return Array.from(navLinks.querySelectorAll(focusableSelector))
          .filter(el => el.offsetParent !== null);
      }

      function openNav() {
        navToggle.setAttribute('aria-expanded', 'true');
        navLinks.classList.add('open');
        document.body.classList.add('nav-open');

        const focusables = getFocusableInNav();
        if (focusables.length) focusables[0].focus();

        document.addEventListener('click', outsideClickHandler);
        document.addEventListener('keydown', trapHandler);
      }

      function closeNav({ returnFocus = true } = {}) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.classList.remove('nav-open');

        if (returnFocus) navToggle.focus();

        document.removeEventListener('click', outsideClickHandler);
        document.removeEventListener('keydown', trapHandler);
      }

      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isOpen()) closeNav(); else openNav();
      });

      // Close when a nav link is clicked (scoped to this nav)
      qa('a', navLinks).forEach(a => a.addEventListener('click', () => {
        if (isOpen()) closeNav({ returnFocus: false });
      }));

      function outsideClickHandler(e) {
        if (!navLinks.classList.contains('open')) return;
        if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
        closeNav({ returnFocus: true });
      }

      function trapHandler(e) {
        if (!navLinks.classList.contains('open')) return;

        if (e.key === 'Escape') {
          e.preventDefault();
          closeNav({ returnFocus: true });
          return;
        }

        if (e.key === 'Tab') {
          const focusables = getFocusableInNav();
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

      window.addEventListener('resize', () => {
        if (window.innerWidth > MOBILE_BREAKPOINT && navLinks.classList.contains('open')) {
          closeNav({ returnFocus: false });
        }
      });
    }

    // ---------- Logo Rotator ----------
    const rotator = q('.logo-rotator');
    if (rotator) {
      const slides = qa('.logo-slide', rotator).filter(Boolean);
      if (slides.length > 0) {
        let current = slides.findIndex(s => s.classList.contains('active'));
        if (current < 0) current = 0;
        slides.forEach((s, i) => s.classList.toggle('active', i === current));

        let timer = null;

        function showSlide(index) {
          slides.forEach((s, i) => s.classList.toggle('active', i === index));
          current = index;
        }

        const start = () => {
          stop();
          timer = setInterval(() => {
            showSlide((current + 1) % slides.length);
          }, ROTATOR_INTERVAL);
        };

        const stop = () => {
          if (timer) { clearInterval(timer); timer = null; }
        };

        start();

        rotator.addEventListener('mouseenter', stop);
        rotator.addEventListener('mouseleave', start);
        rotator.addEventListener('focusin', stop);
        rotator.addEventListener('focusout', start);

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
    const form = q('#lead-form');
    if (form) {
      const status = q('#formStatus') || null;
      const submitBtn = form.querySelector('button[type="submit"]');
      const optionalDemoBtn = q('#optionalDemo');

      function updateStatus(message, isError = false) {
        if (!status) return;
        status.textContent = message;
        status.style.color = isError ? '#ffb4b4' : '';
      }

      const hutk = readCookie('hubspotutk') || null;

      async function postToNetlify(bodyObj) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), FORM_TIMEOUT_MS);

        try {
          const res = await fetch('/.netlify/functions/submitHubspot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyObj),
            credentials: 'same-origin',
            signal: controller.signal
          });

          if (!res.ok) {
            const txt = await res.text().catch(() => null);
            throw new Error(txt || `HTTP ${res.status}`);
          }

          return { ok: true, data: await res.json().catch(() => ({})) };
        } catch (err) {
          const msg = (err && err.name === 'AbortError')
            ? 'Request timed out'
            : (err && err.message) ? err.message : String(err);
          return { ok: false, error: msg };
        } finally {
          clearTimeout(timeout);
        }
      }

      function disableSubmit(isDisabled) {
        if (!submitBtn) return;
        submitBtn.disabled = isDisabled;
        if (isDisabled) submitBtn.setAttribute('aria-busy', 'true');
        else submitBtn.removeAttribute('aria-busy');
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        disableSubmit(true);
        updateStatus('Sending…');

        const fd = new FormData(form);
        const payload = {};

        for (const [k, v] of fd.entries()) {
          if (typeof v !== 'undefined' && String(v).trim() !== '') {
            payload[k] = String(v).trim();
          }
        }

        payload.pageUri = payload.pageUri || window.location.href;
        payload.pageName = document.title || '';
        if (hutk) payload.hutk = hutk;

        const result = await postToNetlify(payload);

        if (result.ok) {
          updateStatus('Thanks — we received your request. Someone will be in touch soon.');
          form.reset();
        } else {
          console.error('Form submission error:', result.error);
          updateStatus('There was an error submitting the form. Please email hello@elitemediagroup.io.', true);
        }

        disableSubmit(false);
      });

      // Optional demo button:
      // - If the select supports 'demo', set it.
      // - Otherwise, set interest to 'other' and prepend "Demo request:" into the message.
      if (optionalDemoBtn) {
        optionalDemoBtn.addEventListener('click', (e) => {
          e.preventDefault();

          const interestEl = form.querySelector('select[name="interest"]');
          const messageEl = form.querySelector('textarea[name="message"]');

          let demoSet = false;

          if (interestEl && interestEl.tagName === 'SELECT') {
            const hasDemoOption = Array.from(interestEl.options || [])
              .some(opt => (opt && opt.value) === 'demo');

            if (hasDemoOption) {
              interestEl.value = 'demo';
              demoSet = true;
            } else {
              // fallback: keep schema stable
              interestEl.value = 'other';
            }
          }

          if (messageEl) {
            const existing = (messageEl.value || '').trim();
            const prefix = demoSet ? '' : 'Demo request: ';
            messageEl.value = existing.startsWith(prefix) ? existing : (prefix + existing).trim();
          }

          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const firstInput = form.querySelector('input[name="name"], input[type="text"], input[type="email"], textarea');
          if (firstInput) firstInput.focus();
        });
      }
    }
  });
})();

