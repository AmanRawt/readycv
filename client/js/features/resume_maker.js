/* ============================================================
   ReadyCVs — resume_maker.js
   Live Preview · Dynamic Sections · Autosave · PDF Download
   ============================================================ */
'use strict';

/* ─── State ───────────────────────────────────────────────── */
const state = {
  expCounter:0, eduCounter:0, projCounter:0,
  experience:[], education:[], projects:[], skills:[],
};

/* ─── Tab Navigation ─────────────────────────────────────── */
const TAB_ORDER = ['personal','summary','experience','education','skills','projects','extras'];
let currentTabIdx = 0;

function switchTab(btn, sectionId){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.form-section').forEach(s=>s.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('sec-'+sectionId).classList.add('active');
  currentTabIdx = TAB_ORDER.indexOf(sectionId);
  const _sec=document.getElementById('sec-'+sectionId);
  if(_sec) _sec.scrollTop=0;
  updateProgress();
}
function nextTab(){ if(currentTabIdx<TAB_ORDER.length-1){currentTabIdx++;activateTab(currentTabIdx);} }
function prevTab(){ if(currentTabIdx>0){currentTabIdx--;activateTab(currentTabIdx);} }
function activateTab(idx){
  const id=TAB_ORDER[idx];
  const btn=document.querySelector(`.tab-btn[data-section="${id}"]`);
  if(btn){ switchTab(btn,id); btn.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}); }
}

/* ─── Progress ───────────────────────────────────────────── */
function updateProgress(){
  const ids=['name','jobTitle','email','phone','location','summary'];
  let filled=0;
  ids.forEach(id=>{ if((document.getElementById(id)?.value||'').trim()) filled++; });
  if(state.experience.length) filled+=2;
  if(state.education.length)  filled+=1;
  if(state.skills.length)     filled+=1;
  const pct=Math.min(100,Math.round((filled/(ids.length+4))*100));
  const fill=document.getElementById('progressFill');
  const label=document.getElementById('progressLabel');
  if(fill)  fill.style.width=pct+'%';
  if(label) label.textContent=pct+'% complete';
}

/* ─── Char counter ───────────────────────────────────────── */
function countChars(el,counterId,max){
  const len=el.value.length;
  const c=document.getElementById(counterId);
  if(c){ c.textContent=len+'/'+max; c.style.color=len>max*.9?'#f87171':''; }
}

/* ─── Experience ─────────────────────────────────────────── */
function addExperience(){
  const id=++state.expCounter;
  state.experience.push({id});
  const list=document.getElementById('experienceList');
  const div=document.createElement('div');
  div.className='repeat-card'; div.id='exp-card-'+id;
  div.innerHTML=`
    <div class="repeat-card-header" onclick="toggleCard('exp-body-${id}','exp-chev-${id}')">
      <span id="exp-lbl-${id}">New Experience</span>
      <div class="rc-actions">
        <button class="rc-btn delete" onclick="event.stopPropagation();removeExp(${id})" title="Remove">
          <span class="material-symbols-outlined">delete</span></button>
        <button class="rc-btn"><span class="material-symbols-outlined" id="exp-chev-${id}">expand_less</span></button>
      </div>
    </div>
    <div class="repeat-card-body" id="exp-body-${id}">
      <div class="form-grid">
        <div class="field-group full"><label>Job Title *</label>
          <input type="text" id="exp-title-${id}" placeholder="e.g. Senior Developer"
            oninput="updExpLbl(${id});updateResume()"></div>
        <div class="field-group"><label>Company *</label>
          <input type="text" id="exp-company-${id}" placeholder="e.g. Google"
            oninput="updExpLbl(${id});updateResume()"></div>
        <div class="field-group"><label>Location</label>
          <input type="text" id="exp-loc-${id}" placeholder="Bangalore, India" oninput="updateResume()"></div>
        <div class="field-group"><label>Start Date</label>
          <input type="text" id="exp-start-${id}" placeholder="Jan 2022" oninput="updateResume()"></div>
        <div class="field-group"><label>End Date</label>
          <input type="text" id="exp-end-${id}" placeholder="Dec 2023 / Present" oninput="updateResume()"></div>
        <div class="field-group full"><label>Description / Achievements</label>
          <textarea id="exp-desc-${id}" rows="4"
            placeholder="• Led a team of 5 to deliver X on time&#10;• Increased performance by 30%"
            oninput="updateResume()"></textarea></div>
      </div>
    </div>`;
  list.appendChild(div);
  updateResume();
}
function updExpLbl(id){
  const t=v('exp-title-'+id), c=v('exp-company-'+id);
  const lbl=[t,c].filter(Boolean).join(' @ ')||'New Experience';
  setText('exp-lbl-'+id,lbl);
}
function removeExp(id){
  state.experience=state.experience.filter(e=>e.id!==id);
  document.getElementById('exp-card-'+id)?.remove();
  updateResume();
}

