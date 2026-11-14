/* ==========================================================================
   FORMA STUDIO Pro — MODULE 04: MULTI-PAGE PROJECT STATE, AUTO-SAVE & JSON I/O
   - ProjectDocument v2 Schema (Multi-Page: Home / About / Portfolio / Contact)
   - 50-Step Full-Project Undo (Ctrl+Z) & Redo (Ctrl+Y / Ctrl+Shift+Z)
   - Full-Project A/B/C Client Proposal Slots
   - Real-Time Debounced Auto-Save (IndexedDB forma_studio_db_v1 + localStorage)
   - WebP Image Deduplication (customAssets) + Multi-Project CRUD + .forma.json
   ========================================================================== */

globalThis.FORMA_PRO = window.FORMA_PRO = window.FORMA_PRO || globalThis.FORMA_PRO || {};

const GROUP_A_GLOBAL_KEYS = [
  'palette', 'shader', 'font', 'textfx', 'button', 'surface',
  'imgstyle', 'inputui', 'cursor', 'motion', 'badge', 'preloader', 'widget'
];

const GROUP_B_SECTION_KEYS = [
  'topbar', 'navbar', 'hero', 'divider', 'stats', 'feature',
  'process', 'gallery', 'team', 'pricing', 'proof', 'form', 'footer'
];

const GLOBAL_CHROME_SECTION_KEYS = ['topbar', 'navbar', 'footer'];
const PAGE_CONTENT_SECTION_KEYS = [
  'hero', 'divider', 'stats', 'feature', 'process',
  'gallery', 'team', 'pricing', 'proof', 'form'
];

function extractGlobalEquipped(eqSource, worldKey = 'maison') {
  const w = (typeof WORLDS !== 'undefined' && WORLDS[worldKey]) || (typeof WORLDS !== 'undefined' ? WORLDS.maison : { preset: {} });
  const preset = w?.preset || {};
  const src = (eqSource && typeof eqSource === 'object') ? eqSource : {};
  const out = {};
  GROUP_A_GLOBAL_KEYS.forEach(k => {
    out[k] = src[k] || preset[k] || '';
  });
  return out;
}

function extractSectionEquipped(eqSource, worldKey = 'maison') {
  const w = (typeof WORLDS !== 'undefined' && WORLDS[worldKey]) || (typeof WORLDS !== 'undefined' ? WORLDS.maison : { preset: {} });
  const preset = w?.preset || {};
  const src = (eqSource && typeof eqSource === 'object') ? eqSource : {};
  const out = {};
  GROUP_B_SECTION_KEYS.forEach(k => {
    out[k] = src[k] || preset[k] || '';
  });
  return out;
}

const PAGE_SECTION_PRESETS = {
  home: [
    'topbar', 'navbar', 'hero', 'divider', 'stats',
    'feature', 'process', 'gallery', 'team', 'pricing',
    'proof', 'form', 'footer'
  ],
  about: [
    'topbar', 'navbar', 'hero', 'stats', 'team',
    'process', 'proof', 'footer'
  ],
  portfolio: [
    'topbar', 'navbar', 'hero', 'gallery', 'feature',
    'proof', 'footer'
  ],
  contact: [
    'topbar', 'navbar', 'hero', 'pricing', 'form', 'footer'
  ]
};

const SUBPAGE_WORLD_COPY = {
  maison: {
    about: {
      eyebrow: 'ABOUT THE ATELIER · 건축 철학과 디렉터',
      h1Pre: '시간의 물성과 빛의 침묵을 짓는',
      h1Accent: '아키텍처 철학.',
      h1Sub: '자연 지형과 노출 콘크리트, 탄화목의 온기가 교차하는 메종 보이드의 공간 설계 철학과 수석 아키텍트 그룹을 소개합니다.',
      heroImg: 'atelier',
      heroId: 'HERO-02'
    },
    portfolio: {
      eyebrow: 'PORTFOLIO ARCHIVE · 프라이빗 빌라 & 파빌리온 컬렉션',
      h1Pre: '지형과 계절 위에 새겨진',
      h1Accent: '아카이브 컬렉션.',
      h1Sub: '서촌 클리프 파빌리온부터 제주 현무암 생츄어리까지, 메종 보이드가 완성한 시그니처 공간 포트폴리오를 감상하세요.',
      heroImg: 'exhibition',
      heroId: 'HERO-04'
    },
    contact: {
      eyebrow: 'PRIVATE CONCIERGE · 멤버십 및 스테이 예약 문의',
      h1Pre: '오직 한 팀만을 위한 고요한 여정,',
      h1Accent: '프라이빗 컨시어지.',
      h1Sub: '원하시는 체크인 일정과 희망 독채 파빌리온을 남겨주시면 전담 버틀러가 3시간 이내에 맞춤 인비테이션을 회신드립니다.',
      heroImg: 'lobby',
      heroId: 'HERO-03'
    }
  },
  obsidian: {
    about: {
      eyebrow: 'ABOUT OBSIDIAN · 자율형 AI 엔지니어링 그룹',
      h1Pre: '금융과 엔터프라이즈 인프라를 재정의하는',
      h1Accent: '코어 아키텍처 팀.',
      h1Sub: '글로벌 분산 시스템과 초저지연 추론 커널을 설계한 연구진과 기술 로드맵을 확인하세요.',
      heroImg: 'director',
      heroId: 'HERO-02'
    },
    portfolio: {
      eyebrow: 'CASE STUDIES · 글로벌 엔터프라이즈 구축 레퍼런스',
      h1Pre: '포춘 500대 기업이 증명한',
      h1Accent: '프로덕션 레퍼런스.',
      h1Sub: '제로 데이터 유출과 99.999% 가용성으로 미션 크리티컬 워크로드를 혁신한 실제 배포 사례입니다.',
      heroImg: 'tech',
      heroId: 'HERO-04'
    },
    contact: {
      eyebrow: 'DEDICATEDPOC & SECURITY BRIEFING · 기술 도입 문의',
      h1Pre: '전담 솔루션 아키텍트와 함께하는',
      h1Accent: '맞춤형 기술 브리핑.',
      h1Sub: '온프레미스 에어갭 구축부터 전용 GPU 클러스터 설계까지, 귀사의 보안 규정에 맞춘 PoC를 즉시 시작하세요.',
      heroImg: 'monolith',
      heroId: 'HERO-03'
    }
  },
  botanica: {
    about: {
      eyebrow: 'OUR BOTANICAL LAB · 그라스 조향 아틀리에 스토리',
      h1Pre: '야생의 뿌리와 새벽 이슬을 채집하는',
      h1Accent: '보태니컬 아틀리에.',
      h1Sub: '100% 비건 원료와 핸드 블렌딩 숙성 공정을 지키는 마스터 조향사들의 철학을 만나보세요.',
      heroImg: 'tea',
      heroId: 'HERO-02'
    },
    portfolio: {
      eyebrow: 'SCENT ARCHIVE · 오 드 퍼퓸 & 공간 디퓨저 컬렉션',
      h1Pre: '기억의 농도를 조각하는',
      h1Accent: '시그니처 향수 컬렉션.',
      h1Sub: '첫 노트부터 잔향까지 시간의 흐름에 따라 피어나는 르 실라주의 전 라인업을 탐색하세요.',
      heroImg: 'perfume',
      heroId: 'HERO-04'
    },
    contact: {
      eyebrow: 'BESPOKE ATELIER · 1:1 시향 세션 & 기프트 컨시어지',
      h1Pre: '당신만의 고유한 살결을 닮은 향,',
      h1Accent: '프라이빗 시향 예약.',
      h1Sub: '한남 플래그십 살롱의 1:1 비스포크 조향 클래스 및 기업 VIP 기프트 주문을 예약하세요.',
      heroImg: 'atelier',
      heroId: 'HERO-03'
    }
  },
  eclipse: {
    about: {
      eyebrow: 'CULINARY PHILOSOPHY · 제철 발효와 불의 미학',
      h1Pre: '한국의 산해와 프렌치 기법이 만나는',
      h1Accent: '가스트로노미 철학.',
      h1Sub: '전국 각지의 생산자와 함께 호흡하며 24절기 테이스팅 코스를 빚어내는 셰프 크루를 소개합니다.',
      heroImg: 'director',
      heroId: 'HERO-02'
    },
    portfolio: {
      eyebrow: 'SEASONAL TASTING · 사계절 시그니처 디쉬 & 페어링 아카이브',
      h1Pre: '접시 위에 응축된 계절의 찰나,',
      h1Accent: '테이스팅 아카이브.',
      h1Sub: '참나무 훈연 숙성 채끝부터 올드 빈티지 샴페인 페어링까지, 이클립스의 미식 컬렉션입니다.',
      heroImg: 'dining',
      heroId: 'HERO-04'
    },
    contact: {
      eyebrow: 'PRIVATE DINING & RESERVATION · 다이닝 룸 예약 문의',
      h1Pre: '하루 단 16석만 허락된 미식의 밤,',
      h1Accent: '테이블 & 룸 예약.',
      h1Sub: '기념일 프라이빗 룸 대관, 알레르기 맞춤 메뉴 조율, 소믈리에 주류 반입 문의를 전담 매니저가 안내합니다.',
      heroImg: 'tea',
      heroId: 'HERO-03'
    }
  },
  hanlaw: {
    about: {
      eyebrow: 'FIRM HERITAGE · 거버넌스 & 시니어 파트너십 소개',
      h1Pre: '반세기 축적된 판례와 글로벌 통찰,',
      h1Accent: '한결의 리더십.',
      h1Sub: '전직 최고법원·금융당국·국제중재원 출신 시니어 파트너들이 직접 사건의 전 과정을 지휘합니다.',
      heroImg: 'director',
      heroId: 'HERO-02'
    },
    portfolio: {
      eyebrow: 'LANDMARK MANDATES · 주요 크로스보더 승소 및 자문 실적',
      h1Pre: '산업의 판도를 바꾼 결정적 순간,',
      h1Accent: '랜드마크 트랙레코드.',
      h1Sub: '초대형 M&A, 경영권 분쟁 방어, 국제 투자자-국가 분쟁(ISD) 승소 등 검증된 자문 실적을 확인하세요.',
      heroImg: 'lobby',
      heroId: 'HERO-04'
    },
    contact: {
      eyebrow: 'CONFIDENTIAL CONSULTATION · 100% 비밀보장 긴급 자문 요청',
      h1Pre: '위기를 기회로 전환하는 법률 파트너,',
      h1Accent: '전담 파트너 직통 자문.',
      h1Sub: '접수 즉시 이해상충 검토 후 2시간 이내에 해당 분야 전담 파트너 변호사가 직접 기밀 회신을 드립니다.',
      heroImg: 'monolith',
      heroId: 'HERO-03'
    }
  },
  kinetic: {
    about: {
      eyebrow: 'STUDIO MANIFESTO · 인터랙티브 아트 디렉션 크루',
      h1Pre: '규칙을 파괴하고 감각을 각인시키는',
      h1Accent: '크리에이티브 매니페스토.',
      h1Sub: '브랜드 전략가, 3D 모션 아티스트, 크리에이티브 테크놀로지스트가 결합된 KINETIC의 DNA를 소개합니다.',
      heroImg: 'atelier',
      heroId: 'HERO-02'
    },
    portfolio: {
      eyebrow: 'SELECTED WORKS · Awwwards & 칸 라이언즈 수상 캠페인',
      h1Pre: '전 세계 유저의 시선을 멈춰 세운',
      h1Accent: '플래그십 쇼케이스.',
      h1Sub: '글로벌 럭셔리 리브랜딩부터 WebGL 인터랙티브 쇼케이스까지, KINETIC의 대표작을 경험하세요.',
      heroImg: 'exhibition',
      heroId: 'HERO-04'
    },
    contact: {
      eyebrow: 'START A PROJECT · 신규 캠페인 & 리브랜딩 의뢰',
      h1Pre: '다음 시대의 아이콘을 함께 만들',
      h1Accent: '프로젝트 브리프 접수.',
      h1Sub: '런칭 목표 일정과 예상 범위를 공유해 주시면 크리에이티브 디렉터가 24시간 내에 맞춤 제안서를 발송합니다.',
      heroImg: 'tech',
      heroId: 'HERO-03'
    }
  }
};

