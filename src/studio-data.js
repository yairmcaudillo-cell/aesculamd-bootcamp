// Teaching intent and provenance: content/learning-studio.md.
const STUDIO_CASES = [
  {
    tag: "FOUNDATIONS",
    title: "Turn experience into evidence",
    principle:
      "A competency is something you can demonstrate through a real decision. Start with what happened, what you did, and what you learned—not how impressive your title sounds.",
    case: "Maya works at a grocery store. When a new coworker struggled with closing, she made a checklist with them and checked whether it helped. She thinks this does not count because it is not clinical.",
    question: "What is the most useful next step?",
    options: [
      "Leave it out and find a hospital title.",
      "Describe her decision, the outcome, and what she learned.",
      "Rate every competency as Demonstrating.",
    ],
    answer: 1,
    explanation:
      "Her example may demonstrate teamwork and reliability. She still needs to explain her own contribution and what changed. It does not replace clinical exposure, but it is meaningful evidence.",
    reflection:
      "Think of a time at work, at home, or in a team when you noticed a problem. What did you do, and what changed?",
    action: "Capture one specific experience in your evidence log.",
  },
  {
    tag: "PURPOSE",
    title: "Find the question behind why medicine",
    principle:
      "Your motivation grows through encounters and reflection. Explore what you understand about a physician’s responsibilities and what you still need to learn.",
    case: "Daniel wants to help people. He enjoys volunteering at a pantry, but has not observed clinical care.",
    question: "Which step would make his decision more informed?",
    options: [
      "Choose a dramatic essay opening.",
      "Assume enjoying service proves medicine is right.",
      "Explore supervised clinical care and reflect on the physician’s role.",
    ],
    answer: 2,
    explanation:
      "Many careers help people. Clinical exploration can test assumptions about medicine. Uncertainty is useful information, not a weakness to hide.",
    reflection:
      "What part of a physician’s work have you actually observed? What assumption do you still need to test?",
    action:
      "Write one question about a physician’s daily responsibilities to explore.",
  },
  {
    tag: "ACCESS",
    title: "Build a plan that fits your life",
    principle:
      "A sustainable plan accounts for money, travel, work, and caregiving. Accessible, consistent involvement matters.",
    case: "Alex works 20 hours a week and has no car. A distant unpaid internship competes with a paid local patient-support role.",
    question: "What should Alex do first?",
    options: [
      "Compare supervision, duties, transport, training, and schedule.",
      "Take the unpaid role because it sounds prestigious.",
      "Stop paid work regardless of financial consequences.",
    ],
    answer: 0,
    explanation:
      "Verify the actual responsibilities and feasibility. A paid role is not inherently less valuable; ask what patient contact and training it involves.",
    reflection:
      "What practical constraint must your roadmap respect? What would make an opportunity sustainable?",
    action: "Identify one accessible opportunity and verify its requirements.",
  },
  {
    tag: "STRATEGY",
    title: "Replace assumptions with a source",
    principle:
      "Coursework, letters, timelines, and residency preferences vary by school. Check official program requirements and consult your advisor.",
    case: "A friend tells Sam that every medical school accepts the same prerequisite courses. Sam is about to drop a course.",
    question: "What is the best response?",
    options: [
      "Trust the friend’s school list.",
      "Check official requirements and meet an advisor.",
      "Assume a strong MCAT replaces prerequisites.",
    ],
    answer: 1,
    explanation:
      "A general roadmap cannot establish eligibility at a particular school. Record your source and date checked; clarify ambiguous requirements directly.",
    reflection:
      "Which requirement are you currently assuming is true? Where will you verify it?",
    action: "Verify one prerequisite with an official program page.",
  },
  {
    tag: "ACADEMICS",
    title: "Diagnose before adding more hours",
    principle:
      "Study improvement starts by identifying why errors happen. Retrieval, feedback, and a repeatable schedule make gaps visible.",
    case: "Nia rereads biology notes for hours but cannot explain the material without looking. Her exam exposed conceptual gaps.",
    question: "What should she try next?",
    options: [
      "Add another extracurricular.",
      "Reread the same notes twice as long.",
      "Explain from memory, analyze errors, and seek feedback.",
    ],
    answer: 2,
    explanation:
      "Test understanding and seek help with misconceptions. Protect academic recovery before expanding commitments.",
    reflection:
      "What does a recent mistake reveal about how you learn? What will you change next session?",
    action: "Run a 30-minute retrieval session and review the errors.",
  },
  {
    tag: "CLINICAL",
    title: "Look past the role title",
    principle:
      "Clinical learning depends on what you actually do and observe, under appropriate supervision. Ask about duties and training.",
    case: "Jordan finds hospital office volunteering and a clinic support role. Neither description explains patient interaction clearly.",
    question: "How should Jordan compare them?",
    options: [
      "Ask about duties, patient contact, and supervision.",
      "Choose the better-known hospital.",
      "Count every hospital hour as patient care.",
    ],
    answer: 0,
    explanation:
      "Location alone does not describe an experience. Learn the responsibilities and boundaries. Describe your role accurately; school classifications may differ.",
    reflection:
      "What would you ask a coordinator to understand a role’s learning opportunities?",
    action: "Ask a coordinator about duties, supervision, and a typical shift.",
  },
  {
    tag: "SERVICE",
    title: "Start with the community’s need",
    principle:
      "Service begins by listening. Consistency and responsiveness matter more than launching something for its own sake.",
    case: "A student wants to start a nonprofit. A food pantry says its biggest problem is a lack of reliable Saturday volunteers.",
    question: "What is the strongest first move?",
    options: [
      "Launch a new organization with the same mission.",
      "Ask how to support the existing Saturday team sustainably.",
      "Plan publicity before meeting the team.",
    ],
    answer: 1,
    explanation:
      "Supporting an existing effort can address a real need. Learn from the people doing the work and check whether your contribution is useful.",
    reflection:
      "Whose perspective should you seek before deciding how to help? What can you reliably contribute?",
    action: "Ask a community partner what consistent help they need.",
  },
  {
    tag: "INQUIRY",
    title: "Learn to think like a researcher",
    principle:
      "Research involves questions, methods, evidence, and uncertainty. Publications are not guaranteed.",
    case: "Leah can do data entry in a famous lab or work on a smaller project with a mentor who teaches question formation and interpretation.",
    question: "What should she clarify?",
    options: [
      "Which lab can promise a publication.",
      "Which title sounds best.",
      "Mentorship, responsibilities, learning opportunities, and time expectations.",
    ],
    answer: 2,
    explanation:
      "Understand the scientific process and discuss expectations honestly. No mentor should guarantee an outcome they cannot control.",
    reflection:
      "What question interests you enough to investigate? What methods would you need to learn?",
    action:
      "Read one lab’s project description and write two thoughtful questions.",
  },
  {
    tag: "LEADERSHIP",
    title: "Make a useful change",
    principle:
      "Leadership can mean noticing a recurring problem, bringing people into a solution, and checking whether it helped.",
    case: "A club loses volunteers because shift instructions are unclear. Priya is a new member without an officer title.",
    question: "What can she do?",
    options: [
      "Ask volunteers what is unclear and pilot a better handoff with the coordinator.",
      "Wait for an officer title.",
      "Claim she led the organization on her résumé.",
    ],
    answer: 0,
    explanation:
      "Collaborative improvement demonstrates initiative without inflating a title. Seek permission where needed and use feedback to assess results.",
    reflection:
      "What recurring team problem have you noticed? Who should help shape a small solution?",
    action: "Propose a small improvement and decide how to evaluate it.",
  },
  {
    tag: "INTEGRATION",
    title: "Choose the next right step",
    principle:
      "A roadmap is a working plan. Revisit it as you gather evidence and discover what is sustainable.",
    case: "Chris planned five new activities but is struggling with coursework and caring for a relative.",
    question: "How should Chris revise the plan?",
    options: [
      "Keep every commitment at any cost.",
      "Prioritize essential commitments, communicate changes, and choose a feasible next step.",
      "Treat a missed schedule as proof medicine is impossible.",
    ],
    answer: 1,
    explanation:
      "Replanning is a skill. A roadmap supports decisions; it is not a guarantee or a judgment of potential.",
    reflection:
      "What will you continue, reduce, and revisit this month? How will you know the revised plan works?",
    action:
      "Review your commitments and choose one realistic action this week.",
  },
];
