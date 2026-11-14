/* ==========================================================================
   FORMA STUDIO v6 — MASTER ENGINE
   - 26 Modular Slots × 252 Live Interactive Assets
   - 100% Real Visual Interactive Stages in Asset Atelier (Zero Text Placeholders!)
   - A/B/C Client Proposal Snapshot Switcher + Quick Slot Stepper Bar
   - 100% Self-Contained Single-Asset Code Extractor + Live Sandbox Preview Tab
   - 60fps Canvas Shaders, Magnetic/3D Physics, Stardust Cursor, WebAudio Synth
   ========================================================================== */

const DEFAULT_SEC_ORDER = [
  'topbar', 'navbar', 'hero', 'divider', 'stats',
  'feature', 'process', 'gallery', 'team', 'pricing',
  'proof', 'form', 'footer'
];

function makeInitialProposals() {
  const base = { ...WORLDS.maison.preset };
  return {
    A: {
      label: '시안 A · 웜 럭셔리',
      worldKey: 'maison',
      equipped: { ...base },
      tokens: { radius: 10, density: 'balanced', grain: 0.035, customAccent: null }
    },
    B: {
      label: '시안 B · 다크 아방가르드',
      worldKey: 'maison',
      equipped: {
        ...base,
        palette: 'PAL-02', shader: 'BG-02', font: 'FNT-03', textfx: 'TFX-04',
        button: 'BTN-02', surface: 'SRF-02', imgstyle: 'IMG-10', inputui: 'INP-02',
        cursor: 'CUR-06', motion: 'MOT-04', badge: 'BDG-03', preloader: 'PRE-04',
        widget: 'WGT-01', navbar: 'NAV-02', hero: 'HERO-01', feature: 'FEAT-01',
        process: 'PRO-05', gallery: 'GAL-04', team: 'TEM-07', pricing: 'PRC-03', footer: 'FTR-03'
      },
      tokens: { radius: 14, density: 'editorial', grain: 0.045, customAccent: null }
    },
    C: {
      label: '시안 C · 스위스 에디토리얼',
      worldKey: 'maison',
      equipped: {
        ...base,
        palette: 'PAL-06', shader: 'BG-08', font: 'FNT-07', textfx: 'TFX-09',
        button: 'BTN-10', surface: 'SRF-09', imgstyle: 'IMG-07', inputui: 'INP-04',
        cursor: 'CUR-02', motion: 'MOT-01', badge: 'BDG-05', preloader: 'PRE-01',
        widget: 'WGT-04', topbar: 'TOP-06', navbar: 'NAV-04', hero: 'HERO-07',
        stats: 'STA-05', feature: 'FEAT-08', process: 'PRO-07', gallery: 'GAL-02',
        team: 'TEM-09', pricing: 'PRC-08', footer: 'FTR-04'
      },
      tokens: { radius: 2, density: 'compact', grain: 0.03, customAccent: null }
    }
  };
}

const TRAY_GROUPS = {
  sections: ['hero', 'navbar', 'feature', 'gallery', 'pricing', 'form', 'stats', 'proof', 'process', 'team', 'footer', 'topbar', 'divider'],
  components: ['button', 'surface', 'inputui', 'imgstyle', 'badge', 'widget'],
  themes: ['palette', 'shader', 'font', 'textfx', 'motion', 'cursor', 'preloader']
};

const FEATURED_SECTION_PICKS = [
  ['hero', 'HERO-01'], ['hero', 'HERO-02'], ['navbar', 'NAV-02'],
  ['feature', 'FEAT-01'], ['gallery', 'GAL-01'], ['pricing', 'PRC-01'],
  ['form', 'FRM-01'], ['stats', 'STA-01'], ['hero', 'HERO-04'],
  ['feature', 'FEAT-03'], ['pricing', 'PRC-03'], ['footer', 'FTR-01']
];

const state = {
  mode: 'builder',          // 'builder' | 'vault'
  presentation: false,
  sidebarOpen: true,
  sideTab: 'slots',
  viewport: 'desktop',      // 'desktop' | 'tablet' | 'mobile'
  zoom: 1,                  // 0.30 .. 1.50
  guidesOn: true,
  canvasMoveMode: true,     // ON by default: grab & move ANY UI directly on the webpage!
  inlineEdit: false,
  tuneOpen: false,
  worldKey: 'maison',
  trayGroup: 'sections',    // 'sections' | 'components' | 'themes'
  trayWide: false,          // 1-click 680px extra-large whole-section showcase toggle
  activeCat: 'featured',    // 'featured' | 'all' | specific catKey
  drawerQuery: '',
  vaultFilter: 'all',
  vaultQuery: '',
  reviewIdx: 0,
  proposalSlot: 'A',
  proposals: makeInitialProposals(),
  undoStack: [],
  uiOffsets: {},            // { [domPath]: { x, y, scale, width, height, zIndex, bgColor, fgColor, href, hidden } }
  freeWidgets: [],          // [ { uid, secKey, catKey, assetId, customHTML, xPct, yPx, scale, width, height, zIndex, bgColor, fgColor, href } ]
  customTexts: {},          // { [domPath]: string }
  customImages: {},         // { [domPath]: dataUrlOrSrc }
  secHeights: {},           // { [secKey]: number }
  customSections: {},       // { [secKey]: { id, type: 'blank' | 'clone', baseCatKey, assetId, title } }
  responsiveOverrides: { desktop: {}, tablet: {}, mobile: {} },
  interactions: {},
  selectedUIPath: null,
  selectedFreeUid: null,
  exportTab: 'code',        // 'code' | 'preview'
  lastExportPreviewDoc: '',
  tokens: {
    radius: 10,
    density: 'balanced',    // 'compact' | 'balanced' | 'editorial'
    grain: 0.035,
    customAccent: null,
    customPaletteTokens: null
  },
  secOrder: [...DEFAULT_SEC_ORDER],
  secEnabled: DEFAULT_SEC_ORDER.reduce((acc, k) => { acc[k] = true; return acc; }, {}),
  equipped: { ...WORLDS.maison.preset }
};
globalThis.state = typeof window !== 'undefined' ? (window.state = state) : state;

function getCurrentWorldObj() {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.BrandRestyler?.getEffectiveWorld) {
    return FORMA_PRO.BrandRestyler.getEffectiveWorld();
  }
  return WORLDS[state.worldKey] || WORLDS.maison;
}

function getAsset(catKey, id) {
  const list = VAULT[catKey] || [];
  return list.find(x => x.id === id) || list[0];
}

function getGroupForCat(catKey) {
  if (TRAY_GROUPS.sections.includes(catKey)) return 'sections';
  if (TRAY_GROUPS.components.includes(catKey)) return 'components';
  return 'themes';
}

function showStudioToast(msg) {
  const t = document.getElementById('st-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('is-visible'), 2200);
}

/* ==========================================================================
   50-STEP UNDO (Ctrl+Z / ↩) & REDO (Ctrl+Y / Ctrl+Shift+Z / ↪)
   ========================================================================== */
function cloneOffsetsMap(m) {
  const out = {};
  Object.keys(m || {}).forEach(k => { out[k] = typeof m[k] === 'object' && m[k] !== null ? { ...m[k] } : m[k]; });
  return out;
}

function pushUndoSnapshot() {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.pushUndoSnapshot) {
    FORMA_PRO.ProjectState.pushUndoSnapshot();
    return;
  }
  state.undoStack.push({
    worldKey: state.worldKey,
    equipped: { ...state.equipped },
    secOrder: [...state.secOrder],
    secEnabled: { ...state.secEnabled },
    tokens: { ...state.tokens },
    uiOffsets: cloneOffsetsMap(state.uiOffsets),
    freeWidgets: state.freeWidgets.map(w => ({ ...w })),
    customTexts: { ...state.customTexts },
    customImages: { ...state.customImages },
    secHeights: { ...state.secHeights },
    customSections: cloneOffsetsMap(state.customSections)
  });
  if (state.undoStack.length > 50) state.undoStack.shift();
  updateUndoButtonUI();
}

function updateUndoButtonUI() {
  if (typeof updateUndoRedoButtonsUI === 'function') {
    updateUndoRedoButtonsUI();
    return;
  }
  const btn = document.getElementById('undo-btn');
  if (!btn) return;
  const n = state.undoStack.length;
  btn.style.opacity = n > 0 ? '1' : '0.45';
  btn.textContent = n > 0 ? `↩ (${n})` : '↩';
}

function undoLastAction() {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.undo) {
    return FORMA_PRO.ProjectState.undo();
  }
  const snap = state.undoStack.pop();
  if (!snap) {
    showStudioToast('되돌릴 변경 내역이 없습니다.');
    return false;
  }
  state.worldKey = snap.worldKey;
  state.equipped = { ...snap.equipped };
  state.secOrder = [...snap.secOrder];
  state.secEnabled = { ...snap.secEnabled };
  state.tokens = { ...snap.tokens };
  state.uiOffsets = cloneOffsetsMap(snap.uiOffsets);
  state.freeWidgets = (snap.freeWidgets || []).map(w => ({ ...w }));
  state.customTexts = { ...(snap.customTexts || {}) };
  state.customImages = { ...(snap.customImages || {}) };
  state.secHeights = { ...(snap.secHeights || {}) };
  state.customSections = cloneOffsetsMap(snap.customSections);
  clearSelectedCanvasUI();
  const sel = document.getElementById('world-select');
  if (sel) sel.value = state.worldKey;
  updateUndoButtonUI();
  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();
  if (state.mode === 'vault') renderVaultView();
  showStudioToast('↩ 이전 UI 상태로 되돌렸습니다.');
  return true;
}

function redoLastAction() {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.redo) {
    return FORMA_PRO.ProjectState.redo();
  }
  showStudioToast('다시 실행할 변경 내역이 없습니다.');
  return false;
}

/* ==========================================================================
   COMPACT CONTROLS + CLIENT A/B/C COMPARE + FINE-TUNING POPOVER
   ========================================================================== */
function bindEditablePersistenceInTextMode(site) {
  if (!site || typeof site.querySelectorAll !== 'function') return;
  site.querySelectorAll('h1, h2, h3, p, blockquote').forEach(el => {
    el.contentEditable = state.inlineEdit ? 'true' : 'false';
    if (state.inlineEdit) {
      el.onfocus = () => { el._beforeTextEditHTML = el.innerHTML; };
      el.onblur = () => {
        if (el._beforeTextEditHTML !== undefined && el.innerHTML !== el._beforeTextEditHTML) {
          const newHTML = el.innerHTML;
          el.innerHTML = el._beforeTextEditHTML;
          const freeWrap = el.closest?.('.f-free-ui');
          const pathKey = (!freeWrap || !freeWrap.dataset?.uid) ? getElementPathInRoot(el) : null;
          if (freeWrap && freeWrap.dataset?.uid) {
            const fw = state.freeWidgets.find(x => x.uid === freeWrap.dataset.uid);
            if (fw) fw.customHTML = freeWrap.innerHTML;
          } else if (pathKey) {
            state.customTexts[pathKey] = el._beforeTextEditHTML;
          }
          pushUndoSnapshot();
          el.innerHTML = newHTML;
          el._beforeTextEditHTML = newHTML;
          if (freeWrap && freeWrap.dataset?.uid) {
            const fw = state.freeWidgets.find(x => x.uid === freeWrap.dataset.uid);
            if (fw) fw.customHTML = freeWrap.innerHTML;
          } else if (pathKey) {
            state.customTexts[pathKey] = newHTML;
          }
          FORMA_PRO.ProjectState?.scheduleAutosave?.();
        }
      };
    } else {
      el.onfocus = null;
      el.onblur = null;
    }
  });
}

function setCanvasInteractionMode(mode) {
  // mode: 'move' | 'text' | 'preview'
  if (mode === 'preview') {
    togglePresentationMode(true);
    return;
  }
  state.presentation = false;
  document.getElementById('studio-app')?.classList.remove('is-presentation');
  state.canvasMoveMode = (mode === 'move');
  state.inlineEdit = (mode === 'text');
  clearSelectedCanvasUI();

  document.getElementById('cmode-move')?.classList.toggle('is-active', state.canvasMoveMode);
  document.getElementById('cmode-text')?.classList.toggle('is-active', state.inlineEdit);

  const site = document.getElementById('hp-root');
  if (site) {
    site.classList.toggle('is-move-mode', state.canvasMoveMode);
    site.classList.toggle('is-editing', state.inlineEdit);
    bindEditablePersistenceInTextMode(site);
  }
  renderQuickSubbar();
}

function renderQuickSubbar() {
  renderTunePopover();
  ['A', 'B', 'C'].forEach(slot => {
    document.getElementById(`prop-btn-${slot}`)?.classList.toggle('is-active', state.proposalSlot === slot);
  });
  document.getElementById('cmode-move')?.classList.toggle('is-active', state.canvasMoveMode && !state.inlineEdit);
  document.getElementById('cmode-text')?.classList.toggle('is-active', state.inlineEdit);
  const el = document.getElementById('st-subbar');
  if (el) el.style.display = 'none';
}

function toggleTunePopover(force) {
  state.tuneOpen = typeof force === 'boolean' ? force : !state.tuneOpen;
  const pop = document.getElementById('st-tune-popover');
  if (pop) pop.classList.toggle('is-open', state.tuneOpen);
}

function renderTunePopover() {
  const pop = document.getElementById('st-tune-popover');
  if (!pop) return;
  pop.classList.toggle('is-open', state.tuneOpen);
  pop.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.09);padding-bottom:8px;">
      <strong style="font-size:13px;color:#F8FAFC;">⚙️ 스타일 미세 조절</strong>
      <button type="button" onclick="toggleTunePopover(false)" class="st-pill-btn" style="padding:2px 7px;">✕</button>
    </div>
    <div>
      <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:6px;">
        <span>모서리 둥글기</span>
        <span class="f-mono">${state.tokens.radius}px</span>
      </div>
      <input type="range" min="0" max="28" value="${state.tokens.radius}" oninput="updateToken('radius', this.value)" style="width:100%;accent-color:#38BDF8;cursor:pointer;" />
    </div>
    <div>
      <div style="font-size:12px;font-weight:700;margin-bottom:6px;">섹션 여백</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;">
        ${[['compact','좁게'],['balanced','기본'],['editorial','넓게']].map(([v, lbl]) => `
          <button type="button" onclick="updateToken('density','${v}')" class="st-pill-btn ${state.tokens.density===v?'is-active':''}" style="justify-content:center;padding:5px 4px;">${lbl}</button>
        `).join('')}
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:12px;font-weight:700;">포인트 컬러</span>
      <input type="color" value="${state.tokens.customAccent || '#8C5A32'}" oninput="updateToken('customAccent', this.value)" style="width:34px;height:26px;border:none;background:transparent;cursor:pointer;" />
    </div>
    <div style="padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);display:flex;gap:6px;">
      <button type="button" onclick="resetAllMovedElements()" class="st-pill-btn" style="flex:1;justify-content:center;">↺ 이동한 UI 전체 원위치</button>
      <button type="button" onclick="saveCurrentToProposalSlot()" class="st-pill-btn is-primary">💾 시안${state.proposalSlot}</button>
    </div>
  `;
}

function resetAllMovedElements() {
  pushUndoSnapshot();
  state.uiOffsets = {};
  state.freeWidgets = [];
  state.customTexts = {};
  state.customImages = {};
  state.secHeights = {};
  clearSelectedCanvasUI();
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  showStudioToast('모든 UI 위치와 커스텀 수정을 기본 정렬로 초기화했습니다.');
}

function saveCurrentToProposalSlot(silent = false) {
  const slot = state.proposalSlot || 'A';
  const doc = FORMA_PRO.ProjectState?.getDoc?.();
  const snap = {
    label: `시안 ${slot}`,
    worldKey: state.worldKey,
    brandProfile: doc?.brandProfile ? deepCloneJSON(doc.brandProfile) : null,
    equipped: { ...state.equipped },
    globalEquipped: doc?.globalEquipped ? deepCloneJSON(doc.globalEquipped) : { ...state.equipped },
    tokens: deepCloneJSON(state.tokens),
    activePageId: doc?.activePageId || 'page-home',
    pages: doc?.pages ? deepCloneJSON(doc.pages) : null
  };
  state.proposals[slot] = snap;
  if (doc) {
    doc.proposals = doc.proposals || {};
    doc.proposals[slot] = deepCloneJSON(snap);
  }
  if (!silent) {
    renderQuickSubbar();
    FORMA_PRO.ProjectState?.scheduleAutosave?.();
    showStudioToast(`시안 ${slot}에 현재 프로젝트 전체 상태 저장 완료`);
  }
}

function loadProposalSlot(slot) {
  const doc = FORMA_PRO.ProjectState?.getDoc?.();
  const snap = (doc?.proposals && doc.proposals[slot]) || state.proposals[slot];
  if (!snap) return;

  // Save current state into outgoing proposal slot before switching
  if (state.proposalSlot && state.proposalSlot !== slot) {
    saveCurrentToProposalSlot(true);
  }
  pushUndoSnapshot();
  state.proposalSlot = slot;

  if (doc) {
    doc.worldKey = snap.worldKey || doc.worldKey;
    if (snap.brandProfile !== undefined) doc.brandProfile = deepCloneJSON(snap.brandProfile);
    doc.equipped = { ...(snap.equipped || doc.equipped) };
    doc.globalEquipped = snap.globalEquipped ? deepCloneJSON(snap.globalEquipped) : { ...doc.equipped };
    doc.tokens = deepCloneJSON(snap.tokens || doc.tokens);
    if (Array.isArray(snap.pages) && snap.pages.length > 0) {
      doc.pages = deepCloneJSON(snap.pages);
      doc.activePageId = snap.activePageId || doc.pages[0].id;
    }
    FORMA_PRO.ProjectState?.syncPageToEngineState?.(doc);
  } else {
    state.worldKey = snap.worldKey || state.worldKey;
    state.equipped = { ...snap.equipped };
    state.tokens = { ...snap.tokens };
  }

  const sel = document.getElementById('world-select');
  if (sel) sel.value = state.worldKey;
  clearSelectedCanvasUI();
  if (typeof renderPageTabsUI === 'function') renderPageTabsUI();
  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();
  if (state.mode === 'vault') renderVaultView();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  showStudioToast(`시안 ${slot} 적용`);
}

/* ==========================================================================
   MODE, SIDEBAR, VIEWPORT, ZOOM & WORLD CONTROLS
   ========================================================================== */
let vaultShaderRAF = null;
let drawerShaderRAF = null;

function setStudioMode(mode) {
  state.mode = mode;
  clearSelectedCanvasUI();
  document.getElementById('mode-btn-builder')?.classList.toggle('is-active', mode === 'builder');
  document.getElementById('mode-btn-vault')?.classList.toggle('is-active', mode === 'vault');
  document.getElementById('cmode-move')?.classList.toggle('is-active', mode === 'builder' && state.canvasMoveMode && !state.inlineEdit);
  document.getElementById('cmode-text')?.classList.toggle('is-active', mode === 'builder' && state.inlineEdit);
  const vv = document.getElementById('vault-view');
  if (vv) vv.classList.toggle('is-open', mode === 'vault');
  if (mode === 'vault') {
    renderVaultView();
  } else if (vaultShaderRAF) {
    cancelAnimationFrame(vaultShaderRAF);
    vaultShaderRAF = null;
  }
}

function togglePresentationMode(force) {
  state.presentation = typeof force === 'boolean' ? force : !state.presentation;
  clearSelectedCanvasUI();
  document.getElementById('studio-app')?.classList.toggle('is-presentation', state.presentation);
  if (state.presentation) {
    setStudioMode('builder');
    state.tuneOpen = false;
    renderTunePopover();
    showStudioToast('전체화면 미리보기 (ESC로 복귀)');
  }
}

function syncDrawerSectionZoom() {
  const sb = document.getElementById('st-sidebar');
  const cardsEl = document.getElementById('st-drawer-cards');
  if (!sb || !cardsEl || !state.sidebarOpen) return;
  const rawW = cardsEl.clientWidth || sb.clientWidth || 0;
  if (rawW > 180 && rawW < 920) {
    const availW = Math.max(250, rawW - 28);
    const z = (availW / 760).toFixed(4);
    sb.style.setProperty('--sec-zoom', z);
  }
}

function toggleTrayWide() {
  state.trayWide = !state.trayWide;
  const sb = document.getElementById('st-sidebar');
  if (sb) sb.classList.toggle('is-wide', state.trayWide);
  const wBtn = document.getElementById('tray-wide-btn');
  if (wBtn) {
    wBtn.classList.toggle('is-active', state.trayWide);
    wBtn.textContent = state.trayWide ? '⇕ 기본크기' : '⇔ 더 크게';
  }
  syncDrawerSectionZoom();
  setTimeout(syncDrawerSectionZoom, 260);
}

function toggleSidebar() {
  state.sidebarOpen = !state.sidebarOpen;
  document.getElementById('st-sidebar')?.classList.toggle('is-collapsed', !state.sidebarOpen);
  const btn = document.getElementById('sidebar-toggle-btn');
  if (btn) btn.textContent = state.sidebarOpen ? '◧' : '◨ UI패널';
  if (state.sidebarOpen) setTimeout(syncDrawerSectionZoom, 260);
}

function setSideTab(tab) {
  state.sideTab = tab;
  if (tab === 'composer') setTrayGroup('sections');
  else if (tab === 'tokens') toggleTunePopover(true);
  else renderSidebarBody();
}

function setViewportSize(vp) {
  state.viewport = vp;
  clearSelectedCanvasUI();
  const cf = document.getElementById('canvas-frame');
  const inClient = Boolean(typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.());
  if (cf) {
    cf.dataset.viewport = vp;
    cf.setAttribute?.('data-viewport', vp);
    cf.classList.remove('vp-tablet', 'vp-mobile');
    if (inClient) {
      if (vp === 'tablet') cf.classList.add('vp-tablet');
      if (vp === 'mobile') cf.classList.add('vp-mobile');
    }
  }
  const root = document.getElementById('hp-root');
  if (root) {
    root.dataset.viewport = vp;
    root.setAttribute?.('data-viewport', vp);
  }
  ['desktop', 'tablet', 'mobile'].forEach(k => {
    document.getElementById(`vp-btn-${k}`)?.classList.toggle('is-active', k === vp);
  });
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine?.applyViewportState) {
    FORMA_PRO.ResponsiveEngine.applyViewportState(vp);
  }
  syncSelectedUIOverlay();
}

function resetCurrentViewportOverride() {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine?.resetCurrentViewportOverride) {
    return FORMA_PRO.ResponsiveEngine.resetCurrentViewportOverride();
  }
  const vp = state.viewport || 'desktop';
  if (vp !== 'desktop' && state.responsiveOverrides && state.responsiveOverrides[vp]) {
    pushUndoSnapshot();
    state.responsiveOverrides[vp] = {};
    renderLiveWebsite();
    FORMA_PRO.ProjectState?.scheduleAutosave?.();
    showStudioToast(`↺ ${vp.toUpperCase()} 뷰포트 전용 오버라이드를 초기화했습니다.`);
  }
}

function setCanvasZoom(zVal, focalPoint) {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine?.setCanvasZoom) {
    return FORMA_PRO.ResponsiveEngine.setCanvasZoom(zVal, focalPoint);
  }
  const clamped = Math.max(0.3, Math.min(1.5, Number(Number(zVal || 1).toFixed(2))));
  state.zoom = clamped;
  if (typeof document !== 'undefined') {
    const cf = document.getElementById('canvas-frame');
    const stage = document.getElementById('canvas-zoom-stage');
    const readout = document.getElementById('st-zoom-readout');
    if (cf) {
      cf.dataset.zoom = String(clamped);
      cf.setAttribute?.('data-zoom', String(clamped));
    }
    if (stage) {
      stage.dataset.zoom = String(clamped);
      stage.setAttribute?.('data-zoom', String(clamped));
      stage.style.transform = clamped === 1 ? '' : `scale(${clamped})`;
    }
    if (readout) {
      readout.textContent = `${Math.round(clamped * 100)}%`;
    }
  }
  syncSelectedUIOverlay();
  return clamped;
}

function stepCanvasZoom(delta, focalPoint) {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine?.stepCanvasZoom) {
    return FORMA_PRO.ResponsiveEngine.stepCanvasZoom(delta, focalPoint);
  }
  return setCanvasZoom((state.zoom || 1) + delta, focalPoint);
}

function zoomCanvasToFit() {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine?.fitCanvasZoom) {
    return FORMA_PRO.ResponsiveEngine.fitCanvasZoom();
  }
  return setCanvasZoom(1);
}

function toggleInlineEdit() {
  setCanvasInteractionMode(state.inlineEdit ? 'move' : 'text');
}

function switchWorld(worldKey) {
  const w = WORLDS[worldKey];
  if (!w) return;
  pushUndoSnapshot();
  state.worldKey = worldKey;
  state.tokens.customAccent = null;
  state.tokens.customPaletteTokens = null;
  state.equipped = { ...w.preset };
  state.uiOffsets = {};
  state.freeWidgets = [];
  state.customTexts = {};
  state.customImages = {};
  state.secHeights = {};
  state.customSections = {};
  state.secOrder = [...DEFAULT_SEC_ORDER];
  state.secEnabled = DEFAULT_SEC_ORDER.reduce((acc, k) => { acc[k] = true; return acc; }, {});
  state.reviewIdx = 0;

  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState) {
    const doc = FORMA_PRO.ProjectState.getDoc();
    doc.worldKey = worldKey;
    doc.brandProfile = {
      customApplied: false,
      brandName: w.brand,
      slogan: w.eyebrow,
      primaryColor: '#8C5A32',
      mood: 'light',
      fontPairingId: w.preset?.font || 'FNT-01',
      harmonicTokens: null
    };
    doc.tokens.customAccent = null;
    doc.tokens.customPaletteTokens = null;
    doc.equipped = { ...w.preset };
    doc.pages = FORMA_PRO.ProjectState.makeDefaultPagesForWorld(worldKey);
    doc.activePageId = doc.pages[0].id;
    FORMA_PRO.ProjectState.syncPageToEngineState(doc);
  }

  clearSelectedCanvasUI();
  if (typeof renderPageTabsUI === 'function') renderPageTabsUI();
  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();
  if (state.mode === 'vault') renderVaultView();
  document.getElementById('canvas-frame')?.scrollTo({ top: 0, behavior: 'smooth' });
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  showStudioToast(`${w.brand} UI 로드 완료`);
}

function randomizeCombination() {
  pushUndoSnapshot();
  CATEGORIES.forEach(c => {
    const list = VAULT[c.key] || [];
    if (list.length) {
      const nonEmpty = list.filter(item => item.mode !== 'off' && item.mode !== 'none' && item.id !== 'TOP-08' && item.id !== 'DIV-08' && item.id !== 'WGT-10' && item.id !== 'MOT-08');
      const pool = nonEmpty.length ? nonEmpty : list;
      state.equipped[c.key] = pool[Math.floor(Math.random() * pool.length)].id;
    }
  });
  state.tokens.customAccent = null;
  state.tokens.customPaletteTokens = null;
  clearSelectedCanvasUI();
  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();
  if (state.mode === 'vault') renderVaultView();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  showStudioToast('🎲 랜덤 UI 조합 적용!');
}

function setTrayGroup(grp) {
  state.trayGroup = grp;
  state.drawerQuery = '';
  const inp = document.getElementById('drawer-search-input');
  if (inp) inp.value = '';
  if (grp === 'sections') state.activeCat = 'featured';
  else if (grp === 'components') state.activeCat = 'button';
  else state.activeCat = 'palette';
  renderSidebarBody();
  document.getElementById('st-drawer-cards')?.scrollTo?.({ top: 0, behavior: 'smooth' });
}

function selectSlotCategory(catKey) {
  if (catKey !== 'featured' && catKey !== 'all') {
    state.trayGroup = getGroupForCat(catKey);
  }
  state.activeCat = catKey;
  state.drawerQuery = '';
  const inp = document.getElementById('drawer-search-input');
  if (inp) inp.value = '';
  if (!state.sidebarOpen) toggleSidebar();
  renderSidebarBody();
  document.getElementById('st-drawer-cards')?.scrollTo?.({ top: 0, behavior: 'smooth' });
  const meta = CATEGORIES.find(c => c.key === catKey);
  if (meta?.secId && state.mode === 'builder') {
    document.getElementById(meta.secId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function focusDrawerCategory(catKey) {
  const baseKey = state.customSections[catKey]?.baseCatKey || catKey;
  setStudioMode('builder');
  selectSlotCategory(baseKey);
}

function setDrawerSearch(q) {
  state.drawerQuery = q || '';
  renderDrawerCardsOnly();
}

function equipAsset(catKey, assetId, jumpToBuilder = false) {
  state.equipped[catKey] = assetId;
  if (catKey === 'palette') {
    state.tokens.customAccent = null;
    state.tokens.customPaletteTokens = null;
  }
  if (CATEGORIES.find(c => c.key === catKey)?.group === 'section') {
    state.secEnabled[catKey] = true;
  }
  clearSelectedCanvasUI();
  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();

  if (state.mode === 'vault') {
    if (jumpToBuilder) setStudioMode('builder');
    else renderVaultView();
  }

  const item = getAsset(catKey, assetId);
  const meta = CATEGORIES.find(c => c.key === catKey);
  if (catKey === 'preloader' && (item.mode === 'splitCurtain' || item.mode === 'monogramCurtain' || item.mode === 'shutterCurtain')) {
    setTimeout(() => triggerIntroCurtain(item.mode), 60);
  } else if (meta?.secId && state.mode === 'builder') {
    setTimeout(() => {
      const targetEl = document.getElementById(meta.secId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        targetEl.classList.add('is-just-applied');
        setTimeout(() => targetEl.classList.remove('is-just-applied'), 900);
      }
    }, 40);
  }
}

function cycleSlot(catKey, dir, ev) {
  if (ev) ev.stopPropagation();
  const list = VAULT[catKey] || [];
  if (!list.length) return;
  pushUndoSnapshot();
  const idx = list.findIndex(x => x.id === state.equipped[catKey]);
  const next = list[(idx + dir + list.length) % list.length];
  equipAsset(catKey, next.id);
}

function addBlankCanvasSection(afterSecKey) {
  pushUndoSnapshot();
  const blankKey = 'blank-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 999);
  state.customSections[blankKey] = {
    id: blankKey,
    type: 'blank',
    baseCatKey: 'hero',
    assetId: 'BLANK',
    title: '자유 캔버스 섹션'
  };
  state.secEnabled[blankKey] = true;
  state.secHeights[blankKey] = 440;
  state.lastAddedSecKey = blankKey;
  const ref = afterSecKey || (state.secOrder.includes('hero') ? 'hero' : state.secOrder[0]);
  const idx = state.secOrder.indexOf(ref);
  if (idx >= 0) state.secOrder.splice(idx + 1, 0, blankKey);
  else state.secOrder.unshift(blankKey);
  clearSelectedCanvasUI();
  renderSidebarBody();
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  const el = typeof document !== 'undefined' ? document.getElementById('sec-' + blankKey) : null;
  if (el) {
    el.scrollIntoView?.({ behavior: 'auto', block: 'center' });
    el.classList.add('is-just-applied');
  }
  showStudioToast('✨ 빈 자유 캔버스 섹션이 추가되었습니다! 원하는 UI나 사진을 마음껏 올려보세요.');
  return blankKey;
}

function duplicateSectionInstance(secKey) {
  pushUndoSnapshot();
  const existingCustom = state.customSections[secKey];
  const baseCatKey = existingCustom ? existingCustom.baseCatKey : secKey;
  const cloneKey = 'clone-' + baseCatKey + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 999);
  state.customSections[cloneKey] = {
    id: cloneKey,
    type: existingCustom?.type === 'blank' ? 'blank' : 'clone',
    baseCatKey,
    assetId: existingCustom?.assetId || state.equipped[baseCatKey],
    title: existingCustom?.title || '복제 섹션'
  };
  state.secEnabled[cloneKey] = true;
  if (state.secHeights[secKey]) {
    state.secHeights[cloneKey] = state.secHeights[secKey];
  }
  // Also duplicate any free widgets placed inside the original section!
  const clonedWidgets = state.freeWidgets
    .filter(fw => fw.secKey === secKey)
    .map(fw => ({
      ...fw,
      uid: 'fw-' + Date.now() + '-' + Math.floor(Math.random() * 9999),
      secKey: cloneKey
    }));
  state.freeWidgets.push(...clonedWidgets);

  // Also duplicate any customTexts, customImages, and uiOffsets scoped to #sec-${secKey}>
  const oldPrefix = `#sec-${secKey}>`;
  const newPrefix = `#sec-${cloneKey}>`;
  Object.keys(state.uiOffsets || {}).forEach(k => {
    if (k.startsWith(oldPrefix)) {
      state.uiOffsets[newPrefix + k.slice(oldPrefix.length)] = { ...state.uiOffsets[k] };
    }
  });
  Object.keys(state.customTexts || {}).forEach(k => {
    if (k.startsWith(oldPrefix)) {
      state.customTexts[newPrefix + k.slice(oldPrefix.length)] = state.customTexts[k];
    }
  });
  Object.keys(state.customImages || {}).forEach(k => {
    if (k.startsWith(oldPrefix)) {
      state.customImages[newPrefix + k.slice(oldPrefix.length)] = state.customImages[k];
    }
  });

  const idx = state.secOrder.indexOf(secKey);
  if (idx >= 0) state.secOrder.splice(idx + 1, 0, cloneKey);
  else state.secOrder.push(cloneKey);

  clearSelectedCanvasUI();
  renderSidebarBody();
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  setTimeout(() => {
    const el = document.getElementById('sec-' + cloneKey);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    el?.classList.add('is-just-applied');
  }, 40);
  showStudioToast('⎘ 섹션이 아래에 하나 더 복제되었습니다!');
  return cloneKey;
}

