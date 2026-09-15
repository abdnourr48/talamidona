/* router.js — tiny hash router */
(function () {
  'use strict';
  var routes = [];
  var notFoundHandler = null;
  var mountEl = null;

  function compile(pattern) {
    var keys = [];
    var re = pattern.replace(/:(\w+)/g, function (_, k) { keys.push(k); return '([^/]+)'; });
    return { re: new RegExp('^' + re + '$'), keys: keys };
  }

  function on(pattern, handler) {
    var c = compile(pattern);
    routes.push({ re: c.re, keys: c.keys, handler: handler });
  }

  function parse() {
    var hash = location.hash.replace(/^#/, '') || '/';
    var qi = hash.indexOf('?');
    var query = {};
    if (qi !== -1) {
      hash.slice(qi + 1).split('&').forEach(function (pair) {
        if (!pair) return;
        var idx = pair.indexOf('=');
        var k = idx === -1 ? pair : pair.slice(0, idx);
        var v = idx === -1 ? '' : pair.slice(idx + 1);
        query[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' '));
      });
      hash = hash.slice(0, qi);
    }
    var segments = hash.split('/').filter(Boolean);
    return { path: '/' + segments.join('/'), segments: segments, query: query };
  }

  function navigate(to) {
    if (to.charAt(0) === '#') to = to.slice(1);
    if (to.charAt(0) !== '/') to = '/' + to;
    if (location.hash === '#' + to) { resolve(); return; }
    location.hash = '#' + to;
  }

  function mount(html) {
    if (!mountEl) mountEl = document.getElementById('view') || document.getElementById('app');
    if (html == null || !mountEl) return;
    mountEl.innerHTML = html;
    window.scrollTo(0, 0);
    document.dispatchEvent(new CustomEvent('route:mounted'));
  }

  function resolve() {
    var route = parse();
    for (var i = 0; i < routes.length; i++) {
      var m = route.path.match(routes[i].re);
      if (m) {
        var params = {};
        routes[i].keys.forEach(function (k, idx) {
          params[k] = decodeURIComponent(m[idx + 1]);
        });
        mount(routes[i].handler(params, route.query));
        return;
      }
    }
    if (notFoundHandler) mount(notFoundHandler({}, route.query));
  }

  window.MD = window.MD || {};
  window.MD.router = {
    on: on,
    notFound: function (fn) { notFoundHandler = fn; },
    navigate: navigate,
    resolve: resolve,
    mountTo: function (el) { mountEl = el; }
  };
  window.addEventListener('hashchange', resolve);
})();