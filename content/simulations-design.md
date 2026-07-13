# Interview Simulator & The Committee: Design Spec

### Adapted from AesculaMD_1's real implementation, rebuilt as scripted experiences for this static prototype

---

## Where this comes from

`AesculaMD_1` (a separate, full production repo — React/Express/Postgres/real AI) already has a mature Interview Simulator and Committee tool, both several thousand lines, both backed by real Anthropic/OpenAI calls, a real database, and real auth/billing. This spec adapts the *concepts* — personas, question categories, scoring rubric, committee-member roles, verdict structure — into scripted, rule-based versions that fit this prototype's no-backend, no-real-AI architecture. Nothing here is copy-pasted; the source material informed the design, not the code.

---

## 1. Interview Simulator

**Personas (3, kept from the source material):** Dr. Sarah Chen (Friendly Faculty — supportive, builds on your answer), Dr. Marcus Williams (Challenging Admissions Director — direct, probes for specifics), Dr. Robert Hayes (Skeptical Physician — allergic to rehearsed answers, wants the real story). Since there's no real AI generating in-character responses, persona only changes the *tone* of the scripted feedback template, not the substance.

**Categories (9, kept from the source material, 5 example questions each):** Traditional, Behavioral, Ethics & Scenarios, MMI Style, Medical Knowledge, Specialty-Focused, Research Experience, Community Health, Mission Alignment. A 10th category, **"Your Evidence Log,"** is new here — it pulls an actual stage reflection prompt the student has already answered (or an unrated/low-rated competency) instead of a generic question, since that data didn't exist in the source product's demo the same way.

**Scoring — honestly rule-based, not simulated AI:** the source product calls a real LLM for feedback. This version uses transparent heuristics instead: answer length (too short → "add a specific detail"; well-formed; too long → "tighten it, aim for ~60–90 seconds spoken"), and a specificity check (does the answer contain a number, a named person/place, or concrete first-person action verbs, vs. only abstract adjectives). The **"strengthen"** note is templated from whichever heuristic failed. The **follow-up question** is simply the next example question in that category — an honest substitute for an AI-generated one, not a disguised fake.

**Evidence log tie-in:** after feedback, the student can log their answer as an evidence-log entry (tagged to the category's nearest competency), turning practice into real logged evidence rather than a throwaway exercise.

---

## 2. The Committee

**Members (4 roles, kept from the source material):** Academic Reviewer (GPA/MCAT/rigor), Mission Advocate (mission alignment, service, financial realism), Research Director (research depth and decisiveness), Student Affairs (narrative coherence, breadth of evidence).

**What's different from the source:** the real product reads a live database (GPA, MCAT, personal statement draft, a specific target school's real mission/stats) and calls an LLM to generate each member's statement. This version reads the same *shape* of information from what this prototype already has in memory — `selfAssessment`, `evidenceLog`, `roadmapOrder` completion, `trackChoice`, `studentProfile` — and generates each statement from a fixed template keyed to what's actually true (e.g., Academic Reviewer's sentiment depends on whether Grades & MCAT is done and a testing window is set; Research Director's depends on whether a research-path decision was logged with reasoning).

**Verdict:** Interview / Hold / Decline, computed from a simple weighted read of stage completion + evidence-log breadth (competencies with at least one entry) + whether Stage 01 is complete at all. Explicitly labeled as a **practice read on your current progress, not a real admissions prediction** — this is a hard line not to blur, given the product's own AMCAS-integrity stance elsewhere.

**Action items:** generated from the actual gaps found (an unrated-or-Planning competency with no evidence, an unstarted stage, a missing track choice) — each one is something the student can act on immediately in this same app (open that stage, rate that competency, log a reflection).

---

## 3. What this doesn't do

- No real AI grading or in-character dialogue — this is a deliberate scope choice for this static prototype, not a claim that heuristic feedback is equivalent to what `AesculaMD_1`'s real version does.
- No persistence beyond this session, same as everything else here.
- The Committee's verdict is a motivational/diagnostic tool, not a predictive one — it must never be presented as reflecting how a real committee would actually decide.
