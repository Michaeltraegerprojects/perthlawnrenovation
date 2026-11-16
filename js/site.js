/* Perth Lawn Renovation Services — shared site script (vanilla, no dependencies) */
(function () {
  'use strict';

  /* ============================================================
     CONFIG — everything the owner might change lives here.
     ============================================================ */
  var SITE = {
    // Tracking. Leave blank to load nothing third-party.
    tracking: { metaPixelId: '', ga4Id: '' },

    // Seasonal banner at the top of every page. Hides itself after `expires`.
    banner: {
      text: '\uD83D\uDD25 Summer is here. Water beading off instead of soaking in? Wetting agent treatments from $75.',
      textShort: '\uD83D\uDD25 Summer: lawn treatments from $75',
      href: '/#summer',
      expires: '2027-02-28'          // last day it shows (Perth date on the visitor's device)
    },

    // Instant estimate on the homepage.
    rates: { dethatch: 8, aerate: 1.5, minJob: 400 },

    // Where forms post (Formspree).
    endpoints: {
      quote: 'https://formspree.io/f/mlgqkwan',
      guide: 'https://formspree.io/f/xykroepj'
    },

    phoneE164: '+61427206246',
    phoneDisplay: '0427 206 246',
    whatsapp: '61427206246',
    email: 'perthlawnrenovationservices@outlook.com'
  };
  window.PLRS = SITE;

  var doc = document;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- attribution: keep UTM + click ids for the session ---------- */
  var ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
  function store(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  (function captureAttribution() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { return; }
    var saved = {};
    try { saved = JSON.parse(read('plrs_attr') || '{}'); } catch (e) {}
    var found = false;
    ATTR_KEYS.forEach(function (k) { var v = q.get(k); if (v) { saved[k] = v.slice(0, 200); found = true; } });
    if (found || !read('plrs_attr')) {
      if (!saved.landing_page) saved.landing_page = location.pathname;
      if (!saved.referrer && doc.referrer) saved.referrer = doc.referrer.slice(0, 200);
      store('plrs_attr', JSON.stringify(saved));
    }
  })();
  function attribution() { try { return JSON.parse(read('plrs_attr') || '{}'); } catch (e) { return {}; } }

  /* ---------- tracking ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(name, data) {
    var payload = { event: name };
    for (var k in (data || {})) payload[k] = data[k];
    window.dataLayer.push(payload);
    if (window.fbq) window.fbq('track', name, data || {});
    if (window.gtag) window.gtag('event', name === 'Lead' ? 'generate_lead' : name.toLowerCase(), data || {});
  }
  SITE.track = track;
  SITE.attribution = function () { return attribution(); };
  (function loadTracking() {
    var t = SITE.tracking, s;
    if (t.metaPixelId) {
      /* Meta Pixel base code */
      (function (f, b, e, v, n, t2, s2) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t2 = b.createElement(e); t2.async = !0; t2.src = v; s2 = b.getElementsByTagName(e)[0]; s2.parentNode.insertBefore(t2, s2); })(window, doc, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', t.metaPixelId); window.fbq('track', 'PageView');
    }
    if (t.ga4Id) {
      s = doc.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(t.ga4Id); doc.head.appendChild(s);
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', t.ga4Id);
    }
  })();
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href');
    var kind = h.indexOf('tel:') === 0 ? 'call' : h.indexOf('sms:') === 0 ? 'sms' : h.indexOf('wa.me') > -1 ? 'whatsapp' : h.indexOf('mailto:') === 0 ? 'email' : '';
    if (kind) track('Contact', { method: kind, page: location.pathname });
  });

  /* ---------- contact link builders ---------- */
  function smsHref(body) { return 'sms:' + SITE.phoneE164 + '?&body=' + encodeURIComponent(body); }
  function waHref(body) { return 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(body); }
  function mailHref(subject, body) { return 'mailto:' + SITE.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); }

  /* ---------- seasonal banner ---------- */
  (function banner() {
    var el = $('#season'), b = SITE.banner;
    if (!el || !b || !b.text) return;
    var end = new Date(b.expires + 'T23:59:59');
    if (b.expires && !isNaN(end) && new Date() > end) return;
    el.href = b.href;
    el.innerHTML = '';
    var lg = doc.createElement('span'); lg.className = 'lg'; lg.textContent = b.text;
    var sm = doc.createElement('span'); sm.className = 'sm'; sm.textContent = b.textShort || b.text;
    el.appendChild(lg); el.appendChild(sm);
    el.hidden = false;
  })();

  /* ---------- header: solid after 80px, mobile menu ---------- */
  (function header() {
    var hdr = $('#hdr'); if (!hdr) return;
    var ticking = false;
    function upd() { hdr.classList.toggle('is-solid', window.scrollY > 80); ticking = false; }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
    var btn = $('.menu-btn', hdr), nav = $('#mnav');
    if (!btn || !nav) return;
    function set(open) {
      nav.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu'; hdr.classList.toggle('is-open', open);
    }
    btn.addEventListener('click', function () { set(nav.hidden); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !nav.hidden) { set(false); btn.focus(); } });
  })();

  /* ---------- reveal once on entry ---------- */
  (function reveal() {
    var els = $$('.rv');
    if (!els.length || reduce || !hasIO) return;
    doc.documentElement.classList.add('rv-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- before / after ---------- */
  (function beforeAfter() {
    $$('.ba').forEach(function (ba) {
      var range = $('.ba__range', ba); if (!range) return;
      var touched = false, raf = 0;
      function set(v) { ba.style.setProperty('--pos', v + '%'); range.setAttribute('aria-valuetext', Math.round(v) + '% before photo showing'); }
      function stop() { touched = true; if (raf) cancelAnimationFrame(raf); }
      range.addEventListener('input', function () { stop(); set(+range.value); });
      range.addEventListener('pointerdown', stop);
      range.addEventListener('keydown', stop);
      set(+range.value);
      if (reduce || !hasIO) return;
      // One sweep from 15% to 50% the first time it scrolls into view.
      range.value = 15; set(15);
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        if (touched) return;
        var t0 = 0, from = 15, to = 50, dur = 1100;
        function step(t) {
          if (touched) return;
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3), v = from + (to - from) * e;
          range.value = v; set(v);
          if (p < 1) raf = requestAnimationFrame(step);
        }
        setTimeout(function () { raf = requestAnimationFrame(step); }, 250);
      }, { threshold: 0.55 });
      io.observe(ba);
    });
  })();

  /* ---------- process story ---------- */
  (function story() {
    var root = $('.story'); if (!root || !hasIO) return;
    var steps = $$('.story__steps li', root), pics = $$('.story__frame picture', root), dots = $$('.story__dots i', root), count = $('.story__dots span', root);
    var scroller = $('.story__steps', root);
    function show(i) {
      steps.forEach(function (s, n) { s.classList.toggle('is-on', n === i); });
      pics.forEach(function (p, n) { p.classList.toggle('is-on', n === i); });
      dots.forEach(function (d, n) { d.classList.toggle('is-on', n === i); });
      if (count) count.textContent = (i + 1) + ' of ' + steps.length;
    }
    show(0);
    var desktop = window.matchMedia('(min-width: 1024px)');
    var io;
    function bind() {
      if (io) io.disconnect();
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) show(steps.indexOf(en.target)); });
      }, desktop.matches ? { rootMargin: '-45% 0px -45% 0px' } : { root: scroller, threshold: 0.6 });
      steps.forEach(function (s) { io.observe(s); });
    }
    bind();
    if (desktop.addEventListener) desktop.addEventListener('change', bind);
  })();

  /* ---------- instant estimate ---------- */
  var estimate = (function () {
    var root = $('#estimate'); if (!root) return null;
    var num = $('#estArea', root), range = $('#estRange', root), cbD = $('#estDethatch', root), cbA = $('#estAerate', root);
    var out = $('#estTotal'), what = $('#estWhat'), label = $('#estLabel');
    var shown = null, raf = 0;
    function money(n) { return '$' + Math.round(n).toLocaleString('en-AU'); }
    function calc() {
      var area = Math.max(0, Math.min(2000, parseInt(num.value, 10) || 0));
      var d = cbD.checked, a = cbA.checked, r = SITE.rates;
      var raw = area * ((d ? r.dethatch : 0) + (a ? r.aerate : 0));
      var total = (d || a) && area > 0 ? Math.max(r.minJob, raw) : 0;
      var services = [d ? 'Verti-mowing / dethatching' : null, a ? 'Lawn aeration' : null].filter(Boolean);
      return { area: area, total: total, isMin: total > 0 && raw < r.minJob, services: services };
    }
    function paint(v) { out.textContent = v > 0 ? money(v) : '—'; }
    function render() {
      var c = calc();
      var pct = Math.max(0, Math.min(100, (c.area - 20) / 980 * 100));
      range.style.setProperty('--fill', pct + '%');
      label.textContent = c.total > 0 ? 'Your estimate, from' : 'Your estimate';
      what.textContent = !c.services.length ? 'Pick a service to see a price, or send your details and we will quote it.'
        : c.area <= 0 ? 'Enter your lawn size to see a price.'
        : c.services.join(' + ') + ' on ' + c.area + ' m²' + (c.isMin ? '. $' + SITE.rates.minJob + ' minimum job applies.' : '.');
      if (raf) cancelAnimationFrame(raf);
      if (reduce || shown === null || !c.total || !shown) { shown = c.total; paint(c.total); return; }
      var from = shown, to = c.total, t0 = 0;
      (function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / 200);
        shown = from + (to - from) * (1 - Math.pow(1 - p, 3));
        paint(shown);
        if (p < 1) raf = requestAnimationFrame(step); else shown = to;
      })(performance.now());
    }
    range.addEventListener('input', function () { num.value = range.value; render(); });
    num.addEventListener('input', function () { var v = parseInt(num.value, 10); if (!isNaN(v)) range.value = Math.max(20, Math.min(1000, v)); render(); });
    num.addEventListener('blur', function () { var v = parseInt(num.value, 10); if (isNaN(v) || v < 1) { num.value = range.value; render(); } });
    cbD.addEventListener('change', render); cbA.addEventListener('change', render);
    render();
    return { get: calc, money: money };
  })();

  /* ---------- quote forms ---------- */
  function validPhone(v) {
    var d = v.replace(/[^\d+]/g, '');
    if (d.indexOf('+61') === 0) d = '0' + d.slice(3);
    else if (d.indexOf('61') === 0 && d.length === 11) d = '0' + d.slice(2);
    return /^0[2-478]\d{8}$/.test(d) || /^1[38]00\d{6}$/.test(d);
  }
  $$('form[data-quote]').forEach(function (form) {
    var okBox = $('.qform__state--ok', form), failBox = $('.qform__state--fail', form), btn = $('button[type="submit"]', form);
    var btnText = btn.textContent;
    function err(input, msg) {
      var slot = $('#' + input.id + 'Err', form);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (slot) slot.textContent = msg || '';
    }
    function gather() {
      var f = form.elements, e = estimate && form.hasAttribute('data-estimate') ? estimate.get() : null;
      var data = {
        name: f.name.value.trim(), phone: f.phone.value.trim(), suburb: f.suburb.value.trim(),
        notes: f.notes ? f.notes.value.trim() : '',
        services: e ? (e.services.join(' + ') || 'Not sure yet') : (form.getAttribute('data-service') || 'Lawn renovation'),
        lawn_m2: e ? e.area : (f.lawn_m2 && f.lawn_m2.value.trim()) || '',
        estimate: e && e.total ? 'From ' + estimate.money(e.total) : 'Not calculated',
        source: form.getAttribute('data-source') || 'site',
        page: location.href, ts: new Date().toISOString(),
        _subject: 'Website quote request'
      };
      var a = attribution();
      ATTR_KEYS.concat(['landing_page', 'referrer']).forEach(function (k) { data[k] = a[k] || ''; });
      return data;
    }
    function summary(d) {
      return 'Hi, I would like a lawn renovation quote.\n' +
        'Name: ' + d.name + '\nSuburb: ' + d.suburb + '\nServices: ' + d.services +
        (d.lawn_m2 ? '\nLawn size: ' + d.lawn_m2 + ' m2' : '') +
        (d.estimate !== 'Not calculated' ? '\nWebsite estimate: ' + d.estimate : '') +
        (d.notes ? '\nNotes: ' + d.notes : '');
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var f = form.elements, bad = null;
      if (f._gotcha && f._gotcha.value) return;                       // bots only
      err(f.name, f.name.value.trim() ? '' : 'Enter your name.'); if (!f.name.value.trim()) bad = bad || f.name;
      var okPhone = validPhone(f.phone.value);
      err(f.phone, okPhone ? '' : 'Enter an Australian mobile or landline, for example 0412 345 678.'); if (!okPhone) bad = bad || f.phone;
      err(f.suburb, f.suburb.value.trim() ? '' : 'Enter your suburb.'); if (!f.suburb.value.trim()) bad = bad || f.suburb;
      if (bad) { bad.focus(); return; }
      var data = gather();
      failBox.hidden = true;
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(SITE.endpoints.quote, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data)
      }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r; }).then(function () {
        form.classList.add('is-sent');
        var sms = $('[data-sms]', okBox);
        if (sms) sms.href = smsHref('Hi, it\'s ' + data.name + ' from ' + data.suburb + '. I just sent a quote request on your website. Here are photos of my lawn.');
        okBox.hidden = false; okBox.focus();
        track('Lead', { source: data.source, services: data.services, value: (estimate && form.hasAttribute('data-estimate') && estimate.get().total) || 0, currency: 'AUD' });
      }).catch(function () {
        // Never lose the lead: keep what they typed and hand them a prefilled message.
        var msg = summary(data);
        $('[data-sms]', failBox).href = smsHref(msg);
        $('[data-wa]', failBox).href = waHref(msg);
        $('[data-mail]', failBox).href = mailHref('Quote request: ' + data.services, msg + '\nBest contact number: ' + data.phone);
        failBox.hidden = false; failBox.focus();
        btn.disabled = false; btn.textContent = btnText;
        track('LeadError', { source: data.source });
      });
    });
    $$('input', form).forEach(function (i) { i.addEventListener('input', function () { if (i.getAttribute('aria-invalid') === 'true') err(i, ''); }); });
  });

  /* ---------- aftercare guide form ---------- */
  $$('form[data-guide]').forEach(function (form) {
    var msg = $('.guide__msg', form), btn = $('button', form);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = form.elements.name.value.trim(), email = form.elements.email.value.trim();
      if (!name) { msg.textContent = 'Enter your name.'; form.elements.name.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Enter a valid email address.'; form.elements.email.focus(); return; }
      btn.disabled = true; msg.textContent = 'Sending…';
      var a = attribution();
      var done = function () {
        // Show the guide either way so a flaky connection never blocks it.
        msg.innerHTML = 'Here is your guide. <a href="' + form.getAttribute('data-pdf') + '" target="_blank" rel="noopener">Download the aftercare guide (PDF)</a>';
        track('GuideRequest', { source: form.getAttribute('data-source') });
      };
      fetch(SITE.endpoints.guide, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: name, email: email, source: form.getAttribute('data-source'), page: location.href, ts: new Date().toISOString(), utm_source: a.utm_source || '', utm_campaign: a.utm_campaign || '', fbclid: a.fbclid || '' })
      }).then(done).catch(done);
    });
  });

  /* ---------- mobile sticky bar ---------- */
  (function bar() {
    var el = $('#bar'); if (!el || !hasIO) return;
    var top = $('[data-bar-after]'), forms = $$('[data-bar-hide]');
    var pastTop = !top, overForm = {};
    function upd() { var hide = false; for (var k in overForm) if (overForm[k]) hide = true; el.classList.toggle('is-on', pastTop && !hide); }
    if (top) new IntersectionObserver(function (e) { pastTop = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; upd(); }).observe(top);
    forms.forEach(function (f, i) { new IntersectionObserver(function (e) { overForm[i] = e[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe(f); });
    upd();
  })();
})();