function moveSectionOrder(secKey, dir) {
  const idx = state.secOrder.indexOf(secKey);
  const target = idx + dir;
  if (idx < 0 || target < 0 || target >= state.secOrder.length) return;
  pushUndoSnapshot();
  const arr = [...state.secOrder];
  [arr[idx], arr[target]] = [arr[target], arr[idx]];
  state.secOrder = arr;
  clearSelectedCanvasUI();
  renderSidebarBody();
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
}

function toggleSectionVisible(secKey) {
  pushUndoSnapshot();
  state.secEnabled[secKey] = !state.secEnabled[secKey];
  clearSelectedCanvasUI();
  renderSidebarBody();
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
}

function hideSectionWithUndo(secKey) {
  pushUndoSnapshot();
  state.secEnabled[secKey] = false;
  clearSelectedCanvasUI();
  renderSidebarBody();
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
}

function restoreHiddenSection(secKey) {
  pushUndoSnapshot();
  state.secEnabled[secKey] = true;
  clearSelectedCanvasUI();
  renderSidebarBody();
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  setTimeout(() => document.getElementById('sec-' + secKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
}

let tokenCoalesceTimer = null;
function updateToken(key, val) {
  if (!tokenCoalesceTimer) {
    pushUndoSnapshot();
  }
  clearTimeout(tokenCoalesceTimer);
  tokenCoalesceTimer = setTimeout(() => { tokenCoalesceTimer = null; }, 450);

  if (key === 'radius') state.tokens.radius = Number(val);
  if (key === 'density') state.tokens.density = val;
  if (key === 'grain') state.tokens.grain = Number(val);
  if (key === 'customAccent') {
    state.tokens.customAccent = val;
    state.tokens.customPaletteTokens = null;
  }
  if (key === 'guidesOn') state.guidesOn = Boolean(val);
  renderTunePopover();
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
}

/* ==========================================================================
   100% PURE VISUAL UI THUMBNAILS (ZERO Meta-Text Descriptions — Real UI Only!)
   ========================================================================== */
const SAMPLE_BTN_LABELS = ['예약하기 →', '시작하기 ↗', '컬렉션 보기', '무료 체험', '상담 신청 →', 'VIEW MORE'];

function renderFreeComponentHTML(catKey, item) {
  const w = getCurrentWorldObj();
  const ctx = {
    bdgCls: getAsset('badge', state.equipped.badge).cls,
    tfxId: state.equipped.textfx,
    btn: (l) => getAsset('button', state.equipped.button).render(l)
  };
  if (catKey === 'button') {
    const idx = Math.max(0, (VAULT.button || []).indexOf(item));
    return item.render(SAMPLE_BTN_LABELS[idx % SAMPLE_BTN_LABELS.length]);
  }
  if (catKey === 'surface') {
    return `<div class="${item.cls}" style="width:236px;">
      <div class="f-card" style="padding:12px;display:flex;flex-direction:column;gap:8px;">
        <div style="height:82px;border-radius:6px;overflow:hidden;"><img src="${IMG[w.heroImg]}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="font-size:13px;">${w.works[0].title}</strong>
          <span class="f-mono" style="font-size:11px;color:var(--accent);font-weight:700;">★ 4.9</span>
        </div>
      </div>
    </div>`;
  }
  if (catKey === 'inputui') {
    return `<div style="background:var(--surface);padding:10px 12px;border-radius:10px;border:1px solid var(--border);box-shadow:0 12px 28px rgba(0,0,0,0.14);">${item.demo()}</div>`;
  }
  if (catKey === 'imgstyle') {
    return `<div class="${item.cls}" style="width:210px;"><div class="f-media" style="width:210px;height:132px;"><img src="${IMG[w.secImg1]}" alt=""/></div></div>`;
  }
  if (catKey === 'badge') {
    return `<span class="${item.cls}">${w.eyebrow}</span>`;
  }
  if (catKey === 'widget') {
    const raw = item.render(w, ctx);
    return raw ? `<div style="zoom:0.8;">${raw.replace(/position:sticky;/g, 'position:relative;')}</div>` : `<span class="f-bdg">CLEAN</span>`;
  }
  return item.render ? item.render('ACTION →') : '';
}

function renderDrawerVisualStage(catKey, item) {
  const w     = getCurrentWorldObj();
  const pal   = getAsset('palette', state.equipped.palette);
  const fnt   = getAsset('font', state.equipped.font);
  const tfx   = getAsset('textfx', state.equipped.textfx);
  const srf   = getAsset('surface', state.equipped.surface);
  const imgst = getAsset('imgstyle', state.equipped.imgstyle);
  const inp   = getAsset('inputui', state.equipped.inputui);
  const bdg   = getAsset('badge', state.equipped.badge);
  const btn   = getAsset('button', state.equipped.button);
  const ctx   = { bdgCls: bdg.cls, tfxId: tfx.id, btn: (l) => btn.render(l) };

  if (catKey === 'palette') {
    // Render a real miniature webpage UI mockup in this exact palette!
    return `<div class="${item.cls} ${fnt.cls}" style="width:100%;padding:10px 12px;background:var(--bg);color:var(--fg);display:flex;flex-direction:column;gap:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:6px;">
        <span style="font-family:var(--font-display);font-size:12px;font-weight:700;">${w.brand}</span>
        <div style="display:flex;gap:4px;">
          ${item.swatches.map(s => `<span style="width:11px;height:11px;border-radius:99px;background:${s};border:1px solid rgba(128,128,128,0.3);"></span>`).join('')}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:8px;align-items:center;">
        <div>
          <div style="font-family:var(--font-display);font-size:13.5px;font-weight:700;line-height:1.22;">${w.h1Accent}</div>
          <span style="display:inline-block;margin-top:6px;padding:4px 10px;border-radius:999px;background:var(--accent);color:var(--accent-fg);font-size:10px;font-weight:700;">Explore →</span>
        </div>
        <div style="height:52px;border-radius:6px;overflow:hidden;border:1px solid var(--border);">
          <img src="${IMG[w.heroImg]}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;"/>
        </div>
      </div>
    </div>`;
  }

  if (catKey === 'shader') {
    return `<div class="${pal.cls} ${item.cls || ''}" style="width:100%;height:96px;background-color:var(--bg);color:var(--fg);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">
      ${item.mode !== 'none' ? `<canvas class="drawer-shader-canvas" data-mode="${item.mode}" width="290" height="96" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>` : ''}
      <div style="position:relative;z-index:2;padding:8px 14px;border-radius:10px;background:color-mix(in srgb, var(--surface) 78%, transparent);backdrop-filter:blur(8px);border:1px solid var(--border);display:flex;align-items:center;gap:10px;">
        <div style="width:28px;height:28px;border-radius:6px;overflow:hidden;"><img src="${IMG[w.heroImg]}" alt="" style="width:100%;height:100%;object-fit:cover;"/></div>
        <div>
          <div style="font-size:11px;font-weight:800;">${w.brand}</div>
          <div style="width:48px;height:4px;border-radius:99px;background:var(--accent);margin-top:4px;"></div>
        </div>
      </div>
    </div>`;
  }

  if (catKey === 'font') {
    return `<div class="${pal.cls} ${item.cls}" style="width:100%;padding:12px;background:var(--bg);color:var(--fg);display:flex;align-items:center;justify-content:space-between;gap:8px;">
      <div>
        <div style="font-family:var(--font-display);font-weight:var(--display-weight);letter-spacing:var(--display-track);font-size:19px;line-height:1.15;">${w.h1Accent}</div>
        <div style="font-family:var(--font-body);font-size:11px;color:var(--sub);margin-top:3px;">${item.sample}</div>
      </div>
      <span style="padding:4px 9px;border-radius:999px;background:var(--fg);color:var(--bg);font-size:10px;font-weight:700;">Aa</span>
    </div>`;
  }

  if (catKey === 'textfx') {
    return `<div class="${pal.cls} ${fnt.cls} ${item.cls}" style="width:100%;padding:13px 10px;background:var(--bg);color:var(--fg);text-align:center;">
      <div class="f-h2" style="font-size:18px;">${fmtHeadline(w.h1Pre, w.h1Accent, item.id)}</div>
    </div>`;
  }

  if (catKey === 'button') {
    const idx = Math.max(0, (VAULT.button || []).indexOf(item));
    const lbl = SAMPLE_BTN_LABELS[idx % SAMPLE_BTN_LABELS.length];
    return `<div class="${pal.cls} ${fnt.cls}" style="width:100%;min-height:76px;padding:14px 12px;border-radius:10px;background:var(--bg);color:var(--fg);display:flex;align-items:center;justify-content:center;">
      ${item.render(lbl)}
    </div>`;
  }

  if (catKey === 'surface') {
    return `<div class="${pal.cls} ${fnt.cls} ${item.cls}" style="width:100%;padding:14px;background:var(--bg);color:var(--fg);">
      <div class="f-card" style="padding:14px;display:grid;grid-template-columns:92px 1fr;gap:14px;align-items:center;">
        <div style="height:68px;border-radius:8px;overflow:hidden;"><img src="${IMG[w.works[0].img]}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:14px;font-weight:800;">${w.works[0].title}</span>
            <span style="width:9px;height:9px;border-radius:99px;background:var(--accent);"></span>
          </div>
          <div style="font-size:12px;color:var(--sub);margin-top:4px;">${w.works[0].price}</div>
        </div>
      </div>
    </div>`;
  }

  if (catKey === 'imgstyle') {
    return `<div class="${pal.cls} ${item.cls}" style="width:100%;padding:14px;background:var(--bg);display:flex;justify-content:center;">
      <div class="f-media" style="width:100%;height:142px;"><img src="${IMG[w.heroImg]}" alt=""/></div>
    </div>`;
  }

  if (catKey === 'inputui') {
    return `<div class="${pal.cls} ${fnt.cls}" style="width:100%;padding:16px 14px;background:var(--bg);color:var(--fg);display:flex;justify-content:center;">
      ${item.demo()}
    </div>`;
  }

  if (catKey === 'cursor') {
    const badgeVisual = item.mode === 'coords'
      ? `<span class="f-mono" style="padding:3px 8px;border-radius:4px;background:#090A0D;color:#fff;font-size:10px;">+ X:240 Y:88</span>`
      : item.mode === 'pill'
      ? `<span class="f-mono" style="padding:4px 12px;border-radius:999px;background:var(--fg);color:var(--bg);font-size:10px;font-weight:700;">EXPLORE ↗</span>`
      : item.mode === 'diff'
      ? `<span style="width:36px;height:36px;border-radius:999px;background:#FFFFFF;mix-blend-mode:difference;display:inline-block;"></span>`
      : item.mode === 'halo'
      ? `<span style="width:68px;height:68px;border-radius:999px;background:radial-gradient(circle,rgba(212,163,89,0.55) 0%,transparent 70%);display:inline-block;"></span>`
      : item.mode === 'trail'
      ? `<span style="display:inline-flex;align-items:center;gap:5px;"><span style="width:6px;height:6px;border-radius:99px;background:#FDE68A;opacity:0.4;"></span><span style="width:10px;height:10px;border-radius:99px;background:#F59E0B;opacity:0.7;"></span><span style="width:20px;height:20px;border-radius:99px;border:1.5px solid #D4A359;"></span></span>`
      : `<span style="width:38px;height:38px;border-radius:999px;border:1.5px solid var(--accent);display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;background:rgba(10,12,18,0.75);color:#fff;">VIEW</span>`;
    return `<div class="${pal.cls}" style="width:100%;height:104px;background:var(--bg);color:var(--fg);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">
      <img src="${IMG[w.secImg1]}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.42;"/>
      <div style="position:relative;z-index:2;">${badgeVisual}</div>
    </div>`;
  }

  if (catKey === 'motion') {
    const animStyle = item.demoAnim ? `animation:${item.demoAnim} 2.6s cubic-bezier(0.16,1,0.3,1) infinite;` : '';
    return `<div class="${pal.cls}" style="width:100%;height:104px;background:var(--bg);color:var(--fg);display:flex;align-items:center;justify-content:center;overflow:hidden;">
      <div style="width:210px;padding:10px 12px;border-radius:10px;background:var(--surface);border:1px solid var(--border);box-shadow:0 10px 24px rgba(0,0,0,0.12);display:flex;align-items:center;gap:10px;${animStyle}">
        <img src="${IMG[w.heroImg]}" alt="" style="width:38px;height:38px;border-radius:6px;object-fit:cover;"/>
        <div style="flex:1;"><div style="height:6px;width:75%;border-radius:99px;background:var(--fg);"></div><div style="height:5px;width:48%;border-radius:99px;background:var(--accent);margin-top:6px;"></div></div>
      </div>
    </div>`;
  }

  if (catKey === 'badge') {
    return `<div class="${pal.cls}" style="width:100%;min-height:68px;padding:12px;border-radius:10px;background:var(--bg);color:var(--fg);display:flex;align-items:center;justify-content:center;">
      <span class="${item.cls}">${w.eyebrow}</span>
    </div>`;
  }

  if (catKey === 'preloader') {
    return `<div class="${pal.cls}" style="width:100%;height:96px;background:#0A0C12;color:#F8FAFC;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">
      <img src="${IMG[w.heroImg]}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.35;"/>
      <div style="position:absolute;top:0;left:0;height:3px;width:72%;background:var(--accent);box-shadow:0 0 10px var(--accent);"></div>
      <div style="position:relative;z-index:2;padding:5px 14px;border-radius:999px;background:rgba(9,11,16,0.85);border:1px solid rgba(255,255,255,0.18);font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;">${item.mode.includes('Curtain') ? `${w.brand} · 100%` : 'SCROLL 72%'}</div>
    </div>`;
  }

  if (catKey === 'widget') {
    const raw = item.render(w, ctx);
    if (!raw) {
      return `<div class="${pal.cls}" style="width:100%;height:76px;background:var(--bg);border:1px dashed var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--sub);">CLEAN STAGE</div>`;
    }
    return `<div class="${pal.cls} ${fnt.cls}" style="width:100%;min-height:96px;background:var(--bg);color:var(--fg);display:flex;align-items:center;justify-content:center;overflow:hidden;padding:8px;">
      <div style="zoom:0.72;width:100%;">${raw.replace(/position:sticky;/g, 'position:relative;')}</div>
    </div>`;
  }

  /* 14 ~ 26: Whole Uncropped Full-Page Section UI at Large Auto-Fit Scale! */
  const secHTML = typeof item.render === 'function' ? item.render(w, ctx) : '';
  return `<div class="st-drawer-sec-shell ${pal.cls} ${fnt.cls} ${tfx.cls} ${srf.cls} ${imgst.cls} ${inp.cls || ''}">
    ${secHTML
      ? `<div class="st-drawer-sec-scale">${secHTML}</div>`
      : `<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--sub);">SPACER</div>`}
  </div>`;
}

function initDrawerShaders(container) {
  if (drawerShaderRAF) { cancelAnimationFrame(drawerShaderRAF); drawerShaderRAF = null; }
  if (!container || typeof container.querySelectorAll !== 'function' || typeof requestAnimationFrame !== 'function') return;
  const cvs = Array.from(container.querySelectorAll('.drawer-shader-canvas'));
  if (!cvs.length) return;
  const pal = getAsset('palette', state.equipped.palette);
  const accentHex = pal.swatches[2] || '#8C5A32';
  const items = cvs.map(cv => ({
    cv,
    ctx: typeof cv.getContext === 'function' ? cv.getContext('2d') : null,
    mode: cv.dataset.mode,
    motes: Array.from({ length: 14 }, (_, i) => ({ x: (i * 47) % 290, y: (i * 29) % 96, vx: 0.22, vy: -0.18, r: 1.3 }))
  })).filter(s => s.ctx);
  if (!items.length) return;
  let t = 0;
  function tick() {
    if (state.mode !== 'builder' || !state.sidebarOpen) return;
    t += 0.022;
    items.forEach(s => drawShaderFrame(s.ctx, s.cv.width, s.cv.height, s.mode, accentHex, t, s.motes, 145, 48));
    drawerShaderRAF = requestAnimationFrame(tick);
  }
  drawerShaderRAF = requestAnimationFrame(tick);
}

function renderDrawerCardsOnly() {
  const cardsEl = document.getElementById('st-drawer-cards');
  const hiddenBar = document.getElementById('st-hidden-secs-bar');
  if (!cardsEl) return;

  const q = state.drawerQuery.trim().toLowerCase();
  const entries = [];

  if (q) {
    CATEGORIES.forEach(c => {
      (VAULT[c.key] || []).forEach(item => {
        const hay = `${item.id} ${item.name} ${item.desc} ${c.name} ${c.shortName}`.toLowerCase();
        if (hay.includes(q)) entries.push({ cat: c, item });
      });
    });
  } else if (state.trayGroup === 'sections' && state.activeCat === 'featured') {
    FEATURED_SECTION_PICKS.forEach(([ck, id]) => {
      const cat = CATEGORIES.find(c => c.key === ck);
      const item = getAsset(ck, id);
      if (cat && item) entries.push({ cat, item });
    });
  } else {
    const activeMeta = CATEGORIES.find(c => c.key === state.activeCat) || CATEGORIES.find(c => c.key === 'hero');
    (VAULT[activeMeta.key] || []).forEach(item => entries.push({ cat: activeMeta, item }));
  }

  const bleedCats = new Set(['palette', 'shader', 'font', 'textfx', 'surface', 'imgstyle', 'cursor', 'motion', 'preloader', 'widget', ...TRAY_GROUPS.sections]);

  cardsEl.innerHTML = entries.length ? entries.map(({ cat, item }) => {
    const isEq = state.equipped[cat.key] === item.id && (cat.group !== 'section' || state.secEnabled[cat.key]);
    const isBleed = bleedCats.has(cat.key);
    return `<div class="st-drag-card ${isEq ? 'is-equipped' : ''}" data-cat="${cat.key}" data-id="${item.id}" title="${item.name}">
      <div class="st-thumb-corner">
        <button type="button" class="st-thumb-code st-no-drag" onclick="event.stopPropagation();openSingleAssetCode('${cat.key}','${item.id}')" title="코드 보기">&lt;/&gt;</button>
        ${isEq ? `<span class="st-thumb-check">✓</span>` : ''}
      </div>
      <div class="st-drawer-stage ${isBleed ? 'is-bleed' : ''}">
        ${renderDrawerVisualStage(cat.key, item)}
      </div>
    </div>`;
  }).join('') : `<div style="padding:32px 12px;text-align:center;color:#94A3B8;font-size:12px;">검색 결과 없음</div>`;

  if (hiddenBar) {
    const hiddenKeys = state.secOrder.filter(k => !state.secEnabled[k]);
    if (hiddenKeys.length > 0) {
      hiddenBar.style.display = 'flex';
      hiddenBar.innerHTML = hiddenKeys.map(k => {
        const customSec = state.customSections[k];
        const m = CATEGORIES.find(c => c.key === (customSec?.baseCatKey || k)) || { icon: '⬜', shortName: customSec?.title || '자유섹션' };
        return `<button type="button" onclick="restoreHiddenSection('${k}')" class="st-pill-btn" style="padding:3px 8px;font-size:11px;">+ ${m.icon} ${m.shortName}</button>`;
      }).join('');
    } else {
      hiddenBar.style.display = 'none';
    }
  }

  syncDrawerSectionZoom();
  initDrawerShaders(cardsEl);
}

function renderSidebarBody() {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.()) {
    const cardsEl = document.getElementById('st-drawer-cards');
    if (cardsEl) cardsEl.innerHTML = '';
    return;
  }
  const headEl = document.getElementById('st-drawer-cat-head');

  ['sections', 'components', 'themes'].forEach(g => {
    document.getElementById(`tray-tab-${g}`)?.classList.toggle('is-active', state.trayGroup === g);
  });

  const groupKeys = TRAY_GROUPS[state.trayGroup] || TRAY_GROUPS.sections;
  const chipsHTML = (state.trayGroup === 'sections'
    ? `<button type="button" onclick="selectSlotCategory('featured')" class="st-tray-chip ${state.activeCat === 'featured' && !state.drawerQuery ? 'is-active' : ''}">★ 인기 UI</button>`
    : '') + groupKeys.map(k => {
      const c = CATEGORIES.find(x => x.key === k);
      if (!c) return '';
      return `<button type="button" onclick="selectSlotCategory('${c.key}')" class="st-tray-chip ${state.activeCat === c.key && !state.drawerQuery ? 'is-active' : ''}">${c.icon} ${c.shortName}</button>`;
    }).join('');

  if (headEl) headEl.innerHTML = chipsHTML;
  renderDrawerCardsOnly();
}

/* ==========================================================================
   DIRECT ON-CANVAS UI SELECTION, 8-HANDLE RESIZE, SNAP GUIDES & INSPECTOR
   ========================================================================== */
function getElementPathInRoot(el) {
  const root = document.getElementById('hp-root');
  if (!el || !root) return '';
  const parts = [];
  let cur = el;
  while (cur && cur !== root && cur.parentElement) {
    if (cur.id && cur.id.startsWith('sec-')) {
      parts.unshift(`#${cur.id}`);
      break;
    }
    const siblings = Array.from(cur.parentElement.children || []);
    const idx = Math.max(0, siblings.indexOf(cur));
    parts.unshift(`${cur.tagName.toLowerCase()}:nth-child(${idx + 1})`);
    cur = cur.parentElement;
  }
  return parts.join('>');
}
globalThis.getElementPathInRoot = typeof window !== 'undefined' ? (window.getElementPathInRoot = getElementPathInRoot) : getElementPathInRoot;

function applyDimensionToFreeWidgetEl(el, wPx, hPx) {
  if (!el) return;
  if (wPx) el.style.width = `${Math.round(wPx)}px`;
  if (hPx) el.style.height = `${Math.round(hPx)}px`;
  const inner = el.children && el.children[0];
  if (inner && inner.style) {
    if (wPx) inner.style.width = '100%';
    if (hPx) inner.style.height = '100%';
    const media = inner.querySelector ? inner.querySelector('.f-media') : null;
    if (media && media.style && hPx) {
      media.style.width = '100%';
      media.style.height = '100%';
    }
  }
}

