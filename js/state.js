/* state.js — language + theme + favorites + reading mode */
(function () {
  'use strict';
  var LANG_KEY = 'md.lang', THEME_KEY = 'md.theme';
  var FAV_KEY = 'md.favorites', READING_KEY = 'md.reading';
  var VALID_LANGS = { ar: true, en: true, fr: true };
  var VALID_THEMES = { light: true, dark: true };
  var listeners = { lang: [], theme: [], favorites: [], reading: [] };
  var root = typeof document !== 'undefined' ? document.documentElement : null;
  var media = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function normalizeLang(v) { return VALID_LANGS[v] ? v : 'ar'; }
  function normalizeTheme(v) { return VALID_THEMES[v] ? v : 'light'; }
  function detectPreferredTheme() {
    if (media && typeof media.matches === 'boolean') return media.matches ? 'dark' : 'light';
    return 'light';
  }

  var lang = normalizeLang(safeGet(LANG_KEY) || 'ar');
  var theme = normalizeTheme(safeGet(THEME_KEY) || detectPreferredTheme());
  var reading = safeGet(READING_KEY) === 'on';

  var favorites = [];
  try {
    var raw = JSON.parse(safeGet(FAV_KEY) || '[]');
    if (Array.isArray(raw)) favorites = raw.map(String);
  } catch (e) { favorites = []; }

  function applyLang() {
    if (!root) return;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }
  function applyTheme() {
    if (!root) return;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }
  function applyReading() {
    if (!root) return;
    if (reading) root.setAttribute('data-reading', 'on');
    else root.removeAttribute('data-reading');
    var btn = document.getElementById('reading-exit');
    if (btn) btn.hidden = !reading;
  }
  function emit(type) {
    (listeners[type] || []).forEach(function (fn) {
      try { fn(); } catch (e) { console.error(e); }
    });
  }

  var api = {
    getLang: function () { return lang; },
    setLang: function (v) {
      var next = normalizeLang(v);
      if (next === lang) return;
      lang = next; safeSet(LANG_KEY, next); applyLang(); emit('lang');
    },
    getTheme: function () { return theme; },
    setTheme: function (v) {
      var next = normalizeTheme(v);
      if (next === theme) return;
      theme = next; safeSet(THEME_KEY, next); applyTheme(); emit('theme');
    },
    toggleTheme: function () { api.setTheme(theme === 'dark' ? 'light' : 'dark'); },

    /* Favorites */
    getFavorites: function () { return favorites.slice(); },
    isFavorite: function (id) { return favorites.indexOf(String(id)) !== -1; },
    toggleFavorite: function (id) {
      id = String(id);
      var i = favorites.indexOf(id);
      if (i === -1) favorites.push(id); else favorites.splice(i, 1);
      safeSet(FAV_KEY, JSON.stringify(favorites));
      emit('favorites');
      return i === -1;
    },

    /* Reading mode */
    isReading: function () { return reading; },
    setReading: function (on) {
      reading = !!on;
      safeSet(READING_KEY, reading ? 'on' : 'off');
      applyReading();
      emit('reading');
    },
    toggleReading: function () { api.setReading(!reading); },

    on: function (t, fn) { (listeners[t] = listeners[t] || []).push(fn); },
    init: function () { applyLang(); applyTheme(); applyReading(); }
  };

  window.MD = window.MD || {};
  window.MD.state = api;
  api.init();
})();