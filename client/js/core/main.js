/*
   ReadyCVs — chatbot.js
   Aman Rawat — Career Advisor 
  */
const ADMIN_EMAIL = "gehuproject0@gmail.com";

/* FAQ database — same answers as Help page */
const FAQ_DB = [
  { q:"What is ReadyCV?", a:"ReadyCV is an AI-powered resume builder that helps you create professional, ATS-optimized resumes in minutes. Fill your details, choose from 6 templates, and download as PDF — all free! 🚀" },
  { q:"Is ReadyCV free?", a:"Yes! The core resume builder, all 6 templates, and PDF download are completely free. AI features (AI Writer, ATS Checker) need the backend server with an Anthropic API key. 💸" },
  { q:"Do I need an account?", a:"Nope! You can build and download without creating an account. But creating one lets you save progress, track ATS scores, and access your resume from any device. 📱" },
  { q:"How do I download my resume?", a:"Click the 'Download PDF' button in the top-right of the Resume Builder. Your browser's print dialog opens — select 'Save as PDF' and you're done! Use Chrome for best results. 📄" },
  { q:"Will my data be lost if I switch templates?", a:"Absolutely not! Switching templates only changes the visual design — all your data stays exactly as you entered it. Templates are just different looks for the same info. 🎨" },
  { q:"How do I add multiple work experiences?", a:"Go to the Experience tab and click 'Add Experience'. You can add as many as needed. Each card can be collapsed/expanded, and deleted with the trash icon. ✨" },
  { q:"My resume data disappeared!", a:"Your data auto-saves in localStorage every 6 seconds. Open the Resume Builder in the same browser — your draft should restore automatically with a notification. 💾" },
  { q:"What is ATS?", a:"ATS (Applicant Tracking System) is software used by 98% of large companies to automatically screen resumes before a human sees them. A high score = higher chance of getting interviews! 🤖" },
  { q:"What file formats for ATS Checker?", a:"You can upload PDF, JPG, and PNG files up to 10MB. PDF is recommended. The AI reads your actual resume content — random images will be rejected." },
  { q:"How do I improve my ATS score?", a:"Use keywords from the job description, stick to standard headings (Work Experience, Education, Skills), avoid tables/graphics, and use a clean PDF. Our ATS Checker gives specific suggestions! 🎯" },
  { q:"How does AI Resume Writer work?", a:"Two modes: Bullet Points mode generates 5 powerful bullets from your description. Full Resume mode generates a complete resume from a paragraph about yourself — all fields auto-filled! ✨" },
  { q:"How to create an account?", a:"Click 'Log In' in the navigation, switch to 'Sign Up' tab, enter your name/email/password. Or use 'Continue with Google' for instant signup! 🔐" },
  { q:"How to change profile picture?", a:"On your Profile page, click the camera icon on your avatar. Select any image — it updates everywhere instantly! 📸" },
  { q:"Is my data safe?", a:"Yes! Auth uses Firebase by Google. Resume data stays in your browser. ATS-scanned files are processed and immediately discarded — never stored. We never sell your data. 🔒" },
  { q:"Who built ReadyCV?", a:"Team ReadyCV — passionate students from GEHU (Graphic Era Hill University)! We built it to make professional resume building accessible to everyone. Visit the Team page to meet us! 👥" },
  { q:"How to contact the team?", a:"Email us at gehuproject0@gmail.com — we reply within 24-48 hours. Or chat with me (Aman Rawat) right here for instant answers! I'm always around. 😊" },
  { q:"Best resume length?", a:"1 page for 0-5 years experience, 2 pages for 5+ years. Every line must add value. Recruiters spend ~7 seconds on a resume, so make it count! ⏱️" },
  { q:"How to write a good summary?", a:"2-3 sentences: start with years of experience + field, mention your top 2-3 skills, end with your value/goal. Example: '4-year frontend dev specializing in React, passionate about performance optimization.' ✍️" },
  { q:"What keywords should I use?", a:"Use exact keywords from the job description — copy them word-for-word. Spell them correctly (JavaScript not JS). List skills in a dedicated Skills section for best ATS detection. 🎯" },
];

const QUICK_SUGS = [
  "What is ATS? 🤖",
  "How to improve my score?",
  "Good summary tips?",
  "Best resume length?",
  "How to use AI Writer?",
  "Who built ReadyCV?",
  "What keywords should I use?",
  "Do I need an account?",
  "What is ReadyCV?",
  "Will my data be lost if I switch templates?",
  "Is my data safe?",
  "How do I download my resume?",
  "What file formats for ATS Checker?",
  "How does AI Resume Writer work?",
  "How to contact the team?",
  "How do I add multiple work experiences?",
  "How to change profile picture?",
];

