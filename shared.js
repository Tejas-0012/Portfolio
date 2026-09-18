/* ============================================================
   SHARED SCRIPTS — Tejas L Portfolio
   All pages include this once at the end of <body>.
   ============================================================ */

/* ---------- 1. NAV: mobile drawer + smooth scroll ---------- */
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  const close  = document.querySelector('.nav-drawer .close');

  if(!toggle || !drawer) return;

  function open(){
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function shut(){
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', open);
  close?.addEventListener('click', shut);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && drawer.classList.contains('open')) shut();
  });
})();

/* ---------- 2. SCROLL REVEAL ---------- */
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;

  if(!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if(e.isIntersecting){
        e.target.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ---------- 3. ROLE ROTATOR (hero) ---------- */
(function(){
  const el = document.getElementById('rotator');
  if(!el) return;

  const roles = JSON.parse(el.dataset.roles || '["Developer"]');
  let ri = 0, ci = 0, deleting = false;

  function tick(){
    const word = roles[ri];
    el.textContent = word.slice(0, ci);

    if(!deleting && ci < word.length){
      ci++; setTimeout(tick, 70);
    } else if(!deleting && ci === word.length){
      deleting = true; setTimeout(tick, 1400);
    } else if(deleting && ci > 0){
      ci--; setTimeout(tick, 32);
    } else {
      deleting = false;
      ri = (ri + 1) % roles.length;
      setTimeout(tick, 240);
    }
  }
  tick();
})();

/* ---------- 4. LIGHTBOX GALLERY ---------- */
(function(){
  const gallery = document.querySelector('.gallery');
  const lb      = document.getElementById('lightbox');
  if(!gallery || !lb) return;

  const shots   = Array.from(gallery.querySelectorAll('.shot'));
  const imgEl   = document.getElementById('lb-img');
  const capEl   = document.getElementById('lb-caption');
  const counter = document.getElementById('lb-counter');
  const btnPrev = document.getElementById('lb-prev');
  const btnNext = document.getElementById('lb-next');
  const btnClose= document.getElementById('lb-close');

  let current = 0;

  function show(i){
    current = (i + shots.length) % shots.length;
    const shot = shots[current];
    const img  = shot.querySelector('img');
    imgEl.src = shot.dataset.img || img.src;
    imgEl.alt = img.alt || '';
    capEl.textContent = shot.dataset.caption || '';
    counter.textContent = `${current + 1} / ${shots.length}`;
  }
  function open(i){
    show(i);
    if(typeof lb.showModal === 'function') lb.showModal();
    else lb.setAttribute('open','');
  }

  shots.forEach((shot, i) => {
    shot.setAttribute('tabindex','0');
    shot.setAttribute('role','button');
    shot.addEventListener('click', () => open(i));
    shot.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(i); }
    });
  });

  btnPrev?.addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
  btnNext?.addEventListener('click', e => { e.stopPropagation(); show(current + 1); });
  btnClose?.addEventListener('click', () => lb.close());

  lb.addEventListener('click', e => {
    if(e.target === lb || e.target.classList.contains('lb-inner')) lb.close();
  });

  // Touch swipe
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', e => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(delta) > 50){
      show(current + (delta < 0 ? 1 : -1));
    }
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if(!lb.open) return;
    if(e.key === 'Escape') lb.close();
    if(e.key === 'ArrowLeft')  show(current - 1);
    if(e.key === 'ArrowRight') show(current + 1);
  });
})();

/* ---------- 5. CURSOR GLOW on cards ---------- */
(function(){
  if(!window.matchMedia('(hover: hover)').matches) return;

  const cards = document.querySelectorAll('.card, .project, .feature');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();

/* ---------- 6. SCROLL-TO-TOP ---------- */
(function(){
  const btn = document.querySelector('.to-top');
  if(!btn) return;

  function check(){
    btn.classList.toggle('visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', check, { passive: true });
  check();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---------- 7. FOOTER YEAR ---------- */
(function(){
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
})();

/* ---------- 8. THEME TOGGLE ---------- */
(function(){
  const btn = document.getElementById('theme-toggle');
  if(!btn) return;

  const root = document.documentElement;
  const darkIcon = btn.querySelector('.theme-icon-dark');
  const lightIcon = btn.querySelector('.theme-icon-light');

  function updateIcon(theme){
    if(theme === 'light'){
      darkIcon.style.display = 'none';
      lightIcon.style.display = 'inline';
    } else {
      darkIcon.style.display = 'inline';
      lightIcon.style.display = 'none';
    }
  }

  function setTheme(theme, animate){
    if(animate){
      root.classList.add('theme-transitioning');
      setTimeout(() => root.classList.remove('theme-transitioning'), 400);
    }
    root.setAttribute('data-theme', theme);
    try{ localStorage.setItem('theme', theme); }catch(e){}
    updateIcon(theme);
  }

  function toggle(){
    const current = root.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark', true);
  }

  btn.addEventListener('click', toggle);

  // Keyboard shortcut: press "T"
  document.addEventListener('keydown', e => {
    if(e.key.toLowerCase() === 't' &&
       !e.target.matches('input, textarea, [contenteditable]')){
      toggle();
    }
  });

  // Follow system change if user hasn't chosen manually
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if(!localStorage.getItem('theme')){
      setTheme(e.matches ? 'light' : 'dark', true);
    }
  });

  // Init icon on load
  updateIcon(root.getAttribute('data-theme') || 'dark');
})();