/* ─── Education ──────────────────────────────────────────── */
function addEducation(){
  const id=++state.eduCounter;
  state.education.push({id});
  const list=document.getElementById('educationList');
  const div=document.createElement('div');
  div.className='repeat-card'; div.id='edu-card-'+id;
  div.innerHTML=`
    <div class="repeat-card-header" onclick="toggleCard('edu-body-${id}','edu-chev-${id}')">
      <span id="edu-lbl-${id}">New Education</span>
      <div class="rc-actions">
        <button class="rc-btn delete" onclick="event.stopPropagation();removeEdu(${id})" title="Remove">
          <span class="material-symbols-outlined">delete</span></button>
        <button class="rc-btn"><span class="material-symbols-outlined" id="edu-chev-${id}">expand_less</span></button>
      </div>
    </div>
    <div class="repeat-card-body" id="edu-body-${id}">
      <div class="form-grid">
        <div class="field-group full"><label>Degree / Qualification *</label>
          <input type="text" id="edu-degree-${id}" placeholder="e.g. B.Tech Computer Science"
            oninput="updEduLbl(${id});updateResume()"></div>
        <div class="field-group"><label>Institution *</label>
          <input type="text" id="edu-inst-${id}" placeholder="e.g. IIT Delhi"
            oninput="updEduLbl(${id});updateResume()"></div>
        <div class="field-group"><label>Location</label>
          <input type="text" id="edu-loc-${id}" placeholder="Delhi, India" oninput="updateResume()"></div>
        <div class="field-group"><label>Start Year</label>
          <input type="text" id="edu-start-${id}" placeholder="2018" oninput="updateResume()"></div>
        <div class="field-group"><label>End Year</label>
          <input type="text" id="edu-end-${id}" placeholder="2022" oninput="updateResume()"></div>
        <div class="field-group"><label>CGPA / Percentage</label>
          <input type="text" id="edu-grade-${id}" placeholder="8.5 CGPA / 85%" oninput="updateResume()"></div>
      </div>
    </div>`;
  list.appendChild(div);
  updateResume();
}
function updEduLbl(id){
  const d=v('edu-degree-'+id), i=v('edu-inst-'+id);
  setText('edu-lbl-'+id,[d,i].filter(Boolean).join(' — ')||'New Education');
}
function removeEdu(id){
  state.education=state.education.filter(e=>e.id!==id);
  document.getElementById('edu-card-'+id)?.remove();
  updateResume();
}

/* ─── Projects ───────────────────────────────────────────── */
function addProject(){
  const id=++state.projCounter;
  state.projects.push({id});
  const list=document.getElementById('projectsList');
  const div=document.createElement('div');
  div.className='repeat-card'; div.id='proj-card-'+id;
  div.innerHTML=`
    <div class="repeat-card-header" onclick="toggleCard('proj-body-${id}','proj-chev-${id}')">
      <span id="proj-lbl-${id}">New Project</span>
      <div class="rc-actions">
        <button class="rc-btn delete" onclick="event.stopPropagation();removeProj(${id})" title="Remove">
          <span class="material-symbols-outlined">delete</span></button>
        <button class="rc-btn"><span class="material-symbols-outlined" id="proj-chev-${id}">expand_less</span></button>
      </div>
    </div>
    <div class="repeat-card-body" id="proj-body-${id}">
      <div class="form-grid">
        <div class="field-group full"><label>Project Name *</label>
          <input type="text" id="proj-name-${id}" placeholder="e.g. AI Resume Builder"
            oninput="updProjLbl(${id});updateResume()"></div>
        <div class="field-group"><label>Tech Stack</label>
          <input type="text" id="proj-tech-${id}" placeholder="React, Node.js, MongoDB" oninput="updateResume()"></div>
        <div class="field-group"><label>Project Link</label>
          <input type="url" id="proj-link-${id}" placeholder="github.com/you/project" oninput="updateResume()"></div>
        <div class="field-group full"><label>Description</label>
          <textarea id="proj-desc-${id}" rows="3"
            placeholder="Briefly describe what you built and your role." oninput="updateResume()"></textarea></div>
      </div>
    </div>`;
  list.appendChild(div);
  updateResume();
}
function updProjLbl(id){
  setText('proj-lbl-'+id,v('proj-name-'+id)||'New Project');
}
function removeProj(id){
  state.projects=state.projects.filter(p=>p.id!==id);
  document.getElementById('proj-card-'+id)?.remove();
  updateResume();
}

