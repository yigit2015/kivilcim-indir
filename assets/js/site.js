/* Kıvılcım sitesi: bütün sayfalarda ortak davranış. Üçüncü taraf istek yok. */
(function () {
  'use strict';
  var d = document.documentElement;
  var KEY = 'kivilcim-site-calm';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var stored = null;
  try { stored = window.localStorage.getItem(KEY); } catch (e) { stored = null; }

  var KV = (window.KV = window.KV || {});
  var listeners = [];
  KV.calm = false;
  KV.onMotion = function (fn) { listeners.push(fn); };

  function applyMotion() {
    var calm = reduce.matches || stored === '1';
    KV.calm = calm;
    if (calm) d.setAttribute('data-motion', 'calm');
    else d.removeAttribute('data-motion');
    var toggles = document.querySelectorAll('.calm-toggle');
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].setAttribute('aria-pressed', calm ? 'true' : 'false');
      toggles[i].disabled = reduce.matches;
      var hint = toggles[i].querySelector('[data-calm-hint]');
      if (hint) hint.textContent = reduce.matches ? 'Açık (sistem ayarı)' : calm ? 'Açık' : 'Kapalı';
    }
    for (var j = 0; j < listeners.length; j++) listeners[j](calm);
  }
  applyMotion();
  if (reduce.addEventListener) reduce.addEventListener('change', applyMotion);
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.calm-toggle');
    if (!t || reduce.matches) return;
    stored = KV.calm ? '0' : '1';
    try { window.localStorage.setItem(KEY, stored); } catch (err) { /* depolama kapalı: yalnız bu sayfada */ }
    applyMotion();
  });
  // Sayfalar arası geçiş: sade harekette atla.
  window.addEventListener('pagereveal', function (e) { if (KV.calm && e.viewTransition) e.viewTransition.skipTransition(); });
  window.addEventListener('pageswap', function (e) { if (KV.calm && e.viewTransition) e.viewTransition.skipTransition(); });

  // ── Menü (dar ekran) ──────────────────────────────────────────────────────
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('menu');
  if (menuBtn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
    };
    menuBtn.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); menuBtn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) setOpen(false);
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  // ── Görünürlük: döngüler ekran dışında ve gizli sekmede durur ─────────────
  var onVis = function () { d.classList.toggle('is-hidden', document.hidden); };
  document.addEventListener('visibilitychange', onVis);
  onVis();
  var loopIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) entries[i].target.classList.toggle('is-paused', !entries[i].isIntersecting);
  }) : null;
  KV.watchLoop = function (el) { if (el && loopIO) loopIO.observe(el); };

  // ── İşletim sistemi ───────────────────────────────────────────────────────
  var BASE = 'https://github.com/yigit2015/kivilcim-indir/releases/latest/download/';
  var WEB = 'https://claude.ai/artifact/Xjzge8CMprANM8s2r9yocx';
  function detectOS() {
    var ua = navigator.userAgent || '';
    var p = ((navigator.userAgentData && navigator.userAgentData.platform) || '').toLowerCase();
    if (/android/i.test(ua) || p === 'android') return 'android';
    if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
    if (/windows/i.test(ua) || p === 'windows') return 'windows';
    if (/cros/i.test(ua) || p === 'chrome os') return null;
    if (/macintosh|mac os x/i.test(ua) || p === 'macos') return 'mac';
    if (/linux/i.test(ua) || p === 'linux') return 'linux';
    return null;
  }
  var OS = {
    windows: { label: 'Windows için indir', href: BASE + 'Kivilcim-windows-kurulum.exe' },
    mac: { label: 'Mac için indir', href: BASE + 'Kivilcim-mac.dmg' },
    linux: { label: 'Linux için indir', href: BASE + 'Kivilcim-linux.AppImage' },
    android: { label: 'Android için indir', href: BASE + 'Kivilcim-android.apk' },
    ios: { label: 'Tarayıcıda dene', href: WEB, web: true }
  };
  var os = detectOS();
  KV.os = os;
  if (os) d.setAttribute('data-os', os);
  var mine = os && OS[os];
  var cta = document.querySelector('[data-os-cta]');
  if (cta && mine) {
    cta.querySelector('[data-os-label]').textContent = mine.label;
    cta.setAttribute('href', mine.href);
    if (!mine.web) cta.setAttribute('data-dl', '');
    var alt = document.querySelector('[data-os-alt]');
    if (mine.web && alt) alt.hidden = true;
    var line = document.querySelector('[data-os-line]');
    if (line && line.getAttribute('data-' + os)) line.textContent = line.getAttribute('data-' + os);
  }
  var grid = document.querySelector('.dl-grid');
  var card = grid && os ? grid.querySelector('[data-os="' + os + '"]') : null;
  if (card) {
    card.classList.add('is-mine');
    grid.insertBefore(card, grid.firstElementChild);
    var main = card.querySelector('.btn-ghost');
    if (main) { main.classList.remove('btn-ghost'); main.classList.add('btn-primary'); }
  }

  // ── İndirme geri bildirimi (bağlantı bekletilmez) ─────────────────────────
  var SPARK = 'M12 0.5C12.9 7.2 16.8 11.1 23.5 12C16.8 12.9 12.9 16.8 12 23.5C11.1 16.8 7.2 12.9 0.5 12C7.2 11.1 11.1 7.2 12 0.5Z';
  function sparkBurst(btn) {
    if (KV.calm || !btn.animate) return;
    for (var i = 0; i < 3; i++) {
      var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      s.setAttribute('viewBox', '0 0 24 24');
      s.setAttribute('aria-hidden', 'true');
      s.setAttribute('class', 'spark');
      s.style.left = '50%';
      s.style.top = '0';
      s.innerHTML = '<path d="' + SPARK + '" fill="url(#spark-g)"/>';
      btn.appendChild(s);
      var dx = (i - 1) * 28;
      var a = s.animate([
        { transform: 'translate(-8px, 0) scale(0.4)', opacity: 0 },
        { transform: 'translate(' + (dx * 0.4 - 8) + 'px, -26px) scale(1.2)', opacity: 1, offset: 0.2 },
        { transform: 'translate(' + (dx - 8) + 'px, -64px) scale(0.6) rotate(200deg)', opacity: 0 }
      ], { duration: 620, delay: i * 55, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' });
      a.onfinish = (function (node) { return function () { node.remove(); }; })(s);
    }
  }
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.btn');
    if (!b) return;
    b.classList.add('is-pressed');
    var up = function () { b.classList.remove('is-pressed'); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-dl]');
    if (!a) return;
    sparkBurst(a);
    var status = document.getElementById(a.getAttribute('data-status') || 'dl-status');
    if (status) {
      status.innerHTML = '';
      status.appendChild(document.createTextNode('İndirme bağlantısı açıldı; tarayıcının indirmeler listesine bak. Başlamadıysa: '));
      var l = document.createElement('a');
      l.href = 'https://github.com/yigit2015/kivilcim-indir/releases';
      l.textContent = 'Tüm sürümler';
      status.appendChild(l);
    }
  });
})();
