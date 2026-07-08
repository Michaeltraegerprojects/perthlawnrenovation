/* ============================================================
   Perth Lawn Renovation Services — vanilla JS
   Replaces the original React/DCLogic component with plain,
   dependency-free interactivity so the page has no framework
   requirement at all.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Config (edit these two rates + minimum job charge) ---------- */
  const CONFIG = {
    dethatchRate: 8,      // $/m²
    aerateRate: 1.5,      // $/m²
    minJob: 400,          // $ minimum job charge
    phone: '0427206246',
    email: 'perthlawnrenovationservices@outlook.com',
  };

  const fmt = (n) => '$' + n.toLocaleString('en-AU');

  /* ---------- Nav: scroll state + mobile toggle ---------- */
  function initNav() {
    const nav = document.getElementById('siteNav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      // Close mobile menu after tapping a link
      links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveals() {
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const idx = parseInt(el.getAttribute('data-reveal') || '1', 10);
          el.style.transitionDelay = (idx - 1) * 0.09 + 's';
          el.classList.add('is-visible');
          io.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => {
      // Anything already on screen at load (e.g. hero) shows immediately
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add('is-visible');
      } else {
        io.observe(el);
      }
    });
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    const counters = Array.from(document.querySelectorAll('[data-count]'));
    if (!counters.length || !('IntersectionObserver' in window)) {
      counters.forEach((el) => (el.textContent = el.getAttribute('data-count')));
      return;
    }
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          cio.unobserve(el);
          const target = parseInt(el.getAttribute('data-count'), 10);
          const t0 = performance.now();
          const dur = 1400;
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Before/after slider ---------- */
  function initSlider() {
    const slider = document.getElementById('baSlider');
    const before = document.getElementById('baBeforeImg');
    const line = document.getElementById('baHandleLine');
    const btn = document.getElementById('baHandleBtn');
    if (!slider || !before || !line || !btn) return;

    let pct = 58;

    const apply = () => {
      before.style.clipPath = `inset(0 0 0 ${pct}%)`;
      line.style.left = pct + '%';
      btn.style.left = pct + '%';
      btn.setAttribute('aria-valuenow', String(Math.round(pct)));
    };

    const updateFromClientX = (clientX) => {
      const r = slider.getBoundingClientRect();
      let p = ((clientX - r.left) / r.width) * 100;
      p = Math.max(4, Math.min(96, p));
      pct = Math.round(p * 10) / 10;
      apply();
    };

    slider.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      updateFromClientX(e.clientX);
      const move = (ev) => updateFromClientX(ev.clientX);
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });

    // Keyboard support on the handle for accessibility
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { pct = Math.max(4, pct - 3); apply(); }
      if (e.key === 'ArrowRight') { pct = Math.min(96, pct + 3); apply(); }
    });

    apply();
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    const items = Array.from(document.querySelectorAll('.faq-item'));
    items.forEach((item) => {
      const question = item.querySelector('.faq-item__question');
      const icon = item.querySelector('.faq-item__icon');
      if (!question) return;
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        // Close all, then open this one if it wasn't already open
        items.forEach((i) => {
          i.classList.remove('is-open');
          const q = i.querySelector('.faq-item__question');
          const ic = i.querySelector('.faq-item__icon');
          if (q) q.setAttribute('aria-expanded', 'false');
          if (ic) ic.textContent = '+';
        });
        if (!isOpen) {
          item.classList.add('is-open');
          question.setAttribute('aria-expanded', 'true');
          if (icon) icon.textContent = '−';
        }
      });
    });
  }

  /* ---------- Quote calculator ---------- */
  function initQuoteCalculator() {
    const areaNum = document.getElementById('areaNum');
    const areaRange = document.getElementById('areaRange');
    const toggleDethatch = document.getElementById('toggleDethatch');
    const toggleAerate = document.getElementById('toggleAerate');
    const dSub = document.getElementById('dSub');
    const aSub = document.getElementById('aSub');
    const totalLabel = document.getElementById('totalLabel');
    const noteText = document.getElementById('noteText');
    const mailtoBtn = document.getElementById('quoteMailtoBtn');
    const whatsAppBtn = document.getElementById('quoteWhatsAppBtn');

    if (!areaNum || !areaRange) return;

    const state = { area: 150, dethatch: true, aerate: false };

    function buildMailto(area, dethatch, aerate, total) {
      const services = [dethatch ? 'Verti-Mowing / Dethatching' : null, aerate ? 'Lawn Aeration' : null]
        .filter(Boolean)
        .join(' + ') || 'Lawn renovation (not sure yet)';
      const subject = encodeURIComponent('Free quote request — ' + services);
      const body = encodeURIComponent(
        'Hi Perth Lawn Renovation,\n\nI used the instant quote tool on your website.\n\n' +
        'Lawn size: ' + area + ' m2\nServices: ' + services + '\n' +
        'Indicative estimate: ' + (total > 0 ? 'From ' + fmt(total) : 'n/a') + '\n\n' +
        'My suburb: \nBest contact number: \n\nThanks!'
      );
      return 'mailto:' + CONFIG.email + '?subject=' + subject + '&body=' + body;
    }

    function buildWhatsApp(area, dethatch, aerate, total) {
      const services = [dethatch ? 'Verti-Mowing / Dethatching' : null, aerate ? 'Lawn Aeration' : null]
        .filter(Boolean)
        .join(' + ') || 'Lawn renovation';
      const msg =
        "Hi, I'd like to book a lawn renovation. From your website quote tool: " +
        services + ', ' + area + ' m2, estimate ' + (total > 0 ? 'from ' + fmt(total) : 'TBC') + '. Can you confirm availability?';
      return 'https://wa.me/61' + CONFIG.phone.slice(1) + '?text=' + encodeURIComponent(msg);
    }

    function render() {
      const { area, dethatch, aerate } = state;
      const dCost = Math.round(CONFIG.dethatchRate * area);
      const aCost = Math.round(CONFIG.aerateRate * area);
      const rawTotal = (dethatch ? dCost : 0) + (aerate ? aCost : 0);
      const isMinJob = rawTotal > 0 && rawTotal < CONFIG.minJob;
      const total = isMinJob ? CONFIG.minJob : rawTotal;

      dSub.textContent = dethatch ? fmt(dCost) : '—';
      aSub.textContent = aerate ? fmt(aCost) : '—';
      totalLabel.textContent = total > 0 ? 'From ' + fmt(total) : '$0';
      noteText.textContent =
        total === 0
          ? 'Select at least one service above.'
          : isMinJob
          ? 'Minimum job charge of ' + fmt(CONFIG.minJob) + ' applies — indicative only, final quote confirmed free.'
          : 'Indicative only — final quote confirmed free.';

      toggleDethatch.classList.toggle('is-on', dethatch);
      toggleDethatch.setAttribute('aria-pressed', String(dethatch));
      toggleAerate.classList.toggle('is-on', aerate);
      toggleAerate.setAttribute('aria-pressed', String(aerate));

      mailtoBtn.href = buildMailto(area, dethatch, aerate, total);
      whatsAppBtn.href = buildWhatsApp(area, dethatch, aerate, total);
    }

    areaNum.addEventListener('input', () => {
      const v = parseInt(areaNum.value, 10);
      state.area = isNaN(v) ? 0 : Math.max(0, Math.min(2000, v));
      areaRange.value = String(Math.max(20, Math.min(1000, state.area)));
      render();
    });
    areaRange.addEventListener('input', () => {
      state.area = parseInt(areaRange.value, 10);
      areaNum.value = String(state.area);
      render();
    });
    toggleDethatch.addEventListener('click', () => {
      state.dethatch = !state.dethatch;
      render();
    });
    toggleAerate.addEventListener('click', () => {
      state.aerate = !state.aerate;
      render();
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initReveals();
    initCounters();
    initSlider();
    initFaq();
    initQuoteCalculator();
  });
})();