/* ─── Skills ─────────────────────────────────────────────── */
function addSkill(){
  const input=document.getElementById('skillInput');
  const level=document.getElementById('skillLevel');
  const name=(input.value||'').trim();
  if(!name)return;
  state.skills.push({name,level:level.value});
  input.value='';
  renderSkillTags();
  updateResume();
}
function renderSkillTags(){
  const c=document.getElementById('skillsTags');
  if(!c)return;
  c.innerHTML='';
  state.skills.forEach((sk,i)=>{
    const span=document.createElement('span');
    span.className='skill-tag '+sk.level.toLowerCase();
    span.innerHTML=`${sk.name} <button class="skill-remove" onclick="removeSkill(${i})"><span class="material-symbols-outlined">close</span></button>`;
    c.appendChild(span);
  });
}
function removeSkill(idx){
  state.skills.splice(idx,1);
  renderSkillTags();
  updateResume();
}

/* ─── Toggle collapse ────────────────────────────────────── */
function toggleCard(bodyId,chevId){
  const body=document.getElementById(bodyId);
  const chev=document.getElementById(chevId);
  if(!body)return;
  const c=body.classList.toggle('collapsed');
  if(chev)chev.textContent=c?'expand_more':'expand_less';
}

/* ─── Collect all data → pass to template ────────────────── */
function collectData(){
  const g=id=>(document.getElementById(id)?.value||'').trim();

  // experience
  const exp=[];
  for(let i=1;i<=state.expCounter;i++){
    if(!document.getElementById('exp-card-'+i))continue;
    const title=g('exp-title-'+i), company=g('exp-company-'+i);
    if(!title&&!company)continue;
    exp.push({title,company,location:g('exp-loc-'+i),start:g('exp-start-'+i),end:g('exp-end-'+i),desc:g('exp-desc-'+i)});
  }

  // education
  const edu=[];
  for(let i=1;i<=state.eduCounter;i++){
    if(!document.getElementById('edu-card-'+i))continue;
    const degree=g('edu-degree-'+i), inst=g('edu-inst-'+i);
    if(!degree&&!inst)continue;
    edu.push({degree,inst,location:g('edu-loc-'+i),start:g('edu-start-'+i),end:g('edu-end-'+i),grade:g('edu-grade-'+i)});
  }

  // projects
  const proj=[];
  for(let i=1;i<=state.projCounter;i++){
    if(!document.getElementById('proj-card-'+i))continue;
    const name=g('proj-name-'+i);
    if(!name)continue;
    proj.push({name,tech:g('proj-tech-'+i),link:g('proj-link-'+i),desc:g('proj-desc-'+i)});
  }

  return{
    name:g('name'), jobTitle:g('jobTitle'), email:g('email'),
    phone:g('phone'), location:g('location'),
    linkedin:g('linkedin'), github:g('github'), portfolio:g('portfolio'),
    summary:g('summary'),
    experience:exp, education:edu,
    skills:state.skills,
    projects:proj,
    languages:g('languages'), certifications:g('certifications'),
    achievements:g('achievements'), hobbies:g('hobbies'),
  };
}

/* ─── updateResume ───────────────────────────────────────── */
function updateResume(){
  const doc=document.getElementById('resumeDoc');
  if(!doc)return;
  if(typeof window.renderTemplate!=='function')return;
  const data=collectData();
  doc.innerHTML=window.renderTemplate(data);
  updateProgress();
  if(typeof window._updateLiveAts==='function') window._updateLiveAts();
  if(typeof autoScaleResume==='function'&&window.innerWidth<=640) autoScaleResume();
}

