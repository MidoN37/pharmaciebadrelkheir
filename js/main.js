/* =========================================================
   PHARMACIE BADR EL KHEIR – main.js
   ========================================================= */

/* ── HOURS CONFIGURATION ─────────────────────────────────── */
const HOURS = {
  // day index (0=Sun, 1=Mon...6=Sat)
  // Each entry: [open1_h, open1_m, close1_h, close1_m, open2_h, open2_m, close2_h, close2_m]
  // null = closed all day
  0: null, // Sunday
  1: [9, 0, 13, 0, 15, 30, 20, 30], // Monday
  2: [9, 0, 13, 0, 15, 30, 20, 30],
  3: [9, 0, 13, 0, 15, 30, 20, 30],
  4: [9, 0, 13, 0, 15, 30, 20, 30],
  5: [9, 0, 13, 0, 15, 30, 20, 30], // Friday
  6: [9, 0, 13, 0, null, null, null, null], // Saturday (morning only)
};

/* ── TRANSLATIONS ────────────────────────────────────────── */
const TRANSLATIONS = {
  fr: {
    openNow: "Ouvert maintenant",
    closedNow: "Fermé",
    reminderNamePlaceholder: "Votre nom",
    reminderPhonePlaceholder: "Votre numéro de téléphone",
    seasonSummer: "☀️ Été : Pensez à la protection solaire ! Nos crèmes SPF 30 et 50+ sont disponibles.",
    seasonWinter: "🧣 Hiver : Protégez-vous de la grippe. Vaccins saisonniers disponibles sur prescription.",
    seasonSpring: "🌸 Printemps : Saison des allergies. Antihistaminiques et conseils disponibles.",
    seasonAutumn: "🍂 Automne : Renforcez vos défenses. Vitamines D et C disponibles en officine.",
  },
  ar: {
    openNow: "مفتوح الآن",
    closedNow: "مغلق",
    reminderNamePlaceholder: "اسمكم",
    reminderPhonePlaceholder: "رقم هاتفكم",
    seasonSummer: "☀️ الصيف: تذكّروا الحماية من الشمس! واقيات SPF 30 و50+ متوفرة.",
    seasonWinter: "🧣 الشتاء: احموا أنفسكم من الإنفلونزا. اللقاحات الموسمية متوفرة بوصفة طبية.",
    seasonSpring: "🌸 الربيع: موسم الحساسية. مضادات الهيستامين والنصائح متاحة.",
    seasonAutumn: "🍂 الخريف: عززوا مناعتكم. فيتامينات D وC متوفرة في الصيدلية.",
  }
};

/* ── STATE ───────────────────────────────────────────────── */
let currentLang = 'fr';

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('pbe-lang');
  if (saved === 'fr' || saved === 'ar') {
    // Skip the overlay, apply language immediately
    hideLangOverlay();
    applyLanguage(saved, false);
  } else {
    document.getElementById('lang-overlay').style.display = 'flex';
  }
  initScrollSpy();
  initScrollAnimations();
});

/* ── LANGUAGE SELECTION ──────────────────────────────────── */
function setLanguage(lang) {
  localStorage.setItem('pbe-lang', lang);
  hideLangOverlay();
  applyLanguage(lang, true);
}

function toggleLanguage() {
  const next = currentLang === 'fr' ? 'ar' : 'fr';
  localStorage.setItem('pbe-lang', next);
  applyLanguage(next, true);
}

function hideLangOverlay() {
  const overlay = document.getElementById('lang-overlay');
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.4s ease';
  setTimeout(() => overlay.style.display = 'none', 400);

  const site = document.getElementById('site');
  site.classList.remove('site-hidden');
  site.classList.add('site-visible');
}

