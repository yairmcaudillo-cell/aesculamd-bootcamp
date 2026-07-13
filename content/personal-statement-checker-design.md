# Personal Statement Checker: Design Spec

### Adapted from AesculaMD_1's WritingSuite.tsx, rebuilt as a fully client-side checker

---

## What this is

A page where a student pastes a draft they already wrote — personal statement, activity description, most-meaningful narrative, or a secondary essay — and gets immediate, mechanical feedback. **It never generates, rewrites, or suggests replacement text.** It only flags patterns in what the student already put on the page, consistent with the AMCAS own-words guardrail already stated in Stage 01 and the evidence log design.

## 1. What's a direct, faithful port (pure string matching, no AI in the source either)

- **Cliché phrase detector**: 13 phrases (e.g. "ever since I was young," "solidified my desire," "shadowing experience"), each mapped to a specific rewrite *instruction* — never a rewrite itself.
- **Vague phrase detector**: 9 phrases (e.g. "learned a lot," "various," "helped with"), each with an instruction to name the specific thing instead.
- **AMCAS character counter**, color-banded (green → amber past 85% → red past 96% → bold red over limit), with the real per-content-type limits: personal statement 5,300 / activity description 700 / most-meaningful narrative 1,325 / secondary essay ~2,000.

## 2. What had to be redesigned as honest heuristics (the source used a real LLM call)

The source product's "Aspirations vs. Inspirations" and "Why MD, not NP/PA?" checks are AI-generated categorizations. This prototype has no real AI, so both are rebuilt as transparent, rule-based signal counts — same honesty standard as the Interview Simulator's scoring (see `simulations-design.md`):

- **Aspirations vs. Inspirations** — counts first-person agency verbs ("I realized/decided/chose/led/built...") against third-person-admiration language ("she showed me," "his dedication," "inspired me"). Heavily admiration-weighted text is flagged **inspirations-heavy** ("Needs Work"): the essay may be more about someone else's admirable qualities than the applicant's own growth or action. Roughly even or applicant-heavy text is flagged **applicant-centered** or **balanced**.
- **Why MD, not NP/PA?** — checks for physician-specific language (words like "diagnose," "physician," "medical decision-making," "lead the care team") versus only generic healthcare/helping language. Physician-specific language present → **clear**; some healthcare language but nothing physician-distinguishing → **implicit**; neither → **missing**.

Both are labeled in the UI as a mechanical read, not a real writing evaluation — the same "heuristic, not AI grading" framing already used elsewhere in this prototype.

## 3. What this doesn't do

No saving/versioning across sessions (matches the rest of the prototype), no AI rewriting suggestions, and no evidence-log integration — this is a drafting-quality checker, not an evidence-generating stage.
