/* dev.js - static content authoring panel */
(function () {
  'use strict';

  var DRAFTS_KEY = 'md.dev.drafts';

  function loadDrafts() {
    try {
      var value = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (e) { return []; }
  }

  function saveDrafts(value) {
    try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(value)); } catch (e) {}
  }

  function nextId(drafts) {
    var max = 0;
    (window.MD.data.resources || []).concat(drafts || []).forEach(function (resource) {
      var match = /^r(\d+)$/.exec(String(resource.id || ''));
      if (match) max = Math.max(max, Number(match[1]));
    });
    return 'r' + (max + 1);
  }

  function quote(value) {
    return '"' + String(value == null ? '' : value)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\r?\n/g, '\\n') + '"';
  }

  function resourceCode(resource) {
    var args = [
      quote(resource.id), quote(resource.title), quote(resource.level), quote(resource.grade),
      resource.stream ? quote(resource.stream) : 'null', quote(resource.subject), quote(resource.type),
      resource.year == null ? 'null' : String(resource.year),
      '[' + (resource.keywords || []).map(quote).join(', ') + ']',
      resource.examType ? quote(resource.examType) : 'null',
      resource.fileUrl ? quote(resource.fileUrl) : 'null',
      resource.semester ? String(resource.semester) : 'null'
    ];
    while (args.length > 9 && args[args.length - 1] === 'null') args.pop();
    return '  R(' + args.join(', ') + '),';
  }

  function stat(id, label) {
    return '<div class="dev-stat"><strong id="' + id + '">0</strong><span>' + label + '</span></div>';
  }

  function field(id, label, control) {
    return '<div class="field"><label class="field__label" for="' + id + '">' + label + '</label>' + control + '</div>';
  }

  function optionList(ids, labeler) {
    return ids.map(function (id) { return '<option value="' + id + '">' + labeler(id) + '</option>'; }).join('');
  }

  function devPage() {
    var t = window.MD.i18n.t;
    var C = window.MD.components;
    return C.navbar(null)
      + '<main id="view"><section class="page dev-page"><div class="container">'
      + '<header class="page__head"><h1 class="page__title">لوحة المطور</h1><p class="page__sub">أضف وعدّل واستورد محتوى المنصة، ثم انسخ الكود إلى data.js.</p></header>'
      + '<div class="dev-stats">' + stat('dev-total', 'الكل') + stat('dev-lessons', 'الدروس') + stat('dev-exercises', 'التمارين') + stat('dev-exams', 'الامتحانات') + stat('dev-pdfs', 'PDF') + '</div>'
      + '<div class="dev-grid"><form class="card dev-form" id="dev-form" novalidate>'
      + field('dev-title', 'العنوان *', '<input class="input" id="dev-title" name="title" required>')
      + '<div class="cluster">' + field('dev-level', 'السلك *', '<select class="input" id="dev-level" name="level"><option value="">اختر</option><option value="college">' + t('nav.college') + '</option><option value="lycee">' + t('nav.lycee') + '</option></select>')
      + field('dev-grade', 'المستوى *', '<select class="input" id="dev-grade" name="grade" disabled><option value="">اختر السلك أولاً</option></select>') + '</div>'
      + '<div class="field" id="dev-stream-field" hidden><label class="field__label" for="dev-stream">الشعبة *</label><select class="input" id="dev-stream" name="stream"></select></div>'
      + field('dev-subject', 'المادة *', '<select class="input" id="dev-subject" name="subject" disabled><option value="">اختر المستوى أولاً</option></select>')
      + '<div class="cluster">' + field('dev-type', 'النوع *', '<select class="input" id="dev-type" name="type"><option value="lesson">' + t('type.lesson') + '</option><option value="exercise">' + t('type.exercise') + '</option><option value="homework">' + t('type.homework') + '</option><option value="exam">' + t('type.exam') + '</option></select>')
      + field('dev-year', 'السنة', '<input class="input" type="number" id="dev-year" name="year">') + '</div>'
      + '<div class="field" id="dev-exam-field" hidden><label class="field__label" for="dev-examType">نوع الامتحان</label><select class="input" id="dev-examType" name="examType"><option value="">-</option><option value="national">وطني</option><option value="regional">جهوي</option><option value="local">محلي</option></select></div>'
      + field('dev-semester', 'الفصل الدراسي', '<select class="input" id="dev-semester" name="semester"><option value="">-</option><option value="1">الدورة الأولى</option><option value="2">الدورة الثانية</option></select>')
      + field('dev-keywords', 'كلمات مفتاحية', '<input class="input" id="dev-keywords" name="keywords" placeholder="كلمة، كلمة أخرى">')
      + field('dev-id', 'المعرف *', '<input class="input" id="dev-id" name="id">')
      + field('dev-fileUrl', 'مسار PDF اختياري', '<input class="input" id="dev-fileUrl" name="fileUrl" placeholder="assets/pdfs/r58.pdf">')
      + '<p class="field__hint dev-error" id="dev-error" hidden></p><div class="cluster"><button class="btn btn--primary" type="submit" id="dev-submit">' + C.icon('check', 'icon--sm') + ' <span>أضف إلى القائمة</span></button><button class="btn btn--ghost" type="button" id="dev-reset">تفريغ النموذج</button></div></form>'
      + '<div class="card dev-preview"><div class="card__head"><h3 class="card__title">معاينة مباشرة</h3></div><div id="dev-preview-row"><p class="field__hint">املأ النموذج لمعاينة الشكل النهائي.</p></div></div></div>'
      + '<div class="card dev-drafts"><div class="card__head"><h3 class="card__title">المحتوى المُعدّ <span id="dev-count">0</span></h3><div class="cluster"><button class="btn btn--secondary btn--sm" type="button" id="dev-backup">نسخة احتياطية</button><button class="btn btn--ghost btn--sm" type="button" id="dev-clear">تفريغ الكل</button></div></div><div id="dev-list"></div></div>'
      + '<div class="card dev-import"><div class="card__head"><h3 class="card__title">استيراد JSON</h3><button class="btn btn--accent btn--sm" type="button" id="dev-import">استيراد</button></div><textarea class="input" id="dev-import-area" rows="5" placeholder="[{\"title\":\"درس\",\"level\":\"college\"}]"></textarea><p class="field__hint dev-error" id="dev-import-error" hidden></p></div>'
      + '<div class="card dev-export"><div class="card__head"><h3 class="card__title">الكود الجاهز لـ data.js</h3><button class="btn btn--accent btn--sm" type="button" id="dev-copy">نسخ الكود</button></div><pre id="dev-code" class="dev-code"></pre></div>'
      + '</div></section></main>' + C.footer();
  }

  function readForm(form) {
    var fd = new FormData(form);
    var type = String(fd.get('type') || 'lesson');
    return {
      id: String(fd.get('id') || '').trim(), title: String(fd.get('title') || '').trim(), level: String(fd.get('level') || ''),
      grade: String(fd.get('grade') || ''), stream: String(fd.get('stream') || '') || null, subject: String(fd.get('subject') || ''), type: type,
      year: fd.get('year') ? Number(fd.get('year')) : null, examType: type === 'exam' ? (fd.get('examType') || null) : null,
      semester: fd.get('semester') ? Number(fd.get('semester')) : null, fileUrl: String(fd.get('fileUrl') || '').trim() || null,
      keywords: String(fd.get('keywords') || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean)
    };
  }

  function populate(level, grade, stream) {
    var data = window.MD.data;
    var grades = document.getElementById('dev-grade');
    var streams = document.getElementById('dev-stream');
    var subjects = document.getElementById('dev-subject');
    var gradeIds = Object.keys(data.grades).filter(function (id) { return data.grades[id].level === level; });
    grades.innerHTML = '<option value="">اختر</option>' + optionList(gradeIds, function (id) { return data.gradeName(id, 'ar'); });
    grades.disabled = !level;
    grades.value = grade || '';
    var current = data.grades[grade];
    var streamIds = current && current.streams ? current.streams : [];
    document.getElementById('dev-stream-field').hidden = !streamIds.length;
    streams.innerHTML = '<option value="">اختر</option>' + optionList(streamIds, function (id) { return data.streamName(id, 'ar'); });
    streams.value = stream || '';
    var subjectIds = current && current.streams ? ((data.streams[stream] || {}).subjects || []) : (current ? current.subjects : []);
    subjects.innerHTML = '<option value="">اختر</option>' + optionList(subjectIds || [], function (id) { return data.subjectName(id, 'ar'); });
    subjects.disabled = !subjectIds.length;
  }

  function render(drafts) {
    var list = document.getElementById('dev-list');
    if (!list) return;
    document.getElementById('dev-count').textContent = drafts.length;
    list.innerHTML = drafts.length ? drafts.map(function (item, index) {
      return '<div class="dev-draft-row"><div class="resource-list">' + window.MD.components.resourceRow(item) + '</div><button type="button" class="btn btn--ghost btn--sm dev-edit" data-index="' + index + '">تعديل</button><button type="button" class="btn btn--ghost btn--sm dev-remove" data-index="' + index + '">حذف</button></div>';
    }).join('') : '<p class="field__hint">لم يتم إضافة أي محتوى بعد.</p>';
    document.getElementById('dev-code').textContent = drafts.map(resourceCode).join('\n');
    document.getElementById('dev-total').textContent = drafts.length;
    document.getElementById('dev-lessons').textContent = drafts.filter(function (x) { return x.type === 'lesson'; }).length;
    document.getElementById('dev-exercises').textContent = drafts.filter(function (x) { return x.type === 'exercise'; }).length;
    document.getElementById('dev-exams').textContent = drafts.filter(function (x) { return x.type === 'exam'; }).length;
    document.getElementById('dev-pdfs').textContent = drafts.filter(function (x) { return x.fileUrl; }).length;
  }

  function wire() {
    var form = document.getElementById('dev-form');
    if (!form || form.dataset.wired) return;
    form.dataset.wired = '1';
    var drafts = loadDrafts();
    var editing = null;
    var level = document.getElementById('dev-level');
    var type = document.getElementById('dev-type');
    var error = document.getElementById('dev-error');
    function preview() {
      var value = readForm(form);
      document.getElementById('dev-preview-row').innerHTML = value.title && value.subject ? '<div class="resource-list">' + window.MD.components.resourceRow(value) + '</div>' : '<p class="field__hint">املأ النموذج لمعاينة الشكل النهائي.</p>';
    }
    function reset() {
      form.reset(); editing = null; document.getElementById('dev-id').value = nextId(drafts); document.getElementById('dev-exam-field').hidden = true; populate('', '', ''); render(drafts); preview();
    }
    level.addEventListener('change', function () { populate(level.value, '', ''); preview(); });
    document.getElementById('dev-grade').addEventListener('change', function () { populate(level.value, this.value, ''); preview(); });
    document.getElementById('dev-stream').addEventListener('change', function () { populate(level.value, document.getElementById('dev-grade').value, this.value); preview(); });
    type.addEventListener('change', function () { document.getElementById('dev-exam-field').hidden = type.value !== 'exam'; preview(); });
    form.addEventListener('input', preview);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = readForm(form); var grade = window.MD.data.grades[value.grade]; var duplicate = (window.MD.data.resources || []).concat(drafts).some(function (item, index) { return index !== editing && item.id === value.id; });
      var message = !value.title || !value.level || !value.grade || !value.subject || !value.id ? 'أكمل الحقول الإلزامية.' : !/^[a-zA-Z0-9_-]+$/.test(value.id) ? 'المعرف غير صالح.' : grade && grade.streams && !value.stream ? 'اختر الشعبة.' : duplicate ? 'هذا المعرف مستخدم سابقاً.' : null;
      if (message) { error.hidden = false; error.textContent = '⚠ ' + message; return; }
      error.hidden = true; if (editing == null) drafts.push(value); else drafts[editing] = value; saveDrafts(drafts); reset();
    });
    document.getElementById('dev-reset').addEventListener('click', reset);
    document.getElementById('dev-clear').addEventListener('click', function () { if (drafts.length && window.confirm('حذف كل المسودات؟')) { drafts = []; saveDrafts(drafts); reset(); } });
    document.getElementById('dev-list').addEventListener('click', function (event) {
      var button = event.target.closest('button'); if (!button) return; var index = Number(button.dataset.index);
      if (button.classList.contains('dev-remove')) { drafts.splice(index, 1); saveDrafts(drafts); reset(); return; }
      var item = drafts[index]; editing = index; document.getElementById('dev-title').value = item.title; level.value = item.level; populate(item.level, item.grade, item.stream); document.getElementById('dev-subject').value = item.subject; type.value = item.type; document.getElementById('dev-year').value = item.year || ''; document.getElementById('dev-examType').value = item.examType || ''; document.getElementById('dev-semester').value = item.semester || ''; document.getElementById('dev-keywords').value = (item.keywords || []).join(', '); document.getElementById('dev-fileUrl').value = item.fileUrl || ''; document.getElementById('dev-id').value = item.id; document.getElementById('dev-exam-field').hidden = item.type !== 'exam'; preview();
    });
    document.getElementById('dev-copy').addEventListener('click', function () { if (navigator.clipboard) navigator.clipboard.writeText(document.getElementById('dev-code').textContent); });
    document.getElementById('dev-import').addEventListener('click', function () { var box = document.getElementById('dev-import-error'); try { var items = JSON.parse(document.getElementById('dev-import-area').value); if (!Array.isArray(items)) throw new Error('يجب أن تكون مصفوفة'); items.forEach(function (item) { item.id = item.id || nextId(drafts); drafts.push(item); }); saveDrafts(drafts); document.getElementById('dev-import-area').value = ''; box.hidden = true; render(drafts); } catch (e) { box.hidden = false; box.textContent = '⚠ ' + e.message; } });
    document.getElementById('dev-backup').addEventListener('click', function () { var blob = new Blob([JSON.stringify(drafts, null, 2)], { type: 'application/json' }); var link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'md-drafts.json'; link.click(); });
    reset();
  }

  document.addEventListener('route:mounted', function () { if (location.hash === '#/dev') wire(); });
  window.MD = window.MD || {};
  window.MD.pages = window.MD.pages || {};
  window.MD.pages.dev = devPage;
})();