function deepCloneJSON(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (_) {
    return Array.isArray(obj) ? [...obj] : { ...obj };
  }
}

function slugifyPageTitle(rawTitle, fallbackSlug, existingPages, excludePageId) {
  const clean = String(rawTitle || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-_]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const base = clean || fallbackSlug || 'page';
  let candidate = base;
  let counter = 2;
  const taken = new Set(
    (existingPages || [])
      .filter(p => p.id !== excludePageId)
      .map(p => p.slug)
  );
  while (taken.has(candidate)) {
    candidate = `${base}-${counter++}`;
  }
  return candidate;
}

function makeDefaultPageDocument(worldKey, slug, title, customPresetEq = null) {
  const w = (typeof WORLDS !== 'undefined' && WORLDS[worldKey]) || (typeof WORLDS !== 'undefined' ? WORLDS.maison : {});
  const presetSecs = PAGE_SECTION_PRESETS[slug] || PAGE_SECTION_PRESETS.home;
  const allSecs = [
    ...presetSecs,
    ...DEFAULT_SEC_ORDER.filter(k => !presetSecs.includes(k))
  ];
  const secEnabled = {};
  allSecs.forEach(k => {
    secEnabled[k] = presetSecs.includes(k);
  });

  const subCopy = (SUBPAGE_WORLD_COPY[worldKey] && SUBPAGE_WORLD_COPY[worldKey][slug]) || null;
  const equippedOverrides = {};
  if (subCopy && subCopy.heroId) {
    equippedOverrides.hero = subCopy.heroId;
  }
  const baseEq = { ...(w.preset || {}), ...(customPresetEq || {}) };
  const pageEquipped = extractSectionEquipped({ ...baseEq, ...equippedOverrides }, worldKey);
  const metaObj = {
    title: `${w.brand || 'FORMA'} — ${title}`,
    description: subCopy ? subCopy.h1Sub : (w.h1Sub || ''),
    subpageCopy: subCopy ? { ...subCopy } : null
  };
  const pageMetaObj = {
    ...metaObj,
    ...(subCopy ? { ...subCopy } : {})
  };

  return {
    id: `page-${slug}`,
    slug,
    title,
    meta: metaObj,
    pageMeta: pageMetaObj,
    secOrder: allSecs,
    secEnabled,
    equipped: pageEquipped,
    equippedOverrides,
    secHeights: {},
    customSections: {},
    uiOffsets: {},
    elementOverrides: {},
    freeWidgets: [],
    customTexts: {},
    customImages: {},
    responsiveOverrides: { tablet: {}, mobile: {} },
    interactions: {}
  };
}

function makeDefaultPagesForWorld(worldKey, customPresetEq = null) {
  return [
    makeDefaultPageDocument(worldKey, 'home', 'Home', customPresetEq),
    makeDefaultPageDocument(worldKey, 'about', 'About', customPresetEq),
    makeDefaultPageDocument(worldKey, 'portfolio', 'Portfolio', customPresetEq),
    makeDefaultPageDocument(worldKey, 'contact', 'Contact', customPresetEq)
  ];
}

function createDefaultProposalsV2(worldKey = 'maison') {
  const w = (typeof WORLDS !== 'undefined' && WORLDS[worldKey]) || (typeof WORLDS !== 'undefined' ? WORLDS.maison : { preset: {} });
  const baseEq = { ...(w.preset || {}) };
  const eqB = {
    ...baseEq,
    palette: 'PAL-02', shader: 'BG-02', font: 'FNT-03', textfx: 'TFX-04',
    button: 'BTN-02', surface: 'SRF-02', imgstyle: 'IMG-10', inputui: 'INP-02',
    cursor: 'CUR-06', motion: 'MOT-04', badge: 'BDG-03', preloader: 'PRE-04',
    widget: 'WGT-01', navbar: 'NAV-02', hero: 'HERO-01', feature: 'FEAT-01',
    process: 'PRO-05', gallery: 'GAL-04', team: 'TEM-07', pricing: 'PRC-03', footer: 'FTR-03'
  };
  const eqC = {
    ...baseEq,
    palette: 'PAL-06', shader: 'BG-08', font: 'FNT-07', textfx: 'TFX-09',
    button: 'BTN-10', surface: 'SRF-09', imgstyle: 'IMG-07', inputui: 'INP-04',
    cursor: 'CUR-02', motion: 'MOT-01', badge: 'BDG-05', preloader: 'PRE-01',
    widget: 'WGT-04', topbar: 'TOP-06', navbar: 'NAV-04', hero: 'HERO-07',
    stats: 'STA-05', feature: 'FEAT-08', process: 'PRO-07', gallery: 'GAL-02',
    team: 'TEM-09', pricing: 'PRC-08', footer: 'FTR-04'
  };

  return {
    A: {
      label: '시안 A · 웜 럭셔리',
      worldKey,
      brandProfile: null,
      equipped: baseEq,
      globalEquipped: extractGlobalEquipped(baseEq, worldKey),
      tokens: { radius: 10, density: 'balanced', grain: 0.035, customAccent: null, customPaletteTokens: null },
      activePageId: 'page-home',
      pages: makeDefaultPagesForWorld(worldKey, baseEq)
    },
    B: {
      label: '시안 B · 다크 아방가르드',
      worldKey,
      brandProfile: null,
      equipped: eqB,
      globalEquipped: extractGlobalEquipped(eqB, worldKey),
      tokens: { radius: 14, density: 'editorial', grain: 0.045, customAccent: null, customPaletteTokens: null },
      activePageId: 'page-home',
      pages: makeDefaultPagesForWorld(worldKey, eqB)
    },
    C: {
      label: '시안 C · 스위스 에디토리얼',
      worldKey,
      brandProfile: null,
      equipped: eqC,
      globalEquipped: extractGlobalEquipped(eqC, worldKey),
      tokens: { radius: 2, density: 'compact', grain: 0.03, customAccent: null, customPaletteTokens: null },
      activePageId: 'page-home',
      pages: makeDefaultPagesForWorld(worldKey, eqC)
    }
  };
}

function createDefaultProjectDocument(worldKey = 'maison', projectName = null, projectId = null) {
  const w = (typeof WORLDS !== 'undefined' && WORLDS[worldKey]) || (typeof WORLDS !== 'undefined' ? WORLDS.maison : { brand: 'MAISON VOID', eyebrow: '', preset: {} });
  const now = Date.now();
  const id = projectId || ('proj-' + now.toString(36) + '-' + Math.floor(Math.random() * 9999).toString(36));
  const pages = makeDefaultPagesForWorld(worldKey);
  const fullEquipped = { ...(w.preset || {}) };
  return {
    format: 'forma-studio-project',
    version: 2,
    schemaVersion: 2,
    projectId: id,
    projectName: projectName || `${w.brand} 프로젝트`,
    createdAt: now,
    updatedAt: now,
    worldKey,
    brandProfile: {
      brandName: w.brand,
      slogan: w.eyebrow,
      primaryColor: '#8C5A32',
      mood: 'light',
      fontPairingId: w.preset?.font || 'FNT-01',
      harmonicTokens: null
    },
    tokens: {
      radius: 10,
      density: 'balanced',
      grain: 0.035,
      customAccent: null,
      customPaletteTokens: null
    },
    globalEquipped: extractGlobalEquipped(fullEquipped, worldKey),
    equipped: fullEquipped,
    activePageId: pages[0].id,
    pages,
    proposals: createDefaultProposalsV2(worldKey),
    customAssets: {}
  };
}

/* ==========================================================================
   PROJECT STATE ENGINE + BIDIRECTIONAL V10 STATE BRIDGE
   ========================================================================== */
