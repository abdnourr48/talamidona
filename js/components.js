/* components.js — navbar, footer, breadcrumb, cards, icons */
(function () {
  'use strict';
  var t = window.MD.i18n.t;
  var data = window.MD.data;

  var ICONS = {
    home:     '<path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/>',
    book:     '<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h11"/>',
    calculator:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    atom:     '<circle cx="12" cy="12" r="1"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    leaf:     '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
    globe:    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18"/>',
    chart:    '<path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6"/>',
    cog:      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.14.65.4.83.72"/>',
    search:   '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun:      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
    moon:     '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    menu:     '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close:    '<path d="M18 6 6 18M6 6l12 12"/>',
    arrow:    '<path d="m9 18 6-6-6-6"/>',
    chevron:  '<path d="m6 9 6 6 6-6"/>',
    school:   '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/>',
    cap:      '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/><path d="M22 10v6"/>',
    sparkle:  '<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/>',
    file:     '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    flag:     '<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
    check:    '<path d="M20 6 9 17l-5-5"/>',
    north:    '<path d="M12 2 4 22l8-6 8 6z"/>'
  };

  function icon(name, cls) {
    var body = ICONS[name] || '';
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + body + '</svg>';
  }

  function logoMark(size) {
    var s = size || 32;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 40 40" aria-hidden="true">'
      + '<defs><linearGradient id="mdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--brand)"/><stop offset="1" stop-color="var(--accent)"/></linearGradient></defs>'
      + '<rect x="2" y="2" width="36" height="36" rx="10" fill="url(#mdg)"/>'
      + '<path d="M12 26 L20 14 L28 26 Z" fill="white" opacity=".95"/>'
      + '<circle cx="20" cy="26" r="3" fill="var(--accent)"/>'
      + '<path d="M14 30 h12" stroke="white" stroke-width="2" stroke-linecap="round"/>'
      + '</svg>';
  }

  function navbar(active) {
    var lang = window.MD.state.getLang();
    var theme = window.MD.state.getTheme();
    active = active || '';
    var isDark = theme === 'dark';

    function link(href, key, id) {
      var cls = 'nav-link' + (active === id ? ' is-active' : '');
      return '<a class="' + cls + '" href="' + href + '">' + t(key) + '</a>';
    }

    return ''
      + '<header class="navbar" id="navbar">'
      +   '<div class="container navbar__inner">'
      +     '<a class="brand" href="#/" aria-label="' + t('brand.name') + '">'
      +       '<span class="brand__mark">' + logoMark(36) + '</span>'
      +       '<span class="brand__text">'
      +         '<span class="brand__name">' + t('brand.name') + '</span>'
      +         '<span class="brand__tag">' + t('brand.tagline') + '</span>'
      +       '</span>'
      +     '</a>'
      +     '<nav class="nav" aria-label="Main">'
      +       link('#/', 'nav.home', 'home')
      +       link('#/college', 'nav.college', 'college')
      +       link('#/lycee', 'nav.lycee', 'lycee')
      +       link('#/exams', 'nav.exams', 'exams')
      +     '</nav>'
      +     '<div class="navbar__actions">'
      +       '<form class="navbar__search" data-role="navbar-search" role="search">'
      +         '<span class="navbar__search-icon">' + icon('search', 'icon--sm') + '</span>'
      +         '<input class="navbar__search-input" type="search" name="q" placeholder="' + t('hero.searchPlaceholder') + '" autocomplete="off" />'
      +       '</form>'
      +       '<div class="navbar__tools">'
      +         '<div class="lang" data-role="lang">'
      +           '<button class="btn btn--ghost btn--icon btn--sm" data-action="toggle-lang" aria-haspopup="true" aria-expanded="false" aria-label="' + t('lang.label') + '">'
      +             '<span class="lang__code">' + lang.toUpperCase() + '</span>'
      +           '</button>'
      +           '<div class="lang__menu" role="menu" hidden>'
      +             '<button class="lang__item' + (lang === 'ar' ? ' is-active' : '') + '" data-action="set-lang" data-lang="ar" role="menuitem">العربية</button>'
      +             '<button class="lang__item' + (lang === 'fr' ? ' is-active' : '') + '" data-action="set-lang" data-lang="fr" role="menuitem">Français</button>'
      +             '<button class="lang__item' + (lang === 'en' ? ' is-active' : '') + '" data-action="set-lang" data-lang="en" role="menuitem">English</button>'
      +           '</div>'
      +         '</div>'
      +         '<button class="btn btn--ghost btn--icon btn--sm" data-action="toggle-theme" aria-label="' + t('theme.toggle') + '" title="' + t('theme.toggle') + '">'
      +           (isDark ? icon('sun', 'icon--sm') : icon('moon', 'icon--sm'))
      +         '</button>'
      +         '<button class="btn btn--ghost btn--icon btn--sm navbar__burger" data-action="toggle-menu" aria-label="' + t('nav.openMenu') + '" aria-expanded="false">'
      +           icon('menu', 'icon--sm')
      +         '</button>'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      +   '<div class="mobile-menu" data-role="mobile-menu" hidden>'
      +     '<nav class="mobile-menu__nav">'
      +       '<a href="#/" class="mobile-menu__link">' + t('nav.home') + '</a>'
      +       '<a href="#/college" class="mobile-menu__link">' + t('nav.college') + '</a>'
      +       '<a href="#/lycee" class="mobile-menu__link">' + t('nav.lycee') + '</a>'
      +       '<a href="#/exams" class="mobile-menu__link">' + t('nav.exams') + '</a>'
      +     '</nav>'
      +     '<form class="mobile-menu__search" data-role="navbar-search" role="search">'
      +       '<div class="search">'
      +         '<span class="search__icon">' + icon('search') + '</span>'
      +         '<input class="input" type="search" name="q" placeholder="' + t('hero.searchPlaceholder') + '" autocomplete="off" />'
      +       '</div>'
      +     '</form>'
      +   '</div>'
      + '</header>';
  }

  function footer() {
    var lang = window.MD.state.getLang();
    return ''
      + '<footer class="footer">'
      +   '<div class="container footer__inner">'
      +     '<div class="footer__col footer__col--brand">'
      +       '<a class="brand" href="#/">'
      +         '<span class="brand__mark">' + logoMark(36) + '</span>'
      +         '<span class="brand__text">'
      +           '<span class="brand__name">' + t('brand.name') + '</span>'
      +           '<span class="brand__tag">' + t('brand.tagline') + '</span>'
      +         '</span>'
      +       '</a>'
      +       '<p class="footer__about">' + t('footer.about') + '</p>'
      +     '</div>'
      +     '<div class="footer__col">'
      +       '<h3 class="footer__title">' + t('footer.navigation') + '</h3>'
      +       '<ul class="footer__list">'
      +         '<li><a href="#/">' + t('nav.home') + '</a></li>'
      +         '<li><a href="#/college">' + t('nav.college') + '</a></li>'
      +         '<li><a href="#/lycee">' + t('nav.lycee') + '</a></li>'
      +         '<li><a href="#/exams">' + t('nav.exams') + '</a></li>'
      +       '</ul>'
      +     '</div>'
      +     '<div class="footer__col">'
      +       '<h3 class="footer__title">' + t('footer.levels') + '</h3>'
      +       '<ul class="footer__list">'
      +         '<li><a href="#/college/1ap">' + data.gradeName('1ap', lang) + '</a></li>'
      +         '<li><a href="#/college/2ap">' + data.gradeName('2ap', lang) + '</a></li>'
      +         '<li><a href="#/college/3ap">' + data.gradeName('3ap', lang) + '</a></li>'
      +         '<li><a href="#/lycee/2bac">' + data.gradeName('2bac', lang) + '</a></li>'
      +       '</ul>'
      +     '</div>'
      +     '<div class="footer__col">'
      +       '<h3 class="footer__title">' + t('footer.languages') + '</h3>'
      +       '<div class="footer__langs">'
      +         '<button class="chip' + (lang === 'ar' ? ' chip--on' : '') + '" data-action="set-lang" data-lang="ar">العربية</button>'
      +         '<button class="chip' + (lang === 'fr' ? ' chip--on' : '') + '" data-action="set-lang" data-lang="fr">Français</button>'
      +         '<button class="chip' + (lang === 'en' ? ' chip--on' : '') + '" data-action="set-lang" data-lang="en">English</button>'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      +   '<div class="container footer__bottom">'
      +     '<span>' + t('footer.copyright') + '</span>'
      +     '<span class="footer__made">' + icon('flag', 'icon--sm') + ' ' + t('footer.madeIn') + '</span>'
      +   '</div>'
      + '</footer>';
  }

  function breadcrumb(items) {
    var parts = items.map(function (it, i) {
      var sep = i < items.length - 1 ? '<span class="breadcrumb__sep" aria-hidden="true">' + icon('arrow', 'icon--sm flip-rtl') + '</span>' : '';
      if (it.href) return '<a class="breadcrumb__link" href="' + it.href + '">' + it.label + '</a>' + sep;
      return '<span class="breadcrumb__current">' + it.label + '</span>' + sep;
    }).join('');
    return '<nav class="breadcrumb" aria-label="Breadcrumb"><div class="container breadcrumb__inner">' + parts + '</div></nav>';
  }

  function subjectIcon(id) {
    var s = data.subjects[id];
    var name = s ? s.icon : 'book';
    return icon(name);
  }

  function typeBadge(type) {
    var cls = { lesson: 'badge--brand', exercise: 'badge--accent', exam: 'badge--danger', homework: 'badge--success' }[type] || '';
    return '<span class="badge ' + cls + '">' + t('type.' + type) + '</span>';
  }

  function resourceRow(r) {
    var lang = window.MD.state.getLang();
    var meta = [data.subjectName(r.subject, lang), r.stream ? data.streamName(r.stream, lang) : null, r.year ? r.year : null].filter(Boolean).join(' · ');
    return ''
      + '<article class="resource" tabindex="0">'
      +   '<div class="resource__icon">' + subjectIcon(r.subject) + '</div>'
      +   '<div class="resource__body">'
      +     '<h3 class="resource__title">' + r.title + '</h3>'
      +     '<p class="resource__meta">' + meta + '</p>'
      +   '</div>'
      +   '<div class="resource__right">'
      +     typeBadge(r.type)
      +     (r.examType ? '<span class="badge badge--outline">' + t('examType.' + r.examType) + '</span>' : '')
      +   '</div>'
      + '</article>';
  }

  window.MD.components = {
    icon: icon,
    logoMark: logoMark,
    navbar: navbar,
    footer: footer,
    breadcrumb: breadcrumb,
    subjectIcon: subjectIcon,
    typeBadge: typeBadge,
    resourceRow: resourceRow
  };
})();
