/*!
 * VP - Twilight Sparkle Video Player (MLP theme)
 * Folosire in Blogger:
 *   <div class="vp" data-src="https://exemplu.com/video.mp4" data-poster="https://exemplu.com/poza.jpg" data-title="Titlu"></div>
 *   <script src="https://cdn.jsdelivr.net/gh/USERUL_TAU/vp@main/vp.js"></script>
 */
(function () {
  'use strict';

  var CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');
.vpx{--ink:#1d1445;--indigo:#2e2a6e;--violet:#6f3e94;--lav:#d9b9ee;--pink:#ec4a97;--rose:#ff8cc6;--star:#fff4b8;
position:relative;width:100%;max-width:100%;aspect-ratio:16/9;background:radial-gradient(circle at 30% 20%,#3b2a7a,#1d1445 70%);
border-radius:18px;overflow:hidden;font-family:'Fredoka','Trebuchet MS',sans-serif;color:#fff;user-select:none;-webkit-user-select:none;
box-shadow:0 0 0 3px var(--violet),0 10px 30px rgba(46,42,110,.55);margin:12px 0}
.vpx:fullscreen{border-radius:0;aspect-ratio:auto;max-width:none;margin:0;box-shadow:none}
.vpx video{width:100%;height:100%;display:block;background:#000;object-fit:contain}
.vpx button{all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;
transition:background .15s,transform .15s;color:#fff}
.vpx button:hover{background:rgba(217,185,238,.25);transform:scale(1.08)}
.vpx button:focus-visible,.vpx .vp-bar:focus-visible{outline:3px solid var(--star);outline-offset:2px}
.vpx svg{width:24px;height:24px;fill:currentColor;pointer-events:none}
.vp-big{position:absolute;left:50%;top:50%;width:84px!important;height:84px!important;margin:-42px 0 0 -42px;
background:linear-gradient(135deg,var(--pink),var(--violet))!important;box-shadow:0 0 0 4px var(--star),0 0 30px rgba(236,74,151,.7)}
.vp-big svg{width:42px;height:42px;margin-left:4px}
.vpx.playing .vp-big{opacity:0;pointer-events:none;transform:scale(1.4)}
.vp-ttl{position:absolute;top:0;left:0;right:0;padding:14px 18px 40px;font-size:18px;font-weight:600;
background:linear-gradient(#1d1445dd,transparent);transition:opacity .25s;text-shadow:0 1px 4px #000a}
.vp-ctl{position:absolute;left:0;right:0;bottom:0;padding:34px 12px 8px;background:linear-gradient(transparent,#1d1445f2);transition:opacity .25s}
.vpx.hide .vp-ctl,.vpx.hide .vp-ttl{opacity:0}.vpx.hide{cursor:none}
.vpx:not(.playing) .vp-ctl,.vpx:not(.playing) .vp-ttl{opacity:1}
.vp-bar{position:relative;height:20px;display:flex;align-items:center;cursor:pointer;touch-action:none}
.vp-trk{position:relative;width:100%;height:5px;border-radius:5px;background:rgba(217,185,238,.3);transition:height .12s}
.vp-bar:hover .vp-trk{height:8px}
.vp-buf,.vp-pos{position:absolute;left:0;top:0;height:100%;border-radius:5px}
.vp-buf{background:rgba(217,185,238,.45)}
.vp-pos{background:linear-gradient(90deg,var(--indigo),var(--violet) 40%,var(--pink))}
.vp-thumb{position:absolute;top:50%;width:22px;height:22px;margin:-11px 0 0 -11px;transform:scale(0);transition:transform .12s;
filter:drop-shadow(0 0 5px var(--pink));fill:var(--star)}
.vp-bar:hover .vp-thumb,.vp-bar.drag .vp-thumb{transform:scale(1)}
.vp-tip{position:absolute;bottom:22px;transform:translateX(-50%);background:var(--violet);padding:2px 9px;border-radius:10px;font-size:13px;
opacity:0;pointer-events:none;box-shadow:0 0 0 2px var(--lav)}
.vp-bar:hover .vp-tip{opacity:1}
.vp-row{display:flex;align-items:center;gap:2px}
.vp-time{font-size:14px;margin:0 8px;white-space:nowrap;font-variant-numeric:tabular-nums}
.vp-sp{flex:1}
.vp-vol{width:0;opacity:0;transition:width .2s,opacity .2s;accent-color:var(--pink);height:4px;cursor:pointer}
.vp-vg:hover .vp-vol,.vp-vol:focus{width:76px;opacity:1;margin:0 6px}
.vp-vg{display:flex;align-items:center}
.vp-spd{width:auto!important;border-radius:19px!important;padding:0 10px;font-size:14px;font-weight:600}
.vp-load{position:absolute;left:50%;top:50%;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;
border:5px solid rgba(217,185,238,.25);border-top-color:var(--pink);border-right-color:var(--star);animation:vps 1s linear infinite;display:none;pointer-events:none}
.vpx.wait .vp-load{display:block}
@keyframes vps{to{transform:rotate(360deg)}}
.vp-flash{position:absolute;left:50%;top:50%;margin:-30px 0 0 -30px;width:60px;height:60px;border-radius:50%;background:#1d1445b0;
display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;opacity:0;pointer-events:none}
.vp-flash.go{animation:vpf .6s ease-out}
@keyframes vpf{0%{opacity:1;transform:scale(.8)}100%{opacity:0;transform:scale(1.4)}}
@media (max-width:560px){.vp-vg,.vp-pip{display:none!important}.vp-ttl{font-size:15px}.vp-big{width:64px!important;height:64px!important;margin:-32px 0 0 -32px}}
@media (prefers-reduced-motion:reduce){.vpx *{transition:none!important;animation:none!important}}
`;

  var I = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    vol: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.2l2.5 2.5v-.7zM19 12a7 7 0 0 1-.9 3.4l1.5 1.5A9 9 0 0 0 21 12a9 9 0 0 0-7-8.8v2.1A7 7 0 0 1 19 12zM4.3 3 3 4.3 7.7 9H3v6h4l5 5v-6.7l4.3 4.3a7 7 0 0 1-2.3 1.2v2.1a9 9 0 0 0 3.7-1.9l2 2 1.3-1.3L4.3 3zM12 4 9.9 6.1 12 8.2z"/></svg>',
    full: '<svg viewBox="0 0 24 24"><path d="M5 5h5v2H7v3H5zm9 0h5v5h-2V7h-3zM5 14h2v3h3v2H5zm12 0h2v5h-5v-2h3z"/></svg>',
    exit: '<svg viewBox="0 0 24 24"><path d="M8 5h2v5H5V8h3zm6 0h2v3h3v2h-5zM5 14h5v5H8v-3H5zm9 0h5v2h-3v3h-2z"/></svg>',
    pip: '<svg viewBox="0 0 24 24"><path d="M19 7h-8v6h8zm4 12V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18z"/></svg>',
    star: '<svg class="vp-thumb" viewBox="0 0 24 24"><path d="M12 1l2.6 7.4L22 9l-6 4.6L18 21l-6-4.2L6 21l2-7.4L2 9l7.4-.6z"/></svg>'
  };

  function fmt(t) {
    if (!isFinite(t)) return '0:00';
    t = Math.floor(t);
    var h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60;
    return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function injectCSS() {
    if (document.getElementById('vp-css')) return;
    var s = document.createElement('style');
    s.id = 'vp-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function build(host) {
    if (host.__vp) return;
    host.__vp = 1;
    var g = function (n) { return host.getAttribute('data-' + n) || host.getAttribute(n); };
    var src = g('src'),
        poster = g('poster'),
        title = g('title') || '',
        existing = host.tagName === 'VIDEO';

    var root = document.createElement('div');
    root.className = 'vpx';
    root.tabIndex = 0;

    var v;
    if (existing) {
      v = host;
      host.parentNode.insertBefore(root, host);
      src = src || v.currentSrc || v.src;
      title = title || v.getAttribute('title') || '';
    } else {
      v = document.createElement('video');
      host.innerHTML = '';
      if (src) v.src = src;
      if (poster) v.poster = poster;
    }
    v.controls = false;
    v.removeAttribute('controls');
    v.playsInline = true;
    v.preload = g('preload') || 'metadata';
    if (host.hasAttribute('data-loop') || host.hasAttribute('loop')) v.loop = true;
    if (host.hasAttribute('autoplay')) { v.muted = true; v.autoplay = true; }

    root.innerHTML =
      '<div class="vp-ttl"></div>' +
      '<div class="vp-load"></div><div class="vp-flash"></div>' +
      '<button class="vp-big" aria-label="Redare">' + I.play + '</button>' +
      '<div class="vp-ctl">' +
        '<div class="vp-bar" role="slider" tabindex="0" aria-label="Pozitie video">' +
          '<div class="vp-trk"><div class="vp-buf"></div><div class="vp-pos"></div>' + I.star + '</div>' +
          '<div class="vp-tip">0:00</div></div>' +
        '<div class="vp-row">' +
          '<button class="vp-pp" aria-label="Redare/Pauza">' + I.play + '</button>' +
          '<div class="vp-vg"><button class="vp-mu" aria-label="Sunet">' + I.vol + '</button>' +
          '<input class="vp-vol" type="range" min="0" max="1" step="0.02" value="1" aria-label="Volum"></div>' +
          '<span class="vp-time">0:00 / 0:00</span><span class="vp-sp"></span>' +
          '<button class="vp-spd" aria-label="Viteza">1x</button>' +
          '<button class="vp-pip" aria-label="Picture in picture">' + I.pip + '</button>' +
          '<button class="vp-fs" aria-label="Ecran complet">' + I.full + '</button>' +
        '</div></div>';
    root.insertBefore(v, root.firstChild);
    if (!existing) host.appendChild(root);

    var $ = function (s) { return root.querySelector(s); };
    var bar = $('.vp-bar'), pos = $('.vp-pos'), buf = $('.vp-buf'), thumb = $('.vp-thumb'),
        tip = $('.vp-tip'), time = $('.vp-time'), pp = $('.vp-pp'), mu = $('.vp-mu'),
        vol = $('.vp-vol'), spd = $('.vp-spd'), fs = $('.vp-fs'), flash = $('.vp-flash'),
        pipb = $('.vp-pip');
    if (title) $('.vp-ttl').textContent = title;
    else $('.vp-ttl').remove();
    if (!document.pictureInPictureEnabled) pipb.style.display = 'none';

    var toggle = function () { v.paused ? v.play() : v.pause(); };
    var say = function (t) {
      flash.textContent = t;
      flash.classList.remove('go');
      void flash.offsetWidth;
      flash.classList.add('go');
    };
    var seek = function (d) {
      v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + d));
      say((d > 0 ? '+' : '') + d + 's');
    };
    var setVol = function (x) {
      v.volume = Math.max(0, Math.min(1, x));
      v.muted = v.volume === 0;
    };
    var toggleFS = function () {
      if (document.fullscreenElement === root || document.webkitFullscreenElement === root) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
      }
    };

    v.addEventListener('play', function () {
      root.classList.add('playing'); pp.innerHTML = I.pause; kick();
    });
    v.addEventListener('pause', function () {
      root.classList.remove('playing', 'hide'); pp.innerHTML = I.play;
    });
    v.addEventListener('waiting', function () { root.classList.add('wait'); });
    v.addEventListener('canplay', function () { root.classList.remove('wait'); });
    v.addEventListener('playing', function () { root.classList.remove('wait'); });
    v.addEventListener('timeupdate', paint);
    v.addEventListener('durationchange', paint);
    v.addEventListener('progress', function () {
      var d = v.duration;
      if (d && v.buffered.length) buf.style.width = v.buffered.end(v.buffered.length - 1) / d * 100 + '%';
    });
    v.addEventListener('volumechange', function () {
      mu.innerHTML = (v.muted || v.volume === 0) ? I.mute : I.vol;
      vol.value = v.muted ? 0 : v.volume;
    });
    document.addEventListener('fullscreenchange', function () {
      fs.innerHTML = document.fullscreenElement === root ? I.exit : I.full;
    });

    function paint() {
      var d = v.duration || 0, p = d ? v.currentTime / d * 100 : 0;
      pos.style.width = p + '%';
      thumb.style.left = p + '%';
      time.textContent = fmt(v.currentTime) + ' / ' + fmt(d);
      bar.setAttribute('aria-valuenow', Math.round(p));
    }

    // bara de progres (mouse + touch)
    var frac = function (e) {
      var r = bar.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    };
    bar.addEventListener('pointerdown', function (e) {
      bar.setPointerCapture(e.pointerId);
      bar.classList.add('drag');
      v.currentTime = frac(e) * (v.duration || 0);
    });
    bar.addEventListener('pointermove', function (e) {
      var f = frac(e);
      tip.style.left = f * 100 + '%';
      tip.textContent = fmt(f * (v.duration || 0));
      if (bar.classList.contains('drag')) v.currentTime = f * (v.duration || 0);
    });
    bar.addEventListener('pointerup', function () { bar.classList.remove('drag'); });

    // butoane
    $('.vp-big').onclick = toggle;
    pp.onclick = toggle;
    mu.onclick = function () { v.muted = !v.muted; };
    vol.oninput = function () { setVol(+vol.value); };
    fs.onclick = toggleFS;
    pipb.onclick = function () {
      document.pictureInPictureElement ? document.exitPictureInPicture() : v.requestPictureInPicture();
    };
    var speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    spd.onclick = function () {
      var i = (speeds.indexOf(v.playbackRate) + 1) % speeds.length;
      v.playbackRate = speeds[i];
      spd.textContent = speeds[i] + 'x';
    };

    // click pe video: play/pauza; dublu click: ecran complet sau +-10s pe margini
    var ct;
    v.addEventListener('click', function () {
      clearTimeout(ct);
      ct = setTimeout(toggle, 220);
    });
    v.addEventListener('dblclick', function (e) {
      clearTimeout(ct);
      var r = v.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
      if (x < 0.3) seek(-10); else if (x > 0.7) seek(10); else toggleFS();
    });

    // taste
    root.addEventListener('keydown', function (e) {
      if (e.target === vol) return;
      var k = e.key, used = true;
      if (k === ' ' || k === 'k') toggle();
      else if (k === 'ArrowLeft') seek(-5);
      else if (k === 'ArrowRight') seek(5);
      else if (k === 'j') seek(-10);
      else if (k === 'l') seek(10);
      else if (k === 'ArrowUp') setVol(v.volume + 0.1);
      else if (k === 'ArrowDown') setVol(v.volume - 0.1);
      else if (k === 'm') v.muted = !v.muted;
      else if (k === 'f') toggleFS();
      else if (k >= '0' && k <= '9') v.currentTime = (v.duration || 0) * (+k / 10);
      else used = false;
      if (used) e.preventDefault();
      kick();
    });

    // ascunde controalele dupa 2.5s de inactivitate
    var ht;
    function kick() {
      root.classList.remove('hide');
      clearTimeout(ht);
      if (!v.paused) ht = setTimeout(function () { root.classList.add('hide'); }, 2500);
    }
    root.addEventListener('mousemove', kick);
    root.addEventListener('touchstart', kick, { passive: true });
    root.addEventListener('mouseleave', function () {
      if (!v.paused) root.classList.add('hide');
    });
    paint();
  }

  function init() {
    injectCSS();
    var n = document.querySelectorAll('.vp, video:not([data-native])');
    for (var i = 0; i < n.length; i++) build(n[i]);
  }

  // <vp-player src="video.mp4" poster="poza.jpg" title="Titlu"></vp-player>
  if (window.customElements && !customElements.get('vp-player')) {
    customElements.define('vp-player', class extends HTMLElement {
      connectedCallback() {
        injectCSS();
        this.style.display = 'block';
        build(this);
      }
    });
  }

  window.VP = { init: init, build: build };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();