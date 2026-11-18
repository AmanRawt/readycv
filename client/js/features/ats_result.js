/* ============================================================
   ReadyCVs — ats_result.js  v3
   Full premium score result page logic
   ============================================================ */
'use strict';

/* ─── URL PARAMS ────────────────────────────────────────── */
const params      = new URLSearchParams(window.location.search);
const score       = Math.min(100, Math.max(0, parseInt(params.get('score') || '0')));
const missingKW   = safeJSON(params.get('keywords'),   ['Python','SQL','Communication','Leadership','Data Analysis','Project Management','Agile']);
const suggestions = safeJSON(params.get('suggestions'), ['Add quantifiable achievements like percentages or numbers','Include more industry-specific keywords','Use standard section headings: Work Experience, Education, Skills','Add a professional summary section at the top','Include your LinkedIn profile URL','Use stronger action verbs to start each bullet point']);
const strengths   = safeJSON(params.get('strengths'),   ['Clear contact information present','Good use of action verbs detected']);
const foundKW     = safeJSON(params.get('found'),       ['JavaScript','React','Communication']);
const field       = params.get('field') || 'general';
const breakdown   = safeJSON(params.get('breakdown'),   { sections: 0, keywords: 0, content: 0, formatting: 0 });

/* ─── ATS TIPS DATABASE ─────────────────────────────────── */
const ATS_TIPS = [
  { emoji: '💡', text: 'Use <strong>exact keywords</strong> from the job description — ATS matches exact phrases, not synonyms!' },
  { emoji: '📄', text: 'Avoid tables and columns — ATS systems often <strong>can\'t parse multi-column layouts</strong>. Use single-column.' },
  { emoji: '📝', text: 'Use <strong>standard section headings</strong>: "Work Experience", "Education", "Skills" — not creative alternatives.' },
  { emoji: '💾', text: 'Save your resume as PDF from Word or Google Docs, <strong>not from Canva or design tools</strong>.' },
  { emoji: '🎯', text: 'Don\'t bury contact info in headers/footers — ATS often <strong>can\'t read those areas</strong>.' },
  { emoji: '✅', text: 'Start every bullet point with a <strong>strong action verb</strong>: Led, Built, Achieved, Designed, Managed.' },
  { emoji: '📊', text: 'Add <strong>quantifiable metrics</strong>: "30% increase", "$2M budget", "500K users" — numbers are powerful.' },
  { emoji: '🔤', text: 'List skills exactly as in the job posting: <strong>"JavaScript"</strong> not "JS". Spelling matters for ATS!' },
  { emoji: '📅', text: 'Use consistent date format: <strong>"Jan 2022 – Dec 2023"</strong> throughout your entire resume.' },
  { emoji: '📋', text: 'Include a dedicated <strong>Skills section</strong> — many ATS systems specifically scan for this heading.' },
  { emoji: '✂️', text: 'Keep bullets to <strong>1-2 lines</strong>. Recruiters spend ~7 seconds per resume — make it scannable.' },
  { emoji: '🌟', text: 'Your professional summary should contain <strong>3-5 keywords</strong> from the target job description.' },
  { emoji: '🎯', text: '<strong>Tailor your resume</strong> for EACH application. One generic resume rarely passes multiple ATS filters.' },
  { emoji: '📐', text: 'Use <strong>0.5-1 inch margins</strong> — cramped or too-sparse text can lower your readability score.' },
  { emoji: '🔢', text: 'List <strong>most recent experience first</strong> — reverse chronological is the ATS standard format.' },
  { emoji: '❌', text: 'Never use <strong>images, photos, or graphics</strong> in your resume body — ATS can\'t read them.' },
  { emoji: '📌', text: 'Spell out acronyms once: <strong>"Search Engine Optimization (SEO)"</strong> then use the abbreviation.' },
  { emoji: '💼', text: 'Match your <strong>job title</strong> to the one in the posting when describing past roles.' },
  { emoji: '🔑', text: 'Include your <strong>city/location</strong> — many ATS systems filter by location before human review.' },
  { emoji: '🔗', text: 'Add your <strong>LinkedIn URL</strong> — it adds credibility and is a standard ATS field.' },
];

