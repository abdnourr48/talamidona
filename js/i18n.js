/* i18n.js — fetches locales/*.json */
(function () {
  'use strict';
  var cache = {};

  function t(key, vars) {
    var cur = (window.MD.state && window.MD.state.getLang()) || 'ar';
    var dict = cache[cur] || cache.ar || {};
    var fb   = cache.ar || {};
    var str  = dict[key] !== undefined ? dict[key] : fb[key];
    if (str === undefined) return key;
    if (vars) {
      str = str.replace(/\{(\w+)\}/g, function (_, k) {
        return vars[k] != null ? vars[k] : '';
      });
    }
    return str;
  }

  function loadAll() {
    return Promise.all(['ar','fr','en'].map(function (l) {
      return fetch('locales/' + l + '.json')
        .then(function (r) {
          if (!r.ok) throw new Error('Cannot load locales/' + l + '.json (HTTP ' + r.status + ')');
          return r.json();
        })
        .then(function (d) { cache[l] = d; });
    }));
  }

  window.MD = window.MD || {};
  window.MD.i18n = { t: t, loadAll: loadAll };
})();