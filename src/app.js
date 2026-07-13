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
  document.getElementById('sp-parts').innerHTML = '<div class="side-title" style="margin-bottom:10px;">What This Stage Covers</div><ul style="list-style:none;">' +
    s.parts.map(p => `<li style="font-size:13px; color:#3E4A3F; line-height:1.6; padding:7px 0; border-bottom:1px solid var(--line);">${p}</li>`).join('') + '</ul>';
  document.getElementById('sp-assessment').innerHTML = '';
  if (s.title === 'Premed 101') {
    renderAssessment('sp-assessment');
  }
  document.getElementById('sp-track-selector').innerHTML = '';
  if (s.title === 'Strategy: MD or DO') {
    renderTrackSelector('sp-track-selector');
  }
  document.getElementById('sp-testing-window').innerHTML = '';
  if (s.title === 'Grades & MCAT') {
    renderTestingWindow('sp-testing-window');
  }
  document.getElementById('sp-reflection').innerHTML = s.reflection.map((r, ri) => {
    const key = `stage-${i}-${ri}`;
    const existing = evidenceLog.find(e => e.key === key);
    return `<li style="font-size:13px; color:#3E4A3F; line-height:1.55; padding:6px 0;">
      <div>→ ${r}</div>
      <textarea class="reflection-textarea" onblur="updateStageReflection(${i}, ${ri}, this.value)" placeholder="Your answer...">${existing ? existing.content : ''}</textarea>
    </li>`;
  }).join('');
  document.getElementById('sp-checklist').innerHTML = s.checklist.map(c => `<li style="display:flex; gap:8px; font-size:13px; padding:6px 0;"><span class="box" style="width:14px;height:14px;border:2px solid var(--line-strong);border-radius:4px;flex-shrink:0;margin-top:2px;"></span>${c}</li>`).join('');
  const completable = s.status === 'current' || (s.status === 'locked' && skipModeActive);
  document.getElementById('sp-cta').textContent = s.title === 'Premed 101' && s.status === 'done'
    ? 'Update My Roadmap'
    : (s.status === 'done' ? 'Review Again' : (completable ? 'Mark Stage Complete' : 'Preview Stage'));
  go('stagedetail', null);
  renderStageAdvisor(i);
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
  COMPETENCIES.forEach(c => {
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
}

// Stage reflection prompts (all stages) auto-tag to whatever competencies that stage
// targets, per the "stage-level default tags" rule in content/evidence-log-design.md.
function updateStageReflection(stageIdx, promptIdx, text){
  const s = STAGE_DATA[stageIdx];
  const key = `stage-${stageIdx}-${promptIdx}`;
  if (text.trim() === '') { removeEntry(key); return; }
  upsertEntry(key, {
    source_type: 'stage_reflection',
    source_reference: s.title,
    competency_tags: s.competencies.split(' · '),
    maturity_at_entry: null,
    content: text
  });
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

// ---- Stage detail's embedded AI advisor ----
// Every stage page gets a live, grounded conversation with whichever agent actually owns
// that stage (AGENT_DATA.stageTitle), not a generic "ask a question" box — reuses the same
// generateAgentReply()/resolveChatTokens() heuristics as the main Chat page, just scoped to
// one stage at a time, with a handoff into the full Chat session if the student wants to
// keep talking.

function findAgentForStage(stageIdx){
  const s = STAGE_DATA[stageIdx];
  return AGENT_DATA.find(a => a.stageTitle === s.title) || findAgent('reflection-coach');
}

let stageAdvisorState = { stageIdx: null, agentId: null, messages: [] };

function renderStageAdvisor(stageIdx){
  const matched = findAgentForStage(stageIdx);
  const gated = isAgentGated(matched);
  // If the stage's own agent is still locked, Reflection Coach (core, always available)
  // stands in rather than showing a dead end.
  const agent = gated ? findAgent('reflection-coach') : matched;
  document.getElementById('sd-advisor-name').textContent = agent.name;
  const greeting = gated
    ? `${matched.name} unlocks once you complete ${matched.stageTitle} — I'm Reflection Coach in the meantime, and I can still help you think through this stage.`
    : resolveChatTokens(agent.chatGreeting);
  stageAdvisorState = { stageIdx, agentId: agent.id, messages: [{ sender: 'agent', text: greeting }] };
  renderStageAdvisorMessages();
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

// ---- Interview Simulator (content/simulations-design.md) ----

let interviewState = { phase: 'setup', personaId: null, categoryId: null, questionIdx: 0, questionText: null, askedIndices: {}, lastAnswer: '', feedback: null };

function openInterviewSim(){
  interviewState = { phase: 'setup', personaId: null, categoryId: null, questionIdx: 0, questionText: null, askedIndices: {}, lastAnswer: '', feedback: null };
  renderInterviewBody();
  document.getElementById('interview-modal').classList.add('open');
}
function closeInterviewSim(){ document.getElementById('interview-modal').classList.remove('open'); }
function closeIfInterviewOverlay(e){ if (e.target.id === 'interview-modal') closeInterviewSim(); }

function selectInterviewPersona(id){ interviewState.personaId = id; renderInterviewBody(); }
function selectInterviewCategory(id){ interviewState.categoryId = id; renderInterviewBody(); }

function startInterviewQuestion(){
  if (!interviewState.personaId || !interviewState.categoryId) return;
  pickNextInterviewQuestion();
}

function pickNextInterviewQuestion(){
  const cat = INTERVIEW_CATEGORIES.find(c => c.id === interviewState.categoryId);
  const used = interviewState.askedIndices[cat.id] || [];
  let available = cat.examples.map((_, i) => i).filter(i => !used.includes(i));
  if (available.length === 0) { available = cat.examples.map((_, i) => i); interviewState.askedIndices[cat.id] = []; }
  const idx = available[Math.floor(Math.random() * available.length)];
  interviewState.askedIndices[cat.id] = (interviewState.askedIndices[cat.id] || []).concat(idx);
  interviewState.questionIdx = idx;
  interviewState.questionText = cat.examples[idx];
  interviewState.phase = 'question';
  renderInterviewBody();
}

function changeInterviewCategory(){
  interviewState.phase = 'setup';
  renderInterviewBody();
}

function submitInterviewAnswer(){
  const textarea = document.getElementById('interview-answer-input');
  const text = textarea.value.trim();
  if (text.length < 5) { showToast('Write an actual answer before submitting.'); return; }
  interviewState.lastAnswer = text;
  interviewState.feedback = computeInterviewFeedback(interviewState.categoryId, text);
  interviewState.phase = 'feedback';
  renderInterviewBody();
}

// Honestly rule-based, not simulated AI grading — see content/simulations-design.md §1.
function computeInterviewFeedback(categoryId, answerText){
  const persona = INTERVIEW_PERSONAS.find(p => p.id === interviewState.personaId);
  const cat = INTERVIEW_CATEGORIES.find(c => c.id === categoryId);
  const words = answerText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const hasNumber = /\d/.test(answerText);
  const hasFirstPersonAction = /\bI (felt|realized|learned|decided|noticed|asked|told|helped|watched|saw|remember|found|understood)\b/i.test(answerText);
  const properNounHits = (answerText.match(/\b[A-Z][a-z]{2,}\b/g) || []).length;
  const specific = hasNumber || hasFirstPersonAction || properNounHits >= 2;

  let score = 50;
  if (wordCount >= 40 && wordCount <= 220) score += 20;
  else if (wordCount < 20) score -= 15;
  else if (wordCount > 300) score -= 10;
  if (specific) score += 25; else score -= 15;
  score = Math.max(5, Math.min(98, score));

  const strong = specific
    ? `You grounded this in something concrete rather than staying abstract — that's exactly what ${persona.name} is listening for.`
    : `You addressed the question directly and stayed on topic.`;

  let strengthen;
  if (wordCount < 20) {
    strengthen = `This is too brief for a real interview answer — add one specific moment, number, or name so it doesn't read as a placeholder.`;
  } else if (wordCount > 300) {
    strengthen = `This would run long out loud — aim for roughly 60–90 seconds spoken (about 150–220 words), built around your strongest specific detail.`;
  } else if (!specific) {
    strengthen = persona.tone.includes('rehearsed')
      ? `${persona.name} would push back here — this reads as rehearsed. Add a specific person, place, number, or moment someone else could picture.`
      : `Right now this reads as generic — add a specific person, place, number, or moment someone else could picture.`;
  } else {
    strengthen = `Solid answer — the next level is naming, explicitly, which competency this moment actually demonstrates, not just narrating what happened.`;
  }

  // Follow-up = the next example question in the same category — an honest substitute
  // for an AI-generated follow-up, not a disguised fake.
  const followUp = cat.examples[(interviewState.questionIdx + 1) % cat.examples.length];

  return { score, strong, strengthen, followUp };
}

function retryInterviewQuestion(){ pickNextInterviewQuestion(); }

function logInterviewAnswerToEvidence(){
  const cat = INTERVIEW_CATEGORIES.find(c => c.id === interviewState.categoryId);
  const key = `interview-${Date.now()}`;
  upsertEntry(key, {
    source_type: 'agent_conversation',
    source_reference: `Interview Simulator (${cat.name})`,
    competency_tags: [cat.competency],
    maturity_at_entry: null,
    content: interviewState.lastAnswer
  });
  showToast('Logged to your Evidence Log.');
}

function renderInterviewBody(){
  const body = document.getElementById('interview-body');
  if (interviewState.phase === 'question') { body.innerHTML = interviewQuestionHTML(); return; }
  if (interviewState.phase === 'feedback') { body.innerHTML = interviewFeedbackHTML(); return; }
  body.innerHTML = interviewSetupHTML();
}

function interviewSetupHTML(){
  const personaHTML = INTERVIEW_PERSONAS.map(p => `
    <div class="interview-persona-card ${interviewState.personaId === p.id ? 'selected' : ''}" role="button" tabindex="0" aria-pressed="${interviewState.personaId === p.id}" onclick="selectInterviewPersona('${p.id}')">
      <div class="interview-persona-avatar">${p.avatar}</div>
      <div>
        <div class="interview-persona-name">${p.name}</div>
        <div class="interview-persona-title">${p.title} — ${p.tone}</div>
      </div>
    </div>`).join('');
  const categoryHTML = INTERVIEW_CATEGORIES.map(c => `
    <div class="interview-category-pill ${interviewState.categoryId === c.id ? 'selected' : ''}" role="button" tabindex="0" aria-pressed="${interviewState.categoryId === c.id}" onclick="selectInterviewCategory('${c.id}')">${c.name}</div>
  `).join('');
  const canStart = interviewState.personaId && interviewState.categoryId;
  return `
    <div class="side-title" style="margin-bottom:10px;">Choose your interviewer</div>
    <div class="interview-persona-grid">${personaHTML}</div>
    <div class="side-title" style="margin-bottom:10px;">Choose a category</div>
    <div class="interview-category-grid">${categoryHTML}</div>
    <button class="modal-start-btn" style="${canStart ? '' : 'opacity:0.5;cursor:not-allowed;'}" onclick="startInterviewQuestion()">Start Practice Question</button>
  `;
}

function interviewQuestionHTML(){
  const persona = INTERVIEW_PERSONAS.find(p => p.id === interviewState.personaId);
  const cat = INTERVIEW_CATEGORIES.find(c => c.id === interviewState.categoryId);
  return `
    <div class="interview-question-card">
      <div class="interview-question-meta">${persona.avatar} ${persona.name} · ${cat.name}</div>
      <div class="interview-question-text">${interviewState.questionText}</div>
    </div>
    <textarea class="interview-answer-box" id="interview-answer-input" placeholder="Type your answer as you'd actually say it..."></textarea>
    <button class="modal-start-btn" onclick="submitInterviewAnswer()">Submit Answer</button>
    <button class="btn outline" style="width:100%;margin-top:8px;" onclick="changeInterviewCategory()">Change Category</button>
  `;
}

function interviewFeedbackHTML(){
  const f = interviewState.feedback;
  const scoreColor = f.score >= 75 ? '#1D9E75' : f.score >= 55 ? '#D97706' : '#DC2626';
  return `
    <div class="interview-feedback-card">
      <div class="interview-score-row">
        <div class="interview-score-badge" style="color:${scoreColor};">${f.score}</div>
        <div style="font-size:12px;color:var(--muted);">Heuristic read — length + specificity, not real AI grading</div>
      </div>
      <div class="interview-feedback-label">What worked</div>
      <div class="interview-feedback-text">${f.strong}</div>
      <div class="interview-feedback-label">What to strengthen</div>
      <div class="interview-feedback-text">${f.strengthen}</div>
      <div class="interview-feedback-label">A natural follow-up</div>
      <div class="interview-feedback-text">${f.followUp}</div>
    </div>
    <button class="modal-start-btn" onclick="logInterviewAnswerToEvidence()">Log This Answer as Evidence</button>
    <button class="btn outline" style="width:100%;margin-top:8px;" onclick="retryInterviewQuestion()">Try Another Question</button>
    <button class="btn outline" style="width:100%;margin-top:8px;" onclick="changeInterviewCategory()">Change Category</button>
  `;
}

// ---- The Committee (content/simulations-design.md) ----

function openCommittee(){
  renderCommitteeBody();
  document.getElementById('committee-modal').classList.add('open');
}
function closeCommittee(){ document.getElementById('committee-modal').classList.remove('open'); }
function closeIfCommitteeOverlay(e){ if (e.target.id === 'committee-modal') closeCommittee(); }

// Reads real app state (selfAssessment, evidenceLog, trackChoice, stage status) into a
// templated verdict — a practice read on current progress, never a real admissions
// prediction. See content/simulations-design.md §2.
function computeCommitteeVerdict(){
  const stageDone = (title) => { const s = STAGE_DATA.find(x => x.title === title); return !!(s && s.status === 'done'); };
  const gradesMcatDone = stageDone('Grades & MCAT');
  const costAccessDone = stageDone('Cost & Access');
  const researchEntry = evidenceLog.find(e => e.source_reference === 'Research or No Research?' && e.content && e.content.trim().length > 0);
  const narrativeEntries = evidenceLog.filter(e => e.source_reference === 'Be Yourself: Narrative').length;
  const withEvidence = COMPETENCIES.filter(c => evidenceLog.some(e => e.competency_tags.includes(c.name))).length;

  // Real data from the Activity Ledger — see README gap #16 for why this wasn't factored
  // in until now.
  const ledgerHours = (categoryId) => activityLedger.filter(e => e.categoryId === categoryId).reduce((sum, e) => sum + (e.hours || 0), 0);
  const clinicalHours = ledgerHours('clinical');
  const serviceHours = ledgerHours('service');

  const statements = [];

  if (gradesMcatDone && testingWindowDate) {
    const statement = `Grades & MCAT is complete with a real target testing window logged. That's a concrete academic plan, not just an intention.`;
    statements.push({ member: COMMITTEE_MEMBERS[0], sentiment: 'positive', score: 8, statement });
  } else if (gradesMcatDone) {
    statements.push({ member: COMMITTEE_MEMBERS[0], sentiment: 'neutral', score: 6,
      statement: `Grades & MCAT is complete, but there's no target testing window logged yet — I'd want to see real pacing, not just a plan on paper.` });
  } else {
    statements.push({ member: COMMITTEE_MEMBERS[0], sentiment: 'concerned', score: 3,
      statement: `Grades & MCAT hasn't been worked through yet. I can't assess academic readiness without it.` });
  }

  if (costAccessDone && trackChoice) {
    const trackLabel = trackChoice === 'MD' ? 'MD-focused' : trackChoice === 'DO' ? 'DO-focused' : 'dual-applying';
    let score = 8;
    let statement = `Cost & Access is done and there's a clear ${trackLabel} direction. That's realistic planning, not wishful thinking.`;
    if (clinicalHours >= 75 || serviceHours >= 40) {
      score += 1;
      statement += ` Real logged hours back this up too — ${Math.round(clinicalHours)}h clinical and ${Math.round(serviceHours)}h non-clinical service, not just intentions.`;
    } else if (clinicalHours === 0 && serviceHours === 0) {
      statement += ` I don't see any logged hours in the Activity Ledger yet, though — service commitment needs to show up as more than a plan eventually.`;
    }
    statements.push({ member: COMMITTEE_MEMBERS[1], sentiment: 'positive', score, statement });
  } else if (costAccessDone || trackChoice) {
    statements.push({ member: COMMITTEE_MEMBERS[1], sentiment: 'neutral', score: 6,
      statement: `Some financial and strategic planning is in place, but not both — I'd want to see the full picture before I'm convinced this is realistic.` });
  } else {
    statements.push({ member: COMMITTEE_MEMBERS[1], sentiment: 'concerned', score: 3,
      statement: `No financial planning or MD/DO direction logged yet. That tells me this is early — which is fine, but it's not something I can advocate for yet.` });
  }

  if (researchEntry) {
    statements.push({ member: COMMITTEE_MEMBERS[2], sentiment: 'positive', score: 7,
      statement: `There's a logged, reasoned decision about the research path. I don't need everyone to run a wet lab — I need everyone to have thought it through, and this student has.` });
  } else {
    statements.push({ member: COMMITTEE_MEMBERS[2], sentiment: 'neutral', score: 5,
      statement: `No research decision logged yet with reasoning attached. Not a dealbreaker on its own, but I'd want to see that reasoning eventually.` });
  }

  if (narrativeEntries > 0 && withEvidence >= 10) {
    statements.push({ member: COMMITTEE_MEMBERS[3], sentiment: 'positive', score: 8,
      statement: `The narrative work is there, and evidence spans ${withEvidence} of the 17 competencies. That's a real, broad case — not one good story surrounded by gaps.` });
  } else if (narrativeEntries > 0 || withEvidence >= 5) {
    statements.push({ member: COMMITTEE_MEMBERS[3], sentiment: 'neutral', score: 6,
      statement: `There's a real start here — ${withEvidence} of 17 competencies have some evidence — but it's not broad yet. Keep logging as things actually happen.` });
  } else {
    statements.push({ member: COMMITTEE_MEMBERS[3], sentiment: 'concerned', score: 3,
      statement: `Very little logged evidence so far. I can't evaluate a case that hasn't been written down yet.` });
  }

  const avgScore = statements.reduce((s, x) => s + x.score, 0) / statements.length;
  const decision = avgScore >= 7 ? 'Interview' : avgScore >= 5 ? 'Hold' : 'Decline';
  const decisionReason = decision === 'Interview'
    ? `Across all four areas, there's a real, evidenced, and planned case here — not a finished application, but a genuinely strong trajectory for where this is in the process.`
    : decision === 'Hold'
    ? `Real progress in some areas, real gaps in others. This isn't a rejection of the person — it's a specific, fixable list of what's still missing.`
    : `Too much is still unstarted to form a read. This is normal early on — the action items below are exactly what would change this verdict.`;

  const actionItems = [];
  if (!gradesMcatDone) actionItems.push('Complete the Grades & MCAT stage and log a target testing window.');
  if (!costAccessDone) actionItems.push('Complete the Cost & Access stage.');
  if (!trackChoice) actionItems.push('Make (and log) an MD/DO/dual decision in the Strategy stage.');
  if (!researchEntry) actionItems.push('Log your research-or-not decision, with reasoning, in the Research stage.');
  if (clinicalHours === 0 && serviceHours === 0) actionItems.push('Log at least one real activity in the Activity Ledger — right now there are zero hours on record.');
  if (withEvidence < 10) {
    COMPETENCIES.filter(c => !evidenceLog.some(e => e.competency_tags.includes(c.name))).slice(0, 3)
      .forEach(c => actionItems.push(`Log real evidence for ${c.name} — nothing on record for it yet.`));
  }
  if (actionItems.length === 0) actionItems.push('Keep going — revisit stages periodically and keep the evidence log current as things actually happen.');

  return { statements, decision, decisionReason, actionItems };
}

function renderCommitteeBody(){
  const body = document.getElementById('committee-body');
  const ratedCount = COMPETENCIES.filter(c => selfAssessment[c.name] && selfAssessment[c.name].level).length;
  if (ratedCount === 0) {
    body.innerHTML = `<p style="font-size:13.5px;color:var(--muted);line-height:1.6;">Complete Stage 01's self-assessment (or Quick Setup) before convening the Committee — right now there's nothing in your evidence log for them to actually discuss.</p>`;
    return;
  }
  const result = computeCommitteeVerdict();
  const membersHTML = result.statements.map(s => `
    <div class="committee-member-card ${s.sentiment}">
      <div class="committee-member-head">
        <div class="committee-member-role">${s.member.role}</div>
        <div class="committee-score-badge ${s.sentiment}">${s.score}/10</div>
      </div>
      <div class="committee-member-focus">Focus: ${s.member.focus}</div>
      <div class="committee-statement">${s.statement}</div>
    </div>
  `).join('');
  const actionsHTML = result.actionItems.map(a => `<li>→ ${a}</li>`).join('');
  body.innerHTML = `
    <p style="font-size:12.5px;color:var(--muted);line-height:1.5;margin-bottom:14px;">Four committee members read your actual self-assessment, evidence log, and roadmap progress below. This is a practice read on where things stand today — not a real admissions prediction.</p>
    ${membersHTML}
    <div class="committee-verdict-banner ${result.decision}">
      <div class="committee-verdict-label">Practice Verdict</div>
      <div class="committee-verdict-decision">${result.decision}</div>
      <div class="committee-verdict-reason">${result.decisionReason}</div>
    </div>
    <div class="side-title" style="margin-bottom:8px;">Action Items</div>
    <ul class="committee-action-list">${actionsHTML}</ul>
  `;
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

// ---- Activity Ledger ----

let activityLedger = [];
let ledgerEntryCounter = 0;

function addLedgerEntry(){
  const categorySelect = document.getElementById('ledger-category');
  const orgInput = document.getElementById('ledger-org');
  const hoursInput = document.getElementById('ledger-hours');
  const dateInput = document.getElementById('ledger-date');
  const noteInput = document.getElementById('ledger-note');

  const org = orgInput.value.trim();
  if (!org) { showToast('Add a name or description for this activity.'); return; }

  const categoryId = categorySelect.value;
  const hours = hoursInput.value ? parseFloat(hoursInput.value) : null;
  const entry = { id: ++ledgerEntryCounter, categoryId, orgOrDescription: org, hours, date: dateInput.value || null, note: noteInput.value.trim() };
  activityLedger.push(entry);

  const cat = LEDGER_CATEGORIES.find(c => c.id === categoryId);
  upsertEntry(`ledger-${entry.id}`, {
    source_type: 'logged_hour',
    source_reference: org,
    competency_tags: cat.competencyTags,
    maturity_at_entry: null,
    content: entry.note || `${hours ? hours + ' hours — ' : ''}${cat.name}`
  });

  orgInput.value = ''; hoursInput.value = ''; dateInput.value = ''; noteInput.value = '';
  renderLedger();
  showToast('Logged to your Activity Ledger and Evidence Log.');
}

function removeLedgerEntry(id){
  activityLedger = activityLedger.filter(e => e.id !== id);
  removeEntry(`ledger-${id}`);
  renderLedger();
}

function renderLedger(){
  const summaryEl = document.getElementById('ledger-summary');
  const listEl = document.getElementById('ledger-list');
  if (!summaryEl || !listEl) return;

  const categorySelect = document.getElementById('ledger-category');
  if (categorySelect && categorySelect.options.length === 0) {
    categorySelect.innerHTML = LEDGER_CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  summaryEl.innerHTML = LEDGER_CATEGORIES.map(cat => {
    const totalHours = activityLedger.filter(e => e.categoryId === cat.id).reduce((sum, e) => sum + (e.hours || 0), 0);
    const pct = cat.targetHours ? Math.min(100, Math.round((totalHours / cat.targetHours) * 100)) : null;
    return `<div class="ledger-cat-card">
      <div class="ledger-cat-name">${cat.name}</div>
      <div class="ledger-cat-hours">${totalHours}${cat.targetHours ? ' / ' + cat.targetHours + 'h' : 'h logged'}</div>
      ${pct !== null ? `<div class="ledger-cat-track"><div class="ledger-cat-fill" style="width:${pct}%;"></div></div>` : ''}
      <div class="ledger-cat-label">${cat.targetLabel}</div>
    </div>`;
  }).join('');

  const entries = activityLedger.slice().reverse();
  listEl.innerHTML = entries.length === 0
    ? `<div class="ps-empty">No activities logged yet.</div>`
    : entries.map(e => {
        const cat = LEDGER_CATEGORIES.find(c => c.id === e.categoryId);
        return `<div class="ledger-entry">
          <div class="ledger-entry-head">
            <span class="ledger-entry-cat">${cat.name}</span>
            ${e.hours ? `<span class="ledger-entry-hours">${e.hours}h</span>` : ''}
            <button class="ledger-entry-remove" onclick="removeLedgerEntry(${e.id})" aria-label="Remove this activity">✕</button>
          </div>
          <div class="ledger-entry-org">${e.orgOrDescription}${e.date ? ' · ' + e.date : ''}</div>
          ${e.note ? `<div class="ledger-entry-note">${e.note}</div>` : ''}
        </div>`;
      }).join('');
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

// ---- LOR Tracker ----

let lorEntries = [];
let lorEntryCounter = 0;

function addLorEntry(){
  const roleSelect = document.getElementById('lor-role');
  const nameInput = document.getElementById('lor-name');
  const dateInput = document.getElementById('lor-last-contact');
  const statusSelect = document.getElementById('lor-status');

  const name = nameInput.value.trim();
  if (!name) { showToast('Add a name for this potential letter-writer.'); return; }

  const entry = { id: ++lorEntryCounter, role: roleSelect.value, name, lastContact: dateInput.value || null, status: statusSelect.value };
  lorEntries.push(entry);

  upsertEntry(`lor-${entry.id}`, {
    source_type: 'agent_conversation',
    source_reference: `Letters & Relationships — ${name}`,
    competency_tags: ['Self-Awareness', 'Written Communication'],
    maturity_at_entry: null,
    content: `${roleSelect.value} — status: ${statusSelect.value}${dateInput.value ? ', last contact ' + dateInput.value : ''}`
  });

  nameInput.value = ''; dateInput.value = '';
  renderLorList();
  showToast('Logged to your LOR Tracker and Evidence Log.');
}

function updateLorStatus(id, newStatus){
  const entry = lorEntries.find(e => e.id === id);
  if (entry) entry.status = newStatus;
  renderLorList();
}

function removeLorEntry(id){
  lorEntries = lorEntries.filter(e => e.id !== id);
  removeEntry(`lor-${id}`);
  renderLorList();
}

// Freshness stands in for the source app's real deadline-tracking (no live database here)
// — it tracks how long since the student last actually talked with this person, matching
// Stage 10's "ask while their impression is fresh" advice directly.
function lorFreshness(lastContact){
  if (!lastContact) return { level: 'stale', label: 'No contact logged yet' };
  const days = Math.floor((new Date() - new Date(lastContact)) / (1000 * 60 * 60 * 24));
  if (days <= 90) return { level: 'fresh', label: `Contacted ${days}d ago` };
  if (days <= 180) return { level: 'aging', label: `${days}d since last contact` };
  return { level: 'stale', label: `${days}d since last contact — worth reaching out` };
}

function renderLorList(){
  const roleSelect = document.getElementById('lor-role');
  const statusSelect = document.getElementById('lor-status');
  const listEl = document.getElementById('lor-list');
  if (!listEl) return;
  if (roleSelect && roleSelect.options.length === 0) roleSelect.innerHTML = LOR_ROLES.map(r => `<option value="${r}">${r}</option>`).join('');
  if (statusSelect && statusSelect.options.length === 0) statusSelect.innerHTML = LOR_STATUSES.map(s => `<option value="${s}">${s}</option>`).join('');

  listEl.innerHTML = lorEntries.length === 0
    ? `<div class="ps-empty">No potential letter-writers logged yet.</div>`
    : lorEntries.slice().reverse().map(e => {
        const fresh = lorFreshness(e.lastContact);
        const statusClass = e.status.toLowerCase().replace(' ', '');
        return `<div class="lor-entry">
          <div>
            <div class="lor-entry-name">${e.name}</div>
            <div class="lor-entry-role">${e.role}</div>
          </div>
          <span class="lor-status-badge ${statusClass}">${e.status}</span>
          <select onchange="updateLorStatus(${e.id}, this.value)" class="ledger-select" aria-label="Status for ${e.name}">
            ${LOR_STATUSES.map(s => `<option value="${s}" ${s === e.status ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <span class="lor-freshness ${fresh.level}">${fresh.label}</span>
          <button class="lor-entry-remove" onclick="removeLorEntry(${e.id})" aria-label="Remove ${e.name}">✕</button>
        </div>`;
      }).join('');
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

function ledgerHoursFor(categoryId){
  return activityLedger.filter(e => e.categoryId === categoryId).reduce((sum, e) => sum + (e.hours || 0), 0);
}

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
  const lorConfirmedCount = lorEntries.filter(e => e.status === 'Confirmed' || e.status === 'Submitted').length;
  const targetCycleLine = studentProfile.targetCycleYear
    ? `You're targeting the ${studentProfile.targetCycleYear} application cycle.`
    : `You haven't set a target application cycle yet — Quick Setup or Stage 05 can set that.`;

  const tokens = {
    currentStageTitle: currentStage ? currentStage.title : 'your current stage',
    evidenceCount: evidenceLog.length,
    competencyCoverage: withEvidence,
    narrativeCount,
    clinicalHours: ledgerHoursFor('clinical'),
    serviceHours: ledgerHoursFor('service'),
    shadowingHours: ledgerHoursFor('shadowing'),
    researchHours: ledgerHoursFor('research'),
    leadershipHours: ledgerHoursFor('leadership'),
    lorCount: lorEntries.length,
    lorConfirmedCount,
    targetCycleLine,
    patternRead: withEvidence < 5
      ? `there's not quite enough logged yet to see a real pattern — keep rating competencies and answering stage reflections as things actually happen.`
      : `worth noticing which competencies keep showing up unprompted, versus ones that only appear when a stage directly asks for them.`
  };

  return text.replace(/\{(\w+)\}/g, (m, key) => (key in tokens) ? tokens[key] : m);
}

function generateAgentReply(agent, userText){
  const lower = userText.toLowerCase();
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
    sourcesEl.innerHTML = `<div class="manage-box"><div><p>Grounded in your real state</p><span>${evidenceLog.length} evidence entries · ${activityLedger.length} logged activities · ${lorEntries.length} letters tracked</span></div></div>`;
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
      <p style="font-size:13px; color:var(--muted); line-height:1.6; margin-bottom:16px;">Nothing was actually sent anywhere — there's no backend yet. In production, this would route to the Institutes team and a formal fit assessment would follow within 5 business days.</p>
      <div class="pace-read ${fit.level === 'good' ? 'good' : 'warn'}"><b>Instant fit read:</b> ${fit.message}</div>
      <div style="font-size:12px; color:var(--ink); line-height:1.6; margin-bottom:16px;">${instituteApplication.orgName} · ${instituteApplication.studentPopulation || '?'} students · ${instituteApplication.selectedGaps.length} gap(s) selected</div>
      <button class="btn outline" onclick="editInstituteApplication()">Edit Application</button>`;
    return;
  }

  el.innerHTML = `${deadlineBanner}
    <h3 style="margin-bottom:10px;">Apply for a Pilot</h3>
    <p>Bring structure and AI mentorship to your students without building it yourself — or fully customize the curriculum if your office already has strong material.</p>
    <input type="text" class="ledger-input" style="margin-bottom:10px;" placeholder="Organization or office name" aria-label="Organization or office name" value="${instituteApplication.orgName}" oninput="updateInstituteField('orgName', this.value)">
    <input type="email" class="ledger-input" style="margin-bottom:10px;" placeholder="Contact email" aria-label="Contact email" value="${instituteApplication.contactEmail}" oninput="updateInstituteField('contactEmail', this.value)">
    <input type="text" class="ledger-input" style="margin-bottom:10px;" placeholder="Your role (e.g. Pre-Health Advisor)" aria-label="Your role" value="${instituteApplication.role}" oninput="updateInstituteField('role', this.value)">
    <input type="number" class="ledger-input ledger-input-narrow" style="margin-bottom:10px;" placeholder="Student population size" aria-label="Student population size" min="0" value="${instituteApplication.studentPopulation}" oninput="updateInstituteField('studentPopulation', this.value)">
    <textarea class="ps-draft-textarea" style="height:80px; margin-bottom:14px;" placeholder="Current advising resources (be specific — this is what a reviewer weighs most)" aria-label="Current advising resources" oninput="updateInstituteField('currentResources', this.value)">${instituteApplication.currentResources}</textarea>
    <div class="side-title" style="margin-bottom:8px;">Specific gaps you want Institutes to fill</div>
    <div style="margin-bottom:16px;">
      ${INSTITUTE_GAP_OPTIONS.map(g => {
        const selected = instituteApplication.selectedGaps.includes(g);
        return `<div class="gap-option ${selected ? 'selected' : ''}" role="button" tabindex="0" aria-pressed="${selected}" onclick="toggleInstituteGap('${g.replace(/'/g, "\\'")}')">
          <span class="check">${selected ? '✓' : ''}</span><span>${g}</span>
        </div>`;
      }).join('')}
    </div>
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

  const totalHours = LEDGER_CATEGORIES.reduce((sum, cat) =>
    sum + activityLedger.filter(e => e.categoryId === cat.id).reduce((s, e) => s + (e.hours || 0), 0), 0);

  const lorSummary = LOR_STATUSES.map(s => ({ status: s, count: lorEntries.filter(e => e.status === s).length }))
    .filter(x => x.count > 0).map(x => `${x.count} ${x.status}`).join(' · ');

  const cards = [
    { title: 'Roadmap', stat: `${doneStages} / ${STAGE_DATA.length}`, label: 'stages complete',
      detail: currentStage ? `Current: ${currentStage.title}` : 'All stages complete.',
      link: 'bootcamp', linkLabel: 'Open Bootcamp' },
    { title: 'Competencies', stat: `${ratedCount} / 17`, label: `rated · ${withEvidence} with evidence`,
      detail: ratedCount < 17 ? 'Complete your Stage 01 self-assessment for the full picture.' : 'Self-assessment complete.',
      link: 'evidencelog', linkLabel: 'Open Evidence Log' },
    { title: 'Activity Ledger', stat: `${totalHours}h`, label: `across ${activityLedger.length} logged ${activityLedger.length === 1 ? 'entry' : 'entries'}`,
      detail: totalHours === 0 ? 'Nothing logged yet.' : 'Feeding your Evidence Log and Committee read.',
      link: 'ledger', linkLabel: 'Open Activity Ledger' },
    { title: 'Letters (LOR)', stat: `${lorEntries.length}`, label: 'potential letter-writers tracked',
      detail: lorEntries.length === 0 ? 'Nothing logged yet.' : lorSummary,
      link: 'lortracker', linkLabel: 'Open LOR Tracker' }
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
renderProgressRing();
renderEvidenceLog();
renderTimeline();
renderLedger();
renderLorList();
renderDoctorQuiz();
renderProfileSnapshot();
renderPsChecker();
startNewChat('reflection-coach');
renderInstituteForm();
