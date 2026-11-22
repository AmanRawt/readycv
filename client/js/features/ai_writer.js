

let currentType = 'experience';
let currentGeneratedContent = '';
let acceptedItems = [];

/* Random Resume Suggestion Prompts */
const RANDOM_PROMPTS = [
  "Spearheaded a cross-functional team of 8 engineers to deliver a microservices architecture, reducing deployment time by 60%.",
  "Orchestrated migration of legacy monolith to cloud-native infrastructure on AWS, cutting operational costs by $120K annually.",
  "Designed and launched a customer feedback platform that increased NPS scores from 32 to 67 within 6 months.",
  "Drove adoption of Agile methodologies across 3 product teams, improving sprint velocity by 45%.",
  "Built a real-time analytics dashboard using React and D3.js, enabling data-driven decisions for C-suite stakeholders.",
  "Negotiated and closed enterprise SaaS deals worth $2.4M in ARR, exceeding quota by 138%.",
  "Architected a scalable REST API serving 10M+ daily requests with 99.98% uptime.",
  "Mentored 6 junior developers through structured 1:1s, with 4 receiving promotions within 18 months.",
  "Led security audit initiative that identified and patched 23 critical vulnerabilities before production deployment.",
  "Implemented machine learning model for fraud detection, reducing false positives by 34% and saving $800K annually.",
  "Established design system from scratch used across 5 product teams, reducing UI development time by 40%.",
  "Coordinated international product launch across 12 markets, achieving 150K downloads in first 30 days.",
  "Reduced customer churn by 28% through implementation of proactive retention email campaign using Klaviyo.",
  "Optimized PostgreSQL queries, reducing average page load time from 3.2s to 0.4s for 500K+ users.",
  "Pioneered company's first remote-first onboarding program, adopted by 3 departments with 95% satisfaction rate.",
  "Generated $1.8M in pipeline through targeted outbound campaigns using Apollo.io and LinkedIn Sales Navigator.",
  "Directed UX research with 120 participants, surfacing insights that increased conversion rate by 22%.",
  "Integrated third-party payment gateway (Stripe) supporting 14 currencies and 8 payment methods.",
  "Authored technical documentation that reduced support tickets by 37% in Q3 2024.",
  "Managed $4.5M marketing budget across digital channels, achieving 3.2x average ROAS.",
  "Built automated testing suite covering 87% of codebase, reducing regression bugs by 65%.",
  "Launched referral program that drove 32% of new customer acquisition at 4x lower CAC.",
  "Collaborated with legal and compliance teams to achieve SOC 2 Type II certification in 7 months.",
  "Created internal Python tooling that automated 80% of manual data-processing workflows.",
  "Scaled customer success team from 3 to 11 reps while maintaining sub-2-hour average response time.",
  "Redesigned mobile checkout flow using A/B testing, lifting mobile conversion by 19%.",
  "Presented quarterly business reviews to board of directors including revenue forecasts and GTM strategy.",
  "Partnered with 40+ content creators for influencer campaign, reaching 8.2M impressions organically.",
  "Deployed Kubernetes cluster managing 200+ microservices, achieving zero-downtime deployments.",
  "Researched and implemented GDPR compliance framework across all data-handling systems.",
  "Won 'Best Innovation' award at company hackathon for AI-powered resume scoring prototype.",
  "Decreased average hiring cycle from 47 to 21 days through ATS optimization and structured interviews.",
  "Grew social media following from 12K to 85K in 8 months through data-driven content strategy.",
  "Delivered 14 client projects on time and under budget with an average satisfaction score of 4.8/5.",
  "Built React Native mobile app with offline-first architecture supporting 200K active users.",
  "Established OKR framework company-wide, increasing strategic alignment across 6 departments.",
  "Managed vendor relationships for 12 SaaS tools, negotiating renewals saving $65K annually.",
  "Developed and delivered 40-hour onboarding curriculum adopted as standard company-wide practice.",
  "Led data governance initiative, creating a single source of truth in Snowflake for 18 teams.",
  "Launched B2B podcast that grew to 25K subscribers, generating 30+ qualified inbound leads per month.",
  "Configured CI/CD pipeline in GitHub Actions, reducing release cycle from 2 weeks to 3 days.",
  "Collaborated with sales team to create battle cards and objection-handling guides, improving win rates by 17%.",
  "Produced financial models for Series A pitch deck, contributing to successful $8M fundraise.",
  "Built Chrome extension with 18K+ active installs and 4.6-star rating on the Chrome Web Store.",
  "Implemented real-time notification system using WebSockets, handling 50K concurrent connections.",
  "Resolved 340+ customer support tickets with 97% satisfaction rating over 12 months.",
  "Planned and executed company's annual off-site for 120 employees across 3 days in Goa.",
  "Wrote 45 long-form SEO articles ranking on page 1 of Google, driving 180K organic visitors monthly.",
  "Developed automated invoice reconciliation tool saving accounting team 15 hours per week.",
  "Managed cross-border logistics for hardware product launch across India, UAE, and Singapore.",
  "Evaluated and selected new CRM system (HubSpot), managing full migration from Salesforce in 3 months.",
  "Built internal analytics platform using Metabase and dbt, enabling self-serve reporting for 60+ users.",
  "Created a multilingual customer support chatbot in Dialogflow, deflecting 42% of tier-1 support tickets.",
  "Earned Google Cloud Professional Data Engineer certification with a score of 89%.",
  "Forged strategic partnership with industry association, unlocking access to 12K potential customers.",
  "Shipped 3 product features voted most useful by users in annual NPS survey.",
  "Reduced infrastructure costs by 41% by rightsizing EC2 instances and implementing Reserved Instances.",
  "Achieved 99.5% inventory accuracy by implementing barcode scanning system across 3 warehouses.",
  "Presented at PyCon India 2024, delivering talk on LLM fine-tuning to 800+ attendees.",
  "Designed modular CSS design token system reducing UI inconsistencies by 70% across web apps.",
  "Led incident response for production outage, restoring service in 23 minutes with full post-mortem.",
  "Coordinated with overseas development team (5 engineers in Ukraine) across 4.5-hour time difference.",
  "Deployed NLP-based ticket classification model, reducing manual triage effort by 55%.",
  "Produced weekly data analytics report for leadership using Tableau, influencing 3 major product pivots.",
  "Grew email list from 8K to 47K subscribers with 42% average open rate through segmentation strategy.",
  "Implemented accessibility (WCAG 2.1 AA) improvements, making product compliant in 8 weeks.",
  "Managed relationships with 28 enterprise accounts averaging $120K ARR each.",
  "Developed internal Python CLI tool for generating PDF reports, replacing 3 manual processes.",
  "Created internship program from scratch, successfully onboarding and retaining 4 of 5 interns as FTEs.",
  "Reduced P1 bug resolution time by 58% by introducing SLA-based alerting in PagerDuty.",
  "Ran 22 growth experiments in Q2, identifying 3 high-impact optimizations driving 15% revenue lift.",
  "Built custom Slack bot for stand-up automation, saving team 30 minutes daily.",
  "Translated 3 complex system architectures into clear technical documentation for non-technical stakeholders.",
  "Launched product waitlist campaign that captured 9,200 signups before public launch.",
  "Optimized ad spend allocation using multi-touch attribution model, improving ROAS from 2.1x to 3.6x.",
  "Directed A/B testing roadmap for landing pages, generating $340K in incremental annual revenue.",
  "Shipped open-source library with 2.1K GitHub stars and 150+ contributors in 6 months.",
  "Built data pipeline ingesting 4TB of user events daily using Apache Kafka and Spark.",
  "Collaborated with compliance team to pass PCI-DSS Level 1 audit on first attempt.",
  "Created SQL training program for non-technical teams; 18 employees became self-sufficient analysts.",
  "Designed RESTful API contract and OpenAPI specification adopted across 3 engineering squads.",
  "Managed content calendar for LinkedIn company page growing from 4K to 31K followers in 10 months.",
  "Coordinated global product localization into 6 languages, expanding TAM by estimated 38%.",
  "Developed real-time inventory management system reducing stockout incidents by 73%.",
  "Achieved Black Belt in Six Sigma; applied methodology to reduce order processing errors by 48%.",
  "Secured seed funding of $500K by preparing pitch materials and financial projections.",
  "Launched internal knowledge base in Notion, reducing repeat questions in Slack by 60%.",
  "Built recommendation engine using collaborative filtering, increasing average session duration by 24%.",
  "Increased product activation rate from 31% to 58% through in-app onboarding redesign.",
  "Coached regional sales team of 12; team finished year at 124% of quota.",
  "Integrated Salesforce with HubSpot and Outreach via Zapier and custom webhooks, unifying 3 systems.",
  "Conducted 200+ user interviews; findings directly influenced 2024 product roadmap priorities.",
  "Maintained 99.9% SLA for enterprise clients managing $50M in annual transaction volume.",
  "Created comprehensive brand guidelines document adopted by 8 agencies and contractors.",
  "Reduced customer onboarding time from 14 days to 4 days through process automation and self-serve tools.",
  "Built full-stack MVP in 3 weeks using Next.js, Supabase, and Vercel; reached 1K users organically.",
  "Developed Python web scraper to monitor competitor pricing, enabling dynamic pricing strategy.",
  "Organized and facilitated 2-day product strategy offsite for leadership team of 15.",
];

