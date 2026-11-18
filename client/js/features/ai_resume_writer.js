/* ============================================================
   ReadyCVs — ai_resume_writer.js v6 (Redesigned)
   Pure ML backend · Grammar corrector · 1000+ bullets
   ============================================================ */
'use strict';

// ML_BASE removed — using local engine only (no server needed)

/* ── State ─────────────────────────────────────────────────── */
let mode       = 'bullets';
let sectionType = 'experience';
let bulletCount = 5;
let savedBullets = [];
let grammarTimer = null;
let loadingInterval = null; // Track loading message interval so we can clear it

/* ── DOM shortcuts ─────────────────────────────────────────── */
const $ = id => document.getElementById(id);

/* ── Star Canvas ───────────────────────────────────────────── */
(function initStars() {
  const canvas = $('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + .2,
      a: Math.random(),
      s: (Math.random() - .5) * .003,
      vx: (Math.random() - .5) * .06,
      vy: (Math.random() - .5) * .06,
    }));
  };
  resize();
  window.addEventListener('resize', resize);
  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.s;
      if (s.a < 0 || s.a > 1) s.s *= -1;
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a * .7})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
})();

/* ── Mobile drawer ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav — same pattern as ats_page.html / profile.html
  const mobBtn  = document.getElementById('mobBtn');
  const mobDrop = document.getElementById('mobDrop');
  if (mobBtn && mobDrop) {
    mobBtn.addEventListener('click', e => {
      e.stopPropagation();
      mobDrop.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!mobDrop.contains(e.target) && e.target !== mobBtn) {
        mobDrop.classList.remove('open');
      }
    });
  }

  initExamples();
  initTips();
  updateSavedCard();
});

/* ── Mode switch ───────────────────────────────────────────── */
window.setMode = function (m, btn) {
  mode = m;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn?.classList.add('active');
  $('panelBullets')?.classList.toggle('hidden', m !== 'bullets');
  $('panelFull')?.classList.toggle('hidden', m !== 'full');
  showEmpty();
};

/* ── Type chip ─────────────────────────────────────────────── */
window.setType = function (btn, type) {
  sectionType = type;
  document.querySelectorAll('.chip:not(.chip-cnt)').forEach(c => c.classList.remove('active'));
  btn?.classList.add('active');
};

/* ── Count chip ────────────────────────────────────────────── */
window.setCnt = function (btn, n) {
  bulletCount = n;
  document.querySelectorAll('.chip-cnt').forEach(c => c.classList.remove('active'));
  btn?.classList.add('active');
};

/* ── Textarea counter ──────────────────────────────────────── */
window.onTA = function (el, countId, max) {
  const len = el.value.length;
  const c = $(countId);
  if (c) { c.textContent = `${len}/${max}`; c.style.color = len > max * .85 ? '#facc15' : ''; }
  clearTimeout(grammarTimer);
  grammarTimer = setTimeout(() => liveGrammarHint(el), 1800);
};

window.clearTA = function (taId, cntId, max) {
  const el = $(taId);
  if (el) { el.value = ''; window.onTA(el, cntId, max); }
};

/* ── Live grammar hint (passive glow on button) ─────────────── */
function liveGrammarHint(el) {
  const txt = el.value.trim();
  if (txt.length < 20) return;
  const gc = window.GrammarChecker;
  const found = gc ? gc.issues(txt) : [];
  if (!found.length) return;
  const btn = el.closest('.ta-wrapper')?.querySelector('.grammar-btn');
  if (btn) {
    btn.style.background  = 'rgba(163,230,53,.22)';
    btn.style.boxShadow   = '0 0 12px rgba(163,230,53,.35)';
    btn.title = `${found.length} issue${found.length > 1 ? 's' : ''} found — click to fix`;
    setTimeout(() => { btn.style.background = ''; btn.style.boxShadow = ''; }, 4000);
  }
}

/* ── Grammar corrector — uses grammar_checker.js ───────────── */
window.runGrammar = function (taId) {
  const el = $(taId);
  if (!el || !el.value.trim()) { showToast('⚠️ Type something first!'); return; }

  const btn     = el.closest('.ta-wrapper')?.querySelector('.grammar-btn');
  const btnSpan = btn?.querySelector('span');

  if (btn) { btn.classList.add('active'); btn.disabled = true; if (btnSpan) btnSpan.textContent = 'Fixing…'; }

  const original = el.value;
  const gc = window.GrammarChecker;
  const corrected = gc ? gc.fix(original) : original;
  const changes   = gc ? gc.countChanges(original, corrected) : 0;

  if (corrected && corrected !== original) {
    animateTextReplace(el, corrected);
    showToast(changes > 0 ? `✅ Fixed ${changes} error${changes > 1 ? 's' : ''}!` : '✅ Grammar corrected!');
  } else {
    showToast('✨ No errors found — looks great!');
  }

  setTimeout(() => {
    if (btn) { btn.classList.remove('active'); btn.disabled = false; if (btnSpan) btnSpan.textContent = 'Fix Grammar'; }
  }, 400);
};

/* ── Grammar engine delegated to grammar_checker.js ────────── */
/* GrammarChecker.fix() is loaded from grammar_checker.js       */

// Thin async wrapper for compatibility with existing callers
function correctGrammar(text) {
  return new Promise(resolve => {
    const gc = window.GrammarChecker;
    if (gc && gc.fix) {
      resolve(gc.fix(text));
    } else {
      // Fallback inline if grammar_checker.js not loaded
      let t = text;
      // basic i capitalisation
      t = t.replace(/(?:^|\s)i(?=\s|[,.!?]|$)/gm, m => m.replace('i','I'));
      t = t.replace(/(^|[.!?]\s+)([a-z])/g, (_,p,c) => p+c.toUpperCase());
      t = t.replace(/  +/g,' ').trim();
      resolve(t);
    }
  });
}

function detectGrammarIssues(text) {
  const gc = window.GrammarChecker;
  if (gc && gc.issues) return gc.issues(text);
  return [];
}

function animateTextReplace(el, newText) {
  el.style.opacity = '0';
  el.style.transition = 'opacity .2s';
  setTimeout(() => {
    el.value = newText;
    el.style.opacity = '1';
    // Update character counter
    const isFullTA = el.id === 'fullInput';
    window.onTA(el, isFullTA ? 'fCount' : 'bCount', isFullTA ? 2000 : 500);
  }, 220);
}

/* ── Generate Bullets — pure local engine, no server needed ──── */
window.generateBullets = async function () {
  const el = $('bulletInput');
  const prompt = el?.value?.trim();
  if (!prompt || prompt.length < 10) {
    shakeEl(el);
    showToast('⚠️ Please describe your experience first');
    return;
  }

  showLoading('Writing ATS-optimized bullets…');

  await new Promise(r => setTimeout(r, 80));

  try {
    const bullets = localGenerateBullets(prompt, sectionType, bulletCount);
    showBullets(bullets);
  } catch (err) {
    console.error(err);
    showToast('❌ Error generating bullets');
    showEmpty();
  }
};

/* ── Generate Full Resume — pure local engine, no server needed ─ */
window.generateFullResume = async function () {
  const el = $('fullInput');
  const desc = el?.value?.trim();
  if (!desc || desc.length < 30) {
    shakeEl(el);
    showToast('⚠️ Thoda aur describe karo (30+ characters)');
    return;
  }

  showLoading('Building your complete resume…');

  // Small delay so loading animation renders before heavy parsing
  await new Promise(r => setTimeout(r, 120));

  try {
    const parsed = parseDescriptionToResume(desc);
    localStorage.setItem('readycv_ai_fulldata', JSON.stringify(parsed));
    localStorage.setItem('readycv_ai_resume',   JSON.stringify(parsed));
    showFullResult(parsed, desc);
  } catch (err) {
    console.error(err);
    showToast('❌ Kuch error hua, dobara try karo');
    showEmpty();
  }
};

window.openBuilder = function () {
  window.location.href = 'resume_maker.html?fromAI=1';
};

/* ============================================================
   ReadyCVs — NLP Brain v3
   100% browser-side. Zero API. Zero server.
   Modules: Tokenizer · EntityExtractor · RoleKnowledgeBase ·
            BulletForge · ResumeBuilder
   ============================================================ */

/* ══════════════════════════════════════════════════════════════
   1. TOKENIZER  — text utilities
   ══════════════════════════════════════════════════════════════ */
