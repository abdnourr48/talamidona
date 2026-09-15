/* search.js — normalization, aliases, index, scoring */
(function () {
  'use strict';

  function normalize(s) {
    if (s == null) return '';
    s = String(s).toLowerCase().trim();
    s = s.replace(/[\u064B-\u0652\u0670\u0640]/g, '');
    s = s.replace(/[إأآٱا]/g, 'ا');
    s = s.replace(/[ىي]/g, 'ي');
    s = s.replace(/ة/g, 'ه');
    s = s.replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
    s = s.replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a')
         .replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o')
         .replace(/[ùûü]/g, 'u').replace(/ç/g, 'c');
    s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
  }

  var ALIASES = {
    '2bac': 'الثانيه باكالوريا 2bac seconde bac',
    '1bac': 'الاولى باكالوريا 1bac premiere bac',
    '2b':   'الثانيه باكالوريا',
    '1b':   'الاولى باكالوريا',
    'tc':   'الجذوع المشتركه tronc commun',
    'pc':   'علوم فيزيائيه physique chimie',
    'svt':  'علوم الحياه والارض',
    'sm':   'علوم رياضيه sciences maths',
    'seco': 'علوم اقتصاديه sciences economiques',
    'math': 'الرياضيات mathematiques mathematics maths',
    'maths':'الرياضيات',
    'physique':'الفيزياء chimie',
    'phys': 'الفيزياء',
    'arabe':'اللغه العربيه',
    'francais':'اللغه الفرنسيه',
    'anglais':'اللغه الانجليزيه',
    'english':'اللغه الانجليزيه',
    'philo':'الفلسفه philosophie',
    'national':'امتحان وطني',
    'regional':'امتحان جهوي',
    'local':'امتحان محلي',
    'examen':'امتحان',
    'exam':'امتحان',
    'cours':'درس',
    'lesson':'درس',
    'exercice':'تمرين',
    'exercise':'تمرين',
    'devoir':'فرض',
    'homework':'فرض'
  };

  function expand(q) {
    var parts = normalize(q).split(/\s+/).filter(Boolean);
    var out = parts.slice();
    parts.forEach(function (p) {
      if (ALIASES[p]) {
        normalize(ALIASES[p]).split(/\s+/).forEach(function (w) {
          if (w && out.indexOf(w) === -1) out.push(w);
        });
      }
    });
    return out;
  }

  var index = [];
  function build() {
    var data = window.MD.data;
    if (!data) return;
    index = data.resources.map(function (r) {
      var text = [r.title, r.subject, r.level, r.grade, r.stream, r.type, r.examType || '', r.year || '', (r.keywords || []).join(' ')].join(' ');
      return { r: r, text: normalize(text), title: normalize(r.title) };
    });
  }

  function scoreDoc(doc, terms, rawQuery) {
    if (!terms.length) return 0;
    var total = 0;
    var rawNorm = normalize(rawQuery);

    if (rawNorm && doc.title.indexOf(rawNorm) !== -1) total += 25;
    terms.forEach(function (term) {
      if (!term) return;
      if (doc.title.indexOf(term) !== -1) total += 10;
      if (doc.text.indexOf(term) !== -1) total += 3;
    });

    var r = doc.r;
    terms.forEach(function (t) {
      if (!t) return;
      if (normalize(window.MD.data.subjectName(r.subject, 'ar')) === t) total += 4;
      if (r.stream && normalize(window.MD.data.streamName(r.stream, 'ar')) === t) total += 3;
      if (normalize(r.type) === t) total += 3;
      if (r.year && String(r.year) === t) total += 5;
    });

    return total;
  }

  function search(query, filters) {
    filters = filters || {};
    if (!index.length) build();
    var terms = expand(query || '');
    if (!query || !terms.length) return { results: [], query: query || '' };
    var scored = index.map(function (doc) {
      return { r: doc.r, s: scoreDoc(doc, terms, query) };
    }).filter(function (x) {
      if (x.s <= 0) return false;
      var r = x.r;
      if (filters.type && filters.type !== 'all' && r.type !== filters.type) return false;
      if (filters.year && filters.year !== 'all' && String(r.year) !== String(filters.year)) return false;
      if (filters.level && filters.level !== 'all' && r.level !== filters.level) return false;
      return true;
    }).sort(function (a, b) { return b.s - a.s; })
      .map(function (x) { return x.r; });
    return { results: scored, query: query };
  }

  function suggest(query, limit) {
    limit = limit || 6;
    if (!index.length) build();
    var terms = expand(query || '');
    if (!terms.length) return [];
    var seen = {};
    var out = [];
    index.forEach(function (doc) {
      var s = 0;
      terms.forEach(function (t) {
        if (!t) return;
        if (doc.title.indexOf(t) !== -1) s += 5;
        if (doc.text.indexOf(t) !== -1) s += 1;
      });
      if (s > 0 && !seen[doc.r.title]) {
        seen[doc.r.title] = 1;
        out.push({ r: doc.r, s: s });
      }
    });
    out.sort(function (a, b) { return b.s - a.s; });
    return out.slice(0, limit).map(function (x) { return x.r; });
  }

  window.MD = window.MD || {};
  window.MD.search = { search: search, suggest: suggest, normalize: normalize, build: build };
})();
