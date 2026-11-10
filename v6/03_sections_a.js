/* ==========================================================================
   FORMA STUDIO v6 — ARCHITECTURAL SECTIONS PART A
   14. Topbar (8) · 15. Navbar (8) · 16. Hero (10) · 17. Divider (8) · 18. Stats (8) · 19. Feature (8)
   ========================================================================== */

function fmtHeadline(pre, accent, tfxId) {
  const full = `${pre} <span class="f-accent-word" data-scramble="${accent}">${accent}</span>`;
  if (tfxId === 'TFX-02') {
    const words = pre.split(' ').map((w, i) => `<span class="tfx-word"><span style="--wi:${i}">${w}</span></span>`).join(' ');
    return `${words} <span class="tfx-word"><span style="--wi:5" class="f-accent-word">${accent}</span></span>`;
  }
  return full;
}

Object.assign(VAULT, {

  /* 14. TOP ANNOUNCEMENT BARS (8) */
  topbar: [
    { id: 'TOP-01', name: '에디토리얼 모노그래프 이슈 바', desc: '좌측 에디션 넘버와 우측 아카이브 로케이션을 절제된 자간으로 표기',
      render: (w) => `<div style="border-bottom:1px solid var(--border);padding:9px var(--sec-px);display:flex;justify-content:space-between;align-items:center;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:var(--sub);">
        <span>${w.edition}</span>
        <span class="hide-narrow">${w.eyebrow}</span>
        <span class="f-mono" style="color:var(--fg);">SEOUL 37.57°N</span>
      </div>` },
    { id: 'TOP-02', name: '하이콘트라스트 인버트 프로모션 바', desc: '배경 반전 잉크 톤으로 시즌 프라이빗 혜택을 명확하게 고지',
      render: (w) => `<div style="background:var(--fg);color:var(--bg);padding:9px var(--sec-px);display:flex;justify-content:space-between;align-items:center;font-size:12px;">
        <span><strong>${w.brand}</strong> — ${w.edition} 공식 웹사이트 단독 프라이빗 우대 프로그램 오픈</span>
        <span class="f-mono hide-narrow" style="text-decoration:underline;cursor:pointer;" onclick="document.getElementById('sec-pricing')?.scrollIntoView({behavior:'smooth'})">EXPLORE →</span>
      </div>` },
    { id: 'TOP-03', name: '전담 컨시어지 핫라인 & 다국어 바', desc: 'VIP 예약 직통 번호와 지원 언어를 상단에 신뢰감 있게 배치',
      render: () => `<div style="background:var(--muted);border-bottom:1px solid var(--border);padding:8px var(--sec-px);display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--sub);">
        <span>전담 컨시어지 데스크 <strong style="color:var(--fg);margin-left:6px;">02 · 555 · 8200</strong> (09:00–21:00)</span>
        <span class="f-mono" style="font-size:12px;color:var(--fg);">KR / EN / JP / FR</span>
      </div>` },
    { id: 'TOP-04', name: '키네틱 무한 루프 마키 스트립', desc: '상단 엣지에서 끊김 없이 흐르는 타이포그래피 티커 바',
      render: (w) => `<div style="background:var(--fg);color:var(--bg);padding:8px 0;overflow:hidden;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:0.12em;">
        <div class="f-marquee-track">${[...w.marquee, ...w.marquee, ...w.marquee].map(m => `<span style="margin:0 28px;">✦ ${m}</span>`).join('')}</div>
      </div>` },
    { id: 'TOP-05', name: '글로벌 3대 거점 라이브 월드클락 바', desc: '서울·파리·뉴욕 오피스/플래그십의 실시간 운영 상태 표시',
      render: () => `<div style="background:var(--surface);border-bottom:1px solid var(--border);padding:8px var(--sec-px);display:flex;justify-content:space-between;align-items:center;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--sub);">
        <span><strong style="color:var(--accent);">●</strong> SEOUL 14:20 KST</span>
        <span class="hide-narrow">PARIS 06:20 CET</span>
        <span class="hide-narrow">NEW YORK 00:20 EST</span>
        <span style="color:var(--fg);">RESERVATIONS OPEN</span>
      </div>` },
    { id: 'TOP-06', name: '스위스 3분할 아키텍처 인덱스 바', desc: '수직 보더선으로 정밀 구획된 크리에이티브 스튜디오 상단 바',
      render: (w) => `<div class="fg-3" style="gap:0;border-bottom:1.5px solid var(--fg);font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;">
        <div style="padding:8px 20px;border-right:1.5px solid var(--fg);">INDEX // 2026</div>
        <div style="padding:8px 20px;border-right:1.5px solid var(--fg);text-align:center;">${w.brand}</div>
        <div style="padding:8px 20px;text-align:right;color:var(--accent);">EDITION AVAILABLE</div>
      </div>` },
    { id: 'TOP-07', name: '액센트 3px 시그니처 크라운 라인', desc: '텍스트 없이 브랜드 시그니처 컬러 3px 상단 라인만 남긴 미니멀 마감',
      render: () => `<div style="height:3px;width:100%;background:var(--accent);"></div>` },
    { id: 'TOP-08', name: '상단 바 없음 (미니멀 클린 스타트)', desc: '최상단 어나운스 바를 생략하고 네비게이션 헤더부터 즉시 시작',
      render: () => `` }
  ],

  /* 15. NAVIGATION HEADERS (8) */
  navbar: [
    { id: 'NAV-01', name: '아키텍처 스탠다드 플래그십 GNB', desc: '좌측 워드마크, 중앙 정돈된 메뉴, 우측 장착 버튼이 조화를 이루는 정석 헤더',
      render: (w, ctx) => `<header style="padding:18px var(--sec-px);border-bottom:1px solid var(--border);background:color-mix(in srgb, var(--bg) 88%, transparent);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:space-between;gap:20px;">
        <a href="#top" onclick="event.preventDefault()" style="font-family:var(--font-display);font-weight:700;font-size:20px;letter-spacing:0.02em;color:var(--fg);text-decoration:none;">${w.brand}</a>
        <nav class="hide-narrow" style="display:flex;align-items:center;gap:30px;font-size:13px;font-weight:500;color:var(--sub);">
          ${w.nav.map((n, i) => `<a href="#sec-${['feature','gallery','process','pricing'][i]||'feature'}" onclick="event.preventDefault();document.getElementById('sec-${['feature','gallery','process','pricing'][i]||'feature'}')?.scrollIntoView({behavior:'smooth'})" style="color:${i===0?'var(--fg)':'var(--sub)'};text-decoration:none;">${n}</a>`).join('')}
        </nav>
        <div>${ctx.btn(w.ctaPrimary)}</div>
      </header>` },
    { id: 'NAV-02', name: '플로팅 글래스 아일랜드 캡슐 (Linear/Apple풍)', desc: '상단 여백 중앙에 부유하는 반투명 유리 캡슐 독 내비게이션',
      render: (w, ctx) => `<div style="padding:16px var(--sec-px) 6px;display:flex;justify-content:center;">
        <header style="width:100%;max-width:1160px;padding:10px 12px 10px 24px;border-radius:999px;background:color-mix(in srgb, var(--surface) 82%, transparent);backdrop-filter:blur(20px);border:1px solid var(--border);box-shadow:0 16px 40px -14px rgba(0,0,0,0.12);display:flex;align-items:center;justify-content:space-between;gap:16px;">
          <span style="font-family:var(--font-display);font-weight:700;font-size:17px;">${w.brand}</span>
          <nav class="hide-narrow" style="display:flex;gap:26px;font-size:13px;font-weight:500;color:var(--sub);">
            ${w.nav.map((n, i) => `<span style="cursor:pointer;" onclick="document.getElementById('sec-${['feature','gallery','team','pricing'][i]||'feature'}')?.scrollIntoView({behavior:'smooth'})">${n}</span>`).join('')}
          </nav>
          <div>${ctx.btn(w.ctaPrimary)}</div>
        </header>
      </div>` },
    { id: 'NAV-03', name: '보그 센터 마스트헤드 에디토리얼 헤더', desc: '중앙 대형 세리프 로고와 좌우 대칭 메뉴로 완성한 하이엔드 호텔·매거진 헤더',
      render: (w, ctx) => `<header style="padding:22px var(--sec-px);border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;">
        <nav class="hide-narrow" style="display:flex;gap:22px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:var(--sub);">
          <span style="cursor:pointer;" onclick="document.getElementById('sec-feature')?.scrollIntoView({behavior:'smooth'})">${w.nav[0]}</span>
          <span style="cursor:pointer;" onclick="document.getElementById('sec-gallery')?.scrollIntoView({behavior:'smooth'})">${w.nav[1]}</span>
        </nav>
        <div style="font-family:var(--font-display);font-size:25px;font-weight:var(--display-weight);letter-spacing:0.12em;text-align:center;">${w.brand}</div>
        <div style="display:flex;justify-content:flex-end;align-items:center;gap:18px;">
          <span class="hide-narrow" style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:var(--sub);cursor:pointer;" onclick="document.getElementById('sec-pricing')?.scrollIntoView({behavior:'smooth'})">${w.nav[3]}</span>
          ${ctx.btn('RESERVE')}
        </div>
      </header>` },
    { id: 'NAV-04', name: '스위스 아키텍처 그리드 셀 헤더', desc: '수직 실선으로 각 메뉴 셀을 구획한 모더니즘 스튜디오 헤더',
      render: (w, ctx) => `<header style="display:grid;grid-template-columns:1.4fr 2fr auto;border-bottom:1.5px solid var(--fg);align-items:stretch;">
        <div style="padding:16px 26px;border-right:1.5px solid var(--fg);display:flex;align-items:center;font-family:var(--font-display);font-weight:800;font-size:19px;">${w.brand}</div>
        <div class="hide-narrow" style="padding:16px 26px;border-right:1.5px solid var(--fg);display:flex;align-items:center;justify-content:space-around;font-family:'JetBrains Mono',monospace;font-size:12px;">
          ${w.nav.slice(0,3).map((n,i)=>`<span style="cursor:pointer;" onclick="document.getElementById('sec-${['feature','process','gallery'][i]}') ?.scrollIntoView({behavior:'smooth'})">0${i+1}. ${n}</span>`).join('')}
        </div>
        <div style="padding:10px 18px;display:flex;align-items:center;">${ctx.btn(w.ctaPrimary)}</div>
      </header>` },
    { id: 'NAV-05', name: '이그제큐티브 2단 프라이빗 뱅킹 헤더', desc: '상단 브랜드·자문 데스크 층과 하단 전문 센터 네비게이션 층을 분리',
      render: (w, ctx) => `<header style="border-bottom:1px solid var(--border);background:var(--surface);">
        <div style="padding:16px var(--sec-px);border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:baseline;gap:14px;">
            <span style="font-family:var(--font-display);font-weight:700;font-size:22px;">${w.brand}</span>
            <span class="hide-narrow" style="font-size:12px;color:var(--sub);letter-spacing:0.06em;">${w.eyebrow}</span>
          </div>
          ${ctx.btn(w.ctaPrimary)}
        </div>
        <div style="padding:10px var(--sec-px);background:var(--muted);display:flex;gap:32px;font-size:12px;font-weight:600;overflow-x:auto;">
          ${w.nav.map(n => `<span style="white-space:nowrap;cursor:pointer;">${n}</span>`).join('')}
        </div>
      </header>` },
    { id: 'NAV-06', name: '커맨드 팔레트(⌘K) 결합 테크 헤더', desc: '검색 단축키 필과 버전 배지를 포함한 모던 프로덕트 헤더',
      render: (w, ctx) => `<header style="padding:16px var(--sec-px);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:16px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-family:var(--font-display);font-weight:800;font-size:18px;">${w.brand}</span>
          <span class="f-mono" style="font-size:12px;padding:2px 8px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-weight:600;">2026.6</span>
        </div>
        <div class="hide-narrow" onclick="setStudioMode('vault')" style="padding:7px 16px;border-radius:999px;background:var(--muted);border:1px solid var(--border);font-size:12px;color:var(--sub);display:flex;align-items:center;gap:24px;cursor:pointer;">
          <span>전체 252종 디자인 에셋 검색 열기...</span>
          <kbd class="f-mono" style="font-size:12px;padding:1px 6px;border-radius:4px;background:var(--surface);border:1px solid var(--border);color:var(--fg);">⌘K</kbd>
        </div>
        <div>${ctx.btn(w.ctaPrimary)}</div>
      </header>` },
    { id: 'NAV-07', name: '보더리스 갤러리 호라이즌 헤더', desc: '구분선 없이 압도적 공간감으로 시작하는 파인아트 갤러리 스타일',
      render: (w, ctx) => `<header style="padding:28px var(--sec-px) 12px;display:flex;align-items:center;justify-content:space-between;">
        <span style="font-family:var(--font-display);font-size:22px;font-weight:600;letter-spacing:0.06em;">${w.brand}</span>
        <div style="display:flex;align-items:center;gap:28px;">
          <nav class="hide-narrow" style="display:flex;gap:24px;font-size:13px;color:var(--sub);">${w.nav.slice(0,3).map(n=>`<span>${n}</span>`).join('')}</nav>
          ${ctx.btn(w.ctaPrimary)}
        </div>
      </header>` },
    { id: 'NAV-08', name: '다크 모놀리스 인버트 헤더', desc: '라이트 테마에서도 상단을 묵직한 다크 잉크 바로 잡아주는 대비형 헤더',
      render: (w, ctx) => `<header style="padding:16px var(--sec-px);background:var(--fg);color:var(--bg);display:flex;align-items:center;justify-content:space-between;">
        <span style="font-family:var(--font-display);font-size:19px;font-weight:700;letter-spacing:0.08em;">${w.brand}</span>
        <nav class="hide-narrow" style="display:flex;gap:28px;font-size:12px;opacity:0.84;">${w.nav.map(n=>`<span>${n}</span>`).join('')}</nav>
        <div>${ctx.btn(w.ctaPrimary)}</div>
      </header>` }
  ],

  /* ========================================================================
     16. HERO ARCHITECTURES (10 Radically Distinct Full-Scale Compositions!
         Every single Hero dynamically binds Font, TextFX, Button, Badge & Surface!)
     ======================================================================== */
  hero: [
    {
      id: 'HERO-01', name: '풀블리드 시네마틱 커버 & 플로팅 글래스 컨시어지 독',
      desc: '대화면 풀블리드 화보 위에 장착된 서체·타이포 효과·피직스 버튼·플로팅 유리 독이 결합된 시그니처 히어로',
      render: (w, ctx) => `
      <section class="f-hero-01" style="position:relative;min-height:590px;display:flex;flex-direction:column;justify-content:flex-end;padding:52px var(--sec-px) 42px;border-bottom:1px solid var(--border);overflow:hidden;color:#F8F6F2;">
        <img src="${IMG[w.heroImg]}" alt="${w.brand}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;transform:scale(1.02);" />
        <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(8,9,12,0.28) 0%, rgba(8,9,12,0.52) 48%, rgba(8,9,12,0.9) 100%);z-index:1;"></div>
        <div class="f-container" style="position:relative;z-index:2;width:100%;padding:0;">
          <div class="f-reveal" style="--stagger:0;margin-bottom:16px;">
            <span class="${ctx.bdgCls}" style="color:#F8FAFC;border-color:rgba(255,255,255,0.35);">${w.eyebrow}</span>
          </div>
          <h1 class="f-h1 f-reveal" style="--stagger:1;max-width:880px;color:#FFFFFF;margin-bottom:18px;">
            ${fmtHeadline(w.h1Pre, w.h1Accent, ctx.tfxId)}
          </h1>
          <p class="f-reveal" style="--stagger:2;max-width:590px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.84);margin:0 0 30px;">${w.h1Sub}</p>
          <div class="f-reveal fg-4" style="--stagger:3;padding:18px 24px;border-radius:var(--radius);background:rgba(15,17,23,0.78);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.2);align-items:center;">
            <div><div style="font-size:12px;color:rgba(255,255,255,0.62);">PROGRAM / EDITION</div><div style="font-size:14px;font-weight:700;margin-top:3px;color:#fff;">${w.works[0].title}</div></div>
            <div><div style="font-size:12px;color:rgba(255,255,255,0.62);">AVAILABILITY</div><div style="font-size:14px;font-weight:700;margin-top:3px;color:#fff;">2026 Q4 · 프라이빗 오픈</div></div>
            <div><div style="font-size:12px;color:rgba(255,255,255,0.62);">CURATED RATE</div><div class="f-mono" style="font-size:14px;font-weight:700;margin-top:3px;color:var(--accent);filter:brightness(1.35);">${w.works[0].price}</div></div>
            <div style="display:flex;justify-content:flex-end;" onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})">${ctx.btn(w.ctaPrimary)}</div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'HERO-02', name: '비대칭 12컬럼 에디토리얼 스플릿 & 플로팅 카드',
      desc: '컬러·셰이더·한글서체·키네틱타이포·버튼·카드·사진마스크·배지 8대 에셋이 한 화면에서 즉시 반응하는 대표 스플릿 히어로',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12">
          <div class="fc-6" style="display:flex;flex-direction:column;gap:20px;">
            <div class="f-reveal" style="--stagger:0"><span class="${ctx.bdgCls}">${w.eyebrow}</span></div>
            <h1 class="f-h1 f-reveal" style="--stagger:1">${fmtHeadline(w.h1Pre, w.h1Accent, ctx.tfxId)}</h1>
            <p class="f-reveal" style="--stagger:2;font-size:15px;line-height:1.75;color:var(--sub);margin:0;max-width:520px;">${w.h1Sub}</p>
            <div class="f-reveal" style="--stagger:3;display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding-top:4px;">
              <div onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})">${ctx.btn(w.ctaPrimary)}</div>
              <button type="button" onclick="document.getElementById('sec-gallery')?.scrollIntoView({behavior:'smooth'})" style="background:transparent;border:none;color:var(--fg);font-size:13px;font-weight:600;padding:12px 14px;cursor:pointer;text-decoration:underline;text-underline-offset:5px;">${w.ctaSecondary}</button>
            </div>
            <div class="f-reveal" style="--stagger:4;display:flex;gap:30px;padding-top:18px;margin-top:4px;border-top:1px solid var(--border);">
              ${w.metrics.slice(0,3).map(m => `<div><div class="f-mono" style="font-size:20px;font-weight:700;color:var(--fg);">${m.num}<span style="color:var(--accent);font-size:14px;">${m.suffix}</span></div><div style="font-size:12px;color:var(--sub);">${m.label}</div></div>`).join('')}
            </div>
          </div>
          <div class="fc-6 f-reveal" style="--stagger:2;position:relative;">
            <div class="f-media" style="aspect-ratio:4/4.1;box-shadow:0 30px 70px -24px rgba(0,0,0,0.24);">
              <img src="${IMG[w.heroImg]}" alt="${w.brand}" />
            </div>
            <div class="f-card" style="position:absolute;left:-16px;bottom:20px;max-width:276px;padding:16px 20px;box-shadow:0 20px 50px rgba(0,0,0,0.18);">
              <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">★ 4.98 VERIFIED</div>
              <div style="font-size:13px;font-weight:600;margin-top:4px;line-height:1.45;">"${w.reviews[0].quote.slice(0,46)}..."</div>
              <div style="font-size:12px;color:var(--sub);margin-top:6px;">— ${w.reviews[0].author}, ${w.reviews[0].role}</div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'HERO-03', name: '자이언트 마스트헤드 매거진 커버 (Awwwards SOTD풍)',
      desc: '화면 양 끝을 가득 채우는 초대형 마스트헤드 타이포그래피와 21:9 와이드 파노라마 화보',
      render: (w, ctx) => `
      <section class="f-sec" style="padding-top:34px;">
        <div class="f-container">
          <div class="f-reveal" style="display:flex;justify-content:space-between;align-items:center;padding-bottom:16px;border-bottom:1px solid var(--fg);font-family:'JetBrains Mono',monospace;font-size:12px;">
            <span>${w.edition}</span>
            <span class="${ctx.bdgCls}">${w.eyebrow}</span>
            <span>ARCHIVE 01 — 04</span>
          </div>
          <h1 class="f-h1 f-reveal" style="--stagger:1;font-size:clamp(2.6rem, 6.6vw, 5.8rem);line-height:1.02;padding:26px 0;text-align:center;">
            ${fmtHeadline(w.h1Pre, w.h1Accent, ctx.tfxId)}
          </h1>
          <div class="fg-12 f-reveal" style="--stagger:2;padding-bottom:26px;align-items:end;">
            <p class="fc-7" style="margin:0;font-size:15px;color:var(--sub);max-width:580px;">${w.h1Sub}</p>
            <div class="fc-5" style="display:flex;justify-content:flex-end;gap:12px;">${ctx.btn(w.ctaPrimary)}</div>
          </div>
          <div class="f-media f-reveal" style="--stagger:3;aspect-ratio:21/9;">
            <img src="${IMG[w.heroImg]}" alt="${w.brand}" />
          </div>
        </div>
      </section>`
    },
    {
      id: 'HERO-04', name: '인터랙티브 3장 부채꼴 포토 덱 히어로',
      desc: '중앙 에디토리얼 타이틀 아래 3장의 화보 카드가 부채꼴로 펼쳐져 클릭 시 주연 화보가 확대되는 입체 덱',
      render: (w, ctx) => `
      <section class="f-sec" style="text-align:center;">
        <div class="f-container" style="display:flex;flex-direction:column;align-items:center;">
          <div class="f-reveal"><span class="${ctx.bdgCls}">${w.eyebrow}</span></div>
          <h1 class="f-h1 f-reveal" style="--stagger:1;max-width:820px;margin-top:16px;">${fmtHeadline(w.h1Pre, w.h1Accent, ctx.tfxId)}</h1>
          <p class="f-reveal" style="--stagger:2;max-width:580px;font-size:15px;color:var(--sub);margin:18px 0 26px;">${w.h1Sub}</p>
          <div class="f-reveal" style="--stagger:3;margin-bottom:40px;">${ctx.btn(w.ctaPrimary)}</div>
          <div class="fg-3 f-reveal" style="--stagger:4;width:100%;align-items:center;">
            <div class="f-card" style="padding:10px;transform:rotate(-2.5deg);cursor:pointer;" onclick="openImageLightbox('${w.secImg1}','${w.works[1].title.replace(/'/g,"")}','${w.works[1].price}')"><div class="f-media" style="aspect-ratio:4/3;"><img src="${IMG[w.secImg1]}" alt="Deck 1"/></div><div style="font-size:12px;font-weight:600;padding-top:10px;">01 · ${w.works[1].title}</div></div>
            <div class="f-card" style="padding:12px;transform:translateY(-14px) scale(1.05);z-index:4;border-color:var(--accent);box-shadow:0 28px 60px -18px rgba(0,0,0,0.28);cursor:pointer;" onclick="openImageLightbox('${w.heroImg}','${w.works[0].title.replace(/'/g,"")}','${w.works[0].price}')"><div class="f-media" style="aspect-ratio:4/3;"><img src="${IMG[w.heroImg]}" alt="Deck Main"/></div><div style="font-size:13px;font-weight:700;padding-top:10px;color:var(--accent);">✦ ${w.works[0].title}</div></div>
            <div class="f-card" style="padding:10px;transform:rotate(2.5deg);cursor:pointer;" onclick="openImageLightbox('${w.secImg2}','${w.works[2].title.replace(/'/g,"")}','${w.works[2].price}')"><div class="f-media" style="aspect-ratio:4/3;"><img src="${IMG[w.secImg2]}" alt="Deck 3"/></div><div style="font-size:12px;font-weight:600;padding-top:10px;">03 · ${w.works[2].title}</div></div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'HERO-05', name: 'Linear/Apple풍 3D 퍼스펙티브 글래스 스테이지',
      desc: '집중도 높은 센터 헤드라인 아래 3차원 원근 기울기가 적용된 인터랙티브 라이브 쇼케이스 프레임 배치',
      render: (w, ctx) => `
      <section class="f-sec" style="text-align:center;">
        <div class="f-container" style="display:flex;flex-direction:column;align-items:center;">
          <div class="f-reveal"><span class="${ctx.bdgCls}">${w.edition}</span></div>
          <h1 class="f-h1 f-reveal" style="--stagger:1;max-width:860px;margin-top:18px;">${fmtHeadline(w.h1Pre, w.h1Accent, ctx.tfxId)}</h1>
          <p class="f-reveal" style="--stagger:2;max-width:600px;font-size:15px;color:var(--sub);margin:18px 0 28px;">${w.h1Sub}</p>
          <div class="f-reveal" style="--stagger:3;display:flex;gap:12px;justify-content:center;margin-bottom:44px;">${ctx.btn(w.ctaPrimary)}</div>
          <div class="f-card f-reveal" style="--stagger:4;width:100%;padding:14px;transform:perspective(1200px) rotateX(4deg);box-shadow:0 36px 90px -24px rgba(0,0,0,0.35);">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px 14px;border-bottom:1px solid var(--border);font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--sub);">
              <div style="display:flex;gap:6px;"><span style="width:9px;height:9px;border-radius:99px;background:#EF4444;"></span><span style="width:9px;height:9px;border-radius:99px;background:#F59E0B;"></span><span style="width:9px;height:9px;border-radius:99px;background:#10B981;"></span></div>
              <span>${w.brand} — INTERACTIVE STUDIO VIEWPORT</span>
              <span style="color:var(--accent);">LIVE ●</span>
            </div>
            <div class="fg-12" style="padding:18px 10px 6px;text-align:left;">
              <div class="fc-7"><div class="f-media" style="aspect-ratio:16/10;"><img src="${IMG[w.heroImg]}" alt="Stage"/></div></div>
              <div class="fc-5" style="display:flex;flex-direction:column;gap:14px;">
                ${w.features.slice(0,3).map(f => `<div style="padding:14px;border-radius:calc(var(--radius)*0.8);background:var(--muted);border:1px solid var(--border);"><div class="f-mono" style="font-size:12px;color:var(--accent);">${f.code} // ${f.tag}</div><div style="font-size:14px;font-weight:700;margin-top:4px;">${f.title}</div></div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'HERO-06', name: '인터랙티브 에디션 컨피규레이터 히어로 (실시간 스왑)',
      desc: '히어로 우측에서 에디션 버튼(01~03)을 클릭하면 사진·스펙·요금이 즉시 바뀌는 커머스·예약 특화 히어로',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12">
          <div class="fc-6 f-reveal">
            <div class="f-card" style="padding:14px;">
              <div class="f-media" style="aspect-ratio:4/3.6;"><img id="hero-cfg-img" src="${IMG[w.works[0].img]}" alt="${w.works[0].title}" /></div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 6px 2px;font-size:13px;">
                <strong id="hero-cfg-title">${w.works[0].title}</strong>
                <span id="hero-cfg-price" class="f-mono" style="color:var(--accent);font-weight:700;">${w.works[0].price}</span>
              </div>
            </div>
          </div>
          <div class="fc-6 f-reveal" style="--stagger:1;display:flex;flex-direction:column;gap:20px;">
            <div><span class="${ctx.bdgCls}">INTERACTIVE EDITION SELECTOR</span></div>
            <h1 class="f-h1" style="font-size:clamp(2.1rem,3.8vw,3.3rem);">${fmtHeadline(w.h1Pre, w.h1Accent, ctx.tfxId)}</h1>
            <p style="margin:0;font-size:14px;color:var(--sub);">${w.h1Sub}</p>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <div class="f-mono" style="font-size:12px;color:var(--sub);">SELECT CURATED EDITION (클릭하여 프리뷰 전환):</div>
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                ${w.works.slice(0,3).map((wk, idx) => `
                  <button type="button" onclick="swapHeroEdition(${idx})" class="hero-ed-btn" data-idx="${idx}" style="text-align:left;padding:11px 12px;border-radius:calc(var(--radius)*0.8);background:${idx===0?'var(--accent-soft)':'var(--surface)'};border:1px solid ${idx===0?'var(--accent)':'var(--border)'};color:var(--fg);cursor:pointer;">
                    <div class="f-mono" style="font-size:12px;color:var(--accent);">0${idx+1}</div>
                    <div style="font-size:12px;font-weight:700;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${wk.title}</div>
                    <div class="f-mono" style="font-size:12px;color:var(--sub);margin-top:2px;">${wk.price}</div>
                  </button>`).join('')}
              </div>
            </div>
            <div style="padding-top:4px;">${ctx.btn(w.ctaPrimary)}</div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'HERO-07', name: '스위스 아키텍처 보더 그리드 포스터 히어로',
      desc: '노출된 구조적 격자선으로 여백과 사진을 칼같이 분할하는 취리히 모더니즘 포스터 레이아웃',
      render: (w, ctx) => `
      <section style="border-bottom:1.5px solid var(--fg);">
        <div class="fg-12" style="gap:0;align-items:stretch;">
          <div class="fc-7" style="padding:52px var(--sec-px);border-right:1.5px solid var(--fg);display:flex;flex-direction:column;justify-content:space-between;gap:26px;">
            <div><span class="${ctx.bdgCls}">${w.edition}</span></div>
            <h1 class="f-h1">${fmtHeadline(w.h1Pre, w.h1Accent, ctx.tfxId)}</h1>
            <p style="margin:0;font-size:15px;color:var(--sub);max-width:520px;">${w.h1Sub}</p>
            <div>${ctx.btn(w.ctaPrimary)}</div>
          </div>
          <div class="fc-5" style="padding:34px;background:var(--muted);display:flex;flex-direction:column;justify-content:space-between;gap:20px;">
            <div class="f-media" style="aspect-ratio:4/3.6;"><img src="${IMG[w.heroImg]}" alt="${w.brand}" /></div>
            <div class="f-mono" style="display:flex;justify-content:space-between;font-size:12px;padding-top:12px;border-top:1px solid var(--border);">
              <span>PLATE 01 // ${w.brand}</span>
              <span style="color:var(--accent);">${w.works[0].price}</span>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'HERO-08', name: '50:50 엣지 투 엣지 풀블리드 살롱 히어로',
      desc: '좌측은 여백 없는 꽉 찬 대형 건축 화보, 우측은 품격 있는 살롱 에세이 타이포그래피로 이분할',
      render: (w, ctx) => `
      <section style="border-bottom:1px solid var(--border);">
        <div class="fg-2" style="gap:0;min-height:520px;align-items:stretch;">
          <div style="position:relative;min-height:360px;overflow:hidden;">
            <img src="${IMG[w.heroImg]}" alt="${w.brand}" style="width:100%;height:100%;object-fit:cover;display:block;" />
          </div>
          <div style="padding:58px var(--sec-px);display:flex;flex-direction:column;justify-content:center;gap:22px;background:var(--surface);">
            <div><span class="${ctx.bdgCls}">${w.eyebrow}</span></div>
            <h1 class="f-h1" style="font-size:clamp(2.1rem,3.6vw,3.4rem);">${fmtHeadline(w.h1Pre, w.h1Accent, ctx.tfxId)}</h1>
            <p style="margin:0;font-size:15px;line-height:1.75;color:var(--sub);">${w.h1Sub}</p>
            <div style="padding-top:8px;">${ctx.btn(w.ctaPrimary)}</div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'HERO-09', name: '마우스 패럴랙스 플로팅 멀티레이어 아트월 히어로',
      desc: '마우스 움직임에 따라 좌우 플로팅 프레임들이 서로 다른 깊이감(Parallax)으로 유영하는 아방가르드 히어로',
      render: (w, ctx) => `
      <section class="f-sec f-parallax-stage" style="position:relative;overflow:hidden;padding-top:64px;padding-bottom:64px;">
        <div class="f-container" style="position:relative;z-index:2;text-align:center;display:flex;flex-direction:column;align-items:center;">
          <span class="${ctx.bdgCls}">${w.eyebrow}</span>
          <h1 class="f-h1" style="max-width:780px;margin-top:18px;">${fmtHeadline(w.h1Pre, w.h1Accent, ctx.tfxId)}</h1>
          <p style="max-width:540px;font-size:15px;color:var(--sub);margin:18px 0 28px;">${w.h1Sub}</p>
          <div style="display:flex;gap:12px;justify-content:center;margin-bottom:36px;">${ctx.btn(w.ctaPrimary)}</div>
          <div class="fg-12" style="width:100%;align-items:center;">
            <div class="fc-3 f-px-layer" data-depth="18"><div class="f-card" style="padding:8px;"><div class="f-media" style="aspect-ratio:3/4;"><img src="${IMG[w.secImg1]}" alt="L1"/></div></div></div>
            <div class="fc-6 f-px-layer" data-depth="-10"><div class="f-card" style="padding:12px;border-color:var(--accent);"><div class="f-media" style="aspect-ratio:16/10;"><img src="${IMG[w.heroImg]}" alt="Center"/></div></div></div>
            <div class="fc-3 f-px-layer" data-depth="22"><div class="f-card" style="padding:8px;"><div class="f-media" style="aspect-ratio:3/4;"><img src="${IMG[w.secImg3]}" alt="R1"/></div></div></div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'HERO-10', name: '시네마 쇼릴 플레이어 & 챕터 인덱스 히어로',
      desc: '와이드 쇼릴 무비 스테이지와 클릭 가능한 01~03 챕터 트리거를 결합한 에이전시·건축 스튜디오 히어로',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div class="fg-12" style="margin-bottom:30px;align-items:end;">
            <div class="fc-8">
              <span class="${ctx.bdgCls}">${w.edition}</span>
              <h1 class="f-h1" style="margin-top:14px;">${fmtHeadline(w.h1Pre, w.h1Accent, ctx.tfxId)}</h1>
            </div>
            <div class="fc-4" style="display:flex;flex-direction:column;align-items:flex-end;gap:14px;">
              <p style="margin:0;font-size:14px;color:var(--sub);text-align:right;">${w.h1Sub}</p>
              ${ctx.btn(w.ctaPrimary)}
            </div>
          </div>
          <div class="f-card" style="padding:12px;position:relative;">
            <div class="f-media" style="aspect-ratio:21/9;position:relative;cursor:pointer;" onclick="openImageLightbox('${w.heroImg}','${w.brand} — 2026 BRAND FILM','${w.eyebrow}')">
              <img src="${IMG[w.heroImg]}" alt="${w.brand}" />
              <div style="position:absolute;inset:0;background:rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;">
                <div style="padding:14px 26px;border-radius:999px;background:rgba(12,14,20,0.82);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.28);color:#fff;font-size:13px;font-weight:700;display:inline-flex;align-items:center;gap:10px;">
                  <span style="color:var(--accent);">▶</span><span>2026 SHOWREEL PREVIEW (01:48)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`
    }
  ],

  /* 17. MARQUEE & ARCHITECTURAL DIVIDERS (8) */
  divider: [
    { id: 'DIV-01', name: '키네틱 디스플레이 마키 배너', desc: '브랜드 핵심 키워드가 유려한 디스플레이 서체로 끊김 없이 흐르는 띠',
      render: (w) => `<div style="padding:18px 0;border-bottom:1px solid var(--border);overflow:hidden;background:var(--surface);">
        <div class="f-marquee-track" style="font-family:var(--font-display);font-size:20px;letter-spacing:0.04em;">
          ${[...w.marquee, ...w.marquee, ...w.marquee].map(m => `<span style="margin:0 36px;display:inline-flex;align-items:center;gap:20px;"><span>${m}</span><span style="color:var(--accent);font-size:14px;">✦</span></span>`).join('')}
        </div>
      </div>` },
    { id: 'DIV-02', name: '글로벌 프레스 & 어워드 모노그래프 스트립', desc: '주요 해외 매체 및 인증 기관 워드마크를 절제된 톤으로 배열',
      render: () => `<div style="padding:22px var(--sec-px);border-bottom:1px solid var(--border);display:flex;flex-wrap:wrap;justify-content:space-around;align-items:center;gap:24px;color:var(--sub);font-family:var(--font-display);font-size:15px;letter-spacing:0.14em;opacity:0.82;">
        <span>WALLPAPER*</span><span>ARCHITECTURAL DIGEST</span><span>MONOCLE</span><span>RED DOT BEST OF BEST</span><span>AWWWARDS SOTD</span>
      </div>` },
    { id: 'DIV-03', name: '에디토리얼 세리프 센터 엠블럼 룰', desc: '가느다란 수평 헤어라인 중앙에 다이아몬드 세리프 장식을 둔 클래식 구분선',
      render: (w) => `<div style="padding:24px var(--sec-px);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:20px;">
        <div style="flex:1;height:1px;background:var(--border);"></div>
        <span style="font-family:var(--font-display);font-style:italic;font-size:15px;color:var(--accent);">${w.brand} · ${w.edition}</span>
        <div style="flex:1;height:1px;background:var(--border);"></div>
      </div>` },
    { id: 'DIV-04', name: '아키텍처 눈금자(Ruler) & 섹션 인덱스', desc: '정밀 측정 눈금과 챕터 번호를 함께 표기하는 엔지니어링 디바이더',
      render: () => `<div style="padding:14px var(--sec-px);border-bottom:1px solid var(--border);background:var(--muted);display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--sub);">
        <span>CHAPTER 01 — PHILOSOPHY & METRICS</span>
        <span class="hide-narrow">||||| · ||||| · ||||| · |||||</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>` },
    { id: 'DIV-05', name: '하이콘트라스트 인버트 티커 바', desc: '다크/라이트 반전 배경으로 시선을 환기하는 강렬한 티커 스트립',
      render: (w) => `<div style="padding:14px 0;background:var(--fg);color:var(--bg);overflow:hidden;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;letter-spacing:0.1em;">
        <div class="f-marquee-track">${[...w.marquee, ...w.marquee, ...w.marquee].map(m => `<span style="margin:0 32px;">// ${m}</span>`).join('')}</div>
      </div>` },
    { id: 'DIV-06', name: '3열 핵심 개런티 보증 스트립', desc: '브랜드의 3대 핵심 약속을 정갈한 3등분 보더 스트립으로 배치',
      render: (w) => `<div class="fg-3" style="gap:0;border-bottom:1px solid var(--border);background:var(--surface);text-align:center;font-size:12px;">
        ${w.plans[1].perks.map((pk, i) => `<div style="padding:16px 20px;border-right:${i<2?'1px solid var(--border)':'none'};"><span style="color:var(--accent);margin-right:6px;">✦</span><strong>${pk}</strong></div>`).join('')}
      </div>` },
    { id: 'DIV-07', name: '센터 스텝 네비게이션 브레드크럼', desc: '페이지의 내러티브 흐름을 시각적으로 이어주는 디바이더',
      render: () => `<div style="padding:14px var(--sec-px);border-bottom:1px solid var(--border);display:flex;justify-content:center;gap:24px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--sub);">
        <span>01 ARCHITECTURE</span><span>→</span><span style="color:var(--accent);font-weight:700;">02 CURATION</span><span>→</span><span>03 PRIVATE CONCIERGE</span>
      </div>` },
    { id: 'DIV-08', name: '심리스 여백 모드 (디바이더 생략)', desc: '중간 구분 띠 없이 다음 섹션으로 고요하게 이어지는 호흡',
      render: () => `` }
  ],

  /* 18. METRICS & LIVE ODOMETER COUNTERS (8) */
  stats: [
    { id: 'STA-01', name: '4열 아키텍처 라이브 카운트업 보드', desc: '스크롤 진입 시 0부터 목표 수치까지 부드럽게 카운트업되는 4단 지표 카드',
      render: (w) => `<section class="f-sec" style="padding-top:52px;padding-bottom:52px;">
        <div class="f-container fg-4">
          ${w.metrics.map((m, i) => `<div class="f-card f-reveal" style="--stagger:${i}">
            <div style="font-family:var(--font-display);font-size:clamp(2.1rem,3.4vw,3rem);font-weight:700;line-height:1;color:var(--fg);">
              <span class="f-countup" data-target="${m.num}">${m.num}</span><span style="color:var(--accent);font-size:0.65em;margin-left:2px;">${m.suffix}</span>
            </div>
            <div style="font-size:13px;color:var(--sub);margin-top:10px;">${m.label}</div>
          </div>`).join('')}
        </div>
      </section>` },
    { id: 'STA-02', name: '인버트 모놀리스 와이드 벤치마크 바', desc: '반전 솔리드 배경 위에 대형 숫자를 수평 배열해 압도적 실적을 강조',
      render: (w) => `<section style="background:var(--fg);color:var(--bg);padding:56px var(--sec-px);border-bottom:1px solid var(--border);">
        <div class="f-container fg-4" style="padding:0;">
          ${w.metrics.map((m, i) => `<div class="f-reveal" style="--stagger:${i};padding-left:${i>0?'20px':'0'};border-left:${i>0?'1px solid rgba(128,128,128,0.28)':'none'};">
            <div style="font-family:var(--font-display);font-size:clamp(2.2rem,3.5vw,3.1rem);font-weight:700;line-height:1;"><span class="f-countup" data-target="${m.num}">${m.num}</span><span style="color:var(--accent);font-size:0.65em;">${m.suffix}</span></div>
            <div style="font-size:13px;opacity:0.78;margin-top:10px;">${m.label}</div>
          </div>`).join('')}
        </div>
      </section>` },
    { id: 'STA-03', name: '에디토리얼 매니페스토 + 2×2 지표 스플릿', desc: '좌측 브랜드 철학 선언문과 우측 4대 핵심 지표를 비대칭으로 결합',
      render: (w, ctx) => `<section class="f-sec">
        <div class="f-container fg-12">
          <div class="fc-5 f-reveal">
            <span class="${ctx.bdgCls}">VERIFIED RECORD</span>
            <h2 class="f-h2" style="margin-top:14px;">숫자와 디테일로 증명하는 타협 없는 기준</h2>
            <p style="font-size:14px;color:var(--sub);margin-top:14px;">단순한 수식어가 아닌 실제 고객 경험과 축적된 데이터로 브랜드의 품격을 입증합니다.</p>
          </div>
          <div class="fc-7 fg-2">
            ${w.metrics.map((m, i) => `<div class="f-card f-reveal" style="--stagger:${i}">
              <div style="font-family:var(--font-display);font-size:36px;font-weight:700;"><span class="f-countup" data-target="${m.num}">${m.num}</span><span style="color:var(--accent);font-size:20px;">${m.suffix}</span></div>
              <div style="font-size:13px;color:var(--sub);margin-top:6px;">${m.label}</div>
            </div>`).join('')}
          </div>
        </div>
      </section>` },
    { id: 'STA-04', name: '미니멀 탑 헤어라인 레저(Ledger) 그리드', desc: '박스 테두리 없이 얇은 상단 실선과 정교한 타이포로만 정렬된 수치표',
      render: (w) => `<section class="f-sec" style="padding-top:48px;padding-bottom:48px;">
        <div class="f-container fg-4">
          ${w.metrics.map((m, i) => `<div class="f-reveal" style="--stagger:${i};border-top:1.5px solid var(--fg);padding-top:18px;">
            <div class="f-mono" style="font-size:12px;color:var(--accent);margin-bottom:8px;">0${i+1} // METRIC</div>
            <div style="font-family:var(--font-display);font-size:40px;font-weight:600;line-height:1;"><span class="f-countup" data-target="${m.num}">${m.num}</span>${m.suffix}</div>
            <div style="font-size:13px;color:var(--sub);margin-top:8px;">${m.label}</div>
          </div>`).join('')}
        </div>
      </section>` },
    { id: 'STA-05', name: '스위스 브루탈 4분할 원장 블록', desc: '굵은 구조선으로 나뉜 고임팩트 숫자 그리드',
      render: (w) => `<section style="border-bottom:1.5px solid var(--fg);">
        <div class="fg-4" style="gap:0;">
          ${w.metrics.map((m, i) => `<div style="padding:36px 28px;border-right:${i<3?'1.5px solid var(--fg)':'none'};">
            <div class="f-mono" style="font-size:12px;color:var(--sub);">INDEX 0${i+1}</div>
            <div style="font-family:var(--font-display);font-size:38px;font-weight:800;margin-top:8px;color:${i===1?'var(--accent)':'var(--fg)'};"><span class="f-countup" data-target="${m.num}">${m.num}</span>${m.suffix}</div>
            <div style="font-size:13px;font-weight:600;margin-top:6px;">${m.label}</div>
          </div>`).join('')}
        </div>
      </section>` },
    { id: 'STA-06', name: '아코디언 게이지 바 퍼포먼스 보드', desc: '시각적 채움 게이지 바로 만족도·품질을 직관적으로 전달',
      render: (w) => `<section class="f-sec" style="padding-top:48px;padding-bottom:48px;">
        <div class="f-container fg-2">
          ${w.metrics.map((m, i) => `<div class="f-card f-reveal" style="--stagger:${i};padding:22px 26px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
              <span style="font-size:14px;font-weight:600;">${m.label}</span>
              <span class="f-mono" style="font-size:18px;font-weight:700;color:var(--accent);">${m.num}${m.suffix}</span>
            </div>
            <div style="height:5px;border-radius:999px;background:var(--muted);overflow:hidden;">
              <div style="height:100%;width:${94 - i*4}%;background:var(--accent);border-radius:999px;"></div>
            </div>
          </div>`).join('')}
        </div>
      </section>` },
    { id: 'STA-07', name: '시즌 예약 마감 인디케이터 & 상태 바', desc: '월별 오픈·마감 현황을 한눈에 전달해 자연스러운 예약 행동 유도',
      render: (w) => `<section class="f-sec" style="padding-top:42px;padding-bottom:42px;">
        <div class="f-container">
          <div class="f-card" style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:18px;">
            <div><strong style="font-size:16px;">${w.brand} — 2026 시즌 잔여 슬롯 현황</strong><p style="margin:4px 0 0;font-size:13px;color:var(--sub);">프라이빗 단독 운영 원칙에 따라 월별 제한된 팀만 모시고 있습니다.</p></div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;font-family:'JetBrains Mono',monospace;font-size:12px;">
              <span style="padding:8px 14px;border-radius:999px;border:1px solid var(--border);opacity:0.45;">10월 마감</span>
              <span style="padding:8px 14px;border-radius:999px;background:var(--accent);color:var(--accent-fg);font-weight:700;">11월 잔여 3슬롯</span>
              <span style="padding:8px 14px;border-radius:999px;border:1px solid var(--border);">12월 우선예약 오픈</span>
            </div>
          </div>
        </div>
      </section>` },
    { id: 'STA-08', name: '글로벌 게스트 종합 스코어카드 (4.98 / 5.0)', desc: '공간미·프라이버시·응대 만족도 세부 평점을 투명하게 공개하는 신뢰 보드',
      render: () => `<section class="f-sec" style="padding-top:44px;padding-bottom:44px;">
        <div class="f-container">
          <div class="f-card" style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:24px;">
            <div style="display:flex;align-items:center;gap:18px;">
              <span style="font-family:var(--font-display);font-size:48px;font-weight:700;line-height:1;color:var(--accent);">4.98</span>
              <div><strong style="font-size:15px;">VERIFIED CLIENT SATISFACTION</strong><div style="font-size:12px;color:var(--sub);margin-top:3px;">실제 이용 고객 1,420명 정식 리뷰 기준</div></div>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:28px;font-size:13px;">
              <div>디테일 완성도 <strong class="f-mono" style="margin-left:4px;">5.0</strong></div>
              <div>프라이버시 <strong class="f-mono" style="margin-left:4px;">5.0</strong></div>
              <div>전담 컨시어지 <strong class="f-mono" style="margin-left:4px;">4.9</strong></div>
              <div>재방문 의사 <strong class="f-mono" style="margin-left:4px;">99.4%</strong></div>
            </div>
          </div>
        </div>
      </section>` }
  ],

  /* 19. INTERACTIVE FEATURE & BENTO SHOWCASES (8) */
  feature: [
    {
      id: 'FEAT-01', name: '비대칭 애플/Linear풍 4셀 마스터 벤토 그리드',
      desc: '대형 화보 셀(7열)과 서브 스토리 셀(5열)이 비대칭으로 맞물리는 모던 플래그십 벤토',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:38px;">
            <div><span class="${ctx.bdgCls}">01 — SIGNATURE PILLARS</span><h2 class="f-h2" style="margin-top:12px;">본질을 완성하는 네 가지 건축적 디테일</h2></div>
            <p style="margin:0;font-size:14px;color:var(--sub);max-width:400px;">보이지 않는 곳의 설계와 물성까지 타협 없이 다듬어 독보적인 브랜드 경험을 구축합니다.</p>
          </div>
          <div class="fg-12" style="align-items:stretch;">
            <div class="fc-7 f-card f-reveal" style="--stagger:0;display:grid;grid-template-columns:1.1fr 1fr;gap:22px;align-items:center;">
              <div class="f-media" style="aspect-ratio:4/3.6;"><img src="${IMG[w.features[0].img]}" alt="${w.features[0].title}"/></div>
              <div>
                <span class="f-mono" style="font-size:12px;color:var(--accent);">${w.features[0].code} // ${w.features[0].tag}</span>
                <h3 class="f-h3" style="margin-top:8px;">${w.features[0].title}</h3>
                <p style="font-size:13px;color:var(--sub);margin:10px 0 0;line-height:1.7;">${w.features[0].desc}</p>
              </div>
            </div>
            <div class="fc-5 f-card f-reveal" style="--stagger:1;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <span class="f-mono" style="font-size:12px;color:var(--accent);">${w.features[1].code} // ${w.features[1].tag}</span>
                <h3 class="f-h3" style="margin-top:8px;">${w.features[1].title}</h3>
                <p style="font-size:13px;color:var(--sub);margin:10px 0 0;line-height:1.7;">${w.features[1].desc}</p>
              </div>
              <div style="padding-top:18px;margin-top:18px;border-top:1px solid var(--border);display:flex;justify-content:space-between;font-size:12px;font-weight:600;">
                <span>BESPOKE CURATION</span><span style="color:var(--accent);">EXPLORE →</span>
              </div>
            </div>
            <div class="fc-5 f-card f-reveal" style="--stagger:2;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <span class="f-mono" style="font-size:12px;color:var(--accent);">${w.features[2].code} // ${w.features[2].tag}</span>
                <h3 class="f-h3" style="margin-top:8px;">${w.features[2].title}</h3>
                <p style="font-size:13px;color:var(--sub);margin:10px 0 0;line-height:1.7;">${w.features[2].desc}</p>
              </div>
              <div class="f-mono" style="padding-top:16px;font-size:12px;color:var(--sub);">CERTIFIED ORIGIN · 2026</div>
            </div>
            <div class="fc-7 f-card f-reveal" style="--stagger:3;display:grid;grid-template-columns:1fr 1.1fr;gap:22px;align-items:center;">
              <div>
                <span class="f-mono" style="font-size:12px;color:var(--accent);">${w.features[3].code} // ${w.features[3].tag}</span>
                <h3 class="f-h3" style="margin-top:8px;">${w.features[3].title}</h3>
                <p style="font-size:13px;color:var(--sub);margin:10px 0 0;line-height:1.7;">${w.features[3].desc}</p>
              </div>
              <div class="f-media" style="aspect-ratio:4/3.2;"><img src="${IMG[w.features[3].img]}" alt="${w.features[3].title}"/></div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FEAT-02', name: '인터랙티브 호버·클릭 이미지 스왑 아코디언 (실시간 전환)',
      desc: '좌측 01~04 항목에 마우스를 올리거나 클릭하면 우측 대형 쇼케이스 화보가 실시간 전환',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:34px;"><span class="${ctx.bdgCls}">01 — INTERACTIVE STORYTELLING</span><h2 class="f-h2" style="margin-top:12px;">항목을 선택해 공간과 디테일을 확인하세요</h2></div>
          <div class="fg-12" style="align-items:stretch;">
            <div class="fc-6" style="display:flex;flex-direction:column;gap:10px;">
              ${w.features.map((f, idx) => `
                <div onmouseenter="swapFeatShowcase(${idx})" onclick="swapFeatShowcase(${idx})" class="f-card feat-swap-row" data-idx="${idx}" style="padding:20px 24px;cursor:pointer;border-color:${idx===0?'var(--accent)':'var(--border)'};background:${idx===0?'var(--surface)':'transparent'};">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${f.code} — ${f.tag}</span>
                    <span style="font-size:14px;opacity:0.6;">↗</span>
                  </div>
                  <h3 class="f-h3" style="margin-top:6px;font-size:19px;">${f.title}</h3>
                  <p style="margin:8px 0 0;font-size:13px;color:var(--sub);line-height:1.65;">${f.desc}</p>
                </div>`).join('')}
            </div>
            <div class="fc-6">
              <div class="f-card" style="height:100%;padding:16px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
                <div class="f-media" style="flex:1;min-height:360px;"><img id="feat-swap-img" src="${IMG[w.features[0].img]}" alt="${w.features[0].title}" /></div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 8px;font-size:13px;">
                  <strong id="feat-swap-caption">${w.features[0].title}</strong>
                  <span id="feat-swap-code" class="f-mono" style="color:var(--accent);">PLATE 01 / 04</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FEAT-03', name: '드래그형 낮 ↔ 밤 건축 무드 비교 슬라이더 (Before / After)',
      desc: '핸들을 좌우로 드래그하여 두 가지 공간 연출·조명 무드를 실시간으로 비교하는 체험형 섹션',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:14px;margin-bottom:28px;">
            <div><span class="${ctx.bdgCls}">INTERACTIVE DUAL MOOD</span><h2 class="f-h2" style="margin-top:12px;">빛과 시간에 따라 변화하는 공간의 표정</h2></div>
            <span class="f-mono" style="font-size:12px;color:var(--accent);">◄ 좌우로 슬라이더를 움직여 비교해보세요 ►</span>
          </div>
          <div class="f-card" style="padding:14px;">
            <div style="position:relative;aspect-ratio:21/9;border-radius:calc(var(--radius)*0.75);overflow:hidden;user-select:none;">
              <img src="${IMG[w.secImg3]}" alt="After Mood" style="width:100%;height:100%;object-fit:cover;display:block;" />
              <div id="ba-clip-pane" style="position:absolute;inset:0;width:52%;overflow:hidden;border-right:2px solid #FFFFFF;">
                <img src="${IMG[w.heroImg]}" alt="Before Mood" style="width:100%;height:100%;object-fit:cover;display:block;" />
              </div>
              <div id="ba-knob" style="position:absolute;top:50%;left:52%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:999px;background:#FFFFFF;color:#090A0D;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;box-shadow:0 8px 28px rgba(0,0,0,0.45);pointer-events:none;">◄►</div>
              <span class="f-mono" style="position:absolute;top:16px;left:16px;padding:5px 12px;border-radius:999px;background:rgba(0,0,0,0.65);color:#fff;font-size:12px;">ATMOSPHERE A</span>
              <span class="f-mono" style="position:absolute;top:16px;right:16px;padding:5px 12px;border-radius:999px;background:rgba(0,0,0,0.65);color:#fff;font-size:12px;">ATMOSPHERE B</span>
              <input type="range" min="4" max="96" value="52" oninput="const p=this.value+'%';const c=document.getElementById('ba-clip-pane');const k=document.getElementById('ba-knob');if(c)c.style.width=p;if(k)k.style.left=p;" style="position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0;z-index:10;" />
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FEAT-04', name: '세그먼트 탭 스위처 쇼케이스 (실시간 탭 전환)',
      desc: '상단 알약형 탭 버튼 클릭 시 해당 챕터의 사진·스토리·핵심 사양이 즉시 교체되는 대화형 탭',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;margin-bottom:32px;">
            <div><span class="${ctx.bdgCls}">CURATED CHAPTERS</span><h2 class="f-h2" style="margin-top:10px;">핵심 경험 자세히 보기</h2></div>
            <div style="display:inline-flex;padding:4px;border-radius:999px;background:var(--muted);border:1px solid var(--border);gap:4px;">
              ${w.features.slice(0,3).map((f, idx) => `<button type="button" onclick="switchFeatTab(${idx})" class="feat-tab-pill" data-idx="${idx}" style="padding:8px 16px;border-radius:999px;border:none;background:${idx===0?'var(--fg)':'transparent'};color:${idx===0?'var(--bg)':'var(--sub)'};font-size:12px;font-weight:700;cursor:pointer;">${f.code}. ${f.tag}</button>`).join('')}
            </div>
          </div>
          <div class="f-card fg-12" style="padding:28px;">
            <div class="fc-6"><div class="f-media" style="aspect-ratio:16/10;"><img id="ftab-img" src="${IMG[w.features[0].img]}" alt="${w.features[0].title}"/></div></div>
            <div class="fc-6" style="display:flex;flex-direction:column;gap:16px;">
              <span id="ftab-tag" class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${w.features[0].code} // ${w.features[0].tag}</span>
              <h3 id="ftab-title" class="f-h2" style="font-size:28px;">${w.features[0].title}</h3>
              <p id="ftab-desc" style="margin:0;font-size:15px;line-height:1.75;color:var(--sub);">${w.features[0].desc}</p>
              <div style="padding-top:8px;">${ctx.btn(w.ctaPrimary)}</div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FEAT-05', name: '에디토리얼 지그재그 매거진 에세이 (2단 교차)',
      desc: '화보와 깊이 있는 산문이 좌우 교차하며 브랜드의 서사를 설득력 있게 전달하는 정통 럭셔리 레이아웃',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="display:flex;flex-direction:column;gap:56px;">
          <div class="fg-12 f-reveal">
            <div class="fc-6"><div class="f-media" style="aspect-ratio:4/3;"><img src="${IMG[w.features[0].img]}" alt="Essay 1"/></div></div>
            <div class="fc-6" style="display:flex;flex-direction:column;gap:16px;">
              <span class="${ctx.bdgCls}">${w.features[0].tag}</span>
              <h2 class="f-h2">${w.features[0].title}</h2>
              <p style="margin:0;font-size:15px;line-height:1.8;color:var(--sub);">${w.features[0].desc}</p>
            </div>
          </div>
          <div class="fg-12 f-reveal">
            <div class="fc-6" style="display:flex;flex-direction:column;gap:16px;">
              <span class="${ctx.bdgCls}">${w.features[1].tag}</span>
              <h2 class="f-h2">${w.features[1].title}</h2>
              <p style="margin:0;font-size:15px;line-height:1.8;color:var(--sub);">${w.features[1].desc}</p>
            </div>
            <div class="fc-6"><div class="f-media" style="aspect-ratio:4/3;"><img src="${IMG[w.features[1].img]}" alt="Essay 2"/></div></div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FEAT-06', name: '4단 기하학 아키텍처 필러 그리드',
      desc: '절제된 라인 그래픽 엠블럼과 01~04 원칙을 정갈한 4열 카드로 배치',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:36px;"><span class="${ctx.bdgCls}">ARCHITECTURAL PRINCIPLES</span><h2 class="f-h2" style="margin-top:12px;">네 가지 핵심 설계 기준</h2></div>
          <div class="fg-4">
            ${w.features.map((f, i) => `<div class="f-card f-reveal" style="--stagger:${i};display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                  <span class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${f.code}</span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" style="color:var(--accent);"><circle cx="12" cy="12" r="${9-i}"/><path d="M4 12h16M12 4v16" opacity="0.45"/></svg>
                </div>
                <h3 class="f-h3" style="font-size:18px;">${f.title}</h3>
                <p style="margin:10px 0 0;font-size:13px;color:var(--sub);line-height:1.65;">${f.desc}</p>
              </div>
              <div class="f-mono" style="font-size:12px;color:var(--sub);padding-top:12px;border-top:1px solid var(--border);">${f.tag}</div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'FEAT-07', name: '이그제큐티브 스펙 레저 매트릭스 (로펌·테크·스펙표)',
      desc: '수평 행 구조와 명확한 사양 대조가 돋보이는 엔지니어링·자문 역량 테이블',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:32px;"><span class="${ctx.bdgCls}">SPECIFICATION LEDGER</span><h2 class="f-h2" style="margin-top:12px;">세부 프로그램 및 역량 명세</h2></div>
          <div class="f-card" style="padding:0;overflow:hidden;">
            ${w.features.map((f, i) => `<div class="fg-12" style="padding:24px 28px;border-bottom:${i<3?'1px solid var(--border)':'none'};">
              <div class="fc-4"><span class="f-mono" style="font-size:12px;color:var(--accent);margin-right:10px;">${f.code}</span><strong style="font-size:16px;">${f.title}</strong></div>
              <div class="fc-6" style="font-size:14px;color:var(--sub);">${f.desc}</div>
              <div class="fc-2 f-mono" style="text-align:right;font-size:12px;color:var(--fg);">${f.tag} →</div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'FEAT-08', name: '오버사이즈 타이포그래피 인덱스 리스트 (스튜디오풍)',
      desc: '대형 디스플레이 번호와 타이틀이 가로지르는 크리에이티브 디렉션 인덱스',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:24px;"><span class="${ctx.bdgCls}">CAPABILITIES INDEX</span></div>
          ${w.features.map((f, i) => `<div class="f-reveal" style="--stagger:${i};padding:26px 0;border-top:1.5px solid var(--fg);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:16px;">
            <div style="display:flex;align-items:baseline;gap:22px;">
              <span class="f-mono" style="font-size:13px;color:var(--accent);font-weight:700;">(${f.code})</span>
              <h3 class="f-h2" style="font-size:clamp(1.5rem,2.6vw,2.3rem);">${f.title}</h3>
            </div>
            <p style="margin:0;font-size:13px;color:var(--sub);max-width:400px;">${f.desc}</p>
          </div>`).join('')}
        </div>
      </section>`
    }
  ]
});
