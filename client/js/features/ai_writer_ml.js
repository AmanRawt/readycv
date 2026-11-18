/* ============================================================
   ReadyCVs — ai_writer_ml.js v6 (Pure ML — NO API KEYS)
   Drop-in replacement for Anthropic/Gemini API version
   Works with ml_ats_engine.py on localhost:5050
   ============================================================ */
'use strict';

const ML_BASE = 'http://localhost:5050/ml';

/* Delegate everything to the main ai_resume_writer.js engine.
   This file only overrides the network calls to point at the
   local ML server instead of a cloud API.               */

/* ── Override generateBullets to always prefer ML server ──── */
window.generateBullets = async function () {
  const el = document.getElementById('bulletInput');
  const prompt = el?.value?.trim();
  if (!prompt || prompt.length < 10) {
    el?.classList.add('shake');
    setTimeout(() => el?.classList.remove('shake'), 500);
    showToast('⚠️ Please describe your experience first');
    return;
  }

  showLoading('ML engine writing ATS-optimized bullets…');

  try {
    const resp = await fetch(`${ML_BASE}/ai-write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        sectionType: window._sectionType || 'experience',
        count: window._bulletCount || 5
      })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || `ML server error ${resp.status}`);
    }

    const data = await resp.json();
    const bullets = (data.content || '').split('\n')
      .map(l => l.replace(/^[\d]+[.)]\s*|^[•\-\*]\s*/, '').trim())
      .filter(l => l.length > 15);

    if (bullets.length) {
      showBullets(bullets);
    } else {
      throw new Error('Empty response from ML server');
    }

  } catch (err) {
    console.warn('[ML] Falling back to local engine:', err.message);
    if (typeof localGenerateBullets === 'function') {
      const bullets = localGenerateBullets(prompt, window._sectionType || 'experience', window._bulletCount || 5);
      showBullets(bullets);
    } else {
      showErrorState(err.message.includes('Failed to fetch')
        ? '⚠️ ML server offline. Run: python ml_ats_engine.py'
        : 'Error: ' + err.message);
    }
  }
};

/* ── Override generateFullResume ───────────────────────────── */
window.generateFullResume = async function () {
  const el = document.getElementById('fullInput');
  const description = el?.value?.trim();
  if (!description || description.length < 60) {
    el?.classList.add('shake');
    setTimeout(() => el?.classList.remove('shake'), 500);
    showToast('⚠️ Please write a more detailed description (60+ chars)');
    return;
  }

  showLoading('ML engine generating your complete resume…');

  try {
    /* 1. Try the Node.js express server first (has template logic) */
    const nodeResp = await fetch('http://localhost:3001/api/ai-full-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    }).catch(() => null);

    if (nodeResp && nodeResp.ok) {
      const data = await nodeResp.json();
      if (data.ok && data.data) {
        localStorage.setItem('readycv_ai_fulldata', JSON.stringify(data.data));
        if (typeof showFullResult === 'function') showFullResult(data.data, description);
        return;
      }
    }

    /* 2. Try ML server summary endpoint */
    const mlResp = await fetch(`${ML_BASE}/ai-write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: description, sectionType: 'summary', count: 4 })
    });

    if (mlResp.ok) {
      const mlData = await mlResp.json();
      const summaryBullets = (mlData.content || '').split('\n')
        .map(l => l.replace(/^[•\-\*\d.)\s]+/, '').trim())
        .filter(l => l.length > 10);

      if (summaryBullets.length && typeof showBullets === 'function') {
        showBullets(summaryBullets);
        showToast('✅ Summary generated — copy these to your Resume Builder!');
        return;
      }
    }

    throw new Error('ML server did not return usable content');

  } catch (err) {
    console.warn('[ML Full Resume] Falling back to parser:', err.message);
    if (typeof parseDescriptionToResume === 'function') {
      const parsed = parseDescriptionToResume(description);
      localStorage.setItem('readycv_ai_fulldata', JSON.stringify(parsed));
      if (typeof showFullResult === 'function') showFullResult(parsed, description);
    } else {
      showErrorState(err.message.includes('Failed to fetch')
        ? '⚠️ ML server offline. Run: python ml_ats_engine.py'
        : 'Error: ' + err.message);
    }
  }
};

/* ── Helper: showErrorState (fallback if main JS not loaded) ── */
function showErrorState(msg) {
  const el = document.getElementById('stLoading') || document.getElementById('stEmpty');
  if (!el) return;
  el.innerHTML = `
    <div style="text-align:center;padding:2rem 1rem">
      <span class="material-symbols-outlined" style="font-size:2.5rem;color:#f87171;display:block;margin-bottom:.75rem">error_outline</span>
      <p style="color:#f87171;font-size:.9rem">${msg}</p>
      <p style="color:var(--t3);font-size:.78rem;margin-top:.5rem">Make sure ml_ats_engine.py is running on port 5050</p>
    </div>`;
}
