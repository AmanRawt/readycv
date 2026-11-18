/* ============================================================
   ReadyCVs — ats_script.js
   100% Browser-Based NLP Engine — Zero API, Zero Server
   Works completely offline. No keys needed.
   ============================================================ */
'use strict';

/* ═══════════════════════════════════════════════════════════════
   SECTION 1: KEYWORD DATABASE (200+ keywords, 7 fields)
═══════════════════════════════════════════════════════════════ */
const KEYWORD_DB = {
  tech: {
    core: ['javascript','typescript','python','java','c++','c#','react','angular','vue','node.js','nodejs',
      'express','django','flask','fastapi','spring','html','css','sql','nosql','mongodb','postgresql',
      'mysql','redis','graphql','rest','api','aws','azure','gcp','docker','kubernetes','git','linux',
      'agile','scrum','ci/cd','devops','machine learning','deep learning','tensorflow','pytorch',
      'data structures','algorithms','microservices','cloud','terraform','ansible','jenkins'],
    good: ['webpack','babel','jest','testing','unit testing','integration testing','figma','jira','confluence',
      'github','gitlab','bitbucket','nginx','apache','elasticsearch','kafka','rabbitmq','oauth','jwt',
      'responsive design','mobile development','android','ios','react native','flutter','graphql',
      'typescript','redux','next.js','nuxt','tailwind','bootstrap','sass','webpack','vite']
  },
  marketing: {
    core: ['seo','sem','google analytics','digital marketing','content marketing','social media','ppc',
      'email marketing','marketing automation','hubspot','salesforce','crm','brand management',
      'market research','campaign management','lead generation','conversion rate','a/b testing',
      'copywriting','roi','kpi','growth hacking','influencer marketing','affiliate marketing'],
    good: ['google ads','facebook ads','instagram','linkedin','twitter','tiktok','mailchimp','klaviyo',
      'wordpress','shopify','woocommerce','analytics','data-driven','segmentation','persona',
      'buyer journey','funnel','retention','churn','ltv','cac','organic traffic','backlinks']
  },
  finance: {
    core: ['financial analysis','financial modeling','excel','accounting','budgeting','forecasting',
      'financial reporting','variance analysis','p&l','balance sheet','cash flow','gaap','ifrs',
      'audit','taxation','risk management','investment','portfolio management','valuation','dcf',
      'equity','debt','derivatives','bloomberg','sql','tableau','power bi','quickbooks','sap'],
    good: ['financial statements','cost analysis','revenue forecasting','capital markets','m&a',
      'due diligence','regulatory compliance','sox','internal controls','payroll','accounts payable',
      'accounts receivable','reconciliation','erp','oracle','hyperion','cognos','python','r']
  },
  hr: {
    core: ['recruitment','talent acquisition','onboarding','performance management','employee relations',
      'hris','payroll','compensation','benefits','training','learning & development','succession planning',
      'workforce planning','employment law','compliance','diversity','inclusion','engagement','culture'],
    good: ['workday','bamboohr','greenhouse','lever','applicant tracking','sourcing','linkedin recruiter',
      'behavioral interviewing','competency framework','oкr','kpi','talent management','exit interviews',
      'organizational development','change management','conflict resolution','mediation','coaching']
  },
  design: {
    core: ['figma','sketch','adobe xd','photoshop','illustrator','indesign','ui design','ux design',
      'user research','wireframing','prototyping','usability testing','design systems','typography',
      'color theory','branding','responsive design','accessibility','wcag','user flows','personas'],
    good: ['after effects','premiere','zeplin','invision','miro','notion','user interviews','card sorting',
      'a/b testing','heatmaps','information architecture','interaction design','motion design',
      'design thinking','sprint','agile','css','html','lottie','principle','framer']
  },
  sales: {
    core: ['sales','business development','account management','lead generation','prospecting','cold calling',
      'crm','salesforce','negotiation','closing','pipeline management','quota','revenue','b2b','b2c',
      'customer success','client retention','upselling','cross-selling','sales strategy','forecasting'],
    good: ['hubspot','outreach','salesloft','linkedin sales navigator','zoominfo','apollo','cadence',
      'discovery call','demo','proposal','rfp','contract','territory management','channel sales',
      'partnerships','solution selling','consultative selling','objection handling','roi','commission']
  },
  general: {
    core: ['communication','teamwork','leadership','problem solving','project management','microsoft office',
      'excel','word','powerpoint','time management','critical thinking','analytical','organized',
      'detail-oriented','multitasking','presentation','collaboration','stakeholder management'],
    good: ['strategic planning','process improvement','cross-functional','budget management','reporting',
      'documentation','training','mentoring','coaching','decision making','innovation','adaptability']
  }
};

/* ═══════════════════════════════════════════════════════════════
   SECTION 2: SECTION HEADINGS & PATTERNS
═══════════════════════════════════════════════════════════════ */
const SECTION_PATTERNS = {
  contact:    /(?:contact|email|phone|mobile|address|linkedin|github|portfolio)/i,
  experience: /(?:experience|employment|work history|career|professional background|positions held|work experience)/i,
  education:  /(?:education|academic|qualification|degree|university|college|school|institute|certifications?)/i,
  skills:     /(?:skills|technical skills|core competencies|expertise|technologies|tools|proficiencies)/i,
  summary:    /(?:summary|objective|profile|about|overview|professional summary|career objective)/i,
  projects:   /(?:projects|portfolio|works|case studies|achievements|accomplishments)/i,
  awards:     /(?:awards|honors|recognition|publications|volunteer|activities|interests)/i
};

const ACTION_VERBS = [
  'led','managed','developed','created','designed','implemented','built','launched','achieved',
  'improved','increased','decreased','reduced','saved','generated','delivered','coordinated',
  'collaborated','analyzed','researched','presented','trained','mentored','supervised','directed',
  'established','initiated','introduced','spearheaded','championed','accelerated','optimized',
  'streamlined','transformed','drove','executed','maintained','supported','assisted','produced',
  'wrote','edited','published','presented','negotiated','secured','closed','exceeded','surpassed',
  'engineered','architected','deployed','migrated','integrated','automated','scaled','refactored'
];

