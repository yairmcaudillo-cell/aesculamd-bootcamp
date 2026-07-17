// Rendering and interaction logic. Reads from data.js (STAGE_DATA, AGENT_DATA, COMPETENCIES).

// Some pages (Bootcamp, Timeline) are top-level .nav-item elements; others (Evidence Log,
// Activity Ledger, etc.) live under Experiences as .sub-item elements. This finds whichever
// applies so cross-page links can highlight the right sidebar entry either way.
function navElementFor(pageId){
  return document.querySelector('.nav-item[data-page="' + pageId + '"]') || document.querySelector('.sub-item[data-page="' + pageId + '"]');
}

// roadmapOrder holds STAGE_DATA indices in the order stages should be shown/unlocked.
// It starts as the identity (default, no-personalization) order and only changes
// once Stage 01's self-assessment is completed — see computeRoadmapOrder().
let roadmapOrder = STAGE_DATA.map((_, i) => i);
let roadmapPersonalized = false;

// selfAssessment[competencyName] = { level: 'Planning'|'Progressing'|'Demonstrating'|null, reflection: string }
let selfAssessment = {};

// Stage 04's MD/DO/dual choice — feeds track_weight in computeRoadmapOrder().
let trackChoice = null; // 'MD' | 'DO' | 'Dual'

// Stage 05's self-reported testing window ("YYYY-MM") — feeds urgency_weight.
let testingWindowDate = null;

// Quick Setup profile (content/roadmap-timeline-design.md) — only used by the Timeline;
// does not affect computeRoadmapOrder()'s priority scoring.
let studentProfile = { yearInSchool: null, targetCycleYear: null };

// Skip mode: once true, `locked` no longer blocks completion — see handleStageCta().
let skipModeActive = false;

// evidenceLog follows the entry schema in content/evidence-log-design.md, simplified for
// this prototype: no lock point, linked_experience_id, or visible_to_agents flag — every
// entry stays editable in place, keyed by a stable `key` so re-editing a field updates the
// same entry instead of appending duplicates.
let evidenceLog = [];
let entryCounter = 0;

function upsertEntry(key, fields){
  const idx = evidenceLog.findIndex(e => e.key === key);
  if (idx > -1) {
    evidenceLog[idx] = { ...evidenceLog[idx], ...fields };
  } else {
    evidenceLog.push({ key, id: ++entryCounter, ...fields });
  }
  renderEvidenceLog();
}

function removeEntry(key){
  const idx = evidenceLog.findIndex(e => e.key === key);
  if (idx > -1) evidenceLog.splice(idx, 1);
  renderEvidenceLog();
}

function renderStageList(){
  const list = document.getElementById('stage-list');
  const banner = roadmapPersonalized
    ? `<div class="roadmap-personalized-note">✦ Reordered for you based on your Stage 01 self-assessment</div>`
    : '';
  list.innerHTML = banner + roadmapOrder.map(i => {
    const s = STAGE_DATA[i];
    const circleClass = s.status === 'done' ? 'done hex' : (s.status === 'current' ? 'current hex' : 'hex');
    const circleContent = s.status === 'done' ? '✓' : (s.num);
    const statusLabel = s.status === 'done' ? 'Complete' : (s.status === 'current' ? 'In progress' : (skipModeActive ? 'Available' : 'Upcoming'));
    const cta = s.status === 'current' ? `<div class="stage-cta"><div class="stat">Status<b>Current</b></div><button class="btn" onclick="event.stopPropagation(); openStagePanel(${i})">Continue</button></div>` : '';
    return `<div class="stage-row" style="cursor:pointer;" role="button" tabindex="0" aria-label="Open ${s.title}" onclick="openStagePanel(${i})">
      <div class="week-tag">${s.year}</div>
      <div class="stage-circle ${circleClass}">${circleContent}</div>
      <div class="stage-info"><h4>${s.title}</h4><p>${statusLabel}</p></div>
      ${cta}
    </div>`;
  }).join('');
}

let openStageIndex = null;

// Renders one stage "part" as a real chapter section — a heading pulled from its
// leading <b>...</b> lead-in, then flowing paragraph prose, not a bulleted summary
// fragment. Any embedded <details> practice block (block-level) is split out as its
// own sibling element rather than nested inside the <p>, which would be invalid HTML.
function renderLessonPart(p){
  const headingMatch = p.match(/^<b>(.*?)<\/b>\s*/);
  const heading = headingMatch ? headingMatch[1] : '';
  const rest = headingMatch ? p.slice(headingMatch[0].length) : p;
  const detailsIdx = rest.indexOf('<details>');
  const body = detailsIdx === -1 ? rest : rest.slice(0, detailsIdx).trim();
  const details = detailsIdx === -1 ? '' : rest.slice(detailsIdx);
  return `<section class="lesson-section">${heading ? `<h3>${heading}</h3>` : ''}<p>${body}</p>${details}</section>`;
}

function openStagePanel(i){
  openStageIndex = i;
  const s = STAGE_DATA[i];
  document.getElementById('sp-stage').textContent = `Stage ${s.num} · ${s.competencies}`;
  document.getElementById('sp-title').textContent = s.title;
  document.getElementById('sp-why').textContent = s.why;
  document.getElementById('sp-source').innerHTML = s.sourceNote ? `<div class="source-citation ${s.sourceStatus}">
    <span class="source-icon">${s.sourceStatus === 'pending_review' ? '⚠' : '📎'}</span>
    <span><span class="source-label">${s.sourceStatus === 'pending_review' ? 'Pending expert review' : 'Sourced'}</span>${s.sourceNote}</span>
  </div>` : '';
  document.getElementById('sp-parts').innerHTML = s.parts.map(renderLessonPart).join('');
  document.getElementById('sp-deliverable-name').textContent = s.deliverable.name;

  coachState = { stageIdx: i, step: 0 };
  renderCoachPanel();
  renderDeliverableOutput();
  renderSupportingTools(i);

  document.getElementById('sp-checklist').innerHTML = s.checklist.map(c => `<li style="display:flex; gap:8px; font-size:13px; padding:6px 0;"><span class="box" style="width:14px;height:14px;border:2px solid var(--line-strong);border-radius:4px;flex-shrink:0;margin-top:2px;"></span>${c}</li>`).join('');
  const completable = s.status === 'current' || (s.status === 'locked' && skipModeActive);
  document.getElementById('sp-cta').textContent = s.title === 'Premed 101' && s.status === 'done'
    ? 'Update My Roadmap'
    : (s.status === 'done' ? 'Review Again' : (completable ? 'Mark Stage Complete' : 'Preview Stage'));

  renderExploreMore(i);
  renderStageBottomNav(i);
  go('stagedetail', null);
  renderMentorView(i);
  showStageLessonView();
  showDeliverableTab('output');
}

