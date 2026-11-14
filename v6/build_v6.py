#!/usr/bin/env python3
import base64
import json
import pathlib
import re
import shutil
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
BASE = ROOT.parent

REPO_GIT = pathlib.Path("/home/antigravity/smrmrmaakaak/forma-studio-v6")
REPO_LIB = pathlib.Path("/home/antigravity/web-design-library")
ARTIFACT_DIR = pathlib.Path(
    "/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/43b850f5-9609-4ef1-8881-51fe43bcea1b"
)

FONTS_DIR = BASE / "fonts"
if not (FONTS_DIR / "embedded_fonts.css").exists() and (REPO_LIB / "fonts" / "embedded_fonts.css").exists():
    FONTS_DIR = REPO_LIB / "fonts"

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def strip_external_font_imports(css_text: str) -> str:
    return re.sub(
        r"@import\s+url\(['\"]?https?://[^)]+\)\s*;?\s*",
        "",
        css_text,
    )


COMMON_KR_SEED = (
    "홈메인회사소개서비스포트폴리오문의하기오시는길공지사항갤러리예약상담가격안내"
    "대표원장변호사건축디자인스튜디오클리닉카페레스토랑호텔리조트서울강남성수한남청담판교부산제주"
    "주식회사그룹파트너스랩브랜드슬로건라이트다크자동저장완료복제삭제이름변경페이지추가미리보기"
    "공유링크복사초고자유도설악퀀텀아르떼메종인코그니토독립배포어바웃통째저장"
)


def build_clean_embedded_fonts_v6(extra_texts: list[str]) -> str:
    cached_path = FONTS_DIR / "embedded_fonts_v6_clean.css"
    sig_path = FONTS_DIR / "embedded_fonts_v6_clean.sig"

    all_text = "\n".join([*extra_texts, COMMON_KR_SEED])
    hangul_chars = sorted(
        {
            ch
            for ch in all_text
            if ("\uAC00" <= ch <= "\uD7A3") or ("\u3131" <= ch <= "\u318E")
        }
    )
    sig = f"v2:{len(hangul_chars)}:{''.join(hangul_chars)}"
    if (
        cached_path.exists()
        and cached_path.stat().st_size > 500_000
        and sig_path.exists()
        and sig_path.read_text(encoding="utf-8") == sig
    ):
        print(
            f"Using cached clean fonts ({len(hangul_chars)} Hangul chars, {cached_path.stat().st_size:,} bytes)"
        )
        return strip_external_font_imports(cached_path.read_text(encoding="utf-8"))

    print(
        f"Building subsetted Korean WOFF2 fonts for {len(hangul_chars)} unique Hangul chars..."
    )
    latin_file = FONTS_DIR / "embedded_fonts.css"
    if not latin_file.exists():
        latin_file = ROOT / "embedded_fonts.css"
    latin_css = strip_external_font_imports(latin_file.read_text(encoding="utf-8"))

    kr_specs = [
        ("Noto+Serif+KR:wght@300..700", "Noto Serif KR (Variable 300..700)"),
        ("Gowun+Batang:wght@400;700", "Gowun Batang (400, 700)"),
        ("Black+Han+Sans", "Black Han Sans (400)"),
        ("Hahmlet:wght@400..800", "Hahmlet (Variable 400..800)"),
        ("IBM+Plex+Sans+KR:wght@400;600;700", "IBM Plex Sans KR (400, 600, 700)"),
    ]

    chunk_size = 200
    chunks = [
        "".join(hangul_chars[i : i + chunk_size])
        for i in range(0, len(hangul_chars), chunk_size)
    ]

    kr_blocks = []
    total_raw_woff2 = 0
    gfonts_api = "https://" + "fonts.googleapis.com/css2"
    gstatic_re = r"url\((https://" + r"fonts\.gstatic\.com/[^)]+)\)"

    try:
        for spec, label in kr_specs:
            fam_bytes = 0
            for chunk in chunks:
                q_text = urllib.parse.quote(chunk)
                css_url = f"{gfonts_api}?family={spec}&text={q_text}&display=swap"
                raw_css = fetch_bytes(css_url).decode("utf-8")

                for m in re.finditer(r"@font-face\s*\{([^}]+)\}", raw_css):
                    body = m.group(1)
                    u_match = re.search(gstatic_re, body)
                    if not u_match:
                        continue
                    woff_bytes = fetch_bytes(u_match.group(1))
                    total_raw_woff2 += len(woff_bytes)
                    fam_bytes += len(woff_bytes)
                    b64_woff = base64.b64encode(woff_bytes).decode("ascii")
                    body_inlined = body.replace(
                        u_match.group(0),
                        f"url(data:font/woff2;base64,{b64_woff})",
                    ).strip()
                    block = (
                        f"@font-face {{\n  font-display: swap;\n  {body_inlined}\n}}"
                    )
                    kr_blocks.append(block)
            print(f"  Embedded {label}: {fam_bytes:,} raw bytes")
    except Exception as exc:
        if cached_path.exists() and cached_path.stat().st_size > 500_000:
            print(
                f"  Font network fetch skipped ({exc}); using existing cached WOFF2 bundle ({cached_path.stat().st_size:,} bytes)"
            )
            return strip_external_font_imports(cached_path.read_text(encoding="utf-8"))
        raise

    print(f"Total raw Korean WOFF2 bytes: {total_raw_woff2:,} bytes")
    full_fonts_css = (
        latin_css.strip()
        + "\n\n/* === EMBEDDED KOREAN WOFF2 SUBSETS === */\n"
        + "\n".join(kr_blocks)
        + "\n"
    )
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    cached_path.write_text(full_fonts_css, encoding="utf-8")
    sig_path.write_text(sig, encoding="utf-8")
    for other_repo in (REPO_GIT, REPO_LIB):
        if other_repo.exists() and (other_repo / "fonts") != FONTS_DIR:
            (other_repo / "fonts").mkdir(parents=True, exist_ok=True)
            (other_repo / "fonts" / "embedded_fonts_v6_clean.css").write_text(
                full_fonts_css, encoding="utf-8"
            )
            (other_repo / "fonts" / "embedded_fonts_v6_clean.sig").write_text(
                sig, encoding="utf-8"
            )
    return full_fonts_css


