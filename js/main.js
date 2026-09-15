(function () {
  'use strict';

  /* ── Boot ─────────────────────────────────────── */
  function boot() {
    var router = window.MD && window.MD.router;
    var pages = window.MD && window.MD.pages;

    if (router && pages && !router._routesConfigured) {
      router.mountTo(document.getElementById('app'));
      router.on('/', pages.home);
      router.on('/college', pages.college);
      // NOTE: router hands handlers (params, query) — params is an object,
      // e.g. {gradeId:'2bac'}. pages.js expects plain string arguments, so
      // these routes need small adapters to unpack the named params.
      router.on('/college/:gradeId', function (p) { return pages.collegeGrade(p.gradeId); });
      router.on('/college/:gradeId/:subjectId', function (p, q) {
        return pages.subjectPage('college', p.gradeId, null, p.subjectId, q);
      });
      router.on('/lycee', pages.lycee);
      router.on('/lycee/:gradeId', function (p) { return pages.lyceeGrade(p.gradeId); });
      router.on('/lycee/:gradeId/:streamId', function (p) { return pages.lyceeStream(p.gradeId, p.streamId); });
      router.on('/lycee/:gradeId/:streamId/:subjectId', function (p, q) {
        return pages.subjectPage('lycee', p.gradeId, p.streamId, p.subjectId, q);
      });
      // '/exams' and '/search' have no :params, so the router's first arg
      // is an empty object — the real query string is the *second* arg.
      router.on('/exams', function (p, q) { return pages.exams(q); });
      router.on('/search', function (p, q) { return pages.search(q); });
      router.notFound(pages.notFound);
      router._routesConfigured = true;
    }

    window.MD.i18n.loadAll()
      .then(function () {
        if (router) router.resolve();
      })
      .catch(function (err) {
        console.error('[i18n] load failed:', err);
        console.error('→ Are you opening this over file:// ?  Run a local server instead.');
        if (router) router.resolve();
      });
  }

  /* ── UI interactions ──────────────────────────────
     Nothing previously wired these up: language menu,
     theme toggle, mobile burger menu, search forms. */

  function closeLangMenus(except) {
    document.querySelectorAll('[data-role="lang"] .lang__menu').forEach(function (menu) {
      if (menu === except) return;
      menu.hidden = true;
      var btn = menu.previousElementSibling;
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function setMobileMenuOpen(open) {
    var menu = document.querySelector('[data-role="mobile-menu"]');
    var burger = document.querySelector('[data-action="toggle-menu"]');
    if (!menu) return;
    menu.hidden = !open;
    if (burger) burger.setAttribute('aria-expanded', String(open));
  }

  function goToSearch(q) {
    window.MD.router.navigate('/search?q=' + encodeURIComponent(q));
  }

  document.addEventListener('click', function (e) {
    var actionEl = e.target.closest && e.target.closest('[data-action]');
    if (!actionEl) {
      if (!(e.target.closest && e.target.closest('[data-role="lang"]'))) closeLangMenus();
      return;
    }

    switch (actionEl.getAttribute('data-action')) {
      case 'toggle-lang': {
        var wrap = actionEl.closest('[data-role="lang"]');
        var menu = wrap && wrap.querySelector('.lang__menu');
        if (!menu) return;
        var willOpen = menu.hidden;
        closeLangMenus(willOpen ? menu : null);
        menu.hidden = !willOpen;
        actionEl.setAttribute('aria-expanded', String(willOpen));
        break;
      }
      case 'set-lang':
        window.MD.state.setLang(actionEl.getAttribute('data-lang'));
        closeLangMenus();
        window.MD.router.resolve(); // re-render current page in the new language
        break;
      case 'toggle-theme':
        window.MD.state.toggleTheme();
        break;
      case 'toggle-menu':
        setMobileMenuOpen(document.querySelector('[data-role="mobile-menu"]').hidden);
        break;
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target.closest && e.target.closest('[data-role="navbar-search"]');
    if (!form) return;
    e.preventDefault();
    var input = form.querySelector('input[name="q"]');
    var q = input ? input.value.trim() : '';
    if (q) goToSearch(q);
  });

  document.addEventListener('route:mounted', function () {
    setMobileMenuOpen(false);
    closeLangMenus();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();