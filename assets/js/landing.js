/* Kıvılcım ana sayfa — hareket ve etkileşim. GSAP + ScrollTrigger + Lenis. */
(function () {
'use strict';
var KV_ASSETS = (function () { var s = document.querySelector('script[src*="landing.js"]'); return s ? s.src.replace(/js\/landing\.js.*$/, '') : 'assets/'; })();
class DCLogic { constructor() { this.props = {"emberCount":70,"grain":true}; } }
/* ============================================================
   Kıvılcım landing — motion + interaction engine
   GSAP + ScrollTrigger + Lenis (uploaded assets). Sections pin with
   CSS position:sticky; animations use transform/opacity.
   Content and colors come from KivilcimSwift (swift-iphone branch).
   Interactive pieces (Today, game, avatar maker,
   widgets, watching Kıvı, carousel, TR/EN) work with or
   without the motion layer.
   ============================================================ */

// Kıvı (KiviArt.swift), viewBox 0 0 100 110
var KV = {
  o: 'M50 2 C55 12 63 17 67 25 C71 22 73 17 73 12 C83 22 91 37 90 55 C94 58 96 64 94 71 C92 93 74 107 50 107 C26 107 8 93 6 71 C4 64 6 58 10 55 C9 39 18 28 29 20 C31 26 35 29 40 27 C40 17 44 9 50 2 Z',
  m: 'M50 20 C54 28 61 32 64 39 C67 37 69 34 69 31 C77 40 82 51 81 64 C84 67 84 72 83 76 C82 93 68 102 50 102 C32 102 18 93 17 76 C16 72 16 67 19 64 C18 52 24 43 32 37 C34 41 37 43 41 42 C41 33 45 26 50 20 Z',
  c: 'M50 42 C57 52 71 57 72 74 C73 90 63 99 50 99 C37 99 27 90 28 74 C29 57 43 52 50 42 Z',
  e: 'M80 29 C81.9 32.8 83.8 35.2 83.8 38 C83.8 40.4 82.1 42 80 42 C77.9 42 76.2 40.4 76.2 38 C76.2 35.2 78.1 32.8 80 29 Z'
};
// FlameTier.ladder (FlameTier.swift): id, tr, en, min day, outer[0], outer[1], inner[0], outer[2], glow
// Kutup Işığı'ndan (130. gün) sonrası sitede gizli: siluet + ???
var OPEN_TIERS = 7;
var TIERS = [
  ['ember', 'Turuncu Alev', 'Orange Flame', 0, '#FF4A2B', '#FF7A1A', '#FFD166', '#FFB23F', '#FF7A1A'],
  ['gold', 'Altın Alev', 'Gold Flame', 7, '#FF9F1C', '#FFC94D', '#FFF3B0', '#FFE8A3', '#FFC94D'],
  ['plasma', 'Mavi Plazma', 'Blue Plasma', 30, '#2F6BFF', '#2FD2FF', '#CFFAFF', '#9FF4FF', '#2FD2FF'],
  ['jade', 'Zümrüt Alev', 'Emerald Flame', 45, '#0FA968', '#2BD48A', '#D4FFE8', '#9CF5C8', '#2BD48A'],
  ['rose', 'Gül Alevi', 'Rose Flame', 60, '#E0306E', '#FF5FA2', '#FFE0EE', '#FFB3D1', '#FF5FA2'],
  ['ruby', 'Yakut Alev', 'Ruby Flame', 75, '#B0102E', '#E8344E', '#FFD0C8', '#FF8A8A', '#E8344E'],
  ['nova', 'Mor Nova', 'Purple Nova', 100, '#7A2BFF', '#A45CFF', '#F1DEFF', '#E0B8FF', '#A45CFF'],
  ['aurora', 'Kutup Işığı', 'Aurora', 130, '#1B9E8F', '#47E6C1', '#DFFFF6', '#B58CFF', '#47E6C1'],
  ['solar', 'Güneş Alevi', 'Solar Flame', 165, '#FF6A00', '#FFB000', '#FFFBE0', '#FFF1A6', '#FFB000'],
  ['frost', 'Buz Alevi', 'Frost Flame', 210, '#5AA8FF', '#A8DBFF', '#F4FBFF', '#EAF7FF', '#A8DBFF'],
  ['shadow', 'Gölge Alev', 'Shadow Flame', 250, '#3A1F6E', '#6A35D0', '#E6D6FF', '#B07CFF', '#8A4DFF'],
  ['phoenix', 'Anka Alevi', 'Phoenix Flame', 300, '#C81E1E', '#FF5A1F', '#FFE9A8', '#FFC94D', '#FF5A1F'],
  ['star', 'Beyaz Yıldız', 'White Star', 365, '#FF5FA2', '#FFE8FF', '#FFFFFF', '#9FF4FF', '#FFE8FF'],
  ['comet', 'Kuyruklu Yıldız', 'Comet', 450, '#2C3E9E', '#5C7CFF', '#F3F5FF', '#FFD6F5', '#8FA8FF'],
  ['galaxy', 'Galaksi', 'Galaxy', 550, '#3B1C8C', '#C04DFF', '#FFE6FF', '#5CE1FF', '#C04DFF'],
  ['prism', 'Prizma', 'Prism', 730, '#FF4A6B', '#FFD13B', '#FFF8E6', '#4AE3FF', '#FFD13B'],
  ['legend', 'Efsane', 'Legend', 1000, '#B8860B', '#FFD700', '#FFFDF0', '#FFF8DC', '#FFD700']
];
// Alev avatarları (Avatar.swift AvatarArt + catalog domain/avatars)
var AV_GEO = {
  drop: { b: 'M50 5 C62 26 84 40 84 67 C84 91 69 106 50 106 C31 106 16 91 16 67 C16 40 38 26 50 5 Z', c: 'M50 45 C57 57 68 64 68 77 C68 89 60 97 50 97 C40 97 32 89 32 77 C32 64 43 57 50 45 Z', ex: [41, 59], ey: 74 },
  slim: { b: 'M50 1 C58 25 77 43 77 70 C77 92 65 106 50 106 C35 106 23 92 23 70 C23 43 42 25 50 1 Z', c: 'M50 46 C55 58 64 66 64 78 C64 90 58 97 50 97 C42 97 36 90 36 78 C36 66 45 58 50 46 Z', ex: [43, 57], ey: 75 },
  round: { b: 'M50 14 C64 30 91 44 91 70 C91 93 72 106 50 106 C28 106 9 93 9 70 C9 44 36 30 50 14 Z', c: 'M50 47 C61 57 75 65 75 78 C75 91 64 98 50 98 C36 98 25 91 25 78 C25 65 39 57 50 47 Z', ex: [40, 60], ey: 75 },
  twin: { b: 'M35 5 C39 19 45 27 50 32 C55 27 61 19 65 5 C75 27 86 42 86 68 C86 92 70 106 50 106 C30 106 14 92 14 68 C14 42 25 27 35 5 Z', c: 'M50 45 C57 57 68 64 68 77 C68 89 60 97 50 97 C40 97 32 89 32 77 C32 64 43 57 50 45 Z', ex: [41, 59], ey: 74 }
};
var AV_PAL = [
  ['ember', 'Kor', 'Ember', '#FF8A2B', '#FFCB5C'], ['amber', 'Kehribar', 'Amber', '#F59E0B', '#FFE4A3'], ['gold', 'Altın', 'Gold', '#E7A516', '#FFF1BD'],
  ['crimson', 'Kızıl', 'Crimson', '#E8402F', '#FFB39E'], ['rose', 'Gül', 'Rose', '#F2609E', '#FFD3E6'], ['violet', 'Ametist', 'Amethyst', '#8B5CF6', '#DCCBFF'],
  ['steel', 'Çelik', 'Steel', '#5A7FA8', '#D4E3F3'], ['ice', 'Buz', 'Ice', '#4E9FE0', '#DCEFFF'], ['teal', 'Deniz', 'Sea', '#139E9E', '#A9F0EA'],
  ['jade', 'Yeşim', 'Jade', '#20B26B', '#B6F2D2'], ['cocoa', 'Kakao', 'Cocoa', '#9C6136', '#F4D5B3'], ['charcoal', 'Kömür', 'Charcoal', '#3B3B42', '#F3EFE6']
];
// id, tr, en, shape, body, core, eyes, mouth, extra, rare
var AV_PRESETS = [
  ['ember', 'Kor', 'Ember', 'drop', '#FF8A2B', '#FFCB5C', 'dot', 'smile'],
  ['amber', 'Kehribar', 'Amber', 'slim', '#F59E0B', '#FFE4A3', 'big', 'smile'],
  ['charcoal', 'Kömür', 'Charcoal', 'round', '#3B3B42', '#F3EFE6', 'ring', 'smile'],
  ['gold', 'Altın', 'Gold', 'round', '#E7A516', '#FFF1BD', 'happy', 'smile'],
  ['jade', 'Yeşim', 'Jade', 'drop', '#20B26B', '#B6F2D2', 'big', 'smile'],
  ['violet', 'Ametist', 'Amethyst', 'twin', '#8B5CF6', '#DCCBFF', 'dot', 'smile'],
  ['rose', 'Gül', 'Rose', 'twin', '#F2609E', '#FFD3E6', 'happy', 'smile'],
  ['crimson', 'Kızıl', 'Crimson', 'slim', '#E8402F', '#FFB39E', 'sleepy', 'smile'],
  ['teal', 'Deniz', 'Sea', 'twin', '#139E9E', '#A9F0EA', 'square', 'smile'],
  ['steel', 'Çelik', 'Steel', 'drop', '#5A7FA8', '#D4E3F3', 'square', 'smile'],
  ['cocoa', 'Kakao', 'Cocoa', 'round', '#9C6136', '#F4D5B3', 'ring', 'smile'],
  ['ice', 'Buz', 'Ice', 'slim', '#4E9FE0', '#DCEFFF', 'wink', 'smile'],
  ['flamingo', 'Flamingo', 'Flamingo', 'slim', '#FF5FA2', '#FFD6E8', 'happy', 'smile', '', 1],
  ['trex', 'T-Rex', 'T-Rex', 'round', '#2FAE5E', '#C6F5D5', 'big', 'smile', '', 1],
  ['alien', 'Uzaylı', 'Alien', 'drop', '#6FDB8F', '#E4FFEE', 'big', 'flat', 'antennae', 1],
  ['wizard', 'Büyücü', 'Wizard', 'twin', '#6D3FD9', '#E1D3FF', 'sleepy', 'smile', 'star', 1],
  ['peacock', 'Tavus Kuşu', 'Peacock', 'drop', '#0E9C8E', '#9EE6FF', 'dot', 'smile', 'crest', 1]
];
var AV_EYES = [['dot', 'Nokta', 'Dot'], ['big', 'Kocaman', 'Big'], ['happy', 'Mutlu', 'Happy'], ['sleepy', 'Uykulu', 'Sleepy'], ['wink', 'Göz kırpan', 'Wink'], ['ring', 'Halka', 'Ring'], ['square', 'Piksel', 'Pixel']];
var AV_SHAPES = [['drop', 'Damla', 'Drop'], ['slim', 'İnce', 'Slim'], ['round', 'Tombul', 'Chubby'], ['twin', 'Çift uç', 'Twin tip']];

// Isı haritası örnek verisi (eski ana sayfayla aynı tohum); son gün sabit
var HEAT_END = [2026, 9, 24];
var MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
var MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var MONTHS_TR_LONG = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
var DAYS_TR = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
var DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var WEEKS = [[4, 3, 5, 4, 2, 3, 4], [3, 4, 2, 5, 3, 1, 4]];
function heatData() {
  var a = 20260928;
  var rnd = function () { a |= 0; a = (a + 0x6d2b79f5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  var today = new Date(HEAT_END[0], HEAT_END[1], HEAT_END[2], 12);
  var dow = (today.getDay() + 6) % 7;
  var start = new Date(today); start.setDate(today.getDate() - dow - 52 * 7);
  var weeks = [], months = [], last = -1, active = 0;
  for (var w = 0; w < 53; w++) {
    var cells = [];
    for (var dd = 0; dd < 7; dd++) {
      var date = new Date(start); date.setDate(start.getDate() + w * 7 + dd);
      var lvl = 0;
      if (date <= today) {
        var pr = 0.22 + 0.66 * (w / 52), gap = w >= 19 && w <= 20;
        if (!gap && rnd() < pr) lvl = Math.min(4, 1 + Math.floor(rnd() * (2 + w / 18)));
        if (lvl) active++;
        cells.push({ cls: 'hc l' + lvl, i: w * 7 + dd, l: lvl });
      } else cells.push({ cls: 'hc hc--x', i: w * 7 + dd, l: -1 });
      if (dd === 0 && date.getMonth() !== last && date.getDate() <= 7) {
        last = date.getMonth();
        months.push({ tr: MONTHS_TR[last], en: MONTHS_EN[last], c: w + 1, cn: Math.max(1, w - 26), cls: w < 27 ? 'old' : '' });
      }
    }
    weeks.push({ cls: 'wk' + (w < 27 ? ' old' : ''), c: w, cells: cells });
  }
  return { weeks: weeks, months: months, active: active, start: start };
}

class Component extends DCLogic {

  /* ---------- template data ---------- */
  renderVals() {
    if (!this._setRoot) this._setRoot = (el) => { this.root = el; };
    const chars = (s) => Array.from(s).map((c) => ({ c: c }));
    const words = (s) => s.split(' ').map((w) => ({ chars: chars(w) }));
    const hl = (s, n) => s.split(' ').map((w, i) => ({ w: w, cls: i < n ? 'w w--hl' : 'w' }));
    const dayTr = (d) => (d === 0 ? 'Başlangıç' : d + '. gün');
    const dayEn = (d) => (d === 0 ? 'Start' : 'Day ' + d);
    if (!this._heat) this._heat = heatData();
    const heat = this._heat;
    return {
      setRoot: this._setRoot,
      grainCls: (this.props.grain ?? true) ? 'grain' : 'grain grain--off',
      kv: KV,
      tiers: TIERS.map((t, i) => (i <= OPEN_TIERS
        ? { id: t[0], open: true, lock: false, name: t[1], en: t[2], day: dayTr(t[3]), dayEn: dayEn(t[3]), o: t[4], m: t[5], c: t[6], e: t[7], g: t[8], rung: t[5], cls: 'tier__nm' }
        : { id: t[0], open: false, lock: true, name: '???', en: '???', day: 'Kilitli · ' + dayTr(t[3]), dayEn: 'Locked · ' + dayEn(t[3]), o: '#26262B', m: '#2E2E34', c: '#38383F', e: '#2E2E34', g: '#6A6A75', rung: '#3A3A42', cls: 'tier__nm tier__nm--lock' })),
      strip: [1, 2, 3, 4, 5, 6, 7].map((n) => ({
        n: String(n), done: n < 4, gift: n === 4 || n === 7,
        cls: 'sday' + (n < 4 ? ' sday--done' : '') + (n === 4 ? ' sday--today' : '') + (n === 7 ? ' sday--big' : '')
      })),
      presets: AV_PRESETS.map((p) => {
        const g = AV_GEO[p[3]];
        return { id: p[0], name: p[1], en: p[2], b: g.b, c: g.c, body: p[4], core: p[5], ex1: g.ex[0], ex2: g.ex[1], ey: g.ey, cls: 'pav' + (p[9] ? ' pav--rare' : '') };
      }),
      shapes: AV_SHAPES.map((s) => ({ id: s[0], name: s[1], en: s[2], b: AV_GEO[s[0]].b })),
      palettes: AV_PAL.map((c) => ({ id: c[0], name: c[1], en: c[2], body: c[3], core: c[4] })),
      eyes: AV_EYES.map((e) => ({ id: e[0], name: e[1], en: e[2] })),
      cap1: words('Küçük başla.'), cap1en: words('Start small.'),
      cap2: words('Her gün bir adım.'), cap2en: words('One step a day.'),
      cap3: words('Alev al.'), cap3en: words('Catch fire.'),
      ctaWords: words('Kıvılcımını yakmaya hazır mısın?'), ctaWordsEn: words('Ready to light your spark?'),
      brand: chars('KIVILCIM'),
      days: [['Pzt', 'Mon'], ['Sal', 'Tue'], ['Çar', 'Wed'], ['Per', 'Thu'], ['Cum', 'Fri'], ['Cmt', 'Sat'], ['Paz', 'Sun']].map((d) => ({ d: d[0], en: d[1] })),
      streakWords: hl('7 gün = bir alışkanlığın başlangıcı', 2),
      streakWordsEn: hl('7 days = the start of a habit', 2),
      heatWeeks: heat.weeks, heatMonths: heat.months,
      heatSum: heat.active + ' aktif gün', heatSumEn: heat.active + ' active days',
      bars: WEEKS[0].map((v, i) => ({ v: v, h: (v / 5).toFixed(2), d: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][i], en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], cls: 'bar' + (i === 6 ? ' bar--today' : '') }))
    };
  }

  /* ---------- lifecycle ---------- */
  componentDidMount() {
    this._alive = true;
    this._cleanups = [];
    this._langHooks = [];
    let tries = 0;
    const boot = () => {
      if (!this._alive) return;
      const ready = window.gsap && window.ScrollTrigger && window.Lenis;
      if (ready || ++tries > 80) return this.init();
      this._bootT = setTimeout(boot, 50);
    };
    boot();
  }

  componentWillUnmount() {
    this._alive = false;
    clearTimeout(this._bootT);
    (this._cleanups || []).forEach((f) => { try { f(); } catch (e) {} });
    this._cleanups = [];
  }

  on(target, type, fn, opts) {
    if (!target) return;
    target.addEventListener(type, fn, opts);
    this._cleanups.push(() => target.removeEventListener(type, fn, opts));
  }

  t(tr, en) { return this.lang === 'en' ? en : tr; }

  // run one interactive block; a failure in one never takes the page down
  safe(name, fn) { try { fn.call(this); } catch (e) { if (window.console) console.warn('[kivilcim] ' + name, e); } }

  /* ---------- setup ---------- */
  init() {
    const root = this.root || document.querySelector('.kv');
    if (!root || this._inited) return;
    this._inited = true;
    this.r = root;
    this.$ = (s) => root.querySelector(s);
    this.$$ = (s) => Array.from(root.querySelectorAll(s));

    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tall = window.innerHeight > 1600; // canvas preview frame, not a real viewport
    const libs = !!(window.gsap && window.ScrollTrigger && window.Lenis);
    this.fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.motion = !(this.reduce || tall || !libs);

    this.setVh(tall);
    this.safe('lang', this.initLang);
    this.safe('menu', this.initMenu);
    this.safe('video', this.loadVideo);

    // interactive pieces: work in every mode
    this.safe('today', this.initTodayTap);
    this.safe('insights', this.initInsights);
    this.safe('game', this.initGame);
    this.safe('maker', this.initMaker);
    this.safe('widgets', this.initWidgets);
    this.safe('watch', this.initWatch);
    this.safe('carousel', this.initCarousel);
    this.safe('spark', this.initSpark);

    if (!this.motion) { this.initStatic(); return; }

    root.classList.add('kv--motion');
    const gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    ST.config({ ignoreMobileResize: true });
    try { history.scrollRestoration = 'manual'; } catch (e) {}
    window.scrollTo(0, 0);

    this.lenis = new window.Lenis({ lerp: 0.07, wheelMultiplier: 0.9, smoothWheel: true, anchors: true });
    this.lenis.on('scroll', ST.update);
    this.lenis.stop();

    this.vel = 0; this.skew = 0; this.lastY = window.scrollY;
    const tick = (t) => { this.lenis.raf(t * 1000); this.frame(); };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ST.addEventListener('refreshInit', () => this.setVh(false));

    this.ctx = gsap.context(() => {
      this.initEmbers();
      this.initProgress();
      this.initHero();
      this.initMarquee();
      this.initToday();
      this.initFeatures();
      this.initStreak();
      this.initTiers();
      this.initReveals();
      this.initStats();
      this.initCta();
      this.initFooter();
      if (this.fine) { this.initCursor(); this.initMagnets(); this.initTilt(); }
      this.initPreloader();
    }, root);

    this._cleanups.push(() => {
      gsap.ticker.remove(tick);
      if (this.ctx) this.ctx.revert();
      if (this.lenis) this.lenis.destroy();
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this._alive && ST.refresh());
    this.on(window, 'load', () => ST.refresh());
  }

  setVh(tall) {
    const h = tall ? 900 : window.innerHeight;
    this.r.style.setProperty('--vh', (h / 100) + 'px');
  }

  initStatic() {
    if (this.videoReady) this.videoReady.then(() => { try { this.video.currentTime = 5.2; } catch (e) {} });
  }

  /* ---------- TR / EN ---------- */
  initLang() {
    // a page built in English already carries data-tr (the Turkish originals)
    this.$$('[data-en]').forEach((el) => { if (el.dataset.tr == null) el.dataset.tr = el.textContent; });
    this.$$('[data-en-label]').forEach((el) => { if (el.dataset.trLabel == null) el.dataset.trLabel = el.getAttribute('aria-label') || ''; });
    this.$$('[data-en-alt]').forEach((el) => { if (el.dataset.trAlt == null) el.dataset.trAlt = el.getAttribute('alt') || ''; });
    this.$$('[data-en-href]').forEach((el) => { if (el.dataset.trHref == null) el.dataset.trHref = el.getAttribute('href') || ''; });
    let saved = null;
    try { saved = window.localStorage.getItem('kivilcim-site-lang'); } catch (e) {}
    const nav = (navigator.language || 'tr').toLowerCase();
    const forced = window.KV_LANG; // /en/ opens in English
    this.setLang(forced === 'en' || forced === 'tr' ? forced : (saved === 'en' || saved === 'tr' ? saved : (nav.indexOf('tr') === 0 ? 'tr' : 'en')), false);
    this.on(this.$('.pill--lang'), 'click', () => {
      this.setLang(this.lang === 'en' ? 'tr' : 'en', true);
      if (window.ScrollTrigger && this.motion) window.ScrollTrigger.refresh();
    });
  }

  setLang(l, save) {
    this.lang = l;
    const en = l === 'en';
    this.r.setAttribute('data-lang', l);
    try { document.documentElement.lang = l; } catch (e) {}
    this.$$('[data-en]').forEach((el) => { el.textContent = en ? el.dataset.en : el.dataset.tr; });
    this.$$('[data-en-label]').forEach((el) => { el.setAttribute('aria-label', en ? el.dataset.enLabel : el.dataset.trLabel); });
    this.$$('[data-en-alt]').forEach((el) => { el.setAttribute('alt', en ? el.dataset.enAlt : el.dataset.trAlt); });
    this.$$('[data-en-href]').forEach((el) => { el.setAttribute('href', en ? el.dataset.enHref : el.dataset.trHref); });
    if (save) { try { window.localStorage.setItem('kivilcim-site-lang', l); } catch (e) {} }
    (this._langHooks || []).forEach((f) => { try { f(); } catch (e) {} });
  }

  onLang(f) { this._langHooks.push(f); }

  /* ---------- small-screen menu ---------- */
  initMenu() {
    const nav = this.$('.nav'), b = this.$('.nav__menu');
    if (!nav || !b) return;
    const set = (o) => { nav.classList.toggle('is-open', o); b.setAttribute('aria-expanded', o ? 'true' : 'false'); };
    this.on(b, 'click', (e) => { e.stopPropagation(); set(!nav.classList.contains('is-open')); });
    this.$$('.nav__links a').forEach((a) => this.on(a, 'click', () => set(false)));
    this.on(document, 'click', (e) => { if (!nav.contains(e.target)) set(false); });
    this.on(document, 'keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); b.focus(); } });
  }

  /* ---------- video: fetched as a blob so seeking works everywhere ---------- */
  loadVideo() {
    const SRC = KV_ASSETS + 'video/kivilcim-hero.mp4';
    const v = this.$('.hero__video');
    if (!v) return;
    this.video = v;
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    this.vCur = 0; this.vTarget = 0; this.vReady = false;
    this.videoReady = new Promise((resolve) => {
      const done = () => { if (!this.vReady) { this.vReady = true; resolve(); } };
      v.addEventListener('loadeddata', () => {
        const p = v.play();
        const settle = () => { try { v.pause(); v.currentTime = this.vCur || 0; } catch (e) {} done(); };
        if (p && p.then) p.then(settle).catch(settle); else settle();
      }, { once: true });
      v.addEventListener('error', done, { once: true });
      fetch(SRC)
        .then((r) => { if (!r.ok) throw new Error('video'); return r.blob(); })
        .then((b) => { this._blobUrl = URL.createObjectURL(b); v.src = this._blobUrl; v.load(); })
        .catch(() => { v.src = SRC; v.load(); });
    });
    this._cleanups.push(() => { if (this._blobUrl) URL.revokeObjectURL(this._blobUrl); });
  }

  /* ---------- per-frame work (gsap ticker) ---------- */
  frame() {
    const dt = window.gsap.ticker.deltaRatio(60);
    const y = window.scrollY;
    const dy = y - this.lastY; this.lastY = y;
    this.vel += (dy - this.vel) * 0.2;
    if (this.vReady && this.video && this.video.duration) {
      this.vCur += (this.vTarget - this.vCur) * Math.min(1, 0.09 * dt);
      if (Math.abs(this.video.currentTime - this.vCur) > 0.015 && !this.video.seeking) {
        try { this.video.currentTime = this.vCur; } catch (e) {}
      }
    }
    if (this.mqOn && this.mq) {
      const boost = Math.min(Math.abs(this.vel), 90);
      for (const m of this.mq) {
        m.x += m.dir * (0.03 + boost * 0.011) * dt;
        if (m.x <= -50) m.x += 50;
        if (m.x > 0) m.x -= 50;
        m.set(m.x);
      }
      const target = Math.max(-12, Math.min(12, this.vel * 0.3));
      this.skew += (target - this.skew) * 0.12;
      this.mqSkew.forEach((s) => s(this.skew));
    }
    this.drawEmbers(dt);
  }

  /* ---------- preloader ---------- */
  initPreloader() {
    const gsap = window.gsap;
    const pre = this.$('.pre'), spark = this.$('.pre__spark'), num = this.$('.pre__num');
    const o = { v: 0 };
    const set = () => { num.textContent = Math.round(o.v); };
    const wait = Promise.race([this.videoReady || Promise.resolve(), new Promise((r) => setTimeout(r, 3500))]);
    const tl = gsap.timeline();
    tl.fromTo(spark, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(3)' })
      .to(spark, { scale: 2.6, duration: 1.5, ease: 'power2.inOut' }, 0.3)
      .to(o, { v: 88, duration: 1.5, ease: 'power2.inOut', onUpdate: set }, 0.3)
      .add(() => { tl.pause(); wait.then(() => { if (this._alive) tl.resume(); }); })
      .to(o, { v: 100, duration: 0.45, ease: 'power1.out', onUpdate: set })
      .to(spark, { scale: 40, opacity: 0, duration: 0.7, ease: 'power3.in' }, '>-0.05')
      .to('.pre__count', { y: -40, opacity: 0, duration: 0.5, ease: 'power2.in' }, '<')
      .to(pre, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.25')
      .add(() => this.intro(), '-=0.55')
      .set(pre, { display: 'none' });
  }

  intro() {
    const gsap = window.gsap;
    this.lenis.start();
    this.byLang(this.$('.cap--1'), '.ch').forEach((g) => {
      if (g.length) gsap.fromTo(g, { yPercent: 110, opacity: 0, rotate: 8 }, { yPercent: 0, opacity: 1, rotate: 0, stagger: 0.045, duration: 1.1, ease: 'expo.out' });
    });
    gsap.fromTo('.nav', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 });
    gsap.fromTo('.hint', { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.8 });
  }

  initProgress() {
    const setP = window.gsap.quickSetter('.progress', 'scaleX');
    window.ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => setP(s.progress) });
  }

  // chars of one element, split by language so both versions animate in parallel
  byLang(el, sel) {
    if (!el) return [[], []];
    return [Array.from(el.querySelectorAll('.l-tr ' + sel)), Array.from(el.querySelectorAll('.l-en ' + sel))];
  }

  /* ---------- hero ---------- */
  initHero() {
    const gsap = window.gsap;
    const caps = this.$$('.cap');
    const g = caps.map((c) => this.byLang(c, '.ch'));
    gsap.set('.nav', { opacity: 0 });
    gsap.set(this.$$('.cap .ch'), { yPercent: 110, opacity: 0 });
    gsap.set(caps, { filter: 'blur(0px)' });

    let hintGone = false;
    window.ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => {
        const d = (this.video && this.video.duration) || 10;
        this.vTarget = s.progress * (d - 0.05);
        if (!hintGone && s.scroll() > 12) {
          hintGone = true;
          gsap.to('.hint', { opacity: 0, y: 24, duration: 0.6, ease: 'power2.out', overwrite: true });
        }
      }
    });

    const tl = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
    g[0].forEach((ch) => { if (ch.length) tl.fromTo(ch, { yPercent: 0, opacity: 1 }, { yPercent: -70, opacity: 0, stagger: 0.03, duration: 0.8, ease: 'power2.in', immediateRender: false }, 1.3); });
    tl.fromTo(caps[0], { filter: 'blur(0px)' }, { filter: 'blur(14px)', duration: 0.9, immediateRender: false }, 1.3);
    g[1].forEach((ch) => { if (ch.length) tl.fromTo(ch, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.035, duration: 0.9, ease: 'power3.out' }, 2.7).to(ch, { yPercent: -70, opacity: 0, stagger: 0.03, duration: 0.8, ease: 'power2.in' }, 5.2); });
    tl.to(caps[1], { filter: 'blur(14px)', duration: 0.9 }, 5.2);
    g[2].forEach((ch) => { if (ch.length) tl.fromTo(ch, { yPercent: 120, opacity: 0, scale: 0.5 }, { yPercent: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 1.2, ease: 'back.out(2)' }, 6.7); });
    tl.to('.hero__dim', { opacity: 0.45, duration: 2 }, 8)
      .to(caps[2], { scale: 1.06, duration: 2 }, 8)
      .to({}, { duration: 0.5 }, 9.5);
  }

  /* ---------- marquee ---------- */
  initMarquee() {
    const gsap = window.gsap;
    this.mq = this.$$('.mq__track').map((el, i) => ({ el: el, x: -25, dir: i % 2 ? 1 : -1, set: gsap.quickSetter(el, 'xPercent') }));
    this.mq.forEach((m) => m.set(m.x));
    this.mqSkew = this.$$('.mq__row').map((el) => gsap.quickSetter(el, 'skewX', 'deg'));
    window.ScrollTrigger.create({ trigger: '.mq', start: 'top bottom', end: 'bottom top', onToggle: (s) => { this.mqOn = s.isActive; } });
    gsap.from('.mq__row', { opacity: 0, y: 80, stagger: 0.15, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.mq', start: 'top 85%' } });
  }

  /* ---------- Bugün: entrance (motion) ---------- */
  initToday() {
    const gsap = window.gsap;
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.ph', start: 'top 80%', end: 'top top', scrub: 0.8 } });
    tl.fromTo('.phone',
        { y: () => window.innerHeight * 0.6, rotationX: 50, rotationY: -28, rotationZ: 9, scale: 0.75, opacity: 0, transformPerspective: 1400 },
        { y: 0, rotationX: 0, rotationY: 0, rotationZ: 0, scale: 1, opacity: 1, transformPerspective: 1400, duration: 3, ease: 'power3.out' }, 0)
      .fromTo('.badge', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, stagger: 0.3, duration: 0.8, ease: 'back.out(2)' }, 2)
      .fromTo(['.bh', '.bpills', '.bweek', '.btasks'], { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, 2.1)
      .fromTo('.core', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(2)' }, 2.4)
      .fromTo('.ob__pop', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, stagger: 0.12, duration: 0.5, ease: 'back.out(2.5)' }, 2.6);
    [70, -90, 130].forEach((amt, i) => {
      const el = this.$$('.badge__p')[i];
      if (el) gsap.fromTo(el, { y: amt }, { y: -amt, ease: 'none', scrollTrigger: { trigger: '.ph', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    gsap.from('.ph__copy > *', { y: 50, opacity: 0, stagger: 0.08, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.ph', start: 'top 70%', toggleActions: 'play none none reverse' } });
  }

  /* ---------- Bugün: tap to tick (all modes) ---------- */
  initTodayTap() {
    const obs = this.$$('.ob');
    if (!obs.length) return;
    const btns = obs.map((o) => o.querySelector('.ob__in'));
    const steps = this.$$('.step');
    const arc = this.$('.core__arc'), core = this.$('.core');
    const coreN = this.$('.core__n'), tasksN = this.$('.btasks__n'), left = this.$('.btasks__left');
    const streak = this.$('.bpill__streak'), sparks = this.$('.bpill__sparks');
    const today = this.$('.bwd--today'), toast = this.$('.ph-toast'), replay = this.$('.ph-replay');
    const N = obs.length, C = 327;
    const done = obs.map(() => false);
    const count = () => done.filter(Boolean).length;
    const paint = () => {
      const k = count();
      coreN.textContent = k + '/' + N;
      tasksN.textContent = k + '/' + N;
      left.textContent = k >= N ? this.t('Hepsi tamam', 'All done')
        : this.t((N - k) + ' görev kaldı', (N - k) + (N - k === 1 ? ' task left' : ' tasks left'));
      streak.textContent = (k >= 1 ? 40 : 39) + this.t(' gün', ' days');
      sparks.textContent = String(640 + k * 10);
      arc.style.strokeDashoffset = String(C * (1 - k / N));
      today.classList.toggle('is-lit', k >= 1);
      obs.forEach((o, i) => o.classList.toggle('is-done', done[i]));
      const next = done.indexOf(false);
      obs.forEach((o, i) => o.classList.toggle('is-next', i === next && k < N));
      const s = k === 0 ? 0 : (k < N ? 1 : 2);
      steps.forEach((el, i) => el.classList.toggle('is-on', i === s));
    };
    const pop = (el) => {
      if (window.gsap && !this.reduce) window.gsap.fromTo(el, { scale: 0.82 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1,0.45)', overwrite: true });
    };
    btns.forEach((b, i) => this.on(b, 'click', () => {
      if (done[i]) return;
      done[i] = true;
      pop(b);
      const r = b.getBoundingClientRect();
      this.burst(r.left + r.width / 2, r.top + r.height / 2, 18, 0.8);
      if (count() === 1) { const s = streak.getBoundingClientRect(); this.burst(s.left + s.width / 2, s.top + s.height / 2, 14, 0.6); }
      paint();
      if (count() === N) {
        core.classList.remove('is-party'); void core.offsetWidth; core.classList.add('is-party');
        const c = core.getBoundingClientRect();
        this.burst(c.left + c.width / 2, c.top + c.height / 2, 70, 1.5);
        toast.classList.add('is-on');
        clearTimeout(this._toastT);
        this._toastT = setTimeout(() => toast.classList.remove('is-on'), 2200);
        replay.hidden = false;
      }
    }));
    this.on(replay, 'click', () => {
      done.fill(false); replay.hidden = true; toast.classList.remove('is-on'); core.classList.remove('is-party'); paint();
    });
    this._cleanups.push(() => clearTimeout(this._toastT));
    this.onLang(paint);
    paint();
  }

  /* ---------- insights: heatmap tooltip + week toggle ---------- */
  initInsights() {
    const heat = this.$('.heat');
    if (!heat) return;
    const card = this.$('.heat-card'), tip = this.$('.heat__tip');
    const start = heatData().start;
    let cur = null;
    const fmt = (i, l) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const wd = (d.getDay() + 6) % 7;
      const date = this.lang === 'en' ? DAYS_EN[wd] + ', ' + MONTHS_EN[d.getMonth()] + ' ' + d.getDate() : d.getDate() + ' ' + MONTHS_TR_LONG[d.getMonth()] + ' ' + DAYS_TR[wd];
      const res = l > 0 ? this.t(l + '/4 görev', l + '/4 tasks') : this.t('Boş gün', 'Rest day');
      return date + ' · <em>' + res + '</em>';
    };
    const show = (c) => {
      if (cur) cur.classList.remove('is-hover');
      cur = c;
      if (!c) { tip.classList.remove('is-on'); return; }
      c.classList.add('is-hover');
      tip.innerHTML = fmt(+c.dataset.i, +c.dataset.l);
      const fr = card.getBoundingClientRect(), cr = c.getBoundingClientRect();
      const half = tip.offsetWidth / 2 + 8;
      const x = Math.max(half, Math.min(fr.width - half, cr.left + cr.width / 2 - fr.left));
      tip.style.left = x.toFixed(1) + 'px';
      tip.style.top = (cr.top - fr.top - 8).toFixed(1) + 'px';
      tip.classList.add('is-on');
    };
    const pick = (e) => { const c = e.target.closest ? e.target.closest('.hc') : null; return c && !c.classList.contains('hc--x') && heat.contains(c) ? c : null; };
    this.on(heat, 'pointermove', (e) => { const c = pick(e); if (c !== cur) show(c); });
    this.on(heat, 'pointerleave', () => show(null));
    this.on(heat, 'click', (e) => {
      const c = pick(e); if (!c) return;
      show(c);
      if (+c.dataset.l > 0) { const r = c.getBoundingClientRect(); this.burst(r.left + r.width / 2, r.top + r.height / 2, 6 + +c.dataset.l * 4, 0.5); }
    });
    this.onLang(() => { if (cur) show(cur); });

    // week bars
    const bars = this.$('.bars'), cols = this.$$('.bar'), seg = this.$$('.week-seg .chip'), sum = this.$('.week-card__sum');
    let wk = 0;
    const paint = () => {
      const v = WEEKS[wk], total = v.reduce((x, y) => x + y, 0), other = WEEKS[1 - wk].reduce((x, y) => x + y, 0);
      cols.forEach((c, i) => {
        c.querySelector('.bar__v').textContent = String(v[i]);
        c.querySelector('.bar__fil').style.setProperty('--h', (v[i] / 5).toFixed(2));
        c.classList.toggle('bar--today', wk === 0 && i === 6);
      });
      seg.forEach((b) => { const on = +b.dataset.wk === wk; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      const diff = total - other;
      sum.innerHTML = '<b>' + this.t(total + ' görev', total + ' tasks') + '</b>' + (wk === 0 && diff > 0 ? this.t(' · geçen haftadan ' + diff + ' fazla', ' · ' + diff + ' more than last week') : '');
    };
    seg.forEach((b) => this.on(b, 'click', () => { wk = +b.dataset.wk; paint(); }));
    this.onLang(paint);
    paint();

    // reveal once on screen
    const tall = window.innerHeight > 1600;
    if (!this.reduce && !tall && 'IntersectionObserver' in window) {
      heat.classList.add('is-pre'); bars.classList.add('is-pre');
      const io = new IntersectionObserver((en) => {
        en.forEach((x) => { if (x.isIntersecting) { x.target.classList.remove('is-pre'); io.unobserve(x.target); } });
      }, { threshold: 0.25 });
      io.observe(heat); io.observe(bars);
      this._cleanups.push(() => io.disconnect());
    }
  }

  /* ---------- features: horizontal scroll ---------- */
  initFeatures() {
    const gsap = window.gsap;
    const row = this.$('.feat__row');
    const cards = this.$$('.card');
    const nums = this.$$('.card__num');
    const counted = cards.map(() => false);
    nums.forEach((n) => { n.textContent = '00'; });
    const checkCards = () => {
      const W = window.innerWidth, H = window.innerHeight;
      cards.forEach((c, i) => {
        if (counted[i]) return;
        const r = c.getBoundingClientRect();
        if (r.left < W * 0.88 && r.right > 0 && r.top < H * 0.8) {
          counted[i] = true;
          const o = { v: 0 };
          gsap.to(o, { v: i + 1, duration: 1.1, ease: 'power2.out', onUpdate: () => { nums[i].textContent = '0' + Math.round(o.v); } });
          gsap.fromTo(nums[i], { scale: 0.6, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(2.5)' });
        }
      });
    };
    gsap.to(row, {
      x: () => -Math.max(0, row.offsetWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: { trigger: '.feat', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true, onUpdate: checkCards, onEnter: checkCards }
    });
    window.ScrollTrigger.create({
      trigger: '.feat', start: 'top 60%', onEnter: checkCards,
      onLeaveBack: () => { counted.fill(false); nums.forEach((n) => { n.textContent = '00'; }); }
    });
    gsap.from(cards, { y: 120, opacity: 0, rotationX: -25, stagger: 0.12, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.feat', start: 'top 70%', toggleActions: 'play none none reverse' } });
    gsap.from('.feat__intro > *', { y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.feat', start: 'top 70%', toggleActions: 'play none none reverse' } });
  }

  /* ---------- week strip ---------- */
  initStreak() {
    const gsap = window.gsap;
    const dayEls = this.$$('.day__c');
    const fills = this.$$('.day__fill');
    const flames = this.$$('.day__flame');
    const words = this.byLang(this.$('.streak__text'), '.w');
    const num = this.$('.streak__num');
    gsap.set(fills, { opacity: 0, scale: 0.4 });
    gsap.set(flames, { scale: 0, yPercent: 30 });
    gsap.set(words[0].concat(words[1]), { opacity: 0, yPercent: 60 });
    num.textContent = '0';
    this.lit = 0;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.streak', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      onUpdate: () => {
        const t = tl.time();
        let n = 0;
        for (let i = 0; i < 7; i++) if (t >= i + 0.45) n++;
        if (n !== this.lit) {
          if (n > this.lit) {
            for (let i = this.lit; i < n; i++) {
              const r = dayEls[i].getBoundingClientRect();
              this.burst(r.left + r.width / 2, r.top + r.height / 2, 22, 0.9);
            }
            gsap.fromTo(num, { scale: 1.18 }, { scale: 1, duration: 0.5, ease: 'back.out(3)', overwrite: true });
          }
          this.lit = n;
          num.textContent = String(n);
        }
      }
    });
    for (let i = 0; i < 7; i++) {
      tl.to(fills[i], { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, i)
        .to(flames[i], { scale: 1, yPercent: 0, duration: 0.7, ease: 'back.out(3)' }, i + 0.15);
    }
    words.forEach((w) => { if (w.length) tl.to(w, { opacity: 1, yPercent: 0, stagger: 0.25, duration: 0.6, ease: 'power3.out' }, 7.6); });
    tl.to({}, { duration: 0.6 }, 9.4);
    gsap.from('.streak__numwrap', { scale: 0.7, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.streak', start: 'top 60%', toggleActions: 'play none none reverse' } });
  }

  /* ---------- flame tiers: 17-step Swift ladder ---------- */
  initTiers() {
    const gsap = window.gsap;
    const ks = this.$$('.tier__k'), gl = this.$$('.tier__glow'), nm = this.$$('.tier__nm'), rungs = this.$$('.rung');
    const stage = this.$('.tier__stage'), idxEl = this.$('.tier__idx');
    const N = ks.length, STEP = 0.6;
    gsap.set(ks.slice(1), { opacity: 0, scale: 0.6 });
    gsap.set(gl.slice(1), { opacity: 0 });
    gsap.set(nm.slice(1), { opacity: 0, yPercent: 60 });
    gsap.set('.ladder__fill', { scaleX: 0 });
    gsap.set(rungs.slice(1), { opacity: 0.3, scale: 0.7 });
    this.tierOn = 0;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.tiers', start: 'top top', end: 'bottom bottom', scrub: 0.7 },
      onUpdate: () => {
        const t = tl.time();
        let n = 0;
        for (let i = 1; i < N; i++) if (t >= (i - 1) * STEP + 0.75) n = i;
        if (n !== this.tierOn) {
          if (n > this.tierOn) {
            const r = stage.getBoundingClientRect();
            this.burst(r.left + r.width / 2, r.top + r.height * 0.6, n > OPEN_TIERS ? 10 : 26, n > OPEN_TIERS ? 0.5 : 1);
          }
          this.tierOn = n;
          idxEl.textContent = String(n + 1);
        }
      }
    });
    for (let i = 1; i < N; i++) {
      const at = (i - 1) * STEP + 0.5;
      tl.to(ks[i - 1], { opacity: 0, scale: 0.75, duration: 0.35 }, at)
        .fromTo(ks[i], { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, at + 0.15)
        .to(gl[i - 1], { opacity: 0, duration: 0.45 }, at)
        .to(gl[i], { opacity: 1, duration: 0.45 }, at + 0.15)
        .to(nm[i - 1], { opacity: 0, yPercent: -60, duration: 0.3 }, at)
        .fromTo(nm[i], { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.35, ease: 'power3.out' }, at + 0.2)
        .to('.ladder__fill', { scaleX: i / (N - 1), duration: 0.45, ease: 'power2.inOut' }, at + 0.1)
        .to(rungs[i], { opacity: 1, scale: 1.25, duration: 0.3, ease: 'back.out(3)' }, at + 0.2);
    }
    tl.to({}, { duration: 0.8 }, (N - 2) * STEP + 1.2);
  }

  /* ---------- entrance reveals for the plain sections (motion) ---------- */
  initReveals() {
    const gsap = window.gsap;
    this.$$('.sec .sec-head, .gal .sec-head').forEach((h) => {
      gsap.from(h.children, { y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 82%', toggleActions: 'play none none reverse' } });
    });
    const group = (sel, trig, vars) => {
      const els = this.$$(sel);
      if (!els.length || !this.$(trig)) return;
      gsap.from(els, Object.assign({ y: 70, opacity: 0, stagger: 0.08, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: trig, start: 'top 86%', toggleActions: 'play none none reverse' } }, vars || {}));
    };
    group('.heat-card', '.heat-card', { y: 60 });
    group('.week-card, .ins__list li', '.ins__grid', { y: 50 });
    group('.chest', '.game__grid', { rotationX: -15 });
    group('.gchip', '.gchips', { y: 50, stagger: 0.06 });
    group('.mk__grid > *', '.mk__grid');
    group('.itile', '.ios__grid', { rotationX: -20, stagger: 0.06 });
    group('.wg__top, .wphone, .wg__hint', '.wg__top', { y: 90 });
    group('.gal__track .shot', '.gal__track', { y: 120 });
    gsap.from('.sday', { scale: 0.3, opacity: 0, stagger: 0.07, duration: 0.6, ease: 'back.out(3)',
      scrollTrigger: { trigger: '.strip', start: 'top 88%', toggleActions: 'play none none reverse' } });
  }

  /* ---------- game layer: playable multiplier (all modes) ---------- */
  initGame() {
    const bar = this.$('.mult'), marker = this.$('.marker');
    if (!bar || !marker) return;
    const zones = this.$$('.mz');
    const btn = this.$('.game__btn'), lbl = this.$('.game__lbl'), res = this.$('.game__res');
    const widths = [21, 15, 10, 8, 10, 15, 21], mults = [1, 2, 4, 10, 4, 2, 1];
    let playing = true, visible = false, t0 = performance.now(), pos = 0.5, last = null, raf = 0;
    const period = this.reduce ? 4.6 : 2.3; // seconds for a full sweep there and back
    const loop = (now) => {
      raf = 0;
      if (!playing || !visible || !this._alive) return;
      const s = ((now - t0) / 1000) / period * Math.PI * 2;
      pos = (1 - Math.cos(s)) / 2;
      marker.style.transform = 'translateX(' + (pos * bar.clientWidth).toFixed(1) + 'px)';
      raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && playing && visible) raf = requestAnimationFrame(loop); };
    marker.style.transform = 'translateX(' + (0.5 * bar.clientWidth) + 'px)';
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; kick(); });
      io.observe(bar);
      this._cleanups.push(() => io.disconnect());
    } else { visible = true; kick(); }
    this._cleanups.push(() => cancelAnimationFrame(raf));
    const message = () => {
      if (last === null) return this.t('Göstergeyi durdur, kıvılcımı katla.', 'Stop the gauge and multiply your sparks.');
      return '8 × ' + last + ' = ' + (8 * last) + this.t(' kıvılcım', ' sparks') + (last === 10 ? this.t('. Tam isabet!', '. Bullseye!') : '');
    };
    const label = () => (playing ? this.t('Durdur', 'Stop') : this.t('Tekrar oyna', 'Play again'));
    this.on(btn, 'click', () => {
      if (playing) {
        playing = false;
        const p = pos * 100;
        let acc = 0, zi = 0;
        for (let i = 0; i < widths.length; i++) { acc += widths[i]; if (p <= acc) { zi = i; break; } }
        last = mults[zi];
        zones.forEach((z, i) => z.classList.toggle('is-hit', i === zi));
        const r = marker.getBoundingClientRect();
        this.burst(r.left + r.width / 2, r.top + r.height / 2, 14 + last * 6, 0.7 + last * 0.08);
      } else {
        playing = true; last = null;
        t0 = performance.now() - Math.acos(Math.max(-1, Math.min(1, 1 - 2 * pos))) / (Math.PI * 2) * period * 1000;
        zones.forEach((z) => z.classList.remove('is-hit'));
        kick();
      }
      res.textContent = message();
      lbl.textContent = label();
    });
    this.onLang(() => { res.textContent = message(); lbl.textContent = label(); });
    res.textContent = message(); lbl.textContent = label();
  }

  /* ---------- avatar maker ---------- */
  initMaker() {
    const stage = this.$('.mk__stage');
    if (!stage) return;
    const body = this.$('.mk-body'), core = this.$('.mk-core');
    const eyeL = this.$('.mk-eye--l'), eyeR = this.$('.mk-eye--r'), mouth = this.$('.mk-mouth');
    const glow = this.$('.mk__glow'), nameEl = this.$('.mk__name');
    const extras = { antennae: this.$('.mx--antennae'), crest: this.$('.mx--crest'), star: this.$('.mx--star') };
    const opts = this.$$('.opt[data-k]'), pavs = this.$$('.pav');
    const st = { shape: 'drop', body: '#FF8A2B', core: '#FFCB5C', eyes: 'dot', mouth: 'smile', extra: '', preset: 'ember' };
    const look = { x: 0, y: 0 };
    const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };
    const show = (group, attr, v) => Array.from(group.querySelectorAll('[' + attr + ']')).forEach((el) => {
      if (el.getAttribute(attr) === v) el.removeAttribute('display'); else el.setAttribute('display', 'none');
    });
    const placeEyes = () => {
      const g = AV_GEO[st.shape];
      eyeL.setAttribute('transform', 'translate(' + (g.ex[0] + look.x).toFixed(2) + ' ' + (g.ey + look.y).toFixed(2) + ')');
      eyeR.setAttribute('transform', 'translate(' + (g.ex[1] + look.x).toFixed(2) + ' ' + (g.ey + look.y).toFixed(2) + ')');
      mouth.setAttribute('transform', 'translate(' + (50 + look.x * 0.5).toFixed(2) + ' ' + (g.ey + 10 + look.y * 0.5).toFixed(2) + ')');
    };
    const paint = () => {
      const g = AV_GEO[st.shape];
      body.setAttribute('d', g.b); core.setAttribute('d', g.c);
      body.setAttribute('fill', st.body); core.setAttribute('fill', st.core);
      show(eyeL, 'data-eye', st.eyes); show(eyeR, 'data-eye', st.eyes);
      show(mouth, 'data-mouth', st.mouth);
      Object.keys(extras).forEach((k) => {
        const el = extras[k];
        if (!el) return;
        if (k === st.extra) el.removeAttribute('display'); else el.setAttribute('display', 'none');
        Array.from(el.querySelectorAll('.mx-b')).forEach((p) => p.setAttribute('stroke', st.body));
        Array.from(el.querySelectorAll('.mx-c')).forEach((c) => { c.setAttribute('fill', st.core); c.setAttribute('stroke', st.body); });
      });
      placeEyes();
      glow.style.background = 'radial-gradient(circle,' + rgba(st.body, 0.38) + ' 0%,' + rgba(st.body, 0.08) + ' 45%,' + rgba(st.body, 0) + ' 70%)';
      const p = AV_PRESETS.find((x) => x[0] === st.preset);
      nameEl.textContent = p ? this.t(p[1], p[2]) : this.t('Kendi alevin', 'Your own flame');
      const pal = AV_PAL.find((c) => c[3] === st.body);
      opts.forEach((o) => {
        const k = o.dataset.k, v = o.dataset.v;
        const on = (k === 'shape' && v === st.shape) || (k === 'eyes' && v === st.eyes) || (k === 'mouth' && v === st.mouth) || (k === 'pal' && pal && v === pal[0]);
        o.classList.toggle('is-on', !!on);
        o.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      pavs.forEach((b) => { const on = b.dataset.preset === st.preset; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    };
    const boing = () => {
      if (window.gsap && !this.reduce) window.gsap.fromTo(stage, { scaleX: 1.12, scaleY: 0.88 }, { scaleX: 1, scaleY: 1, duration: 0.7, ease: 'elastic.out(1,0.4)', overwrite: true });
    };
    const custom = () => { st.preset = ''; st.extra = ''; };
    opts.forEach((o) => this.on(o, 'click', () => {
      const k = o.dataset.k, v = o.dataset.v;
      if (k === 'pal') { const c = AV_PAL.find((x) => x[0] === v); if (c) { st.body = c[3]; st.core = c[4]; } }
      else st[k] = v;
      custom(); paint(); boing();
    }));
    pavs.forEach((b) => this.on(b, 'click', () => {
      const p = AV_PRESETS.find((x) => x[0] === b.dataset.preset);
      if (!p) return;
      Object.assign(st, { shape: p[3], body: p[4], core: p[5], eyes: p[6], mouth: p[7], extra: p[8] || '', preset: p[0] });
      paint(); boing();
    }));
    this.on(this.$('.mk__rand'), 'click', () => {
      const pick = (a) => a[Math.floor(Math.random() * a.length)];
      const c = pick(AV_PAL);
      Object.assign(st, { shape: pick(AV_SHAPES)[0], body: c[3], core: c[4], eyes: pick(AV_EYES)[0], mouth: pick(['smile', 'smile', 'flat', 'none']) });
      custom(); paint(); boing();
      const r = stage.getBoundingClientRect();
      this.burst(r.left + r.width / 2, r.top + r.height / 2, 30, 1);
    });
    this.on(stage, 'click', () => {
      const r = stage.getBoundingClientRect();
      this.burst(r.left + r.width / 2, r.top + r.height * 0.4, 36, 1.1);
      if (window.gsap && !this.reduce) window.gsap.fromTo(stage, { y: 0 }, { y: -26, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: true });
    });
    // eyes follow the pointer
    let lookRaf = 0, target = { x: 0, y: 0 };
    const follow = () => {
      lookRaf = 0;
      look.x += (target.x - look.x) * 0.25; look.y += (target.y - look.y) * 0.25;
      placeEyes();
      if (Math.abs(target.x - look.x) > 0.02 || Math.abs(target.y - look.y) > 0.02) lookRaf = requestAnimationFrame(follow);
    };
    this.on(window, 'pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.6);
      const d = Math.max(1, Math.hypot(dx, dy)), m = Math.min(1, d / 260) * 2.2;
      target = { x: dx / d * m, y: dy / d * m };
      if (!lookRaf) lookRaf = requestAnimationFrame(follow);
    }, { passive: true });
    this._cleanups.push(() => cancelAnimationFrame(lookRaf));
    // save as PNG
    this.on(this.$('.mk__dl'), 'click', () => {
      try {
        const svg = this.$('.mk__svg').cloneNode(true);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', '600'); svg.setAttribute('height', '816');
        const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
        const img = new Image();
        img.onload = () => {
          const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1080;
          const cx = cv.getContext('2d');
          cx.fillStyle = '#161618'; cx.fillRect(0, 0, 1080, 1080);
          const g = cx.createRadialGradient(540, 560, 0, 540, 560, 520);
          g.addColorStop(0, rgba(st.body, 0.4)); g.addColorStop(0.45, rgba(st.body, 0.08)); g.addColorStop(1, rgba(st.body, 0));
          cx.fillStyle = g; cx.fillRect(0, 0, 1080, 1080);
          cx.drawImage(img, 240, 150, 600, 816);
          URL.revokeObjectURL(url);
          cv.toBlob((b) => {
            if (!b) return;
            const a = document.createElement('a');
            a.href = URL.createObjectURL(b); a.download = 'kivilcim-alevim.png';
            a.style.display = 'none';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(a.href), 4000);
          }, 'image/png');
        };
        img.src = url;
      } catch (err) {}
    });
    this.onLang(paint);
    paint();
  }

  /* ---------- widgets + Live Activity (WidgetViews.swift) ---------- */
  initWidgets() {
    const ph = this.$('.wphone');
    if (!ph) return;
    const segs = this.$$('.wg__seg button');
    const home = this.$('.wscr--home'), lock = this.$('.wscr--lock');
    const rows = this.$$('.wrow'), ticks = this.$$('.wtick');
    const arcs = this.$$('.warc'), smN = this.$('.wsm__n'), smNext = this.$('.wsm__next');
    const larc = this.$('.larc'), lN = this.$('.lcirc__n'), lS = this.$('.lrect__s'), lN2 = this.$('.lrect__n2'), lBar = this.$('.lrect__bar i'), lNext = this.$('.lrect__n');
    const dyn = this.$('.dyn'), dynT = this.$('.dyn__t'), dynBar = this.$('.dyn__bar i');
    const laTime = this.$('.la__time'), laBtn = this.$('.la__btn'), play = this.$('.la__play'), pause = this.$('.la__pause');
    const TASKS = [['Su iç', 'Drink water'], ['10 dk yürüyüş', '10 min walk'], ['20 sayfa kitap', 'Read 20 pages']];
    const done = [true, false, false];
    const TOTAL = 25 * 60;
    let remain = TOTAL, running = false, timer = 0, lastTs = 0;
    const fmt = (s) => { const m = Math.floor(s / 60), x = Math.floor(s % 60); return (m < 10 ? '0' : '') + m + ':' + (x < 10 ? '0' : '') + x; };
    const paint = () => {
      const k = done.filter(Boolean).length, n = done.length, ratio = k / n;
      rows.forEach((r, i) => r.classList.toggle('is-done', done[i]));
      ticks.forEach((b, i) => b.setAttribute('aria-label', (done[i] ? this.t('Tamamlandı: ', 'Done: ') : this.t('Tikle: ', 'Tick: ')) + this.t(TASKS[i][0], TASKS[i][1])));
      arcs.forEach((a) => { a.style.strokeDashoffset = String(157 * (1 - ratio)); });
      larc.style.strokeDashoffset = String(100.5 * (1 - ratio));
      smN.textContent = k + '/' + n; lN.textContent = k + '/' + n; lN2.textContent = k + '/' + n;
      const nx = done.indexOf(false);
      const nextTxt = nx < 0 ? this.t('Bugün hepsi tamam', 'All done for today') : this.t(TASKS[nx][0], TASKS[nx][1]);
      smNext.textContent = nextTxt; lNext.textContent = nextTxt;
      lS.textContent = this.t('40 gün', '40 days');
      lBar.style.transform = 'scaleX(' + ratio.toFixed(3) + ')';
    };
    const paintTimer = () => {
      const s = fmt(remain);
      dynT.textContent = s; laTime.textContent = s;
      dynBar.style.transform = 'scaleX(' + (1 - remain / TOTAL).toFixed(4) + ')';
      dyn.classList.toggle('is-live', running || remain < TOTAL);
      if (!(running || remain < TOTAL)) dyn.classList.remove('is-open');
      if (running) { play.setAttribute('display', 'none'); pause.removeAttribute('display'); }
      else { pause.setAttribute('display', 'none'); play.removeAttribute('display'); }
      laBtn.setAttribute('aria-label', running ? this.t('Sayacı duraklat', 'Pause the timer') : this.t('Sayacı başlat', 'Start the timer'));
    };
    const step = () => {
      const now = performance.now();
      remain = Math.max(0, remain - (now - lastTs) / 1000); lastTs = now;
      if (remain <= 0) { running = false; clearInterval(timer); timer = 0; remain = TOTAL; }
      paintTimer();
    };
    const setScreen = (s) => {
      segs.forEach((b) => { const on = b.dataset.scr === s; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      home.setAttribute('aria-hidden', s === 'home' ? 'false' : 'true');
      lock.setAttribute('aria-hidden', s === 'lock' ? 'false' : 'true');
      try { home.inert = s !== 'home'; lock.inert = s !== 'lock'; } catch (e) {}
    };
    segs.forEach((b) => this.on(b, 'click', () => setScreen(b.dataset.scr)));
    ticks.forEach((b, i) => this.on(b, 'click', () => {
      if (done[i]) return;
      done[i] = true; paint();
      const r = b.getBoundingClientRect();
      this.burst(r.left + r.width / 2, r.top + r.height / 2, 16, 0.7);
      if (done.every(Boolean)) {
        const p = ph.getBoundingClientRect();
        this.burst(p.left + p.width / 2, p.top + p.height * 0.25, 50, 1.3);
        clearTimeout(this._wResetT);
        this._wResetT = setTimeout(() => { done.fill(false); done[0] = true; paint(); }, 4500);
      }
    }));
    this.on(laBtn, 'click', () => {
      running = !running;
      if (running) { lastTs = performance.now(); clearInterval(timer); timer = setInterval(step, 250); }
      else { clearInterval(timer); timer = 0; }
      paintTimer();
    });
    this.on(dyn, 'click', () => {
      if (!(running || remain < TOTAL)) { setScreen('lock'); return; }
      dyn.classList.toggle('is-open');
    });
    const clocks = this.$$('.wclock');
    const tickClock = () => { const d = new Date(); const s = d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(); clocks.forEach((c) => { c.textContent = s; }); };
    tickClock();
    const clockT = setInterval(tickClock, 15000);
    this._cleanups.push(() => { clearInterval(timer); clearInterval(clockT); clearTimeout(this._wResetT); });
    this.onLang(() => { paint(); paintTimer(); });
    setScreen('home');
    paint(); paintTimer();
  }

  /* ---------- watching Kıvı ---------- */
  initWatch() {
    const w = this.$('.watch');
    if (!w) return;
    const eyes = this.$$('.we'), open = this.$('.we-open'), happy = this.$('.we-happy'), tip = this.$('.watch__tip');
    const look = { x: 0, y: 0 };
    let target = { x: 0, y: 0 }, raf = 0, sleepT = 0, asleep = false, happyT = 0;
    const place = () => {
      eyes[0].setAttribute('cx', (41 + look.x).toFixed(2)); eyes[0].setAttribute('cy', (76 + look.y).toFixed(2));
      eyes[1].setAttribute('cx', (59 + look.x).toFixed(2)); eyes[1].setAttribute('cy', (76 + look.y).toFixed(2));
    };
    const follow = () => {
      raf = 0;
      look.x += (target.x - look.x) * 0.2; look.y += (target.y - look.y) * 0.2;
      place();
      if (Math.abs(target.x - look.x) > 0.02 || Math.abs(target.y - look.y) > 0.02) raf = requestAnimationFrame(follow);
    };
    const setSleep = (s) => {
      asleep = s;
      w.classList.toggle('is-sleep', s);
      eyes.forEach((e) => e.setAttribute('ry', s ? '0.9' : '5.2'));
      tip.textContent = s ? this.t('Kıvı uyukladı. Dokun, uyansın.', 'Kıvı dozed off. Tap to wake it up.')
        : this.t('Kıvı seni izliyor. Biraz durursan uyuklar.', "Kıvı is watching you. Stop for a moment and it'll doze off.");
    };
    const wake = () => {
      if (asleep) setSleep(false);
      clearTimeout(sleepT);
      sleepT = setTimeout(() => setSleep(true), 7000);
    };
    this.on(window, 'pointermove', (e) => {
      const r = w.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.69);
      const d = Math.max(1, Math.hypot(dx, dy)), m = Math.min(1, d / 220) * 3.4;
      target = { x: dx / d * m, y: dy / d * m * 0.8 };
      if (!raf) raf = requestAnimationFrame(follow);
      wake();
    }, { passive: true });
    this.on(window, 'scroll', wake, { passive: true });
    this.on(w, 'click', () => {
      wake();
      open.setAttribute('display', 'none'); happy.removeAttribute('display');
      w.classList.remove('is-party'); void w.offsetWidth; w.classList.add('is-party');
      const r = w.getBoundingClientRect();
      this.burst(r.left + r.width / 2, r.top + r.height * 0.4, 40, 1.1);
      clearTimeout(happyT);
      happyT = setTimeout(() => { happy.setAttribute('display', 'none'); open.removeAttribute('display'); w.classList.remove('is-party'); }, 1300);
    });
    this._cleanups.push(() => { cancelAnimationFrame(raf); clearTimeout(sleepT); clearTimeout(happyT); });
    this.onLang(() => setSleep(asleep));
    setSleep(false);
    wake();
  }

  /* ---------- closing spark button ---------- */
  initSpark() {
    const btn = this.$('.spark-btn'), count = this.$('.cta__count'), w = this.$('.watch');
    if (!btn) return;
    let n = 0;
    const text = () => (n === 0 ? '' : n === 1 ? this.t('İlk kıvılcım çakıldı. Kıvı sevindi.', 'First spark struck. Kıvı is happy.') : this.t(n + ' kıvılcım çaktın.', 'You struck ' + n + ' sparks.'));
    this.on(btn, 'click', () => {
      n++;
      const r = btn.getBoundingClientRect();
      this.burst(r.left + r.width / 2, r.top + r.height / 2, 70, 1.5);
      if (window.gsap && !this.reduce) window.gsap.fromTo(btn.querySelector('.mag__in'), { scale: 0.9 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1,0.4)' });
      if (w) { w.classList.remove('is-party'); void w.offsetWidth; w.classList.add('is-party'); }
      count.textContent = text();
    });
    this.onLang(() => { count.textContent = text(); });
  }

  /* ---------- real screens: native swipe carousel with coverflow ---------- */
  initCarousel() {
    const track = this.$('.gal__track');
    if (!track) return;
    const shots = this.$$('.shot');
    const ins = shots.map((s) => s.querySelector('.shot__in'));
    const dots = this.$$('.gal__dot');
    const prev = this.$('.gal__prev'), next = this.$('.gal__next');
    const still = this.reduce;
    let idx = -1, raf = 0;
    const clamp = (i) => Math.max(0, Math.min(shots.length - 1, i));
    const target = (i) => shots[i].offsetLeft + shots[i].offsetWidth / 2 - track.clientWidth / 2;
    const go = (i, smooth) => { track.scrollTo({ left: target(clamp(i)), behavior: smooth === false || still ? 'auto' : 'smooth' }); };
    const nearest = (left) => {
      const c = left + track.clientWidth / 2;
      let best = 0, bd = Infinity;
      shots.forEach((s, i) => { const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - c); if (d < bd) { bd = d; best = i; } });
      return best;
    };
    const paint = () => {
      raf = 0;
      const c = track.scrollLeft + track.clientWidth / 2;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
      if (!still) shots.forEach((s, i) => {
        const d = (s.offsetLeft + s.offsetWidth / 2 - c) / (s.offsetWidth + gap);
        const a = Math.max(-2.5, Math.min(2.5, d)), ad = Math.abs(a);
        ins[i].style.transform = 'translateY(' + (ad * 16).toFixed(1) + 'px) rotateY(' + (-a * 18).toFixed(1) + 'deg) scale(' + (1 - Math.min(ad, 1.5) * 0.12).toFixed(3) + ')';
        ins[i].style.opacity = (1 - Math.min(ad, 2) * 0.3).toFixed(2);
      });
      const n = nearest(track.scrollLeft);
      if (n !== idx) {
        idx = n;
        shots.forEach((s, i) => s.classList.toggle('is-on', i === idx));
        dots.forEach((d, i) => { d.classList.toggle('is-on', i === idx); d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
        prev.disabled = idx === 0;
        next.disabled = idx === shots.length - 1;
      }
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    this.on(track, 'scroll', queue, { passive: true });
    this.on(window, 'resize', () => { go(idx < 0 ? 2 : idx, false); queue(); });
    this.on(prev, 'click', () => go(idx - 1));
    this.on(next, 'click', () => go(idx + 1));
    dots.forEach((d, i) => this.on(d, 'click', () => go(i)));
    this.on(track, 'keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
    });
    let drag = null, moved = 0;
    this.on(track, 'pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, lastX: e.clientX, lastT: performance.now(), v: 0 };
      moved = 0;
      track.classList.add('is-drag');
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
    });
    this.on(track, 'pointermove', (e) => {
      if (!drag) return;
      const now = performance.now();
      drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
      drag.lastX = e.clientX; drag.lastT = now;
      moved = Math.max(moved, Math.abs(e.clientX - drag.x));
      track.scrollLeft = drag.left - (e.clientX - drag.x);
    });
    const end = (e) => {
      if (!drag) return;
      const fling = track.scrollLeft - drag.v * 260;
      drag = null;
      track.classList.remove('is-drag');
      if (moved < 6 && e && typeof e.clientX === 'number') {
        const hit = shots.findIndex((s) => { const r = s.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right; });
        go(hit >= 0 ? hit : idx);
      } else go(nearest(fling));
    };
    this.on(track, 'pointerup', end);
    this.on(track, 'pointercancel', end);
    this.on(track, 'lostpointercapture', end);
    shots.forEach((s, i) => this.on(s, 'click', () => { if (!drag && moved < 6 && i !== idx) go(i); }));
    requestAnimationFrame(() => { go(2, false); paint(); });
  }

  /* ---------- numbers ---------- */
  initStats() {
    const gsap = window.gsap;
    const cfg = [
      { from: 0, to: 33, f: (v) => String(Math.round(v)) },
      { from: 0, to: 17, f: (v) => String(Math.round(v)) },
      { from: 0, to: 9, f: (v) => String(Math.round(v)) },
      { from: 1, to: 10, f: (v) => 'x' + Math.round(v) }
    ];
    this.$$('.stat__num').forEach((el, i) => {
      const c = cfg[i]; if (!c) return;
      el.textContent = c.f(c.from);
      window.ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => {
          const o = { v: c.from };
          gsap.to(o, { v: c.to, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = c.f(o.v); } });
        }
      });
    });
    gsap.from('.stat', { y: 90, opacity: 0, stagger: 0.12, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.stats__grid', start: 'top 85%', toggleActions: 'play none none reverse' } });
    gsap.from('.stats__head > *', { y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.stats', start: 'top 75%', toggleActions: 'play none none reverse' } });
    gsap.fromTo('.blob', { yPercent: -35, xPercent: -18, scale: 0.85 },
      { yPercent: 35, xPercent: 18, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.stats', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  }

  /* ---------- closing ---------- */
  initCta() {
    const gsap = window.gsap;
    this.byLang(this.$('.cta__title'), '.cta__ch').forEach((g) => {
      if (!g.length) return;
      gsap.fromTo(g, { scale: 0.35, opacity: 0.15, yPercent: 35, color: '#4a4a4a' },
        { scale: 1, opacity: 1, yPercent: 0, color: '#FF8A2B', stagger: 0.04, ease: 'power2.out',
          scrollTrigger: { trigger: '.cta__title', start: 'top 92%', end: 'bottom 50%', scrub: 0.6 } });
    });
    gsap.from(['.watch', '.watch__tip'], { y: 60, opacity: 0, scale: 0.8, stagger: 0.1, duration: 1, ease: 'back.out(2)',
      scrollTrigger: { trigger: '.cta', start: 'top 80%', toggleActions: 'play none none reverse' } });
    gsap.from(['.cchip', '.spark-btn'], { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta__chips', start: 'top 92%', toggleActions: 'play none none reverse' } });
  }

  initFooter() {
    window.gsap.fromTo('.foot__ch', { yPercent: 115 }, { yPercent: 0, stagger: 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: '.foot', start: 'top 92%', end: 'bottom bottom', scrub: 0.6 } });
  }

  /* ---------- desktop: cursor, magnets, tilt ---------- */
  initCursor() {
    const gsap = window.gsap;
    this.r.classList.add('kv--cursor');
    const dot = this.$('.cur-dot-wrap'), ring = this.$('.cur-ring');
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100, opacity: 0 });
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
    let shown = false;
    this.on(window, 'pointermove', (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      if (!shown) { shown = true; gsap.to([dot, ring], { opacity: 1, duration: 0.3 }); }
    });
    this.on(document, 'pointerover', (e) => {
      const t = e.target && e.target.closest ? e.target.closest('a,button,input,[data-hover]') : null;
      ring.classList.toggle('is-hover', !!t);
    });
    this.on(document.documentElement, 'mouseleave', () => { shown = false; gsap.to([dot, ring], { opacity: 0, duration: 0.3 }); });
  }

  initMagnets() {
    const gsap = window.gsap;
    this.$$('[data-magnetic]').forEach((el) => {
      const inner = el.querySelector('.mag__in');
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      const ixTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3' }) : null;
      const iyTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3' }) : null;
      this.on(el, 'pointermove', (e) => {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2), my = e.clientY - (r.top + r.height / 2);
        xTo(mx * 0.35); yTo(my * 0.35);
        if (ixTo) { ixTo(mx * 0.15); iyTo(my * 0.15); }
      });
      this.on(el, 'pointerleave', () => { xTo(0); yTo(0); if (ixTo) { ixTo(0); iyTo(0); } });
    });
  }

  initTilt() {
    const gsap = window.gsap;
    this.$$('.card').forEach((card) => {
      const inner = card.querySelector('.card__in');
      const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.5, ease: 'power3' });
      const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.5, ease: 'power3' });
      this.on(card, 'pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 18); rx(-py * 18);
        inner.style.setProperty('--mx', ((px + 0.5) * 100).toFixed(1) + '%');
        inner.style.setProperty('--my', ((py + 0.5) * 100).toFixed(1) + '%');
      });
      this.on(card, 'pointerleave', () => { rx(0); ry(0); });
    });
  }

  /* ---------- ember particles + spark bursts (one canvas) ---------- */
  initEmbers() {
    const c = this.$('.embers');
    if (!c || !c.getContext) return;
    this.cv = c; this.cx = c.getContext('2d');
    this.cols = ['#FFD15C', '#FF8A2B', '#E8452F'];
    const resize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      this.W = window.innerWidth; this.H = window.innerHeight;
      c.width = Math.round(this.W * d); c.height = Math.round(this.H * d);
      this.cx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    this.on(window, 'resize', resize);
    const want = this.props.emberCount ?? 70;
    const n = Math.round(this.W < 700 ? want * 0.5 : want);
    this.embers = [];
    for (let i = 0; i < n; i++) this.embers.push(this.spawnEmber(true));
    this.bursts = [];
  }

  spawnEmber(anywhere) {
    return {
      x: Math.random() * this.W, y: anywhere ? Math.random() * this.H : this.H + 10,
      r: 0.6 + Math.random() * 1.8, vy: 0.25 + Math.random() * 0.6, ph: Math.random() * 6.283,
      sw: 4 + Math.random() * 10, z: 0.3 + Math.random() * 0.9, a: 0.25 + Math.random() * 0.5,
      col: this.cols[(Math.random() * 3) | 0]
    };
  }

  burst(x, y, n, power) {
    if (!this.bursts) return;
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const sp = (1.2 + Math.random() * 4.8) * power;
      const life = 35 + Math.random() * 40;
      this.bursts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1.6 * power,
        r: 1 + Math.random() * 2.4, life: life, max: life, col: this.cols[(Math.random() * 3) | 0] });
    }
  }

  drawEmbers(dt) {
    const ctx = this.cx;
    if (!ctx || document.hidden) return;
    const W = this.W, H = this.H, v = this.vel;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const e of this.embers) {
      e.ph += 0.02 * dt;
      e.y -= (e.vy + Math.abs(v) * 0.03 * e.z) * dt + v * 0.25 * e.z;
      if (e.y < -12) Object.assign(e, this.spawnEmber(false));
      else if (e.y > H + 20) { e.y = -10; e.x = Math.random() * W; }
      const x = e.x + Math.sin(e.ph) * e.sw;
      const a = e.a * (0.65 + 0.35 * Math.sin(e.ph * 3.1));
      ctx.fillStyle = e.col;
      ctx.globalAlpha = a * 0.16;
      ctx.beginPath(); ctx.arc(x, e.y, e.r * 3.2, 0, 6.283); ctx.fill();
      ctx.globalAlpha = a;
      ctx.beginPath(); ctx.arc(x, e.y, e.r, 0, 6.283); ctx.fill();
    }
    const bs = this.bursts;
    for (let i = bs.length - 1; i >= 0; i--) {
      const p = bs[i];
      p.vx *= Math.pow(0.955, dt); p.vy = p.vy * Math.pow(0.955, dt) + 0.09 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) { bs.splice(i, 1); continue; }
      const k = p.life / p.max;
      ctx.fillStyle = p.col;
      ctx.globalAlpha = k * 0.25;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3 * k + 0.5, 0, 6.283); ctx.fill();
      ctx.globalAlpha = k;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * k + 0.3, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}
function boot() {
  var root = document.querySelector('.kv');
  if (!root) return;
  var c = new Component();
  c.root = root;
  c.componentDidMount();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