function applyStoredUIOffsets() {
  const root = document.getElementById('hp-root');
  if (!root || typeof root.querySelector !== 'function') return;

  // 1. Apply custom text edits (persisted from double-click inline editing)
  Object.entries(state.customTexts || {}).forEach(([path, htmlTxt]) => {
    if (!path) return;
    let el = null;
    try { el = root.querySelector(path); } catch (_) {}
    if (el && typeof htmlTxt === 'string') {
      el.innerHTML = htmlTxt;
    }
  });

  // 2. Apply custom uploaded / swapped photos (resolving deduplicated customAssets refs)
  Object.entries(state.customImages || {}).forEach(([path, rawSrc]) => {
    if (!path || !rawSrc) return;
    const src = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.resolveAssetRef)
      ? FORMA_PRO.ProjectState.resolveAssetRef(rawSrc)
      : rawSrc;
    let el = null;
    try { el = root.querySelector(path); } catch (_) {}
    if (!el) return;
    if (el.tagName === 'IMG') {
      el.src = src;
    } else {
      const img = el.querySelector ? el.querySelector('img') : null;
      if (img) img.src = src;
    }
  });

  // 3. Apply offsets, 8-handle width/height, custom colors, zIndex, and links
  Object.entries(state.uiOffsets || {}).forEach(([path, cfg]) => {
    if (!path) return;
    let el = null;
    try { el = root.querySelector(path); } catch (_) {}
    if (!el) return;
    if (cfg.hidden) {
      el.style.display = 'none';
      return;
    }
    if (cfg.width) el.style.width = `${Math.round(cfg.width)}px`;
    if (cfg.height) el.style.height = `${Math.round(cfg.height)}px`;
    if (cfg.bgColor) {
      el.style.backgroundColor = cfg.bgColor;
    }
    if (cfg.fgColor) {
      el.style.color = cfg.fgColor;
    }
    if (cfg.href) {
      el.dataset.customHref = cfg.href;
      if (el.tagName === 'A') el.setAttribute?.('href', cfg.href);
    }
    const x = cfg.x || 0;
    const y = cfg.y || 0;
    const sc = cfg.scale || 1;
    if (x !== 0 || y !== 0 || sc !== 1 || cfg.zIndex) {
      el.dataset.uiMoved = '1';
      if (!el.style.position) el.style.position = 'relative';
      el.style.zIndex = String(cfg.zIndex || 24);
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${sc})`;
    }
  });
}

function inferCategoryForCanvasElement(el) {
  if (!el) return 'hero';
  if (el.dataset?.freeCat && el.dataset.freeCat !== 'text') return el.dataset.freeCat;
  if (el.dataset?.freeCat === 'text') return 'font';
  if (el.classList?.contains('f-btn')) return 'button';
  if (el.classList?.contains('f-bdg')) return 'badge';
  if (el.classList?.contains('f-media')) return 'imgstyle';
  if (el.classList?.contains('f-card')) return 'surface';
  if (el.classList?.contains('f-input')) return 'inputui';
  if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') return 'font';
  const sec = el.closest?.('.f-sec-wrap');
  const secKey = sec?.dataset?.secKey || 'hero';
  return state.customSections[secKey]?.baseCatKey || secKey;
}

let selectedCanvasEl = null;

function setPrimarySelectedCanvasEl(el) {
  selectedCanvasEl = el || null;
  if (!el) {
    state.selectedFreeUid = null;
    state.selectedUIPath = null;
  } else if (el.classList?.contains('f-free-ui') || String(el.className || '').includes('f-free-ui')) {
    state.selectedFreeUid = el.dataset.uid;
    state.selectedUIPath = null;
  } else {
    state.selectedFreeUid = null;
    state.selectedUIPath = getElementPathInRoot(el);
  }
}
globalThis.setPrimarySelectedCanvasEl = typeof window !== 'undefined' ? (window.setPrimarySelectedCanvasEl = setPrimarySelectedCanvasEl) : setPrimarySelectedCanvasEl;

function hideMagneticSnapGuides() {
  const gx = document.getElementById('st-snap-guide-x');
  const gy = document.getElementById('st-snap-guide-y');
  if (gx) gx.style.display = 'none';
  if (gy) gy.style.display = 'none';
}

function syncSelectedUIOverlay() {
  const box = document.getElementById('st-ui-sel-box');
  const bar = document.getElementById('st-ui-toolbar');
  if (!box || !bar) return;

  const selEls = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.getSelectedElements)
    ? FORMA_PRO.SelectionEngine.getSelectedElements()
    : (selectedCanvasEl && selectedCanvasEl.isConnected ? [selectedCanvasEl] : []);

  if (selEls.length === 0 && (!selectedCanvasEl || !selectedCanvasEl.isConnected)) {
    box.style.display = 'none';
    bar.style.display = 'none';
    return;
  }

  const activeList = selEls.length > 0 ? selEls : [selectedCanvasEl];
  let minLeft = Infinity;
  let minTop = Infinity;
  let maxRight = -Infinity;
  let maxBottom = -Infinity;

  activeList.forEach(el => {
    if (!el || !el.isConnected) return;
    const er = el.getBoundingClientRect();
    if (er.width < 1 && er.height < 1) return;
    minLeft = Math.min(minLeft, er.left);
    minTop = Math.min(minTop, er.top);
    maxRight = Math.max(maxRight, er.right);
    maxBottom = Math.max(maxBottom, er.bottom);
  });

  if (!Number.isFinite(minLeft) || (maxRight - minLeft < 2 && maxBottom - minTop < 2)) {
    box.style.display = 'none';
    bar.style.display = 'none';
    return;
  }

  const unionW = maxRight - minLeft;
  const unionH = maxBottom - minTop;
  const z = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine?.getCanvasZoom)
    ? FORMA_PRO.ResponsiveEngine.getCanvasZoom()
    : (state.zoom || 1);

  box.style.display = 'block';
  box.style.left = `${minLeft - 4}px`;
  box.style.top = `${minTop - 4}px`;
  box.style.width = `${unionW + 8}px`;
  box.style.height = `${unionH + 8}px`;

  const sizeBadge = document.getElementById('st-ui-size-badge');
  if (sizeBadge) {
    sizeBadge.textContent = `${Math.round(unionW / z)} × ${Math.round(unionH / z)}`;
  }

  bar.style.display = 'inline-flex';
  const barH = bar.offsetHeight || 34;
  const barTop = minTop > (76 + barH + 12) ? (minTop - barH - 12) : (maxBottom + 28);
  const maxLeft = typeof window !== 'undefined' ? Math.max(12, window.innerWidth - 460) : 640;
  const barLeft = Math.max(12, Math.min(maxLeft, minLeft));
  bar.style.top = `${barTop}px`;
  bar.style.left = `${barLeft}px`;
}

function clearSelectedCanvasUI() {
  selectedCanvasEl = null;
  state.selectedUIPath = null;
  state.selectedFreeUid = null;
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.getSelection?.().length) {
    FORMA_PRO.SelectionEngine.clearSelection();
  } else if (typeof document !== 'undefined') {
    document.querySelectorAll?.('#hp-root [data-selected]').forEach(el => el.removeAttribute('data-selected'));
  }
  const box = document.getElementById('st-ui-sel-box');
  const bar = document.getElementById('st-ui-toolbar');
  const photoPop = document.getElementById('st-photo-popover');
  const mq = document.getElementById('st-marquee-box');
  if (box) box.style.display = 'none';
  if (bar) bar.style.display = 'none';
  if (photoPop) photoPop.classList.remove('is-open');
  if (mq) mq.style.display = 'none';
  hideMagneticSnapGuides();
}

function selectCanvasUIElement(el, opts = {}) {
  const photoPop = document.getElementById('st-photo-popover');
  if (photoPop) photoPop.classList.remove('is-open');
  if (!el) {
    clearSelectedCanvasUI();
    return;
  }
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine) {
    if (opts.toggle || opts.shiftKey) {
      FORMA_PRO.SelectionEngine.toggleSelection(el);
    } else {
      FORMA_PRO.SelectionEngine.selectSingle(el);
    }
    if (!selectedCanvasEl && el && el.isConnected !== false) {
      setPrimarySelectedCanvasEl(el);
      syncSelectedUIOverlay();
    }
    return;
  }
  setPrimarySelectedCanvasEl(el);
  syncSelectedUIOverlay();
}

function inspectSelectedUICategory() {
  if (!selectedCanvasEl) return;
  const catKey = inferCategoryForCanvasElement(selectedCanvasEl);
  focusDrawerCategory(catKey);
}

function scaleSelectedUI(delta) {
  if (!selectedCanvasEl) return;
  pushUndoSnapshot();
  if (state.selectedFreeUid) {
    const fw = state.freeWidgets.find(x => x.uid === state.selectedFreeUid);
    if (!fw) return;
    fw.scale = Math.max(0.5, Math.min(2.4, Number(((fw.scale || 1) + delta).toFixed(2))));
    selectedCanvasEl.style.transform = `scale(${fw.scale})`;
  } else if (state.selectedUIPath) {
    const cur = state.uiOffsets[state.selectedUIPath] || { x: 0, y: 0, scale: 1 };
    const nextScale = Math.max(0.5, Math.min(2.4, Number(((cur.scale || 1) + delta).toFixed(2))));
    state.uiOffsets[state.selectedUIPath] = { ...cur, scale: nextScale };
    selectedCanvasEl.dataset.uiMoved = '1';
    selectedCanvasEl.style.transform = `translate3d(${cur.x || 0}px, ${cur.y || 0}px, 0) scale(${nextScale})`;
  }
  syncSelectedUIOverlay();
}

/* 8-Direction Direct Width/Height Resize Helper (Programmatic + Handle Drag) */
function resizeSelectedUI(dw, dh, handle = 'se') {
  if (!selectedCanvasEl) return;
  pushUndoSnapshot();
  const r = selectedCanvasEl.getBoundingClientRect();
  let nw = Math.max(28, Math.round((r.width || 120) + dw));
  let nh = Math.max(20, Math.round((r.height || 44) + dh));

  if (state.selectedFreeUid) {
    const fw = state.freeWidgets.find(x => x.uid === state.selectedFreeUid);
    if (!fw) return;
    fw.width = nw;
    fw.height = nh;
    if (handle.includes('w')) {
      const secWrap = selectedCanvasEl.closest?.('.f-sec-wrap');
      const sw = Math.max(1, secWrap?.getBoundingClientRect()?.width || 856);
      fw.xPct = Math.max(0, Math.min(92, fw.xPct - (dw / sw) * 100));
      selectedCanvasEl.style.left = `${fw.xPct}%`;
    }
    if (handle.includes('n')) {
      fw.yPx = Math.max(0, Math.round(fw.yPx - dh));
      selectedCanvasEl.style.top = `${fw.yPx}px`;
    }
    applyDimensionToFreeWidgetEl(selectedCanvasEl, nw, nh);
  } else if (state.selectedUIPath) {
    const cur = state.uiOffsets[state.selectedUIPath] || { x: 0, y: 0, scale: 1 };
    const nx = handle.includes('w') ? Math.round((cur.x || 0) - dw) : (cur.x || 0);
    const ny = handle.includes('n') ? Math.round((cur.y || 0) - dh) : (cur.y || 0);
    state.uiOffsets[state.selectedUIPath] = { ...cur, x: nx, y: ny, width: nw, height: nh };
    selectedCanvasEl.style.width = `${nw}px`;
    selectedCanvasEl.style.height = `${nh}px`;
    selectedCanvasEl.dataset.uiMoved = '1';
    selectedCanvasEl.style.transform = `translate3d(${nx}px, ${ny}px, 0) scale(${cur.scale || 1})`;
  }
  if (selectedCanvasEl._rect) {
    selectedCanvasEl._rect = {
      ...selectedCanvasEl._rect,
      width: nw,
      height: nh,
      right: (selectedCanvasEl._rect.left || 0) + nw,
      bottom: (selectedCanvasEl._rect.top || 0) + nh
    };
  }
  syncSelectedUIOverlay();
}

/* Per-Element Custom Color, Layer (Z-Index), and Link Controls */
function setSelectedUICustomStyle(prop, val) {
  if (!selectedCanvasEl) return;
  pushUndoSnapshot();
  const targetVisual = selectedCanvasEl.classList?.contains('f-free-ui')
    ? (selectedCanvasEl.children?.[0] || selectedCanvasEl)
    : selectedCanvasEl;

  if (prop === 'bgColor') {
    targetVisual.style.backgroundColor = val;
  } else if (prop === 'fgColor') {
    targetVisual.style.color = val;
  }

  if (state.selectedFreeUid) {
    const fw = state.freeWidgets.find(x => x.uid === state.selectedFreeUid);
    if (fw) {
      fw[prop] = val;
      if (selectedCanvasEl.innerHTML) fw.customHTML = selectedCanvasEl.innerHTML;
    }
  } else if (state.selectedUIPath) {
    const cur = state.uiOffsets[state.selectedUIPath] || { x: 0, y: 0, scale: 1 };
    state.uiOffsets[state.selectedUIPath] = { ...cur, [prop]: val };
  }
  syncSelectedUIOverlay();
}

function shiftSelectedUILayer(dir) {
  if (!selectedCanvasEl) return;
  pushUndoSnapshot();
  if (state.selectedFreeUid) {
    const fw = state.freeWidgets.find(x => x.uid === state.selectedFreeUid);
    if (!fw) return;
    fw.zIndex = Math.max(5, Math.min(90, (fw.zIndex || 28) + dir * 5));
    selectedCanvasEl.style.zIndex = String(fw.zIndex);
    showStudioToast(dir > 0 ? '⬆ 요소를 앞으로 가져왔습니다.' : '⬇ 요소를 뒤로 보냈습니다.');
  } else if (state.selectedUIPath) {
    const cur = state.uiOffsets[state.selectedUIPath] || { x: 0, y: 0, scale: 1 };
    const nextZ = Math.max(5, Math.min(90, (cur.zIndex || 24) + dir * 5));
    state.uiOffsets[state.selectedUIPath] = { ...cur, zIndex: nextZ };
    if (!selectedCanvasEl.style.position) selectedCanvasEl.style.position = 'relative';
    selectedCanvasEl.style.zIndex = String(nextZ);
    showStudioToast(dir > 0 ? '⬆ 요소를 앞으로 가져왔습니다.' : '⬇ 요소를 뒤로 보냈습니다.');
  }
}

function setSelectedUILink(hrefVal) {
  if (!selectedCanvasEl) return;
  pushUndoSnapshot();
  const cleanHref = String(hrefVal || '').trim();
  if (state.selectedFreeUid) {
    const fw = state.freeWidgets.find(x => x.uid === state.selectedFreeUid);
    if (fw) fw.href = cleanHref;
    selectedCanvasEl.dataset.customHref = cleanHref;
  } else if (state.selectedUIPath) {
    const cur = state.uiOffsets[state.selectedUIPath] || { x: 0, y: 0, scale: 1 };
    state.uiOffsets[state.selectedUIPath] = { ...cur, href: cleanHref };
    selectedCanvasEl.dataset.customHref = cleanHref;
    if (selectedCanvasEl.tagName === 'A') selectedCanvasEl.setAttribute?.('href', cleanHref);
  }
  showStudioToast(cleanHref ? `🔗 클릭 이동 링크 설정 완료: ${cleanHref}` : '링크가 해제되었습니다.');
}

function promptSelectedUILink() {
  if (!selectedCanvasEl) return;
  openPhotoPickerForSelectedUI('link');
}

/* Unified Double-Click Inline Text Editing + Add Free Text Block & Box */
function startInlineTextEditOnElement(el) {
  if (!el) return;
  const editTarget = el.classList?.contains('f-free-ui')
    ? (el.querySelector?.('.f-h2, .f-card, h1, h2, h3, p, span, button, a, div') || el)
    : el;

  const origHTML = editTarget.innerHTML;
  editTarget.contentEditable = 'true';
  editTarget.dataset.liveEditing = '1';
  editTarget.focus?.();

  const syncLiveTextToState = () => {
    const freeWrap = editTarget.closest?.('.f-free-ui') || (el.classList?.contains('f-free-ui') ? el : null);
    if (freeWrap && freeWrap.dataset?.uid) {
      const fw = state.freeWidgets.find(x => x.uid === freeWrap.dataset.uid);
      if (fw) fw.customHTML = freeWrap.innerHTML;
    } else {
      const pathKey = getElementPathInRoot(editTarget);
      if (pathKey) state.customTexts[pathKey] = editTarget.innerHTML;
    }
  };

  editTarget.oninput = () => {
    syncLiveTextToState();
    FORMA_PRO.ProjectState?.scheduleAutosave?.();
  };

  let finished = false;
  const finishEdit = () => {
    if (finished) return;
    finished = true;
    editTarget.onblur = null;
    editTarget.oninput = null;
    editTarget.contentEditable = state.inlineEdit ? 'true' : 'false';
    delete editTarget.dataset.liveEditing;
    const newHTML = editTarget.innerHTML;
    if (newHTML !== origHTML) {
      // Temporarily restore origHTML so pushUndoSnapshot records the pre-edit state!
      editTarget.innerHTML = origHTML;
      const freeWrap0 = editTarget.closest?.('.f-free-ui') || (el.classList?.contains('f-free-ui') ? el : null);
      if (freeWrap0 && freeWrap0.dataset?.uid) {
        const fw0 = state.freeWidgets.find(x => x.uid === freeWrap0.dataset.uid);
        if (fw0) fw0.customHTML = freeWrap0.innerHTML;
      } else {
        const pk0 = getElementPathInRoot(editTarget);
        if (pk0) state.customTexts[pk0] = origHTML;
      }
      pushUndoSnapshot();
      editTarget.innerHTML = newHTML;
    }
    syncLiveTextToState();
    syncSelectedUIOverlay();
    if (state.inlineEdit) {
      bindEditablePersistenceInTextMode(document.getElementById('hp-root'));
    }
    FORMA_PRO.ProjectState?.scheduleAutosave?.();
  };

  editTarget.onblur = finishEdit;
}

function editSelectedUITextInline() {
  if (!selectedCanvasEl) return;
  startInlineTextEditOnElement(selectedCanvasEl);
  showStudioToast('✏️ 바로 타이핑하여 글자를 수정하세요! (바깥 클릭 시 자동 저장)');
}

function resolveDefaultFreeWidgetSecKey(targetSecKey) {
  if (targetSecKey) return targetSecKey;
  const fromSel = selectedCanvasEl?.closest?.('.f-sec-wrap')?.dataset?.secKey;
  if (fromSel) return fromSel;
  const visibleSecs = state.secOrder.filter(k => state.secEnabled[k]);
  if (state.lastAddedSecKey && visibleSecs.includes(state.lastAddedSecKey)) {
    return state.lastAddedSecKey;
  }
  const blankSec = [...visibleSecs].reverse().find(k => state.customSections?.[k]?.type === 'blank');
  if (blankSec) return blankSec;
  return (visibleSecs.includes('hero') ? 'hero' : visibleSecs[0]) || 'hero';
}

function addFreeTextBlock(targetSecKey, customText) {
  pushUndoSnapshot();
  const secKey = resolveDefaultFreeWidgetSecKey(targetSecKey);
  const idxInSec = state.freeWidgets.filter(w => w.secKey === secKey).length;
  const uid = 'fw-txt-' + Date.now() + '-' + Math.floor(Math.random() * 999);
  const label = customText || '더블클릭하여 타이틀 문구를 자유롭게 수정하세요';
  state.freeWidgets.push({
    uid,
    secKey,
    catKey: 'text',
    assetId: 'TXT-FREE',
    customHTML: `<div class="f-h2" style="padding:10px 16px;border-radius:10px;background:color-mix(in srgb, var(--surface) 82%, transparent);backdrop-filter:blur(8px);border:1px solid var(--border);color:var(--fg);font-size:24px;line-height:1.25;min-width:220px;box-shadow:0 12px 28px rgba(0,0,0,0.12);">${label}</div>`,
    xPct: 8 + (idxInSec % 3) * 14,
    yPx: 48 + Math.floor(idxInSec / 3) * 140,
    scale: 1,
    zIndex: 32
  });
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  const mounted = typeof document !== 'undefined' ? document.querySelector(`.f-free-ui[data-uid="${uid}"]`) : null;
  if (mounted) {
    mounted.scrollIntoView?.({ behavior: 'auto', block: 'nearest', inline: 'start' });
    const cf = document.getElementById('canvas-frame');
    if (cf) cf.scrollLeft = 0;
    selectCanvasUIElement(mounted);
  }
  showStudioToast('✨ 자유 텍스트 상자가 추가되었습니다! 원하는 곳으로 옮기거나 더블클릭해 수정하세요.');
  return uid;
}

function addFreeBoxWidget(targetSecKey) {
  pushUndoSnapshot();
  const secKey = resolveDefaultFreeWidgetSecKey(targetSecKey);
  const idxInSec = state.freeWidgets.filter(w => w.secKey === secKey).length;
  const uid = 'fw-box-' + Date.now() + '-' + Math.floor(Math.random() * 999);
  state.freeWidgets.push({
    uid,
    secKey,
    catKey: 'surface',
    assetId: state.equipped.surface,
    customHTML: `<div class="f-card" style="width:100%;height:100%;min-height:120px;border-radius:var(--radius,10px);background:color-mix(in srgb, var(--surface) 88%, transparent);backdrop-filter:blur(12px);border:1.5px solid var(--border);box-shadow:0 16px 36px rgba(0,0,0,0.14);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px;text-align:center;"><span class="f-mono" style="font-size:11px;color:var(--accent);font-weight:700;">FREE CONTAINER BOX</span><strong style="font-size:14px;margin-top:4px;color:var(--fg);">더블클릭하여 내용 편집</strong></div>`,
    xPct: 8 + (idxInSec % 3) * 14,
    yPx: 50 + Math.floor(idxInSec / 3) * 165,
    width: 240,
    height: 150,
    scale: 1,
    zIndex: 29
  });
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  const mounted = typeof document !== 'undefined' ? document.querySelector(`.f-free-ui[data-uid="${uid}"]`) : null;
  if (mounted) {
    mounted.scrollIntoView?.({ behavior: 'auto', block: 'nearest', inline: 'start' });
    const cf = document.getElementById('canvas-frame');
    if (cf) cf.scrollLeft = 0;
    selectCanvasUIElement(mounted);
  }
  showStudioToast('▢ 자유 컨테이너 박스가 추가되었습니다! 8방향 핸들로 크기를 조절하세요.');
  return uid;
}

/* Local PC Photo Upload & Studio HD Photo Picker */
let pendingImageUploadMode = 'selected'; // 'selected' | 'canvas'

function triggerPCImageUploadForCanvas() {
  pendingImageUploadMode = selectedCanvasEl ? 'selected' : 'canvas';
  const inp = document.getElementById('st-img-upload-input');
  if (inp) {
    inp.value = '';
    inp.click();
  }
}

function spawnFreeImageWidget(imgSrc, targetSecKey, xPct = 24, yPx = 56) {
  pushUndoSnapshot();
  const secKey = resolveDefaultFreeWidgetSecKey(targetSecKey);
  const imgCls = getAsset('imgstyle', state.equipped.imgstyle).cls;
  const uid = 'fw-img-' + Date.now() + '-' + Math.floor(Math.random() * 999);
  const resolvedSrc = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.resolveAssetRef)
    ? FORMA_PRO.ProjectState.resolveAssetRef(imgSrc)
    : imgSrc;
  state.freeWidgets.push({
    uid,
    secKey,
    catKey: 'imgstyle',
    assetId: state.equipped.imgstyle,
    assetRef: (typeof imgSrc === 'string' && imgSrc.startsWith('asset://')) ? imgSrc : undefined,
    customHTML: `<div class="${imgCls}" style="width:260px;height:180px;"><div class="f-media" style="width:100%;height:100%;"><img src="${resolvedSrc}" data-asset-ref="${(typeof imgSrc === 'string' && imgSrc.startsWith('asset://')) ? imgSrc : ''}" alt="Custom Photo" style="width:100%;height:100%;object-fit:cover;display:block;"/></div></div>`,
    xPct,
    yPx,
    scale: 1,
    width: 260,
    height: 180,
    zIndex: 30
  });
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  setTimeout(() => {
    const mounted = document.querySelector(`.f-free-ui[data-uid="${uid}"]`);
    if (mounted) selectCanvasUIElement(mounted);
  }, 25);
  showStudioToast('🖼 사진이 캔버스에 추가되었습니다! 모서리 핸들을 잡고 크기를 자유롭게 조절하세요.');
  return uid;
}

function applySelectedUIImage(imgSrc) {
  if (!imgSrc) return;
  const pop = document.getElementById('st-photo-popover');
  if (pop) pop.classList.remove('is-open');

  if (!selectedCanvasEl) {
    spawnFreeImageWidget(imgSrc);
    return;
  }

  pushUndoSnapshot();
  const imgEl = selectedCanvasEl.tagName === 'IMG'
    ? selectedCanvasEl
    : (selectedCanvasEl.querySelector ? selectedCanvasEl.querySelector('img') : null);

  if (imgEl) {
    const resolvedSrc = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.resolveAssetRef)
      ? FORMA_PRO.ProjectState.resolveAssetRef(imgSrc)
      : imgSrc;
    imgEl.src = resolvedSrc;
    if (typeof imgSrc === 'string' && imgSrc.startsWith('asset://')) {
      imgEl.setAttribute('data-asset-ref', imgSrc);
    }
    if (state.selectedFreeUid) {
      const fw = state.freeWidgets.find(x => x.uid === state.selectedFreeUid);
      if (fw) {
        if (typeof imgSrc === 'string' && imgSrc.startsWith('asset://')) {
          fw.assetRef = imgSrc;
          fw.customHTML = selectedCanvasEl.innerHTML.replace(/src="data:image\/[^"]+"/g, `src="${imgSrc}"`);
        } else {
          fw.customHTML = selectedCanvasEl.innerHTML;
        }
      }
    } else {
      const pathKey = getElementPathInRoot(imgEl) || state.selectedUIPath;
      if (pathKey) state.customImages[pathKey] = imgSrc;
    }
    showStudioToast('🖼 사진이 즉시 교체되었습니다!');
    syncSelectedUIOverlay();
    FORMA_PRO.ProjectState?.scheduleAutosave?.();
  } else {
    // Selected element has no <img> inside -> spawn a new free image right in the same section!
    const secKey = selectedCanvasEl.closest?.('.f-sec-wrap')?.dataset?.secKey;
    spawnFreeImageWidget(imgSrc, secKey);
  }
}

async function handleLocalImageFileSelect(ev) {
  const file = ev?.target?.files?.[0] || ev?.detail?.file || ev?.file;
  const directDataUrl = ev?.target?.dataset?.uploadedDataUrl || ev?.detail?.dataUrl || '';
  if (ev && ev.target && typeof ev.target.value === 'string') {
    try { ev.target.value = ''; } catch (_) {}
  }
  if (!file && !directDataUrl) return;
  let assetRefOrUrl = '';
  if (directDataUrl) {
    assetRefOrUrl = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.registerCustomAsset)
      ? FORMA_PRO.ProjectState.registerCustomAsset(directDataUrl)
      : directDataUrl;
  } else if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.compressAndStoreImageAsset) {
    assetRefOrUrl = await FORMA_PRO.ProjectState.compressAndStoreImageAsset(file);
  } else if (typeof FileReader !== 'undefined') {
    assetRefOrUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }
  if (!assetRefOrUrl) return;
  if (pendingImageUploadMode === 'selected' && selectedCanvasEl) {
    applySelectedUIImage(assetRefOrUrl);
  } else {
    spawnFreeImageWidget(assetRefOrUrl);
  }
}

function openPhotoPickerForSelectedUI(mode = 'photo') {
  const pop = document.getElementById('st-photo-popover');
  const bar = document.getElementById('st-ui-toolbar');
  if (!pop) return;
  if (pop.classList.contains('is-open') && pop.dataset.mode === mode) {
    pop.classList.remove('is-open');
    return;
  }
  pop.dataset.mode = mode;
  const br = bar?.getBoundingClientRect?.() || { left: 200, bottom: 120 };
  pop.style.left = `${Math.max(12, br.left)}px`;
  pop.style.top = `${(br.bottom || 120) + 8}px`;

  if (mode === 'link') {
    const curHref = selectedCanvasEl?.dataset?.customHref || '';
    pop.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong style="font-size:12px;color:#F8FAFC;">🔗 클릭 이동 링크 설정</strong>
        <button type="button" onclick="document.getElementById('st-photo-popover').classList.remove('is-open')" class="st-pill-btn" style="padding:2px 6px;">✕</button>
      </div>
      <div style="display:flex;gap:5px;">
        <input id="st-link-input" type="text" value="${curHref.replace(/"/g, '&quot;')}" placeholder="#/contact 또는 #sec-form" style="flex:1;background:#161B28;border:1px solid rgba(255,255,255,0.16);border-radius:7px;padding:6px 9px;color:#F8FAFC;font-size:12px;outline:none;" />
        <button type="button" onclick="setSelectedUILink(document.getElementById('st-link-input').value);document.getElementById('st-photo-popover').classList.remove('is-open');" class="st-pill-btn is-primary">적용</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;">
        ${[['#sec-hero','히어로'],['#sec-feature','핵심역량'],['#sec-pricing','요금표'],['#sec-form','예약/문의'],['#/contact','Contact 페이지']].map(([u, l]) => `
          <button type="button" onclick="setSelectedUILink('${u}');document.getElementById('st-photo-popover').classList.remove('is-open');" class="st-pill-btn" style="padding:3px 7px;font-size:11px;">${l}</button>
        `).join('')}
      </div>
    `;
    pop.classList.add('is-open');
    return;
  }

  const imgEntries = Object.entries(IMG || {});
  pop.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <strong style="font-size:12px;color:#F8FAFC;">🖼 사진 바로 교체 / 내 사진 업로드</strong>
      <button type="button" onclick="document.getElementById('st-photo-popover').classList.remove('is-open')" class="st-pill-btn" style="padding:2px 6px;">✕</button>
    </div>
    <button type="button" onclick="triggerPCImageUploadForCanvas()" class="st-pill-btn is-primary" style="width:100%;justify-content:center;padding:7px;">📁 내 컴퓨터에서 사진 파일 올리기...</button>
    <div style="font-size:11px;color:#94A3B8;font-weight:600;">또는 스튜디오 HD 화보 클릭 즉시 적용:</div>
    <div class="st-photo-grid">
      ${imgEntries.map(([k, src]) => `
        <button type="button" class="st-photo-thumb" onclick="applySelectedUIImage(IMG['${k}'])" title="${k}">
          <img src="${src}" alt="${k}" />
        </button>
      `).join('')}
    </div>
  `;
  pop.classList.add('is-open');
}

let copiedWidgetClipboard = null;

function hideCanvasContextMenu() {
  if (typeof document === 'undefined') return;
  const menu = document.getElementById('st-context-menu');
  if (menu) menu.style.display = 'none';
}

function copySelectedUI() {
  if (!selectedCanvasEl) return false;
  const secWrap = selectedCanvasEl.closest?.('.f-sec-wrap');
  const secKey = secWrap?.dataset?.secKey || 'hero';
  const sr = secWrap ? secWrap.getBoundingClientRect() : { left: 424, top: 100, width: 856, height: 400 };
  const er = selectedCanvasEl.getBoundingClientRect();
  const isFree = selectedCanvasEl.classList?.contains('f-free-ui');
  if (isFree && state.selectedFreeUid) {
    const fw = state.freeWidgets.find(x => x.uid === state.selectedFreeUid);
    if (fw) {
      copiedWidgetClipboard = deepCloneJSON(fw);
      return true;
    }
  }
  const cloneEl = selectedCanvasEl.cloneNode(true);
  cloneEl.removeAttribute('id');
  cloneEl.style.position = '';
  cloneEl.style.left = '';
  cloneEl.style.top = '';
  cloneEl.style.transform = '';
  copiedWidgetClipboard = {
    secKey,
    catKey: inferCategoryForCanvasElement(selectedCanvasEl),
    assetId: '',
    customHTML: isFree ? cloneEl.innerHTML : cloneEl.outerHTML,
    xPct: Math.max(2, Math.min(86, ((er.left - sr.left) / Math.max(1, sr.width)) * 100)),
    yPx: Math.max(8, Math.round(er.top - sr.top)),
    scale: 1
  };
  return true;
}

function pasteCopiedUI() {
  if (!copiedWidgetClipboard && selectedCanvasEl) {
    copySelectedUI();
  }
  if (!copiedWidgetClipboard) return null;
  pushUndoSnapshot();
  const uid = 'fw-' + Date.now() + '-' + Math.floor(Math.random() * 999);
  const nextWidget = {
    ...deepCloneJSON(copiedWidgetClipboard),
    uid,
    xPct: Math.max(2, Math.min(88, (copiedWidgetClipboard.xPct || 18) + 2.5)),
    yPx: Math.max(8, Math.round((copiedWidgetClipboard.yPx || 48) + 20))
  };
  state.freeWidgets.push(nextWidget);
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  const mounted = typeof document !== 'undefined' ? document.querySelector(`.f-free-ui[data-uid="${uid}"]`) : null;
  if (mounted) selectCanvasUIElement(mounted);
  return uid;
}

function nudgeSelectedUI(dx, dy) {
  const topEls = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.getTopLevelSelectedElements)
    ? FORMA_PRO.SelectionEngine.getTopLevelSelectedElements()
    : (selectedCanvasEl ? [selectedCanvasEl] : []);
  if (topEls.length === 0) return;

  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.syncFreeWidgetsFromDOM) {
    FORMA_PRO.SelectionEngine.syncFreeWidgetsFromDOM();
  }
  pushUndoSnapshot();

  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.moveElementByLogicalDelta) {
    topEls.forEach(el => FORMA_PRO.SelectionEngine.moveElementByLogicalDelta(el, dx, dy));
    FORMA_PRO.SelectionEngine.syncFreeWidgetsFromDOM();
  } else if (state.selectedFreeUid) {
    const fw = state.freeWidgets.find(x => x.uid === state.selectedFreeUid);
    if (fw) {
      const secWrap = selectedCanvasEl.closest?.('.f-sec-wrap');
      const sw = Math.max(1, secWrap?.getBoundingClientRect()?.width || 856);
      fw.xPct = Number((fw.xPct + (dx / sw) * 100).toFixed(4));
      fw.yPx = Math.round((fw.yPx || 0) + dy);
      selectedCanvasEl.style.left = `${fw.xPct}%`;
      selectedCanvasEl.style.top = `${fw.yPx}px`;
    }
  } else if (state.selectedUIPath) {
    const cur = state.uiOffsets[state.selectedUIPath] || { x: 0, y: 0, scale: 1 };
    const nx = (cur.x || 0) + dx;
    const ny = (cur.y || 0) + dy;
    state.uiOffsets[state.selectedUIPath] = { ...cur, x: nx, y: ny };
    selectedCanvasEl.dataset.uiMoved = '1';
    selectedCanvasEl.style.transform = `translate3d(${nx}px, ${ny}px, 0) scale(${cur.scale || 1})`;
  }
  syncSelectedUIOverlay();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
}

function duplicateSelectedUI() {
  if (!selectedCanvasEl) return;
  const secWrap = selectedCanvasEl.closest?.('.f-sec-wrap');
  if (!secWrap) return;
  pushUndoSnapshot();
  const sr = secWrap.getBoundingClientRect();
  const er = selectedCanvasEl.getBoundingClientRect();
  const xPct = Math.max(2, Math.min(86, ((er.left - sr.left + 22) / Math.max(1, sr.width)) * 100));
  const yPx = Math.max(8, Math.round(er.top - sr.top + 22));
  const isFree = selectedCanvasEl.classList?.contains('f-free-ui');
  const origFw = isFree && state.selectedFreeUid
    ? state.freeWidgets.find(x => x.uid === state.selectedFreeUid)
    : null;
  const cloneEl = selectedCanvasEl.cloneNode(true);
  cloneEl.removeAttribute('id');
  cloneEl.style.position = '';
  cloneEl.style.left = '';
  cloneEl.style.top = '';
  cloneEl.style.transform = '';
  const uid = 'fw-' + Date.now() + '-' + Math.floor(Math.random() * 999);
  state.freeWidgets.push({
    ...(origFw ? deepCloneJSON(origFw) : {}),
    uid,
    secKey: secWrap.dataset.secKey,
    catKey: origFw?.catKey || inferCategoryForCanvasElement(selectedCanvasEl),
    assetId: origFw?.assetId || '',
    customHTML: isFree ? (origFw?.customHTML || cloneEl.innerHTML) : cloneEl.outerHTML,
    xPct,
    yPx,
    scale: origFw?.scale || 1
  });
  renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
  const mounted = typeof document !== 'undefined' ? document.querySelector(`.f-free-ui[data-uid="${uid}"]`) : null;
  if (mounted) selectCanvasUIElement(mounted);
}

function resetSelectedUIPosition() {
  if (!selectedCanvasEl) return;
  pushUndoSnapshot();
  if (state.selectedFreeUid) {
    const fw = state.freeWidgets.find(x => x.uid === state.selectedFreeUid);
    if (fw) { fw.scale = 1; delete fw.width; delete fw.height; }
    renderLiveWebsite();
    FORMA_PRO.ProjectState?.scheduleAutosave?.();
    return;
  }
  if (state.selectedUIPath && state.uiOffsets[state.selectedUIPath]) {
    delete state.uiOffsets[state.selectedUIPath];
    delete selectedCanvasEl.dataset.uiMoved;
    selectedCanvasEl.style.transform = '';
    selectedCanvasEl.style.width = '';
    selectedCanvasEl.style.height = '';
    selectedCanvasEl.style.background = '';
    selectedCanvasEl.style.color = '';
    selectedCanvasEl.style.zIndex = '';
  }
  syncSelectedUIOverlay();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
}

function deleteSelectedUI() {
  const rawEls = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.getTopLevelSelectedElements)
    ? FORMA_PRO.SelectionEngine.getTopLevelSelectedElements()
    : (selectedCanvasEl ? [selectedCanvasEl] : []);
  const topEls = rawEls.filter(el => el && el.getAttribute?.('data-locked') !== 'true' && !el.closest?.('[data-locked="true"]'));
  if (topEls.length === 0) return;

  pushUndoSnapshot();
  let removedFree = false;
  topEls.forEach(el => {
    if (el.classList?.contains('f-free-ui') && el.dataset?.uid) {
      state.freeWidgets = state.freeWidgets.filter(x => x.uid !== el.dataset.uid);
      removedFree = true;
    } else {
      const pk = getElementPathInRoot(el);
      if (pk) {
        state.uiOffsets[pk] = { ...(state.uiOffsets[pk] || {}), hidden: true };
        el.style.display = 'none';
      }
    }
  });
  clearSelectedCanvasUI();
  if (removedFree) renderLiveWebsite();
  FORMA_PRO.ProjectState?.scheduleAutosave?.();
}

/* ==========================================================================
   60FPS LIVE UI CLONE DRAG & DROP + 8-HANDLE RESIZE + SMART SNAP GUIDES
   ========================================================================== */
function getMatchingCanvasSelector(catKey) {
  if (catKey === 'button') return '#hp-root .f-btn';
  if (catKey === 'surface') return '#hp-root .f-card';
  if (catKey === 'imgstyle') return '#hp-root .f-media';
  if (catKey === 'font' || catKey === 'textfx') return '#hp-root .f-h1, #hp-root .f-h2';
  if (catKey === 'inputui') return '#hp-root .f-input, #hp-root .f-switch';
  if (catKey === 'badge') return '#hp-root .f-bdg';
  return '';
}

function previewGlobalClassOnRoot(catKey, previewId) {
  const root = document.getElementById('hp-root');
  if (!root) return;
  const classSlots = ['palette', 'font', 'textfx', 'surface', 'imgstyle'];
  if (!classSlots.includes(catKey)) return;
  (VAULT[catKey] || []).forEach(it => {
    if (it.cls) it.cls.split(/\s+/).forEach(c => c && root.classList.remove(c));
  });
  const target = getAsset(catKey, previewId);
  if (target?.cls) {
    target.cls.split(/\s+/).forEach(c => c && root.classList.add(c));
  }
}

function clearAllDropHighlights() {
  document.getElementById('canvas-frame')?.classList.remove('is-drop-hot');
  const line = document.getElementById('st-sec-drop-line');
  if (line) line.style.display = 'none';
  hideMagneticSnapGuides();
  document.querySelectorAll?.('.is-drop-target-el').forEach(el => el.classList.remove('is-drop-target-el'));
  document.querySelectorAll?.('.is-sec-replace-target').forEach(el => el.classList.remove('is-sec-replace-target'));
  document.querySelectorAll?.('.is-being-dragged').forEach(el => el.classList.remove('is-being-dragged'));
}

function computeSectionDropTarget(clientY, draggedCatKey, isReorderOnly = false) {
  const frame = document.getElementById('canvas-frame');
  if (!frame || typeof frame.querySelectorAll !== 'function') return null;
  const secs = Array.from(frame.querySelectorAll('.f-sec-wrap[data-sec-key]'));
  if (!secs.length) return { mode: 'replace', refSecKey: draggedCatKey, pos: 'after', lineY: 140 };

  for (let i = 0; i < secs.length; i++) {
    const el = secs[i];
    const r = el.getBoundingClientRect();
    const sk = el.dataset.secKey;
    const baseSk = state.customSections[sk]?.baseCatKey || sk;
    if (clientY >= r.top && clientY <= r.bottom) {
      const rel = (clientY - r.top) / Math.max(1, r.height);
      if (!isReorderOnly && baseSk === draggedCatKey && state.customSections[sk]?.type !== 'blank' && rel > 0.2 && rel < 0.8) {
        return { mode: 'replace', el, refSecKey: sk };
      }
      const pos = rel < 0.5 ? 'before' : 'after';
      return { mode: 'insert', el, refSecKey: sk, pos, lineY: pos === 'before' ? r.top : r.bottom };
    }
  }
  const firstR = secs[0].getBoundingClientRect();
  if (clientY < firstR.top) {
    return { mode: 'insert', el: secs[0], refSecKey: secs[0].dataset.secKey, pos: 'before', lineY: firstR.top };
  }
  const last = secs[secs.length - 1];
  const lastR = last.getBoundingClientRect();
  return { mode: 'insert', el: last, refSecKey: last.dataset.secKey, pos: 'after', lineY: lastR.bottom };
}

function placeKeyRelative(orderArr, movingKey, refKey, pos) {
  if (!refKey || movingKey === refKey) return orderArr;
  const clean = orderArr.filter(k => k !== movingKey);
  const idx = clean.indexOf(refKey);
  if (idx < 0) {
    clean.push(movingKey);
    return clean;
  }
  clean.splice(pos === 'before' ? idx : idx + 1, 0, movingKey);
  return clean;
}

function mountLiveVisualGhost(catKey, item) {
  const ghost = document.getElementById('st-drag-ghost');
  if (!ghost) return;
  const baseCat = state.customSections[catKey]?.baseCatKey || catKey;
  const pal = getAsset('palette', state.equipped.palette);
  const fnt = getAsset('font', state.equipped.font);
  const srf = getAsset('surface', state.equipped.surface);
  const imgst = getAsset('imgstyle', state.equipped.imgstyle);
  const isSec = Boolean(state.customSections[catKey] || CATEGORIES.find(c => c.key === baseCat)?.group === 'section');
  ghost.className = `st-drag-ghost ${isSec ? 'is-sec-ghost' : ''} f-site ${pal.cls} ${fnt.cls} ${srf.cls} ${imgst.cls}`;
  ghost.innerHTML = renderDrawerVisualStage(baseCat, item || getAsset(baseCat, state.equipped[baseCat]));
}

let activePointerDrag = null;
let activeCanvasUIDrag = null;
let activeResizeDrag = null;
let activeSectionHeightDrag = null;

function startSectionReorderDrag(ev, secKey) {
  if (ev.button && ev.button !== 0) return;
  ev.preventDefault();
  ev.stopPropagation();
  clearSelectedCanvasUI();
  const baseCat = state.customSections[secKey]?.baseCatKey || secKey;
  const meta = CATEGORIES.find(c => c.key === baseCat) || CATEGORIES[13];
  const eq = getAsset(baseCat, state.customSections[secKey]?.assetId || state.equipped[baseCat]);
  mountLiveVisualGhost(secKey, eq);
  const secEl = document.getElementById('sec-' + secKey);
  if (secEl) secEl.style.opacity = '0.4';
  activePointerDrag = {
    kind: 'reorder',
    catKey: secKey,
    assetId: eq.id,
    meta,
    item: eq,
    secEl,
    startX: ev.clientX,
    startY: ev.clientY,
    moved: false,
    ghostMounted: true,
    secTarget: null
  };
}

function startSectionHeightResize(ev, secKey) {
  if (ev.button && ev.button !== 0) return;
  ev.preventDefault();
  ev.stopPropagation();
  clearSelectedCanvasUI();
  const secWrap = document.getElementById('sec-' + secKey);
  const innerSec = secWrap?.querySelector?.('.f-sec, .f-blank-sec') || secWrap;
  if (!innerSec) return;
  const r = innerSec.getBoundingClientRect();
  pushUndoSnapshot();
  activeSectionHeightDrag = {
    secKey,
    innerSec,
    startY: ev.clientY,
    origH: state.secHeights[secKey] || r.height || 360
  };
  document.body.classList.add('is-dragging');
}

function updateMagneticSnapGuides(el) {
  const gx = document.getElementById('st-snap-guide-x');
  const gy = document.getElementById('st-snap-guide-y');
  if (!gx || !gy || !el) return;
  const secWrap = el.closest?.('.f-sec-wrap');
  if (!secWrap) {
    hideMagneticSnapGuides();
    return;
  }
  const sr = secWrap.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  const elCx = er.left + er.width / 2;
  const elCy = er.top + er.height / 2;
  const secCx = sr.left + sr.width / 2;
  const secCy = sr.top + sr.height / 2;

  if (Math.abs(elCx - secCx) < 6) {
    gx.style.display = 'block';
    gx.style.left = `${Math.round(secCx)}px`;
  } else {
    gx.style.display = 'none';
  }

  if (Math.abs(elCy - secCy) < 6) {
    gy.style.display = 'block';
    gy.style.top = `${Math.round(secCy)}px`;
  } else {
    gy.style.display = 'none';
  }
}

function initDragAndDropSystem() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const frame = document.getElementById('canvas-frame');
  if (frame && typeof frame.addEventListener === 'function') {
    frame.addEventListener('scroll', syncSelectedUIOverlay);

    // Native File Drag-and-Drop from User's PC onto Canvas!
    frame.addEventListener('dragover', (e) => {
      if (e.dataTransfer?.types && Array.from(e.dataTransfer.types).includes('Files')) {
        e.preventDefault();
        frame.classList.add('is-drop-hot');
      }
    });
    frame.addEventListener('dragleave', () => {
      frame.classList.remove('is-drop-hot');
    });
    frame.addEventListener('drop', async (e) => {
      frame.classList.remove('is-drop-hot');
      const file = e.dataTransfer?.files?.[0];
      if (!file || !file.type?.startsWith('image/')) return;
      e.preventDefault();
      if (typeof FileReader === 'undefined') return;
      const hitEl = typeof document.elementFromPoint === 'function' ? document.elementFromPoint(e.clientX, e.clientY) : e.target;
      const hitMedia = hitEl?.closest?.('img, .f-media, .f-card, .f-free-ui');
      const hitSecWrap = hitEl?.closest?.('.f-sec-wrap');
      let assetRefOrUrl = '';
      if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.compressAndStoreImageAsset) {
        assetRefOrUrl = await FORMA_PRO.ProjectState.compressAndStoreImageAsset(file);
      } else {
        assetRefOrUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
      }
      if (!assetRefOrUrl) return;
      if (hitMedia) {
        selectCanvasUIElement(hitMedia);
        applySelectedUIImage(assetRefOrUrl);
      } else if (hitSecWrap) {
        const sr = hitSecWrap.getBoundingClientRect();
        const xPct = Math.max(4, Math.min(80, ((e.clientX - sr.left - 80) / Math.max(1, sr.width)) * 100));
        const yPx = Math.max(12, Math.round(e.clientY - sr.top - 50));
        spawnFreeImageWidget(assetRefOrUrl, hitSecWrap.dataset.secKey, xPct, yPx);
      } else {
        spawnFreeImageWidget(assetRefOrUrl);
      }
    });
  }

  // 0. 8-Handle Interactive Resize on #st-ui-sel-box (Zoom-aware delta / zoom math)
  const selBox = document.getElementById('st-ui-sel-box');
  if (selBox && typeof selBox.addEventListener === 'function') {
    selBox.addEventListener('pointerdown', (e) => {
      const hEl = e.target?.closest?.('.st-ui-sel-handle');
      if (!hEl || !selectedCanvasEl) return;
      if (selectedCanvasEl.getAttribute?.('data-locked') === 'true' || selectedCanvasEl.closest?.('[data-locked="true"]')) return;
      e.preventDefault();
      e.stopPropagation();
      if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.syncFreeWidgetsFromDOM) {
        FORMA_PRO.SelectionEngine.syncFreeWidgetsFromDOM();
      }
      const handle = hEl.dataset?.handle || 'se';
      const z = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine?.getCanvasZoom)
        ? FORMA_PRO.ResponsiveEngine.getCanvasZoom()
        : (state.zoom || 1);
      const r = selectedCanvasEl.getBoundingClientRect();
      const isFree = selectedCanvasEl.classList?.contains('f-free-ui');
      const secWrap = selectedCanvasEl.closest?.('.f-blank-sec, .f-sec-wrap') || document.getElementById('hp-root');
      const secRect = secWrap ? secWrap.getBoundingClientRect() : { left: 424, top: 100, width: 856, height: 400 };
      const fw = isFree ? state.freeWidgets.find(x => x.uid === selectedCanvasEl.dataset.uid) : null;
      const pathKey = !isFree ? (state.selectedUIPath || getElementPathInRoot(selectedCanvasEl)) : null;
      const prevCfg = pathKey ? (state.uiOffsets[pathKey] || { x: 0, y: 0, scale: 1 }) : {};

      const origW = Math.max(28, selectedCanvasEl.offsetWidth || Math.round((r.width || 140) / z));
      const origH = Math.max(20, selectedCanvasEl.offsetHeight || Math.round((r.height || 44) / z));
      const origLeftPx = isFree
        ? ((selectedCanvasEl.style.left && selectedCanvasEl.style.left.endsWith('px'))
            ? parseFloat(selectedCanvasEl.style.left)
            : (r.left - secRect.left) / z)
        : 0;
      const origTopPx = isFree
        ? ((selectedCanvasEl.style.top && selectedCanvasEl.style.top.endsWith('px'))
            ? parseFloat(selectedCanvasEl.style.top)
            : (r.top - secRect.top) / z)
        : 0;

      activeResizeDrag = {
        el: selectedCanvasEl,
        handle,
        zoom: z,
        isFree,
        fw,
        pathKey,
        secRect,
        startX: e.clientX,
        startY: e.clientY,
        origW,
        origH,
        origX: prevCfg.x || 0,
        origY: prevCfg.y || 0,
        origLeftPx,
        origTopPx,
        origXPct: fw ? fw.xPct : 10,
        origYPx: fw ? fw.yPx : 20,
        scale: prevCfg.scale || 1,
        moved: false
      };
    });
  }

  // 1. Left Visual UI Tray -> Drag Actual UI Clone onto Live Webpage!
  const drawerCards = document.getElementById('st-drawer-cards');
  if (drawerCards) {
    drawerCards.addEventListener('dragstart', (e) => e.preventDefault());
    drawerCards.addEventListener('pointerdown', (e) => {
      if (e.button && e.button !== 0) return;
      if (e.target.closest?.('.st-no-drag')) return;
      const card = e.target.closest?.('.st-drag-card');
      if (!card) return;
      const catKey = card.dataset.cat;
      const assetId = card.dataset.id;
      const meta = CATEGORIES.find(c => c.key === catKey);
      const item = getAsset(catKey, assetId);
      if (!meta || !item) return;

      activePointerDrag = {
        kind: 'asset',
        cardEl: card,
        catKey,
        assetId,
        origAssetId: state.equipped[catKey],
        meta,
        item,
        pointerType: e.pointerType || 'mouse',
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        ghostMounted: false,
        overCanvas: false,
        secTarget: null
      };
    });
  }

  // 2. Direct On-Canvas UI Manipulation: Grab & Move ANY UI Element right on the Webpage (+ Double-Click to Edit Text)!
  const mount = document.getElementById('website-mount');
  if (frame && typeof frame.addEventListener === 'function') {
    frame.addEventListener('pointerdown', (e) => {
      if (e.button && e.button !== 0) return;
      if (e.target === frame || e.target.id === 'canvas-zoom-sizer' || e.target.id === 'canvas-zoom-stage') {
        hideCanvasContextMenu();
        if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.startMarqueeSelection) {
          FORMA_PRO.SelectionEngine.startMarqueeSelection(e);
        } else {
          clearSelectedCanvasUI();
        }
      }
    });
  }

  if (mount) {
    mount.addEventListener('dragstart', (e) => e.preventDefault());

    // Double-Click on ANY Text/Heading/Button/Widget -> Immediate Inline Text Edit!
    mount.addEventListener('dblclick', (e) => {
      if (state.presentation || (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.())) return;
      if (e.target.closest?.('.f-sec-pill, .f-sec-resize-bar')) return;
      const editable = e.target.closest?.('.f-free-ui, h1, h2, h3, h4, p, .f-lead, .f-btn, .f-bdg, blockquote, li, a')
        || e.target.closest?.('span');
      if (!editable) return;
      e.preventDefault();
      e.stopPropagation();
      selectCanvasUIElement(editable);
      startInlineTextEditOnElement(editable);
    });

    // Right-Click on Canvas UI Element -> Open Context Menu (#st-context-menu)
    mount.addEventListener('contextmenu', (e) => {
      if (state.presentation || (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.())) return;
      const target = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.resolveSelectableTarget)
        ? FORMA_PRO.SelectionEngine.resolveSelectableTarget(e.target)
        : e.target.closest?.('.f-free-ui, .f-btn, .f-bdg, .f-media, .f-input, h1, h2, h3, p, .f-lead, .f-card');
      if (!target) {
        hideCanvasContextMenu();
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine && !FORMA_PRO.SelectionEngine.isSelectedElement(target)) {
        selectCanvasUIElement(target);
      } else if (!selectedCanvasEl) {
        selectCanvasUIElement(target);
      }
      const menu = document.getElementById('st-context-menu');
      if (menu) {
        menu.style.display = 'flex';
        const mx = Math.max(8, Math.min((window.innerWidth || 1280) - 170, e.clientX));
        const my = Math.max(8, Math.min((window.innerHeight || 800) - 160, e.clientY));
        menu.style.left = `${mx}px`;
        menu.style.top = `${my}px`;
      }
    });

    mount.addEventListener('pointerdown', (e) => {
      hideCanvasContextMenu();
      if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.()) return;
      if (!state.canvasMoveMode || state.inlineEdit || state.presentation) return;
      if (e.button && e.button !== 0) return;
      if (e.target.closest?.('.f-sec-pill, .f-sec-resize-bar')) return;
      if (e.target.closest?.('[data-live-editing="1"]')) return;

      if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.syncFreeWidgetsFromDOM) {
        FORMA_PRO.SelectionEngine.syncFreeWidgetsFromDOM();
      }

      const selEngine = typeof FORMA_PRO !== 'undefined' ? FORMA_PRO.SelectionEngine : null;
      const movable = selEngine
        ? selEngine.resolveSelectableTarget(e.target)
        : e.target.closest?.('.f-free-ui, .f-btn, .f-bdg, .f-media, .f-input, h1, h2, h3, p, .f-lead, .f-card');

      if (!movable) {
        e.preventDefault();
        if (selEngine) {
          selEngine.startMarqueeSelection(e);
        } else {
          clearSelectedCanvasUI();
        }
        return;
      }

      // Prevent native button clicks / text selection while moving UI directly
      e.preventDefault();

      if (selEngine) {
        if (e.shiftKey) {
          selEngine.toggleSelection(movable);
          if (!selEngine.isSelectedElement(movable)) {
            return;
          }
        } else if (!selEngine.isSelectedElement(movable)) {
          selEngine.selectSingle(movable);
        } else {
          setPrimarySelectedCanvasEl(movable);
          syncSelectedUIOverlay();
        }
      } else {
        selectCanvasUIElement(movable);
      }

      const z = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine?.getCanvasZoom)
        ? FORMA_PRO.ResponsiveEngine.getCanvasZoom()
        : (state.zoom || 1);
      const vp = state.viewport || 'desktop';
      const topEls = selEngine ? selEngine.getTopLevelSelectedElements() : [movable];
      const dragItems = topEls.map((itemEl) => {
        const isFree = itemEl.classList?.contains('f-free-ui');
        const secWrap = itemEl.closest?.('.f-blank-sec, .f-sec-wrap') || document.getElementById('hp-root');
        const sr = secWrap ? secWrap.getBoundingClientRect() : { left: 424, top: 100, width: 856, height: 400 };
        const er = itemEl.getBoundingClientRect();
        if (isFree) {
          const fw = state.freeWidgets.find(x => x.uid === itemEl.dataset.uid);
          const origX = (itemEl.style.left && itemEl.style.left.endsWith('px'))
            ? parseFloat(itemEl.style.left)
            : (er.left - sr.left) / z;
          const origY = (itemEl.style.top && itemEl.style.top.endsWith('px'))
            ? parseFloat(itemEl.style.top)
            : (er.top - sr.top) / z;
          return {
            el: itemEl,
            isFree: true,
            fw,
            secRect: sr,
            origX,
            origY,
            origXPct: fw ? fw.xPct : 10,
            origYPx: fw ? fw.yPx : 20
          };
        }
        const pathKey = getElementPathInRoot(itemEl);
        if (vp !== 'desktop' && typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine) {
          const patch = FORMA_PRO.ResponsiveEngine.getElementPatch(itemEl, vp);
          return {
            el: itemEl,
            isFree: false,
            pathKey,
            origX: Number(patch.x) || 0,
            origY: Number(patch.y) || 0,
            scale: Number(patch.scale) || 1
          };
        }
        const prev = state.uiOffsets[pathKey] || { x: 0, y: 0, scale: 1 };
        return {
          el: itemEl,
          isFree: false,
          pathKey,
          origX: prev.x || 0,
          origY: prev.y || 0,
          scale: prev.scale || 1
        };
      });

      const primaryRect = movable.getBoundingClientRect();
      activeCanvasUIDrag = {
        el: movable,
        origRect: {
          left: primaryRect.left,
          top: primaryRect.top,
          right: primaryRect.right,
          bottom: primaryRect.bottom,
          width: primaryRect.width,
          height: primaryRect.height
        },
        items: dragItems,
        zoom: z,
        viewport: vp,
        startX: e.clientX,
        startY: e.clientY,
        shiftKey: Boolean(e.shiftKey),
        moved: false
      };
    });

    // Block accidental button onclick execution right after dragging a UI element on canvas, OR navigate multi-page links on clean click
    mount.addEventListener('click', (e) => {
      if (mount._suppressClickUntil && Date.now() < mount._suppressClickUntil) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const pageLink = e.target.closest?.('[data-page-link], [data-page-slug], a[href^="#/"]');
      if (pageLink && !e.target.closest?.('[data-live-editing="1"]')) {
        const slug = pageLink.getAttribute('data-page-link')
          || pageLink.getAttribute('data-page-slug')
          || (pageLink.getAttribute('href') || '').replace(/^#\/?/, '');
        if (slug && typeof formaNavigatePage === 'function') {
          formaNavigatePage(slug, e);
          return;
        }
      }
    }, true);
  }

  window.addEventListener('pointermove', (e) => {
    // 0-0. Rubber-Band Marquee Multi-Selection!
    if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.isMarqueeActive?.()) {
      FORMA_PRO.SelectionEngine.updateMarqueeSelection(e);
      return;
    }

    // 0-A. Dragging Section Bottom Height Resize Handle!
    if (activeSectionHeightDrag) {
      const sd = activeSectionHeightDrag;
      const dy = e.clientY - sd.startY;
      const nh = Math.max(120, Math.min(1800, Math.round(sd.origH + dy)));
      state.secHeights[sd.secKey] = nh;
      sd.innerSec.style.minHeight = `${nh}px`;
      sd.innerSec.style.height = `${nh}px`;
      return;
    }

    // 0-B. Dragging an 8-Direction Resize Handle on Selected UI Element! (Exact delta / zoom math)
    if (activeResizeDrag) {
      const rd = activeResizeDrag;
      const rawDx = e.clientX - rd.startX;
      const rawDy = e.clientY - rd.startY;
      if (!rd.moved) {
        if (Math.hypot(rawDx, rawDy) < 2) return;
        rd.moved = true;
        pushUndoSnapshot();
        document.body.classList.add('is-dragging');
      }
      const z = rd.zoom || 1;
      const dxLogical = rawDx / z;
      const dyLogical = rawDy / z;

      let nw = rd.origW;
      let nh = rd.origH;
      if (rd.handle.includes('e')) nw = Math.max(28, Math.round(rd.origW + dxLogical));
      if (rd.handle.includes('w')) nw = Math.max(28, Math.round(rd.origW - dxLogical));
      if (rd.handle.includes('s')) nh = Math.max(20, Math.round(rd.origH + dyLogical));
      if (rd.handle.includes('n')) nh = Math.max(20, Math.round(rd.origH - dyLogical));

      if (rd.isFree && rd.fw) {
        rd.fw.width = nw;
        rd.fw.height = nh;
        if (rd.handle.includes('w')) {
          const swLogical = Math.max(1, rd.secRect.width / z);
          const nextLeft = Math.max(0, Math.round(rd.origLeftPx + dxLogical));
          rd.fw.x = nextLeft;
          rd.fw.xPct = Number(((nextLeft / swLogical) * 100).toFixed(4));
          rd.el.style.left = `${nextLeft}px`;
        }
        if (rd.handle.includes('n')) {
          const nextTop = Math.max(0, Math.round(rd.origTopPx + dyLogical));
          rd.fw.y = nextTop;
          rd.fw.yPx = nextTop;
          rd.el.style.top = `${nextTop}px`;
        }
        applyDimensionToFreeWidgetEl(rd.el, nw, nh);
      } else if (rd.pathKey) {
        const cur = state.uiOffsets[rd.pathKey] || { x: 0, y: 0, scale: rd.scale };
        const nx = rd.handle.includes('w') ? Math.round(rd.origX + dxLogical) : rd.origX;
        const ny = rd.handle.includes('n') ? Math.round(rd.origY + dyLogical) : rd.origY;
        state.uiOffsets[rd.pathKey] = { ...cur, x: nx, y: ny, width: nw, height: nh };
        rd.el.style.width = `${nw}px`;
        rd.el.style.height = `${nh}px`;
        rd.el.dataset.uiMoved = '1';
        rd.el.style.transform = `translate3d(${nx}px, ${ny}px, 0) scale(${rd.scale})`;
      }
      if (rd.el._rect) {
        rd.el._rect = { ...rd.el._rect, width: nw, height: nh, right: (rd.el._rect.left || 0) + nw, bottom: (rd.el._rect.top || 0) + nh };
      }
      syncSelectedUIOverlay();
      FORMA_PRO.ResponsiveEngine?.syncInspectorInputsFromSelected?.();
      return;
    }

    // A. Moving On-Canvas UI Element(s) Directly (Single or Group Drag + True Magnetic Snapping + delta / zoom)!
    if (activeCanvasUIDrag) {
      const cd = activeCanvasUIDrag;
      const rawDx = e.clientX - cd.startX;
      const rawDy = e.clientY - cd.startY;
      if (!cd.moved) {
        if (Math.hypot(rawDx, rawDy) < 3) return;
        cd.moved = true;
        pushUndoSnapshot();
        document.body.classList.add('is-dragging');
      }

      const z = cd.zoom || 1;
      const snap = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.computeMagneticSnap)
        ? FORMA_PRO.SelectionEngine.computeMagneticSnap(cd.el, cd.origRect, rawDx, rawDy, z, e.altKey)
        : { dxScreen: 0, dyScreen: 0, snappedX: false, snappedY: false };

      const finalDxLogical = (rawDx + (snap.dxScreen || 0)) / z;
      const finalDyLogical = (rawDy + (snap.dyScreen || 0)) / z;

      (cd.items || []).forEach((it) => {
        if (it.isFree) {
          const nx = Number((it.origX + finalDxLogical).toFixed(2));
          const ny = Number((it.origY + finalDyLogical).toFixed(2));
          it.el.style.left = `${nx}px`;
          it.el.style.top = `${ny}px`;
          if (it.fw) {
            const swLogical = Math.max(1, it.secRect.width / z);
            it.fw.x = nx;
            it.fw.y = ny;
            it.fw.yPx = Math.round(ny);
            it.fw.xPct = Number(((nx / swLogical) * 100).toFixed(4));
          }
          if (cd.viewport !== 'desktop') {
            FORMA_PRO.ResponsiveEngine?.setElementPatch?.(it.el, cd.viewport, { x: nx, y: ny });
          }
        } else if (cd.viewport !== 'desktop' && typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine) {
          const nx = Math.round(it.origX + finalDxLogical);
          const ny = Math.round(it.origY + finalDyLogical);
          FORMA_PRO.ResponsiveEngine.setElementPatch(it.el, cd.viewport, { x: nx, y: ny });
        } else if (it.pathKey) {
          let nx = Math.round(it.origX + finalDxLogical);
          let ny = Math.round(it.origY + finalDyLogical);
          if (!e.altKey && !snap.snappedX && Math.abs(nx) < 4) nx = 0;
          if (!e.altKey && !snap.snappedY && Math.abs(ny) < 4) ny = 0;
          const prev = state.uiOffsets[it.pathKey] || {};
          state.uiOffsets[it.pathKey] = { ...prev, x: nx, y: ny, scale: it.scale };
          it.el.dataset.uiMoved = '1';
          if (!it.el.style.position) it.el.style.position = 'relative';
          it.el.style.zIndex = String(prev.zIndex || 25);
          it.el.style.transform = `translate3d(${nx}px, ${ny}px, 0) scale(${it.scale})`;
        }
      });

      syncSelectedUIOverlay();
      FORMA_PRO.ResponsiveEngine?.syncInspectorInputsFromSelected?.();
      return;
    }

    // B. Dragging a Live Visual UI Thumbnail from Tray or Section Handle
    if (!activePointerDrag) return;
    const d = activePointerDrag;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    if (!d.moved) {
      if (Math.hypot(dx, dy) < 6) return;
      if (d.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.3) {
        activePointerDrag = null;
        return;
      }
      d.moved = true;
      clearSelectedCanvasUI();
      document.body.classList.add('is-dragging');
      if (d.cardEl) d.cardEl.classList.add('is-being-dragged');
      if (!d.ghostMounted) {
        mountLiveVisualGhost(d.catKey, d.item);
        d.ghostMounted = true;
      }
      if (d.kind === 'asset' && d.meta.group === 'global') {
        const sel = getMatchingCanvasSelector(d.catKey);
        if (sel) document.querySelectorAll(sel).forEach(el => el.classList.add('is-drop-target-el'));
      }
    }

    const ghost = document.getElementById('st-drag-ghost');
    const cFrame = document.getElementById('canvas-frame');
    const dropLine = document.getElementById('st-sec-drop-line');
    const dropLineLbl = document.getElementById('st-sec-drop-label');
    if (!cFrame) return;

    const fr = cFrame.getBoundingClientRect();
    const insideFrame = e.clientX >= fr.left && e.clientX <= fr.right && e.clientY >= fr.top && e.clientY <= fr.bottom;
    d.overCanvas = insideFrame;

    if (insideFrame) {
      if (e.clientY < fr.top + 64) cFrame.scrollTop -= 12;
      else if (e.clientY > fr.bottom - 64) cFrame.scrollTop += 12;
    }

    if (ghost) {
      ghost.style.display = 'flex';
      const isSecGhost = d.meta?.group === 'section';
      const gx = isSecGhost ? Math.max(10, e.clientX - 150) : (e.clientX - 40);
      const gy = isSecGhost ? Math.max(10, e.clientY - 46) : (e.clientY - 24);
      ghost.style.transform = `translate3d(${gx}px, ${gy}px, 0) scale(0.96)`;
      ghost.classList.toggle('is-ready', insideFrame);
    }

    document.querySelectorAll?.('.is-sec-replace-target').forEach(el => el.classList.remove('is-sec-replace-target'));
    if (dropLine) dropLine.style.display = 'none';

    if (!insideFrame) {
      cFrame.classList.remove('is-drop-hot');
      if (d.kind === 'asset' && d.meta.group === 'global') {
        previewGlobalClassOnRoot(d.catKey, d.origAssetId);
      }
      d.secTarget = null;
      return;
    }

    if (d.kind === 'reorder') {
      cFrame.classList.add('is-drop-hot');
      const st = computeSectionDropTarget(e.clientY, d.catKey, true);
      d.secTarget = st;
      if (st && dropLine) {
        dropLine.style.display = 'flex';
        dropLine.style.top = `${Math.max(fr.top + 24, Math.min(fr.bottom - 24, st.lineY))}px`;
        dropLine.style.left = `${fr.left + 20}px`;
        dropLine.style.width = `${fr.width - 40}px`;
        if (dropLineLbl) dropLineLbl.textContent = '+';
      }
    } else if (d.meta.group === 'global') {
      cFrame.classList.add('is-drop-hot');
      previewGlobalClassOnRoot(d.catKey, d.assetId);
    } else {
      cFrame.classList.add('is-drop-hot');
      const st = computeSectionDropTarget(e.clientY, d.catKey, false);
      d.secTarget = st;
      if (st?.mode === 'replace' && st.el) {
        st.el.classList.add('is-sec-replace-target');
      } else if (st && dropLine) {
        dropLine.style.display = 'flex';
        dropLine.style.top = `${Math.max(fr.top + 24, Math.min(fr.bottom - 24, st.lineY))}px`;
        dropLine.style.left = `${fr.left + 20}px`;
        dropLine.style.width = `${fr.width - 40}px`;
        if (dropLineLbl) dropLineLbl.textContent = '+';
      }
    }
  });

  const finishPointerDrag = (ev) => {
    if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.isMarqueeActive?.()) {
      const wasActive = FORMA_PRO.SelectionEngine.finishMarqueeSelection();
      if (wasActive && mount) {
        mount._suppressClickUntil = Date.now() + 180;
      }
      return;
    }

    if (activeSectionHeightDrag) {
      activeSectionHeightDrag = null;
      document.body.classList.remove('is-dragging');
      FORMA_PRO.ProjectState?.scheduleAutosave?.();
      showStudioToast('↕ 섹션 높이가 조절되었습니다.');
      return;
    }

    if (activeResizeDrag) {
      const rd = activeResizeDrag;
      activeResizeDrag = null;
      document.body.classList.remove('is-dragging');
      hideMagneticSnapGuides();
      if (rd.moved) {
        if (mount) mount._suppressClickUntil = Date.now() + 180;
        FORMA_PRO.ProjectState?.scheduleAutosave?.();
      }
      syncSelectedUIOverlay();
      return;
    }

    if (activeCanvasUIDrag) {
      const cd = activeCanvasUIDrag;
      activeCanvasUIDrag = null;
      document.body.classList.remove('is-dragging');
      hideMagneticSnapGuides();
      if (cd.moved) {
        if (mount) mount._suppressClickUntil = Date.now() + 180;
        FORMA_PRO.ProjectState?.scheduleAutosave?.();
      } else if (!cd.shiftKey && typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine) {
        if (FORMA_PRO.SelectionEngine.getSelection().length > 1) {
          FORMA_PRO.SelectionEngine.selectSingle(cd.el);
        }
      }
      syncSelectedUIOverlay();
      return;
    }

    if (!activePointerDrag) return;
    const d = activePointerDrag;
    activePointerDrag = null;

    document.body.classList.remove('is-dragging');
    if (d.secEl) d.secEl.style.opacity = '';
    const ghost = document.getElementById('st-drag-ghost');
    if (ghost) ghost.style.display = 'none';
    clearAllDropHighlights();

    // Simple click in Left Tray -> apply immediately!
    if (!d.moved) {
      if (d.kind === 'asset') {
        pushUndoSnapshot();
        equipAsset(d.catKey, d.assetId);
      }
      return;
    }

    if (!d.overCanvas) {
      if (d.kind === 'asset' && d.meta.group === 'global') {
        previewGlobalClassOnRoot(d.catKey, d.origAssetId);
      }
      return;
    }

    if (d.kind === 'reorder') {
      if (d.secTarget?.refSecKey && d.secTarget.refSecKey !== d.catKey) {
        pushUndoSnapshot();
        state.secOrder = placeKeyRelative(state.secOrder, d.catKey, d.secTarget.refSecKey, d.secTarget.pos);
        renderSidebarBody();
        renderLiveWebsite();
        setTimeout(() => {
          const movedEl = document.getElementById('sec-' + d.catKey);
          movedEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          movedEl?.classList.add('is-just-applied');
        }, 40);
      }
      return;
    }

    if (d.meta.group === 'global') {
      previewGlobalClassOnRoot(d.catKey, d.origAssetId);
    }

    // Check if user dropped a standalone Component UI onto open space inside a section to place a freely-movable UI widget!
    const placeableComp = ['button', 'surface', 'inputui', 'imgstyle', 'badge'].includes(d.catKey);
    const dropX = ev?.clientX ?? d.lastX;
    const dropY = ev?.clientY ?? d.lastY;
    if (placeableComp && typeof document.elementFromPoint === 'function') {
      const hitEl = document.elementFromPoint(dropX, dropY);
      const matchSel = d.catKey === 'button' ? '.f-btn'
        : d.catKey === 'surface' ? '.f-card'
        : d.catKey === 'imgstyle' ? '.f-media'
        : d.catKey === 'badge' ? '.f-bdg'
        : '.f-input, .f-switch';
      const hitExistingMatch = hitEl?.closest?.(matchSel);
      const hitSecWrap = hitEl?.closest?.('.f-sec-wrap');

      if (!hitExistingMatch && hitSecWrap) {
        pushUndoSnapshot();
        const sr = hitSecWrap.getBoundingClientRect();
        const xPct = Math.max(2, Math.min(84, ((dropX - sr.left - 36) / Math.max(1, sr.width)) * 100));
        const yPx = Math.max(8, Math.round(dropY - sr.top - 18));
        const uid = 'fw-' + Date.now() + '-' + Math.floor(Math.random() * 999);
        state.freeWidgets.push({
          uid,
          secKey: hitSecWrap.dataset.secKey,
          catKey: d.catKey,
          assetId: d.assetId,
          customHTML: null,
          xPct,
          yPx,
          scale: 1
        });
        renderLiveWebsite();
        setTimeout(() => {
          const placed = document.querySelector(`.f-free-ui[data-uid="${uid}"]`);
          if (placed) selectCanvasUIElement(placed);
        }, 25);
        return;
      }
    }

    pushUndoSnapshot();
    if (d.meta.group === 'section') {
      // If replacing a cloned section instance, update that clone's assetId directly
      const targetSecKey = d.secTarget?.refSecKey;
      if (d.secTarget?.mode === 'replace' && targetSecKey && state.customSections[targetSecKey]?.type === 'clone') {
        state.customSections[targetSecKey].assetId = d.assetId;
        renderLiveWebsite();
        return;
      }
      state.secEnabled[d.catKey] = true;
      if (d.secTarget?.mode === 'insert' && d.secTarget.refSecKey && d.secTarget.refSecKey !== d.catKey) {
        state.secOrder = placeKeyRelative(state.secOrder, d.catKey, d.secTarget.refSecKey, d.secTarget.pos);
      }
    }
    equipAsset(d.catKey, d.assetId);
  };

  window.addEventListener('pointerup', finishPointerDrag);
  window.addEventListener('pointercancel', finishPointerDrag);
}

/* ==========================================================================
   RENDER FULL LIVE WEBSITE + BLANK CANVAS SECTIONS + HEIGHT RESIZE HANDLES
   ========================================================================== */
function makeSectionHoverPill(secKey) {
  const customSec = state.customSections[secKey];
  const baseCat = customSec ? customSec.baseCatKey : secKey;
  const eq = getAsset(baseCat, customSec?.assetId || state.equipped[baseCat]);
  return `<div class="f-sec-pill" contenteditable="false">
    <button type="button" onpointerdown="startSectionReorderDrag(event, '${secKey}')" style="cursor:grab;background:rgba(56,189,248,0.28);color:#E0F2FE;" title="잡고 끌어서 섹션 순서 이동">⠿</button>
    <button type="button" onclick="moveSectionOrder('${secKey}', -1)" title="위로">↑</button>
    <button type="button" onclick="moveSectionOrder('${secKey}', 1)" title="아래로">↓</button>
    <button type="button" onclick="duplicateSectionInstance('${secKey}')" title="이 섹션을 아래에 하나 더 복제">⎘ 복제</button>
    <button type="button" onclick="addBlankCanvasSection('${secKey}')" style="color:#6EE7B7;" title="이 섹션 아래에 빈 자유 캔버스 섹션 추가">+ ⬜ 빈섹션</button>
    ${customSec?.type !== 'blank' ? `<button type="button" onclick="focusDrawerCategory('${baseCat}')" title="이 섹션 다른 UI 보기">🎨</button>` : ''}
    ${customSec?.type !== 'blank' ? `<button type="button" onclick="openSingleAssetCode('${baseCat}', '${eq.id}')" title="코드">&lt;/&gt;</button>` : ''}
    <button type="button" onclick="hideSectionWithUndo('${secKey}')" style="background:rgba(239,68,68,0.25);color:#FCA5A5;" title="섹션 숨기기">✕</button>
  </div>`;
}

function renderPreloaderChrome(pre) {
  let html = '';
  if (pre.mode === 'laser' || pre.mode === 'combo') {
    html += `<div id="hp-scroll-laser" class="f-scroll-laser"></div>`;
  }
  if (pre.mode === 'pctpill') {
    html += `<div style="position:sticky;top:14px;z-index:45;display:flex;justify-content:flex-end;pointer-events:none;padding:0 18px;margin-bottom:-34px;">
      <span id="hp-scroll-pct-pill" class="f-mono" style="padding:4px 10px;border-radius:999px;background:var(--fg);color:var(--bg);font-size:12px;font-weight:700;box-shadow:0 8px 20px rgba(0,0,0,0.2);">SCROLL 00%</span>
    </div>`;
  }
  if (pre.mode === 'dotrail' || pre.mode === 'combo') {
    const navSecs = [
      ['sec-hero', '히어로'],
      ['sec-feature', '핵심역량'],
      ['sec-process', '프로세스'],
      ['sec-gallery', '컬렉션'],
      ['sec-team', '디렉터'],
      ['sec-pricing', '요금안내'],
      ['sec-form', '예약문의']
    ];
    html += `<div class="hide-narrow" style="position:sticky;top:38%;z-index:44;float:right;margin-right:14px;display:flex;flex-direction:column;gap:9px;padding:10px 6px;border-radius:999px;background:color-mix(in srgb, var(--surface) 80%, transparent);backdrop-filter:blur(10px);border:1px solid var(--border);">
      ${navSecs.map(([id, lbl], i) => `<button type="button" title="${lbl}" onclick="document.getElementById('${id}')?.scrollIntoView({behavior:'smooth'})" style="width:9px;height:9px;padding:0;border-radius:999px;border:none;background:${i===0?'var(--accent)':'var(--sub)'};opacity:${i===0?'1':'0.55'};cursor:pointer;"></button>`).join('')}
    </div>`;
  }
  return html;
}

function triggerIntroCurtain(modeOverride) {
  const root = document.getElementById('hp-root');
  if (!root) return;
  const w = getCurrentWorldObj();
  const pre = getAsset('preloader', state.equipped.preloader);
  const mode = modeOverride || (pre.mode.includes('Curtain') ? pre.mode : 'splitCurtain');

  document.getElementById('hp-live-curtain')?.remove();
  const wrap = document.createElement('div');
  wrap.id = 'hp-live-curtain';
  wrap.className = 'f-intro-curtain';

  if (mode === 'monogramCurtain') {
    wrap.innerHTML = `
      <div style="flex:1;background:#090A0E;color:#F8F6F2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;">
        <div class="f-mono" style="font-size:12px;letter-spacing:0.24em;color:var(--accent);">${w.edition}</div>
        <div style="font-family:var(--font-display);font-size:clamp(2.2rem,5vw,4rem);font-weight:700;letter-spacing:0.12em;">${w.brand}</div>
        <div style="width:120px;height:2px;background:var(--accent);"></div>
      </div>`;
  } else if (mode === 'shutterCurtain') {
    wrap.innerHTML = [0, 1, 2, 3].map(i => `
      <div style="flex:1;background:#0B0D13;border-right:1px solid rgba(255,255,255,0.08);animation:curtainLeft 1.35s cubic-bezier(0.76,0,0.24,1) ${i * 90}ms forwards;display:flex;align-items:flex-end;padding:24px;">
        <span class="f-mono" style="font-size:12px;color:rgba(255,255,255,0.45);">0${i + 1}</span>
      </div>`).join('');
  } else {
    wrap.innerHTML = `
      <div style="flex:1;background:#0A0B0F;border-right:1px solid rgba(255,255,255,0.12);animation:curtainLeft 1.45s cubic-bezier(0.76,0,0.24,1) forwards;display:flex;align-items:center;justify-content:flex-end;padding-right:24px;color:#F8FAFC;">
        <span style="font-family:var(--font-display);font-size:26px;font-weight:700;">${w.brand}</span>
      </div>
      <div style="flex:1;background:#0A0B0F;animation:curtainRight 1.45s cubic-bezier(0.76,0,0.24,1) forwards;display:flex;align-items:center;justify-content:flex-start;padding-left:24px;color:var(--accent);">
        <span id="curtain-cnt" class="f-mono" style="font-size:22px;font-weight:700;">00%</span>
      </div>`;
  }

  root.appendChild(wrap);
  const cnt = document.getElementById('curtain-cnt');
  if (cnt) {
    let v = 0;
    const iv = setInterval(() => {
      v = Math.min(100, v + 17);
      cnt.textContent = (v < 100 ? '0' : '') + v + '%';
      if (v >= 100) clearInterval(iv);
    }, 65);
  }
  setTimeout(() => wrap.remove(), 1950);
}

function renderLiveWebsite() {
  globalThis._suppressDOMToFreeWidgetSync = true;
  const w      = getCurrentWorldObj();
  const pal    = getAsset('palette',   state.equipped.palette);
  const shd    = getAsset('shader',    state.equipped.shader);
  const fnt    = getAsset('font',      state.equipped.font);
  const tfx    = getAsset('textfx',    state.equipped.textfx);
  const btn    = getAsset('button',    state.equipped.button);
  const srf    = getAsset('surface',   state.equipped.surface);
  const imgst  = getAsset('imgstyle',  state.equipped.imgstyle);
  const inp    = getAsset('inputui',   state.equipped.inputui);
  const mot    = getAsset('motion',    state.equipped.motion);
  const bdg    = getAsset('badge',     state.equipped.badge);
  const pre    = getAsset('preloader', state.equipped.preloader);
  const wgt    = getAsset('widget',    state.equipped.widget);

  const secPy = state.tokens.density === 'compact' ? '52px' : (state.tokens.density === 'editorial' ? '104px' : '76px');
  const customPaletteCSS = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.BrandRestyler?.buildCustomPaletteStyleString)
    ? FORMA_PRO.BrandRestyler.buildCustomPaletteStyleString(state.tokens)
    : (state.tokens.customAccent ? `--accent:${state.tokens.customAccent};` : '');
  const tokenStyle = `--radius:${state.tokens.radius}px; --sec-py:${secPy}; --grain-op:${state.tokens.grain}; ${customPaletteCSS}`;

  const doc = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.getDoc) ? FORMA_PRO.ProjectState.getDoc() : null;
  const activePage = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.getActivePage) ? FORMA_PRO.ProjectState.getActivePage() : null;
  const activeSlug = activePage?.slug || 'home';

  const ctx = {
    bdgCls: bdg.cls,
    tfxId: tfx.id,
    btn: (label) => btn.render(label),
    pages: doc?.pages || null,
    activePageSlug: activeSlug
  };

  const renderedSections = state.secOrder
    .filter(secKey => state.secEnabled[secKey])
    .map(secKey => {
      const customSec = state.customSections[secKey];
      const customH = state.secHeights[secKey];
      let html = '';

      const secFreeWidgets = state.freeWidgets
        .filter(fw => fw.secKey === secKey)
        .map(fw => {
          const rawInner = fw.customHTML || renderFreeComponentHTML(fw.catKey, getAsset(fw.catKey, fw.assetId));
          const inner = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.resolveAssetRef)
            ? FORMA_PRO.ProjectState.resolveAssetRef(rawInner)
            : rawInner;
          const leftVal = Number.isFinite(fw.x) ? `${fw.x}px` : `${fw.xPct}%`;
          const topVal = `${Number.isFinite(fw.y) ? fw.y : fw.yPx}px`;
          const sizeStyle = `${fw.width ? `width:${Math.round(fw.width)}px;` : ''}${fw.height ? `height:${Math.round(fw.height)}px;` : ''}${fw.zIndex ? `z-index:${fw.zIndex};` : ''}${fw.hidden ? 'display:none;' : ''}`;
          const lockAttr = fw.locked ? ' data-locked="true"' : '';
          const hidAttr = fw.hidden ? ' data-hidden="true"' : '';
          const extraAttrs = fw.e2eAttrs
            ? Object.entries(fw.e2eAttrs).map(([k, v]) => ` ${k}="${String(v).replace(/"/g, '&quot;')}"`).join('')
            : '';
          return `<div class="f-free-ui" data-uid="${fw.uid}" data-f-el="fw::${fw.uid}" data-free-cat="${fw.catKey}"${lockAttr}${hidAttr}${extraAttrs} ${fw.href ? `data-custom-href="${fw.href}"` : ''} style="left:${leftVal};top:${topVal};transform:scale(${fw.scale || 1});transform-origin:top left;${sizeStyle}">${inner}</div>`;
        }).join('');

      if (customSec?.type === 'blank') {
        const hasPlaced = state.freeWidgets.some(fw => fw.secKey === secKey);
        html = `<section class="f-blank-sec" style="min-height:${customH || 440}px;position:relative;">
          ${!hasPlaced ? `<div class="f-blank-guide">
            <div class="f-mono" style="font-size:11px;color:var(--accent);font-weight:700;">FREEFORM ARTBOARD SECTION</div>
            <strong style="display:block;font-size:15px;margin:6px 0 4px;">자유 배치 캔버스 섹션</strong>
            <span style="font-size:12px;color:var(--sub);">왼쪽 패널에서 버튼·카드·사진·인풋 UI를 끌어다 원하는 위치에 놓거나, 상단 [+ T 텍스트] · [+ 🖼 내 사진]을 눌러 자유롭게 꾸미세요.</span>
          </div>` : ''}
          ${secFreeWidgets}
        </section>`;
        return `<div id="sec-${secKey}" data-sec-key="${secKey}" class="f-sec-wrap">
          ${makeSectionHoverPill(secKey)}
          ${html}
          <div class="f-sec-resize-bar" onpointerdown="startSectionHeightResize(event, '${secKey}')" title="위아래로 드래그하여 섹션 높이 조절"><span>↕ 높이 조절</span></div>
        </div>`;
      } else {
        const baseCat = customSec ? customSec.baseCatKey : secKey;
        const mod = getAsset(baseCat, customSec?.assetId || state.equipped[baseCat]);
        html = mod ? mod.render(w, ctx) : '';
      }
      if (!html) return '';

      return `<div id="sec-${secKey}" data-sec-key="${secKey}" class="f-sec-wrap" ${customH && customSec?.type !== 'blank' ? `style="min-height:${customH}px;"` : ''}>
        ${makeSectionHoverPill(secKey)}
        ${html}
        ${secFreeWidgets}
        <div class="f-sec-resize-bar" onpointerdown="startSectionHeightResize(event, '${secKey}')" title="위아래로 드래그하여 섹션 높이 조절"><span>↕ 높이 조절</span></div>
      </div>`;
    }).join('\n');

  const mount = document.getElementById('website-mount');
  if (!mount) return;

  const activeVp = state.viewport || 'desktop';
  const respCSS = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine?.compileResponsiveCSS)
    ? FORMA_PRO.ResponsiveEngine.compileResponsiveCSS()
    : '';
  mount.innerHTML = `
    <div id="hp-root" data-viewport="${activeVp}" data-active-page="${activeSlug}" class="f-site ${pal.cls} ${shd.cls || ''} ${fnt.cls} ${tfx.cls} ${srf.cls} ${imgst.cls} ${inp.cls || ''} ${mot.cls} ${state.guidesOn ? 'guides-on' : ''} ${state.canvasMoveMode && !state.inlineEdit ? 'is-move-mode' : ''} ${state.inlineEdit ? 'is-editing' : ''}" style="${tokenStyle}">
      <style id="hp-responsive-overrides">${respCSS}</style>
      ${renderPreloaderChrome(pre)}
      <canvas id="hp-shader-canvas" class="f-shader-layer"></canvas>
      <div class="f-grain-overlay"></div>
      <div class="f-content-layer">
        ${renderedSections}
        ${wgt.render(w, ctx)}
      </div>
      <div id="floating-work-preview" style="position:fixed;top:0;left:0;width:290px;aspect-ratio:16/10;border-radius:12px;overflow:hidden;pointer-events:none;z-index:90;opacity:0;transform:translate(-50%,-50%) scale(0.9);transition:opacity 0.22s ease, transform 0.22s ease;box-shadow:0 26px 60px rgba(0,0,0,0.45);border:1px solid rgba(255,255,255,0.2);">
        <img id="floating-work-img" src="${IMG[w.heroImg]}" alt="Preview" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
    </div>
  `;
  globalThis._suppressDOMToFreeWidgetSync = false;
  const rootEl = document.getElementById('hp-root');
  if (rootEl) {
    if (rootEl.dataset) {
      rootEl.dataset.viewport = activeVp;
      rootEl.dataset.activePage = activeSlug;
    }
    rootEl.setAttribute?.('data-viewport', activeVp);
    rootEl.setAttribute?.('data-active-page', activeSlug);
    rootEl.setAttribute?.('style', tokenStyle);
  }

  applyStoredUIOffsets();
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ResponsiveEngine) {
    FORMA_PRO.ResponsiveEngine.stampSelectableElements?.(rootEl);
    FORMA_PRO.ResponsiveEngine.applyResponsiveState?.(rootEl);
    FORMA_PRO.ResponsiveEngine.ensureInspectorMounted?.();
    FORMA_PRO.ResponsiveEngine.bindCanvasWheelZoom?.();
  }
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.InspectorUI) {
    FORMA_PRO.InspectorUI.applyStoredLayerStatesToDOM?.(rootEl);
    FORMA_PRO.InspectorUI.renderInspector?.();
    FORMA_PRO.InspectorUI.renderLayerTree?.();
    FORMA_PRO.InspectorUI.syncSelectionUI?.();
  }
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.InteractionsEngine) {
    FORMA_PRO.InteractionsEngine.applyInteractionsToDOM?.(rootEl);
  }
  if (state.inlineEdit) {
    bindEditablePersistenceInTextMode(document.getElementById('hp-root'));
  }
  initShaderEngine(shd.mode);
  bindLivePhysics();
  initScrollChoreography();
}