/* ─── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initStarCanvas();
  initTickMarks();
  setupHero();

  // Stagger the animated sections
  setTimeout(() => animateScore(),        400);
  setTimeout(() => animateBreakdown(),    700);
  setTimeout(() => renderImprovements(),  900);
  setTimeout(() => renderKeywords(),     1100);
  setTimeout(() => renderStrengths(),    1200);
  setTimeout(() => renderTips(),         1300);
});

/* ─── STAR CANVAS ───────────────────────────────────────── */
function initStarCanvas() {
  const c = document.getElementById('starCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, stars = [];

  function resize() { W = c.width = innerWidth; H = c.height = innerHeight; }
  resize();
  addEventListener('resize', resize);

  for (let i = 0; i < 65; i++) {
    stars.push({
      x: Math.random() * 9999, y: Math.random() * 9999,
      vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      r:  Math.random() * 1.4 + .4,
      a:  Math.random() * .45 + .1,
      c:  Math.random() > .55 ? '168,85,247' : Math.random() > .4 ? '163,230,53' : '99,102,241'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Lines between nearby stars
    for (let i = 0; i < stars.length; i++) {
      const p = stars[i];
      for (let j = i + 1; j < stars.length; j++) {
        const q = stars[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(168,85,247,${(.07 * (1 - dist / 120))})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    stars.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── TICK MARKS ────────────────────────────────────────── */
function initTickMarks() {
  const svg = document.getElementById('tickSvg');
  if (!svg) return;
  const cx = 100, cy = 100, r = 80;
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isMaj = i % 5 === 0;
    const inner = r - (isMaj ? 11 : 5);
    const outer = r + (isMaj ? 4 : 2);
    const x1 = cx + Math.cos(angle) * inner;
    const y1 = cy + Math.sin(angle) * inner;
    const x2 = cx + Math.cos(angle) * outer;
    const y2 = cy + Math.sin(angle) * outer;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', `rgba(255,255,255,${isMaj ? .14 : .06})`);
    line.setAttribute('stroke-width', isMaj ? 1.5 : .8);
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
  }
}

/* ─── HERO SETUP ────────────────────────────────────────── */
function setupHero() {
  const badge    = document.getElementById('heroBadgeText');
  const title    = document.getElementById('heroTitle');
  const subtitle = document.getElementById('heroSubtitle');
  if (!title) return;

  if (score >= 85) {
    if (badge)    badge.textContent    = '🎉 Outstanding Result!';
    title.textContent                  = 'Impressive ATS Score! 🏆';
    if (subtitle) subtitle.textContent = 'Your resume is exceptionally well-optimized. A few final tweaks and you\'ll be unstoppable!';
  } else if (score >= 70) {
    if (badge)    badge.textContent    = '✅ Great Result';
    title.textContent                  = 'Solid Score — Almost There! 🎯';
    if (subtitle) subtitle.textContent = 'Your resume is performing well against ATS systems. Let\'s close those remaining gaps!';
  } else if (score >= 55) {
    if (badge)    badge.textContent    = '⚡ Analysis Complete';
    title.textContent                  = 'Good Start! Room to Grow 📈';
    if (subtitle) subtitle.textContent = 'Your resume is decent but there\'s real room to improve. These targeted fixes can boost your score fast.';
  } else {
    if (badge)    badge.textContent    = '⚠️ Analysis Complete';
    title.textContent                  = "Let's Level This Up! 💪";
    if (subtitle) subtitle.textContent = "Don't worry — with a few targeted changes your score can jump dramatically. Start with the top improvements below.";
  }
}

/* ─── SCORE ANIMATION ───────────────────────────────────── */
function animateScore() {
  const numEl  = document.getElementById('scoreValue');
  const arcEl  = document.getElementById('scoreArc');
  const pillEl = document.getElementById('scorePill');
  const capEl  = document.getElementById('arcCapDot');
  if (!arcEl) return;

  // Animate number count-up
  if (numEl) {
    let current = 0;
    const duration = 1800;
    const start = performance.now();
    function countUp(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      current = Math.round(eased * score);
      numEl.textContent = current;
      if (p < 1) requestAnimationFrame(countUp);
    }
    requestAnimationFrame(countUp);
  }

  // Animate arc
  const circumference = 2 * Math.PI * 80; // r=80 → 502.65
  const offset = circumference - (score / 100) * circumference;
  arcEl.style.strokeDashoffset = offset;

  // Animate cap dot position
  if (capEl) {
    const cx = 100, cy = 100, r = 80;
    const angle = (score / 100) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    // animate via CSS transition on the element's transform
    capEl.setAttribute('cx', x);
    capEl.setAttribute('cy', y);
  }

  // Score pill
  if (pillEl) {
    setTimeout(() => {
      if (score >= 85) {
        pillEl.textContent = '🎉 Excellent!';
        pillEl.className   = 'score-pill pill-great';
      } else if (score >= 70) {
        pillEl.textContent = '✅ Good';
        pillEl.className   = 'score-pill pill-good';
      } else if (score >= 55) {
        pillEl.textContent = '⚡ Average';
        pillEl.className   = 'score-pill pill-avg';
      } else {
        pillEl.textContent = '⚠️ Needs Work';
        pillEl.className   = 'score-pill pill-poor';
      }
    }, 600);
  }
}

/* ─── BREAKDOWN ANIMATION ───────────────────────────────── */
function animateBreakdown() {
  const cats = [
    { key: 'sections',   idScore: 'bdSections',  idBar: 'barSections',  val: breakdown.sections   ?? 0 },
    { key: 'keywords',   idScore: 'bdKeywords',  idBar: 'barKeywords',  val: breakdown.keywords   ?? 0 },
    { key: 'content',    idScore: 'bdContent',   idBar: 'barContent',   val: breakdown.content    ?? 0 },
    { key: 'formatting', idScore: 'bdFormatting',idBar: 'barFormatting',val: breakdown.formatting ?? 0 },
  ];

  cats.forEach((cat, i) => {
    setTimeout(() => {
      const scoreEl = document.getElementById(cat.idScore);
      const barEl   = document.getElementById(cat.idBar);
      if (scoreEl) scoreEl.textContent = `${cat.val}/25`;
      if (barEl)   barEl.style.width   = `${(cat.val / 25) * 100}%`;
    }, i * 150);
  });

  // Radar chart
  setTimeout(() => animateRadar(cats.map(c => c.val)), 400);
}

/* ─── RADAR CHART ───────────────────────────────────────── */
function animateRadar(vals) {
  // vals = [sections, keywords, content, formatting] — each 0-25
  // 4 axes in radar: top, right, bottom, left
  const CX = 80, CY = 80, MAX_R = 65;
  const axes = [
    { angle: -Math.PI / 2 },  // top    (sections)
    { angle: 0 },              // right  (keywords)
    { angle: Math.PI / 2 },   // bottom (content)
    { angle: Math.PI },        // left   (formatting)
  ];

  const points = vals.map((v, i) => {
    const pct = Math.min(v / 25, 1);
    const minR = 10;
    const r = minR + pct * (MAX_R - minR);
    return {
      x: CX + Math.cos(axes[i].angle) * r,
      y: CY + Math.sin(axes[i].angle) * r,
      pct
    };
  });

  const poly = document.getElementById('radarPoly');
  const dotsG = document.getElementById('radarDots');
  if (!poly) return;

  const ptStr = points.map(p => `${p.x},${p.y}`).join(' ');
  poly.style.transition = 'all 1.5s cubic-bezier(.16,1,.3,1)';
  poly.setAttribute('points', ptStr);

  if (dotsG) {
    dotsG.innerHTML = '';
    points.forEach(p => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y);
      c.setAttribute('r', 4);
      c.setAttribute('fill', '#a3e635');
      c.setAttribute('filter', 'url(#arcGlow)');
      dotsG.appendChild(c);
    });
  }
}

/* ─── RENDER IMPROVEMENTS ───────────────────────────────── */
function renderImprovements() {
  const el = document.getElementById('improvementsList');
  if (!el) return;

  if (!suggestions.length) {
    el.innerHTML = `<div class="improv-item" style="grid-column:1/-1"><p style="color:var(--txt2);font-size:.9rem">🎉 No major improvements needed — your resume is in great shape!</p></div>`;
    return;
  }

  el.innerHTML = suggestions.map((s, i) => `
    <div class="improv-item" style="animation-delay:${i * .07}s">
      <div class="improv-num">${i + 1}</div>
      <div class="improv-body">
        <p class="improv-label">Tip ${i + 1}</p>
        <p class="improv-text">${escHTML(s)}</p>
      </div>
    </div>
  `).join('');
}

/* ─── RENDER KEYWORDS ───────────────────────────────────── */
function renderKeywords() {
  const missEl  = document.getElementById('missingKeywords');
  const foundEl = document.getElementById('foundKeywords');

  if (missEl) {
    if (missingKW.length) {
      missEl.innerHTML = missingKW.map((kw, i) => `
        <span class="chip chip-miss" style="animation-delay:${i * .05}s">${escHTML(kw)}</span>
      `).join('');
    } else {
      missEl.innerHTML = `<p style="color:var(--txt3);font-size:.8rem">No missing keywords — great coverage!</p>`;
    }
  }

  if (foundEl) {
    if (foundKW.length) {
      foundEl.innerHTML = foundKW.map((kw, i) => `
        <span class="chip chip-found" style="animation-delay:${i * .05}s">
          <svg class="chip-check" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#a3e635" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${escHTML(kw)}
        </span>
      `).join('');
    } else {
      foundEl.innerHTML = `<p style="color:var(--txt3);font-size:.8rem">No specific keywords detected.</p>`;
    }
  }
}

/* ─── RENDER STRENGTHS ───────────────────────────────────── */
function renderStrengths() {
  const el   = document.getElementById('strengthsList');
  const card = document.getElementById('strengthsCard');
  if (!el) return;

  if (!strengths.length) {
    card?.remove();
    return;
  }

  el.innerHTML = strengths.map((s, i) => `
    <div class="strength-item" style="animation-delay:${i * .08}s">
      <svg class="strength-check" viewBox="0 0 24 24" fill="none">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#a3e635" stroke-width="2" stroke-linecap="round"/>
        <polyline points="22 4 12 14.01 9 11.01" stroke="#a3e635" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>${escHTML(s)}</p>
    </div>
  `).join('');
}

/* ─── RENDER TIPS ─────────────────────────────────────────── */
function renderTips() {
  const el = document.getElementById('tipsGrid');
  if (!el) return;

  // Show 9 tips (3 rows of 3)
  const shown = ATS_TIPS.slice(0, 9);
  el.innerHTML = shown.map((tip, i) => `
    <div class="tip-card" style="animation-delay:${i * .06}s">
      <div class="tip-emoji">${tip.emoji}</div>
      <p class="tip-text">${tip.text}</p>
    </div>
  `).join('');
}

/* ─── HELPERS ─────────────────────────────────────────────── */
function safeJSON(str, fallback) {
  try { return str ? JSON.parse(decodeURIComponent(str)) : fallback; }
  catch { return fallback; }
}

function escHTML(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}
