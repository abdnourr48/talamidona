/* data.js — Moroccan educational structure + sample resources */
(function () {
  'use strict';

  /* ── Subjects ─────────────────────────────────── */
  var SUBJECTS = {
    math:       { ar: 'الرياضيات',          fr: 'Mathématiques',      en: 'Mathematics',        icon: 'calculator' },
    physique:   { ar: 'الفيزياء والكيمياء',  fr: 'Physique-Chimie',    en: 'Physics & Chemistry', icon: 'atom' },
    svt:        { ar: 'علوم الحياة والأرض', fr: 'SVT',                en: 'Life & Earth Sciences', icon: 'leaf' },
    arabe:      { ar: 'اللغة العربية',      fr: 'Arabe',              en: 'Arabic',             icon: 'book' },
    francais:   { ar: 'اللغة الفرنسية',     fr: 'Français',           en: 'French',             icon: 'book' },
    anglais:    { ar: 'اللغة الإنجليزية',   fr: 'Anglais',            en: 'English',            icon: 'book' },
    histoire:   { ar: 'التاريخ والجغرافيا', fr: 'Histoire-Géo',       en: 'History & Geography', icon: 'globe' },
    islamique:  { ar: 'التربية الإسلامية',  fr: 'Éducation Islamique', en: 'Islamic Education',  icon: 'book' },
    philo:      { ar: 'الفلسفة',            fr: 'Philosophie',        en: 'Philosophy',         icon: 'book' },
    economie:   { ar: 'الاقتصاد والتنظيم',  fr: 'Économie',           en: 'Economics',          icon: 'chart' },
    si:         { ar: 'العلوم الهندسية',    fr: 'Sciences de l\'ingénieur', en: 'Engineering',  icon: 'cog' }
  };

  /* ── Grades ───────────────────────────────────── */
  var GRADES = {
    '1ap': { level: 'college', ar: 'الأولى إعدادي', fr: '1ère Année Collège', en: '1st Year Middle School',
             subjects: ['math','physique','svt','arabe','francais','anglais','histoire','islamique'] },
    '2ap': { level: 'college', ar: 'الثانية إعدادي', fr: '2ème Année Collège', en: '2nd Year Middle School',
             subjects: ['math','physique','svt','arabe','francais','anglais','histoire','islamique'] },
    '3ap': { level: 'college', ar: 'الثالثة إعدادي', fr: '3ème Année Collège', en: '3rd Year Middle School',
             subjects: ['math','physique','svt','arabe','francais','anglais','histoire','islamique'] },

    'tc':   { level: 'lycee', ar: 'الجذوع المشتركة', fr: 'Tronc Commun', en: 'Common Core',
              streams: ['tc-sci','tc-tech','tc-lettres'] },
    '1bac': { level: 'lycee', ar: 'الأولى باكالوريا', fr: '1ère Année Bac', en: '1st Year Baccalaureate',
              streams: ['1bac-sm','1bac-pc','1bac-svt','1bac-seco','1bac-lettres'] },
    '2bac': { level: 'lycee', ar: 'الثانية باكالوريا', fr: '2ème Année Bac', en: '2nd Year Baccalaureate',
              streams: ['2bac-sm','2bac-pc','2bac-svt','2bac-seco','2bac-lettres'] }
  };

  /* ── Streams ──────────────────────────────────── */
  var STREAMS = {
    'tc-sci':     { ar: 'الجذع العلمي',           fr: 'Tronc Scientifique',  en: 'Scientific Core',
                    subjects: ['math','physique','svt','francais','anglais','arabe','islamique'] },
    'tc-tech':    { ar: 'الجذع التكنولوجي',       fr: 'Tronc Technologique', en: 'Technological Core',
                    subjects: ['math','physique','si','francais','anglais','arabe','islamique'] },
    'tc-lettres': { ar: 'الجذع الأدبي',           fr: 'Tronc Littéraire',    en: 'Literary Core',
                    subjects: ['arabe','francais','anglais','histoire','islamique','math'] },

    '1bac-sm':    { ar: 'علوم رياضية',            fr: 'Sciences Mathématiques', en: 'Mathematical Sciences',
                    subjects: ['math','physique','svt','francais','anglais','arabe','islamique','philo'] },
    '1bac-pc':    { ar: 'علوم فيزيائية',          fr: 'Sciences Physiques',  en: 'Physical Sciences',
                    subjects: ['math','physique','svt','francais','anglais','arabe','islamique','philo'] },
    '1bac-svt':   { ar: 'علوم الحياة والأرض',     fr: 'SVT',                 en: 'Life & Earth Sciences',
                    subjects: ['math','physique','svt','francais','anglais','arabe','islamique','philo'] },
    '1bac-seco':  { ar: 'علوم اقتصادية',          fr: 'Sciences Économiques', en: 'Economic Sciences',
                    subjects: ['economie','math','francais','anglais','arabe','histoire','islamique','philo'] },
    '1bac-lettres': { ar: 'الآداب والعلوم الإنسانية', fr: 'Lettres', en: 'Literature',
                    subjects: ['arabe','francais','anglais','histoire','islamique','philo','math'] },

    '2bac-sm':    { ar: 'علوم رياضية',            fr: 'Sciences Mathématiques', en: 'Mathematical Sciences',
                    subjects: ['math','physique','svt','francais','anglais','philo'] },
    '2bac-pc':    { ar: 'علوم فيزيائية',          fr: 'Sciences Physiques',  en: 'Physical Sciences',
                    subjects: ['math','physique','svt','francais','anglais','philo'] },
    '2bac-svt':   { ar: 'علوم الحياة والأرض',     fr: 'SVT',                 en: 'Life & Earth Sciences',
                    subjects: ['math','physique','svt','francais','anglais','philo'] },
    '2bac-seco':  { ar: 'علوم اقتصادية',          fr: 'Sciences Économiques', en: 'Economic Sciences',
                    subjects: ['economie','math','francais','anglais','histoire','philo'] },
    '2bac-lettres': { ar: 'الآداب والعلوم الإنسانية', fr: 'Lettres', en: 'Literature',
                    subjects: ['arabe','francais','anglais','histoire','islamique','philo'] }
  };

  /* ── Resources (indexed by search engine) ─────── */
  var R = function (id, title, level, grade, stream, subject, type, year, keywords, examType) {
    return { id: id, title: title, level: level, grade: grade, stream: stream || null,
             subject: subject, type: type, year: year || null, examType: examType || null,
             keywords: keywords || [] };
  };

  var RESOURCES = [
    R('r1',  'الاشتقاق وتطبيقاته',            'lycee','2bac','2bac-pc','math','lesson',null,['الاشتقاق','المشتقة','derivation','derivative','derivee']),
    R('r2',  'تمارين محلولة: الاشتقاق',       'lycee','2bac','2bac-pc','math','exercise',null,['الاشتقاق','تمارين','exercices']),
    R('r3',  'الدوال اللوغاريتمية',           'lycee','2bac','2bac-pc','math','lesson',null,['اللوغاريتم','logarithme','log']),
    R('r4',  'النهايات والاستمرارية',         'lycee','2bac','2bac-pc','math','lesson',null,['النهايات','limites','continuite']),
    R('r5',  'الأعداد العقدية',               'lycee','2bac','2bac-pc','math','lesson',null,['عقدية','complexes','nombres complexes']),
    R('r6',  'الامتحان الوطني 2024 — رياضيات','lycee','2bac','2bac-pc','math','exam',2024,['امتحان وطني','2024','national','math'],'national'),
    R('r7',  'الامتحان الوطني 2023 — رياضيات','lycee','2bac','2bac-pc','math','exam',2023,['امتحان وطني','2023','national'],'national'),
    R('r8',  'الامتحان الجهوي 2024',         'lycee','2bac','2bac-pc','math','exam',2024,['امتحان جهوي','regional'],'regional'),
    R('r9',  'الموجات الميكانيكية',           'lycee','2bac','2bac-pc','physique','lesson',null,['الموجات','ondes','mecaniques']),
    R('r10', 'التحولات النووية',              'lycee','2bac','2bac-pc','physique','lesson',null,['النووية','nucleaire']),
    R('r11', 'الكهرباء RLC',                  'lycee','2bac','2bac-pc','physique','lesson',null,['RLC','الكهرباء','electricite']),
    R('r12', 'تمارين الفيزياء — الفصل الأول', 'lycee','2bac','2bac-pc','physique','exercise',null,['تمارين','physique']),
    R('r13', 'الامتحان الوطني 2024 — فيزياء', 'lycee','2bac','2bac-pc','physique','exam',2024,['امتحان وطني','2024'],'national'),
    R('r14', 'الوراثة البشرية',               'lycee','2bac','2bac-pc','svt','lesson',null,['الوراثة','genetique']),
    R('r15', 'المناعة',                       'lycee','2bac','2bac-pc','svt','lesson',null,['المناعة','immunite']),
    R('r16', 'الجهاز العصبي',                 'lycee','2bac','2bac-pc','svt','lesson',null,['العصبي','nerveux']),
    R('r17', 'الامتحان الوطني 2024 — SVT',    'lycee','2bac','2bac-pc','svt','exam',2024,['امتحان وطني','2024'],'national'),
    R('r18', 'الفلسفة: الشخص',                'lycee','2bac','2bac-pc','philo','lesson',null,['الشخص','philosophie','personne']),
    R('r19', 'الفلسفة: المعرفة',              'lycee','2bac','2bac-pc','philo','lesson',null,['المعرفة','connaissance']),
    R('r20', 'منهجية الإنشاء الفلسفي',        'lycee','2bac','2bac-pc','philo','lesson',null,['منهجية','dissertation']),
    R('r21', 'المتتاليات العددية',            'lycee','2bac','2bac-sm','math','lesson',null,['المتتاليات','suites']),
    R('r22', 'الحسابيات في Z',                'lycee','2bac','2bac-sm','math','lesson',null,['الحسابيات','arithmetique']),
    R('r23', 'الامتحان الوطني 2024 — SM',     'lycee','2bac','2bac-sm','math','exam',2024,['امتحان وطني','2024','SM'],'national'),
    R('r24', 'علوم الحياة: الوراثة',          'lycee','2bac','2bac-svt','svt','lesson',null,['الوراثة','genetique']),
    R('r25', 'الامتحان الوطني 2024 — SVT',    'lycee','2bac','2bac-svt','svt','exam',2024,['امتحان وطني','2024'],'national'),
    R('r26', 'المحاسبة العامة',               'lycee','2bac','2bac-seco','economie','lesson',null,['المحاسبة','comptabilite']),
    R('r27', 'الاقتصاد العام',                'lycee','2bac','2bac-seco','economie','lesson',null,['الاقتصاد','economie']),
    R('r28', 'النصوص الأدبية',                'lycee','2bac','2bac-lettres','arabe','lesson',null,['النصوص','ادب','textes']),
    R('r29', 'المنهجية: المقال الأدبي',       'lycee','2bac','2bac-lettres','arabe','lesson',null,['مقال','منهجية']),
    R('r30', 'المتتاليات العددية — 1BAC',     'lycee','1bac','1bac-pc','math','lesson',null,['المتتاليات','suites']),
    R('r31', 'المثلثات والحساب المثلثي',      'lycee','1bac','1bac-pc','math','lesson',null,['المثلثات','trigonometrie']),
    R('r32', 'الامتحان الجهوي 2024 — 1BAC',   'lycee','1bac','1bac-pc','math','exam',2024,['امتحان جهوي','regional'],'regional'),
    R('r33', 'الكيمياء العضوية',              'lycee','1bac','1bac-pc','physique','lesson',null,['العضوية','organique']),
    R('r34', 'المنطق الرياضي',                'lycee','1bac','1bac-sm','math','lesson',null,['المنطق','logique']),
    R('r35', 'المجموعات والتطبيقات',          'lycee','1bac','1bac-sm','math','lesson',null,['المجموعات','ensembles']),
    R('r36', 'النحو والصرف',                  'lycee','1bac','1bac-lettres','arabe','lesson',null,['النحو','الصرف']),
    R('r37', 'الفلسفة: مجالات الفلسفة',       'lycee','1bac','1bac-lettres','philo','lesson',null,['الفلسفة','philosophie']),
    R('r38', 'المعادلات والمتراجحات',         'lycee','tc','tc-sci','math','lesson',null,['المعادلات','equations']),
    R('r39', 'الأعداد والحساب',               'lycee','tc','tc-sci','math','lesson',null,['الأعداد','nombres']),
    R('r40', 'مبادئ الميكانيك',               'lycee','tc','tc-sci','physique','lesson',null,['الميكانيك','mecanique']),
    R('r41', 'الخلية والجزيئات الحيوية',      'lycee','tc','tc-sci','svt','lesson',null,['الخلية','cellule']),
    R('r42', 'الأعداد الجذرية',               'college','3ap',null,'math','lesson',null,['الجذرية','racines']),
    R('r43', 'مبرهنة فيتاغورس',               'college','3ap',null,'math','lesson',null,['فيتاغورس','pythagore']),
    R('r44', 'الحساب الحرفي',                 'college','3ap',null,'math','lesson',null,['الحرفي','algebrique']),
    R('r45', 'تمارين: الأعداد الجذرية',       'college','3ap',null,'math','exercise',null,['تمارين','الجذرية']),
    R('r46', 'الامتحان الجهوي 2024 — 3AP',    'college','3ap',null,'math','exam',2024,['امتحان جهوي','2024'],'regional'),
    R('r47', 'التفاعلات الكيميائية',          'college','3ap',null,'physique','lesson',null,['الكيميائية','chimie']),
    R('r48', 'الدارات الكهربائية',            'college','3ap',null,'physique','lesson',null,['الكهربائية','electriques']),
    R('r49', 'الجهاز التنفسي',                'college','3ap',null,'svt','lesson',null,['التنفسي','respiratoire']),
    R('r50', 'التغذية عند الإنسان',           'college','3ap',null,'svt','lesson',null,['التغذية','nutrition']),
    R('r51', 'قواعد اللغة العربية',           'college','3ap',null,'arabe','lesson',null,['قواعد','نحو']),
    R('r52', 'التعبير والإنشاء',              'college','3ap',null,'arabe','lesson',null,['التعبير','انشاء']),
    R('r53', 'La conjugaison française',      'college','3ap',null,'francais','lesson',null,['conjugaison','grammaire']),
    R('r54', 'English Grammar Basics',        'college','3ap',null,'anglais','lesson',null,['grammar','english']),
    R('r55', 'الأولى إعدادي — رياضيات',       'college','1ap',null,'math','lesson',null,['الرياضيات','maths']),
    R('r56', 'الثانية إعدادي — رياضيات',      'college','2ap',null,'math','lesson',null,['الرياضيات','maths']),
    R('r57', 'الثالثة إعدادي — رياضيات',      'college','3ap',null,'math','lesson',null,['الرياضيات','maths'])
  ];

  window.MD = window.MD || {};
  window.MD.data = {
    subjects: SUBJECTS,
    grades: GRADES,
    streams: STREAMS,
    resources: RESOURCES,
    subjectName: function (id, lang) {
      var s = SUBJECTS[id];
      return s ? (s[lang] || s.ar) : id;
    },
    gradeName: function (id, lang) {
      var g = GRADES[id];
      return g ? (g[lang] || g.ar) : id;
    },
    streamName: function (id, lang) {
      var s = STREAMS[id];
      return s ? (s[lang] || s.ar) : id;
    },
    resourcesFor: function (filters) {
      return RESOURCES.filter(function (r) {
        if (filters.level && r.level !== filters.level) return false;
        if (filters.grade && r.grade !== filters.grade) return false;
        if (filters.stream && r.stream !== filters.stream) return false;
        if (filters.subject && r.subject !== filters.subject) return false;
        if (filters.type && r.type !== filters.type) return false;
        if (filters.year && String(r.year) !== String(filters.year)) return false;
        return true;
      });
    },
    years: function () {
      var s = {};
      RESOURCES.forEach(function (r) { if (r.year) s[r.year] = 1; });
      return Object.keys(s).map(Number).sort(function (a, b) { return b - a; });
    }
  };
})();
