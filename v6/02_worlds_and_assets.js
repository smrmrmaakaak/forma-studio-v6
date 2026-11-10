/* ==========================================================================
   FORMA STUDIO v6 — 6 INDUSTRY WORLDS + 26 MODULAR SLOTS + 134 ATOMIC ASSETS
   ========================================================================== */

const IMG = __B64_IMAGES_JSON__;

const WORLDS = {
  maison: {
    id: 'maison',
    label: '1. 럭셔리 건축 스테이 (MAISON SÉOUL)',
    brand: 'MAISON SÉOUL',
    edition: 'N° 14 — AUTUMN ARCHIVE',
    eyebrow: 'Private Architectural Sanctuary',
    h1Pre: '시간의 결이 머무는 공간,',
    h1Accent: '고요한 사적 럭셔리',
    h1Sub: '서촌의 오래된 소나무 중정과 현무암 수공간, 하루 단 한 팀만을 위해 개방되는 프라이빗 건축 아틀리에에서 온전한 쉼을 경험하세요.',
    ctaPrimary: '프라이빗 스테이 예약',
    ctaSecondary: '공간 도슨트 투어',
    nav: ['건축 철학', '코트야드 스위트', '사계절 다도 살롱', '멤버십 안내'],
    heroImg: 'courtyard',
    secImg1: 'tea',
    secImg2: 'perfume',
    secImg3: 'atelier',
    marquee: ['PRIVATE COURTYARD SANCTUARY', 'BESPOKE HINOKI BATH', 'SEASONAL TEA CEREMONY', 'SEOUL · KYOTO · PARIS'],
    metrics: [
      { num: 99.4, suffix: '%', label: '프라이빗 투숙객 재방문 의향' },
      { num: 148, suffix: '㎡', label: '단독 현무암 중정 & 수공간' },
      { num: 4.98, suffix: '★', label: '검증된 글로벌 게스트 평점' },
      { num: 1, suffix: '팀/일', label: '완벽한 프라이버시 단독 운영' }
    ],
    features: [
      { code: '01', tag: 'SPATIAL SILENCE', title: '처마 끝 자연광과 수공간의 조율', desc: '계절과 시간에 따라 달라지는 햇살의 각도를 치밀하게 계산하여 실내 어디서든 살아있는 빛과 그림자를 감상할 수 있습니다.', img: 'courtyard' },
      { code: '02', tag: 'ARTISAN TEA SALON', title: '단일 다원 첫물 우전과 수제 다식', desc: '하동 야생 차밭에서 수확한 유기농 우전 녹차와 도예가가 빚어낸 백자·청자 다기로 프라이빗 다도 코스를 선사합니다.', img: 'tea' },
      { code: '03', tag: 'SCENT APOTHECARY', title: '시더우드 & 젖은 이끼 시그니처 조향', desc: '그라스 조향사와 협업한 비자림 우디 아로마와 편백나무 히노끼 배스가 깊은 이완과 숙면을 돕습니다.', img: 'perfume' },
      { code: '04', tag: 'PRIVATE BUTLER', title: '타인과 마주치지 않는 1:1 전담 의전', desc: '프라이빗 발렛 체크인부터 조식 다과 트레이 세팅까지 전담 버틀러가 세심하게 케어합니다.', img: 'atelier' }
    ],
    steps: [
      { step: '01', phase: 'PRE-ARRIVAL CURATION', title: '전담 버틀러 배정 & 향·다과 취향 설계', desc: '체크인 72시간 전 전담 컨시어지가 선호하시는 룸 아로마, 베개 경도, 웰컴 티 노트를 1:1로 사전 세팅합니다.' },
      { step: '02', phase: 'PRIVATE GATE ENTRY', title: '노출 없는 전용 게이트 발렛 체크인', desc: '별도의 프론트 대기 없이 프라이빗 중정 게이트를 통해 독채 스위트로 곧바로 안내됩니다.' },
      { step: '03', phase: 'EVENING RITUAL', title: '석양 다도 살롱 & 히노끼 온수 배스', desc: '해 질 녘 수공간 위로 번지는 노을과 함께 단일 다원 우전차 시연 및 편백나무 스파가 준비됩니다.' },
      { step: '04', phase: 'MORNING ARCHIVE', title: '제철 조식 반상 & 시그니처 인센스 기프트', desc: '정갈한 아침 반상 후 여운을 간직하실 수 있도록 수제 인센스 에디션을 선물로 전해드립니다.' }
    ],
    team: [
      { name: '강현수', role: '수석 건축가 · 총괄 디렉터', cred: 'ETH Zürich 건축 석사 · 한국건축문화대상', bio: '빛과 돌, 물의 침묵이 머무는 현대적 한옥 중정의 비례를 설계합니다.', img: 'director' },
      { name: '송연우', role: '수석 티 소믈리에 & 살롱 큐레이터', cred: '하동·교토 다원 전속 연구 · 공예 큐레이터', bio: '계절의 첫물 찻잎과 작가주의 도자 기물의 조화를 큐레이션합니다.', img: 'tea' },
      { name: '윤재민', role: '수석 공간 조향사 · 아틀리에 디렉터', cred: 'ISIPCA Grasse 수료 · 보태니컬 아카이브', bio: '서촌의 새벽 소나무 숲과 젖은 현무암의 잔향을 시그니처 향으로 빚어냅니다.', img: 'atelier' }
    ],
    works: [
      { id: 'w1', cat: 'SPACE', year: '2026', title: '수묵(水墨) 코트야드 독채 스위트', meta: '148㎡ · 야외 온수풀 · 히노끼탕', price: '₩640,000 / 박', img: 'courtyard' },
      { id: 'w2', cat: 'EXPERIENCE', year: '2026', title: '사계절 프라이빗 다도 & 다과 살롱', meta: '90분 단독 코스 · 소믈리에 시연', price: '₩160,000 / 2인', img: 'tea' },
      { id: 'w3', cat: 'OBJECT', year: '2026', title: '오 드 퍼퓸 — 시더 & 모스 No.04', meta: '50ml · 100% 보태니컬 에센셜', price: '₩185,000', img: 'perfume' },
      { id: 'w4', cat: 'SPACE', year: '2025', title: '이브닝 아틀리에 리스닝 라운지', meta: '진공관 오디오 · 내추럴 와인 페어링', price: '₩220,000 / 팀', img: 'atelier' }
    ],
    plans: [
      { tier: 'SALON EXPERIENCE', name: '프라이빗 다도 & 도슨트', monthly: '₩160,000', annual: '₩128,000', unit: '/ 2인 코스', desc: '계절 수제 다과 4종과 단일 다원 우전차, 건축 도슨트 투어가 포함된 90분 프로그램', perks: ['90분 단독 다실 대관', '티 소믈리에 1:1 시연', '시그니처 인센스 기프트'] },
      { tier: 'SIGNATURE STAY', name: '수묵 코트야드 독채 1박', monthly: '₩640,000', annual: '₩512,000', unit: '/ 1박 단독', featured: true, desc: '전용 소나무 중정과 야외 히노끼 자쿠지, 조식 다과 반상이 모두 포함된 대표 스테이', perks: ['148㎡ 독채 전체 단독 사용', '웰컴 샴페인 & 조식 반상 포함', '프라이빗 발렛 & 레이트 체크아웃'] },
      { tier: 'FOUNDERS CLUB', name: '연간 VIP 아틀리에 멤버십', monthly: '₩420,000', annual: '₩336,000', unit: '/ 월 환산', desc: '연 6박 우선 예약권과 시즌 한정 퍼퓸·다기 에디션을 정기 배송받는 프라이빗 클럽', perks: ['성수기 주말 우선 예약 보장', '연 6박 숙박 바우처 제공', '프라이빗 살롱 동반 무료 초청'] }
    ],
    reviews: [
      { quote: '문을 여는 순간 퍼지는 시더우드 향기와 중정에 떨어지는 고요한 물소리에 도심 한복판이라는 사실을 완전히 잊었습니다.', author: '김서연', role: '크리에이티브 디렉터 · 서울' },
      { quote: '해외 VIP 파트너 접견을 위해 독채와 다도 살롱을 함께 예약했는데, 공간의 비례감과 세심한 의전에 모두가 깊이 감탄했습니다.', author: '박진우', role: '글로벌 파트너스 대표' },
      { quote: '건축가가 빛을 다루는 방식이 경이롭습니다. 아침 안개 낀 중정을 바라보며 즐긴 우전차 한 잔이 올해 가장 완벽한 기억으로 남았습니다.', author: 'Daniel Laurent', role: 'Architectural Photographer · Paris' }
    ],
    faqs: [
      { q: '체크인 시 타 투숙객과 동선이 겹치지 않나요?', a: '하루 단 한 팀만 단독으로 운영되며, 전용 프라이빗 게이트와 발렛 파킹을 통해 외부 노출 없이 입실하실 수 있습니다.' },
      { q: '사전 아로마 및 다과 취향 커스터마이징은 어떻게 진행되나요?', a: '예약 확정 직후 전담 버틀러가 배정되어 선호하시는 향조(우디/시트러스/허벌)와 식이 제한 여부를 세심하게 사전 조율합니다.' },
      { q: '브랜드 프라이빗 행사나 매거진 화보 대관도 가능한가요?', a: '네, 평일 주간 및 전일 대관 프로그램을 통해 하이엔드 브랜드 프레젠테이션 및 에디토리얼 촬영이 가능합니다.' }
    ],
    preset: { palette:'PAL-01', shader:'BG-04', font:'FNT-01', textfx:'TFX-01', button:'BTN-01', surface:'SRF-01', imgstyle:'IMG-02', inputui:'INP-01', cursor:'CUR-01', motion:'MOT-01', badge:'BDG-01', preloader:'PRE-01', widget:'WGT-01', topbar:'TOP-01', navbar:'NAV-03', hero:'HERO-02', divider:'DIV-01', stats:'STA-01', feature:'FEAT-02', process:'PRO-01', gallery:'GAL-01', team:'TEM-01', pricing:'PRC-01', proof:'PRV-01', form:'FRM-01', footer:'FTR-01' }
  },

  obsidian: {
    id: 'obsidian',
    label: '2. AI · 엔터프라이즈 SaaS (OBSIDIAN AI)',
    brand: 'OBSIDIAN AI',
    edition: 'ENGINE v4.8 — ENTERPRISE',
    eyebrow: 'Autonomous Spatial Intelligence',
    h1Pre: '복잡한 워크플로우를 단 하나의',
    h1Accent: '초정밀 신경망 엔진으로',
    h1Sub: '수백만 건의 멀티모달 데이터 스트림을 0.04초 만에 추론하고 시각화하는 엔터프라이즈 AI 인프라 플랫폼입니다.',
    ctaPrimary: '엔터프라이즈 데모 시작',
    ctaSecondary: '아키텍처 백서 열람',
    nav: ['코어 엔진', '벤치마크', '보안 아키텍처', '엔터프라이즈 요금'],
    heroImg: 'monolith',
    secImg1: 'tech',
    secImg2: 'exhibition',
    secImg3: 'lobby',
    marquee: ['SUB-40MS LATENCY', 'SOC2 TYPE II CERTIFIED', 'ZERO-DATA RETENTION', 'DISTRIBUTED GPU MESH'],
    metrics: [
      { num: 38, suffix: 'ms', label: '글로벌 엣지 평균 추론 지연시간' },
      { num: 99.99, suffix: '%', label: '무중단 SLA 가동률 보증' },
      { num: 420, suffix: '×', label: '기존 파이프라인 대비 처리 속도' },
      { num: 1800, suffix: '+', label: '도입 글로벌 엔터프라이즈 팀' }
    ],
    features: [
      { code: '01', tag: 'NEURAL ROUTING', title: '실시간 컨텍스트 기반 모델 오케스트레이션', desc: '쿼리 복잡도와 보안 등급을 실시간 분석하여 최적의 파운데이션 모델 클러스터로 자동 라우팅합니다.', img: 'monolith' },
      { code: '02', tag: 'ZERO-TRUST VAULT', title: '프라이빗 VPC 격리 및 영지식 암호화', desc: '고객사 데이터가 외부 학습에 절대 사용되지 않으며 금융·의료 수준의 완벽한 데이터 주권을 보장합니다.', img: 'tech' },
      { code: '03', tag: 'LIVE TELEMETRY', title: '토큰 비용 및 지연시간 정밀 관제', desc: '모든 추론 노드의 병목 구간과 비용 효율을 초단위 텔레메트리 대시보드로 추적합니다.', img: 'exhibition' },
      { code: '04', tag: 'SDK ECOSYSTEM', title: '단 5줄의 코드로 끝나는 프로덕션 배포', desc: 'TypeScript, Python, Rust 네이티브 SDK와 웹훅 파이프라인을 즉시 연결할 수 있습니다.', img: 'lobby' }
    ],
    steps: [
      { step: '01', phase: 'SCHEMA CONNECT', title: '5분 내 기존 클라우드·DB 안전 연동', desc: '코드 변경 없이 읽기 전용 보안 커넥터로 사내 데이터 레이크와 API 게이트웨이를 연결합니다.' },
      { step: '02', phase: 'MODEL ROUTING', title: '도메인 특화 추론 파이프라인 구성', desc: '업무 정확도와 비용 목표에 맞춰 최적의 멀티모델 라우팅 정책을 자동 설계합니다.' },
      { step: '03', phase: 'SECURITY AUDIT', title: '제로트러스트 가드레일 & 환각 검증', desc: '민감정보 마스킹과 출처 기반 검증 엔진으로 금융·법률 수준의 신뢰성을 확보합니다.' },
      { step: '04', phase: 'GLOBAL EDGE DEPLOY', title: '전 세계 28개 리전 무중단 프로덕션 가동', desc: '99.99% SLA 보장과 실시간 레이턴시 관제 대시보드와 함께 즉시 상용 배포됩니다.' }
    ],
    team: [
      { name: '정태윤', role: 'Co-Founder & Chief Architect', cred: '前 글로벌 클라우드 분산시스템 수석 · KAIST 박사', bio: '초저지연 GPU 메쉬 스케줄러와 엔터프라이즈 추론 커널을 총괄 설계합니다.', img: 'director' },
      { name: '한지민', role: 'VP of AI Safety & Cryptography', cred: '영지식 보안 프로토콜 권위자 · SOC2 총괄', bio: '데이터 주권과 프라이빗 VPC 격리 보안 아키텍처를 책임집니다.', img: 'tech' },
      { name: '서준호', role: 'Head of Developer Experience', cred: '오픈소스 TypeScript/Rust 코어 컨트리뷰터', bio: '개발자가 5분 만에 프로덕션에 안착할 수 있는 직관적인 SDK를 구축합니다.', img: 'monolith' }
    ],
    works: [
      { id: 'w1', cat: 'SPACE', year: '2026', title: 'Quantum Mesh v4 코어 클러스터', meta: 'Multi-Region GPU Inference', price: '99.99% SLA', img: 'monolith' },
      { id: 'w2', cat: 'OBJECT', year: '2026', title: 'Tactile Edge Compute Node OP-1', meta: 'On-Premise Dedicated Hardware', price: 'Custom Spec', img: 'tech' },
      { id: 'w3', cat: 'EXPERIENCE', year: '2026', title: 'Realtime Spatial Canvas Studio', meta: 'WebGPU 120fps Visualization', price: 'Enterprise SDK', img: 'exhibition' },
      { id: 'w4', cat: 'SPACE', year: '2025', title: 'Global Financial Risk Engine', meta: 'Zero-Trust Isolated Cloud', price: 'ISO 27001', img: 'lobby' }
    ],
    plans: [
      { tier: 'PRO STUDIO', name: '스타트업 & 프로덕트 팀', monthly: '₩190,000', annual: '₩152,000', unit: '/ 월 (시트당)', desc: '고속 추론 API와 실시간 옵저버빌리티가 필요한 성장기 기술 조직용 플랜', perks: ['월 5,000만 추론 토큰 포함', '실시간 레이턴시 트레이싱', '전용 Slack 기술 채널 지원'] },
      { tier: 'SCALE CLUSTER', name: '비즈니스 전용 클러스터', monthly: '₩780,000', annual: '₩624,000', unit: '/ 월 (팀 단위)', featured: true, desc: '전용 GPU 리소스 할당과 무제한 파인튜닝 파이프라인을 제공하는 주력 플랜', perks: ['전용 H200 노드 우선 할당', 'SOC2 / HIPAA 규정 준수 모드', '99.99% 가동률 SLA 보증'] },
      { tier: 'ENTERPRISE VPC', name: '온프레미스 & 프라이빗 클라우드', monthly: '₩2,900,000', annual: '₩2,320,000', unit: '/ 월 (전담 구축)', desc: '금융권·대기업 내부망 완벽 격리 배포 및 전담 솔루션 아키텍트 상주 지원', perks: ['고객사 자체 AWS/GCP 내부 배포', '전담 AI 아키텍트 24/7 대응', '맞춤형 커스텀 모델 공동 개발'] }
    ],
    reviews: [
      { quote: '기존 레거시 추론 서버에서 평균 1.8초 걸리던 응답 속도가 OBSIDIAN 도입 첫날 39ms로 단축되었습니다.', author: '정현우', role: 'VP of Engineering · 핀테크 유니콘' },
      { quote: '금융보안원 가이드라인을 충족하는 프라이빗 VPC 아키텍처 덕분에 6개월 걸리던 보안 심사를 3주 만에 통과했습니다.', author: '최유진', role: 'CISO · 글로벌 자산운용' },
      { quote: '개발자 경험(DX)의 디테일이 압도적입니다. SDK 연동부터 프로덕션 배포까지 단 반나절이면 충분했습니다.', author: 'Marcus Vance', role: 'Principal Architect · San Francisco' }
    ],
    faqs: [
      { q: '입력된 기업 내부 데이터가 모델 재학습에 사용되나요?', a: '절대 사용되지 않습니다. 모든 API 호출은 Zero-Data Retention 정책이 기본 적용되며 메모리 처리 즉시 파기됩니다.' },
      { q: '사내 폐쇄망(Air-gapped) 환경에도 구축이 가능한가요?', a: '네, Enterprise VPC 플랜을 통해 외부 인터넷과 완전히 차단된 폐쇄망 쿠버네티스 클러스터에 컨테이너 형태로 배포해 드립니다.' },
      { q: '기존 OpenAI / Anthropic 코드베이스에서 마이그레이션이 쉬운가요?', a: '100% 호환 엔드포인트를 제공하므로 Base URL 한 줄만 변경하면 기존 애플리케이션 수정 없이 즉시 전환됩니다.' }
    ],
    preset: { palette:'PAL-05', shader:'BG-03', font:'FNT-05', textfx:'TFX-03', button:'BTN-02', surface:'SRF-01', imgstyle:'IMG-01', inputui:'INP-02', cursor:'CUR-04', motion:'MOT-02', badge:'BDG-02', preloader:'PRE-02', widget:'WGT-02', topbar:'TOP-02', navbar:'NAV-02', hero:'HERO-05', divider:'DIV-02', stats:'STA-02', feature:'FEAT-01', process:'PRO-02', gallery:'GAL-02', team:'TEM-02', pricing:'PRC-01', proof:'PRV-02', form:'FRM-04', footer:'FTR-03' }
  },

  botanica: {
    id: 'botanica',
    label: '3. 보태니컬 퍼퓸 · 뷰티 (ATELIER BOTANICA)',
    brand: 'ATELIER BOTANICA',
    edition: 'COLLECTION IV — BOTANICAL',
    eyebrow: 'Haute Botanical Perfumery',
    h1Pre: '새벽 비자림의 안개와 젖은 이끼,',
    h1Accent: '살결에 머무는 자연의 기억',
    h1Sub: '인공 합성 향료를 일절 배제하고 야생 수목과 뿌리, 야생화에서 저온 추출한 원액만으로 깊고 순수한 잔향을 완성합니다.',
    ctaPrimary: '시그니처 컬렉션 보기',
    ctaSecondary: '1:1 센트 프로파일링',
    nav: ['보태니컬 원료학', '오 드 퍼퓸', '핸드 & 바디 리추얼', '플래그십 부티크'],
    heroImg: 'perfume',
    secImg1: 'tea',
    secImg2: 'courtyard',
    secImg3: 'atelier',
    marquee: ['100% WILD-HARVESTED EXTRACTS', 'COLD-PRESSED IN GRASSE & JEJU', 'CRUELTY-FREE & VEGAN', 'REFILLABLE GLASS OBJECT'],
    metrics: [
      { num: 98.7, suffix: '%', label: '천연 유래 보태니컬 원료 함량' },
      { num: 72, suffix: '시간', label: '저온 침출 숙성 블렌딩 공정' },
      { num: 14, suffix: '시간+', label: '깊고 은은한 오 드 퍼퓸 지속력' },
      { num: 100, suffix: '%', label: '재활용 가능한 아틀리에 보틀' }
    ],
    features: [
      { code: '01', tag: 'COLD MACERATION', title: '열을 가하지 않는 72시간 저온 침출', desc: '식물 고유의 섬세한 탑노트 분자가 파괴되지 않도록 전통 저온 침출 공법으로 순수 에센스를 추출합니다.', img: 'perfume' },
      { code: '02', tag: 'EARTH & ROOTS', title: '베티버·시더우드·야생 이끼의 조화', desc: '첫 향의 자극적인 화려함 대신 시간이 흐를수록 체온과 어우러져 차분하고 지적인 우디 잔향을 남깁니다.', img: 'courtyard' },
      { code: '03', tag: 'TACTILE VESSEL', title: '오브제가 되는 수공예 틴티드 보틀', desc: '자외선을 차단하는 짙은 앰버 글래스와 무광 황동 캡으로 화장대 위 하나의 조각 작품처럼 자리합니다.', img: 'tea' },
      { code: '04', tag: 'BESPOKE ENGRAVING', title: '이니셜 각인 및 리넨 보자기 패키징', desc: '소중한 분을 위한 보틀 각인 서비스와 시그니처 향이 입혀진 천연 리넨 패키징을 무료로 제공합니다.', img: 'atelier' }
    ],
    steps: [
      { step: '01', phase: 'WILD HARVEST', title: '제주 비자림 & 그라스 야생 원료 채집', desc: '이슬이 마르기 전 새벽 시간대에 수확한 잎과 뿌리만을 선별하여 원료의 생명력을 보존합니다.' },
      { step: '02', phase: '72H COLD EXTRACTION', title: '무가열 72시간 저온 침출 추출', desc: '인공 용매 없이 식물성 오일과 순수 알코올에 천천히 우려내어 깊고 입체적인 향조를 얻습니다.' },
      { step: '03', phase: 'OAK CASK AGING', title: '지하 셀러 90일 다크 앰버 숙성', desc: '빛과 진동이 차단된 정온 셀러에서 원액들이 둥글고 부드럽게 어우러지도록 숙성합니다.' },
      { step: '04', phase: 'ARTISAN BOTTLING', title: '주문 즉시 수작업 보틀링 & 이니셜 각인', desc: '가장 신선한 컨디션의 오 드 퍼퓸에 고객의 이니셜과 제조 넘버를 새겨 발송합니다.' }
    ],
    team: [
      { name: '신유림', role: '마스터 퍼퓨머 · 창립 디렉터', cred: '프랑스 그라스 조향 아틀리에 12년 경력', bio: '기억과 계절의 습도를 닮은 서정적인 우디·보태니컬 향조를 조향합니다.', img: 'perfume' },
      { name: '오세현', role: '보태니컬 원료 연구 책임자', cred: '식물자원학 박사 · 유기농 농가 파트너십', bio: '제주와 남해의 지속 가능한 토종 허브 및 수목 원료를 발굴·연구합니다.', img: 'director' },
      { name: '남궁린', role: '오브제 & 공간 아트 디렉터', cred: '밀라노 디자인 위크 초청 공예 디자이너', bio: '손끝에 닿는 유리 보틀의 무게감과 플래그십 시향 살롱의 물성을 다듬습니다.', img: 'atelier' }
    ],
    works: [
      { id: 'w1', cat: 'OBJECT', year: '2026', title: 'No.04 시더 & 레인 모스 오 드 퍼퓸', meta: 'Cedarwood · Wet Moss · Bergamot', price: '₩185,000', img: 'perfume' },
      { id: 'w2', cat: 'OBJECT', year: '2026', title: 'No.07 스모크드 피그 & 블랙티', meta: 'Wild Fig · Roasted Oolong · Vetiver', price: '₩195,000', img: 'tea' },
      { id: 'w3', cat: 'EXPERIENCE', year: '2026', title: '보태니컬 디스커버리 코프레 (5종)', meta: '5 × 10ml 트래블 아카이브 세트', price: '₩118,000', img: 'courtyard' },
      { id: 'w4', cat: 'SPACE', year: '2025', title: '한남 플래그십 센트 라이브러리', meta: '1:1 프라이빗 조향 컨설테이션', price: '예약제 무료', img: 'atelier' }
    ],
    plans: [
      { tier: 'DISCOVERY SET', name: '시그니처 트래블 아카이브', monthly: '₩118,000', annual: '₩94,000', unit: '/ 5종 세트', desc: '대표 향 5종을 계절과 기분에 따라 경험하고 본품 구매 시 전액 크레딧으로 돌려받는 입문 세트', perks: ['10ml 미니 아토마이저 5종', '본품 50ml ₩30,000 바우처 동봉', '무료 시향 페이퍼 & 리넨 파우치'] },
      { tier: 'EAU DE PARFUM 50ML', name: '시그니처 본품 + 각인 에디션', monthly: '₩185,000', annual: '₩148,000', unit: '/ 50ml 본품', featured: true, desc: '가장 사랑받는 No.04 시더 & 모스 본품과 보틀 이니셜 각인, 핸드 밤 증정 구성', perks: ['보틀 각인 서비스 무료 제공', '보태니컬 핸드 밤 30ml 증정', '리필 스테이션 상시 25% 우대'] },
      { tier: 'SCENT SUBSCRIPTION', name: '사계절 정기 큐레이션 클럽', monthly: '₩145,000', annual: '₩116,000', unit: '/ 분기별 배송', desc: '봄·여름·가을·겨울 계절의 공기에 맞춘 한정판 조향 에디션과 인센스를 정기 배송', perks: ['미출시 프리뷰 향 최우선 수령', '연 2회 프라이빗 조향 클래스 초청', '전 제품 상시 20% 멤버십 우대'] }
    ],
    reviews: [
      { quote: '백화점 니치 향수에서 흔히 느껴지던 알코올 첫 향이 전혀 없고, 비 온 뒤 숲길을 걸을 때의 진짜 흙과 나무 향이 납니다.', author: '이하은', role: '에디터 · 보그 코리아 객원' },
      { quote: '만나는 사람마다 무슨 향수 쓰냐고 물어봅니다. 은은하면서도 하루 종일 옷깃에 고급스러운 잔향이 남아 인생 향수가 됐어요.', author: '윤도현', role: '건축 디자이너' },
      { quote: '보자기 패키징과 보틀 각인 퀄리티가 예술입니다. 소중한 고객 선물용으로 주문할 때마다 늘 최고의 반응을 얻습니다.', author: '정수빈', role: '아트 갤러리 큐레이터' }
    ],
    faqs: [
      { q: '온라인 구매 전 시향해 볼 수 있는 방법이 있나요?', a: '모든 본품 주문 시 동일한 향의 2ml 트라이얼 바이알이 함께 동봉됩니다. 본품 개봉 전 트라이얼을 먼저 시향해 보시고 취향에 맞지 않으면 100% 무료 반품이 가능합니다.' },
      { q: '보틀 각인 문구는 몇 자까지 가능한가요?', a: '영문 대소문자 및 숫자 기준 최대 14자까지 레이저 음각 각인이 가능하며 추가 비용 없이 당일 출고됩니다.' },
      { q: '공병 리필 서비스는 어떻게 이용하나요?', a: '한남·성수·서촌 플래그십 부티크에 빈 보틀을 지참하시면 세척 및 살균 후 정상가 대비 25% 할인된 금액으로 리필해 드립니다.' }
    ],
    preset: { palette:'PAL-04', shader:'BG-02', font:'FNT-04', textfx:'TFX-07', button:'BTN-04', surface:'SRF-06', imgstyle:'IMG-03', inputui:'INP-03', cursor:'CUR-06', motion:'MOT-03', badge:'BDG-01', preloader:'PRE-04', widget:'WGT-05', topbar:'TOP-04', navbar:'NAV-01', hero:'HERO-06', divider:'DIV-03', stats:'STA-01', feature:'FEAT-04', process:'PRO-03', gallery:'GAL-05', team:'TEM-03', pricing:'PRC-01', proof:'PRV-03', form:'FRM-02', footer:'FTR-02' }
  },

  eclipse: {
    id: 'eclipse',
    label: '4. 미쉐린 파인다이닝 (L’ÉCLIPSE SEOUL)',
    brand: 'L’ÉCLIPSE',
    edition: 'AUTUMN TASTING — 11 COURSES',
    eyebrow: 'Contemporary Korean Gastronomy',
    h1Pre: '제철 산지의 생명력과 불의 미학,',
    h1Accent: '한 접시에 응축된 계절의 서사',
    h1Sub: '전국 각지의 생산자와 새벽마다 호흡하며 거둬들인 제철 식재료를 발효와 숯불, 현대적 프렌치 기법으로 재해석합니다.',
    ctaPrimary: '테이스팅 코스 예약',
    ctaSecondary: '소믈리에 페어링 리스트',
    nav: ['셰프 철학', '시즌 테이스팅 메뉴', '프라이빗 다이닝 룸', '오시는 길·예약'],
    heroImg: 'dining',
    secImg1: 'tea',
    secImg2: 'courtyard',
    secImg3: 'lobby',
    marquee: ['MICHELIN GUIDE SEOUL', '11-COURSE SEASONAL MENU', '480-LABEL CELLAR ARCHIVE', 'PRIVATE SOMMELIER PAIRING'],
    metrics: [
      { num: 11, suffix: '코스', label: '가을 제철 이브닝 테이스팅' },
      { num: 480, suffix: '종', label: '올드 빈티지 & 내추럴 와인 셀러' },
      { num: 28, suffix: '곳', label: '전속 계약 유기농 산지 농가' },
      { num: 6, suffix: '테이블', label: '오롯이 미식에 집중하는 좌석 수' }
    ],
    features: [
      { code: '01', tag: 'MICRO-SEASONALITY', title: '2주마다 새롭게 쓰이는 제철 메뉴', desc: '동해안 자연산 해산물과 지리산 야생 버섯 등 가장 정점에 오른 식재료만을 엄선해 코스를 구성합니다.', img: 'dining' },
      { code: '02', tag: 'FERMENTATION LAB', title: '3년 숙성 초장과 수제 발효 주스', desc: '자체 발효 연구소에서 빚어낸 장류와 논알코올 발효 티 페어링이 독창적인 감칠맛의 층위를 만듭니다.', img: 'tea' },
      { code: '03', tag: 'CHEF COUNTER & PDR', title: '키친의 생동감과 완벽한 프라이빗 룸', desc: '조리 과정을 눈앞에서 감상하는 셰프 카운터와 중요 비즈니스 만찬을 위한 방음 다이닝 룸을 갖추고 있습니다.', img: 'lobby' },
      { code: '04', tag: 'CERAMIC COLLAB', title: '코스마다 온도를 지키는 작가주의 기물', desc: '국내 도예 작가 7인과 협업하여 각 요리의 온도와 질감에 최적화된 단 하나뿐인 도자기를 사용합니다.', img: 'courtyard' }
    ],
    steps: [
      { step: '01', phase: 'PROLOGUE · WELCOME', title: '그랑 크뤼 웰컴 샴페인 & 한입 아뮈즈 부슈', desc: '계절의 시작을 알리는 세 가지 산지 한입 요리와 함께 오늘 사용될 주요 식재료를 소개해 드립니다.' },
      { step: '02', phase: 'SEA & FERMENTATION', title: '동해안 자연산 어패류 & 숙성 발효 육수', desc: '차갑게 숙성한 제철 해산물과 맑고 깊은 발효 다시가 입안의 미각을 섬세하게 깨웁니다.' },
      { step: '03', phase: 'BINCHOTAN HEARTH', title: '참숯 직화 한우 채끝 & 지리산 능이 쥬', desc: '비장탄 위에서 정교하게 휴지(Resting)를 거친 메인 요리와 올드 빈티지 레드 페어링이 이어집니다.' },
      { step: '04', phase: 'FINALE · MIGNARDISES', title: '계절 과실 소르베, 우전 다과 & 레시피 카드', desc: '오늘 경험하신 11코스의 산지 기록이 인쇄된 왁스 실링 메뉴 카드를 기념으로 증정합니다.' }
    ],
    team: [
      { name: '차승원', role: '오너 셰프 · 총괄 디렉터', cred: '파리·코펜하겐 미쉐린 3스타 수련 · 서울 2스타', bio: '한국의 사계절 발효 미학과 불의 직관적인 풍미를 현대적인 코스로 엮어냅니다.', img: 'director' },
      { name: '문지원', role: '헤드 소믈리에 · 비버리지 디렉터', cred: '아시아 베스트 소믈리에 파이널리스트', bio: '480여 종의 희귀 빈티지 와인과 수제 발효 논알코올 티 페어링을 설계합니다.', img: 'dining' },
      { name: '백도윤', role: '파티시에 & 도예 기물 큐레이터', cred: '리옹 제과 학교 졸업 · 공예 컬렉터', bio: '자연의 단맛을 살린 디저트와 요리의 온도를 완성하는 작가 도자기를 매칭합니다.', img: 'tea' }
    ],
    works: [
      { id: 'w1', cat: 'EXPERIENCE', year: '2026', title: '이브닝 11코스 — 가을 서리와 숯', meta: '18:00 – 22:00 · 셰프 카운터 & 홀', price: '₩280,000 / 인', img: 'dining' },
      { id: 'w2', cat: 'EXPERIENCE', year: '2026', title: '런치 7코스 — 정오의 채광', meta: '12:00 – 15:00 · 계절 테이스팅', price: '₩165,000 / 인', img: 'tea' },
      { id: 'w3', cat: 'OBJECT', year: '2026', title: '그랑 크뤼 & 내추럴 6글래스 페어링', meta: '수석 소믈리에 큐레이션', price: '₩170,000 / 인', img: 'perfume' },
      { id: 'w4', cat: 'SPACE', year: '2026', title: '프라이빗 다이닝 룸 (최대 8인)', meta: '전담 서버 · 맞춤형 메뉴 인쇄', price: '별도 룸차지 없음', img: 'courtyard' }
    ],
    plans: [
      { tier: 'LUNCH TASTING', name: '정오의 7코스 테이스팅', monthly: '₩165,000', annual: '₩148,000', unit: '/ 1인 기준', desc: '제철 전채부터 숯불 메인, 계절 디저트와 다과까지 정갈하게 경험하는 런치 코스', perks: ['7코스 제철 테이스팅 메뉴', '논알코올 티 페어링 추가 가능', '무료 발렛 파킹 지원'] },
      { tier: 'EVENING DEGUSTATION', name: '시그니처 11코스 & 웰컴 샴페인', monthly: '₩280,000', annual: '₩250,000', unit: '/ 1인 기준', featured: true, desc: '레클립스의 철학이 집약된 풀 테이스팅 코스와 그랑 크뤼 웰컴 샴페인 1잔 포함', perks: ['11코스 시그니처 디너 풀코스', '그랑 크뤼 웰컴 샴페인 제공', '기념일 레터링 및 수제 구움과자 기프트'] },
      { tier: 'PRIVATE SALON BUYOUT', name: '프라이빗 룸 비즈니스 만찬 패키지', monthly: '₩2,400,000', annual: '₩2,100,000', unit: '/ 6인 단독 룸', desc: '해외 귀빈 접견 및 소규모 브랜드 만찬을 위한 단독 다이닝 룸 & 소믈리에 풀 페어링', perks: ['최대 8인 독립 방음 다이닝 룸', '전 인원 소믈리에 와인 페어링 포함', '기업 로고 커스텀 메뉴지 제작'] }
    ],
    reviews: [
      { quote: '한식의 발효 감칠맛을 이렇게 세련되고 모던한 터치로 풀어낸 다이닝은 서울에서 단연 독보적입니다.', author: '강민석', role: '미식 칼럼니스트' },
      { quote: '논알코올 발효 티 페어링이 와인 페어링 못지않게 충격적으로 훌륭했습니다. 조명과 기물, 서비스 템포까지 완벽합니다.', author: '송지아', role: '브랜드 디렉터' },
      { quote: 'An unforgettable culinary theatre. Every ceramic plate, shadow, and smoky aroma felt orchestrated with poetic precision.', author: 'Henri Moreau', role: 'Sommelier · Lyon' }
    ],
    faqs: [
      { q: '해산물 알레르기나 베지테리언 코스 변경이 가능한가요?', a: '방문 최소 3일 전까지 말씀해 주시면 식재료 제한 사항에 맞춰 대체 디쉬를 세심하게 구성해 드립니다.' },
      { q: '콜키지(Corkage) 정책은 어떻게 되나요?', a: '테이블당 최대 2병까지 반입 가능하며 병당 ₩100,000의 콜키지 비용이 부과됩니다(업장 와인 1병 주문 시 1병 프리).' },
      { q: '매월 예약 오픈 일정은 언제인가요?', a: '매월 1일 오전 11시에 익월 전체 예약 슬롯이 공식 웹사이트를 통해 우선 오픈됩니다.' }
    ],
    preset: { palette:'PAL-08', shader:'BG-09', font:'FNT-01', textfx:'TFX-04', button:'BTN-05', surface:'SRF-07', imgstyle:'IMG-10', inputui:'INP-01', cursor:'CUR-03', motion:'MOT-02', badge:'BDG-08', preloader:'PRE-05', widget:'WGT-03', topbar:'TOP-03', navbar:'NAV-03', hero:'HERO-01', divider:'DIV-04', stats:'STA-03', feature:'FEAT-03', process:'PRO-04', gallery:'GAL-03', team:'TEM-04', pricing:'PRC-02', proof:'PRV-01', form:'FRM-06', footer:'FTR-01' }
  },

  hanlaw: {
    id: 'hanlaw',
    label: '5. 글로벌 로펌 · 금융자문 (HAN & PARTNERS)',
    brand: 'HAN & PARTNERS',
    edition: 'ESTABLISHED 2006 — SEOUL · NY',
    eyebrow: 'Cross-Border M&A & Private Wealth',
    h1Pre: '가장 중대한 의사결정의 순간,',
    h1Accent: '흔들리지 않는 전략적 해답',
    h1Sub: '크로스보더 M&A, 국제 분쟁 해결, 패밀리오피스 자산 승계까지 수석 파트너 변호사 그룹이 직접 사건의 처음부터 끝까지 책임집니다.',
    ctaPrimary: '수석 파트너 비공개 자문 요청',
    ctaSecondary: '주요 수행 실적 리포트',
    nav: ['핵심 전문분야', '수석 파트너진', '승소·자문 레코드', '비공개 컨설테이션'],
    heroImg: 'lobby',
    secImg1: 'monolith',
    secImg2: 'courtyard',
    secImg3: 'atelier',
    marquee: ['CHAMBERS GLOBAL BAND 1', 'CROSS-BORDER M&A ADVISORY', 'INTERNATIONAL ARBITRATION', 'PRIVATE FAMILY OFFICE'],
    metrics: [
      { num: 14.8, suffix: '조원', label: '누적 크로스보더 M&A 자문 규모' },
      { num: 96.2, suffix: '%', label: '국제 중재·기업 소송 승소 및 화해율' },
      { num: 48, suffix: '명', label: '전원 시니어 파트너급 전담 전문가' },
      { num: 24, suffix: '시간', label: '글로벌 긴급 리스크 대응 데스크' }
    ],
    features: [
      { code: '01', tag: 'SENIOR PARTNER LED', title: '주니어 위임 없는 100% 시니어 파트너 직할', desc: '대형 로펌의 관행과 달리 최초 전략 수립부터 협상 테이블 마무리까지 수석 파트너가 직접 수행합니다.', img: 'lobby' },
      { code: '02', tag: 'CROSS-BORDER DEAL', title: '북미·유럽·아시아 해외 인수합병 원스톱 구조화', desc: '뉴욕·싱가포르 현지 제휴 로펌 및 세무 전문가와 실시간 원팀으로 국경 간 거래 리스크를 완벽히 통제합니다.', img: 'monolith' },
      { code: '03', tag: 'FAMILY GOVERNANCE', title: '가업 승계 및 패밀리오피스 지배구조 설계', desc: '창업주 가문의 철학과 자산을 다음 세대로 안전하게 이전하기 위한 법률·세무 통합 지배구조를 구축합니다.', img: 'courtyard' },
      { code: '04', tag: 'STRICT CONFIDENTIALITY', title: '철저한 비밀유지 및 독립 프라이빗 브리핑 룸', desc: '의뢰인의 방문 사실조차 외부에 노출되지 않는 전용 엘리베이터 동선과 최고 등급 보안 체계를 운영합니다.', img: 'atelier' }
    ],
    steps: [
      { step: '01', phase: 'CONFLICT CHECK & NDA', title: '2시간 내 이해상충 검증 및 상호 NDA 체결', desc: '접수 즉시 컴플라이언스 검증을 완료하고 철저한 비밀유지협약 아래 비공개 브리핑을 개시합니다.' },
      { step: '02', phase: 'DEEP DUE DILIGENCE', title: '법률·세무·규제 입체 리스크 정밀 실사', desc: '수석 변호사와 회계·세무 파트너가 합동으로 잠재적 우발채무와 규제 쟁점을 72시간 내 식별합니다.' },
      { step: '03', phase: 'DEAL & LITIGATION STRATEGY', title: '협상 레버리지 극대화 및 변론 마스터플랜', desc: '의뢰인에게 가장 유리한 거래 구조와 다중 시나리오 방어 논리를 치밀하게 설계합니다.' },
      { step: '04', phase: 'CLOSING & GOVERNANCE', title: '성공적 딜 클로징 및 사후 지배구조 안정화', desc: '계약 종결 이후의 PMI(인수 후 통합)와 이사회 거버넌스 안착까지 흔들림 없이 동행합니다.' }
    ],
    team: [
      { name: '한재원', role: '대표변호사 · M&A 총괄 파트너', cred: '서울대 법대 · Harvard LL.M. · NY Bar', bio: '20년간 14조 원 이상의 국경 간 인수합병 및 경영권 방어 자문을 성공적으로 이끌었습니다.', img: 'director' },
      { name: '권미경', role: '국제중재 · 기업분쟁 수석 파트너', cred: 'SIAC · ICC 중재인 · 영국 칙선변호사 자격', bio: '에너지·반도체·금융 분야의 고난도 국제 상사중재에서 독보적인 승소 레코드를 보유하고 있습니다.', img: 'lobby' },
      { name: '조성빈', role: '조세 · 패밀리오피스 수석 파트너', cred: '前 국세청 국제조세 자문위원 · 공인회계사', bio: '대기업 지주사 전환 및 가업 승계 세무 구조화의 최고 권위자입니다.', img: 'atelier' }
    ],
    works: [
      { id: 'w1', cat: 'SPACE', year: '2026', title: '유럽 반도체 장비사 ₩1.4조 크로스보더 인수 자문', meta: 'Cross-Border M&A · Antitrust Clearance', price: '종결 완료', img: 'lobby' },
      { id: 'w2', cat: 'OBJECT', year: '2026', title: '싱가포르 국제중재센터(SIAC) 에너지 합작 분쟁 승소', meta: 'International Arbitration · $320M', price: '전액 승소', img: 'monolith' },
      { id: 'w3', cat: 'EXPERIENCE', year: '2025', title: '중견 지주사 지배구조 개편 및 패밀리오피스 설립', meta: 'Tax & Corporate Governance', price: '비공개 자문', img: 'courtyard' },
      { id: 'w4', cat: 'SPACE', year: '2025', title: '글로벌 사모펀드(PEF) 국내 AI 데이터센터 투자 구조화', meta: 'Private Equity & Infrastructure', price: '₩8,200억', img: 'tech' }
    ],
    plans: [
      { tier: 'EXECUTIVE BRIEFING', name: '초기 법률·규제 리스크 정밀 진단', monthly: '₩3,500,000', annual: '₩2,800,000', unit: '/ 건당 진단', desc: '신규 신사업 진출 또는 투자 계약 체결 전 핵심 독소조항 및 규제 리스크를 72시간 내 분석', perks: ['수석 파트너 2인 합동 검토', '72시간 내 핵심 리스크 의견서 제출', '비공개 대면 전략 브리핑 1회'] },
      { tier: 'CORPORATE RETAINER', name: '기업 상시 전략 법률고문 파트너십', monthly: '₩8,500,000', annual: '₩6,800,000', unit: '/ 월 자문료', featured: true, desc: '이사회 운영, 투자 유치, 인사·노무, 지식재산권 등 경영 전반을 밀착 방어하는 전담 고문단', perks: ['전담 수석 파트너 직통 핫라인', '월간 이사회 및 주요 계약 상시 검토', '긴급 분쟁 발생 시 즉시 대응팀 가동'] },
      { tier: 'BESPOKE TRANSACTION', name: 'M&A · 국제분쟁 전담 태스크포스', monthly: '별도 협의', annual: '맞춤 구조화', unit: '/ 딜 규모 기준', desc: '대규모 인수합병, 경영권 방어, 국제중재 사건을 위한 다학제 전담 TF 구성', perks: ['법률·회계·세무 통합 딜 구조화', '해외 현지 로펌 공동 대응 지휘', '성공보수 연계 맞춤형 수수료 설계'] }
    ],
    reviews: [
      { quote: '수천억 원대 해외 인수 협상에서 상대방이 미처 보지 못한 조항 하나를 짚어내어 거래 조건을 완전히 뒤집어 주셨습니다.', author: '이동훈', role: '상장 중견그룹 전략기획실장' },
      { quote: '처음 상담한 대표 변호사님이 끝까지 직접 서면을 챙기시는 모습에서 대형 로펌에서는 느낄 수 없던 깊은 신뢰를 얻었습니다.', author: '한승민', role: '바이오테크 창업자 · 대표이사' },
      { quote: '빠르고 단호하며 군더더기가 없습니다. 경영진이 안심하고 본업에 집중할 수 있게 만드는 최고의 전략 파트너입니다.', author: '김태영', role: '프라이빗 에쿼티 매니징 파트너' }
    ],
    faqs: [
      { q: '자문 문의 단계부터 비밀유지협약(NDA) 체결이 가능한가요?', a: '네, 모든 초기 문의는 변호사법상 철저한 비밀유지 의무가 적용되며, 요청 즉시 상호 NDA를 선체결한 후 브리핑을 진행합니다.' },
      { q: '이해상충(Conflict of Interest) 여부는 얼마나 빨리 확인되나요?', a: '내부 컴플라이언스 시스템을 통해 문의 접수 후 2시간 이내에 이해상충 여부를 확인하고 수임 가능 여부를 회신드립니다.' },
      { q: '해외 현지 법인 관련 영문 계약 및 국제 소송도 직접 수행하나요?', a: '전원 미국(NY/CA)·영국 변호사 자격을 겸비한 국제 거래/분쟁 파트너진이 통역 없이 직접 영문 협상과 변론을 수행합니다.' }
    ],
    preset: { palette:'PAL-07', shader:'BG-08', font:'FNT-07', textfx:'TFX-10', button:'BTN-12', surface:'SRF-05', imgstyle:'IMG-01', inputui:'INP-01', cursor:'CUR-08', motion:'MOT-01', badge:'BDG-09', preloader:'PRE-03', widget:'WGT-02', topbar:'TOP-05', navbar:'NAV-05', hero:'HERO-02', divider:'DIV-02', stats:'STA-04', feature:'FEAT-07', process:'PRO-05', gallery:'GAL-08', team:'TEM-05', pricing:'PRC-04', proof:'PRV-05', form:'FRM-02', footer:'FTR-03' }
  },

  kinetic: {
    id: 'kinetic',
    label: '6. 크리에이티브 에이전시 (KINETIC ARCHIVE)',
    brand: 'KINETIC®',
    edition: 'ISSUE 09 — SEOUL / BERLIN',
    eyebrow: 'Avant-Garde Brand & Digital Studio',
    h1Pre: '평범한 템플릿의 시대를 끝내는',
    h1Accent: '압도적 시각 언어와 모션',
    h1Sub: '브랜드 전략부터 3D 키네틱 아이덴티티, 인터랙티브 플래그십 웹사이트까지 첫 3초 만에 각인되는 디지털 경험을 설계합니다.',
    ctaPrimary: '프로젝트 브리프 보내기',
    ctaSecondary: '2026 쇼릴 & 아카이브',
    nav: ['쇼케이스', '크리에이티브 역량', '어워드·프레스', '프로젝트 의뢰'],
    heroImg: 'exhibition',
    secImg1: 'monolith',
    secImg2: 'tech',
    secImg3: 'atelier',
    marquee: ['AWWWARDS SITE OF THE MONTH', 'BRAND IDENTITY', 'WEBGL & MOTION SYSTEM', 'CREATIVE DIRECTION'],
    metrics: [
      { num: 34, suffix: '회', label: 'Awwwards · FWA · Red Dot 수상' },
      { num: 310, suffix: '%', label: '리브랜딩 후 평균 전환율 상승' },
      { num: 60, suffix: 'fps', label: '모바일·데스크톱 모션 퍼포먼스' },
      { num: 12, suffix: '개국', label: '서울·베르린·도쿄 글로벌 클라이언트' }
    ],
    features: [
      { code: '01', tag: 'BRAND ARCHITECTURE', title: '본질을 꿰뚫는 버벌 & 비주얼 아이덴티티', desc: '단순히 예쁜 로고를 넘어 시장 내 독보적 포지셔닝을 선점하는 브랜드 세계관과 타이포그래피 시스템을 구축합니다.', img: 'exhibition' },
      { code: '02', tag: 'INTERACTIVE FLAGSHIP', title: '매출과 브랜딩을 동시에 잡는 하이엔드 웹', desc: '유려한 마이크로 인터랙션과 직관적인 구매·예약 퍼널을 결합해 이탈률을 낮추고 브랜드 가치를 증명합니다.', img: 'monolith' },
      { code: '03', tag: '3D & SPATIAL MOTION', title: '리얼타임 3D 오브제 & 키네틱 필름', desc: '제품의 물성과 빛의 굴절을 극대화한 3D 아트워크로 런칭 캠페인의 압도적인 첫인상을 완성합니다.', img: 'tech' },
      { code: '04', tag: 'MODULAR DESIGN SYSTEM', title: '런칭 이후에도 확장 가능한 에셋 라이브러리', desc: '내부 팀이 손쉽게 캠페인 페이지를 조합·확장할 수 있도록 체계화된 컴포넌트 가이드를 함께 납품합니다.', img: 'atelier' }
    ],
    steps: [
      { step: '01', phase: 'WEEK 01—02 · DISCOVERY', title: '브랜드 에센스 발굴 & 비주얼 디렉션 정의', desc: '경쟁사 문법을 해체하고 브랜드만의 고유한 조형 언어, 서체, 컬러, 모션 원칙을 수립합니다.' },
      { step: '02', phase: 'WEEK 03—04 · PROTOTYPE', title: '인터랙티브 키비주얼 & 하이파이 프로토타이핑', desc: '정적인 시안이 아닌 실제 브라우저에서 작동하는 모션 프로토타입으로 감각을 검증합니다.' },
      { step: '03', phase: 'WEEK 05—07 · ENGINEERING', title: '60fps 웹 퍼포먼스 & 반응형 디자인 시스템 구축', desc: '모든 디바이스에서 끊김 없이 작동하는 클린 코드와 재사용 가능한 에셋 라이브러리를 개발합니다.' },
      { step: '04', phase: 'WEEK 08 · LAUNCH & HANDOFF', title: '글로벌 캠페인 런칭 & 내부 팀 에셋 이관', desc: 'SEO·전환 트래킹 검수 후 고객사 팀이 자유롭게 운영할 수 있는 가이드와 소스를 완납합니다.' }
    ],
    team: [
      { name: '류지환', role: 'Executive Creative Director', cred: 'Awwwards 심사위원 · Red Dot Best of Best 4회', bio: '브랜드의 서사를 강렬한 타이포그래피와 공간감 있는 인터랙션으로 번역합니다.', img: 'director' },
      { name: '레오 뮐러', role: 'Creative Technologist · Berlin', cred: 'WebGL & GLSL 크리에이티브 코딩 스페셜리스트', bio: '셰이더 그래픽과 물리 기반 마이크로 모션으로 살아 숨 쉬는 웹을 구현합니다.', img: 'exhibition' },
      { name: '김나영', role: 'Brand Strategy & Design System Lead', cred: '前 글로벌 디자인 에이전시 수석 디자이너', bio: '심미성과 비즈니스 전환율이 완벽히 맞물리는 모듈형 디자인 시스템을 설계합니다.', img: 'atelier' }
    ],
    works: [
      { id: 'w1', cat: 'EXPERIENCE', year: '2026', title: 'CHRONOSCAPE — 서울 미디어아트 비엔날레', meta: 'Exhibition Identity & WebGL Archive', price: 'SOTD 수상', img: 'exhibition' },
      { id: 'w2', cat: 'SPACE', year: '2026', title: 'MONOLITH AUDIO — 베를린 사운드 랩 플래그십', meta: '3D Product Direction & E-Commerce', price: '+280% 매출', img: 'monolith' },
      { id: 'w3', cat: 'OBJECT', year: '2026', title: 'SYNTHESIS OP-4 — 모듈러 하드웨어 런칭', meta: 'Industrial Film & Interactive Spec', price: 'Red Dot 본상', img: 'tech' },
      { id: 'w4', cat: 'SPACE', year: '2025', title: 'MAISON SÉOUL — 서촌 건축 스테이 리브랜딩', meta: 'Brand Strategy & Booking Engine', price: '완판 기록', img: 'courtyard' }
    ],
    plans: [
      { tier: 'LAUNCH SPRINT', name: '하이임팩트 브랜드 랜딩 & 아이덴티티', monthly: '₩12,000,000', annual: '₩9,600,000', unit: '/ 4주 스프린트', desc: '신규 프로덕트 런칭이나 리브랜딩을 앞두고 단기간에 압도적인 디지털 쇼케이스가 필요한 팀', perks: ['핵심 비주얼 무드 & 타이포 시스템', '인터랙티브 원페이지 플래그십 구축', '모바일 퍼포먼스·SEO 완벽 최적화'] },
      { tier: 'FULL FLAGSHIP', name: '통합 브랜드 아이덴티티 & 멀티페이지 웹', monthly: '₩28,000,000', annual: '₩22,400,000', unit: '/ 8주 풀스코프', featured: true, desc: '전략 수립부터 3D 비주얼, 맞춤형 예약/커머스 연동, 디자인 시스템까지 총괄하는 대표 패키지', perks: ['브랜드 가이드라인 & 3D 키비주얼 제작', '전체 서브페이지 + 커스텀 모션 엔진', '재사용 가능한 모듈형 에셋 시스템 이관'] },
      { tier: 'CREATIVE PARTNER', name: '연간 크리에이티브 디렉팅 리테이너', monthly: '₩6,500,000', annual: '₩5,200,000', unit: '/ 월 파트너십', desc: '내부 디자인 팀 채용 비용으로 시니어 아트디렉터와 프론트엔드 엔지니어 팀을 전담 배정', perks: ['매월 신규 캠페인 페이지 & 에셋 제작', '상시 A/B 테스트 및 전환율 고도화', '주간 크리에이티브 디렉팅 미팅'] }
    ],
    reviews: [
      { quote: '기존 에이전시들이 가져오던 뻔한 시안과는 차원이 달랐습니다. 오픈 첫 주에 해외 바이어 문의가 4배 이상 폭증했습니다.', author: '박성훈', role: '컨템포러리 브랜드 대표' },
      { quote: '아름다운 모션이 들어가면 느려질 거라 걱정했는데, 모바일에서도 60fps로 날아다니는 최적화 실력에 감탄했습니다.', author: '최민지', role: '테크 스타트업 프로덕트 리드' },
      { quote: '납품받은 모듈형 에셋 라이브러리 덕분에 내부 마케터들도 수준 높은 프로모션 페이지를 30분 만에 뚝딱 만들고 있습니다.', author: '김도윤', role: '이커머스 CMO' }
    ],
    faqs: [
      { q: '기획안이 완전히 정리되지 않은 초기 상태에서도 의뢰 가능한가요?', a: '물론입니다. 킥오프 단계의 디스커버리 워크숍을 통해 핵심 타겟 정의와 카피라이팅, 정보 구조(IA) 설계까지 함께 리드해 드립니다.' },
      { q: '구축 완료 후 저희 팀이 직접 텍스트나 사진을 수정할 수 있나요?', a: '네, 코딩 지식 없이도 텍스트·이미지·섹션 구성을 안전하게 관리하실 수 있도록 깔끔한 모듈 구조와 가이드를 함께 인계합니다.' },
      { q: '월별 수행 가능한 프로젝트 수에 제한이 있나요?', a: '결과물의 타협 없는 완성도를 위해 매월 신규 풀스코프 프로젝트는 최대 3건까지만 선별하여 집중 수행하고 있습니다.' }
    ],
    preset: { palette:'PAL-06', shader:'BG-05', font:'FNT-03', textfx:'TFX-06', button:'BTN-10', surface:'SRF-09', imgstyle:'IMG-07', inputui:'INP-04', cursor:'CUR-02', motion:'MOT-04', badge:'BDG-05', preloader:'PRE-06', widget:'WGT-04', topbar:'TOP-06', navbar:'NAV-04', hero:'HERO-03', divider:'DIV-01', stats:'STA-05', feature:'FEAT-08', process:'PRO-06', gallery:'GAL-02', team:'TEM-06', pricing:'PRC-06', proof:'PRV-03', form:'FRM-04', footer:'FTR-04' }
  }
};

