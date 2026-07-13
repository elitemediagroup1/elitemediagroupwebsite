const nav = document.querySelector('.site-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

const syncNav = () => nav?.classList.toggle('is-scrolled', window.scrollY > 24);
const setMenu = (open) => {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navLinks.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
};

syncNav();
window.addEventListener('scroll', syncNav, { passive: true });
navToggle?.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
navLinks?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenu(false);
    navToggle?.focus();
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 980) setMenu(false);
});

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelectorAll('[data-inquiry-choice]').forEach((choice) => {
  choice.addEventListener('click', () => {
    const select = document.querySelector('#inquiry-type');
    const name = document.querySelector('#name');
    if (select) select.value = choice.dataset.inquiryChoice;
    window.setTimeout(() => name?.focus({ preventScroll: true }), 350);
  });
});

const inquiryForm = document.querySelector('[data-inquiry-form]');
inquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(inquiryForm);
  const required = ['inquiry_type', 'name', 'email', 'message'];
  const missing = required.filter((key) => !String(data.get(key) || '').trim());
  const status = inquiryForm.querySelector('[data-form-status]');
  if (missing.length) {
    status.textContent = 'Please complete each required field.';
    status.focus();
    return;
  }
  const subject = `EMG ${data.get('inquiry_type')} inquiry from ${data.get('name')}`;
  const body = [
    `Inquiry type: ${data.get('inquiry_type')}`,
    `Name: ${data.get('name')}`,
    `Company / profile: ${data.get('company') || 'Not provided'}`,
    `Email: ${data.get('email')}`,
    `Phone: ${data.get('phone') || 'Not provided'}`,
    `Website / social: ${data.get('website') || 'Not provided'}`,
    '',
    'What they are trying to build:',
    data.get('message'),
  ].join('\n');
  status.textContent = 'Your email app is opening with the inquiry details. Review the message, then send it to EMG.';
  window.location.href = `mailto:charlie@elitemediagroup.io?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const librarySearch = document.querySelector('#guide-search');
const libraryCards = Array.from(document.querySelectorAll('.library-card'));
const libraryStatus = document.querySelector('[data-library-status]');
const noLibraryResults = document.querySelector('[data-no-results]');

const filterLibrary = () => {
  if (!librarySearch) return;
  const query = librarySearch.value.trim().toLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  let shown = 0;
  libraryCards.forEach((card) => {
    const match = !query || terms.every((term) => card.dataset.search.includes(term));
    card.hidden = !match;
    if (match) shown += 1;
  });
  document.querySelectorAll('.library-cluster').forEach((section) => {
    section.hidden = !Array.from(section.querySelectorAll('.library-card')).some((card) => !card.hidden);
  });
  if (libraryStatus) libraryStatus.textContent = query ? `Showing ${shown} matching guide${shown === 1 ? '' : 's'}.` : `Showing all ${libraryCards.length} guides.`;
  if (noLibraryResults) noLibraryResults.hidden = shown !== 0;
};

librarySearch?.addEventListener('input', filterLibrary);
