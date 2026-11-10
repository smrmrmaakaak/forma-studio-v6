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

const state = {
  mode: 'builder',          // 'builder' | 'vault'
  presentation: false,
  sidebarOpen: true,
  sideTab: 'slots',         // 'slots' | 'composer' | 'tokens'
  viewport: 'desktop',      // 'desktop' | 'tablet' | 'mobile'
  guidesOn: true,
  inlineEdit: false,
  worldKey: 'maison',
  activeCat: 'button',
  vaultFilter: 'all',
  vaultQuery: '',
  reviewIdx: 0,
  proposalSlot: 'A',
  proposals: makeInitialProposals(),
  exportTab: 'code',        // 'code' | 'preview'
  lastExportPreviewDoc: '',
  tokens: {
    radius: 10,
    density: 'balanced',    // 'compact' | 'balanced' | 'editorial'
    grain: 0.035,
    customAccent: null
  },
  secOrder: [...DEFAULT_SEC_ORDER],
  secEnabled: DEFAULT_SEC_ORDER.reduce((acc, k) => { acc[k] = true; return acc; }, {}),
  equipped: { ...WORLDS.maison.preset }
};

function getAsset(catKey, id) {
  const list = VAULT[catKey] || [];
  return list.find(x => x.id === id) || list[0];
}

