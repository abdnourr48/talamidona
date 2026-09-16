/* dev.js — developer panel: add / edit / import / search / export / PDF upload */
(function () {
  'use strict';

  var DRAFTS_KEY = 'md.dev.drafts';
  var PDF_DIR = 'assets/pdfs/';

  /* ── Storage ──────────────────────────────── */
  function loadDrafts() {
    try {
      var raw = localStorage.getItem(DRAFTS_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }
  function saveDrafts(list) {
    try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(list)); } catch (e) {}
  }

  /* ── ID helpers ───────────────────────────── */
  function nextId(drafts) {
    var max = 0;
    (window.MD.data.resources || []).concat(drafts || []).forEach(function (r) {
      var m = /^r(\d+)$/.exec(String(r.id || ''));
      if (m) max = Math.max(max, Number(m[1]));
    });
    return 'r' + (max + 1);
  }
  function isIdTaken(id, drafts) {
    return (window.MD.data.resources || []).concat(drafts || []).some(function (x) {
      return x.id === id;
    });
  }

  /* ── Code generation ──────────────────────── */
  function escapeJsString(v) {
    return String(v == null ? '' : v)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n');
  }

function toCodeLine(r) {
  var kw = (r.keywords || []).map(function (k) { return '"' + escapeJsString(k) + '"'; });
  var parts = [
    '"' + escapeJsString(r.id) + '"',
    '"' + escapeJsString(r.title) + '"',
    '"' + escapeJsString(r.level) + '"',
    '"' + escapeJsString(r.grade) + '"',
    r.stream ? '"' + escapeJsString(r.stream) + '"' : 'null',
    '"' + escapeJsString(r.subject) + '"',
    '"' + escapeJsString(r.type) + '"',
    r.year != null ? String(r.year) : 'null',
    '[' + kw.join(', ') + ']',
    r.examType ? '"' + escapeJsString(r.examType) + '"' : 'null',
    r.fileUrl ? '"' + escapeJsString(r.fileUrl) + '"' : 'null',
    r.semester ? String(r.semester) : 'null'
  ];
  // Trim trailing nulls to keep the code short
  while (parts.length > 9 && parts[parts.length - 1] === 'null') parts.pop();
  return '  R(' + parts.join(', ') + '),';
}

  /* ── Population helpers ───────────────────── */
  function currentLang() { return window.MD.state.getLang(); }

  function populateGrades(level, lang) {
    lang = lang || currentLang();
    var sel = document.getElementById('dev-grade');
    if (!level) {
      sel.innerHTML = '<option value="">اختر السلك أولاً</option>';
      sel.disabled = true;
      return;
    }
    var ids = Object.keys(window.MD.data.grades).filter(function (id) {
      return window.MD.data.grades[id].level === level;
    });
    sel.innerHTML = '<option value="">اختر</option>' + ids.map(function (id) {
      return '<option value="' + id + '">' + window.MD.data.gradeName(id, lang) + '</option>';
    }).join('');
    sel.disabled = false;
  }

  function populateStreams(gradeId, lang) {
    lang = lang || currentLang();
    var wrap = document.getElementById('dev-stream-field');
    var sel = document.getElementById('dev-stream');
    var g = gradeId ? window.MD.data.grades[gradeId] : null;
    if (!g || !g.streams) { wrap.hidden = true; sel.innerHTML = ''; return; }
    wrap.hidden = false;
    sel.innerHTML = '<option value="">اختر</option>' + g.streams.map(function (sid) {
      return '<option value="' + sid + '">' + window.MD.data.streamName(sid, lang) + '</option>';
    }).join('');
  }

  function populateSubjects(gradeId, streamId, lang) {
    lang = lang || currentLang();
    var sel = document.getElementById('dev-subject');
    var g = gradeId ? window.MD.data.grades[gradeId] : null;
    var list = [];
    if (g && g.streams) {
      var stream = streamId ? window.MD.data.streams[streamId] : null;
      list = stream ? stream.subjects : [];
    } else if (g) {
      list = g.subjects || [];
    }
    if (!list.length) {
      sel.innerHTML = '<option value="">اختر المستوى أولاً</option>';
      sel.disabled = true;
      return;
    }
    sel.disabled = false;
    sel.innerHTML = '<option value="">اختر</option>' + list.map(function (sid) {
      return '<option value="' + sid + '">' + window.MD.data.subjectName(sid, lang) + '</option>';
    }).join('');
  }

  /* ── Form reading / validation ────────────── */
  function readForm(form) {
    var fd = new FormData(form);
    var grade = String(fd.get('grade') || '');
    var g = window.MD.data.grades[grade];
    var stream = g && g.streams ? (fd.get('stream') || '') : '';
    var yearRaw = fd.get('year');
    var year = yearRaw && yearRaw !== '' ? parseInt(yearRaw, 10) : null;
    var type = String(fd.get('type') || 'lesson');
    return {
      id: String(fd.get('id') || '').trim(),
      title: String(fd.get('title') || '').trim(),
      level: String(fd.get('level') || ''),
      grade: grade,
      stream: stream || null,
      subject: String(fd.get('subject') || ''),
      type: type,
      year: year && !isNaN(year) ? year : null,
      examType: type === 'exam' ? (fd.get('examType') || null) : null,
      keywords: String(fd.get('keywords') || '').split(',')
        .map(function (s) { return s.trim(); }).filter(Boolean),
      fileUrl: form.__pdfFileUrl || null
    };
  }
  semester: type === 'exam' ? null : (function(){
  var v = fd.get('semester');
  return v && v !== '' ? Number(v) : null;
})()

  function validateDraft(r, drafts, opts) {
    opts = opts || {};
    if (!r.title) return 'العنوان ضروري.';
    if (!r.level) return 'اختر السلك.';
    if (!r.grade) return 'اختر المستوى.';
    var g = window.MD.data.grades[r.grade];
    if (g && g.streams && !r.stream) return 'اختر الشعبة.';
    if (!r.subject) return 'اختر المادة.';
    if (!r.id) return 'أدخل المعرف (id).';
    if (!/^[a-zA-Z0-9_-]+$/.test(r.id)) return 'المعرف يجب أن يحتوي فقط أحرف/أرقام/شرطة.';
    var taken = (window.MD.data.resources || []).concat(drafts || []).some(function (x) {
      if (opts.editingIndex != null && drafts[opts.editingIndex] && x === drafts[opts.editingIndex]) return false;
      return x.id === r.id;
    });
    if (taken) return 'هذا المعرف مستخدم سابقاً: ' + r.id;
    return null;
  }

  /* ── Rendering helpers ────────────────────── */
  function renderPreview(r, lang) {
    var box = document.getElementById('dev-preview-row');
    if (!box) return;
    if (!r || !r.title || !r.subject) {
      box.innerHTML = '<p class="field__hint">املأ النموذج لمعاينة الشكل النهائي.</p>';
      return;
    }
    try {
      var realLang = window.MD.state.getLang();
      if (lang && lang !== realLang) window.MD.state.setLang(lang);
      var html = window.MD.components.resourceRow(r);
      if (lang && lang !== realLang) window.MD.state.setLang(realLang);
      box.innerHTML = '<div class="resource-list">' + html + '</div>';
    } catch (e) {
      box.innerHTML = '<p class="field__hint">اختر مادة مناسبة للمشاهدة.</p>';
    }
  }

  function renderStats(drafts) {
    var byType = { lesson: 0, exercise: 0, homework: 0, exam: 0 };
    var byLevel = { college: 0, lycee: 0 };
    var withPdf = 0;
    drafts.forEach(function (r) {
      if (byType[r.type] != null) byType[r.type]++;
      if (byLevel[r.level] != null) byLevel[r.level]++;
      if (r.fileUrl) withPdf++;
    });
    var el = function (id) { return document.getElementById(id); };
    if (el('stat-total'))    el('stat-total').textContent = String(drafts.length);
    if (el('stat-lessons'))  el('stat-lessons').textContent = String(byType.lesson);
    if (el('stat-exercises'))el('stat-exercises').textContent = String(byType.exercise);
    if (el('stat-homeworks'))el('stat-homeworks').textContent = String(byType.homework);
    if (el('stat-exams'))    el('stat-exams').textContent = String(byType.exam);
    if (el('stat-college'))  el('stat-college').textContent = String(byLevel.college);
    if (el('stat-lycee'))    el('stat-lycee').textContent = String(byLevel.lycee);
    if (el('stat-pdfs'))     el('stat-pdfs').textContent = String(withPdf);
  }

  function renderDrafts(drafts, editingIndex) {
    var list = document.getElementById('dev-list');
    var count = document.getElementById('dev-count');
    var code = document.getElementById('dev-code');
    if (count) count.textContent = String(drafts.length);

    if (list) {
      if (!drafts.length) {
        list.innerHTML = '<p class="field__hint">لم يتم إضافة أي محتوى بعد.</p>';
      } else {
        list.innerHTML = drafts.map(function (r, i) {
          var isEditing = i === editingIndex;
          var pdfBadge = r.fileUrl
            ? '<span class="badge badge--brand dev-draft-pdf">' + window.MD.components.icon('file', 'icon--sm') + ' PDF</span>'
            : '';
          return ''
            + '<div class="dev-draft-row' + (isEditing ? ' is-editing' : '') + '">'
            +   '<div class="resource-list">' + window.MD.components.resourceRow(r) + '</div>'
            +   '<div class="dev-draft-actions">'
            +     pdfBadge
            +     '<button type="button" class="btn btn--ghost btn--icon btn--sm dev-edit" data-i="' + i + '" aria-label="تعديل" title="تعديل">'
            +       window.MD.components.icon('file', 'icon--sm')
            +     '</button>'
            +     '<button type="button" class="btn btn--ghost btn--icon btn--sm dev-copy-row" data-i="' + i + '" aria-label="نسخ السطر" title="نسخ السطر">'
            +       window.MD.components.icon('check', 'icon--sm')
            +     '</button>'
            +     '<button type="button" class="btn btn--ghost btn--icon btn--sm dev-remove" data-i="' + i + '" aria-label="حذف" title="حذف">'
            +       window.MD.components.icon('close', 'icon--sm')
            +     '</button>'
            +   '</div>'
            + '</div>';
        }).join('');
      }
    }

    if (code) {
      code.textContent = drafts.length
        ? '  /* Added via dev panel */\n' + drafts.map(toCodeLine).join('\n')
        : '';
    }

    renderStats(drafts);
  }

  function renderSearchResults(q) {
    var box = document.getElementById('dev-search-results');
    if (!box) return;
    if (!q || q.length < 2) {
      box.innerHTML = '<p class="field__hint">اكتب حرفين على الأقل للبحث في الموارد الحالية.</p>';
      return;
    }
    var res = window.MD.search.search(q, {});
    var results = (res.results || []).slice(0, 20);
    if (!results.length) {
      box.innerHTML = '<p class="field__hint">لا توجد نتائج.</p>';
      return;
    }
    box.innerHTML = '<div class="dev-existing-list">' + results.map(function (r) {
      return ''
        + '<div class="dev-existing-row">'
        +   '<div class="dev-existing-info">'
        +     '<span class="dev-existing-title">' + r.title + '</span>'
        +     '<span class="dev-existing-meta">'
        +       r.id + ' · '
        +       window.MD.data.subjectName(r.subject, 'ar') + ' · '
        +       window.MD.data.gradeName(r.grade, 'ar')
        +     '</span>'
        +   '</div>'
        +   '<button type="button" class="btn btn--secondary btn--sm" data-clone-id="' + r.id + '">'
        +     'نسخ إلى النموذج'
        +   '</button>'
        + '</div>';
    }).join('') + '</div>';
  }

  /* ── PDF preview ──────────────────────────── */
  function fmtBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1024 / 1024).toFixed(2) + ' MB';
  }

  function renderPdfPreview(file) {
    return new Promise(function (resolve, reject) {
      if (!window.pdfjsLib) return reject(new Error('PDF.js غير محمّل'));
      var reader = new FileReader();
      reader.onload = function () {
        var data = new Uint8Array(reader.result);
        window.pdfjsLib.getDocument({ data: data }).promise
          .then(function (pdf) { return pdf.getPage(1); })
          .then(function (page) {
            var canvas = document.getElementById('dev-pdf-canvas');
            if (!canvas) return resolve();
            var viewport = page.getViewport({ scale: 0.6 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            var ctx = canvas.getContext('2d');
            page.render({ canvasContext: ctx, viewport: viewport }).promise.then(resolve).catch(reject);
          })
          .catch(reject);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /* ── Page HTML ────────────────────────────── */
  function devPage() {
    var t = window.MD.i18n.t;
    var C = window.MD.components;

    var levelOpts = ['college', 'lycee'].map(function (level) {
      return '<option value="' + level + '">' + t('nav.' + level) + '</option>';
    }).join('');

    var typeOpts = ['lesson', 'exercise', 'homework', 'exam'].map(function (tp) {
      return '<option value="' + tp + '">' + t('type.' + tp) + '</option>';
    }).join('');

    var examTypeOpts = '<option value="">–</option>' + ['national', 'regional', 'local'].map(function (et) {
      return '<option value="' + et + '">' + t('examType.' + et) + '</option>';
    }).join('');

    return ''
      + C.navbar(null)
      + '<main id="view">'
      + '<section class="page dev-page">'
      +   '<div class="container">'

      +     '<header class="page__head">'
      +       '<h1 class="page__title">لوحة المطور</h1>'
      +       '<p class="page__sub">أضف، عدّل، استورد، وصدّر محتوى المنصة. الموقع ثابت (static)، لذا بعد الإضافة انسخ الكود إلى <code>data.js</code> وأعد النشر.</p>'
      +     '</header>'

      /* ── STATS ── */
      +     '<div class="dev-stats">'
      +       statCard('stat-total',    'الكل')
      +       statCard('stat-lessons',  'الدروس')
      +       statCard('stat-exercises','التمارين')
      +       statCard('stat-homeworks','الفروض')
      +       statCard('stat-exams',    'الامتحانات')
      +       statCard('stat-college',  'إعدادي')
      +       statCard('stat-lycee',    'ثانوي')
      +       statCard('stat-pdfs',     'PDF')
      +     '</div>'

      /* ── FORM + PREVIEW ── */
      +     '<div class="dev-grid">'
      +       '<form class="card dev-form" id="dev-form" novalidate>'

      +         '<div class="field">'
      +           '<label class="field__label" for="dev-title">العنوان *</label>'
      +           '<input class="input" type="text" id="dev-title" name="title" required placeholder="مثال: الاشتقاق وتطبيقاته">'
      +         '</div>'

      +         '<div class="cluster">'
      +           '<div class="field" style="flex:1 1 160px">'
      +             '<label class="field__label" for="dev-level">السلك *</label>'
      +             '<select class="input" id="dev-level" name="level"><option value="">اختر</option>' + levelOpts + '</select>'
      +           '</div>'
      +           '<div class="field" style="flex:1 1 160px">'
      +             '<label class="field__label" for="dev-grade">المستوى *</label>'
      +             '<select class="input" id="dev-grade" name="grade" disabled><option value="">اختر السلك أولاً</option></select>'
      +           '</div>'
      +         '</div>'

      +         '<div class="field" id="dev-stream-field" hidden>'
      +           '<label class="field__label" for="dev-stream">الشعبة *</label>'
      +           '<select class="input" id="dev-stream" name="stream"></select>'
      +         '</div>'

      +         '<div class="field">'
      +           '<label class="field__label" for="dev-subject">المادة *</label>'
      +           '<select class="input" id="dev-subject" name="subject" disabled><option value="">اختر المستوى أولاً</option></select>'
      +         '</div>'

      +         '<div class="cluster">'
      +           '<div class="field" style="flex:1 1 160px">'
      +             '<label class="field__label" for="dev-type">النوع *</label>'
      +             '<select class="input" id="dev-type" name="type">' + typeOpts + '</select>'
      +           '</div>'
      +           '<div class="field" style="flex:1 1 160px">'
      +             '<label class="field__label" for="dev-year">السنة (اختياري)</label>'
      +             '<input class="input" type="number" id="dev-year" name="year" placeholder="2024">'
      +           '</div>'
      +         '</div>'

      +         '<div class="field" id="dev-examtype-field" hidden>'
      +           '<label class="field__label" for="dev-examtype">نوع الامتحان</label>'
      +           '<select class="input" id="dev-examtype" name="examType">' + examTypeOpts + '</select>'
      +         '</div>'
       + '<div class="field" id="dev-semester-field" hidden>'
+   '<label class="field__label" for="dev-semester">الفصل الدراسي</label>'
+   '<select class="input" id="dev-semester" name="semester">'
+     '<option value="">—</option>'
+     '<option value="1">الدورة الأولى</option>'
+     '<option value="2">الدورة الثانية</option>'
+   '</select>'
+ '</div>'
      +         '<div class="field">'
      +           '<label class="field__label" for="dev-keywords">كلمات مفتاحية (مفصولة بفواصل)</label>'
      +           '<input class="input" type="text" id="dev-keywords" name="keywords" placeholder="مثال: الاشتقاق, derivation">'
      +         '</div>'

      +         '<div class="field">'
      +           '<label class="field__label" for="dev-id">المعرف (id) *</label>'
      +           '<input class="input" type="text" id="dev-id" name="id">'
      +         '</div>'

      +         '<p class="field__hint dev-error" id="dev-error" hidden></p>'

      +         '<div class="cluster" style="margin-block-start: var(--space-2);">'
      +           '<button type="submit" class="btn btn--primary" id="dev-submit">'
      +             C.icon('check', 'icon--sm') + ' <span id="dev-submit-label">أضف إلى القائمة</span>'
      +           '</button>'
      +           '<button type="button" class="btn btn--ghost" id="dev-reset">تفريغ النموذج</button>'
      +           '<button type="button" class="btn btn--ghost" id="dev-cancel-edit" hidden>إلغاء التعديل</button>'
      +         '</div>'
      +       '</form>'

      +       '<div class="card dev-preview">'
      +         '<div class="card__head">'
      +           '<h3 class="card__title">معاينة مباشرة</h3>'
      +           '<div class="dev-preview-langs">'
      +             langBtn('ar', 'ع')
      +             langBtn('fr', 'FR')
      +             langBtn('en', 'EN')
      +           '</div>'
      +         '</div>'
      +         '<div id="dev-preview-row"><p class="field__hint">املأ النموذج لمعاينة الشكل النهائي.</p></div>'
      +       '</div>'
      +     '</div>'

      /* ── PDF UPLOAD ── */
      +     '<div class="card dev-pdf">'
      +       '<div class="card__head">'
      +         '<h3 class="card__title">ملف PDF (اختياري)</h3>'
      +         '<span class="badge badge--outline" id="dev-pdf-status">لا يوجد ملف</span>'
      +       '</div>'
      +       '<p class="field__hint">اختر ملف PDF. ستحصل على اسم مُقترح ومسار نهائي. حمّل الملف بالاسم الصحيح ثم انقله إلى مجلد <code>' + PDF_DIR + '</code> في مشروعك.</p>'

      +       '<div class="dev-drop" id="dev-drop" tabindex="0" role="button" aria-label="رفع ملف PDF">'
      +         '<input type="file" id="dev-pdf-input" accept="application/pdf,.pdf" hidden>'
      +         '<div class="dev-drop__icon">' + C.icon('file', 'icon--xl') + '</div>'
      +         '<p class="dev-drop__title">اسحب ملف PDF هنا أو انقر للاختيار</p>'
      +         '<p class="dev-drop__hint">.pdf فقط — الحد الأقصى 20 ميجابايت</p>'
      +       '</div>'

      +       '<div class="dev-pdf-info" id="dev-pdf-info" hidden>'
      +         '<div class="dev-pdf-info__preview"><canvas id="dev-pdf-canvas"></canvas></div>'
      +         '<div class="dev-pdf-info__meta">'
      +           '<div class="dev-pdf-info__row"><span class="dev-pdf-info__label">الاسم الأصلي</span><strong id="dev-pdf-original" class="dev-pdf-info__value"></strong></div>'
      +           '<div class="dev-pdf-info__row"><span class="dev-pdf-info__label">الحجم</span><strong id="dev-pdf-size" class="dev-pdf-info__value"></strong></div>'
      +           '<div class="dev-pdf-info__row"><span class="dev-pdf-info__label">الاسم المُقترح</span><code id="dev-pdf-target-name" class="dev-pdf-info__code"></code><button type="button" class="btn btn--ghost btn--sm" id="dev-pdf-copy">نسخ</button></div>'
      +           '<div class="dev-pdf-info__row"><span class="dev-pdf-info__label">المسار النهائي</span><code id="dev-pdf-target-path" class="dev-pdf-info__code"></code></div>'
      +         '</div>'
      +       '</div>'

      +       '<div class="dev-pdf-actions" id="dev-pdf-actions" hidden>'
      +         '<button type="button" class="btn btn--accent btn--sm" id="dev-pdf-download">' + C.icon('download', 'icon--sm') + ' تحميل بالاسم الصحيح</button>'
      +         '<button type="button" class="btn btn--ghost btn--sm" id="dev-pdf-clear">إزالة</button>'
      +       '</div>'

      +       '<ol class="dev-pdf-steps">'
      +         '<li>اختر الملف أعلاه.</li>'
      +         '<li>اضغط "تحميل بالاسم الصحيح".</li>'
      +         '<li>انقل الملف المُحمّل إلى <code>' + PDF_DIR + '</code> في مشروعك.</li>'
      +         '<li>احفظ المسودة.</li>'
      +         '<li>ارفع المشروع إلى Git — Vercel سينشر كل شيء تلقائياً.</li>'
      +       '</ol>'
      +     '</div>'

      /* ── DRAFTS ── */
      +     '<div class="card dev-drafts">'
      +       '<div class="card__head">'
      +         '<h3 class="card__title">المحتوى المُعدّ في هذه الجلسة <span id="dev-count" class="badge badge--brand">0</span></h3>'
      +         '<div class="cluster">'
      +           '<button class="btn btn--secondary btn--sm" id="dev-backup">نسخة احتياطية</button>'
      +           '<button class="btn btn--secondary btn--sm" id="dev-restore">استعادة</button>'
      +           '<button class="btn btn--ghost btn--sm" id="dev-clear">تفريغ الكل</button>'
      +         '</div>'
      +       '</div>'
      +       '<div id="dev-list"><p class="field__hint">لم يتم إضافة أي محتوى بعد.</p></div>'
      +     '</div>'

      /* ── IMPORT ── */
      +     '<div class="card dev-import">'
      +       '<div class="card__head">'
      +         '<h3 class="card__title">استيراد JSON</h3>'
      +         '<button class="btn btn--accent btn--sm" id="dev-import-btn">' + C.icon('file', 'icon--sm') + ' استيراد</button>'
      +       '</div>'
      +       '<p class="field__hint">الصق مصفوفة JSON. حقول اختيارية: <code>examType</code>, <code>fileUrl</code>.</p>'
      +       '<textarea id="dev-import-area" class="input" rows="6" placeholder=\'[{"title": "الاشتقاق", "level": "lycee", "grade": "2bac", "stream": "2bac-pc", "subject": "math", "type": "lesson"}]\'></textarea>'
      +       '<p class="field__hint dev-error" id="dev-import-error" hidden></p>'
      +     '</div>'

      /* ── SEARCH EXISTING ── */
      +     '<div class="card dev-search">'
      +       '<div class="card__head"><h3 class="card__title">البحث في الموارد الحالية</h3></div>'
      +       '<input type="search" id="dev-search-input" class="input" placeholder="ابحث عن درس، تمرين، امتحان...">'
      +       '<div id="dev-search-results" style="margin-block-start:var(--space-4)"><p class="field__hint">اكتب حرفين على الأقل للبحث في الموارد الحالية.</p></div>'
      +     '</div>'

      /* ── EXPORT ── */
      +     '<div class="card dev-export">'
      +       '<div class="card__head">'
      +         '<h3 class="card__title">الكود الجاهز لـ <code>data.js</code></h3>'
      +         '<button class="btn btn--accent btn--sm" id="dev-copy">' + C.icon('file', 'icon--sm') + ' نسخ الكود</button>'
      +       '</div>'
      +       '<pre id="dev-code" class="dev-code"></pre>'
      +       '<p class="field__hint">انسخ هذه الأسطر داخل مصفوفة <code>RESOURCES</code> في <code>data.js</code>، ثم أعد النشر.</p>'
      +     '</div>'
      + '<button class="btn btn--primary btn--sm" id="dev-download-data">' + C.icon('download', 'icon--sm') + ' تنزيل data.js كامل</button>'
      +   '</div>'
      + '</section>'
      + '</main>'
      + C.footer();
  }

  function statCard(id, label) {
    return '<div class="dev-stat"><span class="dev-stat__value" id="' + id + '">0</span><span class="dev-stat__label">' + label + '</span></div>';
  }
  function langBtn(code, text) {
    return '<button type="button" class="dev-lang-btn" data-preview-lang="' + code + '">' + text + '</button>';
  }

  /* ── Wiring ───────────────────────────────── */
document.getElementById('dev-download-data').addEventListener('click', function () {
  downloadFullDataJs(drafts);
});

function downloadFullDataJs(drafts) {
  var all = (window.MD.data.resources || []).concat(drafts);
  var lines = all.map(toCodeLine).join('\n');
  var D = window.MD.data;
  var header = '/* data.js — generated ' + new Date().toISOString().slice(0, 10)
    + ' — ' + all.length + ' resources */\n';
  var body = '(function () {\n  \'use strict\';\n\n'
    + '  var SUBJECTS = ' + JSON.stringify(D.subjects, null, 2) + ';\n\n'
    + '  var GRADES = ' + JSON.stringify(D.grades, null, 2) + ';\n\n'
    + '  var STREAMS = ' + JSON.stringify(D.streams, null, 2) + ';\n\n'
    + '  var R = function (id, title, level, grade, stream, subject, type, year, keywords, examType, fileUrl, semester) {\n'
    + '    return { id: id, title: title, level: level, grade: grade, stream: stream || null,\n'
    + '             subject: subject, type: type, year: year || null, examType: examType || null,\n'
    + '             keywords: keywords || [], fileUrl: fileUrl || null, semester: semester || null };\n'
    + '  };\n\n'
    + '  var RESOURCES = [\n' + lines + '\n  ];\n\n'
    + '  window.MD = window.MD || {};\n'
    + '  window.MD.data = {\n'
    + '    subjects: SUBJECTS, grades: GRADES, streams: STREAMS, resources: RESOURCES,\n'
    + '    subjectName: function (id, l) { var s = SUBJECTS[id]; return s ? (s[l] || s.ar) : id; },\n'
    + '    gradeName: function (id, l) { var g = GRADES[id]; return g ? (g[l] || g.ar) : id; },\n'
    + '    streamName: function (id, l) { var s = STREAMS[id]; return s ? (s[l] || s.ar) : id; },\n'
    + '    resourcesFor: function (f) {\n'
    + '      return RESOURCES.filter(function (r) {\n'
    + '        if (f.level && r.level !== f.level) return false;\n'
    + '        if (f.grade && r.grade !== f.grade) return false;\n'
    + '        if (f.stream && r.stream !== f.stream) return false;\n'
    + '        if (f.subject && r.subject !== f.subject) return false;\n'
    + '        if (f.type && r.type !== f.type) return false;\n'
    + '        if (f.semester && String(r.semester) !== String(f.semester)) return false;\n'
    + '        if (f.year && String(r.year) !== String(f.year)) return false;\n'
    + '        return true;\n'
    + '      });\n'
    + '    },\n'
    + '    years: function () {\n'
    + '      var s = {};\n'
    + '      RESOURCES.forEach(function (r) { if (r.year) s[r.year] = 1; });\n'
    + '      return Object.keys(s).map(Number).sort(function (a, b) { return b - a; });\n'
    + '    }\n'
    + '  };\n'
    + '})();\n';

  var blob = new Blob([header + body], { type: 'application/javascript' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}
    /* PDF state */
    var pdfFile = null;           // File object (in-memory)
    var pdfBlobUrl = null;        // for cleanup

    function targetName() {
      var id = idInput.value.trim() || 'resource';
      return id + '.pdf';
    }
    function targetPath() { return PDF_DIR + targetName(); }

    function updatePreview() { renderPreview(readForm(form), previewLang); }
    function syncId() { if (editingIndex == null) idInput.value = nextId(drafts); }

    function resetPdf(keepUrl) {
      pdfFile = null;
      if (pdfBlobUrl) { URL.revokeObjectURL(pdfBlobUrl); pdfBlobUrl = null; }
      if (!keepUrl) form.__pdfFileUrl = null;
      var info = document.getElementById('dev-pdf-info');
      var actions = document.getElementById('dev-pdf-actions');
      var status = document.getElementById('dev-pdf-status');
      var drop = document.getElementById('dev-drop');
      if (info) info.hidden = true;
      if (actions) actions.hidden = true;
      if (drop) drop.hidden = false;
      if (status) {
        var existing = form.__pdfFileUrl;
        status.textContent = existing ? ('مرتبط: ' + existing) : 'لا يوجد ملف';
        status.className = 'badge ' + (existing ? 'badge--brand' : 'badge--outline');
      }
    }

    function resetForm() {
      form.reset();
      populateGrades(null);
      populateStreams(null);
      populateSubjects(null, null);
      examField.hidden = true;
      errorBox.hidden = true;
      editingIndex = null;
      submitLabel.textContent = 'أضف إلى القائمة';
      cancelBtn.hidden = true;
      form.__pdfFileUrl = null;
      resetPdf(false);
      syncId();
      updatePreview();
      renderDrafts(drafts, editingIndex);
    }

    function handlePdfFile(file) {
      if (!file) return;
      if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
        errorBox.hidden = false;
        errorBox.textContent = '⚠ الملف يجب أن يكون PDF.';
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        errorBox.hidden = false;
        errorBox.textContent = '⚠ الحد الأقصى 20 ميجابايت.';
        return;
      }
      errorBox.hidden = true;
      pdfFile = file;
      form.__pdfFileUrl = targetPath();

      document.getElementById('dev-pdf-original').textContent = file.name;
      document.getElementById('dev-pdf-size').textContent = fmtBytes(file.size);
      document.getElementById('dev-pdf-target-name').textContent = targetName();
      document.getElementById('dev-pdf-target-path').textContent = targetPath();

      document.getElementById('dev-pdf-info').hidden = false;
      document.getElementById('dev-pdf-actions').hidden = false;
      document.getElementById('dev-drop').hidden = true;

      var status = document.getElementById('dev-pdf-status');
      status.textContent = 'جاهز للرفع';
      status.className = 'badge badge--accent';

      renderPdfPreview(file).catch(function (err) {
        console.warn('[pdf] preview failed', err);
        var canvas = document.getElementById('dev-pdf-canvas');
        if (canvas) {
          canvas.width = 200; canvas.height = 260;
          var ctx = canvas.getContext('2d');
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-muted') || '#eee';
          ctx.fillRect(0, 0, 200, 260);
          ctx.fillStyle = '#999';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('PDF', 100, 130);
        }
      });

      updatePreview();
    }

    /* Initial */
    renderDrafts(drafts, editingIndex);
    syncId();
    resetPdf(false);

    /* Cascade */
    levelSel.addEventListener('change', function () {
      populateGrades(levelSel.value);
      populateStreams(null);
      populateSubjects(null, null);
      updatePreview();
    });
    gradeSel.addEventListener('change', function () {
      populateStreams(gradeSel.value);
      populateSubjects(gradeSel.value, streamSel.value);
      updatePreview();
    });
    streamSel.addEventListener('change', function () {
      populateSubjects(gradeSel.value, streamSel.value);
      updatePreview();
    });
    typeSel.addEventListener('change', function () {
      examField.hidden = typeSel.value !== 'exam';
      updatePreview();
    });
    form.addEventListener('input', updatePreview);

    /* ID changes → update target PDF name */
    idInput.addEventListener('input', function () {
      if (pdfFile) {
        form.__pdfFileUrl = targetPath();
        document.getElementById('dev-pdf-target-name').textContent = targetName();
        document.getElementById('dev-pdf-target-path').textContent = targetPath();
      }
    });

    /* ── PDF drop zone ── */
    var drop = document.getElementById('dev-drop');
    var input = document.getElementById('dev-pdf-input');

    drop.addEventListener('click', function () { input.click(); });
    drop.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
    });

    ['dragenter', 'dragover'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) {
        e.preventDefault(); e.stopPropagation();
        drop.classList.add('is-drag');
      });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      drop.addEventListener(ev, function (e) {
        e.preventDefault(); e.stopPropagation();
        drop.classList.remove('is-drag');
      });
    });
    drop.addEventListener('drop', function (e) {
      var files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) handlePdfFile(files[0]);
    });
    input.addEventListener('change', function () {
      if (input.files && input.files[0]) handlePdfFile(input.files[0]);
    });

    document.getElementById('dev-pdf-clear').addEventListener('click', function () {
      form.__pdfFileUrl = null;
      resetPdf(false);
      updatePreview();
    });

    document.getElementById('dev-pdf-copy').addEventListener('click', function () {
      var name = targetName();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(name).then(function () {
          var btn = document.getElementById('dev-pdf-copy');
          var old = btn.textContent;
          btn.textContent = '✓';
          setTimeout(function () { btn.textContent = old; }, 1200);
        });
      }
    });

    document.getElementById('dev-pdf-download').addEventListener('click', function () {
      if (!pdfFile) return;
      var url = URL.createObjectURL(pdfFile);
      var a = document.createElement('a');
      a.href = url;
      a.download = targetName();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });

    /* ── Submit ── */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = readForm(form);
      var err = validateDraft(r, drafts, { editingIndex: editingIndex });
      if (err) {
        errorBox.hidden = false;
        errorBox.textContent = '⚠ ' + err;
        return;
      }
      errorBox.hidden = true;
      if (editingIndex != null) {
        drafts[editingIndex] = r;
      } else {
        drafts.push(r);
      }
      saveDrafts(drafts);
      resetForm();
    });

    /* Preview lang buttons */
    document.querySelectorAll('[data-preview-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        previewLang = btn.getAttribute('data-preview-lang');
        document.querySelectorAll('[data-preview-lang]').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        updatePreview();
      });
    });
    document.querySelectorAll('[data-preview-lang]').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-preview-lang') === previewLang);
    });

    /* Reset / cancel */
    document.getElementById('dev-reset').addEventListener('click', resetForm);
    cancelBtn.addEventListener('click', resetForm);

    /* Clear all */
    document.getElementById('dev-clear').addEventListener('click', function () {
      if (!drafts.length) return;
      if (!window.confirm('حذف كل المحتوى المُعدّ في هذه الجلسة؟')) return;
      drafts = [];
      saveDrafts(drafts);
      resetForm();
    });

    /* Draft actions */
    document.getElementById('dev-list').addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('button');
      if (!btn) return;
      var i = Number(btn.getAttribute('data-i'));

      if (btn.classList.contains('dev-remove')) {
        if (!window.confirm('حذف هذا العنصر؟')) return;
        drafts.splice(i, 1);
        saveDrafts(drafts);
        if (editingIndex === i) resetForm(); else renderDrafts(drafts, editingIndex);
        return;
      }
      if (btn.classList.contains('dev-edit')) {
        editingIndex = i;
        var d = drafts[i];
        document.getElementById('dev-title').value = d.title || '';
        levelSel.value = d.level || '';
        populateGrades(d.level);
        gradeSel.value = d.grade || '';
        populateStreams(d.grade);
        if (d.stream) streamSel.value = d.stream;
        populateSubjects(d.grade, d.stream);
        document.getElementById('dev-subject').value = d.subject || '';
        typeSel.value = d.type || 'lesson';
        examField.hidden = typeSel.value !== 'exam';
        document.getElementById('dev-examtype').value = d.examType || '';
        document.getElementById('dev-year').value = d.year != null ? d.year : '';
        document.getElementById('dev-keywords').value = (d.keywords || []).join(', ');
        idInput.value = d.id || '';
        form.__pdfFileUrl = d.fileUrl || null;
        resetPdf(true); // keep the URL but clear the in-memory file
        submitLabel.textContent = 'حفظ التعديلات';
        cancelBtn.hidden = false;
        renderDrafts(drafts, editingIndex);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updatePreview();
        return;
      }
      if (btn.classList.contains('dev-copy-row')) {
        var code = toCodeLine(drafts[i]);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(function () {
            btn.classList.add('is-ok');
            setTimeout(function () { btn.classList.remove('is-ok'); }, 900);
          });
        }
        return;
      }
    });

    /* Copy all */
    document.getElementById('dev-copy').addEventListener('click', function () {
      var code = document.getElementById('dev-code').textContent;
      if (!code) return;
      var self = this;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
          self.textContent = '✓ تم النسخ';
          setTimeout(function () {
            self.innerHTML = window.MD.components.icon('file', 'icon--sm') + ' نسخ الكود';
          }, 1500);
        });
      }
    });

    /* Import */
    document.getElementById('dev-import-btn').addEventListener('click', function () {
      var area = document.getElementById('dev-import-area');
      var errBox = document.getElementById('dev-import-error');
      errBox.hidden = true;
      var raw = area.value.trim();
      if (!raw) { errBox.hidden = false; errBox.textContent = '⚠ الصندوق فارغ.'; return; }
      var parsed;
      try { parsed = JSON.parse(raw); }
      catch (e) { errBox.hidden = false; errBox.textContent = '⚠ JSON غير صالح: ' + e.message; return; }
      if (!Array.isArray(parsed)) { errBox.hidden = false; errBox.textContent = '⚠ يجب أن تكون مصفوفة.'; return; }
      var added = 0;
      parsed.forEach(function (item) {
        if (!item || typeof item !== 'object') return;
        semester: item.semester != null ? Number(item.semester) : null,
        var r = {
          id: String(item.id || '').trim() || nextId(drafts),
          title: String(item.title || '').trim(),
          level: String(item.level || '').trim(),
          grade: String(item.grade || '').trim(),
          stream: item.stream || null,
          subject: String(item.subject || '').trim(),
          type: String(item.type || 'lesson').trim(),
          year: item.year != null ? Number(item.year) : null,
          examType: item.examType || null,
          keywords: Array.isArray(item.keywords) ? item.keywords.map(String) : [],
          fileUrl: item.fileUrl || null
        };
        if (isIdTaken(r.id, drafts)) r.id = nextId(drafts.concat([r]));
        drafts.push(r);
        added++;
      });
      saveDrafts(drafts);
      renderDrafts(drafts, editingIndex);
      area.value = '';
      errBox.hidden = false;
      errBox.style.color = 'var(--c-success)';
      errBox.textContent = '✓ تم استيراد ' + added + ' عنصر.';
      setTimeout(function () { errBox.hidden = true; errBox.style.color = ''; }, 2500);
    });

    /* Search existing */
    var searchInput = document.getElementById('dev-search-input');
    var searchTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var q = searchInput.value;
      searchTimer = setTimeout(function () { renderSearchResults(q); }, 120);
    });
    document.getElementById('dev-search-results').addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-clone-id]');
      if (!btn) return;
      var id = btn.getAttribute('data-clone-id');
      var found = (window.MD.data.resources || []).filter(function (x) { return x.id === id; })[0];
      if (!found) return;
      editingIndex = null;
      submitLabel.textContent = 'أضف إلى القائمة';
      cancelBtn.hidden = true;
      document.getElementById('dev-title').value = found.title || '';
      levelSel.value = found.level || '';
      populateGrades(found.level);
      gradeSel.value = found.grade || '';
      populateStreams(found.grade);
      if (found.stream) streamSel.value = found.stream;
      populateSubjects(found.grade, found.stream);
      document.getElementById('dev-subject').value = found.subject || '';
      typeSel.value = found.type || 'lesson';
      examField.hidden = typeSel.value !== 'exam';
      document.getElementById('dev-examtype').value = found.examType || '';
      document.getElementById('dev-year').value = found.year != null ? found.year : '';
      document.getElementById('dev-keywords').value = (found.keywords || []).join(', ');
      idInput.value = nextId(drafts);
      form.__pdfFileUrl = found.fileUrl || null;
      resetPdf(true);
      updatePreview();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* Backup / Restore */
    document.getElementById('dev-backup').addEventListener('click', function () {
      var blob = new Blob([JSON.stringify(drafts, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'md-drafts-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    document.getElementById('dev-restore').addEventListener('click', function () {
      var inputEl = document.createElement('input');
      inputEl.type = 'file';
      inputEl.accept = 'application/json,.json';
      inputEl.addEventListener('change', function () {
        var f = inputEl.files && inputEl.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var list = JSON.parse(reader.result);
            if (!Array.isArray(list)) throw new Error('Not an array');
            if (!window.confirm('استبدال المسودات الحالية بـ ' + list.length + ' عنصر؟')) return;
            drafts = list;
            saveDrafts(drafts);
            renderDrafts(drafts, editingIndex);
          } catch (e) { window.alert('ملف غير صالح: ' + e.message); }
        };
        reader.readAsText(f);
      });
      inputEl.click();
    });
  }

  function isDevRoute() { return location.hash === '#/dev'; }

  document.addEventListener('route:mounted', function () {
    if (isDevRoute()) wireDevForm();
  });

  window.MD = window.MD || {};
  window.MD.pages = window.MD.pages || {};
  window.MD.pages.dev = devPage;
})();