function applyLanguage(lang, animate) {
  currentLang = lang;
  const isAr = lang === 'ar';

  // Set html attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  document.body.dir = isAr ? 'rtl' : 'ltr';

  // Update lang toggle — show the OTHER language so it reads as "switch to X"
  document.getElementById('lang-label').textContent = isAr ? 'FR' : 'ع';

  // Translate all data-fr / data-ar elements
  document.querySelectorAll('[data-fr]').forEach(el => {
    const key = isAr ? 'ar' : 'fr';
    if (el.hasAttribute(`data-${key}`)) {
      el.textContent = el.getAttribute(`data-${key}`);
    }
  });

  // Translate placeholder text for form inputs
  const t = TRANSLATIONS[lang];
  const nameInput = document.getElementById('reminder-name');
  const phoneInput = document.getElementById('reminder-phone');
  if (nameInput) nameInput.placeholder = t.reminderNamePlaceholder;
  if (phoneInput) phoneInput.placeholder = t.reminderPhonePlaceholder;

  // Update open/closed status
  updateOpenStatus();

  // Update garde status
  updateGardeStatus();

  // Update seasonal banner
  updateSeasonalBanner();

  // Update page title
  document.title = isAr ? 'فارماسي بدر الخير | مكناس' : 'Pharmacie Badr El Kheir | Meknès';
}

/* ── OPEN/CLOSED STATUS ──────────────────────────────────── */
function isOpenNow() {
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours();
  const m = now.getMinutes();
  const totalMins = h * 60 + m;
  const schedule = HOURS[day];
  if (!schedule) return false;

  const [o1h, o1m, c1h, c1m, o2h, o2m, c2h, c2m] = schedule;
  const open1 = o1h * 60 + o1m;
  const close1 = c1h * 60 + c1m;
  if (totalMins >= open1 && totalMins < close1) return true;
  if (o2h !== null) {
    const open2 = o2h * 60 + o2m;
    const close2 = c2h * 60 + c2m;
    if (totalMins >= open2 && totalMins < close2) return true;
  }
  return false;
}

function updateOpenStatus() {
  const badge = document.getElementById('status-badge');
  if (!badge) return;
  const t = TRANSLATIONS[currentLang];
  const open = isOpenNow();
  badge.className = 'status-badge ' + (open ? 'open' : 'closed');
  badge.textContent = open ? t.openNow : t.closedNow;
}

/* ── GARDE STATUS ────────────────────────────────────────── */
// ↓↓ EDIT THIS to reflect whether you are on garde tonight ↓↓
const IS_ON_GARDE = false; // Set to true on nights you are the on-call pharmacy

function updateGardeStatus() {
  const badge = document.getElementById('garde-status-badge');
  const text  = document.getElementById('garde-status-text');
  if (!badge || !text) return;
  const isAr = currentLang === 'ar';
  if (IS_ON_GARDE) {
    badge.className = 'garde-status-badge garde-open';
    badge.textContent = isAr ? 'مناوبة الليلة' : 'De garde ce soir';
    text.textContent  = isAr
      ? 'نحن الصيدلية المناوبة الليلة. نحن في خدمتكم.'
      : 'Nous sommes la pharmacie de garde ce soir. Nous sommes à votre service.';
  } else {
    badge.className = 'garde-status-badge garde-closed';
    badge.textContent = isAr ? 'غير مناوبة الليلة' : 'Pas de garde ce soir';
    text.textContent  = isAr
      ? 'لسنا في المناوبة الليلة. اتصلوا بالرقم 141 للحصول على الصيدلية المناوبة.'
      : 'Nous ne sommes pas de garde ce soir. Appelez le 141 pour la pharmacie de garde.';
  }
}


function getSeason() {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 8) return 'summer';
  if (month >= 9 && month <= 10) return 'autumn';
  return 'winter';
}

