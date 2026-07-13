// Source of truth for all bootcamp stages and agents.
// Every page (Bootcamp, Know How, Agents) renders from this single dataset.

const STAGE_DATA = [
  {
    num: "01", year: "Year 1", title: "Premed 101", status: "done",
    competencies: "Self-Awareness · Commitment to Learning and Growth",
    why: "Before you build a plan, you need an honest read on where you're actually starting from. This stage is the input that makes every later stage about you, not a generic checklist.",
    parts: [
      "<b>A note on timing, before you rate yourself:</b> if you're a freshman with nothing yet that looks like a 'premed activity,' you are not behind — 74% of 2024 matriculants took at least one gap year, and the average matriculant is now 24–25 years old. The 'no gaps, straight through' path is the exception. This roadmap's sequence is a recommendation, not a countdown clock.",
      "<b>What this stage is grounded in:</b> medical schools jointly built a framework of 17 Premed Competencies — not to give you 17 new things to go do, but to describe, in plain language, the traits that predict whether someone will thrive as a medical student and physician. They split into three groups: Professional (11, things like Commitment to Learning and Growth, Empathy and Compassion, Resilience and Adaptability, Self-Awareness, Service Orientation), Thinking & Reasoning (4: Critical Thinking, Quantitative Reasoning, Scientific Inquiry, Written Communication), and Science (2: Human Behavior, Living Systems). No applicant is expected to be strong in all 17 — admissions officers are looking for real, specific evidence in the ones that matter, not mastery across the board.",
      "<b>The honest self-assessment:</b> for each of the 17 competencies, you'll rate yourself using the same three-level scale admissions-trained advisors use — <i>Planning</i> (you understand what it means but don't yet have a clear demonstrating experience), <i>Progressing</i> (some experience, still early), or <i>Demonstrating</i> (a specific, real experience you could describe in detail). For every competency rated Progressing or Demonstrating, you'll answer three prompts that become permanent entries in your evidence log: what you learned about it watching someone else, how you personally developed it, and one specific, picture-able moment where you demonstrated it.",
      "<b>What this bootcamp is, and isn't, in one honest sentence:</b> these ten stages are Phase 1 — building a real, evidenced case while you still have years of runway. Phase 2 — your actual school list, secondaries, interview prep, managing a live application cycle — is different work, with different tools, and lives elsewhere; you'll hear exactly where at the end of Stage 10. For now, just know that finishing this track is a real, complete milestone on its own, not half of one.",
      "<b>Calibrating the scale before you touch it — two worked examples:</b> On <i>Empathy and Compassion</i> — Planning sounds like 'I care about people and think I'd be good at this.' Progressing sounds like 'I sat with an upset classmate once and didn't know what to say, but I stayed anyway.' Demonstrating sounds like 'I noticed a coworker quietly struggling for weeks, asked directly instead of waiting for them to bring it up, and changed how I checked in with my whole team afterward.' On <i>Reliability and Dependability</i> — Planning is 'I think I'm a reliable person.' Progressing is 'I've mostly shown up on time for my part-time job.' Demonstrating is 'I never missed a shift in two years, including the week my car broke down, because I found my own coverage before telling my manager there was a problem.' Notice the difference isn't how impressive the story is — it's how specific and self-directed it is.",
      "<b>A prompt worth taking seriously before you rate yourself:</b> competencies built outside 'premed activities' count just as much as ones built inside them. Working a job, caregiving for family, translating for parents, organizing a team, surviving a hard year — all of that is real evidence if you can describe it specifically. This stage is where that gets captured for the first time, before it gets buried under years of 'official' premed activities.",
      "<b>One honest check before you lock in your ratings:</b> for every competency you're about to rate Demonstrating, ask yourself — if a stranger read only your written reflection, would they independently land on 'Demonstrating,' too, or are you being generous with yourself because the word sounds better than Progressing? There's no penalty anywhere in this roadmap for rating something Progressing instead. This gets more useful the more honestly it's calibrated, not less — a roadmap built on an inflated self-assessment just re-teaches you things you don't actually need.",
      "<b>What happens with this assessment:</b> it directly shapes your roadmap. Competencies you rate Demonstrating get referenced, not re-taught. Competencies you rate Planning get prioritized — the stages most relevant to building them get sequenced earlier. And a note on the AI in this platform, right now: every agent is built to help you think more clearly and reflect more honestly — none of them will ever write your personal statement, an essay, or an activity description for you, since every medical school application requires you to affirm that writing like this is entirely your own.",
      "<b>Your Reflection Coach unlocks today, not later:</b> it reads across your evidence log as it grows and points out patterns you might not notice yourself — the same strength showing up in unrelated settings, or the same hesitation recurring across stages. It's the one agent with you for the whole journey, not just one part of it.",
      "<b>What this looks like in practice (a composite, not a real student):</b> Priya, a sophomore, rated herself Demonstrating on Reliability and Dependability — she'd worked a part-time job through high school and never missed a shift, even during finals week. She rated Scientific Inquiry as Planning — she understood the idea of a testable question but had never designed or run one herself. Because of that, her roadmap surfaced the Research stage earlier than the default sequence, while Leadership — where she already had real evidence from coordinating coworkers' shift swaps — got referenced rather than re-taught."
    ],
    reflection: [
      "What did you learn about a competency by watching someone else do it well (or poorly)?",
      "What's one specific moment where you demonstrated it — specific enough someone else could picture it?",
      "Competencies built outside 'premed activities' (caregiving, work, translating for family) count just as much — where do you already have real evidence?"
    ],
    checklist: ["Complete the 17-competency self-assessment", "Answer the three-part reflection for every Progressing/Demonstrating rating", "Continue to Stage 02"]
  },
  {
    num: "02", year: "", title: "Be Yourself: Narrative", status: "done",
    competencies: "Self-Awareness · Ethical Responsibility to Self and Others",
    why: "Most students write their real 'why medicine' story senior year, reconstructing it from memory. This stage captures it now, while it's still close and specific.",
    parts: [
      "<b>Why this stage exists, and why it's this early:</b> most students don't write their 'why medicine' story until the summer before they apply — under deadline pressure, years removed from the actual moments that shaped them, reconstructing a narrative instead of remembering one. What you write here won't be your personal statement. It'll be the raw, honest material your future personal statement gets built from, two or three years from now, by you.",
      "<b>The difference between a real 'why' and a generic one:</b> a generic version sounds like 'I've always wanted to help people, and my volunteer experience confirmed my passion for medicine.' A real version names an actual moment, an actual person, an actual feeling — and is willing to sit with complexity rather than resolve everything neatly. Your real 'why' is allowed to be unclear, tied to something difficult, still evolving, or connected to something you haven't told many people.",
      "<b>Finding the real material:</b> you'll answer prompts about a specific moment near illness, caregiving, or a healthcare setting; a real person whose experience with health has stayed with you; if you're first-gen, what the role of translating or navigating systems for family has actually required of you; a moment where your interest in medicine felt uncertain or doubtful; and — in one honest sentence — why this and not something else, not what would sound impressive.",
      "<b>What this connects to:</b> everything you write becomes tagged entries in your evidence log under Self-Awareness and Ethical Responsibility to Self and Others — two of the hardest competencies to demonstrate convincingly later. This stage resurfaces deliberately in Research and Leadership, building a real throughline over years instead of retrofitting one at the end.",
      "<b>Revisiting this isn't optional, and it isn't automatic either — put an actual date on it.</b> 'This resurfaces later' only works if you actually come back to it. Right now, before you move on, set a real reminder for six months from today to reread what you just wrote — not to rewrite it, just to notice what still feels true and what's changed. Trusting yourself to remember on your own is exactly how this material gets lost by the time you actually need it.",
      "<b>The actual move that turns generic into specific:</b> it's not a mystery, it's a technique — swap an abstraction for one concrete noun, swap a summarized period of time for one five-minute window, and name one physical or sensory detail. Watch it happen to a real sentence: 'I've always wanted to help people' becomes 'I was the one who explained the doctor's words to my grandmother, in our kitchen, the week her test results came back' — same underlying idea, but only one of those two sentences could have been written by anyone else. Every prompt below is easier to answer once you're looking for that one window, not the general period around it.",
      "<b>What this looks like in practice (a composite, not a real student):</b> When Marcus answered the first prompt, his real material wasn't a single dramatic scene — it was noticing, at 16, that he was the only person in the ER waiting room who could translate his grandmother's symptoms for the attending physician, and feeling both useful and terrified in the same five minutes. That's the specific, complicated moment this stage is trying to surface — not a tidy, inspirational one, and not one he'd have remembered this clearly if he'd waited until senior year to write it down."
    ],
    reflection: [
      "A specific moment near illness, caregiving, or a healthcare setting — what actually happened, and what did you notice about yourself?",
      "A moment where your interest in medicine felt uncertain or complicated — doubt matters as much as clarity.",
      "In one honest sentence, why this and not something else — not what would sound impressive."
    ],
    checklist: ["Answer all five narrative prompts", "Re-read without editing — just notice what surprised you", "Continue to Stage 03"]
  },
  {
    num: "03", year: "", title: "Cost & Access", status: "current", unlocks: "Logistics & Pacing (cost-planning mode)",
    competencies: "Reliability and Dependability · Ethical Responsibility to Self and Others",
    sourceStatus: "verified",
    sourceNote: "Verified against AAMC's official Fee Assistance Program pages and AACOM's fee-waiver guidance (2026 cycle). Figures change annually — re-check before each new cycle.",
    why: "Almost no one tells you the price tag until you're already in it. This stage makes the real numbers visible early enough to plan around, not scramble around — and before Strategy asks you whether dual-applying fits your budget.",
    parts: [
      "<b>What the full cycle actually costs, in 2026 numbers:</b> MCAT registration is $355. The AMCAS primary application is $175 for your first school, plus $47 for each additional school — applying to 15–20 schools commonly runs well over $800 for the primary alone. Secondary applications commonly cost around $100 each, often several owed at once. Interview travel (flights, hotels, sometimes multiple trips in one month) is often the single largest, least-anticipated cost of the whole cycle.",
      "<b>The AAMC Fee Assistance Program (FAP), if approved, is worth over $2,000 in real savings:</b> MCAT registration drops from $355 to $145. The full MCAT Official Prep bundle (all six AAMC full-length practice exams, question banks, the CARS diagnostic tool — normally ~$390) is free. AMCAS application fees are waived entirely for one submission cycle, covering up to 20 medical schools — over $1,000 saved for a typical school list. You also get a free 2-year MSAR subscription and a waived or discounted AAMC PREview fee.",
      "<b>Eligibility is a real income threshold, not a subjective judgment:</b> your household income (and your parents', if you're under 26) must be at or below 400% of the federal poverty level for your family size, based on the prior year's tax return — a threshold higher than most students assume. Two details that trip people up: FAP benefits are NOT retroactive (register or submit before approval and you don't get reimbursed), and you can only apply once per calendar year — so apply for FAP before registering for the MCAT, not after.",
      "<b>Beyond FAP itself:</b> the AACOMAS Fee Waiver Program covers only your first program's $198 fee (not the $60 per additional program), uses its own income table rather than FAP's 400%-of-poverty rule, and expires 14 days after approval — tighter than FAP, not looser. Many individual schools will also waive secondary fees for FAP recipients, though you often have to know to ask or check the school's own MSAR listing. A smaller number of schools offer interview travel stipends or host-student housing, rarely advertised prominently.",
      "<b>The other side of the ledger — what medical school itself costs, not just applying to it:</b> average MD debt at graduation is around $223,000, and roughly 70% of graduates carry six-figure debt. That number is the real reason 'can I afford this' deserves an honest answer now, not senior year. It's also not the whole picture: HPSP (the military's Health Professions Scholarship Program) covers full tuition plus a stipend in exchange for a service commitment after residency, and MD-PhD programs are typically fully funded, including a stipend, for students genuinely drawn to physician-scientist research careers. Neither is right for most people — but knowing they exist now, rather than discovering them in your thirties with debt already taken on, is exactly the kind of thing this stage is for.",
      "<b>An honest word on reapplying, since it's common enough to plan for financially, not just emotionally:</b> a meaningful share of accepted students didn't get in on their first attempt — reapplying is a normal, well-worn path, not a rare exception or something to be quiet about. Financially, it means budgeting for the possibility of a second round of primary and secondary fees, not assuming one clean cycle covers everything. Emotionally, it connects directly to Resilience and Adaptability — one of the 17 competencies this whole roadmap is built around — and a thoughtful account of what changed between attempts is itself real, legible evidence, not something to hide from a future application.",
      "<b>What this looks like in practice (a composite, not a real student):</b> Daniela ran her family's numbers against the FAP threshold sophomore fall and found they qualified — but almost missed it, since she'd assumed 'fee assistance' meant something closer to welfare eligibility than a 400%-of-poverty-level test, which is far more generous than she expected. She applied for FAP three months before her planned MCAT date specifically so the approval would land first. What she got wrong initially: she assumed AACOMAS worked the same way as FAP, until she found its waiver expires just 14 days after approval."
    ],
    reflection: [
      "Which cost point worries you most right now, and why?",
      "Have you talked with anyone about how this cycle will actually be paid for? If not, what's stopped that conversation?",
      "Do you think you or your family might qualify for FAP, now that you know the real threshold?"
    ],
    checklist: ["Read Parts 1–3", "Answer all three reflection prompts", "Check your household income against the FAP threshold before registering for the MCAT", "Continue to Stage 04"]
  },
  {
    num: "04", year: "Year 2", title: "Strategy: MD or DO", status: "locked",
    competencies: "Self-Awareness · Critical Thinking",
    sourceStatus: "verified",
    sourceNote: "Verified against AACOM, ACOM, and individual DO-program admissions pages (2025–2026 cycle). LOR norms vary by school; treat as general guidance, not a universal rule.",
    why: "Most students default to MD without seriously weighing DO. Both are complete, licensed paths — this stage is an honest first look, not a permanent lock-in.",
    parts: [
      "<b>What actually differs, philosophically:</b> DOs train in osteopathic manipulative treatment (OMM) — a hands-on diagnostic and treatment approach — alongside the same core medical curriculum MDs receive, with a historical emphasis on whole-person, primary-care-oriented practice. In practice today, both MDs and DOs can specialize in any field and practice in any care setting; the philosophical emphasis at the training level doesn't restrict your eventual specialty choice.",
      "<b>Residency and licensing:</b> MD and DO graduates now train through a single, merged residency accreditation system (ACGME). DO graduates take the COMLEX board exam (some also take the USMLE); MD graduates take the USMLE. Both paths lead to a fully licensed practicing physician.",
      "<b>The numbers, honestly:</b> current-cycle MD matriculants average roughly 3.81 GPA and 512 MCAT; DO matriculants average roughly 3.6 GPA and 505 MCAT — but this doesn't mean DO is 'easier.' There are far fewer accredited DO programs nationally than MD programs, which keeps real competition high despite the different average stats.",
      "<b>Applications are separate systems:</b> MD applicants apply through AMCAS; DO applicants apply through AACOMAS — different platforms, different fees, different (though overlapping) timelines. Dual-applying means managing both, with real cost and time implications.",
      "<b>Letters of recommendation:</b> most DO programs require at least one letter from a physician (MD or DO), and many specifically prefer or strongly recommend it come from a DO — though this varies school by school. A DO-leaning student benefits from seeking out DO shadowing early enough to have that relationship in place well before application season.",
      "<b>State residency changes the math more than almost anything else in this stage:</b> for public MD and DO schools, in-state applicants are frequently admitted at several times the rate out-of-state applicants are — some public schools accept only a small handful of non-residents a year, regardless of stats. Before you build any mental model of reach/target/safety, years from now, know your own state's public-school landscape now — it's one of the most under-discussed facts in premed strategy, and it changes how competitive a given GPA/MCAT combination actually is for you specifically. To make that concrete: some state public schools admit close to zero out-of-state applicants in a given year — a handful, out of thousands who applied — while others admit out-of-state applicants at rates approaching their in-state numbers. That's not a small variance; it can be the difference between a school being a real reach and barely worth applying to at all, regardless of your stats. The only way to know which kind your home state has is to actually look, not assume.",
      "<b>What this looks like in practice (a composite, not a real student):</b> Jamal assumed he'd apply MD-only until a shadowing shift with a DO sports-medicine physician showed him OMM being used on an athlete he'd watched get injured the week before — the whole-person framing clicked in a way lecture-hall descriptions hadn't. He didn't abandon MD; he decided to dual-apply, and used what he'd already learned in Cost & Access to budget for two application fees instead of assuming he'd sort that out later."
    ],
    reflection: [
      "Does a whole-person, primary-care philosophy or a highly specialized one resonate more with you — or does it not matter much either way?",
      "Have you had any exposure to an osteopathic physician or OMM specifically? If not, is that worth deliberately seeking out before you decide?",
      "Are you drawn to a path for real reasons, or mostly prestige assumptions?",
      "Given what you saw in Cost & Access about separate applications and fees, does dual-applying feel realistic for your time and budget right now?",
      "Look up your home state's public medical school(s) and their out-of-state acceptance rate. Does what you find change how you're thinking about any of this?"
    ],
    checklist: ["Read Part 1 in full", "Answer all five reflection prompts", "Select MD-focused / DO-focused / Dual-applying (revisitable anytime)", "Continue to Stage 05"]
  },
  {
    num: "05", year: "", title: "Grades & MCAT", status: "locked", unlocks: "Logistics & Pacing (MCAT mode) · School Fit",
    competencies: "Quantitative Reasoning · Scientific Inquiry · Commitment to Learning and Growth · Human Behavior · Living Systems",
    sourceStatus: "verified",
    sourceNote: "Verified against AAMC MCAT Essentials, Repeat Policies, and 2025 FACTS matriculant data (2026 cycle). Fees and score bands change yearly.",
    why: "Most premeds treat the MCAT as a single event to survive. This stage builds a realistic, honest system for both grades and testing — including what a retake actually means.",
    parts: [
      "<b>What the MCAT actually is:</b> four sections — Biological and Biochemical Foundations of Living Systems, Chemical and Physical Foundations of Living Systems, Psychological/Social/Biological Foundations of Behavior, and Critical Analysis and Reasoning Skills (CARS) — scored 472–528. Registration is $355 in 2026 at U.S./Canadian centers; students approved for the AAMC Fee Assistance Program (FAP) pay $145 instead. The first two sections are literally the AAMC's <b>Living Systems</b> science competency under exam conditions; the third is the <b>Human Behavior</b> competency — this is the one stage where those two competencies get tested directly, not just described.",
      "<b>The retake reality, stated plainly:</b> you can test up to 3x in one calendar year, 4x across any two-year period, and 7x total in your lifetime — no-shows and voided exams still count. There is no way to hide a score: every attempt is automatically sent to every school you apply to. The median matriculant tests once; only ~15% test three or more times. A retake with real improvement is generally viewed as Resilience and Commitment to Learning and Growth, not a red flag — what raises concern is multiple attempts with flat or worsening scores.",
      "<b>A retake only helps if the prep genuinely changes.</b> Retaking a few weeks later with the same study method rarely produces a meaningfully different result. The honest first question before a retake: what specifically will you do differently, and do you have enough time to actually do it?",
      "<b>A real study system, not just 'study more':</b> the method matters more than the hours. Spaced repetition — reviewing material at increasing intervals instead of cramming it once — beats re-reading a passage five times in one sitting, because retention tracks how many times you've successfully <i>retrieved</i> something, not how many times you've looked at it. Active recall — closing the book and reconstructing an answer from memory, then checking — builds the same muscle an exam question actually requires; passively highlighting a textbook doesn't. Build toward a real full-length practice-exam cadence well before test day, reviewing every wrong answer for the reasoning gap behind it, not just the correct answer. None of this requires a paid course — a self-study plan built around these three habits, started early, consistently outperforms a last-minute course with none of them.",
      "<b>Course sequencing — you don't need to be a science major:</b> prerequisite coursework is required regardless of major, but the major itself doesn't need to be a science field. Committees care whether you completed the required coursework and performed well — and a GPA trend that improves over time reads differently than a flat average.",
      "<b>If a semester goes badly, here's what actually happens next:</b> a withdrawal (W) removes the class from your GPA calculation but still shows up on your transcript — one or two, honestly explained, generally reads as knowing your limits, not as a red flag. A retake at your own school typically <i>averages</i> both grades into your GPA rather than replacing the first one, regardless of any undergrad-only 'grade replacement' policy — AMCAS calculates GPA its own way, independent of what your transcript shows. If the repair needed is bigger than a retake or two, a post-bac program (structured additional undergraduate-level coursework) or an SMP — Special Master's Program (graduate-level coursework built specifically to prove you can handle a rigorous course load) — are both real, commonly used paths back into serious contention, not a last resort.",
      "<b>What this looks like in practice (a composite, not a real student):</b> Aisha scored a 502 on her first MCAT attempt after prepping mostly with flashcards. Rather than immediately re-registering, she spent three weeks diagnosing why — strong on content recall, but consistently running out of time on CARS. Her retake prep looked almost nothing like her first round: timed passage drills four days a week instead of more flashcards. Her second score was a 514 — and the story she later told wasn't 'I got a bad score and fixed it,' it was specifically what she'd learned about how she processes dense text under time pressure."
    ],
    reflection: [
      "What does a realistic weekly study rhythm look like for you, starting now — not just during MCAT prep?",
      "How did you actually respond the last time an academically important attempt didn't go as hoped?",
      "Which of the 4 MCAT sections do you expect to be hardest, and how could you start building that skill years early?"
    ],
    checklist: ["Read Parts 1–3", "Answer all three reflection prompts", "Log a rough target testing window", "Continue to Stage 06"]
  },
  {
    num: "06", year: "", title: "Clinical Experience", status: "locked", unlocks: "Experience Pathways",
    competencies: "Service Orientation · Understanding Others · Empathy and Compassion · Interpersonal Skills",
    sourceStatus: "verified",
    sourceNote: "Verified against AAMC guidance and multiple pre-health advising sources (2025–2026 cycle). Hour targets are planning ranges, not requirements.",
    why: "'Get clinical hours' is common advice and also the vaguest. This stage helps you choose a lane deliberately based on your real constraints, not convenience.",
    parts: [
      "<b>Shadowing and clinical experience are not the same thing.</b> Shadowing means observing — standing alongside a physician without direct involvement in patient care. Clinical experience means direct, real interaction with patients — taking vitals, transporting patients, sitting with someone in hospice, having conversations. This is where Service Orientation, Understanding Others, Empathy and Compassion, and Interpersonal Skills actually get tested and built, not just witnessed.",
      "<b>Realistic benchmarks, as targets not requirements:</b> roughly 30–50 hours of shadowing, ideally across a couple of different specialties rather than one physician the whole time. Roughly 150+ hours of direct clinical experience is where most applications stop reading as 'no real clinical exposure.' Paid clinical roles — scribing, CNA, EMT, phlebotomy — count fully as genuine clinical experience, and getting paid while building this is a legitimate strategy, not a lesser path.",
      "<b>What matters more than any number is consistency and depth.</b> A student who shows up for a year at the same hospice, builds real relationships, and can describe specific growth reads as stronger than someone who crams 300 hours into one summer and can't say much beyond 'it was rewarding.'",
      "<b>A caution worth taking seriously:</b> some paid international 'medical internship' programs promise undergrads hands-on tasks well beyond what they're legally or ethically qualified to do. This has drawn real concern, including from the AAMC, because it can put patients at genuine risk. If a program's pitch sounds like 'you'll actually practice medicine as an undergrad' — that's a signal to look elsewhere, not a selling point.",
      "<b>If you don't have a car, a connection, or free time — here's an actual plan, not just 'ask around':</b> community health centers and free/sliding-scale clinics are almost always more open to undergrad volunteers than hospitals are, and many are reachable by public transit in a way large hospital systems aren't. Hospice organizations constantly need volunteers and typically provide their own training, no prior connections required. The highest-leverage cold contact is usually a volunteer coordinator, not a physician directly — search '[your city] hospice volunteer' or '[your city] free clinic volunteer' and call, don't just email, since many small clinics are more responsive by phone. If your real constraint is needing paid work rather than unpaid time, CNA certification (often a matter of weeks, not months) opens direct-patient-contact jobs with actual pay, which solves the schedule and the access problem in the same move.",
      "<b>What this looks like in practice (a composite, not a real student):</b> Tomás needed paid work, so he became a hospital scribe rather than volunteering unpaid — and worried, until this stage, that paid work would read as less genuine. It didn't: over a year he documented hundreds of patient encounters across the ED, building real fluency in how physicians actually think through a differential. What made it strong wasn't that it was paid — it was that he stayed a full year at the same site instead of switching around for convenience."
    ],
    reflection: [
      "Given your real schedule and financial needs, does a paid clinical role or unpaid volunteering fit better right now?",
      "Does a specific clinical setting connect to your Stage 02 'why' more than others?",
      "What's one access barrier (transportation, an introduction) worth bringing to the Clinical Pathways agent?"
    ],
    checklist: ["Read Parts 1–3", "Answer all three reflection prompts", "Choose an initial direction (revisitable)", "Continue to Stage 07"]
  },
  {
    num: "07", year: "Year 3", title: "Volunteering & Compassion", status: "locked",
    competencies: "Service Orientation · Understanding Others",
    sourceStatus: "verified",
    sourceNote: "Verified against AMCAS's real Work & Activities category structure and current advising sources (2025–2026 cycle). Hour ranges vary by school mission.",
    why: "AMCAS actually splits volunteering into Medical/Clinical and Not Medical/Clinical as two separate categories — this stage builds real substance in the second one.",
    parts: [
      "<b>Why this is separate from Clinical Experience:</b> your eventual AMCAS application actually separates 'Community Service/Volunteer – Medical/Clinical' from 'Community Service/Volunteer – Not Medical/Clinical' as two distinct categories. Committees generally want real substance in both, not just a large number in one — don't assume 300 clinical-volunteering hours covers this requirement too.",
      "<b>What this is actually testing:</b> Service Orientation and Understanding Others are demonstrated more convincingly outside medical settings than inside them, precisely because there's less obvious incentive. Tutoring underserved students, working at a shelter, coaching, supporting a nonprofit — these show a pattern of service that exists independent of your application.",
      "<b>A caution worth taking seriously:</b> choosing a cause because it sounds impressive rather than because you're genuinely drawn to it tends to produce shallow, forgettable involvement. The strongest version isn't the most prestigious-sounding organization; it's the one you'll actually keep showing up to.",
      "<b>Realistic benchmarks:</b> roughly 50–100+ hours of genuine, sustained non-clinical service as a starting target, though this varies more by school mission than almost any other category — some service-oriented or faith-based schools expect hundreds or 1,000+ hours. Consistency over a single burst matters more than the raw number.",
      "<b>'Sustained' looks different depending on your actual life, and that's fine:</b> a student with real free time might commit two hours a week to the same tutoring program for two straight years. A student working two jobs might only be able to give one Sunday a month to their church's food pantry — but do it without fail, for two years, and build a real relationship with the people who run it. A student with heavy caregiving responsibilities at home might not have room for an external commitment at all in some semesters, and the honest, specific reflection on what that caregiving itself required of you can be its own real evidence, even if it never shows up as a logged volunteer hour. What committees are actually reading for is follow-through relative to your real capacity, not a fixed number everyone is equally positioned to hit.",
      "<b>What this looks like in practice (a composite, not a real student):</b> Wei almost picked an environmental nonprofit because it sounded distinctive on paper, before admitting she didn't actually care about it. She chose weekend tutoring at a youth literacy program instead — less unusual-sounding, but something she kept showing up to for two full years. What she could eventually say about it wasn't 'I tutored 200 hours' — it was a specific account of watching one student go from refusing to read aloud to volunteering to read first."
    ],
    reflection: [
      "What form of service would you do even with zero connection to your application?",
      "Is there a population you feel a specific pull toward serving, and where does that come from?",
      "What's one specific moment from current service worth logging as evidence right now?"
    ],
    checklist: ["Read Parts 1–2", "Answer all four reflection prompts", "Log a current or planned non-clinical commitment", "Continue to Stage 08"]
  },
  {
    num: "08", year: "", title: "Research or No Research?", status: "locked", unlocks: "Research Navigator",
    competencies: "Scientific Inquiry · Critical Thinking · Written Communication · Commitment to Learning and Growth",
    sourceStatus: "pending_review",
    sourceNote: "Content expanded and fact-checked against publicly documented PI-outreach and research-mentorship norms — but bench-research-culture specifics still benefit from a real, current PI or research advisor's review before this is treated as fully authoritative. Not yet independently verified like the other stages.",
    why: "Research is not required — but it needs to be legible. This stage helps you decide on purpose, before spending hundreds of hours finding out the hard way.",
    parts: [
      "<b>What admissions committees are actually reading for:</b> not whether you did research, but three things, in order — did you understand what you were doing or just show up; does it connect to something you've said elsewhere in your application; and did you finish something. Notice what's not on this list: prestige of the lab, whether it was 'real' bench science, or hours logged.",
      "<b>Three real paths, not just yes or no:</b> Wet-lab/bench research (best if you're curious about mechanism-level questions and don't mind slow, often frustrating timelines). Clinical or public health research (best if you're drawn to questions about patients or populations, often more schedule-flexible and faster to a tangible output). No formal research (a legitimate, complete answer — a committee would rather see 400 excellent, reflective clinical hours than a research line you clearly didn't want to be in).",
      "<b>A decision isn't binding, but drift should be visible.</b> You can start one path and switch — what matters is that the decision itself is deliberate and dated, so later, when building your roadmap or personal statement, you can see the actual reasoning rather than reconstructing a story after the fact.",
      "<b>The PI outreach email that actually gets answered:</b> keep it under 150 words. Name one specific paper or project of theirs — not 'I'm interested in your research' generically — since that one detail is what tells them you didn't mass-email fifteen labs. Ask for 15 minutes to talk, not a position outright; a position is a conversation's outcome, not its opening line. Don't attach a resume or transcript unless they ask for one. No reply after about a week is normal, not a rejection — one polite follow-up is expected, not pushy.",
      "<b>What the Research Navigator agent is for, once unlocked:</b> not to make the decision for you — that already happened here. It's for the next layer of specific questions: what to do if a lab isn't working out, how to talk about an unfinished project honestly on AMCAS, and troubleshooting your own outreach if the template above isn't landing.",
      "<b>What this looks like in practice (a composite, not a real student):</b> Owen joined a wet lab sophomore year because everyone said research was mandatory, spent a semester on tasks he didn't understand the point of, then honestly logged a decision to leave — not because research failed him, but because he'd never actually wanted mechanism-level questions in the first place. He switched to a health-disparities survey project and found he could explain, unprompted, why the research question mattered. The dated log of why he switched is what makes both entries legible instead of looking like he just quit."
    ],
    reflection: [
      "When you imagine a research project going well, what does 'well' actually look like to you?",
      "Does either research path connect to your Stage 02 'why,' or does it feel separate?",
      "What's your real time constraint this semester, and which path fits inside it honestly?"
    ],
    checklist: ["Read Parts 1–2", "Answer all three reflection prompts", "Select a path (Wet-lab / Clinical / Public Health / None for now)", "Log your reasoning"]
  },
  {
    num: "09", year: "", title: "Leadership", status: "locked",
    competencies: "Teamwork and Collaboration · Interpersonal Skills · Reliability and Dependability",
    sourceStatus: "verified",
    sourceNote: "Verified against current pre-health advising guidance (2025–2026 cycle). No official AAMC requirement exists here — this is a commonly cited heuristic, not a rule.",
    why: "'Get a leadership title' sends premeds chasing positions without substance. This stage is about finding or building leadership with real initiative behind it.",
    parts: [
      "<b>What 'leadership' actually means here:</b> almost nothing to do with a title, and everything to do with three things — initiative (did you notice a real problem and do something about it, rather than waiting to be assigned a role that already existed), responsibility for others (did people depend on you, and did you follow through), and working through other people (did you motivate or coordinate a group, not just do good individual work).",
      "<b>The honest trap to avoid:</b> joining multiple organizations specifically to angle for a title, then holding that title without real substance behind it. Admissions committees read hundreds of applications a year and can usually tell the difference between someone who led and someone who merely occupied a position. A smaller role done with real initiative reads as stronger evidence than a big title held passively.",
      "<b>A realistic target:</b> three or more distinct leadership experiences, each sustained for at least a few months, across your undergraduate years — not a dozen shallow one-off roles. The strongest leadership stories tend to follow one pattern: identifying a problem nobody else was solving and doing something about it, rather than simply inheriting a role someone else already built.",
      "<b>What this looks like in practice (a composite, not a real student):</b> Fatima noticed new volunteers at her free clinic kept making the same intake-paperwork mistakes because no one trained them consistently — so she wrote up a one-page onboarding guide and started walking new volunteers through it herself, without being asked or given a title for it. A year later the clinic coordinator formalized it as an official role. The strength of the story isn't the eventual title; it's that she solved a real, specific problem before anyone gave her permission to.",
      "<b>A second kind of leadership story, just as real:</b> not everyone founds something, and this stage isn't only for people who do. One student never held a title in his research lab, but he became the person every new undergrad ended up asking for help — not because it was assigned, but because he noticed people struggling with the protocol he'd once struggled with himself, and made himself available without being asked. Two years and six mentees later, his PI mentioned it, unprompted, in his recommendation letter. No founding, no title — just consistency other people came to depend on.",
      "<b>A third kind, different again:</b> when her volunteer coordinator quit mid-semester with no replacement lined up, one student with no formal authority at all kept the shift schedule from collapsing for six weeks by simply stepping in and doing it, without waiting for someone official to fix it. She never got the coordinator title — someone else was eventually hired for that. But she could describe, specifically, what she'd learned about holding something together under real pressure, which is exactly the kind of substance this stage is asking you to find, whether or not it comes with an official role attached."
    ],
    reflection: [
      "A specific moment you took initiative because you noticed something needed doing, not because you were assigned to.",
      "Is there a real gap nobody's solving that you'd actually want to solve?",
      "If you hold a titled position now — are you doing something with it, or holding it passively?"
    ],
    checklist: ["Read Parts 1–2", "Answer all four reflection prompts", "Identify one leadership commitment with real substance", "Continue to Stage 10"]
  },
  {
    num: "10", year: "Year 4", title: "Personal Brand", status: "locked", unlocks: "Letters & Relationships",
    competencies: "Self-Awareness · Written Communication · Oral Communication",
    sourceStatus: "verified",
    sourceNote: "Verified against AAMC letter-of-evaluation guidance and documented admissions practice (2025–2026 cycle). Social media review varies by school.",
    why: "The final Foundations stage: your digital footprint, your letters of recommendation, and why 'being unique' isn't a packaging problem — it's what your evidence log already proves.",
    parts: [
      "<b>Your digital footprint is part of your application, whether you plan for it or not.</b> Admissions committees have openly acknowledged that they do look applicants up online, and that what they find can help or hurt a candidacy. A simple first step: search your own name the way an admissions officer might. LinkedIn is worth taking seriously too — a clean, professional profile can genuinely help, not just something to manage as a liability.",
      "<b>Letters of recommendation — build this years in advance, not senior year.</b> A strong portfolio is typically 4–6 letters: a science professor, a non-science professor, and at least one supervisor from clinical, research, or leadership work who can speak to real responsibility. When you're working closely with someone who might eventually write for you, ask toward the end of that time together, while their impression is fresh — even if you won't submit for years.",
      "<b>The exact phrasing matters:</b> ask 'Would you be willing to write me a strong letter of recommendation?' — that specific word gives someone an easy, low-awkwardness way to decline if they can't genuinely advocate for you, protecting you from a lukewarm letter that quietly undermines an otherwise strong file.",
      "<b>'Being unique' isn't a marketing exercise.</b> The students who read as genuinely distinctive aren't the ones with the most unusual resume line — they're the ones whose application is specific and consistent, because it's built from real, accumulated evidence rather than assembled to sound impressive. This is exactly what your evidence log has been building since Stage 01.",
      "<b>Once you have an actual draft, years from now:</b> the Personal Statement Checker flags clichés, vague phrases, and two specific patterns — whether the essay centers your own growth or reads as admiration of someone else ('Aspirations vs. Inspirations'), and whether it's specific about why a physician rather than another healthcare role. It only reads what you already wrote; it never drafts or rewrites anything.",
      "<b>What this looks like in practice (a composite, not a real student):</b> Sofia almost built her 'unique angle' around a semester abroad because an advisor told her international experience stands out. When she actually searched her own evidence log instead, what kept resurfacing across three different stages was her habit of translating medical information for her non-English-speaking grandmother — showing up in her Narrative reflection, a Clinical Experience reflection, and a Volunteering entry, without her ever planning it that way. That was the real throughline, not the trip. She asked her clinic supervisor — who'd watched her do exactly this for a year — to be one of her letter-writers, specifically because he could speak to it firsthand.",
      "<b>What you'll eventually be tested on in an interview — worth knowing the shape of now, even years before you'll actually do one:</b> most schools use one of two formats. A traditional interview is a single, longer conversation, often one-on-one or panel, covering your application broadly. An MMI (Multiple Mini Interview) is a series of short stations, each a few minutes, usually built around an ethical or situational prompt rather than a memorized answer — it's testing how you think in the moment, not what you rehearsed. Neither format rewards a polished script; both reward the same thing this whole bootcamp has been building toward — specific, honest self-knowledge you can speak from. You don't need to practice interviewing yet. Knowing the shape of what's coming is enough to choose your experiences and reflections with it already in mind.",
      "<b>What this Foundations Track was actually for, now that you've finished it:</b> building a real, evidenced case — competency by competency, year by year — before you're under application-cycle pressure to invent one from memory. It ends here on purpose. Phase 2 is a different kind of work: building your real school list against your actual GPA/MCAT, tracking and writing secondary essays under real deadlines, structured practice for the interview formats above, and everything else that happens mid-cycle — LOR submission, waitlist decisions, comparing offers. None of that is part of this bootcamp, on purpose — it needs tools built for an active cycle, not a self-paced one. When you're ready for it, that's what AesculaMD's full platform is built for. This isn't a dead end; it's a deliberate handoff to the part of the process that needs you to already have what you just spent years building."
    ],
    reflection: [
      "Search your own name — anything worth addressing before it's relevant to an application?",
      "Is there someone you're working with now who you'd want a future letter from — have you actually talked with them about your path?",
      "Are you tempted to reach for something manufactured-sounding, or can you point to something real from your evidence log?"
    ],
    checklist: ["Complete your name search", "Identify a future letter-writer and a plan to strengthen that relationship", "Answer all three reflection prompts", "Review your full evidence log across all stages"]
  }
];