/* ─── Zoom ───────────────────────────────────────────────── */
let zoomPct=75;
function applyZoom(){
  const w=document.getElementById('resumeWrapper');
  if(w)w.style.transform=`scale(${zoomPct/100})`;
  const z=document.getElementById('zoomLevel');
  if(z)z.textContent=zoomPct+'%';
}
function zoomIn(){  if(zoomPct<150){zoomPct+=10;applyZoom();} }
function zoomOut(){ if(zoomPct>40) {zoomPct-=10;applyZoom();} }

/* ─── Download PDF ───────────────────────────────────────── */
function downloadPDF(){
  const w=document.getElementById('resumeWrapper');
  const prev=w?w.style.transform:'';
  if(w)w.style.transform='scale(1)';
  showToast('Opening print dialog…');
  // ── INCREMENT RESUME COUNT ──────────────────────────────
  try{
    var c = parseInt(localStorage.getItem('readycv_resume_count')||'0', 10);
    localStorage.setItem('readycv_resume_count', c + 1);
  } catch(e){}
  // ───────────────────────────────────────────────────────
  setTimeout(()=>{
    window.print();
    if(w)w.style.transform=prev;
  },350);
}

/* ─── Toast ──────────────────────────────────────────────── */
function showToast(msg){
  const t=document.getElementById('toast');
  const m=document.getElementById('toastMsg');
  if(!t)return;
  if(m)m.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

/* ─── Reset ──────────────────────────────────────────────── */
function clearAll(){
  if(!confirm('Reset all fields? This cannot be undone.'))return;
  document.querySelectorAll('.form-section input,.form-section textarea').forEach(el=>{el.value='';});
  state.experience=[]; state.expCounter=0;
  state.education=[];  state.eduCounter=0;
  state.projects=[];   state.projCounter=0;
  state.skills=[];
  ['experienceList','educationList','projectsList','skillsTags'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.innerHTML='';
  });
  try{localStorage.removeItem('readycv_draft');}catch(e){}
  updateResume();
  showToast('All fields cleared.');
}

/* ─── Autosave ───────────────────────────────────────────── */
function autoSave(){
  const data={};
  document.querySelectorAll('input[id],textarea[id]').forEach(el=>{
    if(el.id&&!el.id.startsWith('exp-')&&!el.id.startsWith('edu-')&&!el.id.startsWith('proj-'))
      data[el.id]=el.value;
  });
  data._skills=JSON.stringify(state.skills);
  try{localStorage.setItem('readycv_draft',JSON.stringify(data));}catch(e){}
}

/* ── Shared helper: fill all resume fields from a data object ── */
function _fillResumeData(d) {
  // Handle AI data format — unwrap personalInfo if present
  const info = d.personalInfo || d;

  // Simple text fields — map both flat and nested AI format
  const setF = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) { el.value = String(val); el.dispatchEvent(new Event('input',{bubbles:true})); }
  };
  setF('name',      info.name);
  setF('jobTitle',  info.role || info.jobTitle);
  setF('email',     info.email);
  setF('phone',     info.phone);
  setF('location',  info.location);
  setF('linkedin',  info.linkedin);
  setF('github',    info.github);
  setF('portfolio', info.portfolio);
  setF('summary',   d.summary);

  // Extras
  const ex = d.extras || {};
  setF('languages',      ex.languages      || d.languages);
  setF('certifications', ex.certifications || d.certifications);
  setF('achievements',   ex.achievements   || d.achievements);
  setF('hobbies',        ex.hobbies        || d.hobbies);

  // Experience
  const expArr = d.experience || [];
  expArr.forEach(exp => {
    addExperience();
    const id = state.expCounter;
    setF('exp-title-'+id,   exp.title   || exp.role || '');
    setF('exp-company-'+id, exp.company || '');
    setF('exp-loc-'+id,     exp.location || info.location || '');
    setF('exp-start-'+id,   exp.start   || '');
    setF('exp-end-'+id,     exp.end     || 'Present');
    const bullets = exp.bullets || [];
    const descText = bullets.length
      ? bullets.map(b => '• ' + b).join('\n')
      : (exp.desc || exp.description || '');
    setF('exp-desc-'+id, descText);
    updExpLbl(id);
  });

  // Education
  const eduArr = d.education || [];
  eduArr.forEach(edu => {
    addEducation();
    const id = state.eduCounter;
    setF('edu-degree-'+id, edu.degree || edu.qualification || '');
    setF('edu-inst-'+id,   edu.college || edu.school || edu.institution || edu.inst || '');
    setF('edu-end-'+id,    edu.year   || edu.endYear || edu.end || '');
    setF('edu-grade-'+id,  edu.cgpa   || edu.gpa    || edu.grade || '');
    updEduLbl(id);
  });

  // Projects
  const projArr = d.projects || [];
  projArr.forEach(proj => {
    addProject();
    const id = state.projCounter;
    setF('proj-name-'+id, proj.name  || proj.title || '');
    setF('proj-tech-'+id, proj.tech  || proj.stack || '');
    setF('proj-link-'+id, proj.link  || proj.url   || '');
    setF('proj-desc-'+id, proj.description || proj.desc || '');
    updProjLbl(id);
  });

  // Skills — handle both array-of-strings and array-of-{name,level}
  const skillsRaw = d.skillsWithLevels || d.skills || [];
  if (skillsRaw.length) {
    state.skills = skillsRaw.map((s, i) => {
      if (typeof s === 'object' && s.name) return { name: s.name, level: s.level || 'Intermediate' };
      return { name: String(s), level: i < 3 ? 'Expert' : i < 7 ? 'Advanced' : 'Intermediate' };
    });
    renderSkillTags();
  }

  updateResume();
  const s = document.getElementById('summary');
  if (s) countChars(s, 'summaryCount', 300);
}

