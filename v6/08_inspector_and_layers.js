/* ==========================================================================
   FORMA STUDIO Pro — M3 RIGHT PROPERTY INSPECTOR (F14) & LAYER TREE NAVIGATOR (F16)
   ========================================================================== */
(function () {
  'use strict';

  const globalRoot = typeof window !== 'undefined' ? window : globalThis;
  globalRoot.FORMA_PRO = globalRoot.FORMA_PRO || {};

  let activeInspectorTab = 'design';
  let lastAppliedSig = '';
  let lastAppliedAt = 0;

  function getEngineState() {
    return globalRoot.state || (typeof state !== 'undefined' ? state : null);
  }

  function cssEscapeAttrVal(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function rgbToHex(rgbStr, fallback = '#1e293b') {
    if (!rgbStr || typeof rgbStr !== 'string') return fallback;
    const trimmed = rgbStr.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();
    if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
      return (
        '#' +
        trimmed[1] +
        trimmed[1] +
        trimmed[2] +
        trimmed[2] +
        trimmed[3] +
        trimmed[3]
      ).toLowerCase();
    }
    const m = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!m) return fallback;
    const r = Math.max(0, Math.min(255, Number(m[1]) || 0));
    const g = Math.max(0, Math.min(255, Number(m[2]) || 0));
    const b = Math.max(0, Math.min(255, Number(m[3]) || 0));
    return (
      '#' +
      [r, g, b]
        .map((n) => n.toString(16).padStart(2, '0'))
        .join('')
        .toLowerCase()
    );
  }

  function sanitizeLayerName(rawStr, fallbackStr) {
    const stripped = String(rawStr ?? '')
      .replace(/<[^>]*>/g, '')
      .replace(/[<>]/g, '')
      .trim();
    if (!stripped) {
      return (
        String(fallbackStr || 'Layer')
          .replace(/<[^>]*>/g, '')
          .replace(/[<>]/g, '')
          .trim() || 'Layer'
      );
    }
    return stripped.slice(0, 80);
  }

  function stripDuplicateSidebarLayerTreeAttr() {
    if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return;
    document.querySelectorAll('#st-sidebar [data-testid="layer-tree"]')?.forEach?.((el) => {
      el.removeAttribute?.('data-testid');
    });
  }

  /* ==========================================================================
     1. RIGHT INSPECTOR MOUNT & 26 DESIGN CONTROLS (F14)
     ========================================================================== */
  function renderInspector() {
    if (typeof document === 'undefined') return;
    if (globalRoot.FORMA_PRO.ClientMode?.isClientMode?.()) return;
    stripDuplicateSidebarLayerTreeAttr();

    const panel = document.getElementById('st-right-panel');
    if (!panel || typeof panel.querySelector !== 'function') return;
    panel.style.display = '';

    if (!panel.querySelector('[data-testid="insp-x"]') || !panel.querySelector('#st-insp-pane-layers [data-testid="layer-tree"]')) {
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
        <div id="st-insp-tabs" class="st-insp-tabs">
          <button type="button" data-testid="tab-design" class="st-insp-tab is-active" onclick="FORMA_PRO.InspectorUI.switchTab('design')">Design</button>
          <button type="button" data-testid="tab-interact" class="st-insp-tab" onclick="FORMA_PRO.InspectorUI.switchTab('interact')">Interact</button>
          <button type="button" data-testid="tab-layers" class="st-insp-tab" onclick="FORMA_PRO.InspectorUI.switchTab('layers')">Layers</button>
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
                <option value="'Gowun Batang', serif">Gowun Batang</option>
                <option value="'Black Han Sans', sans-serif">Black Han Sans</option>
                <option value="'Hahmlet', serif">Hahmlet</option>
                <option value="'IBM Plex Sans KR', sans-serif">IBM Plex Sans KR</option>
                <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
                <option value="'Playfair Display', serif">Playfair Display</option>
                <option value="'Syne', sans-serif">Syne</option>
                <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
              </select>
            </div>
            <div class="st-insp-grid2">
              <div class="st-insp-field"><label>Sz</label><input type="number" data-testid="insp-font-size" value="16" /></div>
              <div class="st-insp-field">
                <label>Wt</label>
                <select data-testid="insp-font-weight">
                  <option value="300">300</option>
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
              <option value="slide-left">slide-left</option>
            </select>
          </div>
        </div>
        <div id="st-insp-pane-layers" style="display:none;" class="st-insp-sec">
          <div class="st-insp-sec-title">Page Layers</div>
          <div id="st-insp-layer-tree" data-testid="layer-tree" role="tree" aria-label="Layer Tree"></div>
        </div>
      `;

      bindDesignControlListeners(panel);
      globalRoot.FORMA_PRO.InteractionsEngine?.bindInteractControlListeners?.(panel);
    }

    switchTab(activeInspectorTab);
    renderLayerTree();
    syncSelectionUI();
  }

  function bindDesignControlListeners(panel) {
    const fieldMap = {
      'insp-x': (v) => ({ x: Number.isFinite(Number(v)) ? Number(v) : 0 }),
      'insp-y': (v) => ({ y: Number.isFinite(Number(v)) ? Number(v) : 0 }),
      'insp-w': (v) => ({ width: Math.max(28, Number.isFinite(Number(v)) ? Number(v) : 28) }),
      'insp-h': (v) => ({ height: Math.max(20, Number.isFinite(Number(v)) ? Number(v) : 20) }),
      'insp-rotate': (v) => ({ rotate: Number.isFinite(Number(v)) ? Number(v) : 0 }),
      'insp-zindex': (v) => ({ zIndex: Number.isFinite(Number(v)) ? Math.round(Number(v)) : 25 }),
      'insp-pad-top': (v) => ({ padTop: Math.max(0, Number.isFinite(Number(v)) ? Number(v) : 0) }),
      'insp-pad-right': (v) => ({ padRight: Math.max(0, Number.isFinite(Number(v)) ? Number(v) : 0) }),
      'insp-pad-bottom': (v) => ({ padBottom: Math.max(0, Number.isFinite(Number(v)) ? Number(v) : 0) }),
      'insp-pad-left': (v) => ({ padLeft: Math.max(0, Number.isFinite(Number(v)) ? Number(v) : 0) }),
      'insp-font-family': (v) => ({ fontFamily: String(v || 'var(--font-display)') }),
      'insp-font-size': (v) => ({ fontSize: Math.max(8, Number.isFinite(Number(v)) ? Number(v) : 16) }),
      'insp-font-weight': (v) => ({ fontWeight: String(v || '400') }),
      'insp-line-height': (v) => ({ lineHeight: Math.max(0.8, Number.isFinite(Number(v)) ? Number(v) : 1.4) }),
      'insp-letter-spacing': (v) => ({ letterSpacing: Number.isFinite(Number(v)) ? Number(v) : 0 }),
      'insp-text-align': (v) => ({ textAlign: String(v || 'left') }),
      'insp-text-color': (v) => ({ color: String(v || '#1e293b') }),
      'insp-fill-mode': (v) => ({ fillMode: String(v || 'solid') }),
      'insp-bg-color': (v) => ({ bgColor: String(v || '#0f766e'), fillMode: 'solid' }),
      'insp-grad-color-1': (v) => ({ gradColor1: String(v || '#0ea5e9') }),
      'insp-grad-color-2': (v) => ({ gradColor2: String(v || '#6366f1') }),
      'insp-grad-angle': (v) => ({ gradAngle: Number.isFinite(Number(v)) ? Number(v) : 135 }),
      'insp-opacity': (v) => {
        const num = Number(v);
        if (!Number.isFinite(num)) return { opacity: 1 };
        const clamped = num <= 0 ? 0 : num <= 1 ? num : num <= 100 ? num / 100 : 1;
        return { opacity: clamped };
      },
      'insp-border-width': (v) => ({ borderWidth: Math.max(0, Number.isFinite(Number(v)) ? Number(v) : 0) }),
      'insp-border-style': (v) => ({ borderStyle: String(v || 'solid') }),
      'insp-border-color': (v) => ({ borderColor: String(v || '#38bdf8') }),
      'insp-border-radius': (v) => ({ borderRadius: Math.max(0, Number.isFinite(Number(v)) ? Number(v) : 0) }),
      'insp-shadow-blur': (v) => ({ shadowBlur: Math.max(0, Number.isFinite(Number(v)) ? Number(v) : 0) }),
      'insp-shadow-preset': (v) => ({
        shadowPreset: String(v || 'none'),
        shadowBlur: null,
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

      const handleControlChange = () => {
        const selEngine = globalRoot.FORMA_PRO.SelectionEngine;
        const selKeys = selEngine?.getSelection?.() || [];
        // Guard T2-F14-04: when 0 elements are selected, do NOT mutate anything!
        if (selKeys.length === 0) return;

        const s = getEngineState();
        const vp = s?.viewport || 'desktop';
        const sig = `${tid}::${vp}::${selKeys.join(',')}::${inp.value}`;
        const now = Date.now();
        if (sig === lastAppliedSig && now - lastAppliedAt < 180) {
          return;
        }
        lastAppliedSig = sig;
        lastAppliedAt = now;

        const patch = mapper(inp.value);
        if (typeof globalRoot.pushUndoSnapshot === 'function') {
          globalRoot.pushUndoSnapshot();
        }
        selKeys.forEach((k) => {
          if (k) {
            globalRoot.FORMA_PRO.ResponsiveEngine?.setElementPatch?.(k, vp, patch);
          }
        });
      };

      inp.addEventListener('change', handleControlChange);
      if (inp.tagName === 'SELECT' || inp.type === 'color') {
        inp.addEventListener('input', handleControlChange);
      }
    });
  }

  function switchTab(tab) {
    if (!['design', 'interact', 'layers'].includes(tab)) return;
    activeInspectorTab = tab;
    if (typeof document === 'undefined') return;
    const panel = document.getElementById('st-right-panel');
    if (!panel) return;
    ['design', 'interact', 'layers'].forEach((k) => {
      panel.querySelector(`[data-testid="tab-${k}"]`)?.classList.toggle('is-active', k === tab);
      const pane = document.getElementById(`st-insp-pane-${k}`);
      if (pane) pane.style.display = k === tab ? '' : 'none';
    });
    if (tab === 'layers') {
      renderLayerTree();
      syncSelectionUI();
    }
  }

  /* ==========================================================================
     2. LAYER TREE NAVIGATOR ([data-testid="layer-tree"]) (F16)
     ========================================================================== */
  function getDefaultElementLabel(el, key) {
    if (!el) return key || 'Layer';
    const customAttr = el.getAttribute('data-layer-name');
    if (customAttr && customAttr.trim()) return customAttr.trim();
    const s = getEngineState();
    const roName = s?.responsiveOverrides?.desktop?.[key]?.layerName;
    if (roName && String(roName).trim()) return String(roName).trim();
    if (String(key).startsWith('fw::')) {
      const uid = String(key).slice(4);
      const fw = (s?.freeWidgets || []).find((x) => x.uid === uid);
      if (fw?.layerName && String(fw.layerName).trim()) return String(fw.layerName).trim();
    }
    const tag = (el.tagName || 'div').toLowerCase();
    const textSnippet = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 22);
    if (String(key).startsWith('fw::')) {
      return textSnippet ? `Free · ${textSnippet}` : `Free (${key.slice(4, 14)})`;
    }
    if (el.classList?.contains('f-btn')) return textSnippet ? `Button · ${textSnippet}` : 'Button';
    if (el.classList?.contains('f-card')) return textSnippet ? `Card · ${textSnippet}` : 'Card';
    if (el.classList?.contains('f-media') || tag === 'img') return 'Media / Image';
    if (el.classList?.contains('f-bdg')) return textSnippet ? `Badge · ${textSnippet}` : 'Badge';
    if (/^h[1-4]$/.test(tag)) return textSnippet ? `${tag.toUpperCase()} · ${textSnippet}` : tag.toUpperCase();
    return textSnippet ? `${tag} · ${textSnippet}` : key;
  }

  function getDefaultSectionLabel(secEl, secKey) {
    const s = getEngineState();
    const roName =
      s?.responsiveOverrides?.desktop?.[secKey]?.layerName ||
      s?.responsiveOverrides?.desktop?.[`sec-${secKey}`]?.layerName ||
      s?.customSections?.[secKey]?.layerName;
    if (roName && String(roName).trim()) return String(roName).trim();
    if (s?.customSections?.[secKey]?.type === 'blank') {
      return `Blank Section (${secKey})`;
    }
    return `Section · ${String(secKey).toUpperCase()}`;
  }

  function isElementHiddenNow(el, key) {
    if (!el) return false;
    const s = getEngineState();
    if (el.getAttribute('data-hidden') === 'true') return true;
    if (s?.responsiveOverrides?.desktop?.[key]?.hidden === true) return true;
    if (String(key).startsWith('fw::')) {
      const uid = String(key).slice(4);
      const fw = (s?.freeWidgets || []).find((x) => x.uid === uid);
      if (fw?.hidden) return true;
    } else if (typeof globalRoot.getElementPathInRoot === 'function') {
      const pk = globalRoot.getElementPathInRoot(el);
      if (pk && s?.uiOffsets?.[pk]?.hidden) return true;
    }
    return false;
  }

  function isElementLockedNow(el, key) {
    if (!el) return false;
    const s = getEngineState();
    if (el.getAttribute('data-locked') === 'true') return true;
    if (s?.responsiveOverrides?.desktop?.[key]?.locked === true) return true;
    if (String(key).startsWith('fw::')) {
      const uid = String(key).slice(4);
      const fw = (s?.freeWidgets || []).find((x) => x.uid === uid);
      if (fw?.locked) return true;
    } else if (typeof globalRoot.getElementPathInRoot === 'function') {
      const pk = globalRoot.getElementPathInRoot(el);
      if (pk && s?.uiOffsets?.[pk]?.locked) return true;
    }
    return false;
  }

  function applyStoredLayerStatesToDOM(rootEl) {
    if (typeof document === 'undefined') return;
    const root = rootEl || document.getElementById('hp-root');
    if (!root || typeof root.querySelectorAll !== 'function') return;
    const s = getEngineState();
    const desktopMap = s?.responsiveOverrides?.desktop || {};

    root.querySelectorAll('[data-f-el]').forEach((el) => {
      const key = el.getAttribute('data-f-el');
      if (!key) return;
      const patch = desktopMap[key] || {};
      const hidden = isElementHiddenNow(el, key);
      const locked = isElementLockedNow(el, key);

      if (hidden) {
        el.setAttribute('data-hidden', 'true');
        el.style.display = 'none';
      } else {
        el.removeAttribute('data-hidden');
        if (el.style.display === 'none' && patch.hidden === false) {
          el.style.display = '';
        }
      }

      if (locked) {
        el.setAttribute('data-locked', 'true');
      } else {
        el.removeAttribute('data-locked');
      }

      if (patch.layerName) {
        el.setAttribute('data-layer-name', String(patch.layerName));
      }
    });
  }

  function renderLayerTree() {
    if (typeof document === 'undefined' || typeof document.querySelector !== 'function') return;
    if (globalRoot.FORMA_PRO.ClientMode?.isClientMode?.()) return;
    stripDuplicateSidebarLayerTreeAttr();

    const tree = document.querySelector('#st-right-panel [data-testid="layer-tree"]');
    const root = document.getElementById('hp-root');
    if (!tree || !root || typeof root.querySelectorAll !== 'function') return;

    // Do NOT clobber an active inline rename input inside the layer tree!
    if (tree.querySelector('input.st-layer-rename-input')) {
      return;
    }

    globalRoot.FORMA_PRO.ResponsiveEngine?.stampSelectableElements?.(root);
    applyStoredLayerStatesToDOM(root);
    globalRoot.FORMA_PRO.InteractionsEngine?.applyInteractionsToDOM?.(root);

    const selSet = new Set(globalRoot.FORMA_PRO.SelectionEngine?.getSelection?.() || []);
    const secWraps = Array.from(root.querySelectorAll('.f-sec-wrap'));
    const frag = document.createDocumentFragment();

    secWraps.forEach((secEl, idx) => {
      const secKey =
        secEl.dataset?.secKey ||
        secEl.getAttribute('data-sec-key') ||
        (secEl.id ? secEl.id.replace(/^sec-/, '') : `sec-${idx}`);
      const secLabel = getDefaultSectionLabel(secEl, secKey);

      const secRow = document.createElement('div');
      secRow.className = 'st-layer-row is-section-row';
      secRow.setAttribute('role', 'treeitem');
      secRow.setAttribute('data-layer-id', secKey);
      secRow.setAttribute('data-sec-key', secKey);
      secRow.setAttribute('data-layer-kind', 'section');

      const secIcon = document.createElement('span');
      secIcon.className = 'st-layer-icon';
      secIcon.textContent = '▾';

      const secLblSpan = document.createElement('span');
      secLblSpan.className = 'st-layer-label layer-name';
      secLblSpan.textContent = secLabel;

      const secActions = document.createElement('div');
      secActions.className = 'st-layer-actions';

      const upBtn = document.createElement('button');
      upBtn.type = 'button';
      upBtn.className = 'st-layer-btn';
      upBtn.setAttribute('data-testid', 'layer-up');
      upBtn.title = 'Move Section Up';
      upBtn.textContent = '↑';
      upBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveLayerOrder(secKey, -1, true);
      });

      const downBtn = document.createElement('button');
      downBtn.type = 'button';
      downBtn.className = 'st-layer-btn';
      downBtn.setAttribute('data-testid', 'layer-down');
      downBtn.title = 'Move Section Down';
      downBtn.textContent = '↓';
      downBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        moveLayerOrder(secKey, 1, true);
      });

      secActions.appendChild(upBtn);
      secActions.appendChild(downBtn);
      secRow.appendChild(secIcon);
      secRow.appendChild(secLblSpan);
      secRow.appendChild(secActions);

      secRow.addEventListener('click', (e) => {
        if (e.target.closest('button, input')) return;
        if (e.detail >= 2) {
          startInlineLayerRename(secRow, secKey, true);
          return;
        }
        secEl.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
      });
      secRow.addEventListener('dblclick', (e) => {
        if (e.target.closest('button, input')) return;
        e.preventDefault();
        e.stopPropagation();
        startInlineLayerRename(secRow, secKey, true);
      });

      frag.appendChild(secRow);

      // Child elements inside this section
      const childEls = Array.from(secEl.querySelectorAll('[data-f-el]')).filter((el) => {
        if (el.closest('.f-free-ui') && !el.classList.contains('f-free-ui')) return false;
        return true;
      });

      childEls.forEach((el) => {
        const key = el.getAttribute('data-f-el');
        if (!key) return;
        const hidden = isElementHiddenNow(el, key);
        const locked = isElementLockedNow(el, key);
        const isSel = selSet.has(key);
        const label = getDefaultElementLabel(el, key);

        const row = document.createElement('div');
        row.className =
          'st-layer-row is-element-row' +
          (isSel ? ' is-selected is-active' : '') +
          (hidden ? ' is-hidden-layer' : '') +
          (locked ? ' is-locked-layer' : '');
        row.setAttribute('role', 'treeitem');
        row.setAttribute('data-layer-id', key);
        row.setAttribute('data-layer-kind', 'element');
        row.setAttribute('aria-selected', isSel ? 'true' : 'false');
        if (isSel) row.setAttribute('data-selected', 'true');

        const icon = document.createElement('span');
        icon.className = 'st-layer-icon';
        icon.textContent = String(key).startsWith('fw::') ? '✦' : '◇';

        const lblSpan = document.createElement('span');
        lblSpan.className = 'st-layer-label layer-name';
        lblSpan.textContent = label;

        const actions = document.createElement('div');
        actions.className = 'st-layer-actions';

        const visBtn = document.createElement('button');
        visBtn.type = 'button';
        visBtn.className = 'st-layer-btn' + (hidden ? ' is-on' : '');
        visBtn.setAttribute('data-testid', 'layer-vis-toggle');
        visBtn.title = hidden ? 'Show Layer' : 'Hide Layer';
        visBtn.textContent = hidden ? '🙈' : '👁';
        visBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleLayerVisibility(key);
        });

        const lockBtn = document.createElement('button');
        lockBtn.type = 'button';
        lockBtn.className = 'st-layer-btn' + (locked ? ' is-on' : '');
        lockBtn.setAttribute('data-testid', 'layer-lock-toggle');
        lockBtn.title = locked ? 'Unlock Layer' : 'Lock Layer';
        lockBtn.textContent = locked ? '🔒' : '🔓';
        lockBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleLayerLock(key);
        });

        const elUpBtn = document.createElement('button');
        elUpBtn.type = 'button';
        elUpBtn.className = 'st-layer-btn';
        elUpBtn.setAttribute('data-testid', 'layer-up');
        elUpBtn.title = 'Bring Forward';
        elUpBtn.textContent = '↑';
        elUpBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          moveLayerOrder(key, -1, false);
        });

        const elDownBtn = document.createElement('button');
        elDownBtn.type = 'button';
        elDownBtn.className = 'st-layer-btn';
        elDownBtn.setAttribute('data-testid', 'layer-down');
        elDownBtn.title = 'Send Backward';
        elDownBtn.textContent = '↓';
        elDownBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          moveLayerOrder(key, 1, false);
        });

        actions.appendChild(visBtn);
        actions.appendChild(lockBtn);
        actions.appendChild(elUpBtn);
        actions.appendChild(elDownBtn);

        row.appendChild(icon);
        row.appendChild(lblSpan);
        row.appendChild(actions);

        row.addEventListener('click', (e) => {
          if (e.target.closest('button, input')) return;
          if (e.detail >= 2) {
            startInlineLayerRename(row, key, false);
            return;
          }
          const targetEl = root.querySelector(`[data-f-el="${cssEscapeAttrVal(key)}"]`);
          if (!targetEl || isElementLockedNow(targetEl, key) || isElementHiddenNow(targetEl, key)) {
            return;
          }
          if (e.shiftKey) {
            globalRoot.FORMA_PRO.SelectionEngine?.toggleSelection?.(targetEl);
          } else {
            globalRoot.FORMA_PRO.SelectionEngine?.selectSingle?.(targetEl);
          }
        });

        row.addEventListener('dblclick', (e) => {
          if (e.target.closest('button, input')) return;
          e.preventDefault();
          e.stopPropagation();
          startInlineLayerRename(row, key, false);
        });

        frag.appendChild(row);
      });
    });

    tree.innerHTML = '';
    tree.appendChild(frag);
  }

  /* ==========================================================================
     3. INLINE LAYER RENAME, VISIBILITY, LOCK & REORDER (F16)
     ========================================================================== */
  function startInlineLayerRename(rowEl, layerId, isSection = false) {
    if (!rowEl || !layerId || typeof document === 'undefined') return;
    const existingInp = rowEl.querySelector('input.st-layer-rename-input');
    if (existingInp) {
      existingInp.focus?.();
      return;
    }

    const labelEl = rowEl.querySelector('.st-layer-label');
    const prevName = (labelEl ? (labelEl.dataset.origName || labelEl.textContent) : rowEl.textContent || '').trim() || layerId;

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'st-layer-rename-input';
    inp.value = prevName;
    inp.setAttribute('aria-label', 'Layer Name');

    if (labelEl) {
      labelEl.dataset.origName = prevName;
      labelEl.style.display = 'none';
      rowEl.insertBefore(inp, labelEl.nextSibling);
    } else {
      rowEl.insertBefore(inp, rowEl.firstChild);
    }

    let finished = false;
    const finishRename = (shouldCommit) => {
      if (finished) return;
      finished = true;
      const rawVal = inp.value;
      inp.remove();
      if (labelEl) {
        labelEl.style.display = '';
      }
      if (shouldCommit) {
        commitLayerRename(layerId, rawVal, prevName, isSection, labelEl);
      }
    };

    inp.addEventListener('input', (e) => {
      e.stopPropagation();
      if (labelEl) {
        labelEl.textContent = sanitizeLayerName(inp.value, prevName);
      }
    });
    inp.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        finishRename(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (labelEl) labelEl.textContent = prevName;
        finishRename(false);
      }
    });
    inp.addEventListener('change', (e) => {
      e.stopPropagation();
      finishRename(true);
    });
    inp.addEventListener('blur', () => {
      finishRename(true);
    });

    inp.focus?.();
    inp.select?.();
  }

  function commitLayerRename(layerId, rawName, fallbackName, isSection = false, labelEl = null) {
    const cleanName = sanitizeLayerName(rawName, fallbackName);
    if (labelEl) {
      labelEl.textContent = cleanName;
    }

    const s = getEngineState();
    if (!s) return cleanName;
    if (typeof globalRoot.pushUndoSnapshot === 'function') {
      globalRoot.pushUndoSnapshot();
    }

    if (!s.responsiveOverrides) {
      s.responsiveOverrides = { desktop: {}, tablet: {}, mobile: {} };
    }
    if (!s.responsiveOverrides.desktop) s.responsiveOverrides.desktop = {};
    s.responsiveOverrides.desktop[layerId] = {
      ...(s.responsiveOverrides.desktop[layerId] || {}),
      layerName: cleanName
    };

    if (isSection) {
      if (s.customSections?.[layerId]) {
        s.customSections[layerId].layerName = cleanName;
      }
    } else if (String(layerId).startsWith('fw::')) {
      const uid = String(layerId).slice(4);
      const fw = (s.freeWidgets || []).find((x) => x.uid === uid);
      if (fw) fw.layerName = cleanName;
    }

    if (typeof document !== 'undefined') {
      const root = document.getElementById('hp-root');
      const el = root?.querySelector(`[data-f-el="${cssEscapeAttrVal(layerId)}"]`);
      if (el) el.setAttribute('data-layer-name', cleanName);
    }

    globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
    return cleanName;
  }

  function toggleLayerVisibility(layerId) {
    if (!layerId || typeof document === 'undefined') return false;
    const root = document.getElementById('hp-root');
    const el = root?.querySelector(`[data-f-el="${cssEscapeAttrVal(layerId)}"]`);
    const s = getEngineState();
    if (!s) return false;

    const currentlyHidden = isElementHiddenNow(el, layerId);
    const nextHidden = !currentlyHidden;

    if (typeof globalRoot.pushUndoSnapshot === 'function') {
      globalRoot.pushUndoSnapshot();
    }

    if (!s.responsiveOverrides) {
      s.responsiveOverrides = { desktop: {}, tablet: {}, mobile: {} };
    }
    ['desktop', 'tablet', 'mobile'].forEach((vp) => {
      if (!s.responsiveOverrides[vp]) s.responsiveOverrides[vp] = {};
      if (nextHidden) {
        if (vp === 'desktop') {
          s.responsiveOverrides.desktop[layerId] = {
            ...(s.responsiveOverrides.desktop[layerId] || {}),
            hidden: true
          };
        }
      } else if (s.responsiveOverrides[vp]?.[layerId]) {
        delete s.responsiveOverrides[vp][layerId].hidden;
      }
    });

    if (String(layerId).startsWith('fw::')) {
      const uid = String(layerId).slice(4);
      const fw = (s.freeWidgets || []).find((x) => x.uid === uid);
      if (fw) fw.hidden = nextHidden;
    } else if (el && typeof globalRoot.getElementPathInRoot === 'function') {
      const pk = globalRoot.getElementPathInRoot(el);
      if (pk) {
        if (nextHidden) {
          s.uiOffsets[pk] = { ...(s.uiOffsets[pk] || {}), hidden: true };
        } else if (s.uiOffsets[pk]) {
          delete s.uiOffsets[pk].hidden;
        }
      }
    }

    if (el) {
      if (nextHidden) {
        el.setAttribute('data-hidden', 'true');
        el.style.display = 'none';
        if (globalRoot.FORMA_PRO.SelectionEngine?.isSelectedElement?.(el)) {
          globalRoot.FORMA_PRO.SelectionEngine.toggleSelection(el);
        }
      } else {
        el.removeAttribute('data-hidden');
        el.style.display = '';
      }
    }

    globalRoot.FORMA_PRO.ResponsiveEngine?.applyResponsiveState?.(root);
    renderLayerTree();
    syncSelectionUI();
    globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
    return nextHidden;
  }

  function toggleLayerLock(layerId) {
    if (!layerId || typeof document === 'undefined') return false;
    const root = document.getElementById('hp-root');
    const el = root?.querySelector(`[data-f-el="${cssEscapeAttrVal(layerId)}"]`);
    const s = getEngineState();
    if (!s) return false;

    const currentlyLocked = isElementLockedNow(el, layerId);
    const nextLocked = !currentlyLocked;

    if (typeof globalRoot.pushUndoSnapshot === 'function') {
      globalRoot.pushUndoSnapshot();
    }

    if (!s.responsiveOverrides) {
      s.responsiveOverrides = { desktop: {}, tablet: {}, mobile: {} };
    }
    if (!s.responsiveOverrides.desktop) s.responsiveOverrides.desktop = {};
    if (nextLocked) {
      s.responsiveOverrides.desktop[layerId] = {
        ...(s.responsiveOverrides.desktop[layerId] || {}),
        locked: true
      };
    } else if (s.responsiveOverrides.desktop[layerId]) {
      delete s.responsiveOverrides.desktop[layerId].locked;
    }

    if (String(layerId).startsWith('fw::')) {
      const uid = String(layerId).slice(4);
      const fw = (s.freeWidgets || []).find((x) => x.uid === uid);
      if (fw) fw.locked = nextLocked;
    } else if (el && typeof globalRoot.getElementPathInRoot === 'function') {
      const pk = globalRoot.getElementPathInRoot(el);
      if (pk) {
        if (nextLocked) {
          s.uiOffsets[pk] = { ...(s.uiOffsets[pk] || {}), locked: true };
        } else if (s.uiOffsets[pk]) {
          delete s.uiOffsets[pk].locked;
        }
      }
    }

    if (el) {
      if (nextLocked) {
        el.setAttribute('data-locked', 'true');
        if (globalRoot.FORMA_PRO.SelectionEngine?.isSelectedElement?.(el)) {
          globalRoot.FORMA_PRO.SelectionEngine.toggleSelection(el);
        }
        if (typeof selectedCanvasEl !== 'undefined' && selectedCanvasEl === el) {
          globalRoot.clearSelectedCanvasUI?.();
        }
      } else {
        el.removeAttribute('data-locked');
      }
    }

    renderLayerTree();
    syncSelectionUI();
    globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
    return nextLocked;
  }

  function moveLayerOrder(layerId, dir, isSection = false) {
    const s = getEngineState();
    if (!s || !layerId) return false;
    const cleanSecKey = String(layerId).replace(/^sec-/, '');

    if (
      isSection ||
      (Array.isArray(s.secOrder) && s.secOrder.includes(cleanSecKey) && !String(layerId).includes('::'))
    ) {
      const enabledSecs = (s.secOrder || []).filter((k) => s.secEnabled?.[k]);
      const curIdx = enabledSecs.indexOf(cleanSecKey);
      const targetIdx = curIdx + (dir < 0 ? -1 : 1);
      // T2-F16-01: Out-of-bounds move on top-most or bottom-most section is a safe no-op
      if (curIdx < 0 || targetIdx < 0 || targetIdx >= enabledSecs.length) {
        return false;
      }

      if (typeof globalRoot.pushUndoSnapshot === 'function') {
        globalRoot.pushUndoSnapshot();
      }

      const swapped = [...enabledSecs];
      const tmp = swapped[curIdx];
      swapped[curIdx] = swapped[targetIdx];
      swapped[targetIdx] = tmp;

      let enabledPtr = 0;
      s.secOrder = (s.secOrder || []).map((k) => {
        if (s.secEnabled?.[k]) {
          return swapped[enabledPtr++];
        }
        return k;
      });

      if (typeof globalRoot.renderLiveWebsite === 'function') {
        globalRoot.renderLiveWebsite();
      }
      renderLayerTree();
      globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
      return true;
    }

    // Element z-index reorder
    if (typeof document === 'undefined') return false;
    const root = document.getElementById('hp-root');
    const el = root?.querySelector(`[data-f-el="${cssEscapeAttrVal(layerId)}"]`);
    if (!el) return false;

    const secWrap = el.closest('.f-sec-wrap') || root;
    const sibs = Array.from(secWrap.querySelectorAll('[data-f-el]')).filter(
      (x) => x !== el && (!x.closest('.f-free-ui') || x.classList.contains('f-free-ui'))
    );
    const sibZList = sibs.map((x) => Number(getComputedStyle(x).zIndex) || 25);
    const curZ = Number(getComputedStyle(el).zIndex) || 25;

    let nextZ = curZ;
    if (dir < 0) {
      // Up / bring forward -> raise above siblings
      const maxSibZ = sibZList.length > 0 ? Math.max(...sibZList) : curZ;
      nextZ = Math.min(999, Math.max(curZ + 5, maxSibZ + 2));
    } else {
      // Down / send backward -> lower below siblings
      const minSibZ = sibZList.length > 0 ? Math.min(...sibZList) : curZ;
      nextZ = Math.max(1, Math.min(curZ - 5, minSibZ - 2));
    }

    if (typeof globalRoot.pushUndoSnapshot === 'function') {
      globalRoot.pushUndoSnapshot();
    }
    if (!el.style.position && !el.classList?.contains('f-free-ui')) {
      el.style.position = 'relative';
    }
    el.style.zIndex = String(nextZ);
    globalRoot.FORMA_PRO.ResponsiveEngine?.setElementPatch?.(layerId, 'desktop', { zIndex: nextZ });
    renderLayerTree();
    syncSelectionUI();
    globalRoot.FORMA_PRO.ProjectState?.scheduleAutosave?.();
    return true;
  }

  /* ==========================================================================
     4. IN-PLACE SELECTION SYNC & LIVE INSPECTOR READOUTS (F14 / F16)
     ========================================================================== */
  function syncSelectionUI() {
    if (typeof document === 'undefined') return;
    if (globalRoot.FORMA_PRO.ClientMode?.isClientMode?.()) return;

    const panel = document.getElementById('st-right-panel');
    if (!panel || typeof panel.querySelector !== 'function') return;

    const selKeys = globalRoot.FORMA_PRO.SelectionEngine?.getSelection?.() || [];
    const selSet = new Set(selKeys);

    // 1. Update Layer Tree rows IN-PLACE (never replace innerHTML here so double-click works!)
    const tree = panel.querySelector('[data-testid="layer-tree"]');
    if (tree) {
      tree.querySelectorAll('.st-layer-row[data-layer-id]').forEach((row) => {
        const lid = row.getAttribute('data-layer-id');
        const on = Boolean(lid && selSet.has(lid));
        row.classList.toggle('is-selected', on);
        row.classList.toggle('is-active', on);
        row.setAttribute('aria-selected', on ? 'true' : 'false');
        if (on) {
          row.setAttribute('data-selected', 'true');
        } else {
          row.removeAttribute('data-selected');
        }
      });
    }

    // 2. Populate Inspector Design & Interact inputs from primary selected element
    const root = document.getElementById('hp-root');
    const primaryKey = selKeys.length > 0 ? selKeys[selKeys.length - 1] : '';
    const selEl =
      (primaryKey && root ? root.querySelector(`[data-f-el="${cssEscapeAttrVal(primaryKey)}"]`) : null) ||
      (typeof selectedCanvasEl !== 'undefined' && selectedCanvasEl?.isConnected ? selectedCanvasEl : null);

    if (!selEl || !selEl.isConnected) return;

    const s = getEngineState();
    const vp = s?.viewport || 'desktop';
    const key = primaryKey || selEl.getAttribute('data-f-el') || '';
    const vpPatch = globalRoot.FORMA_PRO.ResponsiveEngine?.getElementPatch?.(key, vp) || {};
    const deskPatch =
      vp !== 'desktop'
        ? globalRoot.FORMA_PRO.ResponsiveEngine?.getElementPatch?.(key, 'desktop') || {}
        : vpPatch;
    const patch = { ...deskPatch, ...vpPatch };

    const z = globalRoot.FORMA_PRO.ResponsiveEngine?.getCanvasZoom?.() || s?.zoom || 1;
    const r = selEl.getBoundingClientRect();
    const sec = selEl.closest('.f-blank-sec, .f-sec-wrap') || root;
    const sr = sec ? sec.getBoundingClientRect() : { left: 0, top: 0 };
    const cs = getComputedStyle(selEl);

    const setVal = (tid, val) => {
      const inp = panel.querySelector(`[data-testid="${tid}"]`);
      if (inp && document.activeElement !== inp && val !== undefined && val !== null && !Number.isNaN(val)) {
        inp.value = String(val);
      }
    };

    const isFree = selEl.classList?.contains('f-free-ui') || String(key).startsWith('fw::');
    let curX = 0;
    let curY = 0;
    if (Number.isFinite(Number(patch.x))) {
      curX = Math.round(Number(patch.x));
    } else if (isFree) {
      curX =
        selEl.style.left && selEl.style.left.endsWith('px')
          ? Math.round(parseFloat(selEl.style.left))
          : Math.round((r.left - sr.left) / z);
    } else if (typeof globalRoot.getElementPathInRoot === 'function') {
      const pk = globalRoot.getElementPathInRoot(selEl);
      curX = Math.round(Number(s?.uiOffsets?.[pk]?.x) || 0);
    }

    if (Number.isFinite(Number(patch.y))) {
      curY = Math.round(Number(patch.y));
    } else if (isFree) {
      curY =
        selEl.style.top && selEl.style.top.endsWith('px')
          ? Math.round(parseFloat(selEl.style.top))
          : Math.round((r.top - sr.top) / z);
    } else if (typeof globalRoot.getElementPathInRoot === 'function') {
      const pk = globalRoot.getElementPathInRoot(selEl);
      curY = Math.round(Number(s?.uiOffsets?.[pk]?.y) || 0);
    }

    setVal('insp-x', curX);
    setVal('insp-y', curY);
    setVal('insp-w', Math.round(Number(patch.width) || selEl.offsetWidth || r.width / z || 100));
    setVal('insp-h', Math.round(Number(patch.height) || selEl.offsetHeight || r.height / z || 40));
    setVal('insp-rotate', Number.isFinite(Number(patch.rotate)) ? Number(patch.rotate) : 0);
    setVal(
      'insp-zindex',
      Number.isFinite(Number(patch.zIndex))
        ? Number(patch.zIndex)
        : Number.isFinite(parseInt(cs.zIndex, 10))
        ? parseInt(cs.zIndex, 10)
        : 25
    );

    setVal('insp-pad-top', Number.isFinite(Number(patch.padTop)) ? Number(patch.padTop) : Math.round(parseFloat(cs.paddingTop) || 0));
    setVal('insp-pad-right', Number.isFinite(Number(patch.padRight)) ? Number(patch.padRight) : Math.round(parseFloat(cs.paddingRight) || 0));
    setVal('insp-pad-bottom', Number.isFinite(Number(patch.padBottom)) ? Number(patch.padBottom) : Math.round(parseFloat(cs.paddingBottom) || 0));
    setVal('insp-pad-left', Number.isFinite(Number(patch.padLeft)) ? Number(patch.padLeft) : Math.round(parseFloat(cs.paddingLeft) || 0));

    setVal('insp-font-size', Number.isFinite(Number(patch.fontSize)) ? Number(patch.fontSize) : Math.round(parseFloat(cs.fontSize) || 16));
    if (patch.fontWeight) setVal('insp-font-weight', patch.fontWeight);
    if (Number.isFinite(Number(patch.lineHeight))) setVal('insp-line-height', patch.lineHeight);
    if (Number.isFinite(Number(patch.letterSpacing))) setVal('insp-letter-spacing', patch.letterSpacing);
    if (patch.textAlign) setVal('insp-text-align', patch.textAlign);
    setVal('insp-text-color', patch.color ? rgbToHex(patch.color) : rgbToHex(cs.color, '#1e293b'));

    setVal('insp-fill-mode', patch.fillMode || 'solid');
    setVal('insp-bg-color', patch.bgColor ? rgbToHex(patch.bgColor) : rgbToHex(cs.backgroundColor, '#0f766e'));
    if (patch.gradColor1) setVal('insp-grad-color-1', rgbToHex(patch.gradColor1, '#0ea5e9'));
    if (patch.gradColor2) setVal('insp-grad-color-2', rgbToHex(patch.gradColor2, '#6366f1'));
    if (Number.isFinite(Number(patch.gradAngle))) setVal('insp-grad-angle', Number(patch.gradAngle));
    setVal('insp-opacity', Number.isFinite(Number(patch.opacity)) ? Number(patch.opacity) : Number(parseFloat(cs.opacity ?? '1').toFixed(2)));

    setVal('insp-border-width', Number.isFinite(Number(patch.borderWidth)) ? Number(patch.borderWidth) : Math.round(parseFloat(cs.borderTopWidth) || 0));
    if (patch.borderStyle) setVal('insp-border-style', patch.borderStyle);
    setVal('insp-border-color', patch.borderColor ? rgbToHex(patch.borderColor) : rgbToHex(cs.borderTopColor, '#38bdf8'));
    setVal('insp-border-radius', Number.isFinite(Number(patch.borderRadius)) ? Number(patch.borderRadius) : Math.round(parseFloat(cs.borderTopLeftRadius) || 0));
    if (patch.shadowPreset) setVal('insp-shadow-preset', patch.shadowPreset);
    if (Number.isFinite(Number(patch.shadowBlur))) setVal('insp-shadow-blur', Number(patch.shadowBlur));

    globalRoot.FORMA_PRO.InteractionsEngine?.syncInteractInputsFromElement?.(selEl, key);
  }

  const InspectorUI = {
    hasCustomBinding: true,
    renderInspector,
    renderLayerTree,
    syncSelectionUI,
    switchTab,
    toggleLayerVisibility,
    toggleLayerLock,
    moveLayerOrder,
    startInlineLayerRename,
    commitLayerRename,
    sanitizeLayerName,
    applyStoredLayerStatesToDOM,
    applyInteractionsToDOM: function (rootEl) {
      return globalRoot.FORMA_PRO.InteractionsEngine?.applyInteractionsToDOM?.(rootEl);
    }
  };

  globalRoot.FORMA_PRO.InspectorUI = InspectorUI;

  // Bridge ResponsiveEngine inspector methods to InspectorUI
  if (globalRoot.FORMA_PRO.ResponsiveEngine) {
    globalRoot.FORMA_PRO.ResponsiveEngine.ensureInspectorMounted = function () {
      renderInspector();
      renderLayerTree();
    };
    globalRoot.FORMA_PRO.ResponsiveEngine.switchInspectorTab = switchTab;
    globalRoot.FORMA_PRO.ResponsiveEngine.syncInspectorInputsFromSelected = syncSelectionUI;
  }
})();