// The 17 AAMC Premed Competencies, grouped by category — used by the Stage 01
// self-assessment form and by the roadmap priority-scoring logic in app.js.
const COMPETENCIES = [
  { name: "Commitment to Learning and Growth", category: "Professional" },
  { name: "Empathy and Compassion", category: "Professional" },
  { name: "Ethical Responsibility to Self and Others", category: "Professional" },
  { name: "Interpersonal Skills", category: "Professional" },
  { name: "Oral Communication", category: "Professional" },
  { name: "Reliability and Dependability", category: "Professional" },
  { name: "Resilience and Adaptability", category: "Professional" },
  { name: "Self-Awareness", category: "Professional" },
  { name: "Service Orientation", category: "Professional" },
  { name: "Teamwork and Collaboration", category: "Professional" },
  { name: "Understanding Others", category: "Professional" },
  { name: "Human Behavior", category: "Science" },
  { name: "Living Systems", category: "Science" },
  { name: "Critical Thinking", category: "Thinking & Reasoning" },
  { name: "Quantitative Reasoning", category: "Thinking & Reasoning" },
  { name: "Scientific Inquiry", category: "Thinking & Reasoning" },
  { name: "Written Communication", category: "Thinking & Reasoning" }
];

// realTool: page id of the actual tool this agent's description now points to, where one
// exists — lets the Agents page link straight to it instead of just describing it.
// chatGreeting/chatFallback/chatTopics[].reply support {token} placeholders resolved
// against real app state at send-time by resolveChatTokens() in app.js — see
// content/agent-chat-design.md. These are scripted, keyword-matched heuristics, not a
// real model call: matches this prototype's honesty stance everywhere else (Committee,
// Interview Simulator, PS Checker).
const AGENT_DATA = [
  { id: "reflection-coach", name: "Reflection Coach", desc: "Reads across your whole evidence log to notice real patterns across competencies and stages — never drafts content for you, just asks better questions.", stageTitle: null, realTool: "evidencelog", realToolLabel: "Open Evidence Log",
    chatGreeting: "Hi — I read across your whole Evidence Log, not just one stage. You've got {evidenceCount} entries logged so far, covering {competencyCoverage} of the 17 competencies. What's on your mind?",
    chatTopics: [
      { keywords: ["pattern", "notice", "common", "theme", "recurring"], label: "a pattern you're noticing", reply: "Looking across your {evidenceCount} entries: {patternRead}" },
      { keywords: ["stuck", "blank", "nothing", "don't know what", "cant think", "can't think"], label: "feeling stuck on what to log", reply: "A lot of students feel like they have nothing until they actually look. Competencies built outside 'premed activities' — a job, caregiving, translating for family, surviving a hard year — count just as much as ones from official premed activities. Is there something like that you haven't logged yet?" }
    ],
    chatFallback: "I'm built to read your Evidence Log and ask better questions, not draft anything for you. Ask me about a pattern I might notice, or tell me about something real you haven't logged yet — {evidenceCount} entries so far, across {competencyCoverage} of 17 competencies." },

  { id: "narrative-thread", name: "Narrative Thread", desc: "Turns your evidence log into your personal statement throughline — never drafts submittable text, per AMCAS's own-words requirement. Pairs with the Personal Statement Checker once you have an actual draft.", stageTitle: null, realTool: "pschecker", realToolLabel: "Open PS Checker",
    chatGreeting: "Hi — once you've got real material logged from Stage 02 (Narrative) and beyond, I help you find the throughline connecting it. You've got {narrativeCount} narrative-tagged entries so far.",
    chatTopics: [
      { keywords: ["throughline", "theme", "connect", "thread", "tie together"], label: "finding my throughline", reply: "A throughline usually isn't one big theme — it's 2–3 specific moments across different stages that all point at the same real thing about you. You're currently on {currentStageTitle}; is there a moment there that echoes something you already wrote in Narrative?" },
      { keywords: ["draft", "write my", "write me", "essay", "statement", "can you write"], label: "drafting my essay", reply: "I can't draft your personal statement or any submittable text for you — every school requires it to be entirely your own words. Once you have an actual draft, paste it into the PS Checker and I'll help you see it structurally, not word it for you." }
    ],
    chatFallback: "Tell me about a specific moment, and I'll help you see how it connects to your other logged entries — {narrativeCount} narrative-tagged so far. I never write the words myself." },

  { id: "family-conversations", name: "Family Conversations", desc: "Explaining the timeline, gap years, and this whole process to family unfamiliar with it — especially useful if you're the first in your family to go through anything like this.", stageTitle: null, realTool: null,
    chatGreeting: "Hi — explaining a long premed timeline to family who haven't been through it is its own skill, especially if no one around you has done this before. What's the conversation you're dreading?",
    chatTopics: [
      { keywords: ["gap year", "gap", "time off", "taking a year"], label: "talking about a gap year", reply: "A framing that tends to land better than 'I need a gap year' is naming what the gap year is *for*, concretely — an MCAT retake, more clinical hours, research — not just 'I need more time.' Specificity is what reassures people, not reassurance itself." },
      { keywords: ["cost", "debt", "money", "afford", "pay for", "expensive"], label: "explaining the cost to my family", reply: "Family financial worry is usually about the unknown, not the actual number. If you've been through Cost & Access, you have real figures — showing an actual plan (FAP eligibility, in-state vs. out-of-state math) tends to land better than reassurance alone." },
      { keywords: ["understand", "explain", "don't get it", "doesn't get it", "confused", "why does it take", "why so long", "first gen", "first-gen"], label: "why this takes so long, in plain terms", reply: "The version that tends to land with family who haven't seen this process before: 'college first, then four more years of medical school, then three to seven more years of paid, supervised training called residency before I can practice on my own — the same is true for every doctor you've ever met, it's just not visible from the outside.' Naming the actual stages, not just 'it takes a long time,' usually turns confusion into something they can actually picture." }
    ],
    chatFallback: "Tell me who you're talking to and what they're worried about — a parent's worry about time is usually different from a sibling's, or a partner's." },

  { id: "experience-pathways", name: "Experience Pathways", desc: "Shadowing, scribing, CNA, EMT, and non-clinical service — matched to your schedule, comfort level, and what's actually accessible to you. Real hour-logging and tracking live in the full AesculaMD platform.", stageTitle: "Clinical Experience", realTool: null,
    chatGreeting: "Hi — let's talk through what's actually accessible to you right now, given your schedule and comfort level.",
    chatTopics: [
      { keywords: ["shadow", "shadowing"], label: "shadowing", reply: "Shadowing is usually the easiest access point, but on its own it demonstrates observation, not hands-on care — worth pairing with something more hands-on if you can." },
      { keywords: ["which", "choose", "best", "better", "should i do"], label: "which experience to choose", reply: "It depends on your schedule and comfort level more than which one 'looks best' — a school genuinely doesn't rank scribing above CNA work. What's actually accessible to you right now, given your schedule?" }
    ],
    chatFallback: "Tell me what's actually available to you — schedule, transportation, comfort level — and I can speak to real tradeoffs instead of guessing. Once you're logging real hours, that tracking lives in the full AesculaMD platform." },

  { id: "research-navigator", name: "Research Navigator", desc: "PI outreach, lab fit, wet-lab vs. clinical vs. public health research.", stageTitle: "Research or No Research?", realTool: null,
    chatGreeting: "Hi — Research or No Research is a real decision either way, not a default yes. Where are you on it?",
    chatTopics: [
      { keywords: ["pi", "professor", "lab", "email", "outreach", "reach out"], label: "emailing a PI", reply: "A PI outreach email that gets answered is short, specific about why *their* lab (not research in general), and asks for 15 minutes — not a position outright. Want to talk through what you'd actually say?" },
      { keywords: ["wet lab", "clinical research", "public health", "which type", "kind of research"], label: "which type of research to pursue", reply: "Wet-lab, clinical, and public health research all count the same on an application — what matters is that you can speak to why you picked it and what you actually did, not the label." }
    ],
    chatFallback: "Tell me what's pulling you toward or away from research — and remember, 'no research, with a real reason' is a legitimate logged decision too, not a gap." },

  { id: "logistics-pacing", name: "Logistics & Pacing", desc: "MCAT timing, course sequencing, and cost planning across your remaining semesters.", stageTitle: "Grades & MCAT", realTool: "timeline", realToolLabel: "Open Timeline",
    chatGreeting: "Hi — {targetCycleLine} Want to look at your Timeline together?",
    chatTopics: [
      { keywords: ["mcat", "test date", "retake", "testing window"], label: "my MCAT timing", reply: "{targetCycleLine} Your Timeline page turns that into an actual term-by-term plan, with the MCAT window as a real milestone, not just a date on a calendar somewhere else." },
      { keywords: ["course", "sequence", "schedule", "class", "classes"], label: "course sequencing", reply: "Course sequencing mostly comes down to finishing your prerequisite science courses before your MCAT window, with enough runway to actually study — not squeezing a test date into whatever's left over." }
    ],
    chatFallback: "{targetCycleLine} Ask me about MCAT timing or course sequencing, or open your Timeline to see the actual term-by-term plan." },

  { id: "school-fit", name: "School Fit", desc: "School selection strategy — how to build a balanced list, not a school-by-school comparison tool (the detailed Reach/Target/Safety database lives in the full AesculaMD platform once you're deep in your application cycle).", stageTitle: "Grades & MCAT", realTool: null,
    chatGreeting: "Hi — school strategy is more about the shape of your list than any one school. Where are you in thinking about it?",
    chatTopics: [
      { keywords: ["reach", "safety", "target", "balance", "balanced"], label: "my reach/safety balance", reply: "A balanced list has real reach, target, and safety schools — not just a wishlist of names you recognize. If you can't name at least one or two realistic safety schools yet, that's usually the first gap worth closing." },
      { keywords: ["how many", "how much", "apply to", "list size"], label: "how many schools to apply to", reply: "Most applicants apply to 15–20 schools spanning reach, target, and safety. Fewer than that concentrates your risk; a lot more mostly adds cost without much benefit past a certain point." }
    ],
    chatFallback: "Tell me where you're at with your list — how many schools, and whether you've thought about reach/target/safety balance yet. Detailed school-by-school comparisons are part of the full AesculaMD platform once you're further into your cycle; here I can help with the strategy behind the list." },

  { id: "letters-relationships", name: "Letters & Relationships", desc: "Timing your ask and keeping relationships warm years before you actually need the letter. Real letter-writer tracking lives in the full AesculaMD platform.", stageTitle: "Personal Brand", realTool: null,
    chatGreeting: "Hi — Stage 10's own advice: ask while their impression of you is still fresh, not when you actually need the letter. Who are you thinking about?",
    chatTopics: [
      { keywords: ["when", "timing", "ask", "how early"], label: "when to ask for a letter", reply: "Ask as soon as a relationship is strong, not when you need the letter — waiting means asking someone to remember specifics from years ago." },
      { keywords: ["who", "choose", "which", "pick"], label: "who to ask", reply: "The strongest letter-writers can speak to something specific about you, not just your grade or your title. Someone who can describe one real moment beats someone more prestigious who barely remembers you." }
    ],
    chatFallback: "Ask me about timing or who to choose — once you're ready to actually track and manage letter-writers, that lives in the full AesculaMD platform." }
];

