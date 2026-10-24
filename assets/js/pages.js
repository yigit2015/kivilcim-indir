/* Kıvılcım alt sayfaları: ana sayfanın hareket katmanı (kütüphanesiz).
   İlerleme çizgisi, kor parçacıkları, gren, kaydırınca beliren içerik, dev KIVILCIM yazısı, fare imleci.
   Sade hareket (sistem ayarı ya da alt bilgideki düğme) açıksa yalnız içerik kalır. */
(function () {
  'use strict';
  var d = document.documentElement;
  var KV = (window.KV = window.KV || { calm: false, onMotion: function () {} });
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var calm = function () { return !!KV.calm || d.getAttribute('data-motion') === 'calm'; };
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var cleanup = [];

  // Tema rengi: adres çubuğu sayfanın zeminiyle aynı.
  var syncMeta = function () {
    var light = d.getAttribute('data-theme') === 'light';
    $$('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', light ? '#F6F2EC' : '#141414'); });
  };
  syncMeta();
  new MutationObserver(syncMeta).observe(d, { attributes: true, attributeFilter: ['data-theme'] });

  // ── Katmanlar ──
  var progress = document.createElement('div'); progress.className = 'kv-progress'; progress.setAttribute('aria-hidden', 'true');
  var grain = document.createElement('div'); grain.className = 'kv-grain'; grain.setAttribute('aria-hidden', 'true');
  var canvas = document.createElement('canvas'); canvas.className = 'kv-embers'; canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress); document.body.appendChild(grain); document.body.appendChild(canvas);

  var onScroll = function () {
    var max = Math.max(1, d.scrollHeight - window.innerHeight);
    progress.style.transform = 'scaleX(' + Math.min(1, window.scrollY / max).toFixed(4) + ')';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // ── Sayfa başına Kıvı ──
  var head = document.querySelector('.page-head .wrap');
  if (head && !head.querySelector('.page-kivi')) {
    var kv = document.createElement('div');
    kv.className = 'page-kivi'; kv.setAttribute('aria-hidden', 'true');
    var img = new Image(); img.src = (document.querySelector('link[rel="icon"][type="image/svg+xml"]') || {}).href || '';
    img.alt = ''; img.width = 100; img.height = 110;
    kv.appendChild(img); head.appendChild(kv);
  }

  // ── Dev KIVILCIM ──
  var foot = document.querySelector('.foot');
  if (foot && !foot.querySelector('.foot__mark')) {
    var mark = document.createElement('p');
    mark.className = 'foot__mark'; mark.setAttribute('aria-hidden', 'true');
    'KIVILCIM'.split('').forEach(function (c) { var s = document.createElement('span'); s.textContent = c; mark.appendChild(s); });
    foot.insertBefore(mark, foot.firstChild);
  }

  // ── Kor parçacıkları ──
  var ctx = canvas.getContext && canvas.getContext('2d');
  var W = 0, H = 0, embers = [], bursts = [], cols = ['#FFD15C', '#FF8A2B', '#E8452F'], lastY = window.scrollY, vel = 0, raf = 0;
  var resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  var spawn = function (any) {
    return { x: Math.random() * W, y: any ? Math.random() * H : H + 10, r: 0.6 + Math.random() * 1.8, vy: 0.25 + Math.random() * 0.6,
      ph: Math.random() * 6.283, sw: 4 + Math.random() * 10, z: 0.3 + Math.random() * 0.9, a: 0.25 + Math.random() * 0.5, col: cols[(Math.random() * 3) | 0] };
  };
  var burst = (KV.burst = function (x, y, n, power) {
    if (calm()) return;
    for (var i = 0; i < n; i++) {
      var ang = Math.random() * Math.PI * 2, sp = (1.2 + Math.random() * 4.8) * power, life = 35 + Math.random() * 40;
      bursts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1.6 * power, r: 1 + Math.random() * 2.4, life: life, max: life, col: cols[(Math.random() * 3) | 0] });
    }
    kick();
  });
  var draw = function () {
    raf = 0;
    if (!ctx || calm() || document.hidden) { if (ctx) ctx.clearRect(0, 0, W, H); return; }
    var y = window.scrollY, dy = y - lastY; lastY = y; vel += (dy - vel) * 0.2;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < embers.length; i++) {
      var e = embers[i];
      e.ph += 0.02;
      e.y -= e.vy + Math.abs(vel) * 0.03 * e.z + vel * 0.25 * e.z;
      if (e.y < -12) embers[i] = e = spawn(false);
      else if (e.y > H + 20) { e.y = -10; e.x = Math.random() * W; }
      var x = e.x + Math.sin(e.ph) * e.sw, a = e.a * (0.65 + 0.35 * Math.sin(e.ph * 3.1));
      ctx.fillStyle = e.col;
      ctx.globalAlpha = a * 0.16; ctx.beginPath(); ctx.arc(x, e.y, e.r * 3.2, 0, 6.283); ctx.fill();
      ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, e.y, e.r, 0, 6.283); ctx.fill();
    }
    for (var j = bursts.length - 1; j >= 0; j--) {
      var p = bursts[j];
      p.vx *= 0.955; p.vy = p.vy * 0.955 + 0.09; p.x += p.vx; p.y += p.vy; p.life -= 1;
      if (p.life <= 0) { bursts.splice(j, 1); continue; }
      var k = p.life / p.max;
      ctx.fillStyle = p.col;
      ctx.globalAlpha = k * 0.25; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3 * k + 0.5, 0, 6.283); ctx.fill();
      ctx.globalAlpha = k; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * k + 0.3, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    kick();
  };
  var kick = function () { if (!raf) raf = requestAnimationFrame(draw); };
  if (ctx) {
    resize();
    window.addEventListener('resize', resize);
    var n = Math.round((W < 700 ? 0.5 : 1) * 60);
    for (var i = 0; i < n; i++) embers.push(spawn(true));
    document.addEventListener('visibilitychange', kick);
    kick();
  }

  // ── Kaydırınca beliren içerik ──
  var targets = $$('.doc h2, .doc > section > p, .feature-grid > li, .feature-list > li, .release, .faq > details, .panel, .tablewrap, .chip-legend > div, .ladder > li, .programs > li, .nil > div, .support-grid > section, .doc ul.list > li');
  var heads = $$('.page-head .wrap > *:not(.page-kivi)');
  if (!calm() && 'IntersectionObserver' in window) {
    targets.forEach(function (el) { el.classList.add('kv-reveal'); });
    var io = new IntersectionObserver(function (es) {
      var k = 0;
      es.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.style.setProperty('--d', Math.min(k++, 6) * 70 + 'ms');
        x.target.classList.add('is-in');
        io.unobserve(x.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
    // Sayfa başı: harf harf gelen başlık, ardından alt satırlar
    var h1 = document.querySelector('.page-head h1');
    if (h1 && h1.animate) {
      var words = h1.textContent.trim().split(/\s+/);
      h1.setAttribute('aria-label', h1.textContent.trim());
      h1.textContent = '';
      var chars = [];
      words.forEach(function (w, wi) {
        var ws = document.createElement('span'); ws.className = 'kv-word'; ws.setAttribute('aria-hidden', 'true');
        Array.from(w).forEach(function (c) { var cs = document.createElement('span'); cs.className = 'kv-ch'; cs.textContent = c; ws.appendChild(cs); chars.push(cs); });
        h1.appendChild(ws);
        if (wi < words.length - 1) h1.appendChild(document.createTextNode(' '));
      });
      chars.forEach(function (c, ci) {
        c.animate([{ transform: 'translateY(.9em) rotate(8deg)', opacity: 0 }, { transform: 'none', opacity: 1 }],
          { duration: 1000, delay: 80 + ci * 32, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
      });
      heads.forEach(function (el, hi) {
        if (el === h1) return;
        el.animate([{ transform: 'translateY(24px)', opacity: 0 }, { transform: 'none', opacity: 1 }],
          { duration: 900, delay: 360 + hi * 110, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
      });
    }
    // Dev yazı: görünür olunca harfler alttan çıkar
    var markEl = document.querySelector('.foot__mark');
    if (markEl && markEl.animate) {
      var fio = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        fio.disconnect();
        $$('span', markEl).forEach(function (s, si) {
          s.animate([{ transform: 'translateY(110%)' }, { transform: 'none' }], { duration: 1100, delay: si * 70, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
        });
      }, { threshold: 0.2 });
      fio.observe(markEl);
    }
  }

  // ── Kartlarda imleç ışığı ──
  $$('.feature-grid > li, .feature-list > li').forEach(function (li) {
    li.addEventListener('pointermove', function (e) {
      var r = li.getBoundingClientRect();
      li.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      li.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });

  // ── Düğmelerde kıvılcım ──
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.btn-primary, [data-theme-toggle], .faq summary');
    if (!b) return;
    var r = b.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, b.matches('.btn-primary') ? 30 : 12, b.matches('.btn-primary') ? 1 : 0.5);
  });

  // ── İmleç (yalnız fare, hareket açıkken) ──
  if (fine && !calm()) {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'kv-cur'; ring.className = 'kv-cur';
    dot.innerHTML = '<div class="kv-cur-dot"></div>'; ring.innerHTML = '<div class="kv-cur-ring"></div>';
    dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring); document.body.appendChild(dot);
    var ringIn = ring.firstChild, tx = -100, ty = -100, rx = -100, ry = -100, cr = 0;
    d.classList.add('kv-cursor');
    var follow = function () {
      cr = 0;
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      dot.style.transform = 'translate(' + (tx - 4) + 'px,' + (ty - 4) + 'px)';
      ring.style.transform = 'translate(' + (rx - 21) + 'px,' + (ry - 21) + 'px)';
      if (Math.abs(tx - rx) > 0.3 || Math.abs(ty - ry) > 0.3) cr = requestAnimationFrame(follow);
    };
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      dot.style.opacity = ring.style.opacity = '1';
      if (!cr) cr = requestAnimationFrame(follow);
    }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest ? e.target.closest('a,button,summary,input,label') : null;
      ringIn.classList.toggle('is-hover', !!t);
    });
    d.addEventListener('mouseleave', function () { dot.style.opacity = ring.style.opacity = '0'; });
    KV.onMotion && KV.onMotion(function (c) { if (c) { d.classList.remove('kv-cursor'); dot.remove(); ring.remove(); } });
  }
  KV.onMotion && KV.onMotion(function () { kick(); });
})();
