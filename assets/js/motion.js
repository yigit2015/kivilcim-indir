/* Kıvılcım sitesi: hareket katmanı.
   Açılış tarayıcının kendi Web Animations API'siyle, kütüphane beklemeden oynar. GSAP 3.15 + ScrollTrigger + SplitText
   (assets/js/vendor, GSAP standart ücretsiz lisans) ilk kare boyandıktan sonra yüklenir: ilk boyamanın yolunda JS yok.
   Yalnız transform ve opacity canlanır. Sade hareket (sistem ayarı ya da sayfadaki düğme) açıksa yalnız solma kalır.
   İçerik hareketsiz hâlde eksiksizdir: GSAP yüklenmezse ya da geç kalırsa hiçbir öğe gizli kalmaz. */
(function () {
  'use strict';
  var d = document.documentElement;
  var KV = (window.KV = window.KV || { calm: false, onMotion: function () {}, watchLoop: function () {} });
  var gsap = null;
  var ST = null;
  var Split = null;
  // <head>'deki satır hareket açıksa "intro" sınıfını koyar; 2 sn içinde buraya ulaşılmazsa sınıfı kendisi kaldırır.
  if (window.__kvIntro) clearTimeout(window.__kvIntro);
  var introPending = d.classList.contains('intro');
  var endIntro = function () { d.classList.remove('intro'); };
  var VENDOR = (document.currentScript && document.currentScript.src || '').replace(/motion\.js.*$/, 'vendor/');

  // GSAP'e bağlı olanlar (home.js'teki seri yolculuğu gibi) kütüphane gelince ya da gelemezse çalışır.
  var waiting = [];
  var ready = false;
  KV.whenGsap = function (fn) { if (ready) fn(); else waiting.push(fn); };
  function loadVendor(done) {
    var files = ['gsap.min.js', 'ScrollTrigger.min.js', 'SplitText.min.js'];
    var left = files.length;
    files.forEach(function (f) {
      var s = document.createElement('script');
      s.src = VENDOR + f;
      s.async = false; // eklenme sırasıyla çalışır
      s.onload = s.onerror = function () { if (--left === 0) done(); };
      document.head.appendChild(s);
    });
  }

  var EASE = 'expo.out';
  var EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var home = !!$('.hero');
  var listPage = !!$('.feature-grid, .release');
  var SPARK = 'M12 0.5C12.9 7.2 16.8 11.1 23.5 12C16.8 12.9 12.9 16.8 12 23.5C11.1 16.8 7.2 12.9 0.5 12C7.2 11.1 11.1 7.2 12 0.5Z';
  // Açılışta ekranda olan öğeye başlangıç durumu verilmez: ilk karede görünen şey sonradan gizlenmez.
  var below = function (n) { return n.getBoundingClientRect().top > window.innerHeight * 0.92; };
  var el = function (tag, cls) { var n = document.createElement(tag); n.className = cls; n.setAttribute('aria-hidden', 'true'); return n; };

  // ── Kor katmanları: açılışta, indirme bandında ve alt sayfa başlığında yavaşça kayan ışık ──────
  // Döngü CSS'te (compositor); ekran dışında ya da gizli sekmede durur (site.js watchLoop).
  function embers(host, extra) {
    if (!host) return null;
    var e = el('div', 'embers' + (extra ? ' ' + extra : ''));
    e.innerHTML = '<i></i><i></i><i></i>';
    host.insertBefore(e, host.firstChild);
    KV.watchLoop(e);
    return e;
  }
  var heroEmbers = embers($('.hero'));
  var headEmbers = embers($('.page-head'));
  var bandEmbers = embers($('.dl-band'), 'embers-band');

  // ── Açılış: bir kez, en çok ~1,1 sn; kütüphanesiz (Web Animations API) ─────
  // h1 ve açıklama (LCP adayları) hiç saydam olmaz, yalnız yerine oturur. Başlangıç durumları CSS'te (.intro).
  // Başlık çubuğu her sayfada aynı kalan çerçeve: sayfa geçişinde yerinde durur, açılışta canlanmaz.
  KV.introAt = introPending ? 0.3 : 0;
  var introAnims = [];
  var finishIntro = null;
  function splitWords(h) {
    // Yalnız düz metinli başlık bölünür; satır kırılması değişirse (yer kayması) geri alınır.
    if (!h || h.children.length) return null;
    var text = h.textContent;
    var h0 = h.offsetHeight;
    h.setAttribute('aria-label', text.trim());
    h.innerHTML = text.split(/(\s+)/).map(function (p) {
      return /^\s+$/.test(p) || !p ? p : '<span class="w" aria-hidden="true">' + p.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>';
    }).join('');
    var restore = function () { h.textContent = text; h.removeAttribute('aria-label'); };
    if (Math.abs(h.offsetHeight - h0) > 1) { restore(); return null; }
    return { words: $$('.w', h), restore: restore };
  }
  function intro() {
    var head = $('.hero') || $('.page-head');
    if (!introPending || !head || !Element.prototype.animate) { endIntro(); return; }
    introPending = false;
    var h1 = $('h1', head);
    var lead = $('.lead', head);
    var rest = home ? $$('.hero .cta-row, .hero .platforms-line') : $$('.page-head .wrap > :not(h1):not(.lead)');
    var hearth = $('.hearth');
    var glow = heroEmbers || headEmbers;
    var split = splitWords(h1);
    var shift = h1 ? parseFloat(getComputedStyle(h1).fontSize) * 0.3 : 0;
    var go = function (n, frames, ms, delay) {
      if (n) introAnims.push(n.animate(frames, { duration: ms, delay: delay, easing: EASE_CSS, fill: 'both' }));
    };
    if (glow) introAnims.push(glow.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1400, easing: 'ease-out', fill: 'both' }));
    if (split) {
      h1.style.transform = 'none';
      split.words.forEach(function (w, i) { go(w, [{ transform: 'translateY(' + shift + 'px)' }, { transform: 'none' }], 800, 50 + i * 40); });
    } else go(h1, [{ transform: 'translateY(' + shift + 'px)' }, { transform: 'none' }], 800, 50);
    go(lead, [{ transform: 'translateY(16px)' }, { transform: 'none' }], 800, 160);
    go(hearth, [{ opacity: 0, transform: 'translateY(20px) scale(0.96)' }, { opacity: 1, transform: 'none' }], 900, 200);
    rest.forEach(function (n, i) { go(n, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], 700, 260 + i * 60); });
    var done = false;
    finishIntro = function () {
      if (done) return;
      done = true;
      endIntro();
      introAnims.forEach(function (a) { a.cancel(); });
      introAnims = [];
      if (split) split.restore();
      if (h1) h1.style.transform = '';
    };
    Promise.all(introAnims.map(function (a) { return a.finished; })).then(finishIntro, finishIntro);
    // Sade harekete geçilirse açılış hemen biter.
    KV.onMotion(function (calm) { if (calm) finishIntro(); });
  }
  // İlk karenin boyama adımında başlar: başlığı bölerken yapılan yerleşim, boyamadan önceki işe katılır.
  if (introPending && window.requestAnimationFrame) requestAnimationFrame(intro);
  else intro();

  // ── Kaydırmada belirme: öğeler listeyse liste gibi, sırayla ────────────────
  var HOME_REVEAL = '.room-head > *, #paylas h2, #gorunum h2, #gorunum .dim, .themes, .fuse > li, .day > li, .feat > li, dl.econ > div, .ledger > div, .tones > li, .statement, #nazik .dim, .plain > li, .dl-grid > li, .installs > *, .faq > details, .keys > li, .protect > h3, .swipe-wrap, .chest, .panel.chart, .matrix tr, #macera .note, #sss > p';
  var PAGE_REVEAL = '.doc h2, .doc .feature-grid > li, .doc .feature-list > li, .doc .release, .doc > section > p';
  // Defter satırları soldan gelir; tablo satırları yalnız solar (tablo satırında transform tarayıcıya göre değişir).
  var FROM_LEFT = '.ledger > div, .tones > li';
  var FADE_ONLY = '.matrix tr';
  function revealItems(skip) {
    var sel = home ? HOME_REVEAL : listPage ? PAGE_REVEAL : null;
    if (!sel) return [];
    var items = $$(sel).filter(function (n) { return !n.closest('.hero, .page-head, .journey') && skip.indexOf(n) < 0 && below(n); });
    // İç içe seçilenlerde yalnız dıştaki canlanır.
    return items.filter(function (n) { return !items.some(function (p) { return p !== n && p.contains(n); }); });
  }
  function reveals(calm, skip) {
    var items = revealItems(skip || []);
    if (!items.length) return;
    if (calm) gsap.set(items, { opacity: 0 });
    else {
      gsap.set(items, {
        opacity: 0,
        x: function (i, n) { return n.matches(FROM_LEFT) ? -32 : 0; },
        y: function (i, n) { return n.matches(FROM_LEFT) || n.matches(FADE_ONLY) ? 0 : 24; }
      });
    }
    var show = function (list) { gsap.set(list, { opacity: 1, x: 0, y: 0, overwrite: true, clearProps: calm ? 'opacity' : 'transform,opacity' }); };
    ST.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: function (batch, triggers) {
        // Bağlantı ya da klavye sayfayı birden atlatınca geçilen öğeler beklemeden görünür;
        // ekrandakilerin sırası toplamda en çok ~0,45 sn sürer. Ölçü okunmaz: tetikleyicinin ilerlemesi yeter.
        var seen = [];
        var past = [];
        batch.forEach(function (n, i) { (triggers[i] && triggers[i].progress >= 1 ? past : seen).push(n); });
        if (past.length) show(past);
        if (!seen.length) return;
        var each = Math.min(calm ? 0.03 : 0.05, 0.45 / seen.length);
        if (calm) {
          gsap.to(seen, { opacity: 1, duration: 0.4, ease: 'power1.out', stagger: each, overwrite: true, clearProps: 'opacity' });
          return;
        }
        gsap.to(seen, { opacity: 1, x: 0, y: 0, duration: 0.7, ease: EASE, stagger: each, overwrite: true, clearProps: 'transform,opacity' });
        // Özellik simgeleri satırıyla birlikte tutuşur.
        seen.forEach(function (n, i) {
          var ico = n.matches('.feat > li') ? $('.ico', n) : null;
          if (ico) gsap.fromTo(ico, { scale: 0.5, rotation: -25 }, { scale: 1, rotation: 0, duration: 0.6, delay: 0.12 + i * each, ease: 'back.out(2)', clearProps: 'transform' });
        });
      }
    });
    // Klavye odağı henüz belirmemiş bir öğeye gelirse öğe hemen görünür: odak görünmeyen yerde kalmaz.
    var onFocus = function (e) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].contains(e.target) && gsap.getProperty(items[i], 'opacity') < 1) { show([items[i]]); return; }
      }
    };
    document.addEventListener('focusin', onFocus);
    return function () { document.removeEventListener('focusin', onFocus); };
  }

  // ── Sayaçlar: yalnız sayfada zaten yazan sayılar (data-countup), son değer HTML'de ─
  // (data-count ocağın kendi sayacı; home.js yönetir.)
  function counters(cleanups) {
    $$('[data-countup]').forEach(function (n) {
      if (!below(n)) return;
      var final = n.textContent;
      var to = parseInt(final, 10);
      if (!isFinite(to)) return;
      var sr = null;
      if (!n.closest('[aria-hidden="true"]')) {
        sr = el('span', 'sr-only');
        sr.removeAttribute('aria-hidden');
        sr.textContent = final;
        n.parentNode.insertBefore(sr, n.nextSibling);
        n.setAttribute('aria-hidden', 'true');
      }
      // Genişlik sabit kalsın: sayı büyürken yanındaki metin kaymasın (CLS).
      var inline = getComputedStyle(n).display === 'inline';
      if (inline) gsap.set(n, { display: 'inline-block', minWidth: final.length + 'ch', textAlign: 'right' });
      n.textContent = '0';
      var o = { v: 0 };
      // Grafikteki sayılar çubuklarıyla birlikte başlar, tek tek değil.
      ST.create({
        trigger: n.closest('.bars, .programs, .statement, .share-card, .phone') || n,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.to(o, { v: to, duration: 1.4, ease: 'power3.out', onUpdate: function () { n.textContent = String(Math.round(o.v)); } });
        }
      });
      cleanups.push(function () {
        n.textContent = final;
        if (sr) { sr.remove(); n.removeAttribute('aria-hidden'); }
        if (inline) gsap.set(n, { clearProps: 'display,minWidth,textAlign' });
      });
    });
  }

  // ── Grafikler: çubuklar değeriyle birlikte büyür ────────────────────────────
  function grow(host, part, prop, origin, stagger) {
    $$(host).forEach(function (h) {
      if (!below(h)) return;
      var parts = $$(part, h);
      var from = { transformOrigin: origin };
      var to = { duration: 0.9, ease: EASE, stagger: stagger, clearProps: 'transform' };
      from[prop] = 0;
      to[prop] = 1;
      gsap.set(parts, from);
      ST.create({ trigger: h, start: 'top 88%', once: true, onEnter: function () { gsap.to(parts, to); } });
    });
  }

  // ── Rozet duvarı: kazanılır gibi, ızgara sırasıyla ──────────────────────────
  function badges() {
    var wall = $('.wall');
    if (!wall || !below(wall)) return;
    var b = $$('.badge', wall);
    gsap.set(b, { opacity: 0, scale: 0.6 });
    ST.create({
      trigger: wall,
      start: 'top 82%',
      once: true,
      onEnter: function () {
        gsap.to(b, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)', stagger: { each: 0.025, grid: 'auto', from: 'start' }, clearProps: 'transform,opacity' });
      }
    });
  }

  // ── Fitil: "Nasıl çalışır" kaydırdıkça yanar, her adım sırası gelince tutuşur ──
  function fuse(desk, cleanups) {
    var list = $('.fuse');
    if (!list) return;
    var steps = $$('li', list);
    var burn = el('span', 'fuse-burn');
    var spark = el('span', 'fuse-spark');
    spark.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + SPARK + '" fill="url(#spark-g)"/></svg>';
    list.appendChild(burn);
    list.appendChild(spark);
    // Adımların çizgi üstündeki yeri yenilemede bir kez ölçülür; kaydırma karesinde ölçü okunmaz.
    var at = [];
    var measure = function () {
      var len = desk ? burn.offsetWidth : burn.offsetHeight;
      at = steps.map(function (li) { return len ? (desk ? li.offsetLeft : li.offsetTop) / len : 0; });
    };
    var light = function (p) {
      for (var i = 0; i < steps.length; i++) steps[i].classList.toggle('is-lit', p > 0 && p >= at[i] - 0.01);
    };
    measure();
    var tl = gsap.timeline({
      scrollTrigger: { trigger: list, start: 'top 75%', end: 'bottom 55%', scrub: 0.6, invalidateOnRefresh: true, onRefresh: measure },
      onUpdate: function () { light(this.progress()); }
    });
    if (desk) {
      tl.fromTo(burn, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
        .fromTo(spark, { x: 0 }, { x: function () { return burn.offsetWidth; }, ease: 'none' }, 0);
    } else {
      tl.fromTo(burn, { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0)
        .fromTo(spark, { y: 0 }, { y: function () { return burn.offsetHeight; }, ease: 'none' }, 0);
    }
    cleanups.push(function () {
      burn.remove();
      spark.remove();
      steps.forEach(function (li) { li.classList.remove('is-lit'); });
    });
  }

  // ── İndirme bandı: sahne yükselir ve genişler ───────────────────────────────
  function band(cleanups) {
    var b = $('.dl-band');
    if (!b) return;
    var bg = el('div', 'band-bg');
    b.insertBefore(bg, b.firstChild);
    b.classList.add('has-stage');
    gsap.fromTo(bg, { scaleX: 0.94, y: 40 }, { scaleX: 1, y: 0, ease: 'none', scrollTrigger: { trigger: b, start: 'top bottom', end: 'top 35%', scrub: 0.6 } });
    cleanups.push(function () { bg.remove(); b.classList.remove('has-stage'); });
  }

  // ── Parallax: yalnız görseller ve ışık; metin yerinde durur ────────────────
  function parallax(wide) {
    var amt = wide ? 40 : 16;
    $$('.shot').forEach(function (s) {
      if (s.classList.contains('sticky-shot')) return;
      gsap.fromTo(s, { y: amt }, { y: -amt, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    if (heroEmbers) gsap.to(heroEmbers, { yPercent: 16, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    if (bandEmbers) gsap.fromTo(bandEmbers, { yPercent: 10 }, { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.dl-band', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // ── Maketler: ekran görüntüleri masadan kalkar gibi girer; ince işaretçide imlece eğilir ──
  function mockups(fine, cleanups) {
    var items = [];
    $$('.shot .frame').forEach(function (f) {
      var wide = f.parentElement.classList.contains('shot-wide');
      // Geniş görüntü soldan kayar: sağa taşan bir başlangıç sayfayı yana kaydırır (dar ekranda).
      items.push({ node: f, trigger: f.parentElement, max: wide ? 4 : 8, from: wide ? { x: -70, rotationY: 10, opacity: 0 } : { rotationX: 16, y: 48, opacity: 0, transformOrigin: '50% 100%' } });
    });
    // Telefonun dönüşü ve kartın salınımı kaydırmaya bağlı (scenes); burada yalnız eğilme ve kartın girişi var.
    var phone = $('.phone');
    if (phone) items.push({ node: phone, trigger: phone, max: 8, from: null });
    var card = $('.share-card');
    if (card) items.push({ node: card, trigger: card, max: 8, from: { y: 40, opacity: 0 } });
    items.forEach(function (it) {
      var n = it.node;
      n._kvReady = true;
      gsap.set(n, { transformPerspective: 1100 });
      if (it.from && below(it.trigger)) {
        n._kvReady = false;
        var to = { duration: 1.2, ease: EASE, scrollTrigger: { trigger: it.trigger, start: 'top 85%', once: true }, onComplete: function () { n._kvReady = true; } };
        Object.keys(it.from).forEach(function (k) { if (k !== 'transformOrigin') to[k] = k === 'opacity' ? 1 : 0; });
        gsap.fromTo(n, it.from, to);
      }
      if (fine) tilt(n, it.max, cleanups);
      // Geri almada GSAP perspektifi satır içinde bırakabiliyor; sade harekette hiç transform kalmasın.
      cleanups.push(function () { gsap.set(n, { clearProps: 'transform,transformOrigin,translate,rotate,scale' }); });
    });
  }

  // ── Kaydırmaya bağlı sahneler: aşağı indikçe ilerler, yukarı çıkınca geri sarar ──
  function scenes(wide, desk, cleanups) {
    var scrub = function (trigger, start, end, s) { return { trigger: trigger, start: start, end: end, scrub: s === undefined ? true : s }; };
    // Açılıştan çıkış: metin sütunu yukarı süzülüp solar, ışık geride kalır (derinlik).
    var heroText = $('.hero-in > :first-child');
    if (wide && heroText) gsap.to(heroText, { y: -90, opacity: 0.3, ease: 'none', scrollTrigger: scrub('.hero', 'top top', 'bottom top') });
    // Bölüm başlıkları süzülür: girişte belirir, sayfa boyunca yavaşça yukarı kayar.
    // Yalnız yukarı: altındaki paragrafın üstüne binmez (üstte bölüm boşluğu var).
    var heads = [];
    if (wide) {
      $$('.room-head h2, #paylas h2, #gorunum h2').forEach(function (h) {
        if (!below(h)) return;
        heads.push(h);
        gsap.timeline({ scrollTrigger: scrub(h, 'top bottom', 'bottom top') })
          .fromTo(h, { yPercent: 0 }, { yPercent: -60, ease: 'none', duration: 1 }, 0)
          .fromTo(h, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.22 }, 0);
      });
    }
    // Bir gün: sabahtan akşama dolan çizgi, ucunda kıvılcım (üç sütun yan yanayken).
    var day = $('.day');
    if (desk && day) {
      var line = el('span', 'day-line');
      var dot = el('span', 'fuse-spark day-spark');
      dot.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + SPARK + '" fill="url(#spark-g)"/></svg>';
      day.appendChild(line);
      day.appendChild(dot);
      gsap.timeline({ scrollTrigger: scrub(day, 'top 85%', 'bottom 45%', 0.6) })
        .fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
        .fromTo(dot, { x: 0 }, { x: function () { return day.offsetWidth; }, ease: 'none' }, 0);
      cleanups.push(function () { line.remove(); dot.remove(); });
    }
    // Söz: kelimeler okundukça yanar. Sayaçlar ve ekran okuyucu kopyası bölünmez.
    var st = $('.statement');
    if (Split && st && below(st)) {
      var h0 = st.offsetHeight;
      // aria "none": <p> üzerinde aria-label okunmaz; kelimeler düz metin olarak okunmaya devam eder.
      var sp = Split.create(st, { type: 'words', aria: 'none', ignore: '[data-countup], .sr-only' });
      if (Math.abs(st.offsetHeight - h0) > 1) sp.revert();
      else gsap.fromTo(sp.words, { opacity: 0.18 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: scrub(st, 'top 85%', 'bottom 50%') });
    }
    // Tema telefonu kaydırdıkça döner; paylaşım kartı sallanır.
    var phone = $('.phone');
    if (phone) {
      var turn = wide ? 1 : 0.5;
      var holder = phone.parentElement;
      gsap.fromTo(holder, { rotationY: 22 * turn, y: 50, transformPerspective: 1200 }, { rotationY: -10 * turn, y: -30, ease: 'none', scrollTrigger: scrub(phone, 'top bottom', 'bottom top') });
      cleanups.push(function () { gsap.set(holder, { clearProps: 'transform,translate,rotate,scale' }); });
    }
    var card = $('.share-card');
    if (card) gsap.fromTo(card, { rotation: -6 }, { rotation: 4, ease: 'none', scrollTrigger: scrub(card, 'top bottom', 'bottom top') });
    // Geniş ekran görüntüsü yaklaşarak girer.
    var wideShot = $('.shot-wide');
    if (wideShot) gsap.fromTo(wideShot, { scale: 0.9 }, { scale: 1, ease: 'none', scrollTrigger: scrub(wideShot, 'top bottom', 'top 35%') });
    return heads;
  }
  function tilt(n, max, cleanups) {
    var glare = el('span', 'glare');
    n.appendChild(glare);
    var q = { duration: 0.6, ease: 'power3' };
    var rx = gsap.quickTo(n, 'rotationX', q);
    var ry = gsap.quickTo(n, 'rotationY', q);
    var gx = gsap.quickTo(glare, 'xPercent', q);
    var gy = gsap.quickTo(glare, 'yPercent', q);
    var go = gsap.quickTo(glare, 'opacity', { duration: 0.4, ease: 'power2' });
    var rect = null;
    // Kutu eğilince ölçüsü değişir; ölçü girişte bir kez alınır, yoksa hareket kendini besler.
    var enter = function () { rect = n.getBoundingClientRect(); };
    var move = function (e) {
      if (e.pointerType !== 'mouse' || !n._kvReady) return;
      if (!rect) enter();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      rx(-py * max * 2);
      ry(px * max * 2);
      gx(px * 60);
      gy(py * 60);
      go(1);
    };
    var leave = function () { rect = null; rx(0); ry(0); go(0); };
    n.addEventListener('pointerenter', enter);
    n.addEventListener('pointermove', move);
    n.addEventListener('pointerleave', leave);
    cleanups.push(function () {
      n.removeEventListener('pointerenter', enter);
      n.removeEventListener('pointermove', move);
      n.removeEventListener('pointerleave', leave);
      glare.remove();
    });
  }

  // ── Mıknatıs: birincil düğme imlece doğru en çok 6 px çekilir ──────────────
  // CSS "translate" özelliği kullanılır; basınç ölçeği (transform: scale .97) ayrı kalır.
  function magnets(cleanups) {
    $$('.btn-primary').forEach(function (b) {
      var o = { x: 0, y: 0 };
      var apply = function () { b.style.translate = o.x.toFixed(2) + 'px ' + o.y.toFixed(2) + 'px'; };
      var tx = gsap.quickTo(o, 'x', { duration: 0.5, ease: 'power3', onUpdate: apply });
      var ty = gsap.quickTo(o, 'y', { duration: 0.5, ease: 'power3', onUpdate: apply });
      var cx = gsap.utils.clamp(-6, 6);
      var cy = gsap.utils.clamp(-4, 4);
      var move = function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = b.getBoundingClientRect();
        tx(cx((e.clientX - (r.left + r.width / 2)) * 0.2));
        ty(cy((e.clientY - (r.top + r.height / 2)) * 0.3));
      };
      var leave = function () { tx(0); ty(0); };
      b.addEventListener('pointermove', move);
      b.addEventListener('pointerleave', leave);
      cleanups.push(function () {
        b.removeEventListener('pointermove', move);
        b.removeEventListener('pointerleave', leave);
        b.style.translate = '';
      });
    });
  }

  // ── Okuma çizgisi: başlık çubuğunun altında sayfanın ne kadarının okunduğu ──
  function progress(cleanups) {
    var bar = $('.bar');
    if (!bar) return;
    var p = el('span', 'read-progress');
    bar.appendChild(p);
    gsap.fromTo(p, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
    cleanups.push(function () { p.remove(); });
  }

  // ── Kurulum: sade harekete geçince her şey geri alınır, yalnız solma kalır ──
  var mm = null;
  function setup() {
    if (mm) mm.revert();
    mm = gsap.matchMedia();
    mm.add({
      any: 'all',
      ok: '(prefers-reduced-motion: no-preference)',
      wide: '(min-width: 769px)',
      desk: '(min-width: 900px)',
      fine: '(hover: hover) and (pointer: fine)'
    }, function (ctx) {
      var c = ctx.conditions;
      var cleanups = [];
      var noop = function () {};
      var heads = [];
      // Kurulum küçük işlere bölünür ve aralarda tarayıcıya sıra verilir: tek bir uzun görev (TBT) oluşmaz.
      var jobs = [];
      if (!c.ok || KV.calm) {
        jobs.push(function () { endIntro(); cleanups.push(reveals(true) || noop); });
      } else {
        jobs.push(function () { progress(cleanups); });
        // Sahnelerin yönettiği başlıklar tek seferlik belirmeye girmez (aynı öğede iki hareket çakışmasın).
        if (home) jobs.push(function () { heads = scenes(c.wide, c.desk, cleanups); });
        jobs.push(function () { cleanups.push(reveals(false, heads) || noop); });
        jobs.push(function () { mockups(c.fine, cleanups); });
        if (home) {
          jobs.push(function () { fuse(c.desk, cleanups); counters(cleanups); });
          jobs.push(function () {
            grow('.bars', '.fil', 'scaleY', '50% 100%', 0.05);
            grow('.programs', '.pb i', 'scaleX', '0% 50%', 0.04);
            badges();
          });
          jobs.push(function () { band(cleanups); parallax(c.wide); });
        }
        if (c.fine) jobs.push(function () { magnets(cleanups); });
      }
      var alive = true;
      var run = function () {
        if (!alive || !jobs.length) return;
        ctx.add(jobs.shift());
        setTimeout(run, 0);
      };
      run();
      return function () {
        alive = false;
        endIntro();
        for (var i = cleanups.length - 1; i >= 0; i--) cleanups[i]();
      };
    });
  }
  function start() {
    gsap = window.gsap;
    ST = window.ScrollTrigger;
    Split = window.SplitText;
    ready = true;
    if (gsap && ST) {
      gsap.registerPlugin(ST);
      if (Split) gsap.registerPlugin(Split);
      ST.config({ ignoreMobileResize: true });
      setup();
      KV.onMotion(function () { setup(); });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
    }
    // GSAP gelemediyse de bekleyenler kendi yedek yollarıyla çalışır.
    waiting.splice(0).forEach(function (fn) { fn(); });
  }
  // Sayfa yüklenip tarayıcı boşa çıkınca yükle: yazılar, stil ve ilk boyama kütüphaneyle bant genişliği paylaşmaz.
  // Kaydırma hareketleri zaten aşağıdaki bölümler için; açılış kütüphane beklemiyor.
  var kick = function () {
    var go = function () { loadVendor(start); };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 1500 });
    else setTimeout(go, 200);
  };
  if (document.readyState === 'complete') kick();
  else window.addEventListener('load', kick, { once: true });
})();