// Plain-language glossary — added directly in response to a persona walkthrough where a
// first-gen student had to look half these terms up in a separate tab. Every term here
// actually appears somewhere in the 10 stages; this isn't a generic premed dictionary.
const GLOSSARY_TERMS = [
  { term: "AMCAS", category: "Applications", definition: "American Medical College Application Service — the primary (first-round) application almost all MD schools use." },
  { term: "AACOMAS", category: "Applications", definition: "The DO-school equivalent of AMCAS — a separate application, separate fees, separate platform." },
  { term: "TMDSAS", category: "Applications", definition: "Texas Medical & Dental Schools Application Service — its own separate system used by Texas's public medical and dental schools." },
  { term: "Secondary (application)", category: "Applications", definition: "A school-specific follow-up application sent after your primary, usually with its own fee and its own essay prompts." },
  { term: "MSAR", category: "Applications", definition: "Medical School Admission Requirements — AAMC's official, school-by-school database of real GPA/MCAT ranges, requirements, and mission focus." },
  { term: "FAP", category: "Funding & Fee Waivers", definition: "Fee Assistance Program — AAMC's need-based waiver that discounts your MCAT and covers your AMCAS fees if your household income is at or below 400% of the federal poverty level." },
  { term: "HPSP", category: "Funding & Fee Waivers", definition: "Health Professions Scholarship Program — a military scholarship covering full tuition plus a stipend, in exchange for a service commitment after residency." },
  { term: "MCAT", category: "Exams", definition: "Medical College Admission Test — the standardized exam nearly every applicant takes, scored 472–528." },
  { term: "CARS", category: "Exams", definition: "Critical Analysis and Reasoning Skills — one of the MCAT's four sections; pure reading comprehension and reasoning, no science content." },
  { term: "MMI", category: "Exams", definition: "Multiple Mini Interview — an interview format built from several short stations, usually ethical or situational prompts, testing how you think in the moment rather than a memorized answer." },
  { term: "USMLE", category: "Exams", definition: "United States Medical Licensing Examination — the board exam MD students (and some DO students) take during and after medical school." },
  { term: "COMLEX", category: "Exams", definition: "Comprehensive Osteopathic Medical Licensing Examination — the DO-specific equivalent of the USMLE." },
  { term: "MD", category: "Degrees & Licensing", definition: "Doctor of Medicine — one of the two complete, licensed paths to becoming a physician." },
  { term: "DO", category: "Degrees & Licensing", definition: "Doctor of Osteopathic Medicine — the other complete, licensed path; same core medical training as MD, plus OMM." },
  { term: "OMM", category: "Degrees & Licensing", definition: "Osteopathic Manipulative Medicine — the hands-on diagnostic and treatment approach DO students train in alongside standard medical coursework." },
  { term: "ACGME", category: "Degrees & Licensing", definition: "Accreditation Council for Graduate Medical Education — the single, merged body that accredits residency programs for both MD and DO graduates." },
  { term: "Post-bac", category: "Coursework & GPA Repair", definition: "Post-baccalaureate program — structured, additional undergraduate-level coursework taken after finishing a bachelor's degree, often to strengthen a GPA or complete missing prerequisites." },
  { term: "SMP", category: "Coursework & GPA Repair", definition: "Special Master's Program — graduate-level coursework built specifically to prove you can handle a rigorous course load, commonly used for real GPA repair." },
  { term: "PI", category: "Research", definition: "Principal Investigator — the professor or scientist who runs a research lab; the person you'd actually email to ask about joining one." }
];

