/* ============================================================
   ReadyCVs — resume_templates.js
   6 Professional Templates + Template Picker UI
   ============================================================ */
'use strict';

window.activeTemplate = 'nova';

/* ── shared escape helper ── */
function esc(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Convert textarea lines → HTML ── */
function descToHTML(txt,color){
  if(!txt)return'';
  const lines=txt.split('\n').map(l=>l.trim()).filter(Boolean);
  const isList=lines.every(l=>/^[•\-\*]/.test(l));
  if(isList) return`<ul style="padding-left:15px;margin:4px 0">${lines.map(l=>`<li style="margin-bottom:3px">${esc(l.replace(/^[•\-\*]\s*/,''))}</li>`).join('')}</ul>`;
  return lines.map(l=>`<p style="margin:0 0 3px">${esc(l)}</p>`).join('');
}
function multiLine(txt){
  if(!txt)return'';
  return txt.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>`<p style="margin:0 0 3px">${esc(l)}</p>`).join('');
}

/* ════════════════════════════════════════════════════════════
   TEMPLATE DEFINITIONS
════════════════════════════════════════════════════════════ */
window.TEMPLATES = [

  /* ── 1. NOVA ── dark gradient, purple-lime (ReadyCVs brand) */
  {
    id:'nova', name:'Nova', tag:'Modern',
    desc:'Dark gradient header with purple–lime accent. Bold & contemporary.',
    colors:['#1a0a3e','#a855f7','#a3e635'],
    thumb:`<svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="200" fill="#fff" rx="3"/>
      <defs>
        <linearGradient id="nhg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a0a3e"/><stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="nag" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#a3e635"/>
        </linearGradient>
      </defs>
      <rect width="160" height="52" fill="url(#nhg)" rx="3"/>
      <rect x="0" y="50" width="160" height="2.5" fill="url(#nag)"/>
      <text x="10" y="22" font-size="11" font-weight="bold" fill="#fff" font-family="serif">Your Name</text>
      <text x="10" y="33" font-size="6" fill="#a3e635" font-family="sans-serif" letter-spacing="1">JOB TITLE</text>
      <text x="10" y="43" font-size="5" fill="rgba(255,255,255,0.6)" font-family="sans-serif">email · phone · location</text>
      <!-- section -->
      <rect x="10" y="62" width="50" height="2" fill="#a855f7" rx="1"/>
      <text x="10" y="60" font-size="6" fill="#a855f7" font-weight="bold" font-family="sans-serif">SUMMARY</text>
      <rect x="10" y="68" width="140" height="3" fill="#f0f0f8" rx="1"/>
      <rect x="10" y="74" width="110" height="3" fill="#f0f0f8" rx="1"/>
      <rect x="10" y="86" width="60" height="2" fill="#a855f7" rx="1"/>
      <text x="10" y="84" font-size="6" fill="#a855f7" font-weight="bold" font-family="sans-serif">EXPERIENCE</text>
      <rect x="10" y="92" width="140" height="3" fill="#f0f0f8" rx="1"/>
      <rect x="10" y="98" width="90" height="3" fill="#f0f0f8" rx="1"/>
      <rect x="10" y="108" width="70" height="2" fill="#a855f7" rx="1"/>
      <text x="10" y="106" font-size="6" fill="#a855f7" font-weight="bold" font-family="sans-serif">SKILLS</text>
      <rect x="10" y="113" width="32" height="8" fill="rgba(168,85,247,.12)" rx="4"/>
      <rect x="46" y="113" width="32" height="8" fill="rgba(163,230,53,.12)" rx="4"/>
      <rect x="82" y="113" width="28" height="8" fill="rgba(56,189,248,.12)" rx="4"/>
    </svg>`,
    render(d){ return buildNova(d); }
  },

  /* ── 2. SLATE ── navy sidebar, two-column corporate */
  {
    id:'slate', name:'Slate', tag:'Executive',
    desc:'Two-column navy sidebar layout. Classic corporate executive feel.',
    colors:['#1e3a5f','#3b82f6','#f8fafc'],
    thumb:`<svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="200" fill="#f8fafc" rx="3"/>
      <rect width="52" height="200" fill="#1e3a5f" rx="3"/>
      <text x="6" y="26" font-size="9" font-weight="bold" fill="#fff" font-family="sans-serif">Your</text>
      <text x="6" y="37" font-size="9" font-weight="bold" fill="#fff" font-family="sans-serif">Name</text>
      <text x="6" y="47" font-size="5" fill="#93c5fd" font-family="sans-serif">Job Title</text>
      <rect x="6" y="52" width="40" height="1" fill="rgba(255,255,255,.2)" rx="1"/>
      <text x="6" y="62" font-size="5" fill="rgba(255,255,255,.6)" font-family="sans-serif">CONTACT</text>
      <rect x="6" y="67" width="40" height="3" fill="rgba(255,255,255,.12)" rx="1"/>
      <rect x="6" y="73" width="34" height="3" fill="rgba(255,255,255,.12)" rx="1"/>
      <rect x="6" y="79" width="38" height="3" fill="rgba(255,255,255,.12)" rx="1"/>
      <text x="6" y="94" font-size="5" fill="rgba(255,255,255,.6)" font-family="sans-serif">SKILLS</text>
      <rect x="6" y="98" width="40" height="7" fill="rgba(255,255,255,.1)" rx="3"/>
      <rect x="6" y="108" width="40" height="7" fill="rgba(255,255,255,.1)" rx="3"/>
      <rect x="6" y="118" width="32" height="7" fill="rgba(255,255,255,.1)" rx="3"/>
      <text x="60" y="22" font-size="6" fill="#1e3a5f" font-weight="bold" font-family="sans-serif">EXPERIENCE</text>
      <rect x="60" y="24" width="92" height="1.5" fill="#3b82f6" rx="1"/>
      <rect x="60" y="30" width="92" height="3" fill="#e8f0f8" rx="1"/>
      <rect x="60" y="36" width="70" height="3" fill="#e8f0f8" rx="1"/>
      <rect x="60" y="44" width="92" height="3" fill="#e8f0f8" rx="1"/>
      <text x="60" y="58" font-size="6" fill="#1e3a5f" font-weight="bold" font-family="sans-serif">EDUCATION</text>
      <rect x="60" y="60" width="92" height="1.5" fill="#3b82f6" rx="1"/>
      <rect x="60" y="66" width="92" height="3" fill="#e8f0f8" rx="1"/>
      <rect x="60" y="72" width="55" height="3" fill="#e8f0f8" rx="1"/>
    </svg>`,
    render(d){ return buildSlate(d); }
  },

  /* ── 3. EMBER ── terracotta warm tones, serif heading */
  {
    id:'ember', name:'Ember', tag:'Creative',
    desc:'Warm terracotta & burnt orange with elegant serif typography.',
    colors:['#7c2d12','#ea580c','#fff7ed'],
    thumb:`<svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="200" fill="#fff7ed" rx="3"/>
      <rect x="0" y="0" width="7" height="200" fill="#ea580c"/>
      <text x="16" y="26" font-size="12" font-weight="bold" fill="#7c2d12" font-family="serif">Your Name</text>
      <text x="16" y="37" font-size="6" fill="#ea580c" font-family="sans-serif" font-weight="700" letter-spacing="1">DEVELOPER</text>
      <rect x="16" y="41" width="136" height="1" fill="#fed7aa"/>
      <text x="16" y="49" font-size="5" fill="#92400e" font-family="sans-serif">email@example.com  ·  +91 98765</text>
      <text x="16" y="63" font-size="6.5" font-weight="bold" fill="#7c2d12" font-family="serif">Summary</text>
      <rect x="16" y="66" width="136" height="1" fill="#fed7aa"/>
      <rect x="16" y="71" width="136" height="3" fill="#fde8ca" rx="1"/>
      <rect x="16" y="77" width="100" height="3" fill="#fde8ca" rx="1"/>
      <text x="16" y="90" font-size="6.5" font-weight="bold" fill="#7c2d12" font-family="serif">Experience</text>
      <rect x="16" y="93" width="136" height="1" fill="#fed7aa"/>
      <rect x="16" y="98" width="136" height="3" fill="#fde8ca" rx="1"/>
      <rect x="16" y="104" width="80" height="3" fill="#fde8ca" rx="1"/>
      <text x="16" y="118" font-size="6.5" font-weight="bold" fill="#7c2d12" font-family="serif">Skills</text>
      <rect x="16" y="121" width="136" height="1" fill="#fed7aa"/>
      <rect x="16" y="126" width="35" height="9" fill="#fed7aa" rx="4"/>
      <rect x="55" y="126" width="35" height="9" fill="#fed7aa" rx="4"/>
      <rect x="94" y="126" width="28" height="9" fill="#fed7aa" rx="4"/>
    </svg>`,
    render(d){ return buildEmber(d); }
  },

  /* ── 4. IVY ── minimal clean green, ATS-perfect */
  {
    id:'ivy', name:'Ivy', tag:'Minimal',
    desc:'Ultra-clean white with forest green accents. ATS-perfect minimalism.',
    colors:['#14532d','#16a34a','#ffffff'],
    thumb:`<svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="200" fill="#fff" rx="3"/>
      <rect x="0" y="0" width="160" height="4" fill="#16a34a"/>
      <text x="12" y="26" font-size="13" font-weight="bold" fill="#14532d" font-family="sans-serif">Your Name</text>
      <text x="12" y="37" font-size="6" fill="#16a34a" font-family="sans-serif" letter-spacing="2">FULL STACK DEV</text>
      <text x="12" y="46" font-size="5" fill="#6b7280" font-family="sans-serif">email · phone · location · linkedin</text>
      <rect x="12" y="50" width="136" height="1" fill="#e5e7eb"/>
      <text x="12" y="62" font-size="6" font-weight="bold" fill="#14532d" font-family="sans-serif">SUMMARY</text>
      <rect x="12" y="68" width="136" height="3" fill="#f3f4f6" rx="1"/>
      <rect x="12" y="74" width="100" height="3" fill="#f3f4f6" rx="1"/>
      <text x="12" y="87" font-size="6" font-weight="bold" fill="#14532d" font-family="sans-serif">EXPERIENCE</text>
      <rect x="12" y="90" width="136" height="1" fill="#e5e7eb"/>
      <rect x="12" y="96" width="136" height="3" fill="#f3f4f6" rx="1"/>
      <rect x="12" y="102" width="90" height="3" fill="#f3f4f6" rx="1"/>
      <rect x="12" y="108" width="110" height="3" fill="#f3f4f6" rx="1"/>
      <text x="12" y="121" font-size="6" font-weight="bold" fill="#14532d" font-family="sans-serif">SKILLS</text>
      <rect x="12" y="124" width="136" height="1" fill="#e5e7eb"/>
      <rect x="12" y="129" width="32" height="8" fill="#dcfce7" rx="3"/>
      <rect x="48" y="129" width="32" height="8" fill="#dcfce7" rx="3"/>
      <rect x="84" y="129" width="32" height="8" fill="#dcfce7" rx="3"/>
    </svg>`,
    render(d){ return buildIvy(d); }
  },

  /* ── 5. ONYX ── full black sidebar, gold accents */
  {
    id:'onyx', name:'Onyx', tag:'Bold',
    desc:'Black sidebar with gold accents. Powerful design for senior roles.',
    colors:['#000000','#d97706','#1f2937'],
    thumb:`<svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="200" fill="#f9fafb" rx="3"/>
      <rect width="58" height="200" fill="#111827" rx="3"/>
      <rect x="0" y="0" width="58" height="4" fill="#d97706"/>
      <text x="8" y="28" font-size="9" font-weight="bold" fill="#fff" font-family="sans-serif">Your</text>
      <text x="8" y="39" font-size="9" font-weight="bold" fill="#fff" font-family="sans-serif">Name</text>
      <text x="8" y="49" font-size="5" fill="#d97706" font-family="sans-serif">Job Title</text>
      <rect x="8" y="54" width="42" height="1" fill="#374151"/>
      <rect x="8" y="60" width="42" height="3" fill="#1f2937" rx="1"/>
      <rect x="8" y="66" width="36" height="3" fill="#1f2937" rx="1"/>
      <rect x="8" y="72" width="40" height="3" fill="#1f2937" rx="1"/>
      <rect x="8" y="82" width="42" height="1" fill="#374151"/>
      <rect x="8" y="88" width="42" height="8" fill="#1f2937" rx="2"/>
      <rect x="8" y="99" width="42" height="8" fill="#1f2937" rx="2"/>
      <rect x="8" y="110" width="42" height="8" fill="#1f2937" rx="2"/>
      <text x="66" y="20" font-size="6" font-weight="bold" fill="#111827" font-family="sans-serif">EXPERIENCE</text>
      <rect x="66" y="22" width="86" height="2" fill="#d97706"/>
      <rect x="66" y="29" width="86" height="3" fill="#e5e7eb" rx="1"/>
      <rect x="66" y="35" width="60" height="3" fill="#e5e7eb" rx="1"/>
      <rect x="66" y="41" width="76" height="3" fill="#e5e7eb" rx="1"/>
      <text x="66" y="55" font-size="6" font-weight="bold" fill="#111827" font-family="sans-serif">EDUCATION</text>
      <rect x="66" y="57" width="86" height="2" fill="#d97706"/>
      <rect x="66" y="63" width="86" height="3" fill="#e5e7eb" rx="1"/>
      <rect x="66" y="69" width="52" height="3" fill="#e5e7eb" rx="1"/>
    </svg>`,
    render(d){ return buildOnyx(d); }
  },

  /* ── 6. PRISM ── indigo + cyan tech-forward */
  {
    id:'prism', name:'Prism', tag:'Tech',
    desc:'Indigo + cyan palette. Modern tech-forward layout for devs & engineers.',
    colors:['#3730a3','#06b6d4','#f0f9ff'],
    thumb:`<svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="200" fill="#f0f9ff" rx="3"/>
      <defs>
        <linearGradient id="phg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3730a3"/><stop offset="100%" stop-color="#1d4ed8"/>
        </linearGradient>
        <linearGradient id="pag" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#3730a3"/><stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
      </defs>
      <rect width="160" height="52" fill="url(#phg)" rx="3"/>
      <text x="12" y="24" font-size="12" font-weight="bold" fill="#fff" font-family="sans-serif">Your Name</text>
      <text x="12" y="35" font-size="5.5" fill="#67e8f9" font-family="sans-serif" letter-spacing="1">FULL STACK DEVELOPER</text>
      <text x="12" y="46" font-size="4.5" fill="rgba(255,255,255,.65)" font-family="sans-serif">email · phone · github · linkedin</text>
      <rect x="12" y="60" width="136" height="1.5" fill="url(#pag)"/>
      <text x="12" y="72" font-size="6" font-weight="bold" fill="#3730a3" font-family="sans-serif">SUMMARY</text>
      <rect x="12" y="78" width="136" height="3" fill="#e0e7ff" rx="1"/>
      <rect x="12" y="84" width="100" height="3" fill="#e0e7ff" rx="1"/>
      <text x="12" y="97" font-size="6" font-weight="bold" fill="#3730a3" font-family="sans-serif">EXPERIENCE</text>
      <rect x="12" y="100" width="136" height="1.5" fill="url(#pag)"/>
      <rect x="12" y="106" width="136" height="3" fill="#e0e7ff" rx="1"/>
      <rect x="12" y="112" width="100" height="3" fill="#e0e7ff" rx="1"/>
      <text x="12" y="125" font-size="6" font-weight="bold" fill="#3730a3" font-family="sans-serif">SKILLS</text>
      <rect x="12" y="128" width="136" height="1.5" fill="url(#pag)"/>
      <rect x="12" y="134" width="34" height="9" fill="#e0e7ff" rx="4"/>
      <rect x="50" y="134" width="34" height="9" fill="#cffafe" rx="4"/>
      <rect x="88" y="134" width="34" height="9" fill="#e0e7ff" rx="4"/>
    </svg>`,
    render(d){ return buildPrism(d); }
  },
];