/* Type Management  */
function setType(btn, type) {
  document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  currentType = type;
  updatePlaceholder(type);
}

function updatePlaceholder(type) {
  const ta = document.getElementById('promptInput');
  if (!ta) return;
  const placeholders = {
    experience: "e.g. 'Managed a team of 5 software engineers to deliver a new mobile app on time and under budget'",
    summary: "e.g. '5 years of experience in full-stack development, specializing in React and Node.js, passionate about clean code'",
    project: "e.g. 'Built an e-commerce platform with React, Node.js, and MongoDB supporting 10K+ users'",
    skills: "e.g. 'Expert in Python, data analysis, machine learning with TensorFlow, and visualization with Tableau'",
    achievement: "e.g. 'Won first place at national coding competition, received employee of the quarter award twice'"
  };
  ta.placeholder = placeholders[type] || ta.placeholder;
}

/* Quick Prompts  */
function useQuickPrompt(btn) {
  const ta = document.getElementById('promptInput');
  if (ta) ta.value = btn.textContent;
}

/*  Generate via Claude API */
async function generateContent() {
async function generateContent() {
  const prompt = (document.getElementById('promptInput')?.value || '').trim();
  if (!prompt) { showError('Please enter a prompt first!'); return; }

  setUIState('loading');

  /* Try local server first (Gemini via backend)  */
  try {
    const r = await fetch('http://localhost:3001/api/ai-write', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ prompt, sectionType: currentType, count: 5 })
    });
    if (r.ok) {
      const d = await r.json();
      if (d.content) { currentGeneratedContent = d.content; showGeneratedContent(d.content); return; }
    }
  } catch {}

  /* Direct Gemini API (no backend needed)  */
  const GEMINI_KEY = '';
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

  const sys = `Expert resume writer. Generate exactly 5 ATS-optimized bullet points for a "${currentType}" section.
Rules: Start every bullet with a strong action verb (Led, Built, Designed, Achieved, Optimized, Delivered, Launched, Drove, Scaled, Implemented). Include metrics (%, $, numbers). 1-2 lines each. Return ONLY bullets starting with •, no intro.`;

  try {
    const r = await fetch(GEMINI_URL, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        systemInstruction:{ parts:[{ text: sys }] },
        contents:[{ role:'user', parts:[{ text:`Write ${currentType} resume bullets for: "${prompt}"` }] }],
        generationConfig:{ temperature:0.8, maxOutputTokens:800 }
      })
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error.message);
    const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) throw new Error('No content');
    currentGeneratedContent = text;
    showGeneratedContent(text);
    // Track AI generation count for profile stats
    try { localStorage.setItem('readycv_ai_gen_time', String(Date.now())); } catch {}
  } catch (err) {
    console.error('AI generation error:', err);
    // Fallback random from pool
    const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    currentGeneratedContent = '• ' + random;
    showGeneratedContent(currentGeneratedContent);
  }
}

