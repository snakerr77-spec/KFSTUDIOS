const body = document.body;
const nav = document.querySelector('.nav');
const menuToggle = document.getElementById('menuToggle');
const navLinks = [...document.querySelectorAll('.nav-link')];
const railLinks = [...document.querySelectorAll('.rail-link')];
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const galleryCards = [...document.querySelectorAll('.gallery-card')];
const footerFilterButtons = [...document.querySelectorAll('[data-footer-filter]')];
const toast = document.getElementById('toast');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCount = document.getElementById('lightboxCount');
const contactModal = document.getElementById('contactModal');
const scrollTop = document.getElementById('scrollTop');
const featureCards = [...document.querySelectorAll('.feature-card')];
const sliderPrev = document.querySelector('.slider-prev');
const sliderNext = document.querySelector('.slider-next');

const galleryItems = galleryCards.map((card) => ({
  title: card.dataset.title,
  count: card.dataset.count,
  image: card.dataset.image,
  alt: card.querySelector('img')?.alt || card.dataset.title,
}));

let currentLightboxIndex = 0;
let featuredIndex = 1;
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function closeMobileMenu() {
  nav?.classList.remove('open');
  menuToggle?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}

menuToggle?.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOpen = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav?.addEventListener('click', (event) => event.stopPropagation());

document.addEventListener('click', (event) => {
  if (!nav?.classList.contains('open')) return;
  const clickedHeader = event.target.closest('.header');
  if (!clickedHeader) closeMobileMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeMobileMenu();
}, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

function applyFilter(filter) {
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });

  galleryCards.forEach((card, index) => {
    const categories = card.dataset.category.split(' ');
    const visible = filter === 'todos' || categories.includes(filter);
    card.classList.toggle('hide', !visible);
    if (visible) {
      card.style.transitionDelay = `${Math.min(index * 35, 170)}ms`;
    }
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => applyFilter(button.dataset.filter));
});

footerFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.footerFilter;
    applyFilter(filter);
    document.getElementById('colecoes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

function openLightbox(index) {
  currentLightboxIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentLightboxIndex];
  lightboxImage.src = item.image;
  lightboxImage.alt = item.alt;
  lightboxTitle.textContent = item.title;
  lightboxCount.textContent = item.count;

  if (typeof lightbox.showModal === 'function') {
    lightbox.showModal();
  } else {
    lightbox.setAttribute('open', '');
  }
  body.classList.add('no-scroll');
}

function closeDialog(dialog) {
  if (dialog.open && typeof dialog.close === 'function') {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
  }
  body.classList.remove('no-scroll');
}

function moveLightbox(step) {
  openLightbox(currentLightboxIndex + step);
}

galleryCards.forEach((card, index) => {
  card.addEventListener('click', () => openLightbox(index));
  card.querySelector('.card-open')?.addEventListener('click', (event) => {
    event.stopPropagation();
    openLightbox(index);
  });
});

featureCards.forEach((card) => {
  card.addEventListener('click', () => {
    const matchIndex = galleryItems.findIndex((item) => item.title === card.dataset.title);
    openLightbox(matchIndex >= 0 ? matchIndex : 0);
  });
});

document.querySelector('.lightbox-close')?.addEventListener('click', () => closeDialog(lightbox));
document.querySelector('.lightbox-prev')?.addEventListener('click', () => moveLightbox(-1));
document.querySelector('.lightbox-next')?.addEventListener('click', () => moveLightbox(1));

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeDialog(lightbox);
});

function renderFeaturedCards(direction = 0) {
  if (!featureCards.length) return;
  featuredIndex = (featuredIndex + direction + featureCards.length) % featureCards.length;

  featureCards.forEach((card, index) => {
    card.classList.remove('is-left', 'is-center', 'is-right', 'is-back');
    const relative = (index - featuredIndex + featureCards.length) % featureCards.length;
    if (relative === 0) card.classList.add('is-center');
    else if (relative === 1) card.classList.add('is-right');
    else if (relative === featureCards.length - 1) card.classList.add('is-left');
    else card.classList.add('is-back');
  });
}

sliderPrev?.addEventListener('click', () => renderFeaturedCards(-1));
sliderNext?.addEventListener('click', () => renderFeaturedCards(1));

setInterval(() => {
  if (!document.hidden && !lightbox?.open && !contactModal?.open) renderFeaturedCards(1);
}, 6500);

