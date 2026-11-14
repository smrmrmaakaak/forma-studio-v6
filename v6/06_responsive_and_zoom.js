/* ==========================================================================
   FORMA STUDIO Pro — M2 RESPONSIVE 3-VIEWPORT ENGINE (F13) & CANVAS ZOOM (F09)
   ========================================================================== */
(function () {
  'use strict';

  const globalRoot = typeof window !== 'undefined' ? window : globalThis;
  globalRoot.FORMA_PRO = globalRoot.FORMA_PRO || {};

  const ARTBOARD_WIDTHS = {
    desktop: 1280,
    tablet: 768,
    mobile: 390
  };

  function getEngineState() {
    return globalRoot.state || (typeof state !== 'undefined' ? state : null);
  }

  function ensureResponsiveState(st) {
    const s = st || getEngineState();
    if (!s) return { desktop: {}, tablet: {}, mobile: {} };
    if (!s.responsiveOverrides || typeof s.responsiveOverrides !== 'object') {
      s.responsiveOverrides = { desktop: {}, tablet: {}, mobile: {} };
    }
    if (!s.responsiveOverrides.desktop) s.responsiveOverrides.desktop = {};
    if (!s.responsiveOverrides.tablet) s.responsiveOverrides.tablet = {};
    if (!s.responsiveOverrides.mobile) s.responsiveOverrides.mobile = {};
    return s.responsiveOverrides;
  }

  function getArtboardLogicalWidth(vp) {
    const s = getEngineState();
    const activeVp = vp || s?.viewport || 'desktop';
    return ARTBOARD_WIDTHS[activeVp] || 1280;
  }

  /* ==========================================================================
     1. DETERMINISTIC SCOPED data-f-el ELEMENT STAMPING (F13 / F10)
     ========================================================================== */
  function inferRoleToken(el) {
    if (!el || !el.tagName) return 'el';
    const tag = el.tagName.toLowerCase();
    if (el.classList?.contains('f-btn')) return 'btn';
    if (el.classList?.contains('f-bdg')) return 'bdg';
    if (el.classList?.contains('f-card')) return 'card';
    if (el.classList?.contains('f-media')) return 'media';
    if (el.classList?.contains('f-input')) return 'input';
    if (el.classList?.contains('f-switch')) return 'switch';
    if (el.classList?.contains('f-lead')) return 'lead';
    return tag;
  }

  function stampSelectableElements(rootEl) {
    if (typeof document === 'undefined') return [];
    const root = rootEl || document.getElementById('hp-root');
    if (!root || typeof root.querySelectorAll !== 'function') return [];
    const s = getEngineState();
    const usedKeys = new Set();

    // 1. Stamp all freeform widgets with fw::<uid> and strip any inner data-f-el
    const freeEls = root.querySelectorAll('.f-free-ui');
    freeEls.forEach((fwEl, idx) => {
      const uid = fwEl.dataset?.uid || fwEl.getAttribute('data-uid') || `auto-${idx}`;
      const fwKey = `fw::${uid}`;
      fwEl.setAttribute('data-f-el', fwKey);
      usedKeys.add(fwKey);
      fwEl.querySelectorAll('[data-f-el]').forEach((inner) => {
        if (inner !== fwEl) inner.removeAttribute('data-f-el');
      });
    });

    // 2. Stamp template elements inside each .f-sec-wrap deterministically
    const secWraps = root.querySelectorAll('.f-sec-wrap');
    const candidateSelector =
      'h1, h2, h3, h4, p, .f-lead, .f-btn, .f-bdg, .f-card, .f-media, .f-input, .f-switch, blockquote, img';

    secWraps.forEach((sec, secIdx) => {
      const secKey =
        sec.dataset?.secKey ||
        sec.getAttribute('data-sec-key') ||
        (sec.id ? sec.id.replace(/^sec-/, '') : `sec-${secIdx}`);
      const customSec = s?.customSections?.[secKey];
      const baseCat = customSec?.baseCatKey || secKey;
      const rawAssetId =
        customSec?.assetId ||
        s?.equipped?.[baseCat] ||
        s?.equipped?.[secKey] ||
        'SLOT';
      const assetId = String(rawAssetId).replace(/:/g, '-');

      const roleCounts = Object.create(null);
      const candidates = sec.querySelectorAll(candidateSelector);

      candidates.forEach((el) => {
        if (el.closest('.f-sec-pill, .f-sec-resize-bar, .f-blank-guide, .f-free-ui')) {
          return;
        }
        // Inside .f-card, do NOT stamp <p> so clicking the center of .f-card selects .f-card,
        // while headings/buttons/media inside .f-card remain stamped for ancestor-child tests.
        const parentCard = el.closest('.f-card');
        if (parentCard && parentCard !== el) {
          const isCardChildTarget = el.matches(
            'h1, h2, h3, h4, .f-btn, .f-bdg, .f-media, .f-input, img'
          );
          if (!isCardChildTarget) {
            if (el.hasAttribute('data-f-el')) el.removeAttribute('data-f-el');
            return;
          }
        }
        // Avoid stamping <img> directly inside .f-media if .f-media is small, UNLESS needed for img upload
        const role = inferRoleToken(el);
        roleCounts[role] = (roleCounts[role] || 0) + 1;
        let key = `${secKey}::${assetId}::${role}-${roleCounts[role]}`;
        while (usedKeys.has(key)) {
          roleCounts[role] += 1;
          key = `${secKey}::${assetId}::${role}-${roleCounts[role]}`;
        }
        usedKeys.add(key);
        el.setAttribute('data-f-el', key);
      });
    });

    return Array.from(usedKeys);
  }

  /* ==========================================================================
     2. RESPONSIVE OVERRIDE PATCH CRUD & CSS COMPILER (<style id="hp-responsive-overrides">)
     ========================================================================== */
  const BASE_RESPONSIVE_CLAMP_CSS = `
#hp-root {
  container-type: inline-size;
  container-name: site;
}
#hp-root[data-viewport="mobile"],
#hp-root[data-viewport="tablet"] {
  overflow-x: clip !important;
}
#hp-root[data-viewport="mobile"] .f-content-layer,
#hp-root[data-viewport="mobile"] .f-sec-wrap,
#hp-root[data-viewport="mobile"] .f-sec,
#hp-root[data-viewport="mobile"] .f-blank-sec,
#hp-root[data-viewport="mobile"] .f-container {
  max-width: 100% !important;
  overflow-x: clip !important;
  box-sizing: border-box !important;
}
#hp-root[data-viewport="mobile"] .fg-2,
#hp-root[data-viewport="mobile"] .fg-2-asym,
#hp-root[data-viewport="mobile"] .fg-3,
#hp-root[data-viewport="mobile"] .fg-4 {
  grid-template-columns: minmax(0, 1fr) !important;
}
#hp-root[data-viewport="mobile"] .f-free-ui:not([data-vp-mobile-pos="1"]) {
  left: 16px !important;
  right: auto !important;
  width: calc(100% - 32px) !important;
  max-width: calc(100% - 32px) !important;
  transform: none !important;
  box-sizing: border-box !important;
}
#hp-root[data-viewport="mobile"] [data-ui-moved="1"]:not(.f-free-ui):not([data-vp-mobile-pos="1"]) {
  transform: none !important;
  max-width: 100% !important;
}
#hp-root[data-viewport="tablet"] [data-ui-moved="1"]:not(.f-free-ui):not([data-vp-tablet-pos="1"]) {
  transform: none !important;
  max-width: 100% !important;
}
#hp-root[data-viewport="tablet"] .f-free-ui:not([data-vp-tablet-pos="1"]) {
  max-width: calc(100% - 24px) !important;
  box-sizing: border-box !important;
}
@media (max-width: 560px) {
  body > #hp-root,
  html.is-client-mode #hp-root,
  body > #hp-root .f-content-layer,
  body > #hp-root .f-sec-wrap,
  body > #hp-root .f-sec,
  body > #hp-root .f-blank-sec,
  body > #hp-root .f-container {
    max-width: 100% !important;
    overflow-x: clip !important;
    box-sizing: border-box !important;
  }
  body > #hp-root .fg-2,
  body > #hp-root .fg-2-asym,
  body > #hp-root .fg-3,
  body > #hp-root .fg-4 {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  body > #hp-root [data-ui-moved="1"]:not(.f-free-ui):not([data-vp-mobile-pos="1"]) {
    transform: none !important;
    max-width: 100% !important;
  }
  body > #hp-root .f-free-ui:not([data-vp-mobile-pos="1"]) {
    left: 16px !important;
    right: auto !important;
    width: calc(100% - 32px) !important;
    max-width: calc(100% - 32px) !important;
    transform: none !important;
    box-sizing: border-box !important;
  }
}
`.trim();

  function cssEscapeAttrVal(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function buildVisualStyleDecls(patch, important = true) {
    if (!patch || typeof patch !== 'object') return [];
    const imp = important ? ' !important' : '';
    const decls = [];

    if (patch.hidden === true) {
      decls.push(`display: none${imp}`);
    }
    if (patch.fontFamily) {
      decls.push(`font-family: ${patch.fontFamily}${imp}`);
    }
    if (Number.isFinite(Number(patch.fontSize)) && Number(patch.fontSize) > 0) {
      decls.push(`font-size: ${Number(patch.fontSize)}px${imp}`);
    }
    if (patch.fontWeight) {
      decls.push(`font-weight: ${patch.fontWeight}${imp}`);
    }
    if (Number.isFinite(Number(patch.lineHeight)) && Number(patch.lineHeight) > 0) {
      const lh = Number(patch.lineHeight);
      decls.push(`line-height: ${lh > 8 ? `${lh}px` : lh}${imp}`);
    }
    if (Number.isFinite(Number(patch.letterSpacing))) {
      decls.push(`letter-spacing: ${Number(patch.letterSpacing)}px${imp}`);
    }
    if (patch.textAlign) {
      decls.push(`text-align: ${patch.textAlign}${imp}`);
    }
    if (patch.color || patch.fgColor) {
      decls.push(`color: ${patch.color || patch.fgColor}${imp}`);
    }
    if (patch.fillMode === 'linear-gradient') {
      const c1 = patch.gradColor1 || '#0ea5e9';
      const c2 = patch.gradColor2 || '#6366f1';
      const ang = Number.isFinite(Number(patch.gradAngle)) ? Number(patch.gradAngle) : 135;
      decls.push(`background-image: linear-gradient(${ang}deg, ${c1}, ${c2})${imp}`);
    } else if (patch.fillMode === 'radial-gradient') {
      const c1 = patch.gradColor1 || '#0ea5e9';
      const c2 = patch.gradColor2 || '#6366f1';
      decls.push(`background-image: radial-gradient(circle, ${c1}, ${c2})${imp}`);
    } else if (patch.fillMode === 'solid' || patch.bgColor || patch.backgroundColor) {
      const bg = patch.bgColor || patch.backgroundColor;
      if (bg) decls.push(`background-color: ${bg}${imp}`);
      decls.push(`background-image: none${imp}`);
    }
    if (Number.isFinite(Number(patch.opacity))) {
      const op = Number(patch.opacity);
      const normOp = op <= 0 ? 0 : op <= 1 ? op : op <= 100 ? op / 100 : 1;
      decls.push(`opacity: ${normOp}${imp}`);
    }
    if (Number.isFinite(Number(patch.borderRadius))) {
      decls.push(`border-radius: ${Math.max(0, Number(patch.borderRadius))}px${imp}`);
    }
    if (Number.isFinite(Number(patch.borderWidth))) {
      const bw = Math.max(0, Number(patch.borderWidth));
      const bs = patch.borderStyle || (bw > 0 ? 'solid' : 'none');
      const bc = patch.borderColor || 'currentColor';
      decls.push(`border-width: ${bw}px${imp}`);
      decls.push(`border-style: ${bs}${imp}`);
      decls.push(`border-color: ${bc}${imp}`);
    } else {
      if (patch.borderStyle) decls.push(`border-style: ${patch.borderStyle}${imp}`);
      if (patch.borderColor) decls.push(`border-color: ${patch.borderColor}${imp}`);
    }
    if (Number.isFinite(Number(patch.shadowBlur)) && Number(patch.shadowBlur) >= 0) {
      const blur = Number(patch.shadowBlur);
      decls.push(
        blur === 0
          ? `box-shadow: none${imp}`
          : `box-shadow: 0 ${Math.round(blur * 0.45)}px ${blur}px rgba(0, 0, 0, 0.32)${imp}`
      );
    } else if (patch.boxShadow) {
      decls.push(`box-shadow: ${patch.boxShadow}${imp}`);
    }
    if (Number.isFinite(Number(patch.padTop))) decls.push(`padding-top: ${Math.max(0, Number(patch.padTop))}px${imp}`);
    if (Number.isFinite(Number(patch.padRight))) decls.push(`padding-right: ${Math.max(0, Number(patch.padRight))}px${imp}`);
    if (Number.isFinite(Number(patch.padBottom))) decls.push(`padding-bottom: ${Math.max(0, Number(patch.padBottom))}px${imp}`);
    if (Number.isFinite(Number(patch.padLeft))) decls.push(`padding-left: ${Math.max(0, Number(patch.padLeft))}px${imp}`);
    if (Number.isFinite(Number(patch.zIndex))) decls.push(`z-index: ${Math.round(Number(patch.zIndex))}${imp}`);

    return decls;
  }

  function buildGeometryDecls(fElKey, patch, important = true) {
    if (!patch || typeof patch !== 'object') return [];
    const imp = important ? ' !important' : '';
    const isFree = String(fElKey || '').startsWith('fw::');
    const decls = [];

    const hasW = Number.isFinite(Number(patch.width)) && Number(patch.width) > 0;
    const hasH = Number.isFinite(Number(patch.height)) && Number(patch.height) > 0;
    if (hasW) decls.push(`width: ${Math.max(10, Math.round(Number(patch.width)))}px${imp}`);
    if (hasH) decls.push(`height: ${Math.max(10, Math.round(Number(patch.height)))}px${imp}`);

    const hasX = Number.isFinite(Number(patch.x));
    const hasY = Number.isFinite(Number(patch.y));
    const hasRot = Number.isFinite(Number(patch.rotate));
    const hasScale = Number.isFinite(Number(patch.scale)) && Number(patch.scale) !== 1;

    if (isFree) {
      if (hasX) decls.push(`left: ${Math.round(Number(patch.x))}px${imp}`);
      if (hasY) decls.push(`top: ${Math.round(Number(patch.y))}px${imp}`);
      if (hasRot || hasScale) {
        const sc = hasScale ? Number(patch.scale) : 1;
        const rot = hasRot ? ` rotate(${Number(patch.rotate)}deg)` : '';
        decls.push(`transform: scale(${sc})${rot}${imp}`);
      }
    } else if (hasX || hasY || hasRot || hasScale) {
      const tx = hasX ? Math.round(Number(patch.x)) : 0;
      const ty = hasY ? Math.round(Number(patch.y)) : 0;
      const sc = hasScale ? ` scale(${Number(patch.scale)})` : '';
      const rot = hasRot ? ` rotate(${Number(patch.rotate)}deg)` : '';
      decls.push(`position: relative${imp}`);
      decls.push(`transform: translate3d(${tx}px, ${ty}px, 0)${sc}${rot}${imp}`);
    }

    return decls;
  }

  const INTERACTION_HOVER_CSS = `
/* Hover Presets & Scroll-Reveal Overrides (F15) */
#hp-root [data-hover-preset="lift"] { transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease !important; }
#hp-root [data-hover-preset="lift"]:hover { transform: translateY(-6px) !important; box-shadow: 0 22px 44px rgba(0, 0, 0, 0.38) !important; border-color: var(--accent, #38BDF8) !important; }
#hp-root [data-hover-preset="scale"] { transition: transform 0.22s ease, box-shadow 0.22s ease !important; }
#hp-root [data-hover-preset="scale"]:hover { transform: scale(1.04) !important; box-shadow: 0 18px 36px rgba(0, 0, 0, 0.3) !important; }
#hp-root [data-hover-preset="glow"] { transition: box-shadow 0.22s ease, border-color 0.22s ease !important; }
#hp-root [data-hover-preset="glow"]:hover { box-shadow: 0 0 28px rgba(56, 189, 248, 0.55) !important; border-color: #38BDF8 !important; }
#hp-root [data-hover-preset="border-accent"] { transition: border-color 0.22s ease, background-color 0.22s ease !important; }
#hp-root [data-hover-preset="border-accent"]:hover { border-color: var(--accent, #38BDF8) !important; }
`.trim();

  function compileResponsiveCSS(pageDocOverride) {
    const s = getEngineState();
    const ro = pageDocOverride?.responsiveOverrides || ensureResponsiveState(s);
    const rules = [BASE_RESPONSIVE_CLAMP_CSS, INTERACTION_HOVER_CSS];

    const desktopMap = ro?.desktop || {};
    const tabletMap = ro?.tablet || {};
    const mobileMap = ro?.mobile || {};

    // 1. Desktop base rules:
    //    - Visual styles apply across all viewports (#hp-root [data-f-el="..."]) so they cascade to Tablet/Mobile
    //    - Geometry (x, y, width, height) is scoped to #hp-root[data-viewport="desktop"] so it never leaks or overflows Mobile!
    Object.entries(desktopMap).forEach(([fElKey, patch]) => {
      if (!fElKey || !patch) return;
      const escKey = cssEscapeAttrVal(fElKey);
      const visualDecls = buildVisualStyleDecls(patch, true);
      if (visualDecls.length > 0) {
        rules.push(`#hp-root [data-f-el="${escKey}"] { ${visualDecls.join('; ')}; }`);
      }
      if (!String(fElKey).startsWith('fw::')) {
        const geomDecls = buildGeometryDecls(fElKey, patch, false);
        if (geomDecls.length > 0) {
          rules.push(`#hp-root[data-viewport="desktop"] [data-f-el="${escKey}"] { ${geomDecls.join('; ')}; }`);
        }
      } else if (Number.isFinite(Number(patch.rotate))) {
        const sc = Number.isFinite(Number(patch.scale)) && Number(patch.scale) !== 1 ? Number(patch.scale) : 1;
        rules.push(`#hp-root[data-viewport="desktop"] [data-f-el="${escKey}"] { transform: scale(${sc}) rotate(${Number(patch.rotate)}deg) !important; }`);
      }
    });

    // 2. Tablet overrides (#hp-root[data-viewport="tablet"] + standalone @media)
    const tabletMediaRules = [];
    Object.entries(tabletMap).forEach(([fElKey, patch]) => {
      if (!fElKey || !patch) return;
      const escKey = cssEscapeAttrVal(fElKey);
      const decls = [...buildVisualStyleDecls(patch, true), ...buildGeometryDecls(fElKey, patch, true)];
      if (decls.length > 0) {
        rules.push(`#hp-root[data-viewport="tablet"] [data-f-el="${escKey}"] { ${decls.join('; ')}; }`);
        tabletMediaRules.push(`  body > #hp-root [data-f-el="${escKey}"], html.is-client-mode #hp-root [data-f-el="${escKey}"] { ${decls.join('; ')}; }`);
      }
    });
    if (tabletMediaRules.length > 0) {
      rules.push(`@media (max-width: 960px) and (min-width: 561px) {\n${tabletMediaRules.join('\n')}\n}`);
    }

    // 3. Mobile overrides (#hp-root[data-viewport="mobile"] + standalone @media)
    const mobileMediaRules = [];
    Object.entries(mobileMap).forEach(([fElKey, patch]) => {
      if (!fElKey || !patch) return;
      const escKey = cssEscapeAttrVal(fElKey);
      const decls = [...buildVisualStyleDecls(patch, true), ...buildGeometryDecls(fElKey, patch, true)];
      if (decls.length > 0) {
        rules.push(`#hp-root[data-viewport="mobile"] [data-f-el="${escKey}"] { ${decls.join('; ')}; }`);
        mobileMediaRules.push(`  body > #hp-root [data-f-el="${escKey}"], html.is-client-mode #hp-root [data-f-el="${escKey}"] { ${decls.join('; ')}; }`);
      }
    });
    if (mobileMediaRules.length > 0) {
      rules.push(`@media (max-width: 560px) {\n${mobileMediaRules.join('\n')}\n}`);
    }

    return rules.join('\n');
  }

  function syncViewportPosMarkers(rootEl) {
    if (typeof document === 'undefined') return;
    const root = rootEl || document.getElementById('hp-root');
    if (!root || typeof root.querySelectorAll !== 'function') return;
    const ro = ensureResponsiveState();

    root.querySelectorAll('[data-vp-tablet-pos]')?.forEach?.((el) => el.removeAttribute?.('data-vp-tablet-pos'));
    root.querySelectorAll('[data-vp-mobile-pos]')?.forEach?.((el) => el.removeAttribute?.('data-vp-mobile-pos'));

    Object.entries(ro.tablet || {}).forEach(([k, p]) => {
      if (p && (Number.isFinite(Number(p.x)) || Number.isFinite(Number(p.y)) || Number.isFinite(Number(p.width)) || Number.isFinite(Number(p.height)))) {
        const el = root.querySelector?.(`[data-f-el="${cssEscapeAttrVal(k)}"]`);
        if (el) el.setAttribute?.('data-vp-tablet-pos', '1');
      }
    });
    Object.entries(ro.mobile || {}).forEach(([k, p]) => {
      if (p && (Number.isFinite(Number(p.x)) || Number.isFinite(Number(p.y)) || Number.isFinite(Number(p.width)) || Number.isFinite(Number(p.height)))) {
        const el = root.querySelector?.(`[data-f-el="${cssEscapeAttrVal(k)}"]`);
        if (el) el.setAttribute?.('data-vp-mobile-pos', '1');
      }
    });
  }

  function applyResponsiveState(rootEl) {
    if (typeof document === 'undefined') return '';
    const root = rootEl || document.getElementById('hp-root');
    if (!root) return '';
    const s = getEngineState();
    const vp = s?.viewport || 'desktop';
    if (root.dataset) root.dataset.viewport = vp;
    root.setAttribute?.('data-viewport', vp);

    const frame = document.getElementById('canvas-frame');
    if (frame) {
      if (frame.dataset) frame.dataset.viewport = vp;
      frame.setAttribute?.('data-viewport', vp);
    }

    syncViewportPosMarkers(root);

    // Ensure exactly 1 <style id="hp-responsive-overrides"> inside #hp-root
    const existingStyles = typeof root.querySelectorAll === 'function'
      ? root.querySelectorAll('style#hp-responsive-overrides')
      : [];
    let styleEl = existingStyles[0];
    for (let i = 1; i < existingStyles.length; i++) {
      existingStyles[i].remove?.();
    }
    if (!styleEl && typeof document.createElement === 'function') {
      styleEl = document.createElement('style');
      styleEl.id = 'hp-responsive-overrides';
      root.insertBefore?.(styleEl, root.firstChild);
    }
    const cssText = compileResponsiveCSS();
    if (styleEl) styleEl.textContent = cssText;
    updateZoomSizerDimensions();
    return cssText;
  }

  function resolveElementKeyArg(arg) {
    if (!arg) return '';
    if (typeof arg === 'string') return arg;
    if (typeof arg.getAttribute === 'function') {
      const k = arg.getAttribute('data-f-el');
      if (k) return k;
      if (arg.classList?.contains('f-free-ui') && arg.dataset?.uid) {
        const fk = `fw::${arg.dataset.uid}`;
        arg.setAttribute('data-f-el', fk);
        return fk;
      }
    }
    return '';
  }

  function getElementPatch(pageOrEl, elKeyOrVp, maybeVp) {
    const s = getEngineState();
    const ro = ensureResponsiveState(s);
    let elKey = '';
    let vp = s?.viewport || 'desktop';

    if (typeof pageOrEl === 'string' || (pageOrEl && typeof pageOrEl.getAttribute === 'function')) {
      elKey = resolveElementKeyArg(pageOrEl);
      if (typeof elKeyOrVp === 'string') vp = elKeyOrVp;
    } else {
      elKey = resolveElementKeyArg(elKeyOrVp);
      if (typeof maybeVp === 'string') vp = maybeVp;
    }
    if (!elKey) return {};
    return { ...(ro[vp]?.[elKey] || {}) };
  }

  function setElementPatch(pageOrEl, elKeyOrPatch, viewportOrPatch, maybePatch) {
    const s = getEngineState();
    const ro = ensureResponsiveState(s);
    let elKey = '';
    let vp = s?.viewport || 'desktop';
    let patch = null;

    if (typeof pageOrEl === 'string' || (pageOrEl && typeof pageOrEl.getAttribute === 'function')) {
      elKey = resolveElementKeyArg(pageOrEl);
      if (typeof elKeyOrPatch === 'string') {
        vp = elKeyOrPatch;
        patch = viewportOrPatch;
      } else {
        patch = elKeyOrPatch;
        if (typeof viewportOrPatch === 'string') vp = viewportOrPatch;
      }
    } else {
      elKey = resolveElementKeyArg(elKeyOrPatch);
      if (typeof viewportOrPatch === 'string') {
        vp = viewportOrPatch;
        patch = maybePatch;
      } else {
        patch = viewportOrPatch;
      }
    }

    if (!elKey || !patch || typeof patch !== 'object') return null;
    if (!ro[vp]) ro[vp] = {};
    const cur = ro[vp][elKey] || {};
    const cleaned = { ...cur };
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || (typeof v === 'number' && Number.isNaN(v))) return;
      if (v === null) {
        delete cleaned[k];
      } else {
        cleaned[k] = v;
      }
    });
    ro[vp][elKey] = cleaned;

    // If on Desktop, also mirror geometry to freeWidgets / uiOffsets for v10 compatibility
    if (vp === 'desktop' && typeof document !== 'undefined') {
      const root = document.getElementById('hp-root');
      const el = root ? root.querySelector(`[data-f-el="${cssEscapeAttrVal(elKey)}"]`) : null;
      if (el) {
        if (elKey.startsWith('fw::') && s) {
          const uid = elKey.slice(4);
          const fw = (s.freeWidgets || []).find((x) => x.uid === uid);
          if (fw) {
            if (Number.isFinite(Number(patch.x))) {
              fw.x = Math.round(Number(patch.x));
              el.style.left = `${fw.x}px`;
              const sec = el.closest('.f-sec-wrap') || root;
              const sw = Math.max(1, (sec.getBoundingClientRect().width || 1280) / (s.zoom || 1));
              fw.xPct = Number(((fw.x / sw) * 100).toFixed(4));
            }
            if (Number.isFinite(Number(patch.y))) {
              fw.y = Math.round(Number(patch.y));
              fw.yPx = fw.y;
              el.style.top = `${fw.y}px`;
            }
            if (Number.isFinite(Number(patch.width)) && Number(patch.width) > 0) {
              fw.width = Math.max(10, Math.round(Number(patch.width)));
              if (typeof globalRoot.applyDimensionToFreeWidgetEl === 'function') {
                globalRoot.applyDimensionToFreeWidgetEl(el, fw.width, fw.height);
              } else {
                el.style.width = `${fw.width}px`;
              }
            }
            if (Number.isFinite(Number(patch.height)) && Number(patch.height) > 0) {
              fw.height = Math.max(10, Math.round(Number(patch.height)));
              if (typeof globalRoot.applyDimensionToFreeWidgetEl === 'function') {
                globalRoot.applyDimensionToFreeWidgetEl(el, fw.width, fw.height);
              } else {
                el.style.height = `${fw.height}px`;
              }
            }
            if (Number.isFinite(Number(patch.rotate))) {
              fw.rotate = Number(patch.rotate);
              const sc = Number.isFinite(Number(fw.scale)) ? Number(fw.scale) : 1;
              el.style.transform = `scale(${sc}) rotate(${fw.rotate}deg)`;
            }
            if (Number.isFinite(Number(patch.zIndex))) {
              fw.zIndex = Math.round(Number(patch.zIndex));
              el.style.zIndex = String(fw.zIndex);
            }
          }
        } else if (s && typeof globalRoot.getElementPathInRoot === 'function') {
          const pk = globalRoot.getElementPathInRoot(el);
          if (pk) {
            const prev = s.uiOffsets[pk] || { x: 0, y: 0, scale: 1 };
            const next = { ...prev };
            if (Number.isFinite(Number(patch.x))) next.x = Math.round(Number(patch.x));
            if (Number.isFinite(Number(patch.y))) next.y = Math.round(Number(patch.y));
            if (Number.isFinite(Number(patch.width)) && Number(patch.width) > 0) {
              next.width = Math.max(10, Math.round(Number(patch.width)));
              el.style.width = `${next.width}px`;
            }
            if (Number.isFinite(Number(patch.height)) && Number(patch.height) > 0) {
              next.height = Math.max(10, Math.round(Number(patch.height)));
              el.style.height = `${next.height}px`;
            }
            if (Number.isFinite(Number(patch.zIndex))) {
              next.zIndex = Math.round(Number(patch.zIndex));
              if (!el.style.position) el.style.position = 'relative';
              el.style.zIndex = String(next.zIndex);
            }
            if (Number.isFinite(Number(patch.rotate))) {
              next.rotate = Number(patch.rotate);
            }
            if (patch.bgColor) next.bgColor = patch.bgColor;
            if (patch.color || patch.fgColor) next.fgColor = patch.color || patch.fgColor;
            s.uiOffsets[pk] = next;
            if (Number.isFinite(Number(patch.x)) || Number.isFinite(Number(patch.y)) || Number.isFinite(Number(patch.rotate))) {
              el.dataset.uiMoved = '1';
              if (!el.style.position) el.style.position = 'relative';
              const nx = Number(next.x) || 0;
              const ny = Number(next.y) || 0;
              const sc = Number(next.scale) || 1;
              const rot = Number.isFinite(Number(next.rotate)) ? ` rotate(${Number(next.rotate)}deg)` : '';
              el.style.transform = `translate3d(${nx}px, ${ny}px, 0) scale(${sc})${rot}`;
            }
          }
        }
      }
    }

    applyResponsiveState();
    if (typeof globalRoot.syncSelectedUIOverlay === 'function') {
      globalRoot.syncSelectedUIOverlay();
    }
    globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
    return cleaned;
  }

  function resetViewportPatch(pageOrEl, elKeyArg, vpArg) {
    const s = getEngineState();
    const ro = ensureResponsiveState(s);
    let elKey = '';
    let vp = s?.viewport || 'desktop';
    if (typeof pageOrEl === 'string' || (pageOrEl && typeof pageOrEl.getAttribute === 'function')) {
      elKey = resolveElementKeyArg(pageOrEl);
      if (typeof elKeyArg === 'string') vp = elKeyArg;
    } else {
      elKey = resolveElementKeyArg(elKeyArg);
      if (typeof vpArg === 'string') vp = vpArg;
    }
    if (ro[vp]) {
      if (elKey) {
        delete ro[vp][elKey];
      } else {
        ro[vp] = {};
      }
    }
    applyResponsiveState();
    if (typeof globalRoot.syncSelectedUIOverlay === 'function') {
      globalRoot.syncSelectedUIOverlay();
    }
    globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
  }

  function resetCurrentViewportOverride() {
    const s = getEngineState();
    if (!s) return;
    const vp = s.viewport || 'desktop';
    const ro = ensureResponsiveState(s);
    if (typeof globalRoot.pushUndoSnapshot === 'function') {
      globalRoot.pushUndoSnapshot();
    }
    const selKeys = globalRoot.FORMA_PRO.SelectionEngine?.getSelection?.() || [];
    if (vp !== 'desktop') {
      if (selKeys.length > 0) {
        selKeys.forEach((k) => {
          if (ro[vp]) delete ro[vp][k];
        });
      } else {
        ro[vp] = {};
      }
    } else if (selKeys.length > 0) {
      selKeys.forEach((k) => {
        if (ro.desktop) delete ro.desktop[k];
      });
    }
    applyResponsiveState();
    if (typeof globalRoot.syncSelectedUIOverlay === 'function') {
      globalRoot.syncSelectedUIOverlay();
    }
    syncInspectorInputsFromSelected();
    globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
    if (typeof globalRoot.showStudioToast === 'function') {
      globalRoot.showStudioToast(`↺ ${vp.toUpperCase()} 뷰포트 오버라이드를 초기화했습니다.`);
    }
  }

  /* ==========================================================================
     3. CANVAS ZOOM STAGE ENGINE (30% - 150% + FIT + CTRL/META WHEEL) (F09)
     ========================================================================== */
  function clampZoom(z) {
    const num = Number(z);
    if (!Number.isFinite(num)) return 1;
    return Math.max(0.3, Math.min(1.5, Math.round(num * 100) / 100));
  }

  function getCanvasZoom() {
    const s = getEngineState();
    if (typeof document !== 'undefined') {
      const stg = document.getElementById('canvas-zoom-stage');
      if (stg && stg.dataset?.zoom) {
        const dz = parseFloat(stg.dataset.zoom);
        if (Number.isFinite(dz) && dz >= 0.3 && dz <= 1.5) return dz;
      }
    }
    return clampZoom(s?.zoom || 1);
  }

  function updateZoomSizerDimensions() {
    if (typeof document === 'undefined') return;
    if (globalRoot.FORMA_PRO.ClientMode?.isClientMode?.()) return;
    const sizer = document.getElementById('canvas-zoom-sizer');
    const stage = document.getElementById('canvas-zoom-stage');
    const root = document.getElementById('hp-root');
    if (!sizer || !stage) return;
    const z = getCanvasZoom();
    const logicalW = getArtboardLogicalWidth();
    const logicalH = Math.max(480, root ? root.offsetHeight || root.scrollHeight || 900 : 900);
    sizer.style.width = `${Math.round(logicalW * z)}px`;
    sizer.style.height = `${Math.round(logicalH * z)}px`;
  }

  function setCanvasZoom(zVal, focalPoint) {
    const s = getEngineState();
    const prevZ = getCanvasZoom();
    const nextZ = clampZoom(zVal);
    if (s) s.zoom = nextZ;

    if (typeof document !== 'undefined') {
      const frame = document.getElementById('canvas-frame');
      const stage = document.getElementById('canvas-zoom-stage');
      const readout =
        document.querySelector('[data-testid="zoom-readout"]') ||
        document.getElementById('st-zoom-readout');

      let prevScrollLeft = frame ? frame.scrollLeft : 0;
      let prevScrollTop = frame ? frame.scrollTop : 0;
      let fx = 0;
      let fy = 0;
      if (frame && focalPoint && Number.isFinite(focalPoint.clientX) && Number.isFinite(focalPoint.clientY)) {
        const fr = frame.getBoundingClientRect();
        fx = focalPoint.clientX - fr.left;
        fy = focalPoint.clientY - fr.top;
      }

      if (frame) {
        if (frame.dataset) frame.dataset.zoom = String(nextZ);
        frame.setAttribute?.('data-zoom', String(nextZ));
      }
      if (stage) {
        if (stage.dataset) stage.dataset.zoom = String(nextZ);
        stage.setAttribute?.('data-zoom', String(nextZ));
        stage.style.transformOrigin = 'top left';
        stage.style.transform = nextZ === 1 ? 'none' : `scale(${nextZ})`;
      }
      if (readout) {
        readout.textContent = `${Math.round(nextZ * 100)}%`;
      }

      updateZoomSizerDimensions();

      if (frame && focalPoint && prevZ > 0 && nextZ !== prevZ) {
        const logicalX = (prevScrollLeft + fx) / prevZ;
        const logicalY = (prevScrollTop + fy) / prevZ;
        frame.scrollLeft = Math.max(0, Math.round(logicalX * nextZ - fx));
        frame.scrollTop = Math.max(0, Math.round(logicalY * nextZ - fy));
      }
    }

    if (typeof globalRoot.syncSelectedUIOverlay === 'function') {
      globalRoot.syncSelectedUIOverlay();
    }
    return nextZ;
  }

  function stepCanvasZoom(delta, focalPoint) {
    const cur = getCanvasZoom();
    return setCanvasZoom(cur + Number(delta || 0), focalPoint);
  }

  function fitCanvasZoom() {
    if (typeof document === 'undefined') return 1;
    const frame = document.getElementById('canvas-frame');
    const logicalW = getArtboardLogicalWidth();
    if (!frame) return setCanvasZoom(1);
    const availW = Math.max(120, (frame.clientWidth || 1280) - 16);
    const rawZ = Math.floor((availW / logicalW) * 100) / 100;
    const clampedFit = Math.max(0.3, Math.min(1.0, rawZ));
    return setCanvasZoom(clampedFit);
  }

  let wheelListenerBound = false;
  function bindCanvasWheelZoom() {
    if (wheelListenerBound || typeof document === 'undefined') return;
    const frame = document.getElementById('canvas-frame');
    if (!frame || typeof frame.addEventListener !== 'function') return;
    wheelListenerBound = true;

    frame.addEventListener(
      'wheel',
      (e) => {
        if (globalRoot.FORMA_PRO.ClientMode?.isClientMode?.()) return;
        // Only intercept wheel when Ctrl or Meta is pressed; allow unmodified wheel to scroll vertically!
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        e.stopPropagation();
        const step = e.deltaY < 0 ? 0.1 : -0.1;
        stepCanvasZoom(step, { clientX: e.clientX, clientY: e.clientY });
      },
      { passive: false }
    );
  }

  /* ==========================================================================
     4. RIGHT PROPERTY INSPECTOR BRIDGE (F13 / F12 / F14)
     ========================================================================== */
  function ensureInspectorMounted() {
    if (typeof document === 'undefined') return;
    if (globalRoot.FORMA_PRO.ClientMode?.isClientMode?.()) return;
    if (globalRoot.FORMA_PRO.InspectorUI?.renderInspector) {
      globalRoot.FORMA_PRO.InspectorUI.renderInspector();
      return;
    }
    const panel = document.getElementById('st-right-panel');
    if (!panel) return;
    panel.style.display = '';
    if (panel.querySelector('[data-testid="insp-x"]')) return;

    panel.innerHTML = `
      <div class="st-insp-align-bar" style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px;padding:6px;background:#080A0F;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;">
        <button type="button" data-testid="align-left" class="st-insp-tab" onclick="FORMA_PRO.SelectionEngine.alignSelection('left')" title="왼쪽 정렬">⊢</button>
        <button type="button" data-testid="align-center-x" class="st-insp-tab" onclick="FORMA_PRO.SelectionEngine.alignSelection('center-x')" title="가로 중앙 정렬">⫿</button>
        <button type="button" data-testid="align-right" class="st-insp-tab" onclick="FORMA_PRO.SelectionEngine.alignSelection('right')" title="오른쪽 정렬">⊣</button>
        <button type="button" data-testid="align-top" class="st-insp-tab" onclick="FORMA_PRO.SelectionEngine.alignSelection('top')" title="위쪽 정렬">⊤</button>
        <button type="button" data-testid="align-center-y" class="st-insp-tab" onclick="FORMA_PRO.SelectionEngine.alignSelection('center-y')" title="세로 중앙 정렬">┼</button>
        <button type="button" data-testid="align-bottom" class="st-insp-tab" onclick="FORMA_PRO.SelectionEngine.alignSelection('bottom')" title="아래쪽 정렬">⊥</button>
        <button type="button" data-testid="distribute-h" class="st-insp-tab" onclick="FORMA_PRO.SelectionEngine.distributeSelection('h')" title="가로 간격 균등 배분">⇔</button>
        <button type="button" data-testid="distribute-v" class="st-insp-tab" onclick="FORMA_PRO.SelectionEngine.distributeSelection('v')" title="세로 간격 균등 배분">⇕</button>
      </div>
      <div class="st-insp-tabs">
        <button type="button" data-testid="tab-design" class="st-insp-tab is-active" onclick="FORMA_PRO.ResponsiveEngine.switchInspectorTab('design')">Design</button>
        <button type="button" data-testid="tab-interact" class="st-insp-tab" onclick="FORMA_PRO.ResponsiveEngine.switchInspectorTab('interact')">Interact</button>
        <button type="button" data-testid="tab-layers" class="st-insp-tab" onclick="FORMA_PRO.ResponsiveEngine.switchInspectorTab('layers')">Layers</button>
      </div>
      <div id="st-insp-pane-design">
        <div class="st-insp-sec">
          <div class="st-insp-sec-title">Position &amp; Size</div>
          <div class="st-insp-grid2">
            <div class="st-insp-field"><label>X</label><input type="number" data-testid="insp-x" value="0" /></div>
            <div class="st-insp-field"><label>Y</label><input type="number" data-testid="insp-y" value="0" /></div>
            <div class="st-insp-field"><label>W</label><input type="number" data-testid="insp-w" value="100" /></div>
            <div class="st-insp-field"><label>H</label><input type="number" data-testid="insp-h" value="40" /></div>
            <div class="st-insp-field"><label>Rot</label><input type="number" data-testid="insp-rotate" value="0" /></div>
            <div class="st-insp-field"><label>Z</label><input type="number" data-testid="insp-zindex" value="25" /></div>
          </div>
          <div class="st-insp-grid4">
            <div class="st-insp-field"><label>Pt</label><input type="number" data-testid="insp-pad-top" value="0" /></div>
            <div class="st-insp-field"><label>Pr</label><input type="number" data-testid="insp-pad-right" value="0" /></div>
            <div class="st-insp-field"><label>Pb</label><input type="number" data-testid="insp-pad-bottom" value="0" /></div>
            <div class="st-insp-field"><label>Pl</label><input type="number" data-testid="insp-pad-left" value="0" /></div>
          </div>
        </div>
        <div class="st-insp-sec">
          <div class="st-insp-sec-title">Typography</div>
          <div class="st-insp-field">
            <label>Font</label>
            <select data-testid="insp-font-family">
              <option value="var(--font-display)">Display</option>
              <option value="var(--font-body)">Body</option>
              <option value="'Pretendard Variable', sans-serif">Pretendard</option>
              <option value="'Noto Serif KR', serif">Noto Serif KR</option>
              <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
            </select>
          </div>
          <div class="st-insp-grid2">
            <div class="st-insp-field"><label>Sz</label><input type="number" data-testid="insp-font-size" value="16" /></div>
            <div class="st-insp-field">
              <label>Wt</label>
              <select data-testid="insp-font-weight">
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
              </select>
            </div>
            <div class="st-insp-field"><label>LH</label><input type="number" step="0.1" data-testid="insp-line-height" value="1.4" /></div>
            <div class="st-insp-field"><label>LS</label><input type="number" step="0.5" data-testid="insp-letter-spacing" value="0" /></div>
          </div>
          <div class="st-insp-grid2">
            <div class="st-insp-field">
              <label>Align</label>
              <select data-testid="insp-text-align">
                <option value="left">left</option>
                <option value="center">center</option>
                <option value="right">right</option>
              </select>
            </div>
            <div class="st-insp-field"><label>Color</label><input type="color" data-testid="insp-text-color" value="#1e293b" /></div>
          </div>
        </div>
        <div class="st-insp-sec">
          <div class="st-insp-sec-title">Fill &amp; Opacity</div>
          <div class="st-insp-grid2">
            <div class="st-insp-field">
              <label>Fill</label>
              <select data-testid="insp-fill-mode">
                <option value="solid">solid</option>
                <option value="linear-gradient">linear-gradient</option>
                <option value="radial-gradient">radial-gradient</option>
              </select>
            </div>
            <div class="st-insp-field"><label>Bg</label><input type="color" data-testid="insp-bg-color" value="#0f766e" /></div>
            <div class="st-insp-field"><label>G1</label><input type="color" data-testid="insp-grad-color-1" value="#0ea5e9" /></div>
            <div class="st-insp-field"><label>G2</label><input type="color" data-testid="insp-grad-color-2" value="#6366f1" /></div>
            <div class="st-insp-field"><label>Ang</label><input type="number" data-testid="insp-grad-angle" value="135" /></div>
            <div class="st-insp-field"><label>Op</label><input type="number" step="0.05" min="0" max="1" data-testid="insp-opacity" value="1" /></div>
          </div>
        </div>
        <div class="st-insp-sec">
          <div class="st-insp-sec-title">Border &amp; Shadow</div>
          <div class="st-insp-grid2">
            <div class="st-insp-field"><label>BW</label><input type="number" data-testid="insp-border-width" value="0" /></div>
            <div class="st-insp-field">
              <label>BS</label>
              <select data-testid="insp-border-style">
                <option value="solid">solid</option>
                <option value="dashed">dashed</option>
                <option value="none">none</option>
              </select>
            </div>
            <div class="st-insp-field"><label>BC</label><input type="color" data-testid="insp-border-color" value="#38bdf8" /></div>
            <div class="st-insp-field"><label>Rad</label><input type="number" data-testid="insp-border-radius" value="8" /></div>
            <div class="st-insp-field">
              <label>Shd</label>
              <select data-testid="insp-shadow-preset">
                <option value="none">none</option>
                <option value="soft">soft</option>
                <option value="elevated">elevated</option>
              </select>
            </div>
            <div class="st-insp-field"><label>Blur</label><input type="number" data-testid="insp-shadow-blur" value="0" /></div>
          </div>
        </div>
      </div>
      <div id="st-insp-pane-interact" style="display:none;" class="st-insp-sec">
        <div class="st-insp-sec-title">Link &amp; Motion</div>
        <div class="st-insp-field">
          <label>Type</label>
          <select data-testid="insp-link-type">
            <option value="none">none</option>
            <option value="page">page</option>
            <option value="section">section</option>
            <option value="url">url</option>
            <option value="lightbox">lightbox</option>
          </select>
        </div>
        <div class="st-insp-field"><label>To</label><input type="text" data-testid="insp-link-target" placeholder="#/contact" /></div>
        <div class="st-insp-field">
          <label>Hover</label>
          <select data-testid="insp-hover-preset">
            <option value="none">none</option>
            <option value="lift">lift</option>
            <option value="scale">scale</option>
            <option value="glow">glow</option>
          </select>
        </div>
        <div class="st-insp-field">
          <label>Reveal</label>
          <select data-testid="insp-scroll-reveal">
            <option value="none">none</option>
            <option value="fade-up">fade-up</option>
            <option value="zoom-in">zoom-in</option>
          </select>
        </div>
      </div>
      <div id="st-insp-pane-layers" style="display:none;" class="st-insp-sec"></div>
    `;

    const fieldMap = {
      'insp-x': (v) => ({ x: Number(v) }),
      'insp-y': (v) => ({ y: Number(v) }),
      'insp-w': (v) => ({ width: Math.max(28, Number(v)) }),
      'insp-h': (v) => ({ height: Math.max(20, Number(v)) }),
      'insp-rotate': (v) => ({ rotate: Number(v) }),
      'insp-zindex': (v) => ({ zIndex: Number(v) }),
      'insp-pad-top': (v) => ({ padTop: Math.max(0, Number(v)) }),
      'insp-pad-right': (v) => ({ padRight: Math.max(0, Number(v)) }),
      'insp-pad-bottom': (v) => ({ padBottom: Math.max(0, Number(v)) }),
      'insp-pad-left': (v) => ({ padLeft: Math.max(0, Number(v)) }),
      'insp-font-family': (v) => ({ fontFamily: String(v) }),
      'insp-font-size': (v) => ({ fontSize: Math.max(8, Number(v)) }),
      'insp-font-weight': (v) => ({ fontWeight: String(v) }),
      'insp-line-height': (v) => ({ lineHeight: Number(v) }),
      'insp-letter-spacing': (v) => ({ letterSpacing: Number(v) }),
      'insp-text-align': (v) => ({ textAlign: String(v) }),
      'insp-text-color': (v) => ({ color: String(v) }),
      'insp-fill-mode': (v) => ({ fillMode: String(v) }),
      'insp-bg-color': (v) => ({ bgColor: String(v), fillMode: 'solid' }),
      'insp-grad-color-1': (v) => ({ gradColor1: String(v) }),
      'insp-grad-color-2': (v) => ({ gradColor2: String(v) }),
      'insp-grad-angle': (v) => ({ gradAngle: Number(v) }),
      'insp-opacity': (v) => ({ opacity: Number(v) }),
      'insp-border-width': (v) => ({ borderWidth: Math.max(0, Number(v)) }),
      'insp-border-style': (v) => ({ borderStyle: String(v) }),
      'insp-border-color': (v) => ({ borderColor: String(v) }),
      'insp-border-radius': (v) => ({ borderRadius: Math.max(0, Number(v)) }),
      'insp-shadow-blur': (v) => ({ shadowBlur: Math.max(0, Number(v)) }),
      'insp-shadow-preset': (v) => ({
        boxShadow:
          v === 'none'
            ? 'none'
            : v === 'soft'
            ? '0 8px 24px rgba(0, 0, 0, 0.18)'
            : '0 18px 36px rgba(0, 0, 0, 0.38)'
      })
    };

    Object.entries(fieldMap).forEach(([tid, mapper]) => {
      const inp = panel.querySelector(`[data-testid="${tid}"]`);
      if (!inp) return;
      const applyHandler = () => {
        if (globalRoot.FORMA_PRO.InspectorUI?.hasCustomBinding) return;
        const selKeys = globalRoot.FORMA_PRO.SelectionEngine?.getSelection?.() || [];
        const activeEl =
          (typeof selectedCanvasEl !== 'undefined' && selectedCanvasEl) ||
          (selKeys[0] ? document.querySelector(`#hp-root [data-f-el="${cssEscapeAttrVal(selKeys[0])}"]`) : null);
        if (!activeEl) return;
        const targets = selKeys.length > 0 ? selKeys : [resolveElementKeyArg(activeEl)];
        const patch = mapper(inp.value);
        if (typeof globalRoot.pushUndoSnapshot === 'function') {
          globalRoot.pushUndoSnapshot();
        }
        targets.forEach((k) => {
          if (k) setElementPatch(k, patch);
        });
      };
      inp.addEventListener('change', applyHandler);
      if (inp.tagName === 'SELECT' || inp.type === 'color') {
        inp.addEventListener('input', applyHandler);
      }
    });
  }

  function switchInspectorTab(tab) {
    if (typeof document === 'undefined') return;
    const panel = document.getElementById('st-right-panel');
    if (!panel) return;
    ['design', 'interact', 'layers'].forEach((k) => {
      panel.querySelector(`[data-testid="tab-${k}"]`)?.classList.toggle('is-active', k === tab);
      const pane = document.getElementById(`st-insp-pane-${k}`);
      if (pane) pane.style.display = k === tab ? '' : 'none';
    });
  }

  function syncInspectorInputsFromSelected() {
    if (typeof document === 'undefined') return;
    const panel = document.getElementById('st-right-panel');
    if (!panel) return;
    const selEl = typeof selectedCanvasEl !== 'undefined' ? selectedCanvasEl : null;
    if (!selEl || !selEl.isConnected) return;
    const key = resolveElementKeyArg(selEl);
    const patch = getElementPatch(key);
    const z = getCanvasZoom();
    const r = selEl.getBoundingClientRect();
    const sec = selEl.closest('.f-sec-wrap') || document.getElementById('hp-root');
    const sr = sec ? sec.getBoundingClientRect() : { left: 0, top: 0 };

    const setVal = (tid, val) => {
      const inp = panel.querySelector(`[data-testid="${tid}"]`);
      if (inp && document.activeElement !== inp && val !== undefined && val !== null && !Number.isNaN(val)) {
        inp.value = String(val);
      }
    };

    const isFree = selEl.classList?.contains('f-free-ui');
    const curX = Number.isFinite(Number(patch.x))
      ? Math.round(Number(patch.x))
      : isFree
      ? Math.round((r.left - sr.left) / z)
      : 0;
    const curY = Number.isFinite(Number(patch.y))
      ? Math.round(Number(patch.y))
      : isFree
      ? Math.round((r.top - sr.top) / z)
      : 0;

    setVal('insp-x', curX);
    setVal('insp-y', curY);
    setVal('insp-w', Math.round(selEl.offsetWidth || r.width / z || 100));
    setVal('insp-h', Math.round(selEl.offsetHeight || r.height / z || 40));
    if (patch.fontSize) setVal('insp-font-size', patch.fontSize);
    if (patch.borderRadius !== undefined) setVal('insp-border-radius', patch.borderRadius);
  }

  /* ==========================================================================
     5. EXPORT PUBLIC INTERFACE ON window.FORMA_PRO
     ========================================================================== */
  const ResponsiveEngine = {
    ARTBOARD_WIDTHS,
    getArtboardLogicalWidth,
    stampSelectableElements,
    stampDeterministicElementIds: stampSelectableElements,
    getElementPatch,
    setElementPatch,
    resetViewportPatch,
    resetCurrentViewportOverride,
    compileResponsiveCSS,
    applyResponsiveState,
    applyViewportState: function (vp) {
      const s = getEngineState();
      if (s && vp) s.viewport = vp;
      return applyResponsiveState();
    },
    setCanvasZoom,
    stepCanvasZoom,
    fitCanvasZoom,
    zoomToFit: fitCanvasZoom,
    getCanvasZoom,
    updateZoomSizerDimensions,
    bindCanvasWheelZoom,
    ensureInspectorMounted,
    switchInspectorTab,
    syncInspectorInputsFromSelected
  };

  const ZoomEngine = {
    getZoom: getCanvasZoom,
    setZoom: setCanvasZoom,
    stepZoom: stepCanvasZoom,
    zoomToFit: fitCanvasZoom,
    fitCanvasZoom,
    updateZoomSizerDimensions,
    bindCanvasWheelZoom
  };

  globalRoot.FORMA_PRO.ResponsiveEngine = ResponsiveEngine;
  globalRoot.FORMA_PRO.ZoomEngine = ZoomEngine;
})();
