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

/* ---------- 7. Quote composer (multi-item + BoQ schedule + /api/quote) ---------- */
(() => {
  const form = document.querySelector('#quote-form');
  if (!form) return;
  const storageKey = 'fortimesh-quote-draft-v2';
  const result = document.querySelector('#quote-result');
  const pre = document.querySelector('#quote-message');
  const copyBtn = document.querySelector('#copy-request');
  const shareBtn = document.querySelector('#share-request');
  const waBtn = document.querySelector('#whatsapp-request');
  const mailBtn = document.querySelector('#email-request');
  const onlineBtn = document.querySelector('#online-request');
  const status = document.querySelector('#copy-status');
  const rowsWrap = document.querySelector('#schedule-rows');
  const addRowBtn = document.querySelector('#add-line-item');
  const rowTemplate = rowsWrap?.querySelector('[data-sched-row]')?.cloneNode(true);

  const wireRow = (row) => {
    row.querySelector('[data-remove-row]')?.addEventListener('click', () => {
      if (rowsWrap.querySelectorAll('[data-sched-row]').length > 1) {
        row.remove();
      } else {
        row.querySelectorAll('input').forEach((inp) => { inp.value = ''; });
      }
      updateProgress();
    });
  };
  rowsWrap?.querySelectorAll('[data-sched-row]').forEach(wireRow);

  addRowBtn?.addEventListener('click', () => {
    if (!rowsWrap || !rowTemplate) return;
    const clone = rowTemplate.cloneNode(true);
    clone.querySelectorAll('input').forEach((inp) => { inp.value = ''; });
    wireRow(clone);
    rowsWrap.appendChild(clone);
    clone.querySelector('input[name="item_spec"]')?.focus();
  });

  // Restore saved draft first, then allow URL parameters (?product=, ?qty=, ?spec=) to override
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (Array.isArray(saved.products)) {
      saved.products.forEach((slug) => {
        const box = form.querySelector(`input[name="product"][value="${CSS.escape(slug)}"]`);
        if (box) box.checked = true;
      });
    }
    for (const k of ['quantity', 'timeline', 'specification', 'location', 'name', 'contact']) {
      if (typeof saved[k] === 'string' && form.elements[k]) {
        form.elements[k].value = saved[k];
      }
    }
  } catch {}

  const params = new URLSearchParams(location.search);
  const paramProduct = params.get('product');
  if (paramProduct) {
    paramProduct.split(',').forEach((slug) => {
      const box = form.querySelector(`input[name="product"][value="${CSS.escape(slug.trim())}"]`);
      if (box) box.checked = true;
    });
  }
  if (params.get('qty') && form.elements.quantity) {
    form.elements.quantity.value = params.get('qty');
  }
  if (params.get('spec') && form.elements.specification) {
    form.elements.specification.value = params.get('spec');
  }

  // Ensure at least the first product is checked if none selected yet and user came without selection
  const getCheckedProducts = () => [...form.querySelectorAll('input[name="product"]:checked')];

  const getScheduleItems = () => {
    if (!rowsWrap) return [];
    return [...rowsWrap.querySelectorAll('[data-sched-row]')]
      .map((r) => {
        const fam = r.querySelector('[name="item_family"]')?.value?.trim() || '';
        const spec = r.querySelector('[name="item_spec"]')?.value?.trim() || '';
        const qty = r.querySelector('[name="item_qty"]')?.value?.trim() || '';
        return spec || qty ? `${fam}: ${qty || 'TBD'} — ${spec || 'standard spec'}` : '';
      })
      .filter(Boolean);
  };

  const updateProgress = () => {
    const data = new FormData(form);
    const hasProduct = getCheckedProducts().length > 0;
    const checks = {
      material: Boolean(hasProduct && String(data.get('quantity') || '').trim() && String(data.get('specification') || '').trim()),
      project: Boolean(String(data.get('location') || '').trim()),
      contact: Boolean(String(data.get('name') || '').trim() && String(data.get('contact') || '').trim()),
    };
    for (const [key, done] of Object.entries(checks)) {
      document.querySelector(`[data-progress="${key}"]`)?.classList.toggle('is-done', done);
    }
    try {
      const draft = {
        products: getCheckedProducts().map((c) => c.value),
        quantity: String(data.get('quantity') || ''),
        timeline: String(data.get('timeline') || ''),
        specification: String(data.get('specification') || ''),
        location: String(data.get('location') || ''),
        name: String(data.get('name') || ''),
        contact: String(data.get('contact') || ''),
      };
      localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {}
  };
  updateProgress();
  form.addEventListener('input', updateProgress);
  form.addEventListener('change', updateProgress);

  let message = '';
  let currentPayload = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const checked = getCheckedProducts();
    const firstBox = form.querySelector('input[name="product"]');
    if (firstBox) {
      firstBox.setCustomValidity(checked.length ? '' : 'Please select at least one product family.');
    }
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const productNames = checked
      .map((c) => c.closest('.pick__item')?.querySelector('.pick__name')?.textContent?.trim() || c.value)
      .join(', ');
    const scheduleItems = getScheduleItems();
    const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const ref = `FM-${dateStamp}-${String(Math.floor(1000 + Math.random() * 9000))}`;

    currentPayload = {
      _subject: `Fortimesh Quote Request [${ref}] — ${productNames}`,
      _template: 'table',
      _captcha: 'false',
      reference: ref,
      product_family: productNames,
      schedule_items: scheduleItems.length ? scheduleItems.join(' | ') : 'See specification summary',
      quantity: String(data.get('quantity') || ''),
      specifications: String(data.get('specification') || ''),
      delivery_location: String(data.get('location') || ''),
      timeline: String(data.get('timeline') || 'To discuss'),
      client_name: String(data.get('name') || ''),
      reply_contact: String(data.get('contact') || ''),
    };

    const lines = [
      `FORTIMESH MATERIAL REQUEST (${ref})`,
      '',
      `Product families: ${currentPayload.product_family}`,
      `Total quantity: ${currentPayload.quantity}`,
      `Specifications: ${currentPayload.specifications}`,
    ];
    if (scheduleItems.length) {
      lines.push('', 'Itemised schedule:');
      scheduleItems.forEach((item, idx) => lines.push(`  ${idx + 1}. ${item}`));
      lines.push('');
    }
    lines.push(
      `Delivery / collection: ${currentPayload.delivery_location}`,
      `Timeline: ${currentPayload.timeline}`,
      '',
      `From: ${currentPayload.client_name}`,
      `Reply contact: ${currentPayload.reply_contact}`,
    );
    message = lines.join('\n');

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
    if (!currentPayload) return;
    const label = onlineBtn.querySelector('span:first-child');
    onlineBtn.disabled = true;
    if (label) label.textContent = 'Sending…';
    status.textContent = 'Submitting your request to Fortimesh sales desk…';
    try {
      const apiUrl = onlineBtn.dataset.api || '/api/quote';
      let ok = false;
      try {
        const apiRes = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(currentPayload),
        });
        ok = apiRes.ok;
      } catch {}
      if (!ok && onlineBtn.dataset.endpoint) {
        const fallbackRes = await fetch(onlineBtn.dataset.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(currentPayload),
        });
        ok = fallbackRes.ok;
      }
      if (!ok) throw new Error('Delivery failed');
      if (label) label.textContent = 'Submitted';
      status.textContent = `Request ${currentPayload.reference} logged with our Kigali sales desk. For immediate dispatch confirmation, also click Send on WhatsApp.`;
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