/*  Regenerate Random  */
function regenerateRandom() {
  const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
  currentGeneratedContent = '• ' + random;
  showGeneratedContent(currentGeneratedContent);
}

/*  Accept Content  */
function acceptContent() {
  if (!currentGeneratedContent) return;
  acceptedItems.push(currentGeneratedContent);
  
  const area = document.getElementById('acceptedArea');
  const content = document.getElementById('acceptedContent');
  if (area) area.style.display = 'block';
  if (content) {
    const div = document.createElement('div');
    div.className = 'accepted-item';
    div.innerHTML = `<span class="material-symbols-outlined">check_circle</span><div>${formatBullets(currentGeneratedContent)}</div>`;
    content.appendChild(div);
  }

  // Also copy to clipboard
  navigator.clipboard?.writeText(currentGeneratedContent).catch(() => {});
  showToast('Content accepted & copied to clipboard!');
}

function clearAccepted() {
  acceptedItems = [];
  const content = document.getElementById('acceptedContent');
  if (content) content.innerHTML = '';
  const area = document.getElementById('acceptedArea');
  if (area) area.style.display = 'none';
}

/*  UI State Management */
function setUIState(state) {
  const emptyState  = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const suggestionsText = document.getElementById('suggestionsText');
  const actions = document.getElementById('suggestionsActions');

  if (state === 'loading') {
    if (emptyState) emptyState.style.display = 'none';
    if (loadingState) loadingState.style.display = 'flex';
    if (suggestionsText) suggestionsText.style.display = 'none';
    if (actions) actions.style.display = 'none';
    animateLoadingText();
  } else if (state === 'done') {
    if (emptyState) emptyState.style.display = 'none';
    if (loadingState) loadingState.style.display = 'none';
    if (suggestionsText) suggestionsText.style.display = 'block';
    if (actions) actions.style.display = 'flex';
  } else {
    if (emptyState) emptyState.style.display = 'flex';
    if (loadingState) loadingState.style.display = 'none';
    if (suggestionsText) suggestionsText.style.display = 'none';
    if (actions) actions.style.display = 'none';
  }
}

