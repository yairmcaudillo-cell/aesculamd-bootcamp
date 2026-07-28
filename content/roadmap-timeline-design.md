# Roadmap Timeline & Quick Setup: Design Spec

### Skipping the guided bootcamp without skipping personalization

---

## What this solves

Two related gaps, both real:

1. **No entry point for the self-assessment other than the guided flow.** Stage 01's 17-competency rating only existed inside the bootcamp's stage-by-stage curriculum. A student who doesn't want to read module content had no way to get a personalized roadmap at all.
2. **`roadmapOrder` is a priority list, not a calendar.** `computeRoadmapOrder()` (see `roadmap-generation-design.md`) can answer "what should I do next," but not "what should I be doing this semester, and am I on pace for application day."

This spec covers both: a **Quick Setup** flow that reaches the same underlying data model without the guided lessons, and a **Timeline** that turns the priority-sorted stage list into an actual term-by-term plan from now to a target application cycle.

---

## 1. Quick Setup — the skip path

Quick Setup collects exactly what the guided flow already collects, through the same interactive components, just mounted somewhere a student can reach without opening Stage 01:

- The 17-competency self-assessment (reuses `renderAssessment`)
- The MD/DO/dual track choice (reuses `renderTrackSelector`)
- The target MCAT testing month (reuses `renderTestingWindow`)

Plus two inputs the guided flow never needed, because a student working through Stage 01 is implicitly "starting now":

- **Current year in school** (Freshman / Sophomore / Junior / Senior / Post-grad or gap year)
- **Target application-cycle year** — the calendar year they intend to *submit* primary applications (matriculation follows the next fall)

One underlying data model, two entry points. Submitting Quick Setup runs the exact same `computeRoadmapOrder()` Premed 101 uses, so a Quick Setup student and a guided-flow student who give the same answers end up with the same prioritized stage order.

---

## 2. Skip mode: stages become optional, not gated

Completing Quick Setup sets a single global flag, `skipModeActive`. It does not introduce a new `status` value or change what `done`/`current`/`locked` mean structurally — it changes how `locked` is *enforced*:

- Without skip mode: opening a `locked` stage shows a preview and blocks completion ("finish earlier stages first").
- With skip mode: opening any stage — regardless of `status` — opens the real panel with a working "Mark Stage Complete" button. The priority order still renders and still means something (it's the recommended order), but nothing blocks a student from jumping straight to, say, Research because that's what they actually want to work on today.

This is deliberately a single flag rather than a parallel gating system, to keep the two entry points (guided and skip) sharing one codepath everywhere except the one `if` that decides whether `locked` blocks.

---

## 3. The Timeline

New state this needs that nothing else in the app collects: `studentProfile.yearInSchool` and `studentProfile.targetCycleYear`.

`computeTimeline()`:

1. Builds the list of academic terms (Fall / Spring / Summer, inferred from the real current date) from now through the term immediately before the target cycle's primary-submission window.
2. Takes every not-yet-`done` stage in `roadmapOrder` (already priority-sorted) and distributes it across those terms, front-loaded — higher-priority stages land in earlier terms.
3. Overlays four fixed milestones pulled directly from existing content rather than invented for this feature:
   - **MCAT test date** — if the student set one (Stage 05 / Quick Setup)
   - **AMCAS primary submission** — summer of the target cycle year
   - **Secondary applications** — the following term (content already establishes this is 4–8 weeks after primaries)
   - **Interviews** — fall/winter of the target cycle year

The Timeline page states plainly that this is a planning estimate, not a guarantee — real pace varies, and the whole point of `computeRoadmapOrder`'s re-prioritization is that the plan should keep changing as the student's actual answers change.

---

## 3.5. The personalized plan (the platform's actual capstone)

The Timeline's schedule answers *when*. It doesn't answer the thing the whole bootcamp is actually building toward: a synthesized, personalized read of where a student stands and what to do about it, grounded in everything they've actually said — not just a stage list with dates on it.

**Your Personalized Plan**, on the same Timeline page, is a real model call (`api/ai-reply.js`, `mode: "generate-plan"`) reading the student's full real state: every self-assessment rating and reflection, every stage's evidence-log entries, `trackChoice`, `testingWindowDate`, `studentProfile`, and the `computeTimeline()` schedule itself (handed in as plain-text context so the model writes around real dates rather than inventing its own). It writes a real strengths/gaps/next-actions synthesis, not generic advice — and it's honest about gaps rather than reassuring, the same stance the rest of this app already takes (the Committee tool, the pace read).

**Program-ambition tier**, set right above the Generate button, is the honest substitute for a real school list this prototype doesn't have (School List was removed — see `README.md` gap #23): `research-intensive`, `strong-academic`, or `community-focused`, not a specific school. It does two things: (1) it's handed to the AI as calibration — a student aiming research-intensive gets told plainly if their evidence log doesn't yet reflect that level; (2) it adds one more weight term to `computeRoadmapOrder()`'s existing priority scoring (same shape as `track_weight`), pulling "Research or No Research?" earlier when the tier is research-intensive.

Same resilience pattern as every other real-AI surface in this app: if the call fails or hits the rate limit, a deterministic fallback (`buildFallbackPlan()`) stitches together the pace read, the term schedule, and any competencies still rated Planning — genuinely less rich than a real synthesis, but never a broken UI.

## 4. What this doesn't solve

- **No persistence.** Same limitation as the rest of this prototype — a refresh loses `studentProfile` and recomputes nothing until Quick Setup or a stage is redone.
- **No "day zero."** The timeline is computed from `new Date()` at render time, not stored against a fixed start date. It will silently reflow to a different set of terms if reopened months later without anything else changing — which is roughly correct behavior, but worth naming.
- **Scheduling is a greedy even distribution, not deadline-aware per stage.** It doesn't independently know, say, that Clinical Experience benefits from a full academic year rather than a single term — it just spreads `roadmapOrder`'s remaining stages evenly across however many terms are left. Good enough to be useful; not a real constraint solver.