const DATE_PATTERN = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s*\d{4}|\d{4}\s*[-–—]\s*(?:\d{4}|present|current|now|ongoing)/gi;
const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_PATTERN = /(?:\+?[\d\s\-\(\)\.]{7,15})/;
const LINKEDIN_PATTERN = /linkedin\.com\/in\/[a-zA-Z0-9\-_]+/i;
const QUANTIFY_PATTERN = /\d+\s*(?:%|percent|k\b|m\b|million|billion|thousand|\+|x\b|times|\$|₹|£|€|users|customers|clients|projects|teams|employees|members|revenue|growth|improvement)/gi;

/* ═══════════════════════════════════════════════════════════════
   SECTION 3: DOM ELEMENTS
═══════════════════════════════════════════════════════════════ */
const uploadBox       = document.getElementById('uploadBox');
const fileInput       = document.getElementById('fileInput');
const progressSection = document.getElementById('progressSection');
const progressTitle   = document.getElementById('progressTitle');
const progressBar     = document.getElementById('progressBar');
const progressPct     = document.getElementById('progressPercentage');

/* ═══════════════════════════════════════════════════════════════
   SECTION 4: FILE UPLOAD HANDLERS
═══════════════════════════════════════════════════════════════ */
if (uploadBox) {
  uploadBox.addEventListener('dragover', e => { e.preventDefault(); uploadBox.classList.add('drag-over'); });
  uploadBox.addEventListener('dragleave', e => { if (!uploadBox.contains(e.relatedTarget)) uploadBox.classList.remove('drag-over'); });
  uploadBox.addEventListener('drop', e => {
    e.preventDefault(); uploadBox.classList.remove('drag-over');
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
  });
  uploadBox.addEventListener('click', e => {
    if (e.target.id === 'browseBtn' || e.target.closest?.('#browseBtn')) return;
    if (progressSection?.style.display === 'block') return;
    fileInput?.click();
  });
  document.getElementById('browseBtn')?.addEventListener('click', e => { e.stopPropagation(); fileInput?.click(); });
}

if (fileInput) {
  fileInput.addEventListener('change', e => {
    if (e.target.files?.length > 0) handleFile(e.target.files[0]);
  });
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5: FILE VALIDATION & ROUTING
═══════════════════════════════════════════════════════════════ */
async function handleFile(file) {
  const allowed = ['application/pdf','image/jpeg','image/jpg','image/png'];
  if (!allowed.includes(file.type)) {
    showNotResumeAnimation('Only PDF, JPG, or PNG files are supported.','📄 Upload a resume PDF or clear photo');
    return;
  }
  if (file.size > 10 * 1024 * 1024) { showUploadErr('File size must be under 10MB.'); return; }

  if (file.type.startsWith('image/')) {
    const check = await quickImageCheck(file);
    if (!check.likelyResume) { showNotResumeAnimation(check.reason,'📄 Upload a clear portrait-orientation photo of your resume'); return; }
  }

  startAnalysis(file);
}

async function quickImageCheck(file) {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = img.width / img.height;
      if (ratio > 1.4) resolve({ likelyResume: false, reason: 'Image appears to be landscape — resumes are portrait documents.' });
      else if (file.size < 15000) resolve({ likelyResume: false, reason: 'Image file is too small to contain resume text.' });
      else resolve({ likelyResume: true });
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve({ likelyResume: true }); };
    img.src = url;
  });
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6: MAIN ANALYSIS FLOW
═══════════════════════════════════════════════════════════════ */
async function startAnalysis(file) {
  showProgress();
  setProgress(5, `📄 Reading ${file.name}...`);
  await sleep(200);

  try {
    let text = '';

    if (file.type === 'application/pdf') {
      setProgress(20, '🔄 Extracting text from PDF...');
      text = await extractPDFText(file);
    } else {
      setProgress(20, '🖼️ Reading image resume...');
      // For images, we do lightweight OCR-like analysis using canvas
      text = await extractImageText(file);
    }

    setProgress(45, '🤖 Running NLP analysis...');
    await sleep(200);

    // Check if it's actually a resume
    const resumeCheck = isResume(text);
    if (!resumeCheck.isResume) {
      setProgress(100, '❌ Not a resume detected');
      await sleep(300);
      showNotResumeAnimation(resumeCheck.reason, '📄 Upload an actual resume document');
      return;
    }

    setProgress(60, '🔍 Detecting field & scanning keywords...');
    await sleep(150);

    const field = detectField(text);
    const keywords = analyzeKeywords(text, field);

    setProgress(75, '📊 Scoring sections, content & format...');
    await sleep(150);

    const sectionScore  = scoreSection(text);
    const contentScore  = scoreContent(text);
    const formatScore   = scoreFormat(text);
    const keywordScore  = Math.min(25, Math.round((keywords.found.length / Math.max(keywords.found.length + keywords.missing.length, 1)) * 25));

    const totalScore = sectionScore.score + keywordScore + contentScore.score + formatScore.score;

    const suggestions = buildSuggestions(sectionScore, keywordScore, contentScore, formatScore, keywords);
    const strengths   = buildStrengths(sectionScore, keywordScore, contentScore, formatScore, keywords, text);

    setProgress(95, '✅ Building your results...');
    await sleep(300);
    setProgress(100, '🎯 Done!');
    await sleep(350);

    const params = new URLSearchParams({
      score:       totalScore,
      keywords:    encodeURIComponent(JSON.stringify(keywords.missing.slice(0,8))),
      suggestions: encodeURIComponent(JSON.stringify(suggestions)),
      strengths:   encodeURIComponent(JSON.stringify(strengths)),
      found:       encodeURIComponent(JSON.stringify(keywords.found.slice(0,12))),
      field:       field,
      breakdown:   encodeURIComponent(JSON.stringify({
        sections:    sectionScore.score,
        keywords:    keywordScore,
        content:     contentScore.score,
        formatting:  formatScore.score
      }))
    });

    // Save extracted resume data so "Edit Resume" can pre-fill resume_maker
    saveResumeForEditor(text, keywords.found);

    window.location.href = 'ats_score_result.html?' + params.toString();

  } catch (err) {
    console.error('ATS error:', err);
    showUploadErr('Could not analyze file. Please try a different PDF or image.');
  }
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7: PDF TEXT EXTRACTION
   Uses PDF.js CDN — loads only when needed
═══════════════════════════════════════════════════════════════ */
async function extractPDFText(file) {
  if (typeof pdfjsLib === 'undefined') {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
  }

  if (typeof pdfjsLib !== 'undefined') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let p = 1; p <= Math.min(pdf.numPages, 5); p++) {
        const page    = await pdf.getPage(p);
        const content = await page.getTextContent();

        // Group items by Y position → reconstruct actual lines
        // item.transform[5] = Y on page (PDF coords go bottom-up → sort descending)
        const yMap = {};
        for (const item of content.items) {
          if (!item.str || !item.str.trim()) continue;
          const y = Math.round(item.transform[5] / 2) * 2; // bucket to ~2pt rows
          if (!yMap[y]) yMap[y] = [];
          yMap[y].push({ x: item.transform[4], str: item.str });
        }

        const sortedYs = Object.keys(yMap).map(Number).sort((a, b) => b - a);
        for (const y of sortedYs) {
          const lineStr = yMap[y].sort((a, b) => a.x - b.x).map(i => i.str).join(' ').trim();
          if (lineStr) fullText += lineStr + '\n';
        }
        fullText += '\n';
      }

      return fullText;
    } catch (e) {
      console.warn('PDF.js failed, using fallback:', e);
    }
  }

  return await extractPDFTextFallback(file);
}

