import Lenis from 'lenis';

/*
 * Every interaction on the site lives here. Astro's <ClientRouter /> swaps the page
 * without a full reload, so per-page work runs on `astro:page-load` and is torn down
 * on `astro:before-swap`. Document-level listeners are attached once.
 */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

declare global {
  interface Window {
    __motionReady?: boolean;
    __lenis?: Lenis | null;
  }
}

let cleanups: Array<() => void> = [];
const onCleanup = (fn: () => void) => cleanups.push(fn);

/* ---------- Smooth scroll ---------- */

let lenis: Lenis | null = null;

function initLenis() {
  if (lenis || reducedMotion()) return;
  lenis = new Lenis({ lerp: 0.1, anchors: { offset: -80 }, autoRaf: true });
  window.__lenis = lenis;
}

/* ---------- Scroll loop shared by scroll-linked effects ---------- */

type ScrollFn = () => void;
const scrollFns = new Set<ScrollFn>();
let ticking = false;

function onScroll(fn: ScrollFn) {
  scrollFns.add(fn);
  fn();
  onCleanup(() => scrollFns.delete(fn));
}

function runScrollFns() {
  ticking = false;
  scrollFns.forEach((fn) => fn());
}

function requestTick() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(runScrollFns);
  }
}

/* ---------- Header: always visible, frosted once the page scrolls ---------- */

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  onScroll(() => header.classList.toggle('is-scrolled', window.scrollY > 8));

  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  if (!toggle) return;
  const setOpen = (open: boolean) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) lenis?.stop();
    else lenis?.start();
  };
  const click = () => setOpen(!header.classList.contains('is-open'));
  const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
  toggle.addEventListener('click', click);
  document.addEventListener('keydown', key);
  onCleanup(() => {
    setOpen(false);
    toggle.removeEventListener('click', click);
    document.removeEventListener('keydown', key);
  });
}

/* ---------- External links open in a new tab ---------- */

function initExternalLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((a) => {
    if (a.origin === location.origin) return;
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

/* ---------- Reveal on enter ---------- */

function initReveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal], .split');
  if (reducedMotion()) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
  );
  els.forEach((el) => io.observe(el));
  onCleanup(() => io.disconnect());
}

/* ---------- Parallax: [data-parallax="0.15"] moves against the scroll ---------- */

function initParallax() {
  if (reducedMotion()) return;
  const els = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  if (!els.length) return;
  onScroll(() => {
    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const speed = parseFloat(el.dataset.parallax || '0.1');
      const center = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`;
    }
  });
}

/* ---------- Stacked project cards: earlier cards shrink as the next one covers them ---------- */

function initStack() {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-stack-card]')];
  if (cards.length < 2 || reducedMotion()) return;
  onScroll(() => {
    for (let i = 0; i < cards.length - 1; i++) {
      const card = cards[i];
      const inner = card.firstElementChild as HTMLElement | null;
      if (!inner) continue;
      const stickyTop = parseFloat(getComputedStyle(card).top) || 0;
      const nextTop = cards[i + 1].getBoundingClientRect().top;
      const start = stickyTop + card.offsetHeight;
      const p = clamp((start - nextTop) / (card.offsetHeight - 24));
      inner.style.transform = `scale(${(1 - p * 0.08).toFixed(4)})`;
      inner.style.filter = `brightness(${(1 - p * 0.35).toFixed(3)})`;
    }
  });
}

/* ---------- Showreel: columns drift with the scroll on top of their own loop ---------- */

function initShowreel() {
  const reel = document.querySelector<HTMLElement>('[data-showreel]');
  if (!reel || reducedMotion()) return;
  const cols = [...reel.querySelectorAll<HTMLElement>('[data-reel-col]')];
  onScroll(() => {
    const r = reel.getBoundingClientRect();
    const p = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height));
    reel.style.setProperty('--reel-p', p.toFixed(4));
    cols.forEach((col, i) => {
      const dir = i % 2 ? 1 : -1;
      col.style.translate = `0 ${(dir * (p - 0.5) * 220).toFixed(1)}px`;
    });
  });
}

/* ---------- Words that light up as you read (About) ---------- */

function initHighlight() {
  const blocks = [...document.querySelectorAll<HTMLElement>('[data-highlight]')];
  if (!blocks.length) return;
  for (const block of blocks) {
    const words = [...block.querySelectorAll<HTMLElement>('.hw')];
    if (reducedMotion()) {
      words.forEach((w) => w.classList.add('on'));
      continue;
    }
    onScroll(() => {
      const r = block.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    });
  }
}

/* ---------- Reading progress (insight pages) ---------- */

function initProgress() {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  const article = document.querySelector<HTMLElement>('[data-article]');
  if (!bar || !article) return;
  onScroll(() => {
    const r = article.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
    bar.style.transform = `scaleX(${p.toFixed(4)})`;
  });
}

/* ---------- Active section in the case-study table of contents ---------- */

function initToc() {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc] a')];
  if (!links.length) return;
  const map = new Map(links.map((a) => [a.getAttribute('href')?.slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.remove('is-active'));
          map.get(entry.target.id)?.classList.add('is-active');
        }
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  map.forEach((_, id) => {
    const el = id && document.getElementById(id);
    if (el) io.observe(el);
  });
  onCleanup(() => io.disconnect());
}

/* ---------- Magnetic buttons ---------- */

function initMagnetic() {
  if (!finePointer() || reducedMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${(x * 0.22).toFixed(1)}px, ${(y * 0.3).toFixed(1)}px)`;
    };
    const leave = () => (el.style.transform = '');
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    onCleanup(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    });
  });
}

