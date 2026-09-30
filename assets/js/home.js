/* Ana sayfa demoları. Hareket değerleri uygulamadan: Mascot, Hearth, FlyingSparks, IntroScene, WarmGlow, ChestGame.
   Yay eğrileri Reanimated 4.5.1 withSpring denkleminden örneklendi (pop: damping 14, stiffness 260, mass 4). */
(function () {
  'use strict';
  var KV = window.KV || { calm: false, onMotion: function () {}, watchLoop: function () {} };
  var canLinear = window.CSS && CSS.supports && CSS.supports('animation-timing-function', 'linear(0, 1)');
  var POP = canLinear ? 'linear(0, 0.008 0.4%, 0.03 0.8%, 0.066 1.3%, 0.115 1.7%, 0.174 2.1%, 0.243 2.5%, 0.319 2.9%, 0.402 3.3%, 0.581 4.2%, 0.857 5.4%, 1.03 6.3%, 1.11 6.7%, 1.184 7.1%, 1.251 7.5%, 1.311 7.9%, 1.363 8.3%, 1.406 8.8%, 1.441 9.2%, 1.468 9.6%, 1.486 10%, 1.495 10.4%, 1.497 10.8%, 1.491 11.3%, 1.477 11.7%, 1.458 12.1%, 1.432 12.5%, 1.401 12.9%, 1.365 13.3%, 1.284 14.2%, 1.057 16.3%, 0.972 17.1%, 0.898 17.9%, 0.865 18.3%, 0.812 19.2%, 0.792 19.6%, 0.776 20%, 0.764 20.4%, 0.756 20.8%, 0.753 21.3%, 0.753 21.7%, 0.765 22.5%, 0.776 22.9%, 0.806 23.8%, 0.866 25%, 1 27.5%, 1.039 28.3%, 1.071 29.2%, 1.097 30%, 1.106 30.4%, 1.113 30.8%, 1.122 31.7%, 1.122 32.5%, 1.109 33.8%, 1.084 35%, 0.997 38.3%, 0.97 39.6%, 0.956 40.4%, 0.946 41.3%, 0.939 42.5%, 0.941 43.8%, 0.95 45%, 1.003 49.2%, 1.02 50.8%, 1.027 52.1%, 1.03 53.3%, 1.026 55.4%, 0.993 60.8%, 0.985 63.7%, 0.987 66.3%, 1.003 71.3%, 1.007 74.2%, 0.996 85%, 1.002 95%, 1)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  var POP_MS = canLinear ? 3729 : 700;
  var COUNTER = canLinear ? 'linear(0, 0.006 0.8%, 0.012 1.3%, 0.033 2.1%, 0.079 3.3%, 0.14 4.6%, 0.213 5.8%, 0.293 7.1%, 0.582 11.3%, 0.719 13.3%, 0.795 14.6%, 0.842 15.4%, 0.926 17.1%, 0.998 18.8%, 1.028 19.6%, 1.068 20.8%, 1.09 21.7%, 1.117 22.9%, 1.131 23.8%, 1.147 25%, 1.157 26.3%, 1.163 27.9%, 1.162 29.2%, 1.155 30.8%, 1.131 33.8%, 1.049 41.3%, 1.018 44.6%, 0.99 48.8%, 0.977 52.9%, 0.973 55.8%, 0.975 59.2%, 0.997 72.5%, 1.003 79.6%, 1.004 87.5%, 1)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  var COUNTER_MS = 288;
  var SNAP = canLinear ? 'linear(0, 0.003 0.8%, 0.016 2.1%, 0.039 3.3%, 0.079 5%, 0.154 7.5%, 0.364 13.8%, 0.457 16.7%, 0.553 20%, 0.637 23.3%, 0.707 26.7%, 0.766 30%, 0.82 33.8%, 0.862 37.5%, 0.898 41.7%, 0.93 46.7%, 0.953 52.1%, 0.971 58.3%, 0.984 65.4%, 0.992 73.8%, 1)' : 'cubic-bezier(0.23, 1, 0.32, 1)';
  var SNAP_MS = 338;
  var EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
  var OUT_QUAD = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  var IN_QUAD = 'cubic-bezier(0.55, 0.085, 0.68, 0.53)';
  var hasAnim = !!Element.prototype.animate;
  var calm = function () { return KV.calm || !hasAnim; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var SPARK = 'M12 0.5C12.9 7.2 16.8 11.1 23.5 12C16.8 12.9 12.9 16.8 12 23.5C11.1 16.8 7.2 12.9 0.5 12C7.2 11.1 11.1 7.2 12 0.5Z';
  function once(el, threshold, fn) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      for (var i = 0; i < es.length; i++) if (es[i].isIntersecting) { io.disconnect(); fn(); return; }
    }, { threshold: threshold });
    io.observe(el);
  }
  function hint(el, on) { el.style.willChange = on ? 'transform, opacity' : ''; }

  // ── Açılış: Kıvı + ışık + yükselen kıvılcımlar (bir kez) ──────────────────
  var hearth = $('.hearth');
  var kivi = $('.kivi-hero');
  var orb = $('.orb');
  var stage = $('.hearth-stage');
  if (kivi) {
    if (!calm()) {
      hint(kivi, true);
      kivi.style.transformOrigin = '50% 100%';
      kivi.animate([{ transform: 'scale(0.9)' }, { transform: 'scale(1)' }], { duration: POP_MS, easing: POP })
        .onfinish = function () { hint(kivi, false); };
      kivi.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: EASE_OUT });
      // IntroScene'deki 6 kıvılcım (mobilde 4): yükselir, tek sefer.
      var RISE = [
        { x: 0.14, len: 54, ms: 3600, delay: 0, size: 3 },
        { x: 0.22, len: 30, ms: 2800, delay: 900, size: 2 },
        { x: 0.3, len: 40, ms: 4200, delay: 1800, size: 2 },
        { x: 0.7, len: 36, ms: 3000, delay: 400, size: 2 },
        { x: 0.78, len: 60, ms: 3900, delay: 1300, size: 3 },
        { x: 0.86, len: 28, ms: 2600, delay: 2100, size: 2 }
      ];
      var few = window.innerWidth < 600;
      RISE.forEach(function (p, i) {
        if (few && (i === 2 || i === 5)) return;
        var r = document.createElement('span');
        r.className = 'rise';
        r.setAttribute('aria-hidden', 'true');
        r.style.left = p.x * 100 + '%';
        r.innerHTML = '<i style="width:' + p.size * 2 + 'px;height:' + p.size * 2 + 'px"></i><b style="height:' + p.len + 'px"></b>';
        stage.appendChild(r);
        r.animate([
          { transform: 'translateY(180px)', opacity: 0 },
          { transform: 'translateY(150px)', opacity: 1, offset: 0.15 },
          { transform: 'translateY(-20px)', opacity: 0 }
        ], { duration: p.ms, delay: p.delay, easing: OUT_QUAD, fill: 'both' }).onfinish = function () { r.remove(); };
      });
    }
    kivi.classList.add('is-alive');
    KV.watchLoop(kivi);
  }
  if (orb) { orb.classList.add('is-alive'); KV.watchLoop(orb); }

  // ── Kıvı'nın gözleri: ince işaretçide imleci izler (en çok 2,6 birim) ─────
  var eyes = kivi ? $('.eyes', kivi) : null;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (eyes && hasAnim) {
    var target = { x: 0, y: 0 };
    var cur = { x: 0, y: 0 };
    var visible = true;
    var raf = 0;
    var last = 0;
    var tick = function (now) {
      var dt = last ? now - last : 16;
      last = now;
      var k = 1 - Math.exp(-dt / 120);
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      eyes.style.transform = 'translate(' + cur.x.toFixed(2) + 'px,' + cur.y.toFixed(2) + 'px)';
      if (Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.01) raf = requestAnimationFrame(tick);
      else { raf = 0; last = 0; }
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(kivi);
    window.addEventListener('pointermove', function (e) {
      if (!fine.matches || calm() || !visible || e.pointerType !== 'mouse') return;
      var r = kivi.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height * 0.69);
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var m = Math.min(1, dist / 320) * 2.6;
      target.x = (dx / dist) * m;
      target.y = (dy / dist) * m;
      kivi.classList.add('is-tracking');
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    KV.onMotion(function (c) { if (c) { kivi.classList.remove('is-tracking'); eyes.style.transform = ''; target.x = target.y = cur.x = cur.y = 0; } });
  }

  // ── Ocak ──────────────────────────────────────────────────────────────────
  if (hearth) {
    var TASKS = ['Su iç', '10 sayfa oku', '15 dakika yürü', 'Nefes egzersizi', 'Günlüğe yaz', 'Esneme'];
    var sticks = $$('.stick', hearth);
    var glow = $('.hearth-glow', hearth);
    var counter = $('.counter', hearth);
    var countNum = $('[data-count]', hearth);
    var nextRow = $('.next-row', hearth);
    var nextText = $('[data-next]', hearth);
    var checkBtn = $('.check-btn', hearth);
    var doneRow = $('.done-row', hearth);
    var againBtn = $('[data-again]', hearth);
    var layer = $('.spark-layer', hearth);
    var hop = kivi ? $('.hop', kivi) : null;
    var lit = 0;
    var sparks = 0;
    var busy = 0;

    var setGlow = function () {
      glow.style.transition = calm() ? 'none' : '';
      glow.style.opacity = String(0.35 + 0.65 * (lit / sticks.length));
    };
    var bump = function () {
      sparks += 10;
      countNum.textContent = String(sparks);
      if (calm()) return;
      hint(counter, true);
      counter.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }], { duration: 70, fill: 'forwards' }).onfinish = function (ev) {
        var a = counter.animate([{ transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: COUNTER_MS, easing: COUNTER });
        ev.target.cancel();
        a.onfinish = function () { hint(counter, false); };
      };
    };
    var rel = function (el, ax, ay) {
      var r = el.getBoundingClientRect();
      var h = hearth.getBoundingClientRect();
      return { x: r.left - h.left + r.width * ax, y: r.top - h.top + r.height * ay };
    };
    var fly = function (stick, done) {
      var from = rel(stick, 0.5, 0.2);
      var to = rel(counter, 0.18, 0.5);
      var left = 3;
      for (var i = 0; i < 3; i++) {
        var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        s.setAttribute('viewBox', '0 0 24 24');
        s.setAttribute('class', 'spark');
        s.setAttribute('aria-hidden', 'true');
        s.innerHTML = '<path d="' + SPARK + '" fill="url(#spark-g)"/>';
        layer.appendChild(s);
        var side = (i % 2 === 0 ? 1 : -1) * (24 + i * 6);
        var frames = [];
        for (var n = 0; n <= 11; n++) {
          var t = n / 11;
          var arc = Math.sin(t * Math.PI);
          var x = from.x + (to.x - from.x) * t + arc * side - 8;
          var y = from.y + (to.y - from.y) * t - arc * 70 - 8;
          var sc = t < 0.2 ? 0.4 + 0.8 * (t / 0.2) : 1.2 - 0.6 * ((t - 0.2) / 0.8);
          var op = t < 0.1 ? t / 0.1 : t < 0.85 ? 1 : 1 - (t - 0.85) / 0.15;
          frames.push({ offset: t, opacity: op, transform: 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ') rotate(' + Math.round(t * 360) + 'deg)' });
        }
        s.style.willChange = 'transform, opacity';
        s.animate(frames, { duration: 620, delay: i * 55, easing: EASE_OUT, fill: 'both' }).onfinish = (function (node) {
          return function () { node.remove(); left -= 1; if (left === 0) done(); };
        })(s);
      }
    };
    var ignite = function (i, k) {
      var st = sticks[i];
      var fire = $('.fire', st);
      st.classList.add('is-lit');
      if (calm()) {
        if (hasAnim) fire.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
        bump();
        return;
      }
      hint(fire, true);
      fire.animate([{ transform: 'scaleY(0.6)', opacity: 0 }, { transform: 'scaleY(1)', opacity: 1 }], { duration: POP_MS, delay: k * 90, easing: POP, fill: 'backwards' })
        .onfinish = function () { hint(fire, false); };
      busy += 1;
      setTimeout(function () { fly(st, function () { busy -= 1; bump(); }); }, 160 + k * 90);
    };
    var render = function () {
      var all = lit >= sticks.length;
      nextRow.hidden = all;
      doneRow.hidden = !all;
      if (!all) {
        nextText.textContent = 'Sıradaki: ' + TASKS[lit];
        checkBtn.setAttribute('aria-label', 'Sıradaki görevi tamamla: ' + TASKS[lit]);
      }
    };
    var cheer = function () {
      if (calm() || !hop) return;
      hop.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-16px)' }], { duration: 230, easing: OUT_QUAD })
        .onfinish = function () { hop.animate([{ transform: 'translateY(-16px)' }, { transform: 'translateY(0)' }], { duration: 260, easing: IN_QUAD }); };
    };
    var advance = function (count) {
      for (var k = 0; k < count && lit < sticks.length; k++) { ignite(lit, k); lit += 1; }
      setGlow();
      render();
      if (lit >= sticks.length) {
        var wait = calm() ? 0 : 160 + 620 + 3 * 55;
        setTimeout(function () { cheer(); if (document.activeElement === checkBtn || document.activeElement === document.body) againBtn.focus(); }, wait);
      }
    };
    checkBtn.addEventListener('click', function () { advance(1); });
    againBtn.addEventListener('click', function () {
      sticks.forEach(function (st) {
        st.classList.remove('is-lit');
        var f = $('.fire', st);
        f.getAnimations().forEach(function (a) { a.cancel(); });
        if (hasAnim) f.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160 });
      });
      lit = 0;
      sparks = 0;
      countNum.textContent = '0';
      setGlow();
      render();
      checkBtn.focus();
    });
    render();
    setGlow();
    // Bölümün %40'ı görününce ilk iki çıta yanar.
    once(hearth, 0.4, function () { setTimeout(function () { advance(2); }, calm() ? 0 : 450); });
  }

  // ── Kaydırma demosu: sağa tamamla, sola jokerle atla ──────────────────────
  var row = $('.swipe-row');
  if (row) {
    var status = $('.swipe-status');
    var wrap = row.parentElement;
    var x = 0;
    var startX = 0;
    var startY = 0;
    var dragging = false;
    var decided = false;
    var lastX = 0;
    var lastT = 0;
    var vel = 0;
    var setX = function (v) { x = v; row.style.transform = v ? 'translateX(' + v.toFixed(1) + 'px)' : ''; };
    var settle = function (to, after) {
      if (calm()) { setX(to); if (after) after(); return; }
      var from = x;
      row.getAnimations().forEach(function (a) { a.cancel(); });
      setX(to);
      row.animate([{ transform: 'translateX(' + from + 'px)' }, { transform: 'translateX(' + to + 'px)' }], { duration: SNAP_MS, easing: SNAP }).onfinish = after || null;
    };
    var finish = function (kind) {
      var w = wrap.clientWidth;
      settle(kind === 'done' ? w : -w, function () {
        row.classList.remove('is-done', 'is-joker');
        row.classList.add(kind === 'done' ? 'is-done' : 'is-joker');
        setX(0);
        if (!calm()) row.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: EASE_OUT });
        status.textContent = kind === 'done' ? 'Tamamlandı: +10 kıvılcım. Serin bugün de yandı.' : 'Jokerle atlandı: bugünkü görev serini bozmadan geçti.';
      });
    };
    row.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true;
      decided = false;
      startX = e.clientX - x;
      startY = e.clientY;
      lastX = e.clientX;
      lastT = e.timeStamp;
      vel = 0;
      row.getAnimations().forEach(function (a) { a.cancel(); });
    });
    row.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (!decided) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        if (Math.abs(dy) > Math.abs(dx)) { dragging = false; return; }
        decided = true;
        row.setPointerCapture(e.pointerId);
      }
      var dt = e.timeStamp - lastT;
      if (dt > 0) vel = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = e.timeStamp;
      setX(dx);
    });
    var end = function () {
      if (!dragging) return;
      dragging = false;
      if (!decided) return;
      var w = wrap.clientWidth;
      if (x > w * 0.4 || vel > 0.6) finish('done');
      else if (x < -w * 0.4 || vel < -0.6) finish('joker');
      else settle(0);
    };
    row.addEventListener('pointerup', end);
    row.addEventListener('pointercancel', end);
    $('[data-swipe="done"]').addEventListener('click', function () { finish('done'); });
    $('[data-swipe="joker"]').addEventListener('click', function () { finish('joker'); });
    $('[data-swipe="reset"]').addEventListener('click', function () { row.classList.remove('is-done', 'is-joker'); setX(0); status.textContent = ''; });
  }

  // ── Seri yolculuğu: 0 → 365 gün ───────────────────────────────────────────
  var journey = $('.journey');
  if (journey) {
    var TH = [0, 7, 30, 100, 365];
    var NAMES = ['Turuncu Alev', 'Altın Alev', 'Mavi Plazma', 'Mor Nova', 'Beyaz Yıldız'];
    var count = $('[data-day]', journey);
    var tierName = $('[data-tier]', journey);
    var nextEl = $('[data-next-tier]', journey);
    var fill = $('.track-fill', journey);
    var svgs = $$('.tier-stack svg', journey);
    var rays = $$('.ray', journey);
    var raysBox = $('.rays', journey);
    var shownDay = -1;
    var shownTier = -1;
    var shownP = -1;
    var jr = 0;
    var active = false;
    var update = function () {
      jr = 0;
      if (!active) return;
      var r = journey.getBoundingClientRect();
      var span = r.height - window.innerHeight;
      var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      var seg = Math.min(3, Math.floor(p * 4));
      var u = p * 4 - seg;
      var day = Math.round(TH[seg] + (TH[seg + 1] - TH[seg]) * Math.min(1, u));
      var tier = 0;
      for (var i = 0; i < TH.length; i++) if (day >= TH[i]) tier = i;
      if (day !== shownDay) { shownDay = day; count.firstChild.nodeValue = String(day); }
      if (tier !== shownTier) {
        shownTier = tier;
        tierName.textContent = NAMES[tier];
        nextEl.textContent = tier < 4 ? TH[tier + 1] + '. günde ' + NAMES[tier + 1] : 'Bir yıl: alevin artık Beyaz Yıldız.';
        svgs.forEach(function (s, k) { s.classList.toggle('is-on', k === tier); });
        rays.forEach(function (s, k) { s.classList.toggle('is-on', k === tier); });
      }
      if (Math.abs(p - shownP) > 0.001) { shownP = p; fill.style.transform = 'scaleX(' + p.toFixed(4) + ')'; }
    };
    // Kaydırma karesi başına tek okuma; sahne ekran dışındayken ya da kaydırma yokken iş yapılmaz.
    var schedule = function () { if (active && !jr) jr = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        active = es[0].isIntersecting;
        schedule();
      }).observe(journey);
    }
    raysBox.classList.add('is-alive');
    KV.watchLoop(raysBox);
  }
  // Dar ekranda ya da sade harekette merdiven: satır görününce Kıvı 420 ms'de belirir.
  var ladderRows = $$('.ladder li');
  var ladderMq = window.matchMedia('(max-width: 768px)');
  if (ladderRows.length && hasAnim && !calm() && ladderMq.matches && 'IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        lio.unobserve(en.target);
        var s = $('svg', en.target);
        s.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: EASE_OUT, fill: 'backwards' });
      });
    }, { threshold: 0.3 });
    ladderRows.forEach(function (li) { lio.observe(li); });
  }

  // ── Isı haritası (örnek veri) ─────────────────────────────────────────────
  var heat = $('.heat');
  if (heat) {
    var months = $('.months');
    var table = $('[data-heat-table]');
    var rnd = (function (a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })(20260928);
    var MN = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    var MN_LONG = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    var today = new Date();
    today.setHours(12, 0, 0, 0);
    var dow = (today.getDay() + 6) % 7; // Pazartesi 0
    var start = new Date(today);
    start.setDate(today.getDate() - dow - 52 * 7);
    var frag = document.createDocumentFragment();
    var mfrag = document.createDocumentFragment();
    var lastMonth = -1;
    var perMonth = {};
    var animate = !calm();
    if (animate) heat.classList.add('is-pre');
    for (var w = 0; w < 53; w++) {
      // Hafta sütunu tek parça canlanır: 371 hücre yerine 53 katman (4x yavaş CPU'da kare kaçmasın).
      var col = document.createElement('span');
      col.className = 'wk' + (w < 27 ? ' old' : '');
      col.style.setProperty('--c', String(w));
      for (var dd = 0; dd < 7; dd++) {
        var date = new Date(start);
        date.setDate(start.getDate() + w * 7 + dd);
        var cell = document.createElement('span');
        cell.className = 'cell';
        if (date <= today) {
          var pr = 0.22 + 0.66 * (w / 52);
          var gap = w >= 19 && w <= 20;
          var lvl = 0;
          if (!gap && rnd() < pr) lvl = Math.min(4, 1 + Math.floor(rnd() * (2 + w / 18)));
          if (lvl) {
            cell.className += ' l' + lvl;
            var key = date.getFullYear() + '-' + date.getMonth();
            perMonth[key] = (perMonth[key] || 0) + 1;
          }
        } else cell.style.visibility = 'hidden';
        col.appendChild(cell);
        if (dd === 0 && date.getMonth() !== lastMonth && date.getDate() <= 7) {
          lastMonth = date.getMonth();
          var ml = document.createElement('span');
          ml.textContent = MN[lastMonth];
          ml.setAttribute('data-w', String(w));
          if (w < 27) ml.className = 'old';
          mfrag.appendChild(ml);
        }
      }
      frag.appendChild(col);
    }
    heat.appendChild(frag);
    months.appendChild(mfrag);
    // Ay etiketi haftasının sütununa oturur; dar ekranda yalnız son 26 hafta var, sütunlar kayar.
    var narrow = window.matchMedia('(max-width: 640px)');
    var placeMonths = function () {
      var first = narrow.matches ? 27 : 0;
      var cols = 53 - first;
      $$('span', months).forEach(function (ml) {
        var c = +ml.getAttribute('data-w') - first + 1;
        if (c >= 1) ml.style.gridColumn = c + ' / ' + Math.min(c + 3, cols + 1);
      });
    };
    placeMonths();
    if (narrow.addEventListener) narrow.addEventListener('change', placeMonths);
    if (table) {
      var rows = '';
      var total = 0;
      Object.keys(perMonth).forEach(function (k) {
        var parts = k.split('-');
        total += perMonth[k];
        rows += '<tr><th scope="row">' + MN_LONG[+parts[1]] + ' ' + parts[0] + '</th><td>' + perMonth[k] + '</td></tr>';
      });
      table.innerHTML = '<caption>Örnek veri: son 12 ayda ' + total + ' aktif gün</caption><thead><tr><th scope="col">Ay</th><th scope="col">Aktif gün</th></tr></thead><tbody>' + rows + '</tbody>';
    }
    if (animate) once(heat, 0.3, function () {
      heat.offsetWidth; // başlangıç durumunu kaydet
      heat.classList.add('is-on');
      heat.classList.remove('is-pre');
    });
  }

  // ── Sandık çarpanı (ChestGame): x1 | x2 | x4 | x10 | x4 | x2 | x1 ──────────
  var chest = $('.chest');
  if (chest) {
    var BAR = [[1, 0, 0.25], [2, 0.25, 0.4], [4, 0.4, 0.475], [10, 0.475, 0.525], [4, 0.525, 0.6], [2, 0.6, 0.75], [1, 0.75, 1]];
    var bar = $('.chest-bar', chest);
    var needle = $('.needle', chest);
    var flash = $('.chest-flash', chest);
    var btn = $('[data-chest]', chest);
    var result = $('.chest-result', chest);
    var slowNote = $('[data-slow]', chest);
    var sweepAnim = null;
    var t0 = 0;
    var sweepMs = 900;
    var state = 'idle';
    var barPos = function (ms) { var t = Math.max(0, ms) / sweepMs; var ph = t % 2; return ph <= 1 ? ph : 2 - ph; };
    var multAt = function (p) { for (var i = 0; i < BAR.length; i++) if (p < BAR[i][2]) return BAR[i][0]; return 1; };
    var width = function () { return bar.clientWidth - 6; };
    var start = function () {
      state = 'run';
      sweepMs = calm() ? 2200 : 900;
      slowNote.hidden = !calm();
      result.innerHTML = '';
      btn.textContent = 'Durdur';
      t0 = performance.now();
      var wpx = width();
      if (hasAnim) {
        needle.style.willChange = 'transform';
        sweepAnim = needle.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(' + wpx + 'px)' }], { duration: sweepMs, iterations: Infinity, direction: 'alternate', easing: 'linear' });
      }
    };
    var stop = function () {
      if (state !== 'run') return;
      state = 'done';
      var elapsed = performance.now() - t0;
      if (sweepAnim) { elapsed = sweepAnim.currentTime || elapsed; sweepAnim.cancel(); sweepAnim = null; }
      needle.style.willChange = '';
      var p = barPos(elapsed);
      needle.style.transform = 'translateX(' + (p * width()).toFixed(1) + 'px)';
      var m = multAt(p);
      if (!calm() && hasAnim) flash.animate([{ opacity: 0 }, { opacity: 1, offset: 120 / 500 }, { opacity: 0.35 }], { duration: 500, fill: 'forwards' });
      result.innerHTML = '<div class="mult">x' + m + '</div><div class="gain">' + 10 * m + ' kıvılcım</div><p>' + (m >= 10 ? 'Tam ortadan! Kıvı çok sevindi.' : 'Yarın yeni bir sandık seni bekliyor.') + '</p>';
      btn.textContent = 'Tekrar aç';
    };
    btn.addEventListener('click', function () {
      if (state === 'run') stop();
      else {
        flash.getAnimations().forEach(function (a) { a.cancel(); });
        start();
      }
    });
    bar.addEventListener('pointerdown', function () { if (state === 'run') stop(); });
  }

  // ── Görünüm: tema seçici yalnız telefonu boyar ────────────────────────────
  var phone = $('.phone');
  if (phone) {
    var dark = window.matchMedia('(prefers-color-scheme: dark)');
    var screen = $('.screen', phone);
    var resolve = function (v) { return v === 'auto' ? (dark.matches ? 'night' : 'light') : v; };
    var apply = function (v) {
      var next = resolve(v);
      if (phone.getAttribute('data-theme') === next) return;
      if (!calm()) {
        var ghost = screen.cloneNode(true);
        ghost.classList.add('screen-ghost');
        ghost.setAttribute('aria-hidden', 'true');
        var prev = phone.getAttribute('data-theme');
        var holder = document.createElement('div');
        holder.className = 'phone';
        holder.setAttribute('data-theme', prev);
        holder.style.cssText = 'position:absolute;inset:-10px;border-color:transparent;outline:0;width:auto;z-index:2;pointer-events:none;aspect-ratio:auto';
        holder.appendChild(ghost);
        phone.appendChild(holder);
        holder.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: EASE_OUT }).onfinish = function () { holder.remove(); };
      }
      phone.setAttribute('data-theme', next);
    };
    $$('input[name="tema"]').forEach(function (r) { r.addEventListener('change', function () { apply(r.value); }); });
    if (dark.addEventListener) dark.addEventListener('change', function () { var c = $('input[name="tema"]:checked'); if (c && c.value === 'auto') apply('auto'); });
    var init = $('input[name="tema"]:checked');
    phone.setAttribute('data-theme', resolve(init ? init.value : 'auto'));
  }
})();
