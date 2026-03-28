// ===== NAVBAR =====
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

// ===== HERO PARALLAX =====
window.addEventListener('scroll', () => {
  const logo = document.querySelector('.hero-logo');
  if (logo) logo.style.transform = `translateY(${window.scrollY * 0.06}px)`;
}, { passive: true });

// ===== CONTENT FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.content-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity    = show ? '1' : '0';
      card.style.transform  = show ? '' : 'scale(0.95)';
      card.style.pointerEvents = show ? '' : 'none';
      setTimeout(() => { if (!show) card.style.display = 'none'; }, 300);
      if (show) card.style.display = '';
    });
  });
});

// ===== BEFORE & AFTER SLIDER =====
function initSlider(el) {
  const after  = el.querySelector('.ba-after');
  const handle = el.querySelector('.ba-handle');
  let dragging = false;

  function setPos(x) {
    const rect = el.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left    = pct + '%';
  }

  el.addEventListener('mousedown',  e => { dragging = true; setPos(e.clientX); });
  el.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mousemove',  e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mouseup',  () => dragging = false);
  window.addEventListener('touchend', () => dragging = false);
}
document.querySelectorAll('.ba-slider').forEach(initSlider);

// ===== BOOKING CALENDAR =====
function buildCalendar() {
  const grid = document.getElementById('calGrid');
  if (!grid) return;
  const days = ['S','M','T','W','T','F','S'];
  days.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-day header'; el.textContent = d;
    grid.appendChild(el);
  });
  // Start March 2026 on Sunday
  for (let i = 0; i < 0; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty'; grid.appendChild(el);
  }
  for (let d = 1; d <= 31; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day'; el.textContent = d;
    if (d === 24) el.classList.add('active');
    el.addEventListener('click', () => {
      grid.querySelectorAll('.cal-day').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
    });
    grid.appendChild(el);
  }
}
buildCalendar();

document.querySelectorAll('.cal-time').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.cal-time').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
  });
});

// ===== QUIZ =====
const quizData = {
  results: {
    natural: {
      title: "You're a Natural Beauty ☀️",
      desc: "Your beauty style is effortless and radiant. You love a fresh-faced, glowy look that enhances your natural features without heavy coverage.",
      recs: ["NARS Sheer Glow Foundation","Fenty Beauty Gloss Bomb","Charlotte Tilbury Flawless Filter","Rare Beauty Soft Pinch Blush"]
    },
    bold: {
      title: "You're a Bold Trendsetter 🎉",
      desc: "You're fearless with color and love to make a statement. You're not afraid to experiment and your makeup is always conversation-worthy.",
      recs: ["Urban Decay All Nighter Setting Spray","Pat McGrath LuxeTrance Lipstick","Huda Beauty Obsessions Palette","Too Faced Better Than Sex Mascara"]
    },
    glam: {
      title: "You're a Glam Queen ✨",
      desc: "Full glam is your love language. You believe every day deserves a red-carpet moment and your makeup is always flawlessly polished.",
      recs: ["Charlotte Tilbury Airbrush Flawless Foundation","ABH Contour Kit","MAC False Lashes Mascara","Fenty Beauty Match Stix Shimmer"]
    },
    everyday: {
      title: "You're the Effortless Pro 💼",
      desc: "You've mastered the art of looking put-together without trying too hard. Your makeup is polished, professional, and always appropriate.",
      recs: ["Tarte Shape Tape Concealer","Benefit Gimme Brow","NARS Blush in Orgasm","Dior Addict Lip Glow"]
    }
  }
};

let quizAnswers = [];
let currentStep = 1;

function goToStep(step) {
  document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
  const next = document.querySelector(`.quiz-step[data-step="${step}"]`);
  if (next) { next.classList.add('active'); currentStep = step; }
  const bar = document.getElementById('quizBar');
  if (bar) bar.style.width = ((step - 1) / 3 * 100) + '%';
}

function showResult() {
  document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
  const result = document.getElementById('quizResult');
  result.classList.add('show');
  document.getElementById('quizBar').style.width = '100%';

  // Pick result based on first answer
  const key = quizAnswers[0] || 'glam';
  const data = quizData.results[key] || quizData.results.glam;
  document.getElementById('resultTitle').textContent = data.title;
  document.getElementById('resultDesc').textContent  = data.desc;
  const list = document.getElementById('resultList');
  list.innerHTML = '';
  data.recs.forEach(r => { const li = document.createElement('li'); li.textContent = r; list.appendChild(li); });
}

document.querySelectorAll('.quiz-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    opt.closest('.quiz-step').querySelectorAll('.quiz-opt').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    quizAnswers.push(opt.dataset.val);
    setTimeout(() => {
      if (currentStep < 3) goToStep(currentStep + 1);
      else showResult();
    }, 350);
  });
});

document.getElementById('retakeBtn')?.addEventListener('click', () => {
  quizAnswers = [];
  document.getElementById('quizResult').classList.remove('show');
  document.getElementById('quizBar').style.width = '0%';
  goToStep(1);
});

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ===== CONTACT FORM =====
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...'; btn.disabled = true;
  setTimeout(() => {
    e.target.reset();
    btn.textContent = 'Send Message ✦'; btn.disabled = false;
    showToast("✦ Message sent! I'll get back to you soon.");
  }, 1200);
});

// ===== NEWSLETTER =====
document.getElementById('newsletterForm')?.addEventListener('submit', e => {
  e.preventDefault(); e.target.reset();
  showToast("✦ You're in! Welcome to the Happy Hour Club.");
});

// ===== EMAIL POPUP =====
const popupOverlay = document.getElementById('popupOverlay');
const popupClose   = document.getElementById('popupClose');
const popupShown   = sessionStorage.getItem('popupShown');

if (!popupShown) {
  setTimeout(() => popupOverlay.classList.add('show'), 5000);
}
popupClose?.addEventListener('click', () => {
  popupOverlay.classList.remove('show');
  sessionStorage.setItem('popupShown', '1');
});
popupOverlay?.addEventListener('click', e => {
  if (e.target === popupOverlay) {
    popupOverlay.classList.remove('show');
    sessionStorage.setItem('popupShown', '1');
  }
});
document.getElementById('popupForm')?.addEventListener('submit', e => {
  e.preventDefault();
  popupOverlay.classList.remove('show');
  sessionStorage.setItem('popupShown', '1');
  showToast("✦ Welcome to the Happy Hour Club!");
});

// ===== SCROLL ANIMATIONS =====
const animEls = document.querySelectorAll(
  '.content-card, .shop-card, .collab-stat-card, .about-grid, .contact-grid, .section-header, .blog-card, .testimonial-card, .product-card, .gtl-card, .booking-opt, .bts-item, .ba-slider, .press-logo'
);
animEls.forEach(el => el.classList.add('fade-up'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
animEls.forEach(el => observer.observe(el));
