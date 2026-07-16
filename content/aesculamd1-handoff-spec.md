# Spec: AesculaMD_1's Onboarding Should Route `starting_out` Users to Bootcamp

*Not implemented. This is a ready-to-hand-off spec for whoever picks up the AesculaMD_1 side of this — Bootcamp's own repo is the only thing this session touched.*

---

## Why this exists

The cross-product funnel audit found the handoff between Bootcamp and AesculaMD_1 only runs one direction: Bootcamp points students toward AesculaMD_1 (Stage 10's closing content, now a real link to `https://aesculamd.com`), but AesculaMD_1 has no path back to Bootcamp for students it already knows are too early for its core journey.

AesculaMD_1's own `CLAUDE.md` states this directly, unprompted:

> `starting_out` / `getting_serious` (freshman, sophomore — 2-4 years from applying): ... **Never pitch the Committee to these users — it's irrelevant to them and will confuse the value prop.**

That's Bootcamp's entire audience. AesculaMD_1 already detects this segment and already knows its core journey (Diagnostic → Committee → Interview Simulator) is the wrong message for them — it just doesn't currently do anything about it besides softening its own pitch.

## Where the signal already exists

`server/routes/diagnostic.ts` already derives a `journeyStage` field from the student's stated application year, immediately after the Diagnostic's 11 questions:

```ts
// server/routes/diagnostic.ts (existing code, not proposed)
if (appYear <= currentYear) journeyStage = "applying_this_cycle";
else if (appYear === currentYear + 1) journeyStage = "getting_serious";
else journeyStage = "starting_out";
```

This is the exact moment to act on. No new data collection is required — the signal is already computed and already stored (`journeyStage` is read elsewhere in `server/routes/premed-advisor-dashboard.ts`, confirming it's a real, persisted field, not a transient value).

## The proposed change

When `journeyStage` resolves to `"starting_out"` on `DiagnosticResult.tsx` (Phase 1's result page):

1. Keep the existing Diagnostic result in full — archetype, domain scores, school-fit preview, 90-day plan. Per AesculaMD_1's own hard constraint, "the diagnostic must remain free and anonymous... never gate it." This proposal doesn't touch that.
2. Where the result page currently offers "Watch the committee discuss your application — free with account," branch: for `starting_out` users, replace or precede that CTA with something like — *"You're several years out from applying — that's exactly the runway a free, self-paced curriculum is built for. AesculaMD Bootcamp turns your 90-day plan into a real, evidenced case over the next few years, so the Committee actually means something when you get there."* — linking to Bootcamp (`https://[bootcamp production URL]`, once deployed at a stable domain — confirmed at time of writing as the Vercel deployment for this repo).
3. Still offer the Committee CTA underneath, de-emphasized, for the `starting_out` student who wants to see it anyway — per AesculaMD_1's own paywall philosophy ("never block and leave the user with nothing... answer the question first").

## What this deliberately does not do

- Does not change anything for `getting_serious` / `applying_this_cycle` / `already_applied` / `non_traditional` users — the existing Committee-first flow is correct for them, per AesculaMD_1's own documented strategy.
- Does not attempt a real account bridge, SSO, or data import between the two products in this pass — that's a larger, separate integration decision (shared auth, or a one-way data export from Bootcamp's evidence log into a new AesculaMD_1 account) that needs its own design, not a byproduct of this fix.
- Does not touch AesculaMD_1's Diagnostic questions, scoring, or archetype logic — only what happens after a `starting_out` result renders.

## Open questions for whoever implements this

- What's Bootcamp's actual stable production URL to link to? (This repo currently deploys to Vercel; confirm the canonical domain before shipping a link from a live product.)
- Should this redirect suggestion be dismissible/rememberable, so a `starting_out` user who's already done Bootcamp doesn't see it every time they revisit their Diagnostic result?
- Is there any appetite for the reverse data bridge (Bootcamp's evidence log → seeding a new AesculaMD_1 account's Story Bank) mentioned in Bootcamp's own Stage 01/Stage 10 content, or should that stay aspirational copy until a real integration is scoped?