/* ════════════════════════════════════════════════════════════
   TEMPLATE PICKER UI
════════════════════════════════════════════════════════════ */
function buildTemplateGrid(){
  const grid=document.getElementById('tplGrid');
  if(!grid)return;
  grid.innerHTML='';
  window.TEMPLATES.forEach(tpl=>{
    const isActive=tpl.id===window.activeTemplate;
    const card=document.createElement('div');
    card.className='tpl-card'+(isActive?' active':'');
    card.id='tpl-card-'+tpl.id;
    card.addEventListener('click',e=>{ if(!e.target.closest('.tpl-select-btn')) selectTemplate(tpl.id); });
    card.innerHTML=`
      <div class="tpl-thumb">
        ${tpl.thumb}
        <div class="tpl-active-ribbon">✓ Active</div>
      </div>
      <div class="tpl-info">
        <div class="tpl-name-row">
          <span class="tpl-name">${tpl.name}</span>
          <span class="tpl-tag">${tpl.tag}</span>
        </div>
        <p class="tpl-desc">${tpl.desc}</p>
        <div class="tpl-swatches">
          ${tpl.colors.map(c=>`<span class="tpl-swatch" style="background:${c}"></span>`).join('')}
        </div>
        <button class="tpl-select-btn${isActive?' selected':''}" onclick="selectTemplate('${tpl.id}')">
          ${isActive?'✓ Active':'Use Template'}
        </button>
      </div>`;
    grid.appendChild(card);
  });
}

