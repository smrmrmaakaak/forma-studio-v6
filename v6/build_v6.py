#!/usr/bin/env python3
import base64
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

BASE = Path('/home/antigravity/web-design-library')
V6 = BASE / 'v6'
FONTS_DIR = BASE / 'fonts'
ARTIFACT_DIR = Path('/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/43b850f5-9609-4ef1-8881-51fe43bcea1b')

UA = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
)


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def build_clean_embedded_fonts_v6(extra_texts: list[str]) -> str:
    cached_path = FONTS_DIR / 'embedded_fonts_v6_clean.css'
    # Collect every Hangul character across all v6 sources + extra texts
    all_text = '\n'.join(extra_texts)
    hangul_chars = sorted(
        {
            ch
            for ch in all_text
            if ('\uAC00' <= ch <= '\uD7A3') or ('\u3131' <= ch <= '\u318E')
        }
    )
    sig_path = FONTS_DIR / 'embedded_fonts_v6_clean.sig'
    sig = f"v2:{len(hangul_chars)}:{''.join(hangul_chars)}"
    if (
        cached_path.exists()
        and cached_path.stat().st_size > 500_000
        and sig_path.exists()
        and sig_path.read_text(encoding='utf-8') == sig
    ):
        print(f"Using cached clean fonts ({len(hangul_chars)} Hangul chars, {cached_path.stat().st_size:,} bytes)")
        return cached_path.read_text(encoding='utf-8')

    print(f"Building subsetted Korean WOFF2 fonts for {len(hangul_chars)} unique Hangul chars...")
    latin_css = (FONTS_DIR / 'embedded_fonts.css').read_text(encoding='utf-8')

    kr_specs = [
        ('Noto+Serif+KR:wght@300..700', 'Noto Serif KR (Variable 300..700)'),
        ('Gowun+Batang:wght@400;700', 'Gowun Batang (400, 700)'),
        ('Black+Han+Sans', 'Black Han Sans (400)'),
        ('Hahmlet:wght@400..800', 'Hahmlet (Variable 400..800)'),
        ('IBM+Plex+Sans+KR:wght@400;600;700', 'IBM Plex Sans KR (400, 600, 700)'),
    ]

    chunk_size = 200
    chunks = [
        ''.join(hangul_chars[i : i + chunk_size])
        for i in range(0, len(hangul_chars), chunk_size)
    ]

    kr_blocks = []
    total_raw_woff2 = 0

    for spec, label in kr_specs:
        fam_bytes = 0
        for chunk in chunks:
            q_text = urllib.parse.quote(chunk)
            css_url = f"https://fonts.googleapis.com/css2?family={spec}&text={q_text}&display=swap"
            raw_css = fetch_bytes(css_url).decode('utf-8')

            for m in re.finditer(r'@font-face\s*\{([^}]+)\}', raw_css):
                body = m.group(1)
                u_match = re.search(r'url\((https://fonts\.gstatic\.com/[^)]+)\)', body)
                if not u_match:
                    continue
                woff_bytes = fetch_bytes(u_match.group(1))
                total_raw_woff2 += len(woff_bytes)
                fam_bytes += len(woff_bytes)
                b64_woff = base64.b64encode(woff_bytes).decode('ascii')
                body_inlined = body.replace(
                    u_match.group(0),
                    f"url(data:font/woff2;base64,{b64_woff})",
                ).strip()
                block = f"@font-face {{\n  font-display: swap;\n  {body_inlined}\n}}"
                kr_blocks.append(block)
        print(f"  Embedded {label}: {fam_bytes:,} raw bytes")

    print(f"Total raw Korean WOFF2 bytes: {total_raw_woff2:,} bytes")
    full_fonts_css = latin_css.strip() + "\n\n/* === EMBEDDED KOREAN WOFF2 SUBSETS === */\n" + "\n".join(kr_blocks) + "\n"
    cached_path.write_text(full_fonts_css, encoding='utf-8')
    sig_path.write_text(sig, encoding='utf-8')
    return full_fonts_css


def main():
    b64_path = Path('/tmp/b64_hd_webp_v6.json')
    if b64_path.exists():
        b64_json = b64_path.read_text(encoding='utf-8').strip()
    else:
        img_map = {}
        for p in sorted((BASE / 'img_hd').glob('*.webp')):
            img_map[p.stem] = 'data:image/webp;base64,' + base64.b64encode(p.read_bytes()).decode('ascii')
        b64_json = json.dumps(img_map)

    core_css = (V6 / '01_styles.css').read_text(encoding='utf-8')
    js_02_raw = (V6 / '02_worlds_and_assets.js').read_text(encoding='utf-8')
    js_03a = (V6 / '03_sections_a.js').read_text(encoding='utf-8')
    js_03b = (V6 / '03_sections_b.js').read_text(encoding='utf-8')
    js_04 = (V6 / '04_engine_and_ui.js').read_text(encoding='utf-8')
    self_src = Path(__file__).read_text(encoding='utf-8')

    fonts_css = build_clean_embedded_fonts_v6([core_css, js_02_raw, js_03a, js_03b, js_04, self_src])

    js_02 = js_02_raw.replace('__B64_IMAGES_JSON__', b64_json)
    combined_js = "\n\n".join([js_02, js_03a, js_03b, js_04])

    html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FORMA STUDIO v6 — 하이엔드 웹 디자인 에셋 아틀리에 & 풀페이지 조립 스튜디오</title>
  <meta name="description" content="26개 모듈 슬롯, 252종 전수 라이브 에셋, 내장 한글·영문 웹폰트, 60fps 캔버스 셰이더, 시안 A/B/C 즉시 비교, 완전 동작 단독 코드 추출을 지원하는 웹 디자인 라이브러리" />
  <style id="forma-fonts-css">
{fonts_css}
  </style>
  <style id="forma-core-css">
{core_css}
  </style>