// Checked before any agent's own chatTopics, across every agent — a student naming
// something vulnerable (being first-gen, having no one to ask, feeling lost) deserves to
// be heard specifically, not answered with a recitation of their own evidence-log count.
// Added directly in response to a persona walkthrough that caught this exact failure.
const LIFE_CONTEXT_SIGNALS = [
  { keywords: ["first in my family", "first-gen", "first gen", "no one in my family", "nobody in my family"],
    reply: "That's real, and it changes what this process feels like — you're doing this without the built-in map a lot of premeds don't even realize they have. You're not behind for not having one. Tell me what's actually in front of you right now, and I'll help you think through it specifically, not generically." },
  { keywords: ["don't know where to start", "dont know where to start", "no idea where to start", "don't know what to do", "dont know what to do"],
    reply: "Fair place to be — almost everyone who's done this honestly felt this exact way at some point, they just don't advertise it. The real starting point isn't a perfect plan, it's one true thing about where you actually are right now. What's the one part of this that feels most unclear to you?" },
  { keywords: ["no one to ask", "nobody to ask", "don't have anyone", "dont have anyone", "all alone", "on my own with this", "by myself in this"],
    reply: "Not having someone to ask is a real gap, not a personal failing — that's exactly the gap this platform exists to help close. I can't replace a mentor who's known you for years, but I can be specific and honest with you right now. What's the actual question underneath this?" }
];