const IDB_NAME = 'forma_studio_db_v1';
const IDB_VERSION = 1;
const LS_ACTIVE_KEY = 'forma_studio_active_v2';
const LS_INDEX_KEY = 'forma_studio_projects_index_v2';
const MAX_HISTORY = 50;

let activeProjectDoc = null;
let projectRedoStack = [];
let idbPromise = null;
let autosaveTimer = null;
let tokenUndoCoalesceTimer = null;

function blurActiveInlineEditingElement() {
  if (typeof document === 'undefined') return;
  try {
    const liveEl = typeof document.querySelector === 'function' ? document.querySelector('[data-live-editing="1"]') : null;
    if (liveEl && typeof liveEl.blur === 'function') {
      liveEl.blur();
    }
    if (document.activeElement && document.activeElement.isContentEditable && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  } catch (_) {}
}
globalThis.blurActiveInlineEditingElement = typeof window !== 'undefined' ? (window.blurActiveInlineEditingElement = blurActiveInlineEditingElement) : blurActiveInlineEditingElement;

function ensureProjectDocInitialized() {
  if (!activeProjectDoc) {
    activeProjectDoc = createDefaultProjectDocument((typeof state !== 'undefined' && state.worldKey) || 'maison');
  }
  return activeProjectDoc;
}

function getActivePageDoc(doc = ensureProjectDocInitialized()) {
  if (!doc || !Array.isArray(doc.pages) || !doc.pages.length) return null;
  return doc.pages.find(p => p.id === doc.activePageId) || doc.pages[0];
}

function syncEngineStateToPage(doc = ensureProjectDocInitialized()) {
  if (typeof state === 'undefined' || !doc) return;
  const page = getActivePageDoc(doc);
  if (!page) return;

  doc.format = 'forma-studio-project';
  doc.version = 2;
  doc.schemaVersion = 2;
  doc.worldKey = state.worldKey || doc.worldKey || 'maison';
  doc.tokens = deepCloneJSON(state.tokens || doc.tokens);
  doc.proposals = deepCloneJSON(state.proposals || doc.proposals);

  const baseEquipped = { ...(doc.equipped || {}), ...(doc.globalEquipped || {}) };
  const curEquipped = { ...(state.equipped || {}) };

  // 1. Update global Group A slots + global chrome (topbar, navbar, footer) in doc.equipped & doc.globalEquipped
  GROUP_A_GLOBAL_KEYS.forEach(k => {
    if (curEquipped[k]) baseEquipped[k] = curEquipped[k];
  });
  GLOBAL_CHROME_SECTION_KEYS.forEach(k => {
    if (curEquipped[k]) {
      baseEquipped[k] = curEquipped[k];
      (doc.pages || []).forEach(p => {
        if (p && p.equipped) p.equipped[k] = curEquipped[k];
      });
    }
  });

  // 2. Keep Group B content section slots isolated per-page so editing About never pollutes Home!
  page.equipped = extractSectionEquipped({ ...baseEquipped, ...(page.equipped || {}), ...(page.equippedOverrides || {}) }, doc.worldKey);
  page.equippedOverrides = { ...(page.equippedOverrides || {}) };
  PAGE_CONTENT_SECTION_KEYS.forEach(k => {
    if (curEquipped[k]) {
      page.equipped[k] = curEquipped[k];
      if (page.slug === 'home') {
        baseEquipped[k] = curEquipped[k];
      } else {
        page.equippedOverrides[k] = curEquipped[k];
      }
    }
  });
  GLOBAL_CHROME_SECTION_KEYS.forEach(k => {
    if (curEquipped[k]) page.equipped[k] = curEquipped[k];
  });

  doc.equipped = baseEquipped;
  doc.globalEquipped = extractGlobalEquipped(doc.equipped, doc.worldKey);

  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.syncFreeWidgetsFromDOM) {
    FORMA_PRO.SelectionEngine.syncFreeWidgetsFromDOM();
  }
  page.secOrder = Array.isArray(state.secOrder) ? [...state.secOrder] : [...DEFAULT_SEC_ORDER];
  page.secEnabled = { ...(state.secEnabled || {}) };
  page.secHeights = { ...(state.secHeights || {}) };
  page.customSections = deepCloneJSON(state.customSections || {});
  const syncedOffsets = deepCloneJSON(state.uiOffsets || {});
  page.uiOffsets = syncedOffsets;
  page.elementOverrides = deepCloneJSON(syncedOffsets);
  page.freeWidgets = deepCloneJSON(state.freeWidgets || []);
  page.customTexts = { ...(state.customTexts || {}) };
  page.customImages = { ...(state.customImages || {}) };
  if (state.responsiveOverrides) {
    page.responsiveOverrides = deepCloneJSON(state.responsiveOverrides);
  }
  if (state.interactions) {
    page.interactions = deepCloneJSON(state.interactions);
  }
  page.meta = page.meta || { title: `${doc.brandProfile?.brandName || 'FORMA'} — ${page.title}`, description: '' };
  page.pageMeta = deepCloneJSON({ ...(page.meta.subpageCopy || {}), ...page.meta, ...(page.pageMeta || {}) });
  doc.updatedAt = Date.now();
  state.projectDoc = doc;
}

function syncPageToEngineState(doc = ensureProjectDocInitialized()) {
  if (typeof state === 'undefined' || !doc) return;
  const page = getActivePageDoc(doc);
  if (!page) return;
  globalThis._suppressDOMToFreeWidgetSync = true;
  doc.format = 'forma-studio-project';
  doc.version = 2;
  doc.schemaVersion = 2;
  doc.activePageId = page.id;

  state.worldKey = doc.worldKey || 'maison';
  state.tokens = deepCloneJSON(doc.tokens || { radius: 10, density: 'balanced', grain: 0.035, customAccent: null });
  state.proposals = deepCloneJSON(doc.proposals || createDefaultProposalsV2(state.worldKey));
  doc.globalEquipped = extractGlobalEquipped(doc.equipped || doc.globalEquipped, state.worldKey);
  doc.equipped = { ...(doc.equipped || {}), ...doc.globalEquipped };
  page.equipped = extractSectionEquipped({ ...doc.equipped, ...(page.equipped || {}), ...(page.equippedOverrides || {}) }, state.worldKey);
  GLOBAL_CHROME_SECTION_KEYS.forEach(k => {
    if (doc.equipped[k]) page.equipped[k] = doc.equipped[k];
  });
  state.equipped = {
    ...doc.equipped,
    ...doc.globalEquipped,
    ...page.equipped,
    ...(page.equippedOverrides || {})
  };
  state.secOrder = Array.isArray(page.secOrder) && page.secOrder.length ? [...page.secOrder] : [...DEFAULT_SEC_ORDER];
  state.secEnabled = { ...(page.secEnabled || {}) };
  state.secHeights = { ...(page.secHeights || {}) };
  state.customSections = deepCloneJSON(page.customSections || {});
  const pageOffsets = (page.uiOffsets && Object.keys(page.uiOffsets).length)
    ? page.uiOffsets
    : (page.elementOverrides || {});
  page.uiOffsets = deepCloneJSON(pageOffsets);
  page.elementOverrides = deepCloneJSON(pageOffsets);
  state.uiOffsets = deepCloneJSON(pageOffsets);
  state.elementOverrides = state.uiOffsets;
  state.freeWidgets = deepCloneJSON(page.freeWidgets || []);
  state.customTexts = { ...(page.customTexts || {}) };
  state.customImages = { ...(page.customImages || {}) };
  const rawResp = page.responsiveOverrides || {};
  state.responsiveOverrides = deepCloneJSON({
    desktop: rawResp.desktop || {},
    tablet: rawResp.tablet || {},
    mobile: rawResp.mobile || {}
  });
  state.interactions = deepCloneJSON(page.interactions || {});
  state.activePageId = page.id;
  state.activePageSlug = page.slug;
  state.projectDoc = doc;

  const worldSel = typeof document !== 'undefined' ? document.getElementById('world-select') : null;
  if (worldSel) worldSel.value = state.worldKey;
}

/* ==========================================================================
   50-STEP UNDO (Ctrl+Z) & REDO (Ctrl+Y / Ctrl+Shift+Z)
   ========================================================================== */
function captureProjectSnapshotForHistory() {
  syncEngineStateToPage();
  const doc = ensureProjectDocInitialized();
  const snap = deepCloneJSON({
    worldKey: doc.worldKey,
    brandProfile: doc.brandProfile,
    tokens: doc.tokens,
    globalEquipped: doc.globalEquipped,
    equipped: doc.equipped,
    activePageId: doc.activePageId,
    pages: doc.pages,
    proposalSlot: typeof state !== 'undefined' ? state.proposalSlot : 'A',
    proposals: doc.proposals
  });
  return snap;
}

function applyProjectSnapshotFromHistory(snap) {
  if (!snap) return;
  const doc = ensureProjectDocInitialized();
  doc.worldKey = snap.worldKey || 'maison';
  doc.brandProfile = deepCloneJSON(snap.brandProfile || null);
  doc.tokens = deepCloneJSON(snap.tokens || { radius: 10, density: 'balanced', grain: 0.035, customAccent: null });
  doc.equipped = deepCloneJSON(snap.equipped || {});
  doc.globalEquipped = extractGlobalEquipped(snap.globalEquipped || doc.equipped, doc.worldKey);
  doc.pages = deepCloneJSON(snap.pages || makeDefaultPagesForWorld(doc.worldKey));
  doc.activePageId = snap.activePageId || doc.pages[0]?.id || 'page-home';
  if (snap.proposals) {
    doc.proposals = deepCloneJSON(snap.proposals);
  }
  if (typeof state !== 'undefined' && snap.proposalSlot) {
    state.proposalSlot = snap.proposalSlot;
  }
  syncPageToEngineState(doc);
}

