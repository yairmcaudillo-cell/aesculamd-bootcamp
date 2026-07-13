# AI Roadmap Generation: Design Spec

### How Stage 01's self-assessment becomes a personalized, reordered curriculum

---

## What this replaces

Right now (README known gap #5), every student sees the identical fixed stage sequence defined in `data.js`. This spec describes the logic that turns Stage 01's 17-competency ratings — plus the Stage 04 MD/DO/dual choice and ongoing evidence-log signals — into a per-student ordering and emphasis. It never changes *which* stages exist, only their order, urgency, and in-stage emphasis.

This is a design spec, not code — it assumes the auth + database work from README gap #1 already exists to store per-student state.

---

## 1. Model: a dependency graph, not a flat list

Two edge types between stages:

- **Hard prerequisite edges (fixed order).** Stage 01 must come first — it's the diagnostic input everything else reads. Stage 02 (Narrative) should stay early since Stages 08/09 explicitly reference it later.
- **Soft, weighted edges (reorderable by urgency).** Cost & Access and Stages 04 through 10 all get a per-student priority score, then get topologically sorted subject to the hard edges above. Cost & Access's position directly after Narrative (see §3) is simply what a typical-profile score produces, not a hard rule baked into the graph itself.

---

## 2. Priority scoring

For each reorderable stage `S`, compute:

```
priority(S) = gap_weight(S) + urgency_weight(S) + track_weight(S)
```

- **`gap_weight(S)`** — sum of `(3 − maturity_level)` across `S`'s target competencies, using the student's *most recent* rating for each (Planning=1, Progressing=2, Demonstrating=3). A stage targeting mostly-Planning competencies scores higher and gets pulled earlier. A student already Demonstrating in a stage's target competencies sees that stage de-prioritized, not skipped — it still gets referenced, per Stage 01's existing "referenced, not re-taught" rule.
- **`urgency_weight(S)`** — a small, fixed set of *real* external deadline dependencies, not opinion. Example: Cost & Access carries a flat urgency bonus because FAP approval must precede MCAT registration to capture the discount (stage-05's own content already states this). A stage tied to a self-reported approaching date (e.g., Stage 05's logged "target testing window") gets a temporary urgency bump as that date nears.
- **`track_weight(S)`** — small adjustments from the Stage 04 MD/DO/dual choice. This mostly reweights *emphasis inside* a stage (e.g., surfacing DO-shadowing prep earlier within Clinical Experience for DO-leaning students), not stage order — consistent with Stage 04's own "lightly tags a few things" framing.

**A known limitation of `gap_weight`, by design, not oversight:** it only pulls a stage earlier if that stage's `competencies` field includes the low-rated skill. Two of the 17 — **Resilience and Adaptability** and, to a lesser extent, **Interpersonal Skills** — are deliberately not owned by any single stage (see `aesculamd-curriculum-framework.md`'s note on this). A student rated low on Resilience and Adaptability will get a real, dated `self_assessment` entry for it in Stage 01, but no stage will get reordered because of it — that competency is meant to be built cumulatively through the reflection prompts that recur across every stage, not by resequencing the roadmap. This is a real limitation worth stating plainly rather than silently: `gap_weight` alone cannot fully personalize around a competency no stage owns.

## 3. Resolving the Cost & Access placement question (README known gap #6)

**Status: implemented.** The model above resolves this concretely instead of by manual debate: Cost & Access has a structurally high `urgency_weight` (it gates a real, one-time, non-retroactive financial decision — FAP must be approved before MCAT registration) while its `gap_weight` is usually moderate, since Reliability and Ethical Responsibility are also touched by several other stages.

Cost & Access is now Stage 03 — directly after Narrative, directly before Strategy — matching the placement `aesculamd-curriculum-framework.md` already proposed. There's a second, independent reason beyond urgency: Strategy's own reflection prompts ask whether dual-applying to MD and DO "feels realistic for your time and budget" — a question a student can only answer honestly if they've already seen the real AMCAS-vs-AACOMAS fee breakdown, which lives in Cost & Access. Sequencing Cost & Access after Strategy (or only before Grades & MCAT) would have made that reflection prompt unanswerable in good faith. The old `data.js` default order (dead last, locked behind all nine other stages) actively worked against both of these; `data.js` and every affected `/content` cross-reference have been renumbered to match (Strategy is now 04, Grades & MCAT 05, Clinical Experience 06, Volunteering 07, Research 08, Leadership 09, Personal Brand 10).

---

## 4. Re-assessment loop, not a one-shot

Ties directly to the new "Reassessment cadence" section in `evidence-log-design.md`: whenever a competency's most-recent rating changes, recompute `priority(S)` for every not-yet-started stage targeting that competency, and re-sort. Completed stages never move. This keeps the roadmap a living recommendation rather than a snapshot frozen at Stage 01 — important given how much can change between freshman fall and junior year.

---

## 5. What the AI is (and isn't) doing here

The "AI" in "AI-generated roadmap" lives entirely in the scoring/sequencing above, plus selecting which reflection prompts to surface next — never in producing application text. This restates the existing hard guardrail from Stage 01 and the evidence log's agent boundary: the system can reorder, weight, and ask better questions; it cannot draft a personal statement, activity description, or any submittable text.

---

## 6. Data this needs that already exists

- `self_assessment` entries — already schema'd in `evidence-log-design.md`.
- Stage 04's MD/DO/dual track selection — already logged per stage-04 content.
- Stage 05's "target testing window" checklist item — already logged in prose; needs to become a structured date field, not just free text, for `urgency_weight` to use it.

## 7. What's still a real backend problem, not a design problem

Storing and recomputing per-student state requires the auth + database work in README gap #1. This spec assumes that exists; it does not solve it.