img_dir = BASE / "img_hd"
if not img_dir.exists() and (REPO_LIB / "img_hd").exists():
    img_dir = REPO_LIB / "img_hd"

img_map = {}
for p in sorted(img_dir.glob("*.webp")):
    img_map[p.stem] = "data:image/webp;base64," + base64.b64encode(p.read_bytes()).decode("ascii")
b64_json = json.dumps(img_map)

css_parts = [(ROOT / "01_styles.css").read_text(encoding="utf-8")]
for opt_css in ("01b_canvas_stage.css", "01c_inspector_layers.css"):
    if (ROOT / opt_css).exists():
        css_parts.append((ROOT / opt_css).read_text(encoding="utf-8"))
css = "\n\n".join(css_parts)

js1_raw = (ROOT / "02_worlds_and_assets.js").read_text(encoding="utf-8")
js1 = js1_raw.replace("__B64_IMAGES_JSON__", b64_json)
js2 = (ROOT / "03_sections_a.js").read_text(encoding="utf-8")
js3 = (ROOT / "03_sections_b.js").read_text(encoding="utf-8")
js4_state = (ROOT / "04_state_and_storage.js").read_text(encoding="utf-8")
js5_brand = (ROOT / "05_brand_and_client.js").read_text(encoding="utf-8")
js_engine = (ROOT / "04_engine_and_ui.js").read_text(encoding="utf-8")

opt_js_parts = []
for opt_js in (
    "06_responsive_and_zoom.js",
    "07_selection_snap_align.js",
    "08_inspector_and_layers.js",
    "09_interactions_and_export.js",
    "10_studio_boot.js",
):
    if (ROOT / opt_js).exists():
        opt_js_parts.append((ROOT / opt_js).read_text(encoding="utf-8"))
extra_js_bundle = ("\n\n" + "\n\n".join(opt_js_parts)) if opt_js_parts else ""

self_src = pathlib.Path(__file__).read_text(encoding="utf-8")

fonts_css = build_clean_embedded_fonts_v6(
    [css, js1_raw, js2, js3, js4_state, js5_brand, js_engine, *opt_js_parts, self_src]
)

html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FORMA STUDIO Pro — 초고자유도 비주얼 웹디자인 스튜디오</title>
  <!-- 100% Embedded Offline WOFF2 Webfonts (Zero External Network Requests) -->
  <style id="forma-fonts-css">
{fonts_css}
  </style>
  <style id="forma-core-css">
{css}
  </style>