function updateUndoRedoButtonsUI() {
  if (typeof document === 'undefined') return;
  const uBtn = document.getElementById('undo-btn');
  const rBtn = document.getElementById('redo-btn');
  const uLen = (typeof state !== 'undefined' && Array.isArray(state.undoStack)) ? state.undoStack.length : 0;
  const rLen = projectRedoStack.length;
  if (uBtn) {
    uBtn.style.opacity = uLen > 0 ? '1' : '0.45';
    uBtn.textContent = uLen > 0 ? `↩ (${uLen})` : '↩';
  }
  if (rBtn) {
    rBtn.style.opacity = rLen > 0 ? '1' : '0.45';
    rBtn.textContent = rLen > 0 ? `↪ (${rLen})` : '↪';
  }
}

function pushProjectUndoSnapshot() {
  if (typeof state === 'undefined') return;
  const snap = captureProjectSnapshotForHistory();
  state.undoStack.push(snap);
  if (state.undoStack.length > MAX_HISTORY) {
    state.undoStack.shift();
  }
  projectRedoStack = [];
  updateUndoRedoButtonsUI();
  scheduleAutosave();
}

function undoProjectAction() {
  blurActiveInlineEditingElement();
  if (typeof state === 'undefined' || !state.undoStack.length) {
    if (typeof showStudioToast === 'function') showStudioToast('되돌릴 변경 내역이 없습니다.');
    return false;
  }
  const savedSel = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.getSelection)
    ? FORMA_PRO.SelectionEngine.getSelection()
    : [];
  const currentSnap = captureProjectSnapshotForHistory();
  projectRedoStack.push(currentSnap);
  if (projectRedoStack.length > MAX_HISTORY) {
    projectRedoStack.shift();
  }
  const prevSnap = state.undoStack.pop();
  applyProjectSnapshotFromHistory(prevSnap);
  if (typeof clearSelectedCanvasUI === 'function') clearSelectedCanvasUI();
  updateUndoRedoButtonsUI();
  renderPageTabsUI();
  if (typeof renderQuickSubbar === 'function') renderQuickSubbar();
  if (typeof renderSidebarBody === 'function') renderSidebarBody();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  if (savedSel.length > 0 && typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.restoreSelectionAfterRender) {
    FORMA_PRO.SelectionEngine.restoreSelectionAfterRender(savedSel);
  }
  if (state.mode === 'vault' && typeof renderVaultView === 'function') renderVaultView();
  scheduleAutosave();
  if (typeof showStudioToast === 'function') showStudioToast('↩ 이전 상태로 되돌렸습니다.');
  return true;
}

function redoProjectAction() {
  blurActiveInlineEditingElement();
  if (typeof state === 'undefined' || !projectRedoStack.length) {
    if (typeof showStudioToast === 'function') showStudioToast('다시 실행할 변경 내역이 없습니다.');
    return false;
  }
  const savedSel = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.getSelection)
    ? FORMA_PRO.SelectionEngine.getSelection()
    : [];
  const currentSnap = captureProjectSnapshotForHistory();
  state.undoStack.push(currentSnap);
  if (state.undoStack.length > MAX_HISTORY) {
    state.undoStack.shift();
  }
  const nextSnap = projectRedoStack.pop();
  applyProjectSnapshotFromHistory(nextSnap);
  if (typeof clearSelectedCanvasUI === 'function') clearSelectedCanvasUI();
  updateUndoRedoButtonsUI();
  renderPageTabsUI();
  if (typeof renderQuickSubbar === 'function') renderQuickSubbar();
  if (typeof renderSidebarBody === 'function') renderSidebarBody();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  if (savedSel.length > 0 && typeof FORMA_PRO !== 'undefined' && FORMA_PRO.SelectionEngine?.restoreSelectionAfterRender) {
    FORMA_PRO.SelectionEngine.restoreSelectionAfterRender(savedSel);
  }
  if (state.mode === 'vault' && typeof renderVaultView === 'function') renderVaultView();
  scheduleAutosave();
  if (typeof showStudioToast === 'function') showStudioToast('↪ 변경 사항을 다시 실행했습니다.');
  return true;
}

/* ==========================================================================
   PAGE CRUD & TOPBAR PAGE SWITCHER UI ([data-testid="page-tabs"])
   ========================================================================== */
function renderPageTabsUI() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('st-page-tabs');
  const doc = ensureProjectDocInitialized();
  const activePage = getActivePageDoc(doc);
  if (container && doc && Array.isArray(doc.pages)) {
    container.innerHTML = doc.pages.map(p => {
      const isAct = activePage && p.id === activePage.id;
      return `<button type="button" class="st-mode-btn ${isAct ? 'is-active' : ''}" data-testid="page-tab-${p.slug}" data-page-id="${p.id}" data-page-slug="${p.slug}" aria-selected="${isAct ? 'true' : 'false'}" onclick="switchActivePage('${p.id}')" ondblclick="event.stopPropagation();renameActivePageInline('${p.id}')" style="padding:3px 9px;font-size:11.5px;">${p.title}</button>`;
    }).join('');
  }
  const delBtn = document.getElementById('st-delete-page-btn');
  if (delBtn && doc && Array.isArray(doc.pages)) {
    delBtn.style.opacity = doc.pages.length <= 1 ? '0.4' : '1';
  }
  const projTitleEl = document.getElementById('st-project-name-label');
  if (projTitleEl && doc) {
    projTitleEl.textContent = doc.projectName || '프로젝트';
  }
}

function switchActivePage(pageIdOrSlug, recordHistory = false) {
  blurActiveInlineEditingElement();
  const doc = ensureProjectDocInitialized();
  syncEngineStateToPage(doc);
  const target = doc.pages.find(p => p.id === pageIdOrSlug || p.slug === pageIdOrSlug);
  if (!target) return false;
  if (doc.activePageId === target.id) {
    renderPageTabsUI();
    return true;
  }
  if (recordHistory) {
    pushProjectUndoSnapshot();
  }
  doc.activePageId = target.id;
  syncPageToEngineState(doc);
  if (typeof clearSelectedCanvasUI === 'function') clearSelectedCanvasUI();
  renderPageTabsUI();
  const inClientMode = Boolean(typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.());
  if (!inClientMode) {
    if (typeof renderQuickSubbar === 'function') renderQuickSubbar();
    if (typeof renderSidebarBody === 'function') renderSidebarBody();
  }
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  if (typeof document !== 'undefined') {
    document.getElementById('canvas-frame')?.scrollTo?.({ top: 0, behavior: 'auto' });
  }
  if (typeof window !== 'undefined' && inClientMode) {
    window.scrollTo?.({ top: 0, behavior: 'auto' });
  }
  scheduleAutosave();
  return true;
}

