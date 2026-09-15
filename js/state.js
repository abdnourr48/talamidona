/* state.js — language + theme, both persisted, with subscriptions */
(function () {
  'use strict';
  var LANG_KEY = 'md.lang', THEME_KEY = 'md.theme';
  var VALID_LANGS = { ar: true, en: true, fr: true };
  var VALID_THEMES = { light: true, dark: true };
  var listeners = { lang: [], theme: [] };
  var root = typeof document !== 'undefined' ? document.documentElement : null;
  var media = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function safeGet(k) { try { return typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null; } catch (e) { return null; } }
  function safeSet(k, v) { try { if (typeof localStorage !== 'undefined') localStorage.setItem(k, v); } catch (e) {} }

  function normalizeLang(value) {
    return VALID_LANGS[value] ? value : 'ar';
  }
  function normalizeTheme(value) {
    return VALID_THEMES[value] ? value : 'light';
  }
  function detectPreferredTheme() {
    if (media && typeof media.matches === 'boolean') return media.matches ? 'dark' : 'light';
    return 'light';
  }

  var lang = normalizeLang(safeGet(LANG_KEY) || 'ar');
  var theme = normalizeTheme(safeGet(THEME_KEY) || detectPreferredTheme());

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
  function emit(type) {
    (listeners[type] || []).forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
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
    on: function (t, fn) { (listeners[t] = listeners[t] || []).push(fn); },
    init: function () { applyLang(); applyTheme(); }
  };

  window.MD = window.MD || {};
  window.MD.state = api;
  api.init();
})();