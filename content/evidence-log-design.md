# The Evidence Log: Structure & Behavior

### The single most important piece of data infrastructure in AesculaMD

---

## What it is, in one sentence

A permanent, append-only, competency-tagged record of everything a student has actually reflected on or logged — the raw material their roadmap, their agents, and eventually their own application all draw from, instead of each of those things existing as disconnected features.

---

## Core entry schema

Every entry in the evidence log — whether it comes from a stage reflection, a logged clinical/volunteer hour, or a flagged moment from an agent conversation — has the same shape:

```
entry_id
student_id
timestamp_created
source_type        → stage_reflection | logged_hour | agent_conversation | self_assessment
source_reference    → e.g. "Stage 04" or "Good Samaritan Clinic, Spring 2027"
competency_tags[]   → one or more of the 17, e.g. ["Service Orientation", "Understanding Others"]
maturity_at_entry    → Planning | Progressing | Demonstrating (nullable — not every entry rates itself)
content              → the student's own words, verbatim
linked_experience_id → ties to a specific activity/experience record, if applicable
editable             → true until a defined "lock" point (see below), then read-only
visible_to_agents    → true by default; student can mark an entry private
```

**Why append-only matters:** entries are never deleted, only ever added to or superseded. If a student's understanding of an experience deepens sophomore year, they add a new entry referencing the old one rather than editing history away. This is what makes the log useful as *longitudinal* evidence of growth later — a committee (or the student, in an interview) can see the actual arc, not just a final polished version.

**Why a lock point still matters:** once a student uses an entry as the basis for something they've submitted (e.g., a finalized activity description on AMCAS), that entry gets locked as read-only, timestamped at submission. This keeps the log honest as a historical record rather than something quietly rewritten after the fact.

---

## How competency tagging actually happens

Tagging shouldn't be manual multiple-choice checkboxes the student has to fill in every time — that's friction that kills logging habits. Instead:

1. **Stage-level default tags.** Every stage reflection prompt is pre-associated with the 1–3 competencies that stage targets (per the curriculum framework). A reflection written in the Research stage is tagged Scientific Inquiry + Critical Thinking automatically, before the student does anything.
2. **Agent-suggested additional tags.** After the student writes a reflection, the relevant agent can suggest one or two *additional* competencies it noticed in the content (e.g., a Research-stage reflection that also clearly shows Resilience after a failed experiment) — shown as a soft suggestion the student confirms or dismisses, never auto-applied silently.
3. **Manual tagging always available**, for the student who wants to flag something themselves — especially important for pre-college experiences (caregiving, work, etc.) that don't map to any stage at all.

---

## Reassessment cadence

A one-time Stage 01 rating goes stale fast — a "Planning" rating in freshman fall may genuinely become "Demonstrating" two semesters later, and the roadmap needs to notice, not keep planning against a snapshot from a year ago. Rather than a single self-assessment, `self_assessment`-type entries get a lightweight, optional re-rating prompt on a rolling basis: roughly once per semester, or whenever completing a stage would plausibly move a specific competency (e.g., finishing Stage 05 with real reflection triggers a light re-check on Service Orientation and Empathy and Compassion specifically, not all 17 at once).

Each new rating is a **new entry**, never an edit to the old one, consistent with append-only above — the point is to see "Planning → Progressing → Demonstrating" as a dated trajectory, not to keep a single number artificially current. The roadmap (see `roadmap-generation-design.md`) reads only the *most recent* rating per competency to set priority; the full history stays intact underneath as evidence.

---

## The competency view (what the student actually sees)

Rather than a flat chronological feed, the primary way a student browses their own evidence log is **by competency**, not by date:

- Each of the 17 competencies has its own timeline: every entry tagged to it, in order, showing the maturity rating at each point.
- This makes growth visible directly: a student can see "Service Orientation: Planning (Stage 01) → Progressing (sophomore fall, free clinic) → Demonstrating (sophomore spring, sustained volunteering + reflection)" as an actual trajectory, not just a memory they have to reconstruct at 22.
- At any point, a student can generate a **competency snapshot** — a clean one-page export per competency, pulling their own best entries — directly useful for interview prep or for handing to a letter-writer who needs a jog of memory.

---

## How agents use the log — and the hard boundary around it

Agents can **read** across a student's evidence log to notice patterns and ask better questions:
- *"You've described feeling out of your depth in three entries now, across clinical, research, and leadership settings — do you see a pattern there, or does each one feel different to you?"*
- *"Your Stage 02 'why' mentioned wanting to sit with families in hard moments. Your last two clinical entries both touch on that. Want to connect them?"*

Agents **cannot** generate new evidence-log content on the student's behalf, and cannot draft essay or activity-description language from the log's contents for direct submission — consistent with AMCAS's requirement that application writing be the student's own. The agent's role here is closer to a thoughtful mentor flipping back through a notebook with the student than a ghostwriter.

---

## Reset vs. the log — resolving the earlier tension

When a student resets their roadmap (a real, expected behavior — interests shift a lot sophomore year), **the evidence log is never touched.** Reset only affects the forward-looking plan — which stages are next, what the roadmap recommends. Every past reflection, every logged hour, every competency rating stays exactly as it was, because it's real history, not a plan that changed. This is also what protects the outcomes-data flywheel: resets are common and expected, but they should never cause data loss.

---

## Where this feeds the bigger flywheel (with consent, not by default)

Separately from a student's private use of their own log, students can **opt in** to contribute de-identified patterns from their evidence log (not raw personal content) to AesculaMD's aggregate outcomes research — the dataset that eventually lets us say "students who showed X competency-development pattern by sophomore year had Y outcome." This must stay explicitly opt-in and clearly explained, never a default, and never something that surfaces a student's actual private reflections to anyone else, including AesculaMD's own team, without separate explicit consent.

---

## Why this is the actual moat, restated plainly

A competitor can copy your UI in a weekend. They cannot copy two years of a real student's honestly-tagged, longitudinally-tracked evidence of Resilience, Service Orientation, and Scientific Inquiry — because that only exists if the student actually did the reflecting, inside your product, over real time. The evidence log is the thing that makes "we have data no one else has" true rather than aspirational.