function updateSeasonalBanner() {
  const banner = document.getElementById('seasonal-banner');
  if (!banner) return;
  const season = getSeason();
  const t = TRANSLATIONS[currentLang];
  const messages = {
    summer: t.seasonSummer,
    winter: t.seasonWinter,
    spring: t.seasonSpring,
    autumn: t.seasonAutumn,
  };
  banner.textContent = messages[season] || '';

  // Update banner background based on season
  const colors = {
    summer: 'linear-gradient(90deg, #e67e22, #f39c12)',
    winter: 'linear-gradient(90deg, #2980b9, #1a5fa8)',
    spring: 'linear-gradient(90deg, #27ae60, #2ecc71)',
    autumn: 'linear-gradient(90deg, #c0392b, #e67e22)',
  };
  banner.style.background = colors[season] || colors.winter;
}

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72');
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
  // Close mobile menu
  document.getElementById('main-nav')?.classList.remove('open');
  document.getElementById('menu-toggle')?.setAttribute('aria-expanded', 'false');
}

/* ── MOBILE MENU ─────────────────────────────────────────── */
function toggleMenu() {
  const nav = document.getElementById('main-nav');
  const btn = document.getElementById('menu-toggle');
  const isOpen = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(isOpen));
}

/* ── FONT SIZE CYCLE ─────────────────────────────────────── */
const fontSizes = ['', 'fs-large', 'fs-xl'];
let fontSizeIdx = 0;

function cycleFontSize() {
  document.body.classList.remove(fontSizes[fontSizeIdx]);
  fontSizeIdx = (fontSizeIdx + 1) % fontSizes.length;
  if (fontSizes[fontSizeIdx]) document.body.classList.add(fontSizes[fontSizeIdx]);
  localStorage.setItem('pbe-fontsize', fontSizeIdx);
}

// Restore saved font size
(function() {
  const saved = parseInt(localStorage.getItem('pbe-fontsize') || '0');
  if (saved > 0 && saved < fontSizes.length) {
    fontSizeIdx = saved;
    document.body.classList.add(fontSizes[fontSizeIdx]);
  }
})();

/* ── SCROLL SPY ──────────────────────────────────────────── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
  const headerH = 80;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: `-${headerH}px 0px -60% 0px`, threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

/* ── SCROLL ANIMATIONS ───────────────────────────────────── */
function initScrollAnimations() {
  const targets = document.querySelectorAll('.service-card, .para-card, .blog-card, .value-item, .contact-item');
  targets.forEach(el => el.classList.add('animate-in'));

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    targets.forEach(el => obs.observe(el));
  } else {
    targets.forEach(el => el.classList.add('visible'));
  }
}

/* ── HEADER SHADOW ON SCROLL ─────────────────────────────── */
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) header.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(10,37,64,0.14)' : '';
}, { passive: true });

/* ── REMINDER FORM ───────────────────────────────────────── */
function submitReminder() {
  const name = document.getElementById('reminder-name')?.value.trim();
  const phone = document.getElementById('reminder-phone')?.value.trim();
  if (!name || !phone) {
    const t = TRANSLATIONS[currentLang];
    alert(currentLang === 'ar' ? 'الرجاء ملء جميع الحقول' : 'Veuillez remplir tous les champs.');
    return;
  }
  document.getElementById('reminder-form').style.display = 'none';
  document.getElementById('reminder-success').style.display = 'flex';
  // In a real implementation, this would send data to a backend
  console.log('Reminder signup:', { name, phone });
}

/* ── MODALS ──────────────────────────────────────────────── */
function showPrivacy() {
  document.getElementById('privacy-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function showMentions() {
  document.getElementById('mentions-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  document.body.style.overflow = '';
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ['privacy-modal', 'mentions-modal'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.style.display === 'flex') closeModal(id);
    });
    // Also close mobile menu
    document.getElementById('main-nav')?.classList.remove('open');
  }
});

/* ── STATUS & BANNER UPDATE TIMER ────────────────────────── */
// Re-check every minute in case status changes while page is open
setInterval(() => {
  updateOpenStatus();
  updateGardeStatus();
}, 60000);

/* ── CLOSE MENU ON OUTSIDE CLICK ─────────────────────────── */
document.addEventListener('click', (e) => {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('menu-toggle');
  if (nav?.classList.contains('open') && !nav.contains(e.target) && !toggle?.contains(e.target)) {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
});