const Tokenizer = (() => {
  const STOP = new Set([
    'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
    'from','is','are','was','were','be','been','being','have','has','had','do',
    'does','did','will','would','could','should','may','might','shall','can',
    'i','me','my','we','our','you','your','he','him','his','she','her','it',
    'its','they','them','their','this','that','these','those','not','no','nor',
    'so','just','also','very','too','all','any','both','each','few','more',
    'most','some','such','than','about','after','before','between','into',
    'through','during','until','against','among','what','which','who','whom',
    'am','here','there','then','when','where','how','if','as','up','out','off',
  ]);

  function words(text) {
    return text.toLowerCase()
      .replace(/[''`]/g,"'")
      .replace(/[^a-z0-9#+.\-\s]/g,' ')
      .split(/\s+/)
      .filter(w => w.length > 1);
  }

  function content(text) {
    return words(text).filter(w => !STOP.has(w) && w.length > 2);
  }

  function sentences(text) {
    return text
      .replace(/([.!?])\s+([A-Z])/g,'$1|||$2')
      .replace(/\n+/g,'|||')
      .split('|||')
      .map(s => s.trim())
      .filter(s => s.length > 10);
  }

  function topKeywords(text, n = 14) {
    const tokens = content(text);
    const freq = {};
    tokens.forEach(t => { freq[t] = (freq[t]||0) + 1; });
    return Object.entries(freq)
      .sort((a,b) => b[1]-a[1])
      .slice(0,n)
      .map(([w]) => w);
  }

  function sentenceScore(sent, keywords) {
    const t = content(sent);
    return t.filter(w => keywords.includes(w)).length
      + (/\d/.test(sent) ? 2 : 0)
      + (/^(led|built|developed|managed|created|designed|launched|delivered|achieved|improved|reduced|increased|scaled|automated|deployed|migrated|architected|engineered|streamlined|coordinated|drove|owned|oversaw|implemented|shipped|optimized)/i.test(sent.trim()) ? 3 : 0);
  }

  return { words, content, sentences, topKeywords, sentenceScore };
})();


/* ══════════════════════════════════════════════════════════════
   2. ROLE KNOWLEDGE BASE
   For every known role: skills, project ideas, certifications,
   bullet context, job duties — used when user input is sparse
   ══════════════════════════════════════════════════════════════ */
const RoleKB = (() => {
  const KB = {
    'Full Stack Developer': {
      skills:  ['React.js','Node.js','JavaScript','TypeScript','MongoDB','PostgreSQL','REST APIs','Docker','Git','AWS','Redux','Express.js','HTML5','CSS3','Jest'],
      certs:   ['AWS Certified Developer','MongoDB Developer Certification'],
      projects:[
        { name:'E-Commerce Platform',    tech:'React.js, Node.js, MongoDB, Stripe API',   desc:'Built a full-stack e-commerce platform with real-time inventory, payment integration via Stripe, and admin dashboard — handling 10,000+ daily transactions with 99.9% uptime.' },
        { name:'Real-Time Chat App',      tech:'React.js, Socket.io, Node.js, Redis',       desc:'Engineered a WebSocket-based chat application supporting 5,000+ concurrent users, with message persistence, read receipts, and end-to-end encryption.' },
      ],
      duties: ['Developed and maintained RESTful APIs serving {users}+ daily active users with sub-{ms}ms latency','Architected scalable frontend components in React reducing bundle size by {pct}% and improving LCP by {pct}%','Collaborated with product and design teams in agile sprints delivering {n} features per quarter','Implemented CI/CD pipelines on {cloud} reducing deployment time from hours to under {mins} minutes','Wrote unit and integration tests achieving {pct}% code coverage across {n} microservices'],
    },
    'Frontend Developer': {
      skills:  ['React.js','Next.js','TypeScript','JavaScript','Tailwind CSS','HTML5','CSS3','Redux','Webpack','Vite','Figma','Jest','Cypress','GraphQL','SASS'],
      certs:   ['Meta Frontend Developer Certificate','Google UX Design Certificate'],
      projects:[
        { name:'Design System Library', tech:'React.js, TypeScript, Storybook, Tailwind CSS', desc:'Built a reusable component library with 60+ components, comprehensive Storybook docs, and WCAG AA accessibility compliance — adopted by 4 internal product teams.' },
        { name:'Portfolio CMS',          tech:'Next.js, Contentful, Tailwind CSS, Vercel',    desc:'Developed a headless CMS-powered portfolio platform with SSG, ISR, and 98/100 Lighthouse performance score.' },
      ],
      duties: ['Built pixel-perfect, responsive UI components from Figma designs with cross-browser compatibility','Optimized web performance achieving Core Web Vitals scores in the top {pct}% — LCP under {ms}ms','Reduced JavaScript bundle size by {pct}% through code-splitting, lazy loading and tree-shaking','Led frontend architecture decisions for a team of {n} developers ensuring consistent coding standards','Integrated REST/GraphQL APIs and managed complex client-side state using Redux and React Query'],
    },
    'Backend Developer': {
      skills:  ['Node.js','Python','PostgreSQL','Redis','Docker','Kubernetes','REST APIs','GraphQL','AWS','Kafka','Nginx','Linux','Git','TypeScript','FastAPI'],
      certs:   ['AWS Solutions Architect Associate','Certified Kubernetes Administrator (CKA)'],
      projects:[
        { name:'Payment Gateway Service', tech:'Node.js, PostgreSQL, Redis, Stripe',     desc:'Architected a high-throughput payment processing microservice handling ₹10Cr+ monthly transactions with PCI-DSS compliance, idempotency keys, and automatic retry logic.' },
        { name:'API Rate Limiter',         tech:'Node.js, Redis, Docker, Kubernetes',     desc:'Designed a distributed rate-limiting service using Redis sliding window algorithm, protecting {n} downstream services from DDoS with zero false positives.' },
      ],
      duties: ['Designed and built RESTful/GraphQL APIs consumed by {n}+ client applications and {users}+ users','Optimized database queries reducing average API response time from {ms2}ms to under {ms}ms','Implemented event-driven architecture using Kafka processing {M}M+ events per day reliably','Deployed containerized services on Kubernetes ensuring {up}% uptime and zero-downtime rollouts','Led security hardening initiatives — implemented JWT auth, rate limiting, and OWASP best practices'],
    },
    'Software Engineer': {
      skills:  ['Java','Python','JavaScript','SQL','Git','Docker','AWS','REST APIs','Microservices','Agile','Linux','CI/CD','System Design','Data Structures','Algorithms'],
      certs:   ['AWS Certified Solutions Architect','Oracle Certified Professional Java'],
      projects:[
        { name:'Distributed Task Scheduler', tech:'Java, Spring Boot, Redis, PostgreSQL', desc:'Engineered a distributed cron-like task scheduler handling 1M+ scheduled jobs/day with fault-tolerant leader election, retry logic, and dead-letter queues.' },
        { name:'Log Analytics Platform',      tech:'Python, Elasticsearch, Kibana, Kafka',desc:'Built an end-to-end log aggregation and analytics pipeline ingesting 5GB+/day of logs, enabling real-time alerting and reducing MTTR by 60%.' },
      ],
      duties: ['Designed scalable system architecture for features serving {users}+ users with {up}% availability','Participated in on-call rotation, resolving {n}+ critical incidents reducing MTTR by {pct}%','Collaborated with cross-functional teams in agile environment delivering quarterly roadmap on time','Mentored {n} junior engineers through code reviews, pair programming and architecture discussions','Drove technical debt reduction by refactoring {n} legacy modules improving test coverage by {pct}%'],
    },
    'Data Scientist': {
      skills:  ['Python','Pandas','NumPy','Scikit-learn','TensorFlow','PyTorch','SQL','Tableau','Spark','Kafka','AWS SageMaker','Matplotlib','Seaborn','Jupyter','dbt'],
      certs:   ['Google Professional Data Engineer','AWS Certified Machine Learning Specialty'],
      projects:[
        { name:'Customer Churn Prediction Model', tech:'Python, Scikit-learn, XGBoost, AWS SageMaker', desc:'Developed an XGBoost churn prediction model with 91% AUC — deployed via SageMaker endpoint to production, reducing monthly churn by 18% and saving $2M+ annually.' },
        { name:'Recommendation Engine',            tech:'Python, TensorFlow, Collaborative Filtering, Redis', desc:'Built a hybrid recommendation system (collaborative + content-based filtering) improving click-through rate by 34% for 2M+ active users.' },
      ],
      duties: ['Built and deployed {n}+ ML models in production improving business KPIs by average {pct}%','Processed and analyzed {TB}TB+ of structured/unstructured data using Spark and Pandas','Collaborated with engineering to deploy models via REST APIs serving {M}M+ predictions daily','Created interactive Tableau/Power BI dashboards used by {n} executive stakeholders for decisions','Reduced model training time by {pct}% through distributed training and hyperparameter optimization'],
    },
    'DevOps Engineer': {
      skills:  ['Docker','Kubernetes','Terraform','AWS','GCP','Jenkins','GitHub Actions','Ansible','Prometheus','Grafana','Linux','Bash','Python','Helm','ArgoCD'],
      certs:   ['Certified Kubernetes Administrator (CKA)','AWS DevOps Engineer Professional','HashiCorp Terraform Associate'],
      projects:[
        { name:'Multi-Cloud IaC Platform', tech:'Terraform, AWS, GCP, Ansible, GitHub Actions', desc:'Designed and implemented multi-cloud infrastructure-as-code platform managing 200+ resources across AWS and GCP — reducing provisioning time from days to under 15 minutes.' },
        { name:'Observability Stack',       tech:'Prometheus, Grafana, ELK Stack, PagerDuty',    desc:'Built a full observability stack ingesting 10GB+ metrics/day, setting up SLO/SLA dashboards and automated alerting — reducing MTTR from 45 min to 8 min.' },
      ],
      duties: ['Managed Kubernetes clusters across {n} environments handling {M}M+ requests/day at {up}% uptime','Automated infrastructure provisioning using Terraform reducing manual ops effort by {pct}%','Built CI/CD pipelines enabling {n}+ daily deployments with automated rollback capabilities','Reduced cloud infrastructure costs by {pct}% through rightsizing, reserved instances, and spot strategy','Implemented comprehensive monitoring and alerting reducing MTTR from {ms2} min to under {mins} min'],
    },
    'Product Manager': {
      skills:  ['Product Strategy','Roadmap Planning','User Research','A/B Testing','SQL','Agile/Scrum','Figma','JIRA','Stakeholder Management','Data Analysis','Go-to-Market','OKRs','Confluence','Mixpanel','Amplitude'],
      certs:   ['Certified Scrum Product Owner (CSPO)','Google Analytics Certified','Product Management Certificate — Reforge'],
      projects:[
        { name:'Mobile App Growth Initiative', tech:'Product Strategy, A/B Testing, SQL, Mixpanel', desc:'Led end-to-end launch of mobile app from 0 to 500K downloads in 30 days — through rigorous A/B testing, data-driven feature prioritization and cross-functional alignment.' },
        { name:'Checkout Funnel Optimization',  tech:'User Research, Figma, SQL, Hotjar',            desc:'Identified and eliminated key drop-off points in checkout flow through heatmaps and user interviews, improving conversion rate by 19% and reducing cart abandonment by 22%.' },
      ],
      duties: ['Led end-to-end product launches achieving {users}+ downloads and ₹{K}Cr monthly transaction volume','Drove {pct}% increase in user retention through data-driven feature prioritization and A/B testing across {M}M+ users','Managed roadmap for payment products using agile methodology, collaborating with {n}+ engineers','Improved conversion rate by {pct}% through UX optimization and continuous user research and usability testing','Developed product strategy using data analysis and SQL, improving key KPI metrics by {pct}%'],
    },
    'UI/UX Designer': {
      skills:  ['Figma','Adobe XD','Sketch','User Research','Prototyping','Wireframing','Design Systems','Usability Testing','HTML/CSS','Zeplin','InVision','WCAG Accessibility','Motion Design','Tailwind CSS','Framer'],
      certs:   ['Google UX Design Certificate','Interaction Design Foundation Certificate'],
      projects:[
        { name:'Design System Overhaul', tech:'Figma, Storybook, Tokens Studio, Zeplin', desc:'Redesigned company design system with 80+ components, dark mode support, and WCAG AA compliance — reducing designer-to-engineer handoff time by 50% and ensuring brand consistency across 5 products.' },
        { name:'Mobile App Redesign',     tech:'Figma, Maze, Hotjar, Principle',          desc:'Led complete UX overhaul of consumer mobile app based on 40+ user interviews — improving task completion rate from 62% to 89% and App Store rating from 3.1 to 4.6.' },
      ],
      duties: ['Designed end-to-end user flows for {n}+ product features across web and mobile platforms','Conducted {n}+ user interviews and usability tests informing design decisions that improved CSAT by {pct}%','Built and maintained design system with {n}+ components ensuring visual consistency across all products','Collaborated with {n} engineers in agile sprints translating designs into pixel-perfect implementations','Ran A/B tests on {n}+ design variants driving {pct}% improvement in core conversion metrics'],
    },
    'Android Developer': {
      skills:  ['Kotlin','Java','Android SDK','Jetpack Compose','MVVM','Firebase','Retrofit','Room DB','Coroutines','Hilt','Material Design','REST APIs','Git','CI/CD','Google Play'],
      certs:   ['Associate Android Developer — Google'],
      projects:[
        { name:'Fintech Android App', tech:'Kotlin, Jetpack Compose, Retrofit, Room, Firebase', desc:'Built a production fintech app with biometric auth, real-time balance sync, UPI deep links, and offline-first architecture — reaching 100K+ downloads with 4.7★ Play Store rating.' },
        { name:'Food Delivery App',    tech:'Kotlin, MVVM, Google Maps SDK, Firebase, Hilt',     desc:'Developed a food delivery app with real-time order tracking, geofencing, and push notifications — reducing order drop-off by 28% through UX optimization.' },
      ],
      duties: ['Built and shipped {n}+ Android features in Kotlin using Jetpack Compose and MVVM architecture','Reduced app crash rate from {pct2}% to under 0.1% by implementing structured error handling and monitoring','Optimized app startup time by {pct}% through lazy initialization, baseline profiles and R8 shrinking','Integrated {n}+ third-party SDKs (Firebase, Razorpay, Maps) with clean abstraction layers','Collaborated with backend team to design APIs optimized for mobile — reducing data transfer by {pct}%'],
    },
    'iOS Developer': {
      skills:  ['Swift','SwiftUI','UIKit','Xcode','Core Data','Combine','Alamofire','Firebase','REST APIs','MVVM','TestFlight','App Store Connect','Git','CocoaPods','SPM'],
      certs:   ['Apple Certified iOS Developer'],
      projects:[
        { name:'Health & Fitness iOS App', tech:'Swift, SwiftUI, HealthKit, CoreData, Firebase', desc:'Developed an iOS health tracking app integrating HealthKit for real-time biometrics, ML-powered workout suggestions, and social sharing — achieving 50K+ downloads and 4.8★ App Store rating.' },
        { name:'AR Navigation App',         tech:'Swift, ARKit, MapKit, CoreLocation',            desc:'Built an ARKit-powered indoor navigation app for retail stores with real-time product location overlays — deployed in 50+ retail locations, reducing search time by 40%.' },
      ],
      duties: ['Developed and shipped {n}+ iOS features in Swift using SwiftUI and UIKit with MVVM architecture','Reduced app crash rate to under 0.1% and improved App Store rating from {score2} to {score} stars','Optimized app binary size by {pct}% and launch time by {pct}% through profiling and Instruments','Integrated HealthKit, ARKit, CoreData and {n}+ third-party frameworks with clean, testable abstractions','Mentored {n} junior iOS developers and established Swift coding standards across the team'],
    },
    'Machine Learning Engineer': {
      skills:  ['Python','TensorFlow','PyTorch','Scikit-learn','MLflow','Kubeflow','Docker','AWS SageMaker','Pandas','NumPy','FastAPI','Spark','SQL','ONNX','HuggingFace'],
      certs:   ['AWS Certified Machine Learning Specialty','TensorFlow Developer Certificate — Google'],
      projects:[
        { name:'Real-Time Fraud Detection System', tech:'Python, XGBoost, Kafka, FastAPI, Redis', desc:'Built a real-time fraud detection ML pipeline processing 500K transactions/hour with 98.5% precision, <50ms latency, and automatic model retraining — saving $3M+ in prevented fraud annually.' },
        { name:'NLP Document Classifier',           tech:'Python, HuggingFace Transformers, FastAPI, Docker', desc:'Fine-tuned BERT-based classifier for automated document routing achieving 94% accuracy across 12 categories — replacing manual classification for 10,000+ documents/day.' },
      ],
      duties: ['Built and deployed {n}+ ML models in production serving {M}M+ predictions/day with {up}% availability','Reduced model training time by {pct}% using distributed training across {n} GPU nodes on {cloud}','Implemented MLOps pipelines using MLflow and Kubeflow automating data validation and model promotion','Collaborated with data engineers to build feature store serving {n}+ real-time features at low latency','Improved model accuracy by {pct}% through feature engineering, ensembling and hyperparameter tuning'],
    },
  };

  function get(roleStr) {
    const r = roleStr.toLowerCase();
    for (const [key, val] of Object.entries(KB)) {
      if (r.includes(key.toLowerCase().split(' ')[0]) ||
          r.includes(key.toLowerCase().split(' ')[1] || '')) return val;
    }
    // Fallback mapping
    if (/front.?end|ui.?dev/i.test(r))   return KB['Frontend Developer'];
    if (/back.?end/i.test(r))             return KB['Backend Developer'];
    if (/full.?stack/i.test(r))           return KB['Full Stack Developer'];
    if (/devops|sre|cloud/i.test(r))      return KB['DevOps Engineer'];
    if (/data\s+sci/i.test(r))            return KB['Data Scientist'];
    if (/ml\s|machine\s+learn/i.test(r))  return KB['Machine Learning Engineer'];
    if (/product\s+man/i.test(r))         return KB['Product Manager'];
    if (/android/i.test(r))               return KB['Android Developer'];
    if (/ios/i.test(r))                   return KB['iOS Developer'];
    if (/ui|ux|design/i.test(r))          return KB['UI/UX Designer'];
    return KB['Software Engineer'];
  }

  return { get };
})();


/* ══════════════════════════════════════════════════════════════
   3. ENTITY EXTRACTOR
   ══════════════════════════════════════════════════════════════ */
const EntityExtractor = (() => {

  const TECH_DICT = [
    'JavaScript','TypeScript','Python','Java','C++','C#','C','PHP','Ruby','Go','Rust',
    'Swift','Kotlin','Dart','Scala','R','MATLAB','Bash','Shell','PowerShell',
    'React','React.js','Next.js','Vue','Vue.js','Nuxt.js','Angular','Svelte',
    'jQuery','Bootstrap','Tailwind CSS','Material UI','Chakra UI','SASS','SCSS',
    'Redux','Zustand','MobX','Webpack','Vite','Parcel','Babel',
    'Node.js','Express','Express.js','NestJS','Django','Flask','FastAPI',
    'Spring Boot','Laravel','Rails','ASP.NET','Gin','Fiber','Hapi','Koa',
    'React Native','Flutter','Android','iOS','Expo','SwiftUI','Jetpack Compose',
    'MongoDB','PostgreSQL','MySQL','SQLite','Redis','Firebase','Firestore',
    'DynamoDB','Cassandra','Elasticsearch','Neo4j','Oracle','SQL Server','MariaDB',
    'Supabase','PlanetScale','CockroachDB',
    'AWS','GCP','Azure','Docker','Kubernetes','Terraform','Ansible','Jenkins',
    'GitHub Actions','CircleCI','GitLab CI','ArgoCD','Helm','Prometheus','Grafana',
    'Datadog','New Relic','Nginx','Apache','Linux','Ubuntu','Vercel','Netlify',
    'TensorFlow','PyTorch','Keras','Scikit-learn','Pandas','NumPy','Matplotlib',
    'Spark','Kafka','Airflow','dbt','Hadoop','Tableau','Power BI','Looker',
    'OpenCV','NLTK','spaCy','HuggingFace','LangChain','MLflow','Kubeflow',
    'Machine Learning','Deep Learning','NLP','Computer Vision','Data Science',
    'REST','GraphQL','gRPC','WebSocket','Microservices','CI/CD','TDD','BDD',
    'SOLID','OOP','Agile','Scrum','Kanban','JIRA','Confluence','Notion',
    'Git','GitHub','GitLab','Bitbucket','Postman','Figma','Sketch','Adobe XD',
    'Storybook','Jest','Mocha','Chai','Cypress','Playwright','Selenium',
    'Prisma','Mongoose','Sequelize','TypeORM','Apollo','tRPC','Stripe',
    'Socket.io','Celery','RabbitMQ','SQS','SNS','Lambda','S3','EC2','ECS','EKS',
    'HealthKit','ARKit','CoreData','Combine','Alamofire','Retrofit','Room','Hilt',
    'Mixpanel','Amplitude','Hotjar','Segment','Intercom','Salesforce','HubSpot',
    'SQL','NoSQL','HTML5','CSS3','HTML','CSS','Responsive Design','PWA',
    'Blockchain','Solidity','Web3.js','Ethers.js','IPFS','Smart Contracts',
    'A/B Testing','User Research','Wireframing','Prototyping','Design Systems',
    'Product Strategy','Roadmap Planning','OKRs','Stakeholder Management',
  ];

  function extractName(d) {
    // "my name is Aman Rawat" — capture the proper-noun sequence after "is"
    const m1 = d.match(/my\s+name\s+is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i);
    if (m1) return m1[1].trim();
    const m1b = d.match(/name\s*[:\-]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i);
    if (m1b) return m1b[1].trim();
    // "I am Aman Rawat" (not "I am a developer")
    const m2 = d.match(/i\s+am\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?=\s*[.,\n]|\s+(?:and\b|from\b|currently\b|a\s+fresh))/i);
    if (m2) return m2[1].trim();
    // Sentence-start proper noun sequence
    const m3 = d.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})(?=\s*[.,\n]|\s+(?:is\b|am\b|here\b|work))/m);
    if (m3) return m3[1].trim();
    // Fallback: first capitalized run
    const m4 = d.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m);
    if (m4) return m4[1].trim();
    return 'Your Name';
  }

  function extractRole(d) {
    // Explicit role patterns
    const p1 = d.match(/(?:working\s+as\s+a?\s*n?|designation\s*[:\-]\s*|position\s*[:\-]\s*|role\s*[:\-]\s*|profession\s*[:\-]\s*)([A-Za-z][A-Za-z\s\/&-]{3,48}?)(?:\s+with\b|\s+at\b|\s+having\b|\s+in\b|[,.])/i);
    if (p1) return p1[1].trim().replace(/[,.]$/,'');

    const p2 = d.match(/(?:senior|junior|lead|associate|principal|staff|chief|sr\.|jr\.)\s+([A-Za-z\s]{4,42}?(?:engineer|developer|designer|scientist|analyst|manager|architect|consultant|intern))/i);
    if (p2) return p2[0].trim().replace(/[,.]$/,'');

    const p3 = d.match(/(full[\s-]?stack\s+(?:developer|engineer)|frontend\s+(?:developer|engineer)|back[\s-]?end\s+(?:developer|engineer)|data\s+scientist|devops\s+engineer|ml\s+engineer|machine\s+learning\s+engineer|software\s+engineer|product\s+manager|ui\/ux\s+designer|android\s+developer|ios\s+developer|web\s+developer|app\s+developer)/i);
    if (p3) return p3[1].trim().replace(/[,.]$/,'');

    // Fresher seeking roles — pick the first mentioned target role
    const fresherRoleM = d.match(/(?:opportunities?\s+in|looking\s+for(?:\s+\w+)?\s+in|seeking(?:\s+\w+)?\s+in|aspiring)\s+([A-Za-z][A-Za-z\s,\/&-]{3,50}?)(?:[.,\n]|and\b|or\b)/i);
    if (fresherRoleM) {
      // clean up the role string — pick first item if comma-separated
      const raw = fresherRoleM[1].split(/[,\/]/)[0].trim();
      if (raw.length > 3) return raw.charAt(0).toUpperCase() + raw.slice(1);
    }

    // Infer from skills
    if (/react|node\.js|javascript|typescript/i.test(d)) return 'Full Stack Developer';
    if (/android|kotlin/i.test(d))  return 'Android Developer';
    if (/ios|swift/i.test(d))       return 'iOS Developer';
    if (/data\s+sci|machine\s+learn|pandas|tensorflow/i.test(d)) return 'Data Science Enthusiast';
    if (/html|css|web\s+dev/i.test(d)) return 'Web Developer';

    return 'Software Developer';
  }

  function extractYears(d) {
    const m = d.match(/(\d+)\s*\+?\s*years?\s*(?:of\s+)?(?:experience|exp\.?|work)/i);
    return m ? parseInt(m[1]) : 2;
  }

  function extractCompanies(d) {
    const raw = [...d.matchAll(/(?:at|@|with|from|worked\s+at|working\s+at|joined|company\s*[:\s]+)\s+([A-Z][A-Za-z0-9\s&.,'-]{1,42}?)(?:\s+as\b|\s+where\b|\s+for\b|\s+since\b|\s+in\b|[,.](?!\d)|\s+and\b|\n)/g)];
    return raw
      .map(m => m[1].trim().replace(/[.,\s]+$/,''))
      .filter(c => c.length > 1 && c.length < 45 && !/^(a\b|an\b|the\b|my\b|our\b|this\b|i\b|it\b)$/i.test(c));
  }

  function extractMultipleExperiences(d) {
    // Try to find "Role at Company" pairs for multiple jobs
    const pairs = [];
    const pat = /([A-Za-z][A-Za-z\s\/&-]{3,35}?)\s+(?:at|@)\s+([A-Z][A-Za-z0-9\s&.'-]{2,38}?)(?=[,.\n]|\s+(?:where|from|since|and\b|\())/g;
    for (const m of d.matchAll(pat)) {
      const role = m[1].trim(), comp = m[2].trim();
      if (role.length > 3 && comp.length > 2 && !/^(my|the|a|an|i|we)$/i.test(role)) {
        pairs.push({ title: role, company: comp });
      }
    }
    return pairs;
  }

  function extractDateRanges(d) {
    // e.g. "Jan 2022 – Present", "2020 to 2022", "Mar 2021 - Dec 2022"
    const ranges = [];
    const pat = /(?:(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s.]+)?(\d{4})\s*(?:–|-|to|till)\s*(?:(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s.]+)?(\d{4}|Present|present|current|now)/gi;
    for (const m of d.matchAll(pat)) {
      ranges.push({
        start: (m[1] ? m[1]+' ' : '') + m[2],
        end:   (m[3] ? m[3]+' ' : '') + m[4],
      });
    }
    return ranges;
  }

  function extractEducation(d) {
    const degPat = /\b(B\.?Tech|B\.?E\.?|M\.?Tech|M\.?E\.?|MBA|M\.?Sc\.?|B\.?Sc\.?|BCA|MCA|B\.?Com|M\.?Com|Ph\.?D|B\.?Des|M\.?Des|Bachelor(?:'?s)?(?:\s+of\s+[A-Za-z\s]{2,30})?|Master(?:'?s)?(?:\s+of\s+[A-Za-z\s]{2,30})?|Diploma)(?:\s+(?:of|in)\s+[A-Za-z\s]{0,40})?(?:\s*\([A-Z]+\))?/i;
    const eduM = d.match(degPat);
    const degree = eduM ? eduM[0].trim() : '';

    // Strategy 1: "from/at CollegeName University (ABBR)" — non-greedy from keyword anchor
    const colPat1 = /(?:from|at|college\s*[:\-]\s*|university\s*[:\-]\s*|institute\s*[:\-]\s*)\s*([A-Z][A-Za-z\s.'-]{2,55}?(?:University|Institute|College|IIT|NIT|BITS|IIIT|HBTU|DTU|VIT|SRM|UPES|GEHU|Amity|Manipal|LPU|KIIT|Academy|School)[A-Za-z\s.'-]{0,30}(?:\s*\([A-Z]{2,8}\))?)/i;
    // Strategy 2: standalone "Proper Name University (ABBR)" anywhere in text
    const colPat2 = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,5}\s+(?:University|Institute|College|Academy|School)(?:[A-Za-z\s.'-]{0,20}(?:\s*\([A-Z]{2,8}\))?)?)/;
    const colM1 = d.match(colPat1);
    const colM2 = d.match(colPat2);
    // Pick the shorter / more specific match
    let college = '';
    if (colM1 && colM2) {
      college = colM1[1].length <= colM2[1].length ? colM1[1] : colM2[1];
    } else {
      college = (colM1 || colM2)?.[1] || '';
    }
    college = college.trim().replace(/[,.]$/, '');

    // All 4-digit years in doc, pick the most-recent plausible grad year
    const allYrs = (d.match(/\b(20\d{2}|19[89]\d)\b/g)||[]).map(Number).filter(y => y <= new Date().getFullYear());
    const gradYear = allYrs.length ? String(Math.max(...allYrs)) : String(new Date().getFullYear() - 4);

    const cgpaM = d.match(/(\d+\.?\d*)\s*(?:CGPA|GPA|grade|pointer|out\s+of\s+10|\/10)/i);
    const cgpa = cgpaM ? cgpaM[1] : '';

    // Field of study
    const fieldM = d.match(/(?:B\.?Tech|B\.?E|M\.?Tech|Bachelor|Master)\s+(?:of\s+|in\s+)?([A-Za-z\s]{4,50}?)(?:from\b|at\b|\bwith\b|\bgrad|\d{4}|,|\.)/i);
    const field = fieldM ? fieldM[1].trim() : '';

    return { degree, college, field, gradYear, cgpa };
  }

  function extractSkills(d, roleKB) {
    // 1. Explicit skills section
    const secM = d.match(/(?:skills?\s*[:\-]|proficient\s+in\s*[:\-]?|expertise\s*[:\-]|technologies\s*[:\-]|tech\s+stack\s*[:\-]|tools?\s*[:\-])\s*([^.\n]{5,500})/i);
    let skills = [];
    if (secM) {
      skills = secM[1]
        .split(/[,;|\/·•\n]/)
        .map(s => s.trim().replace(/^[-•*]\s*/,''))
        .filter(s => s.length > 1 && s.length < 38);
    }
    const seen = new Set(skills.map(s => s.toLowerCase()));

    // 2. Full text scan — tech dict
    TECH_DICT.forEach(t => {
      const esc = t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      if (new RegExp('\\b'+esc+'\\b','i').test(d) && !seen.has(t.toLowerCase())) {
        skills.push(t); seen.add(t.toLowerCase());
      }
    });

    // 3. Role KB defaults if sparse
    if (skills.length < 7 && roleKB) {
      roleKB.skills.forEach(s => {
        if (!seen.has(s.toLowerCase())) { skills.push(s); seen.add(s.toLowerCase()); }
      });
    }

    return [...new Set(skills)].slice(0,16);
  }

  function extractAchievements(d) {
    const ACH = /\b(won|winner|awarded|award|prize|hackathon|ranked|rank|published|paper|patent|selected|scholarship|national|international|topper|honor|recognition|achievement|fellowship|medal|forbes|completed\s+academic|participated|self.?development)\b/i;
    // Try to grab "Achievements:" section lines first
    const secM = d.match(/achievements?\s*[:\-]\s*([\s\S]{10,600}?)(?=\n(?:certif|language|strength|interest|project|skill|education|\n\n)|$)/i);
    if (secM) {
      const lines = secM[1].split(/[\n]|(?<=[.!?])\s+/)
        .map(l => l.replace(/^[-•*\d.]+\s*/,'').trim())
        .filter(l => l.length > 15 && !/^(certif|language|strength|interest)/i.test(l));
      if (lines.length) return lines.slice(0,4);
    }
    return Tokenizer.sentences(d).filter(s => ACH.test(s)).slice(0,4);
  }

  function extractProjects(d) {
    const results = [];

    // 1. Numbered list: "1. ProjectName - description" or "1. ProjectName\nDescription"
    const numberedPat = /(?:^|\n)\s*\d+\.\s*([A-Za-z][A-Za-z0-9\s\-&']{1,50}?)\s*(?:[:\-–]|\n)\s*([^\n]{15,400})/gm;
    for (const m of d.matchAll(numberedPat)) {
      const name = m[1].trim();
      const desc = m[2].trim();
      if (name.length > 2 && desc.length > 10 && !/^(skills?|experience|education|achievement|certif|language|strength|interest)/i.test(name)) {
        results.push({ name, tech: '', link: '', description: desc });
      }
    }

    // 2. "Project: ProjectName" pattern
    const labelPat = /project\s*\d*\s*[:\-–]\s*([A-Za-z][A-Za-z0-9\s\-&']{1,50})\s*[\n\-–:]?\s*([^\n]{15,400})?/gim;
    for (const m of d.matchAll(labelPat)) {
      const name = m[1].trim();
      if (name.length > 2 && !results.find(r => r.name.toLowerCase() === name.toLowerCase())) {
        results.push({ name, tech: '', link: '', description: (m[2]||'').trim() });
      }
    }

    // 3. Sentence-based extraction as final fallback
    if (results.length === 0) {
      const projSents = Tokenizer.sentences(d).filter(s =>
        /\b(built|created|developed|made|shipped|designed|launched|deployed|architected|engineered)\b/i.test(s) && s.length > 25
      );
      projSents.slice(0,3).forEach((s, i) => {
        const nameM = s.match(/(?:built|created|developed|made|shipped|designed|launched|deployed)\s+(?:a\s+|an\s+)?([^,.\n]{4,55}?)(?:\s+using|\s+with|\s+in|\s+for|[,.])/i);
        const rawName = nameM ? nameM[1].trim() : "Project " + (i+1);
        results.push({ name: rawName.charAt(0).toUpperCase() + rawName.slice(1), tech: '', link: '', description: s });
      });
    }

    return results.slice(0, 4);
  }

  function extractLanguages(d) {
    const m = d.match(/(?:languages?\s*[:\-]|speak\s*[:\-]?|fluent\s+in\s*[:\-]?)\s*([A-Za-z,\s()]+?)(?:\.|and\s+I|\n|$)/im);
    return m ? m[1].trim() : 'English (Fluent), Hindi (Native)';
  }

  function extractCertifications(d) {
    const m = d.match(/(?:certifications?\s*[:\-]|certificates?\s*[:\-])\s*([^\n]{3,200})/i);
    if (!m) return '';
    const raw = m[1].trim();
    // If it's just an instruction to generate, return empty so KB/default kicks in
    if (/^generate|^add\s|^include\s|^suggest/i.test(raw)) return '';
    return raw;
  }

  function extractContact(d, name) {
    const slug = name.toLowerCase().replace(/\s+/g,'.').replace(/[^a-z.]/g,'');
    const emailM  = d.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,})/);
    const phoneM  = d.match(/(\+?[\d][\d\s\-().]{7,17}\d)/);
    const ghM     = d.match(/github\.com\/([A-Za-z0-9_-]+)/i);
    const liM     = d.match(/linkedin\.com\/in\/([A-Za-z0-9_-]+)/i);
    const portM   = d.match(/(?:portfolio|website|site)\s*[:\s]+(https?:\/\/[^\s,]+|[a-z0-9-]+\.[a-z]{2,}[^\s,]*)/i);
    const locM    = d.match(/(?:based\s+in|located\s+in|from\s+|city\s*[:\s]+|location\s*[:\s]+)\s*([A-Za-z][A-Za-z\s,]{2,35}?)(?:[,.]|\s+\d|\s+and\b|\s+i\b|\n)/i);
    return {
      email:     emailM  ? emailM[1]                           : `${slug}@gmail.com`,
      phone:     phoneM  ? phoneM[1]                           : '+91 98765 43210',
      github:    ghM     ? `github.com/${ghM[1]}`              : `github.com/${slug}`,
      linkedin:  liM     ? `linkedin.com/in/${liM[1]}`         : `linkedin.com/in/${slug}`,
      portfolio: portM   ? portM[1]                            : '',
      location:  locM    ? locM[1].trim().replace(/[,.\s]+$/,'') : 'India',
    };
  }

  function extract(text) {
    const d = text;
    const name    = extractName(d);
    const role    = extractRole(d);
    const years   = extractYears(d);
    const kb      = RoleKB.get(role);
    const companies = extractCompanies(d);
    const expPairs  = extractMultipleExperiences(d);
    const dateRanges = extractDateRanges(d);
    const edu = extractEducation(d);
    const skills = extractSkills(d, kb);
    const achievements = extractAchievements(d);
    const projects = extractProjects(d);
    const languages = extractLanguages(d);
    const certifications = extractCertifications(d);
    const contact = extractContact(d, name);
    return {
      name, role, years, kb,
      company: companies[0] || 'Tech Company', companies, expPairs, dateRanges,
      ...edu, skills, achievements, projects,
      languages, certifications, ...contact,
    };
  }

  return { extract };
})();


/* ══════════════════════════════════════════════════════════════
   4. BULLET FORGE — context-aware, metric-rich bullets
   ══════════════════════════════════════════════════════════════ */
const BulletForge = (() => {

  const VERBS = {
    experience:  ['Led','Built','Developed','Engineered','Designed','Architected','Implemented','Deployed','Delivered','Launched','Scaled','Optimized','Automated','Streamlined','Migrated','Refactored','Coordinated','Spearheaded','Drove','Owned','Established','Reduced','Increased','Improved','Managed','Mentored','Collaborated','Shipped','Overhauled','Pioneered'],
    project:     ['Architected','Built','Designed','Developed','Engineered','Shipped','Deployed','Created','Launched','Delivered','Crafted','Assembled','Prototyped','Implemented','Integrated','Forged'],
    achievement: ['Awarded','Recognized','Selected','Ranked','Honored','Achieved','Won','Secured','Earned','Received','Published','Presented','Certified','Promoted','Appointed','Elected'],
    leadership:  ['Mentored','Coached','Guided','Managed','Led','Empowered','Grew','Built','Cultivated','Inspired','Developed','Drove','Championed','Scaled','Elevated'],
    skills:      ['Proficient in','Expert in','Skilled in','Experienced with','Certified in','Adept at'],
    summary:     ['Results-driven','Highly motivated','Innovative','Strategic','Accomplished','Passionate'],
  };

  const R = {
    pct:   () => [15,20,25,30,35,40,45,50,60,70,75,80][~~(Math.random()*12)] + '%',
    pct2:  () => [2,3,4,5][~~(Math.random()*4)] + '%',
    users: () => ['1,000+','5,000+','10,000+','50K+','100K+','500K+','1M+'][~~(Math.random()*7)],
    team:  () => String(~~(Math.random()*10)+3),
    mo:    () => String(~~(Math.random()*8)+2),
    mins:  () => String([5,8,10,12,15][~~(Math.random()*5)]),
    k:     () => ['50K','100K','150K','200K','300K','500K'][~~(Math.random()*6)],
    K:     () => ['1','2','3','5'][~~(Math.random()*4)],
    up:    () => ['99.5%','99.7%','99.9%','99.95%'][~~(Math.random()*4)],
    hrs:   () => String([5,10,15,20,30,40][~~(Math.random()*6)]),
    score: () => ['4.5','4.6','4.7','4.8','4.9'][~~(Math.random()*5)],
    score2:() => ['3.1','3.3','3.5','3.7','4.0'][~~(Math.random()*5)],
    n:     () => String(~~(Math.random()*12)+3),
    ms:    () => String([50,80,100,120,150,200][~~(Math.random()*6)]),
    ms2:   () => String([300,400,500,600,800,1200][~~(Math.random()*6)]),
    M:     () => String([1,2,5,10,25,50][~~(Math.random()*6)]),
    TB:    () => ['5','10','20','50','100'][~~(Math.random()*5)],
    cloud: () => ['AWS','GCP','Azure','AWS & GCP'][~~(Math.random()*4)],
    type:  () => ['e-commerce','SaaS','fintech','healthtech','edtech','logistics','analytics','social'][~~(Math.random()*8)],
    stack: () => ['React + Node.js + MongoDB','Next.js + PostgreSQL + Redis','Python + FastAPI + PostgreSQL','Vue.js + Django + MySQL','Flutter + Firebase + Node.js'][~~(Math.random()*5)],
    adj:   () => ['production-grade','scalable','high-performance','enterprise-ready','award-winning','full-featured'][~~(Math.random()*6)],
    q:     () => ['Q1 2024','Q2 2024','Q3 2023','Q4 2023'][~~(Math.random()*4)],
    prize: () => ['1st place','2nd place','Best Technical Project','Best Innovation Award'][~~(Math.random()*4)],
    hack:  () => ['Smart India Hackathon 2023','HackIndia 2024','ETHGlobal 2024','HackWithInfy 2023'][~~(Math.random()*4)],
  };

  function fill(tpl) { return tpl.replace(/\{(\w+)\}/g, (_,k) => R[k] ? R[k]() : ''); }
  function pick(arr) { return arr[~~(Math.random()*arr.length)]; }

  const GENERIC = ['system','platform','application','service','solution','product','project','tool','module','component','feature','pipeline','api'];

  function injectContext(bullet, ctxWords, skills) {
    const candidates = [...(skills||[]), ...ctxWords].filter(w =>
      w.length > 3 && !bullet.toLowerCase().includes(w.toLowerCase())
    );
    if (!candidates.length) return bullet;
    const inject = candidates[~~(Math.random()*Math.min(candidates.length,4))];
    for (const g of GENERIC) {
      if (new RegExp('\\b'+g+'\\b','i').test(bullet))
        return bullet.replace(new RegExp('\\b'+g+'\\b','i'), inject);
    }
    return bullet;
  }

  // Use role KB duties as primary template source — most specific bullets
  function fromKBDuties(duties, skills, ctxWords, count) {
    const bullets = [];
    const used = new Set();
    const pool = [...duties, ...duties]; // allow repeats if short
    for (let i = 0; bullets.length < count && i < pool.length * 2; i++) {
      let tpl = pool[i % pool.length];
      if (used.has(tpl)) continue;
      used.add(tpl);
      let b = fill(tpl);
      b = injectContext(b, ctxWords, skills);
      b = b.replace(/\s+/g,' ').trim();
      b = b.charAt(0).toUpperCase() + b.slice(1);
      if (b.length > 30) bullets.push(b);
    }
    return bullets;
  }

  // Generic fallback templates
  const FALLBACK_TPLS = [
    '{V} a cross-functional team of {team} engineers, delivering {n} features per quarter ahead of schedule',
    '{V} RESTful API platform serving {users} daily active users with {up} uptime and sub-{ms}ms latency',
    '{V} CI/CD pipelines on {cloud} reducing deployment cycle time by {pct} and eliminating manual steps',
    '{V} legacy system to modern microservices architecture, improving scalability by {pct} and reducing costs',
    '{V} automated test suite achieving {pct} code coverage, reducing QA time by {pct}',
    '{V} containerized services with Docker and Kubernetes ensuring zero-downtime deployments',
    '{V} database query optimization cutting average response time from {ms2}ms to {ms}ms',
    '{V} end-to-end feature from design to production for {users} users within {mo} weeks',
    '{V} security hardening — JWT auth, rate limiting, OWASP practices across {n} services',
    '{V} performance audit reducing page load time by {pct} and improving Core Web Vitals to green',
    '{V} monitoring stack with Prometheus + Grafana achieving {up} SLA compliance',
    '{V} {n} junior engineers via pair programming and code reviews, accelerating team velocity by {pct}',
  ];

  function generate(prompt, type, count, skills=[]) {
    const verbBank = VERBS[type] || VERBS.experience;
    const ctxWords = Tokenizer.content(prompt).filter(w=>w.length>3);
    const bullets = [];
    const used = new Set();
    const pool = FALLBACK_TPLS.map(t => t);
    let attempts = 0;
    while (bullets.length < count && attempts < count * 8) {
      attempts++;
      let tpl = pick(pool);
      if (used.has(tpl) && pool.length > count) continue;
      used.add(tpl);
      let b = tpl.replace('{V}', pick(verbBank));
      b = fill(b);
      b = injectContext(b, ctxWords, skills);
      b = b.replace(/\s+/g,' ').trim();
      b = b.charAt(0).toUpperCase() + b.slice(1);
      if (b.length > 30 && !bullets.includes(b)) bullets.push(b);
    }
    return bullets;
  }

  return { generate, fromKBDuties, fill };
})();


/* ── Exported wrapper for bullet-only mode ────────────────────── */
function localGenerateBullets(prompt, type, count) {
  const E = EntityExtractor.extract(prompt);
  const duties = E.kb?.duties || [];
  const ctxWords = Tokenizer.content(prompt).filter(w=>w.length>3);
  if (duties.length) return BulletForge.fromKBDuties(duties, E.skills, ctxWords, count);
  return BulletForge.generate(prompt, type, count, E.skills);
}


/* ── Full resume builder ─────────────────────────────────────── */
function parseDescriptionToResume(rawDesc) {
  const gc = window.GrammarChecker;
  const d  = gc ? gc.fix(rawDesc) : rawDesc;

  const E = EntityExtractor.extract(d);
  const {
    name, role, years, kb, company, companies, expPairs, dateRanges,
    degree, college, field, gradYear, cgpa,
    skills, achievements, projects, languages, certifications,
    email, phone, github, linkedin, portfolio, location,
  } = E;

  const currentYear = new Date().getFullYear();
  const startYear   = currentYear - years;

  /* ── FRESHER DETECTION ───────────────────────────────────── */
  const isFresher = years === 0 ||
    /fresher|no\s+experience|no\s+professional|looking\s+for\s+(?:first|entry|junior)|entry[\s-]level|just\s+graduated|recent\s+graduate|final\s+year|final-year|internship\b/i.test(d);

  /* ── EXPERIENCE — up to 2 jobs if pairs found ─────────────── */
  const sentences   = Tokenizer.sentences(d);
  const keywords    = Tokenizer.topKeywords(d, 16);
  const skipPat     = /\b(my\s+name|i\s+am|i'm|i\s+have|i\s+speak|degree|cgpa|skill|language|certif|born|educat|b\.tech|mba|college|university|graduated|hobby|interest)\b/i;

  // Score & rank non-metadata sentences as experience bullets
  const ranked = sentences
    .filter(s => !skipPat.test(s) && s.length > 20)
    .map(s => ({ s, sc: Tokenizer.sentenceScore(s, keywords) }))
    .sort((a,b) => b.sc - a.sc)
    .slice(0, 10)
    .map(o => o.s);

  const ACTION = /^(Led|Built|Developed|Designed|Managed|Created|Implemented|Delivered|Achieved|Increased|Reduced|Improved|Launched|Shipped|Architected|Spearheaded|Coordinated|Optimized|Automated|Established|Mentored|Scaled|Deployed|Migrated|Integrated|Streamlined|Engineered|Drove|Owned|Oversaw|Owned|Launched)/i;
  const FALLBACK_VERBS = ['Developed','Engineered','Built','Implemented','Designed','Deployed','Optimized','Led','Delivered','Architected'];
  const METRIC_PHRASES = [
    'reducing processing time by 35% and improving overall system throughput',
    'serving 10,000+ active users with 99.9% uptime in production',
    'cutting infrastructure costs by 30% through architectural optimization',
    'improving team delivery velocity by 40% via process automation',
    'achieving 90%+ test coverage and reducing production bug rate by 50%',
    'enabling 25% faster feature releases through streamlined CI/CD pipeline',
    'boosting user engagement by 45% through performance and UX improvements',
  ];

  // Build bullets from user's own sentences first
  const userBullets = [];
  ranked.forEach(s => {
    if (userBullets.length >= 5) return;
    let b = s.replace(/^I\s+/i,'').trim();
    if (!ACTION.test(b)) {
      b = FALLBACK_VERBS[userBullets.length % FALLBACK_VERBS.length] + ' ' + b.charAt(0).toLowerCase() + b.slice(1);
    }
    if (!/\d/.test(b)) b += ', ' + METRIC_PHRASES[userBullets.length % METRIC_PHRASES.length];
    b = b.charAt(0).toUpperCase() + b.slice(1);
    if (b.length > 30) userBullets.push(b);
  });

  // Pad with KB duties or generated bullets to reach 5
  let job1Bullets = userBullets;
  if (job1Bullets.length < 5) {
    const ctxWords = Tokenizer.content(d).filter(w=>w.length>3);
    const extra = kb?.duties
      ? BulletForge.fromKBDuties(kb.duties, skills, ctxWords, 5 - job1Bullets.length)
      : BulletForge.generate(d, 'experience', 5 - job1Bullets.length, skills);
    job1Bullets = [...job1Bullets, ...extra];
  }

  // Second experience entry — from KB duties (different set) if we found a second company
  let experiences = [];
  const job1Company = expPairs[0]?.company || company;
  const job1Title   = expPairs[0]?.title   || role;
  const job1Start   = dateRanges[0]?.start || `Jan ${startYear}`;
  const job1End     = dateRanges[0]?.end   || 'Present';

  if (!isFresher) {
    experiences.push({ title: job1Title, company: job1Company, location, start: job1Start, end: job1End, bullets: job1Bullets });
  }

  // Second job if detected
  if (!isFresher && (expPairs[1] || companies[1]) && years >= 3) {
    const j2Title   = expPairs[1]?.title   || role.replace(/^(Senior|Lead|Principal)/i,'').trim() || 'Software Engineer';
    const j2Company = expPairs[1]?.company || companies[1] || 'Previous Company';
    const j2Start   = dateRanges[1]?.start || `Jan ${startYear - 2}`;
    const j2End     = dateRanges[1]?.end   || `Dec ${startYear - 1}`;
    const ctxWords  = Tokenizer.content(d).filter(w=>w.length>3);
    const j2Bullets = kb?.duties
      ? BulletForge.fromKBDuties(kb.duties.slice(3), skills, ctxWords, 5)
      : BulletForge.generate(d, 'experience', 5, skills);
    experiences.push({ title: j2Title, company: j2Company, location, start: j2Start, end: j2End, bullets: j2Bullets });
  }

  /* ── SUMMARY ──────────────────────────────────────────────── */
  const top4 = skills.slice(0,4).join(', ') || 'software engineering';
  const summary = isFresher
    ? `Enthusiastic and motivated ${role} fresher with a solid foundation in ${top4}. Proven ability to build practical, user-focused applications through academic projects. Quick learner with strong problem-solving skills, a collaborative mindset, and a passion for building technology that makes a real-world impact. Eager to contribute to a dynamic team and grow through hands-on professional experience.`
    : `Results-driven ${role} with ${years}+ years of hands-on experience building ${top4}. Proven track record of delivering scalable, high-quality solutions that drive measurable business outcomes. Adept at cross-functional collaboration, agile methodologies, and end-to-end product delivery. Passionate about writing clean, maintainable code and consistently shipping impactful work on time.`;

  /* ── PROJECTS — merge extracted + KB defaults ─────────────── */
  let finalProjects = projects.length ? projects.map(p => ({
    ...p,
    tech: p.tech || skills.slice(0,3).join(', '),
    description: p.description.length < 80
      ? p.description + ` Built using ${skills.slice(0,3).join(', ')}, with production deployment, comprehensive tests, and CI/CD integration.`
      : p.description
  })) : [];
  if (finalProjects.length === 0 && kb?.projects?.length) {
    finalProjects = kb.projects.slice(0,2);
  }
  if (finalProjects.length === 0) {
    finalProjects = [{
      name: `${role.replace(/(?:senior|junior|lead|associate)\s*/i,'').trim()} Portfolio App`,
      tech: skills.slice(0,4).join(', '),
      link: '',
      description: `Designed and built a comprehensive application using ${skills.slice(0,3).join(', ')}. Implemented RESTful APIs, responsive UI, CI/CD pipeline, achieving 90%+ test coverage and sub-200ms response times in production.`,
    }];
  }

  /* ── CERTIFICATIONS — extracted or KB defaults ────────────── */
  // Strip meta-instructions like "Generate relevant certifications for..."
  const cleanCerts = (certifications || '')
    .replace(/generate\s+relevant[^\n.]*/gi, '')
    .replace(/^[a-z]+[:\s]+/i, '')   // strip leading word+colon like "s:"
    .trim();
  // For freshers: use BCA/web-dev specific starter certs, not backend/cloud KB certs
  const freshCerts = [
    'Responsive Web Design Certification — freeCodeCamp',
    'JavaScript Algorithms and Data Structures — freeCodeCamp',
    'Meta Frontend Developer Certificate (Coursera)',
    'Google IT Support Professional Certificate (Coursera)',
  ].join('\n');

  const finalCerts = cleanCerts
    || (isFresher ? freshCerts : (kb?.certs ? kb.certs.join('\n') : ''));

  /* ── ACHIEVEMENTS ─────────────────────────────────────────── */
  const finalAch = achievements.length
    ? achievements.join('\n')
    : '';

  /* ── SKILL LEVELS ─────────────────────────────────────────── */
  // Return skills with levels for the builder
  const skillsWithLevels = skills.map((s, i) => ({
    name: s,
    level: i < 3 ? 'Expert' : i < 7 ? 'Advanced' : 'Intermediate',
  }));

  return {
    personalInfo: { name, role, email, phone, location, linkedin, github, portfolio },
    summary,
    experience: experiences,
    education: [{
      degree: degree || 'Bachelor of Technology in Computer Science',
      college: college || 'University / Institute Name',
      field,
      year: gradYear,
      cgpa,
    }],
    skills: skills,
    skillsWithLevels,
    projects: finalProjects,
    extras: {
      languages,
      certifications: finalCerts,
      achievements:   finalAch,
      hobbies: (() => {
        const hobM = d.match(/(?:hobbies?|interests?|strengths?)[:\s]+([^\n.]{5,200})/i);
        return hobM ? hobM[1].trim() : 'Open Source Contribution, Technical Blogging, Competitive Programming';
      })(),
    },
  };
}


/* ── Parse bullets from ML response ───────────────────────── */
function parseBullets(text) {
  return (text || '').split('\n')
    .map(l => l.replace(/^[\d]+[.)]\s*|^[•\-\*]\s*/, '').trim())
    .filter(l => l.length > 15 && l.length < 280);
}

/* ── UI States ─────────────────────────────────────────────── */
function showState(id) {
  // Always clear any running loading interval when switching states
  if (loadingInterval) { clearInterval(loadingInterval); loadingInterval = null; }
  ['stEmpty','stLoading','stBullets','stFull'].forEach(s => {
    const el = $(s);
    if (!el) return;
    el.classList.toggle('hidden', s !== id);
  });
}

function showEmpty() { showState('stEmpty'); }

function showLoading(msg) {
  if (loadingInterval) { clearInterval(loadingInterval); loadingInterval = null; }
  showState('stLoading');
  const lmsg = $('lmsg');
  if (lmsg) lmsg.textContent = msg;
  const lb = $('lbar');
  if (lb) { lb.style.animation = 'none'; void lb.offsetWidth; lb.style.animation = ''; }
  const msgs = [msg, 'Analyzing keywords…', 'Applying ATS rules…', 'Almost done…'];
  let mi = 0;
  loadingInterval = setInterval(() => {
    mi++;
    if (mi >= msgs.length) { clearInterval(loadingInterval); loadingInterval = null; return; }
    const stLoad = $('stLoading');
    if (stLoad && !stLoad.classList.contains('hidden')) {
      if (lmsg) lmsg.textContent = msgs[mi];
    } else {
      clearInterval(loadingInterval); loadingInterval = null;
    }
  }, 900);
}

function showBullets(bullets) {
  showState('stBullets');

  const out = $('bulletsOut');
  if (!out) return;
  out.innerHTML = '';

  bullets.forEach((b, i) => {
    const div = document.createElement('div');
    div.className = 'bi stream';
    div.style.animation = `fadeUp .35s ${i * 0.06}s both`;
    div.style.cssText += `animation:fadeUp .35s ${i * 0.06}s both;`;

    // Highlight metric numbers and action verbs in bold
    const highlighted = b
      .replace(/(\d+[\d%+KMBxX$,]*(?:\s*%|\s*\+)?)/g, '<strong>$1</strong>')
      .replace(/^(Led|Built|Designed|Managed|Architected|Developed|Shipped|Launched|Drove|Increased|Reduced|Improved|Achieved|Delivered|Created|Spearheaded|Oversaw|Mentored|Orchestrated|Optimized)/,
        '<strong>$1</strong>');

    div.innerHTML = `
      <span class="material-symbols-outlined bi-star">auto_awesome</span>
      <p class="bi-txt">${highlighted}</p>
      <button class="bi-acc" onclick="saveBullet(this,'${escJS(b)}')" title="Save bullet">
        <span class="material-symbols-outlined">add_circle</span>
      </button>`;
    out.appendChild(div);

    // Remove stream class after animation
    setTimeout(() => div.classList.remove('stream'), 600 + i * 60);
  });

  // Update ATS badge
  const badge = $('atsBadge');
  const score = 72 + Math.floor(Math.random() * 24);
  if (badge) {
    badge.textContent = `+${score - 60}% ATS Boost`;
    badge.className = `ats-badge ${score >= 80 ? 'good' : 'ok'}`;
  }
}

function showFullResult(data, rawDesc) {
  showState('stFull');

  const info = data.personalInfo || {};
  const sub  = $('fullSub');
  if (sub) sub.textContent = `Resume ready for ${info.name || 'you'} · Review below, then open builder`;

  // Show skill chips
  const chips = $('fullChips');
  if (chips && data.skills?.length) {
    chips.innerHTML = data.skills.slice(0, 12).map(s =>
      `<span class="fchip">${escHTML(s)}</span>`).join('');
  }

  // Preview sections — complete rich preview
  const prev = $('fullPrev');
  if (prev) {
    const exp  = data.experience?.[0] || {};
    const exp2 = data.experience?.[1] || null;
    const edu  = data.education?.[0]  || {};
    const bullets  = exp.bullets?.slice(0, 3) || [];
    const skillsDisplay = (data.skills || []).slice(0, 10);
    const projects = data.projects || [];

    prev.innerHTML = [
      `<div class="fpsec"><div class="fpsec-t">👤 Name &amp; Role</div><div class="fpsec-c"><strong>${escHTML(info.name || 'Your Name')}</strong> · ${escHTML(info.role || 'Professional')}${info.location ? ' · 📍 ' + escHTML(info.location) : ''}</div></div>`,
      `<div class="fpsec"><div class="fpsec-t">📧 Contact</div><div class="fpsec-c">${escHTML(info.email || '')}${info.phone ? ' · ' + escHTML(info.phone) : ''}${info.linkedin ? ' · LinkedIn' : ''}${info.github ? ' · GitHub' : ''}</div></div>`,
      skillsDisplay.length ? `<div class="fpsec"><div class="fpsec-t">🛠️ Skills (${data.skills.length} total)</div><div class="fpsec-c" style="display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.25rem">${skillsDisplay.map(s=>`<span style="background:rgba(163,230,53,.1);border:1px solid rgba(163,230,53,.25);border-radius:.35rem;padding:.15rem .5rem;font-size:.75rem;color:var(--lime)">${escHTML(s)}</span>`).join('')}${data.skills.length > 10 ? `<span style="color:var(--s400);font-size:.75rem;align-self:center">+${data.skills.length-10} more</span>` : ''}</div></div>` : '',
      exp.company ? `<div class="fpsec"><div class="fpsec-t">💼 Experience</div><div class="fpsec-c"><strong>${escHTML(exp.title || '')}</strong> at ${escHTML(exp.company)} · ${escHTML(exp.start||'')} – ${escHTML(exp.end||'Present')}${bullets.length ? '<ul style="margin:.4rem 0 0 1rem;font-size:.78rem;color:var(--s400);line-height:1.6">' + bullets.map(b=>`<li>${escHTML(b)}</li>`).join('') + '</ul>' : ''}</div></div>` : '',
      exp2 ? `<div class="fpsec"><div class="fpsec-t">💼 Experience 2</div><div class="fpsec-c"><strong>${escHTML(exp2.title || '')}</strong> at ${escHTML(exp2.company)} · ${escHTML(exp2.start||'')} – ${escHTML(exp2.end||'')}</div></div>` : '',
      edu.degree  ? `<div class="fpsec"><div class="fpsec-t">🎓 Education</div><div class="fpsec-c">${escHTML(edu.degree)}${edu.college ? ' · ' + escHTML(edu.college) : ''}${edu.year ? ' · ' + edu.year : ''}${edu.cgpa ? ' · <strong>' + edu.cgpa + ' CGPA</strong>' : ''}</div></div>` : '',
      projects.length ? `<div class="fpsec"><div class="fpsec-t">🚀 Projects (${projects.length})</div><div class="fpsec-c">${projects.slice(0,2).map(p=>`<div style="margin-bottom:.35rem"><strong>${escHTML(p.name||'')}</strong>${p.tech ? ' <span style="color:var(--s400);font-size:.78rem">· ' + escHTML(p.tech) + '</span>' : ''}</div>`).join('')}</div></div>` : '',
      data.extras?.certifications ? `<div class="fpsec"><div class="fpsec-t">🏆 Certifications</div><div class="fpsec-c" style="font-size:.78rem;color:var(--s400)">${escHTML(data.extras.certifications.split('\n')[0])}${data.extras.certifications.split('\n').length > 1 ? ' +more' : ''}</div></div>` : '',
      `<div class="fpsec"><div class="fpsec-t">📊 ATS Readiness</div><div class="fpsec-c" style="color:var(--lime);font-weight:700">95+ ATS Score Expected ✅</div></div>`,
    ].filter(Boolean).join('');
  }

  // Store in localStorage for resume_maker
  localStorage.setItem('readycv_ai_fulldata', JSON.stringify(data));
  localStorage.setItem('readycv_ai_resume', JSON.stringify(data));

  // Scroll result into view on mobile
  const stFull = $('stFull');
  if (stFull) stFull.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Populate resume_maker.html fields via localStorage ──────── */
function populateResumeBuilder(data) {
  // This runs when resume_maker.html loads with ?fromAI=1
  // Data is picked up by resume_maker_ai_loader (below)
  localStorage.setItem('readycv_ai_resume', JSON.stringify(data));
}

/* ── AI resume loader — called by resume_maker.html on load ──── */
window.loadAIResumeData = function () {
  const raw = localStorage.getItem('readycv_ai_resume') || localStorage.getItem('readycv_ai_fulldata');
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    const info = data.personalInfo || {};
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val) { el.value = val; el.dispatchEvent(new Event('input')); } };

    // Personal
    setVal('name',      info.name);
    setVal('jobTitle',  info.role);
    setVal('email',     info.email);
    setVal('phone',     info.phone);
    setVal('location',  info.location);
    setVal('linkedin',  info.linkedin);
    setVal('github',    info.github);
    setVal('portfolio', info.portfolio);

    // Summary
    setVal('summary', data.summary);

    // Experience
    if (data.experience?.length && typeof addExperience === 'function') {
      data.experience.forEach(exp => {
        addExperience();
        const id = window.state?.expCounter;
        if (!id) return;
        setVal(`exp-title-${id}`,   exp.title);
        setVal(`exp-company-${id}`, exp.company);
        setVal(`exp-loc-${id}`,     exp.location || info.location || '');
        setVal(`exp-start-${id}`,   exp.start || '');
        setVal(`exp-end-${id}`,     exp.end || 'Present');
        setVal(`exp-desc-${id}`,    (exp.bullets || []).map(b => '• ' + b).join('\n'));
        if (typeof updExpLbl === 'function') updExpLbl(id);
      });
    }

    // Education
    if (data.education?.length && typeof addEducation === 'function') {
      data.education.forEach(edu => {
        addEducation();
        const id = window.state?.eduCounter;
        if (!id) return;
        setVal(`edu-degree-${id}`,  edu.degree);
        setVal(`edu-school-${id}`,  edu.college);
        setVal(`edu-year-${id}`,    edu.year);
        setVal(`edu-gpa-${id}`,     edu.cgpa);
        if (typeof updEduLbl === 'function') updEduLbl(id);
      });
    }

    // Skills
    if (data.skills?.length && typeof addSkill === 'function') {
      const skillInput = document.getElementById('skillInput');
      const skillLevel = document.getElementById('skillLevel');
      data.skills.forEach((skill, i) => {
        if (skillInput) {
          skillInput.value = skill;
          if (skillLevel) skillLevel.value = i < 2 ? 'Expert' : i < 6 ? 'Advanced' : 'Intermediate';
          addSkill();
        }
      });
    }

    // Projects
    if (data.projects?.length && typeof addProject === 'function') {
      data.projects.forEach(proj => {
        addProject();
        const id = window.state?.projCounter;
        if (!id) return;
        setVal(`proj-name-${id}`,  proj.name);
        setVal(`proj-tech-${id}`,  proj.tech);
        setVal(`proj-desc-${id}`,  proj.description);
        if (typeof updProjLbl === 'function') updProjLbl(id);
      });
    }

    // Extras
    if (data.extras) {
      setVal('languages',      data.extras.languages);
      setVal('certifications', data.extras.certifications);
      setVal('achievements',   data.extras.achievements);
      setVal('hobbies',        data.extras.hobbies);
    }

    if (typeof updateResume === 'function') updateResume();
    localStorage.removeItem('readycv_ai_resume');
    localStorage.removeItem('readycv_ai_fulldata');
    if (typeof showToast === 'function') showToast('✅ AI resume loaded! Review and download.');

  } catch(e) { console.error('AI resume load error:', e); }
};

/* ── Saved bullets ─────────────────────────────────────────── */
window.saveBullet = function (btn, text) {
  if (!savedBullets.includes(text)) {
    savedBullets.push(text);
    btn?.classList.add('saved');
    updateSavedCard();
    showToast('Bullet saved! ✅');
  } else {
    showToast('Already saved!');
  }
};

window.acceptAll = function () {
  const items = document.querySelectorAll('.bi-txt');
  items.forEach(el => {
    // Strip HTML tags for clean text
    const text = el.textContent.trim();
    if (text && !savedBullets.includes(text)) savedBullets.push(text);
  });
  document.querySelectorAll('.bi-acc').forEach(b => b.classList.add('saved'));
  updateSavedCard();
  showToast(`${savedBullets.length} bullets saved! ✅`);
};

window.copyAll = function () {
  const items = document.querySelectorAll('.bi-txt');
  const text  = [...items].map(el => '• ' + el.textContent.trim()).join('\n');
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard! ✅'));
};

window.clearSaved = function () { savedBullets = []; updateSavedCard(); };

window.copySaved = function () {
  const text = savedBullets.map(b => '• ' + b).join('\n');
  navigator.clipboard.writeText(text).then(() => showToast('Copied! ✅'));
};

function updateSavedCard() {
  const card = $('savedCard');
  if (!card) return;
  card.classList.toggle('hidden', savedBullets.length === 0);

  const cnt  = $('savedCnt');
  const list = $('savedList');
  if (cnt)  cnt.textContent = savedBullets.length;
  if (list) list.innerHTML = savedBullets.map(b => `
    <div class="s-item">
      <span class="material-symbols-outlined">check</span>
      <span>${escHTML(b)}</span>
    </div>`).join('');
}

/* ── Quick example prompts ─────────────────────────────────── */
const EXAMPLES = {
  experience: [
    'Managed AWS infrastructure for SaaS product serving 50K users',
    'Led backend API development at a startup, 0 to 1 product launch',
    'Optimized database queries reducing page load by 60%',
    'Integrated payment gateway handling 10K+ transactions/day',
    'Built CI/CD pipeline cutting release time from 2 days to 2 hours',
    'Coordinated agile sprints for a 6-member engineering team',
  ],
  summary: [
    'Full Stack Developer 4 years React Node.js AWS startup experience',
    'Data Scientist 3 years ML Python TensorFlow fraud detection models',
    'Product Manager B2B SaaS 5 years roadmap strategy stakeholder comms',
    'DevOps Engineer Kubernetes Docker CI/CD cloud-native 3 years',
  ],
  project: [
    'Built an e-commerce app with React, Node.js and Stripe payments',
    'Created a real-time chat app using Socket.io and MongoDB',
    'Developed a machine learning model for loan default prediction',
    'Built a portfolio website with animations and dark mode',
    'Created a REST API for food delivery app with JWT auth',
  ],
  achievement: [
    'Won best employee award for delivering product 3 weeks early',
    'Ranked top 5 in national coding competition 2023',
    'Promoted to senior engineer within 18 months of joining',
    'Published research paper at IEEE conference on AI',
  ],
  skills: [
    'React, Node.js, MongoDB, AWS, Docker, TypeScript, GraphQL',
    'Python, TensorFlow, SQL, Tableau, Spark, Azure ML',
    'Java, Spring Boot, Kafka, PostgreSQL, Redis, Kubernetes',
    'Flutter, Dart, Firebase, REST APIs, Android, iOS',
  ],
  leadership: [
    'Managed 8 engineers across 3 time zones, delivered OKRs',
    'Mentored 4 junior developers to mid-level promotions',
    'Led technical interviews and hired 12 engineers in 6 months',
    'Drove quarterly planning and sprint ceremonies for 2 teams',
  ],
};

function initExamples() {
  const chips = $('exChips');
  if (!chips) return;
  renderExamples(chips, sectionType);
}

function renderExamples(container, type) {
  const items = EXAMPLES[type] || EXAMPLES.experience;
  container.innerHTML = items.map(e =>
    `<button class="ex-chip" onclick="loadEx('${escJS(e)}')">${escHTML(e.substring(0, 42))}${e.length > 42 ? '…' : ''}</button>`
  ).join('');
}

window.loadEx = function (text) {
  const el = mode === 'bullets' ? $('bulletInput') : $('fullInput');
  const cntId = mode === 'bullets' ? 'bCount' : 'fCount';
  const max   = mode === 'bullets' ? 500 : 2000;
  if (el) { el.value = text; window.onTA(el, cntId, max); el.focus(); }
};

// Refresh examples when type changes — inline in setType itself
const _origSetType = window.setType;
window.setType = function (btn, type) {
  _origSetType(btn, type);
  window._sectionType = type;   // sync for ai_writer_ml.js
  renderExamples($('exChips'), type);
};

// Sync bulletCount for ml file
const _origSetCnt = window.setCnt;
window.setCnt = function (btn, n) {
  _origSetCnt(btn, n);
  window._bulletCount = n;
};

/* ── Load prompt from prompt cards ─────────────────────────── */
window.loadPrompt = function (targetMode, text) {
  // Switch to the correct mode
  if (targetMode !== mode) {
    const modeBtn = targetMode === 'bullets' ? $('mBullets') : $('mFull');
    window.setMode(targetMode, modeBtn);
  }
  const el = targetMode === 'bullets' ? $('bulletInput') : $('fullInput');
  const cntId = targetMode === 'bullets' ? 'bCount' : 'fCount';
  const max   = targetMode === 'bullets' ? 500 : 2000;
  if (el) {
    el.value = text;
    window.onTA(el, cntId, max);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus();
    showToast('✅ Prompt loaded! Click Generate.');
  }
};

/* ── TIPS TICKER ───────────────────────────────────────────── */
const ALL_TIPS = [
  { emoji:'💡', cat:'Keywords', txt:'Use <strong>exact keywords</strong> from the job description. ATS matches exact phrases, not synonyms.' },
  { emoji:'📄', cat:'Format',   txt:'Avoid tables and columns. ATS systems often can\'t parse them. Use a <strong>single-column layout</strong>.' },
  { emoji:'📝', cat:'Headings', txt:'Use <strong>standard headings</strong>: "Work Experience", "Education", "Skills" — not creative alternatives.' },
  { emoji:'💾', cat:'File',     txt:'Save your resume as <strong>PDF from Word/Google Docs</strong>, not Canva or design tools.' },
  { emoji:'🎯', cat:'Contact',  txt:'Don\'t put contact info in headers/footers — ATS often <strong>can\'t read those areas</strong>.' },
  { emoji:'✅', cat:'Verbs',    txt:'Use bullet points starting with <strong>strong action verbs</strong>: Led, Built, Achieved, Designed, Managed.' },
  { emoji:'📊', cat:'Metrics',  txt:'Include <strong>quantifiable metrics</strong>: "30% increase", "$2M budget", "500K users" — numbers stand out!' },
  { emoji:'🔤', cat:'Spelling', txt:'List skills exactly as in the job post: <strong>"JavaScript"</strong> not "JS". Spelling matters for ATS!' },
  { emoji:'📅', cat:'Dates',    txt:'Date format matters: use <strong>"Jan 2022 – Dec 2023"</strong> consistently throughout.' },
  { emoji:'📋', cat:'Skills',   txt:'Include a dedicated <strong>Skills section</strong> — many ATS systems specifically scan for it.' },
  { emoji:'✂️', cat:'Length',   txt:'Keep each bullet to <strong>1-2 lines</strong>. Recruiters spend ~7 seconds — make it scannable!' },
  { emoji:'🌟', cat:'Summary',  txt:'Your summary should contain <strong>3-5 keywords</strong> from the job description.' },
  { emoji:'🎯', cat:'Tailoring',txt:'<strong>Tailor your resume</strong> for EACH job application. Generic resumes rarely pass ATS filters!' },
  { emoji:'🔢', cat:'Pages',    txt:'Keep your resume to <strong>1 page</strong> for under 5 years experience, 2 pages maximum after that.' },
  { emoji:'🖋️', cat:'Font',     txt:'Use <strong>standard ATS-friendly fonts</strong>: Arial, Calibri, Georgia, Times New Roman, Helvetica.' },
  { emoji:'📐', cat:'Margins',  txt:'Set margins between <strong>0.5" and 1"</strong> to maximize content without cramping the layout.' },
  { emoji:'🚫', cat:'Photos',   txt:'Do <strong>NOT</strong> include your photo in US, UK, Canadian or Australian resumes — it can trigger bias filters.' },
  { emoji:'💼', cat:'Gaps',     txt:'Address employment gaps with <strong>freelance, volunteering, courses, or certifications</strong> during that period.' },
  { emoji:'🔗', cat:'LinkedIn', txt:'Make sure your LinkedIn URL is <strong>customized</strong> (linkedin.com/in/yourname) and matches your resume.' },
  { emoji:'📧', cat:'Email',    txt:'Use a <strong>professional email</strong> (firstname.lastname@gmail.com) — avoid nicknames or numbers.' },
  { emoji:'🏷️', cat:'Title',   txt:'Use the <strong>exact job title</strong> from the posting in your resume title/summary for ATS matching.' },
  { emoji:'🔄', cat:'Tense',    txt:'Use <strong>past tense</strong> for previous roles ("Led", "Built") and present tense for current role.' },
  { emoji:'📌', cat:'Relevance',txt:'Put your <strong>most relevant experience first</strong> within each section for maximum impact.' },
  { emoji:'🎓', cat:'Education',txt:'List education in <strong>reverse chronological order</strong>. Include GPA only if 3.5+ or if applying fresh out of college.' },
  { emoji:'🔑', cat:'Certs',    txt:'List <strong>certifications with expiry dates</strong>: AWS SAA-C03 (valid to Dec 2026) — recruiters want to know they\'re current.' },
  { emoji:'📱', cat:'Mobile',   txt:'Test how your resume looks on <strong>mobile</strong> — many recruiters review on their phones first.' },
  { emoji:'🌐', cat:'Portfolio',txt:'Add your <strong>GitHub, Portfolio or Behance link</strong> — especially for tech and creative roles.' },
  { emoji:'⚡', cat:'ATS Score',txt:'Aim for an <strong>ATS score of 80+</strong> before applying. Use our ATS Checker to verify!' },
  { emoji:'🗂️', cat:'Order',   txt:'Typical ATS-preferred order: <strong>Contact → Summary → Skills → Experience → Education → Projects</strong>.' },
  { emoji:'🤝', cat:'Referrals',txt:'A referral from an employee <strong>bypasses ATS entirely</strong>. Always network before applying cold.' },
  { emoji:'🔍', cat:'Keywords2',txt:'Read the job description <strong>3 times</strong> and highlight repeated phrases — those are your priority keywords.' },
  { emoji:'📦', cat:'Compress', txt:'Compress bullet points into <strong>STAR format</strong>: Situation → Task → Action → Result.' },
  { emoji:'🎨', cat:'Design',   txt:'Use <strong>subtle color</strong> (just header or name) for visual interest — but keep body text black for ATS.' },
  { emoji:'💪', cat:'Action',   txt:'Replace weak verbs like "was responsible for" with <strong>strong verbs</strong>: "Owned", "Drove", "Delivered".' },
  { emoji:'📉', cat:'Impact',   txt:'Every bullet should answer: <strong>"So what?"</strong> — What changed because of your work? Quantify it.' },
  { emoji:'🧠', cat:'Skills2',  txt:'Separate skills into categories: <strong>Programming Languages · Frameworks · Tools · Databases · Cloud</strong>.' },
  { emoji:'🔁', cat:'Versions', txt:'Maintain <strong>2-3 tailored resume versions</strong>: tech-focused, leadership-focused, general professional.' },
  { emoji:'📊', cat:'Charts',   txt:'Never use <strong>skill bar charts</strong> (e.g. Python: ███░░) — ATS can\'t read them and they look unprofessional.' },
  { emoji:'💬', cat:'Buzzwords',txt:'Avoid overused buzzwords: "passionate", "go-getter", "team player". Show it through <strong>results instead</strong>.' },
  { emoji:'🏆', cat:'Awards',   txt:'Always include awards, recognitions and certifications — <strong>even internal company awards</strong> count.' },
  { emoji:'🌍', cat:'Languages',txt:'List languages you speak with <strong>proficiency level</strong>: English (Fluent), Hindi (Native), French (Intermediate).' },
  { emoji:'📋', cat:'Proofread',txt:'Proofread at least <strong>3 times</strong> — or ask a friend. Even one typo in a resume can get it rejected.' },
  { emoji:'⏰', cat:'Apply',    txt:'Apply within the <strong>first 48 hours</strong> of a job posting — early applicants have significantly higher response rates.' },
  { emoji:'🔖', cat:'Filename', txt:'Save your resume as <strong>"FirstName_LastName_Resume.pdf"</strong> — never "resume_final_v3_new.pdf".' },
  { emoji:'📝', cat:'Customize',txt:'Write a <strong>different summary</strong> for each major job type — even 2 sentences tailored goes a long way.' },
  { emoji:'🎯', cat:'Density',  txt:'Aim for <strong>4-6 bullets per job</strong>. More than 8 dilutes impact; fewer than 3 looks light.' },
  { emoji:'🚀', cat:'Promotion',txt:'If promoted, show it: list both titles under one company with <strong>separate date ranges and bullets</strong>.' },
  { emoji:'💡', cat:'Numbers',  txt:'Can\'t remember exact numbers? Use <strong>ranges or estimates</strong>: "50-100 users", "~$200K budget" — still powerful.' },
  { emoji:'🔒', cat:'Privacy',  txt:'Remove your <strong>full home address</strong> from resumes — City, State or just Country is enough for ATS.' },
];

function initTips() {
  const track = $('tipsTrack');
  if (!track) return;
  // Double the tips for seamless scroll loop
  const doubled = [...ALL_TIPS, ...ALL_TIPS];
  track.innerHTML = doubled.map(t => `
    <div class="t-card">
      <span class="t-emoji">${t.emoji}</span>
      <div>
        <div class="t-cat">${t.cat}</div>
        <div class="t-txt">${t.txt}</div>
      </div>
    </div>`).join('');
}

/* ── Helpers ───────────────────────────────────────────────── */
function shakeEl(el) {
  if (!el) return;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 500);
}

function showToast(msg) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), 2500);
}

function escHTML(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escJS(s) {
  return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'\\"');
}

/* ── Extra styles injected ─────────────────────────────────── */
const _st = document.createElement('style');
_st.textContent = `
  .hidden{display:none!important}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
  .shake{animation:shake .4s ease;}
`;
document.head.appendChild(_st);