const SYS_PROMPT = `You are Aman Rawat, a friendly expert career advisor at ReadyCV — an AI-powered resume builder website (readycv).
Personality: Warm, encouraging, concise. Use emojis occasionally. Speak like a helpful knowledgeable friend.
Help with: resume writing tips, ATS optimization, career advice, job hunting, interview prep, ReadyCV features.
Keep answers to 2-4 sentences unless detailed explanation is needed.
Never say you are an AI — you are Aman Rawat from Team ReadyCV, GEHU student.
If users ask unrelated questions, gently redirect to career/resume topics.`;

let chatHistory = [];
let chatOpen    = false;
let refreshIdx  = 0;

/* ── Self-initialize widget ─────────────────────────────── */
(function init() {
  if (document.getElementById('rcv-fab')) return;

  // Inject CSS if not already linked
  if (!document.querySelector('link[href="css/main.css"]')) {
    const lnk = document.createElement('link');
    lnk.rel  = 'stylesheet'; lnk.href = 'css/main.css';
    document.head.appendChild(lnk);
  }

  document.body.insertAdjacentHTML('beforeend', `
    <button class="chatbot-fab" id="rcv-fab" onclick="rcvToggle()" title="Chat with Aman Rawat">
      <span class="material-symbols-outlined">chat</span>
      <span class="fab-badge" id="rcv-badge">1</span>
    </button>

    <div class="chatbot-window" id="rcv-win">
      <div class="chat-header">
        <div class="chat-avatar">A</div>
        <div class="chat-header-info">
          <p class="chat-name">Aman Rawat</p>
          <p class="chat-status"><span class="status-dot"></span>Career Advisor · ReadyCV</p>
        </div>
        <button class="chat-header-btn" onclick="rcvRefresh()" title="New question suggestion" style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#94a3b8;width:30px;height:30px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;margin-right:.25rem;">
          <span class="material-symbols-outlined" style="font-size:.95rem">refresh</span>
        </button>
        <button class="chat-close" onclick="rcvToggle()">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="chat-messages" id="rcv-msgs">
        <div class="chat-msg bot">
          <div class="msg-bubble">Hey! 👋 I'm <strong>Aman Rawat</strong>, your career advisor at ReadyCV. Ask me anything about resumes, ATS, or career advice!</div>
        </div>
      </div>
      <div class="chat-suggestions" id="rcv-sugs"></div>
      <div class="chat-input-row">
        <input type="text" id="rcv-input" class="chat-input" placeholder="Ask me anything..."
          onkeydown="if(event.key==='Enter'){event.preventDefault();rcvSend();}">
        <button class="chat-send" onclick="rcvSend()">
          <span class="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>`);

  buildSuggestions();

  // Outside click closes
  document.addEventListener('click', e => {
    const w = document.getElementById('rcv-win');
    const f = document.getElementById('rcv-fab');
    if (chatOpen && w && !w.contains(e.target) && !f?.contains(e.target)) rcvToggle();
  });
})();

function buildSuggestions() {
  const box = document.getElementById('rcv-sugs');
  if (!box) return;
  box.innerHTML = '';
  QUICK_SUGS.forEach(s => {
    const b = document.createElement('button');
    b.className   = 'chat-sug'; b.textContent = s;
    b.onclick     = () => { document.getElementById('rcv-input').value = s; rcvSend(); };
    box.appendChild(b);
  });
}

//chat with Us,
function openChatSafe() {
  const interval = setInterval(() => {
    const chat = document.getElementById('rcv-win');

    if (chat) {
      chat.classList.add('open'); // open chat
      clearInterval(interval);
    }
  }, 100);
}

/* ── Toggle ─────────────────────────────────────────────── */
window.rcvToggle = window.toggleChat = function() {
  const w = document.getElementById('rcv-win');
  const b = document.getElementById('rcv-badge');
  chatOpen = !chatOpen;
  w?.classList.toggle('open', chatOpen);
  if (chatOpen) { if(b) b.style.display='none'; setTimeout(()=>document.getElementById('rcv-input')?.focus(),300); }
};