</head>
<body>
  <script id="forma-boot-project" type="application/json"></script>

  <!-- Custom Cursor Follower (Live across the Website Stage) -->
  <div id="f-cursor-ring" class="f-cursor-ring"></div>

  <!-- Live Visual Clone Drag Ghost + Section Drop Indicator Line + Magnetic Center Snap Guides -->
  <div id="st-drag-ghost" class="st-drag-ghost"></div>
  <div id="st-sec-drop-line" class="st-sec-drop-line">
    <span id="st-sec-drop-label" class="st-sec-drop-pill">+</span>
  </div>
  <div id="st-snap-guide-x" data-testid="snap-guide-x" class="st-snap-guide-x"></div>
  <div id="st-snap-guide-y" data-testid="snap-guide-y" class="st-snap-guide-y"></div>

  <!-- 8-Handle Interactive Resize Box + Floating Quick Inspector Toolbar for Selected On-Canvas Element -->
  <div id="st-ui-sel-box" data-testid="selection-box" class="st-ui-sel-box">
    <span class="st-ui-sel-handle nw" data-handle="nw"></span>
    <span class="st-ui-sel-handle n" data-handle="n"></span>
    <span class="st-ui-sel-handle ne" data-handle="ne"></span>
    <span class="st-ui-sel-handle e" data-handle="e"></span>
    <span class="st-ui-sel-handle se" data-handle="se"></span>
    <span class="st-ui-sel-handle s" data-handle="s"></span>
    <span class="st-ui-sel-handle sw" data-handle="sw"></span>
    <span class="st-ui-sel-handle w" data-handle="w"></span>
    <span id="st-ui-size-badge" class="st-ui-size-badge">0 × 0</span>
  </div>

  <div id="st-ui-toolbar" data-testid="selection-toolbar" class="st-ui-toolbar">
    <button type="button" onclick="editSelectedUITextInline()" style="color:#FDE047;" title="더블클릭 또는 이 버튼으로 글자 바로 수정">✏️ 글자수정</button>
    <button type="button" onclick="openPhotoPickerForSelectedUI('photo')" style="color:#6EE7B7;" title="내 컴퓨터 사진 업로드 또는 스튜디오 HD 화보 교체">🖼 사진교체</button>
    <button type="button" onclick="inspectSelectedUICategory()" style="color:#7DD3FC;" title="이 요소와 같은 종류의 다른 디자인 보기">🎨 스타일교체</button>
    <label class="st-color-chip" title="배경 색상 직접 지정">
      <span>배경</span>
      <input type="color" value="#8C5A32" oninput="setSelectedUICustomStyle('bgColor', this.value)" />
    </label>
    <label class="st-color-chip" title="글자 색상 직접 지정">
      <span>글자</span>
      <input type="color" value="#FAF8F5" oninput="setSelectedUICustomStyle('fgColor', this.value)" />
    </label>
    <button type="button" onclick="promptSelectedUILink()" title="클릭 시 이동할 링크(URL 또는 #섹션) 지정">🔗 링크</button>
    <button type="button" onclick="shiftSelectedUILayer(1)" title="앞으로 가져오기">⬆앞</button>
    <button type="button" onclick="shiftSelectedUILayer(-1)" title="뒤로 보내기">⬇뒤</button>
    <button type="button" onclick="duplicateSelectedUI()" title="이 UI 요소를 옆에 하나 더 복제">⎘ 복제</button>
    <button type="button" onclick="resetSelectedUIPosition()" title="원래 위치/크기로 복구">↺ 원위치</button>
    <button type="button" onclick="deleteSelectedUI()" style="color:#FCA5A5;" title="요소 삭제 (Delete 키)">🗑</button>
  </div>

  <!-- Marquee Multi-Select Box & Right-Click Context Menu Scaffolds -->
  <div id="st-marquee-box" data-testid="marquee-box" style="display:none;position:fixed;z-index:9990;pointer-events:none;border:1.5px solid #38BDF8;background:rgba(56,189,248,0.14);"></div>
  <div id="st-context-menu" data-testid="context-menu" style="display:none;position:fixed;z-index:9996;min-width:148px;padding:6px;border-radius:10px;background:rgba(9,11,16,0.96);border:1px solid rgba(255,255,255,0.16);box-shadow:0 18px 42px rgba(0,0,0,0.55);flex-direction:column;gap:3px;">
    <button type="button" role="menuitem" data-action="duplicate" class="st-ctx-item st-pill-btn" onclick="duplicateSelectedUI();hideCanvasContextMenu()" style="width:100%;justify-content:flex-start;padding:6px 10px;">⎘ 복제 (Ctrl+D)</button>
    <button type="button" role="menuitem" data-action="front" class="st-ctx-item st-pill-btn" onclick="shiftSelectedUILayer(1);hideCanvasContextMenu()" style="width:100%;justify-content:flex-start;padding:6px 10px;">⬆ 앞으로 가져오기</button>
    <button type="button" role="menuitem" data-action="back" class="st-ctx-item st-pill-btn" onclick="shiftSelectedUILayer(-1);hideCanvasContextMenu()" style="width:100%;justify-content:flex-start;padding:6px 10px;">⬇ 뒤로 보내기</button>
    <button type="button" role="menuitem" data-action="delete" class="st-ctx-item st-pill-btn" onclick="deleteSelectedUI();hideCanvasContextMenu()" style="width:100%;justify-content:flex-start;padding:6px 10px;color:#FCA5A5;">🗑 삭제 (Delete)</button>
  </div>

  <!-- Floating Photo & Link Picker Popover -->
  <div id="st-photo-popover" class="st-photo-popover"></div>

  <!-- Hidden File Inputs for Local PC Image Upload & .forma.json Import -->
  <input id="st-img-upload-input" type="file" accept="image/*" style="display:none;" onchange="handleLocalImageFileSelect(event)" />
  <input id="import-project-json-input" data-testid="import-project-json-input" type="file" accept=".json,.forma.json,application/json" style="display:none;" onchange="FORMA_PRO.ProjectState.handleProjectJSONFileInput(event)" />
  <input id="project-json-file-input" type="file" accept=".json,.forma.json,application/json" style="display:none;" onchange="FORMA_PRO.ProjectState.handleProjectJSONFileInput(event)" />

  <div id="studio-app" data-testid="studio-app" class="st-app">
    <button type="button" class="st-exit-pres" onclick="togglePresentationMode(false)">✕ 편집 화면으로 복귀 (ESC)</button>

    <!-- 2-ROW PRO STUDIO TOPBAR (72px Total Height — Zero Clipping at 820x496 & 1440x900) -->
    <header id="st-topbar" data-testid="topbar" class="st-topbar">
      <!-- ROW 1 (38px): Brand / World / 1-Sec Restyler / Mode / Quick Add / Undo-Redo / A-B-C / Client Share / Export & JSON -->
      <div class="st-topbar-row">
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
          <button type="button" id="sidebar-toggle-btn" data-testid="sidebar-toggle-btn" class="st-pill-btn" onclick="toggleSidebar()" title="왼쪽 시각 UI 패널 접기/펼치기" style="padding:5px 8px;">◧</button>
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="width:7px;height:7px;border-radius:999px;background:#38BDF8;box-shadow:0 0 10px #38BDF8;"></span>
            <strong class="hide-narrow" style="font-size:12px;letter-spacing:0.06em;color:#F8FAFC;">FORMA</strong>
          </div>
          <select id="world-select" data-testid="world-select" class="st-world-select" onchange="switchWorld(this.value)" title="업종별 기본 템플릿 전환">
            <option value="maison">🏛 건축 · 빌라</option>
            <option value="obsidian">⚡ AI · 테크</option>
            <option value="botanica">🌿 뷰티 · 향수</option>
            <option value="eclipse">🍷 파인다이닝</option>
            <option value="hanlaw">⚖️ 로펌 · 자문</option>
            <option value="kinetic">✦ 에이전시</option>
          </select>
          <button type="button" data-testid="open-brand-restyler" class="st-pill-btn" onclick="FORMA_PRO.BrandRestyler.openBrandRestylerModal()" style="color:#FDE047;border-color:rgba(253,224,71,0.32);padding:4px 8px;" title="브랜드명·대표컬러·무드·서체 1초 자동 리스타일링">✨ 1초 브랜드</button>
        </div>

        <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
          <div class="st-mode-switch">
            <button type="button" id="mode-btn-builder" data-testid="mode-btn-builder" class="st-mode-btn is-active" onclick="setStudioMode('builder')">✦ 웹 빌더</button>
            <button type="button" id="mode-btn-vault" data-testid="open-vault" class="st-mode-btn" onclick="setStudioMode('vault')">❖ 252 에셋</button>
          </div>
          <div class="st-mode-switch">
            <button type="button" id="cmode-move" data-testid="cmode-move" class="st-mode-btn is-active" onclick="setCanvasInteractionMode('move')" title="웹페이지 위 어떤 요소든 잡고移動 · 모서리 크기조절 · 더블클릭 글자수정">✋ 이동·편집</button>
            <button type="button" id="cmode-text" data-testid="cmode-text" class="st-mode-btn" onclick="setCanvasInteractionMode('text')" title="텍스트 직접 클릭 타이핑">✏️ 글자</button>
            <button type="button" class="st-mode-btn" onclick="setCanvasInteractionMode('preview')" title="전체화면 실제 작동 테스트">▶ 미리보기</button>
          </div>
          <button type="button" data-testid="add-free-text" class="st-pill-btn" onclick="addFreeTextBlock()" style="color:#FDE047;border-color:rgba(253,224,71,0.28);padding:4px 7px;" title="원하는 위치에 자유 텍스트 상자 추가">+ T</button>
          <button type="button" data-testid="add-free-image" class="st-pill-btn" onclick="triggerPCImageUploadForCanvas()" style="color:#6EE7B7;border-color:rgba(110,231,183,0.28);padding:4px 7px;" title="내 컴퓨터의 사진 파일을 캔버스에 바로 올리기">+ 🖼</button>
          <button type="button" data-testid="add-free-box" class="st-pill-btn" onclick="addFreeBoxWidget()" style="color:#C4B5FD;border-color:rgba(196,181,253,0.28);padding:4px 7px;" title="자유 컨테이너 박스 추가">+ ▢</button>
          <button type="button" data-testid="add-blank-section" class="st-pill-btn" onclick="addBlankCanvasSection()" style="color:#7DD3FC;border-color:rgba(125,211,252,0.28);padding:4px 7px;" title="빈 자유 캔버스 섹션 추가">+ ⬜</button>
        </div>

        <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
          <button type="button" id="undo-btn" data-testid="undo-btn" class="st-pill-btn" onclick="undoLastAction()" style="opacity:0.45;padding:4px 7px;" title="방금 변경 되돌리기 (Ctrl+Z)">↩</button>
          <button type="button" id="redo-btn" data-testid="redo-btn" class="st-pill-btn" onclick="redoLastAction()" style="opacity:0.45;padding:4px 7px;" title="다시 실행 (Ctrl+Y / Ctrl+Shift+Z)">↪</button>
          <div class="st-mode-switch">
            <button type="button" id="prop-btn-A" data-testid="proposal-A" class="st-mode-btn is-active" onclick="loadProposalSlot('A')" style="padding:3px 7px;" title="시안 A">A</button>
            <button type="button" id="prop-btn-B" data-testid="proposal-B" class="st-mode-btn" onclick="loadProposalSlot('B')" style="padding:3px 7px;" title="시안 B">B</button>
            <button type="button" id="prop-btn-C" data-testid="proposal-C" class="st-mode-btn" onclick="loadProposalSlot('C')" style="padding:3px 7px;" title="시안 C">C</button>
          </div>
          <button type="button" class="st-pill-btn" onclick="toggleTunePopover()" style="padding:4px 7px;" title="모서리 둥글기 · 여백 · 포인트 컬러 미세 조절">⚙️</button>
          <button type="button" data-testid="open-client-preview" class="st-pill-btn" onclick="FORMA_PRO.ClientMode.openClientShareModal()" style="background:rgba(16,185,129,0.16);border-color:rgba(16,185,129,0.4);color:#6EE7B7;padding:4px 8px;" title="편집기 UI 없이 고객에게 바로 보여줄 공유 링크 & 프리뷰">🔗 고객공유</button>
          <button type="button" data-testid="export-project-json" class="st-pill-btn" onclick="FORMA_PRO.ProjectState.exportProjectJSON()" style="padding:4px 7px;" title="현재 멀티페이지 프로젝트를 .forma.json 파일로 저장">💾 JSON</button>
          <button type="button" data-testid="import-project-json-btn" class="st-pill-btn" onclick="FORMA_PRO.ProjectState.triggerProjectJSONImport()" style="padding:4px 7px;" title=".forma.json 프로젝트 파일 불러오기">📂 열기</button>
          <button type="button" data-testid="download-studio-self-html" class="st-pill-btn" onclick="downloadStudioSelfHTML()" style="background:rgba(56,189,248,0.16);border-color:rgba(56,189,248,0.4);color:#7DD3FC;padding:4px 8px;" title="현재 작업 상태가 내장된 독립형 스튜디오 HTML 다운로드">⬇ 앱저장</button>
          <button type="button" data-testid="open-export-modal" class="st-pill-btn is-primary" onclick="openFullWebsiteExport()" style="padding:4px 9px;">✦ 코드추출</button>
        </div>
      </div>

      <!-- ROW 2 (34px): Project Switcher / Multi-Page Tabs & Page CRUD / Auto-Save Status / Responsive Breakpoints / Canvas Zoom -->
      <div class="st-topbar-row">
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
          <button type="button" data-testid="open-projects-btn" class="st-pill-btn" onclick="FORMA_PRO.ProjectState.openProjectsModal()" style="padding:3px 8px;font-size:11px;color:#E2E8F0;" title="다중 프로젝트 관리 (생성·전환·복제·삭제)">
            <span>📁</span>
            <span id="st-project-name-label" style="max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">프로젝트</span>
          </button>
          <div id="st-page-tabs" data-testid="page-tabs" class="st-mode-switch" style="padding:2px;"></div>
          <button type="button" data-testid="add-page-btn" class="st-pill-btn" onclick="addNewPage()" style="padding:3px 7px;font-size:11px;color:#7DD3FC;" title="새 페이지 추가">+ 페이지</button>
          <button type="button" data-testid="duplicate-page-btn" class="st-pill-btn" onclick="duplicateActivePage()" style="padding:3px 7px;font-size:11px;" title="현재 페이지 복제">⎘</button>
          <button type="button" data-testid="rename-page-btn" class="st-pill-btn" onclick="renameActivePageInline()" style="padding:3px 7px;font-size:11px;" title="현재 페이지 이름 변경">✏️</button>
          <button type="button" id="st-delete-page-btn" data-testid="delete-page-btn" class="st-pill-btn" onclick="deleteActivePage()" style="padding:3px 7px;font-size:11px;color:#FCA5A5;" title="현재 페이지 삭제">🗑</button>
        </div>

        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
          <span id="st-autosave-status" data-testid="autosave-status" data-saved="true" class="f-mono" style="font-size:11px;color:#34D399;padding:2px 6px;">✓ 자동 저장됨</span>
          <div class="st-mode-switch" style="padding:2px;">
            <button type="button" id="vp-btn-desktop" data-testid="vp-desktop" class="st-mode-btn is-active" onclick="setViewportSize('desktop')" style="padding:2px 7px;font-size:11px;" title="데스크톱 뷰포트 (100%)">🖥</button>
            <button type="button" id="vp-btn-tablet" data-testid="vp-tablet" class="st-mode-btn" onclick="setViewportSize('tablet')" style="padding:2px 7px;font-size:11px;" title="태블릿 뷰포트 (768px)">📱태블릿</button>
            <button type="button" id="vp-btn-mobile" data-testid="vp-mobile" class="st-mode-btn" onclick="setViewportSize('mobile')" style="padding:2px 7px;font-size:11px;" title="모바일 뷰포트 (390px)">📱모바일</button>
            <button type="button" id="reset-vp-btn" data-testid="reset-viewport-override" class="st-mode-btn" onclick="resetCurrentViewportOverride()" style="padding:2px 6px;font-size:11px;" title="현재 뷰포트 오버라이드 초기화">↺</button>
          </div>
          <div class="st-mode-switch" style="padding:2px;">
            <button type="button" data-testid="zoom-out" class="st-mode-btn" onclick="stepCanvasZoom(-0.1)" style="padding:2px 6px;font-size:11px;" title="캔버스 축소">−</button>
            <span id="st-zoom-readout" data-testid="zoom-readout" class="f-mono" style="font-size:10.5px;color:#E2E8F0;padding:0 5px;display:inline-flex;align-items:center;">100%</span>
            <button type="button" data-testid="zoom-in" class="st-mode-btn" onclick="stepCanvasZoom(0.1)" style="padding:2px 6px;font-size:11px;" title="캔버스 확대">+</button>
            <button type="button" data-testid="zoom-fit" class="st-mode-btn" onclick="zoomCanvasToFit()" style="padding:2px 6px;font-size:10.5px;" title="100% 맞춤">1:1</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hidden Legacy Subbar Hook -->
    <div id="st-subbar" class="st-subbar" style="display:none;"></div>

    <!-- Fine-Tuning Popover -->
    <div id="st-tune-popover" class="st-tune-popover"></div>

    <!-- MAIN WORKSPACE -->
    <div class="st-workspace">
      <!-- LEFT VISUAL UI TRAY -->
      <aside id="st-sidebar" data-testid="left-sidebar" class="st-sidebar">
        <div class="st-tray-tabs">
          <button type="button" id="tray-tab-sections" data-testid="tray-tab-sections" class="st-tray-tab is-active" onclick="setTrayGroup('sections')">📐 섹션 블록 (13)</button>
          <button type="button" id="tray-tab-components" data-testid="tray-tab-components" class="st-tray-tab" onclick="setTrayGroup('components')">🧩 부품 UI (6)</button>
          <button type="button" id="tray-tab-themes" data-testid="tray-tab-themes" class="st-tray-tab" onclick="setTrayGroup('themes')">🎨 테마·효과 (7)</button>
          <button type="button" id="tray-tab-layers" data-testid="tray-tab-layers" class="st-tray-tab" style="display:none;">🗂 레이어</button>
        </div>

        <div class="st-sidebar-split">
          <div class="st-drawer-col">
            <div class="st-drawer-head">
              <div id="st-drawer-cat-head" class="st-tray-Subchips"></div>
              <div style="display:flex;gap:5px;align-items:center;">
                <input id="drawer-search-input" data-testid="tray-search-input" type="search" oninput="setDrawerSearch(this.value)" placeholder="252종 UI 디자인 검색 (예: 히어로, 요금표, 다크)..." class="st-drawer-search" style="flex:1;" />
                <button type="button" id="tray-wide-btn" data-testid="tray-wide-toggle" class="st-pill-btn" onclick="toggleTrayWide()" style="padding:4px 8px;font-size:11px;flex-shrink:0;" title="섹션 미리보기 패널을 620px로 넓게 보기">⇔ 더 크게</button>
              </div>
            </div>
            <div id="st-drawer-cards" class="st-drawer-cards"></div>
            <div id="st-sidebar-layer-tree-legacy" style="display:none;"></div>
            <div id="st-hidden-secs-bar" class="st-hidden-secs-bar" style="display:none;"></div>
          </div>
        </div>
      </aside>

      <!-- CENTER LIVE WEBSITE STAGE + INDIVIDUAL ASSET ATELIER OVERLAY -->
      <main class="st-stage">
        <div id="canvas-frame" data-testid="canvas-frame" data-viewport="desktop" data-zoom="1" class="st-canvas-frame">
          <div id="canvas-zoom-sizer" class="st-canvas-zoom-sizer">
            <div id="canvas-zoom-stage" data-zoom="1" class="st-canvas-zoom-stage">
              <div id="website-mount" data-testid="website-mount"></div>
            </div>
          </div>
        </div>

        <!-- 252 Individual Asset Atelier (Full Interactive Previews for Every Single Asset!) -->
        <div id="vault-view" class="st-vault-view">
          <div id="vault-toolbar" class="st-vault-toolbar"></div>
          <div id="vault-cats-bar" class="st-vault-cats"></div>
          <div id="vault-cards-grid" class="st-vault-grid"></div>
        </div>
      </main>

      <!-- RIGHT DOCKED INSPECTOR SCAFFOLD (Populated & Expanded in M2) -->
      <aside id="st-right-panel" data-testid="right-inspector"></aside>
    </div>
  </div>

  <!-- MULTI-PROJECT MANAGER MODAL (Create / Switch / Duplicate / Rename / Delete / .forma.json) -->
  <div id="projects-modal" data-testid="projects-modal" class="st-modal-backdrop" onclick="if(event.target===this)this.classList.remove('is-open')">
    <div class="st-modal-box" style="max-width:680px;">
      <div class="st-modal-head">
        <div>
          <div class="f-mono" style="font-size:11px;color:#38BDF8;font-weight:700;">MULTI-PROJECT WORKSPACE · INDEXEDDB + JSON</div>
          <div style="font-size:15px;font-weight:800;color:#F8FAFC;margin-top:2px;">📁 프로젝트 매니저 &amp; .forma.json 백업</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button type="button" data-testid="new-project-btn" class="st-pill-btn is-primary" onclick="FORMA_PRO.ProjectState.createNewProject()">+ 새 프로젝트 생성</button>
          <button type="button" class="st-pill-btn" onclick="FORMA_PRO.ProjectState.exportProjectJSON()">💾 .forma.json 저장</button>
          <button type="button" class="st-pill-btn" onclick="FORMA_PRO.ProjectState.triggerProjectJSONImport()">📂 파일 불러오기</button>
          <button type="button" class="st-pill-btn" onclick="document.getElementById('projects-modal').classList.remove('is-open')">✕ 닫기</button>
        </div>
      </div>
      <div class="st-modal-body" style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:8px;align-items:center;">
          <span style="font-size:12px;font-weight:700;color:#94A3B8;white-space:nowrap;">현재 프로젝트 이름:</span>
          <input id="current-project-name-input" data-testid="project-name-input" type="text" placeholder="프로젝트 이름 입력..." style="flex:1;background:#141824;border:1px solid rgba(255,255,255,0.16);border-radius:8px;padding:7px 11px;color:#F8FAFC;font-size:13px;outline:none;" />
          <button type="button" class="st-pill-btn is-primary" onclick="FORMA_PRO.ProjectState.updateCurrentProjectName(document.getElementById('current-project-name-input').value)">이름 저장</button>
        </div>
        <div id="projects-modal-list" style="display:flex;flex-direction:column;gap:8px;"></div>
      </div>
    </div>
  </div>

  <!-- 1-SECOND BRAND RESTYLER MODAL (F17 — WCAG 2.1 >= 4.5:1 Harmony Engine) -->
  <div id="brand-restyler-modal" data-testid="brand-restyler-modal" class="st-modal-backdrop" onclick="if(event.target===this)FORMA_PRO.BrandRestyler.closeBrandRestylerModal()">
    <div class="st-modal-box" style="max-width:620px;">
      <div class="st-modal-head">
        <div>
          <div class="f-mono" style="font-size:11px;color:#FDE047;font-weight:700;">1-SECOND BRAND RESTYLER · WCAG 2.1 HARMONY</div>
          <div style="font-size:15px;font-weight:800;color:#F8FAFC;margin-top:2px;">✨ 1초 브랜드 리스타일러 (전 페이지 일괄 변환)</div>
        </div>
        <button type="button" class="st-pill-btn" onclick="FORMA_PRO.BrandRestyler.closeBrandRestylerModal()">✕ 닫기</button>
      </div>
      <div class="st-modal-body" style="display:flex;flex-direction:column;gap:12px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div>
            <label style="display:block;font-size:11.5px;font-weight:700;color:#94A3B8;margin-bottom:4px;">브랜드명 (워터마크·헤더·히어로·푸터 반영)</label>
            <input id="brand-name-input" data-testid="brand-name-input" type="text" placeholder="예: ATELIER LUMIÈRE" style="width:100%;background:#141824;border:1px solid rgba(255,255,255,0.16);border-radius:8px;padding:8px 11px;color:#F8FAFC;font-size:13px;outline:none;" />
          </div>
          <div>
            <label style="display:block;font-size:11.5px;font-weight:700;color:#94A3B8;margin-bottom:4px;">업종 월드 프리셋</label>
            <select id="brand-world-select" data-testid="brand-world-select" style="width:100%;background:#141824;border:1px solid rgba(255,255,255,0.16);border-radius:8px;padding:8px 11px;color:#F8FAFC;font-size:13px;outline:none;">
              <option value="maison">🏛 건축 · 프라이빗 빌라 (MAISON)</option>
              <option value="obsidian">⚡ AI · 엔터프라이즈 테크 (OBSIDIAN)</option>
              <option value="botanica">🌿 보태니컬 뷰티 · 향수 (BOTANICA)</option>
              <option value="eclipse">🍷 미슐랭 파인다이닝 (ECLIPSE)</option>
              <option value="hanlaw">⚖️ 기업 로펌 · 자문 (HANLAW)</option>
              <option value="kinetic">✦ 크리에이티브 에이전시 (KINETIC)</option>
            </select>
          </div>
        </div>

        <div>
          <label style="display:block;font-size:11.5px;font-weight:700;color:#94A3B8;margin-bottom:4px;">브랜드 슬로건 / 아이브로우</label>
          <input id="brand-slogan-input" data-testid="brand-slogan-input" type="text" placeholder="예: PRIVATE ARCHITECTURAL SANCTUARY · SEOUL" style="width:100%;background:#141824;border:1px solid rgba(255,255,255,0.16);border-radius:8px;padding:8px 11px;color:#F8FAFC;font-size:13px;outline:none;" />
        </div>

        <div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:10px;align-items:end;">
          <div>
            <label style="display:block;font-size:11.5px;font-weight:700;color:#94A3B8;margin-bottom:4px;">대표 컬러</label>
            <input id="brand-primary-color" data-testid="brand-primary-color" type="color" value="#8C5A32" oninput="FORMA_PRO.BrandRestyler.updateBrandRestylerPreview()" style="width:52px;height:36px;border:1px solid rgba(255,255,255,0.2);border-radius:8px;background:#141824;cursor:pointer;" />
          </div>
          <div>
            <label style="display:block;font-size:11.5px;font-weight:700;color:#94A3B8;margin-bottom:4px;">배경 무드 (Light / Dark)</label>
            <button type="button" id="brand-mood-toggle" data-testid="brand-mood-toggle" data-mood="light" class="st-pill-btn" onclick="FORMA_PRO.BrandRestyler.toggleBrandMood()" style="width:100%;justify-content:center;padding:8px 10px;">☀️ Light 무드 (에디토리얼 라이트)</button>
          </div>
          <div>
            <label style="display:block;font-size:11.5px;font-weight:700;color:#94A3B8;margin-bottom:4px;">타이포그래피 서체 페어링</label>
            <select id="brand-font-select" data-testid="brand-font-select" style="width:100%;background:#141824;border:1px solid rgba(255,255,255,0.16);border-radius:8px;padding:8px 10px;color:#F8FAFC;font-size:12.5px;outline:none;">
              <option value="FNT-01">FNT-01 · 에디토리얼 럭셔리 세리프</option>
              <option value="FNT-02">FNT-02 · 네오 그로테스크 산세리프</option>
              <option value="FNT-03">FNT-03 · 아방가르드 와이드 디스플레이</option>
              <option value="FNT-04">FNT-04 · 헤리티지 고전 명조</option>
              <option value="FNT-05">FNT-05 · 스위스 아키텍처 지오메트릭</option>
              <option value="FNT-06">FNT-06 · 엔지니어링 모노스페이스</option>
              <option value="FNT-07">FNT-07 · 오뜨꾸뛰르 하이콘트라스트</option>
              <option value="FNT-08">FNT-08 · 미니멀 젠 울트라라이트</option>
            </select>
          </div>
        </div>

        <div id="brand-harmony-preview"></div>

        <div style="display:flex;justify-content:flex-end;gap:8px;padding-top:6px;">
          <button type="button" class="st-pill-btn" onclick="FORMA_PRO.BrandRestyler.closeBrandRestylerModal()">취소</button>
          <button type="button" data-testid="apply-brand-btn" class="st-pill-btn is-primary" onclick="FORMA_PRO.BrandRestyler.applyBrandProfileFromModal()" style="padding:8px 18px;">✨ 전 페이지 1초 브랜드 적용 (Undo 지원)</button>
        </div>
      </div>
    </div>
  </div>

  <!-- CLIENT PREVIEW & SHAREABLE LINK MODAL (?mode=client — F18) -->
  <div id="client-share-modal" data-testid="client-share-modal" class="st-modal-backdrop" onclick="if(event.target===this)FORMA_PRO.ClientMode.closeClientShareModal()">
    <div class="st-modal-box" style="max-width:620px;">
      <div class="st-modal-head">
        <div>
          <div class="f-mono" style="font-size:11px;color:#6EE7B7;font-weight:700;">EDITOR-FREE CLIENT PREVIEW (?mode=client)</div>
          <div style="font-size:15px;font-weight:800;color:#F8FAFC;margin-top:2px;">🔗 클라이언트 전용 프리뷰 &amp; 공유 링크</div>
        </div>
        <button type="button" class="st-pill-btn" onclick="FORMA_PRO.ClientMode.closeClientShareModal()">✕ 닫기</button>
      </div>
      <div class="st-modal-body" style="display:flex;flex-direction:column;gap:12px;">
        <p style="margin:0;font-size:12.5px;color:#94A3B8;line-height:1.6;">
          아래 링크를 열면 상단바·사이드바·가이드라인 등 편집기 UI가 100% 제거된 <strong>순수 실제 웹사이트(?mode=client)</strong>로 열리며, 모든 페이지(Home / About / Portfolio / Contact) 네비게이션이 실제 작동합니다.
        </p>
        <div style="display:flex;gap:8px;">
          <input id="client-share-url-input" data-testid="client-share-url-input" type="text" readonly style="flex:1;background:#141824;border:1px solid rgba(255,255,255,0.16);border-radius:8px;padding:8px 11px;color:#7DD3FC;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;" />
          <button type="button" data-testid="copy-client-link" class="st-pill-btn is-primary" onclick="FORMA_PRO.ClientMode.copyClientShareLink()">📋 링크 복사</button>
          <button type="button" data-testid="open-client-tab-btn" class="st-pill-btn" onclick="FORMA_PRO.ClientMode.openClientPreviewWindow()">↗ 새 창으로 열기</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SELF-CONTAINED CODE + LIVE SANDBOX PREVIEW MODAL -->
  <div id="export-modal" data-testid="export-modal" class="st-modal-backdrop" onclick="if(event.target===this)this.classList.remove('is-open')">
    <div class="st-modal-box">
      <div class="st-modal-head">
        <div>
          <div id="export-modal-tag" class="f-mono" style="font-size:11px;color:#38BDF8;">PRODUCTION EXPORT</div>
          <div id="export-modal-title" style="font-size:15px;font-weight:800;color:#F8FAFC;margin-top:2px;">완성 홈페이지 소스코드</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <div class="st-mode-switch">
            <button type="button" id="exp-tab-code" class="st-mode-btn is-active" onclick="setExportModalTab('code')">&lt;/&gt; 소스코드</button>
            <button type="button" id="exp-tab-preview" class="st-mode-btn" onclick="setExportModalTab('preview')">▶ 독립 실행 테스트</button>
          </div>
          <button type="button" data-testid="copy-export-code" class="st-pill-btn is-primary" onclick="copyExportCode()">클립보드 복사</button>
          <button type="button" data-testid="download-export-html" class="st-pill-btn" onclick="downloadExportHTML()">.html 저장</button>
          <button type="button" class="st-pill-btn" onclick="document.getElementById('export-modal').classList.remove('is-open')">✕ 닫기</button>
        </div>
      </div>
      <div class="st-modal-body">
        <textarea id="export-code-area" data-testid="export-code-area" readonly style="width:100%;height:420px;background:#08090D;color:#E2E8F0;border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:16px;font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.65;resize:vertical;"></textarea>
        <iframe id="export-preview-frame" title="Standalone Asset Sandbox" style="display:none;width:100%;height:420px;background:#08090D;border:1px solid rgba(255,255,255,0.12);border-radius:10px;"></iframe>
      </div>
    </div>
  </div>

  <!-- IMAGE LIGHTBOX MODAL -->
  <div id="lightbox-modal" class="st-modal-backdrop" onclick="this.classList.remove('is-open')">
    <div class="st-modal-box" style="max-width:740px;" onclick="event.stopPropagation()">
      <div class="st-modal-head">
        <div>
          <div id="lightbox-meta" class="f-mono" style="font-size:11px;color:#38BDF8;">ARCHIVE PLATE</div>
          <div id="lightbox-title" style="font-size:15px;font-weight:800;color:#F8FAFC;margin-top:2px;">작품 상세 뷰</div>
        </div>
        <button type="button" class="st-pill-btn" onclick="document.getElementById('lightbox-modal').classList.remove('is-open')">✕ 닫기</button>
      </div>
      <div class="st-modal-body" style="text-align:center;">
        <img id="lightbox-img" src="" alt="Lightbox" style="width:100%;max-height:400px;object-fit:cover;border-radius:10px;" />
      </div>
    </div>
  </div>

  <div id="st-toast" class="st-toast"></div>

  <script id="forma-main-script">
{js1}

