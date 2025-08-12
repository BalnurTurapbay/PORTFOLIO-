// Year
document.getElementById('year')?.append(new Date().getFullYear());

// Mobile menu
const burger = document.querySelector('.nav__burger');
const links = document.querySelector('.nav__links');
burger?.addEventListener('click', () => {
  links?.classList.toggle('open');
  if (links?.classList.contains('open')) {
    links.style.display = 'grid';
    links.style.gap = '10px';
    links.style.position = 'absolute';
    links.style.top = '70px';
    links.style.right = '16px';
    links.style.background = '#fff';
    links.style.border = '1px solid #e6edf5';
    links.style.borderRadius = '14px';
    links.style.padding = '10px';
    links.style.boxShadow = '0 10px 30px rgba(15,23,42,.12)';
  } else {
    links?.removeAttribute('style');
  }
});

// Smooth scroll
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  links?.classList.remove('open');
  links?.removeAttribute('style');
});

// Scroll progress
const prog = document.getElementById('progress');
const onScroll = () => {
  if (!prog) return;
  const h = document.documentElement;
  const sc = h.scrollTop / (h.scrollHeight - h.clientHeight);
  prog.style.transform = `scaleX(${Math.max(0, Math.min(1, sc))})`;
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on scroll (для всех [data-animate], в т.ч. pillbar)
const reveal = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      reveal.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('[data-animate]').forEach(el => reveal.observe(el));

// Magnetic hover
function makeMagnet(el) {
  const strength = 20;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
}
document.querySelectorAll('.magnet, .chip').forEach(makeMagnet);

// 3D tilt
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 8;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = 'rotateX(0) rotateY(0)');
});

// Parallax (hero columns)
document.querySelectorAll('[data-parallax]').forEach(el => {
  const factor = el.classList.contains('hero__col--media') ? 0.05 : 0.03;
  window.addEventListener('scroll', () => {
    const y = window.scrollY * factor;
    el.style.transform = `translateY(${y}px)`;
  }, { passive: true });
});

// Linear meters
const meters = document.querySelectorAll('.meter span');
if (meters.length) {
  const io = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const v = getComputedStyle(el).getPropertyValue('--val') || '70%';
        el.style.width = '0';
        requestAnimationFrame(() => el.style.width = v);
        io.unobserve(el);
      }
    });
  }, { threshold: .5 });
  meters.forEach(m => io.observe(m));
}

// Radials
document.querySelectorAll('.radial').forEach(rad => {
  const value = parseFloat(rad.dataset.value || '0.7');
  let cur = 0;
  const draw = () => {
    cur += (value - cur) * .08;
    if (Math.abs(cur - value) < .003) cur = value;
    rad.style.setProperty('--value', cur.toString());
    rad.innerHTML = `<span>${Math.round(cur * 100)}%</span>`;
    if (cur !== value) requestAnimationFrame(draw);
  };
  const io = new IntersectionObserver(es => {
    if (es[0].isIntersecting) { draw(); io.disconnect(); }
  }, { threshold: .6 });
  io.observe(rad);
});

// Header tone on scroll
const headerEl = document.querySelector('.nav');
function toggleHeaderTone(){
  if (!headerEl) return;
  headerEl.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', toggleHeaderTone, { passive: true });
toggleHeaderTone();