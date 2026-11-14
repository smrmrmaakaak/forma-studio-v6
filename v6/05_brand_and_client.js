/* ==========================================================================
   FORMA STUDIO Pro — MODULE 05: 1-SECOND BRAND RESTYLER & ?mode=client RUNTIME
   - WCAG 2.1 (>= 4.5:1) HSL Auto-Harmony Palette Token Engine (F17)
   - Non-Destructive Multi-Page Brand Restyler with 1-Step Undo (F17)
   - ?mode=client Zero-Chrome Runtime + #p=<deflate-base64url> Share Codec (F18)
   - #/<slug> Multi-Page Hash Router & Window Scroll Adaptation (F18)
   ========================================================================== */

globalThis.FORMA_PRO = window.FORMA_PRO = window.FORMA_PRO || globalThis.FORMA_PRO || {};

/* ==========================================================================
   1. WCAG 2.1 HSL COLOR HARMONY ENGINE (Contrast >= 4.5:1 Guaranteed)
   ========================================================================== */
function clampNum(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rgbToHex(r, g, b) {
  const to2 = (n) => clampNum(Math.round(n), 0, 255).toString(16).padStart(2, '0').toUpperCase();
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

function normalizeHex(input, fallback = '#8C5A32') {
  if (typeof input !== 'string') return fallback;
  const raw = input.trim();
  const rgbMatch = raw.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (rgbMatch) {
    return rgbToHex(
      clampNum(parseInt(rgbMatch[1], 10), 0, 255),
      clampNum(parseInt(rgbMatch[2], 10), 0, 255),
      clampNum(parseInt(rgbMatch[3], 10), 0, 255)
    );
  }
  let s = raw.replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(s)) {
    s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  } else if (/^[0-9a-fA-F]{8}$/.test(s)) {
    s = s.slice(0, 6);
  }
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return fallback;
  return '#' + s.toUpperCase();
}

function parseHexToRgb(hex) {
  const clean = normalizeHex(hex, '#8C5A32').slice(1);
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)); break;
      case gn: h = ((bn - rn) / d + 2); break;
      default: h = ((rn - gn) / d + 4); break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  const hn = ((h % 360) + 360) % 360;
  const sn = clampNum(s, 0, 100) / 100;
  const ln = clampNum(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = ln - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;
  if (hn < 60) { r1 = c; g1 = x; b1 = 0; }
  else if (hn < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (hn < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (hn < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (hn < 300) { r1 = x; g1 = 0; b1 = c; }
  else { r1 = c; g1 = 0; b1 = x; }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255)
  };
}

function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function relativeLuminance(r, g, b) {
  const chan = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

function contrastRatioHex(hexA, hexB) {
  const a = typeof hexA === 'object' && hexA !== null ? hexA : parseHexToRgb(hexA);
  const b = typeof hexB === 'object' && hexB !== null ? hexB : parseHexToRgb(hexB);
  const l1 = relativeLuminance(a.r, a.g, a.b);
  const l2 = relativeLuminance(b.r, b.g, b.b);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}
const contrastRatio = contrastRatioHex;

function ensureContrastAgainstBgs(h, s, startL, bgHexes, minRatio = 4.5, preferDarker = true) {
  let l = clampNum(startL, 0, 100);
  const passesAll = (candHex) => bgHexes.every(bg => contrastRatioHex(candHex, bg) >= minRatio);
  let hex = hslToHex(h, s, l);
  if (passesAll(hex)) return hex;

  const step = preferDarker ? -1 : 1;
  for (let i = 0; i <= 100; i++) {
    const testL = clampNum(startL + step * i, 0, 100);
    const cand = hslToHex(h, s, testL);
    if (passesAll(cand)) return cand;
  }
  for (let i = 0; i <= 100; i++) {
    const testL = clampNum(startL - step * i, 0, 100);
    const cand = hslToHex(h, s, testL);
    if (passesAll(cand)) return cand;
  }
  return preferDarker ? '#111318' : '#F8FAFC';
}

function computeHarmonyTokens(primaryHex, mood = 'light') {
  const rgb = parseHexToRgb(primaryHex || '#8C5A32');
  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const isDark = mood === 'dark';

  const bg = isDark
    ? hslToHex(h, clampNum(Math.round(s * 0.28), 8, 22), 6)
    : hslToHex(h, clampNum(Math.round(s * 0.24), 6, 26), 96);
  const surface = isDark
    ? hslToHex(h, clampNum(Math.round(s * 0.25), 8, 20), 10)
    : hslToHex(h, clampNum(Math.round(s * 0.20), 4, 18), 99);
  const muted = isDark
    ? hslToHex(h, clampNum(Math.round(s * 0.22), 8, 20), 15)
    : hslToHex(h, clampNum(Math.round(s * 0.22), 8, 24), 91);

  const fgStartL = isDark ? 95 : 10;
  const fg = ensureContrastAgainstBgs(h, clampNum(Math.round(s * 0.18), 4, 16), fgStartL, [bg, surface], 7.0, !isDark);

  const subStartL = isDark ? 70 : 35;
  const sub = ensureContrastAgainstBgs(h, clampNum(Math.round(s * 0.16), 5, 18), subStartL, [bg, surface, muted], 4.5, !isDark);

  const accentSat = clampNum(s < 18 ? s : Math.max(s, 48), 0, 92);
  const accentStartL = isDark ? clampNum(rgbToHsl(rgb.r, rgb.g, rgb.b).l, 58, 76) : clampNum(rgbToHsl(rgb.r, rgb.g, rgb.b).l, 26, 44);
  const accent = ensureContrastAgainstBgs(h, accentSat, accentStartL, [bg, surface, muted], 4.5, !isDark);

  // Pick --accent-fg with >= 4.5:1 contrast against --accent
  const darkInk = hslToHex(h, 24, 7);
  const lightPaper = '#FFFFFF';
  const cLight = contrastRatioHex(lightPaper, accent);
  const cDark = contrastRatioHex(darkInk, accent);
  let accentFg = cLight >= 4.5 ? lightPaper : (cDark >= 4.5 ? darkInk : (cLight >= cDark ? '#FFFFFF' : '#000000'));
  if (contrastRatioHex(accentFg, accent) < 4.5) {
    accentFg = contrastRatioHex('#FFFFFF', accent) >= contrastRatioHex('#000000', accent) ? '#FFFFFF' : '#000000';
  }

  const fgRgb = parseHexToRgb(fg);
  const acRgb = parseHexToRgb(accent);
  const border = isDark
    ? `rgba(255, 255, 255, 0.12)`
    : `rgba(${fgRgb.r}, ${fgRgb.g}, ${fgRgb.b}, 0.12)`;
  const accentSoft = `rgba(${acRgb.r}, ${acRgb.g}, ${acRgb.b}, ${isDark ? 0.16 : 0.12})`;

  const fgOnBg = Number(contrastRatioHex(fg, bg).toFixed(2));
  const subOnBg = Number(contrastRatioHex(sub, bg).toFixed(2));
  const accentOnBg = Number(contrastRatioHex(accent, bg).toFixed(2));
  const accentOnSurface = Number(contrastRatioHex(accent, surface).toFixed(2));
  const accentFgOnAccent = Number(contrastRatioHex(accentFg, accent).toFixed(2));

  return {
    '--bg': bg,
    '--surface': surface,
    '--muted': muted,
    '--fg': fg,
    '--sub': sub,
    '--border': border,
    '--accent': accent,
    '--accent-fg': accentFg,
    '--accent-soft': accentSoft,
    bg,
    surface,
    muted,
    fg,
    sub,
    border,
    accent,
    accentFg,
    accentSoft,
    contrastRatio: fgOnBg,
    wcagPass: fgOnBg >= 4.5 && subOnBg >= 4.5 && accentFgOnAccent >= 4.5,
    contrastStats: {
      fgOnBg,
      subOnBg,
      accentOnBg,
      accentOnSurface,
      accentFgOnAccent
    }
  };
}

function buildCustomPaletteStyleString(tokensObj) {
  if (!tokensObj) return '';
  const ht = tokensObj.customPaletteTokens || (tokensObj['--bg'] ? tokensObj : null);
  if (!ht || typeof ht !== 'object') {
    return tokensObj.customAccent ? `--accent:${tokensObj.customAccent};` : '';
  }
  const keys = ['--bg', '--surface', '--muted', '--fg', '--sub', '--border', '--accent', '--accent-fg', '--accent-soft'];
  return keys
    .filter(k => typeof ht[k] === 'string' && ht[k])
    .map(k => `${k}:${ht[k]};`)
    .join(' ');
}

/* ==========================================================================
   2. EFFECTIVE WORLD OVERLAY (Brand Profile + Subpage Tailored Copy)
   ========================================================================== */
function getEffectiveWorld(pageDocOrWorldKey, options = {}) {
  const doc = (typeof FORMA_PRO !== 'undefined' && FORMA_PRO.ProjectState?.getDoc)
    ? FORMA_PRO.ProjectState.getDoc()
    : null;

  let pageDocOverride = options?.pageOverride || null;
  let worldKeyOverride = null;
  if (pageDocOrWorldKey && typeof pageDocOrWorldKey === 'object') {
    pageDocOverride = pageDocOrWorldKey;
    worldKeyOverride = pageDocOrWorldKey.worldKey || null;
  } else if (typeof pageDocOrWorldKey === 'string') {
    if (typeof WORLDS !== 'undefined' && WORLDS[pageDocOrWorldKey]) {
      worldKeyOverride = pageDocOrWorldKey;
    } else if (doc && Array.isArray(doc.pages)) {
      pageDocOverride = doc.pages.find(p => p.id === pageDocOrWorldKey || p.slug === pageDocOrWorldKey) || null;
    }
  }

  const wk = worldKeyOverride || doc?.worldKey || (typeof state !== 'undefined' && state.worldKey) || 'maison';
  const base = (typeof WORLDS !== 'undefined' && (WORLDS[wk] || WORLDS.maison)) || {};
  const out = { ...base };

  const activePage = pageDocOverride || ((!options.ignoreActivePage && doc && Array.isArray(doc.pages))
    ? (doc.pages.find(p => p.id === doc.activePageId) || doc.pages[0])
    : null);

  // Apply subpage-tailored hero copy for About / Portfolio / Contact / custom pages
  if (activePage && activePage.slug !== 'home') {
    const subCopy = activePage.pageMeta?.subpageCopy
      || activePage.meta?.subpageCopy
      || activePage.pageMeta
      || (typeof SUBPAGE_WORLD_COPY !== 'undefined' && SUBPAGE_WORLD_COPY[wk]?.[activePage.slug])
      || null;
    if (subCopy) {
      if (subCopy.eyebrow) out.eyebrow = subCopy.eyebrow;
      if (subCopy.h1Pre !== undefined) out.h1Pre = subCopy.h1Pre;
      if (subCopy.h1Accent) out.h1Accent = subCopy.h1Accent;
      if (subCopy.h1Sub) out.h1Sub = subCopy.h1Sub;
      if (subCopy.heroImg && typeof IMG !== 'undefined' && IMG[subCopy.heroImg]) {
        out.heroImg = subCopy.heroImg;
      }
    }
  }

  // Apply non-destructive Brand Profile overrides
  const bp = doc?.brandProfile;
  if (bp && (bp.customApplied || bp.active || (bp.brandName && bp.brandName !== base.brand))) {
    if (bp.brandName && String(bp.brandName).trim()) {
      const bName = String(bp.brandName).trim();
      out.brand = bName;
      if (Array.isArray(base.marquee)) {
        out.marquee = [`${bName} — ${base.edition || '2026 EDITION'}`, ...base.marquee.slice(1)];
      }
      if (!activePage || activePage.slug === 'home') {
        out.h1Pre = bp.slogan ? String(bp.slogan).trim() : base.h1Pre;
        out.h1Accent = bName;
      } else {
        out.eyebrow = `${bName} · ${out.eyebrow || activePage.title}`;
      }
    }
    if (bp.slogan && String(bp.slogan).trim() && (!activePage || activePage.slug === 'home')) {
      out.eyebrow = String(bp.slogan).trim();
    }
  }

  return out;
}

/* ==========================================================================
   3. NON-DESTRUCTIVE 1-SECOND BRAND RESTYLER MODAL & APPLY ENGINE (F17)
   ========================================================================== */
let brandModalMood = 'light';

function openBrandRestylerModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('brand-restyler-modal');
  if (!modal) return;

  const doc = FORMA_PRO.ProjectState?.getDoc?.() || {};
  const w = (typeof WORLDS !== 'undefined' && WORLDS[doc.worldKey || state.worldKey]) || (typeof WORLDS !== 'undefined' ? WORLDS.maison : {});
  const bp = doc.brandProfile || {};

  const nameInp = document.getElementById('brand-name-input');
  const sloganInp = document.getElementById('brand-slogan-input');
  const worldSel = document.getElementById('brand-world-select');
  const colorInp = document.getElementById('brand-primary-color');
  const fontSel = document.getElementById('brand-font-select');

  if (nameInp) nameInp.value = (bp.customApplied && bp.brandName) ? bp.brandName : (w.brand || 'MAISON VOID');
  if (sloganInp) sloganInp.value = (bp.customApplied && bp.slogan) ? bp.slogan : (w.eyebrow || '');
  if (worldSel) worldSel.value = doc.worldKey || state.worldKey || 'maison';
  if (colorInp) colorInp.value = bp.primaryColor || state.tokens?.customAccent || '#8C5A32';
  if (fontSel) fontSel.value = state.equipped?.font || bp.fontPairingId || 'FNT-01';

  brandModalMood = bp.mood || 'light';
  syncBrandMoodToggleUI();
  updateBrandRestylerPreview();
  modal.classList.add('is-open');
}

function closeBrandRestylerModal() {
  if (typeof document === 'undefined') return;
  document.getElementById('brand-restyler-modal')?.classList.remove('is-open');
}

function syncBrandMoodToggleUI() {
  if (typeof document === 'undefined') return;
  const btn = document.getElementById('brand-mood-toggle');
  if (!btn) return;
  btn.dataset.mood = brandModalMood;
  btn.textContent = brandModalMood === 'dark' ? '🌙 Dark 무드 (고대비 다크)' : '☀️ Light 무드 (에디토리얼 라이트)';
}

function toggleBrandMood() {
  brandModalMood = brandModalMood === 'dark' ? 'light' : 'dark';
  syncBrandMoodToggleUI();
  updateBrandRestylerPreview();
}

function updateBrandRestylerPreview() {
  if (typeof document === 'undefined') return;
  const colorInp = document.getElementById('brand-primary-color');
  const prevBox = document.getElementById('brand-harmony-preview');
  if (!prevBox) return;
  const hex = colorInp?.value || '#8C5A32';
  const tokens = computeHarmonyTokens(hex, brandModalMood);
  const st = tokens.contrastStats;

  prevBox.innerHTML = `
    <div style="padding:12px 14px;border-radius:10px;background:${tokens['--bg']};color:${tokens['--fg']};border:1px solid ${tokens['--border']};display:flex;justify-content:space-between;align-items:center;gap:12px;">
      <div>
        <div style="font-size:11px;color:${tokens['--sub']};font-weight:700;">WCAG 2.1 AA/AAA HARMONY PREVIEW</div>
        <div style="font-size:14px;font-weight:800;margin-top:2px;">본문 대비 ${st.fgOnBg}:1 · 보조 ${st.subOnBg}:1 · 포인트 ${st.accentOnBg}:1</div>
      </div>
      <span style="padding:6px 12px;border-radius:999px;background:${tokens['--accent']};color:${tokens['--accent-fg']};font-size:11.5px;font-weight:800;">CTA ${st.accentFgOnAccent}:1 ✓</span>
    </div>
  `;
}

function applyBrandProfileFromModal() {
  if (typeof document === 'undefined') return;
  const brandName = document.getElementById('brand-name-input')?.value || '';
  const slogan = document.getElementById('brand-slogan-input')?.value || '';
  const worldKey = document.getElementById('brand-world-select')?.value || state.worldKey || 'maison';
  const primaryColor = document.getElementById('brand-primary-color')?.value || '#8C5A32';
  const fontPairingId = document.getElementById('brand-font-select')?.value || state.equipped?.font || 'FNT-01';

  applyBrandProfile({
    brandName,
    slogan,
    worldKey,
    primaryColor,
    mood: brandModalMood,
    fontPairingId
  });
  closeBrandRestylerModal();
}

function replaceBrandTextInHTML(htmlStr, oldBrands, newBrand) {
  if (typeof htmlStr !== 'string' || !htmlStr || !newBrand || !Array.isArray(oldBrands) || !oldBrands.length) {
    return htmlStr;
  }
  const parts = htmlStr.split(/(<[^>]+>)/g);
  for (let i = 0; i < parts.length; i += 2) {
    let txt = parts[i];
    if (!txt) continue;
    for (const oldB of oldBrands) {
      if (oldB && txt.includes(oldB)) {
        txt = txt.split(oldB).join(newBrand);
      }
    }
    parts[i] = txt;
  }
  return parts.join('');
}

function applyBrandProfile(profile = {}, extraOpts = {}) {
  const opts = (profile && typeof profile === 'object') ? { ...profile, ...extraOpts } : { ...extraOpts };
  const ps = FORMA_PRO.ProjectState;
  if (!ps) return null;
  const doc = ps.getDoc();
  ps.syncEngineStateToPage(doc);

  const prevWorldKey = doc.worldKey || (typeof state !== 'undefined' && state.worldKey) || 'maison';
  const prevWorldObj = (typeof WORLDS !== 'undefined' && WORLDS[prevWorldKey]) || (typeof WORLDS !== 'undefined' ? WORLDS.maison : {});
  const prevBrandName = doc.brandProfile?.brandName || prevWorldObj?.brand || '';

  // Record a SINGLE Undo step before mutating project-wide brand state
  ps.pushUndoSnapshot('apply-brand');

  const targetWorldKey = (opts.worldKey && typeof WORLDS !== 'undefined' && WORLDS[opts.worldKey])
    ? opts.worldKey
    : prevWorldKey;
  const w = (typeof WORLDS !== 'undefined' && WORLDS[targetWorldKey]) || prevWorldObj;
  const cleanBrand = String(opts.brandName ?? opts.brand ?? doc.brandProfile?.brandName ?? w.brand).trim() || w.brand;
  const cleanSlogan = String(opts.slogan ?? doc.brandProfile?.slogan ?? w.eyebrow).trim() || w.eyebrow;
  const primaryColor = normalizeHex(opts.primaryColor || opts.hex || doc.brandProfile?.primaryColor || '#8C5A32', '#8C5A32');
  const mood = opts.mood === 'dark' ? 'dark' : 'light';
  const fontPairingId = opts.fontPairingId || opts.fontId || opts.font || doc.equipped?.font || w.preset?.font || 'FNT-01';

  const harmonic = computeHarmonyTokens(primaryColor, mood);
  const worldChanged = targetWorldKey !== prevWorldKey;

  doc.worldKey = targetWorldKey;
  if (worldChanged && w.preset) {
    doc.equipped = {
      ...doc.equipped,
      ...w.preset,
      font: fontPairingId
    };
  } else {
    doc.equipped = {
      ...doc.equipped,
      font: fontPairingId
    };
  }
  if (doc.globalEquipped) {
    doc.globalEquipped.font = fontPairingId;
  }

  doc.brandProfile = {
    active: true,
    customApplied: true,
    brandName: cleanBrand,
    slogan: cleanSlogan,
    primaryColor,
    mood,
    fontPairingId,
    fontId: fontPairingId,
    harmonicTokens: harmonic,
    harmonyTokens: harmonic
  };

  doc.tokens = {
    ...(doc.tokens || {}),
    customAccent: harmonic['--accent'],
    customPaletteTokens: harmonic
  };

  const rawOldBrands = [
    opts.oldBrandName,
    opts.previousBrandName,
    prevBrandName,
    prevWorldObj?.brand,
    w?.brand,
    'MAISON VOID',
    ...(typeof WORLDS !== 'undefined' ? Object.values(WORLDS).map(x => x?.brand) : [])
  ];
  const oldBrandCandidates = [];
  rawOldBrands.forEach(item => {
    const s = typeof item === 'string' ? item.trim() : '';
    if (!s || s.length < 2 || s === cleanBrand) return;
    if (!oldBrandCandidates.includes(s)) oldBrandCandidates.push(s);
    const upper = s.toUpperCase();
    if (upper !== cleanBrand && !oldBrandCandidates.includes(upper)) oldBrandCandidates.push(upper);
  });

  const shouldReplaceTexts = opts.replaceCustomTexts !== false;

  // Update each page's metadata, customTexts, and freeWidgets non-destructively
  (doc.pages || []).forEach(p => {
    p.meta = p.meta || {};
    p.meta.title = `${cleanBrand} — ${p.title}`;
    p.pageMeta = p.pageMeta || {};
    p.pageMeta.title = p.meta.title;
    if (worldChanged && p.slug !== 'home' && typeof SUBPAGE_WORLD_COPY !== 'undefined' && SUBPAGE_WORLD_COPY[targetWorldKey]?.[p.slug]) {
      p.meta.subpageCopy = { ...SUBPAGE_WORLD_COPY[targetWorldKey][p.slug] };
      p.pageMeta = { ...p.pageMeta, ...p.meta.subpageCopy, title: p.meta.title };
    }

    if (shouldReplaceTexts && oldBrandCandidates.length > 0 && cleanBrand) {
      if (p.customTexts && typeof p.customTexts === 'object') {
        Object.keys(p.customTexts).forEach(tKey => {
          if (typeof p.customTexts[tKey] === 'string') {
            p.customTexts[tKey] = replaceBrandTextInHTML(p.customTexts[tKey], oldBrandCandidates, cleanBrand);
          }
        });
      }
      if (Array.isArray(p.freeWidgets)) {
        p.freeWidgets.forEach(fw => {
          if (!fw || typeof fw !== 'object') return;
          if (typeof fw.customHTML === 'string') {
            fw.customHTML = replaceBrandTextInHTML(fw.customHTML, oldBrandCandidates, cleanBrand);
          }
          if (typeof fw.text === 'string') {
            fw.text = replaceBrandTextInHTML(fw.text, oldBrandCandidates, cleanBrand);
          }
          if (typeof fw.title === 'string') {
            fw.title = replaceBrandTextInHTML(fw.title, oldBrandCandidates, cleanBrand);
          }
          if (typeof fw.label === 'string') {
            fw.label = replaceBrandTextInHTML(fw.label, oldBrandCandidates, cleanBrand);
          }
        });
      }
    }
  });

  ps.syncPageToEngineState(doc);
  if (typeof state !== 'undefined') {
    state.brandProfile = doc.brandProfile;
    if (shouldReplaceTexts && oldBrandCandidates.length > 0 && cleanBrand) {
      if (state.customTexts && typeof state.customTexts === 'object') {
        Object.keys(state.customTexts).forEach(tKey => {
          if (typeof state.customTexts[tKey] === 'string') {
            state.customTexts[tKey] = replaceBrandTextInHTML(state.customTexts[tKey], oldBrandCandidates, cleanBrand);
          }
        });
      }
      if (Array.isArray(state.freeWidgets)) {
        state.freeWidgets.forEach(fw => {
          if (!fw || typeof fw !== 'object') return;
          if (typeof fw.customHTML === 'string') {
            fw.customHTML = replaceBrandTextInHTML(fw.customHTML, oldBrandCandidates, cleanBrand);
          }
        });
      }
    }
  }

  if (typeof clearSelectedCanvasUI === 'function') clearSelectedCanvasUI();
  if (typeof renderPageTabsUI === 'function') renderPageTabsUI();
  if (typeof renderQuickSubbar === 'function') renderQuickSubbar();
  if (typeof renderSidebarBody === 'function') renderSidebarBody();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  if (typeof state !== 'undefined' && state.mode === 'vault' && typeof renderVaultView === 'function') {
    renderVaultView();
  }
  ps.scheduleAutosave();
  if (typeof showStudioToast === 'function') {
    showStudioToast(`✨ '${cleanBrand}' 1초 브랜드 리스타일러가 전 페이지에 적용되었습니다!`);
  }
  return harmonic;
}

function resetBrandProfile() {
  const ps = FORMA_PRO.ProjectState;
  if (!ps) return false;
  const doc = ps.getDoc();
  ps.syncEngineStateToPage(doc);
  ps.pushUndoSnapshot('reset-brand');

  const w = (typeof WORLDS !== 'undefined' && WORLDS[doc.worldKey]) || (typeof WORLDS !== 'undefined' ? WORLDS.maison : {});
  doc.brandProfile = {
    active: false,
    customApplied: false,
    brandName: w.brand || 'MAISON VOID',
    slogan: w.eyebrow || '',
    primaryColor: '#8C5A32',
    mood: 'light',
    fontPairingId: w.preset?.font || 'FNT-01',
    fontId: w.preset?.font || 'FNT-01',
    harmonicTokens: null,
    harmonyTokens: null
  };
  doc.tokens = {
    ...(doc.tokens || {}),
    customAccent: null,
    customPaletteTokens: null
  };
  if (w.preset?.font && doc.equipped) {
    doc.equipped.font = w.preset.font;
  }
  if (doc.globalEquipped && w.preset?.font) {
    doc.globalEquipped.font = w.preset.font;
  }

  ps.syncPageToEngineState(doc);
  if (typeof state !== 'undefined') state.brandProfile = doc.brandProfile;
  if (typeof renderPageTabsUI === 'function') renderPageTabsUI();
  if (typeof renderQuickSubbar === 'function') renderQuickSubbar();
  if (typeof renderSidebarBody === 'function') renderSidebarBody();
  if (typeof renderLiveWebsite === 'function') renderLiveWebsite();
  ps.scheduleAutosave();
  if (typeof showStudioToast === 'function') {
    showStudioToast('↺ 브랜드 리스타일러 설정이 기본 상태로 초기화되었습니다.');
  }
  return true;
}

/* ==========================================================================
   4. ?mode=client RUNTIME & #p=<deflate-base64url> SHARE CODEC (F18)
   ========================================================================== */
function isClientMode() {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search || '');
    if (params.get('mode') === 'client') return true;
  } catch (_) {}
  return Boolean(typeof document !== 'undefined' && document.documentElement?.classList?.contains('is-client-mode'));
}

