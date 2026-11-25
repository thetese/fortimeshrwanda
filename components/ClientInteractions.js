'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientInteractions() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add('js');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ac = new AbortController();
    const { signal } = ac;
    const observers = [];

    /* ---------- 1. Header & mobile menu ---------- */
    (() => {
      const hdr = document.querySelector('[data-hdr]');
      const toggle = document.querySelector('.hdr__toggle');
      const menu = document.querySelector('#menu');
      if (!hdr) return;

      let lastY = Math.max(0, window.scrollY);
      let anchorY = lastY;
      let lastDir = 0;
      let hidden = false;
      let ticking = false;

      const updateHeader = () => {
        ticking = false;
        const y = Math.max(0, window.scrollY);
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
      window.addEventListener(
        'scroll',
        () => {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateHeader);
          }
        },
        { passive: true, signal },
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
      setOpen(false);
      toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')), { signal });
      menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false), { signal }));
      window.addEventListener(
        'keydown',
        (e) => {
          if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
            setOpen(false);
            toggle.focus();
          }
        },
        { signal },
      );
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
        { threshold: 0.01, rootMargin: '0px 0px 40px 0px' },
      );
      observers.push(io);
      targets.forEach((el) => io.observe(el));
      requestAnimationFrame(() => {
        document
          .querySelectorAll('.hero [data-reveal], .phero [data-reveal], .pd-hero [data-reveal]')
          .forEach((el) => el.classList.add('is-in'));
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
      observers.push(cio);
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
        const vh = window.innerHeight;
        const r = hi.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (vh * 0.78 - r.top) / (r.height + vh * 0.32)));
        const litCount = Math.round(progress * words.length);
        words.forEach((w, i) => w.classList.toggle('is-lit', i < litCount));
      };
      const requestUpdate = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };
      update();
      window.addEventListener('scroll', requestUpdate, { passive: true, signal });
      window.addEventListener('resize', requestUpdate, { passive: true, signal });
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
      observers.push(io);
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
          { passive: true, signal },
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
          const url = new URL(window.location.href);
          if (chosen === 'all') url.searchParams.delete('category');
          else url.searchParams.set('category', chosen);
          window.history.replaceState(null, '', url);
        }
      };

      const initial = new URLSearchParams(window.location.search).get('category') || 'all';
      apply(initial, false);
      chips.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter, true), { signal }));
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
      const dropzone = document.querySelector('#quote-dropzone');
      const fileInput = document.querySelector('#quote-files');
      const fileListEl = document.querySelector('#quote-file-list');
      const fileErrEl = document.querySelector('#quote-file-error');

      const MAX_FILES = 5;
      const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
      let selectedFiles = [];

      const formatBytes = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      };

      const badgeForFile = (file) => {
        const name = (file.name || '').toLowerCase();
        const type = (file.type || '').toLowerCase();
        if (name.endsWith('.pdf') || type === 'application/pdf') return 'PDF';
        if (type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|heic|heif|bmp|tiff?)$/.test(name)) return 'PHOTO';
        if (/\.(xlsx?|csv|ods)$/.test(name)) return 'SHEET';
        return 'FILE';
      };

      const isAllowedFile = (file) => {
        const name = (file.name || '').toLowerCase();
        const type = (file.type || '').toLowerCase();
        if (/\.(exe|bat|cmd|com|msi|scr|vbs|js|mjs|cjs|ps1|sh|dll|jar|apk)$/.test(name)) return false;
        if (/\.(pdf|jpg|jpeg|png|webp|gif|heic|heif|bmp|tif|tiff|xls|xlsx|csv|doc|docx|txt|rtf|odt|ods)$/.test(name)) {
          return true;
        }
        return type === 'application/pdf' || type.startsWith('image/');
      };

      const optimizePhotoIfLarge = async (file) => {
        const type = (file.type || '').toLowerCase();
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(type) || file.size <= 900 * 1024) {
          return file;
        }
        try {
          const bitmap = await createImageBitmap(file);
          const maxDim = 2000;
          const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
          const w = Math.max(1, Math.round(bitmap.width * scale));
          const h = Math.max(1, Math.round(bitmap.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return file;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(bitmap, 0, 0, w, h);
          if (typeof bitmap.close === 'function') bitmap.close();
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.84));
          if (!blob || blob.size >= file.size) return file;
          const cleanName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
          return new File([blob], cleanName, { type: 'image/jpeg', lastModified: Date.now() });
        } catch {
          return file;
        }
      };

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

      const clearMaterialValidity = () => {
        form.elements.specification?.setCustomValidity?.('');
      };

      const renderSelectedFiles = () => {
        if (!fileListEl) return;
        fileListEl.innerHTML = '';
        if (!selectedFiles.length) {
          fileListEl.hidden = true;
          return;
        }
        fileListEl.hidden = false;
        selectedFiles.forEach((file, idx) => {
          const li = document.createElement('li');
          li.className = 'qfiles__item';

          const badge = document.createElement('span');
          badge.className = 'qfiles__badge';
          badge.textContent = badgeForFile(file);

          const name = document.createElement('span');
          name.className = 'qfiles__name';
          name.textContent = file.name;

          const size = document.createElement('span');
          size.className = 'qfiles__size';
          size.textContent = formatBytes(file.size);

          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'qfiles__remove';
          removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
          removeBtn.textContent = '×';
          removeBtn.addEventListener('click', () => {
            selectedFiles.splice(idx, 1);
            if (fileErrEl) fileErrEl.hidden = true;
            renderSelectedFiles();
            updateProgress();
          });

          li.append(badge, name, size, removeBtn);
          fileListEl.appendChild(li);
        });
      };

      const addIncomingFiles = async (fileList) => {
        if (!fileList || !fileList.length) return;
        if (fileErrEl) {
          fileErrEl.hidden = true;
          fileErrEl.textContent = '';
        }
        const incoming = [...fileList];
        if (selectedFiles.length + incoming.length > MAX_FILES) {
          if (fileErrEl) {
            fileErrEl.textContent = `You can attach up to ${MAX_FILES} files per quote request.`;
            fileErrEl.hidden = false;
          }
          return;
        }

        const nextFiles = [...selectedFiles];
        for (const rawFile of incoming) {
          if (!isAllowedFile(rawFile)) {
            if (fileErrEl) {
              fileErrEl.textContent = `Unsupported file "${rawFile.name}". Please choose a PDF, photo (JPG/PNG/WebP), or Excel/Word BoQ.`;
              fileErrEl.hidden = false;
            }
            return;
          }
          const processed = await optimizePhotoIfLarge(rawFile);
          nextFiles.push(processed);
        }

        const totalSize = nextFiles.reduce((sum, f) => sum + f.size, 0);
        if (totalSize > MAX_TOTAL_BYTES) {
          if (fileErrEl) {
            fileErrEl.textContent =
              'Total file size exceeds 4 MB. Please remove a file, compress the PDF, or send large drawings on WhatsApp (+250 793 086 644).';
            fileErrEl.hidden = false;
          }
          return;
        }

        selectedFiles = nextFiles;
        clearMaterialValidity();
        renderSelectedFiles();
        updateProgress();
      };

      if (fileInput) {
        fileInput.addEventListener(
          'change',
          async () => {
            await addIncomingFiles(fileInput.files);
            fileInput.value = '';
          },
          { signal },
        );
      }

      if (dropzone) {
        ['dragenter', 'dragover'].forEach((evt) => {
          dropzone.addEventListener(
            evt,
            (e) => {
              e.preventDefault();
              dropzone.classList.add('is-drag');
            },
            { signal },
          );
        });
        ['dragleave', 'drop'].forEach((evt) => {
          dropzone.addEventListener(
            evt,
            (e) => {
              e.preventDefault();
              dropzone.classList.remove('is-drag');
            },
            { signal },
          );
        });
        dropzone.addEventListener(
          'drop',
          async (e) => {
            if (e.dataTransfer?.files?.length) {
              await addIncomingFiles(e.dataTransfer.files);
            }
          },
          { signal },
        );
      }

      const updateProgress = () => {
        const data = new FormData(form);
        const checks = {
          material: Boolean(
            selectedFiles.length > 0 ||
              getScheduleItems().length > 0 ||
              String(data.get('quantity') || '').trim() ||
              String(data.get('specification') || '').trim(),
          ),
          project: Boolean(String(data.get('location') || '').trim()),
          contact: Boolean(
            String(data.get('name') || '').trim() &&
              String(data.get('email') || '').trim() &&
              String(data.get('contact') || '').trim(),
          ),
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
            email: String(data.get('email') || ''),
            contact: String(data.get('contact') || ''),
          };
          localStorage.setItem(storageKey, JSON.stringify(draft));
        } catch {}
      };

      const wireRow = (row) => {
        row.querySelector('[data-remove-row]')?.addEventListener(
          'click',
          () => {
            if (rowsWrap.querySelectorAll('[data-sched-row]').length > 1) {
              row.remove();
            } else {
              row.querySelectorAll('input').forEach((inp) => {
                inp.value = '';
              });
            }
            updateProgress();
          },
          { signal },
        );
      };
      rowsWrap?.querySelectorAll('[data-sched-row]').forEach(wireRow);

      addRowBtn?.addEventListener(
        'click',
        () => {
          if (!rowsWrap || !rowTemplate) return;
          const clone = rowTemplate.cloneNode(true);
          clone.querySelectorAll('input').forEach((inp) => {
            inp.value = '';
          });
          wireRow(clone);
          rowsWrap.appendChild(clone);
          clone.querySelector('input[name="item_spec"]')?.focus();
        },
        { signal },
      );

      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
        if (Array.isArray(saved.products)) {
          saved.products.forEach((slug) => {
            const box = form.querySelector(`input[name="product"][value="${CSS.escape(slug)}"]`);
            if (box) box.checked = true;
          });
        }
        for (const k of ['quantity', 'timeline', 'specification', 'location', 'name', 'email', 'contact']) {
          if (typeof saved[k] === 'string' && form.elements[k]) {
            form.elements[k].value = saved[k];
          }
        }
      } catch {}

      const params = new URLSearchParams(window.location.search);
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

      updateProgress();
      form.addEventListener(
        'input',
        () => {
          clearMaterialValidity();
          updateProgress();
        },
        { signal },
      );
      form.addEventListener(
        'change',
        () => {
          clearMaterialValidity();
          updateProgress();
        },
        { signal },
      );

      let message = '';
      let mailSubject = '';
      let currentPayload = null;
      let currentFiles = [];

      form.addEventListener(
        'submit',
        (e) => {
          e.preventDefault();
          const checked = getCheckedProducts();
          const firstBox = form.querySelector('input[name="product"]');
          if (firstBox) firstBox.setCustomValidity('');

          const data = new FormData(form);
          const scheduleItems = getScheduleItems();
          const rawQty = String(data.get('quantity') || '').trim();
          const rawSpec = String(data.get('specification') || '').trim();
          const specField = form.elements.specification;

          if (specField) {
            const hasAnyMaterial =
              selectedFiles.length > 0 || scheduleItems.length > 0 || Boolean(rawQty) || Boolean(rawSpec);
            specField.setCustomValidity(
              hasAnyMaterial
                ? ''
                : 'Please upload a PDF/photo of your quotation or enter the materials you need.',
            );
          }
          if (!form.reportValidity()) return;

          currentFiles = [...selectedFiles];
          const checkedNames = checked
            .map((c) => c.closest('.pick__item')?.querySelector('.pick__name')?.textContent?.trim() || c.value)
            .join(', ');
          const productNames =
            checkedNames || (currentFiles.length ? 'Uploaded Quotation / BoQ' : 'General Material Inquiry');

          const effectiveQty =
            rawQty ||
            (currentFiles.length
              ? `See attached (${currentFiles.length} ${currentFiles.length === 1 ? 'file' : 'files'})`
              : scheduleItems.length
                ? 'See itemised schedule'
                : 'As per specification notes');

          const effectiveSpec =
            rawSpec ||
            (currentFiles.length
              ? `Please price according to attached quotation / material list: ${currentFiles.map((f) => f.name).join(', ')}`
              : scheduleItems.length
                ? 'See itemised material schedule'
                : 'Standard stock specification — see requested quantity');

          const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
          const ref = `FM-${dateStamp}-${String(Math.floor(1000 + Math.random() * 9000))}`;
          mailSubject = `Fortimesh Quote Request [${ref}] — ${productNames}`;

          currentPayload = {
            reference: ref,
            product_family: productNames,
            schedule_items: scheduleItems.length ? scheduleItems.join(' | ') : 'See specification summary',
            quantity: effectiveQty,
            specifications: effectiveSpec,
            delivery_location: String(data.get('location') || ''),
            timeline: String(data.get('timeline') || '').trim() || 'To discuss',
            client_name: String(data.get('name') || ''),
            client_email: String(data.get('email') || '').trim(),
            reply_contact: String(data.get('contact') || ''),
            _website: String(data.get('_website') || ''),
          };

          const lines = [
            `FORTIMESH MATERIAL REQUEST (${ref})`,
            '',
            `Product families: ${currentPayload.product_family}`,
            `Total quantity: ${currentPayload.quantity}`,
            `Specifications: ${currentPayload.specifications}`,
          ];
          if (currentFiles.length) {
            lines.push('', `Attached files (${currentFiles.length}):`);
            currentFiles.forEach((f, idx) => lines.push(`  ${idx + 1}. ${f.name} (${formatBytes(f.size)})`));
          }
          if (scheduleItems.length) {
            lines.push('', 'Itemised schedule:');
            scheduleItems.forEach((item, idx) => lines.push(`  ${idx + 1}. ${item}`));
            lines.push('');
          }
          lines.push(
            '',
            `Delivery / collection: ${currentPayload.delivery_location}`,
            `Timeline: ${currentPayload.timeline}`,
            '',
            `From: ${currentPayload.client_name}`,
            `Phone / WhatsApp: ${currentPayload.reply_contact}`,
          );
          if (currentPayload.client_email) {
            lines.push(`Email: ${currentPayload.client_email}`);
          }
          message = lines.join('\n');

          pre.textContent = message;
          status.textContent = currentFiles.length
            ? `${currentFiles.length} file${currentFiles.length === 1 ? '' : 's'} attached — click "Submit online" above to email your quotation file${currentFiles.length === 1 ? '' : 's'} directly to our sales desk.`
            : '';
          if (onlineBtn) {
            onlineBtn.disabled = false;
            const span = onlineBtn.querySelector('span:first-child');
            if (span) span.textContent = 'Submit online';
          }
          if (waBtn) {
            waBtn.href = `https://wa.me/${waBtn.dataset.number}?text=${encodeURIComponent(message)}`;
          }
          if (mailBtn) {
            mailBtn.href = `mailto:${mailBtn.dataset.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(message)}`;
          }
          result.hidden = false;
          requestAnimationFrame(() => result.classList.add('is-in'));
          result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          result.focus({ preventScroll: true });
        },
        { signal },
      );

      onlineBtn?.addEventListener(
        'click',
        async () => {
          if (!currentPayload) return;
          const label = onlineBtn.querySelector('span:first-child');
          onlineBtn.disabled = true;
          if (label) label.textContent = 'Sending…';
          status.textContent = currentFiles.length
            ? `Uploading ${currentFiles.length} file${currentFiles.length === 1 ? '' : 's'} and sending to Fortimesh sales desk…`
            : 'Submitting your request to Fortimesh sales desk…';
          try {
            const apiUrl = onlineBtn.dataset.api || '/api/quote/';
            const fd = new FormData();
            for (const [k, v] of Object.entries(currentPayload)) {
              fd.set(k, String(v ?? ''));
            }
            currentFiles.forEach((f) => fd.append('attachments', f, f.name));

            const apiRes = await fetch(apiUrl, {
              method: 'POST',
              headers: { Accept: 'application/json' },
              body: fd,
            });
            const resJson = await apiRes.json().catch(() => ({}));
            if (!apiRes.ok || !resJson?.ok) {
              const serverError = new Error(
                resJson?.error ||
                  'Direct online delivery could not be completed—please click "Send on WhatsApp" or "Open in email app" above.',
              );
              serverError.isServerError = Boolean(resJson?.error);
              throw serverError;
            }
            if (label) label.textContent = 'Submitted';
            const attachNote = resJson.attachmentsReceived
              ? ` (${resJson.attachmentsReceived} file${resJson.attachmentsReceived === 1 ? '' : 's'} attached)`
              : '';
            status.textContent =
              resJson.confirmationSent && resJson.confirmationTo
                ? `Request ${currentPayload.reference}${attachNote} sent to our Kigali sales desk — a confirmation email has also been sent to ${resJson.confirmationTo}.`
                : `Request ${currentPayload.reference}${attachNote} emailed to our Kigali sales desk.`;
          } catch (err) {
            onlineBtn.disabled = false;
            if (label) label.textContent = 'Submit online';
            status.textContent = err?.isServerError
              ? err.message
              : 'Direct online delivery could not be completed—please click "Send on WhatsApp" or "Open in email app" above.';
          }
        },
        { signal },
      );

      copyBtn?.addEventListener(
        'click',
        async () => {
          try {
            await navigator.clipboard.writeText(message);
            status.textContent = 'Request copied to clipboard.';
          } catch {
            status.textContent = 'Select the message above to copy it manually.';
          }
        },
        { signal },
      );

      shareBtn?.addEventListener(
        'click',
        async () => {
          if (navigator.share) {
            try {
              await navigator.share({ title: 'Fortimesh material request', text: message });
            } catch {}
          } else {
            status.textContent = 'Sharing is not supported in this browser — use Copy text instead.';
          }
        },
        { signal },
      );
    })();

    /* ---------- 8. Rebar & Structural Steel Calculators + Print/PDF trigger ---------- */
    (() => {
      document.querySelectorAll('[data-print]').forEach((btn) => {
        btn.addEventListener('click', () => window.print(), { signal });
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
          const rawVal = diaEl?.value || '12';
          const isCage = rawVal.startsWith('cage:');
          const len = Number(lenEl?.value) || 12;
          const qty = Math.max(1, Number(qtyEl?.value) || 1);
          const d = Number(rawVal) || 12;
          const kgPerM = isCage ? Number(rawVal.split(':')[1]) || 7.65 : (d * d) / 162.2;
          const unitKg = kgPerM * len;
          const totalKg = unitKg * qty;
          const tonnes = totalKg / 1000;
          const wireKg = Math.max(1, Math.round(totalKg * 0.012));

          if (unitOut) unitOut.textContent = `${unitKg.toFixed(2)} kg`;
          if (kgOut) kgOut.textContent = `${Math.round(totalKg).toLocaleString('en-US')} kg`;
          if (tOut) tOut.textContent = `${tonnes.toFixed(2)} t`;
          if (wireOut) wireOut.textContent = `${wireKg.toLocaleString('en-US')} kg`;
          if (quoteLink) {
            const unitName = isCage ? 'column cages' : 'bars';
            const label = diaEl?.selectedOptions?.[0]?.dataset?.label || `D${d} deformed steel reinforcement bars`;
            const q = `${qty} ${unitName} (${tonnes.toFixed(2)} t)`;
            const s = `${label} (${len}m length) — ${qty} ${unitName} (~${Math.round(totalKg).toLocaleString('en-US')} kg) + ~${wireKg} kg annealed binding wire`;
            quoteLink.href = `/quote/?product=reinforcement-steel&qty=${encodeURIComponent(q)}&spec=${encodeURIComponent(s)}`;
          }
        };
        rebarCalc.addEventListener('input', updateRebar, { signal });
        rebarCalc.addEventListener('change', updateRebar, { signal });
        updateRebar();
      }

      const steelCalc = document.querySelector('[data-calc="steel"]');
      if (steelCalc) {
        const profileEl = steelCalc.querySelector('[data-steel-profile]');
        const thickEl = steelCalc.querySelector('[data-steel-thick]');
        const lenEl = steelCalc.querySelector('[data-steel-len]');
        const qtyEl = steelCalc.querySelector('[data-steel-qty]');
        const kgmOut = steelCalc.querySelector('[data-steel-kgm]');
        const unitOut = steelCalc.querySelector('[data-steel-unit]');
        const kgOut = steelCalc.querySelector('[data-steel-kg]');
        const tOut = steelCalc.querySelector('[data-steel-tonnes]');
        const quoteLink = steelCalc.querySelector('[data-steel-quote]');

        const updateSteel = () => {
          const raw = profileEl?.value || 'shs:50:50';
          const parts = raw.split(':');
          const kind = parts[0];
          const tRaw = Number(thickEl?.value) || 3.0;
          const len = Number(lenEl?.value) || 6;
          const qty = Math.max(1, Number(qtyEl?.value) || 1);

          let areaMm2 = 0;
          let isFixedProfile = false;
          if (kind === 'shs' || kind === 'rhs') {
            const b = Number(parts[1]) || 50;
            const h = Number(parts[2]) || b;
            const t = Math.min(tRaw, Math.min(b, h) / 2.2);
            areaMm2 = 2 * t * (b + h - 2 * t);
          } else if (kind === 'chs') {
            const d = Number(parts[1]) || 60.3;
            const t = Math.min(tRaw, d / 2.2);
            areaMm2 = Math.PI * t * (d - t);
          } else if (kind === 'fixed') {
            isFixedProfile = true;
            areaMm2 = (Number(parts[1]) || 20.4) / 0.00785;
          } else {
            isFixedProfile = true;
            areaMm2 = (Number(raw) || 4.43) / 0.00785;
          }

          if (thickEl) {
            thickEl.disabled = isFixedProfile;
          }

          const kgPerM = areaMm2 * 0.00785;
          const profileLabel = profileEl?.selectedOptions?.[0]?.dataset?.label || 'SHS 50×50 mm';
          const unitKg = kgPerM * len;
          const totalKg = unitKg * qty;
          const tonnes = totalKg / 1000;

          if (kgmOut) kgmOut.textContent = `${kgPerM.toFixed(2)} kg/m`;
          if (unitOut) unitOut.textContent = `${unitKg.toFixed(1)} kg`;
          if (kgOut) kgOut.textContent = `${Math.round(totalKg).toLocaleString('en-US')} kg`;
          if (tOut) tOut.textContent = `${tonnes.toFixed(2)} t`;
          if (quoteLink) {
            const q = `${qty} bars (${tonnes.toFixed(2)} t)`;
            const s = isFixedProfile
              ? `${profileLabel} (${len}m length) — ${qty} bars (~${Math.round(totalKg).toLocaleString('en-US')} kg)`
              : `${profileLabel} × ${tRaw.toFixed(1)} mm wall hollow sections (${len}m length) — ${qty} bars (~${Math.round(totalKg).toLocaleString('en-US')} kg)`;
            const prodSlug = isFixedProfile ? 'structural-steel' : 'hollow-sections';
            quoteLink.href = `/quote/?product=${prodSlug}&qty=${encodeURIComponent(q)}&spec=${encodeURIComponent(s)}`;
          }
        };
        steelCalc.addEventListener('input', updateSteel, { signal });
        steelCalc.addEventListener('change', updateSteel, { signal });
        updateSteel();
      }
    })();

    return () => {
      ac.abort();
      observers.forEach((o) => o.disconnect());
    };
  }, [pathname]);

  return null;
}