// Personal Statement Checker reference data — see
// content/personal-statement-checker-design.md for what was ported directly (these two
// dictionaries, pure string matching, no AI in the source either) vs. redesigned as
// honest heuristics (the aspirations/physician-specificity checks).

const CLICHE_PHRASES = {
  "ever since i was young": "Replace with a specific age and concrete memory.",
  "passion for helping": "Name the exact action you took and who benefited.",
  "make a difference": "Specify what changed and for whom.",
  "i have always wanted": "Show the pivotal moment that confirmed this desire.",
  "unique perspective": "Describe the actual perspective — what do you see differently?",
  "shadowing experience": "Name the physician, specialty, and one thing you observed.",
  "truly impacted": "Replace with the measurable or emotional outcome.",
  "solidified my desire": "Describe what was uncertain before and what resolved it.",
  "life-changing": "Describe the before and after in one sentence.",
  "touched my heart": "Show the physical or emotional reaction you actually had.",
  "dream of becoming": "State your goal directly without 'dream' framing.",
  "humble": "Show humility through an action, not by claiming it.",
  "journey": "Replace with the specific timeline or transformation."
};

const VAGUE_PHRASES = {
  "learned a lot": "Name the top one or two specific lessons.",
  "gained experience": "State exactly what skill you developed.",
  "so much": "Quantify: how much? how many?",
  "helped with": "Specify your exact role and contribution.",
  "worked with": "Describe your specific responsibilities.",
  "i feel that": "Remove and state the claim directly.",
  "i think that": "Remove and assert your point with evidence.",
  "various": "List the actual items (pick the top 2-3).",
  "many things": "Name the specific things."
};

