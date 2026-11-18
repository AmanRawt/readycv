/* ============================================================
   ReadyCV — index.js v7
   Typewriter · Mobile menu · Scroll reveal · Ticker loop
   Carousel 5s hover-pause · FAQ · Resume count (+1 per hour)
   ============================================================ */
'use strict';

/* ── Hero Typewriter ──────────────────────────────────────── */
(function initTypewriter() {
  var phrases = ['Starts Here.','Begins Today.','Gets Better.','Lands Jobs.','Is Ready Now.'];
  var el = document.getElementById('heroTyped');
  if (!el) return;
  var pi = 0, ci = 0, del = false;
  var TY = 75, TD = 38, PF = 2200, PE = 380;
  function tick() {
    var cur = phrases[pi];
    if (!del) {
      ci++; el.textContent = cur.slice(0, ci);
      if (ci === cur.length) { del = true; setTimeout(tick, PF); return; }
      setTimeout(tick, TY);
    } else {
      ci--; el.textContent = cur.slice(0, ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, PE); return; }
      setTimeout(tick, TD);
    }
  }
  setTimeout(tick, 900);
})();

/* ── Mobile Menu ──────────────────────────────────────────── */
function closeMobileMenu() {
  var m = document.getElementById('dropdownMenu');
  var t = document.getElementById('menuToggle');
  if (!m) return;
  m.classList.remove('open');
  if (t) t.setAttribute('aria-expanded', 'false');
}

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('menuToggle');
  var menu   = document.getElementById('dropdownMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMobileMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  /* ── Header scroll shadow ─────────── */
  var hdr = document.getElementById('siteHeader');
  if (hdr) {
    window.addEventListener('scroll', function () {
      hdr.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Scroll reveal ────────────────── */
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(function (el) { ro.observe(el); });

  /* ── Ticker: duplicate for seamless loop ── */
  initTicker();

  /* ── Testimonial carousel (5s, hover pause) ── */
  initCarousel();

  /* ── FAQ accordion ────────────────── */
  /* toggleFaq() is called inline via onclick — no extra init needed */

  /* ── Resume count — auto +1 every hour ── */
  initResumeCount();

  /* ── Template modal ───────────────── */
  buildIndexTemplateGrid();
});

/* ── Ticker ───────────────────────────────────────────────── */
function initTicker() {
  var track = document.getElementById('tickerTrack');
  if (!track) return;
  Array.from(track.children).forEach(function (item) {
    track.appendChild(item.cloneNode(true));
  });
}

/* ── Testimonial Carousel ─────────────────────────────────── */
function initCarousel() {
  var track  = document.getElementById('redditTrack');
  var dots   = document.querySelectorAll('.rdot');
  if (!track) return;

  var cards     = track.querySelectorAll('.testimonial-card');
  var total     = cards.length;
  var current   = 0;
  var paused    = false;
  var isDragging = false, startX = 0, scrollLeft = 0;

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    var card = cards[current];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.getAttribute('data-idx'), 10));
    });
  });

  track.addEventListener('scroll', function () {
    var center = track.scrollLeft + track.clientWidth / 2;
    var closest = 0, minDist = Infinity;
    cards.forEach(function (c, i) {
      var dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    current = closest;
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }, { passive: true });

  function setPaused(v) { paused = v; }
  track.addEventListener('mouseenter', function () { setPaused(true); });
  track.addEventListener('mouseleave', function () { setPaused(false); });
  cards.forEach(function (c) {
    c.addEventListener('mouseenter', function () { setPaused(true); });
    c.addEventListener('mouseleave', function () { setPaused(false); });
  });

  track.addEventListener('mousedown', function (e) {
    isDragging = true; track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
  });
  document.addEventListener('mouseup', function () {
    isDragging = false; track.classList.remove('dragging');
  });
  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    e.preventDefault();
    track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.2;
  });

  setInterval(function () {
    if (!paused) goTo(current + 1);
  }, 5000);
}

/* ── FAQ Accordion ────────────────────────────────────────── */
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  if (!item) return;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function (el) {
    el.classList.remove('open');
    var icon = el.querySelector('.faq-icon');
    if (icon) icon.textContent = 'add';
  });
  if (!isOpen) {
    item.classList.add('open');
    var icon = btn.querySelector('.faq-icon');
    if (icon) icon.textContent = 'remove';
  }
}