function openTemplates(){
  buildTemplateGrid();
  const ov=document.getElementById('tplOverlay');
  if(ov){ov.classList.add('open');document.body.style.overflow='hidden';const g=document.getElementById('tplGrid');if(g)g.scrollTop=0;}
}
function closeTemplates(){
  const ov=document.getElementById('tplOverlay');
  if(ov){ov.classList.remove('open');document.body.style.overflow='';}
}

// Close on backdrop click
document.addEventListener('DOMContentLoaded',()=>{
  const ov=document.getElementById('tplOverlay');
  if(ov) ov.addEventListener('click',e=>{ if(e.target===ov) closeTemplates(); });
});

function selectTemplate(id){
  window.activeTemplate=id;
  const tpl=window.TEMPLATES.find(t=>t.id===id);
  const badge=document.getElementById('activeTplBadge');
  if(badge&&tpl) badge.textContent=tpl.name;
  buildTemplateGrid();
  if(typeof updateResume==='function') updateResume();
  closeTemplates();
  if(typeof showToast==='function') showToast('Template: '+( tpl?tpl.name:id)+' ✨');
}

/* entry point called by resume_maker.js */
window.renderTemplate=function(d){
  const tpl=window.TEMPLATES.find(t=>t.id===window.activeTemplate);
  return tpl ? tpl.render(d) : window.TEMPLATES[0].render(d);
};

