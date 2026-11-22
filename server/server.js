require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express    = require('express');
const cors       = require('cors');
const multer     = require('multer');
const fs         = require('fs');
const path       = require('path');
const Anthropic  = require('@anthropic-ai/sdk');

const app    = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
const PORT   = process.env.PORT || 3001;
const CONFIG_FILE = path.join(__dirname, 'config.json');

/* Load / Save config */
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch {}
  return { apiKey: process.env.ANTHROPIC_API_KEY || '' };
}
function saveConfig(cfg) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

let config = loadConfig();

function getClient() {
  if (!config.apiKey) throw new Error('API key not set. Go to Settings and add your Anthropic API key.');
  return new Anthropic({ apiKey: config.apiKey });
}

/* Middleware  */
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, '..', 'client'))); // Serve frontend files

/*  API KEY MANAGEMENT */
app.post('/api/set-key', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    return res.status(400).json({ error: 'Invalid API key format. Must start with sk-ant-' });
  }
  config.apiKey = apiKey.trim();
  saveConfig(config);
  res.json({ ok: true, message: 'API key saved successfully!' });
});

app.get('/api/key-status', (req, res) => {
  res.json({ hasKey: !!config.apiKey, keyHint: config.apiKey ? config.apiKey.slice(0,12) + '...' : '' });
});

/* AI RESUME WRITER — Generate bullet points */
app.post('/api/ai-write', async (req, res) => {
  const { prompt, sectionType = 'experience', count = 5 } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const client = getClient();
    const systemPrompt = `You are an expert resume writer with 15+ years of experience helping professionals land their dream jobs. 
You specialize in writing ATS-optimized, impactful resume content.

Generate exactly ${count} compelling bullet points for a resume "${sectionType}" section.

Rules:
1. Start EVERY bullet with a strong action verb (Led, Architected, Spearheaded, Designed, Optimized, Delivered, etc.)
2. Include specific metrics/numbers wherever possible (%, $, time, team size, scale)
3. Use industry-standard keywords that pass ATS systems
4. Keep each bullet to 1-2 lines maximum
5. Make achievements sound impressive and quantifiable
6. Format: each bullet on its own line, starting with •
7. Return ONLY the bullets, no intro text, no numbering`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Write ${sectionType} resume bullets for: "${prompt}"` }]
    });

    const text = message.content.map(c => c.text || '').join('');
    res.json({ ok: true, content: text, type: sectionType });
  } catch (err) {
    console.error('AI write error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* AI RESUME FROM DESCRIPTION — Generate full resume data */
app.post('/api/ai-full-resume', async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Description required' });

  try {
    const client = getClient();
    const systemPrompt = `You are an expert resume writer. Based on the user's description, generate complete resume data as a JSON object.
Return ONLY valid JSON with this exact structure:
{
  "name": "string",
  "jobTitle": "string", 
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "github": "string",
  "portfolio": "string",
  "summary": "string (2-3 compelling sentences)",
  "experience": [{ "title": "string", "company": "string", "location": "string", "start": "string", "end": "string", "desc": "string (3-4 bullet points starting with •)" }],
  "education": [{ "degree": "string", "inst": "string", "location": "string", "start": "string", "end": "string", "grade": "string" }],
  "skills": [{ "name": "string", "level": "Expert|Advanced|Intermediate|Beginner" }],
  "projects": [{ "name": "string", "tech": "string", "link": "string", "desc": "string" }],
  "languages": "string",
  "certifications": "string",
  "achievements": "string",
  "hobbies": "string"
}
Make all content professional, ATS-optimized, and impressive. Fill in realistic details based on what's provided.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: description }]
    });

    const text = message.content.map(c => c.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);
    res.json({ ok: true, data });
  } catch (err) {
    console.error('Full resume error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ATS SCORE — Analyze resume file */
app.post('/api/ats-score', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const { mimetype, buffer, originalname } = req.file;
  const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  if (!allowed.includes(mimetype)) {
    return res.status(400).json({
      error: 'not_resume',
      message: 'Only PDF, JPG, PNG files allowed. Please upload your resume.'
    });
  }

  try {
    const client = getClient();
    const base64 = buffer.toString('base64');

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer with deep knowledge of hiring practices.
IMPORTANT: Only analyze actual resumes. If the file is not a resume (e.g., random image, document, etc.), return {"notResume": true}.

For actual resumes, return a JSON object:
{
  "notResume": false,
  "score": <number 0-100, MUST be accurate based on actual content>,
  "missingKeywords": [<5-8 important missing keywords specific to their field>],
  "foundKeywords": [<6-10 keywords actually found in the resume>],
  "suggestions": [<5-7 specific, actionable improvement suggestions based on what you actually see>],
  "strengths": [<3-5 things genuinely done well in THIS resume>],
  "field": "<detected job field, e.g. Software Engineering, Marketing, Finance>",
  "scoreBreakdown": {
    "keywords": <0-25>,
    "formatting": <0-25>,
    "content": <0-25>,
    "readability": <0-25>
  }
}

Be ACCURATE. Base your analysis on the ACTUAL content of the resume. Do not give generic suggestions — be specific to what you see.
Return ONLY the JSON, no other text.`;

    let contentPart;
    if (mimetype === 'application/pdf') {
      contentPart = { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } };
    } else {
      contentPart = { type: 'image', source: { type: 'base64', media_type: mimetype, data: base64 } };
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: [contentPart, { type: 'text', text: 'Analyze this resume for ATS compatibility.' }] }]
    });

    const text = message.content.map(c => c.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    if (result.notResume) {
      return res.status(422).json({ error: 'not_resume', message: 'This file does not appear to be a resume.' });
    }

    res.json({ ok: true, ...result });
  } catch (err) {
    console.error('ATS score error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* CHAT BOT — "Aman Rawat" persona */
app.post('/api/chat', async (req, res) => {
  const { messages: chatMessages = [] } = req.body;

  try {
    const client = getClient();
    const systemPrompt = `You are Aman Rawat, a friendly and knowledgeable career advisor and resume expert at ReadyCVs. 
You help users with:
- Resume writing tips and best practices
- ATS optimization strategies  
- Career advice and job hunting tips
- How to use ReadyCVs features
- Interview preparation tips

Personality: Friendly, encouraging, concise, uses occasional emojis. You speak like a helpful friend who knows a lot about resumes and careers. 
Keep responses concise (2-4 sentences max unless asked for details).
Always encourage users and make them feel confident about their job search.
If asked something unrelated to careers/resumes, gently redirect to career topics.
Never mention being an AI — you are Aman Rawat.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 512,
      system: systemPrompt,
      messages: chatMessages
    });

    const reply = message.content.map(c => c.text || '').join('');
    res.json({ ok: true, reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* START SERVER */
app.listen(PORT, () => {
  console.log(`\n🚀 ReadyCVs server running at http://localhost:${PORT}`);
  console.log(`📋 Open http://localhost:${PORT}/index.html in your browser`);
  if (!config.apiKey) {
    console.log(`\n⚠️  No API key set! Go to Settings page or POST /api/set-key to add your Anthropic key.`);
  } else {
    console.log(`✅ Anthropic API key loaded: ${config.apiKey.slice(0,12)}...`);
  }
});
