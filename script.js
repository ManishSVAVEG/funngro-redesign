/* Funngro — interactions, 3D tilt, mobile touch. Loaded with defer. */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  /* Mobile nav toggle */
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

  /* Reveal */
  const revealEls = document.querySelectorAll('.reveal, [data-reveal-group], .mask-line');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.matches('[data-reveal-group]')) {
          Array.from(el.children).forEach((child, i) => {
            child.style.setProperty('--i', String(i));
            child.classList.add('reveal');
            requestAnimationFrame(() => child.classList.add('in'));
          });
        }
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
    document.querySelectorAll('[data-reveal-group] > *').forEach((el) => el.classList.add('in'));
  }

  const heroEl = document.querySelector('.hero');
  if (heroEl) requestAnimationFrame(() => setTimeout(() => heroEl.classList.add('in'), 60));

  /* ---------- Phone 3D tilt (desktop) ---------- */
  const phone = document.getElementById('hero-phone');
  const stage = document.getElementById('phone-stage');
  if (phone && stage && !prefersReduced && canHover) {
    let raf = false, tx = 0, ty = 0, cx = 0, cy = 0;
    function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      phone.style.setProperty('--tx', (-cy * 3).toFixed(2) + 'deg');
      phone.style.setProperty('--ty', ( cx * 4).toFixed(2) + 'deg');
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(loop);
      else raf = false;
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(loop); }
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      schedule();
    });
    stage.addEventListener('mouseleave', () => { tx = 0; ty = 0; schedule(); });
  }

  /* ---------- Card 3D tilt (desktop hover) ---------- */
  if (canHover && !prefersReduced) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      let raf = false, tx = 0, ty = 0, cx = 0, cy = 0;
      function loop() {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        card.style.setProperty('--rx', (-cy * 3.5).toFixed(2) + 'deg');
        card.style.setProperty('--ry', ( cx * 3.5).toFixed(2) + 'deg');
        if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(loop);
        else raf = false;
      }
      function schedule() { if (!raf) raf = requestAnimationFrame(loop); }
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        ty = ((e.clientY - r.top) / r.height) * 2 - 1;
        schedule();
      });
      card.addEventListener('mouseleave', () => { tx = 0; ty = 0; schedule(); });
    });
  }

  /* ---------- Mobile: tap-to-tilt on cards ---------- */
  if (isTouch && !prefersReduced) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        const r = card.getBoundingClientRect();
        const tx = ((t.clientX - r.left) / r.width) * 2 - 1;
        const ty = ((t.clientY - r.top) / r.height) * 2 - 1;
        card.style.transition = 'transform .25s cubic-bezier(.16,1,.3,1)';
        card.style.transform = `perspective(900px) rotateX(${(-ty * 3).toFixed(2)}deg) rotateY(${(tx * 3).toFixed(2)}deg) translateY(-3px)`;
      }, { passive: true });

      card.addEventListener('touchend', () => {
        card.style.transform = '';
      }, { passive: true });
      card.addEventListener('touchcancel', () => {
        card.style.transform = '';
      }, { passive: true });
    });
  }

  /* ---------- Arcade nav: mobile drag-to-scroll ---------- */
  const arcadeNav = document.querySelector('.arcade-nav');
  if (arcadeNav && isTouch) {
    let isDown = false, startX = 0, startScroll = 0, moved = false;

    arcadeNav.addEventListener('pointerdown', (e) => {
      // Only drag with touch/pen — let mouse users use native scroll
      if (e.pointerType === 'mouse') return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = arcadeNav.scrollLeft;
      arcadeNav.classList.add('is-dragging');
    });

    arcadeNav.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      arcadeNav.scrollLeft = startScroll - dx;
    });

    function endDrag() {
      isDown = false;
      arcadeNav.classList.remove('is-dragging');
      // If user was scrolling, prevent the tap-click
      if (moved) {
        // brief guard so a link doesn't fire
        arcadeNav.style.pointerEvents = 'none';
        setTimeout(() => { arcadeNav.style.pointerEvents = ''; }, 0);
      }
    }
    arcadeNav.addEventListener('pointerup', endDrag);
    arcadeNav.addEventListener('pointercancel', endDrag);
    arcadeNav.addEventListener('pointerleave', endDrag);
  }

  /* ---------- FAQ: close others when one opens ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => { if (other !== item && other.open) other.open = false; });
      }
    });
  });
    /* ---------- Arcade: sync tabs + E L P tiles with scroll ---------- */
  const arcadeTabs = document.querySelectorAll('.arcade-tab');
  const arcadeElps = document.querySelectorAll('.arcade-elp-tile');
  const arcadeSections = document.querySelectorAll('#earn, #learn, #play');

  function setArcadeActive(id) {
    arcadeTabs.forEach((t) => t.classList.toggle('is-active', t.dataset.tab === id));
    arcadeElps.forEach((el) => el.classList.toggle('is-active', el.dataset.tab === id));
  }

  if (arcadeSections.length && 'IntersectionObserver' in window) {
    const arcadeIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === 'earn' || id === 'learn' || id === 'play') setArcadeActive(id);
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    arcadeSections.forEach((s) => arcadeIO.observe(s));
  }

  // Smooth scroll for arcade tabs + tiles (respect reduced motion)
  [...arcadeTabs, ...arcadeElps].forEach((el) => {
    el.addEventListener('click', (e) => {
      const id = el.dataset.tab;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      setArcadeActive(id);
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', '#' + id);
    });
  });
})();