/* ==========================================================================
   INTERACTIVE SECTION WIDGET HANDLERS
   ========================================================================== */
function swapHeroEdition(idx) {
  const w = getCurrentWorldObj();
  const wk = w.works[idx];
  if (!wk) return;
  const img = document.getElementById('hero-cfg-img');
  const title = document.getElementById('hero-cfg-title');
  const price = document.getElementById('hero-cfg-price');
  if (img) img.src = IMG[wk.img];
  if (title) title.textContent = wk.title;
  if (price) price.textContent = wk.price;
  document.querySelectorAll('.hero-ed-btn').forEach(b => {
    const on = Number(b.dataset.idx) === idx;
    b.style.background = on ? 'var(--accent-soft)' : 'var(--surface)';
    b.style.borderColor = on ? 'var(--accent)' : 'var(--border)';
  });
}

function swapFeatShowcase(idx) {
  const w = getCurrentWorldObj();
  const f = w.features[idx];
  if (!f) return;
  const img = document.getElementById('feat-swap-img');
  const cap = document.getElementById('feat-swap-caption');
  const code = document.getElementById('feat-swap-code');
  if (img) img.src = IMG[f.img];
  if (cap) cap.textContent = f.title;
  if (code) code.textContent = `PLATE 0${idx + 1} / 04`;
  document.querySelectorAll('.feat-swap-row').forEach(r => {
    const on = Number(r.dataset.idx) === idx;
    r.style.borderColor = on ? 'var(--accent)' : 'var(--border)';
    r.style.background = on ? 'var(--surface)' : 'transparent';
  });
}