function formaNavigatePage(targetSlugOrId, ev) {
  if (ev && typeof ev.preventDefault === 'function') {
    ev.preventDefault();
    ev.stopPropagation?.();
  }
  const clean = String(targetSlugOrId || '').replace(/^#\/?/, '').trim();
  if (!clean) return false;
  if (typeof window !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.() && typeof FORMA_PRO.ClientMode.navigateClientPage === 'function') {
    FORMA_PRO.ClientMode.navigateClientPage(clean);
    return false;
  }
  switchActivePage(clean, false);
  return false;
}

function addNewPage(customTitle) {
  blurActiveInlineEditingElement();
  const doc = ensureProjectDocInitialized();
  syncEngineStateToPage(doc);
  pushProjectUndoSnapshot();

  const idx = doc.pages.length + 1;
  const rawTitle = (typeof customTitle === 'string' && customTitle.trim())
    ? customTitle.trim()
    : ((customTitle && typeof customTitle === 'object' && typeof customTitle.title === 'string' && customTitle.title.trim())
        ? customTitle.title.trim()
        : `Page ${idx}`);
  const title = rawTitle;
  const slug = slugifyPageTitle(title, `page-${idx}`, doc.pages, null);
  const pageId = `page-${slug}-${Date.now().toString(36)}`;
  const w = (typeof WORLDS !== 'undefined' && WORLDS[doc.worldKey]) || (typeof WORLDS !== 'undefined' ? WORLDS.maison : {});

  const activeSecs = ['topbar', 'navbar', 'hero', 'feature', 'form', 'footer'];
  const allSecs = [...activeSecs, ...DEFAULT_SEC_ORDER.filter(k => !activeSecs.includes(k))];
  const secEnabled = {};
  allSecs.forEach(k => { secEnabled[k] = activeSecs.includes(k); });

  const subCopy = {
    eyebrow: `${title.toUpperCase()} · ${w.brand || 'FORMA'}`,
    h1Pre: `${w.brand || 'FORMA'}`,
    h1Accent: `${title}.`,
    h1Sub: w.h1Sub || '',
    heroImg: w.secImg1 || w.heroImg || 'courtyard',
    heroId: 'HERO-02'
  };
  const metaObj = {
    title: `${w.brand || 'FORMA'} — ${title}`,
    description: w.h1Sub || '',
    subpageCopy: subCopy
  };

  const newPage = {
    id: pageId,
    slug,
    title,
    meta: metaObj,
    pageMeta: { ...metaObj, ...subCopy },
    secOrder: allSecs,
    secEnabled,
    equipped: extractSectionEquipped(doc.equipped || w.preset || {}, doc.worldKey),
    equippedOverrides: {},
    secHeights: {},
    customSections: {},
    uiOffsets: {},
    elementOverrides: {},
    freeWidgets: [],
    customTexts: {},
    customImages: {},
    responsiveOverrides: { tablet: {}, mobile: {} },
    interactions: {}
  };

  doc.pages.push(newPage);
  doc.activePageId = newPage.id;
  syncPageToEngineState(doc);
  if (typeof clearSelectedCanvasUI === 'function') clearSelectedCanvasUI();
  renderPageTabsUI();
  if (typeof renderSidebarBody === 'function') renderSidebarBody();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  scheduleAutosave();
  if (typeof showStudioToast === 'function') showStudioToast(`📄 새 페이지 '${title}'가 추가되었습니다.`);
  return newPage;
}

function duplicateActivePage(targetPageIdOrSlug) {
  blurActiveInlineEditingElement();
  const doc = ensureProjectDocInitialized();
  syncEngineStateToPage(doc);
  const srcPage = (targetPageIdOrSlug
    ? doc.pages.find(p => p.id === targetPageIdOrSlug || p.slug === targetPageIdOrSlug)
    : null) || getActivePageDoc(doc);
  if (!srcPage) return null;
  pushProjectUndoSnapshot();

  const copyTitle = `${srcPage.title} Copy`;
  const copySlug = slugifyPageTitle(copyTitle, `${srcPage.slug}-copy`, doc.pages, null);
  const copyId = `page-${copySlug}-${Date.now().toString(36)}`;
  const cloned = deepCloneJSON(srcPage);
  cloned.id = copyId;
  cloned.slug = copySlug;
  cloned.title = copyTitle;
  if (cloned.meta) {
    cloned.meta.title = `${cloned.meta.title || srcPage.title} (Copy)`;
  }
  if (cloned.pageMeta) {
    cloned.pageMeta.title = cloned.meta?.title || copyTitle;
  }
  cloned.equipped = extractSectionEquipped(cloned.equipped || doc.equipped, doc.worldKey);
  cloned.elementOverrides = deepCloneJSON(cloned.uiOffsets || cloned.elementOverrides || {});
  cloned.freeWidgets = (cloned.freeWidgets || []).map((fw, i) => ({
    ...fw,
    uid: `fw-${Date.now()}-${i}-${Math.floor(Math.random() * 9999)}`
  }));

  const srcIdx = doc.pages.findIndex(p => p.id === srcPage.id);
  if (srcIdx >= 0) doc.pages.splice(srcIdx + 1, 0, cloned);
  else doc.pages.push(cloned);

  doc.activePageId = cloned.id;
  syncPageToEngineState(doc);
  if (typeof clearSelectedCanvasUI === 'function') clearSelectedCanvasUI();
  renderPageTabsUI();
  if (typeof renderSidebarBody === 'function') renderSidebarBody();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  scheduleAutosave();
  if (typeof showStudioToast === 'function') showStudioToast(`⎘ '${srcPage.title}' 페이지가 복제되었습니다.`);
  return cloned;
}

function commitPageRename(pageIdOrSlug, newTitleRaw) {
  blurActiveInlineEditingElement();
  const doc = ensureProjectDocInitialized();
  let page = null;
  let targetTitle = newTitleRaw;
  if (newTitleRaw === undefined && typeof pageIdOrSlug === 'string') {
    page = getActivePageDoc(doc);
    targetTitle = pageIdOrSlug;
  } else {
    page = doc.pages.find(p => p.id === pageIdOrSlug || p.slug === pageIdOrSlug) || getActivePageDoc(doc);
  }
  if (!page) return false;
  const trimmed = String(targetTitle || '').trim();
  if (!trimmed || trimmed === page.title) {
    renderPageTabsUI();
    return false;
  }
  syncEngineStateToPage(doc);
  pushProjectUndoSnapshot();
  page.title = trimmed;
  page.slug = slugifyPageTitle(trimmed, page.slug, doc.pages, page.id);
  const w = (typeof WORLDS !== 'undefined' && WORLDS[doc.worldKey]) || { brand: 'FORMA' };
  page.meta = page.meta || {};
  page.meta.title = `${w.brand} — ${trimmed}`;
  page.pageMeta = page.pageMeta || {};
  page.pageMeta.title = page.meta.title;
  syncPageToEngineState(doc);
  renderPageTabsUI();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  scheduleAutosave();
  if (typeof showStudioToast === 'function') showStudioToast(`✏️ 페이지 이름이 '${trimmed}'(으)로 변경되었습니다.`);
  return true;
}

function renameActivePageInline(targetPageId, directNewTitle) {
  const doc = ensureProjectDocInitialized();
  const page = (targetPageId ? doc.pages.find(p => p.id === targetPageId || p.slug === targetPageId) : null) || getActivePageDoc(doc);
  if (!page) return;

  if (typeof directNewTitle === 'string' && directNewTitle.trim()) {
    commitPageRename(page.id, directNewTitle);
    return;
  }

  if (typeof document === 'undefined') return;
  const container = document.getElementById('st-page-tabs');
  if (!container) return;
  const tabBtn = container.querySelector(`[data-page-id="${page.id}"]`) || container.querySelector(`[data-testid="page-tab-${page.slug}"]`);
  if (!tabBtn) return;

  const inp = document.createElement('input');
  inp.type = 'text';
  inp.value = page.title;
  inp.setAttribute?.('data-testid', 'page-rename-input');
  if (inp.dataset) inp.dataset.testid = 'page-rename-input';
  inp.style.cssText = 'width:86px;padding:2px 6px;border-radius:6px;border:1.5px solid #38BDF8;background:#090B10;color:#F8FAFC;font-size:11.5px;font-weight:700;outline:none;';

  let finished = false;
  const finish = (save) => {
    if (finished) return;
    finished = true;
    if (save) {
      commitPageRename(page.id, inp.value);
    } else {
      renderPageTabsUI();
    }
  };

  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finish(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      finish(false);
    }
  });
  inp.addEventListener('blur', () => finish(true));

  tabBtn.replaceWith(inp);
  inp.focus();
  inp.select?.();
}

function deleteActivePage(targetPageIdOrSlug) {
  blurActiveInlineEditingElement();
  const doc = ensureProjectDocInitialized();
  if (!doc.pages || doc.pages.length <= 1) {
    if (typeof showStudioToast === 'function') showStudioToast('최소 1개의 페이지는 유지되어야 합니다.');
    return false;
  }
  syncEngineStateToPage(doc);
  pushProjectUndoSnapshot();
  const targetIdx = targetPageIdOrSlug
    ? doc.pages.findIndex(p => p.id === targetPageIdOrSlug || p.slug === targetPageIdOrSlug)
    : doc.pages.findIndex(p => p.id === doc.activePageId);
  const curIdx = targetIdx >= 0 ? targetIdx : 0;
  const removed = doc.pages[curIdx];
  doc.pages = doc.pages.filter(p => p.id !== removed.id);
  const nextPage = doc.pages[Math.max(0, Math.min(curIdx, doc.pages.length - 1))] || doc.pages[0];
  doc.activePageId = nextPage.id;
  syncPageToEngineState(doc);
  if (typeof clearSelectedCanvasUI === 'function') clearSelectedCanvasUI();
  renderPageTabsUI();
  if (typeof renderSidebarBody === 'function') renderSidebarBody();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  scheduleAutosave();
  if (typeof showStudioToast === 'function') showStudioToast(`🗑 '${removed.title}' 페이지가 삭제되었습니다.`);
  return true;
}

/* ==========================================================================
   IndexedDB (forma_studio_db_v1) + localStorage REAL-TIME AUTO-SAVE (F07)
   ========================================================================== */
function openStudioIDB() {
  if (idbPromise) return idbPromise;
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  idbPromise = new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'projectId' });
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('assets')) {
          db.createObjectStore('assets', { keyPath: 'assetKey' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
  return idbPromise;
}

function setAutosaveStatusUI(status) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById('st-autosave-status')
    || document.getElementById('autosave-status')
    || (typeof document.querySelector === 'function' ? document.querySelector('[data-testid="autosave-status"]') : null);
  if (!el) return;
  if (status === 'saving') {
    el.setAttribute?.('data-saved', 'false');
    if (el.dataset) el.dataset.saved = 'false';
    el.textContent = '저장 중...';
    el.style.color = '#94A3B8';
  } else if (status === 'error') {
    el.setAttribute?.('data-saved', 'false');
    if (el.dataset) el.dataset.saved = 'false';
    el.textContent = '⚠ 로컬 백업됨';
    el.style.color = '#FBBF24';
  } else {
    el.setAttribute?.('data-saved', 'true');
    if (el.dataset) el.dataset.saved = 'true';
    el.textContent = '✓ 자동 저장됨';
    el.style.color = '#34D399';
  }
}

function updateProjectsIndexInLocalStorage(doc) {
  if (typeof localStorage === 'undefined' || !doc) return;
  try {
    const raw = localStorage.getItem(LS_INDEX_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const entry = {
      projectId: doc.projectId,
      projectName: doc.projectName || '프로젝트',
      worldKey: doc.worldKey || 'maison',
      updatedAt: doc.updatedAt || Date.now(),
      pageCount: Array.isArray(doc.pages) ? doc.pages.length : 1
    };
    const filtered = Array.isArray(list) ? list.filter(x => x && x.projectId !== doc.projectId) : [];
    filtered.unshift(entry);
    localStorage.setItem(LS_INDEX_KEY, JSON.stringify(filtered.slice(0, 30)));
  } catch (_) {}
}

function saveToLocalStorageSync(doc) {
  if (typeof localStorage === 'undefined' || !doc) return false;
  try {
    const serialized = JSON.stringify(doc);
    localStorage.setItem(LS_ACTIVE_KEY, serialized);
    localStorage.setItem(`forma_studio_project_${doc.projectId}`, serialized);
    updateProjectsIndexInLocalStorage(doc);
    return true;
  } catch (_) {
    try {
      const slimDoc = { ...doc, customAssets: {} };
      const serialized = JSON.stringify(slimDoc);
      localStorage.setItem(LS_ACTIVE_KEY, serialized);
      localStorage.setItem(`forma_studio_project_${doc.projectId}`, serialized);
      updateProjectsIndexInLocalStorage(doc);
      return true;
    } catch (_e2) {
      return false;
    }
  }
}

async function flushAutosaveNow() {
  if (autosaveTimer) {
    clearTimeout(autosaveTimer);
    autosaveTimer = null;
  }
  const doc = ensureProjectDocInitialized();
  syncEngineStateToPage(doc);
  const lsOk = saveToLocalStorageSync(doc);

  let idbOk = false;
  try {
    const db = await openStudioIDB();
    if (db) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(['projects', 'meta'], 'readwrite');
          tx.objectStore('projects').put(deepCloneJSON(doc));
          tx.objectStore('meta').put({ key: 'activeProjectId', value: doc.projectId, updatedAt: doc.updatedAt });
          tx.oncomplete = () => { idbOk = true; resolve(true); };
          tx.onerror = () => resolve(false);
        } catch (_) {
          resolve(false);
        }
      });
    }
  } catch (_) {}

  setAutosaveStatusUI((idbOk || lsOk) ? 'saved' : 'error');
  return idbOk || lsOk;
}