{js2}

{js3}

{js4_state}

{js5_brand}

{js_engine}{extra_js_bundle}
  </script>
</body>
</html>
"""

# Verify zero external http(s):// URLs (excluding W3C SVG namespace URIs)
external_urls = [
    u for u in re.findall(r"https?://[^\s\"'<>)]+", html)
    if not u.startswith("http://www.w3.org/")
]
if external_urls:
    raise AssertionError(f"External URLs found in compiled HTML: {external_urls}")

outputs = []
if REPO_GIT.exists():
    for rel_name in ("index.html", "forma_studio.html", "web_design_library.html", "FORMA_STUDIO_v10.html", "FORMA_STUDIO_Pro.html"):
        out_p = REPO_GIT / rel_name
        out_p.write_text(html, encoding="utf-8")
        outputs.append(out_p)
    if (REPO_GIT / "v10").exists():
        out_v10 = REPO_GIT / "v10" / "index.html"
        out_v10.write_text(html, encoding="utf-8")
        outputs.append(out_v10)

if REPO_LIB.exists():
    for opt_lib_html in ("index.html", "FORMA_STUDIO_v6.html", "FORMA_STUDIO_v8.html", "FORMA_STUDIO_v10.html", "FORMA_STUDIO_Pro.html"):
        opt_p = REPO_LIB / opt_lib_html
        opt_p.write_text(html, encoding="utf-8")
        outputs.append(opt_p)

if ARTIFACT_DIR.exists():
    for art_name in ("forma_studio.html", "web_design_library.html", "FORMA_STUDIO_v10.html"):
        art_p = ARTIFACT_DIR / art_name
        art_p.write_text(html, encoding="utf-8")
        outputs.append(art_p)

    now_iso = "2026-11-11T09:00:00.000000000Z"
    pro_summary = (
        "FORMA STUDIO Pro — 6개 산업 월드 × 26개 슬롯 × 252종 라이브 인터랙티브 에셋, "
        "피그마급 우측 속성 인스펙터(Design/Interact) & 레이어 트리, 30%~150% 자유 줌 & 마키 다중 선택/정렬, "
        "데스크톱/태블릿/모바일 독립 반응형 오버라이드, 1초 브랜드 리스타일러 및 ?mode=client 클라이언트 프리뷰를 탑재한 올인원 비주얼 웹 스튜디오"
    )
    for meta_name in ("forma_studio.html.metadata.json", "web_design_library.html.metadata.json"):
        meta_p = ARTIFACT_DIR / meta_name
        meta_p.write_text(
            json.dumps(
                {
                    "summary": pro_summary,
                    "updatedAt": now_iso,
                    "userFacing": True,
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

    live_url_p = ARTIFACT_DIR / "FORMA STUDIO v6 Live Site.url.json"
    live_url_p.write_text(
        json.dumps(
            {
                "url": "https://smrmrmaakaak.github.io/forma-studio-v6/",
                "title": "FORMA STUDIO Pro — 초고자유도 비주얼 웹디자인 스튜디오 (GitHub Pages)",
                "description": pro_summary,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    live_url_meta_p = ARTIFACT_DIR / "FORMA STUDIO v6 Live Site.url.json.metadata.json"
    live_url_meta_p.write_text(
        json.dumps(
            {
                "summary": "FORMA STUDIO Pro GitHub Pages 라이브 배포 링크 (https://smrmrmaakaak.github.io/forma-studio-v6/)",
                "updatedAt": now_iso,
                "userFacing": True,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

# Sync v6 source files and fonts between REPO_GIT and REPO_LIB
for target_repo in (REPO_GIT, REPO_LIB):
    target_v6 = target_repo / "v6"
    if target_repo.exists() and target_v6.resolve() != ROOT.resolve():
        target_v6.mkdir(parents=True, exist_ok=True)
        for src_f in sorted(ROOT.iterdir()):
            if src_f.is_file() and src_f.suffix in {".css", ".js", ".py"}:
                shutil.copy2(src_f, target_v6 / src_f.name)
    target_fonts = target_repo / "fonts"
    if target_repo.exists() and target_fonts.resolve() != FONTS_DIR.resolve():
        target_fonts.mkdir(parents=True, exist_ok=True)
        for fn in ("embedded_fonts.css", "embedded_fonts_v6_clean.css", "embedded_fonts_v6_clean.sig"):
            src_fn = FONTS_DIR / fn
            if src_fn.exists():
                shutil.copy2(src_fn, target_fonts / fn)

print(
    f"Compiled {', '.join(str(p) for p in outputs)}: "
    f"{len(html):,} bytes ({len(html.splitlines()):,} lines) — 0 external URLs"
)