/* ---------- Cursor: a dot that grows into a label over projects ---------- */

let cursorReady = false;

function initCursor() {
  if (cursorReady || !finePointer() || reducedMotion()) return;
  cursorReady = true;
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  cursor.append(label);
  document.body.append(cursor);

  let x = -100;
  let y = -100;
  let cx = x;
  let cy = y;
  const loop = () => {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  document.addEventListener('pointermove', (e) => {
    x = e.clientX;
    y = e.clientY;
    cursor.classList.add('is-visible');
    const target = e.target as Element | null;
    const labelled = target?.closest<HTMLElement>('[data-cursor]');
    const link = target?.closest('a, button, [role="tab"], label, select, input, textarea');
    if (labelled) {
      label.textContent = labelled.dataset.cursor ?? '';
      cursor.classList.add('is-label');
      cursor.classList.remove('is-link');
    } else {
      cursor.classList.remove('is-label');
      cursor.classList.toggle('is-link', Boolean(link));
    }
  });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  // The cursor element lives outside the swapped content, so keep it on navigation.
  document.addEventListener('astro:after-swap', () => {
    if (!cursor.isConnected) document.body.append(cursor);
    cursor.classList.remove('is-label', 'is-link');
  });
}

/* ---------- Floating preview image over list rows (insights) ---------- */

function initHoverPreview() {
  const list = document.querySelector<HTMLElement>('[data-hover-preview]');
  if (!list || !finePointer() || reducedMotion()) return;
  const box = document.createElement('div');
  box.className = 'hover-preview';
  box.setAttribute('aria-hidden', 'true');
  const img = document.createElement('img');
  img.alt = '';
  box.append(img);
  document.body.append(box);
  let x = 0;
  let y = 0;
  let cx = 0;
  let cy = 0;
  let raf = 0;
  const loop = () => {
    cx += (x - cx) * 0.15;
    cy += (y - cy) * 0.15;
    box.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  const over = (e: PointerEvent) => {
    const row = (e.target as Element).closest<HTMLElement>('[data-preview]');
    x = e.clientX + 24;
    y = e.clientY - 90;
    if (row) {
      if (img.getAttribute('src') !== row.dataset.preview) img.src = row.dataset.preview ?? '';
      box.classList.add('is-visible');
    } else box.classList.remove('is-visible');
  };
  const out = () => box.classList.remove('is-visible');
  list.addEventListener('pointermove', over);
  list.addEventListener('pointerleave', out);
  onCleanup(() => {
    cancelAnimationFrame(raf);
    box.remove();
  });
}

/* ---------- Testimonial slider ---------- */

function initSliders() {
  document.querySelectorAll<HTMLElement>('[data-slider]').forEach((slider) => {
    const track = slider.querySelector<HTMLElement>('[data-slider-track]');
    const prev = slider.querySelector<HTMLButtonElement>('[data-slider-prev]');
    const next = slider.querySelector<HTMLButtonElement>('[data-slider-next]');
    const bar = slider.querySelector<HTMLElement>('[data-slider-bar]');
    if (!track) return;
    const step = () => (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 400;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 0;
      if (bar) bar.style.transform = `scaleX(${(0.15 + p * 0.85).toFixed(3)})`;
      if (prev) prev.disabled = track.scrollLeft < 4;
      if (next) next.disabled = track.scrollLeft > max - 4;
    };
    const goPrev = () => track.scrollBy({ left: -step() - 24, behavior: 'smooth' });
    const goNext = () => track.scrollBy({ left: step() + 24, behavior: 'smooth' });
    prev?.addEventListener('click', goPrev);
    next?.addEventListener('click', goNext);
    track.addEventListener('scroll', update, { passive: true });
    update();

    // Drag to scroll with a mouse.
    let down = false;
    let startX = 0;
    let startLeft = 0;
    const pd = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      down = true;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add('is-dragging');
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      track.scrollLeft = startLeft - (e.clientX - startX);
    };
    const pu = () => {
      down = false;
      track.classList.remove('is-dragging');
    };
    track.addEventListener('pointerdown', pd);
    window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    onCleanup(() => {
      prev?.removeEventListener('click', goPrev);
      next?.removeEventListener('click', goNext);
      track.removeEventListener('scroll', update);
      track.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu);
    });
  });
}