function scheduleAutosave() {
  if (typeof window !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.()) return;
  const doc = ensureProjectDocInitialized();
  syncEngineStateToPage(doc);
  // Immediately mirror to localStorage so even an instant F5 reload never drops recent edits
  saveToLocalStorageSync(doc);
  setAutosaveStatusUI('saving');
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    flushAutosaveNow();
  }, 260);
}

/* ==========================================================================
   IMAGE WEBP COMPRESSION & DEDUPLICATION (customAssets)
   ========================================================================== */
function fnv1aHashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
  }
  return h.toString(36);
}

function registerCustomAsset(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  if (dataUrl.startsWith('asset://')) return dataUrl;
  const doc = ensureProjectDocInitialized();
  doc.customAssets = doc.customAssets || {};
  const hash = fnv1aHashString(dataUrl);
  const assetKey = 'ast_' + hash;
  if (doc.customAssets['asset_' + hash]) {
    delete doc.customAssets['asset_' + hash];
  }
  doc.customAssets[assetKey] = dataUrl;
  return 'asset://' + assetKey;
}

async function compressAndStoreImageAsset(fileOrDataUrl) {
  const doc = ensureProjectDocInitialized();
  doc.customAssets = doc.customAssets || {};

  if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('asset://')) {
    return fileOrDataUrl;
  }

  let rawDataUrl = '';
  if (typeof fileOrDataUrl === 'string') {
    rawDataUrl = fileOrDataUrl;
  } else if (fileOrDataUrl && typeof FileReader !== 'undefined') {
    rawDataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
    });
  }
  if (!rawDataUrl) return '';

  // Attempt <canvas> WebP compression (max 1600px) when running in browser and image payload is large (> 48KB)
  let finalDataUrl = rawDataUrl;
  if (
    typeof document !== 'undefined' &&
    typeof Image !== 'undefined' &&
    rawDataUrl.startsWith('data:image/') &&
    rawDataUrl.length > 48000
  ) {
    try {
      finalDataUrl = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          try {
            const maxDim = 1600;
            let w = img.naturalWidth || img.width || 800;
            let h = img.naturalHeight || img.height || 600;
            if (w > maxDim || h > maxDim) {
              if (w >= h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            const cv = document.createElement('canvas');
            cv.width = Math.max(1, w);
            cv.height = Math.max(1, h);
            const ctx = cv.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, cv.width, cv.height);
              const webp = cv.toDataURL('image/webp', 0.84);
              resolve(webp && webp.startsWith('data:image/') ? webp : rawDataUrl);
              return;
            }
          } catch (_) {}
          resolve(rawDataUrl);
        };
        img.onerror = () => resolve(rawDataUrl);
        img.src = rawDataUrl;
      });
    } catch (_) {
      finalDataUrl = rawDataUrl;
    }
  }

  return registerCustomAsset(finalDataUrl);
}

function resolveAssetRef(srcOrKey) {
  if (!srcOrKey || typeof srcOrKey !== 'string') return srcOrKey || '';
  const doc = ensureProjectDocInitialized();
  const assets = (doc && doc.customAssets) || {};
  if (srcOrKey.startsWith('asset://')) {
    const key = srcOrKey.slice('asset://'.length);
    const altKey = key.startsWith('ast_') ? ('asset_' + key.slice(4)) : (key.startsWith('asset_') ? ('ast_' + key.slice(6)) : key);
    return assets[key] || assets[altKey] || srcOrKey;
  }
  if ((srcOrKey.startsWith('ast_') || srcOrKey.startsWith('asset_')) && assets[srcOrKey]) {
    return assets[srcOrKey];
  }
  if (srcOrKey.includes('asset://')) {
    return srcOrKey.replace(/asset:\/\/(ast_[a-z0-9]+|asset_[a-z0-9]+)/gi, (full, key) => {
      const altKey = key.startsWith('ast_') ? ('asset_' + key.slice(4)) : (key.startsWith('asset_') ? ('ast_' + key.slice(6)) : key);
      return assets[key] || assets[altKey] || full;
    });
  }
  return srcOrKey;
}

/* ==========================================================================
   PROJECT VALIDATION, .forma.json EXPORT / IMPORT & MULTI-PROJECT CRUD
   ========================================================================== */
function validateAndNormalizeProjectJSON(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null;
  }
  if (parsed.version !== undefined && parsed.version !== 1 && parsed.version !== 2) {
    return null;
  }
  if (parsed.schemaVersion !== undefined && parsed.schemaVersion !== 1 && parsed.schemaVersion !== 2) {
    return null;
  }
  const worldKey = (typeof parsed.worldKey === 'string' && typeof WORLDS !== 'undefined' && WORLDS[parsed.worldKey])
    ? parsed.worldKey
    : null;
  if (!worldKey) return null;

  const rawTopEquipped = (parsed.equipped && typeof parsed.equipped === 'object' && !Array.isArray(parsed.equipped))
    ? parsed.equipped
    : ((parsed.globalEquipped && typeof parsed.globalEquipped === 'object' && !Array.isArray(parsed.globalEquipped))
        ? parsed.globalEquipped
        : null);
  if (!rawTopEquipped) {
    return null;
  }

  // Upgrade v1 single-page schema if needed, or validate v2 pages
  let pages = null;
  if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
    const validPages = parsed.pages.filter(p => p && typeof p === 'object' && typeof p.slug === 'string' && typeof p.title === 'string' && Array.isArray(p.secOrder));
    if (!validPages.length) return null;
    pages = validPages.map(p => {
      const rawOffsets = (p.uiOffsets && typeof p.uiOffsets === 'object' && Object.keys(p.uiOffsets).length)
        ? p.uiOffsets
        : ((p.elementOverrides && typeof p.elementOverrides === 'object') ? p.elementOverrides : {});
      const rawMeta = (p.meta && typeof p.meta === 'object')
        ? p.meta
        : ((p.pageMeta && typeof p.pageMeta === 'object') ? p.pageMeta : { title: p.title, description: '' });
      const rawPageMeta = (p.pageMeta && typeof p.pageMeta === 'object')
        ? { ...rawMeta, ...p.pageMeta }
        : { ...(rawMeta.subpageCopy || {}), ...rawMeta };
      const rawPageEq = (p.equipped && typeof p.equipped === 'object' && !Array.isArray(p.equipped)) ? p.equipped : {};
      const rawPageEqOverrides = (p.equippedOverrides && typeof p.equippedOverrides === 'object' && !Array.isArray(p.equippedOverrides)) ? p.equippedOverrides : {};
      const mergedPageEq = extractSectionEquipped({ ...(WORLDS[worldKey]?.preset || {}), ...rawTopEquipped, ...rawPageEq, ...rawPageEqOverrides }, worldKey);

      return {
        id: p.id || `page-${p.slug}`,
        slug: p.slug,
        title: p.title,
        meta: deepCloneJSON(rawMeta),
        pageMeta: deepCloneJSON(rawPageMeta),
        secOrder: [...p.secOrder],
        secEnabled: { ...(p.secEnabled || {}) },
        equipped: mergedPageEq,
        equippedOverrides: { ...rawPageEq, ...rawPageEqOverrides },
        secHeights: { ...(p.secHeights || {}) },
        customSections: deepCloneJSON(p.customSections || {}),
        uiOffsets: deepCloneJSON(rawOffsets),
        elementOverrides: deepCloneJSON(rawOffsets),
        freeWidgets: deepCloneJSON(p.freeWidgets || []),
        customTexts: { ...(p.customTexts || {}) },
        customImages: { ...(p.customImages || {}) },
        responsiveOverrides: deepCloneJSON(p.responsiveOverrides || { tablet: {}, mobile: {} }),
        interactions: deepCloneJSON(p.interactions || {})
      };
    });
  } else if (Array.isArray(parsed.secOrder)) {
    const defaultPages = makeDefaultPagesForWorld(worldKey);
    const rawOffsets = (parsed.uiOffsets && typeof parsed.uiOffsets === 'object' && Object.keys(parsed.uiOffsets).length)
      ? parsed.uiOffsets
      : ((parsed.elementOverrides && typeof parsed.elementOverrides === 'object') ? parsed.elementOverrides : {});
    defaultPages[0].secOrder = [...parsed.secOrder];
    defaultPages[0].secEnabled = { ...(parsed.secEnabled || defaultPages[0].secEnabled) };
    defaultPages[0].equipped = extractSectionEquipped({ ...(WORLDS[worldKey]?.preset || {}), ...rawTopEquipped }, worldKey);
    defaultPages[0].secHeights = { ...(parsed.secHeights || {}) };
    defaultPages[0].customSections = deepCloneJSON(parsed.customSections || {});
    defaultPages[0].uiOffsets = deepCloneJSON(rawOffsets);
    defaultPages[0].elementOverrides = deepCloneJSON(rawOffsets);
    defaultPages[0].freeWidgets = deepCloneJSON(parsed.freeWidgets || []);
    defaultPages[0].customTexts = { ...(parsed.customTexts || {}) };
    defaultPages[0].customImages = { ...(parsed.customImages || {}) };
    pages = defaultPages;
  } else {
    return null;
  }

  const baseDoc = createDefaultProjectDocument(worldKey, parsed.projectName || `${WORLDS[worldKey].brand} 프로젝트`, parsed.projectId);
  baseDoc.format = 'forma-studio-project';
  baseDoc.version = 2;
  baseDoc.schemaVersion = 2;
  baseDoc.createdAt = Number(parsed.createdAt) || baseDoc.createdAt;
  baseDoc.updatedAt = Number(parsed.updatedAt) || baseDoc.updatedAt;
  baseDoc.brandProfile = parsed.brandProfile ? deepCloneJSON(parsed.brandProfile) : baseDoc.brandProfile;
  baseDoc.tokens = { ...baseDoc.tokens, ...(parsed.tokens || {}) };
  const mergedTopEq = { ...baseDoc.equipped, ...(parsed.equipped || {}), ...(parsed.globalEquipped || {}) };
  baseDoc.equipped = mergedTopEq;
  baseDoc.globalEquipped = extractGlobalEquipped(mergedTopEq, worldKey);
  baseDoc.pages = pages;
  baseDoc.activePageId = pages.some(p => p.id === parsed.activePageId) ? parsed.activePageId : pages[0].id;
  if (parsed.proposals && typeof parsed.proposals === 'object') {
    baseDoc.proposals = deepCloneJSON(parsed.proposals);
  }
  if (parsed.customAssets && typeof parsed.customAssets === 'object') {
    baseDoc.customAssets = deepCloneJSON(parsed.customAssets);
  }
  return baseDoc;
}

