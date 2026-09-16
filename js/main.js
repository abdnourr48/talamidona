(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     META TAGS (dynamic per route)
     ═══════════════════════════════════════════════ */
  function setMeta(title, description) {
    var t = window.MD.i18n.t;
    var fullTitle = title ? (title + ' — ' + t('brand.name')) : (t('brand.name') + ' — ' + t('brand.tagline'));
    document.title = fullTitle;
    var desc = description || t('hero.subtitle');
    var els = {
      'meta-description': desc,
      'og-title': title || t('brand.name'),
      'og-description': desc,
      'og-url': location.href,
      'tw-title': title || t('brand.name'),
      'tw-description': desc
    };
    Object.keys(els).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute('content', els[id]);
    });
  }

  function metaForRoute() {
    var t = window.MD.i18n.t;
    var data = window.MD.data;
    var hash = location.hash.replace(/^#/, '') || '/';
    var path = hash.split('?')[0];
    var seg = path.split('/').filter(Boolean);

    if (!seg.length) return setMeta(null, null);
    if (seg[0] === 'college' && seg.length === 1) return setMeta(t('college.title'), t('college.subtitle'));
    if (seg[0] === 'lycee' && seg.length === 1) return setMeta(t('lycee.title'), t('lycee.subtitle'));
    if (seg[0] === 'exams') return setMeta(t('exams.title'), t('exams.subtitle'));
    if (seg[0] === 'search') return setMeta(t('search.title'), t('search.placeholder'));
    if (seg[0] === 'saved') return setMeta(t('saved.title'), t('saved.subtitle'));
    if (seg[0] === 'dev') return setMeta('لوحة المطور', 'أدوات إدارة المحتوى');

    if (seg[0] === 'college' && seg[1]) {
      var g = data.grades[seg[1]];
      if (g) return setMeta(data.gradeName(seg[1], window.MD.state.getLang()), t('grade.chooseSubject'));
      if (seg[2]) return setMeta(data.subjectName(seg[2], window.MD.state.getLang()), t('college.subtitle'));
    }
    if (seg[0] === 'lycee' && seg[1]) {
      if (seg.length === 2) {
        var gg = data.grades[seg[1]];
        if (gg) return setMeta(data.gradeName(seg[1], window.MD.state.getLang()), t('grade.chooseStream'));
      }
      if (seg.length === 3) {
        var s = data.streams[seg[2]];
        if (s) return setMeta(data.streamName(seg[2], window.MD.state.getLang()), data.gradeName(seg[1], window.MD.state.getLang()));
      }
      if (seg.length === 4) {
        return setMeta(data.subjectName(seg[3], window.MD.state.getLang()),
          data.streamName(seg[2], window.MD.state.getLang()) + ' — ' + data.gradeName(seg[1], window.MD.state.getLang()));
      }
    }
    setMeta(null, null);
  }

  /* ═══════════════════════════════════════════════
     AUTOCOMPLETE
     ═══════════════════════════════════════════════ */
  function attachAutocomplete(form) {
    var input = form.querySelector('input[name="q"]');
    if (!input || input.dataset.ac === '1') return;
    input.dataset.ac = '1';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');

    var wrap = input.parentElement;
    if (getComputedStyle(wrap).position === 'static') {
      wrap.style.position = 'relative';
    }

    var dd = document.createElement('div');
    dd.className = 'autocomplete';
    dd.hidden = true;
    dd.setAttribute('role', 'listbox');
    wrap.appendChild(dd);

    var items = [];
    var activeIndex = -1;
    var timer;

    function hrefFor(r) {
      if (r.level === 'college') return '#/college/' + r.grade + '/' + r.subject + '?type=' + r.type;
      return '#/lycee/' + r.grade + '/' + r.stream + '/' + r.subject + '?type=' + r.type;
    }

    function render() {
      if (!items.length) { dd.hidden = true; return; }
      var lang = window.MD.state.getLang();
      dd.innerHTML = items.map(function (r, i) {
        var title = window.MD.search.highlight(r.title, input.value);
        return '<a class="autocomplete__item' + (i === activeIndex ? ' is-active' : '') + '" '
          + 'href="' + hrefFor(r) + '" role="option" data-i="' + i + '">'
          + '<span class="autocomplete__title">' + title + '</span>'
          + '<span class="autocomplete__meta">'
          + window.MD.data.subjectName(r.subject, lang)
          + ' · ' + window.MD.data.gradeName(r.grade, lang)
          + '</span></a>';
      }).join('');
      dd.hidden = false;
    }

    function close() { dd.hidden = true; items = []; activeIndex = -1; }

    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value.trim();
      if (q.length < 2) { close(); return; }
      timer = setTimeout(function () {
        items = window.MD.search.suggest(q, 6);
        activeIndex = -1;
        render();
      }, 120);
    });

    input.addEventListener('keydown', function (e) {
      if (dd.hidden) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        render();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        render();
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        var r = items[activeIndex];
        if (r) {
          var href = hrefFor(r).replace(/^#/, '');
          close();
          input.value = '';
          window.MD.router.navigate(href);
        }
      } else if (e.key === 'Escape') {
        close();
        input.blur();
      }
    });

    dd.addEventListener('click', function (e) {
      var item = e.target.closest('.autocomplete__item');
      if (item) {
        // Navigate happens via anchor href, but we close the dropdown
        close();
        input.value = '';
      }
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) close();
    });

    form.addEventListener('submit', function () {
      close();
    });
  }

  /* ═══════════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════════ */
  function boot() {
    var router = window.MD && window.MD.router;
    var pages = window.MD && window.MD.pages;

    if (router && pages && !router._routesConfigured) {
      router.mountTo(document.getElementById('app'));
      router.on('/', pages.home);
      router.on('/college', pages.college);
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
      router.on('/exams', function (p, q) { return pages.exams(q); });
      router.on('/search', function (p, q) { return pages.search(q); });
      router.on('/saved', function () { return pages.saved(); });
      router.on('/dev', function () { return pages.dev ? pages.dev() : pages.notFound(); });
      router.notFound(pages.notFound);
      router._routesConfigured = true;
    }

    window.MD.i18n.loadAll()
      .then(function () { if (router) router.resolve(); })
      .catch(function (err) {
        console.error('[i18n]', err);
        if (router) router.resolve();
      });
  }

  /* ═══════════════════════════════════════════════
     UI HELPERS
     ═══════════════════════════════════════════════ */
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
  function refreshThemeIcons() {
    var isDark = window.MD.state.getTheme() === 'dark';
    var name = isDark ? 'sun' : 'moon';
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(function (btn) {
      var svg = btn.querySelector('.icon');
      if (svg) svg.innerHTML = window.MD.components.iconBody(name);
    });
  }

  /* ═══════════════════════════════════════════════
     GLOBAL CLICK
     ═══════════════════════════════════════════════ */
  document.addEventListener('click', function (e) {
    // Favorites toggle (works anywhere)
    var favBtn = e.target.closest('[data-action="toggle-fav"]');
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      var id = favBtn.getAttribute('data-id');
      if (id) {
        var added = window.MD.state.toggleFavorite(id);
        // Update button state in-place
        favBtn.classList.toggle('is-on', added);
        favBtn.innerHTML = window.MD.components.starIcon(added, 'icon--sm');
        favBtn.setAttribute('aria-label', added ? window.MD.i18n.t('actions.unfavorite') : window.MD.i18n.t('actions.favorite'));
        // If on saved page, re-render so removed items disappear
        if (location.hash.replace(/^#/, '').split('?')[0] === '/saved') {
          window.MD.router.resolve();
        }
      }
      return;
    }

    // Print saved
    var printBtn = e.target.closest('[data-action="print-saved"]');
    if (printBtn) {
      e.preventDefault();
      window.print();
      return;
    }

    // Reading mode exit
    var readExit = e.target.closest('#reading-exit');
    if (readExit) {
      window.MD.state.setReading(false);
      return;
    }

    // Standard actions
    var actionEl = e.target.closest('[data-action]');
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
        window.MD.router.resolve();
        break;
      case 'toggle-theme':
        window.MD.state.toggleTheme();
        break;
      case 'toggle-menu': {
        var mm = document.querySelector('[data-role="mobile-menu"]');
        if (mm) setMobileMenuOpen(mm.hidden);
        break;
      }
      case 'toggle-reading':
        window.MD.state.toggleReading();
        break;
    }
  });

  /* ═══════════════════════════════════════════════
     FORMS
     ═══════════════════════════════════════════════ */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest && e.target.closest('[data-role="navbar-search"]');
    if (!form) return;
    e.preventDefault();
    var input = form.querySelector('input[name="q"]');
    var q = input ? input.value.trim() : '';
    if (q) goToSearch(q);
  });

  /* ═══════════════════════════════════════════════
     KEYBOARD
     ═══════════════════════════════════════════════ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
      closeLangMenus();
      // Exit reading mode
      if (window.MD.state.isReading()) window.MD.state.setReading(false);
    }
    // '/' focuses the search field
    if (e.key === '/' && !/input|textarea/i.test((e.target.tagName || ''))) {
      var s = document.querySelector('[data-role="navbar-search"] input');
      if (s) { e.preventDefault(); s.focus(); }
    }
  });

  /* ═══════════════════════════════════════════════
     ROUTE HOOKS — autocomplete + meta
     ═══════════════════════════════════════════════ */
  document.addEventListener('route:mounted', function () {
    setMobileMenuOpen(false);
    closeLangMenus();
    document.querySelectorAll('[data-role="navbar-search"]').forEach(attachAutocomplete);
    metaForRoute();
  });

  window.MD.state.on('theme', refreshThemeIcons);

  // Re-render on language change
  window.MD.state.on('lang', function () { window.MD.router.resolve(); });

  /* ═══════════════════════════════════════════════
     START
     ═══════════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();