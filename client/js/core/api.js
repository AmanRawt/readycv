/**
 * ReadyCVs — api.js
 * Frontend helper for all backend API calls
 */

const API_BASE = 'http://localhost:3001/api';

export async function aiWrite(prompt, sectionType = 'experience', count = 5) {
  const r = await fetch(`${API_BASE}/ai-write`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, sectionType, count })
  });
  if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Server error'); }
  return r.json();
}

export async function aiFullResume(description) {
  const r = await fetch(`${API_BASE}/ai-full-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description })
  });
  if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Server error'); }
  return r.json();
}

export async function atsScore(file) {
  const form = new FormData();
  form.append('resume', file);
  const r = await fetch(`${API_BASE}/ats-score`, { method: 'POST', body: form });
  const data = await r.json();
  if (!r.ok) throw { code: data.error, message: data.message || 'Error' };
  return data;
}

export async function chat(messages) {
  const r = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Server error'); }
  return r.json();
}

export async function setApiKey(apiKey) {
  const r = await fetch(`${API_BASE}/set-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey })
  });
  if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Invalid key'); }
  return r.json();
}

export async function getKeyStatus() {
  try {
    const r = await fetch(`${API_BASE}/key-status`);
    return r.json();
  } catch { return { hasKey: false }; }
}
