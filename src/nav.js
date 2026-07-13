// Sidebar navigation: page switching and collapsible sub-menus.

function go(pageId, el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+pageId).classList.add('active');
  document.querySelectorAll('.nav-item, .sub-item').forEach(n=>n.classList.remove('active'));
  if(el) el.classList.add('active');
  // If the target lives inside a collapsed sub-nav group (e.g. a cross-link from
  // Home into "Practice"), expand that group so the highlighted item is visible.
  const parentSub = el && el.closest && el.closest('.sub-nav');
  if(parentSub) parentSub.classList.add('open');
  document.querySelector('.main').scrollTop = 0;
  closeSidebar(); // no-op on desktop widths; auto-closes the mobile off-canvas drawer
  // My Profile aggregates every other tool's state — refresh on arrival rather than
  // wiring it into every mutation point across the app.
  if (pageId === 'profile' && typeof renderProfileSnapshot === 'function') renderProfileSnapshot();
}

// Mobile off-canvas sidebar (see the ~880px breakpoint in styles.css). Harmless to call
// on desktop widths since the sidebar/overlay classes only have a visual effect below
// that breakpoint.
function toggleSidebar(){ document.getElementById('sidebar').classList.toggle('open'); document.getElementById('sidebar-overlay').classList.toggle('open'); }
function closeSidebar(){ document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').classList.remove('open'); }
function toggleSub(id, el){
  const sub = document.getElementById(id);
  sub.classList.toggle('open');
  if(el) el.setAttribute('aria-expanded', sub.classList.contains('open') ? 'true' : 'false');
}
function openModal(){ document.getElementById('modal').classList.add('open'); }
function closeModal(){ document.getElementById('modal').classList.remove('open'); }
function closeIfOverlay(e){ if(e.target.id==='modal') closeModal(); }

// Every clickable div/span in this app (nav items, stage rows, pills, cards) carries
// role="button" so it's announced correctly, but a div's onclick doesn't fire on
// Enter/Space the way a real <button> does natively — this makes it so it does.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target;
  if (el.getAttribute && el.getAttribute('role') === 'button' && el.hasAttribute('tabindex')) {
    e.preventDefault();
    el.click();
  }
});

// Escape closes whatever's currently open: the mobile sidebar drawer, or any open modal.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const openModalOverlay = document.querySelector('.modal-overlay.open');
  if (openModalOverlay) { openModalOverlay.classList.remove('open'); return; }
  if (document.getElementById('sidebar').classList.contains('open')) closeSidebar();
});
