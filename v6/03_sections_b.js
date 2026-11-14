/* ==========================================================================
   FORMA STUDIO v6 — ARCHITECTURAL SECTIONS PART B (68 VARIANTS -> 252 TOTAL!)
   20. Process (10) · 21. Gallery (10) · 22. Team (10) · 23. Pricing (10)
   24. Proof (10) · 25. Form (10) · 26. Footer (8)
   ========================================================================== */

Object.assign(VAULT, {

  /* ========================================================================
     20. PROCESS, ROADMAP & TIMELINE ARCHITECTURES (10 Variants)
     ======================================================================== */
  process: [
    {
      id: 'PRO-01', name: '4열 아키텍처 스텝 카드 보드',
      desc: '01~04 단계별 여정과 핵심 프로세스를 균형 잡힌 4단 카드로 명쾌하게 제시',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:36px;">
            <div><span class="${ctx.bdgCls}">CURATED PROCESS</span><h2 class="f-h2" style="margin-top:12px;">처음부터 끝까지 설계된 완벽한 여정</h2></div>
            <span class="f-mono" style="font-size:12px;color:var(--accent);">STEP 01 — STEP 04</span>
          </div>
          <div class="fg-4" style="align-items:stretch;">
            ${w.steps.map((st, i) => `
              <div class="f-card f-reveal" style="--stagger:${i};display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                    <span style="font-family:var(--font-display);font-size:28px;font-weight:700;color:var(--accent);line-height:1;">${st.step}</span>
                    <span class="f-mono" style="font-size:12px;color:var(--sub);">${i < 3 ? '→' : '✦'}</span>
                  </div>
                  <div class="f-mono" style="font-size:12px;color:var(--accent);margin-bottom:6px;">${st.phase}</div>
                  <h3 class="f-h3" style="font-size:18px;">${st.title}</h3>
                  <p style="margin:10px 0 0;font-size:13px;color:var(--sub);line-height:1.68;">${st.desc}</p>
                </div>
                <div style="height:2px;width:100%;background:var(--border);position:relative;">
                  <div style="position:absolute;left:0;top:0;bottom:0;width:${(i+1)*25}%;background:var(--accent);"></div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRO-02', name: '인터랙티브 페이즈 블루프린트 스위처 (클릭 전환)',
      desc: '상단 01~04 단계 탭을 클릭하면 해당 프로세스의 세부 프로토콜과 비주얼이 즉시 전환',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:30px;"><span class="${ctx.bdgCls}">INTERACTIVE BLUEPRINT</span><h2 class="f-h2" style="margin-top:12px;">단계별 실행 프로토콜 확인</h2></div>
          <div class="fg-4" style="gap:10px;margin-bottom:20px;">
            ${w.steps.map((st, idx) => `
              <button type="button" onclick="switchProcessStep(${idx})" class="pro-step-tab" data-idx="${idx}" style="text-align:left;padding:14px 16px;border-radius:var(--radius);border:1px solid ${idx===0?'var(--accent)':'var(--border)'};background:${idx===0?'var(--accent-soft)':'var(--surface)'};color:var(--fg);cursor:pointer;">
                <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">STEP ${st.step}</div>
                <div style="font-size:13px;font-weight:700;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${st.title}</div>
              </button>`).join('')}
          </div>
          <div class="f-card fg-12" style="padding:32px;">
            <div class="fc-7" style="display:flex;flex-direction:column;gap:14px;">
              <span id="pro-sw-phase" class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">STEP ${w.steps[0].step} // ${w.steps[0].phase}</span>
              <h3 id="pro-sw-title" class="f-h2" style="font-size:28px;">${w.steps[0].title}</h3>
              <p id="pro-sw-desc" style="margin:0;font-size:15px;color:var(--sub);line-height:1.75;">${w.steps[0].desc}</p>
              <div style="padding-top:8px;">${ctx.btn(w.ctaPrimary)}</div>
            </div>
            <div class="fc-5">
              <div class="f-media" style="aspect-ratio:16/10;"><img id="pro-sw-img" src="${IMG[w.features[0].img]}" alt="${w.steps[0].title}" /></div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRO-03', name: '버티컬 에디토리얼 헤리티지 타임라인',
      desc: '좌측 브랜드 철학 인트로와 우측 수직 타임라인 레일이 맞물리는 클래식 아카이브 레이아웃',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12" style="align-items:start;">
          <div class="fc-5 f-reveal">
            <span class="${ctx.bdgCls}">CHRONOLOGY & RITUAL</span>
            <h2 class="f-h2" style="margin-top:14px;">시간의 순서대로 깊어지는 경험의 밀도</h2>
            <p style="font-size:14px;color:var(--sub);margin:14px 0 24px;line-height:1.75;">모든 접점마다 세심하게 조율된 시퀀스를 통해 첫 만남부터 마지막 여운까지 빈틈없는 감동을 완성합니다.</p>
            ${ctx.btn(w.ctaPrimary)}
          </div>
          <div class="fc-7" style="border-left:2px solid var(--border);padding-left:28px;display:flex;flex-direction:column;gap:22px;">
            ${w.steps.map((st, i) => `
              <div class="f-card f-reveal" style="--stagger:${i};position:relative;padding:22px 26px;">
                <span style="position:absolute;left:-36px;top:26px;width:14px;height:14px;border-radius:999px;background:var(--accent);border:3px solid var(--bg);"></span>
                <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${st.step} · ${st.phase}</div>
                <h3 class="f-h3" style="margin-top:6px;">${st.title}</h3>
                <p style="margin:8px 0 0;font-size:13px;color:var(--sub);line-height:1.68;">${st.desc}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRO-04', name: '호리즌탈 마일스톤 커넥터 트랙',
      desc: '수평 진행 궤도 위에 원형 노드와 단계별 설명을 정교하게 연결한 모던 로드맵',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="text-align:center;margin-bottom:40px;"><span class="${ctx.bdgCls}">SEQUENTIAL FLOW</span><h2 class="f-h2" style="margin-top:12px;">4단계 시그니처 시퀀스</h2></div>
          <div style="position:relative;padding-top:12px;">
            <div class="hide-narrow" style="position:absolute;top:30px;left:8%;right:8%;height:2px;background:var(--border);z-index:0;"></div>
            <div class="fg-4" style="position:relative;z-index:1;">
              ${w.steps.map((st, i) => `
                <div class="f-reveal" style="--stagger:${i};text-align:center;padding:0 10px;">
                  <div class="f-mono" style="width:38px;height:38px;margin:0 auto 18px;border-radius:999px;background:${i===0?'var(--accent)':'var(--surface)'};color:${i===0?'var(--accent-fg)':'var(--fg)'};border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;">${st.step}</div>
                  <div class="f-mono" style="font-size:12px;color:var(--accent);">${st.phase}</div>
                  <h3 class="f-h3" style="font-size:17px;margin-top:6px;">${st.title}</h3>
                  <p style="font-size:13px;color:var(--sub);margin-top:8px;line-height:1.65;">${st.desc}</p>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRO-05', name: '다크 인버트 이그제큐티브 프로세스 레저',
      desc: '묵직한 반전 다크 배경 위에 01~04 단계를 수평 원장 구조로 배열한 로펌·엔터프라이즈 표준',
      render: (w) => `
      <section style="padding:var(--sec-py) var(--sec-px);background:var(--fg);color:var(--bg);border-bottom:1px solid var(--border);">
        <div class="f-container" style="padding:0;">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:34px;">
            <div><span class="f-mono" style="font-size:12px;color:var(--accent);letter-spacing:0.14em;">EXECUTION PROTOCOL</span><h2 class="f-h2" style="margin-top:10px;color:var(--bg);">체계적이고 투명한 진행 절차</h2></div>
          </div>
          <div style="border-top:1px solid rgba(128,128,128,0.3);">
            ${w.steps.map((st, i) => `
              <div class="fg-12 f-reveal" style="--stagger:${i};padding:24px 0;border-bottom:1px solid rgba(128,128,128,0.3);">
                <div class="fc-3 f-mono" style="font-size:13px;color:var(--accent);font-weight:700;">${st.step} // ${st.phase}</div>
                <div class="fc-4"><h3 class="f-h3" style="color:var(--bg);font-size:19px;">${st.title}</h3></div>
                <div class="fc-5" style="font-size:13px;opacity:0.8;line-height:1.68;">${st.desc}</div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRO-06', name: '인터랙티브 아코디언 스텝 브레이크다운',
      desc: '각 단계를 클릭해 상세 산출물과 진행 디테일을 펼쳐보는 대화형 프로세스 보드',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="max-width:940px;">
          <div style="margin-bottom:30px;"><span class="${ctx.bdgCls}">STEP-BY-STEP GUIDE</span><h2 class="f-h2" style="margin-top:12px;">단계별 세부 진행 안내</h2></div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${w.steps.map((st, i) => `
              <details class="f-card" ${i===0?'open':''} style="padding:22px 26px;cursor:pointer;">
                <summary style="list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;">
                  <div style="display:flex;align-items:center;gap:16px;">
                    <span class="f-mono" style="padding:4px 10px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:700;">STEP ${st.step}</span>
                    <strong style="font-size:16px;">${st.title}</strong>
                  </div>
                  <span class="f-mono" style="font-size:12px;color:var(--sub);">${st.phase} ↓</span>
                </summary>
                <p style="margin:14px 0 0;padding-top:14px;border-top:1px solid var(--border);font-size:14px;color:var(--sub);line-height:1.75;">${st.desc}</p>
              </details>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRO-07', name: '스위스 브루탈 4분할 아키텍처 페이즈 그리드',
      desc: '노출된 1.5px 구조선으로 구획된 크리에이티브 스튜디오·건축가 스타일 공정표',
      render: (w) => `
      <section style="border-bottom:1.5px solid var(--fg);">
        <div class="fg-4" style="gap:0;align-items:stretch;">
          ${w.steps.map((st, i) => `
            <div style="padding:38px 26px;border-right:${i<3?'1.5px solid var(--fg)':'none'};display:flex;flex-direction:column;justify-content:space-between;gap:22px;">
              <div>
                <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">[${st.step}] ${st.phase}</div>
                <h3 class="f-h3" style="margin-top:12px;font-size:19px;">${st.title}</h3>
                <p style="margin:10px 0 0;font-size:13px;color:var(--sub);line-height:1.65;">${st.desc}</p>
              </div>
              <div class="f-mono" style="font-size:12px;font-weight:700;">PHASE 0${i+1} / 04 →</div>
            </div>`).join('')}
        </div>
      </section>`
    },
    {
      id: 'PRO-08', name: '화보 결합 에디토리얼 저니 스프레드',
      desc: '좌측 분위기 화보와 우측 4단계 시퀀스를 나란히 배치해 감성과 정보를 동시에 전달',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12">
          <div class="fc-5">
            <div class="f-media" style="aspect-ratio:3/3.8;"><img src="${IMG[w.secImg1]}" alt="${w.brand}"/></div>
          </div>
          <div class="fc-7" style="display:flex;flex-direction:column;gap:18px;">
            <div><span class="${ctx.bdgCls}">CRAFTED SEQUENCE</span><h2 class="f-h2" style="margin-top:10px;">세심하게 직조된 경험의 흐름</h2></div>
            <div class="fg-2" style="gap:16px;">
              ${w.steps.map(st => `
                <div class="f-card" style="padding:20px;">
                  <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${st.step} — ${st.phase}</div>
                  <h3 class="f-h3" style="font-size:16px;margin-top:6px;">${st.title}</h3>
                  <p style="margin:8px 0 0;font-size:13px;color:var(--sub);line-height:1.6;">${st.desc}</p>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRO-09', name: '라이브 타임라인 스크러버 시뮬레이터',
      desc: '슬라이더를 좌우로 드래그하면 공정 진행률(25%~100%)과 현재 단계 설명이 실시간 연동',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="max-width:940px;">
          <div class="f-card" style="padding:36px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
              <span class="${ctx.bdgCls}">LIVE TIMELINE SCRUBBER</span>
              <span id="pro-scrub-pct" class="f-mono" style="font-size:13px;font-weight:700;color:var(--accent);">STAGE 01 · 25%</span>
            </div>
            <h3 id="pro-scrub-title" class="f-h2" style="font-size:26px;">${w.steps[0].title}</h3>
            <p id="pro-scrub-desc" style="font-size:14px;color:var(--sub);margin:10px 0 24px;line-height:1.7;">${w.steps[0].desc}</p>
            <input type="range" min="0" max="3" step="1" value="0" oninput="scrubProcessTimeline(Number(this.value))" style="width:100%;accent-color:var(--accent);cursor:pointer;" />
            <div style="display:flex;justify-content:space-between;margin-top:10px;font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--sub);">
              ${w.steps.map(st => `<span>${st.step} ${st.phase.split(' ')[0]}</span>`).join('')}
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRO-10', name: '2×2 밸런스 아키텍처 로드맵 매트릭스',
      desc: '상단 타이틀·CTA 헤더와 2×2 대칭 카드로 안정감을 주는 정석 프로세스 섹션',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;margin-bottom:32px;">
            <div><span class="${ctx.bdgCls}">METHODOLOGY</span><h2 class="f-h2" style="margin-top:10px;">검증된 4단계 마스터플랜</h2></div>
            ${ctx.btn(w.ctaPrimary)}
          </div>
          <div class="fg-2">
            ${w.steps.map((st, i) => `
              <div class="f-card f-reveal" style="--stagger:${i};display:flex;gap:18px;align-items:flex-start;">
                <span class="f-mono" style="padding:8px 12px;border-radius:8px;background:var(--accent-soft);color:var(--accent);font-size:14px;font-weight:700;">${st.step}</span>
                <div>
                  <div class="f-mono" style="font-size:12px;color:var(--sub);">${st.phase}</div>
                  <h3 class="f-h3" style="margin-top:4px;">${st.title}</h3>
                  <p style="margin:8px 0 0;font-size:13px;color:var(--sub);line-height:1.68;">${st.desc}</p>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    }
  ],

  /* ========================================================================
     21. GALLERY, LOOKBOOK & PORTFOLIO (10 Variants)
     ======================================================================== */
  gallery: [
    {
      id: 'GAL-01', name: '카테고리 실시간 필터 룩북 & 클릭 라이트박스 확대',
      desc: 'ALL / SPACE / OBJECT / EXPERIENCE 필터 칩으로 실시간 분류하고 사진을 클릭하면 풀스크린 확대 감상',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:32px;">
            <div><span class="${ctx.bdgCls}">CURATED ARCHIVE</span><h2 class="f-h2" style="margin-top:12px;">시그니처 컬렉션 & 아카이브</h2></div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${['ALL','SPACE','OBJECT','EXPERIENCE'].map((cat, i) => `<button type="button" onclick="filterGalleryItems('${cat}')" class="gal-filter-btn" data-cat="${cat}" style="padding:7px 15px;border-radius:999px;border:1px solid ${i===0?'var(--fg)':'var(--border)'};background:${i===0?'var(--fg)':'var(--surface)'};color:${i===0?'var(--bg)':'var(--sub)'};font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;cursor:pointer;">${cat}</button>`).join('')}
            </div>
          </div>
          <div class="fg-2" id="gal-filter-grid">
            ${w.works.map((wk, i) => `
              <article class="f-card gal-work-card f-reveal" data-cat="${wk.cat}" style="--stagger:${i};padding:18px;cursor:pointer;" onclick="openImageLightbox('${wk.img}', '${wk.title.replace(/'/g,"")}', '${wk.meta.replace(/'/g,"")} · ${wk.price}')">
                <div class="f-media" style="aspect-ratio:16/10;margin-bottom:16px;"><img src="${IMG[wk.img]}" alt="${wk.title}" /></div>
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
                  <div>
                    <div class="f-mono" style="font-size:12px;color:var(--accent);">${wk.cat} · ${wk.year}</div>
                    <h3 class="f-h3" style="font-size:19px;margin-top:4px;">${wk.title}</h3>
                    <div style="font-size:13px;color:var(--sub);margin-top:4px;">${wk.meta}</div>
                  </div>
                  <span class="f-mono" style="font-size:12px;font-weight:700;padding:6px 12px;border-radius:999px;background:var(--muted);white-space:nowrap;">${wk.price}</span>
                </div>
              </article>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'GAL-02', name: 'Awwwards풍 마우스 추적 플로팅 프리뷰 아카이브 리스트',
      desc: '프로젝트 행 위로 마우스를 움직이면 대형 프리뷰 화보가 커서를 부드럽게 따라다니는 에이전시 시그니처 UI',
      render: (w, ctx) => `
      <section class="f-sec" style="position:relative;">
        <div class="f-container">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px;">
            <div><span class="${ctx.bdgCls}">SELECTED WORKS 2025—2026</span><h2 class="f-h2" style="margin-top:12px;">아카이브 인덱스 (행 위에 마우스를 올려보세요)</h2></div>
          </div>
          <div id="hover-preview-list" style="border-top:1px solid var(--border);">
            ${w.works.map((wk, i) => `
              <div class="hover-work-row" data-img="${wk.img}" onclick="openImageLightbox('${wk.img}', '${wk.title.replace(/'/g,"")}', '${wk.meta.replace(/'/g,"")}')" style="padding:22px 12px;border-bottom:1px solid var(--border);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:14px;cursor:pointer;transition:padding 0.25s ease, background 0.25s ease;">
                <div style="display:flex;align-items:center;gap:20px;">
                  <span class="f-mono" style="font-size:12px;color:var(--accent);">0${i+1}</span>
                  <img src="${IMG[wk.img]}" alt="${wk.title}" style="width:68px;height:46px;object-fit:cover;border-radius:6px;" />
                  <div>
                    <h3 class="f-h3" style="font-size:20px;">${wk.title}</h3>
                    <div style="font-size:13px;color:var(--sub);">${wk.meta}</div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:20px;">
                  <span class="f-mono" style="font-size:12px;color:var(--sub);">${wk.price}</span>
                  <span style="font-size:18px;">↗</span>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'GAL-03', name: '매거진 비대칭 에디토리얼 스프레드 (1대형 + 2서브)',
      desc: '7열 대표 화보와 5열 서브 화보 2점이 황금비율로 배치된 화보집 스타일',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:34px;"><span class="${ctx.bdgCls}">EDITORIAL LOOKBOOK</span><h2 class="f-h2" style="margin-top:12px;">시각적 서사로 기록한 대표 장면</h2></div>
          <div class="fg-12" style="align-items:stretch;">
            <div class="fc-7 f-card" style="padding:18px;display:flex;flex-direction:column;justify-content:space-between;" onclick="openImageLightbox('${w.works[0].img}','${w.works[0].title.replace(/'/g,"")}','${w.works[0].price}')">
              <div class="f-media" style="aspect-ratio:16/11;cursor:pointer;"><img src="${IMG[w.works[0].img]}" alt="Main"/></div>
              <div style="padding-top:16px;display:flex;justify-content:space-between;align-items:baseline;">
                <div><h3 class="f-h3">${w.works[0].title}</h3><p style="margin:4px 0 0;font-size:13px;color:var(--sub);">${w.works[0].meta}</p></div>
                <span class="f-mono" style="color:var(--accent);font-weight:700;">${w.works[0].price}</span>
              </div>
            </div>
            <div class="fc-5" style="display:flex;flex-direction:column;gap:22px;">
              ${w.works.slice(1,3).map(wk => `<div class="f-card" style="padding:16px;flex:1;" onclick="openImageLightbox('${wk.img}','${wk.title.replace(/'/g,"")}','${wk.price}')">
                <div class="f-media" style="aspect-ratio:16/9;margin-bottom:12px;cursor:pointer;"><img src="${IMG[wk.img]}" alt="${wk.title}"/></div>
                <div style="display:flex;justify-content:space-between;align-items:center;"><strong style="font-size:15px;">${wk.title}</strong><span class="f-mono" style="font-size:12px;color:var(--accent);">${wk.price}</span></div>
              </div>`).join('')}
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'GAL-04', name: '아코디언 확장형 3패널 파노라마 트립틱 (Hover Expand)',
      desc: '마우스를 올린 패널이 와이드하게 펼쳐지며 몰입감을 극대화하는 인터랙티브 3폭 화보',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:28px;"><span class="${ctx.bdgCls}">PANORAMIC TRIPTYCH</span><h2 class="f-h2" style="margin-top:12px;">패널에 마우스를 올려 공간을 넓게 감상하세요</h2></div>
          <div style="display:flex;gap:14px;height:400px;">
            ${w.works.slice(0,3).map((wk, i) => `
              <div onmouseenter="this.parentElement.querySelectorAll('.triptych-item').forEach(el=>el.style.flex='1');this.style.flex='2.4';" class="triptych-item" style="flex:${i===0?'2.4':'1'};position:relative;border-radius:var(--radius);overflow:hidden;cursor:pointer;transition:flex 0.55s cubic-bezier(0.16,1,0.3,1);" onclick="openImageLightbox('${wk.img}','${wk.title.replace(/'/g,"")}','${wk.price}')">
                <img src="${IMG[wk.img]}" alt="${wk.title}" style="width:100%;height:100%;object-fit:cover;display:block;" />
                <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(0,0,0,0.84) 100%);display:flex;flex-direction:column;justify-content:flex-end;padding:24px;color:#fff;">
                  <span class="f-mono" style="font-size:12px;color:#E8C99B;">0${i+1} // ${wk.cat}</span>
                  <div style="font-family:var(--font-display);font-size:21px;font-weight:600;margin-top:4px;">${wk.title}</div>
                  <div style="font-size:12px;opacity:0.82;margin-top:4px;">${wk.meta} · ${wk.price}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'GAL-05', name: '부티크 플래그십 이커머스 컬렉션 (즉시 담기 인터랙션)',
      desc: '제품·프로그램 카드와 원클릭 컨시어지 백 담기 피드백이 결합된 스토어 레이아웃',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:34px;">
            <div><span class="${ctx.bdgCls}">ONLINE BOUTIQUE</span><h2 class="f-h2" style="margin-top:12px;">시그니처 에디션 스토어</h2></div>
          </div>
          <div class="fg-4">
            ${w.works.map((wk, i) => `<div class="f-card f-reveal" style="--stagger:${i};padding:16px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
              <div>
                <div class="f-media" style="aspect-ratio:1/1.05;margin-bottom:14px;cursor:pointer;" onclick="openImageLightbox('${wk.img}','${wk.title.replace(/'/g,"")}','${wk.price}')"><img src="${IMG[wk.img]}" alt="${wk.title}"/></div>
                <div class="f-mono" style="font-size:12px;color:var(--accent);">${wk.cat}</div>
                <h3 class="f-h3" style="font-size:16px;margin-top:4px;">${wk.title}</h3>
                <div style="font-size:12px;color:var(--sub);margin-top:4px;">${wk.meta}</div>
              </div>
              <div style="padding-top:12px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
                <span class="f-mono" style="font-size:13px;font-weight:700;">${wk.price}</span>
                <button type="button" onclick="showStudioToast('${wk.title.replace(/'/g,"")} 항목이 컨시어지 백에 담겼습니다.')" style="padding:7px 13px;border-radius:999px;background:var(--fg);color:var(--bg);border:none;font-size:12px;font-weight:600;cursor:pointer;">+ 담기</button>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'GAL-06', name: '가로 스크롤 시네마 필름스트립 캐러셀 (← → 버튼)',
      desc: '좌우 화살표 버튼으로 부드럽게 넘겨보는 와이드 필름 아카이브',
      render: (w, ctx) => `<section class="f-sec">
        <div class="f-container">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px;">
            <div><span class="${ctx.bdgCls}">FILMSTRIP CAROUSEL</span><h2 class="f-h2" style="margin-top:10px;">시네마틱 수평 쇼케이스</h2></div>
            <div style="display:flex;gap:8px;">
              <button type="button" onclick="document.getElementById('gal-film-strip')?.scrollBy({left:-380,behavior:'smooth'})" style="width:40px;height:40px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--fg);cursor:pointer;">←</button>
              <button type="button" onclick="document.getElementById('gal-film-strip')?.scrollBy({left:380,behavior:'smooth'})" style="width:40px;height:40px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--fg);cursor:pointer;">→</button>
            </div>
          </div>
          <div id="gal-film-strip" style="display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:10px;">
            ${w.works.map((wk, i) => `<div class="f-card" style="min-width:330px;flex:1;scroll-snap-align:start;padding:16px;cursor:pointer;" onclick="openImageLightbox('${wk.img}','${wk.title.replace(/'/g,"")}','${wk.price}')">
              <div class="f-media" style="aspect-ratio:16/10;margin-bottom:14px;"><img src="${IMG[wk.img]}" alt="${wk.title}"/></div>
              <div class="f-mono" style="font-size:12px;color:var(--accent);">FRAME 0${i+1} · ${wk.year}</div>
              <h3 class="f-h3" style="font-size:18px;margin-top:4px;">${wk.title}</h3>
              <div style="font-size:12px;color:var(--sub);margin-top:4px;">${wk.meta} · <strong>${wk.price}</strong></div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'GAL-07', name: '35mm 아날로그 콘택트 시트 4단 프린트',
      desc: '필름 프레임 넘버링과 파인아트 인화 여백을 살린 사진가 스타일 갤러리',
      render: (w, ctx) => `<section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:30px;"><span class="${ctx.bdgCls}">35MM CONTACT SHEET</span><h2 class="f-h2" style="margin-top:10px;">필름 아카이브 프린트</h2></div>
          <div class="fg-4">
            ${w.works.map((wk, i) => `<div onclick="openImageLightbox('${wk.img}','${wk.title.replace(/'/g,"")}','${wk.price}')" style="padding:12px 12px 22px;background:#FFFFFF;color:#141414;border:1px solid rgba(0,0,0,0.12);box-shadow:0 16px 36px -14px rgba(0,0,0,0.18);cursor:pointer;">
              <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:12px;color:#737373;margin-bottom:8px;"><span>KODAK 400</span><span>0${i+1}A</span></div>
              <div style="aspect-ratio:4/3;overflow:hidden;"><img src="${IMG[wk.img]}" alt="${wk.title}" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>
              <div style="font-family:var(--font-display);font-size:17px;font-weight:600;margin-top:12px;">${wk.title}</div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'GAL-08', name: '케이스 스터디 심층 리포트 & 성과 검증 스플릿',
      desc: '대표 수행 사례 화보와 실제 정량적 비즈니스 임팩트를 함께 제시하는 B2B·로펌·에이전시 갤러리',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="display:flex;flex-direction:column;gap:24px;">
          <div><span class="${ctx.bdgCls}">CASE ARCHIVE</span><h2 class="f-h2" style="margin-top:12px;">검증된 대표 레퍼런스</h2></div>
          ${w.works.slice(0,2).map((wk, i) => `<div class="f-card fg-12 f-reveal" style="--stagger:${i};padding:24px;">
            <div class="fc-5"><div class="f-media" style="aspect-ratio:16/10;"><img src="${IMG[wk.img]}" alt="${wk.title}"/></div></div>
            <div class="fc-7" style="display:flex;flex-direction:column;gap:12px;">
              <div style="display:flex;justify-content:space-between;"><span class="f-mono" style="font-size:12px;color:var(--accent);">CASE 0${i+1} · ${wk.year}</span><span class="f-mono" style="font-size:12px;font-weight:700;">${wk.price}</span></div>
              <h3 class="f-h2" style="font-size:24px;">${wk.title}</h3>
              <p style="margin:0;font-size:14px;color:var(--sub);">${wk.meta} — 철저한 사전 리서치와 맞춤형 아키텍처 설계를 통해 최상의 결과를 도출했습니다.</p>
            </div>
          </div>`).join('')}
        </div>
      </section>`
    },
    {
      id: 'GAL-09', name: '인터랙티브 마스터 뷰어 + 4썸네일 스테이지',
      desc: '하단 4개의 썸네일을 클릭하면 상단 21:9 와이드 메인 뷰어가 실시간 교체되는 쇼룸 섹션',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:26px;"><span class="${ctx.bdgCls}">INTERACTIVE SHOWROOM</span><h2 class="f-h2" style="margin-top:10px;">디테일 마스터 뷰어</h2></div>
          <div class="f-card" style="padding:16px;">
            <div class="f-media" style="aspect-ratio:21/9;margin-bottom:14px;"><img id="gal-stage-main" src="${IMG[w.works[0].img]}" alt="${w.works[0].title}"/></div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 8px 16px;border-bottom:1px solid var(--border);">
              <strong id="gal-stage-title" style="font-size:17px;">${w.works[0].title}</strong>
              <span id="gal-stage-meta" class="f-mono" style="font-size:13px;color:var(--accent);font-weight:700;">${w.works[0].meta} · ${w.works[0].price}</span>
            </div>
            <div class="fg-4" style="padding-top:14px;gap:12px;">
              ${w.works.map((wk, idx) => `
                <button type="button" onclick="swapGalleryMaster(${idx})" style="padding:8px;border-radius:calc(var(--radius)*0.7);border:1px solid var(--border);background:var(--bg);color:var(--fg);cursor:pointer;text-align:left;">
                  <div style="aspect-ratio:16/9;overflow:hidden;border-radius:4px;margin-bottom:6px;"><img src="${IMG[wk.img]}" alt="${wk.title}" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>
                  <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">0${idx+1}. ${wk.title}</div>
                </button>`).join('')}
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'GAL-10', name: '뮤지엄 화이트큐브 오프셋 듀오 전시관',
      desc: '좌우 프레임의 수직 높낮이에 40px 시차를 두어 현대미술관 도록처럼 호흡하는 갤러리',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:36px;"><span class="${ctx.bdgCls}">EXHIBITION PLATES</span><h2 class="f-h2" style="margin-top:10px;">공간과 오브제의 조형적 대비</h2></div>
          <div class="fg-2" style="align-items:start;">
            ${w.works.slice(0,2).map((wk, i) => `
              <div class="f-card" style="margin-top:${i===1?'38px':'0'};padding:20px;cursor:pointer;" onclick="openImageLightbox('${wk.img}','${wk.title.replace(/'/g,"")}','${wk.price}')">
                <div class="f-media" style="aspect-ratio:4/4.4;margin-bottom:16px;"><img src="${IMG[wk.img]}" alt="${wk.title}"/></div>
                <div class="f-mono" style="font-size:12px;color:var(--accent);">PLATE 0${i+1}</div>
                <h3 class="f-h3" style="margin-top:4px;">${wk.title}</h3>
                <p style="margin:6px 0 0;font-size:13px;color:var(--sub);">${wk.meta} — ${wk.price}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    }
  ],

  /* ========================================================================
     22. TEAM, DIRECTORS, PARTNERS & ARTISANS (10 Variants)
     ======================================================================== */
  team: [
    {
      id: 'TEM-01', name: '3열 에디토리얼 디렉터·장인 포트레이트 그리드',
      desc: '수석 디렉터 3인의 인물·공간 포트레이트와 주요 약력·철학을 품격 있게 소개',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:36px;">
            <div><span class="${ctx.bdgCls}">LEADERSHIP & ARTISANS</span><h2 class="f-h2" style="margin-top:12px;">철학과 디테일을 이끄는 사람들</h2></div>
            <p style="margin:0;font-size:14px;color:var(--sub);max-width:400px;">각 분야 최고의 전문성과 장인정신을 갖춘 리더십이 직접 모든 과정을 책임집니다.</p>
          </div>
          <div class="fg-3">
            ${w.team.map((m, i) => `
              <div class="f-card f-reveal" style="--stagger:${i};padding:20px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
                <div>
                  <div class="f-media" style="aspect-ratio:4/4.2;margin-bottom:16px;"><img src="${IMG[m.img]}" alt="${m.name}" /></div>
                  <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${m.role}</div>
                  <h3 class="f-h3" style="font-size:21px;margin-top:4px;">${m.name}</h3>
                  <p style="margin:8px 0 0;font-size:13px;color:var(--sub);line-height:1.65;">${m.bio}</p>
                </div>
                <div style="padding-top:12px;border-top:1px solid var(--border);font-size:12px;color:var(--fg);font-weight:600;">${m.cred}</div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'TEM-02', name: '인터랙티브 수석 디렉터 스포트라이트 스위처',
      desc: '좌측 인물 버튼을 클릭하면 우측 대형 포트레이트와 상세 이력이 즉시 교체되는 대화형 팀 소개',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12">
          <div class="fc-5" style="display:flex;flex-direction:column;gap:12px;">
            <span class="${ctx.bdgCls}">MEET THE DIRECTORS</span>
            <h2 class="f-h2" style="margin-bottom:10px;">전담 파트너 프로필</h2>
            ${w.team.map((m, idx) => `
              <button type="button" onclick="switchTeamMember(${idx})" class="tem-switch-btn" data-idx="${idx}" style="text-align:left;padding:16px 18px;border-radius:var(--radius);border:1px solid ${idx===0?'var(--accent)':'var(--border)'};background:${idx===0?'var(--accent-soft)':'var(--surface)'};color:var(--fg);cursor:pointer;">
                <div style="font-size:15px;font-weight:700;">${m.name}</div>
                <div style="font-size:12px;color:var(--sub);margin-top:3px;">${m.role}</div>
              </button>`).join('')}
          </div>
          <div class="fc-7 f-card fg-12" style="padding:26px;">
            <div class="fc-5"><div class="f-media" style="aspect-ratio:3/3.6;"><img id="tem-sw-img" src="${IMG[w.team[0].img]}" alt="${w.team[0].name}"/></div></div>
            <div class="fc-7" style="display:flex;flex-direction:column;gap:12px;">
              <span id="tem-sw-role" class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${w.team[0].role}</span>
              <h3 id="tem-sw-name" class="f-h2" style="font-size:28px;">${w.team[0].name}</h3>
              <p id="tem-sw-bio" style="margin:0;font-size:14px;color:var(--sub);line-height:1.75;">${w.team[0].bio}</p>
              <div id="tem-sw-cred" style="padding-top:12px;border-top:1px solid var(--border);font-size:12px;font-weight:600;">${w.team[0].cred}</div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'TEM-03', name: '에디토리얼 로스터 인덱스 (수평 아카이브 행)',
      desc: '미니 포트레이트와 직책·자격 사항을 정갈한 수평 행으로 배열한 모던 스튜디오·로펌 명부',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:28px;"><span class="${ctx.bdgCls}">PARTNER DIRECTORY</span><h2 class="f-h2" style="margin-top:10px;">핵심 리더십 디렉토리</h2></div>
          <div style="border-top:1px solid var(--border);">
            ${w.team.map((m, i) => `
              <div class="fg-12 f-reveal" style="--stagger:${i};padding:22px 8px;border-bottom:1px solid var(--border);">
                <div class="fc-4" style="display:flex;align-items:center;gap:16px;">
                  <img src="${IMG[m.img]}" alt="${m.name}" style="width:56px;height:56px;border-radius:999px;object-fit:cover;border:1px solid var(--border);" />
                  <div><strong style="font-size:17px;">${m.name}</strong><div style="font-size:12px;color:var(--accent);margin-top:2px;">${m.role}</div></div>
                </div>
                <div class="fc-5" style="font-size:13px;color:var(--sub);">${m.bio}</div>
                <div class="fc-3 f-mono" style="font-size:12px;text-align:right;color:var(--fg);">${m.cred}</div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'TEM-04', name: '파운더 매니페스토 레터 & 서명 스플릿',
      desc: '창립 디렉터의 대형 포트레이트와 철학이 담긴 서한, 벡터 서명으로 깊은 신뢰를 형성',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12">
          <div class="fc-5"><div class="f-media" style="aspect-ratio:4/4.6;"><img src="${IMG[w.team[0].img]}" alt="${w.team[0].name}"/></div></div>
          <div class="fc-7" style="display:flex;flex-direction:column;gap:18px;">
            <span class="${ctx.bdgCls}">DIRECTOR’S NOTE</span>
            <h2 class="f-h2">"타협 없는 디테일만이 시간이 흘러도 변치 않는 가치를 남깁니다."</h2>
            <p style="margin:0;font-size:15px;color:var(--sub);line-height:1.8;">${w.team[0].bio} ${w.h1Sub}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:18px;border-top:1px solid var(--border);">
              <div>
                <div style="font-size:16px;font-weight:700;">${w.team[0].name}</div>
                <div style="font-size:12px;color:var(--sub);margin-top:2px;">${w.team[0].role} · ${w.team[0].cred}</div>
              </div>
              <svg width="120" height="38" viewBox="0 0 160 48" fill="none" stroke="currentColor" stroke-width="1.8" style="color:var(--accent);opacity:0.85;"><path d="M12 34 C28 10, 44 40, 62 18 C74 6, 82 36, 98 24 C114 12, 128 32, 148 20" stroke-linecap="round"/></svg>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'TEM-05', name: '이그제큐티브 파트너 자격·수임 카드 (로펌·클리닉·자문)',
      desc: '학력·자격 증명과 1:1 비공개 자문 연결 버튼을 전면에 배치한 전문가 신뢰 레이아웃',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:32px;"><span class="${ctx.bdgCls}">SENIOR PARTNERS</span><h2 class="f-h2" style="margin-top:10px;">전원 수석 파트너 직할 체제</h2></div>
          <div class="fg-3">
            ${w.team.map(m => `
              <div class="f-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
                <div>
                  <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;">
                    <img src="${IMG[m.img]}" alt="${m.name}" style="width:64px;height:64px;border-radius:12px;object-fit:cover;" />
                    <div><h3 class="f-h3" style="font-size:19px;">${m.name}</h3><div style="font-size:12px;color:var(--accent);font-weight:600;margin-top:2px;">${m.role}</div></div>
                  </div>
                  <div style="padding:10px 12px;border-radius:8px;background:var(--muted);font-size:12px;font-weight:600;margin-bottom:12px;">${m.cred}</div>
                  <p style="margin:0;font-size:13px;color:var(--sub);line-height:1.65;">${m.bio}</p>
                </div>
                <button type="button" onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})" style="padding:10px 14px;border-radius:calc(var(--radius)*0.7);border:1px solid var(--border);background:transparent;color:var(--fg);font-size:12px;font-weight:700;cursor:pointer;">${m.name} 파트너 직접 자문 요청 →</button>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'TEM-06', name: '매거진 마스트헤드 크레딧 콜로폰',
      desc: '보그·킨포크 판권면처럼 절제된 타이포그래피만으로 아틀리에 구성원을 기록하는 미니멀 레이아웃',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="max-width:920px;text-align:center;">
          <span class="${ctx.bdgCls}">ATELIER MASTHEAD</span>
          <h2 class="f-h2" style="margin:12px 0 36px;">${w.brand} 크리에이티브 콜렉티브</h2>
          <div class="fg-3" style="text-align:left;border-top:1.5px solid var(--fg);padding-top:26px;">
            ${w.team.map((m, i) => `
              <div>
                <div class="f-mono" style="font-size:12px;color:var(--accent);">0${i+1} // DIRECTOR</div>
                <div style="font-family:var(--font-display);font-size:24px;font-weight:700;margin-top:6px;">${m.name}</div>
                <div style="font-size:12px;font-weight:600;margin-top:4px;">${m.role}</div>
                <p style="font-size:13px;color:var(--sub);margin-top:8px;line-height:1.6;">${m.cred}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'TEM-07', name: '다크 인버트 마스터 아티잔 쇼케이스',
      desc: '깊은 다크 무대 배경 위에서 장인과 디렉터의 인물 사진을 드라마틱하게 조명',
      render: (w) => `
      <section style="padding:var(--sec-py) var(--sec-px);background:var(--fg);color:var(--bg);border-bottom:1px solid var(--border);">
        <div class="f-container" style="padding:0;">
          <div style="margin-bottom:34px;"><span class="f-mono" style="font-size:12px;color:var(--accent);">MASTER ARTISANS</span><h2 class="f-h2" style="margin-top:10px;color:var(--bg);">장인정신으로 빚어내는 시그니처</h2></div>
          <div class="fg-3">
            ${w.team.map(m => `
              <div style="padding:20px;border-radius:var(--radius);border:1px solid rgba(128,128,128,0.28);background:rgba(128,128,128,0.08);">
                <div style="aspect-ratio:4/3.6;border-radius:calc(var(--radius)*0.7);overflow:hidden;margin-bottom:16px;"><img src="${IMG[m.img]}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;display:block;"/></div>
                <div class="f-mono" style="font-size:12px;color:var(--accent);">${m.role}</div>
                <h3 class="f-h3" style="color:var(--bg);margin-top:4px;">${m.name}</h3>
                <p style="font-size:13px;opacity:0.78;margin:8px 0 0;line-height:1.65;">${m.bio}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'TEM-08', name: '아틀리에 스튜디오 화보 + 3인 리더십 하이브리드',
      desc: '상단 와이드 작업실 화보로 현장감을 전달하고 하단에 3인의 디렉터 카드를 결합',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div class="f-media" style="aspect-ratio:21/8;margin-bottom:28px;"><img src="${IMG.atelier}" alt="Atelier Studio"/></div>
          <div class="fg-3">
            ${w.team.map(m => `<div class="f-card" style="padding:22px;">
              <div class="f-mono" style="font-size:12px;color:var(--accent);">${m.role}</div>
              <h3 class="f-h3" style="margin-top:6px;">${m.name}</h3>
              <p style="font-size:13px;color:var(--sub);margin:8px 0 12px;line-height:1.65;">${m.bio}</p>
              <div style="font-size:12px;font-weight:600;color:var(--fg);">${m.cred}</div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'TEM-09', name: '스위스 보더 그리드 인물 아카이브',
      desc: '구조적 실선 격자 안에 사진과 약력을 밀도 있게 정렬한 에이전시·건축 사무소 팀 섹션',
      render: (w) => `
      <section style="border-bottom:1.5px solid var(--fg);">
        <div class="fg-3" style="gap:0;">
          ${w.team.map((m, i) => `
            <div style="padding:34px 28px;border-right:${i<2?'1.5px solid var(--fg)':'none'};">
              <div class="f-mono" style="font-size:12px;margin-bottom:14px;display:flex;justify-content:space-between;"><span>DIR // 0${i+1}</span><span style="color:var(--accent);">SEOUL</span></div>
              <div class="f-media" style="aspect-ratio:4/3.6;margin-bottom:16px;"><img src="${IMG[m.img]}" alt="${m.name}"/></div>
              <h3 class="f-h3">${m.name}</h3>
              <div style="font-size:12px;color:var(--accent);font-weight:600;margin-top:4px;">${m.role}</div>
              <p style="font-size:13px;color:var(--sub);margin-top:8px;">${m.bio}</p>
            </div>`).join('')}
        </div>
      </section>`
    },
    {
      id: 'TEM-10', name: '비대칭 1+2 대표 디렉터 & 수석 파트너 스플릿',
      desc: '좌측 대표 디렉터 집중 조명 카드와 우측 수석 파트너 2인 스택을 비대칭으로 구성',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12" style="align-items:stretch;">
          <div class="fc-6 f-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
            <div class="f-media" style="aspect-ratio:16/11;"><img src="${IMG[w.team[0].img]}" alt="${w.team[0].name}"/></div>
            <div>
              <span class="${ctx.bdgCls}">${w.team[0].role}</span>
              <h3 class="f-h2" style="font-size:26px;margin-top:10px;">${w.team[0].name}</h3>
              <p style="font-size:14px;color:var(--sub);margin:8px 0 0;">${w.team[0].bio}</p>
            </div>
          </div>
          <div class="fc-6" style="display:flex;flex-direction:column;gap:20px;">
            ${w.team.slice(1).map(m => `
              <div class="f-card" style="flex:1;display:flex;gap:18px;align-items:center;">
                <img src="${IMG[m.img]}" alt="${m.name}" style="width:92px;height:92px;border-radius:var(--radius);object-fit:cover;flex-shrink:0;" />
                <div>
                  <div class="f-mono" style="font-size:12px;color:var(--accent);">${m.role}</div>
                  <h3 class="f-h3" style="margin-top:4px;">${m.name}</h3>
                  <p style="font-size:13px;color:var(--sub);margin:6px 0 0;">${m.cred}</p>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    }
  ],

  /* ========================================================================
     23. PRICING & MEMBERSHIP (10 Variants)
     ======================================================================== */
  pricing: [
    {
      id: 'PRC-01', name: '3단 플래그십 멤버십 & 실시간 일반/연간 우대(-20%) 토글',
      desc: '상단 토글 클릭 시 전 플랜의 금액이 연간 20% 우대가로 실시간 전환되는 대표 요금표',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:18px;margin-bottom:38px;">
            <div><span class="${ctx.bdgCls}">PROGRAMS & MEMBERSHIP</span><h2 class="f-h2" style="margin-top:12px;">투명하고 합리적인 프로그램 안내</h2></div>
            <div style="display:inline-flex;padding:4px;border-radius:999px;background:var(--muted);border:1px solid var(--border);">
              <button type="button" onclick="toggleBillingCycle('monthly')" id="bill-btn-m" style="padding:8px 16px;border-radius:999px;border:none;background:var(--fg);color:var(--bg);font-size:12px;font-weight:700;cursor:pointer;">스탠다드 요금</button>
              <button type="button" onclick="toggleBillingCycle('annual')" id="bill-btn-a" style="padding:8px 16px;border-radius:999px;border:none;background:transparent;color:var(--sub);font-size:12px;font-weight:700;cursor:pointer;">멤버십·연간 우대 (-20%)</button>
            </div>
          </div>
          <div class="fg-3" style="align-items:stretch;">
            ${w.plans.map((p, i) => `
              <div class="f-card f-reveal" style="--stagger:${i};display:flex;flex-direction:column;justify-content:space-between;gap:24px;${p.featured?'border:2px solid var(--accent);box-shadow:0 26px 60px -20px rgba(0,0,0,0.22);':''}">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${p.tier}</span>
                    ${p.featured?`<span style="padding:3px 10px;border-radius:999px;background:var(--accent);color:var(--accent-fg);font-size:12px;font-weight:700;">RECOMMENDED</span>`:''}
                  </div>
                  <h3 class="f-h3" style="margin-top:10px;">${p.name}</h3>
                  <div style="margin-top:18px;display:flex;align-items:baseline;gap:6px;">
                    <span class="f-price-val" data-monthly="${p.monthly}" data-annual="${p.annual}" style="font-family:var(--font-display);font-size:34px;font-weight:700;">${p.monthly}</span>
                    <span style="font-size:12px;color:var(--sub);">${p.unit}</span>
                  </div>
                  <p style="font-size:13px;color:var(--sub);margin:14px 0 20px;line-height:1.65;">${p.desc}</p>
                  <div style="border-top:1px solid var(--border);padding-top:16px;display:flex;flex-direction:column;gap:9px;font-size:13px;">
                    ${p.perks.map(pk => `<div style="display:flex;align-items:center;gap:8px;"><span style="color:var(--accent);">✓</span><span>${pk}</span></div>`).join('')}
                  </div>
                </div>
                <div onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})">${ctx.btn(p.featured ? w.ctaPrimary : '프로그램 선택')}</div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRC-02', name: '파인다이닝·살롱 에디토리얼 메뉴판 레이아웃',
      desc: '사각 카드 대신 점선 리더 라인(Leader Line)으로 프로그램과 요금을 우아하게 연결한 살롱 메뉴 스타일',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="max-width:940px;">
          <div style="text-align:center;margin-bottom:42px;"><span class="${ctx.bdgCls}">CURATED MENU & TARIFF</span><h2 class="f-h2" style="margin-top:12px;">시그니처 코스 및 프로그램 일람</h2></div>
          <div class="f-card" style="padding:40px;">
            ${w.plans.map((p, i) => `
              <div style="padding:${i>0?'28px':'0'} 0 ${i<2?'28px':'0'};border-bottom:${i<2?'1px solid var(--border)':'none'};">
                <div style="display:flex;align-items:baseline;gap:14px;">
                  <h3 class="f-h3" style="font-size:21px;white-space:nowrap;">${p.name}</h3>
                  <div style="flex:1;border-bottom:1px dotted var(--border);"></div>
                  <span style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--accent);">${p.monthly}</span>
                </div>
                <p style="margin:8px 0 10px;font-size:14px;color:var(--sub);">${p.desc}</p>
                <div class="f-mono" style="font-size:12px;color:var(--fg);">${p.perks.join('  ·  ')}</div>
              </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRC-03', name: '다크 VIP 블랙카드 인버트 멤버십 쇼케이스',
      desc: '프리미엄 클럽과 하이엔드 컨시어지를 위한 고대비 다크 플랜 섹션',
      render: (w) => `<section style="padding:var(--sec-py) var(--sec-px);background:var(--fg);color:var(--bg);border-bottom:1px solid var(--border);">
        <div class="f-container" style="padding:0;">
          <div style="margin-bottom:36px;"><span class="f-mono" style="font-size:12px;color:var(--accent);letter-spacing:0.16em;">PRIVATE CLUB TIERS</span><h2 class="f-h2" style="margin-top:10px;color:var(--bg);">프라이빗 멤버십 & 패키지</h2></div>
          <div class="fg-3">
            ${w.plans.map(p => `<div style="padding:30px;border-radius:var(--radius);border:1px solid ${p.featured?'var(--accent)':'rgba(128,128,128,0.3)'};background:rgba(128,128,128,0.08);display:flex;flex-direction:column;justify-content:space-between;gap:20px;">
              <div>
                <span class="f-mono" style="font-size:12px;color:var(--accent);">${p.tier}</span>
                <h3 class="f-h3" style="margin-top:8px;color:var(--bg);">${p.name}</h3>
                <div style="font-family:var(--font-display);font-size:34px;font-weight:700;margin:14px 0;color:var(--accent);">${p.monthly}</div>
                <p style="font-size:13px;opacity:0.78;line-height:1.65;">${p.desc}</p>
              </div>
              <div style="font-size:12px;opacity:0.88;border-top:1px solid rgba(128,128,128,0.25);padding-top:14px;">${p.perks.join(' · ')}</div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRC-04', name: '이그제큐티브 비교 매트릭스 테이블',
      desc: '티어별 제공 범위와 보장 혜택을 한눈에 대조하는 엔터프라이즈·로펌 비교표',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:32px;"><span class="${ctx.bdgCls}">TIER COMPARISON</span><h2 class="f-h2" style="margin-top:12px;">플랜별 세부 지원 범위 비교</h2></div>
          <div class="f-card" style="padding:0;overflow:hidden;">
            <div class="fg-4" style="padding:20px 26px;background:var(--muted);border-bottom:1px solid var(--border);font-weight:700;font-size:13px;">
              <div>프로그램 구분</div>
              ${w.plans.map(p => `<div><div class="f-mono" style="font-size:12px;color:var(--accent);">${p.tier}</div><div>${p.monthly}</div></div>`).join('')}
            </div>
            ${[0,1,2].map(r => `<div class="fg-4" style="padding:18px 26px;border-bottom:${r<2?'1px solid var(--border)':'none'};font-size:13px;">
              <div style="font-weight:600;color:var(--sub);">핵심 제공 혜택 0${r+1}</div>
              ${w.plans.map(p => `<div>✓ ${p.perks[r]}</div>`).join('')}
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRC-05', name: '미니멀 수평 행(Row) 요금 일람',
      desc: '가로 행 배치로 프로그램명·혜택·금액을 명쾌하게 정렬',
      render: (w, ctx) => `<section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:30px;"><span class="${ctx.bdgCls}">TRANSPARENT RATES</span><h2 class="f-h2" style="margin-top:10px;">프로그램별 요금 안내</h2></div>
          <div style="display:flex;flex-direction:column;gap:14px;">
            ${w.plans.map(p => `<div class="f-card fg-12" style="padding:24px 28px;">
              <div class="fc-4"><span class="f-mono" style="font-size:12px;color:var(--accent);">${p.tier}</span><h3 class="f-h3" style="margin-top:4px;">${p.name}</h3></div>
              <div class="fc-5" style="font-size:13px;color:var(--sub);">${p.desc}</div>
              <div class="fc-3" style="text-align:right;"><div style="font-family:var(--font-display);font-size:28px;font-weight:700;color:var(--fg);">${p.monthly}</div><div style="font-size:12px;color:var(--sub);">${p.unit}</div></div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRC-06', name: '하이임팩트 스플릿 VIP 패스 + 서브 플랜 스택',
      desc: '좌측 주력 시그니처 패키지를 대형 다크 카드로 강조하고 우측에 대안 플랜 2종을 배치',
      render: (w) => `
      <section class="f-sec">
        <div class="f-container fg-12" style="align-items:stretch;">
          <div class="fc-6" style="padding:40px;border-radius:var(--radius);background:var(--fg);color:var(--bg);display:flex;flex-direction:column;justify-content:space-between;gap:24px;">
            <div>
              <span class="f-mono" style="font-size:12px;color:var(--accent);">SIGNATURE FLAGSHIP</span>
              <h2 class="f-h2" style="margin-top:10px;color:var(--bg);">${w.plans[1].name}</h2>
              <div style="font-family:var(--font-display);font-size:42px;font-weight:700;margin-top:16px;color:var(--accent);">${w.plans[1].monthly} <span style="font-size:14px;opacity:0.7;color:var(--bg);">${w.plans[1].unit}</span></div>
              <p style="font-size:14px;opacity:0.82;line-height:1.7;margin-top:14px;">${w.plans[1].desc}</p>
              <div style="margin-top:20px;display:flex;flex-direction:column;gap:8px;font-size:13px;">${w.plans[1].perks.map(pk=>`<div>✦ ${pk}</div>`).join('')}</div>
            </div>
            <button type="button" onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})" style="padding:14px 24px;border-radius:999px;background:var(--accent);color:var(--accent-fg);border:none;font-size:13px;font-weight:700;cursor:pointer;align-self:flex-start;">${w.ctaPrimary} →</button>
          </div>
          <div class="fc-6" style="display:flex;flex-direction:column;gap:20px;">
            ${[w.plans[0], w.plans[2]].map(p => `<div class="f-card" style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
              <div><span class="f-mono" style="font-size:12px;color:var(--accent);">${p.tier}</span><div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:6px;"><h3 class="f-h3">${p.name}</h3><strong class="f-mono" style="font-size:18px;">${p.monthly}</strong></div><p style="font-size:13px;color:var(--sub);margin:10px 0 0;">${p.desc}</p></div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRC-07', name: '인터랙티브 수량·박수·시트 실시간 계산기 플랜',
      desc: '슬라이더로 이용 횟수/시트(1~10단위)를 조절하면 총 견적과 볼륨 할인율이 즉시 계산',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="max-width:920px;">
          <div class="f-card" style="padding:38px;">
            <span class="${ctx.bdgCls}">INTERACTIVE RATE CALCULATOR</span>
            <h2 class="f-h2" style="margin-top:10px;">이용 규모별 맞춤 견적 시뮬레이터</h2>
            <div style="margin:26px 0;padding:22px;border-radius:var(--radius);background:var(--muted);">
              <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;margin-bottom:10px;">
                <span>선택 단위 (인원 / 박수 / 시트)</span>
                <span id="prc-calc-units" class="f-mono" style="color:var(--accent);">2 단위 (VIP 10% 우대 적용)</span>
              </div>
              <input type="range" min="1" max="8" value="2" oninput="const u=Number(this.value);document.getElementById('prc-calc-units').textContent=u+' 단위 '+(u>=4?'(장기 15% 우대)':'(VIP 10% 우대)');document.getElementById('prc-calc-mult').textContent='× '+u;" style="width:100%;accent-color:var(--accent);cursor:pointer;" />
            </div>
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;">
              <div>
                <div style="font-size:13px;color:var(--sub);">기준 프로그램: <strong>${w.plans[1].name}</strong></div>
                <div style="font-family:var(--font-display);font-size:36px;font-weight:700;margin-top:4px;">${w.plans[1].annual} <span id="prc-calc-mult" class="f-mono" style="font-size:18px;color:var(--accent);">× 2</span></div>
              </div>
              <div onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})">${ctx.btn(w.ctaPrimary)}</div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRC-08', name: '스위스 브루탈 하드 보더 요금 아키텍처',
      desc: '1.5px 노출 실선으로 3열 플랜을 칼같이 분할한 모더니즘 포스터형 가격표',
      render: (w, ctx) => `
      <section style="border-bottom:1.5px solid var(--fg);">
        <div class="fg-3" style="gap:0;align-items:stretch;">
          ${w.plans.map((p, i) => `
            <div style="padding:40px 28px;border-right:${i<2?'1.5px solid var(--fg)':'none'};background:${p.featured?'var(--muted)':'transparent'};display:flex;flex-direction:column;justify-content:space-between;gap:24px;">
              <div>
                <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">0${i+1} // ${p.tier}</div>
                <h3 class="f-h3" style="margin-top:10px;">${p.name}</h3>
                <div style="font-family:var(--font-display);font-size:36px;font-weight:800;margin:16px 0;">${p.monthly}</div>
                <p style="font-size:13px;color:var(--sub);line-height:1.65;">${p.desc}</p>
              </div>
              <div>${ctx.btn('SELECT TIER')}</div>
            </div>`).join('')}
        </div>
      </section>`
    },
    {
      id: 'PRC-09', name: '탭 포커스형 단일 티어 정밀 인스펙터',
      desc: '3개 티어 탭 중 하나를 클릭해 포함 특전과 상세 안내를 집중 검토하는 깔끔한 요금 섹션',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="max-width:900px;">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:14px;margin-bottom:26px;">
            <h2 class="f-h2">멤버십 티어 상세 비교</h2>
            <div style="display:inline-flex;gap:6px;">
              ${w.plans.map((p, idx) => `<button type="button" onclick="switchPlanInspector(${idx})" class="prc-insp-btn" data-idx="${idx}" style="padding:8px 14px;border-radius:999px;border:1px solid ${idx===1?'var(--accent)':'var(--border)'};background:${idx===1?'var(--accent)':'var(--surface)'};color:${idx===1?'var(--accent-fg)':'var(--fg)'};font-size:12px;font-weight:700;cursor:pointer;">${p.tier}</button>`).join('')}
            </div>
          </div>
          <div class="f-card fg-12" style="padding:34px;">
            <div class="fc-7">
              <div id="prc-in-tier" class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${w.plans[1].tier}</div>
              <h3 id="prc-in-name" class="f-h2" style="font-size:28px;margin-top:6px;">${w.plans[1].name}</h3>
              <p id="prc-in-desc" style="font-size:14px;color:var(--sub);margin:12px 0 18px;line-height:1.7;">${w.plans[1].desc}</p>
              <div id="prc-in-perks" style="font-size:13px;font-weight:600;color:var(--fg);">${w.plans[1].perks.map(k=>'✓ '+k).join('   ·   ')}</div>
            </div>
            <div class="fc-5" style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:12px;">
              <div id="prc-in-price" style="font-family:var(--font-display);font-size:40px;font-weight:700;color:var(--accent);">${w.plans[1].monthly}</div>
              ${ctx.btn(w.ctaPrimary)}
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRC-10', name: '올인클루시브 단일 시그니처 패스포트 카드',
      desc: '복잡한 선택지 고민을 없애고 단 하나의 완벽한 대표 패키지에 집중시키는 고전환 레이아웃',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="max-width:780px;text-align:center;">
          <span class="${ctx.bdgCls}">ALL-INCLUSIVE EDITION</span>
          <h2 class="f-h2" style="margin:12px 0 28px;">단 하나의 완벽한 시그니처 프로그램</h2>
          <div class="f-card" style="padding:42px;border:2px solid var(--accent);">
            <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${w.plans[1].tier}</div>
            <h3 class="f-h2" style="font-size:30px;margin-top:8px;">${w.plans[1].name}</h3>
            <div style="font-family:var(--font-display);font-size:46px;font-weight:700;margin:16px 0;color:var(--fg);">${w.plans[1].monthly} <span style="font-size:14px;color:var(--sub);">${w.plans[1].unit}</span></div>
            <p style="font-size:14px;color:var(--sub);max-width:520px;margin:0 auto 24px;line-height:1.7;">${w.plans[1].desc}</p>
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;margin-bottom:28px;font-size:13px;font-weight:600;">
              ${w.plans[1].perks.map(pk => `<span>✦ ${pk}</span>`).join('')}
            </div>
            <div onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})">${ctx.btn(w.ctaPrimary)}</div>
          </div>
        </div>
      </section>`
    }
  ],

  /* ========================================================================
     24. CLIENT REVIEWS & INTERACTIVE ACCORDION FAQ (10 Variants)
     ======================================================================== */
  proof: [
    {
      id: 'PRV-01', name: '에디토리얼 풀쿼트(Pull-Quote) + 인터랙티브 아코디언 FAQ 스플릿',
      desc: '좌측에는 대형 명조 고객 찬사를, 우측에는 클릭 시 부드럽게 열리는 자주 묻는 질문을 결합',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12" style="align-items:start;">
          <div class="fc-5 f-reveal">
            <span class="${ctx.bdgCls}">CLIENT VOICE & FAQ</span>
            <blockquote style="margin:20px 0 18px;font-family:var(--font-display);font-size:clamp(1.45rem,2.4vw,2rem);line-height:1.38;font-style:italic;">
              "${w.reviews[0].quote}"
            </blockquote>
            <div style="font-size:13px;font-weight:700;">${w.reviews[0].author}</div>
            <div style="font-size:12px;color:var(--sub);">${w.reviews[0].role}</div>
          </div>
          <div class="fc-7" style="display:flex;flex-direction:column;gap:12px;">
            ${w.faqs.map((fq, idx) => `
              <details class="f-card" ${idx===0?'open':''} style="padding:20px 24px;cursor:pointer;">
                <summary style="font-size:15px;font-weight:700;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:12px;">
                  <span>Q. ${fq.q}</span>
                  <span class="f-mono" style="color:var(--accent);font-size:16px;">+</span>
                </summary>
                <p style="margin:14px 0 0;padding-top:14px;border-top:1px solid var(--border);font-size:14px;line-height:1.75;color:var(--sub);">${fq.a}</p>
              </details>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRV-02', name: '3열 검증된 클라이언트 리뷰 보드',
      desc: '실제 고객 3인의 깊이 있는 경험담과 직함을 균형 잡힌 3단 카드로 배치',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:36px;"><span class="${ctx.bdgCls}">VERIFIED TESTIMONIALS</span><h2 class="f-h2" style="margin-top:12px;">경험한 분들이 증명하는 차이</h2></div>
          <div class="fg-3">
            ${w.reviews.map((rv, i) => `<div class="f-card f-reveal" style="--stagger:${i};display:flex;flex-direction:column;justify-content:space-between;gap:20px;">
              <div>
                <div style="color:var(--accent);font-size:13px;letter-spacing:2px;margin-bottom:14px;">★★★★★</div>
                <p style="margin:0;font-size:14px;line-height:1.75;">"${rv.quote}"</p>
              </div>
              <div style="padding-top:14px;border-top:1px solid var(--border);">
                <div style="font-size:13px;font-weight:700;">${rv.author}</div>
                <div style="font-size:12px;color:var(--sub);">${rv.role}</div>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRV-03', name: '인터랙티브 에디토리얼 리뷰 슬라이더 (← 01 / 03 →)',
      desc: '이전/다음 화살표로 대형 세리프 인터뷰 인용문을 넘겨보는 몰입형 테스티모니얼',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="max-width:920px;text-align:center;">
          <span class="${ctx.bdgCls}">GUEST MONOGRAPH</span>
          <blockquote id="rev-slider-quote" style="margin:26px 0;font-family:var(--font-display);font-size:clamp(1.6rem,3vw,2.5rem);line-height:1.32;">
            "${w.reviews[0].quote}"
          </blockquote>
          <div id="rev-slider-author" style="font-size:14px;font-weight:700;">${w.reviews[0].author} — <span style="color:var(--sub);font-weight:500;">${w.reviews[0].role}</span></div>
          <div style="display:inline-flex;align-items:center;gap:14px;margin-top:26px;">
            <button type="button" onclick="stepReviewSlider(-1)" style="width:38px;height:38px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--fg);cursor:pointer;">←</button>
            <span id="rev-slider-idx" class="f-mono" style="font-size:12px;color:var(--accent);">01 / 03</span>
            <button type="button" onclick="stepReviewSlider(1)" style="width:38px;height:38px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--fg);cursor:pointer;">→</button>
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRV-04', name: '풀와이드 센터 아코디언 FAQ 아카이브',
      desc: '고객이 가장 궁금해하는 핵심 질문과 답변을 정중앙에 집중 배치',
      render: (w, ctx) => `<section class="f-sec">
        <div class="f-container" style="max-width:860px;">
          <div style="text-align:center;margin-bottom:34px;"><span class="${ctx.bdgCls}">FREQUENTLY ASKED QUESTIONS</span><h2 class="f-h2" style="margin-top:10px;">자주 묻는 질문과 답변</h2></div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${w.faqs.map((fq, i) => `<details class="f-card" ${i===0?'open':''} style="padding:22px 26px;cursor:pointer;">
              <summary style="font-size:15px;font-weight:700;display:flex;justify-content:space-between;align-items:center;list-style:none;"><span>${fq.q}</span><span style="color:var(--accent);">+</span></summary>
              <p style="margin:14px 0 0;padding-top:14px;border-top:1px solid var(--border);font-size:14px;color:var(--sub);line-height:1.75;">${fq.a}</p>
            </details>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRV-05', name: '글로벌 프레스 비평 & 수상 아카이브 쇼케이스',
      desc: '권위 있는 해외 매거진 코멘트를 3열 카드로 제시하는 프레스 섹션',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:28px;"><span class="${ctx.bdgCls}">PRESS & ACCLAIM</span><h2 class="f-h2" style="margin-top:10px;">미디어와 평단이 주목한 가치</h2></div>
          <div class="fg-3">
            ${w.reviews.map((rv, i) => `<div class="f-card"><div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">${['WALLPAPER*','MONOCLE','ARCHITECTURAL DIGEST'][i]}</div><p style="font-size:14px;line-height:1.7;margin:12px 0;">"${rv.quote}"</p><div style="font-size:12px;color:var(--sub);">— ${rv.author}</div></div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRV-06', name: '대형 에디토리얼 리뷰 + 2열 서브 후기 하이브리드',
      desc: '상단 대표 인터뷰 인용문과 하단 검증 리뷰 카드를 함께 구성',
      render: (w, ctx) => `<section class="f-sec">
        <div class="f-container" style="display:flex;flex-direction:column;gap:24px;">
          <div class="f-card" style="padding:36px;">
            <span class="${ctx.bdgCls}">FEATURED CLIENT STORY</span>
            <blockquote style="margin:16px 0;font-family:var(--font-display);font-size:clamp(1.5rem,2.8vw,2.3rem);line-height:1.35;">"${w.reviews[0].quote}"</blockquote>
            <div style="font-size:13px;font-weight:700;">— ${w.reviews[0].author}, <span style="color:var(--sub);font-weight:500;">${w.reviews[0].role}</span></div>
          </div>
          <div class="fg-2">
            ${w.reviews.slice(1).map(rv => `<div class="f-card"><p style="margin:0 0 14px;font-size:14px;line-height:1.7;">"${rv.quote}"</p><div style="font-size:12px;font-weight:700;">${rv.author} · <span style="color:var(--sub);font-weight:500;">${rv.role}</span></div></div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRV-07', name: '오픈형 3열 Q&A 지식 원장 보드',
      desc: '클릭 없이도 핵심 질문 3가지와 명쾌한 답변을 한눈에 읽을 수 있는 개방형 그리드',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div style="margin-bottom:32px;"><span class="${ctx.bdgCls}">CONCIERGE Q&A</span><h2 class="f-h2" style="margin-top:10px;">예약 및 의뢰 전 필수 안내</h2></div>
          <div class="fg-3">
            ${w.faqs.map((fq, i) => `<div class="f-card">
              <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">QUESTION 0${i+1}</div>
              <h3 class="f-h3" style="font-size:17px;margin-top:8px;">${fq.q}</h3>
              <p style="margin:12px 0 0;font-size:13px;color:var(--sub);line-height:1.7;">${fq.a}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRV-08', name: '다크 시네마 풀쿼트 모놀리스 배너',
      desc: '반전 다크 무대 중앙에 단 하나의 강렬한 찬사를 띄워 브랜드 권위를 각인',
      render: (w) => `
      <section style="padding:72px var(--sec-px);background:var(--fg);color:var(--bg);text-align:center;border-bottom:1px solid var(--border);">
        <div class="f-container" style="max-width:880px;padding:0;">
          <div style="color:var(--accent);font-size:14px;letter-spacing:4px;margin-bottom:16px;">★ ★ ★ ★ ★</div>
          <blockquote style="margin:0 0 22px;font-family:var(--font-display);font-size:clamp(1.6rem,3.1vw,2.6rem);line-height:1.34;font-style:italic;">
            "${w.reviews[0].quote}"
          </blockquote>
          <div style="font-size:13px;font-weight:700;">${w.reviews[0].author} — <span style="opacity:0.7;">${w.reviews[0].role}</span></div>
        </div>
      </section>`
    },
    {
      id: 'PRV-09', name: '화보 결합 게스트 인터뷰 에세이 스플릿',
      desc: '실제 공간 화보와 고객 인터뷰, 세부 아코디언 FAQ를 한 섹션에 조화롭게 통합',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12">
          <div class="fc-5"><div class="f-media" style="aspect-ratio:4/4.2;"><img src="${IMG[w.secImg2]}" alt="Guest Story"/></div></div>
          <div class="fc-7" style="display:flex;flex-direction:column;gap:18px;">
            <span class="${ctx.bdgCls}">CLIENT INTERVIEW</span>
            <blockquote style="margin:0;font-family:var(--font-display);font-size:26px;line-height:1.38;">"${w.reviews[1].quote}"</blockquote>
            <div style="font-size:13px;color:var(--sub);">— ${w.reviews[1].author}, ${w.reviews[1].role}</div>
            <div style="padding-top:12px;border-top:1px solid var(--border);display:flex;flex-direction:column;gap:10px;">
              ${w.faqs.slice(0,2).map(fq => `<div><strong style="font-size:13px;">Q. ${fq.q}</strong><p style="margin:4px 0 0;font-size:13px;color:var(--sub);">${fq.a}</p></div>`).join('')}
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'PRV-10', name: '스위스 보더 리뷰 & Q&A 통합 아카이브',
      desc: '상단 3열 고객 코멘트와 하단 주요 FAQ가 하나의 건축적 격자로 맞물리는 레이아웃',
      render: (w) => `
      <section style="border-bottom:1.5px solid var(--fg);">
        <div class="fg-3" style="gap:0;border-bottom:1.5px solid var(--fg);">
          ${w.reviews.map((rv, i) => `<div style="padding:30px 26px;border-right:${i<2?'1.5px solid var(--fg)':'none'};">
            <div class="f-mono" style="font-size:12px;color:var(--accent);">VOICE 0${i+1}</div>
            <p style="font-size:14px;line-height:1.7;margin:12px 0;">"${rv.quote}"</p>
            <div style="font-size:12px;font-weight:700;">${rv.author} · ${rv.role}</div>
          </div>`).join('')}
        </div>
      </section>`
    }
  ],

  /* ========================================================================
     25. INTERACTIVE CONCIERGE RESERVATION & BRIEF FORMS (10 Variants)
         All <input> elements bind .f-input so Slot 08 (inputui) styles them live!
     ======================================================================== */
  form: [
    {
      id: 'FRM-01', name: '인터랙티브 컨시어지 예약 & 실시간 견적 계산기',
      desc: '프로그램 선택 칩을 클릭하면 예상 금액이 즉시 계산되고 장착된 인풋·버튼 스타일이 연동되는 대표 예약 모듈',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div class="f-card fg-12" style="padding:40px;">
            <div class="fc-5" style="display:flex;flex-direction:column;gap:16px;">
              <span class="${ctx.bdgCls}">PRIVATE CONCIERGE</span>
              <h2 class="f-h2">${w.brand}<br/>프라이빗 예약 & 문의</h2>
              <p style="margin:0;font-size:14px;color:var(--sub);line-height:1.75;">원하시는 프로그램과 일정을 선택해 주시면 전담 컨시어지가 30분 이내에 확정 안내를 도와드립니다.</p>
              <div style="padding-top:14px;margin-top:8px;border-top:1px solid var(--border);font-size:13px;color:var(--sub);">
                <div>직통 문의: <strong style="color:var(--fg);">02-555-8200</strong></div>
                <div style="margin-top:4px;">이메일: <strong style="color:var(--fg);">concierge@forma-atelier.kr</strong></div>
              </div>
            </div>
            <form class="fc-7" onsubmit="event.preventDefault();showStudioToast('프라이빗 예약 요청이 접수되었습니다. 전담 컨시어지가 곧 연락드립니다.');" style="display:flex;flex-direction:column;gap:16px;">
              <div>
                <label class="f-mono" style="font-size:12px;color:var(--sub);display:block;margin-bottom:8px;">01. SELECT PROGRAM</label>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                  ${w.plans.map((p, idx) => `<button type="button" onclick="selectFormPlan(${idx}, '${p.monthly}')" class="frm-plan-chip" data-idx="${idx}" style="padding:10px 12px;border-radius:calc(var(--radius)*0.75);border:1px solid ${idx===1?'var(--accent)':'var(--border)'};background:${idx===1?'var(--accent-soft)':'var(--bg)'};color:var(--fg);text-align:left;cursor:pointer;">
                    <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div>
                    <div class="f-mono" style="font-size:12px;color:var(--accent);margin-top:3px;">${p.monthly}</div>
                  </button>`).join('')}
                </div>
              </div>
              <div class="fg-2" style="gap:12px;">
                <div>
                  <label class="f-mono" style="font-size:12px;color:var(--sub);display:block;margin-bottom:6px;">02. 성함 / 기업명</label>
                  <input type="text" class="f-input" placeholder="홍길동 / 대표이사" required />
                </div>
                <div>
                  <label class="f-mono" style="font-size:12px;color:var(--sub);display:block;margin-bottom:6px;">03. 연락처</label>
                  <input type="tel" class="f-input" placeholder="010-0000-0000" required />
                </div>
              </div>
              <div style="padding:14px 18px;border-radius:calc(var(--radius)*0.75);background:var(--muted);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">
                <div>
                  <span style="font-size:12px;color:var(--sub);">선택된 프로그램 예상 금액</span>
                  <div id="frm-est-price" style="font-family:var(--font-display);font-size:24px;font-weight:700;color:var(--accent);">${w.plans[1].monthly}</div>
                </div>
                <div onclick="showStudioToast('프라이빗 예약 확정 요청이 접수되었습니다.')">${ctx.btn(w.ctaPrimary)}</div>
              </div>
            </form>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FRM-02', name: '에디토리얼 컨설테이션 상담 폼 (인풋 에셋 실시간 연동)',
      desc: '장착된 08번 인풋 컨트롤 스타일과 05번 버튼이 그대로 반영되는 비공개 자문 요청 폼',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12">
          <div class="fc-5">
            <span class="${ctx.bdgCls}">DIRECT INQUIRY</span>
            <h2 class="f-h2" style="margin-top:12px;">프라이빗 자문 및 방문 예약</h2>
            <p style="font-size:14px;color:var(--sub);margin-top:14px;line-height:1.75;">남겨주신 모든 내용은 철저히 비공개로 보호되며 전담 파트너가 직접 회신드립니다.</p>
          </div>
          <form class="fc-7 f-card" onsubmit="event.preventDefault();showStudioToast('비공개 상담 요청이 안전하게 접수되었습니다.');" style="display:flex;flex-direction:column;gap:20px;padding:36px;">
            <div class="fg-2">
              <input type="text" class="f-input" placeholder="성함 / 직함 *" required />
              <input type="text" class="f-input" placeholder="연락처 또는 이메일 *" required />
            </div>
            <input type="text" class="f-input" placeholder="희망 일정 및 요청 사항을 간략히 적어주세요" />
            <div style="display:flex;justify-content:flex-end;padding-top:8px;" onclick="showStudioToast('상담 신청이 접수되었습니다.')">${ctx.btn(w.ctaPrimary)}</div>
          </form>
        </div>
      </section>`
    },
    {
      id: 'FRM-03', name: '하이임팩트 풀와이드 다크 배너 & 즉시 콜백 바',
      desc: '망설이는 방문자를 단 한 줄의 연락처 입력으로 전환시키는 고효율 배너',
      render: (w) => `<section style="padding:68px var(--sec-px);background:var(--fg);color:var(--bg);border-bottom:1px solid var(--border);">
        <div class="f-container fg-12" style="padding:0;">
          <div class="fc-7"><span class="f-mono" style="font-size:12px;color:var(--accent);">PRIORITY DESK</span><h2 class="f-h2" style="margin-top:10px;color:var(--bg);">${w.brand} 전담 컨시어지 콜백 요청</h2><p style="margin:10px 0 0;font-size:14px;opacity:0.78;">연락처를 남겨주시면 15분 이내에 담당 디렉터가 직접 안내 전화를 드립니다.</p></div>
          <form class="fc-5" onsubmit="event.preventDefault();showStudioToast('우선 콜백 요청이 등록되었습니다.');" style="display:flex;gap:8px;flex-wrap:wrap;">
            <input type="tel" placeholder="연락처 입력 (010-0000-0000)" required style="flex:1;min-width:190px;padding:14px 16px;border-radius:999px;border:1px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.1);color:var(--bg);font-size:13px;" />
            <button type="submit" style="padding:14px 24px;border-radius:999px;background:var(--accent);color:var(--accent-fg);border:none;font-size:13px;font-weight:700;cursor:pointer;">콜백 신청 →</button>
          </form>
        </div>
      </section>`
    },
    {
      id: 'FRM-04', name: '프로젝트 예산 슬라이더 & 범위 멀티셀렉트 브리프',
      desc: '클릭 가능한 관심 분야 칩과 예산 레인지 슬라이더가 포함된 에이전시·B2B 특화 의뢰 폼',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="max-width:920px;">
          <div class="f-card" style="padding:40px;">
            <span class="${ctx.bdgCls}">START A PROJECT</span>
            <h2 class="f-h2" style="margin-top:10px;margin-bottom:24px;">맞춤형 프로젝트 브리프</h2>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">
              ${w.nav.map((n, i) => `<button type="button" onclick="this.dataset.on=this.dataset.on==='1'?'0':'1';this.style.background=this.dataset.on==='1'?'var(--fg)':'var(--surface)';this.style.color=this.dataset.on==='1'?'var(--bg)':'var(--fg)';" data-on="${i===0?'1':'0'}" style="padding:9px 16px;border-radius:999px;border:1px solid var(--border);background:${i===0?'var(--fg)':'var(--surface)'};color:${i===0?'var(--bg)':'var(--fg)'};font-size:12px;font-weight:600;cursor:pointer;">${n}</button>`).join('')}
            </div>
            <div style="margin-bottom:24px;">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px;"><span>예상 가용 예산 규모</span><strong id="bdg-range-lbl" class="f-mono" style="color:var(--accent);">₩3,000만 — ₩5,000만</strong></div>
              <input type="range" min="1" max="4" value="3" oninput="document.getElementById('bdg-range-lbl').textContent=['₩1,000만 이하','₩1,500만 — ₩3,000만','₩3,000만 — ₩5,000만','₩5,000만 이상 엔터프라이즈'][this.value-1]" style="width:100%;accent-color:var(--accent);cursor:pointer;" />
            </div>
            <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
              <div style="flex:1;min-width:220px;"><input type="email" class="f-input" placeholder="회신받으실 비즈니스 이메일 입력" /></div>
              <div onclick="showStudioToast('브리프가 전송되었습니다. 24시간 내 제안서를 회신드립니다.')">${ctx.btn(w.ctaPrimary)}</div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FRM-05', name: '프라이빗 인비테이션 카드 & 오시는 길 아틀리에 안내',
      desc: '플래그십 주소·운영시간·발렛 안내와 VIP 초청장 신청 카드를 나란히 배치',
      render: (w, ctx) => `<section class="f-sec">
        <div class="f-container fg-2">
          <div class="f-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
            <div><span class="${ctx.bdgCls}">VISIT FLAGSHIP</span><h3 class="f-h2" style="margin-top:10px;font-size:26px;">${w.brand} 플래그십 라운지</h3><p style="font-size:14px;color:var(--sub);margin-top:10px;">서울특별시 종로구 자하문로 프라이빗 코트야드 1–3F<br/>운영시간: 화–일 10:30 – 21:00 (전담 발렛 상주)</p></div>
            <div class="f-mono" style="font-size:12px;color:var(--accent);">37.5796° N, 126.9707° E · PRIVATE GATE</div>
          </div>
          <div class="f-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
            <div><span class="${ctx.bdgCls}">PRIVATE INVITATION</span><h3 class="f-h2" style="margin-top:10px;font-size:26px;">프라이빗 프리뷰 초청장 신청</h3><p style="font-size:14px;color:var(--sub);margin-top:10px;">신규 시즌 컬렉션 오픈 및 소규모 도슨트 행사에 우선 초청해 드립니다.</p></div>
            <div onclick="showStudioToast('프라이빗 인비테이션 리스트에 등록되었습니다.')">${ctx.btn(w.ctaPrimary)}</div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FRM-06', name: '타임슬롯 원클릭 캘린더 피커 (다이닝·살롱·스테이)',
      desc: '시간대 칩(11:30 / 14:00 / 18:00 / 20:00)을 직관적으로 선택해 예약하는 호스피탈리티 모듈',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container">
          <div class="f-card fg-12" style="padding:36px;">
            <div class="fc-6">
              <span class="${ctx.bdgCls}">INSTANT RESERVATION</span>
              <h2 class="f-h2" style="margin-top:10px;">실시간 타임슬롯 예약</h2>
              <p style="font-size:14px;color:var(--sub);margin-top:10px;">원하시는 시간대를 선택하시면 대기 없이 즉시 예약을 접수합니다.</p>
            </div>
            <div class="fc-6" style="display:flex;flex-direction:column;gap:16px;">
              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
                ${['11:30','14:00','18:00','20:00'].map((tm, i) => `<button type="button" onclick="this.parentElement.querySelectorAll('button').forEach(b=>{b.style.background='var(--bg)';b.style.color='var(--fg)';});this.style.background='var(--accent)';this.style.color='var(--accent-fg)';" style="padding:12px 8px;border-radius:calc(var(--radius)*0.7);border:1px solid var(--border);background:${i===2?'var(--accent)':'var(--bg)'};color:${i===2?'var(--accent-fg)':'var(--fg)'};font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;cursor:pointer;">${tm}</button>`).join('')}
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;padding-top:6px;">
                <span style="font-size:13px;color:var(--sub);">성인 2인 · 프라이빗 좌석 배정</span>
                <div onclick="showStudioToast('선택하신 시간대로 예약 가접수가 완료되었습니다.')">${ctx.btn(w.ctaPrimary)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FRM-07', name: '인원 스테퍼(- / +) & 컨시어지 스위치 결합 부킹 박스',
      desc: '인원 증감 카운터와 리퀴드 토글 스위치가 실제로 작동하는 하이엔드 스테이·다이닝 예약 카드',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container" style="max-width:920px;">
          <div class="f-card" style="padding:36px;display:flex;flex-direction:column;gap:22px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
              <div><span class="${ctx.bdgCls}">BESPOKE BOOKING</span><h2 class="f-h2" style="margin-top:8px;">맞춤 의전 옵션 & 일정 예약</h2></div>
              <div style="display:inline-flex;align-items:center;gap:12px;padding:6px 12px;border-radius:999px;background:var(--muted);">
                <span style="font-size:12px;font-weight:600;">방문 인원</span>
                <button type="button" onclick="const s=this.nextElementSibling;s.textContent=Math.max(1,parseInt(s.textContent)-1)+'인'" style="width:26px;height:26px;border-radius:99px;border:1px solid var(--border);background:var(--surface);color:var(--fg);cursor:pointer;">−</button>
                <span class="f-mono" style="font-size:13px;font-weight:700;min-width:28px;text-align:center;">2인</span>
                <button type="button" onclick="const s=this.previousElementSibling;s.textContent=Math.min(10,parseInt(s.textContent)+1)+'인'" style="width:26px;height:26px;border-radius:99px;border:none;background:var(--accent);color:var(--accent-fg);cursor:pointer;">+</button>
              </div>
            </div>
            <div class="fg-2">
              <input type="text" class="f-input" placeholder="예약자 성함 *" />
              <input type="date" class="f-input" value="2026-11-28" />
            </div>
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;padding-top:10px;border-top:1px solid var(--border);">
              <div style="display:flex;align-items:center;gap:12px;">
                <div class="f-switch is-on" onclick="this.classList.toggle('is-on')"><div class="f-switch-knob"></div></div>
                <span style="font-size:13px;font-weight:600;">프라이빗 발렛 & 웰컴 티 의전 포함</span>
              </div>
              <div onclick="showStudioToast('맞춤 옵션과 함께 예약이 접수되었습니다.')">${ctx.btn(w.ctaPrimary)}</div>
            </div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FRM-08', name: '스플릿 핵심 안내 + 원스텝 빠른 문의 폼',
      desc: '좌측 사전 체크포인트와 우측 간편 3필드 폼을 결합해 문의 장벽을 최소화',
      render: (w, ctx) => `
      <section class="f-sec">
        <div class="f-container fg-12">
          <div class="fc-5" style="display:flex;flex-direction:column;gap:14px;">
            <span class="${ctx.bdgCls}">QUICK DISPATCH</span>
            <h2 class="f-h2">30초 간편 문의</h2>
            ${w.plans[1].perks.map(pk => `<div style="font-size:13px;color:var(--sub);">✦ ${pk}</div>`).join('')}
          </div>
          <div class="fc-7 f-card" style="display:flex;flex-direction:column;gap:14px;">
            <input type="text" class="f-input" placeholder="성함 또는 회사명" />
            <input type="tel" class="f-input" placeholder="회신 연락처 (010-0000-0000)" />
            <div onclick="showStudioToast('빠른 문의가 접수되었습니다.')">${ctx.btn(w.ctaPrimary)}</div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FRM-09', name: '풀블리드 화보 & 프로스티드 글래스 예약 라운지',
      desc: '대형 공간 화보 위에 반투명 글래스 예약 카드를 띄워 마지막 순간까지 감성을 유지',
      render: (w, ctx) => `
      <section style="position:relative;padding:72px var(--sec-px);overflow:hidden;border-bottom:1px solid var(--border);">
        <img src="${IMG[w.heroImg]}" alt="${w.brand}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;" />
        <div style="position:absolute;inset:0;background:rgba(10,12,16,0.66);z-index:1;"></div>
        <div class="f-container" style="position:relative;z-index:2;max-width:680px;">
          <div class="f-card" style="padding:36px;background:color-mix(in srgb, var(--surface) 88%, transparent);backdrop-filter:blur(22px);">
            <span class="${ctx.bdgCls}">PRIVATE RESERVATION</span>
            <h2 class="f-h2" style="margin:10px 0 20px;">${w.brand} 프라이빗 예약</h2>
            <div class="fg-2" style="margin-bottom:16px;">
              <input type="text" class="f-input" placeholder="성함" />
              <input type="tel" class="f-input" placeholder="연락처" />
            </div>
            <div onclick="showStudioToast('예약 신청이 전송되었습니다.')">${ctx.btn(w.ctaPrimary)}</div>
          </div>
        </div>
      </section>`
    },
    {
      id: 'FRM-10', name: '스위스 아키텍처 보더 브리프 테이블',
      desc: '굵은 실선 격자 구조로 항목을 명쾌하게 나눈 크리에이티브 에이전시·건축 의뢰서',
      render: (w, ctx) => `
      <section style="border-bottom:1.5px solid var(--fg);">
        <div class="fg-12" style="gap:0;align-items:stretch;">
          <div class="fc-5" style="padding:44px var(--sec-px);border-right:1.5px solid var(--fg);">
            <div class="f-mono" style="font-size:12px;color:var(--accent);font-weight:700;">INQUIRY DESK // 2026</div>
            <h2 class="f-h2" style="margin-top:12px;">새로운 프로젝트를 함께 시작하세요</h2>
          </div>
          <div class="fc-7" style="padding:44px var(--sec-px);display:flex;flex-direction:column;gap:14px;">
            <div class="fg-2"><input type="text" class="f-input" placeholder="NAME / COMPANY" /><input type="email" class="f-input" placeholder="EMAIL ADDRESS" /></div>
            <input type="text" class="f-input" placeholder="PROJECT TIMELINE & GOALS" />
            <div onclick="showStudioToast('프로젝트 디스패치가 완료되었습니다.')">${ctx.btn(w.ctaPrimary)}</div>
          </div>
        </div>
      </section>`
    }
  ],

  /* ========================================================================
     26. MONUMENTAL FOOTERS (8 Variants)
     ======================================================================== */
  footer: [
    {
      id: 'FTR-01', name: '모뉴멘탈 자이언트 워드마크 푸터 (Awwwards 대표 트렌드)',
      desc: '상단 4열 사이트맵·뉴스레터 아래 화면 전체 폭을 압도하는 초대형 브랜드 워드마크로 대미를 장식',
      render: (w, ctx) => {
        const navItems = getSiteNavLinks(w, ctx);
        return `
      <footer style="padding:64px var(--sec-px) 28px;background:var(--surface);">
        <div class="f-container" style="padding:0;">
          <div class="fg-12" style="padding-bottom:48px;border-bottom:1px solid var(--border);align-items:start;">
            <div class="fc-5">
              <div style="font-size:13px;font-weight:600;margin-bottom:10px;">프라이빗 저널 & 시즌 프리뷰 구독</div>
              <div style="display:flex;gap:8px;max-width:380px;">
                <input type="email" class="f-input" placeholder="이메일 주소를 입력하세요" />
                <button type="button" onclick="showStudioToast('프라이빗 뉴스레터 구독이 완료되었습니다.')" style="padding:10px 18px;border-radius:var(--radius);background:var(--fg);color:var(--bg);border:none;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;">구독</button>
              </div>
            </div>
            <div class="fc-7 fg-3" style="font-size:13px;">
              <div><div class="f-mono" style="font-size:12px;color:var(--sub);margin-bottom:10px;">NAVIGATION</div>${navItems.map(it=>`<div style="margin-bottom:6px;">${renderPageNavLink(it, 'color:var(--sub);')}</div>`).join('')}</div>
              <div><div class="f-mono" style="font-size:12px;color:var(--sub);margin-bottom:10px;">FLAGSHIP</div><div style="margin-bottom:6px;">서울 종로구 자하문로</div><div style="margin-bottom:6px;">도쿄 미나미아오야마</div><div>파리 마레 아카이브</div></div>
              <div><div class="f-mono" style="font-size:12px;color:var(--sub);margin-bottom:10px;">SOCIAL</div><div style="margin-bottom:6px;">Instagram ↗</div><div style="margin-bottom:6px;">Are.na ↗</div><div>Behance ↗</div></div>
            </div>
          </div>
          <div style="font-family:var(--font-display);font-size:clamp(3.2rem, 10vw, 8.4rem);font-weight:var(--display-weight);letter-spacing:-0.03em;line-height:0.94;text-align:center;padding:34px 0 22px;color:var(--fg);user-select:none;">
            ${w.brand}
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--sub);padding-top:12px;border-top:1px solid var(--border);">
            <span>© 2026 ${w.brand}. All Rights Reserved.</span>
            <span style="cursor:pointer;" onclick="if(window.FORMA_PRO?.ClientMode?.isClientMode?.()){window.scrollTo({top:0,behavior:'smooth'});}else{document.getElementById('canvas-frame')?.scrollTo({top:0,behavior:'smooth'});}">BACK TO TOP ↑</span>
          </div>
        </div>
      </footer>`;
      }
    },
    {
      id: 'FTR-02', name: '에디토리얼 4단 살롱 콜로폰(Colophon) 푸터',
      desc: '차분한 여백과 정갈한 4열 정보 구조로 마감하는 부티크·호텔 정통 푸터',
      render: (w, ctx) => {
        const navItems = getSiteNavLinks(w, ctx);
        return `<footer style="padding:56px var(--sec-px) 36px;background:var(--muted);">
        <div class="f-container fg-4" style="padding:0 0 36px;border-bottom:1px solid var(--border);font-size:13px;align-items:start;">
          <div><div style="font-family:var(--font-display);font-size:22px;font-weight:700;">${w.brand}</div><p style="font-size:12px;color:var(--sub);margin-top:10px;line-height:1.7;">${w.eyebrow}</p></div>
          <div><strong style="display:block;margin-bottom:10px;">메뉴 안내</strong>${navItems.map(it=>`<div style="margin-bottom:6px;">${renderPageNavLink(it, 'color:var(--sub);')}</div>`).join('')}</div>
          <div><strong style="display:block;margin-bottom:10px;">컨시어지</strong><div style="color:var(--sub);margin-bottom:6px;">02-555-8200</div><div style="color:var(--sub);">09:00 – 21:00 연중무휴</div></div>
          <div><strong style="display:block;margin-bottom:10px;">법적 고지</strong><div style="color:var(--sub);margin-bottom:6px;">개인정보처리방침</div><div style="color:var(--sub);">이용약관</div></div>
        </div>
        <div class="f-container" style="padding:18px 0 0;display:flex;justify-content:space-between;font-size:12px;color:var(--sub);"><span>© 2026 ${w.brand}</span><span>SEOUL · REPUBLIC OF KOREA</span></div>
      </footer>`;
      }
    },
    {
      id: 'FTR-03', name: '다크 인버트 글로벌 오피스 이그제큐티브 푸터',
      desc: '묵직한 다크 솔리드 배경과 글로벌 오피스 주소를 배치한 기업·테크·로펌 푸터',
      render: (w, ctx) => {
        const navItems = getSiteNavLinks(w, ctx);
        return `<footer style="padding:56px var(--sec-px) 36px;background:var(--fg);color:var(--bg);">
        <div class="f-container fg-12" style="padding:0 0 36px;border-bottom:1px solid rgba(128,128,128,0.28);align-items:start;">
          <div class="fc-6"><div style="font-family:var(--font-display);font-size:26px;font-weight:700;">${w.brand}</div><p style="font-size:13px;opacity:0.72;max-width:380px;margin-top:10px;">${w.h1Sub}</p><div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:16px;font-size:12px;">${navItems.map(it=>renderPageNavLink(it, 'color:var(--bg);opacity:0.85;')).join('')}</div></div>
          <div class="fc-6 fg-2" style="font-size:13px;">
            <div><div class="f-mono" style="font-size:12px;color:var(--accent);margin-bottom:8px;">SEOUL HQ</div><div style="opacity:0.8;">서울특별시 강남구 테헤란로 프라이빗 타워 42F<br/>T. 02-555-8200</div></div>
            <div><div class="f-mono" style="font-size:12px;color:var(--accent);margin-bottom:8px;">GLOBAL DESK</div><div style="opacity:0.8;">New York · London · Singapore · Tokyo<br/>advisory@forma-studio.com</div></div>
          </div>
        </div>
        <div class="f-container" style="padding:18px 0 0;display:flex;justify-content:space-between;font-size:12px;opacity:0.65;"><span>© 2026 ${w.brand}. All Rights Reserved.</span><span>ISO 27001 · PRIVACY POLICY</span></div>
      </footer>`;
      }
    },
    {
      id: 'FTR-04', name: '브루탈 자이언트 START A PROJECT ↗ 콜투액션 푸터',
      desc: '푸터 자체를 초대형 의뢰 유도 타이포그래피 링크로 전환한 크리에이티브 스튜디오 시그니처',
      render: (w, ctx) => {
        const navItems = getSiteNavLinks(w, ctx);
        return `<footer style="padding:64px var(--sec-px) 32px;border-top:1.5px solid var(--fg);background:var(--surface);">
        <div class="f-container" style="padding:0;">
          <div class="f-mono" style="font-size:12px;color:var(--accent);margin-bottom:12px;">READY TO ELEVATE YOUR BRAND?</div>
          <div onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})" style="font-family:var(--font-display);font-size:clamp(2.4rem,6.5vw,5.4rem);font-weight:800;line-height:1;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding-bottom:40px;border-bottom:1.5px solid var(--fg);">
            <span>START A PROJECT</span><span style="color:var(--accent);">↗</span>
          </div>
          <div style="padding-top:20px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:12px;">
            <span>${w.brand} — ${w.edition}</span>
            <div style="display:flex;gap:16px;flex-wrap:wrap;">${navItems.map(it=>renderPageNavLink(it, 'color:var(--sub);')).join('')}</div>
            <span>SEOUL / BERLIN / TOKYO</span>
          </div>
        </div>
      </footer>`;
      }
    },
    {
      id: 'FTR-05', name: '미니멀 싱글 호라이즌 갤러리 푸터',
      desc: '군더더기 없이 단 한 줄의 수평선과 로고·저작권만 남긴 하이엔드 미니멀리즘',
      render: (w, ctx) => {
        const navItems = getSiteNavLinks(w, ctx);
        return `<footer style="padding:36px var(--sec-px);background:var(--bg);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;font-size:12px;color:var(--sub);">
        <span style="font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--fg);">${w.brand}</span>
        <div style="display:flex;gap:18px;flex-wrap:wrap;">${navItems.map(it=>renderPageNavLink(it, 'color:var(--sub);')).join('')}</div>
        <span>© 2026 ${w.brand}</span>
      </footer>`;
      }
    },
    {
      id: 'FTR-06', name: '아틀리에 저널 구독 박스 & 사이트맵 푸터',
      desc: '우아한 세리프 뉴스레터 박스와 하단 메뉴 바가 결합된 부티크 푸터',
      render: (w, ctx) => {
        const navItems = getSiteNavLinks(w, ctx);
        return `<footer style="padding:56px var(--sec-px) 32px;background:var(--surface);">
        <div class="f-container" style="padding:0;">
          <div class="f-card fg-12" style="margin-bottom:36px;padding:32px;">
            <div class="fc-7"><h3 class="f-h2" style="font-size:24px;">계절의 소식과 프라이빗 초청장을 받아보세요</h3><p style="margin:6px 0 0;font-size:13px;color:var(--sub);">스팸 없이 분기별 아카이브 저널과 멤버십 혜택을 전해드립니다.</p></div>
            <div class="fc-5" style="display:flex;justify-content:flex-end;" onclick="showStudioToast('뉴스레터 구독 신청이 완료되었습니다.')">${ctx.btn('저널 구독하기')}</div>
          </div>
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;font-size:12px;color:var(--sub);"><span>© 2026 ${w.brand}. Crafted with FORMA STUDIO.</span><span style="display:flex;gap:14px;flex-wrap:wrap;">${navItems.map(it=>renderPageNavLink(it, 'color:var(--sub);')).join('')}</span></div>
        </div>
      </footer>`;
      }
    },
    {
      id: 'FTR-07', name: '글로벌 3대 거점 좌표·타임존 아키텍처 푸터',
      desc: '서울·파리·뉴욕 플래그십의 위도·경도와 현지 시간을 표기하는 글로벌 럭셔리 푸터',
      render: (w, ctx) => {
        const navItems = getSiteNavLinks(w, ctx);
        return `<footer style="padding:52px var(--sec-px) 30px;background:var(--surface);border-top:1px solid var(--border);">
        <div class="f-container" style="padding:0;">
          <div class="fg-3" style="padding-bottom:34px;border-bottom:1px solid var(--border);">
            <div><div class="f-mono" style="font-size:12px;color:var(--accent);">SEOUL FLAGSHIP</div><div style="font-size:15px;font-weight:700;margin-top:6px;">37.5796° N, 126.9707° E</div><div style="font-size:12px;color:var(--sub);margin-top:4px;">종로구 서촌 아카이브 · KST (UTC+9)</div></div>
            <div><div class="f-mono" style="font-size:12px;color:var(--accent);">PARIS SALON</div><div style="font-size:15px;font-weight:700;margin-top:6px;">48.8566° N, 2.3522° E</div><div style="font-size:12px;color:var(--sub);margin-top:4px;">Rue des Francs-Bourgeois · CET</div></div>
            <div><div class="f-mono" style="font-size:12px;color:var(--accent);">NEW YORK DESK</div><div style="font-size:15px;font-weight:700;margin-top:6px;">40.7128° N, 74.0060° W</div><div style="font-size:12px;color:var(--sub);margin-top:4px;">SoHo Mercer Street · EST</div></div>
          </div>
          <div style="padding-top:18px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;font-size:12px;color:var(--sub);"><span>${w.brand} — ${w.edition}</span><div style="display:flex;gap:16px;flex-wrap:wrap;">${navItems.map(it=>renderPageNavLink(it, 'color:var(--sub);')).join('')}</div><span>© 2026 ALL RIGHTS RESERVED</span></div>
        </div>
      </footer>`;
      }
    },
    {
      id: 'FTR-08', name: '스위스 보더 그리드 모듈러 콜로폰 푸터',
      desc: '노출된 실선 격자 셀 안에 브랜드·메뉴·문의처를 칼같이 구획한 모더니즘 푸터',
      render: (w, ctx) => {
        const navItems = getSiteNavLinks(w, ctx);
        return `<footer style="border-top:1.5px solid var(--fg);background:var(--bg);">
        <div class="fg-4" style="gap:0;">
          <div style="padding:32px 24px;border-right:1.5px solid var(--fg);"><div style="font-family:var(--font-display);font-size:22px;font-weight:800;">${w.brand}</div><div class="f-mono" style="font-size:12px;color:var(--sub);margin-top:8px;">${w.edition}</div></div>
          <div style="padding:32px 24px;border-right:1.5px solid var(--fg);font-size:13px;">${navItems.map(it=>`<div style="margin-bottom:6px;">→ ${renderPageNavLink(it, 'color:var(--fg);')}</div>`).join('')}</div>
          <div style="padding:32px 24px;border-right:1.5px solid var(--fg);font-size:13px;"><div class="f-mono" style="font-size:12px;color:var(--accent);margin-bottom:6px;">CONCIERGE</div><div>02 · 555 · 8200</div><div style="color:var(--sub);margin-top:4px;">SEOUL / BERLIN</div></div>
          <div style="padding:32px 24px;display:flex;align-items:center;justify-content:center;" onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})">${ctx.btn(w.ctaPrimary)}</div>
        </div>
      </footer>`;
      }
    }
  ]
});