/* ════════════════════════════════════════════════════════════
   SHARED BUILDER HELPERS
════════════════════════════════════════════════════════════ */
function rItem(titleTxt,sub,date,descTxt,titleColor,accentColor){
  titleColor=titleColor||'#111827';
  return`<div style="margin-bottom:13px;">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap;">
      <span style="font-size:13px;font-weight:700;color:${titleColor}">${esc(titleTxt)}</span>
      ${date?`<span style="font-size:10px;color:#9ca3af;white-space:nowrap">${esc(date)}</span>`:''}
    </div>
    ${sub?`<div style="font-size:11.5px;color:${accentColor||'#6b7280'};font-weight:500;margin-top:2px">${esc(sub)}</div>`:''}
    ${descTxt?`<div style="font-size:11.5px;color:#374151;margin-top:5px;line-height:1.65">${descToHTML(descTxt)}</div>`:''}
  </div>`;
}

function chipRow(skills,bg,color,border){
  if(!skills.length)return'';
  return`<div style="display:flex;flex-wrap:wrap;gap:5px;">${
    skills.map(sk=>`<span style="font-size:10.5px;padding:2px 10px;border-radius:100px;
      background:${bg(sk.level)};color:${color(sk.level)};border:1px solid ${border(sk.level)};
      font-weight:600">${esc(sk.name)}</span>`).join('')
  }</div>`;
}

function secTitle(txt,color,borderImg){
  return`<h2 style="font-size:10px;font-weight:800;text-transform:uppercase;
    letter-spacing:1.5px;color:${color};padding-bottom:5px;margin-bottom:10px;
    border-bottom:2px solid;border-image:${borderImg} 1;">${txt}</h2>`;
}

function contactRow(icon,val){
  if(!val)return'';
  return`<span style="display:inline-flex;align-items:center;gap:4px;margin-right:14px;font-size:10.5px;">
    <span class="material-symbols-outlined" style="font-size:12px;">${icon}</span>${esc(val)}
  </span>`;
}

