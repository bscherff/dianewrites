(function () {
  'use strict';

  // ── Footer year ─────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Hamburger menu toggle ────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Nav scroll state (transparent → solid) ──────────────────
  const siteNav = document.getElementById('site-nav');

  function updateNavState() {
    if (!siteNav) return;
    siteNav.classList.toggle('nav--scrolled', window.scrollY > 80);
  }

  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState();

  // ── Active nav link via IntersectionObserver ─────────────────
  const sections     = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navLinksList.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinksList.forEach(link => {
            link.classList.toggle(
              'nav-link--active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(section => observer.observe(section));
  }

  // ── Gallery slideshow ────────────────────────────────────────
  (function initSlideshow() {
    const slides    = document.querySelectorAll('.slide');
    const dots      = document.querySelectorAll('.slide-dot');
    const prevBtn   = document.querySelector('.slide-btn--prev');
    const nextBtn   = document.querySelector('.slide-btn--next');
    const slideshow = document.getElementById('gallery-slideshow');

    if (!slides.length) return;

    let current = 0;

    function goTo(n) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');

      current = (n + slides.length) % slides.length;

      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-selected', 'true');
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Keyboard navigation (arrow keys when focused on or near slideshow)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch swipe support
    if (slideshow) {
      let touchStartX = 0;

      slideshow.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slideshow.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
      }, { passive: true });
    }
  })();

  // ── Contact form async submit (Formspree) ────────────────────
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.innerHTML =
            '<p class="form-success">Thank you — your message has been received.<br>Diane will be in touch soon.</p>';
        } else {
          throw new Error('submission failed');
        }
      } catch {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
        let errNote = contactForm.querySelector('.form-error');
        if (!errNote) {
          errNote = document.createElement('p');
          errNote.className = 'form-error';
          errNote.style.cssText = 'color:#A86D56;font-size:0.9rem;margin-top:0.75rem;text-align:center;';
          contactForm.appendChild(errNote);
        }
        errNote.textContent = 'Something went wrong. Please email directly at hello@dianewrites.org.';
      }
    });
  }

})();
