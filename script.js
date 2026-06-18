/* ============================================
   GROWTH BAJAR — script.js
   Features:
   - Sticky nav shadow on scroll
   - Hamburger / mobile menu toggle
   - Scroll-triggered card reveal (IntersectionObserver)
   - Animated number counters
   - Active nav link highlight
   - Scroll hint auto-hide
============================================ */

(function () {
  'use strict';

  /* ── 1. NAV SHADOW ON SCROLL ── */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ── 2. HAMBURGER MENU ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── 3. SCROLL-TRIGGERED REVEAL (cards + stats) ── */
  const animateEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // Stagger each element slightly
            setTimeout(function () {
              entry.target.classList.add('visible');
            }, i * 120);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animateEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: just show everything immediately
    animateEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── 4. ANIMATED NUMBER COUNTERS ── */
  const countEls = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '+';
    const duration = 1400; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    countEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    countEls.forEach(function (el) {
      const target = el.getAttribute('data-count');
      const suffix = el.getAttribute('data-suffix') || '+';
      el.textContent = target + suffix;
    });
  }

  /* ── 5. ACTIVE NAV LINK HIGHLIGHT ── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let currentId = '';
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) {
        currentId = section.id;
      }
    });

    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ── 6. SCROLL HINT AUTO-HIDE ── */
  const scrollHint = document.getElementById('scrollHint');
  if (scrollHint) {
    function hideScrollHint() {
      if (window.scrollY > 60) {
        scrollHint.style.opacity = '0';
        scrollHint.style.transition = 'opacity 0.4s ease';
        window.removeEventListener('scroll', hideScrollHint);
      }
    }
    window.addEventListener('scroll', hideScrollHint, { passive: true });
  }

  /* ── 7. SMOOTH SCROLL POLYFILL (for older Safari) ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