// ---- Stage view toggle (Lesson / Workspace / Mentor) ----
// Same display-toggle pattern as showChatLiveView()/showChatHistoryView() below.
function setActiveStageTab(tabId){
  document.querySelectorAll('.stage-view-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  document.getElementById(tabId).classList.add('active');
  document.getElementById(tabId).setAttribute('aria-selected', 'true');
}
// Switching views doesn't change page, so nothing else resets scroll — without this, a
// student who scrolled down reading a long Lesson lands mid-page in the new view instead
// of at its top (confirmed directly: cold-playthrough found this stranding the Coach panel
// off-screen above an empty Output panel on mobile).
function scrollStageViewToTop(){
  const main = document.querySelector('.main');
  if (main) main.scrollTop = 0;
  window.scrollTo(0, 0);
}
function showStageLessonView(){
  document.getElementById('stage-lesson-view').style.display = '';
  document.getElementById('stage-workspace-view').style.display = 'none';
  document.getElementById('stage-mentor-view').style.display = 'none';
  setActiveStageTab('stage-tab-lesson');
  scrollStageViewToTop();
}
function showStageWorkspaceView(){
  document.getElementById('stage-lesson-view').style.display = 'none';
  document.getElementById('stage-workspace-view').style.display = '';
  document.getElementById('stage-mentor-view').style.display = 'none';
  setActiveStageTab('stage-tab-workspace');
  scrollStageViewToTop();
}
function showStageMentorView(){
  document.getElementById('stage-lesson-view').style.display = 'none';
  document.getElementById('stage-workspace-view').style.display = 'none';
  document.getElementById('stage-mentor-view').style.display = '';
  setActiveStageTab('stage-tab-mentor');
  scrollStageViewToTop();
}
function showDeliverableTab(which){
  document.getElementById('dtab-output').classList.toggle('active', which === 'output');
  document.getElementById('dtab-tools').classList.toggle('active', which === 'tools');
  document.getElementById('deliverable-output').style.display = which === 'output' ? '' : 'none';
  document.getElementById('supporting-tools').style.display = which === 'tools' ? '' : 'none';
  // Re-render on the way back to Output so requiredToolBanner() reflects whatever just
  // changed in Supporting Tools (a rating, a track choice) instead of a stale count.
  if (which === 'output') renderDeliverableOutput();
  scrollStageViewToTop();
}

// ---- Stage 01 self-assessment ----

function levelValue(level){
  return level === 'Demonstrating' ? 3 : level === 'Progressing' ? 2 : level === 'Planning' ? 1 : 0;
}

// Rendered into either the stage panel (sp-assessment) or Quick Setup (qs-assessment) —
// activeAssessmentContainer remembers which, so onclick handlers can re-render in place.
let activeAssessmentContainer = 'sp-assessment';

function renderAssessment(containerId){
  if (containerId) activeAssessmentContainer = containerId;
  const container = document.getElementById(activeAssessmentContainer);
  const rated = COMPETENCIES.filter(c => selfAssessment[c.name] && selfAssessment[c.name].level).length;
  const pct = Math.round((rated / COMPETENCIES.length) * 100);
  let html = `<div class="side-title" style="margin-bottom:10px;">Rate Yourself: The 17 Premed Competencies</div>
    <div class="assess-progress">
      <div class="assess-progress-track"><div class="assess-progress-fill" style="width:${pct}%;"></div></div>
      <div class="assess-progress-label">${rated} / ${COMPETENCIES.length} rated</div>
    </div>`;
  let lastCategory = null;
  COMPETENCIES.forEach((c, ci) => {
    if (c.category !== lastCategory) {
      html += `<div class="assess-category">${c.category}</div>`;
      lastCategory = c.category;
    }
    const entry = selfAssessment[c.name] || { level: null, reflection: '' };
    const showReflection = entry.level === 'Progressing' || entry.level === 'Demonstrating';
    const safeName = c.name.replace(/'/g, "\\'");
    html += `<div class="assess-row">
      <div class="assess-row-name">${c.name}</div>
      <div class="assess-pills" role="group" aria-label="${c.name} self-assessment level">
        ${['Planning', 'Progressing', 'Demonstrating'].map(level =>
          `<div class="assess-pill ${entry.level === level ? 'selected' : ''}" role="button" tabindex="0" aria-pressed="${entry.level === level}" onclick="setAssessmentLevel('${safeName}', '${level}')">${level}</div>`
        ).join('')}
      </div>
      ${showReflection ? `<div class="assess-reflection">
        <div class="assess-reflection-label">One specific moment where you demonstrated this — specific enough someone else could picture it:</div>
        <textarea onblur="updateReflection('${safeName}', this.value)" placeholder="Describe a real moment...">${entry.reflection || ''}</textarea>
        <div class="specificity-hint" id="hint-self-${ci}"></div>
      </div>` : ''}
    </div>`;
  });
  container.innerHTML = html;
}

function setAssessmentLevel(name, level){
  if (!selfAssessment[name]) selfAssessment[name] = { level: null, reflection: '' };
  selfAssessment[name].level = level;
  renderAssessment();
  upsertEntry(`self-${name}`, {
    source_type: 'self_assessment',
    source_reference: 'Stage 01',
    competency_tags: [name],
    maturity_at_entry: level,
    content: selfAssessment[name].reflection || ''
  });
}

// A soft quality bar, not a grade — nothing here blocks saving or unlocking a stage.
// Reuses the same vague-phrase dictionary PS Checker uses (generic language reads the
// same way in a private reflection as it does in an essay), plus a bare length check.
// See content-audit finding: completion had no quality signal beyond "answered or not."
// stageIdx 1 (Narrative) and 9 (Personal Brand) get a hint naming the actual
// concrete-noun/five-minute-window/sensory-detail technique those stages teach,
// instead of the generic version — see curriculum-depth audit Gap C.
function specificityNudge(text, stageIdx){
  const trimmed = text.trim();
  if (trimmed === '') return null;
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const lower = trimmed.toLowerCase();
  const vagueHit = Object.keys(VAGUE_PHRASES).some(p => lower.includes(p));
  const narrativeStage = stageIdx === 1 || stageIdx === 9;
  if (wordCount < 12) return narrativeStage
    ? "This reads pretty short — try the technique from this stage: one concrete noun, one five-minute window, one sensory detail."
    : "This reads pretty short — is there one specific person, place, or moment you could name?";
  if (vagueHit && wordCount < 30) return narrativeStage
    ? "This reads a bit general — swap an abstraction for one concrete noun and a specific window of time, the way this stage's technique describes."
    : "This reads a bit general — a specific detail (a name, a place, a number) would make it stronger.";
  return null;
}

function updateReflection(name, text){
  if (!selfAssessment[name]) selfAssessment[name] = { level: null, reflection: '' };
  selfAssessment[name].reflection = text;
  if (selfAssessment[name].level) {
    upsertEntry(`self-${name}`, {
      source_type: 'self_assessment',
      source_reference: 'Stage 01',
      competency_tags: [name],
      maturity_at_entry: selfAssessment[name].level,
      content: text
    });
  }
  const ci = COMPETENCIES.findIndex(c => c.name === name);
  const hintEl = document.getElementById(`hint-self-${ci}`);
  if (hintEl) hintEl.textContent = specificityNudge(text) || '';
}

// Stage reflection prompts (all stages) auto-tag to whatever competencies that stage
// targets, per the "stage-level default tags" rule in content/evidence-log-design.md.
function updateStageReflection(stageIdx, promptIdx, text){
  const s = STAGE_DATA[stageIdx];
  const key = `stage-${stageIdx}-${promptIdx}`;
  const hintEl = document.getElementById(`hint-stage-${stageIdx}-${promptIdx}`);
  if (text.trim() === '') {
    removeEntry(key);
    if (hintEl) hintEl.textContent = '';
    return;
  }
  upsertEntry(key, {
    source_type: 'stage_reflection',
    source_reference: s.title,
    competency_tags: s.competencies.split(' · '),
    maturity_at_entry: null,
    content: text
  });
  if (hintEl) hintEl.textContent = specificityNudge(text, stageIdx) || '';
}

// ---- Workspace: AI coach (left panel) ----
// Turn-based, one question at a time, reusing each stage's existing reflection[]
// array as the script and specificityNudge() as the heuristic evaluator — the
// HBS-Foundry-paradigm restructure. Still a scripted heuristic, not a real model
// call, same honesty stance as the rest of this app's chat surfaces.
let coachState = { stageIdx: null, step: 0, evaluated: false };

function renderCoachPanel(){
  const { stageIdx, step, evaluated } = coachState;
  const s = STAGE_DATA[stageIdx];
  const container = document.getElementById('coach-panel');
  if (!container) return;

  let transcript = '<div class="chat-messages coach-messages">';
  for (let ri = 0; ri < step; ri++) {
    const entry = evidenceLog.find(e => e.key === `stage-${stageIdx}-${ri}`);
    transcript += `<div class="chat-msg agent"><div class="chat-bubble">${s.reflection[ri]}</div></div>`;
    transcript += `<div class="chat-msg user"><div class="chat-bubble">${entry ? entry.content : ''}</div></div>`;
  }

  if (step >= s.reflection.length) {
    transcript += `</div><p class="fine" style="margin-top:10px;">All ${s.reflection.length} questions answered — fine-tune "${s.deliverable.name}" in the Output tab any time.</p>`;
    container.innerHTML = transcript;
    return;
  }

  const existing = evidenceLog.find(e => e.key === `stage-${stageIdx}-${step}`);
  transcript += `<div class="chat-msg agent"><div class="chat-bubble">${s.reflection[step]}</div></div>`;

  if (evaluated && existing) {
    const hint = specificityNudge(existing.content, stageIdx);
    transcript += `<div class="chat-msg user"><div class="chat-bubble">${existing.content}</div></div></div>`;
    transcript += hint
      ? `<div class="specificity-hint" style="margin-bottom:8px;">${hint}</div>
         <button class="btn outline" onclick="reviseCoachAnswer()">Revise</button>
         <button class="btn" onclick="advanceCoachStep()">Continue anyway →</button>`
      : `<div class="specificity-hint" style="margin-bottom:8px; color:var(--teal-text);">That reads specific and clear.</div>
         <button class="btn" onclick="advanceCoachStep()">Continue →</button>`;
  } else {
    transcript += `</div>
      <div class="chat-input-wrap">
        <textarea id="coach-answer-input" class="chat-input-real" placeholder="Your answer...">${existing ? existing.content : ''}</textarea>
        <button class="chat-send-btn" onclick="submitCoachAnswer()" aria-label="Send answer">↑</button>
      </div>`;
  }
  container.innerHTML = transcript;
}

function submitCoachAnswer(){
  const input = document.getElementById('coach-answer-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  updateStageReflection(coachState.stageIdx, coachState.step, text);
  coachState.evaluated = true;
  renderCoachPanel();
  renderDeliverableOutput();
}

function reviseCoachAnswer(){
  coachState.evaluated = false;
  renderCoachPanel();
}

function advanceCoachStep(){
  coachState.step++;
  coachState.evaluated = false;
  renderCoachPanel();
}

// ---- Workspace: structured deliverable output (right panel) ----
// An alternate, editable view of the same evidenceLog entries the coach panel
// writes to — not a second data store. Special fields (trackChoice, testingWindowDate)
// read from their own existing state and link over to Supporting Tools to change them.
// Stage 01's competency ratings and Stage 04's track choice both block completion
// (handleStageCta()) but aren't modeled as deliverable fields, so nothing in the default
// Output tab used to mention them — a student could answer every Coach question, see
// everything look finished, and only find out they're blocked after clicking the CTA
// (confirmed directly in the cold playthrough). This surfaces the requirement up front.
function requiredToolBanner(s){
  if (s.title === 'Premed 101') {
    const rated = COMPETENCIES.filter(c => selfAssessment[c.name] && selfAssessment[c.name].level).length;
    if (rated < COMPETENCIES.length) {
      return `<div class="required-tool-note">This stage also requires rating all 17 competencies (${rated}/17 so far) — <button class="agent-tool-link" onclick="showDeliverableTab('tools')">open Supporting Tools →</button></div>`;
    }
  }
  if (s.title === 'Strategy: MD or DO' && !trackChoice) {
    return `<div class="required-tool-note">This stage also requires selecting your track (MD / DO / Dual) — <button class="agent-tool-link" onclick="showDeliverableTab('tools')">open Supporting Tools →</button></div>`;
  }
  return '';
}

function renderDeliverableOutput(){
  const { stageIdx } = coachState;
  const s = STAGE_DATA[stageIdx];
  const container = document.getElementById('deliverable-output');
  if (!container) return;
  container.innerHTML = requiredToolBanner(s) + `<div class="side-title" style="margin-bottom:10px;">${s.deliverable.name}</div>` +
    s.deliverable.fields.map(f => {
      if (f.specialField) {
        const value = f.specialField === 'trackChoice' ? (trackChoice || 'Not set yet')
          : f.specialField === 'testingWindowDate' ? (testingWindowDate || 'Not set yet')
          : '';
        return `<div class="deliverable-field">
          <div class="deliverable-field-label">${f.label}</div>
          <div class="deliverable-field-readonly">${value}</div>
          <button class="agent-tool-link" onclick="showDeliverableTab('tools')">Set in Supporting Tools →</button>
        </div>`;
      }
      const entry = evidenceLog.find(e => e.key === `stage-${stageIdx}-${f.reflectionIndex}`);
      return `<div class="deliverable-field">
        <div class="deliverable-field-label">${f.label}</div>
        <textarea class="reflection-textarea" onblur="updateDeliverableField(${f.reflectionIndex}, this.value)" placeholder="Not answered yet — use the Coach to build this.">${entry ? entry.content : ''}</textarea>
      </div>`;
    }).join('');
}

function updateDeliverableField(reflectionIndex, text){
  updateStageReflection(coachState.stageIdx, reflectionIndex, text);
  renderCoachPanel();
}

// ---- Workspace: Supporting Tools tab — relocates the stage-specific one-off widgets ----
function renderSupportingTools(i){
  const s = STAGE_DATA[i];
  document.getElementById('sp-assessment').innerHTML = '';
  document.getElementById('sp-track-selector').innerHTML = '';
  document.getElementById('sp-testing-window').innerHTML = '';
  document.getElementById('sp-recall').innerHTML = '';
  let hasTool = false;
  if (s.title === 'Premed 101') { renderAssessment('sp-assessment'); hasTool = true; }
  if (s.title === 'Strategy: MD or DO') { renderTrackSelector('sp-track-selector'); hasTool = true; }
  if (s.title === 'Grades & MCAT') { renderTestingWindow('sp-testing-window'); hasTool = true; }
  if (i === 7 || i === 8 || i === 9) { renderRecallCheck('sp-recall'); hasTool = true; }
  document.getElementById('supporting-tools-empty').style.display = hasTool ? 'none' : '';
}

// ---- Explore More (contextual, per-stage — links to real existing pages only) ----
function renderExploreMore(i){
  const s = STAGE_DATA[i];
  const container = document.getElementById('stage-explore-more');
  if (!container) return;
  if (!s.exploreMore || !s.exploreMore.length) { container.innerHTML = ''; return; }
  container.innerHTML = `<div class="side-title" style="margin:26px 0 10px;">Explore More</div>
    <div class="explore-grid">
      ${s.exploreMore.map(x => `<div class="explore-card" role="button" tabindex="0" onclick="go('${x.page}', navElementFor('${x.page}'))">${x.label} →</div>`).join('')}
    </div>`;
}

// ---- Persistent bottom nav (Home / Back / Next / progress) ----
function renderStageBottomNav(i){
  const container = document.getElementById('stage-bottom-nav');
  if (!container) return;
  const pos = roadmapOrder.indexOf(i);
  const prevIdx = pos > 0 ? roadmapOrder[pos - 1] : null;
  const nextIdx = pos < roadmapOrder.length - 1 ? roadmapOrder[pos + 1] : null;
  const nextLocked = nextIdx !== null && STAGE_DATA[nextIdx].status === 'locked' && !skipModeActive;
  const backBtn = prevIdx === null
    ? `<button class="btn outline" disabled>← Back</button>`
    : `<button class="btn outline" onclick="openStagePanel(${prevIdx})">← Back</button>`;
  const nextBtn = nextIdx === null
    ? `<button class="btn outline" disabled>Next →</button>`
    : nextLocked
      ? `<button class="btn outline" disabled>Locked</button>`
      : `<button class="btn outline" onclick="openStagePanel(${nextIdx})">Next →</button>`;
  container.innerHTML = `
    <button class="btn outline" onclick="go('bootcamp', navElementFor('bootcamp'))">Home</button>
    ${backBtn}
    <div class="stage-bottom-progress">Stage ${pos + 1} of ${roadmapOrder.length}</div>
    ${nextBtn}
  `;
}

// ---- Stage 04 track selector (MD / DO / Dual) ----

let activeTrackContainer = 'sp-track-selector';

function renderTrackSelector(containerId){
  if (containerId) activeTrackContainer = containerId;
  const container = document.getElementById(activeTrackContainer);
  const options = ['MD', 'DO', 'Dual'];
  const labels = { MD: 'MD-focused', DO: 'DO-focused', Dual: 'Dual-applying' };
  container.innerHTML = `<div class="side-title" style="margin-bottom:8px;">Your Direction</div>
    <div class="track-pills" role="group" aria-label="Your direction">
      ${options.map(o => `<div class="track-pill ${trackChoice === o ? 'selected' : ''}" role="button" tabindex="0" aria-pressed="${trackChoice === o}" onclick="setTrackChoice('${o}')">${labels[o]}</div>`).join('')}
    </div>`;
}

function setTrackChoice(choice){
  trackChoice = choice;
  renderTrackSelector();
}

// ---- Stage 05 testing-window date ----

let activeTestingWindowContainer = 'sp-testing-window';

function renderTestingWindow(containerId){
  if (containerId) activeTestingWindowContainer = containerId;
  const container = document.getElementById(activeTestingWindowContainer);
  container.innerHTML = `<div class="testing-window-box">
    <label for="testing-window-input">Target MCAT testing month (even a rough guess feeds your roadmap's timing)</label>
    <input type="month" id="testing-window-input" value="${testingWindowDate || ''}" onchange="updateTestingWindow(this.value)">
  </div>`;
}

function updateTestingWindow(value){
  testingWindowDate = value || null;
}

// ---- Recall check (Stages 08/09/10) ----
// Real retrieval practice, not static content: asks the student to recall their own
// Stage 02 narrative material from memory before revealing what they actually saved
// to evidenceLog — see curriculum-depth audit Gap D ("resurfaces" was previously just
// a reflection question referencing Stage 02, never an actual retrieval attempt).
function renderRecallCheck(containerId){
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="side-title" style="margin-bottom:10px;">Recall Check — Stage 02</div>
    <p style="font-size:12.5px; color:var(--muted); line-height:1.5; margin-bottom:10px;">Before you look, try to recall from memory: what specific moment did you write about in Stage 02's narrative prompts? This isn't saved anywhere — it's a real retrieval attempt, not a new entry.</p>
    <textarea class="reflection-textarea" placeholder="Try to recall it first, without looking back..."></textarea>
    <button class="btn outline" style="margin-top:8px;" onclick="revealRecallAnswer()">Show what I actually wrote in Stage 02</button>
    <div id="recall-reveal" style="margin-top:10px;"></div>`;
}

function revealRecallAnswer(){
  const el = document.getElementById('recall-reveal');
  if (!el) return;
  const entries = [0, 1, 2].map(ri => evidenceLog.find(e => e.key === `stage-1-${ri}`)).filter(Boolean);
  if (entries.length === 0) {
    el.innerHTML = `<div style="font-size:12.5px; color:var(--muted); font-style:italic;">You haven't completed Stage 02 yet — nothing to compare against.</div>`;
    return;
  }
  el.innerHTML = entries.map(e => `<div style="font-size:13px; color:#3E4A3F; line-height:1.55; padding:8px 0; border-top:1px dashed var(--line);">${e.content}</div>`).join('');
}

function monthsUntil(dateStr){
  const [y, m] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, 1);
  const now = new Date();
  return (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
}

// Priority-scoring pass from content/roadmap-generation-design.md §2: reorder the
// soft/weighted stages (everything after Premed 101, Narrative, Cost & Access) by
// gap_weight + urgency_weight + track_weight — competencies rated low get their stages
// pulled earlier, an approaching test date pulls Grades & MCAT earlier, and a DO/Dual
// track choice pulls Clinical Experience and Personal Brand earlier (DO-shadowing prep,
// osteopathic-letter timing — the two downstream effects Stage 04's own content names).
function computeRoadmapOrder(){
  const fixedCount = 3; // Premed 101, Narrative, Cost & Access keep their positions
  const fixed = STAGE_DATA.map((_, i) => i).slice(0, fixedCount);
  const reorderable = STAGE_DATA.map((_, i) => i).slice(fixedCount);

  const gapWeight = (idx) => STAGE_DATA[idx].competencies.split(' · ').reduce((sum, name) => {
    const rating = selfAssessment[name];
    const level = rating && rating.level ? levelValue(rating.level) : 1; // unrated defaults to Planning
    return sum + (3 - level);
  }, 0);

  const urgencyWeight = (idx) => {
    if (STAGE_DATA[idx].title !== 'Grades & MCAT' || !testingWindowDate) return 0;
    const monthsAway = monthsUntil(testingWindowDate);
    if (monthsAway <= 6) return 4;
    if (monthsAway <= 12) return 2;
    return 0;
  };

  const trackWeight = (idx) => {
    if (trackChoice !== 'DO' && trackChoice !== 'Dual') return 0;
    const title = STAGE_DATA[idx].title;
    return (title === 'Clinical Experience' || title === 'Personal Brand') ? 1.5 : 0;
  };

  const priority = (idx) => gapWeight(idx) + urgencyWeight(idx) + trackWeight(idx);

  reorderable.sort((a, b) => priority(b) - priority(a));
  roadmapOrder = fixed.concat(reorderable);
  roadmapPersonalized = true;
  renderTimeline();
}

function handleStageCta(){
  const s = STAGE_DATA[openStageIndex];

  // Premed 101 is special: completing (or later revisiting) it always requires a full
  // self-assessment, and always recomputes the roadmap order — this is the "reassessment
  // cadence" behavior described in content/evidence-log-design.md, made concrete.
  if (s.title === 'Premed 101' && (s.status === 'current' || s.status === 'done')) {
    const ratedCount = COMPETENCIES.filter(c => selfAssessment[c.name] && selfAssessment[c.name].level).length;
    if (ratedCount < COMPETENCIES.length) {
      showToast(`Rate all 17 competencies before continuing (${ratedCount} / ${COMPETENCIES.length} so far).`);
      return;
    }
    const wasCurrent = s.status === 'current';
    computeRoadmapOrder();
    let nextLocked;
    if (wasCurrent) {
      s.status = 'done';
      nextLocked = roadmapOrder.find(idx => STAGE_DATA[idx].status === 'locked');
      if (nextLocked !== undefined) STAGE_DATA[nextLocked].status = 'current';
    }
    renderStageList();
    renderAgents();
    renderKnowHow();
    renderProgressRing();
    closeStagePanel();
    showToast(wasCurrent
      ? `Premed 101 marked complete. Your roadmap has been reordered based on your self-assessment.`
      : `Your roadmap has been updated based on your latest self-assessment.`);
    return;
  }

  if (s.status === 'current') {
    if (s.title === 'Strategy: MD or DO' && !trackChoice) {
      showToast(`Select MD-focused, DO-focused, or Dual-applying before continuing.`);
      return;
    }

    // Mark this stage done, advance the next locked stage (in roadmap order) to current
    s.status = 'done';

    // Strategy's track choice and Grades & MCAT's testing window feed track_weight and
    // urgency_weight — re-sort the roadmap with the new input, same reassessment-cadence
    // logic Premed 101 uses, but only once personalization has actually started.
    const reprioritized = roadmapPersonalized && (s.title === 'Strategy: MD or DO' || s.title === 'Grades & MCAT');
    if (reprioritized) computeRoadmapOrder();

    const nextLocked = roadmapOrder.find(idx => STAGE_DATA[idx].status === 'locked');
    if (nextLocked !== undefined) {
      STAGE_DATA[nextLocked].status = 'current';
    }
    renderStageList();
    renderAgents();
    renderKnowHow();
    renderProgressRing();
    closeStagePanel();
    showToast(`${s.title} marked complete.${reprioritized ? ' Roadmap re-prioritized based on your choice.' : ''} ${nextLocked !== undefined ? STAGE_DATA[nextLocked].title + ' is now unlocked.' : 'All stages complete!'}`);
  } else if (s.status === 'locked') {
    if (skipModeActive) {
      // Skip mode: locked no longer blocks — mark it done directly, no gating to advance.
      // The 'current' spotlight (the suggested next stage) only moves when it itself
      // gets completed, not when some other unlocked-but-not-current stage does.
      s.status = 'done';
      renderStageList();
      renderAgents();
      renderKnowHow();
      renderProgressRing();
      closeStagePanel();
      showToast(`${s.title} marked complete.`);
      return;
    }
    // Preview only — locked stages can't be completed out of order
    closeStagePanel();
    showToast(`This is a preview — complete earlier stages first to unlock ${s.title}.`);
  } else {
    // done — just reviewing
    closeStagePanel();
  }
}

function showToast(msg){
  let toast = document.getElementById('mock-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'mock-toast';
    toast.style.cssText = 'position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:var(--ink); color:white; padding:14px 22px; border-radius:12px; font-size:13.5px; z-index:300; box-shadow:0 12px 30px -10px rgba(14,30,54,0.4); max-width:420px; text-align:center;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.transition = 'opacity .4s ease'; toast.style.opacity = '0'; }, 3200);
}

// Stage detail used to be a modal you'd "close"; it's a real page now, so closing
// it just means navigating back to the Bootcamp list — kept the name since every
// handleStageCta() branch already calls it at exactly the right moment.
function closeStagePanel(){ go('bootcamp', navElementFor('bootcamp')); }

// ---- Mentor view: rehearsal before a real stakeholder conversation ----
// Reuses the exact same per-stage agent, generateAgentReply()/resolveChatTokens() engine,
// and handoff-to-Chat that the old always-open advisor sidebar used — the only change is
// framing (a named persona header + a "Start Call" gate + starter buttons pulled straight
// from that agent's own chatTopics, the same source the main Chat page's Quick Prompts use)
// rather than a chat box that's simply always open. Still a scripted reply, not a real
// model call or a real call at all — the practice-conversation framing says so explicitly.

function findAgentForStage(stageIdx){
  const s = STAGE_DATA[stageIdx];
  return AGENT_DATA.find(a => a.stageTitle === s.title) || findAgent('reflection-coach');
}

let stageAdvisorState = { stageIdx: null, agentId: null, messages: [], started: false };

function renderMentorView(stageIdx){
  const matched = findAgentForStage(stageIdx);
  const gated = isAgentGated(matched);
  // If the stage's own agent is still locked, Reflection Coach (core, always available)
  // stands in rather than showing a dead end.
  const agent = gated ? findAgent('reflection-coach') : matched;
  document.getElementById('mentor-name').textContent = agent.name;
  document.getElementById('mentor-tip').textContent = gated
    ? `${matched.name} unlocks once you complete ${matched.stageTitle} — Reflection Coach stands in until then.`
    : `What this mentor actually does: ${agent.desc}`;
  const greeting = gated
    ? `${matched.name} unlocks once you complete ${matched.stageTitle} — I'm Reflection Coach in the meantime, and I can still help you think through this stage.`
    : resolveChatTokens(agent.chatGreeting);
  stageAdvisorState = { stageIdx, agentId: agent.id, messages: [{ sender: 'agent', text: greeting }], started: false };

  document.getElementById('mentor-starters').innerHTML = (agent.chatTopics || []).map(t =>
    `<div class="skill-tile" role="button" tabindex="0" onclick="askMentorStarter('${t.label.replace(/'/g, "\\'")}')">✎ ${t.label}</div>`
  ).join('');
  document.getElementById('mentor-call-area').style.display = 'none';
  document.getElementById('mentor-start-call-btn').style.display = '';
}

function startMentorCall(){
  stageAdvisorState.started = true;
  document.getElementById('mentor-call-area').style.display = '';
  document.getElementById('mentor-start-call-btn').style.display = 'none';
  renderStageAdvisorMessages();
}

function askMentorStarter(label){
  if (!stageAdvisorState.started) startMentorCall();
  document.getElementById('sd-advisor-input').value = `Tell me about ${label}`;
  sendStageAdvisorMessage();
}

function renderStageAdvisorMessages(){
  const el = document.getElementById('sd-advisor-messages');
  if (!el) return;
  el.innerHTML = stageAdvisorState.messages.map(m =>
    `<div class="chat-msg ${m.sender}"><div class="chat-bubble">${m.text}</div></div>`
  ).join('');
  el.scrollTop = el.scrollHeight;
}

function sendStageAdvisorMessage(){
  const input = document.getElementById('sd-advisor-input');
  const text = input.value.trim();
  if (!text) return;
  const agent = findAgent(stageAdvisorState.agentId);
  stageAdvisorState.messages.push({ sender: 'user', text });
  stageAdvisorState.messages.push({ sender: 'agent', text: generateAgentReply(agent, text) });
  input.value = '';
  renderStageAdvisorMessages();
}

function handleStageAdvisorKey(e){
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendStageAdvisorMessage(); }
}

// Hands the actual conversation off to the main Chat page, rather than just switching
// agents there and losing what was already said.
function continueStageAdvisorInChat(){
  archiveChatSession();
  chatState = { activeAgentId: stageAdvisorState.agentId, messages: stageAdvisorState.messages.slice() };
  go('chat', document.getElementById('nav-new-chat'));
  showChatLiveView();
  renderChat();
}

// Agents derived from real stage unlocks, plus core agents available from the start

function stageIndexByTitle(title){
  return STAGE_DATA.findIndex(s => s.title === title);
}

function renderAgents(){
  const grid = document.getElementById('agents-grid');
  grid.innerHTML = AGENT_DATA.map(a => {
    const idx = a.stageTitle ? stageIndexByTitle(a.stageTitle) : -1;
    const gated = idx > -1 && STAGE_DATA[idx].status === 'locked';
    const unlockNote = a.stageTitle
      ? `<div style="margin-top:10px; font-size:11px; font-family:'IBM Plex Mono',monospace; color:${gated ? 'var(--accent2-text)' : 'var(--teal-text)'};">${gated ? '🔒 Unlocks after ' + a.stageTitle : '✓ Unlocked'}</div>`
      : `<div style="margin-top:10px; font-size:11px; font-family:'IBM Plex Mono',monospace; color:var(--teal-text);">Core agent · available from Stage 01</div>`;
    const clickable = idx > -1 ? `onclick="openStagePanel(${idx})" style="cursor:pointer;" role="button" tabindex="0" aria-label="Open ${a.stageTitle}"` : '';
    // Real-tool link: only surfaced once the agent is actually unlocked, so it doesn't
    // read as a promise the app can't keep yet.
    const toolLink = (a.realTool && !gated)
      ? `<button class="agent-tool-link" onclick="event.stopPropagation(); go('${a.realTool}', navElementFor('${a.realTool}'))">${a.realToolLabel} →</button>`
      : '';
    return `<div class="agent-card2" ${clickable}>
      <div class="agent-icon2">◈</div>
      <h4>${a.name}</h4>
      <p>${a.desc}</p>
      ${unlockNote}
      ${toolLink}
    </div>`;
  }).join('');
}

function renderKnowHow(){
  const grid = document.getElementById('kh-grid');
  grid.innerHTML = roadmapOrder.map(i => {
    const s = STAGE_DATA[i];
    const bullets = s.competencies.split(' · ').map(c => `<li>${c}</li>`).join('');
    return `<div class="kh-card" style="cursor:pointer;" role="button" tabindex="0" aria-label="Open ${s.title}" onclick="openStagePanel(${i})">
      <div class="kh-icon">${s.title === 'Cost & Access' ? '$' : '◎'}</div>
      <h4>${s.title}</h4>
      <ul>${bullets}</ul>
    </div>`;
  }).join('');
}

function renderGlossary(){
  const grid = document.getElementById('glossary-grid');
  if (!grid) return;
  let lastCategory = null;
  let html = '';
  GLOSSARY_TERMS.forEach(g => {
    if (g.category !== lastCategory) {
      html += `<div class="assess-category">${g.category}</div>`;
      lastCategory = g.category;
    }
    html += `<div class="glossary-row"><div class="glossary-term">${g.term}</div><div class="glossary-def">${g.definition}</div></div>`;
  });
  grid.innerHTML = html;
}

function renderEvidenceLog(){
  const summary = document.getElementById('evidence-log-summary');
  const grid = document.getElementById('evidence-log-grid');
  if (!summary || !grid) return;

  const withEvidence = COMPETENCIES.filter(c => evidenceLog.some(e => e.competency_tags.includes(c.name))).length;
  summary.innerHTML = `<div class="evidence-summary-bar">
    <div><div class="evidence-summary-stat">${evidenceLog.length}</div><div class="evidence-summary-label">Entries logged</div></div>
    <div><div class="evidence-summary-stat">${withEvidence} / ${COMPETENCIES.length}</div><div class="evidence-summary-label">Competencies with evidence</div></div>
  </div>`;

  let lastCategory = null;
  let html = '';
  COMPETENCIES.forEach(c => {
    if (c.category !== lastCategory) {
      html += `<div class="evidence-category">${c.category}</div>`;
      lastCategory = c.category;
    }
    const entries = evidenceLog.filter(e => e.competency_tags.includes(c.name));
    html += `<div class="evidence-competency-card">
      <div class="evidence-competency-head"><div class="evidence-competency-name">${c.name}</div></div>
      ${entries.length === 0
        ? `<div class="evidence-competency-empty">No entries yet</div>`
        : entries.map(e => `<div class="evidence-entry">
            <div class="evidence-entry-meta">
              <span>${e.source_reference}</span>
              ${e.maturity_at_entry ? `<span class="evidence-entry-level">${e.maturity_at_entry}</span>` : ''}
            </div>
            <div class="evidence-entry-content">${e.content ? e.content : '<span style="font-style:italic;color:var(--muted);">(rated, no reflection written yet)</span>'}</div>
          </div>`).join('')}
    </div>`;
  });
  grid.innerHTML = html;
}

function renderProgressRing(){
  const total = STAGE_DATA.length;
  const doneCount = STAGE_DATA.filter(x => x.status === 'done').length;
  const currentArrIdx = STAGE_DATA.findIndex(x => x.status === 'current');
  const positionInOrder = currentArrIdx > -1 ? roadmapOrder.indexOf(currentArrIdx) : -1;
  const pct = Math.round((doneCount / total) * 100);
  const ring = document.getElementById('progress-ring');
  ring.style.background = `conic-gradient(#C6963A 0% ${pct}%, #EFE6D2 ${pct}% 100%)`;
  document.getElementById('ring-label').textContent = `Stage ${positionInOrder > -1 ? positionInOrder + 1 : total} / ${total}`;
}

// ---- Quick Setup (content/roadmap-timeline-design.md) ----

function openQuickSetup(){
  renderYearPills();
  renderCyclePills();
  renderTrackSelector('qs-track-selector');
  renderTestingWindow('qs-testing-window');
  renderAssessment('qs-assessment');
  document.getElementById('quicksetup-modal').classList.add('open');
}

function closeQuickSetup(){ document.getElementById('quicksetup-modal').classList.remove('open'); }
function closeIfQuickSetupOverlay(e){ if (e.target.id === 'quicksetup-modal') closeQuickSetup(); }

function renderYearPills(){
  const container = document.getElementById('qs-year-pills');
  const options = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Post-Grad / Gap Year'];
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', 'Where are you right now?');
  container.innerHTML = options.map(o =>
    `<div class="track-pill ${studentProfile.yearInSchool === o ? 'selected' : ''}" role="button" tabindex="0" aria-pressed="${studentProfile.yearInSchool === o}" onclick="setYearInSchool('${o.replace(/'/g, "\\'")}')">${o}</div>`
  ).join('');
}

function setYearInSchool(year){
  studentProfile.yearInSchool = year;
  renderYearPills();
}

function renderCyclePills(){
  const container = document.getElementById('qs-cycle-pills');
  const startYear = new Date().getFullYear();
  const options = [startYear, startYear + 1, startYear + 2, startYear + 3];
  container.setAttribute('role', 'group');
  container.setAttribute('aria-label', 'When do you plan to submit your primary application?');
  container.innerHTML = options.map(y =>
    `<div class="track-pill ${studentProfile.targetCycleYear === y ? 'selected' : ''}" role="button" tabindex="0" aria-pressed="${studentProfile.targetCycleYear === y}" onclick="setTargetCycleYear(${y})">${y}</div>`
  ).join('');
}

function setTargetCycleYear(year){
  studentProfile.targetCycleYear = year;
  renderCyclePills();
}

function submitQuickSetup(){
  if (!studentProfile.yearInSchool) { showToast('Select where you are in school before continuing.'); return; }
  if (!studentProfile.targetCycleYear) { showToast('Select a target application cycle before continuing.'); return; }
  if (!trackChoice) { showToast('Select MD-focused, DO-focused, or Dual-applying before continuing.'); return; }
  const ratedCount = COMPETENCIES.filter(c => selfAssessment[c.name] && selfAssessment[c.name].level).length;
  if (ratedCount < COMPETENCIES.length) {
    showToast(`Rate all 17 competencies before continuing (${ratedCount} / ${COMPETENCIES.length} so far).`);
    return;
  }

  skipModeActive = true;
  computeRoadmapOrder(); // also calls renderTimeline()

  // Spotlight the first not-yet-done stage as a suggested starting point — everything
  // else stays 'locked' in name only, since skipModeActive stops that from blocking.
  STAGE_DATA.forEach(s => { if (s.status === 'current') s.status = 'locked'; });
  const firstNotDone = roadmapOrder.find(idx => STAGE_DATA[idx].status !== 'done');
  if (firstNotDone !== undefined) STAGE_DATA[firstNotDone].status = 'current';

  renderStageList();
  renderAgents();
  renderKnowHow();
  renderProgressRing();
  closeQuickSetup();
  go('timeline', document.querySelector('.nav-item[data-page="timeline"]'));
  showToast(`Your personalized timeline is ready. Every stage is unlocked — tackle them in whatever order actually works for you.`);
}

// ---- Timeline ----

// Chronological term ordering (not "academic year" grouping): Spring(Jan-Apr)=0,
// Summer(May-Jul)=1, Fall(Aug-Dec)=2, so `order` increases monotonically with real time.
function academicTermLabel(date){
  const month = date.getMonth();
  const year = date.getFullYear();
  const type = month <= 3 ? 'Spring' : month <= 6 ? 'Summer' : 'Fall';
  const offset = month <= 3 ? 0 : month <= 6 ? 1 : 2;
  return { label: `${type} ${year}`, order: year * 3 + offset };
}

function termFromOrder(order){
  const year = Math.floor(order / 3);
  const offset = ((order % 3) + 3) % 3;
  const type = offset === 0 ? 'Spring' : offset === 1 ? 'Summer' : 'Fall';
  return { label: `${type} ${year}`, order, stages: [], milestones: [] };
}

// Builds the term-by-term plan described in content/roadmap-timeline-design.md §3:
// a greedy, front-loaded distribution of not-yet-done stages across the terms between
// now and the target cycle's primary-submission window, with real milestones overlaid.
function computeTimeline(){
  if (!studentProfile.targetCycleYear) return null;

  const startOrder = academicTermLabel(new Date()).order;
  const targetSubmitOrder = studentProfile.targetCycleYear * 3 + 1; // Summer = primary submission

  const terms = [];
  const endOrder = Math.max(startOrder, targetSubmitOrder);
  for (let o = startOrder; o <= endOrder; o++) terms.push(termFromOrder(o));

  const planningTerms = terms.length > 1 ? terms.slice(0, -1) : terms;
  const remainingStages = roadmapOrder.filter(idx => STAGE_DATA[idx].status !== 'done').map(idx => STAGE_DATA[idx]);
  remainingStages.forEach((stage, i) => {
    const termIdx = Math.min(Math.floor(i * planningTerms.length / Math.max(remainingStages.length, 1)), planningTerms.length - 1);
    planningTerms[termIdx].stages.push(stage.title);
  });

  if (testingWindowDate) {
    const [y, m] = testingWindowDate.split('-').map(Number);
    const mcatOrder = academicTermLabel(new Date(y, m - 1, 1)).order;
    const match = terms.find(t => t.order === mcatOrder) || terms[terms.length - 1];
    match.milestones.push('MCAT test date');
  }

  const submitTerm = terms.find(t => t.order === targetSubmitOrder) || terms[terms.length - 1];
  submitTerm.milestones.push('AMCAS primary application submission');

  const secondaryOrder = targetSubmitOrder + 1;
  let secondaryTerm = terms.find(t => t.order === secondaryOrder);
  if (!secondaryTerm) { secondaryTerm = termFromOrder(secondaryOrder); terms.push(secondaryTerm); }
  secondaryTerm.milestones.push('Secondary applications');
  secondaryTerm.milestones.push('Interviews begin');

  return terms;
}

function renderTimeline(){
  const grid = document.getElementById('timeline-grid');
  const sub = document.getElementById('timeline-sub');
  const paceEl = document.getElementById('timeline-pace');
  if (!grid) return;

  const timeline = computeTimeline();
  if (!timeline) {
    grid.innerHTML = '';
    if (sub) sub.textContent = 'Complete Quick Setup or Stage 01 (with a target cycle year) to generate your personalized timeline to application day.';
    if (paceEl) paceEl.innerHTML = '';
    return;
  }
  if (sub) sub.textContent = `A planning estimate from now through your ${studentProfile.targetCycleYear} application cycle — not a guarantee, and it reorders automatically as your self-assessment, track, and testing date change.`;

  if (paceEl) {
    const pace = computePaceRead();
    paceEl.innerHTML = pace ? `<div class="pace-read ${pace.level}">${pace.message}</div>` : '';
  }

  grid.innerHTML = timeline.map(term => `
    <div class="timeline-term">
      <div class="timeline-term-label">${term.label}</div>
      <div class="timeline-term-body">
        ${term.stages.length ? `<ul class="timeline-stage-list">${term.stages.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
        ${term.milestones.length === 0 && term.stages.length === 0 ? '<div class="timeline-empty">Nothing scheduled</div>' : ''}
        ${term.milestones.map(m => `<div class="timeline-milestone">◆ ${m}</div>`).join('')}
      </div>
    </div>
  `).join('');
}

// ---- Personal Statement Checker (content/personal-statement-checker-design.md) ----

function detectPhrases(text){
  const lower = text.toLowerCase();
  const found = [];
  Object.entries(CLICHE_PHRASES).forEach(([phrase, suggestion]) => {
    if (lower.includes(phrase)) found.push({ phrase, suggestion, type: 'cliche' });
  });
  Object.entries(VAGUE_PHRASES).forEach(([phrase, suggestion]) => {
    if (lower.includes(phrase)) found.push({ phrase, suggestion, type: 'vague' });
  });
  return found;
}

function charCounterColor(count, limit){
  const ratio = count / limit;
  if (count > limit) return '#DC2626';
  if (ratio > 0.96) return '#EF4444';
  if (ratio > 0.85) return '#D97706';
  return '#1D9E75';
}

// Honest heuristic, not an AI-generated categorization — the source product used a real
// LLM call here. See content/personal-statement-checker-design.md §2 for why this is a
// signal count instead, and what it can and can't actually tell.
function computeAspirationsCheck(text){
  const firstPersonAgency = (text.match(/\bI (realized|decided|chose|led|built|organized|created|initiated|took|asked|founded|started|figured out|pushed|drove)\b/gi) || []).length;
  const thirdPersonAdmiration = (text.match(/\b(she|he|they) (showed me|taught me|inspired me|amazed me|touched me)\b|\b(his|her|their) (dedication|compassion|kindness|patience)\b/gi) || []).length;
  if (firstPersonAgency === 0 && thirdPersonAdmiration === 0) return null;
  if (thirdPersonAdmiration > firstPersonAgency) {
    return { level: 'bad', label: 'Inspirations-Heavy — Needs Work',
      note: `This reads as more about someone else's admirable qualities than your own growth or action. Admissions committees want to see what you did, decided, or realized — not just who impressed you.` };
  }
  if (firstPersonAgency >= thirdPersonAdmiration * 2) {
    return { level: 'good', label: 'Applicant-Centered — Strong',
      note: `The focus stays on your own actions and growth, which is exactly what this section should demonstrate.` };
  }
  return { level: 'warn', label: 'Balanced',
    note: `A reasonable mix of your own agency and others who influenced you — just make sure the throughline stays about your growth, not theirs.` };
}

function computePhysicianSpecificityCheck(text){
  const lower = text.toLowerCase();
  const physicianSpecific = /\b(physician|diagnos\w*|medical decision|lead(?:ing)? the care team|prescri\w*|clinical authority|differential diagnosis)\b/.test(lower);
  const healthcareGeneric = /\b(healthcare|health care|patients|helping people|medicine|medical field)\b/.test(lower);
  if (physicianSpecific) {
    return { level: 'good', label: 'Why MD, Not NP/PA? — Clear',
      note: `You've named something specific to the physician role, not just healthcare in general — that's exactly what this question is asking for.` };
  }
  if (healthcareGeneric) {
    return { level: 'warn', label: 'Why MD, Not NP/PA? — Implicit',
      note: `This describes healthcare or helping people generally, but doesn't yet name what's specific to being a physician versus another healthcare role. Worth addressing directly somewhere in your application materials.` };
  }
  return null;
}

function renderPsChecker(){
  const typeSelect = document.getElementById('ps-content-type');
  if (!typeSelect) return;
  if (typeSelect.options.length === 0) {
    typeSelect.innerHTML = AMCAS_CONTENT_TYPES.map(t => `<option value="${t.id}">${t.name} (${t.limit} chars)</option>`).join('');
  }
  const selectedType = AMCAS_CONTENT_TYPES.find(t => t.id === typeSelect.value) || AMCAS_CONTENT_TYPES[0];
  const text = document.getElementById('ps-draft-input').value;
  const counter = document.getElementById('ps-char-counter');
  counter.style.color = charCounterColor(text.length, selectedType.limit);
  counter.textContent = `${text.length} / ${selectedType.limit} characters`;

  const sidebar = document.getElementById('ps-sidebar');
  if (!text.trim()) {
    sidebar.innerHTML = `<div class="ps-panel"><div class="ps-empty">Paste a draft to see the phrase detector and specificity checks.</div></div>`;
    return;
  }

  const phrases = detectPhrases(text);
  const aspirations = computeAspirationsCheck(text);
  const physician = computePhysicianSpecificityCheck(text);

  let html = `<div class="ps-panel"><div class="ps-panel-title">Phrase Detector (${phrases.length})</div>`;
  html += phrases.length === 0
    ? `<div class="ps-empty">No flagged clichés or vague phrases.</div>`
    : phrases.map(p => `<div class="ps-phrase-item"><span class="ps-phrase-tag ${p.type}">${p.type === 'cliche' ? 'Cliché' : 'Vague'}</span>"${p.phrase}"<div class="ps-phrase-suggestion">${p.suggestion}</div></div>`).join('');
  html += `</div>`;

  if (aspirations) {
    html += `<div class="ps-panel"><div class="ps-panel-title">Aspirations vs. Inspirations</div><div class="ps-check-card ${aspirations.level}"><div class="ps-check-label">${aspirations.label}</div>${aspirations.note}</div></div>`;
  }
  if (physician) {
    html += `<div class="ps-panel"><div class="ps-panel-title">Physician Specificity</div><div class="ps-check-card ${physician.level}"><div class="ps-check-label">${physician.label}</div>${physician.note}</div></div>`;
  }

  sidebar.innerHTML = html;
}

// ---- Timeline pace read ----
// Deliberately framed around runway adequacy (is there enough time left for what
// remains), never around comparison to peers or an expected schedule — see the
// customer-research note on shame-based milestone framing. yearInSchool/targetCycleYear
// only give an approximate runway estimate, not a precise elapsed-time measurement.
function computePaceRead(){
  const timeline = computeTimeline();
  if (!timeline) return null;
  const remainingStages = roadmapOrder.filter(idx => STAGE_DATA[idx].status !== 'done').length;
  const planningTerms = timeline.length > 1 ? timeline.length - 1 : timeline.length;
  const stagesPerTerm = remainingStages / Math.max(planningTerms, 1);

  if (stagesPerTerm <= 1) {
    return { level: 'good', message: `You have real breathing room — about ${stagesPerTerm.toFixed(1)} stage(s) per remaining term to reach your ${studentProfile.targetCycleYear} cycle. No need to rush.` };
  }
  if (stagesPerTerm <= 2) {
    return { level: 'warn', message: `This fits, but it's a real pace — roughly ${stagesPerTerm.toFixed(1)} stages per term left to reach your ${studentProfile.targetCycleYear} cycle. Worth checking in on this each term.` };
  }
  return { level: 'bad', message: `This is a tight fit — roughly ${stagesPerTerm.toFixed(1)} stages per term left. That's not a judgment on where you are, just a signal that your ${studentProfile.targetCycleYear} target may need more runway, or some stages may need to move faster than others.` };
}

// ---- "Should I Be a Doctor?" quiz ----

let quizState = { idx: 0, scores: { intrinsic: 0, realistic: 0, resilience: 0, clarity: 0 }, done: false };

function answerQuizQuestion(optionIdx){
  const q = DOCTOR_QUIZ_QUESTIONS[quizState.idx];
  const opt = q.options[optionIdx];
  quizState.scores.intrinsic += opt.score.intrinsic;
  quizState.scores.realistic += opt.score.realistic;
  quizState.scores.resilience += opt.score.resilience;
  quizState.scores.clarity += opt.score.clarity;
  if (quizState.idx + 1 >= DOCTOR_QUIZ_QUESTIONS.length) quizState.done = true;
  else quizState.idx += 1;
  renderDoctorQuiz();
}

function retakeDoctorQuiz(){
  quizState = { idx: 0, scores: { intrinsic: 0, realistic: 0, resilience: 0, clarity: 0 }, done: false };
  renderDoctorQuiz();
}

function renderDoctorQuiz(){
  const body = document.getElementById('doctorquiz-body');
  if (!body) return;

  if (quizState.done) {
    const total = quizState.scores.intrinsic + quizState.scores.realistic + quizState.scores.resilience + quizState.scores.clarity;
    const tier = DOCTOR_QUIZ_TIERS.find(t => total >= t.min);
    body.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-banner ${tier.level}">
          <div class="quiz-result-label">${tier.label}</div>
          <div class="quiz-result-tagline">${tier.tagline}</div>
        </div>
        <div class="quiz-result-desc">${tier.description}</div>
        <div class="quiz-result-section">
          <div class="quiz-result-section-title">Honest Truths</div>
          <ul>${tier.honest.map(h => `<li>⚠ ${h}</li>`).join('')}</ul>
        </div>
        <div class="quiz-result-section">
          <div class="quiz-result-section-title">Real Positives</div>
          <ul>${tier.positives.map(p => `<li>✓ ${p}</li>`).join('')}</ul>
        </div>
        <div class="quiz-result-section">
          <div class="quiz-result-section-title">Next Steps</div>
          <ul>${tier.nextSteps.map(n => `<li>→ ${n}</li>`).join('')}</ul>
        </div>
        <div class="quiz-facts-bar">${DOCTOR_QUIZ_FACTS.map(f => `<div class="quiz-fact"><div class="quiz-fact-value">${f.value}</div><div class="quiz-fact-label">${f.label}</div></div>`).join('')}</div>
        <button class="btn outline quiz-retake-btn" onclick="retakeDoctorQuiz()">Retake the Quiz</button>
      </div>
    `;
    return;
  }

  const q = DOCTOR_QUIZ_QUESTIONS[quizState.idx];
  const pct = Math.round((quizState.idx / DOCTOR_QUIZ_QUESTIONS.length) * 100);
  body.innerHTML = `
    <div class="quiz-progress-track"><div class="quiz-progress-fill" style="width:${pct}%;"></div></div>
    <div class="quiz-question-card">
      <div class="quiz-question-text">${quizState.idx + 1}. ${q.question}</div>
      <div class="quiz-question-subtext">${q.subtext}</div>
      ${q.options.map((opt, i) => `<button class="quiz-option" onclick="answerQuizQuestion(${i})">${opt.label}</button>`).join('')}
    </div>
  `;
}

// ---- Chat (single active agent, keyword-matched heuristic replies grounded in real
// app state — not a real model call, same honesty stance as Committee/Interview Sim) ----

let chatState = { activeAgentId: null, messages: [] };
let chatSessions = [];
let chatSessionCounter = 0;

function findAgent(agentId){ return AGENT_DATA.find(a => a.id === agentId); }

function isAgentGated(agent){
  const idx = agent.stageTitle ? stageIndexByTitle(agent.stageTitle) : -1;
  return idx > -1 && STAGE_DATA[idx].status === 'locked';
}

// Every {token} in a chatGreeting/chatFallback/topic.reply string gets swapped for a
// live value computed from real app state right before it's shown — this is what makes
// these scripted replies feel grounded instead of generic, without it being real AI.
function resolveChatTokens(text){
  const currentStage = STAGE_DATA.find(s => s.status === 'current');
  const withEvidence = COMPETENCIES.filter(c => evidenceLog.some(e => e.competency_tags.includes(c.name))).length;
  const narrativeCount = evidenceLog.filter(e => e.source_reference === 'Be Yourself: Narrative').length;
  const targetCycleLine = studentProfile.targetCycleYear
    ? `You're targeting the ${studentProfile.targetCycleYear} application cycle.`
    : `You haven't set a target application cycle yet — Quick Setup or Stage 05 can set that.`;

  const tokens = {
    currentStageTitle: currentStage ? currentStage.title : 'your current stage',
    evidenceCount: evidenceLog.length,
    competencyCoverage: withEvidence,
    narrativeCount,
    targetCycleLine,
    patternRead: withEvidence < 5
      ? `there's not quite enough logged yet to see a real pattern — keep rating competencies and answering stage reflections as things actually happen.`
      : `worth noticing which competencies keep showing up unprompted, versus ones that only appear when a stage directly asks for them.`
  };

  return text.replace(/\{(\w+)\}/g, (m, key) => (key in tokens) ? tokens[key] : m);
}

function generateAgentReply(agent, userText){
  const lower = userText.toLowerCase();
  const lifeContext = LIFE_CONTEXT_SIGNALS.find(s => s.keywords.some(k => lower.includes(k)));
  if (lifeContext) return resolveChatTokens(lifeContext.reply);
  const topic = (agent.chatTopics || []).find(t => t.keywords.some(k => lower.includes(k)));
  return resolveChatTokens(topic ? topic.reply : agent.chatFallback);
}

function archiveChatSession(){
  // Only worth keeping if the student actually said something — a session that's
  // just the unread greeting isn't a real past conversation, it's noise in the list.
  if (!chatState.messages.some(m => m.sender === 'user')) return;
  chatSessions.push({ id: ++chatSessionCounter, agentId: chatState.activeAgentId, messages: chatState.messages.slice() });
}

function startNewChat(agentId){
  archiveChatSession();
  const agent = findAgent(agentId) || findAgent(chatState.activeAgentId) || AGENT_DATA.find(a => !isAgentGated(a));
  chatState = { activeAgentId: agent.id, messages: [{ sender: 'agent', text: resolveChatTokens(agent.chatGreeting) }] };
  showChatLiveView();
  renderChat();
}

function switchChatAgent(agentId){
  const agent = findAgent(agentId);
  if (!agent || isAgentGated(agent)) return;
  closeModal();
  startNewChat(agentId);
}

function sendChatMessage(){
  const input = document.getElementById('chat-input-box');
  const text = input.value.trim();
  if (!text) return;
  const agent = findAgent(chatState.activeAgentId);
  chatState.messages.push({ sender: 'user', text });
  chatState.messages.push({ sender: 'agent', text: generateAgentReply(agent, text) });
  input.value = '';
  renderChat();
}

function askQuickPrompt(label){
  document.getElementById('chat-input-box').value = `Tell me about ${label}`;
  sendChatMessage();
}

function handleChatInputKey(e){
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
}

// Reopening a past session (from Chat History) lands back on the live view without
// going through the "New Chat" sub-item's onclick — keep the sidebar highlight in sync
// here instead, so it doesn't get stuck showing "Chat History" as active.
function setActiveChatNavItem(id){
  document.querySelectorAll('.nav-item, .sub-item').forEach(n => n.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function showChatLiveView(){
  document.getElementById('chat-live-view').style.display = '';
  document.getElementById('chat-history-view').style.display = 'none';
  setActiveChatNavItem('nav-new-chat');
}

function showChatHistoryView(){
  archiveChatSession();
  chatState = { activeAgentId: chatState.activeAgentId, messages: [] };
  document.getElementById('chat-live-view').style.display = 'none';
  document.getElementById('chat-history-view').style.display = '';
  setActiveChatNavItem('nav-chat-history');
  renderChatHistory();
}

function reopenChatSession(sessionId){
  const session = chatSessions.find(s => s.id === sessionId);
  if (!session) return;
  chatSessions = chatSessions.filter(s => s.id !== sessionId);
  chatState = { activeAgentId: session.agentId, messages: session.messages.slice() };
  showChatLiveView();
  renderChat();
}

function renderChatAgentPicker(){
  const list = document.getElementById('chat-agent-picker-list');
  if (!list) return;
  list.innerHTML = AGENT_DATA.map(a => {
    const gated = isAgentGated(a);
    const isCurrent = a.id === chatState.activeAgentId;
    return `<div class="agent-row ${gated ? 'gated' : ''}">
      <div class="p-avatar"></div>
      <div class="info">
        <h4>${a.name}</h4>
        <p>${a.desc}</p>
        ${gated ? `<div class="tags">🔒 Unlocks after ${a.stageTitle}</div>` : ''}
      </div>
      <button class="add-btn" ${(gated || isCurrent) ? 'disabled' : ''} onclick="switchChatAgent('${a.id}')">${isCurrent ? 'Current' : 'Switch'}</button>
    </div>`;
  }).join('');
}

function renderChat(){
  const agent = findAgent(chatState.activeAgentId);
  if (!agent) return;

  const nameEl = document.getElementById('chat-agent-name');
  if (nameEl) nameEl.textContent = agent.name;

  const threadEl = document.getElementById('chat-messages');
  if (threadEl) {
    threadEl.innerHTML = chatState.messages.map(m =>
      `<div class="chat-msg ${m.sender}"><div class="chat-bubble">${m.text}</div></div>`
    ).join('');
    threadEl.scrollTop = threadEl.scrollHeight;
  }

  const participantEl = document.getElementById('chat-participant-block');
  if (participantEl) {
    participantEl.innerHTML = `<div class="participant-row"><div class="p-avatar"></div><div><div class="p-name">${agent.name}</div><div class="p-role">Specialized Agent</div></div></div>
      <div class="manage-box" style="cursor:pointer;" role="button" tabindex="0" onclick="renderChatAgentPicker(); openModal();"><div><p>Switch agent</p><span>Chat with a different specialized agent.</span></div></div>`;
  }

  const skillsEl = document.getElementById('chat-skills-grid');
  if (skillsEl) {
    const prompts = (agent.chatTopics || []).map(t =>
      `<div class="skill-tile" role="button" tabindex="0" onclick="askQuickPrompt('${t.label.replace(/'/g, "\\'")}')">✎ ${t.label}</div>`
    ).join('');
    const toolTile = agent.realTool
      ? `<div class="skill-tile" role="button" tabindex="0" onclick="go('${agent.realTool}', navElementFor('${agent.realTool}'))">◷ ${agent.realToolLabel}</div>`
      : '';
    skillsEl.innerHTML = prompts + toolTile;
  }

  const sourcesEl = document.getElementById('chat-sources-block');
  if (sourcesEl) {
    const coveredCount = COMPETENCIES.filter(c => evidenceLog.some(e => e.competency_tags.includes(c.name))).length;
    sourcesEl.innerHTML = `<div class="manage-box"><div><p>Grounded in your real state</p><span>${evidenceLog.length} evidence entries · ${coveredCount} of 17 competencies covered</span></div></div>`;
  }
}

function renderChatHistory(){
  const el = document.getElementById('chat-history-list');
  if (!el) return;
  if (chatSessions.length === 0) {
    el.innerHTML = `<div class="ps-empty">No past conversations yet — start one from "New Chat."</div>`;
    return;
  }
  el.innerHTML = chatSessions.slice().reverse().map(s => {
    const agent = findAgent(s.agentId);
    const preview = s.messages.find(m => m.sender === 'user');
    return `<div class="chat-history-row" role="button" tabindex="0" onclick="reopenChatSession(${s.id})">
      <div class="p-avatar"></div>
      <div class="info">
        <h4>${agent ? agent.name : 'Unknown agent'}</h4>
        <p>${preview ? preview.text : '(no messages yet)'}</p>
      </div>
      <span class="lor-freshness good">${s.messages.length} messages</span>
    </div>`;
  }).join('');
}

// ---- Institutes pilot application ----
// The static version of this page already promised a fit assessment and real deadlines —
// this makes both real: a working form with client-side validation, an instant heuristic
// fit read (honest — can say "not a great fit yet", not just flattery), and a real
// countdown to whichever pilot-cohort deadline is actually next from today's date.

let instituteApplication = { orgName: '', contactEmail: '', role: '', studentPopulation: '', currentResources: '', selectedGaps: [], submitted: false };

function updateInstituteField(field, value){
  instituteApplication[field] = value;
}

function toggleInstituteGap(gap){
  const idx = instituteApplication.selectedGaps.indexOf(gap);
  if (idx > -1) instituteApplication.selectedGaps.splice(idx, 1); else instituteApplication.selectedGaps.push(gap);
  renderInstituteForm();
}

// Real date math, not a hardcoded "August 15" — recomputes whichever pilot deadline
// (Aug 15 Fall / Dec 1 Spring) is actually next from today, handling year rollover.
function computeNextInstituteDeadline(){
  const now = new Date();
  const year = now.getFullYear();
  const candidates = [
    { label: 'Fall Pilot Cohort', date: new Date(year, 7, 15) },
    { label: 'Spring Pilot Cohort', date: new Date(year, 11, 1) },
    { label: 'Fall Pilot Cohort', date: new Date(year + 1, 7, 15) },
    { label: 'Spring Pilot Cohort', date: new Date(year + 1, 11, 1) }
  ];
  const upcoming = candidates.filter(c => c.date > now).sort((a, b) => a.date - b.date)[0];
  const daysUntil = Math.ceil((upcoming.date - now) / (1000 * 60 * 60 * 24));
  const dateStr = upcoming.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return { label: upcoming.label, dateStr, daysUntil };
}

// Deliberately not just positive — an honest "not a great fit yet" is more useful to a
// real advising office than a form that flatters every submission, matching the rest of
// this app's stance (Committee, the doctor quiz) of saying so when something's a stretch.
function computeInstituteFit(){
  const pop = parseInt(instituteApplication.studentPopulation, 10) || 0;
  const gapCount = instituteApplication.selectedGaps.length;
  const hasCurriculumGap = instituteApplication.selectedGaps.includes("No structured, stage-by-stage curriculum");

  if (pop > 0 && pop < 25) {
    return { level: 'neutral', message: `Pilot cohorts are built around the overhead of real curriculum customization, which tends to pay off starting around 25–30+ students. At ${pop}, a lighter-touch option might serve your office better than a full pilot right now.` };
  }
  if (gapCount === 0) {
    return { level: 'neutral', message: `Select at least one real gap below so the read means something — an application with no stated need is hard to assess honestly.` };
  }
  if (pop >= 100 && gapCount >= 2) {
    return { level: 'good', message: `Strong fit: a student population this size combined with ${gapCount} distinct stated gaps is exactly the scale Institutes pilots are built for.` };
  }
  if (hasCurriculumGap && gapCount >= 1) {
    return { level: 'good', message: `Solid fit: "no structured curriculum" is the single gap Institutes is most directly built to close, and you've named ${gapCount} concrete need${gapCount > 1 ? 's' : ''}.` };
  }
  return { level: 'neutral', message: `Moderate fit — worth applying, but be specific in "current advising resources" below about what's actually missing, since that's what a real reviewer will weigh most.` };
}

function submitInstituteApplication(){
  if (!instituteApplication.orgName.trim() || !instituteApplication.contactEmail.trim() || instituteApplication.selectedGaps.length === 0) {
    showToast('Add your organization name, contact email, and at least one gap before submitting.');
    return;
  }
  if (!instituteApplication.contactEmail.includes('@')) {
    showToast('Enter a valid contact email.');
    return;
  }
  instituteApplication.submitted = true;
  renderInstituteForm();
}

function editInstituteApplication(){
  instituteApplication.submitted = false;
  renderInstituteForm();
}

function renderInstituteForm(){
  const el = document.getElementById('institute-form-area');
  if (!el) return;

  const deadline = computeNextInstituteDeadline();
  const deadlineBanner = `<div class="roadmap-personalized-note">✦ Next deadline: <b>${deadline.label}</b> — ${deadline.dateStr} (${deadline.daysUntil} day${deadline.daysUntil === 1 ? '' : 's'} away)</div>`;

  if (instituteApplication.submitted) {
    const fit = computeInstituteFit();
    el.innerHTML = `${deadlineBanner}
      <h3 style="margin-bottom:10px;">Application Received (Prototype)</h3>
      <p style="font-size:13px; color:var(--muted); line-height:1.6; margin-bottom:16px;">Nothing was actually sent anywhere — there's no backend in this prototype. In production, this would route to AesculaMD's partnerships team, and an approved office gets set up directly inside the real advisor platform — not a separate system built here.</p>
      <div class="pace-read ${fit.level === 'good' ? 'good' : 'warn'}"><b>Instant fit read:</b> ${fit.message}</div>
      <div style="font-size:12px; color:var(--ink); line-height:1.6; margin-bottom:16px;">${instituteApplication.orgName} · ${instituteApplication.studentPopulation || '?'} students · ${instituteApplication.selectedGaps.length} gap(s) selected</div>
      <a class="btn outline" href="https://aesculamd.com" target="_blank" rel="noopener" style="display:inline-block; text-decoration:none; margin-bottom:10px;">See the real advisor platform at aesculamd.com →</a>
      <button class="btn outline" style="width:100%;" onclick="editInstituteApplication()">Edit Application</button>`;
    return;
  }

  el.innerHTML = `${deadlineBanner}
    <h3 style="margin-bottom:10px;">Apply for a Pilot</h3>
    <p>Bring structure and AI mentorship to your students without building it yourself — or fully customize the curriculum if your office already has strong material.</p>
    <input type="text" class="form-input" style="margin-bottom:10px;" placeholder="Organization or office name" aria-label="Organization or office name" value="${instituteApplication.orgName}" oninput="updateInstituteField('orgName', this.value)">
    <input type="email" class="form-input" style="margin-bottom:10px;" placeholder="Contact email" aria-label="Contact email" value="${instituteApplication.contactEmail}" oninput="updateInstituteField('contactEmail', this.value)">
    <input type="text" class="form-input" style="margin-bottom:10px;" placeholder="Your role (e.g. Pre-Health Advisor)" aria-label="Your role" value="${instituteApplication.role}" oninput="updateInstituteField('role', this.value)">
    <input type="number" class="form-input form-input-narrow" style="margin-bottom:10px;" placeholder="Student population size" aria-label="Student population size" min="0" value="${instituteApplication.studentPopulation}" oninput="updateInstituteField('studentPopulation', this.value)">
    <textarea class="ps-draft-textarea" style="height:80px; margin-bottom:14px;" placeholder="Current advising resources (be specific — this is what a reviewer weighs most)" aria-label="Current advising resources" oninput="updateInstituteField('currentResources', this.value)">${instituteApplication.currentResources}</textarea>
    <div class="side-title" style="margin-bottom:8px;">Specific gaps you want addressed</div>
    <div style="margin-bottom:16px;">
      ${INSTITUTE_GAP_OPTIONS.map(g => {
        const selected = instituteApplication.selectedGaps.includes(g);
        return `<div class="gap-option ${selected ? 'selected' : ''}" role="button" tabindex="0" aria-pressed="${selected}" onclick="toggleInstituteGap('${g.replace(/'/g, "\\'")}')">
          <span class="check">${selected ? '✓' : ''}</span><span>${g}</span>
        </div>`;
      }).join('')}
    </div>
    <p class="fine" style="margin-bottom:10px;">A note on "tracking": that capability is real, but it lives in AesculaMD's advisor platform, not in this free curriculum — roster invites, AI Meeting Briefs, cohort analytics, and at-risk alerts all already exist there today. Selecting this option tells us that's your office's priority, so we route you toward that product directly rather than building a second version of it here.</p>
    <p class="fine" style="margin-bottom:14px;">Pilot cohorts are limited to 3 partner institutions per semester. Late applications roll to the next cohort.</p>
    <button class="btn" style="width:100%;" onclick="submitInstituteApplication()">Submit Pilot Application</button>`;
}

// ---- My Profile snapshot ----
// Pulls a summary from every real tool's own state, rather than tracking anything new —
// see README gap #16 for why this exists (the tools weren't showing up in one place).

function renderProfileSnapshot(){
  const grid = document.getElementById('profile-grid');
  if (!grid) return;

  const ratedCount = COMPETENCIES.filter(c => selfAssessment[c.name] && selfAssessment[c.name].level).length;
  const withEvidence = COMPETENCIES.filter(c => evidenceLog.some(e => e.competency_tags.includes(c.name))).length;
  const doneStages = STAGE_DATA.filter(s => s.status === 'done').length;
  const currentStage = STAGE_DATA.find(s => s.status === 'current');

  const countUserMessages = (msgs) => msgs.filter(m => m.sender === 'user').length;
  const questionsAsked = chatSessions.reduce((sum, s) => sum + countUserMessages(s.messages), 0)
    + countUserMessages(chatState.messages);
  const agentsUsed = new Set([...chatSessions.map(s => s.agentId), chatState.activeAgentId]).size;

  const cards = [
    { title: 'Roadmap', stat: `${doneStages} / ${STAGE_DATA.length}`, label: 'stages complete',
      detail: currentStage ? `Current: ${currentStage.title}` : 'All stages complete.',
      link: 'bootcamp', linkLabel: 'Open Bootcamp' },
    { title: 'Competencies', stat: `${ratedCount} / 17`, label: `rated · ${withEvidence} with evidence`,
      detail: ratedCount < 17 ? 'Complete your Stage 01 self-assessment for the full picture.' : 'Self-assessment complete.',
      link: 'evidencelog', linkLabel: 'Open Evidence Log' },
    { title: 'Chat', stat: `${questionsAsked}`, label: `question${questionsAsked === 1 ? '' : 's'} asked · ${agentsUsed} agent${agentsUsed === 1 ? '' : 's'} used`,
      detail: questionsAsked === 0 ? 'Nothing asked yet.' : 'Ask any of your 8 agents something real, any time.',
      link: 'chat', linkLabel: 'Open Chat' }
  ];

  grid.innerHTML = cards.map(c => `
    <div class="profile-card">
      <div class="profile-card-title">${c.title}</div>
      <div class="profile-card-stat">${c.stat}</div>
      <div class="profile-card-label">${c.label}</div>
      <div class="profile-card-detail">${c.detail}</div>
      <button class="agent-tool-link" onclick="go('${c.link}', navElementFor('${c.link}'))">${c.linkLabel} →</button>
    </div>
  `).join('');
}

// Initial render on page load
renderStageList();
renderAgents();
renderKnowHow();
renderGlossary();
renderProgressRing();
renderEvidenceLog();
renderTimeline();
renderDoctorQuiz();
renderProfileSnapshot();
renderPsChecker();
startNewChat('reflection-coach');
renderInstituteForm();
