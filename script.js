// Configuration: add your image file names inside assets/images
const imageFileNames = [
  'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg', 'photo7.jpg', 'photo8.jpg', 'photo9.jpg',
  'photo10.jpg', 'photo11.jpg', 'photo12.jpg', 'photo13.jpg', 'photo14.jpg', 'photo15.jpg', 'photo16.jpg', 'photo17.jpg', 'photo18.jpg', 'photo19.jpg',
  'photo20.jpg', 'photo21.jpg', 'photo22.jpg', 'photo23.jpg', 'photo24.jpg', 'photo25.jpg', 'photo26.jpg', 'photo27.jpg', 'photo28.jpg', 'photo29.jpg',
  'photo30.jpg', 'photo31.jpg', 'photo32.jpg', 'photo33.jpg'
];

const state = {
  currentIndex: 0,
  images: [],
  lightboxOpen: false,
};

document.addEventListener('DOMContentLoaded', () => {
  initializeGallery();
  initializeLightbox();
  initializeMusic();
  initializeCelebrate();
  setupConfettiCanvas();
  initializeRotatingWord();
  initializeRevealOnScroll();
  initializeCustomCursor();
});

function initializeGallery() {
  const grid = document.getElementById('gallery-grid');
  const files = imageFileNames.slice();
  if (!files.length) {
    grid.setAttribute('data-empty', 'true');
    grid.innerHTML = `<div class="empty">
      <p>${grid.dataset.emptyHint}</p>
      <p><small>Update image list in <code>script.js</code>.</small></p>
    </div>`;
    return;
  }
  state.images = files.map((name) => `./assets/images/${name}`);
  const fragment = document.createDocumentFragment();
  state.images.forEach((src, idx) => {
    const item = document.createElement('button');
    item.className = 'gallery__item';
    item.setAttribute('aria-label', `Open image ${idx + 1}`);
    item.addEventListener('click', () => openLightbox(idx));

    const img = document.createElement('img');
    img.className = 'gallery__img';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = src;
    img.alt = `Photo ${idx + 1}`;

    item.appendChild(img);
    fragment.appendChild(item);
  });
  grid.textContent = '';
  grid.appendChild(fragment);
}

/* Lightbox */
function initializeLightbox() {
  const overlay = document.getElementById('lightbox');
  const imageEl = document.getElementById('lightbox-image');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  function render() {
    if (!state.images.length) return;
    imageEl.src = state.images[state.currentIndex];
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    state.lightboxOpen = false;
  }

  window.openLightbox = function(index) {
    state.currentIndex = index;
    render();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    state.lightboxOpen = true;
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  prevBtn.addEventListener('click', () => { if (!state.images.length) return; state.currentIndex = (state.currentIndex - 1 + state.images.length) % state.images.length; render(); });
  nextBtn.addEventListener('click', () => { if (!state.images.length) return; state.currentIndex = (state.currentIndex + 1) % state.images.length; render(); });
  window.addEventListener('keydown', (e) => {
    if (!state.lightboxOpen) return;
    if (e.key === 'Escape') return close();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}

/* Music */
function initializeMusic() {
  const audio = document.getElementById('bg-music');
  const toggle = document.getElementById('music-toggle');
  if (!audio || !toggle) return;

  let playing = false;
  async function play() {
    try {
      await audio.play();
      playing = true;
      toggle.setAttribute('aria-pressed', 'true');
      toggle.title = 'Pause music';
    } catch (err) {
      // Autoplay prevented
    }
  }
  function pause() {
    audio.pause();
    playing = false;
    toggle.setAttribute('aria-pressed', 'false');
    toggle.title = 'Play music';
  }
  toggle.addEventListener('click', () => (playing ? pause() : play()));
}

/* Celebrate button + confetti */
function initializeCelebrate() {
  const btn = document.getElementById('celebrate-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    burstConfetti();
    fireworks(window.innerWidth/2, window.innerHeight/3);
  });
  // Small auto burst after load
  setTimeout(() => burstConfetti(120), 600);
}

/* Custom cursor and heart trail */
function initializeCustomCursor() {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let x = 0, y = 0;
  let tx = 0, ty = 0;
  const speed = 0.25;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    spawnHeart(tx, ty);
  });

  function animate() {
    x += (tx - x) * speed;
    y += (ty - y) * speed;
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

function spawnHeart(x, y) {
  const el = document.createElement('div');
  el.className = 'heart';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  const driftX = (Math.random() - 0.5) * 40;
  const duration = 800 + Math.random() * 500;
  const start = performance.now();
  function step(t) {
    const p = Math.min(1, (t - start) / duration);
    el.style.transform = `translate(${driftX * p}px, ${-40 * p}px) rotate(45deg)`;
    el.style.opacity = String(1 - p);
    if (p < 1) requestAnimationFrame(step); else el.remove();
  }
  requestAnimationFrame(step);
}

/* Fireworks burst */
function fireworks(cx, cy) {
  const colors = ['#ff8db3', '#ffd166', '#8ec5ff', '#95f1c8', '#ffffff'];
  for (let i = 0; i < 8; i++) {
    setTimeout(() => burstParticles(cx, cy, colors), i * 80);
  }
}

function burstParticles(cx, cy, colors) {
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 0,
    });
  }
}

/* Confetti implementation */
let confettiCtx, confettiCanvas, particles = [];
function setupConfettiCanvas() {
  confettiCanvas = document.getElementById('confetti-canvas');
  confettiCtx = confettiCanvas.getContext('2d');
  const resize = () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(tick);
}

function burstConfetti(count = 200) {
  const colors = ['#ff8db3', '#ff6b9d', '#ffd166', '#8ec5ff', '#95f1c8'];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 3,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -8 - 4,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      life: 0,
    });
  }
}

function tick() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  const gravity = 0.18;
  const drag = 0.995;
  particles.forEach((p) => {
    p.life += 1;
    p.vx *= drag;
    p.vy = p.vy * drag + gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.vr;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rotation);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    confettiCtx.restore();
  });
  particles = particles.filter((p) => p.y < confettiCanvas.height + 40 && p.life < 800);
  requestAnimationFrame(tick);
}

/* Rotating word in subtitle */
function initializeRotatingWord() {
  const el = document.querySelector('.rotating-word');
  if (!el) return;
  const words = ['lovely', 'radiant', 'amazing', 'magical'];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = words[i]; el.style.opacity = '1'; }, 250);
  }, 2200);
}

/* Reveal on scroll */
function initializeRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  items.forEach((el) => io.observe(el));
}

