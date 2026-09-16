/* pages.js — every page renderer */
(function () {
  'use strict';
  var t = window.MD.i18n.t;
  var data = window.MD.data;
  var C = window.MD.components;
  var lang = function () { return window.MD.state.getLang(); };

  function main(activeNav, inner) {
    return C.navbar(activeNav) + '<main id="view">' + inner + '</main>' + C.footer();
  }

  /* ── HOME ─────────────────────────────────────────── */
  function home() {
    return C.navbar('home') + ''
      + '<main id="view">'
      + '<section class="hero">'
      +   '<div class="hero__bg" aria-hidden="true"></div>'
      +   '<div class="hero__pattern" aria-hidden="true"></div>'
      +   '<div class="container hero__inner">'
      +     '<span class="hero__eyebrow">' + C.icon('sparkle', 'icon--sm') + ' ' + t('hero.trust') + '</span>'
      +     '<h1 class="hero__title">' + t('hero.title') + '</h1>'
      +     '<p class="hero__subtitle">' + t('hero.subtitle') + '</p>'
      +     '<form class="hero__search" data-role="navbar-search" role="search" autocomplete="off">'
      +       '<div class="search search--lg">'
      +         '<span class="search__icon">' + C.icon('search') + '</span>'
      +         '<input class="input" type="search" name="q" placeholder="' + t('hero.searchPlaceholder') + '" autocomplete="off" />'
      +         '<button class="btn btn--accent hero__search-btn" type="submit">' + t('search.submit') + '</button>'
      +       '</div>'
      +     '</form>'
      +     '<div class="hero__chips">'
      +       '<span class="hero__chips-label">' + t('search.tryThese') + '</span>'
      +       exampleChip('رياضيات الثالثة إعدادي')
      +       exampleChip('الاشتقاق')
      +       exampleChip('امتحان وطني 2024')
      +     '</div>'
      +   '</div>'
      + '</section>'
      + '<section class="section" id="levels">'
      +   '<div class="container">'
      +     '<header class="section__head">'
      +       '<h2 class="section__title">' + t('levels.title') + '</h2>'
      +       '<p class="section__sub">' + t('levels.subtitle') + '</p>'
      +     '</header>'
      +     '<div class="level-grid">'
      +       levelCard({ href: '#/college', kicker: 'college', title: t('level.college.title'), desc: t('level.college.desc'), grades: t('level.college.grades'), cta: t('level.college.cta'), icon: 'school' })
      +       levelCard({ href: '#/lycee', kicker: 'lycee', title: t('level.lycee.title'), desc: t('level.lycee.desc'), grades: t('level.lycee.grades'), cta: t('level.lycee.cta'), icon: 'cap' })
      +     '</div>'
      +   '</div>'
      + '</section>'
      + '<section class="section features">'
      +   '<div class="container">'
      +     '<header class="section__head">'
      +       '<h2 class="section__title">' + t('features.title') + '</h2>'
      +       '<p class="section__sub">' + t('features.subtitle') + '</p>'
      +     '</header>'
      +     '<div class="feature-grid">'
      +       feature('book',   t('feature.lessons.title'),      t('feature.lessons.desc'))
      +       feature('file',   t('feature.exercises.title'),    t('feature.exercises.desc'))
      +       feature('flag',   t('feature.exams.title'),        t('feature.exams.desc'))
      +       feature('sparkle',t('feature.explanations.title'), t('feature.explanations.desc'))
      +     '</div>'
      +   '</div>'
      + '</section>'
      + '</main>' + C.footer();
  }

  function levelCard(o) {
    return ''
      + '<a class="level-card" href="' + o.href + '">'
      +   '<div class="level-card__top">'
      +     '<span class="level-card__icon">' + C.icon(o.icon, 'icon--xl') + '</span>'
      +     '<span class="level-card__kicker">' + t('nav.' + o.kicker) + '</span>'
      +   '</div>'
      +   '<h3 class="level-card__title">' + o.title + '</h3>'
      +   '<p class="level-card__desc">' + o.desc + '</p>'
      +   '<p class="level-card__grades">' + o.grades + '</p>'
      +   '<span class="level-card__cta">' + o.cta + ' ' + C.icon('arrow', 'icon--sm flip-rtl') + '</span>'
      + '</a>';
  }

  function feature(iconName, title, desc) {
    return '<div class="feature"><div class="feature__icon">' + C.icon(iconName) + '</div>'
      + '<h3 class="feature__title">' + title + '</h3>'
      + '<p class="feature__desc">' + desc + '</p></div>';
  }

  /* ── COLLEGE ──────────────────────────────────────── */
  function college() {
    return main('college', ''
      + C.breadcrumb([{ label: t('breadcrumb.home'), href: '#/' }, { label: t('nav.college') }])
      + '<section class="page"><div class="container">'
      +   '<header class="page__head"><h1 class="page__title">' + t('college.title') + '</h1>'
      +     '<p class="page__sub">' + t('college.subtitle') + '</p></header>'
      +   '<div class="grid grid--grades">'
      +     ['1ap','2ap','3ap'].map(gradeCardCollege).join('')
      +   '</div>'
      + '</div></section>');
  }

  function gradeCardCollege(id) {
    var g = data.grades[id];
    return '<a class="grade-card" href="#/college/' + id + '">'
      + '<span class="grade-card__num">' + gradeNumber(id) + '</span>'
      + '<h3 class="grade-card__title">' + data.gradeName(id, lang()) + '</h3>'
      + '<p class="grade-card__meta">' + g.subjects.length + ' ' + t('grade.chooseSubject') + '</p>'
      + '<span class="grade-card__cta">' + t('actions.explore') + ' ' + C.icon('arrow', 'icon--sm flip-rtl') + '</span></a>';
  }

  function gradeNumber(id) {
    var map = { '1ap': '01', '2ap': '02', '3ap': '03', 'tc': 'TC', '1bac': '1B', '2bac': '2B' };
    return map[id] || '·';
  }

  /* ── LYCEE ────────────────────────────────────────── */
  function lycee() {
    return main('lycee', ''
      + C.breadcrumb([{ label: t('breadcrumb.home'), href: '#/' }, { label: t('nav.lycee') }])
      + '<section class="page"><div class="container">'
      +   '<header class="page__head"><h1 class="page__title">' + t('lycee.title') + '</h1>'
      +     '<p class="page__sub">' + t('lycee.subtitle') + '</p></header>'
      +   '<div class="grid grid--grades">'
      +     ['tc','1bac','2bac'].map(function (id) {
              var g = data.grades[id];
              return '<a class="grade-card" href="#/lycee/' + id + '">'
                + '<span class="grade-card__num">' + gradeNumber(id) + '</span>'
                + '<h3 class="grade-card__title">' + data.gradeName(id, lang()) + '</h3>'
                + '<p class="grade-card__meta">' + g.streams.length + ' ' + t('grade.chooseStream') + '</p>'
                + '<span class="grade-card__cta">' + t('actions.explore') + ' ' + C.icon('arrow', 'icon--sm flip-rtl') + '</span></a>';
            }).join('')
      +   '</div>'
      + '</div></section>');
  }

  function collegeGrade(gradeId) {
    var g = data.grades[gradeId];
    if (!g || g.level !== 'college') return notFound();
    return main('college', ''
      + C.breadcrumb([
        { label: t('breadcrumb.home'), href: '#/' },
        { label: t('nav.college'), href: '#/college' },
        { label: data.gradeName(gradeId, lang()) }
      ])
      + '<section class="page"><div class="container">'
      +   '<header class="page__head"><h1 class="page__title">' + data.gradeName(gradeId, lang()) + '</h1>'
      +     '<p class="page__sub">' + t('grade.chooseSubject') + '</p></header>'
      +   '<div class="grid grid--subjects">'
      +     g.subjects.map(function (sid) { return subjectCard('college', gradeId, null, sid); }).join('')
      +   '</div>'
      + '</div></section>');
  }

  function subjectCard(level, gradeId, streamId, subjectId) {
    if (!data.subjects[subjectId]) return '';
    var href = '#/' + level + '/' + gradeId + (streamId ? '/' + streamId : '') + '/' + subjectId;
    return '<a class="subject-card" href="' + href + '">'
      + '<span class="subject-card__icon">' + C.subjectIcon(subjectId) + '</span>'
      + '<span class="subject-card__name">' + data.subjectName(subjectId, lang()) + '</span></a>';
  }

  function lyceeGrade(gradeId) {
    var g = data.grades[gradeId];
    if (!g || g.level !== 'lycee') return notFound();
    return main('lycee', ''
      + C.breadcrumb([
        { label: t('breadcrumb.home'), href: '#/' },
        { label: t('nav.lycee'), href: '#/lycee' },
        { label: data.gradeName(gradeId, lang()) }
      ])
      + '<section class="page"><div class="container">'
      +   '<header class="page__head"><h1 class="page__title">' + data.gradeName(gradeId, lang()) + '</h1>'
      +     '<p class="page__sub">' + t('grade.chooseStream') + '</p></header>'
      +   '<div class="grid grid--streams">'
      +     g.streams.map(function (sid) { return streamCard(gradeId, sid); }).join('')
      +   '</div>'
      + '</div></section>');
  }

  function streamCard(gradeId, streamId) {
    var s = data.streams[streamId];
    return '<a class="stream-card" href="#/lycee/' + gradeId + '/' + streamId + '">'
      + '<h3 class="stream-card__title">' + data.streamName(streamId, lang()) + '</h3>'
      + '<p class="stream-card__meta">' + s.subjects.length + ' ' + t('grade.chooseSubject') + '</p>'
      + '<span class="stream-card__cta">' + t('actions.explore') + ' ' + C.icon('arrow', 'icon--sm flip-rtl') + '</span></a>';
  }

  function lyceeStream(gradeId, streamId) {
    var s = data.streams[streamId];
    var g = data.grades[gradeId];
    if (!s || !g || g.level !== 'lycee') return notFound();
    return main('lycee', ''
      + C.breadcrumb([
        { label: t('breadcrumb.home'), href: '#/' },
        { label: t('nav.lycee'), href: '#/lycee' },
        { label: data.gradeName(gradeId, lang()), href: '#/lycee/' + gradeId },
        { label: data.streamName(streamId, lang()) }
      ])
      + '<section class="page"><div class="container">'
      +   '<header class="page__head"><h1 class="page__title">' + data.streamName(streamId, lang()) + '</h1>'
      +     '<p class="page__sub">' + data.gradeName(gradeId, lang()) + ' — ' + t('grade.chooseSubject') + '</p></header>'
      +   '<div class="grid grid--subjects">'
      +     s.subjects.map(function (sid) { return subjectCard('lycee', gradeId, streamId, sid); }).join('')
      +   '</div>'
      + '</div></section>');
  }

  /* ── SUBJECT PAGE (with semester filter + similar) ─ */
  function subjectPage(level, gradeId, streamId, subjectId, query) {
    query = query || {};
    var active = query.type || 'lesson';
    var semester = query.semester || 'all';
    var types = ['lesson','exercise','homework','exam'];
    var filters = { level: level, grade: gradeId, subject: subjectId, type: active };
    if (streamId) filters.stream = streamId;
    if (semester !== 'all') filters.semester = semester;
    var items = data.resourcesFor(filters);

    var crumbs = [
      { label: t('breadcrumb.home'), href: '#/' },
      { label: t('nav.' + level), href: '#/' + level }
    ];
    if (level === 'college') {
      crumbs.push({ label: data.gradeName(gradeId, lang()), href: '#/college/' + gradeId });
    } else {
      crumbs.push({ label: data.gradeName(gradeId, lang()), href: '#/lycee/' + gradeId });
      crumbs.push({ label: data.streamName(streamId, lang()), href: '#/lycee/' + gradeId + '/' + streamId });
    }
    crumbs.push({ label: data.subjectName(subjectId, lang()) });

    var base = '#/' + level + '/' + gradeId + (streamId ? '/' + streamId : '') + '/' + subjectId;
    function urlFor(type, sem) {
      var parts = [];
      if (type) parts.push('type=' + type);
      if (sem && sem !== 'all') parts.push('semester=' + sem);
      return base + (parts.length ? '?' + parts.join('&') : '');
    }

    var tabs = types.map(function (tp) {
      var count = data.resourcesFor(Object.assign({}, filters, { type: tp })).length;
      return '<a class="tab' + (tp === active ? ' is-active' : '') + '" href="' + urlFor(tp, semester) + '">'
        + t('subject.tabs.' + tp) + '<span class="tab__count">' + count + '</span></a>';
    }).join('');

    var semChips = ''
      + '<div class="filters filters--inline no-print">'
      +   '<div class="filters__group">'
      +     '<span class="filters__label">' + t('subject.semester') + '</span>'
      +     '<div class="filters__chips">'
      +       '<a class="chip' + (semester === 'all' ? ' is-active' : '') + '" href="' + urlFor(active, 'all') + '">' + t('subject.semesterAll') + '</a>'
      +       '<a class="chip' + (String(semester) === '1' ? ' is-active' : '') + '" href="' + urlFor(active, 1) + '">' + t('subject.semester1') + '</a>'
      +       '<a class="chip' + (String(semester) === '2' ? ' is-active' : '') + '" href="' + urlFor(active, 2) + '">' + t('subject.semester2') + '</a>'
      +     '</div>'
      +   '</div>'
      + '</div>';

    var listHtml = items.length
      ? '<div class="resource-list">' + items.map(function (r) { return C.resourceRow(r); }).join('') + '</div>'
      : empty(t('resources.empty'), t('resources.emptyHint'));

    // Similar results (from other subjects, same level)
    var similar = similarFor(subjectId, level, gradeId);

    return main(level, ''
      + C.breadcrumb(crumbs)
      + '<section class="page"><div class="container">'
      +   '<header class="page__head page__head--subject">'
      +     '<div class="page__head-icon">' + C.subjectIcon(subjectId) + '</div>'
      +     '<div>'
      +       '<h1 class="page__title">' + data.subjectName(subjectId, lang()) + '</h1>'
      +       '<p class="page__sub">' + (streamId ? data.streamName(streamId, lang()) + ' · ' : '') + data.gradeName(gradeId, lang()) + '</p>'
      +     '</div>'
      +   '</header>'
      +   '<div class="tabs tabs--bar">' + tabs + '</div>'
      +   semChips
      +   listHtml
      +   (similar.length ? similarBlock(similar) : '')
      + '</div></section>');
  }

  function similarFor(currentSubject, level, gradeId) {
    var all = window.MD.data.resources || [];
    var pool = all.filter(function (r) {
      if (r.subject === currentSubject && r.grade === gradeId) return false;
      return r.level === level;
    });
    // Deduplicate by title
    var seen = {};
    var out = [];
    pool.forEach(function (r) {
      if (seen[r.title]) return;
      seen[r.title] = 1;
      out.push(r);
    });
    // Deterministic pick: sort by id for stability, take 4
    out.sort(function (a, b) { return String(a.id).localeCompare(String(b.id)); });
    return out.slice(0, 4);
  }

  function similarBlock(items) {
    return ''
      + '<section class="similar no-print">'
      +   '<h2 class="similar__title">' + t('subject.similar') + '</h2>'
      +   '<div class="resource-list">'
      +     items.map(function (r) { return C.resourceRow(r); }).join('')
      +   '</div>'
      + '</section>';
  }

  /* ── EXAMS ────────────────────────────────────────── */
  function exams(query) {
    query = query || {};
    var yearFilter = query.year || 'all';
    var levelFilter = query.level || 'all';
    var years = data.years();
    var items = data.resourcesFor({ type: 'exam' }).filter(function (r) {
      if (yearFilter !== 'all' && String(r.year) !== yearFilter) return false;
      if (levelFilter !== 'all' && r.level !== levelFilter) return false;
      return true;
    });

    function yearChip(y) {
      return '<a class="chip' + (String(yearFilter) === String(y) ? ' is-active' : '') + '" href="#/exams?year=' + y + (levelFilter !== 'all' ? '&level=' + levelFilter : '') + '">' + y + '</a>';
    }
    function levelChip(id, label) {
      return '<a class="chip' + (levelFilter === id ? ' is-active' : '') + '" href="#/exams?level=' + id + (yearFilter !== 'all' ? '&year=' + yearFilter : '') + '">' + label + '</a>';
    }

    var listHtml = items.length
      ? '<div class="resource-list">' + items.map(function (r) { return C.resourceRow(r); }).join('') + '</div>'
      : empty(t('resources.empty'), t('resources.emptyHint'));

    return main('exams', ''
      + C.breadcrumb([{ label: t('breadcrumb.home'), href: '#/' }, { label: t('nav.exams') }])
      + '<section class="page"><div class="container">'
      +   '<header class="page__head"><h1 class="page__title">' + t('exams.title') + '</h1>'
      +     '<p class="page__sub">' + t('exams.subtitle') + '</p></header>'
      +   '<div class="filters">'
      +     '<div class="filters__group"><span class="filters__label">' + t('exams.filter.year') + '</span>'
      +       '<div class="filters__chips">'
      +         '<a class="chip' + (yearFilter === 'all' ? ' is-active' : '') + '" href="#/exams' + (levelFilter !== 'all' ? '?level=' + levelFilter : '') + '">' + t('exams.allYears') + '</a>'
      +         years.map(yearChip).join('')
      +       '</div></div>'
      +     '<div class="filters__group"><span class="filters__label">' + t('exams.filter.level') + '</span>'
      +       '<div class="filters__chips">'
      +         '<a class="chip' + (levelFilter === 'all' ? ' is-active' : '') + '" href="#/exams' + (yearFilter !== 'all' ? '?year=' + yearFilter : '') + '">' + t('exams.allLevels') + '</a>'
      +         levelChip('college', t('nav.college'))
      +         levelChip('lycee', t('nav.lycee'))
      +       '</div></div>'
      +   '</div>'
      +   listHtml
      + '</div></section>');
  }

  /* ── SEARCH ───────────────────────────────────────── */
  function search(query) {
    query = query || {};
    var q = (query.q || '').trim();
    var typeFilter = query.type || 'all';
    var result = q ? window.MD.search.search(q, { type: typeFilter }) : { results: [] };
    var suggestions = q ? window.MD.search.suggest(q, 5) : [];
    var types = ['all','lesson','exercise','homework','exam'];

    var typeChips = types.map(function (tp) {
      var on = tp === typeFilter ? ' is-active' : '';
      var label = tp === 'all' ? t('exams.allTypes') : t('type.' + tp);
      var href = '#/search?q=' + encodeURIComponent(q) + (tp === 'all' ? '' : '&type=' + tp);
      return '<a class="chip' + on + '" href="' + href + '">' + label + '</a>';
    }).join('');

    var body;
    if (!q) {
      body = ''
        + '<div class="search-hero">'
        +   '<h1 class="search-hero__title">' + t('search.emptyTitle') + '</h1>'
        +   '<p class="search-hero__sub">' + t('search.emptyHint') + '</p>'
        +   '<form class="search-hero__form" data-role="navbar-search" role="search" autocomplete="off">'
        +     '<div class="search search--lg">'
        +       '<span class="search__icon">' + C.icon('search') + '</span>'
        +       '<input class="input" type="search" name="q" placeholder="' + t('search.placeholder') + '" autocomplete="off" />'
        +       '<button class="btn btn--accent hero__search-btn" type="submit">' + t('search.submit') + '</button>'
        +     '</div>'
        +   '</form>'
        +   '<p class="search-hero__examples-label">' + t('search.tryThese') + '</p>'
        +   '<div class="search-hero__examples">'
        +     exampleChip('رياضيات الثالثة إعدادي')
        +     exampleChip('الاشتقاق')
        +     exampleChip('فيزياء 2 باك')
        +     exampleChip('امتحان وطني 2024')
        +     exampleChip('SVT')
        +     exampleChip('Math 2BAC')
        +   '</div>'
        + '</div>';
    } else {
      var listHtml = result.results.length
        ? '<div class="resource-list">' + result.results.map(function (r) {
            return C.resourceRow(r, { highlight: q });
          }).join('') + '</div>'
        : emptyInline(t('search.noResults'), t('search.noResultsHint', { q: q }),
            suggestions.length
              ? '<p class="suggest-label">' + t('search.suggestions') + '</p><div class="suggest-list">'
                + suggestions.map(function (r) {
                    return '<a class="suggest" href="' + suggestHref(r) + '">'
                      + '<span class="suggest__title">' + r.title + '</span>'
                      + '<span class="suggest__meta">' + data.subjectName(r.subject, lang()) + '</span></a>';
                  }).join('') + '</div>'
              : '');

      body = ''
        + '<header class="page__head page__head--search">'
        +   '<form class="search search--lg" data-role="navbar-search" role="search" autocomplete="off">'
        +     '<span class="search__icon">' + C.icon('search') + '</span>'
        +     '<input class="input" type="search" name="q" value="' + escapeAttr(q) + '" placeholder="' + t('search.placeholder') + '" autocomplete="off" />'
        +     '<button class="btn btn--accent hero__search-btn" type="submit">' + t('search.submit') + '</button>'
        +   '</form>'
        +   '<div class="filters__chips">' + typeChips + '</div>'
        +   '<p class="search__meta">' + t('search.resultsCount', { n: result.results.length }) + '</p>'
        + '</header>'
        + listHtml;
    }

    return main(null, ''
      + C.breadcrumb([{ label: t('breadcrumb.home'), href: '#/' }, { label: t('search.title') }])
      + '<section class="page"><div class="container">' + body + '</div></section>');
  }

  function suggestHref(r) {
    if (r.level === 'college') return '#/college/' + r.grade + '/' + r.subject + '?type=' + r.type;
    return '#/lycee/' + r.grade + '/' + r.stream + '/' + r.subject + '?type=' + r.type;
  }
  function exampleChip(text) { return '<a class="chip" href="#/search?q=' + encodeURIComponent(text) + '">' + text + '</a>'; }
  function escapeAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ── SAVED (favorites) ───────────────────────────── */
  function saved() {
    var favs = window.MD.state.getFavorites();
    var items = (window.MD.data.resources || []).filter(function (r) { return favs.indexOf(String(r.id)) !== -1; });

    var body = items.length
      ? '<div class="saved no-print-header"><div class="saved__toolbar no-print">'
        +   '<span class="saved__count">' + t('saved.count', { n: items.length }) + '</span>'
        +   '<button class="btn btn--secondary btn--sm" data-action="print-saved">'
        +     C.icon('printer', 'icon--sm') + ' ' + t('saved.print') + '</button>'
        + '</div><div class="resource-list">'
        +   items.map(function (r) { return C.resourceRow(r); }).join('')
        + '</div></div>'
      : '<div class="empty">'
        + '<div class="empty__icon">' + C.starIcon(false, 'icon--xl') + '</div>'
        + '<h2 class="empty__title">' + t('saved.empty') + '</h2>'
        + '<p class="empty__hint">' + t('saved.emptyHint') + '</p>'
        + '</div>';

    return main('saved', ''
      + C.breadcrumb([{ label: t('breadcrumb.home'), href: '#/' }, { label: t('nav.saved') }])
      + '<section class="page"><div class="container">'
      +   '<header class="page__head no-print"><h1 class="page__title">' + t('saved.title') + '</h1>'
      +     '<p class="page__sub">' + t('saved.subtitle') + '</p></header>'
      +   body
      + '</div></section>');
  }

  /* ── Helpers ──────────────────────────────────────── */
  function empty(title, hint) {
    return '<div class="empty"><div class="empty__icon">' + C.icon('file', 'icon--xl') + '</div>'
      + '<h2 class="empty__title">' + title + '</h2><p class="empty__hint">' + hint + '</p></div>';
  }
  function emptyInline(title, hint, extra) {
    return '<div class="empty"><div class="empty__icon">' + C.icon('search', 'icon--xl') + '</div>'
      + '<h2 class="empty__title">' + title + '</h2><p class="empty__hint">' + hint + '</p>'
      + (extra || '') + '</div>';
  }

  function notFound() {
    return main(null, ''
      + '<section class="page page--center"><div class="container">'
      +   '<div class="empty">'
      +     '<div class="empty__icon">' + C.icon('sparkle', 'icon--xl') + '</div>'
      +     '<h1 class="empty__title">' + t('notFound.title') + '</h1>'
      +     '<p class="empty__hint">' + t('notFound.desc') + '</p>'
      +     '<a class="btn btn--primary" href="#/" style="margin-block-start:1rem">' + t('notFound.cta') + '</a>'
      +   '</div>'
      + '</div></section>');
  }

  window.MD.pages = {
    home: home, college: college, lycee: lycee,
    collegeGrade: collegeGrade, lyceeGrade: lyceeGrade, lyceeStream: lyceeStream,
    subjectPage: subjectPage, exams: exams, search: search,
    saved: saved, notFound: notFound
  };
})();