const AMCAS_CONTENT_TYPES = [
  { id: "personal_statement", name: "Personal Statement", limit: 5300 },
  { id: "activity_description", name: "Activity Description", limit: 700 },
  { id: "most_meaningful", name: "Most Meaningful Narrative", limit: 1325 },
  { id: "secondary_essay", name: "Secondary Essay (typical)", limit: 2000 }
];

// "Should I Be a Doctor?" quiz — adapted from AesculaMD_1's ShouldIBeADoctor.tsx.
// See content/additional-tools-design.md for what was updated (two stale stats) vs kept
// as-is (the question set and scoring, which needed no AI and none here either).
const DOCTOR_QUIZ_QUESTIONS = [
  { question: "Why do you want to be a doctor?", subtext: "Choose the answer that feels most true, even if it's not perfect.",
    options: [
      { label: "I want to help people heal — that pull is genuine and deep.", score: { intrinsic: 2, realistic: 0, resilience: 0, clarity: 2 } },
      { label: "Medicine is intellectually fascinating. The diagnostic puzzle excites me.", score: { intrinsic: 2, realistic: 0, resilience: 0, clarity: 2 } },
      { label: "I grew up around healthcare and it feels like where I belong.", score: { intrinsic: 1, realistic: 1, resilience: 0, clarity: 1 } },
      { label: "Job security, income, and the status that comes with being a physician.", score: { intrinsic: 0, realistic: 1, resilience: 0, clarity: 0 } }
    ] },
  { question: "Medical training runs 11–16 years after high school. How does that land?", subtext: "4 years undergrad · 4 years med school · 3–7 years residency · optional fellowship",
    options: [
      { label: "I knew it was long. I've accepted it. I'm in it for the work, not the endpoint.", score: { intrinsic: 1, realistic: 2, resilience: 1, clarity: 1 } },
      { label: "I knew it was long, but not quite that long. I can still commit.", score: { intrinsic: 0, realistic: 1, resilience: 0, clarity: 0 } },
      { label: "That's more than I realized. I need to sit with that.", score: { intrinsic: 0, realistic: 0, resilience: 0, clarity: 0 } },
      { label: "I'm not sure I can commit that long right now.", score: { intrinsic: 0, realistic: 0, resilience: -1, clarity: 0 } }
    ] },
  { question: "Average medical school debt is now around $223,000. What's your honest reaction?", subtext: "70% of graduates carry six-figure debt. Monthly loan payments can run well over $2,000 for 10–20+ years.",
    options: [
      { label: "I've factored this in. I understand the ROI timeline and have a plan.", score: { intrinsic: 0, realistic: 2, resilience: 0, clarity: 1 } },
      { label: "I knew it was expensive, but not the exact numbers. I can adjust.", score: { intrinsic: 0, realistic: 1, resilience: 0, clarity: 0 } },
      { label: "That's significant. I need to seriously rethink my financial plan.", score: { intrinsic: 0, realistic: 0, resilience: 0, clarity: 0 } },
      { label: "I wasn't aware of the scale. This is new information for me.", score: { intrinsic: 0, realistic: -1, resilience: 0, clarity: 0 } }
    ] },
  { question: "A patient you've been treating for months dies despite your best efforts. You feel:", subtext: "This happens to every physician. How you process it matters.",
    options: [
      { label: "Deep grief — and then motivation to be better and prevent it next time.", score: { intrinsic: 1, realistic: 1, resilience: 2, clarity: 0 } },
      { label: "Grief, but I trust I'll find a way through it as I build experience.", score: { intrinsic: 0, realistic: 0, resilience: 1, clarity: 0 } },
      { label: "Seriously questioning whether I chose the right path.", score: { intrinsic: 0, realistic: 0, resilience: 0, clarity: 0 } },
      { label: "Completely devastated — I genuinely don't know how I'd function.", score: { intrinsic: 0, realistic: 0, resilience: -1, clarity: 0 } }
    ] },
  { question: "How do you feel about the human relationship side of medicine?", subtext: "Physicians spend a large share of their day in direct patient communication.",
    options: [
      { label: "This is actually the part I find most meaningful — understanding someone's life.", score: { intrinsic: 2, realistic: 0, resilience: 0, clarity: 1 } },
      { label: "I can do it, but the diagnostic problem-solving is what I'm really after.", score: { intrinsic: 1, realistic: 1, resilience: 0, clarity: 1 } },
      { label: "It's fine — not my favorite but I'll manage.", score: { intrinsic: 0, realistic: 0, resilience: 0, clarity: 0 } },
      { label: "Honestly, sustained patient interaction is draining for me.", score: { intrinsic: 0, realistic: 0, resilience: 0, clarity: -1 } }
    ] },
  { question: "How much direct patient-facing experience have you had so far?", subtext: "Shadowing, clinical volunteering, EMT, scribing, patient-care work, etc.",
    options: [
      { label: "200+ hours — I've seen what the work actually looks like.", score: { intrinsic: 0, realistic: 2, resilience: 1, clarity: 1 } },
      { label: "50–200 hours — meaningful exposure, still building.", score: { intrinsic: 0, realistic: 1, resilience: 0, clarity: 1 } },
      { label: "Under 50 hours — very limited so far.", score: { intrinsic: 0, realistic: 0, resilience: 0, clarity: 0 } },
      { label: "None yet, but I plan to get it.", score: { intrinsic: 0, realistic: -1, resilience: 0, clarity: 0 } }
    ] },
  { question: "What if you apply to medical school and don't get in?", subtext: "Roughly 55% of MD applicants don't matriculate in a given cycle.",
    options: [
      { label: "I have a backup plan I'm genuinely at peace with.", score: { intrinsic: 1, realistic: 2, resilience: 2, clarity: 1 } },
      { label: "I'd reapply. I don't see another path that makes sense for me.", score: { intrinsic: 1, realistic: 0, resilience: 1, clarity: 1 } },
      { label: "I honestly haven't thought through that scenario.", score: { intrinsic: 0, realistic: 0, resilience: 0, clarity: 0 } },
      { label: "That won't happen. I'm going to get in.", score: { intrinsic: 0, realistic: -1, resilience: 0, clarity: 0 } }
    ] },
  { question: "Why a physician and not a PA, NP, or pharmacist?", subtext: "These are legitimate, well-paying careers. The honest answer here matters.",
    options: [
      { label: "I want full diagnostic and treatment authority — and I understand what earning that costs.", score: { intrinsic: 1, realistic: 1, resilience: 0, clarity: 2 } },
      { label: "I'm drawn to independent practice and the depth of training that requires.", score: { intrinsic: 1, realistic: 1, resilience: 0, clarity: 1 } },
      { label: "Honestly, MD feels like the standard — I haven't looked deeply at the alternatives.", score: { intrinsic: 0, realistic: 0, resilience: 0, clarity: -1 } },
      { label: "The prestige and income difference is part of the reason, I'll admit.", score: { intrinsic: -1, realistic: 0, resilience: 0, clarity: 0 } }
    ] },
  { question: "How do you handle repeated failure or rejection?", subtext: "Pre-med is a sustained endurance test. So is residency. So is a career in medicine.",
    options: [
      { label: "I analyze what went wrong, adjust, and try again. Failure is data.", score: { intrinsic: 0, realistic: 0, resilience: 2, clarity: 0 } },
      { label: "It takes time, but I recover and keep going.", score: { intrinsic: 0, realistic: 0, resilience: 1, clarity: 0 } },
      { label: "I struggle with failure significantly. It shakes my confidence.", score: { intrinsic: 0, realistic: 0, resilience: 0, clarity: 0 } },
      { label: "Repeated failure would probably make me question whether this is right.", score: { intrinsic: 0, realistic: 0, resilience: -1, clarity: 0 } }
    ] },
  { question: "Picture your ideal workday as a physician. What does it look like?", subtext: "This tells us something about where in medicine you'll likely thrive.",
    options: [
      { label: "Long-term relationships with patients in a community — I know their families.", score: { intrinsic: 2, realistic: 0, resilience: 0, clarity: 2 } },
      { label: "Complex diagnostic challenges, teaching residents, academic environment.", score: { intrinsic: 2, realistic: 0, resilience: 0, clarity: 2 } },
      { label: "High-stakes procedures, OR, cutting-edge technology, adrenaline.", score: { intrinsic: 1, realistic: 0, resilience: 1, clarity: 2 } },
      { label: "I haven't visualized it clearly yet.", score: { intrinsic: 0, realistic: 0, resilience: 0, clarity: -1 } }
    ] }
];