function switchFeatTab(idx) {
  const w = getCurrentWorldObj();
  const f = w.features[idx];
  if (!f) return;
  const img = document.getElementById('ftab-img');
  const tag = document.getElementById('ftab-tag');
  const title = document.getElementById('ftab-title');
  const desc = document.getElementById('ftab-desc');
  if (img) img.src = IMG[f.img];
  if (tag) tag.textContent = `${f.code} // ${f.tag}`;
  if (title) title.textContent = f.title;
  if (desc) desc.textContent = f.desc;
  document.querySelectorAll('.feat-tab-pill').forEach(b => {
    const on = Number(b.dataset.idx) === idx;
    b.style.background = on ? 'var(--fg)' : 'transparent';
    b.style.color = on ? 'var(--bg)' : 'var(--sub)';
  });
}

function switchProcessStep(idx) {
  const w = getCurrentWorldObj();
  const st = w.steps[idx];
  const f = w.features[idx % w.features.length];
  if (!st) return;
  const ph = document.getElementById('pro-sw-phase');
  const tt = document.getElementById('pro-sw-title');
  const ds = document.getElementById('pro-sw-desc');
  const im = document.getElementById('pro-sw-img');
  if (ph) ph.textContent = `STEP ${st.step} // ${st.phase}`;
  if (tt) tt.textContent = st.title;
  if (ds) ds.textContent = st.desc;
  if (im && f) im.src = IMG[f.img];
  document.querySelectorAll('.pro-step-tab').forEach(b => {
    const on = Number(b.dataset.idx) === idx;
    b.style.borderColor = on ? 'var(--accent)' : 'var(--border)';
    b.style.background = on ? 'var(--accent-soft)' : 'var(--surface)';
  });
}

