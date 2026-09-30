/* =========================================================
   Funngro — professional interactions
   Loaded with `defer`. Respects prefers-reduced-motion.
   ========================================================= */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  /* ---------- 1. Mobile nav toggle ---------- */
  const header = document.getElementById('site-header');
  const navToggle = header ? header.querySelector('.nav-toggle') : null;
  const nav = document.getElementById('site-nav');

  if (header && navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. Scroll progress bar ---------- */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  let rafProgress = false;
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = (scrolled * 100).toFixed(2) + '%';
    rafProgress = false;
  }
  window.addEventListener('scroll', () => {
    if (rafProgress) return;
    rafProgress = true;
    requestAnimationFrame(updateProgress);
  }, { passive: true });

  /* ---------- 3. Scroll reveal with stagger ---------- */
  // Assign --i index per group so stagger uses CSS only
  document.querySelectorAll('[data-stagger], [data-reveal-group]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--i', String(i));
      child.classList.add('reveal');
    });
  });
  document.querySelectorAll('.steps > .step, .work > .work-item, .stories > .story, .screens > .screen, .cat-grid > li').forEach((el, i) => {
    el.style.setProperty('--i', String(i % 6));
  });

  const revealEls = document.querySelectorAll('.reveal, [data-reveal-group], [data-stagger], .mask-line');

  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;

          if (el.classList.contains('mask-line')) {
            el.classList.add('in');
          } else if (el.matches('[data-reveal-group], [data-stagger]')) {
            Array.from(el.children).forEach((child) => {
              child.classList.add('in');
              const card = child.querySelector('.acard');
              if (card) card.classList.add('in');
            });
          } else {
            el.classList.add('in');
            // reveal any cards inside grid
            el.querySelectorAll?.('.acard').forEach((c) => c.classList.add('in'));
          }
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
    document.querySelectorAll('.acard').forEach((el) => el.classList.add('in'));
  }

  /* ---------- 4. Count-up for stats ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !prefersReduced) {
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          countIO.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countIO.observe(el));
  } else {
    counters.forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      el.textContent = formatNum(end) + suffix;
    });
  }

  function animateCount(el) {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      el.textContent = formatNum(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatNum(end) + suffix;
    }
    requestAnimationFrame(tick);
  }
  function formatNum(n) {
    if (n >= 1000) return Math.round(n).toLocaleString('en-IN');
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(0);
  }

  /* ---------- 5. Arcade category tabs (click + scroll-spy) ---------- */
  const catnav = document.getElementById('catnav');
  if (catnav) {
    catnav.addEventListener('click', (e) => {
      const btn = e.target.closest('.catbtn');
      if (!btn) return;
      catnav.querySelectorAll('.catbtn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('cat-' + btn.dataset.cat);
      if (target) {
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    });

    if ('IntersectionObserver' in window) {
      const sections = document.querySelectorAll('[id^="cat-"]');
      const spyIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id.replace('cat-', '');
              catnav.querySelectorAll('.catbtn').forEach((b) => {
                b.classList.toggle('active', b.dataset.cat === id);
              });
            }
          });
        },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      sections.forEach((s) => spyIO.observe(s));
    }
  }

  /* ---------- 6. Hero parallax + cursor spotlight ---------- */
  const hero = document.querySelector('.hero');
  if (hero && !prefersReduced) {
    const glows = hero.querySelectorAll('.hero-glow');
    const spotlight = document.createElement('div');
    spotlight.className = 'hero-spotlight';
    spotlight.setAttribute('aria-hidden', 'true');
    hero.prepend(spotlight);

    let raf = false;
    function updateParallax() {
      const y = window.pageYOffset;
      glows.forEach((g, i) => {
        const factor = i === 0 ? 0.1 : -0.06;
        g.style.transform = 'translate3d(0,' + (y * factor) + 'px,0)';
      });
      raf = false;
    }
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = true;
      requestAnimationFrame(updateParallax);
    }, { passive: true });

    if (isDesktop) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const cx = ((e.clientX - rect.left) / rect.width) * 100;
        const cy = ((e.clientY - rect.top) / rect.height) * 100;
        spotlight.style.setProperty('--cx', cx + '%');
        spotlight.style.setProperty('--cy', cy + '%');
      });
    }
  }

  /* ---------- 7. Magnetic buttons (subtle pull toward cursor) ---------- */
  if (isDesktop && !prefersReduced) {
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        btn.style.setProperty('--mx', x + '%');
        btn.style.setProperty('--my', y + '%');
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mx', '50%');
        btn.style.setProperty('--my', '50%');
      });
    });

    // Category buttons share the same spotlight trick
    document.querySelectorAll('.catbtn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        btn.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ---------- 8. Hero mask-line reveal on load ---------- */
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    requestAnimationFrame(() => {
      setTimeout(() => heroEl.classList.add('in'), 80);
    });
  }
})();