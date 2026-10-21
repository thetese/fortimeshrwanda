/* =========================================================================
   FORTIMESH AND STEELS RWANDA — Client interactions
   Progressive enhancement: everything remains readable if JS fails or is
   disabled, and all motion respects `prefers-reduced-motion: reduce`.
   ========================================================================= */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. Header & mobile menu ---------- */
(() => {
  const hdr = document.querySelector('[data-hdr]');
  const toggle = document.querySelector('.hdr__toggle');
  const menu = document.querySelector('#menu');
  if (!hdr) return;

  let lastY = Math.max(0, scrollY);
  let anchorY = lastY;
  let lastDir = 0;
  let hidden = false;
  let ticking = false;

  const updateHeader = () => {
    ticking = false;
    const y = Math.max(0, scrollY);
    const dy = y - lastY;
    hdr.classList.toggle('is-solid', y > 36);

    if (Math.abs(dy) >= 1) {
      const dir = dy > 0 ? 1 : -1;
      if (dir !== lastDir) {
        anchorY = lastY;
        lastDir = dir;
      }
    }

    if (y <= 220 || document.body.classList.contains('menu-open')) {
      hidden = false;
      anchorY = y;
    } else if (lastDir > 0 && y - anchorY > 48) {
      hidden = true;
    } else if (lastDir < 0 && anchorY - y > 28) {
      hidden = false;
    }
    hdr.classList.toggle('is-hidden', hidden);
    lastY = y;
  };

  updateHeader();
  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateHeader);
      }
    },
    { passive: true },
  );

  if (!toggle || !menu) return;
  const setOpen = (open) => {
    document.body.classList.toggle('menu-open', open);
    if (open) {
      hidden = false;
      hdr.classList.remove('is-hidden');
    }
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    menu.toggleAttribute('inert', !open);
  };
  toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
})();

/* ---------- 2. Scroll reveals & animated counters ---------- */
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (reduceMotion) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -4% 0px' },
  );
  targets.forEach((el) => io.observe(el));
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero [data-reveal], .phero [data-reveal], .pd-hero [data-reveal]').forEach((el) => el.classList.add('is-in'));
  });

  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const cio = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        cio.unobserve(el);
        const end = Number(el.dataset.count) || 0;
        const pad = el.textContent.trim().length;
        const start = performance.now();
        const dur = 1100;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(eased * end)).padStart(pad, '0');
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.5 },
  );
  counters.forEach((el) => cio.observe(el));
})();

/* ---------- 3. Scroll-linked highlight ---------- */
(() => {
  const hi = document.querySelector('[data-highlight]');
  const words = hi ? [...hi.querySelectorAll('.hw')] : [];
  if (!words.length) return;

  let raf = 0;
  const update = () => {
    raf = 0;
    const vh = innerHeight;
    const r = hi.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (vh * 0.78 - r.top) / (r.height + vh * 0.32)));
    const litCount = Math.round(progress * words.length);
    words.forEach((w, i) => w.classList.toggle('is-lit', i < litCount));
  };
  const requestUpdate = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  update();
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate, { passive: true });
})();

/* ---------- 4. Sticky applications scroller ---------- */
(() => {
  const sec = document.querySelector('[data-uses]');
  if (!sec) return;
  const items = [...sec.querySelectorAll('[data-use]')];
  const frames = [...sec.querySelectorAll('[data-frame]')];
  const counter = sec.querySelector('[data-uses-current]');

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const idx = Number(entry.target.dataset.use);
        items.forEach((el, i) => el.classList.toggle('is-active', i === idx));
        frames.forEach((el, i) => el.classList.toggle('is-active', i === idx));
        if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
      }
    },
    { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
  );
  items.forEach((el) => io.observe(el));
})();

/* ---------- 5. Bento tile cursor spotlight ---------- */
(() => {
  for (const tile of document.querySelectorAll('.tile')) {
    tile.addEventListener(
      'pointermove',
      (e) => {
        const r = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`);
        tile.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`);
      },
      { passive: true },
    );
  }
})();

/* ---------- 6. Product catalogue filter (URL-synced + View Transitions) ---------- */
(() => {
  const catalog = document.querySelector('[data-catalog]');
  if (!catalog) return;
  const chips = [...document.querySelectorAll('[data-filter]')];
  const cards = [...catalog.querySelectorAll('[data-cat]')];
  const status = document.querySelector('[data-filter-status]');
  const valid = new Set(chips.map((c) => c.dataset.filter));

  const apply = (cat, pushUrl = true) => {
    const chosen = valid.has(cat) ? cat : 'all';
    const updateDom = () => {
      let count = 0;
      for (const c of cards) {
        const match = chosen === 'all' || c.dataset.cat === chosen;
        c.hidden = !match;
        if (match) count++;
      }
      for (const b of chips) {
        const active = b.dataset.filter === chosen;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      }
      if (status) {
        status.textContent = `Showing ${count} product ${count === 1 ? 'family' : 'families'}`;
      }
    };

    if (document.startViewTransition && !reduceMotion && pushUrl) {
      document.documentElement.classList.add('vt-filter');
      const vt = document.startViewTransition(updateDom);
      vt.finished.finally(() => document.documentElement.classList.remove('vt-filter'));
    } else {
      updateDom();
    }

    if (pushUrl) {
      const url = new URL(location.href);
      if (chosen === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', chosen);
      history.replaceState(null, '', url);
    }
  };

  const initial = new URLSearchParams(location.search).get('category') || 'all';
  apply(initial, false);
  chips.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter, true)));
})();