/* ════════════════════════════════════════════════════════════
   1. NOVA RENDERER
════════════════════════════════════════════════════════════ */
function buildNova(d){
  const novaChip=(lvl)=>{
    const m={Expert:['rgba(163,230,53,.12)','#3a7000','rgba(163,230,53,.4)'],
      Advanced:['rgba(56,189,248,.1)','#0369a1','rgba(56,189,248,.35)'],
      Intermediate:['rgba(168,85,247,.1)','#7c3aed','rgba(168,85,247,.3)'],
      Beginner:['#f3f4f6','#6b7280','#d1d5db']};
    return m[lvl]||m.Intermediate;
  };
  return`
  <div style="font-family:'Inter',sans-serif;color:#1e293b;background:#fff;min-height:100%">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a0a3e 0%,#0f172a 55%,#0d2e1a 100%);
      padding:28px 36px 22px;display:flex;justify-content:space-between;align-items:flex-start;
      gap:20px;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(168,85,247,.2),transparent 50%,rgba(163,230,53,.12))"></div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#a855f7,#a3e635)"></div>
      <div style="position:relative;z-index:1;">
        <div style="font-family:'DM Serif Display',serif;font-size:28px;font-weight:400;color:#fff;line-height:1.1;letter-spacing:-.5px">${esc(d.name||'Your Name')}</div>
        <div style="font-size:11px;font-weight:700;color:#a3e635;margin-top:6px;letter-spacing:1.5px;text-transform:uppercase">${esc(d.jobTitle||'Job Title')}</div>
      </div>
      <div style="position:relative;z-index:1;text-align:right;display:flex;flex-direction:column;gap:4px;">
        ${contactRow('mail',d.email)}
        ${contactRow('phone',d.phone)}
        ${contactRow('location_on',d.location)}
        ${contactRow('link',d.linkedin)}
        ${contactRow('code',d.github)}
        ${contactRow('language',d.portfolio)}
      </div>
    </div>
    <!-- Body -->
    <div style="padding:22px 36px 28px;">
      ${d.summary?`<div style="margin-bottom:18px;">
        ${secTitle('Professional Summary','#a855f7','linear-gradient(90deg,#a855f7,#a3e635)')}
        <p style="font-size:12.5px;line-height:1.7;color:#374151">${esc(d.summary)}</p>
      </div>`:''}
      ${d.experience.length?`<div style="margin-bottom:18px;">
        ${secTitle('Work Experience','#a855f7','linear-gradient(90deg,#a855f7,#a3e635)')}
        ${d.experience.map(e=>rItem(e.title,`${e.company}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),e.desc)).join('')}
      </div>`:''}
      ${d.education.length?`<div style="margin-bottom:18px;">
        ${secTitle('Education','#a855f7','linear-gradient(90deg,#a855f7,#a3e635)')}
        ${d.education.map(e=>rItem(e.degree,`${e.inst}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),'')+(e.grade?`<div style="font-size:11px;color:#a855f7;margin-top:-10px;margin-bottom:10px">${esc(e.grade)}</div>`:'')).join('')}
      </div>`:''}
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:22px;">
        <div>
          ${d.skills.length?`<div style="margin-bottom:18px;">
            ${secTitle('Skills','#a855f7','linear-gradient(90deg,#a855f7,#a3e635)')}
            ${chipRow(d.skills,lvl=>novaChip(lvl)[0],lvl=>novaChip(lvl)[1],lvl=>novaChip(lvl)[2])}
          </div>`:''}
          ${d.projects.length?`<div style="margin-bottom:18px;">
            ${secTitle('Projects','#a855f7','linear-gradient(90deg,#a855f7,#a3e635)')}
            ${d.projects.map(p=>rItem(p.name,p.tech?'🛠 '+p.tech:'','',p.desc)).join('')}
          </div>`:''}
        </div>
        <div>
          ${d.languages?`<div style="margin-bottom:16px;">${secTitle('Languages','#a855f7','linear-gradient(90deg,#a855f7,#a3e635)')}<p style="font-size:12px;color:#374151;line-height:1.65">${esc(d.languages)}</p></div>`:''}
          ${d.certifications?`<div style="margin-bottom:16px;">${secTitle('Certifications','#a855f7','linear-gradient(90deg,#a855f7,#a3e635)')}${multiLine(d.certifications)}</div>`:''}
          ${d.achievements?`<div style="margin-bottom:16px;">${secTitle('Achievements','#a855f7','linear-gradient(90deg,#a855f7,#a3e635)')}${multiLine(d.achievements)}</div>`:''}
          ${d.hobbies?`<div style="margin-bottom:16px;">${secTitle('Interests','#a855f7','linear-gradient(90deg,#a855f7,#a3e635)')}<p style="font-size:12px;color:#374151;line-height:1.65">${esc(d.hobbies)}</p></div>`:''}
        </div>
      </div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   2. SLATE RENDERER
════════════════════════════════════════════════════════════ */
function buildSlate(d){
  const ST=(txt)=>`<h3 style="font-size:10px;font-weight:800;color:#3b82f6;text-transform:uppercase;
    letter-spacing:1.5px;border-bottom:2px solid #3b82f6;padding-bottom:5px;margin-bottom:10px;">${txt}</h3>`;
  const STs=(txt)=>`<h3 style="font-size:9px;font-weight:800;color:rgba(255,255,255,.5);text-transform:uppercase;
    letter-spacing:1.5px;margin:0 0 8px;">${txt}</h3>`;
  return`
  <div style="font-family:'Inter',sans-serif;display:grid;grid-template-columns:190px 1fr;min-height:100%">
    <!-- Sidebar -->
    <div style="background:#1e3a5f;padding:24px 18px 28px;color:#fff;">
      <div style="font-size:22px;font-weight:900;line-height:1.15;margin-bottom:5px">${esc(d.name||'Your Name')}</div>
      <div style="font-size:11px;font-weight:600;color:#93c5fd;margin-bottom:16px;letter-spacing:.5px">${esc(d.jobTitle||'Job Title')}</div>
      <div style="border-top:1px solid rgba(255,255,255,.15);padding-top:14px;margin-bottom:16px;">
        ${STs('Contact')}
        ${d.email?`<div style="font-size:10.5px;color:rgba(255,255,255,.75);margin-bottom:5px;word-break:break-all">${esc(d.email)}</div>`:''}
        ${d.phone?`<div style="font-size:10.5px;color:rgba(255,255,255,.75);margin-bottom:5px">${esc(d.phone)}</div>`:''}
        ${d.location?`<div style="font-size:10.5px;color:rgba(255,255,255,.75);margin-bottom:5px">${esc(d.location)}</div>`:''}
        ${d.linkedin?`<div style="font-size:10px;color:#93c5fd;margin-bottom:4px;word-break:break-all">${esc(d.linkedin)}</div>`:''}
        ${d.github?`<div style="font-size:10px;color:#93c5fd;margin-bottom:4px;word-break:break-all">${esc(d.github)}</div>`:''}
        ${d.portfolio?`<div style="font-size:10px;color:#93c5fd;margin-bottom:4px;word-break:break-all">${esc(d.portfolio)}</div>`:''}
      </div>
      ${d.skills.length?`<div style="border-top:1px solid rgba(255,255,255,.15);padding-top:14px;margin-bottom:16px;">
        ${STs('Skills')}
        ${d.skills.map(sk=>`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;">
          <span style="font-size:10.5px;color:rgba(255,255,255,.85)">${esc(sk.name)}</span>
          <span style="font-size:9px;padding:1px 6px;border-radius:100px;background:rgba(59,130,246,.3);color:#93c5fd">${esc(sk.level)}</span>
        </div>`).join('')}
      </div>`:''}
      ${d.languages?`<div style="border-top:1px solid rgba(255,255,255,.15);padding-top:14px;">
        ${STs('Languages')}
        <p style="font-size:10.5px;color:rgba(255,255,255,.75);line-height:1.65">${esc(d.languages)}</p>
      </div>`:''}
    </div>
    <!-- Main -->
    <div style="padding:24px 28px 28px;background:#fff;">
      ${d.summary?`<div style="margin-bottom:18px;">${ST('Summary')}<p style="font-size:12.5px;line-height:1.7;color:#374151">${esc(d.summary)}</p></div>`:''}
      ${d.experience.length?`<div style="margin-bottom:18px;">${ST('Work Experience')}${d.experience.map(e=>rItem(e.title,`${e.company}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),e.desc,'#1e3a5f','#3b82f6')).join('')}</div>`:''}
      ${d.education.length?`<div style="margin-bottom:18px;">${ST('Education')}${d.education.map(e=>rItem(e.degree,`${e.inst}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),'','#1e3a5f','#3b82f6')+(e.grade?`<div style="font-size:11px;color:#3b82f6;margin-top:-8px;margin-bottom:10px">${esc(e.grade)}</div>`:'')).join('')}</div>`:''}
      ${d.projects.length?`<div style="margin-bottom:18px;">${ST('Projects')}${d.projects.map(p=>rItem(p.name,p.tech?'🛠 '+p.tech:'','',p.desc,'#1e3a5f','#3b82f6')).join('')}</div>`:''}
      ${d.certifications?`<div style="margin-bottom:16px;">${ST('Certifications')}${multiLine(d.certifications)}</div>`:''}
      ${d.achievements?`<div style="margin-bottom:16px;">${ST('Achievements')}${multiLine(d.achievements)}</div>`:''}
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   3. EMBER RENDERER
════════════════════════════════════════════════════════════ */
function buildEmber(d){
  const ST=(txt)=>`<h2 style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;
    color:#7c2d12;border-bottom:1.5px solid #fed7aa;padding-bottom:5px;margin-bottom:10px;">${txt}</h2>`;
  const chipE=(sk)=>`<span style="font-size:10.5px;padding:3px 11px;border-radius:100px;
    background:#fed7aa;color:#7c2d12;border:1px solid #fdba74;font-weight:600;margin:0 4px 5px 0;display:inline-block">${esc(sk.name)}</span>`;
  return`
  <div style="font-family:'Lato',sans-serif;background:#fff7ed;min-height:100%;position:relative">
    <!-- accent bar -->
    <div style="position:absolute;left:0;top:0;bottom:0;width:7px;background:linear-gradient(to bottom,#ea580c,#fed7aa)"></div>
    <div style="margin-left:7px;padding:28px 32px 28px 28px;">
      <!-- Header -->
      <div style="margin-bottom:18px;padding-bottom:14px;border-bottom:1.5px solid #fed7aa;">
        <div style="font-family:'Playfair Display',serif;font-size:30px;font-weight:900;color:#7c2d12;line-height:1.1">${esc(d.name||'Your Name')}</div>
        <div style="font-size:12px;font-weight:700;color:#ea580c;margin-top:5px;letter-spacing:1.5px;text-transform:uppercase">${esc(d.jobTitle||'Job Title')}</div>
        <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:0;">
          ${contactRow('mail',d.email)}${contactRow('phone',d.phone)}${contactRow('location_on',d.location)}${contactRow('link',d.linkedin)}${contactRow('code',d.github)}
        </div>
      </div>
      ${d.summary?`<div style="margin-bottom:18px;">${ST('Professional Summary')}<p style="font-size:12.5px;line-height:1.75;color:#431407">${esc(d.summary)}</p></div>`:''}
      ${d.experience.length?`<div style="margin-bottom:18px;">${ST('Work Experience')}${d.experience.map(e=>rItem(e.title,`${e.company}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),e.desc,'#7c2d12','#ea580c')).join('')}</div>`:''}
      ${d.education.length?`<div style="margin-bottom:18px;">${ST('Education')}${d.education.map(e=>rItem(e.degree,`${e.inst}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),'','#7c2d12','#ea580c')+(e.grade?`<div style="font-size:11px;color:#ea580c;margin-top:-8px;margin-bottom:10px">${esc(e.grade)}</div>`:'')).join('')}</div>`:''}
      <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:22px;">
        <div>
          ${d.skills.length?`<div style="margin-bottom:16px;">${ST('Skills')}<div style="display:flex;flex-wrap:wrap;margin-top:4px">${d.skills.map(sk=>chipE(sk)).join('')}</div></div>`:''}
          ${d.projects.length?`<div>${ST('Projects')}${d.projects.map(p=>rItem(p.name,p.tech?'🛠 '+p.tech:'','',p.desc,'#7c2d12','#ea580c')).join('')}</div>`:''}
        </div>
        <div>
          ${d.languages?`<div style="margin-bottom:14px;">${ST('Languages')}<p style="font-size:12px;color:#431407;line-height:1.65">${esc(d.languages)}</p></div>`:''}
          ${d.certifications?`<div style="margin-bottom:14px;">${ST('Certifications')}${multiLine(d.certifications)}</div>`:''}
          ${d.achievements?`<div style="margin-bottom:14px;">${ST('Achievements')}${multiLine(d.achievements)}</div>`:''}
          ${d.hobbies?`<div>${ST('Interests')}<p style="font-size:12px;color:#431407;line-height:1.65">${esc(d.hobbies)}</p></div>`:''}
        </div>
      </div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   4. IVY RENDERER
════════════════════════════════════════════════════════════ */
function buildIvy(d){
  const ST=(txt)=>`<h2 style="font-size:10px;font-weight:800;color:#14532d;text-transform:uppercase;
    letter-spacing:2px;border-bottom:1.5px solid #bbf7d0;padding-bottom:5px;margin-bottom:10px;">${txt}</h2>`;
  const chipI=(sk)=>`<span style="font-size:10.5px;padding:2px 10px;border-radius:4px;
    background:#dcfce7;color:#14532d;border:1px solid #bbf7d0;font-weight:600;margin:0 4px 5px 0;display:inline-block">${esc(sk.name)}</span>`;
  return`
  <div style="font-family:'Inter',sans-serif;background:#fff;min-height:100%;">
    <div style="height:4px;background:linear-gradient(90deg,#14532d,#16a34a,#4ade80)"></div>
    <div style="padding:28px 40px 32px;">
      <!-- Header -->
      <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #e5e7eb;">
        <div style="font-size:30px;font-weight:900;color:#14532d;letter-spacing:-.5px;line-height:1.1">${esc(d.name||'Your Name')}</div>
        <div style="font-size:11px;font-weight:700;color:#16a34a;margin-top:5px;letter-spacing:2px;text-transform:uppercase">${esc(d.jobTitle||'Job Title')}</div>
        <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:0;color:#6b7280">
          ${contactRow('mail',d.email)}${contactRow('phone',d.phone)}${contactRow('location_on',d.location)}${contactRow('link',d.linkedin)}${contactRow('code',d.github)}${contactRow('language',d.portfolio)}
        </div>
      </div>
      ${d.summary?`<div style="margin-bottom:18px;">${ST('Summary')}<p style="font-size:12.5px;line-height:1.75;color:#374151">${esc(d.summary)}</p></div>`:''}
      ${d.experience.length?`<div style="margin-bottom:18px;">${ST('Experience')}${d.experience.map(e=>rItem(e.title,`${e.company}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),e.desc,'#14532d','#16a34a')).join('')}</div>`:''}
      ${d.education.length?`<div style="margin-bottom:18px;">${ST('Education')}${d.education.map(e=>rItem(e.degree,`${e.inst}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),'','#14532d','#16a34a')+(e.grade?`<div style="font-size:11px;color:#16a34a;margin-top:-8px;margin-bottom:10px">${esc(e.grade)}</div>`:'')).join('')}</div>`:''}
      ${d.skills.length?`<div style="margin-bottom:18px;">${ST('Skills')}<div style="display:flex;flex-wrap:wrap;margin-top:4px">${d.skills.map(sk=>chipI(sk)).join('')}</div></div>`:''}
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:22px;">
        <div>
          ${d.projects.length?`<div>${ST('Projects')}${d.projects.map(p=>rItem(p.name,p.tech?'🛠 '+p.tech:'','',p.desc,'#14532d','#16a34a')).join('')}</div>`:''}
        </div>
        <div>
          ${d.languages?`<div style="margin-bottom:14px;">${ST('Languages')}<p style="font-size:12px;color:#374151;line-height:1.65">${esc(d.languages)}</p></div>`:''}
          ${d.certifications?`<div style="margin-bottom:14px;">${ST('Certifications')}${multiLine(d.certifications)}</div>`:''}
          ${d.achievements?`<div style="margin-bottom:14px;">${ST('Achievements')}${multiLine(d.achievements)}</div>`:''}
          ${d.hobbies?`<div>${ST('Interests')}<p style="font-size:12px;color:#374151;line-height:1.65">${esc(d.hobbies)}</p></div>`:''}
        </div>
      </div>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   5. ONYX RENDERER
════════════════════════════════════════════════════════════ */
function buildOnyx(d){
  const ST=(txt)=>`<h2 style="font-size:10px;font-weight:800;color:#111827;text-transform:uppercase;
    letter-spacing:1.5px;border-bottom:2.5px solid #d97706;padding-bottom:5px;margin-bottom:10px;">${txt}</h2>`;
  const STs=(txt)=>`<h3 style="font-size:9px;font-weight:800;color:rgba(255,255,255,.5);text-transform:uppercase;
    letter-spacing:1.5px;margin:0 0 8px;border-bottom:1px solid rgba(217,119,6,.35);padding-bottom:4px;">${txt}</h3>`;
  const chipO=(sk)=>`<span style="font-size:10px;padding:2px 8px;border-radius:3px;
    background:#1f2937;color:#d97706;font-weight:600;margin:0 4px 5px 0;display:inline-block;border:1px solid #374151">${esc(sk.name)}</span>`;
  return`
  <div style="font-family:'Inter',sans-serif;display:grid;grid-template-columns:200px 1fr;min-height:100%">
    <!-- Dark Sidebar -->
    <div style="background:#111827;padding:24px 16px 28px;color:#fff;">
      <div style="width:40px;height:3px;background:#d97706;margin-bottom:14px;border-radius:2px"></div>
      <div style="font-size:22px;font-weight:900;line-height:1.15;margin-bottom:5px;letter-spacing:-.3px">${esc(d.name||'Your Name')}</div>
      <div style="font-size:10.5px;font-weight:700;color:#d97706;margin-bottom:16px;letter-spacing:1px;text-transform:uppercase">${esc(d.jobTitle||'Job Title')}</div>
      <div style="border-top:1px solid #374151;padding-top:14px;margin-bottom:16px;">
        ${STs('Contact')}
        ${d.email?`<div style="font-size:10px;color:rgba(255,255,255,.7);margin-bottom:5px;word-break:break-all">${esc(d.email)}</div>`:''}
        ${d.phone?`<div style="font-size:10px;color:rgba(255,255,255,.7);margin-bottom:5px">${esc(d.phone)}</div>`:''}
        ${d.location?`<div style="font-size:10px;color:rgba(255,255,255,.7);margin-bottom:5px">${esc(d.location)}</div>`:''}
        ${d.linkedin?`<div style="font-size:9.5px;color:#d97706;margin-bottom:4px;word-break:break-all">${esc(d.linkedin)}</div>`:''}
        ${d.github?`<div style="font-size:9.5px;color:#d97706;margin-bottom:4px;word-break:break-all">${esc(d.github)}</div>`:''}
      </div>
      ${d.skills.length?`<div style="border-top:1px solid #374151;padding-top:14px;margin-bottom:16px;">
        ${STs('Skills')}<div style="display:flex;flex-wrap:wrap">${d.skills.map(sk=>chipO(sk)).join('')}</div>
      </div>`:''}
      ${d.languages?`<div style="border-top:1px solid #374151;padding-top:14px;">
        ${STs('Languages')}<p style="font-size:10px;color:rgba(255,255,255,.7);line-height:1.65">${esc(d.languages)}</p>
      </div>`:''}
    </div>
    <!-- Main content -->
    <div style="padding:24px 28px 28px;background:#f9fafb;">
      ${d.summary?`<div style="margin-bottom:18px;">${ST('Summary')}<p style="font-size:12.5px;line-height:1.7;color:#374151">${esc(d.summary)}</p></div>`:''}
      ${d.experience.length?`<div style="margin-bottom:18px;">${ST('Work Experience')}${d.experience.map(e=>rItem(e.title,`${e.company}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),e.desc,'#111827','#d97706')).join('')}</div>`:''}
      ${d.education.length?`<div style="margin-bottom:18px;">${ST('Education')}${d.education.map(e=>rItem(e.degree,`${e.inst}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),'','#111827','#d97706')+(e.grade?`<div style="font-size:11px;color:#d97706;margin-top:-8px;margin-bottom:10px">${esc(e.grade)}</div>`:'')).join('')}</div>`:''}
      ${d.projects.length?`<div style="margin-bottom:18px;">${ST('Projects')}${d.projects.map(p=>rItem(p.name,p.tech?'🛠 '+p.tech:'','',p.desc,'#111827','#d97706')).join('')}</div>`:''}
      ${d.certifications?`<div style="margin-bottom:16px;">${ST('Certifications')}${multiLine(d.certifications)}</div>`:''}
      ${d.achievements?`<div style="margin-bottom:16px;">${ST('Achievements')}${multiLine(d.achievements)}</div>`:''}
      ${d.hobbies?`<div>${ST('Interests')}<p style="font-size:12px;color:#374151;line-height:1.65">${esc(d.hobbies)}</p></div>`:''}
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════
   6. PRISM RENDERER
════════════════════════════════════════════════════════════ */
function buildPrism(d){
  const ST=(txt)=>`<h2 style="font-size:10px;font-weight:800;color:#3730a3;text-transform:uppercase;
    letter-spacing:1.5px;padding-bottom:5px;margin-bottom:10px;
    border-bottom:2px solid;border-image:linear-gradient(90deg,#3730a3,#06b6d4) 1;">${txt}</h2>`;
  const chipP=(sk)=>{
    const cols={Expert:['#cffafe','#0e7490','#a5f3fc'],Advanced:['#e0e7ff','#3730a3','#a5b4fc'],
      Intermediate:['#e0f2fe','#0369a1','#bae6fd'],Beginner:['#f3f4f6','#6b7280','#d1d5db']};
    const [bg,cl,br]=cols[sk.level]||cols.Intermediate;
    return`<span style="font-size:10.5px;padding:2px 10px;border-radius:100px;
      background:${bg};color:${cl};border:1px solid ${br};font-weight:600;margin:0 4px 5px 0;display:inline-block">${esc(sk.name)}</span>`;
  };
  return`
  <div style="font-family:'Raleway',sans-serif;background:#f0f9ff;min-height:100%;">
    <!-- Indigo header -->
    <div style="background:linear-gradient(135deg,#3730a3,#1d4ed8);padding:26px 36px 22px;position:relative;overflow:hidden;">
      <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#3730a3,#06b6d4)"></div>
      <div style="font-size:28px;font-weight:800;color:#fff;line-height:1.1;letter-spacing:-.5px">${esc(d.name||'Your Name')}</div>
      <div style="font-size:11px;font-weight:700;color:#67e8f9;margin-top:5px;letter-spacing:1.5px;text-transform:uppercase">${esc(d.jobTitle||'Job Title')}</div>
      <div style="margin-top:9px;display:flex;flex-wrap:wrap;gap:0;color:rgba(255,255,255,.65)">
        ${contactRow('mail',d.email)}${contactRow('phone',d.phone)}${contactRow('location_on',d.location)}${contactRow('link',d.linkedin)}${contactRow('code',d.github)}${contactRow('language',d.portfolio)}
      </div>
    </div>
    <div style="padding:22px 36px 28px;">
      ${d.summary?`<div style="margin-bottom:18px;">${ST('Summary')}<p style="font-size:12.5px;line-height:1.75;color:#1e3a5f">${esc(d.summary)}</p></div>`:''}
      ${d.experience.length?`<div style="margin-bottom:18px;">${ST('Work Experience')}${d.experience.map(e=>rItem(e.title,`${e.company}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),e.desc,'#1e3a5f','#3b82f6')).join('')}</div>`:''}
      ${d.education.length?`<div style="margin-bottom:18px;">${ST('Education')}${d.education.map(e=>rItem(e.degree,`${e.inst}${e.location?' · '+e.location:''}`,[e.start,e.end].filter(Boolean).join(' – '),'','#1e3a5f','#3b82f6')+(e.grade?`<div style="font-size:11px;color:#3730a3;margin-top:-8px;margin-bottom:10px">${esc(e.grade)}</div>`:'')).join('')}</div>`:''}
      <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:22px;">
        <div>
          ${d.skills.length?`<div style="margin-bottom:18px;">${ST('Skills')}<div style="display:flex;flex-wrap:wrap;margin-top:4px">${d.skills.map(sk=>chipP(sk)).join('')}</div></div>`:''}
          ${d.projects.length?`<div>${ST('Projects')}${d.projects.map(p=>rItem(p.name,p.tech?'🛠 '+p.tech:'','',p.desc,'#1e3a5f','#3730a3')).join('')}</div>`:''}
        </div>
        <div>
          ${d.languages?`<div style="margin-bottom:14px;">${ST('Languages')}<p style="font-size:12px;color:#1e3a5f;line-height:1.65">${esc(d.languages)}</p></div>`:''}
          ${d.certifications?`<div style="margin-bottom:14px;">${ST('Certifications')}${multiLine(d.certifications)}</div>`:''}
          ${d.achievements?`<div style="margin-bottom:14px;">${ST('Achievements')}${multiLine(d.achievements)}</div>`:''}
          ${d.hobbies?`<div>${ST('Interests')}<p style="font-size:12px;color:#1e3a5f;line-height:1.65">${esc(d.hobbies)}</p></div>`:''}
        </div>
      </div>
    </div>
  </div>`;
}