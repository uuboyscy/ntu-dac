/* ==========================================================================
   deck.js — 投影片導覽
   無外部相依。支援鍵盤、點擊、觸控滑動、URL hash 與 localStorage 續播。
   ========================================================================== */

(function () {
  'use strict';

  var CANVAS_W = 1280;
  var CANVAS_H = 720;
  var STORE_KEY = 'ntudac-deck:slide';

  var deck = document.getElementById('deck');
  var slides = Array.prototype.slice.call(deck.querySelectorAll('.slide'));
  if (!slides.length) return;

  var total = slides.length;
  var index = 0;

  var el = {
    stage: document.getElementById('stage'),
    chrome: document.getElementById('chrome'),
    progressBar: document.getElementById('progressBar'),
    cur: document.getElementById('cur'),
    total: document.getElementById('total'),
    prev: document.getElementById('btnPrev'),
    next: document.getElementById('btnNext'),
    notesBtn: document.getElementById('btnNotes'),
    notesPanel: document.getElementById('notes'),
    notesBody: document.getElementById('notesBody'),
    notesFor: document.getElementById('notesFor'),
    notesClose: document.getElementById('btnNotesClose'),
    helpBtn: document.getElementById('btnHelp'),
    helpPanel: document.getElementById('help'),
    helpClose: document.getElementById('btnHelpClose'),
    live: document.getElementById('live')
  };

  /* ——————————————————————————————— 儲存（file:// 下可能被拒） ——— */

  function readStore() {
    try {
      var v = window.localStorage.getItem(STORE_KEY);
      return v === null ? null : parseInt(v, 10);
    } catch (e) {
      return null;
    }
  }

  function writeStore(i) {
    try {
      window.localStorage.setItem(STORE_KEY, String(i));
    } catch (e) {
      /* 隱私模式或 file:// 下忽略 */
    }
  }

  /* ——————————————————————————————— 縮放 ————————————————————— */

  function fit() {
    var chromeH = el.chrome ? el.chrome.offsetHeight : 0;
    document.documentElement.style.setProperty('--chrome-h', chromeH + 'px');

    var pad = window.innerWidth < 700 ? 12 : 32;
    var availW = window.innerWidth - pad * 2;
    var availH = window.innerHeight - chromeH - pad * 2;
    var scale = Math.min(availW / CANVAS_W, availH / CANVAS_H);

    if (!isFinite(scale) || scale <= 0) scale = 1;
    document.documentElement.style.setProperty('--s', scale.toFixed(4));
  }

  /* ——————————————————————————————— 導覽 ————————————————————— */

  function clamp(i) {
    return Math.max(0, Math.min(total - 1, i));
  }

  function render() {
    slides.forEach(function (slide, i) {
      var active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      if ('inert' in HTMLElement.prototype) slide.inert = !active;
    });

    el.cur.textContent = String(index + 1);
    el.progressBar.style.width = (((index + 1) / total) * 100).toFixed(2) + '%';
    el.prev.disabled = index === 0;
    el.next.disabled = index === total - 1;

    if (!el.notesPanel.hidden) renderNotes();

    el.live.textContent = '第 ' + (index + 1) + ' 張，共 ' + total + ' 張';
  }

  function go(i, opts) {
    var next = clamp(i);
    if (next === index && opts && opts.silent) return;
    index = next;
    render();
    writeStore(index);
    if (!opts || !opts.fromHash) {
      var hash = '#' + (index + 1);
      if (window.location.hash !== hash) {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', hash);
        } else {
          window.location.hash = hash;
        }
      }
    }
  }

  var nextSlide = function () { go(index + 1); };
  var prevSlide = function () { go(index - 1); };

  /* ——————————————————————————————— 講者備註 ————————————————— */

  function renderNotes() {
    var src = slides[index].querySelector('.slide-notes');
    el.notesFor.textContent = (index + 1) + ' / ' + total;
    if (src && src.innerHTML.trim()) {
      el.notesBody.innerHTML = src.innerHTML;
    } else {
      el.notesBody.innerHTML = '<p class="panel-empty">這張沒有備註。</p>';
    }
  }

  function toggleNotes(force) {
    var show = typeof force === 'boolean' ? force : el.notesPanel.hidden;
    el.notesPanel.hidden = !show;
    el.notesBtn.setAttribute('aria-pressed', show ? 'true' : 'false');
    if (show) renderNotes();
  }

  function toggleHelp(force) {
    var show = typeof force === 'boolean' ? force : el.helpPanel.hidden;
    el.helpPanel.hidden = !show;
    el.helpBtn.setAttribute('aria-pressed', show ? 'true' : 'false');
  }

  /* ——————————————————————————————— 全螢幕 ————————————————————— */

  function toggleFullscreen() {
    var doc = document;
    var root = doc.documentElement;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      var req = root.requestFullscreen || root.webkitRequestFullscreen;
      if (req) req.call(root).catch(function () { /* 使用者拒絕時忽略 */ });
    } else {
      var exit = doc.exitFullscreen || doc.webkitExitFullscreen;
      if (exit) exit.call(doc);
    }
  }

  /* ——————————————————————————————— 事件 ————————————————————— */

  el.next.addEventListener('click', nextSlide);
  el.prev.addEventListener('click', prevSlide);
  el.notesBtn.addEventListener('click', function () { toggleNotes(); });
  el.notesClose.addEventListener('click', function () { toggleNotes(false); el.notesBtn.focus(); });
  el.helpBtn.addEventListener('click', function () { toggleHelp(); });
  el.helpClose.addEventListener('click', function () { toggleHelp(false); el.helpBtn.focus(); });

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    var t = e.target;
    if (t && (t.isContentEditable ||
              /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault(); nextSlide(); break;
      case ' ':
      case 'Spacebar':
        // 空白鍵在按鈕上是「按下」，讓瀏覽器處理
        if (t && t.tagName === 'BUTTON') return;
        e.preventDefault(); nextSlide(); break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault(); prevSlide(); break;
      case 'ArrowDown':
        e.preventDefault(); nextSlide(); break;
      case 'ArrowUp':
        e.preventDefault(); prevSlide(); break;
      case 'Home':
        e.preventDefault(); go(0); break;
      case 'End':
        e.preventDefault(); go(total - 1); break;
      case 'Escape':
        if (!el.helpPanel.hidden) { e.preventDefault(); toggleHelp(false); }
        else if (!el.notesPanel.hidden) { e.preventDefault(); toggleNotes(false); }
        break;
      case 'n':
      case 'N':
        e.preventDefault(); toggleNotes(); break;
      case 'f':
      case 'F':
        e.preventDefault(); toggleFullscreen(); break;
      case '?':
      case 'h':
      case 'H':
        e.preventDefault(); toggleHelp(); break;
      default:
        if (/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          // 0 代表第 10 張
          go(e.key === '0' ? 9 : parseInt(e.key, 10) - 1);
        }
    }
  });

  // 觸控滑動
  var touch = null;
  el.stage.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { touch = null; return; }
    touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });

  el.stage.addEventListener('touchend', function (e) {
    if (!touch) return;
    var end = e.changedTouches[0];
    var dx = end.clientX - touch.x;
    var dy = end.clientY - touch.y;
    var dt = Date.now() - touch.t;
    touch = null;
    if (dt > 800) return;
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) nextSlide(); else prevSlide();
  }, { passive: true });

  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);

  window.addEventListener('hashchange', function () {
    var i = parseHash();
    if (i !== null) go(i, { fromHash: true });
  });

  /* ——————————————————————————————— 啟動 ————————————————————— */

  function parseHash() {
    var m = /^#\/?(\d+)$/.exec(window.location.hash || '');
    if (!m) return null;
    var n = parseInt(m[1], 10) - 1;
    return (n >= 0 && n < total) ? n : null;
  }

  el.total.textContent = String(total);

  var start = parseHash();
  if (start === null) {
    var saved = readStore();
    start = (saved !== null && !isNaN(saved) && saved >= 0 && saved < total) ? saved : 0;
  }

  fit();
  go(start);

  // 字型載入完成後版面高度可能改變，重新計算一次縮放
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fit).catch(function () {});
  }

  // 列印時取消縮放，結束後復原
  if (window.matchMedia) {
    var mq = window.matchMedia('print');
    var onPrint = function (e) {
      if (e.matches) {
        document.documentElement.style.setProperty('--s', '1');
      } else {
        fit();
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', onPrint);
    else if (mq.addListener) mq.addListener(onPrint);
  }
  window.addEventListener('afterprint', fit);
})();