function exportProjectJSON() {
  const doc = ensureProjectDocInitialized();
  syncEngineStateToPage(doc);
  doc.format = 'forma-studio-project';
  doc.version = 2;
  doc.schemaVersion = 2;
  doc.globalEquipped = extractGlobalEquipped(doc.globalEquipped || doc.equipped, doc.worldKey);
  const jsonStr = JSON.stringify(doc, null, 2);
  if (typeof window !== 'undefined') {
    window.__lastExportedProjectJSON = jsonStr;
  }
  if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof document !== 'undefined') {
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = String(doc.projectName || doc.worldKey || 'forma-project')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣-_]+/g, '-');
    a.href = url;
    a.download = `${safeName || 'forma-project'}.forma.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  if (typeof showStudioToast === 'function') showStudioToast('💾 프로젝트 파일(.forma.json) 다운로드가 시작되었습니다.');
  return jsonStr;
}

function importProjectJSONText(rawText) {
  let parsed = null;
  if (rawText && typeof rawText === 'object' && !Array.isArray(rawText)) {
    parsed = rawText;
  } else if (typeof rawText === 'string' && rawText.trim()) {
    try {
      parsed = JSON.parse(rawText);
    } catch (_) {
      if (typeof showStudioToast === 'function') {
        showStudioToast('⚠ 손상되었거나 올바르지 않은 JSON 파일입니다.');
      }
      return false;
    }
  } else {
    if (typeof showStudioToast === 'function') {
      showStudioToast('⚠ 손상되었거나 올바르지 않은 JSON 파일입니다.');
    }
    return false;
  }

  const normalized = validateAndNormalizeProjectJSON(parsed);
  if (!normalized) {
    if (typeof showStudioToast === 'function') {
      showStudioToast('⚠ 유효하지 않은 .forma.json 프로젝트 스키마입니다.');
    }
    return false;
  }

  pushProjectUndoSnapshot();
  normalized.updatedAt = Date.now();
  activeProjectDoc = normalized;
  syncPageToEngineState(activeProjectDoc);
  if (typeof clearSelectedCanvasUI === 'function') clearSelectedCanvasUI();
  renderPageTabsUI();
  if (typeof renderQuickSubbar === 'function') renderQuickSubbar();
  if (typeof renderSidebarBody === 'function') renderSidebarBody();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  if (typeof state !== 'undefined' && state.mode === 'vault' && typeof renderVaultView === 'function') renderVaultView();
  flushAutosaveNow();
  if (typeof document !== 'undefined') {
    document.getElementById('projects-modal')?.classList.remove('is-open');
  }
  if (typeof showStudioToast === 'function') {
    showStudioToast(`📂 '${normalized.projectName}' 프로젝트를 성공적으로 불러왔습니다.`);
  }
  return activeProjectDoc;
}

function handleProjectJSONFileInput(ev) {
  const file = ev?.target?.files?.[0];
  if (!file || typeof FileReader === 'undefined') return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const txt = String(e.target?.result || '');
    importProjectJSONText(txt);
    if (ev.target) ev.target.value = '';
  };
  reader.onerror = () => {
    if (typeof showStudioToast === 'function') showStudioToast('⚠ 프로젝트 파일을 읽는 중 오류가 발생했습니다.');
  };
  reader.readAsText(file, 'utf-8');
}

function triggerProjectJSONImport() {
  if (typeof document === 'undefined') return;
  const inp = document.getElementById('import-project-json-input');
  if (inp) {
    inp.value = '';
    inp.click();
  }
}

/* ==========================================================================
   MULTI-PROJECT MANAGER MODAL (Create / Switch / Duplicate / Rename / Delete)
   ========================================================================== */
async function listSavedProjects() {
  const doc = ensureProjectDocInitialized();
  syncEngineStateToPage(doc);
  saveToLocalStorageSync(doc);

  const byId = new Map();
  byId.set(doc.projectId, {
    projectId: doc.projectId,
    projectName: doc.projectName,
    worldKey: doc.worldKey,
    updatedAt: doc.updatedAt,
    pageCount: doc.pages.length
  });

  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(LS_INDEX_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item && item.projectId && !byId.has(item.projectId)) {
            byId.set(item.projectId, item);
          }
        });
      }
    } catch (_) {}
  }

  try {
    const db = await openStudioIDB();
    if (db) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(['projects'], 'readonly');
          const req = tx.objectStore('projects').getAll();
          req.onsuccess = () => {
            (req.result || []).forEach(p => {
              if (p && p.projectId) {
                byId.set(p.projectId, {
                  projectId: p.projectId,
                  projectName: p.projectName || '프로젝트',
                  worldKey: p.worldKey || 'maison',
                  updatedAt: p.updatedAt || Date.now(),
                  pageCount: Array.isArray(p.pages) ? p.pages.length : 4
                });
              }
            });
            resolve(true);
          };
          req.onerror = () => resolve(false);
        } catch (_) {
          resolve(false);
        }
      });
    }
  } catch (_) {}

  return Array.from(byId.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

async function renderProjectsModalList() {
  if (typeof document === 'undefined') return;
  const listEl = document.getElementById('projects-modal-list');
  if (!listEl) return;
  const projects = await listSavedProjects();
  const activeId = ensureProjectDocInitialized().projectId;

  listEl.innerHTML = projects.map(p => {
    const isAct = p.projectId === activeId;
    const wName = (typeof WORLDS !== 'undefined' && WORLDS[p.worldKey]?.name) || p.worldKey;
    return `<div style="padding:12px 14px;border-radius:10px;background:${isAct ? 'rgba(56,189,248,0.12)' : '#151924'};border:1px solid ${isAct ? '#38BDF8' : 'rgba(255,255,255,0.09)'};display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;">
      <div>
        <div style="display:flex;align-items:center;gap:8px;">
          <strong style="font-size:13.5px;color:#F8FAFC;">${p.projectName}</strong>
          ${isAct ? `<span style="font-size:10.5px;padding:2px 7px;border-radius:999px;background:#38BDF8;color:#061018;font-weight:800;">현재 작업 중</span>` : ''}
        </div>
        <div class="f-mono" style="font-size:11px;color:#94A3B8;margin-top:4px;">${wName} · ${p.pageCount || 4} Pages</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        ${!isAct ? `<button type="button" class="st-pill-btn is-primary" onclick="FORMA_PRO.ProjectState.switchToProject('${p.projectId}')">열기</button>` : ''}
        <button type="button" class="st-pill-btn" onclick="FORMA_PRO.ProjectState.duplicateProjectById('${p.projectId}')">⎘ 복제</button>
        ${projects.length > 1 ? `<button type="button" class="st-pill-btn" style="color:#FCA5A5;" onclick="FORMA_PRO.ProjectState.deleteProjectById('${p.projectId}')">🗑</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function openProjectsModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('projects-modal');
  if (!modal) return;
  const doc = ensureProjectDocInitialized();
  const nameInp = document.getElementById('current-project-name-input');
  if (nameInp) nameInp.value = doc.projectName || '';
  modal.classList.add('is-open');
  renderProjectsModalList();
}

function updateCurrentProjectName(newName) {
  const doc = ensureProjectDocInitialized();
  const clean = String(newName || '').trim();
  if (!clean) return;
  doc.projectName = clean;
  renderPageTabsUI();
  scheduleAutosave();
  renderProjectsModalList();
  if (typeof showStudioToast === 'function') showStudioToast(`✏️ 프로젝트 이름이 '${clean}'(으)로 저장되었습니다.`);
}

async function createNewProject(customName, worldKeyOverride) {
  const prevDoc = ensureProjectDocInitialized();
  syncEngineStateToPage(prevDoc);
  saveToLocalStorageSync(prevDoc);
  flushAutosaveNow();

  const wk = worldKeyOverride || (typeof state !== 'undefined' && state.worldKey) || 'maison';
  const w = (typeof WORLDS !== 'undefined' && WORLDS[wk]) || { brand: 'FORMA' };
  const name = (typeof customName === 'string' && customName.trim())
    ? customName.trim()
    : `${w.brand} 새 프로젝트`;
  activeProjectDoc = createDefaultProjectDocument(wk, name);
  if (typeof state !== 'undefined') {
    state.undoStack = [];
  }
  projectRedoStack = [];
  syncPageToEngineState(activeProjectDoc);
  if (typeof clearSelectedCanvasUI === 'function') clearSelectedCanvasUI();
  updateUndoRedoButtonsUI();
  renderPageTabsUI();
  if (typeof renderQuickSubbar === 'function') renderQuickSubbar();
  if (typeof renderSidebarBody === 'function') renderSidebarBody();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  saveToLocalStorageSync(activeProjectDoc);
  await flushAutosaveNow();
  await renderProjectsModalList();
  if (typeof showStudioToast === 'function') showStudioToast(`✨ 새 프로젝트 '${name}'가 생성되었습니다.`);
  return activeProjectDoc;
}

async function loadProjectRecordById(projectId) {
  if (!projectId) return null;
  let lsDoc = null;
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(`forma_studio_project_${projectId}`);
      if (raw) {
        lsDoc = validateAndNormalizeProjectJSON(JSON.parse(raw));
      }
    } catch (_) {}
  }
  let idbDoc = null;
  try {
    const db = await openStudioIDB();
    if (db) {
      const fromIdb = await new Promise((resolve) => {
        try {
          const tx = db.transaction(['projects'], 'readonly');
          const req = tx.objectStore('projects').get(projectId);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        } catch (_) {
          resolve(null);
        }
      });
      if (fromIdb) idbDoc = validateAndNormalizeProjectJSON(fromIdb);
    }
  } catch (_) {}
  if (lsDoc && idbDoc) {
    return (idbDoc.updatedAt || 0) > (lsDoc.updatedAt || 0) ? idbDoc : lsDoc;
  }
  return idbDoc || lsDoc;
}

async function switchToProject(projectId) {
  const prevDoc = ensureProjectDocInitialized();
  syncEngineStateToPage(prevDoc);
  saveToLocalStorageSync(prevDoc);

  // Synchronous fast-path from localStorage so UI updates in 0ms on click
  let loaded = null;
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(`forma_studio_project_${projectId}`);
      if (raw) loaded = validateAndNormalizeProjectJSON(JSON.parse(raw));
    } catch (_) {}
  }
  if (!loaded) {
    await flushAutosaveNow();
    loaded = await loadProjectRecordById(projectId);
  }
  if (!loaded) {
    if (typeof showStudioToast === 'function') showStudioToast('프로젝트를 찾을 수 없습니다.');
    return false;
  }
  activeProjectDoc = loaded;
  if (typeof state !== 'undefined') state.undoStack = [];
  projectRedoStack = [];
  syncPageToEngineState(activeProjectDoc);
  if (typeof clearSelectedCanvasUI === 'function') clearSelectedCanvasUI();
  updateUndoRedoButtonsUI();
  renderPageTabsUI();
  if (typeof renderQuickSubbar === 'function') renderQuickSubbar();
  if (typeof renderSidebarBody === 'function') renderSidebarBody();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  saveToLocalStorageSync(activeProjectDoc);
  await flushAutosaveNow();
  await renderProjectsModalList();
  if (typeof showStudioToast === 'function') showStudioToast(`📂 '${loaded.projectName}' 프로젝트로 전환했습니다.`);
  return true;
}

async function duplicateProjectById(projectId) {
  await flushAutosaveNow();
  const src = (projectId === ensureProjectDocInitialized().projectId)
    ? deepCloneJSON(ensureProjectDocInitialized())
    : await loadProjectRecordById(projectId);
  if (!src) return null;
  const now = Date.now();
  src.projectId = 'proj-' + now.toString(36) + '-' + Math.floor(Math.random() * 9999).toString(36);
  src.projectName = `${src.projectName || '프로젝트'} (복제본)`;
  src.createdAt = now;
  src.updatedAt = now;
  activeProjectDoc = src;
  syncPageToEngineState(activeProjectDoc);
  renderPageTabsUI();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  await flushAutosaveNow();
  await renderProjectsModalList();
  if (typeof showStudioToast === 'function') showStudioToast(`⎘ '${src.projectName}' 프로젝트가 복제되었습니다.`);
  return src;
}

async function deleteProjectById(projectId) {
  const projects = await listSavedProjects();
  if (projects.length <= 1) {
    if (typeof showStudioToast === 'function') showStudioToast('최소 1개의 프로젝트는 유지되어야 합니다.');
    return false;
  }
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(`forma_studio_project_${projectId}`);
      const raw = localStorage.getItem(LS_INDEX_KEY);
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) {
        localStorage.setItem(LS_INDEX_KEY, JSON.stringify(list.filter(x => x && x.projectId !== projectId)));
      }
    } catch (_) {}
  }
  try {
    const db = await openStudioIDB();
    if (db) {
      await new Promise((resolve) => {
        try {
          const tx = db.transaction(['projects'], 'readwrite');
          tx.objectStore('projects').delete(projectId);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        } catch (_) {
          resolve(false);
        }
      });
    }
  } catch (_) {}

  if (ensureProjectDocInitialized().projectId === projectId) {
    const remaining = projects.filter(p => p.projectId !== projectId);
    if (remaining.length > 0) {
      await switchToProject(remaining[0].projectId);
    }
  } else {
    await renderProjectsModalList();
  }
  return true;
}

/* ==========================================================================
   BOOT HYDRATION (Embedded #forma-boot-project -> localStorage -> IndexedDB)
   ========================================================================== */
function hydrateProjectStateSync() {
  // 1. Check embedded #forma-boot-project script tag (from downloadStudioSelfHTML)
  if (typeof document !== 'undefined') {
    const bootScript = document.getElementById('forma-boot-project');
    if (bootScript && bootScript.textContent && bootScript.textContent.trim()) {
      try {
        const parsed = JSON.parse(bootScript.textContent);
        const norm = validateAndNormalizeProjectJSON(parsed);
        if (norm) {
          activeProjectDoc = norm;
          syncPageToEngineState(activeProjectDoc);
          return activeProjectDoc;
        }
      } catch (_) {}
    }
  }

  // 2. Check synchronous localStorage backup (instant zero-flicker restore on F5 reload!)
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(LS_ACTIVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const norm = validateAndNormalizeProjectJSON(parsed);
        if (norm) {
          activeProjectDoc = norm;
          syncPageToEngineState(activeProjectDoc);
          return activeProjectDoc;
        }
      }
    } catch (_) {}
  }

  // 3. Default project document
  activeProjectDoc = createDefaultProjectDocument((typeof state !== 'undefined' && state.worldKey) || 'maison');
  syncPageToEngineState(activeProjectDoc);
  return activeProjectDoc;
}

async function hydrateProjectStateFromIDBAsync(allowClient = false) {
  const inClientMode = Boolean(typeof window !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.());
  if (!allowClient && inClientMode) return;
  try {
    const db = await openStudioIDB();
    if (!db) return;
    const activeMeta = await new Promise((resolve) => {
      try {
        const tx = db.transaction(['meta'], 'readonly');
        const req = tx.objectStore('meta').get('activeProjectId');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
    const targetId = activeMeta?.value || ensureProjectDocInitialized().projectId;
    const idbDoc = await loadProjectRecordById(targetId);
    if (idbDoc && (!activeProjectDoc || (idbDoc.updatedAt || 0) > (activeProjectDoc.updatedAt || 0))) {
      activeProjectDoc = idbDoc;
      syncPageToEngineState(activeProjectDoc);
      renderPageTabsUI();
      if (!inClientMode) {
        if (typeof renderQuickSubbar === 'function') renderQuickSubbar();
        if (typeof renderSidebarBody === 'function') renderSidebarBody();
      }
      if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
    }
    setAutosaveStatusUI('saved');
  } catch (_) {}
}

function loadInitialProject() {
  const doc = hydrateProjectStateSync();
  hydrateProjectStateFromIDBAsync();
  return doc;
}

function getEffectiveWorldFromState(pageOpt) {
  if (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.BrandRestyler?.getEffectiveWorld) {
    return FORMA_PRO.BrandRestyler.getEffectiveWorld(pageOpt || null);
  }
  const doc = ensureProjectDocInitialized();
  const wk = doc?.worldKey || (typeof state !== 'undefined' && state.worldKey) || 'maison';
  return (typeof WORLDS !== 'undefined' && (WORLDS[wk] || WORLDS.maison)) || {};
}

globalThis.FORMA_PRO.ProjectState = window.FORMA_PRO.ProjectState = {
  getDoc: () => {
    const doc = ensureProjectDocInitialized();
    syncEngineStateToPage(doc);
    return doc;
  },
  setDoc: (newDoc, recordUndo = false) => {
    const norm = validateAndNormalizeProjectJSON(newDoc);
    if (!norm) return false;
    if (recordUndo) pushProjectUndoSnapshot();
    activeProjectDoc = norm;
    syncPageToEngineState(activeProjectDoc);
    renderPageTabsUI();
    const inClientMode = Boolean(typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ClientMode?.isClientMode?.());
    if (!inClientMode) {
      if (typeof renderQuickSubbar === 'function') renderQuickSubbar();
      if (typeof renderSidebarBody === 'function') renderSidebarBody();
    }
    if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
    scheduleAutosave();
    return true;
  },
  getActivePage: () => getActivePageDoc(ensureProjectDocInitialized()),
  getPages: () => ensureProjectDocInitialized().pages || [],
  setActivePage: switchActivePage,
  switchPage: switchActivePage,
  addPage: addNewPage,
  duplicatePage: duplicateActivePage,
  renamePage: commitPageRename,
  renameActivePageInline,
  startInlinePageRename: renameActivePageInline,
  deletePage: deleteActivePage,
  pushUndo: pushProjectUndoSnapshot,
  pushUndoSnapshot: pushProjectUndoSnapshot,
  undo: undoProjectAction,
  redo: redoProjectAction,
  scheduleAutoSave: scheduleAutosave,
  scheduleAutosave,
  flushAutosaveNow,
  loadInitialProject,
  hydrateProjectStateSync,
  hydrateProjectStateFromIDBAsync,
  syncToEngineState: syncPageToEngineState,
  syncFromEngineState: syncEngineStateToPage,
  syncEngineStateToPage,
  syncPageToEngineState,
  getEffectiveWorld: getEffectiveWorldFromState,
  registerCustomAsset,
  compressAndStoreImageAsset,
  resolveAssetRef,
  exportProjectJSON,
  importProjectJSON: importProjectJSONText,
  importProjectJSONText,
  handleProjectJSONFileInput,
  handleImportFileEvent: handleProjectJSONFileInput,
  triggerProjectJSONImport,
  openProjectsModal,
  createNewProject,
  switchToProject,
  duplicateProjectById,
  deleteProjectById,
  updateCurrentProjectName,
  createDefaultProjectDocument,
  createDefaultProposalsV2,
  makeDefaultPagesForWorld,
  validateAndNormalizeProjectJSON
};

globalThis.FORMA_PRO = window.FORMA_PRO;
