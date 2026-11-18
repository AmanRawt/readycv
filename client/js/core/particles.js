/* ============================================================
   ReadyCVs — particles.js  (Optimized v2)
   Fixes: particles now cover FULL screen at all times
   - No directional drift (particles float randomly in all dirs)
   - Recycled particles spawn at random positions, not just bottom
   - Viewport coverage maintained via zone-based distribution
   - Performance: visibility API pause, RAF cleanup
   ============================================================ */

(function () {
  // Avoid duplicate canvas if already exists
  if (document.getElementById('particles-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0',
    pointerEvents: 'none', zIndex: '0',
    width: '100%', height: '100%',
    opacity: '0.55'
  });
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId, frameCount = 0;

  const COLORS = [
    'rgba(168,85,247,',   // purple
    'rgba(163,230,53,',   // lime
    'rgba(192,132,252,',  // purple-soft
    'rgba(190,242,100,',  // lime-soft
    'rgba(99,179,237,',   // cyan
  ];

  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ── Create one particle at a truly random screen position ── */
  function createParticle(forceX, forceY) {
    const maxLife = rnd(300, 600);
    return {
      x:         forceX !== undefined ? forceX : rnd(0, W),
      y:         forceY !== undefined ? forceY : rnd(0, H),
      size:      rnd(1.2, 3.2),
      color:     COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha:     rnd(0.35, 0.8),
      // Slow random drift in ANY direction — no upward bias
      vx:        rnd(-0.22, 0.22),
      vy:        rnd(-0.22, 0.22),
      life:      0,
      maxLife,
      pulse:     rnd(0, Math.PI * 2),
      pulseSpeed:rnd(0.012, 0.03),
    };
  }

  /* ── Zone-based init: divide screen into grid, seed evenly ── */
  function initParticles() {
    particles = [];
    // Base count on screen area, capped for performance
    const count = Math.min(Math.floor((W * H) / 7000), 100);

    // Grid zones to ensure even full-screen coverage
    const cols = Math.ceil(Math.sqrt(count * (W / H)));
    const rows = Math.ceil(count / cols);
    const cellW = W / cols;
    const cellH = H / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (particles.length >= count) break;
        const p = createParticle(
          rnd(c * cellW, (c + 1) * cellW),
          rnd(r * cellH, (r + 1) * cellH)
        );
        // Stagger life so they don't all fade out at once
        p.life = Math.random() * p.maxLife;
        particles.push(p);
      }
    }
  }

  /* ── Draw single particle with glow ── */
  function drawParticle(p) {
    const t    = p.life / p.maxLife;
    const fade = t < 0.12 ? t / 0.12 : t > 0.88 ? (1 - t) / 0.12 : 1;
    const pulse= 0.88 + 0.12 * Math.sin(p.pulse);
    const r    = p.size * pulse;
    const a    = p.alpha * fade;
    if (a < 0.01) return;

    // Outer glow
    const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
    gr.addColorStop(0,   p.color + a + ')');
    gr.addColorStop(0.45,p.color + (a * 0.35) + ')');
    gr.addColorStop(1,   p.color + '0)');
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
    ctx.fillStyle = gr;
    ctx.fill();

    // Solid core
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = p.color + Math.min(a * 1.5, 1) + ')';
    ctx.fill();
  }

  /* ── Draw connection lines (throttled — every 2 frames) ── */
  function drawConnections() {
    const maxDist = 110;
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const a = (1 - dist / maxDist) * 0.075;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168,85,247,${a})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Main animation loop ── */
  function tick() {
    ctx.clearRect(0, 0, W, H);
    frameCount++;

    // Connections every 2 frames (perf optimization)
    if (frameCount % 2 === 0) drawConnections();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life  += 1;
      p.pulse += p.pulseSpeed;
      p.x     += p.vx;
      p.y     += p.vy;

      // Tiny random micro-drift (organic feel)
      p.vx += rnd(-0.003, 0.003);
      p.vy += rnd(-0.003, 0.003);
      // Clamp speed — no direction bias
      p.vx = Math.max(-0.3, Math.min(0.3, p.vx));
      p.vy = Math.max(-0.3, Math.min(0.3, p.vy));

      // Wrap around edges (seamless — no edge clustering)
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Recycle when lifetime ends — spawn at random position
      if (p.life >= p.maxLife) {
        particles[i]      = createParticle();
        particles[i].life = 0;
        // Spawn anywhere on screen (not just bottom!)
        particles[i].x    = rnd(0, W);
        particles[i].y    = rnd(0, H);
      }

      drawParticle(p);
    }

    animId = requestAnimationFrame(tick);
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function start() {
    cancelAnimationFrame(animId);
    frameCount = 0;
    resize();
    initParticles();
    tick();
  }

  // Debounced resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      initParticles();
      tick();
    }, 150);
  });

  // Pause on hidden tab (battery/CPU saving)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else start();
  });

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
