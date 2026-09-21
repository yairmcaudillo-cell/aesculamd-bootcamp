/* Guided learning extension. Keeps the existing curriculum and state intact. */
const STUDIO_KEY = "aesculamd-studio-v1";
const studioDefault = () => ({
  version: 1,
  profile: null,
  reviews: {},
  reflections: {},
  actions: [],
  checkin: "",
  consent: false,
});
let studio = studioDefault();
try {
  const saved = JSON.parse(localStorage.getItem(STUDIO_KEY));
  if (
    saved &&
    saved.version === 1 &&
    saved.reviews &&
    typeof saved.reviews === "object" &&
    !Array.isArray(saved.reviews) &&
    saved.reflections &&
    typeof saved.reflections === "object" &&
    Array.isArray(saved.actions)
  ) {
    studio = { ...studio, ...saved };
    studio.actions = studio.actions.filter(
      (a) =>
        a &&
        typeof a.id === "string" &&
        typeof a.title === "string" &&
        typeof a.due === "string" &&
        Number.isFinite(a.minutes),
    );
    if (
      studio.profile &&
      (typeof studio.profile.name !== "string" ||
        !Number.isFinite(studio.profile.capacity) ||
        !Number.isInteger(studio.profile.priority) ||
        !STUDIO_CASES[studio.profile.priority] ||
        !Array.isArray(studio.profile.constraints) ||
        !studio.profile.constraints.every((c) => typeof c === "string") ||
        !Number.isInteger(studio.profile.cycle))
    )
      studio.profile = null;
  }
} catch {}
const sx = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function studioSave() {
  try {
    localStorage.setItem(STUDIO_KEY, JSON.stringify(studio));
  } catch {
    showToast(
      "Your browser could not save this change. Download a backup before leaving.",
    );
  }
}
function dateAfter(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
function studioNavigate(page) {
  go(page, navElementFor(page));
}
function studioNext() {
  const due = studioDue();
  if (due.length) return due[0];
  const priority = studio.profile ? studio.profile.priority : 0;
  if (!studio.reviews[priority]) return priority;
  return roadmapOrder.find((i) => !studio.reviews[i]) ?? priority;
}
function studioDue() {
  return Object.entries(studio.reviews)
    .filter(([i, r]) => STUDIO_CASES[i] && r && r.due <= dateAfter(0))
    .map(([i]) => Number(i));
}
function studioCard(i) {
  const c = STUDIO_CASES[i],
    r = studio.reviews[i];
  return (
    '<button class="learning-card" onclick="openStudioLesson(' +
    i +
    ')"><span class="module-number">' +
    String(i + 1).padStart(2, "0") +
    '</span><span class="eyebrow">' +
    c.tag +
    "</span><h3>" +
    c.title +
    "</h3><p>" +
    c.principle +
    '</p><span class="card-meta">' +
    (r ? "Revisit · " + sx(r.due) : "8 min · Case + reflection") +
    " <span>↗</span></span></button>"
  );
}
function renderStudioHome() {
  const p = studio.profile,
    completed = Object.keys(studio.reviews).length,
    due = studioDue(),
    next = studioNext();
  const pending = studio.actions.filter((a) => !a.done).slice(0, 3);
  document.getElementById("page-home").innerHTML =
    '<div class="studio-topline"><span>YOUR PREMED LEARNING SPACE</span><button class="text-button" onclick="studioNavigate(\'settings\')">Saved on this device ↗</button></div>' +
    '<div class="studio-heading"><div><div class="eyebrow">SMALL STEPS. MEANINGFUL PROGRESS.</div><h1>' +
    (p
      ? "Your path, " + sx(p.name || "at your pace") + "."
      : "A future in medicine.<br>A path that’s yours.") +
    '</h1><p>Learn what matters. Put it into practice.<br>Build a plan that fits your life.</p></div><button class="btn outline" onclick="openStudioSetup()">' +
    (p ? "Edit my priorities" : "Personalize my path") +
    " ↗</button></div>" +
    '<div class="studio-dashboard"><section class="feature-card"><div class="eyebrow">YOUR NEXT CHAPTER <span>01 / LEARN → APPLY → REFLECT</span></div><div class="feature-copy"><span class="feature-tag">' +
    STUDIO_CASES[next].tag +
    " · 8 MIN</span><h2>" +
    STUDIO_CASES[next].title +
    "</h2><p>" +
    STUDIO_CASES[next].principle +
    '</p><button class="btn cream" onclick="openStudioLesson(' +
    next +
    ')">Start a learning session <span>→</span></button></div><div class="orbit-art" aria-hidden="true"><div class="orbit one"></div><div class="orbit two"></div><div class="orbit three"></div><span class="orbit-center">your<br><b>next step</b></span><i class="orbit-dot d1"></i><i class="orbit-dot d2"></i><i class="orbit-dot d3"></i></div><div class="feature-bottom">One useful idea. One real-world decision. One step forward.</div></section>' +
    '<section class="week-card"><div class="eyebrow">THIS WEEK <span>↗</span></div><h2>Make room for progress.</h2><p>' +
    (p
      ? p.capacity + " minutes available for planning & learning."
      : "Start with your time, priorities, and real-life constraints.") +
    '</p><div class="week-actions">' +
    (pending.length
      ? pending
          .map(
            (a) =>
              '<div class="mini-action"><span class="small-dot"></span><div>' +
              sx(a.title) +
              "<small>" +
              a.minutes +
              " min · " +
              sx(a.due) +
              "</small></div></div>",
          )
          .join("")
      : '<div class="empty-path"><span>①</span> Tell us where you are.<br><span>②</span> Choose what matters next.<br><span>③</span> Leave with a doable plan.</div>') +
    '</div><button class="btn outline full" onclick="' +
    (p ? "studioNavigate('plan')" : "openStudioSetup()") +
    '">' +
    (p ? "Open my action plan" : "Build my first plan") +
    " →</button></section></div>" +
    '<div class="studio-stats"><div><strong>' +
    completed +
    "<span> / 10</span></strong><p>Practice sessions completed</p></div><div><strong>" +
    evidenceLog.length +
    "</strong><p>Reflections in your evidence log</p></div><div><strong>" +
    due.length +
    '</strong><p>Sessions ready to revisit</p></div><button class="text-button" onclick="studioNavigate(\'learning\')">Explore the learning studio →</button></div>' +
    '<div class="section-row"><div><div class="eyebrow">CONNECT THE DOTS</div><h2>A stronger applicant starts with understanding.</h2></div><span class="quiet">Learn at your own pace</span></div><div class="learning-grid">' +
    [5, 6, 4].map(studioCard).join("") +
    "</div>" +
    '<div class="advisor-strip"><span class="advisor-symbol">✳</span><div><h3>A thinking partner for your next decision.</h3><p>Explore your reflections with an AI coach, then take important decisions to your advisor.</p></div><button class="btn outline" onclick="studioNavigate(\'coach\')">Meet your coach ↗</button></div>' +
    '<p class="studio-footnote">Your progress is yours. No admissions predictions, no guaranteed outcomes. Built to support your learning and conversations with a pre-health advisor.</p>';
}
function renderStudioLearning() {
  const due = studioDue();
  document.getElementById("page-learning").innerHTML =
    '<div class="eyebrow">THE LEARNING STUDIO</div><h1>Learn it. Use it. Make it yours.</h1><p class="studio-intro">Short decision cases connect the curriculum to your life. Return later to test what you remember.</p>' +
    (due.length
      ? '<div class="notice"><b>' +
        due.length +
        " spaced review" +
        (due.length === 1 ? "" : "s") +
        ' ready.</b> Practice remembering before rereading. <button class="text-button" onclick="openStudioLesson(' +
        due[0] +
        ')">Review next →</button></div>'
      : "") +
    '<div class="learning-grid all-modules">' +
    STUDIO_CASES.map((c, i) => studioCard(i)).join("") +
    '</div><div class="advisor-strip"><div><h3>Want the full picture?</h3><p>Each session connects to a detailed chapter, supporting tools, and sources.</p></div><button class="btn outline" onclick="studioNavigate(\'bootcamp\')">Open the full curriculum →</button></div>';
}
let studioLessonIndex = 0,
  studioChoice = null;
function openStudioLesson(i) {
  if (!STUDIO_CASES[i]) return;
  studioLessonIndex = i;
  studioChoice = null;
  renderStudioLesson();
  studioNavigate("session");
}
function renderStudioLesson() {
  const i = studioLessonIndex,
    c = STUDIO_CASES[i],
    answered = studioChoice !== null;
  document.getElementById("page-session").innerHTML =
    '<button class="text-button" onclick="studioNavigate(\'learning\')">← Learning studio</button><div class="session-header"><div class="eyebrow">' +
    c.tag +
    " / SESSION " +
    String(i + 1).padStart(2, "0") +
    "</div><h1>" +
    c.title +
    '</h1><div class="session-steps"><span>01 Learn</span><span>02 Apply</span><span>03 Reflect</span><span>04 Act</span></div></div>' +
    '<div class="session-layout"><div><section class="studio-panel"><div class="eyebrow">01 / THE IDEA</div><h2>A principle to take with you</h2><p>' +
    c.principle +
    '</p><button class="text-button" onclick="openStagePanel(' +
    i +
    ')">Read the full chapter & sources ↗</button></section>' +
    '<section class="studio-panel"><div class="eyebrow">02 / MAKE A DECISION</div><p class="case-label">FICTIONAL PRACTICE CASE</p><p>' +
    c.case +
    "</p><h3>" +
    c.question +
    '</h3><div class="case-options">' +
    c.options
      .map(
        (o, n) =>
          '<button class="case-option ' +
          (answered && n === c.answer
            ? "correct"
            : answered && n === studioChoice
              ? "incorrect"
              : "") +
          '" ' +
          (answered ? "disabled" : "") +
          ' onclick="studioAnswer(' +
          n +
          ')"><span>' +
          String.fromCharCode(65 + n) +
          "</span>" +
          o +
          "</button>",
      )
      .join("") +
    "</div>" +
    (answered
      ? '<div class="case-feedback" role="status"><b>' +
        (studioChoice === c.answer
          ? "That is the strongest next step."
          : "Let’s examine that choice.") +
        "</b><p>" +
        c.explanation +
        '</p><button class="text-button" onclick="studioChoice=null;renderStudioLesson()">Try the case again</button></div>'
      : "") +
    "</section>" +
    '<section class="studio-panel"><div class="eyebrow">03 / CONNECT IT TO YOUR LIFE</div><label for="session-reflection"><h2>' +
    c.reflection +
    '</h2></label><p>Use your own words. Leave out names and identifying patient information.</p><textarea id="session-reflection" maxlength="4000" rows="5" placeholder="The situation was… I decided to… What changed was…" oninput="studio.reflections[studioLessonIndex]=this.value;studioSave()">' +
    sx(studio.reflections[i] || "") +
    '</textarea><p id="session-message" role="status"></p><button class="btn" onclick="finishStudioSession()" ' +
    (!answered ? "disabled" : "") +
    ">Save reflection & next step →</button></section></div>" +
    '<aside><section class="studio-panel session-aside"><div class="eyebrow">04 / TAKE IT INTO THE WORLD</div><h2>A small, useful action.</h2><p>' +
    c.action +
    '</p><div class="small-rule"></div><h3>Learning that connects</h3><p>Case → your reflection → your evidence log → your action plan.</p><p class="quiet">A practice session is not a measure of admissions readiness.</p><a href="https://students-residents.aamc.org/real-stories-demonstrating-premed-competencies/premed-competencies-entering-medical-students" target="_blank" rel="noopener">Explore AAMC competencies ↗</a></section></aside></div>';
}
function studioAnswer(n) {
  studioChoice = n;
  renderStudioLesson();
}
function finishStudioSession() {
  const i = studioLessonIndex,
    c = STUDIO_CASES[i],
    reflection = (studio.reflections[i] || "").trim();
  if (studioChoice === null || reflection.length < 40) {
    document.getElementById("session-message").textContent =
      "Add a few specific sentences (at least 40 characters) before saving.";
    return;
  }
  const old = studio.reviews[i],
    success = studioChoice === c.answer;
  const count = success ? Math.min((old?.successes || 0) + 1, 4) : 0;
  studio.reviews[i] = {
    successes: count,
    due: dateAfter(success ? [1, 3, 7, 14][count - 1] : 1),
    lastPracticed: dateAfter(0),
  };
  upsertEntry("studio-" + i, {
    source_type: "stage_reflection",
    source_reference: "Learning Studio · " + c.title,
    content: reflection,
    competency_tags: STAGE_DATA[i].competencies.split(" · "),
    timestamp: new Date().toISOString(),
  });
  if (!studio.actions.some((a) => a.id === "session-" + i))
    studio.actions.push({
      id: "session-" + i,
      title: c.action,
      minutes: 20,
      due: dateAfter(7),
      done: false,
      reason: "Your next step from " + c.title,
    });
  saveState();
  studioSave();
  studioNavigate("plan");
  showToast(
    "Reflection saved. Your next step is in your plan; a review is scheduled.",
  );
}
function openStudioSetup() {
  const p = studio.profile || {
    name: "",
    capacity: 60,
    priority: 0,
    year: studentProfile.yearInSchool || "Freshman",
    cycle: studentProfile.targetCycleYear || new Date().getFullYear() + 3,
    constraints: [],
  };
  document.getElementById("page-setup").innerHTML =
    '<div class="eyebrow">MAKE THIS YOURS · ABOUT 2 MINUTES</div><h1>A plan for your actual life.</h1><p class="studio-intro">Start small. You can change all of this as you learn more.</p><form class="studio-panel setup-form" onsubmit="submitStudioSetup(event)"><div class="form-grid"><label>What should we call you?<input name="name" maxlength="40" value="' +
    sx(p.name) +
    '" placeholder="First name (optional)"></label><label>Where are you now?<select name="year">' +
    ["Freshman", "Sophomore", "Junior", "Senior", "Gap year", "Career changer"]
      .map(
        (y) =>
          "<option " + (p.year === y ? "selected" : "") + ">" + y + "</option>",
      )
      .join("") +
    '</select></label><label>Target application year<input name="cycle" type="number" min="' +
    new Date().getFullYear() +
    '" max="' +
    (new Date().getFullYear() + 12) +
    '" required value="' +
    p.cycle +
    '"><small>The year you submit, usually before the year you enroll.</small></label><label>Weekly planning & learning time<select name="capacity">' +
    [30, 60, 90, 120]
      .map(
        (m) =>
          '<option value="' +
          m +
          '" ' +
          (p.capacity === m ? "selected" : "") +
          ">" +
          m +
          " minutes</option>",
      )
      .join("") +
    '</select><small>Separate from coursework, work, and activity shifts.</small></label></div><label>What would help you most right now?<select name="priority">' +
    STUDIO_CASES.map(
      (c, i) =>
        '<option value="' +
        i +
        '" ' +
        (p.priority === i ? "selected" : "") +
        ">" +
        c.title +
        "</option>",
    ).join("") +
    '</select></label><fieldset><legend>What should your plan respect?</legend><div class="constraint-grid">' +
    [
      "Paid work matters",
      "Limited transportation",
      "Caregiving responsibilities",
      "Protect academic recovery",
    ]
      .map(
        (c) =>
          '<label class="check-label"><input type="checkbox" name="constraint" value="' +
          c +
          '" ' +
          (p.constraints.includes(c) ? "checked" : "") +
          ">" +
          c +
          "</label>",
      )
      .join("") +
    '</div></fieldset><p class="quiet">This creates a transparent, rules-based starting plan. AI coaching is optional. You do not need to share grades or private medical information.</p><button class="btn" type="submit">Create my action plan →</button></form>';
  studioNavigate("setup");
}
function submitStudioSetup(event) {
  event.preventDefault();
  const f = new FormData(event.target);
  studio.profile = {
    name: String(f.get("name")).trim(),
    year: String(f.get("year")),
    cycle: Number(f.get("cycle")),
    capacity: Number(f.get("capacity")),
    priority: Number(f.get("priority")),
    constraints: f.getAll("constraint"),
  };
  studentProfile.yearInSchool = studio.profile.year;
  studentProfile.targetCycleYear = studio.profile.cycle;
  studioGenerateActions();
  saveState();
  studioSave();
  renderTimeline();
  studioNavigate("plan");
}
function studioGenerateActions() {
  const p = studio.profile,
    c = STUDIO_CASES[p.priority],
    minutes = Math.floor(p.capacity / 3);
  const context = p.constraints.length
    ? " Respect: " + p.constraints.join(", ").toLowerCase() + "."
    : "";
  const drafts = [
    {
      id: "weekly-learn",
      title: "Practice: " + c.title,
      reason: "You selected this as your current priority.",
      minutes: Math.min(15, minutes),
    },
    {
      id: "weekly-act",
      title: c.action,
      reason: "Put the concept into a small, observable action." + context,
      minutes,
    },
    {
      id: "weekly-review",
      title: "Review what worked and choose next week’s priority",
      reason:
        "Your plan should change when your circumstances or evidence change.",
      minutes: Math.min(15, minutes),
    },
  ];
  if (p.constraints.includes("Protect academic recovery")) {
    drafts[1].title =
      "Identify one course difficulty and ask your instructor or tutor for help";
    drafts[1].reason =
      "You asked to protect academic recovery before adding commitments.";
  } else if (
    p.constraints.includes("Limited transportation") &&
    [2, 5, 6, 7].includes(p.priority)
  ) {
    drafts[1].title =
      "Find one nearby or transit-accessible role and check duties and availability";
  } else if (
    p.constraints.includes("Paid work matters") &&
    [2, 5].includes(p.priority)
  ) {
    drafts[1].title =
      "Compare one paid patient-support role: training, duties, hours, and travel";
  }
  studio.actions = [
    ...drafts.map((a, i) => {
      const previous = studio.actions.find(
        (old) => old.id === a.id && old.title === a.title,
      );
      return {
        ...a,
        due: previous?.due || dateAfter(i * 2 + 1),
        done: previous?.done || false,
      };
    }),
    ...studio.actions.filter((a) => !a.id.startsWith("weekly-")),
  ];
}
function renderStudioPlan() {
  const p = studio.profile,
    total = studio.actions
      .filter((a) => !a.done)
      .reduce((s, a) => s + a.minutes, 0);
  document.getElementById("page-plan").innerHTML =
    '<div class="studio-topline"><span>YOUR WORKING ROADMAP</span><button class="text-button" onclick="studioDownloadPlan()">Download plan ↓</button></div><div class="studio-heading"><div><h1>Clarity for your next step.</h1><p>A plan you can act on, adjust, and discuss with your advisor.</p></div><button class="btn outline" onclick="openStudioSetup()">' +
    (p ? "Edit priorities" : "Set my priorities") +
    " ↗</button></div>" +
    (p
      ? '<div class="plan-context"><span>' +
        sx(p.year) +
        "</span><span>Apply in " +
        p.cycle +
        "</span><span>" +
        p.capacity +
        " min / week</span><span>" +
        sx(p.constraints.join(" · ") || "No access constraints selected") +
        "</span></div>"
      : '<div class="notice">Personalize your priorities to create your first three actions. Learning sessions can also add next steps here.</div>') +
    (p && total > p.capacity
      ? '<div class="notice">Your open actions total ' +
        total +
        " minutes across all dates. Your weekly capacity is " +
        p.capacity +
        " minutes. Move later tasks to another week rather than trying to do everything now.</div>"
      : "") +
    '<div class="plan-layout"><section><div class="section-row"><h2>Your next actions</h2><span class="quiet">' +
    studio.actions.filter((a) => a.done).length +
    ' completed</span></div><div class="action-list">' +
    (studio.actions.length
      ? studio.actions
          .map(
            (a, i) =>
              '<article class="action-row ' +
              (a.done ? "is-done" : "") +
              '"><input type="checkbox" aria-label="Complete ' +
              sx(a.title) +
              '" ' +
              (a.done ? "checked" : "") +
              ' onchange="studioToggleAction(' +
              i +
              ',this.checked)"><div><h3>' +
              sx(a.title) +
              "</h3><p>" +
              sx(a.reason) +
              '</p><div class="action-meta"><span>' +
              a.minutes +
              ' min</span><label>Target <input type="date" value="' +
              sx(a.due) +
              '" aria-label="Target date for ' +
              sx(a.title) +
              '" onchange="studioReschedule(' +
              i +
              ',this.value)"></label></div></div></article>',
          )
          .join("")
      : '<div class="studio-panel"><h3>Give your plan a starting point.</h3><p>Choose a priority or complete a learning session.</p><button class="btn" onclick="openStudioSetup()">Personalize my plan →</button></div>') +
    '</div><form class="add-action" onsubmit="studioAddAction(event)"><label class="sr-only" for="custom-action">New action</label><input id="custom-action" name="title" required maxlength="180" placeholder="Add your own specific next step…"><button class="btn outline">Add action</button></form></section>' +
    '<aside><section class="studio-panel"><div class="eyebrow">THE BIGGER PICTURE</div><h2>Weekly action.<br>Long-term direction.</h2><p>Connect these small steps to your application timeline and full competency assessment.</p><button class="btn outline full" onclick="studioNavigate(\'timeline\')">See semester timeline →</button><button class="text-button" onclick="openStagePanel(0)">Assess my competencies ↗</button></section><section class="studio-panel"><label for="weekly-checkin"><h3>Your weekly check-in</h3></label><p>What worked? What got in the way? What will you change?</p><textarea id="weekly-checkin" rows="5" maxlength="2000" oninput="studio.checkin=this.value;studioSave()" placeholder="A short note to your future self…">' +
    sx(studio.checkin) +
    '</textarea><button class="text-button" onclick="studioNavigate(\'coach\')">Think it through with my coach →</button></section></aside></div>';
}
function studioToggleAction(i, done) {
  studio.actions[i].done = done;
  studioSave();
  renderStudioPlan();
}
function studioReschedule(i, value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    studio.actions[i].due = value;
    studioSave();
  }
}
function studioAddAction(event) {
  event.preventDefault();
  const title = String(new FormData(event.target).get("title")).trim();
  if (!title) return;
  studio.actions.push({
    id: "custom-" + Date.now(),
    title,
    minutes: 15,
    due: dateAfter(7),
    done: false,
    reason: "A next step you chose. Adjust the date to fit your week.",
  });
  studioSave();
  renderStudioPlan();
}
function studioDownload(name, data, type) {
  const u = URL.createObjectURL(new Blob([data], { type })),
    a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
function studioDownloadPlan() {
  studioDownload(
    "my-aesculamd-action-plan.txt",
    "MY AESCULAMD ACTION PLAN\nGenerated " +
      dateAfter(0) +
      "\n\n" +
      (studio.profile
        ? "Application year: " +
          studio.profile.cycle +
          "\nWeekly learning capacity: " +
          studio.profile.capacity +
          " minutes\n\n"
        : "") +
      studio.actions
        .map(
          (a) =>
            (a.done ? "[x] " : "[ ] ") +
            a.title +
            "\nTarget: " +
            a.due +
            " · " +
            a.minutes +
            " min\nWhy: " +
            a.reason,
        )
        .join("\n\n") +
      "\n\nWEEKLY REFLECTION\n" +
      studio.checkin +
      "\n\nDiscuss school requirements and timing with your advisor. This plan does not predict admission.",
    "text/plain",
  );
}
let studioCoachBusy = false;
function renderStudioCoach() {
  document.getElementById("page-coach").innerHTML =
    '<div class="eyebrow">YOUR THINKING PARTNER</div><h1>Make sense of your next move.</h1><p class="studio-intro">Bring a decision, a reflection, or a roadblock. Your coach helps you reason through it.</p><div class="coach-layout"><section class="studio-panel"><div class="coach-identity"><span class="advisor-symbol">✳</span><div><h2>Pathway coach</h2><p>Reflect · explore tradeoffs · choose a step</p></div></div><div class="coach-prompts">' +
    [
      "What should I focus on this week?",
      "How can I find experience that fits my constraints?",
      "Help me reflect without writing my application.",
    ]
      .map(
        (q) =>
          '<button class="prompt-chip" onclick="document.getElementById(\'studio-question\').value=this.textContent">' +
          q +
          "</button>",
      )
      .join("") +
    '</div><form onsubmit="askStudioCoach(event)"><label for="studio-question">What are you working through?</label><textarea id="studio-question" rows="4" required maxlength="2000" placeholder="I’m trying to decide between…"></textarea><label class="check-label"><input id="studio-consent" type="checkbox" ' +
    (studio.consent ? "checked" : "") +
    '>Use AI: send this question, my priorities, constraints, latest check-in, and action plan to the AI service.</label><p class="quiet">Optional. Without this, you receive a clearly labeled planning prompt on your device. Do not include identifying patient information.</p><button id="coach-submit" class="btn">Think it through →</button></form><div id="studio-coach-response" class="coach-response" role="status" aria-live="polite"></div></section><aside class="studio-panel"><div class="eyebrow">WHAT YOUR COACH KNOWS</div><h3>Your plan, with context.</h3><p>' +
    (studio.profile
      ? sx(STUDIO_CASES[studio.profile.priority].title) +
        " · " +
        studio.profile.capacity +
        " minutes per week."
      : "Set your priorities to give your coach context.") +
    '</p><p>It cannot check current openings, verify a school policy, or predict acceptance. Ask a human advisor to review important decisions.</p><button class="text-button" onclick="openStudioSetup()">Update my context →</button><button class="text-button" onclick="studioNavigate(\'agents\')">Explore specialist mentors →</button></aside></div>';
}
async function askStudioCoach(event) {
  event.preventDefault();
  if (studioCoachBusy) return;
  const question = document.getElementById("studio-question").value.trim();
  if (!question) return;
  const consent = document.getElementById("studio-consent").checked;
  studio.consent = consent;
  studioSave();
  const output = document.getElementById("studio-coach-response"),
    button = document.getElementById("coach-submit");
  const offline = () => {
    output.replaceChildren();
    const label = document.createElement("b");
    label.textContent = consent
      ? "AI unavailable · on-device planning prompt"
      : "On-device planning prompt · not AI";
    const body = document.createElement("p");
    body.textContent =
      "Start with your current priority: " +
      STUDIO_CASES[studioNext()].title +
      ". Name the constraint that makes this decision difficult, compare two feasible options, and choose one small step you can test this week. " +
      (studio.actions.find((a) => !a.done)?.title ||
        "Personalize your plan to choose a concrete next action.");
    output.append(label, body);
  };
  if (!consent) {
    offline();
    return;
  }
  studioCoachBusy = true;
  button.disabled = true;
  output.textContent = "Reading your plan and thinking through your question…";
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch("/api/ai-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        mode: "pathway-coach",
        question,
        profile: studio.profile,
        checkin: studio.checkin,
        actions: studio.actions.slice(0, 12),
      }),
    });
    const data = await response.json();
    if (!response.ok || typeof data.reply !== "string")
      throw new Error("Unavailable");
    output.replaceChildren();
    const label = document.createElement("b");
    label.textContent = "AI coaching · review with your own judgment";
    const body = document.createElement("p");
    body.textContent = data.reply;
    output.append(label, body);
  } catch {
    offline();
  } finally {
    clearTimeout(timer);
    studioCoachBusy = false;
    button.disabled = false;
  }
}
function renderStudioSettings() {
  document.getElementById("page-settings").innerHTML =
    '<div class="eyebrow">YOUR PROGRESS, YOUR CONTROL</div><h1>Keep a copy of your path.</h1><p class="studio-intro">Progress is saved in this browser, without an account. A backup lets you move to another device or restore it later.</p><section class="studio-panel"><h2>Back up & restore</h2><p>The backup includes your existing curriculum progress, reflections, action plan, and spaced reviews. Keep it somewhere private.</p><div class="settings-actions"><button class="btn" onclick="studioBackup()">Download full backup ↓</button><label class="btn outline">Restore a backup<input type="file" accept=".json,application/json" class="sr-only" onchange="studioRestore(this.files[0])"></label></div><p id="restore-status" role="status"></p></section><section class="studio-panel"><h2>How AI uses your information</h2><p>AI features send the question and relevant context to the server and its AI provider to generate a reply. The new Pathway coach asks you to opt in before sending. Existing chapter Coach, Mentor, Chat, and plan generation send context when you use their AI actions. Local storage is not cloud backup.</p><button class="text-button" onclick="studioNavigate(\'privacy\')">Privacy details →</button></section><section class="studio-panel"><h2>Start over</h2><p>Clear both the curriculum and Learning Studio on this device. Download a backup first if you want to keep your work.</p><button class="btn outline" onclick="studioReset()">Clear my progress</button></section>';
}
function studioBackup() {
  studioDownload(
    "aesculamd-full-backup.json",
    JSON.stringify(
      {
        format: "aesculamd-full-backup",
        version: 1,
        studio,
        curriculum: JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"),
      },
      null,
      2,
    ),
    "application/json",
  );
}
async function studioRestore(file) {
  if (!file) return;
  const status = document.getElementById("restore-status");
  try {
    if (file.size > 2000000) throw new Error("This file is too large.");
    const data = JSON.parse(await file.text()),
      s = data.studio;
    if (
      data.format !== "aesculamd-full-backup" ||
      data.version !== 1 ||
      !s ||
      s.version !== 1 ||
      !Array.isArray(s.actions) ||
      !s.reviews ||
      !s.reflections ||
      typeof s.checkin !== "string"
    )
      throw new Error("Choose a valid AesculaMD full backup.");
    if (
      s.actions.some(
        (a) =>
          !a ||
          typeof a.id !== "string" ||
          typeof a.title !== "string" ||
          typeof a.reason !== "string" ||
          typeof a.due !== "string" ||
          !Number.isFinite(a.minutes),
      )
    )
      throw new Error("The action data is invalid.");
    if (
      s.profile &&
      (typeof s.profile.name !== "string" ||
        !Number.isFinite(s.profile.capacity) ||
        !Number.isInteger(s.profile.priority) ||
        !STUDIO_CASES[s.profile.priority] ||
        !Array.isArray(s.profile.constraints) ||
        !s.profile.constraints.every((x) => typeof x === "string"))
    )
      throw new Error("The profile data is invalid.");
    if (
      data.curriculum &&
      (!Array.isArray(data.curriculum.stageStatuses) ||
        data.curriculum.stageStatuses.length !== STAGE_DATA.length ||
        !data.curriculum.stageStatuses.every((x) =>
          ["current", "locked", "done"].includes(x),
        ) ||
        !Array.isArray(data.curriculum.evidenceLog) ||
        data.curriculum.evidenceLog.some(
          (e) =>
            !e ||
            typeof e.content !== "string" ||
            !Array.isArray(e.competency_tags) ||
            !e.competency_tags.every((x) => typeof x === "string"),
        ))
    )
      throw new Error("The curriculum data is invalid.");
    if (!confirm("Replace progress on this device with this backup?")) return;
    const previousStudio = localStorage.getItem(STUDIO_KEY),
      previousCurriculum = localStorage.getItem(STORAGE_KEY);
    try {
      localStorage.setItem(STUDIO_KEY, JSON.stringify(s));
      if (data.curriculum)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.curriculum));
    } catch (error) {
      if (previousStudio !== null)
        localStorage.setItem(STUDIO_KEY, previousStudio);
      else localStorage.removeItem(STUDIO_KEY);
      if (previousCurriculum !== null)
        localStorage.setItem(STORAGE_KEY, previousCurriculum);
      throw error;
    }
    location.reload();
  } catch (e) {
    status.textContent = "Could not restore: " + e.message;
  }
}
function studioReset() {
  if (
    !confirm("Clear all saved curriculum and Studio progress on this device?")
  )
    return;
  localStorage.removeItem(STUDIO_KEY);
  localStorage.removeItem(STORAGE_KEY);
  location.href = location.pathname;
}
const originalGo = go;
go = function (page, el) {
  if (page === "home") renderStudioHome();
  if (page === "learning") renderStudioLearning();
  if (page === "plan") renderStudioPlan();
  if (page === "coach") renderStudioCoach();
  if (page === "settings") renderStudioSettings();
  originalGo(page, el);
  const heading = document.querySelector("#page-" + page + " h1");
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
};
["learning", "session", "setup", "plan", "coach", "settings"].forEach((id) => {
  const page = document.createElement("div");
  page.id = "page-" + id;
  page.className = "page studio-page";
  document.querySelector(".main").append(page);
});
const sidebar = document.getElementById("sidebar");
sidebar
  .querySelectorAll(".nav-item,.sub-nav,.presentation-tools")
  .forEach((el) => el.remove());