/* ---------- 7. Quote composer ---------- */
(() => {
  const form = document.querySelector('#quote-form');
  if (!form) return;
  const storageKey = 'fortimesh-quote-draft-v1';
  const result = document.querySelector('#quote-result');
  const pre = document.querySelector('#quote-message');
  const copyBtn = document.querySelector('#copy-request');
  const shareBtn = document.querySelector('#share-request');
  const waBtn = document.querySelector('#whatsapp-request');
  const mailBtn = document.querySelector('#email-request');
  const onlineBtn = document.querySelector('#online-request');
  const status = document.querySelector('#copy-status');

  // Restore saved draft first, then allow ?product=slug to override product choice
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    for (const [k, v] of Object.entries(saved)) {
      if (k.startsWith('_')) continue;
      const field = form.elements.namedItem(k);
      if (!field || typeof v !== 'string') continue;
      if (field instanceof RadioNodeList) {
        const match = [...field].find((r) => r.value === v);
        if (match) match.checked = true;
      } else {
        field.value = v;
      }
    }
  } catch {}

  const paramProduct = new URLSearchParams(location.search).get('product');
  if (paramProduct) {
    const radio = form.querySelector(`input[name="product"][value="${CSS.escape(paramProduct)}"]`);
    if (radio) radio.checked = true;
  }

  const updateProgress = () => {
    const data = new FormData(form);
    const checks = {
      material: Boolean(data.get('product') && String(data.get('quantity') || '').trim() && String(data.get('specification') || '').trim()),
      project: Boolean(String(data.get('location') || '').trim()),
      contact: Boolean(String(data.get('name') || '').trim() && String(data.get('contact') || '').trim()),
    };
    for (const [key, done] of Object.entries(checks)) {
      document.querySelector(`[data-progress="${key}"]`)?.classList.toggle('is-done', done);
    }
    try {
      const clean = Object.fromEntries([...data.entries()].filter(([k]) => !k.startsWith('_')));
      localStorage.setItem(storageKey, JSON.stringify(clean));
    } catch {}
  };
  updateProgress();
  form.addEventListener('input', updateProgress);
  form.addEventListener('change', updateProgress);

  let message = '';
  let currentPayload = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const checked = form.querySelector('input[name="product"]:checked');
    const productName = checked?.closest('.pick__item')?.querySelector('.pick__name')?.textContent?.trim() || data.get('product');
    const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const ref = `FM-${dateStamp}-${String(Math.floor(1000 + Math.random() * 9000))}`;

    currentPayload = {
      _subject: `Fortimesh Quote Request [${ref}] — ${productName}`,
      _template: 'table',
      _captcha: 'false',
      reference: ref,
      product_family: String(productName),
      quantity: String(data.get('quantity') || ''),
      specifications: String(data.get('specification') || ''),
      delivery_location: String(data.get('location') || ''),
      timeline: String(data.get('timeline') || 'To discuss'),
      client_name: String(data.get('name') || ''),
      reply_contact: String(data.get('contact') || ''),
    };

    message = [
      `FORTIMESH MATERIAL REQUEST (${ref})`,
      '',
      `Product family: ${currentPayload.product_family}`,
      `Quantity: ${currentPayload.quantity}`,
      `Specifications: ${currentPayload.specifications}`,
      `Delivery / collection: ${currentPayload.delivery_location}`,
      `Timeline: ${currentPayload.timeline}`,
      '',
      `From: ${currentPayload.client_name}`,
      `Reply contact: ${currentPayload.reply_contact}`,
    ].join('\n');

    pre.textContent = message;
    status.textContent = '';
    if (onlineBtn) {
      onlineBtn.disabled = false;
      const span = onlineBtn.querySelector('span:first-child');
      if (span) span.textContent = 'Submit online';
    }
    if (waBtn) {
      waBtn.href = `https://wa.me/${waBtn.dataset.number}?text=${encodeURIComponent(message)}`;
    }
    if (mailBtn) {
      mailBtn.href = `mailto:${mailBtn.dataset.email}?subject=${encodeURIComponent(currentPayload._subject)}&body=${encodeURIComponent(message)}`;
    }
    result.hidden = false;
    requestAnimationFrame(() => result.classList.add('is-in'));
    result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    result.focus({ preventScroll: true });
  });

  onlineBtn?.addEventListener('click', async () => {
    if (!currentPayload || !onlineBtn.dataset.endpoint) return;
    const label = onlineBtn.querySelector('span:first-child');
    onlineBtn.disabled = true;
    if (label) label.textContent = 'Sending…';
    status.textContent = 'Submitting your request to Fortimesh sales desk…';
    try {
      const res = await fetch(onlineBtn.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(currentPayload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (label) label.textContent = 'Submitted';
      status.textContent = `Request ${currentPayload.reference} delivered to our sales inbox. For urgent dispatch, also click Send on WhatsApp.`;
    } catch {
      onlineBtn.disabled = false;
      if (label) label.textContent = 'Submit online';
      status.textContent = 'Direct online delivery could not be completed—please click "Send on WhatsApp" or "Open in email app" above.';
    }
  });

  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = 'Request copied to clipboard.';
    } catch {
      status.textContent = 'Select the message above to copy it manually.';
    }
  });

  shareBtn?.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Fortimesh material request', text: message });
      } catch {}
    } else {
      status.textContent = 'Sharing is not supported in this browser — use Copy text instead.';
    }
  });
})();