function loadSaved(){
  try{
    const urlParams2 = new URLSearchParams(window.location.search);
    const fromSample = urlParams2.get('fromsample');

    /* ── Load from ATS Checker ── */
    if (urlParams2.get('from') === 'ats') {
      const atsRaw = sessionStorage.getItem('readycv_ats_resume');
      if (atsRaw) {
        sessionStorage.removeItem('readycv_ats_resume');
        const d = JSON.parse(atsRaw);
        _fillResumeData(d);
        showToast('📄 Your resume is loaded! Review and edit freely.');
        return;
      }
    }

    // Load AI-generated full resume if coming from AI writer
    const aiData = localStorage.getItem('readycv_ai_fulldata');
    if (aiData) {
      const d = JSON.parse(aiData);
      localStorage.removeItem('readycv_ai_fulldata');
      _fillResumeData(d);
      showToast('✨ AI resume loaded! Review and download.');
      return;
    }
    const raw=localStorage.getItem('readycv_draft');
    if(!raw)return;
    const data=JSON.parse(raw);
    Object.entries(data).forEach(([key,val])=>{
      if(key==='_skills')return;
      const el=document.getElementById(key);
      if(el&&el.tagName!=='BUTTON')el.value=val;
    });
    if(data._skills){
      state.skills=JSON.parse(data._skills);
      renderSkillTags();
    }
    if(data.activeTemplate&&window.activeTemplate!==undefined){
      window.activeTemplate=data.activeTemplate;
      const badge=document.getElementById('activeTplBadge');
      const tpl=(window.TEMPLATES||[]).find(t=>t.id===data.activeTemplate);
      if(badge&&tpl)badge.textContent=tpl.name;
    }
    updateResume();
    const s=document.getElementById('summary');
    if(s)countChars(s,'summaryCount',300);
    showToast('Draft restored 💾');
  }catch(e){}
}

/* ─── Helpers ────────────────────────────────────────────── */
function v(id){return(document.getElementById(id)?.value||'').trim();}
function setText(id,txt){const el=document.getElementById(id);if(el)el.textContent=txt;}

/* ─── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  applyZoom();

  // Pick template from URL ?tpl=xxx
  const urlTpl = new URLSearchParams(window.location.search).get('tpl');
  if(urlTpl && window.TEMPLATES){
    const match = window.TEMPLATES.find(t=>t.id===urlTpl);
    if(match){
      window.activeTemplate = urlTpl;
      const badge = document.getElementById('activeTplBadge');
      if(badge) badge.textContent = match.name;
    }
  }

  // Small delay to let templates.js finish loading
  setTimeout(()=>{
    loadSaved();
    if(urlTpl){ window.activeTemplate = urlTpl; }
    updateResume();
  },100);

  // Autosave every 6s
  setInterval(()=>{
    autoSave();
    // also save active template
    try{
      const raw=localStorage.getItem('readycv_draft');
      const d=raw?JSON.parse(raw):{};
      d.activeTemplate=window.activeTemplate;
      localStorage.setItem('readycv_draft',JSON.stringify(d));
    }catch(e){}
  },6000);
});
