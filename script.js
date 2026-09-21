const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');
const year = document.querySelector('#year');
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox img');
const lightboxClose = document.querySelector('.lightbox-close');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.classList.toggle('active', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

year.textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.gallery-card').forEach(card => {
  const path = card.dataset.image;
  const placeholder = card.querySelector('.gallery-placeholder');
  const probe = new Image();

  probe.onload = () => {
    card.classList.add('has-image');
    placeholder.style.backgroundImage = `linear-gradient(rgba(0,0,0,.05), rgba(0,0,0,.16)), url('${path}')`;
  };

  probe.src = path;

  card.addEventListener('click', () => {
    if (!card.classList.contains('has-image')) return;
    lightboxImg.src = path;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
    if (lightbox.classList.contains('open')) closeLightbox();
  }
});


// FORMSPREE HEXE
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('#form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = 'Wird gesendet...';

    formStatus.textContent = '';
    formStatus.classList.remove('success', 'error');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.textContent = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.';
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        formStatus.textContent = 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.';
        formStatus.classList.add('error');
      }
    } catch (error) {
      formStatus.textContent = 'Keine Verbindung. Bitte versuchen Sie es später erneut.';
      formStatus.classList.add('error');
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
}
