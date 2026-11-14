/* ==========================================================================
   FORMA STUDIO Pro — M3 INTERACTIONS ENGINE (F15) & PRODUCTION/SELF-HTML EXPORT (F19)
   ========================================================================== */
(function () {
  'use strict';

  const globalRoot = typeof window !== 'undefined' ? window : globalThis;
  globalRoot.FORMA_PRO = globalRoot.FORMA_PRO || {};

  let lastInteractSig = '';
  let lastInteractAt = 0;
  let globalClickGuardBound = false;

  function getEngineState() {
    return globalRoot.state || (typeof state !== 'undefined' ? state : null);
  }

  function cssEscapeAttrVal(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function sanitizeLinkTarget(rawVal) {
    const str = String(rawVal ?? '').trim();
    if (!str) return '';
    const compact = str.replace(/[\u0000-\u0020]+/g, '');
    if (/^(?:javascript|vbscript|data):/i.test(compact)) {
      return '';
    }
    return str;
  }

  function ensureInteractionsMap(st) {
    const s = st || getEngineState();
    if (!s) return {};
    if (!s.interactions || typeof s.interactions !== 'object') {
      s.interactions = {};
    }
    return s.interactions;
  }

  /* ==========================================================================
     1. INTERACTION CONFIG CRUD & DOM STAMPING (F15)
     ========================================================================== */
  function getElementInteractionConfig(key, el) {
    const s = getEngineState();
    const map = ensureInteractionsMap(s);
    const fromMap = (key && map[key]) || {};
    const fromDesk = (key && s?.responsiveOverrides?.desktop?.[key]) || {};
    const merged = { ...fromDesk, ...fromMap };

    const linkType =
      merged.linkType ||
      el?.getAttribute?.('data-link-type') ||
      (el?.getAttribute?.('data-page-link') ? 'page' : 'none');
    const rawTarget =
      merged.linkTarget !== undefined
        ? merged.linkTarget
        : el?.getAttribute?.('data-link-target') ||
          el?.getAttribute?.('data-page-link') ||
          el?.getAttribute?.('data-custom-href') ||
          '';
    const hoverPreset =
      merged.hoverPreset ||
      el?.getAttribute?.('data-hover-preset') ||
      'none';
    const scrollReveal =
      merged.scrollReveal ||
      el?.getAttribute?.('data-scroll-reveal') ||
      'none';

    return {
      linkType: String(linkType || 'none'),
      linkTarget: sanitizeLinkTarget(rawTarget),
      hoverPreset: String(hoverPreset || 'none'),
      scrollReveal: String(scrollReveal || 'none')
    };
  }

  function applyInteractionToElement(el, key, cfg) {
    if (!el || !cfg || typeof el.setAttribute !== 'function') return;

    const linkType = String(cfg.linkType || 'none');
    const safeTarget = sanitizeLinkTarget(cfg.linkTarget);
    const hoverPreset = String(cfg.hoverPreset || 'none');
    const scrollReveal = String(cfg.scrollReveal || 'none');

    // 1. Link attributes
    if (linkType === 'none' || !linkType) {
      el.removeAttribute('data-link-type');
      el.removeAttribute('data-link-target');
      el.removeAttribute('data-page-link');
      el.removeAttribute('data-page-slug');
      el.removeAttribute('data-custom-href');
      if (el.tagName === 'A') {
        el.removeAttribute('href');
      }
      if (cfg.linkType === 'none') {
        el.setAttribute('data-interaction-bound', 'none');
      }
    } else {
      el.removeAttribute('data-interaction-bound');
      el.setAttribute('data-link-type', linkType);

      if (linkType === 'page') {
        const cleanSlug = safeTarget.replace(/^#\/?/, '').trim() || 'home';
        el.setAttribute('data-link-target', cleanSlug);
        el.setAttribute('data-page-link', cleanSlug);
        el.setAttribute('data-custom-href', `#/${cleanSlug}`);
        if (el.tagName === 'A') {
          el.setAttribute('href', `#/${cleanSlug}`);
        }
      } else if (linkType === 'section') {
        const secHash = safeTarget
          ? safeTarget.startsWith('#')
            ? safeTarget
            : `#${safeTarget}`
          : '';
        el.setAttribute('data-link-target', secHash);
        el.setAttribute('data-custom-href', secHash);
        el.removeAttribute('data-page-link');
        if (el.tagName === 'A') {
          if (secHash) el.setAttribute('href', secHash);
          else el.removeAttribute('href');
        }
      } else if (linkType === 'url') {
        el.removeAttribute('data-page-link');
        if (safeTarget) {
          el.setAttribute('data-link-target', safeTarget);
          el.setAttribute('data-custom-href', safeTarget);
          if (el.tagName === 'A') el.setAttribute('href', safeTarget);
        } else {
          el.removeAttribute('data-link-target');
          el.removeAttribute('data-custom-href');
          if (el.tagName === 'A') el.removeAttribute('href');
        }
      } else if (linkType === 'lightbox') {
        el.removeAttribute('data-page-link');
        el.removeAttribute('data-custom-href');
        if (safeTarget) el.setAttribute('data-link-target', safeTarget);
        else el.removeAttribute('data-link-target');
      }
    }

    // 2. Hover preset
    el.classList.remove('f-hvr-lift', 'f-hvr-scale', 'f-hvr-glow');
    if (hoverPreset && hoverPreset !== 'none') {
      el.setAttribute('data-hover-preset', hoverPreset);
      el.classList.add(`f-hvr-${hoverPreset}`);
    } else {
      el.removeAttribute('data-hover-preset');
    }

    // 3. Scroll reveal override
    el.classList.remove('f-rvl-fade-up', 'f-rvl-zoom-in', 'f-rvl-slide-left');
    if (scrollReveal === 'none') {
      if (cfg.scrollReveal === 'none') {
        el.setAttribute('data-scroll-reveal', 'none');
        el.classList.remove('f-reveal', 'is-waiting');
        el.style.opacity = '1';
      } else {
        el.removeAttribute('data-scroll-reveal');
      }
    } else if (scrollReveal) {
      el.setAttribute('data-scroll-reveal', scrollReveal);
      el.classList.add('f-reveal', `f-rvl-${scrollReveal}`);
      if (el.style.opacity === '1') {
        el.style.opacity = '';
      }
    }
  }

  function applyInteractionsToDOM(rootEl) {
    if (typeof document === 'undefined') return;
    const root = rootEl || document.getElementById('hp-root');
    if (!root || typeof root.querySelector !== 'function') return;
    const s = getEngineState();
    const map = ensureInteractionsMap(s);
    const deskMap = s?.responsiveOverrides?.desktop || {};

    const allKeys = new Set([...Object.keys(deskMap), ...Object.keys(map)]);
    allKeys.forEach((key) => {
      if (!key) return;
      const dCfg = deskMap[key] || {};
      const iCfg = map[key] || {};
      if (
        dCfg.linkType === undefined &&
        dCfg.linkTarget === undefined &&
        dCfg.hoverPreset === undefined &&
        dCfg.scrollReveal === undefined &&
        iCfg.linkType === undefined &&
        iCfg.linkTarget === undefined &&
        iCfg.hoverPreset === undefined &&
        iCfg.scrollReveal === undefined
      ) {
        return;
      }
      const el = root.querySelector(`[data-f-el="${cssEscapeAttrVal(key)}"]`);
      if (el) {
        applyInteractionToElement(el, key, { ...dCfg, ...iCfg });
      }
    });
  }

  function setElementInteractionPatch(key, patch) {
    if (!key || !patch) return;
    const s = getEngineState();
    if (!s) return;
    const map = ensureInteractionsMap(s);
    const prev = map[key] || {};
    const next = { ...prev, ...patch };
    if (next.linkTarget !== undefined) {
      next.linkTarget = sanitizeLinkTarget(next.linkTarget);
    }
    if (next.linkType === 'none') {
      next.linkTarget = '';
    }
    map[key] = next;

    if (!s.responsiveOverrides) {
      s.responsiveOverrides = { desktop: {}, tablet: {}, mobile: {} };
    }
    if (!s.responsiveOverrides.desktop) s.responsiveOverrides.desktop = {};
    s.responsiveOverrides.desktop[key] = {
      ...(s.responsiveOverrides.desktop[key] || {}),
      ...next
    };

    if (typeof document !== 'undefined') {
      const root = document.getElementById('hp-root');
      const el = root?.querySelector(`[data-f-el="${cssEscapeAttrVal(key)}"]`);
      if (el) {
        applyInteractionToElement(el, key, next);
      }
    }

    globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
  }

  function bindInteractControlListeners(panel) {
    if (!panel) return;
    const controls = [
      'insp-link-type',
      'insp-link-target',
      'insp-hover-preset',
      'insp-scroll-reveal'
    ];

    controls.forEach((tid) => {
      const inp = panel.querySelector(`[data-testid="${tid}"]`);
      if (!inp) return;

      const handleUpdate = () => {
        const selKeys = globalRoot.FORMA_PRO.SelectionEngine?.getSelection?.() || [];
        if (selKeys.length === 0) return;

        let rawVal = inp.value;
        if (tid === 'insp-link-target') {
          const clean = sanitizeLinkTarget(rawVal);
          if (clean !== rawVal) {
            inp.value = clean;
          }
          rawVal = clean;
        }

        const sig = `${tid}::${selKeys.join(',')}::${rawVal}`;
        const now = Date.now();
        if (sig === lastInteractSig && now - lastInteractAt < 180) {
          return;
        }
        lastInteractSig = sig;
        lastInteractAt = now;

        const patch = {};
        if (tid === 'insp-link-type') {
          patch.linkType = String(rawVal || 'none');
          if (patch.linkType === 'none') {
            patch.linkTarget = '';
            const targetInp = panel.querySelector('[data-testid="insp-link-target"]');
            if (targetInp) targetInp.value = '';
          }
        } else if (tid === 'insp-link-target') {
          patch.linkTarget = sanitizeLinkTarget(rawVal);
        } else if (tid === 'insp-hover-preset') {
          patch.hoverPreset = String(rawVal || 'none');
        } else if (tid === 'insp-scroll-reveal') {
          patch.scrollReveal = String(rawVal || 'none');
        }

        if (typeof globalRoot.pushUndoSnapshot === 'function') {
          globalRoot.pushUndoSnapshot();
        }
        selKeys.forEach((k) => {
          setElementInteractionPatch(k, patch);
        });
      };

      inp.addEventListener('change', handleUpdate);
      inp.addEventListener('input', handleUpdate);
    });
  }

  function syncInteractInputsFromElement(el, key) {
    if (typeof document === 'undefined' || !el) return;
    const panel = document.getElementById('st-right-panel');
    if (!panel) return;
    const cfg = getElementInteractionConfig(key, el);

    const setVal = (tid, val) => {
      const inp = panel.querySelector(`[data-testid="${tid}"]`);
      if (inp && document.activeElement !== inp && val !== undefined && val !== null) {
        inp.value = String(val);
      }
    };

    setVal('insp-link-type', cfg.linkType || 'none');
    setVal('insp-link-target', cfg.linkTarget || '');
    setVal('insp-hover-preset', cfg.hoverPreset || 'none');
    setVal('insp-scroll-reveal', cfg.scrollReveal || 'none');
  }

  /* ==========================================================================
     2. EDITOR CLICK GUARD vs. CLIENT MODE INTERACTION DISPATCH (F15 / F18)
     ========================================================================== */
  function openLightboxForElement(el) {
    if (typeof document === 'undefined') return false;
    const lb = document.getElementById('lightbox-modal');
    const lbImg = document.getElementById('lightbox-img');
    if (!lb || !lbImg) return false;

    let src = '';
    const innerImg = el?.tagName === 'IMG' ? el : el?.querySelector?.('img');
    if (innerImg && innerImg.src) {
      src = innerImg.src;
    }
    if (!src) {
      const secImg = el?.closest?.('.f-sec-wrap')?.querySelector?.('img');
      if (secImg && secImg.src) src = secImg.src;
    }
    if (!src) {
      const anyImg = document.querySelector('#hp-root img');
      if (anyImg && anyImg.src) src = anyImg.src;
    }
    if (!src && typeof IMG !== 'undefined') {
      src = IMG.courtyard || Object.values(IMG)[0] || '';
    }
    if (src) {
      lbImg.src = src;
    }
    lb.classList.add('is-open');
    return true;
  }

  function bindGlobalInteractionDelegation() {
    if (globalClickGuardBound || typeof document === 'undefined' || typeof document.addEventListener !== 'function') return;
    globalClickGuardBound = true;

    document.addEventListener(
      'click',
      (e) => {
        const root = document.getElementById('hp-root');
        if (!root || !root.contains(e.target)) return;

        const isClient = Boolean(globalRoot.FORMA_PRO.ClientMode?.isClientMode?.());
        const s = getEngineState();

        // 1. STUDIO EDITOR CLICK GUARD (T2-F15-05, T3-CF-16):
        //    In Editor mode, clicking a linked element on the canvas selects it and NEVER navigates or opens popups!
        if (!isClient && !s?.presentation) {
          if (e.target.closest?.('.f-sec-pill, .f-sec-resize-bar, [data-live-editing="1"]')) {
            return;
          }
          const linkedInEditor = e.target.closest?.(
            '[data-link-type], [data-custom-href], [data-page-link], [data-page-slug], a[href]'
          );
          if (linkedInEditor && root.contains(linkedInEditor)) {
            e.preventDefault();
            e.stopPropagation();
            const selectable =
              globalRoot.FORMA_PRO.SelectionEngine?.resolveSelectableTarget?.(e.target) ||
              linkedInEditor;
            if (selectable && typeof globalRoot.selectCanvasUIElement === 'function') {
              globalRoot.selectCanvasUIElement(selectable, { shiftKey: e.shiftKey });
            }
            return;
          }
          return;
        }

        // 2. CLIENT PREVIEW MODE (?mode=client):
        //    First check if link was explicitly unbound via insp-link-type="none" (T2-F15-02)
        const unboundEl = e.target.closest?.('[data-interaction-bound="none"]');
        if (unboundEl && root.contains(unboundEl)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // Check lightbox action (T1-F15-04)
        const lbEl = e.target.closest?.('[data-link-type="lightbox"]');
        if (lbEl && root.contains(lbEl)) {
          e.preventDefault();
          e.stopPropagation();
          openLightboxForElement(lbEl);
          return;
        }

        // Check inter-page link (T1-F15-01, T3-CF-16)
        const pageEl = e.target.closest?.(
          '[data-link-type="page"], [data-page-link], [data-page-slug], a[href^="#/"], [data-custom-href^="#/"]'
        );
        if (pageEl && root.contains(pageEl)) {
          const rawSlug =
            pageEl.getAttribute('data-page-link') ||
            pageEl.getAttribute('data-page-slug') ||
            pageEl.getAttribute('data-link-target') ||
            pageEl.getAttribute('data-custom-href') ||
            pageEl.getAttribute('href') ||
            '';
          const cleanSlug = String(rawSlug).replace(/^#\/?/, '').trim();
          if (cleanSlug) {
            e.preventDefault();
            e.stopPropagation();
            if (globalRoot.FORMA_PRO.ClientMode?.navigateClientPage) {
              globalRoot.FORMA_PRO.ClientMode.navigateClientPage(cleanSlug);
            } else if (typeof globalRoot.formaNavigatePage === 'function') {
              globalRoot.formaNavigatePage(cleanSlug, e);
            }
            return;
          }
        }

        // Check section smooth scroll link (T1-F15-02, T2-F15-03)
        const secEl = e.target.closest?.(
          '[data-link-type="section"], a[href^="#"]:not([href^="#/"]), [data-custom-href^="#"]:not([data-custom-href^="#/"])'
        );
        if (secEl && root.contains(secEl)) {
          const rawHash =
            secEl.getAttribute('data-link-target') ||
            secEl.getAttribute('data-custom-href') ||
            secEl.getAttribute('href') ||
            '';
          e.preventDefault();
          e.stopPropagation();
          const cleanId = String(rawHash).replace(/^#/, '').trim();
          if (!cleanId) return;
          let targetSec = document.getElementById(cleanId) || document.getElementById(`sec-${cleanId}`);
          if (!targetSec) {
            try {
              targetSec = document.querySelector(`#${cleanId}`);
            } catch (_) {}
          }
          if (targetSec) {
            targetSec.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
            const r = targetSec.getBoundingClientRect();
            const targetY = Math.max(0, (window.scrollY || 0) + r.top);
            window.scrollTo?.({ top: targetY, behavior: 'smooth' });
          }
          return;
        }

        // Check external URL link (T1-F15-03, T2-F15-01)
        const urlEl = e.target.closest?.('[data-link-type="url"], [data-custom-href]');
        if (urlEl && root.contains(urlEl)) {
          const rawUrl =
            urlEl.getAttribute('data-link-target') ||
            urlEl.getAttribute('data-custom-href') ||
            urlEl.getAttribute('href') ||
            '';
          e.preventDefault();
          e.stopPropagation();
          const safeUrl = sanitizeLinkTarget(rawUrl);
          if (safeUrl && !safeUrl.startsWith('#')) {
            window.open(safeUrl, '_blank', 'noopener');
          }
        }
      },
      true
    );
  }

  /* ==========================================================================
     3. PRODUCTION MULTI-PAGE HTML & STATEFUL SELF-HTML EXPORT ENGINE (F19)
     ========================================================================== */
  function cleanCloneNodeToHTML(node, pageSlug = 'home') {
    let rawHTML = '';
    if (node && typeof node.cloneNode === 'function' && typeof node.querySelectorAll === 'function') {
      const clone = node.cloneNode(true);
      clone
        .querySelectorAll(
          '.f-sec-pill, .f-sec-resize-bar, .f-blank-guide, #floating-work-preview, #hp-live-curtain, .f-intro-curtain'
        )
        .forEach((el) => el.remove());
      clone.querySelectorAll('.is-waiting').forEach((el) => el.classList.remove('is-waiting'));
      clone.querySelectorAll('[contenteditable], [data-live-editing], [data-selected]').forEach((el) => {
        el.removeAttribute('contenteditable');
        el.removeAttribute('data-live-editing');
        el.removeAttribute('data-selected');
      });
      clone.classList.remove('guides-on', 'is-editing', 'is-move-mode');
      clone.setAttribute('data-viewport', 'desktop');
      clone.setAttribute('data-active-page', pageSlug);
      rawHTML = clone.outerHTML.replace(/\b(guides-on|is-editing|is-move-mode)\b/g, '');
    } else {
      const fallbackSrc =
        (node && (node.outerHTML || node.innerHTML)) ||
        document.getElementById('website-mount')?.innerHTML ||
        '';
      rawHTML = String(fallbackSrc).replace(/\b(guides-on|is-editing|is-move-mode)\b/g, '');
    }
    return globalRoot.FORMA_PRO.ProjectState?.resolveAssetRef
      ? globalRoot.FORMA_PRO.ProjectState.resolveAssetRef(rawHTML)
      : rawHTML;
  }

  function buildMultiPageProductionHTML(docOpt) {
    if (typeof document === 'undefined') return { standaloneDoc: '', previewDoc: '' };
    if (typeof globalRoot.blurActiveInlineEditingElement === 'function') {
      globalRoot.blurActiveInlineEditingElement();
    } else {
      try {
        document.querySelector('[data-live-editing="1"]')?.blur?.();
        if (document.activeElement?.isContentEditable) document.activeElement.blur();
      } catch (_) {}
    }
    globalRoot.FORMA_PRO.SelectionEngine?.syncFreeWidgetsFromDOM?.();
    globalRoot.FORMA_PRO.ProjectState?.syncEngineStateToPage?.();

    const s = getEngineState();
    const origViewport = s?.viewport || 'desktop';
    const w = typeof globalRoot.getCurrentWorldObj === 'function' ? globalRoot.getCurrentWorldObj() : { brand: 'FORMA', eyebrow: 'STUDIO', h1Sub: '' };
    const coreCSS = document.getElementById('forma-core-css')?.textContent || '';
    const fontsCSS = document.getElementById('forma-fonts-css')?.textContent || '';
    const root = document.getElementById('hp-root');
    if (!root) return { standaloneDoc: '', previewDoc: '' };

    const exportedPagesMap = {};
    const doc = docOpt || globalRoot.FORMA_PRO.ProjectState?.getDoc?.();

    if (doc && Array.isArray(doc.pages) && doc.pages.length > 0 && typeof globalRoot.FORMA_PRO.ProjectState?.switchPage === 'function') {
      const origPageId = doc.activePageId;
      doc.pages.forEach((p) => {
        globalRoot.FORMA_PRO.ProjectState.switchPage(p.id, false);
        const curRoot = document.getElementById('hp-root');
        if (curRoot) {
          globalRoot.FORMA_PRO.InspectorUI?.applyStoredLayerStatesToDOM?.(curRoot);
          applyInteractionsToDOM(curRoot);
          exportedPagesMap[p.slug] = cleanCloneNodeToHTML(curRoot, p.slug);
        }
      });
      globalRoot.FORMA_PRO.ProjectState.switchPage(origPageId, false);
    }

    if (s) s.viewport = origViewport;
    const restoredRoot = document.getElementById('hp-root');
    if (restoredRoot) {
      globalRoot.FORMA_PRO.ResponsiveEngine?.applyResponsiveState?.(restoredRoot);
      globalRoot.FORMA_PRO.InspectorUI?.applyStoredLayerStatesToDOM?.(restoredRoot);
      applyInteractionsToDOM(restoredRoot);
    }

    const liveCloneHTML =
      exportedPagesMap.home ||
      (restoredRoot ? cleanCloneNodeToHTML(restoredRoot, 'home') : '');

    const shd = typeof globalRoot.getAsset === 'function' ? globalRoot.getAsset('shader', s?.equipped?.shader) : { mode: 'aurora' };
    const summary =
      typeof CATEGORIES !== 'undefined' && Array.isArray(CATEGORIES)
        ? CATEGORIES.map((c) => `${c.key}:${s?.equipped?.[c.key] || ''}`).join(' | ')
        : 'FORMA STUDIO Pro';
    const serializedPagesJSON = JSON.stringify(exportedPagesMap).replace(/<\//g, '<\\/');

    const fnToggleAmbient = typeof globalRoot.toggleAmbientSynth === 'function' ? globalRoot.toggleAmbientSynth.toString() : 'function toggleAmbientSynth(){}';
    const fnToggleBilling = typeof globalRoot.toggleBillingCycle === 'function' ? globalRoot.toggleBillingCycle.toString() : 'function toggleBillingCycle(){}';
    const fnFilterGallery = typeof globalRoot.filterGalleryItems === 'function' ? globalRoot.filterGalleryItems.toString() : 'function filterGalleryItems(){}';
    const fnSelectFormPlan = typeof globalRoot.selectFormPlan === 'function' ? globalRoot.selectFormPlan.toString() : 'function selectFormPlan(){}';
    const fnDrawShader = typeof globalRoot.drawShaderFrame === 'function' ? globalRoot.drawShaderFrame.toString() : 'function drawShaderFrame(){}';
    const fnInitShader = typeof globalRoot.initShaderEngine === 'function' ? globalRoot.initShaderEngine.toString() : 'function initShaderEngine(){}';

    const standaloneScript = `
    let ambientAudio = null;
    let shaderRAF = null;
    const pointerState = { x: 420, y: 260 };
    const EXPORTED_PAGES = ${serializedPagesJSON};
    function showStudioToast(m){
      let t = document.getElementById('sa-toast');
      if(!t){ t = document.createElement('div'); t.id='sa-toast'; t.style.cssText='position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#F8FAFC;color:#090A0D;padding:8px 16px;border-radius:999px;font-size:12px;font-weight:700;z-index:999;box-shadow:0 12px 30px rgba(0,0,0,0.4);'; document.body.appendChild(t); }
      t.textContent = m; t.style.opacity = '1'; clearTimeout(t._tm); t._tm = setTimeout(()=>t.style.opacity='0', 2200);
    }
    function syncStandaloneViewport() {
      const r = document.getElementById('hp-root');
      if (!r) return;
      const w = window.innerWidth || 1280;
      const vp = w <= 560 ? 'mobile' : (w <= 960 ? 'tablet' : 'desktop');
      r.dataset.viewport = vp;
      r.setAttribute('data-viewport', vp);
    }
    ${fnToggleAmbient}
    ${fnToggleBilling}
    ${fnFilterGallery}
    ${fnSelectFormPlan}
    ${fnDrawShader}
    ${fnInitShader}
    function bindStandaloneInteractions() {
      syncStandaloneViewport();
      initShaderEngine(${JSON.stringify(shd?.mode || 'aurora')});
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
    document.addEventListener('click', (e) => {
      const unbound = e.target.closest?.('[data-interaction-bound="none"]');
      if (unbound) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const lbEl = e.target.closest?.('[data-link-type="lightbox"]');
      if (lbEl) {
        e.preventDefault();
        e.stopPropagation();
        const lb = document.getElementById('lightbox-modal');
        const lbImg = document.getElementById('lightbox-img');
        const srcImg = (lbEl.tagName === 'IMG' ? lbEl : lbEl.querySelector?.('img')) || document.querySelector('#hp-root img');
        if (lb && lbImg && srcImg?.src) {
          lbImg.src = srcImg.src;
          lb.classList.add('is-open');
        }
        return;
      }
      const pageEl = e.target.closest?.('[data-link-type="page"], [data-page-link], [data-page-slug], a[href^="#/"], [data-custom-href^="#/"]');
      if (pageEl) {
        const rawSlug = pageEl.getAttribute('data-page-link') || pageEl.getAttribute('data-page-slug') || pageEl.getAttribute('data-link-target') || pageEl.getAttribute('data-custom-href') || pageEl.getAttribute('href') || '';
        const cleanSlug = String(rawSlug).replace(/^#\\/?/, '').trim();
        if (cleanSlug) {
          e.preventDefault();
          e.stopPropagation();
          formaNavigatePage(cleanSlug, e);
          return;
        }
      }
      const secEl = e.target.closest?.('[data-link-type="section"], a[href^="#"]:not([href^="#/"]), [data-custom-href^="#"]:not([data-custom-href^="#/"])');
      if (secEl) {
        const rawHash = secEl.getAttribute('data-link-target') || secEl.getAttribute('data-custom-href') || secEl.getAttribute('href') || '';
        e.preventDefault();
        e.stopPropagation();
        const cleanId = String(rawHash).replace(/^#/, '').trim();
        if (!cleanId) return;
        let tSec = document.getElementById(cleanId) || document.getElementById('sec-' + cleanId);
        if (!tSec) { try { tSec = document.querySelector('#' + cleanId); } catch (_) {} }
        if (tSec) tSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const urlEl = e.target.closest?.('[data-link-type="url"], [data-custom-href]');
      if (urlEl) {
        const rawUrl = (urlEl.getAttribute('data-link-target') || urlEl.getAttribute('data-custom-href') || '').trim();
        e.preventDefault();
        e.stopPropagation();
        if (rawUrl && !/^(?:javascript|vbscript|data):/i.test(rawUrl) && !rawUrl.startsWith('#')) {
          window.open(rawUrl, '_blank', 'noopener');
        }
      }
    }, true);
    window.addEventListener('resize', syncStandaloneViewport);
    window.addEventListener('hashchange', () => {
      const slug = (window.location.hash || '').replace(/^#\\/?/, '').trim();
      if (slug && EXPORTED_PAGES[slug]) formaNavigatePage(slug);
    });
    document.addEventListener('mousemove', e => {
      pointerState.x = e.clientX;
      pointerState.y = e.clientY;
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

    const defaultLightboxPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const lightboxMarkup = `<div id="lightbox-modal" class="st-modal-backdrop" onclick="this.classList.remove('is-open')"><div class="st-modal-box" style="max-width:740px;" onclick="event.stopPropagation()"><div class="st-modal-body" style="text-align:center;"><img id="lightbox-img" src="${defaultLightboxPixel}" alt="Lightbox" style="width:100%;max-height:420px;object-fit:cover;border-radius:10px;" /></div></div></div>`;

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
${liveCloneHTML}
${lightboxMarkup}
  <script>${standaloneScript}
  <\/script>
</body>
</html>`;

    const previewDoc = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"/><style>${fontsCSS}\nhtml,body{margin:0;padding:0;overflow-x:hidden;}\n${coreCSS}</style></head><body>${liveCloneHTML}${lightboxMarkup}<script>${standaloneScript}<\/script></body></html>`;

    return { standaloneDoc, previewDoc, w };
  }

  function openFullWebsiteExportModal() {
    if (typeof document === 'undefined') return;
    const { standaloneDoc, previewDoc, w } = buildMultiPageProductionHTML();
    if (!standaloneDoc) return;
    const s = getEngineState();
    if (s) s.lastExportPreviewDoc = previewDoc;

    const tagEl = document.getElementById('export-modal-tag');
    const titleEl = document.getElementById('export-modal-title');
    const areaEl = document.getElementById('export-code-area');
    if (tagEl) tagEl.textContent = 'COMPLETE 26-SLOT SELF-CONTAINED PRODUCTION HTML';
    if (titleEl) titleEl.textContent = `${w?.brand || 'FORMA'} — 완성된 풀 홈페이지 전체 소스코드`;
    if (areaEl) areaEl.value = standaloneDoc;
    if (typeof globalRoot.setExportModalTab === 'function') {
      globalRoot.setExportModalTab('code');
    }
    document.getElementById('export-modal')?.classList.add('is-open');
  }

  function downloadProductionHTML() {
    if (typeof document === 'undefined' || typeof Blob === 'undefined') return;
    let val = document.getElementById('export-code-area')?.value || '';
    if (!val || !val.includes('EXPORTED_PAGES')) {
      val = buildMultiPageProductionHTML().standaloneDoc;
    }
    const s = getEngineState();
    const blob = new Blob([val], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${s?.worldKey || 'forma'}-forma-site.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    if (typeof globalRoot.showStudioToast === 'function') {
      globalRoot.showStudioToast('완성 홈페이지 HTML 파일 다운로드가 시작되었습니다.');
    }
  }

  function downloadStudioSelfHTMLWithState(docOpt) {
    if (typeof document === 'undefined' || typeof Blob === 'undefined' || !document.documentElement) return;
    if (typeof globalRoot.blurActiveInlineEditingElement === 'function') {
      globalRoot.blurActiveInlineEditingElement();
    } else {
      try {
        document.querySelector('[data-live-editing="1"]')?.blur?.();
        if (document.activeElement?.isContentEditable) document.activeElement.blur();
      } catch (_) {}
    }
    globalRoot.FORMA_PRO.SelectionEngine?.syncFreeWidgetsFromDOM?.();
    globalRoot.FORMA_PRO.ProjectState?.syncEngineStateToPage?.();

    const doc = docOpt || globalRoot.FORMA_PRO.ProjectState?.getDoc?.();
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

    // Remove temporary E2E style tags if any
    clone.querySelector('#e2e-no-transitions')?.remove();

    [
      'website-mount',
      'st-subbar',
      'st-drawer-cat-head',
      'st-drawer-cards',
      'st-hidden-secs-bar',
      'st-tune-popover',
      'st-photo-popover',
      'vault-toolbar',
      'vault-cats-bar',
      'vault-cards-grid',
      'st-drag-ghost'
    ].forEach((id) => {
      const el = clone.querySelector ? clone.querySelector('#' + id) : null;
      if (el) el.innerHTML = '';
    });

    [
      'st-ui-sel-box',
      'st-ui-toolbar',
      'st-photo-popover',
      'st-drag-ghost',
      'st-sec-drop-line',
      'st-snap-guide-x',
      'st-snap-guide-y',
      'st-marquee-box',
      'st-context-menu'
    ].forEach((id) => {
      const el = clone.querySelector ? clone.querySelector('#' + id) : null;
      if (el) el.style.display = 'none';
    });

    clone.querySelectorAll?.('.is-open, .is-visible, .is-drop-hot, .is-dragging').forEach((el) => {
      el.classList.remove('is-open', 'is-visible', 'is-drop-hot', 'is-dragging');
    });

    const appEl = clone.querySelector ? clone.querySelector('#studio-app') : null;
    if (appEl) {
      appEl.removeAttribute('style');
      appEl.classList.remove('is-presentation');
    }

    const fullHTML = '<!DOCTYPE html>\n' + clone.outerHTML;
    globalRoot.__lastSelfStudioHTML = fullHTML;
    const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FORMA_STUDIO_Pro.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    if (typeof globalRoot.showStudioToast === 'function') {
      globalRoot.showStudioToast('FORMA_STUDIO_Pro.html 다운로드 시작! 현재 모든 페이지·수정이 함께 내장되었습니다.');
    }
  }

  bindGlobalInteractionDelegation();

  const InteractionsEngine = {
    sanitizeLinkTarget,
    getElementInteractionConfig,
    applyInteractionToElement,
    applyInteractionsToDOM,
    setElementInteractionPatch,
    bindInteractControlListeners,
    syncInteractInputsFromElement,
    openLightboxForElement
  };

  const ExportEngine = {
    buildMultiPageProductionHTML,
    openFullWebsiteExport: openFullWebsiteExportModal,
    downloadProductionHTML,
    downloadStudioSelfHTMLWithState
  };

  globalRoot.FORMA_PRO.InteractionsEngine = InteractionsEngine;
  globalRoot.FORMA_PRO.ExportEngine = ExportEngine;

  // Override global export handlers so topbar / modal buttons invoke the upgraded ExportEngine
  globalRoot.openFullWebsiteExport = openFullWebsiteExportModal;
  globalRoot.downloadExportHTML = downloadProductionHTML;
  globalRoot.downloadStudioSelfHTML = downloadStudioSelfHTMLWithState;
})();
