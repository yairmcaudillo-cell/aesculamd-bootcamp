# Three More Tools: Design Spec

### "Should I Be a Doctor?" quiz, LOR Tracker, and School List — adapted from AesculaMD_1

---

## 1. "Should I Be a Doctor?" quiz

Adapted from `ShouldIBeADoctor.tsx` — a fully client-side, zero-AI mechanic already, so this is closer to a direct port than a redesign. 10 questions, each with 4 answer options scored across 4 named dimensions: **Intrinsic** motivation, **Realistic** (cost/time awareness), **Resilience**, **Clarity** of purpose. Total score maps to one of 4 result tiers (Strong Foundation / Promising / Important Questions to Explore / Consider the Full Landscape), each with an honest list of hard truths, a list of genuine positives, and next steps.

**What changed from the source:**
- Two stale statistics were re-verified and updated for the current cycle: average medical school debt (~$223K, not $203K/$230K) and physician burnout rate (~42%, not ~54% — burnout has been declining per AMA's own 2025 data) and the share of MD applicants who don't matriculate (~55%, not ~60%).
- Every "next step" and CTA that pointed at `AesculaMD_1` features that don't exist here (a "Diagnostic" tool, "Committee sessions") were rewritten to point at this app's actual equivalents: Stage 01's self-assessment, the Activity Ledger, and our own Committee.

This complements, not duplicates, Stage 01's competency self-assessment — that one asks "where do you already have evidence," this one asks "is this the right goal in the first place." Deliberately placed as a Home-page/standalone entry point, not gated behind any stage, since it's most useful *before* someone commits to the bootcamp at all.

## 2. LOR Tracker

Gives the existing **Letters & Relationships** agent (Stage 10) an actual tool behind its description, following the same pattern Activity Ledger gave Logistics & Pacing. A simple status pipeline per potential letter-writer: **Not Asked → Asked → Confirmed → Submitted**, with role tagging (Science Professor / Non-Science Professor / Clinical Supervisor / PI or Research Mentor / Physician / Other) matching Stage 10's own "4–6 letters, mixed roles" guidance. Logging or updating an entry feeds the Evidence Log the same way the Activity Ledger does.

**What's different from the source:** the source app's `LORTracker.tsx` has real deadline/overdue flagging tied to actual school-specific submission dates from a live database. Without that, this version tracks *relationship freshness* instead — how long it's been since the student last talked with that person — which is the thing Stage 10's content actually tells students to manage ("ask while their impression is still fresh").

## 3. School List

The biggest gap identified in the earlier `AesculaMD_1` review. Adapted from `SchoolListOS.tsx`'s core idea — not just a reach/target/safety label per school, but a **portfolio balance** read across the whole list.

**What had to be built from scratch, honestly:** the source app has a real, live database of ~228 schools with verified GPA/MCAT medians and mission data. This prototype has no database, so a small seeded dataset (15 real, well-known MD/DO programs with public GPA/MCAT median data, verified against MSAR-adjacent public sources) stands in for it — explicitly labeled as illustrative coverage, not a complete or authoritative list, so nobody mistakes 15 schools for a real school-list tool.

For each school: compare the student's self-reported (or Stage 05-logged) GPA/MCAT against that school's median to produce a tier (Reach / Target / Safety), plus a plain-language reason. Across the saved list: a **balance score** that flags an all-reach or all-safety list as a real risk, not just a count.