function scrubProcessTimeline(idx) {
  const w = getCurrentWorldObj();
  const st = w.steps[idx];
  if (!st) return;
  const pct = document.getElementById('pro-scrub-pct');
  const tt = document.getElementById('pro-scrub-title');
  const ds = document.getElementById('pro-scrub-desc');
  if (pct) pct.textContent = `STAGE 0${idx + 1} · ${(idx + 1) * 25}%`;
  if (tt) tt.textContent = st.title;
  if (ds) ds.textContent = st.desc;
}

function swapGalleryMaster(idx) {
  const w = getCurrentWorldObj();
  const wk = w.works[idx];
  if (!wk) return;
  const im = document.getElementById('gal-stage-main');
  const tt = document.getElementById('gal-stage-title');
  const mt = document.getElementById('gal-stage-meta');
  if (im) im.src = IMG[wk.img];
  if (tt) tt.textContent = wk.title;
  if (mt) mt.textContent = `${wk.meta} · ${wk.price}`;
}

function switchTeamMember(idx) {
  const w = getCurrentWorldObj();
  const m = w.team[idx];
  if (!m) return;
  const im = document.getElementById('tem-sw-img');
  const rl = document.getElementById('tem-sw-role');
  const nm = document.getElementById('tem-sw-name');
  const bi = document.getElementById('tem-sw-bio');
  const cr = document.getElementById('tem-sw-cred');
  if (im) im.src = IMG[m.img];
  if (rl) rl.textContent = m.role;
  if (nm) nm.textContent = m.name;
  if (bi) bi.textContent = m.bio;
  if (cr) cr.textContent = m.cred;
  document.querySelectorAll('.tem-switch-btn').forEach(b => {
    const on = Number(b.dataset.idx) === idx;
    b.style.borderColor = on ? 'var(--accent)' : 'var(--border)';
    b.style.background = on ? 'var(--accent-soft)' : 'var(--surface)';
  });
}

function switchPlanInspector(idx) {
  const w = getCurrentWorldObj();
  const p = w.plans[idx];
  if (!p) return;
  const tr = document.getElementById('prc-in-tier');
  const nm = document.getElementById('prc-in-name');
  const ds = document.getElementById('prc-in-desc');
  const pk = document.getElementById('prc-in-perks');
  const pr = document.getElementById('prc-in-price');
  if (tr) tr.textContent = p.tier;
  if (nm) nm.textContent = p.name;
  if (ds) ds.textContent = p.desc;
  if (pk) pk.textContent = p.perks.map(k => '✓ ' + k).join('   ·   ');
  if (pr) pr.textContent = p.monthly;
  document.querySelectorAll('.prc-insp-btn').forEach(b => {
    const on = Number(b.dataset.idx) === idx;
    b.style.borderColor = on ? 'var(--accent)' : 'var(--border)';
    b.style.background = on ? 'var(--accent)' : 'var(--surface)';
    b.style.color = on ? 'var(--accent-fg)' : 'var(--fg)';
  });
}

function filterGalleryItems(cat) {
  document.querySelectorAll('.gal-filter-btn').forEach(b => {
    const on = b.dataset.cat === cat;
    b.style.background = on ? 'var(--fg)' : 'var(--surface)';
    b.style.color = on ? 'var(--bg)' : 'var(--sub)';
    b.style.borderColor = on ? 'var(--fg)' : 'var(--border)';
  });
  document.querySelectorAll('.gal-work-card').forEach(card => {
    const show = cat === 'ALL' || card.dataset.cat === cat;
    card.style.display = show ? '' : 'none';
  });
}

function toggleBillingCycle(cycle) {
  const mBtn = document.getElementById('bill-btn-m');
  const aBtn = document.getElementById('bill-btn-a');
  if (mBtn && aBtn) {
    mBtn.style.background = cycle === 'monthly' ? 'var(--fg)' : 'transparent';
    mBtn.style.color = cycle === 'monthly' ? 'var(--bg)' : 'var(--sub)';
    aBtn.style.background = cycle === 'annual' ? 'var(--fg)' : 'transparent';
    aBtn.style.color = cycle === 'annual' ? 'var(--bg)' : 'var(--sub)';
  }
  document.querySelectorAll('.f-price-val').forEach(el => {
    el.textContent = cycle === 'annual' ? el.dataset.annual : el.dataset.monthly;
  });
}

function stepReviewSlider(dir) {
  const w = getCurrentWorldObj();
  state.reviewIdx = (state.reviewIdx + dir + w.reviews.length) % w.reviews.length;
  const rv = w.reviews[state.reviewIdx];
  const q = document.getElementById('rev-slider-quote');
  const a = document.getElementById('rev-slider-author');
  const ix = document.getElementById('rev-slider-idx');
  if (q) q.textContent = `"${rv.quote}"`;
  if (a) a.innerHTML = `${rv.author} — <span style="color:var(--sub);font-weight:500;">${rv.role}</span>`;
  if (ix) ix.textContent = `0${state.reviewIdx + 1} / 0${w.reviews.length}`;
}

function selectFormPlan(idx, price) {
  const est = document.getElementById('frm-est-price');
  if (est) est.textContent = price;
  document.querySelectorAll('.frm-plan-chip').forEach(b => {
    const on = Number(b.dataset.idx) === idx;
    b.style.borderColor = on ? 'var(--accent)' : 'var(--border)';
    b.style.background = on ? 'var(--accent-soft)' : 'var(--bg)';
  });
}

function openImageLightbox(imgKey, title, meta) {
  const lb = document.getElementById('lightbox-modal');
  const im = document.getElementById('lightbox-img');
  const tt = document.getElementById('lightbox-title');
  const mt = document.getElementById('lightbox-meta');
  if (!lb || !im) return;
  im.src = IMG[imgKey] || IMG.courtyard;
  if (tt) tt.textContent = title;
  if (mt) mt.textContent = meta;
  lb.classList.add('is-open');
}

/* ==========================================================================
   WEB AUDIO AMBIENT SOUNDSCAPE SYNTHESIZER (WGT-05 — Zero External Audio!)
   ========================================================================== */
let ambientAudio = null;

function toggleAmbientSynth(btn) {
  const lbl = btn?.querySelector('.st-lbl');
  if (ambientAudio && ambientAudio.playing) {
    ambientAudio.gain.gain.setTargetAtTime(0.0001, ambientAudio.ctx.currentTime, 0.25);
    setTimeout(() => {
      try { ambientAudio.ctx.close(); } catch (_) {}
      ambientAudio = null;
    }, 350);
    if (lbl) lbl.textContent = 'AMBIENT SOUND · CLICK TO PLAY';
    showStudioToast('앰비언트 사운드스케이프를 정지했습니다.');
    return;
  }
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!AC) {
    showStudioToast('브라우저 오디오 컨텍스트를 지원하지 않습니다.');
    return;
  }
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.2);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(620, ctx.currentTime);

  // Warm Fmaj9 architectural chord (F3, A3, C4, E4, G4)
  [174.61, 220.0, 261.63, 329.63, 392.0].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.detune.setValueAtTime((idx - 2) * 4, ctx.currentTime);
    osc.connect(filter);
    osc.start();
  });

  filter.connect(master);
  master.connect(ctx.destination);
  ambientAudio = { ctx, gain: master, playing: true };
  if (lbl) lbl.textContent = 'AMBIENT SOUND · PLAYING ●';
  showStudioToast('공간 앰비언트 화음 패드가 재생됩니다.');
}

/* ==========================================================================
   60FPS HTML5 <CANVAS> ATMOSPHERIC SHADER ENGINE (Main Site + Vault Cards!)
   ========================================================================== */
let shaderRAF = null;
const pointerState = { x: 420, y: 260 };

function drawShaderFrame(ctx, w, h, mode, accentHex, t, motes, px, py) {
  ctx.clearRect(0, 0, w, h);
  if (mode === 'aurora') {
    ctx.globalAlpha = 0.24;
    for (let i = 0; i < 3; i++) {
      const ox = w * (0.24 + 0.26 * i) + Math.sin(t + i * 2.1) * (w * 0.12);
      const oy = h * (0.28 + 0.2 * i) + Math.cos(t * 0.8 + i) * (h * 0.14);
      const r = Math.max(w, h) * 0.38;
      const g = ctx.createRadialGradient(ox, oy, 6, ox, oy, r);
      g.addColorStop(0, accentHex);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ox, oy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else if (mode === 'spotlightGrid') {
    const step = w < 420 ? 24 : 44;
    ctx.save();
    const rad = w < 420 ? 150 : 320;
    const g = ctx.createRadialGradient(px, py, 8, px, py, rad);
    g.addColorStop(0, accentHex);
    g.addColorStop(1, 'transparent');
    ctx.strokeStyle = g;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y < h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
    ctx.restore();
  } else if (mode === 'dustGobo') {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = accentHex;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(w * (0.12 + i * 0.27), 0);
      ctx.lineTo(w * (0.25 + i * 0.27), 0);
      ctx.lineTo(w * (0.54 + i * 0.27), h);
      ctx.lineTo(w * (0.38 + i * 0.27), h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 0.52;
    motes.forEach(m => {
      m.x = (m.x + m.vx + w) % w;
      m.y = (m.y + m.vy + h) % h;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  } else if (mode === 'waves') {
    ctx.save();
    ctx.strokeStyle = accentHex;
    ctx.globalAlpha = 0.24;
    ctx.lineWidth = 1.1;
    for (let row = 0; row < 6; row++) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 18) {
        const y = h * (0.16 + row * 0.14) + Math.sin(x * 0.012 + t + row * 0.7) * (h * 0.055);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  } else if (mode === 'constellation') {
    ctx.save();
    ctx.fillStyle = accentHex;
    ctx.strokeStyle = accentHex;
    const maxDist = w < 420 ? 78 : 130;
    motes.slice(0, w < 420 ? 18 : 28).forEach((m, i, arr) => {
      m.x = (m.x + m.vx + w) % w;
      m.y = (m.y + m.vy * 0.5 + h) % h;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.9, 0, Math.PI * 2);
      ctx.fill();
      for (let j = i + 1; j < arr.length; j++) {
        const dist = Math.hypot(m.x - arr[j].x, m.y - arr[j].y);
        if (dist < maxDist) {
          ctx.globalAlpha = (1 - dist / maxDist) * 0.24;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(arr[j].x, arr[j].y);
          ctx.stroke();
        }
      }
    });
    ctx.restore();
  }
}

function initShaderEngine(mode) {
  if (shaderRAF) { cancelAnimationFrame(shaderRAF); shaderRAF = null; }
  const canvas = document.getElementById('hp-shader-canvas');
  if (!canvas || mode === 'none' || typeof canvas.getContext !== 'function') return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const root = document.getElementById('hp-root');
  const cs = typeof getComputedStyle === 'function' ? getComputedStyle(root) : null;
  const accentHex = (cs?.getPropertyValue('--accent') || '#8C5A32').trim();

  const frame = document.getElementById('canvas-frame');
  const isClient = typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.();
  canvas.width = isClient
    ? (typeof window !== 'undefined' && window.innerWidth ? window.innerWidth : 1280)
    : (frame && frame.clientWidth ? frame.clientWidth : 1000);
  canvas.height = isClient
    ? (typeof window !== 'undefined' && window.innerHeight ? Math.max(window.innerHeight, 900) : 900)
    : (frame ? Math.max(frame.clientHeight, 900) : 900);
  canvas.style.position = 'sticky';
  canvas.style.top = '0';
  canvas.style.height = canvas.height + 'px';
  canvas.style.marginBottom = (-canvas.height) + 'px';

  const motes = Array.from({ length: 42 }, (_, i) => ({
    x: (i * 97) % (canvas.width || 900),
    y: (i * 61) % (canvas.height || 700),
    vx: ((i % 5) - 2) * 0.18 || 0.14,
    vy: -0.15 - (i % 4) * 0.08,
    r: 1.2 + (i % 3) * 0.9
  }));

  let t = 0;
  function tick() {
    t += 0.014;
    drawShaderFrame(ctx, canvas.width, canvas.height, mode, accentHex, t, motes, pointerState.x, pointerState.y);
    shaderRAF = requestAnimationFrame(tick);
  }
  shaderRAF = requestAnimationFrame(tick);
}

/* ==========================================================================
   LIVE PHYSICS ENGINE (Magnetic, Ripple, Spotlight, 3D Tilt, Parallax, Scramble)
   ========================================================================== */
function scrambleElementText(el) {
  const target = el.dataset.scramble || el.textContent;
  const glyphs = '╱╲◆01X#ATELIER';
  let frame = 0;
  clearInterval(el._scrTimer);
  el._scrTimer = setInterval(() => {
    frame++;
    el.textContent = target.split('').map((ch, idx) => {
      if (ch === ' ') return ' ';
      if (idx < frame / 1.6) return target[idx];
      return glyphs[(idx + frame) % glyphs.length];
    }).join('');
    if (frame >= target.length * 1.8) {
      el.textContent = target;
      clearInterval(el._scrTimer);
    }
  }, 26);
}

function bindLivePhysics() {
  const root = document.getElementById('hp-root');
  if (!root) return;

  if (state.equipped.textfx === 'TFX-03') {
    root.querySelectorAll('[data-scramble]').forEach(el => {
      scrambleElementText(el);
      el.addEventListener('mouseenter', () => scrambleElementText(el));
    });
  }

  root.querySelectorAll('.f-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      btn.style.setProperty('--mx', `${x}px`);
      btn.style.setProperty('--my', `${y}px`);
      if (btn.dataset.uiMoved === '1' || state.canvasMoveMode) return;
      if (btn.classList.contains('f-magnetic') || state.equipped.button === 'BTN-01') {
        const tx = (x - r.width / 2) * 0.26;
        const ty = (y - r.height / 2) * 0.32;
        btn.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (btn.dataset.uiMoved === '1' || state.canvasMoveMode) return;
      btn.style.transform = '';
    });
  });

  const cards = root.querySelectorAll('.f-card');
  const pxLayers = root.querySelectorAll('.f-px-layer');

  root.addEventListener('mousemove', (e) => {
    const cf = document.getElementById('canvas-frame');
    if (cf) {
      const cr = cf.getBoundingClientRect();
      pointerState.x = e.clientX - cr.left;
      pointerState.y = e.clientY - cr.top;
      if (pxLayers.length) {
        const nx = ((e.clientX - cr.left) / (cr.width || 1)) - 0.5;
        const ny = ((e.clientY - cr.top) / (cr.height || 1)) - 0.5;
        pxLayers.forEach(layer => {
          const d = Number(layer.dataset.depth || 14);
          layer.style.transform = `translate(${(nx * d).toFixed(1)}px, ${(ny * d).toFixed(1)}px)`;
        });
      }
    }
    if (state.equipped.surface === 'SRF-01') {
      cards.forEach(card => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--cmx', `${e.clientX - r.left}px`);
        card.style.setProperty('--cmy', `${e.clientY - r.top}px`);
      });
    }
  });

  if (state.equipped.surface === 'SRF-02') {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (card.dataset.uiMoved === '1' || state.canvasMoveMode) return;
        const r = card.getBoundingClientRect();
        const rx = (((e.clientY - r.top) / r.height) - 0.5) * -9;
        const ry = (((e.clientX - r.left) / r.width) - 0.5) * 9;
        card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        if (card.dataset.uiMoved === '1' || state.canvasMoveMode) return;
        card.style.transform = '';
      });
    });
  }

  const floatWrap = document.getElementById('floating-work-preview');
  const floatImg = document.getElementById('floating-work-img');
  root.querySelectorAll('.hover-work-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      if (floatImg && IMG[row.dataset.img]) floatImg.src = IMG[row.dataset.img];
      if (floatWrap) { floatWrap.style.opacity = '1'; floatWrap.style.transform = 'translate(24px, -50%) scale(1)'; }
      row.style.paddingLeft = '24px';
    });
    row.addEventListener('mousemove', (e) => {
      if (floatWrap) {
        floatWrap.style.left = `${e.clientX}px`;
        floatWrap.style.top = `${e.clientY}px`;
      }
    });
    row.addEventListener('mouseleave', () => {
      if (floatWrap) { floatWrap.style.opacity = '0'; floatWrap.style.transform = 'translate(24px, -50%) scale(0.9)'; }
      row.style.paddingLeft = '12px';
    });
  });
}

/* ==========================================================================
   SCROLL CHOREOGRAPHY, COUNT-UP & SCROLL PROGRESS BAR
   ========================================================================== */
let siteObserver = null;

function animateCountUp(el) {
  if (el._counted || el._counting) return;
  el._counting = true;
  const target = parseFloat(el.dataset.target || '0');
  const isFloat = String(el.dataset.target).includes('.');
  const dur = 240;
  const start = performance.now();
  function step(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    if (p < 1) {
      el.textContent = isFloat ? val.toFixed(target % 1 !== 0 && String(target).split('.')[1]?.length === 2 ? 2 : 1) : Math.round(val).toLocaleString();
      requestAnimationFrame(step);
    } else {
      el.textContent = isFloat ? String(target) : target.toLocaleString();
      el._counting = false;
      el._counted = true;
    }
  }
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(step);
  else {
    el.textContent = isFloat ? String(target) : target.toLocaleString();
    el._counting = false;
    el._counted = true;
  }
}

function initScrollChoreography(forceReplay = false) {
  if (siteObserver) siteObserver.disconnect();
  const root = document.getElementById('hp-root');
  const frame = document.getElementById('canvas-frame');
  if (!root || typeof IntersectionObserver !== 'function') return;

  const reveals = root.querySelectorAll('.f-reveal');
  const counters = root.querySelectorAll('.f-countup');
  const isClient = typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.();

  if (state.equipped.motion !== 'MOT-08' && (forceReplay || state.presentation || isClient)) {
    reveals.forEach(el => {
      if (el.getAttribute('data-scroll-reveal') === 'none') {
        el.classList.remove('is-waiting');
        el.style.opacity = '1';
      } else {
        el.classList.add('is-waiting');
      }
    });
  } else {
    reveals.forEach(el => el.classList.remove('is-waiting'));
  }
  if (forceReplay) counters.forEach(c => { c._counted = false; c._counting = false; });

  siteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-waiting');
        if (entry.target.classList.contains('f-countup')) animateCountUp(entry.target);
        entry.target.querySelectorAll?.('.f-countup').forEach(animateCountUp);
      }
    });
  }, { root: isClient ? null : frame, threshold: 0.1 });

  reveals.forEach(el => siteObserver.observe(el));
  counters.forEach(el => siteObserver.observe(el));
}

