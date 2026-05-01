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

    // Close menu when any nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
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
    if (window.scrollY > 80) {
      siteNav.classList.add('nav--scrolled');
    } else {
      siteNav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState(); // run once on load

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
          throw new Error('Form submission failed');
        }
      } catch {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
        // Surface a non-intrusive error note beneath the button
        let errNote = contactForm.querySelector('.form-error');
        if (!errNote) {
          errNote = document.createElement('p');
          errNote.className = 'form-error';
          errNote.style.cssText = 'color:#A86D56;font-size:0.9rem;margin-top:0.75rem;text-align:center;';
          contactForm.appendChild(errNote);
        }
        errNote.textContent = 'Something went wrong. Please try emailing directly at hello@dianewrites.org.';
      }
    });
  }

})();
