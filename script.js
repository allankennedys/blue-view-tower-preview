'use strict';

const yieldToMain = () =>
  typeof scheduler !== 'undefined' && scheduler.yield
    ? scheduler.yield()
    : new Promise(r => setTimeout(r, 0));

document.addEventListener('DOMContentLoaded', async () => {

  /* ---------- Header (crítico — roda imediatamente) ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- CTA fixo mobile: aparece a partir da 4ª seção, some quando algum btn estiver visível ---------- */
  const mobileCTABar = document.querySelector('.mobile-cta-bar');
  if (mobileCTABar) {
    let visibleBtns = 0;
    let reachedFourth = false;

    const update = () => mobileCTABar.classList.toggle('hidden', !reachedFourth || visibleBtns > 0);

    const fourthSection = document.querySelector('.location');
    if (fourthSection) {
      new IntersectionObserver(([e]) => {
        reachedFourth = e.isIntersecting || e.boundingClientRect.top < 0;
        update();
      }, { threshold: 0 }).observe(fourthSection);
    }

    const btnObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { visibleBtns = Math.max(0, visibleBtns + (e.isIntersecting ? 1 : -1)); });
      update();
    }, { threshold: 0.5 });

    document.querySelectorAll('.btn').forEach(el => btnObserver.observe(el));
  }

  await yieldToMain();

  /* ---------- Reveal on scroll + counters ---------- */
  document.querySelectorAll('.section, .stats, .about-cards, .feature-grid, .typo-grid')
    .forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.stat-num[data-count]').forEach(n => {
        if (!n.dataset.done) {
          n.dataset.done = '1';
          animateCounter(n);
        }
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  await yieldToMain();

  /* ---------- Dropdown de idioma (mobile) ---------- */
  const langSwitch = document.querySelector('.lang-switch');
  const langToggle = langSwitch?.querySelector('.lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', e => {
      e.stopPropagation();
      const open = langSwitch.classList.toggle('open');
      langToggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', () => {
      langSwitch.classList.remove('open');
      langToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* ---------- Gráficos donut de progresso ---------- */
  initDonutCharts();

  /* ---------- Carrossel de plantas ---------- */
  const typoTrack = document.querySelector('.typo-track');
  if (typoTrack) {
    const scrollAmt = () => typoTrack.clientWidth + 24;
    document.querySelector('.typo-prev')?.addEventListener('click', () =>
      typoTrack.scrollBy({ left: -scrollAmt(), behavior: 'smooth' }));
    document.querySelector('.typo-next')?.addEventListener('click', () =>
      typoTrack.scrollBy({ left: scrollAmt(), behavior: 'smooth' }));
  }

  /* ---------- Carousel de lazer ---------- */
  initCarousel(document.getElementById('lazerCarousel'));

  /* ---------- Carousel de portfólio ---------- */
  initPortfolioCarousel();

  await yieldToMain();

  /* ---------- Player de vídeo (thumbnail → vídeo) ---------- */
  const player = document.getElementById('videoPlayer');
  if (player) {
    player.addEventListener('click', () => {
      player.innerHTML = `
        <video controls muted autoplay playsinline preload="metadata" class="immersive-video">
          <source src="/assets/altimetria-blueview-animacao02.webm" type="video/webm">
          <source src="/assets/altimetria-blueview-animacao02.mp4" type="video/mp4">
        </video>`;
    }, { once: true });
  }

  /* ---------- Formulário ---------- */
  initForm(document.getElementById('leadForm'));

  await yieldToMain();

  /* ---------- Modal de planta ---------- */
  const preview = document.querySelector('.plant-preview');
  const modal = document.getElementById('plantModal');
  if (preview && modal) {
    preview.addEventListener('click', () => modal.classList.add('active'));
    modal.addEventListener('click', () => modal.classList.remove('active'));
  }

  /* ---------- Lazy mapa ---------- */
  const map = document.querySelector('.map');
  if (map) {
    const mapObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        map.src = map.src;
        mapObserver.disconnect();
      }
    });
    mapObserver.observe(map);
  }
});



/* ============================================================
   Contador animado
   ============================================================ */
function animateCounter(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();

  function step() {
    const progress = Math.min((performance.now() - start) / duration, 1);

    el.textContent =
      Math.floor(target * progress).toLocaleString('pt-BR') + suffix;

    if (progress < 1) {
      setTimeout(step, 16); 
    }
  }

  step();
}


/* ============================================================
   Gráficos donut
   ============================================================ */
function initDonutCharts() {
  const CIRC = 251.3;
  const fills = document.querySelectorAll('.donut-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const pct = parseFloat(el.dataset.pct) || 0;
      el.style.strokeDashoffset = CIRC * (1 - pct / 100);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });

  fills.forEach(el => observer.observe(el));
}

/* ============================================================
   Carousel reutilizável
   ============================================================ */