function replaySiteMotions() {
  initScrollChoreography(true);
  if (state.equipped.textfx === 'TFX-03') {
    document.querySelectorAll('[data-scramble]').forEach(scrambleElementText);
  }
  showStudioToast('스크롤 리빌 모션과 카운트업 애니메이션을 다시 재생합니다.');
}

/* ==========================================================================
   CUSTOM CURSOR FOLLOWER + GOLDEN STARDUST PARTICLES (CUR-01 ~ CUR-08)
   ========================================================================== */
function spawnStardustParticle(x, y, parentEl) {
  if (typeof document === 'undefined') return;
  const sp = document.createElement('span');
  sp.className = 'f-cursor-spark';
  const jx = (Math.random() - 0.5) * 14;
  const jy = (Math.random() - 0.5) * 14;
  sp.style.left = `${x + jx}px`;
  sp.style.top = `${y + jy}px`;
  if (parentEl) {
    sp.style.position = 'absolute';
    parentEl.appendChild(sp);
  } else {
    document.body.appendChild(sp);
  }
  setTimeout(() => sp.remove(), 700);
}

function initCustomCursorSystem() {
  const ring = document.getElementById('f-cursor-ring');
  const cf = document.getElementById('canvas-frame');
  if (!ring || !cf || typeof requestAnimationFrame !== 'function') return;

  const updateScrollIndicators = (scrollTop, maxScroll) => {
    const pct = Math.min(100, Math.max(0, Math.round((scrollTop / Math.max(1, maxScroll)) * 100)));
    const laser = document.getElementById('hp-scroll-laser');
    if (laser) laser.style.setProperty('--scroll-pct', pct + '%');
    const pill = document.getElementById('hp-scroll-pct-pill');
    if (pill) pill.textContent = `SCROLL ${pct < 10 ? '0' + pct : pct}%`;
  };

  cf.addEventListener('scroll', () => {
    updateScrollIndicators(cf.scrollTop, cf.scrollHeight - cf.clientHeight);
  });

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('scroll', () => {
      if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.()) {
        const docEl = document.documentElement;
        const maxS = Math.max(1, (docEl.scrollHeight || document.body.scrollHeight) - window.innerHeight);
        updateScrollIndicators(window.scrollY || docEl.scrollTop || 0, maxS);
      }
    }, { passive: true });
  }

  let tx = -100, ty = -100, cx = -100, cy = -100, lastSpark = 0;

  cf.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    const cur = getAsset('cursor', state.equipped.cursor);
    if (cur.mode === 'off') { ring.style.opacity = '0'; return; }

    ring.style.opacity = '1';
    ring.className = 'f-cursor-ring';
    ring.style.width = '';
    ring.style.height = '';
    ring.style.borderRadius = '';
    ring.style.padding = '';
    ring.style.background = '';
    ring.textContent = '';

    const overInteractive = Boolean(e.target.closest('button, a, .f-media, summary, .hover-work-row, article, input'));
    if (cur.mode === 'diff') {
      ring.classList.add('cur-diff');
      if (overInteractive) ring.classList.add('is-hover');
    } else if (cur.mode === 'halo') {
      ring.classList.add('cur-halo');
    } else if (cur.mode === 'slim') {
      ring.classList.add('cur-slim');
      if (overInteractive) { ring.style.width = '34px'; ring.style.height = '34px'; }
    } else if (cur.mode === 'trail') {
      ring.classList.add('cur-slim');
      const now = Date.now();
      if (now - lastSpark > 28) {
        lastSpark = now;
        spawnStardustParticle(tx, ty, null);
      }
    } else if (cur.mode === 'coords') {
      ring.style.width = 'auto'; ring.style.height = 'auto';
      ring.style.borderRadius = '4px'; ring.style.padding = '3px 8px';
      ring.style.background = 'rgba(10,12,16,0.88)';
      ring.textContent = `+ X:${Math.round(tx)} Y:${Math.round(ty)}`;
    } else if (cur.mode === 'pill') {
      if (overInteractive) {
        ring.classList.add('is-hover');
        ring.textContent = 'EXPLORE';
      }
    } else if (cur.mode === 'ring') {
      if (overInteractive) {
        ring.classList.add('is-hover');
        ring.textContent = 'VIEW';
      }
    }
  });

  cf.addEventListener('mouseleave', () => { ring.style.opacity = '0'; });

  function loop() {
    cx += (tx - cx) * 0.24;
    cy += (ty - cy) * 0.24;
    ring.style.left = `${cx}px`;
    ring.style.top = `${cy}px`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ==========================================================================
   ASSET ATELIER (100% REAL VISUAL INTERACTIVE STAGES FOR ALL 252 ASSETS!)
   ========================================================================== */
function setVaultFilter(catKey) {
  state.vaultFilter = catKey;
  renderVaultView();
}

function setVaultQuery(q) {
  state.vaultQuery = (q || '').trim();
  renderVaultView(true);
}

function renderVaultStage(catKey, item) {
  const pal   = getAsset('palette',  state.equipped.palette);
  const fnt   = getAsset('font',     state.equipped.font);
  const tfx   = getAsset('textfx',   state.equipped.textfx);
  const btn   = getAsset('button',   state.equipped.button);
  const srf   = getAsset('surface',  state.equipped.surface);
  const imgst = getAsset('imgstyle', state.equipped.imgstyle);
  const inp   = getAsset('inputui',  state.equipped.inputui);
  const bdg   = getAsset('badge',    state.equipped.badge);
  const w     = getCurrentWorldObj();
  const ctx   = { bdgCls: bdg.cls, tfxId: tfx.id, btn: (l) => btn.render(l) };

  /* 01. PALETTE */
  if (catKey === 'palette') {
    return `<div class="${item.cls}" style="width:100%;padding:16px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div><div style="font-size:11px;color:var(--sub);">SURFACE & INK</div><strong style="font-family:var(--font-display);font-size:17px;">${w.brand}</strong></div>
        <span style="padding:5px 11px;border-radius:999px;background:var(--accent);color:var(--accent-fg);font-size:12px;font-weight:700;">Accent CTA</span>
      </div>
      <div style="display:flex;gap:8px;">
        ${item.swatches.map(s => `<div style="flex:1;height:30px;border-radius:6px;background:${s};border:1px solid rgba(128,128,128,0.28);display:flex;align-items:flex-end;padding:3px 6px;"><span class="f-mono" style="font-size:10px;background:rgba(0,0,0,0.55);color:#fff;padding:1px 4px;border-radius:3px;">${s}</span></div>`).join('')}
      </div>
    </div>`;
  }

  /* 02. SHADER (Live 60fps <canvas> or Real Atmospheric CSS Layer!) */
  if (catKey === 'shader') {
    if (item.mode !== 'none') {
      return `<div class="${pal.cls}" style="width:100%;height:148px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;">
        <canvas class="vault-shader-canvas" data-mode="${item.mode}" width="320" height="148" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>
        <div style="position:relative;z-index:2;text-align:center;pointer-events:none;padding:8px 14px;border-radius:999px;background:color-mix(in srgb, var(--surface) 78%, transparent);backdrop-filter:blur(8px);border:1px solid var(--border);">
          <span class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">60FPS LIVE CANVAS · ${item.mode.toUpperCase()}</span>
        </div>
      </div>`;
    }
    return `<div class="${pal.cls} ${item.cls}" style="width:100%;height:148px;border-radius:10px;background-color:var(--bg);color:var(--fg);border:1px solid var(--border);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;">
      <span class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${item.id} · ARCHITECTURAL TEXTURE</span>
      <strong style="font-family:var(--font-display);font-size:18px;">${w.brand}</strong>
    </div>`;
  }

  /* 03. EMBEDDED KR/EN WEBFONT */
  if (catKey === 'font') {
    return `<div class="${pal.cls} ${item.cls}" style="width:100%;padding:18px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);text-align:center;">
      <div style="font-family:var(--font-display);font-weight:var(--display-weight);letter-spacing:var(--display-track);font-size:23px;line-height:1.18;">${item.sample}</div>
      <div style="font-family:var(--font-body);font-size:12px;color:var(--sub);margin-top:9px;">빛과 여백이 빚어내는 고요한 건축 · 0123456789</div>
    </div>`;
  }

  /* 04. KINETIC HEADLINE FX */
  if (catKey === 'textfx') {
    return `<div class="${pal.cls} ${fnt.cls} ${item.cls}" style="width:100%;padding:20px 16px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);text-align:center;">
      <div class="f-h2" style="font-size:23px;">${fmtHeadline('시간을 초월한', '건축적 미학', item.id)}</div>
      <div class="f-mono" style="font-size:11px;color:var(--sub);margin-top:8px;">마우스를 올려 인터랙션을 확인하세요</div>
    </div>`;
  }

  /* 05. PHYSICS BUTTON */
  if (catKey === 'button') {
    return `<div class="${pal.cls} ${fnt.cls}" style="width:100%;min-height:146px;padding:24px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;">
      ${item.render('마우스를 올려보세요')}
    </div>`;
  }

  /* 06. SPOTLIGHT / 3D TILT CARD SURFACE */
  if (catKey === 'surface') {
    return `<div class="${pal.cls} ${fnt.cls} ${item.cls}" style="width:100%;padding:14px;border-radius:10px;background:var(--bg);color:var(--fg);">
      <div class="f-card" style="padding:18px;">
        <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${item.id} · LIVE SURFACE</div>
        <div style="font-size:15px;font-weight:700;margin-top:4px;">마우스를 움직여 조명과 질감 확인</div>
        <p style="margin:5px 0 0;font-size:12px;color:var(--sub);">스포트라이트·3D 틸트·인셋 프레임이 실시간 반응합니다.</p>
      </div>
    </div>`;
  }

  /* 07. PHOTOGRAPHY MASK & FILM GRADING */
  if (catKey === 'imgstyle') {
    return `<div class="${pal.cls} ${item.cls}" style="width:100%;padding:14px;border-radius:10px;background:var(--bg);border:1px solid var(--border);display:flex;justify-content:center;">
      <div class="f-media" style="width:205px;height:124px;"><img src="${IMG[w.heroImg]}" alt="${item.name}"/></div>
    </div>`;
  }

  /* 08. STANDALONE INPUT, SWITCH, STEPPER & SLIDER UI */
  if (catKey === 'inputui') {
    return `<div class="${pal.cls} ${fnt.cls}" style="width:100%;min-height:146px;padding:18px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;">
      ${item.demo()}
    </div>`;
  }

  /* 09. INTERACTIVE CUSTOM CURSOR SANDBOX PAD */
  if (catKey === 'cursor') {
    return `<div class="${pal.cls} vault-cursor-pad" data-curmode="${item.mode}" style="width:100%;height:148px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:${item.mode==='off'?'default':'none'};">
      <span class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;pointer-events:none;">INTERACTIVE CURSOR PAD</span>
      <span style="font-size:13px;font-weight:700;pointer-events:none;">이 영역 안에서 마우스를 움직여보세요</span>
      <div class="vault-cur-dot" style="position:absolute;left:72%;top:54%;transform:translate(-50%,-50%);pointer-events:none;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;transition:width 0.18s ease,height 0.18s ease;"></div>
    </div>`;
  }

  /* 10. CONTINUOUS LOOPING CHOREOGRAPHY MOTION STAGE */
  if (catKey === 'motion') {
    const animStyle = item.demoAnim ? `animation:${item.demoAnim} 3.1s cubic-bezier(0.16,1,0.3,1) infinite;` : '';
    return `<div class="${pal.cls}" style="width:100%;height:148px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;overflow:hidden;padding:14px;">
      <div style="width:86%;padding:14px 16px;border-radius:10px;background:var(--surface);border:1px solid var(--border);box-shadow:0 14px 30px rgba(0,0,0,0.12);display:flex;align-items:center;gap:12px;${animStyle}">
        <img src="${IMG[w.heroImg]}" alt="Motion" style="width:46px;height:46px;border-radius:8px;object-fit:cover;flex-shrink:0;" />
        <div>
          <div class="f-mono" style="font-size:11px;color:var(--accent);font-weight:700;">${item.id} · ${item.demoAnim ? 'LIVE LOOP' : 'STATIC'}</div>
          <div style="font-size:13px;font-weight:700;margin-top:2px;">${item.name}</div>
        </div>
      </div>
    </div>`;
  }

  /* 11. EDITORIAL EYE-CATCHER BADGE */
  if (catKey === 'badge') {
    return `<div class="${pal.cls}" style="width:100%;min-height:146px;padding:24px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;">
      <span class="${item.cls}">${w.eyebrow}</span>
      <span style="font-size:12px;color:var(--sub);">${w.edition}</span>
    </div>`;
  }

  /* 12. PRELOADER & SCROLL LASER STAGE */
  if (catKey === 'preloader') {
    const isCurtain = item.mode.includes('Curtain');
    return `<div class="${pal.cls}" style="width:100%;height:148px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:14px;">
      ${(item.mode === 'laser' || item.mode === 'combo') ? `<div style="position:absolute;top:0;left:0;height:4px;width:68%;background:var(--accent);box-shadow:0 0 12px var(--accent);"></div>` : ''}
      ${item.mode === 'pctpill' ? `<span class="f-mono" style="align-self:flex-end;padding:3px 9px;border-radius:999px;background:var(--fg);color:var(--bg);font-size:11px;font-weight:700;">SCROLL 68%</span>` : `<span class="f-mono" style="font-size:11px;color:var(--accent);font-weight:700;">${item.id} · ${item.mode.toUpperCase()}</span>`}
      ${(item.mode === 'dotrail' || item.mode === 'combo') ? `<div style="position:absolute;right:10px;top:28%;display:flex;flex-direction:column;gap:5px;">${[0,1,2,3].map(d=>`<span style="width:7px;height:7px;border-radius:99px;background:${d===1?'var(--accent)':'var(--sub)'};"></span>`).join('')}</div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:8px;">
        <div style="font-family:var(--font-display);font-size:18px;font-weight:700;">${w.brand}</div>
        ${isCurtain ? `<button type="button" onclick="setStudioMode('builder');setTimeout(()=>triggerIntroCurtain('${item.mode}'),80)" style="padding:6px 12px;border-radius:999px;background:var(--accent);color:var(--accent-fg);border:none;font-size:12px;font-weight:700;cursor:pointer;">▶ 풀스크린 시연</button>` : ''}
      </div>
    </div>`;
  }

  /* 13. FLOATING WIDGET & DOCK STAGE */
  if (catKey === 'widget') {
    const raw = item.render(w, ctx);
    if (!raw) {
      return `<div class="${pal.cls}" style="width:100%;height:148px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;">
        <span class="f-mono" style="font-size:12px;color:var(--sub);">CLEAN CANVAS MODE</span>
        <strong style="font-size:14px;">하단 플로팅 위젯 비활성 (여백 유지)</strong>
      </div>`;
    }
    return `<div class="${pal.cls} ${fnt.cls}" style="width:100%;height:148px;border-radius:10px;background:var(--bg);color:var(--fg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;overflow:hidden;padding:10px;">
      <div style="zoom:0.74;width:100%;">${raw.replace(/position:sticky;/g, 'position:relative;')}</div>
    </div>`;
  }

  /* 14 ~ 26. ALL 13 ARCHITECTURAL FULL-PAGE SECTION CATEGORIES (LIVE SCALED WEBPAGE!) */
  const secHTML = typeof item.render === 'function' ? item.render(w, ctx) : '';
  return `<div class="st-sec-mini-shell ${pal.cls} ${fnt.cls} ${tfx.cls} ${srf.cls} ${imgst.cls} ${inp.cls || ''}">
    <div class="st-sec-mini-bar">
      <span>● LIVE SECTION STAGE · ${item.id}</span>
      <span>1060px → 34%</span>
    </div>
    <div class="st-sec-mini-viewport">
      ${secHTML
        ? `<div class="st-sec-mini-scale">${secHTML}</div>`
        : `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:20px;text-align:center;">
            <span class="f-mono" style="font-size:12px;color:var(--accent);">MINIMAL CLEAN SLOT</span>
            <strong style="font-size:13px;">해당 구분선/상단바 생략 모드</strong>
          </div>`}
    </div>
  </div>`;
}

function renderVaultView(skipToolbarRebuild = false) {
  const toolbar = document.getElementById('vault-toolbar');
  const catBar = document.getElementById('vault-cats-bar');
  const grid = document.getElementById('vault-cards-grid');
  if (!catBar || !grid) return;

  const totalCount = CATEGORIES.reduce((acc, c) => acc + (VAULT[c.key]?.length || 0), 0);

  if (toolbar && !skipToolbarRebuild) {
    toolbar.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <span style="font-size:13px;font-weight:800;color:#F8FAFC;">✦ 개별 에셋 아틀리에 (${totalCount}종 전수 라이브 스테이지)</span>
        <span style="font-size:12px;color:#94A3B8;">모든 버튼·서체·셰이더·인풋·커서·모션·섹션이 카드 안에서 실제 작동합니다.</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <input id="vault-search-input" type="search" value="${state.vaultQuery.replace(/"/g, '&quot;')}" oninput="setVaultQuery(this.value)" placeholder="에셋 이름, ID(BTN-02, HERO-09), 키워드 검색..." class="st-vault-search" />
        ${state.vaultQuery ? `<button type="button" onclick="setVaultQuery('')" class="st-pill-btn">초기화</button>` : ''}
      </div>
    `;
  }

  catBar.innerHTML = `
    <button type="button" onclick="setVaultFilter('all')" class="st-vault-cat-btn ${state.vaultFilter==='all'?'is-active':''}">전체 에셋 (${totalCount})</button>
    ${CATEGORIES.map(c => `<button type="button" onclick="setVaultFilter('${c.key}')" class="st-vault-cat-btn ${state.vaultFilter===c.key?'is-active':''}">${c.num}. ${c.name} (${VAULT[c.key]?.length||0})</button>`).join('')}
  `;

  const activeCatObj = CATEGORIES.find(c => c.key === state.vaultFilter);
  grid.classList.toggle('is-section-grid', Boolean(activeCatObj && activeCatObj.group === 'section'));

  const targetCats = state.vaultFilter === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.key === state.vaultFilter);
  const q = state.vaultQuery.toLowerCase();
  const cardsHTML = [];

  targetCats.forEach(c => {
    (VAULT[c.key] || []).forEach(item => {
      if (q) {
        const hay = `${item.id} ${item.name} ${item.desc} ${c.name}`.toLowerCase();
        if (!hay.includes(q)) return;
      }
      const isEq = state.equipped[c.key] === item.id;
      cardsHTML.push(`
        <div class="st-vault-card ${isEq?'is-equipped':''}">
          <div class="st-vault-stage">${renderVaultStage(c.key, item)}</div>
          <div class="st-vault-meta">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                <span class="f-mono" style="font-size:12px;color:#94A3B8;">${c.num}. ${c.name} · ${item.id}</span>
                ${isEq ? `<span style="font-size:12px;font-weight:700;padding:2px 8px;border-radius:99px;background:#F8FAFC;color:#090A0D;">현재 장착됨</span>` : ''}
              </div>
              <div style="font-size:14px;font-weight:700;color:#F8FAFC;margin-top:6px;">${item.name}</div>
              <p style="margin:5px 0 0;font-size:12px;color:#8A94A6;line-height:1.5;">${item.desc}</p>
            </div>
            <div style="display:flex;gap:8px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.07);">
              <button type="button" onclick="pushUndoSnapshot();equipAsset('${c.key}','${item.id}', true)" class="st-pill-btn is-primary" style="flex:1;justify-content:center;">홈페이지에 바로 적용 →</button>
              <button type="button" onclick="openSingleAssetCode('${c.key}','${item.id}')" class="st-pill-btn">&lt;/&gt; 단독 코드</button>
            </div>
          </div>
        </div>
      `);
    });
  });

  grid.innerHTML = cardsHTML.length
    ? cardsHTML.join('')
    : `<div style="grid-column:1/-1;padding:60px 20px;text-align:center;color:#94A3B8;font-size:14px;">검색 조건에 맞는 에셋이 없습니다. 다른 키워드로 검색해 보세요.</div>`;

  bindVaultPhysics(grid);
  initVaultShaders(grid);
}

function initVaultShaders(container) {
  if (vaultShaderRAF) { cancelAnimationFrame(vaultShaderRAF); vaultShaderRAF = null; }
  if (!container || typeof container.querySelectorAll !== 'function' || typeof requestAnimationFrame !== 'function') return;
  const canvases = Array.from(container.querySelectorAll('.vault-shader-canvas'));
  if (!canvases.length) return;

  const pal = getAsset('palette', state.equipped.palette);
  const accentHex = pal.swatches[2] || '#8C5A32';

  const states = canvases.map(cv => {
    const ctx = typeof cv.getContext === 'function' ? cv.getContext('2d') : null;
    const motes = Array.from({ length: 18 }, (_, i) => ({
      x: (i * 53) % 320, y: (i * 37) % 148,
      vx: ((i % 3) - 1) * 0.25 || 0.2, vy: -0.22 - (i % 3) * 0.1, r: 1.4
    }));
    const st = { cv, ctx, mode: cv.dataset.mode, motes, px: 160, py: 74 };
    cv.parentElement?.addEventListener('mousemove', (e) => {
      const r = cv.getBoundingClientRect();
      st.px = e.clientX - r.left;
      st.py = e.clientY - r.top;
    });
    return st;
  }).filter(s => s.ctx);

  if (!states.length) return;
  let t = 0;
  function loop() {
    if (state.mode !== 'vault') return;
    t += 0.022;
    states.forEach(s => {
      drawShaderFrame(s.ctx, s.cv.width, s.cv.height, s.mode, accentHex, t, s.motes, s.px, s.py);
    });
    vaultShaderRAF = requestAnimationFrame(loop);
  }
  vaultShaderRAF = requestAnimationFrame(loop);
}

function styleVaultCursorDot(dot, mode, x, y, hovering) {
  if (!dot) return;
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  dot.textContent = '';
  if (mode === 'off') {
    dot.style.width = '10px'; dot.style.height = '10px';
    dot.style.borderRadius = '999px'; dot.style.background = 'var(--sub)'; dot.style.border = 'none';
  } else if (mode === 'diff') {
    dot.style.width = '40px'; dot.style.height = '40px';
    dot.style.borderRadius = '999px'; dot.style.background = '#FFFFFF';
    dot.style.mixBlendMode = 'difference'; dot.style.border = 'none';
  } else if (mode === 'halo') {
    dot.style.width = '130px'; dot.style.height = '130px';
    dot.style.borderRadius = '999px'; dot.style.border = 'none';
    dot.style.background = 'radial-gradient(circle, rgba(212,163,89,0.34) 0%, transparent 70%)';
  } else if (mode === 'coords') {
    dot.style.width = 'auto'; dot.style.height = 'auto';
    dot.style.padding = '3px 7px'; dot.style.borderRadius = '4px';
    dot.style.background = 'rgba(10,12,18,0.88)'; dot.style.color = '#fff';
    dot.textContent = `+ X:${Math.round(x)} Y:${Math.round(y)}`;
  } else if (mode === 'pill') {
    dot.style.width = '74px'; dot.style.height = '30px';
    dot.style.borderRadius = '999px'; dot.style.background = 'var(--fg)'; dot.style.color = 'var(--bg)';
    dot.textContent = 'EXPLORE';
  } else if (mode === 'slim' || mode === 'trail') {
    dot.style.width = '20px'; dot.style.height = '20px';
    dot.style.borderRadius = '999px'; dot.style.border = '1.5px solid #D4A359';
    dot.style.boxShadow = '0 0 12px rgba(212,163,89,0.5)'; dot.style.background = 'transparent';
  } else {
    dot.style.width = hovering ? '52px' : '32px';
    dot.style.height = hovering ? '52px' : '32px';
    dot.style.borderRadius = '999px';
    dot.style.border = '1.5px solid var(--accent)';
    dot.style.background = hovering ? 'rgba(12,14,20,0.86)' : 'transparent';
    dot.style.color = '#FFFFFF';
    dot.textContent = hovering ? 'VIEW' : '';
  }
}

function bindVaultPhysics(container) {
  if (!container || typeof container.querySelectorAll !== 'function') return;

  const btns = container.querySelectorAll('.f-btn');
  if (btns.forEach) {
    btns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        btn.style.setProperty('--mx', `${x}px`);
        btn.style.setProperty('--my', `${y}px`);
        if (btn.classList.contains('f-magnetic')) {
          btn.style.transform = `translate(${((x - r.width / 2) * 0.28).toFixed(1)}px, ${((y - r.height / 2) * 0.34).toFixed(1)}px)`;
        }
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  const cards = container.querySelectorAll('.f-card');
  if (cards.forEach) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--cmx', `${x}px`);
        card.style.setProperty('--cmy', `${y}px`);
        if (card.closest('.srf-02')) {
          const rx = ((y / r.height) - 0.5) * -10;
          const ry = ((x / r.width) - 0.5) * 10;
          card.style.transform = `perspective(700px) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`;
        }
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  const scrambles = container.querySelectorAll('[data-scramble]');
  if (scrambles.forEach) {
    scrambles.forEach(el => {
      el.closest('.st-vault-card')?.addEventListener('mouseenter', () => scrambleElementText(el));
    });
  }

  const pads = container.querySelectorAll('.vault-cursor-pad');
  if (pads.forEach) {
    pads.forEach(pad => {
      const dot = pad.querySelector('.vault-cur-dot');
      const mode = pad.dataset.curmode;
      styleVaultCursorDot(dot, mode, 210, 74, true);
      let lastSp = 0;
      pad.addEventListener('mousemove', (e) => {
        const r = pad.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        styleVaultCursorDot(dot, mode, x, y, true);
        if (mode === 'trail' && Date.now() - lastSp > 35) {
          lastSp = Date.now();
          spawnStardustParticle(x, y, pad);
        }
      });
    });
  }
}

/* ==========================================================================
   100% SELF-CONTAINED SINGLE-ASSET CODE EXTRACTOR + LIVE SANDBOX PREVIEW
   ========================================================================== */
function extractMatchingCSSRules(selectors) {
  const coreCSS = document.getElementById('forma-core-css')?.textContent || '';
  if (!coreCSS) return '';
  const lines = coreCSS.split('\n');
  const out = [];
  let capturing = false;
  let depth = 0;
  let block = [];

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (!capturing) {
      if (selectors.some(tok => ln.includes(tok)) && ln.includes('{')) {
        capturing = true;
        depth = (ln.match(/\{/g) || []).length - (ln.match(/\}/g) || []).length;
        block = [ln];
        if (depth <= 0) {
          out.push(block.join('\n'));
          capturing = false;
        }
      }
    } else {
      block.push(ln);
      depth += (ln.match(/\{/g) || []).length - (ln.match(/\}/g) || []).length;
      if (depth <= 0) {
        out.push(block.join('\n'));
        capturing = false;
      }
    }
  }
  return out.join('\n');
}

