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

// Constructed lazily, only after the handler's own missing-key check below has
// already run — the SDK's constructor throws immediately if the key is missing or
// empty, which would otherwise crash the whole module on cold start (surfacing as a
// raw platform error page) before our own friendlier "not configured" response could.
let openai = null;
function getClient() {
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai;
}

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

Ground your replies in what's actually true about this student. When their question touches on progress, evidence, or competencies, cite the actual numbers below directly in your reply — a specific number is more useful and more credible than a generic reassurance like "everyone's journey is different." Real, concrete grounding is the entire reason this data is given to you, not decoration: ${clamp(grounding)}

${AMCAS_CONSTRAINT}

Keep replies conversational and concise — a few sentences, not an essay.`;

  const historyMessages = Array.isArray(history)
    ? history.slice(-12).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: clamp(m.text) }))
    : [];

  return [{ role: 'system', content: system }, ...historyMessages];
}

function summarizeSelfAssessment(selfAssessment) {
  if (!selfAssessment || typeof selfAssessment !== 'object') return 'No self-assessment data provided.';
  const lines = Object.entries(selfAssessment)
    .filter(([, v]) => v && v.level)
    .slice(0, 20)
    .map(([name, v]) => `- ${clamp(name)}: ${clamp(v.level)}${v.reflection ? ` — "${clamp(v.reflection)}"` : ''}`);
  return lines.length ? lines.join('\n') : 'No competencies rated yet.';
}

function summarizeEvidenceLog(evidenceLog) {
  if (!Array.isArray(evidenceLog) || evidenceLog.length === 0) return 'No evidence log entries yet.';
  return evidenceLog.slice(0, 100).map(e =>
    `- [${clamp(e.source_reference || '')}] ${clamp((e.competency_tags || []).join(', '))}: "${clamp(e.content || '')}"`
  ).join('\n');
}

const AMBITION_NOTES = {
  'research-intensive': "The student is aiming for highly-selective, research-intensive programs. These generally expect sustained, substantive research involvement (not just a summer of exposure) and the most competitive GPA/MCAT range. If their evidence log doesn't yet reflect that level, say so plainly — do not reassure them it's fine if it isn't.",
  'strong-academic': "The student is aiming for strong, broadly competitive academic programs. Solid, consistent evidence across the competencies matters more here than any single standout credential.",
  'community-focused': "The student is aiming for community- and primary-care-focused programs. Service and relationship-building evidence often weighs as heavily here as research."
};

function buildGeneratePlanMessages({ selfAssessment, evidenceLog, trackChoice, testingWindowDate, studentProfile, programAmbition, scheduleSummary }) {
  const ambitionNote = AMBITION_NOTES[programAmbition] || "The student hasn't specified a program-ambition tier yet — write generally, without assuming a specific selectivity level.";

  const system = `You are writing a real, personalized medical-school-application plan for a premed student, synthesized from everything they've actually told this platform — not generic advice. This is the capstone deliverable of the whole curriculum: read their real self-assessment, their real reflections, and their real choices, and tell them the truth about where they stand and what to actually do next.

${ambitionNote}

Structure your response as flowing prose in 3-4 short sections, separated by blank lines: (1) a direct, honest read of their real strengths, citing specific things they actually wrote — not generic praise; (2) their real gaps, named plainly, including relative to their stated program-ambition tier if they gave one; (3) a walk through the term-by-term schedule given below, explaining why each phase matters for their specific situation, not just repeating the schedule; (4) one or two concrete next actions they should take first.

For any activity category (clinical, research, volunteering, leadership) they haven't started yet, don't just say "get some experience" — recommend a specific sub-type based on real signals in what they wrote. If their reflections show a pull toward direct, personal contact with people (translating for family, sitting with someone, tutoring one-on-one), say that a hands-on role — hospice, direct patient care, one-on-one mentoring — fits better than something data- or lab-oriented, and vice versa if their signals point the other way (comfort with ambiguity, curiosity about mechanisms, enjoying methodical work). If they've named a real constraint (needs paid work, no car, limited hours), factor it into the specific recommendation, not just the general advice.

${AMCAS_CONSTRAINT}

Never invent specific school names, specific statistics you weren't given, or acceptance likelihoods — you don't have real admissions data, only this student's own reported information and general knowledge about what different program tiers value.

Keep the whole thing to roughly 300-450 words. Talk directly to the student ("you"), not about them.`;

  const userContent = `MD/DO/Dual track: ${clamp(trackChoice) || 'not yet chosen'}
Target MCAT testing window: ${clamp(testingWindowDate) || 'not yet set'}
Year in school: ${clamp(studentProfile && studentProfile.yearInSchool) || 'not set'}
Target application cycle: ${(studentProfile && studentProfile.targetCycleYear) || 'not set'}

Self-assessment (competency: level — reflection):
${summarizeSelfAssessment(selfAssessment)}

Evidence log (every stage reflection and rating, tagged by competency):
${summarizeEvidenceLog(evidenceLog)}

Their real term-by-term schedule (already computed — write around this, don't invent your own dates):
${clamp(scheduleSummary) || 'No schedule available yet.'}`;

  return [
    { role: 'system', content: system },
    { role: 'user', content: userContent }
  ];
}

const MODE_MAX_TOKENS = {
  'coach-eval': 300,
  'agent-chat': 300,
  'generate-plan': 900
};

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
    } else if (mode === 'generate-plan') {
      messages = buildGeneratePlanMessages(req.body);
    } else {
      res.status(400).json({ error: 'Unknown mode.' });
      return;
    }

    const completion = await getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: MODE_MAX_TOKENS[mode] || 300,
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