function initCarousel(root) {
  if (!root) return;

  const track = root.querySelector('.carousel-track');
  const slides = [...track.children];
  const dotsWrap = root.querySelector('.carousel-dots');

  let index = 0;
  let timer = null;
  let running = true;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.children];

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  const go = (i) => {
    index = (i + slides.length) % slides.length;
    render();
    restart();
  };

  const loop = () => {
    if (!running) return;
    go(index + 1);
    timer = setTimeout(loop, 2000);
  };

  const restart = () => {
    clearTimeout(timer);
    timer = setTimeout(loop, 2000);
  };

  const stop = () => {
    clearTimeout(timer);
    timer = null;
  };

  const io = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;

    if (running) restart();
    else stop();
  }, {
    threshold: 0.2
  });

  io.observe(root);

  const btnScope = root.querySelector('.prev') ? root : (root.parentElement || root);
  btnScope.querySelector('.prev').addEventListener('click', () => go(index - 1));
  btnScope.querySelector('.next').addEventListener('click', () => go(index + 1));

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', () => {
    if (running) restart();
  });

  render();
  restart();
}



/* ============================================================
   Carousel de portfólio (3-per-view no desktop, 1-per-view no mobile)
   ============================================================ */
function initPortfolioCarousel() {
  const root = document.getElementById('portfolioCarousel');
  if (!root) return;

  const isMobile = window.innerWidth <= 640;
  if (isMobile) { initCarousel(root); return; }

  const track  = root.querySelector('.carousel-track');
  const slides = [...track.children];
  const wrap   = root.parentElement;
  const perView = 3;
  const maxIndex = Math.max(0, slides.length - perView);
  let index = 0;

  const prevBtn = wrap.querySelector('.prev');
  const nextBtn = wrap.querySelector('.next');

  const render = () => {
    track.style.transform = `translateX(-${index * (100 / perView)}%)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === maxIndex;
  };

  const go = (i) => {
    index = Math.max(0, Math.min(i, maxIndex));
    render();
  };

  prevBtn.addEventListener('click', () => go(index - 1));
  nextBtn.addEventListener('click', () => go(index + 1));

  render();
}

/* ============================================================
   Formulário
   ============================================================ */
function initForm(form) {
  if (!form) return;
  const success = document.getElementById('formSuccess');

  const setError = (input, msg) => {
    const field = input.closest('.field');
    field.classList.toggle('invalid', !!msg);
    const span = field.querySelector('.error');
    if (span) span.textContent = msg;
  };

  const validators = {
    nome:     v => v.trim().length >= 2 ? '' : 'Informe seu nome completo.',
    whatsapp: v => v.replace(/\D/g, '').length >= 10 ? '' : 'Informe um WhatsApp válido com DDD.',
    email:    v => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Informe um e-mail válido.'
  };

  const wpp = form.querySelector('#whatsapp');
  wpp.addEventListener('input', () => {
    let d = wpp.value.replace(/\D/g, '').slice(0, 11);
    if (d.length > 6)      d = `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
    else if (d.length > 2) d = `(${d.slice(0,2)}) ${d.slice(2)}`;
    else if (d.length > 0) d = `(${d}`;
    wpp.value = d;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    for (const [name, rule] of Object.entries(validators)) {
      const input = form.elements[name];
      if (!input) continue;
      const msg = rule(input.value);
      setError(input, msg);
      if (msg) valid = false;
    }
    if (!valid) {
      form.querySelector('.field.invalid input')?.focus();
      return;
    }
    form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => setError(input, ''));
  });
}


const mapObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    setTimeout(() => {
      map.src = map.dataset.src;
    }, 300); // evita pico de carga
    mapObserver.disconnect();
  }
}, {
  rootMargin: '300px 0px'
});

// gallery carousel — 1 s interval
(function () {
  const root = document.getElementById('galleryCarousel');
  if (!root) return;

  const track    = root.querySelector('.carousel-track');
  const slides   = [...track.children];
  const dotsWrap = root.querySelector('.carousel-dots');

  let index   = 0;
  let timer   = null;
  let running = true;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });

  const dots = [...dotsWrap.children];

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  const go = (i) => {
    index = (i + slides.length) % slides.length;
    render();
    restart();
  };

  const loop = () => {
    if (!running) return;
    go(index + 1);
    timer = setTimeout(loop, 1000);
  };

  const restart = () => {
    clearTimeout(timer);
    timer = setTimeout(loop, 1000);
  };

  const stop = () => { clearTimeout(timer); timer = null; };

  new IntersectionObserver(([e]) => {
    running = e.isIntersecting;
    running ? restart() : stop();
  }, { threshold: 0.2 }).observe(root);

  root.querySelector('.prev').addEventListener('click', () => go(index - 1));
  root.querySelector('.next').addEventListener('click', () => go(index + 1));
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', () => { if (running) restart(); });

  render();
  restart();
}());