function buildStandaloneAssetPackage(catKey, assetId) {
  const item  = getAsset(catKey, assetId);
  const w     = getCurrentWorldObj();
  const pal   = catKey === 'palette' ? item : getAsset('palette', state.equipped.palette);
  const fnt   = catKey === 'font'    ? item : getAsset('font', state.equipped.font);
  const bdg   = getAsset('badge', state.equipped.badge);
  const btn   = getAsset('button', state.equipped.button);
  const tfx   = getAsset('textfx', state.equipped.textfx);
  const ctx   = { bdgCls: bdg.cls, tfxId: tfx.id, btn: (l) => btn.render(l) };

  const baseTokens = extractMatchingCSSRules([`.${pal.cls}`, `.${fnt.cls}`]);
  let extraCSS = '';
  let bodyHTML = '';
  let scriptJS = '';

  if (catKey === 'palette') {
    extraCSS = baseTokens;
    bodyHTML = `<div class="${item.cls}" style="padding:36px;border-radius:14px;background:var(--bg);color:var(--fg);border:1px solid var(--border);max-width:540px;margin:0 auto;">
  <span style="font-size:12px;color:var(--accent);font-weight:700;">${item.id} · ${item.name}</span>
  <h2 style="margin:8px 0 12px;font-size:28px;">${w.brand}</h2>
  <p style="color:var(--sub);font-size:14px;margin:0 0 20px;">${item.desc}</p>
  <button style="padding:12px 24px;border-radius:999px;border:none;background:var(--accent);color:var(--accent-fg);font-weight:700;cursor:pointer;">${w.ctaPrimary}</button>
</div>`;
  } else if (catKey === 'shader') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.bg-css-']);
    bodyHTML = `<div class="${pal.cls} ${item.cls || ''}" style="position:relative;min-height:320px;border-radius:16px;background-color:var(--bg);color:var(--fg);border:1px solid var(--border);overflow:hidden;display:flex;align-items:center;justify-content:center;">
  <canvas id="asset-shader" width="800" height="360" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;"></canvas>
  <div style="position:relative;z-index:2;text-align:center;padding:24px;">
    <div style="font-size:12px;color:var(--accent);font-weight:700;">${item.id} · ${item.mode.toUpperCase()}</div>
    <h2 style="font-size:30px;margin:8px 0;">${item.name}</h2>
  </div>
</div>`;
    if (item.mode !== 'none') {
      scriptJS = `const cv = document.getElementById('asset-shader');
const ctx = cv.getContext('2d');
let t = 0, px = 400, py = 180;
cv.parentElement.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; });
const motes = Array.from({length:28}, (_,i)=>({x:(i*73)%800,y:(i*41)%360,vx:0.25,vy:-0.2,r:1.6}));
${drawShaderFrame.toString()}
(function loop(){ t += 0.016; drawShaderFrame(ctx, cv.width, cv.height, '${item.mode}', '${pal.swatches[2]}', t, motes, px, py); requestAnimationFrame(loop); })();`;
    }
  } else if (catKey === 'font') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.f-h1', '.f-h2']);
    bodyHTML = `<div class="${pal.cls} ${item.cls}" style="padding:40px;border-radius:14px;background:var(--bg);color:var(--fg);border:1px solid var(--border);text-align:center;">
  <h1 class="f-h1" style="font-size:40px;">${item.sample}</h1>
  <p style="font-family:var(--font-body);color:var(--sub);margin-top:14px;">${w.h1Sub}</p>
</div>`;
  } else if (catKey === 'textfx') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.f-h1', '.f-h2', '.f-accent-word', 'tfxCharUp', 'tfxFoil', 'tfxLineReveal', `.${item.cls}`]);
    bodyHTML = `<div class="${pal.cls} ${fnt.cls} ${item.cls}" style="padding:44px;border-radius:14px;background:var(--bg);color:var(--fg);border:1px solid var(--border);text-align:center;">
  <h1 class="f-h1" style="font-size:38px;">${fmtHeadline(w.h1Pre, w.h1Accent, item.id)}</h1>
</div>`;
    if (item.id === 'TFX-03') {
      scriptJS = `${scrambleElementText.toString()}\ndocument.querySelectorAll('[data-scramble]').forEach(el => { scrambleElementText(el); el.addEventListener('mouseenter', () => scrambleElementText(el)); });`;
    }
  } else if (catKey === 'button') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.f-btn', 'spinBeam', 'btnSheen', `.${item.cls}`]);
    bodyHTML = `<div class="${pal.cls} ${fnt.cls}" style="padding:48px;border-radius:14px;background:var(--bg);color:var(--fg);display:flex;justify-content:center;">
  ${item.render(w.ctaPrimary)}
</div>`;
    scriptJS = `document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    btn.style.setProperty('--mx', x + 'px'); btn.style.setProperty('--my', y + 'px');
    if (btn.classList.contains('f-magnetic')) {
      btn.style.transform = 'translate(' + ((x - r.width/2)*0.26).toFixed(1) + 'px,' + ((y - r.height/2)*0.32).toFixed(1) + 'px)';
    }
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});`;
  } else if (catKey === 'surface') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.f-card', `.${item.cls}`]);
    bodyHTML = `<div class="${pal.cls} ${fnt.cls} ${item.cls}" style="padding:36px;border-radius:14px;background:var(--bg);">
  <div class="f-card" style="max-width:440px;margin:0 auto;">
    <div style="font-size:12px;color:var(--accent);font-weight:700;">${item.id}</div>
    <h3 style="margin:8px 0;">${item.name}</h3>
    <p style="margin:0;font-size:14px;color:var(--sub);">${item.desc}</p>
  </div>
</div>`;
    scriptJS = `document.querySelectorAll('.f-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty('--cmx', x + 'px'); card.style.setProperty('--cmy', y + 'px');
    if (card.closest('.srf-02')) {
      card.style.transform = 'perspective(800px) rotateX(' + (((y/r.height)-0.5)*-10).toFixed(1) + 'deg) rotateY(' + (((x/r.width)-0.5)*10).toFixed(1) + 'deg)';
    }
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});`;
  } else if (catKey === 'imgstyle') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.f-media', `.${item.cls}`]);
    bodyHTML = `<div class="${pal.cls} ${item.cls}" style="padding:32px;background:var(--bg);border-radius:14px;display:flex;justify-content:center;">
  <div class="f-media" style="width:340px;aspect-ratio:4/3;">
    <img src="__SAMPLE_IMG__" alt="${item.name}" />
  </div>
</div>`;
  } else if (catKey === 'inputui') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.f-input', '.f-switch', `.${item.cls}`]);
    bodyHTML = `<div class="${pal.cls} ${fnt.cls}" style="padding:40px;background:var(--bg);color:var(--fg);border-radius:14px;display:flex;justify-content:center;">
  ${item.demo()}
</div>`;
  } else if (catKey === 'cursor') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.f-cursor-ring', '.cur-', 'stardustFade', '.f-cursor-spark']);
    bodyHTML = `<div class="${pal.cls}" id="cursor-demo-zone" style="position:relative;min-height:280px;border-radius:14px;background:var(--bg);color:var(--fg);border:1px solid var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;overflow:hidden;">
  <div style="font-size:12px;color:var(--accent);font-weight:700;">${item.id} · ${item.mode.toUpperCase()}</div>
  <button style="padding:12px 24px;border-radius:999px;border:1px solid var(--fg);background:var(--surface);color:var(--fg);cursor:pointer;">마우스를 움직여 테스트하세요</button>
  <div id="demo-ring" class="f-cursor-ring" style="opacity:1;"></div>
</div>`;
    scriptJS = `const ring = document.getElementById('demo-ring');
document.getElementById('cursor-demo-zone').addEventListener('mousemove', e => {
  ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
  ring.className = 'f-cursor-ring ${item.mode==='diff'?'cur-diff':item.mode==='halo'?'cur-halo':item.mode==='slim'?'cur-slim':''}';
  ${item.mode==='coords' ? "ring.style.width='auto';ring.style.height='auto';ring.style.padding='3px 8px';ring.style.background='#090A0D';ring.textContent='+ X:'+Math.round(e.clientX)+' Y:'+Math.round(e.clientY);" : ""}
  ${item.mode==='trail' ? "const s=document.createElement('span');s.className='f-cursor-spark';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),680);" : ""}
});`;
  } else if (catKey === 'motion') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.f-reveal', `.${item.cls}`, item.demoAnim || 'mot-01']);
    bodyHTML = `<div class="${pal.cls} ${item.cls}" style="padding:40px;background:var(--bg);color:var(--fg);border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:16px;">
  <div id="mot-box" class="f-reveal" style="padding:24px 32px;border-radius:12px;background:var(--surface);border:1px solid var(--border);text-align:center;${item.demoAnim ? `animation:${item.demoAnim} 3s cubic-bezier(0.16,1,0.3,1) infinite;` : ''}">
    <strong>[${item.id}] ${item.name}</strong>
    <p style="margin:6px 0 0;font-size:13px;color:var(--sub);">${item.desc}</p>
  </div>
</div>`;
  } else if (catKey === 'badge') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.f-bdg', `.${item.id.toLowerCase()}`]);
    bodyHTML = `<div class="${pal.cls}" style="padding:44px;background:var(--bg);color:var(--fg);border-radius:14px;text-align:center;">
  <span class="${item.cls}">${w.eyebrow}</span>
</div>`;
  } else if (catKey === 'preloader') {
    extraCSS = baseTokens + '\n' + extractMatchingCSSRules(['.f-scroll-laser', 'curtainLeft', 'curtainRight', 'curtainFadeOut', '.f-intro-curtain']);
    bodyHTML = `<div class="${pal.cls}" style="position:relative;min-height:280px;background:var(--bg);color:var(--fg);border-radius:14px;border:1px solid var(--border);overflow:hidden;padding:32px;">
  <div class="f-scroll-laser" style="--scroll-pct:72%;"></div>
  <h2 style="margin-top:20px;">[${item.id}] ${item.name}</h2>
  <p style="color:var(--sub);font-size:14px;">${item.desc}</p>
</div>`;
  } else {
    /* Widget or Full-Page Architectural Section (14 ~ 26) */
    const rawHTML = (typeof item.render === 'function' ? item.render(w, ctx) : '') || `<!-- [${item.id}] ${item.name}: 미니멀 여백 슬롯 -->`;
    extraCSS = document.getElementById('forma-core-css')?.textContent || '';
    bodyHTML = `<div class="f-site ${pal.cls} ${fnt.cls} ${tfx.cls} ${getAsset('surface', state.equipped.surface).cls} ${getAsset('imgstyle', state.equipped.imgstyle).cls} ${getAsset('inputui', state.equipped.inputui).cls || ''}">
${rawHTML}
</div>`;
    scriptJS = `let ambientAudio = null;
function showStudioToast(m){
  let t = document.getElementById('sa-toast');
  if(!t){ t = document.createElement('div'); t.id='sa-toast'; t.style.cssText='position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#F8FAFC;color:#090A0D;padding:8px 16px;border-radius:999px;font-size:12px;font-weight:700;z-index:999;box-shadow:0 12px 30px rgba(0,0,0,0.4);'; document.body.appendChild(t); }
  t.textContent = m; t.style.opacity = '1'; clearTimeout(t._tm); t._tm = setTimeout(()=>t.style.opacity='0', 2200);
}
${toggleAmbientSynth.toString()}
${toggleBillingCycle.toString()}
${filterGalleryItems.toString()}
${selectFormPlan.toString()}
document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    btn.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});`;
  }

  const cleanBodyForCopy = bodyHTML
    .replace(/data:image\/webp;base64,[^"'\s)]+/g, 'assets/editorial-sample.webp')
    .replace(/__SAMPLE_IMG__/g, 'assets/editorial-sample.webp');

  const liveBodyForIframe = bodyHTML.replace(/__SAMPLE_IMG__/g, IMG[w.heroImg]);

  const codeText = `<!-- =====================================================================
     FORMA STUDIO v6 STANDALONE ASSET: [${item.id}] ${item.name}
     Category: ${catKey.toUpperCase()} | ${item.desc}
     ===================================================================== -->
<style>
  *, *::before, *::after { box-sizing: border-box; }
${extraCSS.trim()}
</style>

${cleanBodyForCopy.trim()}
${scriptJS ? `\n<script>\n${scriptJS.trim()}\n<\/script>` : ''}`;

  const fontsCSS = document.getElementById('forma-fonts-css')?.textContent || '';
  const previewDoc = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"/><style>${fontsCSS}\nbody{margin:0;padding:20px;background:#0D0F15;font-family:'Plus Jakarta Sans','IBM Plex Sans KR',"Pretendard Variable","Pretendard","Apple SD Gothic Neo","Malgun Gothic","Noto Sans CJK KR",sans-serif;}\n*,*::before,*::after{box-sizing:border-box;}\n${extraCSS}</style></head><body>${liveBodyForIframe}${scriptJS ? `<script>${scriptJS}<\/script>` : ''}</body></html>`;

  return { codeText, previewDoc, item };
}

function setExportModalTab(tab) {
  state.exportTab = tab;
  const codeBtn = document.getElementById('exp-tab-code');
  const prevBtn = document.getElementById('exp-tab-preview');
  const codeArea = document.getElementById('export-code-area');
  const prevFrame = document.getElementById('export-preview-frame');
  if (codeBtn) codeBtn.classList.toggle('is-active', tab === 'code');
  if (prevBtn) prevBtn.classList.toggle('is-active', tab === 'preview');
  if (codeArea) codeArea.style.display = tab === 'code' ? 'block' : 'none';
  if (prevFrame) {
    prevFrame.style.display = tab === 'preview' ? 'block' : 'none';
    if (tab === 'preview' && state.lastExportPreviewDoc) {
      prevFrame.srcdoc = state.lastExportPreviewDoc;
    }
  }
}

function openSingleAssetCode(catKey, assetId) {
  const pkg = buildStandaloneAssetPackage(catKey, assetId);
  state.lastExportPreviewDoc = pkg.previewDoc;

  document.getElementById('export-modal-tag').textContent = `SELF-CONTAINED ASSET (CSS + HTML + JS) · ${pkg.item.id}`;
  document.getElementById('export-modal-title').textContent = `[${pkg.item.id}] ${pkg.item.name} — 단독 실행 가능 코드`;
  document.getElementById('export-code-area').value = pkg.codeText;
  setExportModalTab('code');
  document.getElementById('export-modal').classList.add('is-open');
}

function openFullWebsiteExport() {
  const w = getCurrentWorldObj();
  const coreCSS = document.getElementById('forma-core-css')?.textContent || '';
  const fontsCSS = document.getElementById('forma-fonts-css')?.textContent || '';
  const root = document.getElementById('hp-root');
  if (!root) return;

  const cleanCloneNodeToHTML = (node) => {
    let rawHTML = '';
    if (node && typeof node.cloneNode === 'function' && typeof node.querySelectorAll === 'function' && node.outerHTML) {
      const clone = node.cloneNode(true);
      clone.querySelectorAll('.f-sec-pill, .f-sec-resize-bar, .f-blank-guide, #floating-work-preview, #hp-live-curtain').forEach(el => el.remove());
      clone.querySelectorAll('.is-waiting').forEach(el => el.classList.remove('is-waiting'));
      clone.querySelectorAll('[data-live-editing]').forEach(el => {
        el.removeAttribute('contenteditable');
        el.removeAttribute('data-live-editing');
      });
      clone.classList.remove('guides-on', 'is-editing', 'is-move-mode');
      rawHTML = clone.outerHTML.replace(/\b(guides-on|is-editing|is-move-mode)\b/g, '');
    } else {
      const fallbackSrc = (node && (node.outerHTML || node.innerHTML)) || document.getElementById('website-mount')?.innerHTML || '';
      rawHTML = String(fallbackSrc).replace(/\b(guides-on|is-editing|is-move-mode)\b/g, '');
    }
    return (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.resolveAssetRef)
      ? FORMA_PRO.ProjectState.resolveAssetRef(rawHTML)
      : rawHTML;
  };

  let liveCloneHTML = cleanCloneNodeToHTML(root);
  const exportedPagesMap = {};
  const doc = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.getDoc)
    ? FORMA_PRO.ProjectState.getDoc()
    : null;
  if (doc && Array.isArray(doc.pages) && doc.pages.length > 0 && typeof FORMA_PRO.ProjectState?.switchPage === 'function') {
    const origPageId = doc.activePageId;
    doc.pages.forEach(p => {
      FORMA_PRO.ProjectState.switchPage(p.id, false);
      const curRoot = document.getElementById('hp-root');
      if (curRoot) {
        exportedPagesMap[p.slug] = cleanCloneNodeToHTML(curRoot);
      }
    });
    FORMA_PRO.ProjectState.switchPage(origPageId, false);
    if (exportedPagesMap.home) {
      liveCloneHTML = exportedPagesMap.home;
    } else {
      const restoredRoot = document.getElementById('hp-root');
      if (restoredRoot) liveCloneHTML = cleanCloneNodeToHTML(restoredRoot);
    }
  }

  const cleanHTML = liveCloneHTML;
  const shd = getAsset('shader', state.equipped.shader);
  const summary = CATEGORIES.map(c => `${c.key}:${state.equipped[c.key]}`).join(' | ');
  const serializedPagesJSON = JSON.stringify(exportedPagesMap).replace(/<\//g, '<\\/');

  const standaloneScript = `
    let ambientAudio = null;
    let shaderRAF = null;
    const EXPORTED_PAGES = ${serializedPagesJSON};
    function showStudioToast(m){
      let t = document.getElementById('sa-toast');
      if(!t){ t = document.createElement('div'); t.id='sa-toast'; t.style.cssText='position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#F8FAFC;color:#090A0D;padding:8px 16px;border-radius:999px;font-size:12px;font-weight:700;z-index:999;box-shadow:0 12px 30px rgba(0,0,0,0.4);'; document.body.appendChild(t); }
      t.textContent = m; t.style.opacity = '1'; clearTimeout(t._tm); t._tm = setTimeout(()=>t.style.opacity='0', 2200);
    }
    ${toggleAmbientSynth.toString()}
    ${toggleBillingCycle.toString()}
    ${filterGalleryItems.toString()}
    ${selectFormPlan.toString()}
    ${drawShaderFrame.toString()}
    ${initShaderEngine.toString()}
    function bindStandaloneInteractions() {
      initShaderEngine(${JSON.stringify(shd.mode || 'aurora')});
      document.querySelectorAll('[data-custom-href]').forEach(el => {
        el.addEventListener('click', e => {
          const href = el.getAttribute('data-custom-href');
          if (!href) return;
          e.preventDefault();
          if (href.startsWith('#/')) {
            formaNavigatePage(href.slice(2), e);
          } else if (href.startsWith('#')) {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.open(href, '_blank', 'noopener');
          }
        });
      });
      document.querySelectorAll('[data-page-link], a[href^="#/"]').forEach(el => {
        el.addEventListener('click', e => {
          const slug = el.getAttribute('data-page-link') || (el.getAttribute('href') || '').replace(/^#\\/?/, '');
          if (slug) formaNavigatePage(slug, e);
        });
      });
      document.querySelectorAll('.f-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          btn.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          btn.style.setProperty('--my', (e.clientY - r.top) + 'px');
          if (btn.dataset.uiMoved === '1') return;
          if (btn.classList.contains('f-magnetic')) {
            btn.style.transform = 'translate(' + ((e.clientX - r.left - r.width/2)*0.25).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height/2)*0.3).toFixed(1) + 'px)';
          }
        });
        btn.addEventListener('mouseleave', () => {
          if (btn.dataset.uiMoved === '1') return;
          btn.style.transform = '';
        });
      });
    }
    function formaNavigatePage(slug, ev) {
      if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
      const clean = String(slug || '').replace(/^#\\/?/, '').trim() || 'home';
      const html = EXPORTED_PAGES[clean];
      if (!html) return false;
      const curRoot = document.getElementById('hp-root');
      if (curRoot) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        if (tmp.firstElementChild) curRoot.replaceWith(tmp.firstElementChild);
      }
      try {
        if (window.location.hash !== '#/' + clean) window.location.hash = '#/' + clean;
      } catch (_) {}
      window.scrollTo(0, 0);
      bindStandaloneInteractions();
      return false;
    }
    window.addEventListener('hashchange', () => {
      const slug = (window.location.hash || '').replace(/^#\\/?/, '').trim();
      if (slug && EXPORTED_PAGES[slug]) formaNavigatePage(slug);
    });
    document.addEventListener('mousemove', e => {
      document.querySelectorAll('.f-card').forEach(c => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--cmx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--cmy', (e.clientY - r.top) + 'px');
      });
    });
    bindStandaloneInteractions();
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      formaNavigatePage(window.location.hash.slice(2));
    }`;

  const standaloneDoc = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${w.brand} — ${w.eyebrow}</title>
  <meta name="description" content="${w.h1Sub}" />
  <!-- FORMA STUDIO Pro Assembled 26-Slot Combination: ${summary} -->
  <style>
${fontsCSS}
    html, body { margin: 0; padding: 0; overflow-x: hidden; overflow-y: auto !important; height: auto !important; }
${coreCSS}
  </style>
</head>
<body>
${cleanHTML}
  <script>${standaloneScript}
  <\/script>
</body>
</html>`;

  state.lastExportPreviewDoc = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"/><style>${fontsCSS}\nhtml,body{margin:0;padding:0;overflow-x:hidden;}\n${coreCSS}</style></head><body>${liveCloneHTML}<script>${standaloneScript}<\/script></body></html>`;

  document.getElementById('export-modal-tag').textContent = 'COMPLETE 26-SLOT SELF-CONTAINED PRODUCTION HTML';
  document.getElementById('export-modal-title').textContent = `${w.brand} — 완성된 풀 홈페이지 전체 소스코드`;
  document.getElementById('export-code-area').value = standaloneDoc;
  setExportModalTab('code');
  document.getElementById('export-modal').classList.add('is-open');
}

function copyExportCode() {
  const val = document.getElementById('export-code-area')?.value || '';
  navigator.clipboard?.writeText(val).then(() => {
    document.getElementById('export-modal')?.classList.remove('is-open');
    showStudioToast('소스코드 전체가 클립보드에 복사되었습니다.');
  });
}

function downloadExportHTML() {
  const val = document.getElementById('export-code-area')?.value || '';
  if (typeof Blob === 'undefined') return;
  const blob = new Blob([val], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.worldKey}-forma-site.html`;
  a.click();
  URL.revokeObjectURL(url);
  showStudioToast('완성 홈페이지 HTML 파일 다운로드가 시작되었습니다.');
}

function downloadStudioSelfHTML() {
  if (typeof Blob === 'undefined' || !document.documentElement) return;
  const doc = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.getDoc)
    ? FORMA_PRO.ProjectState.getDoc()
    : null;

  const clone = document.documentElement.cloneNode(true);
  clone.classList.remove('is-client-mode');
  if (doc && clone.querySelector) {
    let bootEl = clone.querySelector('#forma-boot-project');
    if (!bootEl) {
      bootEl = document.createElement('script');
      bootEl.id = 'forma-boot-project';
      bootEl.type = 'application/json';
      const bodyEl = clone.querySelector('body') || clone;
      bodyEl.insertBefore(bootEl, bodyEl.firstChild);
    }
    bootEl.textContent = JSON.stringify(doc).replace(/<\//g, '<\\/');
  }

  [
    'website-mount', 'st-subbar', 'st-drawer-cat-head',
    'st-drawer-cards', 'st-hidden-secs-bar', 'st-tune-popover', 'st-photo-popover',
    'vault-toolbar', 'vault-cats-bar', 'vault-cards-grid', 'st-drag-ghost'
  ].forEach(id => {
    const el = clone.querySelector ? clone.querySelector('#' + id) : null;
    if (el) el.innerHTML = '';
  });
  ['st-ui-sel-box', 'st-ui-toolbar', 'st-photo-popover', 'st-drag-ghost', 'st-sec-drop-line', 'st-snap-guide-x', 'st-snap-guide-y', 'st-marquee-box', 'st-context-menu'].forEach(id => {
    const el = clone.querySelector ? clone.querySelector('#' + id) : null;
    if (el) el.style.display = 'none';
  });
  clone.querySelectorAll?.('.is-open, .is-visible, .is-drop-hot, .is-dragging').forEach(el => {
    el.classList.remove('is-open', 'is-visible', 'is-drop-hot', 'is-dragging');
  });
  const appEl = clone.querySelector ? clone.querySelector('#studio-app') : null;
  if (appEl) {
    appEl.removeAttribute('style');
    appEl.classList.remove('is-presentation');
  }
  const fullHTML = '<!DOCTYPE html>\n' + clone.outerHTML;
  if (typeof window !== 'undefined') {
    window.__lastSelfStudioHTML = fullHTML;
  }
  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FORMA_STUDIO_Pro.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showStudioToast('FORMA_STUDIO_Pro.html 다운로드 시작! 현재 모든 페이지·수정이 함께 내장되었습니다.');
}

/* ==========================================================================
   VIEWPORT SYNC (496px Inline Embed <-> Full-Height Side Pane) & BOOT
   ========================================================================== */
function syncStudioViewportHeight() {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.()) return;
  const app = document.getElementById('studio-app');
  if (!app || typeof window === 'undefined') return;
  if (window.innerHeight > 540) {
    app.style.height = window.innerHeight + 'px';
    app.style.borderRadius = '0px';
    app.style.border = 'none';
    document.body.style.background = '#090A0E';
  } else {
    app.style.height = '496px';
    app.style.borderRadius = '12px';
    app.style.border = '1px solid rgba(255, 255, 255, 0.11)';
    document.body.style.background = 'transparent';
  }
  syncDrawerSectionZoom();
}

window.addEventListener('DOMContentLoaded', () => {
  // 1. Hydrate ProjectDocument v2 synchronously from #forma-boot-project or localStorage
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.hydrateProjectStateSync) {
    FORMA_PRO.ProjectState.hydrateProjectStateSync();
  }

  // 2. If ?mode=client is active, boot Zero-Chrome Client Preview Runtime immediately
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.()) {
    initDragAndDropSystem();
    initCustomCursorSystem();
    FORMA_PRO.ClientMode.bootClientModeRuntime();
    return;
  }

  syncStudioViewportHeight();
  // Keep the pure visual UI tray OPEN side-by-side next to the live canvas on Desktop & Inline embeds (>= 660px)!
  if (typeof window !== 'undefined' && window.innerWidth < 660) {
    state.sidebarOpen = false;
    document.getElementById('st-sidebar')?.classList.add('is-collapsed');
    const btn = document.getElementById('sidebar-toggle-btn');
    if (btn) btn.textContent = '◨ UI패널';
  }
  window.addEventListener('resize', syncStudioViewportHeight);
  window.addEventListener('beforeunload', () => {
    FORMA_PRO.ProjectState?.flushAutosaveNow?.();
  });

  updateUndoButtonUI();
  if (typeof renderPageTabsUI === 'function') renderPageTabsUI();
  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();
  initDragAndDropSystem();
  initCustomCursorSystem();
  FORMA_PRO.ProjectState?.hydrateProjectStateFromIDBAsync?.();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideCanvasContextMenu();
      clearSelectedCanvasUI();
      if (state.presentation) togglePresentationMode(false);
      if (state.tuneOpen) toggleTunePopover(false);
      document.getElementById('export-modal')?.classList.remove('is-open');
      document.getElementById('lightbox-modal')?.classList.remove('is-open');
      document.getElementById('projects-modal')?.classList.remove('is-open');
      document.getElementById('brand-restyler-modal')?.classList.remove('is-open');
      document.getElementById('client-share-modal')?.classList.remove('is-open');
    }
    const isFormInput = Boolean(/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName || ''));
    const isActivelyTypingInline = Boolean(
      e.target?.dataset?.liveEditing === '1' ||
      (e.target?.isContentEditable && document.activeElement === e.target)
    );
    const isEditingTarget = Boolean(isFormInput || isActivelyTypingInline || state.inlineEdit);

    if (!isEditingTarget && selectedCanvasEl) {
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowLeft') { e.preventDefault(); nudgeSelectedUI(-step, 0); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); nudgeSelectedUI(step, 0); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); nudgeSelectedUI(0, -step); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); nudgeSelectedUI(0, step); return; }
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && !isEditingTarget && selectedCanvasEl) {
      e.preventDefault();
      deleteSelectedUI();
    }
    if (e.metaKey || e.ctrlKey) {
      const k = e.key.toLowerCase();
      if (!isFormInput && k === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (isActivelyTypingInline && typeof document.activeElement?.blur === 'function') {
          document.activeElement.blur();
        }
        undoLastAction();
        return;
      }
      if (!isFormInput && ((k === 'z' && e.shiftKey) || k === 'y')) {
        e.preventDefault();
        if (isActivelyTypingInline && typeof document.activeElement?.blur === 'function') {
          document.activeElement.blur();
        }
        redoLastAction();
        return;
      }
      if (!isEditingTarget) {
        if (k === 'd' && selectedCanvasEl) {
          e.preventDefault();
          duplicateSelectedUI();
        } else if (k === 'c' && selectedCanvasEl) {
          e.preventDefault();
          copySelectedUI();
        } else if (k === 'v') {
          e.preventDefault();
          pasteCopiedUI();
        } else if (k === 'k') {
          e.preventDefault();
          setStudioMode(state.mode === 'vault' ? 'builder' : 'vault');
          setTimeout(() => document.getElementById('vault-search-input')?.focus(), 60);
        }
      }
    }
  });
});