/* Refresh — show FAQ question suggestion  */
window.rcvRefresh = function() {

  // 1. Messages reset
  const msgs = document.getElementById('rcv-msgs');
  msgs.innerHTML = `
    <div class="chat-msg bot">
      <div class="msg-bubble">
        Hey! 👋 I'm <strong>Aman Rawat</strong>, your career advisor at ReadyCV. Ask me anything!
      </div>
    </div>
  `;

  // 2. History reset
  chatHistory = [];

  // 3. Suggestions wapas
  const sugBox = document.getElementById('rcv-sugs');
  sugBox.style.display = 'flex';
  buildSuggestions();

  // 4. Input clear
  const inp = document.getElementById('rcv-input');
  if (inp) inp.value = '';
};

/* ── Send message ───────────────────────────────────────── */
window.rcvSend = async function() {
  const inp = document.getElementById('rcv-input');
  const txt = inp?.value.trim();
  if (!txt) return;

  inp.value = '';
  addMsg(txt, 'user');

  chatHistory.push({ role:'user', content:txt });
  document.getElementById('rcv-sugs').style.display = 'none';

  const tid = showTyping();

  // Check FAQ DB first (instant answer for known Qs)
  const faqMatch = FAQ_DB.find(f =>
    txt.toLowerCase().includes(f.q.toLowerCase().slice(0,-1).substring(0,15))
  );

  if (faqMatch && txt.length < 60) {
    await sleep(600);
    removeEl(tid);
    chatHistory.push({ role:'assistant', content:faqMatch.a });
    addMsg(faqMatch.a, 'bot');
    document.getElementById('rcv-sugs').style.display = 'flex';
    buildSuggestions();
    return;
  }

 removeEl(tid);

// direct reply without API
await sleep(600);
  removeEl(tid);

  let reply = smartFallback(txt);

  chatHistory.push({ role:'assistant', content:reply });
  addMsg(reply, 'bot');
  document.getElementById('rcv-sugs').style.display = 'flex';
  buildSuggestions();
};

/* ── Smart fallback ─────────────────────────────────────── */
function smartFallback(t) {
  t = t.toLowerCase();
  const faq = FAQ_DB.find(f =>
    t.split(' ').some(w => w.length > 3 && f.q.toLowerCase().includes(w))
  );
  if (faq) return faq.a;
  if (t.match(/hi|hello|hey|namaste/)) return "Hey! 👋 I'm Aman Rawat — your career advisor at ReadyCV. What resume or job question can I help you with today?";
  if (t.includes('thank')) return "You're welcome! 😊 All the best with your job search. You've got this! 💪";
  if (t.includes('I am confused about my career'))
  return "That’s completely normal! 😊 Start by identifying your interests, strengths, and what kind of work excites you. I can help you choose a clear path — just tell me what you like or have studied. 🎯";
  if (t.includes('resume') || t.includes('cv')) 
  return "Sure! 📄 A strong resume should be clear, short, and achievement-focused. Want me to help you build one step-by-step? 🚀";
  if (t.includes('job') || t.includes('fresher'))
  return "Getting your first job can be tough 😅 Focus on skills + projects + a strong resume. Consistency is the key — don’t give up! 💪";
  if (t.includes('skill'))
  return "🔥 High-demand skills: Web Dev, AI tools, Data Analysis, Communication. Pick one, practice daily, and build projects!";
  if (t.includes('life') || t.includes('motivation'))
  return "Life tip 💡: Don’t wait for perfect timing. Start small, stay consistent, and improvement will follow automatically. 🚀";
  if (t.includes('joke') || t.includes('fun'))
  return "😂 Joke: Why don’t programmers like nature? Too many bugs! 🐛";
  return "Great question! I'd love to help. Could you give me a bit more context? I specialize in resumes, ATS optimization, and career advice — here to make your job search easier! 🎯";
}


/* ── DOM helpers ─────────────────────────────────────────── */
function addMsg(text, role) {
  const el = document.getElementById('rcv-msgs'); if (!el) return;
  const d  = document.createElement('div'); d.className = 'chat-msg ' + role;
  d.innerHTML = `<div class="msg-bubble">${esc(text).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}</div>`;
  el.appendChild(d); el.scrollTop = el.scrollHeight;
}
function showTyping() {
  const el = document.getElementById('rcv-msgs'); if (!el) return null;
  const id = 'rt'+Date.now(); const d = document.createElement('div');
  d.className='chat-msg bot msg-typing'; d.id=id;
  d.innerHTML='<div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  el.appendChild(d); el.scrollTop=el.scrollHeight; return id;
}
function removeEl(id) { document.getElementById(id)?.remove(); }
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