function uint8ToBase64Url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUint8(b64url) {
  const b64 = String(b64url || '').replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i);
  }
  return out;
}

function encodeStringToRawSharePayload(jsonStr) {
  const bytes = new TextEncoder().encode(jsonStr);
  return 'raw.' + uint8ToBase64Url(bytes);
}

function decodeRawSharePayloadToString(payload) {
  const clean = payload.startsWith('raw.') ? payload.slice(4) : payload;
  const bytes = base64UrlToUint8(clean);
  return new TextDecoder().decode(bytes);
}

function buildCompactShareableDoc(doc) {
  const clone = deepCloneJSON(doc);
  if (clone.customAssets) {
    const compactAssets = {};
    Object.entries(clone.customAssets).forEach(([k, v]) => {
      if (typeof v === 'string' && v.length < 16384) compactAssets[k] = v;
    });
    clone.customAssets = compactAssets;
  }
  return clone;
}

function extractShareToken(hashOrUrl) {
  if (!hashOrUrl || typeof hashOrUrl !== 'string') return '';
  let s = hashOrUrl.trim();
  const pIdx = s.search(/(?:^|[#?&])p=/i);
  if (pIdx >= 0) {
    s = s.slice(pIdx).replace(/^[#?&]?p=/i, '');
  }
  s = s.replace(/^(?:[#?&]|p=)+/i, '').trim();
  const cut = s.search(/[&#\s]/);
  if (cut >= 0) s = s.slice(0, cut);
  return s;
}

async function encodeProjectToSharePayload(doc, opts = {}) {
  const targetDoc = doc || FORMA_PRO.ProjectState?.getDoc?.();
  if (!targetDoc) return '';
  const compact = opts.keepAllAssets ? deepCloneJSON(targetDoc) : buildCompactShareableDoc(targetDoc);
  const jsonStr = JSON.stringify(compact);
  const rawFallback = encodeStringToRawSharePayload(jsonStr);

  if (typeof CompressionStream === 'undefined' || typeof Response === 'undefined' || typeof Blob === 'undefined') {
    return rawFallback;
  }

  try {
    const compressed = await Promise.race([
      (async () => {
        const bytes = new TextEncoder().encode(jsonStr);
        const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
        const buf = await new Response(stream).arrayBuffer();
        return 'z.' + uint8ToBase64Url(new Uint8Array(buf));
      })(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 300))
    ]);
    return compressed || rawFallback;
  } catch (_) {
    return rawFallback;
  }
}

async function encodeShareHash(doc, opts = {}) {
  return encodeProjectToSharePayload(doc, opts);
}

async function decodeProjectFromSharePayload(payloadOrHash) {
  const token = extractShareToken(payloadOrHash);
  if (!token) return null;

  try {
    if (token.startsWith('raw.')) {
      return JSON.parse(decodeRawSharePayloadToString(token));
    }
    if (token.startsWith('u_')) {
      const bytes = base64UrlToUint8(token.slice(2));
      return JSON.parse(new TextDecoder().decode(bytes));
    }

    const isDeflateWrapped = token.startsWith('d_');
    const rawB64 = (token.startsWith('z.') || token.startsWith('z_') || isDeflateWrapped)
      ? token.slice(2)
      : token;
    const bytes = base64UrlToUint8(rawB64);

    if (typeof DecompressionStream === 'function' && typeof Response === 'function' && typeof Blob === 'function') {
      const formats = isDeflateWrapped ? ['deflate', 'deflate-raw'] : ['deflate-raw', 'deflate'];
      for (const fmt of formats) {
        try {
          const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(fmt));
          const buf = await new Response(stream).arrayBuffer();
          const jsonStr = new TextDecoder().decode(new Uint8Array(buf));
          return JSON.parse(jsonStr);
        } catch (_) {}
      }
    }

    const fallbackStr = new TextDecoder().decode(bytes);
    return JSON.parse(fallbackStr);
  } catch (_) {
    try {
      const jsonStr = decodeRawSharePayloadToString(token);
      return JSON.parse(jsonStr);
    } catch (_e2) {
      return null;
    }
  }
}

async function decodeShareHash(hashOrPayload) {
  return decodeProjectFromSharePayload(hashOrPayload);
}

function buildClientShareUrlSync(doc) {
  if (typeof window === 'undefined') return '';
  const targetDoc = doc || FORMA_PRO.ProjectState?.getDoc?.();
  if (!targetDoc) return '';
  const compact = buildCompactShareableDoc(targetDoc);
  const rawPayload = encodeStringToRawSharePayload(JSON.stringify(compact));
  const baseUrl = window.location.href.split('#')[0].split('?')[0];
  return `${baseUrl}?mode=client#p=${rawPayload}`;
}

async function openClientShareModal() {
  if (typeof document === 'undefined') return;
  const modal = document.getElementById('client-share-modal');
  const inp = document.getElementById('client-share-url-input');
  if (!modal) return;

  const doc = FORMA_PRO.ProjectState?.getDoc?.();
  if (inp && doc) {
    inp.value = buildClientShareUrlSync(doc);
  }
  modal.classList.add('is-open');

  if (inp && doc) {
    try {
      const deflated = await encodeProjectToSharePayload(doc);
      const cleanToken = extractShareToken(deflated) || deflated;
      const baseUrl = window.location.href.split('#')[0].split('?')[0];
      inp.value = `${baseUrl}?mode=client#p=${cleanToken}`;
    } catch (_) {}
  }
}

function closeClientShareModal() {
  if (typeof document === 'undefined') return;
  document.getElementById('client-share-modal')?.classList.remove('is-open');
}

function copyClientShareLink() {
  if (typeof document === 'undefined') return;
  const inp = document.getElementById('client-share-url-input');
  const val = inp?.value || '';
  if (!val) return;
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(val).then(() => {
      if (typeof showStudioToast === 'function') showStudioToast('🔗 클라이언트 미리보기 링크가 복사되었습니다!');
    }).catch(() => {
      inp?.select?.();
      try { document.execCommand('copy'); } catch (_) {}
      if (typeof showStudioToast === 'function') showStudioToast('🔗 클라이언트 미리보기 링크가 복사되었습니다!');
    });
  } else {
    inp?.select?.();
    try { document.execCommand('copy'); } catch (_) {}
    if (typeof showStudioToast === 'function') showStudioToast('🔗 클라이언트 미리보기 링크가 복사되었습니다!');
  }
}

function openClientPreviewWindow() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const inp = document.getElementById('client-share-url-input');
  const url = inp?.value || buildClientShareUrlSync(FORMA_PRO.ProjectState?.getDoc?.());
  if (url) {
    window.open(url, '_blank', 'noopener');
  }
}

function parseClientHashParams(hashStr, searchStr = '') {
  let payload = null;
  let pageSlug = null;

  if (searchStr) {
    try {
      const sp = new URLSearchParams(searchStr);
      if (sp.get('p')) payload = extractShareToken(sp.get('p'));
      if (sp.get('page')) pageSlug = sp.get('page').trim();
    } catch (_) {}
  }

  const raw = String(hashStr || '').replace(/^#/, '').trim();
  if (!raw) return { payload, pageSlug };

  if (raw.startsWith('/')) {
    pageSlug = raw.slice(1).split(/[?&]/)[0].trim() || 'home';
    return { payload, pageSlug };
  }

  if (/(?:^|[?&])p=/.test(raw)) {
    const hashRouteIdx = raw.indexOf('#/');
    if (hashRouteIdx >= 0) {
      payload = extractShareToken(raw.slice(0, hashRouteIdx)) || payload;
      pageSlug = raw.slice(hashRouteIdx + 2).trim() || pageSlug;
      return { payload, pageSlug };
    }
    payload = extractShareToken(raw) || payload;
    const pageMatch = raw.match(/(?:^|[?&])page=([^&#\s]+)/);
    if (pageMatch && pageMatch[1]) {
      pageSlug = decodeURIComponent(pageMatch[1]).trim() || pageSlug;
    }
    return { payload, pageSlug };
  }

  const pageOnlyMatch = raw.match(/(?:^|[?&])page=([^&#\s]+)/);
  if (pageOnlyMatch && pageOnlyMatch[1]) {
    pageSlug = decodeURIComponent(pageOnlyMatch[1]).trim() || pageSlug;
    return { payload, pageSlug };
  }

  return { payload, pageSlug };
}

const CLIENT_SHARED_DOC_SS_KEY = 'forma_client_shared_doc_v2';
const CLIENT_SHARED_PAYLOAD_SS_KEY = 'forma_client_shared_payload_v2';
const CLIENT_ACTIVE_PAGE_SS_KEY = 'forma_client_active_page_v2';

function navigateClientPage(slugOrId, opts = {}) {
  const clean = String(slugOrId || '')
    .replace(/^#\/?/, '')
    .replace(/^p=[^&]*&page=/, '')
    .trim();
  if (!clean) return false;

  const switched = FORMA_PRO.ProjectState?.switchPage
    ? FORMA_PRO.ProjectState.switchPage(clean, false)
    : (typeof switchActivePage === 'function' ? switchActivePage(clean, false) : false);

  if (!switched) return false;

  const activePage = FORMA_PRO.ProjectState?.getActivePage?.();
  const slug = activePage?.slug || clean;
  if (typeof document !== 'undefined' && activePage) {
    const w = getEffectiveWorld();
    document.title = `${w.brand || 'FORMA'} — ${activePage.title}`;
  }

  if (typeof window !== 'undefined') {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(CLIENT_ACTIVE_PAGE_SS_KEY, slug);
        const doc = FORMA_PRO.ProjectState?.getDoc?.();
        if (doc) sessionStorage.setItem(CLIENT_SHARED_DOC_SS_KEY, JSON.stringify(doc));
      }
    } catch (_) {}

    window.scrollTo?.({ top: 0, behavior: 'auto' });
    if (opts.pushHistory !== false && isClientMode()) {
      const parsed = parseClientHashParams(window.location.hash, window.location.search);
      const nextHash = parsed.payload ? `#p=${parsed.payload}&page=${slug}` : `#/${slug}`;
      if (window.location.hash !== nextHash) {
        try {
          if (parsed.payload) {
            history.pushState({ page: slug }, '', nextHash);
          } else {
            window.location.hash = nextHash;
          }
        } catch (_) {}
      }
    }
  }
  return true;
}

let clientEventsBound = false;

async function bootClientModeRuntime() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return false;
  document.documentElement.classList.add('is-client-mode');

  if (typeof state !== 'undefined') {
    state.canvasMoveMode = false;
    state.inlineEdit = false;
    state.guidesOn = false;
    state.presentation = false;
  }

  // Clear hidden editor drawer & vault cards so document.querySelector('[data-page-link="..."]')
  // never matches a hidden sidebar preview card instead of the live website navbar!
  ['st-drawer-cards', 'vault-cards-grid', 'st-drawer-cat-head'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });

  // Keep editor chrome elements in DOM with inline display:none so both getComputedStyle(el).display === 'none' and offsetParent === null hold
  ['st-topbar', 'st-subbar', 'st-sidebar', 'st-right-panel', 'st-ui-sel-box', 'st-ui-toolbar', 'st-marquee-box', 'st-context-menu', 'st-snap-guide-x', 'st-snap-guide-y'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const parsedInit = parseClientHashParams(window.location.hash, window.location.search);
  const payload = parsedInit.payload;
  const targetPageSlug = parsedInit.pageSlug || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(CLIENT_ACTIVE_PAGE_SS_KEY) : null);

  let loadedFromPayloadOrSession = false;
  if (payload) {
    const decoded = await decodeProjectFromSharePayload(payload);
    if (decoded && FORMA_PRO.ProjectState?.validateAndNormalizeProjectJSON) {
      const norm = FORMA_PRO.ProjectState.validateAndNormalizeProjectJSON(decoded);
      if (norm) {
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(CLIENT_SHARED_DOC_SS_KEY, JSON.stringify(norm));
            sessionStorage.setItem(CLIENT_SHARED_PAYLOAD_SS_KEY, payload);
          }
        } catch (_) {}
        FORMA_PRO.ProjectState.setDoc(norm, false);
        loadedFromPayloadOrSession = true;
      }
    }
  }
  if (!loadedFromPayloadOrSession && typeof sessionStorage !== 'undefined') {
    try {
      const savedSession = sessionStorage.getItem(CLIENT_SHARED_DOC_SS_KEY);
      if (savedSession) {
        const norm = FORMA_PRO.ProjectState?.validateAndNormalizeProjectJSON?.(JSON.parse(savedSession));
        if (norm) {
          FORMA_PRO.ProjectState.setDoc(norm, false);
          loadedFromPayloadOrSession = true;
        }
      }
    } catch (_) {}
  }
  if (!loadedFromPayloadOrSession) {
    await FORMA_PRO.ProjectState?.hydrateProjectStateFromIDBAsync?.(true);
  }

  if (targetPageSlug) {
    navigateClientPage(targetPageSlug, { pushHistory: false });
  } else if (typeof renderLiveWebsite === 'function') {
    renderLiveWebsite();
  }

  if (!clientEventsBound) {
    clientEventsBound = true;
    const syncRoute = async () => {
      const parsed = parseClientHashParams(window.location.hash, window.location.search);
      if (parsed.payload) {
        const dec = await decodeProjectFromSharePayload(parsed.payload);
        const norm = dec ? FORMA_PRO.ProjectState?.validateAndNormalizeProjectJSON?.(dec) : null;
        if (norm) {
          try {
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem(CLIENT_SHARED_DOC_SS_KEY, JSON.stringify(norm));
              sessionStorage.setItem(CLIENT_SHARED_PAYLOAD_SS_KEY, parsed.payload);
            }
          } catch (_) {}
          FORMA_PRO.ProjectState.setDoc(norm, false);
        }
      }
      if (parsed.pageSlug) {
        navigateClientPage(parsed.pageSlug, { pushHistory: false });
      }
    };
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
  }

  return true;
}

const bootClientRuntime = bootClientModeRuntime;
const bootClientMode = bootClientModeRuntime;

globalThis.FORMA_PRO.BrandRestyler = window.FORMA_PRO.BrandRestyler = {
  normalizeHex,
  contrastRatio,
  contrastRatioHex,
  computeHarmonyTokens,
  buildCustomPaletteStyleString,
  getEffectiveWorld,
  openBrandRestylerModal,
  closeBrandRestylerModal,
  openModal: openBrandRestylerModal,
  closeModal: closeBrandRestylerModal,
  toggleBrandMood,
  updateBrandRestylerPreview,
  applyBrandProfileFromModal,
  applyBrandProfile,
  apply: applyBrandProfile,
  reset: resetBrandProfile,
  resetBrandProfile
};

globalThis.FORMA_PRO.ClientMode = window.FORMA_PRO.ClientMode = {
  isClientMode,
  encodeShareHash,
  decodeShareHash,
  encodeProjectToSharePayload,
  decodeProjectFromSharePayload,
  generateShareUrl: async (doc) => {
    const targetDoc = doc || FORMA_PRO.ProjectState?.getDoc?.();
    const payload = await encodeProjectToSharePayload(targetDoc);
    const baseUrl = (typeof window !== 'undefined' && window.location?.href)
      ? window.location.href.split('#')[0].split('?')[0]
      : '';
    return `${baseUrl}?mode=client#p=${payload}`;
  },
  buildClientShareUrlSync,
  openClientShareModal,
  closeClientShareModal,
  openShareModal: openClientShareModal,
  copyClientShareLink,
  openClientPreviewWindow,
  navigateClientPage,
  enterClientMode: bootClientModeRuntime,
  bootClientRuntime,
  bootClientModeRuntime,
  bootClientMode
};

globalThis.FORMA_PRO = window.FORMA_PRO;