/* ---------- 8. Rebar & Gabion Calculators + Print/PDF trigger ---------- */
(() => {
  document.querySelectorAll('[data-print]').forEach((btn) => {
    btn.addEventListener('click', () => window.print());
  });

  const rebarCalc = document.querySelector('[data-calc="rebar"]');
  if (rebarCalc) {
    const diaEl = rebarCalc.querySelector('[data-rebar-dia]');
    const lenEl = rebarCalc.querySelector('[data-rebar-len]');
    const qtyEl = rebarCalc.querySelector('[data-rebar-qty]');
    const unitOut = rebarCalc.querySelector('[data-rebar-unit]');
    const kgOut = rebarCalc.querySelector('[data-rebar-kg]');
    const tOut = rebarCalc.querySelector('[data-rebar-tonnes]');
    const wireOut = rebarCalc.querySelector('[data-rebar-wire]');
    const quoteLink = rebarCalc.querySelector('[data-rebar-quote]');

    const updateRebar = () => {
      const d = Number(diaEl?.value) || 12;
      const len = Number(lenEl?.value) || 12;
      const qty = Math.max(1, Number(qtyEl?.value) || 1);
      const unitKg = ((d * d) / 162.2) * len;
      const totalKg = unitKg * qty;
      const tonnes = totalKg / 1000;
      const wireKg = Math.max(1, Math.round(totalKg * 0.012));

      if (unitOut) unitOut.textContent = `${unitKg.toFixed(2)} kg`;
      if (kgOut) kgOut.textContent = `${Math.round(totalKg).toLocaleString('en-US')} kg`;
      if (tOut) tOut.textContent = `${tonnes.toFixed(2)} t`;
      if (wireOut) wireOut.textContent = `${wireKg.toLocaleString('en-US')} kg`;
      if (quoteLink) {
        const q = `${qty} bars (${tonnes.toFixed(2)} t)`;
        const s = `D${d} deformed steel reinforcement bars (${len}m length) — ${qty} bars (~${Math.round(totalKg).toLocaleString('en-US')} kg) + ~${wireKg} kg annealed binding wire`;
        quoteLink.href = `/quote/?product=reinforcement-steel&qty=${encodeURIComponent(q)}&spec=${encodeURIComponent(s)}`;
      }
    };
    rebarCalc.addEventListener('input', updateRebar);
    rebarCalc.addEventListener('change', updateRebar);
    updateRebar();
  }

  const gabionCalc = document.querySelector('[data-calc="gabion"]');
  if (gabionCalc) {
    const lEl = gabionCalc.querySelector('[data-gab-l]');
    const hEl = gabionCalc.querySelector('[data-gab-h]');
    const wEl = gabionCalc.querySelector('[data-gab-w]');
    const boxEl = gabionCalc.querySelector('[data-gab-box]');
    const volOut = gabionCalc.querySelector('[data-gab-vol]');
    const boxesOut = gabionCalc.querySelector('[data-gab-boxes]');
    const stoneOut = gabionCalc.querySelector('[data-gab-stone]');
    const quoteLink = gabionCalc.querySelector('[data-gab-quote]');

    const updateGabion = () => {
      const l = Math.max(0.5, Number(lEl?.value) || 1);
      const h = Math.max(0.5, Number(hEl?.value) || 1);
      const w = Math.max(0.5, Number(wEl?.value) || 1);
      const boxVol = Number(boxEl?.value) || 2;
      const boxLabel = boxEl?.selectedOptions?.[0]?.dataset?.label || '2m × 1m × 1m';
      const vol = l * h * w;
      const boxes = Math.ceil(vol / boxVol);
      const stone = vol * 1.15;

      if (volOut) volOut.textContent = `${vol.toFixed(1)} m³`;
      if (boxesOut) boxesOut.textContent = `${boxes.toLocaleString('en-US')} ${boxes === 1 ? 'box' : 'boxes'}`;
      if (stoneOut) stoneOut.textContent = `${stone.toFixed(1)} m³`;
      if (quoteLink) {
        const q = `${boxes} gabion boxes (${vol.toFixed(1)} m³)`;
        const s = `${boxLabel} double-twisted woven gabion baskets for ${l}m × ${h}m × ${w}m retaining structure (${boxes} boxes, est. ${stone.toFixed(1)} m³ stone fill)`;
        quoteLink.href = `/quote/?product=gabion-mesh&qty=${encodeURIComponent(q)}&spec=${encodeURIComponent(s)}`;
      }
    };
    gabionCalc.addEventListener('input', updateGabion);
    gabionCalc.addEventListener('change', updateGabion);
    updateGabion();
  }
})();
