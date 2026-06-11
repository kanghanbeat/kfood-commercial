# kfood-service Planning Document

> **Summary**: 한국 방문 외국인을 위한 K푸드 Travel Tracker + SEO 콘텐츠 플랫폼 (Phase 1 본진 — A 풀 + C 비회원)
>
> **Project**: K푸드 플랫폼 (K-Food Curation Platform)
> **Version**: 0.1
> **Author**: 솔 (PM/콘텐츠/디자인), 한빛 (코드/대표)
> **Date**: 2026-06-08
> **Status**: Draft — Checkpoint 1·2 완료, Design 단계 대기

---

## Executive Summary

| 관점 | 내용 |
|---|---|
| **Problem** | 한국 방문 외국인은 K푸드 정보를 인스타·구글·블로그에 분산 저장. 여행 중 음식을 "기록"하고 친구에게 "추천"할 단일 도구 없음. |
| **Solution** | 50종+ K푸드 도감(체크리스트) + 여행 종료 자동 인포그래픽(자랑용 이미지) + 친구 추천 URL = 회원 가치(A). 음식·지역별 검색 유입 페이지 = 비회원 가치(C). |
| **Function-UX Effect** | 구글 검색 → 비회원 페이지 → 여행 중 가입 → 도감 체크 → 여행 종료 인포그래픽 공유 → 친구 추천 URL → 다음 여행자 유입. **viral 루프 + 게이미피케이션 일체화**. 모바일 First, 영어 우선, SNS OAuth로 가입 마찰 제거. |
| **Core Value** | "한국 여행의 K푸드 경험을 기록·공유 가능한 자산으로 바꾼다." |

---

## Context Anchor

> 본 anchor는 Design/Do/Check 문서에 자동 전파되어 세션 간 맥락 일관성을 유지함.

| 키 | 값 |
|---|---|
| **WHY** | 2026 외국인 입국 1,700만명 시장 + SNS→자사 사이트→재방문 퍼널 검증 (PRD §2) |
| **WHO** | Phase 1 = 한국 방문 외국인 / Beachhead = K-Pop·K-Drama 팬덤 영어권 20~30세 첫 여행자 (PRD §6) |
| **RISK** | (R1) 인포그래픽 평범 = 가입 실패 / (R2) 한빛 어플 SPOF / (R3) **인플루언서 예산 0 = 콜드 스타트 채널 제한** / (R4) 1인 콘텐츠·디자인 부담 |
| **SUCCESS** | 6개월 게이트 (베이스): 회원 800명 · UV 월 6,000 · D30 retention 15% · impressions 누적 300만 (PRD §14) |
| **SCOPE** | In: A 풀버전 + C 비회원 콘텐츠 + SNS 5채널. Out: B 커뮤니티(6개월 후), BM(Phase 2~3), 내부 대시보드, 캐릭터·브랜딩 |

---

## 1. Overview

### 1.1 Purpose

한국 방문 외국인이 **여행 중 K푸드 경험을 기록**하고, **여행 후 자랑·공유**할 수 있는 단일 도구를 제공한다. 이를 통해:

- SNS → 자사 사이트 → 회원가입 → 재방문 퍼널 검증 (6개월)
- 검증 후 Phase 2부터 BM(제휴·광고·예약 수수료) 단계적 도입

### 1.2 Background

- 사용자 (PM/콘텐츠) 본인은 한국 음식 콘텐츠를 다년간 다뤄왔고 SNS·디자인 운영 가능
- 한빛(대표·개발자)이 별도 어플 초기 설계 완료 (저장소: `kanghanbeat/kfood-codex-os` — 정합도 매핑 필요)
- 내부 대시보드(SNS 트렌드·콘텐츠 기획·촬영 기록)가 콘텐츠 제작 인프라로 가동 중

### 1.3 Related Documents