const LOADING_MESSAGES = [
  'AI is thinking...', 'Crafting bullet points...', 'Adding power words...',
  'Optimizing for ATS...', 'Polishing your content...', 'Almost done...'
];
let loadingMsgIdx = 0;
let loadingInterval = null;

function animateLoadingText() {
  clearInterval(loadingInterval);
  loadingMsgIdx = 0;
  const el = document.getElementById('loadingText');
  if (el) el.textContent = LOADING_MESSAGES[0];
  loadingInterval = setInterval(() => {
    loadingMsgIdx = (loadingMsgIdx + 1) % LOADING_MESSAGES.length;
    if (el) el.textContent = LOADING_MESSAGES[loadingMsgIdx];
  }, 900);
}

function showGeneratedContent(text) {
  clearInterval(loadingInterval);
  const el = document.getElementById('suggestionsText');
  if (el) el.innerHTML = formatBullets(text);
  setUIState('done');
}

function formatBullets(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return lines.map(line => {
    const clean = line.replace(/^[•\-\*]\s*/, '');
    return `<div class="bullet-line"><span class="material-symbols-outlined bullet-icon">arrow_right</span><p>${clean}</p></div>`;
  }).join('');
}

function showError(msg) {
  const el = document.getElementById('suggestionsText');
  if (el) el.innerHTML = `<p style="color:#f87171">${msg}</p>`;
  setUIState('done');
}

function showToast(msg) {
  let toast = document.getElementById('aiToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'aiToast';
    toast.style.cssText = `
      position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(100px);
      background:linear-gradient(135deg,#a855f7,#a3e635);
      color:#0f172a;padding:.6rem 1.25rem;border-radius:100px;font-weight:700;font-size:.875rem;
      z-index:999;transition:transform .3s;display:flex;align-items:center;gap:.4rem;
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px">check_circle</span>${msg}`;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(100px)'; }, 3000);
}