document.querySelectorAll('.heart-btn').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const active = button.classList.toggle('active');
    button.textContent = active ? '♥' : '♡';
    showToast(active ? 'Foto adicionada aos favoritos.' : 'Foto removida dos favoritos.');
  });
});

document.querySelectorAll('.contact-open').forEach((button) => {
  button.addEventListener('click', () => {
    if (typeof contactModal.showModal === 'function') contactModal.showModal();
    else contactModal.setAttribute('open', '');
    body.classList.add('no-scroll');
  });
});

document.querySelector('.modal-close')?.addEventListener('click', () => closeDialog(contactModal));
contactModal?.addEventListener('click', (event) => {
  if (event.target === contactModal) closeDialog(contactModal);
});

const whatsappMaskInput = document.querySelector('input[name="whatsapp"]');
const KF_WHATSAPP_NUMBER = '551599812084';

function normalizeSpaces(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function buildWhatsAppMessage({ nome, whatsapp, tipo, mensagem }) {
  const nomeCliente = normalizeSpaces(nome);
  const telefoneCliente = normalizeSpaces(whatsapp);
  const tipoEnsaio = normalizeSpaces(tipo) || 'Não informado';
  const textoCliente = normalizeSpaces(mensagem) || 'Gostaria de receber mais informações sobre valores, datas disponíveis e como funciona o atendimento.';

  return [
    'Olá, KFSTUDIOS! Quero eternizar minha história com vocês.',
    '',
    `Meu nome é ${nomeCliente}.`,
    `Tipo de ensaio: ${tipoEnsaio}.`,
    telefoneCliente ? `Meu WhatsApp: ${telefoneCliente}.` : 'Meu WhatsApp: não informado no formulário.',
    '',
    `Mensagem do cliente: ${textoCliente}`,
    '',
    'Pode me passar os valores, horários disponíveis e o próximo passo para agendar?'
  ].join('\n');
}

function applyWhatsappMask(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

whatsappMaskInput?.addEventListener('input', (event) => {
  event.target.value = applyWhatsappMask(event.target.value);
});

document.getElementById('contactForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const nome = normalizeSpaces(data.get('nome'));

  if (!nome) {
    showToast('Digite seu nome para montar o pedido no WhatsApp.');
    form.querySelector('input[name="nome"]')?.focus();
    return;
  }

  const message = buildWhatsAppMessage({
    nome,
    whatsapp: data.get('whatsapp'),
    tipo: data.get('tipo'),
    mensagem: data.get('mensagem')
  });

  const whatsappUrl = `https://wa.me/${KF_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  closeDialog(contactModal);
  showToast('Pedido aberto no WhatsApp da KFSTUDIOS.');
});

document.getElementById('newsletterForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast('E-mail cadastrado com sucesso.');
});

document.getElementById('presentationBtn')?.addEventListener('click', () => {
  openLightbox(0);
  showToast('Apresentação aberta na galeria.');
});

scrollTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (lightbox?.open) closeDialog(lightbox);
    if (contactModal?.open) closeDialog(contactModal);
  }
  if (lightbox?.open && event.key === 'ArrowRight') moveLightbox(1);
  if (lightbox?.open && event.key === 'ArrowLeft') moveLightbox(-1);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    railLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === id));
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0.01 });

document.querySelectorAll('section[id], footer[id]').forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

window.addEventListener('scroll', () => {
  scrollTop?.classList.toggle('show', window.scrollY > 520);
}, { passive: true });

function setupAuroraCanvas() {
  const canvas = document.querySelector('.aurora-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const count = Math.min(90, Math.floor(window.innerWidth / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (Math.random() * 2.2 + 0.6) * window.devicePixelRatio,
      a: Math.random() * 0.44 + 0.08,
      vx: (Math.random() - 0.5) * 0.22 * window.devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.18 * window.devicePixelRatio,
    }));
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const gradient = context.createRadialGradient(width * 0.15, height * 0.2, 0, width * 0.15, height * 0.2, width * 0.52);
    gradient.addColorStop(0, 'rgba(255, 45, 115, 0.18)');
    gradient.addColorStop(1, 'rgba(255, 45, 115, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      context.beginPath();
      context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 91, 149, ${p.a})`;
      context.shadowColor = 'rgba(255, 61, 128, .65)';
      context.shadowBlur = 14 * window.devicePixelRatio;
      context.fill();
      context.shadowBlur = 0;
    });

    if (!reducedMotion) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

setupAuroraCanvas();
renderFeaturedCards(0);