const nav = document.createElement("nav");
nav.setAttribute("aria-label", "Main navigation");
nav.innerHTML =
  '<div class="nav-section-label">YOUR WORKSPACE</div>' +
  [
    ["home", "⌂", "Overview"],
    ["learning", "◫", "Learning studio"],
    ["plan", "↗", "My action plan"],
    ["coach", "✳", "AI coach"],
    ["evidencelog", "▤", "Evidence log"],
  ]
    .map(
      ([id, icon, label]) =>
        '<button class="nav-item ' +
        (id === "home" ? "active" : "") +
        '" data-page="' +
        id +
        '" onclick="studioNavigate(\'' +
        id +
        '\')"><span class="icon">' +
        icon +
        "</span>" +
        label +
        "</button>",
    )
    .join("") +
  '<div class="nav-section-label">GO DEEPER</div>' +
  [
    ["bootcamp", "◎", "Full curriculum"],
    ["timeline", "◷", "Semester timeline"],
    ["glossary", "≡", "Premed glossary"],
    ["settings", "⚙", "Progress & privacy"],
  ]
    .map(
      ([id, icon, label]) =>
        '<button class="nav-item" data-page="' +
        id +
        '" onclick="studioNavigate(\'' +
        id +
        '\')"><span class="icon">' +
        icon +
        "</span>" +
        label +
        "</button>",
    )
    .join("");
sidebar.insertBefore(nav, sidebar.querySelector(".sidebar-footer"));
sidebar.querySelector(".sidebar-footer").innerHTML =
  '<span class="small-dot"></span><div><b>Your pace. Your path.</b><small>Free to learn. Built around you.</small></div>';
document
  .querySelectorAll(".brand-text span")
  .forEach((e) => (e.textContent = "BOOTCAMP"));
document.getElementById("page-home").classList.add("studio-page");
renderStudioHome();