const DOCTOR_QUIZ_FACTS = [
  { label: "Years of training (typical)", value: "11–16" },
  { label: "Average MD school debt", value: "~$223K" },
  { label: "Physicians reporting burnout", value: "~42%" },
  { label: "MD applicants who don't matriculate", value: "~55%" }
];

const DOCTOR_QUIZ_TIERS = [
  { min: 18, label: "Strong Foundation", tagline: "Your reasons are solid. Your eyes are open.", level: "good",
    description: "You have the intrinsic motivation, realistic expectations, and emotional resilience that predict long-term success in medicine. The pre-med journey will still be hard — but the difficulty won't surprise you, and you won't be running from something. You're running toward something.",
    honest: ["You'll face years where peers who chose different paths are earning more than you.", "Medical school alone can cost the equivalent of a house in most U.S. cities.", "Residency hours can still reach 60–80 hours per week, especially in surgical specialties.", "The system has significant dysfunction — you'll see things that frustrate you deeply."],
    positives: ["You understand why you're doing this — that clarity is rare and durable.", "Your motivation is grounded in the work itself, not the destination.", "You've shown you can process difficulty without catastrophizing.", "You have enough awareness to know what you're signing up for."],
    nextSteps: ["Start (or revisit) your Stage 01 self-assessment to see where your real evidence already is.", "Build your clinical hours deliberately — log them in your Activity Ledger as they happen.", "Every hour that passes un-logged is harder to reconstruct for AMCAS later.", "Try The Committee to see what a practice admissions read looks like right now."] },
  { min: 10, label: "Promising — With Gaps to Fill", tagline: "The instinct is right. The picture isn't complete yet.", level: "warn",
    description: "Your motivation for medicine is genuine, but some important gaps remain — in your clinical experience, your understanding of the financial reality, or your resilience under sustained failure. These are fixable. But they need to be fixed deliberately, not just assumed away.",
    honest: ["Your clinical exposure may not yet show you the full reality of what physicians face daily.", "The financial implications of medical school deserve serious planning, not just acknowledgment.", "Pre-med attrition is often less about intelligence and more about not being prepared for the marathon.", "Motivation that isn't grounded in firsthand exposure can shift under pressure."],
    positives: ["You're asking the right questions early — most people don't.", "The gaps you have are knowable and closeable with deliberate action.", "You show real curiosity about medicine as a discipline.", "You're at the stage where honest self-assessment can still shape the path."],
    nextSteps: ["Get more patient-facing hours before you're certain — log them and notice how the work actually feels.", "Work through the Cost & Access stage for the real financial picture, not assumptions.", "Complete your Stage 01 self-assessment to see exactly where your profile stands.", "Develop a concrete backup plan — not because you'll use it, but because having one builds resilience."] },
  { min: 3, label: "Important Questions to Explore", tagline: "Take the time to pressure-test this before you go further.", level: "bad",
    description: "Some of your answers suggest medicine may not yet be fully grounded in your own experience and honest self-knowledge. That's not a judgment — it's common, and it's recoverable. But moving forward without resolving these questions can cost real years and real money. The priority right now is honest exploration, not commitment.",
    honest: ["Choosing medicine primarily for security, prestige, or income — without intrinsic drive — is linked to higher physician burnout.", "Without meaningful clinical exposure, the choice isn't fully informed yet.", "Medical school applications commonly cost thousands of dollars in fees and preparation — applying before you're ready is expensive.", "Strong intrinsic motivation is protective against burnout; it's worth being honest about whether you have it yet."],
    positives: ["You're asking this question now, not after a decade of training.", "Honest uncertainty is healthier than false certainty.", "Many exceptional physicians started with exactly this kind of doubt and found clarity through real experience.", "There are many paths in healthcare — the right one for you may not be the one you've assumed."],
    nextSteps: ["Get real, hands-on patient-facing hours — log them in the Activity Ledger as you go.", "Shadow at least two different specialties to see what the day-to-day actually looks like.", "Talk to physicians 5–10 years into practice, not just those still in training.", "Research PA, NP, and other advanced-practice pathways with genuine openness."] },
  { min: -Infinity, label: "Consider the Full Landscape", tagline: "The most honest thing we can say is: keep exploring.", level: "bad",
    description: "Your answers suggest medicine — specifically as a physician — may not yet be the clearest match for where you are and how you think about this choice. That's not a failure. It's information. The healthcare ecosystem is large, and there are multiple paths to the kind of impact you want to have. Taking time to explore before committing is the most rational thing you can do.",
    honest: ["The physician path is one of the most expensive, time-intensive career choices available — it should be chosen with confidence, not by default.", "Many people who feel called to healthcare find deep fulfillment as PAs, NPs, researchers, or public health professionals.", "Choosing medicine without clarity is linked to attrition — either from the process or from the career after arrival.", "There is no shame in discovering this isn't the right path. There is real cost in ignoring the question."],
    positives: ["You're doing the honest work that most people skip.", "Your answers show self-awareness, which is foundational to any clinical career.", "The qualities that draw you toward healthcare are real — they'll serve you wherever you land.", "This is the ideal moment to explore, not a year into pre-med coursework."],
    nextSteps: ["Research PA, NP, and pharmacy pathways seriously — not as consolation prizes, but as genuine options.", "Get direct patient-facing experience before making any further commitments.", "Talk to people in multiple healthcare roles, not just physicians.", "If medicine still calls after that exploration, come back and start with Stage 01."] }
];

// Institutes pilot-application gap options — what computeInstituteFit() in app.js
// reads to build an honest instant fit read, not just a "thanks, we'll be in touch."
const INSTITUTE_GAP_OPTIONS = [
  "No structured, stage-by-stage curriculum",
  "Not enough one-on-one advising capacity for our student volume",
  "Students lack real interview or application practice",
  "Need better tracking of student progress across the office",
  "Serve a health-equity / first-gen / HBCU population needing tailored support",
  "Something else"
];