/* ==========================================================================
   26 MODULAR EQUIPMENT SLOTS (13 ATOMIC ASSETS + 13 FULL-PAGE SECTIONS = 252 ASSETS!)
   ========================================================================== */
const CATEGORIES = [
  /* GROUP A: ATOMIC UI, TYPOGRAPHY, SHADERS & PHYSICS (13 SLOTS) */
  { key: 'palette',   group: 'global',  num: '01', icon: '🎨', shortName: '전체 색감',   name: '컬러 시스템',        secId: null },
  { key: 'shader',    group: 'global',  num: '02', icon: '✨', shortName: '배경 효과',   name: '60fps 배경 셰이더',  secId: null },
  { key: 'font',      group: 'global',  num: '03', icon: '🔤', shortName: '글꼴·폰트',   name: '한글·영문 서체',     secId: 'sec-hero' },
  { key: 'textfx',    group: 'global',  num: '04', icon: '💫', shortName: '제목 효과',   name: '키네틱 타이포',      secId: 'sec-hero' },
  { key: 'button',    group: 'global',  num: '05', icon: '🔘', shortName: '버튼 디자인', name: '피직스 버튼',        secId: 'sec-hero' },
  { key: 'surface',   group: 'global',  num: '06', icon: '🃏', shortName: '카드·박스',   name: '스포트라이트 카드',  secId: 'sec-feature' },
  { key: 'imgstyle',  group: 'global',  num: '07', icon: '🖼', shortName: '사진 액자',   name: '사진 마스크·필름',   secId: 'sec-hero' },
  { key: 'inputui',   group: 'global',  num: '08', icon: '⌨️', shortName: '입력·스위치', name: '인풋·토글 컨트롤',   secId: 'sec-form' },
  { key: 'cursor',    group: 'global',  num: '09', icon: '🖱', shortName: '마우스 효과', name: '마우스 커서·파티클', secId: null },
  { key: 'motion',    group: 'global',  num: '10', icon: '🎬', shortName: '등장 모션',   name: '스크롤·등장 모션',   secId: 'sec-feature' },
  { key: 'badge',     group: 'global',  num: '11', icon: '🏷', shortName: '배지·라벨',   name: '에디토리얼 라벨',    secId: 'sec-hero' },
  { key: 'preloader', group: 'global',  num: '12', icon: '🚪', shortName: '오프닝·바',   name: '인트로·스크롤바',    secId: null },
  { key: 'widget',    group: 'global',  num: '13', icon: '📌', shortName: '하단 고정바', name: '플로팅 독·위젯',     secId: null },

  /* GROUP B: FULL-PAGE ARCHITECTURAL SECTION BLOCKS (13 SLOTS) */
  { key: 'topbar',    group: 'section', num: '14', icon: '📢', shortName: '상단 공지띠', name: '상단 어나운스 바',   secId: 'sec-topbar' },
  { key: 'navbar',    group: 'section', num: '15', icon: '🧭', shortName: '상단 메뉴바', name: '네비게이션 헤더',    secId: 'sec-navbar' },
  { key: 'hero',      group: 'section', num: '16', icon: '🏠', shortName: '메인 첫화면', name: '히어로 아키텍처',    secId: 'sec-hero' },
  { key: 'divider',   group: 'section', num: '17', icon: '🎞', shortName: '흐르는 띠',   name: '마키·디바이더',      secId: 'sec-divider' },
  { key: 'stats',     group: 'section', num: '18', icon: '📊', shortName: '숫자 실적',   name: '실적·카운터 지표',   secId: 'sec-stats' },
  { key: 'feature',   group: 'section', num: '19', icon: '💎', shortName: '핵심 특장점', name: '벤토·인터랙티브 탭', secId: 'sec-feature' },
  { key: 'process',   group: 'section', num: '20', icon: '🪜', shortName: '진행 순서',   name: '프로세스·타임라인',  secId: 'sec-process' },
  { key: 'gallery',   group: 'section', num: '21', icon: '📷', shortName: '포트폴리오',  name: '룩북·포트폴리오',    secId: 'sec-gallery' },
  { key: 'team',      group: 'section', num: '22', icon: '👥', shortName: '팀·대표 소개',name: '팀·디렉터·장인 소개',secId: 'sec-team' },
  { key: 'pricing',   group: 'section', num: '23', icon: '💳', shortName: '가격·요금표', name: '요금제·멤버십',      secId: 'sec-pricing' },
  { key: 'proof',     group: 'section', num: '24', icon: '💬', shortName: '후기·FAQ',    name: '고객리뷰·FAQ',       secId: 'sec-proof' },
  { key: 'form',      group: 'section', num: '25', icon: '📝', shortName: '예약·문의폼', name: '컨시어지 예약·폼',   secId: 'sec-form' },
  { key: 'footer',    group: 'section', num: '26', icon: '🏛', shortName: '하단 푸터',   name: '모뉴멘탈 푸터',      secId: 'sec-footer' }
];

