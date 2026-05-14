/* ============================================================
   EMG Loop™ — Global JavaScript
   Terminal clock + cycling phases
   ============================================================ */

function initClock(id) {
  function tick() {
    const el = document.getElementById(id);
    if (!el) return;
    const n = new Date(), p = x => String(x).padStart(2, '0');
    el.textContent = `${p(n.getHours())}:${p(n.getMinutes())}:${p(n.getSeconds())}`;
  }
  tick(); setInterval(tick, 1000);
}

function initTerminal(cycleId, fillId, phases) {
  const el = document.getElementById(cycleId);
  const fill = document.getElementById(fillId);
  if (!el) return;
  let idx = 0, timer = null;
  function next(i) {
    const ph = phases[i];
    el.style.opacity = '0';
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      el.textContent = ph.text;
      el.style.opacity = '1';
      if (fill) {
        fill.style.transition = 'none'; fill.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          fill.style.transition = `width ${Math.round(ph.dur * .82)}ms cubic-bezier(.4,0,.2,1)`;
          fill.style.width = ph.p + '%';
        }));
      }
      timer = setTimeout(() => { idx = (idx + 1) % phases.length; next(idx); }, ph.dur);
    }, 200);
  }
  setTimeout(() => next(0), 700);
}

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 40
        ? 'rgba(3,8,16,.95)'
        : 'rgba(4,8,16,.85)';
    });
  }
  initClock('term-clock');
});
