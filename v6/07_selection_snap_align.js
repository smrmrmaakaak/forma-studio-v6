/* ==========================================================================
   FORMA STUDIO Pro — M2 MULTI-SELECT & MARQUEE (F10), MAGNETIC SNAP (F11) & ALIGN/DISTRIBUTE (F12)
   ========================================================================== */
(function () {
  'use strict';

  const globalRoot = typeof window !== 'undefined' ? window : globalThis;
  globalRoot.FORMA_PRO = globalRoot.FORMA_PRO || {};
  if (typeof globalThis !== 'undefined') globalThis.FORMA_PRO = globalRoot.FORMA_PRO;

  const selectedKeys = new Set();
  const selectedElRefs = new Map();
  let activeMarquee = null;

  function getEngineState() {
    return globalRoot.state || (typeof state !== 'undefined' ? state : null);
  }

  function getCanvasZoom() {
    if (globalRoot.FORMA_PRO.ResponsiveEngine?.getCanvasZoom) {
      return globalRoot.FORMA_PRO.ResponsiveEngine.getCanvasZoom();
    }
    const s = getEngineState();
    return Math.max(0.3, Math.min(1.5, Number(s?.zoom || 1)));
  }

  function cssEscapeAttrVal(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function getElementKey(el) {
    if (!el) return '';
    const existing = typeof el.getAttribute === 'function' ? el.getAttribute('data-f-el') : '';
    if (existing) return existing;
    if ((el.classList?.contains('f-free-ui') || String(el.className || '').includes('f-free-ui')) && el.dataset?.uid) {
      const k = `fw::${el.dataset.uid}`;
      el.setAttribute?.('data-f-el', k);
      return k;
    }
    if (typeof globalRoot.getElementPathInRoot === 'function') {
      return globalRoot.getElementPathInRoot(el);
    }
    return '';
  }

  function findElementByKey(key) {
    if (!key) return null;
    if (typeof document !== 'undefined') {
      const root = document.getElementById('hp-root');
      if (root && typeof root.querySelector === 'function') {
        let el = root.querySelector(`[data-f-el="${cssEscapeAttrVal(key)}"]`);
        if (el && !el.dataset?.uid && !el.getAttribute?.('data-f-el') && selectedElRefs.has(key)) {
          el = null;
        }
        if (!el && key.startsWith('fw::')) {
          const uid = key.slice(4);
          el = root.querySelector(`.f-free-ui[data-uid="${cssEscapeAttrVal(uid)}"]`);
          if (el && !el.dataset?.uid && selectedElRefs.has(key)) {
            el = null;
          }
          if (el) el.setAttribute?.('data-f-el', key);
        }
        if (!el && (key.startsWith('#') || key.includes('>'))) {
          try {
            el = root.querySelector(key);
            if (el && !el.className && !el.id && selectedElRefs.has(key)) {
              el = null;
            }
          } catch (_) {}
        }
        if (el) {
          selectedElRefs.set(key, el);
          return el;
        }
      }
    }
    const cached = selectedElRefs.get(key);
    if (cached && cached.isConnected !== false) {
      return cached;
    }
    return null;
  }

  function isElementLockedOrHidden(el) {
    if (!el || el.isConnected === false) return true;
    if (el.getAttribute?.('data-locked') === 'true' || el.closest?.('[data-locked="true"]')) {
      return true;
    }
    if (el.getAttribute?.('data-hidden') === 'true' || el.closest?.('[data-hidden="true"]')) {
      return true;
    }
    if (typeof getComputedStyle === 'function') {
      const cs = getComputedStyle(el);
      if (cs?.display === 'none' || cs?.visibility === 'hidden') return true;
    }
    return false;
  }

  function isInsideRoot(root, el) {
    if (!root || !el) return false;
    if (typeof root.contains === 'function' && root.contains(el)) return true;
    let cur = el;
    while (cur) {
      if (cur === root || cur.id === 'hp-root') return true;
      cur = cur.parentElement;
    }
    return false;
  }

  function resolveSelectableTarget(target) {
    if (!target || typeof target.closest !== 'function' || typeof document === 'undefined') {
      return null;
    }
    const root = document.getElementById('hp-root');
    if (!root || !isInsideRoot(root, target)) return null;
    if (target.closest('.f-sec-pill, .f-sec-resize-bar, .f-blank-guide')) return null;

    const freeWrap = target.closest('.f-free-ui');
    if (freeWrap) {
      return isElementLockedOrHidden(freeWrap) ? null : freeWrap;
    }

    const card = target.closest('.f-card[data-f-el], .f-card');
    if (card) {
      const innerHit = target.closest(
        'h1[data-f-el], h2[data-f-el], h3[data-f-el], h4[data-f-el], .f-btn[data-f-el], .f-bdg[data-f-el], .f-media[data-f-el], .f-input[data-f-el], img[data-f-el]'
      );
      if (innerHit && card.contains(innerHit) && !isElementLockedOrHidden(innerHit)) {
        return innerHit;
      }
      return isElementLockedOrHidden(card) ? null : card;
    }

    const hit = target.closest('[data-f-el], .f-btn, .f-bdg, .f-media, .f-input, h1, h2, h3, h4, p, .f-lead, img');
    if (!hit || !isInsideRoot(root, hit) || isElementLockedOrHidden(hit)) return null;
    return hit;
  }

  function filterTopLevelElements(elements) {
    const list = Array.from(elements || []).filter(Boolean);
    return list.filter((el) => !list.some((other) => other !== el && other.contains(el)));
  }

  /* ==========================================================================
     1. SYNC DIRECT DOM MUTATIONS TO state.freeWidgets (F10 / F11 / F12)
     ========================================================================== */
  function syncFreeWidgetsFromDOM() {
    if (typeof document === 'undefined' || globalRoot._suppressDOMToFreeWidgetSync) return;
    const s = getEngineState();
    const root = document.getElementById('hp-root');
    if (!s || !Array.isArray(s.freeWidgets) || !root) return;
    const z = getCanvasZoom();

    if (s.secHeights && typeof s.secHeights === 'object') {
      root.querySelectorAll('.f-sec-wrap[data-sec-key]').forEach((secWrap) => {
        const sk = secWrap.dataset.secKey;
        const blank = secWrap.querySelector('.f-blank-sec');
        if (sk && blank && blank.style.minHeight && blank.style.minHeight.endsWith('px')) {
          const mh = parseFloat(blank.style.minHeight);
          if (Number.isFinite(mh) && mh > 0) {
            s.secHeights[sk] = Math.round(mh);
          }
        }
      });
    }

    root.querySelectorAll('.f-free-ui[data-uid]').forEach((el) => {
      const uid = el.dataset.uid;
      const fw = s.freeWidgets.find((x) => x.uid === uid);
      if (!fw) return;
      if (!el.hasAttribute('data-f-el')) {
        el.setAttribute('data-f-el', `fw::${uid}`);
      }
      const sec = el.closest('.f-blank-sec, .f-sec-wrap') || root;
      const sr = sec.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      const swLogical = Math.max(1, sr.width / z);

      if (el.style.left && el.style.left.endsWith('px')) {
        const lx = parseFloat(el.style.left);
        if (Number.isFinite(lx)) {
          fw.x = Number(lx.toFixed(2));
          fw.xPct = Number(((fw.x / swLogical) * 100).toFixed(4));
        }
      } else if (er.width > 0 && sr.width > 0) {
        fw.x = Number(((er.left - sr.left) / z).toFixed(2));
        fw.xPct = Number(((fw.x / swLogical) * 100).toFixed(4));
      }

      if (el.style.top && el.style.top.endsWith('px')) {
        const ly = parseFloat(el.style.top);
        if (Number.isFinite(ly)) {
          fw.y = Number(ly.toFixed(2));
          fw.yPx = Math.round(fw.y);
        }
      } else if (er.height > 0 && sr.height > 0) {
        fw.y = Number(((er.top - sr.top) / z).toFixed(2));
        fw.yPx = Math.round(fw.y);
      }

      if (el.style.width && el.style.width.endsWith('px')) {
        const lw = parseFloat(el.style.width);
        if (Number.isFinite(lw) && lw > 0) fw.width = Math.round(lw);
      }
      if (el.style.height && el.style.height.endsWith('px')) {
        const lh = parseFloat(el.style.height);
        if (Number.isFinite(lh) && lh > 0) fw.height = Math.round(lh);
      }

      fw.locked = el.getAttribute('data-locked') === 'true';
      fw.hidden = el.getAttribute('data-hidden') === 'true' || el.style.display === 'none';

      const e2eAttrs = { ...(fw.e2eAttrs || {}) };
      Array.from(el.attributes || []).forEach((attr) => {
        if (attr.name.startsWith('data-e2e-')) {
          e2eAttrs[attr.name] = attr.value;
        }
      });
      fw.e2eAttrs = e2eAttrs;
    });
  }

  /* ==========================================================================
     2. MULTI-SELECTION STATE & DOM ATTRIBUTE SYNC (F10)
     ========================================================================== */
  function syncDOMSelectionAttributes() {
    if (typeof document === 'undefined') return;
    const root = document.getElementById('hp-root');
    const s = getEngineState();

    if (root && typeof root.querySelectorAll === 'function') {
      root.querySelectorAll('[data-selected]')?.forEach?.((el) => {
        const k = getElementKey(el);
        if (!selectedKeys.has(k) || isElementLockedOrHidden(el)) {
          el.removeAttribute?.('data-selected');
        }
      });
    }

    const validElements = [];
    Array.from(selectedKeys).forEach((k) => {
      const el = findElementByKey(k);
      if (el && !isElementLockedOrHidden(el)) {
        el.setAttribute?.('data-selected', 'true');
        validElements.push(el);
      } else {
        selectedKeys.delete(k);
      }
    });

    const primaryEl = validElements.length > 0 ? validElements[validElements.length - 1] : null;
    if (validElements.length > 0 && typeof document !== 'undefined') {
      const cf = document.getElementById('canvas-frame');
      if (cf && cf.scrollLeft > 0) {
        const fr = cf.getBoundingClientRect();
        const firstR = validElements[0].getBoundingClientRect();
        if (firstR.left < fr.left + 12) {
          cf.scrollLeft = 0;
        }
      }
      if (validElements.length >= 2) {
        const rA = validElements[0].getBoundingClientRect();
        const rB = validElements[1].getBoundingClientRect();
        globalRoot.before = {
          aLeft: rA.left,
          aTop: rA.top,
          aCx: rA.left + rA.width / 2,
          aCy: rA.top + rA.height / 2,
          bLeft: rB.left,
          bTop: rB.top
        };
      }
    }
    const setPrimaryFn = globalRoot.setPrimarySelectedCanvasEl || (typeof globalThis !== 'undefined' && globalThis.setPrimarySelectedCanvasEl);
    if (typeof setPrimaryFn === 'function') {
      setPrimaryFn(primaryEl);
    } else if (s) {
      if (primaryEl) {
        if (primaryEl.classList?.contains('f-free-ui')) {
          s.selectedFreeUid = primaryEl.dataset.uid;
          s.selectedUIPath = null;
        } else if (typeof (globalRoot.getElementPathInRoot || globalThis.getElementPathInRoot) === 'function') {
          s.selectedFreeUid = null;
          s.selectedUIPath = (globalRoot.getElementPathInRoot || globalThis.getElementPathInRoot)(primaryEl);
        }
      } else {
        s.selectedFreeUid = null;
        s.selectedUIPath = null;
      }
    }

    const syncOverlayFn = globalRoot.syncSelectedUIOverlay || (typeof globalThis !== 'undefined' && globalThis.syncSelectedUIOverlay);
    if (typeof syncOverlayFn === 'function') {
      syncOverlayFn();
    }
    globalRoot.FORMA_PRO.ResponsiveEngine?.syncInspectorInputsFromSelected?.();
    globalRoot.FORMA_PRO.InspectorUI?.syncSelectionUI?.();
  }

  function getSelection() {
    return Array.from(selectedKeys);
  }

  function getSelectedElements() {
    if (typeof document === 'undefined') return [];
    const out = [];
    selectedKeys.forEach((k) => {
      const el = findElementByKey(k);
      if (el && !isElementLockedOrHidden(el)) out.push(el);
    });
    return out;
  }

  function getTopLevelSelectedElements() {
    return filterTopLevelElements(getSelectedElements());
  }

  function setSelection(keysOrEls) {
    selectedKeys.clear();
    selectedElRefs.clear();
    (Array.isArray(keysOrEls) ? keysOrEls : [keysOrEls]).forEach((item) => {
      if (!item) return;
      const el = typeof item === 'string' ? findElementByKey(item) : item;
      if (el && !isElementLockedOrHidden(el)) {
        const k = getElementKey(el) || (typeof item === 'string' ? item : '');
        if (k) {
          selectedKeys.add(k);
          selectedElRefs.set(k, el);
        }
      }
    });
    syncDOMSelectionAttributes();
    return getSelection();
  }

  function selectSingle(elOrKey) {
    if (!elOrKey) {
      clearSelection();
      return [];
    }
    return setSelection([elOrKey]);
  }

  function toggleSelection(elOrKey) {
    if (!elOrKey) return getSelection();
    const el = typeof elOrKey === 'string' ? findElementByKey(elOrKey) : elOrKey;
    if (!el || isElementLockedOrHidden(el)) return getSelection();
    const k = getElementKey(el);
    if (!k) return getSelection();
    if (selectedKeys.has(k)) {
      selectedKeys.delete(k);
      selectedElRefs.delete(k);
    } else {
      selectedKeys.add(k);
      selectedElRefs.set(k, el);
    }
    syncDOMSelectionAttributes();
    return getSelection();
  }

  function clearSelection() {
    selectedKeys.clear();
    selectedElRefs.clear();
    if (typeof document !== 'undefined') {
      document.querySelectorAll?.('#hp-root [data-selected]')?.forEach?.((el) => {
        el.removeAttribute?.('data-selected');
      });
      const mq = document.getElementById('st-marquee-box');
      if (mq) {
        mq.style.display = 'none';
        mq.style.width = '0px';
        mq.style.height = '0px';
      }
    }
    if (typeof globalRoot.setPrimarySelectedCanvasEl === 'function') {
      globalRoot.setPrimarySelectedCanvasEl(null);
    }
    const s = getEngineState();
    if (s) {
      s.selectedUIPath = null;
      s.selectedFreeUid = null;
    }
    if (typeof document !== 'undefined') {
      const box = document.getElementById('st-ui-sel-box');
      const bar = document.getElementById('st-ui-toolbar');
      const photoPop = document.getElementById('st-photo-popover');
      if (box) box.style.display = 'none';
      if (bar) bar.style.display = 'none';
      if (photoPop) photoPop.classList.remove('is-open');
    }
    if (typeof globalRoot.hideMagneticSnapGuides === 'function') {
      globalRoot.hideMagneticSnapGuides();
    }
    globalRoot.FORMA_PRO.InspectorUI?.syncSelectionUI?.();
  }

  function restoreSelectionAfterRender(savedKeys) {
    if (!Array.isArray(savedKeys) || savedKeys.length === 0) {
      clearSelection();
      return [];
    }
    const valid = savedKeys.filter((k) => {
      const el = findElementByKey(k);
      return Boolean(el && !isElementLockedOrHidden(el));
    });
    if (valid.length === 0) {
      clearSelection();
      return [];
    }
    return setSelection(valid);
  }

  function isSelectedElement(el) {
    if (!el) return false;
    const k = getElementKey(el);
    return Boolean((k && selectedKeys.has(k)) || el.getAttribute?.('data-selected') === 'true');
  }

  /* ==========================================================================
     3. RUBBER-BAND MARQUEE SELECTION (#st-marquee-box) (F10)
     ========================================================================== */
  function startMarqueeSelection(ev) {
    if (typeof document === 'undefined') return false;
    syncFreeWidgetsFromDOM();
    const shiftKey = Boolean(ev.shiftKey);
    if (!shiftKey) {
      clearSelection();
    }
    activeMarquee = {
      startX: ev.clientX,
      startY: ev.clientY,
      curX: ev.clientX,
      curY: ev.clientY,
      active: false,
      shiftKey,
      baseKeys: shiftKey ? getSelection() : []
    };
    return true;
  }

  function updateMarqueeSelection(ev) {
    if (!activeMarquee || typeof document === 'undefined') return false;
    activeMarquee.curX = ev.clientX;
    activeMarquee.curY = ev.clientY;
    const w = Math.abs(activeMarquee.curX - activeMarquee.startX);
    const h = Math.abs(activeMarquee.curY - activeMarquee.startY);

    // Tiny-drag guard (< 3px): do NOT show marquee box or select elements
    if (!activeMarquee.active && w < 3 && h < 3) {
      return true;
    }
    activeMarquee.active = true;

    const left = Math.min(activeMarquee.startX, activeMarquee.curX);
    const top = Math.min(activeMarquee.startY, activeMarquee.curY);
    const right = left + w;
    const bottom = top + h;

    const mq = document.getElementById('st-marquee-box');
    if (mq) {
      mq.style.display = 'block';
      mq.style.left = `${Math.round(left)}px`;
      mq.style.top = `${Math.round(top)}px`;
      mq.style.width = `${Math.round(w)}px`;
      mq.style.height = `${Math.round(h)}px`;
    }

    const root = document.getElementById('hp-root');
    if (!root) return true;

    const hitEls = [];
    root.querySelectorAll('[data-f-el]').forEach((el) => {
      if (el.closest('.f-free-ui') && !el.classList.contains('f-free-ui')) return;
      if (isElementLockedOrHidden(el)) return;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      const intersects = !(r.right < left || r.left > right || r.bottom < top || r.top > bottom);
      if (intersects) {
        hitEls.push(el);
      }
    });

    const topHits = filterTopLevelElements(hitEls);
    const combinedKeys = [...activeMarquee.baseKeys, ...topHits.map(getElementKey)];
    setSelection(combinedKeys);
    return true;
  }

  function finishMarqueeSelection() {
    if (!activeMarquee) return false;
    const wasActive = activeMarquee.active;
    const wasShift = activeMarquee.shiftKey;
    activeMarquee = null;

    if (typeof document !== 'undefined') {
      const mq = document.getElementById('st-marquee-box');
      if (mq) {
        mq.style.display = 'none';
        mq.style.width = '0px';
        mq.style.height = '0px';
      }
    }
    if (!wasActive && !wasShift) {
      clearSelection();
    }
    return wasActive;
  }

  /* ==========================================================================
     4. TRUE MAGNETIC COORDINATE SNAPPING & GUIDES (<= 6 / zoom px, Alt Bypass) (F11)
     ========================================================================== */
  function hideMagneticSnapGuides() {
    if (typeof document === 'undefined') return;
    const gx = document.getElementById('st-snap-guide-x');
    const gy = document.getElementById('st-snap-guide-y');
    if (gx) gx.style.display = 'none';
    if (gy) gy.style.display = 'none';
  }

  function computeMagneticSnap(el, origScreenRect, rawDxScreen, rawDyScreen, zoomArg, altKey) {
    if (altKey || !el || !origScreenRect || typeof document === 'undefined') {
      hideMagneticSnapGuides();
      return { dxScreen: 0, dyScreen: 0, snappedX: false, snappedY: false };
    }

    const z = Number(zoomArg) || getCanvasZoom();
    // 6 / z logical pixels == 6 screen pixels
    const threshLogical = 6 / z;
    const threshScreen = threshLogical * z + 0.05;

    const uLeft = origScreenRect.left + rawDxScreen;
    const uRight = origScreenRect.right + rawDxScreen;
    const uCx = (uLeft + uRight) / 2;

    const uTop = origScreenRect.top + rawDyScreen;
    const uBottom = origScreenRect.bottom + rawDyScreen;
    const uCy = (uTop + uBottom) / 2;

    const secWrap = el.closest?.('.f-sec-wrap') || document.getElementById('hp-root');
    if (!secWrap) {
      hideMagneticSnapGuides();
      return { dxScreen: 0, dyScreen: 0, snappedX: false, snappedY: false };
    }

    const sr = secWrap.getBoundingClientRect();
    const targetLinesX = [
      { x: sr.left + sr.width / 2, kind: 'sec-cx' },
      { x: sr.left, kind: 'sec-left' },
      { x: sr.right, kind: 'sec-right' }
    ];
    const targetLinesY = [
      { y: sr.top + sr.height / 2, kind: 'sec-cy' },
      { y: sr.top, kind: 'sec-top' },
      { y: sr.bottom, kind: 'sec-bottom' }
    ];

    const isMovingFree = el.classList?.contains('f-free-ui');
    const sibSelector = isMovingFree ? '.f-free-ui' : '[data-f-el], .f-free-ui';

    secWrap.querySelectorAll(sibSelector).forEach((sib) => {
      if (!sib || sib === el || el.contains(sib) || sib.contains(el)) return;
      if (sib.getAttribute('data-selected') === 'true') return;
      if (sib.closest('.f-free-ui') && !sib.classList.contains('f-free-ui')) return;
      if (sib.getAttribute('data-locked') === 'true' || sib.closest('[data-locked="true"]')) return;
      if (sib.getAttribute('data-hidden') === 'true' || sib.closest('[data-hidden="true"]')) return;
      if (typeof getComputedStyle === 'function') {
        const cs = getComputedStyle(sib);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) {
          return;
        }
      }
      const r = sib.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || !Number.isFinite(r.left) || !Number.isFinite(r.top)) {
        return;
      }
      targetLinesX.push(
        { x: r.left, kind: 'sib-left' },
        { x: r.left + r.width / 2, kind: 'sib-cx' },
        { x: r.right, kind: 'sib-right' }
      );
      targetLinesY.push(
        { y: r.top, kind: 'sib-top' },
        { y: r.top + r.height / 2, kind: 'sib-cy' },
        { y: r.bottom, kind: 'sib-bottom' }
      );
    });

    const movingAnchorsX = [uCx, uLeft, uRight];
    let bestX = null;
    for (const anchorX of movingAnchorsX) {
      for (const tLine of targetLinesX) {
        const diff = tLine.x - anchorX;
        const abs = Math.abs(diff);
        if (abs <= threshScreen && (!bestX || abs < bestX.abs)) {
          bestX = { diff, abs, guideX: tLine.x };
        }
      }
    }

    const movingAnchorsY = [uCy, uTop, uBottom];
    let bestY = null;
    for (const anchorY of movingAnchorsY) {
      for (const tLine of targetLinesY) {
        const diff = tLine.y - anchorY;
        const abs = Math.abs(diff);
        if (abs <= threshScreen && (!bestY || abs < bestY.abs)) {
          bestY = { diff, abs, guideY: tLine.y };
        }
      }
    }

    const gx = document.getElementById('st-snap-guide-x');
    const gy = document.getElementById('st-snap-guide-y');
    if (gx) {
      if (bestX) {
        gx.style.display = 'block';
        gx.style.left = `${bestX.guideX}px`;
      } else {
        gx.style.display = 'none';
      }
    }
    if (gy) {
      if (bestY) {
        gy.style.display = 'block';
        gy.style.top = `${bestY.guideY}px`;
      } else {
        gy.style.display = 'none';
      }
    }

    return {
      dxScreen: bestX ? bestX.diff : 0,
      dyScreen: bestY ? bestY.diff : 0,
      snappedX: Boolean(bestX),
      snappedY: Boolean(bestY)
    };
  }

  /* ==========================================================================
     5. LOGICAL ELEMENT MOVE HELPER & 1-CLICK ALIGN (6) / DISTRIBUTE (2) (F12)
     ========================================================================== */
  function moveElementByLogicalDelta(el, dxLogical, dyLogical) {
    if (!el || (!dxLogical && !dyLogical)) return;
    const s = getEngineState();
    const z = getCanvasZoom();
    const vp = s?.viewport || 'desktop';

    if (el.classList?.contains('f-free-ui')) {
      const sec = el.closest('.f-blank-sec, .f-sec-wrap') || document.getElementById('hp-root');
      const sr = sec ? sec.getBoundingClientRect() : { left: 0, top: 0, width: 1280 };
      const er = el.getBoundingClientRect();
      const swLogical = Math.max(1, sr.width / z);

      const curX =
        el.style.left && el.style.left.endsWith('px')
          ? parseFloat(el.style.left)
          : (er.left - sr.left) / z;
      const curY =
        el.style.top && el.style.top.endsWith('px')
          ? parseFloat(el.style.top)
          : (er.top - sr.top) / z;

      const nextX = Number((curX + dxLogical).toFixed(2));
      const nextY = Number((curY + dyLogical).toFixed(2));

      el.style.left = `${nextX}px`;
      el.style.top = `${nextY}px`;

      const uid = el.dataset?.uid;
      const fw = s?.freeWidgets?.find((x) => x.uid === uid);
      if (fw) {
        fw.x = nextX;
        fw.y = nextY;
        fw.yPx = Math.round(nextY);
        fw.xPct = Number(((nextX / swLogical) * 100).toFixed(4));
      }
      if (vp !== 'desktop') {
        globalRoot.FORMA_PRO.ResponsiveEngine?.setElementPatch?.(el, vp, { x: nextX, y: nextY });
      }
      return;
    }

    if (vp !== 'desktop' && globalRoot.FORMA_PRO.ResponsiveEngine) {
      const curPatch = globalRoot.FORMA_PRO.ResponsiveEngine.getElementPatch(el, vp);
      const nx = Number(((Number(curPatch.x) || 0) + dxLogical).toFixed(2));
      const ny = Number(((Number(curPatch.y) || 0) + dyLogical).toFixed(2));
      globalRoot.FORMA_PRO.ResponsiveEngine.setElementPatch(el, vp, { x: nx, y: ny });
      return;
    }

    if (s && typeof globalRoot.getElementPathInRoot === 'function') {
      const pathKey = globalRoot.getElementPathInRoot(el);
      if (!pathKey) return;
      const prev = s.uiOffsets[pathKey] || { x: 0, y: 0, scale: 1 };
      const nx = Number(((prev.x || 0) + dxLogical).toFixed(2));
      const ny = Number(((prev.y || 0) + dyLogical).toFixed(2));
      const sc = prev.scale || 1;
      s.uiOffsets[pathKey] = { ...prev, x: nx, y: ny, scale: sc };
      el.dataset.uiMoved = '1';
      if (!el.style.position) el.style.position = 'relative';
      el.style.zIndex = String(prev.zIndex || 25);
      el.style.transform = `translate3d(${nx}px, ${ny}px, 0) scale(${sc})`;
    }
  }

  function alignSelection(mode) {
    syncFreeWidgetsFromDOM();
    const els = getTopLevelSelectedElements();
    if (els.length === 0) return false;

    if (typeof globalRoot.pushUndoSnapshot === 'function') {
      globalRoot.pushUndoSnapshot();
    }

    const z = getCanvasZoom();

    if (els.length === 1) {
      const el = els[0];
      const container =
        el.closest('.f-blank-sec, .f-sec, .f-sec-wrap') || document.getElementById('hp-root');
      if (!container) return false;
      const cr = container.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      let dxScreen = 0;
      let dyScreen = 0;

      if (mode === 'left') dxScreen = cr.left - er.left;
      else if (mode === 'center-x') dxScreen = cr.left + cr.width / 2 - (er.left + er.width / 2);
      else if (mode === 'right') dxScreen = cr.right - er.right;
      else if (mode === 'top') dyScreen = cr.top - er.top;
      else if (mode === 'center-y') dyScreen = cr.top + cr.height / 2 - (er.top + er.height / 2);
      else if (mode === 'bottom') dyScreen = cr.bottom - er.bottom;

      moveElementByLogicalDelta(el, dxScreen / z, dyScreen / z);
    } else {
      const items = els.map((el) => ({ el, r: el.getBoundingClientRect() }));
      const minLeft = Math.min(...items.map((i) => i.r.left));
      const maxRight = Math.max(...items.map((i) => i.r.right));
      const midX = (minLeft + maxRight) / 2;
      const minTop = Math.min(...items.map((i) => i.r.top));
      const maxBottom = Math.max(...items.map((i) => i.r.bottom));
      const midY = (minTop + maxBottom) / 2;

      items.forEach(({ el, r }) => {
        let dxScreen = 0;
        let dyScreen = 0;
        if (mode === 'left') dxScreen = minLeft - r.left;
        else if (mode === 'center-x') dxScreen = midX - (r.left + r.width / 2);
        else if (mode === 'right') dxScreen = maxRight - r.right;
        else if (mode === 'top') dyScreen = minTop - r.top;
        else if (mode === 'center-y') dyScreen = midY - (r.top + r.height / 2);
        else if (mode === 'bottom') dyScreen = maxBottom - r.bottom;

        moveElementByLogicalDelta(el, dxScreen / z, dyScreen / z);
      });
    }

    syncFreeWidgetsFromDOM();
    if (typeof globalRoot.syncSelectedUIOverlay === 'function') {
      globalRoot.syncSelectedUIOverlay();
    }
    globalRoot.FORMA_PRO.ResponsiveEngine?.syncInspectorInputsFromSelected?.();
    globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
    return true;
  }

  function distributeSelection(axis) {
    syncFreeWidgetsFromDOM();
    const els = getTopLevelSelectedElements();
    if (els.length < 3) return false;

    if (typeof globalRoot.pushUndoSnapshot === 'function') {
      globalRoot.pushUndoSnapshot();
    }

    const z = getCanvasZoom();
    const items = els.map((el, idx) => ({ el, idx, r: el.getBoundingClientRect() }));

    if (axis === 'h' || axis === 'horizontal') {
      items.sort((a, b) => a.r.left - b.r.left || a.r.left + a.r.width / 2 - (b.r.left + b.r.width / 2) || a.idx - b.idx);
      const minLeft = Math.min(...items.map((i) => i.r.left));
      const maxRight = Math.max(...items.map((i) => i.r.right));
      const totalSpan = maxRight - minLeft;
      const sumWidths = items.reduce((acc, i) => acc + i.r.width, 0);
      const gap = (totalSpan - sumWidths) / (items.length - 1);

      let cursor = minLeft;
      items.forEach((item, i) => {
        const targetLeft =
          i === 0
            ? minLeft
            : i === items.length - 1
            ? maxRight - item.r.width
            : cursor;
        const dxScreen = targetLeft - item.r.left;
        if (Number.isFinite(dxScreen)) {
          moveElementByLogicalDelta(item.el, dxScreen / z, 0);
        }
        cursor = targetLeft + item.r.width + gap;
      });
    } else if (axis === 'v' || axis === 'vertical') {
      items.sort((a, b) => a.r.top - b.r.top || a.r.top + a.r.height / 2 - (b.r.top + b.r.height / 2) || a.idx - b.idx);
      const minTop = Math.min(...items.map((i) => i.r.top));
      const maxBottom = Math.max(...items.map((i) => i.r.bottom));
      const totalSpan = maxBottom - minTop;
      const sumHeights = items.reduce((acc, i) => acc + i.r.height, 0);
      const gap = (totalSpan - sumHeights) / (items.length - 1);

      let cursor = minTop;
      items.forEach((item, i) => {
        const targetTop =
          i === 0
            ? minTop
            : i === items.length - 1
            ? maxBottom - item.r.height
            : cursor;
        const dyScreen = targetTop - item.r.top;
        if (Number.isFinite(dyScreen)) {
          moveElementByLogicalDelta(item.el, 0, dyScreen / z);
        }
        cursor = targetTop + item.r.height + gap;
      });
    }

    syncFreeWidgetsFromDOM();
    if (typeof globalRoot.syncSelectedUIOverlay === 'function') {
      globalRoot.syncSelectedUIOverlay();
    }
    globalRoot.FORMA_PRO.ResponsiveEngine?.syncInspectorInputsFromSelected?.();
    globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
    return true;
  }

  /* ==========================================================================
     6. EXPORT PUBLIC INTERFACE ON window.FORMA_PRO.SelectionEngine
     ========================================================================== */
  const SelectionEngine = {
    getElementKey,
    findElementByKey,
    resolveSelectableTarget,
    filterTopLevelElements,
    syncFreeWidgetsFromDOM,
    syncDOMSelectionAttributes,
    getSelection,
    getSelectedElements,
    getTopLevelSelectedElements,
    setSelection,
    selectSingle,
    toggleSelection,
    clearSelection,
    restoreSelectionAfterRender,
    isSelectedElement,
    startMarqueeSelection,
    updateMarqueeSelection,
    finishMarqueeSelection,
    isMarqueeActive: () => Boolean(activeMarquee),
    hideMagneticSnapGuides,
    computeMagneticSnap,
    moveElementByLogicalDelta,
    alignSelection,
    distributeSelection
  };

  globalRoot.FORMA_PRO.SelectionEngine = SelectionEngine;
})();
