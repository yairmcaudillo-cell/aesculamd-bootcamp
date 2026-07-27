// Real AI backend for the Workspace Coach, Mentor, and main Chat page.
//
// This is the one server-side piece in an otherwise fully static site — an API key
// cannot live in client-side JS without being exposed to every visitor, so this
// endpoint exists purely to keep OPENAI_API_KEY off the client. Vercel auto-detects
// any file under /api as a serverless function; no vercel.json needed.
//
// Rate limiting here is an in-memory per-IP counter — it resets on cold start and
// isn't shared across concurrent instances, which is a real limitation, not an
// oversight. The actual safety net against abuse is a spend cap set directly in the
// OpenAI dashboard (this endpoint has no accounts/auth to gate behind otherwise).

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 20;
const MAX_FIELD_LENGTH = 2000;

const requestLog = new Map(); // ip -> { count, windowStart }

function isRateLimited(ip) {
  const now = Date.now();
  const entry = requestLog.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    requestLog.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function clamp(str) {
  return typeof str === 'string' ? str.slice(0, MAX_FIELD_LENGTH) : '';
}

const AMCAS_CONSTRAINT = "Hard rule, not a suggestion: never draft, write, or suggest ready-to-use wording for a personal statement, activity description, secondary essay, or any text the student would submit to AMCAS — every medical school application requires that writing to be entirely the applicant's own words. You can discuss structure, ask questions, point out patterns, and explain concepts, but never produce submittable text. If asked to write or draft something, say briefly why you can't and redirect to a reflection question instead.";

function buildCoachEvalMessages({ question, answer, stageTitle }) {
  return [
    { role: 'system', content: `You are a supportive but honest writing coach embedded in the "${clamp(stageTitle)}" stage of a self-paced premed curriculum. A student just answered a reflection question. Evaluate whether their answer is genuinely specific (a real, nameable moment, person, or detail) or generic. Reply in 1-3 short sentences: either affirm what makes it specific, or name one concrete way to sharpen it. Never lecture, never use bullet points, just talk to them directly and briefly.` },
    { role: 'user', content: `Question: ${clamp(question)}\n\nStudent's answer: ${clamp(answer)}` }
  ];
}

function buildAgentChatMessages({ agentName, agentDesc, stageTitle, grounding, history }) {
  const system = `You are ${clamp(agentName)}, an AI mentor inside a self-paced premed curriculum. Your role: ${clamp(agentDesc)}${stageTitle ? ` You're currently attached to the "${clamp(stageTitle)}" stage.` : ''}

Ground your replies in what's actually true about this student, given here, rather than generic advice: ${clamp(grounding)}

${AMCAS_CONSTRAINT}

Keep replies conversational and concise — a few sentences, not an essay.`;

  const historyMessages = Array.isArray(history)
    ? history.slice(-12).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: clamp(m.text) }))
    : [];

  return [{ role: 'system', content: system }, ...historyMessages];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "You've hit the practice-conversation limit for now — try again in a few minutes." });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: 'AI backend is not configured (missing API key).' });
    return;
  }

  try {
    const { mode } = req.body || {};
    let messages;
    if (mode === 'coach-eval') {
      messages = buildCoachEvalMessages(req.body);
    } else if (mode === 'agent-chat') {
      messages = buildAgentChatMessages(req.body);
    } else {
      res.status(400).json({ error: 'Unknown mode.' });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.7
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      res.status(502).json({ error: 'No reply generated.' });
      return;
    }
    res.status(200).json({ reply });
  } catch (err) {
    console.error('ai-reply error:', err);
    res.status(502).json({ error: 'The AI backend had a problem answering that.' });
  }
}