/* ==========================================================================
   GROUP A VAULT — 134 ATOMIC UI, TYPOGRAPHY, SHADER & PHYSICS ASSETS
   ========================================================================== */
const VAULT = {
  palette: [
    { id: 'PAL-01', name: '메종 알라바스터 & 브론즈', cls: 'pal-01', swatches: ['#F6F2EB','#191614','#8C5A32'], desc: '따뜻한 천연 석재 톤과 브론즈 포인트 · 건축/스테이' },
    { id: 'PAL-02', name: '옵시디언 다크 & 샴페인 골드', cls: 'pal-02', swatches: ['#0B0C0F','#F5F3EF','#D4A359'], desc: '깊은 칠흑 배경과 샴페인 골드 · 하이엔드 라운지' },
    { id: 'PAL-03', name: '퓨어 갤러리 포슬린 & 잉크', cls: 'pal-03', swatches: ['#FAFAFA','#0F1012','#5E626A'], desc: '무채색 화이트 큐브 미술관 미니멀리즘' },
    { id: 'PAL-04', name: '이솝 보태니컬 포레스트', cls: 'pal-04', swatches: ['#F3F4EE','#16231B','#28543C'], desc: '양피지 크림 톤과 짙은 침엽수 그린 · 퍼퓸/살롱' },
    { id: 'PAL-05', name: '딥 카본 테크 & 아이스 시안', cls: 'pal-05', swatches: ['#080A0F','#10141D','#38BDF8'], desc: '엔터프라이즈 AI · 차세대 클라우드 다크모드' },
    { id: 'PAL-06', name: '스위스 아카이브 버밀리온', cls: 'pal-06', swatches: ['#F3EFE6','#111111','#D92B2B'], desc: '취리히 디자인 뮤지엄 포스터 크림 & 레드' },
    { id: 'PAL-07', name: '옥스퍼드 이그제큐티브 네이비', cls: 'pal-07', swatches: ['#F7F9FC','#0B172A','#1E40AF'], desc: '글로벌 로펌 · 프라이빗 뱅킹 · 컨설팅' },
    { id: 'PAL-08', name: '교토 차콜 & 테라코타 엠버', cls: 'pal-08', swatches: ['#12100E','#F4EFEA','#D96B43'], desc: '숯불과 도자기의 온기를 담은 파인다이닝 다크' },
    { id: 'PAL-09', name: '미드나잇 에메랄드 클럽', cls: 'pal-09', swatches: ['#081310','#ECF5F1','#C9A255'], desc: '프라이빗 멤버십 살롱 & 하이 주얼리 다크' },
    { id: 'PAL-10', name: '파리지앵 초크 로즈 & 보르도', cls: 'pal-10', swatches: ['#FAF6F6','#261317','#881337'], desc: '오뜨 꾸뛰르 패션 & 와인 아틀리에' },
    { id: 'PAL-11', name: '애시드 카본 & 볼트 라임', cls: 'pal-11', swatches: ['#0A0B0D','#F8FAFC','#BEF264'], desc: '크리에이티브 스튜디오 & Web3 테크 다크' },
    { id: 'PAL-12', name: '노르딕 피오르드 미스트', cls: 'pal-12', swatches: ['#EEF3F7','#0F2230','#0369A1'], desc: '청량하고 정교한 바이오테크 · 메디컬 클리닉' }
  ],

  shader: [
    { id: 'BG-01', name: '퓨어 아키텍처 캔버스', mode: 'none', cls: '', desc: '노이즈 없이 색채와 여백의 비례만 남긴 순수 배경' },
    { id: 'BG-02', name: '리퀴드 오로라 메쉬 (60fps Canvas)', mode: 'aurora', cls: '', desc: '브랜드 컬러의 빛 구름이 유체처럼 천천히 유영하는 셰이더' },
    { id: 'BG-03', name: '마우스 추적 스포트라이트 격자 (Canvas)', mode: 'spotlightGrid', cls: '', desc: '커서 반경 주변으로만 은은하게 드러나는 정밀 설계선' },
    { id: 'BG-04', name: '창가 고보 채광 & 부유하는 빛먼지 (Canvas)', mode: 'dustGobo', cls: '', desc: '사선으로 스며드는 햇살과 공기 중에 떠다니는 골든 더스트' },
    { id: 'BG-05', name: '토포그래피 실크 등고선 파동 (Canvas)', mode: 'waves', cls: '', desc: '유기적인 사인파 간섭 곡선이 결을 그리며 흐르는 배경' },
    { id: 'BG-06', name: '인터랙티브 중력 컨스텔레이션 (Canvas)', mode: 'constellation', cls: '', desc: '실시간 연결선이 호흡하며 움직이는 노드 네트워크 필드' },
    { id: 'BG-07', name: '갤러리 소프트 비네팅 조명', mode: 'none', cls: 'bg-css-07', desc: '화면 가장자리에 깊이감 있는 음영을 주어 중앙 집중도 극대화' },
    { id: 'BG-08', name: '스위스 12컬럼 아키텍처 수직 리듬', mode: 'none', cls: 'bg-css-08', desc: '건축 도면처럼 정교한 12단 수직 헤어라인 가이드' },
    { id: 'BG-09', name: '키아로스쿠로 오버헤드 무대 조명', mode: 'none', cls: 'bg-css-09', desc: '천장 중앙에서 히어로 타이틀로 떨어지는 스포트라이트 광원' },
    { id: 'BG-10', name: '아틀리에 천연 리넨 직조 텍스처', mode: 'none', cls: 'bg-css-10', desc: '고급 판화지·패브릭의 미세한 대각선 직조 질감' }
  ],

  font: [
    { id: 'FNT-01', name: 'Noto Serif KR × Cormorant 정통 명조', cls: 'fnt-01', sample: '고요한 건축의 결 · Timeless', desc: '보그·아만 리조트 감성의 품격 있는 한글 명조 & 세리프 페어링' },
    { id: 'FNT-02', name: 'IBM Plex KR × Plus Jakarta 모던 고딕', cls: 'fnt-02', sample: '정교한 디지털 비례 · Modern', desc: '토스·리니어 감성의 단단하고 명쾌한 현대적 산세리프' },
    { id: 'FNT-03', name: 'Black Han Sans × Syne 아방가르드 헤비', cls: 'fnt-03', sample: '압도적 시각 조형 · KINETIC', desc: '한눈에 시선을 장악하는 초중량 한글 타이틀 & 아방가르드 디스플레이' },
    { id: 'FNT-04', name: '고운바탕(Gowun Batang) × Playfair 살롱', cls: 'fnt-04', sample: '살결에 머무는 향기 · Botanica', desc: '서정적인 손글씨결 바탕체와 파리지앵 세리프의 우아한 조화' },
    { id: 'FNT-05', name: 'Space Grotesk × IBM Plex 테크 엔지니어링', cls: 'fnt-05', sample: '초정밀 신경망 엔진 · Neural', desc: '기하학적 개성과 가독성을 겸비한 AI·하드웨어 테크 표준' },
    { id: 'FNT-06', name: 'JetBrains Mono × 인더스트리얼 코드', cls: 'fnt-06', sample: 'SYS // 04.82ms 정밀 제어', desc: '틴에이지 엔지니어링 감성의 고정폭 테크니컬 모노스페이스' },
    { id: 'FNT-07', name: '함렛(Hahmlet Bold) × 이그제큐티브 슬랩', cls: 'fnt-07', sample: '흔들림 없는 전략 · Advisory', desc: '글로벌 로펌·프라이빗 뱅킹을 위한 묵직한 현대 슬랩 명조' },
    { id: 'FNT-08', name: 'Noto Serif Light(300) × 갤러리 위스퍼', cls: 'fnt-08', sample: '여백과 침묵의 미학 · Gallery', desc: '초극세 300 웨이트 명조 획과 여유로운 자간의 하이엔드 갤러리 서체' }
  ],

  textfx: [
    { id: 'TFX-01', name: '에디토리얼 이탤릭 콘트라스트', cls: 'tfx-01', desc: '핵심 키워드만 명조 이탤릭과 브랜드 컬러로 우아하게 강조' },
    { id: 'TFX-02', name: '스플릿 워드 스태거 라이즈 (Kinetic)', cls: 'tfx-02', desc: '단어마다 마스크 아래에서 시차를 두고 탄성 있게 솟아오르는 모션' },
    { id: 'TFX-03', name: '사이퍼 매트릭스 디코드 (Scramble)', cls: 'tfx-03', desc: '등장 및 마우스 오버 시 암호 기호가 빠르게 해독되며 문장 완성' },
    { id: 'TFX-04', name: '리퀴드 메탈릭 포일 시머', cls: 'tfx-04', desc: '핵심 구절 위로 백금·골드 박막 광택이 천천히 흐르는 효과' },
    { id: 'TFX-05', name: '마스크 베이스라인 커튼 리빌', cls: 'tfx-05', desc: '보이지 않는 수평선 아래에서 타이틀 전체가 매끄럽게 등장' },
    { id: 'TFX-06', name: '할로우 아키텍처 스트로크 → 필', cls: 'tfx-06', desc: '1.4px 중공 외곽선 타이틀이 호버 시 브랜드 컬러로 채워짐' },
    { id: 'TFX-07', name: '수채 틴트 & 언더라인 스트로크', cls: 'tfx-07', desc: '핵심 어구 아래 은은한 틴트 레이어와 정교한 밑줄 결합' },
    { id: 'TFX-08', name: '인터랙티브 트래킹 브리드 (Hover)', cls: 'tfx-08', desc: '마우스를 올리면 자간이 우아하게 숨 쉬듯 확장되는 반응형 타이포' },
    { id: 'TFX-09', name: '인버트 에디토리얼 스탬프 블록', cls: 'tfx-09', desc: '반전 잉크 블록 안에 핵심 키워드를 가두어 강렬한 시선 고정' },
    { id: 'TFX-10', name: '클래식 파인 언더라인 악센트', cls: 'tfx-10', desc: '고전 서적 판형처럼 절제된 1.5px 명조 언더라인 포인트' }
  ],

  button: [
    { id: 'BTN-01', name: '마그네틱 자석 풀 캡슐 (JS Physics)', cls: 'btn-01', desc: '커서가 다가가면 자석처럼 끌려오다 탄성 있게 복귀하는 솔리드 필', render: (t) => `<button type="button" class="f-btn btn-01 f-magnetic"><span>${t}</span><span>→</span></button>` },
    { id: 'BTN-02', name: '코닉 라이트빔 회전 캡슐 (Linear풍)', cls: 'btn-02', desc: '테두리 1.5px 궤도를 따라 빛줄기가 360° 실시간 회전하는 하이테크 버튼', render: (t) => `<button type="button" class="f-btn btn-02"><span>✦ ${t}</span></button>` },
    { id: 'BTN-03', name: '커서 진입점 리퀴드 잉크 확산', cls: 'btn-03', desc: '마우스가 닿은 정확한 좌표(X,Y)에서 원형 잉크가 퍼지며 채워짐', render: (t) => `<button type="button" class="f-btn btn-03 f-ripple"><span>${t}</span><span>↗</span></button>` },
    { id: 'BTN-04', name: '슬롯머신 롤링 텍스트 캡슐 (Framer풍)', cls: 'btn-04', desc: '호버 시 글자가 위쪽으로 경쾌하게 회전 교체되는 키네틱 버튼', render: (t) => `<button type="button" class="f-btn btn-04"><span class="btn-roll"><span data-text="${t}">${t}</span></span><span>→</span></button>` },
    { id: 'BTN-05', name: '에디토리얼 헤어라인 & 런치 애로우', cls: 'btn-05', desc: '미니멀 하단 보더와 45° 대각선으로 발사되는 원형 화살표 배지', render: (t) => `<button type="button" class="f-btn btn-05"><span>${t}</span><span class="b-arr">→</span></button>` },
    { id: 'BTN-06', name: '리프랙티브 프로스티드 글래스', cls: 'btn-06', desc: '상단 스페큘러 광택선과 반투명 블러가 어우러진 유리 캡슐', render: (t) => `<button type="button" class="f-btn btn-06"><span>${t}</span></button>` },
    { id: 'BTN-07', name: '브라운(Braun) 택타일 기계식 키캡', cls: 'btn-07', desc: '실제 알루미늄 스위치를 누르는 듯한 3D 물리 스트로크 감각', render: (t) => `<button type="button" class="f-btn btn-07"><span class="f-mono" style="opacity:0.6">⌘</span><span>${t}</span></button>` },
    { id: 'BTN-08', name: '아키텍처 코너 크로스헤어 락온', cls: 'btn-08', desc: '모서리 ㄱ/ㄴ 브라켓이 호버 시 사방 테두리로 확장되며 락온', render: (t) => `<button type="button" class="f-btn btn-08"><span>${t}</span></button>` },
    { id: 'BTN-09', name: '듀얼 포드 원형 애로우 독', cls: 'btn-09', desc: '우측 컬러 원형 포드 안의 화살표가 호버 시 회전·스케일업', render: (t) => `<button type="button" class="f-btn btn-09"><span>${t}</span><span class="b-arr">→</span></button>` },
    { id: 'BTN-10', name: '스위스 브루탈 하드 오프셋 스탬프', cls: 'btn-10', desc: '2px 솔리드 잉크 테두리와 4px 하드 그림자의 강렬한 타격감', render: (t) => `<button type="button" class="f-btn btn-10"><span>${t}</span><span>↗</span></button>` },
    { id: 'BTN-11', name: '스페큘러 포일 시머 스윕 CTA', cls: 'btn-11', desc: '버튼 표면 위로 은은한 빛의 사선이 주기적으로 스쳐 지나감', render: (t) => `<button type="button" class="f-btn btn-11"><span>${t}</span></button>` },
    { id: 'BTN-12', name: '실크 커튼 좌→우 와이프 인버트', cls: 'btn-12', desc: '절제된 고스트 프레임에서 실크 장막처럼 색상이 채워지는 버튼', render: (t) => `<button type="button" class="f-btn btn-12"><span>${t}</span></button>` },
    { id: 'BTN-13', name: '라이브 어베일러빌리티 LED 필', cls: 'btn-13', desc: '실시간 예약/상담 가능 상태를 알리는 에메랄드 비콘 결합 버튼', render: (t) => `<button type="button" class="f-btn btn-13"><span>${t}</span></button>` },
    { id: 'BTN-14', name: '챔퍼드 모놀리스 45° 엣지', cls: 'btn-14', desc: '양 끝 모서리를 45도로 정밀 절삭한 건축적 조형 버튼', render: (t) => `<button type="button" class="f-btn btn-14"><span>${t}</span></button>` },
    { id: 'BTN-15', name: '리퀴드 머큐리 크롬 스페큘러 필', cls: 'btn-15', desc: '마우스 좌표를 따라 금속성 하이라이트 구면광이 일렁이는 크롬 캡슐', render: (t) => `<button type="button" class="f-btn btn-15"><span>${t}</span><span>✦</span></button>` },
    { id: 'BTN-16', name: '듀얼 셔터 상하 스플릿 인버트', cls: 'btn-16', desc: '호버 즉시 상하 두 개의 셔터가 맞물려 닫히며 반전되는 건축적 버튼', render: (t) => `<button type="button" class="f-btn btn-16"><span>${t}</span><span>→</span></button>` }
  ],

  surface: [
    { id: 'SRF-01', name: '마우스 추적 라디얼 스포트라이트 (Linear풍)', cls: 'srf-01', desc: '커서가 움직이는 위치를 실시간 계산해 카드 내부와 보더에 은은한 광원 투사' },
    { id: 'SRF-02', name: '3D 퍼스펙티브 홀로그래픽 틸트 (JS Physics)', cls: 'srf-02', desc: '마우스 각도에 따라 3차원 원근 회전하며 입체감을 선사하는 인터랙티브 카드' },
    { id: 'SRF-03', name: '뮤지엄 파스파르투(Passe-Partout) 이중 액자', cls: 'srf-03', desc: '7px 안쪽 인셋 매트 라인이 작품을 감싸는 하이엔드 갤러리 프레임' },
    { id: 'SRF-04', name: '리프랙티브 멀티레이어 글래스모피즘', cls: 'srf-04', desc: '20px 배경 블러와 상단 1px 스페큘러 림 라이트가 결합된 반투명 유리 표면' },
    { id: 'SRF-05', name: '아키텍처 1px 헤어라인 & 레지스트레이션(+)', cls: 'srf-05', desc: '우측 상단 마이크로 크로스(+) 마크가 찍힌 정밀 건축 도면 카드' },
    { id: 'SRF-06', name: '보더리스 딥 앰비언트 엘리베이션', cls: 'srf-06', desc: '선 없이 다층 소프트 그림자만으로 공중에 사뿐히 떠 있는 애플식 카드' },
    { id: 'SRF-07', name: '에디토리얼 탑 룰 모노그래프 (무박스)', cls: 'srf-07', desc: '사각 박스를 없애고 상단 굵은 수평선과 여백만으로 구획하는 매거진 스타일' },
    { id: 'SRF-08', name: '스택드 3겹 아카이브 덱', cls: 'srf-08', desc: '카드 하단에 3장의 종이 레이어가 겹쳐진 아카이브 인덱스 표면' },
    { id: 'SRF-09', name: '스위스 브루탈 하드 잉크 블록', cls: 'srf-09', desc: '2px 선명한 윤곽선과 6px 솔리드 그림자가 호버 시 컬러로 전환' },
    { id: 'SRF-10', name: '소프트 세라믹 택타일 엠보스', cls: 'srf-10', desc: '도자기 표면처럼 매트하고 부드러운 내부 광택 입체 카드' },
    { id: 'SRF-11', name: '하이 콘트라스트 인버트 모놀리스', cls: 'srf-11', desc: '배경 톤과 극적으로 대비되는 솔리드 반전 모놀리스 블록' },
    { id: 'SRF-12', name: '챔퍼드 테크니컬 하우징', cls: 'srf-12', desc: '우측 상단 모서리를 45° 절삭한 하이테크 하드웨어 모듈 표면' }
  ],

  imgstyle: [
    { id: 'IMG-01', name: '클린 아키텍처 소프트 라운드', cls: 'img-01', desc: '디자인 토큰 곡률과 완벽히 호응하는 정갈한 기본 프레임 + 줌' },
    { id: 'IMG-02', name: '유러피언 아치(Cathedral Arch) 마스크', cls: 'img-02', desc: '상단이 우아한 반원 아치로 마감된 지중해·부티크 건축 실루엣' },
    { id: 'IMG-03', name: '스컬프처 캡슐 오벌 마스크', cls: 'img-03', desc: '조형적인 타원·캡슐 곡선으로 시각적 리듬을 주는 에디토리얼 컷' },
    { id: 'IMG-04', name: '아틀리에 매트 프린트 액자', cls: 'img-04', desc: '순백색 파인아트 인화지 여백을 두른 사진전 프린트 스타일' },
    { id: 'IMG-05', name: '필름 느와르 흑백 → 호버 풀컬러 리빌', cls: 'img-05', desc: '고대비 모노크롬 화보에서 마우스를 올리면 본연의 색채가 피어남' },
    { id: 'IMG-06', name: '시네마틱 코닥 포트라 웜 그레이딩', cls: 'img-06', desc: '아날로그 중형 필름 특유의 따뜻하고 깊이 있는 색보정 필터' },
    { id: 'IMG-07', name: '브루탈 오프셋 컬러 하드 프레임', cls: 'img-07', desc: '직각 보더와 우하단 7px 브랜드 컬러 솔리드 그림자 프레임' },
    { id: 'IMG-08', name: '챔퍼 옥타곤 8각 조형 마스크', cls: 'img-08', desc: '네 모서리를 대각선으로 깎아낸 테크·전시 조형 프레임' },
    { id: 'IMG-09', name: '골드 헤어라인 인셋 보더', cls: 'img-09', desc: '6px 여백 바깥으로 얇은 액센트 보더가 감싸는 클래식 프레임' },
    { id: 'IMG-10', name: '딥 시네마 비네트 포털', cls: 'img-10', desc: '가장자리 안쪽 그림자로 사진 속 공간감을 깊게 끌어당기는 연출' }
  ],

  inputui: [
    { id: 'INP-01', name: '아키텍처 언더라인 포커스 인풋', cls: 'inp-01', desc: '사각 테두리 없이 하단 실선이 포커스 시 액센트 컬러로 깊어지는 에디토리얼 필드',
      demo: () => `<div class="inp-01" style="width:100%;max-width:250px;"><label class="f-mono" style="font-size:11px;color:var(--accent);">GUEST NAME</label><input class="f-input" value="김서연 · 디렉터" /></div>` },
    { id: 'INP-02', name: '리프랙티브 글래스 캡슐 필드', cls: 'inp-02', desc: '반투명 블러와 부드러운 알약형 곡률이 어우러진 모던 검색·입력창',
      demo: () => `<div class="inp-02" style="width:100%;max-width:250px;"><input class="f-input" placeholder="프라이빗 코드 또는 이메일..." value="vip@maison-seoul.kr" /></div>` },
    { id: 'INP-03', name: '오버라인 보더 인그레이빙 인풋', cls: 'inp-03', desc: '선명한 1.5px 프레임과 상단 모노 라벨로 가독성을 높인 정통 폼 필드',
      demo: () => `<div class="inp-03" style="width:100%;max-width:250px;"><div style="position:relative;"><span class="f-mono" style="position:absolute;top:-8px;left:10px;padding:0 5px;background:var(--bg);font-size:10px;color:var(--accent);">RESERVATION DATE</span><input class="f-input" value="2026. 11. 24 — CHECK IN" /></div></div>` },
    { id: 'INP-04', name: '스위스 브루탈 하드 섀도우 인풋', cls: 'inp-04', desc: '2px 솔리드 보더와 4px 하드 그림자가 포커스 시 컬러로 반응하는 필드',
      demo: () => `<div class="inp-04" style="width:100%;max-width:250px;"><input class="f-input" value="PROJECT BRIEF // 2026" /></div>` },
    { id: 'INP-05', name: '브라운 리세스드 인셋 택타일 필드', cls: 'inp-05', desc: '표면 안쪽으로 은은하게 파인 음각 그림자로 안정감을 주는 인풋',
      demo: () => `<div class="inp-05" style="width:100%;max-width:250px;"><input class="f-input" value="010-5550-8200" /></div>` },
    { id: 'INP-06', name: '리퀴드 스프링 토글 스위치 (ON/OFF)', cls: 'inp-01', desc: '클릭 즉시 탄성 있게 슬라이딩하는 iOS/Linear 감성 토글 컨트롤',
      demo: () => `<div style="display:flex;align-items:center;gap:12px;"><div class="f-switch is-on" onclick="this.classList.toggle('is-on')"><div class="f-switch-knob"></div></div><span style="font-size:13px;font-weight:600;">프라이빗 발렛 의전 포함</span></div>` },
    { id: 'INP-07', name: '세그먼트 슬라이딩 알약 스위처', cls: 'inp-02', desc: '옵션 간 전환을 직관적으로 처리하는 알약형 탭 컨트롤러',
      demo: () => `<div style="display:inline-flex;padding:4px;border-radius:999px;background:var(--muted);border:1px solid var(--border);gap:4px;">
        <button type="button" onclick="this.parentElement.querySelectorAll('button').forEach(b=>{b.style.background='transparent';b.style.color='var(--sub)'});this.style.background='var(--fg)';this.style.color='var(--bg)';" style="padding:6px 14px;border-radius:999px;border:none;background:var(--fg);color:var(--bg);font-size:12px;font-weight:700;cursor:pointer;">독채 스테이</button>
        <button type="button" onclick="this.parentElement.querySelectorAll('button').forEach(b=>{b.style.background='transparent';b.style.color='var(--sub)'});this.style.background='var(--fg)';this.style.color='var(--bg)';" style="padding:6px 14px;border-radius:999px;border:none;background:transparent;color:var(--sub);font-size:12px;font-weight:700;cursor:pointer;">다도 살롱</button>
      </div>` },
    { id: 'INP-08', name: '알루미늄 택타일 수량·인원 스테퍼', cls: 'inp-03', desc: '예약 인원이나 수량을 클릭으로 증감하는 정밀 카운터 모듈',
      demo: () => `<div style="display:inline-flex;align-items:center;gap:14px;padding:6px 10px;border-radius:999px;background:var(--surface);border:1px solid var(--border);">
        <button type="button" onclick="const s=this.nextElementSibling;s.textContent=Math.max(1,Number(s.textContent)-1)+'명'" style="width:28px;height:28px;border-radius:999px;border:1px solid var(--border);background:var(--bg);color:var(--fg);cursor:pointer;font-weight:700;">−</button>
        <span class="f-mono" style="font-size:13px;font-weight:700;min-width:34px;text-align:center;">2명</span>
        <button type="button" onclick="const s=this.previousElementSibling;s.textContent=Math.min(12,Number(s.textContent.replace('명',''))+1)+'명'" style="width:28px;height:28px;border-radius:999px;border:none;background:var(--accent);color:var(--accent-fg);cursor:pointer;font-weight:700;">+</button>
      </div>` },
    { id: 'INP-09', name: '멀티셀렉트 인터랙티브 필터 칩', cls: 'inp-02', desc: '복수 관심사·옵션을 클릭해 토글하는 직관적인 태그 칩 그룹',
      demo: () => `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;">
        ${['브랜딩','3D 모션','예약 웹'].map((t,i)=>`<button type="button" onclick="const on=this.dataset.on==='1';this.dataset.on=on?'0':'1';this.style.background=on?'var(--surface)':'var(--accent)';this.style.color=on?'var(--fg)':'var(--accent-fg)';" data-on="${i===0?'1':'0'}" style="padding:6px 12px;border-radius:999px;border:1px solid var(--border);background:${i===0?'var(--accent)':'var(--surface)'};color:${i===0?'var(--accent-fg)':'var(--fg)'};font-size:12px;font-weight:600;cursor:pointer;">✓ ${t}</button>`).join('')}
      </div>` },
    { id: 'INP-10', name: '라이브 게이지 레인지 슬라이더', cls: 'inp-05', desc: '드래그 즉시 수치 배지가 실시간 업데이트되는 예산·평수 슬라이더',
      demo: () => `<div style="width:100%;max-width:240px;"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span>예산 규모</span><strong class="f-mono" style="color:var(--accent);">₩3,500만</strong></div><input type="range" min="1000" max="9000" step="500" value="3500" oninput="this.previousElementSibling.querySelector('strong').textContent='₩'+Number(this.value).toLocaleString()+'만'" style="width:100%;accent-color:var(--accent);cursor:pointer;" /></div>` }
  ],

  cursor: [
    { id: 'CUR-01', name: '마그네틱 래깅 링 & VIEW 렌즈', mode: 'ring', desc: '부드러운 관성으로 따라오다 버튼·사진 위에서 68px 렌즈로 확장' },
    { id: 'CUR-02', name: '블렌드 디퍼런스 반전 오브 (Awwwards풍)', mode: 'diff', desc: '타이틀 위를 지날 때마다 실시간 색상 반전을 일으키는 원형 오브' },
    { id: 'CUR-03', name: '앰비언트 웜 스포트라이트 헤일로', mode: 'halo', desc: '마우스 주위 240px 반경을 은은한 조명처럼 밝혀주는 무드 광원' },
    { id: 'CUR-04', name: '아키텍처 크로스헤어 & 실시간 X/Y 좌표', mode: 'coords', desc: '정밀 십자선(+) 옆에 실시간 픽셀 좌표를 표시하는 엔지니어링 커서' },
    { id: 'CUR-05', name: '에디토리얼 캡슐 태그 (EXPLORE ↗)', mode: 'pill', desc: '인터랙티브 요소 진입 시 커서 옆에 세련된 액션 캡슐 배지 표시' },
    { id: 'CUR-06', name: '골든 스타더스트 파티클 트레일 (실시간 입자)', mode: 'trail', desc: '마우스 궤적을 따라 황금빛 미세 입자가 실시간 생성·소멸하는 럭셔리 효과' },
    { id: 'CUR-07', name: '미니멀 골드 림 포인터', mode: 'slim', desc: '시야를 가리지 않는 절제된 20px 골드 글로우 링 포인터' },
    { id: 'CUR-08', name: '순정 OS 기본 커서 (비활성)', mode: 'off', desc: '커스텀 커서 효과 없이 시스템 기본 마우스 포인터 유지' }
  ],

  motion: [
    { id: 'MOT-01', name: '스프링 스태거드 라이즈 (Scroll Reveal)', cls: 'mot-01', demoAnim: 'demoMot01', desc: '스크롤 진입 시 요소들이 80ms 시차를 두고 아래에서 탄성 있게 부상' },
    { id: 'MOT-02', name: '시네마 블러 투 샤프 포커스', cls: 'mot-02', demoAnim: 'demoMot02', desc: '카메라 초점이 맞춰지듯 12px 블러에서 선명하게 정착하는 리빌' },
    { id: 'MOT-03', name: '클립패스 수직 베일 언베일', cls: 'mot-03', demoAnim: 'demoMot03', desc: '장막이 아래에서 위로 걷히며 이미지와 카드가 드러나는 효과' },
    { id: 'MOT-04', name: '3D 퍼스펙티브 캐스케이드 플립', cls: 'mot-04', demoAnim: 'demoMot04', desc: '원근 공간에서 카드가 입체 각도로 세워지며 정착하는 모션' },
    { id: 'MOT-05', name: '소프트 스케일 줌 정착', cls: 'mot-05', demoAnim: 'demoMot05', desc: '90% 스케일에서 부드럽게 호흡하며 원래 크기로 자리잡는 등장' },
    { id: 'MOT-06', name: '에디토리얼 호리즌탈 글라이드', cls: 'mot-06', demoAnim: 'demoMot06', desc: '좌측에서 우측으로 유려하게 미끄러져 들어오는 매거진 리빌' },
    { id: 'MOT-07', name: '호리즌탈 와이프 커튼 리빌', cls: 'mot-07', demoAnim: 'demoMot07', desc: '좌→우로 프레임이 열리며 콘텐츠를 공개하는 건축적 모션' },
    { id: 'MOT-08', name: '인스턴트 정적 모드 (모션 OFF)', cls: 'mot-08', demoAnim: '', desc: '스크롤 등장 애니메이션 없이 모든 섹션을 즉시 고정 표시' },
    { id: 'MOT-09', name: '엘라스틱 스프링 바운스 팝', cls: 'mot-09', demoAnim: 'demoMot09', desc: '106% 오버슈트 탄성 후 쫀득하게 안착하는 생동감 넘치는 모션' },
    { id: 'MOT-10', name: '아키텍처 스큐 투 플랫 정착', cls: 'mot-10', demoAnim: 'demoMot10', desc: '미세한 대각선 기울기(Skew)에서 수평으로 칼같이 정렬되는 에디토리얼 모션' }
  ],

  badge: [
    { id: 'BDG-01', name: '코르모랑 이탤릭 & 엠대시(—)', cls: 'f-bdg bdg-01', desc: '고급 매거진 에세이 머리말처럼 우아한 명조 이탤릭 라벨' },
    { id: 'BDG-02', name: '레프트 액센트 필러 모노 태그', cls: 'f-bdg bdg-02', desc: '좌측 2px 수직 포인트 라인과 고정폭 영문 인덱스' },
    { id: 'BDG-03', name: '아키텍처 파인 헤어라인 캡슐', cls: 'f-bdg bdg-03', desc: '자간을 넓힌 대문자와 1px 섬세한 보더의 정갈한 알약형 라벨' },
    { id: 'BDG-04', name: '엔지니어링 슬래시(//) 코드 라벨', cls: 'f-bdg bdg-04', desc: '박스 없이 // 기호와 브랜드 컬러로 구획하는 테크니컬 캡션' },
    { id: 'BDG-05', name: '솔리드 잉크 스탬프 블록', cls: 'f-bdg bdg-05', desc: '고대비 반전 사각 블록 안에 찍힌 선명한 이슈 태그' },
    { id: 'BDG-06', name: '미니멀 언더라인 북마크', cls: 'f-bdg bdg-06', desc: '하단 1.5px 브랜드 컬러 실선만으로 절제미를 살린 라벨' },
    { id: 'BDG-07', name: '소프트 틴트 아틀리에 칩', cls: 'f-bdg bdg-07', desc: '브랜드 컬러 12% 반투명 틴트 배경의 부드러운 마이크로 칩' },
    { id: 'BDG-08', name: '뮤지엄 더블 보더 클래식 씰', cls: 'f-bdg bdg-08', desc: '이중 테두리와 세리프 서체가 어우러진 전통 아카이브 인장' },
    { id: 'BDG-09', name: '호리즌탈 리드 라인 인덱스', cls: 'f-bdg bdg-09', desc: '좌측 22px 수평 가이드선과 이어지는 건축 섹션 타이틀러' },
    { id: 'BDG-10', name: '블루프린트 대시드 스펙 태그', cls: 'f-bdg bdg-10', desc: '점선 테두리로 감싼 프로토타입·설계 도면 스타일 라벨' }
  ],

  preloader: [
    { id: 'PRE-01', name: '상단 레이저 스크롤 프로그레스 바', mode: 'laser', desc: '스크롤 진행률(0~100%)에 맞춰 최상단에 빛나는 3px 액센트 게이지 표시' },
    { id: 'PRE-02', name: '우측 상단 실시간 스크롤 % 챕터 필', mode: 'pctpill', desc: '현재 읽고 있는 페이지 진행률을 모노스페이스 숫자로 표시하는 인디케이터' },
    { id: 'PRE-03', name: '우측 엣지 섹션 도트 내비게이션 레일', mode: 'dotrail', desc: '히어로·벤토·갤러리·예약 섹션으로 원클릭 점프하는 우측 도트 레일' },
    { id: 'PRE-04', name: '스플릿 커튼 00—100% 인트로 언베일 (Awwwards풍)', mode: 'splitCurtain', desc: '장착 또는 재생 시 좌우 장막이 카운터와 함께 갈라지며 첫 화면을 극적으로 공개' },
    { id: 'PRE-05', name: '메종 엠블럼 골드 인장 페이드 인트로', mode: 'monogramCurtain', desc: '어두운 벨벳 배경 위 브랜드 워드마크가 빛난 뒤 본문으로 디졸브 전환' },
    { id: 'PRE-06', name: '4단 아키텍처 블라인드 셔터 언베일', mode: 'shutterCurtain', desc: '4개의 수직 건축 컬럼이 시차를 두고 위로 걷히며 페이지가 열리는 연출' },
    { id: 'PRE-07', name: '듀얼 레이저 + 섹션 도트 풀 패키지', mode: 'combo', desc: '상단 스크롤 레이저 바와 우측 빠른 점프 도트 레일을 동시에 활성화' },
    { id: 'PRE-08', name: '인디케이터·인트로 없음 (클린 모드)', mode: 'none', desc: '부가 스크롤 게이지 없이 순수 페이지 레이아웃만 유지' }
  ],

  widget: [
    { id: 'WGT-01', name: '프로스티드 글래스 플로팅 독 (macOS풍)', desc: '화면 하단에 떠 있는 반투명 유리 내비게이션 & 빠른 예약 독',
      render: (w) => `<div style="position:sticky;bottom:18px;z-index:30;display:flex;justify-content:center;pointer-events:none;padding:0 16px;">
        <div style="pointer-events:auto;display:inline-flex;align-items:center;gap:18px;padding:8px 10px 8px 20px;border-radius:999px;background:rgba(15,17,22,0.86);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.18);color:#F8FAFC;font-size:12px;font-weight:600;box-shadow:0 20px 50px rgba(0,0,0,0.38);">
          <span style="opacity:0.95;font-weight:700;">${w.brand}</span>
          <span class="hide-narrow" style="opacity:0.7;cursor:pointer" onclick="document.getElementById('sec-feature')?.scrollIntoView({behavior:'smooth'})">${w.nav[0]}</span>
          <span class="hide-narrow" style="opacity:0.7;cursor:pointer" onclick="document.getElementById('sec-gallery')?.scrollIntoView({behavior:'smooth'})">${w.nav[1]}</span>
          <span class="hide-narrow" style="opacity:0.7;cursor:pointer" onclick="document.getElementById('sec-pricing')?.scrollIntoView({behavior:'smooth'})">${w.nav[3]}</span>
          <button type="button" onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})" style="background:var(--accent);color:var(--accent-fg);border:none;padding:8px 16px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;">${w.ctaPrimary} →</button>
        </div>
      </div>` },
    { id: 'WGT-02', name: '1:1 실시간 컨시어지 컨설테이션 버블', desc: '우측 하단에 고정되는 전담 컨시어지 직통 상담 버튼',
      render: (w) => `<div style="position:sticky;bottom:18px;z-index:30;display:flex;justify-content:flex-end;pointer-events:none;padding:0 24px;">
        <button type="button" onclick="showStudioToast('전담 컨시어지 데스크와 실시간 연결되었습니다.')" style="pointer-events:auto;display:inline-flex;align-items:center;gap:10px;padding:12px 20px;border-radius:999px;background:var(--fg);color:var(--bg);border:1px solid var(--border);font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 18px 40px rgba(0,0,0,0.28);">
          <span style="width:8px;height:8px;border-radius:999px;background:#10B981;box-shadow:0 0 0 4px rgba(16,185,129,0.25);"></span>
          <span>${w.brand} 1:1 컨시어지 문의</span>
        </button>
      </div>` },
    { id: 'WGT-03', name: '하단 풀와이드 원클릭 예약 바 (Aman풍)', desc: '호텔·파인다이닝에서 전환율이 가장 높은 하단 고정 예약 스트립',
      render: (w) => `<div style="position:sticky;bottom:0;z-index:30;background:var(--surface);border-top:1px solid var(--border);padding:12px 32px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 -12px 36px rgba(0,0,0,0.08);">
        <div style="display:flex;align-items:center;gap:16px;font-size:13px;">
          <strong>${w.brand}</strong>
          <span class="hide-narrow" style="color:var(--sub);font-size:12px;">${w.edition} · 잔여 프라이빗 슬롯 오픈</span>
        </div>
        <button type="button" onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})" style="background:var(--accent);color:var(--accent-fg);border:none;padding:10px 22px;border-radius:var(--radius);font-size:12px;font-weight:700;cursor:pointer;">${w.ctaPrimary} →</button>
      </div>` },
    { id: 'WGT-04', name: '회전 아카이브 정품 인장 (Rotating Seal)', desc: '우측 하단에서 유려하게 360° 회전하는 원형 타이포그래피 스탬프',
      render: () => `<div style="position:sticky;bottom:20px;z-index:30;display:flex;justify-content:flex-end;pointer-events:none;padding:0 24px;">
        <div onclick="document.getElementById('sec-form')?.scrollIntoView({behavior:'smooth'})" style="pointer-events:auto;cursor:pointer;width:78px;height:78px;border-radius:999px;background:var(--surface);border:1.5px solid var(--fg);color:var(--fg);display:flex;align-items:center;justify-content:center;text-align:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;line-height:1.25;box-shadow:0 12px 30px rgba(0,0,0,0.2);animation:spinSeal 16s linear infinite;">
          OFFICIAL<br/>ARCHIVE<br/>2026 ✦
        </div>
      </div>` },
    { id: 'WGT-05', name: 'Web Audio 앰비언트 사운드스케이프 신디사이저', desc: '클릭 시 실제 부드러운 공간 화음(Ambient Pad)을 생성·재생하는 사운드 바',
      render: () => `<div style="position:sticky;bottom:18px;z-index:30;display:flex;justify-content:flex-start;pointer-events:none;padding:0 24px;">
        <button type="button" onclick="toggleAmbientSynth(this)" style="pointer-events:auto;display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:var(--surface);border:1px solid var(--border);color:var(--fg);font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,0.16);">
          <span style="color:var(--accent);">♫</span>
          <span class="st-lbl">AMBIENT SOUND · CLICK TO PLAY</span>
        </button>
      </div>` },
    { id: 'WGT-06', name: '한국형 비즈니스 퀵 액션 독 (카톡·네이버예약·전화)', desc: '국내 로컬 고객 문의 전환에 최적화된 3버튼 플로팅 바',
      render: () => `<div style="position:sticky;bottom:18px;z-index:30;display:flex;justify-content:flex-end;pointer-events:none;padding:0 24px;">
        <div style="pointer-events:auto;display:inline-flex;gap:6px;padding:6px;border-radius:999px;background:rgba(15,17,22,0.9);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.16);box-shadow:0 16px 36px rgba(0,0,0,0.32);">
          <button type="button" onclick="showStudioToast('카카오톡 채널 실시간 상담창을 호출합니다.')" style="background:#FEE500;color:#191919;border:none;padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;">카톡 상담</button>
          <button type="button" onclick="showStudioToast('네이버 스마트플레이스 예약으로 연결합니다.')" style="background:#03C75A;color:#FFFFFF;border:none;padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;">네이버 예약</button>
          <button type="button" onclick="showStudioToast('컨시어지 직통 전화 연결: 02-555-8200')" style="background:#FFFFFF;color:#090A0D;border:none;padding:8px 14px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;">직통 전화</button>
        </div>
      </div>` },
    { id: 'WGT-07', name: '프라이빗 바우처 코드 클립보드 티켓', desc: '클릭 즉시 우대 바우처 코드가 복사되는 플로팅 티켓',
      render: () => `<div style="position:sticky;bottom:18px;z-index:30;display:flex;justify-content:flex-end;pointer-events:none;padding:0 24px;">
        <button type="button" onclick="navigator.clipboard?.writeText('FORMA2026');showStudioToast('VIP 바우처 코드 FORMA2026 이 복사되었습니다.')" style="pointer-events:auto;padding:10px 18px;border-radius:8px;background:var(--surface);border:1.5px dashed var(--accent);color:var(--fg);font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 14px 32px rgba(0,0,0,0.16);">
          VIP BENEFIT: <span style="color:var(--accent);">FORMA2026</span> [복사]
        </button>
      </div>` },
    { id: 'WGT-08', name: '실시간 예약 완료 소셜프루프 토스트', desc: '좌측 하단에 절제된 형태로 표시되는 실시간 예약 현황 카드',
      render: (w) => `<div style="position:sticky;bottom:18px;z-index:30;display:flex;justify-content:flex-start;pointer-events:none;padding:0 24px;">
        <div style="padding:10px 16px;border-radius:12px;background:var(--surface);border:1px solid var(--border);font-size:12px;display:inline-flex;align-items:center;gap:10px;box-shadow:0 16px 38px rgba(0,0,0,0.14);">
          <span style="width:8px;height:8px;border-radius:999px;background:var(--accent);"></span>
          <span>방금 <strong>서울 한남동 고객님</strong>께서 <span style="color:var(--accent);font-weight:700;">${w.works[0].title}</span> 일정을 확정하셨습니다.</span>
        </div>
      </div>` },
    { id: 'WGT-09', name: '글로벌 통화 · 다국어 라이브 스위처 바', desc: '클릭 시 안내 통화(KRW / USD / JPY / EUR)가 전환되는 글로벌 위젯',
      render: () => `<div style="position:sticky;bottom:18px;z-index:30;display:flex;justify-content:flex-end;pointer-events:none;padding:0 24px;">
        <div style="pointer-events:auto;padding:6px 10px;border-radius:999px;background:var(--surface);border:1px solid var(--border);font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;display:inline-flex;gap:4px;box-shadow:0 12px 28px rgba(0,0,0,0.16);">
          ${[['KR · ₩','KRW (원화) 기준으로 표시합니다.'],['EN · $','USD ($1 = ₩1,380) 환율 안내가 활성화되었습니다.'],['JP · ¥','JPY (엔화) 글로벌 안내 모드입니다.'],['FR · €','EUR (유로화) 글로벌 안내 모드입니다.']].map(([lbl,msg],i)=>`<button type="button" onclick="this.parentElement.querySelectorAll('button').forEach(b=>b.style.color='var(--sub)');this.style.color='var(--accent)';showStudioToast('${msg}');" style="background:transparent;border:none;color:${i===0?'var(--accent)':'var(--sub)'};padding:4px 8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;">${lbl}</button>`).join('')}
        </div>
      </div>` },
    { id: 'WGT-10', name: '플로팅 위젯 없음 (퓨어 캔버스)', desc: '하단 고정 요소 없이 본문 레이아웃과 푸터의 조형미에 집중',
      render: () => `` }
  ]
};