/* ── Resume Count — +1 every real hour via localStorage ─────
   Logic:
   - On page load, read `readycv_resume_count` (base count, set by PDF downloads).
   - Also read `readycv_hourly_ts` (last hourly increment timestamp).
   - Calculate how many full hours have passed since last ts.
   - Add that many to the display count, update ts to now.
   - So the displayed number grows by 1 each hour automatically
     even without any user downloading, simulating steady growth.
   - Real downloads (from resume_maker.js patch) still add to
     `readycv_resume_count` directly.
─────────────────────────────────────────────────────────── */
function initResumeCount() {
  var el = document.getElementById('resumeCountStat');
  if (!el) return;

  var BASE = 50; /* minimum displayed value */
  var HOUR_MS = 60 * 60 * 1000; /* 1 hour in ms */

  function getCount() {
    try {
      /* Real downloads base */
      var downloads = parseInt(localStorage.getItem('readycv_resume_count') || '0', 10);

      /* Hourly auto-increment */
      var now       = Date.now();
      var lastTs    = parseInt(localStorage.getItem('readycv_hourly_ts') || String(now), 10);
      var hoursPassed = Math.floor((now - lastTs) / HOUR_MS);

      /* Accumulate hourly into a separate key so it persists */
      var hourlyTotal = parseInt(localStorage.getItem('readycv_hourly_total') || '0', 10);

      if (hoursPassed > 0) {
        hourlyTotal += hoursPassed;
        localStorage.setItem('readycv_hourly_total', String(hourlyTotal));
        /* Move timestamp forward by the hours we've consumed */
        localStorage.setItem('readycv_hourly_ts', String(lastTs + hoursPassed * HOUR_MS));
      }

      return Math.max(BASE, downloads + hourlyTotal);
    } catch (e) {
      return BASE;
    }
  }

  /* Initial render */
  function render() {
    el.textContent = getCount() + '+';
  }
  render();

  /* Re-check every 60 seconds (lightweight, just updates display) */
  setInterval(render, 60000);
}

/* ── Template Modal ───────────────────────────────────────── */
function openTemplates() {
  var o = document.getElementById('tplOverlay');
  if (o) o.classList.add('open');
  document.body.style.overflow = 'hidden';
  buildIndexTemplateGrid();
  o.addEventListener('click', function (e) {
    if (e.target === o) closeTemplates();
  }, { once: false });
}
function closeTemplates() {
  var o = document.getElementById('tplOverlay');
  if (o) o.classList.remove('open');
  document.body.style.overflow = '';
}
function buildIndexTemplateGrid() {
  var grid = document.getElementById('tplGrid');
  if (!grid) return;
  if (!window.TEMPLATES || !window.TEMPLATES.length) { setTimeout(buildIndexTemplateGrid, 300); return; }
  if (grid.children.length > 0) return;
  window.TEMPLATES.forEach(function (tpl) {
    var card = document.createElement('div');
    card.className = 'tpl-card'; card.id = 'idx-tpl-' + tpl.id;
    card.innerHTML =
      '<img class="tpl-thumb" src="" alt="' + tpl.name + '" style="width:100%;display:block">' +
      '<div class="tpl-info"><div class="tpl-name">' + tpl.name +
      ' <span class="tpl-tag">' + tpl.tag + '</span></div>' +
      '<p class="tpl-desc">' + tpl.desc + '</p></div>' +
      '<button class="tpl-select-btn" onclick="selectAndGo(\'' + tpl.id + '\')">Use This Template →</button>';
    var blob = new Blob([tpl.thumb], { type: 'image/svg+xml' });
    card.querySelector('img').src = URL.createObjectURL(blob);
    grid.appendChild(card);
  });
}
function selectAndGo(id) {
  try {
    var d = JSON.parse(localStorage.getItem('readycv_draft') || '{}');
    d.activeTemplate = id; localStorage.setItem('readycv_draft', JSON.stringify(d));
  } catch (e) {}
  window.location.href = 'resume_maker.html?tpl=' + id;
}
