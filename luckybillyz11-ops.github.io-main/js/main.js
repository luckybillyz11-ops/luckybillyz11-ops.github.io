/* ============================================================
   Resume Portfolio — JS
   Theme toggle, language toggle, scroll reveal, nav highlight
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM refs ---------- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const langToggle = document.getElementById('lang-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const revealEls = document.querySelectorAll('.reveal');
  const revealStaggers = document.querySelectorAll('.reveal-stagger');
  const sections = document.querySelectorAll('section[id]');

  /* ---------- State ---------- */
  let currentLang = 'zh';
  let currentTheme = 'dark';

  /* ---------- Init from localStorage ---------- */
  function init() {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      currentTheme = savedTheme;
    } else {
      // Respect OS preference
      currentTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    applyTheme();

    // Language
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'en' || savedLang === 'zh') {
      currentLang = savedLang;
    }
    applyLang();

    // Reveal elements that are already in view on load
    requestAnimationFrame(() => {
      checkReveals();
      highlightNav();
    });

    bindEvents();
  }

  /* ---------- Theme ---------- */
  function applyTheme() {
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }

  function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme();
  }

  /* ---------- Language ---------- */
  function applyLang() {
    html.setAttribute('data-lang', currentLang);
    localStorage.setItem('lang', currentLang);
    langToggle.textContent = currentLang === 'zh' ? 'EN' : '中';
  }

  function toggleLang() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    applyLang();
  }

  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function checkReveals() {
    revealEls.forEach(function (el) { revealObserver.observe(el); });
    revealStaggers.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Nav highlight on scroll ---------- */
  function highlightNav() {
    let currentId = '';
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  /* ---------- Nav shadow on scroll ---------- */
  function navShadow() {
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  /* ---------- Bind events ---------- */
  function bindEvents() {
    themeToggle.addEventListener('click', toggleTheme);
    langToggle.addEventListener('click', toggleLang);

    window.addEventListener('scroll', function () {
      navShadow();
      highlightNav();
    }, { passive: true });

    // Re-check reveals on resize (for responsive layout shifts)
    window.addEventListener('resize', checkReveals, { passive: true });

    // Keyboard shortcut: Ctrl+T for theme
    window.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  /* ---------- Boot ---------- */
  init();
})();
