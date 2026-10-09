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
      if (hash.charAt(0) !== '#') return; // link trocado para a loja do app
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

  // ----------------------------------------------------------
  // Carrosséis (avaliações e fotos do espaço)
  // ----------------------------------------------------------
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-track]');
    var prev  = carousel.querySelector('[data-prev]');
    var next  = carousel.querySelector('[data-next]');
    if (!track) return;

    function step() {
      var item = track.firstElementChild;
      if (!item) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return item.getBoundingClientRect().width + gap;
    }

    function atEnd() {
      return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }

    function go(dir) {
      if (dir > 0 && atEnd()) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (dir < 0 && track.scrollLeft <= 4) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: dir * step(), behavior: 'smooth' });
      }
    }

    if (prev) prev.addEventListener('click', function () { go(-1); restart(); });
    if (next) next.addEventListener('click', function () { go(1); restart(); });

    // Autoplay opcional (pausa ao interagir)
    var delay = parseInt(carousel.getAttribute('data-autoplay'), 10);
    var timer = null;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function start() {
      if (!delay || reduceMotion) return;
      stop();
      timer = setInterval(function () { go(1); }, delay);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function restart() {
      if (timer) start();
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    track.addEventListener('touchstart', stop, { passive: true });
    start();
  });


  // ----------------------------------------------------------
  // Botão flutuante do WhatsApp: aparece após o hero
  // ----------------------------------------------------------
  var wppFloat = document.querySelector('.wpp-float');
  var hero = document.getElementById('hero');

  if (wppFloat && hero) {
    window.addEventListener('scroll', function () {
      wppFloat.classList.toggle('show', window.scrollY > hero.offsetHeight * 0.6);
    }, { passive: true });
  }


  // ----------------------------------------------------------
  // Botões "Agendar pelo aplicativo": loja certa no celular,
  // seção #agende (com as duas lojas) no computador
  // ----------------------------------------------------------
  var APP_IOS     = 'https://apps.apple.com/br/app/mayk-barbearia/id1601548260';
  var APP_ANDROID = 'https://play.google.com/store/apps/details?id=com.mmtools.mayk';
  var ua = navigator.userAgent || '';
  var storeUrl = /android/i.test(ua) ? APP_ANDROID
               : (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) ? APP_IOS
               : null;

  if (storeUrl) {
    document.querySelectorAll('a[data-app]').forEach(function (link) {
      link.href = storeUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }


  // ----------------------------------------------------------
  // Abas das unidades (Sudoeste / Unique)
  // ----------------------------------------------------------
  var tabs = document.querySelectorAll('.unidades__tab');

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });


}());