</head>
<body>
  <div id="studio-app" class="st-app">
    <button type="button" onclick="togglePresentationMode(false)" class="st-exit-pres">
      <span>✕ 스튜디오 편집 모드로 돌아가기 (ESC)</span>
    </button>

    <!-- ROW 1: MASTER COMMAND BAR -->
    <header class="st-topbar">
      <div class="st-brand">
        <button type="button" id="sidebar-toggle-btn" onclick="toggleSidebar()" class="st-pill-btn">◧ 패널 접기</button>
        <span class="st-logo-mark">F</span>
        <span class="st-brand-name">FORMA STUDIO</span>
        <span class="st-brand-tag hide-narrow">v6 · 26 SLOTS · 252 ASSETS</span>
      </div>

      <!-- MODE SWITCHER: Full Homepage Combiner vs 252 Live Asset Atelier -->
      <div class="st-mode-seg">
        <button type="button" id="mode-btn-builder" onclick="setStudioMode('builder')" class="st-mode-btn is-active">
          <span>🖥 풀페이지 조합</span>
        </button>
        <button type="button" id="mode-btn-vault" onclick="setStudioMode('vault')" class="st-mode-btn">
          <span>✦ 개별 에셋 아틀리에 (252종)</span>
        </button>
      </div>

      <!-- INDUSTRY PRESET + VIEWPORT + PRESENTATION + CODE EXPORT -->
      <div class="st-actions">
        <select id="world-select" aria-label="업종 월드 프리셋" onchange="switchWorld(this.value)" class="st-select">
          <option value="maison">1. 럭셔리 건축 스테이</option>
          <option value="obsidian">2. AI · 엔터프라이즈 SaaS</option>
          <option value="botanica">3. 보태니컬 퍼퓸 · 뷰티</option>
          <option value="eclipse">4. 미쉐린 파인다이닝</option>
          <option value="hanlaw">5. 글로벌 로펌 · 금융자문</option>
          <option value="kinetic">6. 크리에이티브 에이전시</option>
        </select>
        <button type="button" onclick="randomizeCombination()" class="st-pill-btn" title="26개 슬롯 전체 랜덤 믹스">🎲 믹스</button>
        <button type="button" onclick="replaySiteMotions()" class="st-pill-btn hide-narrow" title="스크롤 등장 모션 및 카운터 재생">▶ 모션</button>
        <button type="button" id="inline-edit-btn" onclick="toggleInlineEdit()" class="st-pill-btn hide-narrow" title="홈페이지 문구 직접 클릭 타이핑 수정">✏️ 문구수정</button>
        <div class="st-mode-seg hide-narrow">
          <button type="button" id="vp-btn-desktop" onclick="setViewportSize('desktop')" class="st-mode-btn is-active" style="padding:4px 8px;">Desktop</button>
          <button type="button" id="vp-btn-tablet" onclick="setViewportSize('tablet')" class="st-mode-btn" style="padding:4px 8px;">Tablet</button>
          <button type="button" id="vp-btn-mobile" onclick="setViewportSize('mobile')" class="st-mode-btn" style="padding:4px 8px;">Mobile</button>
        </div>
        <button type="button" onclick="togglePresentationMode(true)" class="st-pill-btn hide-narrow" title="클라이언트 미팅용 풀스크린">👁 고객미팅 뷰</button>
        <button type="button" onclick="downloadStudioSelfHTML()" class="st-pill-btn" style="border-color:rgba(56,189,248,0.45);color:#7DD3FC;" title="이 스튜디오 전체를 단일 .html 파일로 저장해 내 PC 크롬에서 바로 열기">⬇ 크롬용 파일받기</button>
        <button type="button" onclick="openFullWebsiteExport()" class="st-pill-btn is-primary">&lt;/&gt; 코드 추출</button>
      </div>
    </header>

    <!-- ROW 2: 1-CLICK QUICK SLOT STEPPER + CLIENT A/B/C PROPOSAL COMPARE -->
    <div id="st-subbar" class="st-subbar"></div>

    <!-- MAIN WORKSPACE -->
    <div class="st-workspace">
      <!-- COLLAPSIBLE LEFT INSPECTOR -->
      <aside id="st-sidebar" class="st-sidebar">
        <div class="st-side-tabs">
          <button type="button" id="stab-slots" onclick="setSideTab('slots')" class="st-side-tab is-active">에셋 장착 (26)</button>
          <button type="button" id="stab-composer" onclick="setSideTab('composer')" class="st-side-tab">섹션 순서 (13)</button>
          <button type="button" id="stab-tokens" onclick="setSideTab('tokens')" class="st-side-tab">디테일 튜닝</button>
        </div>
        <div id="st-side-body" class="st-side-body"></div>
      </aside>

      <!-- LIVE WEBSITE STAGE + 252 LIVE ASSET ATELIER -->
      <main class="st-stage">
        <div id="canvas-frame" class="st-canvas-frame">
          <div id="website-mount"></div>
        </div>

        <section id="vault-view" class="st-vault-view">
          <div id="vault-toolbar" class="st-vault-toolbar"></div>
          <div id="vault-cats-bar" class="st-vault-cats"></div>
          <div class="st-vault-grid-wrap">
            <div id="vault-cards-grid" class="st-vault-grid"></div>
          </div>
        </section>
      </main>
    </div>
  </div>

  <!-- CUSTOM CURSOR FOLLOWER -->
  <div id="f-cursor-ring" class="f-cursor-ring"></div>

  <!-- IMAGE LIGHTBOX MODAL -->
  <div id="lightbox-modal" class="st-modal-backdrop" onclick="this.classList.remove('is-open')">
    <div class="st-modal-box" style="max-width:980px;background:#090A0D;" onclick="event.stopPropagation()">
      <div style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div id="lightbox-title" style="font-size:15px;font-weight:700;color:#F8FAFC;">쇼케이스 확대 보기</div>
          <div id="lightbox-meta" class="f-mono" style="font-size:12px;color:#94A3B8;margin-top:2px;"></div>
        </div>
        <button type="button" onclick="document.getElementById('lightbox-modal').classList.remove('is-open')" class="st-pill-btn">✕ 닫기</button>
      </div>
      <div style="padding:16px;background:#050608;display:flex;justify-content:center;align-items:center;max-height:74vh;overflow:hidden;">
        <img id="lightbox-img" src="" alt="Zoom" style="max-width:100%;max-height:70vh;object-fit:contain;border-radius:8px;" />
      </div>
    </div>
  </div>

  <!-- DUAL-TAB PRODUCTION CODE EXPORT + LIVE SANDBOX PREVIEW MODAL -->
  <div id="export-modal" class="st-modal-backdrop" onclick="this.classList.remove('is-open')">
    <div class="st-modal-box" onclick="event.stopPropagation()">
      <div style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <div id="export-modal-tag" class="f-mono" style="font-size:12px;color:#94A3B8;">PRODUCTION READY HTML + CSS + JS</div>
          <div id="export-modal-title" style="font-size:15px;font-weight:700;color:#F8FAFC;margin-top:2px;">완성된 홈페이지 소스코드</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <div class="st-mode-seg">
            <button type="button" id="exp-tab-code" onclick="setExportModalTab('code')" class="st-mode-btn is-active">&lt;/&gt; 완성 소스코드</button>
            <button type="button" id="exp-tab-preview" onclick="setExportModalTab('preview')" class="st-mode-btn">👁 단독 실행 테스트</button>
          </div>
          <button type="button" onclick="downloadExportHTML()" class="st-pill-btn">⬇ .html 저장</button>
          <button type="button" onclick="copyExportCode()" class="st-pill-btn is-primary">클립보드 전체 복사</button>
          <button type="button" onclick="document.getElementById('export-modal').classList.remove('is-open')" class="st-pill-btn">✕</button>
        </div>
      </div>
      <div style="padding:16px;flex:1;display:flex;background:#08090C;">
        <textarea id="export-code-area" readonly style="width:100%;height:56vh;background:#0B0D12;color:#E2E8F0;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.6;resize:none;outline:none;"></textarea>
        <iframe id="export-preview-frame" title="Standalone Export Sandbox" sandbox="allow-scripts" style="display:none;width:100%;height:56vh;border:1px solid rgba(255,255,255,0.12);border-radius:10px;background:#0D0F15;"></iframe>
      </div>
    </div>
  </div>

  <!-- STUDIO TOAST -->
  <div id="st-toast" class="st-toast"></div>

  <script id="forma-main-script">
{combined_js}
  </script>
</body>
</html>
"""

    targets = [
        ARTIFACT_DIR / 'forma_studio.html',
        ARTIFACT_DIR / 'web_design_library.html',
        BASE / 'index.html',
    ]
    for t in targets:
        t.write_text(html, encoding='utf-8')
        print(f"Wrote {t} ({t.stat().st_size:,} bytes)")


if __name__ == '__main__':
    main()
