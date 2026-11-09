(function () {
  'use strict';

  var CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');
.vpx{--ink:#1d1445;--indigo:#2e2a6e;--violet:#6f3e94;--lav:#d9b9ee;--pink:#ec4a97;--rose:#ff8cc6;--star:#fff4b8;
position:relative;width:100%;max-width:var(--vp-max,480px);aspect-ratio:16/9;background:radial-gradient(circle at 30% 20%,#3b2a7a,#1d1445 70%);
border-radius:18px;overflow:hidden;font-family:'Fredoka','Trebuchet MS',sans-serif;color:#fff;user-select:none;-webkit-user-select:none;
box-shadow:0 0 0 3px var(--violet),0 10px 30px rgba(46,42,110,.55);margin:12px auto}
.vpx:fullscreen{border-radius:0;aspect-ratio:auto;max-width:none;margin:0;box-shadow:none}
.vpx video{width:100%;height:100%;display:block;background:#000;object-fit:contain}
.vpx button{all:unset;-webkit-tap-highlight-color:transparent;outline:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;
transition:background .15s,transform .15s;color:#fff}
.vpx svg{width:24px;height:24px;fill:currentColor;pointer-events:none}
.vpx .vp-big{position:absolute;z-index:6;left:50%;top:50%;width:30px!important;height:30px!important;margin:-15px 0 0 -15px;
background:none!important;box-shadow:none!important;border-radius:0!important;transition:transform .15s,opacity .2s}
.vpx .vp-ic{display:block;width:20px;height:20px;background:center/contain no-repeat;pointer-events:none;transform:translateY(2px);filter:drop-shadow(0 1px 3px rgba(0,0,0,.75))}
.vpx .vp-ic-pp{background-image:var(--vp-i-play)}
.vpx.playing .vp-ic-pp{background-image:var(--vp-i-pause)}
.vpx .vp-ic-fs{background-image:var(--vp-i-full)}
.vpx.isfs .vp-ic-fs{background-image:var(--vp-i-exit)}
.vpx .vp-big .vp-ic{width:100%;height:100%;transform:translateY(5px);background-image:var(--vp-i-play)}
.vpx.playing .vp-big{opacity:0;pointer-events:none;transform:scale(1.4)}
.vp-ttl{position:absolute;top:0;left:0;right:0;padding:14px 18px 40px;font-size:18px;font-weight:600;
transition:opacity .25s;text-shadow:0 1px 4px #000a}
.vp-ctl{position:absolute;left:0;right:0;bottom:0;padding:34px 12px 0;transition:opacity .25s}
.vpx.hide .vp-ctl,.vpx.hide .vp-ttl{opacity:0}.vpx.hide{cursor:none}
.vpx.started:not(.playing) .vp-ctl,.vpx:not(.playing) .vp-ttl{opacity:1}
.vpx:not(.started) .vp-ctl{opacity:0!important;pointer-events:none}
.vp-row{display:flex;align-items:center;gap:2px}
.vp-sp{flex:1}
.vp-load{position:absolute;left:50%;top:50%;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;
border:5px solid rgba(217,185,238,.25);border-top-color:var(--pink);border-right-color:var(--star);animation:vps 1s linear infinite;display:none;pointer-events:none}
.vpx.wait .vp-load{display:block}
@keyframes vps{to{transform:rotate(360deg)}}
.vp-flash{position:absolute;left:50%;top:50%;margin:-30px 0 0 -30px;width:60px;height:60px;border-radius:50%;background:#1d1445b0;
display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;opacity:0;pointer-events:none}
.vp-flash.go{animation:vpf .6s ease-out}
@keyframes vpf{0%{opacity:1;transform:scale(.8)}100%{opacity:0;transform:scale(1.4)}}
@media (max-width:560px){.vpx{max-width:var(--vp-max-m,78%)}.vp-ttl{font-size:15px}.vpx .vp-big{width:30px!important;height:30px!important;margin:-15px 0 0 -15px}}
.vpx .vp-ctl{display:block!important;z-index:5;box-sizing:border-box}
.vpx .vp-row{display:flex!important;margin:0 0 -6px!important}
@media (orientation:landscape) and (max-height:500px){.vpx{max-width:var(--vp-max-l,360px)}}
@media (prefers-reduced-motion:reduce){.vpx *{transition:none!important;animation:none!important}}
`;

  var ICONS = ':root{--vp-i-play:url(https://i.imgur.com/aOnegLR.png);--vp-i-pause:url(https://i.imgur.com/oqW4TVu.png);--vp-i-full:url(https://i.imgur.com/aalyHkW.png);--vp-i-exit:url(https://i.imgur.com/1kfAhZK.png)}';

  function injectCSS() {
    if (document.getElementById('vp-css')) return;
    var s = document.createElement('style');
    s.id = 'vp-css';
    s.textContent = CSS + ICONS;
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
    v.preload = g('preload') || 'auto';
    v.loop = !(host.hasAttribute('noloop') || host.hasAttribute('data-noloop'));
    if (host.hasAttribute('autoplay')) { v.muted = true; v.autoplay = true; }

    root.innerHTML =
      '<div class="vp-ttl"></div>' +
      '<div class="vp-load"></div><div class="vp-flash"></div>' +
      '<button class="vp-big" aria-label="Redare"><i class="vp-ic"></i></button>' +
      '<div class="vp-ctl">' +
        '<div class="vp-row">' +
          '<button class="vp-pp" aria-label="Redare/Pauza"><i class="vp-ic vp-ic-pp"></i></button>' +
          '<span class="vp-sp"></span>' +
          '<button class="vp-fs" aria-label="Ecran complet"><i class="vp-ic vp-ic-fs"></i></button>' +
        '</div></div>';
    var customIcon = g('play-icon');
    if (customIcon) root.style.setProperty('--vp-i-play', 'url(' + customIcon + ')');
    root.insertBefore(v, root.firstChild);
    if (!existing) host.appendChild(root);

    var $ = function (s) { return root.querySelector(s); };
    var pp = $('.vp-pp'), fs = $('.vp-fs'), flash = $('.vp-flash');
    if (title) $('.vp-ttl').textContent = title;
    else $('.vp-ttl').remove();

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
      root.classList.add('playing', 'started'); kick();
    });
    v.addEventListener('pause', function () {
      root.classList.remove('playing', 'hide');
    });
    v.addEventListener('waiting', function () { root.classList.add('wait'); });
    v.addEventListener('canplay', function () { root.classList.remove('wait'); });
    v.addEventListener('playing', function () { root.classList.remove('wait'); });
    document.addEventListener('fullscreenchange', function () {
      root.classList.toggle('isfs', document.fullscreenElement === root);
    });

    $('.vp-big').onclick = toggle;
    pp.onclick = toggle;
    fs.onclick = toggleFS;

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

    root.addEventListener('keydown', function (e) {
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
  }

  function init() {
    injectCSS();
    var n = document.querySelectorAll('.vp, video:not([data-native])');
    for (var i = 0; i < n.length; i++) build(n[i]);
  }

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