function showStudioToast(msg) {
  const t = document.getElementById('st-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('is-visible'), 2500);
}

/* ==========================================================================
   QUICK SUBBAR + CLIENT A/B/C PROPOSAL SWITCHER
   ========================================================================== */
function renderQuickSubbar() {
  const el = document.getElementById('st-subbar');
  if (!el) return;

  const quickKeys = [
    ['palette', '컬러'],
    ['font', '서체'],
    ['button', '버튼'],
    ['surface', '카드'],
    ['hero', '히어로']
  ];

  const chips = quickKeys.map(([k, lbl]) => {
    const eq = getAsset(k, state.equipped[k]);
    const shortName = eq.name.length > 11 ? eq.name.slice(0, 11) + '…' : eq.name;
    return `<div class="st-qchip">
      <button type="button" onclick="cycleSlot('${k}', -1, event)" title="이전 ${lbl}">‹</button>
      <span class="st-qchip-lbl" onclick="setStudioMode('builder');selectSlotCategory('${k}')" title="클릭하여 ${lbl} 목록 열기">${lbl}: <strong style="color:#F8FAFC;">${shortName}</strong></span>
      <button type="button" onclick="cycleSlot('${k}', 1, event)" title="다음 ${lbl}">›</button>
    </div>`;
  }).join('');

  const propBtns = ['A', 'B', 'C'].map(slot => {
    const isAct = state.proposalSlot === slot;
    return `<button type="button" onclick="loadProposalSlot('${slot}')" class="st-pill-btn ${isAct ? 'is-primary' : ''}" style="padding:3px 9px;font-size:12px;" title="${state.proposals[slot].label}">시안 ${slot}</button>`;
  }).join('');

  el.innerHTML = `
    <div class="st-quick-strip">
      ${chips}
    </div>
    <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
      <span style="font-size:12px;color:#94A3B8;margin-right:2px;" class="hide-narrow">고객 제안 비교:</span>
      ${propBtns}
      <button type="button" onclick="saveCurrentToProposalSlot()" class="st-pill-btn hide-narrow" style="padding:3px 9px;" title="현재 조합을 시안 ${state.proposalSlot}에 덮어쓰기">💾 시안${state.proposalSlot} 저장</button>
      <button type="button" onclick="triggerIntroCurtain()" class="st-pill-btn" style="padding:3px 9px;" title="Awwwards풍 인트로 커튼 오프닝 시연">🎬 인트로 시연</button>
    </div>
  `;
}

function loadProposalSlot(slot) {
  const snap = state.proposals[slot];
  if (!snap) return;
  state.proposalSlot = slot;
  state.worldKey = snap.worldKey || state.worldKey;
  const sel = document.getElementById('world-select');
  if (sel) sel.value = state.worldKey;
  state.equipped = { ...snap.equipped };
  state.tokens = { ...snap.tokens };
  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();
  if (state.mode === 'vault') renderVaultView();
  showStudioToast(`[시안 ${slot}] 디자인 조합으로 즉시 전환되었습니다.`);
}

function saveCurrentToProposalSlot() {
  const slot = state.proposalSlot;
  state.proposals[slot] = {
    label: `시안 ${slot} · 커스텀 저장본`,
    worldKey: state.worldKey,
    equipped: { ...state.equipped },
    tokens: { ...state.tokens }
  };
  renderQuickSubbar();
  showStudioToast(`현재 26개 슬롯 조합이 [시안 ${slot}]에 저장되었습니다.`);
}

/* ==========================================================================
   MODE, SIDEBAR, VIEWPORT & WORLD CONTROLS
   ========================================================================== */
let vaultShaderRAF = null;

function setStudioMode(mode) {
  state.mode = mode;
  document.getElementById('mode-btn-builder')?.classList.toggle('is-active', mode === 'builder');
  document.getElementById('mode-btn-vault')?.classList.toggle('is-active', mode === 'vault');
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
  document.getElementById('studio-app')?.classList.toggle('is-presentation', state.presentation);
  if (state.presentation) {
    setStudioMode('builder');
    showStudioToast('고객 프레젠테이션 풀스크린 모드 (ESC 또는 우측 상단 버튼으로 복귀)');
  }
}

function toggleSidebar() {
  state.sidebarOpen = !state.sidebarOpen;
  document.getElementById('st-sidebar')?.classList.toggle('is-collapsed', !state.sidebarOpen);
  const btn = document.getElementById('sidebar-toggle-btn');
  if (btn) btn.textContent = state.sidebarOpen ? '◧ 패널 접기' : '◨ 에셋 패널 열기';
}

function setSideTab(tab) {
  state.sideTab = tab;
  ['slots', 'composer', 'tokens'].forEach(k => {
    document.getElementById(`stab-${k}`)?.classList.toggle('is-active', k === tab);
  });
  renderSidebarBody();
}

function setViewportSize(vp) {
  state.viewport = vp;
  const cf = document.getElementById('canvas-frame');
  if (cf) {
    cf.classList.remove('vp-tablet', 'vp-mobile');
    if (vp === 'tablet') cf.classList.add('vp-tablet');
    if (vp === 'mobile') cf.classList.add('vp-mobile');
  }
  ['desktop', 'tablet', 'mobile'].forEach(k => {
    document.getElementById(`vp-btn-${k}`)?.classList.toggle('is-active', k === vp);
  });
}

function toggleInlineEdit() {
  state.inlineEdit = !state.inlineEdit;
  document.getElementById('inline-edit-btn')?.classList.toggle('is-active', state.inlineEdit);
  const site = document.getElementById('hp-root');
  if (site) {
    site.classList.toggle('is-editing', state.inlineEdit);
    site.querySelectorAll('h1, h2, h3, p, blockquote').forEach(el => {
      el.contentEditable = state.inlineEdit ? 'true' : 'false';
    });
  }
  showStudioToast(state.inlineEdit ? '문구 직접 수정 ON: 홈페이지의 제목·본문을 클릭해 바로 타이핑하세요.' : '문구 직접 수정 모드를 종료했습니다.');
}

function switchWorld(worldKey) {
  const w = WORLDS[worldKey];
  if (!w) return;
  state.worldKey = worldKey;
  state.tokens.customAccent = null;
  state.equipped = { ...w.preset };
  state.reviewIdx = 0;
  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();
  if (state.mode === 'vault') renderVaultView();
  document.getElementById('canvas-frame')?.scrollTo({ top: 0, behavior: 'smooth' });
  showStudioToast(`${w.brand} 월드와 26개 전용 에셋 조합이 장착되었습니다.`);
}

function randomizeCombination() {
  CATEGORIES.forEach(c => {
    const list = VAULT[c.key] || [];
    if (list.length) {
      const nonEmpty = list.filter(item => item.mode !== 'off' && item.mode !== 'none' && item.id !== 'TOP-08' && item.id !== 'DIV-08' && item.id !== 'WGT-10' && item.id !== 'MOT-08');
      const pool = nonEmpty.length ? nonEmpty : list;
      state.equipped[c.key] = pool[Math.floor(Math.random() * pool.length)].id;
    }
  });
  state.tokens.customAccent = null;
  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();
  if (state.mode === 'vault') renderVaultView();
  showStudioToast('26개 슬롯 전체를 새로운 아틀리에 조합으로 믹스매치했습니다.');
}

function selectSlotCategory(catKey) {
  state.activeCat = catKey;
  if (state.sideTab !== 'slots') {
    state.sideTab = 'slots';
    ['slots', 'composer', 'tokens'].forEach(k => {
      document.getElementById(`stab-${k}`)?.classList.toggle('is-active', k === 'slots');
    });
  }
  renderSidebarBody();
  const meta = CATEGORIES.find(c => c.key === catKey);
  if (meta?.secId && state.mode === 'builder') {
    document.getElementById(meta.secId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function equipAsset(catKey, assetId, jumpToBuilder = false) {
  state.equipped[catKey] = assetId;
  if (catKey === 'palette') state.tokens.customAccent = null;
  state.activeCat = catKey;
  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();

  if (state.mode === 'vault') {
    if (jumpToBuilder) setStudioMode('builder');
    else renderVaultView();
  }

  const item = getAsset(catKey, assetId);
  if (catKey === 'preloader' && (item.mode === 'splitCurtain' || item.mode === 'monogramCurtain' || item.mode === 'shutterCurtain')) {
    setTimeout(() => triggerIntroCurtain(item.mode), 60);
  } else {
    const meta = CATEGORIES.find(c => c.key === catKey);
    if (meta?.secId && state.mode === 'builder') {
      setTimeout(() => document.getElementById(meta.secId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 40);
    }
  }
  showStudioToast(`[${item.id}] ${item.name} 장착 완료`);
}

function cycleSlot(catKey, dir, ev) {
  if (ev) ev.stopPropagation();
  const list = VAULT[catKey] || [];
  if (!list.length) return;
  const idx = list.findIndex(x => x.id === state.equipped[catKey]);
  const next = list[(idx + dir + list.length) % list.length];
  equipAsset(catKey, next.id);
}

function moveSectionOrder(secKey, dir) {
  const idx = state.secOrder.indexOf(secKey);
  const target = idx + dir;
  if (idx < 0 || target < 0 || target >= state.secOrder.length) return;
  const arr = [...state.secOrder];
  [arr[idx], arr[target]] = [arr[target], arr[idx]];
  state.secOrder = arr;
  renderSidebarBody();
  renderLiveWebsite();
}

function toggleSectionVisible(secKey) {
  state.secEnabled[secKey] = !state.secEnabled[secKey];
  renderSidebarBody();
  renderLiveWebsite();
}

function updateToken(key, val) {
  if (key === 'radius') state.tokens.radius = Number(val);
  if (key === 'density') state.tokens.density = val;
  if (key === 'grain') state.tokens.grain = Number(val);
  if (key === 'customAccent') state.tokens.customAccent = val;
  if (key === 'guidesOn') state.guidesOn = Boolean(val);
  renderSidebarBody();
  renderLiveWebsite();
}

/* ==========================================================================
   SIDEBAR RENDERING (26 Slots / Section Composer / Fine-Tuning)
   ========================================================================== */
function renderMiniStagePreview(catKey, item) {
  const pal = getAsset('palette', state.equipped.palette);
  const fnt = getAsset('font', state.equipped.font);
  if (catKey === 'palette') {
    return `<div style="display:flex;align-items:center;gap:6px;margin-top:8px;">
      ${item.swatches.map(hex => `<span style="width:22px;height:22px;border-radius:6px;background:${hex};border:1px solid rgba(255,255,255,0.22);"></span>`).join('')}
      <span class="f-mono" style="font-size:12px;color:#94A3B8;margin-left:4px;">${item.swatches.join(' · ')}</span>
    </div>`;
  }
  if (catKey === 'font') {
    return `<div class="${pal.cls} ${item.cls}" style="margin-top:8px;padding:10px 12px;border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--font-display);font-weight:var(--display-weight);font-size:16px;">${item.sample}</div>`;
  }
  if (catKey === 'textfx') {
    return `<div class="${pal.cls} ${fnt.cls} ${item.cls}" style="margin-top:8px;padding:10px 12px;border-radius:8px;background:var(--bg);color:var(--fg);"><div class="f-h3" style="font-size:16px;">시간의 결 <span class="f-accent-word" data-scramble="건축 미학">건축 미학</span></div></div>`;
  }
  if (catKey === 'button') {
    return `<div class="${pal.cls} ${fnt.cls}" style="margin-top:8px;padding:12px;border-radius:8px;background:var(--bg);color:var(--fg);display:flex;justify-content:center;zoom:0.86;">${item.render('인터랙션 테스트')}</div>`;
  }
  if (catKey === 'surface') {
    return `<div class="${pal.cls} ${item.cls}" style="margin-top:8px;padding:8px;border-radius:8px;background:var(--bg);"><div class="f-card" style="padding:10px 12px;font-size:12px;font-weight:700;">${item.id} · 카드 표면 프리뷰</div></div>`;
  }
  if (catKey === 'imgstyle') {
    return `<div class="${pal.cls} ${item.cls}" style="margin-top:8px;padding:10px;border-radius:8px;background:var(--bg);display:flex;justify-content:center;"><div class="f-media" style="width:124px;height:74px;"><img src="${IMG.courtyard}" alt="Mask"/></div></div>`;
  }
  if (catKey === 'inputui' && typeof item.demo === 'function') {
    return `<div class="${pal.cls} ${fnt.cls}" onclick="event.stopPropagation()" style="margin-top:8px;padding:10px;border-radius:8px;background:var(--bg);color:var(--fg);display:flex;justify-content:center;zoom:0.88;">${item.demo()}</div>`;
  }
  if (catKey === 'badge') {
    return `<div class="${pal.cls}" style="margin-top:8px;padding:10px 12px;border-radius:8px;background:var(--bg);color:var(--fg);"><span class="${item.cls}">ARCHIVE 2026</span></div>`;
  }
  return '';
}

function renderSidebarBody() {
  const container = document.getElementById('st-side-body');
  if (!container) return;

  if (state.sideTab === 'slots') {
    const globalCats = CATEGORIES.filter(c => c.group === 'global');
    const secCats = CATEGORIES.filter(c => c.group === 'section');
    const activeMeta = CATEGORIES.find(c => c.key === state.activeCat) || CATEGORIES[0];
    const activeList = VAULT[activeMeta.key] || [];
    const eqId = state.equipped[activeMeta.key];

    container.innerHTML = `
      <div class="st-cat-group-label">
        <span>그룹 A · 단위 에셋·서체·물리 (13)</span>
        <span class="f-mono" style="font-size:12px;color:#64748B;">134종</span>
      </div>
      <div class="st-slot-grid">
        ${globalCats.map(c => {
          const eq = getAsset(c.key, state.equipped[c.key]);
          return `<button type="button" onclick="selectSlotCategory('${c.key}')" class="st-slot-chip ${state.activeCat===c.key?'is-active':''}">
            <div class="st-slot-top"><span>${c.num}. ${c.name}</span></div>
            <div class="st-slot-sub">${eq.name}</div>
          </button>`;
        }).join('')}
      </div>

      <div class="st-cat-group-label" style="padding-top:4px;">
        <span>그룹 B · 풀페이지 섹션 블록 (13)</span>
        <span class="f-mono" style="font-size:12px;color:#64748B;">118종</span>
      </div>
      <div class="st-slot-grid">
        ${secCats.map(c => {
          const eq = getAsset(c.key, state.equipped[c.key]);
          return `<button type="button" onclick="selectSlotCategory('${c.key}')" class="st-slot-chip ${state.activeCat===c.key?'is-active':''}">
            <div class="st-slot-top"><span>${c.num}. ${c.name}</span></div>
            <div class="st-slot-sub">${eq.name}</div>
          </button>`;
        }).join('')}
      </div>

      <div class="st-picker-head">
        <div style="font-size:12px;font-weight:700;color:#F8FAFC;">${activeMeta.num}. ${activeMeta.name} (${activeList.length}종)</div>
        <div style="display:flex;gap:4px;">
          <button type="button" onclick="setStudioMode('vault');setVaultFilter('${activeMeta.key}')" class="st-pill-btn" style="padding:3px 8px;" title="크게 비교하기">확대비교</button>
          <button type="button" onclick="cycleSlot('${activeMeta.key}', -1)" class="st-pill-btn" style="padding:3px 9px;">‹</button>
          <button type="button" onclick="cycleSlot('${activeMeta.key}', 1)" class="st-pill-btn" style="padding:3px 9px;">›</button>
        </div>
      </div>

      <div class="st-picker-list">
        ${activeList.map(item => {
          const isEq = item.id === eqId;
          return `<div onclick="equipAsset('${activeMeta.key}', '${item.id}')" class="st-asset-item ${isEq?'is-equipped':''}">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <div style="font-size:12px;font-weight:700;color:#F8FAFC;">${item.name}</div>
              <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
                <button type="button" onclick="event.stopPropagation();openSingleAssetCode('${activeMeta.key}','${item.id}')" style="background:rgba(255,255,255,0.09);border:none;color:#E2E8F0;font-family:'JetBrains Mono',monospace;font-size:12px;padding:3px 7px;border-radius:5px;cursor:pointer;" title="완전 동작 단독 코드 추출">&lt;/&gt;</button>
                <span class="f-mono" style="font-size:12px;padding:2px 7px;border-radius:5px;background:${isEq?'#F8FAFC':'rgba(255,255,255,0.07)'};color:${isEq?'#090A0D':'#94A3B8'};font-weight:700;">${isEq?'장착됨':item.id}</span>
              </div>
            </div>
            <div style="font-size:12px;color:#8A94A6;margin-top:4px;line-height:1.45;">${item.desc}</div>
            ${renderMiniStagePreview(activeMeta.key, item)}
          </div>`;
        }).join('')}
      </div>
    `;
    return;
  }

  if (state.sideTab === 'composer') {
    container.innerHTML = `
      <div style="padding:14px 12px;">
        <div style="font-size:12px;color:#94A3B8;margin-bottom:12px;line-height:1.5;">
          13개 풀페이지 섹션의 배치 순서를 위·아래(↑↓)로 변경하거나 ON/OFF 할 수 있습니다.
        </div>
        <div style="display:flex;flex-direction:column;gap:7px;">
          ${state.secOrder.map((secKey, idx) => {
            const meta = CATEGORIES.find(c => c.key === secKey);
            const on = state.secEnabled[secKey];
            const eq = getAsset(secKey, state.equipped[secKey]);
            return `<div style="padding:10px 11px;border-radius:9px;background:#14171F;border:1px solid rgba(255,255,255,0.08);opacity:${on?1:0.48};">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                <div style="font-size:12px;font-weight:700;color:#F8FAFC;cursor:pointer;" onclick="document.getElementById('sec-${secKey}')?.scrollIntoView({behavior:'smooth'})">${idx+1}. ${meta.name}</div>
                <div style="display:flex;gap:4px;">
                  <button type="button" onclick="moveSectionOrder('${secKey}',-1)" class="st-pill-btn" style="padding:2px 7px;">↑</button>
                  <button type="button" onclick="moveSectionOrder('${secKey}',1)" class="st-pill-btn" style="padding:2px 7px;">↓</button>
                  <button type="button" onclick="toggleSectionVisible('${secKey}')" class="st-pill-btn ${on?'is-active':''}" style="padding:2px 8px;">${on?'ON':'OFF'}</button>
                </div>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:7px;font-size:12px;color:#8A94A6;">
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${eq.name}</span>
                <div style="display:flex;gap:4px;flex-shrink:0;">
                  <button type="button" onclick="cycleSlot('${secKey}',-1)" class="st-pill-btn" style="padding:1px 7px;">‹</button>
                  <button type="button" onclick="cycleSlot('${secKey}',1)" class="st-pill-btn" style="padding:1px 7px;">›</button>
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="padding:16px 14px;display:flex;flex-direction:column;gap:18px;">
      <div>
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:8px;">
          <span>모서리 곡률 (Border Radius)</span>
          <span class="f-mono">${state.tokens.radius}px</span>
        </div>
        <input type="range" min="0" max="28" value="${state.tokens.radius}" oninput="updateToken('radius', this.value)" style="width:100%;accent-color:#F8FAFC;cursor:pointer;" />
      </div>

      <div>
        <div style="font-size:12px;font-weight:700;margin-bottom:8px;">섹션 여백 호흡 (Vertical Rhythm)</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
          ${[['compact','조밀함'],['balanced','스탠다드'],['editorial','넓은 여백']].map(([v, lbl]) => `
            <button type="button" onclick="updateToken('density','${v}')" class="st-pill-btn ${state.tokens.density===v?'is-active':''}" style="justify-content:center;">${lbl}</button>
          `).join('')}
        </div>
      </div>

      <div>
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:8px;">
          <span>35mm 아날로그 필름 그레인 질감</span>
          <span class="f-mono">${Math.round(state.tokens.grain * 1000) / 10}%</span>
        </div>
        <input type="range" min="0" max="0.09" step="0.005" value="${state.tokens.grain}" oninput="updateToken('grain', this.value)" style="width:100%;accent-color:#F8FAFC;cursor:pointer;" />
      </div>

      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;">
          <span>커스텀 포인트 컬러 오버라이드</span>
          <input type="color" value="${state.tokens.customAccent || '#8C5A32'}" oninput="updateToken('customAccent', this.value)" style="width:32px;height:26px;border:none;background:transparent;cursor:pointer;" />
        </div>
      </div>

      <div style="padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:12px;font-weight:600;">섹션 마우스오버 빠른 교체 알약</span>
        <button type="button" onclick="updateToken('guidesOn', !state.guidesOn)" class="st-pill-btn ${state.guidesOn?'is-active':''}">${state.guidesOn?'표시 중':'숨김'}</button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   RENDER FULL LIVE WEBSITE + PRELOADER / SCROLL LASER / INTRO CURTAIN
   ========================================================================== */
function makeSectionHoverPill(secKey) {
  const meta = CATEGORIES.find(c => c.key === secKey);
  const eq = getAsset(secKey, state.equipped[secKey]);
  return `<div class="f-sec-pill" contenteditable="false">
    <button type="button" onclick="cycleSlot('${secKey}', -1, event)">‹</button>
    <span style="padding:0 6px;">${meta.name} · ${eq.name}</span>
    <button type="button" onclick="cycleSlot('${secKey}', 1, event)">›</button>
    <button type="button" onclick="openSingleAssetCode('${secKey}', '${eq.id}')">&lt;/&gt;</button>
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
  const w = WORLDS[state.worldKey] || WORLDS.maison;
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
  const w      = WORLDS[state.worldKey] || WORLDS.maison;
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
  const tokenStyle = `--radius:${state.tokens.radius}px; --sec-py:${secPy}; --grain-op:${state.tokens.grain}; ${state.tokens.customAccent ? `--accent:${state.tokens.customAccent};` : ''}`;

  const ctx = {
    bdgCls: bdg.cls,
    tfxId: tfx.id,
    btn: (label) => btn.render(label)
  };

  const renderedSections = state.secOrder
    .filter(secKey => state.secEnabled[secKey])
    .map(secKey => {
      const mod = getAsset(secKey, state.equipped[secKey]);
      const html = mod.render(w, ctx);
      if (!html) return '';
      return `<div id="sec-${secKey}" class="f-sec-wrap">
        ${makeSectionHoverPill(secKey)}
        ${html}
      </div>`;
    }).join('\n');

  const mount = document.getElementById('website-mount');
  if (!mount) return;

  mount.innerHTML = `
    <div id="hp-root" class="f-site ${pal.cls} ${shd.cls || ''} ${fnt.cls} ${tfx.cls} ${srf.cls} ${imgst.cls} ${inp.cls || ''} ${mot.cls} ${state.guidesOn ? 'guides-on' : ''} ${state.inlineEdit ? 'is-editing' : ''}" style="${tokenStyle}">
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

  initShaderEngine(shd.mode);
  bindLivePhysics();
  initScrollChoreography();
}

/* ==========================================================================
   INTERACTIVE SECTION WIDGET HANDLERS
   ========================================================================== */
function swapHeroEdition(idx) {
  const w = WORLDS[state.worldKey];
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
  const w = WORLDS[state.worldKey];
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
  const w = WORLDS[state.worldKey];
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
  const w = WORLDS[state.worldKey];
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
  const w = WORLDS[state.worldKey];
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
  const w = WORLDS[state.worldKey];
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
  const w = WORLDS[state.worldKey];
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
  const w = WORLDS[state.worldKey];
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
  const w = WORLDS[state.worldKey];
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
  canvas.width = frame ? frame.clientWidth : 1000;
  canvas.height = frame ? Math.max(frame.clientHeight, 900) : 900;
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
      if (btn.classList.contains('f-magnetic') || state.equipped.button === 'BTN-01') {
        const tx = (x - r.width / 2) * 0.26;
        const ty = (y - r.height / 2) * 0.32;
        btn.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
      }
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
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
        const r = card.getBoundingClientRect();
        const rx = (((e.clientY - r.top) / r.height) - 0.5) * -9;
        const ry = (((e.clientX - r.left) / r.width) - 0.5) * 9;
        card.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
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
  if (el._counted) return;
  el._counted = true;
  const target = parseFloat(el.dataset.target || '0');
  const isFloat = String(el.dataset.target).includes('.');
  const dur = 1100;
  const start = performance.now();
  function step(now) {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = isFloat ? val.toFixed(target % 1 !== 0 && String(target).split('.')[1]?.length === 2 ? 2 : 1) : Math.round(val).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? String(target) : target.toLocaleString();
  }
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(step);
}

function initScrollChoreography(forceReplay = false) {
  if (siteObserver) siteObserver.disconnect();
  const root = document.getElementById('hp-root');
  const frame = document.getElementById('canvas-frame');
  if (!root || typeof IntersectionObserver !== 'function') return;

  const reveals = root.querySelectorAll('.f-reveal');
  const counters = root.querySelectorAll('.f-countup');

  if (state.equipped.motion !== 'MOT-08') {
    reveals.forEach(el => el.classList.add('is-waiting'));
  }
  if (forceReplay) counters.forEach(c => { c._counted = false; });

  siteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-waiting');
        if (entry.target.classList.contains('f-countup')) animateCountUp(entry.target);
        entry.target.querySelectorAll?.('.f-countup').forEach(animateCountUp);
      }
    });
  }, { root: frame, threshold: 0.1 });

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

  cf.addEventListener('scroll', () => {
    const maxScroll = Math.max(1, cf.scrollHeight - cf.clientHeight);
    const pct = Math.min(100, Math.max(0, Math.round((cf.scrollTop / maxScroll) * 100)));
    const laser = document.getElementById('hp-scroll-laser');
    if (laser) laser.style.setProperty('--scroll-pct', pct + '%');
    const pill = document.getElementById('hp-scroll-pct-pill');
    if (pill) pill.textContent = `SCROLL ${pct < 10 ? '0' + pct : pct}%`;
  });

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
  const w     = WORLDS[state.worldKey] || WORLDS.maison;
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
              <button type="button" onclick="equipAsset('${c.key}','${item.id}', true)" class="st-pill-btn is-primary" style="flex:1;justify-content:center;">홈페이지에 장착 →</button>
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
  const w     = WORLDS[state.worldKey] || WORLDS.maison;
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
    .replace(/data:image\/webp;base64,[^"]+/g, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80')
    .replace(/__SAMPLE_IMG__/g, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');

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
  const previewDoc = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"/><style>${fontsCSS}\nbody{margin:0;padding:20px;background:#0D0F15;font-family:'Plus Jakarta Sans','IBM Plex Sans KR',sans-serif;}\n*,*::before,*::after{box-sizing:border-box;}\n${extraCSS}</style></head><body>${liveBodyForIframe}${scriptJS ? `<script>${scriptJS}<\/script>` : ''}</body></html>`;

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
  const w = WORLDS[state.worldKey];
  const coreCSS = document.getElementById('forma-core-css')?.textContent || '';
  const fontsCSS = document.getElementById('forma-fonts-css')?.textContent || '';
  const root = document.getElementById('hp-root');
  if (!root) return;

  const clone = root.cloneNode(true);
  clone.querySelectorAll('.f-sec-pill, #floating-work-preview, #hp-live-curtain').forEach(el => el.remove());
  clone.querySelectorAll('.is-waiting').forEach(el => el.classList.remove('is-waiting'));
  clone.classList.remove('guides-on', 'is-editing');

  const liveCloneHTML = clone.outerHTML;
  const cleanHTML = liveCloneHTML.replace(/data:image\/webp;base64,[^"]+/g, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80');
  const summary = CATEGORIES.map(c => `${c.key}:${state.equipped[c.key]}`).join(' | ');

  const standaloneScript = `
    let ambientAudio = null;
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
        if (btn.classList.contains('f-magnetic')) {
          btn.style.transform = 'translate(' + ((e.clientX - r.left - r.width/2)*0.25).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height/2)*0.3).toFixed(1) + 'px)';
        }
      });
      btn.addEventListener('mouseleave', () => btn.style.transform = '');
    });
    document.addEventListener('mousemove', e => {
      document.querySelectorAll('.f-card').forEach(c => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--cmx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--cmy', (e.clientY - r.top) + 'px');
      });
    });`;

  const standaloneDoc = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${w.brand} — ${w.eyebrow}</title>
  <meta name="description" content="${w.h1Sub}" />
  <!-- FORMA STUDIO v6 Assembled 26-Slot Combination: ${summary} -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=Gowun+Batang:wght@400;700&family=Hahmlet:wght@700&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=JetBrains+Mono:wght@400..700&family=Noto+Serif+KR:wght@300;600&family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@400..800&family=Space+Grotesk:wght@400..700&family=Syne:wght@600..800&display=swap" />
  <style>
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
  a.download = `${state.worldKey}-forma-v6.html`;
  a.click();
  URL.revokeObjectURL(url);
  showStudioToast('완성 홈페이지 HTML 파일 다운로드가 시작되었습니다.');
}

function downloadStudioSelfHTML() {
  if (typeof Blob === 'undefined' || !document.documentElement) return;
  const clone = document.documentElement.cloneNode(true);
  ['website-mount', 'st-subbar', 'st-side-body', 'vault-toolbar', 'vault-cats-bar', 'vault-cards-grid'].forEach(id => {
    const el = clone.querySelector ? clone.querySelector('#' + id) : null;
    if (el) el.innerHTML = '';
  });
  clone.querySelectorAll?.('.is-open, .is-visible').forEach(el => {
    el.classList.remove('is-open', 'is-visible');
  });
  const appEl = clone.querySelector ? clone.querySelector('#studio-app') : null;
  if (appEl) {
    appEl.removeAttribute('style');
    appEl.classList.remove('is-presentation');
  }
  const fullHTML = '<!DOCTYPE html>\n' + clone.outerHTML;
  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FORMA_STUDIO_v6.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showStudioToast('FORMA_STUDIO_v6.html 다운로드 시작! 받은 파일을 더블클릭하면 크롬 전체화면으로 바로 열립니다.');
}

/* ==========================================================================
   VIEWPORT SYNC (496px Inline Embed <-> Full-Height Side Pane) & BOOT
   ========================================================================== */
function syncStudioViewportHeight() {
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
}

window.addEventListener('DOMContentLoaded', () => {
  syncStudioViewportHeight();
  if (typeof window !== 'undefined' && window.innerWidth < 980) {
    state.sidebarOpen = false;
    document.getElementById('st-sidebar')?.classList.add('is-collapsed');
    const btn = document.getElementById('sidebar-toggle-btn');
    if (btn) btn.textContent = '◨ 에셋 패널 열기';
  }
  window.addEventListener('resize', syncStudioViewportHeight);

  renderQuickSubbar();
  renderSidebarBody();
  renderLiveWebsite();
  initCustomCursorSystem();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.presentation) togglePresentationMode(false);
      document.getElementById('export-modal')?.classList.remove('is-open');
      document.getElementById('lightbox-modal')?.classList.remove('is-open');
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setStudioMode(state.mode === 'vault' ? 'builder' : 'vault');
      setTimeout(() => document.getElementById('vault-search-input')?.focus(), 60);
    }
  });
});