- **PRD** (원본): `docs/00-pm/kfood-service.prd.md` (PM Agent Team 16섹션, 32KB)
- **Deep-Dive Spec**: `서비스기획/spec-service-bm.md` (7대 결정 + 5 Reviewer Concerns)
- **Workflow Blueprint**: `kfood_workflow.html` (6단계 BM 흐름, 3 모듈, 5단계 플로우)
- **Project Rules**: `CLAUDE.md` (디자인 #4D2475, Pretendard, 톤 가이드)
- **한빛 어플 저장소**: `https://github.com/kanghanbeat/kfood-codex-os` (private 또는 미공개 — 한빛에게 접근 권한 요청 필요)

---

## 2. Scope

### 2.1 In Scope (P0 — 출시 필수, P1 — 출시 후 4주 내)

**P0 (Phase 1 본진 — 6개월 안에 출시)**

- [ ] K푸드 50종 도감 (체크 + 사진 + 메모)
- [ ] 테마/지역별 챌린지 (예: "서울 5대 김밥", "야시장 6종")
- [ ] 방문 식당 즐겨찾기·기록·메모
- [ ] 여행 종료 자동 인포그래픽 생성 (1080×1920 인스타 스토리 규격, PNG 다운로드)
- [ ] 친구 추천 시트 URL 생성·공유 (비회원도 열람 가능)
- [ ] 비회원 SEO 페이지: `/food/{name}` (50종), `/region/{name}` (서울·부산·제주 등)
- [ ] SNS OAuth 가입 (구글·페이스북·X 중 최소 2개)
- [ ] 모바일 First (PWA 권장 — 오프라인 캐시로 지하철·기내 대응)
- [ ] 영어 우선 UI

**P1 (출시 후 4주 내)**

- [ ] 챌린지 완료 시 뱃지 시스템
- [ ] 지도에서 체크한 식당 한눈에 보기
- [ ] 음식 페이지에 한/영 메뉴명 + 발음 가이드

### 2.2 Out of Scope (Phase 2 이후로 미룸)

- 영문 커뮤니티 (B 모듈) — 6개월 게이트 통과 후 시드 도입
- 해외 거주 외국인 모드 — Phase 2
- 수익모델 (제휴·광고·예약 수수료) — Phase 2부터 단계적
- 내부 대시보드 통합 — 별도 운영 유지
- 캐릭터·브랜딩 — 별도 단계
- 결제·예약 인프라 — Phase 3
- 한국인·재한 외국인 단골 타겟

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|---|---|---|
| FR-01 | 비회원이 `/food/{name}` 페이지에 도달 가능 (구글 검색 유입 가정) | P0 | Pending |
| FR-02 | 비회원이 `/region/{name}` 페이지에 도달 가능 | P0 | Pending |
| FR-03 | SNS OAuth 가입 — 구글·페이스북·X 중 최소 2개 (이메일·비번 입력 없음) | P0 | Pending |
| FR-04 | 회원이 50종 K푸드 도감 그리드에서 체크·사진·메모 입력 가능 | P0 | Pending |
| FR-05 | 회원이 챌린지 페이지에서 참여·진행률 추적 가능 | P0 | Pending |
| FR-06 | 회원이 식당 즐겨찾기·메모 입력 가능 | P0 | Pending |
| FR-07 | 여행 종료 시 자동 인포그래픽 생성 (1080×1920 PNG) → 다운로드 + 공유 URL | P0 | Pending |
| FR-08 | 친구 추천 시트 URL 생성 — 비회원도 열람, 가입 시 본인 도감으로 import | P0 | Pending |
| FR-09 | 모바일 First UI (PWA 권장, 오프라인 캐시) | P0 | Pending |
| FR-10 | 영어 기본 UI (한국어는 백오피스용) | P0 | Pending |
| FR-11 | 챌린지 완료 시 뱃지 부여 | P1 | Pending |
| FR-12 | 지도에서 체크한 식당 표시 | P1 | Pending |
| FR-13 | 음식 페이지 한/영 메뉴명 + 발음 | P1 | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|---|---|---|
| **Performance** | 인포그래픽 Canvas 렌더링 5초 이내 | 모바일 LTE 환경 측정 |
| **Performance** | 음식 상세 페이지 LCP < 2.5초 (SEO 필수) | Lighthouse |
| **Mobile** | 모바일 점유율 > 80% 예상 (외국인 여행 중 사용) | GA 디바이스 분석 |
| **Privacy** | 외국인 데이터 GDPR 준수 (EU 거주자 가정) | privacy.md 작성 + 쿠키 배너 |
| **Accessibility** | WCAG 2.1 AA 이상 (영문 시각장애 사용자 가정) | axe-core 자동 검사 |
| **SEO** | 음식·지역 페이지 메타·구조화 데이터(Schema.org Recipe·LocalBusiness) | Google Search Console |
| **Localization** | 모든 사용자향 카피 영문 검수 (1인 운영 = AI 보조 + 자체 검수) | 콘텐츠 발행 전 LLM 1차 + 본인 검수 |
| **Design** | 메인 컬러 #4D2475 (디핑퍼플) / Pretendard 폰트 (CLAUDE.md 디자인 기준) | 디자인 토큰 잠금 |

---

## 4. Success Criteria

### 4.1 Definition of Done (Phase 1 종료 조건 — 6개월 시점)

- [ ] FR-01 ~ FR-10 모두 출시·배포 완료
- [ ] FR-11 ~ FR-13 (P1) 출시 후 4주 내 배포
- [ ] SNS 5채널 모두 활성 운영 (주 1편 이상)
- [ ] 음식·지역 페이지 50종+ × 영문 SEO 완료
- [ ] privacy.md + 쿠키 배너 + 약관 영문 배포
- [ ] 베타 사용자 30명 인터뷰 완료 (가입 동기 검증 = PRD E1 실험)

### 4.2 Quality Criteria (KPI 베이스라인 — PRD §14 채택)

| # | 퍼널 단계 | 지표 | 3개월 1차 게이트 | 6개월 베이스 | 6개월 스트레치 |
|---|---|---|---|---|---|
| 1 | 도달 | SNS 5채널 외국인 impressions 누적 | 50만 | **300만** | 500만 |
| 2 | 인게이지먼트 | 콘텐츠당 평균 좋아요·댓글·저장 | 30 | **100** | 200 |
| 3 | 자사 유입 | 월 외국인 UV | 2,000 | **6,000** | 1.5만 |
| 4 | 가입 | 누적 회원 / UV→가입 전환 | 200명 / 5% | **800명 / 8%** | 1,500명 / 10% |
| 5 | 재방문 | D7 / D30 retention | 25% / 10% | **30% / 15%** | 35% / 20% |

**3개월 미달 시**: 콘텐츠 톤·채널 재조정 (전체 본진 폐기 X)
**6개월 베이스 미달 시**: 본진 메커니즘 재설계 (E1·E3 가설 폐기 검토)
**6개월 베이스 달성 시**: Phase 2 진입 (B 커뮤니티 시드 + 제휴 BM 1차)

---

## 5. Risks and Mitigation

| ID | Risk | 영향 | 가능성 | 조기 신호 | 대응 |
|---|---|---|---|---|---|
| **R1** | 인포그래픽 평범 → 가입 동기 실패 (전제 C) | 高 | 中 | E1 실험 가입 CTR < 40% | 인포그래픽 시안 2~3종 본인 직접 디자인 → 초기 30명 베타 A/B. 부족하면 본인 시간 추가 투입. |
| **R2** | 한빛 어플 진척 지연 → 본진 미출시 (SPOF) | 高 | 中 | 3개월 시점 alpha 미출시 | **Plan B**: A의 일부(도감·체크)는 정적 HTML로 사용자 본인이 우선 출시. 인포그래픽·친구추천만 어플 종속. |
| **R3** | **예산 0 → 인플루언서 협찬 불가 → 콜드 스타트 채널 부족** | 高 | **高** | 6주차 회원 30명 미만 | PRD GTM 재설계 (§7 변경). 무료 채널만: 본인 유튜브 + Reddit r/koreatravel + 인스타 해시태그 + 무료 PDF + r/kdrama. |
| **R4** | **1인 콘텐츠·디자인 부담 과중** (사용자 본인이 콘텐츠+SNS+디자인 동시 담당) | 中 | **高** | 주간 콘텐츠 발행 1편 미만 지속 | 원소스 멀티유즈 강화 (1주제 → 5채널 자동 변환). AI 보조 강화 (영문 검수 LLM + 인포그래픽 템플릿 자동화). |
| **R5** | 외국인 알고리즘 도달 실패 (한국 IP 제약) | 中 | 中 | 1주차 외국인 impression 비율 < 30% | 영문 캡션·해시태그 자체 검수 강화. Reddit 침투 비중 ↑. |
| **R6** | 여행 후 retention 0 → viral 미작동 (전제 F) | 中 | 中 | 인포그래픽 공유율 < 10% | 인포그래픽에 친구 추천 URL 1-click 통합. Phase 1 후반 이메일/푸시 알림. |
| **R7** | 영문 검수 외주 불가 → 카피 어색 → 신뢰도 하락 | 中 | 中 | 외국인 베타 인터뷰 시 카피 지적 | AI(Claude) 영문 검수 + 외국인 베타 사용자 30명에게 카피 피드백 요청. |

> **수정된 GTM (예산 0 반영)**
> PRD §7.1의 5채널 중 "외국인 K푸드 유튜버 협업 ($5~10 CPL)"은 예산 부재로 **제거**. 대체 전략:
> - 본인 운영 유튜브 채널 콘텐츠 직접 제작 (촬영비만)
> - Reddit r/koreatravel + r/kdrama 가치 콘텐츠 게시 (시간만)
> - 인스타 K푸드 해시태그 컨테스트 (시간만)
> - 무료 PDF 가이드 "K-Drama Food 30" 배포 → 이메일 캡처
> - 외국인 인플루언서는 **무상 협업** 시도 (콘텐츠 교환·상호 노출)

---

## 6. Impact Analysis

> **본 항목은 K푸드 플랫폼 신규 출시 프로젝트로 기존 코드·데이터 변경 없음.**
> 단, 한빛 어플 진척 상황(`kfood-codex-os`) 정합도 매핑은 Design 단계 진입 직전 별도 작업 필요.

### 6.1 Changed Resources

| Resource | Type | Change Description |
|---|---|---|
| (해당 없음) | - | 신규 서비스, 기존 자산 변경 없음 |

### 6.2 Dependent Existing Assets

| Asset | 위치 | 의존 방식 |
|---|---|---|
| 내부 대시보드 식당 DB | `웹사이트/data/*.json` | Phase 1에서 식당·메뉴 시드 데이터로 export 필요 |
| K푸드 50종 시드 | `데이터수집/kfood_50_foods_list.md` | 도감 그리드 초기 데이터 |
| 디자인 토큰 | CLAUDE.md (#4D2475 등) | 외부 서비스 디자인 시스템 기본값 |
| 한빛 어플 초기 설계 | `kanghanbeat/kfood-codex-os` (접근 권한 요청 필요) | Plan B 분리 결정의 기준 |

### 6.3 Verification

- [ ] 한빛에게 `kfood-codex-os` 저장소 접근 권한 요청 + 진척 상황 회의
- [ ] 내부 대시보드 식당 DB 구조 확인 → 외부 서비스 import 포맷 협의
- [ ] K푸드 50종 시드 데이터 영문화 누락 항목 점검

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | 특성 | 추천 대상 | 선택 |
|---|---|---|:--:|
| Starter | 정적 HTML/CSS/JS | 포트폴리오·랜딩 | ☐ |
| **Dynamic** | 백엔드 + 회원·DB·API | 풀스택 웹앱, SaaS MVP | **☑** |
| Enterprise | 마이크로서비스·k8s | 대규모 시스템 | ☐ |

**선택 이유**: 회원·OAuth·DB·인포그래픽 생성·SEO 필요 → Dynamic. bkend.ai BaaS 검토 또는 자체 백엔드.

### 7.2 Key Architectural Decisions (Design 단계 확정)

> **다음 6개 결정은 Design 단계에서 한빛과 협의 후 확정. Plan에서는 옵션만 명시.**

| Decision | 옵션 | Plan 권장 | 확정 시점 |
|---|---|---|---|
| Framework | Next.js / React Vite / SvelteKit | Next.js (SEO·SSG 강함, PWA 지원) | Design |
| 회원·DB | bkend.ai BaaS / Supabase / Firebase | Supabase 또는 bkend.ai (영어 + GDPR 리전) | Design |
| OAuth | NextAuth.js / Supabase Auth / Clerk | Supabase Auth (DB 통합) | Design |
| 인포그래픽 생성 | 클라이언트 Canvas / 서버 headless | 클라이언트 Canvas (비용 0, 즉시 다운로드) | Design |
| 지도 | 구글 맵 / Mapbox / 네이버 | 구글 맵 (외국인 친화 + 영문) | Design |
| 친구 추천 | 공유 URL / 초대 코드 | **공유 URL** (마찰 최소) | Plan 확정 |
| 데이터 동기화 (내부 대시보드 → 외부) | API export / 정적 JSON 빌드 | 정적 JSON 주 1회 빌드 (단순·무료) | Design |

### 7.3 Clean Architecture (Dynamic 폴더 구조)

```
선택 레벨: Dynamic

src/
├── app/                  ← Next.js App Router
│   ├── (public)/          ← 비회원 SEO 페이지
│   │   ├── food/[name]/   ← FR-01
│   │   └── region/[name]/ ← FR-02
│   ├── (auth)/            ← 회원 페이지
│   │   ├── dashboard/     ← FR-04 도감
│   │   ├── challenges/    ← FR-05
│   │   ├── trips/[id]/    ← FR-07 인포그래픽
│   │   └── share/[token]/ ← FR-08 친구 추천
│   └── api/               ← 백엔드 API
├── components/            ← UI 컴포넌트
├── features/              ← 도감·챌린지·인포그래픽 등 기능 모듈
├── services/              ← OAuth, DB, 인포그래픽 Canvas 등
├── lib/                   ← 유틸·BaaS 클라이언트
└── types/                 ← TypeScript 타입
```

---

## 8. Convention Prerequisites

### 8.1 기존 컨벤션 점검

- [x] `CLAUDE.md` 프로젝트 규칙 있음 (디자인 토큰·톤 가이드)
- [ ] `docs/01-plan/conventions.md` 미존재 — Design 단계에서 생성
- [ ] ESLint·Prettier·TypeScript — 한빛 어플 진척 상황 확인 후 정렬

### 8.2 정의/검증 필요 컨벤션

| Category | 현재 | 정의 필요 | 우선순위 |
|---|---|---|:--:|
| Naming | 미정 | camelCase(JS) / kebab-case(URL·파일명) | High |
| Folder Structure | 미정 | §7.3 안 채택 | High |
| Import Order | 미정 | absolute > relative, type-only 분리 | Medium |
| Env Variables | 미정 | `NEXT_PUBLIC_*`, `DATABASE_URL`, `AUTH_SECRET`, OAuth 클라이언트 키 | High |
| Error Handling | 미정 | API 에러 → user-friendly 영문 토스트 | Medium |
| Localization | 미정 | i18n 키 영문 우선, 한국어 백오피스만 | Medium |

### 8.3 Environment Variables Needed (초안)

| Variable | Purpose | Scope |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | SEO·OAuth callback | Client |
| `DATABASE_URL` | BaaS 또는 자체 DB | Server |
| `AUTH_SECRET` | OAuth 세션 시크릿 | Server |
| `GOOGLE_OAUTH_CLIENT_ID` | 구글 가입 | Both |
| `META_OAUTH_CLIENT_ID` | 페이스북 가입 | Both |
| `X_OAUTH_CLIENT_ID` | X 가입 | Both |
| `GOOGLE_MAPS_API_KEY` | 지도 표시 | Both |
| `GA_MEASUREMENT_ID` | KPI 측정 | Client |

---

## 9. Next Steps

1. [ ] **한빛 회의** — `kfood-codex-os` 진척 상황 공유, 정합도 매핑, Plan B 합의 (1주 내)
2. [ ] **본 Plan 한빛 대표 승인** (1주 내)
3. [ ] **Design 단계 진입** — `/pdca design kfood-service`
   - 3 architecture options 검토 (Minimal / Clean / Pragmatic)
   - §7.2 6개 기술 결정 확정
   - 화면 와이어프레임 + Design Anchor (디자인 토큰 잠금)
4. [ ] E1 실험 (인포그래픽 시안 A/B) — Design 단계 첫 2주 내 본인 디자인 시안 3종 준비

---

## Version History

| Version | Date | Changes | Author |
|---|---|---|---|
| 0.1 | 2026-06-08 | 초안 — Deep-Dive Spec + PM PRD 통합 + 예산 0/1인 부담 반영 GTM 재설계 | 솔 |
