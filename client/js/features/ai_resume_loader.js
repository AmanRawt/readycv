/* ============================================================
   ReadyCVs — ai_resume_loader.js  v3
   Fixed: skills async injection · all fields loading ·
          skillsWithLevels support · robust retry logic
   ============================================================ */
'use strict';

(function () {
  if (!window.location.search.includes('fromAI=1')) return;

  /* ── Retry until resume_maker.js is fully initialised ─────── */
  function tryLoad(attempts) {
    if (attempts <= 0) {
      console.warn('[AI Loader] Timed out waiting for resume_maker.js');
      return;
    }

    const ready = typeof addExperience === 'function'
               && typeof addEducation  === 'function'
               && typeof addSkill      === 'function'
               && typeof updateResume  === 'function';

    if (!ready) { setTimeout(() => tryLoad(attempts - 1), 150); return; }

    const raw = localStorage.getItem('readycv_ai_resume')
             || localStorage.getItem('readycv_ai_fulldata');
    if (!raw) { console.warn('[AI Loader] No data in localStorage'); return; }

    let data;
    try { data = JSON.parse(raw); } catch(e) { console.error('[AI Loader] JSON parse error', e); return; }

    /* ── setVal: set input value & fire events ──────────────── */
    function setVal(id, val) {
      if (val === undefined || val === null || val === '') return;
      const el = document.getElementById(id);
      if (!el) return;
      el.value = String(val);
      el.dispatchEvent(new Event('input',  { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const info = data.personalInfo || {};

    /* ── 1. Personal Info ─────────────────────────────────── */
    setVal('name',      info.name);
    setVal('jobTitle',  info.role  || info.jobTitle);
    setVal('email',     info.email);
    setVal('phone',     info.phone);
    setVal('location',  info.location);
    setVal('linkedin',  info.linkedin);
    setVal('github',    info.github);
    setVal('portfolio', info.portfolio);

    /* ── 2. Summary ──────────────────────────────────────── */
    setVal('summary', data.summary);
    const summEl = document.getElementById('summary');
    if (summEl && typeof countChars === 'function') countChars(summEl, 'summaryCount', 300);

    /* ── 3. Experience ───────────────────────────────────── */
    (data.experience || []).forEach(exp => {
      addExperience();
      const id = window.state?.expCounter;
      if (!id) return;
      setVal(`exp-title-${id}`,   exp.title    || exp.role || '');
      setVal(`exp-company-${id}`, exp.company  || '');
      setVal(`exp-loc-${id}`,     exp.location || info.location || '');
      setVal(`exp-start-${id}`,   exp.start    || '');
      setVal(`exp-end-${id}`,     exp.end      || 'Present');
      const bullets  = exp.bullets || [];
      const descText = bullets.length
        ? bullets.map(b => '• ' + b).join('\n')
        : (exp.description || exp.desc || '');
      setVal(`exp-desc-${id}`, descText);
      if (typeof updExpLbl === 'function') updExpLbl(id);
    });

    /* ── 4. Education ────────────────────────────────────── */
    (data.education || []).forEach(edu => {
      addEducation();
      const id = window.state?.eduCounter;
      if (!id) return;
      setVal(`edu-degree-${id}`, edu.degree  || edu.qualification || '');
      setVal(`edu-school-${id}`, edu.college || edu.school || edu.institution || '');
      setVal(`edu-field-${id}`,  edu.field   || '');
      setVal(`edu-year-${id}`,   edu.year    || edu.endYear || '');
      setVal(`edu-gpa-${id}`,    edu.cgpa    || edu.gpa || '');
      if (typeof updEduLbl === 'function') updEduLbl(id);
    });

    /* ── 5. Skills — async staggered injection ───────────── */
    // Skills MUST be injected one-by-one with a small delay between each
    // because addSkill() reads skillInput.value synchronously, and rapid
    // back-to-back calls cause the DOM list to not update in time.
    const skillInput = document.getElementById('skillInput');
    const skillLevel = document.getElementById('skillLevel');

    // Build the full skill list — prefer skillsWithLevels if present
    let skillList = [];
    if (data.skillsWithLevels && data.skillsWithLevels.length) {
      skillList = data.skillsWithLevels.map(s =>
        typeof s === 'object' ? s : { name: String(s), level: 'Intermediate' }
      );
    } else if (data.skills && data.skills.length) {
      skillList = data.skills.map((s, i) => ({
        name:  typeof s === 'object' ? (s.name || String(s)) : String(s),
        level: i < 3 ? 'Expert' : i < 7 ? 'Advanced' : 'Intermediate',
      }));
    }

    function addSkillAt(index) {
      if (index >= skillList.length) {
        // All skills added — now do the final refresh
        finalRefresh();
        return;
      }
      const sk = skillList[index];
      if (!skillInput) { addSkillAt(index + 1); return; }

      skillInput.value = sk.name.trim();
      skillInput.dispatchEvent(new Event('input', { bubbles: true }));

      if (skillLevel) {
        const lvl = (sk.level || 'Intermediate');
        // Try to set the select value
        skillLevel.value = lvl;
        if (skillLevel.value !== lvl) {
          // Some builders use different casing — try matching
          for (const opt of skillLevel.options) {
            if (opt.value.toLowerCase() === lvl.toLowerCase()) {
              skillLevel.value = opt.value; break;
            }
          }
        }
        skillLevel.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (typeof addSkill === 'function') addSkill();

      // Also fire Enter keypress — some builders listen for it
      skillInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', keyCode: 13, bubbles: true }));
      skillInput.dispatchEvent(new KeyboardEvent('keydown',  { key: 'Enter', keyCode: 13, bubbles: true }));

      // 80ms gap between skills so DOM list updates properly
      setTimeout(() => addSkillAt(index + 1), 80);
    }

    /* ── 6. Projects ─────────────────────────────────────── */
    function loadProjects() {
      (data.projects || []).forEach(proj => {
        if (typeof addProject !== 'function') return;
        addProject();
        const id = window.state?.projCounter;
        if (!id) return;
        setVal(`proj-name-${id}`, proj.name  || proj.title || '');
        setVal(`proj-tech-${id}`, proj.tech  || proj.stack || proj.technologies || '');
        setVal(`proj-link-${id}`, proj.link  || proj.url   || '');
        setVal(`proj-desc-${id}`, proj.description || proj.desc || '');
        if (typeof updProjLbl === 'function') updProjLbl(id);
      });
    }

    /* ── 7. Extras ───────────────────────────────────────── */
    function loadExtras() {
      const ex = data.extras || {};
      setVal('languages',      ex.languages      || '');
      setVal('certifications', ex.certifications || '');
      setVal('achievements',   ex.achievements   || '');
      setVal('hobbies',        ex.hobbies        || '');
    }

    /* ── 8. Final refresh ────────────────────────────────── */
    function finalRefresh() {
      loadProjects();
      loadExtras();
      if (typeof updateResume   === 'function') updateResume();
      if (typeof updateProgress === 'function') updateProgress();

      // Clean storage
      localStorage.removeItem('readycv_ai_resume');
      localStorage.removeItem('readycv_ai_fulldata');

      // Switch to Personal tab
      const personalBtn = document.querySelector('.tab-btn[data-section="personal"]');
      if (personalBtn && typeof switchTab === 'function') switchTab(personalBtn, 'personal');

      // Toast
      if (typeof showToast === 'function') showToast('✅ AI resume loaded! Review all sections and download.');

      // Clean URL
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('fromAI');
        window.history.replaceState({}, '', url.toString());
      } catch(e) {}
    }

    // Start skill injection — then projects/extras happen inside finalRefresh
    if (skillList.length) {
      addSkillAt(0);   // async chain: skills → finalRefresh
    } else {
      finalRefresh();  // no skills, go straight to refresh
    }
  }

  // Kick off after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => tryLoad(30));
  } else {
    tryLoad(30);
  }

})();