/* ---------- Works filter (animated with the View Transitions API when available) ---------- */

function initFilter() {
  const root = document.querySelector<HTMLElement>('[data-filter-root]');
  if (!root) return;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const items = [...root.querySelectorAll<HTMLElement>('[data-category]')];
  const apply = (value: string) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === value)));
    items.forEach((item) => {
      item.hidden = value !== 'all' && item.dataset.category !== value;
    });
  };
  const set = (value: string) => {
    const url = new URL(location.href);
    if (value === 'all') url.searchParams.delete('filter');
    else url.searchParams.set('filter', value);
    history.replaceState(history.state, '', url);
    if (document.startViewTransition && !reducedMotion()) {
      document.startViewTransition(() => apply(value));
    } else apply(value);
  };
  const initial = new URL(location.href).searchParams.get('filter');
  if (initial && buttons.some((b) => b.dataset.filter === initial)) apply(initial);
  buttons.forEach((b) => {
    const click = () => set(b.dataset.filter ?? 'all');
    b.addEventListener('click', click);
    onCleanup(() => b.removeEventListener('click', click));
  });
}

/* ---------- Local time (time zone from <html data-tz>, set in src/config.ts) ---------- */

function initClock() {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: document.documentElement.dataset.tz || undefined,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const tick = () => {
    const t = fmt.format(new Date());
    document.querySelectorAll<HTMLElement>('[data-local-time]').forEach((el) => {
      el.textContent = t + (el.dataset.suffix ?? '');
    });
  };
  tick();
  const id = window.setInterval(tick, 30_000);
  onCleanup(() => window.clearInterval(id));
}

/* ---------- Contact form: send through /api/contact, or compose a WhatsApp message ---------- */

function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const started = form.querySelector<HTMLInputElement>('input[name="started"]');
  if (started) started.value = String(Date.now());

  const compose = () => {
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    const lines = [
      `Name: ${get('name')}`,
      `Email: ${get('email')}`,
      get('company') && `Company: ${get('company')}`,
      get('type') && `Project type: ${get('type')}`,
      get('budget') && `Budget: ${get('budget')}`,
      get('timeline') && `Timeline: ${get('timeline')}`,
      '',
      get('details'),
    ].filter((l) => l !== false && l !== '') as string[];
    return { subject: `Project enquiry from ${get('name') || 'your website'}`, body: lines.join('\n') };
  };
  const say = (text: string, kind: 'success' | 'error') => {
    if (!status) return;
    status.textContent = text;
    status.classList.remove('is-success', 'is-error');
    status.classList.add(`is-${kind}`);
  };
  const mailto = () => {
    const { subject, body } = compose();
    return `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const via = (e.submitter as HTMLButtonElement | null)?.value;
    if (via === 'whatsapp') {
      const { subject, body } = compose();
      const number = form.dataset.whatsapp ?? '';
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(subject + '\n\n' + body)}`, '_blank', 'noopener');
      return;
    }
    form.classList.add('is-busy');
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const result = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !result.ok) throw new Error(result.error ?? String(res.status));
      form.reset();
      if (started) started.value = String(Date.now());
      say(`Thanks — your brief is in my inbox. I’ll reply within ${form.dataset.reply ?? 'a few days'}.`, 'success');
      form.classList.add('is-sent');
    } catch (err) {
      // If sending fails, fall back to the visitor's own email app so the brief is never lost.
      say('Opening your email app with the brief filled in, so nothing gets lost.', 'error');
      window.location.href = mailto();
      console.error(err);
    } finally {
      form.classList.remove('is-busy');
    }
  };
  form.addEventListener('submit', submit);
  onCleanup(() => form.removeEventListener('submit', submit));
}

/* ---------- Wiring ---------- */

let globalReady = false;

function init() {
  initLenis();
  initCursor();
  if (!globalReady) {
    globalReady = true;
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
  }
  initHeader();
  initExternalLinks();
  initReveals();
  initParallax();
  initStack();
  initShowreel();
  initHighlight();
  initProgress();
  initToc();
  initMagnetic();
  initHoverPreview();
  initSliders();
  initFilter();
  initClock();
  initContactForm();
  window.__motionReady = true;
}

document.addEventListener('astro:page-load', init);

document.addEventListener('astro:before-swap', () => {
  cleanups.forEach((fn) => fn());
  cleanups = [];
});

document.addEventListener('astro:after-swap', () => {
  lenis?.resize();
  if (!location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
});
