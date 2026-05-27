/* ============================================================
   MAYK BARBEARIA — main.js
============================================================ */

(function () {
  'use strict';

  const header    = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  // ----------------------------------------------------------
  // Sticky header: add .scrolled class after 60px
  // ----------------------------------------------------------
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  // ----------------------------------------------------------
  // Hamburger / mobile nav toggle
  // ----------------------------------------------------------
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('mobile-open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when a link is clicked
    nav.querySelectorAll('.header__nav-link').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    // Close nav on resize to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) {
        closeMobileNav();
      }
    });
  }

  function closeMobileNav() {
    if (!nav) return;
    nav.classList.remove('mobile-open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }


  // ----------------------------------------------------------
  // Smooth scroll for anchor links
  // ----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var hash = anchor.getAttribute('href');
      if (hash === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      var target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  // ----------------------------------------------------------
  // Google Ads — conversão WhatsApp
  // Substitua CONVERSION_LABEL pelo rótulo gerado no Google Ads
  // (Ferramentas > Conversões > selecione a conversão > "tag de evento")
  // ----------------------------------------------------------
  function gtag_report_conversion() {
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', {
        'send_to': 'AW-17988378844/CONVERSION_LABEL'
      });
    }
    return true;
  }

  document.querySelectorAll('a[href*="api.whatsapp.com"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      gtag_report_conversion();
    });
  });


  // ----------------------------------------------------------
  // Intersection Observer: fade-in on scroll
  // ----------------------------------------------------------
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );

    // Stagger cards within the same grid parent
    fadeEls.forEach(function (el) {
      var parent = el.parentElement;
      if (parent) {
        var siblings = Array.from(parent.querySelectorAll(':scope > .fade-in'));
        var idx = siblings.indexOf(el);
        if (idx > 0) {
          el.style.transitionDelay = (idx * 90) + 'ms';
        }
      }
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately for old browsers
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

}());
