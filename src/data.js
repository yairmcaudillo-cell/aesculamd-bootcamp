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
      "<b>A prompt worth taking seriously before you rate yourself:</b> competencies built outside 'premed activities' count just as much as ones built inside them. Working a job, caregiving for family, translating for parents, organizing a team, surviving a hard year — all of that is real evidence if you can describe it specifically. This stage is where that gets captured for the first time, before it gets buried under years of 'official' premed activities.",
      "<b>What happens with this assessment:</b> it directly shapes your roadmap. Competencies you rate Demonstrating get referenced, not re-taught. Competencies you rate Planning get prioritized — the stages most relevant to building them get sequenced earlier. And a note on the AI in this platform, right now: every agent is built to help you think more clearly and reflect more honestly — none of them will ever write your personal statement, an essay, or an activity description for you, since every medical school application requires you to affirm that writing like this is entirely your own.",
      "<b>Your Reflection Coach unlocks today, not later:</b> it reads across your evidence log as it grows and points out patterns you might not notice yourself — the same strength showing up in unrelated settings, or the same hesitation recurring across stages. It's the one agent with you for the whole journey, not just one part of it."
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
      "<b>What this connects to:</b> everything you write becomes tagged entries in your evidence log under Self-Awareness and Ethical Responsibility to Self and Others — two of the hardest competencies to demonstrate convincingly later. This stage resurfaces deliberately in Research and Leadership, building a real throughline over years instead of retrofitting one at the end."
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
      "<b>Beyond FAP itself:</b> the AACOMAS Fee Waiver Program covers only your first program's $198 fee (not the $60 per additional program), uses its own income table rather than FAP's 400%-of-poverty rule, and expires 14 days after approval — tighter than FAP, not looser. Many individual schools will also waive secondary fees for FAP recipients, though you often have to know to ask or check the school's own MSAR listing. A smaller number of schools offer interview travel stipends or host-student housing, rarely advertised prominently."
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
      "<b>Letters of recommendation:</b> most DO programs require at least one letter from a physician (MD or DO), and many specifically prefer or strongly recommend it come from a DO — though this varies school by school. A DO-leaning student benefits from seeking out DO shadowing early enough to have that relationship in place well before application season."
    ],
    reflection: [
      "Does a whole-person, primary-care philosophy or a highly specialized one resonate more with you — or does it not matter much either way?",
      "Are you drawn to a path for real reasons, or mostly prestige assumptions?",
      "Given what you saw in Cost & Access about separate applications and fees, does dual-applying feel realistic for your time and budget right now?"
    ],
    checklist: ["Read Part 1 in full", "Answer all four reflection prompts", "Select MD-focused / DO-focused / Dual-applying (revisitable anytime)", "Continue to Stage 05"]
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
      "<b>Course sequencing — you don't need to be a science major:</b> prerequisite coursework is required regardless of major, but the major itself doesn't need to be a science field. Committees care whether you completed the required coursework and performed well — and a GPA trend that improves over time reads differently than a flat average."
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
      "<b>A caution worth taking seriously:</b> some paid international 'medical internship' programs promise undergrads hands-on tasks well beyond what they're legally or ethically qualified to do. This has drawn real concern, including from the AAMC, because it can put patients at genuine risk. If a program's pitch sounds like 'you'll actually practice medicine as an undergrad' — that's a signal to look elsewhere, not a selling point."
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
      "<b>Realistic benchmarks:</b> roughly 50–100+ hours of genuine, sustained non-clinical service as a starting target, though this varies more by school mission than almost any other category — some service-oriented or faith-based schools expect hundreds or 1,000+ hours. Consistency over a single burst matters more than the raw number."
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
    sourceNote: "Flagged for review by a real research advisor (bench-research accuracy, PI-outreach norms) — not yet independently verified like the other stages.",
    why: "Research is not required — but it needs to be legible. This stage helps you decide on purpose, before spending hundreds of hours finding out the hard way.",
    parts: [
      "<b>What admissions committees are actually reading for:</b> not whether you did research, but three things, in order — did you understand what you were doing or just show up; does it connect to something you've said elsewhere in your application; and did you finish something. Notice what's not on this list: prestige of the lab, whether it was 'real' bench science, or hours logged.",
      "<b>Three real paths, not just yes or no:</b> Wet-lab/bench research (best if you're curious about mechanism-level questions and don't mind slow, often frustrating timelines). Clinical or public health research (best if you're drawn to questions about patients or populations, often more schedule-flexible and faster to a tangible output). No formal research (a legitimate, complete answer — a committee would rather see 400 excellent, reflective clinical hours than a research line you clearly didn't want to be in).",
      "<b>A decision isn't binding, but drift should be visible.</b> You can start one path and switch — what matters is that the decision itself is deliberate and dated, so later, when building your roadmap or personal statement, you can see the actual reasoning rather than reconstructing a story after the fact.",
      "<b>What the Research Navigator agent is for, once unlocked:</b> not to make the decision for you — that already happened here. It's for the next layer of specific questions: how to cold-email a specific PI, what to do if a lab isn't working out, how to talk about an unfinished project honestly on AMCAS."
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
      "<b>A realistic target:</b> three or more distinct leadership experiences, each sustained for at least a few months, across your undergraduate years — not a dozen shallow one-off roles. The strongest leadership stories tend to follow one pattern: identifying a problem nobody else was solving and doing something about it, rather than simply inheriting a role someone else already built."
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
      "<b>Once you have an actual draft, years from now:</b> the Personal Statement Checker flags clichés, vague phrases, and two specific patterns — whether the essay centers your own growth or reads as admiration of someone else ('Aspirations vs. Inspirations'), and whether it's specific about why a physician rather than another healthcare role. It only reads what you already wrote; it never drafts or rewrites anything."
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

  { id: "family-conversations", name: "Family Conversations", desc: "Explaining the timeline, gap years, and this whole process to family unfamiliar with it.", stageTitle: null, realTool: null,
    chatGreeting: "Hi — explaining a long premed timeline to family who haven't been through it is its own skill. What's the conversation you're dreading?",
    chatTopics: [
      { keywords: ["gap year", "gap", "time off", "taking a year"], label: "talking about a gap year", reply: "A framing that tends to land better than 'I need a gap year' is naming what the gap year is *for*, concretely — an MCAT retake, more clinical hours, research — not just 'I need more time.' Specificity is what reassures people, not reassurance itself." },
      { keywords: ["cost", "debt", "money", "afford", "pay for", "expensive"], label: "explaining the cost to my family", reply: "Family financial worry is usually about the unknown, not the actual number. If you've been through Cost & Access, you have real figures — showing an actual plan (FAP eligibility, in-state vs. out-of-state math) tends to land better than reassurance alone." }
    ],
    chatFallback: "Tell me who you're talking to and what they're worried about — a parent's worry about time is usually different from a sibling's, or a partner's." },

  { id: "experience-pathways", name: "Experience Pathways", desc: "Shadowing, scribing, CNA, EMT, and non-clinical service — matched to your schedule, comfort level, and what's actually accessible to you.", stageTitle: "Clinical Experience", realTool: "ledger", realToolLabel: "Open Activity Ledger",
    chatGreeting: "Hi — you've logged {clinicalHours}h clinical and {serviceHours}h non-clinical service in your Activity Ledger so far. What are you weighing?",
    chatTopics: [
      { keywords: ["shadow", "shadowing"], label: "my shadowing hours", reply: "You've got {shadowingHours}h of shadowing logged. It's usually the easiest access point, but on its own it demonstrates observation, not hands-on care — worth pairing with something in the Direct Clinical Experience category too." },
      { keywords: ["which", "choose", "best", "better", "should i do"], label: "which experience to choose", reply: "It depends on your schedule and comfort level more than which one 'looks best' — a school genuinely doesn't rank scribing above CNA work. What's actually accessible to you right now, given your schedule?" }
    ],
    chatFallback: "Log what you try in the Activity Ledger as you go — {clinicalHours}h clinical, {serviceHours}h service so far — and I can speak to real gaps instead of guessing." },

  { id: "research-navigator", name: "Research Navigator", desc: "PI outreach, lab fit, wet-lab vs. clinical vs. public health research.", stageTitle: "Research or No Research?", realTool: null,
    chatGreeting: "Hi — Research or No Research is a real decision either way, not a default yes. Where are you on it?",
    chatTopics: [
      { keywords: ["pi", "professor", "lab", "email", "outreach", "reach out"], label: "emailing a PI", reply: "A PI outreach email that gets answered is short, specific about why *their* lab (not research in general), and asks for 15 minutes — not a position outright. Want to talk through what you'd actually say?" },
      { keywords: ["wet lab", "clinical research", "public health", "which type", "kind of research"], label: "which type of research to pursue", reply: "Wet-lab, clinical, and public health research all count the same on an application — what matters is that you can speak to why you picked it and what you actually did, not the label. You've logged {researchHours}h research so far." }
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

  { id: "letters-relationships", name: "Letters & Relationships", desc: "Tracking potential letter-writers, timing your ask, and keeping those relationships warm years before you actually need the letter.", stageTitle: "Personal Brand", realTool: "lortracker", realToolLabel: "Open LOR Tracker",
    chatGreeting: "Hi — you've got {lorCount} potential letter-writer(s) tracked, {lorConfirmedCount} confirmed or submitted. Stage 10's own advice: ask while their impression of you is still fresh, not when you actually need the letter.",
    chatTopics: [
      { keywords: ["when", "timing", "ask", "how early"], label: "when to ask for a letter", reply: "Ask as soon as a relationship is strong, not when you need the letter — waiting means asking someone to remember specifics from years ago. You've got {lorCount} tracked; worth asking which ones are overdue." },
      { keywords: ["who", "choose", "which", "pick"], label: "who to ask", reply: "The strongest letter-writers can speak to something specific about you, not just your grade or your title. Someone who can describe one real moment beats someone more prestigious who barely remembers you." }
    ],
    chatFallback: "Ask me about timing or who to choose — or open the LOR Tracker to see which of your {lorCount} tracked contacts are going stale." }
];

// Interview Simulator + The Committee reference data — see content/simulations-design.md
// for how these were adapted (not copied) from AesculaMD_1's real implementation into
// scripted, rule-based experiences for this no-backend prototype.

const INTERVIEW_PERSONAS = [
  { id: "friendly", name: "Dr. Sarah Chen", title: "Friendly Faculty Member", avatar: "👩‍⚕️",
    tone: "warm and encouraging — acknowledges what worked before naming what to strengthen" },
  { id: "challenging", name: "Dr. Marcus Williams", title: "Challenging Admissions Director", avatar: "👨‍💼",
    tone: "direct and probing — expects specifics, not general statements" },
  { id: "skeptical", name: "Dr. Robert Hayes", title: "Skeptical Physician", avatar: "👨‍⚕️",
    tone: "seen every cliché — allergic to rehearsed-sounding answers, wants the real story" }
];

const INTERVIEW_CATEGORIES = [
  { id: "traditional", name: "Traditional", competency: "Oral Communication", examples: [
    "Tell me about yourself.",
    "Why do you want to be a doctor?",
    "What draws you to medicine specifically, versus another helping profession?",
    "What are your strengths and weaknesses?",
    "How do you handle stress and pressure?"
  ]},
  { id: "behavioral", name: "Behavioral", competency: "Teamwork and Collaboration", examples: [
    "Tell me about a time you worked with a difficult team member.",
    "Describe a situation where you had to resolve a conflict.",
    "Tell me about a time you failed and what you learned.",
    "Describe a situation where you demonstrated leadership.",
    "Tell me about a time you had to advocate for someone."
  ]},
  { id: "ethics", name: "Ethics & Scenarios", competency: "Ethical Responsibility to Self and Others", examples: [
    "What would you do if you witnessed a colleague making a medical error?",
    "How would you handle a patient who refuses treatment due to religious beliefs?",
    "A patient asks you not to tell their family about their diagnosis. What do you do?",
    "How would you handle a situation where a patient can't afford their medication?",
    "Discuss the ethical considerations of allocating limited medical resources."
  ]},
  { id: "mmi", name: "MMI Style", competency: "Critical Thinking", examples: [
    "Your teammate consistently arrives late to meetings. How would you address this?",
    "You're caring for a patient who doesn't speak your language. What would you do?",
    "A patient is nervous about a procedure. How would you reassure them?",
    "Role-play: how would you break bad news to a patient?",
    "You notice a fellow student cheating on an exam. What would you do?"
  ]},
  { id: "knowledge", name: "Medical Knowledge", competency: "Human Behavior", examples: [
    "What do you think is the most pressing issue in healthcare today?",
    "How would you improve the current healthcare system?",
    "What role does preventive care play in medicine?",
    "What experiences have you had with underserved populations?",
    "Discuss the impact of social determinants on health outcomes."
  ]},
  { id: "specialty", name: "Specialty-Focused", competency: "Self-Awareness", examples: [
    "What interests you about primary care medicine?",
    "Why might you consider surgery as a specialty?",
    "How would you handle the emotional demands of oncology?",
    "What aspects of emergency medicine appeal to you?",
    "How would you balance the lifestyle demands of different specialties?"
  ]},
  { id: "research", name: "Research Experience", competency: "Scientific Inquiry", examples: [
    "Tell me about your research experience.",
    "How do you stay updated with medical literature?",
    "What was the most challenging aspect of your research?",
    "How would you explain your research to a non-scientist?",
    "What role should research play in clinical practice?"
  ]},
  { id: "community", name: "Community Health", competency: "Understanding Others", examples: [
    "How would you address health disparities in underserved communities?",
    "What role should physicians play in addressing social determinants of health?",
    "How would you use community health data to advocate for resources?",
    "What creative approaches would you bring to a public health problem you care about?",
    "Tell me about a time you engaged with a community different from your own."
  ]},
  { id: "mission", name: "Mission Alignment", competency: "Service Orientation", examples: [
    "How would you contribute to a school's commitment to health equity?",
    "What draws you to programs focused on underserved populations?",
    "How do your experiences align with a mission-driven medical school?",
    "What unique perspective would you bring to a learning community?",
    "Why does service to a specific community matter to you personally?"
  ]}
];

const COMMITTEE_MEMBERS = [
  { role: "Academic Reviewer", focus: "GPA, MCAT readiness, and course rigor" },
  { role: "Mission Advocate", focus: "Financial realism, service commitment, and MD/DO fit" },
  { role: "Research Director", focus: "Research decisiveness and depth" },
  { role: "Student Affairs", focus: "Narrative coherence and breadth of evidence" }
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

// Activity Ledger categories — target hours are our own already-verified benchmark
// figures from Stages 06/07 content, not AesculaMD_1's numbers. Research and Leadership
// intentionally have no hour target, matching those stages' own "hours aren't the point"
// framing.
const LEDGER_CATEGORIES = [
  { id: "shadowing", name: "Shadowing", competencyTags: ["Understanding Others", "Interpersonal Skills"], targetHours: 40, targetLabel: "30–50h typical" },
  { id: "clinical", name: "Direct Clinical Experience", competencyTags: ["Service Orientation", "Understanding Others", "Empathy and Compassion", "Interpersonal Skills"], targetHours: 150, targetLabel: "150+h typical" },
  { id: "service", name: "Non-Clinical Service", competencyTags: ["Service Orientation", "Understanding Others"], targetHours: 75, targetLabel: "50–100+h typical" },
  { id: "research", name: "Research", competencyTags: ["Scientific Inquiry", "Critical Thinking"], targetHours: null, targetLabel: "Decision clarity matters more than hours" },
  { id: "leadership", name: "Leadership", competencyTags: ["Teamwork and Collaboration", "Interpersonal Skills", "Reliability and Dependability"], targetHours: null, targetLabel: "3+ sustained roles matters more than hours" }
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

// LOR Tracker roles — matches Stage 10's "4–6 letters, mixed roles" guidance.
const LOR_ROLES = ["Science Professor", "Non-Science Professor", "Clinical Supervisor", "PI / Research Mentor", "Physician", "Other"];
const LOR_STATUSES = ["Not Asked", "Asked", "Confirmed", "Submitted"];

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
