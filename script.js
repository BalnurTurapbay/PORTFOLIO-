/* =========================
   Balnur Portfolio — JS
   ========================= */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------------------------------
     Header: burger + nav on mobile
  --------------------------------- */
  const nav = $('.nav');
  const burger = $('.burger');
  if (burger && nav) {
    const ul = $('#navmenu', nav);
    const toggle = () => {
      const active = nav.classList.toggle('active');
      burger.setAttribute('aria-expanded', String(active));
      document.body.style.overflow = active ? 'hidden' : '';
    };
    burger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && nav.classList.contains('active')) toggle();
    });
    $$('#navmenu a').forEach(a => a.addEventListener('click', () => {
      if (nav.classList.contains('active')) toggle();
    }));
  }

  /* ---------------------------------
     Theme toggle with persistence
  --------------------------------- */
  const root = document.documentElement;
  const themeBtn = $('.theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  const setTheme = (t) => {
    root.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  };
  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(next);
  });
  // Default to dark
  if (!savedTheme) setTheme('dark');

  /* ---------------------------------
     AOS (scroll animations)
  --------------------------------- */
  if (window.AOS) {
    AOS.init({
      duration: 600,
      easing: 'ease-out',
      once: true,
      offset: 80
    });
  }

  /* ---------------------------------
     Smooth scroll for in-page anchors
  --------------------------------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', `#${id}`);
  });

  /* ---------------------------------
     Year in footer
  --------------------------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------
     Typewriter effect (hero h1)
  --------------------------------- */
  const typeEl = $('.typewriter');
  if (typeEl) {
    const full = typeEl.textContent.trim();
    typeEl.setAttribute('aria-label', full);
    typeEl.textContent = '';
    let i = 0;
    const speed = 18; // ms/char
    const tick = () => {
      if (i <= full.length) {
        typeEl.textContent = full.slice(0, i);
        i++;
        requestAnimationFrame(() => setTimeout(tick, speed));
      }
    };
    setTimeout(tick, 300);
  }

  /* ---------------------------------
     Canvas background (soft particles)
  --------------------------------- */
  const canvas = $('#bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles, rafId;
    const COLORS = ['#7cf0bd', '#7cc8ff', '#ffffff'];

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    };

    const spawn = () => {
      const count = Math.round((w * h) / 24000); // density
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.8,
        vx: (-0.2 + Math.random() * 0.4),
        vy: (-0.2 + Math.random() * 0.4),
        c: COLORS[(Math.random() * COLORS.length) | 0],
        alpha: 0.25 + Math.random() * 0.55
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5;
        if (p.y > h + 5) p.y = -5;

        // soft glow
        ctx.globalAlpha = p.alpha * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, p.c + 'aa');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fill();

        // core
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();
      }
      rafId = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(rafId);
      resize();
      step();
    });
    step();
  }

  /* ---------------------------------
     Skills: linear meters animation
  --------------------------------- */
  const meters = $$('.meter span');
  if (meters.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(getComputedStyle(el).getPropertyValue('--val')) || 70;
          el.style.width = 0;
          requestAnimationFrame(() => {
            el.style.transition = 'width 900ms cubic-bezier(.2,.8,.2,1)';
            el.style.width = `var(--val)`;
          });
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    meters.forEach(m => obs.observe(m));
  }

  /* ---------------------------------
     Skills: radial meters animation
  --------------------------------- */
  const radials = $$('.radial');
  if (radials.length) {
    radials.forEach(r => {
      const value = parseFloat(r.dataset.value || r.style.getPropertyValue('--value') || '0.7');
      r.style.setProperty('--value', 0);
      const label = r.dataset.label || '';
      let current = 0;
      const animate = () => {
        current += (value - current) * 0.08;
        if (Math.abs(current - value) < 0.003) current = value;
        r.style.setProperty('--value', current.toString());
        r.textContent = `${Math.round(current * 100)}%`;
        if (current !== value) requestAnimationFrame(animate);
      };
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animate();
            io.disconnect();
          }
        });
      }, { threshold: 0.5 });
      io.observe(r);
      // Accessible label as title
      r.title = `${label}: ${Math.round(value * 100)}%`;
    });
  }

  /* ---------------------------------
     Modals (cases) — accessible
  --------------------------------- */
  const openBtns = $$('[data-modal-open]');
  const modals = $$('.modal');
  const focusable = 'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])';
  let lastActive = null;

  const openModal = (id) => {
    const m = document.getElementById(id);
    if (!m) return;
    lastActive = document.activeElement;
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
    m.setAttribute('aria-modal', 'true');
    const f = $(focusable, m);
    f?.focus();
    document.body.style.overflow = 'hidden';
    trapFocus(m);
  };

  const closeModal = (m) => {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
    m.setAttribute('aria-modal', 'false');
    document.body.style.overflow = '';
    releaseFocus();
    lastActive?.focus();
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
  });
  modals.forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) closeModal(m);
    });
    $('[data-modal-close]', m)?.addEventListener('click', () => closeModal(m));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && m.classList.contains('open')) closeModal(m);
    });
  });

  // Focus trap
  let untrap = null;
  function trapFocus(container) {
    const nodes = $$(focusable, container);
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const handler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    container.addEventListener('keydown', handler);
    untrap = () => container.removeEventListener('keydown', handler);
  }
  function releaseFocus() { untrap?.(); untrap = null; }

  /* ---------------------------------
     Contact form: validate + send
  --------------------------------- */
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();

      if (!name || !email || !message) return toast('Заполните все поля', 'error');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast('Некорректный email', 'error');

      try {
        const res = await fetch(form.action || '/send.php', {
          method: 'POST',
          body: fd
        });
        if (!res.ok) throw new Error('Network');
        toast('Спасибо! Сообщение отправлено.');
        form.reset();
      } catch (err) {
        toast('Не удалось отправить. Попробуйте позже.', 'error');
      }
    });
  }

  /* ---------------------------------
     Toast notifications
  --------------------------------- */
  let toastWrap = null;
  function toast(text, type = 'ok', timeout = 3000) {
    if (!toastWrap) {
      toastWrap = document.createElement('div');
      toastWrap.style.position = 'fixed';
      toastWrap.style.right = '16px';
      toastWrap.style.bottom = '16px';
      toastWrap.style.display = 'grid';
      toastWrap.style.gap = '8px';
      toastWrap.style.zIndex = '100';
      document.body.appendChild(toastWrap);
    }
    const el = document.createElement('div');
    el.textContent = text;
    el.setAttribute('role', 'status');
    el.style.padding = '10px 12px';
    el.style.borderRadius = '12px';
    el.style.border = '1px solid var(--border)';
    el.style.background = 'var(--bg-elev)';
    el.style.color = 'var(--text)';
    el.style.boxShadow = 'var(--shadow)';
    el.style.transform = 'translateY(10px)';
    el.style.opacity = '0';
    el.style.transition = 'all 220ms cubic-bezier(.2,.8,.2,1)';
    if (type === 'error') el.style.borderColor = 'rgba(255,107,107,.55)';
    toastWrap.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    });
    setTimeout(() => {
      el.style.transform = 'translateY(10px)';
      el.style.opacity = '0';
      el.addEventListener('transitionend', () => el.remove(), { once: true });
    }, timeout);
  }

  /* ---------------------------------
     Optional: GSAP parallax on hero
  --------------------------------- */
  if (window.gsap) {
    const media = $('.hero__media');
    const text = $('.hero__text');
    if (media && text) {
      gsap.from(media, { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 });
      gsap.from(text, { y: 14, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.05 });
    }
  }

  /* ---------------------------------
     Small UX niceties
  --------------------------------- */
  // Reduce motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // could disable canvas or gsap heavy animations here if needed
  }

  // External links: open in new tab (safety)
  $$('a[target="_blank"]').forEach(a => a.setAttribute('rel', 'noopener'));

})();