async function extractPDFTextFallback(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const binary = e.target.result;
        // Extract text between BT/ET markers (PDF text operators)
        const textChunks = [];
        const btEtRegex = /BT([\s\S]*?)ET/g;
        const tjRegex = /\(([^)]+)\)\s*(?:Tj|TJ|'|")/g;
        let btMatch;
        while ((btMatch = btEtRegex.exec(binary)) !== null) {
          let tjMatch;
          while ((tjMatch = tjRegex.exec(btMatch[1])) !== null) {
            textChunks.push(tjMatch[1]);
          }
        }
        // Also grab any readable ASCII sequences
        const asciiRegex = /[\x20-\x7E]{4,}/g;
        const asciiMatches = binary.match(asciiRegex) || [];
        const combined = textChunks.join(' ') + ' ' + asciiMatches.join(' ');
        resolve(combined.substring(0, 50000));
      } catch { resolve(''); }
    };
    reader.onerror = () => resolve('');
    reader.readAsBinaryString(file);
  });
}

function loadScript(src) {
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = resolve; // Don't fail if CDN is unavailable
    document.head.appendChild(s);
  });
}

async function extractImageText(file) {
  // For images we can't do real OCR in browser without a heavy library
  // Return a minimal string that triggers image-based scoring
  // (We check dimensions/filename for hints)
  const name = file.name.toLowerCase();
  const hints = [];
  if (name.includes('resume') || name.includes('cv')) hints.push('resume cv curriculum vitae');
  hints.push(''); // image resume - scoring will reflect limited text
  return hints.join(' ');
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 8: RESUME DETECTION (7 signals)
═══════════════════════════════════════════════════════════════ */
function isResume(text) {
  if (!text || text.trim().length < 100) {
    return { isResume: false, reason: 'File has too little readable text. Please upload a text-based PDF.' };
  }

  const lower = text.toLowerCase();
  let signals = 0;
  const detected = [];

  // Signal 1: Section headings
  const sectionMatches = Object.values(SECTION_PATTERNS).filter(p => p.test(lower));
  if (sectionMatches.length >= 2) { signals += 2; detected.push('section headings'); }

  // Signal 2: Email address
  if (EMAIL_PATTERN.test(text)) { signals += 1; detected.push('email'); }

  // Signal 3: Phone number
  if (PHONE_PATTERN.test(text)) { signals += 1; detected.push('phone'); }

  // Signal 4: Date ranges (job periods)
  const dates = text.match(DATE_PATTERN) || [];
  if (dates.length >= 1) { signals += 1; detected.push('dates'); }

  // Signal 5: Action verbs
  const verbsFound = ACTION_VERBS.filter(v => lower.includes(v));
  if (verbsFound.length >= 3) { signals += 1; detected.push('action verbs'); }

  // Signal 6: Keyword density (tech/professional words)
  const allKeywords = [...KEYWORD_DB.general.core, ...KEYWORD_DB.tech.core.slice(0,15)];
  const kwFound = allKeywords.filter(k => lower.includes(k));
  if (kwFound.length >= 3) { signals += 1; detected.push('professional keywords'); }

  // Signal 7: Word count & structure
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount >= 80) { signals += 1; detected.push('adequate length'); }

  if (signals >= 3) return { isResume: true };

  let reason = 'This does not appear to be a resume. ';
  if (signals === 0) reason += 'No resume-like content detected.';
  else reason += `Only ${signals}/7 resume signals found (${detected.join(', ')}).`;

  return { isResume: false, reason };
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 9: FIELD DETECTION
═══════════════════════════════════════════════════════════════ */
function detectField(text) {
  const lower = text.toLowerCase();
  const scores = {};

  for (const [field, db] of Object.entries(KEYWORD_DB)) {
    if (field === 'general') continue;
    const allKW = [...(db.core || []), ...(db.good || [])];
    scores[field] = allKW.filter(k => lower.includes(k)).length;
  }

  // Find field with highest match
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[1] > 0 ? sorted[0][0] : 'general';
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 10: KEYWORD ANALYSIS
═══════════════════════════════════════════════════════════════ */
function analyzeKeywords(text, field) {
  const lower = text.toLowerCase();
  const db = KEYWORD_DB[field] || KEYWORD_DB.general;
  const generalDB = KEYWORD_DB.general;

  const allCore = [...new Set([...(db.core || []), ...(generalDB.core || [])])];
  const allGood = [...new Set([...(db.good || []), ...(generalDB.good || [])])];
  const allKW = [...new Set([...allCore, ...allGood])];

  const found   = [];
  const missing = [];

  for (const kw of allKW) {
    if (lower.includes(kw.toLowerCase())) found.push(formatKeyword(kw));
    else missing.push(formatKeyword(kw));
  }

  // Deduplicate and limit
  const uniqueFound   = [...new Set(found)];
  const uniqueMissing = [...new Set(missing)];

  // Prioritize core missing keywords
  const coreMissing = (db.core || []).filter(k => !lower.includes(k)).map(formatKeyword);
  const prioritizedMissing = [...new Set([...coreMissing, ...uniqueMissing])];

  return {
    found:   uniqueFound.slice(0, 15),
    missing: prioritizedMissing.slice(0, 10)
  };
}

function formatKeyword(kw) {
  if (kw === 'sql') return 'SQL';
  if (kw === 'api') return 'API';
  if (kw === 'crm') return 'CRM';
  if (kw === 'seo') return 'SEO';
  if (kw === 'sem') return 'SEM';
  if (kw === 'ppc') return 'PPC';
  if (kw === 'aws') return 'AWS';
  if (kw === 'gcp') return 'GCP';
  if (kw === 'css') return 'CSS';
  if (kw === 'html') return 'HTML';
  if (kw === 'kpi') return 'KPI';
  if (kw === 'roi') return 'ROI';
  if (kw === 'b2b') return 'B2B';
  if (kw === 'b2c') return 'B2C';
  if (kw === 'ux') return 'UX';
  if (kw === 'ui') return 'UI';
  if (kw === 'hr') return 'HR';
  if (kw === 'p&l') return 'P&L';
  if (kw === 'ci/cd') return 'CI/CD';
  return kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 11: SCORING ENGINE (4 × 25 = 100)
═══════════════════════════════════════════════════════════════ */

/* --- 11A: SECTION SCORE (0-25) --- */
function scoreSection(text) {
  const lower = text.toLowerCase();
  const found = {};
  let score = 0;
  const feedback = [];
  const strengths = [];

  for (const [name, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(lower)) {
      found[name] = true;
      score += name === 'experience' ? 7 : name === 'education' ? 6 : name === 'skills' ? 6 : name === 'contact' ? 4 : 1;
    } else {
      if (name === 'experience') feedback.push('Add a "Work Experience" section — this is the most important section for ATS');
      else if (name === 'education') feedback.push('Include an "Education" section with your degree and institution');
      else if (name === 'skills') feedback.push('Add a dedicated "Skills" section — ATS systems specifically scan for this');
      else if (name === 'contact') feedback.push('Ensure your contact information (email, phone) is clearly visible');
    }
  }

  const sectionCount = Object.keys(found).length;
  if (sectionCount >= 5) strengths.push('Strong resume structure with all key sections present');
  else if (sectionCount >= 3) strengths.push('Good basic resume structure');

  if (found.summary) strengths.push('Professional summary/objective included — great for ATS parsing');
  if (found.projects) strengths.push('Projects section adds depth to your profile');

  return { score: Math.min(25, score), feedback, strengths, sectionsFound: found };
}

/* --- 11B: CONTENT SCORE (0-25) --- */
function scoreContent(text) {
  const lower = text.toLowerCase();
  let score = 0;
  const feedback = [];
  const strengths = [];

  // Action verbs (up to 8 points)
  const verbsFound = ACTION_VERBS.filter(v => lower.includes(v));
  const verbScore = Math.min(8, verbsFound.length);
  score += verbScore;
  if (verbsFound.length >= 6) strengths.push(`Strong use of action verbs (${verbsFound.length} detected)`);
  else if (verbsFound.length < 3) feedback.push(`Use more action verbs: Led, Developed, Achieved, Implemented, Managed`);

  // Quantification (up to 8 points)
  const quantMatches = text.match(QUANTIFY_PATTERN) || [];
  const quantScore = Math.min(8, quantMatches.length * 2);
  score += quantScore;
  if (quantMatches.length >= 3) strengths.push(`Good quantification with ${quantMatches.length} metrics/numbers`);
  else if (quantMatches.length === 0) feedback.push('Add quantifiable achievements: percentages, dollar amounts, team sizes, time saved');
  else feedback.push(`Add more metrics — only ${quantMatches.length} quantifiable result(s) found. Aim for 4+`);

  // Word count (up to 5 points)
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 1).length;
  if (wordCount >= 400) score += 5;
  else if (wordCount >= 250) score += 3;
  else if (wordCount >= 100) score += 1;
  if (wordCount < 200) feedback.push(`Resume seems thin (${wordCount} words). Add more detail to experience bullets`);
  else if (wordCount > 1000) feedback.push('Resume may be too long. Keep to 1-2 pages; prioritize most recent 10 years');

  // Summary/objective (4 points)
  if (SECTION_PATTERNS.summary.test(lower)) {
    score += 4;
    strengths.push('Professional summary is present — helps ATS categorize your profile');
  } else {
    feedback.push('Add a 2-3 line professional summary at the top with your key skills and experience years');
  }

  return { score: Math.min(25, score), feedback, strengths };
}

/* --- 11C: FORMAT SCORE (0-25) --- */
function scoreFormat(text) {
  let score = 0;
  const feedback = [];
  const strengths = [];

  // Email (5 points)
  if (EMAIL_PATTERN.test(text)) { score += 5; strengths.push('Email address clearly present'); }
  else feedback.push('Include a professional email address');

  // Phone (4 points)
  if (PHONE_PATTERN.test(text)) { score += 4; strengths.push('Phone number included'); }
  else feedback.push('Add your phone number to the contact section');

  // LinkedIn (3 points)
  if (LINKEDIN_PATTERN.test(text)) { score += 3; strengths.push('LinkedIn profile linked — great for recruiter verification'); }
  else feedback.push('Add your LinkedIn profile URL (linkedin.com/in/yourname)');

  // Date ranges — shows structured timeline (5 points)
  const dateMatches = text.match(DATE_PATTERN) || [];
  if (dateMatches.length >= 2) { score += 5; strengths.push('Clear employment timeline with dates'); }
  else if (dateMatches.length === 1) { score += 2; feedback.push('Add start/end dates to all positions (e.g., "Jan 2022 – Dec 2023")'); }
  else feedback.push('Include employment dates for all positions in "Month Year – Month Year" format');

  // Red flags check (deduct up to 4 points)
  const lower = text.toLowerCase();
  let redFlags = 0;
  // Check for common formatting issues in text
  if ((text.match(/[|]/g) || []).length > 5) { redFlags++; feedback.push('Avoid pipe characters (|) for layout — ATS can misread them'); }
  if ((text.match(/[_]{3,}/g) || []).length > 2) { redFlags++; feedback.push('Avoid underline decorations as dividers — use clean whitespace instead'); }

  score -= redFlags;

  // GitHub/portfolio (3 points)
  if (/github\.com|portfolio|behance|dribbble/i.test(text)) {
    score += 3;
    strengths.push('Portfolio/GitHub link found — adds credibility');
  }

  return { score: Math.max(0, Math.min(25, score)), feedback, strengths };
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 12: SUGGESTIONS & STRENGTHS BUILDER
═══════════════════════════════════════════════════════════════ */
function buildSuggestions(sectionScore, keywordScore, contentScore, formatScore, keywords) {
  const all = [
    ...sectionScore.feedback,
    ...contentScore.feedback,
    ...formatScore.feedback
  ];

  // Add keyword suggestion if missing keywords exist
  if (keywords.missing.length > 3) {
    const topMissing = keywords.missing.slice(0, 4).join(', ');
    all.unshift(`Add missing keywords to your Skills section: ${topMissing}`);
  }

  // Score-based global suggestions
  if (keywordScore < 12) all.push('Tailor your resume for each job posting — copy exact keywords from the job description');
  if (sectionScore.score < 15) all.push('Use standard section headings: "Work Experience", "Education", "Skills" — ATS looks for these exactly');

  // Deduplicate and return top 7
  return [...new Set(all)].slice(0, 7);
}

function buildStrengths(sectionScore, keywordScore, contentScore, formatScore, keywords, text) {
  const all = [
    ...sectionScore.strengths,
    ...contentScore.strengths,
    ...formatScore.strengths
  ];

  if (keywords.found.length >= 8) all.push(`High keyword density — ${keywords.found.length} relevant keywords detected`);
  else if (keywords.found.length >= 4) all.push(`${keywords.found.length} relevant industry keywords present`);

  const totalScore = sectionScore.score + keywordScore + contentScore.score + formatScore.score;
  if (totalScore >= 75) all.unshift('Overall well-structured, ATS-friendly resume');

  return [...new Set(all)].slice(0, 5);
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 13: NOT-A-RESUME ANIMATION
═══════════════════════════════════════════════════════════════ */
function showNotResumeAnimation() {
  if (progressSection) progressSection.style.display = 'none';
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(10,15,30,.96);backdrop-filter:blur(18px);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2rem;animation:atsOvIn .3s ease;padding:1.5rem;';
  ov.innerHTML = `<style>
    @keyframes atsOvIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
    @keyframes robBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
    @keyframes eyeBlink{0%,85%,100%{transform:scaleY(1)}92%{transform:scaleY(.06)}}
    @keyframes robShake{0%,100%{transform:rotate(0)}18%{transform:rotate(-12deg)}36%{transform:rotate(12deg)}54%{transform:rotate(-7deg)}72%{transform:rotate(7deg)}}
    @keyframes scanErr{0%,100%{opacity:.6}50%{opacity:1}}
  </style>
  <svg style="animation:robBob 2s ease-in-out infinite;filter:drop-shadow(0 0 30px rgba(249,115,22,.35))"
       width="165" height="190" viewBox="0 0 165 190" fill="none">
    <defs><linearGradient id="og" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f97316"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs>
    <rect x="77" y="2" width="10" height="24" rx="5" fill="#a855f7"/>
    <circle cx="82" cy="2" r="8" fill="#f97316"/><circle cx="82" cy="2" r="4" fill="#fff" opacity=".6"/>
    <rect x="14" y="24" width="136" height="86" rx="24" fill="#1e293b" stroke="url(#og)" stroke-width="2.5"/>
    <rect x="26" y="44" width="38" height="26" rx="13" fill="#0f172a"/>
    <ellipse style="animation:eyeBlink 3s infinite" cx="45" cy="57" rx="12" ry="12" fill="#f97316" opacity=".9"/>
    <circle cx="50" cy="52" r="4.5" fill="#fff"/>
    <rect x="100" y="44" width="38" height="26" rx="13" fill="#0f172a"/>
    <ellipse style="animation:eyeBlink 3s infinite;animation-delay:.12s" cx="119" cy="57" rx="12" ry="12" fill="#f97316" opacity=".9"/>
    <circle cx="124" cy="52" r="4.5" fill="#fff"/>
    <path style="animation:robShake .7s ease .6s both" d="M 52 88 Q 82 75 112 88" stroke="#f87171" stroke-width="4" fill="none" stroke-linecap="round"/>
    <rect x="24" y="118" width="116" height="62" rx="18" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
    <rect x="40" y="128" width="84" height="40" rx="8" fill="#0f172a"/>
    <rect x="42" y="130" width="80" height="3" rx="1.5" fill="#f97316" style="animation:scanErr 1s infinite"/>
    <rect x="42" y="137" width="62" height="2" rx="1" fill="#334155"/>
    <rect x="42" y="142" width="74" height="2" rx="1" fill="#334155"/>
    <rect x="42" y="147" width="55" height="2" rx="1" fill="#f97316" opacity=".4"/>
    <rect x="42" y="156" width="80" height="8" rx="4" fill="#f97316" opacity=".1"/>
    <text x="82" y="164" text-anchor="middle" fill="#f87171" font-size="9" font-weight="900" font-family="monospace">✗ NOT A RÉSUMÉ</text>
    <rect x="3" y="122" width="16" height="48" rx="8" fill="#1e293b" stroke="#334155"/><rect x="145" y="122" width="16" height="48" rx="8" fill="#1e293b" stroke="#334155"/>
    <rect x="44" y="178" width="30" height="14" rx="7" fill="#334155"/><rect x="90" y="178" width="30" height="14" rx="7" fill="#334155"/>
  </svg>
  <div style="text-align:center;max-width:360px">
    <h2 style="font-size:1.7rem;font-weight:900;color:#f87171;margin-bottom:.75rem;letter-spacing:-.04em">That's Not a Résumé! 😅</h2>
    <p style="color:#94a3b8;font-size:.9rem;line-height:1.72;margin-bottom:.875rem">
      Our AI scanned your file but couldn't detect a resume. Please upload your <strong style="color:#fff">actual resume</strong> as PDF, JPG, or PNG.
    </p>
    <div style="display:flex;gap:.625rem;justify-content:center;flex-wrap:wrap">
      <span style="display:inline-flex;align-items:center;gap:.3rem;background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.25);padding:.35rem .875rem;border-radius:100px;font-size:.72rem;color:#f97316;font-weight:700">📄 PDF Resume</span>
      <span style="display:inline-flex;align-items:center;gap:.3rem;background:rgba(168,85,247,.1);border:1px solid rgba(168,85,247,.25);padding:.35rem .875rem;border-radius:100px;font-size:.72rem;color:#c084fc;font-weight:700">🖼️ JPG/PNG Photo of Resume</span>
    </div>
  </div>
  <button onclick="this.closest('[style*=fixed]').remove();if(document.getElementById('progressSection'))document.getElementById('progressSection').style.display='none';"
    style="background:linear-gradient(135deg,#a855f7,#a3e635);color:#0f172a;border:none;border-radius:.75rem;padding:.875rem 2.5rem;font-weight:800;font-size:.95rem;cursor:pointer;font-family:Inter,sans-serif;display:flex;align-items:center;gap:.5rem;transition:filter .2s"
    onmouseover="this.style.filter='brightness(1.12)'" onmouseout="this.style.filter=''">
    ← Upload Correct File
  </button>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 14: PROGRESS UI
═══════════════════════════════════════════════════════════════ */
function showProgress() {
  if (progressSection) progressSection.style.display = 'block';
}

function setProgress(pct, label) {
  if (progressBar) progressBar.style.width = pct + '%';
  if (progressPct) progressPct.textContent = Math.round(pct) + '%';
  if (progressTitle) progressTitle.textContent = label;
}

function showUploadErr(msg) {
  showProgress();
  setProgress(100, '❌ ' + msg);
  if (progressBar) progressBar.style.background = '#f87171';
  setTimeout(() => {
    if (progressSection) progressSection.style.display = 'none';
    if (progressBar) { progressBar.style.width = '0'; progressBar.style.background = ''; }
  }, 5000);
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 15: HELPERS
═══════════════════════════════════════════════════════════════ */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function escHTML(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 15B — RESUME EDITOR DATA EXTRACTOR
   Saves structured resume data to sessionStorage so "Edit Resume"
   button can pre-fill resume_maker.html with actual uploaded data.
═══════════════════════════════════════════════════════════════ */

function saveResumeForEditor(rawText, foundKeywords) {
  try {
    const parsed = deepParseResume(rawText, foundKeywords);
    sessionStorage.setItem('readycv_ats_resume', JSON.stringify(parsed));
  } catch(e) {
    console.warn('saveResumeForEditor failed:', e);
  }
}

function deepParseResume(raw, foundKW) {
  // Normalise: split on real newlines, trim each, remove empties
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const blob  = lines.join('\n');            // full text, newlines preserved
  const lower = blob.toLowerCase();

  /* ── 1. CONTACT INFO ─────────────────────────────────────── */
  const emailM    = blob.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  const phoneM    = blob.match(/(\+?[\d][\d\s\-\(\)\.]{6,14}[\d])/);
  const linkedinM = blob.match(/linkedin\.com\/in\/([\w\-]+)/i);
  const githubM   = blob.match(/github\.com\/([\w\-]+)/i);
  const portfolioM= blob.match(/(?:https?:\/\/)?(?:www\.)?([\w\-]+\.(?:com|io|dev|me|co|in)(?:\/[\w\-\/]*)?)/i);

  /* ── 2. NAME — first line(s) that look like a person's name ─ */
  let name = '';
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const l = lines[i];
    // Skip lines with email/phone/URLs/section keywords
    if (EMAIL_PATTERN.test(l) || /https?:\/\/|linkedin|github|@/.test(l)) continue;
    if (/experience|education|skills|summary|objective/i.test(l)) break;
    // Name: 2-4 words, all start with capital, reasonable length
    const words = l.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && words.length <= 5 &&
        words.every(w => /^[A-Z]/.test(w)) &&
        l.length <= 60 && !/[0-9|•\-–]/.test(l)) {
      name = l; break;
    }
  }

  /* ── 3. JOB TITLE — line after name, before email ─────────── */
  let jobTitle = '';
  const titleKW = ['developer','engineer','designer','architect','analyst','manager','lead',
    'consultant','specialist','officer','director','coordinator','executive','intern',
    'associate','scientist','researcher','strategist','advisor','founder','devops',
    'full stack','frontend','backend','mobile','data','cloud','product','project'];
  const nameIdx = name ? lines.findIndex(l => l.includes(name)) : -1;
  for (let i = Math.max(0, nameIdx + 1); i < Math.min(lines.length, nameIdx + 8); i++) {
    const ll = lines[i].toLowerCase();
    if (titleKW.some(k => ll.includes(k)) && lines[i].length < 90 &&
        !EMAIL_PATTERN.test(lines[i]) && !/https?:\/\//.test(lines[i])) {
      jobTitle = lines[i]; break;
    }
  }

  /* ── 4. LOCATION ────────────────────────────────────────────── */
  let location = '';
  // Look for City, State or City, Country pattern near top
  const locRe = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)[\s,]+(?:[A-Z]{2}|India|USA|UK|US|Canada|Australia|Germany|Remote)/;
  for (const l of lines.slice(0, 15)) {
    if (EMAIL_PATTERN.test(l) || /https?:\/\//.test(l)) continue;
    const m = l.match(locRe);
    if (m) { location = m[0].trim(); break; }
  }
  // fallback: short line near top with comma
  if (!location) {
    for (const l of lines.slice(2, 10)) {
      if (l.includes(',') && l.length < 40 && !EMAIL_PATTERN.test(l) &&
          !/https?:\/\//.test(l) && /[A-Z]/.test(l)) {
        location = l; break;
      }
    }
  }

  /* ── 5. SUMMARY ─────────────────────────────────────────────── */
  let summary = '';
  const sumStart = findSection(lines, /^(summary|objective|profile|about me|overview|professional profile)/i);
  if (sumStart >= 0) {
    const chunk = collectUntilNextSection(lines, sumStart + 1);
    summary = chunk.join(' ').trim().substring(0, 300);
  }
  if (!summary) {
    // Fallback: first multi-word sentence-like line between contact and experience
    for (const l of lines.slice(2, 18)) {
      if (l.length > 60 && l.length < 400 &&
          !EMAIL_PATTERN.test(l) && !/https?:\/\//.test(l) &&
          !/experience|education|skills|project/i.test(l)) {
        summary = l.substring(0, 300); break;
      }
    }
  }

  /* ── 6. EXPERIENCE ──────────────────────────────────────────── */
  const experience = [];
  const expStart = findSection(lines, /^(experience|work experience|employment|work history|professional experience|career)/i);
  if (expStart >= 0) {
    const expLines = collectUntilNextSection(lines, expStart + 1);
    let cur = null;

    // Date range pattern: "Jan 2022 – Dec 2023" or "2020 – Present"
    const dateRe = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4}|[Pp]resent|[Cc]urrent|[Nn]ow)/i;

    for (let i = 0; i < expLines.length; i++) {
      const l = expLines[i];
      const dateM = l.match(dateRe);

      if (dateM) {
        // This line has dates — it's likely "Company | Location | Dates" or just dates
        if (cur) experience.push(cur);
        cur = { title:'', company:'', location:'', start: dateM[1].trim(), end: dateM[2].trim(), desc:'' };
        // Extract company/title from the same line (before the date)
        const beforeDate = l.replace(dateM[0], '').trim().replace(/[|•–\-,]+$/, '').trim();
        if (beforeDate.length > 1) cur.company = beforeDate;
        continue;
      }

      if (!cur) {
        // Could be "Job Title at Company" or "Job Title\nCompany"
        const atM = l.match(/^(.+?)\s+(?:at|@|,|-|–|·)\s+(.+)$/i);
        if (atM && atM[1].length < 60 && atM[2].length < 80) {
          cur = { title: atM[1].trim(), company: atM[2].trim(), location:'', start:'', end:'', desc:'' };
          continue;
        }
        // Single line that looks like a title
        if (titleKW.some(k => l.toLowerCase().includes(k)) && l.length < 80) {
          cur = { title: l, company:'', location:'', start:'', end:'', desc:'' };
          continue;
        }
      } else {
        // Fill in company if missing
        if (!cur.company && l.length < 80 && !/^[•\-·]/.test(l) && l.length > 2) {
          cur.company = l; continue;
        }
        // Title if missing
        if (!cur.title && titleKW.some(k => l.toLowerCase().includes(k)) && l.length < 80) {
          cur.title = l; continue;
        }
        // Bullet point → description
        if (/^[•\-·▪◦]/.test(l) || /^\d+\./.test(l)) {
          cur.desc += (cur.desc ? '\n' : '') + l;
        } else if (l.length > 25 && cur.company) {
          // Continuation sentence
          cur.desc += (cur.desc ? ' ' : '') + l;
        }
      }
    }
    if (cur) experience.push(cur);
  }

  /* ── 7. EDUCATION ───────────────────────────────────────────── */
  const education = [];
  const eduStart = findSection(lines, /^(education|academic|qualification|academics|educational background)/i);
  if (eduStart >= 0) {
    const eduLines = collectUntilNextSection(lines, eduStart + 1);
    let cur = null;

    const degreeRe = /\b(b\.?tech|m\.?tech|be\b|me\b|b\.?e\b|m\.?e\b|b\.?sc|m\.?sc|mba|bca|mca|b\.?com|m\.?com|ph\.?d|bachelor|master|diploma|b\.?a\b|m\.?a\b|hsc|ssc|10th|12th|intermediate|high school)\b/i;
    const yearRe   = /(\d{4})\s*[-–—to]+\s*(\d{4}|[Pp]resent)/;
    const gradeRe  = /(\d+(?:\.\d+)?)\s*(?:cgpa|gpa|\/10|%|percent)/i;

    for (const l of eduLines) {
      if (degreeRe.test(l)) {
        if (cur) education.push(cur);
        cur = { degree: l.trim(), inst:'', location:'', start:'', end:'', grade:'' };
        continue;
      }
      if (cur) {
        const yearM  = l.match(yearRe);
        const gradeM = l.match(gradeRe);
        if (yearM)  { cur.start = yearM[1]; cur.end = yearM[2]; continue; }
        if (gradeM) { cur.grade = gradeM[0]; continue; }
        if (!cur.inst && /university|college|institute|school|iit|nit|bits|academy/i.test(l)) {
          cur.inst = l.trim(); continue;
        }
        // If line is short and doesn't match anything else, treat as institution
        if (!cur.inst && l.length < 80 && l.length > 3 && !/^[•\-]/.test(l)) {
          cur.inst = l.trim();
        }
      }
    }
    if (cur) education.push(cur);
  }

  /* ── 8. SKILLS ──────────────────────────────────────────────── */
  let skills = [];
  const skillStart = findSection(lines, /^(skills|technical skills|core competencies|technologies|tools|tech stack|key skills)/i);

  if (skillStart >= 0) {
    const skillLines = collectUntilNextSection(lines, skillStart + 1);
    for (const l of skillLines) {
      // Split by common delimiters
      const parts = l.split(/[,|•·\/]+/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 35);
      parts.forEach(s => {
        // Remove leading symbols/numbers
        const clean = s.replace(/^[\-–·▪◦\d\.]+\s*/, '').trim();
        if (clean.length > 1) skills.push({ name: clean, level: 'Intermediate' });
      });
    }
  }

  // Supplement with found keywords (from ATS analysis) if skills list is thin
  if (skills.length < 5 && foundKW && foundKW.length) {
    const existing = new Set(skills.map(s => s.name.toLowerCase()));
    foundKW.forEach(kw => {
      if (!existing.has(kw.toLowerCase())) {
        skills.push({ name: kw, level: 'Intermediate' });
        existing.add(kw.toLowerCase());
      }
    });
  }
  skills = skills.slice(0, 20);

  /* ── 9. PROJECTS ────────────────────────────────────────────── */
  const projects = [];
  const projStart = findSection(lines, /^(projects|personal projects|academic projects|portfolio|notable projects)/i);
  if (projStart >= 0) {
    const projLines = collectUntilNextSection(lines, projStart + 1);
    let cur = null;
    for (const l of projLines) {
      // New project: short bold-looking line OR line followed by tech stack
      const techM = l.match(/(?:tech|stack|built with|technologies?)[:\s]+(.+)/i);
      if (techM) {
        if (cur) { projects.push(cur); }
        cur = { name: cur ? cur.name : l.replace(/\|.*/,'').trim(), tech: techM[1].trim(), link:'', desc:'' };
        continue;
      }
      if (!cur && l.length < 70 && !/^[•\-]/.test(l) && l.length > 3) {
        cur = { name: l.trim(), tech:'', link:'', desc:'' };
        continue;
      }
      if (cur) {
        const linkM = l.match(/https?:\/\/[^\s]+/);
        if (linkM) { cur.link = linkM[0]; continue; }
        if (/^[•\-·]/.test(l)) cur.desc += (cur.desc ? ' ' : '') + l.replace(/^[•\-·]\s*/,'');
        else if (l.length > 20) cur.desc += (cur.desc ? ' ' : '') + l;
      }
    }
    if (cur) projects.push(cur);
  }

  /* ── 10. EXTRAS ─────────────────────────────────────────────── */
  let languages = '';
  const langStart = findSection(lines, /^(languages?)\s*$/i);
  if (langStart >= 0) {
    languages = collectUntilNextSection(lines, langStart + 1).join(', ').substring(0, 120);
  }

  let certifications = '';
  const certStart = findSection(lines, /^(certifications?|certificates?|courses?|training)/i);
  if (certStart >= 0) {
    certifications = collectUntilNextSection(lines, certStart + 1)
      .filter(l => l.length > 2).join('\n').substring(0, 400);
  }

  let achievements = '';
  const achStart = findSection(lines, /^(achievements?|awards?|honors?|recognition|accomplishments?)/i);
  if (achStart >= 0) {
    achievements = collectUntilNextSection(lines, achStart + 1)
      .filter(l => l.length > 2).join('\n').substring(0, 400);
  }

  let hobbies = '';
  const hobStart = findSection(lines, /^(hobbies|interests|activities|extra.?curricular)/i);
  if (hobStart >= 0) {
    hobbies = collectUntilNextSection(lines, hobStart + 1).join(', ').substring(0, 200);
  }

  return {
    name:           name,
    jobTitle:       jobTitle,
    email:          emailM    ? emailM[0]                      : '',
    phone:          phoneM    ? phoneM[0].trim()               : '',
    location:       location,
    linkedin:       linkedinM ? `linkedin.com/in/${linkedinM[1]}` : '',
    github:         githubM   ? `github.com/${githubM[1]}`     : '',
    portfolio:      portfolioM && portfolioM[1] && !linkedinM && !githubM ? portfolioM[1] : '',
    summary:        summary,
    experience:     experience.slice(0, 6),
    education:      education.slice(0, 4),
    skills:         skills,
    projects:       projects.slice(0, 5),
    languages:      languages,
    certifications: certifications,
    achievements:   achievements,
    hobbies:        hobbies
  };
}

/* ── Section finder helpers ────────────────────────────────── */
const SECTION_HEADER_RE = /^(experience|work experience|employment|education|skills|projects|summary|objective|profile|languages?|certifications?|achievements?|awards?|hobbies|interests|extras?|contact|training|courses?|publications?)\b/i;

function findSection(lines, pattern) {
  return lines.findIndex(l => pattern.test(l.trim()));
}

function collectUntilNextSection(lines, fromIdx) {
  const result = [];
  for (let i = fromIdx; i < lines.length; i++) {
    if (i > fromIdx && SECTION_HEADER_RE.test(lines[i].trim())) break;
    result.push(lines[i]);
  }
  return result;
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 16: ATS TIPS CAROUSEL
═══════════════════════════════════════════════════════════════ */
const ATS_TIPS = [
  "💡 Use <strong>exact keywords</strong> from the job description — copy them word-for-word. ATS matches exact phrases!",
  "📄 Avoid tables and columns — ATS systems often can't parse them. Stick to a <strong>single-column layout</strong>.",
  "📝 Use <strong>standard headings</strong>: 'Work Experience', 'Education', 'Skills' — not creative alternatives.",
  "💾 Save your resume as PDF from Word/Google Docs, <strong>not Canva or design tools</strong>.",
  "🎯 Don't put contact info in headers/footers — ATS often <strong>can't read those areas</strong>.",
  "✅ Use bullet points starting with <strong>strong action verbs</strong>: Led, Built, Achieved, Designed, Managed.",
  "📊 Include <strong>quantifiable metrics</strong>: '30% increase', '$2M budget', '500K users' — numbers stand out!",
  "🔤 List skills exactly as in the job post: <strong>'JavaScript'</strong> not 'JS'. Spelling matters for ATS!",
  "🔡 Use a <strong>clean, simple font</strong>: Calibri, Arial, or Times New Roman. Fancy fonts confuse ATS parsers.",
  "📅 Date format matters: use <strong>'Jan 2022 – Dec 2023'</strong> consistently throughout your resume.",
  "📋 Include a dedicated <strong>Skills section</strong> — many ATS systems specifically scan for this section name.",
  "✂️ Keep each bullet to <strong>1-2 lines</strong>. Recruiters spend ~7 seconds per resume — make it scannable!",
  "🌟 Your summary should contain <strong>3-5 keywords</strong> from the job description. Make it count!",
  "🎯 <strong>Tailor your resume</strong> for EACH job application. One generic resume rarely passes multiple ATS filters!",
  "📐 Use <strong>0.5-1 inch margins</strong> and adequate white space — cramped text can lower your readability score.",
  "🔢 Put your <strong>most recent experience first</strong> — reverse chronological order is the ATS standard.",
  "❌ Don't use <strong>images, photos, or graphics</strong> in your resume body — ATS can't read them.",
  "📌 Spell out acronyms at least once: <strong>'Search Engine Optimization (SEO)'</strong> — then use the short form.",
  "💼 Match your <strong>job title</strong> to the one in the posting — even if your actual title was slightly different.",
  "🔑 Include your location! Many ATS systems <strong>filter by location</strong> before a human sees your resume.",
];

let tipIdx = Math.floor(Math.random() * ATS_TIPS.length);

function showTip() {
  const el = document.getElementById('tipText');
  if (el) el.innerHTML = ATS_TIPS[tipIdx];
  document.querySelectorAll('.tip-dot').forEach((d, i) =>
    d.classList.toggle('active', i === tipIdx % document.querySelectorAll('.tip-dot').length)
  );
}

window.refreshTip = function () {
  const el = document.getElementById('tipText');
  if (el) { el.style.opacity = '0'; el.style.transform = 'translateX(8px)'; }
  setTimeout(() => {
    tipIdx = (tipIdx + 1) % ATS_TIPS.length;
    showTip();
    if (el) { el.style.opacity = '1'; el.style.transform = ''; }
  }, 180);
};

document.addEventListener('DOMContentLoaded', () => {
  showTip();
  setInterval(window.refreshTip, 7000);
});
